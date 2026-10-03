package com.soofer.driver.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.mukesh.OtpView;
import com.soofer.driver.BuildConfig;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.OTPEvent;
import com.soofer.driver.Model.CityModel;
import com.soofer.driver.Model.CountryModel;
import com.soofer.driver.Model.OTPModel;
import com.soofer.driver.Model.RegisterModel;
import com.soofer.driver.Model.StateModel;
import com.soofer.driver.Presenter.RegisterPresenter;
import com.soofer.driver.R;
import com.soofer.driver.View.RegisterView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import butterknife.BindView;
import retrofit2.Response;

/**
 * Created by com on 25-Jul-18.
 */

public class OTPCustomerDialog extends Dialog {

    public Activity activity;


    @BindView(R.id.submit)
    Button submit;

    public String strOTP;
    public RegisterView registerView;
    @BindView(R.id.otp_view)
    OtpView otpView;
    @BindView(R.id.discount_amount_txt)
    TextView discountAmountTxt;
    private JSONObject jsonObject;
    private RegisterPresenter registerPresenter;
    private CountDownTimer countDownTimer;
    private String strTemp = "";
    public OTPCustomerDialog(@NonNull Activity activity, String OTP, RegisterView registerView,JSONObject jsonObject) {
        super(activity, R.style.DialogStyle);
        this.activity = activity;
        this.strOTP = OTP;
        this.registerView = registerView;
        this.jsonObject = jsonObject;

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.otpverification);
        otpView = findViewById(R.id.otp_view);
        discountAmountTxt = findViewById(R.id.discount_amount_txt);
        submit = findViewById(R.id.submit);
       // otpView.setText(strOTP);
        if(BuildConfig.DEBUG){
//            otpView.setText(strOTP);
        }


        submit.setOnClickListener(view -> {
            System.out.println("Enter the opt" + Objects.requireNonNull(otpView.getText()).toString());
            if (otpView.getText().toString().isEmpty()) {
                Utiles.displayMessage(getCurrentFocus(), activity.getApplicationContext(), activity.getResources().getString(R.string.enter_your_otp));

            } else if (!strOTP.equals(otpView.getText().toString())) {
                Utiles.displayMessage(getCurrentFocus(), activity.getApplicationContext(), activity.getResources().getString(R.string.enter_valid_otp));
            } else {
                dismiss();
                registerView.OTPVerification();
            }

        });

        registerPresenter = new RegisterPresenter(new RegisterView() {
            @Override
            public void RegisterView(Response<RegisterModel> Response) {

            }

            @Override
            public void Errorlogview(Response<RegisterModel> Response) {

            }

            @Override
            public void JsonResponse(String object) {

            }

            @Override
            public void onSuccessOTP(Response<OTPModel> Response) {
                assert Response.body() != null;
                strOTP = Response.body().getCode();
                countDownTimer =null;
                initCountDownTimer();
            }

            @Override
            public void onFailureOTP(Response<OTPModel> Response) {
                try {
                    assert Response.errorBody() != null;
                    String Message = Response.errorBody().string();

                    JSONObject jsonObject = new JSONObject(Message);
                    if (jsonObject.has("message")) {
                        Utiles.displayMessage(getCurrentFocus(), activity, jsonObject.optString("message"));
                    }

                } catch (IOException | JSONException e) {
                    Utiles.displayMessage(getCurrentFocus(), activity, activity.getResources().getString(R.string.something_went_wrong));
                }
            }

            @Override
            public void OTPVerification() {

            }

            @Override
            public void countrysuccess(Response<List<CountryModel>> Response) {

            }

            @Override
            public void countryfailure(Response<List<CountryModel>> Response) {

            }

            @Override
            public void statesuccess(Response<List<StateModel>> Response) {

            }

            @Override
            public void statefailure(Response<List<StateModel>> Response) {

            }

            @Override
            public void citysuccess(Response<List<CityModel>> Response) {

            }

            @Override
            public void cityfailure(Response<List<CityModel>> Response) {

            }
        });
        discountAmountTxt.setOnClickListener(view -> {
            if (strTemp.equalsIgnoreCase("resend")) {
                registerPresenter.getOTP(jsonObject.optString("mobile"), jsonObject.optString("email"), jsonObject.optString("cc"), strOTP, activity);

            }
        });
        initCountDownTimer();
    }


    @Override
    protected void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        EventBus.getDefault().unregister(this);
    }




    @SuppressLint("SetTextI18n")
    private void initCountDownTimer() {
        if(countDownTimer==null){
            countDownTimer = new CountDownTimer(70000, 1000) {

                @SuppressLint("DefaultLocale")
                public void onTick(long millisUntilFinished) {

                    discountAmountTxt.setText("" + String.format("%d min, %d sec",
                            TimeUnit.MILLISECONDS.toMinutes(millisUntilFinished),
                            TimeUnit.MILLISECONDS.toSeconds(millisUntilFinished) -
                                    TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(millisUntilFinished))));

                }

                public void onFinish() {
                    strTemp = "resend";
                    discountAmountTxt.setText(activity.getResources().getString(R.string.resend_otp));
                    countDownTimer =null;
                }
            }.start();
        }

    }
    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onEvent(OTPEvent event)
    {
        otpView.setText(event.strotp);
        EventBus.getDefault().removeStickyEvent(event);
    }
}

