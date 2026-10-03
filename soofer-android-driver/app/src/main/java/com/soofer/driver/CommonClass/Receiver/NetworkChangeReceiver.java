package com.soofer.driver.CommonClass.Receiver;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.soofer.driver.ApplicationController.AppController;
import com.soofer.driver.CommonClass.WorkManger.NetworkUtils;
import com.soofer.driver.FlowInterface.NetworkCallback;

import static com.soofer.driver.CommonClass.Utiles.isNetworkAvailable;

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
        System.out.println("Enter the wifi connectivity"+isNetworkAvailable(AppController.getContexts()));
        if(networkCallback!=null && previous != isNetworkAvailable(AppController.getContexts())){
            networkCallback.networkCallback(isNetworkAvailable(AppController.getContexts()));
            previous = NetworkUtils.isConnect();
        }

    }
}
