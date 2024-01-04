package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class WalletTransactionModel {
    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("bal")
    @Expose
    private String bal;
    @SerializedName("paymentDate")
    @Expose
    private String paymentDate;
    @SerializedName("type")
    @Expose
    private String type;
    @SerializedName("amt")
    @Expose
    private String amt;
    @SerializedName("description")
    @Expose
    private String description;
    @SerializedName("trxId")
    @Expose
    private String trxId;
    @SerializedName("createdAt")
    @Expose
    private String createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBal() {
        return bal;
    }

    public void setBal(String bal) {
        this.bal = bal;
    }

    public String getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(String paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAmt() {
        return amt;
    }

    public void setAmt(String amt) {
        this.amt = amt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTrxId() {
        return trxId;
    }

    public void setTrxId(String trxId) {
        this.trxId = trxId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

}
