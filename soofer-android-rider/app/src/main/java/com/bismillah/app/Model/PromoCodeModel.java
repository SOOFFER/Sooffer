package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class PromoCodeModel {

    @Expose
    @SerializedName("discountAmt")
    private String discountAmt;
    @Expose
    @SerializedName("message")
    private String message;
    @Expose
    @SerializedName("success")
    private boolean success;

    public String getDiscountAmt() {
        return discountAmt;
    }

    public void setDiscountAmt(String discountAmt) {
        this.discountAmt = discountAmt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean getSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
