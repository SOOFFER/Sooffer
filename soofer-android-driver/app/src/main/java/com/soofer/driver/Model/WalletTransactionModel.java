package com.soofer.driver.Model;

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

    @SerializedName("payment")
    @Expose
    private  Payment payment;

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

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public class Payment {

        @SerializedName("amttodriver")
        @Expose
        private String amttodriver;

        @SerializedName("tax")
        @Expose
        private Double tax;

        @SerializedName("amttopay")
        @Expose
        private Double amttopay;

        @SerializedName("commision")
        @Expose
        private Double commision;

        @SerializedName("booking")
        @Expose
        private String booking;



        @SerializedName("GatewayCharge")
        @Expose
        private String GatewayCharge;


        @SerializedName("tollFee")
        @Expose
        private String tollFee;


        public void setTollFee(String tollFee) {
            this.tollFee = tollFee;
        }
        public String getTollFee() {
            return tollFee;
        }

        public String getAmttodriver() {
            return amttodriver;
        }

        public void setAmttodriver(String amttodriver) {
            this.amttodriver = amttodriver;
        }
        public Double getTax() {
            return tax;
        }

        public void setTax(Double tax) {
            this.tax = tax;
        }

        public Double getAmttopay() {
            return amttopay;
        }

        public void setAmttopay(Double amttopay) {
            this.amttopay = amttopay;
        }

        public Double getCommision() {
            return commision;
        }

        public void setCommision(Double commision) {
            this.commision = commision;
        }

        public String getBooking() {
            return booking;
        }

        public void setBooking(String booking) {
            this.booking = booking;
        }

        public String getGatewayCharge() {
            return GatewayCharge;
        }

        public void setGatewayCharge(String GatewayCharge) {
            this.GatewayCharge = GatewayCharge;
        }

    }

}
