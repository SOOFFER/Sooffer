package com.soofer.driver.EventBus;

public class AddedCard {
    private final String strCardNumber, strStripToken;

    public String getStrCardNumber() {
        return strCardNumber;
    }

    public String getStrStripToken() {
        return strStripToken;
    }

    public AddedCard(String strCardNumber, String strStripToken) {
        this.strCardNumber = strCardNumber;
        this.strStripToken = strStripToken;
    }

}
