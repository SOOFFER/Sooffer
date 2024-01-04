package com.bismillah.app.EventBus;

public class SocialEvent {
    public SocialEvent(String socialType, String fromPage) {
        this.socialType = socialType;
        FromPage = fromPage;
    }

    public String getSocialType() {
        return socialType;
    }

    public String getFromPage() {
        return FromPage;
    }

    String socialType ="";
    String FromPage ="";
}
