package com.soofer.app.Model.FirebaseModel;

public class FCMPayloadModel {
    public String title;
    public String message;
    public String type;

    public String click_action;

    public FCMPayloadModel(){

    }

    public FCMPayloadModel(String title, String message, String type,String click_action) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.click_action = click_action;
    }


    public String getName() {
        return title;
    }

    public void setName(String name) {
        this.title = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getClick_action() {
        return click_action;
    }

    public void setClick_action(String click_action) {
        this.click_action = click_action;
    }

}

