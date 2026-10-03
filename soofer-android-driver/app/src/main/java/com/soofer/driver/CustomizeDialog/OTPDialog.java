package com.soofer.driver.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import androidx.annotation.NonNull;

import android.view.View;
import android.view.Window;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.TextView;

import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.R;
import com.soofer.driver.View.TripInterface;
import com.mukesh.OtpView;

import butterknife.BindView;

/**
 * Created by com on 18-Sep-18.
 */

public class OTPDialog extends Dialog {

    public Activity activity;

    @BindView(R.id.submit)
    Button submit;
    private TripInterface tripInterface;
    private String strOTP;
    private Boolean status;
    @BindView(R.id.otp_view)
    OtpView otpView;
    @BindView(R.id.discount_amount_txt)
    TextView discountAmountTxt;
    public OTPDialog(@NonNull Activity activity, String OTP, TripInterface tripInterface, Boolean status) {
        super(activity, R.style.DialogStyle);
        this.activity = activity;
        this.strOTP = OTP;
        this.tripInterface = tripInterface;
        this.status = status;

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.otpverification);
        otpView = findViewById(R.id.otp_view);
        submit = findViewById(R.id.submit);
        discountAmountTxt = findViewById(R.id.discount_amount_txt);
        discountAmountTxt.setVisibility(View.GONE);


        submit.setOnClickListener(view -> {
            try {

                if (otpView.getText().toString().isEmpty()) {
                    Utiles.displayMessage(getCurrentFocus(), activity, activity.getString(R.string.enter_otp));

                } else if (!strOTP.equals(otpView.getText().toString())) {
                    Utiles.displayMessage(getCurrentFocus(), activity, activity.getString(R.string.enter_valid_otp));
                } else {
                    tripInterface.CheckTripStatus(status);
                    dismiss();

                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        findViewById(R.id.otp_view).postDelayed(
                new Runnable() {
                    public void run() {
                        otpView.requestFocus();
                        InputMethodManager inputMethodManager =  (InputMethodManager)activity.getSystemService(Context.INPUT_METHOD_SERVICE);
                        inputMethodManager.showSoftInput(otpView,InputMethodManager.SHOW_IMPLICIT);
                    }
                },100);
    }
}
