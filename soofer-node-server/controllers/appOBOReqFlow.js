import mongoose from "mongoose";
//import models
import Trips from "../models/trips.model";
import Driver from "../models/driver.model";
import * as GFunctions from "./functions";

var distance = require("google-distance-matrix");
var firebase = require("firebase");
var config = require("../config");

/**
 * [Taxi Request from User]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const requestTaxi = async (req, res) => {
  if (req.body.promoAmt == "" || req.body.promoAmt == undefined) {
    req.body.promoAmt = 0;
  }
  var promoAmt = req.body.promoAmt;
  var promoCode = req.body.promo;

  var reqTripType = "Ride";
  var newDoc = new Trips({
    triptype: reqTripType,
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
    estTime: req.body.time,
    status: "processing",
  });
  //checking is this user has processing trips of type RIDE
  Trips.findOne(
    { ridid: req.userId, status: "processing", triptype: "Ride" },
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
          message: req.i18n.__("REQUEST_ALREADY_PROCESS"),
          error: err,
        });
      newDoc.save((err, tripdata) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: err.message, err: err });
        }
        updateRiderFbStatus(req.userId, "Processing", tripdata._id); //processing = Req intermediate state
        findNearbyDrivers(tripdata, req.body, req.userId);
        return res.status(200).json({
          success: true,
          message: req.i18n.__("TAXI_REQUESTED_SENDED"),
          requestDetails: tripdata._id,
        });
      });
    }
  );
};

//Find Drivers
function findNearbyDrivers(tripdata, userreq, userid) {
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
  })
    .limit(10)
    .exec((err, driverdata) => {
      // ).exec((err, driverdata) => { //50 Enough
      if (err) {
        notifyRider(userid, "No Driver Found", tripdata._id); //Error on Server
      }
      if (driverdata.length <= 0) {
        notifyRider(userid, "No Driver Found", tripdata._id);
      } else {
        filterNSendOBORequestToDrivers(tripdata, userreq, driverdata, userid);
      }
    });
}

function filterNSendOBORequestToDrivers(tripdata, userreq, driverdata, userid) {
  var convertedLatLon = convertCordsToGDMFormat(driverdata);
  var originsPoints =
    parseFloat(userreq.pickupLat) + "," + parseFloat(userreq.pickupLng);
  originsPoints = originsPoints.toString();
  var origins = [originsPoints];
  var destinations = convertedLatLon;
  distance.key(config.googleApi);
  distance.units("metric");
  distance.mode("driving");
  distance.matrix(origins, destinations, function (err, distances) {
    if (err) {
      console.log("GGMErr NDF", err);
    } else if (distances.status == "OK") {
      var resOutput = distances.rows[0].elements;
      var distanceArray = addDocIdAndGetOnlyDistanceArry(driverdata, resOutput); //Merging In Driver and Geo
      var sortedDistanceArray = distanceArray.sort(dynamicSort("distVal")); //In Meters
      updateTaxiWithFoundDrivers(sortedDistanceArray, tripdata._id, userid);
    } else {
      notifyRider(userid, "No Driver Found", tripdata._id); //GGMErr NDF in Land
      // console.log('GGMErr NDF in Land')
    }
  });
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
        notifyRider(userid, "No Driver Found", requestId); //Err updating to Trip data
        // console.log("updateTaxiStatus", err);
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
function callTheOBOLoop(trip_id) {
  //Loop untill needClear : 'no'
  Trips.findOne(
    { _id: trip_id, needClear: "yes" },
    { _id: 1, tripno: 1, reqDvr: 1, curReq: 1, dsp: 1, estTime: 1 },
    function (err, docs) {
      if (err) {
        console.log("NTF");
      }
      if (docs) {
        var allDriversAvail = docs.reqDvr;
        var obj = allDriversAvail.find(function (obj) {
          return obj.called === 0;
        });

        if (obj) {
          sendRequestToDriversIfFree(docs, obj.drvId);
        }
      }
    }
  );
}

function sendRequestToDriversIfFree(docs, curReqDriverId) {
  Driver.findById(curReqDriverId, function (err, doc) {
    if (err) {
      updateAsThisDriveriSCalled(docs, curReqDriverId, 1);
    }
    var curStatus = doc.curStatus;
    if (curStatus == "free") {
      updateAsThisDriveriSCalled(docs, curReqDriverId, 1);
    } else if (curStatus == "requested") {
      updateAsThisDriveriSCalled(docs, curReqDriverId, 0);
    } else {
      updateAsThisDriveriSCalled(docs, curReqDriverId, 1);
    }
  });
}

function updateAsThisDriveriSCalled(tripDoc, driverid, callStatus = 1) {
  Trips.update(
    { _id: tripDoc._id, "reqDvr.drvId": mongoose.Types.ObjectId(driverid) },
    {
      $set: {
        "reqDvr.$.called": callStatus,
      },
    },
    { new: true },
    function (err, doc) {
      if (err) {
        console.log("err", err);
      }
      if (callStatus) {
        sendRequestToDrivers(tripDoc, driverid);
      } else {
        callTheOBOLoop(tripDoc._id);
      }
    }
  );
}

function updateDriverReqStatusINMongo(driverid, tripId) {
  Driver.findByIdAndUpdate(
    driverid,
    {
      curStatus: "requested",
    },
    { new: true },
    function (err, doc) {
      if (err) {
      }
      findAndSendFCMToDriver(child, "New Request", "updateDriver");
      clearDriverTaxiRequest(driverid, tripId);
    }
  );
}

function clearDriverTaxiRequest(driverid, tripId) {
  setTimeout(function () {
    needToResetDriver(driverid, tripId);
  }, 30000); //30000 = 30 sec
}

function needToResetDriver(driverid, tripId) {
  Driver.findOne(
    { _id: driverid, curStatus: "requested" },
    {},
    function (err, doc) {
      if (err) {
      }
      if (!doc) {
      }
      if (doc) {
        clearMyTripStatusFB(driverid, tripId);
        changeMyTripStatusMongo(driverid, "free");
        callTheOBOLoop(tripId);
      }
    }
  );
}

function findAndSendFCMToDriver(userId, msg, content) {
  Driver.findById(userId, function (err, docs) {
    if (err) {
    } else {
      if (docs.fcmId) {
        GFunctions.sendFCMMsg(docs.fcmId, msg, content);
      }
    }
  });
}

function changeMyTripStatusMongo(driverid, msg = "free") {
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

//FireBase Helper
/**
 * updateRiderFbStatus =
 * @param {*} userid
 * @param {*} msg
 * @param {*} requestId
 */
function updateRiderFbStatus(userid, msg, requestId = "0") {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    tripstatus: msg,
    requestId: requestId,
  };
  var child = userid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
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
    (err, doc) => {
      if (err) {
      } else {
        updateRiderFbStatus(userid, msg, requestId);
      }
    }
  );
}

//Update fb
function sendRequestToDrivers(tripDoc, curReqDriverId) {
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
      drop_address: tripDoc.dsp[0].to,
      etd: tripDoc.estTime,
      picku_address: tripDoc.dsp[0].from,
      request_id: tripDoc._id,
      status: "1",
      datetime: "0",
      request_type: "Normal",
      review: "Taxi Request",
      request_no: 0,
    },
  };

  var child = curReqDriverId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
      updateDriverReqStatusINMongo(curReqDriverId, tripDoc._id);
    }
  });
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
      drop_address: "0",
      etd: "0",
      picku_address: "0",
      request_id: "0",
      status: "0",
      datetime: "0",
      request_type: "0",
      review: "Time Out",
      request_no: 0,
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
function addDocIdAndGetOnlyDistanceArry(docs, GDMop) {
  var totalArray = docs.length;
  var GMDistAry = [];
  for (let i = 0; i < totalArray; i++) {
    let isDistOk = GDMop[i].status;
    if (isDistOk == "OK") {
      let tempObj = {};
      tempObj["drvId"] = docs[i]._id;
      tempObj["called"] = 0;
      //if dis val < or > in config use only this @TODO
      //Also Limit only 10 Drivers @TODO
      tempObj["distVal"] = GDMop[i].distance.value;
      GMDistAry.push(tempObj);
    }
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
