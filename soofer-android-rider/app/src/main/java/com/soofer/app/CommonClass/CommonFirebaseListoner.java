package com.soofer.app.CommonClass;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.view.Gravity;
import android.view.Window;
import android.view.WindowManager;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.soofer.app.Activity.TeampStopActivity;
import com.soofer.app.Appcontroller.Appcontroller;
import com.soofer.app.CustomizeDialog.RiderAlertDialog;
import com.soofer.app.R;

public class CommonFirebaseListoner {
    private static DatabaseReference commonAlert;
    private static ValueEventListener commonAlertValue;

    public static String riderCancelLimiitExceeds = "";


    public static String riderMaximumOldBalance = "0";
    public static String riderOldBalanceExceededMessage = "0";
    public static String Previous = "0";
    public static String strTamilAlert = "நிசி ஆட்டோ சேவை 7 ஜனவரி 2019 முதல் ஆரம்பமாகும்";
    public static String strEnglishAlert = "Nissi Auto service will start from 7st January 2019";

    public static String cancelExceedss = "0", oldBalance = "0";


    public static void FirebaseTripFlow() {
        if (commonAlert != null && commonAlertValue != null) {
            commonAlert.removeEventListener(commonAlertValue);
        }
        commonAlert = FirebaseDatabase.getInstance().getReference().child("Cancel_reason").child("AlertLabels");
        commonAlertValue = commonAlert.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.getValue() != null) {
                    Object riderMaximumOldBalances = dataSnapshot.child("riderMaximumOldBalance").getValue();
                    Object riderCancelLimiitExceedss = dataSnapshot.child("riderCancelLimiitExceeds").getValue();
                    Object IsTempStop = dataSnapshot.child("IsTempStop").getValue();
                    Object TamilAlert = dataSnapshot.child("commonAlertTamil").getValue();
                    Object EnglishAlert = dataSnapshot.child("commonAlertEnglist").getValue();
                    Object riderOldBalanceExceededMessages = dataSnapshot.child("riderOldBalanceExceededMessage").getValue();
                    if (riderMaximumOldBalances != null && !riderMaximumOldBalances.toString().isEmpty()) {
                        riderMaximumOldBalance = riderMaximumOldBalances.toString();
                    }
                    if (riderCancelLimiitExceedss != null && !riderCancelLimiitExceedss.toString().isEmpty()) {
                        riderCancelLimiitExceeds = riderCancelLimiitExceedss.toString();
                    }
                    if (riderOldBalanceExceededMessages != null && !riderOldBalanceExceededMessages.toString().isEmpty()) {
                        riderOldBalanceExceededMessage = riderOldBalanceExceededMessages.toString();
                    }
                    if (riderOldBalanceExceededMessages != null && !riderOldBalanceExceededMessages.toString().isEmpty()) {
                        riderOldBalanceExceededMessage = riderOldBalanceExceededMessages.toString();
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

                    }


                }

            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e("tag", "enter the error response" + databaseError.getMessage());
            }
        });
    }

    public static void riderAlert(Activity activity, String Message) {
        RiderAlertDialog dialogClass = new RiderAlertDialog(activity, Message);
        dialogClass.setCancelable(false);
        dialogClass.getWindow().getAttributes().windowAnimations = R.style.slideupdown;
        Window window = dialogClass.getWindow();
        WindowManager.LayoutParams wlp = window.getAttributes();
        wlp.gravity = Gravity.BOTTOM;
        wlp.flags &= ~WindowManager.LayoutParams.FLAG_DIM_BEHIND;
        window.setAttributes(wlp);
        dialogClass.show();
    }
}
