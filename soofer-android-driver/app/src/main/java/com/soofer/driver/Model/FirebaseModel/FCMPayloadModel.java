package com.soofer.driver.Model.FirebaseModel;

public class FCMPayloadModel {

    public String title;
    public String msg;
    public String type;

    public String clickAction;
    public String date;
    public String tripId;

    public String name;

    public FCMPayloadModel(){

    }

    public FCMPayloadModel(String title, String msg, String type, String clickAction, String date, String tripId, String name) {
        this.title = title;
        this.msg = msg;
        this.type = type;
        this.date = date;
        this.tripId = tripId;
        this.name = name;
        this.clickAction = clickAction;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getClickAction() {
        return clickAction;
    }

    public void setClickAction(String clickAction) {
        this.clickAction = clickAction;
    }

    public String getTripId() {
        return tripId;
    }

    public void setTripId(String tripId) {
        this.tripId = tripId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


}

