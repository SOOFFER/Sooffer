package com.bismillah.driver.CommonClass.Receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.bismillah.driver.CommonClass.SharedHelper;
import com.bismillah.driver.Presenter.DriverPresenter;

public class SwitchOffReceiver extends BroadcastReceiver {
    static final String ACTIONONE = "android.intent.action.ACTION_SHUTDOWN";
    static final String ACTIONTWO = "android.intent.action.QUICKBOOT_POWEROFF";

    @Override
    public void onReceive(Context context, Intent intent) {
        // BOOT_COMPLETED” start Service
        try {
            if (intent.getAction().equals(ACTIONONE) | intent.getAction().equals(ACTIONTWO)) {
                if (SharedHelper.getKey(context, "userid") != null && !SharedHelper.getKey(context, "userid").isEmpty()) {
                    DatabaseReference ref = FirebaseDatabase.getInstance().getReference();
                    ref.child("drivers_data").child(SharedHelper.getKey(context, "userid") ).child("online_status").setValue("0");
                    DriverPresenter  driverPresenter = new DriverPresenter(null);
                    driverPresenter.getOnlineOffline("0",null,context,false);
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
