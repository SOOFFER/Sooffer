package com.bismillah.driver.Model.LocalModel;

public class HailModel {
    private String strfName ="";

    public String getStrfName() {
        return strfName;
    }

    public String getStrlName() {
        return strlName;
    }

    public String getStrEmail() {
        return strEmail;
    }

    public String getStrCC() {
        return strCC;
    }

    public String getStrPhone() {
        return strPhone;
    }

    private String strlName ="";
    private String strEmail ="";
    private String strCC ="";
    private String strPhone ="";

    public HailModel(String strfName, String strlName, String strEmail, String strCC, String strPhone) {
        this.strfName = strfName;
        this.strlName = strlName;
        this.strEmail = strEmail;
        this.strCC = strCC;
        this.strPhone = strPhone;
    }


}