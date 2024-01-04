package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class RequestTexiHail {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("requestDetails")
    @Expose
    private String requestDetails;

    @SerializedName("tripno")
    @Expose
    private String tripno;


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

    public String getTripno() {
        return tripno;
    }

    public void setTripno(String tripno) {
        this.tripno = tripno;
    }
}
