package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class EarningsModel {


    @Expose
    @SerializedName("yearly")
    private double yearly;
    @Expose
    @SerializedName("monthly")
    private double monthly;
    @Expose
    @SerializedName("weekly")
    private double weekly;
    @Expose
    @SerializedName("daily")
    private double daily;
    @Expose
    @SerializedName("total")
    private double total;

    public double getYearly() {
        return yearly;
    }

    public void setYearly(double yearly) {
        this.yearly = yearly;
    }

    public double getMonthly() {
        return monthly;
    }

    public void setMonthly(double monthly) {
        this.monthly = monthly;
    }

    public double getWeekly() {
        return weekly;
    }

    public void setWeekly(double weekly) {
        this.weekly = weekly;
    }

    public double getDaily() {
        return daily;
    }

    public void setDaily(int daily) {
        this.daily = daily;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
