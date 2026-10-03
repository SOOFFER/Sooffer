package com.soofer.driver.CommonClass;

import android.content.Context;
import android.util.Base64;
import android.util.Log;

import com.soofer.driver.View.Loginview;
import com.soofer.driver.View.RegisterView;

import java.io.UnsupportedEncodingException;

public class JWTUtils {

    public RegisterView registerView;
    public Loginview loginview;
    public JWTUtils(RegisterView registerView, Loginview loginview) {
        this.registerView = registerView;
        this.loginview = loginview;
    }


        public  void decoded(String JWTEncoded , Context context , String page) throws Exception {
        try {
            String[] split = JWTEncoded.split("\\.");
            Log.d("JWT_DECODED", "Header: " + getJson(split[0]));
            Log.d("JWT_DECODED", "Body: " + getJson(split[1]));

            if(page.equals("reg")){
                registerView.JsonResponse(getJson(split[1]));
            }else if(page.equals("login")){
                loginview.JsonResponse(getJson(split[1]));
            }

        } catch (UnsupportedEncodingException e) {
            //Error
        }
    }

    private static String getJson(String strEncoded) throws UnsupportedEncodingException {
        byte[] decodedBytes = Base64.decode(strEncoded, Base64.URL_SAFE);
        return new String(decodedBytes, "UTF-8");
    }
}
