// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

//import models
import Rider from '../models/rider.model';
import Wallet from '../models/wallet.model';
import Trips from '../models/trips.model';
import * as GFunctions from './functions';
import * as HelperFunc from './adminfunctions';
// import { sendSmsMsg } from './smsmate';
import * as smsGateway from './smsGateway';
import { sendEmail } from './mailGateway';
// import { sendSmsMsg } from './smsGateway';
import RiderPerDay from '../models/riderperDay.model';
import CancelReasons from '../models/cancellationReason.model';
import Ridertaxi from '../models/ridertaxi.model';
import Paymentflow from "../modules/Paymentsflow/payments.model";
import * as paymentCtrl from "./paymentGateway/index"
import { string } from 'check-types';
import  * as Stripe from './paymentGateway/stripe';

const featuresSettings = require('../featuresSettings');
const notificationContent = require('../notificationContent');
var config = require('../config');
var firebase = require('firebase');
var async = require('async');
var crypto = require('crypto');
const Mustache = require('mustache');
const fs = require('fs');
const moment = require('moment');
const countryDocs = require('../countryDocs');
const _ = require('lodash');

/**
 * Reset Password  RiderResetPasswordFromAdmin
 * @input
 * @param
 * @return
 * @response
 */
export const riderResetPasswordFromAdmin = (req, res) => {
  Rider.findById(req.body.riderid, function (err, docs) {
    if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
    else if (!docs) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__('RIDER_NOT_FOUND') });
    }
    else {
      var password = config.resetPasswordTo;
      docs.setPassword(password);
      docs.save(function (err, op) {
        if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
        else {
          // var msg = notificationContent[notificationContent.defaultLanguage]['resetpassword'] + appName + password ;
          // smsGateway.sendSmsMsg(docs.phone,/*  '', docs.phcode, msg  */'Your Password Has Been Reseted to ' + password + '. Thank You.' + password, docs.phcode);
          smsGateway.sendSmsMsg(docs.phone, '', docs.phcode, '', 'resetPasswordFromAdmin', { 'PASSWORD': password });
          return res.json({ 'success': true, 'message': req.i18n.__('PASSWORD_RESETED' + password) })
        }
      })
    }
  });
}

export const checkPhoneAvail = (req, res) => {
  var phone = (req.body.phone);
  req.body.phone = phone.replace(/^0+/, '');
  Rider.find({ phone: req.body.phone, phcode: req.body.phcode }, { '_id': 1, 'phone': 1, 'fname': 1, 'lname': 1, 'email': 1 }, { "pwd": 0 }).limit(10).exec((err, docs) => {
    if (err) {
      return res.status(401).json({ 'success': false, 'message': req.i18n.__('USER_NOT_FOUND') });
    }
    if (!docs) return res.status(401).json({ 'success': false, 'message': req.i18n.__('USER_NOT_FOUND') });
    return res.status(200).json({ 'success': true, 'users': docs });
  });
};

export const verifyNumber = (req, res) => {
  var phone = (req.body.phone);
  req.body.phone = phone.replace(/^0+/, '');
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) findOrCondition.push({ 'email': (req.body.email).toLowerCase() })
  if (req.body.loginType == 'facebook' || req.body.loginType == 'google' || req.body.loginType == 'apple') {
    findOrCondition.push({ "$and": [{ 'loginType': req.body.loginType }, { "loginId": req.body.loginId }] })
  }
  Rider.findOne({ $or: findOrCondition }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('ERROR_SERVER') });
    if (user) return res.status(409).json({ 'success': true, 'message': req.i18n.__('PHONE_EMAIL_ALREADY_EXISTS') });
    var randomSMS = GFunctions.sendRandomizeCode('0', 4);
    if (req.body.otp && typeof req.body.otp !== 'undefined') {
      randomSMS = req.body.otp;
    }

    console.log("otp -------->",randomSMS);
    // sendSmsMsg(req.body.phone, '', req.body.phcode, 'verifyNumberDriver', { 'RANDOMSMS': randomSMS });
    if (featuresSettings.registerOTPVerificationMethod == 'email' || featuresSettings.registerOTPVerificationMethod == 'both') {
      sendEmail(req.body.email, {}, '<#> OTP to install ' + config.appName + ' app is ' + randomSMS, req.headers['accept-language'])
    }
    if (featuresSettings.registerOTPVerificationMethod == 'sms' || featuresSettings.registerOTPVerificationMethod == 'both') {
      // var msg = notificationContent[notificationContent.defaultLanguage]['verifyNumberRider'] + config.appName + ' ' + randomSMS;
      // smsGateway.sendSmsMsg(req.body.phone, '', req.body.phcode, msg);
      smsGateway.sendSmsMsg(req.body.phone, '', req.body.phcode, '', 'verifyNumberRider', { 'RANDOMSMS': randomSMS, 'HASHVAL': req.body.hashval });
    }

    return res.json({ 'success': true, 'message': req.i18n.__('OTP_SEND_TO_YOUR') + ' Phone No.', 'code': randomSMS });
  })
};

export const riderUpdateVerifiedData = (req, res) => {
  var phone = (req.body.phone);
  req.body.phone = phone.replace(/^0+/, '');
  var updateData = {
    phone: req.body.phone,
    phcode: req.body.phcode,
  };
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    updateData = {
      email: req.body.email
    }
    findOrCondition.push({ 'email': (req.body.email).toLowerCase() })
  }

  Rider.findOne({ $or: findOrCondition }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('ERROR_SERVER') });
    if (user) return res.status(409).json({ 'success': false, 'message': req.i18n.__('PHONE_EMAIL_ALREADY_EXISTS') });

    Rider.findOneAndUpdate({ _id: req.userId }, updateData, { new: true }, (err, doc) => {
      if (err) {
        return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
      }
      return res.json({ 'success': true, 'message': req.i18n.__('PROFILE_UPDATED_SUCCESSFULLY') });
    })
  })
};

export const addData = (req, res) => {
  var phone = (req.body.phone);
  if (phone) req.body.phone = phone.replace(/^0+/, '');
  var errMsg = 'PHONE_ALREADY_EXISTS';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': req.body.email })
    errMsg = 'PHONE_EMAIL_ALREADY_EXISTS';
  }
  if (req.body.loginType == 'facebook' || req.body.loginType == 'google' || req.body.loginType == 'apple') {
    findOrCondition.push({ "$and": [{ 'loginType': req.body.loginType }, { "loginId": req.body.loginId }] })
    errMsg = 'PHONE_EMAIL_LOGINID_ALREADY_EXISTS';
  }
  // var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': req.body.phcode });
  // if (filterDocumet.length) {
  //   var phoneDigit = filterDocumet[0].phoneDigit;
  //   if ((req.body.phone).length != phoneDigit) return res.status(401).json({ 'success': false, 'message': "Phone No should be " + phoneDigit + " digit" });
  // }
  Rider.findOne({ $or: findOrCondition }, async function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('ERROR_SERVER') });
    if (user) {
      if (req.body.loginType == 'facebook' || req.body.loginType == 'google' || req.body.loginType == 'apple') {
        updateRiderLoginId(user._id, req.body.loginType, req.body.loginId);
      }
      return res.status(401).json({ 'success': true, 'message': errMsg });
    };

    var newDoc = new Rider();
    newDoc.fname = req.body.fname;
    newDoc.lname = req.body.lname;
    newDoc.email = req.body.email;
    newDoc.phone = req.body.phone;
    newDoc.gender = req.body.gender;
    newDoc.cnty = req.body.cnty;
    newDoc.cntyname = req.body.cntyname;
    newDoc.state = req.body.state;
    newDoc.statename = req.body.statename;
    newDoc.city = req.body.city;
    newDoc.cityname = req.body.cityname;
    newDoc.lang = req.body.lang;
    newDoc.cur = req.body.cur;
    newDoc.phcode = req.body.phcode;
    newDoc.fcmId = req.body.fcmId;
    newDoc.countryCode = req.body.countryCode;

    newDoc.scity = req.body.scity ? req.body.scity : null;
    newDoc.scId = req.body.scId ? req.body.scId : null;

    newDoc.loginType = req.body.loginType;
    newDoc.loginId = req.body.loginId;
    newDoc.mobileDetails = req.body.mobileDetails ? JSON.stringify(req.body.mobileDetails) : '';

    newDoc.nic = req.body.nic;

    if (req.body.loginType == 'facebook' || req.body.loginType == 'google' || req.body.loginType == 'apple') {
      newDoc.loginType = req.body.loginType;
      newDoc.loginId = req.body.loginId;
    } else {
      newDoc.setPassword(req.body.password);
    }

    newDoc.setReferal();

    if (featuresSettings.resBasedOnCurrency) {
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': req.body.phcode });
      if (filterDocumet.length) {
        newDoc.currencySymbol = filterDocumet[0].currencySymbol;
        newDoc.currencyCode = filterDocumet[0].currencyCode;
      }
      else {
        newDoc.currencySymbol = config.currencySymbol;
        newDoc.currencyCode = (config.currency).toUpperCase();
      }
    }

    newDoc.save((err, datas) => {
      if (err) {
        return res.json({ 'success': false, 'message': err.message, 'err': err });
      }
      var token = newDoc.generateJwt(datas._id, datas.email, datas.fname, "rider");
      var data = { name: datas.fname, email: datas.email, date: moment().format('LL'), phone: datas.phone };
      if (datas.email) sendEmail(datas.email, data, 'Welcome', req.headers['accept-language'])
      addRiderDatatoFb(datas);
      processSignupBonus(datas._id);
      if (req.body.referal) processReferalCode(req.body.referal, datas._id);
      return res.status(200).json({ 'success': true, 'message': req.i18n.__('REGISTERED_SUCCESSFULLY'), "datas": [{ "name": datas.fname, "email": datas.email }], token: token });
    })

  })

};

export const addAppData = (req, res) => {
  var phone = (req.body.phone);
  req.body.phone = phone.replace(/^0+/, '');
  var errMsg = 'PHONE_ALREADY_EXISTS';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': req.body.email })
    errMsg = 'PHONE_EMAIL_ALREADY_EXISTS';
  }
  if (req.body.loginType == 'facebook' || req.body.loginType == 'google' || req.body.loginType == 'apple') {
    findOrCondition.push({ "$and": [{ 'loginType': req.body.loginType }, { "loginId": req.body.loginId }] })
    errMsg = 'PHONE_EMAIL_LOGINID_ALREADY_EXISTS';
  }
  // var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': req.body.phcode });
  // if (filterDocumet.length) {
  //   var phoneDigit = filterDocumet[0].phoneDigit;
  //   if ((req.body.phone).length != phoneDigit) return res.status(401).json({ 'success': false, 'message': "Phone No should be " + phoneDigit + " digit" });
  // }
  Rider.findOne({ $or: findOrCondition }, async function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('ERROR_SERVER') });
    if (user) {
      if (req.body.loginType == 'facebook' || req.body.loginType == 'google' || req.body.loginType == 'apple') {
        updateRiderLoginId(user._id, req.body.loginType, req.body.loginId);
      }
      return res.status(401).json({ 'success': true, 'message': errMsg });
    };

    var filename = "", filepath = "", identityFilename = "", identityFilepath = "";
    var profileImg = req.files.profileImg;
    if (profileImg != undefined && profileImg.length) {
      filepath = profileImg[0].path;
      filename = profileImg[0].filename;
    }
    var identityImg = req.files.identityImg;
    if (identityImg != undefined && identityImg.length) {
      identityFilepath = identityImg[0].path;
      identityFilename = identityImg[0].filename;
    }

    var newDoc = new Rider();
    newDoc.fname = req.body.fname;
    newDoc.lname = req.body.lname;
    newDoc.email = req.body.email;
    newDoc.phone = req.body.phone;
    newDoc.gender = req.body.gender;
    newDoc.cnty = req.body.cnty;
    newDoc.cntyname = req.body.cntyname;
    newDoc.state = req.body.state;
    newDoc.statename = req.body.statename;
    newDoc.city = req.body.city;
    newDoc.cityname = req.body.cityname;
    newDoc.lang = req.body.lang;
    newDoc.cur = req.body.cur;
    newDoc.phcode = req.body.phcode;
    newDoc.fcmId = req.body.fcmId;
    newDoc.scity = req.body.scity ? req.body.scity : null;
    newDoc.scId = req.body.scId ? req.body.scId : null;
    newDoc.loginType = req.body.loginType;
    newDoc.loginId = req.body.loginId;
    newDoc.mobileDetails = req.body.mobileDetails ? JSON.stringify(req.body.mobileDetails) : '';
    newDoc.nic = req.body.nic;
    newDoc.isProfileImgMatchVerified = req.body.isProfileImgMatchVerified;
    newDoc.profileImgMatchStatus = req.body.profileImgMatchStatus;
    newDoc.profileSimilarityPerc = req.body.profileSimilarityPerc ? req.body.profileSimilarityPerc : 0;

    if (req.body.loginType == 'facebook' || req.body.loginType == 'google' || req.body.loginType == 'apple') {
      newDoc.loginType = req.body.loginType;
      newDoc.loginId = req.body.loginId;
    } else {
      newDoc.setPassword(req.body.password);
    }

    newDoc.setReferal();

    if (featuresSettings.resBasedOnCurrency) {
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': req.body.phcode });
      if (filterDocumet.length) {
        newDoc.currencySymbol = filterDocumet[0].currencySymbol;
        newDoc.currencyCode = filterDocumet[0].currencyCode;
      }
      else {
        newDoc.currencySymbol = config.currencySymbol;
        newDoc.currencyCode = (config.currency).toUpperCase();
      }
    }
    if (filepath) {
      newDoc.profile = filepath;
    }
    if (identityFilepath) {
      newDoc.identityImagePath = identityFilepath;
    }

    newDoc.save((err, datas) => {
      if (err) {
        return res.json({ 'success': false, 'message': err.message, 'err': err });
      }
      var token = newDoc.generateJwt(datas._id, datas.email, datas.fname, "rider");
      var data = { name: datas.fname, email: datas.email, date: moment().format('LL'), phone: datas.phone };
      if (datas.email) sendEmail(datas.email, data, 'Welcome', req.headers['accept-language'])
      addRiderDatatoFb(datas);
      processSignupBonus(datas._id);
      processReferalCode(req.body.referal, datas._id);
      return res.status(200).json({ 'success': true, 'message': req.i18n.__('REGISTERED_SUCCESSFULLY'), "datas": [{ "name": datas.fname, "email": datas.email }], token: token });
    })

  })

};

export const updateRiderLoginId = (userId, loginType, loginId) => {
  Rider.findOneAndUpdate({ _id: userId }, {
    loginType: loginType,
    loginId: loginId,
  }, { new: true }, (err, todo) => {
    if (err) console.log('updateRiderLoginId err', err);
    return console.log('updateRiderLoginId success');
  });
};

export const addRiderDataFromHail = (req, res, next) => {
  var phone = (req.body.phone);
  req.body.phone = phone.replace(/^0+/, '');
  var errMsg = 'Phone No. already Exists.';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': req.body.email })
    errMsg = 'Phone No. Or Email already Exists.';
  }

  Rider.findOne({ $or: findOrCondition }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('ERROR_SERVER') });
    if (user) {
      var randomSMS = GFunctions.sendRandomizeCode('0', 8);
      req.body.riderName = user.fname;
      req.body.riderId = user._id;
      next();
    } else {
      var newDoc = new Rider();
      newDoc.fname = req.body.fname ? req.body.fname : req.body.phone;
      newDoc.lname = req.body.lname ? req.body.lname : '';
      newDoc.email = req.body.email ? req.body.email : '';
      newDoc.phone = req.body.phone;
      // newDoc.setPassword(config.resetPasswordTo);
      newDoc.setPassword(randomSMS);
      newDoc.setReferal();
      newDoc.phcode = config.phoneCode;

      newDoc.save((err, datas) => {
        if (err) {
          return res.json({ 'success': false, 'message': err.message, 'err': err });
        }
        addRiderDatatoFb(datas);
        var data = { name: datas.fname };
        if (req.body.email) sendEmail(req.body.email, data, 'Welcome', req.headers['accept-language']);
        smsGateway.sendSmsMsg(req.body.phone, '', req.body.phcode, '', 'sendPasswordToUser', { 'PASSWORD': randomSMS });
        req.body.riderId = datas._id;
        req.body.riderName = req.body.fname;
        next();
      })

    }
  })
};

export const addRiderDataFromMTD = (req, res, next) => {
  if (req.body.newuser != 1) {
    req.name = req.body.fname;
    req.userId = req.body.userId;
    next();
  } else {
    var phone = (req.body.phone);
    req.body.phone = phone.replace(/^0+/, '');
    req.body.phcode = req.body.phcode ? req.body.phcode : config.phoneCode
    var errMsg = 'Phone No. already Exists.';
    var findOrCondition = [{ "$and": [{ 'phone': req.body.phone, 'phcode': req.body.phcode }] }];
    if (req.body.email) {
      findOrCondition.push({ 'email': req.body.email })
      errMsg = 'Phone No. Or Email already Exists.';
    }

    Rider.findOne({ $or: findOrCondition }, function (err, user) {
      if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('ERROR_SERVER') });
      if (user) return res.status(401).json({ 'success': false, 'message': errMsg });

      var newDoc = new Rider();
      newDoc.fname = req.body.fname;
      newDoc.lname = req.body.lname;
      newDoc.email = req.body.email;
      newDoc.phone = req.body.phone;
      newDoc.setPassword(config.resetPasswordTo);
      newDoc.setReferal();
      newDoc.phcode = req.body.phcode ? req.body.phcode : config.phoneCode;

      newDoc.save((err, datas) => {
        if (err) {
          return res.json({ 'success': false, 'message': err.message, 'err': err });
        }
        req.body.userId = datas._id;
        addRiderDatatoFb(datas);
        req.name = req.body.fname;
        req.userId = datas._id;
        next();
      })
    })
  }
};


export const addRiderDatatoFb = (datas) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    current_tripid: "0",
    email_id: datas.email ? datas.email : "",
    name: datas.fname ? datas.fname : "",
    tripstatus: "",
    tripdriver: "",
    requestId: ""
  };
  var id = datas._id.toString();
  var usersRef = ref.child(id);

  usersRef.set(requestData, function (snapshot) {
    // return res.json({'success':true,'message':'Password Updated Successfully', 'snap' :  snapshot});
  });
}

/**
 * Process Referal : Check code, get amount, update wallet
 * @input
 * @param
 * @return
 * @response
 */
export const processReferalCode = (referalCode, userId) => {
  if (featuresSettings.referalSettings.isRiderReferalCodeAvailable && referalCode) {
    Rider.findOne({ referal: referalCode }, function (err, docs) {
      if (err) {  }
      else if (docs) {
        var referalAmt = featuresSettings.referalSettings.riderReferalAmount;
        var refererAmt = featuresSettings.referalSettings.riderRefererAmount;
        if (refererAmt) { //who gaves code
          addAmtToReferalWallet(docs._id, referalCode, refererAmt);
        }
        if (referalAmt) { //who uses code
          // createWalletAndaddAmtToUser(userId, referalCode, config.referalAmt);
          addAmtToReferalWallet(userId, referalCode, referalAmt);
        }
      }
    });
  }
}

export const processSignupBonus = (userId) => {
  if (featuresSettings.riderSignupBonus) {
    var refererAmt = featuresSettings.riderSignupBonusAmount;
    var referalCode = GFunctions.sendRandomizeCode('Aa0!', 6);
    addAmtToReferalWallet(userId, referalCode, refererAmt, 'Signup Bonus');
  }
}



/**
 * Add Amount To Given User Wallet
 * @input
 * @param
 * @return
 * @response
 */
export const addAmtToReferalWallet = (userId, trxid = '', amount = 0, desc = 'reference') => {
  var tranxData = {
    trxid: trxid,
    amt: parseFloat(amount),
    date: GFunctions.sendTimeNow(),
    type: 'Credit',
    for: desc,
  }

  // 1.chk Wallet
  Wallet.findOne({ ridid: userId }, function (err, doc1) {
    if (err) { }
    else if (!doc1) {

      //Add New Wallet Details
      var newDoc = new Wallet(
        {
          ridid: userId,
          bal: amount,
          trx: tranxData
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
        } else {
          if (docs) {
          }
        }
      })
      //Add New Wallet Details

    } else if (doc1) {

      Wallet.findOneAndUpdate({ ridid: userId }, {
        $push: { trx: tranxData }
      }, { 'new': true },
        function (err, doc) {
          if (err) {
          } else {
            if (doc) {
              updateWalletBal(doc._id, amount);
            }
          }
        }
      );
    }
  })
  // 1.chk Wallet
}

export const addWalletSettlementData = (req, res) => {
  if (typeof req.body.riderId === "undefined" || req.body.riderId === "") {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") })
  }
  var addeddate = GFunctions.getDateTimeinThisFormat(req.body.paymentDate, "YYYY-MM-DD");
  Wallet.findOne({ ridid: req.body.riderId }, function (err, doc) {
    if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    else if (!doc) {
      var id1 = new ObjectId;

      var newdoc = new Wallet
        ({
          ridid: req.body.riderId,
          bal: 0,
          trx: {
            _id: id1,
            trxid: req.body.trxId,
            for: req.body.description,
            amt: req.body.amt,
            type: req.body.type,
            date: addeddate,
            bal: 0
          },
        });

      newdoc.save((err, docs) => {
        if (err) {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
        }
        var tranx = newdoc.trx.id(id1);
        let Tranxamt = tranx.amt;
        let Tranxbal = tranx.bal;
        let types = tranx.type;
        var total;
        var total1;
        if (types == 'debit') {
          total = parseFloat(parseFloat(docs.bal) - parseFloat(Tranxamt)).toFixed(2);
        }
        if (types == 'credit') {
          total = parseFloat(parseFloat(docs.bal) + parseFloat(Tranxamt)).toFixed(2);
        }
        docs.bal = total;
        tranx.bal = total;

        docs.save(function (err, docs) {
          if (err) {
            return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR_UPDATING'), 'error': err });
          }
          else {
            updateRiderBalanceInMongo(req.body.riderId, req.body.amt, req.body.type)
            return res.json({ 'success': true, 'message': req.i18n.__('RIDER_AMOUNT_SUCCESS'), 'docs': docs });
          }
        })
      })
    }
    else if (doc) {
      var id1 = new ObjectId;

      var trxdetails =
      {
        _id: id1,
        trxid: req.body.trxId,
        for: req.body.description,
        amt: req.body.amt,
        type: req.body.type,
        date: addeddate,
        bal: 0
      }
      Wallet.findOneAndUpdate({ ridid: req.body.riderId }, { $push: { trx: trxdetails } }, { 'new': true }, function (err, docs) {
        if (err) {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR_UPDATING'), 'error': err });
        }
        var tranx = docs.trx.id(id1);
        let Tranxamt = tranx.amt;
        let Tranxbal = tranx.bal;
        let types = tranx.type;
        var total;
        var total1;
        if (types == 'debit') {
          total = parseFloat(parseFloat(docs.bal) - parseFloat(Tranxamt)).toFixed(2);
        }
        if (types == 'credit') {
          total = parseFloat(parseFloat(docs.bal) + parseFloat(Tranxamt)).toFixed(2);
        }
        docs.bal = total;
        tranx.bal = total;

        docs.save(function (err, docs) {
          if (err) {
            return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR_UPDATING'), 'error': err });
          }
          else {
            updateRiderBalanceInMongo(req.body.riderId, req.body.amt, req.body.type)
            return res.json({ 'success': true, 'message': req.i18n.__('DRIVER_ACCOUNT_ADDED_SUCCESSFULLY'), 'docs': docs });
          }
        })
      })
    }
  });
}

export const updateRiderBalanceInMongo = async (riderId, amtToDebit, type = "credit") => {
  try {
    let RiderWallet = await Rider.findById(riderId, { balance: 1 });
    if (type == "credit") {
      RiderWallet.balance = Number(RiderWallet.balance) + Number(amtToDebit);
    }
    if (type == "debit") {
      RiderWallet.balance = Number(RiderWallet.balance) - Number(amtToDebit);
    }
    updateBalanceAmountinFB(riderId, RiderWallet.balance);
    RiderWallet.save();
  }
  catch (err) {
  }
}

/**
 * Update Wallet Bal.
 * @input
 * @param
 * @return
 * @response
 */
function updateWalletBal(walletId, amount) {
  Wallet.findById(walletId, function (err, docs) {
    if (err) { } else if (!docs) { }
    else {
      let oldbal = docs.bal;
      let newbal = parseFloat(oldbal) + parseFloat(amount);
      docs.bal = newbal;
      docs.save(function (err, op) {
        if (err) {
        }
        else {
        }

      })
    }
  });
}


/**
 * Update rider Details
 * @input
 * @param
 * @return
 * @response
 */
export const updateData = (req, res) => {
  var phone = (req.body.phone);
  req.body.phone = phone.replace(/^0+/, '');
  var errMsg = 'Phone No. already Exists.';
  var findOrCondition = [{ "$and": [{ 'phone': req.body.phone }, { "phcode": req.body.phcode }] }];
  if (req.body.email) {
    findOrCondition.push({ 'email': req.body.email })
    errMsg = 'Phone No. Or Email already Exists.';
  }
  var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': req.body.phcode });
  if (filterDocumet.length) {
    var phoneDigit = filterDocumet[0].phoneDigit;
    if ((req.body.phone).length != phoneDigit) return res.status(401).json({ 'success': false, 'message': "Phone No should be " + phoneDigit + " digit" });
  }
  Rider.findOne({ '$and': [{ '_id': { $ne: req.body._id } }, { $or: findOrCondition }] }, function (err, user) {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
    if (user) return res.status(401).json({ 'success': false, 'message': errMsg });

    var isStarExistsInPhone = GFunctions.isStarExistsInString(req.body.phone);
    var isStarExistsInEmail = GFunctions.isStarExistsInString(req.body.email);

    var newDoc =
    {
      fname: req.body.fname,
      lname: req.body.lname,
      gender: req.body.gender,
      lang: req.body.lang,
      cur: req.body.cur,
      scId: req.body.scId,
      nic: req.body.nic,

      scity: req.body.scity,
      cnty: req.body.cnty,
      cntyname: req.body.cntyname,
      state: req.body.state,
      statename: req.body.statename,
      city: req.body.city,
      cityname: req.body.cityname,
      status: req.body.status,
      countryCode: req.body.countryCode
    }

    if (!isStarExistsInPhone) newDoc.phone = req.body.phone;
    if (!isStarExistsInEmail) newDoc.email = req.body.email;

    Rider.findOneAndUpdate({ _id: req.body._id }, newDoc, { new: true }, (err, todo) => {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__('DETAILS_UPDATED'), todo });
    });
  })
};

/**
 * Delete rider Details 
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const deleteRider = async (req, res) => {
  Rider.findOne({ '_id': req.params.id, curStatus: "free" }, (err, doc) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    if (doc) {
      Rider.findByIdAndRemove(req.params.id, async (err, docs) => {
        if (err) {
          return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        }
        else {
          var data = await Wallet.deleteOne({ 'ridid': req.params.id })
          removeFromFB(req.params.id);
          return res.json({ 'success': true, 'message': req.i18n.__('Rider Deleted successfully') });
        }
      })
    }
    if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("RIDER_IN_TRIP"), doc });
  })
}

function removeFromFB(riderId) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");

  // var requestData = {
  //   FCM_id: ""
  // };

  var child = (riderId).toString();
  var usersRef = ref.child(child);
  usersRef.remove();
  // usersRef.update(requestData, function (error) {
  //   if (error) {
  //     logger.error(err);
  //   } else {
  //   } // Send FCM 
  // });
}

/**
 * Inactivate rider
 * @input
 * @param
 * @return
 * @response
 */
export const deleteData = (req, res) => {
  /*   Rider.findByIdAndRemove(req.params.id, (err,docs) => {
      if(err){
        return res.json({'success':false,'message':req.i18n.__('SOME_ERROR')});
      }
      return res.json({'success':true,'message':'Rider Details Deleted successfully'});
    }) */

  var update = {
    "softdel": 'inactive'
  }
  Rider.findOneAndUpdate({ _id: req.params.id }, update, { new: true }, (err, doc) => {
    if (err) { return res.status(401).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'err': err }); }
    else {
      updateRiderActiveStatusInFB(req.params.id, 'inactive');
      return res.json({ 'success': true, 'message': req.i18n.__('RIDER_INACTIVE_SUCCESS') });
    }
  })

}

export const riderActivate = (req, res) => {
  var update = {
    "softdel": 'active'
  }
  Rider.findOneAndUpdate({ _id: req.params.id }, update, { new: true }, (err, doc) => {
    if (err) { return res.status(401).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'err': err }); }
    else {
      updateRiderActiveStatusInFB(req.params.id, 'active');
      return res.json({ 'success': true, 'message': req.i18n.__('RIDER_ACTIVE_SUCCESS') });
    }
  })
}


function updateRiderActiveStatusInFB(riderId, status) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    active_status: status
  };
  var child = riderId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);

  usersRef.update(requestData, function (error) {
    if (error) { logger.error(error); } else {
    }
  });

}

/**
 * Get Referal Amt As set by admin
 * @input
 * @param
 * @return Amount in USD
 * @response
 */
function validateAndGetAmt(referalCode) {
  return 10;
}

/**
 * create Empty Wallet And add Amt To User
 * @input
 * @param
 * @return
 * @response
 */
function createWalletAndaddAmtToUser(userId, referalCode, referalAmt) {
  Rider.findById(userId, function (err, docs) {
    if (err) { } else if (!docs) { }
    else {

      docs.card.id = referalCode;
      docs.card.currency = 'usd';
      docs.card.last4 = '';

      docs.save(function (err, op) {
        if (err) {  }
        else {
          addCardDetailsToWallet(userId, referalCode, referalAmt);
        }
      })

    }
  });
}

/**
 * Add CardDetails To Wallet
 * @input
 * @param
 * @return
 * @response
 */
function addCardDetailsToWallet(userId, referalCode, referalAmt) {
  // 1.chk Wallet
  Wallet.findOne({ ridid: userId }, function (err, doc) {
    if (err) { }
    else if (!doc) {

      //Add New Wallet Details
      var newDoc = new Wallet(
        {
          ridid: userId,
          bal: 0,
          stripe: {
            id: referalCode,
            currency: 'usd',
            last4: ''
          }
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
        } else {
          addAmtToReferalWallet(userId, referalCode, referalAmt);
        }
      })
      //Add New Wallet Details


    } else if (doc) {

      doc.stripe.id = userId;
      doc.stripe.currency = 'usd';
      doc.stripe.last4 = '';
      doc.save(function (err, op) {
        if (err) {
        }
        else {
          addAmtToReferalWallet(userId, referalCode, referalAmt);
        }
      })

    }
  })
  // 1.chk Wallet
}



export const getData = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = req.scId[0];
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$eq": req.query.scity_like };
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  var totalCount = 10;
  // (/true/i)
  if (req.query.status_like != undefined) {
    likeQuery["status"] = likeQuery["status"].test("true");
  }

  let TotCnt = Rider.find(likeQuery).count();
  // let Datas = Rider.find(likeQuery, { "hash": 0, "salt": 0 }).skip(pageQuery.skip).limit(pageQuery.take);
  let Datas = Rider.aggregate([
    { '$match': likeQuery },
    skip, limit
  ])
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

export const login = (req, res) => {
 try{
  var riderWhere = {};
  var userName = req.body.username ? req.body.username : req.body.email;
  if (/^[0-9]*$/.test(userName)) {
    var phone = userName;
    userName = phone.replace(/^0+/, '');
  }
  var checkPassword = true;
  if (req.body.loginType == 'facebook' || req.body.loginType == 'google' || req.body.loginType == 'apple') {
    riderWhere = { 'loginType': req.body.loginType, 'loginId': req.body.loginId };
    checkPassword = false;
  } else {
    riderWhere = { $or: [{ "$and": [{ 'phone': userName }] }, { 'email': (userName).toLowerCase() }] };
  }

  Rider.findOne(riderWhere, function (err, user) {

    var newDoc = Rider();
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('ERROR_SERVER') });
    if (!user) return res.status(404).json({ 'success': false, 'message': req.i18n.__('USER_NOT_FOUND') });
    if (user.softdel == 'inactive') return res.status(401).json({ 'success': false, 'message': req.i18n.__("ACCOUNT_WAS_INACTIVATED_BY_ADMIN") });
    if (checkPassword) {
      var passwordIsValid = newDoc.validPassword(req.body.password, user.salt, user.hash);
      if (!passwordIsValid) return res.status(401).json({ 'success': false, 'message': req.i18n.__('INVALID_PASSWORD') });
    }
    var token = newDoc.generateJwt(user._id, user.email, user.fname, "rider");
    addFCMId(req.body.fcmId, user._id, req.body.mobileDetails);
    res.status(200).json({ 'success': true, 'message': req.i18n.__('LOGIN_SUCCESS'), token: token });
  })
}catch(err){
  console.log("__________________error",err.message.toString());
}
}

function addFCMId(fcmId, userid, mobileDetails = {}) {
  var update = {
    fcmId: fcmId,
    isLogin: true,
    mobileDetails: JSON.stringify(mobileDetails),
  }
  Rider.findOneAndUpdate({ _id: userid }, update, { new: true }, (err, doc) => {
    if (err) { console.log("addFCMId", err); }
    else { console.log("addFCMId", fcmId); }
  })
}

export const getAppData = (req, res) => {
  Rider.find({ _id: req.userId }, { hash: 0, salt: 0 }).exec(async (err, docs) => {
    if (err) {
      return res.json([]);
    }
    if (docs.length) {
      /*      docs.push({  profileurl: config.baseurl+docs[0].profile  });
            return res.json(docs);*/

      var resObj = formatProfileRes(docs[0]);
      var resArray = [resObj];
      resArray.push({ profileurl: config.baseurl + docs[0].profile });
      let language = config.appDefaultLanguageCode;
      if (req.headers['accept-language'] && req.headers['accept-language'].length < 3) {
        language = (req.headers['accept-language']) ? req.headers['accept-language'] : config.appDefaultLanguageCode;
      }
      var cancelReason = await CancelReasons.findOne({ "language": language }, { 'riderCancelReason': 1 });
      if (cancelReason) {
        resArray.push({ "riderCancellationReasons": cancelReason.riderCancelReason })
      }else {
        resArray.push({ "riderCancellationReasons": "" })
      }

      var configData = {
        "googleApiAutoComplete": config.AndroidDtaxiAPI,
        "googleApi": config.AndroidDtaxiAPI,
        "iosgoogleApi": config.IOSDtaxiAPI,
        "fcmServer": config.fcmServer,
        "adminfcmServer": config.fcmServer,
        "baseurl": config.baseurl,
        "applink": config.applink,
        "shareTrip": config.shareTrip,
        "requestRadius": config.requestRadius,
        "rentalRequestRadius": config.rentalRequestRadius,
        "outstationRequestRadius": config.outstationRequestRadius,
        "currency": config.currency,
        "currencySymbol": config.currencySymbol,
        "distanceUnit": config.distanceUnit,
        "distanceSymbol": config.distanceSymbol,
        "companyaddress": config.companyaddress,
        "companymail": config.companymail,
        "supportNo": config.supportNo,
        "neededOutstationFlow": config.neededOutstationFlow,
        "needRentalFlow": config.needRentalFlow,
      }
      resArray.push({ "configData": configData });
      return res.json(resArray);

    }
    else {
      return res.json([]);
    }
  })
}

function formatProfileRes(doc) {
  var newObj = {
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
    "nic": doc.nic,
    "currencySymbol": doc.currencySymbol,
    "currencyCode": doc.currencyCode,
    "supportNo": config.supportNo,
  };
  return newObj;
}

export const updateAppData = async (req, res) => {
  var RiderData = await Rider.findOne({ '_id': { $ne: req.userId }, 'email': req.body.email })
  if (req.body.email && RiderData) {
    return res.status(401).json({ 'success': false, 'message': "Email already Exists" });
  }

  var filename = "";
  var filepath = "";
  if (req['file'] != null) {
    req.body.profile = req['file'].path;
    filename = req['file'].filename;
    filepath = req['file'].path;
  } else { }

  var updateData = {
    fname: req.body.fname,
    //phcode: req.body.phcode,
    lname: req.body.lname,
    email: req.body.email,
    nic: req.body.nic,
    cnty: req.body.cnty,
    state: req.body.state,
    city: req.body.city,
    lang: req.body.lang,
    cur: req.body.cur,
    gender: req.body.gender
  };

  if (filepath) {
    updateData.profile = filepath;
  }

  Rider.findOneAndUpdate({ _id: req.userId }, updateData, { new: true }, (err, doc) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    if (filepath == "") { filepath = doc ? doc.profile : "public/file-default.png"; }
    return res.json({ 'success': true, 'message': req.i18n.__('PROFILE_UPDATED_SUCCESSFULLY'), "request": req.body, 'fileurl': config.baseurl + filepath });
  })
}

export const updateAppDataWithFaceComparision = async (req, res) => {
  var RiderData = await Rider.findOne({ '_id': { $ne: req.userId }, 'email': req.body.email })
  if (req.body.email && RiderData) {
    return res.status(401).json({ 'success': false, 'message': "Email already Exists" });
  }

  var filename = "", filepath = "", identityFilename = "", identityFilepath = "";
  var profileImg = req.files.profileImg;
  if (profileImg != undefined && profileImg.length) {
    filepath = profileImg[0].path;
    filename = profileImg[0].filename;
  }
  var identityImg = req.files.identityImg;
  if (identityImg != undefined && identityImg.length) {
    identityFilepath = identityImg[0].path;
    identityFilename = identityImg[0].filename;
  }

  var updateData = {
    fname: req.body.fname,
    //phcode: req.body.phcode,
    lname: req.body.lname,
    email: req.body.email,
    nic: req.body.nic,
    cnty: req.body.cnty,
    state: req.body.state,
    city: req.body.city,
    lang: req.body.lang,
    cur: req.body.cur,
    gender: req.body.gender,
    isProfileImgMatchVerified: req.body.isProfileImgMatchVerified,
    profileImgMatchStatus: req.body.profileImgMatchStatus,
    profileSimilarityPerc: req.body.profileSimilarityPerc ? req.body.profileSimilarityPerc : 0
  };

  if (filepath) {
    updateData.profile = filepath;
  }
  if (identityFilepath) {
    updateData.identityImagePath = identityFilepath;
  }

  Rider.findOneAndUpdate({ _id: req.userId }, updateData, { new: true }, (err, doc) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    if (filepath == "") { filepath = doc ? doc.profile : "public/file-default.png"; }
    return res.json({ 'success': true, 'message': req.i18n.__('PROFILE_UPDATED_SUCCESSFULLY'), "request": req.body, 'fileurl': config.baseurl + filepath });
  })
}

export const riderChangePhoneNumber = (req, res) => {
  var phone = req.body.phone;
  req.body.phone = phone.replace(/^0+/, '');
  var updateData = {
    phone: req.body.phone,
  };

  Rider.findOneAndUpdate({ _id: req.userId }, updateData, { new: true }, (err, doc) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    return res.json({ 'success': true, 'message': req.i18n.__('PHONE_UPDATED_SUCCESSFULLY'), "request": req.body });
  })

}

export const riderImage = (req, res) => {
  var filename = "";
  var filepath = "";
  if (req['file'] != null) {
    req.body.profile = req['file'].path;
    filename = req['file'].filename;
    filepath = req['file'].path;
  } else { }
  var updateData = {};
  if (filepath) {
    updateData.profile = filepath;
  }

  Rider.findOneAndUpdate({ _id: req.userId }, updateData, { new: true }, (err, doc) => {
    if (filepath == "") { filepath = doc.profile; }
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    return res.json({ 'success': true, 'message': req.i18n.__('PROFILE_UPDATED_SUCCESSFULLY'), "request": req.body, 'fileurl': config.baseurl + filepath });
  })

}

export const updatePassword = (req, res) => {
  if (req.body.newpassword != req.body.confirmpassword) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__('NEW_CONFIRM_PASSWORD_DIFFERENT') });
  }

  Rider.findById(req.userId, function (err, docs) {
    if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    else {
      if (!docs) return res.status(409).json({ 'success': false, 'message': req.i18n.__('USER_NOT_FOUND') });
      var newDoc = Rider();
      var passwordIsValid = newDoc.validPassword(req.body.oldpassword, docs.salt, docs.hash);
      if (!passwordIsValid) return res.status(409).json({ 'success': false, 'message': req.i18n.__('INVALID_PASSWORD') });
      var obj = newDoc.getPassword(req.body.newpassword);
      var update = {
        salt: obj.salt,
        hash: obj.hash
      }
      Rider.findOneAndUpdate({ _id: req.userId }, update, { new: false }, (err, doc) => {
        if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
        return res.json({ 'success': true, 'message': req.i18n.__('PASSWORD_UPDATED') });
      })
    }
  });

}

//Emergency Contact
export const addEmgContact = (req, res) => {
  var updateData = {
    name: req.body.name,
    number: req.body.number
  }
  Rider.findByIdAndUpdate(req.userId, {
    $push: { EmgContact: updateData }
  }, { 'new': true },

    function (err, doc) {
      if (err) {
        return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
      }
      return res.json({ 'success': true, 'message': req.i18n.__('CONTACT_SUCCESS'), 'contacts': doc.EmgContact });
    }
  );
}

export const getEmgContact = (req, res) => {
  Rider.find({ _id: req.userId }, { hash: 0, salt: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    if (docs.length) {
      return res.json(docs[0].EmgContact);
    }
    else {
      return res.json([]);
    }
  })
}

export const delEmgContact = (req, res) => {
  Rider.findOne({ _id: req.userId }).exec((err, docs) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    if (!docs) return res.json({ 'success': false, 'message': req.i18n.__('USER_NOT_FOUND'), 'error': err });
    docs.EmgContact.remove(req.body.emgContactId);
    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__('DELETED_SUCCESSFULLY'), 'contacts': docs.EmgContact });
    });
  })
}

export const putEmgContact = (req, res) => {
  Rider.findById(req.userId, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    var EmgContact = docs.EmgContact.id(req.body.emgContactId);

    taxi.name = req.body.name;
    taxi.number = req.body.number;

    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__('UPDATED_SUCCESSFULLY'), 'drivertaxis': docs.EmgContact });
    });

  });
}

//Emergency Contact

export const getRidersAddress = async (req, res) => {
  try {
    let addressCheck = await Rider.findOne({ _id: req.userId }, { address: 1 });
    return res.json({ 'success': true, 'message': req.i18n.__('FAV_ADDRESS'), 'Address': addressCheck.address })
  } catch (err) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err })
  }
}

/**
 * Add Driver Address , for : home / work
 * @input
 * @param
 * @return
 * @response
 */
export const addRidersAddress = async (req, res) => {
  try {
    var lable = req.body.lable ? req.body.lable : req.body.for;

    let addressCheck = await Rider.findOne({ _id: req.userId, 'address.lable': lable }, { 'address.$': 1 });
    if (addressCheck == null) {
      Rider.findByIdAndUpdate(req.userId,
        {
          "$push": {
            address: {
              lable: lable,
              address: req.body.address,
              Coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
            }
          }
        }
        , { new: true }, function (err, docs) {
          if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
          else { return res.json({ 'success': true, 'message': req.i18n.__('ADDRESS_ADDED_SUCCESS'), 'Address': docs.address }) }
        });
    }

    else {
      Rider.findById(req.userId, function (err, update) {
        if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }) }
        var Address = update.address.id(addressCheck.address[0]._id);
        Address.lable = lable;
        Address.address = req.body.address;
        Address.Coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];

        update.save((err, docs) => {
          if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }) }
          return res.json({ 'success': true, 'message': req.i18n.__('ADDRESS_UPDATE_SUCCESS'), 'Address': docs.address })
        })
      })
    }
  }
  catch (err) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err })
  }
}

/**
 * Delete Driver Address , for : home / work
 * @input
 * @param
 * @return
 * @response
 */
export const deleteRiderAddress = (req, res) => {
  Rider.update({ _id: req.userId }, { '$pull': { address: { _id: req.params.addressId } } }, function (err, docs) {
    if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
    else { return res.json({ 'success': true, 'message': req.i18n.__('ADDRESS_DELETE_SUCCESS') }) }
  });
}


/**
 * Reset Password
 * @input
 * @param
 * @return
 * @response
 */
export const riderResetPassword = (req, res) => {

  Rider.findOne({ phone: req.body.phone }, function (err, docs) {
    if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
    else if (!docs) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__('PHONE_NO_IS_INVALID') });
    }
    else {
      docs.setPassword(req.body.password);
      docs.save(function (err, op) {
        if (err) { return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
        else { return res.json({ 'success': true, 'message': req.i18n.__('PASSWORD_RESETED') }) }
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
      return console.log(error);
    }
  });
  // });

}

export const riderById = (req, res) => {

  Rider.find({ _id: req.params.id }, { "pwd": 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });

}


export const updateRiderOldBalanceDetails = async (riderId, amtToReduce) => {
  try {
    let RiderWallet = await Rider.findById(riderId, { balance: 1 });
    var bal = Number(RiderWallet.balance) + Number(amtToReduce);
    RiderWallet.balance = bal;
    updateBalanceAmountinFB(riderId, RiderWallet.balance);
    RiderWallet.save()
    updateRiderWalletTransaction(riderId, amtToReduce, "", "Cancellation - Repay", 'Credit');
  }
  catch (err) {
  }
}


/*
checkBalanceLimit
*/
export const updateBalanceAmountinFB = (riderId, balance) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }

  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    oldBalance: balance
  };
  var child = riderId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);

  usersRef.update(requestData, function (error) {
    if (error) { console.log(error); } else {
    }
  });

}

export const addCancelationAmtToRider = async (riderId, tripId) => {
  try {
    let tripData = await Trips.findOne({ tripno: tripId }, { 'csp.riderCancelFee': 1 });
    var amtToDebit = tripData.csp.riderCancelFee;
    updateRiderWalletCredits(riderId, amtToDebit);
  }
  catch (err) {
  }
}

export const updateRiderWalletCredits = async (riderId, amtToDebit) => {
  try {
    let RiderWallet = await Rider.findById(riderId, { balance: 1, canceledCount: 1, lastCanceledDate: 1 });
    checkCancellationLimit(riderId, RiderWallet.canceledCount, RiderWallet.lastCanceledDate, RiderWallet.balance);
    RiderWallet.balance = Number(RiderWallet.balance) + Number(amtToDebit);
    updateBalanceAmountinFB(riderId, RiderWallet.balance);
    RiderWallet.save()
  }
  catch (err) {
  }
}

/*
Check Cancelation limit and Inc Count for Today
*/
export const checkCancellationLimit = async (riderId, canceledCount, lastCanceledDate, balance) => {
  try {
    // format the current date
    var now = moment();
    var today = now.format("DD-MM-YYYY");
    var lcd = lastCanceledDate;
    var newCanceledCount = 1;
    if (lcd == today) {
      newCanceledCount = Number(canceledCount) + 1;
    }
    Rider.findByIdAndUpdate(riderId,
      {
        'canceledCount': newCanceledCount,
        'lastCanceledDate': today,
      }
      , { new: true }, function (err, docs) {
        if (err) {  }
        checkCancelLimitAndUpdateFB(riderId, canceledCount, lastCanceledDate);
      });
  }
  catch (err) {
    console.log(err)
  }
}

export const getRiderWalletDetails = async (riderId) => {
  if (riderId) {
    let doc = await Rider.findById(riderId, { balance: 1, canceledCount: 1, lastCanceledDate: 1 });
    //var doc = await Wallet.findOne({ 'ridid': riderId })
    if (!doc) return { 'success': false }
    else {
      if (doc.balance >= 0) return { 'success': false }
      else {
        var balance = (doc.balance).toString().replace('-', '');
        return { 'success': true, 'balance': balance }
      }
    }
  }
  else return { 'success': false }
}

export const riderForgotPassword = (req, res) => {
  var userName = req.body.email;
  if (/^[0-9]*$/.test(userName)) {
    var phone = userName;
    userName = phone.replace(/^0+/, '');
  }

  var message;
  Rider.findOne({ "$or": [{ 'email': userName }, { 'phone': userName }] }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("NOT_FOUND") }) }

    doc.verificationCode = GFunctions.sendRandomizeCode('0', 6)

    doc.save((err, userDoc) => {
      if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
      if ((featuresSettings.passwordVerificationMethodForUser == 'email') || (featuresSettings.passwordVerificationMethodForUser == 'both')) {
        var data = { name: userDoc.fname, email: userDoc.email, otp: userDoc.verificationCode, url: config.baseurl + 'api/riderChangePassword/' + userDoc.verificationCode + '/' + userDoc._id };
        sendEmail(userDoc.email, data, 'Reset password', req.headers['accept-language'])
        message = req.i18n.__("PASSWORD_VERIFICATION_CODE_TO_MAIL")
      }
      else if ((featuresSettings.passwordVerificationMethodForUser == 'sms') || (featuresSettings.passwordVerificationMethodForUser == 'both')) {
        var msg = notificationContent[notificationContent.defaultLanguage]['forgotPasswordRider'] + config.appName + ' ' + userDoc.verificationCode;
        smsGateway.sendSmsMsg(userDoc.phone, '', userDoc.phcode, '', 'forgotPasswordRider', { 'OTPCODE': userDoc.verificationCode });
        message = req.i18n.__("PASSWORD_VERIFICATION_CODE_TO_MBL")
      }
      return res.status(200).json({ 'success': true, 'message': message, 'OTP': userDoc.verificationCode })
    })
  })
}

export const changePasswordTemplate = (req, res) => {
  fs.readFile(__dirname + '/html/changePasswordForApp.html', 'utf8', (err, template) => {
    var params = {
      loginRedirectUrl: config.landingurl,
      url: config.baseurl + 'api/riderChangePassword/',
      id: req.params.code + '/' + req.params.id,
    }
    var html = Mustache.render(template, params);
    return res.send(html)
  });
}

export const changePassword = (req, res) => {
  if (req.body.newPwd != req.body.conPwd) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__('NEW_CONFIRM_PASSWORD_DIFFERENT') });
  }

  Rider.findOne({ "_id": req.params.id, "verificationCode": req.params.code }, function (err, docs) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!docs) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("RESET_LINK_EXPIRED") }) }
    var newDoc = Rider();
    var obj = newDoc.getPassword(req.body.newPwd);
    var update = {
      salt: obj.salt,
      hash: obj.hash,
      verificationCode: ''
    }

    Rider.findOneAndUpdate({ "_id": docs._id }, update, { new: false }, (err, doc) => {
      if (err) { return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
      return res.json({ 'success': true, 'message': req.i18n.__('PASSWORD_UPDATED') });
    })
  })
}

export const riderResetPasswordWithOTP = (req, res) => {
  if (req.body.newPwd != req.body.conPwd) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__('NEW_CONFIRM_PASSWORD_DIFFERENT') });
  }
  var userName = req.body.email;
  if (/^[0-9]*$/.test(userName)) {
    var phone = userName;
    userName = phone.replace(/^0+/, '');
  }
  Rider.findOne({ "$or": [{ 'email': userName }, { 'phone': userName }] }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("NOT_FOUND") }) }
    if (doc.verificationCode != req.body.otp) { return res.status(409).json({ 'success': false, 'message': "USER_NOT_FOUND" }) }
    var newDoc = Rider();
    var obj = newDoc.getPassword(req.body.newPwd);
    var update = {
      salt: obj.salt,
      hash: obj.hash,
      verificationCode: ''
    }
    Rider.findOneAndUpdate({ "_id": doc._id }, update, { new: false }, (err, doc) => {
      if (err) { return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
      return res.json({ 'success': true, 'message': req.i18n.__('PASSWORD_UPDATED') });
    })
  })
}

/**
 * changePasswordByApp
 * params : userName(email or phone),newPwd, conPwd,otp
*/
export const changePasswordByApp = (req, res) => {
  if (req.body.password != req.body.confirmpassword) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__('NEW_CONFIRM_PASSWORD_DIFFERENT') });
  }
  var userName = req.body.email;
  if (/^[0-9]*$/.test(userName)) {
    var phone = userName;
    userName = phone.replace(/^0+/, '');
  }

  Rider.findOne({ '$or': [{ 'email': userName }, { 'phone': userName }] }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    if (!doc) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") }) }
    if (doc.verificationCode === "" || doc.verificationCode !== req.body.otp) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("INVALID_OTP!") })
    }

    var newDoc = Rider();
    var obj = newDoc.getPassword(req.body.password);
    var update = {
      salt: obj.salt,
      hash: obj.hash,
      verificationCode: ''
    }

    Rider.findOneAndUpdate({ "_id": doc._id }, update, { new: false }, (err, docs) => {
      if (err) { return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
      return res.json({ 'success': true, 'message': req.i18n.__('PASSWORD_UPDATED') });
    })
  })
}

/**
 * sent message to emergency contact
 * params : tripId
 */
export const emergencyMsg = (req, res) => {
  Rider.findById(req.userId, async function (err, userDoc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }) }
    if (!userDoc) return res.status(200).json({ 'success': false, 'message': req.i18n.__("USER_NOT_FOUND") })
    var tripId = req.body.trip_id;
    var tripDetails = await Trips.findOne({ 'tripno': tripId }, { '_id': 1 });
    var URL = config.shareTrip + tripDetails._id
    userDoc.EmgContact.forEach(async (el) => {
      // var msg = notificationContent[notificationContent.defaultLanguage]['emergencyMsg'] + config.appName + userDoc.fname + userDoc.phone + " ";
      // var msg = userDoc.fname + ' ( ' + userDoc.phone + ' ) is riding in ' + config.appName + ' has reached you because of some emergency. From ' + config.appName + " : " + config.supportNo;
      // smsGateway.sendSmsMsg(el.number, '', userDoc.phcode, msg/* 'emergencyMsg', { 'NAME': userDoc.name, 'PHONE': userDoc.phone, 'URLLINK': "" } */)
      // var phcode = el.number;
      // var mobile = phcode.replace("^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$");
      var phnData = await getMobileNo(userDoc, el);
      var phnNo = phnData.phnNo, phcode = phnData.phcode;
      smsGateway.sendSmsMsg(phnNo, '', phcode, '', 'emergencyMsg', { 'NAME': userDoc.fname, 'PHONE': userDoc.phone, 'URLLINK': URL })
    });
    // var emgMsg = 'Emergency Message From Rider : ' + userDoc.fname + ', Phone No. : ' + userDoc.phone + ", Trip Id : " + tripId;
    // smsGateway.sendSmsMsg(config.supportNo, emgMsg, config.phoneCode);
    var adminNum = (config.supportNo).replace(/^\+[0-9]{1,3}(\s|\-)/, "")
    smsGateway.sendSmsMsg(adminNum, '', config.phcode, "", 'emergencyMsg', { 'NAME': userDoc.fname, 'PHONE': userDoc.phone, 'URLLINK': URL })
    return res.status(200).json({ 'success': false, 'message': req.i18n.__("MESSAGE_SENDED_SUCCESSFULLY") })
  })
}

export const getMobileNo = async (userData, emgContact) => {
  var countryCode = config.countryCode;
  var phnNo = emgContact.number, phcode = (userData.phcode).toString();
  phnNo = phnNo.replace(/\s+/g, '');
  var isphcode = phcode.startsWith("+");
  if (!isphcode) phcode = "+" + phcode;
  var isPhoneCodeInclude = _.split(phnNo, phcode);
  if (isPhoneCodeInclude.length == 2) {
    phnNo = isPhoneCodeInclude[isPhoneCodeInclude.length - 1];
  }
  return { phcode: phcode, phnNo: phnNo }
}

export const ridersForNotificationTest = (req, res) => {
  Rider.find({
    fcmId: { $exists: true }
  }, { "_id": 1, 'fname': 1, 'phone': 1, 'fname': 1, 'fcmId': 1 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
}


export const getRiderRating = async (req, res) => {
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

  let count = Rider.find(likeQuery).count().exec();
  let riderlist = Rider.find(likeQuery, { fname: 1, phone: 1, _id: 1, rating: 1, code: 1, profile: 1 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec();

  try {
    var promises = await Promise.all([count, riderlist]);
    res.header('x-total-count', promises[0]);
    return res.status(200).json(promises[1]);
  } catch (err) {
    return res.status(200).json({});
  }
}

export const riderPushToken = (req, res) => {
  var newDoc =
  {
    fcmId: req.body.fcmId,
  }
  Rider.findOneAndUpdate({ _id: req.userId }, newDoc, { new: true }, (err, adminDoc) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    return res.status(200).json({ 'success': true, 'message': req.i18n.__('TOKEN_UPDATED') });
  });
}

// RiderPerDay
export const updateRiderPerDayCancels = async (riderId, cancelledAmount, adminCommision) => {
  try {
    var todayDate = GFunctions.getISOTodayDate();
    var findQuery = { riderId: riderId, date: todayDate };
    var todayDataExists = await RiderPerDay.findOne(findQuery).exec();
    console.log("todayDataExists",todayDataExists);
    if (todayDataExists) {
      var updateDate = {
        nooftripsCancelled: Number(todayDataExists.nooftripsCancelled) + Number(1),
        cancelledAmount: Number(todayDataExists.cancelledAmount) + cancelledAmount,
      }
      await RiderPerDay.findOneAndUpdate({ riderId: riderId, date: todayDate }, updateDate).exec();
      return true;
    } else {
      var newDoc = new RiderPerDay(
        {
          riderId: riderId,
          cancelledAmount: cancelledAmount,
          nooftripsCancelled: 1,
          date: todayDate,
        }
      );
      await newDoc.save();
      console.log("newDoc",newDoc);
      return true;
    }
  } catch (error) {
    console.log('updateRiderPerDayCancels', error);
    return false;
  }
}

export const updateAddCancelationChargeToRider = async (riderId, amtToDebit = 0, cancelLimitForDays, noOfDriverCancelAllowed, tripId) => {
  try {
    var todayDate = GFunctions.getISOTodayDate();
    var findQuery = { riderId: riderId, date: todayDate };
    var todayDataExists = await RiderPerDay.findOne(findQuery).exec();
    if (todayDataExists) {
      // var cancelledAmount = Number(todayDataExists.cancelledAmount);
      console.log("cancelLimitForDays",cancelLimitForDays, "todayDataExists.nooftripsCancelled",todayDataExists.nooftripsCancelled );
      if(noOfDriverCancelAllowed < todayDataExists.nooftripsCancelled){
        updateRiderWalletCancelationCredits(riderId, amtToDebit, tripId);
        return true;
      }else {
        return false
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log('updateAddCancelationChargeToRider', error);
    return false;
  }
}

export const updateRiderWalletCancelationCredits = async (riderId, amtToDebit, tripId) => {
  try {
    let RiderWallet = await Rider.findById(riderId, { balance: 1, canceledCount: 1, lastCanceledDate: 1 });
    // (riderId, RiderWallet.canceledCount, RiderWallet.lastCanceledDate, RiderWallet.balance);
    var bal = Number(RiderWallet.balance) - Number(amtToDebit);
    RiderWallet.balance = bal;
    updateBalanceAmountinFB(riderId, RiderWallet.balance);
    RiderWallet.save();
    updateRiderWalletTransaction(riderId, amtToDebit, tripId, "Cancellation - Debit", 'Debit');
  }
  catch (err) {
    console.log(err)
  }
}

/**
 * Update Tranx Details 
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const updateRiderWalletTransaction = (riderId, Totalamount = 0, trxId, reason = "", type = 'Debit') => {
  var tranxData = {
    trxid: trxId,
    amt: parseFloat(Totalamount),
    date: GFunctions.sendTimeNow(),
    type: type,
    for: reason,
  }
  Wallet.findOne({ ridid: riderId }, function (err, doc) {
    if (err) { }
    else if (!doc) {

      //Add New Wallet Details
      var newDoc = new Wallet(
        {
          ridid: riderId,
          bal: Totalamount ? Totalamount : 0,
          trx: tranxData
        }
      );
      newDoc.save((err, doc) => {
        if (err) { } else { }
      })
      //Add New Wallet Details

    } else if (doc) {

      Wallet.findOneAndUpdate({ ridid: riderId }, {
        $push: { trx: tranxData }
      }, { 'new': true },
        function (err, doc) {
          if (err) {
            return console.log(err)
          }
          updateRiderWalletTransactionsBal(riderId, Totalamount, type);
        }
      );

    }
  })
  // 1.chk Wallet

};

function updateRiderWalletTransactionsBal(riderId, amount, type) {
  Wallet.findOne({ ridid: riderId }, function (err, docs) {
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
    docs.save(function (err, op) {
      if (err) { }
    });
  });
};

export const updateBlockTheRiderIfCancelExceeds = async (riderId, ifcancelExceedsBlockUserFor, noOfDriverCancelAllowed) => {
  try {
    var todayDate = GFunctions.getISODate();
    var findQuery = { riderId: riderId, date: todayDate };
    var todayDataExists = await RiderPerDay.findOne(findQuery).exec();
    if (todayDataExists) {
      var nooftripsCancelled = Number(todayDataExists.nooftripsCancelled);
      if (Number(nooftripsCancelled) >= Number(noOfDriverCancelAllowed)) {
        var myDate = moment(todayDate).add(ifcancelExceedsBlockUserFor, "days").utcOffset(config.utcOffset).format("DD-MM-YYYY");
        var blockDate = moment(todayDate).utcOffset(config.utcOffset).add(ifcancelExceedsBlockUserFor, "days").format("YYYY-MM-DDT00:00:00.000[Z]");
        Rider.findByIdAndUpdate(riderId,
          {
            'blockuptoDate': new Date(blockDate),
          }
          , { new: true }, function (err, docs) {
            if (err) { }
            blockRiderInFB(riderId, myDate, nooftripsCancelled);
          });
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export const blockRiderInFB = (riderId, blockuptoDate, cancelExceeds = 1) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    cancelExceeds: cancelExceeds,
    blockuptoDate: blockuptoDate,
  };
  var child = riderId.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);

  usersRef.update(requestData, function (error) {
    if (error) { console.log(error); } else {
    }
  });
}

export const resetRidersBlocking = async () => {
  try {
    var todayDate = GFunctions.getISOTodayDate();
    // todayDate = moment(todayDate).subtract(1, 'days').format('DD-MM-YYYY');
    var findQuery = {
      blockuptoDate: new Date(todayDate)
    };
    var todayDataExists = await Rider.find(findQuery).exec();
    if (todayDataExists) {
      todayDataExists.forEach(async function (u) {
        blockRiderInFB(u._id, '', 0);
        var update = await Rider.findOneAndUpdate({ '_id': u._id }, { blockuptoDate: null });
      })
    }
    // Rider.update(findQuery, { blockuptoDate: null }, { multi: true });
  } catch (error) {
    console.log('resetRidersBlocking', error);
    return false;
  }
}



                  //User Vechicle Data 

export const getAppRidertaxi = (req, res) => {
    Ridertaxi.find({ _id: req.body.id }).exec((err, docs) => {
      if (err) {
        return res.json([]);
      }
      if (docs) {
        return res.json(docs);
      }
      else {
        return res.json([]);
      }
    })
  }

export const addRidertaxisData = (req, res) => {
      // var data = req.body ? req.body : "";
      if(req.body){      
        var id = mongoose.Types.ObjectId();
        var newDoc = new Ridertaxi
        ({
          _id: id,
          Makename: req.body.Makename,
          Model: req.body.Model,
          Number: req.body.Number,
        //   cpy: req.body.cpy,
        //   rider: req.body.rider,
        //   color: req.body.color,
        //   handicap: req.body.handicap,
        //   type: [{
        //     basic: req.body.basic,
        //     normal: req.body.normal,
        //     luxury: req.body.luxury,
        //   }],
        // vehicletype: req.body.vehicletype,
        // noofshare: 0,
        // share: false,
        // chaisis: req.body.chaisis,
        // ownername: req.body.ownername,
        // registrationnumber: req.body.registrationnumber,
        // vin_number: req.body.vin_number,
        // others1: req.body.others1,
        // isDaily: true,
        // isRental: false,
        // isOutstation: false,
      })
        newDoc.save((err,docs)=>{
        if (err) {
          return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
        }
        else{
        return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), 'taxi': docs });
          }
       })
      }else{
        return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
      }
}



  export const updateAppRidertaxis = (req, res) => {
    var findOrCondition = [{ "$and": [{ 'license': req.body.licence }] }];
    Ridertaxi.findOne({ '$and': [{ '_id': { $ne: req.body._id } }, { $or: findOrCondition }] }, function (err, user) {
      if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
      if (user) return res.status(401).json({ 'success': false, 'message': errMsg });
      var newDoc = {
        makename: req.body.makename,
        model: req.body.model,
        year: req.body.year,
        licence: req.body.licence,
        cpy: req.body.cpy,
        rider: req.body.rider,
        color: req.body.color,
        vehicletype: req.body.vehicletype,
        chaisis: req.body.chaisis,
        registrationnumber: req.body.registrationnumber,
        vin_number: req.body.vin_number,
        others1: req.body.others1
      }
      Ridertaxi.findOneAndUpdate({ _id: req.body._id }, newDoc, { new: true }, (err, result) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        else{
          return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), result: newDoc });}
  
      });
    });
  };


  export const deleteAppRidertaxis = (req, res) => {
    Ridertaxi.findByIdAndRemove( req.params.id, (err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR') });
    }
    return res.json({ 'success': true, 'message': 'Ridertaxi Details Deleted successfully' });
  })
  }

  export const riderholdingTransactions = async(req,res)=> {
    let likeQuery = HelperFunc.likeQueryBuilder(req.query);
    let pageQuery = HelperFunc.paginationBuilder(req.query);
    let skip = { "$skip": pageQuery.skip },
      limit = { "$limit": pageQuery.take };
  
    if (req.query.requestFrom == 'without_limit') {
      skip = { "$match": {} }
      limit = { "$match": {} }
    }
    let totalCount = 10;
    // (/true/i)
    let TotCnt = Paymentflow.find(likeQuery).count();
    // let Datas = Rider.find(likeQuery, { "hash": 0, "salt": 0 }).skip(pageQuery.skip).limit(pageQuery.take);
    let Datas = Paymentflow.aggregate([
      { '$match': likeQuery }, 
      {
        "$lookup": {
          "from": "riders",
          "localField": "userId",
          "foreignField": "_id",
          "as": "riderDetails"
        } 
      },
      skip, limit
    ]);
    try {
      let promises = await Promise.all([TotCnt, Datas]);
      res.header('x-total-count', promises[0]);
      let resstr = promises[1];
      res.send(resstr);
    } catch (err) {
      return res.json([]);
    }
  }
  export const refundTripHoldAmount = async(req,res) => {
    let response = {
      status : false,
      statusCode : 503,
      message : "Unprocesable Entry",
      data : {}
    }
    try {
      let tripData = await Trips.findOne({
        _id:mongoose.Types.ObjectId(req.body.tripId)}).lean().exec();
      if(!tripData || tripData.paymentMode != "card")
        throw new Error("System cannot proceed your request.")
  
      let paymentData = await paymentCtrl.captureHoldChargeExistingUserCard({
        mode: config.paymentGateway.paymentGatewayName || "",
        referenceId : tripData._id,
        action : "refund"
      })
  
      if(!paymentData.status)
        throw new Error(paymentData.message)
      
      response.status = true;
      response.statusCode = 200;
      response.message = paymentData.message;
      response.data = {
        paymentData
      };
  
    }catch(error){
      response.status = false;
      response.statusCode = 503;
      response.message = error.message;
      response.data = {};
    }
    return res.status(response.statusCode).json(response).end()
  };

  export const sendStripeInvoice = async(req,res)=> {
    let Obj = {}
    try {
      let TripData = await Trips.findOne({_id:mongoose.Types.ObjectId(req.body.tripId)});
      if(TripData) {
        let RiderData = await Rider.findOne({_id:TripData.ridid});
        Obj.Tripamount = ((TripData.fare)*100).toFixed();
        Obj.email = RiderData.email;
        Obj.name = (RiderData.fname + RiderData.lname);
        Obj.description = "Rider";
      }else {
      return res.json({ 'success': true, 'message': req.i18n.__('Data_NOT_FOUND'), 'data':{} });
      }
      if(Obj) {
        let InvoiceData = await Stripe.StripeInvoice(Obj);
        if(InvoiceData) {
          return res.status(200).json({ 'success': true, 'message': req.i18n.__('DATA_SHOWING_SUCCESSFULLY'), data:InvoiceData.invoice_pdf});
        }
      } 
    } catch (error) {
      return res.status(500).json({ 'success': true, 'message':error.message,err:error });

    }
  };

  export const deleteRiderForApp = (req,res)=> {
    var update = {
      "softdel": 'inactive'
    }
    Rider.findOneAndUpdate({ _id: req.params.id }, update, { new: true }, async (err, doc) => {
      if (err) { return res.status(401).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err }); }
      else {
        updateDriverProofStatusInFB(req.params.id, 'pending');
        await findAndSendFCMToDriver(req.params.id, "Your Account was InActived Please contact Support Team", "Inactive");
        return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_INACTIVATED_SUCCESSFULLY") });
      }
    })
  }
  


  // export const deleteAppRidertaxis = (req, res) => {
  //   Ridertaxi.findOne({ id: req.params.id }).exec((err, docs) => {
  //     if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
  //     if (!docs) return res.json({ 'success': false, 'message': req.i18n.__('USER_NOT_FOUND'), 'error': err });
  //     docs.Ridertaxi.remove({id});
  //     docs.save(function (err, op) {
  //       if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
  //       return res.json({ 'success': true, 'message': req.i18n.__('DELETED_SUCCESSFULLY'), 'contacts': docs.EmgContact });
  //     });
  //   })
  // }