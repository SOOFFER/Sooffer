import mongoose, { Query } from "mongoose";

//import model
import * as safeRideCtrl from "../../models/ridertaxi.model";
import Driver from "../../models/driver.model";
import Ridertaxi from "../../models/ridertaxi.model";
import Trips from "../../models/trips.model";
import * as GFunctions from "../../controllers/functions";

//import package
import { insidePolygon } from "geolocation-utils";
import _ from "lodash";
const fs = require("fs");
var firebase = require("firebase");
const saveDriverRequestStatusinRedis = false;

//import config file
import featuresSettings from "../../featuresSettings";
import config from "../../config";
import { DriverLocation } from "../../controllers/app";

///    Adding Rider Taxi Data//

export const addRidertaxisData = (req, res) => {
  /// Rider Taxi Details ////
  console.log("........reqqqsafe", req.body);
  var id = mongoose.Types.ObjectId();
  var newDoc = new Ridertaxi({
    _id: id,
    number: req.body.number,
    makename: req.body.makename,
    model: req.body.model,
    vehiclecolor: req.body.color,
    isDaily: true,
    isRental: false,
    isOutstation: false,
  });
  console.log(newDoc);

  let doc = {
    number: req.body.number,
    makename: req.body.makename,
    model: req.body.model,
    vehiclecolor: req.body.color,
  }
  newDoc.save((err, docs) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: err.message, err: err });
    } else {
      console.log(docs);
      return res.json({
        success: true,
        message: req.i18n.__("DATA_ADDED"),
        taxi: docs,
      });
    }
  });
};

///  Suggestion Driver or Second Driver ///

export const suggestionDriver = async (req, res) => {
  const phonenumber = req.body.phone;
  await Driver.findOne({ phone: phonenumber, }, function (err, driverdata) {
    // Find the Driver Data//
    console.log("driverdata", driverdata);
    if (err || !driverdata) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: req.i18n.__("Please Add the Driver Data"),
        error: err,
      });
    } else {
      var driverCurStatus = driverdata.curStatus;
      var driverOnlineStatus = driverdata.online;
      console.log("_______________ driverCurStatus",driverCurStatus)
      if(driverdata.isTwoDriver != true){
        console.log("_________________DRIVER isTwo driver is false")
        return res.status(409).json({
          sucess: false,
          message: req.i18n.__(
            "YOUR_SUGGESTION_DRIVER_IS_CURRENTLY_NOT_AVALIBLE"
          ),
          error: err,
        });
      }
      if (driverCurStatus != "free" /*|| (driverOnlineStatus != 'true')*/) {
        // The Second Driver curstatus is Not free
        console.log("11111111")
        return res.status(409).json({
          sucess: false,
          message: req.i18n.__(
            "YOUR_SUGGESTION_DRIVER_IS_CURRENTLY_NOT_AVALIBLE"
          ),
          error: err,
        });
      }
      else {
        console.log("_____________ comming assigned")
        // The Second Driver curstatus is free
        var updateData = {
          driverId: driverdata._id,
          status: 0,
          pickup: driverdata.coords,
        };
        console.log(".......updateData0", updateData);
        Trips.findOneAndUpdate(
          { tripno: req.body.tripno },
          { $push: { "safeRideData.secondDrivers": updateData } },
          { new: true },
          async (err, tripdata) => {
            if (err) {
              console.log("errr",err);
              return res.status(409).json({
                sucess: false,
                message: req.i18n.__("SOME_ERROR_UPDATING"),
                error: err,
              });
            } else if (tripdata) {
              // await sendRequestToSecondDriver(tripdata, driverdata) // No Need Send the request for second Driver

              await updateseconddriverstatusinFb(tripdata, req.body.tripno);
              await acceptRequest(driverdata._id, tripdata._id); /// second Driver Directly assaign the Trip ///
              return res.status(200).json({
                success: true,
                message: req.i18n.__(
                  "Your second Driver Accepted your request"
                ),
                tripId: tripdata.tripno,
              });
            }
          }
        );
      }
    }
  });
};
function updateseconddriverstatusinFb(tripdata, tripId) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data");
  console.log("----------->safe ride",tripdata.safeRideData.safeRidevehicle);
  var requestData = {
    safeRideData: {
      safeRidestatus: tripdata.safeRideData.safeRidestatus,
      secondDriver: tripdata.safeRideData.secondDrivers[0].driverId,
      safeRidetripStatus: "6",
      // safeRidevehicle: tripdata.safeRideData.safeRidevehicle,
      edtModel: tripdata.safeRideData.safeRidevehicle.model,
      edtMake : tripdata.safeRideData.safeRidevehicle.makename,
      edtcolor : tripdata.safeRideData.safeRidevehicle.vehiclecolor,
      edtPhoneNumber : tripdata.safeRideData.safeRidevehicle.number
      // model: tripdata.safeRideData.safeRidevehicle.model
    },
  };
  console.log("........requestData.", requestData);
  var child = tripId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
      logger.error("error00",error);
    } else {
      console.log(child, "SafeRideData");
    }
  });
}



///Request Send ///

function updateSecondDriverAcceptStatusInFb(tripdata, driverdata, tripno) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var totalKM = tripdata.dsp.distanceKM ? tripdata.dsp.distanceKM : "NA";
  if (tripdata.triptype == "daily") {
    totalKM = totalKM + " KM";
  }

  var requestData = {
    accept: {
      others: "0",
      trip_id: tripno,
    },
    request: {
      //  Pickup_address: driverdata.coords,
      // etd: userreq.time,
      totalKM: totalKM,
      totalFare: tripdata.fare,
      drop_address: tripdata.dsp.end,
      etd: tripdata.estTime,
      picku_address: tripdata.dsp.start,
      request_id: tripdata._id,
      status: "1",
      datetime: tripdata.tripDT ? tripdata.tripDT : "0",
      request_type: tripdata.bookingType ? tripdata.bookingType : "rideNow",
      triptype: tripdata.triptype ? tripdata.triptype : "daily",
      vehicle: tripdata.vehicle ? tripdata.vehicle : "Small",
      outstationType: tripdata.dsp.outstationType
        ? tripdata.dsp.outstationType
        : "oneway",
      review: "Accepted",
      request_no: "0",
    },
  };

  var tripType = tripdata.triptype ? tripdata.triptype : "safeRide";
  var child = driverdata._id.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
    } else {
      updateSecondDriverReqStatusINMongo(
        driverdata._id,
        tripdata._id,
        tripType
      );
    }
  });
}

///SecondDriver Reqstatus in Mongo ///

async function updateSecondDriverReqStatusINMongo(
  driverid,
  tripId,
  tripType = "safeRide"
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
        clearSecondDriverTaxiRequest(driverid, tripId, tripType);
      }
    );
  }
}

function clearSecondDriverTaxiRequest(driverid, tripId, tripType) {
  var requestTime = config.requestTime;
  if (tripType == "outstation") requestTime = config.requestTimeOutsation;
  setTimeout(function () {
    needToResetSecondDriver(driverid, tripId);
  }, requestTime); //30000 = 30 sec
}

export const needToResetSecondDriver = (driverid, tripId) => {
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
        console.log("....doc", doc);
        changeSecondDriverTripStatusMongo(driverid, "free");
      }
    }
  );
};

async function changeSecondDriverTripStatusMongo(driverid, msg = "free") {
  // console.log("..........")
  if (saveDriverRequestStatusinRedis) {
    driverid = driverid.toString();
    console.log("secondDriverdriverid", driverid);
    var data = {
      curStatus: msg,
    };
    redis_client.setex(driverid, 60, JSON.stringify(data)); //1 Min
  } else {
    // console.log("...change...")
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

/// First Driver Notification ///

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

//// second DRiver Notification///

export function findAndSendFCMToSecondDriver(
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

/// accept Request //

export const acceptRequest = async (userId, requestId) => {
  let driverDoc = await Driver.findById(userId).exec();

  var trip = await Trips.findOne({ _id: requestId });

  if (featuresSettings.isMultipleCompaniesDriversAvailable) {
    if (!driverDoc.isIndividual) {
      update.cpyid = driverDoc.cmpy;
    }
  }
  Trips.updateOne(
    {
      _id: requestId,
      "safeRideData.secondDrivers.status": "0",
      "safeRideData.secondDrivers.driverId": driverDoc._id,
    },
    {
      $set: {
        "safeRideData.secondDrivers.$.status": "1",
      },
    },
    async (err, doc) => {
      if (err) {
      }
    }
  );

  Trips.findOne({ _id: requestId }, async (err, doc) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    }
    var updateScId = await Driver.findOneAndUpdate(
      { _id: userId },
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
      console.log(error);
    }
    //ETA

    if (!doc) {
      console.log(".....!doc");
      return res
        .status(409)
        .json({ success: false, message: req.i18n.__("REQUEST_PROCESSED") });
    }
    // if (doc.bookingType == 'rideNow') {
    //     console.log("..........................ridenow")
    await updateSecondDriverAcceptStatusInFb(doc, driverDoc, doc.tripno);
    // }
    await changeSecondDriverTripStatusMongo(
      userId,
      doc.tripno,
      doc.bookingType,
      doc
    );
    // }
    findAndSendFCMToDriver(
      doc.dvrid,
      "Driver Has Accepted Your Trip Request",
      "acceptRequest"
    );
    findAndSendFCMToSecondDriver(userId, "Your pickup driver is on the way");
  });
};

/////  secondDriver Trip starting vehicle image and Trip Ending Vehicle image ////

export const imageAdd = async (req, res) => {
  try {
    var filesUpload = req.files.map((e) => e.path);
    const tripcurrentStatus = req.body.status;
    const tripId = req.body.tripId;
    Trips.findOne({ tripno: tripId }, function (err, tripdata) {
      if (err) {
        console.log(err);
      }
      if (tripdata) {
        if (tripcurrentStatus == "Start") {
          /// Trip starting 4 images ///
          Trips.updateOne(
            { _id: tripdata._id },
            {
              $addToSet: {
                "safeRideData.imageArray": filesUpload,
              },
            },
            function (err, docs) {
              if (err) {
                return res
                  .status(503)
                  .json({ success: false, message: "Some Error" });
              }
              updateseconddrivertripstartstatusinFb(tripdata, tripId);
              return res
                .status(200)
                .json({ success: true, message: "Data added successfully" });
            }
          );
        }
        if (tripcurrentStatus == "End") {
          /// If Trip Ending 4 images ///

          Trips.updateOne(
            { _id: tripdata._id },
            {
              $addToSet: {
                "safeRideData.imageArray": filesUpload,
              },
            },
            function (err, docs) {
              if (err) {
                return res
                  .status(503)
                  .json({ success: false, message: "Some Error" });
              }
              updateseconddrivertripEndstatusinFb(tripdata, tripId);
              const safeRideData = tripdata.safeRideData
              changeSecondDriverTripStatusMongo(safeRideData.secondDrivers[0].driverId,"free")
              return res
                .status(200)
                .json({ success: true, message: "Data added successfully" });
            }
          );
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ success: false, message: "Some Error" });
  }
};

function updateseconddrivertripstartstatusinFb(tripdata, tripId) {
  /// If trip start in second Driver //
  console.log("firebasetripdata:", tripdata);
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data");
  var requestData = {
    safeRideData: {
      edtMake:tripdata.safeRideData.safeRidevehicle.makename,
      edtModel:tripdata.safeRideData.safeRidevehicle.model,
      edtPhoneNumber:tripdata.safeRideData.safeRidevehicle.number,
      edtcolor:tripdata.safeRideData.safeRidevehicle.vehiclecolor,
      safeRidestatus: tripdata.safeRideData.safeRidestatus,
      secondDriver: tripdata.safeRideData.secondDrivers[0].driverId,
      safeRidetripStatus: "7",
    },
  };
  console.log(".......requestdata", requestData);
  var child = tripId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
      logger.error(error);
    } else {
      console.log(child, "SafeRideData");
    }
  });
}

function updateseconddrivertripEndstatusinFb(tripdata, tripId) {
  /// If trip start in second Driver ///
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("trips_data");
  var requestData = {
    safeRideData: {
      edtMake:tripdata.safeRideData.safeRidevehicle.makename,
      edtModel:tripdata.safeRideData.safeRidevehicle.model,
      edtPhoneNumber:tripdata.safeRideData.safeRidevehicle.number,
      edtcolor:tripdata.safeRideData.safeRidevehicle.vehiclecolor,
      safeRidestatus: tripdata.safeRideData.safeRidestatus,
      secondDriver: tripdata.safeRideData.secondDrivers[0].driverId,
      safeRidetripStatus: "8",
    },
  };
  var child = tripId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData, function (error) {
    if (error) {
      logger.error(error);
    } else {
      console.log(child, "SafeRideData");
    }
  });
}

//// Checking First Driver or secondDriver ////

export const checkFirstDriver = async (tripId, driverid) => {
  let tripData = await Trips.findOne({ tripno: tripId }).lean().exec();
  let returnStatus = false; /// If return status is False The camera dialog will be shown by driver ///
  if ((tripData.dvrid = driverid)) {
    returnStatus = true; /// If return status is True The OTP will be shown by driver ///
  }
  return returnStatus;
};
