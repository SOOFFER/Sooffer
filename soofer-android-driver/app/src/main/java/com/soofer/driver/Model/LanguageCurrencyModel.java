package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class LanguageCurrencyModel {
    @SerializedName("status")
    @Expose
    private Boolean status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("data")
    @Expose
    private Data data;

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }


    public class Curnlangdatum {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("datas")
        @Expose
        private List<Data_> datas = null;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public List<Data_> getDatas() {
            return datas;
        }

        public void setDatas(List<Data_> datas) {
            this.datas = datas;
        }

    }
    public class Data {

        @SerializedName("curnlangdata")
        @Expose
        private List<Curnlangdatum> curnlangdata = null;
        @SerializedName("isoLanguages")
        @Expose
        private List<IsoLanguage> isoLanguages = null;

        public List<Curnlangdatum> getCurnlangdata() {
            return curnlangdata;
        }

        public void setCurnlangdata(List<Curnlangdatum> curnlangdata) {
            this.curnlangdata = curnlangdata;
        }

        public List<IsoLanguage> getIsoLanguages() {
            return isoLanguages;
        }

        public void setIsoLanguages(List<IsoLanguage> isoLanguages) {
            this.isoLanguages = isoLanguages;
        }

    }

    public class Data_ {

        @SerializedName("id")
        @Expose
        private String id;
        @SerializedName("name")
        @Expose
        private String name;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }

    public class IsoLanguage {

        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("languageName")
        @Expose
        private String languageName;
        @SerializedName("isoLanguageCode")
        @Expose
        private String isoLanguageCode;
        @SerializedName("createdAt")
        @Expose
        private String createdAt;
        @SerializedName("__v")
        @Expose
        private Integer v;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getLanguageName() {
            return languageName;
        }

        public void setLanguageName(String languageName) {
            this.languageName = languageName;
        }

        public String getIsoLanguageCode() {
            return isoLanguageCode;
        }

        public void setIsoLanguageCode(String isoLanguageCode) {
            this.isoLanguageCode = isoLanguageCode;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public Integer getV() {
            return v;
        }

        public void setV(Integer v) {
            this.v = v;
        }

    }

}
