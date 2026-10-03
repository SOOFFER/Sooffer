package com.soofer.app.EventBus;

public class MutlipleDestination {
    private final String strRequestStatus;

    public MutlipleDestination(String strRequestStatus) {
        this.strRequestStatus = strRequestStatus;
    }

    public String getMessage() {
        return strRequestStatus;
    }
}

