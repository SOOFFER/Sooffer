package com.soofer.driver.Model.FirebaseModel;

public class NotificationModel {
    private FCMPayloadModel data;
    private String token;

    // Constructor
    public NotificationModel(FCMPayloadModel data, String token) {
        this.data = data;
        this.token = token;
    }

    public FCMPayloadModel getData() {
        return data;
    }

    public void setData(FCMPayloadModel data) {
        this.data = data;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

