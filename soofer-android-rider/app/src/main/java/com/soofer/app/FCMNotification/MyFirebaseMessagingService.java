package com.soofer.app.FCMNotification;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.soofer.app.Activity.VoiceCallActivity;
import com.soofer.app.Activity.ChatActivity;
import com.soofer.app.Activity.SplashActivity;
import com.soofer.app.CommonClass.CommonData;
import com.soofer.app.CommonClass.SharedHelper;
import com.soofer.app.EventBus.Endfun;
import com.soofer.app.R;

import org.greenrobot.eventbus.EventBus;

import java.util.Objects;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "MyFirebaseMsgService";

    private static final String CHANNEL_ID_AUDIO_CALL = "channel_audio_call_v3";
    private static final String CHANNEL_ID_CHAT       = "channel_chat_v2";
    private static final String CHANNEL_ID_GENERAL    = "channel_general_v2";

    public static MediaPlayer callMediaPlayer;

    private String type = "";
    private String messageFrom = "";

    @Override
    public void onNewToken(String s) {
        super.onNewToken(s);
        SharedHelper.putToken(getApplicationContext(), "device_token", s);
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        String clickAction = remoteMessage.getData().get("click_action");
        if (clickAction != null) {
            if ("open_audio".equalsIgnoreCase(clickAction)) {
                type = "audiocall";
                messageFrom = "Incoming Call";
            } else if ("close_audio".equalsIgnoreCase(clickAction)) {
                type = "closecall";
                messageFrom = "Sooffer";
            } else {
                type = "chat";
                messageFrom = "Message from Driver";
            }
        } else {
            messageFrom = "Sooffer";
            type = "splash";
        }

        String messageBody = remoteMessage.getData().get("message");
        Log.d(TAG, "Message Body: " + messageBody + " | Type: " + type);

        if ("audiocall".equalsIgnoreCase(type)) {
            playCallSoundDirectly();
        }

        if ("closecall".equalsIgnoreCase(type)) {
            stopCallSound();
        }

        if (messageBody != null && !messageBody.isEmpty()) {
            sendNotification(Objects.requireNonNull(messageBody));
        }
    }

    private void playCallSoundDirectly() {
        stopCallSound();
        try {
            callMediaPlayer = MediaPlayer.create(getApplicationContext(), R.raw.phone_agora_tone);
            if (callMediaPlayer != null) {
                callMediaPlayer.setAudioStreamType(AudioManager.STREAM_RING);
                callMediaPlayer.setLooping(true);
                callMediaPlayer.start();
                Log.d(TAG, "MediaPlayer started — playing phone_agora_tone");
            } else {
                Log.e(TAG, "MediaPlayer.create returned null — verify R.raw.phone_agora_tone exists");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to play call sound", e);
        }
    }

    public static void stopCallSound() {
        try {
            if (callMediaPlayer != null) {
                if (callMediaPlayer.isPlaying()) {
                    callMediaPlayer.stop();
                }
                callMediaPlayer.release();
                callMediaPlayer = null;
                Log.d(TAG, "MediaPlayer stopped and released");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error stopping MediaPlayer", e);
        }
    }

    public void sendNotification(String messageBody) {
        NotificationManager notificationManager =
                (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        String channelId;
        String channelName;
        Uri soundUri;
        AudioAttributes audioAttributes;
        int importance;

        if ("audiocall".equalsIgnoreCase(type)) {
            channelId = CHANNEL_ID_AUDIO_CALL;
            channelName = "Audio Call";
            importance = NotificationManager.IMPORTANCE_HIGH;
            soundUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.phone_agora_tone);
            audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                    .build();

        } else if ("chat".equalsIgnoreCase(type)) {
            channelId = CHANNEL_ID_CHAT;
            channelName = "Chat Messages";
            importance = NotificationManager.IMPORTANCE_HIGH;
            soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build();

        } else {
            channelId = CHANNEL_ID_GENERAL;
            channelName = "General";
            importance = NotificationManager.IMPORTANCE_DEFAULT;
            soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build();
        }

        NotificationChannel existing = notificationManager.getNotificationChannel(channelId);
        if (existing == null) {
            NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);
            channel.setDescription("Notifications regarding our products");
            channel.enableLights(true);
            channel.setLightColor(getResources().getColor(R.color.colorPrimary, null));
            channel.setSound(soundUri, audioAttributes);
            notificationManager.createNotificationChannel(channel);
            Log.d(TAG, "Channel created: " + channelId);
        } else {
            Log.d(TAG, "Channel exists: " + channelId + " | Sound: " + existing.getSound());
        }

        Intent intent;
        int flag = PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE;

        if ("chat".equalsIgnoreCase(type)) {
            intent = new Intent(getApplicationContext(), ChatActivity.class);

        } else if ("audiocall".equalsIgnoreCase(type)) {
            CommonData.closecall = "";
            CommonData.voicecall = "message";
            intent = new Intent(getApplicationContext(), VoiceCallActivity.class);

        } else if ("closecall".equalsIgnoreCase(type)) {
            CommonData.closecall = "closecall";
            CommonData.endfun = "end";
            EventBus.getDefault().postSticky(new Endfun(CommonData.endfun));
            intent = new Intent(getApplicationContext(), VoiceCallActivity.class);

        } else {
            intent = new Intent(getApplicationContext(), SplashActivity.class);
        }

        intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                getApplicationContext(), 123, intent, flag);

        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(getApplicationContext(), channelId)
                        .setStyle(new NotificationCompat.BigTextStyle().bigText(messageBody))
                        .setContentTitle(messageFrom)
                        .setContentText(messageBody)
                        .setSmallIcon(getNotificationIcon())
                        .setAutoCancel(true)
                        .setContentIntent(pendingIntent)
                        .setSound(soundUri)
                        .setWhen(System.currentTimeMillis())
                        .setPriority(NotificationCompat.PRIORITY_MAX)
                        .setCategory(NotificationCompat.CATEGORY_CALL);

        notificationManager.notify(2, notificationBuilder.build());
    }

    private int getNotificationIcon() {
        return R.drawable.ic_app_logo_round;
    }
}