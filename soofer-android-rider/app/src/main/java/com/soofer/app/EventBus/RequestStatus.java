package com.soofer.app.EventBus;

public class RequestStatus {
    private final String strRequestStatus;

    public RequestStatus(String strRequestStatus) {
        this.strRequestStatus = strRequestStatus;
    }

    public String getMessage() {
        return strRequestStatus;
    }
}
