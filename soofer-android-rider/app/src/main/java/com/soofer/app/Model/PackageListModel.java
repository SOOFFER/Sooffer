package com.soofer.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PackageListModel {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("packageDetail")
    @Expose
    private List<PackageDetail> packageDetail = null;
    @SerializedName("serviceDetail")
    @Expose
    private List<String> serviceDetail = null;
    @SerializedName("Description")
    @Expose
    private String description;

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

    public List<PackageDetail> getPackageDetail() {
        return packageDetail;
    }

    public void setPackageDetail(List<PackageDetail> packageDetail) {
        this.packageDetail = packageDetail;
    }

    public List<String> getServiceDetail() {
        return serviceDetail;
    }

    public void setServiceDetail(List<String> serviceDetail) {
        this.serviceDetail = serviceDetail;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public class PackageDetail {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("distance")
        @Expose
        private String distance;
        @SerializedName("duration")
        @Expose
        private String duration;
        @SerializedName("price")
        @Expose
        private String price;
        @SerializedName("name")
        @Expose
        private String name;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getDistance() {
            return distance;
        }

        public void setDistance(String distance) {
            this.distance = distance;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getPrice() {
            return price;
        }

        public void setPrice(String price) {
            this.price = price;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }
}
