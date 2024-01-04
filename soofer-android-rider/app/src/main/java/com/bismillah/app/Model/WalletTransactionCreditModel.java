package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class WalletTransactionCreditModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("transaction")
    @Expose
    private List<Transaction> transaction = null;

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

    public List<Transaction> getTransaction() {
        return transaction;
    }

    public void setTransaction(List<Transaction> transaction) {
        this.transaction = transaction;
    }
    public class Transaction {

        @SerializedName("trxid")
        @Expose
        private String trxid;
        @SerializedName("amt")
        @Expose
        private Float amt;
        @SerializedName("date")
        @Expose
        private String date;
        @SerializedName("type")
        @Expose
        private String type;

        public String getTrxid() {
            return trxid;
        }

        public void setTrxid(String trxid) {
            this.trxid = trxid;
        }

        public Float getAmt() {
            return amt;
        }

        public void setAmt(Float amt) {
            this.amt = amt;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

    }


}
