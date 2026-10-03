package com.soofer.app.Activity;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.soofer.app.Adapter.FareAdapter;
import com.soofer.app.CommonClass.BaseActivity;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.CustomizeDialog.InvoiceEmailDialog;
import com.soofer.app.Model.FareModel;
import com.soofer.app.Model.TripDetailsModel;
import com.soofer.app.Presenter.TripDetailsPresenter;
import com.soofer.app.R;
import com.soofer.app.View.TripDetailView;
import com.romainpiel.shimmer.Shimmer;
import com.romainpiel.shimmer.ShimmerTextView;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Response;


public class TripDetailsActivity extends BaseActivity implements TripDetailView {


    @BindView(R.id.back_img)
    ImageButton backImg;
    @BindView(R.id.map_img)
    ImageView mapImg;
    @BindView(R.id.profile_image)
    ImageView profileImage;
    @BindView(R.id.user_name)
    TextView userName;
    @BindView(R.id.pickup_txt)
    TextView pickupTxt;
    @BindView(R.id.drop_address_txt)
    TextView dropAddressTxt;
    @BindView(R.id.date_time_txt)
    TextView dateTimeTxt;
    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;
    @BindView(R.id.service_type_txt)
    TextView serviceTypeTxt;
    @BindView(R.id.trip_status_txt)
    TextView tripStatusTxt;
    @BindView(R.id.payment_type_img)
    ImageView paymentTypeImg;
    @BindView(R.id.payment_type_txt)
    TextView paymentTypeTxt;
    String strTrip_id;

    Context context = TripDetailsActivity.this;
    Activity activity = TripDetailsActivity.this;
    @BindView(R.id.grant_amount_txt)
    TextView grantAmountTxt;
    @BindView(R.id.kmfare_txt)
    TextView kmfareTxt;
    @BindView(R.id.Waiting_txt)
    TextView WaitingTxt;
    @BindView(R.id.Pickup_txt)
    TextView PickupTxt;
    @BindView(R.id.access_txt)
    TextView accessTxt;
    @BindView(R.id.Cancelllation_txt)
    TextView CancelllationTxt;
    @BindView(R.id.relative_cancel)
    RelativeLayout relativeCancel;
    @BindView(R.id.view_cancel)
    View viewCancel;
    @BindView(R.id.nightpeakapply_txx)
    TextView nightpeakapplyTxx;
    @BindView(R.id.nightpeakapply_cancel)
    RelativeLayout nightpeakapplyCancel;
    @BindView(R.id.nightpeakapply_cancel_view)
    View nightpeakapplyCancelView;
    @BindView(R.id.header)
    RelativeLayout header;
    @BindView(R.id.waiting_layout)
    RelativeLayout waitingLayout;
    @BindView(R.id.waiting_view)
    View waitingView;
    @BindView(R.id.submit)
    Button submit;
    @BindView(R.id.fare_detaily_layout)
    LinearLayout fareDetailyLayout;
    @BindView(R.id.fare_details_layout)
    FrameLayout fareDetailsLayout;
    @BindView(R.id.shimmer_tv)
    ShimmerTextView shimmerTv;
    Shimmer shimmer;
    @BindView(R.id.outstation_fare_recycleview)
    RecyclerView outstationFareRecycleview;
    @BindView(R.id.detail_fare_layout)
    LinearLayout detailFareLayout;
    @BindView(R.id.base_txt)
    TextView baseTxt;
    @BindView(R.id.nightchargevalue)
    TextView nightchargevalue;
    @BindView(R.id.minimum_fare_txt)
    TextView minimumFareTxt;
    @BindView(R.id.invoice)
    Button invoice;
    @BindView(R.id.totals_txt)
    TextView totalsTxt;
    @BindView(R.id.timefare_txt)
    TextView timefareTxt;
    @BindView(R.id.toll_fare_txt)
    TextView tollFareTxt;

    @BindView(R.id.tips_fare_txt)
    TextView tipsfaretxt;
    @BindView(R.id.discount_fare_txt)
    TextView discountFareTxt;
    @BindView(R.id.tax_label_txt)
    TextView taxLabelTxt;
    @BindView(R.id.gateway_txt)
    TextView gateway_txt;
    @BindView(R.id.booking_txt)
    TextView bookingTxt;
//    @BindView(R.id.gateway_txt)
//    TextView gatewayTxt;
    private List<FareModel> fareModels;
    private FareAdapter fareAdapter;
    private InvoiceEmailDialog invoiceEmailDialog;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_trip_details);
        ButterKnife.bind(this);
        Intent intent = getIntent();
        strTrip_id = intent.getStringExtra("trip_id");
        fareModels = new ArrayList<>();

        try {
            shimmer = new Shimmer();
            shimmer.start(shimmerTv);
        } catch (Exception e) {
            e.printStackTrace();
        }
        CallTripDetailsFragment();


    }

    public void CallTripDetailsFragment() {
        TripDetailsPresenter tripDetailsPresenter = new TripDetailsPresenter(this);
        tripDetailsPresenter.getTripDetails(this, strTrip_id);
        System.out.println("enter token" + SharedHelper.getKey(activity.getApplicationContext(), "token"));
    }


    @OnClick({R.id.back_img, R.id.submit, R.id.fare_detaily_layout, R.id.invoice})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.back_img:
                finish();
                break;
            case R.id.submit:
                slideUp(fareDetailsLayout);
                break;
            case R.id.fare_detaily_layout:
                slideDown(fareDetailsLayout);
                break;
            case R.id.invoice:
                try {
                    if (invoiceEmailDialog != null) {
                        invoiceEmailDialog.dismiss();
                    }
                    invoiceEmailDialog = new InvoiceEmailDialog(activity, strTrip_id);
                    invoiceEmailDialog.show();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;

        }

    }

    // slide the view from below itself to the current position
    public void slideUp(View view) {
        Animation animation = AnimationUtils.loadAnimation(this, R.anim.fadin_animation);
        fareDetailyLayout.startAnimation(animation);
        view.setVisibility(View.VISIBLE);
    }

    // slide the view from its current position to below itself
    public void slideDown(View view) {
        view.setVisibility(View.GONE);
    }

    @Override
    public void onSuccess(Response<TripDetailsModel> Response) {
        System.out.println("Enter new json file" + new Gson().toJson(Response.body()));
        assert Response.body() != null;
        setextTextView(userName, Response.body().getTripDetail().getDvr());
        setextTextView(pickupTxt, Response.body().getTripDetail().getAdsp().getFrom());
        setextTextView(dropAddressTxt, Response.body().getTripDetail().getAdsp().getTo());
        setextTextView(dateTimeTxt, Response.body().getTripDetail().getDate());
        setextTextView(paymentTypeTxt, Response.body().getTripDetail().getAcsp().getVia());
        if (paymentTypeTxt.getText().toString().equalsIgnoreCase("cash")) {
            paymentTypeImg.setImageResource(R.drawable.ic_money);
        } else {
            paymentTypeImg.setImageResource(R.drawable.ic_stripe);
        }
        try {
            if (Response.body().getTripDetail().getAcsp().getOldBalance() != null && !Response.body().getTripDetail().getAcsp().getOldBalance().equalsIgnoreCase("null")) {
                if (Response.body().getTripDetail().getAcsp().getOldBalance().equalsIgnoreCase("0")) {
                    relativeCancel.setVisibility(View.GONE);
                    viewCancel.setVisibility(View.GONE);
                } else {
                    relativeCancel.setVisibility(View.VISIBLE);
                    viewCancel.setVisibility(View.VISIBLE);
                }
            } else {
                relativeCancel.setVisibility(View.GONE);
                viewCancel.setVisibility(View.GONE);
            }

            if (Response.body().getTripDetail().getApplyValues().getApplyNightCharge()) {
                nightpeakapplyCancel.setVisibility(View.VISIBLE);
                nightpeakapplyCancelView.setVisibility(View.VISIBLE);
            } else {
                nightpeakapplyCancel.setVisibility(View.GONE);
                nightpeakapplyCancelView.setVisibility(View.GONE);

            }
            if (Response.body().getTripDetail().getApplyValues().getApplyNightCharge()) {
                nightpeakapplyCancel.setVisibility(View.VISIBLE);
                nightpeakapplyCancelView.setVisibility(View.VISIBLE);
            } else {
                nightpeakapplyCancel.setVisibility(View.GONE);
                nightpeakapplyCancelView.setVisibility(View.GONE);
            }
            if (Response.body().getTripDetail().getApplyValues().getApplyWaitingTime()) {
                waitingLayout.setVisibility(View.VISIBLE);
                waitingView.setVisibility(View.VISIBLE);
            } else {
                waitingLayout.setVisibility(View.GONE);
                waitingView.setVisibility(View.GONE);
            }
            if (Response.body().getTripDetail().getAcsp().getIsNight()) {
                nightpeakapplyCancel.setVisibility(View.VISIBLE);
                nightpeakapplyCancelView.setVisibility(View.VISIBLE);
                setextTextView(nightpeakapplyTxx, getString(R.string.night_charge_apply) + " " + Response.body().getTripDetail().getAcsp().getNightPer()+ "%");

            } else if (Response.body().getTripDetail().getAcsp().getIsPeak()) {
                nightpeakapplyCancel.setVisibility(View.VISIBLE);
                nightpeakapplyCancelView.setVisibility(View.VISIBLE);
                setextTextView(nightpeakapplyTxx, getString(R.string.pleask_charge_App) + " " + Response.body().getTripDetail().getAcsp().getPeakPer());
            } else {
                nightpeakapplyCancel.setVisibility(View.GONE);
                nightpeakapplyCancelView.setVisibility(View.GONE);
            }
            taxLabelTxt.setText(activity.getString(R.string.access_fare) + " " + Response.body().getTripDetail().getAcsp().getTaxPercentage() + "%");
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (!Response.body().getTripDetail().getTriptype().equalsIgnoreCase("daily")) {
            detailFareLayout.setVisibility(View.GONE);
            outstationFareRecycleview.setVisibility(View.VISIBLE);
            FareModel fareModel = getFareModel();
            fareModel.setLabel(getString(R.string.base_package));
            fareModel.setValue(Response.body().getTripDetail().getAcsp().getPackageName());
            fareModel.setDesc("");
            fareModels.add(fareModel);

            fareModel = getFareModel();
            fareModel.setLabel(getString(R.string.package_km_fare));
            fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getDistfare());
            fareModel.setDesc("");
            fareModels.add(fareModel);

            fareModel = getFareModel();
            fareModel.setLabel(getString(R.string.fare_for_remaining_km));
            fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getFareForExtraKM());
            fareModel.setDesc("( $ " + Response.body().getTripDetail().getAcsp().getPerKmRate() + " /Mile)");
            fareModels.add(fareModel);

            fareModel = getFareModel();
            fareModel.setLabel(getString(R.string.access_fare));
            fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getTax());
            fareModel.setDesc(Response.body().getTripDetail().getAcsp().getTaxPercentage() + " %");
            fareModels.add(fareModel);

            fareModel = getFareModel();
            fareModel.setLabel(getString(R.string.remaining_time_fare));
            fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getFareForExtraTime());
            fareModel.setDesc("( $ " + Response.body().getTripDetail().getAcsp().getTimefare() + " /Hr)");
            fareModels.add(fareModel);

            fareModel = getFareModel();
            fareModel.setLabel(getString(R.string.discount));
            fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getDetect());

            if (Response.body().getTripDetail().getAcsp().getDiscountName().isEmpty()) {
                fareModel.setDesc("(N/A - 0%)");
            } else {
                fareModel.setDesc(Response.body().getTripDetail().getAcsp().getDiscountName() + " - " + Response.body().getTripDetail().getAcsp().getDiscountPercentage());
            }
            fareModels.add(fareModel);

            fareModel = getFareModel();
            fareModel.setLabel(getString(R.string.toll_fee));
            fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getTollFee());
            fareModel.setDesc("");
            fareModels.add(fareModel);

            try {
                fareModel = getFareModel();
                fareModel.setLabel(getString(R.string.night_fare));
                fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getNightFare());
                fareModel.setDesc("");
                fareModels.add(fareModel);

                fareModel = getFareModel();
                fareModel.setLabel(getString(R.string.day_fare));
                fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getDayFare());
                fareModel.setDesc("");
                fareModels.add(fareModel);

                fareModel = getFareModel();
                fareModel.setLabel(getString(R.string.google_fare));
                fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getGoogleCharge());
                fareModel.setDesc("");
                fareModels.add(fareModel);

                fareModel = getFareModel();
                fareModel.setLabel(getString(R.string.gateway_charge));
                fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getGatewayCharge());
                fareModel.setDesc("");
                fareModels.add(fareModel);
            } catch (Exception e) {
                e.printStackTrace();
            }

            fareModel = getFareModel();
            fareModel.setLabel(getString(R.string.total_fare));
            fareModel.setValue("$ " + Response.body().getTripDetail().getAcsp().getCost());
            fareModel.setDesc("");
            fareModels.add(fareModel);
            if (fareAdapter == null) {
                fareAdapter = new FareAdapter(activity, fareModels);
                outstationFareRecycleview.setAdapter(fareAdapter);
            } else {
                fareAdapter.notifyDataSetChanged();
            }

        } else {
            detailFareLayout.setVisibility(View.VISIBLE);
            outstationFareRecycleview.setVisibility(View.GONE);
        }

        setextTextView(accessTxt, "$" + Response.body().getTripDetail().getAcsp().getTax());
        setextTextView(baseTxt, "$" + Response.body().getTripDetail().getAcsp().getBase());
        setextTextView(nightchargevalue, "$" + Response.body().getTripDetail().getAcsp().getSurgeamt());
        setextTextView(minimumFareTxt, "$" + Response.body().getTripDetail().getAcsp().getMinFareAdded());
        setextTextView(kmfareTxt, "$" + Response.body().getTripDetail().getAcsp().getDistfare());
        setextTextView(CancelllationTxt, "$" + Response.body().getTripDetail().getAcsp().getOldBalance());
        setextTextView(WaitingTxt, "$" + Response.body().getTripDetail().getAcsp().getWaitingCharge());
        setextTextView(PickupTxt, "$" + Response.body().getTripDetail().getAcsp().getConveyance());
        setextTextView(bookingTxt, "$" + Response.body().getTripDetail().getAcsp().getBooking());

        setextTextView(totalAmountTxt, "$ " + Response.body().getTripDetail().getAcsp().getCost());
        setextTextView(timefareTxt, "$ " + Response.body().getTripDetail().getAcsp().getTimefare());
        setextTextView(totalsTxt, "$ " + Response.body().getTripDetail().getAcsp().getCost());
        setextTextView(grantAmountTxt, "$ " + Response.body().getTripDetail().getAcsp().getCost());
        setextTextView(tollFareTxt, "$ " + Response.body().getTripDetail().getAcsp().getTollFee());

        setextTextView(gateway_txt, "$ " + Response.body().getTripDetail().getAcsp().getGatewayCharge());
        setextTextView(serviceTypeTxt, activity.getResources().getString(R.string.vehilce_type) + " " + Response.body().getTripDetail().getVehicle());
        setextTextView(tripStatusTxt, getString(R.string.completed));
        if (Response.body().getDriverTip() != null){
            setextTextView(tipsfaretxt, "$ " + Response.body().getDriverTip());
        }
        setextTextView(discountFareTxt, "$ " + Response.body().getTripDetail().getAcsp().getPromoDiscount());
        Utiles.Documentimg(Response.body().getTripDetail().getAdsp().getMap(), mapImg, this);
        Utiles.CircleImageView(Response.body().getProfileDetail().getProfile(), profileImage, this);

    }

    @Override
    public void onFailure(Response<TripDetailsModel> Response) {
        Utiles.displayMessage(getCurrentFocus(), context, "Something Went Wrong");
    }

    public void setextTextView(TextView textView, String Values) {
        try {
            textView.setText(Utiles.NullPointer(Values));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        try {
            if (shimmer.isAnimating()) {
                shimmer.cancel();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        Utiles.clearInstance();
    }

    private FareModel getFareModel() {
        return new FareModel();
    }
}