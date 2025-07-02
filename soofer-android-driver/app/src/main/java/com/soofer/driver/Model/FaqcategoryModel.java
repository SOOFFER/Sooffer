package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class FaqcategoryModel {


    @SerializedName("language")
    @Expose
    private String language;
    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("iDisplayOrder")
    @Expose
    private String iDisplayOrder;
    @SerializedName("vTitle_EN")
    @Expose
    private String vTitleEN;
    @SerializedName("__v")
    @Expose
    private Integer v;
    @SerializedName("eStatus")
    @Expose
    private String eStatus;

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getiDisplayOrder() {
        return iDisplayOrder;
    }

    public void setiDisplayOrder(String iDisplayOrder) {
        this.iDisplayOrder = iDisplayOrder;
    }

    public String getvTitleEN() {
        return vTitleEN;
    }

    public void setvTitleEN(String vTitleEN) {
        this.vTitleEN = vTitleEN;
    }

    public Integer getV() {
        return v;
    }

    public void setV(Integer v) {
        this.v = v;
    }

    public String geteStatus() {
        return eStatus;
    }

    public void seteStatus(String eStatus) {
        this.eStatus = eStatus;
    }

}
