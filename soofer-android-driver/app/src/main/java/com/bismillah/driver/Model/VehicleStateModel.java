package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class VehicleStateModel {
    @SerializedName("type")
    @Expose
    private String type;
    @SerializedName("status")
    @Expose
    private Boolean status;

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    @SerializedName("file")
    @Expose
    private String file;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

}
