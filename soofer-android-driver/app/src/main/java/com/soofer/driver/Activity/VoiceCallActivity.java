package com.soofer.driver.Activity;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.ScaleAnimation;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.soofer.driver.CommonClass.BaseActivity;
import com.soofer.driver.CommonClass.CommonData;
import com.soofer.driver.CommonClass.SharedHelper;
import com.soofer.driver.CommonClass.Utiles;
import com.soofer.driver.EventBus.Endfun;
import com.soofer.driver.FCMNotification.MyFirebaseMessagingService;
import com.soofer.driver.Model.FirebaseModel.FCMPayloadModel;
import com.soofer.driver.Presenter.SentNotificationPresenter;
import com.soofer.driver.R;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.HashMap;
import java.util.Locale;

import io.agora.rtc2.ChannelMediaOptions;
import io.agora.rtc2.Constants;
import io.agora.rtc2.IRtcEngineEventHandler;
import io.agora.rtc2.RtcEngine;
import io.agora.rtc2.RtcEngineConfig;

public class VoiceCallActivity extends BaseActivity {

    private static final String TAG = VoiceCallActivity.class.getSimpleName();
    private static final int PERMISSION_REQ_ID = 22;
    private static final String[] REQUESTED_PERMISSIONS = {Manifest.permission.RECORD_AUDIO};

    String strTripID = "";
    private RtcEngine mRtcEngine;
    private boolean mCallEnd;
    private boolean mMuted;
    private boolean mSpeakerOn;

    private RelativeLayout remoteBackground;
    private ImageView mCallBtn;
    private ImageView mMuteBtn;
    private ImageView mSpeakerBtn;
    private TextView tvCallStatus;
    private TextView tvCallTimer;
    private View pulseOuter;
    private View pulseMiddle;
    private View pulseInner;

    private Handler timerHandler;
    private Runnable timerRunnable;
    private int elapsedSeconds = 0;
    private boolean timerRunning = false;

    private ImageView img_avatar;
    private TextView tv_caller_name;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voice_call);
        initUI();

        if (CommonData.closecall.equalsIgnoreCase("closecall")) {
            finish();
            return;
        }

        if (checkSelfPermission(REQUESTED_PERMISSIONS[0], PERMISSION_REQ_ID)) {
            initEngineAndJoinChannel();
        }
    }

    private void initUI() {
        remoteBackground = findViewById(R.id.remote_video_view_background);
        mCallBtn = findViewById(R.id.btn_call);
        mMuteBtn = findViewById(R.id.btn_mute);
        mSpeakerBtn = findViewById(R.id.btn_speaker);
        tvCallStatus = findViewById(R.id.tv_call_status);
        tvCallTimer = findViewById(R.id.tv_call_timer);
        pulseOuter = findViewById(R.id.pulse_ring_outer);
        pulseMiddle = findViewById(R.id.pulse_ring_middle);
        pulseInner = findViewById(R.id.pulse_ring_inner);
        img_avatar = findViewById(R.id.img_avatar);
        tv_caller_name = findViewById(R.id.tv_caller_name);

        strTripID = SharedHelper.getKey(this, "trip_id");
        tv_caller_name.setText(SharedHelper.getKey(this, "rider_name"));
        Utiles.LocalImage(SharedHelper.getKey(this, "rider_img"), img_avatar, this);

        timerHandler = new Handler(Looper.getMainLooper());
        setRingingState();
    }

    private void setRingingState() {
        tvCallStatus.setText("Ringing...");
        tvCallTimer.setVisibility(View.GONE);
        startPulseAnimation();
    }

    private void setConnectedState() {
        tvCallStatus.setText("Connected");
        pulseOuter.clearAnimation();
        pulseMiddle.clearAnimation();
        pulseInner.clearAnimation();
        pulseOuter.setVisibility(View.GONE);
        pulseMiddle.setVisibility(View.GONE);
        pulseInner.setVisibility(View.GONE);
        tvCallTimer.setVisibility(View.VISIBLE);
        startTimer();
    }

    private void startPulseAnimation() {
        animatePulseRing(pulseOuter, 1200, 0);
        animatePulseRing(pulseMiddle, 1200, 300);
        animatePulseRing(pulseInner, 1200, 600);
    }

    private void animatePulseRing(View view, int duration, int startOffset) {
        ScaleAnimation scale = new ScaleAnimation(
                1f, 1.25f,
                1f, 1.25f,
                Animation.RELATIVE_TO_SELF, 0.5f,
                Animation.RELATIVE_TO_SELF, 0.5f
        );
        scale.setDuration(duration);
        scale.setStartOffset(startOffset);
        scale.setRepeatCount(Animation.INFINITE);
        scale.setRepeatMode(Animation.REVERSE);

        AlphaAnimation alpha = new AlphaAnimation(0.6f, 0.05f);
        alpha.setDuration(duration);
        alpha.setStartOffset(startOffset);
        alpha.setRepeatCount(Animation.INFINITE);
        alpha.setRepeatMode(Animation.REVERSE);

        view.startAnimation(scale);
    }

    private void startTimer() {
        if (timerRunning) return;
        timerRunning = true;
        elapsedSeconds = 0;
        timerRunnable = new Runnable() {
            @Override
            public void run() {
                if (!timerRunning) return;
                elapsedSeconds++;
                int hours = elapsedSeconds / 3600;
                int minutes = (elapsedSeconds % 3600) / 60;
                int seconds = elapsedSeconds % 60;
                String timeFormatted;
                if (hours > 0) {
                    timeFormatted = String.format(Locale.getDefault(), "%02d:%02d:%02d", hours, minutes, seconds);
                } else {
                    timeFormatted = String.format(Locale.getDefault(), "%02d:%02d", minutes, seconds);
                }
                tvCallTimer.setText(timeFormatted);
                timerHandler.postDelayed(this, 1000);
            }
        };
        timerHandler.postDelayed(timerRunnable, 1000);
    }

    private void stopTimer() {
        timerRunning = false;
        if (timerHandler != null && timerRunnable != null) {
            timerHandler.removeCallbacks(timerRunnable);
        }
    }

    private boolean checkSelfPermission(String permission, int requestCode) {
        if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, REQUESTED_PERMISSIONS, requestCode);
            return false;
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQ_ID) {
            if (grantResults.length < 1 || grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                showLongToast("Need permissions " + Manifest.permission.RECORD_AUDIO);
                finish();
                return;
            }
            initEngineAndJoinChannel();
        }
    }

    private void showLongToast(final String msg) {
        runOnUiThread(() -> Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_LONG).show());
    }

    private void initEngineAndJoinChannel() {
        initializeEngine();
        joinChannel();
    }

    private void initializeEngine() {
        try {
            RtcEngineConfig config = new RtcEngineConfig();
            config.mContext = getBaseContext();
            config.mAppId = getResources().getString(R.string.agora_app_id);
            config.mEventHandler = mRtcEventHandler;
            mRtcEngine = RtcEngine.create(config);
        } catch (Exception e) {
            Log.e(TAG, Log.getStackTraceString(e));
            throw new RuntimeException("Agora SDK init error: " + Log.getStackTraceString(e));
        }
    }

    private void joinChannel() {
        ChannelMediaOptions options = new ChannelMediaOptions();
        options.clientRoleType = Constants.CLIENT_ROLE_BROADCASTER;
        options.channelProfile = Constants.CHANNEL_PROFILE_LIVE_BROADCASTING;
        options.publishMicrophoneTrack = true;
        options.autoSubscribeAudio = true;
        mRtcEngine.joinChannel("", strTripID, 0, options);
    }

    private final IRtcEngineEventHandler mRtcEventHandler = new IRtcEngineEventHandler() {
        @Override
        public void onJoinChannelSuccess(String channel, final int uid, int elapsed) {
            AsyncTask.execute(() -> {
                try {
                    if (CommonData.voicecall.equalsIgnoreCase("main")) {
                        if (!CommonData.closecall.equalsIgnoreCase("closecall")) {
                            pushNotificationCall("Your Driver is inviting you to join a call", "open_audio");
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }

        @Override
        public void onUserJoined(final int uid, int elapsed) {
            runOnUiThread(() -> {
                MyFirebaseMessagingService.stopCallSound();
                setConnectedState();
            });
        }

        @Override
        public void onUserOffline(final int uid, int reason) {
            runOnUiThread(() -> {
                stopTimer();
                tvCallStatus.setText("Call Ended");
                tvCallTimer.setVisibility(View.GONE);
            });
        }
    };

    public void pushNotificationCall(String message, String type) {
        FCMPayloadModel data = new FCMPayloadModel("Audio Call From your Driver", message, "driver", type, "", strTripID, "");
        SentNotificationPresenter sentNotificationPresenter = new SentNotificationPresenter();
        sentNotificationPresenter.sendNotificationFCMCall(this, data);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        stopTimer();
        SharedHelper.putKey(getApplicationContext(), "Alreadyjoined", "false");
        endCall();
        MyFirebaseMessagingService.stopCallSound();
        RtcEngine.destroy();
    }

    private void leaveChannel() {
        if (mRtcEngine != null) {
            mRtcEngine.leaveChannel();
        }
    }

    public void onLocalAudioMuteClicked(View view) {
        mMuted = !mMuted;
        mRtcEngine.muteLocalAudioStream(mMuted);
        mMuteBtn.setImageResource(mMuted ? R.drawable.ic_mic_off : R.drawable.ic_mic_on);
        mMuteBtn.setAlpha(mMuted ? 0.5f : 1f);
    }

    public void onSpeakerClicked(View view) {
        mSpeakerOn = !mSpeakerOn;
        mRtcEngine.setEnableSpeakerphone(mSpeakerOn);
        mSpeakerBtn.setImageResource(mSpeakerOn ? R.drawable.ic_speaker_on : R.drawable.ic_speaker_off);
        mSpeakerBtn.setAlpha(mSpeakerOn ? 1f : 0.5f);
    }

    public void onCallClicked(View view) {
        if (mCallEnd) {
            startCall();
            mCallEnd = false;
            mCallBtn.setImageResource(R.drawable.ic_call_end);
        } else {
            MyFirebaseMessagingService.stopCallSound();
            AsyncTask.execute(() -> {
                try {
                    pushNotificationCall("Your Driver disconnected the call", "close_audio");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
            stopTimer();
            endCall();
            mCallEnd = true;
            mCallBtn.setImageResource(R.drawable.ic_call_start);
            onBackPressed();
        }
        showButtons(!mCallEnd);
    }

    private void startCall() {
        setRingingState();
        joinChannel();
    }

    private void endCall() {
        leaveChannel();
    }

    private void showButtons(boolean show) {
        int visibility = show ? View.VISIBLE : View.GONE;
        mMuteBtn.setVisibility(visibility);
        mSpeakerBtn.setVisibility(visibility);
    }

    @Override
    public void onStart() {
        super.onStart();
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
        SharedHelper.putKey(getApplicationContext(), "Alreadyjoined", "true");
    }

    @Override
    public void onStop() {
        super.onStop();
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void onMessage(Endfun event) {
        if (CommonData.endfun.equals("end")) {
            stopTimer();
            endCall();
            mCallEnd = true;
            finish();
        }
        EventBus.getDefault().removeStickyEvent(Endfun.class);
    }
}
