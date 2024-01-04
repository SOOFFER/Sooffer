import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const autoIncrement = require("mongoose-ai");
autoIncrement.initialize(mongoose);
const featuresSettings = require("../featuresSettings");
const config = require("../config");

var TripsSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  tripno: { type: String },
  tripCode: { type: String, unique: true },
  //tripno :String,
  safeRideData: {
    safeRidestatus: { type: String },
    safeRideTripstatus: { type: String },
    safeRidevehicle: {
      model: String,
      number: String,
      makename: String,
      vehiclecolor: String,
    },
    secondDrivers: [
      new Schema({
        driverId: {
          type: ObjectId,
          ref: "drivers",
          unique: true,
          required: true,
        },
        status: { type: String, default: "0" }, ///Trip Request Status
        pickup: { type: [Number], default: [] }, // second Driver pickup address
      }),
    ],
    imageArray: { type: Array },
  },
  requestFrom: {
    type: String,
    enum: ["app", "admin", "hotel", "web"],
    default: "app",
  },
  requestId: { type: String, default: "" },
  triptype: { type: String, default: "daily" }, //{ daily/rental/outstation/return }
  bookingType: { type: String, default: "rideNow" }, //{ rideNow/rideLater(schedule)/safeRide/hailRide }
  bookingFor: { type: String, default: "self" }, //{ self/others }
  notes: { type: String, default: "" },
  other: {
    ph: { type: String },
    phCode: { type: String },
    name: { type: String },
  },
  date: String, //Formated Trip Start date time = D-M-YYYY h:mm a , 19-05-2018 08:00 AM;
  hotelid: { type: ObjectId, ref: "hotels", default: null },
  cpy: String,
  cpyid: { type: ObjectId, ref: "companydetails", default: null },
  dvr: String,
  dvrid: { type: ObjectId, ref: "drivers", default: null },
  rid: String,
  ridid: { type: ObjectId, ref: "riders", default: null },
  fare: { type: String, default: 0 }, //total fare
  vehicle: String, //Taxi name
  service: String, //service Id
  paymentSts: { type: String, default: "pending" }, //Paid,pending
  paymentMode: { type: String, default: "cash" }, //Cash,Digital  cash, card
  paymentGateway: { type: String, default: "stripe" }, //stripe/payPhone
  paymentId: {type:ObjectId,ref: "drivers", default: null},
  noofseats: { type: Number, default: 1 },
  // packageId: { type: ObjectId, ref: 'rentalPackages', default: null },
  // packageName: { type: String, default: '' },
  csp: {
    //Cost split up
    booking: { type: Number, default: 0 }, //Booking Fare
    base: { type: Number, default: 0 }, //Base Fare
    dist: { type: String }, //In meter
    distfare: { type: Number, default: 0 }, //KM fare
    perKmRate: { type: Number, default: 0 }, //per KM rate
    time: { type: String },
    timefare: { type: Number, default: 0 },
    comison: { type: Number, default: 0 },
    hotelcommision: { type: Number, default: 0 }, //commision amount
    promo: { type: String }, //If valid Code else 0
    promoamt: { type: Number, default: 0 },
    minFareAdded: { type: Number, default: 0 },
    minFare: { type: Number, default: 0 },
    travelRate: { type: Number, default: 0 },
    travelFare: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    conveyance: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    taxTDS: { type: Number, default: 0 },
    taxTDSPercentage: { type: Number, default: 0 },
    companyAllowance: { type: Number, default: 0 },
    via: { type: String }, //Cash,Digital  cash, card
    taxPercentage: { type: Number, default: 0 },
    fareBeforeTax: { type: Number, default: 0 },
    driverCancelFee: { type: Number, default: 0 },
    riderCancelFee: { type: Number, default: 0 },
    nightChargeApplied: { type: Boolean },
    isNight: { type: Boolean, default: false },
    isPeak: { type: Boolean, default: false },
    nightPer: { type: Number, default: 0 },
    nightfarePer: { type: Number, default: 0 },
    peakPer: { type: Number, default: 0 },
    surgeReason: { type: String, default: "" },
    surgeAmt: { type: Number, default: 0 },
    packageId: { type: ObjectId, default: null },
    packageName: { type: String, default: "" },
    baseKM: { type: Number, default: 0 },
    extraKM: { type: Number, default: 0 },
    fareForExtraKM: { type: Number, default: 0 },
    baseTime: { type: Number, default: 0 },
    extraTime: { type: Number, default: 0 },
    fareForExtraTime: { type: Number, default: 0 },
    oldBalance: { type: Number, default: 0 }, //Old Bal if exists
  },

  dsp: {
    //details split up from cityLimitCalculation
    distanceKM: String, //Readable value
    estTime: String, //Readable value
    start: String, // pickup address
    end: String, // drop address
    startcoords: { type: [Number] },
    endcoords: { type: [Number] },
    waypoint_one: { type : [Number]},
		waypoint_two: { type : [Number]},
    pickupCity: { type: String },
    startDay: { type: String, default: "" }, //outstation startDay
    returnDay: { type: String, default: "" }, //outstation returnDay
    outstationType: { type: String, default: "" }, //outstationType {round/oneway}
  },

  acsp: {
    //Actual Cost split up
    base: { type: Number, default: 0 }, //Base Fare
    booking: { type: Number, default: 0 }, //Booking Fare
    farewithoutTaxNBookingFee: { type: Number, default: 0 }, //farewithoutTaxNBookingFee
    minFare: { type: Number, default: 0 }, //Base Fare
    minFareAdded: { type: Number, default: 0 },
    dist: String, //In meter
    distfare: { type: Number, default: 0 },
    appDist: { type: Number, default: 0 },
    perKmRate: { type: Number, default: 0 }, //per KM rate
    time: String, //Total trip time
    timefare: { type: Number, default: 0 }, //timeFare if exists
    timeRate: { type: Number, default: 0 }, //timeRate if exists
    waitingRate: { type: Number, default: 0 }, //waitingRate
    waitingCharge: { type: Number, default: 0 }, //waitingCharge
    waitingTime: { type: String }, //waitingCharge
    comisonPercentage: { type: Number, default: 0 }, //Admin Commision percentage
    comison: { type: Number, default: 0 }, //Admin Commision
    hotelcommision: { type: Number, default: 4 },
    promoamt: { type: Number, default: 0 },
    bal: { type: Number, default: 0 }, //bal to pay for this Trip
    detect: { type: Number, default: 0 }, //Promoamt Amount / Any From Admin to Rider as Offers = from Admin //this amount need to pay to driver
    actualcost: { type: Number, default: 0 }, //total amount for this Ride = settle to Driver after Comision
    costBeforeDiscount: { type: Number, default: 0 },
    cost: { type: Number, default: 0 }, //Paid By Rider = Combination of Stipe + Wallet + Cash - Promo
    via: String, //Cash,Digital  cash, card
    conveyanceKM: { type: Number, default: 0 }, //In KM = KM traveled upto Pickup location
    conveyance: { type: Number, default: 0 }, //In conveyance Amount (pickup amt)
    chId: { type: String }, //Charge Id for Digital
    safe: { type: Number, default: 0 },
    oldBalance: { type: Number, default: 0 }, //Old Bal if exists
    fareBeforeTax: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }, //Tax Amount
    taxPercentage: { type: Number, default: 0 }, //tax Percentage
    taxTDS: { type: Number, default: 0 },
    taxTDSPercentage: { type: Number, default: 0 },
    totalFareWithOutOldBal: { type: Number, default: 0 },
    fareAmtBeforeSurge: { type: Number, default: 0 },
    fareType: { type: String }, //flatrate or percentage
    isNight: { type: Boolean, default: false },
    isPeak: { type: Boolean, default: false },
    nightPer: { type: Number, default: 0 },
    nightfarePer: { type: Number, default: 0 },
    peakPer: { type: Number, default: 0 },
    surgeReason: { type: String, default: "" },
    surgeAmt: { type: Number, default: 0 },
    walletdebt: { type: Number, default: 0 },
    carddebt: { type: Number, default: 0 }, //All Digital trans
    outstanding: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    discountName: { type: String, default: "" },
    startMeter: { type: Number, default: 0 }, //package details
    endMeter: { type: Number, default: 0 },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    endFrom: { type: String, default: "app" },
    packageId: { type: ObjectId, default: null },
    packageName: { type: String, default: "" }, //70KM
    baseKM: { type: Number, default: 0 }, //70
    extraKM: { type: Number, default: 0 }, //2
    fareForExtraKM: { type: Number, default: 0 },
    baseTime: { type: Number, default: 0 },
    extraTime: { type: Number, default: 0 },
    fareForExtraTime: { type: Number, default: 0 },
    returnTime: { type: Number, default: 0 },
    returnKM: { type: Number, default: 0 },
    hillKm: { type: Number, default: 0 },
    hillFare: { type: Number, default: 0 },
    tollFee: { type: Number, default: 0 },
    noOfNights: { type: Number, default: 0 },
    nightFare: { type: Number, default: 0 },
    noOfDays: { type: Number, default: 0 },
    dayFare: { type: Number, default: 0 },
    nightRate: { type: Number, default: 0 },
    dayRate: { type: Number, default: 0 },
    gatewayCharge: { type: Number, default: 0 },
    googleCharge: { type: Number, default: 0 },
    arrivedTime: { type: Date, default: null },
    waitingRateBeforeTripStart: { type: Number, default: 0 }, //waitingRate
    waitingChargeBeforeTripStart: { type: Number, default: 0 }, //waitingCharge
    waitingTimeBeforeTripStart: { type: String },
    waitingRateAfterTripStart: { type: Number, default: 0 }, //waitingRate
    waitingChargeAfterTripStart: { type: Number, default: 0 }, //waitingCharge
    waitingTimeAfterTripStart: { type: String },
    zoneFare: { type: Number, default: 0 },
  },

  additionalFee: Array,

  adsp: {
    //Actual details split up
    distanceKM: String, //Readable value
    estTime: String, //Readable value
    start: { type: String }, //Start Time
    end: { type: String }, //End Time
    from: { type: String },
    to: { type: String },
    pLat: { type: Number, default: 0 },
    pLng: { type: Number, default: 0 },
    dLat: { type: Number, default: 0 },
    dLng: { type: Number, default: 0 },
    map: { type: String },
  },

  applyValues: {
    applyNightCharge: {
      type: Boolean,
      default: featuresSettings.applyValues.applyNightCharge,
    },
    applyPeakCharge: {
      type: Boolean,
      default: featuresSettings.applyValues.applyPeakCharge,
    },
    applyWaitingTime: {
      type: Boolean,
      default: featuresSettings.applyValues.applyWaitingTime,
    },
    applyTax: { type: Boolean, default: featuresSettings.applyValues.applyTax },
    applyCommission: {
      type: Boolean,
      default: featuresSettings.applyValues.applyCommission,
    },
    applyPickupCharge: {
      type: Boolean,
      default: featuresSettings.applyValues.applyPickupCharge,
    },
  },

  estTime: String,

  status: { type: String, default: "open" }, // noresponse,Cancelled,Finished,processing,accepted,Progress
  tripOTP: [String], //[Start,End]

  review: { type: String, default: "" },
  // reqDvr: [String], //For BroadCast
  reqDvr: Array, //For One By One
  curReq: [Number], //For One By One

  needClear: { type: String, default: "yes" },
  riderfb: {
    //Feadback from Rider to Driver
    rating: { type: String },
    cmts: { type: String },
  },
  driverfb: {
    //Feadback from Driver to Rider
    rating: { type: String },
    cmts: { type: String },
  },

  tripDT: { type: String, default: "" }, //19-05-2018 08:00 AM
  utc: { type: String, default: "" }, //  GMT+05:30
  tripFDT: { type: Date, default: Date.now }, //Trip Start date time =   2018-05-17T20:00:00+05:30
  gmtTime: { type: String, default: "" }, //Sat, 19 May 2018 02:30:00 GMT
  scId: { type: ObjectId, ref: "serviceavailablecities", default: null },
  scity: { type: String, default: "" },
  isMultiLocation: { type: Boolean, default: false },
  multiLocation: { type: Array, default: [] },
  driverAssignmentType: { type: String, default: "auto-assign" }, //{ manual-assign/auto-assign }
  cancellationReason: { type: String, default: "" },
  countryId: { type: String, default: "" },
  currencySymbol: { type: String, default: config.currencySymbol },
  paymentMethod: { type: String, default: "" }, //stripe/payphone
  cardPaymentSuccess: { type: Boolean, default: false },
});

//Example if GMT-04:00
/* createdAt: "2019-05-21T07:42:11.150Z" = without - 4, actl time at 0.
date: "21-05-2019 03:42 am" = with -4 = Formated
gmtTime: "Tue, 21 May 2019 05:34:00 GMT" = with -4 = Formated to GMT
tripDT: "21-05-2019 03:42 am" = with 4 = Formated(same as date)
tripFDT: "2019-05-21T05:34:17.860Z" =  with 4 = in ISO Format
utc: "GMT-04:00" = -4 */

TripsSchema.plugin(autoIncrement.plugin, {
  model: "Trips",
  field: "tripno",
  startAt: 1000,
  incrementBy: 1,
});

var Trips = mongoose.model("trips", TripsSchema);
module.exports = Trips;
