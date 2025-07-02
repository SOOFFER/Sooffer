package com.soofer.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class EditProfileModel {

    @Expose
    @SerializedName("success")
    private boolean success;
    @Expose
    @SerializedName("request")
    private Request request;
    @Expose
    @SerializedName("message")
    private String message;
    @Expose
    @SerializedName("fileurl")
    private String fileurl;

    public boolean getSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFileurl() {
        return fileurl;
    }

    public void setFileurl(String fileurl) {
        this.fileurl = fileurl;
    }

    public static class Request {
        @Expose
        @SerializedName("profile")
        private String profile;
        @Expose
        @SerializedName("phone")
        private String phone;
        @Expose
        @SerializedName("phcode")
        private String phcode;
        @Expose
        @SerializedName("lname")
        private String lname;
        @Expose
        @SerializedName("lang")
        private String lang;
        @Expose
        @SerializedName("fname")
        private String fname;
        @Expose
        @SerializedName("email")
        private String email;
        @Expose
        @SerializedName("cur")
        private String cur;
        @Expose
        @SerializedName("cntyname")
        private String cntyname;
        @Expose
        @SerializedName("cnty")
        private String cnty;

        public String getProfile() {
            return profile;
        }

        public void setProfile(String profile) {
            this.profile = profile;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getPhcode() {
            return phcode;
        }

        public void setPhcode(String phcode) {
            this.phcode = phcode;
        }

        public String getLname() {
            return lname;
        }

        public void setLname(String lname) {
            this.lname = lname;
        }

        public String getLang() {
            return lang;
        }

        public void setLang(String lang) {
            this.lang = lang;
        }

        public String getFname() {
            return fname;
        }

        public void setFname(String fname) {
            this.fname = fname;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getCur() {
            return cur;
        }

        public void setCur(String cur) {
            this.cur = cur;
        }

        public String getCntyname() {
            return cntyname;
        }

        public void setCntyname(String cntyname) {
            this.cntyname = cntyname;
        }

        public String getCnty() {
            return cnty;
        }

        public void setCnty(String cnty) {
            this.cnty = cnty;
        }
    }
}
