package com.soofer.app.CustomizeDialog;



import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;

import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.EventBus.FemaleDriverFlow;
import com.soofer.app.FlowInterface.CallRequest;
import com.soofer.app.Model.EstimationModel;
import com.soofer.app.R;

import org.greenrobot.eventbus.EventBus;

import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;

public class Female_driverDialog  extends Dialog {


    public Activity activity;

    @BindView(R.id.submit)
    Button submit;
    @BindView(R.id.cancel)
    Button cancel;

    CallRequest callRequest;

    private View decorView;
    private retrofit2.Response<EstimationModel> response ;

    public Female_driverDialog(Activity activity) {
        super(activity);
        // TODO Auto-generated constructor stub
        this.activity = activity;
        this.response = response;
        Objects.requireNonNull(getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

    }



    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.driver_dialog);
        ButterKnife.bind(this);
        submit.setOnClickListener(v -> {
                    CommonData.gender = "Male";
                    EventBus.getDefault().postSticky(new FemaleDriverFlow("ok"));
                    dismiss();
                }
                );
        cancel.setOnClickListener(v -> {
                    CommonData.gender = "cancel";
                    EventBus.getDefault().postSticky(new FemaleDriverFlow("cancel"));
                    dismiss();
                }
        );



    }

    @Override
    protected void onStop() {
        super.onStop();
    }
}
