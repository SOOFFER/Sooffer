package com.bismillah.driver.CommonClass.Receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.Presenter.DriverPresenter;
import com.bismillah.driver.Service.TripRquestService;

import static com.bismillah.driver.CommonClass.CommonData.isFistTime;
import static com.bismillah.driver.CommonClass.Utiles.isMyServiceRunning;

public class BootBroadcastReceiver extends BroadcastReceiver {
    static final String ACTION = "android.intent.action.BOOT_COMPLETED";
    static final String ACTION2 = "android.intent.action.QUICKBOOT_POWERON";
    static final String ACTION3 = "com.htc.intent.action.QUICKBOOT_POWERON";

    @Override
    public void onReceive(Context context, Intent intent) {
        // BOOT_COMPLETED” start Service
        try {
            if (intent.getAction().equals(ACTION) | intent.getAction().equals(ACTION2) | intent.getAction().equals(ACTION3)) {
                if (SharedHelper.getKey(context, "userid") != null && !SharedHelper.getKey(context, "userid").isEmpty()) {
                    isFistTime = true;

                    if (!isMyServiceRunning(context, TripRquestService.class)) {
                        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                            context.startService(new Intent(context, TripRquestService.class));
                        } else {
                            Intent serviceIntent = new Intent(context, TripRquestService.class);
                            context.startForegroundService(serviceIntent);
                        }
                    }
                    if (SharedHelper.getOnlineStatus(context, "onlineStatus")) {
                        DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
                        ref.child("drivers_data").child(SharedHelper.getKey(context, "userid")).child("online_status").setValue("1");
                        DriverPresenter driverPresenter = new DriverPresenter(null);
                        driverPresenter.getOnlineOffline("1", null, context, false);
                    }
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
