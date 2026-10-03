package com.soofer.driver.CommonClass;

import android.app.Activity;
import android.widget.Toast;

import com.razorpay.Checkout;
import com.soofer.driver.R;

import org.json.JSONObject;


public class RazorPayPaymentModule {
    private Activity activity;
    public RazorPayPaymentModule(Activity activity){
        this.activity = activity;
    }

    public void makePayment(String value , String type ){
        Checkout co = new Checkout();
        co.setImage(R.drawable.ic_applogo);

        try {
            double values =Double.parseDouble(value);
            int d = (int) Math.ceil(values*100);

            JSONObject options = new JSONObject();
            options.put("name",activity.getResources().getString(R.string.app_name));
            options.put("description",type);
            options.put("image","https://s3.amazonaws.com/rzp-mobile/images/rzp.png");
            options.put("currency","INR");
            options.put("amount",d);
            JSONObject prefill = new JSONObject();
            prefill.put("email", SharedHelper.getKey(activity, "emailid"));
            prefill.put("contact", SharedHelper.getKey(activity, "cc")+SharedHelper.getKey(activity, "mobile"));
            options.put("prefill",prefill);
            co.open(activity,options);
        }catch ( Exception e){
            Toast.makeText(activity,e.getMessage(), Toast.LENGTH_LONG).show();
            e.printStackTrace();
        }

    }
}
