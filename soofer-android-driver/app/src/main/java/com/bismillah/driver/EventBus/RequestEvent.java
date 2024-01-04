package com.bismillah.driver.EventBus;

public class RequestEvent {
    String ActivityFinish;

    public String getActivityFinish() {
        return ActivityFinish;
    }

    public RequestEvent(String activityFinish) {
        ActivityFinish = activityFinish;
    }
}
