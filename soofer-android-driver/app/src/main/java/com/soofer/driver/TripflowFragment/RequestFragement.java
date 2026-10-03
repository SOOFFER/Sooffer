package com.soofer.driver.TripflowFragment;

import static com.soofer.driver.CommonClass.CommonData.RequestBoolean;
import static com.soofer.driver.CommonClass.Utiles.clearInstance;
import static com.soofer.driver.CommonClass.Utiles.showErrorMessage;

import android.annotation.SuppressLint;
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
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.appcompat.widget.AppCompatButton;
import androidx.core.graphics.drawable.RoundedBitmapDrawable;
import androidx.core.graphics.drawable.RoundedBitmapDrawableFactory;
import androidx.fragment.app.FragmentManager;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.BitmapImageViewTarget;
import com.google.firebase.database.DataSnapshot;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.gson.Gson;
import com.soofer.driver.CommonClass.BaseFragment;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.Constants;
import com.soofer.driver.CommonClass.FontChangeCrawler;
import com.soofer.driver.CommonClass.ProgressWheel;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.FlowInterface.RequestInterface;
import com.soofer.driver.MainActivity;
import com.soofer.driver.Model.AcceptRequestModel;
import com.soofer.driver.Model.CancelTripModel;
import com.soofer.driver.Model.DiclineRequest;
import com.soofer.driver.Model.SendPhoneModel;
import com.soofer.driver.Presenter.CancelTripPresenter;
import com.soofer.driver.Presenter.RequestPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.CancelView;
import com.soofer.driver.View.RequestView;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;
import retrofit2.Response;


@SuppressLint("ALL")
@SuppressWarnings("ALL")
public class RequestFragement extends BaseFragment implements RequestView, CancelView {

    RequestInterface callRequest;
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
    @BindView(R.id.cancel_request_txt)
    AppCompatButton cancelRequestTxt;
    @BindView(R.id.request_layout)
    LinearLayout requestLayout;
    @BindView(R.id.est_txt)
    TextView estTxt;
    @BindView(R.id.pickup_address_txt)
    TextView pickupAddressTxt;
    @BindView(R.id.first_stop)
    TextView stop1;
    @BindView(R.id.second_stop)
    TextView stop2;
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

    @BindView(R.id.stopView)
    View stopView;

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
    public static MediaPlayer mySong;
    public static MediaPlayer mySong1;
    public static String strAlready = "";
    public static Dialog driverAssignDialog;

    private FragmentManager fragmentManager;
    public static Vibrator vibrator;
    private RequestPresenter requestPresenter;

    @SuppressLint("SetTextI18n")
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.request_fragment, container, false);
        unbinder = ButterKnife.bind(this, view);
        context = getContext();
        activity = getActivity();
        Constants.onResumeCalled = true;
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

            if (requestDatasnapshot.child("stop_one").getValue() != null) {
                stopone.setVisibility(View.VISIBLE);
            }

            if (requestDatasnapshot.child("stop_two").getValue() != null) {
                stoptwo.setVisibility(View.VISIBLE);
                stopView.setVisibility(View.VISIBLE);
            }

            stop1.setText(IsNotNullable(requestDatasnapshot.child("stop_one").getValue()).toString());
            stop2.setText(IsNotNullable(requestDatasnapshot.child("stop_two").getValue()).toString());
            kmTxt.setText(IsNotNullable(requestDatasnapshot.child("totalKM").getValue()).toString());
            System.out.println("aa1 " + requestDatasnapshot.child("totalKM").getValue());
            fareTxt.setText(getString(R.string.total_fares) + IsNotNullable(requestDatasnapshot.child("totalFare").getValue()).toString());
            SharedHelper.putKey(context, "ride_type", IsNotNullable(requestDatasnapshot.child("triptype").getValue()).toString());
            System.out.println("enter the type" + IsNotNullable(requestDatasnapshot.child("triptype").getValue()).toString());
            SharedHelper.putKey(context, "vehicle_detail", "false");

            if (requestDatasnapshot.child("safeRideData").child("safeRidestatus").getValue().equals("true")) {
                ltSecondDriver.setVisibility(View.VISIBLE);
                edtMake.setText(IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("makename").getValue()).toString());
                edtModel.setText(IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("model").getValue()).toString());
                edtNumber.setText(IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("number").getValue()).toString());
                edtcolor.setText(IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("vehiclecolor").getValue()).toString());
                CommonData.CarMakeName = (requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("makename").getValue()).toString();
                CommonData.CarModel = (requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("model").getValue()).toString();
                CommonData.CarNumber = (requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("number").getValue()).toString();
                CommonData.CarColor = (requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("vehiclecolor").getValue()).toString();
                System.out.println("enter the aaa1" + CommonData.CarMakeName + " Model:: " + CommonData.CarModel + " Number:: " + CommonData.CarNumber + " Colour:: " + CommonData.CarColor);

                SharedHelper.putKey(context, "carMakename", IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("makename").getValue()).toString());
                SharedHelper.putKey(context, "carModel", IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("model").getValue()).toString());
                SharedHelper.putKey(context, "carNumber", IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("number").getValue()).toString());
                SharedHelper.putKey(context, "carColor", IsNotNullable(requestDatasnapshot.child("safeRideData").child("safeRidevehicle").child("vehiclecolor").getValue()).toString());
                SharedHelper.putKey(context, "vehicle_detail", "true");
            } else {
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
        startMusicAlert();
        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        RequestBoolean = true;
    }

    public static void startMusicAlert() {
        stopMusicAlert();
        MediaCheck(true);
        Ringtone();
        Vibration();
    }

    public static void stopMusicAlert() {
        MediaCheck(false);
        if (mySong != null && mySong.isPlaying()) {
            mySong.stop();
            mySong = null;
        }
        if (vibrator != null && vibrator.hasVibrator()) {
            vibrator.cancel();
            vibrator = null;
        }
    }

    public static  void Ringtone() {
        try {
            mySong = MediaPlayer.create(MainActivity.activity, R.raw.sooffer_trip_call);
            mySong.setAudioStreamType(AudioManager.STREAM_MUSIC);
            mySong.setLooping(true);
            mySong.setVolume(1, 1);
            mySong.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static  void Vibration() {
        vibrator = (Vibrator) MainActivity.activity.getSystemService(Context.VIBRATOR_SERVICE);
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
        clearInstance();
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
    }

    public static void MediaCheck(boolean isopen) {
        try {
            if (MainActivity.activity != null) {
                AudioManager audio = (AudioManager) MainActivity.activity.getSystemService(Context.AUDIO_SERVICE);
                assert audio != null;
                switch (audio.getRingerMode()) {
                    case AudioManager.RINGER_MODE_NORMAL:
                        break;
                    case AudioManager.RINGER_MODE_SILENT:
                        audio.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                        RequestFragement.strAlready = "silent";
                        break;
                    case AudioManager.RINGER_MODE_VIBRATE:
                        audio.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                        RequestFragement.strAlready = "vibrate";
                        break;
                    case AudioManager.ADJUST_MUTE:
                        audio.setRingerMode(AudioManager.RINGER_MODE_NORMAL);
                        RequestFragement.strAlready = "mute";
                        break;
                }
                audio.setStreamVolume(
                        AudioManager.STREAM_MUSIC,
                        audio.getStreamMaxVolume(AudioManager.STREAM_MUSIC),
                        0);
                if (!isopen) {
                    switch (RequestFragement.strAlready) {
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


    @Optional
    @OnClick({R.id.decline_request_txt, R.id.accept_request_txt, R.id.cancel_request_txt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.decline_request_txt:
                stopMusicAlert();
                requestPresenter.DiclineRequest(Objects.requireNonNull(requestDatasnapshot.child("request_id").getValue()).toString(), activity);
                break;
            case R.id.cancel_request_txt:
                stopMusicAlert();
                CancelTripPresenter cancelTripPresenter = new CancelTripPresenter(this);
                cancelTripPresenter.CancelTrip(SharedHelper.getKey(context, "TwoDriverTripID"), activity, "");
                break;
            case R.id.accept_request_txt:
                stopMusicAlert();
                requestPresenter.AcceptRequest(Objects.requireNonNull(requestDatasnapshot.child("request_id").getValue()).toString(), activity);
                break;
        }
    }

    @Override
    public void OnSuccessfullyy(Response<CancelTripModel> Response) {
        if (Response.body().getSuccess()) {
            stopMusicAlert();
            CancelTrip();
            try {
                callRequest = (RequestInterface) getActivity();
                callRequest.ClearAllFragment();
                Utiles.ClearFirebase(activity.getApplicationContext());
                SharedHelper.putKey(activity.getApplicationContext(), "trip_id", "null");
                SharedHelper.putKey(activity.getApplicationContext(), "TwoDriverTripID", "");
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            Utiles.displayMessage(getView(), context, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void OnFailuree(Response<CancelTripModel> Response) {
        showErrorMessage(new Gson().toJson(Response.errorBody()), activity, getView());
    }

    public void CancelTrip() {
        Constants.Previousstatus = "5";
        DatabaseReference CancelReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(activity.getApplicationContext(), "TwoDriverTripID"));
        HashMap<String, Object> map = new HashMap<>();
        map.put("status", "5");
        map.put("cancelby", "driver");
        CancelReference.updateChildren(map);
    }

    public void setMapImage(Bitmap mapImageBitmap) {

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
        clearInstance();
    }



    @Override
    public void OnSuccessAccept(Response<AcceptRequestModel> Response) {
        assert Response.body() != null;
        stopMusicAlert();
        Utiles.CommonToast(activity, Response.body().getMessage());
        if (Response.body().getIsDriver()) {
            SharedHelper.putKey(context, "TwoDriverTripID", Response.body().getTripId());
            declineRequestTxt.setVisibility(View.GONE);
            acceptRequestTxt.setVisibility(View.GONE);
            cancelRequestTxt.setVisibility(View.VISIBLE);
            Utiles.CreateFirebaseTripData(Response.body().getTripId(), context, "");
            driverAssignDialog = new Dialog(context);
            driverAssignDialog.setContentView(R.layout.dialog_update_driver);
            Window window = driverAssignDialog.getWindow();
            if (window != null) {
                window.setLayout(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                );
            }
            driverAssignDialog.show();
            driverAssignDialog.setCancelable(true);
            EditText edtPhone = driverAssignDialog.findViewById(R.id.edtPhoneNumber);
            Button btnSave = driverAssignDialog.findViewById(R.id.btn_SaveImage);
            btnSave.setOnClickListener(v -> {
                String PhoneNumber = edtPhone.getText().toString().trim();
                if (PhoneNumber.length() != 0) {
                    HashMap<String, String> map = new HashMap();
                    map.put("tripno", Response.body().getTripId());
                    map.put("phone", PhoneNumber);
                    map.put("requeststatus", "Accepted");
                    requestPresenter.SendPhone(map, activity);
                }
            });
        } else {
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
                System.out.println("COMING HERE ScheduleRequest:::");
                Utiles.ClearFirebase(context);
            } else {
                RequestBoolean = false;
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
            stopMusicAlert();
            assert Response.errorBody() != null;
            JSONObject errorjson = new JSONObject(Response.errorBody().string());
            if (errorjson.has("message")) {
                Utiles.displayMessage(getView(), context, errorjson.optString("message"));
            }
            CommonData.RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }
        System.out.println("COMING HERE onFailureAccept:::");
        Utiles.ClearFirebase(context);
    }

    @Override
    public void onSuccessDicline(Response<DiclineRequest> Response) {
        try {
            stopMusicAlert();
            CommonData.RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
        System.out.println("COMING HERE onSuccessDicline:::");
        Utiles.ClearFirebase(context);
    }

    @Override
    public void onFailureDicline(Response<DiclineRequest> Response) {
        stopMusicAlert();
        try {
            CommonData.RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
        System.out.println("COMING HERE onFailureDicline:::");
        Utiles.ClearFirebase(context);
    }

    @Override
    public void OnScheduleSuccessAccept(Response<AcceptRequestModel> Response) {
        try {
            stopMusicAlert();
            assert Response.body() != null;
            Utiles.CommonToast(activity, Response.body().getMessage());
            CommonData.RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
        System.out.println("COMING HERE OnScheduleSuccessAccept:::");
        Utiles.ClearFirebase(context);
    }

    @Override
    public void onScheduleFailureAccept(Response<AcceptRequestModel> Response) {
        try {
            stopMusicAlert();
            assert Response.errorBody() != null;
            JSONObject errorjson = new JSONObject(Response.errorBody().string());
            if (errorjson.has("message")) {
                Utiles.displayMessage(getView(), context, errorjson.optString("message"));
            }
            CommonData.RequestBoolean = false;
            requestInterface = (RequestInterface) activity;
            requestInterface.ClearFragment();
            RemoveFragment();
        } catch (Exception e) {
            Log.e("tag", "Eception of request screen" + e.getMessage());
        }
        System.out.println("COMING HERE onScheduleFailureAccept:::");
        Utiles.ClearFirebase(context);
    }

    @Override
    public void OnSuccessSendPhone(Response<SendPhoneModel> Response) {
        stopMusicAlert();
        cancelRequestTxt.setVisibility(View.GONE);
        assert Response.body() != null;
        driverAssignDialog.dismiss();
        SharedHelper.putKey(context, "TwoDriverTripID","");
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
        stopMusicAlert();
        declineRequestTxt.setVisibility(View.GONE);
        acceptRequestTxt.setVisibility(View.GONE);
        cancelRequestTxt.setVisibility(View.VISIBLE);
        driverAssignDialog.dismiss();
        stopMusicAlert();
    }

    @Override
    public void onPause() {
        super.onPause();
        System.out.println("enter the on pause method");
    }

    private void RemoveFragment() {
        if (!activity.isDestroyed()) {
            if (fragmentManager != null) {
                try {
                    while (fragmentManager.getBackStackEntryCount() > 0) {
                        if (!activity.isDestroyed()) {
                            fragmentManager.popBackStackImmediate();
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void onStop() {
        super.onStop();
        System.out.println("enter the on stop method");
    }

    public Object IsNotNullable(Object values) {
        if (values == null) {
            values = "";
        }

        return values;
    }

}

