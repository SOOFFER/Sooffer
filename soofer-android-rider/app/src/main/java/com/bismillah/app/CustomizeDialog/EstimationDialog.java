package com.bismillah.app.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.bismillah.app.CommonClass.CommonData;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.Model.EstimationModel;
import com.bismillah.app.R;

import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.Unbinder;
import retrofit2.Response;

public class EstimationDialog extends Dialog {

    public Activity activity;
    @BindView(R.id.category_txt)
    TextView categoryTxt;
    @BindView(R.id.fare_txt)
    TextView fareTxt;
    @BindView(R.id.km_fare_txt)
    TextView kmFareTxt;
    @BindView(R.id.app_logo_img)
    ImageView appLogoImg;
    @BindView(R.id.label_txt)
    TextView labelTxt;
    private View decorView;
    private Response<EstimationModel> response;

    public EstimationDialog(Activity activity, Response<EstimationModel> response) {
        super(activity);
        // TODO Auto-generated constructor stub
        this.activity = activity;
        this.response = response;
        Objects.requireNonNull(getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

    }

    private Unbinder unbinder;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fare_dialog);
        unbinder = ButterKnife.bind(this);

        try {
            categoryTxt.setText(Utiles.NullPointer(CommonData.strServiceType));
            assert response.body() != null;
            fareTxt.setText("$ " + response.body().getVehicleDetailsAndFare().getFareDetails().getTotalFare());
            labelTxt.setText(response.body().getGstLabel());
            kmFareTxt.setText("$ " + response.body().getVehicleDetailsAndFare().getFareDetails().getPerKMRate() + " / Mile");
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    @Override
    protected void onStop() {
        super.onStop();
        if (unbinder != null) {
            unbinder.unbind();
        }
    }
}
