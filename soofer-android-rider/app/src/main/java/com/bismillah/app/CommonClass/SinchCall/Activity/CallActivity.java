package com.bismillah.app.CommonClass.SinchCall.Activity;

import android.annotation.SuppressLint;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.Chronometer;
import android.widget.ImageView;
import android.widget.TextView;

import com.bismillah.app.CommonClass.SinchCall.BaseActivity;
import com.sinch.android.rtc.PushPair;
import com.sinch.android.rtc.calling.Call;
import com.sinch.android.rtc.calling.CallEndCause;
import com.sinch.android.rtc.calling.CallListener;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.SinchCall.AudioPlayer;
import com.bismillah.app.CommonClass.SinchCall.Service.SinchService;
import com.bismillah.app.CommonClass.Utiles;
import com.bismillah.app.R;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class CallActivity extends BaseActivity {

    @BindView(R.id.profile_image)
    ImageView profileImage;
    @BindView(R.id.name_txt)
    TextView nameTxt;
    @BindView(R.id.chronometer)
    Chronometer chronometer;
    @BindView(R.id.call_in_img)
    ImageView callInImg;
    @BindView(R.id.call_cut_img)
    ImageView callCutImg;
    @BindView(R.id.call_cancel_img)
    ImageView callCancelImg;
    private String mCallId;
    private AudioPlayer mAudioPlayer;
    final String TAG = CallActivity.class.getSimpleName();
    private String strCallType = "incoming";

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);
        ButterKnife.bind(this);
        mAudioPlayer = new AudioPlayer(this);
        mCallId = getIntent().getStringExtra(SinchService.CALL_ID);
        strCallType = getIntent().getStringExtra("calltype");
        assert strCallType != null;
        if(strCallType.equalsIgnoreCase("incoming")){
            mAudioPlayer.playRingtone();
            incomingCallView();
        }else {
            goingView();

            nameTxt.setText(SharedHelper.getKey(this,"userfname"));
            Utiles.CircleImageView(SharedHelper.getKey(this,"userprofile"),profileImage,this);
        }

    }
    private void callButtonClicked() {
        Map<String, String> headers = new HashMap<String, String>();
        headers.put("name", SharedHelper.getKey(getApplicationContext(),"fname") + " "+SharedHelper.getKey(getApplicationContext(),"lname"));
        headers.put("profile_pic",SharedHelper.getKey(getApplicationContext(),"profile"));
        Call call = getSinchServiceInterface().callUser(SharedHelper.getKey(getApplicationContext(),"driver_id"), headers);
        mCallId= call.getCallId();
        startCalling(mCallId);
    }

    private void startCalling(String mCallId) {
        if(mCallId!=null){
            Call call = getSinchServiceInterface().getCall(mCallId);
            if(strCallType.equalsIgnoreCase("incoming")){
                nameTxt.setText(call.getHeaders().get("name"));
                Utiles.CircleImageView(call.getHeaders().get("profile_pic"),profileImage,getApplicationContext());
            }
            if (call != null) {
                call.addCallListener(new SinchCallListener());
                call.getCallId();
            } else {
                Log.e(TAG, "Started with invalid callId, aborting");
                finish();
            }
        }

    }

    @Override
    protected void onServiceConnected() {
        if (!getSinchServiceInterface().isStarted()) {
            getSinchServiceInterface().startClient(SharedHelper.getKey(this,"userid"));
        }
        if(strCallType.equalsIgnoreCase("incoming")){
            startCalling(mCallId);
        }else {
            callButtonClicked();
        }


    }
    @OnClick({R.id.call_in_img, R.id.call_cut_img, R.id.call_cancel_img})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.call_in_img:
                answerClicked();
                break;
            case R.id.call_cut_img:
                endCall();
                break;
            case R.id.call_cancel_img:
                declineClicked();
                break;
        }
    }

    private void goingView() {
        callInImg.setVisibility(View.INVISIBLE);
        callCancelImg.setVisibility(View.INVISIBLE);
        callCutImg.setVisibility(View.VISIBLE);
        chronometer.setVisibility(View.VISIBLE);
        chronometer.setBase(SystemClock.elapsedRealtime());
        chronometer.start();
    }

    private void incomingCallView() {
        callInImg.setVisibility(View.VISIBLE);
        callCancelImg.setVisibility(View.VISIBLE);
        callCutImg.setVisibility(View.INVISIBLE);
        chronometer.setVisibility(View.INVISIBLE);
    }


    private void endCall() {
        mAudioPlayer.stopProgressTone();
        Call call = getSinchServiceInterface().getCall(mCallId);
        if (call != null) {
            call.hangup();
        }
        finish();
    }
    private class SinchCallListener implements CallListener {

        @Override
        public void onCallEnded(Call call) {
            if(strCallType.equalsIgnoreCase("incoming")){
                CallEndCause cause = call.getDetails().getEndCause();
                Log.d(TAG, "Call ended, cause: " + cause.toString());
                mAudioPlayer.stopRingtone();
                finish();
            }else if(strCallType.equalsIgnoreCase("accepted")) {
                CallEndCause cause = call.getDetails().getEndCause();
                Log.d(TAG, "Call ended. Reason: " + cause.toString());
                mAudioPlayer.stopProgressTone();
                setVolumeControlStream(AudioManager.USE_DEFAULT_STREAM_TYPE);
                String endMsg = "Call ended: " + call.getDetails().toString();
                endCall();
            }else {
                endCall();
            }
        }



        @Override
        public void onCallEstablished(Call call) {
            Log.d(TAG, "Call established");
            Log.d(TAG, "Call established");
            mAudioPlayer.stopProgressTone();
            setVolumeControlStream(AudioManager.STREAM_VOICE_CALL);
        }

        @Override
        public void onCallProgressing(Call call) {
            Log.d(TAG, "Call progressing");
            mAudioPlayer.playProgressTone();
        }

        @Override
        public void onShouldSendPushNotification(Call call, List<PushPair> pushPairs) {
            // Send a push through your push provider here, e.g. GCM
        }
    }
    private void answerClicked() {
        mAudioPlayer.stopRingtone();
        strCallType="accepted";
        Call call = getSinchServiceInterface().getCall(mCallId);
        if (call != null) {
            call.answer();
            goingView();
        } else {
            finish();
        }
    }

    private void declineClicked() {
        mAudioPlayer.stopRingtone();
        Call call = getSinchServiceInterface().getCall(mCallId);
        if (call != null) {
            call.hangup();
        }
        finish();
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        mAudioPlayer.stopProgressTone();
        mAudioPlayer.stopRingtone();
    }}
