package com.soofer.app.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;


import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.EstimationModel;
import com.soofer.app.R;

import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;


public class Fare_EstimationDialog extends Dialog {


    public Activity activity;
    @BindView(R.id.base_fare_txt)
    TextView baseFareTxt;
    @BindView(R.id.distance_txt)
    TextView distanceTxt;
    @BindView(R.id.distance_fare_txt)
    TextView distanceFareTxt;
    @BindView(R.id.time_txt)
    TextView timeTxt;
    @BindView(R.id.time_fare_txt)
    TextView timeFareTxt;


    CallRequest callRequest;
    @BindView(R.id.total_amount_txt)
    TextView totalAmountTxt;
    @BindView(R.id.base_fare_detail_txt)
    TextView baseFareDetailTxt;
    @BindView(R.id.book_fare_detail_txt)
    TextView bookfaredetailtxt;

    @BindView(R.id.Cancel_fee_txt)
    TextView CancelFeeTxt;
    @BindView(R.id.cancel_linear_layout)
    LinearLayout cancelLinearLayout;
    @BindView(R.id.fare_linear_layout)
    LinearLayout fareLinearLayout;
    @BindView(R.id.picku_charge_layout)
    LinearLayout pickuChargeLayout;
    @BindView(R.id.access_fee_layout)
    LinearLayout accessFeeLayout;

//    @BindView(R.id.use_wallet)
//    CheckBox useWallet;
    @BindView(R.id.time_fare_detail_txt)
    TextView timeFareDetailTxt;
    @BindView(R.id.app_logo_img)
    ImageView appLogoImg;
    @BindView(R.id.surgeamt_txt)
    TextView surgeamt_txt;
    @BindView(R.id.surge_txt)
    TextView surge_txt;

    private View decorView;
    private retrofit2.Response<EstimationModel> response ;

    public Fare_EstimationDialog(Activity activity, Response<EstimationModel> response) {
        super(activity);
        // TODO Auto-generated constructor stub
        this.activity = activity;
        this.response = response;
        Objects.requireNonNull(getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

    }

    private Unbinder unbinder;


    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fare_estimate_dialog);
        unbinder = ButterKnife.bind(this);

        try {
            if (response.body().getVehicleDetailsAndFare().getFareDetails().getFareType().equalsIgnoreCase("kmrate")) {
                fareLinearLayout.setVisibility(View.VISIBLE);
            } else {
                fareLinearLayout.setVisibility(View.GONE);
            }
            if (!response.body().getVehicleDetailsAndFare().getFareDetails().getOldCancellationAmt().equalsIgnoreCase("0")) {
                cancelLinearLayout.setVisibility(View.VISIBLE);
            } else {
                cancelLinearLayout.setVisibility(View.GONE);
            }
//            if (response.body().getVehicleDetailsAndFare().getApplyValues().getApplyNightCharge()) {
//                if (response.body().getVehicleDetailsAndFare().getFareDetails().getNightObj().getIsApply()) {
//                    nightChargeTxt.setVisibility(View.VISIBLE);
//                    nightChargeTxt.setText(response.body().getVehicleDetailsAndFare().getFareDetails().getNightObj().getAlertLable());
//                } else {
//                    nightChargeTxt.setVisibility(View.GONE);
//                }
//            } else {
//                nightChargeTxt.setVisibility(View.GONE);
//            }

            if (response.body().getVehicleDetailsAndFare().getFareDetails().getNightObj().getIsApply().equals(true)){
                surge_txt.setText("Night Charge");
            }else if (response.body().getVehicleDetailsAndFare().getFareDetails().getPeakObj().getIsApply().equals(true)){
                surge_txt.setText("Peak Charge");
            }

            CancelFeeTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getOldCancellationAmt());
            baseFareTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getTax());


            totalAmountTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getTotalFare());
            distanceFareTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getKMFare());
            surgeamt_txt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getSurgeAmt());
            timeFareTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getPickupCharge());
            baseFareDetailTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getBaseFare());
            bookfaredetailtxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getBookingFare());
            timeFareDetailTxt.setText("$" + response.body().getVehicleDetailsAndFare().getFareDetails().getTravelFare());
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    @Override
    protected void onStop() {
        super.onStop();
        if(unbinder!=null){
            unbinder.unbind();
        }
    }
}
