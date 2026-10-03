package com.soofer.app.CustomizeDialog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.TextView;

import com.soofer.app.CommonClass.Constants;
import com.soofer.app.FlowInterface.CommonInterface;
import com.rengwuxian.materialedittext.MaterialEditText;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.Utiles;
import com.soofer.app.Model.PromoCodeModel;
import com.soofer.app.Presenter.PromocodePresenter;
import com.soofer.app.R;
import com.soofer.app.View.PromoView;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Objects;

import retrofit2.Response;

import static com.soofer.app.CommonClass.Utiles.DismissiAnimation;

public class PromocodeDialog extends Dialog implements PromoView {

    public Activity activity;
    public Dialog dialog;
    private MaterialEditText promocodeTxt;
    private Button submit;
    private TextView discount_amount_txt;
   private View decorView;
   private String temp ="";
    private String total;
    private CommonInterface commonInterface ;
    public PromocodeDialog(Activity activity,String total,CommonInterface commonInterface) {
        super(activity);
        // TODO Auto-generated constructor stub
        this.activity = activity;
        this.total = total;
        this.commonInterface = commonInterface;
        Objects.requireNonNull(getWindow()).setBackgroundDrawable(new ColorDrawable(android.graphics.Color.TRANSPARENT));

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.promocode);
        try {
            requestWindowFeature(Window.FEATURE_NO_TITLE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        ;
        submit = findViewById(R.id.submit);
        Button cancel_btn = findViewById(R.id.cancel_btn);
        decorView = Objects.requireNonNull(this.getWindow()).getDecorView();
        discount_amount_txt = findViewById(R.id.discount_amount_txt);
        promocodeTxt = findViewById(R.id.promocode_txt);
        cancel_btn.setOnClickListener(views->{
            dismiss();
        });
        submit.setOnClickListener(v -> {
            if (temp.equalsIgnoreCase("OK")) {
                DismissiAnimation(decorView, PromocodeDialog.this);
            } else {
                if (promocodeTxt.getText().toString().isEmpty()) {
                    promocodeTxt.setError(activity.getResources().getString(R.string.enter_your_promo_code));
                } else {
                    CommonData.strpromocode = promocodeTxt.getText().toString();
                    PromocodePresenterCall();
                }

            }

        });

    }

    private void PromocodePresenterCall() {
        PromocodePresenter promocodePresenter = new PromocodePresenter(activity, this);
        HashMap<String,String> map = new HashMap<>();
        map.put("promoCode",promocodeTxt.getText().toString());
        map.put("tripAmount",total);
        map.put("pickupLat", String.valueOf(CommonData.Pickuplat));
        map.put("pickupLng", String.valueOf(CommonData.Pickuplng));
        if(String.valueOf(Constants.isTwoDriver).equals("true")){
            map.put("tripType", "twodriver");
        } else {
            map.put("tripType", "daily");
        }
        promocodePresenter.getProcodeResult(map);

    }

    @SuppressLint("SetTextI18n")
    @Override
    public void OnSuccessfully(Response<PromoCodeModel> Response) {
        if (Response.body().getSuccess()) {
            discount_amount_txt.setVisibility(View.VISIBLE);
            discount_amount_txt.setText("Your Discount Value :" + Response.body().getDiscountAmt());
            submit.setText(R.string.okay);
            temp ="ok";
        } else {
            Utiles.displayMessage(getCurrentFocus(), activity, "Something Went Wrong");
        }
    }

    @Override
    public void OnFailure(Response<PromoCodeModel> Response) {
        if (Response.errorBody() != null) {
            try {
                String message = Response.errorBody().string();
                JSONObject jsonObject = new JSONObject(message);
                if (jsonObject.has("message")) {
                    Utiles.displayMessage(getCurrentFocus(), activity, jsonObject.optString("message"));
                }
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }
        }

    }
}
