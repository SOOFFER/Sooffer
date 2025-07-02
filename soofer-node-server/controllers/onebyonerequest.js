import mongoose from "mongoose";
const _ = require("lodash");

//import models
import Trips from "../models/trips.model";
import Driver from "../models/driver.model";
import * as GFunctions from "./functions";
import { noDriverFoundSMS } from "./smsGateway";
import { findAndSendFCMToDriver } from "./app";
import * as smsGateway from "./smsGateway";
import ServiceAvailableCities from "../models/serviceAvailableCities.model";
import * as serviceCityCtrl from "./servicecity.controller";
import cityWiseOffice from "../models/citywiseOffice.model";
const redis = require("redis");
const redis_client = redis.createClient(6379);
const saveDriverRequestStatusinRedis = false;

var firebase = require("firebase");
var config = require("../config");

//ONEBYONE Flow
var distance = require("google-distance-matrix");
const featuresSettings = require("../featuresSettings");
const cancelationConfig = require("../modules/cancelation/cancelationConfig");

//Find Drivers
export const findNearbyDriversAndSendRequest = async (
  tripdata,
  userreq,
  userid,
  pickupLng,
  pickupLat,
  serviceType,
  gender
) => {
  var serviceBasedRadius = await getRadiusBasedOnServiceCity(tripdata.scId);
  var maxDistBtRiderAndDriver =
    await serviceCityCtrl.getAllowedDistanceBtDriverNPickupBasedOnServiceCity(
      tripdata.scId
    );
  if (serviceBasedRadius) {
    var requestRadius = serviceBasedRadius.requestRadius
      ? serviceBasedRadius.requestRadius
      : config.requestRadius;
    if (tripdata.triptype == "rental")
      requestRadius = serviceBasedRadius.rentalRequestRadius
        ? serviceBasedRadius.rentalRequestRadius
        : config.requestRadius;
    if (tripdata.triptype == "outstation")
      requestRadius = serviceBasedRadius.outstationRequestRadius
        ? serviceBasedRadius.outstationRequestRadius
        : config.requestRadius;
  } else {
    var requestRadius = config.requestRadius;
    if (tripdata.triptype == "rental")
      requestRadius = config.rentalRequestRadius
        ? config.rentalRequestRadius
        : config.requestRadius;
    if (tripdata.triptype == "outstation")
      requestRadius = config.outstationRequestRadius
        ? config.outstationRequestRadius
        : config.requestRadius;
  }
  var neededService = serviceType;
  userreq.pickupLng = pickupLng;
  userreq.pickupLat = pickupLat;

  var maxDistanceInMeter = Number(requestRadius) * 1609;
  var driverFind = {
    /*coords: {
    $geoWithin: {
      $centerSphere: [[parseFloat(pickupLng), parseFloat(pickupLat)],
      requestRadius / 3963.2]
    },
  }, */
    online: true,
    curStatus: { $in: ["free", "requested"] },
    curService: neededService, //curStatus : 'free' or 'requested'
    // lastUpdate : { $gt: GFunctions.getUpcomingSchListMinusBuffer(0.5) }
  };
  if (gender == "Female" || gender == "female") {
    driverFind["gender"] = { 
      $in : ["female","Female"] 
    };
  }

  // if (
  //   featuresSettings.payPackageTypes &&
  //   featuresSettings.payPackageTypes.includes("subscription")
  // ) {
  //   driverFind["isSubcriptionActive"] = true;
  // }

  if (featuresSettings.getVehicleListAlongWithFeatures) {
    if (userreq.features) {
      driverFind["taxis.vehicletype"] = neededService;
      driverFind["taxis.feature"] = { $all: userreq.features };
    }
  }

  if (cancelationConfig.cancelExists) {
    if (cancelationConfig.ifcanceledBlockUser) {
      driverFind["$or"] = [
        { blockuptoDate: { $in: ["", null] } },
        { blockuptoDate: { $lt: new Date(GFunctions.getISODate()) } },
      ];
    }
  }

  if (featuresSettings.redTaxiModel) {
    if (tripdata.triptype == "rental") {
      driverFind["taxis"] = {
        $elemMatch: { vehicletype: neededService, isRental: true },
      };
    } else if (tripdata.triptype == "outstation") {
      // driverFind["taxis.isOutstation"] = true;
      driverFind["taxis"] = {
        $elemMatch: { vehicletype: neededService, isOutstation: true },
      };
    } else if (tripdata.triptype == "daily") {
      // driverFind["taxis.isDaily"] = true;
      driverFind["taxis"] = {
        $elemMatch: { vehicletype: neededService, isDaily: true },
      };
    }
  }

  var triptype = tripdata.triptype;
  if (featuresSettings.lowerCategoryCanUse.sedanToMini) {
    //if (neededService.toLowerCase() == "mini") {
    // driverFind["taxis"]["$elemMatch"]['$or']["isMini"] = true;
    delete driverFind["curService"];
    // driverFind["$or"] = [{ "isMini": true }];
    // driverFind["$or"].push({ "curService": neededService });
    delete driverFind["taxis"];
    if (triptype == "rental") {
      driverFind["$or"] = [
        {
          $and: [
            {
              currentCategoryOptions: { $in: [neededService] },
              isRental: true,
            },
            { taxis: { $elemMatch: { isRental: true } } },
          ],
        },
        {
          $and: [
            { curService: neededService },
            {
              taxis: {
                $elemMatch: { vehicletype: neededService, isRental: true },
              },
            },
          ],
        },
      ];
    } else if (triptype == "outstation") {
      driverFind["$or"] = [
        {
          $and: [
            {
              currentCategoryOptions: { $in: [neededService] },
              isOutstation: true,
            },
            { taxis: { $elemMatch: { isOutstation: true } } },
          ],
        },
        {
          $and: [
            { curService: neededService },
            {
              taxis: {
                $elemMatch: { vehicletype: neededService, isOutstation: true },
              },
            },
          ],
        },
      ];
    } else if (triptype == "daily") {
      if(tripdata.safeRideData.safeRidestatus == true || tripdata.safeRideData.safeRidestatus == "true"){
        driverFind["$or"] = [
          {
            $and: [
              {isTwoDriver:true},
              { currentCategoryOptions: { $in: [neededService] }, isDaily: true },
              { taxis: { $elemMatch: { isDaily: true } } },
            ],
          },
          {
            $and: [
              {isTwoDriver:true},
              { curService: neededService },
              {
                taxis: {
                  $elemMatch: { vehicletype: neededService, isDaily: true },
                },
              },
            ],
          },
        ];
      }
      else{
        driverFind["$or"] = [
          {
            $and: [
              { currentCategoryOptions: { $in: [neededService] }, isDaily: true },
              { taxis: { $elemMatch: { isDaily: true } } },
            ],
          },
          {
            $and: [
              { curService: neededService },
              {
                taxis: {
                  $elemMatch: { vehicletype: neededService, isDaily: true },
                },
              },
            ],
          },
        ];
      }
    }
    //}
  }

  var pipeline1 = {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [parseFloat(pickupLng), parseFloat(pickupLat)],
      },
      maxDistance: maxDistanceInMeter,
      spherical: true,
      distanceField: "distance",
    },
  };
  if (userreq.driverAssignmentType == "manual-assign") {
    driverFind = {
      _id: mongoose.Types.ObjectId(userreq.driverId),
    };
    pipeline1 = {
      $match: {},
    };
  }
  /* Driver.find(
    driverFind
  ).limit(config.driversNeedToPickFromSurrounding).exec((err, driverdata) => {
    // ).exec((err, driverdata) => { //50 Enough */
  var dummy = await Driver.aggregate([
    {
      $match: driverFind,
    }
  ])
  console.log("DRIVER_DATA: ", JSON.stringify(pipeline1),JSON.stringify(driverFind)) 
  Driver.aggregate([
    pipeline1,
    {
      $match: driverFind,
    },
  ])
    .limit(config.driversNeedToPickFromSurrounding)
    .exec(async(err, driverdata) => {
      if (err) {
        if (gender == "Female" || gender == "female") {
          GFunctions.notifyRider(
            userid,
            "No Female Driver Found So Please You Can Try Male Driver",
            tripdata._id
          ); //Error on Server
        } else {
        }
        GFunctions.notifyRider(userid, "No Driver Found", tripdata._id); //Error on Server
      }
      // else if(gender == "Female" || gender == "female"){
      //   GFunctions.notifyRider(
      //     userid,
      //     "No Female Driver Found So Please You Can Try Male Driver",
      //     tripdata._id
      //   ); //Error on Server
      // }
      else {
        console.log("DRIVER_DATA_LENGTH: ", driverdata.length) 
        if (driverdata.length == 0) {
          //SENDNOTIFICATIONTOADMIN
          if (gender == "Female" || gender == "female") {
            await GFunctions.notifyRider(
              userid,
              "No Female Driver Found So Please You Can Try Male Driver",
              tripdata._id
            ); //Error on Server
          }else{
          sendNoDriverFoundSMSToAdmin(
            tripdata.tripno,
            tripdata.triptype,
            1,
            tripdata.scId
          );
          noDriverFoundSMS(
            tripdata.requestFrom,
            tripdata.ridid,
            tripdata.requestId
          );
          await GFunctions.notifyRider(userid, "No Driver Found", tripdata._id);
          }
        } else {
          filterNSendOBORequestToDrivers(
            tripdata,
            userreq,
            driverdata,
            userid,
            pickupLng,
            pickupLat,
            userreq.driverAssignmentType,
            maxDistBtRiderAndDriver
          );
          clearTheUserRequestAfterSomeTime(
            tripdata._id,
            userid,
            tripdata.requestId
          );
        }
      }
    });
};

async function getRadiusBasedOnServiceCity(serviceId) {
  let availableService = await ServiceAvailableCities.findOne(
    { softDelete: false, _id: serviceId },
    {
      requestRadius: 1,
      rentalRequestRadius: 1,
      outstationRequestRadius: 1,
      city: 1,
    }
  ).lean(); //.distinct('cityBoundaryPolygon')
  return availableService;
}

function clearTheUserRequestAfterSomeTime(tripId, userid, adminId = "") {
  setTimeout(function () {
    needToCancelRequest(tripId, userid, adminId);
  }, config.userCancelTime); //30000 = 30 sec
}

//Need To Cancel Request
function needToCancelRequest(tripId, userid, adminId) {
  Trips.findOne(
    {
      _id: tripId,
      needClear: "yes",
      status: { $in: ["noresponse", "processing"] },
    },
    { _id: 1, tripno: 1, ridid: 1 },
    function (err, docs) {
      if (err) {
      } else if (!docs) {
      } else {
        clearTheTripOBOFlow(tripId, adminId);
        // GFunctions.notifyRider(docs.ridid, "No Driver Found", trip_id); //
        GFunctions.updateRiderFbStatus(userid, "No Driver Found", tripId);
      }
    }
  );
}

function filterNSendOBORequestToDrivers(
  tripdata,
  userreq,
  driverdata,
  userid,
  pickupLng,
  pickupLat,
  driverAssignmentType = "auto-assign",
  maxDistBtRiderAndDriver
) {
  if (
    featuresSettings.apiOptimisation &&
    featuresSettings.apiOptimisation.distanceMatrix
  ) {
    var sortedDistanceArray = addDocIdAndGetOnlyDriversArray(driverdata); //Merging In Driver and Geo
    updateTaxiWithFoundDrivers(sortedDistanceArray, tripdata._id, userid);
  } else {
    var convertedLatLon = convertCordsToGDMFormat(driverdata);
    var originsPoints = parseFloat(pickupLat) + "," + parseFloat(pickupLng);
    originsPoints = originsPoints.toString();
    var origins = [originsPoints];
    var destinations = convertedLatLon;
    distance.key(config.googleApi);
    distance.units("metric");
    distance.mode("driving");
    distance.matrix(origins, destinations, function (err, distances) {
      if (err) {
      } else if (distances.status == "OK") {
        var resOutput = distances.rows[0].elements;
        var distanceArray = addDocIdAndGetOnlyDistanceArry(
          driverdata,
          resOutput,
          tripdata.triptype,
          driverAssignmentType,
          maxDistBtRiderAndDriver
        ); //Merging In Driver and Geo
        if (featuresSettings.isCompanyPriorityDriverRequest == true) {
          var sortedDistanceArray = sortFunc(distanceArray); //In Meters
        } else {
          var sortedDistanceArray = distanceArray.sort(dynamicSort("distVal")); //In Meters
        }

        updateTaxiWithFoundDrivers(sortedDistanceArray, tripdata._id, userid);
      } else {
      }
    });
  }
}

/**
 * Log Found Drivers and No of Drivers in Trip Doc
 * @param {*} requestedDrivers
 * @param {*} requestId
 * @param {*} userid
 */
function updateTaxiWithFoundDrivers(requestedDrivers, requestId, userid) {
  var curReqAry = [requestedDrivers.length, 0];
  var update = {
    reqDvr: requestedDrivers,
    curReq: curReqAry,
  };

  Trips.findOneAndUpdate(
    { _id: requestId },
    update,
    { new: true },
    (err, doc) => {
      if (err) {
      } else {
        callTheOBOLoop(requestId); //Let start OBO loop for this Trip
      }
    }
  );
}

/**
 * callTheOBOLoop : Will process OBO Req if needed
 * @param {*} trip_id
 */
export const callTheOBOLoop = (trip_id) => {
  //Loop untill needClear : 'no'
  // { $or: [{loc:  "All" }, { loc : userCity }] }
  Trips.findOne(
    {
      _id: trip_id,
      $or: [
        { needClear: "yes" },
        { status: { $in: ["noresponse", "processing"] } },
      ],
    },
    function (err, docs) {
      if (err) {
      }
      if (docs) {
        //Find Current Driver
        var curReqDriverIndex = docs.curReq[1];
        var maxIndex = docs.curReq[0];

        var allDriversAvail = docs.reqDvr;
        var obj = allDriversAvail.find(function (obj) {
          return obj.called === 0;
        });

        var reqobj = allDriversAvail.find(function (obj) {
          return obj.called === 5;
        }); //FebNew

        if (obj) {
          sendRequestToDriversIfFree(docs, obj.drvId, 1);
        } else if (reqobj) {
          //FebNew
          // sendRequestToDriversIfFree(docs, reqobj.drvId, 5);

          sendRequestToDriversIfFreeAfterSomeTime(docs, reqobj.drvId, 6);
        } else {
          // var calledObj = allDriversAvail.find(function (obj) { return obj.called === 1; });
          // if (calledObj){
          //   sendRequestToDriversIfFree(docs, obj.drvId, 1);
          // }else{
          //   clearTheTripOBOFlow(trip_id);
          //   GFunctions.notifyRider(docs.ridid, "No Driver Found", trip_id); // Run out off Driver
          // }

          clearTheTripOBOFlow(trip_id);
          GFunctions.notifyRider(docs.ridid, "No Driver Found", trip_id); //
        }
      }
    }
  );
};

function sendRequestToDriversIfFreeAfterSomeTime(docs, drvId, status) {
  setTimeout(function () {
    sendRequestToDriversIfFree(docs, drvId, 1);
  }, 20000); //30000 = 30 sec
} //FebNew

function updateCurIndexToTrip(trip_id, curReqDriverIndex, maxIndex) {
  var curReqAry = [maxIndex, curReqDriverIndex];
  Trips.findByIdAndUpdate(
    trip_id,
    {
      curReq: curReqAry,
    },
    { new: true },
    function (err, doc) {
      if (err) {
      }
    }
  );
}

async function sendRequestToDriversIfFree(docs, curReqDriverId, status = 1) {
  Driver.findById(curReqDriverId, async function (err, doc) {
    if (err) {
      updateAsThisDriveriSCalled(docs, curReqDriverId, status);
    }
    var curStatus = doc.curStatus;
    var online = doc.online;

    if (online) {
      if (saveDriverRequestStatusinRedis) {
        if (curStatus == "free") {
          var driverRequestStatusinRedis = await checkCacheStatus(
            curReqDriverId.toString()
          );
          //if cache not exists ? use db ?
          if (driverRequestStatusinRedis == "free") {
            updateAsThisDriveriSCalled(docs, curReqDriverId, status);
          } else if (driverRequestStatusinRedis == "requested") {
            if (status == 1) status = 5;

            updateAsThisDriveriSCalled(docs, curReqDriverId, status);
          }
        } else {
          if (status == 1) status = 7; //accepted or other status

          updateAsThisDriveriSCalled(docs, curReqDriverId, status);
        }
      } else {
        if (curStatus == "free") {
          updateAsThisDriveriSCalled(docs, curReqDriverId, status);
        } else if (curStatus == "requested") {
          if (status == 1) status = 5;

          updateAsThisDriveriSCalled(docs, curReqDriverId, status);
        } else {
          if (status == 1) status = 7; //accepted or other status

          updateAsThisDriveriSCalled(docs, curReqDriverId, status);
        }
      }
      //if we run out of Driver SUM no of called, if it less than 3 search more
    } else {
      if (status == 1) status = 7; //accepted or other status

      updateAsThisDriveriSCalled(docs, curReqDriverId, status);
    }
  });
}

function updateAsThisDriveriSCalled(tripDoc, driverid, callStatus = 1) {
  Trips.update(
    {
      _id: tripDoc._id,
      "reqDvr.drvId": mongoose.Types.ObjectId(driverid),
      //  status: { $in: ['noresponse', 'processing'] }
      status: { $in: ["processing"] },
    },
    {
      $set: {
        "reqDvr.$.called": callStatus,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
      }
      if (Number(callStatus) == 1) {
        sendRequestToDrivers(tripDoc, driverid);
      } else if (Number(callStatus) == 5) {
        callTheOBOLoop(tripDoc._id);
      } else if (Number(callStatus) == 7) {
        callTheOBOLoop(tripDoc._id);
      } else {
        callTheOBOLoop(tripDoc._id);
      }
    }
  );
}

function updateAsThisDriverIsErrAndCallOBO(tripDoc, driverid) {
  Trips.update(
    { _id: tripDoc._id, "reqDvr.drvId": mongoose.Types.ObjectId(driverid) },
    {
      $set: {
        "reqDvr.$.called": 1,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
      }
    }
  );
}

//Update fb tripDoc hsa limited values
function sendRequestToDrivers(tripDoc, curReqDriverId) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var totalKM = tripDoc.dsp.distanceKM ? tripDoc.dsp.distanceKM : "NA";
  if (tripDoc.triptype == "daily") {
    totalKM = totalKM + config.distanceUnit;
  }
  var safeRideData;
  if (tripDoc.safeRideData.safeRidestatus == "false") {
    safeRideData = { safeRidestatus: "false" };
  }
  if (tripDoc.safeRideData.safeRidestatus == "true") {
    safeRideData = {
      safeRidestatus: "true",
      safeRidevehicle: {
        model: tripDoc.safeRideData.safeRidevehicle.model,
        number: tripDoc.safeRideData.safeRidevehicle.number,
        makename: tripDoc.safeRideData.safeRidevehicle.makename,
        vehiclecolor: tripDoc.safeRideData.safeRidevehicle.vehiclecolor,
      },
    };
  }

  if(tripDoc.multiLocation.length > 0){
    var requestData = {
      accept: {
        others: "0",
        trip_id: "0",
      },
  
      request: {
        totalKM: totalKM,
        totalFare: tripDoc.fare,
        drop_address: tripDoc.dsp.end,
        // stop_one : tripDoc.multiLocation[1].strAddress,
        // stop_two : tripDoc.multiLocation[2].strAddress,
        etd: tripDoc.estTime,
        picku_address: tripDoc.dsp.start,
        request_id: tripDoc._id,
        status: "1",
        datetime: tripDoc.tripDT ? tripDoc.tripDT : "0",
        request_type: tripDoc.bookingType ? tripDoc.bookingType : "rideNow",
        triptype: tripDoc.triptype ? tripDoc.triptype : "daily",
        vehicle: tripDoc.vehicle ? tripDoc.vehicle : "Small",
        outstationType: tripDoc.dsp.outstationType
          ? tripDoc.dsp.outstationType
          : "oneway",
        review: "Taxi Request",
        request_no: "0",
      },
    };
    if(safeRideData != undefined){
      requestData.request.safeRideData = safeRideData
    }
    if(tripDoc.multiLocation.length == 3){
      requestData.request.stop_one = tripDoc.multiLocation[1].strAddress
    }
    if(tripDoc.multiLocation.length == 4){
      requestData.request.stop_one = tripDoc.multiLocation[1].strAddress
      requestData.request.stop_two = tripDoc.multiLocation[2].strAddress
    }
  }
  else {
    var requestData = {
      accept: {
        others: "0",
        trip_id: "0",
      },
  
      request: {
        totalKM: totalKM,
        totalFare: tripDoc.fare,
        drop_address: tripDoc.dsp.end,
        etd: tripDoc.estTime,
        picku_address: tripDoc.dsp.start,
        request_id: tripDoc._id,
        status: "1",
        datetime: tripDoc.tripDT ? tripDoc.tripDT : "0",
        request_type: tripDoc.bookingType ? tripDoc.bookingType : "rideNow",
        triptype: tripDoc.triptype ? tripDoc.triptype : "daily",
        vehicle: tripDoc.vehicle ? tripDoc.vehicle : "Small",
        outstationType: tripDoc.dsp.outstationType
          ? tripDoc.dsp.outstationType
          : "oneway",
        review: "Taxi Request",
        request_no: "0",
      },
    };
    if(safeRideData != undefined){
      requestData.request.safeRideData = safeRideData
    }
  }
  

  var tripType = tripDoc.triptype ? tripDoc.triptype : "daily";

  var child = curReqDriverId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
      // Send FCM
      // findAndSendFCMToDriver(child, "New Request");
      updateDriverReqStatusINMongo(curReqDriverId, tripDoc._id, tripType);
      findAndSendFCMToDriver(
        curReqDriverId,
        "New Trip Request Received.",
        null,
        true,
        true
      );
      // findAndSendFCMToDriver(curReqDriverId,'Received New Trip Request.');
    }
  });
}

async function updateDriverReqStatusINMongo(
  driverid,
  tripId,
  tripType = "daily"
) {
  if (saveDriverRequestStatusinRedis) {
    driverid = driverid.toString();
    var data = {
      curStatus: "requested",
    };
    redis_client.setex(driverid, 60, JSON.stringify(data)); //1 Min
  } else {
    Driver.findByIdAndUpdate(
      driverid,
      {
        curStatus: "requested",
        // 'curTrip': tripId,
      },
      { new: true },
      function (err, doc) {
        if (err) {
        }
        // findAndSendFCMToDriver(child, "New Request"); //Only

        clearDriverTaxiRequest(driverid, tripId, tripType);
      }
    );
  }
}

function clearDriverTaxiRequest(driverid, tripId, tripType) {
  var requestTime = config.requestTime;
  if (tripType == "outstation") requestTime = config.requestTimeOutsation;
  setTimeout(function () {
    needToResetDriver(driverid, tripId);
  }, requestTime); //30000 = 30 sec
}

function clearMyTripStatusFB(driverid, tripId) {
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
      totalKM: "0",
      totalFare: "0",
      drop_address: "0",
      etd: "0",
      picku_address: "0",
      request_id: "0",
      status: "0",
      datetime: "0",
      request_type: "0",
      review: "Time Out",
      request_no: "0",
      triptype: "0",
      safeRideData: "0",
    },
  };

  var child = driverid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
    }
  });
}

export const needToResetDriver = (driverid, tripId) => {
  Driver.findOne(
    { _id: driverid, curStatus: "requested" },
    {},
    // Driver.findOne({ _id: driverid, 'curStatus': 'requested', 'curTrip': tripId }, {}, //Use this if Timeout error happens for Previous Rides
    function (err, doc) {
      if (err) {
      }
      if (!doc) {
      }
      if (doc) {
        clearMyTripStatusFB(driverid, tripId);
        // updateAsThisDriveriSDeclined(tripId, driverid);
        changeMyTripStatusMongo(driverid, "free");
        callTheOBOLoop(tripId);
      }
    }
  );
};

export const needToResetDeclinedDriver = (driverid, tripId) => {
  Driver.findOne(
    { _id: driverid, curStatus: {$in:[ "requested","onPickup"]} },
    {},
    function (err, doc) {
      if (err) {
      }
      if (!doc) {
      }
      if (doc) {
        updateAsThisDriveriSDeclined(tripId, driverid);
        changeMyTripStatusMongo(driverid, "free");
        callTheOBOLoop(tripId);
      }
    }
  );
};

function updateAsThisDriveriSDeclined(tripId, driverid) {
  Trips.update(
    { _id: tripId, "reqDvr.drvId": mongoose.Types.ObjectId(driverid) },
    {
      $set: {
        "reqDvr.$.called": 2,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
      }
    }
  );
}

async function changeMyTripStatusMongo(driverid, msg = "free") {
  if (saveDriverRequestStatusinRedis) {
    driverid = driverid.toString();
    var data = {
      curStatus: msg,
    };
    redis_client.setex(driverid, 60, JSON.stringify(data)); //1 Min
  } else {

    Driver.findByIdAndUpdate(
      driverid,
      {
        curStatus: msg,
      },
      { new: true },
      function (err, doc) {
        if (err) {
        }
      }
    );
  }
}

//Helper OBOR
/**
 * convertCordsToGDMFormat
 * @param {*} docs
 */
function convertCordsToGDMFormat(docs) {
  var resultDoc = docs.map(function (items) {
    var destinations = "";
    var tmpDoc = items.coords;
    destinations = tmpDoc[1] + "," + tmpDoc[0];
    return destinations;
  });
  return resultDoc;
}

/**
 * addDocIdAndGetOnlyDistanceArry
 * @param {*} docs
 * @param {*} GDMop
 */
function addDocIdAndGetOnlyDistanceArry(
  docs,
  GDMop,
  triptype = "daily",
  driverAssignmentType,
  maxDistBtRiderAndDriverFromDb
) {
  var totalArray = docs.length;
  var GMDistAry = [];
  for (let i = 0; i < totalArray; i++) {
    let isDistOk = GDMop[i].status;
    if (isDistOk == "OK") {
      let tempObj = {};
      let distBtPickAndDrop = GDMop[i].distance.value;

      var maxDistBtRiderAndDriver =
        maxDistBtRiderAndDriverFromDb.maxDistBtRiderAndDriverDaily
          ? maxDistBtRiderAndDriverFromDb.maxDistBtRiderAndDriverDaily
          : config.maxDistBtRiderAndDriver;
      if (triptype == "rental")
        maxDistBtRiderAndDriver =
          maxDistBtRiderAndDriverFromDb.maxDistBtRiderAndDriverRental
            ? maxDistBtRiderAndDriverFromDb.maxDistBtRiderAndDriverRental
            : config.maxDistBtRiderAndDriverRental;
      if (triptype == "outstation")
        maxDistBtRiderAndDriver =
          maxDistBtRiderAndDriverFromDb.maxDistBtRiderAndDriverOutsation
            ? maxDistBtRiderAndDriverFromDb.maxDistBtRiderAndDriverOutsation
            : config.maxDistBtRiderAndDriverOutsation;
      maxDistBtRiderAndDriver = Number(maxDistBtRiderAndDriver) * 1609;
      if (driverAssignmentType == "manual-assign") {
        maxDistBtRiderAndDriver = distBtPickAndDrop;
      }

      if (Number(distBtPickAndDrop) <= Number(maxDistBtRiderAndDriver)) {
        //Only if Distance is lesser than max
        tempObj["drvId"] = docs[i]._id;
        tempObj["called"] = 0;
        //Also Limit only 10 Drivers @TODO
        tempObj["distVal"] = GDMop[i].distance.value;
        if (featuresSettings.isCompanyPriorityDriverRequest == true) {
          if (docs.isIndividual == false) {
            tempObj["company"] = 1;
          } else {
            tempObj["company"] = 0;
          }
        }
        GMDistAry.push(tempObj);
      }
    }
  }
  return GMDistAry;
}

function addDocIdAndGetOnlyDriversArray(docs, GDMop) {
  var totalArray = docs.length;
  var GMDistAry = [];
  for (let i = 0; i < totalArray; i++) {
    let tempObj = {};
    tempObj["drvId"] = docs[i]._id;
    tempObj["called"] = 0;
    tempObj["notify"] = 0;
    // tempObj['distVal'] = 0;
    tempObj["distVal"] = docs[i].distance
      ? Number(docs[i].distance.toFixed(2))
      : 0;
    tempObj["cords"] = docs[i].driverLocation.coordinates;
    GMDistAry.push(tempObj);
  }
  return GMDistAry;
}

/**
 * dynamicSort
 * @param {*} property
 */
function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

/**
 * sortFunc
 * @param {*} property
 */
function sortFunc(driverArr) {
  var distanceBased = driverArr.sort(function (a, b) {
    if (a.distVal > b.distVal) {
      return -1;
    } else {
      return 1;
    }
  });

  var companyBased = distanceBased.sort(function (a, b) {
    if (a.company > b.company) {
      return -1;
    } else {
      return 1;
    }
  });
  return companyBased;
}

//ONEBYONE TEST END

//Convert String To ID
export const convertSTO = (req, res) => {
  Trips.find({})
    .skip(0)
    .exec((err, tripvalue) => {
      if (err) {
      }
      //var m=0;
      for (var i = 0; i < tripvalue.length; i++) {
        var driverId = tripvalue[i].dvrid;
        var tripID = tripvalue[i]._id;
        removeFromDoc(tripID, driverId);
      }
    });
};

function removeFromDoc(tripID, driverId) {
  Trips.update({ _id: tripID }, { $unset: { dvrid: 1 } }).exec((err, data) => {
    if (err) {
    }
    addToFromDoc(tripID, driverId);
  });
}

function addToFromDoc(tripID, driverId) {
  Trips.update({ _id: tripID }, { $set: { dvrid: driverId } }).exec(
    (err, data) => {
      if (err) {
      }
    }
  );
}

//Cancel from Rider side
export const cancelOBOTaxiRequest = async (
  driverdata,
  requestId,
  msg = "User Cancelled"
) => {
  changeMyTripStatusMongo(driverId, "free"); //clearing it first to avoid set timeout calling

  clearTheTripOBOFlow(requestId);
  //Find Current Req Driver
  var driverId = getLastCalledDriver(driverdata);
  if (driverId) {
    changeMyTripStatusMongo(driverId, "free"); //clearing it first to avoid set timeout calling
    clearTheTripOBOFlowForDriver(driverId);
  }
};

export const clearTheTripOBOFlow = async (requestId, adminId) => {
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
        if (!doc.dvrid) {
          noDriverFoundSMS(doc.requestFrom, doc.ridid, adminId);
          //SENDNOTIFICATIONTOADMIN
          sendNoDriverFoundSMSToAdmin(doc.tripno, doc.triptype, 2, doc.scId);
        }
      }
    }
  );
};

function getLastCalledDriver(driverdata) {
  let list = _.filter(driverdata, (item) => item.called === 1);
  var last = list.slice(-1).pop();
  if (last) {
    return last.drvId;
  } else {
    return false;
  }
}

/**
 * Clearing Driver in Fb and Mongo to free him
 * @param {*} req
 * @param {*} res
 */
export const clearTheTripOBOFlowForDriver = (
  driverId,
  msg = "User Cancelled"
) => {
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
      totalKM: "0",
      totalFare: "0",
      drop_address: "0",
      etd: "0",
      picku_address: "0",
      request_no: "0",
      request_id: "0",
      status: "0",
      datetime: "0",
      triptype: "0",
      request_type: "0",
      review: msg,
      safeRideData: "0",
    },
  };
  var child = driverId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
    }
  });
};

async function sendNoDriverFoundSMSToAdmin(
  tripno,
  triptype,
  driverstatus = 1,
  scId
) {
  var driverstatusMsg = "No+Driver+Found";
  if (driverstatus == 2) driverstatusMsg = "No+Driver+Response";
  var citywiseOfficeDetails = await cityWiseOffice.findOne({
    "scIds.scId": { $in: scId },
  });
  var phoneNo = config.supportNo;
  if (citywiseOfficeDetails) phoneNo = citywiseOfficeDetails.phone;
  if (triptype != "daily") {
    smsGateway.sendSmsMsg(phoneNo, "", config.phoneCode, "", "noDriverFound", {
      TRIPNO: tripno,
      DRIVERSTATUS: driverstatusMsg,
      TRIPTYPE: triptype,
    });
  }
}

async function checkCacheStatus(hashKey) {
  return new Promise(function (resolve, reject) {
    redis_client.get(hashKey, (err, data) => {
      if (err) {
        resolve("free");
      }
      //if no match found
      if (data != null) {
        var data1 = JSON.parse(data);
        resolve(data1.curStatus);
      } else {
        //proceed to next middleware function
        resolve("free");
      }
    });
  });
}
