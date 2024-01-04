package com.bismillah.driver.EventBus;

public class DocumentData {
    private String page;
    private String makeid;
    private String vehiclestatus;

    public DocumentData(String page, String makeid, String vehiclestatus) {
        this.page = page;
        this.makeid = makeid;
        this.vehiclestatus = vehiclestatus;

    }

    public String getPage() {
        return page;
    }

    public String getMakeid() {
        return makeid;
    }

    public String getVehiclestatus() {
        return vehiclestatus;
    }


}
