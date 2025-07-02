package com.soofer.app.FCMNotification;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.soofer.app.Activity.ChatActivity;
import com.soofer.app.Activity.VoiceCallActivity;
import com.soofer.app.CommonClass.SharedHelper;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.soofer.app.Activity.SplashActivity;
import com.soofer.app.R;

import java.util.Map;
import java.util.Objects;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private String type = "";



    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        System.out.println("enter the onmessage recieve" + remoteMessage);
        Map data = remoteMessage.getData();

            if (remoteMessage.getData().get("click_action") != null) {
                if (remoteMessage.getData().get("click_action").equalsIgnoreCase("open_video")) {
                    type = "voicecall";
                }
                if (remoteMessage.getData().get("click_action").equalsIgnoreCase("open_chat")) {
                    type = "chat";
                }
            } else {
                type = "splash";
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Sendnotification(Objects.requireNonNull(remoteMessage.getData().get("message")), type);
            } else {
                sendNotification(remoteMessage.getData().get("message"), type);
            }
        }


    @Override
    public void onNewToken(@NonNull String s) {
        super.onNewToken(s);
        SharedHelper.putToken(getApplicationContext(), "device_token", s);
    }

    private void sendNotification(String messageBody, String type) {
        Intent intent;

        PendingIntent pendingIntent;
        int flag;
        flag = PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE;

        if (type.equalsIgnoreCase("chat")) {
            intent = new Intent(this, ChatActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            pendingIntent = PendingIntent.getActivity(getApplicationContext(), 123, intent, flag);
        } else if (type.equalsIgnoreCase("voicecall")) {
            intent = new Intent(getApplicationContext(), VoiceCallActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            pendingIntent = PendingIntent.getActivity(getApplicationContext(), 123, intent, flag);
        } else {
            intent = new Intent(this, SplashActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            pendingIntent = PendingIntent.getActivity(getApplicationContext(), 123, intent, flag);
        }


        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        NotificationCompat.Builder notificationBuilder;

        if (Build.VERSION.SDK_INT < 26) {
            notificationBuilder = new NotificationCompat.Builder(this);
        } else {
            notificationBuilder = new NotificationCompat.Builder(this, "");
        }

        notificationBuilder.setContentTitle(getResources().getString(R.string.app_name))
                .setContentText(messageBody)
                //.setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(messageBody))
                .setPriority(NotificationManager.IMPORTANCE_HIGH)
                .setContentIntent(pendingIntent);

        notificationBuilder.setSmallIcon(getNotificationIcon(notificationBuilder), 1);

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0, notificationBuilder.build());

    }

    private int getNotificationIcon(NotificationCompat.Builder notificationBuilder) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            notificationBuilder.setColor(ContextCompat.getColor(getApplicationContext(), R.color.colorPrimary));
            return R.mipmap.ic_launcher;
        } else {
            return R.drawable.ic_applogo;
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void Sendnotification(String messageBody, String type) {
        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        String id = String.valueOf(System.currentTimeMillis());
        // The user-visible name of the channel.
        CharSequence name = "Product";
        // The user-visible description of the channel.
        String description = "Notifications regarding our products";
        int importance = NotificationManager.IMPORTANCE_MAX;
        @SuppressLint("WrongConstant")
        NotificationChannel mChannel = new NotificationChannel(id, name, importance);
        // Configure the notification channel.
        mChannel.setDescription(description);
        mChannel.enableLights(true);

        Uri defaultSoundUri;

         if (messageBody.equalsIgnoreCase("Your Driver inviting you to join call")){

            defaultSoundUri = Uri.parse("android.resource://" + getApplicationContext().getPackageName() + "/" + R.raw.phone_agora_tone);

        } else if (messageBody.equalsIgnoreCase("Your Driver disconnected the call")) {

            defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
         } else{
            defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        }

        AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_ALARM)
                .build();
        // Sets the notification light color for notifications posted to this
        // channel, if the device supports this feature.

        mChannel.setLightColor(R.color.colorPrimary);
        mChannel.setSound(defaultSoundUri,audioAttributes);
        notificationManager.createNotificationChannel(mChannel);

        PendingIntent pendingIntent;
        Intent intent1;

        int flag;
        flag = PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE;
        if (type.equalsIgnoreCase("chat")) {
            intent1 = new Intent(getApplicationContext(), ChatActivity.class);
            intent1.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            pendingIntent = PendingIntent.getActivity(getApplicationContext(), 123, intent1, flag);

        } else if (type.equalsIgnoreCase("voicecall")) {
            intent1 = new Intent(getApplicationContext(), VoiceCallActivity.class);
            intent1.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            pendingIntent = PendingIntent.getActivity(getApplicationContext(), 123, intent1, flag);
        } else {
            intent1 = new Intent(getApplicationContext(), SplashActivity.class);
            intent1.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
            pendingIntent = PendingIntent.getActivity(getApplicationContext(), 123, intent1, flag);
        }

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(getApplicationContext(), "id_product")
                .setChannelId(id)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(messageBody))
                .setContentTitle(getResources().getString(R.string.app_name))
                .setAutoCancel(true).setContentIntent(pendingIntent)
                .setSound(defaultSoundUri)
                .setContentText(messageBody)
                .setWhen(System.currentTimeMillis());
        notificationBuilder.setSmallIcon(getNotificationIcon(notificationBuilder), 1);
        notificationManager.notify(1, notificationBuilder.build());
    }
}
