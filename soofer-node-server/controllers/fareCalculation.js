// ./express-server/controllers/todo.server.controller.js
import mongoose from "mongoose";

//import models
import Vehicletype from "../models/vehicletype.model";
import Driver from "../models/driver.model";
import Trips from "../models/trips.model";
import * as HelperFunc from "./adminfunctions";
import logger from "../helpers/logger";
import labels from "../helpers/labels.helper";
import * as GFunctions from "./functions";
import { parse } from "fast-csv";
const config = require("../config");
const featuresSettings = require("../featuresSettings");
const moment = require("moment");
const _ = require("lodash");
import { getTripZones, getEstimationZones } from "./test";
import { log } from "console";

//toll fare 
export const getTollFare = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const request = require("request");
      const { pickupLat, pickupLng, dropLat, dropLng } = params;
      const { tollGateDetails } = config;
      const options = {
        method: "POST",
        url: tollGateDetails["url"],
        headers: {
          "content-type": "application/json",
          "x-api-key": tollGateDetails["x-api-key"],
        },
        body: {
          from: {
            lat: Number(pickupLat),
            lng: Number(pickupLng),
          },
          to: {
            lat: Number(dropLat),
            lng: Number(dropLng),
          },
        },
        json: true,
      };
      request(options, function (error, response, body) {
        if (error) {
          return resolve({ success: false });
        } else {
        }
        if(body.routes) {
          const tollCost =
          body &&
          body.routes &&
          body.routes[0] &&
          body.routes[0].costs &&
          body.routes[0].costs.tag;
        const tollCoordinates = []
        body.routes[0].tolls.forEach((e)=>{
          var coordinateData ={
            "lng":e.lng,
            "lat":e.lat,
            "toll":e.tagCost
          }
          tollCoordinates.push(coordinateData)
        })
        return resolve({ success: true, tollCoordinates });
        }else {
          return resolve({ success: false });
        }
      });
    } catch (err) {
      return resolve({ success: false });
    }
  });
};



export const getCityBasedVehicleCharge = async (
  serviceTypeId,
  pickupCity,
  distanceInKM,
  timeInMinutes,
  reqtime,
  waitingTime = 0,
  additionalFee,
  discountPercentage = 0,
  tripId = null,
  tollFee = 0,
  waitingTimeBeforeTripStart = 0,
  bookingType = "rideNow",
  finalAmount = false,
  from = "end",
  endoced = "",
  scId = "",
  tripsData = {}
) => {
  try {
    
    var vehicleData = await Vehicletype.findById(serviceTypeId).exec(); // @v2TODO pass pickupCity as null

    var totalDistanceFareInZone = 0,
      totalDistanceInZone = 0,
      zoneData;
    if (finalAmount) {
      if (from == "estimation") {
        //pass polyline,scid  and found results.
        zoneData = await getEstimationZones(
          endoced,
          scId,
          vehicleData.bkm,
          vehicleData.type
        );
        if (zoneData)
          if (zoneData.totalFare) {
            totalDistanceFareInZone = zoneData.totalFare;
            totalDistanceInZone = zoneData.totalDistance;
            //Zone null + ids @@TODOS
          }
      } else if (from == "end") {
        zoneData = await getTripZones(tripId, vehicleData.bkm);
        if (zoneData)
          if (zoneData.newData.update) {
            totalDistanceFareInZone = zoneData.totalFare;
            totalDistanceInZone = zoneData.totalDistance;
            // totalDistanceInZone = //Zone null + ids @@TODOS
          }
      }
    }


    if (featuresSettings.calculateZoneFare) {
      if (totalDistanceInZone > 0) {
        // if totalDistanceInZone is 25% less than google distance
        var actualDistApprox =
          Number(distanceInKM) -
          Number(
            distanceInKM *
              (featuresSettings.totalDistanceInZoneApproxEligible / 100)
          );
        if (actualDistApprox > totalDistanceInZone) {
          if (tripsData) {
            var gdmResult = await GFunctions.getDistanceAndTimeFromGDMZone(
              [tripsData.from],
              [tripsData.to]
            );
          }
          zoneData = await getEstimationZones(
            gdmResult.polyline,
            scId,
            vehicleData.bkm,
            vehicleData.type
          ); //@Todoszone
          if (zoneData)
            if (zoneData.totalFare) {
              totalDistanceFareInZone = zoneData.totalFare;
              totalDistanceInZone = zoneData.totalDistance;
              //Zone null + ids @@TODOS
            }
        }
      }
    }

    if (isNaN(totalDistanceFareInZone)) totalDistanceFareInZone = 0;

    // @v2TODO pass pickupCity as null
    var vehicleDetails = {
      type: vehicleData.type,
      seats: vehicleData.asppc,
      image: vehicleData.file,
      available: vehicleData.available,
      description: vehicleData.description,
      features: vehicleData.features,
      serviceId: vehicleData._id.toString(),
    };

    var bookingFare = vehicleData.bookingFare ? vehicleData.bookingFare : 0;
    if (bookingType == "hailRide") bookingFare = 0;

    // if(config.distanceUnit == "Miles"){
    //   var KMFare = parseFloat(
    //     parseFloat(distanceInKM) * parseFloat(vehicleData.bkm)
    //   ).toFixed(2),
    // }

    //fareDetails Default
    var fareDetails = {
      perKMRate: vehicleData.bkm,
      fareType: "kmrate",
      distance: distanceInKM, //Actual Distance
      KMFare: parseFloat(
        parseFloat(distanceInKM) * parseFloat(vehicleData.bkm)
      ).toFixed(2), //Fare for Traveled KM
      BaseFare: vehicleData.baseFare ? vehicleData.baseFare : 0, //Base / Service fee
      bookingFare: bookingFare ? bookingFare : 0, //Base / Service fee
      travelTime: timeInMinutes ? timeInMinutes : 0,
      travelRate: vehicleData.timeFare ? vehicleData.timeFare : 0,
      travelFare: 0,
      //Waiting Fare
      timeRate: vehicleData.chargeRatePerMinuteForExceededMinimumWaitingTime
        ? vehicleData.chargeRatePerMinuteForExceededMinimumWaitingTime
        : 0, //Waiting Charge per min
      waitingCharge:
        vehicleData.chargeRatePerMinuteForExceededMinimumWaitingTime
          ? vehicleData.chargeRatePerMinuteForExceededMinimumWaitingTime
          : 0, //Waiting Charge per min
      waitingTime: waitingTime, //Fare for Waiting Time
      waitingFare: 0, //Fare for Waiting Time
      //cancelation Fees
      cancelationFeesRider: vehicleData.cancelationFeesRider,
      cancelationFeesDriver: vehicleData.cancelationFeesDriver,
      //Pickup Charge
      pickupCharge: 0, //Pickup Charge
      hotelcommision: 0,
      hotelcommisionAmt: 0,

      //commision
      comison: vehicleData.comison ? vehicleData.comison : 0, //commision percentage
      comisonAmt: 0, //commision to admin
      isTax: vehicleData.isTax,
      taxPercentage: vehicleData.taxPercentage ? vehicleData.taxPercentage : 0,
      tax: 0, // tax amount
      taxTDSPercentage: featuresSettings.taxTDSPercentage,
      taxTDS: 0, // tax amount
      minFare: vehicleData.mfare, //Minimum fare
      minFareAdded: vehicleData.mfare, //Total - Minimum fare
      flatFare: vehicleData.mfare, //flatFare
      oldCancellationAmt: 0,
      fareAmtBeforeSurge: vehicleData.mfare,
      totalFareWithOutOldBal: vehicleData.mfare,
      totalFare: vehicleData.mfare, //Minimum fare is applied as Total
      BalanceFare: vehicleData.mfare, //Minimum fare is applied as Total
      DetuctedFare: 0, //Detucted via Promo/Digital,wallet etc
      paymentMode: "cash",
      currency: config.currency,
      additionalFee: additionalFee,
      mandatorydiscountAmt: 0,
      surgeReason: "",
      surgeAmt: 0,
      discountAmt: 0,
      promoCode: "",
      googleRate: config.googleCharge,
      waitingChargeAfterTripStart:
        vehicleData.chargeRatePerMinuteForExceededMinimumWaitingTime
          ? vehicleData.chargeRatePerMinuteForExceededMinimumWaitingTime
          : 0, //Waiting Charge per min
      waitingTimeAfterTripStart: waitingTime, //Fare for Waiting Time
      waitingFareAfterTripStart: 0,
      waitingChargeBeforeTripStart:
        vehicleData.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart
          ? vehicleData.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart
          : 0, //Waiting Charge per min
      waitingTimeBeforeTripStart: waitingTimeBeforeTripStart, //Fare for Waiting Time
      waitingFareBeforeTripStart: 0,
      taxType: vehicleData.taxType ? vehicleData.taxType : "percentage",
      totalDistanceInZone: totalDistanceFareInZone,
    };
    if (featuresSettings.calculateZoneFare) {
      if (totalDistanceInZone > 0) {
        fareDetails["distance"] = totalDistanceInZone;
      }
    }

    if (featuresSettings.secondarycur) {
      fareDetails.inSecondaryCur = GFunctions.sendSecondaryRate(
        fareDetails.totalFare
      );
    }
    /*var applyValues = {
      "applyCommission": featuresSettings.applyAdminCommission,
      "applyPeakCharge": featuresSettings.applyPeakCharge,
      "applyNightCharge": featuresSettings.applyNightCharge,
      "applyWaitingTime": featuresSettings.applyWaitingCharge,
      "applyTax": featuresSettings.applyTax,
      "applyPickupCharge": featuresSettings.applyPickupCharge,
    }; */

    var applyValues = featuresSettings.applyValues;

    var offers = {
      offerPerUser: 0,
      offerPerDay: 0,
      discount: 0,
      cmpyAllowance: false,
    };

    //Travel time fare //Final
    if (featuresSettings.applyTravelFare)
      fareDetails["travelFare"] = parseFloat(
        Number(timeInMinutes) * Number(vehicleData.timeFare)
      ).toFixed(2);

    //waiting time fare //Final
    // fareDetails['waitingFare'] = getWaitingFare(vehicleData.chargeRatePerMinuteForExceededMinimumWaitingTime, vehicleData.allowMinimumWaitingTimeInMinutes, vehicleData.isWaitingTimeExceddedChargesApplicable, waitingTime);
    var waitingFareAfterTripStartDetails = getWaitingFare(
      vehicleData.chargeRatePerMinuteForExceededMinimumWaitingTime,
      vehicleData.allowMinimumWaitingTimeInMinutes,
      vehicleData.isWaitingTimeExceddedChargesApplicable,
      waitingTime
    );
    fareDetails["waitingFare"] = waitingFareAfterTripStartDetails.waitingFare;
    fareDetails["waitingTime"] = waitingFareAfterTripStartDetails.waitingTime;
    fareDetails["waitingFareAfterTripStart"] = fareDetails["waitingFare"];
    fareDetails["waitingTimeAfterTripStart"] = fareDetails["waitingTime"];
    //waiting time fare Before Trip Start//Final
    if (featuresSettings.checkWaitingTimeBeforeTripStart) {
      // fareDetails['waitingFareBeforeTripStart'] = getWaitingFare(vehicleData.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart, vehicleData.allowMiniWaitingTimeBeforeTripStartInMin, vehicleData.isWaitingTimeBeforeTripStartExceddedChargesApplicable, waitingTimeBeforeTripStart);
      var waitingFareBeforeTripStartDetails = getWaitingFare(
        vehicleData.chargeRatePerMinForExceededMinWaitingTimeBeforeTripStart,
        vehicleData.allowMiniWaitingTimeBeforeTripStartInMin,
        vehicleData.isWaitingTimeBeforeTripStartExceddedChargesApplicable,
        waitingTimeBeforeTripStart
      );
      fareDetails["waitingFareBeforeTripStart"] =
        waitingFareBeforeTripStartDetails.waitingFare;
      fareDetails["waitingTimeBeforeTripStart"] =
        waitingFareBeforeTripStartDetails.waitingTime;
    }

    fareDetails["waitingFare"] =
      parseFloat(fareDetails["waitingFare"]) +
      parseFloat(fareDetails["waitingFareBeforeTripStart"]);
    // fareDetails['waitingCharge'] = ((parseFloat(fareDetails['waitingCharge']) + parseFloat(fareDetails['waitingChargeBeforeTripStart'])) / 2).toFixed(2);
    fareDetails["waitingTime"] =
      parseFloat(fareDetails["waitingTime"]) +
      parseFloat(fareDetails["waitingTimeBeforeTripStart"]);
    var waitingCharge =
      Number(fareDetails["waitingFare"]) / Number(fareDetails["waitingTime"]);
    waitingCharge = isNaN(waitingCharge) ? 0 : Number(waitingCharge);
    fareDetails["waitingCharge"] = parseFloat(waitingCharge.toFixed(2));

    //Night Fare Percentage = value if applied or 0
    fareDetails["nightObj"] = getFareIfTimeFallsIn(
      vehicleData.nightHours[0],
      reqtime,
      "night"
    );

    //Peak Fare Percentage
    fareDetails["peakObj"] = getFareIfTimeFallsIn(
      vehicleData.peakHours[0],
      reqtime,
      "peak"
    );
    if (!fareDetails["peakObj"] || !fareDetails["peakObj"]["isApply"])
      fareDetails["peakObj"] = getFareIfTimeFallsIn(
        vehicleData.peakHours[1],
        reqtime,
        "peak"
      );
    //Pickup Charge //Final
    fareDetails["pickupCharge"] = getPickupCharge(
      vehicleData.conveyancePerKm,
      vehicleData.conveyanceType,
      vehicleData.conveyanceAvailable
    );
    if (featuresSettings.manualPickupChargeFromMTD && tripId) {
      var tripData = await Trips.findById(tripId, { tripno: 1, csp: 1 }).exec();
      if (tripData) {
        var manualPickupChargeFromMTD = tripData.csp.conveyance;
        fareDetails["pickupCharge"] =
          Number(manualPickupChargeFromMTD) +
          Number(fareDetails["pickupCharge"]);
      }
    }
    //Get Approx distance Obj

    fareDetails["distanceObj"] = getDistanceObj(
      vehicleData.distance,
      distanceInKM
    );

    //Distance wise modifications
    if (fareDetails["distanceObj"].length) {
      var distanceObj = fareDetails["distanceObj"][0];
      var distanceDetails = getPerKmRateForDist(fareDetails["distanceObj"][0]); //debug
      fareDetails["fareType"] = distanceDetails.fareType;
      if (fareDetails["fareType"] == "kmrate") {
        fareDetails["perKMRate"] = distanceDetails.fare;
      } else {
        fareDetails["flatFare"] = distanceDetails.fare
          ? distanceDetails.fare
          : fareDetails["flatFare"];
        fareDetails["minFare"] = distanceDetails.fare
          ? distanceDetails.fare
          : fareDetails["minFare"];
      }

      if (featuresSettings.applyAdditionalKMFareModel) {
        //ADDTIONAL FARE
        if (fareDetails["distanceObj"].length) {
          // total = total KM – firstupperkmlimit * KM fare + baseupperfare
          var baseupperfareArray = getDistanceObj(vehicleData.distance, 0);
          var baseupperfare = baseupperfareArray[0].distanceFarePerFlatRate;
          var distanceFareType = baseupperfareArray[0].distanceFareType;
          if (distanceFareType == "kmrate") {
            if (Number(distanceInKM) > baseupperfareArray[0].distanceTo) {
              baseupperfare =
                baseupperfareArray[0].distanceFarePerKM *
                baseupperfareArray[0].distanceTo;
            } else {
              baseupperfare =
                baseupperfareArray[0].distanceFarePerKM * distanceInKM;
            }
          }
          fareDetails["minFare"] = baseupperfare
            ? baseupperfare
            : fareDetails["minFare"];
          var firstupperkmlimit = baseupperfareArray[0].distanceTo;
        }
        //ADDTIONAL FARE
        //
        //DTAXI model
        let otherSplitUps = vehicleData.distance.filter(function (e) {
          return Number(e.distanceFrom) <= distanceInKM;
        });

        otherSplitUps.sort(function (a, b) {
          return a.distanceFrom - b.distanceFrom;
        });

        var totalKMFare = 0;
        var totalKMBal = distanceInKM;

        otherSplitUps.forEach((distance, index, array) => {
          var currentFare = 0;
          totalKMBal = distanceInKM - parseFloat(distance.distanceFrom);
          if (Number(totalKMBal) > Number(distance.distanceTo)) {
            if (distance.distanceFareType == "flatrate") {
              currentFare = distance.distanceFarePerFlatRate;
            } else {
              currentFare =
                (parseFloat(distance.distanceTo) -
                  parseFloat(distance.distanceFrom)) *
                parseFloat(distance["distanceFarePerKM"]);
            }
          } else {
            if (distance.distanceFareType == "flatrate") {
              currentFare = distance.distanceFarePerFlatRate;
            } else {
              currentFare =
                totalKMBal * parseFloat(distance["distanceFarePerKM"]);
            }
          }
          totalKMFare = totalKMFare + currentFare;
        });
        baseupperfare = totalKMFare;
        //DTAXI model
      }

      //Modified Apply
      applyValues["applyCommission"] = distanceObj.applyCommission;
      applyValues["applyPeakCharge"] = distanceObj.applyPeakCharge;
      applyValues["applyNightCharge"] = distanceObj.applyNightCharge;
      applyValues["applyWaitingTime"] = distanceObj.applyWaitingTime;
      applyValues["applyTax"] = distanceObj.applyTax;
      applyValues["applyPickupCharge"] = distanceObj.applyPickupCharge;
      //Modified Offers
      offers["cmpyAllowance"] = distanceObj.cmpyAllowance;
      offers["offerPerUser"] = distanceObj.offerPerUser;
      offers["offerPerDay"] = distanceObj.offerPerDay;
      offers["discount"] = distanceObj.discount;
    }
    //calculate Total Fare (Daily)= Base Fare +  ( KM * KM Rate ) + ( Travel Fare * Travel Time ) + ( Waiting Fare * Waiting Time ) + Pickup Charge + Tax - Discount
    //KM Rate
    fareDetails["KMFare"] = parseFloat(
      parseFloat(distanceInKM) * parseFloat(fareDetails["perKMRate"])
    ).toFixed(2); //Final
    if (featuresSettings.applyAdditionalKMFareModel) {
      /* if (Number(distanceInKM) > firstupperkmlimit) {
         //ADDTIONAL FARE
         var balKMFARE = (parseFloat(distanceInKM) - parseFloat(firstupperkmlimit)) * parseFloat(fareDetails['perKMRate']);
         fareDetails['KMFare'] = parseFloat(Number(balKMFARE) + Number(baseupperfare)).toFixed(2);
         //ADDTIONAL FARE
       }*/
      //DTAXI model
      if (baseupperfare) {
        fareDetails["KMFare"] = Number(baseupperfare).toFixed(2);
      }
    }

    var distanceFareForFlatRateAtZero = getDistanceObj(
      vehicleData.distance,
      0
    )[0];
    if (distanceFareForFlatRateAtZero) {
      if (distanceFareForFlatRateAtZero.distanceFareType == "flatrate") {
        if (featuresSettings.calculateZoneFare) {
          if (zoneData) {
            var zonetotalFare = calculateZoneBasedFare(
              zoneData,
              distanceFareForFlatRateAtZero
            );
            fareDetails["KMFare"] = zonetotalFare;
          }
        }
      } else {
        if (featuresSettings.calculateZoneFare) {
          if (zoneData) {
            fareDetails["KMFare"] = totalDistanceFareInZone;
          }
        }
      }
    } else {
      if (featuresSettings.calculateZoneFare) {
        if (zoneData) {
          fareDetails["KMFare"] = totalDistanceFareInZone;
        }
      }
    }

    fareDetails["totalFare"] = fareDetails["BalanceFare"] =
      Number(fareDetails["BaseFare"]) +
      Number(fareDetails["bookingFare"]) +
      Number(fareDetails["KMFare"]) +
      Number(fareDetails["travelFare"]) +
      Number(fareDetails["waitingFare"]);
      console.log("******fareDetails[totalFare]",fareDetails["totalFare"],Number(fareDetails["bookingFare"]),Number(fareDetails["BaseFare"]),Number(fareDetails["KMFare"]),Number(fareDetails["travelFare"]),Number(fareDetails["waitingFare"]))
    if (featuresSettings.isPickupAddtoCommission)
      fareDetails["totalFare"] =
        Number(fareDetails["totalFare"]) + Number(fareDetails["pickupCharge"]); //if need to add pickup charge for commision

    if (featuresSettings.applyMandatoryDiscount) {
      fareDetails["DetuctedFare"] = Number(
        fareDetails["totalFare"] * (Number(discountPercentage) / 100)
      ).toFixed(2);
      fareDetails["totalFare"] = Number(
        Number(fareDetails["totalFare"]) - Number(fareDetails["DetuctedFare"])
      ).toFixed(2);
    }

    fareDetails["fareAmtBeforeSurge"] = Number(fareDetails["totalFare"]);
    var totalFare = getTotalFare(
      fareDetails,
      applyValues,
      offers,
      additionalFee,
      tollFee,
      fareDetails["taxType"]
    );
    console.log(totalFare,"totalFare")
    fareDetails["minFareAdded"] = totalFare.minFareAdded;
    if (!featuresSettings.isPickupAddtoCommission)
      fareDetails["totalFare"] =
        Number(fareDetails["totalFare"]) + Number(fareDetails["pickupCharge"]); //if no need to add pickup charge for commision
    fareDetails["fareAmtBeforeSurge"] = totalFare.fareAmtBeforeSurge;
    fareDetails["fareAmt"] = totalFare.fareAmt; //without tax
    fareDetails["comisonAmt"] = totalFare.comisonAmt;
    // fareDetails['hotelcommisionAmt'] = totalFare.hotelcommisionAmt;
    fareDetails["tax"] = totalFare.tax;
    fareDetails["taxTDS"] = totalFare.taxTDS;
    fareDetails["totalFareWithOutOldBal"] = Number(
      totalFare.totalFareWithOutOldBal
    );
    // fareDetails['fareAmtBeforeSurge'] = totalFare.fareAmtBeforeSurge;
    fareDetails["indiaGSTAmounts"] = totalFare["indiaGSTAmounts"];

    //When rounding here, will not calcaulate commision to rounded number
    /*  if (featuresSettings.convertAllFareToGivenMultipler) {
       totalFare.totalFare = GFunctions.roundAmountToGivenMultiples(totalFare.totalFare);
     } */
    fareDetails["surgeAmt"] = totalFare["surgeAmt"];
    fareDetails["surgeReason"] = totalFare["surgeReason"]
      ? totalFare["surgeReason"]
      : 0;
    fareDetails["farewithoutTaxNBookingFee"] =
      totalFare.farewithoutTaxNBookingFee;
    fareDetails["totalFare"] = fareDetails["BalanceFare"] = totalFare.totalFare;

    if (featuresSettings.secondarycur) {
      fareDetails.inSecondaryCur = GFunctions.sendSecondaryRate(
        fareDetails.totalFare
      );
    }
    /* fareDetails = _.mapValues(fareDetails, function (v) { if(typeof v === 'number') {
      return parseFloat(v.toFixed(2));
    }else { return v; }  });//Round all to 2 Decimals */

    var resData = {
      vehicleDetails: _.cloneDeep(vehicleDetails),
      fareDetails: _.cloneDeep(fareDetails),
      offers: _.cloneDeep(offers),
      applyValues: _.cloneDeep(applyValues),
    };
    console.log(resData,"resData")
    return resData;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

export const getVehicleChargeApprox = (
  distanceInKM,
  timeInMinutes,
  vehicleData
) => {
  try {
    // var totalFare = KMFare + TimeFare + BaseFare + Tax; (Minimum fare)
    var totalFare;
    var KMFare = parseFloat(
      parseFloat(distanceInKM) * parseFloat(vehicleData["perKMRate"])
    ).toFixed(2);
    var TimeFare = parseFloat(
      parseFloat(timeInMinutes) * parseFloat(vehicleData["timeInMinutes"])
    ).toFixed(2);
    totalFare =
      Number(KMFare) + Number(TimeFare) + Number(vehicleData["BaseFare"]);
    var tax = parseFloat((totalFare * parseFloat(vehicleData["tax"])) / 100);
    totalFare = Number(totalFare) + Number(tax);
    if (Number(totalFare) < parseFloat(vehicleData["minFare"])) {
      totalFare = vehicleData["minFare"];
    }
    return totalFare.toFixed(2);
  } catch (error) {
    logger.error(error);
    return "NA";
  }
};

//calculate Total Fare (Daily)= Base Fare +  ( KM * KM Rate ) + ( Travel Fare * Travel Time ) + ( Waiting Fare * Waiting Time ) + Pickup Charge + Tax - Discount
function getTotalFare(
  fareDetails,
  applyValues,
  offers,
  additionalFee,
  tollFee,
  taxType = "percentage"
) {
  var resObj = {
    fareAmt: 0,
    minFareAdded: 0,
    fareAmtBeforeSurge: 0,
    surgeAmt: 0,
    comisonAmt: 0,
    tax: 0,
    flatFare: 0,
    oldCancellationAmt: 0,
    totalFareWithOutOldBal: 0,
    totalFare: 0,
    farewithoutTaxNBookingFee: 0,
    taxTDS: 0,
    taxTDSPercentage: 0,
  };
  //Flat Rate
  if (fareDetails["fareType"] == "flatrate") {
    resObj["fareAmt"] = fareDetails["KMFare"];
  } else {
    //KM Fare
    resObj["fareAmt"] = fareDetails["KMFare"];
  }

  //Add Waiting Time
  if (applyValues["applyWaitingTime"]) {
    resObj["fareAmt"] =
      parseFloat(resObj["fareAmt"]) + parseFloat(fareDetails["waitingFare"]);
  }
  //Add Pickup Charge
  if (applyValues["applyPickupCharge"]) {
    resObj["fareAmt"] =
      parseFloat(resObj["fareAmt"]) + parseFloat(fareDetails["pickupCharge"]);
  }

  resObj["fareAmt"] =
    Number(fareDetails["BaseFare"]) +
    Number(fareDetails["bookingFare"]) +
    Number(resObj["fareAmt"]) +
    Number(fareDetails["travelFare"]);
  resObj["fareAmtBeforeSurge"] = resObj["fareAmt"];

  //Add Peak & Night Multipler
  if (applyValues["applyPeakCharge"]) {
    if (fareDetails["peakObj"].isApply) {
      resObj["fareAmt"] =
        parseFloat(resObj["fareAmt"]) *
        parseFloat(fareDetails["peakObj"].percentageIncrease);
      resObj["surgeReason"] = "Peak Surge";
      resObj["surgeAmt"] =
        Number(resObj["fareAmt"]) - Number(resObj["fareAmtBeforeSurge"]);
    }
  }
  if (applyValues["applyNightCharge"]) {
    if (fareDetails["nightObj"].isApply) {
      resObj["fareAmt"] =
        parseFloat(resObj["fareAmt"]) *
        parseFloat(fareDetails["nightObj"].percentageIncrease);
      resObj["surgeReason"] = "Night Surge";
      resObj["surgeAmt"] =
        Number(resObj["fareAmt"]) - Number(resObj["fareAmtBeforeSurge"]);
    }
  }

  if (featuresSettings.addAdditionalFaresInTrip) {
    var additionalFares = addAdditionalFaresInTrip(additionalFee);
    resObj["fareAmt"] = Number(resObj["fareAmt"]) + Number(additionalFares);
  }

  // if (!fareDetails.promoCode == "") {
  //   resObj['fareAmt'] = Number(resObj['fareAmt']) - Number(fareDetails.discountAmt);
  // }

  //Check For Min Fare
  // if (fareDetails['fareType'] == 'kmrate'){
  if (
    parseFloat(Number(resObj["fareAmt"]) - Number(fareDetails["bookingFare"])) <
    parseFloat(fareDetails["minFare"])
  ) {
    resObj["minFareAdded"] =
      parseFloat(fareDetails["minFare"]) -
      parseFloat(
        Number(resObj["fareAmt"]) - Number(fareDetails["bookingFare"])
      );
    resObj["fareAmt"] =
      (Number(fareDetails["minFare"]) + Number(fareDetails["bookingFare"])).toFixed(2);
    resObj["fareAmtBeforeSurge"] =
      (Number(fareDetails["minFare"]) + Number(fareDetails["bookingFare"])).toFixed(2);
  }
  // }

  if (featuresSettings.isTollAdded) {
    if (Number(tollFee) > 0) {
      console.log("inside the function")
      resObj["fareAmt"] = (Number(resObj["fareAmt"]) + Number(tollFee)).toFixed(
        2
      );
    }
  }

  //Tax for (KM + Multipler + Waiting + Pickup )
  if (applyValues["applyTax"]) {
    if (taxType == "flat") {
      resObj["tax"] = parseFloat(fareDetails["taxPercentage"]);
    } else {
      resObj["tax"] =
        ((parseFloat(fareDetails["taxPercentage"]) *
          parseFloat(resObj["fareAmt"])) /
        100).toFixed(2);
    }
  }

  if (fareDetails["taxTDSPercentage"] > 0) {
    resObj["taxTDS"] =
      (parseFloat(fareDetails["taxTDSPercentage"]) *
        parseFloat(resObj["fareAmt"])) /
      100;
  }

  //Total Fare = Fare + tax
  resObj["totalFare"] =
    parseFloat(resObj["fareAmt"]) +
    Number(resObj["tax"]) +
    Number(resObj["taxTDS"]);

  //When rounding here will calcaulate commision to rounded number
  if (featuresSettings.convertAllFareToGivenMultipler) {
    resObj["totalFare"] = GFunctions.roundAmountToGivenMultiples(
      resObj["totalFare"]
    );
  }

  resObj["totalFareWithOutOldBal"] = resObj["totalFare"];

  //Calculate Commision for fare only no tax added
  resObj["farewithoutTaxNBookingFee"] =
    (parseFloat(resObj["totalFare"]) -
    parseFloat(resObj["tax"]) -
    parseFloat(fareDetails["bookingFare"])).toFixed(2);
  resObj["comisonAmt"] =
  parseFloat((parseFloat(fareDetails["comison"]) *
      parseFloat(resObj["farewithoutTaxNBookingFee"])) /
    100).toFixed(2);
  if (Number(config.googleCharge) > 0) {
    resObj["totalFare"] =
    parseFloat(Number(resObj["totalFare"]) + Number(config.googleCharge)).toFixed(2);
    resObj["comisonAmt"] =
    parseFloat(Number(resObj["comisonAmt"]) + Number(config.googleCharge)).toFixed(2);
  }
  // if (featuresSettings.addBookingFeeToCommision) {
  //   var amountwithoutBookingfee = Number(resObj['totalFareWithOutOldBal']) - Number(fareDetails['bookingFare']);
  //   resObj['comisonAmt'] = ((Number(fareDetails['comison']) * Number(amountwithoutBookingfee)) / 100) + Number(fareDetails['bookingFare']);
  // }

  // resObj['hotelcommisionAmt'] = parseFloat(fareDetails['hotelcommision']) * parseFloat(resObj['totalFareWithOutOldBal']) / 100;

  resObj["totalFare"] = Number(resObj["totalFare"]).toFixed(2);

  resObj = _.mapValues(resObj, function (v) {
    if (typeof v === "number") {
      return parseFloat(v.toFixed(2));
    } else {
      return v;
    }
  }); //Round all to 2 Decimals

  GFunctions.clearObj(resObj);
  console.log(resObj,"resObj")
  return resObj;
}

function getIndiaGSTAmounts(totalFare) {
  var IndiaGSTAmounts = {};
  var gstFareBreakPercentage = featuresSettings.gst.gstFareBreakPercentage;
  var gstOnFareBreakPercentage1 =
    featuresSettings.gst.gstOnFareBreakPercentage1;
  var gstOnFareBreakPercentage2 =
    featuresSettings.gst.gstOnFareBreakPercentage2;
  IndiaGSTAmounts.totalfare1 = parseFloat(
    (Number(totalFare) * Number(gstFareBreakPercentage)) / 100
  ).toFixed(2);
  IndiaGSTAmounts.totalfare2 = parseFloat(
    Number(totalFare) - Number(IndiaGSTAmounts.totalfare1)
  ).toFixed(2);
  IndiaGSTAmounts.gst1On1 = parseFloat(
    (Number(gstOnFareBreakPercentage1) * Number(IndiaGSTAmounts.totalfare1)) /
      100
  ).toFixed(2);
  IndiaGSTAmounts.gst2On2 = parseFloat(
    (Number(gstOnFareBreakPercentage2) * Number(IndiaGSTAmounts.totalfare2)) /
      100
  ).toFixed(2);
  IndiaGSTAmounts.totalTax = parseFloat(
    Number(IndiaGSTAmounts.gst1On1) + Number(IndiaGSTAmounts.gst2On2)
  ).toFixed(2);
  IndiaGSTAmounts.gstPerOn1 = gstOnFareBreakPercentage1;
  IndiaGSTAmounts.gstPerOn2 = gstOnFareBreakPercentage2;

  //Indian GST
  IndiaGSTAmounts.fee1 = IndiaGSTAmounts.totalfare1;
  IndiaGSTAmounts.cgstperentage1 = parseFloat(
    IndiaGSTAmounts.gstPerOn1 / 2
  ).toFixed(2);
  IndiaGSTAmounts.cgst1 = parseFloat(IndiaGSTAmounts.gst1On1 / 2).toFixed(2);
  IndiaGSTAmounts.sgstperentage1 = parseFloat(
    IndiaGSTAmounts.gstPerOn1 / 2
  ).toFixed(2);
  IndiaGSTAmounts.sgst1 = parseFloat(IndiaGSTAmounts.gst1On1 / 2).toFixed(2);
  IndiaGSTAmounts.subtotal1 = (
    Number(IndiaGSTAmounts.totalfare1) + Number(IndiaGSTAmounts.gst1On1)
  ).toFixed(2);
  IndiaGSTAmounts.fee2 = IndiaGSTAmounts.totalfare2;
  IndiaGSTAmounts.cgstperentage2 = parseFloat(
    IndiaGSTAmounts.gstPerOn2 / 2
  ).toFixed(2);
  IndiaGSTAmounts.cgst2 = parseFloat(IndiaGSTAmounts.gst2On2 / 2).toFixed(2);
  IndiaGSTAmounts.sgstperentage2 = parseFloat(
    IndiaGSTAmounts.gstPerOn2 / 2
  ).toFixed(2);
  IndiaGSTAmounts.sgst2 = parseFloat(IndiaGSTAmounts.gst2On2 / 2).toFixed(2);
  IndiaGSTAmounts.subtotal2 = (
    Number(IndiaGSTAmounts.totalfare2) + Number(IndiaGSTAmounts.gst2On2)
  ).toFixed(2);
  IndiaGSTAmounts.finalamt = totalFare;

  return IndiaGSTAmounts;
}
/**
 * Get waiting fare if its ecxceeds minTime
 * @param {*} rate
 * @param {*} minTime
 * @param {*} isApplicable
 * @param {*} waitingTime (Mins)
 */
function getWaitingFare(rate, minTime, isApplicable, waitingTime) {
  var waitingFare = 0;
  if (isApplicable) {
    if (Number(waitingTime) >= Number(minTime)) {
      if (waitingTime <= 1) waitingTime = 0;
      waitingTime = Number(waitingTime) - Number(minTime);
      waitingFare = Number(rate) * Number(waitingTime);
    }
  }
  return {
    waitingFare: waitingFare.toFixed(2),
    waitingTime: waitingTime.toFixed(2),
  };
}

/**
 * getFareIfTimeFallsIn = if HOurs within given time it gives percentage to increase
 * @param {*} hours
 * @param {*} now
 *          "isApply": false,
            "percentageIncrease": 1.5,
            "alertLable": "Notes : Peak Fare x{PERCENTAGE} ({TIME})"
 */
function getFareIfTimeFallsIn(hours, now, forType = "peak") {
  var resObj = { isApply: false, percentageIncrease: 0, alertLable: "",nightfarePer: 0 };
  var format = "HH:mm:ss";
  if (!now || now == "") {
    now = GFunctions.sendTimeNow(format);
  } else {
    var time = now.split(" ");
    if (time[1] == "AM" || time[1] == "PM") {
      var time = moment(now, "hh:mm A").format("HH:mm");
      now = time;
    } else {
      now = now;
    }
  }

  var to = moment(hours.to, format),
    from = moment(hours.from, format),
    tempnow = moment(now, format),
    now = moment(tempnow, format);
    // console.log("====from======",from, "-to-",to)
    // console.log("====tempnow======",tempnow, "-now-",now)

  if (from > to) {
    //22PM to 8AM
    if (now.isBetween(to, from)) {
      resObj.isApply = false;
    } else {
      resObj.isApply = true;
    }
  } else {
    if (now.isBetween(from, to)) {
      resObj.isApply = true;
    } else {
      resObj.isApply = false;
    }
  }

  if (forType == "peak") {
    resObj.percentageIncrease = Number(
      getPercentageMultipiler(hours.percentPeakFare)
    );
    resObj.nightfarePer = Math.round(Number(hours.percentPeakFare))
    resObj.alertLable = GFunctions.convertLableDynamically(
      labels.isPeakExistAlertLabel,
      {
        PERCENTAGE: resObj.percentageIncrease,
        TIME: hours.from + " - " + hours.to,
      }
    );
  } else {
    resObj.percentageIncrease = Number(
      getPercentageMultipiler(hours.percentNightFare)
    );
    resObj.nightfarePer = Math.round(Number(hours.percentNightFare))
    resObj.alertLable = GFunctions.convertLableDynamically(
      labels.isNightExistAlertLabel,
      {
        PERCENTAGE: resObj.percentageIncrease,
        TIME: hours.from + " - " + hours.to,
      }
    );
  }

  return GFunctions.roundAllValuesToTwoDigits(resObj);
}

function getPercentageMultipiler(percentage) {
  return parseFloat(1 + parseFloat(percentage) / 100).toFixed(2);
}

function getPickupCharge(conveyancePerKm, conveyanceType, conveyanceAvailable) {
  if (conveyanceAvailable) {
    if (conveyanceType == "flatrate") {
      return conveyancePerKm;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getDistanceObj(distanceArray, distanceInKM) {
  var filteredFareOffers;
  if (distanceArray) {
    var filteredFareOffers = _.filter(
      distanceArray,
      (i) =>
        Number(i.distanceFrom) <= distanceInKM &&
        Number(i.distanceTo) >= distanceInKM
    );
  }
  return filteredFareOffers;
}

function getPerKmRateForDist(distance) {
  var distObj = {};
  distObj.fareType = distance.distanceFareType;
  if (distance.distanceFareType == "flatrate") {
    distObj.fare = distance.distanceFarePerFlatRate;
  } else {
    distObj.fare = distance.distanceFarePerKM;
  }
  return distObj;
}

function addAdditionalFaresInTrip(arrayValue) {
  var additionalFares = 0;
  if (arrayValue) {
    arrayValue.forEach((element, index, array) => {
      additionalFares = additionalFares + Number(element.amount);
    });
  }
  return additionalFares;
}

function sortByNull(data) {
  return data.sort(function (a, b) {
    return (a === null) - (b === null) || -(a > b) || +(a < b);
  });
}

function totalDistanceCal(data) {
  var totalDistane = 0;
  data.forEach((item) => {
    totalDistane = (Number(totalDistane) + Number(item.distance)).toFixed(2);
  });
  return totalDistane;
}

function calculateZoneBasedFare(zoneData, distanceObj) {
  distanceObj.distanceTo = Number(distanceObj.distanceTo);
  var toDistance = distanceObj.distanceTo;
  if (zoneData && zoneData.tempData.length) {
    var zoneArr = sortByNull(zoneData.tempData);
    var newZoneObj = {};
    var Nullzone = 0;
    var rem_distance_non_null = toDistance;
    do {
      newZoneObj[zoneArr[Nullzone].zoneId] = checkZoneSet(
        zoneArr[Nullzone],
        toDistance,
        distanceObj.distanceFarePerFlatRate,
        rem_distance_non_null
      );
      toDistance = newZoneObj[zoneArr[Nullzone].zoneId].remaining;
      rem_distance_non_null =
        newZoneObj[zoneArr[Nullzone].zoneId].remainingDistanceToZone;
      Nullzone++;
    } while (toDistance != 0 || Nullzone < zoneArr.length);
    newZoneObj = formattObjcet(newZoneObj);
    return newZoneObj;
  }
}

function formattObjcet(rec_objecte) {
  var newObjectSet = {},
    totalFare = 0;
  for (var key in rec_objecte) {
    if (rec_objecte.hasOwnProperty(key)) {
      newObjectSet[key] = {
        rate: Number(rec_objecte[key].rate),
        distance: Number(rec_objecte[key].distance),
        kmrate: Number(rec_objecte[key].kmrate),
        finalRate: (
          (rec_objecte[key].kmrate ? rec_objecte[key].kmrate : 0) +
          rec_objecte[key].remainingDistanceToZoneFare
        ).toFixed(2),
      };
      totalFare = Number(
        Number(totalFare) + Number(newObjectSet[key].finalRate)
      ).toFixed(2);
    }
  }
  return totalFare;
}

function checkZoneSet(
  rec_zone,
  toDistance,
  distanceFarePerFlatRate,
  rem_distance_non_null
) {
  var newObject = {};
  var zoneId = rec_zone["zoneId"],
    rec_zone_dist = Number(rec_zone["distance"]);
  rem_distance_non_null = Number(rem_distance_non_null);
  var distanceFarePerFlatRate = Number(distanceFarePerFlatRate);
  toDistance = Number(toDistance);
  if (rec_zone_dist > toDistance && rec_zone_dist != 0 && toDistance != 0) {
    {
      newObject[zoneId] = {
        distance: rec_zone["distance"],
        rate: rec_zone["rate"],
        kmrate: distanceFarePerFlatRate,
        remainingDistanceToZone: 0,
        remainingDistanceToZoneFare:
          (rec_zone_dist - toDistance).toFixed(2) * rec_zone["rate"],
        toDistance: toDistance,
        remaining: 0,
      };
    }
  } else if (
    rec_zone_dist < toDistance &&
    rec_zone_dist != 0 &&
    toDistance != 0
  ) {
    newObject[zoneId] = {
      distance: rec_zone["distance"],
      kmrate: distanceFarePerFlatRate,
      rate: rec_zone["rate"],
      toDistance: toDistance,
      remainingDistanceToZone: (rem_distance_non_null - rec_zone_dist).toFixed(
        2
      ),
      remainingDistanceToZoneFare: 0,
      remaining: 0,
    };
  } else if (rec_zone_dist == 0 || toDistance == 0)
    newObject[zoneId] = {
      distance: rec_zone["distance"],
      toDistance: toDistance,
      rate: rec_zone["rate"],
      remainingDistanceToZone:
        rec_zone_dist > rem_distance_non_null
          ? 0
          : (rec_zone_dist - rem_distance_non_null).toFixed(2),
      remainingDistanceToZoneFare:
        rem_distance_non_null != 0 && toDistance == 0
          ? (rec_zone_dist - rem_distance_non_null).toFixed(2) *
            rec_zone["rate"]
          : rec_zone_dist.toFixed(2) * rec_zone["rate"],

      remaining: rem_distance_non_null != 0 && toDistance == 0 ? toDistance : 0,
    };
  else if (rec_zone_dist == toDistance)
    newObject[zoneId] = {
      distance: rec_zone["distance"],
      rate: rec_zone["rate"],
      toDistance: 0,
      remainingDistanceToZone: 0,
      remainingDistanceToZoneFare: 0,
      kmrate: distanceFarePerFlatRate,
      remaining: 0,
    };
  else {
  }
  return newObject[zoneId];
}
