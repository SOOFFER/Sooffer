package com.bismillah.app.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class ProfileModel {
    @SerializedName("configData")
    @Expose
    private ConfigData configData;

    public ConfigData getConfigData() {
        return configData;
    }

    public void setConfigData(ConfigData configData) {
        this.configData = configData;
    }
    public class ConfigData {

        @SerializedName("googleApiAutoComplete")
        @Expose
        private String googleApiAutoComplete;
        @SerializedName("googleApi")
        @Expose
        private String googleApi;
        @SerializedName("fcmServer")
        @Expose
        private String fcmServer;
        @SerializedName("adminfcmServer")
        @Expose
        private String adminfcmServer;
        @SerializedName("baseurl")
        @Expose
        private String baseurl;
        @SerializedName("applink")
        @Expose
        private String applink;
        @SerializedName("shareTrip")
        @Expose
        private String shareTrip;
        @SerializedName("requestRadius")
        @Expose
        private String requestRadius;
        @SerializedName("rentalRequestRadius")
        @Expose
        private String rentalRequestRadius;
        @SerializedName("outstationRequestRadius")
        @Expose
        private String outstationRequestRadius;
        @SerializedName("currency")
        @Expose
        private String currency;
        @SerializedName("currencySymbol")
        @Expose
        private String currencySymbol;
        @SerializedName("distanceUnit")
        @Expose
        private String distanceUnit;
        @SerializedName("distanceSymbol")
        @Expose
        private String distanceSymbol;
        @SerializedName("companyaddress")
        @Expose
        private String companyaddress;
        @SerializedName("companymail")
        @Expose
        private String companymail;
        @SerializedName("supportNo")
        @Expose
        private String supportNo;

        @SerializedName("neededOutstationFlow")
        @Expose
        private String neededOutstationFlow;

        @SerializedName("needRentalFlow")
        @Expose
        private String needRentalFlow;

        public String getGoogleApiAutoComplete() {
            return googleApiAutoComplete;
        }

        public void setGoogleApiAutoComplete(String googleApiAutoComplete) {
            this.googleApiAutoComplete = googleApiAutoComplete;
        }

        public String getGoogleApi() {
            return googleApi;
        }

        public void setGoogleApi(String googleApi) {
            this.googleApi = googleApi;
        }


        public String getNeededOutstationFlow() {
            return neededOutstationFlow;
        }

        public void setNeededOutstationFlow(String neededOutstationFlow) {
            this.neededOutstationFlow = neededOutstationFlow;
        }

        public String getNeedRentalFlow() {
            return needRentalFlow;
        }

        public void setNeedRentalFlow(String needRentalFlow) {
            this.needRentalFlow = needRentalFlow;
        }

        public String getFcmServer() {
            return fcmServer;
        }

        public void setFcmServer(String fcmServer) {
            this.fcmServer = fcmServer;
        }

        public String getAdminfcmServer() {
            return adminfcmServer;
        }

        public void setAdminfcmServer(String adminfcmServer) {
            this.adminfcmServer = adminfcmServer;
        }

        public String getBaseurl() {
            return baseurl;
        }

        public void setBaseurl(String baseurl) {
            this.baseurl = baseurl;
        }

        public String getApplink() {
            return applink;
        }

        public void setApplink(String applink) {
            this.applink = applink;
        }

        public String getShareTrip() {
            return shareTrip;
        }

        public void setShareTrip(String shareTrip) {
            this.shareTrip = shareTrip;
        }

        public String getRequestRadius() {
            return requestRadius;
        }

        public void setRequestRadius(String requestRadius) {
            this.requestRadius = requestRadius;
        }

        public String getRentalRequestRadius() {
            return rentalRequestRadius;
        }

        public void setRentalRequestRadius(String rentalRequestRadius) {
            this.rentalRequestRadius = rentalRequestRadius;
        }

        public String getOutstationRequestRadius() {
            return outstationRequestRadius;
        }

        public void setOutstationRequestRadius(String outstationRequestRadius) {
            this.outstationRequestRadius = outstationRequestRadius;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getCurrencySymbol() {
            return currencySymbol;
        }

        public void setCurrencySymbol(String currencySymbol) {
            this.currencySymbol = currencySymbol;
        }

        public String getDistanceUnit() {
            return distanceUnit;
        }

        public void setDistanceUnit(String distanceUnit) {
            this.distanceUnit = distanceUnit;
        }

        public String getDistanceSymbol() {
            return distanceSymbol;
        }

        public void setDistanceSymbol(String distanceSymbol) {
            this.distanceSymbol = distanceSymbol;
        }

        public String getCompanyaddress() {
            return companyaddress;
        }

        public void setCompanyaddress(String companyaddress) {
            this.companyaddress = companyaddress;
        }

        public String getCompanymail() {
            return companymail;
        }

        public void setCompanymail(String companymail) {
            this.companymail = companymail;
        }

        public String getSupportNo() {
            return supportNo;
        }

        public void setSupportNo(String supportNo) {
            this.supportNo = supportNo;
        }

    }

    public static class Address {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("Coords")
        @Expose
        private List<String> coords = null;
        @SerializedName("address")
        @Expose
        private String address;
        @SerializedName("lable")
        @Expose
        private String lable;

        public Boolean getIsvisible() {
            return isvisible;
        }

        public void setIsvisible(Boolean isvisible) {
            this.isvisible = isvisible;
        }

        @SerializedName("isVisible")
        @Expose
        private Boolean isvisible = false;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public List<String> getCoords() {
            return coords;
        }

        public void setCoords(List<String> coords) {
            this.coords = coords;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getLable() {
            return lable;
        }

        public void setLable(String lable) {
            this.lable = lable;
        }

    }
    public class Card {

        @SerializedName("last4")
        @Expose
        private String last4;
        @SerializedName("currency")
        @Expose
        private String currency;
        @SerializedName("id")
        @Expose
        private String id;

        public String getLast4() {
            return last4;
        }

        public void setLast4(String last4) {
            this.last4 = last4;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

    }
    public class EmgContact {

        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("number")
        @Expose
        private String number;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getNumber() {
            return number;
        }

        public void setNumber(String number) {
            this.number = number;
        }

    }



    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("phone")
    @Expose
    private String phone;
    @SerializedName("email")
    @Expose
    private String email;
    @SerializedName("lname")
    @Expose
    private String lname;
    @SerializedName("fname")
    @Expose
    private String fname;
    @SerializedName("stripe")
    @Expose
    private Stripe stripe;
    @SerializedName("__v")
    @Expose
    private String v;
    @SerializedName("verificationCode")
    @Expose
    private String verificationCode;
    @SerializedName("status")
    @Expose
    private Boolean status;
    @SerializedName("cityname")
    @Expose
    private String cityname;
    @SerializedName("city")
    @Expose
    private String city;
    @SerializedName("statename")
    @Expose
    private String statename;
    @SerializedName("state")
    @Expose
    private String state;
    @SerializedName("cntyname")
    @Expose
    private String cntyname;
    @SerializedName("cnty")
    @Expose
    private String cnty;
    @SerializedName("scity")
    @Expose
    private String scity;
    @SerializedName("referal")
    @Expose
    private String referal;
    @SerializedName("lastCanceledDate")
    @Expose
    private String lastCanceledDate;
    @SerializedName("canceledCount")
    @Expose
    private String canceledCount;
    @SerializedName("balance")
    @Expose
    private String balance;
    @SerializedName("gender")
    @Expose
    private String gender;
    @SerializedName("lang")
    @Expose
    private String lang;
    @SerializedName("fcmId")
    @Expose
    private String fcmId;
    @SerializedName("card")
    @Expose
    private Card card;
    @SerializedName("address")
    @Expose
    private List<Address> address = null;
    @SerializedName("rating")
    @Expose
    private Rating rating;
    @SerializedName("EmgContact")
    @Expose
    private List<EmgContact> emgContact = null;
    @SerializedName("profile")
    @Expose
    private String profile;
    @SerializedName("phcode")
    @Expose
    private String phcode;
    @SerializedName("cur")
    @Expose
    private String cur;
    @SerializedName("createdAt")
    @Expose
    private String createdAt;
    @SerializedName("profileurl")
    @Expose
    private String profileurl;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public Stripe getStripe() {
        return stripe;
    }

    public void setStripe(Stripe stripe) {
        this.stripe = stripe;
    }

    public String getV() {
        return v;
    }

    public void setV(String v) {
        this.v = v;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getCityname() {
        return cityname;
    }

    public void setCityname(String cityname) {
        this.cityname = cityname;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStatename() {
        return statename;
    }

    public void setStatename(String statename) {
        this.statename = statename;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCntyname() {
        return cntyname;
    }

    public void setCntyname(String cntyname) {
        this.cntyname = cntyname;
    }

    public String getCnty() {
        return cnty;
    }

    public void setCnty(String cnty) {
        this.cnty = cnty;
    }

    public String getScity() {
        return scity;
    }

    public void setScity(String scity) {
        this.scity = scity;
    }

    public String getReferal() {
        return referal;
    }

    public void setReferal(String referal) {
        this.referal = referal;
    }

    public String getLastCanceledDate() {
        return lastCanceledDate;
    }

    public void setLastCanceledDate(String lastCanceledDate) {
        this.lastCanceledDate = lastCanceledDate;
    }

    public String getCanceledCount() {
        return canceledCount;
    }

    public void setCanceledCount(String canceledCount) {
        this.canceledCount = canceledCount;
    }

    public String getBalance() {
        return balance;
    }

    public void setBalance(String balance) {
        this.balance = balance;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getFcmId() {
        return fcmId;
    }

    public void setFcmId(String fcmId) {
        this.fcmId = fcmId;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public List<Address> getAddress() {
        return address;
    }

    public void setAddress(List<Address> address) {
        this.address = address;
    }

    public Rating getRating() {
        return rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public List<EmgContact> getEmgContact() {
        return emgContact;
    }

    public void setEmgContact(List<EmgContact> emgContact) {
        this.emgContact = emgContact;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getPhcode() {
        return phcode;
    }

    public void setPhcode(String phcode) {
        this.phcode = phcode;
    }

    public String getCur() {
        return cur;
    }

    public void setCur(String cur) {
        this.cur = cur;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getProfileurl() {
        return profileurl;
    }

    public void setProfileurl(String profileurl) {
        this.profileurl = profileurl;
    }


    public class Rating {

        @SerializedName("cmts")
        @Expose
        private String cmts;
        @SerializedName("nos")
        @Expose
        private String nos;
        @SerializedName("rating")
        @Expose
        private String rating;

        public String getCmts() {
            return cmts;
        }

        public void setCmts(String cmts) {
            this.cmts = cmts;
        }

        public String getNos() {
            return nos;
        }

        public void setNos(String nos) {
            this.nos = nos;
        }

        public String getRating() {
            return rating;
        }

        public void setRating(String rating) {
            this.rating = rating;
        }

    }

    public class Stripe {

        @SerializedName("last4")
        @Expose
        private String last4;
        @SerializedName("currency")
        @Expose
        private String currency;
        @SerializedName("id")
        @Expose
        private String id;

        public String getLast4() {
            return last4;
        }

        public void setLast4(String last4) {
            this.last4 = last4;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

    }


}