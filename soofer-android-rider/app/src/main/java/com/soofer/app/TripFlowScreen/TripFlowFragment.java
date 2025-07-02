package com.soofer.app.TripFlowScreen;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.soofer.app.Activity.VoiceCallActivity;
import com.soofer.app.Adapter.CancelReasonAdapter;
import com.soofer.app.CommonClass.Constants;
import com.soofer.app.Model.CancelReasonModel;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.soofer.app.Activity.ChatActivity;
import com.soofer.app.CommonClass.BaseFragment;
import com.soofer.app.CommonClass.FontChangeCrawler;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.EventBus.TripStatus;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.CancelTripModel;
import com.soofer.app.Model.TripFlowModel;
import com.soofer.app.Presenter.CancelTripPresenter;
import com.soofer.app.Presenter.TripFlowPresenter;
import com.soofer.app.R;
import com.soofer.app.Retrofit.RetrofitGenerator;
import com.soofer.app.View.CancelView;
import com.soofer.app.View.TripFlowView;

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

import static com.soofer.app.CommonClass.Constants.TripFlowFragmant;
import static com.soofer.app.CommonClass.Utiles.ClearFirebase;
import static com.soofer.app.CommonClass.Utiles.NullPointer;
import static com.soofer.app.CommonClass.Utiles.clearInstance;


public class TripFlowFragment extends BaseFragment implements CancelView, TripFlowView , CancelReasonAdapter.CancelLisioner{

    private List<CancelReasonModel> cancelReasonModels;
    @BindView(R.id.driver_profile_image)
    ImageView driverProfileImage;
    @BindView(R.id.driver_name)
    TextView driverName;
    @BindView(R.id.driver_rating)
    RatingBar driverRating;
    @BindView(R.id.car_category_rating)
    TextView carCategoryRating;
    @BindView(R.id.number_plate_txt)
    TextView numberPlateTxt;
    @BindView(R.id.call_layout)
    LinearLayout callLayout;
    @BindView(R.id.Message_layout)
    LinearLayout MessageLayout;
    @BindView(R.id.trip_cancel_layout)
    LinearLayout tripCancelLayout;
    @BindView(R.id.share_layout)
    LinearLayout shareLayout;
    @BindView(R.id.common_layout)
    LinearLayout commonLayout;
    Unbinder unbinder;
    CallRequest callRequest;
    Response<TripFlowModel> Response;
    @BindView(R.id.otp_txt)
    TextView otpTxt;
    @BindView(R.id.overall_layout)
    LinearLayout overallLayout;
    @BindView(R.id.call_img)
    ImageButton callImg;
    @BindView(R.id.call_btn)
    TextView callBtn;
    @BindView(R.id.message_imgbtn)
    ImageButton messageImgbtn;
    @BindView(R.id.message_txt)
    TextView messageTxt;
    @BindView(R.id.cancel_img)
    ImageButton cancelImg;
    @BindView(R.id.cancel_imgbtn)
    TextView cancelImgbtn;
    RecyclerView DialogRecycleview;
    AlertDialog.Builder canceldialog;

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

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        if (view != null) {
            ViewGroup parent = (ViewGroup) view.getParent();
            if (parent != null) {
                parent.removeView(view);
            }

        }
        view = inflater.inflate(R.layout.fragment_trip_flow, container, false);
        unbinder = ButterKnife.bind(this, view);
        activity = getActivity();
        context = getContext();
        cancelReasonModels = new ArrayList<>();
        FontChangeCrawler fontChanger = new FontChangeCrawler(activity.getAssets(), getString(R.string.app_font));
        fontChanger.replaceFonts(activity.findViewById(android.R.id.content));
        TripFlowPresenter tripFlowPresenter = new TripFlowPresenter(this);
        tripFlowPresenter.TripFlowApi(SharedHelper.getKey(context, "trip_id"), activity);
        return view;
    }


    @Override
    public void onDestroyView() {
        super.onDestroyView();
        clearInstance();
        unbinder.unbind();
        try {
            if (cancelAlert != null && cancelAlert.isShowing()) {
                cancelAlert.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Optional
    @OnClick({R.id.call_layout, R.id.Message_layout, R.id.trip_cancel_layout, R.id.share_layout, R.id.message_txt, R.id.message_imgbtn, R.id.cancel_img, R.id.cancel_imgbtn, R.id.call_img, R.id.call_btn, R.id.share_img, R.id.share_txt})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.call_layout:
                CalltoDriver();
                break;
            case R.id.Message_layout:
                DriverMessage();
                break;
            case R.id.trip_cancel_layout:
                fragment = new CancelFragment();
                FragmentCalling(fragment);
                break;
            case R.id.share_layout:
                SocialShare();
                break;
            case R.id.share_txt:
                SocialShare();
                break;
            case R.id.share_img:
                SocialShare();
                break;
            case R.id.call_img:
                CalltoDriver();
                break;
            case R.id.call_btn:
                CalltoDriver();
                break;
            case R.id.message_imgbtn:
                DriverMessage();
                break;
            case R.id.message_txt:
                DriverMessage();
                break;
            case R.id.cancel_img:
                fragment = new CancelFragment();
                FragmentCalling(fragment);
                break;
            case R.id.cancel_imgbtn:
                fragment = new CancelFragment();
                FragmentCalling(fragment);
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
            assert callRequest != null;
            callRequest.ClearServiceFragment();
            TripFlowFragmant = null;
            SharedHelper.putKey(context, "trip_id", "null");
        } else {

            Utiles.displayMessage(getView(), context, "Something Went Wrong");
        }
    }

    @Override
    public void OnFailure(Response<CancelTripModel> Response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");
    }


    private void CustomDialog(){
////        AlertDialog.Builder builder1 =new AlertDialog.Builder(activity);
////        final View customLayout = getLayoutInflater().inflate(R.layout.cancel_trip_dialog,null);
////        builder1.setView(customLayout);
////        setAdapter();
//        CancelReason = FirebaseDatabase.getInstance().getReference().child("Cancel_reason").child("Rider_reason");
//        Dialog dialog = new Dialog(activity);
//        dialog.setCancelable(true);
//        dialog.setContentView(R.layout.fragment_cancel);
//
//        RecyclerView recyclerView = dialog.findViewById(R.id.trip_recycleview);
//        CancelReasonAdapter cancelReasonAdapter = new CancelReasonAdapter(activity,cancelReasonModels,this);
//        recyclerView.setAdapter(cancelReasonAdapter);
//        recyclerView.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false));
//
//
//        CancelReasonListioner = CancelReason.addChildEventListener(new ChildEventListener() {
//            @Override
//            public void onChildAdded(DataSnapshot dataSnapshot, String s) {
//                AllAddedData(dataSnapshot);
//            }
//
//            @Override
//            public void onChildChanged(DataSnapshot dataSnapshot, String s) {
//                AllAddedData(dataSnapshot);
//            }
//
//            @Override
//            public void onChildRemoved(DataSnapshot dataSnapshot) {
//
//            }
//
//            @Override
//            public void onChildMoved(DataSnapshot dataSnapshot, String s) {
//
//            }
//
//            @Override
//            public void onCancelled(DatabaseError databaseError) {
//
//            }
//        });
//        dialog.show();

    }

    private void Alertdialog() {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(activity);
        builder1.setTitle(R.string.cancel_trip);
     builder1.setMessage(R.string.are_you_sure_wanna_cancel_trip);
       builder1.setPositiveButton(
                R.string.yes,
                (dialog, id) -> {
                    dialog.dismiss();
                    CancelTripPresenter();
                });
        builder1.setNegativeButton(R.string.no, (dialog, which) -> dialog.dismiss());
        AlertDialog alert = builder1.create();
        alert.setCanceledOnTouchOutside(false);
        alert.show();
        try {
            cancelAlert.show();
        } catch (Exception e) {
            e.printStackTrace();
        }


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
                carCategoryRating.setText(NullPointer(Response.body().getServiceType()));
                driverName.setText(NullPointer(Response.body().getDriver().get(0).getProfile().getFname())/* + "  " + NullPointer(Response.body().getDriver().get(0).getProfile().getLname())*/);
                Utiles.CircleImageView(Response.body().getDriver().get(0).getProfile().getProfileurl(), driverProfileImage, context);
                numberPlateTxt.setText(NullPointer(Response.body().getDriver().get(1).getCurrentActiveTaxi().getLicence()));
                strPhoneNumber = Response.body().getDriver().get(0).getProfile().getPhcode() + Response.body().getDriver().get(0).getProfile().getPhone();
                riderRating = Response.body().getDriver().get(0).getProfile().getRating();
                if (riderRating != null) {
                    driverRating.setRating(Float.parseFloat(riderRating));
                }

                SetOtp();
                callRequest = (CallRequest) getActivity();
                assert callRequest != null;
                callRequest.FlowDetails(Response);
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else {
            Utiles.displayMessage(getView(), context, "Something Went Wrong");
        }

    }

    @Override
    public void OnTripFailure(Response<TripFlowModel> Response) {
        Utiles.displayMessage(getView(), context, "Something Went Wrong");
    }



    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(TripStatus event) {
        String status = event.getMessage();
        tripStatus = event.getMessage();
        if (status.equalsIgnoreCase("3")) {
            commonLayout.setWeightSum(3f);
            tripCancelLayout.setVisibility(View.GONE);

        } else {
            tripCancelLayout.setVisibility(View.VISIBLE);
            commonLayout.setWeightSum(4f);
        }
        Log.d("Tag", "Test status" + status);
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

                otpTxt.setText("OTP : " + Response.body().getStartOTP());
            }
        }

    }

    private void SocialShare() {
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_TEXT, activity.getResources().getString(R.string.app_name) +" "+SharedHelper.getKey(context,"fname")+"'s" +" Trip Share link : " + RetrofitGenerator.shareLink+"shareTrip/locater.html?tripId="+Response.body().getTripId());
        intent.putExtra(android.content.Intent.EXTRA_SUBJECT, activity.getResources().getString(R.string.app_name));
        startActivity(Intent.createChooser(intent, "Share"));

      //  String text = "<a href="+RetrofitGenerator.imagepath+"public/shareTrip/locater.html?tripId="+Response.body().getTripId()+">"+ "View Teip</a>";

      /*  ShareCompat.IntentBuilder.from(activity)
                .setType("text/plain")
                .setChooserTitle("Share Link")
                .setText(activity.getResources().getString(R.string.app_name) +" "+SharedHelper.getKey(context,"fname")+"'s" +" Trip Share link ")
                .setHtmlText(text)
                .startChooser();*/

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
//        if (strPhoneNumber != null && !strPhoneNumber.isEmpty()) {
//            Intent intent = new Intent(Intent.ACTION_DIAL);
//            intent.setData(Uri.parse("tel:" + strPhoneNumber));
//            if (intent.resolveActivity(activity.getPackageManager()) != null) {
//                activity.startActivity(intent);
//            }
//        } else {
//            Toast.makeText(activity, "Number not register", Toast.LENGTH_SHORT).show();
//        }

        Intent intent = new Intent(activity, VoiceCallActivity.class);
        Constants.isFromTripFlow = true;
        activity.startActivity(intent);

    }

    private void DriverMessage() {
       /* if (strPhoneNumber != null && !strPhoneNumber.isEmpty()) {
            Intent sendIntent = new Intent(Intent.ACTION_VIEW);
            sendIntent.setData(Uri.parse("sms:" + strPhoneNumber));
            activity.startActivity(sendIntent);
        } else {
            Toast.makeText(activity, "Number not register", Toast.LENGTH_SHORT).show();
        }*/
        Intent intent = new Intent(getActivity(), ChatActivity.class);
        activity.startActivity(intent);
    }

    public void FragmentCalling(Fragment fragment) {
        FragmentManager fragmentManager = getFragmentManager();
        assert fragmentManager != null;
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.container, fragment);
        fragmentTransaction.addToBackStack(null);
        fragmentTransaction.commit();


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
//      DialogRecycleview.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false));
//        DialogRecycleview.setItemAnimator(new DefaultItemAnimator());
//        DialogRecycleview.setHasFixedSize(true);
//        CancelReasonAdapter cancelReasonAdapter = new CancelReasonAdapter(activity, cancelReasonModels, this);
//       DialogRecycleview.setAdapter(cancelReasonAdapter);
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
