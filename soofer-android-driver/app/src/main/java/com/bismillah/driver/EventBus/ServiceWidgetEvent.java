package com.bismillah.driver.EventBus;

import android.graphics.Rect;

public class ServiceWidgetEvent {

    public ServiceWidgetEvent(Rect service) {
        this.service = service;
    }

    public Rect service;
}
