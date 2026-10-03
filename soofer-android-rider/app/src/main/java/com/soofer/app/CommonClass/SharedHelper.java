package com.soofer.app.CommonClass;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.soofer.app.Model.LocalModel.LocalAddressStoreModel;

import java.util.ArrayList;

public class SharedHelper {
    public static SharedPreferences sharedPreferences;
    public static SharedPreferences.Editor editor;

    public static Gson gson;

    @SuppressLint("CommitPrefEdits")
    public static void setAddresslist(Context contextGetKey, String Key, ArrayList<LocalAddressStoreModel> Value) {
        sharedPreferences = contextGetKey.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        gson = new Gson();
        String jsonCars = gson.toJson(Value);
        editor = sharedPreferences.edit();
        editor.putString(Key, jsonCars);
        editor.apply();
    }

    public static void putKey(Context context, String Key, String Value) {
        sharedPreferences = context.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
        editor.putString(Key, Value);
        editor.apply();

    }

    public static String getKey(Context contextGetKey, String Key) {
        sharedPreferences = contextGetKey.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        return sharedPreferences.getString(Key, "");

    }

    public static void clearSharedPreferences(Context context) {
        sharedPreferences = context.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        sharedPreferences.edit().clear().apply();
    }
    public static void putToken(Context context, String Key, String Value) {
        sharedPreferences = context.getSharedPreferences("Token", Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
        editor.putString(Key, Value);
        editor.apply();

    }

    public static String getToken(Context contextGetKey, String Key) {
        sharedPreferences = contextGetKey.getSharedPreferences("Token", Context.MODE_PRIVATE);
        String Value = sharedPreferences.getString(Key, "");
        return Value;

    }

    public static void putStatus(Context context, String Key, Boolean Value) {
        sharedPreferences = context.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
        editor.putBoolean(Key, Value);
        editor.apply();

    }
    public static Boolean getStatus(Context contextGetKey, String Key) {
        sharedPreferences = contextGetKey.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        Boolean Value = sharedPreferences.getBoolean(Key, false);
        return Value;

    }
}
