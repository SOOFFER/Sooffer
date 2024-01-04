import mongoose from 'mongoose';
import * as HelperFunc from './adminfunctions';
import { sendEmail } from './mailGateway';
var config = require('../config');
const featuresSettings = require('../featuresSettings');
const countryDocs = require('../countryDocs');

//import models
import Driver from '../models/driver.model';
import { getFBValues } from './firebaseFunction';
import * as GFunctions from './functions';

//npm package
const moment = require('moment');
var firebase = require('firebase');
const _ = require('lodash');
/** 
 * Driver expiry document
 * notes : only show active driver
 * url : http://localhost:3002/adminapi/driverExpiryDoc?_page=1&_limit=10
*/
export const driverExpiryDocOld = async (req, res) => {
  var totalDaysBuffer = featuresSettings.expirationNotificationBefore;
  var now = moment().add(totalDaysBuffer, 'days').format("YYYY-MM-DDT00:00:00.000[Z]");
  // var now = moment().format("YYYY-MM-DDT00:00:00.000[Z]");    

  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  likeQuery['status.docs'] = "Accepted";
  // let TotCnt = Driver.find(likeQuery).count();
  let Datas = Driver.aggregate([
    { "$match": { "status.docs": 'Accepted' } },
    {
      '$match': {
        "$or":
          [
            { "licenceexp": { "$lte": new Date(now) } },
            { "insuranceexp": { "$lte": new Date(now) } },
            { "passingexp": { "$lte": new Date(now) } },
          ]
      }
    },
    {
      "$project": {
        "statusReason": 1,
        "licenceexp": 1,
        "insuranceexp": 1,
        "passingexp": 1,
        "miscexp": 1,
        "fname": 1,
        "phone": 1,
        "email": 1,
        "status.docs": 1,
        "scId": 1,
        "scity": 1
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    // { "$skip": pageQuery.skip },
    // { "$limit": pageQuery.take },
  ])

  try {

    var promises = await Promise.all([Datas]);
    // res.header('x-total-count', promises[0]);
    var driverDocs = promises[0];
    for (var i = 0; i < driverDocs.length; i++) {
      _.forEach(featuresSettings.driverDocumentExpiryReasons, (d) => {
        if (Date.parse(driverDocs[i][d.key]) <= Date.parse(now)) {
          if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = d.value; }
          else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , " + d.value; }
        }
        else { driverDocs[i][d.key] = "" }
      })
      // if (Date.parse(driverDocs[i].licenceexp) <= Date.parse(now)) { driverDocs[i].statusReason = "licence"; }
      // else { driverDocs[i].licenceexp = "" }

      // if (Date.parse(driverDocs[i].insuranceexp) <= Date.parse(now)) {
      //   if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = "insurance"; }
      //   else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , insurance"; }
      // }
      // else { driverDocs[i].insuranceexp = "" }

      // if (Date.parse(driverDocs[i].passingexp) <= Date.parse(now)) {
      //   if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = "passing"; }
      //   else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , passing"; }
      // }
      // else { driverDocs[i].passingexp = "" }

      // if (Date.parse(driverDocs[i].miscexp) <= Date.parse(now)) {
      //   if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = "misc"; }
      //   else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , misc"; }
      // }
      // else { driverDocs[i].miscexp = "" }
    }
    res.send(driverDocs);
  }
  catch (err) {
    return res.status(500).json({ "status": 500, '"message': req.i18n.__("ERROR_SERVER"), "error": err.toString() });
  }
}

export const driverExpiryDoc = async (req, res) => {
  var totalDaysBuffer = featuresSettings.expirationNotificationBefore;
  var now = moment().add(totalDaysBuffer, 'days').format("YYYY-MM-DDT00:00:00.000[Z]");

  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  likeQuery['status.docs'] = "Accepted";
  let Datas = Driver.aggregate([
    { "$match": { "status.docs": 'Accepted' } },
    {
      "$project": {
        "statusReason": 1,
        "fname": 1,
        "phone": 1,
        "phcode": 1,
        "email": 1,
        "status.docs": 1,
        "scId": 1,
        "scity": 1,
        "document": 1,
        "fcmId":1
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
  ])

  try {

    var promises = await Promise.all([Datas]);  
    var driverDocs = promises[0];
    var finalData = [];
    var documentsArr = [], phcode = config.phoneCode;
    for (var i = 0; i < driverDocs.length; i++) {
      phcode = driverDocs[i].phcode;
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': phcode });
      if (filterDocumet.length) documentsArr = filterDocumet[0].documents;
      else documentsArr = featuresSettings.documents;

      _.forEach(documentsArr, (d) => {
        _.map(driverDocs[i].document, (el) => {
          if (d.exp == true && el['docExp'] != null && (d.fileFor == el.fileFor) && (Date.parse(el['docExp']) <= Date.parse(now))) {
            if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = d.name; }
            else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , " + d.name; }
            finalData.push(driverDocs[i]);
          }
          else { el[d.name] = "" }
        })
      })
    }
    finalData = _.uniqBy(finalData, 'phone');
    res.send(finalData);
  }
  catch (err) {
    return res.status(500).json({ "status": 500, '"message': req.i18n.__("ERROR_SERVER"), "error": err.toString() });
  }
}

/**  
 * Taxi expiry document
 * notes : only show active taxi detail
 * url : http://localhost:3002/adminapi/taxiExpiryDoc?_page=1&_limit=10
*/
export const taxiExpiryDocOld = async (req, res) => {
  var totalDaysBuffer = featuresSettings.expirationNotificationBefore;
  // var now = moment().format("YYYY-MM-DDT00:00:00.000[Z]");
  var now = moment().add(totalDaysBuffer, 'days').format("YYYY-MM-DDT00:00:00.000[Z]");

  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };

  var query = [
    { "$unwind": "$taxis" },
    { "$match": { "taxis.taxistatus": 'active' } },
    {
      "$project": {
        "fname": 1,
        "phone": 1,
        "email": 1,
        "statusReason": 1,
        "permitDate": "$taxis.permitexpdate",
        "insuranceDate": "$taxis.insuranceexpdate",
        "registrationDate": "$taxis.registrationexpdate",
        "model": '$taxis.model',
        "status": "$taxis.taxistatus",
        "scity": 1,
        "scId": 1,
        "fcmId":1
      }
    },
    {
      "$match": {
        $or: [
          { "permitDate": { "$lte": new Date(now) } },
          { "insuranceDate": { "$lte": new Date(now) } },
          { "registrationDate": { "$lte": new Date(now) } },
        ]
      }
    },
    { "$match": likeQuery },
  ]

  // let TotCnt = Driver.aggregate(query);
  query.push(
    { "$match": likeQuery },
    { "$sort": sortQuery },
    // { "$skip": pageQuery.skip },
    // { "$limit": pageQuery.take },
  )
  let Datas = Driver.aggregate(query)
  try {
    var promises = await Promise.all([Datas]);
    // res.header('x-total-count', promises[0].length);
    var driverDocs = promises[0];

    for (var i = 0; i < driverDocs.length; i++) {
      _.forEach(featuresSettings.taxiDocumentExpiryReasons, (d) => {
        if (driverDocs[i][d.key] != null && Date.parse(driverDocs[i][d.key]) <= Date.parse(now)) {
          if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = d.value; }
          else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , " + d.value; }
        }
        else { driverDocs[i][d.key] = "" }
      })
      // if (Date.parse(driverDocs[i].permitDate) <= Date.parse(now)) { driverDocs[i].statusReason = "permit"; }
      // else { driverDocs[i].permitDate = "" }

      // if (Date.parse(driverDocs[i].insuranceDate) <= Date.parse(now)) {
      //   if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = "insurance"; }
      //   else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , insurance"; }
      // }
      // else { driverDocs[i].insuranceDate = "" }

      // if (Date.parse(driverDocs[i].registrationDate) <= Date.parse(now)) {
      //   if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = "registration"; }
      //   else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , registration"; }
      // }
      // else { driverDocs[i].registrationDate = "" }
    }
    res.send(driverDocs);
  }
  catch (err) {
    return res.status(500).json({ "status": false, "message": req.i18n.__("ERROR_SERVER"), "error": err.toString() });
  }
}

export const taxiExpiryDoc = async (req, res) => {
  var totalDaysBuffer = featuresSettings.expirationNotificationBefore;
  var now = moment().add(totalDaysBuffer, 'days').format("YYYY-MM-DDT00:00:00.000[Z]");

  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };

  var query = [
    { "$unwind": "$taxis" },
    { "$match": { "taxis.taxistatus": 'active' } },
    {
      "$project": {
        "fname": 1,
        "phone": 1,
        "phcode": 1,
        "email": 1,
        "statusReason": 1,
        "model": '$taxis.model',
        "status": "$taxis.taxistatus",
        "scity": 1,
        "scId": 1,
        "document": "$taxis.document",
        "fcmId":1
      }
    },
    { "$match": likeQuery },
  ]

  query.push(
    { "$match": likeQuery },
    { "$sort": sortQuery },
    // { "$skip": pageQuery.skip },
    // { "$limit": pageQuery.take },
  )
  let Datas = Driver.aggregate(query)
  try {
    var promises = await Promise.all([Datas]);
    var driverDocs = promises[0];
    var documentsArr = [], phcode = config.phoneCode;
    for (var i = 0; i < driverDocs.length; i++) {
      phcode = driverDocs[i].phcode;
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': phcode });

      if (filterDocumet.length) documentsArr = filterDocumet[0].taxiDocuments;
      else documentsArr = featuresSettings.taxiDocuments;

      _.forEach(documentsArr, (d) => {
        _.map(driverDocs[i].document, (el) => {
          if (d.exp == true && el['docExp'] != null && (Date.parse(el['docExp']) <= Date.parse(now))) {
            if (driverDocs[i].statusReason == '' || driverDocs[i].statusReason == undefined) { driverDocs[i].statusReason = d.name; }
            else { driverDocs[i].statusReason = driverDocs[i].statusReason + " , " + d.name; }
          }
          else { driverDocs[i][d.name] = "" }
        })
      })
    }
    res.send(driverDocs);
  }
  catch (err) {
    return res.status(500).json({ "status": false, "message": req.i18n.__("ERROR_SERVER"), "error": err.toString() });
  }
}

/**  
 * sent notification for expiry driver
 * Notes : email sent active driver
*/
export const sentExpiryNotificationDriverOld = async (req, res) => {
  try {

    var totalDaysBuffer = featuresSettings.expirationNotificationBefore;
    var now = moment().add(totalDaysBuffer, 'days').format("YYYY-MM-DDT00:00:00.000[Z]");
    // var now = moment().format("YYYY-MM-DDT00:00:00.000[Z]");  

    let driverDoc = await Driver.aggregate([
      { "$match": { "status.docs": 'Accepted' } },
      {
        '$match': {
          "$or":
            [
              { "licenceexp": { "$lte": new Date(now) } },
              { "insuranceexp": { "$lte": new Date(now) } },
              { "passingexp": { "$lte": new Date(now) } },
            ]
        }
      }
    ])
    if (driverDoc.length == 0) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DATA_NOT_FOUND") }) }
    driverDoc.forEach((docs) => {
      _.forEach(featuresSettings.driverDocumentExpiryReasons, (d) => {
        if (docs[d.key] != null && docs[d.key] <= new Date(now)) {
          var data = { name: docs.fname, email: docs.email, ExpName: d.value, 'date': moment(docs[d.key]).format('YYYY-MM-DD'), 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
          sendEmail(docs.email, data, 'expiryMails')
          // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});        
          // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
        }
      })
      // if (docs.licenceexp <= new Date(now)) {
      //   var data = { name: docs.fname, email: docs.email, ExpName: 'licence', 'date': moment(docs.licenceexp).format('YYYY-MM-DD'), 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
      //   sendEmail(docs.email, data, 'expiryMails')
      //   // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});        
      //   // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
      // }

      // if (docs.insuranceexp <= new Date(now)) {
      //   var data = { name: docs.fname, email: docs.email, ExpName: 'insurance', 'date': moment(docs.insuranceexp).format('YYYY-MM-DD'), 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
      //   sendEmail(docs.email, data, 'expiryMails')
      //   // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});
      //   // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
      // }

      // if (docs.passingexp <= new Date(now)) {
      //   var data = { name: docs.fname, email: docs.email, ExpName: 'passing', 'date': moment(docs.passingexp).format('YYYY-MM-DD'), 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
      //   sendEmail(docs.email, data, 'expiryMails')
      //   // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});        
      //   // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
      // }

      // if (docs.miscexp <= new Date(now)) {
      //   var data = { name: docs.fname, email: docs.email, ExpName: 'misc', 'date': moment(docs.miscexp).format('YYYY-MM-DD'), 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
      //   sendEmail(docs.email, data, 'expiryMails')
      //   // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});
      //   // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
      // }
    })
    return res.status(200).json({ 'success': false, 'message': req.i18n.__("EMAIL_SEND_SUCCESSFULLY") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}

export const sentExpiryNotificationDriver = async (req, res) => {
  try {

    var totalDaysBuffer = featuresSettings.expirationNotificationBefore;
    var now = moment().add(totalDaysBuffer, 'days').format("YYYY-MM-DDT00:00:00.000[Z]");
    // var now = moment().format("YYYY-MM-DDT00:00:00.000[Z]");  
    let driverDoc = await Driver.aggregate([
      { "$match": { "status.docs": 'Accepted' } },
    ])
    if (driverDoc.length == 0) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DATA_NOT_FOUND") }) }
    var documentsArr = [], phcode = config.phoneCode;
    driverDoc.forEach((docs) => {
      phcode = docs.phcode;
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': phcode });
      if (filterDocumet.length) documentsArr = filterDocumet[0].documents;
      else documentsArr = featuresSettings.documents;

      _.forEach(documentsArr, (d) => {
        if ((docs.document).length) {
          _.map(docs.document, (el) => {
            if (d.exp == true && el['docExp'] != null && el['docExp'] <= new Date(now)) {
              var expDate = moment(el['docExp']).format('YYYY-MM-DD')
              var data = { name: docs.fname, email: docs.email, ExpName: d.name, 'date': expDate, 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
              sendEmail(docs.email, data, 'expiryMails')
              if (d.fcmId) GFunctions.sendFCMMsg(d.fcmId, 'Alert Message: Your ' + d.name + ' is expiry on ' + expDate);
            }
          })
        }
      })
    })
    return res.status(200).json({ 'success': false, 'message': req.i18n.__("EMAIL_SEND_SUCCESSFULLY") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}

//individual email send
export const sendEmailDL = async(req,res)=>{
  try{
    const body = req.body
    var data = { name: body.name, email: body.email, ExpName: body.ExpName, 'date': body.expDate, 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
    sendEmail(body.email, data, 'expiryMails')
    GFunctions.sendFCMMsg(body.fcmId, `Alert Message: Your ${body.ExpName} is expiry on` + body.expDate);
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("EMAIL_SEND_SUCCESSFULLY") })
  }
  catch(err){
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}

/** 
 * sent notification for expiry driver
 * Notes : email sent active taxi
 */
export const sentExpiryNotificationTaxiOld = async (req, res) => {
  try {
    var totalDaysBuffer = featuresSettings.expirationNotificationBefore;
    var now = moment().add(totalDaysBuffer, 'days').format("YYYY-MM-DDT00:00:00.000[Z]");
    // var now = moment().format("YYYY-MM-DDT00:00:00.000[Z]");  

    let driverDoc = await Driver.aggregate([
      { "$unwind": "$taxis" },
      { "$match": { "taxis.taxistatus": 'active' } },
      {
        "$project": {
          "fname": 1,
          "phone": 1,
          "email": 1,
          "permitDate": "$taxis.permitexpdate",
          "insuranceDate": "$taxis.insuranceexpdate",
          "registrationDate": "$taxis.registrationexpdate",
          "model": '$taxis.model',
          "year": "$taxis.year",
          "makename": "$taxis.makename"

        }
      },
      {
        "$match": {
          $or: [
            { "permitDate": { "$lte": new Date(now) } },
            { "insuranceDate": { "$lte": new Date(now) } },
            { "registrationDate": { "$lte": new Date(now) } },
          ]
        }
      },
    ])
    if (driverDoc.length == 0) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DATA_NOT_FOUND") }) }
    driverDoc.forEach((docs) => {
      _.forEach(featuresSettings.taxiDocumentExpiryReasons, (d) => {
        if (docs[d.key] != null && docs[d.key] <= new Date(now)) {
          var data = { name: docs.fname, email: docs.email, ExpName: d.value, 'date': moment(docs[d.key]).format('YYYY-MM-DD'), 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
          sendEmail(docs.email, data, 'expiryMails')
          // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});        
          // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
        }
      })
      // if (docs.permitDate <= new Date(now)) {
      //   var data = { name: docs.fname, email: docs.email, ExpName: 'permit', 'date': moment(docs.permitDate).format('YYYY-MM-DD'), 'additionalDetail': "Your taxi details :  Model :" + docs.model + ", Make :" + docs.makename + ", Year : " + docs.year + ". Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
      //   sendEmail(docs.email, data, 'expiryMails')
      //   // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});        
      //   // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
      // }

      // if (docs.insuranceDate <= new Date(now)) {
      //   var data = { name: docs.fname, email: docs.email, ExpName: 'insurance', 'date': moment(docs.insuranceDate).format('YYYY-MM-DD'), 'additionalDetail': "Your taxi details :  Model :" + docs.model + ", Make :" + docs.makename + ", Year : " + docs.year + ". Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
      //   sendEmail(docs.email, data, 'expiryMails')
      //   // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});
      //   // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
      // }

      // if (docs.registrationDate <= new Date(now)) {
      //   var data = { name: docs.fname, email: docs.email, ExpName: 'registration', 'date': moment(docs.registrationDate).format('YYYY-MM-DD'), 'additionalDetail': "Your taxi details :  Model :" + docs.model + ", Make :" + docs.makename + ", Year : " + docs.year + ". Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
      //   sendEmail(docs.email, data, 'expiryMails')
      //   // let driverInactive = await Driver.update({_id:driver[i]._id},{softdel:'inactive'});        
      //   // sendFCMMsg(driver[i].fcmId,'Alert Message: Your licence is expiry on '+driver[i].licenceexp); 
      // }
    })
    return res.status(200).json({ 'success': false, 'message': req.i18n.__("EMAIL_SEND_SUCCESSFULLY") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}

export const sentExpiryNotificationTaxi = async (req, res) => {
  try {
    var totalDaysBuffer = featuresSettings.expirationNotificationBefore;
    var now = moment().add(totalDaysBuffer, 'days').format("YYYY-MM-DDT00:00:00.000[Z]");
    // var now = moment().format("YYYY-MM-DDT00:00:00.000[Z]");  

    let driverDoc = await Driver.aggregate([
      { "$unwind": "$taxis" },
      { "$match": { "taxis.taxistatus": 'active' } },
      {
        "$project": {
          "fname": 1,
          "phone": 1,
          "email": 1,
          "model": '$taxis.model',
          "year": "$taxis.year",
          "makename": "$taxis.makename",
          "document": "$taxis.document"
        }
      },
    ])
    if (driverDoc.length == 0) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DATA_NOT_FOUND") }) }
    var documentsArr = [], phcode = config.phoneCode;
    driverDoc.forEach((docs) => {
      phcode = docs.phcode;
      var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': phcode });
      if (filterDocumet.length) documentsArr = filterDocumet[0].documents;
      else documentsArr = featuresSettings.documents;

      _.forEach(documentsArr, (d) => {
        if ((docs.document).length) {
          _.map(docs.document, (el) => {
            if (d.exp == true && el['docExp'] != null && el['docExp'] <= new Date(now)) {
              var expDate = moment(el['docExp']).format('YYYY-MM-DD')

              var data = { name: docs.fname, email: docs.email, ExpName: d.name, 'date': expDate, 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
              sendEmail(docs.email, data, 'expiryMails')
              if (d.fcmId) sendFCMMsg(d.fcmId, 'Alert Message: Your ' + d.name + ' is expiry on ' + expDate);
            }
          })
        }
      })
    })
    return res.status(200).json({ 'success': false, 'message': req.i18n.__("EMAIL_SEND_SUCCESSFULLY") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}


/**  
 * expiry driver status change
 * params : status , //pending
*/
export const blockExpiryDriver = (req, res) => {
  var now = moment().format("YYYY-MM-DDT00:00:00.000[Z]");
  var query = [
    { "licenceexp": { "$lte": new Date(now) } },
    { "insuranceexp": { "$lte": new Date(now) } },
    { "passingexp": { "$lte": new Date(now) } },
  ]

  Driver.update({ "status.docs": "Accepted", "$or": query }, { "$set": { "status.$.docs": req.body.status } }, { 'multi': true }, async function (err, docs) {
    if (err){
      { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    }
    if (docs.nModified == 0) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DATA_NOT_FOUND") }) }
    let driverDocs = await Driver.find({ "status.docs": req.body.status, "$or": query })
    driverDocs.forEach((value) => {
      updateDriverStatusInFB(value._id, req.body.status)
    })
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("DRIVER_BLOCKED_SUCCESSFULLY") })
  })
}

function updateDriverStatusInFB(driverid, status) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  var requestData = {
    proof_status: status
  };
  var child = driverid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);

  usersRef.update(requestData, function (error) {
    if (error) { console.log(error); } else {
    }
  });
}

/** 
 * expiry taxis status change
 * params : status // inactive 
*/
export const blockExpiryTaxis = async (req, res) => {
  try {
    var now = moment().format("YYYY-MM-DDT00:00:00.000[Z]");
    let driverDoc = await Driver.aggregate([
      { "$unwind": "$taxis" },
      { "$match": { "taxis.taxistatus": 'active' } },
      {
        "$project": {
          "fname": 1,
          "phone": 1,
          "email": 1,
          "permitDate": "$taxis.permitexpdate",
          "insuranceDate": "$taxis.insuranceexpdate",
          "registrationDate": "$taxis.registrationexpdate",
          "model": '$taxis.model',
          "year": "$taxis.year",
          "makename": "$taxis.makename",
          "makeId": "$taxis._id"
        }
      },
      {
        "$match": {
          $or: [
            { "permitDate": { "$lte": new Date(now) } },
            { "insuranceDate": { "$lte": new Date(now) } },
            { "registrationDate": { "$lte": new Date(now) } },
          ]
        }
      },
    ])
    if (driverDoc.length == 0) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DATA_NOT_FOUND") }) }
    driverDoc.forEach(async (value) => {
      await Driver.update({ "_id": value._id, "taxis._id": value.makeId }, { "$set": { "taxis.$.taxistatus": req.body.status } })
      updateTaxiStatusInFB(value._id, value.makeId, req.body.status)
    })
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("TAXIS_BLOCKED_SUCCESSFULLY") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}

function updateTaxiStatusInFB(driverid, vehicleid, taxistatus) {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("vehicle_list");
  var FBstatus = '0';
  if (taxistatus == "active") { FBstatus = '1'; };
  var requestData = {
    status: FBstatus
  };
  driverid = driverid.toString();
  vehicleid = vehicleid.toString();
  var usersRef = ref.child(driverid).child(vehicleid);
  usersRef.update(requestData, function (error) {
    if (error) { console.log(error); } else {
    }
  });
}

export const sendDriverDocExpNotifyAlert = async () => {
  var currentDate = GFunctions.getISOTodayDate();
  var alertDriverBefore = featuresSettings.alertDriverBeforeDocExpiry;
  var alertDate = GFunctions.minusSomeDaysToCurrentTime(alertDriverBefore, "YYYY-MM-DDT00:00:00.000[Z]");
  // var driverData = await Driver.find({ 'document.docExp': { '$lte': new Date(alertDate) } }, { 'document': { '$elemMatch': { docExp: { '$lte': new Date(alertDate) } } } });
  var driverData = await Driver.find({ "status.docs": 'Accepted', 'document': { $elemMatch: { docExp: { '$lte': alertDate } } } }, { 'fname': 1, 'email': 1, 'document': 1 });
  if (driverData.length) {
    var filterDriverData = _.map(driverData, (el) => {
      var filterDocData = _.map(el.document, (elem) => {
        var checkDate = moment(elem.docExp).isBefore(alertDate);
        if (checkDate) {
          var data = { name: el.fname, email: el.email, ExpName: elem.docName, 'date': moment(el[elem.docExp]).format('YYYY-MM-DD'), 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
          sendEmail(el.email, data, 'expiryMails');
        }
      })
    })
  }
  // return res.json({ "driverData": driverData });
}

export const sendDriverTaxiDocExpNotifyAlert = async () => {
  var currentDate = GFunctions.getISOTodayDate();
  var alertDriverBefore = featuresSettings.alertDriverBeforeDocExpiry;
  var alertDate = GFunctions.minusSomeDaysToCurrentTime(alertDriverBefore, "YYYY-MM-DDT00:00:00.000[Z]");
  // var driverData = await Driver.find({ 'document.docExp': { '$lte': new Date(alertDate) } }, { 'document': { '$elemMatch': { docExp: { '$lte': new Date(alertDate) } } } });
  let driverData = await Driver.aggregate([
    {
      '$match': {
        "status.docs": 'Accepted'
      }
    },
    { "$unwind": "$taxis" },
    { "$match": { "taxis.taxistatus": 'active' } },
    {
      "$project": {
        "fname": 1,
        "phone": 1,
        "email": 1,
        "taxiDocs": "$taxis.document",
        "model": '$taxis.model',
        "year": "$taxis.year",
        "makename": "$taxis.makename",
        "makeId": "$taxis._id"
      }
    },
    {
      "$match": {
        $or: [
          { "taxiDocs.docExp": { "$lte": new Date(alertDate) } },
        ]
      }
    },
  ])
  var filterDriverData = _.map(driverData, (el) => {
    var filterDocData = _.map(el.taxiDocs, (elem) => {
      var checkDate = moment(elem.docExp).isBefore(alertDate);
      if (checkDate) {
        var data = { name: el.fname, email: el.email, ExpName: elem.docName, 'date': moment(el[elem.docExp]).format('YYYY-MM-DD'), 'additionalDetail': "Your Document is on Expiration, please upload new document to avoid deactivation of your account." };
        sendEmail(el.email, data, 'expiryMails');
      }
    })
  })
  // return res.json({ "driverData": driverData });
}