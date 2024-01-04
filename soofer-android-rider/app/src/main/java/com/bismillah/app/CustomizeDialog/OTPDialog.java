package com.bismillah.app.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.bismillah.app.BuildConfig;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.EventBus.OTPEvent;
import com.bismillah.app.Model.OTPModel;
import com.bismillah.app.Model.RegisterModel;
import com.bismillah.app.Presenter.RegisterPresenter;
import com.bismillah.app.R;
import com.bismillah.app.View.RegisterView;
import com.mukesh.OnOtpCompletionListener;
import com.mukesh.OtpView;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import butterknife.BindView;
import retrofit2.Response;

/**
 * Created by com on 25-Jul-18.
 */

public class OTPDialog extends Dialog implements OnOtpCompletionListener {

    public Activity activity;
    @BindView(R.id.otp_view)
    OtpView otpView;

    @BindView(R.id.submit)
    Button submit;
    @BindView(R.id.discount_amount_txt)
    TextView discountAmountTxt;

    private String strOTP ="";
    private RegisterView registerView;
    private JSONObject jsonObject;
    private RegisterPresenter registerPresenter;
    private CountDownTimer countDownTimer;
    private String strTemp ="";

    public OTPDialog(@NonNull Activity activity, String OTP, RegisterView registerView, JSONObject jsonObject) {
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
        if(BuildConfig.DEBUG){
//            otpView.setText(strOTP);
        }

        discountAmountTxt = findViewById(R.id.discount_amount_txt);
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
                    Utiles.displayMessage(getCurrentFocus(), activity, "Something went Wrong");
                }
            }

            @Override
            public void OTPVerification() {

            }
        });
        otpView.setOtpCompletionListener(this);
        submit = findViewById(R.id.submit);
        submit.setOnClickListener(view -> {
            try {
                if (Objects.requireNonNull(otpView.getText()).toString().isEmpty()) {
                    Utiles.displayMessage(getCurrentFocus(), activity.getApplicationContext(), activity.getResources().getString(R.string.enter_Valid_otp));
                } else if (!strOTP.equals(otpView.getText().toString())) {
                    Utiles.displayMessage(getCurrentFocus(), activity.getApplicationContext(), activity.getResources().getResourceName(R.string.enter_Valid_otp));
                } else {
                    dismiss();
                    registerView.OTPVerification();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        });
        discountAmountTxt.setOnClickListener(view -> {
            if (strTemp.equalsIgnoreCase("send")) {
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

    @Override
    public void onOtpCompleted(String otp) {

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
                    discountAmountTxt.setText(R.string.resend_otp);
                    strTemp ="send";
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

