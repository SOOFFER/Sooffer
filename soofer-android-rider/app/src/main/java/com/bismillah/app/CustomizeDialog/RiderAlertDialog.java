package com.bismillah.app.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import androidx.annotation.NonNull;
import android.view.Window;
import android.widget.ImageButton;
import android.widget.TextView;

import com.airbnb.lottie.LottieAnimationView;
import com.bismillah.app.R;

import butterknife.BindView;

/**
 * Created by com on 18-Sep-18.
 */

public class RiderAlertDialog extends Dialog {

    public Activity activity;
    public String Message;
    @BindView(R.id.close_imgbtn)
    ImageButton closeImgbtn;
    @BindView(R.id.animation_view)
    LottieAnimationView animationView;
    @BindView(R.id.title_txt)
    TextView title_txt;


    public RiderAlertDialog(@NonNull Activity activity, String Message) {
        super(activity);
        this.activity = activity;
        this.Message = Message;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.rideralert);
        title_txt = findViewById(R.id.title_txt);
        title_txt.setText(Message);
        closeImgbtn = findViewById(R.id.close_imgbtn);
        closeImgbtn.setOnClickListener(view -> {
            dismiss();

        });
    }
}
