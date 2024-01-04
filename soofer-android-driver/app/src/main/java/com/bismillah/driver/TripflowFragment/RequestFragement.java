package com.bismillah.driver.TripflowFragment;


import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.widget.AppCompatButton;
import androidx.core.graphics.drawable.RoundedBitmapDrawable;
import androidx.core.graphics.drawable.RoundedBitmapDrawableFactory;
import androidx.fragment.app.FragmentManager;

import com.bismillah.driver.CommonClass.CommonData;
import com.bismillah.driver.Model.SendPhoneModel;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.BitmapImageViewTarget;
import com.google.firebase.database.DataSnapshot;
import com.bismillah.driver.CommonClass.BaseFragment;
import com.bismillah.driver.CommonClass.FontChangeCrawler;
import com.bismillah.driver.CommonClass.ProgressWheel;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.CommonClass.Utiles;
import com.bismillah.driver.FlowInterface.RequestInterface;
import com.bismillah.driver.Model.AcceptRequestModel;
import com.bismillah.driver.Model.DiclineRequest;
import com.bismillah.driver.Presenter.RequestPresenter;
import com.bismillah.driver.R;
import com.bismillah.driver.View.RequestView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.SQLOutput;
import java.util.HashMap;
import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;
import retrofit2.Response;

import static com.bismillah.driver.CommonClass.CommonData.RequestBoolean;
import static com.bismillah.driver.CommonClass.Utiles.clearInstance;


@SuppressLint("ValidFragment")
public class RequestFragement extends BaseFragment implements RequestView {


    @BindView(R.id.decline_request_txt)
    TextView declineRequestTxt;
    @BindView(R.id.map_view)
    ImageView mapView;
    @BindView(R.id.trip_type_txt)
    TextView tripTypeTxt;
    @BindView(R.id.service_txt)
    TextView serviceTxt;
    @BindView(R.id.accept_request_txt)
    AppCompatButton acceptRequestTxt;
    private String strAlready = "";
    @BindView(R.id.request_layout)
    LinearLayout requestLayout;
    @BindView(R.id.est_txt)
    TextView estTxt;
    @BindView(R.id.pickup_img)
    ImageView pickupImg;
    @BindView(R.id.pickup_address_txt)
    TextView pickupAddressTxt;
    @BindView(R.id.first_stop)
    TextView stop1;
    @BindView(R.id.second_stop)
    TextView stop2;
    @BindView(R.id.drop_img)
    ImageView dropImg;
    @BindView(R.id.destination_address_txt)
    TextView destinationAddressTxt;

    Unbinder unbinder;
    @BindView(R.id.progressBarTwo)
    ProgressWheel progressBarTwo;

    private DataSnapshot requestDatasnapshot;
    @BindView(R.id.date_time_txt)
    TextView dateTimeTxt;
    @BindView(R.id.km_txt)
    TextView kmTxt;
    @BindView(R.id.fare_txt)
    TextView fareTxt;
    @BindView(R.id.edtMake)
    TextView edtMake;
    @BindView(R.id.edtModel)
    TextView edtModel;
    @BindView(R.id.edtNumber)
    TextView edtNumber;
    @BindView(R.id.edtcolor)
    TextView edtcolor;
    @BindView(R.id.drop_layout)
    RelativeLayout dropLayout;
    @BindView(R.id.ltSecondDriver)
    LinearLayout ltSecondDriver;

    @BindView(R.id.stop_1)
    RelativeLayout stopone;

    @BindView(R.id.stop_2)
    RelativeLayout stoptwo;

    @SuppressLint("ValidFragment")
    public RequestFragement(DataSnapshot dataSnapshot) {
        this.requestDatasnapshot = dataSnapshot;
    }

    public RequestFragement() {

    }

    private boolean ScheduleRequest = false;
    private RequestInterface requestInterface;
    private Context context;
    private Activity activity;
    private MediaPlayer mySong;
    private FragmentManager fragmentManager;
    private Vibrator vibrator;
    private RequestPresenter requestPresenter;
    Dialog dialog;

    @TargetApi(Build.VERSION_CODES.M)
    @SuppressLint("SetTextI18n")
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.request_fragment, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        fragmentManager = getFragmentManager();
        assert activity != null;
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        SharedHelper.putKey(context, "trip_mode", "nomal");
        String mapBitmapString = SharedHelper.getKey(context, "mapImage");
        Bitmap mapBitmap = Utiles.StringToBitMap(mapBitmapString);
        if (mapBitmap != null) {

            setMapImage(mapBitmap);
        }
        progressBarTwo.setBarWidth(10);
        progressBarTwo.setRimWidth(10);
        progressBarTwo.setRimColor(Color.WHITE);
        progressBarTwo.resetCount();
        progressBarTwo.startSpinning();

        try {
            destinationAddressTxt.setText(IsNotNullable(requestDatasnapshot.child("drop_address").getValue()).toString());
            estTxt.setText(IsNotNullable(requestDatasnapshot.child("etd").getValue()).toString());
            serviceTxt.setText(IsNotNullable(requestDatasnapshot.child("vehicle").getValue()).toString());
            pickupAddressTxt.setText(IsNotNullable(requestDatasnapshot.child("picku_address").getValue()).toString());

            if (requestDatasnapshot.child("stop_one").getValue() != null){
                stopone.setVisibility(View.VISIBLE);
            }

            if (requestDatasnapshot.child("stop_two").getValue() != null){
                stoptwo.setVisibility(View.VISIBLE);
            }

            stop1.setText(IsNotNullable(requestDatasnapshot.child("stop_one").getValue()).toString());
            stop2.setText(IsNotNullable(requestDatasnapshot.child("stop_two").getValue()).toString());
            kmTxt.setText(IsNotNullable(requestDatasnapshot.child("totalKM").getValue()).toString());
            System.out.println("aa1 "+requestDatasnapshot.child("totalKM").getValue());
            fareTxt.setText(getString(R.string.total_fares) + IsNotNullable(requestDatasnapshot.child("totalFare").getValue()).toString());
            SharedHelper.putKey(context, "ride_type", IsNotNullable(requestDatasnapshot.child("triptype").getValue()).toString());
            System.out.println("enter the type" + IsNotNullable(requestDatasnapshot.child("triptype").getValue()).toString());
            SharedHelper.putKey(context,"vehicle_detail","false");

                if (requestDatasnapshot.child("safeRideData").child("safeRidestatus").getValue().equals("true")){
                    ltSecondDriver.setVisibility(View.VISIBLE);
                    edtMake.setText(IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("makename").getValue()).toString());
                    edtModel.setText(IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("model").getValue()).toString());
                    edtNumber.setText(IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("number").getValue()).toString());
                    edtcolor.setText(IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("vehiclecolor").getValue()).toString());
                    CommonData.CarMakeName = (requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("makename").getValue()).toString();
                    CommonData.CarModel = (requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("model").getValue()).toString();
                    CommonData.CarNumber = (requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("number").getValue()).toString();
                    CommonData.CarColor = (requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("vehiclecolor").getValue()).toString();
                    System.out.println("enter the aaa1"+CommonData.CarMakeName+" Model:: "+CommonData.CarModel+" Number:: "+CommonData.CarNumber+" Colour:: "+CommonData.CarColor);

                    SharedHelper.putKey(context, "carMakename", IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("makename").getValue()).toString());
                    SharedHelper.putKey(context, "carModel", IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("model").getValue()).toString());
                    SharedHelper.putKey(context, "carNumber", IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("number").getValue()).toString());
                    SharedHelper.putKey(context, "carColor", IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("vehiclecolor").getValue()).toString());
                    SharedHelper.putKey(context,"vehicle_detail","true");
                }else {
                    ltSecondDriver.setVisibility(View.GONE);
                }


            if (IsNotNullable(requestDatasnapshot.child("triptype").getValue()).toString().equalsIgnoreCase("rental")) {
                dropLayout.setVisibility(View.GONE);
            } else {
                dropLayout.setVisibility(View.VISIBLE);
            }
            try {
                if (!IsNotNullable(requestDatasnapshot.child("triptype").getValue()).toString().isEmpty()) {
                    tripTypeTxt.setVisibility(View.VISIBLE);
                    tripTypeTxt.setText(IsNotNullable(requestDatasnapshot.child("triptype").getValue()).toString());
                } else {
                    tripTypeTxt.setVisibility(View.GONE);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (requestDatasnapshot.child("request_type").getValue() != null) {
                if (Objects.requireNonNull(requestDatasnapshot.child("request_type").getValue()).toString().equalsIgnoreCase("rideLater")) {
                    ScheduleRequest = false;
                    dateTimeTxt.setVisibility(View.VISIBLE);
                    dateTimeTxt.setText(Objects.requireNonNull(requestDatasnapshot.child("datetime").getValue()).toString());
                } else {
                    ScheduleRequest = false;
                    dateTimeTxt.setVisibility(View.INVISIBLE);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        requestPresenter = new RequestPresenter(this);

        MediaCheck(true);
        if (mySong != null && mySong.isPlaying()) {
            mySong.stop();
            mySong = null;
        }
        if (vibrator != null && vibrator.hasVibrator()) {
            vibrator.cancel();
            vibrator = null;
        } else {
            if (vibrator == null) {
                Vibration();
            }
        }
        if (mySong == null) {
            Ringtone();
        } else {
            if (!mySong.isPlaying()) {
                Ringtone();
            }

        }
        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event

    private void Ringtone() {
        mySong = MediaPlayer.create(context, R.raw.sooffer_trip_call);
        //  mySong.setAudioStreamType(AudioManager.STREAM_MUSIC);
        mySong.setLooping(true);
        // mySong.setVolume(1, 1);
        mySong.start();
    }

    private void Vibration() {
        vibrator = (Vibrator) activity.getSystemService(Context.VIBRATOR_SERVICE);
        long[] pattern = {60, 120, 180, 240, 300, 360, 420, 480};
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createWaveform(pattern, 1));
        } else {

            assert vibrator != null;
            vibrator.vibrate(pattern, 1);

        }

    }

    @Override
    public void onDetach() {
        super.onDetach();
        RequestBoolean = false;
        System.out.println("on detach method");
        if (mySong != null && mySong.isPlaying()) {
            mySong.stop();
        }
        if (vibrator != null && vibrator.hasVibrator()) {
            vibrator.cancel();
            vibrator = null;
        }
        clearInstance();
    }


    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        RequestBoolean = false;
        System.out.println("ondestoyed");
        unbinder.unbind();
        MediaCheck(false);
        if (mySong != null && mySong.isPlaying()) {
            mySong.stop();
            mySong = null;
        }
        if (vibrator != null && vibrator.hasVibrator()) {
            vibrator.cancel();
            vibrator = null;
        }
        clearInstance();
    }

    @Optional
    @OnClick({R.id.decline_request_txt, R.id.accept_request_txt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.decline_request_txt:
                try {
                    requestPresenter.DiclineRequest(Objects.requireNonNull(requestDatasnapshot.child("request_id").getValue()).toString(), activity);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            case R.id.accept_request_txt:

                requestPresenter.AcceptRequest(Objects.requireNonNull(requestDatasnapshot.child("request_id").getValue()).toString(), activity);
                break;
        }
    }

    private void setMapImage(Bitmap mapImageBitmap) {

        try {
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            mapImageBitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);

            Glide.with(context).load(stream.toByteArray()).asBitmap().centerCrop().skipMemoryCache(true).into(new BitmapImageViewTarget(mapView) {
                @Override
                protected void setResource(Bitmap resource) {
                    RoundedBitmapDrawable circularBitmapDrawable = RoundedBitmapDrawableFactory.create(context.getResources(), resource);
                    circularBitmapDrawable.setCircular(true);
                    try {
                        mapView.setImageDrawable(circularBitmapDrawable);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

    }


    @Override
    public void OnSuccessAccept(Response<AcceptRequestModel> Response) {
        assert Response.body() != null;
        Utiles.CommonToast(activity, Response.body().getMessage());
        mySong.stop();
        if (Response.body().getIsDriver()){
            dialog = new Dialog(context);
            dialog.setContentView(R.layout.dialog_update_driver);
            dialog.show();
            dialog.setCancelable(true);
            EditText edtPhone = dialog.findViewById(R.id.edtPhoneNumber);
            Button btnSave = dialog.findViewById(R.id.btn_SaveImage);
            btnSave.setOnClickListener(v -> {
                String PhoneNumber = edtPhone.getText().toString().trim();
                if (PhoneNumber.length()!=0){
                    HashMap<String,String> map = new HashMap();
                    map.put("tripno",Response.body().getTripId());
                    map.put("phone",PhoneNumber);
                    map.put("requeststatus","Accepted");
                    requestPresenter.SendPhone(map, activity);
                }


            });
        }else {
            if (ScheduleRequest) {
                try {
                    assert Response.body() != null;
                    RequestBoolean = false;
                    requestInterface = (RequestInterface) activity;
                    requestInterface.ClearFragment();
                    RemoveFragment();
                } catch (Exception e) {
                    Log.e("tag", "Eception of request screen" + e.getMessage());
                }
                Utiles.ClearFirebase(context);
            } else {
                SharedHelper.putKey(context, "trip_id", Response.body().getTripId());
                Utiles.CreateFirebaseTripData(Response.body().getTripId(), context, "1");
                try {
                    requestInterface = (RequestInterface) activity;
                    requestInterface.TripFragment();
                    RemoveFragment();
                } catch (Exception e) {
                    Log.e("tag", "Eception of request screen" + e.getMessage());
                }
            }

        }

    }

    @Override
    public void onFailureAccept(Response<AcceptRequestModel> Response) {
        try {
            assert Response.errorBody() != null;
            mySong.stop();
            JSONObject errorjson = new JSONObject(Response.errorBody().string());
            if (errorjson.has("message")) {
                Utiles.displayMessage(getView(), context, errorjson.optString("message"));
            }
            RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }
        Utiles.ClearFirebase(context);
    }

    @Override
    public void onSuccessDicline(Response<DiclineRequest> Response) {
        try {
            mySong.stop();
            RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
        Utiles.ClearFirebase(context);
    }

    @Override
    public void onFailureDicline(Response<DiclineRequest> Response) {
        try {
            RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
        Utiles.ClearFirebase(context);
    }

    @Override
    public void OnScheduleSuccessAccept(Response<AcceptRequestModel> Response) {
        try {

            assert Response.body() != null;
            Utiles.CommonToast(activity, Response.body().getMessage());
            RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
        Utiles.ClearFirebase(context);
    }

    @Override
    public void onScheduleFailureAccept(Response<AcceptRequestModel> Response) {
        try {
            assert Response.errorBody() != null;
            JSONObject errorjson = new JSONObject(Response.errorBody().string());
            if (errorjson.has("message")) {
                Utiles.displayMessage(getView(), context, errorjson.optString("message"));
            }
            RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
        Utiles.ClearFirebase(context);
    }

    @Override
    public void OnSuccessSendPhone(Response<SendPhoneModel> Response) {
        assert Response.body() != null;
        dialog.dismiss();
        SharedHelper.putKey(context, "trip_id", Response.body().getTripId());
        Utiles.CreateFirebaseTripData(Response.body().getTripId(), context, "1");
        try {
            requestInterface = (RequestInterface) activity;
            requestInterface.TripFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
    }

    @Override
    public void onFailureSendPhone(Response<SendPhoneModel> response) {

    }

    @Override
    public void onPause() {
        super.onPause();
        System.out.println("enter the on pause method");
    }

    private void RemoveFragment() {
        try {
            fragmentManager.popBackStackImmediate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        System.out.println("enter the on stop method");
    }

    private Object IsNotNullable(Object values) {
        if (values == null) {
            values = "";
        }

        return values;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void MediaCheck(boolean isopen) {
        try {
            if (context != null) {
                AudioManager audio = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
                audio.setStreamVolume(0,0,0);
                assert audio != null;
                switch (audio.getRingerMode()) {
                    case AudioManager.RINGER_MODE_NORMAL:
                        break;
                    case AudioManager.RINGER_MODE_SILENT:
                        audio.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                        strAlready = "silent";
                        break;
                    case AudioManager.RINGER_MODE_VIBRATE:
                        audio.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                        strAlready = "vibrate";
                        break;
                    case AudioManager.ADJUST_MUTE:
                        audio.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                        strAlready = "mute";
                        break;
                }
                audio.setStreamVolume(
                        AudioManager.STREAM_MUSIC,
                        audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC),
                        0);
                if (!isopen) {
                    switch (strAlready) {
                        case "silent":
                            audio.setRingerMode(AudioManager.RINGER_MODE_SILENT);
                            break;
                        case "vibrate":
                            audio.setRingerMode(AudioManager.RINGER_MODE_VIBRATE);
                            break;
                        case "mute":
                            audio.setRingerMode(AudioManager.ADJUST_MUTE);
                            break;
                    }

                }

            }
        } catch (Exception e) {
            e.printStackTrace();
        }


    }
}

