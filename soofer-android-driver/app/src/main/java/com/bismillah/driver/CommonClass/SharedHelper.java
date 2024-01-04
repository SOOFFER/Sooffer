package com.bismillah.driver.CommonClass;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class SharedHelper {
    private static SharedPreferences sharedPreferences;
    private static SharedPreferences.Editor editor;

    public static void putKey(Context context, String Key, String Value) {
        sharedPreferences = context.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
        editor.putString(Key, Value);
        editor.apply();

    }

    public static String getKey(Context contextGetKey, String Key) {
        sharedPreferences = contextGetKey.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        String Value = sharedPreferences.getString(Key, "");
        return Value;

    }
    @SuppressLint("CommitPrefEdits")
    public static void setCategory(Context contextGetKey, String Key, ArrayList<String> Value) {
        sharedPreferences = contextGetKey.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        Set<String> set = new HashSet<String>();
        set.addAll(Value);
        editor = sharedPreferences.edit();
        editor.putStringSet(Key, set);
        editor.apply();
    }

    public static List<String> getCategoryList(Context contextGetKey, String Key) {
        sharedPreferences = contextGetKey.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        Set<String> set = new HashSet<String>();
        set = sharedPreferences.getStringSet(Key, null);
        if(set!=null)
            return new ArrayList<>(set);
        else
            return new ArrayList<>();

    }
    public static void putToken(Context context, String Key, String Value) {
        sharedPreferences = context.getSharedPreferences("Token", Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
        editor.putString(Key, Value);
        editor.apply();

    }

    public static void putOnline(Context context, String Key, Boolean Value) {
        sharedPreferences = context.getSharedPreferences("Token", Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
        editor.putBoolean(Key, Value);
        editor.apply();

    }

    public static String getToken(Context contextGetKey, String Key) {
        sharedPreferences = contextGetKey.getSharedPreferences("Token", Context.MODE_PRIVATE);
        String Value = sharedPreferences.getString(Key, "");
        return Value;

    }

    public static Boolean getOnlineStatus(Context contextGetKey, String Key) {
        sharedPreferences = contextGetKey.getSharedPreferences("Token", Context.MODE_PRIVATE);
        Boolean Value = sharedPreferences.getBoolean(Key, false);
        return Value;

    }

    public static void clearSharedPreferences(Context context) {
        sharedPreferences = context.getSharedPreferences("Cache", Context.MODE_PRIVATE);
        sharedPreferences.edit().clear().apply();
    }

}
