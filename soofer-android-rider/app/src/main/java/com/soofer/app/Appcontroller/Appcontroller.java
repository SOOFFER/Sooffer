package com.soofer.app.Appcontroller;

import android.annotation.SuppressLint;
import android.content.Context;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.multidex.MultiDex;
import androidx.multidex.MultiDexApplication;


import com.google.firebase.database.FirebaseDatabase;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.R;

import io.github.inflationx.calligraphy3.CalligraphyConfig;
import io.github.inflationx.calligraphy3.CalligraphyInterceptor;
import io.github.inflationx.viewpump.ViewPump;


/**
 * Created by com on 3/4/18.
 */

@SuppressLint("Registered")
public class Appcontroller extends MultiDexApplication {

    private static final String TAG = Appcontroller.class.getSimpleName();
    private static Context context;

    @Override
    public void onCreate() {
        super.onCreate();

        MultiDex.install(this);
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
        final String appPackageName = getPackageName(); // getPackageName() from Context or Activity object
        AppSignatureHelper appSignature = new AppSignatureHelper(this);
        SharedHelper.putToken(this,"hash_token",appSignature.getAppSignatures().get(0));
        FirebaseDatabase.getInstance().setPersistenceEnabled(true);

        ViewPump.init(ViewPump.builder()
                .addInterceptor(new CalligraphyInterceptor(
                        new CalligraphyConfig.Builder()
                                .setDefaultFontPath(getString(R.string.app_font))
                                .setFontAttrId(R.attr.fontPath)
                                .build()))
                .build());

        context = getApplicationContext();

    }



    public static Context getContexts() {
        return context;
    }
}
