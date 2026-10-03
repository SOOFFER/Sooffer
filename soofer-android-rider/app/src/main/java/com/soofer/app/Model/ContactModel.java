package com.soofer.app.Model;

import java.io.Serializable;

public class ContactModel implements Serializable {
    String strName, strPhoneNumber;

    public ContactModel() {

    }

    public String getStrName() {
        return strName;
    }

    public void setStrName(String strName) {
        this.strName = strName;
    }

    public String getStrPhoneNumber() {
        return strPhoneNumber;
    }

    public void setStrPhoneNumber(String strPhoneNumber) {
        this.strPhoneNumber = strPhoneNumber;
    }

}
