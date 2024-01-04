// ./express-server/controllers/todo.server.controller.js
import mongoose from "mongoose";

//import models
import Vehicletype from "../models/vehicletype.model";
import Vehicledetails from "../models/Vehicledetails.model";
import Driver from "../models/driver.model";
import * as HelperFunc from "./adminfunctions";
import { getPreferedDetails } from "./common";

const featuresSettings = require("../featuresSettings");
const _ = require("lodash");

import { updateDriverLowCatVechicle } from "./driver";
export const addData = (req, res) => {
  var lowCategoryOptions = [];
  if (
    req.body.lowCategoryOptions != undefined &&
    req.body.lowCategoryOptions != "undefined"
  ) {
    lowCategoryOptions = req.body.lowCategoryOptions.split(",");
  }
  var filename;
  if (req["file"] != null) {
    filename = req["file"].path;
  }

  var newDoc = {
    type: req.body.type,
    tripTypeCode: req.body.tripTypeCode, //{ daily/rental/outstation }
    // loc: req.body.loc,
    baseFare: req.body.base,
    bookingFare: req.body.bookingFare,
    bkm: req.body.bkm,
    bkmnac: req.body.bkmnac,
    timeFare: req.body.timeFare,
    mfare: req.body.mfare,
    comison: req.body.comison,
    asppc: req.body.asppc,
    displayorder: req.body.displayorder,
    description: req.body.description,
    features: req.body.features,
    file: filename,
    conveyanceAvailable: req.body.conveyanceAvailable,
    conveyanceType: req.body.conveyanceType,
    conveyancePerKm: req.body.conveyancePerKm,
    isTax: req.body.isTax,
    taxPercentage: req.body.taxPercentage,
    cancelationFeesDriver: req.body.cancelationFeesDriver,
    cancelationFeesRider: req.body.cancelationFeesRider,
    // nightHours: req.body.nightHours,
    isWaitingTimeExceddedChargesApplicable:
      req.body.isWaitingTimeExceddedChargesApplicable,
    allowMinimumWaitingTimeInMinutes: req.body.allowMinimumWaitingTimeInMinutes,
    chargeRatePerMinuteForExceededMinimumWaitingTime:
      req.body.chargeRatePerMinuteForExceededMinimumWaitingTime,
    available: req.body.available,
    isRideLater: req.body.isRideLater,
    isShareAvailable: req.body.isShareAvailable,
    lowCategoryOptions: lowCategoryOptions,
    nightRate: req.body.nightRate ? req.body.nightRate : 0,
    dayRate: req.body.dayRate ? req.body.dayRate : 0,
    // peakHours: [JSON.parse(req.body.peakHours)],
    isWaitingTimeBeforeTripStartExceddedChargesApplicable:
      req.body.isWaitingTimeBeforeTripStartExceddedChargesApplicable,
    allowMiniWaitingTimeBeforeTripStartInMin:
      req.body.allowMiniWaitingTimeBeforeTripStartInMin,
    chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart:
      req.body.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart,
    baseFareForRoundTrip: req.body.baseFareForRoundTrip
      ? req.body.baseFareForRoundTrip
      : 0,
    bkmForRoundTrip: req.body.bkmForRoundTrip ? req.body.bkmForRoundTrip : 0,
    timeFareForIdel: req.body.timeFareForIdel ? req.body.timeFareForIdel : 0,
    kmReducedPerExtraHr: req.body.kmReducedPerExtraHr
      ? req.body.kmReducedPerExtraHr
      : 0,
    timeFareOneway: req.body.timeFareOneway ? req.body.timeFareOneway : 0,
    timeFareForIdelOneway: req.body.timeFareForIdelOneway
      ? req.body.timeFareForIdelOneway
      : 0,
  };
  var rental = req.body.rental;
  var nightHours = req.body.nightHours;
  nightHours = nightHours.slice(1, -1);
  var peakHours = req.body.peakHours;
  peakHours = JSON.parse(peakHours);
  var scIds = req.body.scIds;
  scIds = JSON.parse(scIds);

  newDoc = new Vehicletype(newDoc);
  newDoc.nightHours.push(JSON.parse(nightHours));
  newDoc.peakHours.push(peakHours[0], peakHours[1]);
  // if(rental.isRental=='true')newDoc.rental=rental;

  _.forEach(scIds, function (element, i) {
    newDoc.scIds.push(element);
  });

  newDoc.save((err, docs) => {
    if (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: req.i18n.__("SEVER_ERROR"),
          error: err,
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: req.i18n.__("DATA_ADDED_SUCCESS"),
        docs,
      });
  });
};

export const getvehicleTypes = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  sortQuery["displayorder"] = 1;
  if (req.cityWise == "exists") likeQuery["scIds.scId"] = { $in: req.scId };
  if (req.query["scIds.name"] != undefined)
    likeQuery["scIds.name"] = { $in: req.query["scIds.name"] };
  likeQuery["softDel"] = false;
  var totalCount = 10;
  Vehicletype.find(likeQuery)
    .count()
    .exec((err, cnt) => {
      if (err) {
      }
      totalCount = cnt;
      Vehicletype.find(likeQuery)
        .skip(pageQuery.skip)
        .limit(pageQuery.take)
        .sort(sortQuery)
        .exec((err, docs) => {
          if (err) {
            return res.json([]);
          }
          res.header("x-total-count", totalCount);
          res.send(docs);
        });
    });
};

export const serviceAvailable = (req, res) => {
  var whereQ = {};
  if (req.params.triptype) {
    whereQ["tripTypeCode"] = req.params.triptype;
  }
  Vehicletype.find(whereQ, {
    type: 1,
    tripTypeCode: 1,
    baseFare: 1,
    bkm: 1,
    asppc: 1,
    displayorder: 1,
    description: 1,
    fileForWeb: 1,
    features: 1,
    file: 1,
    available: 1,
  })
    .sort({ displayorder: 1 })
    .exec((err, docs) => {
      if (err) {
        return res.json([]);
      }
      res.send(docs);
    });
};

export const whatweoffer = (req, res) => {
  var whereQ = {};
  if (req.params.triptype) {
    whereQ["tripTypeCode"] = req.params.triptype;
  }
  Vehicletype.find(whereQ, {
    type: 1,
    tripTypeCode: 1,
    baseFare: 1,
    bkm: 1,
    asppc: 1,
    displayorder: 1,
    description: 1,
    fileForWeb: 1,
    features: 1,
    file: 1,
    available: 1,
  })
    .sort({ displayorder: 1 })
    .exec((err, docs) => {
      if (err) {
        return res.json([]);
      }
      res.send(docs);
    });
};

export const whatweofferfrontend = (req, res) => {
  var language = "en";
  if (req.query.language) language = req.query.language;
  Vehicledetails.find({ language: language }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

/**
 * Delete vehicle types Details
 * @input
 * @param
 * @return
 * @response
 */
export const deleteData = (req, res) => {
  Vehicletype.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) {
      return res.json({ success: false, message: req.i18n.__("SOME_ERROR") });
    }
    return res.json({
      success: true,
      message: "Vehicle Details Deleted successfully",
    });
  });

  /* Vehicletype.findOneAndUpdate({ _id: req.params.id }, { softDel: true }, { "new": true }, (err, docs) => {
     if (err) {
       return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
     }
     return res.json({ 'success': true, 'message': req.i18n.__('DELETED_SUCCESS') });
   }) */
};

/**
 * Update vehicle types Details  = In Partial
 * @input
 * @param
 * @return
 * @response
 */
export const patchData = (req, res) => {
  const id = req.params.id;
  const patchFor = req.params.patchFor;

  var datas;
  if (patchFor == "conveyance") {
    datas = {
      conveyanceAvailable: req.body.conveyanceAvailable,
      conveyanceType: req.body.conveyanceType,
      conveyancePerKm: req.body.conveyancePerKm,
    };
  } else if (patchFor == "tax") {
    datas = {
      isTax: req.body.isTax,
      taxPercentage: req.body.taxPercentage,
    };
  } else if (patchFor == "cancelation") {
    datas = {
      cancelationFeesDriver: req.body.cancelationFeesDriver,
      cancelationFeesRider: req.body.cancelationFeesRider,
    };
  } else if (patchFor == "waitingtime") {
    datas = {
      isWaitingTimeExceddedChargesApplicable:
        req.body.isWaitingTimeExceddedChargesApplicable,
      allowMinimumWaitingTimeInMinutes:
        req.body.allowMinimumWaitingTimeInMinutes,
      chargeRatePerMinuteForExceededMinimumWaitingTime:
        req.body.chargeRatePerMinuteForExceededMinimumWaitingTime,
      isWaitingTimeBeforeTripStartExceddedChargesApplicable:
        req.body.isWaitingTimeBeforeTripStartExceddedChargesApplicable,
      allowMiniWaitingTimeBeforeTripStartInMin:
        req.body.allowMiniWaitingTimeBeforeTripStartInMin,
      chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart:
        req.body.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart,
    };
  }

  Vehicletype.findOneAndUpdate(
    { _id: id },
    datas,
    { new: true },
    (err, todo) => {
      if (err)
        return res.json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      return res.json({
        success: true,
        message: req.i18n.__("DETAILS_UPDATE_SUCCESS"),
        todo,
      });
    }
  );
};

/**
 * Update vehicle types Basic Details  = In Partial
 * @input
 * @param
 * @return
 * @response
 */
export const patchBasicData = (req, res) => {
  const id = req.params.id;
  var filename = req.body.image;
  if (req["file"] != null) {
    filename = req["file"].path;
  }

  Vehicletype.findOne({ _id: id }).exec((err, doc) => {
    if (err)
      return res.json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    if (!doc)
      return res.json({
        success: false,
        message: req.i18n.__("VEHICLE_NOT_FOUND"),
      });
    var lowCategoryOptions = [];
    if (
      req.body.lowCategoryOptions != undefined &&
      req.body.lowCategoryOptions != "undefined"
    ) {
      lowCategoryOptions = req.body.lowCategoryOptions.split(",");
    }
    (doc.gender = req.body.gender),
    (doc.type = req.body.type),
      (doc.tripTypeCode = req.body.tripTypeCode),
      // doc.loc = req.body.loc,
      (doc.baseFare = req.body.base),
      (doc.bookingFare = req.body.bookingFare),
      (doc.bkm = req.body.bkm),
      (doc.bkmnac = req.body.bkmnac),
      (doc.timeFare = req.body.timeFare),
      (doc.mfare = req.body.mfare),
      (doc.comison = req.body.comison),
      (doc.asppc = req.body.asppc),
      (doc.displayorder = req.body.displayorder),
      (doc.description = req.body.description),
      (doc.features = req.body.features),
      (doc.available = req.body.available),
      (doc.isRideLater = req.body.isRideLater),
      (doc.isShareAvailable = req.body.isShareAvailable),
      (doc.dayRate = req.body.dayRate ? req.body.dayRate : 0),
      (doc.file = filename),
      (doc.lowCategoryOptions = lowCategoryOptions),
      (doc.baseFareForRoundTrip = req.body.baseFareForRoundTrip),
      (doc.bkmForRoundTrip = req.body.bkmForRoundTrip),
      (doc.gender = req.body.gender),
      (doc.timeFareForIdel = req.body.timeFareForIdel
        ? req.body.timeFareForIdel
        : 0),
      (doc.kmReducedPerExtraHr = req.body.kmReducedPerExtraHr
        ? req.body.kmReducedPerExtraHr
        : 0);
    doc.timeFareOneway = req.body.timeFareOneway ? req.body.timeFareOneway : 0;
    doc.timeFareForIdelOneway = req.body.timeFareForIdelOneway
      ? req.body.timeFareForIdelOneway
      : 0;
    // var  rental=req.body.rental;
    let oldScIds = JSON.parse(req.body.oldScIds);
    var scIds = req.body.scIds;
    scIds = JSON.parse(scIds);

    var result = _.xorBy(oldScIds, scIds, "scId");
    // if(rental.isRental=='true')doc.rental=rental;

    var oldValues = [];
    var newValues = [];
    _.forEach(result, function (value, key) {
      let isExist = _.has(value, "_id");
      if (isExist) {
        oldValues.push(value);
      } else {
        newValues.push(value);
      }
    });

    _.forEach(oldValues, function (element, i) {
      doc.scIds.pull({ _id: element._id });
    });

    _.forEach(newValues, function (element, i) {
      doc.scIds.push(element);
    });

    doc.save(function (err, op) {
      if (err)
        return res
          .status(409)
          .json({
            success: false,
            message: req.i18n.__("SOME_ERROR"),
            error: err,
          });
      Vehicletype.update(
        { type: req.body.type },
        { lowCategoryOptions: lowCategoryOptions },
        { multi: true }
      ).exec(); //@TODO SC
      // updateDriverLowCatVechicle(op.type, lowCategoryOptions);
      return res.json({
        success: true,
        message: req.i18n.__("DETAILS_UPDATE_SUCCESS"),
        op,
      });
    });
  });
};

export const vehicletypeSurge = (req, res) => {
  const id = req.params.id;
  const patchFor = req.params.patchFor;

  if (patchFor == "nightfare") {
    Vehicletype.findOne({ _id: id }).exec((err, docs) => {
      if (err)
        return res.json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      if (!docs)
        return res.json({
          success: false,
          message: req.i18n.__("VEHICLE_NOT_FOUND"),
        });
      docs.nightRate = req.body.nightRate ? req.body.nightRate : 0;

      var nightData = docs.nightHours.id(req.body.oldId);

      let nightHours = JSON.parse(req.body.nightHours);
      (nightData.from = nightHours[0].from),
        (nightData.to = nightHours[0].to),
        (nightData.percentNightFare = nightHours[0].percentNightFare),
        docs.save(function (err, op) {
          if (err)
            return res.json({
              success: false,
              message: req.i18n.__("SOME_ERROR"),
              error: err,
            });
          return res.json({
            success: true,
            message: req.i18n.__("DETAILS_UPDATE_SUCCESS"),
            op,
          });
        });
    });
  } else if (patchFor == "peakfare") {
    Vehicletype.findOne({ _id: id }).exec((err, docs) => {
      if (err)
        return res.json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      if (!docs)
        return res.json({
          success: false,
          message: req.i18n.__("VEHICLE_NOT_FOUND"),
        });

      let peakhour = JSON.parse(req.body.peakHours);

      var peakData1 = docs.peakHours.id(peakhour[0].oldId);
      var peakData2 = docs.peakHours.id(peakhour[1].oldId);

      (peakData1.from = peakhour[0].from),
        (peakData1.to = peakhour[0].to),
        (peakData1.percentPeakFare = peakhour[0].percentPeakFare),
        (peakData2.from = peakhour[1].from),
        (peakData2.to = peakhour[1].to),
        (peakData2.percentPeakFare = peakhour[1].percentPeakFare),
        docs.save(function (err, op) {
          if (err)
            return res.json({
              success: false,
              message: req.i18n.__("SOME_ERROR"),
              error: err,
            });
          return res.json({
            success: true,
            message: req.i18n.__("DETAILS_UPDATE_SUCCESS"),
            op,
          });
        });
    });
  } else {
    return res.json({
      success: true,
      message: req.i18n.__("DETAILS_UPDATE_FAILED"),
    });
  }
};

export const distanceData = (req, res) => {
  var data = {
    distanceFrom: req.body.distanceFrom,
    distanceTo: req.body.distanceTo,
    distanceFareType: req.body.distanceFareType,
    distanceFarePerKM: req.body.distanceFarePerKM,
    distanceFarePerFlatRate: req.body.distanceFarePerFlatRate,
    applyTax: req.body.applyTax,
    applyWaitingTime: req.body.applyWaitingTime,
    applyNightCharge: req.body.applyNightCharge,
    applyPeakCharge: req.body.applyPeakCharge,
    applyCommission: req.body.applyCommission,
    applyPickupCharge: req.body.applyPickupCharge,
    additionalFarePerHrs: req.body.additionalFarePerHrs,
    //updation of Allowence
    cmpyAllowance: req.body.cmpyAllowance,
    discount: req.body.discount,
    offerPerDay: req.body.offerPerDay,
    offerPerUser: req.body.offerPerUser,
  };
  Vehicletype.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { distance: data } },
    { new: true },
    (err, docs) => {
      if (err)
        return res.json({
          success: false,
          message: req.i18n.__("INVAID_REQUEST"),
        });
      return res
        .status(200)
        .json({
          success: true,
          message: req.i18n.__("DETAILS_UPDATE_SUCCESS"),
          data: docs,
        });
    }
  );
};

export const patchdistanceData = (req, res) => {
  Vehicletype.findById(req.params.id, (err, docs) => {
    if (err)
      return res.json({
        success: false,
        message: req.i18n.__("INVAID_REQUEST"),
      });
    var distanceDetails = docs.distance.id(req.params.distanceId);
    distanceDetails.distanceFrom = req.body.distanceFrom;
    distanceDetails.distanceTo = req.body.distanceTo;
    distanceDetails.distanceFareType = req.body.distanceFareType;
    distanceDetails.distanceFarePerKM = req.body.distanceFarePerKM;
    distanceDetails.distanceFarePerFlatRate = req.body.distanceFarePerFlatRate;
    distanceDetails.applyTax = req.body.applyTax;
    distanceDetails.applyWaitingTime = req.body.applyWaitingTime;
    distanceDetails.applyNightCharge = req.body.applyNightCharge;
    distanceDetails.applyPeakCharge = req.body.applyPeakCharge;
    distanceDetails.applyCommission = req.body.applyCommission;
    distanceDetails.applyPickupCharge = req.body.applyPickupCharge;
    distanceDetails.additionalFarePerHrs = req.body.additionalFarePerHrs;
    docs.save((err, doc) => {
      if (err) {
        return res
          .status(500)
          .json({
            success: false,
            message: req.i18n.__("SEVER_ERROR"),
            error: err,
          });
      }
      return res
        .status(200)
        .json({
          success: true,
          message: req.i18n.__("DISTANCE_ADDED_SUCCESS"),
          data: doc,
        });
    });
  });
};

export const putdistanceOfferData = (req, res) => {
  var data = {
    cmpyAllowance: req.body.cmpyAllowance,
    discount: req.body.discount,
    offerPerDay: req.body.offerPerDay,
    offerPerUser: req.body.offerPerUser,
  };
  Vehicletype.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { distance: data } },
    { new: true },
    (err, docs) => {
      if (err)
        return res.json({
          success: false,
          message: req.i18n.__("INVAID_REQUEST"),
        });
      return res
        .status(200)
        .json({
          success: true,
          message: req.i18n.__("DETAILS_UPDATE_SUCCESS"),
          data: docs,
        });
    }
  );
};

export const deletedistanceData = (req, res) => {
  Vehicletype.findOne({ _id: req.params.id }).exec((err, docs) => {
    if (err)
      return res.json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    if (!docs)
      return res.json({
        success: false,
        message: req.i18n.__("DISTANCE_NOT_FOUND"),
        dvr: req.body.driver,
      });
    docs.distance.remove(req.params.distanceId);
    docs.save(function (err, op) {
      if (err)
        return res.json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      return res.json({
        success: true,
        message: req.i18n.__("DELETED_SUCCESS"),
        drivertaxis: docs.taxis,
      });
    });
  });
};

export const patchdistanceOfferData = (req, res) => {
  Vehicletype.findById(req.params.id, (err, docs) => {
    if (err)
      return res.json({
        success: false,
        message: req.i18n.__("INVAID_REQUEST"),
      });
    var distanceDetails = docs.distance.id(req.params.distanceId);

    (distanceDetails.cmpyAllowance = req.body.cmpyAllowance),
      (distanceDetails.discount = req.body.discount),
      (distanceDetails.offerPerDay = req.body.offerPerDay),
      (distanceDetails.offerPerUser = req.body.offerPerUser),
      docs.save((err, doc) => {
        if (err) {
          return res
            .status(500)
            .json({
              success: false,
              message: req.i18n.__("SEVER_ERROR"),
              error: errr,
            });
        }
        return res
          .status(200)
          .json({
            success: true,
            message: req.i18n.__("DISTANCE_ADDED_SUCCESS"),
            data: doc,
          });
      });
  });
};

/**
 * Just List available vehicles for Drivers
 */
export const vehicletypelists = async (req, res) => {
  var likeQuery = {
    // softDel : false
  };
  var driverData = await Driver.findOne({ _id: req.userId }).lean().exec();
  // if(driverData && (driverData.gender == "male" || driverData.gender == "Male")) { likeQuery['type'] = { '$nin' : ["Alo Damas", "AloDamas"] } }
  // if(req.params.type == 'male') likeQuery['type'] = { '$neq' : "Alo Damas" }s
  Vehicletype.find(likeQuery, {})
    .distinct("type")
    .exec((err, docs) => {
      if (err) {
        return res
          .status(500)
          .json({
            success: false,
            message: req.i18n.__("SOME_ERROR"),
            vehiclelists: docs,
          });
      }
      // if(docs.length && driverData && (driverData.gender == "male" || driverData.gender == "Male")) {
      //  docs = _.pullAll(docs, ['Alo Damas']);
      // }
      return res.json({
        success: true,
        message: req.i18n.__("FETECHED_SUCCESS"),
        vehiclelists: docs,
      });
    });
};

export const patchourVehicles = (req, res) => {
  const id = req.params.id;

  var filename = req.body.image;
  if (req["file"] != null) {
    filename = req["file"].path;
  }

  Vehicletype.findOne({ _id: id }).exec((err, doc) => {
    if (err)
      return res.json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    if (!doc)
      return res.json({
        success: false,
        message: req.i18n.__("VEHICLE_NOT_FOUND"),
      });

    (doc.description = req.body.description), (doc.fileForWeb = filename);

    doc.save(function (err, op) {
      if (err)
        return res
          .status(409)
          .json({
            success: false,
            message: req.i18n.__("SOME_ERROR"),
            error: err,
          });
      return res.json({
        success: true,
        message: req.i18n.__("DETAILS_UPDATE_SUCCESS"),
        op,
      });
    });
  });
};

export const getVehicleDataForLiveMeter = async (type) => {
  try {
    var VehicletypeData = await Vehicletype.findOne(
      { type: type },
      {
        _id: 1,
        type: 1,
        tripTypeCode: 1,
        available: 1,
        chargeRatePerMinuteForExceededMinimumWaitingTime: 1,
        allowMinimumWaitingTimeInMinutes: 1,
        isWaitingTimeExceddedChargesApplicable: 1,
        taxPercentage: 1,
        isTax: 1,
        mfare: 1,
        bkm: 1,
        baseFare: 1,
        "distance.distanceTo": 1,
        "distance.distanceFrom": 1,
        "distance._id": 1,
        "distance.distanceFarePerFlatRate": 1,
        "distance.distanceFarePerKM": 1,
        "distance.distanceFareType": 1,
      }
    ).exec();
    return VehicletypeData;
  } catch (error) {
    return [];
  }
};

//Frontend Vehicle Details
export const getvehicleDetails = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  sortQuery["displayorder"] = 1;

  likeQuery["language"] = { $eq: "en" };
  if (req.query.language == "es") likeQuery["language"] = { $eq: "es" };

  let TotCnt = Vehicledetails.find(likeQuery).count();
  let Datas = Vehicledetails.find(likeQuery, { key: 0 })
    .sort(sortQuery)
    .skip(pageQuery.skip)
    .limit(pageQuery.take);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header("x-total-count", promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
};

export const addVehicleDetailsData = (req, res) => {
  var filename;
  if (req["file"] != null) {
    filename = req["file"].path;
  }

  var newDoc = {
    name: req.body.name,
    description: req.body.description,
    priceTag: req.body.priceTag,
    packageDetails: req.body.packageDetails,
    outstationDetails: req.body.outstationDetails,
    fileForWeb: filename,
    file: filename,
    displayorder: req.body.displayorder,
    sliderSection: req.body.sliderSection ? req.body.sliderSection : "first",
    language: req.body.language,
  };

  newDoc = new Vehicledetails(newDoc);

  newDoc.save((err, docs) => {
    if (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: req.i18n.__("SEVER_ERROR"),
          error: err,
        });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: req.i18n.__("DATA_ADDED_SUCCESS"),
        docs,
      });
  });
};

export const patchBasicVehicleDetailsData = (req, res) => {
  const id = req.params.id;

  var filename = req.body.image;
  if (req["file"] != null) {
    filename = req["file"].path;
  }

  Vehicledetails.findOne({ _id: id }).exec((err, doc) => {
    if (err)
      return res.json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    if (!doc)
      return res.json({
        success: false,
        message: req.i18n.__("VEHICLE_NOT_FOUND"),
      });

    (doc.name = req.body.name),
      (doc.description = req.body.description),
      (doc.priceTag = req.body.priceTag),
      (doc.packageDetails = req.body.packageDetails),
      (doc.outstationDetails = req.body.outstationDetails),
      (doc.displayorder = req.body.displayorder),
      (doc.sliderSection = req.body.sliderSection
        ? req.body.sliderSection
        : "first"),
      (doc.file = filename);
    doc.fileForWeb = filename;

    doc.save(function (err, op) {
      if (err)
        return res
          .status(409)
          .json({
            success: false,
            message: req.i18n.__("SOME_ERROR"),
            error: err,
          });
      return res.json({
        success: true,
        message: req.i18n.__("DETAILS_UPDATE_SUCCESS"),
        op,
      });
    });
  });
};

export const deleteVehicleDetailsData = (req, res) => {
  Vehicledetails.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) {
      return res.json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    }
    return res.json({ success: true, message: req.i18n.__("DELETED_SUCCESS") });
  });
};

export const getVehicleName = async (req, res) => {
  var vtype = req.params.type ? req.params.type : "daily";
  var scity = req.params.scity ? req.params.scity : "Default";
  var likeQuery = { tripTypeCode: vtype };
  if (scity) likeQuery["scIds.name"] = { $in: [scity] };
  Vehicletype.find(
    likeQuery,
    { type: 1, scIds: 1 },
    { lean: true },
    async (err, docs) => {
      if (err) {
        return res.json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (docs.length <= 0)
        return res.json({
          success: false,
          message: req.i18n.__("NO_VECHICLE_FOUND"),
          datas: docs,
        });
      else {
        docs = _.map(docs, (el) => {
          el.scity = el.scIds[0].name;
          return el;
        });
        if (featuresSettings.checkDuplication) {
          var filterBy = "type";
          docs = await getPreferedDetails(docs, filterBy);
        }
        return res.json({
          success: false,
          message: req.i18n.__("VEHICLE_LIST"),
          datas: docs,
        });
      }
    }
  );
};
