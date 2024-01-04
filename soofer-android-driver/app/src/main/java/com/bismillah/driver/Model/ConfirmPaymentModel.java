package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class ConfirmPaymentModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("datas")
    @Expose
    private Datas datas;
    @SerializedName("referalInviteApproval")
    @Expose
    private Boolean referalInviteApproval;
    @SerializedName("walletUsageApproval")
    @Expose
    private Boolean walletUsageApproval;

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

    public Datas getDatas() {
        return datas;
    }

    public void setDatas(Datas datas) {
        this.datas = datas;
    }

    public Boolean getReferalInviteApproval() {
        return referalInviteApproval;
    }

    public void setReferalInviteApproval(Boolean referalInviteApproval) {
        this.referalInviteApproval = referalInviteApproval;
    }

    public Boolean getWalletUsageApproval() {
        return walletUsageApproval;
    }

    public void setWalletUsageApproval(Boolean walletUsageApproval) {
        this.walletUsageApproval = walletUsageApproval;
    }
    public class Datas {

        @SerializedName("__v")
        @Expose
        private String v;
        @SerializedName("driverId")
        @Expose
        private String driverId;
        @SerializedName("driverName")
        @Expose
        private String driverName;
        @SerializedName("packageId")
        @Expose
        private String packageId;
        @SerializedName("packageName")
        @Expose
        private String packageName;
        @SerializedName("amount")
        @Expose
        private String amount;
        @SerializedName("walletAmount")
        @Expose
        private String walletAmount;
        @SerializedName("paytmAmount")
        @Expose
        private String paytmAmount;
        @SerializedName("type")
        @Expose
        private String type;
        @SerializedName("credit")
        @Expose
        private String credit;
        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("adminId")
        @Expose
        private Object adminId;
        @SerializedName("endDate")
        @Expose
        private String endDate;
        @SerializedName("purchaseDate")
        @Expose
        private String purchaseDate;
        @SerializedName("startDate")
        @Expose
        private String startDate;
        @SerializedName("createdAt")
        @Expose
        private String createdAt;

        public String getV() {
            return v;
        }

        public void setV(String v) {
            this.v = v;
        }

        public String getDriverId() {
            return driverId;
        }

        public void setDriverId(String driverId) {
            this.driverId = driverId;
        }

        public String getDriverName() {
            return driverName;
        }

        public void setDriverName(String driverName) {
            this.driverName = driverName;
        }

        public String getPackageId() {
            return packageId;
        }

        public void setPackageId(String packageId) {
            this.packageId = packageId;
        }

        public String getPackageName() {
            return packageName;
        }

        public void setPackageName(String packageName) {
            this.packageName = packageName;
        }

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }

        public String getWalletAmount() {
            return walletAmount;
        }

        public void setWalletAmount(String walletAmount) {
            this.walletAmount = walletAmount;
        }

        public String getPaytmAmount() {
            return paytmAmount;
        }

        public void setPaytmAmount(String paytmAmount) {
            this.paytmAmount = paytmAmount;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getCredit() {
            return credit;
        }

        public void setCredit(String credit) {
            this.credit = credit;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public Object getAdminId() {
            return adminId;
        }

        public void setAdminId(Object adminId) {
            this.adminId = adminId;
        }

        public String getEndDate() {
            return endDate;
        }

        public void setEndDate(String endDate) {
            this.endDate = endDate;
        }

        public String getPurchaseDate() {
            return purchaseDate;
        }

        public void setPurchaseDate(String purchaseDate) {
            this.purchaseDate = purchaseDate;
        }

        public String getStartDate() {
            return startDate;
        }

        public void setStartDate(String startDate) {
            this.startDate = startDate;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

    }
}
