package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class AddVehicleModel {
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("taxi")
    @Expose
    private Taxi taxi;

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

    public Taxi getTaxi() {
        return taxi;
    }

    public void setTaxi(Taxi taxi) {
        this.taxi = taxi;
    }
    public class Taxi {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("makename")
        @Expose
        private String makename;
        @SerializedName("model")
        @Expose
        private String model;
        @SerializedName("year")
        @Expose
        private String year;
        @SerializedName("licence")
        @Expose
        private String licence;
        @SerializedName("cpy")
        @Expose
        private String cpy;
        @SerializedName("driver")
        @Expose
        private String driver;
        @SerializedName("color")
        @Expose
        private String color;
        @SerializedName("handicap")
        @Expose
        private String handicap;
        @SerializedName("type")
        @Expose
        private List<Type> type = null;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getMakename() {
            return makename;
        }

        public void setMakename(String makename) {
            this.makename = makename;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getYear() {
            return year;
        }

        public void setYear(String year) {
            this.year = year;
        }

        public String getLicence() {
            return licence;
        }

        public void setLicence(String licence) {
            this.licence = licence;
        }

        public String getCpy() {
            return cpy;
        }

        public void setCpy(String cpy) {
            this.cpy = cpy;
        }

        public String getDriver() {
            return driver;
        }

        public void setDriver(String driver) {
            this.driver = driver;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public String getHandicap() {
            return handicap;
        }

        public void setHandicap(String handicap) {
            this.handicap = handicap;
        }

        public List<Type> getType() {
            return type;
        }

        public void setType(List<Type> type) {
            this.type = type;
        }

    }
    public class Type {

        @SerializedName("basic")
        @Expose
        private String basic;
        @SerializedName("normal")
        @Expose
        private String normal;
        @SerializedName("luxury")
        @Expose
        private String luxury;

        public String getBasic() {
            return basic;
        }

        public void setBasic(String basic) {
            this.basic = basic;
        }

        public String getNormal() {
            return normal;
        }

        public void setNormal(String normal) {
            this.normal = normal;
        }

        public String getLuxury() {
            return luxury;
        }

        public void setLuxury(String luxury) {
            this.luxury = luxury;
        }

    }

}
