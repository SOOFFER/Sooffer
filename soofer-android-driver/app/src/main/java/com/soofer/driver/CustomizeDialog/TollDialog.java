package com.soofer.driver.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.Window;

import androidx.annotation.NonNull;

import com.soofer.driver.R;
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

public class TollDialog extends Dialog {

    public Activity activity;


    @BindView(R.id.toll_amount_edt)
    MaterialEditText tollAmountEdt;
    private Boolean status = false;

    private MeterDialog.MeterCallback meterCallback;

    public TollDialog(@NonNull Activity activity, Boolean status, MeterDialog.MeterCallback meterCallback) {
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
        setContentView(R.layout.toll_amount_dialog);
        ButterKnife.bind(this);


    }

    @OnClick({R.id.submit_btn,R.id.cancel_btn})
    public void onViewClicked(View view) {
        switch (view.getId()){
            case R.id.submit_btn:
                dismiss();
                try {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("trip_type","normal");
                    jsonObject.put("toll_amount", Objects.requireNonNull(tollAmountEdt.getText()).toString());
                    meterCallback.onSuccess(jsonObject, status);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case R.id.cancel_btn:
                dismiss();
                try {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("trip_type","normal");
                    jsonObject.put("toll_amount", "0");
                    meterCallback.onSuccess(jsonObject, status);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
        }


    }


}
