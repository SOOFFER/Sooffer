package com.soofer.driver.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RatingBar;
import android.widget.TextView;

import com.soofer.driver.Activity.VoiceCallActivity;
import com.soofer.driver.EventBus.CancelReason;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import com.soofer.driver.Activity.ChatActivity;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.FlowInterface.RequestInterface;
import com.soofer.driver.Model.CancelTripModel;
import com.soofer.driver.Model.TripFlowModel;
import com.soofer.driver.Presenter.CancelTripPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.CancelView;

import java.util.HashMap;

import com.soofer.driver.CommonClass.Constants;

import org.greenrobot.eventbus.EventBus;

import butterknife.BindView;
import retrofit2.Response;


public class RiderProfile extends Dialog implements CancelView, View.OnClickListener {

    public Activity activity;
    public RiderProfile d;
    @BindView(R.id.driver_profile_image)
    ImageView driverProfileImage;
    @BindView(R.id.driver_name)
    TextView driverName;
    @BindView(R.id.driver_rating)
    RatingBar driverRating;
    @BindView(R.id.car_category_rating)
    TextView carCategoryRating;
    @BindView(R.id.call_layout)
    LinearLayout callLayout;
    @BindView(R.id.Message_layout)
    LinearLayout MessageLayout;
    @BindView(R.id.trip_cancel_layout)
    LinearLayout tripCancelLayout;
    @BindView(R.id.common_layout)
    LinearLayout commonLayout;
    private RequestInterface requestInterface;
    private Response<TripFlowModel> response;
    private String strPhoneNumber;
    private String riderRating;
    private AlertDialog alert11;
    private FragmentManager fragmentManager;
    Fragment fragment;

    public RiderProfile(@NonNull Activity a, Response<TripFlowModel> response) {
        super(a);
        this.activity = a;
        this.response = response;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.rider_details);
        FindviewById();

    }

    @SuppressLint("SetTextI18n")
    public void FindviewById() {
        driverProfileImage = findViewById(R.id.driver_profile_image);
        driverName = findViewById(R.id.driver_name);
        driverRating = findViewById(R.id.driver_rating);
        carCategoryRating = findViewById(R.id.car_category_rating);
        callLayout = findViewById(R.id.call_layout);
        commonLayout = findViewById(R.id.common_layout);
        tripCancelLayout = findViewById(R.id.trip_cancel_layout);
        MessageLayout = findViewById(R.id.Message_layout);
        if (Constants.Previousstatus.equalsIgnoreCase("3")) {
            commonLayout.setWeightSum(2f);
            tripCancelLayout.setVisibility(View.GONE);

        } else {
            tripCancelLayout.setVisibility(View.VISIBLE);
        }
        try {
            assert response.body() != null;
            carCategoryRating.setText(response.body().getTaxitype());
            strPhoneNumber = response.body().getRider().getPhcode() + response.body().getRider().getPhone();

            Utiles.CircleImageView(response.body().getRider().getProfileurl(), driverProfileImage, activity.getApplicationContext());

            if (response != null) {
                driverName.setText(response.body().getRider().getFname()/* + "  " + response.body().getRider().getLname()*/);
            }
            callLayout.setOnClickListener(this);
            tripCancelLayout.setOnClickListener(this);
            MessageLayout.setOnClickListener(this);
            riderRating = response.body().getRider().getPoints();
            if (riderRating != null && !riderRating.equalsIgnoreCase("null") && !riderRating.isEmpty()) {
                driverRating.setRating(Float.parseFloat(riderRating));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public void OnSuccessfullyy(Response<CancelTripModel> Response) {
        if (Response.body().getSuccess()) {
            CancelTrip();
            Utiles.ClearFirebase(activity.getApplicationContext());
            SharedHelper.putKey(activity.getApplicationContext(), "trip_id", "null");
            dismiss();
            try {

                requestInterface = (RequestInterface) activity;
                requestInterface.ClearAllFragment();
            } catch (Exception e) {
                Log.e("tag", "Eception of request screen" + e.getMessage());
            }
        } else {
            Utiles.displayMessage(getCurrentFocus(), activity.getApplicationContext(), activity.getResources().getString(R.string.something_went_wrong));
        }

    }

    @Override
    public void OnFailuree(Response<CancelTripModel> Response) {
        Utiles.displayMessage(getCurrentFocus(), activity.getApplicationContext(), activity.getResources().getString(R.string.something_went_wrong));
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.Message_layout:
                DriverMessage();
                break;
            case R.id.call_layout:
                CalltoDriver();
                break;
            case R.id.trip_cancel_layout:
                EventBus.getDefault().post(new CancelReason("tripcancel"));
                break;
        }
    }


    public void Alertdialog(String Message) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(activity);
        builder1.setTitle(R.string.cancel_trip);
        builder1.setMessage(Message);
        builder1.setCancelable(true);
        builder1.setPositiveButton(
                activity.getResources().getString(R.string.yes),
                (dialog, id) -> {
                    dialog.dismiss();
                    CancelTripPresenter();
                });
        builder1.setNegativeButton(activity.getResources().getString(R.string.no), (dialog, which) -> dialog.dismiss());
        alert11 = builder1.create();
        alert11.show();

    }

    public void CancelTripPresenter() {
        CancelTripPresenter cancelTripPresenter = new CancelTripPresenter(this);
        cancelTripPresenter.CancelTrip(SharedHelper.getKey(activity.getApplicationContext(), "trip_id"), activity, "");
    }

    private void CancelTrip() {
        Constants.Previousstatus = "5";
        DatabaseReference CancelReference = FirebaseDatabase.getInstance().getReference().child("trips_data").child(SharedHelper.getKey(activity.getApplicationContext(), "trip_id"));
        HashMap<String, Object> map = new HashMap<>();
        map.put("status", "5");
        map.put("cancelby", "driver");
        CancelReference.updateChildren(map);

    }

    private void CalltoDriver() {
 /*       if (strPhoneNumber != null && !strPhoneNumber.isEmpty()) {
            Intent intent = new Intent(Intent.ACTION_DIAL);
            intent.setData(Uri.parse("tel:" + strPhoneNumber));
            if (intent.resolveActivity(activity.getPackageManager()) != null) {
                activity.startActivity(intent);
            }
        } else {
            Toast.makeText(activity, "Number not register", Toast.LENGTH_SHORT).show();
        }
    */
        Intent intent = new Intent(activity, VoiceCallActivity.class);
        Constants.isFromRiderProfile = true;
        activity.startActivity(intent);
    }

    private void DriverMessage() {
     /*   if (strPhoneNumber != null && !strPhoneNumber.isEmpty()) {

            activity.startActivity(new Intent(Intent.ACTION_VIEW, Uri.fromParts("sms", strPhoneNumber, null)));
        } else {
            Toast.makeText(activity, "Number not register", Toast.LENGTH_SHORT).show();
        }*/
        Intent intent = new Intent(activity, ChatActivity.class);
        activity.startActivity(intent);
    }


    @Override
    protected void onStop() {
        super.onStop();
        try {
            if (alert11 != null && alert11.isShowing()) {
                alert11.dismiss();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
