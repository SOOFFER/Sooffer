import mongoose, { Query } from "mongoose";
var cachegoose = require("cachegoose");

//import models
import Vehicle from "../models/vehicletype.model";
import Rider from "../models/rider.model";
import Trips from "../models/trips.model";
import Driver from "../models/driver.model";
import Promo from "../models/promo.model";
import DriverPayment from "../models/driverpayment.model";
import HotelPayment from "../models/hotelpayment.model";
import Hotel from "./../models/hotel.model";
import ServiceAvailableCities from "../models/serviceAvailableCities.model";
import TripLocation from "../models/tripLocations.model";
import AirportZone from "../models/airportZone.model";
import DriverPerDay from "../models/driverperDay.model";
import Attendance from "../models/attendance.model";
import Wallet from "../models/wallet.model";
import Schedule from "../models/schedules.model";
import ShareRides from "../models/shares.model";
import SafeRide from "../models/saferide.model";
import RiderTaxi from "../models/ridertaxi.model";
import EstimationModel from "../models/estimation.model";
import Paymentflow from "../modules/Paymentsflow/payments.model";

import {
  chargeExistingUserCard,
  test,
  transferAmountNRecharge,
  holdChargeCard,
} from "./stripe";
import { updatePromoCodeUsedLogctrl } from "./promocode";
import * as GFunctions from "./functions";
import {
  myEarningsDriver,
  debitDriverBankTransactions,
  updateDriverWalletCredits,
  updateDriverEarningAtEveryDay,
  myEarningsDriverBasicSplits,
  updateDriverPerDayEarnings,
  updateDriverPerDayOnlineTime,
} from "./driver";
import * as TripHelpers from "./tripHelper";
import * as PackageHelpers from "./package.controller";
import * as CityLimitCalculationHelper from "../helpers/cityLimitCalculation.helper";
import logger from "../helpers/logger";
import { getSupportNo } from "./servicecity.controller";
import {
  getCityBasedVehicleCharge,
  getVehicleChargeApprox,
  getTollFare
} from "./fareCalculation";
import {
  findNearbyDriversAndSendRequest,
  cancelOBOTaxiRequest,
  callTheOBOLoop,
  clearTheTripOBOFlow,
  needToResetDriver,
  needToResetDeclinedDriver,
} from "./onebyonerequest";
import {
  addCancelationAmtToRider,
  updateRiderOldBalanceDetails,
  updateRiderBalanceInMongo,
  addAmtToReferalWallet,
  updateRiderWalletTransaction,
  getRiderWalletDetails,
} from "./rider";
import {
  requestNearbyDriversETA,
  removeDriver_loc_node,
  updateDriverLowCatVechicleWhenSwitch,
  verifyCurTripStatus,
} from "./driver";
import * as paymentCtrl from "./paymentGateway/index";
import labels from "../helpers/labels.helper";
import { updateDriverWallet } from "./driverBank";
import RentalPackage from "../models/rentalPackage.model";
import {
  getRentalEstimationFare,
  getRentalFareEstimationAtTripEnd,
  getOutstationVehicleListWithFare,
  checkDropLocation,
  rentalPackageInvoiceDetails,
} from "../modules/rental/rental.controller";
import { getHotelCommison } from "./reqFrmHote.controller";
import * as smsGateway from "./smsGateway";
import Admin from "../models/admin.model";
import DriverBank from "../models/driverBank.model";
import * as HelperFunc from "./adminfunctions";
import { getVehicleDataForLiveMeter } from "./vehicletype";
import { insidePolygon } from "geolocation-utils";
import { generateTripCode } from "../validations/appValidate";
import { airportZoneFare } from "./servicecity.controller";
import { updateAirportZoneData, updateAirportZoneQueueTime } from "./zoneCtrl";
import { updateHotelWallet } from "./reqFrmHote.controller";
import { checkFirstDriver } from "../modules/safeRide/safeRide.controller";
import { secondDrivertripcurrentStatus } from "../modules/safeRide/safeRide.controller";
import {
  checkdistanceKMFromMeter,
  checkDistanceKMFromPackage,
  getPreferedDetails,
  checkEndMeterPossible,
} from "./common";
// import { saveTemplateToPdf } from './common';

const _ = require("lodash");
const moment = require("moment");
const geolib = require("geolib");
const distance = require("google-distance-matrix");
const firebase = require("firebase");
const config = require("../config");
const featuresSettings = require("../featuresSettings");
const crypto = require("crypto");
const async = require("async");
const cron = require("node-cron");
const turf = require("@turf/turf");
const constantsValues = require("../constants");
const countryDocs = require("../countryDocs");

const noDriverFound = "Our Drivers Are Busy Now Please Try Again"; //Our Drivers Are Busy Now Please Try Again  OR  No Driver Found
const requestTypeMethod = config.requestType;

//cancelation module
import {
  addCancelationStepsToDriver,
  addCancelationStepsToRider,
} from "../modules/cancelation/cancelation.controller";
import { feature } from "@turf/turf";

cachegoose(mongoose, {
  // engine: 'redis',    /* If you don't specify the redis engine,      */
  port: 6379 /* the query results will be cached in memory. */,
  host: "localhost",
});

/**
 * Send Only Available service
 * @input
 * @param
 * @return
 * @response
 */
export const getUserServiceBasicfare = async (req, res) => {
  // var userCity = await  GFunctions.getCityFromLatLon();
  Vehicle.find(
    {
      $and: [
        { $or: [{ loc: "All" }] },
        // { $or: [{loc:  "All" }, { loc : userCity }] }
      ],
    },
    {}
  ).exec((err, docs) => {
    if (err) {
      return res.status(409).json([]);
    }
    return res.json(docs);
  });
};

/**
 * Send All Available service
 * @input
 * @param
 * @return
 * @response
 */
/* export const getServiceBasicfare = async (req, res) => {
  const body = req.body || {};
  var scID, vehicleData = null, where = [], pickupCity = '';

  if (typeof body.tripType === "undefined") {
    body.tripType = 'daily';
  }
  else if (body.tripType === 'rental') {
    where.push({ "rental.isRental": true });
    // var RenatalData = await RentalPackage.findById(body.packageId).exec();
  }

  try {
    if (featuresSettings.isCityWise) {
      // var cityData = await CityLimitCalculationHelper.findCityAndAddress(body.pickupLat, body.pickupLng);
      // pickupCity = cityData.city;
      var ServCity = await getIsServiceAvailableInGivenCity(body);
      if (ServCity.data != null) {
        where.push({ "scIds.name": { "$in": [ServCity.data.city, "Default"] } });
        where.push({ "tripTypeCode": body.tripType });
        pickupCity = ServCity.data.city;

      }
      else return res.status(409).json({ 'success': false, 'message': 'Service Not  ', 'error': ServCity });

    }

    else {
      where.push({ "tripTypeCode": body.tripType })
    }

    vehicleData = await Vehicle.find({ "$or": where }, { _id: 1, type: 1, tripTypeCode: 1, bkm: 1, file: 1, available: 1, isRideLater: 1, rental: 1 }).sort({ displayorder: 1 }).exec(); // @v2TODO pass loc as nul
    // if (body.tripType === 'rental')
    // 	vehicleData.forEach((data) => {
    // 		data["baseFare"] = (RenatalData.Rental_Miles) * (data["rental"]["ForKm"]) + (RenatalData.Rental_Hour) * (data["rental"]["ForHr"])
    // 	})
    //4. Filter Vehicle For Distinct
    vehicleData = GFunctions.getDistinctInArray(vehicleData, 'type'); //Distinct Vehicle Type
    GFunctions.clearObj(body, 0); GFunctions.clearObj(vehicleData);//Clear
    return res.status(200).json({ 'success': true, 'message': 'Fetched successfully.', 'vehicleCategories': vehicleData, 'pickupCity': pickupCity });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("SERVICE_NOT_FOUND"), 'error': error });
  }
} */

/**
 * Services to show in Rider App
 */
export const getServiceBasicfare = async (req, res) => {
  const body = req.body || {};
  var scID,
    vehicleData = null,
    // where = { softDel: false },
    // where = [],
    where = [{ softDel: false }],
    pickupCity = "",
    countryId,
    distanceUnit = config.distanceUnit;
  var supportNo = config.supportNo.toString();
  var showSupportNo = featuresSettings.showSupportNo;

  if (typeof body.tripType === "undefined") {
    body.tripType = "daily";
  }


  try {
    if (featuresSettings.isCityWise) {
      //1. First Find which city pickup address is
      //2. If City is in SC lists (in SC list check for nearby Cities too)
      // return cityData;
      // scId =
      // where.scID = scId
      //3. get vehicles for that City or Get Default Vehicle with (Service Not Avalable Alert)

      // var cityData = await CityLimitCalculationHelper.findCityAndAddress(body.pickupLat, body.pickupLng);

      //1. First Find which city pickup address is
      //2. If City is in SC lists (in SC list check for nearby Cities too)
      // return cityData;
      // scId =
      // where.scID = scId
      //3. get vehicles for that City or Get Default Vehicle with (Service Not Avalable Alert)
      // var cityData = await CityLimitCalculationHelper.findCityAndAddress(body.pickupLat, body.pickupLng);
      // var serviceAvailableCities = await ServiceAvailableCities.findOne({
      // 	'softDelete' : false,
      // 	"$or": [
      // 		{"city"        : cityData.city},
      // 		{"nearby.city" : cityData.city}
      // 	]
      // })

      let availableService = await ServiceAvailableCities.find(
        { softDelete: false, city: { $ne: "Default" } },
        { cityBoundaryPolygon: 1, city: 1 }
      ).lean(); //.distinct('cityBoundaryPolygon')
      //let point = insidePolygon([parseFloat(body.pickupLng), parseFloat(body.pickupLat)], cityBoundaryPolygon)
      let pickPoint = false;
      let availableServiceLength = availableService.length;
      for (let i = 0; i < availableServiceLength; i++) {
        if (
          availableService[i] &&
          availableService[i].cityBoundaryPolygon.length != 0
        ) {
          pickPoint = insidePolygon(
            [parseFloat(body.pickupLng), parseFloat(body.pickupLat)],
            availableService[i].cityBoundaryPolygon
          );
          if (pickPoint) {
            // var data = await Promise.all([getSupportNo("Bangalore")]);
            pickupCity = availableService[i].city;
            scID = availableService[i]._id;
            countryId = availableService[i].countryId;
            break;
          }
        }
      }
      var cityPhno = await getSupportNo(pickupCity);
      if (cityPhno.length) {
        supportNo = cityPhno[0].phone;
        showSupportNo = cityPhno[0].isSupportNoEnable;
      }

      if (!pickPoint) {
        return res.status(409).json({
          success: false,
          message: req.i18n.__("SERVICE_NOT_AVAILABEL_IN_THIS_LOCATION"),
          phone: supportNo,
        });
      }

      if (
        pickPoint &&
        typeof body.dropLat != "undefined" &&
        body.dropLat != "" &&
        typeof body.dropLng != "undefined" &&
        body.dropLng != ""
      ) {
        let dropPoint = false;
        // for (let i = 0; i < availableServiceLength; i++) {
        // if (availableService[i].cityBoundaryPolygon.length != 0 && availableService[i].city == pickupCity) {
        var availableServiceCity = _.find(availableService, {
          city: pickupCity,
        });
        if (
          availableServiceCity &&
          availableServiceCity.cityBoundaryPolygon.length
        ) {
          dropPoint = insidePolygon(
            [parseFloat(body.dropLng), parseFloat(body.dropLat)],
            availableServiceCity.cityBoundaryPolygon
          );
          if (dropPoint) {
            // break
          }
        }
        // }
        // }

        if (!dropPoint) {
          return res.status(409).json({
            success: false,
            message: req.i18n.__("DROP_LOCATION_OUTSIDE_BOUNDARY"),
            phone: supportNo,
          });
        }
      }
      if (req.cityWise == "exists") {
        var serviceExists = _.find(req.scId, mongoose.Types.ObjectId(scID));
        if (!serviceExists)
          return res.status(409).json({
            success: false,
            message: req.i18n.__(
              "NO_PERMISSION_TO_DISPATCH_FROM_THIS_LOCATION"
            ),
            phone: config.supportNo,
          });
      }
      where.push({ "scIds.name": { $in: [pickupCity, "Default"] } });
    }

    // where.tripTypeCode = body.tripType;
    where.push({ tripTypeCode: body.tripType });
    if (req.type == "rider") {
      let data = await Rider.findOne({ _id: req.userId }).lean().exec();
      let gender = data.gender;
      // if (gender == "Female" || gender == "female")
      //   where.push({ gender: gender });
    }
    if (countryId) {
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, {
        countryId: countryId,
      });
      if (filterDocumet.length) {
        distanceUnit = filterDocumet[0].distanceUnit;
      }
    }
    if (featuresSettings.addFareWithServices) {
     
      vehicleData = await Vehicle.find(
        { $and: where },
        {
          _id: 1,
          type: 1,
          tripTypeCode: 1,
          bkm: 1,
          file: 1,
          available: 1,
          isRideLater: 1,
          asppc: 1,
          mfare: 1,
          timeFare: 1,
          baseFare: 1,
          taxPercentage: 1,
          conveyancePerKm: 1,
          features: 1,
          isShareAvailable: 1,
          scIds: 1,
        }
      )
        .sort({ displayorder: 1 })
        .exec(); // @v2TODO pass loc as null
      
      const from = body.pickupLat + "," + body.pickupLng;
      const to = body.dropLat + "," + body.dropLng;
      var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
      if (distanceUnit == "Miles") {
        var distanceInUnit = parseFloat(
          gdmResult.distanceValue * 0.000621371
        ).toFixed(2);
      } else {
        var distanceInUnit = parseFloat(gdmResult.distanceValue / 1000).toFixed(
          2
        );
      }
      var timeInMinutes = parseFloat(gdmResult.timeValue / 60).toFixed(2);
      var newResArray = [];
      vehicleData.forEach(function (u) {
        var vehicleDataParams = {
          perKMRate: u.bkm,
          timeInMinutes: u.timeFare,
          BaseFare: u.baseFare,
          tax: u.taxPercentage,
          minFare: u.mfare,
        };
        var getVehicleChargeApproxio = getVehicleChargeApprox(
          distanceInUnit,
          timeInMinutes,
          vehicleDataParams
        );
        newResArray.push({
          _id: u._id,
          type: u.type,
          tripTypeCode: u.tripTypeCode,
          bkm: u.bkm,
          file: u.file,
          available: u.available,
          isRideLater: u.isRideLater,
          asppc: u.asppc,
          features: u.features,
          totalFare: getVehicleChargeApproxio,
          scity: u.scIds[0].name,
        });
      });

      vehicleData = newResArray;
      // vehicleData.conveyancePerKm = getVehicleChargeApproxio;
    } else if (featuresSettings.addETAtoServicevehicles) {
      vehicleData = await Vehicle.find(
        { $and: where },
        {
          _id: 1,
          type: 1,
          tripTypeCode: 1,
          bkm: 1,
          file: 1,
          available: 1,
          isRideLater: 1,
          asppc: 1,
          mfare: 1,
          timeFare: 1,
          baseFare: 1,
          taxPercentage: 1,
          conveyancePerKm: 1,
          description: 1,
          features: 1,
          isShareAvailable: 1,
          scIds: 1,
        }
      )
        .sort({ displayorder: 1 })
        .exec(); // @v2TODO pass loc as null
      var nearbydriverEta = await requestNearbyDriversETA(
        body.pickupLat,
        body.pickupLng,
        vehicleData
      );
      var newResArray = [];
      vehicleData.forEach(function (u) {
        newResArray.push({
          _id: u._id,
          type: u.type,
          tripTypeCode: u.tripTypeCode,
          bkm: u.bkm,
          file: u.file,
          available: u.available,
          isRideLater: u.isRideLater,
          asppc: u.asppc,
          seats: u.asppc,
          description: u.description,
          features: u.features,
          isShareAvailable: u.isShareAvailable,
          scity: u.scIds[0].name,
          eta: getETAForTheService(nearbydriverEta, u.type),
        });
      });
      // var showall = true;
      // if (req.params.allvehicle == 'daily') showall = false;
      // if ((featuresSettings.tripsAvailable.indexOf("Package") > -1) && showall) {
      // 	newResArray.push({
      // 		_id: 1,
      // 		type: "Rental",
      // 		tripTypeCode: "Rental",
      // 		bkm: 0,
      // 		file: "public/vehicle/file-rental.png",
      // 		available: true,
      // 		isRideLater: true,
      // 		asppc: 5,
      // 		seats: 5,
      // 		description: "",
      // 		features: "",
      // 		isShareAvailable: false,
      // 		eta: "30 Min",
      // 	});
      // }

      // if ((featuresSettings.tripsAvailable.indexOf("Outstation") > -1) && showall && config.enableOutstationFlow) {
      // if ((featuresSettings.tripsAvailable.indexOf("Outstation") > -1) && showall) {
      // 	newResArray.push({
      // 		_id: 2,
      // 		type: "Outstation",
      // 		tripTypeCode: "Outstation",
      // 		bkm: 0,
      // 		file: "public/vehicle/file-outstation.png",
      // 		available: true,
      // 		isRideLater: true,
      // 		asppc: 5,
      // 		seats: 5,
      // 		description: "",
      // 		features: "",
      // 		isShareAvailable: false,
      // 		eta: "30 Min",
      // 	});
      // }

      vehicleData = newResArray;
    } else {
      vehicleData = await Vehicle.find(
        { $and: where },
        {
          _id: 1,
          type: 1,
          tripTypeCode: 1,
          bkm: 1,
          file: 1,
          available: 1,
          isRideLater: 1,
          asppc: 1,
          features: 1,
          isShareAvailable: 1,
          scIds: 1,
        }
      )
        .sort({ displayorder: 1 })
        .exec(); // @v2TODO pass loc as null
    }

    if (featuresSettings.checkDuplication) {
      var filterBy = "type";
      vehicleData = await getPreferedDetails(vehicleData, filterBy);
    }
    //4. Filter Vehicle For Distinct
    // vehicleData = GFunctions.getDistinctInArray(vehicleData, 'type'); //Distinct Vehicle Type
    GFunctions.clearObj(body, 0);
    GFunctions.clearObj(vehicleData); //Clear
    return res.status(200).json({
      success: true,
      message: req.i18n.__("FETCHED_SUCCESSFULY"),
      vehicleCategories: vehicleData,
      pickupCity: pickupCity,
      phone: supportNo,
      showSupportNo: showSupportNo,
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SERVICE_NOT_FOUND"),
      error: error,
      phone: supportNo,
    });
  }
};

function getETAForTheService(array, service) {
  var duration = "NA";
  if (array == "NA") return duration;
  array.forEach(function (obj) {
    if (obj.curService == service) {
      duration = obj.duration;
    }
  });
  return duration;
}
/*
export const getServiceBasicfare = async (req, res) => {
  const body = req.body || {};
  var scID, vehicleData = null, where = [], pickupCity = '';

  if (typeof body.tripType === "undefined") {
    body.tripType = 'daily';
  }
  else if (body.tripType == 'rental') {
    where.push({ "rental.isRental": true });
    // var RenatalData = await RentalPackage.findById(body.packageId).exec();
  }

  try {
    if (featuresSettings.isCityWise) {
      // var cityData = await CityLimitCalculationHelper.findCityAndAddress(body.pickupLat, body.pickupLng);
      // pickupCity = cityData.city;
      var ServCity = await getIsServiceAvailableInGivenCity(body);
      if (ServCity.success) {
        where.push({ "scIds.name": { "$in": [ServCity.data.city, "Default"] } });
        where.push({ "tripTypeCode": body.tripType });
        pickupCity = ServCity.data.city;
      }
      else return res.status(409).json({ 'success': false, 'message': 'Service Not Available', 'error': ServCity });
    }

    else {
      where.push({ "tripTypeCode": body.tripType })
    }

    vehicleData = await Vehicle.find({ "$or": where }, { _id: 1, type: 1, tripTypeCode: 1, bkm: 1, file: 1, available: 1, isRideLater: 1, rental: 1 }).sort({ displayorder: 1 }).exec(); // @v2TODO pass loc as nul
    // if (body.tripType === 'rental')
    // 	vehicleData.forEach((data) => {
    // 		data["baseFare"] = (RenatalData.Rental_Miles) * (data["rental"]["ForKm"]) + (RenatalData.Rental_Hour) * (data["rental"]["ForHr"])
    // 	})
    //4. Filter Vehicle For Distinct
    vehicleData = GFunctions.getDistinctInArray(vehicleData, 'type'); //Distinct Vehicle Type
    GFunctions.clearObj(body, 0); GFunctions.clearObj(vehicleData);//Clear
    return res.status(200).json({ 'success': true, 'message': 'Fetched successfully.', 'vehicleCategories': vehicleData, 'pickupCity': pickupCity });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("SERVICE_NOT_FOUND"), 'error': error });
  }
}
 */

export const getestimationFare1 = (req, res) => {
  Vehicle.findById(req.body.serviceTypeId, function (err, docs) {
    if (err)
      return res.status(500).json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    if (!docs)
      return res.status(409).json({
        success: false,
        message: req.i18n.__("SERVICE_NOT_FOUND"),
        error: err,
      });
    //make it as CB
    const from = req.body.pickupLat + "," + req.body.pickupLng;
    const to = req.body.dropLat + "," + req.body.dropLng;

    var origins = [from];
    var destinations = [to];

    distance.key(config.googleApi);
    distance.units("metric");
    distance.mode("driving");

    distance.matrix(origins, destinations, function (err, distances) {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }
      if (!distances) {
        return res.status(409).json({
          success: false,
          message: req.i18n.__("NO_DISTANCES"),
          distance: 0,
        });
      }
      if (distances.status == "OK") {
        for (var i = 0; i < origins.length; i++) {
          for (var j = 0; j < destinations.length; j++) {
            var origin = distances.origin_addresses[i];
            var destination = distances.destination_addresses[j];
            if (distances.rows[0].elements[j].status == "OK") {
              var basekm = docs.bkm;
              var IniDistance = docs.bkm; //C
              var CostForInitialperkm = docs.bfare; //D
              var InitialWaiting = docs.iniwait;
              var CostForInitialpermin = docs.inipermin;
              var Afterinitialdiatanceperkm = docs.ppm; //G
              var Afterinitialwaitingpermin = docs.ppmin;
              var Minfare = docs.mfare; //J

              var distancecal = distances.rows[i].elements[j].distance.text;
              var distanceVal = distances.rows[i].elements[j].distance.value; //meters
              var duration = distances.rows[i].elements[j].duration.text;
              var durationVal = distances.rows[i].elements[j].duration.value;

              //247 calculation
              var distanceInKM = parseFloat(distanceVal / 1000); //L
              var CostForKM = calCostForKM(
                distanceInKM,
                IniDistance,
                CostForInitialperkm,
                Afterinitialdiatanceperkm
              ); //L,C,D,G = M
              var CostForWaiting = calCostForWaiting(
                0,
                InitialWaiting,
                Afterinitialwaitingpermin,
                CostForInitialpermin
              ); //N,E,H,F = O
              var TotalCost = calTotalCost(CostForKM, CostForWaiting, Minfare); //M,O,J

              if (parseFloat(distanceVal / 1000) > basekm) {
                distanceVal =
                  parseFloat(distanceVal) - parseFloat(basekm * 1000);
              } else {
                distanceVal = 0;
              }

              var distanceFare = parseFloat(
                (parseFloat(docs.ppm) * distanceVal) / 1000
              ).toFixed(2);

              var time = duration;
              var timeFare = parseFloat(
                parseFloat(docs.ppmin) * (durationVal / 60)
              ).toFixed(2);

              var currency = docs.currency;
              var basefare = docs.bfare;
              var discountAmt = req.body.promoAmt; //Amt after checked
              // var subtotal = parseFloat(  parseFloat(basefare) + parseFloat(distanceFare) + parseFloat(timeFare)  + parseFloat(discountAmt) ).toFixed(2);

              return res.json({
                success: true,
                message:
                  "Distance from " +
                  origin +
                  " to " +
                  destination +
                  " is " +
                  distancecal,
                basefare: Minfare,
                distance: distancecal,
                distanceFare: CostForKM,
                time: time,
                timeFare: 0,
                discountAmt: discountAmt,
                subtotal: TotalCost,
                currency: currency,
              });
            } else {
              return res.status(409).json({
                success: false,
                message:
                  destination + " is not reachable by land from " + origin,
                distance: 0,
              });
            }
          }
        }
      }
    });
    //make it as CB
  });
};

/**
 * Estimation for Pickup and Drop location
 * @param {*} req
 * @param {*} res
 */





export const getestimationFare = async (req, res, next) => {
  try {
    /*if (req.body.isMultiLocation == true || req.body.isMultiLocation == 'true') {
      next();
      return
    }*/
    const body = req.body || {};

    var currencySymbol = config.currencySymbol,
      currencyCode = config.currency,
      distanceUnit = config.distanceUnit;
    var distanceSymbol = config.distanceSymbol ? config.distanceSymbol : " KM";
    if (req.userId) {
      var riderDetails = await Rider.findOne({ _id: req.userId }).lean().exec();
      if (riderDetails) {
        var filterDocumet = _.filter(countryDocs.defaultCountrySettings, {
          phoneCode: riderDetails.phcode,
        });
        if (filterDocumet.length) {
          currencySymbol = filterDocumet[0].currencySymbol;
          currencyCode = filterDocumet[0].currencyCode;
          distanceUnit = filterDocumet[0].distanceUnit;
          distanceSymbol = filterDocumet[0].distanceSymbol;
        }
      }
    }
    // var vehicleData = await Vehicle.findById(body.serviceTypeId).exec(); // @v2TODO pass loc as null
    const from = body.pickupLat + "," + body.pickupLng;
    const to = body.dropLat + "," + body.dropLng;



    // if (body.hailRide == true) { } else {
    var serviceExists = await checkServiceAvailableInThisPoints(req, res);
    if (serviceExists.success == false) {

      return res.status(409).json({
        success: false,
        message: req.i18n.__(serviceExists.message),
        outstation: true,
        phone: serviceExists.phone,
      });
    }

    var ServiceId = serviceExists.ScId;
    var findVehicle = await Vehicle.find(
      { "scIds.scId": { $in: ServiceId }, tripTypeCode: body.tripType },
      { _id: 1, type: 1, scIds: 1 }
    ).lean();

    var vehicle = _.filter(findVehicle, { type: body.serviceType });
    if (vehicle.length) {
      vehicle = _.map(vehicle, (el) => {
        el.scity = el.scIds[0].name;
        return el;
      });
      var filterBy = "type";
      vehicle = await getPreferedDetails(vehicle, filterBy);
      body.serviceTypeId = vehicle[0]._id;
    } else {
      return res.status(409).json({
        success: false,
        message: req.i18n.__(
          "SERVICE_NOT_AVAILABLE_FOR_CHOOSEN_VEHICLE_PLEASE_CHOOSE_ANOTHER_VEHICLE"
        ),
        phone: serviceExists.phone,
      });
    }
    // }


    // let a = JSON.parse(body.multiLocation);
    if (req.body.isMultiLocation == true || req.body.isMultiLocation == "true") {
      body.multiLocation = JSON.parse(body.multiLocation);
      var gdmResult = await GFunctions.getDistanceAndTimeFromGDM1(
        body.multiLocation.multiple
      );
    } else {
      if (featuresSettings.calculateZoneFareInEstimation) {
        var gdmResult = await GFunctions.getDistanceAndTimeFromGDMZone(
          [from],
          [to]
        );
      } else {
        var gdmResult = await GFunctions.getDistanceAndTimeFromGDM(
          [from],
          [to]
        );
      }
    }
    if (config.distanceUnit == "Miles") {
      var distanceInUnit = parseFloat(
        gdmResult.distanceValue * 0.000621371
      ).toFixed(2);
    } else {
      var distanceInUnit = parseFloat(gdmResult.distanceValue / 1000).toFixed(
        2
      );
    }

    // distanceInUnit = 10; //DWC

    var timeInMinutes = parseFloat(gdmResult.timeValue / 60).toFixed(2);
    // timeInMinutes = 15; //DWC

    var tripTime = body.time ? body.time : body.tripTime;
    // let tripTime = "18:16"
    let vehicleCharge = await getCityBasedVehicleCharge(
      body.serviceTypeId,
      body.pickupCity,
      distanceInUnit,
      timeInMinutes,
      tripTime,
      0,
      0,
      0,
      null,
      0,
      0,
      req.body.bookingType,
      featuresSettings.calculateZoneFareInEstimation,
      "estimation",
      gdmResult.polyline,
      ServiceId[1]
    );


    // airport fare
    let TotalAirportZoneFare = 0;
    if (featuresSettings.checkAirportZone) {
      let pickupPointAirportZone = await airportZoneFare(
        body.pickupLat,
        body.pickupLng
      );
      let dropPointAirportZone = await airportZoneFare(
        body.dropLat,
        body.dropLng
      );

      if (pickupPointAirportZone.status == true) {
        TotalAirportZoneFare =
          TotalAirportZoneFare + Number(pickupPointAirportZone.airportFare);
      }
      if (dropPointAirportZone.status == true) {
        TotalAirportZoneFare =
          TotalAirportZoneFare + Number(dropPointAirportZone.airportFare);
      }
    }

    gdmResult.distanceLable =
      vehicleCharge.fareDetails.distance + distanceSymbol;
    gdmResult.startCords = [body.pickupLng, body.pickupLat];
    gdmResult.endcoords = [body.dropLng, body.dropLat];
    vehicleCharge.fareDetails.distanceObj = null;

    //add toll fare
    let tollObj = {
      pickupLat:body.pickupLat,
      pickupLng:body.pickupLng,
      dropLat:body.dropLat,
      dropLng:body.dropLng,
    }
    // var tollDetails = await getTollFare(tollObj)
    // const tollFare = (tollDetails && tollDetails.tollCost) ? tollDetails.tollCost : 0 
		// vehicleCharge.fareDetails.tollFare = tollFare;
    // vehicleCharge.fareDetails.totalFare = Number(vehicleCharge.fareDetails.totalFare) + tollFare

    //Deduct Promo amount from total fare
    var promoAmt = 0;
    if (req.body.promoCode) {
      var promoAmtData = await validatePromoForEstimation(
        req.body.promoCode,
        req.body.riderId,
        body,
        vehicleCharge.fareDetails
      );
      if (promoAmtData.success) {
        promoAmt = promoAmtData.discountAmt;
        if (Number(promoAmt) >= Number(vehicleCharge.fareDetails.totalFare)) {
          promoAmt = vehicleCharge.fareDetails.totalFare;
        }
      }
      vehicleCharge.fareDetails.totalFare = (
        Number(vehicleCharge.fareDetails.totalFare) - Number(promoAmt)
      ).toFixed(2); //reduce Signup Discount amt
      vehicleCharge.fareDetails.BalanceFare =
        vehicleCharge.fareDetails.totalFare;
      vehicleCharge.fareDetails.DetuctedFare = Number(promoAmt);
    }
    //Deduct Promo amount from total fare
    // GFunctions.clearObj(body, 0), GFunctions.clearObj(vehicleCharge, 0);

    if (featuresSettings.addOldCancelationAmountInEstimation) {
      //Adding Old Cancelation Charge
      var oldCancelationAmount = 0; //OCC
      // if (req.body.userId != "" || req.body.userId != null || req.body.userId != undefined || typeof req.body.userId != "undefined") {
      if (req.userId != "" || req.userId != null || req.userId != undefined) {
        var riderWallet = await getRiderWalletDetails(req.userId);
        if (riderWallet.success == true)
          oldCancelationAmount = riderWallet.balance;
      }
      if (Number(oldCancelationAmount) > 0) {
        vehicleCharge.fareDetails.oldCancellationAmt =
          Number(oldCancelationAmount);
        vehicleCharge.fareDetails.totalFare = (
          Number(vehicleCharge.fareDetails.totalFare) +
          Number(vehicleCharge.fareDetails.oldCancellationAmt)
        ).toFixed(2);
        vehicleCharge.fareDetails.BalanceFare =
          vehicleCharge.fareDetails.totalFare;
      }
    }

    var newDoc = new EstimationModel({
      distanceDetails: gdmResult,
      vehicleDetailsAndFare: vehicleCharge,
    });

    var savedDoc = await newDoc.save();
    var estimationId = "";

    if (savedDoc) {
      estimationId = savedDoc._id;
    }

    var vfareDetails = convertAllNumbersToString(vehicleCharge.fareDetails);
    vehicleCharge.fareDetails = vfareDetails;
    return res.status(200).json({
      success: true,
      message: req.i18n.__("ESTIMATION_FARE_DETAILS"),
      distanceDetails: gdmResult,
      vehicleDetailsAndFare: vehicleCharge,
      pickupCity: body.pickupCity,
      estimationId: estimationId,
      airportZoneFare: TotalAirportZoneFare,
      gstLabel: "GST and Toll is applicable",
      multiLocation: body.multiLocation ? body.multiLocation.multiple : "",
      isMultiLocation: body.isMultiLocation ? body.isMultiLocation : false,
      currencySymbol: currencySymbol,
      currencyCode: currencyCode,
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("ERROR_GETTING_ESTIMATION_FARE"),
      error: error,
    });
  }
};

/**
 * Convert numbers in given obj to String
 * @param {*} fareDetails
 */
function convertAllNumbersToString(fareDetails) {
  fareDetails = _.mapValues(fareDetails, function (v) {
    if (typeof v === "number") {
      return v.toFixed(2);
    } else {
      return v;
    }
  }); //Round all to 2 Decimals
  return fareDetails;
}

/**
 * Estimation for Pickup and Multi Drop location
 * @param {*} req
 * @param {*} res
 */
export const getestimationFareMultiDrop = async (req, res) => {
  try {
    const body = req.body || {};


    body.multiLocation = JSON.parse(body.multiLocation);

    // var vehicleData = await Vehicle.findById(body.serviceTypeId).exec(); // @v2TODO pass loc as null
    var gdmResult = await GFunctions.getDistanceAndTimeFromGDM1(
      body.multiLocation.multiple
    );

    if (config.distanceUnit == "Miles") {
      var distanceInUnit = parseFloat(
        gdmResult.distanceValue * 0.000621371
      ).toFixed(2);
    } else {
      var distanceInUnit = parseFloat(gdmResult.distanceValue / 1000).toFixed(
        2
      );
    }

    var timeInMinutes = parseFloat(gdmResult.timeValue / 60).toFixed(2);
    var tripTime = body.time ? body.time : body.tripTime;

    let vehicleCharge = await getCityBasedVehicleCharge(
      body.serviceTypeId,
      body.pickupCity,
      distanceInUnit,
      timeInMinutes,
      tripTime,
      0,
      [],
      0,
      null,
      0,
      0,
      req.body.bookingType
    );

    var distanceSymbol = config.distanceSymbol ? config.distanceSymbol : " KM";

    gdmResult.distanceLable =
      vehicleCharge.fareDetails.distance + distanceSymbol;
    gdmResult.startCords = [body.pickupLng, body.pickupLat];
    gdmResult.endcoords = [body.dropLng, body.dropLat];
    vehicleCharge.fareDetails.distanceObj = null;
    // gdmResult.to = gdmResult.to[gdmResult.to.length-1]

    //gdmResult.distanceLable = vehicleCharge.fareDetails.distance + distanceUnit;
    // var endStop=[];
    // endStop.push(body.dropLng, body.dropLat)
    // gdmResult.startCords = [body.pickupLng, body.pickupLat];
    // gdmResult.endcoords  = body.multiple;
    // //vehicleCharge.fareDetails.distanceObj = null;

    // GFunctions.clearObj(body, 0), GFunctions.clearObj(vehicleCharge, 0);

    var newDoc = new EstimationModel({
      distanceDetails: gdmResult,
      vehicleDetailsAndFare: vehicleCharge,
    });

    var savedDoc = await newDoc.save();
    var estimationId = "";

    if (savedDoc) {
      estimationId = savedDoc._id;
    }

    var vfareDetails = convertAllNumbersToString(vehicleCharge.fareDetails);
    vehicleCharge.fareDetails = vfareDetails;

    return res.status(200).json({
      success: true,
      message: req.i18n.__("ESTIMATION_FARE_DETAILS"),
      distanceDetails: gdmResult,
      vehicleDetailsAndFare: vehicleCharge,
      pickupCity: body.pickupCity,
      estimationId: estimationId,
      multiLocation: body.multiLocation.multiple,
      isMultiLocation: body.isMultiLocation,
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("ERROR_GETTING_ESTIMATION_FARE"),
      error: error,
    });
  }
};

/**
 *
 * CostForKM
 * //L,C,D,G
 * @param {*} distanceInKM
 * @param {*} IniDistance
 * @param {*} CostForInitialperkm
 * @param {*} Afterinitialdiatanceperkm
 * @returns =IF(L4>C4,(L4-C4)*G4+D4,D4)
 */
function calCostForKM(
  distanceInKM,
  IniDistance,
  CostForInitialperkm,
  Afterinitialdiatanceperkm
) {
  distanceInKM = parseFloat(distanceInKM);
  IniDistance = parseFloat(IniDistance);
  CostForInitialperkm = parseFloat(CostForInitialperkm);
  Afterinitialdiatanceperkm = parseFloat(Afterinitialdiatanceperkm);
  if (distanceInKM > IniDistance) {
    var costForKM =
      (distanceInKM - IniDistance) * Afterinitialdiatanceperkm +
      CostForInitialperkm;
    return parseFloat(costForKM).toFixed(2);
  } else {
    return parseFloat(CostForInitialperkm).toFixed(2);
  }
}

/**calostForWaiting
 * //N,E,H,F
 * @param {*} waitingMin
 * @param {*} InitialWaiting
 * @param {*} Afterinitialwaitingpermin
 * @param {*} CostForInitialpermin
 * =IF(N4>E4,(N4-E4)*H4+F4,IF(N4>0,F4,0))
 */
function calCostForWaiting(
  waitingMin,
  InitialWaiting,
  Afterinitialwaitingpermin,
  CostForInitialpermin
) {
  waitingMin = parseFloat(waitingMin);
  waitingMin = waitingMin / 60;
  waitingMin = waitingMin.toFixed(2);
  waitingMin = parseFloat(waitingMin);
  InitialWaiting = parseFloat(InitialWaiting);
  Afterinitialwaitingpermin = parseFloat(Afterinitialwaitingpermin);
  CostForInitialpermin = parseFloat(CostForInitialpermin);
  if (waitingMin > InitialWaiting) {
    var waitingCost =
      (waitingMin - InitialWaiting) *
      (Afterinitialwaitingpermin + CostForInitialpermin);
    return parseFloat(waitingCost).toFixed(2);
  } else {
    if (waitingMin > 0) {
      return CostForInitialpermin;
    } else {
      return 0;
    }
  }
}

/**calTotalCost
 * //M,O,J
 * @param {*} CostForKM
 * @param {*} CostForWaiting
 * @param {*} Minfare
 * =IF((M4+O4)>J4,M4+O4,J4)
 */
function calTotalCost(CostForKM, CostForWaiting, Minfare) {
  CostForKM = parseFloat(CostForKM);
  CostForWaiting = parseFloat(CostForWaiting);
  Minfare = parseFloat(Minfare);
  if (CostForKM + CostForWaiting > Minfare) {
    return CostForKM + CostForWaiting;
  } else {
    return Minfare;
  }
}

/**
 * Set Current Taxi
 * @input
 * @param
 * @return
 * @response
 */
export const setCurrentTaxi = (req, res) => {
  freeTheDriver(req.userId);
  Driver.findById(req.userId, function (err, docs) {
    if (err)
      return res.status(500).json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    if (!docs)
      return res
        .status(409)
        .json({ success: false, message: req.i18n.__("DRIVER_NOT_FOUND") });

    // updateOnlineInFB(1, req.userId, docs.curService,false);//Remove old vehicle in firebase

    var taxi = docs.taxis.id(req.body.makeid);

    var obj = "";
    docs.currentTaxi = req.body.makeid;
    docs.curService = taxi.vehicletype;
    // docs.curService = taxi.vehicletype;
    docs.serviceStatus = taxi.taxistatus;
    docs.share = taxi.share;
    docs.noofshare = taxi.noofshare;
    docs.curVehicleNo = taxi.licence ? taxi.licence : taxi.registrationnumber;
    docs.others1 = taxi.others1;
    docs.isDaily = taxi.isDaily;
    docs.isRental = taxi.isRental;
    docs.isOutstation = taxi.isOutstation;
    if (featuresSettings.lowerCategoryCanUse.sedanToMini) {
      docs.currentCategoryOptions = taxi.lowCategoryOptions;
    }
    docs.save(function (err, op) {
      if (err)
        return res.json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      else {
        removeDriver_loc_node(taxi.vehicletype, req.userId);
        updateDriverLowCatVechicleWhenSwitch(
          req.userId,
          req.body.makeid,
          taxi.vehicletype
        );
        return res.json({
          success: true,
          message: req.i18n.__("TAXI_CHANGED_SUCCESSFULLY"),
        });
      }
    });
  });
};

/**
 * Set Driver online or offline
 * @param {*} req
 * @param {*} res
 */
export const setOnlineStatus = async (req, res) => {
  var status = req.body.status;
  var lastUpdate = null;
  if (status == "1" || status == 1) {
    lastUpdate = GFunctions.getRespCountryDateTime();
  }
  var update = {
    online: req.body.status,
    lastUpdate: GFunctions.getRespCountryDateTime(),
    offlineByCron: false,
  };
  var QueryStatus = true;
  if (req.body.status == 1 || req.body.status == "1") QueryStatus = true;
  if (req.body.status == 0 || req.body.status == "0") QueryStatus = false;
  var driverData = await Driver.findOne(
    { _id: req.userId },
    { online: 1, isSubcriptionActive: 1, status: 1 }
  )
    .lean()
    .exec();
  if (
    driverData &&
    driverData.online != QueryStatus &&
    driverData.isSubcriptionActive == true &&
    driverData.status[0].docs == "Accepted"
  ) {
    if (featuresSettings.updateDriverPerDayOnlineTime) {
      updateDriverPerDayOnlineTime(req.userId, status);
    }
  }
  await Driver.findOneAndUpdate(
    { _id: req.userId, "status.docs": "Accepted", /*isSubcriptionActive: true */ },
    update,
    { new: false },
    (err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (!doc) {
        return res.status(409).json({
          success: false,
          message: req.i18n.__("APPROVE THE DRIVER FROM ADMIN"),
        });
      }
      GFunctions.getDriverFBStatusAndUpdate(req.userId, req.body.status);
      if (req.body.status == 0)
        return res.json({ success: true, message: req.i18n.__("OFFLINE") });
      if (req.body.status == 1) {
        if (
          doc.wallet <
          Number(featuresSettings.driverPayouts.driverCreditAmountOfflineLimit)
        ) {
          setAsOfflineStatus(0, req.userId);
          return res.json({
            success: false,
            message: req.i18n.__("LOW BALANCE"),
          });
        } else {
          verifyCurTripStatus(doc);
          return res.json({ success: true, message: req.i18n.__("ONLINE") });
        }
      }
    }
  );
};

export const setAsOfflineStatus = async (status = 0, userId) => {
  var update = {
    online: status,
  };
  var QueryStatus = true;
  if (req.body.status == 1 || req.body.status == "1") QueryStatus = true;
  if (req.body.status == 0 || req.body.status == "0") QueryStatus = false;
  var driverData = await Driver.findOne({
    _id: req.userId,
    online: QueryStatus,
  })
    .lean()
    .exec();
  if (!driverData && featuresSettings.updateDriverPerDayOnlineTime) {
    updateDriverPerDayOnlineTime(req.userId, status);
  }
  Driver.findOneAndUpdate(
    { _id: userId },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
      }
      GFunctions.getDriverFBStatusAndUpdate(userId, status);
    }
  );
};

/**
 * Set Driver Current location
 * @param {*} req
 * @param {*} res
 */
export const DriverLocation = async (req, res) => {
  const today = moment().utcOffset(config.utcOffset).format("YYYY-MM-DD");
  // start today
  var start = `${today}T00:00:00.000Z`;
  // end today
  var end = `${today}T23:59:59.999Z`;
  let attendanceExist = false;
  if (featuresSettings.checkAttendance) {
    const responceData = await Attendance.findOne({
      driverId: mongoose.Types.ObjectId(req.userId),
      date: { $gte: start, $lte: end },
    })
      .lean()
      .exec();

    //API for driver location
    if (responceData && responceData.dailyAttendance) {
      attendanceExist = true;
    }
  }

  if (req.body.status == 0) {
    if (req.body.lat != "0.0") {
      DriverLocationOffline(req, res, attendanceExist);
      return true;
    }
    {
      return res.status(409).json({
        success: false,
        message: req.i18n.__("LOCATION_NOT_VALID"),
      });
    }
  } else {
    var driverLat = parseFloat(req.body.lat);
    var driverLng = parseFloat(req.body.lon);
    if (driverLat && driverLng) {
      var update = {
        online: req.body.status,
        coords: [driverLng, driverLat],
        lastUpdate: GFunctions.getRespCountryDateTime(),
        "driverLocation.coordinates": [driverLng, driverLat],
        offlineByCron: false,
      };
      Driver.findOneAndUpdate(
        {
          _id: req.userId,
          "status.docs": "Accepted",
          // isSubcriptionActive: true,
          wallet: {
            $gt: featuresSettings.driverPayouts.driverCreditAmountOfflineLimit,
          },
        },
        update,
        {
          new: false,
        },
        (err, doc) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: req.i18n.__("SOME_ERROR"),
              error: err,
            });
          }
          if (doc) {
            if (featuresSettings.airportZoneQueue) {
              if (Number(req.body.status) == 1) {
                //
                updateAirportZoneData(req.userId, driverLat, driverLng);
              }
            }
            if (featuresSettings.updateTripPaths) {
              if (doc.curTrip) {
                findAndUpdateTripLocation(doc.curTrip, driverLat, driverLng);
              }
            }
            return res.json({
              success: true,
              message: req.i18n.__("LOCATION_CHANGED_SUCCESSFULLY"),
              Attendance: attendanceExist,
            });
          } else {
            return res.status(409).json({
              success: false,
              message: req.i18n.__("LOCATION_NOT_UPDATED"),
            });
          }
        }
      );
    } else {
      return res.status(409).json({
        success: false,
        message: req.i18n.__("LOCATION_NOT_VALID"),
      });
    }
  }
};

export const DriverLocationOffline = (req, res, attendanceExist) => {
  var driverLat = parseFloat(req.body.lat);
  var driverLng = parseFloat(req.body.lon);
  if (driverLat && driverLng) {
    var update = {
      online: 0,
      coords: [driverLng, driverLat],
      "driverLocation.coordinates": [driverLng, driverLat],
      offlineByCron: false,
      lastUpdate: GFunctions.getRespCountryDateTime(),
    };
    Driver.findOneAndUpdate(
      {
        _id: req.userId,
      },
      update,
      {
        new: false,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: req.i18n.__("SOME_ERROR"),
            error: err,
          });
        }
        if (doc) {
          return res.json({
            success: true,
            message: req.i18n.__("LOCATION_CHANGED_SUCCESSFULLY"),
            Attendance: attendanceExist,
          });
        } else {
          return res.status(409).json({
            success: false,
            message: req.i18n.__("LOCATION_NOT_UPDATED"),
          });
        }
      }
    );
  } else {
    return res.status(409).json({
      success: false,
      message: req.i18n.__("LOCATION_NOT_VALID"),
    });
  }
};

/**
 * [Taxi Request from User] = Checked
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const requestTaxi = async (req, res, next) => {
  try {
    console.log("REQUEST_BODY",JSON.stringify(req.body))
    const body = req.body || {};
    var countryId,
      currencySymbol = config.currencySymbol;

    var multi = [];
    var waypoint_one = [];
    var waypoint_two = []
    if (
      req.body.isMultiLocation == true ||
      req.body.isMultiLocation == "true"
    ) {
      //next();
      //return
      var multiLocationObj = JSON.parse(body.multiLocation);
      if (typeof multiLocationObj.multiple == "string") {
        multi = JSON.parse(multiLocationObj.multiple);
        if (multi[1] && multi[2]) {
          waypoint_one.push(multi[1].doubleLng, multi[1].doubleLat)
          waypoint_two.push(multi[2].doubleLng, multi[2].doubleLat)
        }

      } else {
        multi = multiLocationObj.multiple;
        if (multi[1] && multi[2]) {
          waypoint_one.push(multi[1].doubleLng, multi[1].doubleLat)
          waypoint_two.push(multi[2].doubleLng, multi[2].doubleLat)
        }

      }
    }

    let response = await checkTripBalance(req,res);

    if(response && response.status == false || response && response.success == false) {
      return res
      .status(response.code)
      .json({ success: false, message: response.message });
    }
    var ServiceId = { ScId: null, pickupCity: "", countryId: "" };

    // if ((body.vehicleDetailsAndFare['fareDetails']['acneeded']).toString() == "false" || !body.vehicleDetailsAndFare['fareDetails']['acneeded']) acneeded = "false";
    if (featuresSettings.isCityWise) {
      ServiceId = await checkPickupPointsServiceId(
        body.distanceDetails["startCords"]
      );
      var updateRiderScId = await Rider.findOneAndUpdate(
        { _id: req.userId },
        { scId: ServiceId.ScId, scity: ServiceId.pickupCity }
      );
      countryId = ServiceId.countryId;
    }
    var filterDocument = _.filter(countryDocs.defaultCountrySettings, {
      countryId: countryId,
    });
    if (filterDocument.length)
      currencySymbol = filterDocument[0].currencySymbol;

    if (!body.promo == "") {
      var promoAmtData = await Promo.findOne(
        { code: body.promo },
        { amount: 1, code: 1, tripType: 1 }
      ).exec();
      if (promoAmtData) {
        body.promoAmt = promoAmtData.amount;
        var tripType = promoAmtData.tripType;
        if (tripType && tripType.length) {
          var isTripTypeIncludes = _.includes(tripType, body.tripType);
          if (!isTripTypeIncludes)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("CODE_NOT_VALID_FOR_THIS_TRIP"),
              discountAmt: 0,
            }); //Code Not available for requested city
        }
        if (promoAmtData.amountType == "percentage") {
          var tripAmount =
            body.vehicleDetailsAndFare["fareDetails"]["totalFare"];
          var discountAmt = tripAmount * (promoAmtData.percentage / 100);
          if (discountAmt > promoAmtData.percentageAmountLimit)
            body.promoAmt = promoAmtData.percentageAmountLimit;
          else body.promoAmt = discountAmt;
        }
      }
    }

    var riderDoc = null;
    if (body.bookingType == "rideLater") {
      riderDoc = await Rider.findById(req.userId).exec();
    }

    var startCoords = body.distanceDetails["startCords"];
    var endCoords = body.distanceDetails["endcoords"];
    // airport fare
    let TotalAirportZoneFare = 0;
    if (featuresSettings.checkAirportZone) {
      // var startData = await CityLimitCalculationHelper.findCityAndAddress(startCoords[1], startCoords[0]);
      // var endData = await CityLimitCalculationHelper.findCityAndAddress(endCoords[1], endCoords[0]);

      let pickupPointAirportZone = await airportZoneFare(
        startCoords[1],
        startCoords[0]
      );
      let dropPointAirportZone = await airportZoneFare(
        endCoords[1],
        endCoords[0]
      );

      if (pickupPointAirportZone.status == true) {
        TotalAirportZoneFare =
          TotalAirportZoneFare + Number(pickupPointAirportZone.airportFare);
      }
      if (dropPointAirportZone.status == true) {
        TotalAirportZoneFare =
          TotalAirportZoneFare + Number(dropPointAirportZone.airportFare);
      }
    }
    var pickupCharge = body.manualPickupCharge
      ? body.manualPickupCharge
      : body.vehicleDetailsAndFare["fareDetails"]["pickupCharge"];

    //update Cost value
    // body.vehicleDetailsAndFare["fareDetails"]["totalFare"] =
    //   Number(body.vehicleDetailsAndFare["fareDetails"]["totalFare"]) +
    //   Number(TotalAirportZoneFare) +
    //   Number(pickupCharge);
    // var TripCode = await generateTripCode(ServiceId.ScId)

    //safe  Ride  or Two Drivers Request//
    if (req.body.safeRide == "false") {
      var safeRideDataObj = { safeRidestatus: false };
    }
    if (req.body.safeRide == false) {
      var safeRideDataObj = { safeRidestatus: false };
    }
    if (req.body.safeRide == "true") {
      req.body.safeRide = true;
    }
    var safeRideBool = req.body.safeRide;

    // var safeRideDataObj = { safeRidestatus: false }; /// If safeRide is false
    if (safeRideBool) {
      /// If safe Ride is True //
      if (req.body.vehicleId) {
        var safeRideVehicleId = req.body.vehicleId;
        var safeRideData = await RiderTaxi.findOne({ _id: safeRideVehicleId });
        if (safeRideData) {
          var safeRideDataObj = {
            safeRidestatus: true,
            safeRidevehicle: {
              model: safeRideData.model,
              number: safeRideData.number,
              makename: safeRideData.makename,
              vehiclecolor: safeRideData.vehiclecolor || "Yellow",
            },
          };
        } else {
          return res.status(409).json({
            success: false,
            message: req.i18n.__("VEHICLE NOT FOUND ADD VECHICLE DETAILS"),
            error: error.toString(),
          });
        }
      }
    }

    //add toll cost
    let tollObj = {
      pickupLat:body.distanceDetails.startCords[1],
      pickupLng:body.distanceDetails.startCords[0],
      dropLat:body.distanceDetails.endcoords[1],
      dropLng:body.distanceDetails.endcoords[0],
    }
    var tollDetails = await getTollFare(tollObj)

    // const tollFare = (tollDetails && tollDetails.tollCoordinates) ? tollDetails.tollCost : 0 ;
    let tollFare
    if(tollDetails.success != false && tollDetails && tollDetails.tollCoordinates.length != 0){
      tollFare = tollDetails.tollCoordinates[0].toll
    }
    else{
      tollFare = 0
    }
    // let transactionID = await Paymentflow.find({userId:mongoose.Types.ObjectId(req.userId)}).sort({createdAt:-1})
    // let id = null;
    // if(transactionID.length !=0) {
    //   id = transactionID[0]._id;
    // }
    var newDoc = new Trips({
      // tripno: await TripHelpers.getTripNo(),
      // tripCode: TripCode,
      safeRideData: safeRideDataObj,
      requestFrom: body.requestFrom,
      requestId: body.adminId ? body.adminId : "",
      triptype: body.tripType,
      bookingType: body.bookingType,
      bookingFor: body.bookingFor,
      notes: body.notesToDriver ? body.notesToDriver : "",
      other: {
        ph: body.otherPh ? body.otherPh : "",
        phCode: body.otherPhCode ? body.otherPhCode : "",
        name: body.otherName ? body.otherName : "",
      },
      date: req.body.tripShownDate,
      cpy: null,
      cpyid: null,
      dvr: null,
      dvrid: null,
      rid: req.name,
      ridid: req.userId,
      ridergender: req.body.drivergender,
      hotelid: req.body.hotelId ? req.body.hotelId : null,
      fare: body.vehicleDetailsAndFare["fareDetails"]["totalFare"],
      vehicle: body.vehicleDetailsAndFare["vehicleDetails"]["type"],
      service: body.vehicleDetailsAndFare["vehicleDetails"]["serviceId"],
      paymentMode: body.paymentMode,
      csp: {
        //Cost split up RFCNG
        base: body.vehicleDetailsAndFare["fareDetails"]["BaseFare"]
          ? body.vehicleDetailsAndFare["fareDetails"]["BaseFare"]
          : 0,
        dist: body.distanceDetails["distanceValue"],
        minFareAdded: body.vehicleDetailsAndFare["fareDetails"]["minFareAdded"],
        minFare: body.vehicleDetailsAndFare["fareDetails"]["minFare"],
        distfare: body.vehicleDetailsAndFare["fareDetails"]["KMFare"],
        perKmRate: body.vehicleDetailsAndFare["fareDetails"]["perKMRate"],
        travelRate: body.vehicleDetailsAndFare["fareDetails"]["travelRate"],
        travelFare: body.vehicleDetailsAndFare["fareDetails"]["travelFare"],
        time: body.distanceDetails["timeValue"],
        timefare: body.vehicleDetailsAndFare["fareDetails"]["waitingFare"],
        comison: body.vehicleDetailsAndFare["fareDetails"]["comison"],
        booking: body.vehicleDetailsAndFare["fareDetails"]["bookingFare"],
        promoamt: body.promoAmt,
        promo: body.promo,
        cost: body.vehicleDetailsAndFare["fareDetails"]["totalFare"],
        conveyance: pickupCharge,
        tax: body.vehicleDetailsAndFare["fareDetails"]["tax"],
        taxPercentage:
          body.vehicleDetailsAndFare["fareDetails"]["taxPercentage"],
        taxTDS: body.vehicleDetailsAndFare["fareDetails"]["taxTDS"]
          ? body.vehicleDetailsAndFare["fareDetails"]["taxTDS"]
          : 0,
        taxTDSPercentage: body.vehicleDetailsAndFare["fareDetails"][
          "taxTDSPercentage"
        ]
          ? body.vehicleDetailsAndFare["fareDetails"]["taxTDSPercentage"]
          : 0,
        via: body.paymentMode ? body.paymentMode : "cash",
        driverCancelFee:
          body.vehicleDetailsAndFare["fareDetails"]["cancelationFeesDriver"],
        riderCancelFee:
          body.vehicleDetailsAndFare["fareDetails"]["cancelationFeesRider"],
        isNight:
          body.vehicleDetailsAndFare["fareDetails"]["nightObj"]["isApply"],
        isPeak: body.vehicleDetailsAndFare["fareDetails"]["peakObj"]["isApply"],
        nightPer:
          body.vehicleDetailsAndFare["fareDetails"]["surgeAmt"],
        peakPer:
          body.vehicleDetailsAndFare["fareDetails"]["peakObj"][
          "percentageIncrease"
          ],
        surgeAmt: body.vehicleDetailsAndFare["fareDetails"]["surgeAmt"]
          ? body.vehicleDetailsAndFare["fareDetails"]["surgeAmt"]
          : 0,
        currency: body.vehicleDetailsAndFare["fareDetails"]["currency"]
          ? body.vehicleDetailsAndFare["fareDetails"]["currency"]
          : config.currency,
        hotelcommision: body.vehicleDetailsAndFare["fareDetails"][
          "hotelcommisionAmt"
        ]
          ? body.vehicleDetailsAndFare["fareDetails"]["hotelcommisionAmt"]
          : 0,
        oldBalance: body.vehicleDetailsAndFare["fareDetails"][
          "oldCancellationAmt"
        ]
          ? body.vehicleDetailsAndFare["fareDetails"]["oldCancellationAmt"]
          : 0, //OLD Cancelation amount
      },
      dsp: {
        estTime: body.distanceDetails["timeLable"],
        distanceKM: body.vehicleDetailsAndFare["fareDetails"]["distance"]
          ? body.vehicleDetailsAndFare["fareDetails"]["distance"]
          : "NA",
        start: body.distanceDetails["from"],
        end: body.distanceDetails["to"],
        startcoords: body.distanceDetails["startCords"],
        endcoords: body.distanceDetails["endcoords"],
        waypoint_one: waypoint_one,
        waypoint_two: waypoint_two
      },
      estTime: body.distanceDetails["timeLable"],
      status: "processing",
      tripOTP: [
        GFunctions.sendRandomizeCode("0", 4),
        GFunctions.sendRandomizeCode("0", 4),
      ],
      scId: ServiceId.ScId,
      scity: ServiceId.pickupCity,
      tripDT: body.tripDT,
      utc: body.utc,
      tripFDT: body.tripFDT,
      gmtTime: body.gmtTime,
      noofseats: body.noofseats,
      driverAssignmentType: body.driverAssignmentType,
      multiLocation: multi,
      isMultiLocation: body.isMultiLocation ? body.isMultiLocation : false,
      countryId: countryId,
      currencySymbol: currencySymbol,
      paymentMethod: body.paymentMethod,
      // paymentId: id,
      acsp:{
        tollFee:Number(tollFare)
      }
    });
    newDoc.save(async(err, tripdata) => {
      console.log("tripdata---",tripdata);
      
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }
      // if(body.paymentMethod == 'card'){
      //   let paymentId = await Paymentflow.find({ userId: mongoose.Types.ObjectId(req.userId), referenceId: "", "status": "initiated" }).sort({ createdAt: -1 }).lean().exec();
      //   let updateReferenceId = await Paymentflow.findOneAndUpdate({ _id: mongoose.Types.ObjectId(paymentId[0]._id) }, { referenceId: tripdata._id }).sort({ createdAt: -1 }).exec();
      // }

      const safeRidestatus = tripdata.safeRideData.safeRidestatus;
      if (tripdata) {
        updatesafeRideDataInFB(tripdata, safeRidestatus);
      }
      var msg = "TAXI_REQUEST_SENT";
      if (body.bookingType != "rideLater") {
        updateRiderFbStatus(
          req.userId,
          "Processing",
          tripdata._id,
          body.tripType
        ); //processing = Req intermediate state

        if (requestTypeMethod == "onebyone") {
          const gender = req.body.drivergender;
          findNearbyDriversAndSendRequest(
            tripdata,
            body,
            req.userId,
            body.distanceDetails["startCords"][0],
            body.distanceDetails["startCords"][1],
            body.serviceType,
            gender
          ); //For One By One
        } else {
          requestNearbyDrivers(tripdata, body, req.userId);
        }
      } else if (body.bookingType == "rideLater") {
        var msg = "DAILT_TAXI_REQUEST_SCH";
        // setInCRON(tripdata._id, tripdata);
        if (body.bookingType == "rideLater" && riderDoc != null) {
          smsGateway.sendSmsMsg(
            riderDoc.phone,
            "",
            riderDoc.phcode,
            "",
            "rideLaterReceived",
            { TRIPNO: tripdata.tripno }
          );
          findAndSendFCMToRider(
            req.userId,
            "Your Ride Later request received,we will assign Driver before Trip Time.",
            "rideLaterReceived"
          );
        }
      }

      findAndSendFCMToAllAdmin(
        "newRequest",
        "New Trip Request Daily, " + tripdata.tripno
      );

      return res.status(200).json({
        success: true,
        message: req.i18n.__(msg),
        requestDetails: tripdata._id,
        tripId: tripdata.tripno,
      });
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
};

async function checkTripBalance(req,res) {
  let obj = {
   "code": 500, 'success': false, 'message': req.i18n.__("Insufficient Balance")
  }
  let body = req.body;
  let tripFare =  Math.round(body.vehicleDetailsAndFare["fareDetails"]["totalFare"])
  if(body.paymentMode && body.paymentMode == 'wallet') {
    let walletdata = await Wallet.findOne({ridid:mongoose.Types.ObjectId(req.userId)});
    if(walletdata) {
      let walletbalance = walletdata.bal;
      if(tripFare>walletbalance) {
        return obj
      }
    }
  }
  if(body.paymentMode && body.paymentMode == 'card'){
    let res = await paymentCtrl.holdChargeExistingRiderCard({
      mode: config.paymentGateway.paymentGatewayName || "",
      userId : req.userId,
      userType : "user",
      paymentType : "trip",
      status : "initiated",
      
      currency : "USD",
      amount : tripFare,

      referenceId : "",
      description : `Trip Payment`,
    });
    console.log("res---",res);
    
    if(res && res.status == false) {
return res  
}
  }
}

/// Update firebase for safe Ride Data////

function updatesafeRideDataInFB(tripdata, safeRidestatus) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data");
  var requestData = {
    safeRideData: {
      safeRidestatus: tripdata.safeRideData.safeRidestatus,
    },
    multiplestop: tripdata.isMultiLocation

  };
  if (safeRidestatus == "true") {
    requestData = {
      safeRideData: {
        safeRidestatus: tripdata.safeRideData.safeRidestatus,
        safeRidevehicle: tripdata.safeRideData.safeRidevehicle,
      },
    };
  }
  if (safeRidestatus == "false" || safeRidestatus == false) {
    requestData = {
      safeRideData: {
        safeRidestatus: tripdata.safeRideData.safeRidestatus,
      },
    };
  }
  var child = tripdata.tripno.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);

  usersRef.update(requestData, function (error) {
    if (error) {
      logger.error(error);
    } else {
    }
  });
}

/**
 * [Taxi Request from User] = MULTI STOP
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const requestTaxiMulti = async (req, res) => {
  try {
    const body = req.body || {};


    var multiLocationObj = JSON.parse(body.multiLocation);

    if (typeof multiLocationObj.multiple == "string") {
      var multi = JSON.parse(multiLocationObj.multiple);
    } else {
      var multi = multiLocationObj.multiple;
    }
    if (!body.promo == "") {
      var promoAmtData = await Promo.findOne(
        { code: body.promo },
        { amount: 1, code: 1 }
      ).exec();
      if (promoAmtData) body.promoAmt = promoAmtData.amount;
    }

    var riderDoc = null;
    if (body.bookingType == "rideLater") {
      riderDoc = await Rider.findById(req.userId).exec();
    }

    var newDoc = new Trips({
      // tripno: await TripHelpers.getTripNo(),
      requestFrom: body.requestFrom,
      requestId: body.adminId ? body.adminId : "",
      triptype: body.tripType,
      bookingType: body.bookingType,
      bookingFor: body.bookingFor,
      notes: body.notesToDriver ? body.notesToDriver : "",
      other: {
        ph: body.otherPh ? body.otherPh : "",
        phCode: body.otherPhCode ? body.otherPhCode : "",
        name: body.otherName ? body.otherName : "",
      },
      date: req.body.tripShownDate,
      cpy: null,
      cpyid: null,
      dvr: null,
      dvrid: null,
      rid: req.name,
      ridid: req.userId,
      hotelid: req.body.hotelId ? req.body.hotelId : null,
      fare: body.vehicleDetailsAndFare["fareDetails"]["totalFare"],
      vehicle: body.vehicleDetailsAndFare["vehicleDetails"]["type"],
      service: body.vehicleDetailsAndFare["vehicleDetails"]["serviceId"],
      paymentMode: body.paymentMode,
      csp: {
        //Cost split up RFCNG
        base: body.vehicleDetailsAndFare["fareDetails"]["BaseFare"]
          ? body.vehicleDetailsAndFare["fareDetails"]["BaseFare"]
          : 0,
        dist: body.distanceDetails["distanceValue"],
        distfare: body.vehicleDetailsAndFare["fareDetails"]["KMFare"],
        time: body.distanceDetails["timeValue"],
        timefare: body.vehicleDetailsAndFare["fareDetails"]["waitingFare"],
        comison: body.vehicleDetailsAndFare["fareDetails"]["comisonAmt"],
        promoamt: body.promoAmt,
        promo: body.promo,
        cost: body.vehicleDetailsAndFare["fareDetails"]["totalFare"],
        conveyance: body.vehicleDetailsAndFare["fareDetails"]["pickupCharge"],
        tax: body.vehicleDetailsAndFare["fareDetails"]["tax"],
        taxPercentage:
          body.vehicleDetailsAndFare["fareDetails"]["taxPercentage"],
        via: body.paymentMode,
        driverCancelFee:
          body.vehicleDetailsAndFare["fareDetails"]["cancelationFeesDriver"],
        riderCancelFee:
          body.vehicleDetailsAndFare["fareDetails"]["cancelationFeesRider"],
        isNight:
          body.vehicleDetailsAndFare["fareDetails"]["nightObj"]["isApply"],
        isPeak: body.vehicleDetailsAndFare["fareDetails"]["peakObj"]["isApply"],
        nightPer:
          body.vehicleDetailsAndFare["fareDetails"]["nightObj"][
          "percentageIncrease" 
          ],
        // nightPer:
        //   body.vehicleDetailsAndFare["fareDetails"]["nightObj"][
        //   "nightfarePer" 
        //   ],
        peakPer:
          body.vehicleDetailsAndFare["fareDetails"]["peakObj"][
          "percentageIncrease"
          ],
        currency: body.vehicleDetailsAndFare["fareDetails"]["currency"]
          ? body.vehicleDetailsAndFare["fareDetails"]["currency"]
          : config.currency,
        hotelcommision: body.vehicleDetailsAndFare["fareDetails"][
          "hotelcommisionAmt"
        ]
          ? body.vehicleDetailsAndFare["fareDetails"]["hotelcommisionAmt"]
          : 0,
      },
      dsp: {
        distanceKM: body.vehicleDetailsAndFare["fareDetails"]["distance"]
          ? body.vehicleDetailsAndFare["fareDetails"]["distance"]
          : "NA",
        start: body.distanceDetails["from"],
        end: body.distanceDetails["to"],
        startcoords: body.distanceDetails["startCords"],
        endcoords: body.distanceDetails["endcoords"],
      },
      estTime: body.distanceDetails["timeLable"],
      status: "processing",
      tripOTP: [
        GFunctions.sendRandomizeCode("0", 4),
        GFunctions.sendRandomizeCode("0", 4),
      ],
      scId: null,
      tripDT: body.tripDT,
      utc: body.utc,
      tripFDT: body.tripFDT,
      gmtTime: body.gmtTime,
      noofseats: body.noofseats,
      multiLocation: multi,
      isMultiLocation: body.isMultiLocation,
    });

    newDoc.save((err, tripdata) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }

      var msg = "TAXI_REQUEST_SENT";
      if (body.bookingType != "rideLater") {
        updateRiderFbStatus(
          req.userId,
          "Processing",
          tripdata._id,
          body.tripType
        ); //processing = Req intermediate state

        if (requestTypeMethod == "onebyone") {
          findNearbyDriversAndSendRequest(
            tripdata,
            body,
            req.userId,
            body.distanceDetails["startCords"][0],
            body.distanceDetails["startCords"][1],
            body.serviceType
          ); //For One By One
        } else {
          requestNearbyDrivers(tripdata, body, req.userId);
        }
      } else if (body.bookingType == "rideLater") {
        var msg = "DAILT_TAXI_REQUEST_SCH";
        // setInCRON(tripdata._id, tripdata);
        if (body.bookingType == "rideLater" && riderDoc != null) {
          smsGateway.sendSmsMsg(
            riderDoc.phone,
            "",
            riderDoc.phcode,
            "",
            "rideLaterReceived",
            { TRIPNO: tripdata.tripno }
          );
        }
      }

      return res.status(200).json({
        success: true,
        message: req.i18n.__(msg),
        requestDetails: tripdata._id,
        tripId: tripdata.tripno,
      });
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
};

/**
 * Request Hail Taxi from Driver App
 * @param {*} req
 * @param {*} res
 */
export const requestHailTaxi = async (req, res) => {
  try {
    const body = req.body || {};
    let driverDoc = await Driver.findById(req.userId).exec();

    var startCoords = body.distanceDetails["startCords"];
    var endCoords = body.distanceDetails["endcoords"];
    // airport fare
    let TotalAirportZoneFare = 0;
    if (featuresSettings.checkAirportZone) {
      let pickupPointAirportZone = await airportZoneFare(
        startCoords[1],
        startCoords[0]
      );
      let dropPointAirportZone = await airportZoneFare(
        endCoords[1],
        endCoords[0]
      );

      if (pickupPointAirportZone.status == true) {
        TotalAirportZoneFare =
          TotalAirportZoneFare + Number(pickupPointAirportZone.airportFare);
      }
      if (dropPointAirportZone.status == true) {
        TotalAirportZoneFare =
          TotalAirportZoneFare + Number(dropPointAirportZone.airportFare);
      }
    }
    //update Cost value
    body.vehicleDetailsAndFare["fareDetails"]["totalFare"] =
      Number(body.vehicleDetailsAndFare["fareDetails"]["totalFare"]) +
      Number(TotalAirportZoneFare);
    var newDoc = new Trips({
      requestFrom: body.requestFrom,
      triptype: body.tripType,
      bookingType: body.bookingType,
      date: req.body.tripShownDate,
      cpy: null,
      cpyid: null,
      dvr: driverDoc.fname,
      dvrid: req.userId,
      rid: body.riderName ? body.riderName : null,
      ridid: body.riderId ? body.riderId : null,
      fare: body.vehicleDetailsAndFare["fareDetails"]["totalFare"],
      vehicle: body.vehicleDetailsAndFare["vehicleDetails"]["type"],
      service: body.vehicleDetailsAndFare["vehicleDetails"]["serviceId"],
      paymentMode: body.paymentMode,
      csp: {
        //Cost split up RFCNG
        base: body.vehicleDetailsAndFare["fareDetails"]["BaseFare"]
          ? body.vehicleDetailsAndFare["fareDetails"]["BaseFare"]
          : 0,
        dist: body.distanceDetails["distanceValue"],
        distfare: body.vehicleDetailsAndFare["fareDetails"]["KMFare"],
        time: body.distanceDetails["timeValue"],
        timefare: body.vehicleDetailsAndFare["fareDetails"]["waitingFare"],
        comison: body.vehicleDetailsAndFare["fareDetails"]["comisonAmt"],
        promoamt: body.promoAmt,
        promo: body.promo,
        cost: body.vehicleDetailsAndFare["fareDetails"]["totalFare"],
        conveyance: body.vehicleDetailsAndFare["fareDetails"]["pickupCharge"],
        tax: body.vehicleDetailsAndFare["fareDetails"]["tax"],
        taxPercentage:
          body.vehicleDetailsAndFare["fareDetails"]["taxPercentage"],
        via: body.paymentMode,
        driverCancelFee:
          body.vehicleDetailsAndFare["fareDetails"]["cancelationFeesDriver"],
        riderCancelFee:
          body.vehicleDetailsAndFare["fareDetails"]["cancelationFeesRider"],
        isNight:
          body.vehicleDetailsAndFare["fareDetails"]["nightObj"]["isApply"],
        isPeak: body.vehicleDetailsAndFare["fareDetails"]["peakObj"]["isApply"],
        nightPer:
          body.vehicleDetailsAndFare["fareDetails"]["nightObj"][
          "percentageIncrease"
          ],
          // nightPer:
          // body.vehicleDetailsAndFare["fareDetails"]["nightObj"][
          // "nightfarePer"
          // ],
        peakPer:
          body.vehicleDetailsAndFare["fareDetails"]["peakObj"][
          "percentageIncrease"
          ],
        currency: body.vehicleDetailsAndFare["fareDetails"]["currency"]
          ? body.vehicleDetailsAndFare["fareDetails"]["currency"]
          : config.currency,
      },
      dsp: {
        distanceKM: body.vehicleDetailsAndFare["fareDetails"]["distance"]
          ? body.vehicleDetailsAndFare["fareDetails"]["distance"]
          : "NA",
        start: body.distanceDetails["from"],
        end: body.distanceDetails["to"],
        startcoords: body.distanceDetails["startCords"],
        endcoords: body.distanceDetails["endcoords"],
      },
      estTime: body.distanceDetails["timeLable"],
      status: "accepted",
      review: "driver accepted",
      tripOTP: [
        GFunctions.sendRandomizeCode("0", 4),
        GFunctions.sendRandomizeCode("0", 4),
      ],
      scId: driverDoc.scId,
      scity: driverDoc.scity,
      tripDT: body.tripDT,
      utc: body.utc,
      tripFDT: body.tripFDT,
      needClear: "no",
      gmtTime: body.gmtTime,
    });

    newDoc.save((err, tripdata) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }

      changeMyTripStatus(req.userId, tripdata.tripno);
      return res.status(200).json({
        success: true,
        message: req.i18n.__("TAXI_REQUEST_SENT"),
        requestDetails: tripdata._id,
        tripno: tripdata.tripno,
      });
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
};

/**
 * Used to update Drop location of trip after Trip Started
 */
export const updateDropLocation = async (req, res) => {
  try {
    var tripData = await Trips.findOne({ tripno: req.body.trip_id }).exec();

    const from =
      tripData.dsp.startcoords[1] + "," + tripData.dsp.startcoords[0];
    const to = req.body.dropLat + "," + req.body.dropLng;
    var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
    var distanceInKM;
    if (config.distanceUnit == "Miles") {
      var distanceInKM = parseFloat(
        gdmResult.distanceValue * 0.000621371
      ).toFixed(2);
    } else {
      var distanceInKM = parseFloat(gdmResult.distanceValue / 1000).toFixed(2);
    }

    var timeInMinutes = parseFloat(gdmResult.timeValue / 60).toFixed(2);
    let vehicleCharge = await getCityBasedVehicleCharge(
      tripData.service,
      req.body.pickupCity,
      distanceInKM,
      timeInMinutes,
      req.body.time,
      0,
      0,
      0,
      null,
      0,
      0,
      tripData.bookingType
    );

    var update = {
      fare: vehicleCharge.fareDetails.totalFare,
      estTime: gdmResult.timeLable,

      "csp.cost": vehicleCharge.fareDetails.totalFare,
      "csp.dist": gdmResult.distanceValue,
      "csp.distfare": vehicleCharge.fareDetails.KMFare,
      "csp.time": gdmResult.timeValue,
      "csp.timefare": vehicleCharge.fareDetails.waitingFare,
      "csp.comison": vehicleCharge.fareDetails.comisonAmt,
      "csp.tax": vehicleCharge.fareDetails.tax,

      "dsp.endcoords": [req.body.dropLng, req.body.dropLat],
      "dsp.end": gdmResult.to,
      "dsp.distanceKM": vehicleCharge.fareDetails.distance,
    };

    if (featuresSettings.checkAirportZone) {
      // airport fare
      let dropAirportZoneFare = 0;
      let dropPointAirportZone = await airportZoneFare(
        req.body.dropLat,
        req.body.dropLng
      );

      if (dropPointAirportZone.status == true) {
        dropAirportZoneFare =
          dropAirportZoneFare + Number(dropPointAirportZone.airportFare);
      }
      update["acsp.endAirportZoneFare"] = dropAirportZoneFare;
    }

    Trips.findOneAndUpdate(
      { tripno: req.body.trip_id },
      update,
      { new: true },
      (err, doc) => {
        if (err) {
          return res.status(409).json({
            success: false,
            message: req.i18n.__("ERROR_UPDATING_DROP_LOCATION"),
            error: err,
          });
        } else {
          findAndSendFCMToDriver(
            doc.dvrid,
            "Current Trip Drop Location Changed.",
            "updateDropLocation"
          );
          return res.status(200).json({
            success: true,
            message: req.i18n.__("DROP_LOCATION_UPDATED"),
          });
        }
      }
    );
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: req.i18n.__("ERROR_UPDATING_DROP_LOCATION"),
      error: error,
    });
  }
};

//Find Drivers
async function requestNearbyDrivers(tripdata, userreq, userid) {
  var requestRadius = config.requestRadius;
  var neededService = userreq.serviceName;
  Driver.find({
    coords: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(userreq.pickupLng), parseFloat(userreq.pickupLat)],
          requestRadius / 3963.2,
        ],
      },
    },
    online: "1",
    curStatus: "free",
    curService: neededService,
  }).exec((err, driverdata) => {
    if (err) {
      notifyRider(userid, noDriverFound, tripdata._id);
    }
    if (driverdata.length <= 0) {
      notifyRider(userid, noDriverFound, tripdata._id);
    } else {
      sendRequestToDrivers(tripdata, userreq, driverdata, userid);
    }
  });
}

//Update fb
function sendRequestToDrivers(tripdata, userreq, driverdata, userid) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }

  userreq.dropAddress = userreq.dropAddress ? userreq.dropAddress : "";
  userreq.time = userreq.time ? userreq.time : "";
  userreq.pickupAddress = userreq.pickupAddress ? userreq.pickupAddress : "";

  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
    accept: {
      others: "0",
      trip_id: "0",
    },
    request: {
      drop_address: userreq.dropAddress,
      etd: userreq.time,
      picku_address: userreq.pickupAddress,
      request_id: tripdata._id,
      status: "1",
      datetime: "0",
      request_type: "Normal",
      review: "Taxi Request",
      request_no: "0",
    },
  };
  var requestedDrivers = [];
  var arrayLength = driverdata.length; //2

  //Mth 1 To all no check
  for (var i = 0; i < arrayLength; i++) {
    var child = driverdata[i]._id.toString();

    var usersRef = ref.child(child);
    requestedDrivers.push(child);
    usersRef.update(requestData, function (error) {
      if (error) {
      } else {
        findAndSendFCMToDriver(child, "New Request", "newquest");
      } // Send FCM
    });
    if (i == arrayLength - 1)
      updateTaxiStatus(requestedDrivers, tripdata._id, userid);
  }
}

export function findAndSendFCMToDriver(
  userId,
  msg,
  content,
  onlyData = false,
  sound = false
) {
  Driver.findById(userId, function (err, docs) {
    if (err) {
    } else {
      if (docs) {
        if (docs.fcmId) {
          GFunctions.sendFCMMsg(
            docs.fcmId,
            msg,
            content,
            config.appName,
            userId,
            1,
            onlyData,
            sound
          );
        }
      }
    }
  });
}

function updateTaxiStatus(requestedDrivers, requestId, userid) {
  var update = {
    reqDvr: requestedDrivers,
  };
  Trips.findOneAndUpdate(
    { _id: requestId },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
      } else {
        rebackTaxiRequest(requestedDrivers, requestId, userid);
      }
    }
  );
}

function rebackTaxiRequest(driverdata, requestId, userid) {
  setTimeout(function () {
    Trips.findOne({ _id: requestId, needClear: "yes" }, function (err, docs) {
      if (docs) {
        clearDriverRequest(driverdata, requestId, userid);
      }
    });
  }, 60000); //30000 = 30 sec
} //change trip status too,  ask to resend

function clearDriverRequest(driverdata, requestId, userid) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var requestData = {
    accept: {
      others: "0",
      trip_id: "0",
    },
    request: {
      drop_address: "0",
      etd: "0",
      picku_address: "0",
      request_id: "0",
      status: "0",
      datetime: "0",
      request_type: "0",
      review: "Time Out",
      request_no: "0",
    },
  };
  var arrayLength = driverdata.length;
  for (var i = 0; i < arrayLength; i++) {
    var child = driverdata[i].toString();
    var usersRef = ref.child(child);
    usersRef.update(requestData, function (error) {
      if (error) {
      } else {
      }
    });
    if (i == arrayLength - 1) notifyRider(userid, noDriverFound, requestId);
  }
}

function notifyRider(userid, msg, requestId, tripstatus = "noresponse") {
  var update = {
    status: tripstatus,
    review: msg,
  };

  Trips.findOneAndUpdate(
    { _id: requestId },
    update,
    { new: false },
    async(err, doc) => {
      if (err) {
      } else {
        updateRiderFbStatus(userid, msg, requestId);
        let transactionID = await Paymentflow.find({userId:mongoose.Types.ObjectId(userid)}).sort({createdAt:-1})
        if(doc &&(["noresponse","Cancelled"]).includes(tripstatus) && doc.paymentMode == 'card'){
          if(transactionID.length!=0) {
            await paymentCtrl.captureHoldChargeExistingUserCard({
              mode: config.paymentGateway.paymentGatewayName || "",
              referenceId : doc._id,
              action : "refund",
              transactionId:transactionID[0].transactionId,
            })
          }

        }
      }
    }
  );
}

/**
 * updateRiderFbStatus =
 * @param {*} userid
 * @param {*} msg
 * @param {*} requestId
 */
export function updateRiderFbStatus(
  userid,
  msg,
  requestId = "0",
  triptype = "daily"
) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    tripstatus: msg,
    requestId: requestId,
    triptype: triptype,
  };
  var child = userid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
}

export function updateStatusInFirebase(tripid, status) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data");
  var requestData = {
    status: status,
  };
  var child = tripid.toString();
  var usersRef = ref.child(child);

  usersRef.update(requestData);
}

export function updateSecondDriverCancel(tripid, status){
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data");
  var child = tripid.toString();
  var usersRef = ref.child(child);

  //second driver update
  var secondDriverRef = usersRef.child("safeRideData")
  var secData = {
    safeRidetripStatus : status
  }
  secondDriverRef.update(secData)
}

export function clearRiderFbStatusAfterTripEnd(userid, msg, requestId = "0") {
  if (userid) {
    if (!firebase.apps.length) {
      firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    var ref = db.ref("riders_data");
    var requestData = {
      tripstatus: msg,
      requestId: requestId,
      current_tripid: "",
    };
    var child = userid.toString();
    var usersRef = ref.child(child);
    usersRef.update(requestData);
  }
}

//Taxi Request from User Ends

//Taxi Cancel Before Driver Accepted it
export const cancelTaxi = (req, res) => {
  var update = {
    status: "Cancelled",
    review: constantsValues.cancelReqByUser,
    needClear: "no",
  };

  Trips.findOneAndUpdate(
    { _id: req.body.requestId, status: "processing" },
    update,
    { new: false },
    (err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (doc) {
        if (requestTypeMethod == "onebyone") {
          cancelOBOTaxiRequest(doc.reqDvr, req.body.requestId); //For OBO
        } else {
          cancelTaxiRequest(doc.reqDvr, req.body.requestId); //For BroadCast
        }
        notifyRider(req.userId, "Trip Request Cancelled", req.body.requestId);
        changeRiderTripStatusMongo(req.userId, "", "free");
        updateRiderFbStatus(req.userId, "canceled", req.body.requestId);
        return res.json({ success: true, message: labels.cancelTaxiByRider }); //Have to send cancelation fee
      } else {
        return res.status(400).json({
          success: false,
          message: req.i18n.__("TRIP_ALREADY_CANCELLED"),
        });
      }
    }
  );
};

//what if it Cancelled another User concurrent req. ?
function cancelTaxiRequest(driverdata, requestId, msg = "User Cancelled") {
  setTimeout(function () {
    //fb
    if (!firebase.apps.length) {
      firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    var ref = db.ref("drivers_data");

    var requestData = {
      accept: {
        others: "0",
        trip_id: "0",
      },
      request: {
        drop_address: "0",
        etd: "0",
        picku_address: "0",
        request_id: "0",
        datetime: "0",
        request_type: "0",
        status: "0",
        review: msg,
        request_no: "0",
      },
    };
    var arrayLength = driverdata.length; //2
    for (var i = 0; i < arrayLength; i++) {
      var child = driverdata[i].toString();
      var usersRef = ref.child(child);
      usersRef.update(requestData, function (error) {
        if (error) {
        } else {
        }
      });
    }
    //fb
  }, 0);

  var update = {
    needClear: "no",
  };

  Trips.findOneAndUpdate(
    { _id: requestId },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
      } else {
      }
    }
  );
}
//Taxi Cancel End

export const declineRequest = async(req, res) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var requestData = {
    accept: {
      others: "0",
      trip_id: "0",
    },
    request: {
      drop_address: "0",
      etd: "0",
      picku_address: "0",
      request_no: "0",
      request_id: "0",
      status: "0",
      datetime: "0",
      request_type: "0",
      safeRideData: "0",
      review: "Declined",
    },
  };
  var child = req.userId.toString();
  var usersRef = ref.child(child);

  await ref.child(child).once('value',async function(snapshot){
    let userData = snapshot.val()
    if(userData != undefined && userData.accept.trip_id != null && userData.accept.trip_id != 0 ){
      updateStatusInFirebase(userData.accept.trip_id, 5);
      var update = {
        status: "Cancelled",
        cancellationReason: req.body.reason ? req.body.reason : "Driver Cancelled",
        review: constantsValues.cancelTaxiByDriver,
        dvrid: req.userId,
        needClear: "no",
      };
    
      await Trips.findOneAndUpdate(
        {
          tripno: userData.accept.trip_id,
          status: { $in: ["accepted", "processing", "Cancelled", "cancelled"] },
        },
        update,
        { new: false })
    }

  })
  

  usersRef.update(requestData, function (error) {
    if (error) {
      return res.status(500).json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    }
    return res.json({
      success: true,
      message: req.i18n.__("REQUEST_DECLINED_SUCCESSFULLY"),
    });
  });

  if (requestTypeMethod == "onebyone") {
    needToResetDeclinedDriver(req.userId, req.body.requestId); //clear trip mongo id For One By One OBO
  }
};

export const tripRequestReceived = async (req, res) => {
  Trips.update(
    {
      _id: req.body.tripId,
      "reqDvr.drvId": mongoose.Types.ObjectId(req.userId),
    },
    {
      $set: {
        "reqDvr.$.notify": 1,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      return res
        .status(200)
        .json({ success: true, message: req.i18n.__("UPDATED") });
    }
  );
};

/**
 * Driver Accepted the Request
 * @input
 * @param
 * @return
 * @response
 */
export const acceptRequest = async (req, res) => {
  let driverDoc = await Driver.findById(req.userId).exec();
  var currentTaxi = driverDoc.taxis.id(driverDoc.currentTaxi);
  var vehiclename = currentTaxi.model;
  var vehiclecolor = currentTaxi.color;

  var trip = await Trips.findOne(
    { _id: req.body.requestId },
    { scId: 1, scity: 1 }
  );
  var TripCode = await generateTripCode(trip.scId);

  var update = {
    tripCode: TripCode,
    status: "accepted",
    review: "driver accepted",
    dvr: req.name,
    dvrid: req.userId,
    // scId: driverDoc.scId,
    // scity: driverDoc.scity,
    needClear: "no",
  };

  if (featuresSettings.isMultipleCompaniesDriversAvailable) {
    if (!driverDoc.isIndividual) {
      update.cpyid = driverDoc.cmpy;
    }
  }
  Trips.findOneAndUpdate(
    { _id: req.body.requestId, status: { $in: ["noresponse", "processing"] } },
    update,
    {new: true},
    async (err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      var updateScId = await Driver.findOneAndUpdate(
        { _id: req.userId },
        {
          scId: trip ? trip.scId : doc ? doc.scId : null,
          scity: trip ? trip.scity : doc ? doc.scity : null,
        }
      );

      //ETA
      var timeInMinutes = 0;
      try {
        if (featuresSettings.isETANeeded) {
          const from = driverDoc.coords[1] + "," + driverDoc.coords[0];
          const to = doc.dsp.startcoords[1] + "," + doc.dsp.startcoords[0];
          var gdmResult = await GFunctions.getDistanceAndTimeFromGDM(
            [from],
            [to]
          );
          timeInMinutes = parseFloat(gdmResult.timeValue / 60).toFixed(2);
        }
      } catch (error) {
      }
      //ETA
      if (!doc){
        return res
        .status(409)
        .json({ success: false, message: req.i18n.__("REQUEST_PROCESSED") });
      }

      if (doc.bookingType == "rideNow") {
        updateRiderFbAcceptStatus(
          doc.ridid,
          "Accepted",
          doc.tripno,
          req.userId,
          doc.triptype
        );
      }
      updateDriveridinFB(doc.dvrid, doc.tripno);

      res.json({
        success: true,
        message: req.i18n.__("REQUEST_ACCEPTED_SUCCESSFULLY"),
        requestId: req.body.requestId,
        tripId: doc.tripno,
        isDriver: doc.safeRideData.safeRidestatus,
        eta: timeInMinutes,
      });

      if (
        doc.requestFrom === "admin" ||
        doc.bookingFor == "others" ||
        doc.requestFrom === "web" ||
        doc.bookingType === "rideLater"
      ) {
        let riderDoc = await Rider.findById(doc.ridid).exec();
        if (riderDoc !== null) {
          var toPhone = riderDoc.phone;
          var toPhoneCode = riderDoc.phcode;
          if (doc.bookingFor == "others") {
            toPhone = doc.other.ph;
            toPhoneCode = doc.other.phCode;
          }
          if (doc.requestFrom == "admin" || doc.requestFrom == "web") {
            smsGateway.sendSmsMsg(
              toPhone,
              "",
              toPhoneCode,
              "",
              "sendTripAcceptedSMSToRider",
              {
                TRIPNO: doc.tripno,
                VEHICLENNAME: vehiclename,
                VEHICLENO: driverDoc.curVehicleNo,
                VEHICLECOLOR: vehiclecolor,
                DRIVERNAME: driverDoc.fname,
                DRIVERNO: driverDoc.phone,
                OTP: doc.tripOTP[0],
              }
            );
          } else {
            smsGateway.sendSmsMsg(
              toPhone,
              "",
              toPhoneCode,
              "",
              "sendTripAcceptedSMSToRiderForApp",
              {
                TRIPNO: doc.tripno,
                VEHICLENNAME: vehiclename,
                VEHICLENO: driverDoc.curVehicleNo,
                VEHICLECOLOR: vehiclecolor,
                DRIVERNAME: driverDoc.fname,
                DRIVERNO: driverDoc.phone,
                OTP: doc.tripOTP[0],
              }
            );
          }
        }
        if (doc.requestId)
          findAndSendFCMToAdmin(
            doc.requestId,
            "Driver Has Accepted The Trip Request - " + doc.tripno
          );
      }

      if (requestTypeMethod == "onebyone") {
      } else {
        var index = doc.reqDvr.indexOf(req.userId); //For Broadcast
        if (index !== -1) doc.reqDvr.splice(index, 1); //For Broadcast
        cancelOtherTaxiRequest(doc.reqDvr, req.body.requestId, ""); //Only needed for Broadcast method
      }

      if (
        doc.bookingType == "rideLater" &&
        doc.driverAssignmentType == "manual-assign"
      ) {
        var reqtripFDT = GFunctions.getDateTimeinThisFormat(
          doc.date,
          "D-MM-YYYY h:mm a"
        );
        var timeBtNowAndReq = GFunctions.getMinsBtDateTime(
          reqtripFDT,
          GFunctions.getISODate()
        );
        if (Number(timeBtNowAndReq) < 60) {
          updateRiderFbAcceptStatus(
            doc.ridid,
            "Accepted",
            doc.tripno,
            req.userId,
            doc.triptype
          );
          changeMyTripStatus(req.userId, doc.tripno);
        } else {
        }
      } else {
        updateRiderFbAcceptStatus(
          doc.ridid,
          "Accepted",
          doc.tripno,
          req.userId,
          doc.triptype
        );
        changeMyTripStatus(req.userId, doc.tripno, doc.bookingType, doc);
      }
      // }

      findAndSendFCMToRider(
        doc.ridid,
        "Driver Has Accepted Your Trip Request",
        "acceptRequest"
      );
    }
  );
};

//req to trip id
function updateRiderFbAcceptStatus(
  userid,
  msg,
  tripno = "",
  tripdriver,
  triptype
) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    current_tripid: tripno,
    tripstatus: msg,
    tripdriver: tripdriver,
    triptype: triptype,
  };

  var child = userid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
}

function updateDriveridinFB(driverId, tripId) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data"); //Todo
  var driverRef = db.ref("drivers_data");

  var requestData = {
    driver_id: driverId,
  };
  var requestData1 = {
    accept: {
      trip_id:tripId
    }
  };
  var child = tripId.toString();
  var child1 = driverId.toString();
  
  var usersRef = ref.child(child);
  var driverFB = driverRef.child(child1);

  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
    }
  });

  driverFB.update(requestData1, function (error) {
    if (error) {
    } else {
    }
  });

}

function cancelOtherTaxiRequest(driverdata, requestId, msg = "") {
  setTimeout(function () {
    //fb
    if (!firebase.apps.length) {
      firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    var ref = db.ref("drivers_data");

    var requestData = {
      accept: {
        others: "0",
        trip_id: "0",
      },
      request: {
        drop_address: "0",
        etd: "0",
        picku_address: "0",
        request_id: "0",
        status: "0",
        datetime: "0",
        request_type: "0",
        review: msg,
        request_no: "0",
        safeRideData: "0",
      },
    };

    var arrayLength = driverdata.length;
    for (var i = 0; i < arrayLength; i++) {
      var child = driverdata[i].toString();
      var usersRef = ref.child(child);
      usersRef.update(requestData, function (error) {
        if (error) {
        } else {
        }
      });
    }
  }, 0);
} //trip db, inform rider fb, clear for others

function changeMyTripStatus(driverid, tripno, bookingType, tripData) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var requestData = {
    accept: {
      others: "0",
      trip_id: tripno,
    },
  };
  if (bookingType == "rideLater") {
    requestData = {
      accept: {
        others: "0",
        trip_id: tripno,
      },
      request: {
        drop_address: "0",
        etd: "0",
        picku_address: "0",
        request_id: tripData._id,
        status: "2", // 2
        datetime: "0",
        request_type: "0", //0
        review: "0", //0
      },
    };
  }
  var child = driverid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
  if (bookingType == "rideLater") {
    addTripDatatoFb(tripData);
  } else {
  }
  //also change to busy in mongo = so that not get another
  changeMyTripStatusMongo(driverid, tripno, "onPickup");
}

/**
 * Trip Current Status Update from Driver
 * @input
 * @param
 * @return
 * @response
 */
function changeMyTripStatusMongo(driverid, tripno, msg = "free") {
  Driver.findById(driverid, function (err, docs) {
    if (err) {
      logger.error("changeMyTripStatusMongo", err);
    } else if (!docs) {
      logger.info("changeMyTripStatusMongo No Doc");
    } else {
      if (msg == "Progress") {
        let oldnos = docs.rating.tottrip;
        oldnos++;
        docs.rating.tottrip = oldnos;
      }

      if (msg == "free") {
        docs.curTrip = "";
      } else if (
        msg == "Accept" ||
        msg == "Arrived" ||
        msg == "Progress" ||
        msg == "onPickup"
      ) {
        docs.curTrip = tripno;
      }

      if (msg == "Accept" && featuresSettings.checkAirportZone) {
        if (docs.airportZone != undefined && docs.airportZone != null) {
          AirportZone.findById(
            docs.airportZone,
            { driversList: 1 },
            function (err, data) {
              if (err) {
              }
              data.driversList.remove(docs.queueId);
              data.save();
            }
          );
          docs.airportZone = null;
          docs.queueId = null;
          docs.queueTime = null;
        }
      }

      docs.curStatus = msg;
      docs.save(function (err, op) {
        if (err) {
          logger.error("changeMyTripStatusMongo", err);
        } else {
          logger.info("changeMyTripStatusMongo");
        }
      });
    }
  });
}

export const changeRiderTripStatusMongo = async (
  riderId,
  tripno,
  msg = "free"
) => {
  Rider.findById(riderId, function (err, docs) {
    if (err) {
      logger.error("changeRiderTripStatusMongo", err);
    } else if (!docs) {
      logger.info("changeRiderTripStatusMongo No Doc");
    } else {
      if (msg == "free") {
        docs.curTripno = null;
      } else if (
        msg == "Accept" ||
        msg == "Arrived" ||
        msg == "Progress" ||
        msg == "onPickup"
      ) {
        docs.curTripno = tripno;
      }
      docs.curStatus = msg;
      docs.save(function (err, op) {
        if (err) {
          logger.error("changeRiderTripStatusMongo", err);
        } else {
          logger.info("changeRiderTripStatusMongo");
        }
      });
    }
  });
};

//Request Taxi Retry
export const requestTaxiRetry = async (req, res) => {
  try {
    const body = req.body || {};
    var ServiceId = { ScId: null, pickupCity: "" };

    if (!body.promo == "") {
      var promoAmtData = await Promo.findOne(
        { code: body.promo },
        { amount: 1, code: 1 }
      ).exec();
      if (promoAmtData) body.promoAmt = promoAmtData.amount;
    }

    var newDoc = {
      status: "processing",
      needClear: "yes",
      //Need to add New Driver ID @TODO
    };

    var dataChanged = false;
    if (req.body.estimationId) {
      dataChanged = true;
      if (featuresSettings.checkAirportZone) {
        var startCoords = body.distanceDetails["startCords"];
        var endCoords = body.distanceDetails["endcoords"];

        // airport fare
        let TotalAirportZoneFare = 0;
        let pickupPointAirportZone = await airportZoneFare(
          startCoords[1],
          startCoords[0]
        );
        let dropPointAirportZone = await airportZoneFare(
          endCoords[1],
          endCoords[0]
        );

        if (pickupPointAirportZone.status == true) {
          TotalAirportZoneFare =
            TotalAirportZoneFare + Number(pickupPointAirportZone.airportFare);
        }
        if (dropPointAirportZone.status == true) {
          TotalAirportZoneFare =
            TotalAirportZoneFare + Number(dropPointAirportZone.airportFare);
        }
        //update Cost value
        body.vehicleDetailsAndFare["fareDetails"]["totalFare"] =
          Number(body.vehicleDetailsAndFare["fareDetails"]["totalFare"]) +
          Number(TotalAirportZoneFare);
      }
    }

    if (dataChanged) {
      //New Data
      if (featuresSettings.isCityWise) {
        ServiceId = await checkPickupPointsServiceId(
          body.distanceDetails["startCords"]
        );
      }
      newDoc = {
        // tripno: await TripHelpers.getTripNo(),
        requestFrom: body.requestFrom,
        requestId: body.adminId ? body.adminId : "",
        triptype: body.tripType,
        bookingType: body.bookingType,
        bookingFor: body.bookingFor ? body.bookingFor : "self",
        notes: body.notesToDriver ? body.notesToDriver : "",
        other: {
          ph: body.otherPh ? body.otherPh : "",
          phCode: body.otherPhCode ? body.otherPhCode : "",
          name: body.otherName ? body.otherName : "",
        },
        date: req.body.tripShownDate,
        cpy: null,
        cpyid: null,
        dvr: null,
        dvrid: null,
        hotelid: req.body.hotelId ? req.body.hotelId : null,
        fare: body.vehicleDetailsAndFare["fareDetails"]["totalFare"],
        vehicle: body.vehicleDetailsAndFare["vehicleDetails"]["type"],
        service: body.vehicleDetailsAndFare["vehicleDetails"]["serviceId"],
        paymentMode: body.paymentMode,
        csp: {
          //Cost split up RFCNG
          base: body.vehicleDetailsAndFare["fareDetails"]["BaseFare"]
            ? body.vehicleDetailsAndFare["fareDetails"]["BaseFare"]
            : 0,
          dist: body.distanceDetails["distanceValue"],
          distfare: body.vehicleDetailsAndFare["fareDetails"]["KMFare"],
          time: body.distanceDetails["timeValue"],
          timefare: body.vehicleDetailsAndFare["fareDetails"]["waitingFare"],
          comison: body.vehicleDetailsAndFare["fareDetails"]["comisonAmt"],
          promoamt: body.promoAmt,
          promo: body.promo,
          cost: body.vehicleDetailsAndFare["fareDetails"]["totalFare"],
          conveyance: body.vehicleDetailsAndFare["fareDetails"]["pickupCharge"],
          tax: body.vehicleDetailsAndFare["fareDetails"]["tax"],
          taxPercentage:
            body.vehicleDetailsAndFare["fareDetails"]["taxPercentage"],
          via: body.paymentMode,
          driverCancelFee:
            body.vehicleDetailsAndFare["fareDetails"]["cancelationFeesDriver"],
          riderCancelFee:
            body.vehicleDetailsAndFare["fareDetails"]["cancelationFeesRider"],
          isNight:
            body.vehicleDetailsAndFare["fareDetails"]["nightObj"]["isApply"],
          isPeak:
            body.vehicleDetailsAndFare["fareDetails"]["peakObj"]["isApply"],
          nightPer:
            body.vehicleDetailsAndFare["fareDetails"]["nightObj"][
            "percentageIncrease"
            ],
          // nightPer:
          //   body.vehicleDetailsAndFare["fareDetails"]["nightObj"][
          //   "nightfarePer"
          //   ],
          peakPer:
            body.vehicleDetailsAndFare["fareDetails"]["peakObj"][
            "percentageIncrease"
            ],
          currency: body.vehicleDetailsAndFare["fareDetails"]["currency"]
            ? body.vehicleDetailsAndFare["fareDetails"]["currency"]
            : config.currency,
          hotelcommision: body.vehicleDetailsAndFare["fareDetails"][
            "hotelcommisionAmt"
          ]
            ? body.vehicleDetailsAndFare["fareDetails"]["hotelcommisionAmt"]
            : 0,
        },
        dsp: {
          distanceKM: body.vehicleDetailsAndFare["fareDetails"]["distance"]
            ? body.vehicleDetailsAndFare["fareDetails"]["distance"]
            : "NA",
          start: body.distanceDetails["from"],
          end: body.distanceDetails["to"],
          startcoords: body.distanceDetails["startCords"],
          endcoords: body.distanceDetails["endcoords"],
        },
        estTime: body.distanceDetails["timeLable"],
        status: "processing",
        tripOTP: [
          GFunctions.sendRandomizeCode("0", 4),
          GFunctions.sendRandomizeCode("0", 4),
        ],
        scId: ServiceId.ScId,
        scity: ServiceId.pickupCity,
        tripDT: body.tripDT,
        utc: body.utc,
        tripFDT: body.tripFDT,
        gmtTime: body.gmtTime,
        noofseats: body.noofseats,
        needClear: "yes",
      };
    } //New Data

    var tripData = await Trips.findOneAndUpdate(
      { _id: body.requestId, status: { $in: ["noresponse", "processing"] } },
      newDoc,
      { new: true }
    );

    body.pickupLng = tripData.dsp["startcoords"][0];
    body.pickupLat = tripData.dsp["startcoords"][1];

    if (tripData.bookingType == "rideNow") {
      var riderId = tripData.ridid;
      var tripId = tripData._id;
      updateRiderFbStatus(riderId, "Processing", tripId); //processing = Req intermediate state
    }
    if (requestTypeMethod == "onebyone") {
      findNearbyDriversAndSendRequest(
        tripData,
        body,
        tripData.ridid,
        tripData.dsp["startcoords"][0],
        tripData.dsp["startcoords"][1],
        tripData.vehicle
      ); //For One By One
    } else {
      // requestNearbyDrivers(tripdata, body, req.userId);
    }

    return res.status(200).json({
      success: true,
      message: req.i18n.__("TAXI_REQUEST_SENT"),
      requestDetails: tripData._id,
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
};

//Cancel Trip by Driver / After accepting trip
export const cancelTrip = (req, res) => {
  var update = {
    status: "Cancelled",
    cancellationReason: req.body.reason ? req.body.reason : "Driver Cancelled",
    review: constantsValues.cancelTaxiByDriver,
    dvrid: req.userId,
    needClear: "no",
  };

  Trips.findOneAndUpdate(
    {
      tripno: req.body.tripId,
      status: { $in: ["accepted", "processing", "Cancelled", "cancelled"] },
    },
    update,
    { new: false },
    async(err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (!doc){
        return res
          .status(409)
          .json({ success: false, message: req.i18n.__("REQUEST_PROCESSED") });
      }
      await notifyRider(doc.ridid,constantsValues.cancelTaxiByDriver,doc._id,"Cancelled");
      if(doc.safeRideData.safeRidestatus == true){
        const safeRideData = doc.safeRideData
        if(safeRideData.secondDrivers[0].driverId != undefined){
          updateSecondDriverCancel(req.body.tripId, 9);
          changeMyTripStatusMongo(safeRideData.secondDrivers[0].driverId, doc.tripno, "free");
        }
      }
      
      addCancelationStepsToDriver(doc.dvrid, req.body.tripId);
      changeMyTripStatusMongo(req.userId, doc.tripno, "free");
      changeRiderTripStatusMongo(doc.ridid, doc.tripno, "free");
      findAndSendFCMToRider(
        doc.ridid,
        "Trip Cancelled By Driver",
        "requestTaxiRetry"
      );
      return res.json({
        success: true,
        message: labels.cancelTripByDriver,
        requestId: req.body.requestId,
        tripId: req.body.tripno,
      });
    }
  );
};

/**
 * Trip Current Status Update from Driver
 * @input
 * @param
 * @return
 * @response
 */

export const tripCurrentStatus = (req, res) => {
  var fare = {
    perKMRate: 0,
    fareType: "kmrate",
    distance: "0",
    KMFare: "0.00",
    timeRate: 0,
    waitingCharge: 0,
    waitingTime: 0,
    waitingFare: 0,
    cancelationFeesRider: 0,
    cancelationFeesDriver: 0,
    pickupCharge: 0,
    comison: 0,
    comisonAmt: 0,
    isTax: true,
    taxPercentage: 0,
    tax: 0,
    minFare: 0,
    flatFare: 0,
    oldCancellationAmt: 0,
    fareAmtBeforeSurge: 0,
    totalFareWithOutOldBal: 0,
    totalFare: 0,
    nightObj: {
      isApply: false,
      percentageIncrease: 0,
      alertLable: "Notes : Peak Fare x{PERCENTAGE} ({TIME})",
    },
    peakObj: {
      isApply: false,
      percentageIncrease: 0,
      alertLable: "Notes : Night Fare x{PERCENTAGE} ({TIME})",
    },
    distanceObj: null,
    fareAmt: 0,
    duration: "0",
    discountAmt: 0,
    BalanceFare: 0,
    DetuctedFare: 0,
    paymentMode: "cash",
    applyValues: featuresSettings.applyValues,
  };

  const safeRide = req.body.safeRide ? req.body.safeRide : "false";

  if (safeRide == "true") {
    //  If SafeRide is true or Two Driver Needed  //
    //Also check is paid
    Trips.findOne({ tripno: req.body.tripId }, async function (err, doc) {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }
      if (!doc)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("NO_TRIP_FOUND"),
          error: err,
        });
      
      fare.toll_fare = doc.acsp.tollFee
      var getVehicleDataForLiveMetersData = {};
      if (featuresSettings.liveTaxiMeter) {
        getVehicleDataForLiveMetersData = await getVehicleDataForLiveMeter(
          doc.vehicle
        );
      }
      Rider.find({ _id: doc.ridid }, { hash: 0, salt: 0, EmgContact: 0 }).exec(
        async (err2, riderdoc) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message, err: err2 });
          }
          if (riderdoc.length) {
            var othersPhone = "";
            var otherName = "";
            if (doc.bookingFor == "others") {
              othersPhone = doc.other.phCode + doc.other.ph;
              otherName = doc.other.name;
            }
            var riderdoc = {
              id: riderdoc[0]._id,
              cur: riderdoc[0].cur,
              lang: riderdoc[0].lang,
              cntyname: riderdoc[0].cntyname,
              phone: riderdoc[0].phone,
              phcode: "+" + config.phoneCode,
              email: riderdoc[0].email,
              lname: riderdoc[0].lname,
              fname: riderdoc[0].fname,
              profileurl: config.baseurl + riderdoc[0].profile,
              points: riderdoc[0].rating.rating,
              fcmId: riderdoc[0].fcmId,
              balance: riderdoc[0].balance,
              othersPhone: othersPhone,
              otherName: otherName,
              notes: doc.notes ? doc.notes : "",
            };
          } else {
            var riderdoc = {};
          } //Rider Profile End

          //If Driver Accepted
          if (req.body.status == 1) {
            if (
              doc.bookingType == "rideLater" &&
              doc.driverAssignmentType == "manual-assign"
            ) {
              var reqtripFDT = GFunctions.getDateTimeinThisFormat(
                doc.date,
                "D-MM-YYYY h:mm a"
              );
              var timeBtNowAndReq = GFunctions.getMinsBtDateTime(
                reqtripFDT,
                GFunctions.getISODate()
              );
              if (Number(timeBtNowAndReq) < 60) {
                changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Accept");
                changeRiderTripStatusMongo(
                  riderdoc.id,
                  req.body.tripId,
                  "Accept"
                );
              } else {
              }
            } else {
              changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Accept");
              changeRiderTripStatusMongo(
                riderdoc.id,
                req.body.tripId,
                "Accept"
              );
            }

            return res.json({
              success: true,
              message: req.i18n.__("ACCEPT"),
              rider: riderdoc,
              pickupdetails: doc.dsp,
              status: "Accept",
              fare: fare,
              taxitype: doc.vehicle,
              startOTP: doc.tripOTP[0],
              endOTP: doc.tripOTP[1],
              vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
              tripType: doc.triptype,
              multiLocation: doc.multiLocation,
            });
          }

          //If Driver Arrived
          else if (req.body.status == 2 || req.body.status == 6) {
            if (req.body.status == 2) {
              // First driver Trip Status //

              if (featuresSettings.checkArrivalDistance) {
                var isArrivalDistanceInBoundaryLimit =
                  await checkArrivalDistanceBoundaryLimit(
                    req.body.currentLat,
                    req.body.currentLng,
                    doc.dsp.startcoords[1],
                    doc.dsp.startcoords[0]
                  );
                if (!isArrivalDistanceInBoundaryLimit) {
                  return res.status(409).json({
                    success: false,
                    message: req.i18n.__(
                      "YOU_NOT_ALLOWED_TO_CHANGE_STATUS_NOW"
                    ),
                    rider: riderdoc,
                    pickupdetails: doc.dsp,
                    status: "Arrive Now",
                    fare: fare,
                    taxitype: doc.vehicle,
                    startOTP: doc.tripOTP[0],
                    endOTP: doc.tripOTP[1],
                    vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                    tripType: doc.triptype,
                    multiLocation: doc.multiLocation,
                  });
                } else {
                  updateArrive(req.body.tripId);
                  changeMyTripStatusMongo(
                    doc.dvrid,
                    req.body.tripId,
                    "Arrived"
                  );
                  changeRiderTripStatusMongo(
                    riderdoc.id,
                    req.body.tripId,
                    "Arrived"
                  );
                  GFunctions.sendFCMMsg(
                    riderdoc.fcmId,
                    "Your Driver Has Arived",
                    "driver"
                  );
                  return res.json({
                    success: true,
                    message: req.i18n.__("ARRIVE"),
                    rider: riderdoc,
                    pickupdetails: doc.dsp,
                    status: "Arrive Now",
                    fare: fare,
                    taxitype: doc.vehicle,
                    startOTP: doc.tripOTP[0],
                    endOTP: doc.tripOTP[1],
                    vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                    tripType: doc.triptype,
                    multiLocation: doc.multiLocation,
                  });
                }
              } else {
                updateArrive(req.body.tripId);
                changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Arrived");
                changeRiderTripStatusMongo(
                  riderdoc.id,
                  req.body.tripId,
                  "Arrived"
                );
                GFunctions.sendFCMMsg(
                  riderdoc.fcmId,
                  "Your Driver Has Arived",
                  "driver"
                );
                if (safeRide == "true") {
                  if (req.type == "driver") {
                    if (req.userId == doc.dvrid) {
                      let dvrid = doc.dvrid;
                      let firstDriver = await checkFirstDriver(
                        req.body.tripId,
                        dvrid
                      );
                      return res.json({
                        success: true,
                        message: req.i18n.__("ARRIVE"),
                        rider: riderdoc,
                        pickupdetails: doc.dsp,
                        status: "Arrive Now",
                        fare: fare,
                        taxitype: doc.vehicle,
                        startOTP: doc.tripOTP[0],
                        endOTP: doc.tripOTP[1],
                        vehicleDataForLiveMeter:
                          getVehicleDataForLiveMetersData,
                        tripType: doc.triptype,
                        multiLocation: doc.multiLocation,
                        isDriver: doc.safeRideData.safeRidestatus,
                        isFirstDriver: firstDriver,
                      });
                    }
                  }
                }
              }
            }
            if (req.body.status == 6) {
              ///// secondDriver driver Trip Status and Trip started //
              if (!req.body.fromAddress) req.body.fromAddress = doc.dsp.start;
              if (!req.body.pickupLat)
                req.body.pickupLat = doc.dsp.startcoords[1];
              if (!req.body.pickupLng)
                req.body.pickupLng = doc.dsp.startcoords[0];
              changeMyTripStatusMongo(
                doc.safeRideData.secondDrivers[0].driverId,
                req.body.tripId,
                "Progress"
              );
              if (req.type == "driver") {
                if (req.userId == doc.dvrid) {
                  // If token is not First Driver //
                  let dvrid = doc.dvrid;
                  let firstDriver = await checkFirstDriver(
                    req.body.tripId,
                    dvrid
                  );
                  return res.json({
                    success: true,
                    message: req.i18n.__("TRIP_STARTED"),
                    rider: riderdoc,
                    pickupdetails: doc.dsp,
                    status: "Start Trip",
                    fare: fare,
                    taxitype: doc.vehicle,
                    startOTP: doc.tripOTP[0],
                    endOTP: doc.tripOTP[1],
                    vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                    tripType: doc.triptype,
                    multiLocation: doc.multiLocation,
                    isDriver: doc.safeRideData.safeRidestatus,
                    isFirstDriver: firstDriver,
                  });
                } else {
                  // If token is Seconddriver //
                  return res.json({
                    success: true,
                    message: req.i18n.__("TRIP_STARTED"),
                    rider: riderdoc,
                    pickupdetails: doc.dsp,
                    status: "Start Trip",
                    fare: fare,
                    taxitype: doc.vehicle,
                    startOTP: doc.tripOTP[0],
                    endOTP: doc.tripOTP[1],
                    vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                    tripType: doc.triptype,
                    multiLocation: doc.multiLocation,
                    isDriver: doc.safeRideData.safeRidestatus,
                    isFirstDriver: "false",
                  });
                }
              }
            }
          }
          //If Driver Trip Started : Progress
          else if (req.body.status == 3 || req.body.status == 7) {
            if (req.body.status == 3) {
              // First Driver Trip status and Trip started //
              var newUpdate = true;
              var tripstatus = doc.status;
              newUpdate = req.body.newUpdate ? req.body.newUpdate : true;
              if (newUpdate == false || newUpdate == "false") newUpdate = false;
              // if (newUpdate) {
              if (doc.status != "Progress" && doc.status != "Finished") {
                if (!req.body.startTime)
                  req.body.startTime = GFunctions.sendTimeNow();
                if (!req.body.fromAddress) req.body.fromAddress = doc.dsp.start;
                if (!req.body.pickupLat)
                  req.body.pickupLat = doc.dsp.startcoords[1];
                if (!req.body.pickupLng)
                  req.body.pickupLng = doc.dsp.startcoords[0];

                if (doc.triptype == "rental" || doc.triptype == "outstation") {
                  if (
                    req.body.startMeter == "" ||
                    req.body.startMeter < 0 ||
                    typeof req.body.startMeter == "undefined"
                  ) {
                    return res.status(409).json({
                      success: false,
                      message: "Please Enter Staring Meter",
                    });
                  }
                }

                updateActualPickupFare(req.body.tripId, fare, req.body); // Only PICKup
                changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Progress");
                changeRiderTripStatusMongo(
                  riderdoc.id,
                  req.body.tripId,
                  "Progress"
                );
                GFunctions.sendFCMMsg(
                  riderdoc.fcmId,
                  "Trip Started",
                  "tripstart"
                );
              }
              if (safeRide == "true") {
                if (req.type == "driver") {
                  if (req.userId == doc.dvrid) {
                    //If token is firstdriver
                    let dvrid = doc.dvrid;
                    let firstDriver = await checkFirstDriver(
                      req.body.tripId,
                      dvrid
                    );

                    return res.json({
                      success: true,
                      message: req.i18n.__("TRIP_IN_PROGRESS"),
                      rider: riderdoc,
                      pickupdetails: doc.dsp,
                      status: "Start Trip",
                      fare: fare,
                      taxitype: doc.vehicle,
                      startOTP: doc.tripOTP[0],
                      endOTP: doc.tripOTP[1],
                      vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                      tripType: doc.triptype,
                      multiLocation: doc.multiLocation,
                      isDriver: doc.safeRideData.safeRidestatus,
                      isFirstDriver: firstDriver,
                    });
                  }
                }
              }
            }
            if (req.body.status == 7) {
              // Second Driver Trip status and Trip in Progress//
              if (!req.body.fromAddress) req.body.fromAddress = doc.dsp.start;
              if (!req.body.pickupLat)
                req.body.pickupLat = doc.dsp.startcoords[1];
              if (!req.body.pickupLng)
                req.body.pickupLng = doc.dsp.startcoords[0];
              changeMyTripStatusMongo(
                doc.safeRideData.secondDrivers[0].driverId,
                req.body.tripId,
                "Progress"
              );
              if (req.type == "driver") {
                if (req.userId == doc.dvrid) {
                  let dvrid = doc.dvrid;
                  let firstDriver = await checkFirstDriver(
                    req.body.tripId,
                    dvrid
                  );
                  return res.json({
                    success: true,
                    message: req.i18n.__("TRIP_IN_PROGRESS"),
                    rider: riderdoc,
                    pickupdetails: doc.dsp,
                    status: "Start Trip",
                    fare: fare,
                    taxitype: doc.vehicle,
                    startOTP: doc.tripOTP[0],
                    endOTP: doc.tripOTP[1],
                    vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                    tripType: doc.triptype,
                    multiLocation: doc.multiLocation,
                    isDriver: doc.safeRideData.safeRidestatus,
                    isFirstDriver: firstDriver,
                  });
                } else {
                  /// If token is secondDriver ///
                  return res.json({
                    success: true,
                    message: req.i18n.__("TRIP_IN_PROGRESS"),
                    rider: riderdoc,
                    pickupdetails: doc.dsp,
                    status: "Start Trip",
                    fare: fare,
                    taxitype: doc.vehicle,
                    startOTP: doc.tripOTP[0],
                    endOTP: doc.tripOTP[1],
                    vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                    tripType: doc.triptype,
                    multiLocation: doc.multiLocation,
                    isDriver: doc.safeRideData.safeRidestatus,
                    isFirstDriver: "false",
                  });
                }
              }
            }
          }
          //If Driver Trip Ended : Complete
          else if (req.body.status == 4 || req.body.status == 8) {
            if (req.body.status == 4) {
              // First Driver Trip status and Trip Ended //
              freeTheDriver(doc.dvrid);
              changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "free");
              changeRiderTripStatusMongo(riderdoc.id, req.body.tripId, "free");
              Trips.findOne(
                { tripno: req.body.tripId, status: "Finished" },
                async function (err, tripEndedExits) {
                  if (err) {
                    return res
                      .status(500)
                      .json({ success: false, message: err.message, err: err });
                  }
                  if (tripEndedExits) {
                    tripAlreadyEnded(req, res, doc, fare, riderdoc);
                    return true;
                    // return res.status(409).json({ 'success': false, 'message': req.i18n.__("TRIP_ALREADY_ENDED"), 'error': err });
                  }

                  const findTripLocation = await TripLocation.findOne({"tripId":doc._id})
                  const tollParams = {
                    "pickupLat":(doc.dsp.startcoords[1]).toString(),
                    "pickupLng":(doc.dsp.startcoords[0]).toString(),
                    "dropLat":req.body.dropLat,
                    "dropLng":req.body.dropLng
                  }
                  const tollData = await getTollFare(tollParams)
  
                  req.body.tollFee = 0
                  if(tollData.success == true && tollData.tollCoordinates.length > 0){
                    for(const itreator of tollData.tollCoordinates){
                      const tollCoordinates = [itreator.lng,itreator.lat]
                      const tripCoordinates = findTripLocation.locations
                      // const checkToll = insidePolygon(tollCoordinates,tripCoordinates)
                      // if(checkToll){
                      //   req.body.tollFee = req.body.tollFee + itreator.toll
                      // }
                      var line = turf.lineString(tripCoordinates)
                      var pt = turf.point(tollCoordinates);
                      var snapped = turf.nearestPointOnLine(line, pt, {units: 'kilometers'});
                      if(snapped && snapped.properties.dist <= 0.15 ){
                        req.body.tollFee = req.body.tollFee + itreator.toll
                      }
                      else{
                      }
                    }
                  }

                  if (doc.triptype == "rental") {
                    calculateFinalPackageAmount(
                      req,
                      res,
                      doc,
                      fare,
                      riderdoc,
                      req.headers["accept-language"]
                    );
                  } else if (doc.triptype == "outstation") {
                    calculateFinalOustationAmount(
                      req,
                      res,
                      doc,
                      fare,
                      riderdoc,
                      req.headers["accept-language"]
                    );
                  } else {
                    calculateFinalAmount(
                      req,
                      res,
                      doc,
                      fare,
                      riderdoc,
                      req.headers["accept-language"]
                    );
                  }
                }
              );
            }
            if (req.body.status == 8) {
              // Second Driver Trip status and Trip Ended //
              freeTheDriver(doc.safeRideData.secondDrivers[0].driverId);
              changeMyTripStatusMongo(
                doc.safeRideData.secondDrivers[0].driverId,
                req.body.tripId,
                "free"
              );
            }
          } //If Driver Trip Ended : Complete Else End
        }
      ); //Rider Profile End
    }); //Trip Details End
  } ///safeRide is true

  if (safeRide == "false") {
    Trips.findOne({ tripno: req.body.tripId }, async function (err, doc) {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }
      if (!doc)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("NO_TRIP_FOUND"),
          error: err,
        });
      fare.toll_fare = doc.acsp.tollFee
      var getVehicleDataForLiveMetersData = {};
      if (featuresSettings.liveTaxiMeter) {
        getVehicleDataForLiveMetersData = await getVehicleDataForLiveMeter(
          doc.vehicle
        );
      }
      //If Trip Exists Only
      //Rider Profile
      Rider.find({ _id: doc.ridid }, { hash: 0, salt: 0, EmgContact: 0 }).exec(
        async (err2, riderdoc) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message, err: err2 });
          }
          if (riderdoc.length) {
            var othersPhone = "";
            var otherName = "";
            if (doc.bookingFor == "others") {
              othersPhone = doc.other.phCode + doc.other.ph;
              otherName = doc.other.name;
            }
            var riderdoc = {
              id: riderdoc[0]._id,
              cur: riderdoc[0].cur,
              lang: riderdoc[0].lang,
              cntyname: riderdoc[0].cntyname,
              phone: riderdoc[0].phone,
              phcode: "+" + config.phoneCode,
              email: riderdoc[0].email,
              lname: riderdoc[0].lname,
              fname: riderdoc[0].fname,
              profileurl: config.baseurl + riderdoc[0].profile,
              points: riderdoc[0].rating.rating,
              fcmId: riderdoc[0].fcmId,
              balance: riderdoc[0].balance,
              othersPhone: othersPhone,
              otherName: otherName,
              notes: doc.notes ? doc.notes : "",
            };
          } else {
            var riderdoc = {};
          }
          //Rider Profile End

          //If Driver Accepted
          if (req.body.status == 1) {
            if (
              doc.bookingType == "rideLater" &&
              doc.driverAssignmentType == "manual-assign"
            ) {
              var reqtripFDT = GFunctions.getDateTimeinThisFormat(
                doc.date,
                "D-MM-YYYY h:mm a"
              );
              var timeBtNowAndReq = GFunctions.getMinsBtDateTime(
                reqtripFDT,
                GFunctions.getISODate()
              );
              if (Number(timeBtNowAndReq) < 60) {
                changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Accept");
                changeRiderTripStatusMongo(
                  riderdoc.id,
                  req.body.tripId,
                  "Accept"
                );
              } else {
              }
            } else {
              changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Accept");
              changeRiderTripStatusMongo(
                riderdoc.id,
                req.body.tripId,
                "Accept"
              );
            }

            return res.json({
              success: true,
              message: req.i18n.__("ACCEPT"),
              rider: riderdoc,
              pickupdetails: doc.dsp,
              status: "Accept",
              fare: fare,
              taxitype: doc.vehicle,
              startOTP: doc.tripOTP[0],
              endOTP: doc.tripOTP[1],
              vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
              tripType: doc.triptype,
              multiLocation: doc.multiLocation,
            });
          }

          //If Driver Arrived
          else if (req.body.status == 2) {
            if (featuresSettings.checkArrivalDistance) {
              var isArrivalDistanceInBoundaryLimit =
                await checkArrivalDistanceBoundaryLimit(
                  req.body.currentLat,
                  req.body.currentLng,
                  doc.dsp.startcoords[1],
                  doc.dsp.startcoords[0]
                );
              if (!isArrivalDistanceInBoundaryLimit) {
                return res.status(409).json({
                  success: false,
                  message: req.i18n.__("YOU_NOT_ALLOWED_TO_CHANGE_STATUS_NOW"),
                  rider: riderdoc,
                  pickupdetails: doc.dsp,
                  status: "Arrive Now",
                  fare: fare,
                  taxitype: doc.vehicle,
                  startOTP: doc.tripOTP[0],
                  endOTP: doc.tripOTP[1],
                  vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                  tripType: doc.triptype,
                  multiLocation: doc.multiLocation,
                });
              } else {
                updateArrive(req.body.tripId);
                changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Arrived");
                changeRiderTripStatusMongo(
                  riderdoc.id,
                  req.body.tripId,
                  "Arrived"
                );
                GFunctions.sendFCMMsg(
                  riderdoc.fcmId,
                  "Your Driver Has Arived",
                  "driver"
                );
                return res.json({
                  success: true,
                  message: req.i18n.__("ARRIVE"),
                  rider: riderdoc,
                  pickupdetails: doc.dsp,
                  status: "Arrive Now",
                  fare: fare,
                  taxitype: doc.vehicle,
                  startOTP: doc.tripOTP[0],
                  endOTP: doc.tripOTP[1],
                  vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                  tripType: doc.triptype,
                  multiLocation: doc.multiLocation,
                });
              }
            } else {
              updateArrive(req.body.tripId);
              changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Arrived");
              changeRiderTripStatusMongo(
                riderdoc.id,
                req.body.tripId,
                "Arrived"
              );
              GFunctions.sendFCMMsg(
                riderdoc.fcmId,
                "Your Driver Has Arived",
                "driver"
              );
              const safeRidestatus = doc.safeRideData.safeRidestatus;
              if (safeRidestatus == "false") {
                if (req.type == "driver") {
                  let dvrid = req.userId;

                  let firstDriver = await checkFirstDriver(
                    req.body.tripId,
                    dvrid
                  );
                  return res.json({
                    success: true,
                    message: req.i18n.__("ARRIVE"),
                    rider: riderdoc,
                    pickupdetails: doc.dsp,
                    status: "Arrive Now",
                    fare: fare,
                    taxitype: doc.vehicle,
                    startOTP: doc.tripOTP[0],
                    endOTP: doc.tripOTP[1],
                    vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                    tripType: doc.triptype,
                    multiLocation: doc.multiLocation,
                    isDriver: doc.safeRideData.safeRidestatus,
                    isFirstDriver: firstDriver,
                  });
                }
              }
            }
          }
          //If Driver Trip Started : Progress
          else if (req.body.status == 3) {
            var newUpdate = true;
            var tripstatus = doc.status;
            newUpdate = req.body.newUpdate ? req.body.newUpdate : true;
            if (newUpdate == false || newUpdate == "false") newUpdate = false;
            // if (newUpdate) {
            if (doc.status != "Progress" && doc.status != "Finished") {
              if (!req.body.startTime)
                req.body.startTime = GFunctions.sendTimeNow();
              if (!req.body.fromAddress) req.body.fromAddress = doc.dsp.start;
              if (!req.body.pickupLat)
                req.body.pickupLat = doc.dsp.startcoords[1];
              if (!req.body.pickupLng)
                req.body.pickupLng = doc.dsp.startcoords[0];

              if (doc.triptype == "rental" || doc.triptype == "outstation") {
                if (
                  req.body.startMeter == "" ||
                  req.body.startMeter < 0 ||
                  typeof req.body.startMeter == "undefined"
                ) {
                  return res.status(409).json({
                    success: false,
                    message: "Please Enter Staring Meter",
                  });
                }
              }

              updateActualPickupFare(req.body.tripId, fare, req.body); // Only PICKup
              changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "Progress");
              changeRiderTripStatusMongo(
                riderdoc.id,
                req.body.tripId,
                "Progress"
              );
              GFunctions.sendFCMMsg(
                riderdoc.fcmId,
                "Trip Started",
                "tripstart"
              );
            }
            const safeRidestatus = doc.safeRideData.safeRidestatus;

            if (safeRidestatus == "false") {
              if (req.type == "driver") {
                let dvrid = req.userId;

                let firstDriver = await checkFirstDriver(
                  req.body.tripId,
                  dvrid
                );

                return res.json({
                  success: true,
                  message: req.i18n.__("TRIP_IN_PROGRESS"),
                  rider: riderdoc,
                  pickupdetails: doc.dsp,
                  status: "Start Trip",
                  fare: fare,
                  taxitype: doc.vehicle,
                  startOTP: doc.tripOTP[0],
                  endOTP: doc.tripOTP[1],
                  vehicleDataForLiveMeter: getVehicleDataForLiveMetersData,
                  tripType: doc.triptype,
                  multiLocation: doc.multiLocation,
                  isDriver: doc.safeRideData.safeRidestatus,
                  isFirstDriver: firstDriver,
                });
              }
            }
          }
          //If Driver Trip Ended : Complete
          else if (req.body.status == 4) {
            freeTheDriver(doc.dvrid);
            changeMyTripStatusMongo(doc.dvrid, req.body.tripId, "free");
            changeRiderTripStatusMongo(riderdoc.id, req.body.tripId, "free");
            Trips.findOne(
              { tripno: req.body.tripId, status: "Finished" },
              async function (err, tripEndedExits) {
                if (err) {
                  return res
                    .status(500)
                    .json({ success: false, message: err.message, err: err });
                }
                if (tripEndedExits) {
                  tripAlreadyEnded(req, res, doc, fare, riderdoc);
                  return true;
                  // return res.status(409).json({ 'success': false, 'message': req.i18n.__("TRIP_ALREADY_ENDED"), 'error': err });
                }
                const findTripLocation = await TripLocation.findOne({"tripId":doc._id})
                const tollParams = {
                  "pickupLat":(doc.dsp.startcoords[1]).toString(),
                  "pickupLng":(doc.dsp.startcoords[0]).toString(),
                  "dropLat":req.body.dropLat,
                  "dropLng":req.body.dropLng
                }
                const tollData = await getTollFare(tollParams)

                req.body.tollFee = 0
                if(tollData.success == true && tollData.tollCoordinates.length > 0){
                  console.log("inside toll fee")
                  for(const itreator of tollData.tollCoordinates){
                    const tollCoordinates = [itreator.lng,itreator.lat]
                    const tripCoordinates = findTripLocation.locations
                    // const checkToll = insidePolygon(tollCoordinates,tripCoordinates)
                    // if(checkToll){
                    //   req.body.tollFee = req.body.tollFee + itreator.toll
                    // }
                    var line = turf.lineString(tripCoordinates)
                    var pt = turf.point(tollCoordinates);
                    var snapped = turf.nearestPointOnLine(line, pt, {units: 'kilometers'});
                    if(snapped && snapped.properties.dist <= 0.15 ){
                      req.body.tollFee = req.body.tollFee + itreator.toll
                    }
                    else{
                    }
                  }
                }
                if (doc.triptype == "rental") {
                  calculateFinalPackageAmount(
                    req,
                    res,
                    doc,
                    fare,
                    riderdoc,
                    req.headers["accept-language"]
                  );
                } else if (doc.triptype == "outstation") {
                  calculateFinalOustationAmount(
                    req,
                    res,
                    doc,
                    fare,
                    riderdoc,
                    req.headers["accept-language"]
                  );
                } else {
                  calculateFinalAmount(
                    req,
                    res,
                    doc,
                    fare,
                    riderdoc,
                    req.headers["accept-language"]
                  );
                }
              }
            );
          } //If Driver Trip Ended : Complete Else End
        }
      ); //Rider Profile End
    }); //Trip Details End
  }
};

async function checkArrivalDistanceBoundaryLimit(
  currentLat,
  currentLng,
  pickupLat,
  pickupLng
) {
  var distanceInUnit = await getDistanceBttwoCords(
    currentLat,
    currentLng,
    pickupLat,
    pickupLng
  );
  if (distanceInUnit > featuresSettings.arrivalDistanceInMeter) {
    return false;
  } else {
    return true;
  }
}

async function tripAlreadyEnded(req, res, tripData, fare, riderdoc) {
  var fareDetails = await getFareDetailsFromTripData(tripData);
  if (tripData.triptype == "daily") {
    //Daily
    updateTripFinalDataInFirebase(tripData, fareDetails, "");
    return res.json({
      success: true,
      message: req.i18n.__("TRIP_ENDED"),
      rider: riderdoc,
      pickupdetails: tripData.dsp,
      status: "Trip Ended",
      fare: fareDetails,
      taxitype: tripData.vehicle,
      startOTP: tripData.tripOTP[0],
      endOTP: tripData.tripOTP[1],
      tripType: tripData.triptype,
      multiLocation: tripData.multiLocation,
    });
  } else {
    var InvoiceDetailsParams = {
      triptype: tripData.triptype,
      distanceKM: fareDetails.readabledistanceKM
        ? fareDetails.readabledistanceKM
        : 0,
      estTime: fareDetails.readableEstTime ? fareDetails.readableEstTime : 0,
      packageName: tripData.acsp.packageName,
      distfare: Number(fareDetails.KMFare),
      baseKM: tripData.acsp.baseKM ? tripData.acsp.baseKM : 0,
      fareForExtraKM: tripData.acsp.fareForExtraKM
        ? tripData.acsp.fareForExtraKM
        : 0,
      extraKM: tripData.acsp.extraKM ? tripData.acsp.extraKM : 0,
      perKmRate: fareDetails.perKMRate
        ? fareDetails.perKMRate
        : tripData.csp.perKmRate,
      fareForExtraTime: tripData.acsp.fareForExtraTime
        ? tripData.acsp.fareForExtraTime
        : 0,
      extraTime: tripData.acsp.extraTime ? tripData.acsp.extraTime : 0,
      timefare: Number(fareDetails.travelFare)
        ? Number(fareDetails.travelFare)
        : 0,
      conveyance: Number(fareDetails.pickupCharge)
        ? Number(fareDetails.pickupCharge)
        : 0,
      hillFare: 0,
      cost: fareDetails.totalFare,
      taxPercentage: Number(tripData.acsp.taxPercentage)
        ? Number(tripData.acsp.taxPercentage)
        : 0,
      tax: Number(tripData.acsp.tax) ? Number(tripData.acsp.tax) : 0,
      fareBeforeTax: Number(tripData.acsp.fareBeforeTax)
        ? Number(tripData.acsp.fareBeforeTax)
        : 0,
      oldCancellationAmt: Number(tripData.acsp.oldBalance)
        ? Number(tripData.acsp.oldBalance)
        : 0,
      tollFee: Number(tripData.acsp.tollFee)
        ? Number(tripData.acsp.tollFee)
        : 0,
      nightFare: Number(tripData.acsp.nightFare)
        ? Number(tripData.acsp.nightFare)
        : 0,
      dayFare: Number(tripData.acsp.dayFare)
        ? Number(tripData.acsp.dayFare)
        : 0,
      booking: Number(fareDetails.bookingFare)
        ? Number(fareDetails.bookingFare)
        : 0,
      BaseFare: Number(fareDetails.BaseFare) ? Number(fareDetails.BaseFare) : 0,
      gatewayCharge: Number(fareDetails.gatewayCharge)
        ? Number(fareDetails.gatewayCharge)
        : 0,
    };
    var rentalPackageInvoiceDetailsData = await rentalPackageInvoiceDetails(
      InvoiceDetailsParams
    );
    updateTripFinalDataInFirebase(
      tripData,
      fareDetails,
      rentalPackageInvoiceDetailsData
    );
    //Rental and OutStation
    return res.json({
      success: true,
      message: req.i18n.__("TRIP_ENDED"),
      rider: riderdoc,
      pickupdetails: tripData.dsp,
      status: "Trip Ended",
      fare: fareDetails,
      taxitype: tripData.vehicle,
      startOTP: tripData.tripOTP[0],
      endOTP: tripData.tripOTP[1],
      invoiceBill: rentalPackageInvoiceDetailsData,
      tripType: tripData.triptype,
    });
  }
}

export const refreshFinishedTrips = (req, res) => {
  //Also check is paid
  Trips.findOne({ tripno: req.body.tripno }, async function (err, doc) {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: err.message, err: err });
    }
    if (!doc)
      return res.status(409).json({
        success: false,
        message: req.i18n.__("NO_TRIP_FOUND"),
        error: err,
      });

    //Rider Profile
    Rider.find({ _id: doc.ridid }, { hash: 0, salt: 0, EmgContact: 0 }).exec(
      (err2, riderdoc) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: err.message, err: err2 });
        }
        if (riderdoc.length) {
          var othersPhone = "";
          var otherName = "";
          if (doc.bookingFor == "others") {
            othersPhone = doc.other.phCode + doc.other.ph;
            otherName = doc.other.name;
          }
          var riderdoc = {
            id: riderdoc[0]._id,
            cur: riderdoc[0].cur,
            lang: riderdoc[0].lang,
            cntyname: riderdoc[0].cntyname,
            phone: riderdoc[0].phone,
            phcode: config.phoneCode,
            email: riderdoc[0].email,
            lname: riderdoc[0].lname,
            fname: riderdoc[0].fname,
            profileurl: config.baseurl + riderdoc[0].profile,
            points: riderdoc[0].rating.rating,
            fcmId: riderdoc[0].fcmId,
            balance: riderdoc[0].balance,
            othersPhone: othersPhone,
            otherName: otherName,
            notes: doc.notes ? doc.notes : "",
          };
        } else {
          var riderdoc = {};
        }
        //Rider Profile End

        freeTheDriver(doc.dvrid);
        changeMyTripStatusMongo(doc.dvrid, req.body.tripno, "free");
        changeRiderTripStatusMongo(riderdoc.id, req.body.tripno, "free");
        Trips.findOne(
          { tripno: req.body.tripno, status: "Finished" },
          function (err, tripEndedExits) {
            if (err) {
              return res
                .status(500)
                .json({ success: false, message: err.message, err: err });
            }
            if (tripEndedExits) {
              tripAlreadyEnded(req, res, doc, fare, riderdoc);
              return true;
            }
            return res.status(409).json({
              success: false,
              message: req.i18n.__("TRIP_NOT_ENDED"),
              error: err,
            });
          }
        );
      }
    ); //Rider Profile End
  }); //Trip Details End
};

export const getFareDetailsFromTripData = async (tripData) => {
  var acsp = tripData.acsp;
  var csp = tripData.csp;
  var adsp = tripData.adsp;
  var fareDetails = {
    perKMRate: acsp.perKmRate,
    fareType: acsp.fareType,
    distance: acsp.dist,
    KMFare: acsp.distfare,
    BaseFare: acsp.base,
    bookingFare: acsp.booking,
    travelTime: acsp.time,
    travelRate: acsp.timeRate,
    travelFare: acsp.timefare,
    timeRate: acsp.timeRate,
    waitingCharge: acsp.waitingCharge,
    waitingTime: acsp.waitingTime,
    waitingFare: acsp.waitingRate,
    cancelationFeesRider: csp.riderCancelFee,
    cancelationFeesDriver: csp.driverCancelFee,
    pickupCharge: acsp.conveyance,
    hotelcommision: acsp.hotelcommision,
    hotelcommisionAmt: 0,
    comison: 0,
    comisonAmt: acsp.comison,
    isTax: true,
    taxPercentage: acsp.taxPercentage,
    tax: acsp.tax,
    minFare: acsp.minFare,
    minFareAdded: acsp.minFareAdded,
    flatFare: acsp.base,
    oldCancellationAmt: acsp.oldBalance,
    fareAmtBeforeSurge: acsp.fareAmtBeforeSurge,
    totalFareWithOutOldBal: acsp.totalFareWithOutOldBal,
    totalFare: acsp.actualcost,
    BalanceFare: acsp.actualcost,
    DetuctedFare: acsp.carddebt,
    paymentMode: acsp.via,
    currency: config.currencySymbol,
    additionalFee: [],
    mandatorydiscountAmt: 0,
    discountAmt: acsp.promDiscount,
    promoCode: acsp.discountName,
    nightObj: {
      isApply: acsp.isNight,
      percentageIncrease: acsp.nightPer,
      nightfarePer:acsp.nightfarePer,
      alertLable: "Notes : Night Fare x" + acsp.nightPer,
    },
    peakObj: {
      isApply: acsp.isPeak,
      percentageIncrease: acsp.peakPer,
      alertLable: "Notes : Peak Fare x" + acsp.peakPer,
    },
    distanceObj: null,
    fareAmt: acsp.actualcost,
    farewithoutTaxNBookingFee: acsp.farewithoutTaxNBookingFee,
    applyValues: featuresSettings.applyValues,
    duration: acsp.time,
    extraKM: acsp.extraKM,
    readabledistanceKM: adsp.distanceKM,
    readableEstTime: adsp.estTime,
    discountPercentage: acsp.discountPercentage,
    discountName: acsp.discountName,
    companyCommisionAmt: 0,
  };
  return fareDetails;
};

export const endTripFareEstimationFromAdmin = async (req, res) => {
  try {
    Trips.findOne({ tripno: req.body.tripId }, async function (err, doc) {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }
      if (!doc)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("NO_TRIP_FOUND"),
          error: err,
        });

      //All Details From  admin
      var startMeter = req.body.startMeter
        ? req.body.startMeter
        : doc.acsp.startMeter;
      var startTime = req.body.startTime
        ? req.body.startTime
        : doc.acsp.startTime;
      req.body.startTime = startTime;
      //Basic Data
      if (!req.body.distance || Number(req.body.distance) < 0)
        req.body.distance = doc.csp.distanceKM;
      var distanceUnit = config.distanceUnit;
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, {
        countryId: doc.countryId,
      });
      if (filterDocumet.length) distanceUnit = filterDocumet[0].distanceUnit;
      if (distanceUnit == "Miles") {
        var distanceInUnit = parseFloat(req.body.distance * 0.621371).toFixed(
          2
        );
      } else {
        var distanceInUnit = req.body.distance;
      }

      var timeInMinutes = req.body.duration;
      var waitingTime = req.body.waitingSecond ? req.body.waitingSecond : 0; //Sec
      var conveyanceKM = doc.acsp.conveyanceKM; //Sec
      waitingTime = parseFloat(waitingTime) / 60;
      waitingTime = Math.ceil(waitingTime);
      var additionalFee = [];
      var discountPercentage = 0;

      var waitingTimeBeforeTripStart = 0;
      if (featuresSettings.checkWaitingTimeBeforeTripStart) {
        waitingTimeBeforeTripStart = GFunctions.getMinsBtDateTime(
          doc.acsp.startTime,
          doc.acsp.arrivedTime
        );
      }

      if (!req.body.dropLat) req.body.dropLat = doc.dsp.endcoords[1];
      if (!req.body.dropLng) req.body.dropLng = doc.dsp.endcoords[0];

      if (doc.triptype == "rental" || doc.triptype == "outstation") {
        if (!req.body.endMeter || req.body.endMeter == "") {
          return res
            .status(409)
            .json({ success: false, message: "Enter Valid End Meter" });
        }
        //rental
        var distanceKMFromMeter =
          Number(req.body.endMeter) - Number(startMeter);
        if (Number(distanceKMFromMeter) < 0) {
          return res.status(409).json({
            success: false,
            message: "End Meter Should be Greater than Start",
          });
        }
        req.body.endTime = req.body.endTime
          ? req.body.endTime
          : GFunctions.getISODate();
        var timeInMin = GFunctions.getMinsBtDateTime(
          req.body.endTime,
          startTime
        );
        distanceInUnit = distanceKMFromMeter;
      }

      //extra km
      var paramsData = {
        dropLat: req.body.dropLat,
        dropLng: req.body.dropLng,
        distanceInKM: distanceInUnit,
        serviceId: doc.scId,
      };
      var dropLocationKM = await checkDropLocation(paramsData);
      if (dropLocationKM.success) distanceInUnit = dropLocationKM.totalKm;

      if (distanceUnit == "Miles")
        distanceInUnit = parseFloat(dropLocationKM.totalKm * 0.621371).toFixed(
          2
        );
      //extra km

      req.body.tripTime = req.body.tripTime
        ? req.body.tripTime
        : doc.adsp.start;

      if (doc.triptype == "rental") {
        // var distanceKMtest = await checkDistanceKMFromPackage(distanceInUnit, doc.csp.packageId, 0, timeInMin);
        var fareDetails = await getRentalFareEstimationAtTripEnd(
          doc.service,
          doc.csp.packageId,
          distanceInUnit,
          timeInMin,
          0,
          doc.bookingType
        );
        var discountAmt = 0;
        fareDetails.discountAmt = doc.csp.promoamt;

        fareDetails["returnKM"] = dropLocationKM.extraKM;
        fareDetails["returnTime"] = 0;
        fareDetails["extraKM"] = (
          Number(fareDetails["returnKM"]) +
          Number(fareDetails.additionalDistance)
        ).toFixed(2);
        fareDetails["readabledistanceKM"] = distanceKMFromMeter + " KM";
        fareDetails["readableEstTime"] = fareDetails.travelTime;

        //For Toll and old balance
        fareDetails.tollFee = req.body.tollFee ? req.body.tollFee : 0;
        if (featuresSettings.isTollAdded) {
          if (Number(fareDetails.tollFee) > 0) {
            fareDetails.totalFare = (
              Number(fareDetails.totalFare) + Number(fareDetails.tollFee)
            ).toFixed(2);
            fareDetails.BalanceFare = fareDetails.totalFare;
          }
        }

        fareDetails.totalFareWithOutOldBal = fareDetails.totalFare;
        if (featuresSettings.isRiderCancellationAmtApplicable) {
          //Adding Old Cancelation Charge
          var oldCancelationAmount = 0; //OCC
          if (doc.ridid != "" || doc.ridid != null || doc.ridid != undefined) {
            var riderWallet = await getRiderWalletDetails(doc.ridid);
            if (riderWallet.success == true)
              oldCancelationAmount = riderWallet.balance;
          }
          if (Number(oldCancelationAmount) > 0) {
            fareDetails.oldCancellationAmt = Number(oldCancelationAmount);
            fareDetails.totalFare = (
              Number(fareDetails.totalFare) +
              Number(fareDetails.oldCancellationAmt)
            ).toFixed(2);
            fareDetails.BalanceFare = fareDetails.totalFare;
          }
        }
        //For Toll and old balance

        var InvoiceDetailsParams = {
          triptype: doc.triptype,
          distanceKM: fareDetails.readabledistanceKM
            ? fareDetails.readabledistanceKM
            : 0,
          estTime: fareDetails.readableEstTime
            ? fareDetails.readableEstTime
            : 0,
          packageName: fareDetails.packageName,
          distfare: Number(fareDetails.KMFare),
          baseKM: fareDetails.packageDistance ? fareDetails.packageDistance : 0,
          fareForExtraKM: fareDetails.additionalDistanceFare
            ? fareDetails.additionalDistanceFare
            : 0,
          extraKM: fareDetails.additionalDistance
            ? fareDetails.additionalDistance
            : 0,
          perKmRate: fareDetails.perKMRate
            ? fareDetails.perKMRate
            : doc.csp.perKmRate,
          fareForExtraTime: fareDetails.additionalDurationFare
            ? fareDetails.additionalDurationFare
            : 0,
          extraTime: fareDetails.additionalDuration
            ? fareDetails.additionalDuration
            : 0,
          timefare: Number(fareDetails.travelFare)
            ? Number(fareDetails.travelFare)
            : 0,
          conveyance: Number(fareDetails.pickupCharge)
            ? Number(fareDetails.pickupCharge)
            : 0,
          hillFare: fareDetails.hillFare ? fareDetails.hillFare : 0,
          cost: fareDetails.totalFare,
          taxPercentage: Number(fareDetails.taxPercentage)
            ? Number(fareDetails.taxPercentage)
            : 0,
          tax: Number(fareDetails.tax) ? Number(fareDetails.tax) : 0,
          taxTDSPercentage: Number(fareDetails.taxTDSPercentage)
            ? Number(fareDetails.taxTDSPercentage)
            : 0,
          taxTDS: Number(fareDetails.taxTDS) ? Number(fareDetails.taxTDS) : 0,
          BaseFare: Number(fareDetails.BaseFare)
            ? Number(fareDetails.BaseFare)
            : 0,
          fareBeforeTax: Number(fareDetails.fareBeforeTax)
            ? Number(fareDetails.fareBeforeTax)
            : 0,
          oldCancellationAmt: Number(oldCancelationAmount)
            ? Number(oldCancelationAmount)
            : 0,
          tollFee: Number(fareDetails.tollFee)
            ? Number(fareDetails.tollFee)
            : 0,
          booking: Number(fareDetails.bookingFare)
            ? Number(fareDetails.bookingFare)
            : 0,
          gatewayCharge: Number(fareDetails.gatewayCharge)
            ? Number(fareDetails.gatewayCharge)
            : 0,
        };
        var rentalPackageInvoiceDetailsData = await rentalPackageInvoiceDetails(
          InvoiceDetailsParams,
          false
        );

        return res.status(200).json({
          success: false,
          message: req.i18n.__("DETAILS_FETCHED_SUCCESSFULY"),
          rentalPackageInvoiceDetailsData: rentalPackageInvoiceDetailsData,
        });
      } else if (doc.triptype == "outstation") {
        var tripTimeInHr = Number(timeInMin / 60);
        var KMtraveledPerHr = Number(
          (distanceInUnit / tripTimeInHr).toFixed(2)
        );
        if (KMtraveledPerHr > featuresSettings.possiblePerHrKM) {
          //Not possible to travel
          return res
            .status(409)
            .json({ success: false, message: "Check End Meter Reading" });
        }

        req.body.vehicleTypeId = doc.service;
        req.body.outstationType = doc.dsp.outstationType;
        var outstationDetails = await getOutstationVehicleListWithFare(
          req,
          distanceInUnit,
          timeInMin,
          "finalamount",
          additionalFee
        ); //Get for single vehicle
        var fareDetails = outstationDetails.vehicleList[0].fareDetails;

        fareDetails["hillKm"] = 0;
        if (Number(req.body.hillKm) > 0) {
          fareDetails["hillKm"] = req.body.hillKm;
        }
        if (req.body.hillKm == "") {
          fareDetails["hillKm"] = 0;
        }
        fareDetails["hillFare"] = (Number(fareDetails["hillKm"]) * 2).toFixed(
          2
        );
        if (isNaN(fareDetails["hillFare"]) > 0) {
          fareDetails["hillFare"] = 0;
        }
        fareDetails.totalFare =
          Number(fareDetails.totalFare) + Number(fareDetails["hillFare"]);

        fareDetails["readabledistanceKM"] = distanceInUnit + " KM";
        fareDetails["readableEstTime"] = fareDetails.travelTime;

        //For Toll and old balance
        fareDetails.tollFee = req.body.tollFee ? req.body.tollFee : 0;
        if (featuresSettings.isTollAdded) {
          if (Number(fareDetails.tollFee) > 0) {
            fareDetails.totalFare = (
              Number(fareDetails.totalFare) + Number(fareDetails.tollFee)
            ).toFixed(2);
            fareDetails.BalanceFare = fareDetails.totalFare;
          }
        }

        fareDetails.totalFareWithOutOldBal = fareDetails.totalFare;
        if (featuresSettings.isRiderCancellationAmtApplicable) {
          //Adding Old Cancelation Charge
          var oldCancelationAmount = 0; //OCC
          if (doc.ridid != "" || doc.ridid != null || doc.ridid != undefined) {
            var riderWallet = await getRiderWalletDetails(doc.ridid);
            if (riderWallet.success == true)
              oldCancelationAmount = riderWallet.balance;
          }
          if (Number(oldCancelationAmount) > 0) {
            fareDetails.oldCancellationAmt = Number(oldCancelationAmount);
            fareDetails.totalFare = (
              Number(fareDetails.totalFare) +
              Number(fareDetails.oldCancellationAmt)
            ).toFixed(2);
            fareDetails.BalanceFare = fareDetails.totalFare;
          }
        }
        //For Toll and old balance
        var InvoiceDetailsParams = {
          triptype: doc.triptype,
          distanceKM: fareDetails.readabledistanceKM
            ? fareDetails.readabledistanceKM
            : 0,
          estTime: fareDetails.readableEstTime
            ? fareDetails.readableEstTime
            : 0,
          packageName: fareDetails.packageName,
          distfare: Number(fareDetails.baseFare), // Number(fareDetails.KMFare),
          baseKM: fareDetails.packageDistance ? fareDetails.packageDistance : 0,
          // fareForExtraKM: fareDetails.additionalDistanceFare ? fareDetails.additionalDistanceFare : 0,
          extraKM: fareDetails.additionalDistance
            ? fareDetails.additionalDistance
            : 0,
          perKmRate: fareDetails.perKMRate
            ? fareDetails.perKMRate
            : doc.csp.perKmRate,
          fareForExtraTime: fareDetails.additionalDurationFare
            ? fareDetails.additionalDurationFare
            : 0,
          extraTime: fareDetails.additionalDuration
            ? fareDetails.additionalDuration
            : 0,
          timefare: Number(fareDetails.travelFare)
            ? Number(fareDetails.travelFare)
            : 0,
          conveyance: Number(fareDetails.pickupCharge)
            ? Number(fareDetails.pickupCharge)
            : 0,
          hillFare: fareDetails.hillFare ? fareDetails.hillFare : 0,
          cost: fareDetails.totalFare,
          taxPercentage: Number(fareDetails.taxPercentage)
            ? Number(fareDetails.taxPercentage)
            : 0,
          tax: Number(fareDetails.tax) ? Number(fareDetails.tax) : 0,
          fareBeforeTax: Number(fareDetails.fareBeforeTax)
            ? Number(fareDetails.fareBeforeTax)
            : 0,
          oldCancellationAmt: Number(oldCancelationAmount)
            ? Number(oldCancelationAmount)
            : 0,
          tollFee: Number(fareDetails.tollFee)
            ? Number(fareDetails.tollFee)
            : 0,
          nightFare: Number(fareDetails.nightFare)
            ? Number(fareDetails.nightFare)
            : 0,
          dayFare: Number(fareDetails.dayFare)
            ? Number(fareDetails.dayFare)
            : 0,
          taxTDSPercentage: Number(fareDetails.taxTDSPercentage)
            ? Number(fareDetails.taxTDSPercentage)
            : 0,
          taxTDS: Number(fareDetails.taxTDS) ? Number(fareDetails.taxTDS) : 0,
          BaseFare: Number(fareDetails.BaseFare)
            ? Number(fareDetails.BaseFare)
            : 0,
          booking: Number(fareDetails.bookingFare)
            ? Number(fareDetails.bookingFare)
            : 0,
          gatewayCharge: Number(fareDetails.gatewayCharge)
            ? Number(fareDetails.gatewayCharge)
            : 0,

          fareForExtraKM: Number(fareDetails.remainingFare)
            ? Number(fareDetails.remainingFare)
            : 0,
          remainingFareLabel: fareDetails.remainingFareLabel
            ? fareDetails.remainingFareLabel
            : null,
        };
        var rentalPackageInvoiceDetailsData = await rentalPackageInvoiceDetails(
          InvoiceDetailsParams,
          false
        );

        return res.status(200).json({
          success: false,
          message: req.i18n.__("DETAILS_FETCHED_SUCCESSFULY"),
          rentalPackageInvoiceDetailsData: rentalPackageInvoiceDetailsData,
        });
      } else {
        var tollFee = req.body.tollFee ? req.body.tollFee : 0;
        let vehicleCharge = await getCityBasedVehicleCharge(
          doc.service,
          doc.dsp.pickupCity,
          distanceInUnit,
          timeInMinutes,
          req.body.tripTime,
          waitingTime,
          additionalFee,
          discountPercentage,
          doc._id,
          tollFee,
          waitingTimeBeforeTripStart,
          doc.bookingType
        );
        var fareDetails = vehicleCharge.fareDetails;
        fareDetails["applyValues"] = vehicleCharge.applyValues;
        fareDetails.distanceObj = null;
        fareDetails.distance = distanceInUnit;
        fareDetails.duration = timeInMinutes;
        // fareDetails.oldBalance = riderdoc.balance;
        fareDetails.discountAmt = doc.csp.promoamt;
        // fareDetails.totalFare = Number(fareDetails.totalFare) + Number(riderdoc.balance);
        fareDetails["extraKM"] = dropLocationKM.extraKM;
        fareDetails["readabledistanceKM"] = distanceInUnit + " " + distanceUnit;
        fareDetails["readableEstTime"] =
          GFunctions.convertMinToLable(timeInMinutes);
        fareDetails["tollFee"] = tollFee;

        fareDetails.DetuctedFare =
          Number(fareDetails.DetuctedFare) + Number(fareDetails.discountAmt);
        fareDetails.totalFare =
          Number(fareDetails.totalFare) - Number(fareDetails.DetuctedFare); //Promo reduced from Total fare
        if (Number(fareDetails.totalFare) < 0) fareDetails.totalFare = 0;
        var dailyEstimation = {
          actualCost: fareDetails.KMFare,
          distanceFare: fareDetails.KMFare,
          baseFare: fareDetails.BaseFare,
          waitingFare: fareDetails.waitingFare,
          waitingCharge: fareDetails.waitingCharge,
          travelRate: fareDetails.travelRate,
          travelFare: fareDetails.travelFare,
          tax: fareDetails.tax,
          taxPercentage: fareDetails.taxPercentage,
          taxTDS: fareDetails.taxTDS,
          taxTDSPercentage: fareDetails.taxTDSPercentage,
          nightChargedApplied: fareDetails.nightObj,
          discount: fareDetails.DetuctedFare,
          totalFare: fareDetails.totalFare,
          paymentmode: fareDetails.paymentMode,
          tollFee: tollFee,
          dist: fareDetails.distance,
        };
        return res.status(200).json({
          success: false,
          message: req.i18n.__("DETAILS_FETCHED_SUCCESSFULY"),
          fareDetails: dailyEstimation,
        });
      }
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
};

async function calculateFinalAmount(
  req,
  res,
  tripData,
  fare,
  riderdoc,
  language = "es"
) {
  try {
    if (
      req.body.endFromAdmin == undefined ||
      req.body.endFromAdmin == null ||
      req.body.endFromAdmin == ""
    )
      req.body.endFromAdmin = "app";
    // if (!req.body.distance || Number(req.body.distance) <= 0)
    //   req.body.distance = tripData.dsp.distanceKM;
    var distanceUnit = config.distanceUnit;
    var filterDocument = _.filter(countryDocs.defaultCountrySettings, {
      countryId: tripData.countryId,
    });
    if (filterDocument.length) distanceUnit = filterDocument[0].distanceUnit;

    //Already km converted to miles on estimation fare functionalities 
    if (distanceUnit == "Miles") {
      var distanceInUnit = parseFloat(req.body.distance * 0.621371).toFixed(2);
    } else {
      var distanceInUnit = req.body.distance;
    }
    // var distanceInUnit = req.body.distance
    // var distanceInUnit = req.body.distance

    // req.body.appDistance = distanceInUnit;
    // distanceInUnit = 10; //DWC
    var timeInMinutes = req.body.duration;
    var timeBtStartAndEnd = GFunctions.getMinsBtDateTime(
      GFunctions.getISODate(),
      tripData.acsp.startTime
    );
    timeInMinutes = timeBtStartAndEnd;
    // timeInMinutes = 15; //DWC

    var waitingTime = req.body.waitingSecond ? req.body.waitingSecond : 0; //Sec
    var conveyanceKM = tripData.acsp.conveyanceKM; //Sec
    waitingTime = parseFloat(waitingTime) / 60;
    waitingTime = Math.floor(waitingTime); //floor

    if (!req.body.dropLat) req.body.dropLat = tripData.dsp.endcoords[1];
    if (!req.body.dropLng) req.body.dropLng = tripData.dsp.endcoords[0];

    var plat = tripData.adsp.pLat
      ? tripData.adsp.pLat
      : tripData.dsp.startcoords[1];
    var plng = tripData.adsp.pLng
      ? tripData.adsp.pLng
      : tripData.dsp.startcoords[0];
    const from = plat + "," + plng;
    const to = req.body.dropLat + "," + req.body.dropLng;
    if (!req.body.endAddress) {
      var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
      req.body.endAddress = gdmResult.to ? gdmResult.to : tripData.dsp.end;
    }
    if (req.body.endFromAdmin != "admin") {
      var distanceAfterVerified =
        await GFunctions.calculateDistanceBasedOnLimit(
          from,
          to,
          distanceInUnit,
          waitingTime,
          timeInMinutes,
          Number(tripData.dsp.distanceKM)
        );
      if (distanceAfterVerified.distanceValue)
        distanceInUnit = Number(distanceAfterVerified.distanceValue);
      if (distanceAfterVerified.waitingTimeInMins)
        waitingTime = Number(distanceAfterVerified.waitingTimeInMins);
      var tripServerDistance = await TripLocation.findOne(
        { tripId: mongoose.Types.ObjectId(tripData._id) },
        {}
      )
        .lean()
        .exec();
      if (tripServerDistance) {
        if (distanceUnit == "Miles") {
          tripServerDistance.distance = parseFloat(tripServerDistance.distance * 0.621371).toFixed(2);
        } 
        if (Number(tripServerDistance.distance) > Number(distanceInUnit)) {
          distanceInUnit = Number(tripServerDistance.distance);
          
        }
      }
    }
    var showFareFromEstimation = true;
    if (showFareFromEstimation && distanceInUnit < 0.05) {
      //if start and end lats are approx same, compare app distance and estimation => assign greater one.
      //var approxPickLatLng = plat.toFixed(4) +  plng.toFixed(4);
      //var approxDropLatLng = req.body.dropLat.toFixed(4) +  req.body.dropLat.toFixed(4);
      //if(approxPickLatLng == approxDropLatLng){

      var distInKm = (tripData.csp.dist / 1000).toFixed(2);
      // var distInKm = tripData.csp.dist
      if (distanceUnit == "Miles") {
        distInKm = parseFloat(distInKm.distance * 0.621371).toFixed(2);
      } 
      if (Number(distInKm) > Number(distanceInUnit)) {
        distanceInUnit = Number(distInKm);
      }
      if (req.body.appDistance > distanceInUnit) {
        distanceInUnit = Number(req.body.appDistance);
      } //giving higer distance
      //}
    }

    //extra km
    var paramsData = {
      dropLat: req.body.dropLat,
      dropLng: req.body.dropLng,
      distanceInKM: distanceInUnit,
      serviceId: tripData.scId,
    };
    var dropLocationKM = await checkDropLocation(paramsData);
    if (dropLocationKM.success) distanceInUnit = dropLocationKM.totalKm;

    // if (distanceUnit == "Miles")
    

    //   distanceInUnit = parseFloat(dropLocationKM.totalKm * 0.621371).toFixed(2);

    // if(req.body.distance > distanceInUnit){
    //   distanceInUnit = req.body.distance
    // }

    //extra km

    var additionalFee = [];
    if (featuresSettings.addAdditionalFaresInTrip) {
      additionalFee = req.body.additionalFee
        ? JSON.parse(req.body.additionalFee)
        : null;
    }

    var waitingTimeBeforeTripStart = 0;
    if (featuresSettings.checkWaitingTimeBeforeTripStart) {
      waitingTimeBeforeTripStart = GFunctions.getMinsBtDateTime(
        tripData.acsp.startTime,
        tripData.acsp.arrivedTime
      );
    }

    var tollFee = req.body.tollFee ? req.body.tollFee : 0;
    req.body.tripTime = req.body.tripTime
      ? req.body.tripTime
      : tripData.adsp.start;

    var discountPercentage = req.body.discountPercentage
      ? req.body.discountPercentage
      : 0;
    var discountName = req.body.discountName ? req.body.discountName : "";

    var tripsData = {
      from: from,
      to: to,
    };
    let vehicleCharge = await getCityBasedVehicleCharge(
      tripData.service,
      tripData.dsp.pickupCity,
      distanceInUnit,
      timeInMinutes,
      req.body.tripTime,
      waitingTime,
      additionalFee,
      discountPercentage,
      tripData._id,
      tollFee,
      waitingTimeBeforeTripStart,
      tripData.bookingType,
      true,
      "end",
      "",
      tripData.scId,
      tripsData
    );
    // return
    var fareDetails = vehicleCharge.fareDetails;
    distanceInUnit = fareDetails.distance;

    fareDetails["applyValues"] = vehicleCharge.applyValues;
    fareDetails.distanceObj = null;
    fareDetails.distance = distanceInUnit;
    fareDetails.duration = timeInMinutes;
    // fareDetails.oldBalance = riderdoc.balance;

    fareDetails.discountAmt = tripData.csp.promoamt;
    fareDetails.promoCode = tripData.csp.promo;
    if (!fareDetails.promoCode == "") {
      var promoAmtData = await Promo.findOne({ code: fareDetails.promoCode }, { amount: 1, code: 1, tripType: 1 }).exec();
      if (promoAmtData) {
        fareDetails.discountAmt = promoAmtData.amount;
        if (promoAmtData.amountType == "percentage") {
          var tripAmount = fareDetails.totalFare;
          var discountAmt = tripAmount * (promoAmtData.percentage / 100);
          if (discountAmt > promoAmtData.percentageAmountLimit) fareDetails.discountAmt = promoAmtData.percentageAmountLimit;
          else fareDetails.discountAmt = discountAmt;
        }
      }
    }


    // fareDetails.totalFare = Number(fareDetails.totalFare) + Number(riderdoc.balance);
    fareDetails["extraKM"] = dropLocationKM.extraKM;
    fareDetails["readabledistanceKM"] = distanceInUnit + " " + distanceUnit;
    fareDetails["readableEstTime"] =
      GFunctions.convertMinToLable(timeInMinutes);

    if (featuresSettings.riderSignupBonus) {
      var riderWalletdata = await Wallet.findOne(
        { ridid: riderdoc._id },
        { ridid: 1, bal: 1 }
      ).exec();
      var signupDiscountAmt = Number(
        fareDetails.totalFare *
        (Number(featuresSettings.discountsAvailable[0].percentage) / 100)
      ).toFixed(2);
      if (Number(riderWalletdata.bal) >= Number(signupDiscountAmt)) {
        if (discountPercentage <= 0) {
          discountPercentage =
            featuresSettings.discountsAvailable[0].percentage;
          discountName = "Signup Bonus";
          fareDetails.totalFare =
            Number(fareDetails.totalFare) - Number(signupDiscountAmt); //reduce Signup Discount amt
          fareDetails.DetuctedFare = Number(signupDiscountAmt);
          findNChargeExistingUserWallet(
            riderdoc._id,
            tripData._id,
            Number(signupDiscountAmt)
          );
        }
      }
    }

    fareDetails.BalanceFare =
      Number(fareDetails.totalFare) - Number(fareDetails.discountAmt); //@v2TODO
    fareDetails.totalFare =
      Number(fareDetails.totalFare) - Number(fareDetails.discountAmt); //Promo reduced from Total fare
    if (Number(fareDetails.totalFare) < 0)
      fareDetails.totalFare = fareDetails.BalanceFare = 0;
    fareDetails.paymentMode = tripData.csp.via.toLowerCase();

    if (Number(fareDetails.discountAmt) > 0) {
      fareDetails.comisonAmt = (
        Number(fareDetails.comisonAmt) - Number(fareDetails.discountAmt)
      ).toFixed(2);
    }

    //Discount
    fareDetails["discountPercentage"] = discountPercentage;
    fareDetails["discountName"] = discountName;

    var oldCancelationAmount = tripData.csp.oldBalance
      ? tripData.csp.oldBalance
      : 0; //OCC
    if (Number(oldCancelationAmount) > 0) {
      fareDetails.oldCancellationAmt = Number(oldCancelationAmount);
      fareDetails.totalFare = (
        Number(fareDetails.totalFare) + Number(fareDetails.oldCancellationAmt)
      ).toFixed(2);
      fareDetails.BalanceFare = fareDetails.totalFare;
    }

    fareDetails.tollFee = req.body.tollFee ? req.body.tollFee : 0;
    // if (featuresSettings.isTollAdded) {
    // 	if (Number(fareDetails.tollFee) > 0) {
    // 		fareDetails.totalFare = (Number(fareDetails.totalFare) + Number(fareDetails.tollFee)).toFixed(2);
    // 		fareDetails.BalanceFare = fareDetails.totalFare;
    // 	}
    // }

    var driverWalletDetuctionType = "debit";
    var driverWalletDetuctionAmt = 0;
    driverWalletDetuctionAmt =
      Number(fareDetails.comisonAmt ? fareDetails.comisonAmt:0) +
      Number(fareDetails.tax ? fareDetails.tax:0) +
      Number(fareDetails.bookingFare ? fareDetails.bookingFare:0) +
      Number(fareDetails.oldCancellationAmt ? fareDetails.oldCancellationAmt:0)+
      Number(req.body.tollFee ? req.body.tollFee:0)
    fareDetails.hotelcommisionAmt = 0;
    if (tripData.hotelid) {
      var hotelcommisionObj = await getHotelCommison(
        fareDetails.totalFare,
        tripData.hotelid
      );
      if (hotelcommisionObj) {
        fareDetails.BalanceFare =
          Number(fareDetails.BaseFare) +
          Number(hotelcommisionObj.hotelcommisionAmt);
        fareDetails.totalFare =
          Number(fareDetails.totalFare) +
          Number(hotelcommisionObj.hotelcommisionAmt);
        fareDetails.hotelcommisionAmt = hotelcommisionObj.hotelcommisionAmt;
        fareDetails.hotelcommision = hotelcommisionObj.hotelcommision;
        var hotelParams = {
          hotelid: tripData.hotelid,
          hotelname: hotelcommisionObj.hotelName,
          trxId: tripData.tripno,
          description: "trips - credit",
          amt: fareDetails.hotelcommisionAmt,
          paymentDate: tripData.date,
          paymentDateSort: GFunctions.getISODate(),
          type: "credit",
        };
        updateHotelWallet(hotelParams.hotelid, hotelParams);
      }
    }

    fareDetails.companyCommisionAmt = 0;
    if (tripData.cpyid) {
      var companyCommisionObj = await getCompanyCommison(
        fareDetails.totalFare,
        tripData.cpyid
      );
      fareDetails.companycommisionAmt = Number(companyCommisionObj);
    }

    var addToDriverWallet = true;
    var totalToBeDetuctFromDriver =
      Number(fareDetails.comisonAmt) +
      Number(fareDetails.tax) +
      Number(fareDetails.bookingFare) +
      Number(fareDetails.oldCancellationAmt);

    //@TODOv2 For Chareging Credit / Stripe / Wallet == Modified fare detail needed
    var paymentRes = false;
    var carddebt = 0;
    var cashpaid = fareDetails.BalanceFare;
    fareDetails.gatewayCharge = 0;
    fareDetails.cardPaymentSuccess = false;
    if (
      fareDetails.paymentMode == "card" &&
      featuresSettings.riderCard &&
      featuresSettings.riderTripPaidInClientSide == false
    ) {
      // fareDetails.gatewayCharge = (Number(((Number(fareDetails.totalFare) * Number(featuresSettings.stripePaymentPercentage)) / 100).toFixed(2))) + (Number(Number(featuresSettings.centsToAddExtraForStripe) * 0.7121).toFixed(2));
      var stripeFare = Number(
        (Number(fareDetails.totalFare) *
          Number(featuresSettings.stripePaymentPercentage)) /
        100
      ).toFixed(2);
      var centFare = Number(
        Number(featuresSettings.centsToAddExtraForStripe) / 100
      ).toFixed(2);
      fareDetails.gatewayCharge = Number(stripeFare) + Number(centFare);
      fareDetails.gatewayCharge = Number(fareDetails.gatewayCharge).toFixed(2);
      fareDetails.totalFare =
        Number(fareDetails.totalFare) + Number(fareDetails.gatewayCharge);
      fareDetails.totalFare = Number(fareDetails.totalFare).toFixed(2);
      fareDetails.BalanceFare = fareDetails.totalFare;
      paymentRes = await findNChargeExistingUserCard(
        tripData.ridid,
        tripData._id,
        fareDetails.BalanceFare,
        fareDetails.comisonAmt,
        tripData.dvrid,
        tripData.tripno,
        tripData.paymentGateway
      );
    }
    console.log(paymentRes,"paymentRes")
    //Updating Digital Payment if exists
    if (paymentRes) {
      if (paymentRes.success) {
        carddebt = paymentRes.detectedAmt;
        cashpaid = paymentRes.balancetopay;
        fareDetails.BalanceFare = paymentRes.balancetopay;
        fareDetails.DetuctedFare = paymentRes.detectedAmt;
        fareDetails.tranxid = paymentRes.tranxid;
        driverWalletDetuctionType = "credit";
        driverWalletDetuctionAmt =
          Number(carddebt ? carddebt:0) -
          Number(fareDetails.comisonAmt ? fareDetails.comisonAmt:0) -
          Number(fareDetails.gatewayCharge ? fareDetails.gatewayCharge:0); //Only Trip amount except commision
        addToDriverWallet = paymentRes.addToWallet;
        fareDetails.cardPaymentSuccess = true;
      }
      if (!paymentRes.success) {
        fareDetails.paymentMode = "cash";
        fareDetails.totalFare =
          Number(fareDetails.totalFare) - Number(fareDetails.gatewayCharge);
        fareDetails.totalFare = Number(fareDetails.totalFare).toFixed(2);
        fareDetails.BalanceFare = fareDetails.totalFare;
        fareDetails.gatewayCharge = 0;
      }
    }

    if (
      fareDetails.paymentMode == "card" &&
      featuresSettings.riderTripPaidInClientSide
    ) {
      driverWalletDetuctionType = "credit";
      driverWalletDetuctionAmt = fareDetails.BalanceFare; //check

    }

    if (
      fareDetails.paymentMode == "card" &&
      config.paymentGateway.paymentGatewayName == "braintree"
    ) {
      driverWalletDetuctionType = "credit";
      driverWalletDetuctionAmt = fareDetails.BalanceFare;

    }

    if (
      fareDetails.paymentMode == "card" &&
      featuresSettings.riderTripPaidInClientSide &&
      config.paymentGateway.paymentGatewayName == "paytm"
    ) {
      driverWalletDetuctionType = "credit";
      driverWalletDetuctionAmt = fareDetails.BalanceFare;
    }

    if (
      fareDetails.paymentMode == "card" &&
      featuresSettings.riderTripPaidInClientSide &&
      config.paymentGateway.paymentGatewayName == "razorpay"
    ) {
      fareDetails.gatewayCharge = Number(
        (
          (Number(fareDetails.totalFare) *
            Number(
              featuresSettings.amountToRedueForRazorPayPaymentPercentage
            )) /
          100
        ).toFixed(2)
      );
      fareDetails.totalFare =
        Number(fareDetails.totalFare) + Number(fareDetails.gatewayCharge);
      fareDetails.BalanceFare = fareDetails.totalFare;
      driverWalletDetuctionType = "credit";
      driverWalletDetuctionAmt = fareDetails.BalanceFare;
    }

    //For Chareging  Wallet == Modified fare detail needed
    var walletRes = false;
    var walletdebt = 0;
    var cashpaid = fareDetails.BalanceFare;
    if (fareDetails.paymentMode == "wallet" && featuresSettings.riderWallet) {
      walletRes = await findNChargeExistingUserWallet(
        tripData.ridid,
        tripData._id,
        fareDetails.BalanceFare
      );
    }
    //Updating Digital Payment if exists
    if (walletRes) {
      if (walletRes.success) {
        walletdebt = walletRes.detectedAmt;
        cashpaid = walletRes.balancetopay;
        fareDetails.BalanceFare = walletRes.balancetopay;
        fareDetails.DetuctedFare = walletRes.detectedAmt;
        fareDetails.tranxid = walletRes.tranxid;
        driverWalletDetuctionType = "credit";
        // driverWalletDetuctionAmt = walletdebt;
        driverWalletDetuctionAmt =
          Number(walletdebt) - Number(fareDetails.comisonAmt);
      }
    }

    /*if (Number(fareDetails.oldCancellationAmt) > 0 ) {
      updateRiderOldBalanceDetails(tripData.ridid, fareDetails.oldCancellationAmt);
    }*/

    var DriverPaymentDetailsSplits = {};
    var digital =
      parseFloat(carddebt) +
      parseFloat(fareDetails.discountAmt) +
      Number(walletdebt); //EXPRESSMK mkno
    var outstanding = parseFloat(fareDetails.totalFare) - parseFloat(digital); //
    var inhand = parseFloat(cashpaid) - parseFloat(digital); //
    var totalDetuctFromWallet =
      Number(fareDetails.comisonAmt) +
      Number(fareDetails.tax) +
      Number(fareDetails.taxTDS);
    if (featuresSettings.addBookingFeeToCommission)
      totalDetuctFromWallet =
        Number(totalDetuctFromWallet) + Number(fareDetails.bookingFare);
    var totalDetucted = (
      Number(totalDetuctFromWallet) + Number(fareDetails.tollFee)
    );
    console.log(fareDetails.tollFee,"fareDetails.tollFee")
    var totalEarnings =
      (Number(fareDetails.totalFare) - Number(totalDetucted)) -
      Number(fareDetails.gatewayCharge);
    DriverPaymentDetailsSplits.amttopay = Number(fareDetails.totalFare)
    DriverPaymentDetailsSplits.cashpaid = Number(cashpaid)
    DriverPaymentDetailsSplits.commision = Number(fareDetails.comisonAmt);
    DriverPaymentDetailsSplits.promoamt = Number(fareDetails.discountAmt);
    DriverPaymentDetailsSplits.walletdebt = Number(walletdebt);
    DriverPaymentDetailsSplits.carddebt = Number(carddebt);
    DriverPaymentDetailsSplits.digital = Number(digital);
    DriverPaymentDetailsSplits.outstanding = Number(outstanding);
    DriverPaymentDetailsSplits.inhand = Number(inhand);
    DriverPaymentDetailsSplits.booking = Number(fareDetails.bookingFare);
    DriverPaymentDetailsSplits.totalDetucted = Number(totalDetucted);
    DriverPaymentDetailsSplits.tax = Number(fareDetails.tax).toFixed(2);
    DriverPaymentDetailsSplits.tollFee = Number(fareDetails.tollFee);
    DriverPaymentDetailsSplits.amttodriver = Number(totalEarnings)
    DriverPaymentDetailsSplits.toSettle =
      (Number(fareDetails.totalFare) -
      Number(fareDetails.comisonAmt) -
      Number(inhand))
    DriverPaymentDetailsSplits.distanceUnit = distanceUnit;
    DriverPaymentDetailsSplits.totalDistTravelled = distanceInUnit;
    DriverPaymentDetailsSplits.GatewayCharge = Number(fareDetails.gatewayCharge)
    var updateFareDetails = await updateFareDetailsInTrip(
      fareDetails,
      req,
      tripData,
      req.body.endAddress,
      DriverPaymentDetailsSplits
    );
    if (!updateFareDetails)
      return res.status(409).json({
        success: false,
        message: req.i18n.__("Trip Details Not Updated..."),
      });
    //Deduct Driver Commsion from Driver Wallet
    // if (featuresSettings.deductDuringTripEnd) {
    //   if (
    //     featuresSettings.driverPayouts.adminCommision == "driverWallet" &&
    //     addToDriverWallet
    //   ) {
    //     if (fareDetails.paymentMode == "cash") {
    //       /*if (featuresSettings.driverPayouts.deductAmountFromDriverWallet == 'totalFare') {
    //         driverWalletDetuctionAmt = fareDetails.totalFare;
    //       } else if (featuresSettings.driverPayouts.deductAmountFromDriverWallet == 'commision') {
    //         fareDetails.comisonAmt = Number(fareDetails.comisonAmt) + Number(fareDetails.tax) + Number(fareDetails.bookingFare);
    //         driverWalletDetuctionAmt = Number(fareDetails.comisonAmt);
    //       }*/
    //     }

    //     if (Number(driverWalletDetuctionAmt) > 0) {
    //       driverWalletDetuctionType = "debit";
    //     } else {
    //       driverWalletDetuctionType = "credit";
    //       driverWalletDetuctionAmt = Math.abs(driverWalletDetuctionAmt);
    //     }
    //     /* if (driverWalletDetuctionType == 'debit')  {
    //       driverWalletDetuctionAmt = Number(driverWalletDetuctionAmt) - Number(fareDetails.discountAmt);
    //     }else{
    //       driverWalletDetuctionAmt = Number(driverWalletDetuctionAmt) + Number(fareDetails.discountAmt);
    //     } */

    //     var tripParams = {
    //       driverId: tripData.dvrid,
    //       trxId: tripData.tripno,
    //       description: "trips - " + driverWalletDetuctionType,
    //       amt: driverWalletDetuctionAmt,
    //       paymentDate: tripData.date,
    //       paymentDateSort: GFunctions.getISODate(),
    //       type: driverWalletDetuctionType,
    //     };

    //     if(req.body.tollFee > 0){
    //       let driverWalletDetuction = "credit"
    //       var tollParams = {
    //         driverId: tripData.dvrid,
    //         trxId: tripData.tripno,
    //         description: "Toll - " + driverWalletDetuction,
    //         amt: req.body.tollFee,
    //         paymentDate: tripData.date,
    //         paymentDateSort: GFunctions.getISODate(),
    //         type: "credit",
    //       };
    //       updateDriverWallet(tripParams.driverId, tollParams);
    //     }

    //     //Update Driver Wallet.
    //     if (
    //       featuresSettings.payPackageTypes.length &&
    //       featuresSettings.payPackageTypes.includes("subscription")
    //     ) {
    //       let tripDriverData = await Driver.findOne(
    //         { _id: tripData.dvrid },
    //         { isSubcriptionActive: 1, subcriptionEndDate: 1, code: 1 }
    //       );
    //       if (
    //         tripDriverData &&
    //         tripDriverData.isSubcriptionActive &&
    //         driverWalletDetuctionType == "debit"
    //       ) {
    //         //no need to Debit the wallet
    //       } else {
    //         updateDriverWallet(tripParams.driverId, tripParams);
    //       }
    //     } else {
    //       updateDriverWallet(tripParams.driverId, tripParams);
    //     }
    //   }
    // } else {
    //   if (
    //     fareDetails.paymentMode == "cash" ||
    //     fareDetails.paymentMode == "wallet" ||
    //     fareDetails.paymentMode == "Others" ||
    //     fareDetails.paymentMode == "others"
    //   ) {
    //     paymentAmtToWallet(
    //       tripData.tripno,
    //       fareDetails.totalFare,
    //       tripData.paymentMode,
    //       tripData.tripno
    //     );
    //   }
    // }
    if (featuresSettings.deductDuringTripEnd) {
			if (featuresSettings.driverPayouts.adminCommision == 'driverWallet' && addToDriverWallet) {

				if (fareDetails.paymentMode == 'cash' || fareDetails.paymentMode == "wallet") {
					if (fareDetails.paymentMode == 'cash') {
						driverWalletDetuctionType = 'debit';
					}
					/*if (featuresSettings.driverPayouts.deductAmountFromDriverWallet == 'totalFare') {
						driverWalletDetuctionAmt = fareDetails.totalFare;
					} else if (featuresSettings.driverPayouts.deductAmountFromDriverWallet == 'commision') {
						fareDetails.comisonAmt = Number(fareDetails.comisonAmt) + Number(fareDetails.tax) + Number(fareDetails.bookingFare);
						driverWalletDetuctionAmt = Number(fareDetails.comisonAmt);
					}*/
					// if (Number(driverWalletDetuctionAmt) > 0) {
					// 	driverWalletDetuctionType = 'debit';

					// } else {
					// 	driverWalletDetuctionType = 'credit';
					// 	driverWalletDetuctionAmt = Math.abs(driverWalletDetuctionAmt);
					// }

					if (driverWalletDetuctionType == 'debit') {
						driverWalletDetuctionAmt = Number(driverWalletDetuctionAmt);

						driverWalletDetuctionAmt = driverWalletDetuctionAmt - Number(fareDetails.discountAmt);
						driverWalletDetuctionAmt = driverWalletDetuctionAmt.toFixed(2)

						if (driverWalletDetuctionAmt < 0) {
							driverWalletDetuctionType = 'credit';
							driverWalletDetuctionAmt = Math.abs(driverWalletDetuctionAmt);
						}
					} else {
						driverWalletDetuctionAmt = Number(driverWalletDetuctionAmt) + Number(fareDetails.discountAmt);
					}

					if (fareDetails.paymentMode == "wallet" || fareDetails.paymentMode == "card") {
						driverWalletDetuctionType = 'credit';
					}
					// driverWalletDetuctionAmt = Math.ceil(driverWalletDetuctionAmt)
					driverWalletDetuctionAmt = driverWalletDetuctionAmt;
					var tripParams = {
						driverId: tripData.dvrid,
						trxId: tripData.tripno,
						description: "trips - " + driverWalletDetuctionType,
						amt: driverWalletDetuctionAmt,
						paymentDate: tripData.date,
						paymentDateSort: GFunctions.getISODate(),
						type: driverWalletDetuctionType
					}


					//Update Driver Wallet.
					if ((featuresSettings.payPackageTypes).length && featuresSettings.payPackageTypes.includes("subscription")) {
						let tripDriverData = await Driver.findOne({ _id: tripData.dvrid }, { isSubcriptionActive: 1, subcriptionEndDate: 1, code: 1 });

						if (tripDriverData && tripDriverData.isSubcriptionActive && driverWalletDetuctionType == 'debit') {
							//no need to Debit the wallet
						}
						else if (tripDriverData && tripDriverData.isSubcriptionActive && driverWalletDetuctionType == 'credit') {
							//no need to Debit the wallet
							tripParams.amt = fareDetails.totalFare;
							updateDriverWallet(tripParams.driverId, tripParams)
						} else {
							if (driverWalletDetuctionType == 'debit') {
								tripParams.driverWalletDetuctionType = driverWalletDetuctionType;
								updateDriverWallet(tripParams.driverId, tripParams)
							}
							else if (driverWalletDetuctionType == 'credit') {
								tripParams.driverWalletDetuctionType = driverWalletDetuctionType;
								updateDriverWallet(tripParams.driverId, tripParams)
							}
							else {
								tripParams.amt = fareDetails.totalFare;
								updateDriverWallet(tripParams.driverId, tripParams)
							}

						}
					} else {
						updateDriverWallet(tripParams.driverId, tripParams)

					}

				}
				else {
                 if (
          featuresSettings.payPackageTypes.length &&
          featuresSettings.payPackageTypes.includes("subscription")
        ) {
                    let tripDriverData = await Driver.findOne(
            { _id: tripData.dvrid },
            { isSubcriptionActive: 1, subcriptionEndDate: 1, code: 1 }
          );
          if (
            tripDriverData &&
            tripDriverData.isSubcriptionActive
          ) {
            driverWalletDetuctionType = 'credit'
            var tripParams = {
              driverId: tripData.dvrid,
              trxId: tripData.tripno,
              description: "trips - " + driverWalletDetuctionType,
              amt: fareDetails.totalFare,
              paymentDate: tripData.date,
              paymentDateSort: GFunctions.getISODate(),
              type: driverWalletDetuctionType
            }
            updateDriverWallet(tripParams.driverId, tripParams)	
          }else {
          driverWalletDetuctionType = 'credit'
          var tripParams = {
            driverId: tripData.dvrid,
            trxId: tripData.tripno,
            description: "trips - " + driverWalletDetuctionType,
            amt:Number(totalEarnings),
            paymentDate: tripData.date,
            paymentDateSort: GFunctions.getISODate(),
            type: driverWalletDetuctionType
          }
          updateDriverWallet(tripParams.driverId, tripParams)	
        }
        }

				}
			}
		} else {
			if (fareDetails.paymentMode == 'cash' || fareDetails.paymentMode == 'wallet' || fareDetails.paymentMode == 'Others' || fareDetails.paymentMode == 'others' || tripData.bookingType == "hailRide") {
				paymentAmtToWallet(tripData.tripno, fareDetails.totalFare, tripData.paymentMode, tripData.tripno);
				// paymentAmtToWallet(tripData.tripno, fareDetails.totalFare, tripData.paymentMode, tripData.tripno);
			}
		}

    GFunctions.sendFCMMsg(riderdoc.fcmId, "Trip Ended", "tripEnd");

    if (featuresSettings.isPromoCodeAvailable) {
      if (
        typeof tripData.csp.promo != "undefined" ||
        tripData.csp.promo != ""
      ) {
        updatePromoCodeUsedLogctrl(
          tripData.csp.promo,
          tripData.tripId,
          tripData.ridid
        ); // chnage this Promo code is used by this User for this Trip
      }
    }

    sendTripReceiptSMS(tripData, fareDetails.totalFare);
    /* if (tripData.requestFrom === "admin" || tripData.bookingFor == 'others') {
      let riderDoc = await Rider.findById(tripData.ridid).exec();
      if (riderDoc !== null) {
        var toPhone = riderDoc.phone;
        var toPhoneCode = riderDoc.phcode;
        if (tripData.bookingFor == 'others') {
          toPhone = tripData.other.ph;
          toPhoneCode = tripData.other.phCode;
        }
        smsGateway.sendSmsMsg(toPhone, '', toPhoneCode, 'tripEndPaymentToRider', { 'FEE': fareDetails.totalFare });
      }
    } */

    if (featuresSettings.fareCalculationType == "indiaGst") {
      TripHelpers.sendTripGSTReceipt(tripData._id, riderdoc.email); // send Trip Receipt
    } else {
      if (tripData.bookingType == "hailRide" && req.body.cusemailid != "") {
        TripHelpers.sendTripReceipt(
          tripData._id,
          req.body.cusemailid,
          language
        ); // send Trip Receipt
      } else {
        TripHelpers.sendTripReceipt(tripData._id, riderdoc.email, language); // send Trip Receipt
      }
    }

    tripData.adsp.dLat = req.body.dropLat;
    tripData.adsp.dLng = req.body.dropLng;
    if (featuresSettings.updateTripPaths) {
      var tripPath = await TripLocation.findOne({ tripId: tripData._id });
      if (tripPath)
        GFunctions.saveStaticMapForTrip(tripData, tripPath.loc); // Save Gmap
      else GFunctions.saveStaticMapForTrip(tripData, []); // Save Gmap
    } else {
      var tripPath = [];
      GFunctions.saveStaticMapForTrip(tripData, tripPath); // Save Gmap
    }

    if (featuresSettings.isUpdateDriverPerDayEarnings) {
      var amtToDriver =
        Number(fareDetails.totalFare) -
        Number(totalDetuctFromWallet) -
        Number(fareDetails.tollFee);
      updateDriverPerDayEarnings(
        tripData.dvrid,
        1,
        amtToDriver,
        fareDetails.comisonAmt,
        distanceInUnit,
        distanceUnit
      );
    }

    // saveTemplateToPdf(tripData._id);
    clearRiderFbStatusAfterTripEnd(tripData.ridid, "", 0); // as finished

    if (tripData.bookingType == "rideLater") {
      removeFromSchedule(tripData._id); //Need ?
    }

    return res.json({
      success: true,
      message: req.i18n.__("TRIP_ENDED"),
      rider: riderdoc,
      pickupdetails: tripData.dsp,
      status: "Trip Ended",
      fare: fareDetails,
      taxitype: tripData.vehicle,
      startOTP: tripData.tripOTP[0],
      endOTP: tripData.tripOTP[1],
      tripType: tripData.triptype,
      multiLocation: tripData.multiLocation,
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
}

async function calculateFinalPackageAmount(
  req,
  res,
  tripData,
  fare,
  riderdoc,
  language
) {
  try {
    req.body.appDistance = Number(req.body.distance);
    if (isNaN(req.body.appDistance) || !req.body.appDistance)
      req.body.appDistance = distanceKMFromMeter;

    req.body.tollFee = req.body.tollFee ? req.body.tollFee : 0;
    var timeInMinutes = req.body.duration;
    var waitingTime = req.body.waitingSecond ? req.body.waitingSecond : 0; //Sec
    var conveyanceKM = tripData.acsp.conveyanceKM; //Sec
    waitingTime = parseFloat(waitingTime) / 60;
    waitingTime = Math.ceil(waitingTime);

    //All Details From  admin
    var startMeter = req.body.startMeter
      ? req.body.startMeter
      : tripData.acsp.startMeter;
    var startTime = req.body.startTime
      ? req.body.startTime
      : tripData.acsp.startTime;

    if (!req.body.endAddress) {
      const from =
        tripData.dsp.startcoords[1] + "," + tripData.dsp.startcoords[0];
      const to = req.body.dropLat + "," + req.body.dropLng;
      var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
      req.body.endAddress = gdmResult.to ? gdmResult.to : tripData.dsp.end;
    }

    if (!req.body.dropLat) req.body.dropLat = tripData.dsp.endcoords[1];
    if (!req.body.dropLng) req.body.dropLng = tripData.dsp.endcoords[0];

    var discountPercentage = req.body.discountPercentage
      ? req.body.discountPercentage
      : 0;
    var discountName = req.body.discountName ? req.body.discountName : "";

    var distanceKMFromMeter = Number(req.body.endMeter) - Number(startMeter);
    if (Number(distanceKMFromMeter) < 0) {
      return res.status(409).json({
        success: false,
        message: "End Meter Should be Greater than Start",
      });
    }

    if (
      req.body.endFromAdmin != undefined ||
      (typeof req.body.endFromAdmin != "undefined" &&
        req.body.endFromAdmin == "admin")
    ) {
      req.body.endTime = req.body.endTime;
    } else {
      req.body.endTime = GFunctions.getISODate();
    }
    var timeInMin = GFunctions.getMinsBtDateTime(req.body.endTime, startTime);

    var distanceKM = req.body.appDistance;
    if (featuresSettings.distanceKMFromMeter) {
      var isCheckEndMeterPossibleValid = await checkEndMeterPossible(
        distanceKMFromMeter,
        timeInMin
      );
      if (!isCheckEndMeterPossibleValid) {
        return res
          .status(409)
          .json({ success: false, message: "Please Check End Meter." });
      }
      // distanceKM = checkdistanceKMFromMeter(distanceKM, tripData._id);
      distanceKM = await checkDistanceKMFromPackage(
        distanceKMFromMeter,
        tripData.csp.packageId,
        req.body.appDistance,
        timeInMin
      );
      if (!distanceKM) {
        return res
          .status(409)
          .json({ success: false, message: "Please Check End Meter." });
      }
    }

    var paramsData = {
      dropLat: req.body.dropLat,
      dropLng: req.body.dropLng,
      distanceInKM: distanceKM,
      serviceId: tripData.scId,
    };
    var dropLocationKM = await checkDropLocation(paramsData);
    if (dropLocationKM.success) distanceKM = dropLocationKM.totalKm;

    var fareDetails = await getRentalFareEstimationAtTripEnd(
      tripData.service,
      tripData.csp.packageId,
      distanceKM,
      timeInMin,
      req.body.tollFee,
      tripData.bookingType
    );
    var discountAmt = 0;
    fareDetails.totalFare = Number(fareDetails.totalFare);
    fareDetails.discountAmt = tripData.csp.promoamt;
    fareDetails.promoCode = tripData.csp.promo;
    if (!fareDetails.promoCode == "") {
      var promoAmtData = await Promo.findOne(
        { code: fareDetails.promoCode },
        { amount: 1, code: 1, tripType: 1 }
      ).exec();
      if (promoAmtData) {
        fareDetails.discountAmt = promoAmtData.amount;
        if (promoAmtData.amountType == "percentage") {
          var tripAmount = fareDetails.totalFare;
          var discountAmt = tripAmount * (promoAmtData.percentage / 100);
          if (discountAmt > promoAmtData.percentageAmountLimit)
            fareDetails.discountAmt = promoAmtData.percentageAmountLimit;
          else fareDetails.discountAmt = discountAmt;
        }
      }
    }

    fareDetails["returnKM"] = dropLocationKM.extraKM;
    fareDetails["returnTime"] = 0;
    fareDetails["extraKM"] = (
      Number(fareDetails["returnKM"]) + Number(fareDetails.additionalDistance)
    ).toFixed(2);
    fareDetails["readabledistanceKM"] = distanceKM + " KM";
    fareDetails["readableEstTime"] = fareDetails.travelTime;
    //Add Pickup fare
    if (Number(tripData.csp.conveyance) > 0) {
      fareDetails["pickupCharge"] = Number(tripData.csp.conveyance);
      fareDetails.BalanceFare = fareDetails.totalFare =
        Number(fareDetails.totalFare) + Number(tripData.csp.conveyance);
    }

    fareDetails.BalanceFare =
      Number(fareDetails.totalFare) - Number(fareDetails.discountAmt);
    fareDetails.totalFare =
      Number(fareDetails.totalFare) - Number(fareDetails.discountAmt); //Promo reduced from Total fare
    fareDetails.paymentMode = tripData.csp.via.toLowerCase();
    if (Number(fareDetails.discountAmt) > 0) {
      fareDetails.comisonAmt = (
        Number(fareDetails.comisonAmt) - Number(fareDetails.discountAmt)
      ).toFixed(2);
    }

    fareDetails.totalFareWithOutOldBal =
      Number(fareDetails.totalFare) - Number(fareDetails.discountAmt); //Promo reduced from Total fare
    fareDetails.paymentMode = tripData.csp.via.toLowerCase();
    if (Number(fareDetails.discountAmt) > 0) {
      fareDetails.comisonAmt = (
        Number(fareDetails.comisonAmt) - Number(fareDetails.discountAmt)
      ).toFixed(2);
    }

    fareDetails.tollFee = req.body.tollFee ? req.body.tollFee : 0;
    // if (featuresSettings.isTollAdded) {
    // 	if (Number(fareDetails.tollFee) > 0) {
    // 		fareDetails.totalFare = (Number(fareDetails.totalFare) + Number(fareDetails.tollFee)).toFixed(2);
    // 		fareDetails.BalanceFare = fareDetails.totalFare;
    // 	}
    // }

    fareDetails.totalFareWithOutOldBal = fareDetails.totalFare;
    if (featuresSettings.isRiderCancellationAmtApplicable) {
      //Adding Old Cancelation Charge
      var oldCancelationAmount = 0; //OCC
      if (
        tripData.ridid != "" ||
        tripData.ridid != null ||
        tripData.ridid != undefined
      ) {
        var riderWallet = await getRiderWalletDetails(tripData.ridid);
        if (riderWallet.success == true)
          oldCancelationAmount = riderWallet.balance;
      }
      if (Number(oldCancelationAmount) > 0) {
        fareDetails.oldCancellationAmt = Number(oldCancelationAmount);
        fareDetails.totalFare = (
          Number(fareDetails.totalFare) + Number(fareDetails.oldCancellationAmt)
        ).toFixed(2);
        fareDetails.BalanceFare = fareDetails.totalFare;
      }
    }

    var driverWalletDetuctionType = "debit";
    var driverWalletDetuctionAmt = 0;

    fareDetails.gatewayCharge = 0;
    if (
      fareDetails.paymentMode == "card" &&
      featuresSettings.riderTripPaidInClientSide &&
      config.paymentGateway.paymentGatewayName == "razorpay"
    ) {
      fareDetails.gatewayCharge = Number(
        (
          (Number(fareDetails.totalFare) *
            Number(
              featuresSettings.amountToRedueForRazorPayPaymentPercentage
            )) /
          100
        ).toFixed(2)
      );
      fareDetails.totalFare =
        Number(fareDetails.totalFare) + Number(fareDetails.gatewayCharge);
      fareDetails.BalanceFare = fareDetails.totalFare;
      driverWalletDetuctionType = "credit";
      driverWalletDetuctionAmt = fareDetails.BalanceFare;
    }

    var addToDriverWallet = true;
    driverWalletDetuctionAmt =
      Number(fareDetails.comisonAmt) +
      Number(fareDetails.tax) +
      Number(fareDetails.taxTDS)+
      Number(req.body.tollFee);

    if (featuresSettings.addBookingFeeToCommission)
      driverWalletDetuctionAmt =
        Number(driverWalletDetuctionAmt) + Number(fareDetails.bookingFare);

    fareDetails.totalFare = Number(fareDetails.totalFare).toFixed(2);
    var DriverPaymentDetailsSplits = {};
    DriverPaymentDetailsSplits.amttopay = fareDetails.totalFare;
    DriverPaymentDetailsSplits.cashpaid = fareDetails.totalFare;
    DriverPaymentDetailsSplits.commision = fareDetails.comisonAmt;
    DriverPaymentDetailsSplits.promoamt = fareDetails.discountAmt;
    DriverPaymentDetailsSplits.walletdebt = 0;
    DriverPaymentDetailsSplits.carddebt = 0;
    DriverPaymentDetailsSplits.digital = fareDetails.discountAmt;
    DriverPaymentDetailsSplits.outstanding = 0;
    DriverPaymentDetailsSplits.inhand = fareDetails.totalFare;
    DriverPaymentDetailsSplits.tax = fareDetails.tax;
    DriverPaymentDetailsSplits.tollFee = fareDetails.tollFee;
    DriverPaymentDetailsSplits.amttodriver =
      parseFloat(fareDetails.totalFare) -
      parseFloat(driverWalletDetuctionAmt) -
      Number(fareDetails.tollFee);
    DriverPaymentDetailsSplits.toSettle =
      parseFloat(fareDetails.totalFare) - parseFloat(driverWalletDetuctionAmt);
      DriverPaymentDetailsSplits.GatewayCharge = Number(fareDetails.gatewayCharge);

    var InvoiceDetailsParams = {
      triptype: tripData.triptype,
      distanceKM: fareDetails.readabledistanceKM
        ? fareDetails.readabledistanceKM
        : 0,
      estTime: fareDetails.readableEstTime ? fareDetails.readableEstTime : 0,
      packageName: fareDetails.packageName,
      distfare: Number(fareDetails.KMFare),
      baseKM: fareDetails.packageDistance ? fareDetails.packageDistance : 0,
      fareForExtraKM: fareDetails.additionalDistanceFare
        ? fareDetails.additionalDistanceFare
        : 0,
      extraKM: fareDetails.additionalDistance
        ? fareDetails.additionalDistance
        : 0,
      perKmRate: fareDetails.perKMRate
        ? fareDetails.perKMRate
        : tripData.csp.perKmRate,
      fareForExtraTime: fareDetails.additionalDurationFare
        ? fareDetails.additionalDurationFare
        : 0,
      extraTime: fareDetails.additionalDuration
        ? fareDetails.additionalDuration
        : 0,
      timefare: Number(fareDetails.travelFare)
        ? Number(fareDetails.travelFare)
        : 0,
      conveyance: Number(fareDetails.pickupCharge)
        ? Number(fareDetails.pickupCharge)
        : 0,
      hillFare: fareDetails.hillFare ? fareDetails.hillFare : 0,
      cost: fareDetails.totalFare,
      taxPercentage: Number(fareDetails.taxPercentage)
        ? Number(fareDetails.taxPercentage)
        : 0,
      tax: Number(fareDetails.tax) ? Number(fareDetails.tax) : 0,
      taxTDSPercentage: Number(fareDetails.taxTDSPercentage)
        ? Number(fareDetails.taxTDSPercentage)
        : 0,
      taxTDS: Number(fareDetails.taxTDS) ? Number(fareDetails.taxTDS) : 0,
      BaseFare: Number(fareDetails.BaseFare) ? Number(fareDetails.BaseFare) : 0,
      booking: Number(fareDetails.bookingFare)
        ? Number(fareDetails.bookingFare)
        : 0,
      fareBeforeTax: Number(fareDetails.fareBeforeTax)
        ? Number(fareDetails.fareBeforeTax)
        : 0,
      oldCancellationAmt: Number(fareDetails.oldCancellationAmt)
        ? Number(fareDetails.oldCancellationAmt)
        : 0,
      tollFee: Number(fareDetails.tollFee) ? Number(fareDetails.tollFee) : 0,
      gatewayCharge: Number(fareDetails.gatewayCharge)
        ? Number(fareDetails.gatewayCharge)
        : 0,
    };
    var rentalPackageInvoiceDetailsData = await rentalPackageInvoiceDetails(
      InvoiceDetailsParams
    );

    var updateFareDetails = await updateFareDetailsInTrip(
      fareDetails,
      req,
      tripData,
      req.body.endAddress,
      DriverPaymentDetailsSplits,
      rentalPackageInvoiceDetailsData
    );
    if (!updateFareDetails)
      return res.status(409).json({
        success: false,
        message: req.i18n.__("Trip Details Not Updated..."),
      });

    //Deduct Driver Commsion from Driver Wallet
    if (featuresSettings.deductDuringTripEnd) {
      if (
        featuresSettings.driverPayouts.adminCommision == "driverWallet" &&
        addToDriverWallet
      ) {
        if (
          fareDetails.paymentMode == "cash" ||
          fareDetails.paymentMode == "Others" ||
          fareDetails.paymentMode == "others"
        ) {
          if (
            featuresSettings.driverPayouts.deductAmountFromDriverWallet ==
            "totalFare"
          ) {
            driverWalletDetuctionAmt = fareDetails.totalFare;
          } else if (
            featuresSettings.driverPayouts.deductAmountFromDriverWallet ==
            "commision"
          ) {
            driverWalletDetuctionAmt =
              Number(fareDetails.comisonAmt) + Number(fareDetails.tax);
          }
        }

        if (Number(driverWalletDetuctionAmt) > 0) {
          driverWalletDetuctionType = "debit";
        } else {
          driverWalletDetuctionType = "credit";
          driverWalletDetuctionAmt = Math.abs(driverWalletDetuctionAmt);
        }

        /* if (driverWalletDetuctionType == 'debit') {
          driverWalletDetuctionAmt = Number(driverWalletDetuctionAmt) - Number(discountAmt);
        } else {
          driverWalletDetuctionAmt = Number(driverWalletDetuctionAmt) + Number(discountAmt);
        } */
        var tripParams = {
          driverId: tripData.dvrid,
          trxId: tripData.tripno,
          description: "trips - " + driverWalletDetuctionType,
          amt: driverWalletDetuctionAmt,
          paymentDate: tripData.date,
          type: driverWalletDetuctionType,
        };

        //Update Driver Wallet.
        updateDriverWallet(tripParams.driverId, tripParams);
      }
    } else {
      if (
        tripData.paymentMode == "cash" ||
        tripData.paymentMode == "wallet" ||
        fareDetails.paymentMode == "Others" ||
        fareDetails.paymentMode == "others"
      ) {
        paymentAmtToWallet(
          tripData.tripno,
          tripData.fare,
          tripData.paymentMode,
          tripData.tripno
        );
      }
    }
    //Deduct Driver Commsion from Driver Wallet

    GFunctions.sendFCMMsg(riderdoc.fcmId, "Trip Ended", "tripEnd");

    if (featuresSettings.isPromoCodeAvailable) {
      if (
        typeof tripData.csp.promo != "undefined" ||
        tripData.csp.promo != ""
      ) {
        updatePromoCodeUsedLogctrl(
          tripData.csp.promo,
          tripData.tripId,
          tripData.ridid
        ); // chnage this Promo code is used by this User for this Trip
      }
    }

    sendTripReceiptSMS(tripData, fareDetails.totalFare);
    sendTripReceipt(
      tripData._id,
      riderdoc.email,
      tripData.bookingType,
      req.body.cusemailid,
      language
    );

    tripData.adsp.dLat = req.body.dropLat;
    tripData.adsp.dLng = req.body.dropLng;
    if (featuresSettings.updateTripPaths) {
      var tripPath = await TripLocation.findOne({ tripId: tripData._id });
      if (tripPath)
        GFunctions.saveStaticMapForTrip(tripData, tripPath.loc); // Save Gmap
      else GFunctions.saveStaticMapForTrip(tripData, []); // Save Gmap
    } else {
      var tripPath = [];
      GFunctions.saveStaticMapForTrip(tripData, tripPath); // Save Gmap
    }

    if (featuresSettings.isUpdateDriverPerDayEarnings) {
      var amttodriver =
        parseFloat(fareDetails.totalFare) -
        parseFloat(driverWalletDetuctionAmt) -
        Number(fareDetails.tollFee);
      updateDriverPerDayEarnings(
        tripData.dvrid,
        1,
        amttodriver,
        fareDetails.comisonAmt
      );
    }

    // saveTemplateToPdf(tripData._id);
    clearRiderFbStatusAfterTripEnd(tripData.ridid, "", 0); // as finished

    if (tripData.bookingType == "rideLater") {
      removeFromSchedule(tripData._id);
    }

    return res.json({
      success: true,
      message: req.i18n.__("TRIP_ENDED"),
      rider: riderdoc,
      pickupdetails: tripData.dsp,
      status: "Trip Ended",
      fare: fareDetails,
      taxitype: tripData.vehicle,
      startOTP: tripData.tripOTP[0],
      endOTP: tripData.tripOTP[1],
      invoiceBill: rentalPackageInvoiceDetailsData,
      tripType: tripData.triptype,
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
}

async function calculateFinalOustationAmount(
  req,
  res,
  tripData,
  fare,
  riderdoc
) {
  try {
    var timeInMinutes = req.body.duration;
    var waitingTime = req.body.waitingSecond ? req.body.waitingSecond : 0; //Sec
    var conveyanceKM = tripData.acsp.conveyanceKM; //Sec
    waitingTime = parseFloat(waitingTime) / 60;
    waitingTime = Math.ceil(waitingTime);

    if (!req.body.endAddress) {
      const from =
        tripData.dsp.startcoords[1] + "," + tripData.dsp.startcoords[0];
      const to = req.body.dropLat + "," + req.body.dropLng;
      var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
      req.body.endAddress = gdmResult.to ? gdmResult.to : tripData.dsp.end;
    }

    //All Details From  admin
    var startMeter = req.body.startMeter
      ? req.body.startMeter
      : tripData.acsp.startMeter;
    var startTime = req.body.startTime
      ? req.body.startTime
      : tripData.acsp.startTime;
    req.body.startTime = startTime;
    if (!req.body.dropLat) req.body.dropLat = tripData.dsp.endcoords[1];
    if (!req.body.dropLng) req.body.dropLng = tripData.dsp.endcoords[0];

    var discountPercentage = req.body.discountPercentage
      ? req.body.discountPercentage
      : 0;
    var discountName = req.body.discountName ? req.body.discountName : "";

    var distanceKMFromMeter = Number(req.body.endMeter) - Number(startMeter);
    if (Number(distanceKMFromMeter) < 0) {
      return res.status(409).json({
        success: false,
        message: "End Meter Should be Greater than Start",
      });
    }
    var distanceKM = distanceKMFromMeter;
    var paramsData = {
      dropLat: req.body.dropLat,
      dropLng: req.body.dropLng,
      distanceInKM: distanceKM,
      serviceId: tripData.scId,
    };
    var dropLocationKM = await checkDropLocation(paramsData);
    if (dropLocationKM.success) distanceKM = dropLocationKM.totalKm;

    if (
      req.body.endFromAdmin != undefined ||
      (typeof req.body.endFromAdmin != "undefined" &&
        req.body.endFromAdmin == "admin")
    )
      req.body.endTime = req.body.endTime;
    else req.body.endTime = GFunctions.getISODate();
    var timeInMin = GFunctions.getMinsBtDateTime(req.body.endTime, startTime);

    var tripTimeInHr = Number(timeInMin / 60);
    var KMtraveledPerHr = Number((distanceKM / tripTimeInHr).toFixed(2));
    if (KMtraveledPerHr > featuresSettings.possiblePerHrKM) {
      //Not possible to travel
      return res
        .status(409)
        .json({ success: false, message: "Check End Meter Reading" });
    }

    req.body.vehicleTypeId = tripData.service;
    req.body.pickupLat = req.body.pickupLat
      ? req.body.pickupLat
      : tripData.dsp.startcoords[1];
    req.body.pickupLng = req.body.pickupLng
      ? req.body.pickupLng
      : tripData.dsp.startcoords[0];

    var additionalFee = [];
    // if (featuresSettings.addAdditionalFaresInTrip) {
    // 	additionalFee = req.body.additionalFee ? JSON.parse(req.body.additionalFee) : null;
    // }

    req.body.outstationType = tripData.dsp.outstationType;
    var outstationDetails = await getOutstationVehicleListWithFare(
      req,
      distanceKM,
      timeInMin,
      "finalamount",
      additionalFee,
      req.body.tollFee
    ); //Get for single vehicle
    if (outstationDetails.success == false) {
      return res
        .status(409)
        .json({ success: false, message: outstationDetails.message });
    }
    var fareDetails = outstationDetails.vehicleList[0].fareDetails;
    // fareDetails['additionalFee'] = additionalFee;
    var discountAmt = 0;
    fareDetails.discountAmt = tripData.csp.promoamt;
    fareDetails.promoCode = tripData.csp.promo;
    if (!fareDetails.promoCode == "") {
      var promoAmtData = await Promo.findOne(
        { code: fareDetails.promoCode },
        { amount: 1, code: 1, tripType: 1 }
      ).exec();
      if (promoAmtData) {
        fareDetails.discountAmt = promoAmtData.amount;
        if (promoAmtData.amountType == "percentage") {
          var tripAmount = fareDetails.totalFare;
          var discountAmt = tripAmount * (promoAmtData.percentage / 100);
          if (discountAmt > promoAmtData.percentageAmountLimit)
            fareDetails.discountAmt = promoAmtData.percentageAmountLimit;
          else fareDetails.discountAmt = discountAmt;
        }
      }
    }

    fareDetails["perKMRate"] = fareDetails.perKmRate;
    fareDetails["returnKM"] = dropLocationKM.extraKM;
    fareDetails["returnTime"] = 0;
    fareDetails["extraKM"] = (
      Number(fareDetails["returnKM"]) + Number(fareDetails.additionalDistance)
    ).toFixed(2);
    fareDetails["readabledistanceKM"] = distanceKMFromMeter + " KM";
    fareDetails["readableEstTime"] = fareDetails.travelTime;

    fareDetails["hillKm"] = 0;
    if (Number(req.body.hillKm) > 0) {
      fareDetails["hillKm"] = req.body.hillKm;
    }
    if (req.body.hillKm == "") {
      fareDetails["hillKm"] = 0;
    }
    fareDetails["hillFare"] = (Number(fareDetails["hillKm"]) * 2).toFixed(2);
    if (isNaN(fareDetails["hillFare"]) > 0) {
      fareDetails["hillFare"] = 0;
    }
    fareDetails.totalFare =
      Number(fareDetails.totalFare) + Number(fareDetails["hillFare"]);
    //Add Pickup fare
    if (Number(tripData.csp.conveyance) > 0) {
      fareDetails["pickupCharge"] = Number(tripData.csp.conveyance);
      fareDetails.BalanceFare = fareDetails.totalFare =
        Number(fareDetails.totalFare) + Number(tripData.csp.conveyance);
    }
    fareDetails.BalanceFare =
      Number(fareDetails.totalFare) - Number(fareDetails.discountAmt);
    fareDetails.totalFare =
      Number(fareDetails.totalFare) - Number(fareDetails.discountAmt); //Promo reduced from Total fare
    fareDetails.paymentMode = tripData.csp.via.toLowerCase();
    if (Number(fareDetails.discountAmt) > 0) {
      fareDetails.comisonAmt = (
        Number(fareDetails.comisonAmt) - Number(fareDetails.discountAmt)
      ).toFixed(2);
    }

    //Add hillAndConveyence to commision
    var hillAndConveyence = 0;
    if (featuresSettings.isPickupAddtoCommission)
      hillAndConveyence =
        Number(fareDetails["hillFare"]) + Number(tripData.csp.conveyance);
    //if need to add pickup charge for commision
    else hillAndConveyence = Number(fareDetails["hillFare"]);
    if (hillAndConveyence > 0) {
      fareDetails.comisonAmt =
        (Number(fareDetails.comison) * Number(hillAndConveyence)) / 100 +
        Number(fareDetails.comisonAmt);
    }

    fareDetails.tollFee = req.body.tollFee ? req.body.tollFee : 0;
    // if (featuresSettings.isTollAdded) {
    // 	if (Number(fareDetails.tollFee) > 0) {
    // 		fareDetails.totalFare = (Number(fareDetails.totalFare) + Number(fareDetails.tollFee)).toFixed(2);
    // 		fareDetails.BalanceFare = fareDetails.totalFare;
    // 	}
    // }

    fareDetails.totalFareWithOutOldBal = fareDetails.totalFare;
    if (featuresSettings.isRiderCancellationAmtApplicable) {
      //Adding Old Cancelation Charge
      var oldCancelationAmount = 0; //OCC
      if (
        tripData.ridid != "" ||
        tripData.ridid != null ||
        tripData.ridid != undefined
      ) {
        var riderWallet = await getRiderWalletDetails(tripData.ridid);
        if (riderWallet.success == true)
          oldCancelationAmount = riderWallet.balance;
      }
      if (Number(oldCancelationAmount) > 0) {
        fareDetails.oldCancellationAmt = Number(oldCancelationAmount);
        fareDetails.totalFare = (
          Number(fareDetails.totalFare) + Number(fareDetails.oldCancellationAmt)
        ).toFixed(2);
        fareDetails.BalanceFare = fareDetails.totalFare;
      }
    }

    if (
      fareDetails.paymentMode == "card" &&
      featuresSettings.riderTripPaidInClientSide &&
      config.paymentGateway.paymentGatewayName == "razorpay"
    ) {
      fareDetails.totalFare =
        Number(fareDetails.totalFare) +
        Number(featuresSettings.amountToRedueForRazorPayPayment);
      fareDetails.BalanceFare = fareDetails.totalFare;
    }

    var driverWalletDetuctionType = "debit";
    var driverWalletDetuctionAmt = 0;

    fareDetails.gatewayCharge = 0;
    if (
      fareDetails.paymentMode == "card" &&
      featuresSettings.riderTripPaidInClientSide &&
      config.paymentGateway.paymentGatewayName == "razorpay"
    ) {
      fareDetails.gatewayCharge = Number(
        (
          (Number(fareDetails.totalFare) *
            Number(
              featuresSettings.amountToRedueForRazorPayPaymentPercentage
            )) /
          100
        ).toFixed(2)
      );
      fareDetails.totalFare =
        Number(fareDetails.totalFare) + Number(fareDetails.gatewayCharge);
      fareDetails.BalanceFare = fareDetails.totalFare;
      driverWalletDetuctionType = "credit";
      driverWalletDetuctionAmt = fareDetails.BalanceFare;
    }

    var addToDriverWallet = true;
    driverWalletDetuctionAmt =
      Number(fareDetails.comisonAmt) +
      Number(fareDetails.tax) +
      Number(fareDetails.taxTDS) +
      Number(featuresSettings.amountToRedueForRazorPayPayment)+
      Number(req.body.tollFee)
    if (featuresSettings.addBookingFeeToCommission)
      driverWalletDetuctionAmt =
        Number(driverWalletDetuctionAmt) + Number(fareDetails.bookingFare);

    var DriverPaymentDetailsSplits = {};
    DriverPaymentDetailsSplits.amttopay = fareDetails.totalFare;
    DriverPaymentDetailsSplits.cashpaid = fareDetails.totalFare;
    DriverPaymentDetailsSplits.commision = fareDetails.comisonAmt;
    DriverPaymentDetailsSplits.promoamt = fareDetails.discountAmt;
    DriverPaymentDetailsSplits.walletdebt = 0;
    DriverPaymentDetailsSplits.carddebt = 0;
    DriverPaymentDetailsSplits.digital = fareDetails.discountAmt;
    DriverPaymentDetailsSplits.outstanding = 0;
    DriverPaymentDetailsSplits.inhand = fareDetails.totalFare;
    DriverPaymentDetailsSplits.tax = fareDetails.tax;
    DriverPaymentDetailsSplits.tollFee = fareDetails.tollFee;
    DriverPaymentDetailsSplits.amttodriver =
      parseFloat(fareDetails.totalFare) -
      parseFloat(driverWalletDetuctionAmt) -
      Number(fareDetails.tollFee);
    DriverPaymentDetailsSplits.toSettle =
      parseFloat(fareDetails.totalFare) - parseFloat(driverWalletDetuctionAmt);
      DriverPaymentDetailsSplits.GatewayCharge = Number(fareDetails.gatewayCharge);

    fareDetails.totalFare = Number(Number(fareDetails.totalFare).toFixed(2));
    
    var InvoiceDetailsParams = {
      triptype: tripData.triptype,
      distanceKM: fareDetails.readabledistanceKM
        ? fareDetails.readabledistanceKM
        : 0,
      estTime: fareDetails.readableEstTime ? fareDetails.readableEstTime : 0,
      packageName: fareDetails.packageName,
      distfare: Number(fareDetails.KMFare),
      baseKM: fareDetails.packageDistance ? fareDetails.packageDistance : 0,
      // fareForExtraKM: fareDetails.additionalDistanceFare ? fareDetails.additionalDistanceFare : 0,
      extraKM: fareDetails.additionalDistance
        ? fareDetails.additionalDistance
        : 0,
      perKmRate: fareDetails.perKMRate
        ? fareDetails.perKMRate
        : tripData.csp.perKmRate,
      fareForExtraTime: fareDetails.additionalDurationFare
        ? fareDetails.additionalDurationFare
        : 0,
      extraTime: fareDetails.additionalDuration
        ? fareDetails.additionalDuration
        : 0,
      timefare: Number(fareDetails.travelFare)
        ? Number(fareDetails.travelFare)
        : 0,
      conveyance: Number(fareDetails.pickupCharge)
        ? Number(fareDetails.pickupCharge)
        : 0,
      hillFare: fareDetails.hillFare ? fareDetails.hillFare : 0,
      cost: fareDetails.totalFare,
      taxPercentage: Number(fareDetails.taxPercentage)
        ? Number(fareDetails.taxPercentage)
        : 0,
      tax: Number(fareDetails.tax) ? Number(fareDetails.tax) : 0,
      fareBeforeTax: Number(fareDetails.fareBeforeTax)
        ? Number(fareDetails.fareBeforeTax)
        : 0,
      oldCancellationAmt: Number(fareDetails.oldCancellationAmt)
        ? Number(fareDetails.oldCancellationAmt)
        : 0,
      tollFee: Number(fareDetails.tollFee) ? Number(fareDetails.tollFee) : 0,
      nightFare: Number(fareDetails.nightFare)
        ? Number(fareDetails.nightFare)
        : 0,
      dayFare: Number(fareDetails.dayFare) ? Number(fareDetails.dayFare) : 0,
      booking: Number(fareDetails.bookingFare)
        ? Number(fareDetails.bookingFare)
        : 0,
      BaseFare: Number(fareDetails.BaseFare) ? Number(fareDetails.BaseFare) : 0,
      gatewayCharge: Number(fareDetails.gatewayCharge)
        ? Number(fareDetails.gatewayCharge)
        : 0,
      fareForExtraKM: Number(fareDetails.remainingFare)
        ? Number(fareDetails.remainingFare)
        : 0,
      remainingFareLabel: fareDetails.remainingFareLabel
        ? fareDetails.remainingFareLabel
        : null,
    };
    var rentalPackageInvoiceDetailsData = await rentalPackageInvoiceDetails(
      InvoiceDetailsParams
    );
    var updateFareDetails = await updateFareDetailsInTrip(
      fareDetails,
      req,
      tripData,
      req.body.endAddress,
      DriverPaymentDetailsSplits,
      rentalPackageInvoiceDetailsData
    );
    if (!updateFareDetails)
      return res.status(409).json({
        success: false,
        message: req.i18n.__("Trip Details Not Updated..."),
      });

    //Deduct Driver Commsion from Driver Wallet
    if (featuresSettings.deductDuringTripEnd) {
      if (
        featuresSettings.driverPayouts.adminCommision == "driverWallet" &&
        addToDriverWallet
      ) {
        if (
          fareDetails.paymentMode == "cash" ||
          fareDetails.paymentMode == "Others" ||
          fareDetails.paymentMode == "others"
        ) {
          if (
            featuresSettings.driverPayouts.deductAmountFromDriverWallet ==
            "totalFare"
          ) {
            driverWalletDetuctionAmt = fareDetails.totalFare;
          } else if (
            featuresSettings.driverPayouts.deductAmountFromDriverWallet ==
            "commision"
          ) {
            driverWalletDetuctionAmt =
              Number(fareDetails.comisonAmt) + Number(fareDetails.tax);
          }
        }
        if (Number(driverWalletDetuctionAmt) > 0) {
          driverWalletDetuctionType = "debit";
        } else {
          driverWalletDetuctionType = "credit";
          driverWalletDetuctionAmt = Math.abs(driverWalletDetuctionAmt);
        }

        /* if (driverWalletDetuctionType == 'debit') {
          driverWalletDetuctionAmt = Number(driverWalletDetuctionAmt) - Number(discountAmt);
        } else {
          driverWalletDetuctionAmt = Number(driverWalletDetuctionAmt) + Number(discountAmt);
        } */
        var tripParams = {
          driverId: tripData.dvrid,
          trxId: tripData.tripno,
          description: "trips - " + driverWalletDetuctionType,
          amt: driverWalletDetuctionAmt,
          paymentDate: tripData.date,
          type: driverWalletDetuctionType,
        };

        //Update Driver Wallet.
        updateDriverWallet(tripParams.driverId, tripParams);
      }
    } else {
      if (
        tripData.paymentMode == "cash" ||
        tripData.paymentMode == "wallet" ||
        fareDetails.paymentMode == "Others" ||
        fareDetails.paymentMode == "others"
      ) {
        paymentAmtToWallet(
          tripData.tripno,
          tripData.fare,
          tripData.paymentMode,
          tripData.tripno
        );
      }
    }
    //Deduct Driver Commsion from Driver Wallet

    GFunctions.sendFCMMsg(riderdoc.fcmId, "Trip Ended", "tripEnd");

    if (featuresSettings.isPromoCodeAvailable) {
      if (
        typeof tripData.csp.promo != "undefined" ||
        tripData.csp.promo != ""
      ) {
        updatePromoCodeUsedLogctrl(
          tripData.csp.promo,
          tripData.tripId,
          tripData.ridid
        ); // chnage this Promo code is used by this User for this Trip
      }
    }

    sendTripReceiptSMS(tripData, fareDetails.totalFare);
    sendTripReceipt(
      tripData._id,
      riderdoc.email,
      tripData.bookingType,
      req.body.cusemailid,
      language
    );

    tripData.adsp.dLat = req.body.dropLat;
    tripData.adsp.dLng = req.body.dropLng;
    if (featuresSettings.updateTripPaths) {
      var tripPath = await TripLocation.findOne({ tripId: tripData._id });
      if (tripPath)
        GFunctions.saveStaticMapForTrip(tripData, tripPath.loc); // Save Gmap
      else GFunctions.saveStaticMapForTrip(tripData, []); // Save Gmap
    } else {
      var tripPath = [];
      GFunctions.saveStaticMapForTrip(tripData, tripPath); // Save Gmap
    }

    if (featuresSettings.isUpdateDriverPerDayEarnings) {
      var amttodriver =
        parseFloat(fareDetails.totalFare) -
        parseFloat(driverWalletDetuctionAmt) -
        Number(fareDetails.tollFee);
      updateDriverPerDayEarnings(
        tripData.dvrid,
        1,
        amttodriver,
        fareDetails.comisonAmt
      );
    }

    // saveTemplateToPdf(tripData._id);
    clearRiderFbStatusAfterTripEnd(tripData.ridid, "", 0); // as finished

    if (tripData.bookingType == "rideLater") {
      removeFromSchedule(tripData._id); //Express TODO
    }

    return res.json({
      success: true,
      message: req.i18n.__("TRIP_ENDED"),
      rider: riderdoc,
      pickupdetails: tripData.dsp,
      status: "Trip Ended",
      fare: fareDetails,
      taxitype: tripData.vehicle,
      startOTP: tripData.tripOTP[0],
      endOTP: tripData.tripOTP[1],
      invoiceBill: rentalPackageInvoiceDetailsData,
      tripType: tripData.triptype,
    });
  } catch (error) {
    logger.error(error);
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
}

function sendTripReceipt(
  tripId,
  email,
  bookingType = "rideNow",
  cusemailid,
  language
) {
  if (featuresSettings.fareCalculationType == "indiaGst") {
    TripHelpers.sendTripGSTReceipt(tripId, email); // send Trip Receipt
  } else {
    if (bookingType == "hailRide" && cusemailid != "") {
      TripHelpers.sendTripReceipt(tripId, cusemailid, language); // send Trip Receipt
    } else {
      TripHelpers.sendTripReceipt(tripId, email, language); // send Trip Receipt
    }
  }
}

async function sendTripReceiptSMS(tripData, fare) {
  if (
    tripData.requestFrom === "admin" ||
    tripData.requestFrom === "web" ||
    tripData.bookingFor == "others" ||
    tripData.bookingType === "rideLater" ||
    tripData.bookingType === "hailRide"
  ) {
    let riderDoc = await Rider.findById(tripData.ridid).exec();
    if (riderDoc !== null) {
      var toPhone = riderDoc.phone;
      var toPhoneCode = riderDoc.phcode;
      if (tripData.bookingFor == "others") {
        toPhone = tripData.other.ph;
        toPhoneCode = tripData.other.phCode;
      }
      smsGateway.sendSmsMsg(
        toPhone,
        "",
        toPhoneCode,
        "",
        "tripEndPaymentToRider",
        { FEE: fare, TRIPNO: tripData.tripno }
      );
    }
  }
}

function freeTheDriver(driverid) {
  Driver.findByIdAndUpdate(
    driverid,
    {
      curStatus: "free",
    },
    { new: true },
    function (err, doc) {
      if (err) {
      }
    }
  );
}

async function updateFareDetailsInTrip(
  fare,
  reqdata,
  tripDetails,
  dropAddress,
  DriverPaymentDetailsSplits,
  rentalPackageInvoiceDetailsData = ""
) {

  var paymentStatus = "Paid";
  var balancetopay = 0;
  fare.totalFare = Number(fare.totalFare).toFixed(2);
  if (
    (fare.paymentMode == "card" || fare.paymentMode == "payPhone") &&
    featuresSettings.riderTripPaidInClientSide
  ) {
    paymentStatus = "pending";
    balancetopay = Number(fare.totalFare);
  }
  if (fare.paymentMode == "payPhone") {
    paymentStatus = "pending";
    balancetopay = Number(fare.totalFare);
  }

  var totalDeductedFare = Number(fare.DetuctedFare)
    ? Number(fare.DetuctedFare)
    : 0;
  if (Number(fare.mandatorydiscountAmt) > 0) {
    totalDeductedFare =
      totalDeductedFare + Number(fare.mandatorydiscountAmt)
        ? Number(fare.mandatorydiscountAmt)
        : 0;
  }
  if (Number(fare.discountAmt) > 0) {
    totalDeductedFare = totalDeductedFare + Number(fare.discountAmt);
  }
  var distancedetails = Number(fare.distance);
  // if (config.distanceUnit == "Miles") {
  //   var distancedetails = parseFloat(reqdata.body.distance * 0.621371).toFixed(
  //     2
  //   );
  // } else {
  //   var distancedetails = Number(fare.distance).toFixed(2);
  // }
  //update pack naem as like req remtanl
  var updateCashData = {
    status: "Finished",
    "acsp.base": fare.BaseFare ? fare.BaseFare : 0,
    "acsp.booking": fare.bookingFare ? fare.bookingFare : 0,
    "acsp.farewithoutTaxNBookingFee": fare.farewithoutTaxNBookingFee
      ? fare.farewithoutTaxNBookingFee
      : 0,
    "acsp.minFare": fare.minFare ? fare.minFare : 0,
    "acsp.minFareAdded": fare.minFareAdded ? fare.minFareAdded : 0,
    "acsp.dist": distancedetails,
    "acsp.perKmRate": fare.perKMRate
      ? fare.perKMRate
      : tripDetails.csp.perKmRate,
    "acsp.distfare": Number(fare.KMFare),
    "acsp.time": fare.travelTime,
    "acsp.timefare": Number(fare.travelFare) ? Number(fare.travelFare) : 0,
    "acsp.timeRate": Number(fare.travelRate) ? Number(fare.travelRate) : 0,
    "acsp.conveyance": Number(fare.pickupCharge)
      ? Number(fare.pickupCharge)
      : 0,
    "acsp.waitingCharge": Number(fare.waitingFare)
      ? Number(fare.waitingFare)
      : 0,
    "acsp.waitingRate": Number(fare.waitingCharge)
      ? Number(fare.waitingCharge)
      : 0,
    "acsp.waitingTime": Number(fare.waitingTime) ? Number(fare.waitingTime) : 0,
    "acsp.totalFareWithOutOldBal": Number(fare.totalFareWithOutOldBal),
    "acsp.fareAmtBeforeSurge": Number(fare.fareAmtBeforeSurge),
    "acsp.oldBalance": Number(fare.oldCancellationAmt),
    "acsp.cashpaid": Number(fare.totalFare), //As cash have to pay fare.balance all by amt
    "acsp.comison": Number(fare.comisonAmt) ? Number(fare.comisonAmt) : 0,
    "acsp.tollFee": Number(fare.tollFee) ? Number(fare.tollFee) : 0,
    "acsp.promoamt": Number(tripDetails.csp.promoamt)
      ? Number(tripDetails.csp.promoamt)
      : 0,
      "acsp.promoDiscount": Number(tripDetails.csp.promoamt)
      ? Number(tripDetails.csp.promoamt)
      : 0,
    "acsp.walletdebt": Number(fare.DetuctedFare)
      ? Number(fare.DetuctedFare)
      : 0,
    "acsp.carddebt": Number(fare.DetuctedFare) ? Number(fare.DetuctedFare) : 0,
    "acsp.hotelcommision": Number(fare.hotelcommisionAmt)
      ? Number(fare.hotelcommisionAmt)
      : 0,
    "acsp.gatewayCharge": Number(fare.gatewayCharge)
      ? Number(fare.gatewayCharge)
      : 0,
    "acsp.outstanding": 0,
    "acsp.bal": balancetopay, //0 Consider Paid Full (Even for Digital)
    "acsp.detect": totalDeductedFare,
    "acsp.costBeforeDiscount": Number(fare.totalFare),
    "acsp.actualcost": Number(fare.totalFare),
    "acsp.fareType": fare.fareType,
    fare: Number(fare.totalFare),
    "acsp.cost": Number(fare.totalFare),
    "acsp.fareBeforeTax": Number(fare.fareBeforeTax)
      ? Number(fare.fareBeforeTax)
      : 0,
    "acsp.tax": Number(fare.tax) ? Number(fare.tax) : 0,
    "acsp.taxPercentage": Number(fare.taxPercentage),
    "acsp.taxTDS": Number(fare.taxTDS) ? Number(fare.taxTDS) : 0,
    "acsp.taxTDSPercentage": Number(fare.taxTDSPercentage)
      ? Number(fare.taxTDSPercentage)
      : featuresSettings.taxTDSPercentage,
    "acsp.via": fare.paymentMode ? fare.paymentMode : "cash",
    "acsp.zoneFare": fare.totalDistanceInZone ? fare.totalDistanceInZone : 0,
    "acsp.chId": Number(fare.tranxid) ? Number(fare.tranxid) : "",
    "acsp.isNight": fare.nightObj.isApply,
    "acsp.isPeak": fare.peakObj.isApply,
    // "acsp.nightPer": fare.nightObj.percentageIncrease,
    "acsp.nightPer": fare.nightObj.nightfarePer,
    "acsp.peakPer": fare.peakObj.percentageIncrease,
    "acsp.base": fare.BaseFare ? fare.BaseFare : 0,
    "acsp.surgeReason": fare.surgeReason ? fare.surgeReason : "",
    "acsp.surgeAmt": fare.surgeAmt ? fare.surgeAmt : 0,
    "acsp.baseKM": fare.distance,
    "acsp.extraKM": fare.extraKM ? fare.extraKM : 0,
    "acsp.fareForExtraKM": 0,
    "acsp.endTime": GFunctions.getISODate(),
    "acsp.endFrom": reqdata.body.endFromAdmin
      ? reqdata.body.endFromAdmin
      : "app",
    "adsp.distanceKM": fare.readabledistanceKM ? fare.readabledistanceKM : 0,
    "adsp.estTime": fare.readableEstTime ? fare.readableEstTime : 0,
    "adsp.to": reqdata.body.endAddress ? reqdata.body.endAddress : dropAddress,
    "adsp.dLat": Number(reqdata.body.dropLat)
      ? Number(reqdata.body.dropLat)
      : tripDetails.dsp.endcoords[1],
    "adsp.dLng": Number(reqdata.body.dropLng)
      ? Number(reqdata.body.dropLng)
      : tripDetails.dsp.endcoords[0],
    applyValues: fare.applyValues,
    paymentSts: paymentStatus,
    "acsp.discountName": fare.discountName ? fare.discountName : "",
    "acsp.discountPercentage": fare.discountPercentage
      ? fare.discountPercentage
      : 0,
    additionalFee: fare.additionalFee ? fare.additionalFee : null,
    "acsp.appDist": Number(reqdata.body.appDistance)
      ? Number(reqdata.body.appDistance)
      : 0,
    "acsp.googleCharge": Number(config.googleCharge)
      ? Number(config.googleCharge)
      : 0,
    "acsp.waitingChargeBeforeTripStart": Number(fare.waitingFareBeforeTripStart)
      ? Number(fare.waitingFareBeforeTripStart)
      : 0,
    "acsp.waitingRateBeforeTripStart": Number(fare.waitingChargeBeforeTripStart)
      ? Number(fare.waitingChargeBeforeTripStart)
      : 0,
    "acsp.waitingTimeBeforeTripStart": Number(fare.waitingTimeBeforeTripStart)
      ? Number(fare.waitingTimeBeforeTripStart)
      : 0,
    "acsp.waitingChargeAterTripStart": Number(fare.waitingFareAterTripStart)
      ? Number(fare.waitingFareAterTripStart)
      : 0,
    "acsp.waitingRateAterTripStart": Number(fare.waitingChargeAterTripStart)
      ? Number(fare.waitingChargeAterTripStart)
      : 0,
    "acsp.waitingTimeAterTripStart": Number(fare.waitingTimeAterTripStart)
      ? Number(fare.waitingTimeAterTripStart)
      : 0,
    paymentMode: fare.paymentMode,
    "acsp.via": fare.paymentMode,
    // paymentMode: "card",
    // "acsp.via": "card",
    cardPaymentSuccess: fare.cardPaymentSuccess,
    //India GST
    /* "acsp.fare1": fare.indiaGSTAmounts.totalfare1,
    "acsp.fare2": fare.indiaGSTAmounts.totalfare2,
    "acsp.tax1": fare.indiaGSTAmounts.gst1On1,
    "acsp.tax2": fare.indiaGSTAmounts.gst2On2,
    "acsp.taxper1": fare.indiaGSTAmounts.gstPerOn1,
    "acsp.taxper2": fare.indiaGSTAmounts.gstPerOn2, */
    //India GST
  };

  if (featuresSettings.checkAirportZone) {
    //AirportZone fare details
    let totalAirportZoneFare = 0;
    let locationAirportZone = await airportZoneFare(
      tripDetails.adsp.dLat,
      tripDetails.adsp.dLng
    );
    totalAirportZoneFare =
      Number(tripDetails.acsp.startAirportZoneFare) +
      Number(locationAirportZone.airportFare);
    fare.totalFare = Number(fare.totalFare) + Number(totalAirportZoneFare); //modify the amount to pdate cost value

    updateCashData["acsp.cashpaid"] = Number(fare.totalFare); //As cash have to pay fare.balance all by amt
    updateCashData["acsp.costBeforeDiscount"] = Number(fare.totalFare);
    updateCashData["acsp.actualcost"] = Number(fare.totalFare);
    updateCashData["acsp.cost"] = Number(fare.totalFare);
    updateCashData["fare"] = Number(fare.totalFare);
    updateCashData["acsp.endAirportZoneFare"] = Number(
      locationAirportZone.airportFare
    );
    updateCashData["acsp.totalAirportZoneFare"] = Number(totalAirportZoneFare);
  }

  if (
    (reqdata.body.endFromAdmin != undefined ||
      typeof reqdata.body.endFromAdmin != "undefined") &&
    reqdata.body.endFromAdmin == "admin"
  ) {
    updateCashData["acsp.startTime"] = reqdata.body.startTime
      ? reqdata.body.startTime
      : tripDetails.acsp.startTime;
    // updateCashData['acsp.endTime'] = reqdata.body.endTime ? GFunctions.getDateTimeinThisFormat(reqdata.body.endTime, "HH:mm:ss", "YYYY-MM-DDTHH:mm:ss.SSS[Z]") : GFunctions.getISODate();
    updateCashData["acsp.endTime"] = reqdata.body.endTime
      ? reqdata.body.endTime
      : GFunctions.getISODate();
    updateCashData["adsp.pLat"] = Number(reqdata.body.pickupLat)
      ? Number(reqdata.body.pickupLat)
      : tripDetails.adsp.pLat;
    updateCashData["adsp.pLng"] = Number(reqdata.body.pickupLng)
      ? Number(reqdata.body.pickupLng)
      : tripDetails.adsp.pLng;
    updateCashData["adsp.from"] = reqdata.body.fromAddress
      ? reqdata.body.fromAddress
      : tripDetails.adsp.from;
  }

  if (tripDetails.triptype == "rental") {
    updateCashData["acsp.packageId"] = fare.packageId;
    updateCashData["acsp.packageName"] = fare.packageName;
    // updateCashData['acsp.endTime'] = reqdata.body.endTime;
    updateCashData["acsp.endMeter"] = reqdata.body.endMeter;
    updateCashData["acsp.baseKM"] = fare.packageDistance
      ? fare.packageDistance
      : 0;
    updateCashData["acsp.extraKM"] = fare.additionalDistance
      ? fare.additionalDistance
      : 0;
    updateCashData["acsp.fareForExtraKM"] = fare.additionalDistanceFare
      ? fare.additionalDistanceFare
      : 0;
    updateCashData["acsp.baseTime"] = fare.packageDuration
      ? fare.packageDuration
      : 0;
    updateCashData["acsp.extraTime"] = fare.additionalDuration
      ? fare.additionalDuration
      : 0;
    updateCashData["acsp.fareForExtraTime"] = fare.additionalDurationFare
      ? fare.additionalDurationFare
      : 0;
    updateCashData["acsp.returnTime"] = fare.returnTime ? fare.returnTime : 0;
    updateCashData["acsp.returnKM"] = fare.returnKM ? fare.returnKM : 0;
  }

  if (tripDetails.triptype == "outstation") {
    updateCashData["acsp.packageId"] = fare.packageId;
    updateCashData["acsp.packageName"] = fare.packageName;
    // updateCashData['acsp.endTime'] = reqdata.body.endTime;
    updateCashData["acsp.endMeter"] = reqdata.body.endMeter;
    updateCashData["acsp.baseKM"] = fare.packageDistance
      ? fare.packageDistance
      : 0;
    updateCashData["acsp.extraKM"] = fare.additionalDistance
      ? fare.additionalDistance
      : 0;
    updateCashData["acsp.fareForExtraKM"] = fare.additionalDistanceFare
      ? fare.additionalDistanceFare
      : 0;
    updateCashData["acsp.baseTime"] = fare.packageDuration
      ? fare.packageDuration
      : 0;
    updateCashData["acsp.extraTime"] = fare.additionalDuration
      ? fare.additionalDuration
      : 0;
    updateCashData["acsp.fareForExtraTime"] = fare.additionalDurationFare
      ? fare.additionalDurationFare
      : 0;
    updateCashData["acsp.returnTime"] = fare.returnTime ? fare.returnTime : 0;
    updateCashData["acsp.returnKM"] = fare.returnKM ? fare.returnKM : 0;
    updateCashData["acsp.hillKm"] = fare.hillKm ? fare.hillKm : 0;
    updateCashData["acsp.hillFare"] = fare.hillFare ? fare.hillFare : 0;
    updateCashData["acsp.noOfNights"] = fare.noOfNights ? fare.noOfNights : 0;
    updateCashData["acsp.nightFare"] = fare.nightFare ? fare.nightFare : 0;
    updateCashData["acsp.noOfDays"] = fare.noOfDays ? fare.noOfDays : 0;
    updateCashData["acsp.dayFare"] = fare.dayFare ? fare.dayFare : 0;
    updateCashData["acsp.nightRate"] = fare.nightRate ? fare.nightRate : 0;
    updateCashData["acsp.dayRate"] = fare.dayRate ? fare.dayRate : 0;
  }

  var ispaid = "no";
  var todvr = "no";

  if (
    featuresSettings.driverPayouts.adminCommision == "driverWallet" &&
    featuresSettings.driverPayouts.payoutType == "driverPrepaidWallet"
  ) {
    if (fare.paymentMode == "cash") {
      ispaid = "yes";
      todvr = "yes";
    }
    if (fare.paymentMode == "card" && Number(fare.DetuctedFare) == 0) {
      ispaid = "yes";
      todvr = "yes";
    }
    if (fare.paymentMode == "Wallet" && Number(fare.DetuctedFare) == 0) {
      ispaid = "yes";
      todvr = "yes";
    }
  }

  var DriverPaymentDetails = {
    tripno: tripDetails.tripno,
    scId: tripDetails.scId,
    scity: tripDetails.scity,
    driver: tripDetails.dvrid,
    dvrfname: tripDetails.dvr,
    amttopay: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.amttopay
    ), //should be real total
    cashpaid: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.cashpaid
    ), //should be cash
    commision: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.commision
    ),
    promoamt: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.promoamt
    ),
    amttodriver: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.amttodriver
    ),
    walletdebt: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.walletdebt
    ),
    carddebt: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.carddebt
    ),
    digital: GFunctions.sendFormatedNumber(DriverPaymentDetailsSplits.digital),
    outstanding: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.outstanding
    ),
    inhand: GFunctions.sendFormatedNumber(DriverPaymentDetailsSplits.inhand),
    toSettle: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.toSettle
    ),
    booking: GFunctions.sendFormatedNumber(DriverPaymentDetailsSplits.booking),
    GatewayCharge: GFunctions.sendFormatedNumber(DriverPaymentDetailsSplits.GatewayCharge),
    tax: GFunctions.sendFormatedNumber(DriverPaymentDetailsSplits.tax),
    tollFee: GFunctions.sendFormatedNumber(DriverPaymentDetailsSplits.tollFee),
    mtd: fare.paymentMode,
    ispaid: ispaid,
    todvr: todvr,
    chId: "",
    distanceUnit: DriverPaymentDetailsSplits.distanceUnit,
    totalDistTravelled: GFunctions.sendFormatedNumber(
      DriverPaymentDetailsSplits.totalDistTravelled
    ),
  };

  try {
    var doc = await Trips.findOneAndUpdate(
      { _id: tripDetails._id },
      updateCashData,
      { new: true }
    );
    // function (err, doc) {

    if (!doc) {
      return false;
    } else {
      // if (doc) {
      addDriverPayment(DriverPaymentDetails); //Called after Successful Transaction
      // debitDriverBankTransactions(DriverPaymentDetails.driver, DriverPaymentDetails.toSettle, DriverPaymentDetails.tripno, DriverPaymentDetails.commision);
      if (doc.acsp.oldBalance > 0) {
        updateRiderBalanceInMongo(doc.ridid, doc.acsp.oldBalance, "credit");
        //			addAmtToReferalWallet(doc.ridid, doc.tripo, doc.acsp.oldBalance, "OldBalance - Credit", 'Credit');
        updateRiderWalletTransaction(
          doc.ridid,
          doc.acsp.oldBalance,
          doc.tripno,
          "OldBalance - Credit",
          "Credit"
        );
      }
      if (tripDetails.hotelid != null) {
        Hotel.findById({ _id: tripDetails.hotelid }, {}, (err, data) => {
          data.amount += parseFloat(fare.hotelcommisionAmt);
          data.save((err, data) => {
            var hotelPaymentDetails = {
              tripno: tripDetails.tripno,
              hotel: data._id,
              hotelname: data.fname,
              amttopay: GFunctions.sendFormatedNumber(
                DriverPaymentDetailsSplits.amttopay
              ), //should be real total
              commision: GFunctions.sendFormatedNumber(
                DriverPaymentDetailsSplits.commision
              ),
              amttohotel: fare.hotelcommisionAmt,
              mtd: fare.paymentMode,
              toHotel: ispaid,
              chId: "",
            };
            addHotelPayment(hotelPaymentDetails);
          });
        });
      }
      if (featuresSettings.calculateDriverEarningAtEveryDay) {
        updateDriverEarningAtEveryDay(
          DriverPaymentDetails.driver,
          DriverPaymentDetails.amttopay
        );
      }
      updateTripFinalDataInFirebase(
        doc,
        fare,
        rentalPackageInvoiceDetailsData,
        ispaid
      );
      logger.info("updateFareDetailsInTrip", 1);
      return true;
      // }
    }
  } catch (err) {
    return false;
  }
}

function updateTripFinalDataInFirebase(
  tripDoc,
  fare,
  rentalPackageInvoiceDetailsData = "",
  ispaid = "yes"
) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data"); //Todo

  var isNight = "0";
  var isPickup = "0";
  var isPeak = "0";
  var isWaiting = tripDoc.applyValues.applyWaitingTime;
  var isTax = tripDoc.applyValues.applyTax;
  if (tripDoc.applyValues.applyNightCharge && tripDoc.csp.isNight) {
    isNight = fare.nightObj.alertLable;
  }
  if (tripDoc.applyValues.applyPeakCharge && tripDoc.csp.isPeak) {
    isPeak = fare.peakObj.alertLable;
  }

  if (Number(tripDoc.acsp.conveyance) > 0) {
    isPickup = "1";
  }

  var distance_fare = tripDoc.acsp.distfare;
  if (distance_fare == null) {
    distance_fare = tripDoc.csp.distfare;
  }

  /* var time = tripDoc.acsp.time;
  if (time == null) {
    time = tripDoc.csp.time;
  } */

  // var time = fare.waitingTime;
  var time = tripDoc.acsp.time ? tripDoc.acsp.time : tripDoc.estTime;
  var duration = tripDoc.acsp.time ? tripDoc.acsp.time : tripDoc.estTime;
  if (time == null) {
    // time = tripDoc.estTime;
    // tripDoc.acsp.time ? tripDoc.acsp.time : tripDoc.csp.estTime,
    time = 0;
  }

  if (ispaid == "yes") ispaid = 1;
  else ispaid = 0;

  var requestData = {
    basefare: fare.BaseFare,
    booking: tripDoc.acsp.booking ? tripDoc.acsp.booking : 0,
    minFareAdded: fare.minFareAdded,
    minFare: fare.minFare,
    farewithoutTaxNBookingFee: tripDoc.acsp.farewithoutTaxNBookingFee
      ? tripDoc.acsp.farewithoutTaxNBookingFee
      : 0,
    Drop_address: tripDoc.adsp.to ? tripDoc.adsp.to : tripDoc.dsp.end,
    cancel_fare: "0", //Todo
    cancelby: "0", //Todo
    convance_fare: tripDoc.acsp.conveyance ? tripDoc.acsp.conveyance : 0,
    datetime: "0", //Todo
    discount: tripDoc.acsp.promoDiscount ? tripDoc.acsp.promoDiscount : 0,
    walletdebt: tripDoc.acsp.walletdebt ? tripDoc.acsp.walletdebt : 0,
    distance: tripDoc.acsp.dist ? tripDoc.acsp.dist : tripDoc.dsp.distanceKM,
    distance_fare: distance_fare,
    driver_alavance_dis: "0", //Todo
    driver_rating: "0", //Todo
    duration: duration,
    isNight: isNight,
    isPickup: isPickup,
    isWaiting: isWaiting ? "1" : "0",
    isTax: isTax ? "1" : "0",
    ispay: fare.BalanceFare ?fare.BalanceFare:0,
    isPeak: isPeak,
    pay_type: tripDoc.acsp.via ? tripDoc.acsp.via : tripDoc.asp.via,
    pickup_address: tripDoc.adsp.from ? tripDoc.adsp.from : tripDoc.dsp.start,
    rider_rating: 0, //Todo
    status: "4",
    tax: tripDoc.acsp.tax ? tripDoc.acsp.tax : tripDoc.csp.tax,
    time: time,
    time_fare: tripDoc.acsp.timefare
      ? tripDoc.acsp.timefare
      : tripDoc.csp.timefare,
    waiting_fare: tripDoc.acsp.waitingCharge ? tripDoc.acsp.waitingCharge : 0,
    total_fare: tripDoc.fare,
    trip_type: tripDoc.acsp.fareType ? tripDoc.acsp.fareType : "kmrate",
    waitingTime: tripDoc.acsp.waitingTime ? tripDoc.acsp.waitingTime : 0,
    inSecondaryCur: fare.inSecondaryCur ? fare.inSecondaryCur : 0,
    // additionalFee:  fare.additionalFee ? JSON.stringify(fare.additionalFee) : '',
    discountName: fare.discountName ? fare.discountName : "",
    discountPercentage: fare.discountPercentage ? fare.discountPercentage : 0,
    triptype: tripDoc.triptype ? tripDoc.triptype : "daily",
    perKMRate: tripDoc.acsp.perKmRate ? tripDoc.acsp.perKmRate : 0,
    perWaitingRate: tripDoc.acsp.waitingRate ? tripDoc.acsp.waitingRate : 0,
    perTimeRate: tripDoc.acsp.timeRate ? tripDoc.acsp.timeRate : 0,
    taxPercentage: tripDoc.acsp.taxPercentage ? tripDoc.acsp.taxPercentage : 0,
    taxTDS: tripDoc.acsp.taxTDS ? tripDoc.acsp.taxTDS : tripDoc.csp.taxTDS,
    taxTDSPercentage: tripDoc.acsp.taxTDSPercentage
      ? tripDoc.acsp.taxTDSPercentage
      : tripDoc.csp.taxTDSPercentage,
    surgeAmt: tripDoc.acsp.surgeAmt ? tripDoc.acsp.surgeAmt : 0,
    oldBalance: tripDoc.acsp.oldBalance ? tripDoc.acsp.oldBalance : 0,
    tollFee: tripDoc.acsp.tollFee ? tripDoc.acsp.tollFee : 0,
    dayFare: tripDoc.acsp.dayFare ? tripDoc.acsp.dayFare : 0,
    nightFare: tripDoc.acsp.nightFare ? tripDoc.acsp.nightFare : 0,
    googleCharge: tripDoc.acsp.googleCharge ? tripDoc.acsp.googleCharge : 0,
    gatewayCharge: fare.gatewayCharge ? fare.gatewayCharge : 0,
    // ispaid: ispaid
  };

  if (featuresSettings.addAdditionalFaresInTrip) {
    var additionalFee = addAdditionalFaresInTrip(fare.additionalFee);
    requestData = Object.assign(requestData, additionalFee);
  }

  if (tripDoc.triptype == "outstation" || tripDoc.triptype == "rental") {
    requestData = Object.assign(requestData, {
      invoiceBill: rentalPackageInvoiceDetailsData,
    });
  }

  requestData = convertAllNumbersToString(requestData);
  requestData.ispaid = ispaid;

  var child = tripDoc.tripno.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
    }
  });
}

function addAdditionalFaresInTrip(arrayValue) {
  var newAdditionalObj = {};
  if (arrayValue) {
    //Is parse needed ?
    arrayValue.forEach((element, index, array) => {
      newAdditionalObj[element.name] = element.amount;
    });
  }
  return newAdditionalObj;
}

export const tripPaymentStatus = async (req, res) => {
  try {
    var cashpaid = 0;
    var tripData = await Trips.findOne({ tripno: req.body.trip_id })
      .lean()
      .exec();
    if (tripData) {
      cashpaid = tripData.fare;
      req.body.amount = cashpaid;
    }
    if (config.paymentGateway.paymentGatewayName == "braintree") {
      let riderDocs = await Rider.findOne({ _id: tripData.ridid });
      var nonceFromTheClient = req.body.payment_method_nonce;
      var tripAmount = req.body.tripAmount;
      var msg = "Trip Payment - " + req.body.trip_id;
      var data = {
        firstName: riderDocs.fname,
        lastName: riderDocs.lname,
        phone: riderDocs.phone,
        email: riderDocs.email,
      };
      var resObj = await paymentCtrl.transferTripAmountUsingNonce(
        nonceFromTheClient,
        tripAmount,
        msg,
        data
      );
      if (resObj) {
        req.body.id = resObj.id;
        req.body.amount = resObj.amount;
      } else {
        req.body.id = "";
        req.body.amount = 0;
        cashpaid = req.body.tripAmount;
      }
    }

    if (config.paymentGateway.paymentGatewayName == "paytm") {
      let riderDocs = await Rider.findOne({ _id: tripData.ridid });
      var tripAmount = req.body.tripAmount;
      var msg = "Trip Payment - " + req.body.trip_id;
      var data = {
        firstName: riderDocs.fname,
        lastName: riderDocs.lname,
        phone: riderDocs.phone,
        email: riderDocs.email,
      };
      req.body.id = "";
      req.body.amount = req.body.tripAmount;
      cashpaid = req.body.tripAmount;

      updateTripFinalStatusForPaytmDataInFirebase(req.body.trip_id);
    }

    if (config.paymentGateway.paymentGatewayName == "razorpay") {
      let data = await paymentCtrl.getRazorpay(req.body.id);
      if (!data) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("FAILED_UPDATING_PAYMENT_STATUS"),
        });
      }
      cashpaid = req.body.tripAmount;
      req.body.amount = data.amount / 100;
    }

    var updateData = {
      paymentSts: "Paid",
      "acsp.chId": req.body.id,
      "acsp.carddebt": Number(req.body.amount)
        ? Number(req.body.amount).toFixed(2)
        : 0,
      "acsp.cashpaid": cashpaid,
      "acsp.bal": 0,
      // "acsp.detect": Number(req.body.amount) ? Number(req.body.amount).toFixed(2) : 0,
    };
    let docs = await Trips.findOneAndUpdate(
      { tripno: req.body.trip_id },
      updateData,
      { new: true }
    );
    if (!docs) {
      return res.status(409).json({
        success: false,
        message: req.i18n.__("TRIP_DETAILS_NOT_FOUND"),
      });
    } else {
      if (docs.paymentSts == "Paid") {
        paymentAmtToWallet(
          req.body.trip_id,
          cashpaid,
          docs.paymentMode,
          docs.tripno
        );
        if (docs.paymentMode == "payphone")
          updatePayStatusForPayPhoneInFB(docs.tripno);
      }
      return res.json({
        success: true,
        message: req.i18n.__("TRIP_PAYMENT_UPDATED"),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: req.i18n.__("FAILED_UPDATING_PAYMENT_STATUS"),
      error: err,
    });
  }
};

function updateTripFinalStatusForPaytmDataInFirebase(tripno) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data"); //Todo

  var requestData = {
    status: "6",
  };

  var child = tripno.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
    }
  });
}

function updatePayStatusForPayPhoneInFB(tripno) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data"); //Todo

  var requestData = {
    ispaid: 1,
  };

  var child = tripno.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
    }
  });
}

/**
 * Detect Payment From Wallet or Stripe and Update bal and return remaining balance
 * @param  {[type]} tripDetails [description]
 * @param  {[type]} fare        [description]
 * @param  {[type]} reqdata     [description]
 * @param  {[type]} riderdoc    [description]
 * @param  {[type]} res         [description]
 * @return {[type]}             balancetopay
 */
async function updateActualFare(tripDetails, fare, reqdata, riderdoc, res) {
  var promoamt = fare.promoamt;
  const newfare = GFunctions.sendFormatedNumber(fare.balance);

  //Driver Payment Initial
  var dpcashpaid = newfare;
  var dpwalletdebt = 0;
  var dpstripedebt = 0;
  var dpdigital = parseFloat(fare.promoamt);
  var dpoutstanding = 0;
  var dpinhand = 0;
  var dpamttodriver = 0;
  var dptoSettle = 0;

  //Normal Cash
  var updateCashData = {
    status: "Finished",
    "acsp.base": fare.basefare,
    "acsp.dist": fare.distance,
    "acsp.distfare": fare.distanceFare,
    "acsp.time": fare.time,
    "acsp.timefare": fare.timeFare,
    "acsp.amttopay": fare.subtotal,
    "acsp.cashpaid": fare.balance, //As cash have to pay fare.balance all by amt
    "acsp.commision": fare.commision,
    "acsp.comison": fare.comison,
    "acsp.promoamt": fare.promoamt,
    "acsp.promoDiscount": fare.promoamt,
    "acsp.walletdebt": 0,
    "acsp.stripedebt": 0,
    "acsp.outstanding": 0,
    "acsp.bal": 0, //0 Consider Paid Full
    "acsp.detect": fare.promoamt,
    "acsp.actualcost": fare.subtotal,
    "acsp.cost": GFunctions.sendFormatedNumber(fare.balance),
    "acsp.via": fare.paymentMode,
    "acsp.chId": "",

    "adsp.end": reqdata.endTime,
    "adsp.to": reqdata.endAddress,
    "adsp.dLat": reqdata.dropLat,
    "adsp.dLng": reqdata.dropLng,
    paymentSts: "Paid",
  };
  var updateData = updateCashData;

  //Wallet Mode
  if (fare.paymentMode == "wallet") {
    var walletRes = await findNChargeExistingUserWallet(
      tripDetails.ridid,
      tripDetails.id,
      newfare
    );

    if (walletRes) {
      //chk is res is success also
      var balancetopay = walletRes.balancetopay;
      fare.balance = balancetopay;
      fare.detectedAmt = walletRes.detectedAmt;
      var updateWalletData = {
        status: "Finished",
        "acsp.base": fare.basefare,
        "acsp.dist": fare.distance,
        "acsp.distfare": fare.distanceFare,
        "acsp.time": fare.time,
        "acsp.timefare": fare.timeFare,
        "acsp.amttopay": fare.subtotal,
        "acsp.cashpaid": 0, //As no cash has paid
        "acsp.commision": fare.commision,
        "acsp.comison": fare.comison,
        "acsp.promoamt": fare.promoamt,
        "acsp.promoDiscount": fare.promoamt,
        "acsp.walletdebt": walletRes.detectedAmt,
        "acsp.stripedebt": 0,
        "acsp.outstanding": balancetopay,
        "acsp.bal": balancetopay, //balancetopay : Amount to pay
        "acsp.detect":
          parseFloat(walletRes.detectedAmt) + parseFloat(fare.promoamt),
        "acsp.actualcost": fare.subtotal,
        "acsp.cost": newfare,
        "acsp.via": fare.paymentMode,
        "adsp.end": reqdata.endTime,
        "adsp.to": reqdata.endAddress,
        "adsp.dLat": reqdata.dropLat,
        "adsp.dLng": reqdata.dropLng,
        paymentSts: "Paid",
        "acsp.chId": walletRes.tranxid,
      };
      dpwalletdebt = walletRes.detectedAmt;
    } else {
      var updateWalletData = {
        status: "Finished",
        "acsp.base": fare.basefare,
        "acsp.dist": fare.distance,
        "acsp.distfare": fare.distanceFare,
        "acsp.time": fare.time,
        "acsp.timefare": fare.timeFare,
        "acsp.amttopay": fare.subtotal,
        "acsp.cashpaid": 0, //As no cash has paid
        "acsp.commision": fare.commision,
        "acsp.comison": fare.comison,
        "acsp.promoamt": fare.promoamt,
        "acsp.promoDiscount": fare.promoamt,
        "acsp.walletdebt": 0,
        "acsp.stripedebt": 0,
        "acsp.outstanding": newfare,
        "acsp.bal": newfare, //balancetopay : Amount to pay
        "acsp.detect": parseFloat(fare.promoamt),
        "acsp.actualcost": fare.subtotal,
        "acsp.cost": newfare,
        "acsp.via": fare.paymentMode,
        "adsp.end": reqdata.endTime,
        "adsp.to": reqdata.endAddress,
        "adsp.dLat": reqdata.dropLat,
        "adsp.dLng": reqdata.dropLng,
        paymentSts: "Paid",
        "acsp.chId": walletRes.tranxid,
      };
    }
    var updateData = updateWalletData;

    dpdigital = dpdigital + parseFloat(dpwalletdebt);
    dpoutstanding = parseFloat(fare.subtotal) - parseFloat(dpdigital);
    dpcashpaid = 0;
  } //Wallet Mode

  //Stripe Mode
  if (fare.paymentMode == "card") {
    var stripeRes = await findNChargeExistingUserCard(
      tripDetails.ridid,
      tripDetails.id,
      newfare
    );

    if (stripeRes) {
      //chk is res is success also
      var balancetopay = stripeRes.balancetopay;
      fare.balance = balancetopay;
      fare.detectedAmt = stripeRes.detectedAmt;
      var updateStripeData = {
        status: "Finished",
        "acsp.base": fare.basefare,
        "acsp.dist": fare.distance,
        "acsp.distfare": fare.distanceFare,
        "acsp.time": fare.time,
        "acsp.timefare": fare.timeFare,
        "acsp.amttopay": fare.subtotal,
        "acsp.cashpaid": 0, //As no cash has paid
        "acsp.commision": fare.commision,
        "acsp.comison": fare.comison,
        "acsp.promoamt": fare.promoamt,
        "acsp.promoDiscount": fare.promoamt,
        "acsp.walletdebt": 0,
        "acsp.stripedebt": stripeRes.detectedAmt,
        "acsp.outstanding": balancetopay,
        "acsp.bal": balancetopay, //balancetopay : Amount to pay
        "acsp.detect":
          parseFloat(stripeRes.detectedAmt) + parseFloat(fare.promoamt),
        "acsp.actualcost": fare.subtotal,
        "acsp.cost": newfare,
        "acsp.via": fare.paymentMode,
        "adsp.end": reqdata.endTime,
        "adsp.to": reqdata.endAddress,
        "adsp.dLat": reqdata.dropLat,
        "adsp.dLng": reqdata.dropLng,
        paymentSts: "Paid",
        "acsp.chId": stripeRes.tranxid,
      };
      dpstripedebt = stripeRes.detectedAmt;
    } else {
      var updateStripeData = {
        status: "Finished",
        "acsp.base": fare.basefare,
        "acsp.dist": fare.distance,
        "acsp.distfare": fare.distanceFare,
        "acsp.time": fare.time,
        "acsp.timefare": fare.timeFare,
        "acsp.amttopay": fare.subtotal,
        "acsp.cashpaid": 0, //As no cash has paid
        "acsp.commision": fare.commision,
        "acsp.comison": fare.comison,
        "acsp.promoamt": fare.promoamt,
        "acsp.promoDiscount": fare.promoamt,
        "acsp.walletdebt": 0,
        "acsp.stripedebt": 0,
        "acsp.outstanding": newfare,
        "acsp.bal": newfare, //balancetopay : Amount to pay
        "acsp.detect": parseFloat(fare.promoamt),
        "acsp.actualcost": fare.subtotal,
        "acsp.cost": newfare,
        "acsp.via": fare.paymentMode,
        "adsp.end": reqdata.endTime,
        "adsp.to": reqdata.endAddress,
        "adsp.dLat": reqdata.dropLat,
        "adsp.dLng": reqdata.dropLng,
        paymentSts: "Paid",
        "acsp.chId": walletRes.tranxid,
      };
    }
    var updateData = updateStripeData;

    dpcashpaid = 0;
    dpdigital = dpdigital + parseFloat(dpstripedebt);
    dpoutstanding = parseFloat(fare.subtotal) - parseFloat(dpdigital);
  } //Stripe Mode

  dpinhand = parseFloat(dpcashpaid) + parseFloat(dpoutstanding);
  dptoSettle =
    parseFloat(fare.subtotal) -
    parseFloat(fare.commision) -
    parseFloat(dpinhand);
  dpamttodriver = parseFloat(fare.subtotal) - parseFloat(fare.commision);

  var DriverPaymentDetails = {
    tripno: tripDetails.tripno,
    driver: tripDetails.dvrid,
    dvrfname: tripDetails.dvr,
    amttopay: GFunctions.sendFormatedNumber(fare.subtotal), //should be real total
    cashpaid: GFunctions.sendFormatedNumber(dpcashpaid), //should be cash
    commision: fare.commision,
    promoamt: GFunctions.sendFormatedNumber(fare.promoamt),
    walletdebt: GFunctions.sendFormatedNumber(dpwalletdebt),
    stripedebt: GFunctions.sendFormatedNumber(dpstripedebt),
    digital: GFunctions.sendFormatedNumber(dpdigital),
    outstanding: GFunctions.sendFormatedNumber(dpoutstanding),
    inhand: GFunctions.sendFormatedNumber(dpinhand),
    amttodriver: GFunctions.sendFormatedNumber(dpamttodriver),
    toSettle: GFunctions.sendFormatedNumber(dptoSettle),
    mtd: fare.paymentMode,
    ispaid: "yes",
    todvr: "yes",
    chId: "",
  };

  debitDriverBankTransactions(
    DriverPaymentDetails.driver,
    DriverPaymentDetails.toSettle,
    DriverPaymentDetails.tripno,
    DriverPaymentDetails.commision
  );
  try {
    let docs = await Trips.findOneAndUpdate(
      { _id: tripDetails.id },
      updateData,
      { new: true }
    );
    if (!docs) {
      return res.status(409).json({
        success: true,
        message: req.i18n.__("TRIP_ENDED"),
        rider: riderdoc,
        pickupdetails: tripDetails.dsp[0],
        status: "Trip End",
        fare: fare,
        taxitype: tripDetails.taxi,
      });
    } else {
      //add new to fares
      addDriverPayment(DriverPaymentDetails); //Called after Successful Transaction
      return res.json({
        success: true,
        message: req.i18n.__("TRIP_ENDED"),
        rider: riderdoc,
        pickupdetails: tripDetails.dsp[0],
        status: "Trip End",
        fare: fare,
        taxitype: tripDetails.taxi,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: req.i18n.__("SOME_ERROR"), error: err });
  }
}

/**
 * Find Stripe = If exists charge and return balance to pay with other details
 * @input
 * @param
 * @return retunObj
 * @response
 */
async function findNChargeExistingUserCard(
  userId,
  tripid,
  amt,
  commisionamount,
  driverId,
  tripno,
  paymentMethod = config.paymentGateway.paymentGatewayName
) {
  var retunObj = {
    success: false,
    balancetopay: amt,
    tranxid: "",
    detectedAmt: 0,
    addToWallet: true,
  };

  try {
    let docs = await Rider.findById(userId);
    if (!docs) {
      return 0;
    } else {
      var desc = "Trip -" + tripno;
      var res = false;

      if (featuresSettings.riderCard && paymentMethod == "stripe") {
        if (
          featuresSettings.driverPayouts
            .driverStripeSplitPayoutDirectlyAtEveryTripEnd
        ) {
          //Check he has active connect account if so split now
          // let docs = await Driver.findById(driverId);
          let driverBankDocs = await DriverBank.findOne({ driverId: driverId });
          if (driverBankDocs) {
            var driverConnectAcctId = driverBankDocs.bank.chid;
          }

          if (driverConnectAcctId) {
            //spliting Directly to admin and driver
            res =
              await paymentCtrl.chargeExistingUserCardWithInstantSplitToDriver(
                docs.card.id,
                desc,
                featuresSettings.defaultcur,
                amt,
                commisionamount,
                driverConnectAcctId,
                paymentMethod
              );
            if (res.status) {
              retunObj.addToWallet = false; // as we already transfered
            } else {
              res = await paymentCtrl.chargeExistingUserCard(
                docs.card.id,
                desc,
                featuresSettings.defaultcur,
                amt,
                "",
                paymentMethod,
              );
            }

            //instead of spliting Directly 1.Charge customer 2.Payto Driver instantly
            // res = await paymentCtrl.chargeExistingUserCard(docs.card.id, desc, featuresSettings.defaultcur, amt);
            // if (res.status){
            // 	var payoutRes = await paymentCtrl.makeInstantPayouts(desc, featuresSettings.defaultcur, amt, commisionamount, driverConnectAcctId );
            // 	if (payoutRes.status){
            // 		retunObj.addToWallet = false;
            // 	}
            // }
          }
          //else if no connect account add to his Wallet.
          else {
            res = await paymentCtrl.chargeExistingUserCard(
              docs.card.id,
              desc,
              featuresSettings.defaultcur,
              amt,
              "",
              paymentMethod,
            );
          }
        } else {
          // let transactionID = await Paymentflow.find({userId:mongoose.Types.ObjectId(userId)}).sort({createdAt:-1})
          // //Charging from Card Id Supported By = Stripe
          // // let update ={referenceId:tripid}
          // // let ab = await Paymentflow.findOneAndUpdate({transactionId:transactionID[0].transactionId},update,{new:true}).exce()
          // res = await paymentCtrl.chargeExistingUserCard(
          //   docs.card.id,
          //   desc,
          //   featuresSettings.defaultcur,
          //   amt,
          //   "",
          //   paymentMethod,
          //   {
          //     userId : userId,
          //     userType : "rider",
          //     referenceId : tripid,
          //     transactionId: transactionID[0].transactionId
          //   }
          // );dUpdate({transactionId:transactionID[0].transactionId},update,{new:true}).exce()
          res = await paymentCtrl.chargeExistingUserCard(
            docs.card.id,
            desc,
            featuresSettings.defaultcur,
            amt,
            "",
            paymentMethod
          );
        }
      }

      if (featuresSettings.riderCard && paymentMethod == "paystack") {
        //Charging from Card Id Supported By = Paystack
        res = await paymentCtrl.chargeExistingUserCard(
          docs.card.id,
          desc,
          featuresSettings.defaultcur,
          amt,
          docs.email,
          paymentMethod
        );
      }

      if (res && res.status) {
        var detectedAmt = parseFloat(res.amount) / 100;
        retunObj.balancetopay = parseFloat(amt) - parseFloat(detectedAmt); //Have to check with Live act if amt > detectedAmt
        retunObj.tranxid = res.id;
        retunObj.detectedAmt = detectedAmt;
        retunObj.success = true;
        if (retunObj.addToWallet == false) {
          findAndSendFCMToDriver(
            driverId,
            "Payment Success! Trip Amount has been transfered to your bank."
          );
        } else {
          findAndSendFCMToDriver(
            driverId,
            "Payment Success! Trip Amount has been transfered to your wallet."
          );
        }
      } else {
        findAndSendFCMToDriver(
          driverId,
          "Payment Failed! Collect Trip Amount manually."
        );
        findAndSendFCMToRider(
          userId,
          "Payment Failed! Please Pay Trip Amount by Cash."
        );
      }
      return retunObj;
    }
  } catch (err) {
    return retunObj;
  }
}

/**
 * Find Wallet = If exists charge and return balance to pay with other details
 * @param  {[type]} userId [description]
 * @param  {[type]} tripid [description]
 * @param  {[type]} amt    [description]
 * @return {[obj]/0}        [description]
 */
async function findNChargeExistingUserWallet(userId, tripid, amt) {
  var retunObj = {
    success: false,
    balancetopay: amt,
    tranxid: "",
    detectedAmt: 0,
  };

  try {
    let docs = await Wallet.findOne({ ridid: userId });
    if (!docs) {
      return retunObj;
    } else {
      //Wallet Available
      var walletbal = docs.bal;
      var balancetopay = amt;
      var oldbal = docs.bal;
      var charged = 0;
      if (oldbal > amt) {
        //If wallet has sufficient bal
        walletbal = parseFloat(oldbal) - parseFloat(amt);
        balancetopay = 0;
        charged = amt;
      } else {
        walletbal = 0;
        balancetopay = parseFloat(amt) - parseFloat(oldbal);
        charged = parseFloat(amt) - parseFloat(balancetopay);
      }
      //Wallet Available
      //have to combine this func and save here itself : 1 find only
      var IsBalUpdated = await chargeWalletAndReturnBal(
        tripid,
        docs.id,
        walletbal,
        charged
      );
      if (IsBalUpdated) {
        retunObj.success = true;
        retunObj.balancetopay = balancetopay;
        retunObj.detectedAmt = charged;
        return retunObj;
      } else {
        retunObj.success = true;
        retunObj.balancetopay = amt;
        retunObj.detectedAmt = 0;
        return retunObj;
      }
    }
  } catch (err) {
    return retunObj;
  }
}

/**
 * Add Detail Payment Details to Driver Account
 * @param {[type]} doc     [description]
 * @param {[type]} fare    [description]
 * @param {[type]} reqBody [description]
 */
function addDriverPayment(details) {
  const newDoc = new DriverPayment(details);
  newDoc.save((err, docs) => {
    if (err) {
      logger.error(`addDriverPayment ${err}`);
    } else {
    }
  });
}

/**
 * [chargeWalletAndReturnBal description]
 * @param  {[type]} tripid    [description]
 * @param  {[type]} walletId  [description]
 * @param  {[type]} walletbal [description]
 * @param  {[type]} charged   [description]
 * @return {[type]}           [description]
 */
async function chargeWalletAndReturnBal(tripid, walletId, walletbal, charged) {
  var updateData = {
    bal: walletbal,
  };
  try {
    let docs = await Wallet.findOneAndUpdate({ _id: walletId }, updateData, {
      new: true,
    });
    if (!docs) {
      return 0;
    } else {
      logTranxHistory(tripid, charged, walletId);
      return 1;
    }
  } catch (err) {
    return 0;
  }
}

/**
 * Log Wallet Debit Details
 * @input
 * @param
 * @return
 * @response
 */
function logTranxHistory(tripid, amt, walletId) {
  var id = mongoose.Types.ObjectId();
  var tranxData = {
    _id: id,
    trxid: tripid,
    amt: amt,
    date: GFunctions.sendTimeNow(),
    type: "Debit",
  };

  Wallet.findByIdAndUpdate(
    walletId,
    {
      $push: { trx: tranxData },
    },
    { new: true },
    function (err, doc) {
      if (err) {
        return "";
      }
      return id;
    }
  );
}

//update the airport Zone fare details
async function updateAirportFare(tripId, lat, lng, tripState) {
  let locationAirportZone = await airportZoneFare(lat, lng);
  if (locationAirportZone.status == true) {
    TotalAirportZoneFare =
      TotalAirportZoneFare + Number(locationAirportZone.airportFare);
  }

  if (tripState == "start") {
    var update = {
      acsp: {
        startAirportZoneFare: locationAirportZone.airportFare,
        totalAirportZoneFare: TotalAirportZoneFare,
      },
    };
  } else if (tripState == "end") {
    var update = {
      acsp: {
        endAirportZoneFare: locationAirportZone.airportFare,
        totalAirportZoneFare: TotalAirportZoneFare,
      },
    };
  }

  Trips.findOneAndUpdate(
    { tripno: tripId },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
      }
      logger.info("updateAirportZoneFare");
    }
  );
}

//Update actual Pickup Location
async function updateActualPickupFare(tripId, fare, reqdata) {
  var startTime = GFunctions.getISODate();
  var startTimeToHM = reqdata.startTime;
  if (reqdata.endFromAdmin == "admin") {
    startTime = reqdata.startTime;
    startTimeToHM = moment(reqdata.startTime).format("HH:mm");
  }
  var update = {
    "acsp.startMeter": reqdata.startMeter ? reqdata.startMeter : 0,
    "acsp.startTime": startTime,

    "adsp.start": startTimeToHM,
    "adsp.from": reqdata.fromAddress,
    "adsp.pLat": reqdata.pickupLat,
    "adsp.pLng": reqdata.pickupLng,
    status: "Progress",
  };

  if (featuresSettings.checkAirportZone) {
    let locationAirportZone = await airportZoneFare(
      reqdata.pickupLat,
      reqdata.pickupLng
    );
    update["acsp.startAirportZoneFare"] = locationAirportZone.airportFare;
  }

  Trips.findOneAndUpdate(
    { tripno: tripId, status: { $ne: "Progress" } },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
      }
      logger.info("updateActualPickupFare");
      if (doc) {
        if (reqdata.endFromAdmin == "admin") {
          updateStatusInFirebase(tripId, "3");
          updateRiderFbStartStatus(doc.ridid, "Accepted", doc.triptype);
        }
      }
    }
  );
}

async function updateArrive(tripId) {
  var arrivedTime = GFunctions.getISODate();

  Trips.findOneAndUpdate(
    { tripno: tripId, status: { $ne: "Progress" } },
    { "acsp.arrivedTime": arrivedTime },
    { new: true },
    (err, doc) => {
      if (err) {
      }
    }
  );
}

//req to trip id
function updateRiderFbStartStatus(userid, msg, tripType) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    tripstatus: msg,
    triptype: tripType,
  };

  var child = userid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
}

export const testWallet = (req, res) => {
  findNChargeExistingUserWallet(req.body.userId, req.body.tripid, req.body.amt);
};

/**
 * Send Accepted Trip Driver details to Rider
 * @input tripId
 * @param
 * @return
 * @response tripDriverDetails
 */
export const tripDriverDetails = (req, res) => {
  Trips.findOne({ tripno: req.body.tripId }, function (err, doc) {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: err.message, err: err });
    }
    if (!doc)
      return res.status(409).json({
        success: false,
        message: req.i18n.__("NO_TRIP_FOUND"),
        error: err,
      });

    //Driver Profile 2
    var DriverDetailsAry = [];
    Driver.find({ _id: doc.dvrid }, { hash: 0, salt: 0 }).exec(
      (err2, driverdocs) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: err.message, err: err });
        }
        if (!driverdocs.length) {
          return res.status(409).json({
            success: false,
            message: req.i18n.__("DRIVER_NOT_AVAILABLE"),
          });
        }
        var DriverObj = {
          fname: driverdocs[0].fname,
          lname: driverdocs[0].lname,
          email: driverdocs[0].email,
          phone: driverdocs[0].phone,
          phcode: driverdocs[0].phcode,
          gender: driverdocs[0].gender,
          cntyname: driverdocs[0].cntyname,
          statename: driverdocs[0].statename,
          cityname: driverdocs[0].cityname,
          lang: driverdocs[0].lang,
          cur: driverdocs[0].cur,
          profileurl: config.baseurl + driverdocs[0].profile,
          rating: driverdocs[0].rating.rating,
          taxitype: doc.taxi,
        };

        DriverDetailsAry.push({ profile: DriverObj });
        // DriverDetailsAry.push({  rating : driverdocs[0].rating   });
        var taxi = driverdocs[0].taxis.id(driverdocs[0].currentTaxi);
        DriverDetailsAry.push({ currentActiveTaxi: taxi });
        // DriverDetailsAry.push({  profileurl: config.baseurl+driverdocs[0].profile  });
        return res.json({
          success: true,
          message: req.i18n.__("TRIP_STATUS"),
          tripId: doc._id,
          driver: DriverDetailsAry,
          pickupdetails: doc.dsp,
          serviceType: doc.vehicle,
          others1: driverdocs[0].others1,
          startOTP: doc.tripOTP[0],
          endOTP: doc.tripOTP[1],
          multiLocation: doc.multiLocation,
        });
      }
    );
  });
};

/**
 * Driver Feedback for Trip
 */
export const driverFeedback = (req, res) => {
  var update = {
    driverfb: {
      rating: req.body.rating,
      cmts: req.body.comments,
    },
  };
  Trips.findOneAndUpdate(
    { tripno: req.body.tripId },
    update,
    { new: false },
    (err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (doc) {
        freeTheDriver(doc.dvrid);
        UpdateRiderRating(req.body.rating, doc.ridid);
      }
      return res.json({
        success: true,
        message: req.i18n.__("FEEDBACK_ADDED_SUCCESSFULLY"),
      });
    }
  );
};

/**
 * Update Rider overall ratings
 * @param {*} rating
 * @param {*} ridid
 */
function UpdateRiderRating(rating = 0, ridid) {
  Rider.findById(ridid, function (err, docs) {
    if (err) {
    } else if (!docs) {
    } else {
      let oldrating = parseFloat(docs.rating.rating);
      let oldnos = docs.rating.nos;
      let rate = oldrating * oldnos;
      oldnos++;
      docs.rating.rating = ((rate + parseFloat(rating)) / oldnos).toFixed(2);
      docs.rating.nos = oldnos;
      docs.save(function (err, op) {
        if (err) {
        } else {
        }
      });
    }
  });
}

/**
 * Rider Feedback for Trip
 * @param {*} req
 * @param {*} res
 */
export const riderFeedback = async (req, res) => {
  // if (req.body.tips) {
  //   if (req.body.tips == "") {
  //     var tips = 0;
  //     await addTips(req.body.tripId, tips);
  //   } else {
  //     var tips = parseFloat(req.body.tips);
  //     await addTips(req.body.tripId, tips);
  //   }
  // }

  var update = {
    riderfb: {
      rating: req.body.rating,
      cmts: req.body.comments,
    },
  };
  Trips.findOneAndUpdate(
    { tripno: req.body.tripId },
    update,
    { new: false },
    async (err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      await UpdateDriverRating(req.body.rating, doc.dvrid);
      return res.json({
        success: true,
        message: req.i18n.__("FEEDBACK_ADDED_SUCCESSFULLY"),
      });
    }
  );
};

/**
 * Update Driver Overall rating
 * @param {*} rating
 * @param {*} dvrid
 */
function UpdateDriverRating(rating = 0, dvrid) {
  Driver.findById(dvrid, function (err, docs) {
    if (err) {
    } else if (!docs) {
    } else {
      let oldnos = docs.rating.nos;
      let rate = parseFloat(docs.rating.rating) * oldnos;
      oldnos++;
      docs.rating.rating = ((rate + parseFloat(rating)) / oldnos).toFixed(2);
      docs.rating.nos = oldnos;
      if (rating == 5 || rating == "5") {
        let starnos = docs.rating.star;
        starnos++;
        docs.rating.star = starnos;
      }
      docs.save(function (err, op) {
        if (err) {
        } else {
        }
      });
    }
  });
}

export const clearStatus = (req, res) => {
  var update = {
    curStatus: "free",
  };
  Driver.findOneAndUpdate(
    { _id: req.body.driverid },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
      }
      return res.json({
        success: true,
        message: req.i18n.__("STATUS_SET_TO_FREE"),
      });
    }
  );
};

function findAndSendFCMToRider(userId, msg, content) {
  Rider.findById(userId, function (err, docs) {
    if (err) {
    } else {
      if (docs.fcmId)
        GFunctions.sendFCMMsg(
          docs.fcmId,
          msg,
          content,
          config.appName,
          userId,
          2
        );
    }
  });
}

export const findAndSendFCMToAdmin = (userId, msg) => {
  userId = mongoose.Types.ObjectId(userId);
  Admin.findById(userId, function (err, docs) {
    if (err) {
    } else {
      if (docs && docs.fcmId != null)
        GFunctions.sendAdminPushMsg(docs.fcmId, msg);
    }
  });
};

export const findAndSendFCMToAllAdmin = (fcmFor, msg) => {
  // userId = mongoose.Types.ObjectId(userId);
  Admin.find({}, function (err, docs) {
    if (err) {
    } else {
      docs.forEach(function (doc) {
        if (doc && doc.fcmId != null)
          GFunctions.sendAdminPushMsg(doc.fcmId, msg);
      });
    }
  });
};

export const fcmp = (req, res) => {
  GFunctions.sendFCMMsg(req.body.fcmId, "RebuStar App", "test hi");
};

/**
 * Rider Finished trip History
 */
export const riderTripHistory = (req, res) => {
  var pageQuery = HelperFunc.paginationBuilder(req.body);
  var skip = pageQuery.skip,
    limit = pageQuery.take;

  if (!skip) skip = 0;
  if (!limit) limit = 10;

  Trips.find(
    {
      ridid: req.userId,
      $and: [
        // { $or: [{status:  "Finished" }, { status : "Cancelled" }] }
        { $or: [{ status: "Finished" }] },
      ],
      // status: { $in: ['processing', 'Finished', 'accepted', 'Progress'] },
    },
    {
      cpy: 0,
      cpyid: 0,
      dvr: 0,
      dvrid: 0,
      csp: 0,
      rid: 0,
      ridid: 0,
      service: 0,
      needClear: 0,
      createdAt: 0,
      driverfb: 0,
      riderfb: 0,
      reqDvr: 0,
    },
    { sort: { createdAt: -1 } }
  )
    .limit(limit)
    .skip(skip)
    .exec((err, docs) => {
      if (err) {
        return res.status(409).json([]);
      }
      return res.json(docs);
    });
};

// export const riderTripHistory = (req, res) => {
//   Trips.find(
//     {
//       ridid: req.userId,
//       $and: [
//         // { $or: [{status:  "Finished" }, { status : "Cancelled" }] }
//         { $or: [{ status: "Finished" }] },
//       ],
//     },
//     {
//       cpy: 0,
//       cpyid: 0,
//       dvr: 0,
//       dvrid: 0,
//       csp: 0,
//       rid: 0,
//       ridid: 0,
//       service: 0,
//       needClear: 0,
//       createdAt: 0,
//       driverfb: 0,
//       riderfb: 0,
//       reqDvr: 0,
//       acsp: 0,
//     },
//     { sort: { createdAt: -1 } }
//   ).exec((err, docs) => {
//     if (err) {
//       return res.status(409).json([]);
//     }
//     return res.json(docs);
//   });
// };

/**
 * Driver Finished History
 * @param {*} req
 * @param {*} res
 */
export const driverTripHistory = (req, res) => {
  var pageQuery = HelperFunc.paginationBuilder(req.body);
  var skip = pageQuery.skip,
    limit = pageQuery.take;

  if (!skip) skip = 0;
  if (!limit) limit = 10;

  var whereQuery = {
    dvrid: req.userId,
    $and: [
      // { $or: [{status:  "Finished" }, { status : "Cancelled" }] }
      { $or: [{ status: "Finished" }] },
    ],
  };
  if (req.body.date) {
    var baseData = "createdAt"; //  tripFDT/createdAt

    // var fromDate = moment(req.body.date, 'MMMM D, YYYY' ).format('YYYY-MM-DD');
    // var toDate = moment(req.body.date, 'MMMM D, YYYY').add(1, 'days').format('YYYY-MM-DD');

    var fromDate = moment(req.body.date, [
      "MMMM D, YYYY",
      "D, MMMM YYYY",
    ]).format("YYYY-MM-DD");
    var toDate = moment(req.body.date, ["MMMM D, YYYY", "D, MMMM YYYY"])
      .add(1, "days")
      .format("YYYY-MM-DD");
    whereQuery[baseData] = { $gte: new Date(fromDate), $lte: new Date(toDate) };
  }

  Trips.find(
    whereQuery,
    {
      cpy: 0,
      cpyid: 0,
      dvr: 0,
      dvrid: 0,
      csp: 0,
      rid: 0,
      ridid: 0,
      service: 0,
      needClear: 0,
      createdAt: 0,
      driverfb: 0,
      riderfb: 0,
      reqDvr: 0,
    },
    {
      // skip:0, // Starting Row
      // limit:10, // Ending Row
      sort: {
        createdAt: -1, //Sort by Id Added DESC
      },
    }
  )
    .limit(limit)
    .skip(skip)
    .exec((err, docs) => {
      if (err) {
        return res.status(409).json([]);
      }
      return res.json(docs);
    });
};

/* export const driverTripHistory = (req, res) => {
  Trips.find({
    dvrid: req.userId, $and: [
      // { $or: [{status:  "Finished" }, { status : "Cancelled" }] }
      { $or: [{ status: "Finished" }] }
    ]
  }, { cpy: 0, cpyid: 0, dvr: 0, dvrid: 0, csp: 0, rid: 0, ridid: 0, service: 0, needClear: 0, createdAt: 0, driverfb: 0, riderfb: 0, reqDvr: 0, acsp: 0 },
    {
      // skip:0, // Starting Row
      // limit:10, // Ending Row
      sort: {
        createdAt: -1 //Sort by Id Added DESC
      }
    }
  ).exec((err, docs) => {
    if (err) {
      return res.status(409).json([]);
    }
    return res.json(docs);
  });
} */

/**
 * Driver Current Ratings
 * @input
 * @param
 * @return
 * @response
 */
export const myRatings = (req, res) => {
  var obj = [];
  Driver.find({ _id: req.userId }, {}).exec((err, docs) => {
    if (err) {
      return res.status(409).json([]);
    }
    if (docs.length) {
      obj.push(docs[0].rating);
      return res.json(obj);
    }
  });
};

/**
 * Driver : Feedbacks to Driver //Sort By DESC
 * @input
 * @param
 * @return
 * @response
 */
export const feedbackLists = (req, res) => {
  Trips.aggregate(
    [
      // { "$match": { "dvrid": req.userId  } },
      {
        $match: {
          dvrid: new mongoose.Types.ObjectId(req.userId),
          "riderfb.cmts": { $exists: true, $ne: "" },
        },
      },
      { $sort: { _id: -1 } },
      {
        $lookup: {
          localField: "ridid",
          from: "riders",
          foreignField: "_id",
          as: "userinfo",
        },
      },
      { $unwind: "$userinfo" },
      {
        $project: {
          tripno: 1,
          riderfb: 1,
          "userinfo.fname": 1,
          "userinfo.profile": 1, //Full path
        },
      },
    ],
    function (err, result) {
      if (err) {
        return res.status(409).json();
      }
      return res.json({ feedbacks: result, profileurl: config.baseurl });
    }
  );
};

/**
 * Rider Cancelled the Ongoing Trip //Need to add cancelation fee
 * @input
 * @param
 * @return
 * @response
 */
//@TODO Need to check is cancelled allowed if time
export const cancelCurrentTrip = (req, res) => {
  var update = {
    status: "Cancelled",
    cancellationReason: req.body.reason ? req.body.reason : "Rider Cancelled",
    review: constantsValues.cancelTaxiByUser,
    needClear: "no",
  };

  Trips.findOneAndUpdate(
    {
      tripno: req.body.tripId,
      status: { $in: ["accepted", "processing", "Cancelled", "cancelled"] },
    },
    update,
    { new: true },
    async(err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (!doc)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("NO_ACTIVE_TRIP_FOUND"),
        });
      await notifyRider(
        doc.ridid,
        constantsValues.cancelTaxiByUser,
        doc.id,
        "Cancelled"
      );
      updateStatusInFirebase(req.body.tripId, 5);
      changeMyTripStatusMongo(doc.dvrid, doc.tripno, "free");
      changeRiderTripStatusMongo(doc.ridid, doc.tripno, "free");
      findAndSendFCMToDriver(doc.dvrid, "Trip Cancelled", "cancelCurrentTrip");
      addCancelationStepsToRider(doc.ridid, req.body.tripId);
      return res.json({
        success: true,
        message: labels.cancelTripByRider,
        tripId: req.body.tripId,
      });
    }
  );
};

export const cancelCurrentTripFromAdmin = (req, res) => {
  var update = {
    status: "Cancelled",
    cancellationReason: req.body.reason ? req.body.reason : "Admin Cancelled",
    review: "admin Cancelled",
    needClear: "no",
  };

  Trips.findOneAndUpdate(
    { tripno: req.body.tripId },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (!doc)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("NO_ACTIVE_TRIP_FOUND"),
        });
      updateStatusInFirebase(req.body.tripId, 5);
      notifyRider(doc.ridid, "admin Cancelled", doc.id, "Cancelled");
      // addCancelationStepsToRider(doc.ridid, req.body.tripId);
      changeMyTripStatusMongo(doc.dvrid, doc.tripno, "free");
      changeRiderTripStatusMongo(doc.ridid, doc.tripno, "free");
      var riderDoc = Rider.findOne({ _id: doc.ridid });
      smsGateway.sendSmsMsg(
        riderDoc.phone,
        "",
        riderDoc.phcode,
        "",
        "sendTripCancelledSMSToRider",
        { TRIPNO: doc.tripno, REASON: req.body.reason }
      );
      findAndSendFCMToDriver(doc.dvrid, "Trip Cancelled", "cancelCurrentTrip");
      return res.json({
        success: true,
        message: labels.cancelTripByRider,
        tripId: req.body.tripId,
      });
    }
  );
};

/**
 * Driver Earnings = total,daily,weekly,monthly,yearly
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const myEarnings = async (req, res) => {
  var obj = {
    total: 0,
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  };
  var driverId = new mongoose.Types.ObjectId(req.userId);
  var nowdate = new Date();
  var groupbyval = {
    _id: "$driver",
    totalAmount: { $sum: "$amttodriver" },
    nos: { $sum: 1 },
  };
  var totalmatch = { $match: { driver: driverId } };
  var dailymatch = {
    $match: {
      driver: driverId,
      createdAt: { $gte: GFunctions.pastDay(), $lt: nowdate },
    },
  };
  var weeklymatch = {
    $match: {
      driver: driverId,
      createdAt: { $gte: GFunctions.sendPast7Day(), $lt: nowdate },
    },
  };
  var monthlymatch = {
    $match: {
      driver: driverId,
      createdAt: { $gte: GFunctions.sendPast31Day(), $lt: nowdate },
    },
  };
  var yearmatch = {
    $match: {
      driver: driverId,
      createdAt: { $gte: GFunctions.sendPast31Day(), $lt: nowdate },
    },
  };

  var promisesToMake = [
    myEarningsDriverBasicSplits(totalmatch, groupbyval),
    myEarningsDriverBasicSplits(dailymatch, groupbyval),
    myEarningsDriverBasicSplits(weeklymatch, groupbyval),
    myEarningsDriverBasicSplits(monthlymatch, groupbyval),
    myEarningsDriverBasicSplits(totalmatch, groupbyval),
  ];
  var promises = Promise.all(promisesToMake);
  promises
    .then(function (results) {
      var resstr = JSON.stringify(results);
      resstr = resstr.substr(1).slice(0, -1);
      var resarray = resstr.split(",");
      obj.total = resarray[0] ? resarray[0] : 0;
      obj.daily = resarray[1] ? resarray[1] : 0;
      obj.weekly = resarray[2] ? resarray[2] : 0;
      obj.monthly = resarray[3] ? resarray[3] : 0;
      obj.yearly = resarray[4] ? resarray[4] : 0;
      return res.json(obj);
    })
    .catch(function (error) {
      return res.status(500).json(obj);
    });
};

/**
 * Past 1 Trip Details with Map  //pending check we aleady done it
 * @input
 * @param
 * @return
 * @response
 */
export const pastTripDetail = async (req, res) => {
  try {
    var tripData = await Trips.findOne({ _id: req.body.tripId }, {}).lean();
    var riderData = await Rider.findOne(
      { _id: tripData.ridid }
    );
    if (riderData) {
      riderData.profile = config.baseurl + riderData.profile;
    }

    tripData.csp = GFunctions.convertAllNumbersToString(tripData.csp);
    tripData.acsp = GFunctions.convertAllNumbersToString(tripData.acsp);
    return res.status(200).json({
      success: true,
      TripDetail: tripData,
      DriverTip: tripData.tips,
      ProfileDetail: riderData,
      Mapurl: tripData.adsp.map,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.i18n.__("NO_TRIP_FOUND"),
      error: error,
    });
  }
};

/**
 * Past 1 Trip Details with Map  //pending check we aleady done it
 * @input
 * @param
 * @return
 * @response
 */
export const pastTripDetailRider = async (req, res) => {
  try {
    var tripData = await Trips.findOne({ _id: req.body.tripId }, {}).lean();
    var driverData = await Driver.findOne(
      { _id: tripData.dvrid },
      { fname: 1, profile: 1, phone: 1 }
    );
    driverData.profile = config.baseurl + driverData.profile;
    tripData.acsp = convertAllNumbersToString(tripData.acsp);
    tripData.csp = convertAllNumbersToString(tripData.csp);
    return res.status(200).json({
      success: true,
      TripDetail: tripData,
      DriverTip: tripData.tips,
      ProfileDetail: driverData,
      Mapurl: tripData.adsp.map,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.i18n.__("NO_TRIP_FOUND"),
      error: error,
    });
  }
};

/**
 * Add Amount To Given User Wallet // Set is amount Exists in Stripe First 1.chk User, Card added, amt available, then add to admin, update balnce and trans details
 * @input
 * @param
 * @return
 * @response
 */
export const addToMyWallet = async (req, res) => {
  if (featuresSettings.riderWallet) {
    req.body.rechargeAmount = req.body.rechargeAmount
      ? req.body.rechargeAmount
      : req.body.id;
    // 1.chk User
    Rider.findOne({ _id: req.userId }, function (err, rideDoc) {
      if (err)
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      if (!rideDoc)
        return res
          .status(409)
          .json({ success: false, message: req.i18n.__("NO_RIDER_FOUND") });

      if (
        featuresSettings.riderRechargeWalletInClientSide == false &&
        config.paymentGateway.paymentGatewayName == "stripe"
      ) {
        //Rider he added card already now only recharging
        //1. Check Wallet Exists
        Wallet.findOne({ ridid: req.userId }, async function (err, doc) {
          if (err)
            return res.status(500).json({
              success: false,
              message: req.i18n.__("SOME_ERROR"),
              error: err,
            });
          if (!doc)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("NO_WALLET_FOUND_PLEASE_ADD_CARD_FIRST"),
            });
          if (!doc.card.id)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("NO_WALLET_FOUND_PLEASE_ADD_CARD_FIRST"),
            });
          var msg = "Wallet Recharge - " + doc.id;
          paymentCtrl.transferAmountNRecharge(
            res,
            doc.card.id,
            msg,
            doc.card.currency,
            req.body.rechargeAmount,
            req.userId,
            doc.id,
            rideDoc,
            req
          );
        });
        //1. Check Wallet Exists
      } else if (
        featuresSettings.riderRechargeWalletInClientSide == false &&
        config.paymentGateway.paymentGatewayName == "braintree"
      ) {
        //Rider he added card already now only recharging
        var data = {
          firstName: rideDoc.fname,
          lastName: rideDoc.lname,
          phone: rideDoc.phone,
          email: rideDoc.email,
        };
        Wallet.findOne({ ridid: req.userId }, async function (err, doc) {
          if (err)
            return res.status(500).json({
              success: false,
              message: req.i18n.__("SOME_ERROR"),
              error: err,
            });
          if (!doc)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("NO_WALLET_FOUND_PLEASE_ADD_CARD_FIRST"),
            });
          var msg = "Wallet Recharge - " + doc.id;
          paymentCtrl.transferAmountUsingNonceNRecharge(
            req,
            res,
            req.userId,
            doc.id,
            msg,
            data
          );
        });
      } else if (config.paymentGateway.paymentGatewayName == "paystack") {
        //Rider he added card already now only recharging
        var data = {
          firstName: rideDoc.fname,
          lastName: rideDoc.lname,
          phone: rideDoc.phone,
          email: rideDoc.email,
        };
        Wallet.findOne({ ridid: req.userId }, async function (err, doc) {
          if (err)
            return res.status(500).json({
              success: false,
              message: req.i18n.__("SOME_ERROR"),
              error: err,
            });
          if (!doc)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("NO_WALLET_FOUND_PLEASE_ADD_CARD_FIRST"),
              error: err,
            });
          var msg = "Wallet Recharge - " + doc.id;
          paymentCtrl.transferAmountNRecharge(
            res,
            doc.card.id,
            msg,
            doc.card.currency,
            req.body.rechargeAmount,
            req.userId,
            doc._id,
            data
          );
        });
      } else if (featuresSettings.riderRechargeWalletInClientSide == true) {
        paymentCtrl.transferAmountToWallet(req, res);
      } else if (config.paymentGateway.paymentGatewayName == "razorpay") {
        paymentCtrl.transferAmountToWallet(req, res);
      }
    });
    // 1.chk User
  } else {
    return res.status(401).json({
      success: true,
      message: req.i18n.__("THIS_FEATURE_NOT_AVAILABLE"),
    });
  }
};

/**
 * Amounts In My Wallet Transaction
 * @input
 * @param
 * @return
 * @response
 */
export const myWalletHistory = (req, res) => {
  Wallet.aggregate(
    [
      { $match: { ridid: new mongoose.Types.ObjectId(req.userId) } },

      { $unwind: "$trx" },
      // { "$match": { "trx.type": "Credit" } },

      { $sort: { "trx._id": -1 } }, //working

      {
        $group: {
          _id: "$_id",
          transaction: {
            $push: {
              _id: "$trx._id",
              trxid: "$trx.trxid",
              amt: "$trx.amt",
              date: "$trx.date",
              type: "$trx.type",
            },
          },
        },
      },
    ],
    function (err, docs) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (docs.length) {
        return res.status(200).json({
          success: true,
          message: req.i18n.__("WALLET_DETAILS"),
          transaction: docs[0].transaction,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: req.i18n.__("NO_WALLET_DETAILS_FOUND"),
        });
      }
    }
  );
};

/**
 * Amounts In My Wallet Transaction / Credits
 * @input
 * @param
 * @return
 * @response
 */
export const myWalletCreditHistory = (req, res) => {
  Wallet.aggregate(
    [
      { $match: { ridid: new mongoose.Types.ObjectId(req.userId) } },

      { $unwind: "$trx" },
      { $match: { "trx.type": { $regex: /^Credit$/i } } },

      { $sort: { "trx._id": -1 } }, //working

      {
        $group: {
          _id: "$_id",
          transaction: {
            $push: {
              trxid: "$trx.trxid",
              amt: "$trx.amt",
              date: "$trx.date",
              type: "$trx.type",
            },
          },
        },
      },
    ],
    function (err, docs) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (docs.length) {
        return res.status(200).json({
          success: true,
          message: req.i18n.__("WALLET_DETAILS"),
          transaction: docs[0].transaction,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: req.i18n.__("NO_WALLET_DETAILS_FOUND"),
        });
      }
    }
  );
};

/**
 * Amounts In My Wallet Transaction / Debit
 * @input
 * @param
 * @return
 * @response
 */
export const myWalletDebitHistory = (req, res) => {
  Wallet.aggregate(
    [
      { $match: { ridid: new mongoose.Types.ObjectId(req.userId) } },

      { $unwind: "$trx" },
      { $match: { "trx.type": { $regex: /^Debit$/i } } },

      { $sort: { "trx._id": -1 } }, //working

      {
        $group: {
          _id: "$_id",
          transaction: {
            $push: {
              trxid: "$trx.trxid",
              amt: "$trx.amt",
              date: "$trx.date",
              type: "$trx.type",
            },
          },
        },
      },
    ],
    function (err, docs) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (docs.length) {
        return res.status(200).json({
          success: true,
          message: req.i18n.__("WALLET_DETAILS"),
          transaction: docs[0].transaction,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: req.i18n.__("NO_WALLET_DETAILS_FOUND"),
        });
      }
    }
  );
};

/**
 * Amounts In My Wallet
 * @input
 * @param
 * @return
 * @response
 */
export const myWallet = (req, res) => {
  Wallet.find({ ridid: req.userId }).exec((err, docs) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    }
    if (docs.length) {
      var bal = docs[0].bal;
      return res.status(200).json({
        success: true,
        message: req.i18n.__("WALLET_DETAILS"),
        balance: bal.toFixed(2),
      });
    } else {
      return res.status(200).json({
        success: true,
        message: req.i18n.__("NO_WALLET_DETAILS_FOUND"),
        balance: "0",
      });
    }
  });
};

/**
 * Validate Promo
 * @input
 * @param
 * @return
 * @response
 */
export const validatePromo = async (req, res) => {
  Promo.find({ code: req.body.promoCode, status: true }).exec(
    async (err, docs) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      if (!docs.length)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("INVALID_CODE"),
          discountAmt: 0,
        }); //No Code Found

      var isValidCode = true;

      if (
        featuresSettings.isCityWise &&
        req.body.pickupLng &&
        req.body.pickupLat
      ) {
        var scId = [];
        var pickUpPoint = [req.body.pickupLng, req.body.pickupLat];
        var serviceExists = await checkPickupPointsServiceId(pickUpPoint);
        var data = _.map(docs[0].scIds, (el) => {
          var exists = _.includes(
            [serviceExists.pickupCity, "Default"],
            el.name
          );
          if (exists) scId.push(el.scId);
        });
        if (scId.length == 0)
          return res.status(409).json({
            success: false,
            message: req.i18n.__("INVALID_CODE_FOR_THIS_CITY"),
            discountAmt: 0,
          }); //Code Not available for requested city
      }

      if (req.body.tripType) {
        var tripType = docs[0].tripType;
        if (tripType && tripType.length) {
          var isTripTypeInclude = _.includes(tripType, req.body.tripType);
          if (!isTripTypeInclude)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("CODE_NOT_VALID_FOR_THIS_TRIP"),
              discountAmt: 0,
            }); //Code Not available for requested city
        }
      }

      //Check Used
      var noofuse = docs[0].noofuse;
      if (noofuse) {
        if (docs[0].used >= noofuse)
          return res.status(409).json({
            success: false,
            message: req.i18n.__("INVALID_CODE_USAGE"),
            discountAmt: 0,
          }); //Code Usage Exceeds
      }

      //Is User Already Used
      if (req.body.userId != undefined || typeof req.body.userId != "undefined")
        req.userId = req.body.userId;
      if (docs[0].users.includes(req.userId)) {
        var perUsageLimit = docs[0].perUserUsage;
        var userIncluded = _.filter(
          docs[0].users.map((s) => mongoose.Types.ObjectId(s)),
          mongoose.Types.ObjectId(req.userId)
        );
        if (userIncluded.length >= perUsageLimit)
          return res.status(409).json({
            success: false,
            message: req.i18n.__("USAGE_LIMIT_EXCEEDED"),
            discountAmt: 0,
          });
      }

      //Is User Already Used
      /* 		if (docs[0].users.includes(req.userId)) {
          return res.status(409).json({ 'success': false, 'message':req.i18n.__("INVALID_CODE_USED"), "discountAmt": 0 });
        } */

      //Check Date
      var todayDate = new Date();
      var start = docs[0].start;
      var end = docs[0].end;
      if (start) {
        var isafter = moment(todayDate).isAfter(start);
        if (!isafter)
          return res.status(409).json({
            success: false,
            message: req.i18n.__("INVALID_CODE_ACTIVE"),
            discountAmt: 0,
          }); //Code Not Yet Started
      }
      if (end) {
        end = moment(end).add(1, "days");
        var isBefore = moment(todayDate).isBefore(end);
        if (!isBefore)
          return res.status(409).json({
            success: false,
            message: req.i18n.__("INVALID_CODE_EXPIRED"),
            discountAmt: 0,
          }); //Expired
      }

      //Check Time
      var startTime = docs[0].startTime;
      var endTime = docs[0].endTime;
      if (startTime != "" && endTime != "") {
        if (startTime != "0" && endTime != "0") {
          var timearry = moment(todayDate).format("HH:mm:ss");
          timearry = GFunctions.getFormatTime(timearry);
          if (startTime > endTime) {
            // 9PM to 5 AM
            if (timearry > endTime && timearry < startTime) {
              // if like 7AM
              return res.status(409).json({
                success: false,
                message: req.i18n.__("INVALID_CODE_N/A"),
                discountAmt: 0,
              });
            }
          } else {
            //6PM to  9PM
            if (timearry > startTime && timearry < endTime) {
              // if like 7PM
            } else {
              return res.status(409).json({
                success: false,
                message: req.i18n.__("INVALID_CODE_N/A"),
                discountAmt: 0,
              });
            }
          }
        }
      }

      //Check Day
      var day = docs[0].days;
      if (day != "") {
        var curDay = moment(todayDate).format("ddd");
        if (day.indexOf(curDay) > -1) {
        } else {
          return res.status(409).json({
            success: false,
            message: req.i18n.__("INVALID_CODE_DAY"),
            discountAmt: 0,
          });
        }
      }

      //For First Ride
      var forFirst = docs[0].forFirst;
      if (forFirst) {
        Trips.findOne({ ridid: req.userId, status: "Finished" }).exec(
          (err, tripsdocs) => {
            if (err)
              return res.status(500).json({
                success: false,
                message: req.i18n.__("SOME_ERROR"),
                error: err,
              });
            if (tripsdocs)
              return res.status(409).json({
                success: false,
                message: req.i18n.__("INVALID_CODE_FIRST_TIME"),
                discountAmt: 0,
              });
            else {
              if (docs[0].amountType == "percentage") {
                if (!req.body.tripAmount || req.body.tripAmount == 0)
                  return res.status(200).json({
                    success: true,
                    message: req.i18n.__("VALID_CODE"),
                    discountAmt: docs[0].percentage + "%",
                    discountType: docs[0].amountType,
                  });
                else {
                  var tripAmount = req.body.tripAmount;
                  var discountAmt = tripAmount * (docs[0].percentage / 100);
                  return res.status(200).json({
                    success: true,
                    message: req.i18n.__("VALID_CODE"),
                    discountAmt: config.currencySymbol + discountAmt,
                    discountType: docs[0].amountType,
                  });
                }
              } else {
                return res.status(200).json({
                  success: true,
                  message: req.i18n.__("VALID_CODE"),
                  discountAmt: config.currencySymbol + docs[0].amount,
                  discountType: docs[0].amountType,
                });
              }
            }
          }
        );
      }
      //For First Ride

      if (docs[0].amountType == "percentage") {
        if (!req.body.tripAmount || req.body.tripAmount == 0)
          return res.status(200).json({
            success: true,
            message: req.i18n.__("VALID_CODE"),
            discountAmt: docs[0].percentage + "%",
            discountType: docs[0].amountType,
          });
        else {
          var tripAmount = req.body.tripAmount;
          var discountAmt = Number(tripAmount) * (docs[0].percentage / 100);
          discountAmt = Number(discountAmt).toFixed(2);
          return res.status(200).json({
            success: true,
            message: req.i18n.__("VALID_CODE"),
            discountAmt: config.currencySymbol + discountAmt,
            discountType: docs[0].amountType,
          });
        }
      } else {
        return res.status(200).json({
          success: true,
          message: req.i18n.__("VALID_CODE"),
          discountAmt: config.currencySymbol + docs[0].amount,
          discountType: docs[0].amountType,
        });
      }
    }
  );
};

export const validatePromoForEstimation = async (
  promoCode,
  userId,
  body,
  fareDetails
) => {
  try {
    var docs = await Promo.find({ code: promoCode, status: true }).exec();
    if (docs) {
      var isValidCode = true;

      if (
        featuresSettings.isCityWisee &&
        req.body.pickupLng &&
        req.body.pickupLat
      ) {
        var scId = [];
        var pickUpPoint = [body.pickupLng, body.pickupLat];
        var serviceExists = await checkPickupPointsServiceId(pickUpPoint);
        var data = _.map(docs[0].scIds, (el) => {
          var exists = _.includes(
            [serviceExists.pickupCity, "Default"],
            el.name
          );
          if (exists) scId.push(el.scId);
        });
        if (scId.length == 0) return { success: false, discountAmt: 0 }; //Code Not available for requested city
      }

      if (body.tripType) {
        var tripType = docs[0].tripType;
        if (tripType && tripType.length) {
          var isTripTypeInclude = _.includes(tripType, body.tripType);
          if (!isTripTypeInclude) return { success: false, discountAmt: 0 }; //Code Not available for requested city
        }
      }

      //Check Used
      var noofuse = docs[0].noofuse;
      if (noofuse) {
        if (docs[0].used >= noofuse) return { success: false, discountAmt: 0 };
      }

      //Is User Already Used
      if (body.userId != undefined || typeof body.userId != "undefined")
        req.userId = body.userId;
      if (docs[0].users.includes(req.userId)) {
        var perUsageLimit = docs[0].perUserUsage;
        var userIncluded = _.filter(
          docs[0].users.map((s) => mongoose.Types.ObjectId(s)),
          mongoose.Types.ObjectId(req.userId)
        );
        if (userIncluded.length >= perUsageLimit)
          return { success: false, discountAmt: 0 };
      }

      //Is User Already Used
      /*if (docs[0].users.includes(userId)) {
        return { 'success': false, "discountAmt": 0 };
      }*/

      //Check Date
      var todayDate = new Date();
      var start = docs[0].start;
      var end = docs[0].end;
      if (start) {
        var isafter = moment(todayDate).isAfter(start);
        if (!isafter) return { success: false, discountAmt: 0 };
      }
      if (end) {
        end = moment(end).add(1, "days");
        var isBefore = moment(todayDate).isBefore(end);
        if (!isBefore) return { success: false, discountAmt: 0 };
      }

      //Check Time
      var startTime = docs[0].startTime;
      var endTime = docs[0].endTime;
      if (startTime != "" && endTime != "") {
        if (startTime != "0" && endTime != "0") {
          var timearry = moment(todayDate).format("HH:mm:ss");
          timearry = GFunctions.getFormatTime(timearry);
          if (startTime > endTime) {
            // 9PM to 5 AM
            if (timearry > endTime && timearry < startTime) {
              // if like 7AM
              return { success: false, discountAmt: 0 };
            }
          } else {
            //6PM to  9PM
            if (timearry > startTime && timearry < endTime) {
              // if like 7PM
            } else {
              return { success: false, discountAmt: 0 };
            }
          }
        }
      }

      //Check Day
      var day = docs[0].days;
      if (day != "") {
        var curDay = moment(todayDate).format("ddd");
        if (day.indexOf(curDay) > -1) {
        } else {
          return { success: false, discountAmt: 0 };
        }
      }

      //For First Ride
      var forFirst = docs[0].forFirst;
      if (forFirst) {
        var tripData = await Trips.findOne({
          ridid: userId,
          status: "Finished",
        }).exec();
        if (tripData) {
          return { success: false, discountAmt: 0 };
        } else {
          if (docs[0].amountType == "percentage") {
            if (!fareDetails.totalFare || fareDetails.totalFare == 0) {
              return { success: false, discountAmt: 0 };
            } else {
              var tripAmount = fareDetails.totalFare;
              var discountAmt = tripAmount * (docs[0].percentage / 100);
              return { success: true, discountAmt: discountAmt };
            }
          } else return { success: true, discountAmt: docs[0].amount };
        } //For First Ride
      }

      if (docs[0].amountType == "percentage") {
        if (!fareDetails.totalFare || fareDetails.totalFare == 0) {
          return { success: false, discountAmt: 0 };
        } else {
          var tripAmount = fareDetails.totalFare;
          var discountAmt = tripAmount * (docs[0].percentage / 100);
          return { success: true, discountAmt: discountAmt };
        }
      } else {
        return { success: true, discountAmt: docs[0].amount };
      }
    }
  } catch (error) {
    return { success: false, discountAmt: 0 };
  }
};

//ScheduleTaxi

/** Taxi Request Schedule from User / SEND if only Not Already Booked
 * Taxi Request Schedule from User
 * @input
 * @param
 * @return
 * @response
 */
export const requestScheduleTaxi = async (req, res) => {
  var reqtripDT = req.body.tripDate + " " + req.body.tripTime;
  var newDateFormat = GFunctions.sendFormatedTime(
    req.body.tripDate,
    req.body.tripTime
  );
  var reqtripFDT = GFunctions.getISODate(newDateFormat);
  var newDateFormat = GFunctions.sendFormatedDTime(reqtripDT);
  var gmtFTime = new Date(newDateFormat + " " + "GMT+05:30").toGMTString();

  if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
    req.body.promoAmt = 0;
  }
  var promoAmt = req.body.promoAmt;
  var promoCode = req.body.promo;

  if (featuresSettings.checkAirportZone) {
    // airport fare
    let TotalAirportZoneFare = 0;
    let pickupPointAirportZone = await airportZoneFare(
      startCoords[1],
      startCoords[0]
    );
    let dropPointAirportZone = await airportZoneFare(
      endCoords[1],
      endCoords[0]
    );

    if (pickupPointAirportZone.status == true) {
      TotalAirportZoneFare =
        TotalAirportZoneFare + Number(pickupPointAirportZone.airportFare);
    }
    if (dropPointAirportZone.status == true) {
      TotalAirportZoneFare =
        TotalAirportZoneFare + Number(dropPointAirportZone.airportFare);
    }
    //update Cost value
    req.body.totalfare =
      Number(req.body.totalfare) + Number(TotalAirportZoneFare);
  }

  var newDoc = new Trips({
    triptype: "Schedule", //Ride,Schedule,Rental,Hail
    // tripno: crypto.randomBytes(5).toString('hex') , //change this logic or crypt Datetime
    date: req.body.tripShownDate,
    cpy: null,
    cpyid: null,
    dvr: null,
    dvrid: null,
    rid: req.name,
    ridid: req.userId,
    fare: req.body.totalfare,
    taxi: req.body.serviceName,
    service: req.body.serviceid,
    csp: [
      {
        //Cost split up
        base: req.body.basefare,
        dist: req.body.distance,
        distfare: req.body.distanceFare,
        time: req.body.time,
        timefare: req.body.timeFare,
        comison: "",

        promoamt: promoAmt, //AMount //if needed if valid chk and set amt
        promo: promoCode, //Validate if needed , add only valid code

        cost: req.body.totalfare,
        via: req.body.paymentMode,
      },
    ],
    dsp: [
      {
        //details split up
        start: "",
        end: "",
        from: req.body.pickupAddress,
        to: req.body.dropAddress,
        pLat: req.body.pickupLat,
        pLng: req.body.pickupLng,
        dLat: req.body.dropLat,
        dLng: req.body.dropLng,
      },
    ],
    estTime: req.body.time,
    status: "processing",
    tripDT: reqtripDT,
    utc: req.body.utc,
    tripFDT: reqtripFDT,
    gmtTime: gmtFTime,
  });
  Trips.findOne(
    { ridid: req.userId, status: "processing", tripFDT: reqtripFDT },
    function (err, docs) {
      if (err)
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      if (docs)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("REQUEST_ALREADY"),
          error: err,
        });
      newDoc.save((err, tripdata) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: err.message, err: err });
        }
        // updateRiderFbStatus(req.userId,"Processing",tripdata._id);
        requestNearbyDriversSch(tripdata, req.body, req.userId, reqtripDT);
        //Or one Driver
        return res.status(200).json({
          success: true,
          message: req.i18n.__("TAXI_REQUEST_SENT"),
          requestDetails: tripdata._id,
        });
      });
    }
  );
};

/**
 * Set Taxi Request Schedule from User
 * @input
 * @param
 * @return
 * @response
 */
function requestNearbyDriversSch(tripdata, userreq, userid, reqtripDT) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var neededService = userreq.serviceName;
  Driver.find({
    coords: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(userreq.pickupLng), parseFloat(userreq.pickupLat)],
          30 / 3963.2,
        ],
      },
    },
    online: "1",
    curStatus: "free",
    curService: neededService,
  }).exec((err, driverdata) => {
    if (err) {
      notifyRider(userid, noDriverFound, tripdata._id);
    } //Make User Know it  = update fb, change status to "waiting to accept",
    if (driverdata.length <= 0) {
      notifyRider(userid, noDriverFound, tripdata._id);
    } else {
      sendRequestToDriversSch(tripdata, userreq, driverdata, userid, reqtripDT);
    }
  });
}

/**
 * Set Taxi Request Schedule from User in Firebase
 * @input
 * @param
 * @return
 * @response
 */
function sendRequestToDriversSch(
  tripdata,
  userreq,
  driverdata,
  userid,
  reqtripDT
) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var requestData = {
    accept: {
      others: "0",
      trip_id: "0",
    },
    request: {
      drop_address: userreq.dropAddress,
      etd: userreq.time,
      picku_address: userreq.pickupAddress,
      request_id: tripdata._id,
      status: "1",
      datetime: reqtripDT,
      request_no: 0,
      request_type: "Schedule",
      review: "Taxi Request",
    },
  };

  var requestedDrivers = [];
  var arrayLength = driverdata.length; //2
  for (var i = 0; i < arrayLength; i++) {
    var child = driverdata[i]._id.toString();
    var usersRef = ref.child(child);
    requestedDrivers.push(child);
    usersRef.update(requestData, function (error) {
      if (error) {
      } else {
      } // Send FCM
    });
    if (i == arrayLength - 1)
      updateTaxiStatus(requestedDrivers, tripdata._id, userid);
  }
}

/**
 * Driver Accepted the Schedule Request
 * @input
 * @param
 * @return
 * @response
 */
export const acceptScheduleRequest = async (req, res) => {
  var update = {
    status: "accepted",
    review: "driver accepted",
    dvrid: req.userId,
    dvr: req.name,
    needClear: "no",
  };

  try {
    let docs = await Trips.findOne({
      dvrid: req.userId,
      status: "Accepted",
      tripDT: req.body.reqtripDT,
    }); // find DT
    if (!docs) {
      //Trip Get Accepted Only IF driver has no Other Trips
      Trips.findOneAndUpdate(
        { _id: req.body.requestId, status: { $not: /Accepted/ } },
        update,
        { new: true },
        (err, doc) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: req.i18n.__("SOME_ERROR"),
              error: err,
            });
          }
          if (!doc)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("REQUEST_PROCESSED"),
            });
          var index = doc.reqDvr.indexOf(req.userId);
          if (index !== -1) doc.reqDvr.splice(index, 1);
          findAndSendFCMToRider(
            doc.ridid,
            "Driver Has Accepted Your Schedule Trip Request",
            "acceptScheduleRequest"
          );
          cancelOtherTaxiRequest(doc.reqDvr, req.body.requestId, "");
          setInCRON(req.body.requestId, doc); //make
          return res.json({
            success: true,
            message: req.i18n.__("REQUEST_ACCEPTED_SUCCESSFULLY"),
            requestId: req.body.requestId,
            tripId: doc.tripno,
          });
        }
      );
      //Trip Get Accepted Only IF driver has no Other Trips
    } else {
      return res.status(409).json({
        success: false,
        message: req.i18n.__("ANOTHER_TRIP_FOR_THIS_TIME_ALREADY_EXISTS"),
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: req.i18n.__("SOME_ERROR"), error: err });
  }
};

/**
 * Set CRON
 * @input
 * @param
 * @return
 * @response
 */
function setInCRON(requestId, tripDate) {
  var newDateFormat = GFunctions.sendFormatedDTime(tripDate.tripDT);
  var gmtFTime = new Date(newDateFormat + " " + tripDate.utc).toGMTString();
  var newDoc = new Schedule({
    gmtTime: gmtFTime,
    tripid: requestId,
    schTime: tripDate.tripFDT,
    triptype: tripDate.triptype,
    status: "open",
  });
  newDoc.save((err, datas) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info("Sch Added");
    }
  });
}

/**
 * Schedule all Taxi History / Only
 * @input
 * @param
 * @return
 * @response
 */
export const riderUpcomingScheduleTaxi = (req, res) => {
  var nowdate = GFunctions.getUpcomingSchListMinusBuffer(
    config.upcomingRideLaterTimeBuffer
  );
  // var timeGMT5MinutesBefore = GFunctions.getScheduleTaxiRequestTime(config.upcomingRideLaterTimeBuffer);
  var where = {
    //, 'noresponse'
    ridid: req.userId,
    bookingType: "rideLater",
    status: { $in: ["processing"] },
    /* tripFDT: {
      "$gte": new Date().toISOString()
    }   */
    tripFDT: {
      $gte: nowdate,
    },
    // gmtTime: { $gte: timeGMT5MinutesBefore }
  };

  Trips.find(where, {
    cpy: 0,
    cpyid: 0,
    dvr: 0,
    dvrid: 0,
    csp: 0,
    rid: 0,
    ridid: 0,
    service: 0,
    needClear: 0,
    createdAt: 0,
    driverfb: 0,
    riderfb: 0,
    reqDvr: 0,
    acsp: 0,
    applyValues: 0,
  })
    .sort({ tripFDT: 1 })
    .exec((err, docs) => {
      if (err) {
        return res.status(409).json([]);
      }
      return res.json(docs);
    });
};

/**
 * Schedule all Taxi History / Only
 * @input
 * @param
 * @return
 * @response
 */
export const driverUpcomingScheduleTaxi = (req, res) => {
  var nowdate = GFunctions.getUpcomingSchListBuffer(
    config.upcomingRideLaterTimeBuffer
  );
  Trips.find(
    {
      dvrid: req.userId,
      bookingType: "rideLater",
      status: "accepted",
      tripFDT: {
        $gte: new Date().toISOString(),
      },
    },
    {
      cpy: 0,
      cpyid: 0,
      dvr: 0,
      dvrid: 0,
      csp: 0,
      rid: 0,
      ridid: 0,
      service: 0,
      needClear: 0,
      createdAt: 0,
      driverfb: 0,
      riderfb: 0,
      reqDvr: 0,
      acsp: 0,
      applyValues: 0,
    }
  ).exec((err, docs) => {
    if (err) {
      return res.status(409).json([]);
    }
    return res.json(docs);
  });
};

/**
 * Schedule Taxi Cancel Before Driver Accepted it, After Accepted
 * @input
 * @param
 * @return
 * @response
 */
export const userCancelScheduleTaxi = (req, res) => {
  var update = {
    status: "Cancelled",
    review: "user Cancelled",
  };

  Trips.findOneAndUpdate(
    { _id: req.body.requestId },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (!doc) {
        return res.json({
          success: true,
          message: req.i18n.__("NO_TAXI_SCHEDULS_FOUND"),
        });
      }
      if (doc.dvrid) {
        changeMyTripStatusMongo(doc.dvrid, "tripno", "free");
        findAndSendFCMToDriver(
          doc.dvrid,
          "Schedule Trip Cancelled By Rider",
          "userCancelScheduleTaxi"
        );
      }
      return res.json({
        success: true,
        message: req.i18n.__("TRIP_CANCELLED_SUCCESSFULLY"),
      }); //Have to send cancelation fee
    }
  );
};

/**
 * Schedule Taxi Cancel by Driver
 * @input
 * @param
 * @return
 * @response
 */
export const driverCancelScheduleTaxi = (req, res) => {
  var update = {
    status: "processing",
    review: "Driver Cancelled",
  };

  Trips.findOneAndUpdate(
    { _id: req.body.requestId },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (!doc) {
        return res.json({
          success: true,
          message: req.i18n.__("NO_TAXI_SCHEDULS_FOUND"),
        });
      }
      if (doc.ridid) {
        changeMyTripStatusMongo(doc.dvrid, doc.tripno, "free");
        findAndSendFCMToRider(
          doc.ridid,
          "Schedule Trip Cancelled By Driver",
          "driverCancelScheduleTaxi"
        );
      }
      return res.json({
        success: true,
        message: req.i18n.__("TAXI_CANCELLED_SUCCESSFULLY"),
      }); //Have to send cancelation fee
    }
  );
};

/**
 * Schedule Taxi Cancel by Driver
 * @input
 * @param
 * @return
 * @response
 */
export const cronas = (req, res) => {
  cron.schedule("*/1 * * * *", function () {
    sendSchAndTaxiReqStatus();
  });
  return res.json({ success: true, message: req.i18n.__("CRON_SETED") });
};

export const getISO = (req, res) => {
  var reqtripDT = req.body.tripDate + " " + req.body.tripTime;
  var utc = "GMT+05:30";
  var newDateFormat = GFunctions.sendFormatedTime(
    req.body.tripDate,
    req.body.tripTime
  );
  var timeISONow = GFunctions.getSCHNotificationGMTDT();
  var myDate = new Date(newDateFormat);
  var myDate = new Date("05/21/2018 12:08 PM GMT+0530").toGMTString();
  return res.json({ timeISONow: timeISONow, myDate: myDate });
};

/**
 * Send SCH Notification and Sch Taxi Request Status
 * @input
 * @param
 * @return
 * @response
 */
export const sendSchAndTaxiReqStatus = () => {
  var timeGMT1 = GFunctions.getScheduleTaxiRequestTime(config.rideLaterStart); //ON time changes (like 5min)
  var timeGMT2 = GFunctions.getScheduleTaxiRequestTime(
    config.rideLaterRemainder
  ); //Before few Mins (like 15min), send push notification remainder.
  Schedule.find(
    {
      gmtTime: { $in: [timeGMT1, timeGMT2] },
    },
    function (err, docs) {
      if (err) {
        logger.error(err);
      }
      sendSCHStartNotificationToDriver(docs, timeGMT1);
    }
  );
};

/**
 * remove From Sch After trip end
 * @input
 * @param
 * @return
 * @response
 */
export const removeFromSchedule = (tripid) => {
  Schedule.findOneAndRemove(
    {
      tripid: tripid,
    },
    function (err, data) {
      if (err) {
        logger.error(err);
      }
    }
  );
};

/**
 * Send SCH Start Notification to Driver, Rider and Trip Data
 Once Job completed, set status to open => requested,
 After Trip ended make to Empty = Del Sub Doc
 * @input
 * @param
 * @return
 * @response
 */
function sendSCHStartNotificationToDriver(allSchTrips, timeGMT1) {
  for (var i = 0; i < allSchTrips.length; i++) {
    if (timeGMT1 == allSchTrips[i].gmtTime) {
      FindAndSendRequestToDrivers(allSchTrips[i].tripid); //ON time changes
    } else {
      //Before few Mins (like 15min), send push notification remainder.
      FindAndSendNotificationToAll(allSchTrips[i].tripid);
    }
  }
}

/**
 * Get Driver and trip details and send notification
 * @input
 * @param
 * @return
 * @response
 */
function FindAndSendRequestToDrivers(tripid) {
  var updateData = {
    status: "started",
  };

  Trips.findByIdAndUpdate(
    tripid,
    updateData,
    { new: true },
    function (err, doc) {
      if (err) {
        logger.error(err);
      } else {
        addTripDatatoFb(doc);
      }
    }
  );
}

/**
 * Add Trip Data To Firebase
 * @input
 * @param
 * @return
 * @response
 */
function addTripDatatoFb(tripdata) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data");
  var requestData = {
    Drop_address: "0",
    base_fare: "0",
    cancelby: "0",
    datetime: "0",
    distance: "0",
    distance_fare: "0",
    driver_rating: "0",
    duration: "0",
    pickup_address: "0",
    rider_rating: "0",
    time_fare: "0",
    total_fare: "0",
    status: "1",
    discount: "0",
    ispay: "0",
    pay_type: "0",
    detected: "0",
    Toll_Amount: "0",
    Toll_request: "0",
    Toll_confirm: "0",
  };
  var id = tripdata.tripno;
  id = id.toString();
  var usersRef = ref.child(id);
  usersRef.update(requestData, function (snapshot) {
    // sendSCHStartRequestToDrivers(tripdata);
    // sendSCHStartAlertToRider(tripdata);
  });
}

/**
 * Set SCH Start Notification to Driver in Firebase
 * @input
 * @param
 * @return
 * @response
 */
function sendSCHStartRequestToDrivers(tripdata) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var requestData = {
    accept: {
      others: "0",
      trip_id: tripdata.tripno, //tripId
    },
    request: {
      drop_address: "0",
      etd: "0",
      picku_address: "0",
      request_id: tripdata._id,
      status: "2", // 2
      datetime: "0",
      request_type: "0", //0
      review: "0", //0
    },
  };

  var userid = tripdata.dvrid;
  var child = userid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
  findAndSendFCMToDriver(
    tripdata.dvrid,
    "You has One Scheduled Trip On this Time",
    "sendSCHStartRequestToDrivers"
  );
}

function FindAndSendNotificationToAll(tripid) {
  Trips.findOne({ _id: tripid }, { dvrid: 1, ridid: 1 }, function (err, doc) {
    if (err) {
      logger.error(err);
    }
    if (doc.dvrid) {
      findAndSendFCMToDriver(
        doc.dvrid,
        "You has One Upcoming Scheduled Trip On " + doc.tripDT + " Time",
        "sendnotification"
      );
    }
    if (doc.ridid) {
      findAndSendFCMToDriver(
        doc.ridid,
        "You has One Upcoming Scheduled Trip On " + doc.tripDT + " Time",
        "sendnotification"
      );
    }
  });
}

/**
 * Set SCH Start Notification to Rider in Firebase
 * @input
 * @param
 * @return
 * @response
 */
function sendSCHStartAlertToRider(tripdata) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");

  var requestData = {
    tripdriver: tripdata.dvrid,
    tripstatus: "Accepted",
    current_tripid: tripdata.tripno,
  };

  var userid = tripdata.ridid;
  var child = userid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
  findAndSendFCMToRider(
    tripdata.ridid,
    "You has One Scheduled Trip On this Time",
    "sendSCHStartAlertToRider"
  );
}

//ScheduleTaxi

//SafeTaxi

/**
 * Check Safe Ride Eligible
 * @input
 * @param
 * @return
 * @response
 */
export const checkSafeRideEligible = async (req, res) => {
  // var subtotal = req.body.subtotal;
  var subtotal = 0.5;
  var via = req.body.via;
  if (via == "card") {
    //Just holding to check the Card eligible
    var balanceAvail = await findNHoldExistingUserCard(req.userId, subtotal);
    if (balanceAvail.holdAmt) {
      return res.json({
        success: true,
        message: req.i18n.__("SAFE_RIDE_ELIGIBLE"),
        bal: balanceAvail.holdAmt,
      });
    } else {
      return res.json({
        success: false,
        message: req.i18n.__("SAFE_RIDE_ELIGIBLE"),
        bal: 0,
      });
    }
  } else if (via == "wallet") {
    var balanceAvail = await findAndGetBalanceInWallet(req.userId, subtotal);
    if (balanceAvail) {
      return res.json({
        success: true,
        message: req.i18n.__("SAFE_RIDE_ELIGIBLE"),
        bal: balanceAvail,
      });
    } else {
      return res.json({
        success: false,
        message: req.i18n.__("SAFE_RIDE_ELIGIBLE"),
        bal: 0,
      });
    }
  }
};

/**
 * Find Stripe = If exists hold charge and return captured amt
 * @input
 * @param
 * @return retunObj
 * @response
 */
async function findNHoldExistingUserCard(userId, amt) {
  var returnObj = {
    holdAmt: 0,
    tranxid: "",
  };
  try {
    let docs = await Rider.findById(userId);
    if (!docs) {
      return 0;
    } else {
      // var desc = "Trip -" + tripid;
      var desc = "Trip - Safe Hold";
      var res = await holdChargeCard(docs.stripe.id, desc, "USD", amt);
      if (res.success) {
        returnObj.tranxid = res.charge.id;
        returnObj.holdAmt = parseFloat(res.charge.amount) / 100;
        return returnObj;
      } else {
        return returnObj;
      }
    }
  } catch (err) {
    return 0;
  }
}

/**
 * findAndGetBalanceInWallet
 * @input
 * @param
 * @return balance in wallet
 * @response
 */
async function findAndGetBalanceInWallet(userId, amt) {
  try {
    let docs = await Wallet.findOne({ ridid: userId });
    if (!docs) {
      return 0;
    } else {
      //Wallet Available
      var walletbal = docs.bal;
      return walletbal;
    }
  } catch (err) {
    return 0;
  }
}

/**
 * Request safe taxi
 * @input
 * @param
 * @return balance in wallet
 * @response
 */
export const requestSafeTaxi = (req, res) => {

  var promoAmt = req.body.promoAmt;
  var promoCode = req.body.promo;

  var newDoc = new Trips({
    triptype: "SafeRide",
    tripno: crypto.randomBytes(5).toString("hex"), //change this logic or crypt Datatime
    date: GFunctions.sendTimeNow(),
    cpy: "",
    cpyid: "",
    dvr: "",
    dvrid: "",
    rid: req.name,
    ridid: req.userId,
    fare: req.body.totalfare,
    taxi: req.body.serviceName,
    service: req.body.serviceid,
    csp: [
      {
        //Cost split up
        base: req.body.basefare,
        dist: req.body.distance,
        distfare: req.body.distanceFare,
        time: req.body.time,
        timefare: req.body.timeFare,
        comison: "",

        promoamt: promoAmt, //AMount //if needed if valid chk and set amt
        promo: promoCode, //Validate if needed , add only valid code

        cost: req.body.totalfare,
        via: req.body.paymentMode,
      },
    ],
    dsp: [
      {
        //details split up
        start: "",
        end: "",
        from: req.body.pickupAddress,
        to: req.body.dropAddress,
        pLat: req.body.pickupLat,
        pLng: req.body.pickupLng,
        dLat: req.body.dropLat,
        dLng: req.body.dropLng,
      },
    ],
    estTime: req.body.time,
    status: "processing",
  });
  Trips.findOne(
    { ridid: req.userId, status: "processing" },
    function (err, docs) {
      if (err)
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      if (docs)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("REQUEST_ALREADY"),
          error: err,
        });
      newDoc.save((err, tripdata) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: err.message, err: err });
        }
        updateRiderFbStatus(req.userId, "Processing", tripdata._id);
        requestNearbySafeDrivers(tripdata, req.body, req.userId);
        return res.status(200).json({
          success: true,
          message: req.i18n.__("TAXI_REQUEST_SENT"),
          requestDetails: tripdata._id,
        });
      });
    }
  );
};

/**
 * Set safe Taxi Request  from User
 * @input
 * @param
 * @return
 * @response
 */
function requestNearbySafeDrivers(tripdata, userreq, userid) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var neededService = userreq.serviceName;
  Driver.find({
    coords: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(userreq.pickupLng), parseFloat(userreq.pickupLat)],
          30 / 3963.2,
        ],
      },
    },
    online: "1",
    curStatus: "free",
  }).exec((err, driverdata) => {
    if (err) {
      notifyRider(userid, noDriverFound, tripdata._id);
    } //Make User Know it  = update fb, change status to "waiting to accept",
    if (driverdata.length <= 0) {
      notifyRider(userid, noDriverFound, tripdata._id);
    } else {
      sendRequestToSafeDrivers(tripdata, userreq, driverdata, userid);
    }
  });
}

/**
 * Set safe Taxi Request  from User
 * @input
 * @param
 * @return
 * @response
 */
function sendRequestToSafeDrivers(tripdata, userreq, driverdata, userid) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var requestData = {
    accept: {
      others: "0",
      trip_id: "0",
    },
    request: {
      drop_address: userreq.dropAddress,
      etd: userreq.time,
      picku_address: userreq.pickupAddress,
      request_id: tripdata._id,
      status: "1",
      datetime: "Pickup Drunken Rider",
      request_type: "Safe",
      review: "Taxi Request",
    },
  };

  var requestedDrivers = [];
  var arrayLength = driverdata.length; //2
  for (var i = 0; i < arrayLength; i++) {
    var child = driverdata[i]._id.toString();
    var usersRef = ref.child(child);
    requestedDrivers.push(child);
    usersRef.update(requestData, function (error) {
      if (error) {
      } else {
        findAndSendFCMToDriver(child, "Safe Taxi Request", "sendrequest");
      } // Send FCM
      // if (error) {} else { requestedDrivers.push(child); } //fb is slow
    });
    if (i == arrayLength - 1)
      updateTaxiStatus(requestedDrivers, tripdata._id, userid);
  }
}

/**
 * Add Safe Payment //upload file, log file , add amount ,
 * @input
 * @param
 * @return
 * @response
 */
export const safePayment = (req, res) => {
  Trips.findOne({ _id: req.body.tripId }, function (err, docs) {
    if (err)
      return res.status(500).json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    if (!docs)
      return res
        .status(409)
        .json({ success: false, message: req.i18n.__("NO_TRIP_FOUND") });
    docs.acsp.safe = req.body.amount;
    addDriverSafePayment(docs, req.body.amount, req);
    docs.save(function (err, op) {
      if (err)
        return res.json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      return res.json({
        success: true,
        message: req.i18n.__("SAFE_AMOUNT_ADDED_SUCCESSFULLY"),
      });
    });
  });
};

/** addDriverSafePayment : addDriverSafePayment = Logic Needed To change
 * Add Detail Payment Details to Safe Driver Account
 * @input
 * @param
 * @return
 * @response tripDriverDetails
 */
function addDriverSafePayment(doc, amt, req) {
  var filepath = "";
  if (req["file"] != null) {
    filepath = req["file"].path;
  } else {
  }

  var amttopay = parseFloat(doc.acsp.cost) + parseFloat(amt);
  var details = {
    tripno: doc.tripno,
    driver: doc.dvrid,
    amttopay: doc.dvrid,
    amtpaid: amttopay.toFixed(2),
    bal: amt,
    file: filepath,
  };

  const newDoc = new SafeRide(details);
  newDoc.save((err, docs) => {
    if (err) {
    } else {
    }
  });
}

//SafeTaxi

//UberPool
export const getPool = (req, res) => {
  var array = [
    { latitude: 9.936873, longitude: 78.098899 }, //big
    { latitude: 9.924068, longitude: 78.122432 }, //vetri
  ];
  getRectangleBorders();
  return res.json();
};

export const getDistanceBttwoCords = async (slat, slon, elat, elon) => {
  var distance = 0;
  if (slat && slon && elat && elon) {
    distance = geolib.getDistance(
      { latitude: slat, longitude: slon }, //start
      { latitude: elat, longitude: elon } //end
    );
  }

  return distance;
};

function getRectangleBorders(
  slat = 0,
  slon = 0,
  elat = 0,
  elon = 0,
  dist = 1000
) {
  var shareTrip = {};
  var headingTwds = geolib.getCompassDirection(
    { latitude: slat, longitude: slon }, //R. Luther King, 2399 - Jd Clodoaldo, Cacoal - RO, 78975-000, Brazil
    { latitude: elat, longitude: elon }
  );
  headingTwds = headingTwds.exact;
  if (headingTwds.length > 2) {
    headingTwds = headingTwds.substring(1);
  }
  shareTrip.direction = headingTwds;

  var distance = geolib.getDistance(
    { latitude: slat, longitude: slon }, //start
    { latitude: elat, longitude: elon } //end
  );
  shareTrip.distance = distance;

  var initialPoint = { lat: slat, lon: slon };
  var dist = parseFloat(distance) / 2; //it will incresae Rectangle width
  var bearing = getBearing1(headingTwds);
  var oneCorner = geolib.computeDestinationPoint(initialPoint, dist, bearing);
  shareTrip.oneCorner = oneCorner;

  var bearing = getBearing2(headingTwds);
  var twoCorner = geolib.computeDestinationPoint(initialPoint, dist, bearing);
  shareTrip.twoCorner = twoCorner;


  return shareTrip;
}

function getBearing1(head) {
  switch (head) {
    case "N":
      return 45;
    case "NW":
      return 0;
      break;
    case "W":
      return 225;
      break;
    case "SW":
      return 180;
      break;
    case "S":
      return 135;
      break;
    case "SE":
      return 90;
      break;
    case "E":
      return 45;
      break;
    case "NE":
      return 0;
      break;
    default:
      return 0;
  }
}

function getBearing2(head) {
  switch (head) {
    case "N":
      return 315;
    case "NW":
      return 270;
      break;
    case "W":
      return 315;
      break;
    case "SW":
      return 270;
      break;
    case "S":
      return 225;
      break;
    case "SE":
      return 180;
      break;
    case "E":
      return 135;
      break;
    case "NE":
      return 90;
      break;
    default:
      return 0;
  }
}

export const setPool = (req, res) => {
  getRectangleBorders(9.924068, 78.122432, 9.919876, 78.101676);
  return res.json();
};

async function addToShareTripLists(
  requestId,
  availablestatus = "yes",
  driverid,
  dsp
) {
  try {
    let Driverdocs = await ShareRides.findOne({ _id: driverid });
    if (!Driverdocs) {
      var corners = getRectangleBorders(
        dsp[0].pLat,
        dsp[0].pLng,
        dsp[0].dLat,
        dsp[0].dLng
      );
      var bordersAry = [];
      bordersAry.push(corners.oneCorner);
      bordersAry.push(corners.twoCorner);
      var newDoc = new ShareRides({
        dvrid: driverid,
        available: availablestatus,
        direction: corners.direction,
        distance: corners.distance,
        tripId: requestId,

        start: {
          latitude: dsp[0].pLat,
          longitude: dsp[0].pLng,
        },
        end: {
          latitude: dsp[0].dLat,
          longitude: dsp[0].dLng,
        },
        left: corners.oneCorner,
        right: corners.twoCorner,
      });
      newDoc.save((err, datas) => {
        if (err) {
        }
      });
    } else {
    }
  } catch (err) { }
}

/**
 * [removeShareTripLists description] If trip completed
 * @param  {[type]} requestId [description]
 * @return {[type]}           [description]
 */
function removeShareTripLists(requestId) {
  ShareRides.remove({ tripId: requestId }, (err, docs) => {
    if (err) {
    }
  });
}

export const shareAvail = (req, res) => {
  findShareTaxiFirst(9.92365986513009, 78.12716322615196, 9.902627, 78.144025);
  return res.json();
};

/**
 * [findShareTaxiFirst description]
 * @param  {Number} slat [description]
 * @param  {Number} slon [description]
 * @param  {Number} elat [description]
 * @param  {Number} elon [description]
 * @param  {Number} dist [description]
 * @return {[type]}      [description]
 */
async function findShareTaxiFirst(
  slat = 0,
  slon = 0,
  elat = 0,
  elon = 0,
  dist = 1000
) {
  var shareTrip = {};
  var tripID = false;
  var headingTwds = geolib.getCompassDirection(
    { latitude: slat, longitude: slon },
    { latitude: elat, longitude: elon }
  );
  headingTwds = headingTwds.exact;
  if (headingTwds.length > 2) {
    headingTwds = headingTwds.substring(1);
  }
  shareTrip.direction = headingTwds;

  shareTrip.tripID = await findShareAvailableAndSendTripIds(
    slat,
    slon,
    elat,
    elon,
    1000,
    headingTwds
  );
  return shareTrip;
}

/**
 * [findShareAvailableAndSendTripIds description]
 * @param  {Number} slat    [description]
 * @param  {Number} slon    [description]
 * @param  {Number} elat    [description]
 * @param  {Number} elon    [description]
 * @param  {Number} dist    [description]
 * @param  {String} heading [description]
 * @return {[type]}         [description] will return Trip Id if available
 */
function findShareAvailableAndSendTripIds(
  slat = 0,
  slon = 0,
  elat = 0,
  elon = 0,
  dist = 1000,
  heading = "S"
) {
  return new Promise(function (resolve, reject) {
    var isExists = false;
    ShareRides.find({}, function (err, docs) {
      if (docs) {
        docs.forEach(function (doc) {
          isExists = isPointExistsInPoly(slat, slon, doc);
          if (isExists == true) {
            var oldShare = {};
            oldShare.tripId = doc.tripId;
            oldShare.dvrid = doc.dvrid;
            resolve(oldShare);
          }
        });

        if (isExists == false) {
          resolve(isExists);
        }
      }
    });
  });
}

/**
 * [isPointExistsInPoly description]
 * @param  {Number}  slat [description]
 * @param  {Number}  slon [description]
 * @param  {[type]}  doc  [description]
 * @return {Boolean}      [description]
 */
function isPointExistsInPoly(slat = 0, slon = 0, doc) {
  var isExists = false;
  var toSearch = [];
  toSearch.push(doc.start);
  toSearch.push(doc.left);
  toSearch.push(doc.right);
  toSearch.push(doc.end);

  isExists = geolib.isPointInside(
    { latitude: slat, longitude: slon },
    toSearch
  );
  return isExists;
}

//Admin Request Taxi in MTD
export const requestTaxiFromMTD3 = async (req, res) => {
};

/**
 * [Taxi Request from User] = Checked
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const requestTaxiFromMTD = async (req, res) => {
  if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
    req.body.promoAmt = 0;
  }
  var promoAmt = req.body.promoAmt;
  var promoCode = req.body.promo;

  if (req.body.typeR == "pack") {
    var reqTripType = "Package";
    if (req.body.newPackage == 1) {
      PackageHelpers.addPackage(req, res);
    }

    req.body.basefare = req.body.amt;
    req.body.totalfare = req.body.amt;
  } else {
    var reqTripType = "Ride";
  }

  if (featuresSettings.checkAirportZone) {
    // airport fare
    let TotalAirportZoneFare = 0;
    let pickupPointAirportZone = await airportZoneFare(
      req.body.pickupLat,
      req.body.pickupLng
    );
    let dropPointAirportZone = await airportZoneFare(
      req.body.dropLat,
      req.body.dropLng
    );

    if (pickupPointAirportZone.status == true) {
      TotalAirportZoneFare =
        TotalAirportZoneFare + Number(pickupPointAirportZone.airportFare);
    }
    if (dropPointAirportZone.status == true) {
      TotalAirportZoneFare =
        TotalAirportZoneFare + Number(dropPointAirportZone.airportFare);
    }
    //update Cost value
    req.body.totalfare =
      Number(req.body.totalfare) + Number(TotalAirportZoneFare);
  }

  var newDoc = new Trips({
    triptype: reqTripType,
    date: GFunctions.sendTimeNow(),
    cpy: "",
    cpyid: "",
    dvr: null,
    dvrid: null,
    rid: req.body.userName,
    ridid: req.body.userId,
    fare: req.body.totalfare,
    taxi: req.body.serviceName,
    service: req.body.serviceid,
    csp: [
      {
        //Cost split up RFCNG
        base: req.body.basefare,
        dist: req.body.distance,
        distfare: req.body.distanceFare,
        time: req.body.time,
        timefare: req.body.timeFare,
        comison: "",
        promoamt: promoAmt,
        promo: promoCode,
        cost: req.body.totalfare,
        via: req.body.paymentMode,
      },
    ],
    dsp: [
      {
        //details split up
        start: "",
        end: "",
        from: req.body.pickupAddress,
        to: req.body.dropAddress,
        pLat: req.body.pickupLat,
        pLng: req.body.pickupLng,
        dLat: req.body.dropLat,
        dLng: req.body.dropLng,
      },
    ],

    package: {
      pkname: req.body.pkname,
      amt: req.body.amt,
      minkm: req.body.minkm,
      minhr: req.body.minhr,
      pkm: req.body.pkm,
      phr: req.body.phr,
    },

    estTime: req.body.time,
    status: "processing",
  });
  //checking is this user has processing trips of type RIDE
  Trips.findOne({ ridid: req.body.userId }, function (err, docs) {
    if (err)
      return res.status(500).json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    // if (docs) return res.status(409).json({ 'success': false, 'message': 'Request Already In Process.', 'error': err });
    newDoc.save((err, tripdata) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }
      updateRiderFbStatus(req.body.userId, "Processing", tripdata._id); //processing = Req intermediate state
      if (req.body.autoAssign == "1" || req.body.autoAssign == 1) {
        requestNearbyDrivers(tripdata, req.body, req.body.userId);
      } else {
        var arrDvr = [];
        arrDvr.push({
          _id: req.body.driverId,
        });
        sendRequestToDrivers(tripdata, req.body, arrDvr, req.body.userId);
      }
      return res.status(200).json({
        success: true,
        message: req.i18n.__("TAXI_REQUEST_SENT"),
        requestDetails: tripdata._id,
      });
    });
  });
};

/** Taxi Request Schedule from User / SEND if only Not Already Booked
 * Taxi Request Schedule from User
 * @input
 * @param
 * @return
 * @response
 */
export const requestScheduleTaxiFromMTD = async (req, res) => {

  var reqtripDT = req.body.tripDate + " " + req.body.tripTime;
  var newDateFormat = GFunctions.sendFormatedTime(
    req.body.tripDate,
    req.body.tripTime
  );
  var reqtripFDT = GFunctions.getISODate(newDateFormat);

  var newDateFormat = GFunctions.sendFormatedDTime(reqtripDT);
  var gmtFTime = new Date(newDateFormat + " " + "GMT+05:30").toGMTString();

  if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
    req.body.promoAmt = 0;
  }
  var promoAmt = req.body.promoAmt;
  var promoCode = req.body.promo;

  if (featuresSettings.checkAirportZone) {
    // airport fare
    let TotalAirportZoneFare = 0;
    let pickupPointAirportZone = await airportZoneFare(
      req.body.pickupLat,
      req.body.pickupLng
    );
    let dropPointAirportZone = await airportZoneFare(
      req.body.dropLat,
      req.body.dropLng
    );

    if (pickupPointAirportZone.status == true) {
      TotalAirportZoneFare =
        TotalAirportZoneFare + Number(pickupPointAirportZone.airportFare);
    }
    if (dropPointAirportZone.status == true) {
      TotalAirportZoneFare =
        TotalAirportZoneFare + Number(dropPointAirportZone.airportFare);
    }
    //update Cost value
    req.body.totalfare =
      Number(req.body.totalfare) + Number(TotalAirportZoneFare);
  }

  var newDoc = new Trips({
    triptype: "Schedule", //Ride,Schedule,Rental,Hail
    // tripno: crypto.randomBytes(5).toString('hex') , //change this logic or crypt Datetime
    date: GFunctions.sendTimeNow(),
    cpy: null,
    cpyid: null,
    dvr: null,
    dvrid: null,
    rid: req.body.userName,
    ridid: req.body.userId,
    fare: req.body.totalfare,
    taxi: req.body.serviceName,
    service: req.body.serviceid,
    csp: [
      {
        //Cost split up
        base: req.body.basefare,
        dist: req.body.distance,
        distfare: req.body.distanceFare,
        time: req.body.time,
        timefare: req.body.timeFare,
        comison: "",

        promoamt: promoAmt, //AMount //if needed if valid chk and set amt
        promo: promoCode, //Validate if needed , add only valid code

        cost: req.body.totalfare,
        via: req.body.paymentMode,
      },
    ],
    dsp: [
      {
        //details split up
        start: "",
        end: "",
        from: req.body.pickupAddress,
        to: req.body.dropAddress,
        pLat: req.body.pickupLat,
        pLng: req.body.pickupLng,
        dLat: req.body.dropLat,
        dLng: req.body.dropLng,
      },
    ],
    estTime: req.body.time,
    status: "processing",
    tripDT: reqtripDT,
    utc: "GMT+05:30",
    tripFDT: reqtripFDT,
    gmtTime: gmtFTime,
  });
  Trips.findOne(
    { ridid: req.body.userId, status: "processing", tripFDT: reqtripFDT },
    function (err, docs) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: req.i18n.__("SOME_ERROR"),
          error: err,
        });
      }
      if (docs)
        return res.status(409).json({
          success: false,
          message: req.i18n.__("REQUEST_ALREADY"),
          error: err,
        });
      newDoc.save((err, tripdata) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: err.message, err: err });
        }

        if (req.body.autoAssign == "1" || req.body.autoAssign == 1) {
          requestNearbyDriversSch(
            tripdata,
            req.body,
            req.body.userId,
            reqtripDT
          );
        } else {
          var arrDvr = [];
          arrDvr.push({
            _id: req.body.driverId,
          });
          sendRequestToDriversSch(
            tripdata,
            req.body,
            arrDvr,
            req.body.userId,
            reqtripDT
          );
        }

        return res.status(200).json({
          success: true,
          message: req.i18n.__("TAXI_REQUEST_SENT"),
          requestDetails: tripdata._id,
        });
      });
    }
  );
};

//Admin Request Taxi in MTD

//CRON to send request to Drivers
/**
 * CRON to send request to Drivers
 * @input
 * @param
 * @return
 * @response
 */
export const sendScheduleTaxiRequestToDriver = () => {
  var timeGMT10MinutesBefore = GFunctions.getScheduleTaxiRequestTime(
    config.redtaxisettings.connectDailyTripBefore
  );
  var timeGMT5MinutesBefore = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectDailyTripBefore) - 5
  );
  var timeGMT5MinutesBefore1 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectDailyTripBefore) - 10
  );
  console.log("=====timeGMT10MinutesBefore==",timeGMT10MinutesBefore)
  console.log("=====timeGMT5MinutesBefore==",timeGMT5MinutesBefore)
  console.log("=====timeGMT5MinutesBefore1==",timeGMT5MinutesBefore1)
  Trips.find(
    {
      bookingType: { $in: ["rideLater"] },
      triptype: "daily",
      // status: { $in: ['noresponse', 'processing']  },
      $or: [
        { review: constantsValues.cancelTaxiByDriver },
        { status: { $in: ["noresponse", "processing"] } },
      ],
      gmtTime: {
        $in: [
          timeGMT10MinutesBefore,
          timeGMT5MinutesBefore,
          timeGMT5MinutesBefore1,
        ],
      },
    },
    function (err, docs) {
      if (docs) {
        docs.forEach(async function (doc) {
          var isRiderCurrentlyFreeToTakeNew = await isRiderCurrentlyFree(
            doc.ridid
          );
          if (isRiderCurrentlyFreeToTakeNew) {
            let userreq = {};
            let userId = doc.ridid,
              pickupLng = doc.dsp.startcoords[0],
              pickupLat = doc.dsp.startcoords[1],
              serviceType = doc.vehicle;

            if (requestTypeMethod == "onebyone") {
              findNearbyDriversAndSendRequest(
                doc,
                userreq,
                userId,
                pickupLng,
                pickupLat,
                serviceType
              ); //For One By One
            } else {
              //requestNearbyDrivers(tripdata, body, req.userId);
            }
          } else {
          }
        });
      } else {
      }
    }
  );
};

export const retryNoResponseRequestApp = async (req, res) => {
  Trips.find(
    {
      _id: req.body.tripRequestId,
      status: { $in: ["noresponse", "Cancelled"], dvrid: null },
    },
    function (err, doc) {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      if (!doc)
        return res
          .status(409)
          .json({ success: false, message: req.i18n.__("NO_TRIP_FOUND") });
      else {
        let userreq = {};
        let userId = doc.ridid,
          pickupLng = doc.startcoords[1],
          pickupLat = doc.startcoords[0],
          serviceType = doc.vehicle;

        if (requestTypeMethod == "onebyone") {
          findNearbyDriversAndSendRequest(
            doc,
            userreq,
            userId,
            pickupLng,
            pickupLat,
            serviceType
          ); //For One By One
        } else {
          //requestNearbyDrivers(tripdata, body, req.userId);
        }
        return res.status(200).json({
          success: false,
          message: req.i18n.__("TRIP_REQUEST_RETRYING"),
        });
      }
    }
  );
};

/**
 * Driver Earnings = total,daily,weekly,monthly,yearly
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const driverEarningsReport = async (req, res) => {
  var date;
  var baseData = "tripFDT"; //  tripFDT/createdAt
  date = moment().format("YYYY-MM-DD");

  if (req.body._page > 1) {
    date = moment()
      .subtract(parseInt(req.body._page - 1) + 9, "days")
      .format("YYYY-MM-DD");
  }

  var currentDate = moment(date).add(1, "days").format("YYYY-MM-DD");
  var pastDate1 = moment(date).subtract(1, "days").format("YYYY-MM-DD");
  var pastDate2 = moment(pastDate1).subtract(1, "days").format("YYYY-MM-DD");
  var pastDate3 = moment(pastDate2).subtract(1, "days").format("YYYY-MM-DD");
  var pastDate4 = moment(pastDate3).subtract(1, "days").format("YYYY-MM-DD");
  var pastDate5 = moment(pastDate4).subtract(1, "days").format("YYYY-MM-DD");
  var pastDate6 = moment(pastDate5).subtract(1, "days").format("YYYY-MM-DD");
  var pastDate7 = moment(pastDate6).subtract(1, "days").format("YYYY-MM-DD");
  var pastDate8 = moment(pastDate7).subtract(1, "days").format("YYYY-MM-DD");
  var pastDate9 = moment(pastDate8).subtract(1, "days").format("YYYY-MM-DD");

  var driverId = new mongoose.Types.ObjectId(req.userId);
  var groupbyval = {
    _id: "$driver",
    amttopay: { $sum: "$amttopay" },
    commision: { $sum: "$commision" },
    nos: { $sum: 1 },
  };
  var day1 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(date), $lte: new Date(currentDate) },
    },
  };
  var day2 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate1), $lte: new Date(date) },
    },
  };
  var day3 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate2), $lte: new Date(pastDate1) },
    },
  };
  var day4 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate3), $lte: new Date(pastDate2) },
    },
  };
  var day5 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate4), $lte: new Date(pastDate3) },
    },
  };
  var day6 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate5), $lte: new Date(pastDate4) },
    },
  };
  var day7 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate6), $lte: new Date(pastDate5) },
    },
  };
  var day8 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate7), $lte: new Date(pastDate6) },
    },
  };
  var day9 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate8), $lte: new Date(pastDate7) },
    },
  };
  var day10 = {
    $match: {
      driver: driverId,
      createdAt: { $gte: new Date(pastDate9), $lte: new Date(pastDate8) },
    },
  };

  var promisesToMake = [
    myEarningsDriver(day1, groupbyval, date),
    myEarningsDriver(day2, groupbyval, pastDate1),
    myEarningsDriver(day3, groupbyval, pastDate2),
    myEarningsDriver(day4, groupbyval, pastDate3),
    myEarningsDriver(day5, groupbyval, pastDate4),
    myEarningsDriver(day6, groupbyval, pastDate5),
    myEarningsDriver(day7, groupbyval, pastDate6),
    myEarningsDriver(day8, groupbyval, pastDate7),
    myEarningsDriver(day9, groupbyval, pastDate8),
    myEarningsDriver(day10, groupbyval, pastDate9),
  ];
  var promises = Promise.all(promisesToMake);
  promises
    .then(function (results) {
      var filtered = results.filter(function (el) {
        if (
          featuresSettings.isChangeResToCorresLang &&
          req.headers["accept-language"] == "es"
        ) {
          if (el != null) {
            var date = el.date;
            var split = date.split(" ");
            var monthName = getResBasedOnLanguage(split[0]);
            el.date = monthName + " " + split[1] + " " + split[2];
          }
        }
        return el != null;
      });
      return res.json(filtered);
    })
    .catch(function (error) {
      return res.status(409).json(error);
    });
};

export const getResBasedOnLanguage = (month) => {
  if (month == "January" || month == "JAN") return "Enero";
  if (month == "February" || month == "FEB") return "Febrero";
  if (month == "March" || month == "MAR") return "Marcha";
  if (month == "April" || month == "APR") return "Abril";
  if (month == "May" || month == "MAY") return "Mayo";
  if (month == "June" || month == "JUN") return "Junio";
  if (month == "July" || month == "JUl") return "Mes de julio";
  if (month == "August" || month == "AUG") return "Agosto";
  if (month == "September" || month == "SEP") return "Septiembre";
  if (month == "October" || month == "OCT") return "Octubre";
  if (month == "November" || month == "NOV") return "Noviembr";
  if (month == "December" || month == "DEC") return "Diciembre";
};

/**
 *
 * @param {*} cityName
 * returns _id if cityName available in serviceavailablecities { city or in nearby array} else null
 */
export const getIsServiceAvailableInGivenCity = (data) => {
  var locationToFind = [];
  locationToFind[1] = parseFloat(data.pickupLat);
  locationToFind[0] = parseFloat(data.pickupLng);
  var tcf = [];
  tcf[0] = locationToFind;
  var ObjectToReturn;
  return new Promise((resolve, reject) => {
    // ServiceAvailableCities.index( { location : "2dsphere" } );
    ServiceAvailableCities.findOne(
      {
        geometry: {
          $geoIntersects: {
            $geometry: { type: "Point", coordinates: locationToFind },
          },
        },
      },
      // { geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: locationToFind } } } }
      {},
      function (err, data) {
        if (err) {
          reject(
            (ObjectToReturn = {
              success: false,
              data: err,
            })
          );
        } else {
          resolve(
            (ObjectToReturn = {
              success: true,
              data: data,
            })
          );
        }
      }
    );
  });
};

export const getRentalPackage = async (req, res) => {
  try {
    var where = {};
    // var cityData = await getIsServiceAvailableInGivenCity(req.body);
    req.body.rentalPackage = true;
    var cityData = await checkServiceAvailableInThisPoints(req, res);
    if (cityData.success == false) {
      return res.status(409).json({
        success: false,
        message: cityData.message,
        outstation: true,
        phone: cityData.phone,
      });
    }
    if (cityData.data != null) {
      where = { "scIds.name": { $in: [cityData.data, "Default"] } };
    } else {
      where = { "scIds.name": { $in: ["Default"] } };
    }
    RentalPackage.find(where)
      .cache(0, "RENTALPACKAGE-CACHE-KEY")
      .exec((err, packages) => {
        if (err)
          return res.status(500).json({
            success: false,
            message: req.i18n.__("SERVER_ERROR"),
            error: err,
          });
        if (packages)
          return res.status(200).json({
            success: true,
            message: req.i18n.__("DETAILS_FETCHED_SUCCESSFULY"),
            data: packages,
          });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.i18n.__("SERVER_ERROR"),
      error: error,
    });
  }
};

//Clear trip
export const clearNoEndedtrips = async (req, res) => {
  try {
    var uptoDate = moment()
      .subtract(10, "days")
      .utcOffset(config.utcOffset)
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let TotTrips = await Trips.find({
      tripFDT: { $lte: uptoDate },
      status: { $in: ["processing", "Progress"] },
    });
    return res.status(200).json({
      success: false,
      message: req.i18n.__("SERVER_ERROR"),
      error: TotTrips,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: req.i18n.__("SERVER_ERROR"),
      error: error,
    });
  }

  /* try {
    var uptoDate = moment().subtract(10, "days").utcOffset(config.utcOffset).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let TotTripsLikeQuery = { "tripFDT": { "$lte": uptoDate }, "status": { $in: ["processing", "Progress"] } };
    Trips.updateMany(TotTripsLikeQuery, { $set: { status: "noresponse" } })
    return res.status(200).json({ 'success': false, 'message': 'Error on the server.', "error": TotTripsLikeQuery });
  } catch (error) {
    return res.status(500).json({ 'success': false, 'message': 'Error on the server.', "error": error });
  } */
};

//Package Flow

//Request
/**
 * [Taxi Request from User] = Checked
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const requestRentalTaxi = async (req, res) => {
  try {
    const body = req.body || {};
    var ServiceId = { ScId: null, pickupCity: "" };

    // if ((body.vehicleDetailsAndFare['fareDetails']['acneeded']).toString() == "false" || !body.vehicleDetailsAndFare['fareDetails']['acneeded']) acneeded = "false";

    /*if (!body.promo == "") {
      var promoAmtData = await Promo.findOne({ code: body.promo }, { amount: 1, code: 1 }).exec();
      if (promoAmtData) {
        body.promoAmt = promoAmtData.amount;
        var tripType = promoAmtData.tripType;
        if (tripType && tripType.length) {
          var isTripTypeIncludes = _.includes(tripType, body.tripType);
          if (!isTripTypeIncludes) return res.status(409).json({ 'success': false, 'message': req.i18n.__("CODE_NOT_VALID_FOR_THIS_TRIP"), "discountAmt": 0 }); //Code Not available for requested city
        }
        if (promoAmtData.amountType == "percentage") {
          var tripAmount = totalFare;
          var discountAmt = tripAmount * (promoAmtData.percentage / 100);
          if (discountAmt > promoAmtData.percentageAmountLimit) body.promoAmt = promoAmtData.percentageAmountLimit;
          else body.promoAmt = discountAmt;
        }
      }
    }*/

    var pickupLatlng = [];
    pickupLatlng[0] = body.pickupLng;
    pickupLatlng[1] = body.pickupLat;

    if (featuresSettings.isCityWise) {
      ServiceId = await checkPickupPointsServiceId(pickupLatlng);
      var updateRiderScId = await Rider.findOneAndUpdate(
        { _id: req.userId },
        { scId: ServiceId.ScId, scity: ServiceId.pickupCity }
      );
    }

    /* 		//GDM
        if (body.pickupLat) {
          const from = body.pickupLat + ',' + body.pickupLng;
          const to = body.dropLat + ',' + body.dropLng;
          var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
          if (config.distanceUnit == 'Miles') {
            var distanceInUnit = parseFloat(gdmResult.distanceValue * 0.000621371).toFixed(2);
          } else {
            var distanceInUnit = parseFloat(gdmResult.distanceValue / 1000).toFixed(2);
          }
          var timeInMinutes = parseFloat(gdmResult.timeValue / 60).toFixed(2);
          distanceUnit = config.distanceSymbol ? config.distanceSymbol : ' KM';
          gdmResult.distanceLable = packagaDoc.distance + distanceUnit;
          gdmResult.startCords = [body.pickupLng, body.pickupLat];
          gdmResult.endcoords = [body.dropLng, body.dropLat];
        }
        //GDM   */

    let vehicleTypeDocs = await Vehicle.findById(body.vehicleTypeId);
    let packageDoc = await RentalPackage.findById(body.packageId, {
      name: 1,
      distance: 1,
      duration: 1,
      price: 1,
      mini: 1,
      suv: 1,
      sedan: 1,
      fixedRate: 1,
    }).lean();

    var specfVehicleRentFare = null;
    specfVehicleRentFare = _.find(packageDoc.fixedRate, {
      name: vehicleTypeDocs["type"],
    });
    if (specfVehicleRentFare) specfVehicleRentFare = specfVehicleRentFare.rate;

    var fareBeforeTax = getRentalEstimationFare(
      packageDoc.distance,
      vehicleTypeDocs.bkm,
      vehicleTypeDocs.baseFare,
      0,
      0,
      0,
      packageDoc.duration,
      vehicleTypeDocs.packageTimeRate,
      specfVehicleRentFare
    );

    var pickupCharge = body.manualPickupCharge
      ? body.manualPickupCharge
      : vehicleTypeDocs.conveyancePerKm;
    //update Cost value
    fareBeforeTax = Number(fareBeforeTax) + Number(pickupCharge);
    var taxAmount = (
      (parseFloat(vehicleTypeDocs.taxPercentage) * parseFloat(fareBeforeTax)) /
      100
    ).toFixed(2);
    var totalFare = (parseFloat(taxAmount) + parseFloat(fareBeforeTax)).toFixed(
      2
    );

        //safe  Ride  or Two Drivers Request//
        if (req.body.safeRide == "false") {
          var safeRideDataObj = { safeRidestatus: false };
        }
        if (req.body.safeRide == false) {
          var safeRideDataObj = { safeRidestatus: false };
        }

    if (!body.promo == "") {
      var promoAmtData = await Promo.findOne(
        { code: body.promo },
        { amount: 1, code: 1 }
      ).exec();
      if (promoAmtData) {
        body.promoAmt = promoAmtData.amount;
        var tripType = promoAmtData.tripType;
        if (tripType && tripType.length) {
          var isTripTypeIncludes = _.includes(tripType, body.tripType);
          if (!isTripTypeIncludes)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("CODE_NOT_VALID_FOR_THIS_TRIP"),
              discountAmt: 0,
            }); //Code Not available for requested city
        }
        if (promoAmtData.amountType == "percentage") {
          var tripAmount = totalFare;
          var discountAmt = tripAmount * (promoAmtData.percentage / 100);
          if (discountAmt > promoAmtData.percentageAmountLimit)
            body.promoAmt = promoAmtData.percentageAmountLimit;
          else body.promoAmt = discountAmt;
        }
      }
    }

    if (!req.body.safeRide || req.body.safeRide == "false" || req.body.safeRide == false) {
      var safeRideDataObj = { safeRidestatus: false };
    }

    var riderDoc = null;
    if (body.bookingType == "rideLater") {
      riderDoc = await Rider.findById(req.userId).exec();
    }
    // var TripCode = await generateTripCode(ServiceId.ScId)

    var newDoc = new Trips({
      // tripno: await TripHelpers.getTripNo(),
      // tripCode: TripCode,
      safeRideData: safeRideDataObj,
      requestFrom: body.requestFrom,
      requestId: body.adminId ? body.adminId : "",
      triptype: body.tripType,
      bookingType: body.bookingType,
      bookingFor: body.bookingFor,
      notes: body.notesToDriver ? body.notesToDriver : "",
      other: {
        ph: body.otherPh ? body.otherPh : "",
        phCode: body.otherPhCode ? body.otherPhCode : "",
        name: body.otherName ? body.otherName : "",
      },
      date: req.body.tripShownDate,
      cpy: null,
      cpyid: null,
      dvr: null,
      dvrid: null,
      rid: req.name,
      ridid: req.userId,
      hotelid: req.body.hotelId ? req.body.hotelId : null,
      fare: totalFare,
      vehicle: vehicleTypeDocs.type,
      service: vehicleTypeDocs._id,
      paymentMode: body.paymentMode,
      csp: {
        //Cost split up RFCNG
        base: vehicleTypeDocs.baseFare,
        dist: packageDoc.distance,
        distfare: fareBeforeTax, //this is basefare
        perKmRate: vehicleTypeDocs.bkm,
        time: packageDoc.duration,
        timefare: vehicleTypeDocs.timeFare,
        comison: vehicleTypeDocs.comison,
        promoamt: body.promoAmt,
        promo: body.promo,
        cost: totalFare,
        conveyance: pickupCharge,
        fareBeforeTax: fareBeforeTax,
        tax: taxAmount,
        taxPercentage: vehicleTypeDocs.taxPercentage,
        via: body.paymentMode,
        driverCancelFee: vehicleTypeDocs.cancelationFeesDriver,
        riderCancelFee: vehicleTypeDocs.cancelationFeesRider,
        isNight: false, //TODO
        isPeak: false, //TODO
        nightPer: 1, //TODO
        peakPer: 1, //TODO
        currency: config.currency, //TODO
        hotelcommision: 0, //TODO
        packageId: body.packageId,
        packageName: packageDoc.name,
      },
      dsp: {
        distanceKM: packageDoc.distance + " KM",
        estTime: packageDoc.duration + " Hrs",
        start: req.body.pickupAddress,
        end: "",
        startcoords: pickupLatlng ? pickupLatlng : null,
        endcoords: null,
      },
      estTime: packageDoc.duration + " Hrs",
      status: "processing",
      tripOTP: [
        GFunctions.sendRandomizeCode("0", 4),
        GFunctions.sendRandomizeCode("0", 4),
      ],
      scId: ServiceId.ScId,
      scity: ServiceId.pickupCity,
      tripDT: body.tripDT,
      utc: body.utc,
      tripFDT: body.tripFDT,
      gmtTime: body.gmtTime,
      noofseats: body.noofseats,
    });

    newDoc.save((err, tripdata) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }
      if (tripdata) {
        updatesafeRideDataInFB(tripdata, safeRideDataObj.safeRidestatus);
      }
      var msg = "TAXI_REQUEST_SENT";
      if (body.bookingType != "rideLater") {
        updateRiderFbStatus(
          req.userId,
          "Processing",
          tripdata._id,
          body.tripType
        ); //processing = Req intermediate state

        if (requestTypeMethod == "onebyone") {
          findNearbyDriversAndSendRequest(
            tripdata,
            body,
            req.userId,
            body.pickupLng,
            body.pickupLat,
            body.serviceType
          ); //For One By One
        } else {
          requestNearbyDrivers(tripdata, body, req.userId);
        }
      } else if (body.bookingType == "rideLater") {
        var msg = "RENTAL_TAXI_REQUEST_SENT";
        // setInCRON(tripdata._id, tripdata);

        if (body.bookingType == "rideLater" && riderDoc) {
          findAndSendFCMToRider(
            req.userId,
            "Your Ride Later request received,we will assign Driver before Trip Time.",
            "rideLaterReceived"
          );
          smsGateway.sendSmsMsg(
            riderDoc.phone,
            "",
            riderDoc.phcode,
            "",
            "rideLaterReceived",
            { TRIPNO: tripdata.tripno }
          );
        }

        if (body.processNow) {
          // updateRiderFbStatus(req.userId, "Processing", tripdata._id, body.tripType); //processing = Req intermediate state
          findNearbyDriversAndSendRequest(
            tripdata,
            body,
            req.userId,
            body.pickupLng,
            body.pickupLat,
            body.serviceType
          ); //For One By One
        }
      }

      findAndSendFCMToAllAdmin(
        "newRequest",
        "New Trip Request Rental, " + tripdata.tripno
      );

      return res.status(200).json({
        success: true,
        message: req.i18n.__(msg),
        requestDetails: tripdata._id,
        tripId: tripdata.tripno,
      });
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
};

export const sendScheduleRentalTaxiRequestToDriver = () => {
  var timeGMTBefore1 = GFunctions.getScheduleTaxiRequestTime(
    config.redtaxisettings.connectRentalTripBefore
  ); //at b4 30
  var timeGMTBefore2 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectRentalTripBefore) - 5
  ); //at 25
  var timeGMTBefore3 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectRentalTripBefore) - 10
  ); //at 20
  var timeGMTBefore3 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectRentalTripBefore) - 15
  ); //at 15
  var timeGMTBefore4 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectRentalTripBefore) - 20
  ); //at 10

  Trips.find(
    {
      bookingType: { $in: ["rideLater"] },
      triptype: "rental",
      $or: [
        { review: constantsValues.cancelTaxiByDriver },
        { status: { $in: ["noresponse", "processing"] } },
      ],
      // status: { $in: ['noresponse', 'processing'] },
      gmtTime: {
        $in: [timeGMTBefore1, timeGMTBefore2, timeGMTBefore3, timeGMTBefore4],
      },
    },
    function (err, docs) {
      if (docs) {
        docs.forEach(async function (doc) {
          var isRiderCurrentlyFreeToTakeNew = await isRiderCurrentlyFree(
            doc.ridid
          );
          if (isRiderCurrentlyFreeToTakeNew) {
            let userreq = {};
            let userId = doc.ridid,
              pickupLng = doc.dsp.startcoords[0],
              pickupLat = doc.dsp.startcoords[1],
              serviceType = doc.vehicle;

            if (requestTypeMethod == "onebyone") {
              findNearbyDriversAndSendRequest(
                doc,
                userreq,
                userId,
                pickupLng,
                pickupLat,
                serviceType
              ); //For One By One
            } else {
              //requestNearbyDrivers(tripdata, body, req.userId);
            }
          }
        });
      }
    }
  );
};

export const sendScheduleTaxiNoResponseToRider = () => {
  var timeGMTBefore1 = GFunctions.getScheduleTaxiRequestTime(); //at b4 5 min

  Trips.find(
    {
      bookingType: { $in: ["rideLater"] },
      $or: [
        { review: constantsValues.cancelTaxiByDriver },
        { status: { $in: ["noresponse"] } },
      ],
      gmtTime: { $in: [timeGMTBefore1] },
    },
    function (err, docs) {
      if (docs) {
        docs.forEach(async function (doc) {
          findAndSendFCMToRider(
            doc.ridid,
            "Your Scheduled Trip has cancelled due to Driver unavailablity, you can request later.",
            "rideLaterNoResponse"
          );
        });
      }
    }
  );
};

//requestOutstationTaxi
/**
 * [Taxi Request from User] = Checked
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const requestOutstationTaxi = async (req, res) => {
  try {
    const body = req.body || {};
    var ServiceId = { ScId: null, pickupCity: "" };

    if (featuresSettings.isCityWise) {
      var pickUp = [body.pickupLng, body.pickupLat];
      ServiceId = await checkPickupPointsServiceId(pickUp);
      var updateRiderScId = await Rider.findOneAndUpdate(
        { _id: req.userId },
        { scId: ServiceId.ScId, scity: ServiceId.pickupCity }
      );
    }

    // if ((body.vehicleDetailsAndFare['fareDetails']['acneeded']).toString() == "false" || !body.vehicleDetailsAndFare['fareDetails']['acneeded']) acneeded = "false";

    /* 		var distanceKM = 100;
        var timeInMin = 500;
        var outstationDetails = await getOutstationVehicleListWithFare(req, distanceKM, timeInMin, 'finalamount'); //Get for single vehicle
        return res.status(200).json({ 'success': false, 'message': outstationDetails });
     */
    /*if (!body.promo == "") {
      var promoAmtData = await Promo.findOne({ code: body.promo }, { amount: 1, code: 1 }).exec();
      if (promoAmtData) {
        body.promoAmt = promoAmtData.amount;
        var tripType = promoAmtData.tripType;
        if (tripType && tripType.length) {
          var isTripTypeIncludes = _.includes(tripType, body.tripType);
          if (!isTripTypeIncludes) return res.status(409).json({ 'success': false, 'message': req.i18n.__("CODE_NOT_VALID_FOR_THIS_TRIP"), "discountAmt": 0 }); //Code Not available for requested city
        }
        if (promoAmtData.amountType == "percentage") {
          var tripAmount = fareDetails.totalFare;
          var discountAmt = tripAmount * (promoAmtData.percentage / 100);
          if (discountAmt > promoAmtData.percentageAmountLimit) body.promoAmt = promoAmtData.percentageAmountLimit;
          else body.promoAmt = discountAmt;
        }
      }
    }*/

    var pickupLatlng = [];
    pickupLatlng[0] = body.pickupLng;
    pickupLatlng[1] = body.pickupLat;

    var outstationDetails = await getOutstationVehicleListWithFare(req); //Get for single vehicle
    var vehicleTypeDocs = outstationDetails.vehicleList[0];
    var fareDetails = vehicleTypeDocs.fareDetails;
    let riderDoc = await Rider.findById(req.userId).exec();

    if (!body.promo == "") {
      var promoAmtData = await Promo.findOne(
        { code: body.promo },
        { amount: 1, code: 1 }
      ).exec();
      if (promoAmtData) {
        body.promoAmt = promoAmtData.amount;
        var tripType = promoAmtData.tripType;
        if (tripType && tripType.length) {
          var isTripTypeIncludes = _.includes(tripType, body.tripType);
          if (!isTripTypeIncludes)
            return res.status(409).json({
              success: false,
              message: req.i18n.__("CODE_NOT_VALID_FOR_THIS_TRIP"),
              discountAmt: 0,
            }); //Code Not available for requested city
        }
        if (promoAmtData.amountType == "percentage") {
          var tripAmount = fareDetails.totalFare;
          var discountAmt = tripAmount * (promoAmtData.percentage / 100);
          if (discountAmt > promoAmtData.percentageAmountLimit)
            body.promoAmt = promoAmtData.percentageAmountLimit;
          else body.promoAmt = discountAmt;
        }
      }
    }

    // var TripCode = await generateTripCode(ServiceId.ScId)

    var newDoc = new Trips({
      // tripno: await TripHelpers.getTripNo(),
      // tripCode: TripCode,
      requestFrom: body.requestFrom,
      requestId: body.adminId ? body.adminId : "",
      triptype: body.tripType,
      bookingType: body.bookingType,
      bookingFor: body.bookingFor,
      notes: body.notesToDriver ? body.notesToDriver : "",
      other: {
        ph: body.otherPh ? body.otherPh : "",
        phCode: body.otherPhCode ? body.otherPhCode : "",
        name: body.otherName ? body.otherName : "",
      },
      date: body.tripShownDate,
      cpy: null,
      cpyid: null,
      dvr: null,
      dvrid: null,
      rid: req.name,
      ridid: req.userId,
      hotelid: req.body.hotelId ? req.body.hotelId : null,
      fare: fareDetails.totalFare,
      vehicle: vehicleTypeDocs.vehicle,
      service: vehicleTypeDocs._id,
      paymentMode: body.paymentMode,
      csp: {
        //Cost split up RFCNG
        base: fareDetails.baseFare,
        dist: vehicleTypeDocs.distanceLable,
        distfare: fareDetails.baseFare,
        perKmRate: vehicleTypeDocs.bkm,
        time: vehicleTypeDocs.timeLable,
        timefare: fareDetails.additionalTimeFareNew, //per time rate ? additionalTimeFareNew
        comison: fareDetails.comison,
        promoamt: body.promoAmt,
        promo: body.promo,
        cost: fareDetails.totalFare,
        conveyance: body.manualPickupCharge
          ? body.manualPickupCharge
          : vehicleTypeDocs.conveyancePerKm,
        tax: fareDetails.tax,
        fareBeforeTax: fareDetails.fareBeforeTax,
        taxPercentage: fareDetails.taxPercentage,
        via: body.paymentMode,
        driverCancelFee: vehicleTypeDocs.cancelationFeesDriver,
        riderCancelFee: vehicleTypeDocs.cancelationFeesRider,
        isNight: false, //TODO
        isPeak: false, //TODO
        nightPer: 1, //TODO
        peakPer: 1, //TODO
        currency: config.currency, //TODO
        hotelcommision: 0, //TODO
        packageId: vehicleTypeDocs.packageId,
        packageName: vehicleTypeDocs.packageName,

        fareForExtraTime: fareDetails.extraTimeFare, //Total Remaining timefare
        extraTime: fareDetails.extraHours,
        fareForExtraKM: fareDetails.additionalDistanceFare,
        extraKM: fareDetails.additionalDistance,
      },
      dsp: {
        distanceKM: vehicleTypeDocs.distanceKM + " KM",
        estTime: vehicleTypeDocs.durationInHour + " Hrs",
        start: vehicleTypeDocs.pickupLocation,
        end: vehicleTypeDocs.dropLocation,
        startcoords: [body.pickupLng, body.pickupLat],
        endcoords: [body.dropLng, body.dropLat],
        startDay: body.startDay,
        returnDay: body.returnDay,
        outstationType: body.outstationType,
      },
      estTime: outstationDetails.tripDuration,
      status: "processing",
      tripOTP: [
        GFunctions.sendRandomizeCode("0", 4),
        GFunctions.sendRandomizeCode("0", 4),
      ],
      scId: ServiceId.ScId,
      scity: ServiceId.pickupCity,
      tripDT: body.tripDT,
      utc: body.utc,
      tripFDT: body.tripFDT,
      gmtTime: body.gmtTime,
      noofseats: body.noofseats,
    });

    newDoc.save((err, tripdata) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }

      var msg = "TAXI_REQUEST_SENT";
      if (body.bookingType != "rideLater") {
        updateRiderFbStatus(
          req.userId,
          "Processing",
          tripdata._id,
          body.tripType
        ); //processing = Req intermediate state

        if (requestTypeMethod == "onebyone") {
          findNearbyDriversAndSendRequest(
            tripdata,
            body,
            req.userId,
            body.pickupLng,
            body.pickupLat,
            body.serviceType
          ); //For One By One
        } else {
          requestNearbyDrivers(tripdata, body, req.userId);
        }
      } else if (body.bookingType == "rideLater") {
        var msg = "OUTSTATION_TAXI_REQUEST_SENT";
        // setInCRON(tripdata._id, tripdata);
        if (riderDoc !== null) {
          findAndSendFCMToRider(
            req.userId,
            "Your Ride Later request received,we will assign Driver before Trip Time.",
            "rideLaterReceived"
          );
          smsGateway.sendSmsMsg(
            riderDoc.phone,
            "",
            riderDoc.phcode,
            "",
            "rideLaterReceived",
            { TRIPNO: tripdata.tripno }
          );
        }

        if (body.processNow) {
          // updateRiderFbStatus(req.userId, "Processing", tripdata._id, body.tripType); //processing = Req intermediate state
          findNearbyDriversAndSendRequest(
            tripdata,
            body,
            req.userId,
            body.pickupLng,
            body.pickupLat,
            body.serviceType
          ); //For One By One
        }
      }

      findAndSendFCMToAllAdmin(
        "newRequest",
        "New Trip Request Outstation, " + tripdata.tripno
      );

      return res.status(200).json({
        success: true,
        message: req.i18n.__(msg),
        requestDetails: tripdata._id,
        tripId: tripdata.tripno,
      });
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
};

//requestOutstationTaxi
/**
 * [Taxi Request from User] = Checked
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const requestReturnCab = async (req, res) => {
  try {
    const body = req.body || {};

    //Save driver details TODO

    // if ((body.vehicleDetailsAndFare['fareDetails']['acneeded']).toString() == "false" || !body.vehicleDetailsAndFare['fareDetails']['acneeded']) acneeded = "false";

    /* 		var distanceKM = 100;
        var timeInMin = 500;
        var outstationDetails = await getOutstationVehicleListWithFare(req, distanceKM, timeInMin, 'finalamount'); //Get for single vehicle
        return res.status(200).json({ 'success': false, 'message': outstationDetails });
     */
    if (!body.promo == "") {
      var promoAmtData = await Promo.findOne(
        { code: body.promo },
        { amount: 1, code: 1 }
      ).exec();
      if (promoAmtData) body.promoAmt = promoAmtData.amount;
    }

    var pickupLatlng = [];
    pickupLatlng[0] = body.pickupLng;
    pickupLatlng[1] = body.pickupLat;

    var outstationDetails = await getOutstationVehicleListWithFare(req); //Get for single vehicle
    var vehicleTypeDocs = outstationDetails.vehicleList[0];
    var fareDetails = vehicleTypeDocs.fareDetails;
    let riderDoc = await Rider.findById(req.userId).exec();

    var newDoc = new Trips({
      // tripno: await TripHelpers.getTripNo(),
      requestFrom: body.requestFrom,
      requestId: body.adminId ? body.adminId : "",
      triptype: body.tripType,
      bookingType: body.bookingType,
      bookingFor: body.bookingFor,
      notes: body.notesToDriver ? body.notesToDriver : "",
      other: {
        ph: body.otherPh ? body.otherPh : "",
        phCode: body.otherPhCode ? body.otherPhCode : "",
        name: body.otherName ? body.otherName : "",
      },
      date: body.tripShownDate,
      cpy: null,
      cpyid: null,
      dvr: null,
      dvrid: null,
      rid: req.name,
      ridid: req.userId,
      hotelid: req.body.hotelId ? req.body.hotelId : null,
      fare: fareDetails.totalFare,
      vehicle: vehicleTypeDocs.vehicle,
      service: vehicleTypeDocs._id,
      paymentMode: body.paymentMode,
      csp: {
        //Cost split up RFCNG
        base: fareDetails.baseFare,
        dist: vehicleTypeDocs.distanceLable,
        distfare: fareDetails.baseFare,
        perKmRate: vehicleTypeDocs.bkm,
        time: vehicleTypeDocs.timeLable,
        timefare: fareDetails.additionalTimeFareNew, //per time rate ? additionalTimeFareNew
        comison: fareDetails.comison,
        promoamt: body.promoAmt,
        promo: body.promo,
        cost: fareDetails.totalFare,
        conveyance: body.manualPickupCharge
          ? body.manualPickupCharge
          : vehicleTypeDocs.conveyancePerKm,
        tax: 0, //TODO
        taxPercentage: vehicleTypeDocs.taxPercentage,
        via: body.paymentMode,
        driverCancelFee: vehicleTypeDocs.cancelationFeesDriver,
        riderCancelFee: vehicleTypeDocs.cancelationFeesRider,
        isNight: false, //TODO
        isPeak: false, //TODO
        nightPer: 1, //TODO
        peakPer: 1, //TODO
        currency: config.currency, //TODO
        hotelcommision: 0, //TODO
        packageId: vehicleTypeDocs.packageId,
        packageName: vehicleTypeDocs.packageName,

        fareForExtraTime: fareDetails.extraTimeFare, //Total Remaining timefare
        extraTime: fareDetails.extraHours,
        fareForExtraKM: fareDetails.additionalDistanceFare,
        extraKM: fareDetails.additionalDistance,
      },
      dsp: {
        distanceKM: vehicleTypeDocs.distanceKM + " KM",
        estTime: vehicleTypeDocs.durationInHour + " Hrs",
        start: vehicleTypeDocs.pickupLocation,
        end: vehicleTypeDocs.dropLocation,
        startcoords: [body.pickupLng, body.pickupLat],
        endcoords: [body.dropLng, body.dropLat],
        startDay: body.startDay,
        returnDay: body.returnDay,
        outstationType: body.outstationType,
      },
      estTime: outstationDetails.tripDuration,
      status: "processing",
      tripOTP: [
        GFunctions.sendRandomizeCode("0", 4),
        GFunctions.sendRandomizeCode("0", 4),
      ],
      scId: null,
      tripDT: body.tripDT,
      utc: body.utc,
      tripFDT: body.tripFDT,
      gmtTime: body.gmtTime,
      noofseats: body.noofseats,
    });

    newDoc.save((err, tripdata) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: err.message, err: err });
      }

      var msg = "TAXI_REQUEST_SENT";
      if (body.bookingType != "rideLater") {
        updateRiderFbStatus(
          req.userId,
          "Processing",
          tripdata._id,
          body.tripType
        ); //processing = Req intermediate state

        if (requestTypeMethod == "onebyone") {
          findNearbyDriversAndSendRequest(
            tripdata,
            body,
            req.userId,
            body.pickupLng,
            body.pickupLat,
            body.serviceType
          ); //For One By One
        } else {
          requestNearbyDrivers(tripdata, body, req.userId);
        }
      } else if (body.bookingType == "rideLater") {
        var msg = "RETURN_TAXI_REQUEST_SENT";
        // setInCRON(tripdata._id, tripdata);

        /* if (riderDoc !== null) {
          smsGateway.sendSmsMsg(riderDoc.phone, '', riderDoc.phcode, '', 'rideLaterReceived', { "TRIPNO": tripdata.tripno });
        } */

        //If accept and Process now only we can show accepted screen
        findNearbyDriversAndSendRequest(
          tripdata,
          body,
          req.userId,
          body.pickupLng,
          body.pickupLat,
          body.serviceType
        ); //For One By One

        /*if (body.processNow) {
          // updateRiderFbStatus(req.userId, "Processing", tripdata._id, body.tripType); //processing = Req intermediate state
          findNearbyDriversAndSendRequest(tripdata, body, req.userId, body.pickupLng, body.pickupLat, body.serviceType);//For One By One
        } */
      }
      return res.status(200).json({
        success: true,
        message: req.i18n.__(msg),
        requestDetails: tripdata._id,
        tripId: tripdata.tripno,
      });
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: req.i18n.__("SOME_ERROR"),
      error: error.toString(),
    });
  }
};

export const sendScheduleOutstationTaxiRequestToDriver = () => {
  var timeGMTBefore1 = GFunctions.getScheduleTaxiRequestTime(
    config.redtaxisettings.connectOutstationTripBefore
  ); //at 30
  var timeGMTBefore2 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectOutstationTripBefore) - 5
  ); //at 25
  var timeGMTBefore3 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectOutstationTripBefore) - 10
  ); //at 20
  var timeGMTBefore4 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectOutstationTripBefore) - 20
  ); //at 10

  var timeGMTBefore7 = GFunctions.getScheduleTaxiRequestTime(
    config.redtaxisettings.connectOutstationTripBeforeFirst
  ); //at 60
  var timeGMTBefore5 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectOutstationTripBeforeFirst) - 10
  ); //at 50
  var timeGMTBefore6 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectOutstationTripBeforeFirst) - 20
  ); //at 40

  Trips.find(
    {
      bookingType: { $in: ["rideLater"] },
      triptype: "outstation",
      $or: [
        { review: constantsValues.cancelTaxiByDriver },
        { status: { $in: ["noresponse", "processing"] } },
      ],
      //status: { $in: ['noresponse', 'processing'] },
      gmtTime: {
        $in: [
          timeGMTBefore1,
          timeGMTBefore2,
          timeGMTBefore3,
          timeGMTBefore4,
          timeGMTBefore5,
          timeGMTBefore6,
          timeGMTBefore7,
        ],
      },
    },
    function (err, docs) {
      if (docs) {
        docs.forEach(async function (doc) {
          var isRiderCurrentlyFreeToTakeNew = await isRiderCurrentlyFree(
            doc.ridid
          );
          if (isRiderCurrentlyFreeToTakeNew) {
            let userreq = {};
            let userId = doc.ridid,
              pickupLng = doc.dsp.startcoords[0],
              pickupLat = doc.dsp.startcoords[1],
              serviceType = doc.vehicle;

            if (requestTypeMethod == "onebyone") {
              findNearbyDriversAndSendRequest(
                doc,
                userreq,
                userId,
                pickupLng,
                pickupLat,
                serviceType
              ); //For One By One
            } else {
              //requestNearbyDrivers(tripdata, body, req.userId);
            }
          }
        });
      }
    }
  );
};

//Package Flow

export const checkServiceAvailableInThisPoints = async (req, res) => {
  try {
    var body = req.body;
    var pickupCity = "";
    var ScId = [];
    var supportNo = config.supportNo.toString();
    if (featuresSettings.isCityWise) {
      let availableService = await ServiceAvailableCities.find(
        { softDelete: false },
        { cityBoundaryPolygon: 1, city: 1 }
      ).lean(); //.distinct('cityBoundaryPolygon')
      let pickPoint = false;
      let availableServiceLength = availableService.length;
      for (let i = 0; i < availableServiceLength; i++) {
        if (availableService[i].city == "Default") {
          ScId.push(availableService[i]._id);
        }
        if (
          availableService[i].city != "Default" &&
          availableService[i].cityBoundaryPolygon.length != 0
        ) {
          pickPoint = insidePolygon(
            [parseFloat(body.pickupLng), parseFloat(body.pickupLat)],
            availableService[i].cityBoundaryPolygon
          );
          if (pickPoint) {
            if (body.rentalPackage) {
              return { success: true, data: availableService[i].city };
            }
            pickupCity = availableService[i].city;
            ScId.push(availableService[i]._id);
            break;
          }
        }
      }
      var cityPhno = await getSupportNo(pickupCity);
      if (cityPhno.length) {
        supportNo = cityPhno[0].phone;
      }
      if (!pickPoint) {
        if (body.rentalPackage) {
          return {
            success: false,
            message: req.i18n.__("SERVICE_NOT_AVAILABEL_IN_THIS_LOCATION"),
            data: null,
            ScId: ScId,
          };
        }
        return {
          success: false,
          message: req.i18n.__("SERVICE_NOT_AVAILABEL_IN_THIS_LOCATION"),
          phone: supportNo,
          ScId: ScId,
        };
      }

      if (
        pickPoint &&
        body.rentalPackage != true &&
        typeof body.dropLat != "undefined" &&
        body.dropLat != "" &&
        typeof body.dropLng != "undefined" &&
        body.dropLng != ""
      ) {
        let dropPoint = false;
        for (let i = 0; i < availableServiceLength; i++) {
          if (
            availableService[i].city != "Default" &&
            availableService[i].cityBoundaryPolygon.length != 0 &&
            availableService[i].city == pickupCity
          ) {
            dropPoint = insidePolygon(
              [parseFloat(body.dropLng), parseFloat(body.dropLat)],
              availableService[i].cityBoundaryPolygon
            );
            if (dropPoint) {
              return {
                success: true,
                message: "Service Available",
                ScId: ScId,
              };
            }
          }
        }

        if (!dropPoint) {
          return {
            success: false,
            message: req.i18n.__("DROP_LOCATION_OUTSIDE_BOUNDARY"),
            phone: supportNo,
            ScId: ScId,
          };
        }
      }
    } else {
      return { success: true, message: "Service Available", ScId: ScId };
    }
  } catch (error) {
    return { status: false, message: "Error On Server" };
  }
};

export const isRiderCurrentlyFree = async (riderID) => {
  try {
    let riderDoc = await Rider.findById(riderID).lean().exec();
    if (riderDoc !== null) {
      if (riderDoc.curStatus != "free") {
        // let lastTrip = await Trips.findOne({ 'ridid': riderId, 'triptype': 'daily' }, { status: 1 }).sort({ 'tripFDT': -1 }).limit(1);
        let currentTripExists = await Trips.findOne(
          {
            ridid: riderId,
            status: { $in: ["processing", "accepted", "Progress"] },
          },
          { status: 1 }
        ).limit(1);
        if (currentTripExists) {
          return true; //not free
        } else {
          let updateRiderCurStatus = await Rider.findOneAndUpdate(
            { _id: riderID },
            { curStatus: "free" }
          );
          return false;
        }
      } else {
        return true; //free
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const isRiderHasUpcomingTrips = async (riderID) => {
  try {
    var fromDate = new Date(GFunctions.getISODate());

    var tripData = await Trips.findOne({
      ridid: riderID,
      status: "processing",
      tripFDT: {
        $gte: fromDate,
      },
    });

    if (tripData !== null) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const checkPickupPointsServiceId = async (coords) => {
  try {
    var pickupCity = "";
    var ScId = "",
      countryId;
    let availableService = await ServiceAvailableCities.find(
      { softDelete: false },
      { cityBoundaryPolygon: 1, city: 1, countryId: 1 }
    ).lean(); //.distinct('cityBoundaryPolygon')

    let pickPoint = false;
    let availableServiceLength = availableService.length;
    for (let i = 0; i < availableServiceLength; i++) {
      if (availableService[i].city == "Default") {
      } else if (availableService[i].cityBoundaryPolygon.length != 0) {
        pickPoint = insidePolygon(
          [parseFloat(coords[0]), parseFloat(coords[1])],
          availableService[i].cityBoundaryPolygon
        );
        if (pickPoint) {
          pickupCity = availableService[i].city;
          ScId = availableService[i]._id;
          countryId = availableService[i].countryId;
          break;
        }
      }
    }
    if (!pickPoint) {
      var data = _.map(availableService, (el) => {
        if (el.city == "Default") {
          pickupCity = "Default";
          ScId = el._id;
          countryId = el.countryId;
        }
      });
      return { pickupCity: pickupCity, ScId: ScId, countryId: countryId };
    } else {
      return { pickupCity: pickupCity, ScId: ScId, countryId: countryId };
    }
  } catch (error) {
    return { pickupCity: "", ScId: null, countryId: countryId };
  }
};

function findAndUpdateTripLocation(tripNo, lat, lng) {
  var updateTime = 0,
    updateDistanceTime = 0;
  Trips.findOne(
    { tripno: tripNo, status: "Progress" },
    { _id: 1, triptype: 1 },
    (err, docs) => {
      if (err) {
      }
      if (!docs) {
      } else {
        if (docs.triptype == "daily") {
          updateTime = featuresSettings.locationUpdateAfter.daily;
          updateDistanceTime = featuresSettings.distUpdateForDailyInSec;
        } else if (docs.triptype == "rental") {
          updateTime = featuresSettings.locationUpdateAfter.rental;
        } else if (docs.triptype == "outstation") {
          updateTime = featuresSettings.locationUpdateAfter.outstation;
        }
        updateTripLocation(
          docs._id,
          lat,
          lng,
          updateTime,
          docs.triptype,
          updateDistanceTime
        );
      }
    }
  );
}

function updateTripLocation(
  tripId,
  lat,
  lng,
  updateTime,
  tripType,
  updateDistanceTime = 0
) {

  var locat = [lng,lat];
  var location = [Number(lat).toFixed(4) + "," + Number(lng).toFixed(4)];
  TripLocation.findOne({ tripId: tripId }, {}, async (err, doc) => {
    if (err) {
    }
    if (!doc) {
      var newDoc = new TripLocation({
        tripId: tripId,
        lastUpdated: GFunctions.getISODate(),
        lastDistUpdated: GFunctions.getISODate(),
        loc: location,
        locations:[locat]
      });
      newDoc.save((err, doc) => {
        if (err) {
        } else {
        }
      });
    } else {
      // var timeBtNowAndReq = GFunctions.getMinsBtDateTime(GFunctions.getISODate(), doc.lastUpdated);
      var timeBtNowAndReq = GFunctions.getSecsBtDateTime(
        GFunctions.getISODate(),
        doc.lastUpdated
      );
      if (timeBtNowAndReq >= updateTime) {
        // for (var i = 0; i < 1339; i++) {
        var distance = 0;
        var updateQuery = {
          $push: { loc: location ,locations:[locat]},
          $set: { lastUpdated: GFunctions.getISODate() },
        };
        if (tripType == "daily" && updateDistanceTime > 0) {
          var locationLength = doc.loc.length;
          var oldDistance = doc.distance;
          distance = oldDistance;
          if (locationLength > 0) {
            var coords = doc.loc[locationLength - 1];
            coords = coords.split(",");
            var newDistance = await getDistanceBttwoCords(
              coords[0],
              coords[1],
              lat,
              lng
            );
            newDistance = Number(newDistance) / 1000;
            newDistance = Number(newDistance).toFixed(2);

            distance = Number(newDistance) + Number(oldDistance);
            distance = Number(distance).toFixed(2);
            if (isNaN(distance)) {
              distance = 0;
            }
          }
          updateQuery = {
            $push: { loc: location , locations:[locat] },
            $set: {
              lastUpdated: GFunctions.getISODate(),
              lastDistUpdated: GFunctions.getISODate(),
              distance: distance,
            },
          };
        }
        TripLocation.findOneAndUpdate(
          { tripId: tripId },
          updateQuery,
          async (err, data) => {
            if (err) {
            } else {
            }
          }
        );
        // }
      }
      // if (tripType == "daily" && updateDistanceTime > 0) {
      // 	var timeBtNowAndReq = GFunctions.getSecsBtDateTime(GFunctions.getISODate(), doc.lastDistUpdated);
      // 	if (timeBtNowAndReq >= updateDistanceTime) {
      // 		var locationLength = (doc.loc).length;
      // 		var oldDistance = doc.distance;
      // 		var distance = oldDistance
      // 		if (locationLength > 0) {
      // 			var coords = doc.loc[locationLength - 1];
      // 			coords = coords.split(",");
      // 			var newDistance = await getDistanceBttwoCords(coords[0], coords[1], lat, lng);
      // 			newDistance = Number(newDistance) / 1000;
      // 			newDistance = Number(newDistance).toFixed(2);
      // 			distance = Number(newDistance) + Number(oldDistance);
      // 			distance = Number(distance).toFixed(2);
      // 			if(isNaN(distance)){
      // 				distance = 0;
      // 			}
      // 		}
      // 		await TripLocation.findOneAndUpdate({ 'tripId': tripId }, { $set: { lastDistUpdated: GFunctions.getISODate(), distance: distance } });
      // 	}
      // }
    }
  });
}

export const isRiderCurrentlyActive = async (riderID) => {
  try {
    let riderDoc = await Rider.findById(riderID).exec();
    if (riderDoc !== null) {
      if (riderDoc.softdel == "active") {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } catch (error) {
    return true;
  }
};

//CRON to Start Schedule Trip => Manually assigned
/**
 * CRON to send request to Drivers
 * @input
 * @param
 * @return
 * @response
 */
export const startScheduleTaxiReqStatus = () => {
  var timeGMT10MinutesBefore = GFunctions.getScheduleTaxiRequestTime(
    config.redtaxisettings.connectDailyTripBefore
  );
  var timeGMT5MinutesBefore = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectDailyTripBefore) - 5
  );
  var timeGMT5MinutesBefore1 = GFunctions.getScheduleTaxiRequestTime(
    Number(config.redtaxisettings.connectDailyTripBefore) - 10
  );
  Trips.find(
    {
      bookingType: { $in: ["rideLater"] },
      triptype: "daily",
      status: { $in: ["accepted"] },
      driverAssignmentType: "manual-assign",
      gmtTime: {
        $in: [
          timeGMT10MinutesBefore,
          timeGMT5MinutesBefore,
          timeGMT5MinutesBefore1,
        ],
      },
    },
    function (err, docs) {
      if (docs.length) {
        docs.forEach(async function (doc) {
          var isRiderCurrentlyFreeToTakeNew = await isRiderCurrentlyFree(
            doc.ridid
          );
          if (isRiderCurrentlyFreeToTakeNew) {
            startTrip(doc);
          }
        });
      }
    }
  );
};

export const startTrip = (tripData) => {
  updateRiderFbAcceptStatus(
    tripData.ridid,
    "Accepted",
    tripData.tripno,
    tripData.dvrid,
    tripData.triptype
  );
  changeMyTripStatus(
    tripData.dvrid,
    tripData.tripno,
    tripData.bookingType,
    tripData
  );
  changeMyTripStatusMongo(tripData.dvrid, tripData._id, "Accept");
  changeRiderTripStatusMongo(tripData.ridid, tripData._id, "Accept");
};

async function addHotelPayment(hotelPaymentDetails) {
  const newDoc = new HotelPayment(hotelPaymentDetails);
  newDoc.save((err, docs) => {
    if (err) {
      logger.error(`addHotelPayment ${err}`);
    } else {
    }
  });
} //add hotel payment

export const paymentAmtToWallet = async (
  tripId,
  tripAmount,
  paymentMode,
  trxId
) => {
  var tripData = await Trips.findOne({ tripno: tripId });
  //amount,paymentMode,status,trnxid
  var driverWalletDetuctionType = "debit";
  tripAmount = tripAmount ? tripAmount : tripData.fare;
  paymentMode = paymentMode ? paymentMode : tripData.paymentMode;
  trxId = trxId ? trxId : tripData.tripno;
  var driverWalletDetuctionAmt = 0;
  var tripParams = {
    driverId: tripData.dvrid,
    trxId: trxId,
    description: "trips - " + driverWalletDetuctionType,
    amt: driverWalletDetuctionAmt,
    paymentDate: tripData.date,
    paymentDateSort: GFunctions.getISODate(),
    type: driverWalletDetuctionType,
  };
  if (tripData) {
    driverWalletDetuctionAmt =
      Number(tripData.acsp.comison) + Number(tripData.acsp.tax);
    if (featuresSettings.addBookingFeeToCommission)
      driverWalletDetuctionAmt =
        Number(driverWalletDetuctionAmt) + Number(tripData.acsp.booking);

    if (featuresSettings.checkMaxMonthlyEarningsLimit) {
      var Data = await getMonthlyEarningsOfDriver(tripData.dvrid);
      if (Number(Data) > featuresSettings.maxMonthlyEarningsLimit) {
        driverWalletDetuctionAmt =
          Number(driverWalletDetuctionAmt) +
          Number(featuresSettings.additionalDetuctionFromDriver);
      }
    }
    var paymentGatewayCharge = 0;
    if (
      paymentMode == "card" &&
      config.paymentGateway.paymentGatewayName == "razorpay"
    ) {
      paymentGatewayCharge = tripData.acsp.gatewayCharge;
    }
    var driverTaxTDS = await calculateDriverTaxTDS(
      tripData.tripno,
      tripData.acsp.cost,
      tripData.acsp.tax,
      driverWalletDetuctionAmt,
      tripData.acsp.tollFee,
      paymentGatewayCharge
    );
    driverWalletDetuctionAmt =
      Number(driverWalletDetuctionAmt) + Number(driverTaxTDS);

    if (
      paymentMode == "cash" ||
      paymentMode == "Others" ||
      paymentMode == "others"
    ) {
      tripParams["amt"] = driverWalletDetuctionAmt;
      updateDriverWallet(tripParams.driverId, tripParams);
    }
    if (
      paymentMode == "card" &&
      config.paymentGateway.paymentGatewayName == "razorpay"
    ) {
      driverWalletDetuctionType = "credit";
      driverWalletDetuctionAmt =
        Number(tripAmount) -
        Number(driverWalletDetuctionAmt) -
        Number(paymentGatewayCharge);
      // driverWalletDetuctionAmt = Number(tripAmount) - Number(driverWalletDetuctionAmt) - Number(tripData.acsp.tollFee)
      tripParams["description"] = "trips - " + driverWalletDetuctionType;
      tripParams["amt"] = driverWalletDetuctionAmt;
      tripParams["type"] = driverWalletDetuctionType;
      updateDriverWallet(tripParams.driverId, tripParams);
    }
    if (paymentMode == "card" && tripData.paymentGateway == "payPhone") {
      driverWalletDetuctionType = "credit";
      driverWalletDetuctionAmt =
        Number(tripAmount) -
        Number(driverWalletDetuctionAmt) -
        Number(paymentGatewayCharge);
      // driverWalletDetuctionAmt = Number(tripAmount) - Number(driverWalletDetuctionAmt) - Number(tripData.acsp.tollFee)
      tripParams["description"] = "trips - " + driverWalletDetuctionType;
      tripParams["amt"] = driverWalletDetuctionAmt;
      tripParams["type"] = driverWalletDetuctionType;
      updateDriverWallet(tripParams.driverId, tripParams);
    }
    if (paymentMode == "wallet" && featuresSettings.riderWallet) {
      var walletdebt = Number(tripAmount);
      var walletRes = await findRiderChargedAmountUsingWallet(
        tripData.ridid,
        tripData._id,
        walletdebt
      );
      if (walletRes.success) {
        walletdebt = walletRes.detectedAmt;
        driverWalletDetuctionType = "credit";
        driverWalletDetuctionAmt =
          Number(walletdebt) - Number(driverWalletDetuctionAmt);
        tripParams["description"] = "trips - " + driverWalletDetuctionType;
        tripParams["amt"] = driverWalletDetuctionAmt;
        tripParams["type"] = driverWalletDetuctionType;
        updateDriverWallet(tripParams.driverId, tripParams);
      }
    }
  }
};

export const findRiderChargedAmountUsingWallet = async (ridId, trxid, amt) => {
  var returnObj = {
    success: true,
    detectedAmt: amt,
  };
  try {
    let docs = await Wallet.findOne({ ridid: ridId });
    if (!docs) {
      return returnObj;
    } else {
      //Wallet Available
      if (docs.trx.length) {
        var findData = _.find(docs.trx, { trxid: trxid.toString() });
        if (findData) {
          returnObj["detectedAmt"] = findData.amt;
          return returnObj;
        } else return returnObj;
      } else return returnObj;
    }
  } catch (err) {
    return returnObj;
  }
};

export const getMonthlyEarningsOfDriver = async (driverId) => {
  var earnedAmt = 0;
  try {
    const startOfMonth = moment()
      .startOf("month")
      .format("YYYY-MM-DDT00:00:00.000[Z]");
    const endOfMonth = moment()
      .endOf("month")
      .format("YYYY-MM-DDT00:00:00.000[Z]");
    var findQuery = {
      driver: driverId,
      date: { $gte: new Date(startOfMonth), $lt: new Date(startOfMonth) },
    };
    var Data = await DriverPayment.aggregate([
      { $match: findQuery },
      {
        $project: {
          _id: 1,
          amttodriver: 1,
          commision: 1,
        },
      },
      {
        $group: {
          _id: "$null",
          amttodriver: { $sum: "$amttodriver" },
          commision: { $sum: "$commision" },
        },
      },
    ]);
    if (Data.length) return Data[0].amttodriver;
    else return earnedAmt;
  } catch (error) {
    return earnedAmt;
  }
};

export const calculateDriverTaxTDS = async (
  tripNo,
  totalFare,
  taxAmount,
  driverWalletDetuctionAmt,
  tollFee,
  gatewayCharge = 0
) => {
  var fareWithoutTax =
    Number(totalFare) - Number(taxAmount) - Number(gatewayCharge);
  var driverTDSPercentage = featuresSettings.driverTDSPercentage
    ? featuresSettings.driverTDSPercentage
    : 0;
  var driverTaxTDS =
    (parseFloat(driverTDSPercentage) * parseFloat(fareWithoutTax)) / 100;
  DriverPayment.findOne({ tripno: tripNo }, (err, docs) => {
    if (docs) {
      var driverEarnings =
        Number(totalFare) -
        Number(driverWalletDetuctionAmt) -
        Number(driverTaxTDS) -
        Number(tollFee) -
        Number(gatewayCharge);
      var totalDetucted =
        Number(driverWalletDetuctionAmt) +
        Number(driverTaxTDS) +
        Number(tollFee) +
        Number(gatewayCharge);
      docs.totalDetucted = GFunctions.sendFormatedNumber(totalDetucted);
      docs.amttodriver = GFunctions.sendFormatedNumber(driverEarnings);
      docs.driverTaxTDS = GFunctions.sendFormatedNumber(driverTaxTDS);
      docs.digital = GFunctions.sendFormatedNumber(gatewayCharge);
      docs.save();
    }
  });
  return driverTaxTDS;
};

export const checkIsRiderBlocked = async (
  riderId,
  currentDate,
  type = "cancel",
  walletLimit
) => {
  try {
    let riderDoc = await Rider.findOne({ _id: riderId });
    if (riderDoc !== null) {
      if (type == "cancel") {
        if (riderDoc.blockuptoDate != null) {
          if (moment(currentDate).isAfter(moment(riderDoc.blockuptoDate)))
            return { success: true };
          else {
            var blockuptoDate = GFunctions.getDateTimeinThisFormat(
              riderDoc.blockuptoDate,
              "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
              "DD-MM-YYYY"
            );
            return {
              success: false,
              msg: "Your Account has been Blocked upto " + blockuptoDate,
            };
          }
        } else return { success: true };
      } else {
        if (riderDoc.balance <= walletLimit) return { success: true };
        else {
          return {
            success: false,
            msg: "Your Wallet limit has Exceeded. Please Recharge.",
          };
        }
      }
    } else return { success: true };
  } catch (err) {
    return { success: true };
  }
};

export const addTipsForDriver = async (req, res) => {
	let tripNo = req.body.tripNo;
	let tips = req.body.tips;
  try{
    var tripData = await Trips.findOne({ tripno: tripNo }).exec();
    let totalfarewithTips = Number(tripData.fare) + Number(tips);
    if (tripData.tipsStatus == false) {

			Trips.findOneAndUpdate(
				{ tripno: tripData.tripno },
				{ $set: {tips: tips,"acsp.cost":totalfarewithTips.toFixed(2),fare:totalfarewithTips.toFixed(2), "acsp.bal":totalfarewithTips.toFixed(2), tipsStatus: true, } }, { new: true },
			).exec();

      var walletUpdate = {
        driverId: tripData.dvrid,
        trxId: "Tips" + tripNo,
        description: "tips - credit",
        amt: tips,
        type: "credit",
        paymentDate: tripData.date,
        paymentDateSort: GFunctions.getISODate(),
      };
			 updateTripTipsInFirebase(tripData, tips,totalfarewithTips.toFixed(2));
       updateDriverPaymentTip(tripData.tripno,totalfarewithTips.toFixed(2),tips)
       updateDriverWallet(walletUpdate.driverId, walletUpdate);
      findAndSendFCMToDriver(
        tripData.dvrid,
        "CONGRATS YOU GOT AS A TIPS FOR $" + tips
      );
			return res
				.status(200)
				.json({ success: true, message: req.i18n.__("TIPS AMOUNT UPDATED") });
		} else {
			return res
				.status(200)
				.json({ success: true, message: req.i18n.__("TIPS AMOUNT UPDATED ALREADY") });
		}
  }catch (err) {
		console.log(err);
		return res
			.status(500)
			.json({ success: false, message: "error", err });
	}
};

// export const addTipsForDriver = async (req, res) => {
// 	let tripNo = req.body.tripNo;
// 	let tips = req.body.tips;
// 	try {
// 		var tripData = await Trips.findOne({ tripno: tripNo }).exec();
// 		if (tripData.tipsStatus == false) {

// 			Trips.findOneAndUpdate(
// 				{ tripno: tripData.tripno },
// 				{ $set: {tips: tips, tipsStatus: true, } }, { new: true },
// 			).exec();
		
// 			updateTripTipsInFirebase(tripData, tips);
// 			findAndSendFCMToDriver(tripData.dvrid, `You Got a Tips amount ${config.currencySymbol} ${tips}`, 'Tips');
// 			// var walletUpdate = {
// 			// 	driverId: tripData.dvrid,
// 			// 	trxId: tripData.tripno,
// 			// 	description: "tips - credit",
// 			// 	amt: req.body.tips,
// 			// 	type: "credit",
// 			// 	paymentDate: tripData.date,
// 			// 	paymentDateSort: GFunctions.getISODate(),
// 			// };
// 			// updateDriverWallet(walletUpdate.driverId, walletUpdate);
// 			return res
// 				.status(200)
// 				.json({ success: true, message: req.i18n.__("TIPS AMOUNT UPDATED") });
// 		} else {
// 			return res
// 				.status(200)
// 				.json({ success: true, message: req.i18n.__("TIPS AMOUNT UPDATED ALREADY") });
// 		}
// 	} catch (err) {
// 		console.log(err);
// 		return res
// 			.status(500)
// 			.json({ success: false, message: "error", err });
// 	}

// };

function updateTripTipsInFirebase(tripDoc, tips,totalamount) {
	if (!firebase.apps.length) {
		firebase.initializeApp(config.firebasekey);
	}
	var db = firebase.database();
	var ref = db.ref("trips_data"); //Todo
	var requestData = {
    tipsToDriver: tips ? tips.toString() : "0",
		total_fare: totalamount ? totalamount.toString(): tripDoc.fare,
		balance_fare: totalamount ? totalamount.toString(): tripDoc.fare,
		ispay: totalamount ? totalamount.toString(): tripDoc.fare,

	};
	requestData = convertAllNumbersToString(requestData);
	var child = tripDoc.tripno.toString();
	var usersRef = ref.child(child);
	usersRef.update(requestData, function (error) {
		if (error) {
		} else {
		}
	});
}

// function updateDriverPaymentTip (id,totalfarewithTips,tips) {
// console.log("inside the function")
// const data = DriverPayment.findOne({ tripno: id }).exec()
// console.log(data,"data")
// console.log(data.amttodriver,"data.amttodriver")
// let amttodriverTip = Number(data.amttodriver) + Number(tips)
// console.log(amttodriverTip,"amttodriverTip")
//  DriverPayment.findOneAndUpdate(
//     { tripno: id },
//     { $set: {tips: tips, amttopay: totalfarewithTips, amttodriver: Number(amttodriverTip)} }, { new: true },
//   ).exec();
//   console.log(data,"data")
// }
async function updateDriverPaymentTip(id, totalfarewithTips, tips) {
  try {
      const data = await DriverPayment.findOne({ tripno: id }).exec();

      let amttodriverTip = Number(data.amttodriver) + Number(tips);
      const updatedData = await DriverPayment.findOneAndUpdate(
          { tripno: id },
          { $set: { tips: tips, amttopay: totalfarewithTips, amttodriver: Number(amttodriverTip) } },
          { new: true }
      ).exec();
      // return updatedData; // Return the updated document
  } catch (error) {
      console.error("Error occurred:", error);
      throw error; // Rethrow the error to be handled by the caller
  }
}