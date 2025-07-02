package com.soofer.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class DriverProfileModel {
    @SerializedName("configData")
    @Expose
    private ConfigData configData;

    @SerializedName("driverCancellationReasons")
    private List<String> driverCancellationReasons;


    @SerializedName("driverPerDayStatus")
    @Expose
    private List<DriverPerDaystatus> driverPerDayStatus = null;


    public ConfigData getConfigData() {
        return configData;
    }

    public void setConfigData(ConfigData configData) {
        this.configData = configData;
    }

    public List<String> getDriverCancellationReasons() {
        return driverCancellationReasons;
    }

    public void setDriverCancellationReasons(List<String> driverCancellationReasons) {
        this.driverCancellationReasons = driverCancellationReasons;
    }


    public List<DriverPerDaystatus> getDriverPerDayStatus() {
        return driverPerDayStatus;
    }

    public void setDriverPerDayStatus(List<DriverPerDaystatus> driverPerDayStatus) {
        this.driverPerDayStatus = driverPerDayStatus;
    }

    public class DriverPerDaystatus {

        @SerializedName("earned")
        @Expose
        private String earned;
        @SerializedName("adminCommision")
        @Expose
        private String adminCommision;
        @SerializedName("cashCollected")
        @Expose
        private String cashCollected;
        @SerializedName("bankDeposit")
        @Expose
        private String bankDeposit;
        @SerializedName("rideFare")
        @Expose
        private String rideFare;
        @SerializedName("Tax")
        @Expose
        private String tax;

        @SerializedName("GatewayCharge")
        @Expose
        private String gateway;
        @SerializedName("date")
        @Expose
        private String date;
        @SerializedName("totTrips")
        @Expose
        private String totTrips;
        @SerializedName("totalDistance")
        @Expose
        private String totalDistance;

        @SerializedName("perDayRide")
        @Expose
        private String perdayride;

        public String getPerdayride() {
            return perdayride;
        }

        public void setPerdayride(String perdayride) {
            this.perdayride = perdayride;
        }

        public String getPerdaykm() {
            return perdaykm;
        }

        public void setPerdaykm(String perdaykm) {
            this.perdaykm = perdaykm;
        }

        @SerializedName("perDayKM")
        @Expose
        private String perdaykm;

        public String getEarned() {
            return earned;
        }

        public void setEarned(String earned) {
            this.earned = earned;
        }

        public String getAdminCommision() {
            return adminCommision;
        }

        public void setAdminCommision(String adminCommision) {
            this.adminCommision = adminCommision;
        }

        public String getCashCollected() {
            return cashCollected;
        }

        public void setCashCollected(String cashCollected) {
            this.cashCollected = cashCollected;
        }

        public String getBankDeposit() {
            return bankDeposit;
        }

        public void setBankDeposit(String bankDeposit) {
            this.bankDeposit = bankDeposit;
        }

        public String getRideFare() {
            return rideFare;
        }

        public void setRideFare(String rideFare) {
            this.rideFare = rideFare;
        }

        public String getTax() {
            return tax;
        }

        public void setTax(String tax) {
            this.tax = tax;
        }


        public String getGateway() {
            return gateway;
        }

        public void setGateway(String gateway) {
            this.tax = gateway;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getTotTrips() {
            return totTrips;
        }

        public void setTotTrips(String totTrips) {
            this.totTrips = totTrips;
        }

        public String getTotalDistance() {
            return totalDistance;
        }

        public void setTotalDistance(String totalDistance) {
            this.totalDistance = totalDistance;
        }

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
        @SerializedName("isOutstation")
        @Expose
        private Boolean isOutstation;
        @SerializedName("isRental")
        @Expose
        private Boolean isRental;
        @SerializedName("isDaily")
        @Expose
        private Boolean isDaily;
        @SerializedName("imageBack")
        @Expose
        private String imageBack;
        @SerializedName("image")
        @Expose
        private String image;
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
        @SerializedName("others1")
        @Expose
        private String others1;
        @SerializedName("vin_number")
        @Expose
        private String vinNumber;
        @SerializedName("chaisis")
        @Expose
        private String chaisis;
        @SerializedName("registrationnumber")
        @Expose
        private String registrationnumber;
        @SerializedName("registrationexpdate")
        @Expose
        private String registrationexpdate;
        @SerializedName("registrationBack")
        @Expose
        private String registrationBack;
        @SerializedName("registration")
        @Expose
        private String registration;
        @SerializedName("permitexpdate")
        @Expose
        private String permitexpdate;
        @SerializedName("permit")
        @Expose
        private String permit;
        @SerializedName("insurancenumber")
        @Expose
        private String insurancenumber;
        @SerializedName("insuranceexpdate")
        @Expose
        private String insuranceexpdate;
        @SerializedName("insurance")
        @Expose
        private String insurance;

        @SerializedName("handicap")
        @Expose
        private String handicap;
        @SerializedName("ownername")
        @Expose
        private String ownername;

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

        public Boolean getIsOutstation() {
            return isOutstation;
        }

        public void setIsOutstation(Boolean isOutstation) {
            this.isOutstation = isOutstation;
        }

        public Boolean getIsRental() {
            return isRental;
        }

        public void setIsRental(Boolean isRental) {
            this.isRental = isRental;
        }

        public Boolean getIsDaily() {
            return isDaily;
        }

        public void setIsDaily(Boolean isDaily) {
            this.isDaily = isDaily;
        }

        public String getImageBack() {
            return imageBack;
        }

        public void setImageBack(String imageBack) {
            this.imageBack = imageBack;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
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

        public String getOthers1() {
            return others1;
        }

        public void setOthers1(String others1) {
            this.others1 = others1;
        }

        public String getVinNumber() {
            return vinNumber;
        }

        public void setVinNumber(String vinNumber) {
            this.vinNumber = vinNumber;
        }

        public String getChaisis() {
            return chaisis;
        }

        public void setChaisis(String chaisis) {
            this.chaisis = chaisis;
        }

        public String getRegistrationnumber() {
            return registrationnumber;
        }

        public void setRegistrationnumber(String registrationnumber) {
            this.registrationnumber = registrationnumber;
        }

        public String getRegistrationexpdate() {
            return registrationexpdate;
        }

        public void setRegistrationexpdate(String registrationexpdate) {
            this.registrationexpdate = registrationexpdate;
        }

        public String getRegistrationBack() {
            return registrationBack;
        }

        public void setRegistrationBack(String registrationBack) {
            this.registrationBack = registrationBack;
        }

        public String getRegistration() {
            return registration;
        }

        public void setRegistration(String registration) {
            this.registration = registration;
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

        public String getInsurancenumber() {
            return insurancenumber;
        }

        public void setInsurancenumber(String insurancenumber) {
            this.insurancenumber = insurancenumber;
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



        public String getHandicap() {
            return handicap;
        }

        public void setHandicap(String handicap) {
            this.handicap = handicap;
        }

        public String getOwnername() {
            return ownername;
        }

        public void setOwnername(String ownername) {
            this.ownername = ownername;
        }

    }

    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("code")
    @Expose
    private String code;
    @SerializedName("attendance")
    @Expose
    private Boolean attendance;
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
    @SerializedName("gender")
    @Expose
    private String gender;
    @SerializedName("DOB")
    @Expose
    private String dOB;
    @SerializedName("cnty")
    @Expose
    private String cnty;
    @SerializedName("cntyname")
    @Expose
    private String cntyname;
    @SerializedName("state")
    @Expose
    private String state;
    @SerializedName("statename")
    @Expose
    private String statename;
    @SerializedName("city")
    @Expose
    private String city;
    @SerializedName("cityname")
    @Expose
    private String cityname;
    @SerializedName("lang")
    @Expose
    private String lang;
    @SerializedName("__v")
    @Expose
    private String v;
    @SerializedName("isDaily")
    @Expose
    private Boolean isDaily;
    @SerializedName("referenceCode")
    @Expose
    private String referenceCode;
    @SerializedName("isSubcriptionActive")
    @Expose
    private Boolean isSubcriptionActive;
    @SerializedName("subcriptionEndDate")
    @Expose
    private String subcriptionEndDate;
    @SerializedName("blockuptoDate")
    @Expose
    private String blockuptoDate;
    @SerializedName("callmask")
    @Expose
    private String callmask;
    @SerializedName("loginId")
    @Expose
    private String loginId;
    @SerializedName("loginType")
    @Expose
    private String loginType;
    @SerializedName("verificationCode")
    @Expose
    private String verificationCode;
    @SerializedName("softdel")
    @Expose
    private String softdel;
    @SerializedName("scity")
    @Expose
    private String scity;
    @SerializedName("scId")
    @Expose
    private String scId;
    @SerializedName("lastCron")
    @Expose
    private String lastCron;
    @SerializedName("lastUpdate")
    @Expose
    private String lastUpdate;
    @SerializedName("last_out")
    @Expose
    private String lastOut;
    @SerializedName("last_in")
    @Expose
    private String lastIn;
    @SerializedName("fcmId")
    @Expose
    private String fcmId;
    @SerializedName("isConnected")
    @Expose
    private Boolean isConnected=false;
    @SerializedName("curTrip")
    @Expose
    private String curTrip;
    @SerializedName("todayAmt")
    @Expose
    private TodayAmt todayAmt;
    @SerializedName("lastCanceledDate")
    @Expose
    private String lastCanceledDate;
    @SerializedName("canceledCount")
    @Expose
    private String canceledCount;
    @SerializedName("wallet")
    @Expose
    private String wallet;
    @SerializedName("rating")
    @Expose
    private Rating rating;
    @SerializedName("coords")
    @Expose
    private List<String> coords = null;
    @SerializedName("online")
    @Expose
    private Boolean online;
    @SerializedName("sharebooked")
    @Expose
    private String sharebooked;
    @SerializedName("noofshare")
    @Expose
    private String noofshare;
    @SerializedName("share")
    @Expose
    private Boolean share;
    @SerializedName("vin_number")
    @Expose
    private String vinNumber;
    @SerializedName("others1")
    @Expose
    private String others1;
    @SerializedName("curVehicleNo")
    @Expose
    private String curVehicleNo;
    @SerializedName("curStatus")
    @Expose
    private String curStatus;
    @SerializedName("curService")
    @Expose
    private String curService;
    @SerializedName("serviceStatus")
    @Expose
    private String serviceStatus;
    @SerializedName("currentTaxi")
    @Expose
    private String currentTaxi;
    @SerializedName("revenueexp")
    @Expose
    private String revenueexp;
    @SerializedName("revenue")
    @Expose
    private String revenue;
    @SerializedName("passingexp")
    @Expose
    private String passingexp;
    @SerializedName("passingBackImg")
    @Expose
    private String passingBackImg;
    @SerializedName("passing")
    @Expose
    private String passing;
    @SerializedName("insuranceexp")
    @Expose
    private String insuranceexp;
    @SerializedName("insuranceBackImg")
    @Expose
    private String insuranceBackImg;
    @SerializedName("insurance")
    @Expose
    private String insurance;
    @SerializedName("licenceexp")
    @Expose
    private String licenceexp;
    @SerializedName("licenceNo")
    @Expose
    private String licenceNo;
    @SerializedName("licence")
    @Expose
    private String licence;
    @SerializedName("licenceBackImg")
    @Expose
    private String licenceBackImg;
    @SerializedName("nationIdback")
    @Expose
    private String nationIdback;
    @SerializedName("taxis")
    @Expose
    private List<Taxi> taxis = null;
    @SerializedName("status")
    @Expose
    private List<Status> status = null;

    @SerializedName("document")
    @Expose
    private List<Document> document =null;

    @SerializedName("baseurl")
    @Expose
    private String baseurl;
    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    @SerializedName("card")
    @Expose
    private Card card;

    @SerializedName("profile")
    @Expose
    private String profile;
    @SerializedName("cur")
    @Expose
    private String cur;
    @SerializedName("isHail")
    @Expose
    private Boolean isHail;
    @SerializedName("isIndividual")
    @Expose
    private Boolean isIndividual;
    @SerializedName("isTwoDriver")
    @Expose
    private Boolean isTwoDriver;
    @SerializedName("cmpy")
    @Expose
    private String cmpy;
    @SerializedName("phcode")
    @Expose
    private String phcode;
    @SerializedName("nic")
    @Expose
    private String nic;
    @SerializedName("createdAt")
    @Expose
    private String createdAt;
    @SerializedName("profileurl")
    @Expose
    private String profileurl;
    @SerializedName("currentActiveTaxi")
    @Expose
    private CurrentActiveTaxi currentActiveTaxi;




    @SerializedName("isDriverCreditModuleEnabledForUseAfterLogin")
    @Expose
    private Boolean isDriverCreditModuleEnabledForUseAfterLogin;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Boolean getAttendance() {
        return attendance;
    }

    public void setAttendance(Boolean attendance) {
        this.attendance = attendance;
    }

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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getDOB() {
        return dOB;
    }

    public void setDOB(String dOB) {
        this.dOB = dOB;
    }

    public String getCnty() {
        return cnty;
    }

    public void setCnty(String cnty) {
        this.cnty = cnty;
    }

    public String getCntyname() {
        return cntyname;
    }

    public void setCntyname(String cntyname) {
        this.cntyname = cntyname;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getStatename() {
        return statename;
    }

    public void setStatename(String statename) {
        this.statename = statename;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
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

    public String getV() {
        return v;
    }

    public void setV(String v) {
        this.v = v;
    }

    public Boolean getIsDaily() {
        return isDaily;
    }

    public void setIsDaily(Boolean isDaily) {
        this.isDaily = isDaily;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public Boolean getIsSubcriptionActive() {
        return isSubcriptionActive;
    }

    public void setIsSubcriptionActive(Boolean isSubcriptionActive) {
        this.isSubcriptionActive = isSubcriptionActive;
    }

    public String getSubcriptionEndDate() {
        return subcriptionEndDate;
    }

    public void setSubcriptionEndDate(String subcriptionEndDate) {
        this.subcriptionEndDate = subcriptionEndDate;
    }

    public String getBlockuptoDate() {
        return blockuptoDate;
    }

    public void setBlockuptoDate(String blockuptoDate) {
        this.blockuptoDate = blockuptoDate;
    }

    public String getCallmask() {
        return callmask;
    }

    public void setCallmask(String callmask) {
        this.callmask = callmask;
    }

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    public String getLoginType() {
        return loginType;
    }

    public void setLoginType(String loginType) {
        this.loginType = loginType;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public String getSoftdel() {
        return softdel;
    }

    public void setSoftdel(String softdel) {
        this.softdel = softdel;
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

    public String getLastCron() {
        return lastCron;
    }

    public void setLastCron(String lastCron) {
        this.lastCron = lastCron;
    }

    public String getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(String lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public String getLastOut() {
        return lastOut;
    }

    public void setLastOut(String lastOut) {
        this.lastOut = lastOut;
    }

    public String getLastIn() {
        return lastIn;
    }

    public void setLastIn(String lastIn) {
        this.lastIn = lastIn;
    }

    public String getFcmId() {
        return fcmId;
    }

    public void setFcmId(String fcmId) {
        this.fcmId = fcmId;
    }

    public Boolean getIsConnected() {
        return isConnected;
    }

    public void setIsConnected(Boolean isConnected) {
        this.isConnected = isConnected;
    }

    public String getCurTrip() {
        return curTrip;
    }

    public void setCurTrip(String curTrip) {
        this.curTrip = curTrip;
    }

    public TodayAmt getTodayAmt() {
        return todayAmt;
    }

    public void setTodayAmt(TodayAmt todayAmt) {
        this.todayAmt = todayAmt;
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

    public String getWallet() {
        return wallet;
    }

    public void setWallet(String wallet) {
        this.wallet = wallet;
    }

    public Rating getRating() {
        return rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public List<String> getCoords() {
        return coords;
    }

    public void setCoords(List<String> coords) {
        this.coords = coords;
    }

    public Boolean getOnline() {
        return online;
    }

    public void setOnline(Boolean online) {
        this.online = online;
    }

    public String getSharebooked() {
        return sharebooked;
    }

    public void setSharebooked(String sharebooked) {
        this.sharebooked = sharebooked;
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

    public String getCurVehicleNo() {
        return curVehicleNo;
    }

    public void setCurVehicleNo(String curVehicleNo) {
        this.curVehicleNo = curVehicleNo;
    }

    public String getCurStatus() {
        return curStatus;
    }

    public void setCurStatus(String curStatus) {
        this.curStatus = curStatus;
    }

    public String getCurService() {
        return curService;
    }

    public void setCurService(String curService) {
        this.curService = curService;
    }

    public String getServiceStatus() {
        return serviceStatus;
    }

    public void setServiceStatus(String serviceStatus) {
        this.serviceStatus = serviceStatus;
    }

    public String getCurrentTaxi() {
        return currentTaxi;
    }

    public void setCurrentTaxi(String currentTaxi) {
        this.currentTaxi = currentTaxi;
    }

    public String getRevenueexp() {
        return revenueexp;
    }

    public void setRevenueexp(String revenueexp) {
        this.revenueexp = revenueexp;
    }

    public String getRevenue() {
        return revenue;
    }

    public void setRevenue(String revenue) {
        this.revenue = revenue;
    }

    public String getPassingexp() {
        return passingexp;
    }

    public void setPassingexp(String passingexp) {
        this.passingexp = passingexp;
    }

    public String getPassingBackImg() {
        return passingBackImg;
    }

    public void setPassingBackImg(String passingBackImg) {
        this.passingBackImg = passingBackImg;
    }

    public String getPassing() {
        return passing;
    }

    public void setPassing(String passing) {
        this.passing = passing;
    }

    public String getInsuranceexp() {
        return insuranceexp;
    }

    public void setInsuranceexp(String insuranceexp) {
        this.insuranceexp = insuranceexp;
    }

    public String getInsuranceBackImg() {
        return insuranceBackImg;
    }

    public void setInsuranceBackImg(String insuranceBackImg) {
        this.insuranceBackImg = insuranceBackImg;
    }

    public String getInsurance() {
        return insurance;
    }

    public void setInsurance(String insurance) {
        this.insurance = insurance;
    }

    public String getLicenceexp() {
        return licenceexp;
    }

    public void setLicenceexp(String licenceexp) {
        this.licenceexp = licenceexp;
    }

    public String getLicenceNo() {
        return licenceNo;
    }

    public void setLicenceNo(String licenceNo) {
        this.licenceNo = licenceNo;
    }

    public String getLicence() {
        return licence;
    }

    public void setLicence(String licence) {
        this.licence = licence;
    }

    public String getLicenceBackImg() {
        return licenceBackImg;
    }

    public void setLicenceBackImg(String licenceBackImg) {
        this.licenceBackImg = licenceBackImg;
    }

    public String getNationIdback() {
        return nationIdback;
    }

    public void setNationIdback(String nationIdback) {
        this.nationIdback = nationIdback;
    }

    public List<Taxi> getTaxis() {
        return taxis;
    }

    public void setTaxis(List<Taxi> taxis) {
        this.taxis = taxis;
    }

    public List<Status> getStatus() {
        return status;
    }

    public void setStatus(List<Status> status) {
        this.status = status;
    }

    public String getBaseurl() {
        return baseurl;
    }

    public void setBaseurl(String baseurl) {
        this.baseurl = baseurl;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getCur() {
        return cur;
    }

    public void setCur(String cur) {
        this.cur = cur;
    }

    public Boolean getIsHail() {
        return isHail;
    }

    public void setIsHail(Boolean isHail) {
        this.isHail = isHail;
    }

    public Boolean getIsIndividual() {
        return isIndividual;
    }

    public Boolean getTwoDriver() {
        return isTwoDriver;
    }

    public void setTwoDriver(Boolean twoDriver) {
        isTwoDriver = twoDriver;
    }

    public void setIsIndividual(Boolean isIndividual) {
        this.isIndividual = isIndividual;
    }

    public String getCmpy() {
        return cmpy;
    }

    public void setCmpy(String cmpy) {
        this.cmpy = cmpy;
    }

    public String getPhcode() {
        return phcode;
    }

    public void setPhcode(String phcode) {
        this.phcode = phcode;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
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


    public List<Document> getDocument() {
        return document;
    }

    public void setDocument(List<Document> document) {
        this.document = document;
    }
    public CurrentActiveTaxi getCurrentActiveTaxi() {
        return currentActiveTaxi;
    }

    public void setCurrentActiveTaxi(CurrentActiveTaxi currentActiveTaxi) {
        this.currentActiveTaxi = currentActiveTaxi;
    }






    public Boolean getIsDriverCreditModuleEnabledForUseAfterLogin() {
        return isDriverCreditModuleEnabledForUseAfterLogin;
    }

    public void setIsDriverCreditModuleEnabledForUseAfterLogin(Boolean isDriverCreditModuleEnabledForUseAfterLogin) {
        this.isDriverCreditModuleEnabledForUseAfterLogin = isDriverCreditModuleEnabledForUseAfterLogin;
    }

    public class Document {

        @SerializedName("docFrontImg")
        @Expose
        private String docFrontImg;
        @SerializedName("docBackImg")
        @Expose
        private String docBackImg;
        @SerializedName("docExp")
        @Expose
        private String docExp;
        @SerializedName("docName")
        @Expose
        private String docName;
        @SerializedName("fileFor")
        @Expose
        private String fileFor;
        @SerializedName("_id")
        @Expose
        private String id;

        public String getDocFrontImg() {
            return docFrontImg;
        }

        public void setDocFrontImg(String docFrontImg) {
            this.docFrontImg = docFrontImg;
        }

        public String getDocBackImg() {
            return docBackImg;
        }

        public void setDocBackImg(String docBackImg) {
            this.docBackImg = docBackImg;
        }

        public String getDocExp() {
            return docExp;
        }

        public void setDocExp(String docExp) {
            this.docExp = docExp;
        }

        public String getDocName() {
            return docName;
        }

        public void setDocName(String docName) {
            this.docName = docName;
        }

        public String getFileFor() {
            return fileFor;
        }

        public void setFileFor(String fileFor) {
            this.fileFor = fileFor;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

    }
    public class Rating {

        @SerializedName("cmts")
        @Expose
        private String cmts;
        @SerializedName("star")
        @Expose
        private String star;
        @SerializedName("tottrip")
        @Expose
        private String tottrip;
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

        public String getStar() {
            return star;
        }

        public void setStar(String star) {
            this.star = star;
        }

        public String getTottrip() {
            return tottrip;
        }

        public void setTottrip(String tottrip) {
            this.tottrip = tottrip;
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

    public class Status {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("canoperate")
        @Expose
        private String canoperate;
        @SerializedName("docs")
        @Expose
        private String docs;
        @SerializedName("models")
        @Expose
        private String models;
        @SerializedName("curstatus")
        @Expose
        private String curstatus;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getCanoperate() {
            return canoperate;
        }

        public void setCanoperate(String canoperate) {
            this.canoperate = canoperate;
        }

        public String getDocs() {
            return docs;
        }

        public void setDocs(String docs) {
            this.docs = docs;
        }

        public String getModels() {
            return models;
        }

        public void setModels(String models) {
            this.models = models;
        }

        public String getCurstatus() {
            return curstatus;
        }

        public void setCurstatus(String curstatus) {
            this.curstatus = curstatus;
        }

    }
    public class Taxi {

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
        @SerializedName("isOutstation")
        @Expose
        private Boolean isOutstation;
        @SerializedName("isRental")
        @Expose
        private Boolean isRental;
        @SerializedName("isDaily")
        @Expose
        private Boolean isDaily;
        @SerializedName("imageBack")
        @Expose
        private String imageBack;
        @SerializedName("image")
        @Expose
        private String image;
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
        @SerializedName("others1")
        @Expose
        private String others1;
        @SerializedName("vin_number")
        @Expose
        private String vinNumber;
        @SerializedName("chaisis")
        @Expose
        private String chaisis;
        @SerializedName("registrationnumber")
        @Expose
        private String registrationnumber;
        @SerializedName("registrationexpdate")
        @Expose
        private String registrationexpdate;
        @SerializedName("registrationBack")
        @Expose
        private String registrationBack;
        @SerializedName("registration")
        @Expose
        private String registration;
        @SerializedName("permitexpdate")
        @Expose
        private String permitexpdate;
        @SerializedName("permit")
        @Expose
        private String permit;
        @SerializedName("insurancenumber")
        @Expose
        private String insurancenumber;
        @SerializedName("insuranceexpdate")
        @Expose
        private String insuranceexpdate;
        @SerializedName("insurance")
        @Expose
        private String insurance;

        @SerializedName("handicap")
        @Expose
        private String handicap;
        @SerializedName("ownername")
        @Expose
        private String ownername;

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

        public Boolean getIsOutstation() {
            return isOutstation;
        }

        public void setIsOutstation(Boolean isOutstation) {
            this.isOutstation = isOutstation;
        }

        public Boolean getIsRental() {
            return isRental;
        }

        public void setIsRental(Boolean isRental) {
            this.isRental = isRental;
        }

        public Boolean getIsDaily() {
            return isDaily;
        }

        public void setIsDaily(Boolean isDaily) {
            this.isDaily = isDaily;
        }

        public String getImageBack() {
            return imageBack;
        }

        public void setImageBack(String imageBack) {
            this.imageBack = imageBack;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
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

        public String getOthers1() {
            return others1;
        }

        public void setOthers1(String others1) {
            this.others1 = others1;
        }

        public String getVinNumber() {
            return vinNumber;
        }

        public void setVinNumber(String vinNumber) {
            this.vinNumber = vinNumber;
        }

        public String getChaisis() {
            return chaisis;
        }

        public void setChaisis(String chaisis) {
            this.chaisis = chaisis;
        }

        public String getRegistrationnumber() {
            return registrationnumber;
        }

        public void setRegistrationnumber(String registrationnumber) {
            this.registrationnumber = registrationnumber;
        }

        public String getRegistrationexpdate() {
            return registrationexpdate;
        }

        public void setRegistrationexpdate(String registrationexpdate) {
            this.registrationexpdate = registrationexpdate;
        }

        public String getRegistrationBack() {
            return registrationBack;
        }

        public void setRegistrationBack(String registrationBack) {
            this.registrationBack = registrationBack;
        }

        public String getRegistration() {
            return registration;
        }

        public void setRegistration(String registration) {
            this.registration = registration;
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

        public String getInsurancenumber() {
            return insurancenumber;
        }

        public void setInsurancenumber(String insurancenumber) {
            this.insurancenumber = insurancenumber;
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


        public String getHandicap() {
            return handicap;
        }

        public void setHandicap(String handicap) {
            this.handicap = handicap;
        }

        public String getOwnername() {
            return ownername;
        }

        public void setOwnername(String ownername) {
            this.ownername = ownername;
        }

    }

    public class TodayAmt {

        @SerializedName("amt")
        @Expose
        private String amt;
        @SerializedName("trips")
        @Expose
        private String trips;
        @SerializedName("lastdate")
        @Expose
        private String lastdate;

        public String getAmt() {
            return amt;
        }

        public void setAmt(String amt) {
            this.amt = amt;
        }

        public String getTrips() {
            return trips;
        }

        public void setTrips(String trips) {
            this.trips = trips;
        }

        public String getLastdate() {
            return lastdate;
        }

        public void setLastdate(String lastdate) {
            this.lastdate = lastdate;
        }

    }

    public class Card {

        @SerializedName("last4")
        @Expose
        private String last4 ="";
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
