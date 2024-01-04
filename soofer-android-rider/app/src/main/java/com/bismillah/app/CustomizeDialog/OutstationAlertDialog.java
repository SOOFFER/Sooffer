package com.bismillah.app.CustomizeDialog;

import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import androidx.annotation.NonNull;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Space;
import android.widget.TextView;

import com.bismillah.app.EventBus.EstimationChanges;
import com.bismillah.app.R;

import org.greenrobot.eventbus.EventBus;

import java.util.Objects;

import butterknife.BindView;

/**
 * Created by com on 18-Sep-18.
 */

public class OutstationAlertDialog extends Dialog {

    public Activity activity;
    @BindView(R.id.category_txt)
    TextView categoryTxt;
    @BindView(R.id.drop_btn)
    Button dropBtn;
    @BindView(R.id.center_spacing)
    Space centerSpacing;
    @BindView(R.id.continue_btn)
    Button continueBtn;
    @BindView(R.id.ride_layout)
    LinearLayout rideLayout;
    @BindView(R.id.app_logo_img)
    ImageView appLogoImg;


    public OutstationAlertDialog(@NonNull Activity activity) {
        super(activity);
        this.activity = activity;
        Objects.requireNonNull(getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.outstationalert);
        Button drop_btn = findViewById(R.id.drop_btn);
        Button continue_btn = findViewById(R.id.continue_btn);
        drop_btn.setOnClickListener(this::onViewClicked);
        continue_btn.setOnClickListener(this::onViewClicked);

    }
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.drop_btn:
                dismiss();
                EventBus.getDefault().post(new EstimationChanges("change drop"));
                break;
            case R.id.continue_btn:
                dismiss();
                EventBus.getDefault().post(new EstimationChanges("Outstation"));
                break;
        }
    }

}
