package com.soofer.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class FaqModel {

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

    @SerializedName("language")
    @Expose
    private String language;
    @SerializedName("_id")
    @Expose
    private String id;

    public String getIfaqcategoryId() {
        return ifaqcategoryId;
    }

    public void setIfaqcategoryId(String ifaqcategoryId) {
        this.ifaqcategoryId = ifaqcategoryId;
    }

    @SerializedName("ifaqcategoryId")
    @Expose
    private String ifaqcategoryId;

    public String getIfaqcategorytitle() {
        return ifaqcategorytitle;
    }

    public void setIfaqcategorytitle(String ifaqcategorytitle) {
        this.ifaqcategorytitle = ifaqcategorytitle;
    }

    @SerializedName("ifaqcategorytitle")
    @Expose
    private String ifaqcategorytitle;

    public String getEnglish() {
        return English;
    }

    public void setEnglish(String english) {
        English = english;
    }

    @SerializedName("English")
    @Expose
    private String English;




}
