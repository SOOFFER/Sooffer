package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class DeleteVehicle {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("drivertaxis")
    @Expose
    private List<Drivertaxi> drivertaxis = null;

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

    public List<Drivertaxi> getDrivertaxis() {
        return drivertaxis;
    }

    public void setDrivertaxis(List<Drivertaxi> drivertaxis) {
        this.drivertaxis = drivertaxis;
    }

}

 class Drivertaxi {

    @SerializedName("makeid")
    @Expose
    private String makeid;
    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("taxistatus")
    @Expose
    private String taxistatus;
    @SerializedName("type")
    @Expose
    private List<Type> type = null;
    @SerializedName("handicap")
    @Expose
    private String handicap;
    @SerializedName("color")
    @Expose
    private String color;
    @SerializedName("driver")
    @Expose
    private String driver;
    @SerializedName("cpy")
    @Expose
    private String cpy;
    @SerializedName("licence")
    @Expose
    private String licence;
    @SerializedName("year")
    @Expose
    private String year;
    @SerializedName("model")
    @Expose
    private String model;
    @SerializedName("makename")
    @Expose
    private String makename;

    public String getMakeid() {
        return makeid;
    }

    public void setMakeid(String makeid) {
        this.makeid = makeid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTaxistatus() {
        return taxistatus;
    }

    public void setTaxistatus(String taxistatus) {
        this.taxistatus = taxistatus;
    }

    public List<Type> getType() {
        return type;
    }

    public void setType(List<Type> type) {
        this.type = type;
    }

    public String getHandicap() {
        return handicap;
    }

    public void setHandicap(String handicap) {
        this.handicap = handicap;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public String getCpy() {
        return cpy;
    }

    public void setCpy(String cpy) {
        this.cpy = cpy;
    }

    public String getLicence() {
        return licence;
    }

    public void setLicence(String licence) {
        this.licence = licence;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getMakename() {
        return makename;
    }

    public void setMakename(String makename) {
        this.makename = makename;
    }

}


 class Type {

    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("luxury")
    @Expose
    private String luxury;
    @SerializedName("normal")
    @Expose
    private String normal;
    @SerializedName("basic")
    @Expose
    private String basic;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLuxury() {
        return luxury;
    }

    public void setLuxury(String luxury) {
        this.luxury = luxury;
    }

    public String getNormal() {
        return normal;
    }

    public void setNormal(String normal) {
        this.normal = normal;
    }

    public String getBasic() {
        return basic;
    }

    public void setBasic(String basic) {
        this.basic = basic;
    }

}