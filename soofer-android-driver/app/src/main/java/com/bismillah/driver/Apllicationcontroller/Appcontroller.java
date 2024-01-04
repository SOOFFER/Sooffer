package com.bismillah.driver.Apllicationcontroller;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.multidex.MultiDex;
import androidx.multidex.MultiDexApplication;
import com.google.firebase.database.FirebaseDatabase;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.R;
import io.github.inflationx.calligraphy3.CalligraphyConfig;
import io.github.inflationx.calligraphy3.CalligraphyInterceptor;
import io.github.inflationx.viewpump.ViewPump;

/**
 * Created by com on 3/4/18.
 */

@SuppressLint("Registered")
public class Appcontroller extends MultiDexApplication {
    public static final String CHANNEL_ID = "2000";
    public static Context context;

    @Override
    public void onCreate() {
        super.onCreate();
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
        MultiDex.install(this);
        createNotificationChannel();
        context = getApplicationContext();
        final String appPackageName = getPackageName(); // getPackageName() from Context or Activity object
        AppSignatureHelper appSignature = new AppSignatureHelper(this);

        SharedHelper.putToken(this,"hash_token",appSignature.getAppSignatures().get(0));

        FirebaseDatabase.getInstance().setPersistenceEnabled(true);

        ViewPump.init(ViewPump.builder()
                .addInterceptor(new CalligraphyInterceptor(
                        new CalligraphyConfig.Builder()
                                .setDefaultFontPath(getString(R.string.app_font))
                                .setFontAttrId(R.attr.fontPath)
                                .build())).build());

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
