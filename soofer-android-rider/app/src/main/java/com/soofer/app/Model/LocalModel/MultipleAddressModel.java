package com.soofer.app.Model.LocalModel;

public class MultipleAddressModel {

    private String strAddress ="";
    private double doubleLat;
    private double doubleLng;


    public void setStrAddress(String strAddress) {
        this.strAddress = strAddress;
    }

    public void setDoubleLat(double doubleLat) {
        this.doubleLat = doubleLat;
    }

    public void setDoubleLng(double doubleLng) {
        this.doubleLng = doubleLng;
    }

    public boolean isUpdatePosition() {
        return updatePosition;
    }

    public void setUpdatePosition(boolean updatePosition) {
        this.updatePosition = updatePosition;
    }

    private boolean updatePosition = false;

    public String getStrAddress() {
        return strAddress;
    }

    public double getDoubleLat() {
        return doubleLat;
    }

    public double getDoubleLng() {
        return doubleLng;
    }



    public MultipleAddressModel(String strAddress, double doubleLat, double doubleLng) {
        this.strAddress = strAddress;
        this.doubleLat = doubleLat;
        this.doubleLng = doubleLng;
    }



}