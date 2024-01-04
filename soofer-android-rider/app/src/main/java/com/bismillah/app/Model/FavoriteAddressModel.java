package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by com on 12-Oct-18.
 */

public class FavoriteAddressModel {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("Address")
    @Expose
    private List<ProfileModel.Address> address = null;

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

    public List<ProfileModel.Address> getAddress() {
        return address;
    }

    public void setAddress(List<ProfileModel.Address> address) {
        this.address = address;
    }


}
