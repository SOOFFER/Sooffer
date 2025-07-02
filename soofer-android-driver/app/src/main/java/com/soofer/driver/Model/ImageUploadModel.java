package com.soofer.driver.Model;

import com.google.gson.annotations.SerializedName;

public class ImageUploadModel {

    @SerializedName("success")
    private boolean success;

    @SerializedName("message")
    private String message;

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}
