package com.bismillah.app.EventBus;

public class socialModel {
    String fname = "";
    String lname = "";
    String email = "";

    public String getFname() {
        return fname;
    }

    public String getLname() {
        return lname;
    }

    public String getEmail() {
        return email;
    }

    public String getType() {
        return Type;
    }

    public String getTopage() {
        return topage;
    }

    public String getId() {
        return id;
    }

    String Type = "";
    String topage = "";
    String id = "";

    public socialModel(String fname, String lname, String email, String type, String topage, String id) {
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        Type = type;
        this.topage = topage;
        this.id = id;
    }


}