package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by com on 18-May-18.
 */

public class scheduleTripListModel {
    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("tripno")
    @Expose
    private String tripno;
    @SerializedName("date")
    @Expose
    private String date;
    @SerializedName("fare")
    @Expose
    private String fare;
    @SerializedName("vehicle")
    @Expose
    private String vehicle;
    @SerializedName("paymentMode")
    @Expose
    private String paymentMode;
    @SerializedName("estTime")
    @Expose
    private String estTime;
    @SerializedName("scId")
    @Expose
    private Object scId;
    @SerializedName("__v")
    @Expose
    private String v;
    @SerializedName("tripFDT")
    @Expose
    private String tripFDT;
    @SerializedName("utc")
    @Expose
    private String utc;
    @SerializedName("tripDT")
    @Expose
    private String tripDT;
    @SerializedName("curReq")
    @Expose
    private List<String> curReq = null;
    @SerializedName("review")
    @Expose
    private String review;
    @SerializedName("tripOTP")
    @Expose
    private List<String> tripOTP = null;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("dsp")
    @Expose
    private Dsp dsp;
    @SerializedName("paymentSts")
    @Expose
    private String paymentSts;
    @SerializedName("bookingType")
    @Expose
    private String bookingType;
    @SerializedName("triptype")
    @Expose
    private String triptype;
    @SerializedName("requestFrom")
    @Expose
    private String requestFrom;

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

    public String getFare() {
        return fare;
    }

    public void setFare(String fare) {
        this.fare = fare;
    }

    public String getVehicle() {
        return vehicle;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
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

    public Object getScId() {
        return scId;
    }

    public void setScId(Object scId) {
        this.scId = scId;
    }

    public String getV() {
        return v;
    }

    public void setV(String v) {
        this.v = v;
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

    public List<String> getCurReq() {
        return curReq;
    }

    public void setCurReq(List<String> curReq) {
        this.curReq = curReq;
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

    public Dsp getDsp() {
        return dsp;
    }

    public void setDsp(Dsp dsp) {
        this.dsp = dsp;
    }

    public String getPaymentSts() {
        return paymentSts;
    }

    public void setPaymentSts(String paymentSts) {
        this.paymentSts = paymentSts;
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

    public String getRequestFrom() {
        return requestFrom;
    }

    public void setRequestFrom(String requestFrom) {
        this.requestFrom = requestFrom;
    }


    public class Dsp {

        @SerializedName("distanceKM")
        @Expose
        private String distanceKM;
        @SerializedName("start")
        @Expose
        private String start;
        @SerializedName("end")
        @Expose
        private String end;
        @SerializedName("endcoords")
        @Expose
        private List<String> endcoords = null;
        @SerializedName("startcoords")
        @Expose
        private List<String> startcoords = null;

        public String getDistanceKM() {
            return distanceKM;
        }

        public void setDistanceKM(String distanceKM) {
            this.distanceKM = distanceKM;
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

        public List<String> getEndcoords() {
            return endcoords;
        }

        public void setEndcoords(List<String> endcoords) {
            this.endcoords = endcoords;
        }

        public List<String> getStartcoords() {
            return startcoords;
        }

        public void setStartcoords(List<String> startcoords) {
            this.startcoords = startcoords;
        }

    }
}
