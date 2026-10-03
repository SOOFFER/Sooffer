package com.soofer.app.TripFlowScreen;

import static com.soofer.app.CommonClass.Constants.TripFlowFragmant;
import static com.soofer.app.CommonClass.Utiles.ClearFirebase;
import static com.soofer.app.CommonClass.Utiles.NullPointer;
import static com.soofer.app.CommonClass.Utiles.clearInstance;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.soofer.app.Activity.ChatActivity;
import com.soofer.app.Activity.VoiceCallActivity;
import com.soofer.app.Adapter.CancelReasonAdapter;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Constants;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.EventBus.TripStatus;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.CancelReasonModel;
import com.soofer.app.Model.CancelTripModel;
import com.soofer.app.Model.TripFlowModel;
import com.soofer.app.Presenter.CancelTripPresenter;
import com.soofer.app.Presenter.TripFlowPresenter;
import com.soofer.app.R;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.CancelView;
import com.soofer.app.View.TripFlowView;
import com.google.android.material.imageview.ShapeableImageView;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.Optional;
import butterknife.Unbinder;
import retrofit2.Response;



public class TripFlowFragment extends BaseFragment implements CancelView, TripFlowView , CancelReasonAdapter.CancelLisioner{

    private List<CancelReasonModel> cancelReasonModels;

    @BindView(R.id.driverVehicleImage)
    ImageView driverVehicleImage;

    @BindView(R.id.driver_profile_image)
    ShapeableImageView driverProfileImage;

    @BindView(R.id.driver_rating)
    TextView driverRating;

    @BindView(R.id.driver_name)
    TextView driverName;

    @BindView(R.id.number_plate_txt)
    TextView numberPlateTxt;

    @BindView(R.id.car_category)
    TextView carCategory;

    @BindView(R.id.tvStatus)
    TextView tvStatus;

    @BindView(R.id.otp_txt)
    TextView otpTxt;
    @BindView(R.id.cancel_imgbtn)
    ImageButton cancelImgBtn;
    Unbinder unbinder;
    CallRequest callRequest;
    Response<TripFlowModel> Response;

    private String tripStatus = "";
    protected static Fragment fragment;

    public TripFlowFragment() {
        // Required empty public constructor
    }

    private Activity activity;
    private Context context;
    private String riderRating;
    private AlertDialog cancelAlert;
    private static DatabaseReference CancelReason;
    private static ChildEventListener CancelReasonListioner;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    private String strPhoneNumber;
    View view;

    private Handler tripIdHandler;
    private int tripIdRetryCount = 0;
    private static final int MAX_TRIP_ID_RETRIES = 20;
    private static final long TRIP_ID_RETRY_INTERVAL = 1500;

    private void fetchTripDetails(final TripFlowPresenter tripFlowPresenter) {
        if (!isAdded() || context == null) {
            return;
        }
        String tripId = SharedHelper.getKey(context, "trip_id");
        if (tripId != null && !tripId.isEmpty() && !tripId.equalsIgnoreCase("null")) {
            if (tripIdHandler != null) {
                tripIdHandler.removeCallbacksAndMessages(null);
            }
            tripFlowPresenter.TripFlowApi(tripId, activity);
            return;
        }
        if (tripIdRetryCount >= MAX_TRIP_ID_RETRIES) {
            Utiles.displayMessage(getView(), activity, "Trip details not found. Please try again.");
            return;
        }
        tripIdRetryCount++;
        if (tripIdHandler == null) {
            tripIdHandler = new Handler(Looper.getMainLooper());
        }
        tripIdHandler.postDelayed(() -> fetchTripDetails(tripFlowPresenter), TRIP_ID_RETRY_INTERVAL);
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_trip_flow, container, false);
        if (view != null) {
            ViewGroup parent = (ViewGroup) view.getParent();
            if (parent != null) {
                parent.removeView(view);
            }

        }
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        tvStatus.setSelected(true);
        cancelReasonModels = new ArrayList<>();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        TripFlowPresenter tripFlowPresenter = new TripFlowPresenter(this);
        fetchTripDetails(tripFlowPresenter);
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        if (tripIdHandler != null) {
            tripIdHandler.removeCallbacksAndMessages(null);
            tripIdHandler = null;
        }
        clearInstance();
        if(ChatActivity.activity !=null) {
            ChatActivity.activity.finish();
        }
        try {
            if (cancelAlert != null && cancelAlert.isShowing()) {
                cancelAlert.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Optional
    @OnClick({R.id.message_imgbtn, R.id.cancel_imgbtn, R.id.call_imgbtn, R.id.share_imgbtn})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.call_imgbtn:
                CalltoDriver();
                break;
            case  R.id.message_imgbtn:
                DriverMessage();
                break;
            case R.id.cancel_imgbtn:
                fragment = new CancelFragment();
                FragmentCalling(fragment);
                break;
            case R.id.share_imgbtn:
                SocialShare();
                break;
        }
    }

    @Override
    public void OnSuccessfully(Response<CancelTripModel> Response) {
        assert Response.body() != null;
        if (Response.body().getSuccess()) {
            CancelTrip();
            ClearFirebase(SharedHelper.getKey(context, "userid"));
            callRequest = (CallRequest) getActivity();
            if(callRequest != null) {
                callRequest.ClearServiceFragment();
            }
            TripFlowFragmant = null;
            SharedHelper.putKey(context, "trip_id", "null");
            activity.finish();
        } else {
            Utiles.displayMessage(getView(), activity, activity.getResources().getString(R.string.something_went_wrong));
        }
    }

    @Override
    public void OnFailure(Response<CancelTripModel> Response) {
        Utiles.displayMessage(getView(), activity, activity.getResources().getString(R.string.something_went_wrong));
    }

    private void CancelTripPresenter() {
        CancelTripPresenter cancelTripPresenter = new CancelTripPresenter(this);
        cancelTripPresenter.CancelTrip(SharedHelper.getKey(context, "trip_id"), activity, "");
    }

    private void CancelTrip() {
        DatabaseReference CancelReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(context, "trip_id"));
        HashMap<String, Object> map = new HashMap<>();
        map.put("status", "5");
        map.put("cancelby", "Rider");
        CancelReference.updateChildren(map);

    }


    @SuppressLint("SetTextI18n")
    @Override
    public void OnTripSuccessfully(Response<TripFlowModel> Response) {

        assert Response.body() != null;
        if (Response.body().getSuccess()) {

            try {
                this.Response = Response;
                carCategory.setText(NullPointer(Response.body().getServiceType()) + " ("+NullPointer(Response.body().getDriver().get(1).getCurrentActiveTaxi().getMakename() +")"));
                driverName.setText(NullPointer(Response.body().getDriver().get(0).getProfile().getFname().toUpperCase()) + "  " + NullPointer(Response.body().getDriver().get(0).getProfile().getLname().toUpperCase()));
                SharedHelper.putKey(activity,"driver_name",Response.body().getDriver().get(0).getProfile().getFname() + "  " + NullPointer(Response.body().getDriver().get(0).getProfile().getLname()));
                if(!Response.body().getDriver().get(0).getProfile().getProfileurl().endsWith("file-default.png")) {
                    Utiles.CircleImageView(Response.body().getDriver().get(0).getProfile().getProfileurl(), driverProfileImage, context);
                    SharedHelper.putKey(activity,"driver_img",Response.body().getDriver().get(0).getProfile().getProfileurl());
                }
                loadImage(activity, driverVehicleImage, "", Response.body().getServiceType());
                numberPlateTxt.setText(NullPointer(Response.body().getDriver().get(1).getCurrentActiveTaxi().getLicence()));
                strPhoneNumber = Response.body().getDriver().get(0).getProfile().getPhcode() + Response.body().getDriver().get(0).getProfile().getPhone();
                riderRating = Response.body().getDriver().get(0).getProfile().getRating();
                if (riderRating != null) {
                    driverRating.setText(riderRating+" "+getResources().getString(R.string.star_rating));
                }
                SetOtp();
                callRequest = (CallRequest) activity;
                if (callRequest == null) throw new AssertionError();
                callRequest.FlowDetails(Response);
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else {
            Utiles.displayMessage(getView(), activity, activity.getResources().getString(R.string.something_went_wrong));
        }

    }

    public void tripTitleText(String status) {
        switch (status) {
            case "1":
                tvStatus.setText(R.string.your_driver_is_on_the_way);
                break;
            case "2":
                tvStatus.setText(R.string.driver_has_arrived);
                break;
            case "3":
                tvStatus.setText(R.string.welcome_happy_ride);
                break;
            case "4":
                tvStatus.setText(R.string.your_trip_has_eded);
                break;
        }
    }


    @Override
    public void OnTripFailure(Response<TripFlowModel> Response) {
    }

    private void loadImage(Context context, ImageView imageView, Object imageSource, String serviceType) {
        Glide.with(context)
                .load(imageSource)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .skipMemoryCache(false)
                .placeholder(R.drawable.ic_img)
                .error(R.drawable.ic_sedan)
                .override(100, 100)
                .into(imageView);
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(TripStatus event) {
        tripStatus = event.getMessage();
        if (tripStatus.equalsIgnoreCase("3")) {
            cancelImgBtn.setVisibility(View.GONE);
        } else {
            cancelImgBtn.setVisibility(View.VISIBLE);
        }
        tripTitleText(tripStatus);
        tvStatus.setVisibility(View.VISIBLE);
        SetOtp();
        EventBus.getDefault().removeStickyEvent(TripStatus.class); // don't forget to remove the sticky event if youre done with it
    }

    @SuppressLint("SetTextI18n")
    public void SetOtp() {
        if (Response != null) {
            assert Response.body() != null;
            if (!tripStatus.isEmpty() && tripStatus.equalsIgnoreCase("3")) {
                otpTxt.setVisibility(View.GONE);
                otpTxt.setText("OTP : " + Response.body().getEndOTP());
            } else {
                otpTxt.setVisibility(View.VISIBLE);
                otpTxt.setText("OTP : " + Response.body().getStartOTP());
            }
        }

    }

    public void SocialShare() {
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_TEXT, activity.getResources().getString(R.string.app_name) +" "+SharedHelper.getKey(context,"fname")+"'s" +" Trip Share link : " + RetrofitGenerator.shareLink+"public/shareTrip/locater.html?tripId="+Response.body().getTripId());
        intent.putExtra(Intent.EXTRA_SUBJECT, activity.getResources().getString(R.string.app_name));
        activity.startActivity(Intent.createChooser(intent, "Share"));
    }

    @Override
    public void onStart() {
        super.onStart();
        if (!EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        if (EventBus.getDefault().isRegistered(this))
            EventBus.getDefault().unregister(this);
        super.onStop();
    }


    private void CalltoDriver() {
        CommonData.voicecall = "main";
        CommonData.closecall ="main";
        Intent intent = new Intent(activity, VoiceCallActivity.class);
        Constants.isFromTripFlow = true;
        activity.startActivity(intent);
    }

    private void DriverMessage() {
        Intent intent = new Intent(getActivity(), ChatActivity.class);
        activity.startActivity(intent);
    }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        assert fragmentManager != null;
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.container, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commitAllowingStateLoss();


}

    public void setAdapter() {
        CancelReason = FirebaseDatabase.getInstance().getReference().child("Cancel_reason").child("Rider_reason");
        CancelReasonListioner = CancelReason.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
               AllAddedData(dataSnapshot);
            }

            @Override
            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
                AllAddedData(dataSnapshot);
            }

            @Override
            public void onChildRemoved(DataSnapshot dataSnapshot) {

            }

            @Override
            public void onChildMoved(DataSnapshot dataSnapshot, String s) {

            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }
        });
    }

    public void AllAddedData(DataSnapshot dataSnapshot) {
        cancelReasonModels.add(new CancelReasonModel(dataSnapshot.getKey()));
    }

    @Override
    public void CancelReason(String strreason) {
        if (strreason.equalsIgnoreCase("Others")) {
           // slideUp(cancelReasonFrame);
        } else {
          //  strCancelReason = strreason;
            CancelTripPresenter();
           // dialog.dismiss();
        }

    }
}
