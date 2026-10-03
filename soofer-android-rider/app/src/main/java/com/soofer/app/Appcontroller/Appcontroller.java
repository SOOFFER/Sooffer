package com.soofer.app.Appcontroller;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;
import android.util.DisplayMetrics;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.multidex.MultiDex;
import androidx.multidex.MultiDexApplication;

import com.google.firebase.database.FirebaseDatabase;
import com.soofer.app.Appcontroller.AppSignatureHelper;
import com.soofer.app.CommonClass.SharedHelper;

@SuppressLint("Registered")
public class Appcontroller extends MultiDexApplication {
    private static Context context;
    public static final String CHANNEL_ID = "120";

    @Override
    public void onCreate() {
        super.onCreate();
        MultiDex.install(this);
        context = getApplicationContext();
        createNotificationChannel();
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
        AppSignatureHelper appSignature = new AppSignatureHelper(this);
        appSignature.getAppSignatures();
        SharedHelper.putToken(this,"hash_token",appSignature.getAppSignatures().get(0));
        FirebaseDatabase.getInstance().setPersistenceEnabled(true);

    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(adjustFontScale(base));
    }

    private Context adjustFontScale(Context context) {
        Configuration configuration = context.getResources().getConfiguration();
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();

        configuration.fontScale = 1.0f; // Set font scale to default
        int defaultDensity = DisplayMetrics.DENSITY_DEFAULT;
        float targetDensity = displayMetrics.density;

        configuration.densityDpi = (int) (targetDensity * defaultDensity);

        return context.createConfigurationContext(configuration);
    }


    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Example Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            assert manager != null;
            manager.createNotificationChannel(serviceChannel);
            manager.cancelAll();
        }
    }




    public static Context getContexts() {
        return context;
    }
}
