package com.soofer.driver.EventBus;

public class DocumentUpload {
    String status;
    String imageurl;
    String strdate;


    public DocumentUpload(String status, String imageurl, String strdate) {

        this.status = status;
        this.imageurl = imageurl;
        this.strdate = strdate;

    }

    public String getStrdate() {
        return strdate;
    }

    public String getStatus() {
        return status;
    }

    public String getImageurl() {
        return imageurl;
    }
}
