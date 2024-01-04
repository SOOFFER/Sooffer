package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class TripFlowModel implements Serializable {
    public class Fare {

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
        @SerializedName("toll_fare")
        @Expose
        private String toll_fare;
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
        @SerializedName("BalanceFare")
        @Expose
        private String balanceFare;
        @SerializedName("DetuctedFare")
        @Expose
        private String detuctedFare;
        @SerializedName("paymentMode")
        @Expose
        private String paymentMode;
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
        @SerializedName("applyValues")
        @Expose
        private ApplyValues applyValues;
        @SerializedName("duration")
        @Expose
        private String duration;
        @SerializedName("discountAmt")
        @Expose
        private String discountAmt;

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

        public String getToll_fare() {
            return toll_fare;
        }

        public void setToll_fare(String toll_fare) {
            this.toll_fare = toll_fare;
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

        public String getBalanceFare() {
            return balanceFare;
        }

        public void setBalanceFare(String balanceFare) {
            this.balanceFare = balanceFare;
        }

        public String getDetuctedFare() {
            return detuctedFare;
        }

        public void setDetuctedFare(String detuctedFare) {
            this.detuctedFare = detuctedFare;
        }

        public String getPaymentMode() {
            return paymentMode;
        }

        public void setPaymentMode(String paymentMode) {
            this.paymentMode = paymentMode;
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

        public ApplyValues getApplyValues() {
            return applyValues;
        }

        public void setApplyValues(ApplyValues applyValues) {
            this.applyValues = applyValues;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getDiscountAmt() {
            return discountAmt;
        }

        public void setDiscountAmt(String discountAmt) {
            this.discountAmt = discountAmt;
        }

    }


    public class ApplyValues {

        @SerializedName("applyNightCharge")
        @Expose
        private Boolean applyNightCharge;
        @SerializedName("applyPeakCharge")
        @Expose
        private Boolean applyPeakCharge;
        @SerializedName("applyWaitingTime")
        @Expose
        private Boolean applyWaitingTime;
        @SerializedName("applyTax")
        @Expose
        private Boolean applyTax;
        @SerializedName("applyCommission")
        @Expose
        private Boolean applyCommission;
        @SerializedName("applyPickupCharge")
        @Expose
        private Boolean applyPickupCharge;

        public Boolean getApplyNightCharge() {
            return applyNightCharge;
        }

        public void setApplyNightCharge(Boolean applyNightCharge) {
            this.applyNightCharge = applyNightCharge;
        }

        public Boolean getApplyPeakCharge() {
            return applyPeakCharge;
        }

        public void setApplyPeakCharge(Boolean applyPeakCharge) {
            this.applyPeakCharge = applyPeakCharge;
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

        public Boolean getApplyCommission() {
            return applyCommission;
        }

        public void setApplyCommission(Boolean applyCommission) {
            this.applyCommission = applyCommission;
        }

        public Boolean getApplyPickupCharge() {
            return applyPickupCharge;
        }

        public void setApplyPickupCharge(Boolean applyPickupCharge) {
            this.applyPickupCharge = applyPickupCharge;
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

    public class Pickupdetails {

        @SerializedName("startcoords")
        @Expose
        private List<String> startcoords = null;
        @SerializedName("endcoords")
        @Expose
        private List<String> endcoords = null;
        @SerializedName("waypoint_one")
        @Expose
        private List<String> waypoint_one = null;
        @SerializedName("waypoint_two")
        @Expose
        private List<String> waypoint_two = null;

        public List<String> getWaypoint_one() {
            return waypoint_one;
        }

        public void setWaypoint_one(List<String> waypoint_one) {
            this.waypoint_one = waypoint_one;
        }

        public List<String> getWaypoint_two() {
            return waypoint_two;
        }

        public void setWaypoint_two(List<String> waypoint_two) {
            this.waypoint_two = waypoint_two;
        }

        @SerializedName("end")
        @Expose
        private String end;
        @SerializedName("start")
        @Expose
        private String start;
        @SerializedName("distanceKM")
        @Expose
        private String distanceKM;

        public List<String> getStartcoords() {
            return startcoords;
        }

        public void setStartcoords(List<String> startcoords) {
            this.startcoords = startcoords;
        }

        public List<String> getEndcoords() {
            return endcoords;
        }

        public void setEndcoords(List<String> endcoords) {
            this.endcoords = endcoords;
        }

        public String getEnd() {
            return end;
        }

        public void setEnd(String end) {
            this.end = end;
        }

        public String getStart() {
            return start;
        }

        public void setStart(String start) {
            this.start = start;
        }

        public String getDistanceKM() {
            return distanceKM;
        }

        public void setDistanceKM(String distanceKM) {
            this.distanceKM = distanceKM;
        }

    }

    public class Rider {

        @SerializedName("cur")
        @Expose
        private String cur;
        @SerializedName("cntyname")
        @Expose
        private String cntyname;
        @SerializedName("phone")
        @Expose
        private String phone;
        @SerializedName("phcode")
        @Expose
        private String phcode;
        @SerializedName("email")
        @Expose
        private String email;
        @SerializedName("lname")
        @Expose
        private String lname;
        @SerializedName("fname")
        @Expose
        private String fname;
        @SerializedName("profileurl")
        @Expose
        private String profileurl;
        @SerializedName("points")
        @Expose
        private String points;
        @SerializedName("fcmId")
        @Expose
        private String fcmId;
        @SerializedName("balance")
        @Expose
        private String balance;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        @SerializedName("id")
        @Expose
        private String id;

        public String getCur() {
            return cur;
        }

        public void setCur(String cur) {
            this.cur = cur;
        }

        public String getCntyname() {
            return cntyname;
        }

        public void setCntyname(String cntyname) {
            this.cntyname = cntyname;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getPhcode() {
            return phcode;
        }

        public void setPhcode(String phcode) {
            this.phcode = phcode;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getLname() {
            return lname;
        }

        public void setLname(String lname) {
            this.lname = lname;
        }

        public String getFname() {
            return fname;
        }

        public void setFname(String fname) {
            this.fname = fname;
        }

        public String getProfileurl() {
            return profileurl;
        }

        public void setProfileurl(String profileurl) {
            this.profileurl = profileurl;
        }

        public String getPoints() {
            return points;
        }

        public void setPoints(String points) {
            this.points = points;
        }

        public String getFcmId() {
            return fcmId;
        }

        public void setFcmId(String fcmId) {
            this.fcmId = fcmId;
        }

        public String getBalance() {
            return balance;
        }

        public void setBalance(String balance) {
            this.balance = balance;
        }

    }


    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("rider")
    @Expose
    private Rider rider;
    @SerializedName("pickupdetails")
    @Expose
    private Pickupdetails pickupdetails;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("fare")
    @Expose
    private Fare fare;
    @SerializedName("taxitype")
    @Expose
    private String taxitype;
    @SerializedName("startOTP")
    @Expose
    private String startOTP;
    @SerializedName("endOTP")
    @Expose
    private String endOTP;

    @SerializedName("isDriver")
    @Expose
    private Boolean isDriver;
    @SerializedName("isFirstDriver")
    @Expose
    private Boolean isFirstDriver;

    public List<MultiLocation> getMultiLocation() {
        return multiLocation;
    }

    public void setMultiLocation(List<MultiLocation> multiLocation) {
        this.multiLocation = multiLocation;
    }

    @SerializedName("multiLocation")
    @Expose
    private List<MultiLocation> multiLocation = new ArrayList<>();


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

    public Rider getRider() {
        return rider;
    }

    public void setRider(Rider rider) {
        this.rider = rider;
    }

    public Pickupdetails getPickupdetails() {
        return pickupdetails;
    }

    public void setPickupdetails(Pickupdetails pickupdetails) {
        this.pickupdetails = pickupdetails;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Fare getFare() {
        return fare;
    }

    public void setFare(Fare fare) {
        this.fare = fare;
    }

    public String getTaxitype() {
        return taxitype;
    }

    public void setTaxitype(String taxitype) {
        this.taxitype = taxitype;
    }

    public String getStartOTP() {
        return startOTP;
    }

    public void setStartOTP(String startOTP) {
        this.startOTP = startOTP;
    }

    public String getEndOTP() {
        return endOTP;
    }

    public void setEndOTP(String endOTP) {
        this.endOTP = endOTP;
    }

    public Boolean getIsDriver() {
        return isDriver;
    }

    public void setIsDriver(Boolean isDriver) {
        this.isDriver = isDriver;
    }

    public Boolean getIsFirstDriver() {
        return isFirstDriver;
    }

    public void setIsFirstDriver(Boolean isFirstDriver) {
        this.isFirstDriver = isFirstDriver;
    }

    public class MultiLocation {

        @SerializedName("updatePosition")
        @Expose
        private Boolean updatePosition;
        @SerializedName("strAddress")
        @Expose
        private String strAddress;
        @SerializedName("doubleLng")
        @Expose
        private String doubleLng;
        @SerializedName("doubleLat")
        @Expose
        private String doubleLat;

        public Boolean getUpdatePosition() {
            return updatePosition;
        }

        public void setUpdatePosition(Boolean updatePosition) {
            this.updatePosition = updatePosition;
        }

        public String getStrAddress() {
            return strAddress;
        }

        public void setStrAddress(String strAddress) {
            this.strAddress = strAddress;
        }

        public String getDoubleLng() {
            return doubleLng;
        }

        public void setDoubleLng(String doubleLng) {
            this.doubleLng = doubleLng;
        }

        public String getDoubleLat() {
            return doubleLat;
        }

        public void setDoubleLat(String doubleLat) {
            this.doubleLat = doubleLat;
        }

    }
}
