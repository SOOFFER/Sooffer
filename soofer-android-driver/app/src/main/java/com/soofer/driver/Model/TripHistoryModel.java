package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

public class TripHistoryModel implements Serializable {


    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("date")
    @Expose
    private String date;
    @SerializedName("fare")
    @Expose
    private String fare;
    @SerializedName("vehicle")
    @Expose
    private String vehicle;
    @SerializedName("estTime")
    @Expose
    private String estTime;
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
    @SerializedName("review")
    @Expose
    private String review;
    @SerializedName("tripOTP")
    @Expose
    private List<String> tripOTP = null;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("adsp")
    @Expose
    private Adsp adsp;
    @SerializedName("dsp")
    @Expose
    private Dsp dsp;
    @SerializedName("paymentSts")
    @Expose
    private String paymentSts;
    @SerializedName("triptype")
    @Expose
    private String triptype;
    @SerializedName("tripno")
    @Expose
    private String tripno;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getEstTime() {
        return estTime;
    }

    public void setEstTime(String estTime) {
        this.estTime = estTime;
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

    public Adsp getAdsp() {
        return adsp;
    }

    public void setAdsp(Adsp adsp) {
        this.adsp = adsp;
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

    public String getTriptype() {
        return triptype;
    }

    public void setTriptype(String triptype) {
        this.triptype = triptype;
    }

    public String getTripno() {
        return tripno;
    }

    public void setTripno(String tripno) {
        this.tripno = tripno;
    }


    public class Adsp {

        @SerializedName("map")
        @Expose
        private String map;
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

        public String getMap() {
            return map;
        }

        public void setMap(String map) {
            this.map = map;
        }

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

    }

    public class Dsp {

        @SerializedName("start")
        @Expose
        private String start;
        @SerializedName("end")
        @Expose
        private String end;
        @SerializedName("exceededKM")
        @Expose
        private String exceededKM;
        @SerializedName("addDoubleCharge")
        @Expose
        private Boolean addDoubleCharge;
        @SerializedName("vertexcoords")
        @Expose
        private List<String> vertexcoords = null;
        @SerializedName("endcoords")
        @Expose
        private List<String> endcoords = null;
        @SerializedName("startcoords")
        @Expose
        private List<String> startcoords = null;

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

        public String getExceededKM() {
            return exceededKM;
        }

        public void setExceededKM(String exceededKM) {
            this.exceededKM = exceededKM;
        }

        public Boolean getAddDoubleCharge() {
            return addDoubleCharge;
        }

        public void setAddDoubleCharge(Boolean addDoubleCharge) {
            this.addDoubleCharge = addDoubleCharge;
        }

        public List<String> getVertexcoords() {
            return vertexcoords;
        }

        public void setVertexcoords(List<String> vertexcoords) {
            this.vertexcoords = vertexcoords;
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
