package com.bismillah.driver.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.R;
import com.rengwuxian.materialedittext.MaterialEditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Objects;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

/**
 * Created by com on 18-Sep-18.
 */

public class MeterDialog extends Dialog {

    public Activity activity;

    @BindView(R.id.submit)
    Button submit;
    @BindView(R.id.category_txt)
    TextView categoryTxt;
    @BindView(R.id.mobile_edt)
    MaterialEditText mobileEdt;
    @BindView(R.id.app_logo_img)
    ImageView appLogoImg;
    @BindView(R.id.hill_amount_edt)
    MaterialEditText hillAmountEdt;
    @BindView(R.id.oto_meter)
    TextView otoMeter;
    @BindView(R.id.toll_amount_edt)
    MaterialEditText tollAmountEdt;
    private Boolean status = false;

    private MeterCallback meterCallback;

    public MeterDialog(@NonNull Activity activity, Boolean status, MeterCallback meterCallback) {
        super(activity);
        this.activity = activity;
        Objects.requireNonNull(getWindow()).setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        this.status = status;
        this.meterCallback = meterCallback;

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
        if (status) {
            mobileEdt.setHint(R.string.enter_you_start_km);
            otoMeter.setText(R.string.odometer_reading_at_the_start_of_the_trip);
        } else {
            mobileEdt.setHint(R.string.enter_your_end_km);
            otoMeter.setText(R.string.odometer_reading_at_the_end_of_the_trip);
            tollAmountEdt.setVisibility(View.VISIBLE);
            if (SharedHelper.getKey(activity, "ride_type").equalsIgnoreCase("outstation")) {
                hillAmountEdt.setVisibility(View.GONE);
            } else {
                hillAmountEdt.setVisibility(View.GONE);
            }
        }

    }

    @OnClick(R.id.submit)
    public void onViewClicked() {
        if (Objects.requireNonNull(mobileEdt.getText()).toString().isEmpty()) {
            mobileEdt.setError(activity.getResources().getString(R.string.enter_your_km));
        } else {
            dismiss();
            try {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("trip_type","other_type");
                jsonObject.put("distance", mobileEdt.getText().toString());
                jsonObject.put("hillstation", Objects.requireNonNull(hillAmountEdt.getText()).toString());
                jsonObject.put("toll_amount", Objects.requireNonNull(tollAmountEdt.getText()).toString());
                meterCallback.onSuccess(jsonObject, status);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    public interface MeterCallback {
        void onSuccess(JSONObject object, boolean ischeck);
    }
}
