package com.bismillah.driver.EventBus;

public class DestinationAddressEvent {
    public String getAddress() {
        return address;
    }

    private String address;


    public DestinationAddressEvent(String address) {
        this.address = address;
    }
}
