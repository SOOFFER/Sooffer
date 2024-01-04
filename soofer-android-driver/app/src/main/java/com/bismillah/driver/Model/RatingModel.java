package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class RatingModel {

    @SerializedName("rating")
    @Expose
    private String rating;
    @SerializedName("nos")
    @Expose
    private Integer nos;
    @SerializedName("tottrip")
    @Expose
    private Integer tottrip;
    @SerializedName("star")
    @Expose
    private Integer star;
    @SerializedName("cmts")
    @Expose
    private String cmts;

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public Integer getNos() {
        return nos;
    }

    public void setNos(Integer nos) {
        this.nos = nos;
    }

    public Integer getTottrip() {
        return tottrip;
    }

    public void setTottrip(Integer tottrip) {
        this.tottrip = tottrip;
    }

    public Integer getStar() {
        return star;
    }

    public void setStar(Integer star) {
        this.star = star;
    }

    public String getCmts() {
        return cmts;
    }

    public void setCmts(String cmts) {
        this.cmts = cmts;
    }


}

