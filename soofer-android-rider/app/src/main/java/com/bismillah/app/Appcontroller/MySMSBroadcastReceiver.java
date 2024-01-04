package com.bismillah.app.Appcontroller;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.api.Status;
import com.bismillah.app.EventBus.OTPEvent;

import org.greenrobot.eventbus.EventBus;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MySMSBroadcastReceiver extends BroadcastReceiver {
    private OTPReceiveListener otpReceiveListener;

    public void initOTPListener(OTPReceiveListener receiver) {
        this.otpReceiveListener = receiver;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (SmsRetriever.SMS_RETRIEVED_ACTION == intent.getAction()) {
            Bundle extras = intent.getExtras();
            Status status = (Status) extras.get(SmsRetriever.EXTRA_STATUS);
            String messages = (String) extras.get(SmsRetriever.EXTRA_SMS_MESSAGE);
            System.out.println("enter the message"+messages);
            switch (status.getStatusCode()) {
                case CommonStatusCodes.SUCCESS:
                    // Get SMS message contents
                    String message = (String) extras.get(SmsRetriever.EXTRA_SMS_MESSAGE);
              //      otpReceiveListener.onOTPReceived(parseCode(message));
                    EventBus.getDefault().postSticky(new OTPEvent(parseCode(message)));
                    System.out.println("enter the brocast receiver " +parseCode(message) );
                    break;
                case CommonStatusCodes.TIMEOUT:
                    // Waiting for SMS timed out (5 minutes)
                    // Handle the error ...
                //    otpReceiveListener.onOTPTimeOut();
                    break;
            }

        }
    }

    public interface OTPReceiveListener {
        void onOTPReceived(String otp);

        void onOTPTimeOut();
    }

    private String parseCode(String message) {
        Pattern p = Pattern.compile("\\b\\d{4}\\b");
        Matcher m = p.matcher(message);
        String code = "";
        while (m.find()) {
            code = m.group(0);
        }
        return code;
    }

}
