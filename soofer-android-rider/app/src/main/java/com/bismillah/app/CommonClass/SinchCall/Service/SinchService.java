package com.bismillah.app.CommonClass.SinchCall.Service;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

import com.sinch.android.rtc.ClientRegistration;
import com.sinch.android.rtc.Sinch;
import com.sinch.android.rtc.SinchClient;
import com.sinch.android.rtc.SinchClientListener;
import com.sinch.android.rtc.SinchError;
import com.sinch.android.rtc.calling.Call;
import com.sinch.android.rtc.calling.CallClient;
import com.sinch.android.rtc.calling.CallClientListener;

import java.util.Map;

import com.bismillah.app.CommonClass.SharedHelper;
import com.bismillah.app.CommonClass.SinchCall.Activity.CallActivity;


public class SinchService extends Service {

    private static final String APP_KEY = "5bc2f616-ce41-4807-ae0d-c7d0eff71a46";
    private static final String APP_SECRET = "PnJDCUrwQ0KD6jU94DaIWA==";
    private static final String ENVIRONMENT = "clientapi.sinch.com";

    public static final String LOCATION = "LOCATION";
    public static final String CALL_ID = "CALL_ID";
    static final String TAG = SinchService.class.getSimpleName();

    private SinchServiceInterface mSinchServiceInterface = new SinchServiceInterface();
    private SinchClient mSinchClient;
    private String mUserId;

    private StartFailedListener mListener;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onDestroy() {
        if (mSinchClient != null && mSinchClient.isStarted()) {
            mSinchClient.terminateGracefully();
        }
        super.onDestroy();
    }

    private void start(String userName) {
        if (mSinchClient == null) {
            mUserId = userName;
            mSinchClient = Sinch.getSinchClientBuilder().context(getApplicationContext()).userId(userName)
                    .applicationKey(APP_KEY)
                    .applicationSecret(APP_SECRET)
                    .userId(mUserId)
                    .environmentHost(ENVIRONMENT).build();

            mSinchClient.setSupportCalling(true);
            mSinchClient.startListeningOnActiveConnection();

            mSinchClient.addSinchClientListener(new MySinchClientListener());
            mSinchClient.getCallClient().addCallClientListener(new SinchCallClientListener());
            mSinchClient.setSupportManagedPush(true);
            mSinchClient.setSupportActiveConnectionInBackground(true);
            mSinchClient.start();
        }
    }

    private void stop() {
        if (mSinchClient != null) {
            mSinchClient.unregisterManagedPush();
            mSinchClient.terminateGracefully();
            mSinchClient.stopListeningOnActiveConnection();
            mSinchClient.setSupportManagedPush(false);
            mSinchClient = null;
        }
    }

    private boolean isStarted() {
        return (mSinchClient != null && mSinchClient.isStarted());
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mSinchServiceInterface;
    }

    public class SinchServiceInterface extends Binder {

        public Call callPhoneNumber(String phoneNumber) {
            return mSinchClient.getCallClient().callPhoneNumber(phoneNumber);
        }

        public Call callUser(String userId) {
            return mSinchClient.getCallClient().callUser(userId);
        }

        public Call callUser(String userId, Map<String, String> headers) {
            return mSinchClient.getCallClient().callUser(userId, headers);
        }

        public String getUserName() {
            return mUserId;
        }

        public boolean isStarted() {
            return SinchService.this.isStarted();
        }

        public void startClient(String userName) {
            System.out.println("aaa1 "+userName);
            start(userName);
        }

        public void stopClient() {
            stop();
        }

        public void setStartListener(StartFailedListener listener) {
            mListener = listener;
        }


        public Call getCall(String callId) {
            return mSinchClient.getCallClient().getCall(callId);
        }

        public void relayRemotePushNotificationPayload(final Map payload) {

            if (mSinchClient == null && !SharedHelper.getKey(getApplicationContext(),"userid").isEmpty()) {
                start(SharedHelper.getKey(getApplicationContext(),"userid"));
            } else if (mSinchClient == null) {
                Log.e(TAG, "Can't start a SinchClient as no username is available, unable to relay push.");
                return;
            }
            mSinchClient.relayRemotePushNotificationPayload(payload);
        }
    }

    public interface StartFailedListener {
        void onStartFailed(SinchError error);

        void onStarted();
    }

    private class MySinchClientListener implements SinchClientListener {

        @Override
        public void onClientFailed(SinchClient client, SinchError error) {
            if (mListener != null) {
                mListener.onStartFailed(error);
            }
           mSinchClient.unregisterManagedPush();
            mSinchClient.terminateGracefully();
            mSinchClient = null;
        }

        @Override
        public void onClientStarted(SinchClient client) {
            Log.d(TAG, "SinchClient started");
            if (mListener != null) {
                mListener.onStarted();
            }
        }

        @Override
        public void onClientStopped(SinchClient client) {
            Log.d(TAG, "SinchClient stopped");
        }

        @Override
        public void onLogMessage(int level, String area, String message) {
            switch (level) {
                case Log.DEBUG:
                    Log.d(area, message);
                    break;
                case Log.ERROR:
                    Log.e(area, message);
                    break;
                case Log.INFO:
                    Log.i(area, message);
                    break;
                case Log.VERBOSE:
                    Log.v(area, message);
                    break;
                case Log.WARN:
                    Log.w(area, message);
                    break;
            }
        }

        @Override
        public void onRegistrationCredentialsRequired(SinchClient client,
                                                      ClientRegistration clientRegistration) {

        }


 /*       @Override
        public void onPushTokenRegistered() {

        }

        @Override
        public void onPushTokenRegistrationFailed(SinchError sinchError) {

        }

        @Override
        public void onCredentialsRequired(ClientRegistration clientRegistration) {

        }

        @Override
        public void onUserRegistered() {

        }

        @Override
        public void onUserRegistrationFailed(SinchError sinchError) {

        } */
    }

    private class SinchCallClientListener implements CallClientListener {

        @Override
        public void onIncomingCall(CallClient callClient, Call call) {
            Log.d(TAG, "Incoming call");
            Intent intent = new Intent(SinchService.this, CallActivity.class);
            intent.putExtra(CALL_ID, call.getCallId());
            intent.putExtra(LOCATION, call.getHeaders().get("location"));
            intent.putExtra("calltype","incoming");
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            SinchService.this.startActivity(intent);
        }
    }


}