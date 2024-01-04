package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class OutStationModel {

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("vehicleList")
    @Expose
    private List<VehicleList> vehicleList = null;
    @SerializedName("returnHours")
    @Expose
    private String returnHours;
    @SerializedName("tripDuration")
    @Expose
    private String tripDuration;

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

    public List<VehicleList> getVehicleList() {
        return vehicleList;
    }

    public void setVehicleList(List<VehicleList> vehicleList) {
        this.vehicleList = vehicleList;
    }

    public String getReturnHours() {
        return returnHours;
    }

    public void setReturnHours(String returnHours) {
        this.returnHours = returnHours;
    }

    public String getTripDuration() {
        return tripDuration;
    }

    public void setTripDuration(String tripDuration) {
        this.tripDuration = tripDuration;
    }


    public class FareDetails {

        @SerializedName("baseFare")
        @Expose
        private String baseFare;
        @SerializedName("baseFareLabel")
        @Expose
        private String baseFareLabel;
        @SerializedName("remainingFare")
        @Expose
        private String remainingFare;
        @SerializedName("extraTimeFare")
        @Expose
        private String extraTimeFare;
        @SerializedName("remainingFareLabel")
        @Expose
        private String remainingFareLabel;
        @SerializedName("totalFare")
        @Expose
        private String totalFare;
        @SerializedName("description")
        @Expose
        private String description;
        public String getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(String taxPercentage) {
            this.taxPercentage = taxPercentage;
        }
        @SerializedName("taxPercentage")
        @Expose
        private String taxPercentage;

        public String getTax() {
            return tax;
        }

        public void setTax(String tax) {
            this.tax = tax;
        }

        @SerializedName("tax")
        @Expose
        private String tax;


        public String getNoOfDays() {
            return noOfDays;
        }

        public void setNoOfDays(String noOfDays) {
            this.noOfDays = noOfDays;
        }
        @SerializedName("noOfNights")
        @Expose
        private String noOfNights;
        @SerializedName("noOfDays")
        @Expose
        private String noOfDays;

        @SerializedName("nightFare")
        @Expose
        private String nightFare;

        @SerializedName("dayFare")
        @Expose
        private String dayFare;
        @SerializedName("nightRate")
        @Expose
        private String nightRate;

        @SerializedName("dayRate")
        @Expose
        private String dayRate;

        public String getNoOfNights() {
            return noOfNights;
        }

        public void setNoOfNights(String noOfNights) {
            this.noOfNights = noOfNights;
        }

        public String getNightFare() {
            return nightFare;
        }

        public void setNightFare(String nightFare) {
            this.nightFare = nightFare;
        }

        public String getDayFare() {
            return dayFare;
        }

        public void setDayFare(String dayFare) {
            this.dayFare = dayFare;
        }

        public String getNightRate() {
            return nightRate;
        }

        public void setNightRate(String nightRate) {
            this.nightRate = nightRate;
        }

        public String getDayRate() {
            return dayRate;
        }

        public void setDayRate(String dayRate) {
            this.dayRate = dayRate;
        }




        public String getRemainingTimeFareLabel() {
            return remainingTimeFareLabel;
        }

        public void setRemainingTimeFareLabel(String remainingTimeFareLabel) {
            this.remainingTimeFareLabel = remainingTimeFareLabel;
        }

        @SerializedName("remainingTimeFareLabel")
        @Expose
        private String remainingTimeFareLabel;



        public String getBaseFare() {
            return baseFare;
        }

        public void setBaseFare(String baseFare) {
            this.baseFare = baseFare;
        }

        public String getBaseFareLabel() {
            return baseFareLabel;
        }

        public void setBaseFareLabel(String baseFareLabel) {
            this.baseFareLabel = baseFareLabel;
        }

        public String getRemainingFare() {
            return remainingFare;
        }

        public void setRemainingFare(String remainingFare) {
            this.remainingFare = remainingFare;
        }

        public String getExtraTimeFare() {
            return extraTimeFare;
        }

        public void setExtraTimeFare(String extraTimeFare) {
            this.extraTimeFare = extraTimeFare;
        }

        public String getRemainingFareLabel() {
            return remainingFareLabel;
        }

        public void setRemainingFareLabel(String remainingFareLabel) {
            this.remainingFareLabel = remainingFareLabel;
        }

        public String getTotalFare() {
            return totalFare;
        }
        public String getPerKmRateRound() {
            return perKmRateRound;
        }

        public void setPerKmRateRound(String perKmRateRound) {
            this.perKmRateRound = perKmRateRound;
        }

        @SerializedName("perKmRateRound")
        @Expose
        private String perKmRateRound;
        public void setTotalFare(String totalFare) {
            this.totalFare = totalFare;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

    }

    public class VehicleList {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("packageId")
        @Expose
        private String packageId;
        @SerializedName("vehicle")
        @Expose
        private String vehicle;
        @SerializedName("tripTypeCode")
        @Expose
        private String tripTypeCode;
        @SerializedName("file")
        @Expose
        private String file;
        @SerializedName("description")
        @Expose
        private String description;
        @SerializedName("asppc")
        @Expose
        private String asppc;
        @SerializedName("timeFare")
        @Expose
        private String timeFare;
        @SerializedName("bkm")
        @Expose
        private String bkm;



        @SerializedName("distanceLable")
        @Expose
        private String distanceLable;
        @SerializedName("timeLable")
        @Expose
        private String timeLable;
        @SerializedName("pickupLocation")
        @Expose
        private String pickupLocation;
        @SerializedName("dropLocation")
        @Expose
        private String dropLocation;
        @SerializedName("fareDetails")
        @Expose
        private FareDetails fareDetails;
        @SerializedName("comison")
        @Expose
        private String comison;
        @SerializedName("conveyancePerKm")
        @Expose
        private String conveyancePerKm;


        @SerializedName("cancelationFeesDriver")
        @Expose
        private String cancelationFeesDriver;
        @SerializedName("cancelationFeesRider")
        @Expose
        private String cancelationFeesRider;
        @SerializedName("distanceKM")
        @Expose
        private String distanceKM;



        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getPackageId() {
            return packageId;
        }

        public void setPackageId(String packageId) {
            this.packageId = packageId;
        }

        public String getVehicle() {
            return vehicle;
        }

        public void setVehicle(String vehicle) {
            this.vehicle = vehicle;
        }

        public String getTripTypeCode() {
            return tripTypeCode;
        }

        public void setTripTypeCode(String tripTypeCode) {
            this.tripTypeCode = tripTypeCode;
        }

        public String getFile() {
            return file;
        }

        public void setFile(String file) {
            this.file = file;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getAsppc() {
            return asppc;
        }

        public void setAsppc(String asppc) {
            this.asppc = asppc;
        }

        public String getTimeFare() {
            return timeFare;
        }

        public void setTimeFare(String timeFare) {
            this.timeFare = timeFare;
        }

        public String getBkm() {
            return bkm;
        }

        public void setBkm(String bkm) {
            this.bkm = bkm;
        }

        public String getDistanceLable() {
            return distanceLable;
        }

        public void setDistanceLable(String distanceLable) {
            this.distanceLable = distanceLable;
        }

        public String getTimeLable() {
            return timeLable;
        }

        public void setTimeLable(String timeLable) {
            this.timeLable = timeLable;
        }

        public String getPickupLocation() {
            return pickupLocation;
        }

        public void setPickupLocation(String pickupLocation) {
            this.pickupLocation = pickupLocation;
        }

        public String getDropLocation() {
            return dropLocation;
        }

        public void setDropLocation(String dropLocation) {
            this.dropLocation = dropLocation;
        }

        public FareDetails getFareDetails() {
            return fareDetails;
        }

        public void setFareDetails(FareDetails fareDetails) {
            this.fareDetails = fareDetails;
        }

        public String getComison() {
            return comison;
        }

        public void setComison(String comison) {
            this.comison = comison;
        }

        public String getConveyancePerKm() {
            return conveyancePerKm;
        }

        public void setConveyancePerKm(String conveyancePerKm) {
            this.conveyancePerKm = conveyancePerKm;
        }


        public String getCancelationFeesDriver() {
            return cancelationFeesDriver;
        }

        public void setCancelationFeesDriver(String cancelationFeesDriver) {
            this.cancelationFeesDriver = cancelationFeesDriver;
        }

        public String getCancelationFeesRider() {
            return cancelationFeesRider;
        }

        public void setCancelationFeesRider(String cancelationFeesRider) {
            this.cancelationFeesRider = cancelationFeesRider;
        }

        public String getDistanceKM() {
            return distanceKM;
        }

        public void setDistanceKM(String distanceKM) {
            this.distanceKM = distanceKM;
        }

    }

}
