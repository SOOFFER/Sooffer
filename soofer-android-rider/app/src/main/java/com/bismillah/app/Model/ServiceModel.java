package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;


public class ServiceModel implements Serializable {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;


    @SerializedName("vehicleCategories")
    @Expose
    private List<VehicleCategory> vehicleCategories = null;
    @SerializedName("pickupCity")
    @Expose
    private String pickupCity;

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

    public List<VehicleCategory> getVehicleCategories() {
        return vehicleCategories;
    }

    public void setVehicleCategories(List<VehicleCategory> vehicleCategories) {
        this.vehicleCategories = vehicleCategories;
    }

    public String getPickupCity() {
        return pickupCity;
    }

    public void setPickupCity(String pickupCity) {
        this.pickupCity = pickupCity;
    }

    public class VehicleCategory {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("type")
        @Expose
        private String type;
        @SerializedName("tripTypeCode")
        @Expose
        private String tripTypeCode;
        @SerializedName("bkm")
        @Expose
        private String bkm;
        @SerializedName("file")
        @Expose
        private String file;
        @SerializedName("available")
        @Expose
        private Boolean available;
        @SerializedName("isRideLater")
        @Expose
        private Boolean isRideLater;
        @SerializedName("asppc")
        @Expose
        private String asppc;

        @SerializedName("isShareAvailable")
        @Expose
        private Boolean isShareAvailable;
        @SerializedName("eta")
        @Expose
        private String eta;

        public String getSeats() {
            return seats;
        }

        public void setSeats(String seats) {
            this.seats = seats;
        }

        @SerializedName("seats")
        @Expose
        private String seats;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getTripTypeCode() {
            return tripTypeCode;
        }

        public void setTripTypeCode(String tripTypeCode) {
            this.tripTypeCode = tripTypeCode;
        }

        public String getBkm() {
            return bkm;
        }

        public void setBkm(String bkm) {
            this.bkm = bkm;
        }

        public String getFile() {
            return file;
        }

        public void setFile(String file) {
            this.file = file;
        }

        public Boolean getAvailable() {
            return available;
        }

        public void setAvailable(Boolean available) {
            this.available = available;
        }

        public Boolean getIsRideLater() {
            return isRideLater;
        }

        public void setIsRideLater(Boolean isRideLater) {
            this.isRideLater = isRideLater;
        }

        public String getAsppc() {
            return asppc;
        }

        public void setAsppc(String asppc) {
            this.asppc = asppc;
        }

        public Boolean getIsShareAvailable() {
            return isShareAvailable;
        }

        public void setIsShareAvailable(Boolean isShareAvailable) {
            this.isShareAvailable = isShareAvailable;
        }

        public String getEta() {
            return eta;
        }

        public void setEta(String eta) {
            this.eta = eta;
        }

    }


}
