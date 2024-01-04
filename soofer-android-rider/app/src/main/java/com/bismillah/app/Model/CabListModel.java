package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class CabListModel {
    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("data")
    @Expose
    private List<Datum> data = null;

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

    public List<Datum> getData() {
        return data;
    }

    public void setData(List<Datum> data) {
        this.data = data;
    }

    public class Datum {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("tripTypeCode")
        @Expose
        private String tripTypeCode;
        @SerializedName("type")
        @Expose
        private String type;
        @SerializedName("bkm")
        @Expose
        private String bkm;
        @SerializedName("timeFare")
        @Expose
        private String timeFare;
        @SerializedName("baseFare")
        @Expose
        private String baseFare;
        @SerializedName("packageDistance")
        @Expose
        private String packageDistance;
        @SerializedName("packageDuration")
        @Expose
        private String packageDuration;
        @SerializedName("file")
        @Expose
        private String file;
        @SerializedName("description")
        @Expose
        private String description;
        @SerializedName("seat")
        @Expose
        private String seat;
        @SerializedName("packageId")
        @Expose
        private String packageId;
        @SerializedName("fare")
        @Expose
        private String fare;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTripTypeCode() {
            return tripTypeCode;
        }

        public void setTripTypeCode(String tripTypeCode) {
            this.tripTypeCode = tripTypeCode;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getBkm() {
            return bkm;
        }

        public void setBkm(String bkm) {
            this.bkm = bkm;
        }

        public String getTimeFare() {
            return timeFare;
        }

        public void setTimeFare(String timeFare) {
            this.timeFare = timeFare;
        }

        public String getBaseFare() {
            return baseFare;
        }

        public void setBaseFare(String baseFare) {
            this.baseFare = baseFare;
        }

        public String getPackageDistance() {
            return packageDistance;
        }

        public void setPackageDistance(String packageDistance) {
            this.packageDistance = packageDistance;
        }

        public String getPackageDuration() {
            return packageDuration;
        }

        public void setPackageDuration(String packageDuration) {
            this.packageDuration = packageDuration;
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

        public String getSeat() {
            return seat;
        }

        public void setSeat(String seat) {
            this.seat = seat;
        }

        public String getPackageId() {
            return packageId;
        }

        public void setPackageId(String packageId) {
            this.packageId = packageId;
        }

        public String getFare() {
            return fare;
        }

        public void setFare(String fare) {
            this.fare = fare;
        }

    }
}
