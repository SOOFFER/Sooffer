package com.bismillah.driver.Model.Polygon;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PolygonModel {
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

        @SerializedName("sNo")
        @Expose
        private String sNo;
        @SerializedName("cityId")
        @Expose
        private String cityId;
        @SerializedName("cityCode")
        @Expose
        private String cityCode;
        @SerializedName("city")
        @Expose
        private String city;
        @SerializedName("cityBoundaryPolygon")
        @Expose
        private  List<List<List<Float>>> cityBoundaryPolygon = null;
        @SerializedName("stateId")
        @Expose
        private String stateId;
        @SerializedName("countryId")
        @Expose
        private String countryId;
        @SerializedName("status")
        @Expose
        private Boolean status;
        @SerializedName("softDelete")
        @Expose
        private Boolean softDelete;
        @SerializedName("createdAt")
        @Expose
        private String createdAt;
        @SerializedName("createdBy")
        @Expose
        private String createdBy;
        @SerializedName("modifiedAt")
        @Expose
        private String modifiedAt;
        @SerializedName("modifiedBy")
        @Expose
        private String modifiedBy;

        public String getSNo() {
            return sNo;
        }

        public void setSNo(String sNo) {
            this.sNo = sNo;
        }

        public String getCityId() {
            return cityId;
        }

        public void setCityId(String cityId) {
            this.cityId = cityId;
        }

        public String getCityCode() {
            return cityCode;
        }

        public void setCityCode(String cityCode) {
            this.cityCode = cityCode;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public List<List<List<Float>>> getCityBoundaryPolygon() {
            return cityBoundaryPolygon;
        }

        public void setCityBoundaryPolygon(List<List<List<Float>>> cityBoundaryPolygon) {
            this.cityBoundaryPolygon = cityBoundaryPolygon;
        }

        public String getStateId() {
            return stateId;
        }

        public void setStateId(String stateId) {
            this.stateId = stateId;
        }

        public String getCountryId() {
            return countryId;
        }

        public void setCountryId(String countryId) {
            this.countryId = countryId;
        }

        public Boolean getStatus() {
            return status;
        }

        public void setStatus(Boolean status) {
            this.status = status;
        }

        public Boolean getSoftDelete() {
            return softDelete;
        }

        public void setSoftDelete(Boolean softDelete) {
            this.softDelete = softDelete;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedBy() {
            return createdBy;
        }

        public void setCreatedBy(String createdBy) {
            this.createdBy = createdBy;
        }

        public String getModifiedAt() {
            return modifiedAt;
        }

        public void setModifiedAt(String modifiedAt) {
            this.modifiedAt = modifiedAt;
        }

        public String getModifiedBy() {
            return modifiedBy;
        }

        public void setModifiedBy(String modifiedBy) {
            this.modifiedBy = modifiedBy;
        }

    }
}
