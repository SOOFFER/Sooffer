package com.soofer.app.EventBus;

public class SocialResponseEvent {
    private socialModel nsocialModel;
    private String mobile = "";
    private String code = "";

    public String getGender() {
        return gender;
    }

    String gender = "";
    public socialModel getNsocialModel() {
        return nsocialModel;
    }

    public String getMobile() {
        return mobile;
    }

    public String getCode() {
        return code;
    }


    public SocialResponseEvent(socialModel nsocialModel, String mobile, String code,String gender) {
        this.nsocialModel = nsocialModel;
        this.mobile = mobile;
        this.code = code;
        this.gender = gender;
    }


}
