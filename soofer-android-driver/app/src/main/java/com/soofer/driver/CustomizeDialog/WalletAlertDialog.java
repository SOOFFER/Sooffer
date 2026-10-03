package com.soofer.driver.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import androidx.annotation.NonNull;
import android.view.Window;
import android.widget.ImageButton;
import android.widget.TextView;

import com.airbnb.lottie.LottieAnimationView;
import com.soofer.driver.R;
import com.soofer.driver.View.TripInterface;

import butterknife.BindView;

/**
 * Created by com on 18-Sep-18.
 */

public class WalletAlertDialog extends Dialog {

    public Activity activity;


    TripInterface tripInterface;
    public String amount;
    @BindView(R.id.close_imgbtn)
    ImageButton closeImgbtn;
    @BindView(R.id.animation_view)
    LottieAnimationView animationView;
    @BindView(R.id.wallet_balance_txt)
    TextView walletBalanceTxt;

    private Boolean from;

    public WalletAlertDialog(@NonNull Activity activity, String amount, Boolean from) {
        super(activity);
        this.activity = activity;
        this.amount = amount;
        this.from = from;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.walletalertdialog);
        walletBalanceTxt = findViewById(R.id.wallet_balance_txt);
        closeImgbtn = findViewById(R.id.close_imgbtn);
        if (from) {
            walletBalanceTxt.setText(amount);
        } else {
            walletBalanceTxt.setText(amount);
        }

        closeImgbtn.setOnClickListener(view -> {
            dismiss();

        });
    }
}
