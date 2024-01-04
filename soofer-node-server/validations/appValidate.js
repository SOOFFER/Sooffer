const isValidCoordinates = require("is-valid-coordinates");
const config = require("../config");
const featuresSettings = require("../featuresSettings");
const moment = require("moment");

import * as GFunctions from "../controllers/functions";
import CompanyDetails from "../models/company.model";
import Driver from "../models/driver.model";
import Rider from "../models/rider.model";
import ServiceAvailableCities from "../models/serviceAvailableCities.model";
import EstimationModel from "../models/estimation.model";
import Vehicletype from "../models/vehicletype.model";
import {
  isRiderCurrentlyFree,
  isRiderHasUpcomingTrips,
  isRiderCurrentlyActive,
  checkIsRiderBlocked,
} from "../controllers/app";
import Trips from "../models/trips.model";

const invNum = require("invoice-number");
const _ = require("lodash");
const constantsValues = require("../constants");
const cancelationConfig = require("../modules/cancelation/cancelationConfig");

/**
 * Get Estimation fare for Particlar Vehicle for given pick and drop place
 * @param {*} req
 * @param {*} res
 */
export const estimationFare = async (req, res, next) => {
  console.log("___________________req.body",JSON.stringify(req.body))
  if (
    typeof req.body.pickupLat === "undefined" ||
    req.body.pickupLat === "" ||
    typeof req.body.pickupLng === "undefined" ||
    req.body.pickupLng === "" ||
    !isValidCoordinates(
      (req.body.pickupLng = parseFloat(req.body.pickupLng)),
      (req.body.pickupLat = parseFloat(req.body.pickupLat))
    )
  ) {
    return res.status(409).json({
      success: false,
      message: "Pickup location should be valid.",
    });
  } else if (
    typeof req.body.dropLat === "undefined" ||
    req.body.dropLat === "" ||
    typeof req.body.dropLng === "undefined" ||
    req.body.dropLng === "" ||
    !isValidCoordinates(
      (req.body.dropLng = parseFloat(req.body.dropLng)),
      (req.body.dropLat = parseFloat(req.body.dropLat))
    )
  ) {
    return res.status(409).json({
      success: false,
      message: "Drop location should be valid.",
    });
  } else {
    if (
      typeof req.body.bookingType === "undefined" ||
      req.body.bookingType === "ride-now" ||
      req.body.bookingType === "rideNow"
    ) {
      req.body.bookingType = "rideNow";
    }

    if (
      req.body.bookingType == "ride-Later" ||
      req.body.bookingType == "Schedule" ||
      req.body.bookingType == "rideLater"
    ) {
      req.body.bookingType = "rideLater";
    }

    next();
  }
};

export const requestTaxi = async (req, res, next) => {
  // console.log("requestTaxi Request --------->", JSON.stringify(req.body));
  // console.log("requestTaxi Request Headers--------->", JSON.stringify(req.headers));
  // console.log("#################before body",req.body);
  req.body.drivergender = req.body.drivergender || "";

  if (req.body.drivergender == "") {
    if (req.type == "rider") {
      let riderData = await Rider.findOne({ _id: req.userId }).lean().exec();
      if (riderData && riderData.gender != "Male") {
        req.body.drivergender = riderData.gender;
      }
    }
  }

  if (featuresSettings.checkInactiveCon) {
    var isRiderCurrentlyActiveToTakeNew = await isRiderCurrentlyActive(
      req.userId
    );
    if (!isRiderCurrentlyActiveToTakeNew) {
      return res.status(409).json({
        success: false,
        message: "Your account was Inactivate.Please Contact Admin.",
      });
    }
  }

  if (cancelationConfig.cancelExists) {
    if (cancelationConfig.ifcanceledBlockUser) {
      var currentDate = new Date(GFunctions.getISOTodayDate());
      var isRiderBlocked = await checkIsRiderBlocked(
        req.userId,
        currentDate,
        "cancel"
      );
      if (isRiderBlocked.success == false) {
        return res.status(200).json({
          success: false,
          message: isRiderBlocked.msg,
        });
      }
    }
  }

  if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
    req.body.promoAmt = 0;
  }

  if (req.body.promo == "" || req.body.promo == undefined) {
    req.body.promo = "";
  }

  if (typeof req.body.requestFrom === "undefined") {
    req.body.requestFrom = "app";
  }

  if (typeof req.body.tripType === "undefined") {
    req.body.tripType = "daily";
  }

  if (
    typeof req.body.bookingType === "undefined" ||
    req.body.bookingType === "ride-now"
  ) {
    req.body.bookingType = "rideNow";
  }

  if (
    req.body.bookingType == "ride-Later" ||
    req.body.bookingType == "Schedule"
  ) {
    req.body.bookingType = "rideLater";
  }

  if (req.body.bookingType == "rideNow") {
    var isRiderCurrentlyFreeToTakeNew = await isRiderCurrentlyFree(req.userId);
    if (!isRiderCurrentlyFreeToTakeNew) {
      return res.status(409).json({
        success: false,
        message:
          "You already have one Trip in Progress, Please finish that Trip and try again.",
      });
    }
  }

  if (req.body.bookingType == "rideLater") {
    var isRiderHasUpcomingTripsLater = await isRiderHasUpcomingTrips(
      req.userId
    );
    if (isRiderHasUpcomingTripsLater) {
      return res.status(409).json({
        success: false,
        message:
          "You already have one Upcoming Trip in Progress, Please finish that Trip and try again.",
      });
    }
  }

  req.body.tripShownDate = GFunctions.sendTimeNow("D-M-YYYY h:mm a");
  if (req.body.bookingType == "rideLater") {
    var utcLength = getStringLength(req.body.utc);
    if (utcLength < 4) {
      req.body.utc = config.gmtZone;
    }
    var reqtripDT = req.body.tripDate + " " + req.body.tripTime;
    var newDateFormat = GFunctions.sendFormatedTime(
      req.body.tripDate,
      req.body.tripTime
    );
    console.log("---newDateFormat-",newDateFormat)
    var reqtripFDT = GFunctions.getDateTimeinThisFormat(
      newDateFormat,
      "MM/DD/YYYY HH:mm a"
    );
    // var reqtripFDT = GFunctions.getDateTimeForSortings(newDateFormat);
    var timeBtNowAndReq = GFunctions.getMinsBtDateTime(
      reqtripFDT,
      GFunctions.getISODate()
    );
    console.log("---timeBtNowAndReq-",timeBtNowAndReq)
    if (Number(timeBtNowAndReq) < 15 && req.body.requestFrom != "admin") {
      return res.status(409).json({
        success: false,
        message: "Ride Later Should be greater than 15 Mins.",
      });
    }

    req.body.processNow = false;
    if (
      Number(timeBtNowAndReq) < 30 ||
      req.body.driverAssignmentType == "manual-assign"
    ) {
      req.body.processNow = true;
    }

    var newDateFormat = GFunctions.sendFormatedDTime(reqtripDT);
    req.body.utc = req.body.utc ? req.body.utc : config.gmtZone;
    var gmtFTime = new Date(newDateFormat + " " + req.body.utc).toGMTString();
    req.body.tripDT = reqtripDT;
    req.body.tripFDT = reqtripFDT;
    req.body.gmtTime = gmtFTime;
    req.body.tripShownDate = GFunctions.getDateTimeinThisFormat(
      reqtripFDT,
      "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
      "D-M-YYYY h:mm a"
    );
  } else {
    req.body.tripDate = moment()
      .utcOffset(config.utcOffset)
      .format("DD-MM-YYYY");
    req.body.tripTime = moment().utcOffset(config.utcOffset).format("HH:mm a");
    var reqtripDT = req.body.tripDate + " " + req.body.tripTime;
    var newDateFormat = GFunctions.sendFormatedTime(
      req.body.tripDate,
      req.body.tripTime
    );
    // console.log(newDateFormat);
    var reqtripFDT = GFunctions.getDateTimeinThisFormat(newDateFormat);
    // console.log('reqtripFDT', reqtripFDT);
    var newDateFormat = GFunctions.sendFormatedDTime(reqtripDT);
    var gmtFTime = new Date(reqtripFDT).toGMTString();

    req.body.tripDT = reqtripDT;
    req.body.utc = req.body.utc ? req.body.utc : config.gmtZone;
    // req.body.tripFDT = reqtripFDT;
    req.body.tripFDT = GFunctions.getISODate();
    req.body.gmtTime = gmtFTime;
    // req.body.tripShownDate = reqtripDT;

    console.log("After Appvalidation",JSON.stringify(req.body))
  }

  if (!req.body.driverAssignmentType) {
    req.body.driverAssignmentType = "auto-assign";
  }

  if (req.body.tripType === "daily") {
    if (req.body.estimationId) {
      var estimationDetails = await EstimationModel.findById(
        req.body.estimationId
      );
      if (estimationDetails) {
        req.body.vehicleDetailsAndFare =
          estimationDetails.vehicleDetailsAndFare;
        req.body.distanceDetails = estimationDetails.distanceDetails;
      } else {
        return res.status(409).json({
          success: false,
          message: "Error Sending Request.Please Try again.",
        });
      }
    } else {
      console.log("__________________req.body.vehicleDetailsAndFare",req.body.vehicleDetailsAndFare);
      req.body.vehicleDetailsAndFare = JSON.parse(
        req.body.vehicleDetailsAndFare
      );
      req.body.distanceDetails = JSON.parse(req.body.distanceDetails);
    }
    // req.body.pickuplat = body.distanceDetails['startCords'];
    // req.body.pickuplng = body.distanceDetails['startCords'];
    // req.body.droplat = body.distanceDetails['startCords'];
    // req.body.droplng = body.distanceDetails['startCords'];
  } else if (req.body.tripType === "rental") {
  }

  if (
    typeof req.body.paymentMode === "undefined" ||
    req.body.paymentMode == ""
  ) {
    req.body.paymentMode = featuresSettings.defaultPaymentMethod;
  }

  req.body.paymentMode = req.body.paymentMode.toLowerCase();

  if (typeof req.body.noofseats === "undefined") {
    req.body.noofseats = 1;
  }

  next();
};

export const requestOutstationTaxi = async (req, res, next) => {
  if (featuresSettings.checkInactiveCon) {
    var isRiderCurrentlyActiveToTakeNew = await isRiderCurrentlyActive(
      req.userId
    );
    if (!isRiderCurrentlyActiveToTakeNew) {
      return res.status(409).json({
        success: false,
        message: "Your account was Inactivate.Please Contact Admin.",
      });
    }
  }
  if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
    req.body.promoAmt = 0;
  }

  if (req.body.promo == "" || req.body.promo == undefined) {
    req.body.promo = "";
  }

  if (typeof req.body.requestFrom === "undefined") {
    req.body.requestFrom = "app";
  }

  req.body.tripType = "outstation";
  req.body.bookingType = "rideLater";

  if (req.body.bookingType == "rideLater") {
    var isRiderHasUpcomingTripsLater = await isRiderHasUpcomingTrips(
      req.userId
    );
    if (isRiderHasUpcomingTripsLater) {
      return res.status(409).json({
        success: false,
        message:
          "You already have one Upcoming Trip in Progress, Please finish that Trip and try again.",
      });
    }
  }

  req.body.tripShownDate = GFunctions.getDateTimeinThisFormat(
    req.body.startDay,
    "D MMM YYYY, h:mm a",
    "D-M-YYYY h:mm a"
  );
  if (req.body.bookingType == "rideLater") {
    var utcLength = getStringLength(req.body.utc);
    if (utcLength < 4) {
      req.body.utc = config.gmtZone;
    }

    var tripDate = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, h:mm a",
      "DD-MM-YYYY"
    );
    var tripTime = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, h:mm a",
      "h:mm a"
    );
    var newDateFormat = GFunctions.sendFormatedTime(tripDate, tripTime);
    var reqtripFDT = GFunctions.getDateTimeinThisFormat(
      newDateFormat,
      "MM/DD/YYYY HH:mm a"
    );
    var timeBtNowAndReq = GFunctions.getMinsBtDateTime(
      reqtripFDT,
      GFunctions.getISODate()
    );
    if (Number(timeBtNowAndReq) < 30 && req.body.requestFrom != "admin") {
      return res.status(409).json({
        success: false,
        message: "Ride Later Should be greater than 30 Mins.",
      });
    }
    req.body.processNow = false;
    if (Number(timeBtNowAndReq) < 60) {
      req.body.processNow = true;
    }

    var dtInISO = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, h:mm a"
    );
    req.body.tripFDT = dtInISO; //"tripFDT": "2019-03-02T16:48:25.357Z",
    req.body.tripDT = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, h:mm a",
      "DD-MM-YYYY h:mm a"
    ); //"tripDT": "05-Mar-2019 04:50 PM",
    req.body.utc = req.body.utc ? req.body.utc : config.gmtZone;
    var gmtFTime = new Date(
      GFunctions.getDateTimeinThisFormat(
        req.body.startDay,
        "D MMM YYYY, h:mm a",
        "MM/DD/YYYY h:mm a"
      ) +
        " " +
        req.body.utc
    ).toGMTString();
    req.body.gmtTime = gmtFTime; //"gmtTime": "Tue, 05 Mar 2019 11:20:00 GMT",
    // req.body.tripShownDate = reqtripDT;
  }

  if (!req.body.driverAssignmentType) {
    req.body.driverAssignmentType = "auto-assign";
  }

  if (
    typeof req.body.paymentMode === "undefined" ||
    req.body.paymentMode == ""
  ) {
    req.body.paymentMode = featuresSettings.defaultPaymentMethod;
  }

  req.body.paymentMode = req.body.paymentMode.toLowerCase();

  if (typeof req.body.noofseats === "undefined") {
    req.body.noofseats = 1;
  }

  next();
};

export const requestReturnCab = async (req, res, next) => {
  if (featuresSettings.checkInactiveCon) {
    var isRiderCurrentlyActiveToTakeNew = await isRiderCurrentlyActive(
      req.userId
    );
    if (!isRiderCurrentlyActiveToTakeNew) {
      return res.status(409).json({
        success: false,
        message: "Your account was Inactivate.Please Contact Admin.",
      });
    }
  }
  if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
    req.body.promoAmt = 0;
  }

  if (req.body.promo == "" || req.body.promo == undefined) {
    req.body.promo = "";
  }

  if (
    typeof req.body.requestFrom === "undefined" ||
    req.body.requestFrom == "customer"
  ) {
    req.body.requestFrom = "app";
  }

  req.body.tripType = "return";
  req.body.bookingType = "rideLater";

  if (req.body.bookingType == "rideLater") {
    var isRiderHasUpcomingTripsLater = await isRiderHasUpcomingTrips(
      req.userId
    );
    if (isRiderHasUpcomingTripsLater) {
      return res.status(409).json({
        success: false,
        message:
          "You already have one Upcoming Trip in Progress, Please finish that Trip and try again.",
      });
    }
  }

  req.body.tripShownDate = GFunctions.getDateTimeinThisFormat(
    req.body.startDay,
    "D MMM YYYY, h:mm a",
    "D-M-YYYY h:mm a"
  );
  if (req.body.bookingType == "rideLater") {
    var utcLength = getStringLength(req.body.utc);
    if (utcLength < 4) {
      req.body.utc = config.gmtZone;
    }

    var tripDate = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, h:mm a",
      "DD-MM-YYYY"
    );
    var tripTime = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, h:mm a",
      "h:mm a"
    );
    var newDateFormat = GFunctions.sendFormatedTime(tripDate, tripTime);
    var reqtripFDT = GFunctions.getDateTimeinThisFormat(
      newDateFormat,
      "MM/DD/YYYY HH:mm a"
    );
    var timeBtNowAndReq = GFunctions.getMinsBtDateTime(
      reqtripFDT,
      GFunctions.getISODate()
    );
    if (Number(timeBtNowAndReq) < 30 && req.body.requestFrom != "admin") {
      return res.status(409).json({
        success: false,
        message: "Ride Later Should be greater than 30 Mins.",
      });
    }
    req.body.processNow = false;
    if (Number(timeBtNowAndReq) < 60) {
      req.body.processNow = true;
    }

    var dtInISO = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, h:mm a"
    );
    req.body.tripFDT = dtInISO; //"tripFDT": "2019-03-02T16:48:25.357Z",
    req.body.tripDT = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, h:mm a",
      "DD-MM-YYYY h:mm a"
    ); //"tripDT": "05-Mar-2019 04:50 PM",
    req.body.utc = req.body.utc ? req.body.utc : config.gmtZone;
    var gmtFTime = new Date(
      GFunctions.getDateTimeinThisFormat(
        req.body.startDay,
        "D MMM YYYY, h:mm a",
        "MM/DD/YYYY h:mm a"
      ) +
        " " +
        req.body.utc
    ).toGMTString();
    req.body.gmtTime = gmtFTime; //"gmtTime": "Tue, 05 Mar 2019 11:20:00 GMT",
    // req.body.tripShownDate = reqtripDT;
  }

  if (!req.body.driverAssignmentType) {
    req.body.driverAssignmentType = "manual-assign";
  }

  if (
    typeof req.body.paymentMode === "undefined" ||
    req.body.paymentMode == ""
  ) {
    req.body.paymentMode = featuresSettings.defaultPaymentMethod;
  }

  req.body.paymentMode = req.body.paymentMode.toLowerCase();

  if (typeof req.body.noofseats === "undefined") {
    req.body.noofseats = 1;
  }

  next();
};

export const requestTaxiRetry = async (req, res, next) => {
  if (featuresSettings.checkInactiveCon) {
    var isRiderCurrentlyActiveToTakeNew = await isRiderCurrentlyActive(
      req.userId
    );
    if (!isRiderCurrentlyActiveToTakeNew) {
      return res.status(409).json({
        success: false,
        message: "Your account was Inactivate.Please Contact Admin.",
      });
    }
  }
  var dataChanged = false;
  if (req.body.estimationId) dataChanged = true;

  if (dataChanged) {
    //New data
    if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
      req.body.promoAmt = 0;
    }

    if (req.body.promo == "" || req.body.promo == undefined) {
      req.body.promo = "";
    }

    if (typeof req.body.tripType === "undefined") {
      req.body.tripType = "daily";
    }

    if (
      typeof req.body.bookingType === "undefined" ||
      req.body.bookingType === "ride-now"
    ) {
      req.body.bookingType = "rideNow";
    }

    if (
      req.body.bookingType == "ride-Later" ||
      req.body.bookingType == "Schedule"
    ) {
      req.body.bookingType = "rideLater";
    }

    req.body.tripShownDate = GFunctions.sendTimeNow();
    if (req.body.bookingType == "rideLater") {
      var utcLength = getStringLength(req.body.utc);
      if (utcLength < 4) {
        req.body.utc = config.gmtZone;
      }
      var reqtripDT = req.body.tripDate + " " + req.body.tripTime;
      var newDateFormat = GFunctions.sendFormatedTime(
        req.body.tripDate,
        req.body.tripTime
      );
      var reqtripFDT = GFunctions.getDateTimeForSortings(newDateFormat);
      var newDateFormat = GFunctions.sendFormatedDTime(reqtripDT);
      var gmtFTime = new Date(newDateFormat + " " + req.body.utc).toGMTString();
      req.body.tripDT = reqtripDT;
      req.body.utc = req.body.utc ? req.body.utc : config.gmtZone;
      req.body.tripFDT = reqtripFDT;
      req.body.gmtTime = gmtFTime;
      req.body.tripShownDate = reqtripDT;
    } else {
      req.body.tripDate = moment()
        .utcOffset(config.utcOffset)
        .format("DD-MM-YYYY");
      req.body.tripTime = moment()
        .utcOffset(config.utcOffset)
        .format("HH:mm a");
      var reqtripDT = req.body.tripDate + " " + req.body.tripTime;
      var newDateFormat = GFunctions.sendFormatedTime(
        req.body.tripDate,
        req.body.tripTime
      );
      // console.log(newDateFormat);
      var reqtripFDT = GFunctions.getDateTimeinThisFormat(newDateFormat);
      // console.log('reqtripFDT', reqtripFDT);
      var newDateFormat = GFunctions.sendFormatedDTime(reqtripDT);
      var gmtFTime = new Date(reqtripFDT).toGMTString();

      req.body.tripDT = reqtripDT;
      req.body.utc = req.body.utc ? req.body.utc : config.gmtZone;
      // req.body.tripFDT = reqtripFDT;
      req.body.tripFDT = GFunctions.getISODate();
      req.body.gmtTime = gmtFTime;
      req.body.tripShownDate = reqtripDT;
    }

    if (!req.body.driverAssignmentType) {
      req.body.driverAssignmentType = "auto-assign";
    }

    if (req.body.tripType === "daily") {
      if (req.body.estimationId) {
        var estimationDetails = await EstimationModel.findById(
          req.body.estimationId
        );
        if (estimationDetails) {
          req.body.vehicleDetailsAndFare =
            estimationDetails.vehicleDetailsAndFare;
          req.body.distanceDetails = estimationDetails.distanceDetails;
        } else {
          return res.status(409).json({
            success: false,
            message: "Error Sending Request.Please Try again.",
          });
        }
      } else {
        req.body.vehicleDetailsAndFare = JSON.parse(
          req.body.vehicleDetailsAndFare
        );
        req.body.distanceDetails = JSON.parse(req.body.distanceDetails);
      }
      // req.body.pickuplat = body.distanceDetails['startCords'];
      // req.body.pickuplng = body.distanceDetails['startCords'];
      // req.body.droplat = body.distanceDetails['startCords'];
      // req.body.droplng = body.distanceDetails['startCords'];
    }

    if (typeof req.body.paymentMode === "undefined") {
      req.body.paymentMode = featuresSettings.defaultPaymentMethod;
    }

    req.body.paymentMode = req.body.paymentMode.toLowerCase();

    if (typeof req.body.noofseats === "undefined") {
      req.body.noofseats = 1;
    }
  } //New data

  next();
};

function getStringLength(inputtxt) {
  var str = new String(inputtxt);
  return str.length;
}

export const tripCurrentStatus = async (req, res, next) => {
  // console.log("....tripCurrentStatus", req.body)
  // console.log("...tripCurrentStatus.",req.headers)
  if (typeof req.body.waitingTime !== "number") {
    req.body.waitingTime = 0;
  }
  next();
};

export const verifyNumberDriver = async (req, res, next) => {
  if (typeof req.body.phcode === "undefined" || req.body.phcode === "") {
    req.body.phcode = featuresSettings.defaultPhoneCode;
  }
  next();
};

export const driverAddData = async (req, res, next) => {
  console.log("driverAddData", req.body);
  if (
    typeof req.body.requestFrom !== "undefined" &&
    req.body.requestFrom !== ""
  ) {
    req.body.requestFrom = "app";
  }

  if (typeof req.body.phcode === "undefined" || req.body.phcode === "") {
    req.body.phcode = featuresSettings.defaultPhoneCode;
  }

  if (typeof req.body.lang === "undefined") {
    req.body.lang = featuresSettings.defaultlang;
  }

  if (typeof req.body.cur === "undefined") {
    req.body.cur = featuresSettings.defaultcur;
  }

  if (req.body.cmpy == "" || typeof req.body.cmpy === "undefined") {
    let companyDoc = await CompanyDetails.findOne({ name: "Default" });
    if (companyDoc) {
      req.body.cmpy = companyDoc._id;
    } else {
      req.body.isIndividual = false;
    }
  }

  if (!featuresSettings.socialLogin) {
    if (typeof req.body.password === "undefined" || req.body.password === "") {
      return res
        .status(409)
        .json({ success: false, message: "Password should be valid." });
    }
  }

  if (!req.body.loginType) {
    req.body.loginType == "normal";
  }

  if (
    req.body.loginType != "normal" &&
    typeof req.body.loginType != "undefined" &&
    req.body.loginType != ""
  ) {
    if (
      typeof req.body.loginId === "undefined" ||
      req.body.loginId === "" ||
      typeof req.body.loginType === "undefined" ||
      req.body.loginType === ""
    ) {
      return res.status(409).json({
        success: false,
        message: "Error Registering with Social Login",
      });
    }
  }

  if (typeof req.body.gender === "undefined") {
    req.body.gender = "Male";
  }

  if (typeof req.body.scId === "undefined") {
    if (featuresSettings.isCityWise) {
      //assign default SCID, and name
      let ServiceAvailableCitiesDoc = await ServiceAvailableCities.findOne({
        city: "Default",
      });
      req.body.scity = null;
      req.body.scId = null;
      if (ServiceAvailableCitiesDoc) {
        req.body.scity = ServiceAvailableCitiesDoc.city;
        req.body.scId = ServiceAvailableCitiesDoc._id;
      }
    } else {
      req.body.scity = null;
      req.body.scId = null;
    }
  }

  if (!featuresSettings.isDriverPrefixCodeEnabled) {
    let TotCnt = await Driver.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    ).exec();
    if (TotCnt != null) {
      req.body.code = invNum.next(TotCnt.code);
    } else {
      req.body.code = "DRV001";
    }
  } else {
    //From APP they need to Give Service ID
    var serviceBasedCode = await getServiceBasedPrefixCode(
      req.body.scIds[0]._id
    );
    // var serviceBasedCode = await ServiceAvailableCities.findOne({ '_id': req.body.scIds[0]._id }, { 'driverPrefixCode': 1 });
    let TotCnt = await Driver.findOne(
      { scId: req.body.scIds[0]._id },
      { code: 1 },
      { sort: { createdAt: -1 } }
    ).exec();
    if (TotCnt != null) {
      req.body.code = invNum.next(TotCnt.code);
      // var splitCode = (req.body.code).match(/(.{1,3})/g);
      // if (splitCode[0] == serviceBasedCode.driverPrefixCode) req.body.code = invNum.next(TotCnt.code);
      // else req.body.code = serviceBasedCode.driverPrefixCode + "-001";
    } else {
      req.body.code = serviceBasedCode.driverPrefixCode + "001";
    }
  }

  //check age
  if (featuresSettings.dobMandatory) {
    let currentDate = moment().utcOffset(config.utcOffset).format("YYYY-MM-DD");
    let age = moment(currentDate).diff(req.body.DOB, "years");
    if (age < 18) {
      return res.status(409).json({
        success: false,
        message:
          "The date doesn't look right.Be sure to use your actual Date Of Birth.",
      });
    }
  }

  next();
};

export const verifyNumberRider = async (req, res, next) => {
  if (typeof req.body.phcode === "undefined" || req.body.phcode === "") {
    req.body.phcode = featuresSettings.defaultPhoneCode;
  }
  next();
};

export const riderLogin = async (req, res, next) => {
  if (typeof req.body.phcode === "undefined" || req.body.phcode === "") {
    req.body.phcode = featuresSettings.defaultPhoneCode;
  }
  if (featuresSettings.socialLogin) {
    if (typeof req.body.loginType === "undefined" || req.body.loginType == "") {
      req.body.loginType = "normal";
      req.body.loginId = "";
    }
  }
  next();
};

export const driverLogin = async (req, res, next) => {
  if (typeof req.body.phcode === "undefined" || req.body.phcode === "") {
    req.body.phcode = featuresSettings.defaultPhoneCode;
  }
  if (featuresSettings.socialLogin) {
    if (typeof req.body.loginType === "undefined" || req.body.loginType == "") {
      req.body.loginType = "normal";
      req.body.loginId = "";
    }
  }
  next();
};

export const riderAddData = async (req, res, next) => {
  if (
    typeof req.body.requestFrom !== "undefined" &&
    req.body.requestFrom !== ""
  ) {
    req.body.requestFrom = "app";
  }

  if (typeof req.body.phcode === "undefined" || req.body.phcode === "") {
    req.body.phcode = featuresSettings.defaultPhoneCode;
  }

  if (typeof req.body.lang === "undefined") {
    req.body.lang = featuresSettings.defaultlang;
  }

  if (typeof req.body.cur === "undefined") {
    req.body.cur = featuresSettings.defaultcur;
  }

  if (!featuresSettings.socialLogin) {
    if (typeof req.body.password === "undefined" || req.body.password === "") {
      return res
        .status(409)
        .json({ success: false, message: "Password should be valid." });
    }
  }

  if (typeof req.body.loginId === "undefined") {
    req.body.loginType == "normal";
  }

  if (
    req.body.loginType != "normal" &&
    typeof req.body.loginType != "undefined" &&
    req.body.loginType != ""
  ) {
    if (
      typeof req.body.loginId === "undefined" ||
      req.body.loginId === "" ||
      typeof req.body.loginType === "undefined" ||
      req.body.loginType === ""
    ) {
      return res.status(409).json({
        success: false,
        message: "Error Registering with Social Login",
      });
    }
  }

  if (typeof req.body.gender === "undefined") {
    req.body.gender = "Male";
  }

  if (typeof req.body.scId === "undefined") {
    if (featuresSettings.isCityWise) {
      //assign default SCID, and name
      let ServiceAvailableCitiesDoc = await ServiceAvailableCities.findOne({
        city: "Default",
      });
      req.body.scity = null;
      req.body.scId = null;
      if (ServiceAvailableCitiesDoc) {
        req.body.scId = ServiceAvailableCitiesDoc._id;
        req.body.scity = ServiceAvailableCitiesDoc.city;
      }
    } else {
      req.body.scity = null;
      req.body.scId = null;
    }
  }

  next();
};

export const validatePromo = async (req, res, next) => {
  if (featuresSettings.isPromoCodeAvailable) {
    if (
      typeof req.body.promoCode === "undefined" ||
      req.body.promoCode === ""
    ) {
      return res
        .status(409)
        .json({ success: false, message: "Promo Code should be valid." });
    }
  } else {
    return res
      .status(409)
      .json({ success: false, message: "Promo Code is not applicable." });
  }
  next();
};

export const estimationFareForHailTaxi = async (req, res, next) => {
  if (
    typeof req.body.pickupLat === "undefined" ||
    req.body.pickupLat === "" ||
    typeof req.body.pickupLng === "undefined" ||
    req.body.pickupLng === "" ||
    !isValidCoordinates(
      (req.body.pickupLng = parseFloat(req.body.pickupLng)),
      (req.body.pickupLat = parseFloat(req.body.pickupLat))
    )
  ) {
    return res.status(409).json({
      success: false,
      message: "Pickup location should be valid.",
    });
  } else if (
    typeof req.body.dropLat === "undefined" ||
    req.body.dropLat === "" ||
    typeof req.body.dropLng === "undefined" ||
    req.body.dropLng === "" ||
    !isValidCoordinates(
      (req.body.dropLng = parseFloat(req.body.dropLng)),
      (req.body.dropLat = parseFloat(req.body.dropLat))
    )
  ) {
    return res.status(409).json({
      success: false,
      message: "Drop location should be valid.",
    });
  }

  let DriverData = await Driver.findById(req.userId, {
    currentTaxi: 1,
    curService: 1,
  }).exec();
  if (!DriverData) {
    return res.status(409).json({
      success: false,
      message: "Error Finding Estimation Fare!Please Select Vehicle Type.",
    });
  }

  // var vehicleData = await Vehicletype.findOne({ type: DriverData.curService, tripTypeCode: "daily" }).exec(); // @v2TODO pass pickupCity as null

  // req.body.serviceTypeId = vehicleData._id;
  req.body.serviceType = DriverData.curService;
  req.body.pickupCity = "";
  req.body.hailRide = true;

  next();
};

export const requestHailTaxi = async (req, res, next) => {
  if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
    req.body.promoAmt = 0;
  }

  if (req.body.promo == "" || req.body.promo == undefined) {
    req.body.promo = "";
  }

  if (typeof req.body.requestFrom === "undefined") {
    req.body.requestFrom = "app";
  }

  if (typeof req.body.tripType === "undefined") {
    req.body.tripType = "daily";
  }

  if (typeof req.body.bookingType === "undefined") {
    req.body.bookingType = "hailRide";
  }

  req.body.tripShownDate = GFunctions.sendTimeNow("D-M-YYYY h:mm a");

  if (!req.body.driverAssignmentType) {
    req.body.driverAssignmentType = "auto-assign";
  }

  if (req.body.tripType === "daily") {
    if (req.body.estimationId) {
      var estimationDetails = await EstimationModel.findById(
        req.body.estimationId
      );
      if (estimationDetails) {
        req.body.vehicleDetailsAndFare =
          estimationDetails.vehicleDetailsAndFare;
        req.body.distanceDetails = estimationDetails.distanceDetails;
      } else {
        return res.status(409).json({
          success: false,
          message: "Error Sending Request.Please Try again.",
        });
      }
    } else {
      req.body.vehicleDetailsAndFare = JSON.parse(
        req.body.vehicleDetailsAndFare
      );
      req.body.distanceDetails = JSON.parse(req.body.distanceDetails);
    }
  }

  req.body.paymentMode = "cash";

  req.body.paymentMode = req.body.paymentMode.toLowerCase();

  next();
};

function getStringLength(inputtxt) {
  var str = new String(inputtxt);
  return str.length;
}

export const getServiceBasedPrefixCode = async (scId) => {
  var serviceAvailability = await ServiceAvailableCities.find({
    softDelete: false,
  });
  var code = {};
  var data = _.map(serviceAvailability, (el) => {
    if (el._id.toString() == scId.toString()) {
      code = {
        driverPrefixCode: el.driverPrefixCode,
        tripPrefixCode: el.tripPrefixCode,
      };
    }
  });
  return code;
};

/*export const generateTripCode = async (scId) => {
    var tripCode = ""
    if (!featuresSettings.isTripPrefixCodeEnabled || scId == null) {
        let TotCnt = await Trips.findOne({}, {}, { sort: { 'createdAt': -1 } }).exec();
        if (TotCnt != null && TotCnt.tripCode) {
            tripCode = invNum.next(TotCnt.tripCode);
        } else {
            tripCode = 'TRP-001';
        }
    } else if (scId != null) {
        var serviceBasedCode = await getServiceBasedPrefixCode(scId);
        let TotCnt = await Trips.findOne({ 'scId': scId }, { 'tripCode': 1 }, { sort: { 'createdAt': -1 } }).exec();
        if (TotCnt != null && TotCnt.tripCode) {
            tripCode = invNum.next(TotCnt.tripCode);
        } else {
            tripCode = serviceBasedCode.tripPrefixCode + "001";
        }
    }
    return tripCode
}*/

export const generateTripCode = async (scId) => {
  var tripCode = "";
  var currentDateFormat = moment().utcOffset(config.utcOffset).format("YYMMDD");
  if (!featuresSettings.isTripPrefixCodeEnabled || scId == null) {
    let TotCnt = await Trips.findOne(
      {},
      {},
      { sort: { createdAt: -1 } }
    ).exec();
    if (TotCnt != null && TotCnt.tripCode) {
      tripCode = invNum.next(TotCnt.tripCode);
    } else {
      tripCode = "TRP-100";
    }
  } else if (scId != null) {
    var serviceBasedCode = await getServiceBasedPrefixCode(scId);
    let TotCnt = await Trips.findOne(
      {
        scId: scId,
        $or: [
          { status: { $in: ["accepted", "Progress", "Finished"] } },
          {
            review: {
              $in: [
                constantsValues.cancelTaxiByDriver,
                constantsValues.cancelTaxiByUser,
              ],
            },
          },
        ],
      },
      { tripCode: 1 },
      { sort: { createdAt: -1 } }
    ).exec();
    if (TotCnt != null && TotCnt.tripCode) {
      var splitDate = _.split(TotCnt.tripCode, "-");
      var lastTripDate = moment(splitDate[0], "YYMMDD")
        .utcOffset(config.utcOffset)
        .format("YYMMDD");
      if (lastTripDate == currentDateFormat) {
        // tripCode = invNum.next(TotCnt.tripCode);
        if (splitDate[2]) {
          tripCode = invNum.next(splitDate[2]);
          tripCode = splitDate[0] + "-" + splitDate[1] + "-" + tripCode;
        } else {
          tripCode = invNum.next(splitDate[1]);
          tripCode = splitDate[0] + "-" + tripCode;
        }
      } else {
        tripCode =
          currentDateFormat + "-" + serviceBasedCode.tripPrefixCode + "100";
      }
    } else {
      tripCode =
        currentDateFormat + "-" + serviceBasedCode.tripPrefixCode + "100";
    }
  }
  return tripCode;
};

export const validateFundInput = (data) => {
  let errors = {};
  data.swiftCode = data.swiftCode ? data.swiftCode : data.ifscCode;
  if (_.isEmpty(data.swiftCode)) {
    errors.ifsc = "ifsc field is empty";
  }
  if (_.isEmpty(data.acctNo)) {
    errors.accNumber = "accNumber field is empty";
  }
  return {
    errors,
    isValid: _.isEmpty(errors),
  };
};
