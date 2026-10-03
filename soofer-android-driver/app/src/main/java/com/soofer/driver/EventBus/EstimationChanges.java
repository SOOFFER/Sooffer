package com.soofer.driver.EventBus;

public class EstimationChanges {
    String amtToPay = "";
    String commission = "";
    String amtToDriver = "";
    String tax = "";
    String gatewayCharge = "";
    String bookingFare = "";
    String tollfar = "";
    String id = "";

    public String getamttopay() {
        return amtToPay;
    }

    public String getcommision() {
        return commission;
    }

    public String getamtToDriver() {
        return amtToDriver;
    }

    public String getTax() {
        return tax;
    }

    public String getGatewayCharge() {
        return gatewayCharge;
    }

    public String getBookingFare() {
        return bookingFare;
    }

    public String getTollfare() {
        return tollfar;
    }

    public EstimationChanges(String amtToPay, String commission, String amtToDriver, String tax,String bookingFare,String tollfare, String gatewayCharge) {
        this.amtToPay = amtToPay;
        this.commission = commission;
        this.amtToDriver = amtToDriver;
        this.tax = tax;
        this.bookingFare = bookingFare;
        this.tollfar = tollfare;
        this.gatewayCharge = gatewayCharge;

    }
}
