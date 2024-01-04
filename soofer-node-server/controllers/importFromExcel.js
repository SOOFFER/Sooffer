import mongoose from 'mongoose';

//import models
import Rider from '../models/rider.model';
import Driver from '../models/driver.model';
import CompanyDetails from '../models/company.model';
import Vehicletype from '../models/vehicletype.model';
import DriverPayment from '../models/driverpayment.model';
import Wallet from '../models/wallet.model';
import DriverBank from '../models/driverBank.model';
import DriverBankTransaction from '../models/driverBankTransaction.model';
import * as smsGateway from './smsGateway';
import * as mailGateway from './mailGateway';
import ServiceAvailableCities from '../models/serviceAvailableCities.model';

const _ = require('lodash');

import * as appCtrl from '../controllers/app';
import * as GFunctions from './functions';
const nodemailer = require('nodemailer');

var firebase = require('firebase');
var config = require('../config');
const countryDocs = require('../countryDocs');
const featuresSettings = require('../featuresSettings');

//Import helper
import * as DriverCtrl from './driver';
import * as RiderCtrl from './rider';
//Import helper

const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

export const insertDriverData = (req, res) => {

  var filepath = '';
  if (req['file'] != null) {
    filepath = req['file'].path;
  }

  if (filepath == '') return res.status(409).json({ 'success': false, 'message': req.i18n.__("UPLOAD_VALID_FILE") });
  var inputFilePath = path.join(__dirname, '..', filepath);

  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', function (data) {
      try {
        // console.log("data", data);
        var driverData = {
          Code: data.code,
          Name: data.FirstName,
          LName: data.LastName,
          emailId: data.Email,
          Mobile: data.MobileNumber,
          Gender: data.Gender,
          Password: config.resetPasswordTo,
          phoneCode: config.phoneCode,
          status: data.approved ? 'Accepted' : 'pending', //Accepted,pending
          address: data.Address
        };
        // console.log("driverData", driverData);
        //perform the operation
        addDriverData(driverData)
      }
      catch (err) {
        //error handler
        console.log(err)
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }
    })
    .on('end', function () {
      //some final operation
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("DATA_IMPORTED") });
    });
}

async function addDriverData(data) {
  var findOrCondition = [{ 'phone': data.Mobile }]
  if (data.emailId) findOrCondition.push({ 'email': data.emailId })
  var driverData = await Driver.findOne({ '$or': findOrCondition })
  if (!driverData) {
    var id = mongoose.Types.ObjectId();
    // var id2 = mongoose.Types.ObjectId();
    // let TotCnt = await Driver.findOne({}, {}, { sort: { 'createdAt': -1 } }).exec();
    // if (TotCnt != null) {
    //   data['Code'] = invNum.next(TotCnt.code);
    // } else {
    //   data['Code'] = 'DRV001';
    // }
    // console.log("data", data);
    var newDoc = new Driver(
      {
        _id: id,
        code: data.Code,
        nic: '',
        fname: data.Name,
        lname: data.LName,
        email: data.emailId,
        phcode: data.phoneCode,
        phone: data.Mobile,
        gender: data.Gender,
        address: data.address,
        cnty: "",
        cntyname: "",
        state: "",
        statename: "",
        city: "",
        cityname: "",
        cmpy: null,
        cur: "",
        actMail: "",
        actHolder: "",
        actNo: "",
        actBank: "",
        actLoc: "",
        actCode: "",
        softdel: "active",
        fcmId: "",

        "curStatus": "free",
        "curService": "",
        "serviceStatus": "active",
        "currentTaxi": "",

        status: [{
          curstatus: 'active',
          docs: data.status
        }],
      }
    );
    newDoc.setPassword(data.Password);
    newDoc.save((err, datas) => {
      if (err) { console.log(err); }
      DriverCtrl.addDriverDatatoFb(id);
      // DriverCtrl.addDrivertaxisDataFB(id, id2, data);
      DriverCtrl.addDriverWallet(datas._id, datas.fname, '');
      DriverCtrl.addDriverBank(datas._id, datas.fname);
      DriverCtrl.updateDriverProofStatusInFB(id, data.status);
    })
  }
};

export const insertRiderData = (req, res) => {
  var filepath = '';
  if (req['file'] != null) {
    filepath = req['file'].path;
  }
  if (filepath == '') return res.status(409).json({ 'success': false, 'message': req.i18n.__("UPLOAD_VALID_FILE") });
  var inputFilePath = path.join(__dirname, '..', filepath);
  fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', function (data) {
      try {
        var riderData = {
          FName: (data.FirstName != "null") ? data.FirstName : "",
          LName: (data.LastName != "null") ? data.LastName : "",
          emailId: (data.Email != "null") ? data.Email : "",
          Mobile: (data.MobileNumber != "null") ? data.MobileNumber : "",
          Gender: (data.Gender != "unknown") ? data.Gender : "",
          Password: config.resetPasswordTo,
          phoneCode: config.phoneCode,
          ridersAddress: (data.Address != "null") ? data.Address : "",
          referal: data.referal ? data.referal : ""
        };
        //perform the operation
        addRiderData(riderData)
      }
      catch (err) {
        //error handler
        console.log(err)
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }
    })
    .on('end', function () {
      //some final operation
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("DATA_IMPORTED") });
    });
}

async function addRiderData(data) {
  var findOrCondition = [{ 'phone': data.Mobile }]
  if (data.emailId) findOrCondition.push({ 'email': data.emailId })
  var riderData = await Rider.findOne({ '$or': findOrCondition })
  if (!riderData) {
    var id = mongoose.Types.ObjectId();

    var newDoc = new Rider(
      {
        _id: id,
        fname: data.FName,
        lname: data.LName,
        email: data.emailId,
        phcode: data.phoneCode,
        phone: data.Mobile,
        gender: data.Gender,
        ridersAddress: data.address,
        cnty: "",
        cntyname: "",
        state: "",
        statename: "",
        city: "",
        cityname: "",
        cur: "",
      }
    );
    newDoc.setPassword(data.Password);
    newDoc.setReferal();
    if (featuresSettings.resBasedOnCurrency) {
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': data.phoneCode });
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
      if (err) { console.log(err); }
      RiderCtrl.addRiderDatatoFb(datas);
      RiderCtrl.processSignupBonus(datas._id);
      if (data.referal) RiderCtrl.processReferalCode(data.referal, datas._id);
    })
  }
};