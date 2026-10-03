package com.soofer.driver.ApplicationController;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.multidex.MultiDexApplication;

import com.google.firebase.database.FirebaseDatabase;

import io.github.inflationx.viewpump.ViewPump;


@SuppressLint("Registered")
public class AppController extends MultiDexApplication {
    public static final String CHANNEL_ID = "120";
    public static Context context;

    @Override
    public void onCreate() {
        super.onCreate();
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
        createNotificationChannel();
        context = getApplicationContext();
        FirebaseDatabase.getInstance().setPersistenceEnabled(true);
        ViewPump.init(ViewPump.builder().build());
    }

    private void createNotificationChannel() {
        NotificationChannel serviceChannel = new NotificationChannel(
                CHANNEL_ID,
                "Example Service Channel",
                NotificationManager.IMPORTANCE_HIGH
        );

        NotificationManager manager = getSystemService(NotificationManager.class);
        assert manager != null;
        manager.createNotificationChannel(serviceChannel);
        manager.cancelAll();
    }

    public static Context getContexts() {
        return context;
    }


}
