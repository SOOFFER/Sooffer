package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class CreateOrderModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
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
        @SerializedName("amount")
        @Expose
        private Integer amount;
        @SerializedName("amount_paid")
        @Expose
        private Integer amountPaid;
        @SerializedName("amount_due")
        @Expose
        private Integer amountDue;
        @SerializedName("currency")
        @Expose
        private String currency;
        @SerializedName("receipt")
        @Expose
        private Object receipt;
        @SerializedName("offer_id")
        @Expose
        private Object offerId;
        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("attempts")
        @Expose
        private Integer attempts;
        @SerializedName("notes")
        @Expose
        private List<Object> notes = null;
        @SerializedName("created_at")
        @Expose
        private Integer createdAt;

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

        public Integer getAmount() {
            return amount;
        }

        public void setAmount(Integer amount) {
            this.amount = amount;
        }

        public Integer getAmountPaid() {
            return amountPaid;
        }

        public void setAmountPaid(Integer amountPaid) {
            this.amountPaid = amountPaid;
        }

        public Integer getAmountDue() {
            return amountDue;
        }

        public void setAmountDue(Integer amountDue) {
            this.amountDue = amountDue;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public Object getReceipt() {
            return receipt;
        }

        public void setReceipt(Object receipt) {
            this.receipt = receipt;
        }

        public Object getOfferId() {
            return offerId;
        }

        public void setOfferId(Object offerId) {
            this.offerId = offerId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Integer getAttempts() {
            return attempts;
        }

        public void setAttempts(Integer attempts) {
            this.attempts = attempts;
        }

        public List<Object> getNotes() {
            return notes;
        }

        public void setNotes(List<Object> notes) {
            this.notes = notes;
        }

        public Integer getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Integer createdAt) {
            this.createdAt = createdAt;
        }

    }

}
