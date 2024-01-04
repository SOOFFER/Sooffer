package com.bismillah.app.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

import androidx.annotation.NonNull;

import com.bismillah.app.R;

import butterknife.BindView;
import butterknife.OnClick;

public class PaymentTypeDialog extends Dialog {

    public Activity activity;

    @BindView(R.id.cash_img)
    ImageView cashImg;
    @BindView(R.id.card_img)
    ImageView cardImg;
    private paymentCallback paymentCallback;

    public PaymentTypeDialog(@NonNull Activity activity, paymentCallback paymentCallback) {

        super(activity);
        this.activity = activity;
        this.paymentCallback = paymentCallback;


    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.payment_type_dialog);
        ImageView cashIm= findViewById(R.id.cash_img);
        ImageView cardImg= findViewById(R.id.card_img);
        cardImg.setOnClickListener(this::onViewClicked);
        cashIm.setOnClickListener(this::onViewClicked);

    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @OnClick({R.id.cash_img, R.id.card_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.cash_img:
                paymentCallback.Callback("cash");
                dismiss();
                break;
            case R.id.card_img:
                paymentCallback.Callback("card");
                dismiss();
                break;
        }
    }
    public  interface paymentCallback{
        void Callback(String type);
    }
}