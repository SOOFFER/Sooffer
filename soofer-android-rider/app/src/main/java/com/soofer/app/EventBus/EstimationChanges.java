package com.soofer.app.EventBus;

public class EstimationChanges {
    private final String strRequestStatus;

    public EstimationChanges(String strRequestStatus) {
        this.strRequestStatus = strRequestStatus;
    }

    public String getMessage() {
        return strRequestStatus;
    }
}
