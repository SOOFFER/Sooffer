package com.bismillah.driver.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.Window;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.bismillah.driver.CommonClass.CommonData;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.R;

import butterknife.BindView;
import butterknife.ButterKnife;

public class RiderVehicleDetails extends Dialog {

    @BindView(R.id.tv_name)
    TextView Name;
    @BindView(R.id.tv_model)
    TextView Model;
    @BindView(R.id.tv_number)
    TextView Number;
    @BindView(R.id.tv_colour)
    TextView Colour;

    public RiderVehicleDetails(@NonNull Context context) {
        super(context);

    }

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.rider_vehi_details);
        ButterKnife.bind(this);
        try {
            Name.setText(SharedHelper.getKey(getContext(), "carMakename"));
            Model.setText(SharedHelper.getKey(getContext(), "carModel"));
            Number.setText(SharedHelper.getKey(getContext(), "carNumber"));
            Colour.setText(SharedHelper.getKey(getContext(), "carColor"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("details###"+ SharedHelper.getKey(getContext(), "carMakename"));

    }
}
