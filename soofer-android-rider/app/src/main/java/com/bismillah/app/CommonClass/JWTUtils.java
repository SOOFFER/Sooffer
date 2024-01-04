package com.bismillah.app.CommonClass;

import android.util.Base64;
import android.util.Log;

import com.bismillah.app.View.Loginview;
import com.bismillah.app.View.RegisterView;

import java.io.UnsupportedEncodingException;

public class JWTUtils {


    static public RegisterView registerView;
    static public Loginview loginview;

    public JWTUtils(RegisterView registerView, Loginview loginview) {
        this.registerView = registerView;
        this.loginview = loginview;
    }

    public static void decoded(String JWTEncoded, String page) throws Exception {
        try {
            String[] split = JWTEncoded.split("\\.");
            Log.d("JWT_DECODED", "Header: " + getJson(split[0]));
            Log.d("JWT_DECODED", "Body: " + getJson(split[1]));

            if (page.equals("reg")) {
                registerView.JsonResponse(getJson(split[1]));
            } else if (page.equals("login")) {
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
