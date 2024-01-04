package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class CardDeliveryModel {
    @SerializedName("success")
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
        @SerializedName("rider")
        @Expose
        private String rider;
        @SerializedName("color")
        @Expose
        private String color;
        @SerializedName("handicap")
        @Expose
        private String handicap;
        @SerializedName("vehicletype")
        @Expose
        private String vehicletype;
        @SerializedName("noofshare")
        @Expose
        private String noofshare;
        @SerializedName("share")
        @Expose
        private String share;
        @SerializedName("chaisis")
        @Expose
        private String chaisis;
        @SerializedName("ownername")
        @Expose
        private String ownername;
        @SerializedName("registrationnumber")
        @Expose
        private String registrationnumber;
        @SerializedName("vin_number")
        @Expose
        private String vinNumber;
        @SerializedName("others1")
        @Expose
        private String others1;
        @SerializedName("image")
        @Expose
        private String image;
        @SerializedName("isDaily")
        @Expose
        private String isDaily;
        @SerializedName("isRental")
        @Expose
        private String isRental;
        @SerializedName("isOutstation")
        @Expose
        private String isOutstation;
        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("type")
        @Expose
        private List<Type> type = null;
        @SerializedName("createdAt")
        @Expose
        private String createdAt;
        @SerializedName("__v")
        @Expose
        private Integer v;

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

        public String getRider() {
            return rider;
        }

        public void setRider(String rider) {
            this.rider = rider;
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

        public String getVehicletype() {
            return vehicletype;
        }

        public void setVehicletype(String vehicletype) {
            this.vehicletype = vehicletype;
        }

        public String getNoofshare() {
            return noofshare;
        }

        public void setNoofshare(String noofshare) {
            this.noofshare = noofshare;
        }

        public String getShare() {
            return share;
        }

        public void setShare(String share) {
            this.share = share;
        }

        public String getChaisis() {
            return chaisis;
        }

        public void setChaisis(String chaisis) {
            this.chaisis = chaisis;
        }

        public String getOwnername() {
            return ownername;
        }

        public void setOwnername(String ownername) {
            this.ownername = ownername;
        }

        public String getRegistrationnumber() {
            return registrationnumber;
        }

        public void setRegistrationnumber(String registrationnumber) {
            this.registrationnumber = registrationnumber;
        }

        public String getVinNumber() {
            return vinNumber;
        }

        public void setVinNumber(String vinNumber) {
            this.vinNumber = vinNumber;
        }

        public String getOthers1() {
            return others1;
        }

        public void setOthers1(String others1) {
            this.others1 = others1;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getIsDaily() {
            return isDaily;
        }

        public void setIsDaily(String isDaily) {
            this.isDaily = isDaily;
        }

        public String getIsRental() {
            return isRental;
        }

        public void setIsRental(String isRental) {
            this.isRental = isRental;
        }

        public String getIsOutstation() {
            return isOutstation;
        }

        public void setIsOutstation(String isOutstation) {
            this.isOutstation = isOutstation;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public List<Type> getType() {
            return type;
        }

        public void setType(List<Type> type) {
            this.type = type;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public Integer getV() {
            return v;
        }

        public void setV(Integer v) {
            this.v = v;
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
            @SerializedName("_id")
            @Expose
            private String id;

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

            public String getId() {
                return id;
            }

            public void setId(String id) {
                this.id = id;
            }

        }
    }

}
