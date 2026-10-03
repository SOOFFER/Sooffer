package com.soofer.driver.FCMNotification;

import static com.soofer.driver.CommonClass.Constants.onResumeCalled;

import android.annotation.SuppressLint;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.soofer.driver.Activity.NotificationActivity;
import com.soofer.driver.Activity.VoiceCallActivity;
import com.soofer.driver.Activity.ChatActivity;
import com.soofer.driver.Activity.SplashActivity;
import com.soofer.driver.MainActivity;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.EventBus.Endfun;
import com.soofer.driver.R;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.greenrobot.eventbus.EventBus;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "MyFirebaseMsgService";

    public static final String ACTION_TRIP_REQUEST = "ACTION_TRIP_REQUEST";

    private static final String CHANNEL_ID_AUDIO_CALL = "channel_audio_call_v3";
    private static final String CHANNEL_ID_TRIP = "channel_trip_request_v2";
    private static final String CHANNEL_ID_CHAT = "channel_chat_v2";
    private static final String CHANNEL_ID_GENERAL = "channel_general_v2";

    public static MediaPlayer callMediaPlayer;

    private String type = "";
    private String messageFrom = "";

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        SharedHelper.putToken(getApplicationContext(), "device_token", token);
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        String clickAction = remoteMessage.getData().get("click_action");
        if (clickAction != null) {
            if (clickAction.equalsIgnoreCase("open_audio")) {
                type = "audiocall";
                messageFrom = "Incoming Call";
            } else if (clickAction.equalsIgnoreCase("close_audio")) {
                type = "closecall";
                messageFrom = "Sooffer Driver";
            } else {
                type = "chat";
                messageFrom = "Message from Rider";
            }
        } else {
            messageFrom = "Sooffer Driver";
            type = "splash";
        }

        String messageBody = "";

        messageBody = remoteMessage.getData().get("message");

        Log.d(TAG, "Message Body: " + messageBody + " | Type: " + type);

        if ("audiocall".equalsIgnoreCase(type)) {
            playCallSoundDirectly();
        }

        if ("closecall".equalsIgnoreCase(type)) {
            stopCallSound();
        }

        if(messageBody != null && !messageBody.isEmpty()) {

            sendNotification(messageBody, remoteMessage.getData().get("image"), "admin");

            if (messageBody.toLowerCase().contains("new trip") ||
                    messageBody.toLowerCase().contains("new request") ||
                    messageBody.toLowerCase().contains("new trip request") || messageBody.toLowerCase().contains("new trip request received.")) {
                wakeScreenForTripRequest();
            }
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

    @SuppressLint("WakelockTimeout")
    private void wakeScreenForTripRequest() {
        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (powerManager != null) {
            PowerManager.WakeLock wakeLock = powerManager.newWakeLock(
                    PowerManager.FULL_WAKE_LOCK |
                            PowerManager.ACQUIRE_CAUSES_WAKEUP |
                            PowerManager.ON_AFTER_RELEASE,
                    "soofer:TripRequestWakeLock"
            );
            wakeLock.acquire(15 * 1000L);
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                if (wakeLock.isHeld()) {
                    wakeLock.release();
                }
            }, 15 * 1000L);
        }
        Intent intent = new Intent(getApplicationContext(), MainActivity.class);
        intent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK |
                        Intent.FLAG_ACTIVITY_REORDER_TO_FRONT |
                        Intent.FLAG_ACTIVITY_SINGLE_TOP
        );
        intent.putExtra(ACTION_TRIP_REQUEST, true);
        getApplicationContext().startActivity(intent);
    }

    public void sendNotification(String messageBody, String imageUrl, String sentFrom) {
        System.out.println("DATA IMAGE:::" + imageUrl);
        System.out.println("SENT FROM:::" + sentFrom);
        Intent intent;
        int flag = PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE;

        if ("chat".equalsIgnoreCase(type)) {
            intent = new Intent(getApplicationContext(), ChatActivity.class);
            intent.putExtra("Notification", messageBody);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        } else if ("audiocall".equalsIgnoreCase(type)) {
            CommonData.closecall = "";
            CommonData.voicecall = "message";
            intent = new Intent(getApplicationContext(), VoiceCallActivity.class);
            intent.putExtra("Notification", messageBody);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_NEW_TASK);

        } else if ("closecall".equalsIgnoreCase(type)) {
            CommonData.closecall = "closecall";
            CommonData.endfun = "end";
            EventBus.getDefault().postSticky(new Endfun(CommonData.endfun));
            intent = new Intent(getApplicationContext(), VoiceCallActivity.class);
            intent.putExtra("Notification", messageBody);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        } else if ("New Trip Request Received.".equalsIgnoreCase(messageBody)) {
            intent = new Intent(getApplicationContext(), MainActivity.class);
            intent.putExtra("Notification", messageBody);
            intent.putExtra(ACTION_TRIP_REQUEST, true);
            intent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        } else {
            if (imageUrl == null || imageUrl.equalsIgnoreCase("null")) {
                intent = new Intent(this, SplashActivity.class);
                intent.putExtra("Notification", messageBody);
            } else {
                intent = new Intent(this, NotificationActivity.class);
                intent.putExtra("Notification", messageBody);
            }
        }

        PendingIntent pendingIntent = PendingIntent.getActivity(
                getApplicationContext(), 123, intent, flag
        );

        Bitmap imageBitmap = null;

        if (imageUrl != null && !imageUrl.isEmpty()) {
            imageBitmap = getBitmapFromUrl(imageUrl);
        }


        NotificationManager notificationManager =
                (NotificationManager) getSystemService(NOTIFICATION_SERVICE);

        String channelId;
        Uri soundUri;
        AudioAttributes audioAttributes;
        String channelName;
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

        } else if ("New Trip Request Received.".equalsIgnoreCase(messageBody)) {
            channelId = CHANNEL_ID_TRIP;
            channelName = "Trip Requests";
            importance = NotificationManager.IMPORTANCE_HIGH;
            soundUri = Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.sooffer_trip_call);
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

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
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
        }

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, channelId)
                .setChannelId(channelId)
                .setSmallIcon(R.drawable.app_logo_notify)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.drawable.ic_applogo))
                .setStyle(new NotificationCompat.BigTextStyle().bigText(messageBody))
                .setContentTitle(messageFrom)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .setContentText(messageBody)
                .setSound(soundUri)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setWhen(System.currentTimeMillis());

        if (imageBitmap != null) {
            notificationBuilder.setStyle(new NotificationCompat.BigPictureStyle()
                    .bigPicture(imageBitmap)
                    .bigLargeIcon(null));
        }

        notificationManager.notify(2, notificationBuilder.build());
    }

    private Bitmap getBitmapFromUrl(String imageUrl) {
        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            return BitmapFactory.decodeStream(input);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
