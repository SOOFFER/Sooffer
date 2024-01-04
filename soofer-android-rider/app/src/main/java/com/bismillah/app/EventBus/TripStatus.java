package com.bismillah.app.EventBus;

public class TripStatus {

    private final String srtStatus;

    public TripStatus(String srtStatus) {
        this.srtStatus = srtStatus;
    }

    public String getMessage() {
        return srtStatus;
    }
}
