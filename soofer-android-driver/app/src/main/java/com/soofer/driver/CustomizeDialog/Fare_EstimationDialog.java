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
    private Response<EstimationChanges> response ;

    String gettax = "";
    String getamt = "";
    String getcommision = "";
    String getbooking = "";
    String getbook = "";
    String getgateway = "";

    String gettollfare = "";

    public Fare_EstimationDialog(Activity activity, String tax ,String amttopay ,String commision,String booking,String book , String tollfare,String GatewayCharge ) {
        super(activity);
        // TODO Auto-generated constructor stub
        this.activity = activity;
        this.response = response;
        System.out.println("taxxxx..."+tax);
        getamt =amttopay;
        getcommision =commision;
        getbooking =booking;
        getgateway =GatewayCharge;
        getbook = book;
        gettollfare = tollfare;
        gettax =tax;
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
          basefare.setText(getamt);
          commission.setText(getcommision);
          booking.setText(getbooking);
          tax.setText(gettax);
          book.setText(getbook);
          tollfee.setText(gettollfare);
          gateway.setText(getgateway);
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
