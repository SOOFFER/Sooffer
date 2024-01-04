package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by com on 20-Nov-18.
 */

public class EarningModel {
    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("amttopay")
    @Expose
    private double amttopay;
    @SerializedName("commision")
    @Expose
    private String commision;
    @SerializedName("nos")
    @Expose
    private String nos;
    @SerializedName("date")
    @Expose
    private String date;
    @SerializedName("type")
    @Expose
    private String type;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getAmttopay() {
        return amttopay;
    }

    public void setAmttopay(double amttopay) {
        this.amttopay = amttopay;
    }

    public String getCommision() {
        return commision;
    }

    public void setCommision(String commision) {
        this.commision = commision;
    }

    public String getNos() {
        return nos;
    }

    public void setNos(String nos) {
        this.nos = nos;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


}
