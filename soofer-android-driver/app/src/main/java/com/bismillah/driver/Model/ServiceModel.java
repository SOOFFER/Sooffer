package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

/**
 * Created by com on 21-Jun-18.
 */

public class ServiceModel implements Serializable {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("vehiclelists")
    @Expose
    private List<String> vehiclelists = null;

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

    public List<String> getVehiclelists() {
        return vehiclelists;
    }

    public void setVehiclelists(List<String> vehiclelists) {
        this.vehiclelists = vehiclelists;
    }

}
