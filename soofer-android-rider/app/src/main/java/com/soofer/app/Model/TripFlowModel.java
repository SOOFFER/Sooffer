package com.soofer.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class TripFlowModel implements Serializable {

    public class CurrentActiveTaxi {

        @SerializedName("color")
        @Expose
        private String color;
        @SerializedName("driver")
        @Expose
        private String driver;
        @SerializedName("cpy")
        @Expose
        private String cpy;
        @SerializedName("licence")
        @Expose
        private String licence;
        @SerializedName("year")
        @Expose
        private String year;
        @SerializedName("model")
        @Expose
        private String model;
        @SerializedName("makename")
        @Expose
        private String makename;
        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("taxistatus")
        @Expose
        private String taxistatus;
        @SerializedName("noofshare")
        @Expose
        private String noofshare;
        @SerializedName("share")
        @Expose
        private Boolean share;
        @SerializedName("vehicletype")
        @Expose
        private String vehicletype;
        @SerializedName("rcbookexpdate")
        @Expose
        private String rcbookexpdate;
        @SerializedName("rcbook")
        @Expose
        private String rcbook;
        @SerializedName("permitexpdate")
        @Expose
        private String permitexpdate;
        @SerializedName("permit")
        @Expose
        private String permit;
        @SerializedName("insuranceexpdate")
        @Expose
        private String insuranceexpdate;
        @SerializedName("insurance")
        @Expose
        private String insurance;
        @SerializedName("type")
        @Expose
        private List<Type> type = null;
        @SerializedName("handicap")
        @Expose
        private String handicap;

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public String getDriver() {
            return driver;
        }

        public void setDriver(String driver) {
            this.driver = driver;
        }

        public String getCpy() {
            return cpy;
        }

        public void setCpy(String cpy) {
            this.cpy = cpy;
        }

        public String getLicence() {
            return licence;
        }

        public void setLicence(String licence) {
            this.licence = licence;
        }

        public String getYear() {
            return year;
        }

        public void setYear(String year) {
            this.year = year;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getMakename() {
            return makename;
        }

        public void setMakename(String makename) {
            this.makename = makename;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTaxistatus() {
            return taxistatus;
        }

        public void setTaxistatus(String taxistatus) {
            this.taxistatus = taxistatus;
        }

        public String getNoofshare() {
            return noofshare;
        }

        public void setNoofshare(String noofshare) {
            this.noofshare = noofshare;
        }

        public Boolean getShare() {
            return share;
        }

        public void setShare(Boolean share) {
            this.share = share;
        }

        public String getVehicletype() {
            return vehicletype;
        }

        public void setVehicletype(String vehicletype) {
            this.vehicletype = vehicletype;
        }

        public String getRcbookexpdate() {
            return rcbookexpdate;
        }

        public void setRcbookexpdate(String rcbookexpdate) {
            this.rcbookexpdate = rcbookexpdate;
        }

        public String getRcbook() {
            return rcbook;
        }

        public void setRcbook(String rcbook) {
            this.rcbook = rcbook;
        }

        public String getPermitexpdate() {
            return permitexpdate;
        }

        public void setPermitexpdate(String permitexpdate) {
            this.permitexpdate = permitexpdate;
        }

        public String getPermit() {
            return permit;
        }

        public void setPermit(String permit) {
            this.permit = permit;
        }

        public String getInsuranceexpdate() {
            return insuranceexpdate;
        }

        public void setInsuranceexpdate(String insuranceexpdate) {
            this.insuranceexpdate = insuranceexpdate;
        }

        public String getInsurance() {
            return insurance;
        }

        public void setInsurance(String insurance) {
            this.insurance = insurance;
        }

        public List<Type> getType() {
            return type;
        }

        public void setType(List<Type> type) {
            this.type = type;
        }

        public String getHandicap() {
            return handicap;
        }

        public void setHandicap(String handicap) {
            this.handicap = handicap;
        }

    }
    public class Driver {

        @SerializedName("profile")
        @Expose
        private Profile profile;
        @SerializedName("currentActiveTaxi")
        @Expose
        private CurrentActiveTaxi currentActiveTaxi;

        public Profile getProfile() {
            return profile;
        }

        public void setProfile(Profile profile) {
            this.profile = profile;
        }

        public CurrentActiveTaxi getCurrentActiveTaxi() {
            return currentActiveTaxi;
        }

        public void setCurrentActiveTaxi(CurrentActiveTaxi currentActiveTaxi) {
            this.currentActiveTaxi = currentActiveTaxi;
        }

    }

    public class Pickupdetails {

        @SerializedName("startcoords")
        @Expose
        private List<String> startcoords = null;
        @SerializedName("endcoords")
        @Expose
        private List<String> endcoords = null;
        @SerializedName("vertexcoords")
        @Expose
        private List<String> vertexcoords = null;
        @SerializedName("addDoubleCharge")
        @Expose
        private Boolean addDoubleCharge;
        @SerializedName("exceededKM")
        @Expose
        private String exceededKM;
        @SerializedName("end")
        @Expose
        private String end;
        @SerializedName("start")
        @Expose
        private String start;

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

        public List<String> getVertexcoords() {
            return vertexcoords;
        }

        public void setVertexcoords(List<String> vertexcoords) {
            this.vertexcoords = vertexcoords;
        }

        public Boolean getAddDoubleCharge() {
            return addDoubleCharge;
        }

        public void setAddDoubleCharge(Boolean addDoubleCharge) {
            this.addDoubleCharge = addDoubleCharge;
        }

        public String getExceededKM() {
            return exceededKM;
        }

        public void setExceededKM(String exceededKM) {
            this.exceededKM = exceededKM;
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

    public class Profile {

        @SerializedName("fname")
        @Expose
        private String fname;
        @SerializedName("lname")
        @Expose
        private String lname;
        @SerializedName("email")
        @Expose
        private String email;
        @SerializedName("phone")
        @Expose
        private String phone;
        @SerializedName("phcode")
        @Expose
        private String phcode;
        @SerializedName("cntyname")
        @Expose
        private String cntyname;
        @SerializedName("statename")
        @Expose
        private String statename;
        @SerializedName("cityname")
        @Expose
        private String cityname;
        @SerializedName("lang")
        @Expose
        private String lang;
        @SerializedName("cur")
        @Expose
        private String cur;
        @SerializedName("profileurl")
        @Expose
        private String profileurl;
        @SerializedName("rating")
        @Expose
        private String rating;

        public String getFname() {
            return fname;
        }

        public void setFname(String fname) {
            this.fname = fname;
        }

        public String getLname() {
            return lname;
        }

        public void setLname(String lname) {
            this.lname = lname;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
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

        public String getCntyname() {
            return cntyname;
        }

        public void setCntyname(String cntyname) {
            this.cntyname = cntyname;
        }

        public String getStatename() {
            return statename;
        }

        public void setStatename(String statename) {
            this.statename = statename;
        }

        public String getCityname() {
            return cityname;
        }

        public void setCityname(String cityname) {
            this.cityname = cityname;
        }

        public String getLang() {
            return lang;
        }

        public void setLang(String lang) {
            this.lang = lang;
        }

        public String getCur() {
            return cur;
        }

        public void setCur(String cur) {
            this.cur = cur;
        }

        public String getProfileurl() {
            return profileurl;
        }

        public void setProfileurl(String profileurl) {
            this.profileurl = profileurl;
        }

        public String getRating() {
            return rating;
        }

        public void setRating(String rating) {
            this.rating = rating;
        }

    }

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;

    public String getTripId() {
        return tripId;
    }

    public void setTripId(String tripId) {
        this.tripId = tripId;
    }

    @SerializedName("tripId")
    @Expose
    private String tripId;
    @SerializedName("driver")
    @Expose
    private List<Driver> driver = null;
    @SerializedName("pickupdetails")
    @Expose
    private Pickupdetails pickupdetails;
    @SerializedName("serviceType")
    @Expose
    private String serviceType;
    @SerializedName("startOTP")
    @Expose
    private String startOTP;
    @SerializedName("endOTP")
    @Expose
    private String endOTP;

    @SerializedName("multiLocation")
    @Expose
    private List<MultiLocation> multiLocation = new ArrayList<>();

    public List<MultiLocation> getMultiLocation() {
        return multiLocation;
    }

    public void setMultiLocation(List<MultiLocation> multiLocation) {
        this.multiLocation = multiLocation;
    }

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

    public List<Driver> getDriver() {
        return driver;
    }

    public void setDriver(List<Driver> driver) {
        this.driver = driver;
    }

    public Pickupdetails getPickupdetails() {
        return pickupdetails;
    }

    public void setPickupdetails(Pickupdetails pickupdetails) {
        this.pickupdetails = pickupdetails;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
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


    public class Type {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("luxury")
        @Expose
        private String luxury;
        @SerializedName("normal")
        @Expose
        private String normal;
        @SerializedName("basic")
        @Expose
        private String basic;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getLuxury() {
            return luxury;
        }

        public void setLuxury(String luxury) {
            this.luxury = luxury;
        }

        public String getNormal() {
            return normal;
        }

        public void setNormal(String normal) {
            this.normal = normal;
        }

        public String getBasic() {
            return basic;
        }

        public void setBasic(String basic) {
            this.basic = basic;
        }

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
