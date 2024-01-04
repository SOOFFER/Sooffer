import mongoose from "mongoose";
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var config = require("../config");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const moment = require("moment");

function getDateTimeForUserLable(
  dateTime,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) {
  if (!dateTime) return null;
  var result = moment(dateTime, timeformat).format("YYYY-MM-DD");
  return result;
}

var DriverTaxiSchema = new mongoose.Schema(
  {
    ownername: { type: String, default: "" }, // only one for a individual vehicle (ALPHANUMERIC), no image needed
    makeid: String,
    makename: String,
    model: String,
    year: String,
    licence: String,
    cpy: String,
    driver: String,
    color: String,
    handicap: { type: String, default: "false" },
    document: [
      {
        docFrontImg: { type: String, default: "" },
        docBackImg: { type: String, default: "" },
        docExp: { type: Date, default: null },
        docName: { type: String, default: "" },
        fileFor: { type: String, default: "" },
      },
    ],

    type: [
      /*  {
     basic: { type: String, default: "false" },
     normal: { type: String, default: "false" },
     luxury: { type: String, default: "false" }
     } */
    ],
    insurance: { type: String, default: "" },
    insuranceexpdate: { type: Date, default: null },
    insurancenumber: { type: String, default: "" },
    permit: { type: String, default: "" },
    permitexpdate: { type: Date, default: null },
    registration: { type: String, default: "" }, // Image, RC No.
    registrationBack: { type: String, default: "" },
    registrationexpdate: { type: Date, default: null }, // Image, RC No.
    registrationnumber: { type: String, default: "" }, // Image, RC No.
    chaisis: { type: String, default: "" }, // (chassis number is the last six digits of your car’s Vehicle Identification Numbers VIN)
    vin_number: { type: String, default: "" }, // only one for a individual vehicle (ALPHANUMERIC), no image needed
    others1: { type: String, default: "" },
    vehicletype: { type: String, default: "vehicletype" },
    share: { type: Boolean, default: false }, //is share available
    noofshare: { type: Number, default: 0 },
    taxistatus: { type: String, default: "inactive" },
    image: { type: String, default: "" },
    imageBack: { type: String, default: "" },
    imageLeft: { type: String, default: "" },
    imageRight: { type: String, default: "" },
    interiorFront: { type: String, default: "" },
    interiorBack: { type: String, default: "" },
    imageFront: { type: String, default: "" },
    imageBack: { type: String, default: "" },
    imageRight: { type: String, default: "" },
    imageLeft: { type: String, default: "" },
    // features: [{
    //   lable: { type: String, default: "" },
    //   status: { type: Boolean, default: false}
    // }],
    // features: { type: Object },

    isDaily: { type: Boolean, default: true },
    isRental: { type: Boolean, default: false },
    isOutstation: { type: Boolean, default: false },
    isMini: { type: Boolean, default: false },
    lowCategoryOptions: { type: [String], default: [] },
    subcriptionEndDate: { type: Date, default: null },
    isSubcriptionActive: { type: Boolean, default: false },
    currentSubId: { type: ObjectId, ref: "driverSubscription", default: null },
  },
  {
    toObject: {
      transform: function (doc, ret) {
        ret.insuranceexpdate = getDateTimeForUserLable(ret.insuranceexpdate);
        ret.permitexpdate = getDateTimeForUserLable(ret.permitexpdate);
        ret.registrationexpdate = getDateTimeForUserLable(
          ret.registrationexpdate
        );
      },
    },
    toJSON: {
      transform: function (doc, ret) {
        ret.insuranceexpdate = getDateTimeForUserLable(ret.insuranceexpdate);
        ret.permitexpdate = getDateTimeForUserLable(ret.permitexpdate);
        ret.registrationexpdate = getDateTimeForUserLable(
          ret.registrationexpdate
        );
      },
    },
  },
  { usePushEach: true }
);

var DriverSchema = mongoose.Schema(
  {
    createdAt: { type: Date, default: Date.now },
    code: { type: String, unique: true },
    nic: { type: String, default: "" },
    fname: String,
    lname: String,
    email: { type: String, trim: true },
    phcode: { type: String, default: config.phoneCode },
    phone: { type: String, unique: true, required: true },
    alternatePhnNo: { type: String },
    gender: String,
    hash: String,
    salt: String,
    DOB: { type: Date, default: null },
    cnty: String,
    cntyname: String,
    state: String,
    statename: String,
    city: String,
    cityname: String,
    cmpy: { type: ObjectId, ref: "companydetails", default: null },
    isIndividual: { type: Boolean, default: true },
    isTwoDriver: { type: Boolean, default: false },
    document: [
      {
        docFrontImg: { type: String, default: "" },
        docBackImg: { type: String, default: "" },
        docExp: { type: Date, default: null },
        docName: { type: String, default: "" },
        fileFor: { type: String, default: "" },
      },
    ],

    // isDaily: { type: Boolean, default: true },
    // isRental: { type: Boolean, default: false },
    // isOutstation: { type: Boolean, default: false },
    isHail: { type: Boolean, default: false },
    lang: { type: String, default: "en" },
    cur: {
      type: String,
      default: config.paymentGateway.paymentGatewayCurrency,
    },
    actMail: String,
    actHolder: String,
    actNo: String,
    actBank: String,
    actLoc: String,
    actCode: String,
    profile: { type: String, default: "public/file-default.png" },
    baseurl: { type: String, default: config.baseurl },
    address: { type: String, default: "" },
    status: [
      {
        curstatus: { type: String, default: "active" },
        models: { type: String, default: "no" },
        docs: { type: String, default: "pending" },
        canoperate: { type: String, default: "no" },
      },
    ],
    card: {
      id: { type: String, default: "" },
      currency: { type: String, default: "" },
      last4: { type: String, default: "" },
    },
    // status: {
    //   curstatus  : { type: String, default : "active" },
    //   models     : { type: String, default : "no" } ,
    //   docs       : { type: String, default : "pending" },//Accepted or pending
    //   canoperate : { type: String, default : "no" },
    // },
    taxis: [DriverTaxiSchema],
    nationIdback: { type: String, default: "" },
    licenceBackImg: { type: String, default: "" },
    licence: { type: String, default: "" },
    licenceNo: { type: String, default: "" },
    licenceexp: { type: Date, default: null },
    insurance: { type: String, default: "" },
    insuranceBackImg: { type: String, default: "" },
    insuranceexp: { type: Date, default: null },
    passing: { type: String, default: "" },
    passingBackImg: { type: String, default: "" },
    passingexp: { type: Date, default: null },
    revenue: { type: String, default: "" },
    revenueexp: { type: Date, default: null },
    badgeNo: { type: String, default: "" },
    panCard: { type: String, default: "" },
    aadhaar: { type: String, default: "" },
    aadhaarNo: { type: String, default: "" },
    serviceStatus: { type: String, default: "inactive" },
    curService: { type: String, default: "" },
    currentTaxi: { type: String, default: "" },
    curStatus: { type: String, default: "free" }, // OBO => If Request Recived (requested),
    curVehicleNo: { type: String, default: "" },
    others1: { type: String, default: "" },
    vin_number: { type: String, default: "" }, //vehicleidentificationno
    share: { type: Boolean, default: false }, //is share available
    noofshare: { type: Number, default: 0 },
    sharebooked: { type: Number, default: 0 }, //occupied share
    online: { type: Boolean, default: 0 },
    coords: { type: [Number], index: "2dsphere", default: [0, 0] },
    rating: {
      rating: { type: String, default: "0" },
      nos: { type: Number, default: 0 }, //Rated trips
      tottrip: { type: Number, default: 0 }, //Total trips
      star: { type: Number, default: 0 }, //Five Star trips
      cmts: { type: String, default: "" },
    },
    wallet: { type: Number, default: 0 },
    canceledCount: { type: Number, default: 0 }, //No of times cancelled Trip for Current Date
    lastCanceledDate: { type: String, default: "" }, //Last Time Canceled Date = DD-MM-YYYY
    todayAmt: {
      lastdate: { type: String, default: null },
      trips: { type: Number, default: 0 },
      amt: { type: Number, default: 0 },
    },
    driverLocation: {
      type: { type: String, required: true, enum: "Point", default: "Point" },
      coordinates: { type: [Number], required: true, default: [0, 0] },
    },
    curTrip: { type: String, default: "" },
    isConnected: { type: Boolean, default: false }, //Stripe connect account added TODO direct pay enabled
    fcmId: { type: String, default: "" },
    last_in: { type: Date, default: null },
    last_out: { type: Date, default: null },
    lastUpdate: { type: Date, default: null }, //last updated time of Location
    lastCron: { type: Date, default: null }, //offline by admin, at this time
    scId: { type: ObjectId, ref: "serviceavailablecities", default: null }, //depends on city
    scity: { type: String, default: null },
    softdel: { type: String, default: "active" },
    verificationCode: { type: String, default: "" },
    loginType: { type: String, default: "normal" },
    loginId: { type: String, default: "" },
    // googleLoginId: { type: String, default: "" },
    // appleLoginId: { type: String, default: "" },
    callmask: { type: String, default: "" },
    blockuptoDate: { type: Date, default: null }, //Blocked upto Canceled Date = DD-MM-YYYY
    subcriptionEndDate: { type: Date, default: null },
    isSubcriptionActive: { type: Boolean, default: false },
    currentSubId: { type: ObjectId, ref: "driverSubscription", default: null },
    referenceCode: { type: String, default: "" },
    isDaily: { type: Boolean, default: true },
    isRental: { type: Boolean, default: false },
    isOutstation: { type: Boolean, default: false },
    referal: { type: String, default: "" },
    walletType: { type: String, default: "prepaid" },
    // walletLimit: { type: Number, default: 0 },
    isMini: { type: Boolean, default: false },
    airportZone: { type: ObjectId, ref: "airportZones", default: null },
    queueId: { type: ObjectId, ref: "airportZones", default: null },
    queueTime: Date,
    currentCategoryOptions: [],
    isLogin: { type: Boolean, default: true },
    offlineByCron: { type: String, default: false },
    mobileDetails: { type: String, default: "" },
    currencyCode: { type: String, default: config.currency },
    currencySymbol: { type: String, default: config.currencySymbol },
    softReject: { type: Boolean, default: false },
    softRejectReason: { type: String, default: "" },
    lastDocsUpdated: { type: Date, default: null },
    isCardPaymentAcceptable: { type: Boolean, default: false },
    isPayPhoneAcceptable: { type: Boolean, defult: false },
    countryCode: { type: String, default: ""},
  },
  {
    toObject: {
      transform: function (doc, ret) {
        ret.licenceexp = getDateTimeForUserLable(ret.licenceexp);
        ret.insuranceexp = getDateTimeForUserLable(ret.insuranceexp);
        ret.passingexp = getDateTimeForUserLable(ret.passingexp);
      },
    },
    toJSON: {
      transform: function (doc, ret) {
        ret.licenceexp = getDateTimeForUserLable(ret.licenceexp);
        ret.insuranceexp = getDateTimeForUserLable(ret.insuranceexp);
        ret.passingexp = getDateTimeForUserLable(ret.passingexp);
      },
    },
  }
  //V2 DEMO
  // ,
  // {
  //   toObject: {
  //     transform: function (doc, ret) {
  //       ret.phone = GFunctions.hidePhoneDataForDemo(ret.phone);
  //       ret.email = GFunctions.hideEmailDataForDemo(ret.email);
  //     }
  //   },
  //   toJSON: {
  //     transform: function (doc, ret) {
  //       ret.email = GFunctions.hideEmailDataForDemo(ret.email);
  //       ret.phone = GFunctions.hidePhoneDataForDemo(ret.phone);
  //     }
  //   }
  // }
  //V2 DEMO
);

// DriverSchema.index({ location: "2dsphere" });
DriverSchema.methods.setPassword = function (password = "abservetech") {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

DriverSchema.methods.validPassword = function (
  password = "abservetech",
  salt,
  hashval
) {
  var hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hashval === hash;
};

DriverSchema.methods.generateJwt = function (
  _id,
  email,
  name,
  type = "driver"
) {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // 7 days
  return jwt.sign(
    {
      id: _id,
      email: email,
      name: name,
      type: type,
    },
    config.secret
  );
};

DriverSchema.methods.getPassword = function (password = "abservetech") {
  const obj = {};
  obj.salt = crypto.randomBytes(16).toString("hex");
  obj.hash = crypto
    .pbkdf2Sync(password, obj.salt, 1000, 64, "sha512")
    .toString("hex");
  return obj;
};

DriverSchema.methods.setReferal = function (code = "abservetech") {
  this.referal = crypto.randomBytes(5).toString("hex");
};

var Driver = mongoose.model("drivers", DriverSchema);
module.exports = Driver;
