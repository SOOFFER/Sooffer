package com.soofer.app.Model.FirebaseModel;

public class Chat {
    public String name;
    public String message;
    public String type;


    public Chat(){

    }

    public Chat(String name, String message, String type) {
        this.name = name;
        this.message = message;
        this.type = type;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}

