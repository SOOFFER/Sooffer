package com.soofer.driver.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.soofer.driver.EventBus.EstimationChanges;
import com.soofer.driver.R;


import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;


public class Fare_EstimationDialog extends Dialog {


    public Activity activity;
    @BindView(R.id.base_fare)
    TextView basefare;
    @BindView(R.id.commision)
    TextView commission;
    @BindView(R.id.booking_fare_txt)
    TextView booking;
    @BindView(R.id.tax_label_txt)
    TextView tax;
    @BindView(R.id.gateway_txt)
    TextView gateway;

    @BindView(R.id.booking_txt)
    TextView book;
    @BindView(R.id.tollFee_txt)
    TextView tollfee;

    private View decorView;

    EstimationChanges event;

    public Fare_EstimationDialog(Activity activity, EstimationChanges event ) {
        super(activity);
        this.activity = activity;
        this.event =event;
    }

    private Unbinder unbinder;



    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Objects.requireNonNull(getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        setContentView(R.layout.fare_estimate_dialog);
        unbinder = ButterKnife.bind(this);

        try {
          basefare.setText("$ " +event.getamttopay());
          commission.setText("$ " +event.getcommision());
          booking.setText("$ " +event.getamtToDriver());
          tax.setText("$ " +event.getTax());
          book.setText("$ " +event.getBookingFare());
          tollfee.setText("$ " +event.getTollfare());
          gateway.setText("$ " +event.getGatewayCharge());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
