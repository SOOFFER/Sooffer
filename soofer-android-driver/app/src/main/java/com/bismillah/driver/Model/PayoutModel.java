package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PayoutModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;

    public String getWalletBal() {
        return walletBal;
    }

    public void setWalletBal(String walletBal) {
        this.walletBal = walletBal;
    }

    @SerializedName("walletBal")
    @Expose
    private String walletBal;
    @SerializedName("data")
    @Expose
    private Data data;

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }


    public class Data {

        @SerializedName("id")
        @Expose
        private String id;
        @SerializedName("entity")
        @Expose
        private String entity;
        @SerializedName("fund_account_id")
        @Expose
        private String fundAccountId;
        @SerializedName("amount")
        @Expose
        private String amount;
        @SerializedName("currency")
        @Expose
        private String currency;
        @SerializedName("notes")
        @Expose
        private List<Object> notes = null;
        @SerializedName("fees")
        @Expose
        private String fees;
        @SerializedName("tax")
        @Expose
        private String tax;
        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("purpose")
        @Expose
        private String purpose;
        @SerializedName("utr")
        @Expose
        private Object utr;
        @SerializedName("mode")
        @Expose
        private String mode;
        @SerializedName("reference_id")
        @Expose
        private Object referenceId;
        @SerializedName("narration")
        @Expose
        private String narration;
        @SerializedName("batch_id")
        @Expose
        private Object batchId;
        @SerializedName("failure_reason")
        @Expose
        private Object failureReason;
        @SerializedName("created_at")
        @Expose
        private String createdAt;
        @SerializedName("fee_type")
        @Expose
        private Object feeType;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getEntity() {
            return entity;
        }

        public void setEntity(String entity) {
            this.entity = entity;
        }

        public String getFundAccountId() {
            return fundAccountId;
        }

        public void setFundAccountId(String fundAccountId) {
            this.fundAccountId = fundAccountId;
        }

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public List<Object> getNotes() {
            return notes;
        }

        public void setNotes(List<Object> notes) {
            this.notes = notes;
        }

        public String getFees() {
            return fees;
        }

        public void setFees(String fees) {
            this.fees = fees;
        }

        public String getTax() {
            return tax;
        }

        public void setTax(String tax) {
            this.tax = tax;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getPurpose() {
            return purpose;
        }

        public void setPurpose(String purpose) {
            this.purpose = purpose;
        }

        public Object getUtr() {
            return utr;
        }

        public void setUtr(Object utr) {
            this.utr = utr;
        }

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public Object getReferenceId() {
            return referenceId;
        }

        public void setReferenceId(Object referenceId) {
            this.referenceId = referenceId;
        }

        public String getNarration() {
            return narration;
        }

        public void setNarration(String narration) {
            this.narration = narration;
        }

        public Object getBatchId() {
            return batchId;
        }

        public void setBatchId(Object batchId) {
            this.batchId = batchId;
        }

        public Object getFailureReason() {
            return failureReason;
        }

        public void setFailureReason(Object failureReason) {
            this.failureReason = failureReason;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public Object getFeeType() {
            return feeType;
        }

        public void setFeeType(Object feeType) {
            this.feeType = feeType;
        }

    }

}
