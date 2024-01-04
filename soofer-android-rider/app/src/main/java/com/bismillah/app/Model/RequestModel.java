package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class RequestModel {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("requestDetails")
    @Expose
    private String requestDetails;
    @SerializedName("cancelTime")
    @Expose
    private String cancelTime;

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRequestDetails() {
        return requestDetails;
    }

    public void setRequestDetails(String requestDetails) {
        this.requestDetails = requestDetails;
    }

    public String getCancelTime() {
        return cancelTime;
    }

    public void setCancelTime(String cancelTime) {
        this.cancelTime = cancelTime;
    }


}
