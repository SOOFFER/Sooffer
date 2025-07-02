package com.soofer.driver.EventBus;

public class EstimationChanges {
    Double fname = 0.0;
    Double lname = 0.0;
    String email = "";

    public Double getamttopay() {
        return fname;
    }

    public Double getcommision() {
        return lname;
    }

    public String getbooking() {
        return email;
    }

    public Double getTax() {
        return Type;
    }

    public String getTopage() {
        return topage;
    }

    public String getbookings() {
        return bookings;
    }

    public String getTollfare() {
        return tollfar;
    }
    Double Type = 0.0;
    String topage = "";
    String bookings = "";
    String tollfar = "";
    String id = "";

    public EstimationChanges(Double fname, Double lname, String email, Double tax,String booking,String tollfare, String topage) {
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        Type = tax;
        bookings = booking;
        tollfar = tollfare;
        this.topage = topage;

    }
}
