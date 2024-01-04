package com.bismillah.driver.CommonClass;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.bismillah.driver.Activity.TeampStopActivity;
import com.bismillah.driver.Apllicationcontroller.Appcontroller;

public class CommonFirebaseListoner {
    private static DatabaseReference commonAlert;
    private static ValueEventListener commonAlertValue;

    public static String driverCancelLimiitExceeds = "Your subscription is ended, please recharge again! Thank you!";
    public static String exceededminimumBalanceDriver = "Your subscription is ended, please recharge again! Thank you! ";
    public static String minimumBalanceDriverAlerts = "Your subscription is ended, please recharge again! Thank you!";
    public static String subscriptionExpiryAlert = "Your subscription is ended, please recharge again! Thank you! ";
    public static String lowBalanceAlerts = "0";
    public static String minimumBalances = "0";
    public static String Previous = "0";
    public static String strTamilAlert = "நிசி ஆட்டோ சேவை 7 ஜனவரி 2019 முதல் ஆரம்பமாகும்";
    public static String strEnglishAlert = "Nissi Auto service will start from 7st January 2019";
    public static Boolean isWallet = false;


    @SuppressLint("StaticFieldLeak")
    public static Activity activity;

    public static void FirebaseTripFlow() {

        commonAlert = FirebaseDatabase.getInstance().getReference().child("Cancel_reason").child("AlertLabels");
        commonAlertValue = commonAlert.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    Object driverCancelLimiit = dataSnapshot.child("driverCancelLimiitExceeds").getValue();
                    Object exceededminimumBalanceDriverAlert = dataSnapshot.child("exceededminimumBalanceDriverAlert").getValue();
                    Object lowBalanceAlert = dataSnapshot.child("lowBalanceAlert").getValue();
                    Object minimumBalance = dataSnapshot.child("minimumBalance").getValue();
                    Object subscriptionExpiryAlerts = dataSnapshot.child("subscriptionExpiryAlert").getValue();
                    Object minimumBalanceDriverAlert = dataSnapshot.child("minimumBalanceDriverAlert").getValue();
                    Object IsTempStop = dataSnapshot.child("IsTempStop").getValue();
                    Object TamilAlert = dataSnapshot.child("commonAlertTamil").getValue();
                    Object EnglishAlert = dataSnapshot.child("commonAlertEnglist").getValue();
                    Object driverWallet = dataSnapshot.child("driverPayoutsType").getValue();
                    if (driverCancelLimiit != null) {
                        driverCancelLimiitExceeds = driverCancelLimiit.toString();
                    }
                    if (driverWallet != null && driverWallet.toString().equalsIgnoreCase("driverWallet")) {
                        isWallet  = true;
                    }else {
                        isWallet = false;
                    }
                    if (exceededminimumBalanceDriverAlert != null) {
                        exceededminimumBalanceDriver = exceededminimumBalanceDriverAlert.toString();
                    } if (subscriptionExpiryAlerts != null) {
                        subscriptionExpiryAlert = subscriptionExpiryAlerts.toString();
                    }
                    if (lowBalanceAlert != null) {
                        lowBalanceAlerts = lowBalanceAlert.toString();
                    }
                    if (minimumBalance != null) {
                        minimumBalances = minimumBalance.toString();
                    }
                    if (minimumBalanceDriverAlert != null) {
                        minimumBalanceDriverAlerts = minimumBalanceDriverAlert.toString();
                    }

                    if (TamilAlert != null && !TamilAlert.toString().isEmpty()) {
                        strTamilAlert = TamilAlert.toString();
                    }
                    if (EnglishAlert != null && !EnglishAlert.toString().isEmpty()) {
                        strEnglishAlert = EnglishAlert.toString();
                    }
                    if (IsTempStop != null && !IsTempStop.toString().equalsIgnoreCase("0") && !Previous.equalsIgnoreCase(IsTempStop.toString())) {
                        Previous = IsTempStop.toString();
                        Intent intent = new Intent(Appcontroller.getContexts(), TeampStopActivity.class);
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
                        Appcontroller.getContexts().startActivity(intent);
                        try {
                            activity.finishAffinity();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }

                }

            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e("tag", "enter the error response" + databaseError.getMessage());
            }
        });
    }

    public static void setActivity(Activity activity) {
        CommonFirebaseListoner.activity = activity;
    }
}
