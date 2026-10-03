package com.soofer.driver.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.view.Window;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.airbnb.lottie.LottieAnimationView;
import com.soofer.driver.FlowInterface.CommonInterface;
import com.soofer.driver.R;

import butterknife.BindView;

public class UserAlertDialog extends Dialog {

    public Activity activity;


    CommonInterface callPermission;

    @BindView(R.id.close_imgbtn)
    ImageButton closeImgbtn;
    @BindView(R.id.animation_view)
    LottieAnimationView animationView;
    @BindView(R.id.wallet_balance_txt)
    TextView walletBalanceTxt;


    public UserAlertDialog(@NonNull Activity activity, CommonInterface callPermission) {
        super(activity);
        this.activity = activity;
        this.callPermission = callPermission;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.user_alert_dialog);
        walletBalanceTxt = findViewById(R.id.wallet_balance_txt);
        closeImgbtn = findViewById(R.id.close_imgbtn);
        closeImgbtn.setOnClickListener(view -> {
            callPermission.onCallback("");
            dismiss();

        });
    }


}
