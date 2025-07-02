package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class TripDetailsModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("TripDetail")
    @Expose
    private TripDetail tripDetail;
    @SerializedName("ProfileDetail")
    @Expose
    private ProfileDetail profileDetail;
    @SerializedName("Mapurl")
    @Expose
    private String mapurl;

    @SerializedName("DriverTip")
    @Expose
    private String DriverTip;
    public String getDriverTip() {
        return DriverTip;
    }

    public void setDriverTip(String DriverTip) {
        this.DriverTip = DriverTip;
    }
    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public TripDetail getTripDetail() {
        return tripDetail;
    }

    public void setTripDetail(TripDetail tripDetail) {
        this.tripDetail = tripDetail;
    }

    public ProfileDetail getProfileDetail() {
        return profileDetail;
    }

    public void setProfileDetail(ProfileDetail profileDetail) {
        this.profileDetail = profileDetail;
    }

    public String getMapurl() {
        return mapurl;
    }

    public void setMapurl(String mapurl) {
        this.mapurl = mapurl;
    }


    public class Acsp {
        public String getGatewayCharge() {
            return gatewayCharge;
        }

        public void setGatewayCharge(String gatewayCharge) {
            this.gatewayCharge = gatewayCharge;
        }

        @SerializedName("gatewayCharge")
        @Expose
        private String gatewayCharge;
        @SerializedName("via")
        @Expose
        private String via;
        @SerializedName("surgeAmt")
        @Expose
        private String surgeamt;
        @SerializedName("startTime")
        @Expose
        private String startTime;
        @SerializedName("startMeter")
        @Expose
        private String startMeter;
        @SerializedName("cost")
        @Expose
        private String cost;
        @SerializedName("comison")
        @Expose
        private String comison;
        @SerializedName("timefare")
        @Expose
        private String timefare;
        @SerializedName("time")
        @Expose
        private String time;
        @SerializedName("distfare")
        @Expose
        private String distfare;
        @SerializedName("dist")
        @Expose
        private String dist;
        @SerializedName("base")
        @Expose
        private String base;
        @SerializedName("actualcost")
        @Expose
        private String actualcost;
        @SerializedName("bal")
        @Expose
        private String bal;
        @SerializedName("baseKM")
        @Expose
        private String baseKM;
        @SerializedName("baseTime")
        @Expose
        private String baseTime;
        @SerializedName("carddebt")
        @Expose
        private String carddebt;
        @SerializedName("chId")
        @Expose
        private String chId;
        @SerializedName("conveyance")
        @Expose
        private String conveyance;
        @SerializedName("costBeforeDiscount")
        @Expose
        private String costBeforeDiscount;
        @SerializedName("detect")
        @Expose
        private String detect;
        @SerializedName("discountName")
        @Expose
        private String discountName;
        @SerializedName("discountPercentage")
        @Expose
        private String discountPercentage;
        @SerializedName("endMeter")
        @Expose
        private String endMeter;
        @SerializedName("endTime")
        @Expose
        private String endTime;
        @SerializedName("extraKM")
        @Expose
        private String extraKM;
        @SerializedName("extraTime")
        @Expose
        private String extraTime;
        @SerializedName("fareAmtBeforeSurge")
        @Expose
        private String fareAmtBeforeSurge;
        @SerializedName("fareForExtraKM")
        @Expose
        private String fareForExtraKM;

        public String getNoOfNights() {
            return noOfNights;
        }

        public void setNoOfNights(String noOfNights) {
            this.noOfNights = noOfNights;
        }

        public String getNoOfDays() {
            return noOfDays;
        }

        public void setNoOfDays(String noOfDays) {
            this.noOfDays = noOfDays;
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

        public String getGoogleCharge() {
            return googleCharge;
        }

        public void setGoogleCharge(String googleCharge) {
            this.googleCharge = googleCharge;
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

        public Boolean getNight() {
            return isNight;
        }

        public void setNight(Boolean night) {
            isNight = night;
        }

        public Boolean getPeak() {
            return isPeak;
        }

        public void setPeak(Boolean peak) {
            isPeak = peak;
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

        @SerializedName("googleCharge")
        @Expose
        private String googleCharge;

        @SerializedName("nightRate")
        @Expose
        private String nightRate;

        @SerializedName("dayRate")
        @Expose
        private String dayRate;

        public String getTollFee() {
            return tollFee;
        }

        public void setTollFee(String tollFee) {
            this.tollFee = tollFee;
        }

        @SerializedName("tollFee")
        @Expose
        private String tollFee;

        @SerializedName("fareForExtraTime")
        @Expose
        private String fareForExtraTime;
        @SerializedName("fareType")
        @Expose
        private Object fareType;
        @SerializedName("hotelcommision")
        @Expose
        private String hotelcommision;
        @SerializedName("isNight")
        @Expose
        private Boolean isNight;
        @SerializedName("isPeak")
        @Expose
        private Boolean isPeak;
        @SerializedName("minFare")
        @Expose
        private String minFare;
        @SerializedName("nightPer")
        @Expose
        private String nightPer;
        @SerializedName("oldBalance")
        @Expose
        private String oldBalance;
        @SerializedName("outstanding")
        @Expose
        private String outstanding;
        @SerializedName("packageId")
        @Expose
        private String packageId;
        @SerializedName("packageName")
        @Expose
        private String packageName;
        @SerializedName("peakPer")
        @Expose
        private String peakPer;
        @SerializedName("perKmRate")
        @Expose
        private String perKmRate;
        @SerializedName("promoamt")
        @Expose
        private String promoamt;
        @SerializedName("returnKM")
        @Expose
        private String returnKM;
        @SerializedName("returnTime")
        @Expose
        private String returnTime;
        @SerializedName("surgeReason")
        @Expose
        private String surgeReason;
        @SerializedName("tax")
        @Expose
        private String tax;


        public String getBooking() {
            return booking;
        }

        public void setBooking(String booking) {
            this.booking = booking;
        }

        @SerializedName("booking")
        @Expose
        private String booking;
        @SerializedName("taxPercentage")
        @Expose
        private String taxPercentage;
        @SerializedName("totalFareWithOutOldBal")
        @Expose
        private String totalFareWithOutOldBal;
        @SerializedName("waitingCharge")
        @Expose
        private String waitingCharge;
        @SerializedName("waitingRate")
        @Expose
        private String waitingRate;
        @SerializedName("waitingTime")
        @Expose
        private String waitingTime;
        @SerializedName("walletdebt")
        @Expose
        private String walletdebt;
        public String getSurgeamt() {
            return surgeamt;
        }

        public void setSurgeamt(String surgeamt) {
            this.surgeamt = surgeamt;
        }
        public String getVia() {
            return via;
        }

        public void setVia(String via) {
            this.via = via;
        }

        public String getStartTime() {
            return startTime;
        }

        public void setStartTime(String startTime) {
            this.startTime = startTime;
        }

        public String getStartMeter() {
            return startMeter;
        }

        public void setStartMeter(String startMeter) {
            this.startMeter = startMeter;
        }

        public String getCost() {
            return cost;
        }

        public void setCost(String cost) {
            this.cost = cost;
        }

        public String getComison() {
            return comison;
        }

        public void setComison(String comison) {
            this.comison = comison;
        }

        public String getTimefare() {
            return timefare;
        }

        public void setTimefare(String timefare) {
            this.timefare = timefare;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getDistfare() {
            return distfare;
        }

        public void setDistfare(String distfare) {
            this.distfare = distfare;
        }

        public String getDist() {
            return dist;
        }

        public void setDist(String dist) {
            this.dist = dist;
        }

        public String getBase() {
            return base;
        }

        public void setBase(String base) {
            this.base = base;
        }

        public String getActualcost() {
            return actualcost;
        }

        public void setActualcost(String actualcost) {
            this.actualcost = actualcost;
        }

        public String getBal() {
            return bal;
        }

        public void setBal(String bal) {
            this.bal = bal;
        }

        public String getBaseKM() {
            return baseKM;
        }

        public void setBaseKM(String baseKM) {
            this.baseKM = baseKM;
        }

        public String getBaseTime() {
            return baseTime;
        }

        public void setBaseTime(String baseTime) {
            this.baseTime = baseTime;
        }

        public String getCarddebt() {
            return carddebt;
        }

        public void setCarddebt(String carddebt) {
            this.carddebt = carddebt;
        }

        public String getChId() {
            return chId;
        }

        public void setChId(String chId) {
            this.chId = chId;
        }

        public String getConveyance() {
            return conveyance;
        }

        public void setConveyance(String conveyance) {
            this.conveyance = conveyance;
        }

        public String getCostBeforeDiscount() {
            return costBeforeDiscount;
        }

        public void setCostBeforeDiscount(String costBeforeDiscount) {
            this.costBeforeDiscount = costBeforeDiscount;
        }

        public String getDetect() {
            return detect;
        }

        public void setDetect(String detect) {
            this.detect = detect;
        }

        public String getDiscountName() {
            return discountName;
        }

        public void setDiscountName(String discountName) {
            this.discountName = discountName;
        }

        public String getDiscountPercentage() {
            return discountPercentage;
        }

        public void setDiscountPercentage(String discountPercentage) {
            this.discountPercentage = discountPercentage;
        }

        public String getEndMeter() {
            return endMeter;
        }

        public void setEndMeter(String endMeter) {
            this.endMeter = endMeter;
        }

        public String getEndTime() {
            return endTime;
        }

        public void setEndTime(String endTime) {
            this.endTime = endTime;
        }

        public String getExtraKM() {
            return extraKM;
        }

        public void setExtraKM(String extraKM) {
            this.extraKM = extraKM;
        }

        public String getExtraTime() {
            return extraTime;
        }

        public void setExtraTime(String extraTime) {
            this.extraTime = extraTime;
        }

        public String getFareAmtBeforeSurge() {
            return fareAmtBeforeSurge;
        }

        public void setFareAmtBeforeSurge(String fareAmtBeforeSurge) {
            this.fareAmtBeforeSurge = fareAmtBeforeSurge;
        }

        public String getFareForExtraKM() {
            return fareForExtraKM;
        }

        public void setFareForExtraKM(String fareForExtraKM) {
            this.fareForExtraKM = fareForExtraKM;
        }

        public String getFareForExtraTime() {
            return fareForExtraTime;
        }

        public void setFareForExtraTime(String fareForExtraTime) {
            this.fareForExtraTime = fareForExtraTime;
        }

        public Object getFareType() {
            return fareType;
        }

        public void setFareType(Object fareType) {
            this.fareType = fareType;
        }

        public String getHotelcommision() {
            return hotelcommision;
        }

        public void setHotelcommision(String hotelcommision) {
            this.hotelcommision = hotelcommision;
        }

        public Boolean getIsNight() {
            return isNight;
        }

        public void setIsNight(Boolean isNight) {
            this.isNight = isNight;
        }

        public Boolean getIsPeak() {
            return isPeak;
        }

        public void setIsPeak(Boolean isPeak) {
            this.isPeak = isPeak;
        }

        public String getMinFare() {
            return minFare;
        }

        public void setMinFare(String minFare) {
            this.minFare = minFare;
        }

        public String getNightPer() {
            return nightPer;
        }

        public void setNightPer(String nightPer) {
            this.nightPer = nightPer;
        }

        public String getOldBalance() {
            return oldBalance;
        }

        public void setOldBalance(String oldBalance) {
            this.oldBalance = oldBalance;
        }

        public String getOutstanding() {
            return outstanding;
        }

        public void setOutstanding(String outstanding) {
            this.outstanding = outstanding;
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

        public String getPeakPer() {
            return peakPer;
        }

        public void setPeakPer(String peakPer) {
            this.peakPer = peakPer;
        }

        public String getPerKmRate() {
            return perKmRate;
        }

        public void setPerKmRate(String perKmRate) {
            this.perKmRate = perKmRate;
        }

        public String getPromoamt() {
            return promoamt;
        }

        public void setPromoamt(String promoamt) {
            this.promoamt = promoamt;
        }

        public String getReturnKM() {
            return returnKM;
        }

        public void setReturnKM(String returnKM) {
            this.returnKM = returnKM;
        }

        public String getReturnTime() {
            return returnTime;
        }

        public void setReturnTime(String returnTime) {
            this.returnTime = returnTime;
        }

        public String getSurgeReason() {
            return surgeReason;
        }

        public void setSurgeReason(String surgeReason) {
            this.surgeReason = surgeReason;
        }

        public String getTax() {
            return tax;
        }

        public void setTax(String tax) {
            this.tax = tax;
        }

        public String getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(String taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public String getTotalFareWithOutOldBal() {
            return totalFareWithOutOldBal;
        }

        public void setTotalFareWithOutOldBal(String totalFareWithOutOldBal) {
            this.totalFareWithOutOldBal = totalFareWithOutOldBal;
        }

        public String getWaitingCharge() {
            return waitingCharge;
        }

        public void setWaitingCharge(String waitingCharge) {
            this.waitingCharge = waitingCharge;
        }

        public String getWaitingRate() {
            return waitingRate;
        }

        public void setWaitingRate(String waitingRate) {
            this.waitingRate = waitingRate;
        }

        public String getWaitingTime() {
            return waitingTime;
        }

        public void setWaitingTime(String waitingTime) {
            this.waitingTime = waitingTime;
        }

        public String getWalletdebt() {
            return walletdebt;
        }

        public void setWalletdebt(String walletdebt) {
            this.walletdebt = walletdebt;
        }

    }
    public class Adsp {

        @SerializedName("dLng")
        @Expose
        private String dLng;
        @SerializedName("dLat")
        @Expose
        private String dLat;
        @SerializedName("pLng")
        @Expose
        private String pLng;
        @SerializedName("pLat")
        @Expose
        private String pLat;
        @SerializedName("to")
        @Expose
        private String to;
        @SerializedName("from")
        @Expose
        private String from;
        @SerializedName("end")
        @Expose
        private String end;
        @SerializedName("start")
        @Expose
        private String start;
        @SerializedName("distanceKM")
        @Expose
        private String distanceKM;
        @SerializedName("estTime")
        @Expose
        private String estTime;
        @SerializedName("map")
        @Expose
        private String map;

        public String getDLng() {
            return dLng;
        }

        public void setDLng(String dLng) {
            this.dLng = dLng;
        }

        public String getDLat() {
            return dLat;
        }

        public void setDLat(String dLat) {
            this.dLat = dLat;
        }

        public String getPLng() {
            return pLng;
        }

        public void setPLng(String pLng) {
            this.pLng = pLng;
        }

        public String getPLat() {
            return pLat;
        }

        public void setPLat(String pLat) {
            this.pLat = pLat;
        }

        public String getTo() {
            return to;
        }

        public void setTo(String to) {
            this.to = to;
        }

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
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

        public String getEstTime() {
            return estTime;
        }

        public void setEstTime(String estTime) {
            this.estTime = estTime;
        }

        public String getMap() {
            return map;
        }

        public void setMap(String map) {
            this.map = map;
        }

    }
    public class Csp {

        @SerializedName("dist")
        @Expose
        private String dist;
        @SerializedName("distfare")
        @Expose
        private String distfare;
        @SerializedName("perKmRate")
        @Expose
        private String perKmRate;
        @SerializedName("time")
        @Expose
        private String time;
        @SerializedName("promo")
        @Expose
        private String promo;
        @SerializedName("via")
        @Expose
        private String via;
        @SerializedName("fareForExtraTime")
        @Expose
        private String fareForExtraTime;
        @SerializedName("extraTime")
        @Expose
        private String extraTime;
        @SerializedName("baseTime")
        @Expose
        private String baseTime;
        @SerializedName("fareForExtraKM")
        @Expose
        private String fareForExtraKM;
        @SerializedName("extraKM")
        @Expose
        private String extraKM;
        @SerializedName("baseKM")
        @Expose
        private String baseKM;
        @SerializedName("packageName")
        @Expose
        private String packageName;
        @SerializedName("packageId")
        @Expose
        private String packageId;
        @SerializedName("surgeReason")
        @Expose
        private String surgeReason;
        @SerializedName("peakPer")
        @Expose
        private String peakPer;
        @SerializedName("nightPer")
        @Expose
        private String nightPer;
        @SerializedName("isPeak")
        @Expose
        private Boolean isPeak;
        @SerializedName("isNight")
        @Expose
        private Boolean isNight;
        @SerializedName("companyAllowance")
        @Expose
        private String companyAllowance;
        @SerializedName("tax")
        @Expose
        private String tax;
        @SerializedName("cost")
        @Expose
        private String cost;
        @SerializedName("promoamt")
        @Expose
        private String promoamt;
        @SerializedName("hotelcommision")
        @Expose
        private String hotelcommision;
        @SerializedName("comison")
        @Expose
        private String comison;
        @SerializedName("timefare")
        @Expose
        private String timefare;
        @SerializedName("base")
        @Expose
        private String base;

        public String getDist() {
            return dist;
        }

        public void setDist(String dist) {
            this.dist = dist;
        }

        public String getDistfare() {
            return distfare;
        }

        public void setDistfare(String distfare) {
            this.distfare = distfare;
        }

        public String getPerKmRate() {
            return perKmRate;
        }

        public void setPerKmRate(String perKmRate) {
            this.perKmRate = perKmRate;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getPromo() {
            return promo;
        }

        public void setPromo(String promo) {
            this.promo = promo;
        }

        public String getVia() {
            return via;
        }

        public void setVia(String via) {
            this.via = via;
        }

        public String getFareForExtraTime() {
            return fareForExtraTime;
        }

        public void setFareForExtraTime(String fareForExtraTime) {
            this.fareForExtraTime = fareForExtraTime;
        }

        public String getExtraTime() {
            return extraTime;
        }

        public void setExtraTime(String extraTime) {
            this.extraTime = extraTime;
        }

        public String getBaseTime() {
            return baseTime;
        }

        public void setBaseTime(String baseTime) {
            this.baseTime = baseTime;
        }

        public String getFareForExtraKM() {
            return fareForExtraKM;
        }

        public void setFareForExtraKM(String fareForExtraKM) {
            this.fareForExtraKM = fareForExtraKM;
        }

        public String getExtraKM() {
            return extraKM;
        }

        public void setExtraKM(String extraKM) {
            this.extraKM = extraKM;
        }

        public String getBaseKM() {
            return baseKM;
        }

        public void setBaseKM(String baseKM) {
            this.baseKM = baseKM;
        }

        public String getPackageName() {
            return packageName;
        }

        public void setPackageName(String packageName) {
            this.packageName = packageName;
        }

        public String getPackageId() {
            return packageId;
        }

        public void setPackageId(String packageId) {
            this.packageId = packageId;
        }

        public String getSurgeReason() {
            return surgeReason;
        }

        public void setSurgeReason(String surgeReason) {
            this.surgeReason = surgeReason;
        }

        public String getPeakPer() {
            return peakPer;
        }

        public void setPeakPer(String peakPer) {
            this.peakPer = peakPer;
        }

        public String getNightPer() {
            return nightPer;
        }

        public void setNightPer(String nightPer) {
            this.nightPer = nightPer;
        }

        public Boolean getIsPeak() {
            return isPeak;
        }

        public void setIsPeak(Boolean isPeak) {
            this.isPeak = isPeak;
        }

        public Boolean getIsNight() {
            return isNight;
        }

        public void setIsNight(Boolean isNight) {
            this.isNight = isNight;
        }

        public String getCompanyAllowance() {
            return companyAllowance;
        }

        public void setCompanyAllowance(String companyAllowance) {
            this.companyAllowance = companyAllowance;
        }

        public String getTax() {
            return tax;
        }

        public void setTax(String tax) {
            this.tax = tax;
        }

        public String getCost() {
            return cost;
        }

        public void setCost(String cost) {
            this.cost = cost;
        }

        public String getPromoamt() {
            return promoamt;
        }

        public void setPromoamt(String promoamt) {
            this.promoamt = promoamt;
        }

        public String getHotelcommision() {
            return hotelcommision;
        }

        public void setHotelcommision(String hotelcommision) {
            this.hotelcommision = hotelcommision;
        }

        public String getComison() {
            return comison;
        }

        public void setComison(String comison) {
            this.comison = comison;
        }

        public String getTimefare() {
            return timefare;
        }

        public void setTimefare(String timefare) {
            this.timefare = timefare;
        }

        public String getBase() {
            return base;
        }

        public void setBase(String base) {
            this.base = base;
        }

    }
    public class Driverfb {

        @SerializedName("cmts")
        @Expose
        private String cmts;
        @SerializedName("rating")
        @Expose
        private String rating;

        public String getCmts() {
            return cmts;
        }

        public void setCmts(String cmts) {
            this.cmts = cmts;
        }

        public String getRating() {
            return rating;
        }

        public void setRating(String rating) {
            this.rating = rating;
        }

    }
    public class Dsp {

        @SerializedName("distanceKM")
        @Expose
        private String distanceKM;
        @SerializedName("estTime")
        @Expose
        private String estTime;
        @SerializedName("start")
        @Expose
        private String start;
        @SerializedName("end")
        @Expose
        private String end;
        @SerializedName("outstationType")
        @Expose
        private String outstationType;
        @SerializedName("returnDay")
        @Expose
        private String returnDay;
        @SerializedName("startDay")
        @Expose
        private String startDay;
        @SerializedName("endcoords")
        @Expose
        private Object endcoords;
        @SerializedName("startcoords")
        @Expose
        private List<String> startcoords = null;

        public String getDistanceKM() {
            return distanceKM;
        }

        public void setDistanceKM(String distanceKM) {
            this.distanceKM = distanceKM;
        }

        public String getEstTime() {
            return estTime;
        }

        public void setEstTime(String estTime) {
            this.estTime = estTime;
        }

        public String getStart() {
            return start;
        }

        public void setStart(String start) {
            this.start = start;
        }

        public String getEnd() {
            return end;
        }

        public void setEnd(String end) {
            this.end = end;
        }

        public String getOutstationType() {
            return outstationType;
        }

        public void setOutstationType(String outstationType) {
            this.outstationType = outstationType;
        }

        public String getReturnDay() {
            return returnDay;
        }

        public void setReturnDay(String returnDay) {
            this.returnDay = returnDay;
        }

        public String getStartDay() {
            return startDay;
        }

        public void setStartDay(String startDay) {
            this.startDay = startDay;
        }

        public Object getEndcoords() {
            return endcoords;
        }

        public void setEndcoords(Object endcoords) {
            this.endcoords = endcoords;
        }

        public List<String> getStartcoords() {
            return startcoords;
        }

        public void setStartcoords(List<String> startcoords) {
            this.startcoords = startcoords;
        }

    }
    public class Other {

        @SerializedName("ph")
        @Expose
        private String ph;
        @SerializedName("phCode")
        @Expose
        private String phCode;
        @SerializedName("name")
        @Expose
        private String name;

        public String getPh() {
            return ph;
        }

        public void setPh(String ph) {
            this.ph = ph;
        }

        public String getPhCode() {
            return phCode;
        }

        public void setPhCode(String phCode) {
            this.phCode = phCode;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }
    public class ProfileDetail {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("fname")
        @Expose
        private String fname;
        @SerializedName("phone")
        @Expose
        private String phone;
        @SerializedName("profile")
        @Expose
        private String profile;
        @SerializedName("licenceexp")
        @Expose
        private Object licenceexp;
        @SerializedName("insuranceexp")
        @Expose
        private Object insuranceexp;
        @SerializedName("passingexp")
        @Expose
        private Object passingexp;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getFname() {
            return fname;
        }

        public void setFname(String fname) {
            this.fname = fname;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getProfile() {
            return profile;
        }

        public void setProfile(String profile) {
            this.profile = profile;
        }

        public Object getLicenceexp() {
            return licenceexp;
        }

        public void setLicenceexp(Object licenceexp) {
            this.licenceexp = licenceexp;
        }

        public Object getInsuranceexp() {
            return insuranceexp;
        }

        public void setInsuranceexp(Object insuranceexp) {
            this.insuranceexp = insuranceexp;
        }

        public Object getPassingexp() {
            return passingexp;
        }

        public void setPassingexp(Object passingexp) {
            this.passingexp = passingexp;
        }

    }
    public class ReqDvr {

        @SerializedName("distVal")
        @Expose
        private String distVal;
        @SerializedName("called")
        @Expose
        private String called;
        @SerializedName("drvId")
        @Expose
        private String drvId;

        public String getDistVal() {
            return distVal;
        }

        public void setDistVal(String distVal) {
            this.distVal = distVal;
        }

        public String getCalled() {
            return called;
        }

        public void setCalled(String called) {
            this.called = called;
        }

        public String getDrvId() {
            return drvId;
        }

        public void setDrvId(String drvId) {
            this.drvId = drvId;
        }

    }
    public class TripDetail {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("tripno")
        @Expose
        private String tripno;
        @SerializedName("date")
        @Expose
        private String date;
        @SerializedName("cpy")
        @Expose
        private Object cpy;
        @SerializedName("dvr")
        @Expose
        private String dvr;
        @SerializedName("rid")
        @Expose
        private String rid;
        @SerializedName("vehicle")
        @Expose
        private String vehicle;
        @SerializedName("service")
        @Expose
        private String service;
        @SerializedName("paymentMode")
        @Expose
        private String paymentMode;
        @SerializedName("estTime")
        @Expose
        private String estTime;
        @SerializedName("scity")
        @Expose
        private String scity;
        @SerializedName("scId")
        @Expose
        private String scId;
        @SerializedName("gmtTime")
        @Expose
        private String gmtTime;
        @SerializedName("tripFDT")
        @Expose
        private String tripFDT;
        @SerializedName("utc")
        @Expose
        private String utc;
        @SerializedName("tripDT")
        @Expose
        private String tripDT;
        @SerializedName("needClear")
        @Expose
        private String needClear;
        @SerializedName("curReq")
        @Expose
        private List<String> curReq = null;
        @SerializedName("reqDvr")
        @Expose
        private List<ReqDvr> reqDvr = null;
        @SerializedName("review")
        @Expose
        private String review;
        @SerializedName("tripOTP")
        @Expose
        private List<String> tripOTP = null;
        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("applyValues")
        @Expose
        private ApplyValues applyValues;
        @SerializedName("additionalFee")
        @Expose
        private Object additionalFee;
        @SerializedName("acsp")
        @Expose
        private Acsp acsp;
        @SerializedName("dsp")
        @Expose
        private Dsp dsp;
        @SerializedName("csp")
        @Expose
        private Csp csp;
        @SerializedName("noofseats")
        @Expose
        private String noofseats;
        @SerializedName("paymentSts")
        @Expose
        private String paymentSts;
        @SerializedName("fare")
        @Expose
        private String fare;
        @SerializedName("ridid")
        @Expose
        private String ridid;
        @SerializedName("dvrid")
        @Expose
        private String dvrid;
        @SerializedName("cpyid")
        @Expose
        private Object cpyid;
        @SerializedName("hotelid")
        @Expose
        private Object hotelid;
        @SerializedName("other")
        @Expose
        private Other other;
        @SerializedName("notes")
        @Expose
        private String notes;
        @SerializedName("bookingFor")
        @Expose
        private String bookingFor;
        @SerializedName("bookingType")
        @Expose
        private String bookingType;
        @SerializedName("triptype")
        @Expose
        private String triptype;
        @SerializedName("requestId")
        @Expose
        private String requestId;
        @SerializedName("requestFrom")
        @Expose
        private String requestFrom;
        @SerializedName("createdAt")
        @Expose
        private String createdAt;
        @SerializedName("__v")
        @Expose
        private String v;
        @SerializedName("adsp")
        @Expose
        private Adsp adsp;
        @SerializedName("driverfb")
        @Expose
        private Driverfb driverfb;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTripno() {
            return tripno;
        }

        public void setTripno(String tripno) {
            this.tripno = tripno;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Object getCpy() {
            return cpy;
        }

        public void setCpy(Object cpy) {
            this.cpy = cpy;
        }

        public String getDvr() {
            return dvr;
        }

        public void setDvr(String dvr) {
            this.dvr = dvr;
        }

        public String getRid() {
            return rid;
        }

        public void setRid(String rid) {
            this.rid = rid;
        }

        public String getVehicle() {
            return vehicle;
        }

        public void setVehicle(String vehicle) {
            this.vehicle = vehicle;
        }

        public String getService() {
            return service;
        }

        public void setService(String service) {
            this.service = service;
        }

        public String getPaymentMode() {
            return paymentMode;
        }

        public void setPaymentMode(String paymentMode) {
            this.paymentMode = paymentMode;
        }

        public String getEstTime() {
            return estTime;
        }

        public void setEstTime(String estTime) {
            this.estTime = estTime;
        }

        public String getScity() {
            return scity;
        }

        public void setScity(String scity) {
            this.scity = scity;
        }

        public String getScId() {
            return scId;
        }

        public void setScId(String scId) {
            this.scId = scId;
        }

        public String getGmtTime() {
            return gmtTime;
        }

        public void setGmtTime(String gmtTime) {
            this.gmtTime = gmtTime;
        }

        public String getTripFDT() {
            return tripFDT;
        }

        public void setTripFDT(String tripFDT) {
            this.tripFDT = tripFDT;
        }

        public String getUtc() {
            return utc;
        }

        public void setUtc(String utc) {
            this.utc = utc;
        }

        public String getTripDT() {
            return tripDT;
        }

        public void setTripDT(String tripDT) {
            this.tripDT = tripDT;
        }

        public String getNeedClear() {
            return needClear;
        }

        public void setNeedClear(String needClear) {
            this.needClear = needClear;
        }

        public List<String> getCurReq() {
            return curReq;
        }

        public void setCurReq(List<String> curReq) {
            this.curReq = curReq;
        }

        public List<ReqDvr> getReqDvr() {
            return reqDvr;
        }

        public void setReqDvr(List<ReqDvr> reqDvr) {
            this.reqDvr = reqDvr;
        }

        public String getReview() {
            return review;
        }

        public void setReview(String review) {
            this.review = review;
        }

        public List<String> getTripOTP() {
            return tripOTP;
        }

        public void setTripOTP(List<String> tripOTP) {
            this.tripOTP = tripOTP;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public ApplyValues getApplyValues() {
            return applyValues;
        }

        public void setApplyValues(ApplyValues applyValues) {
            this.applyValues = applyValues;
        }

        public Object getAdditionalFee() {
            return additionalFee;
        }

        public void setAdditionalFee(Object additionalFee) {
            this.additionalFee = additionalFee;
        }

        public Acsp getAcsp() {
            return acsp;
        }

        public void setAcsp(Acsp acsp) {
            this.acsp = acsp;
        }

        public Dsp getDsp() {
            return dsp;
        }

        public void setDsp(Dsp dsp) {
            this.dsp = dsp;
        }

        public Csp getCsp() {
            return csp;
        }

        public void setCsp(Csp csp) {
            this.csp = csp;
        }

        public String getNoofseats() {
            return noofseats;
        }

        public void setNoofseats(String noofseats) {
            this.noofseats = noofseats;
        }

        public String getPaymentSts() {
            return paymentSts;
        }

        public void setPaymentSts(String paymentSts) {
            this.paymentSts = paymentSts;
        }

        public String getFare() {
            return fare;
        }

        public void setFare(String fare) {
            this.fare = fare;
        }

        public String getRidid() {
            return ridid;
        }

        public void setRidid(String ridid) {
            this.ridid = ridid;
        }

        public String getDvrid() {
            return dvrid;
        }

        public void setDvrid(String dvrid) {
            this.dvrid = dvrid;
        }

        public Object getCpyid() {
            return cpyid;
        }

        public void setCpyid(Object cpyid) {
            this.cpyid = cpyid;
        }

        public Object getHotelid() {
            return hotelid;
        }

        public void setHotelid(Object hotelid) {
            this.hotelid = hotelid;
        }

        public Other getOther() {
            return other;
        }

        public void setOther(Other other) {
            this.other = other;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }

        public String getBookingFor() {
            return bookingFor;
        }

        public void setBookingFor(String bookingFor) {
            this.bookingFor = bookingFor;
        }

        public String getBookingType() {
            return bookingType;
        }

        public void setBookingType(String bookingType) {
            this.bookingType = bookingType;
        }

        public String getTriptype() {
            return triptype;
        }

        public void setTriptype(String triptype) {
            this.triptype = triptype;
        }

        public String getRequestId() {
            return requestId;
        }

        public void setRequestId(String requestId) {
            this.requestId = requestId;
        }

        public String getRequestFrom() {
            return requestFrom;
        }

        public void setRequestFrom(String requestFrom) {
            this.requestFrom = requestFrom;
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

        public Adsp getAdsp() {
            return adsp;
        }

        public void setAdsp(Adsp adsp) {
            this.adsp = adsp;
        }

        public Driverfb getDriverfb() {
            return driverfb;
        }

        public void setDriverfb(Driverfb driverfb) {
            this.driverfb = driverfb;
        }

    }
    public class ApplyValues {

        @SerializedName("applyPickupCharge")
        @Expose
        private Boolean applyPickupCharge;
        @SerializedName("applyCommission")
        @Expose
        private Boolean applyCommission;
        @SerializedName("applyTax")
        @Expose
        private Boolean applyTax;
        @SerializedName("applyWaitingTime")
        @Expose
        private Boolean applyWaitingTime;
        @SerializedName("applyPeakCharge")
        @Expose
        private Boolean applyPeakCharge;
        @SerializedName("applyNightCharge")
        @Expose
        private Boolean applyNightCharge;

        public Boolean getApplyPickupCharge() {
            return applyPickupCharge;
        }

        public void setApplyPickupCharge(Boolean applyPickupCharge) {
            this.applyPickupCharge = applyPickupCharge;
        }

        public Boolean getApplyCommission() {
            return applyCommission;
        }

        public void setApplyCommission(Boolean applyCommission) {
            this.applyCommission = applyCommission;
        }

        public Boolean getApplyTax() {
            return applyTax;
        }

        public void setApplyTax(Boolean applyTax) {
            this.applyTax = applyTax;
        }

        public Boolean getApplyWaitingTime() {
            return applyWaitingTime;
        }

        public void setApplyWaitingTime(Boolean applyWaitingTime) {
            this.applyWaitingTime = applyWaitingTime;
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

    }
}
