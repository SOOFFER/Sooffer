package com.bismillah.app.Activity;

import static com.bismillah.app.CommonClass.Constants.API_URL_FCM;
import static com.bismillah.app.CommonClass.Constants.AUTH_KEY_FCM;

import android.Manifest;
import android.content.pm.PackageManager;
import android.graphics.PorterDuff;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.StrictMode;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.bismillah.app.R;


import org.json.JSONObject;

import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Locale;

import io.agora.rtc.Constants;
import io.agora.rtc.IRtcEngineEventHandler;
import io.agora.rtc.RtcEngine;

public class VoiceCallActivity extends AppCompatActivity {

    private static final String LOG_TAG = VoiceCallActivity.class.getSimpleName();

    private static final int PERMISSION_REQ_ID_RECORD_AUDIO = 22;

    private RtcEngine mRtcEngine; // Tutorial Step 1
    private final IRtcEngineEventHandler mRtcEventHandler = new IRtcEngineEventHandler() { // Tutorial Step 1

        @Override
        public void onUserOffline(final int uid, final int reason) { // Tutorial Step 4
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    onRemoteUserLeft(uid, reason);
                }
            });
        }

        @Override
        public void onUserMuteAudio(final int uid, final boolean muted) { // Tutorial Step 6
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    onRemoteUserVoiceMuted(uid, muted);
                }
            });
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voice_call);

        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO, PERMISSION_REQ_ID_RECORD_AUDIO)) {
            initAgoraEngineAndJoinChannel();
        }
    }

    private void initAgoraEngineAndJoinChannel() {
        initializeAgoraEngine();     // Tutorial Step 1
        joinChannel();               // Tutorial Step 2
    }

    public boolean checkSelfPermission(String permission, int requestCode) {
        Log.i(LOG_TAG, "checkSelfPermission " + permission + " " + requestCode);
        if (ContextCompat.checkSelfPermission(this,
                permission)
                != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this,
                    new String[]{permission},
                    requestCode);
            return false;
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           @NonNull String permissions[], @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        Log.i(LOG_TAG, "onRequestPermissionsResult " + grantResults[0] + " " + requestCode);

        switch (requestCode) {
            case PERMISSION_REQ_ID_RECORD_AUDIO: {
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    initAgoraEngineAndJoinChannel();
                } else {
                    showLongToast("No permission for " + Manifest.permission.RECORD_AUDIO);
                    finish();
                }
                break;
            }
        }
    }

    public final void showLongToast(final String msg) {
        this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        leaveChannel();
        RtcEngine.destroy();
        mRtcEngine = null;
    }

    // Tutorial Step 7
    public void onLocalAudioMuteClicked(View view) {
        ImageView iv = (ImageView) view;
        if (iv.isSelected()) {
            iv.setSelected(false);
            iv.clearColorFilter();
        } else {
            iv.setSelected(true);
            iv.setColorFilter(getResources().getColor(R.color.colorPrimary), PorterDuff.Mode.MULTIPLY);
        }

        // Stops/Resumes sending the local audio stream.
        mRtcEngine.muteLocalAudioStream(iv.isSelected());
    }

    // Tutorial Step 5
    public void onSwitchSpeakerphoneClicked(View view) {
        ImageView iv = (ImageView) view;
        if (iv.isSelected()) {
            iv.setSelected(false);
            iv.clearColorFilter();
        } else {
            iv.setSelected(true);
            iv.setColorFilter(getResources().getColor(R.color.colorPrimary), PorterDuff.Mode.MULTIPLY);
        }

        // Enables/Disables the audio playback route to the speakerphone.
        //
        // This method sets whether the audio is routed to the speakerphone or earpiece. After calling this method, the SDK returns the onAudioRouteChanged callback to indicate the changes.
        mRtcEngine.setEnableSpeakerphone(view.isSelected());
    }

    // Tutorial Step 3
    public void onEncCallClicked(View view) {
        AsyncTask.execute(() -> {
            try {
                pushFCMNotification("Your Rider disconnected the call");
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("enter the fcm exception" + e);
            }
        });
        finish();
    }

    // Tutorial Step 1
    private void initializeAgoraEngine() {
        try {
            mRtcEngine = RtcEngine.create(getBaseContext(), getString(R.string.agora_app_id), mRtcEventHandler);            
        } catch (Exception e) {
            Log.e(LOG_TAG, Log.getStackTraceString(e));

            throw new RuntimeException("NEED TO check rtc sdk init fatal error\n" + Log.getStackTraceString(e));
        }
    }

    // Tutorial Step 2
    private void joinChannel() {
        String accessToken = getString(R.string.agora_access_token);
        if (TextUtils.equals(accessToken, "") || TextUtils.equals(accessToken, "#YOUR ACCESS TOKEN#")) {
            accessToken = null; // default, no token
        }

        mRtcEngine.enableAudioQualityIndication(true);
        mRtcEngine.enableInEarMonitoring(true);

        mRtcEngine.setChannelProfile(Constants.CHANNEL_PROFILE_COMMUNICATION);
        // Allows a user to join a channel.
        mRtcEngine.joinChannel(accessToken, "Sooffer", "Extra Optional Data", 0); // if you do not specify the uid, we will generate the uid for you

        if(com.bismillah.app.CommonClass.Constants.isFromTripFlow==true) {

            AsyncTask.execute(() -> {
                try {
                    pushFCMNotification("Your Rider inviting you to join call");
                } catch (Exception e) {
                    e.printStackTrace();
                    System.out.println("enter the fcm exception" + e);
                }
            });
        }
    }

    public  void pushFCMNotification(String Message) throws Exception {
        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        URL url = new URL(API_URL_FCM);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setUseCaches(false);
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "key=" + AUTH_KEY_FCM);
        conn.setRequestProperty("Content-Type", "application/json");
        JSONObject json = new JSONObject();
        json.put("to", com.bismillah.app.CommonClass.Constants.strDriver);
        JSONObject info = new JSONObject();
        info.put("message", Message);
        info.put("alert", Message);
        info.put("click_action", "open_video"); // Notification body
        info.put("alert", this.getResources().getString(R.string.app_name));
        info.put("body", Message);
        json.put("data", info);
        json.put("aps", info);
        json.put("notification", info);
        OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
        wr.write(json.toString());
        wr.flush();
        conn.getInputStream();
        com.bismillah.app.CommonClass.Constants.isFromTripFlow=false;
    }

    // Tutorial Step 3
    private void leaveChannel() {
        mRtcEngine.leaveChannel();
    }

    // Tutorial Step 4
    private void onRemoteUserLeft(int uid, int reason) {
        showLongToast(String.format(Locale.US, "User Left the Call", (uid & 0xFFFFFFFFL), reason));
        finish();
    }

    // Tutorial Step 6
    private void onRemoteUserVoiceMuted(int uid, boolean muted) {
        showLongToast(String.format(Locale.US, "User Muted/UnMuted the Call", (uid & 0xFFFFFFFFL), muted));
    }
}
