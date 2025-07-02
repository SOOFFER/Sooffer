package com.soofer.app.CommonClass;

import android.app.Activity;
import android.widget.Toast;

import com.razorpay.Checkout;
import com.soofer.app.BuildConfig;
import com.soofer.app.R;

import org.json.JSONObject;

public class RazorPayModule {
    public Activity activity;
    public RazorPayModule(Activity activity){
        this.activity=activity;

    }
    public void makepaymentGateway(Activity activity,String amount,String type,String phone) {
        Checkout ch=new Checkout();
        ch.setImage(R.mipmap.ic_launcher);
        try{

            JSONObject jsonObject=new JSONObject();
            jsonObject.put("name","BES Enterprise");
            jsonObject.put("description",type);
            jsonObject.put("image","https://s3.amazonaws.com/rzp-mobile/images/rzp.png");
            jsonObject.put("currency","USD");
            jsonObject.put("amount",amount);
            JSONObject prefil=new JSONObject();
            prefil.put("email","keerthi@gmail.com");
            if(BuildConfig.DEBUG){
                prefil.put("contact",phone);
            }else{
                prefil.put("contact",phone);
                jsonObject.put("prefil",prefil);
            }
            ch.open(activity,jsonObject);
        }
        catch (Exception e){
            Toast.makeText(activity, e.getMessage(), Toast.LENGTH_SHORT).show();
            e.printStackTrace();
        }


    }
}
