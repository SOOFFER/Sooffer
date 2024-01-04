package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class AttendanceModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("simalirityPercentage")
    @Expose
    private Integer simalirityPercentage;
    @SerializedName("profileImgMatchStatus")
    @Expose
    private String profileImgMatchStatus;

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

    public Integer getSimalirityPercentage() {
        return simalirityPercentage;
    }

    public void setSimalirityPercentage(Integer simalirityPercentage) {
        this.simalirityPercentage = simalirityPercentage;
    }

    public String getProfileImgMatchStatus() {
        return profileImgMatchStatus;
    }

    public void setProfileImgMatchStatus(String profileImgMatchStatus) {
        this.profileImgMatchStatus = profileImgMatchStatus;
    }

}
