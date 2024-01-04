package com.bismillah.driver.EventBus;

import com.google.firebase.database.DataSnapshot;

public class RequestMessage {
    DataSnapshot Requestdata;

    public DataSnapshot getRequestdata() {
        return Requestdata;
    }

    public RequestMessage(DataSnapshot requestdata) {
        Requestdata = requestdata;
    }
}
