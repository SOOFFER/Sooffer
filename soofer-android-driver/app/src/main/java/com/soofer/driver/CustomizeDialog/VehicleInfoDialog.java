package com.soofer.driver.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.Window;

import androidx.annotation.NonNull;

import com.soofer.driver.R;

import butterknife.ButterKnife;

/**
 * Created by com on 18-Sep-18.
 */

public class VehicleInfoDialog extends Dialog {

    public Context activity;


    public VehicleInfoDialog(@NonNull Context activity) {
        super(activity);
        this.activity = activity;

    }

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            requestWindowFeature(Window.FEATURE_NO_TITLE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        setContentView(R.layout.meter_dialog);
        ButterKnife.bind(this);

    }



}
