package com.bismillah.driver.CommonClass.Receiver;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.bismillah.driver.Apllicationcontroller.Appcontroller;
import com.bismillah.driver.CommonClass.WorkManger.NetworkUtils;
import com.bismillah.driver.FlowInterface.NetworkCallback;

import static com.bismillah.driver.CommonClass.Utiles.isNetworkAvailable;

public class NetworkChangeReceiver  extends BroadcastReceiver {
    private NetworkCallback networkCallback;
    private boolean previous = false;
    public NetworkChangeReceiver() {
    }

    public void setInterface(NetworkCallback networkCallback){
        this.networkCallback = networkCallback;

    }

    @SuppressLint("UnsafeProtectedBroadcastReceiver")
    @Override
    public void onReceive(Context context, Intent intent) {
        System.out.println("Enter the wifi connectivity"+isNetworkAvailable(Appcontroller.getContexts()));
        if(networkCallback!=null && previous != isNetworkAvailable(Appcontroller.getContexts())){
            networkCallback.networkCallback(isNetworkAvailable(Appcontroller.getContexts()));
            previous = NetworkUtils.isConnect();
        }

    }
}
