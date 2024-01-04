package com.bismillah.driver.Model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class RemoveCardModel {

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

    public class Doc {

        @SerializedName("_id")
        @Expose
        private String id;
        @SerializedName("hash")
        @Expose
        private String hash;
        @SerializedName("salt")
        @Expose
        private String salt;
        @SerializedName("code")
        @Expose
        private String code;
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
        @SerializedName("actMail")
        @Expose
        private String actMail;
        @SerializedName("actHolder")
        @Expose
        private String actHolder;
        @SerializedName("actNo")
        @Expose
        private String actNo;
        @SerializedName("actBank")
        @Expose
        private String actBank;
        @SerializedName("actLoc")
        @Expose
        private String actLoc;
        @SerializedName("actCode")
        @Expose
        private String actCode;
        @SerializedName("__v")
        @Expose
        private String v;
        @SerializedName("queueTime")
        @Expose
        private String queueTime;
        @SerializedName("address")
        @Expose
        private String address;
        @SerializedName("totTimeInZone")
        @Expose
        private String totTimeInZone;
        @SerializedName("queueId")
        @Expose
        private Object queueId;
        @SerializedName("airportZone")
        @Expose
        private Object airportZone;
        @SerializedName("bgCheckStatus")
        @Expose
        private String bgCheckStatus;
        @SerializedName("bgCheckType")
        @Expose
        private String bgCheckType;
        @SerializedName("bgReportId")
        @Expose
        private String bgReportId;
        @SerializedName("bgCheckId")
        @Expose
        private String bgCheckId;
        @SerializedName("bgCheck")
        @Expose
        private String bgCheck;
        @SerializedName("ssn")
        @Expose
        private String ssn;
        @SerializedName("zipcode")
        @Expose
        private String zipcode;
        @SerializedName("licenseState")
        @Expose
        private String licenseState;
        @SerializedName("card")
        @Expose
        private Card card;
        @SerializedName("providerId")
        @Expose
        private Object providerId;
        @SerializedName("isDriverAllowedOtherStates")
        @Expose
        private Boolean isDriverAllowedOtherStates;
        @SerializedName("referalInviteApproval")
        @Expose
        private Boolean referalInviteApproval;
        @SerializedName("referrealRecharge")
        @Expose
        private Boolean referrealRecharge;
        @SerializedName("tripCount")
        @Expose
        private String tripCount;
        @SerializedName("referredCode")
        @Expose
        private String referredCode;
        @SerializedName("referal")
        @Expose
        private String referal;
        @SerializedName("referenceCode")
        @Expose
        private String referenceCode;
        @SerializedName("subscriptionPackPurchaseId")
        @Expose
        private String subscriptionPackPurchaseId;
        @SerializedName("subscriptionPackName")
        @Expose
        private String subscriptionPackName;
        @SerializedName("subscriptionPackId")
        @Expose
        private String subscriptionPackId;
        @SerializedName("isSubcriptionActive")
        @Expose
        private Boolean isSubcriptionActive;
        @SerializedName("subcriptionEndDate")
        @Expose
        private String subcriptionEndDate;
        @SerializedName("blockuptoDate")
        @Expose
        private Object blockuptoDate;
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
        private Object scity;
        @SerializedName("scId")
        @Expose
        private Object scId;
        @SerializedName("lastCron")
        @Expose
        private String lastCron;
        @SerializedName("lastUpdate")
        @Expose
        private String lastUpdate;
        @SerializedName("last_out")
        @Expose
        private Object lastOut;
        @SerializedName("last_in")
        @Expose
        private String lastIn;
        @SerializedName("fcmId")
        @Expose
        private String fcmId;
        @SerializedName("connectURL")
        @Expose
        private String connectURL;
        @SerializedName("isConnected")
        @Expose
        private Boolean isConnected;
        @SerializedName("curTrip")
        @Expose
        private String curTrip;

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
        @SerializedName("driverLocation")
        @Expose
        private DriverLocation driverLocation;
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
        private Object revenueexp;
        @SerializedName("revenue")
        @Expose
        private String revenue;
        @SerializedName("passingexp")
        @Expose
        private Object passingexp;
        @SerializedName("passing")
        @Expose
        private String passing;
        @SerializedName("insuranceexp")
        @Expose
        private Object insuranceexp;
        @SerializedName("insurance")
        @Expose
        private String insurance;
        @SerializedName("licenceexp")
        @Expose
        private Object licenceexp;
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
        @SerializedName("baseurl")
        @Expose
        private String baseurl;
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
        @SerializedName("cmpy")
        @Expose
        private String cmpy;
        @SerializedName("DOB")
        @Expose
        private String dOB;
        @SerializedName("phcode")
        @Expose
        private String phcode;
        @SerializedName("nic")
        @Expose
        private String nic;
        @SerializedName("createdAt")
        @Expose
        private String createdAt;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getHash() {
            return hash;
        }

        public void setHash(String hash) {
            this.hash = hash;
        }

        public String getSalt() {
            return salt;
        }

        public void setSalt(String salt) {
            this.salt = salt;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
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

        public String getActMail() {
            return actMail;
        }

        public void setActMail(String actMail) {
            this.actMail = actMail;
        }

        public String getActHolder() {
            return actHolder;
        }

        public void setActHolder(String actHolder) {
            this.actHolder = actHolder;
        }

        public String getActNo() {
            return actNo;
        }

        public void setActNo(String actNo) {
            this.actNo = actNo;
        }

        public String getActBank() {
            return actBank;
        }

        public void setActBank(String actBank) {
            this.actBank = actBank;
        }

        public String getActLoc() {
            return actLoc;
        }

        public void setActLoc(String actLoc) {
            this.actLoc = actLoc;
        }

        public String getActCode() {
            return actCode;
        }

        public void setActCode(String actCode) {
            this.actCode = actCode;
        }

        public String getV() {
            return v;
        }

        public void setV(String v) {
            this.v = v;
        }

        public String getQueueTime() {
            return queueTime;
        }

        public void setQueueTime(String queueTime) {
            this.queueTime = queueTime;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getTotTimeInZone() {
            return totTimeInZone;
        }

        public void setTotTimeInZone(String totTimeInZone) {
            this.totTimeInZone = totTimeInZone;
        }

        public Object getQueueId() {
            return queueId;
        }

        public void setQueueId(Object queueId) {
            this.queueId = queueId;
        }

        public Object getAirportZone() {
            return airportZone;
        }

        public void setAirportZone(Object airportZone) {
            this.airportZone = airportZone;
        }

        public String getBgCheckStatus() {
            return bgCheckStatus;
        }

        public void setBgCheckStatus(String bgCheckStatus) {
            this.bgCheckStatus = bgCheckStatus;
        }

        public String getBgCheckType() {
            return bgCheckType;
        }

        public void setBgCheckType(String bgCheckType) {
            this.bgCheckType = bgCheckType;
        }

        public String getBgReportId() {
            return bgReportId;
        }

        public void setBgReportId(String bgReportId) {
            this.bgReportId = bgReportId;
        }

        public String getBgCheckId() {
            return bgCheckId;
        }

        public void setBgCheckId(String bgCheckId) {
            this.bgCheckId = bgCheckId;
        }

        public String getBgCheck() {
            return bgCheck;
        }

        public void setBgCheck(String bgCheck) {
            this.bgCheck = bgCheck;
        }

        public String getSsn() {
            return ssn;
        }

        public void setSsn(String ssn) {
            this.ssn = ssn;
        }

        public String getZipcode() {
            return zipcode;
        }

        public void setZipcode(String zipcode) {
            this.zipcode = zipcode;
        }

        public String getLicenseState() {
            return licenseState;
        }

        public void setLicenseState(String licenseState) {
            this.licenseState = licenseState;
        }

        public Card getCard() {
            return card;
        }

        public void setCard(Card card) {
            this.card = card;
        }

        public Object getProviderId() {
            return providerId;
        }

        public void setProviderId(Object providerId) {
            this.providerId = providerId;
        }

        public Boolean getIsDriverAllowedOtherStates() {
            return isDriverAllowedOtherStates;
        }

        public void setIsDriverAllowedOtherStates(Boolean isDriverAllowedOtherStates) {
            this.isDriverAllowedOtherStates = isDriverAllowedOtherStates;
        }

        public Boolean getReferalInviteApproval() {
            return referalInviteApproval;
        }

        public void setReferalInviteApproval(Boolean referalInviteApproval) {
            this.referalInviteApproval = referalInviteApproval;
        }

        public Boolean getReferrealRecharge() {
            return referrealRecharge;
        }

        public void setReferrealRecharge(Boolean referrealRecharge) {
            this.referrealRecharge = referrealRecharge;
        }

        public String getTripCount() {
            return tripCount;
        }

        public void setTripCount(String tripCount) {
            this.tripCount = tripCount;
        }

        public String getReferredCode() {
            return referredCode;
        }

        public void setReferredCode(String referredCode) {
            this.referredCode = referredCode;
        }

        public String getReferal() {
            return referal;
        }

        public void setReferal(String referal) {
            this.referal = referal;
        }

        public String getReferenceCode() {
            return referenceCode;
        }

        public void setReferenceCode(String referenceCode) {
            this.referenceCode = referenceCode;
        }

        public String getSubscriptionPackPurchaseId() {
            return subscriptionPackPurchaseId;
        }

        public void setSubscriptionPackPurchaseId(String subscriptionPackPurchaseId) {
            this.subscriptionPackPurchaseId = subscriptionPackPurchaseId;
        }

        public String getSubscriptionPackName() {
            return subscriptionPackName;
        }

        public void setSubscriptionPackName(String subscriptionPackName) {
            this.subscriptionPackName = subscriptionPackName;
        }

        public String getSubscriptionPackId() {
            return subscriptionPackId;
        }

        public void setSubscriptionPackId(String subscriptionPackId) {
            this.subscriptionPackId = subscriptionPackId;
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

        public Object getBlockuptoDate() {
            return blockuptoDate;
        }

        public void setBlockuptoDate(Object blockuptoDate) {
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

        public Object getScity() {
            return scity;
        }

        public void setScity(Object scity) {
            this.scity = scity;
        }

        public Object getScId() {
            return scId;
        }

        public void setScId(Object scId) {
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

        public Object getLastOut() {
            return lastOut;
        }

        public void setLastOut(Object lastOut) {
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

        public String getConnectURL() {
            return connectURL;
        }

        public void setConnectURL(String connectURL) {
            this.connectURL = connectURL;
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

        public DriverLocation getDriverLocation() {
            return driverLocation;
        }

        public void setDriverLocation(DriverLocation driverLocation) {
            this.driverLocation = driverLocation;
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

        public Object getRevenueexp() {
            return revenueexp;
        }

        public void setRevenueexp(Object revenueexp) {
            this.revenueexp = revenueexp;
        }

        public String getRevenue() {
            return revenue;
        }

        public void setRevenue(String revenue) {
            this.revenue = revenue;
        }

        public Object getPassingexp() {
            return passingexp;
        }

        public void setPassingexp(Object passingexp) {
            this.passingexp = passingexp;
        }

        public String getPassing() {
            return passing;
        }

        public void setPassing(String passing) {
            this.passing = passing;
        }

        public Object getInsuranceexp() {
            return insuranceexp;
        }

        public void setInsuranceexp(Object insuranceexp) {
            this.insuranceexp = insuranceexp;
        }

        public String getInsurance() {
            return insurance;
        }

        public void setInsurance(String insurance) {
            this.insurance = insurance;
        }

        public Object getLicenceexp() {
            return licenceexp;
        }

        public void setLicenceexp(Object licenceexp) {
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

        public void setIsIndividual(Boolean isIndividual) {
            this.isIndividual = isIndividual;
        }

        public String getCmpy() {
            return cmpy;
        }

        public void setCmpy(String cmpy) {
            this.cmpy = cmpy;
        }

        public String getDOB() {
            return dOB;
        }

        public void setDOB(String dOB) {
            this.dOB = dOB;
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

    }

    public class DriverLocation {

        @SerializedName("coordinates")
        @Expose
        private List<String> coordinates = null;
        @SerializedName("type")
        @Expose
        private String type;

        public List<String> getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(List<String> coordinates) {
            this.coordinates = coordinates;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

    }

    @SerializedName("success")
    @Expose
    private Boolean success;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("doc")
    @Expose
    private Doc doc;

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

    public Doc getDoc() {
        return doc;
    }

    public void setDoc(Doc doc) {
        this.doc = doc;
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
        private Object registrationexpdate;
        @SerializedName("registrationBack")
        @Expose
        private String registrationBack;
        @SerializedName("registration")
        @Expose
        private String registration;
        @SerializedName("permitexpdate")
        @Expose
        private Object permitexpdate;
        @SerializedName("permit")
        @Expose
        private String permit;
        @SerializedName("insurancenumber")
        @Expose
        private String insurancenumber;
        @SerializedName("insuranceexpdate")
        @Expose
        private Object insuranceexpdate;
        @SerializedName("insurance")
        @Expose
        private String insurance;
        @SerializedName("type")
        @Expose
        private List<Object> type = null;
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

        public Object getRegistrationexpdate() {
            return registrationexpdate;
        }

        public void setRegistrationexpdate(Object registrationexpdate) {
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

        public Object getPermitexpdate() {
            return permitexpdate;
        }

        public void setPermitexpdate(Object permitexpdate) {
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

        public Object getInsuranceexpdate() {
            return insuranceexpdate;
        }

        public void setInsuranceexpdate(Object insuranceexpdate) {
            this.insuranceexpdate = insuranceexpdate;
        }

        public String getInsurance() {
            return insurance;
        }

        public void setInsurance(String insurance) {
            this.insurance = insurance;
        }

        public List<Object> getType() {
            return type;
        }

        public void setType(List<Object> type) {
            this.type = type;
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
}
