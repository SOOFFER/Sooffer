package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class EstimationModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("distanceDetails")
    @Expose
    private DistanceDetails distanceDetails;
    @SerializedName("vehicleDetailsAndFare")
    @Expose
    private VehicleDetailsAndFare vehicleDetailsAndFare;
    @SerializedName("pickupCity")
    @Expose
    private String pickupCity;


    @SerializedName("estimationId")
    @Expose
    private String estimationId;
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

    public DistanceDetails getDistanceDetails() {
        return distanceDetails;
    }

    public void setDistanceDetails(DistanceDetails distanceDetails) {
        this.distanceDetails = distanceDetails;
    }

    public VehicleDetailsAndFare getVehicleDetailsAndFare() {
        return vehicleDetailsAndFare;
    }

    public void setVehicleDetailsAndFare(VehicleDetailsAndFare vehicleDetailsAndFare) {
        this.vehicleDetailsAndFare = vehicleDetailsAndFare;
    }

    public String getPickupCity() {
        return pickupCity;
    }

    public void setPickupCity(String pickupCity) {
        this.pickupCity = pickupCity;
    }

    public String getEstimationId() {
        return estimationId;
    }

    public void setEstimationId(String estimationId) {
        this.estimationId = estimationId;
    }

    public class ApplyValues {

        @SerializedName("applyCommission")
        @Expose
        private Boolean applyCommission;
        @SerializedName("applyPeakCharge")
        @Expose
        private Boolean applyPeakCharge;
        @SerializedName("applyNightCharge")
        @Expose
        private Boolean applyNightCharge;
        @SerializedName("applyWaitingTime")
        @Expose
        private Boolean applyWaitingTime;
        @SerializedName("applyTax")
        @Expose
        private Boolean applyTax;
        @SerializedName("applyPickupCharge")
        @Expose
        private Boolean applyPickupCharge;

        public Boolean getApplyCommission() {
            return applyCommission;
        }

        public void setApplyCommission(Boolean applyCommission) {
            this.applyCommission = applyCommission;
        }

        public Boolean getApplyPeakCharge() {
            return applyPeakCharge;
        }

        public void setApplyPeakCharge(Boolean applyPeakCharge) {
            this.applyPeakCharge = applyPeakCharge;
        }

        public Boolean getApplyNightCharge() {
            return applyNightCharge;
        }

        public void setApplyNightCharge(Boolean applyNightCharge) {
            this.applyNightCharge = applyNightCharge;
        }

        public Boolean getApplyWaitingTime() {
            return applyWaitingTime;
        }

        public void setApplyWaitingTime(Boolean applyWaitingTime) {
            this.applyWaitingTime = applyWaitingTime;
        }

        public Boolean getApplyTax() {
            return applyTax;
        }

        public void setApplyTax(Boolean applyTax) {
            this.applyTax = applyTax;
        }

        public Boolean getApplyPickupCharge() {
            return applyPickupCharge;
        }

        public void setApplyPickupCharge(Boolean applyPickupCharge) {
            this.applyPickupCharge = applyPickupCharge;
        }

    }
    public class DistanceDetails {

        @SerializedName("error")
        @Expose
        private Boolean error;
        @SerializedName("msg")
        @Expose
        private String msg;
        @SerializedName("distanceValue")
        @Expose
        private String distanceValue;
        @SerializedName("distanceLable")
        @Expose
        private String distanceLable;
        @SerializedName("timeValue")
        @Expose
        private String timeValue;
        @SerializedName("timeLable")
        @Expose
        private String timeLable;
        @SerializedName("from")
        @Expose
        private String from;
        @SerializedName("to")
        @Expose
        private String to;
        @SerializedName("startCords")
        @Expose
        private List<String> startCords = null;
        @SerializedName("endcoords")
        @Expose
        private List<String> endcoords = null;

        public Boolean getError() {
            return error;
        }

        public void setError(Boolean error) {
            this.error = error;
        }

        public String getMsg() {
            return msg;
        }

        public void setMsg(String msg) {
            this.msg = msg;
        }

        public String getDistanceValue() {
            return distanceValue;
        }

        public void setDistanceValue(String distanceValue) {
            this.distanceValue = distanceValue;
        }

        public String getDistanceLable() {
            return distanceLable;
        }

        public void setDistanceLable(String distanceLable) {
            this.distanceLable = distanceLable;
        }

        public String getTimeValue() {
            return timeValue;
        }

        public void setTimeValue(String timeValue) {
            this.timeValue = timeValue;
        }

        public String getTimeLable() {
            return timeLable;
        }

        public void setTimeLable(String timeLable) {
            this.timeLable = timeLable;
        }

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

        public List<String> getStartCords() {
            return startCords;
        }

        public void setStartCords(List<String> startCords) {
            this.startCords = startCords;
        }

        public List<String> getEndcoords() {
            return endcoords;
        }

        public void setEndcoords(List<String> endcoords) {
            this.endcoords = endcoords;
        }

    }

    public class FareDetails {

        @SerializedName("perKMRate")
        @Expose
        private String perKMRate;
        @SerializedName("fareType")
        @Expose
        private String fareType;
        @SerializedName("distance")
        @Expose
        private String distance;
        @SerializedName("KMFare")
        @Expose
        private String kMFare;
        @SerializedName("timeRate")
        @Expose
        private String timeRate;
        @SerializedName("waitingCharge")
        @Expose
        private String waitingCharge;
        @SerializedName("waitingTime")
        @Expose
        private String waitingTime;
        @SerializedName("waitingFare")
        @Expose
        private String waitingFare;
        @SerializedName("cancelationFeesRider")
        @Expose
        private String cancelationFeesRider;
        @SerializedName("cancelationFeesDriver")
        @Expose
        private String cancelationFeesDriver;
        @SerializedName("pickupCharge")
        @Expose
        private String pickupCharge;
        @SerializedName("comison")
        @Expose
        private String comison;
        @SerializedName("comisonAmt")
        @Expose
        private String comisonAmt;
        @SerializedName("isTax")
        @Expose
        private Boolean isTax;
        @SerializedName("taxPercentage")
        @Expose
        private String taxPercentage;
        @SerializedName("tax")
        @Expose
        private String tax;
        @SerializedName("minFare")
        @Expose
        private String minFare;
        @SerializedName("flatFare")
        @Expose
        private String flatFare;
        @SerializedName("oldCancellationAmt")
        @Expose
        private String oldCancellationAmt;
        @SerializedName("fareAmtBeforeSurge")
        @Expose
        private String fareAmtBeforeSurge;
        @SerializedName("totalFareWithOutOldBal")
        @Expose
        private String totalFareWithOutOldBal;
        @SerializedName("totalFare")
        @Expose
        private String totalFare;
        @SerializedName("nightObj")
        @Expose
        private NightObj nightObj;
        @SerializedName("peakObj")
        @Expose
        private PeakObj peakObj;
        @SerializedName("distanceObj")
        @Expose
        private Object distanceObj;
        @SerializedName("fareAmt")
        @Expose
        private String fareAmt;

        @SerializedName("paymentMode")
        @Expose
        private String paymentMode;
        public String getBaseFare() {
            return BaseFare;
        }

        public void setBaseFare(String baseFare) {
            BaseFare = baseFare;
        }

        @SerializedName("BaseFare")
        @Expose
        private String BaseFare;

        @SerializedName("travelFare")
        @Expose
        private String travelFare;

        public String getPerKMRate() {
            return perKMRate;
        }

        public void setPerKMRate(String perKMRate) {
            this.perKMRate = perKMRate;
        }

        public String getFareType() {
            return fareType;
        }

        public void setFareType(String fareType) {
            this.fareType = fareType;
        }

        public String getDistance() {
            return distance;
        }

        public void setDistance(String distance) {
            this.distance = distance;
        }

        public String getKMFare() {
            return kMFare;
        }

        public void setKMFare(String kMFare) {
            this.kMFare = kMFare;
        }

        public String getTimeRate() {
            return timeRate;
        }

        public void setTimeRate(String timeRate) {
            this.timeRate = timeRate;
        }

        public String getWaitingCharge() {
            return waitingCharge;
        }

        public void setWaitingCharge(String waitingCharge) {
            this.waitingCharge = waitingCharge;
        }

        public String getWaitingTime() {
            return waitingTime;
        }

        public void setWaitingTime(String waitingTime) {
            this.waitingTime = waitingTime;
        }

        public String getWaitingFare() {
            return waitingFare;
        }

        public void setWaitingFare(String waitingFare) {
            this.waitingFare = waitingFare;
        }

        public String getCancelationFeesRider() {
            return cancelationFeesRider;
        }

        public void setCancelationFeesRider(String cancelationFeesRider) {
            this.cancelationFeesRider = cancelationFeesRider;
        }

        public String getCancelationFeesDriver() {
            return cancelationFeesDriver;
        }

        public void setCancelationFeesDriver(String cancelationFeesDriver) {
            this.cancelationFeesDriver = cancelationFeesDriver;
        }

        public String getPickupCharge() {
            return pickupCharge;
        }

        public void setTravelFare(String travelFare) {
            this.travelFare = travelFare;
        }
        public String getTravelFare() {
            return travelFare;
        }

        public void setPickupCharge(String pickupCharge) {
            this.pickupCharge = pickupCharge;
        }

        public String getComison() {
            return comison;
        }

        public void setComison(String comison) {
            this.comison = comison;
        }

        public String getComisonAmt() {
            return comisonAmt;
        }

        public void setComisonAmt(String comisonAmt) {
            this.comisonAmt = comisonAmt;
        }

        public Boolean getIsTax() {
            return isTax;
        }

        public void setIsTax(Boolean isTax) {
            this.isTax = isTax;
        }

        public String getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(String taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public String getTax() {
            return tax;
        }

        public void setTax(String tax) {
            this.tax = tax;
        }

        public String getMinFare() {
            return minFare;
        }

        public void setMinFare(String minFare) {
            this.minFare = minFare;
        }

        public String getFlatFare() {
            return flatFare;
        }

        public void setFlatFare(String flatFare) {
            this.flatFare = flatFare;
        }

        public String getOldCancellationAmt() {
            return oldCancellationAmt;
        }

        public void setOldCancellationAmt(String oldCancellationAmt) {
            this.oldCancellationAmt = oldCancellationAmt;
        }

        public String getFareAmtBeforeSurge() {
            return fareAmtBeforeSurge;
        }

        public void setFareAmtBeforeSurge(String fareAmtBeforeSurge) {
            this.fareAmtBeforeSurge = fareAmtBeforeSurge;
        }

        public String getTotalFareWithOutOldBal() {
            return totalFareWithOutOldBal;
        }

        public void setTotalFareWithOutOldBal(String totalFareWithOutOldBal) {
            this.totalFareWithOutOldBal = totalFareWithOutOldBal;
        }

        public String getTotalFare() {
            return totalFare;
        }

        public void setTotalFare(String totalFare) {
            this.totalFare = totalFare;
        }

        public NightObj getNightObj() {
            return nightObj;
        }

        public void setNightObj(NightObj nightObj) {
            this.nightObj = nightObj;
        }

        public PeakObj getPeakObj() {
            return peakObj;
        }

        public void setPeakObj(PeakObj peakObj) {
            this.peakObj = peakObj;
        }

        public Object getDistanceObj() {
            return distanceObj;
        }

        public void setDistanceObj(Object distanceObj) {
            this.distanceObj = distanceObj;
        }

        public String getFareAmt() {
            return fareAmt;
        }

        public void setFareAmt(String fareAmt) {
            this.fareAmt = fareAmt;
        }

        public String getkMFare() {
            return kMFare;
        }

        public void setkMFare(String kMFare) {
            this.kMFare = kMFare;
        }

        public void setTax(Boolean tax) {
            isTax = tax;
        }

        public String getPaymentMode() {
            return paymentMode;
        }

        public void setPaymentMode(String paymentMode) {
            this.paymentMode = paymentMode;
        }
    }

    public class NightObj {

        @SerializedName("isApply")
        @Expose
        private Boolean isApply;
        @SerializedName("percentageIncrease")
        @Expose
        private String percentageIncrease;
        @SerializedName("alertLable")
        @Expose
        private String alertLable;

        public Boolean getIsApply() {
            return isApply;
        }

        public void setIsApply(Boolean isApply) {
            this.isApply = isApply;
        }

        public String getPercentageIncrease() {
            return percentageIncrease;
        }

        public void setPercentageIncrease(String percentageIncrease) {
            this.percentageIncrease = percentageIncrease;
        }

        public String getAlertLable() {
            return alertLable;
        }

        public void setAlertLable(String alertLable) {
            this.alertLable = alertLable;
        }

    }

    public class Offers {

        @SerializedName("offerPerUser")
        @Expose
        private String offerPerUser;
        @SerializedName("offerPerDay")
        @Expose
        private String offerPerDay;
        @SerializedName("discount")
        @Expose
        private String discount;
        @SerializedName("cmpyAllowance")
        @Expose
        private Boolean cmpyAllowance;

        public String getOfferPerUser() {
            return offerPerUser;
        }

        public void setOfferPerUser(String offerPerUser) {
            this.offerPerUser = offerPerUser;
        }

        public String getOfferPerDay() {
            return offerPerDay;
        }

        public void setOfferPerDay(String offerPerDay) {
            this.offerPerDay = offerPerDay;
        }

        public String getDiscount() {
            return discount;
        }

        public void setDiscount(String discount) {
            this.discount = discount;
        }

        public Boolean getCmpyAllowance() {
            return cmpyAllowance;
        }

        public void setCmpyAllowance(Boolean cmpyAllowance) {
            this.cmpyAllowance = cmpyAllowance;
        }

    }
    public class PeakObj {

        @SerializedName("isApply")
        @Expose
        private Boolean isApply;
        @SerializedName("percentageIncrease")
        @Expose
        private String percentageIncrease;
        @SerializedName("alertLable")
        @Expose
        private String alertLable;

        public Boolean getIsApply() {
            return isApply;
        }

        public void setIsApply(Boolean isApply) {
            this.isApply = isApply;
        }

        public String getPercentageIncrease() {
            return percentageIncrease;
        }

        public void setPercentageIncrease(String percentageIncrease) {
            this.percentageIncrease = percentageIncrease;
        }

        public String getAlertLable() {
            return alertLable;
        }

        public void setAlertLable(String alertLable) {
            this.alertLable = alertLable;
        }

    }
    public class VehicleDetails {

        @SerializedName("type")
        @Expose
        private String type;
        @SerializedName("seats")
        @Expose
        private String seats;
        @SerializedName("image")
        @Expose
        private String image;
        @SerializedName("available")
        @Expose
        private Boolean available;
        @SerializedName("description")
        @Expose
        private String description;
        @SerializedName("features")
        @Expose
        private List<String> features = null;
        @SerializedName("serviceId")
        @Expose
        private String serviceId;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getSeats() {
            return seats;
        }

        public void setSeats(String seats) {
            this.seats = seats;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public Boolean getAvailable() {
            return available;
        }

        public void setAvailable(Boolean available) {
            this.available = available;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<String> getFeatures() {
            return features;
        }

        public void setFeatures(List<String> features) {
            this.features = features;
        }

        public String getServiceId() {
            return serviceId;
        }

        public void setServiceId(String serviceId) {
            this.serviceId = serviceId;
        }

    }

    public class VehicleDetailsAndFare {

        @SerializedName("vehicleDetails")
        @Expose
        private VehicleDetails vehicleDetails;
        @SerializedName("fareDetails")
        @Expose
        private FareDetails fareDetails;
        @SerializedName("offers")
        @Expose
        private Offers offers;
        @SerializedName("applyValues")
        @Expose
        private ApplyValues applyValues;

        public VehicleDetails getVehicleDetails() {
            return vehicleDetails;
        }

        public void setVehicleDetails(VehicleDetails vehicleDetails) {
            this.vehicleDetails = vehicleDetails;
        }

        public FareDetails getFareDetails() {
            return fareDetails;
        }

        public void setFareDetails(FareDetails fareDetails) {
            this.fareDetails = fareDetails;
        }

        public Offers getOffers() {
            return offers;
        }

        public void setOffers(Offers offers) {
            this.offers = offers;
        }

        public ApplyValues getApplyValues() {
            return applyValues;
        }

        public void setApplyValues(ApplyValues applyValues) {
            this.applyValues = applyValues;
        }

    }
}