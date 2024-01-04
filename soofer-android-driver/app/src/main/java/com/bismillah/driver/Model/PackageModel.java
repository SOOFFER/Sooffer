package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PackageModel {

    @SerializedName("subscriptionPackage")
    @Expose
    private List<SubscriptionPackage> subscriptionPackage = null;
    @SerializedName("commissionPackage")
    @Expose
    private List<CommissionPackage> commissionPackage = null;
    @SerializedName("subcriptionEndDate")
    @Expose
    private String subcriptionEndDate;
    @SerializedName("subscriptionId")
    @Expose
    private String subscriptionId;
    @SerializedName("subscriptionPurchaseId")
    @Expose
    private String subscriptionPurchaseId;

    public List<SubscriptionPackage> getSubscriptionPackage() {
        return subscriptionPackage;
    }

    public void setSubscriptionPackage(List<SubscriptionPackage> subscriptionPackage) {
        this.subscriptionPackage = subscriptionPackage;
    }

    public List<CommissionPackage> getCommissionPackage() {
        return commissionPackage;
    }

    public void setCommissionPackage(List<CommissionPackage> commissionPackage) {
        this.commissionPackage = commissionPackage;
    }

    public String getSubcriptionEndDate() {
        return subcriptionEndDate;
    }

    public void setSubcriptionEndDate(String subcriptionEndDate) {
        this.subcriptionEndDate = subcriptionEndDate;
    }

    public String getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(String subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    public String getSubscriptionPurchaseId() {
        return subscriptionPurchaseId;
    }

    public void setSubscriptionPurchaseId(String subscriptionPurchaseId) {
        this.subscriptionPurchaseId = subscriptionPurchaseId;
    }


    public class CommissionPackage {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("amount")
        @Expose
        private String amount;
        @SerializedName("firstPurchaseOnly")
        @Expose
        private Boolean firstPurchaseOnly;
        @SerializedName("vehicleType")
        @Expose
        private List<Object> vehicleType = null;
        @SerializedName("scIds")
        @Expose
        private List<ScId_> scIds = null;
        @SerializedName("PackageValidity")
        @Expose
        private String packageValidity;
        @SerializedName("credit")
        @Expose
        private String credit;
        @SerializedName("type")
        @Expose
        private String type;
        @SerializedName("createdAt")
        @Expose
        private String createdAt;
        @SerializedName("__v")
        @Expose
        private String v;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }

        public Boolean getFirstPurchaseOnly() {
            return firstPurchaseOnly;
        }

        public void setFirstPurchaseOnly(Boolean firstPurchaseOnly) {
            this.firstPurchaseOnly = firstPurchaseOnly;
        }

        public List<Object> getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(List<Object> vehicleType) {
            this.vehicleType = vehicleType;
        }

        public List<ScId_> getScIds() {
            return scIds;
        }

        public void setScIds(List<ScId_> scIds) {
            this.scIds = scIds;
        }

        public String getPackageValidity() {
            return packageValidity;
        }

        public void setPackageValidity(String packageValidity) {
            this.packageValidity = packageValidity;
        }

        public String getCredit() {
            return credit;
        }

        public void setCredit(String credit) {
            this.credit = credit;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getV() {
            return v;
        }

        public void setV(String v) {
            this.v = v;
        }

    }
    public class ScId {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("scId")
        @Expose
        private String scId;
        @SerializedName("name")
        @Expose
        private String name;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getScId() {
            return scId;
        }

        public void setScId(String scId) {
            this.scId = scId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }

    public class ScId_ {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("scId")
        @Expose
        private String scId;
        @SerializedName("name")
        @Expose
        private String name;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getScId() {
            return scId;
        }

        public void setScId(String scId) {
            this.scId = scId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }

    public class SubscriptionPackage {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("amount")
        @Expose
        private String amount;
        @SerializedName("firstPurchaseOnly")
        @Expose
        private Boolean firstPurchaseOnly;
        @SerializedName("vehicleType")
        @Expose
        private List<Object> vehicleType = null;
        @SerializedName("scIds")
        @Expose
        private List<ScId> scIds = null;
        @SerializedName("PackageValidity")
        @Expose
        private String packageValidity;
        @SerializedName("credit")
        @Expose
        private String credit;
        @SerializedName("type")
        @Expose
        private String type;
        @SerializedName("createdAt")
        @Expose
        private String createdAt;
        @SerializedName("__v")
        @Expose
        private String v;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }

        public Boolean getFirstPurchaseOnly() {
            return firstPurchaseOnly;
        }

        public void setFirstPurchaseOnly(Boolean firstPurchaseOnly) {
            this.firstPurchaseOnly = firstPurchaseOnly;
        }

        public List<Object> getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(List<Object> vehicleType) {
            this.vehicleType = vehicleType;
        }

        public List<ScId> getScIds() {
            return scIds;
        }

        public void setScIds(List<ScId> scIds) {
            this.scIds = scIds;
        }

        public String getPackageValidity() {
            return packageValidity;
        }

        public void setPackageValidity(String packageValidity) {
            this.packageValidity = packageValidity;
        }

        public String getCredit() {
            return credit;
        }

        public void setCredit(String credit) {
            this.credit = credit;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getV() {
            return v;
        }

        public void setV(String v) {
            this.v = v;
        }

    }
}
