import mongoose from "mongoose";
// const cachegoose = require('cachegoose');

//import models
import Vehicle from "../models/vehicletype.model";
import Rider from "../models/rider.model";
import Trips from "../models/trips.model";
import Driver from "../models/driver.model";
import Admin from "../models/admin.model";
import ZoneCity from "../models/zones.model";
import CompanyDetails from "../models/company.model";
import Vehicletype from "../models/vehicletype.model";
import DriverPayment from "../models/driverpayment.model";
import Wallet from "../models/wallet.model";
import Schedule from "../models/schedules.model";
import DriverBank from "../models/driverBank.model";
import DriverBankTransaction from "../models/driverBankTransaction.model";
import DriverSubscription from "../models/driverSubscription.model";
import Countries from "../models/common.model";

import * as Mailer from "./email.controller";
import * as smsGateway from "./smsGateway";
import * as mailGateway from "./mailGateway";
import * as Stripe from "./stripe";
import * as TripHelpers from "./tripHelper";
import * as fareCalculation from "./fareCalculation";
import ServiceAvailableCities from "../models/serviceAvailableCities.model";
import TripLocation from "../models/tripLocations.model";

import RentalPackage from "../models/rentalPackage.model";
import OutstationPackage from "../models/outstationPackage.model";
const req_uest = require("request");

import tripPaths from "../models/tripPaths.model";
const turf = require("@turf/turf");
const _ = require("lodash");
const geolib = require("geolib");

import * as appCtrl from "../controllers/app";
import * as GFunctions from "./functions";
const nodemailer = require("nodemailer");

import { getVehicleDataForLiveMeter } from "./vehicletype";
import { insidePolygon } from "geolocation-utils";
import * as CityLimitCalculationHelper from "../helpers/cityLimitCalculation.helper";
import { checkdistanceKMFromMeter, checkDistanceKMFromPackage } from "./common";
import { driverEarningsReport, findAndSendFCMToDriver } from "./app";
import { updateRiderWalletTransaction } from "./rider";

const featuresSettings = require("../featuresSettings");
var firebase = require("firebase");
var config = require("../config");
const constantsValues = require("../constants");
const decodePolyline = require("decode-google-map-polyline");

import * as Braintree from "./paymentGateway/braintree";
import * as paystack from "./paymentGateway/paystack";

var PaystackTransfer = require("paystack-transfer")(
  config.paymentGateway.paystackSecretKey
);
var allBanks = PaystackTransfer.all_banks;

export const testDF = (req, res) => {
  var available = req.body.available;
  // available = available.substring(1, available.length - 1);
  var parsedobj = JSON.parse(available);
  var arrayRes = [];
  Object.keys(parsedobj).forEach(function (key) {
    if (parsedobj[key]) {
      arrayRes.push(key);
    }
  });
  console.log(arrayRes);
  return res.json({ success: true, res: parsedobj });
};

export const findAndSendFCMToDriverTest = async (req, res) => {
  let driverData = await Driver.findById(req.body._id, {
    _id: 1,
    fcmId: 1,
  }).exec();
  findAndSendFCMToDriver(req.body._id, "", "inactivateIdelDriver", true);
  return res.json({ success: true, res: driverData.fcmId });
};

export const puttripPaths = (req, res) => {
  /*   var result = {
      "time": Date.now(),
      "coordinates":
        [78.10145,
          9.959397]
    }; */

  // var newDoc = new tripPaths(
  //   {
  //     // geometry: result,
  //     tripno: '1',
  //     // tripid : '1',
  //   }
  // );

  /*   tripPaths.update(
      { tripno: "1" },
      { $push: { result: friend } },
    ); */

  var objFriends = { lat: 9.88, lng: 78.123, time: Date.now() };
  tripPaths.findOneAndUpdate(
    { tripno: "1" },
    { $push: { geometry: objFriends } },
    function (error, success) {
      if (error) {
        res.send(error);
      } else {
        res.send(success);
      }
    }
  );
};

export const addDefaultToDvr = async (req, res) => {
  let driver = await Driver.find(
    { $or: [{ cmpy: "" }, { cmpy: null }] },
    { _id: 1, cmpy: 1 }
  );
  try {
    console.log(driver.length);

    for (var i = 0; i < driver.length; i++) {
      addCMPY(driver[i]._id, req.body.cmpy);
    }
    //res.send(driver)
  } catch (err) {
    res.send(err);
  }
};

function addCMPY(id, value) {
  Driver.findByIdAndUpdate({ _id: id }, { cmpy: value }, function (err, data) {
    if (err) {
      console.log(id);
    } else {
      console.log("update");
    }
  });
}

export const getTrips = (req, res) => {
  Trips.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

export const getvehicle = (req, res) => {
  Vehicle.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

export const getRider = async (req, res) => {
  /*   Rider.find().exec((err, docs) => {
      if (err) {
        return res.json([]);
      }
      console.log(docs[0].email)
      res.send(docs);
    }); */

  // var riderData = await Rider.find({ lname: req.query.lname }, { hash: 0, salt: 0 });

  Rider.find({ lname: req.query.lname }, { hash: 0, salt: 0 }).exec(
    (err, docs) => {
      if (err) {
        return res.json([]);
      }
      if (docs.length) {
        // docs.push({ profileurl: config.baseurl + docs[0].profile });
        // return res.json(docs);
        // let newObj = JSON.parse(JSON.stringify(docs[0]));
        // console.log(newObj)

        var resObj = formatProfileRes(docs[0]);
        return res.json([resObj]);
      } else {
        return res.json([]);
      }
    }
  );
};

function formatProfileRes(doc) {
  var newObj = {
    phone: doc.phone,
    email: doc.email,
    lname: doc.lname,
    fname: doc.fname,
    status: doc.status,
    referal: doc.referal,
    balance: doc.balance,
    gender: doc.gender,
    address: doc.address,
    rating: doc.rating,
    EmgContact: doc.EmgContact,
    profile: doc.profile,
    phcode: doc.phcode,
  };
  return newObj;
}

function copy(mainObj) {
  let objCopy = {}; // objCopy will store a copy of the mainObj
  let key;

  for (key in mainObj) {
    objCopy[key] = mainObj[key]; // copies each property to the objCopy object
  }

  console.log(objCopy);
  return objCopy;
}

export const getDriver = (req, res) => {
  Driver.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

export const getAdmin = (req, res) => {
  Admin.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

export const getCompanyDetails = (req, res) => {
  CompanyDetails.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};
export const getVehicletype = (req, res) => {
  Vehicletype.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

export const getdriverpayment = (req, res) => {
  DriverPayment.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

export const getWallets = (req, res) => {
  Wallet.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

export const getschedule = (req, res) => {
  Schedule.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
};

// export const findNChargeExistingUserWallet = (req,res) => {
//     appCtrl.findNChargeExistingUserWallet('us',2,3);
// }

export const createSch = (req, res) => {
  var body = {};
  const newDoc = new Schedule(body);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ success: false, message: req.i18n.__("Some Error") });
    }
    return res.json({
      success: true,
      message: req.i18n.__("DATA_ADDED_SUCCESS"),
      docs,
    });
  });
};

export const driverBankDetails = (req, res) => {
  DriverBank.find().exec((err, docs) => {
    if (err) {
      return res.json(err);
    }
    res.send(docs);
  });
};

export const getDriverBankTransaction = (req, res) => {
  DriverBankTransaction.find().exec((err, docs) => {
    if (err) {
      return res.json(err);
    }
    res.send(docs);
  });
};

var file = "datasd.csv";

// var fs = require('fs')
// var csv = require('fast-csv')
// const parse = require('csv-parse')

export const parseCSV = (req, res) => {
  // let csvToJson = require('convert-csv-to-json');

  let fileInputName = "./Drivers.csv";
  // let fileOutputName = 'myOutputFile.json';

  // csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);

  const csvFilePath = fileInputName;
  const csv = require("csvtojson");
  csv()
    .fromFile(fileInputName)
    .then((jsonObj) => {
      res.send(jsonObj);

      // console.log(jsonObj);
      /**
       * [
       * 	{a:"1", b:"2", c:"3"},
       * 	{a:"4", b:"5". c:"6"}
       * ]
       */
    });
};

function addDriverData(data) {
  var id = mongoose.Types.ObjectId();
  var id2 = mongoose.Types.ObjectId();

  var newDoc = new Driver({
    _id: id,
    code: data.DriverAccount,
    nic: data.NIC,
    fname: data.NAME,
    lname: "",
    email: "",
    phcode: "+94",
    phone: data.ContactNo,
    gender: "Male",
    cnty: "",
    cntyname: "Sri Lanka",
    state: "",
    statename: "",
    city: "",
    cityname: "",
    cmpy: "",
    cur: "",
    actMail: "",
    actHolder: "",
    actNo: "",
    actBank: "",
    actLoc: "",
    actCode: "",
    softdel: "active",
    fcmId: "",

    curStatus: "free",
    curService: data.vehicletype,
    serviceStatus: "active",
    currentTaxi: id2,

    status: [
      {
        curstatus: "active",
      },
    ],
    licence: data.DrivingLiesencenumber,
    taxis: [
      {
        color: data.COLOR,
        driver: id,
        cpy: "",
        licence: data.V_NO,
        year: "2017",
        model: "INTEGRA",
        makename: "ACURA",
        _id: id2,
        taxistatus: "active",
        noofshare: 0,
        share: false,
        vehicletype: data.vehicletype,
        registrationexpdate: "",
        registration: "",
        permitexpdate: "",
        permit: "",
        insuranceexpdate: "",
        insurance: "",
        type: [
          {
            luxury: "false",
            normal: "false",
            basic: "false",
          },
        ],
        handicap: "false",
      },
    ],
  });
  newDoc.setPassword(data.Password);
  newDoc.save((err, datas) => {
    if (err) {
      console.log(err);
    }
    addDriverDatatoFb(id);
    addDrivertaxisDataFB(id, id2, data);
  });
}

function addDriverDatatoFb(id) {
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
    online_status: "0",
    proof_status: "pending",
    request: {
      drop_address: "0",
      etd: "0",
      picku_address: "0",
      request_id: "0",
      status: "0",
    },
    vehicle_id: "0",
  };

  id = id.toString();
  var usersRef = ref.child(id);

  usersRef.set(requestData, function (snapshot) {});
}

/*
Add and Update
*/
function addDrivertaxisDataFB(driverid, vehicleid, taxisdata) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("vehicle_list");

  var vehicletype = taxisdata.vehicletype;
  console.log(vehicletype);
  var key3 = vehicletype.toString();
  var value3 = 0;
  var obj = {};
  obj[key3] = value3;

  var requestData = {
    category: obj,
    make: "ACURA",
    model: "INTEGRA",
    plate_num: taxisdata.V_NO,
    status: "0",
  };

  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);

  usersRef.set(requestData, function (snapshot) {});
}

export const getDummyDvr = (req, res) => {
  var neededService = "Car";
  Driver.find({
    curService: { $regex: neededService, $options: "i" },
  }).exec((err, driverdata) => {
    if (err) {
      return res.json([]);
    }
    return res.json(driverdata);
  });
};

// //ONEBYONE TEST
// var distance = require('google-distance-matrix');
// export const getGEOMatchSort = (req, res) => {
//   Driver.find({ coords: { $ne: "" } }, { _id: 1, coords: 1 }).limit(4).exec((err, docs) => {
//     if (err) {
//       return res.json([]);
//     }
//     var convertedLatLon = convertCordsToGDMFormat(docs);
//     var origins = ['9.9254272, 78.1117957'];
//     var destinations = convertedLatLon;
//     distance.key(config.googleApi);
//     distance.units('metric');
//     distance.mode('driving');

//     distance.matrix(origins, destinations, function (err, distances) {
//       if (!err) { }
//       if (distances.status == 'OK') {
//         var resOutput = distances.rows[0].elements;
//         var distanceArray = addDocIdAndGetOnlyDistanceArry(docs, resOutput);
//         console.log(distanceArray)
//         var sortedDistanceArray = distanceArray.sort(dynamicSort("distVal")); //In Meters
//         res.send(sortedDistanceArray);
//       }
//     })
//   });
// }

// /**
//  * convertCordsToGDMFormat
//  * @param {*} docs
//  */
// function convertCordsToGDMFormat(docs) {
//   var resultDoc = docs.map(function (items) {
//     var destinations = "";
//     var tmpDoc = items.coords;
//     destinations = tmpDoc[1] + "," + tmpDoc[0];
//     return destinations;
//   });
//   return resultDoc;
// }

// /**
//  * addDocIdAndGetOnlyDistanceArry
//  * @param {*} docs
//  * @param {*} GDMop
//  */
// function addDocIdAndGetOnlyDistanceArry(docs,GDMop) {
//   var totalArray = docs.length;
//   var GMDistAry  = [];
//   for (let i = 0; i < totalArray; i++) {
//     let isDistOk = GDMop[i].status;
//     if(isDistOk == 'OK'){
//       let tempObj = {};
//       tempObj['id'] = docs[i]._id;
//       //if dis val < or > in config use only
//       tempObj['distVal'] = GDMop[i].distance.value;
//       GMDistAry.push(tempObj);
//     }
//   }
//   return GMDistAry;
// }

// /**
//  * dynamicSort
//  * @param {*} property
//  */
// function dynamicSort(property) {
//   var sortOrder = 1;
//   if (property[0] === "-") {
//     sortOrder = -1;
//     property = property.substr(1);
//   }
//   return function (a, b) {
//     var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
//     return result * sortOrder;
//   }
// }

//ONEBYONE TEST
var distance = require("google-distance-matrix");

/**
 * [Taxi Request from User] = Checked
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const requestTaxiOBO2 = async (req, res) => {
  callTheOBOLoop("5b975ad8d6ea2726354e27ee");
};

export const requestTaxiOBO = async (req, res) => {
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
    dvrid: null,
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

  req.userId = "5b57345aa55d730e908b8a6f";
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
          message: req.i18n.__("REQUEST_ALREADY_INPROCESS"),
          error: err,
        });
      newDoc.save((err, tripdata) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: err.message, err: err });
        }
        // updateRiderFbStatus(req.userId, "Processing", tripdata._id); //processing = Req intermediate state
        findNearbyDrivers(tripdata, req.body, req.userId);
        return res.status(200).json({
          success: true,
          message: req.i18n.__("TAXI_REQUEST_SEND"),
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
  Driver.find(
    // {
    //   coords: {
    //     $geoWithin: {
    //       $centerSphere: [[parseFloat(userreq.pickupLng), parseFloat(userreq.pickupLat)],
    //       requestRadius / 3963.2]
    //     },
    //   }, online: "1", curStatus: "free", curService: new RegExp(neededService, 'i')
    // }

    { coords: { $ne: "" } },
    {}
  )
    .limit(10)
    .exec((err, driverdata) => {
      // ).exec((err, driverdata) => { //50 Enough
      if (err) {
        // notifyRider(userid, "No Driver Found", tripdata._id); //Error on Server
      }
      if (driverdata.length <= 0) {
        // notifyRider(userid, "No Driver Found", tripdata._id);
        console.log("NDF");
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
  // console.log(driverdata);
  distance.matrix(origins, destinations, function (err, distances) {
    if (err) {
      console.log("GGMErr NDF", err);
    } else if (distances.status == "OK") {
      var resOutput = distances.rows[0].elements;
      var distanceArray = addDocIdAndGetOnlyDistanceArry(driverdata, resOutput); //Merging In Driver and Geo
      var sortedDistanceArray = distanceArray.sort(dynamicSort("distVal")); //In Meters
      updateTaxiWithFoundDrivers(sortedDistanceArray, tripdata._id, userid);
      // sortedDistanceArray[{ id: 5b5c7fff0c0b8f2cbe3c995e, distVal: 602 },
      //   { id: 5b5c7fff0c0b8f2cbe3c994e, distVal: 791 },
      //   { id: 5b5c7fff0c0b8f2cbe3c995a, distVal: 2181 }]

      // res.send(sortedDistanceArray);
    } else {
      console.log("GGMErr NDF in Land");
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
        console.log("updateTaxiStatus", err);
      } else {
        console.log("updateTaxiWithFoundDrivers", " ok");
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
        //Find Current Driver
        var curReqDriverIndex = docs.curReq[1];
        var maxIndex = docs.curReq[0];

        var allDriversAvail = docs.reqDvr;
        var obj = allDriversAvail.find(function (obj) {
          return obj.called === 0;
        });

        if (obj) {
          sendRequestToDriversIfFree(docs, obj.drvId);
          console.log("INOBO", obj.drvId);
        }

        // if (curReqDriverIndex<maxIndex){
        //   var
        //   var obj = string1.find(function (obj) { return obj.called === 0; });

        //   var curReqDriver = docs.reqDvr[curReqDriverIndex];
        //   var curReqDriverId = curReqDriver.drvId;
        //   // var isDriverCalled = curReqDriver.called;
        //   // if(!isDriverCalled){
        //     // Update Index in Trip
        //     updateCurIndexToTrip(trip_id, curReqDriverIndex, maxIndex);

        //     //Request to Current Driver
        //     sendRequestToDriversIfFree(trip_id, curReqDriverId);
        //   // }else{
        //   //   callTheOBOLoop(trip_id);
        //   // }

        // }else{
        //   // Update Index in Trip
        //   updateCurIndexToTrip(trip_id, maxIndex, maxIndex);
        //   //@TODO
        //   // notifyRider(userid, "No Driver Found", requestId); // Run out off Driver
        //   console.log("NDF ROD");
        // }
      }
    }
  );
}

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
        console.log("updateCurIndexToTrip", err);
      }
      console.log("updateCurIndexToTrip", " OK");
    }
  );
}

function sendRequestToDriversIfFree(docs, curReqDriverId) {
  // Driver.findOne({ _id: curReqDriverId }, {},
  //   function (err, doc) {
  //     if (err) {
  //       // Call the Next Driver
  //       // @TODO Assumed updateCurIndexToTrip done
  //       updateAsThisDriverIsErrAndCallOBO(docs, curReqDriverId)
  //       callTheOBOLoop(docs._id);
  //     } else if (!doc){
  //       //Call the Next Driver
  //       // @TODO Assumed updateCurIndexToTrip done
  //       updateAsThisDriverIsErrAndCallOBO(docs, curReqDriverId)
  //       callTheOBOLoop(docs._id);
  //     }else{
  //       updateAsThisDriveriSCalled(docs, curReqDriverId);

  //     }
  //   }

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

  // console.log('curReqDriverId', curReqDriverId)
  // Driver.findOne({ '_id': curReqDriverId, 'curStatus': 'free'  }, {},
  //   function (err, doc) {
  //     if (err) {
  //        console.log(err)
  //     } else if (!doc) {
  //       console.log(1)
  //     } else {
  //       console.log(2)
  //     }
  //   }
  // );
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
        console.log("err", err);
      }
      console.log("doc", doc);
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
      // Send FCM
      // findAndSendFCMToDriver(child, "New Request");
      updateDriverReqStatusINMongo(curReqDriverId, tripDoc._id);
    }
  });
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
      // findAndSendFCMToDriver(child, "New Request"); //Only
      clearDriverTaxiRequest(driverid, tripId);
    }
  );
}

function clearDriverTaxiRequest(driverid, tripId) {
  setTimeout(function () {
    needToResetDriver(driverid, tripId);
  }, 30000); //30000 = 30 sec
}

// const activeTimers = [];
// export const convertSTO = (req, res) => {
//   timerCheck('123467890');
//   return res.send('HI');
// }
// function timerCheck(tripId) {
//   var myVariables = {};
//   var variableName = tripId;
//   var newTimer = myVariables[variableName];
//   // myVariables[variableName] = 'mk'
//   // console.log(myVariables[variableName])
//   newTimer = setTimeout(function () {
//     console.log( Date.now() );
//   }
//     , 30000); //30000 = 30 sec
//   activeTimers.push(newTimer);
//   // clearTimeout( newTimer );
// }
// export const clearT = (req, res) => {
//   clearTimeoutChk('123467890');
//   // console.log(activeTimers)
//   return res.send('HI');
// }
// function clearTimeoutChk(tripId) {
//   var myVariables = {};
//   var variableName = tripId;
//   clearTimeout( myVariables[variableName] );
// }

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
        //console.log("hai");
        // console.log(tripvalue[i]._id);
        var driverId = tripvalue[i].dvrid;
        var tripID = tripvalue[i]._id;

        console.log(driverId);
        //m++

        removeFromDoc(tripID, driverId);
      }
      //onsole.log(m) 5b572f60a55d730e908b8a68  1663132149 5b572f60a55d730e908b8a68
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
      console.log("Success 1");
    }
  );
}

import City from "../models/commonCity.model";

export const addCityData = (req, res) => {
  var data = [
    "Angampitiya",
    "Angoda",
    "Angulana",
    "Arangala",
    "Artigala",
    "Athurugiriya",
    "Attidiya",
    "Avissawella",
    "Bambalapitiya",
    "Battaramulla",
    "Bellanwila",
    "Bokundara",
    "Bope",
    "Boralesgamuwa",
    "Brahmanagama",
    "Cinnamon Gardens",
    "Dampe",
    "Dehiwala",
    "Dematagoda",
    "Egodawatta",
    "Embulgama",
    "Etulkotte",
    "Fort",
    "Galleface",
    "Ganegoda",
    "Gangodawila",
    "Godagama",
    "Gothaduwa",
    "Grandpass",
    "Habarakada",
    "Halpita",
    "Hanwella",
    "Havelock Town",
    "Hewainna",
    "Hokandara",
    "Homagama",
    "Horathuduwa",
    "Kadugoda",
    "Kalalgoda",
    "Kelanimulla",
    "Kesbewa",
    "Kirulapone",
    "Kohilawatta",
    "Kohuwala",
    "Kollupitiya",
    "Kolonnawa",
    "Kosgama",
    "Kotahena",
    "Kotikawatta",
    "Kottawa",
    "Kotte",
    "Kurugala",
    "Labugama",
    "Lenagala",
    "Lunawa",
    "Madinnagoda",
    "Madiwela",
    "Madola",
    "Maharagama",
    "Makuluduwa",
    "Malabe",
    "Malapalla",
    "Mampe",
    "Maradana",
    "Mattakkuliya",
    "Mattegoda",
    "Meegoda",
    "Mirihana",
    "Modara",
    "Narahenpita",
    "Nawala",
    "Nawinna",
    "Nedimala",
    "Nugegoda",
    "Orugodawatta",
    "Padukka",
    "Pamankada",
    "Pamunuwa",
    "Pannipitiya",
    "Peliyagoda",
    "Pepiliyana",
    "Petta",
    "Piliyandala",
    "Pinnawala",
    "Pitakotte",
    "Polgasowita",
    "Polhena",
    "Puwakpitiya",
    "Rajagiriya",
    "Ratmalana",
    "Rukmalgama",
    "Seethawaka",
    "Siddamulla",
    "Slave Island",
    "Suwarapola",
    "Thalahena",
    "Thalangama",
    "Thalapathpitiya",
    "Thalawathugoda",
    "Thimbirigasyaya",
    "TownHall",
    "Udahamulla",
    "Uggala",
    "Waga",
    "Welikada",
    "Weliwita",
    "Wellampitiya",
    "Wellawatte",
    "Werahera",
    "Wewila",
    "Yatawatura",
    "Embuldeniya",
    "Kalubowila",
    "Moratuwa",
    "Kaduwela",
    "Himbutana",
    "Mount Lavinia",
    "Kawdana",
    "Borella",
    "Pelawatta",
    "IDH",
    "Panagoda",
    "Madapatha",
    "Jayawardanapura",
    "Paranagama",
    "Biyagama",
    "Thalduwa",
  ];

  var arr = [];
  for (var i = 0; i < data.length; i++) {
    arr.push({ id: i + 1, name: data[i] });
  }

  var newDoc = new City({
    _id: 33,
    cities: arr,
  });
  newDoc.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send("ok");
    }
  });
};

export const testMail = (req, res) => {
  var tripno = req.body.tripno,
    mailTo = req.body.mailTo;
  Trips.findOne({ tripno: tripno }, function (err, doc) {
    if (err) {
      console.log("err1", err);
    }
    if (!doc) {
      console.log("NO Trip Found, Sending Sample");
      var doc = {
        tripno: 2276,
        acsp: { cost: 100 },
        date: "9-19-2018 5:42 pm",
        via: "Cash",
      };

      Mailer.sendEmail("TripInvoice", mailTo, doc, res);
    } else {
      Mailer.sendEmail("TripInvoice", mailTo, doc, res);
    }
  });
};

/**
 * Share Location
 */
export const shareMyLocation = async (req, res) => {
  var TripId = req.params.id;

  Trips.aggregate(
    [
      {
        $match: {
          status: {
            $nin: ["Cancelled", "Cancelled", "noresponse"],
          },
          _id: mongoose.Types.ObjectId(TripId),
        },
      },

      {
        $lookup: {
          localField: "ridid",
          from: "riders",
          foreignField: "_id",
          as: "riderCollections",
        },
      },
      { $unwind: "$riderCollections" },
      {
        $lookup: {
          localField: "dvrid",
          from: "drivers",
          foreignField: "_id",
          as: "driverCollections",
        },
      },
      { $unwind: "$driverCollections" },
      {
        $project: {
          _id: 1,
          ridid: 1,
          tripno: 1,
          adsp: 1,
          dsp: 1,
          status: 1,
          "driverCollections.profile": 1,
          "driverCollections._id": 1,
          "driverCollections.fname": 1,
          "driverCollections.email": 1,
          "driverCollections.phone": 1,
          "driverCollections.baseurl": 1,
          "driverCollections.curService": 1,
          "driverCollections.currentTaxi": 1,
          "riderCollections._id": 1,
          "riderCollections.profile": 1,
          "riderCollections.fname": 1,
          "riderCollections.email": 1,
          "riderCollections.phone": 1,
        },
      },
    ],
    function (err, result) {
      if (err) {
        return res.status(200).json({ success: false, err: err });
      }
      if (result.length == 0)
        return res.status(200).json({
          success: false,
          result: result,
          message: req.i18n.__("NO_TRIP_FOUND"),
        });
      else {
        var sendToData = {
          tripid: result[0]._id,
          tripDetails: {
            tripno: result[0].tripno,
            pickupAt: result[0].dsp.start,
            dropAt: result[0].dsp.end,
            startAt: result[0].adsp.start,
            endAt: result[0].adsp.end,
            status: result[0].status,
            savedmap: result[0].adsp.map, //https://dtaxicabs.in:3001/public/gmap/386.png
          },
          driver: {
            _id: result[0].driverCollections._id,
            name: result[0].driverCollections.fname,
            email: result[0].driverCollections.email,
            profile: config.baseurl + result[0].driverCollections.profile,
            phone: result[0].driverCollections.phone,
            curService: result[0].driverCollections.curService,
            currentTaxiId: result[0].driverCollections.currentTaxi,
          },
          rider: {
            _id: result[0].riderCollections._id,
            name: result[0].riderCollections.fname,
            email: result[0].riderCollections.email,
            profile: config.baseurl + result[0].riderCollections.profile,
            phone: result[0].riderCollections.phone,
          },
          supportEmail: config.companymail,
          supportNo: config.supportNo,
        };
        return res.status(200).json({ success: true, result: sendToData });
      }
    }
  );
};

export const validate = (req, res) => {
  req.checkBody("test1", "Enter a valid String.");
  req.checkBody("url", "Enter a valid URL address.").isURL();
  req.checkBody("mail", "Enter a valid email address.").isEmail();
  req.checkBody("num", "Enter a valid number.").isNumeric();
  req.checkBody("optional", "Optional");
  req.checkBody("must", "Must").notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({ success: false, err: errors });
  } else {
    return res.status(200).json({ success: true });
  }
};

export const sendMail = (req, res) => {
  let transporter = nodemailer.createTransport(config.smtpConfig);
  let mailOptions = {
    from: config.mailFrom, // sender address
    to: "absnodes@gmail.com", // list of receivers
    subject: "Test Subject", // Subject line
    html: "Test Body", // html body
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
};
export const sendSms = async (req, res) => {
  smsGateway.sendSmsMsg('3322015644', req.body.smsbody);
  return res.status(200).json({ success: true });
};

export const sendMailtest = async (req, res) => {
  req.body.data = JSON.parse(req.body.data);
  mailGateway.sendEmail(req.body.email, req.body.data, req.body.description);
  return res.status(200).json({ success: true });
};

export const testLoadsh = async (req, res) => {
  var all = {
    success: true,
    message: req.i18n.__("RESTAURANT_DETAIL"),
    resultData: {
      basic: {
        id: "5bb352fb402fc0211cb404ab",
        name: "kfc",
        address: "test address",
        rating: null,
        logo: "public/file-1545889535599.jpg",
        minTime: 10,
        minAmt: 10,
        menu: [
          { name: "Chicken", count: 3 },
          { name: "Krusher", count: 0 },
        ],
      },
      foodItem: [
        {
          catName: "Chicken",
          _id: "5bbc4f8a8bc4ea3ab5a27541",
          items: [
            {
              itemTag: "newlyadded",
              recommended: true,
              stock: true,
              itemType: "nonveg",
              itemOffer: 10,
              itemprice: 150,
              itemDesc: "undefined",
              itemName: "Stripes",
              _id: "5c24c667cb0ade6175c19e04",
              count: 0,
              toppings: [
                {
                  name: "_abs_ngprof_post_to_timeline",
                  price: 500,
                  _id: "5c4026288a4195484525e1bf",
                },
                {
                  name: "_quick_overview",
                  price: 500,
                  _id: "5c4026288a4195484525e1be",
                },
              ],
              options: [
                {
                  type: "Luxurious",
                  price: 500,
                  _id: "5c4026288a4195484525e1bd",
                },
                { type: "Truck", price: 1000, _id: "5c4026288a4195484525e1bc" },
              ],
              itemImage: "public/file-1545913959243.png",
            },
            {
              itemTag: "bestseller",
              recommended: true,
              stock: true,
              itemType: "veg",
              itemOffer: 2,
              itemprice: 23,
              itemDesc: "undefined",
              itemName: "virginmary",
              _id: "5c25b5ce9bf0871b7b754e4a",
              count: 0,
              toppings: [],
              options: [
                { price: 25, type: "reg", _id: "5c25b5ce9bf0871b7b754e4b" },
              ],
              itemImage: "public/file-1545975246010.jpeg",
            },
            {
              itemTag: "promoted",
              recommended: true,
              stock: true,
              itemType: "veg",
              itemOffer: 2,
              itemprice: 12,
              itemDesc: "undefined",
              itemName: "virginsury",
              _id: "5c25e189dcb7cd3890ebcced",
              count: 0,
              toppings: [
                { price: 3, name: "34", _id: "5c25e189dcb7cd3890ebccf0" },
              ],
              options: [
                { price: 0, type: "reg", _id: "5c25e189dcb7cd3890ebccef" },
                { price: 323, type: "absD", _id: "5c25e189dcb7cd3890ebccee" },
              ],
              itemImage: "public/menu-default.jpg",
            },
          ],
        },
        { catName: "Krusher", _id: "5bbc5904e1ef8e3c8faf69a3", items: [] },
      ],
      recommendedItem: [
        {
          itemTag: "newlyadded",
          recommended: true,
          stock: true,
          itemType: "nonveg",
          itemOffer: 10,
          itemprice: 150,
          itemDesc: "undefined",
          itemName: "Stripes",
          _id: "5c24c667cb0ade6175c19e04",
          count: 0,
          toppings: [
            {
              name: "_abs_ngprof_post_to_timeline",
              price: 500,
              _id: "5c4026288a4195484525e1bf",
            },
            {
              name: "_quick_overview",
              price: 500,
              _id: "5c4026288a4195484525e1be",
            },
          ],
          options: [
            { type: "Luxurious", price: 500, _id: "5c4026288a4195484525e1bd" },
            { type: "Truck", price: 1000, _id: "5c4026288a4195484525e1bc" },
          ],
          itemImage: "public/file-1545913959243.png",
        },
        {
          itemTag: "bestseller",
          recommended: true,
          stock: true,
          itemType: "veg",
          itemOffer: 2,
          itemprice: 23,
          itemDesc: "undefined",
          itemName: "virginmary",
          _id: "5c25b5ce9bf0871b7b754e4a",
          count: 0,
          toppings: [],
          options: [
            { price: 25, type: "reg", _id: "5c25b5ce9bf0871b7b754e4b" },
          ],
          itemImage: "public/file-1545975246010.jpeg",
        },
        {
          itemTag: "promoted",
          recommended: true,
          stock: true,
          itemType: "veg",
          itemOffer: 2,
          itemprice: 12,
          itemDesc: "undefined",
          itemName: "virginsury",
          _id: "5c25e189dcb7cd3890ebcced",
          count: 0,
          toppings: [{ price: 3, name: "34", _id: "5c25e189dcb7cd3890ebccf0" }],
          options: [
            { price: 0, type: "reg", _id: "5c25e189dcb7cd3890ebccef" },
            { price: 323, type: "absD", _id: "5c25e189dcb7cd3890ebccee" },
          ],
          itemImage: "public/menu-default.jpg",
        },
      ],
      availabile: true,
    },
  };

  var foodItem = all.resultData["foodItem"];
  var foodItem1 = foodItem[0].items;

  var cartItem = [
    {
      itemOption: { optionName: "", optionPrice: 0 },
      customize: [],
      _id: "5c49891f51a8cb1f08fcd814",
      itemId: "5c24c667cb0ade6175c19e04",
      itemQty: 2,
      itemName: "Stripes",
      itemPrice: 300,
    },
    {
      itemOption: { optionName: "", optionPrice: 0 },
      customize: [],
      _id: "5c49891f51a8cb1f08fcd814",
      itemId: "5c25b5ce9bf0871b7b754e4a",
      itemQty: 3,
      itemName: "Stripes",
      itemPrice: 300,
    },
  ];

  _.forEach(cartItem, function (value, key) {
    var index = findNReplace(foodItem1, { _id: value.itemId });
    if (index >= 0) {
      foodItem1[index].count = value.itemQty;
    }
  });

  return res.status(200).json(foodItem1);
};

function findNReplace(foodItem1, entry1) {
  var index = _.findIndex(foodItem1, entry1);
  return index;
}

export const createStripeCustomer = async (req, res) => {
  Stripe.createCustomer(req, res);
};

export const createStripeConnectTest = async (req, res) => {
  Stripe.createStripeConnectTest(req.body.email, "US")
    .then((resObj) => res.send(resObj))
    .catch((err) => res.send(err));
};

export const StripelistCustomersTest = async (req, res) => {
  Stripe.listCustomers(req, res);
};

export const testFirebase = async (req, res) => {
  /*     if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
      }
      var db = firebase.database();
      var ref = db.ref("drivers_data");
      var requestData = {
        test: {
          test: "0",
          test: "0"
        },
        test: "0"
      };

    var usersRef = ref.child('test');

      usersRef.update(requestData, function (snapshot) {
        return res.json({'success':true,'message':'Test Successfully', 'snap' :  snapshot});
      });
      */

  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }

  var db = firebase.database();
  var ref = db.ref("new_col");

  var requestData = {
    name: "new1",
    age: "1",
    newob: {
      asd: 1,
    },
  };

  // var id = datas._id.toString();
  var usersRef = ref.child("1");

  usersRef.set(requestData, function (snapshot) {
    console.log("addRiderDatatoFb", snapshot);
  });
};

export const parseGSTInvoce = async (req, res) => {
  TripHelpers.sendTripGSTReceipt(req.body.tripId, req.body.email);
};

export const transferAmountUsingNonceNRecharge = async (req, res) => {
  try {
    var nonceFromTheClient = req.body.payment_method_nonce;
    var rechargeAmount = req.body.rechargeAmount;
    var resObj = await Braintree.transferAmountUsingNonceNRecharge(
      nonceFromTheClient,
      rechargeAmount
    );
    return res.status(200).json(resObj);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      success: false,
      message: req.i18n.__("ERROR_ADDING_AMT"),
      err: error,
    });
  }
};

export const streamtrips = (req, res) => {
  res.header("Content-Type", "text/event-stream");
  var interval_id = setInterval(function () {
    res.write("some data");
  }, 1000);
  setTimeout(function () {
    clearInterval(interval_id);
    res.end();
  }, 10000);
};

const moment = require("moment");

export const tripDTValue = (req, res) => {
  try {
    req.body.tripShownDate = GFunctions.sendTimeNow();
    req.body.tripDate = moment()
      .utcOffset(config.utcOffset)
      .format("DD-MM-YYYY");
    req.body.tripTime = moment().utcOffset(config.utcOffset).format("HH:mm a");

    var reqtripDT = req.body.tripDate + " " + req.body.tripTime;
    var newDateFormat = GFunctions.sendFormatedTime(
      req.body.tripDate,
      req.body.tripTime
    );
    var reqtripFDT = GFunctions.getDateTimeForSortings(newDateFormat);
    var newDateFormat = GFunctions.sendFormatedDTime(reqtripDT);

    // console.log('newDateFormat', reqtripDT)

    var gmtFTime = new Date(reqtripFDT).toGMTString();
    // console.log('gmtFTime', config.gmtZone)

    req.body.tripDT = reqtripDT;
    req.body.utc = req.body.utc ? req.body.utc : config.gmtZone;
    req.body.tripFDT = reqtripFDT;
    req.body.gmtTime = gmtFTime;
    req.body.tripShownDate = reqtripDT;

    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
};

export const sendAdminPushMsg = async (req, res) => {
  GFunctions.sendAdminPushMsg(
    "cwoLaxS4m9s:APA91bEd_qhHsrkqMbqu96MNC1psq-R6zLiWEBB7kQMKimsRsga2xHA7RI4YVO-YkGSRsk-u622L7YgsTfq_QSkhrsKxJxg5uADfCk6GAelvfc52GQgggLVk4b0-0dziByJvkETvStgx"
  );
  return res.status(200).json({ success: true });
};

export const makeStripeSplitTransTest = async (req, res) => {
  var data = {
    driveramount: 0.8,
    totalamount: 1,
    custid: "cus_EptRuQmft2Ht4z",
    driverConnectAcctId: "acct_1EH8oEG7KSsn4uAl",
    stripeDesc: "Trip - Credit",
  };
  Stripe.makeStripeSplitPayment(data)
    .then((resObj) => res.send(resObj))
    .catch((err) => res.send(err));
};

// Simmakkal, Madurai Main, Madurai, Tamil Nadu => Thirumangalam, Tamil Nadu
// 9.925910, 78.121529 => 9.824060, 77.990080

export const bboxCheck = (req, res) => {
  var line = turf.lineString([
    [9.92591, 78.121529],
    [9.82406, 77.99008],
  ]);
  var bbox = turf.bbox(line);
  var bboxPolygon = turf.bboxPolygon(bbox);
  return res.json(bboxPolygon);
  // console.log(bboxPolygon)
};

export const getDiscount = (req, res) => {
  return res.json({ discount: 10 });
};

export const useragent = (req, res) => {
  return res.json(req.headers);
};

let request = require("async-request");

export const getGDM = async (req, res) => {
  const from = 9.9239637 + "," + 78.1222102;
  const to = 9.9443944 + "," + 78.1558679;

  var urlToCall =
    "https://maps.googleapis.com/maps/api/directions/json?origin=1017WT%20Oosteinde%2011%20Amsterdam&destination=Heineken%20Experience%20Amsterdam&key=AIzaSyAcojgYg79ssEaV_c1-7pRQpIKESob5Iz4";

  var response = await request(urlToCall);

  // var gdmResult = await GFunctions.getDistanceAndTimeFromGDMForEncode([from], [to]);
  // https://maps.googleapis.com/maps/api/directions/json?origin=1017WT%20Oosteinde%2011%20Amsterdam&destination=Heineken%20Experience%20Amsterdam&key=AIzaSyAcojgYg79ssEaV_c1-7pRQpIKESob5Iz4
  var resp = response.body.status;

  return res.send(resp);
};

export const getVehicleChargeApprox = async (req, res) => {
  var vehicleData = {
    perKMRate: 1.4,
    timeInMinutes: 1.2,
    BaseFare: 20,
    tax: 5,
    minFare: 1,
  };
  var getVehicleChargeApproxio = await fareCalculation.getVehicleChargeApprox(
    10,
    5,
    vehicleData
  );
  console.log(getVehicleChargeApproxio);
  return res.json(getVehicleChargeApproxio);
};

export const checkReload = async (req, res) => {
  setTimeout(function () {
    return res.json({ success: true });
  }, 10000); //30000 = 30 sec
};

export const getVehicleDataForLiveMetertest = async (req, res) => {
  var getVehicleDataForLiveMetersadasd = await getVehicleDataForLiveMeter(
    req.body.type
  );
  res.json(getVehicleDataForLiveMetersadasd);
};

export const viewDriverWithFeatureBased = (req, res) => {
  var driverFind = {};
  driverFind["taxis.vehicletype"] = "Go Moto";
  driverFind["taxis.feature"] = { $all: ["WIFI", "AC"] };
  Driver.find(driverFind, function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

export const pointsInsideOnBoundary = async (req, res) => {
  var body = req.body;

  let availableService = await ServiceAvailableCities.find(
    { softDelete: false, city: { $ne: "Default" } },
    { cityBoundaryPolygon: 1 }
  ).lean(); //.distinct('cityBoundaryPolygon')
  //let point = insidePolygon([parseFloat(body.pickupLng), parseFloat(body.pickupLat)], cityBoundaryPolygon)
  let point = false;
  _.forEach(availableService, (value) => {
    //console.log(value)
    point = insidePolygon(
      [parseFloat(body.pickupLng), parseFloat(body.pickupLat)],
      value.cityBoundaryPolygon
    );
    console.log(point);
    if (point) {
      return;
    }
  });
  return res.send(point);
};

export const getCityAddress = async (req, res) => {
  var body = req.query;
  var cityData = await CityLimitCalculationHelper.findCityAndAddress(
    body.pickupLat,
    body.pickupLng
  );
  res.send(cityData);
};

//Default
export const createSubAccountFromBankForDriver = async (req, res) => {
  var originalData = {
    business_name: req.body.business_name,
    settlement_bank: req.body.settlement_bank,
    account_number: req.body.account_number,
    percentage_charge: req.body.percentage_charge,
    primary_contact_email: req.body.primary_contact_email,
    primary_contact_name: req.body.primary_contact_name,
  };

  // var originalData = {
  //   business_name: 'Sunshine Studios',
  //   settlement_bank: 'ASO Savings and Loans',
  //   account_number: '0193274682',
  //   percentage_charge: '18.2',
  //   primary_contact_email: 'mktest@gmail.com',
  //   primary_contact_name: 'mk',
  // };

  var getVehicleDataForLiveMetersadasd =
    await paystack.createSubAccountFromBankForDriver(originalData);
  res.json(getVehicleDataForLiveMetersadasd);
};

export const transferAmountNRechargeVendor = async (req, res) => {
  var originalData = {
    subaccount: req.body.accountId,
    email: req.body.cusEmail,
    amount: req.body.amount,
  };

  // var subaccountId = req.body.accountId;
  // var customerEmail = req.body.cusEmail;
  // var newamt = req.body.amount;

  var getSubaccountTransferData = await paystack.transferAmountNRechargeVendor(
    originalData
  );
  res.json(getSubaccountTransferData);
};

export const listBank = (req, res) => {
  res.json(allBanks);
};

export const createTransferRecipient = async (req, res) => {
  var originalData = {
    type: "nuban",
    name: "Zombie",
    description: "Zombier",
    account_number: "0221859505",
    bank_code: "058",
    currency: "NGN",
    metadata: {},
  };

  var recipientBank = _.filter(allBanks, { slug: req.body.recipientBank }); // should be a bank object key value, so that can retrive bank code

  var recipientName = req.body.recipientName;
  var recipientDesc = req.body.recipientDesc;
  var recipientAccountNo = req.body.recipientAccountNo;
  var metaData = req.body.metaData; // default empty object {}

  //"Oluwaleke", "Me", "0221859505", allBanks.guaranty_trust_bank, {}

  //from npm call
  var getTransferRecipientData = await PaystackTransfer.createRecipient(
    recipientName,
    recipientDesc,
    recipientAccountNo,
    recipientBank[0],
    metaData
  );

  // var getTransferRecipientData = await PaystackTransfer.createRecipient("Oluwaleke", "Me", "0221859505", allBanks.guaranty_trust_bank, {});

  res.json(getTransferRecipientData);

  //from 3rd party call
  // var getTransferRecipientData = await paystack.createTransferRecipient(originalData);
  // res.json(getTransferRecipientData);
};

export const listTransferRecipient = async (req, res) => {
  var getTransferRecipients = await PaystackTransfer.listRecipients();
  res.json(getTransferRecipients);
};

export const payTransferRecipient = async (req, res) => {
  //source, reason, amount, recipient
  var payResponse = await PaystackTransfer.initiateSingle(
    "balance",
    "test transfer",
    "100",
    "RCP_3h41iqkkkbvie3k"
  );
  res.json(payResponse);
};

const invNum = require("invoice-number");

export const invoice = async (req, res) => {
  var test = invNum.next("DRV001");
  console.log(test);
};

//Rental

/**
 * params : pickupLng, pickupLat
 */
export const rentalTest = async (req, res) => {
  let availableService = await ServiceAvailableCities.find(
    { softDelete: false, city: { $ne: "Default" } },
    { cityBoundaryPolygon: 1 }
  ).lean();
  let pickUpPoint = false;
  let servericeCityId = "";
  for (var value of availableService) {
    pickUpPoint = insidePolygon(
      [parseFloat(body.pickupLng), parseFloat(body.pickupLat)],
      value.cityBoundaryPolygon
    );
    if (pickUpPoint) {
      //pickUpPoint = true;
      servericeCityId = value._id;
      break;
    }
  }
  if (pickUpPoint == false) {
    return res
      .status(400)
      .json({ message: req.i18n.__("serverice city not available") });
  }
  let rentalPackage = await RentalPackage.find({
    "scIds.scId": servericeCityId.toString(),
  });
  return res.status(200).json({ success: rentalPackage });
};

import {
  getRentalFareEstimationAtTripEnd,
  checkDropLocation,
  rentalPackageInvoiceDetails,
} from "../modules/rental/rental.controller";
import { addYearsForAdminUiCRUD } from "./common";
import { isRegExp } from "util";

export const getRentalFinalAmt = async (req, res) => {
  var data = await getRentalFareEstimationAtTripEnd(
    req.body.vehicleTypeId,
    req.body.packageId,
    req.body.distanceKM,
    req.body.timeInMin
  );
  return res.status(200).json({ success: data });
};

export const checkDropPoint = async (req, res) => {
  var paramsData = {
    dropLat: req.body.dropLat,
    dropLng: req.body.dropLng,
    distanceInKM: req.body.distanceInKM,
  };
  var data = await checkDropLocation(paramsData);
  return res.status(200).json({ success: data });
};

export const getHrBtDate = async (req, res) => {
  req.body.startDay = GFunctions.getDateTimeinThisFormat(
    req.body.startDay,
    "D MMM YYYY, HH:mm a"
  );
  req.body.returnDay = GFunctions.getDateTimeinThisFormat(
    req.body.returnDay,
    "D MMM YYYY, HH:mm a"
  );
  var hr = GFunctions.getHoursBtDateTime(req.body.returnDay, req.body.startDay);
  return res.status(200).json({ success: hr });
};

export const getinvoicearray = async (req, res) => {
  var tripdata = await Trips.findById(req.body.id).exec();
  var rentalPackageInvoiceDetailsData = await rentalPackageInvoiceDetails(
    tripdata
  );

  return res.status(200).json({ success: rentalPackageInvoiceDetailsData });
};
//Rental

export const getNextGivenDaysFromHours = async (req, res) => {
  var data = await GFunctions.getNextGivenDaysFromHours(
    req.body.hours,
    req.body.startDay
  );
  return res.status(200).json({ success: data });
};

/*cachegoose(mongoose, {
  // engine: 'redis',    /* If you don't specify the redis engine,
  port: 6379,         /* the query results will be cached in memory.
  host: 'localhost'
});*/

export const getcache = async (req, res) => {
  Admin.find()
    .cache(0, "ADMIN-CACHE-KEY")
    .exec(function (err, records) {
      if (err) return res.status(500).json({ err: err });
      return res.status(200).json({ success: records });
    });
};

export const clearcache = async (req, res) => {
  //cachegoose.clearCache('ADMIN-CACHE-KEY');
  return res.status(200).json({ success: "done" });
};

export const generateTripCode = async (req, res) => {
  var scId = req.body.scId;
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
      tripCode = "TRP-001";
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
    // let TotCnt = await Trips.findOne({ 'scId': scId, 'status': { $in: ['accepted', 'Progress', 'Finished'] }, "dvrid": { $ne: null } }, { 'tripCode': 1 }, { sort: { 'createdAt': -1 } }).exec();
    // console.log(TotCnt)
    if (TotCnt != null && TotCnt.tripCode) {
      var splitDate = _.split(TotCnt.tripCode, "-");
      var lastTripDate = moment(splitDate[0], "YYMMDD")
        .utcOffset(config.utcOffset)
        .format("YYMMDD");
      if (lastTripDate == currentDateFormat) {
        tripCode = invNum.next(splitDate[2]);
        tripCode = splitDate[0] + "-" + splitDate[1] + "-" + tripCode;
      } else {
        tripCode =
          currentDateFormat + "-" + serviceBasedCode.tripPrefixCode + "001";
      }
    } else {
      tripCode =
        currentDateFormat + "-" + serviceBasedCode.tripPrefixCode + "001";
    }
  }
  return res.json(tripCode);
};

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

export const testAddTripLocations = async (req, res) => {
  var location =
    Number(req.body.currentLat).toFixed(4) +
    "," +
    Number(req.body.currentLng).toFixed(4);
  var trip = await TripLocation.findOne({ tripId: req.body.tripId });
  if (!trip) {
    var newDoc = new TripLocation({
      tripId: req.body.tripId,
      lastUpdated: moment()
        .utcOffset(config.utcOffset)
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      loc: [location],
    });
    newDoc.save((err, doc) => {
      if (err) {
        console.log(err);
      } else {
        return res.json({ success: true, message: "Added Successfully" });
      }
    });
  } else {
    var timeBtNowAndReq = GFunctions.getMinsBtDateTime(
      GFunctions.getISODate(),
      trip.lastUpdated
    );
    console.log(timeBtNowAndReq);
    // if (timeBtNowAndReq >= featuresSettings.locationUpdateAfter.daily) {
    // for (var i = 0; i < 1339; i++) {
    var update = await TripLocation.findOneAndUpdate(
      { tripId: req.body.tripId },
      {
        $push: { loc: location },
        $set: { lastUpdated: GFunctions.getISODate() },
      }
    );
    // }
    // }
    return res.json({ success: true, message: "Added Successfully" });
  }
};

export const testMapRoute = async (req, res) => {
  var tripData = {
    tripno: "1000",
    adsp: {
      pLat: "9.923991",
      pLng: "78.122221",
      dLat: "12.940160",
      dLng: "80.132757",
    },
  };
  var tripPath = await TripLocation.findOne({ tripId: req.body.tripId });
  // tripPath.loc = []
  GFunctions.saveStaticMapForTrip(tripData, tripPath.loc);
};

export const testSuggestionForDropLocation = async (req, res) => {
  var pickupLng = req.body.pickupLng;
  var pickupLat = req.body.pickupLat;
  var requestRadius = 1;
  var LocFind = {
    ridid: req.body.userId,
    "dsp.startcoords": {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(pickupLng), parseFloat(pickupLat)],
          requestRadius / 3963.2,
        ],
      },
    },
    "dsp.endcoords": { $ne: null },
  };
  var findTrips = await Trips.find(LocFind, {
    tripno: 1,
    scId: 1,
    scity: 1,
    dsp: 1,
    adsp: 1,
  })
    .sort({ createdAt: -1 })
    .limit(10);
  var to = "",
    LatLng = [];
  var data = _.map(findTrips, (el) => {
    var doc = {
      to: el.dsp.end,
      LatLng: el.dsp.endcoords,
    };
    return doc;
  });
  var uniqueLoc = _.uniqBy(data, "to");
  console.log(data);
  res.json({
    success: true,
    message: "Suggested Place",
    suggestions: uniqueLoc,
  });
};

export const cancelExpiredRideLaterTrips = async (req, res) => {
  Trips.find(
    {
      bookingType: "rideLater",
      tripFDT: { $lt: GFunctions.getISODate() },
      status: "processing",
    },
    { tripno: 1, date: 1, tripFDT: 1, bookingType: 1, status: 1 }
  )
    .sort({ tripFDT: 1 })
    .exec((err, docs) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        console.log(docs);
        res.json(docs);
      }
    });
};

//Find Drivers
export const testGetNearByDrivers = (req, res) => {
  var requestRadius = config.requestRadius;
  var neededService = req.body.serviceName;
  if (!req.body.pickupLng || !req.body.pickupLat) {
    return res.status(409).json({
      success: false,
      message: req.i18n.__("PLEASE_SELECT_PICKUP_LOCATION"),
    });
  }

  // var driverFind = {
  //   coords: {
  //     $geoWithin: {
  //       $centerSphere: [[parseFloat(req.body.pickupLng), parseFloat(req.body.pickupLat)],
  //       requestRadius / 3963.2]
  //     },
  //   }, online: 1, curStatus: "free", curService: new RegExp(neededService, 'i'),
  //   // taxis: { $elemMatch: { vehicletype: neededService, handicap : true } }
  // };

  var maxDistanceInMeter = 50000;
  var driverFind1 = {
    driverLocation: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            parseFloat(req.body.pickupLng),
            parseFloat(req.body.pickupLat),
          ],
        },
        $maxDistance: Number(maxDistanceInMeter),
      },
    },
    /*online: 0, curStatus: "free", curService: new RegExp(neededService, 'i'),*/
  };

  Driver.find(driverFind1).exec((err, driverdata) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: req.i18n.__("SOME_ERROR"),
        error: err,
      });
    if (driverdata.length <= 0) {
      return res
        .status(409)
        .json({ success: false, message: req.i18n.__("DRIVER_NOT_FOUND") });
    } else {
      return res.status(200).json({
        success: true,
        message: req.i18n.__("DRIVER_FOUND"),
        drivers: driverdata,
      });
    }
  });
};

export const updateDriverCode = async (req, res) => {
  var scId = req.body.scId;
  var prefixCode = req.body.prefixCode;
  var data = await Driver.find({ scId: scId }, { code: 1 });
  var code = prefixCode + "-000";
  var result = _.map(data, async (el) => {
    code = invNum.next(code);
    var updateCode = await Driver.findOneAndUpdate(
      { _id: el._id },
      { code: code }
    );
  });
  return res.json({ success: true, message: "Updated Successfully" });
};

export const getDistance = async (req, res) => {
  // from, to, distanceInUnit
  var from = req.body.plat + "," + req.body.plng;
  var to = req.body.dlat + "," + req.body.dlng;
  var distanceInUnit = req.body.distanceInUnit;
  var gdmResult = await GFunctions.getDistanceAndTimeFromGDM([from], [to]);
  if (config.distanceUnit == "Miles") {
    var distance = parseFloat(gdmResult.distanceValue * 0.000621371).toFixed(2);
    console.log("Googledistance1", distance);
  } else {
    var distance = parseFloat(gdmResult.distanceValue / 1000).toFixed(2);
    console.log("Googledistance", distance);
  }
  console.log("bodyDistance", distanceInUnit);

  if (distanceInUnit > distance) {
    var extraDistance = (
      (featuresSettings.extraKmPercentage / 100) *
      distance
    ).toFixed(2);
    console.log("extraDistance", extraDistance);
    var extraDistanceLimit = Number(distance) + Number(extraDistance);
    console.log("extraDistanceLimit", extraDistanceLimit);
    console.log("distanceInUnit", distanceInUnit);
    if (distanceInUnit > extraDistanceLimit) {
      distanceInUnit = extraDistanceLimit;
      // return distanceInUnit
      return res.json(distanceInUnit);
    } else {
      distanceInUnit = distanceInUnit;
      return res.json(distanceInUnit);
      // return distanceInUnit
    }
  } else if (distanceInUnit < distance) {
    var MinDistance = (
      (featuresSettings.minKmPercentage / 100) *
      distance
    ).toFixed(2);
    console.log("MinDistance", MinDistance);
    var MinDistanceLimit = Number(distance) - Number(MinDistance);
    console.log("MinDistanceLimit", MinDistanceLimit);
    console.log("distanceInUnit", distanceInUnit);
    if (distanceInUnit < MinDistanceLimit) {
      distanceInUnit = distance;
      // return distanceInUnit
      return res.json(distanceInUnit.toFixed(2));
    } else {
      distanceInUnit = distanceInUnit;
      return res.json(distanceInUnit);
      // return distanceInUnit
    }
  } else {
    distanceInUnit = distanceInUnit;
    return res.json(distanceInUnit);
  }
};

export const sendFCMMsgTest = async (req, res) => {
  GFunctions.sendFCMMsgTest();
  return res.json("done");
};

export const calculateDistance = async (req, res) => {
  // var distance = await checkdistanceKMFromMeter(req.body.distanceFromApp, req.body.tripId);
  var distance = await checkDistanceKMFromPackage(
    req.body.distanceFromApp,
    req.body.packageId
  );
  return res.json(distance);
};

export const getDistanceBttwoCords = async (slat, slon, elat, elon) => {
  // console.log(slat, slon, elat, elon);
  var distance = geolib.getDistance(
    { latitude: slat, longitude: slon }, //start
    { latitude: elat, longitude: elon } //end
  );
  return distance;
};

export const changeVechicleName = async (req, res) => {
  // taxis.vehicletype == Exclusive => Executive
  //taxis.lowCategoryOptions == Exclusive => Executive
  //currentCategoryOptions == Exclusive ==> Executive
  //curService == Exclusive == Exceutive
  Driver.find({}, (err, docs) => {
    if (err) console.log("err", err);
    if (docs.length) {
      console.log({ "docs.length": docs.length });
      try {
        var data = _.map(docs, async (el) => {
          await Driver.update(
            { taxis: { $elemMatch: { vehicletype: "Exclusive" } } },
            { $set: { "taxis.$.vehicletype": "Executive" } },
            { multi: true }
          );
          await Driver.findOneAndUpdate(
            { _id: el._id, curService: "Exclusive" },
            { $set: { curService: "Executive" } },
            { multi: true }
          );
        });
        return res.json("Driver Details");
      } catch (err) {
        console.log(err);
        return res.json(err);
      }
    }
  });
};

export const changeVehicleNameInFB = async (req, res) => {
  Driver.find({}, (err, docs) => {
    if (err) console.log("err", err);
    if (docs.length) {
      try {
        var data = _.map(docs, async (el) => {
          if (el.taxis.length) {
            var driverid = el._id;
            var update = _.map(el.taxis, (el1) => {
              if (el1.vehicletype == "Executive") {
                var vehicletype = "Executive";
                var vehicleid = el1._id;
                if (!firebase.apps.length) {
                  firebase.initializeApp(config.firebasekey);
                }
                var db = firebase.database();
                var ref = db.ref("vehicle_list");

                var obj = {};

                var key3 = vehicletype.toString();
                var value3 = 0;

                obj[key3] = value3;

                // if(taxisdata.type[0].basic==true || taxisdata.type[0].basic=="true" ){obj.Basic = "0";}
                // if(taxisdata.type[0].normal==true || taxisdata.type[0].normal=="true" ){obj.Normal = "0";}
                // if(taxisdata.type[0].luxury==true || taxisdata.type[0].luxury=="true"  ){obj.Luxurious = "0";}

                var requestData = {
                  category: obj,
                };

                driverid = driverid.toString();
                vehicleid = vehicleid.toString();
                var usersRef = ref.child(driverid).child(vehicleid);

                usersRef.update(requestData, function (snapshot) {});
              }
            });
          }
        });
        return res.json("Driver Details");
      } catch (err) {
        console.log(err);
        return res.json(err);
      }
    }
  });
};

export const distanceAfterVerified = async (req, res) => {
  const from = 9.952241666666668 + "," + 78.13778666666667;
  const to = 9.952229999999998 + "," + 78.13777;
  var distanceInUnit = 10;
  var waitingTime = 60;
  var timeInMinutes = 120;

  var distanceAfterVerified = await GFunctions.calculateDistanceBasedOnLimit(
    from,
    to,
    distanceInUnit,
    waitingTime,
    timeInMinutes,
    8
  );
  return res.send(distanceAfterVerified);
};

// Add multiple Docs in Rental Package
var docs = [
  [1, 10, 260, 290, 520, 520, 810],
  [2, 20, 360, 400, 520, 520, 810],
  [3, 30, 460, 510, 645, 645, 810],
  [4, 40, 560, 620, 770, 770, 960],
  [4, 50, 660, 730, 895, 895, 1110],
  [4, 60, 760, 840, 1020, 1020, 1260],
  [4, 70, 860, 950, 1145, 1145, 1410],
  [4, 80, 960, 1060, 1270, 1270, 1560],
  [4, 90, 1060, 1170, 1395, 1395, 1710],
  [5, 100, 1160, 1280, 1520, 1520, 1860],
  [5, 110, 1260, 1390, 1645, 1645, 2010],
  [5, 120, 1360, 1500, 1770, 1770, 2160],
  [5, 130, 1460, 1610, 1895, 1895, 2310],
  [5, 140, 1560, 1720, 2020, 2020, 2460],
  [6, 150, 1660, 1830, 2145, 2145, 2610],
  [6, 160, 1760, 1940, 2270, 2270, 2760],
  [6, 170, 1860, 2050, 2395, 2395, 2910],
  [6, 180, 1960, 2160, 2520, 2520, 3060],
  [7, 190, 2060, 2270, 2645, 2645, 3210],
  [7, 200, 2160, 2380, 2770, 2770, 3360],
  [7, 210, 2260, 2490, 2895, 2895, 3510],
  [7, 220, 2360, 2600, 3020, 3020, 3660],
  [8, 230, 2460, 2710, 3145, 3145, 3810],
  [8, 240, 2560, 2820, 3270, 3270, 3960],
  [8, 250, 2660, 2930, 3395, 3395, 4110],
  [9, 260, 2760, 3040, 3520, 3520, 4260],
  [9, 270, 2860, 3150, 3645, 3645, 4410],
  [9, 280, 2960, 3260, 3770, 3770, 4560],
  [10, 290, 3060, 3370, 3895, 3895, 4710],
  [10, 300, 3160, 3480, 4020, 4020, 4860],
  [10, 310, 3260, 3590, 4145, 4145, 5010],
  [11, 320, 2360, 3700, 4270, 4270, 5160],
  [11, 330, 3460, 3810, 4395, 4395, 5310],
  [11, 340, 3560, 3920, 4520, 4520, 5460],
  [12, 350, 3660, 4030, 4645, 4645, 5610],
  [12, 360, 3760, 4140, 4770, 4770, 5760],
  [12, 370, 3860, 4250, 4895, 4895, 5910],
  [13, 380, 3960, 4360, 5020, 5020, 6060],
  [13, 390, 4060, 4470, 5145, 5145, 6210],
  [13, 400, 4160, 4580, 5270, 5270, 6360],
  [14, 410, 4260, 4690, 5395, 5395, 6510],
  [14, 420, 4360, 4800, 5520, 5520, 6660],
  [14, 430, 4460, 4910, 5645, 5645, 6810],
  [15, 440, 4560, 5020, 5770, 5770, 6960],
  [15, 450, 4660, 5130, 5895, 5895, 7110],
  [15, 460, 4760, 5240, 6020, 6020, 7260],
  [16, 470, 4860, 5350, 6145, 6145, 7410],
  [16, 480, 4960, 5460, 6270, 6270, 7560],
  [16, 490, 5060, 5570, 6395, 6395, 7710],
  [17, 500, 5160, 5680, 6520, 6520, 7860],
];

export const insertRentalPackage = (req, res) => {
  _.forEach(docs, function (element, i) {
    var scIdArray = [
      {
        scId: "5c1b33f7cbb65926fffc679c",
        name: "Default",
      },
    ];
    var newDoc = {
      name: docs[i][0] + " Hr " + docs[i][1] + " KMs ",
      price: 0,
      duration: docs[i][0],
      distance: docs[i][1],
      scIds: scIdArray,
    };
    newDoc = new RentalPackage(newDoc);
    var fixedRate = [
      {
        rate: docs[i][3],
        name: "Sedan",
      },
      {
        rate: docs[i][2],
        name: "Mini",
      },
      {
        rate: docs[i][4],
        name: "Suv",
      },
      {
        rate: docs[i][5],
        name: "Big6",
      },
      {
        rate: docs[i][6],
        name: "Big7",
      },
    ];
    fixedRate = fixedRate;
    newDoc = new RentalPackage(newDoc);
    _.forEach(fixedRate, function (element, i) {
      newDoc.fixedRate.push(element);
    });
    newDoc.save((err, data) => {
      if (err) {
        // console.log(err)
      } else {
        // console.log(data)
      }
    });
  });
};

// Add multiple Docs in Outstation Package
var outDocs = [
  [2, 20, 360, 400, 520, 520, 810],
  [3, 30, 460, 510, 645, 645, 810],
  [4, 40, 560, 620, 770, 770, 960],
  [4, 50, 660, 730, 895, 895, 1110],
  [4, 60, 760, 840, 1020, 1020, 1260],
  [4, 70, 860, 950, 1145, 1145, 1410],
  [4, 80, 960, 1060, 1270, 1270, 1560],
  [4, 90, 1060, 1170, 1395, 1395, 1710],
  [5, 100, 1160, 1280, 1520, 1520, 1860],
  [5, 110, 1260, 1390, 1645, 1645, 2010],
  [5, 120, 1360, 1500, 1770, 1770, 2160],
  [5, 130, 1460, 1610, 1895, 1895, 2310],
  [5, 140, 1560, 1720, 2020, 2020, 2460],
  [6, 150, 1660, 1830, 2145, 2145, 2610],
  [6, 160, 1760, 1940, 2270, 2270, 2760],
  [6, 170, 1860, 2050, 2395, 2395, 2910],
  [6, 180, 1960, 2160, 2520, 2520, 3060],
  [7, 190, 2060, 2270, 2645, 2645, 3210],
  [7, 200, 2160, 2380, 2770, 2770, 3360],
  [7, 210, 2260, 2490, 2895, 2895, 3510],
  [7, 220, 2360, 2600, 3020, 3020, 3660],
  [8, 230, 2460, 2710, 3145, 3145, 3810],
  [8, 240, 2560, 2820, 3270, 3270, 3960],
  [8, 250, 2660, 2930, 3395, 3395, 4110],
  [9, 260, 2760, 3040, 3520, 3520, 4260],
  [9, 270, 2860, 3150, 3645, 3645, 4410],
  [9, 280, 2960, 3260, 3770, 3770, 4560],
  [10, 290, 3060, 3370, 3895, 3895, 4710],
  [10, 300, 3160, 3480, 4020, 4020, 4860],
  [10, 310, 3260, 3590, 4145, 4145, 5010],
  [11, 320, 2360, 3700, 4270, 4270, 5160],
  [11, 330, 3460, 3810, 4395, 4395, 5310],
  [11, 340, 3560, 3920, 4520, 4520, 5460],
  [12, 350, 3660, 4030, 4645, 4645, 5610],
  [12, 360, 3760, 4140, 4770, 4770, 5760],
  [12, 370, 3860, 4250, 4895, 4895, 5910],
  [13, 380, 3960, 4360, 5020, 5020, 6060],
  [13, 390, 4060, 4470, 5145, 5145, 6210],
  [13, 400, 4160, 4580, 5270, 5270, 6360],
  [14, 410, 4260, 4690, 5395, 5395, 6510],
  [14, 420, 4360, 4800, 5520, 5520, 6660],
  [14, 430, 4460, 4910, 5645, 5645, 6810],
  [15, 440, 4560, 5020, 5770, 5770, 6960],
  [15, 450, 4660, 5130, 5895, 5895, 7110],
  [15, 460, 4760, 5240, 6020, 6020, 7260],
  [16, 470, 4860, 5350, 6145, 6145, 7410],
  [16, 480, 4960, 5460, 6270, 6270, 7560],
  [16, 490, 5060, 5570, 6395, 6395, 7710],
  [17, 500, 5160, 5680, 6520, 6520, 7860],
];

export const insertOutstationPackage = (req, res) => {
  console.log(req.body);
  _.forEach(docs, function (element, i) {
    var scIdArray = [
      {
        scId: "5c1b33f7cbb65926fffc679c",
        name: "Default",
      },
    ];
    var newDoc = {
      name: docs[i][0] + " Hr " + docs[i][1] + " KMs ",
      price: 0,
      duration: docs[i][0],
      distance: docs[i][1],
      jouneyType: req.body.jouneyType, //"oneway" or "round"
      scIds: scIdArray,
    };
    newDoc = new OutstationPackage(newDoc);
    var fixedRate = [
      {
        rate: docs[i][3],
        name: "Sedan",
      },
      {
        rate: docs[i][2],
        name: "Mini",
      },
      {
        rate: docs[i][4],
        name: "Suv",
      },
      {
        rate: docs[i][5],
        name: "Big6",
      },
      {
        rate: docs[i][6],
        name: "Big7",
      },
    ];
    fixedRate = fixedRate;
    newDoc = new OutstationPackage(newDoc);
    _.forEach(fixedRate, function (element, i) {
      newDoc.fixedRate.push(element);
    });
    newDoc.save((err, data) => {
      if (err) {
        // console.log(err)
      } else {
        // console.log(data)
      }
    });
  });
};

export const updateSubscriptionEndDate = async (req, res) => {
  var time = moment()
    .subtract(1, "days")
    .utcOffset(config.utcOffset)
    .format("YYYY-MM-DDT00:00:00.000[Z]");
  var endDate = moment()
    .add(30, "days")
    .utcOffset(config.utcOffset)
    .format("YYYY-MM-DDT00:00:00.000[Z]");
  console.log("time", time, endDate);
  var subscriptionData = await DriverSubscription.find({
    // status: "Expired",
    $and: [{ endDate: { $eq: new Date(time) } }],
  });
  // var subscriptionData = await DriverSubscription.find({ 'status': "Activated", endDate: { $gte: new Date(endDate) } });
  console.log("subscriptionData", subscriptionData.length);
  if (subscriptionData.length) {
    var driverIds = [];
    var data = _.map(subscriptionData, async (el) => {
      //   var update = {
      //     endDate: endDate,
      //   };
      //   var updateData = await DriverSubscription.findOneAndUpdate(
      //     { _id: el._id },
      //     update,
      //     { new: true }
      //   )
      //     .lean()
      //     .exec();
      driverIds.push({
        driverId: el.driverId,
        subId: el._id,
      });
    });
  }
  var updateDriver = _.map(driverIds, async (el) => {
    var updateDriverData = await Driver.findOneAndUpdate(
      {
        _id: el.driverId,
        isSubcriptionActive: "false",
        subcriptionEndDate: { $eq: null },
      },
      {
        subcriptionEndDate: endDate,
        isSubcriptionActive: true,
        currentSubId: el.subId,
      }
    )
      .lean()
      .exec();
    if (updateDriverData) {
      var update = {
        endDate: endDate,
        status: "Activated",
      };
      var updateData = await DriverSubscription.findOneAndUpdate(
        {
          _id: el.subId,
          driverId: el.driverId,
          endDate: { $eq: new Date(time) },
        },
        update,
        { new: true }
      )
        .lean()
        .exec();
      updateEnDateInFB(updateDriverData._id, endDate);
    }
    // console.log("driverIds", driverIds.length)
  });

  return res.json(driverIds /* , subscriptionData.length */);
};

export const updateEnDateInFB = async (driverid, subcriptionEndDate) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {};
  requestData.subcriptionEndDate = GFunctions.getDateTimeinThisFormat(
    subcriptionEndDate,
    "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
    "D-M-YYYY"
  );
  var child = driverid.toString();
  var usersRef = ref.child(child);
  requestData = GFunctions.convertAllNumbersToString(requestData);
  requestData.isSubcriptionActive = true;

  usersRef.update(requestData, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("updateDriverSubscriptionInFB");
    }
  });
};

export const updateLowCategoryOption = async (req, res) => {
  var driverData = await Driver.find({
    _id: mongoose.Types.ObjectId("5e738944c478c42e72e06074"),
  })
    .lean()
    .exec();
  if (driverData.length) {
    var data = _.map(driverData, (el) => {
      // var taxi = el.taxis.id(el.currentTaxi);
      var taxi = _.find(el.taxis, {
        _id: mongoose.Types.ObjectId(el.currentTaxi),
      });
      var status = el.online;

      console.log(taxi);
      var lowCategoryOptions = el.currentCategoryOptions;
      lowCategoryOptions.push(el.curService);
      var taxisdata = {
        vehicletype: el.currentTaxi,
        lowCategoryOptions: lowCategoryOptions,
        curService: el.curService,
        name: el.curService,
        service: el.curService,
        status: status,
        taxi: taxi,
      };
      enableLowerCategoryInFB(el._id, el.currentTaxi, taxisdata);
    });
  }
};

function enableLowerCategoryInFB(driverid, vehicleid, taxisdata) {
  console.log("enableLowerCategoryInFB", vehicleid);
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("vehicle_list");
  var obj = {};

  var key3 = taxisdata.vehicletype.toString();
  var value3 = 0;

  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);

  usersRef.once("value").then(function (snap) {
    var data = snap.val();
    console.log("data", data);

    var requestData = data.category;
    console.log("taxisdata.status", taxisdata.status);
    if (taxisdata.status == "false") {
      console.log(
        "requestData[taxisdata.service]",
        requestData[taxisdata.service]
      );
      delete requestData[taxisdata.service];
    } else {
      var data = _.map(taxisdata.lowCategoryOptions, (el) => {
        requestData[el] = value3;
      });
    }
    console.log("requestData", requestData);
    var categoryData = {
      category: requestData,
    };
    console.log("categoryData", categoryData);

    // usersRef.update(categoryData);
  });
}

export const getTripZones = async (id, defaultKmFare) => {
  try {
    // console.log("getTripZones", id);
    var distance = 0;
    var loc = [];
    var finalZone = [];
    var tripLocData = await TripLocation.findOne(
      { tripId: mongoose.Types.ObjectId(id) },
      {}
    ).exec();
    if (tripLocData) {
      console.log("_______________  tripLocData")
      loc = tripLocData.loc;
      var tripData = await Trips.findOne(
        { _id: mongoose.Types.ObjectId(tripLocData.tripId) },
        {}
      ).exec();
      if (tripData) {
      console.log("_______________  tripData")

        var scId = tripData.scId;
        var serviceType = tripData.vehicle;
        var serviceCityData = await getFormattedGeometry(scId);
        if (serviceCityData.length != 0) {
          loc.forEach(async (Locpoint, index) => {
            // console.log("getTripZones serviceType", serviceType);
            finalZone[index] = {};

            var locLocation = Locpoint.split(",");
            if (!index == 0) {
              var beforelocLocation = loc[index - 1].split(",");
              var newDistance = await getDistanceBttwoCords(
                beforelocLocation[0],
                beforelocLocation[1],
                locLocation[0],
                locLocation[1]
              );

              if (config.distanceUnit == "Miles") {
                newDistance = parseFloat(Number(newDistance) * 0.000621371);
              } else {
                newDistance = Number(newDistance) / 1000;
              }

              // newDistance = Number(newDistance) / 1000;
              newDistance = Number(newDistance).toFixed(2);
              distance = Number(newDistance).toFixed(2);
            }
            finalZone[index].zoneId = null;
            finalZone[index].distance = Number(distance);
            finalZone[index]["rate"] = defaultKmFare;
            serviceCityData.forEach((scData) => {
              var pickPoint = insidePolygon(
                [parseFloat(locLocation[1]), parseFloat(locLocation[0])],
                scData.geometry
              );
              if (pickPoint) {
                var rateData = scData.fixedPrice.filter((sData) => {
                  return sData.type == serviceType;
                });
                if (rateData.length)
                  finalZone[index]["rate"] = rateData[0].fixedRate;

                finalZone[index]["zoneId"] = scData._id;
                // finalZone[index]["distance"] = Number(distance);
              }
            });
          });
          let promises = await Promise.all([finalZone]);
          var tempData = groupByZones(promises[0]);
          let newData = await updateInTripLocation(tripLocData._id, tempData);
          let totalFare = getTotalZoneDistanceFare(tempData);
          let totalDistance = getTotalZoneDistance(tempData);
          return { tempData, newData, totalFare, totalDistance };
        }
      } else {
        console.log("___________ return 1")
        // console.log('getTripZones no trip')
        return 0.0;
      }
    } else {
      console.log("___________ return 0")

      // console.log("tripLocData  ", tripLocData);
      return 0.0;
    }
  } catch (err) {
    console.log(err);
    return 0.0;
  }
};

export const groupByZones = (data) => {
  let result = data.reduce(
    function (acc, obj) {
      if (acc.map.hasOwnProperty(obj.zoneId)) {
        acc.map[obj.zoneId].distance += +Number(obj.distance).toFixed(2);
      } else {
        var newObj = Object.assign({}, obj);
        acc.map[obj.zoneId] = newObj;
        acc.data.push(newObj);
      }
      return acc;
    },
    { data: [], map: {} }
  ).data;
  result.map((item) => {
    item.distance = Number(item.distance).toFixed(2);
    return item;
  });
  return result;
};

export const getFormattedGeometry = (id) => {
  console.log(id);
  try {
    return new Promise(async (resolve, reject) => {
      let Datas = ZoneCity.aggregate([
        {
          $match: {
            servicecityId: mongoose.Types.ObjectId(id),
          },
        },
        { $unwind: "$geometry" },
      ]);
      var promises = await Promise.all([Datas]);
      resolve(promises[0]);
    });
  } catch (err) {
    console.log(err);
    resolve([]);
  }
};

export const updateInTripLocation = (id, zoneSet) => {
  return new Promise((resolve, reject) => {
    TripLocation.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { zone: zoneSet },
      { new: true },
      function (err, data) {
        if (err) resolve({ update: false });
        else if (data) resolve({ update: true });
        else resolve({ update: false });
      }
    );
  });
};
export const getTotalZoneDistance = (zoneSet) => {
  var total = 0;

  // log('ffa',zoneSet);
  zoneSet.forEach((zone) => {
    total = (Number(total) + Number(zone.distance)).toFixed(2);
  });
  console.log(total, "total");
  return total;
};

export const getTotalZoneDistanceFare = (zoneSet) => {
  var total = 0;

  // log('ffa',zoneSet);
  zoneSet.forEach((zone) => {
    total = (Number(total) + Number(zone.distance) * Number(zone.rate)).toFixed(
      2
    );
  });
  console.log(total, "total");
  return total;
};

export const getEstimationZones = async (path, scid, defaultKmFare, type) => {
  try {
    // console.log(path, scid, defaultKmFare, type)
    var zones = [];
    var finalZone = [];

    if (path) {
      var new_Latlng_polyline = decodePolyline(path);
      zones = format_polyLine(new_Latlng_polyline);
      // console.log(zones)
      if (zones) {
        var loc = zones;
        var serviceCityData = await getFormattedGeometry(scid);

        loc.forEach(async (Locpoint, index) => {
          finalZone[index] = {};

          var locLocation = Locpoint.split(",");
          if (!index == 0) {
            var beforelocLocation = loc[index - 1].split(",");
            var newDistance = await getDistanceBttwoCords(
              beforelocLocation[0],
              beforelocLocation[1],
              locLocation[0],
              locLocation[1]
            );
            if (config.distanceUnit == "Miles") {
              newDistance = parseFloat(Number(newDistance) * 0.000621371);
            } else {
              newDistance = Number(newDistance) / 1000;
            }
            newDistance = Number(newDistance).toFixed(2);
            distance = Number(newDistance).toFixed(2);
          }
          finalZone[index].zoneId = null;
          finalZone[index].distance = isNaN(distance) ? 0 : Number(distance);
          finalZone[index]["rate"] = defaultKmFare;
          if (serviceCityData.length != 0) {
            serviceCityData.forEach((scData) => {
              var pickPoint = insidePolygon(
                [parseFloat(locLocation[1]), parseFloat(locLocation[0])],
                scData.geometry
              );
              if (pickPoint) {
                var rateData = scData.fixedPrice.filter((sData) => {
                  return sData.type == type;
                });
                if (rateData.length) {
                  console.log(
                    "rateData",
                    JSON.stringify(rateData),
                    defaultKmFare
                  );
                  finalZone[index]["rate"] = rateData[0].fixedRate;
                }

                finalZone[index]["zoneId"] = scData._id;
              }
            });
          }
        });
        let promises = await Promise.all([finalZone]);
        console.log("finalZone", JSON.stringify(promises[0]));
        var tempData = groupByZones(promises[0]);
        let totalFare = getTotalZoneDistanceFare(tempData);
        let totalDistance = getTotalZoneDistance(tempData);
        console.log("________________ totalFare",totalFare)
        return { tempData, totalFare, totalDistance };
        // }
        // else {
        //   return {};
        // }
      }
    }

    return {};
  } catch (err) {}
};
export const getGoogleRouteEncodeCtrl = async (req, res) => {
  var newOriginFormat = req.body.pickup_lat + "," + req.body.pickup_lng;
  var newDistFormat = req.body.dist_lat + "," + req.body.dist_lng;
  let newResponse = await getGoogleRouteEncode(newOriginFormat, newDistFormat);
  if (newResponse.status == "OK") {
    var new_overview_polyline = newResponse.routes[0].overview_polyline.points;
    var new_Latlng_polyline = decodePolyline(new_overview_polyline);
    return res.status(200).json({
      newResponse,
      new_Latlng_polyline: format_polyLine(new_Latlng_polyline),
    });
  } else {
    return res.status(200).json({});
  }
};

function format_polyLine(new_Set) {
  if (new_Set.length != 0) {
    var return_set = [];
    new_Set.forEach(function (item) {
      return_set.push(item.lat + "," + item.lng);
    });
    return return_set;
  }
}

export const getGoogleRouteEncode = (fromLat, toLat) => {
  return new Promise((resolve, reject) => {
    //fromLat, toLat   have to be in the format of  origin=12.9196565,80.1682046&destination=13.0347977,80.23008469999999
    if ((fromLat, toLat)) {
      const formData = {
        from: fromLat,
        to: toLat,
        key: config.googleApi,
      };
      var smsRequestURL = GFunctions.convertLableDynamically(
        config.directionApi,
        formData
      );
      console.log(smsRequestURL);
      req_uest.post(
        {
          url: smsRequestURL,
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(JSON.parse(body));
            // console.log('body:', body);
          } else {
            resolve(body);
          }
        }
      );
    }
  }); //
};

export const updateCounrtyFlags = async (req, res) => {
  let Countriesdata = await Countries.find().lean(); //.distinct('cityBoundaryPolygon')
  _.forEach(Countriesdata, (value) => {
    var object = value.name;
    object = object.toLowerCase();
    object = object.replace(/ /g, "_");
    udpateFLAG(value._id, object);
  });
  return res.send("qued");
};

export const udpateFLAG = async (_id, object) => {
  console.log(_id, object);
  await Countries.findOneAndUpdate(
    { _id: _id },
    {
      flag: "public/flags/" + object + ".gif",
    }
  ).exec();
};

export const removeLeadingZero = async (req, res) => {
  var RiderData = await Rider.find({}, { phone: 1 }).lean().exec();
  RiderData = _.map(RiderData, async (el) => {
    var phone = el.phone;
    el.phone = phone.replace(/^0+/, "");
    await Rider.findOneAndUpdate({ _id: el._id }, { phone: el.phone });
  });
};

export const updateSoftRejectStatus = async (req, res) => {
  var driverData = await Driver.find().lean().exec();
  var mapData = _.map(driverData, async (el) => {
    await Driver.findOneAndUpdate({ _id: el._id }, { softReject: false });
  });
};

export const makeReferenceAmountZero = async (req, res) => {
  var WalletData = await Wallet.find({}).lean().exec();
  var mapData = _.map(WalletData, (el) => {
    if (el.bal > 0) {
      var filteData = _.filter(el.trx, { for: "reference" });
      if (filteData.length) {
        var sumData = _.sumBy(filteData, "amt");
        var newBal = Number(el.bal) - Number(sumData);
        updateRiderWalletTransaction(
          el.ridid,
          sumData,
          "",
          "Reference Debit",
          "Debit"
        );
      }
    }
  });
};

export const SuggestionDriver = async (req, res) => {
  // var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];

  Driver.findOne({ phone: req.body.phone }, function (err, user) {
    console.log({ phone: req.body.phone });
    if (err) {
      console.log("Your suggestion driver is not avalible");
      {
        return res.status(500).json({
          success: false,
          message: req.i18n.__(
            "Your suggestion driver is not avalible Please Add the Driver Details"
          ),
          error: err,
        });
      }
    } else if (user) {
      console.log(user);
      var curstatus = user.curStatus;
      console.log("...curstatus:", curstatus);
      if (curstatus !== "free") {
        /// If 2nd Driver curstatus is not free //
        console.log("your suggestion driver currently not avalible");
        {
          return res.status(500).json({
            success: false,
            message: req.i18n.__(
              "Your suggestion driver is not avalible Please search another Driver"
            ),
            error: err,
          });
        } ///If 2nd driver curstatus is free
      } else {
        var updateData = {
          safeRideData: {
            SecondDriver: {
              DriverId: user._id,
              status: "0",
            },
          },
        };
      }
      console.log(updateData);
      Trips.findOneAndUpdate(
        { tripno: req.body.tripno },
        updateData,
        { new: true },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else if (docs) {
            console.log(docs);

            return res.json({ sucess: true, docs: docs });
          }
        }
      );
    }
  });
};
