import mongoose, { Query } from "mongoose";

//import model
import RentalPackage from "../../models/rentalPackage.model";
import OutstationPackage from "../../models/outstationPackage.model";
import ServiceAvailableCities from "../../models/serviceAvailableCities.model";
import Vehicle from "../../models/vehicletype.model";
import Driver from "../../models/driver.model";
import Promo from "../../models/promo.model";
import * as GFunctions from "../../controllers/functions";
var rentalConfig = require("./config");

//import package
import { insidePolygon } from "geolocation-utils";
import _ from "lodash";
const fs = require("fs");
const moment = require("moment");

//import config file
import featuresSettings from "../../featuresSettings";
import config from "../../config";
import { DriverLocation } from "../../controllers/app";
import { getPreferedDetails } from "../../controllers/common";

export const rentalPackageList = async (req, res) => {
  try {
    let where = {},
      body = req.body,
      serviceCityId = [],
      scID = "";
    if (featuresSettings.isCityWise) {
      let availableService = await ServiceAvailableCities.find(
        { softDelete: false },
        { cityBoundaryPolygon: 1, city: 1 }
      ).lean();
      let pickUpPoint = false;
      for (var value of availableService) {
        if (value.city == "Default") {
          serviceCityId.push(value._id);
        } else {
          if (value.cityBoundaryPolygon.length != 0) {
            pickUpPoint = insidePolygon(
              [parseFloat(body.pickupLng), parseFloat(body.pickupLat)],
              value.cityBoundaryPolygon
            );
            if (pickUpPoint) {
              serviceCityId.push(value._id);
              scID = value._id;
              break;
            }
          }
        }
      }
      if (pickUpPoint == false) {
        return res
          .status(400)
          .json({ message: "Service Not Available in This City." });
      }
      where = { "scIds.scId": { $in: serviceCityId } };

      if (req.cityWise == "exists") {
        var serviceExists = _.find(req.scId, mongoose.Types.ObjectId(scID));
        if (!serviceExists)
          return res
            .status(409)
            .json({
              success: false,
              message: req.i18n.__(
                "NO_PERMISSION_TO_DISPATCH_FROM_THIS_LOCATION"
              ),
              phone: config.supportNo,
            });
      }
    }

    /* var description = `<!DOCTYPE html ><html><body><ul>
		<li>Changes applicable upon exceeding hour/kms.</li>
		<li>Additional GST applicable on final bill.</li>
		<li>Fare excludes toll and parking charges.</li>
		<li>For local travel only.</li></ul></body></html>`; */

    var description = rentalConfig.description;

    let rentalPackage = await RentalPackage.find(where, {
      name: 1,
      distance: 1,
      duration: 1,
      price: 1,
      scIds: 1,
    }).sort({ distance: 1 });
    rentalPackage = _.map(rentalPackage, (el) => {
      el.scity = el.scIds[0].name;
      return el;
    });
    // if (featuresSettings.checkDuplication) {
    // 	var filterBy = 'distance';
    // 	rentalPackage = await getPreferedDetails(rentalPackage, filterBy);
    // 	console.log("......inside",rentalPackage)
    // }
    return res
      .status(200)
      .json({
        success: true,
        message: "Details fetched Successfully",
        packageDetail: rentalPackage,
        serviceDetail: serviceCityId,
        Description: description,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error on the server.", error: error });
  }
};

export const rentalFareCalculationAllVehicleType = async (req, res) => {
  try {
    var body = req.body,
      serviceId = body.serviceId.split(",");

    let vehicleTypeDocs = await Vehicle.find(
      { tripTypeCode: body.tripTypeCode, "scIds.scId": { $in: serviceId } },
      {
        bkm: 1,
        packageTimeRate: 1,
        timeFare: 1,
        tripTypeCode: 1,
        type: 1,
        baseFare: 1,
        file: 1,
        description: 1,
        asppc: 1,
        taxPercentage: 1,
        scIds: 1,
      }
    ).sort({ displayorder: 1 });
    let packagaDoc = await RentalPackage.findById(body.packageId, {
      name: 1,
      distance: 1,
      duration: 1,
      price: 1,
      mini: 1,
      suv: 1,
      sedan: 1,
      fixedRate: 1,
    }).lean();
    console.log("....packagaDoc", packagaDoc);
    var response = [];
    _.forEach(vehicleTypeDocs, (val) => {
      // console.log("VEHICLE  TYPE", _.lowerCase(val["type"]));//
      // console.log("package ",packagaDoc[_.lowerCase(val["type"])])
      //var specfVehicleRentFare = packagaDoc[_.lowerCase(val["type"])];
      var specfVehicleRentFare = null;
      specfVehicleRentFare = _.find(packagaDoc.fixedRate, {
        name: val["type"],
      });
      if (specfVehicleRentFare)
        specfVehicleRentFare = specfVehicleRentFare.rate;
      console.log("...specfVehicleRentFare", specfVehicleRentFare);
      var bookingFare = vehicleTypeDocs.bookingFare
        ? vehicleTypeDocs.bookingFare
        : 0;
      if (body.bookingType == "rideNow") bookingFare = 0;

      console.log("....bookingFare..", bookingFare);
      var fareBeforeTax = getRentalEstimationFare(
        packagaDoc.distance,
        val.bkm,
        bookingFare,
        0,
        0,
        0,
        packagaDoc.duration,
        val.packageTimeRate,
        specfVehicleRentFare
      );
      console.log("....fareBeforeTax..", bookingFare);
      var taxAmount = 0;
      if (featuresSettings["rentalEstimationFareTax"]) {
        taxAmount = (
          (parseFloat(val.taxPercentage) * parseFloat(fareBeforeTax)) /
          100
        ).toFixed(2);
      }

      var taxTDS = 0;
      if (featuresSettings["taxTDSPercentage"] > 0) {
        taxTDS = (
          (parseFloat(featuresSettings["taxTDSPercentage"]) *
            parseFloat(fareBeforeTax)) /
          100
        ).toFixed(2);
      }
      var totalFare = (
        parseFloat(taxAmount) +
        parseFloat(fareBeforeTax) +
        parseFloat(taxTDS)
      ).toFixed(2);

      if (Number(config.googleCharge) > 0) {
        totalFare = Number(totalFare) + Number(config.googleCharge);
      }
      console.log("....totalFare.", totalFare);
      console.log(".........val", val);
      response.push({
        _id: val._id,
        tripTypeCode: val.tripTypeCode,
        type: val.type,
        bkm: val.bkm.toString(),
        timeFare: val.timeFare.toString(),
        // "tripTypeCode": val.tripTypeCode,
        // "type": val.type,
        baseFare: val.baseFare ? val.baseFare : 0,
        bookingFare: bookingFare.toString(),
        packageDistance: packagaDoc.distance.toString(),
        packageDuration: packagaDoc.duration.toString(),
        // "packageFare": (specfVehicleRentFare).toString(),
        file: config.baseurl + val.file,
        description: val.description,
        seat: val.asppc,
        packageId: packagaDoc._id,
        taxPercentage: val.taxPercentage,
        taxAmount: taxAmount,
        fareBeforeTax: fareBeforeTax.toString(),
        fare: totalFare.toString(),
        googleCharge: config.googleCharge.toString(),
        scity: val.scIds[0].name,
      });
    });
    // if (featuresSettings.checkDuplication) {
    // 	var filterBy = 'type';
    // 	response = await getPreferedDetails(response, filterBy);
    // }
    console.log(".......response...", response);
    return res
      .status(200)
      .json({ success: true, message: "Fetched successfully", data: response });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error on the server.", error: err });
  }
};

/**
 * body : vehicleTypeId, packageId,
 */
export const rentalFareEstimateSingleVehilce = async (req, res) => {
  try {
    var body = req.body;
    let vehicleTypeDocs = await Vehicle.findById(body.vehicleTypeId, {
      bkm: 1,
      timeFare: 1,
      tripTypeCode: 1,
      distance: 1,
      type: 1,
      baseFare: 1,
      packageTimeRate: 1,
      file: 1,
      description: 1,
      asppc: 1,
      taxPercentage: 1,
      bookingFare: 1,
    });
   
    let packagaDoc = await RentalPackage.findById(body.packageId, {
      name: 1,
      distance: 1,
      duration: 1,
      price: 1,
      mini: 1,
      suv: 1,
      sedan: 1,
      fixedRate: 1,
    }).lean();
    console.log("_______________vehicleTypeDocs",packagaDoc)
    //var singleVehicleRentFare = packagaDoc[_.lowerCase(vehicleTypeDocs["type"])];
    var singleVehicleRentFare = null;
    // singleVehicleRentFare = _.find(packagaDoc.fixedRate, {
    //   name: vehicleTypeDocs["type"],
    // });
    singleVehicleRentFare = packagaDoc.fixedRate.find((e)=>{
      console.log("--------- ",e.name,vehicleTypeDocs["type"])
     return e.name == vehicleTypeDocs["type"]
    })
    console.log("==============singleVehicleRentFare",singleVehicleRentFare)
    if (singleVehicleRentFare)
      singleVehicleRentFare = singleVehicleRentFare.rate;

    var bookingFare = vehicleTypeDocs.bookingFare
      ? vehicleTypeDocs.bookingFare
      : 0;
    if (body.bookingType == "rideNow") bookingFare = 0;

    var fareBeforeTax = getRentalEstimationFare(
      packagaDoc.distance,
      vehicleTypeDocs.bkm,
      bookingFare,
      0,
      0,
      0,
      packagaDoc.duration,
      vehicleTypeDocs.packageTimeRate,
      singleVehicleRentFare
    );

    var taxAmount = 0;
    if (featuresSettings["rentalEstimationFareTax"]) {
      taxAmount = (
        (parseFloat(vehicleTypeDocs.taxPercentage) *
          parseFloat(fareBeforeTax)) /
        100
      ).toFixed(2);
    }
    var taxTDS = 0;
    if (featuresSettings["taxTDSPercentage"] > 0) {
      taxTDS = (
        (parseFloat(featuresSettings["taxTDSPercentage"]) *
          parseFloat(fareBeforeTax)) /
        100
      ).toFixed(2);
    }
    var totalFare = (
      parseFloat(taxAmount) +
      parseFloat(fareBeforeTax) +
      parseFloat(taxTDS)
    ).toFixed(2);

    if (Number(config.googleCharge) > 0) {
      totalFare = Number(totalFare) + Number(config.googleCharge);
    }

    console.log("______________singleVehicleRentFare",singleVehicleRentFare)
    var response = {
      _id: vehicleTypeDocs._id,
      tripTypeCode: vehicleTypeDocs.tripTypeCode,
      type: vehicleTypeDocs.type,
      bkm: vehicleTypeDocs.bkm.toString(),
      bookingFare: bookingFare.toString(),
      timeFare: vehicleTypeDocs.timeFare.toString(),
      tripTypeCode: vehicleTypeDocs.tripTypeCode,
      type: vehicleTypeDocs.type,
      baseFare: vehicleTypeDocs.baseFare ? vehicleTypeDocs.baseFare : 0,
      packageName: packagaDoc.name,
      packageDistance: packagaDoc.distance.toString(),
      packageDuration: packagaDoc.duration.toString(),
      packageFare: singleVehicleRentFare.toString(),
      file: config.baseurl + vehicleTypeDocs.file,
      description: vehicleTypeDocs.description,
      seat: vehicleTypeDocs.asppc,
      packageId: packagaDoc._id,
      taxPercentage: vehicleTypeDocs.taxPercentage,
      taxAmount: taxAmount,
      taxTDSPercentage: featuresSettings["taxTDSPercentage"],
      taxTDS: taxTDS,
      fareBeforeTax: fareBeforeTax.toString(),
      fare: totalFare.toString(),
      googleCharge: config.googleCharge.toString(),
    };
    return res
      .status(200)
      .json({ success: true, message: "Fetched successfully", data: response });
  } catch (err) {
    console.log("_______________Err",err)
    return res
      .status(500)
      .json({ success: false, message: "Error on the server.", error: err });
  }
};

/* export const rentalFareEstimateSingleVehilce = async (req,res) =>{
	try{
		var
		body 				   = req.body,
		additionalDuration     = 0,
		additionalDurationFare = 0,
		additionalDistance 	   = 0;

		let vehicleTypeDocs = await Vehicle.findById(body.vehicleTypeId,{"bkm":1,"timeFare":1,"tripTypeCode":1,"distance":1,"type":1,"baseFare":1});
		let packageDoc = await RentalPackage.findById(body.packageId,{"name":1,"distance":1,"duration":1,"price":1});

		body.distance = packageDoc.distance; //mk

		if ( (parseFloat(body.distance)) && (parseFloat(packageDoc.distance) > parseFloat(body.distance)) ){
			additionalDistance = parseFloat(body.distance) - parseFloat(packageDoc.distance);
		}

		let packageDuration = parseFloat(packageDoc.duration) * 60

		if(packageDuration < parseFloat(body.duration)) {
			additionalDuration     = parseInt((parseFloat(body.duration) - packageDuration) / 60);
			additionalDurationFare = additionalDuration * getDistanceObj(vehicleTypeDocs.distance, body.distance)[0].additionalFarePerHrs
		}

		var response = {
			"_id"         			 : body.vehicleTypeId,
			"type"        			 : vehicleTypeDocs.type,
			"packageName"		     : packageDoc.name,
			"additionalDurationFare" : additionalDurationFare,
			"totalFare"   			 : getRentalEstimationFare(body.distance, vehicleTypeDocs.bkm,vehicleTypeDocs.baseFare, additionalDistance,vehicleTypeDocs.bkm,additionalDurationFare )
		}

		return res.status(200).json({"success":true, "message":"Fetched successfully", "data":response})
	}
	catch(err){
		return res.status(500).json({ 'success': false, 'message': 'Error on the server.', "error": err });
	}
} */
// fareEstimatioSingle

// 20 10 100 2 50 0 0 0
export const getRentalEstimationFare = (
  distance,
  farePerKm,
  bookingFare,
  additionalDistance = 0,
  additionaFarePerKm = 0,
  additionalDurationFare = 0,
  packageHr = 0,
  packageHrRate = 0,
  vehicRentpackfare = 0,
  taxPercentage = 0
) => {
  let fareCalculation;
  var distanceFare = 0;
  // console.log('getRentalEstimationFareTWO', distance, farePerKm, baseFare, additionalDistance, additionaFarePerKm, additionalDurationFare, packageHr, packageHrRate);
  // distanceFare = calculateDistanceFareForRental(packageHr, packageHrRate, distance, farePerKm, baseFare);
  if (vehicRentpackfare) {
    distanceFare = parseFloat(vehicRentpackfare) + parseFloat(bookingFare);
  } else {
    distanceFare = calculateDistanceFareForRental(
      packageHr,
      packageHrRate,
      distance,
      farePerKm,
      bookingFare
    );
  }

  fareCalculation =
    parseFloat(distanceFare) +
    parseFloat(additionalDistance) * additionaFarePerKm;
  // console.log('getRentalEstimationFare', fareCalculation);
  return fareCalculation + parseFloat(additionalDurationFare);
};

function calculateDistanceFareForRental(
  packageHr,
  packageHrRate,
  distance,
  farePerKm,
  baseFare
) {
  // console.log('calculateDistanceFareForRentalON', packageHr, packageHrRate, distance, farePerKm, baseFare)
  let fareCalculation = 0;
  fareCalculation =
    parseFloat(packageHr) * parseFloat(packageHrRate) +
    parseFloat(distance) * parseFloat(farePerKm) +
    parseFloat(baseFare);
  fareCalculation = fareCalculation.toFixed(2);
  // console.log('calculateDistanceFareForRental', fareCalculation)
  return fareCalculation;
}

function getDistanceObj(distanceArray, distanceInKM) {
  var filteredFareOffers;
  if (distanceArray) {
    var filteredFareOffers = _.filter(
      distanceArray,
      (i) =>
        Number(i.distanceFrom) <= Number(distanceInKM) &&
        Number(i.distanceTo) >= Number(distanceInKM)
    );
  }
  // console.log("filteredFareOffers", filteredFareOffers)
  return filteredFareOffers;
}

export const getRentalFareEstimationAtTripEnd = async (
  vehicleTypeId,
  packageId,
  distanceKM,
  timeInMin,
  tollFee = 0,
  bookingType = "rideNow"
) => {
  try {
    let vehicleTypeDocs = await Vehicle.findById(vehicleTypeId, {
      bkm: 1,
      timeFare: 1,
      tripTypeCode: 1,
      packageTimeRate: 1,
      distance: 1,
      type: 1,
      baseFare: 1,
      file: 1,
      description: 1,
      asppc: 1,
      comison: 1,
      taxPercentage: 1,
      bookingFare: 1,
    });

    var additionalDuration = 0;
    var additionalDurationFare = 0;
    var additionalDistance = 0;

    let availableService = await ServiceAvailableCities.find(
      { softDelete: false },
      { cityBoundaryPolygon: 1, city: 1 }
    ).lean();
    var serviceCityId = [];
    for (var value of availableService) {
      if (value.city == "Default") {
        serviceCityId.push(value._id.toString());
      }
    }

    if (featuresSettings.isCityWise) {
      let packageDataScids = await RentalPackage.findById(packageId, {
        name: 1,
        distance: 1,
        duration: 1,
        price: 1,
        scIds: 1,
        mini: 1,
        suv: 1,
        sedan: 1,
      }).lean();
      if (packageDataScids) {
        var packageScids = packageDataScids.scIds;
        packageScids.forEach((element) => {
          serviceCityId.push(element.scId);
        });
      }
    }

    var packageDoc = null;
    /* if (featuresSettings.rentalFareCheckKMFirst) {
			packageDoc = await RentalPackage.findOne({ distance: { $lte: distanceKM }, "scIds.scId": { "$in": serviceCityId } }, { "name": 1, "distance": 1, "duration": 1, "price": 1, "mini": 1, "suv": 1, "sedan": 1 }).sort({ distance: -1 }).lean();
			if (!packageDoc) packageDoc = await RentalPackage.findOne({ "scIds.scId": { "$in": serviceCityId } }, { "name": 1, "distance": 1, "duration": 1, "price": 1, "mini": 1, "suv": 1, "sedan": 1 }).sort({ distance: 1 }).lean()
		} else {
			var hours = (parseFloat(timeInMin) / 60);
			var rhours = Math.floor(hours);
			packageDoc = await RentalPackage.findOne({ duration: { $lte: rhours }, "scIds.scId": { "$in": serviceCityId } }, { "name": 1, "distance": 1, "duration": 1, "price": 1, "mini": 1, "suv": 1, "sedan": 1  }).sort({ duration: -1 }).lean();
			if (!packageDoc) packageDoc = await RentalPackage.findOne({ "scIds.scId": { "$in": serviceCityId } }, { "name": 1, "distance": 1, "duration": 1, "price": 1, "mini": 1, "suv": 1, "sedan": 1  }).sort({ duration: 1 }).lean()
		} */

    //If Same Package as of Estimation
    packageDoc = await RentalPackage.findById(packageId, {
      name: 1,
      distance: 1,
      duration: 1,
      price: 1,
      mini: 1,
      suv: 1,
      sedan: 1,
      fixedRate: 1,
    })
      .sort({ duration: 1 })
      .lean();

    //var singleVehicleRentFare = packageDoc[_.lowerCase(vehicleTypeDocs["type"])];
    var singleVehicleRentFare = null;
    singleVehicleRentFare = _.find(packageDoc.fixedRate, {
      name: vehicleTypeDocs["type"],
    });
    if (singleVehicleRentFare)
      singleVehicleRentFare = singleVehicleRentFare.rate;

    if (Number(packageDoc.distance) < Number(distanceKM)) {
      additionalDistance = (
        parseFloat(distanceKM) - parseFloat(packageDoc.distance)
      ).toFixed(2);
    }

    let packageDuration = parseFloat(packageDoc.duration) * 60;

    if (packageDuration < parseFloat(timeInMin)) {
      // additionalDuration = (parseFloat(timeInMin) - packageDuration) / 60;
      additionalDuration = parseFloat(timeInMin) - packageDuration;
      // additionalDuration = parseFloat(additionalDuration.toFixed(2)); // to exact time
      // additionalDuration = parseInt(additionalDuration);
      //additionalDuration = Math.round(additionalDuration); //to rounded
      var additionalTimeFare = vehicleTypeDocs.timeFare;

      if (vehicleTypeDocs.distance.length) {
        var additionalTimeFareKmWise = getDistanceObj(
          vehicleTypeDocs.distance,
          distanceKM
        )[0].additionalFarePerHrs;
        if (additionalTimeFareKmWise)
          additionalTimeFare = additionalTimeFareKmWise;
      }

      // additionalTimeFare = additionalTimeFare / 60; // Converting per hr to per min rate
      additionalDurationFare = additionalDuration * additionalTimeFare;
      additionalDurationFare = parseFloat(additionalDurationFare.toFixed(2));
    }

    var bookingFare = vehicleTypeDocs.bookingFare
      ? vehicleTypeDocs.bookingFare
      : 0;
    if (bookingType == "rideNow") bookingFare = 0;

    var fareBeforeTax = getRentalEstimationFare(
      packageDoc.distance,
      vehicleTypeDocs.bkm,
      bookingFare,
      additionalDistance,
      vehicleTypeDocs.bkm,
      additionalDurationFare,
      packageDoc.duration,
      vehicleTypeDocs.packageTimeRate,
      singleVehicleRentFare
    );
    fareBeforeTax = (parseFloat(fareBeforeTax) + parseFloat(tollFee)).toFixed(
      2
    );
    var taxAmount = (
      (parseFloat(vehicleTypeDocs.taxPercentage) * parseFloat(fareBeforeTax)) /
      100
    ).toFixed(2);

    var taxTDS = 0;
    if (featuresSettings["taxTDSPercentage"] > 0) {
      taxTDS = (
        (parseFloat(featuresSettings["taxTDSPercentage"]) *
          parseFloat(fareBeforeTax)) /
        100
      ).toFixed(2);
    }
    var totalFare = (
      parseFloat(taxAmount) +
      parseFloat(fareBeforeTax) +
      parseFloat(taxTDS)
    ).toFixed(2);

    var comisonAmt = (vehicleTypeDocs.comison * totalFare) / 100;

    if (Number(config.googleCharge) > 0) {
      totalFare = Number(totalFare) + Number(config.googleCharge);
      comisonAmt = Number(comisonAmt) + Number(config.googleCharge);
    }

    if (featuresSettings.getrentalFareAsPerEstimation) {
      //TODO not needed ?
      var distanceFareForRental = singleVehicleRentFare;
      if (!distanceFareForRental)
        distanceFareForRental = calculateDistanceFareForRental(
          packageDoc.duration,
          vehicleTypeDocs.packageTimeRate,
          packageDoc.distance,
          vehicleTypeDocs.bkm,
          vehicleTypeDocs.baseFare
        );
    } else {
      var distanceFareForRental = calculateDistanceFareForRental(
        packageDoc.duration,
        vehicleTypeDocs.packageTimeRate,
        packageDoc.distance,
        vehicleTypeDocs.bkm,
        vehicleTypeDocs.baseFare
      );
    }

    var hours = Math.floor(timeInMin / 60);
    var minutes = timeInMin % 60;
    var travelTime = "0 Min";
    if (minutes > 0) travelTime = minutes + " Min";
    if (hours > 0) travelTime = hours + " Hrs " + travelTime;

    var response = {
      _id: vehicleTypeDocs._id,
      tripTypeCode: vehicleTypeDocs.tripTypeCode,
      type: vehicleTypeDocs.type,
      BaseFare: vehicleTypeDocs.baseFare,
      bookingFare: bookingFare,
      minFare: vehicleTypeDocs.baseFare,
      minFareAdded: 0,
      distance: distanceKM,
      KMFare: distanceFareForRental,
      perKmRate: vehicleTypeDocs.bkm,
      travelTime: travelTime,
      travelFare: additionalTimeFare
        ? additionalTimeFare
        : vehicleTypeDocs.timeFare,
      pickupCharge: 0, //from trip data
      waitingFare: 0,
      waitingTime: 0,
      totalFareWithOutOldBal: totalFare,
      fareAmtBeforeSurge: totalFare,
      oldCancellationAmt: 0,
      totalFare: totalFare,
      fareBeforeTax: fareBeforeTax,
      comisonAmt: comisonAmt,
      DetuctedFare: 0, //calculate in app.js
      hotelcommisionAmt: 0,
      discountAmt: 0, //calculate in app.js
      tax: taxAmount,
      taxPercentage: vehicleTypeDocs.taxPercentage,
      taxTDS: taxTDS,
      taxTDSPercentage: featuresSettings["taxTDSPercentage"],
      paymentMode: "Cash",
      tranxid: "",
      nightObj: {
        isApply: false,
        percentageIncrease: 1,
      },
      peakObj: {
        isApply: false,
        percentageIncrease: 1,
      },
      discountName: 0, //calculate in app.js
      discountPercentage: 0, //calculate in app.js
      additionalFee: 0, //calculate in app.js

      packageName: packageDoc.name,
      packageDistance: packageDoc.distance,
      packageDuration: packageDoc.duration,
      file: config.baseurl + vehicleTypeDocs.file,
      description: vehicleTypeDocs.description,
      seat: vehicleTypeDocs.asppc,
      packageId: packageDoc._id,

      additionalDurationFare: additionalDurationFare,
      additionalDuration: additionalDuration,
      additionalTimeRate: additionalTimeFare,
      additionalDistance: additionalDistance,
      additionalDistanceFare: (
        parseFloat(additionalDistance) * vehicleTypeDocs.bkm
      ).toFixed(2),
      googleCharge: config.googleCharge.toString(),
    };

    /* var response = {
			"_id": vehicleTypeDocs._id,
			"tripTypeCode": vehicleTypeDocs.tripTypeCode,
			"type": vehicleTypeDocs.type,
			"bkm": vehicleTypeDocs.bkm,
			"timeFare": vehicleTypeDocs.timeFare,
			"tripTypeCode": vehicleTypeDocs.tripTypeCode,
			"type": vehicleTypeDocs.type,
			"BaseFare": vehicleTypeDocs.baseFare,
			"packageName": packageDoc.name,
			"packageDistance": packageDoc.distance,
			"packageDuration": packageDoc.duration,
			"file": config.baseurl + vehicleTypeDocs.file,
			"description": vehicleTypeDocs.description,
			"seat": vehicleTypeDocs.asppc,
			"packageId": packageDoc._id,
			"comisonAmt": 0,
			"totalFare": getRentalEstimationFare(packageDoc.distance, vehicleTypeDocs.bkm, vehicleTypeDocs.baseFare, additionalDistance, vehicleTypeDocs.bkm, additionalDurationFare)
		} */
    return response;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

// --------------------------- Outstation
export const outstationVehicleList = async (req, res) => {
  try {
    let where = {},
      body = req.body,
      serviceCityId = [];
    if (featuresSettings.isCityWise) {
      let availableService = await ServiceAvailableCities.find(
        { softDelete: false },
        { cityBoundaryPolygon: 1, city: 1 }
      ).lean();
      let pickUpPoint = false;
      for (var value of availableService) {
        if (value.city == "Default") {
          serviceCityId.push(value._id);
        } else {
          pickUpPoint = insidePolygon(
            [parseFloat(body.pickupLng), parseFloat(body.pickupLat)],
            value.cityBoundaryPolygon
          );
          if (pickUpPoint) {
            serviceCityId.push(value._id);
            break;
          }
        }
      }
      if (pickUpPoint == false) {
        return res
          .status(400)
          .json({
            message: req.i18n.__("SERVICE_NOT_AVAILABEL_IN_THIS_LOCATION"),
          });
      }
      where = { "scIds.scId": { $in: serviceCityId } };
    }

    let vehicleTypeDocs = await Vehicle.find(
      { tripTypeCode: "outstation", softDel: false },
      {
        bkm: 1,
        timeFare: 1,
        tripTypeCode: 1,
        type: 1,
        baseFare: 1,
        file: 1,
        description: 1,
        asppc: 1,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Details fetched Successfully",
      vehicleList: vehicleTypeDocs,
      serviceDetail: serviceCityId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error on the server.", error: error });
  }
};

export const outstationVehicleListWithFare = async (req, res) => {
  try {
    var startDateInString = req.body.startDay;
    var resData = await getOutstationVehicleListWithFare(req);
    var returnDays = GFunctions.getNextGivenDaysFromHours(
      resData.returnHours,
      startDateInString
    );
    if (resData.success) {
      return res.status(200).json({
        success: true,
        message: "Details fetched Successfully",
        vehicleList: resData.vehicleList,
        serviceDetail: resData.serviceCityId,
        returnHours: resData.returnHours,
        tripDuration: resData.tripDuration,
        depatureValues: returnDays,
      });
    } else {
      return res.status(409).json({
        success: false,
        message: resData.message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error on the server.", error: error });
  }
};

export const getOutstationVehicleListWithFare = async (
  req,
  distanceKMFromMeter,
  timeInMin,
  forType = "estimation",
  additionalFee = null,
  tollFee = 0
) => {
  try {
    let vehicleWhere = {},
      body = req.body,
      serviceCityId = [],
      scID = "";
    var outstationFareOla = {
      upAndDownKM: 0,
      extraHoursAfterPackage: 0,
      extraKMAfterPackage: 0,
      totalChoosenHours: 0,
      remainingRunningHr: 0,
      remainingIdelHr: 0,
      runningTimeRate: 0,
      idelTimeRate: 0,
      kmReducedPerExtraHr: 0,
      outstationType: "oneway",
    };

    if (featuresSettings.isCityWise && forType == "estimation") {
      let availableService = await ServiceAvailableCities.find(
        { softDelete: false },
        { cityBoundaryPolygon: 1, city: 1 }
      ).lean();
      let pickUpPoint = false,
        dropPoint = false;
      for (var value of availableService) {
        if (value.city == "Default") {
          serviceCityId.push(value._id);
        } else {
          if (value.cityBoundaryPolygon.length) {
            pickUpPoint = insidePolygon(
              [parseFloat(body.pickupLng), parseFloat(body.pickupLat)],
              value.cityBoundaryPolygon
            );
            if (pickUpPoint) {
              serviceCityId.push(value._id);
              scID = value._id;
              // dropPoint = true
              break;
            }
          }
        }
      }
      if (pickUpPoint == false) {
        return {
          success: false,
          message: req.i18n.__("SERVICE_NOT_AVAILABEL_IN_THIS_LOCATION"),
        };
      }

      if (
        pickUpPoint &&
        typeof body.dropLat != "undefined" &&
        body.dropLat != "" &&
        typeof body.dropLng != "undefined" &&
        body.dropLng != ""
      ) {
        let dropPoint = false;

        var availableServiceCity = _.find(availableService, { _id: scID });
        if (
          availableServiceCity &&
          availableServiceCity.cityBoundaryPolygon.length
        ) {
          dropPoint = insidePolygon(
            [parseFloat(body.dropLng), parseFloat(body.dropLat)],
            availableServiceCity.cityBoundaryPolygon
          );
          //console.log(point)
          // if (dropPoint) {
          // 	// break;
          // }
        }

        if (dropPoint) {
          return {
            success: false,
            message: req.i18n.__("DROP_LOCATION_SHOULD_BE_OUT_OF_BOUNDARY"),
          };
        }
      }
      // if (dropPoint) { return { 'success': false, 'message': "Outstation trip should be out of boundary" } }
      vehicleWhere = { "scIds.scId": { $in: serviceCityId } };

      if (req.cityWise == "exists") {
        var serviceExists = _.find(req.scId, mongoose.Types.ObjectId(scID));
        if (!serviceExists)
          return {
            success: false,
            message: req.i18n.__(
              "NO_PERMISSION_TO_DISPATCH_FROM_THIS_LOCATION"
            ),
          };
      }
    }

    var startDT = GFunctions.getDateTimeinThisFormat(
      req.body.startDay,
      "D MMM YYYY, HH:mm a"
    );
    var endDT;

    if (forType == "estimation") {
      //Distance Calculation
      const from = body.pickupLat + "," + body.pickupLng;
      const to = body.dropLat + "," + body.dropLng;
      var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
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
      var timeInHours = parseFloat(timeInMinutes / 60).toFixed(2);
      //Distance Calculation
      //var distanceKM = distanceInUnit * 2; //For both type estimation
      //var durationInHour = timeInHours * 2; //if oneway trip
      var distanceKM = distanceInUnit;
      var durationInHour = timeInHours;

      outstationFareOla["googleDistance"] = distanceKM;
      if (body.outstationType == "round") {
        distanceKM = distanceInUnit * 2; //For both type estimation
        // durationInHour = timeInHours * 2; //if oneway trip
        // timeInMin = timeInMinutes;
      }
      outstationFareOla["upAndDownKM"] = distanceKM;
      outstationFareOla["googleTime"] = durationInHour;

      // endDT = GFunctions.getEndDateFromStart(startDT, durationInHour, 'hours');//startDT + durationInHour
      endDT = GFunctions.getEndDateFromStart(startDT, 0, "hours"); //end only
      if (body.outstationType == "oneway") {
        endDT = GFunctions.getEndDateFromStart(
          startDT,
          durationInHour,
          "hours"
        ); //end only
      }
      //console.log('endDT1', endDT);
    }

    var extraHours = 0,
      hillFare = 0;
    if (forType == "finalamount") {
      var distanceKM = distanceKMFromMeter;
      var distanceInUnit = distanceKM;
      var durationInHour = parseFloat(timeInMin / 60).toFixed(2);
      var timeInHours = durationInHour;
      var gdmResult = {
        distanceLable: distanceKM + " KM",
        pickupLocation: "",
        dropLocation: "",
        timeLable: GFunctions.convertHrToLable(durationInHour),
      };
      //var totalTraveledTime = distanceKMFromMeter / 50; //actual travel time approx.
      //extraHours =  durationInHour - totalTraveledTime;
      hillFare = req.body.hillFare;
      startDT = req.body.startTime;
      endDT = req.body.endTime;

      outstationFareOla["googleDistance"] = distanceKM;
      outstationFareOla["upAndDownKM"] = distanceKM;
      outstationFareOla["googleTime"] = Number(
        outstationFareOla["googleDistance"] / 55
      ).toFixed(2);
      // outstationFareOla['googleTime'] = durationInHour;
    }

    body.outstationType = body.outstationType ? body.outstationType : "oneway";
    outstationFareOla["outstationType"] = body.outstationType;

    //Package selection
    var outstationCon = {};
    if (forType == "estimation") {
      outstationCon = {
        distance: { $lte: distanceKM },
        "scIds.scId": { $in: serviceCityId },
        jouneyType: body.outstationType,
      };
    } else if (forType == "finalamount") {
      let availableService = await ServiceAvailableCities.find(
        { softDelete: false },
        { cityBoundaryPolygon: 1, city: 1 }
      ).lean();
      let pickUpPoint = false,
        dropPoint = false;
      for (var value of availableService) {
        if (value.city == "Default") {
          serviceCityId.push(value._id);
        } else {
          if (value.cityBoundaryPolygon.length) {
            pickUpPoint = insidePolygon(
              [parseFloat(body.pickupLng), parseFloat(body.pickupLat)],
              value.cityBoundaryPolygon
            );
            if (pickUpPoint) {
              serviceCityId.push(value._id);
              scID = value._id;
              // dropPoint = true
              break;
            }
          }
        }
      }
      outstationCon = {
        distance: { $lte: distanceKM },
        "scIds.scId": { $in: serviceCityId },
        jouneyType: body.outstationType,
      };
    }
    let packageDoc = await OutstationPackage.find(outstationCon, {
      name: 1,
      distance: 1,
      duration: 1,
      price: 1,
      fixedRate: 1,
      fixedRateForRoundTrip: 1,
      jouneyType: 1,
      scIds: 1,
    })
      .sort({ distance: -1 })
      .limit(2)
      .lean();
    if (!packageDoc.length) {
      // outstationCon = {
      // 	"scIds.scId": { "$in": serviceCityId } //that actual trip scid
      // }
      outstationCon = {
        "scIds.scId": { $in: serviceCityId },
        jouneyType: body.outstationType,
      };
      packageDoc = await OutstationPackage.find(outstationCon, {
        name: 1,
        distance: 1,
        duration: 1,
        price: 1,
        fixedRate: 1,
        fixedRateForRoundTrip: 1,
        jouneyType: 1,
        scIds: 1,
      })
        .sort({ distance: 1 })
        .limit(2)
        .lean();
      if (!packageDoc.length) {
        outstationCon = {
          jouneyType: body.outstationType,
        };
        packageDoc = await OutstationPackage.find(outstationCon, {
          name: 1,
          distance: 1,
          duration: 1,
          price: 1,
          fixedRate: 1,
          fixedRateForRoundTrip: 1,
          jouneyType: 1,
          scIds: 1,
        })
          .sort({ distance: 1 })
          .lean();
      }
    }
    //Package selection

    if (featuresSettings.checkDuplication) {
      packageDoc = _.map(packageDoc, (el) => {
        el.scity = el.scIds[0].name;
        return el;
      });
      var filterBy = "distance";
      packageDoc = await getPreferedDetails(packageDoc, filterBy);
    }
    packageDoc = packageDoc[0];

    var hours = Math.floor(timeInMin / 60);
    var minutes = timeInMin % 60;
    var travelTime = "0 Min";
    if (minutes > 0) travelTime = minutes + " Min";
    if (hours > 0) travelTime = hours + " Hrs " + travelTime;

    var tripDuration = gdmResult.timeLable;
    if (body.outstationType == "round" && forType == "estimation") {
      req.body.startDay = GFunctions.getDateTimeinThisFormat(
        req.body.startDay,
        "D MMM YYYY, HH:mm a"
      );
      req.body.returnDay = GFunctions.getDateTimeinThisFormat(
        req.body.returnDay,
        "D MMM YYYY, HH:mm a"
      );
      var isBefore = moment(req.body.returnDay).isBefore(req.body.startDay);
      if (isBefore)
        req.body.returnDay = GFunctions.addYearToGivenDate(
          req.body.returnDay,
          1
        );
      var extraHours = GFunctions.getHoursBtDateTime(
        req.body.returnDay,
        req.body.startDay
      );
      var tripReturnHours = Number(timeInMin / 60);
      var travelTimeInHours = Number(extraHours) + Number(timeInMin / 60);
      outstationFareOla["totalChoosenHours"] = extraHours; // actual choosend time
      extraHours = travelTimeInHours;
      travelTimeInHours = Math.abs(travelTimeInHours); // Change to positive
      var decimal = travelTimeInHours - Math.floor(travelTimeInHours);
      var mins = (decimal * 60).toFixed(0);
      if (mins > 0) tripDuration = tripDuration + " " + mins + " Mins";
      gdmResult.timeLable = tripDuration;
      // if (durationInHour < Number(extraHours)) {
      // 	extraHours = (Number(extraHours) - Number(durationInHour)).toFixed(2);
      // }
      //distanceInUnit = distanceInUnit * 2;
      endDT = GFunctions.getEndDateFromStart(req.body.returnDay, 0, "hours"); //enddt only
      // endDT = GFunctions.getEndDateFromStart(req.body.returnDay, durationInHour, 'hours');//enddt + durationInHour
      //console.log('endDT',endDT);
      gdmResult.distanceLable = distanceKM + " Km";
    }

    if (
      Number(packageDoc.duration) <
      Number(outstationFareOla["totalChoosenHours"])
    ) {
      tripDuration = GFunctions.convertHrToLable(
        outstationFareOla["totalChoosenHours"]
      );
    }
    /*	else {
				tripDuration = GFunctions.convertHrToLable(Number(packageDoc.duration));
			}*/
    // if (Number(distanceKM) < 20) {
    // 	return { 'success': false, 'message': "Outstation trip distance should be more than 20KM" }
    // }
    // vehicleWhere = { tripTypeCode: 'outstation', softDel: false };
    vehicleWhere.tripTypeCode = "outstation";
    vehicleWhere.softDel = false;
    if (req.body.vehicleTypeId) vehicleWhere._id = req.body.vehicleTypeId;
    else if (req.body.driverId) {
      var findDriverCurVehicle = await Driver.findOne(
        { _id: req.body.driverId },
        { currentTaxi: 1, curService: 1 }
      );
      // vehicleWhere._id = findDriverCurVehicle.currentTaxi
      vehicleWhere.type = findDriverCurVehicle.curService;
    }
    // vehicleWhere.type = 'Small'; //REMOVE
    let vehicleTypeDocs = await Vehicle.find(vehicleWhere, {
      bkm: 1,
      timeFare: 1,
      timeFareForIdel: 1,
      tripTypeCode: 1,
      timeFareForIdelOneway: 1,
      timeFareOneway: 1,
      type: 1,
      baseFare: 1,
      file: 1,
      description: 1,
      asppc: 1,
      comison: 1,
      distance: 1,
      taxPercentage: 1,
      bookingFare: 1,
      nightRate: 1,
      dayRate: 1,
      nightHours: 1,
      baseFareForRoundTrip: 1,
      bkmForRoundTrip: 1,
      kmReducedPerExtraHr: 1,
      scIds: 1,
    }).sort({ displayorder: 1 });
    var responseData = [];
    var additionalDistance = 0;

    if (Number(packageDoc.distance) < Number(distanceKM)) {
      additionalDistance = (
        parseFloat(distanceKM) - parseFloat(packageDoc.distance)
      ).toFixed(2);
      outstationFareOla["extraKMAfterPackage"] = additionalDistance;
    }

    //Final fare
    var additionalDuration = 0;
    var additionalDurationFare = 0;
    var additionalTimeFare = 0;
    if (forType == "finalamount") {
      let packageDuration = parseFloat(packageDoc.duration) * 60;
      if (packageDuration < parseFloat(timeInMin)) {
        additionalDuration = (parseFloat(timeInMin) - packageDuration) / 60;
        additionalDuration = Math.round(additionalDuration);
        // additionalDuration = parseInt(additionalDuration);
        additionalTimeFare = vehicleTypeDocs[0].timeFare;

        var additionalTimeFareKmWise = getDistanceObj(
          vehicleTypeDocs[0].distance,
          distanceKM
        );
        if (additionalTimeFareKmWise.length) {
          additionalTimeFare = additionalTimeFareKmWise[0].additionalFarePerHrs;
        }
        additionalDurationFare = additionalDuration * additionalTimeFare;
        extraHours = additionalDuration;
      }

      var totalHrs = (parseFloat(timeInMin) / 60).toFixed(2);
      outstationFareOla["totalChoosenHours"] = Number(totalHrs); // actual choosend time
    }
    //Final fare

    if (
      Number(packageDoc.duration) <
      Number(outstationFareOla["totalChoosenHours"])
    ) {
      extraHours = (
        Number(outstationFareOla["totalChoosenHours"]) -
        Number(packageDoc.duration)
      ).toFixed(2);
      outstationFareOla["extraHoursAfterPackage"] = extraHours;
    } else {
      extraHours = 0;
      if (body.outstationType == "oneway" && forType == "estimation") {
        if (
          Number(packageDoc.duration) < Number(outstationFareOla["googleTime"])
        ) {
          extraHours = (
            Number(outstationFareOla["googleTime"]) -
            Number(packageDoc.duration)
          ).toFixed(2);
          extraHours = Number(extraHours);
        }
      }
      outstationFareOla["extraHoursAfterPackage"] = extraHours;
    }

    outstationFareOla["remainingRunningHr"] = (
      Number(outstationFareOla["googleTime"]) - Number(packageDoc.duration)
    ).toFixed(2);
    outstationFareOla["remainingIdelHr"] = (
      Number(outstationFareOla["totalChoosenHours"]) -
      Number(outstationFareOla["remainingRunningHr"]) -
      Number(packageDoc.duration)
    ).toFixed(2);

    // var noOfDays = GFunctions.getDaysBtDateTime(endDT, startDT);//trip end time
    // var noOfDays = GFunctions.getNoOfDaysForOutstation(outstationFareOla['totalChoosenHours']);//trip end time
    vehicleTypeDocs.forEach((element) => {
      var singleVehicleRentFare = null;
      singleVehicleRentFare = _.find(packageDoc.fixedRate, {
        name: element["type"],
      });

      /*	if(body.outstationType == 'round'){
					singleVehicleRentFare = _.find(packageDoc.fixedRateForRoundTrip, {name :  element["type"] });
				}else{
					singleVehicleRentFare = _.find(packageDoc.fixedRate, {name :  element["type"] });
				}*/
      if (singleVehicleRentFare)
        singleVehicleRentFare = singleVehicleRentFare.rate;

      var additionalTimeFareNew = element.timeFare;
      if (body.outstationType == "oneway") {
        if (Number(element.timeFareOneway) > 0) {
          additionalTimeFareNew = element.timeFareOneway
            ? element.timeFareOneway
            : element.timeFare;
        }
      }

      if (forType == "finalamount") {
        var additionalTimeFareKmWise = getDistanceObj(
          vehicleTypeDocs[0].distance,
          distanceKM
        );
        if (additionalTimeFareKmWise.length) {
          additionalTimeFare = additionalTimeFareKmWise[0].additionalFarePerHrs;
          additionalTimeFareNew = additionalTimeFareKmWise;
        }
      } else {
        var additionalTimeFareKmWise = getDistanceObj(
          element.distance,
          distanceKM
        );
        if (additionalTimeFareKmWise.length) {
          additionalTimeFareKmWise =
            additionalTimeFareKmWise[0].additionalFarePerHrs;
          additionalTimeFareNew = additionalTimeFareKmWise;
        }
      }

      var bkm = element.bkm;
      var baseFare = element.baseFare;
      var bookingFare = element.bookingFare;
      if (body.outstationType == "round") {
        bkm = element.bkmForRoundTrip ? element.bkmForRoundTrip : bkm;
        baseFare = element.baseFareForRoundTrip
          ? element.baseFareForRoundTrip
          : baseFare;
      }

      outstationFareOla["runningTimeRate"] = element.timeFare;
      outstationFareOla["idelTimeRate"] = element.timeFareForIdel
        ? element.timeFareForIdel
        : element.timeFare;
      outstationFareOla["kmReducedPerExtraHr"] = element.kmReducedPerExtraHr
        ? element.kmReducedPerExtraHr
        : 0;

      if (body.outstationType == "oneway") {
        if (Number(element.timeFareOneway) > 0) {
          outstationFareOla["runningTimeRate"] = element.timeFareOneway;
          outstationFareOla["idelTimeRate"] = element.timeFareForIdelOneway
            ? element.timeFareForIdelOneway
            : element.timeFareOneway;
        }
      }

      var totalFare = getOutstationEstimationFare(
        packageDoc.distance,
        bkm,
        bookingFare,
        additionalDistance,
        bkm,
        additionalTimeFareNew,
        extraHours,
        gdmResult.to,
        hillFare,
        singleVehicleRentFare,
        outstationFareOla,
        tollFee
      );

      var noOfDays = GFunctions.getDaysBtDateTime(
        endDT,
        startDT,
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
        element.nightHours[0]
      ); //trip end time
      var noOfNights = GFunctions.getNightsBtDateTimeNewMtd(
        element.nightHours[0],
        endDT,
        startDT
      );
      console.log('noOfNights',noOfNights);

      var nightFare = (
        parseFloat(noOfNights) * parseFloat(element.nightRate)
      ).toFixed(2);
      console.log("________________nightFare");
      var dayFare = (
        parseFloat(noOfDays) * parseFloat(element.dayRate)
      ).toFixed(2);
      // console.log('nightFare',nightFare,dayFare)
      //adding tax
      var fareBeforeTax = totalFare.totalFare;
      fareBeforeTax = (
        parseFloat(fareBeforeTax) +
        parseFloat(nightFare) +
        parseFloat(dayFare)
      ).toFixed(2);
      var taxAmount = (
        (parseFloat(element.taxPercentage) * parseFloat(fareBeforeTax)) /
        100
      ).toFixed(2);

      var taxTDS = 0;
      if (featuresSettings["taxTDSPercentage"] > 0) {
        taxTDS = (
          (parseFloat(featuresSettings["taxTDSPercentage"]) *
            parseFloat(fareBeforeTax)) /
          100
        ).toFixed(2);
      }
      var totalFareWithTax = (
        parseFloat(taxAmount) +
        parseFloat(fareBeforeTax) +
        parseFloat(taxTDS)
      ).toFixed(2);
      // console.log('totalFareWithTax', totalFareWithTax);

      //adding tax
      if (Number(config.googleCharge) > 0) {
        fareBeforeTax = Number(fareBeforeTax) + Number(config.googleCharge);
      }
      var comisonAmt = ((element.comison * totalFareWithTax) / 100).toFixed(2);
      var otherDetails = {
        BaseFare: baseFare.toString(),
        bookingFare: bookingFare.toString(),
        minFare: baseFare.toString(),
        minFareAdded: 0,
        distance: distanceKM.toString(),
        KMFare: totalFare.baseFare,
        perKmRate: bkm.toString(),
        perKmRateRound: element.bkmForRoundTrip.toString(),
        travelTime: travelTime.toString(),
        travelFare: outstationFareOla["runningTimeRate"],
        pickupCharge: "0", //from trip data
        waitingFare: "0",
        waitingTime: "0",
        totalFareWithOutOldBal: totalFareWithTax.toString(),
        fareAmtBeforeSurge: totalFareWithTax.toString(),
        oldCancellationAmt: "0",
        totalFare: totalFareWithTax.toString(),
        DetuctedFare: "0", //calculate in app.js
        hotelcommisionAmt: "0",
        discountAmt: "0", //calculate in app.js
        fareBeforeTax: fareBeforeTax,
        tax: taxAmount,
        taxPercentage: element.taxPercentage,
        paymentMode: "Cash",
        tranxid: "",
        nightObj: {
          isApply: false,
          percentageIncrease: 1,
        },
        peakObj: {
          isApply: false,
          percentageIncrease: 1,
        },
        discountName: "0", //calculate in app.js
        discountPercentage: "0", //calculate in app.js
        additionalFee: "0", //calculate in app.js
        packageDistance: packageDoc.distance.toString(),
        packageDuration: packageDoc.duration.toString(),
        seat: element.asppc.toString(),
        comison: element.comison.toString(),
        comisonAmt: comisonAmt.toString(),

        extraHours: extraHours.toString(),
        additionalTimeFareNew: additionalTimeFareNew.toString(),

        additionalDurationFare: totalFare.extraTimeFare
          ? totalFare.extraTimeFare
          : 0,
        additionalDuration: additionalDuration.toString(),
        additionalTimeRate: additionalTimeFare.toString(),
        additionalDistance: totalFare.remainingKM.toString(),
        additionalDistanceFare: totalFare.remainingFare,

        packageId: packageDoc._id,
        packageName: packageDoc.name,

        tax: taxAmount, //Todo here from vehicle data
        taxPercentage: element.taxPercentage, //Todo here from vehicle data

        taxTDS: taxTDS, //Todo here from vehicle data
        taxTDSPercentage: featuresSettings["taxTDSPercentage"], //Todo here from vehicle data

        fareBeforeTax: fareBeforeTax,

        noOfNights: noOfNights,
        nightFare: nightFare,
        noOfDays: noOfDays,
        dayFare: dayFare,
        nightRate: element.nightRate,
        dayRate: element.dayRate,
        googleCharge: config.googleCharge.toString(),
      };
      totalFare = Object.assign(totalFare, otherDetails);

      responseData.push({
        _id: element._id,
        packageId: packageDoc._id,
        packageName: packageDoc.name,
        type: element.type,
        vehicle: element.type,
        tripTypeCode: element.tripTypeCode,
        fareDetails: totalFare,
        file: config.baseurl + element.file,
        description: element.description,
        asppc: element.asppc.toString(),
        timeFare: element.timeFare.toString(),
        bkm: element.bkm.toString(),
        distanceLable: gdmResult.distanceLable,
        timeLable: gdmResult.timeLable,
        pickupLocation: gdmResult.from,
        dropLocation: gdmResult.to,
        comison: element.comison.toString(),
        comisonAmt: comisonAmt.toString(),
        conveyancePerKm: (0).toString(),
        cancelationFeesDriver: (0).toString(),
        cancelationFeesRider: (0).toString(),
        distanceKMUpAndDown: distanceKM.toString(),
        durationInHourUpAndDown: durationInHour.toString(),
        distanceKM: distanceInUnit.toString(),
        durationInHour: timeInHours.toString(),
        scity: element.scIds[0].name,
      });
    });
    if (featuresSettings.checkDuplication) {
      var filterBy = "type";
      responseData = await getPreferedDetails(responseData, filterBy);
    }
    return {
      success: true,
      message: "Details fetched Successfully",
      vehicleList: responseData,
      serviceDetail: serviceCityId,
      returnHours: Math.ceil(durationInHour),
      tripDuration: tripDuration,
    };
  } catch (error) {
    console.log("getOutstationVehicleListWithFare", error);
    var errMsg = error.msg;
    if (!errMsg) errMsg = "Error on the server.";
    return { success: false, message: errMsg, error: error };
  }
};

export const getOutstationEstimationFare = (
  distance,
  farePerKm,
  bookingFare,
  additionalDistance = 0,
  additionaFarePerKm = 0,
  additionalDurationFare = 0,
  extraHours = 0,
  endPlace = "Drop Location",
  additionalFee = 0,
  singleVehicleFare = 0,
  outstationFareOla = {},
  tollFee = 0
) => {
  try {
    let fareCalculation = {};
    // if (singleVehicleFare > 0) {
    // 	fareCalculation['baseFare'] = (parseFloat(singleVehicleFare)).toFixed(2);
    // } else {
    // 	fareCalculation['baseFare'] = ((parseFloat(distance) * parseFloat(farePerKm)) + parseFloat(baseFare)).toFixed(2);
    // }
    fareCalculation["baseFareLabel"] = distance + " KMs";
    // fareCalculation['remainingFare'] = ((parseFloat(additionalDistance) * additionaFarePerKm)).toFixed(2);
    // fareCalculation['remainingFare'] = ((parseFloat(outstationFareOla.extraKMAfterPackage) * additionaFarePerKm)).toFixed(2);

    fareCalculation["extraTimeFare"] = "0";
    // if (extraHours > 0) {
    // 	fareCalculation['extraTimeFare'] = ((parseFloat(additionalDurationFare) * extraHours)).toFixed(2);
    // }
    // if (outstationFareOla.extraHoursAfterPackage > 0) {
    // 	fareCalculation['extraTimeFare'] = ((parseFloat(outstationFareOla.idelTimeRate) * outstationFareOla.extraHoursAfterPackage)).toFixed(2);
    // }

    // fareCalculation['totalFare'] = (Number(fareCalculation['baseFare']) + Number(fareCalculation['remainingFare']) + Number(fareCalculation['extraTimeFare'])).toFixed(2);

    // OLA modal
    // var baseFare = Base Fare Flat + (remainingRunningHr * runningTimeRate) + (remainingIdelHr * idelTimeRate);
    // var remainingKM = extraKMAfterPackage - (extraHoursAfterPackage * kmReducedPerExtraHr);
    // var fare = baseFare + remainingKM + bata + night bata;
    //

    if (
      outstationFareOla.outstationType == "round" ||
      outstationFareOla.outstationType == "oneway"
    ) {
      var remainingRunningHrFare = 0;
      if (Number(outstationFareOla.extraHoursAfterPackage) > 0) {
        remainingRunningHrFare =
          Number(outstationFareOla.remainingRunningHr) *
          Number(outstationFareOla.runningTimeRate);
      }
      var remainingIdelHrFare = 0;
      if (
        Number(outstationFareOla.extraHoursAfterPackage) > 0 &&
        Number(outstationFareOla.remainingIdelHr) > 0
      ) {
        remainingIdelHrFare =
          Number(outstationFareOla.remainingIdelHr) *
          Number(outstationFareOla.idelTimeRate);
      }

      /*	var baseFare = (
					Number(singleVehicleFare) +
					(Number(remainingRunningHrFare)) +
					(Number(remainingIdelHrFare))
				).toFixed(2);*/

      var baseFare = Number(singleVehicleFare).toFixed(2);

      var extraTimeFare = (
        Number(remainingRunningHrFare) + Number(remainingIdelHrFare)
      ).toFixed(2);

      var remainingKM = (
        Number(outstationFareOla.extraKMAfterPackage) -
        Number(outstationFareOla.extraHoursAfterPackage) *
          Number(outstationFareOla.kmReducedPerExtraHr)
      ).toFixed(2);

      var remainingKMFare = 0;
      if (Number(remainingKM) > 0) {
        remainingKMFare = (
          Number(remainingKM) * Number(additionaFarePerKm)
        ).toFixed(2);
      }
      if (Number(remainingKM) < 0) {
        remainingKM = 0;
      }

      fareCalculation["baseFare"] = baseFare;
      fareCalculation["bookingFee"] = bookingFare;
      fareCalculation["remainingKM"] = remainingKM;
      fareCalculation["remainingFare"] = remainingKMFare;
      fareCalculation["extraTimeFare"] = extraTimeFare;

      fareCalculation["remainingFareLabel"] =
        remainingKM + " KMs * " + additionaFarePerKm;
      fareCalculation["remainingTimeFareLabel"] =
        outstationFareOla.extraHoursAfterPackage +
        " Hrs * " +
        outstationFareOla.idelTimeRate;

      var fare = (
        Number(baseFare) +
        Number(remainingKMFare) +
        Number(extraTimeFare) +
        Number(bookingFare) +
        Number(tollFee)
      ).toFixed(2);
    } else {
      var remainingKMFare = (
        Number(outstationFareOla.extraKMAfterPackage) *
        Number(additionaFarePerKm)
      ).toFixed(2);
      var extraTimeFare = (
        Number(outstationFareOla.extraHoursAfterPackage) *
        Number(outstationFareOla.runningTimeRate)
      ).toFixed(2);
      fareCalculation["baseFare"] = Number(singleVehicleFare);
      fareCalculation["bookingFee"] = bookingFare;
      fareCalculation["remainingKM"] = Number(
        outstationFareOla.extraKMAfterPackage
      );
      fareCalculation["remainingFare"] = remainingKMFare;
      fareCalculation["extraTimeFare"] = extraTimeFare;

      fareCalculation["remainingFareLabel"] =
        fareCalculation["remainingKM"] + " KMs * " + additionaFarePerKm;
      fareCalculation["remainingTimeFareLabel"] =
        outstationFareOla.extraHoursAfterPackage +
        " Hrs * " +
        outstationFareOla.runningTimeRate;

      var fare = (
        Number(fareCalculation["baseFare"]) +
        Number(remainingKMFare) +
        Number(extraTimeFare) +
        Number(bookingFare) +
        Number(tollFee)
      ).toFixed(2);
    }

    fareCalculation["totalFare"] = fare;
    if (featuresSettings.addAdditionalFaresInTrip) {
      fareCalculation["totalFare"] =
        Number(fareCalculation["totalFare"]) + Number(additionalFee);
    }

    // console.log('outstationFareOla', outstationFareOla);
    // console.log('fareCalculation', fareCalculation);

    /* 	fareCalculation['description'] = `<!DOCTYPE html ><html>
			<body>
			<ul>
			<li>Excludes Toll Charge, Parkings, Permits and State Tax.</li>
			<li>${config.currencySymbol}${additionaFarePerKm}/Km will be charged for additional Kms.</li>
			<li>${config.currencySymbol}${additionalDurationFare}/hr will be charged for additional hours.</li>
			<li>Extra fare may apply if you don't end trip at ${endPlace}.</li>
			</ul></body></html>`; */

    var dataObj = {
      CURRENCYSYMBOL: config.currencySymbol,
      ADDITIONALFAREPERKM: additionaFarePerKm,
      ADDITIONALDURATIONFARE: additionalDurationFare,
      ENDPLACE: endPlace,
    };
    fareCalculation["description"] = GFunctions.convertLableDynamically(
      rentalConfig.dynamicDescription,
      dataObj
    );

    return fareCalculation;
  } catch (error) {
    console.log(error);
  }
};

function addAdditionalFaresInTrip(arrayValue) {
  var additionalFares = 0;
  if (arrayValue) {
    arrayValue.forEach((element, index, array) => {
      additionalFares = additionalFares + Number(element.amount);
    });
  }
  return additionalFares;
}

export const checkDropLocation = async (params) => {
  try {
    if (!featuresSettings.checkDropLocationForBoundery)
      return { success: false, extraKM: 0, totalKm: params.distanceInKM };
    let where = {},
      serviceCityId = [],
      dropCity = [];
    //Hardcore to Madurai, but need to get from pickup point = save that in trip start location.
    let availableService = await ServiceAvailableCities.find(
      {
        softDelete: false,
        _id: params.serviceId,
      },
      {
        cityBoundaryPolygon: 1,
        city: 1,
        centerPoint: 1,
        approxBoundaryKMFromCenter: 1,
      }
    ).lean();
    let dropPoint = false;
    for (var value of availableService) {
      if (value.city == "Default") {
        dropCity.push(value.city);
        serviceCityId.push(value._id);
      } else {
        dropPoint = insidePolygon(
          [parseFloat(params.dropLng), parseFloat(params.dropLat)],
          value.cityBoundaryPolygon
        );
        if (dropPoint) {
          dropCity.push(value.city);
          serviceCityId.push(value._id);
          break;
        }
      }
    }

    if (dropPoint == false) {
      var from = params.dropLat + "," + params.dropLng;
      var to =
        availableService[0].centerPoint[1] +
        "," +
        availableService[0].centerPoint[0];
      var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
      console.log("_________________ gdmResult",gdmResult)
      var extraKM = parseFloat(gdmResult.distanceValue / 1000).toFixed(2);
      console.log("_________________ extraKM",extraKM)

      if (Number(extraKM) > availableService[0].approxBoundaryKMFromCenter) {
        extraKM =
          Number(extraKM) - availableService[0].approxBoundaryKMFromCenter;
        params.distanceInKM = Number(params.distanceInKM) + Number(extraKM);
      }
      return { success: true, extraKM: extraKM, totalKm: params.distanceInKM };
    } else {
      return { success: true, extraKM: 0, totalKm: params.distanceInKM };
    }
  } catch (error) {
    console.log(error);
    return { success: false, extraKM: 0, totalKm: params.distanceInKM };
  }
};

export const rentalPackageInvoiceDetails = async (
  tripData,
  stringify = true
) => {
  try {
    if (tripData) {
      var tripType = tripData.triptype;
      var remainingFareLabel =
        tripData.extraKM +
        " * " +
        tripData.perKmRate +
        "/" +
        config.distanceSymbol;
      if (tripData.remainingFareLabel)
        remainingFareLabel = tripData.remainingFareLabel;

      var invoiceDetails = [
        {
          label: "Distance",
          value: tripData.distanceKM,
          desc: "",
        },
        {
          label: "Duration",
          value: tripData.estTime,
          desc: "",
        },
        {
          label: "Package",
          value: tripData.packageName,
          desc: "",
        },
        {
          label: "Package Fare",
          value: config.currencySymbol + " " + tripData.distfare,
          desc: "Fare For " + tripData.baseKM + " KM",
        },
        {
          label: "Fare For Remaining KM ",
          value: config.currencySymbol + " " + tripData.fareForExtraKM,
          desc: remainingFareLabel,
        },
      ];

      if (tripData.fareForExtraTime > 0) {
        invoiceDetails.push({
          label: "Fare For Additional Hours",
          value: config.currencySymbol + " " + tripData.fareForExtraTime,
          // 'desc': tripData.extraTime + ' * ' + tripData.timefare + '/Hr',
          desc: tripData.timefare + "/Min",
        });
      }

      if (tripData.BaseFare > 0) {
        invoiceDetails.push({
          label: "Base Fare",
          value: config.currencySymbol + " " + tripData.BaseFare,
          desc: "",
        });
      }

      if (tripData.booking > 0) {
        invoiceDetails.push({
          label: "Booking Fare",
          value: config.currencySymbol + " " + tripData.booking,
          desc: "",
        });
      }

      if (tripData.dayFare > 0) {
        invoiceDetails.push({
          label: "Day Bata",
          value: config.currencySymbol + " " + tripData.dayFare,
          desc: "",
        });
      }

      if (tripData.nightFare > 0) {
        invoiceDetails.push({
          label: "Night Fare",
          value: config.currencySymbol + " " + tripData.nightFare,
          desc: "",
        });
      }

      if (tripData.tax > 0) {
        invoiceDetails.push({
          label: "GST " + tripData.taxPercentage + "%",
          value: config.currencySymbol + " " + tripData.tax,
          desc: "",
        });
      }

      if (tripData.taxTDS > 0) {
        invoiceDetails.push({
          label: "TDS Tax " + tripData.taxTDSPercentage + "%",
          value: config.currencySymbol + " " + tripData.taxTDS,
          desc: "",
        });
      }

      if (tripData.conveyance > 0) {
        invoiceDetails.push({
          label: "Pick Up Charge",
          value: config.currencySymbol + " " + tripData.conveyance,
          desc: "",
        });
      }

      if (Number(config.googleCharge) > 0) {
        invoiceDetails.push({
          label: "Google Charge",
          value: config.currencySymbol + " " + config.googleCharge,
          desc: "",
        });
      }

      if (tripData.hillFare > 0) {
        invoiceDetails.push({
          label: "Hill Charge",
          value: config.currencySymbol + " " + tripData.hillFare,
          desc: "",
        });
      }

      if (tripData.tollFee > 0) {
        invoiceDetails.push({
          label: "Toll Fee",
          value: config.currencySymbol + " " + tripData.tollFee,
          desc: "",
        });
      }

      if (tripData.oldCancellationAmt > 0) {
        invoiceDetails.push({
          label: "Old Cancelation Fee",
          value: config.currencySymbol + " " + tripData.oldCancellationAmt,
          desc: "",
        });
      }

      if (tripData.gatewayCharge > 0) {
        invoiceDetails.push({
          label: "Gateway Charge",
          value: config.currencySymbol + " " + tripData.gatewayCharge,
          desc: "",
        });
      }

      invoiceDetails.push({
        label: "Total Fare",
        value: config.currencySymbol + " " + tripData.cost,
        desc: "",
      });
    }

    // return		JSON.stringify({ 'foo': 1, 'bar': 2, 'baz': { 'quux': 3 } }, null, 't');
    // return invoiceDetails;
    if (stringify) {
      return JSON.stringify(invoiceDetails, null);
    } else {
      return invoiceDetails;
    }
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const getRentalConfigFile = (req, res) => {
  if (req.query.language == "es") rentalConfig = require("./esconfig");
  if (rentalConfig)
    return res.status(200).json({ success: true, data: rentalConfig });
  else
    return res
      .status(500)
      .json({ success: false, message: req.i18n.__("ERROR_SERVER") });
};

export const updateRentalConfig = async (req, res) => {
  var data = req.body;
  var configObj = rentalConfig;
  for (var key in data) {
    if (!data.hasOwnProperty(key)) continue;
    // console.log(key + " = " + data[key]);
    var keyRes = key.split(".");
    if (keyRes.length > 2) {
      data[key] = convertToNumber(data[key]);
      configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
    } else if (keyRes.length > 1) {
      data[key] = convertToNumber(data[key]);
      configObj[keyRes[0]][keyRes[1]] = data[key];
    } else {
      data[key] = convertToNumber(data[key]);
      configObj[key] = data[key];
    }
  }
  var dataToWrite =
    "const configObj = " +
    JSON.stringify(configObj, null, 2) +
    ";module.exports = configObj";
  // console.log(__dirname)
  var path = "/config.js";
  if (req.query.language == "es") path = "/esconfig.js";
  fs.writeFile(__dirname + path, dataToWrite, function (err, doc) {
    if (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: req.i18n.__("ERROR_SERVER"),
          error: err,
        });
    }
    res
      .status(200)
      .json({
        success: true,
        message: req.i18n.__("UPDATED_SUCCESSFULLY"),
        data: doc,
      });
    restartServer();
  });
};

function convertToNumber(value) {
  if (value == "true") {
    return true;
  } else if (value == "false") {
    return false;
  } else if (value > 0) {
    value = parseInt(value);
    return value;
  } else {
    return value;
  }
}
export const restartServer = () => {
  setTimeout(function () {
    process.exit(1);
  }, 10000); //30000 = 30 sec
};
