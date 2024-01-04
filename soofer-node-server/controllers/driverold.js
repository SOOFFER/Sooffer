import mongoose from 'mongoose';

import * as HelperFunc from './adminfunctions';
var crypto = require('crypto');
var config = require('../config');
const moment = require('moment');
const Mustache = require('mustache');
const geolib = require("geolib");
const distance = require('google-distance-matrix');
const notificationContent = require('../notificationContent');
// var firebase = require('firebase');
//import models
import Driver from '../models/driver.model';
import Trips from '../models/trips.model';
import DriverPayment from '../models/driverpayment.model';
import Vehicletype from '../models/vehicletype.model';

import * as GFunctions from './functions';
var firebase = require('firebase');
var crypto = require('crypto');
import CompanyDetails from '../models/company.model';
import logger from '../helpers/logger';
// import { sendSmsMsg } from './smsGateway';
import * as smsGateway from './smsGateway';
const featuresSettings = require('../featuresSettings');
import { driverEarningsReport, findAndSendFCMToDriver } from './app';
import { sendEmail } from './mailGateway';
import DriverSubscription from '../models/driverSubscription.model';
import CancelReasons from '../models/cancellationReason.model';

import DriverBankTransaction from '../models/driverBankTransaction.model';
import DriverBank from '../models/driverBank.model';
import DriverWallet from '../models/driverWallet.model';
import DriverPerDay from '../models/driverperDay.model';
import { fusiontables } from 'googleapis/build/src/apis/fusiontables';
import { updateDriverWallet } from './driverBank';
const fs = require('fs')
const _ = require('lodash');
import { Parser } from 'json2csv';
import { truncate } from '@turf/turf';

// export const addData = (req,res) => {
//   const newDoc = new Driver(req.body);
//   newDoc.save((err,docs) => {
//     if(err){
//       return res.json({'success':false,'message':"SOME_ERROR"});
//     }
//     return res.json({'success':true,'message':'Data added successfully',docs});
//   })
// }


export const verifyNumber = (req, res) => {
  var errMsg = 'Phone No. already Exists.';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': (req.body.email).toLowerCase() })
    errMsg = 'Phone No. Or Email already Exists.';
  }

  Driver.findOne({ $or: findOrCondition }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'err': err });
    if (user) return res.status(401).json({ 'success': false, 'message': errMsg });
    var randomSMS = GFunctions.sendRandomizeCode('0', 4);
    if (req.body.otp && typeof req.body.otp !== 'undefined') {
      randomSMS = req.body.otp;
    }

    if (featuresSettings.registerOTPVerificationMethod == 'email' || featuresSettings.registerOTPVerificationMethod == 'both') {
      sendEmail(req.body.email, {}, '<#> OTP to install ' + config.appName + ' app is ' + randomSMS)
    }
    if (featuresSettings.registerOTPVerificationMethod == 'sms' || featuresSettings.registerOTPVerificationMethod == 'both') {
      // var msg = notificationContent[notificationContent.defaultLanguage]['verifyNumberRider'] + config.appName + ' ' + randomSMS;
      // smsGateway.sendSmsMsg(req.body.phone, '', req.body.phcode, msg);
      smsGateway.sendSmsMsg(req.body.phone, '', req.body.phcode, '', 'verifyNumberDriver', { 'RANDOMSMS': randomSMS, 'HASHVAL': req.body.hashval });
    }

    return res.json({ 'success': true, 'message': req.i18n.__("OTP_SEND_TO_YOUR") + ' Phone No.', 'code': randomSMS });
  })
};

export const addData = async (req, res) => {

  var errMsg = 'Phone No. already Exists.';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': req.body.email })
    errMsg = 'Phone No. Or Email already Exists.';
  }

  Driver.findOne({ $or: findOrCondition }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
    if (user) return res.status(401).json({ 'success': false, 'message': errMsg });
    var scId = null, scity = null;
    if (req.body.scId != null) scId = req.body.scId;
    if (req.body.scity != null) scity = req.body.scity;
    var newDoc = new Driver(
      {
        code: req.body.code,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phcode: req.body.phcode,
        phone: req.body.phone,
        gender: req.body.gender,
        DOB: req.body.DOB,
        cnty: req.body.cnty,
        cntyname: req.body.cntyname,
        state: req.body.state,
        statename: req.body.statename,
        city: req.body.city,
        cityname: req.body.cityname,
        cmpy: req.body.cmpy,
        isIndividual: req.body.isIndividual,
        lang: req.body.lang,
        cur: req.body.cur,
        actMail: req.body.actMail,
        actHolder: req.body.actHolder,
        actNo: req.body.actNo,
        actBank: req.body.actBank,
        actLoc: req.body.actLoc,
        actCode: req.body.actCode,
        fcmId: req.body.fcmId,
        nic: req.body.nic,
        scId: scId ? scId : null,
        scity: scity ? scity : null,
        status: [{
          curstatus: 'active'
        }],
        alternatePhnNo: req.body.alternatePhnNo ? req.body.alternatePhnNo : "",
      }
    );

    if (req['file'] != null) {
      newDoc.profile = req['file'].path;
    }

    if (req.body.profile != "" && typeof req.body.profile != "undefined") newDoc.profile = req.body.profile;

    if (req.body.referenceCode != "undefined" && req.body.referenceCode != "") {
      newDoc.referenceCode = req.body.referenceCode
    }

    if (req.body.loginType == 'facebook' || req.body.loginType == 'google') {
      newDoc.loginType = req.body.loginType;
      newDoc.loginId = req.body.loginId;
    } else {
      newDoc.setPassword(req.body.password);
    }
    newDoc.setReferal();

    newDoc.save((err, datas) => {
      if (err) {
        return res.json({ 'success': false, 'message': err.message, 'err': err });
      }
      var token = newDoc.generateJwt(datas._id, datas.email, datas.fname, "driver");
      var data = { name: datas.fname, email: datas.email, date: moment().format('LL'), phone: datas.phone };
      sendEmail(config.companymail, data, 'driverRegistation')
      if (datas.email) sendEmail(datas.email, data, 'driverwelcome')
      addDriverDatatoFb(datas._id);
      addDriverWallet(datas._id, datas.fname, req.body.referal);
      addDriverBank(datas._id, datas.fname);
      return res.status(200).json({
        'success': true, 'message': req.i18n.__("REGISTERED_SUCCESSFULLY"), "datas":
          [{
            "name": datas.fname, "email": datas.email,
            "status": datas.status, "active": datas.status.curstatus, "_id": datas._id
          }], token: token
      });
    })

  })
};

export const checkCodeAvail = (req, res) => {
  Driver.findOne({ 'code': req.body.code }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
    if (user) return res.status(200).json({ 'success': false, 'message': req.i18n.__("CODE_ALREADY_EXISTS") });
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("CODE_AVAILABLE") });
  })
};


function addDriverDatatoFb(id) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
    accept: {
      others: "0",
      trip_id: "0"
    },
    online_status: "0",
    proof_status: "pending",
    request: {
      drop_address: "0",
      etd: "0",
      picku_address: "0",
      request_id: "0",
      status: "0"
    },
    vehicle_id: "0",
    cancelExceeds: "0",
    lastCanceledDate: "0",
    credits: "0",
  };

  id = id.toString();
  var usersRef = ref.child(id);

  usersRef.update(requestData, function (snapshot) {
    // return res.json({'success':true,'message':'Password Updated Successfully', 'snap' :  snapshot});
  });
}


/**
 * Update Driver Details
 * @input
 * @param
 * @return
 * @response
 */
export const updateData = (req, res) => {
  var errMsg = 'Phone No. already Exists.';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': req.body.email })
    errMsg = 'Phone No. Or Email already Exists.';
  }

  Driver.findOne({ '$and': [{ '_id': { $ne: req.body._id } }, { $or: findOrCondition }] }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
    if (user) return res.status(401).json({ 'success': false, 'message': errMsg });
    var newDoc =
    {
      code: req.body.code,
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phone: req.body.phone,
      phcode: req.body.phcode,
      gender: req.body.gender,
      DOB: req.body.DOB,
      cnty: req.body.cnty,
      cntyname: req.body.cntyname,
      state: req.body.state,
      statename: req.body.statename,
      city: req.body.city,
      cityname: req.body.cityname,
      cmpy: req.body.cmpy,
      lang: req.body.lang,
      cur: req.body.cur,
      actMail: req.body.actMail,
      actHolder: req.body.actHolder,
      actNo: req.body.actNo,
      actBank: req.body.actBank,
      actLoc: req.body.actLoc,
      actCode: req.body.actCode,
      fcmId: req.body.fcmId,
      nic: req.body.nic,
      scId: req.body.scId,
      scity: req.body.scity,
      alternatePhnNo: req.body.alternatePhnNo ? req.body.alternatePhnNo : "",
    }

    if (req.body.profile != "" && typeof req.body.profile != "undefined") newDoc.profile = req.body.profile;

    Driver.findOneAndUpdate({ _id: req.body._id }, newDoc, { new: true }, (err, todo) => {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), todo });
    });
  })
};

/**
 * Delete Driver Details
 * @input
 * @param
 * @return
 * @response
 */
export const deleteDriver = (req, res) => {
  Driver.findByIdAndRemove(req.params.id, async (err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err });
    }
    await DriverBank.findOneAndRemove({ driverId: req.params.id });
    await DriverWallet.findOneAndRemove({ driverId: req.params.id });
    removeFromFB(req.params.id, 'docs');
    return res.json({ 'success': true, 'message': req.i18n.__('DRIVER_DELETED_SUCCESSFULLY') });
  })
}

/**
 * InActive Driver
 * @input
 * @param
 * @return
 * @response
 */
export const deleteData = (req, res) => {
  /* Driver.findByIdAndRemove(req.params.id, (err,docs) => {
    if(err){
      return res.json({'success':false,'message':req.i18n.__("SOME_ERROR"});
    }
    removeFromFB(req.params.id, 'docs');
    return res.json({'success':true,'message':req.i18n.__('Driver Deleted successfully'});
  }) */
  var update = {
    "softdel": 'inactive'
  }
  Driver.findOneAndUpdate({ _id: req.params.id }, update, { new: true }, (err, doc) => {
    if (err) { return res.status(401).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err }); }
    else {
      updateDriverProofStatusInFB(req.params.id, 'pending');
      return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_INACTIVATED_SUCCESSFULLY") });
    }
  })
}

export const driverActivate = (req, res) => {
  var update = {
    "softdel": 'active'
  }
  Driver.findOneAndUpdate({ _id: req.params.id }, update, { new: true }, (err, doc) => {
    if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err }); }
    else {
      updateDriverProofStatusInFB(req.params.id, 'Accepted');
      return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_ACTIVATED_SUCCESSFULLY") });
    }
  })
}

function removeFromFB(driverId, type) {
  type = type.toLowerCase();
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var requestData = {
    FCM_id: ""
  };

  var child = (driverId).toString();
  var usersRef = ref.child(child);

  usersRef.update(requestData, function (error) {
    if (error) {
      logger.error(err);
    } else {
    } // Send FCM
  });

  // var ref = db.ref("drivers_location");
  // var requestData = {
  //   online_status: status
  // };

  // var requestData = {
  //   '0': 0,
  //   '1': 0
  // };
  // var type = type.toString();
  // var driverid = driverId.toString();
  // var usersRef = ref.child(type).child(driverid).child('l');
  // usersRef.update(requestData, function (error) {
  //   if (error) {
  //     console.log(error)
  //   } else {
  //     // findAndSendFCMToDriver(child, "New Request");
  //   } // Send FCM
  // });
}


/**
 * Update DriverTAxi Details
 * @input
 * @param
 * @return
 * @response
 */
export const updateDrivertaxis = (req, res) => {
  Driver.findById(req.body.driver, function (err, docs) {
    if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var taxi = docs.taxis.id(req.body._id);

    if (docs.currentTaxi == req.body._id) {
      docs.curService = req.body.vehicletype;
    }
    taxi.makename = req.body.makename;
    taxi.model = req.body.model;
    taxi.year = req.body.year;
    taxi.licence = req.body.licence;
    taxi.cpy = req.body.cpy;
    taxi.driver = req.body.driver;
    taxi.color = req.body.color;
    taxi.vehicletype = req.body.vehicletype;
    if (req.body.image) taxi.image = req.body.image;

    docs.save(function (err, op) {
      if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      updateSetAsDefault(req.body.driver, req.body._id);
      updateDrivertaxisDataFB(req.body.driver, req.body._id, taxi, taxi.taxistatus);
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'drivertaxis': docs.taxis });
    });

  });
};

/**
 * Delete DriverTaxi Details
 * @input
 * @param
 * @return
 * @response
 */
export const deleteDrivertaxis = (req, res) => {
  Driver.findOne({ _id: req.params.dId }).exec((err, docs) => {
    if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    if (!docs) return res.json({ 'success': false, 'message': req.i18n.__("CHANGED_DRIVER_NOT_FOUND"), 'dvr': req.body.driver });
    if (docs.currentTaxi == req.params.id) return res.status(409).json({ 'success': false, 'message': req.i18n.__("CURRENT_TAXI_CANNOT_BE_DELETED"), 'drivertaxis': docs.taxis });
    docs.taxis.remove(req.params.id);
    docs.save(function (err, op) {
      if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      deleteDrivertaxisDataFB(req.params.dId, req.params.id);
      setAsDefaultIfNone(req.params.dId);
      return res.json({ 'success': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY"), 'drivertaxis': docs.taxis });
    });
  })
}

export const getData = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  // let TotCnt = Driver.find(likeQuery).count();
  var populateMatch = {};

  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$eq": req.query.scity_like };
  if (req.type == 'company') likeQuery['cmpy'] = { "$in": req.userId };
  if (likeQuery["cmpy"]) {
    populateMatch = { 'company.name': likeQuery['cmpy'] }
    delete likeQuery["cmpy"];
  }
  if (likeQuery["taxis.model"]) {
    likeQuery['$or'] = [{ "taxis.vehicletype": likeQuery["taxis.model"] }, { "taxis.model": likeQuery["taxis.model"] }];
    delete likeQuery["taxis.model"];
  }

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  console.log("likeQuery",likeQuery)

  let TotCnt = Driver.find({ $and: [likeQuery, { "softdel": "active" }] }).count();

  let Datas = Driver.aggregate([
    {
      "$match": {
        $and: [
          likeQuery,
          { "softdel": "active" }
        ]
      }
    },
    {
      "$lookup": {
        "localField": "cmpy",
        "from": "companydetails",
        "foreignField": "_id",
        "as": "company"
      }
    },
    skip, limit,
    { "$sort": sortQuery },
    { '$match': populateMatch }
  ]);

  // let Datas = Driver.find({
  //   $and: [likeQuery,
  //     //  {"softdel": "active"}
  //   ]
  // }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);

  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }

}


export const driverListsForExport = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$in": req.querymessage.scity_like };
  if (req.type == 'company') likeQuery['cmpy'] = { "$in": req.userId };

  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  let TotCnt = Driver.find(likeQuery).count();

  let Datas = Driver.find({
    $and: [
      likeQuery
    ]
  }
    , { code: 1, fname: 1, lname: 1, nic: 1, email: 1, phcode: 1, phone: 1, city: 1, wallet: 1, softdel: 1 }
  ).sort(sortQuery);

  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}


export const getDataworking = (req, res) => {

  //   Driver.aggregate([
  //   { "$match": { "fname": "Driver1" } },

  //   { "$lookup": {
  //     "localField": "cmpy",
  //     "from": "companydetails",
  //     "foreignField": "_id",
  //     "as": "company"
  //   } },
  //   { "$unwind": "$userinfo" },
  //   { "$project": {
  //     "lname": 1,
  //     "email": 1,
  //     "userinfo.name": 1,
  //     "userinfo.phone": 1
  //   } }
  // ]);


  Driver.aggregate([
    // { "$match": { "fname": "Driver1" } },

    {
      "$lookup": {
        "localField": "cmpy",
        "from": "companydetails",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "lname": 1,
        "email": 1,
        "userinfo.name": 1,
        "userinfo.phone": 1
      }
    }
  ], function (err, result) {
    if (err) {
      logger.error(err);
      return;
    }
    // return res.json({'success':true,'message':req.i18n.__('Data added successfully',doc});
    logger.info(result);
    return res.json(result);
    // console.log(result);
  });

}

export const checkNic = (req, res) => {
  Driver.find({ "nic": req.params.nicNo }, {}, function (err, data) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    if (data.length) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("SAME_NIC_NUMBER_ALREADY_EXISTS") });
    }
    return res.status(200).json({ 'sucess': true, 'message': req.i18n.__("NO_SUCH_NIC") });
  })
}


export const getCmpyDrivers = (req, res) => {
  Driver.find({ 'cmpy': req.params.id }).select({ "fname": 1, "_id": 1 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

export const login = (req, res) => {
  var driverWhere = {};
  var userName = req.body.username ? req.body.username : req.body.email;
  var checkPassword = true;
  if (req.body.loginType == 'facebook' || req.body.loginType == 'google') {
    driverWhere = { 'loginType': req.body.loginType, 'loginId': req.body.loginId };
    checkPassword = false;
  } else {
    driverWhere = { $or: [{ 'phone': userName }, { 'code': userName }, { 'email': (userName).toLowerCase() }] };
  }

  Driver.findOne(driverWhere, function (err, user) {
    var newDoc = Driver();
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
    if (!user) return res.status(401).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") });

    if (checkPassword) {
      var passwordIsValid = newDoc.validPassword(req.body.password, user.salt, user.hash);
      if (!passwordIsValid) return res.status(401).json({ 'success': false, 'message': req.i18n.__("INVALID_PASSWORD") });
    }

    if (user.softdel == 'inactive') return res.status(401).json({ 'success': false, 'message': req.i18n.__("ACCOUNT_WAS_INACTIVATED_BY_ADMIN") });

    var token = newDoc.generateJwt(user._id, user.email, user.fname, "driver", user.code);
    addFCMId(req.body.fcmId, user._id);
    var taxi = user.taxis.id(user.currentTaxi);

    var userProfile = {};
    userProfile.currentActiveTaxi = taxi;
    userProfile.isDriverCreditModuleEnabledForUseAfterLogin = featuresSettings.isDriverCreditModuleEnabled;
    userProfile.profileurl = config.baseurl + user.profile;

    return res.status(200).json({
      'success': true, 'message': req.i18n.__("LOGIN_SUCCESS"), "datas": [{
        "name": user.fname, "email": user.email, "nic": user.nic,
        "status": user.status, "active": user.status.curstatus, "code": user.code
        , "userId": user._id, "profile": {
          userProfile
        }
        , "walletType": user.walletType
        , "walletCredit": user.wallet
        , "walletLimit": featuresSettings.driverPayouts.driverCreditAmountOfflineLimit
        , "LimitAlert": "You have to maintain minimum Rs.500/- to continue your rides."
      }], token: token
    });
  })
}

function addFCMId(fcmId, userid) {
  var update = {
    fcmId: fcmId,
    last_in: GFunctions.sendTimeNow('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    last_out: null,
    isLogin: true,
  }
  Driver.findOneAndUpdate({ _id: userid }, update, { new: true }, (err, doc) => {
    if (err) { logger.error(err); }
    else { logger.info(fcmId); }
  })
}

export const addDrivertaxisData = (req, res) => {

  //mth 1 working with bug
  // Driver.findOne({ _id :  req.body.driver },
  // Driver.findById(   req.body.driver  ,
  //  function(err,doc){
  //   doc.taxis.push( taxis );
  //   doc.save();
  //   return res.json({'success':true,'message':'Data added successfully',doc});
  // } )

  // setAsDefault("5aea9dccc02abf1942ebe4a5",2,3);
  //req.body.vehicletype
  Driver.find({
    _id: req.body.driver,
    "taxis": { "$elemMatch": { "licence": req.body.licence } }
  }, {}).exec(async (err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    if (docs.length) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("SAME_VEHICLE_ALREADY_EXISTS") });
    }
    else {
      var lowCategoryOptions = [];
      //If new licence //make it CB
      var id = mongoose.Types.ObjectId();
      var taxisdata = {
        _id: id,
        makename: req.body.makename,
        model: req.body.model,
        year: req.body.year,
        licence: req.body.licence,
        cpy: req.body.cpy,
        driver: req.body.driver,
        color: req.body.color,
        handicap: req.body.handicap,
        type: [{
          basic: req.body.basic,
          normal: req.body.normal,
          luxury: req.body.luxury
        }],

        vehicletype: req.body.vehicletype,
        noofshare: 0,
        share: false,
        chaisis: req.body.chaisis,
        ownername: req.body.ownername,
        registrationnumber: req.body.registrationnumber,
        vin_number: req.body.vin_number,
        others1: req.body.others1,
        image: req.body.image,
        isDaily: true,
        isRental: false,
        isOutstation: false,
      }

      Driver.findByIdAndUpdate(req.body.driver, {
        currentCategoryOptions: lowCategoryOptions,
        $push: { taxis: taxisdata }
      }, { 'new': true },
        function (err, doc) {
          if (err) {
            return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
          }
          setAsDefault(req.body.driver, id, taxisdata);
          addDrivertaxisDataFB(req.body.driver, id, taxisdata);
          return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), 'taxi': taxisdata });
        }
      );

      //If new licence //make it CB
    }
  })
}


// export const addDrivertaxisData = (req,res) => {
//   var id = mongoose.Types.ObjectId();

//   Driver.find( {  _id: req.body.driver ,
//     "taxis": { "$elemMatch": { "licence": req.body.licence  } }

//   } , { hash : 0, salt : 0 }  ).exec((err,docs) => {
//     if(err){
//       return res.json([]);
//     }
//     if(docs.length){
//       return res.json(docs);
//     }
//     else{
//       return res.json([]);
//     }
//   })

// }

/**
 * Set if it is First Document in Both Mongo and Firebase
 * @input
 * @param
 * @return
 * @response
 */
async function setAsDefault(driverid, vehicleid, taxisdata) {

  let driverDoc = await Driver.findById(driverid).lean().exec();
  var totalTaxi = driverDoc.taxis;
  console.log('totalTaxi', totalTaxi.length)
  if (totalTaxi.length == 1) {
    setAsDefaultFB(driverid, vehicleid);
    setAsDefaultMongo(driverid, vehicleid);
  }
  else {
    console.log("setAsDefault No");
  }

  /* Driver.aggregate(
    [

      { "$match": { "_id": { "$in": [mongoose.Types.ObjectId(driverid)] } } },

      // {$match: {'taxis.0': {$exists: true} , _id : iid } },

      // { $match : { lname : iid  } },
      { $unwind: "$taxis" },
      {
        $group: {
          _id: '',
          count: { $sum: 1 }
        }
      }
    ], function (err, result) {
      if (err) {
        logger.error(err);
      } else {

        if (result.length == 1) {
          if (result[0].count == 1) {
            setAsDefaultFB(driverid, vehicleid);
            setAsDefaultMongo(driverid, vehicleid);
          } else {
            console.log("setAsDefault No");
          }
        }

      }
    }
  ) */


}


async function setAsDefaultIfNone(driverid) {

  let driverDoc = await Driver.findById(driverid).lean().exec();

  var taxi = driverDoc.taxis.id(driverDoc.currentTaxi);
  if (taxi.length <= 0) {

    var totalTaxi = driverDoc.taxis;
    if (totalTaxi.length > 0) {
      var vehicleid = totalTaxi[0]._id;
      setAsDefaultFB(driverid, vehicleid);
      setAsDefaultMongo(driverid, vehicleid);
    }

  }

  else {
    console.log("setAsDefault No");
  }

}

function setAsDefaultFB(userid, vehicleid) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
    vehicle_id: vehicleid
  };
  var child = userid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
}

function setAsDefaultMongo(userid, vehicleid) {
  Driver.findById(userid, function (err, docs) {
    if (err) { }
    else if (docs) {
      var taxi = docs.taxis.id(vehicleid);

      // var obj = "";
      // if(taxi.type[0].basic==true || taxi.type[0].basic=="true" ){ obj = "Basic,"; }
      // if(taxi.type[0].normal==true || taxi.type[0].normal=="true" ){  obj = obj + "Normal,";   }
      // if(taxi.type[0].luxury==true || taxi.type[0].luxury=="true"  ){ obj = obj + "Luxurious"; }

      docs.noofshare = taxi.noofshare;
      docs.share = taxi.share;
      docs.curService = taxi.vehicletype;

      docs.currentTaxi = vehicleid;
      docs.serviceStatus = taxi.taxistatus;
      docs.curVehicleNo = taxi.licence;
      docs.vin_number = taxi.vin_number;

      docs.save(function (err, op) {
        if (err) { } else { }
      });
    } //Else If doc exists
  });
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
  var obj = {

  };

  var key3 = (taxisdata.vehicletype).toString();
  var value3 = 0;

  obj[key3] = value3;


  // if(taxisdata.type[0].basic==true || taxisdata.type[0].basic=="true" ){obj.Basic = "0";}
  // if(taxisdata.type[0].normal==true || taxisdata.type[0].normal=="true" ){obj.Normal = "0";}
  // if(taxisdata.type[0].luxury==true || taxisdata.type[0].luxury=="true"  ){obj.Luxurious = "0";}

  var requestData = {
    category: obj,
    make: taxisdata.makename,
    model: taxisdata.model,
    plate_num: taxisdata.licence,
    status: "0"
  };

  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);

  usersRef.set(requestData, function (snapshot) {

  });
}

/*
Delete
*/
function deleteDrivertaxisDataFB(driverid, vehicleid, taxisdata = "") {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("vehicle_list");
  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);

  usersRef.remove();
}

export const updateAppDrivertaxiImage = (req, res) => {
  if (req['file'] != null) {
    var filePath = req['file'].path;
    return res.json({
      'success': true, 'message': req.i18n.__("FILE_ADDED_SUCCESSFULLY"), 'fileurl': filePath
    });
  }
  else {
    return res.status(409).json({
      'success': false, 'message': req.i18n.__("FILE_ADD_FAILED")
    });
  }
}

export const uploadDriverDocs = (req, res) => {
  // if (req['file'] == null) req['file'].path = ""
  if (req['file'] != null) {

    switch (req.body.filefor) {
      case "licence":
        var update = {
          licence: req['file'].path,
          licenceexp: GFunctions.setFormatDate(req.body.licenceexp),
          licenceNo: req.body.licenceNo,
        }
        break;
      case "insurance":
        var update = {
          insurance: req['file'].path,
          insuranceexp: GFunctions.setFormatDate(req.body.licenceexp)
        }
        break;
      case "insuranceBackImg":
        var update = {
          insuranceBackImg: req['file'].path,
        }
        break;
      case "passing":
        var update = {
          passing: req['file'].path,
          passingexp: GFunctions.setFormatDate(req.body.licenceexp)
        }
        break;
      case "passingBackImg":
        var update = {
          passingBackImg: req['file'].path,
        }
        break;
      case "revenue":
        var update = {
          revenue: req['file'].path,
          revenueexp: GFunctions.setFormatDate(req.body.revenueexp)
        }
        break;

      case "licenceBackImg":
        var update = {
          licenceBackImg: req['file'].path,
        }
        break;

      case "nationIdback":
        var update = {
          nationIdback: req['file'].path,
        }
        break;

      case "badge":
        var update = {
          badgeNo: req.body.badgeNo,
        }
        break;

      case "panCard":
        var update = {
          panCard: req['file'].path,
        }
        break;

      case "aadhaar":
        var update = {
          aadhaar: req['file'].path,
          aadhaarNo: req.body.aadhaarNo,
        }
        break;

    }


    Driver.findOneAndUpdate({ _id: req.body.driverid }, update, { new: true }, (err, doc) => {
      if (err) {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }
      return res.json({
        'success': true, 'message': req.i18n.__("FILE_ADDED_SUCCESSFULLY"), 'file': req['file'], 'fileurl': config.baseurl + req['file'].path,
        'request': req.body, 'driverstatus': doc.status
      });
    })
  }
  else {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("PLEASE_CHOOSE_DOCUMENT_TO_UPLOAD") });
  }
}

export const getAppDrivertaxis = (req, res) => {
  Driver.find({ _id: req.params.id }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    if (docs.length) {
      return res.json(docs[0].taxis);
    }
    else {
      return res.json([]);
    }
  })
}

export const deleteAppDrivertaxis = (req, res) => {
  Driver.findOne({ _id: req.body.driverid }).exec((err, docs) => {
    if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    if (!docs) return res.status(409).json({ 'success': false, 'message': req.i18n.__("CHANGED_DRIVER_NOT_FOUND"), 'dvr': req.body.driverid });
    var taxiSet = docs.taxis.id(req.body.makeid);
    if (req.body.makeid.toString() == docs.currentTaxi.toString())
      return res.json({ 'success': true, 'message': req.i18n.__("CANNOT_DELETE_CURRENT_TAXI"), 'drivertaxis': docs.taxis });
    docs.taxis.remove(req.body.makeid);
    docs.save(function (err, op) {
      if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      removeDriver_loc_node(taxiSet.vehicletype, req.body.driverid);
      deleteDrivertaxisDataFB(req.body.driverid, req.body.makeid);
      return res.json({ 'success': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY"), 'drivertaxis': docs.taxis });
    });
  });
}

export const updateAppDrivertaxis = (req, res) => {

  // var updatedata =  {
  //   makename: req.body.makename,
  //   model: req.body.model,
  //   year: req.body.year,
  //   licence: req.body.licence,
  //   cpy: req.body.cpy,
  //   driver: req.body.driver,
  //   color: req.body.color,
  //   handicap: req.body.handicap,
  //   type: [{
  //     basic: req.body.basic,
  //     normal: req.body.normal,
  //     luxury: req.body.luxury
  //   }]
  // }

  // Driver.findOne( { _id:req.body.driver }  ).exec((err,docs) => {
  //   if(err) return res.json({'success':false,'message':"SOME_ERROR",'error':err});
  //   if (!docs) return res.json({'success':false,'message':'Driver Not found','error':err});


  //   docs.taxis.remove(req.body.makeid);

  //   docs.save(function(err, op) {
  //     if(err) return res.json({'success':false,'message':"SOME_ERROR",'error':err});
  //     return res.json({'success':true,'message':'Updated successfully', 'drivertaxis' : docs.taxis  });
  //   });
  // })

  // Driver.findOne( { _id: req.body.driver } , function (err, user) {
  //   user.taxis.update(  { color : "mk" }, { $set:  updatedata  }  ).exec((err,docs) => {
  //     if(err) return res.json({'success':false,'message':"SOME_ERROR",'error':err});
  //     return res.json({'success':true,'message':'Updated successfully', 'drivertaxis' : docs  });
  //   })
  // })

  Driver.findById(req.body.driver, function (err, docs) {
    if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var taxi = docs.taxis.id(req.body.makeid);
    var oldTaxi = docs.taxis.id(req.body.makeid);

    taxi.makename = req.body.makename;
    taxi.model = req.body.model;
    taxi.year = req.body.year;
    taxi.licence = req.body.licence;
    taxi.cpy = req.body.cpy;
    taxi.driver = req.body.driver;
    taxi.color = req.body.color;
    taxi.handicap = req.body.handicap;
    taxi.chaisis = req.body.chaisis,
      taxi.ownername = req.body.ownername,
      taxi.registrationnumber = req.body.registrationnumber,
      taxi.registration = req.body.registration,
      taxi.vin_number = req.body.vin_number,
      taxi.others1 = req.body.others1,

      // taxi.type: [{
      // taxi.type[0].basic =  req.body.basic;
      // taxi.type[0].normal =  req.body.normal;
      // taxi.type[0].luxury = req.body.luxury;
      // }]
      taxi.vehicletype = req.body.vehicletype;
    taxi.lowCategoryOptions = req.body.lowCategoryOptions;
    if (docs.currentTaxi.toString() == req.body.makeid.toString())
      docs.currentCategoryOptions = req.body.lowCategoryOptions;

    docs.save(function (err, op) {
      if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      updateSetAsDefault(req.body.driver, req.body.makeid, taxi);
      updateDrivertaxisDataFB(req.body.driver, req.body.makeid, taxi, oldTaxi.taxistatus);
      if (oldTaxi.vehicletype != req.body.vehicletype)
        removeDriver_loc_node(taxi.vehicletype, req.body.driver);
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'drivertaxis': docs.taxis });
    });

  });

}



/*
 Update only
*/
function updateDrivertaxisDataFB(driverid, vehicleid, taxisdata, taxistatus = 'inactive') {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("vehicle_list");
  var obj = {};

  // if(taxisdata.type[0].basic==true || taxisdata.type[0].basic=="true" ){obj.Basic = "0";}
  // if(taxisdata.type[0].normal==true || taxisdata.type[0].normal=="true" ){obj.Normal = "0";}
  // if(taxisdata.type[0].luxury==true || taxisdata.type[0].luxury=="true"  ){obj.Luxurious = "0";}

  taxisdata.vehicletype = GFunctions.getFirebaseSupportedChars(taxisdata.vehicletype);
  var key3 = (taxisdata.vehicletype).toString();
  var value3 = "0";
  if (taxistatus == 'active') value3 = "1";
  obj[key3] = value3;

  var requestData = {
    category: obj,
    make: taxisdata.makename,
    model: taxisdata.model,
    plate_num: taxisdata.licence,
    status: value3
  };
  console.log(requestData, "requestData")

  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);

  usersRef.set(requestData, function (snapshot) {
  });
}





/**
 * Set if it is First Document in Both Mongo and Firebase
 * @input
 * @param
 * @return
 * @response
 */
function updateSetAsDefault(driverid, vehicleid, taxi) {
  Driver.findById(driverid, function (err, docs) {
    if (err) { }
    else if (docs) {
      if (docs.currentTaxi == vehicleid) { //This is the current
        var taxi = docs.taxis.id(vehicleid);
        var obj = taxi.type[0];
        docs.currentTaxi = vehicleid;
        docs.curService = (taxi.vehicletype).toString();
        docs.serviceStatus = taxi.taxistatus;
      }
      docs.save(function (err, op) {
        if (err) { } else { }
      });
    } //Else If doc exists
  });
}


//CHK SI
export const uploadDriverTaxiDocs = (req, res) => {

  Driver.findById(req.body.driverid, function (err, docs) {
    if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    if (!docs) return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND"), 'error': err });

    var taxi = docs.taxis.id(req.body.makeid);
    var filename = "";
    if (req['file'] != null) {
      if (req.body.filefor == "Insurance") {
        taxi.insurance = req['file'].path;
        taxi.insuranceexpdate = GFunctions.setFormatDate(req.body.expDate);
        taxi.insurancenumber = req.body.insurancenumber;
      }
      else if (req.body.filefor == "permit") {
        taxi.permit = req['file'].path; taxi.permitexpdate = GFunctions.setFormatDate(req.body.expDate);
      } //Vehicle Revenue Licence in 247
      else if (req.body.filefor == "registration") {
        taxi.registration = req['file'].path;
        // taxi.registrationexpdate = GFunctions.setFormatDate(req.body.expDate);
        taxi.registrationnumber = req.body.registrationnumber;
      }

      // else if (req.body.filefor == "registrationexpdate") {
      //   taxi.registrationexpdate = GFunctions.setFormatDate(req.body.expDate);
      // }

      else if (req.body.filefor == "registrationBack") {
        taxi.registrationBack = req['file'].path;
        taxi.registrationexpdate = GFunctions.setFormatDate(req.body.expDate);
      }

      else if (req.body.filefor == "imageBack") {
        taxi.imageBack = req['file'].path;
      }

      else if (req.body.filefor == "image") {
        taxi.image = req['file'].path;
      }
      else if (req.body.filefor == "imageRight") {
        taxi.imageRight = req['file'].path;
      }
      else if (req.body.filefor == "imageLeft") {
        taxi.imageLeft = req['file'].path;
      }
      else if (req.body.filefor == "interiorFront") {
        taxi.interiorFront = req['file'].path;
      }
      else if (req.body.filefor == "interiorBack") {
        taxi.interiorBack = req['file'].path;
      }

      filename = req['file'].path;
    } else {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("NO_FILE_SELECTED"), 'error': err });
    }

    docs.save(function (err, op) {
      if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      taxi = taxi.toObject({ getters: true })
      changeDateFormatOnTaxisDocs(taxi)
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'drivertaxis': taxi, 'fileurl': config.baseurl + filename, 'file': req['file'] });
    });

  });

}

function changeDateFormatOnTaxisDocs(taxi) {
  taxi.insuranceexpdate = (taxi.insuranceexpdate) ? moment(taxi.insuranceexpdate).format('DD-MM-YYYY') : "";
  taxi.permitexpdate = (taxi.permitexpdate) ? moment(taxi.permitexpdate).format('DD-MM-YYYY') : "";
  taxi.registrationexpdate = (taxi.registrationexpdate) ? moment(taxi.registrationexpdate).format('DD-MM-YYYY') : "";
  return taxi;
}

export const getAppData = (req, res) => {
  Driver.find({ _id: req.userId }, { hash: 0, salt: 0 }).exec(async (err, docs) => {
    if (err) {
      return res.json([]);
    }
    if (docs.length) {
      if (docs[0].isSubcriptionActive && docs[0].subcriptionEndDate != null) docs[0].subcriptionEndDate = GFunctions.getDateTimeinThisFormat(docs[0].subcriptionEndDate, "YYYY-MM-DDT00:00:00.000[Z]", "DD-MM-YYYY")
      docs.push({ profileurl: config.baseurl + docs[0].profile });
      var taxi = docs[0].taxis.id(docs[0].currentTaxi);
      docs.push({ currentActiveTaxi: taxi });
      docs[0].baseurl = config.baseurl;
      docs.push({
        "isDriverCreditModuleEnabledForUseAfterLogin": featuresSettings.isDriverCreditModuleEnabled,
        "walletType": docs[0].walletType,
        "walletCredit": docs[0].wallet,
        "walletLimit": featuresSettings.driverPayouts.driverCreditAmountOfflineLimit,
        "LimitAlert": "You have to maintain minimum Rs.500/- to continue your rides.",
      });
      let language = config.appDefaultLanguageCode;
      if (req.headers['accept-language'] && req.headers['accept-language'].length < 3) {
        language = (req.headers['accept-language']) ? req.headers['accept-language'] : config.appDefaultLanguageCode;
      }
      var cancelReason = await CancelReasons.findOne({ "language": language }, { 'driverCancelReason': 1 });
      if (cancelReason) {
        docs.push({ "driverCancellationReasons": cancelReason.driverCancelReason });
      } else {
        docs.push({ "driverCancellationReasons": [] });
      }
      return res.json(docs);

      //Only Rebustar Demo
      /*   var resObj = formatProfileRes(docs[0]);
        var resArray = [resObj];
        resArray.push({ profileurl: config.baseurl + docs[0].profile });
        var taxi = docs[0].taxis.id(docs[0].currentTaxi);
        resArray.push({ currentActiveTaxi: taxi });
        docs[0].baseurl = config.baseurl;
        resArray.push({ "isDriverCreditModuleEnabledForUseAfterLogin": featuresSettings.isDriverCreditModuleEnabled });
        return res.json(resArray); */
      //Only Rebustar Demo

    }
    else {
      return res.json([]);
    }
  })
}


function formatProfileRes(doc) {
  var newObj = {
    "_id": doc._id,
    "code": doc.code,
    "loginType": doc.loginType,
    "isConnected": doc.isConnected,
    "curTrip": doc.curTrip,
    "todayAmt": doc.todayAmt,
    "lastCanceledDate": doc.lastCanceledDate,
    "canceledCount": doc.canceledCount,
    "wallet": doc.wallet,
    "rating": doc.rating,
    "coords": doc.coords,
    "online": doc.online,
    "share": doc.share,
    "curVehicleNo": doc.curVehicleNo,
    "curStatus": doc.curStatus,
    "curService": doc.curService,
    "serviceStatus": doc.serviceStatus,
    "currentTaxi": doc.currentTaxi,
    "taxis": doc.taxis,
    "status": doc.status,
    "baseurl": doc.baseurl,
    "createdAt": doc.createdAt,
    "phone": doc.phone,
    "email": doc.email,
    "lname": doc.lname,
    "fname": doc.fname,
    "status": doc.status,
    "referal": doc.referal,
    "balance": doc.balance,
    "gender": doc.gender,
    "address": doc.address,
    "rating": doc.rating,
    "EmgContact": doc.EmgContact,
    "profile": doc.profile,
    "phcode": doc.phcode,
    "__v": doc.__v,
    "callmask": doc.callmask,
    "loginId": doc.loginId,
    "loginType": doc.loginType,
    "verificationCode": doc.verificationCode,
    "cityname": doc.cityname,
    "city": doc.city,
    "statename": doc.statename,
    "state": doc.state,
    "cntyname": doc.cntyname,
    "cnty": doc.cnty,
    "scity": doc.scity,
    "lastCanceledDate": doc.lastCanceledDate,
    "canceledCount": doc.canceledCount,
    "lang": doc.lang,
    "fcmId": doc.fcmId,
    "card": doc.card,
    "cur": doc.cur,
    "licence": doc.licence,
    "licenceexp": doc.licenceexp,
    "insurance": doc.insurance,
    "insuranceexp": doc.insuranceexp,
    "passing": doc.passing,
    "passingexp": doc.passingexp,
    "nationIdback": doc.nationIdback,
    "licenceBackImg": doc.licenceBackImg,
  };
  return newObj;
}


export const updatePassword = (req, res) => {
  if (req.body.newpassword != req.body.confirmpassword) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("NEW_AND_CONFIRM_PASSWORD_ARE_DIFFERENT") });
  }

  Driver.findById(req.userId, function (err, docs) {
    if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    else {
      if (!docs) return res.status(409).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") });
      var newDoc = Driver();
      var passwordIsValid = newDoc.validPassword(req.body.oldpassword, docs.salt, docs.hash);
      if (!passwordIsValid) return res.status(409).json({ 'success': false, 'message': req.i18n.__("INVALID_PASSWORD") });
      var obj = newDoc.getPassword(req.body.newpassword);
      var update = {
        salt: obj.salt,
        hash: obj.hash
      }
      Driver.findOneAndUpdate({ _id: req.userId }, update, { new: false }, (err, doc) => {
        if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
        return res.json({ 'success': true, 'message': req.i18n.__("PASSWORD_UPDATED") });
      })
    }
  });

}

export const updateAppData = async (req, res) => {
  // req.body.profile = req['file'].path;
  // var updatedata =  {
  //   fname: req.body.fname ,
  //   profile : req['file'].path
  // }

  // Driver.findOneAndUpdate({ _id:"5acb773fba44003b4b24d5d1" },  updatedata , { new:false }, (err,doc) => {
  //   if(err){
  //     return res.json({'success':false,'message':"SOME_ERROR",'error':err});
  //   }
  //   return res.json({'success':true,'message':'Profile Updated Successfully', "request" : req.body  });
  //   // return res.json({'success':true,'message':'Profile Updated Successfully', "request" : req.body ,  'fileurl' : config.baseurl + req['file'].path });
  // })
  var DriverData = await Driver.findOne({ '_id': { $ne: req.userId }, 'email': req.body.email })
  if (req.body.email && DriverData) {
    return res.status(401).json({ 'success': false, 'message': "Email already Exists" });
  }

  var filename = "";
  var filepath = "";
  if (req['file'] != null) {
    req.body.profile = req['file'].path;
    filename = req['file'].filename;
    filepath = req['file'].path;
  } else { }

  var isStarExistsInEmail = GFunctions.isStarExistsInString(req.body.email);

  var updateData = {
    fname: req.body.fname,
    lname: req.body.lname,
    nic: req.body.nic,
  };

  if (!isStarExistsInEmail) updateData.email = req.body.email;

  if (filepath) {
    updateData.profile = filepath;
  }

  Driver.findOneAndUpdate({ _id: req.userId }, updateData, { new: true }, (err, doc) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    if (filepath == "") { filepath = doc.profile; }
    return res.json({ 'success': true, 'message': req.i18n.__("PROFILE_UPDATED_SUCCESSFULLY"), "request": req.body, 'fileurl': config.baseurl + filepath });

    // return res.json({'success':true,'message':'File added successfully', 'file' : req['file'],  'fileurl' : config.baseurl + req['file'].path ,   'request' : req.body ,   'driverstatus' : doc.status  });
  })
}

/**
 * Get driver Card Details
 * @input
 * @param
 * @return
 * @response
 */
export const driverBankDetails = (req, res) => {
  DriverBank.find({ driverId: req.userId }, { trx: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    if (docs.length) {
      return res.json({ "bankDetails": docs[0].bank });
    }
    else {
      return res.json({ "bankDetails": { "email": "", "holdername": "", "acctNo": "", "banklocation": "", "bankname": "", "swiftCode": "" } });
    }
  })
}



/**
 * POST driver driverBankTransaction Card Details
 * @input
 * @param
 * @return
 * @response
 */
export const driverBankTransaction = (req, res) => {
  DriverBankTransaction.findOne({ dvrid: req.userId }, function (err, doc) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    else if (!doc) {

      //Add New Wallet Details
      var newDoc = new DriverBankTransaction(
        {
          dvrid: req.userId,
          bal: 0,
          trx: {
            trxid: req.body.dcid,
            amt: req.body.amt
          }
        }
      );
      newDoc.save((err, doc) => {
        if (err) {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
        } else {
          return res.json({ 'success': true, 'message': req.i18n.__("TRANSACTION_ADDED"), 'docs': doc });
        }
      })
      //Add New Wallet Details

    } else if (doc) {

      var traxdetails = {
        trxid: req.body.dcid,
        amt: req.body.amt
      }


      DriverBankTransaction.findOne({ dvrid: req.userId, 'trx.trxid': req.body.dcid }, {
      },
        function (err, doc2) {
          if (err) {
            return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
          }
          if (doc2) {

            //If this Tranx is Old
            DriverBankTransaction.findOneAndUpdate({ dvrid: req.userId, 'trx.trxid': req.body.dcid }, {
              $set: { 'trx.$.trxid': req.body.dcid, 'trx.$.amt': req.body.amt },
            }, { 'new': true },
              function (err, doc2) {
                if (err) {
                  return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
                }
                return res.json({ 'success': true, 'message': req.i18n.__("TRANSACTION_ADDED"), 'docs': doc2 });
              }
            );

          } else {
            //If this Tranx is new
            DriverBankTransaction.findOneAndUpdate({ dvrid: req.userId }, {
              $push: { trx: traxdetails }
            }, { 'new': true },
              function (err, doc3) {
                if (err) {
                  return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
                }
                return res.json({ 'success': true, 'message': req.i18n.__("TRANSACTION_ADDED"), 'docs': doc3 });
              }
            );

          }

        }
      );


    }
  })
  // 1.chk Wallet

}

export const newDriverBankTransactions = (req, res) => {
  var tranxDate = moment(req.body.date, 'DD-MM-YYYY').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  var filepath = '';
  if (req['file'] != null) {
    filepath = req['file'].path;
  }

  // var tranxDate = req.body.date;
  DriverBankTransaction.findOne({ dvrid: req.userId }, function (err, doc) {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    else if (!doc) {
      //Add New Wallet Details
      var newDoc = new DriverBankTransaction(
        {
          dvrid: req.userId,
          bal: 0,
          trx: {
            trxid: req.body.trxid,
            amt: req.body.amt,
            packageId: req.body.packageId,
            packageName: req.body.packageName,
            isVerified: false,
            date: tranxDate,
            filepath: filepath,
          }
        }
      );
      newDoc.save((err, doc) => {
        if (err) {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
        } else {
          return res.json({ 'success': true, 'message': req.i18n.__("TRANSACTION_ADDED") });
        }
      })
      //Add New Wallet Details

    } else if (doc) {

      var traxdetails = {
        trxid: req.body.trxid,
        amt: req.body.amt,
        packageId: req.body.packageId,
        packageName: req.body.packageName,
        date: tranxDate,
        isVerified: false,
        filepath: filepath,
      }

      DriverBankTransaction.findOne({ dvrid: req.userId, 'trx.trxid': req.body.trxid }, {
      },
        function (err, doc2) {
          if (err) {
            return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
          }
          if (doc2) {
            //If this Tranx is Old
            DriverBankTransaction.findOneAndUpdate({ dvrid: req.userId, 'trx.trxid': req.body.trxid }, {
              $set: {
                'trx.$.trxid': req.body.trxid, 'trx.$.amt': req.body.amt, 'trx.$.packageId': req.body.packageId,
                'trx.$.packageName': req.body.packageName, 'trx.$.date': tranxDate, 'trx.$.filepath': filepath
              },
            }, { 'new': true },
              function (err, doc2) {
                if (err) {
                  return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
                }
                return res.json({ 'success': true, 'message': req.i18n.__("TRANSACTION_ADDED") });
              }
            );

          } else {
            //If this Tranx is new
            DriverBankTransaction.findOneAndUpdate({ dvrid: req.userId }, {
              $push: { trx: traxdetails }
            }, { 'new': true },
              function (err, doc3) {
                if (err) {
                  return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
                }
                return res.json({ 'success': true, 'message': req.i18n.__("TRANSACTION_ADDED") });
              }
            );

          }
        }
      );
    }
  })
  // 1.chk Wallet

}

export const transactionVerified = (req, res) => {

  DriverBankTransaction.findOneAndUpdate(
    { trx: { $elemMatch: { _id: req.params.id } } },
    { $set: { "trx.$.isVerified": true } }, { multi: true }
    , function (err, doc) {
      if (err) {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
      }

      return res.json({ 'success': true, 'message': req.i18n.__("TRANSACTION_ADDED"), 'docs': doc });
    });
}
// Driver Earnings

/**
 * myEarningsDriver
 * @param  {[type]} match      [description]
 * @param  {[type]} groupbyval [description]
 * @return {[promise]}            [description]
 */
export const myEarningsDriver = (match, groupbyval, date) => {
  return new Promise(function (resolve, reject) {
    DriverPayment.aggregate([
      match,
      { $group: groupbyval },
      {
        "$project": {
          id: 1,
          amttopay: "$amttopay",
          commision: "$commision",
          nos: "$nos",
          date: moment(date).format('LL'),
          type: 'Days'
        }
      }
    ], function (err, result) {
      if (err) {
        resolve(0);
      } else {
        resolve(result[0]);
      }
    });
  })
}

export const myEarningsDriverBasicSplits = (match, groupbyval) => {
  return new Promise(function (resolve, reject) {
    DriverPayment.aggregate([
      match,
      { $group: groupbyval }
    ], function (err, result) {
      if (err) {
        resolve(0);
      } else {
        if (result.length) {
          resolve(result[0].totalAmount);
        }
        resolve(0);
      }
    });
  })
}
// Driver Earnings

//From Admin

/**
 * Change Driver Taxi Status
 * @input
 * @param  taxistatus { active / inactive }
 * @return
 * @response
 */
export const putDrivertaxisStatus = async (req, res) => {
  if (req.body.taxistatus == "active") {
    var DriverData = await Driver.findOne({ "_id": req.body.driverid }).exec();
    var driverTaxiDocs = DriverData.taxis.id(req.body.makeid);
    if (driverTaxiDocs.registration == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Driver Taxi Registration Certificate (RC)." }); }
    else if (driverTaxiDocs.registrationBack == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Fitness Certificate." }); }
    else if (driverTaxiDocs.permit == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Taxi Permit." }); }
    else if (driverTaxiDocs.insurance == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Taxi Insurance." }); }
  }

  Driver.findById(req.body.driverid, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    var taxi = docs.taxis.id(req.body.makeid);
    taxi.taxistatus = req.body.taxistatus;
    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
      updateSetCurrentTaxi(req.body.driverid, req.body.makeid, req.body.taxistatus);
      updateTaxiProofStatusInFB(req.body.driverid, req.body.makeid, req.body.taxistatus);
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'drivertaxis': docs.taxis });
    });
  });
}

function updateTaxiProofStatusInFB(driverid, vehicleid, taxistatus) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("vehicle_list");
  var FBstatus = "0";
  if (taxistatus == "active") { FBstatus = "1"; };
  var requestData = {
    status: FBstatus
  };
  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);
  usersRef.update(requestData);
}

function updateSetCurrentTaxi(driverid, vehicleid, taxistatus) {

  Driver.findById(driverid, function (err, docs) {
    if (err) { };
    if (!docs) { };
    if (docs.currentTaxi == vehicleid) {
      docs.serviceStatus = taxistatus;
      docs.save(function (err, op) {
        if (err) { }
        console.log('Taxi Changed successfully');
      });
    }

  });

}

/**
 * Set Active for Driver Proof in Both Mongo and Firebase
 * @input
 * @param
 * @return
 * @response
 */
export const driverProofStatus = (req, res) => {
  // var update  =  {
  //   // $set:{"status[0].docs": req.body.status }
  //   phcode : req.body.status
  // }
  // Driver.findOneAndUpdate({ _id:req.body.driverid ,   "status._id" : '5b067082d50e7c29f226ff0f' } , {  "status.$.docs"  : req.body.status }  , { new:true }, (err, doc ) => {
  Driver.findOneAndUpdate({ _id: req.body.driverid, "status.docs": 'pending' }, { "status.$.docs": req.body.status }, { new: true }, (err, doc) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") }); }
    updateDriverProofStatusInFB(req.body.driverid, req.body.status);
    // var msg = notificationContent[notificationContent.defaultLanguage]['proofStatus'] + config.appName;
    // smsGateway.sendSmsMsg(docs.phone, '', docs.phcode, msg)
    // sendSmsMsg(doc.phone, 'Your Account was Activated. Thank You.' + config.appName);
    return res.json({ 'success': true, 'message': req.i18n.__("STATUS_CHANGED_SUCCESSFULLY"), doc });
  })
}

function updateDriverProofStatusInFB(driverid, status) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
    proof_status: status
  };
  if (status == "pending") { requestData["online_status"] = "0" }
  var child = driverid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);

  usersRef.update(requestData, function (error) {
    if (error) { logger.error(error); } else {
      console.log(child, "New Request");
    }
  });

}


/**
 * Send OTP to Email
 * @input
 * @param
 * @return
 * @response
 */
//  export const driverForgotPassword = (req,res) => {
//    Driver.findOne({ email: req.body.phone } , function ( err, docs) {
//     if(err) { return res.status(409).json({'success':false,'message':req.i18n.__(Some Error','error':err});    }
//     else if(!docs){
//       return res.status(409).json({'success':false,'message':'Phone No is Invalid..'});
//     }
//     else{
//       var OTP =  crypto.randomBytes(3).toString('hex');
//       docs.fcmId  = OTP;
//       // sendOTPToMail(req.body.phone,OTP);
//       sendSmsMsg(req.body.phone, 'Your Password Reset Code is ' + OTP + ' Thank You. 24-7taxilk.com');
//       docs.save(function(err, op) {
//         if(err) { return res.status(409).json({'success':false,'message':"SOME_ERROR",'error':err}); }
//         else { return res.json({ 'success': true, 'message':'OTP send to phone no...' , 'OTP' : OTP  }) }
//       })

//     }
//   });
// }

/**
 * Reset Password
 * @input
 * @param
 * @return
 * @response
 */
export const driverResetPassword = (req, res) => {

  Driver.findOne({ phone: req.body.phone }, function (err, docs) {
    if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
    else if (!docs) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("PHONE_NO_IS_INVALID") });
    }
    else {
      docs.setPassword(req.body.password);
      docs.save(function (err, op) {
        if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
        else { return res.json({ 'success': true, 'message': req.i18n.__("PASSWORD_RESETED") }) }
      })

    }
  });

}


function sendOTPToMail(mailid, otp) {
  const nodemailer = require('nodemailer');

  let smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: 'abservetech.smtp@gmail.com',
      pass: 'smtp@345'
    }
  };
  // 'host' => 'ssl://smtp.gmail.com', 'port' => 465, 'username' => 'abservetech.smtp@gmail.com', 'password' => 'smtp@345', 'transport' => 'Smtp'
  let transporter = nodemailer.createTransport(smtpConfig);

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Admin " <abservetech.smtp@gmail.com>', // sender address
    to: mailid, // list of receivers
    subject: 'Password Reset', // Subject line
    text: 'Please use this OTP to Reset Password', // plain text body
    html: otp // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return logger.error(error);
    }
    return logger.info('Message sent: %s', info.messageId);
  });
  // });

}


export const getDrivertaxis = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;
  Driver.aggregate([
    { $unwind: "$taxis" },
    {
      $group:
      {
        _id: null,
        taxis: { $push: "$taxis" }
      }
    },
    { "$skip": pageQuery.skip },
    { "$limit": pageQuery.take },
  ], function (err, result) {
    if (err) {
      logger.error(err);
      return;
    }
    return res.json(result[0].taxis);
  });
}


/**
 * List the online drivers
 */
export const getOnlineDriver = async (req, res) => {
  /*   var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    var totalCount = 10;
    likeQuery['online'] = 1;
    Driver.find(likeQuery).count().exec((err, cnt) => {
      if (err) { }
      totalCount = cnt;
    });
 
    Driver.find(likeQuery, { "pwd": 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec((err, docs) => {
      if (err) {
        return res.json([]);
      }
      res.header('x-total-count', totalCount);
      res.send(docs);
    }); */

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  likeQuery['online'] = 1;
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$in": req.query.scity_like };
  if (req.type == 'company') likeQuery['cmpy'] = { "$in": req.userId };
  if (likeQuery["taxis.model"]) {
    likeQuery['$or'] = [{ "taxis.vehicletype": likeQuery["taxis.model"] }, { "taxis.model": likeQuery["taxis.model"] }];
    delete likeQuery["taxis.model"];
  }

  let TotCnt = Driver.find(likeQuery).count();
  let Datas = Driver.find(likeQuery, { "hash": 0, "salt": 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}


export const noCreditDrivers = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$in": req.query.scity_like };
  if (req.type == 'company') likeQuery['cmpy'] = { "$in": req.userId };
  if (likeQuery["taxis.model"]) {
    likeQuery['$or'] = [{ "taxis.vehicletype": likeQuery["taxis.model"] }, { "taxis.model": likeQuery["taxis.model"] }];
    delete likeQuery["taxis.model"];
  }
  likeQuery['$or'] = [{ "isSubcriptionActive": false }, { "wallet": { $lt: 0 } }];

  let TotCnt = Driver.find(likeQuery).count();
  let Datas = Driver.find(likeQuery, { "hash": 0, "salt": 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}


/**
 * Reset Password   driverResetPasswordFromAdmin
 * @input
 * @param
 * @return
 * @response
 */
export const driverResetPasswordFromAdmin = (req, res) => {
  Driver.findById(req.body.driverid, function (err, docs) {
    if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
    else if (!docs) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") });
    }
    else {
      var password = config.resetPasswordTo;
      if (req.params.type == 'change') {
        password = req.body.password;
      }
      docs.setPassword(password);
      docs.save(function (err, op) {
        if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
        else { return res.json({ 'success': true, 'message': req.i18n.__("PASSWORD_RESETED") + password }) }
      })
    }
  });
}

//Bank Transaction
export const getDriverBankTransactions = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  /*   var totalCount = 10;
    DriverBankTransaction.find(likeQuery).count().exec((err, cnt) => {
      if (err) { }
      totalCount = cnt;
    });
 
    DriverBankTransaction.aggregate([
      {
        "$lookup": {
          "localField": "dvrid",
          "from": "drivers",
          "foreignField": "_id",
          "as": "userinfo"
        }
      },
      { "$unwind": "$userinfo" },
      {
        "$project": {
          "_id": 1,
          "dvrid": 1,
          "trx": 1,
          "bal": 1,
          "userinfo.fname": 1,
          "userinfo.phone": 1
        }
      },
      { "$skip"  : pageQuery.skip },
      { "$limit" : pageQuery.take },
    ], function (err, result) {
      if (err) {
        return res.json([]);
      }
      res.header('x-total-count', totalCount);
      return res.json(result);
    }); */
  // let TotCnt = DriverBankTransaction.find(likeQuery).count();
  let TotCnt = DriverBankTransaction.aggregate([
    {
      "$lookup": {
        "localField": "dvrid",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "trx": 1,
        "userinfo.fname": 1,
        "userinfo.phone": 1,
        "userinfo.code": 1,
        'scity': '$userinfo.scity',
        'scId': '$userinfo.scId'
      }
    },
    { "$match": likeQuery },
  ]);

  let Datas = DriverBankTransaction.aggregate([
    {
      "$lookup": {
        "localField": "dvrid",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "_id": 1,
        "dvrid": 1,
        "trx": 1,
        "bal": 1,
        "userinfo.fname": 1,
        "userinfo.phone": 1,
        "userinfo.code": 1,
        'scity': '$userinfo.scity',
        'scId': '$userinfo.scId'
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    { "$skip": pageQuery.skip },
    { "$limit": pageQuery.take },
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }

}


//Bank Transaction
export const getDriverBankTransactionsLedger = async (req, res) => {
  let Datas = DriverBankTransaction.aggregate([
    { "$match": { dvrid: req.params.id } },

    {
      "$lookup": {
        "localField": "dvrid",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "_id": 1,
        "dvrid": 1,
        "trx": 1,
        "bal": 1,
        "userinfo.fname": 1,
        "userinfo.phone": 1,
        "userinfo.code": 1
      }
    },

  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }

}



//Bank Transaction Ledger for App
export const driverBankTransactionsLedgerApp = async (req, res) => {
  let Datas = DriverBankTransaction.aggregate([
    { "$match": { dvrid: req.userId } },
    { "$unwind": "$trx" },
    {
      "$project": {
        "_id": 1,
        "dvrid": 1,
        "bal": 1,
        "trx": 1
      }
    },
    { "$sort": { 'trx.date': -1 } },
  ]);
  try {
    var promises = await Promise.all([Datas]);
    var resstr = promises[0];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }

}

/**
 * Update Tranx Details
 * @input
 * @param
 * @return
 * @response
 */
export const approveDriverBankTransactions = (req, res) => {
  DriverBankTransaction.findById(req.body.driverBankTransId, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var tranx = docs.trx.id(req.body.trxId);

    tranx.isVerified = true;
    let Tranxbal = tranx.amt;
    let totalBal = parseFloat(parseFloat(docs.bal) + parseFloat(Tranxbal)).toFixed(2);
    docs.bal = totalBal;
    addDriverBalanceDatatoFb(docs.dvrid, totalBal);
    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      // addDrivertaxisDataFB(req.body.driver,req.body.makeid,taxi);
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'drivertaxis': op });
    });

  });
};



function addDriverBalanceDatatoFb(id, bal) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");

  var requestData = {
    wallet_balance: bal
  };

  requestData = GFunctions.convertAllNumbersToString(requestData);

  var child = (id).toString();
  var usersRef = ref.child(child);

  usersRef.update(requestData, function (error) {
    if (error) {
      logger.error(error);
    } else {
      // findAndSendFCMToDriver(child, "New Request");
    } // Send FCM
  });
}


/**
 * Update Tranx Details
 * @input
 * @param
 * @return
 * @response
 */
export const debitDriverBankTransactions = (driverID, Totalamount = 0, tripId, commision, forTrip = true, type = 'Debit') => {
  DriverBankTransaction.findOne({ dvrid: driverID }, function (err, doc) {
    if (err) { }
    else if (!doc) {

      //Add New Wallet Details
      var newDoc = new DriverBankTransaction(
        {
          dvrid: driverID,
          bal: Totalamount ? Totalamount : 0,
          trx: {
            trxid: tripId,
            amt: commision,
            type: type,
            isVerified: true,
            forTrip: forTrip,
          }
        }
      );
      newDoc.save((err, doc) => {
        if (err) { } else { }
      })
      //Add New Wallet Details

    } else if (doc) {

      var traxdetails = {
        trxid: tripId,
        amt: commision,
        type: type,
        isVerified: true
      }

      DriverBankTransaction.findOneAndUpdate({ dvrid: driverID }, {
        $push: { trx: traxdetails }
      }, { 'new': true },
        function (err, doc) {
          if (err) {
            return console.log(err)
          }
          console.log(doc)
          debitDriverBankTransactionsBal(driverID, commision, type);
        }
      );

    }
  })
  // 1.chk Wallet

};

function debitDriverBankTransactionsBal(driverID, amount, type) {
  DriverBankTransaction.findOne({ dvrid: driverID }, function (err, docs) {
    if (err) { }
    let Tranxbal = amount;
    var totalBal;
    if (type == 'Debit') {
      totalBal = parseFloat(docs.bal) - parseFloat(Tranxbal);//Reducing commision amount
    }
    if (type == 'Credit') {
      totalBal = parseFloat(docs.bal) + parseFloat(Tranxbal);//Add Total amount
    }
    totalBal = totalBal.toFixed(2);
    totalBal = parseFloat(totalBal);
    docs.bal = totalBal;
    // addDriverBalanceDatatoFb(driverID, totalBal);
    docs.save(function (err, op) {
      if (err) { }
      console.log('debitDriverBankTransactionsBal');
    });
  });
};

export const setOnlineStatus = (req, res) => {
  var update = {
    online: req.body.status
  }
  Driver.findOneAndUpdate({ _id: req.body.driverId }, update, { new: false }, (err, doc) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    if (req.body.status == 0) {
      updateOnlineInFB(0, req.body.driverId, doc.curService);
      return res.json({ 'success': true, 'message': req.i18n.__("OFFLINE") });
    }
    updateOnlineInFB(1, req.body.driverId, doc.curService);
    verifyCurTripStatus(doc);
    if (featuresSettings.updateDriverPerDayOnlineTime) {
      updateDriverPerDayOnlineTime(req.userId, req.body.status);
    }
    return res.json({ 'success': true, 'message': req.i18n.__("ONLINE") });
  })
}

export const verifyCurTripStatus = async (doc) => {
  if (doc && doc.curTrip && doc.curStatus != "free") {
    var trips = await Trips.findOne({ 'dvrid': doc._id, 'tripno': doc.curTrip }, { 'status': 1 });
    if (trips && trips.status != "Progress" || trips.status != "accepted") {
      var updateDriverStatus = await Driver.findOneAndUpdate({ "_id": doc._id }, { 'curStatus': "free", curTrip: "" })
    }
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
  freeTheDriver(req.params.id);
  Driver.findById(req.params.id, function (err, docs) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    if (!docs) return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") });

    var taxi = docs.taxis.id(req.body.makeid);
    var obj = "";
    docs.currentTaxi = req.body.makeid;
    docs.curService = taxi.vehicletype;
    // docs.curService = taxi.vehicletype;
    docs.serviceStatus = taxi.taxistatus;
    docs.share = taxi.share;
    docs.noofshare = taxi.noofshare;
    docs.curVehicleNo = taxi.registrationnumber;
    docs.others1 = taxi.others1;

    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      else {
        removeDriver_loc_node(taxi.vehicletype, req.params.id);
        return res.json({ 'success': true, 'message': req.i18n.__("TAXI_CHANGED_SUCCESSFULLY") });

      }
    });
  });
}



export const removeDriver_loc_node = (vehicleName, driverId) => {

  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_location").child(vehicleName).child(driverId.toString());
  ref.remove((data) => {
    console.log(data)
  });

}

function freeTheDriver(driverid) {
  Driver.findByIdAndUpdate(driverid, {
    'curStatus': 'free'
  }, { 'new': true },
    function (err, doc) {
      if (err) { }
    }
  );
}

export const setBulkOnlineStatus = (req, res) => {

}

export const updateOnlineInFB = (status, driverId, type, updateOnlineStatus = true) => {
  type = type.toLowerCase();
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();

  var ref = db.ref("drivers_data");

  status = parseInt(status);
  if (status) {
    var requestData = {
      online_status: "1"
    };
  } else {
    var requestData = {
      online_status: "0"
    };
  }

  var child = (driverId).toString();
  var usersRef = ref.child(child);

  if (updateOnlineStatus) {
    usersRef.update(requestData, function (error) {
      if (error) {
        logger.error(error);
      } else {
        // findAndSendFCMToDriver(child, "New Request");
      } // Send FCM
    });
  }

  if (type) {
    var ref = db.ref("drivers_location");
    /*  var requestData = {
       online_status: status
     }; */

    var requestData = {
      '0': 0,
      '1': 0
    };
    var type = type.toString();
    var driverid = driverId.toString();
    var usersRef = ref.child(type).child(driverid).child('l');
    usersRef.update(requestData, function (error) {
      if (error) {
        logger.error(error);
      } else {
        // findAndSendFCMToDriver(child, "New Request");
      } // Send FCM
    });


    var usersRefRental = ref.child('rental').child(driverid).child('l');
    usersRefRental.update(requestData, function (error) {
      if (error) {
        logger.error(error);
      } else {
        // findAndSendFCMToDriver(child, "New Request");
      } // Send FCM
    });

    var usersRefOutstation = ref.child('outstation').child(driverid).child('l');
    usersRefOutstation.update(requestData, function (error) {
      if (error) {
        logger.error(error);
      } else {
        // findAndSendFCMToDriver(child, "New Request");
      } // Send FCM
    });


  }
}



export const getMinimumBalance = (req, res) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("DriversWallet");
  var usersRef = ref.child('minimum_amount');
  usersRef.once("value").then(function (snapshot) {
    return res.json({ 'success': true, 'balance': snapshot.val() });
  });
};

export const putMinimumBalance = (req, res) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("DriversWallet");
  var balance = parseInt(req.body.balance);

  var requestData = {
    'minimum_amount': balance
  };

  requestData = GFunctions.convertAllNumbersToString(requestData);

  ref.update(requestData, function (error) {
    if (error) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error });
    } else {
      return res.json({ 'success': true, 'message': req.i18n.__("MINIMUN_BALANCE_UPDATED") });
    } // Send FCM
  });
};

//Find Drivers
export const getNearByDrivers = (req, res) => {
  var triptype = req.body.triptype;
  var requestRadius = config.requestRadius;
  if (triptype == 'rental') requestRadius = config.rentalRequestRadius ? config.rentalRequestRadius : config.requestRadius;
  if (triptype == 'outstation') requestRadius = config.outstationRequestRadius ? config.outstationRequestRadius : config.requestRadius;
  var neededService = req.body.serviceName;

  if (!req.body.pickupLng || !req.body.pickupLat) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("PLEASE_SELECT_PICKUP_LOCATION") });
  }

  var driverFind = {
    /*coords: {
      $geoWithin: {
        $centerSphere: [[parseFloat(req.body.pickupLng), parseFloat(req.body.pickupLat)],
        requestRadius / 3963.2]
      },
    },*/
    online: true, curStatus: "free",
    curService: new RegExp(neededService, 'i'),
  };


  if (featuresSettings.redTaxiModel) {
    if (triptype == 'rental') {
      driverFind["taxis"] = { $elemMatch: { vehicletype: neededService, isRental: true } }
    } else if (triptype == 'outstation') {
      // driverFind["taxis.isOutstation"] = true;
      driverFind["taxis"] = { $elemMatch: { vehicletype: neededService, isOutstation: true } }
    } else if (triptype == 'daily') {
      // driverFind["taxis.isDaily"] = true;
      driverFind["taxis"] = { $elemMatch: { vehicletype: neededService, isDaily: true } }
    }
  }


  if (featuresSettings.lowerCategoryCanUse.sedanToMini) {
    //if (neededService.toLowerCase() == "mini") {
    delete driverFind["curService"];
    delete driverFind['taxis'];
    // if (triptype == 'rental') {
    //   driverFind['$or'] = [{ '$and': [{ 'isMini': true }, { taxis: { '$elemMatch': { vehicletype: 'Sedan', 'isRental': true } } }] }, { '$and': [{ 'curService': 'Mini' }, { taxis: { '$elemMatch': { vehicletype: 'Mini', 'isRental': true } } }] }]
    // } else if (triptype == 'outstation') {
    //   driverFind['$or'] = [{ '$and': [{ 'isMini': true }, { taxis: { '$elemMatch': { vehicletype: 'Sedan', 'isOutstation': true } } }] }, { '$and': [{ 'curService': 'Mini' }, { taxis: { '$elemMatch': { vehicletype: 'Mini', 'isOutstation': true } } }] }]
    // } else if (triptype == 'daily') {
    //   driverFind['$or'] = [{ '$and': [{ 'isMini': true }, { taxis: { '$elemMatch': { vehicletype: 'Sedan', 'isDaily': true } } }] }, { '$and': [{ 'curService': 'Mini' }, { taxis: { '$elemMatch': { vehicletype: 'Mini', 'isDaily': true } } }] }]
    // }
    if (triptype == 'rental') {
      driverFind['$or'] = [
        { '$and': [{ currentCategoryOptions: { "$in": [neededService] }, 'isRental': true }, { taxis: { '$elemMatch': { 'isRental': true } } }] },
        { '$and': [{ 'curService': neededService }, { taxis: { '$elemMatch': { vehicletype: neededService, 'isRental': true } } }] }]
    } else if (triptype == 'outstation') {
      driverFind['$or'] = [
        { '$and': [{ currentCategoryOptions: { "$in": [neededService] }, 'isOutstation': true }, { taxis: { '$elemMatch': { 'isOutstation': true } } }] },
        { '$and': [{ 'curService': neededService }, { taxis: { '$elemMatch': { vehicletype: neededService, 'isOutstation': true } } }] }]
    } else if (triptype == 'daily') {
      driverFind['$or'] = [
        { '$and': [{ currentCategoryOptions: { "$in": [neededService] }, 'isDaily': true }, { taxis: { '$elemMatch': { 'isDaily': true } } }] },
        { '$and': [{ 'curService': neededService }, { taxis: { '$elemMatch': { vehicletype: neededService, 'isDaily': true } } }] }]
    }
    //}
  }
  var maxDistanceInMeter = Number(requestRadius) * 1000;
  var pipeline1 = {
    "$geoNear": {
      "near": {
        "type": "Point",
        "coordinates": [parseFloat(req.body.pickupLng), parseFloat(req.body.pickupLat)]
      },
      "maxDistance": maxDistanceInMeter,
      "spherical": true,
      "distanceField": "distance",
      // "distanceMultiplier": 0.000621371
    }
  };
  //console.log('pipeline1',JSON.stringify(pipeline1));
  Driver.aggregate([
    pipeline1,
    {
      "$match": driverFind
    },
    {
      "$project": {
        "_id": "$_id",
        "fname": "$fname",
        "code": "$code",
        "coords": "$coords",
        "phone": "$phone",
        "distance": "$distance",
        "online": "$online",
        "curStatus": "$curStatus",
        "curService": "$curService"
      }
    }
  ]).exec((err, driverdata) => {

    // Driver.find(driverFind).exec((err, driverdata) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    if (driverdata.length <= 0) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") });
    } else {
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("DRIVER_FOUND"), 'drivers': driverdata });
    }
  });
}


export const checkDriverHasThatServiceMTD = (req, res, next) => {
  if (req.body.driverAssignmentType != 'manual-assign') {
    return next();
  }
  var triptype = req.body.tripType;
  var neededService = req.body.serviceType;

  var driverFind = {
    _id: mongoose.Types.ObjectId(req.body.driverId)
  };


  if (featuresSettings.lowerCategoryCanUse.sedanToMini) {
    delete driverFind["curService"];
    if (triptype == 'rental') {
      driverFind['$or'] = [
        { '$and': [{ currentCategoryOptions: { "$in": [neededService] }, 'isRental': true }, { taxis: { '$elemMatch': { 'isRental': true } } }] },
        { '$and': [{ 'curService': neededService }, { taxis: { '$elemMatch': { vehicletype: neededService, 'isRental': true } } }] }]
    } else if (triptype == 'outstation') {
      driverFind['$or'] = [
        { '$and': [{ currentCategoryOptions: { "$in": [neededService] }, 'isOutstation': true }, { taxis: { '$elemMatch': { 'isOutstation': true } } }] },
        { '$and': [{ 'curService': neededService }, { taxis: { '$elemMatch': { vehicletype: neededService, 'isOutstation': true } } }] }]
    } else if (triptype == 'daily') {
      driverFind['$or'] = [
        { '$and': [{ currentCategoryOptions: { "$in": [neededService] }, 'isDaily': true }, { taxis: { '$elemMatch': { 'isDaily': true } } }] },
        { '$and': [{ 'curService': neededService }, { taxis: { '$elemMatch': { vehicletype: neededService, 'isDaily': true } } }] }]
    }
  }
  Driver.aggregate([
    {
      "$match": driverFind
    },
    {
      "$project": {
        "_id": "$_id",
        "fname": "$fname",
        "code": "$code",
        "coords": "$coords",
        "phone": "$phone",
        "distance": "$distance",
        "online": "$online",
        "curStatus": "$curStatus",
        "curService": "$curService"
      }
    }
  ]).exec((err, driverdata) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    if (driverdata.length <= 0) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_SERVICE_NOT_ENABLED") });
    } else {
      next();
    }
  });
}

export const getDriverTypeahead = (req, res) => {
  // Driver.find({ $or: [{ fname: new RegExp(req.body.fname, 'i') }] }, { '_id': 1, 'phone': 1, 'fname': 1, 'lname': 1, 'email': 1, 'code': 1 }, { "pwd": 0 }).limit(10).exec((err, docs) => {
  //   if (err) {
  //     return res.status(401).json({ 'success': false, 'message': 'No User Found' });
  //   }
  //   if (!docs) return res.status(401).json({ 'success': false, 'message': 'No User Found' });
  //   return res.status(200).json({ 'success': true, 'users': docs });
  // });

  Driver.find({}, { '_id': 1, 'phone': 1, 'fname': 1, 'lname': 1, 'email': 1, 'code': 1 }).exec((err, docs) => {
    if (err) {
      return res.status(401).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") });
    }
    if (!docs) return res.status(401).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") });
    return res.status(200).json({ 'success': true, 'users': docs });
  });
};

export const setinactivedrivers = (req, res) => {
  var time = req.body.dateless;//In ISO format
  //Also Make him offline in Mongo
  Driver.update(
    {
      $or: [
        { lastUpdate: { $lt: new Date(time) } }, { lastUpdate: null }
      ]
    }, { online: 0 }, { multi: true }, function (err, res) {
      if (err) { }
    })

  Driver.find(
    {
      $or: [
        { lastUpdate: { $lt: new Date(time) } }, { lastUpdate: null }
      ]
    }
    , { _id: 1, curService: 1 }).exec((err, docs) => {
      if (err) {
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }

      docs.forEach(element => {
        updateOnlineInFB(0, element._id, element.curService);
      });

      return res.json({ 'success': true, 'message': req.i18n.__("MAKING_OFFLINE_REQUEST_HAS_BEEN_PROCESSING"), docs });
    });
}
//From Admin



//for driver to make inactive driver

export const driverRejected = (req, res) => {
  Driver.findOneAndUpdate({ _id: req.body.driverid, "status.docs": { "$in": ['Accepted', 'pending'] } }, { "status.$.docs": req.body.status, online: false }, { new: true }, (err, doc) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") }); }
    updateDriverProofStatusInFB(req.body.driverid, req.body.status);
    return res.json({ 'success': true, 'message': req.i18n.__("STATUS_CHANGED_SUCCESSFULLY"), doc });
  })
}


export const driverAccepted = async (req, res) => {
  try {
    var driverTaxiData = await Driver.findOne({ _id: req.body.driverid, "taxis.taxistatus": 'active' }).exec();

    if (!driverTaxiData) {
      if (req.body.status == 'Accepted') {
        return res.status(409).json({ 'success': false, 'message': "Please Vertify and Approve Taxi Details First." });
      }
    }

    if (req.body.status == "Accepted") {
      var driverTaxiDocs = await Driver.findOne({ _id: req.body.driverid }).exec();
      if (driverTaxiDocs.insurance == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Driver Address Proof." }); }
      else if (driverTaxiDocs.panCard == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Driver Pan Card." }); }
      else if (driverTaxiDocs.aadhaar == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Driver Aadhar Card." }); }
      else if (driverTaxiDocs.licence == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Driver Licence." }); }
    }

    Driver.findOneAndUpdate({ _id: req.body.driverid, "status.docs": 'pending' },
      { "status.$.docs": req.body.status }, { new: true }, (err, doc) => {
        if (err) {
          return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        }
        if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") }); }
        updateDriverProofStatusInFB(req.body.driverid, req.body.status);
        return res.json({ 'success': true, 'message': req.i18n.__("STATUS_CHANGED_SUCCESSFULLY"), doc });
      })

  } catch (error) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error });
  }
}

export const taxiApproveStatus = async (req, res) => {

  if (req.body.taxistatus == "active") {
    var DriverData = await Driver.findOne({ "_id": req.body.driverid }).exec();
    var driverTaxiDocs = DriverData.taxis.id(req.body.makeid);
    if (driverTaxiDocs.registration == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Driver Taxi Registration Certificate (RC)." }); }
    else if (driverTaxiDocs.registrationBack == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Fitness Certificate." }); }
    else if (driverTaxiDocs.permit == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Taxi Permit." }); }
    else if (driverTaxiDocs.insurance == "") { return res.status(409).json({ 'success': false, 'message': "Please Upload Taxi Insurance." }); }
  }

  var Data = await Driver.findOneAndUpdate({ "_id": req.body.driverid, "taxis._id": req.body.makeid }, { 'taxis.$.taxistatus': req.body.taxistatus }).exec();
  if (Data) {
    updateTaxiProofStatusInFB(req.body.driverid, req.body.makeid, req.body.taxistatus);
    var driverTaxiData = await Driver.findOne({ _id: req.body.driverid, "taxis.taxistatus": 'active' }).exec();
    if (!driverTaxiData) {//if no taxi is active
      Driver.findOneAndUpdate({ _id: req.body.driverid, "status.docs": 'Accepted' },
        { "status.$.docs": "pending" }, { new: true }, (err, doc) => {
          if (err) {
            return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
          }
          if (!doc) { return res.json({ 'success': true, 'message': req.i18n.__("STATUS_CHANGED_SUCCESSFULLY") }); }
          updateDriverProofStatusInFB(req.body.driverid, "pending");
          return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_INACTIVATED") });
        })
    }
    else {
      return res.json({ 'success': true, 'message': req.i18n.__("STATUS_CHANGED_SUCCESSFULLY") });
    }
  }
  else {
    return res.json({ 'success': true, 'message': req.i18n.__("STATUS_NOT_UPDATED") });
  }
}

export const pendingData = async (req, res) => {


  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);


  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  likeQuery['status.docs'] = 'pending';
  if (req.type == 'company') likeQuery['cmpy'] = { "$in": req.userId };
  if (likeQuery["taxis.model"]) {
    likeQuery['$or'] = [{ "taxis.vehicletype": likeQuery["taxis.model"] }, { "taxis.model": likeQuery["taxis.model"] }];
    delete likeQuery["taxis.model"];
  }

  let TotCnt = Driver.find(likeQuery).count();
  let Datas = Driver.find(likeQuery, { "pwd": 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);

    // Driver.find({"status.docs" : 'pending' },(err, docs)=>{
    //   if(err) return res.json({ 'success': false, 'message': "SOME_ERROR", 'error': err })

    //   res.send(docs)
    // })
  }
}


export const driverinactive = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  // let TotCnt = Driver.find(likeQuery).count();
  var populateMatch = {};
  likeQuery['softdel'] = 'inactive';
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$in": req.query.scity_like };
  if (req.type == 'company') likeQuery['cmpy'] = { "$in": req.userId };
  if (likeQuery["cmpy"]) {
    populateMatch = { 'company.name': likeQuery['cmpy'] }
    delete likeQuery["cmpy"];
  }
  if (likeQuery["taxis.model"]) {
    likeQuery['$or'] = [{ "taxis.vehicletype": likeQuery["taxis.model"] }, { "taxis.model": likeQuery["taxis.model"] }];
    delete likeQuery["taxis.model"];
  }

  console.log(likeQuery);
  Driver.aggregate([
    {
      "$match": likeQuery,

    },
    {
      "$lookup": {
        "localField": "cmpy",
        "from": "companydetails",
        "foreignField": "_id",
        "as": "company"
      }
    },
    { "$skip": pageQuery.skip },
    { "$limit": pageQuery.take },
    { "$sort": sortQuery },
    { '$match': populateMatch }
  ], function (err, driverData) {
    if (err) res.json([]);
    if (driverData) {
      res.header('x-total-count', driverData.length);
      res.send(driverData);
    }

  });

}

export const addCancelationAmtToDriver = async (dvrId, tripId) => {
  try {
    let tripData = await Trips.findOne({ tripno: tripId }, { 'csp.driverCancelFee': 1 });
    var amtToDebit = tripData.csp.driverCancelFee;
    updateDriverWalletCredits(dvrId, amtToDebit);
  }
  catch (err) {
    logger.error(err);
  }
}

export const updateDriverWalletCredits = async (dvrId, amtToDebit, trxId = '', forTrip = true) => {
  try {
    let DriverWallet = await Driver.findById(dvrId, { wallet: 1, canceledCount: 1, lastCanceledDate: 1 });
    if (DriverWallet) {
      var newCredits = Number(DriverWallet.wallet);
      if (featuresSettings.driverPayouts.payoutType == 'driverPrepaidWallet') {
        newCredits = Number(DriverWallet.wallet) - Number(amtToDebit);
      }
      if (featuresSettings.driverPayouts.payoutType == 'driverPostpaid') {
        newCredits = Number(DriverWallet.wallet) + Number(amtToDebit);
      }

      newCredits = parseFloat(newCredits).toFixed(2);
      DriverWallet.wallet = newCredits;
      DriverWallet.save()
      updateDriverCreditsInFB(dvrId, newCredits);
      debitDriverBankTransactions(dvrId, 0, trxId, amtToDebit);
    }
  }
  catch (err) {
    logger.error(err);
  }
}


export const driverEarningsBtDate = (req, res) => {
  var driverId = new mongoose.Types.ObjectId(req.userId);
  var baseData = 'tripFDT'; //  tripFDT/createdAt

  if ((req.body.from == '') && (req.body.to == '') && (req.body.type != 'Months')) {
    driverEarningsReport(req, res);
  }
  else if ((req.body.type == 'Months') && (req.body.fromMonth != '')) {
    driverEarningsForMonth(req, res);
  }
  else {
    req.body.to = moment(req.body.to).add(1, 'days').format('YYYY-MM-DD');

    DriverPayment.aggregate([
      { "$match": { "driver": driverId, 'createdAt': { $gte: new Date(req.body.from), $lte: new Date(req.body.to) } } },
      {
        $project:
        {
          _id: 1,
          month: { $month: "$createdAt" },
          amttopay: 1,
          amttodriver: 1,
          commision: 1,
          driver: 1,
          monthYear: {
            $let: {
              vars: {
                string: [, 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUl', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                month: { $month: "$createdAt" },
                year: { $convert: { input: { $year: "$createdAt" }, to: "string" } },
              },
              in: {
                $concat: [{ $arrayElemAt: ['$$string', '$$month'] }, " ", "$$year"]
              }
            }
          },
          mtd: 1
        }
      },
      {
        "$group": {
          "_id": '$month',
          "amttopay": { "$sum": "$amttopay" },
          "amttodriver": { "$sum": "$amttodriver" },
          "commision": { "$sum": "$commision" },
          "nos": { "$sum": 1 },
          "date": { "$first": "$monthYear" },
          "type": { "$first": "Months" },
          "paymentMode": { "$first": "$mtd" }
        }
      },
      { "$sort": { _id: -1 } }
    ], function (err, docs) {
      if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
      // var sortedDistanceArray = docs.sort(GFunctions.dynamicSort("_id")); //In Meters
      return res.json(docs)
    })

  }
}

export const driverEarningsForMonth = (req, res) => {
  var fromMonth = new Date(req.body.fromMonth)
  var fromDate = moment(fromMonth).format("YYYY-MM-DD");
  var toDate = moment(fromDate).add(1, 'M').format('YYYY-MM-DD')
  var driverId = new mongoose.Types.ObjectId(req.userId);
  var baseData = 'tripFDT'; //  tripFDT/createdAt

  DriverPayment.aggregate([
    { "$match": { "driver": driverId, createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) } } },
    {
      $project:
      {
        _id: 1,
        day: { $dayOfMonth: "$createdAt" },
        amttopay: 1,
        amttodriver: 1,
        commision: 1,
        driver: 1,
        mtd: 1
      }
    },
    {
      "$group": {
        "_id": '$day',
        "amttopay": { "$sum": "$amttopay" },
        "commision": { "$sum": "$commision" },
        "nos": { "$sum": 1 },
        "date": { "$first": "$day" },
        "type": { "$first": "Days" },
        "amttodriver": { "$sum": "$amttodriver" },
        "paymentMode": { "$first": "$mtd" }
      }
    },
    { "$sort": { _id: 1 } }
  ], function (err, docs) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }

    for (var x = 0; x < docs.length; x++) {
      if (docs[x].hasOwnProperty('date')) {
        docs[x].date = docs[x]._id + ', ' + req.body.fromMonth;
      }
    }

    return res.json(docs)
  })
}


export const updateDriverCreditsInFB = (driverid, newCredits, subcriptionEndDate = 'NA') => {
  // console.log('updateDriverCreditsInFB',driverid, newCredits, subcriptionEndDate);
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
    credits: newCredits,
  };
  if (subcriptionEndDate != 'NA') {
    requestData.isSubcriptionActive = true;
    subcriptionEndDate = GFunctions.getDateTimeinThisFormat(subcriptionEndDate, "YYYY-MM-DDT00:00:00.00[Z]", "D-M-YYYY");
    requestData.subcriptionEndDate = subcriptionEndDate;
  }
  var child = driverid.toString();
  var usersRef = ref.child(child);
  requestData = GFunctions.convertAllNumbersToString(requestData);
  usersRef.update(requestData);

  usersRef.update(requestData, function (error) {
    if (error) { console.log(error); } else {
      console.log("updateDriverCreditsInFB");
    }
  });

}

export const updateDriverSubscriptionInFB = (driverid, subcriptionEndDate = 'NA', isSubcriptionActive = true) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
  };
  requestData.isSubcriptionActive = isSubcriptionActive;
  requestData.subcriptionEndDate = GFunctions.getDateTimeinThisFormat(subcriptionEndDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]", "D-M-YYYY");;
  var child = driverid.toString();
  var usersRef = ref.child(child);
  requestData = GFunctions.convertAllNumbersToString(requestData);

  usersRef.update(requestData, function (error) {
    if (error) { console.log(error); } else {
      console.log("updateDriverSubscriptionInFB");
    }
  });

}

export const cronInactiveDrivers = () => {
  var time = GFunctions.minusSomeMinToCurrentTime(config.makeDriverOfflineAfterInactive);
  var currentTime = GFunctions.getRespCountryDateTime();
  var whereQ = {
    $or: [
      { lastUpdate: { $lt: new Date(time) } }, { lastUpdate: null }
    ],
    online: 1,
    curStatus: 'free',
  };
  Driver.update(whereQ, { online: 0, lastCron: currentTime }, { multi: true }, function (err, res) {
    if (err) { }
    findDriverAndOfflineHim(currentTime);
  })
}

function findDriverAndOfflineHim(currentTime) {
  Driver.find(
    {
      lastCron: currentTime
    }
    , { _id: 1, curService: 1 }).exec((err, docs) => {
      if (err) { }
      if (docs.length) {
        docs.forEach(element => {
          element.curService = element.curService ? element.curService : 'auto';
          updateOnlineInFB(0, element._id, element.curService, false);
          findAndSendFCMToDriver(element._id, "", 'inactivateIdelDriver');
          updateDriverPerDayOnlineTime(element._id, 0);
        });
      }
    });
}

export const updateDriverEarningAtEveryDay = async (dvrId, totalTripAmount) => {
  try {
    var now = moment();
    var today = now.format("DD-MM-YYYY");

    let DriverDetails = await Driver.findById(dvrId, { todayAmt: 1 });
    if (DriverDetails) {

      var lud = DriverDetails.todayAmt.lastdate;
      var totaltripscount = DriverDetails.todayAmt.trips;
      var totalamtcount = DriverDetails.todayAmt.amt;

      var newTotalCount = 1;
      var newTripAmt = totalTripAmount;

      if (lud == today) {
        newTotalCount = Number(totaltripscount) + 1;
        newTripAmt = Number(totalTripAmount) + Number(totalamtcount);
      }

      Driver.findByIdAndUpdate(dvrId,
        {
          'todayAmt.lastdate': today,
          'todayAmt.trips': newTotalCount,
          'todayAmt.amt': newTripAmt,
        }
        , { new: true }, function (err, docs) {
          if (err) { }
          updateDriverEarningAtEveryDayinFirebase(dvrId, newTotalCount, newTripAmt);
        });

    }
  } catch (error) {
    console.log(err)
  }
}

export const updateDriverEarningAtEveryDayinFirebase = (dvrId, newTotalCount, newTripAmt) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }

  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
    todayTrips: newTotalCount,
    todayEarnings: newTripAmt,
  };
  var child = dvrId.toString();
  var usersRef = ref.child(child);
  requestData = GFunctions.convertAllNumbersToString(requestData);

  usersRef.update(requestData, function (error) {
    if (error) { console.log(error); } else {
      // console.log("updateDriverEarningAtEveryDayinFirebase");
    }
  });
}

/**
 * Driver Forgot Password
*/
export const driverForgotPassword = (req, res) => {
  var message;
  var userName = req.body.email;
  Driver.findOne({ "$or": [{ 'email': userName }, { 'phone': userName }] }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DATA_NOT_FOUND") }) }

    doc.verificationCode = GFunctions.sendRandomizeCode('0', 6)

    doc.save((err, userDoc) => {
      if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
      if (featuresSettings.passwordVerificationMethodForUser == 'email') {
        var data = { name: userDoc.fname, email: userDoc.email, otp: userDoc.verificationCode, url: config.baseurl + 'api/driverChangePassword/' + userDoc.verificationCode + '/' + userDoc._id };
        sendEmail(userDoc.email, data, 'Reset password')
        message = req.i18n.__("PASSWORD_VERIFICATION_CODE_SENT_TO_YOUR_MAIL_SUCCESSFULLY")
      }
      else if (featuresSettings.passwordVerificationMethodForUser == 'sms') {
        smsGateway.sendSmsMsg(userDoc.phone, '', userDoc.phcode, '', 'forgotPasswordDriver', { 'OTPCODE': userDoc.verificationCode });
        message = req.i18n.__("PASSWORD_VERIFICATION_CODE_SENT_TO_YOUR_MOBILE_NUMBER")
      }
      return res.status(200).json({ 'success': true, 'message': message, 'OTP': userDoc.verificationCode })
    })
  })
}

export const changePasswordTemplate = (req, res) => {
  fs.readFile(__dirname + '/html/changePasswordForApp.html', 'utf8', (err, template) => {
    var params = {
      loginRedirectUrl: config.landingurl,
      url: config.baseurl + 'api/driverChangePassword/',
      id: req.params.code + '/' + req.params.id,
    }
    var html = Mustache.render(template, params);
    return res.send(html)
  });
}

export const changePassword = (req, res) => {
  if (req.body.newPwd != req.body.conPwd) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("NEW_AND_CONFIRM_PASSWORD_ARE_DIFFERENT") });
  }

  Driver.findOne({ "_id": req.params.id, "verificationCode": req.params.code }, function (err, docs) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!docs) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("RESET_LINK_EXPIRED") }) }
    var newDoc = Driver();
    var obj = newDoc.getPassword(req.body.newPwd);
    var update = {
      salt: obj.salt,
      hash: obj.hash,
      verificationCode: ''
    }

    Driver.findOneAndUpdate({ "_id": docs._id }, update, { new: false }, (err, doc) => {
      if (err) { return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
      return res.json({ 'success': true, 'message': req.i18n.__("PASSWORD_UPDATED") });
    })
  })
}

export const driverResetPasswordWithOTP = (req, res) => {
  if (req.body.newPwd != req.body.conPwd) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("NEW_AND_CONFIRM_PASSWORD_ARE_DIFFERENT") });
  }
  var userName = req.body.email;
  Driver.findOne({ "$or": [{ 'email': userName }, { 'phone': userName }] }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") }) }
    if (doc.verificationCode != req.body.otp) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") }) }
    var newDoc = Driver();
    var obj = newDoc.getPassword(req.body.newPwd);
    var update = {
      salt: obj.salt,
      hash: obj.hash,
      verificationCode: ''
    }
    Driver.findOneAndUpdate({ "_id": doc._id }, update, { new: false }, (err, doc) => {
      if (err) { return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
      return res.json({ 'success': true, 'message': req.i18n.__("PASSWORD_UPDATED") });
    })
  })
}

/**
 * Driver change Password By App
 * params : userName(email or phone),newPwd, conPwd,otp
*/
export const changePasswordByApp = (req, res) => {
  if (req.body.password != req.body.confirmpassword) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("NEW_CONFIRM_PASSWORD_DIFFERENT") });
  }

  var userName = req.body.email;
  Driver.findOne({ '$or': [{ 'email': userName }, { 'phone': userName }] }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") }) }
    if (doc.verificationCode === "" || doc.verificationCode !== req.body.otp) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("INVALID_OTP!") })
    }

    var newDoc = Driver();
    var obj = newDoc.getPassword(req.body.password);
    var update = {
      salt: obj.salt,
      hash: obj.hash,
      verificationCode: ''
    }

    Driver.findOneAndUpdate({ "_id": doc._id }, update, { new: false }, (err, docs) => {
      if (err) { return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
      return res.json({ 'success': true, 'message': req.i18n.__("PASSWORD_UPDATED") });
    })
  })
}

export const resetDriversPerDayEarnings = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var wholeData = db.ref("drivers_data");
  wholeData.once("value", function (snapshot) {
    snapshot.forEach(function (child) {
      child.ref.update({
        todayTrips: "0",
        todayEarnings: "0",
      });
    });
  });
}


export const resetDriversSubscription2 = async () => {

  var driverIds = [];
  // console.log("Date", new Date())
  var getDriverList = await Driver.find({ isSubcriptionActive: true }, { _id: 1, currentSubId: 1, subcriptionEndDate: 1 }).exec();


  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  getDriverList.map(function (item) {
    var child = item._id.toString();
    var usersRef = ref.child(child);

    usersRef.update({
      subcriptionEndDate: GFunctions.getDateTimeinThisFormat(item.subcriptionEndDate, "YYYY-MM-DDT00:00:00.00[Z]", "D-M-YYYY"),
    }, function (error) {
      if (error) { console.log(error); } else {
        console.log("updateDriverCreditsInFB");
      }
    });
  })

}

//check the today date with the drivers subscription end date
//if enddate cross today date then update [isSubscriptionActive=false and subcriptionEndDate=null]
export const resetDriversSubscription = async () => {

  var driverIds = [], requestData = { isSubcriptionActive: false, subcriptionEndDate: 'NA', online_status: "0" }, currentSubIds = [];
  // console.log("Date", new Date())
  var getDriverList = await Driver.find({ subcriptionEndDate: { $lt: new Date(GFunctions.getISOTodayDate()) } }, { _id: 1, currentSubId: 1 }).exec();
  // console.log("getDriverList", getDriverList)
  var result = getDriverList.map(function (item) {
    driverIds.push(item._id);
    currentSubIds.push(item.currentSubId);
  });
  // console.log("driverIds", driverIds)
  // console.log("currentSubIds", currentSubIds)

  var mongoUpdate = await Driver.update({ _id: { "$in": driverIds } }, { isSubcriptionActive: false, subcriptionEndDate: null, online: false, currentSubId: null }, { multi: true }).exec();
  var mongoUpdatePackage = await DriverSubscription.update({ _id: { "$in": currentSubIds } }, { status: 'Expired' }, { multi: true }).exec();
  var mongoUpdatePackage = await DriverSubscription.update({ endDate: { $lt: new Date(GFunctions.getISOTodayDate()) }, status: "Activated" }, { status: 'Expired' }, { multi: true }).exec();

  activateSubscriptionPackage(driverIds);

  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  driverIds.map(function (items) {
    var child = items.toString();
    var usersRef = ref.child(child);
    // usersRef.update(requestData);

    usersRef.update(requestData, function (error) {
      if (error) { console.log(error); } else {
        console.log("updateDriverCreditsInFB");
      }
    });
  })

}

export const activateSubscriptionPackage = async (driverIds) => {
  // var driverIds = [], requestData = { isSubcriptionActive: false, subcriptionEndDate: 'NA', online_status: "0" }, currentSubIds = [];
  console.log("Date", new Date(GFunctions.getISOTodayDate()))
  console.log("driverIds", driverIds)
  var findSubscriptionPackage = await DriverSubscription.aggregate([
    {
      $match: { "driverId": { '$in': driverIds }/*, "startDate": { $gte: new Date(GFunctions.getISOTodayDate()) }*/, "status": "Inactive" }
    },
    {
      $sort: {
        startDate: 1
      }
    },
    {
      "$group": {
        "_id": '$driverId',
        "subscriptionId": { '$first': '$_id' },
        "packageId": { '$first': '$packageId' },
        "status": { "$first": "$status" },
        "endDate": { "$first": "$endDate" },
        "purchaseDate": { "$first": "$purchaseDate" },
        "startDate": { "$first": "$startDate" },
        "noofdays": { "$first": "$noofdays" },
        "amount": { "$first": "$amount" },
        "packageName": { "$first": "$packageName" },
      }
    }
  ]).exec()
  console.log('findSubs', findSubscriptionPackage)
  if (findSubscriptionPackage.length) {
    var updatePackDate = _.map(findSubscriptionPackage, (el) => {
      var startDate = GFunctions.getISOTodayDate();
      var endDate = GFunctions.getSubcriptionValidityDate(startDate, el.noofdays);
      Driver.findOne({ '_id': el._id }, (err, data) => {
        if (err) console.log(err)
        if (data /*&& data.isSubcriptionActive == false && data.subcriptionEndDate == null*/) {
          DriverSubscription.findOneAndUpdate({ '_id': el.subscriptionId }, { startDate: startDate, endDate: endDate, "status": "Activated" }, (err, doc) => {
            if (err) console.log("Err", err)
            if (doc) {
              console.log(doc.status)
              updateDriverSubscriptionInFB(el._id, endDate);
              updateSubcriptionEndDate(el._id, endDate, el.subscriptionId);
            }
          })
        }
      })
    })
    // return res.json(findSubscriptionPackage)
  }
}

export const addDriverBank = (driverId, driverName) => {
  var newdoc = new DriverBank
    ({
      driverId: driverId,
      driverName: driverName,
      totalBal: 0,
    });

  newdoc.save((err, docs) => {
    if (err) console.log('addDriverBank', err);
    console.log('addDriverBank');
  })
}

export const addDriverWallet = (driverId, driverName, referal) => {
  var newdoc = new DriverWallet
    ({
      driverId: driverId,
      driverName: driverName,
      totalBal: 0,
    });

  newdoc.save((err, docs) => {
    if (err) console.log('addDriverWallet', err);
    // console.log('addDriverWallet');
    if (featuresSettings.referalSettings.isDriverReferalCodeAvailable) {
      processReferalCode(referal, driverId);
    }
  })
}

export const getAllDriversForMTD = async (req, res) => {
  try {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
    let driversDocs = await Driver.aggregate([
      {
        $match: likeQuery
      },
      {
        "$project": {
          "_id": 1,
          "phone": 1,
          "fname": 1,
          "lname": 1,
          "email": 1,
          "code": 1,
          "label": {
            "$concat": [
              "$fname",
              " ",
              "$phone",
              ", ",
              "$code"
            ]
          },
          "value": "$_id"
        }
      }
    ]).exec();
    res.json({ "success": true, "message": req.i18n.__("FETCHED_SUCCESSFULY"), "data": driversDocs });
  } catch (err) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}


// DriverPerDay
export const updateDriverPerDayEarnings = async (driverId, newTripCount, earned, adminCommision) => {
  try {
    var todayDate = GFunctions.getISOTodayDate();
    var findQuery = { driver: driverId, date: todayDate };
    var todayDataExists = await DriverPerDay.findOne(findQuery).exec();
    if (todayDataExists) {
      var updateDate = {
        nooftrips: Number(todayDataExists.nooftrips) + Number(newTripCount),
        earned: Number(todayDataExists.earned) + earned,
        adminCommision: Number(todayDataExists.adminCommision) + adminCommision,
      }
      await DriverPerDay.findOneAndUpdate({ driver: driverId, date: todayDate }, updateDate).exec();
    } else {
      var newDoc = new DriverPerDay(
        {
          driver: driverId,
          date: todayDate,
          nooftrips: newTripCount,
          adminCommision: adminCommision,
          earned: earned,
        }
      );
      await newDoc.save();
    }
  } catch (error) {
    console.log('updateDriverPerDayEarnings', error);
  }
}

export const updateDriverPerDayOnlineTime = async (driverId, status) => {
  try {
    var totalHours = 0;
    var todayDate = GFunctions.getISOTodayDate();
    var findQuery = { driver: driverId, date: todayDate };
    var currentTime = GFunctions.getRespCountryDateTime();
    var todayDataExists = await DriverPerDay.findOne(findQuery).exec(); //check per Doc
    if (todayDataExists) {
      if (status == 1 || status == "1") { // chk on/off
        totalHours = GFunctions.getHoursBtDateTime(currentTime, todayDataExists.lastOFF);
        totalHours = Number(todayDataExists.offlineHours) + Number(totalHours);
        totalHours = totalHours ? Number(totalHours).toFixed(2) : 0;
        await DriverPerDay.findOneAndUpdate({ driver: driverId, date: todayDate }, { lastON: currentTime, 'offlineHours': totalHours, offlineLable: convertHoursToLable(totalHours) }).exec();
      } else {
        totalHours = GFunctions.getHoursBtDateTime(currentTime, todayDataExists.lastON);
        totalHours = Number(todayDataExists.onlineHours) + Number(totalHours);
        totalHours = totalHours ? Number(totalHours).toFixed(2) : 0;
        await DriverPerDay.findOneAndUpdate({ driver: driverId, date: todayDate }, { lastOFF: currentTime, onlineHours: totalHours, onlineLable: convertHoursToLable(totalHours) }).exec();
      }
    }
    else {
      var addData = {
        driver: driverId,
        date: todayDate
      };
      if (status == 1 || status == "1") { // chk on/off
        totalHours = GFunctions.getHoursBtDateTime(currentTime, todayDate);
        totalHours = totalHours ? Number(totalHours).toFixed(2) : 0;
        addData.lastON = currentTime;
        addData.offlineHours = totalHours;
        addData.offlineLable = convertHoursToLable(totalHours)
      } else {
        totalHours = GFunctions.getHoursBtDateTime(currentTime, todayDate);
        totalHours = totalHours ? Number(totalHours).toFixed(2) : 0;
        addData.lastOFF = currentTime;
        addData.onlineHours = totalHours;
        addData.onlineLable = convertHoursToLable(totalHours)
      }

      console.log('addData', addData)
      var newDoc = new DriverPerDay(addData);
      await newDoc.save();
    }
  } catch (error) {
    console.log('updateDriverPerDayOnlineTime', error);
  }
}

function convertHoursToLable(onlineHours) {
  var min = onlineHours * 60;
  var onlineLable = Math.trunc(onlineHours) + " Hours " + (min % 60).toFixed(0) + " Minutes";
  return onlineLable;
}

export const updateDriverPerDayCancels = async (driverId, cancelledAmount, adminCommision) => {
  try {
    var todayDate = GFunctions.getISOTodayDate();
    var findQuery = { driver: driverId, date: todayDate };
    var todayDataExists = await DriverPerDay.findOne(findQuery).exec();
    if (todayDataExists) {
      var updateDate = {
        nooftripsCancelled: Number(todayDataExists.nooftripsCancelled) + Number(1),
        cancelledAmount: Number(todayDataExists.cancelledAmount) + cancelledAmount,
      }
      await DriverPerDay.findOneAndUpdate({ driver: driverId, date: todayDate }, updateDate).exec();
      return true;
    } else {
      var newDoc = new DriverPerDay(
        {
          driver: driverId,
          cancelledAmount: cancelledAmount,
          nooftripsCancelled: 1,
          date: todayDate,
        }
      );
      await newDoc.save();
      return true;
    }
  } catch (error) {
    console.log('updateDriverPerDayCancels', error);
    return false;
  }
}

export const updateAddCancelationChargeToDriver = async (driverId, cancelLimitForDays, noOfDriverCancelAllowed) => {
  try {
    var todayDate = GFunctions.getISOTodayDate();
    var findQuery = { driver: driverId, date: todayDate };
    var todayDataExists = await DriverPerDay.findOne(findQuery).exec();
    if (todayDataExists) {
      var cancelledAmount = Number(todayDataExists.cancelledAmount);
      updateDriverWalletCredits(driverId, cancelledAmount);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('updateAddCancelationChargeToDriver', error);
    return false;
  }
}

export const updateBlockTheDriverIfCancelExceeds = async (driverId, ifcancelExceedsBlockUserFor, noOfDriverCancelAllowed) => {
  try {
    var todayDate = GFunctions.getISODate();
    var findQuery = { driver: driverId, date: todayDate };
    var todayDataExists = await DriverPerDay.findOne(findQuery).exec();
    if (todayDataExists) {
      var nooftripsCancelled = Number(todayDataExists.nooftripsCancelled);
      if (Number(nooftripsCancelled) >= Number(noOfDriverCancelAllowed)) {
        var myDate = moment(todayDate).add(ifcancelExceedsBlockUserFor, "days").utcOffset(config.utcOffset).format("DD-MM-YYYY");
        var blockDate = moment(todayDate).utcOffset(config.utcOffset).add(ifcancelExceedsBlockUserFor, "days").format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        Driver.findByIdAndUpdate(driverId,
          {
            'blockuptoDate': new Date(blockDate),
          }
          , { new: true }, function (err, docs) {
            if (err) { }
            GFunctions.sendFCMMsg(docs.fcmId, "Your Accout Has beed Blocked upto " + myDate);
            blockDriverInFB(driverId, myDate, nooftripsCancelled);
          });
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log('updateAddCancelationChargeToDriver', error);
    return false;
  }
}

export const blockDriverInFB = (dvrId, blockuptoDate, cancelExceeds = 1) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
    cancelExceeds: cancelExceeds,
    blockuptoDate: blockuptoDate,
  };
  var child = dvrId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
  requestData = GFunctions.convertAllNumbersToString(requestData);
  usersRef.update(requestData, function (error) {
    if (error) { console.log(error); } else {
      console.log("updateDriverCreditsInFB");
    }
  });
}

export const resetDriversBlocking = async () => {
  try {
    var todayDate = GFunctions.getISODate();
    // todayDate = moment(req.body.to).subtract(1, 'days').format('DD-MM-YYYY');
    var findQuery = {
      blockuptoDate: { '$lte': todayDate }
    };
    var todayDataExists = await Driver.find(findQuery).exec();
    if (todayDataExists) {
      todayDataExists.forEach(async function (u) {
        blockDriverInFB(u._id, '', 0);
        var update = await Driver.findOneAndUpdate({ '_id': u._id }, { blockuptoDate: null });
      })
    }
    // Driver.update(findQuery, { blockuptoDate: null }, { multi: true });
  } catch (error) {
    console.log('updateDriverPerDayCancels', error);
    return false;
  }
}

// DriverPerDay


export const getDriverRating = async (req, res) => {
  if (
    typeof req.query._sort === "undefined"
    || req.query._sort === ""
  ) {
    req.query._sort = "rating.rating";
  }

  if (
    typeof req.query._order === "undefined"
    || req.query._order === ""
  ) {
    req.query._order = "ASC";
  }
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var btQuery = HelperFunc.btQueryBuilder(req.query, {});

  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = { "$in": req.userId };

  if (btQuery["Rating"]) {
    likeQuery['rating.rating'] = btQuery["Rating"];
    delete btQuery["Rating"];
  }

  let count = Driver.find(likeQuery).count().exec();
  let driverslist = Driver.find(likeQuery, { fname: 1, phone: 1, _id: 1, rating: 1, code: 1, profile: 1 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec();

  try {
    var promises = await Promise.all([count, driverslist]);
    res.header('x-total-count', promises[0]);
    return res.status(200).json(promises[1]);
  } catch (err) {
    return res.status(200).json({});
  }
}

/**
 * Process Referal : Check code, get amount, update wallet
 * @input
 * @param
 * @return
 * @response
 */
function processReferalCode(referalCode, userId) {
  if (featuresSettings.referalSettings.isDriverReferalCodeAvailable) {
    if (!referalCode) return false;
    Driver.findOne({ referal: referalCode }, function (err, docs) {
      if (err) { console.log('processReferalCode'); }
      else if (docs) {
        var referalAmt = featuresSettings.referalSettings.driverReferalAmount;
        var refererAmt = featuresSettings.referalSettings.driverRefererAmount;

        if (refererAmt) { //who gaves code
          var tripParams = {
            driverId: docs._id,
            trxId: referalCode,
            description: "Referal Credits",
            amt: refererAmt,
            paymentDate: GFunctions.getISODate("D-M-YYYY h:mm a"),
            paymentDateSort: GFunctions.getISODate(),
            type: 'credit'
          }
          updateDriverWallet(docs._id, tripParams)
        }
        if (referalAmt) { //who uses code
          var tripParams = {
            driverId: userId,
            trxId: referalCode,
            description: "Referal Credits",
            amt: referalAmt,
            paymentDate: GFunctions.getISODate("D-M-YYYY h:mm a"),
            paymentDateSort: GFunctions.getISODate(),
            type: 'credit'
          }
          updateDriverWallet(userId, tripParams);
        }
      }
    });
  }
}


//ETA
export const requestNearbyDriversETA = async (pickupLat, pickupLng, vehicleData = []) => {
  try {
    var userreq = {
      pickupLng: pickupLng,
      pickupLat: pickupLat
    };
    var requestRadius = config.requestRadius;
    var driverData = await Driver.aggregate([
      {
        "$match":
        {
          'coords': {
            $geoWithin: {
              $centerSphere: [[parseFloat(userreq.pickupLng), parseFloat(userreq.pickupLat)],
              requestRadius / 3963.2]
            }
          },
          online: true, curStatus: "free", isDaily: true
        },
      },
      { $project: { code: 1, fname: 1, coords: 1, online: 1, curStatus: 1, curService: 1, isMini: 1, currentCategoryOptions: 1 } }
    ]).exec();
    if (driverData.length) {
      var from = { latitude: parseFloat(userreq.pickupLat), longitude: parseFloat(userreq.pickupLng) };

      if (featuresSettings.lowerCategoryCanUse.sedanToMini) {
        /*var filterDriverDocs = _.filter(driverData, { curService: 'Mini' });
        if (!filterDriverDocs.length) {
          var docs = await getDriverBasedOnSedantoMini(driverData);
          driverData = docs
        }*/
      }

      var nearestArray = orderByDistance(from, driverData);
      var nearestDrivers = addServiceToSortedArray(nearestArray, driverData);
      var data = await filterNSendOBORequestToDrivers(nearestDrivers, parseFloat(userreq.pickupLng), parseFloat(userreq.pickupLat));
      if (data.length) {
        //console.log('data',data)
        var newData = [];
        vehicleData.forEach(function (u) {
          var considerLowerVehicleToo = getNearByConsiderLowerVehicleToo(u.type, data, driverData);
          if (considerLowerVehicleToo) newData.push(considerLowerVehicleToo);//if exists
        });
        return newData;
      }
      return 'NA';
    } else {
      return 'NA';
    }
  } catch (error) {
    return 'NA';
  }
}

function getNearByConsiderLowerVehicleToo(type, data, driverData) {
  var newData = {};
  var newDataFromLowerCategory = {};
  //check data for nearest vtype
  //@TODO need to short nearest then do
  var curData = _.filter(data, { curService: type });
  if (curData.length) {
    newData = {
      code: curData[0].code,
      curService: curData[0].curService,
      distance: curData[0].distance,
      distanceValue: curData[0].distanceValue,
      duration: curData[0].duration
    }
  }

  let datelen = data.length;
  for (let i = 0; i < datelen; i++) {
    var curDriverLowerVehicleData = _.filter(driverData, { code: data[i].code });
    if (curDriverLowerVehicleData[0].currentCategoryOptions.indexOf(type) >= 0) {
      newDataFromLowerCategory = {
        code: data[i].code,
        curService: type,
        distance: data[i].distance,
        distanceValue: data[i].distanceValue,
        duration: data[i].duration
      }
      break;
    }
  }

  if ((Object.keys(newData).length == 0) && Object.keys(newDataFromLowerCategory).length) {
    newData = newDataFromLowerCategory;
  }
  else if (Object.keys(newData).length && Object.keys(newDataFromLowerCategory).length) {
    if (newDataFromLowerCategory.distanceValue < newData.distanceValue) {
      newData = newDataFromLowerCategory;
    }
  }

  // console.log('newDataFromLowerCategory', newDataFromLowerCategory)
  // console.log('newData', newData)

  return newData;
}

async function getDriverBasedOnSedantoMini(driverData) {
  var isMiniEnabledDriver = [];
  var doc = _.map(driverData, (el) => {
    if (el.curService == 'Sedan' && el.isMini == true) {
      var data = {
        _id: el._id,
        code: el.code,
        fname: el.fname,
        coords: el.coords,
        online: el.online,
        curStatus: 'free',
        curService: 'Mini',
        isMini: el.isMini
      }
      isMiniEnabledDriver.push(data);
    }
  })
  if (isMiniEnabledDriver.length) {
    var finalData = _.concat(driverData, isMiniEnabledDriver)
    return finalData
  }
  else return driverData
}

export const requestNearbyDriversETA1 = async (req, res) => {
  // geo nearby , with service distinct,
  /* var userreq = req.body;
  var requestRadius = config.requestRadius;
 
  Driver.aggregate([
    {
      "$match":
      {
        'coords': {
          $geoWithin: {
            $centerSphere: [[parseFloat(userreq.pickupLng), parseFloat(userreq.pickupLat)],
            requestRadius / 3963.2]
          }
        },
        online: true, curStatus: "free"
      },
    },
 
    { $project: { code: 1, fname: 1, coords: 1, online: 1, curStatus: 1, curService: 1 } }
 
  ], function (err, docs) {
    if (err) { return res.status(500).json({ 'success': false, 'message': "ERROR_SERVER..", 'error': err }) }
    // 1. Find distance from pickup point
    // 2. Sort by lowest dist
    // 3. distinct with curService
    // 4. convert distance to approx KM from pickup
    var from = { latitude: parseFloat(userreq.pickupLat), longitude: parseFloat(userreq.pickupLng) };
    var nearestArray = orderByDistance(from, docs);
    var nearestDrivers = addServiceToSortedArray(nearestArray, docs);
    var data = await filterNSendOBORequestToDrivers(nearestDrivers, parseFloat(userreq.pickupLng), parseFloat(userreq.pickupLat));
    return data;
  })  */

  /*   var METERS_PER_MILE = 1609.34
    var whereQ = {
      location:
      {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [78.122, 9.9239] },
          $maxDistance: 50 * METERS_PER_MILE
        }
      }
    };
 
    Driver.find(whereQ).find((error, results) => {
      if (error) console.log(error);
      return res.json(results)
    }); */


  /*  Message.aggregate([
     {
       "$match":
       {
         location: {
           $geoNear: {
             $geometry: { type: "Point", coordinates: [78.122, 9.9239] },
             $maxDistance: 50 * METERS_PER_MILE
           }
         },
         // online: true, curStatus: "free"
       },
     },
 
     // { $project: { code: 1, fname: 1, coords: 1, online: 1, curStatus: 1, curService: 1 } }
 
   ], function (err, docs) {
     if (err) { return res.status(500).json({ 'success': false, 'message': "Error on server..", 'error': err }) }
     // 1. Find distance from pickup point
     // 2. Sort by lowest dist
     // 3. distinct with curService
     // 4. convert distance to approx KM from pickup
     return res.json(docs)
   })  */
}

export const orderByDistance = (from, toArray) => {
  var newResArray = [];
  toArray.forEach(function (u) {
    newResArray.push({
      latitude: u.coords[1],
      longitude: u.coords[0],
    });
  });
  var sortedDistance = geolib.orderByDistance(from, newResArray);
  return sortedDistance;
}

export const addServiceToSortedArray = (nearestArray, docs) => {
  var newResArray = [];
  nearestArray.forEach(function (u) {
    var curDriver = docs[Number(u.key)];
    var serviceExists = curServiceExists(newResArray, curDriver.curService);
    if (!serviceExists) {
      newResArray.push({
        code: curDriver.code,
        coords: curDriver.coords,
        curService: curDriver.curService,
        distance: u.distance,
      });
    }
  });
  return newResArray;
}

function getUnique(arr, comp) {
  const unique = arr
    .map(e => e[comp])
    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)
    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);
  return unique;
}

function curServiceExists(arr, curService) {
  return arr.some(function (el) {
    return el.curService === curService;
  });
}

function filterNSendOBORequestToDrivers(driverdata, pickupLng, pickupLat) {
  return new Promise(function (resolve, reject) {

    var convertedLatLon = convertCordsToGDMFormat(driverdata);
    var originsPoints = parseFloat(pickupLat) + "," + parseFloat(pickupLng);
    originsPoints = originsPoints.toString();
    var origins = [originsPoints];
    var destinations = convertedLatLon;
    distance.key(config.googleApi);
    distance.units('metric');
    distance.mode('driving');
    distance.matrix(origins, destinations, function (err, distances) {
      if (err) { return resolve({ 'success': false }); }
      else if (distances.status == 'OK') {
        var resOutput = distances.rows[0].elements;
        var distanceArray = addDocIdAndGetOnlyDistanceArry(driverdata, resOutput); //Merging In Driver and Geo
        return resolve(distanceArray);
      }
      else { return resolve({ 'success': false }); }
    })

  })
}

function convertCordsToGDMFormat(docs) {
  var resultDoc = docs.map(function (items) {
    var destinations = "";
    var tmpDoc = items.coords;
    destinations = tmpDoc[1] + "," + tmpDoc[0];
    return destinations;
  });
  return resultDoc;
}

function addDocIdAndGetOnlyDistanceArry(docs, GDMop) {
  var totalArray = docs.length;
  var GMDistAry = [];
  for (let i = 0; i < totalArray; i++) {
    let isDistOk = GDMop[i].status;
    if (isDistOk == 'OK') {
      let tempObj = {};
      tempObj['code'] = docs[i].code;
      tempObj['curService'] = docs[i].curService;
      tempObj['distance'] = docs[i].distance;
      tempObj['distanceValue'] = GDMop[i].distance.value;
      tempObj['duration'] = GDMop[i].duration.text;
      GMDistAry.push(tempObj);
    }
  }
  return GMDistAry;
}

export const updateSubcriptionEndDate = (driverId, uptoEndDate, currentSubId = null) => {
  var update = {
    "subcriptionEndDate": new Date(uptoEndDate),
    "isSubcriptionActive": true,
    "currentSubId": currentSubId,
  }
  Driver.findOneAndUpdate({ _id: driverId }, update, { new: true }, (err, doc) => {
    if (err) { console.log(err); }
    else {
      console.log('updateSubcriptionEndDate added');
    }
  })
}


export const updateSubcriptionDeactivate = (driverId) => {
  var update = {
    "subcriptionEndDate": null,
    "isSubcriptionActive": false,
    "currentSubId": null,
  }
  Driver.findOneAndUpdate({ _id: driverId }, update, { new: true }, (err, doc) => {
    if (err) { console.log(err); }
    else {
      console.log('updateSubcriptionEndDate deactivated');
    }
  })
}

export const profileImageAdd = (req, res) => {
  if (req['file'] != null) {
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("PROFILE_IMAGE_UPLOAD_SUCCESSFULLY"), 'data': req.file.path })
  }
  else {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("INVALID_PROFILE_IMAGE"), })
  }
}

export const driverUpdateHailTripType = (req, res) => {
  var update = {};
  if (req.body.activeFor == "hail") update.isHail = req.body.status;
  Driver.findOneAndUpdate({ _id: req.body.driverId }, update, { new: true }, (err, doc) => {
    if (err) { return res.status(401).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err }); }
    else {
      return res.json({ 'success': true, 'message': req.body.activeFor + ' ' + (req.i18n.__("DRIVER_CHANGED_STATUS")) + ' ' + req.body.status });
    }
  })
}

export const driverActiveTripTypeFromAdmin = async (req, res) => {
  req.userId = req.body.driverId;
  // req.body.currentTaxiId = req.body.currentTaxiId;
  driverActiveTripType(req, res);
}

//Package
export const driverActiveTripType = async (req, res, next) => {
  console.log(req.body);
  //Check current vehicle eligibility for outstation,rental
  //If eligible active / off
  //Also active / off that in vehicle sub doc.
  req.body.status = req.body.status ? req.body.status : true;
  var updateFor = 'isDaily', whereQ = {}, updateFB = false, servicename = "Rental";
  if (req.body.activeFor == "rental") {
    whereQ.tripTypeCode = "rental";
    updateFor = 'isRental';
    servicename = "Rental";
    updateFB = true;
  }
  if (req.body.activeFor == "outstation") {
    whereQ.tripTypeCode = "outstation";
    updateFor = 'isOutstation';
    servicename = "Outstation";
    updateFB = true;
  }
  if (req.body.activeFor == "daily") {
    whereQ.tripTypeCode = "daily";
    updateFor = 'isDaily';
    servicename = "daily";
    updateFB = true;
  }

  if (featuresSettings.lowerCategoryCanUse.sedanToMini) {
    if (req.body.activeFor != "daily" && req.body.activeFor != "outstation" && req.body.activeFor != "rental") {
      return next();
    }
  }

  let driverData = await Driver.findById(req.userId, { curService: 1, curStatus: 1, currentTaxi: 1 });
  if (!driverData) return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") });
  whereQ.type = { $regex: new RegExp(driverData.curService, "i") };
  let vehicleData = await Vehicletype.findOne(whereQ);
  if (vehicleData) { // yes, this vehicle can be used for activeFor type

    Driver.findById(req.userId, function (err, docs) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      if (updateFor == 'isDaily') {
        docs.isDaily = req.body.status;
      } else if (updateFor == 'isOutstation') {
        docs.isOutstation = req.body.status;
      } else if (updateFor == 'isRental') {
        docs.isRental = req.body.status;
      }
      var taxi = docs.taxis.id(driverData.currentTaxi);
      taxi[updateFor] = req.body.status;
      var taxisdata = {
        vehicletype: driverData.currentTaxi,
        name: driverData.curService,
        service: servicename,
        status: req.body.status,
        taxi: taxi,
      };
      docs.save(function (err, op) {
        if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (updateFB) updateDriverTaxiCategory(req.userId, driverData.currentTaxi, taxisdata);
        return res.json({ 'success': true, 'message': req.body.activeFor + ' ' + (req.i18n.__("DRIVER_CHANGED_STATUS")) + ' ' + req.body.status  /* 'Driver ' + req.body.activeFor + ' status set to ' + req.body.status + ' successfully' */ });
      });
    });

  } else {
    return res.status(409).json({ 'success': false, 'message': servicename + ' ' + (req.i18n.__("SERVICE_NOT_AVAILABLE_FOR_THIS_VEHICLE_TYPE"))/* 'Service ' + servicename + ' not Available for this Vehicle Type.' */ });
  }

}

export const enableLowerCategory = async (req, res) => {
  req.body.status = req.body.status ? req.body.status : true;
  var whereQ = {}, updateFB = true, updateFor = 'isMini', servicename = "Mini";
  if (req.body.activeFor == "Mini") {
    updateFB = true;
    updateFor = 'isMini';
    servicename = "Mini";
  }

  let driverData = await Driver.findById(req.userId, { curService: 1, curStatus: 1, currentTaxi: 1 });
  if (!driverData) return res.status(409).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") });

  Driver.findById(req.userId, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });

    var taxi = docs.taxis.id(driverData.currentTaxi);
    var oldlowCategoryOptions = [];
    oldlowCategoryOptions = taxi.lowCategoryOptions;
    //taxi[updateFor] = req.body.status;
    var indexOfCurVehicle = oldlowCategoryOptions.indexOf(req.body.activeFor);
    if (req.body.status && req.body.status == 'true') {
      if (indexOfCurVehicle == -1) {
        oldlowCategoryOptions.push(req.body.activeFor);
      }
    }
    else {
      if (indexOfCurVehicle > -1) {
        oldlowCategoryOptions.splice(indexOfCurVehicle, 1);
      }
    }

    taxi.lowCategoryOptions = oldlowCategoryOptions;

    var taxisdata = {
      vehicletype: driverData.currentTaxi,
      name: driverData.curService,
      service: req.body.activeFor,
      status: req.body.status,
      taxi: taxi,
    };

    docs.currentCategoryOptions = oldlowCategoryOptions;
    //docs.isMini = req.body.status;
    docs.save(function (err, op) {
      if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      if (updateFB) enableLowerCategoryInFB(req.userId, driverData.currentTaxi, taxisdata);
      return res.json({ 'success': true, 'message': req.body.activeFor + ' ' + (req.i18n.__("DRIVER_CHANGED_STATUS")) + ' ' + req.body.status  /* 'Driver ' + req.body.activeFor + ' status set to ' + req.body.status + ' successfully' */ });
    });
  });
}

function enableLowerCategoryInFB(driverid, vehicleid, taxisdata) {
  console.log('enableLowerCategoryInFB', vehicleid)
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("vehicle_list");
  var obj = {};

  var key3 = (taxisdata.vehicletype).toString();
  var value3 = 0;

  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);

  usersRef.once('value').then(function (snap) {
    var data = snap.val();

    var requestData = data.category;

    if (taxisdata.status == 'false') {
      delete requestData[taxisdata.service];
    } else {
      requestData[taxisdata.service] = value3;
    }

    var categoryData = {
      category: requestData
    };

    usersRef.update(categoryData);

  });


}

function updateDriverTaxiCategory(driverid, vehicleid, taxisdata) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("vehicle_list");
  var obj = {};

  var key3 = (taxisdata.vehicletype).toString();
  var value3 = 0;

  //Enable already exists
  if (taxisdata.taxi.isDaily) {
    obj[taxisdata.name] = value3;
  }
  if (taxisdata.taxi.isRental) {
    obj['Rental'] = value3;
  } if (taxisdata.taxi.isOutstation) {
    obj['Outstation'] = value3;
  }

  if ((taxisdata.service == 'Rental') && (taxisdata.status == 'false')) {
    delete obj.Rental;
  }

  if ((taxisdata.service == 'Outstation') && (taxisdata.status == 'false')) {
    delete obj.Outstation;
  }

  if ((taxisdata.service == 'daily') && (taxisdata.status == 'false')) {
    delete obj[taxisdata.name];
  }

  var requestData = {
    category: obj
  };

  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);

  usersRef.update(requestData);

}


export const getVehicleServiceAvailablity = async (req, res) => {
  var whereQ = {};

  // let driverData = await Driver.findById(req.userId, { curService: 1, curStatus: 1, currentTaxi: 1 });

  // whereQ.type = { $regex: new RegExp(driverData.curService, "i") };
  // let vehicleDataForImage = await Vehicletype.find({ "tripTypeCode": "daily"  }, {}).exec();

  // var newResObj = [{
  //   "type": "daily",
  //   "status": true
  // }];

  // yes, this vehicle can be used for activeFor type

  Driver.findById(req.userId, async function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var taxiId = new mongoose.Types.ObjectId(req.params.type);
    var taxi = docs.taxis.id(taxiId);
    var dailyEnabled = taxi.isDaily;
    var rentalEnabled = taxi.isRental;
    var outstationEnabled = taxi.isOutstation;
    var miniEnabled = taxi.isMini;

    whereQ.type = { $regex: new RegExp(taxi.vehicletype, "i") };
    let vehicleData = await Vehicletype.find(whereQ, {}).distinct('tripTypeCode').exec(); //NEW @TODO SERVICE AVAILABLE

    var tempArray = [];
    vehicleData.forEach(function (element) {
      if (element == 'daily') {
        tempArray.push({
          "type": "daily",
          "status": dailyEnabled,
          "file": config.baseurl + "public/vehicle/Sedan.png",
        })
      } else if (element == 'rental') {
        tempArray.push({
          "type": "rental",
          "status": rentalEnabled,
          "file": config.baseurl + "public/vehicle/file-rental.png",
        })
      } else if (element == 'outstation') {
        tempArray.push({
          "type": "outstation",
          "status": outstationEnabled,
          "file": config.baseurl + "public/vehicle/file-outstation.png",
        })
      }
    });


    let vehicleDataOfCurentTaxi = await Vehicletype.findOne(whereQ, {}).lean().exec();

    if (featuresSettings.lowerCategoryCanUse.sedanToMini) {

      //If Sedan was Current service Driver can enable Mini as his Category.
      //add mini to fb, Driver cur service, check Mini for Sedan while requesting
      // if (docs.curService == "Sedan") { //hardcoded to Sedan
      var driverChecked = taxi.lowCategoryOptions;
      var vehicleDataOfCurentTaxiLCO = vehicleDataOfCurentTaxi.lowCategoryOptions;

      if (vehicleDataOfCurentTaxiLCO && vehicleDataOfCurentTaxiLCO.length) {
        (vehicleDataOfCurentTaxiLCO).forEach((el) => {
          var isChecked = false;
          if (driverChecked.indexOf(el) >= 0) isChecked = true;
          tempArray.push({
            "type": el,
            "status": isChecked,
            "file": config.baseurl + "public/vehicle/" + el + ".png",
          })
        })
      }

      // }
    }

    return res.status(200).json(tempArray);

  });


  /* Vehicletype.find({
    type: req.params.type
  }, {}).distinct('tripTypeCode').exec((err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': 'Some Error' });
    }
 
    var newResObj = [{
      "type": "daily",
      "status": true
    },
    {
      "type": "rental",
      "status": false
    },
    {
      "type": "outstation",
      "status": false
    }];
 
    var tempArray = [];
    newResObj.forEach(function (element) {
      if (docs.indexOf(element.type) > -1) {
        console.log(element.type)
        element.status = true;
        tempArray.push(element)
      } else {
        tempArray.push(element)
      }
    });
 
    return res.json(tempArray);
  }); */
}

//Package


export const driverBankDetail = (req, res) => {
  return res.json({ 'success': true, 'message': 'dummy' });
}


export const updateDriverProvider = (req, res) => {
  var newDoc =
  {
    providerId: req.body.providerId,
  }

  Driver.findOneAndUpdate({ _id: req.body.driverId }, newDoc, { new: true }, (err, todo) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), todo });
  });
};

export const updateDriverPhone = (req, res) => {
  var newDoc =
  {
    phone: req.body.phone,
  }

  Driver.findOneAndUpdate({ _id: req.body.driverId }, newDoc, { new: true }, (err, todo) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), todo });
  });
};

export const updateDriverWalletType = (req, res) => {
  var newDoc =
  {
    walletType: req.body.walletType,
  }

  Driver.findOneAndUpdate({ _id: req.body.driverId }, newDoc, { new: true }, (err, todo) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), todo });
  });
}

export const removeDriverLocation = async () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_location");
  ref.remove();
}


export const refreshFromAdmin = (req, res) => {
  try {
    removeDriverLocation();
    return res.json({ 'success': true, 'message': req.i18n.__("REFRESHED") });
  }
  catch (err) {
    return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });

  }
}


//Remove from Driver low cat
export const updateDriverLowCatVechicle = async (mainVehicle, lowCategoryOptionsNew) => {
  //lowCategoryOptionsNew = lowCategoryOptionsNew.split(",");
  Driver.find(
    {
      curService: mainVehicle
    }
    , { _id: 1, curService: 1, currentCategoryOptions: 1, currentTaxi: 1 }).exec((err, docs) => {
      if (err) { }
      if (docs.length) {
        docs.forEach(element => {
          let curLowCat = element.currentCategoryOptions;
          if (!curLowCat) return false;
          let taxisdata = {
            vehicletype: element.currentTaxi,
            name: mainVehicle,
            service: 'NA',
            status: 'false',
            taxi: "",
          };

          let removedCats = [];
          let lowCategoryOptionsArr = [];
          if (curLowCat.indexOf('rental') >= 0) lowCategoryOptionsArr.push('rental');
          if (curLowCat.indexOf('outstation') >= 0) lowCategoryOptionsArr.push('outstation');

          curLowCat.forEach(filterNeededCats);
          function filterNeededCats(item, index) {
            if (lowCategoryOptionsNew.indexOf(item) >= 0) { lowCategoryOptionsArr.push(item); }
            else {
              if (item != 'rental' && item != 'outstation') {
                removedCats.push(item);
                taxisdata.service = item;
                enableLowerCategoryInFB(element._id, element.currentTaxi, taxisdata);
              }
            }
          }
          updateDriverLowCatVechicleInDb(element._id, lowCategoryOptionsArr, element.currentTaxi, mainVehicle);

        });
      }
    });
}

export const updateDriverLowCatVechicleInDb = (driverId, lowCategoryOptionsArr, taxiId, mainVehicle) => {
  var update = {
    "currentCategoryOptions": lowCategoryOptionsArr,
  }
  Driver.findOneAndUpdate({ _id: driverId }, update, { new: true }, (err, doc) => {
    if (err) { console.log(err); }
    else {
      console.log('updateDriverLowCatVechicleInDb added');
    }
  })

  Driver.findOneAndUpdate(
    //{ _id: driverId, taxis: { $elemMatch: { _id : taxiId } } },
    { _id: driverId, taxis: { $elemMatch: { vehicletype: mainVehicle } } },
    { $set: { "taxis.$.lowCategoryOptions": lowCategoryOptionsArr } }, { multi: true }
    , function (err, doc) {
      if (err) {
        console.log(err);
      }
      console.log('updateDriverLowCatVechicleInDb taxi added');
    });
}

export const updateDriverLowCatVechicleWhenSwitch = async (driverId, taxiId, mainVehicle) => {
  var lowCategoryOptionsNew = [];
  var vehicletypeData = await Vehicletype.findOne({ type: mainVehicle }, { lowCategoryOptions: 1 }).exec();
  if (!vehicletypeData) return false;
  lowCategoryOptionsNew = vehicletypeData.lowCategoryOptions;
  Driver.find(
    {
      _id: driverId
    }
    , { _id: 1, curService: 1, currentCategoryOptions: 1, currentTaxi: 1 }).exec((err, docs) => {
      if (err) { }
      if (docs.length) {
        docs.forEach(element => {
          let curLowCat = element.currentCategoryOptions;
          if (!curLowCat) return false;
          let taxisdata = {
            vehicletype: element.currentTaxi,
            name: mainVehicle,
            service: 'NA',
            status: 'false',
            taxi: "",
          };

          let removedCats = [];
          let lowCategoryOptionsArr = [];
          if (curLowCat.indexOf('rental') >= 0) lowCategoryOptionsArr.push('rental');
          if (curLowCat.indexOf('outstation') >= 0) lowCategoryOptionsArr.push('outstation');

          curLowCat.forEach(filterNeededCats);
          function filterNeededCats(item, index) {
            if (lowCategoryOptionsNew.indexOf(item) >= 0) { lowCategoryOptionsArr.push(item); }
            else {
              if (item != 'rental' && item != 'outstation') {
                removedCats.push(item);
                taxisdata.service = item;
                enableLowerCategoryInFB(element._id, element.currentTaxi, taxisdata);
              }
            }
          }
          updateDriverLowCatVechicleInDbWhenSwitch(element._id, lowCategoryOptionsArr, element.currentTaxi, mainVehicle);

        });
      }
    });
}


export const updateDriverLowCatVechicleInDbWhenSwitch = (driverId, lowCategoryOptionsArr, taxiId, mainVehicle) => {
  var update = {
    "currentCategoryOptions": lowCategoryOptionsArr,
  }
  Driver.findOneAndUpdate({ _id: driverId }, update, { new: true }, (err, doc) => {
    if (err) { console.log(err); }
    else {
      console.log('updateDriverLowCatVechicleInDb added');
    }
  })

  Driver.findOneAndUpdate(
    { _id: driverId, taxis: { $elemMatch: { _id: taxiId } } },
    { $set: { "taxis.$.lowCategoryOptions": lowCategoryOptionsArr } }, { multi: true }
    , function (err, doc) {
      if (err) {
        console.log(err);
      }
      console.log('updateDriverLowCatVechicleInDb taxi added');
    });
}

export const exportDriverEarningsForMonth = async (req, res) => {
  try {
    var fromMonth = new Date(req.params.month)
    var fromDate = moment(fromMonth).format("YYYY-MM-DD");
    var toDate = moment(fromDate).add(1, 'M').format('YYYY-MM-DD')
    var driverId = new mongoose.Types.ObjectId(req.params.id);
    var baseData = 'tripFDT'; //  tripFDT/createdAt

    console.log(driverId, new Date(fromDate), new Date(toDate))
    DriverPayment.aggregate([
      { "$match": { "driver": driverId, createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) } } },
      {
        $project:
        {
          _id: 1,
          day: { $dayOfMonth: "$createdAt" },
          amttopay: 1,
          amttodriver: 1,
          commision: 1,
          driver: 1,
          mtd: 1,
          cashpaid: 1,
        }
      },
      {
        "$group": {
          "_id": '$day',
          "amttopay": { "$sum": "$amttopay" },
          "commision": { "$sum": "$commision" },
          "cashpaid": { "$sum": "$cashpaid" },
          "nos": { "$sum": 1 },
          "date": { "$first": "$day" },
          "type": { "$first": "Days" },
          "amttodriver": { "$sum": "$amttodriver" },
          "paymentMode": { "$first": "$mtd" },
        }
      },
      { "$sort": { _id: 1 } }
      // ], function (err, docs) {
    ]).exec((err, docs) => {
      if (err) {
        console.log("Err", err)
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOMER_ERROR"), 'error': err });
      }
      if (docs.length != 0) {
        for (var x = 0; x < docs.length; x++) {
          console.log("docs[x].hasOwnProperty('date')", docs[x].hasOwnProperty('date'))
          if (docs[x].hasOwnProperty('date')) {
            docs[x].date = docs[x]._id + ', ' + req.params.month;
            console.log("docs[x].date", docs[x].date)
          }
        }
        console.log("docs", docs)
        // return res.status(200).json({ 'success': truncate, 'message': req.i18n.__("DOCS"), 'docs': docs })
        // return res.json(docs)
        const fields = [
          {
            label: 'Date',
            value: 'date'
          },
          {
            label: 'Total Trips',
            value: 'nos'
          },
          {
            label: 'Total Trips Amount',
            value: 'cashpaid'
          },
          {
            label: 'Total Earned Amount',
            value: 'amttodriver'
          },
          {
            label: 'Payment_mode',
            value: 'paymentMode'
          }
        ];
        return downloadResource(res, req.params.month + ' Earnings.csv', fields, docs);
      }
      else return res.json(docs)
    })
  }
  catch (err) {
    console.log(err)
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOMER_ERROR"), 'error': err });
  }
}

export const downloadResource = (res, fileName, fields, data) => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  return res.send(csv);
}

export const sendMonthlyInvoiceEmail = async (req, res) => {
  try {
    var fromMonth = new Date(req.body.month)
    var fromDate = moment(fromMonth).format("YYYY-MM-DD");
    var toDate = moment(fromDate).add(1, 'M').format('YYYY-MM-DD')
    var driverId = new mongoose.Types.ObjectId(req.userId);
    var baseData = 'tripFDT'; //  tripFDT/createdAt

    console.log(driverId, new Date(fromDate), new Date(toDate))
    DriverPayment.aggregate([
      { "$match": { "driver": driverId, createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) } } },
      {
        $project:
        {
          _id: 1,
          day: { $dayOfMonth: "$createdAt" },
          amttopay: 1,
          amttodriver: 1,
          commision: 1,
          driver: 1,
          mtd: 1,
          cashpaid: 1,
          dvrfname: 1,
        }
      },
      {
        "$lookup": {
          "localField": "driver",
          "from": "drivers",
          "foreignField": "_id",
          "as": "dvrinfo"
        }
      },
      { '$unwind': '$dvrinfo' },
      {
        "$group": {
          "_id": '$null',
          "amttopay": { "$sum": "$amttopay" },
          "commision": { "$sum": "$commision" },
          "cashpaid": { "$sum": "$cashpaid" },
          "nos": { "$sum": 1 },
          "date": { "$first": "$day" },
          "type": { "$first": "Days" },
          "amttodriver": { "$sum": "$amttodriver" },
          "paymentMode": { "$first": "$mtd" },
          "dvrfname": { '$first': '$dvrfname' },
          'dvrPhone': { '$first': '$dvrinfo.phone' },
          'dvrCode': { '$first': '$dvrinfo.code' },
          'dvrEmail': { '$first': '$dvrinfo.email' }
        }
      },
      { "$sort": { _id: 1 } }
      // ], function (err, docs) {
    ]).exec((err, docs) => {
      if (err) {
        console.log("Err", err)
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOMER_ERROR"), 'error': err });
      }
      if (docs.length) {
        console.log("docs", docs)
        var data = { name: docs[0].dvrfname, phone: docs[0].dvrPhone, totalTrips: docs[0].nos, totalTripAmount: docs[0].cashpaid, earnedAmount: docs[0].amttodriver }
        sendEmail(docs[0].dvrEmail, data, 'monthlyInvoiceMail');
        return res.json(docs)
      }
      else return res.json(docs)
    })
  }
  catch (err) {
    console.log(err)
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOMER_ERROR"), 'error': err });
  }
}


export const exportDailyEarnings = async (req, res) => {
  try {
    var date = req.params.date
    var fromDate = moment().format("YYYY-MM-DD");
    var toDate = moment(fromDate).add(1, 'Days').format('YYYY-MM-DD')
    var formatedDate = moment().format("DDMMM");
    var driverId = new mongoose.Types.ObjectId(req.params.id);

    if (date) {
      fromDate = GFunctions.getDateTimeinThisFormat(req.params.date, "DDMMMYYYY", 'YYYY-MM-DD')
      toDate = moment(fromDate).add(1, 'Days').format('YYYY-MM-DD')
      formatedDate = moment(fromDate).format("DDMMM");
    }

    console.log(driverId, new Date(fromDate), new Date(toDate), formatedDate)
    DriverPayment.aggregate([
      { "$match": { "driver": driverId, createdAt: { $gte: new Date(fromDate), $lt: new Date(toDate) } } },
      {
        $project:
        {
          _id: 1,
          amttopay: 1,
          amttodriver: 1,
          commision: 1,
          driver: 1,
          mtd: 1,
          cashpaid: 1,
          tripno: 1,
        }
      },
      { "$sort": { tripno: 1 } }
    ]).exec((err, docs) => {
      if (err) {
        console.log("Err", err)
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOMER_ERROR"), 'error': err });
      }
      console.log("docs", docs)
      if (docs.length != 0) {
        const fields = [
          {
            label: 'Trip No',
            value: 'tripno'
          },
          {
            label: 'Total Trips Amount',
            value: 'cashpaid'
          },
          {
            label: 'Total Earned Amount',
            value: 'amttodriver'
          },
          {
            label: 'Payment_mode',
            value: 'mtd'
          }
        ];
        return downloadResource(res, formatedDate + ' Earnings.csv', fields, docs);
      }
      else return res.json(docs)
    })
  }
  catch (err) {
    console.log(err)
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOMER_ERROR"), 'error': err });
  }
}