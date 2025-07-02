// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
import path from 'path';
//import models
import * as HelperFunc from './adminfunctions';
import Countries from '../models/common.model';
import State from '../models/commonState.model';
import City from '../models/commonCity.model';
import CmnData from '../models/commonData.model';
import CarMake from '../models/CarMake.model';
import CompanyDetails from '../models/company.model';
import ContactUs from '../models/contactus.model';
import Vehicletype from '../models/vehicletype.model';
import Help from '../models/Help.model';
import Trips from '../models/trips.model';
import Driver from '../models/driver.model';
import Rider from '../models/rider.model';
import Vehicle from '../models/vehicletype.model';
import EditHomeContent from '../models/EditHomeContent.model';
import Faq from '../models/Faq.model';
import Faqcategory from '../models/Faqcategory.model';
import Helpcategory from '../models/Helpcategory.model';
import absKey from '../models/absKey.model';
import * as GFunctions from './functions';
import { sendSmsMsg } from './smsmate';
import OurDrivers from '../models/ourDrivers.model';
import pushNotification from '../models/pushNotificationBackup.model';
import seosetting from '../models/seosettings';
import * as smsGateway from './smsGateway';
import { sendEmail } from './mailGateway';
import { projection } from '@turf/turf';
import cityWiseOffice from '../models/citywiseOffice.model';
import CancelReasons from '../models/cancellationReason.model';
import pushNotificationPrivate from '../models/pushNotificationPrivate.model';
import { getDistanceBttwoCords } from './app';
import RentalPackage from '../models/rentalPackage.model';
import findAndSendFCMToDriver from './app'

const send = require('send');
const mime = send.mime;

var lodash = require('lodash');
var moment = require('moment');
const featuresSettings = require('../featuresSettings');
const fs = require('fs');
var firebase = require('firebase');
const config = require('../config');
const request = require('request');
const jsonfile = require('jsonfile');
const editJsonFile = require("edit-json-file");
const _ = require('lodash');
const pdf = require('html-pdf');
const Mustache = require('mustache');
const AWS = require('aws-sdk');

export const activeKeyFirst = (req, res) => {
  /*   return res.status(200).json({
      'success': true,
      'message': 'Key Activated',
      'data': 'datas'
    }); */

  var protoCol = req.protocol;
  var hostName = req.hostname;
  var portNo = req.connection.localPort;
  var domain = req.get('host');
  var ip = req.connection.remoteAddress;
  var abserveKey = req.body.abserveKey;//'ABSERVE@345';
  var email = req.body.email;//'letsdeliv@gmail.com';
  var activeUrl = req.body.url;
  request({
    method: 'GET',
    // uri: 'http://10.1.1.69:3003/adminapi/keyCheck',
    uri: 'https://abservetech.com:3003/adminapi/keyCheck',
    qs: { protoCol: protoCol, hostName: hostName, portNo: portNo, domain: domain, Ip: ip, key: abserveKey, keyMail: email, activeUrl: activeUrl },

  }, function (err, response, body) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("CANNOT_ABLE_TO_VERIFY_YOUR_ACCOUNT_PLEASE_CONTACT_PROVIDER"), 'error': err });
    }
    let jsonData = JSON.parse(body);
    if (jsonData.success != false) //active status chages
    {
      var originalData = jsonData.data;
      if (originalData.status == 'active') { // call function to set the key active
        setActiveKey(res, originalData.process, originalData);
      }
    } else {
      return res.status(200).json({ 'success': false, 'message': jsonData.message });
    }
  });
}

//Activation Key
export const checkProductKey = (req, res) => {
  // return res.json({
  //   'success': true,
  //   'data': 'keyData'
  // });

  var activeUrl = req.params.url;
  absKey.findOne({}, {}, (err, keyData) => {
    if (err) return res.json({ 'success': false, 'data': '' });
    if (keyData == null) {
      return res.json({ 'success': false, 'data': keyData });
    } else {
      if (keyData.productKey == '' || keyData.status == 'inactive') {
        return res.json({ 'success': false, 'data': keyData });
      }
      return res.json({ 'success': true, 'data': keyData });
    }
  });
}

export const verifyKeyForAdmin = (req, res) => {
  var protoCol = req.protocol;
  var hostName = req.hostname;
  var portNo = req.connection.localPort;
  var domain = req.get('host');
  var path = protoCol + '://' + domain + '/adminapi/checkKey';
  var abserveKey = req.query.abserveKey;
  var aberveMail = req.query.abserveMail;
  var abserveStatus = req.query.abserveStatus;

  var updateKey = {
    productKey: '',
    status: req.query.abserveStatus
  };

  absKey.findOneAndUpdate({ emailId: aberveMail }, updateKey, { new: true }, (err, doc) => {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
    res.redirect(path);
    //return res.status(200).json({'success':true, 'message': 'Key Status changed' });
  });
}


function setActiveKey(res, process, wholeData) {
  if (process == 'first') { // add the key data in table
    var newDoc = new absKey({
      emailId: wholeData.keyMail,
      productKey: wholeData.key,
      activeUrl: wholeData.activeUrl,
      status: wholeData.status,
    });
    newDoc.save((err, datas) => {
      if (err) {
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("KEY_ACTIVATED"), 'data': datas });
    })
  } else if (process == 'verify') { // update the status after verify
    var updateDoc = {
      productKey: wholeData.key,
      status: wholeData.status,
    };
    absKey.findOneAndUpdate({}, updateDoc, { new: true }, (err, todo) => {
      if (err) return err;
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED") });
    });
  }
}

// The following api service are used for get countries which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.
/*
* Inputs if particular state show  params pass --> http://localhost:3001/adminapi/countries, http://localhost:3001/adminapi/countries/1
*/
export const getCountries = async (req, res) => {
  var matchQuery = {};
  if (req.params.id == undefined) {
    matchQuery = { softDelete: false, status: true }
  }
  else {
    matchQuery = { softDelete: false, status: true, id: req.params.id }
  }
  try {
    let countriesDocs = await Countries.aggregate([
      {
        "$match": matchQuery
      },
      {
        "$project": {
          "_id": 1,
          "id": 1,
          "sortname": 1,
          "name": 1,
          "phoneCode": 1,
          "currencyCode": 1,
          "currencyName": 1,
          "status": 1,
          "softDelete": 1,
          "createdAt": 1,
          "createdBy": 1,
          "modifiedAt": 1,
          "modifiedBy": 1,
          "label": "$name",
          "value": "$id"
        }
      }
    ]).exec();
    var arr = [];
    arr.push({ "countries": countriesDocs })
    res.send(arr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err });
  }
}
// The above api service are used for get countries which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.

// The following api service are used for get states which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.
/**
 *
 * @param {*} req
 * @param {*} res
 * Inputs if particular state show  params pass --> http://localhost:3001/adminapi/state, http://localhost:3001/adminapi/state/1
 */
export const getState = async (req, res) => {
  var matchQuery = {};
  if (req.params.id == undefined) {
    matchQuery = { softDelete: false, status: true, country_id: featuresSettings.defaultCountryId }
  }
  else {
    matchQuery = { softDelete: false, status: true, country_id: req.params.id }
  }
  try {
    let statesDocs = await State.aggregate([
      {
        "$match": matchQuery
      },
      {
        "$project": {
          "_id": 1,
          "id": 1,
          "name": 1,
          "country_id": 1,
          "status": 1,
          "softDelete": 1,
          "createdAt": 1,
          "createdBy": 1,
          "modifiedAt": 1,
          "modifiedBy": 1,
          "label": "$name",
          "value": "$id"
        }
      }
    ]).exec();
    var arr = [];
    arr.push({ "states": statesDocs })
    res.send(arr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}
// The above api service are used for get states which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.

// The following api service are used for get cities which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.
/**
 *
 * @param {*} req
 * @param {*} res
 * Inputs if particular city show  params pass --> http://localhost:3001/adminapi/city/1,
 *         http://localhost:3001/adminapi/city
 */
export const getCity = async (req, res) => {
  var matchQuery = {};
  if (req.params.id == undefined) {
    matchQuery = { softDelete: false, status: true, state_id: featuresSettings.defaultStateId }
  }
  else {
    matchQuery = { softDelete: false, status: true, state_id: req.params.id }
  }
  try {
    let cityDocs = await City.aggregate([
      {
        "$match": matchQuery
      },
      {
        "$project": {
          "_id": 1,
          "id": 1,
          "name": 1,
          "state_id": 1,
          "status": 1,
          "softDelete": 1,
          "createdAt": 1,
          "createdBy": 1,
          "modifiedAt": 1,
          "modifiedBy": 1,
          "label": "$name",
          "value": "$id"
        }
      }
    ]).exec();
    var arr = [];
    arr.push({ "cities": cityDocs })
    res.send(arr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}

export const getCountriesForApp = async (req, res) => {
  var matchQuery = {};
  if (req.params.id == undefined) {
    matchQuery = { softDelete: false, status: true }
  }
  else {
    matchQuery = { softDelete: false, status: true, id: req.params.id }
  }
  try {
    let countriesDocs = await Countries.aggregate([
      {
        "$match": matchQuery
      },
      {
        "$project": {
          "_id": 1,
          "id": 1,
          "sortname": 1,
          "name": 1,
          "phoneCode": 1,
          "currencyCode": 1,
          "currencyName": 1,
          "status": 1,
          "softDelete": 1,
          "createdAt": 1,
          "createdBy": 1,
          "modifiedAt": 1,
          "modifiedBy": 1,
          "label": "$name",
          "value": "$id"
        }
      }
    ]).exec();
    res.send(countriesDocs)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err });
  }
}
// The above api service are used for get countries which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.

// The following api service are used for get states which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.
/**
 *
 * @param {*} req
 * @param {*} res
 * Inputs if particular state show  params pass --> http://localhost:3001/adminapi/state, http://localhost:3001/adminapi/state/1
 */
export const getStateForApp = async (req, res) => {
  var matchQuery = {};
  if (req.params.id == undefined) {
    matchQuery = { softDelete: false, status: true, country_id: featuresSettings.defaultCountryId }
  }
  else {
    matchQuery = { softDelete: false, status: true, country_id: req.params.id }
  }
  try {
    let statesDocs = await State.aggregate([
      {
        "$match": matchQuery
      },
      {
        "$project": {
          "_id": 1,
          "id": 1,
          "name": 1,
          "country_id": 1,
          "status": 1,
          "softDelete": 1,
          "createdAt": 1,
          "createdBy": 1,
          "modifiedAt": 1,
          "modifiedBy": 1,
          "label": "$name",
          "value": "$id"
        }
      }
    ]).exec();

    res.send(statesDocs)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}
// The above api service are used for get states which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.

// The following api service are used for get cities which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.
/**
 *
 * @param {*} req
 * @param {*} res
 * Inputs if particular city show  params pass --> http://localhost:3001/adminapi/city/1,
 *         http://localhost:3001/adminapi/city
 */
export const getCityForApp = async (req, res) => {
  var matchQuery = {};
  if (req.params.id == undefined) {
    matchQuery = { softDelete: false, status: true, state_id: featuresSettings.defaultStateId }
  }
  else {
    matchQuery = { softDelete: false, status: true, state_id: req.params.id }
  }
  try {
    let cityDocs = await City.aggregate([
      {
        "$match": matchQuery
      },
      {
        "$project": {
          "_id": 1,
          "id": 1,
          "name": 1,
          "state_id": 1,
          "status": 1,
          "softDelete": 1,
          "createdAt": 1,
          "createdBy": 1,
          "modifiedAt": 1,
          "modifiedBy": 1,
          "label": "$name",
          "value": "$id"
        }
      }
    ]).exec();

    res.send(cityDocs)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}

// The above api service are used for get cities which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.

/**
 *
 * @param {*} req
 * @param {*} res
 * Inputs if particular state show  params pass --> http://localhost:3001/adminapi/countriesForAdminUiCRUD/1
 *        http://localhost:3001/adminapi/countriesForAdminUiCRUD?_page=1&_limit=10
 *        http://localhost:3001/adminapi/countriesForAdminUiCRUD
 */
export const getCountriesForAdminUiCRUD = async (req, res) => {
  if (
    typeof req.query._sort === "undefined"
    || req.query._sort === ""
  ) {
    req.query._sort = "name";
  }

  if (
    typeof req.query._order === "undefined"
    || req.query._order === ""
  ) {
    req.query._order = "ASC";
  }

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);

  likeQuery['softDelete'] = false;
  if (req.params.id != undefined) {
    likeQuery['id'] = req.params.id
  }
  let TotCnt = Countries.find(likeQuery).count();
  let Datas = Countries.find(likeQuery, { _id: 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}

export const addCountriesForAdminUiCRUD = async (req, res) => {
  try {
    let countries = await Countries.find({}, { id: 1 }, { "sort": { "_id": -1 } });
    req.body.sortname = req.body.sortname.toUpperCase();

    req.body.name = lodash.startCase(req.body.name);

    Countries.find({
      $and: [
        {
          $or: [
            { name: req.body.name },
            { sortname: req.body.sortname }
          ]
        },
        { softDelete: false }
      ]
    }, { _id: 0 }, { "sort": { "createdAt": 1 }, "limit": 1 }, function (err, docs) {
      if (err) return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") });
      if (docs.length > 0) {
        if (docs[0].softDelete == false && docs[0].status == true) return res.status(409).json({ 'status': false, 'message': req.i18n.__("REQUESTED_COUNTRY_ALREADY_EXISTS_SINCE_IT_IS_ACTIVE_STATUS") });
        else if (docs[0].softDelete == false && docs[0].status == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__("REQUESTED_COUNTRY_ALREADY_EXISTS_SINCE_IT_IS_INACTIVE_STATUS") });
      }
      var newDoc = new Countries({
        id: Number(countries[0].id) + 1,
        sortname: req.body.sortname,
        name: req.body.name,
        phoneCode: req.body.phoneCode,
        currencyCode: req.body.currencyCode,
        currencyName: req.body.currencyName,
        createdBy: req.body.userId,
      })
      newDoc.save((err, docs) => {
        if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err }) }
        return res.json({ 'status': true, 'message': req.i18n.__("ADDED_SUCCESSFULLY"), "datas": docs })
      })
    })
  }
  catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err.toString() })
  }
}

export const updateCountriesForAdminUiCRUD = (req, res) => {
  try {
    req.body.sortname = req.body.sortname.toUpperCase();
    req.body.name = lodash.startCase(req.body.name);

    Countries.find({
      $and: [
        {
          $or: [
            { name: req.body.name },
            { sortname: req.body.sortname }
          ]
        },
        { softDelete: false }
      ]
    }, { _id: 0 }, { "sort": { "createdAt": 1 }, "limit": 1 }, function (err, docs) {
      if (err) return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") });

      if (docs.length > 0 && docs[0].id != req.body.id) {
        if (req.body.status == 'true' || req.body.status == true) { var bodyStatus = true }
        else if (req.body.status == 'false' || req.body.status == false) { var bodyStatus = false }

        if (docs[0].status == true && bodyStatus == true || docs[0].status == true && bodyStatus == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__("REQUESTED_COUNTRY_ALREADY_EXISTS_SINCE_IT_IS_ACTIVE_STATUS") });
        else if (docs[0].status == false && bodyStatus == false || docs[0].status == false && bodyStatus == true) return res.status(409).json({ 'status': false, 'message': req.i18n.__("REQUESTED_COUNTRY_ALREADY_EXISTS_SINCE_IT_IS_INACTIVE_STATUS") });
        else if (docs[0].softDelete[0] == false && docs[0].status == true && bodyStatus == true) return res.status(401).json({ 'status': false, 'message': req.i18n.__("REQUESTED_COUNTRY_ALREADY_EXISTS") });
      }

      let newDoc = {
        "sortname": req.body.sortname,
        "name": req.body.name,
        "phoneCode": req.body.phoneCode,
        "status": req.body.status,
        "currencyCode": req.body.currencyCode,
        "currencyName": req.body.currencyName,
        "modifiedBy": typeof req.body.userId === "undefined" || req.body.userId === "" ? 0 : req.body.userId,
        "modifiedAt": moment(Date.now()).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      }
      let whereClause = {
        "id": req.body.id
      };
      Countries.updateOne(whereClause, newDoc, (err, doc) => {
        if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() }) }
        return res.status(200).json({ 'status': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
      })
    });
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}

export const deleteCountriesForAdminUiCRUD = (req, res) => {
  let newDoc = {
    "softDelete": true,
    "status": true,
  }
  let whereClause = {
    "id": req.params.id
  };
  Countries.updateOne(whereClause, newDoc, function (err, docs) {
    if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), 'errer': err.toString() }) }
    return res.json({ 'success': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY") })
  })
}

/**
 *
 * @param {*} req
 * @param {*} res
 * Inputs if particular state show  params pass --> http://localhost:3001/adminapi/statesForAdminUiCRUD/1
 *         http://localhost:3001/adminapi/statesForAdminUiCRUD?_page=1&_limit=10
 *         http://localhost:3001/adminapi/statesForAdminUiCRUD
 */
export const getStatesForAdminUiCRUD = async (req, res) => {
  if (
    typeof req.query._sort === "undefined"
    || req.query._sort === ""
  ) {
    req.query._sort = "name";
  }

  if (
    typeof req.query._order === "undefined"
    || req.query._order === ""
  ) {
    req.query._order = "ASC";
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = {};

  if (
    typeof req.query["_page"] !== "undefined"
    && typeof req.query["_limit"] !== "undefined"
  ) {
    pageQuery = HelperFunc.paginationBuilder(req.query);
  }

  var sortQuery = HelperFunc.sortQueryBuilder(req.query);

  if (req.params.id == undefined) {
    likeQuery['softDelete'] = false;
  }
  else {
    likeQuery['country_id'] = req.params.id;
    likeQuery['softDelete'] = false;
  }

  let TotCnt = State.find(likeQuery).count();
  let Datas = State.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.json([err]);
  }
}
// export const getStatesForAdminUiCRUD = async (req, res) => {
//   if (
//     typeof req.query._sort === "undefined"
//     || req.query._sort === ""
//   ) {
//     req.query._sort = "name";
//   }

//   if (
//     typeof req.query._order === "undefined"
//     || req.query._order === ""
//   ) {
//     req.query._order = "ASC";
//   }
//   var likeQuery = HelperFunc.likeQueryBuilder(req.query);
//   var pageQuery = {};

//   if (
//     typeof req.query["_page"] !== "undefined"
//     && typeof req.query["_limit"] !== "undefined"
//   ) {
//     pageQuery = HelperFunc.paginationBuilder(req.query);
//   }

//   var sortQuery = HelperFunc.sortQueryBuilder(req.query);

//   var skip = { "$match": {} };
//   var limit = { "$match": {} };

//   if (req.params.id == undefined) {
//     likeQuery['softDelete'] = false;
//     if (typeof pageQuery.skip !== "undefined") {
//       skip = { "$skip": pageQuery.skip };
//     }
//     if (typeof pageQuery.take !== "undefined") {
//       limit = { "$limit": pageQuery.take };
//     }
//   }
//   else {
//     likeQuery['id'] = req.params.id;
//     likeQuery['softDelete'] = false;
//   }

//   let TotCnt = State.aggregate([
//     {
//       "$lookup": {
//         "from": "countries",
//         "localField": "country_id",
//         "foreignField": "id",
//         "as": "countries"
//       }
//     },
//     { "$unwind": "$countries" },
//     { "$match": { "countries.softDelete": false } },
//     {
//       "$project": {
//         id: 1,
//         name: 1,
//         country_id: 1,
//         country_name: "$countries.name",
//         status: 1,
//         _id: 0,
//         phoneCode: 1,
//         softDelete: 1,
//         createdAt: 1
//       }
//     },
//     { "$match": likeQuery },
//   ])
//   let Datas = State.aggregate([
//     {
//       "$lookup": {
//         "from": "countries",
//         "localField": "country_id",
//         "foreignField": "id",
//         "as": "countries"
//       }
//     },
//     { "$unwind": "$countries" },
//     { "$match": { "countries.softDelete": false } },
//     {
//       "$project": {
//         id: 1,
//         name: 1,
//         country_id: 1,
//         country_name: "$countries.name",
//         status: 1,
//         _id: 0,
//         phoneCode: 1,
//         softDelete: 1,
//         createdAt: 1
//       }
//     },
//     { "$match": likeQuery },
//     { "$sort": sortQuery },
//     skip,
//     limit
//   ]);
//   try {
//     var promises = await Promise.all([TotCnt, Datas]);
//     res.header('x-total-count', promises[0].length);
//     var resstr = promises[1];
//     res.send(resstr)
//   } catch (err) {
//     return res.json([err]);
//   }
// }

export const addStatesForAdminUiCRUD = async (req, res) => {
  let state = await State.find({}, { id: 1 }, { "sort": { "_id": -1 } }).limit(1);
  try {
    req.body.name = lodash.startCase(req.body.name);
    State.find({ name: req.body.name, softDelete: false }, { _id: 0 }, { "sort": { "createdAt": 1 }, "limit": 1 }, function (err, docs) {
      if (err) return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") });
      if (docs.length > 0 && docs[0].country_id == req.body.country_id) {
        if (docs[0].softDelete == false && docs[0].status == true) return res.status(409).json({ 'status': false, 'message': req.i18n.__("STATUS_NAME_ALREADY_EXISTS_AND_THE_SELECTED_STATES_NAME_IS_ACTIVE") });
        else if (docs[0].softDelete == false && docs[0].status == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__("STATUS_NAME_ALREADY_EXISTS_AND_THE_SELECTED_STATES_NAME_IS_INACTIVE") });
      }
      var newDoc = new State({
        id: Number(state[0].id) + 1,
        name: req.body.name,
        country_id: req.body.country_id,
        createdBy: req.body.userId,
      });
      newDoc.save((err, docs) => {
        if (err) {
          return res.status(500).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
        }
        return res.status(200).json({ 'status': true, 'message': req.i18n.__("ADDED_SUCCESSFULLY"), "datas": docs })
      })
    })
  }
  catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}

export const updateStatesForAdminUiCRUD = (req, res) => {
  req.body.name = lodash.startCase(req.body.name);
  State.find({ name: req.body.name, country_id: req.body.country_id, softDelete: false }, { _id: 0 }, { "sort": { "createdAt": 1 }, "limit": 1 }, function (err, docs) {
    if (err) return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") });
    if (docs.length > 0 && docs[0].id != req.body.id) {

      if (req.body.status == 'true' || req.body.status == true) { var bodyStatus = true }
      else if (req.body.status == 'false' || req.body.status == false) { var bodyStatus = false }

      if (docs[0].status == true && bodyStatus == true || docs[0].status == true && bodyStatus == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__("STATUS_NAME_ALREADY_EXISTS_AND_THE_SELECTED_STATES_NAME_IS_ACTIVE") });
      else if (docs[0].status == false && bodyStatus == false || docs[0].status == false && bodyStatus == true) return res.status(409).json({ 'status': false, 'message': req.i18n.__("STATUS_NAME_ALREADY_EXISTS_AND_THE_SELECTED_STATES_NAME_IS_INACTIVE") });
      else if (docs[0].softDelete[0] == false && docs[0].status == true && bodyStatus == true) return res.status(401).json({ 'status': false, 'message': req.i18n.__("STATUS_NAME_ALREADY_EXISTS") });
    }

    let newDoc = {
      "name": req.body.name,
      "country_id": req.body.country_id,
      "status": req.body.status,
      "modifiedBy": req.body.userId,
      "modifiedAt": moment(Date.now()).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    }
    let whereClause = {
      "id": req.body.id
    };
    State.updateOne(whereClause, newDoc, (err, doc) => {
      if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() }) }
      return res.status(200).json({ 'status': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
    })
  });
}

export const deleteStatesForAdminUiCRUD = (req, res) => {
  let newDoc = {
    "softDelete": true,
    "status": true,
  }
  let whereClause = {
    "id": req.params.id
  };
  State.updateOne(whereClause, newDoc, function (err, docs) {
    if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), 'errer': err.toString() }) }
    return res.json({ 'success': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY") })
  })
}

/**
 *
 * @param {*} req
 * @param {*} res
 * Inputs if particular city show  params pass --> http://localhost:3001/adminapi/citiesForAdminUiCRUD/, http://localhost:3001/adminapi/citiesForAdminUiCRUD/1
 *        else --> http://localhost:3001/adminapi/citiesForAdminUiCRUD?_page=1&_limit=10
 */
export const getCitiesForAdminUiCRUD = async (req, res) => {
  if (
    typeof req.query._sort === "undefined"
    || req.query._sort === ""
  ) {
    req.query._sort = "name";
  }

  if (
    typeof req.query._order === "undefined"
    || req.query._order === ""
  ) {
    req.query._order = "ASC";
  }

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = {};

  if (
    typeof req.query["_page"] !== "undefined"
    && typeof req.query["_limit"] !== "undefined"
  ) {
    pageQuery = HelperFunc.paginationBuilder(req.query);
  }

  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  // if(req.params.id === undefined){
  //   return res.status(409).json({'message':"Please choose cnty and state name"})
  // }
  likeQuery['state_id'] = req.params.id;
  likeQuery['softDelete'] = false;

  let TotCnt = City.find(likeQuery).count();
  let Datas = City.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.json([]);
  }
}
// export const getCitiesForAdminUiCRUD = async (req, res) => {
//   if (
//     typeof req.query._sort === "undefined"
//     || req.query._sort === ""
//   ) {
//     req.query._sort = "name";
//   }

//   if (
//     typeof req.query._order === "undefined"
//     || req.query._order === ""
//   ) {
//     req.query._order = "ASC";
//   }

//   var likeQuery = HelperFunc.likeQueryBuilder(req.query);
//   var pageQuery = {};

//   if (
//     typeof req.query["_page"] !== "undefined"
//     && typeof req.query["_limit"] !== "undefined"
//   ) {
//     pageQuery = HelperFunc.paginationBuilder(req.query);
//   }

//   var sortQuery = HelperFunc.sortQueryBuilder(req.query);

//   var skip = { "$match": {} };
//   var limit = { "$match": {} };

//   if (req.params.id == undefined) {
//     likeQuery['softDelete'] = false;
//     if (typeof pageQuery.skip !== "undefined") {
//       skip = { "$skip": pageQuery.skip };
//     }
//     if (typeof pageQuery.take !== "undefined") {
//       limit = { "$limit": pageQuery.take };
//     }
//   }
//   else {
//     likeQuery['id'] = req.params.id;
//     likeQuery['softDelete'] = false;
//   }

//   // let TotCnt = City.find({}).count();
//   let TotCnt = City.aggregate([
//     {
//       "$lookup": {
//         "from": "states",
//         "localField": "state_id",
//         "foreignField": "id",
//         "as": "states"
//       }
//     },
//     { "$unwind": "$states" },
//     { "$match": { "states.softDelete": false } },

//     {
//       "$lookup": {
//         "from": "countries",
//         "localField": "states.country_id",
//         "foreignField": "id",
//         "as": "countries"
//       }
//     },
//     { "$unwind": "$countries" },
//     { "$match": { "countries.softDelete": false } },
//     {
//       "$project": {
//         id: 1,
//         name: 1,
//         state_id: 1,
//         state_name: "$states.name",
//         country_id: "$states.country_id",
//         country_name: "$countries.name",
//         status: 1,
//         _id: 0,
//         softDelete: 1,
//         createdAt: 1
//       }
//     },
//     { "$match": likeQuery },
//   ])

//   let Datas = City.aggregate([
//     {
//       "$lookup": {
//         "from": "states",
//         "localField": "state_id",
//         "foreignField": "id",
//         "as": "states"
//       }
//     },
//     { "$unwind": "$states" },
//     { "$match": { "states.softDelete": false } },

//     {
//       "$lookup": {
//         "from": "countries",
//         "localField": "states.country_id",
//         "foreignField": "id",
//         "as": "countries"
//       }
//     },
//     { "$unwind": "$countries" },
//     { "$match": { "countries.softDelete": false } },
//     {
//       "$project": {
//         id: 1,
//         name: 1,
//         state_id: 1,
//         state_name: "$states.name",
//         country_id: "$states.country_id",
//         country_name: "$countries.name",
//         status: 1,
//         _id: 0,
//         softDelete: 1,
//         createdAt: 1
//       }
//     },
//     { "$match": likeQuery },
//     { "$sort": sortQuery },
//     skip,
//     limit
//   ])
//   try {
//     var promises = await Promise.all([TotCnt, Datas]);
//     res.header('x-total-count', promises[0]);
//     var resstr = promises[1];
//     res.send(resstr)
//   } catch (err) {
//     return res.json([]);
//   }
// }

export const addCitiesForAdminUiCRUD = async (req, res) => {
  req.body.name = lodash.startCase(req.body.name);
  let city = await City.find({}, { id: 1 }, { "sort": { "_id": -1 } });
  try {
    City.find({ name: req.body.name, state_id: req.body.state_id, softDelete: false }, { _id: 0 }, { "sort": { "createdAt": 1 }, "limit": 1 }, function (err, docs) {
      if (err) return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") });
      if (docs.length > 0) {
        if (docs[0].softDelete == false && docs[0].status == true) return res.status(409).json({ 'status': false, 'message': req.i18n.__("CITIES_NAME_ALREADY_EXISTS_AND_THE_SELECTED_CITIES_NAME_IS_ACTIVE") });
        else if (docs[0].softDelete == false && docs[0].status == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__("CITIES_NAME_ALREADY_EXISTS_AND_THE_SELECTED_CITIES_NAME_IS_INACTIVE") });
      }
      var newDoc = new City({
        id: Number(city[0].id) + 1,
        name: req.body.name,
        state_id: req.body.state_id,
        createdBy: req.body.userId,
      })
      newDoc.save((err, docs) => {
        if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err }) }
        return res.status(200).json({ 'status': true, 'message': req.i18n.__("ADDED_SUCCESSFULLY"), "datas": docs })
      })
    })
  }
  catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err })
  }
}

export const updateCitiesForAdminUiCRUD = (req, res) => {
  req.body.name = lodash.startCase(req.body.name);
  City.find({ name: req.body.name, state_id: req.body.state_id, softDelete: false }, { _id: 0 }, { "sort": { "createdAt": 1 }, "limit": 1 }, function (err, docs) {
    if (err) return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") });
    if (docs.length > 0 && docs[0].id != req.body.id) {
      if (req.body.status == 'true' || req.body.status == true) { var bodyStatus = true }
      else if (req.body.status == 'false' || req.body.status == false) { var bodyStatus = false }

      if (docs[0].status == true && bodyStatus == true || docs[0].status == true && bodyStatus == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__("CITIES_NAME_ALREADY_EXISTS_AND_THE_SELECTED_CITIES_NAME_IS_ACTIVE") });
      else if (docs[0].status == false && bodyStatus == false || docs[0].status == false && bodyStatus == true) return res.status(409).json({ 'status': false, 'message': req.i18n.__("CITIES_NAME_ALREADY_EXISTS_AND_THE_SELECTED_CITIES_NAME_IS_INACTIVE") });
      else if (docs[0].softDelete[0] == false && docs[0].status == true && bodyStatus == true) return res.status(401).json({ 'status': false, 'message': req.i18n.__("CITIES_NAME_ALREADY_EXISTS") });
    }

    let newDoc = {
      "name": req.body.name,
      "state_id": req.body.state_id,
      "status": req.body.status,
      "modifiedBy": req.body.userId,
      "modifiedAt": moment(Date.now()).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
    }
    let whereClause = {
      "id": req.body.id
    };
    City.updateOne(whereClause, newDoc, (err, doc) => {
      if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() }) }
      return res.status(200).json({ 'status': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
    })
  });
}

export const deleteCitiesForAdminUiCRUD = (req, res) => {
  let newDoc = {
    "softDelete": true,
    "status": true,
  }
  let whereClause = {
    "id": req.params.id
  };
  City.updateOne(whereClause, newDoc, function (err, docs) {
    if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), 'errer': err.toString() }) }
    return res.json({ 'success': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY") })
  })
}


export const getCompanies = (req, res) => {
  CompanyDetails.find({}, { pwd: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

export const getLanguages = (req, res) => {
  CmnData.find({ "_id": "2" }, {}).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

export const getCurrency = (req, res) => {
  CmnData.find({ "_id": "1" }, {}).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

export const getCurnlang = (req, res) => {
  CmnData.find().exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

export const getYears = (req, res) => {
  CmnData.find({ "_id": "3" }, {}).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

export const getallvehicletypes = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scIds.scId'] = { "$in": req.scId };
  // likeQuery['tripTypeCode'] = 'daily'
  Vehicletype.find(likeQuery, { _id: 1, type: 1 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    docs = lodash.uniqBy(docs, 'type');
    return res.json(docs);
  });
}

export const getCarMake = (req, res) => {
  CarMake.find({}, { _id: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

export const getCarMakeAndYear = (req, res) => {
  CarMake.find({}, { _id: 0 }).exec((err, docs) => {
    if (err) { }
    else {
      let query = [
        { "$match": { "_id": "3" } },
      ]
      if (featuresSettings.latestYearList) {
        query = [
          { "$match": { "_id": "3" } },
          { "$unwind": "$datas" },
          { "$match": { "datas.id": { "$gte": moment().subtract(featuresSettings.latestYearCount, 'y').format('YYYY') } } },
          {
            "$group": {
              "_id": "$_id",
              "datas": { "$push": "$datas" }
            }
          }
        ]

      }
      CmnData.aggregate(query).exec((err, docs2) => {
        if (err) { }
        else {

          CmnData.find({ "_id": "4" }, {}).exec((err, docs3) => {
            if (err) { }
            else {
              return res.json({ 'success': true, 'carmake': docs, 'years': docs2, 'color': docs3 });
            }
          });

        }
      });
    }
  });
}


/**
 * Recent Registered user
 * @param {*} req
 * @param {*} res
 */
export const availableVehicleType = async (req, res) => {
  var resObj = {};
  let carmakes = CarMake.find({}, { _id: 0 }),
    common = CmnData.find({ "_id": "3" }),
    vehicleData = Vehicle.find({}, { loc: 0 });
  try {
    var promises = await Promise.all([carmakes, common, vehicleData]);
    var carmakesdata = promises[0];
    var commondata = promises[1];
    var vehicledata = promises[2];
    if (req.params.id) {

      Driver.findById(req.userId, function (err, docs) {
        if (err) return res.status(200).json(resObj);
        var taxi = docs.taxis.id(req.params.id);
        var taxitype = taxi.type;
        for (var j = 0; j < vehicledata.length; j++) {
          var current = vehicledata[j]["type"];
          taxitype = JSON.stringify(taxitype);
          var ifinclude = taxitype.includes(current);
          if (ifinclude) {
            vehicledata[j]["status"] = true;
          }
        }
        return res.status(200).json({ "carmake": carmakesdata[0].datas, "year": commondata[0].datas, "vehicle": vehicledata });
      });
    }
    else {
      // for (var j = 0; j < vehicledata.length; j++) {
      //   vehicledata[j]["status"] = "0";
      // }
      return res.status(200).json({ "carmake": carmakesdata[0].datas, "year": commondata[0].datas, "vehicle": vehicledata });
    }
  } catch (err) {
    return res.status(200).json(resObj);
  }
}

export const sendAboutus = (req, res) => {
  var path = __dirname + '/html/about.html';
  if (req.headers['accept-language'] == 'es') path = __dirname + '/html/esabout.html';
  res.sendFile(path);
}

export const sendPrivacypolicy = (req, res) => {
  var path = __dirname + '/html/privacypolicy.html';
  if (req.headers['accept-language'] == 'es') path = __dirname + '/html/esprivacypolicy.html';
  res.sendFile(path);
}

export const sendTnc = (req, res) => {
  var path = __dirname + '/html/tnc.html';
  if (req.headers['accept-language'] == 'es') path = __dirname + '/html/estnc.html';
  res.sendFile(path);
}

export const sendDriverTnc = (req, res) => {
  var path = __dirname + '/html/ridertnc.html';
  if (req.headers['accept-language'] == 'es') path = __dirname + '/html/esridertnc.html';
  res.sendFile(path);
}

//file test
export const filetest = (req, res) => {
  var header = JSON.stringify(req.headers);
  var body = JSON.stringify(req.body);
  var params = JSON.stringify(req.params);

  var filename = "";
  if (req['file'] != null) {
    return res.json({ 'success': true, 'message': req.i18n.__("FILE_UPLOADED_SUCCESSFULLY"), 'file': req['file'], 'header': header, 'body': body, 'params': params });
  } else {
    return res.json({ 'success': false, 'message': req.i18n.__("NO_FILE_SELECTED"), 'file': req['file'], 'header': header, 'body': body, 'params': params });
  }

}

/**
 * Send Message to Admin
 * @input
 * @param
 * @return
 * @response
 */
export const contactUs = (req, res) => {
  var body = {
    subject: req.body.subject,
    message: req.body.message,
    from: req.name,
    fromId: req.userId,
    mail: req.email,
    type: req.type,
    date: moment().format('DD-MM-YYYY')
  }
  const newDoc = new ContactUs(body);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    sendEmail(config.companymail, body, 'userQuery', req.headers['accept-language'])
    return res.json({ 'success': true, 'message': req.i18n.__("MESSAGE_SENDED_SUCCESSFULLY"), docs });
  })
}

//Car Make as Separate Doc

/**
 * Add car make
 * @input
 * @param
 * @return
 * @response
 */
export const addCarMake = (req, res) => {
  var updateData = {
    make: req.body.make,
    model: req.body.model
  }
  CarMake.findOneAndUpdate({ carmake: 'yes' }, {
    $push: { datas: updateData }
  }, { 'new': true },
    function (err, doc) {
      if (err) {
        return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
      }
      return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), 'data': updateData });
    }
  );
}

/**
 * Update car make
 * @input
 * @param
 * @return
 * @response
 */
export const updateCarMake = (req, res) => {
  CarMake.update({ 'datas._id': mongoose.Types.ObjectId(req.body.makeid) }, {
    '$set': {
      'datas.$.make': req.body.make,
      'datas.$.model': req.body.model,
    }
  },
    function (err, docs) {
      if (err) {
        return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs.carmake });
    });
}


/**
 * Delete car make
 * @input
 * @param
 * @return
 * @response
 */
export const delCarMake = (req, res) => {
  CarMake.update({}, { $pull: { datas: { _id: req.params.id } } },
    function (err, docs) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY"), 'data': docs.carmake });

    });
}

/**
 * Update car make
 * @input
 * @param
 * @return
 * @response
 */
export const addCarmodel = (req, res) => {
  CarMake.findById(req.body.id, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var carmake = docs.datas.id(req.body.makeid);
    var models = carmake.model;
    models.push(req.body.model);
    carmake.model = models;
    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs.carmake });
    });
  });
}
//Car Make as Separate Doc

/**
 * View Driver Reviews
 * @input
 * @param
 * @return
 * @response
 */
export const getDriverReview = (req, res) => {

  if (
    typeof req.query._sort === "undefined"
    || req.query._sort === ""
  ) {
    req.query._sort = "riderfb.rating";
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
  likeQuery['status'] = "Finished";
  likeQuery['riderfb'] = { "$ne": null };
  likeQuery['riderfb.cmts'] = { "$ne": "" };

  if (likeQuery["Comments"]) {
    likeQuery['riderfb.cmts'] = new RegExp(likeQuery["Comments"], 'i'); //String(likeQuery.code)
    delete likeQuery["Comments"];
  }

  if (btQuery["Rating"]) {
    likeQuery['riderfb.rating'] = btQuery["Rating"];
    delete btQuery["Rating"];
  }

  var totalCount = 10;
  Trips.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  Trips.find(likeQuery, { cpy: 0, cpyid: 0, fare: 0, taxi: 0, service: 0, estTime: 0, needClear: 0, reqDvr: 0, review: 0, status: 0, dsp: 0, csp: 0, triptype: 0, createdAt: 0, acsp: 0, adsp: 0, tripDT: 0, tripFDT: 0, __v: 0, utc: 0, paymentSts: 0, driverfb: 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}
/**
 * Delete Driver Reviews
 * @input
 * @param
 * @return
 * @response
 */
export const deleteDriverReview = (req, res) => {
  Trips.findById(req.params.id, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var review = docs.riderfb;

    UpdateDriverRating(review.rating, docs.dvrid);
    review.cmts = '';
    review.rating = 0;

    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("REVIEW_DELETED_SUCCESSFULLY") });
    });

  });
}

function UpdateDriverRating(rating = 0, dvrid) {
  Driver.findById(dvrid, function (err, docs) {
    if (err) { } else if (!docs) { }
    else {
      let oldnos = docs.rating.nos;
      let rate = parseFloat(docs.rating.rating) * oldnos;
      oldnos--;
      docs.rating.rating = ((rate - parseFloat(rating)) / oldnos).toFixed(2);
      docs.rating.nos = oldnos;
      if (rating == 5 || rating == "5") { let starnos = docs.rating.star; starnos--; docs.rating.star = oldnos; }
      docs.save(function (err, op) {
        if (err) { }
        else { console.log("UpdateRiderRating", rating); }
      })
    }
  });
}

/**
* View Rider Reviews
* @input
* @param
* @return
* @response
*/
export const getRiderReview = (req, res) => {
  if (
    typeof req.query._sort === "undefined"
    || req.query._sort === ""
  ) {
    req.query._sort = "driverfb.rating";
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

  var totalCount = 10;
  likeQuery['status'] = "Finished";
  likeQuery['driverfb'] = { "$ne": null };
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = { "$in": req.userId };
  likeQuery["driverfb.cmts"] = { "$ne": "" }

  if (likeQuery["Comments"]) {
    likeQuery['driverfb.cmts'] = new RegExp(likeQuery["Comments"], 'i'); //String(likeQuery.code)
    delete likeQuery["Comments"];
  }

  if (btQuery["Rating"]) {
    likeQuery['driverfb.rating'] = btQuery["Rating"];
    delete btQuery["Rating"];
  }

  Trips.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  Trips.find(likeQuery, { cpy: 0, cpyid: 0, fare: 0, taxi: 0, service: 0, estTime: 0, needClear: 0, reqDvr: 0, review: 0, status: 0, dsp: 0, csp: 0, triptype: 0, createdAt: 0, acsp: 0, adsp: 0, tripDT: 0, tripFDT: 0, __v: 0, utc: 0, paymentSts: 0, riderfb: 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });


  /* Trips.aggregate([
     { $unwind: "$driverfb" },
     { $group:

       {
         _id: null,
         riderReviews: { $push: "$driverfb"  }
       }

   }
   ], function (err, result) {
     if (err) {
       return;
     }
     return res.json(result[0].riderReviews);
   });*/
}

/**
 * Delete Rider Reviews
 * @input
 * @param
 * @return
 * @response
 */
export const deleteRiderReview = (req, res) => {
  Trips.findById(req.params.id, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    var review = docs.driverfb;
    UpdateRiderRating(review.rating, docs.ridid);
    review.cmts = '';
    review.rating = 0;

    docs.save(function (err, op) {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("REVIEW_DELETED_SUCCESSFULLY") });
    });

  });
}

function UpdateRiderRating(rating = 0, ridid) {
  Rider.findById(ridid, function (err, docs) {
    if (err) { } else if (!docs) { }
    else {
      let oldrating = parseFloat(docs.rating.rating);
      let oldnos = docs.rating.nos;
      let rate = oldrating * oldnos;
      oldnos--;
      docs.rating.rating = ((rate - parseFloat(rating)) / oldnos).toFixed(2);
      docs.rating.nos = oldnos;
      docs.save(function (err, op) {
        if (err) { }
        else { console.log("UpdateRiderRating", rating); }
      })
    }
  });
}

/**
 * Logout Respective User
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const logout = (req, res) => {
  var userType = req.type;
  if (userType == 'driver') {
    var update = {
      // fcmId: '',
      isLogin: false,
      online: "0",
      last_out: Date.now(),
      coords: [0, 0],
      "driverLocation.coordinates": [0, 0]
    }
    Driver.findByIdAndUpdate(req.userId, update, { new: true }, (err, doc) => {
      if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("LOGOUT_SUCCESSFULLY") });
    })
  } else {
    var update = {
      isLogin: false,
      //fcmId: ''
    }
    Rider.findByIdAndUpdate(req.userId, update, { new: true }, (err, doc) => {
      if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      return res.json({ 'success': true, 'message': req.i18n.__("LOGOUT_SUCCESSFULLY") });
    })
  }
}

//Utilities

//view homecontent

export const viewhomecontent = (req, res) => {
  EditHomeContent.findOne({}, function (err, data) {
    if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER") }) }
    res.send(data)
  });
}

export const updatehomecontents = (req, res) => {
  EditHomeContent.findById(req.body._id, function (err, data) {
    if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__('ERROR_SERVER') }) }
    if (req.files.length != 0) {
      for (var i = 0; i < req.files.length; i++) {
        if (req.files[i].fieldname == 'banner_left_image') {
          data.banner_left_image = req.files[i].path;
        }
        else if (req.files[i].fieldname == 'banner_right_image') {
          data.banner_right_image = req.files[i].path;
        }
        else if (req.files[i].fieldname == 'section_image_one') {
          data.section_image_one = req.files[i].path;
        }
        else if (req.files[i].fieldname == 'section_image_two') {
          data.section_image_two = req.files[i].path;
        }
        else if (req.files[i].fieldname == 'section_image_three') {
          data.section_image_three = req.files[i].path;
        }
        else if (req.files[i].fieldname == 'background_image1') {
          data.background_image1 = req.files[i].path;
        }
        else if (req.files[i].fieldname == 'left_image1') {
          data.left_image1 = req.files[i].path;
        }
        else if (req.files[i].fieldname == 'background_image2') {
          data.background_image2 = req.files[i].path;
        }
        else if (req.files[i].fieldname == 'file') {
          data.left_image2 = req.files[i].path;
        }
      }
    }
    data.first_label1 = req.body.first_label1;
    data.second_label1 = req.body.second_label1;
    data.banner_left_text = req.body.banner_left_text;
    data.banner_right_text = req.body.banner_right_text;
    data.section_title = req.body.section_description;
    data.section_description = req.body.section_description;
    data.section_title_one = req.body.section_title_one;
    data.section_description_one = req.body.section_description_one;
    data.section_title_two = req.body.section_title_two;
    data.section_description_two = req.body.section_description_two;
    data.section_title_three = req.body.section_title_three;
    data.section_description_three = req.body.section_description_three;
    data.right_title1 = req.body.right_title1;
    data.right_description1 = req.body.right_description1;
    data.right_title2 = req.body.right_title2;
    data.right_description2 = req.body.right_description2;
    data.first_label2 = req.body.first_label2;
    data.second_label2 = req.body.second_label2;

    data.save((err, update) => {
      if (err) { if (err) { return res.status(400).json({ 'status': false, 'message': req.i18n.__('ERROR_SERVER') }) } }
      return res.status(200).json({ 'status': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") })
    })
  })
}

/**
 * Add Help
 */
export const addhelp = (req, res) => {
  var updateData = {
    ihelpcategoryId: req.body.ihelpcategoryId,
    ihelpcategorytitle: req.body.ihelpcategorytitle,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    English: req.body.English
  }
  const newDoc = new Help(updateData);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("HELP_ADDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Get Help
 */
export const gethelp = (req, res) => {
  Help.find({}).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}


/**
 * Update Help
 */
export const updatehelp = (req, res) => {
  var upd = {
    ihelpcategoryId: req.body.ihelpcategoryId,
    ihelpcategorytitle: req.body.ihelpcategorytitle,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    English: req.body.English
  };
  var id = req.body.id;
  var upds = { '_id': id };
  Help.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });

  });
}

/**
 * Delete Help
 */
export const deletehelp = (req, res) => {
  Help.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("HELP_DELETED_SUCCESSFULLY") });
  });
}

/**
 * All pages content (CMS)
 */
export const addPageContent = (req, res) => {
  const newDoc = new Pages(req.body);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json(err);
    }
    return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), docs });
  })
}

export const getPageContent = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 50;
  Pages.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  Pages.find(likeQuery, { key: 0 }).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}

export const updatePageContent = (req, res) => {
  var upd = {
    title: req.body.title,
    section: req.body.section,
    desc: req.body.desc,
  };
  var id = req.body._id;
  var upds = { '_id': id };
  Pages.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });
  });
}


/**
 * Get FAQ
 */
export const getfaq = (req, res) => {
  Faq.find({}).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

/**
 * Update FAQ
 */
export const updatefaq = (req, res) => {
  var upd = {
    ifaqcategoryId: req.body.ifaqcategoryId,
    ifaqcategorytitle: req.body.ifaqcategorytitle,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    English: req.body.English
  };
  var id = req.body.id;
  var upds = { '_id': id };
  Faq.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });

  });
}

/**
 * Add FAQ Category
 */
export const addfaqcategory = (req, res) => {
  var updateData = {
    eStatus: req.body.eStatus,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    vTitle_FN: req.body.vTitle_FN
  }
  const newDoc = new Faqcategory(updateData);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("MESSAGE_SENDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Get FAQ Category
 */
export const getfaqcategory = (req, res) => {
  Faqcategory.find({}).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

/**
 * Update FAQ Category
 */
export const updatefaqcategory = (req, res) => {
  var upd = {
    eStatus: req.body.eStatus,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    vTitle_FN: req.body.vTitle_FN
  };
  var id = req.body.id;
  var upds = { '_id': id };
  Faqcategory.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });

  });
}


/**
 * Add  Help Category
 */
export const addhelpcategory = (req, res) => {
  var updateData = {
    eStatus: req.body.eStatus,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    vTitle_FN: req.body.vTitle_FN
  }
  const newDoc = new Helpcategory(updateData);
  newDoc.save((err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("MESSAGE_SENDED_SUCCESSFULLY"), docs });
  })
}

/**
 * Get help Category
 */
export const gethelpcategory = (req, res) => {
  Helpcategory.find({}).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    return res.json(docs);
  });
}

/**
 * Update FAQ Help Category
 */
export const updatehelpcategory = (req, res) => {
  var upd = {
    eStatus: req.body.eStatus,
    iDisplayOrder: req.body.iDisplayOrder,
    vTitle_EN: req.body.vTitle_EN,
    vTitle_FN: req.body.vTitle_FN
  };
  var id = req.body.id;
  var upds = { '_id': id };
  Helpcategory.updateOne(upds, upd, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), 'data': docs });

  });
}

/**
 * sendPushNotifyBulk
 */
export const sendPushNotifyBulk = (req, res) => {
  var forType = req.params.forType;
  var message = req.body.message;
  var forWhom = req.body.forWhom;
  var findQuery = { fcmId: { $ne: "" } };
  var isDriver = true;
  switch (forWhom) {
    case 'AllDrivers':
      findQuery = { fcmId: { $ne: "" } };
      break;
    case 'OnlineDrivers':
      findQuery = { fcmId: { $ne: "" }, online: "1" };
      break;
    case 'OfflineDrivers':
      findQuery = { fcmId: { $ne: "" }, online: "0" };
      break;
    case 'InactiveDrivers':
      findQuery = { fcmId: { $ne: "" }, 'softdel': 'inactive' };
      break;
    case 'PendingDrivers':
      findQuery = { fcmId: { $ne: "" }, 'status.docs': 'pending' };
      break;
    case 'AcceptedDrivers':
      findQuery = { fcmId: { $ne: "" }, 'status.docs': 'Accepted' };
      break;
    case 'SoftrejectDrivers':
      findQuery = { fcmId: { $ne: "" }, 'softReject': true };
      break;
    case 'Driver':
      findQuery = { fcmId: { $ne: "" }, code: req.body.code };
      break;
    case 'AllRiders':
      var isDriver = false;
      findQuery = { fcmId: { $ne: "" } };
      break;
    case 'InactiveRiders':
      var isDriver = false;
      findQuery = { fcmId: { $ne: "" }, softdel: 'inactive' };
      break;
    default:
      findQuery = { fcmId: { $ne: "" } };
      break;
  }

  var serviceCity = req.body.scity;
  if (serviceCity) findQuery.scity = serviceCity

  if (isDriver) {
    Driver.find(findQuery, { "fcmId": 1, "phone": 1, "phcode": 1 }).exec((err, docs) => {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      var Data = {};

      if (forType == 'sms') {
        sendSMStothisLists(docs, message);
        Data['forType'] = 2;
      } else {
        sendFCMtothisLists(docs, message);
        Data['forType'] = 1;
      }
      Data['message'] = req.body.message;
      Data['forWhom'] = req.body.forWhom;

      backupdata(Data);
      if(req.body.code) {
        if(docs.length) Data['userId'] = docs[0]._id;
        backupPrivateData(Data);
      }
      return res.json({ 'success': true, 'message': req.i18n.__("NOTIFICATION_TASK_SUCCESSFULLY_QUEUED") });
    });
  } else {
    Rider.find(findQuery, { "fcmId": 1, "phone": 1, "phcode": 1 }).lean().exec((err, docs) => {
      if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      var Data = {};

      if (forType == 'sms') {
        sendSMStothisLists(docs, message);
        Data['forType'] = 2;
      } else {
        sendFCMtothisLists(docs, message);
        Data['forType'] = 1;
      }
      Data['message'] = req.body.message;
      Data['forWhom'] = req.body.forWhom;
      backupdata(Data);
      return res.json({ 'success': true, 'message': req.i18n.__("NOTIFICATION_TASK_SUCCESSFULLY_QUEUED") });
    });
  }
}

export const addOurDriver = ((req, res) => {
  var filename;
  if (req['file'] != null) {
    filename = req['file'].path;
    req.body.filename = filename;
  }
  const newDoc = new OurDrivers(req.body);
  newDoc.save((err, data) => {
    if (err) {
      return res.json(err)
    }
    return res.json({ 'success': true, 'message': req.i18n.__("ADDED_SUCCESSFULLY") })
  });
});

export const getOurDriver = ((req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 50;
  OurDrivers.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });
  OurDrivers.find(likeQuery, { key: 0 }).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });
});

export const updateOurDriver = ((req, res) => {
  let filename;
  if (req['file'] != null) {
    filename = req['file'].path;
    req.body.filename = filename;
  }
  let updateData = new OurDrivers(req.body);
  let id = req.body._id;
  OurDrivers.updateOne({ _id: id }, updateData, ((err, data) => {

    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err })
    }
    return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_UPDATED_SUCCESSFULLY"), 'data': data });
  }));
});

export const deleteOurDriver = (req, res) => {
  OurDrivers.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_DELETED_SUCCESSFULLLY") });
  });
}

// var child_process = require('child_process');

// /**
//  * Send to this array
//  * @param {Array} docs
//  */
function sendFCMtothisLists(docs, message) {
  /*docs.forEach(function (element) {
    GFunctions.sendFCMMsg(element.fcmId, message, ' ');
  });*/
  var index = 0;
  var chunk_size = 100;
  var arrayLength = docs.length;
  var tempArray = [];
  for (index = 0; index < arrayLength; index += chunk_size) {
    var aryChunk = docs.slice(index, index + chunk_size);
    tempArray.push(aryChunk);
  }
  tempArray.forEach(function (element) {
    var registrationTokens = [];
    element.forEach(function (single) {
      if (single.fcmId != "" && single.fcmId != null) registrationTokens.push(single.fcmId);
    });
    GFunctions.sendFCMMsgTest(registrationTokens, message, '');
  });
}

// /**
//  * Send to this array
//  * @param {Array} docs
//  */
function sendSMStothisLists(docs, message) {
  var phoneNo = []
  docs.forEach(function (element) {
    smsGateway.sendSmsMsg(element.phone, '', element.phcode, '', 'BulkSMS', { 'MESSAGE': message });
  });
  // smsGateway.sendSmsMsg('2142866536', message, '+1', '');

}
//Utilities

export const faqTemplate = (req, res) => {

  Faq.find({ ifaqcategorytitle: req.params.ifaqcategorytitle }, { _id: 0, vTitle_EN: 1, English: 1 }, function (err, data) {
    if (err) { return res.json({ "status": false, "message": req.i18n.__("SOME_ERROR"), "error": err }) }
    res.render('index', { data: data })
  })

}

export const getDbStatus = (req, res) => { //Change logic to check connections
  Rider.findOne({}, {}, function (err, data) {
    if (err) { return res.json({ "status": false, "message": req.i18n.__("MONGODB_CONNECTION_FAILED"), 'error': err }) }
    return res.json({ "status": true, "message": req.i18n.__("MONGODB_CONNECTION_SUCCESS") })
  });

}

function backupdata(data) {
  const newDoc = new pushNotification(data)
  newDoc.save()
};

function backupPrivateData(data) {
  const newDoc = new pushNotificationPrivate(data)
  newDoc.save()
};

export const viewConfig = (req, res) => {
  fs.readFile(__dirname + '/../config.js', 'UTF-8', function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': false, 'message': req.i18n.__("FETCHED_SUCCESSFULY"), 'data': doc })
  })
}

export const updateConfig = (req, res) => {
  fs.writeFile(__dirname + '/../config.js', req.body.data, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    res.status(200).json({ 'success': false, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
    restartServer();
  })
}

export const getServerConfigFile = (req, res) => {
  if (config) return res.status(200).json({ 'success': true, 'data': config })
  else return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") })
}

export const updateServerConfigFile = (req, res) => {
  if (req.body.requestRadius) {
    req.body.maxDistBtRiderAndDriver = Number(req.body.requestRadius) * 1609;
  }
  var data = req.body;
  var configObj = config;

  for (var key in data) {
    if (!data.hasOwnProperty(key)) continue;
    var keyRes = key.split(".");
    if (keyRes.length > 2) {
      data[key] = convertToNumber(data[key]);
      configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
    } else if (keyRes.length > 1) {
      data[key] = convertToNumber(data[key]);
      configObj[keyRes[0]][keyRes[1]] = data[key];
    }
    else {
      data[key] = convertToNumber(data[key]);
      configObj[key] = data[key];
    }
  }

  var dataToWrite = "const configObj = " + JSON.stringify(configObj, null, 2) + ";module.exports = configObj";

  fs.writeFile(__dirname + '/../config.js', dataToWrite, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
    restartServer();
  })

}

export const getServerConfigFileForApp = (req, res) => {
  if (config) {
    var configData = {
      "googleApiAutoComplete": config.googleApi,
      "googleApi": config.googleApi,
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
    }
    return res.status(200).json({ 'success': true, 'data': configData })
  }
  else return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") })
}

function convertToNumber(value) {
  if (value == 'true' || value == true) {
    return true;
  }
  else if (value == 'false' || value == false) {
    return false;
  }
  else if (value > 0) {
    if (typeof value === 'number') {
      value = parseInt(value);
      return value;
    } else { return value; }
  } else {
    return value;
  }
}

export const referalSettings = (req, res) => {
  if (featuresSettings) return res.status(200).json({ 'success': true, 'data': featuresSettings.referalSettings })
  else return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") })
}


export const updateReferalSettings = (req, res) => {
  var data = req.body;
  var configObj = featuresSettings;

  for (var key in data) {
    if (!data.hasOwnProperty(key)) continue;
    var keyRes = key.split(".");
    if (keyRes.length > 2) {
      data[key] = convertToNumber(data[key]);
      configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
    } else if (keyRes.length > 1) {
      data[key] = convertToNumber(data[key]);
      configObj[keyRes[0]][keyRes[1]] = data[key];
    }
    else {
      data[key] = convertToNumber(data[key]);
      configObj[key] = data[key];
    }
  }

  var dataToWrite = "const featuresSettings = " + JSON.stringify(configObj, null, 2) + ";module.exports = featuresSettings";

  fs.writeFile(__dirname + '/../featuresSettings.js', dataToWrite, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
    restartServer();
  })

}

export const getFeaturesSettings = (req, res) => {
  if (featuresSettings) return res.status(200).json({ 'success': true, 'data': featuresSettings })
  else return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") })
}


export const updateFeaturesSettings = (req, res) => {
  var data = req.body;
  var configObj = featuresSettings;

  for (var key in data) {
    if (!data.hasOwnProperty(key)) continue;
    var keyRes = key.split(".");
    if (keyRes.length > 2) {
      data[key] = convertToNumber(data[key]);
      configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
    } else if (keyRes.length > 1) {
      data[key] = convertToNumber(data[key]);
      configObj[keyRes[0]][keyRes[1]] = data[key];
    }
    else {
      data[key] = convertToNumber(data[key]);
      configObj[key] = data[key];
    }
  }

  var dataToWrite = "const featuresSettings = " + JSON.stringify(configObj, null, 2) + ";module.exports = featuresSettings";

  fs.writeFile(__dirname + '/../featuresSettings.js', dataToWrite, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
    restartServer();
  })

}

export const restartServer = () => {
  setTimeout(function () {
    process.exit(1);
  }
    , 10000); //30000 = 30 sec
}

export const getSeoSettings = (req, res) => {
  seosetting.findOne({}, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err })
    return res.send(docs)
  })
}

export const putSeoSettings = (req, res) => {

  let UpdateDoc = {
    keyword: req.body.keyword,
    tag: req.body.tag,
    description: req.body.description,
  };
  seosetting.findOneAndUpdate({ _id: req.body.id }, UpdateDoc, { new: true }, function (err, docs) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err })
    return res.json({ 'success': false, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': docs })
  })
}


export const alertSetting = (req, res) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("AlertLabels");
  ref.once('value').then(function (snap) {
    var data = snap.val();
    return res.json({ 'success': true, 'message': req.i18n.__("DATA_FETCH_SUCCESSFULLY"), 'data': data })
  });
}

export const updateAlertData = (req, res) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("AlertLabels");

  var requestData = {

    driverCancelLimiitExceeds: req.body.driverCancelLimiitExceeds,
    exceededminimumBalanceDriverAlert: req.body.exceededminimumBalanceDriverAlert,
    isNightExistAlertLabel: req.body.isNightExistAlertLabel,
    lowBalanceAlert: req.body.lowBalanceAlert,
    minimumBalance: req.body.minimumBalance,
    minimumBalanceDriverAlert: req.body.minimumBalanceDriverAlert,
    riderCancelLimiitExceeds: req.body.riderCancelLimiitExceeds,
    riderMaximumOldBalance: req.body.riderMaximumOldBalance,
    riderOldBalanceExceededMessage: req.body.riderOldBalanceExceededMessage

  };
  ref.update(requestData, function (error) {
    if (error) { } else {
      return res.json({ 'success': true, 'message': req.i18n.__("DATA_UPDATED_SUCCESSFULLY"), 'data': requestData })
    }
  });
}

//view Search
// export const viewSearch = async (req, res) => {
//   if ((/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(req.query.search))) {
//     let rider = await Rider.findOne({ fname: req.body.search }, { 'hash': 0, 'salt': 0 });
//     let driver = await Driver.findOne({ fname: req.body.search }, { 'hash': 0, 'salt': 0 });
//     if (rider != null || driver != null) {
//       return res.status(200).json({ 'status': true, 'message': req.i18n.__("DATA_PRESENT"), 'rider': rider, 'driver': driver, 'trip': "Trip data not found" })
//     }
//     else {
//       return res.status(409).json({ 'status': false, 'message': req.i18n.__("DATA_NOT_FOUND") })
//     }
//   }
//   else {
//     let rider = await Rider.findOne({ fname: req.body.search }, { 'hash': 0, 'salt': 0 });
//     let driver = await Driver.findOne({ fname: req.body.search }, { 'hash': 0, 'salt': 0 });
//     let trip = await Trips.findOne({ tripno: req.query.search });
//     if (rider != null || driver != null || trip != null) {
//       return res.status(200).json({ 'status': true, 'message': req.i18n.__("DATA_PRESENT"), 'rider': rider, 'driver': driver, 'trip': "trip" })
//     }
//     else {
//       return res.status(409).json({ 'status': false, 'message': req.i18n.__("DATA_NOT_FOUND") })
//     }
//   }
// }

export const viewSearch = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if ((/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(req.query.search))) {
    likeQuery['email'] = req.query.search
    let rider = await Rider.findOne(likeQuery, { 'hash': 0, 'salt': 0 });
    let driver = await Driver.findOne(likeQuery, { 'hash': 0, 'salt': 0 });
    if (rider != null || driver != null) {
      return res.status(200).json({ 'status': true, 'message': req.i18n.__("DATA_PRESENT"), 'rider': rider, 'driver': driver, 'trip': "Trip data not found" })
    }
    else {
      return res.status(409).json({ 'status': false, 'message': req.i18n.__("DATA_NOT_FOUND") })
    }
  }
  else if (/^[0-9]*$/.test(req.query.search)) {
    let rider = await Rider.findOne({ $and: [likeQuery, { phone: req.query.search }] }, { 'hash': 0, 'salt': 0 });
    let driver = await Driver.findOne({ $and: [likeQuery, { $or: [{ phone: req.query.search }, { code: req.query.search }] }] }, { 'hash': 0, 'salt': 0 });
    let trip = await Trips.findOne({ $and: [likeQuery, { tripno: req.query.search }] });
    // let trip = await Trips.findOne({ $or: [{ rid: req.query.search }, { dvr: req.query.search }] });
    if (rider != null || driver != null || trip != null) {
      return res.status(200).json({ 'status': true, 'message': req.i18n.__("DATA_PRESENT"), 'rider': rider, 'driver': driver, 'trip': trip })
    }
    else {
      return res.status(409).json({ 'status': false, 'message': req.i18n.__("DATA_NOT_FOUND") })
    }
  }
  else {
    var search = new RegExp(req.query.search, 'i');
    let rider = await Rider.findOne({ $and: [likeQuery, { fname: search }] }, { 'hash': 0, 'salt': 0 });
    let driver = await Driver.findOne({ $and: [likeQuery, { fname: search }] }, { 'hash': 0, 'salt': 0 });
    // let trip = await Trips.findOne({ tripno: req.query.search });
    let trip = await Trips.findOne({ $and: [likeQuery, { $or: [{ rid: search }, { dvr: search }] }] });
    if (rider != null || driver != null || trip != null) {
      return res.status(200).json({ 'status': true, 'message': req.i18n.__("DATA_PRESENT"), 'rider': rider, 'driver': driver, 'trip': trip })
    }
    else {
      return res.status(409).json({ 'status': false, 'message': req.i18n.__("DATA_NOT_FOUND") })
    }
  }
}

/**
 * currency
*/
export const getCurrencyForAdminUiCRUD = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);

  let TotCnt = CmnData.aggregate([
    { "$match": { "_id": "1" } },
    { "$unwind": "$datas" },
    { "$match": likeQuery }
  ]);
  let Datas = CmnData.aggregate([
    { "$match": { "_id": "1" } },
    { "$unwind": "$datas" },
    { "$match": likeQuery }
  ]).sort(sortQuery).skip(pageQuery.skip).limit(pageQuery.take);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err.toString() })
  }
}

export const addCurrencyForAdminUiCRUD = async (req, res) => {
  try {
    var data = req.body.currency.toUpperCase().replace(/\s/g, "");
    let checkCurrency = await CmnData.aggregate([
      { "$match": { "_id": "1" } },
      { "$unwind": "$datas" },
      { "$match": { "datas.id": data } }
    ])

    if (checkCurrency.length == 0) {
      await CmnData.update({ "_id": "1" }, { "$push": { "datas": { "id": data, "name": data } } })
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("CURRENCY_ADDED_SUCCESSFULLY") })
    }
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("CURRENCY_ALREADY_EXISTS") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}
/**
 * currency update
 * params:id,currency
*/
export const updateCurrencyForAdminUiCRUD = async (req, res) => {
  try {
    var data = req.body.currency.toUpperCase().replace(/\s/g, "");
    let checkCurrency = await CmnData.aggregate([
      { "$match": { "_id": "1" } },
      { "$unwind": "$datas" },
      { "$match": { "datas.name": data, "datas._id": { "$ne": mongoose.Types.ObjectId(req.body._id) } } }
    ])
    if (checkCurrency.length == 0) {
      await CmnData.update({ "_id": "1", "datas._id": req.body._id }, { "$set": { "datas.$.id": data, "datas.$.name": data } })
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("CURRENCY_UPDATED_SUCCESSFULLY") })
    }
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("CURRENCY_ALREADY_EXISTS") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}

export const deleteCurrencyForAdminUiCRUD = (req, res) => {
  CmnData.update({ "_id": "1" }, { "$pull": { "datas": { "_id": req.params.id } } }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("CURRENCY_DELETED_SUCCESSFULLY") })
  })
}

/**
 * language
*/
export const getLanguagesForAdminUiCRUD = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var query = [
    { "$match": { "_id": "2" } },
    { "$unwind": "$datas" },
    {
      "$project": {
        "_id": "$datas._id",
        "id": "$datas.id",
        "name": "$datas.name"
      }
    },
    { "$match": likeQuery },
  ]
  let TotCnt = CmnData.aggregate(query);
  let Datas = CmnData.aggregate(query).sort(sortQuery).skip(pageQuery.skip).limit(pageQuery.take);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err.toString() })
  }
}
/**
 * params : name,id
*/
export const addLanguagesForAdminUiCRUD = async (req, res) => {
  try {
    var id = req.body.id.toUpperCase().replace(/\s/g, ""),
      name = lodash.startCase(req.body.name.replace(/\s/g, ""));
    let checkLang = await CmnData.aggregate([
      { "$match": { "_id": "2" } },
      { "$unwind": "$datas" },
      { "$match": { "$or": [{ "datas.id": id }, { "datas.name": name }] } },
    ])
    if (checkLang.length == 0) {
      await CmnData.update({ "_id": "2" }, { "$push": { "datas": { "id": id, "name": name } } });
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("LANGUAGE_ADDED_SUCCESSFULLY") })
    }
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("LANGUAGE_ALREADY_EXISTS") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}
/**
 * language update
 * params:id,name,_id
*/
export const updateLanguagesForAdminUiCRUD = async (req, res) => {
  try {
    var id = req.body.id.toUpperCase().replace(/\s/g, ""),
      name = lodash.startCase(req.body.name.replace(/\s/g, ""));
    let checkCurrency = await CmnData.aggregate([
      { "$match": { "_id": "2" } },
      { "$unwind": "$datas" },
      { "$match": { "$or": [{ "datas.id": id }, { "datas.name": name }], "datas._id": { "$ne": mongoose.Types.ObjectId(req.body._id) } } }
    ])
    if (checkCurrency.length == 0) {
      await CmnData.update({ "_id": "2", "datas._id": req.body._id }, { "$set": { "datas.$.id": id, "datas.$.name": name } })
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("LANGUAGE_UPDATED_SUCCESSFULLY") })
    }
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("LANGUAGE_ALREADY_EXISTS") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}
/**
 * language Delete
 * params : _id
*/
export const deleteLanguagesForAdminUiCRUD = (req, res) => {
  CmnData.update({ "_id": "2" }, { "$pull": { "datas": { "_id": req.params.id } } }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("LANGUAGE_DELETED_SUCCESSFULLY") })
  })
}

/**
 * year
*/
export const getYearsForAdminUiCRUD = async (req, res) => {
  if (typeof req.query._sort === "undefined" || req.query._sort === "") {
    req.query._sort = "name";
  }

  if (typeof req.query._order === "undefined" || req.query._order === "") {
    req.query._order = "DESC";
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (likeQuery['name']) likeQuery['name'] = new RegExp(likeQuery['name'], 'i')
  var query = [
    { "$match": { "_id": "3" } },
    { "$unwind": "$datas" },
    {
      "$project": {
        "_id": "$datas._id",
        "id": "$datas.id",
        "name": "$datas.name"
      }
    },
    { "$match": likeQuery },
  ]
  let TotCnt = CmnData.aggregate(query);
  let Datas = CmnData.aggregate(query).sort(sortQuery).skip(pageQuery.skip).limit(pageQuery.take);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err.toString() })
  }
}
/**
 * Add year
 * params : name,id
*/
export const addYearsForAdminUiCRUD = async (req, res) => {
  try {
    if (req.body.name != 4 && isNaN(req.body.name)) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("INVALID_YEAR") })
    }
    let checkLang = await CmnData.aggregate([
      { "$match": { "_id": "3" } },
      { "$unwind": "$datas" },
      { "$match": { "datas.name": req.body.name } },
    ])
    if (checkLang.length == 0) {
      await CmnData.update({ "_id": "3" }, { "$push": { "datas": { "id": req.body.name, "name": req.body.name } } });
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("YEAR_ADDED_SUCCESSFULLY") })
    }
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("YEAR_ALREADY_EXISTS") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}
/**
 * year update
 * params:id,name,_id
*/
export const updateYearsForAdminUiCRUD = async (req, res) => {
  try {
    if (req.body.name != 4 && isNaN(req.body.name)) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("INVALID_YEAR") })
    }
    let checkCurrency = await CmnData.aggregate([
      { "$match": { "_id": "3" } },
      { "$unwind": "$datas" },
      { "$match": { "datas.name": req.body.name, "datas._id": { "$ne": mongoose.Types.ObjectId(req.body._id) } } }
    ])
    if (checkCurrency.length == 0) {
      await CmnData.update({ "_id": "3", "datas._id": req.body._id }, { "$set": { "datas.$.id": req.body.name, "datas.$.name": req.body.name } })
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("YEAR_UPDATED_SUCCESSFULLY") })
    }
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("YEAR_ALREADY_EXISTS") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}
/**
 * Delete Year
 * params : _id
*/
export const deleteYearsForAdminUiCRUD = (req, res) => {
  CmnData.update({ "_id": "3" }, { "$pull": { "datas": { "_id": req.params.id } } }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("YEAR_DELETED_SUCCESSFULLY") })
  })
}

/**
 * color
*/
export const getColorForAdminUiCRUD = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var query = [
    { "$match": { "_id": "4" } },
    { "$unwind": "$datas" },
    {
      "$project": {
        "_id": "$datas._id",
        "id": "$datas.id",
        "name": "$datas.name"
      }
    },
    { "$match": likeQuery },
  ]
  let TotCnt = CmnData.aggregate(query);
  sortQuery = { 'id': -1 }
  let Datas = CmnData.aggregate(query).sort(sortQuery).skip(pageQuery.skip).limit(pageQuery.take);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err.toString() })
  }
}
/**
 * Add Color
 * params : name
*/
export const addColorForAdminUiCRUD = async (req, res) => {
  try {
    var name = lodash.startCase(req.body.name)
    let checkLang = await CmnData.aggregate([
      { "$match": { "_id": "4" } },
      { "$unwind": "$datas" },
      { "$match": { "datas.name": name } },
    ])
    let id = mongoose.Types.ObjectId(), incId = 1;
    if (checkLang.length == 0) {
      var commonDatas = await CmnData.findOne({ "_id": "4" }).lean().exec();
      if (commonDatas) {
        var dataLength = (commonDatas.datas).length;
        if (dataLength > 0) {
          incId = commonDatas.datas[Number(dataLength) - 1].id;
          incId = Number(incId) + 1;
        }
      }
      await CmnData.update({ "_id": "4" }, { "$push": { "datas": { "_id": id, "id": incId, "name": name } } });
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("COLOR_ADDED_SUCCESSFULLY") })
    }
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("COLOR_ALREADY_EXISTS") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}
/**
 * year update
 * params:id,name,_id
*/
export const updateColorForAdminUiCRUD = async (req, res) => {
  try {
    var name = lodash.startCase(req.body.name)
    let checkCurrency = await CmnData.aggregate([
      { "$match": { "_id": "4" } },
      { "$unwind": "$datas" },
      { "$match": { "datas.name": name, "datas._id": { "$ne": mongoose.Types.ObjectId(req.body._id) } } }
    ])
    if (checkCurrency.length == 0) {
      await CmnData.update({ "_id": "4", "datas._id": req.body._id }, { "$set": { "datas.$.name": name } })
      return res.status(200).json({ 'success': true, 'message': "COLOR_UPDATED_SUCCESSFULLY" })
    }
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("COLOR_ALREADY_EXISTS") })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err.toString() })
  }
}
/**
 * Delete Color
 * params : _id
*/
export const deleteColorForAdminUiCRUD = (req, res) => {
  CmnData.update({ "_id": "4" }, { "$pull": { "datas": { "_id": req.params.id } } }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("COLOR_DELETED_SUCCESSFULLY") })
  })
}

/**
 * view contact us
 */
export const getContactUs = async (req, res) => {
  if (typeof req.query._sort === "undefined" || req.query._sort === "") {
    req.query._sort = "createdAt";
  }

  if (typeof req.query._order === "undefined" || req.query._order === "") {
    req.query._order = "DESC";
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  let TotCnt = ContactUs.find(likeQuery).count();
  let Datas = ContactUs.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err.toString() })
  }
}
/**
 * if first time read the user msg to update status
 * params : _id
 */
export const statusUpdate = (req, res) => {
  if (req.body._id == "" || typeof req.body._id === "undefined") {
    return res.status(409).json({ "success": false, 'message': req.i18n.__("USER_NOT_FOUND") })
  }
  ContactUs.update({ "_id": req.body._id }, { "status": "read" }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("STATUS_UPDATED_SUCCESSFULLY") })
  })
}
/**
 * reply the message
 * params
 * admin : [ _id,msg,requestFrom]
 * app : [ msg]
 */
export const replyContactUs = (req, res) => {
  var id = req.userId,
    from = "user";
  if (req.body.requestFrom === 'Admin_Ui') {
    id = req.body._id;
    from = "admin";
  }
  ContactUs.findByIdAndUpdate({ "_id": id }, { "$push": { "reply": { 'from': from, 'msg': req.body.msg } } }, { 'new': true }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("MESSAGE_SENDED_SUCCESSFULLY"), 'data': doc })
  })
}

/**
 * user history view
 */
export const viewContactUsHistory = (req, res) => {
  ContactUs.find({ "fromId": req.userId }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("FETCHED_SUCCESSFULY"), 'data': doc })
  })
}

export const getPushNotification = async (req, res) => {
  if (typeof req.query._sort === "undefined" || req.query._sort === "") {
    req.query._sort = "createdAt";
  }

  if (typeof req.query._order === "undefined" || req.query._order === "") {
    req.query._order = "DESC";
  }

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery['forType'] = 1;
  let TotCnt = pushNotification.find(likeQuery).count();
  let Datas = pushNotification.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), "error": err.toString() })
  }
}

export const pushNotificationForDriver = async (req, res) => {
  if (typeof req.query._sort === "undefined" || req.query._sort === "") {
    req.query._sort = "createdAt";
  }

  if (typeof req.query._order === "undefined" || req.query._order === "") {
    req.query._order = "DESC";
  }

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery['forType'] = 1;
  likeQuery['forWhom'] = 'AllDrivers';
  try {
    var pushNotify = [];
    var likeQuerySingle = { forType: 1, userId: req.userId };
    let PrivateDatas = await pushNotificationPrivate.find(likeQuerySingle).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).lean();
    let Datas = await pushNotification.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).lean();

    PrivateDatas.forEach(function (obj) {
      pushNotify.push({
        "message": obj.message,
        "createdAtISO": obj.createdAt,
        "createdAt": GFunctions.getDateTimeinThisFormat(obj.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', "DD/MM/YYYY hh:mm a"),
        "type": "private"
      });
    });

    Datas.forEach(function (obj) {
      pushNotify.push({
        "message": obj.message,
        "createdAtISO": obj.createdAt,
        "createdAt": GFunctions.getDateTimeinThisFormat(obj.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', "DD/MM/YYYY hh:mm a"),
        "type": "public"
      });
    });

    const sorted = _.sortBy(pushNotify, "createdAtISO").reverse();

    return res.send(sorted);

  } catch (err) {
    return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), "error": err.toString() })
  }
}

export const getPushNotificationForRider = async (req, res) => {
  if (typeof req.query._sort === "undefined" || req.query._sort === "") {
    req.query._sort = "createdAt";
  }

  if (typeof req.query._order === "undefined" || req.query._order === "") {
    req.query._order = "DESC";
  }

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery['forType'] = 1;
  likeQuery['forWhom'] = 'AllRiders';
  try {
    var pushNotify = [];
    var likeQuerySingle = { forType: 2, userId: req.userId };
    let PrivateDatas = await pushNotificationPrivate.find(likeQuerySingle).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).lean();
    // let Datas = await pushNotification.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).lean();

    PrivateDatas.forEach(function (obj) {
      pushNotify.push({
        "message": obj.message,
        "createdAtISO": obj.createdAt,
        "createdAt": GFunctions.getDateTimeinThisFormat(obj.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', "DD/MM/YYYY hh:mm a"),
        "type": "private"
      });
    });

    // Datas.forEach(function (obj) {
    //   pushNotify.push({
    //     "message": obj.message,
    //     "createdAtISO": obj.createdAt,
    //     "createdAt": GFunctions.getDateTimeinThisFormat(obj.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]', "DD/MM/YYYY hh:mm a"),
    //     "type": "public"
    //   });
    // });

    const sorted = _.sortBy(pushNotify, "createdAtISO").reverse();

    return res.send(sorted);
  } catch (err) {
    return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), "error": err.toString() })
  }
}

export const getSmsNotification = async (req, res) => {
  if (typeof req.query._sort === "undefined" || req.query._sort === "") {
    req.query._sort = "createdAt";
  }

  if (typeof req.query._order === "undefined" || req.query._order === "") {
    req.query._order = "DESC";
  }

  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery['forType'] = 2;
  let TotCnt = pushNotification.find(likeQuery).count();
  let Datas = pushNotification.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(500).json({ 'status': false, 'message': req.i18n.__("ERROR_SERVER"), "error": err.toString() })
  }
}

export const getLableHelper = (req, res) => {
  /*   fs.readFile(__dirname+'/../helpers/labels.helper.js','utf8',function(err,docs){
      if(err){ res.status(500).json({'success':false, 'message':"Error on server.",'error':err})}
      return res.status(200).json({'success':true, 'message':"Fetched successfully", 'data':docs})
    }) */
  try {
    var lableObj = require("../helpers/labels.helper.js");
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("FETCHED_SUCCESSFULY"), 'data': lableObj })
  }
  catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err })
  }
}
export const addLableHelper = (req, res) => {
  var data = 'module.exports = ' + JSON.stringify(req.body);
  fs.writeFile(__dirname + '/../helpers/labels.helper.js', data, function (err, docs) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") })
  })
}


export const testThirdParty = async (req, res) => {
  var testFor = req.params.testFor;
  var emailFor = req.body.emailFor ? req.body.emailFor : 'none';
  var emailId = req.body.email;

  if (testFor == 'sms') {
    smsGateway.sendSmsMsg(req.body.phone, 'Hi, Test SMS From ' + config.appName, req.body.phcode);
    // smsGateway.sendSmsMsg(req.body.phone, '', req.body.phcode, '', 'testSMS');
  }

  else if (testFor == 'email') {
    // Reset password / Welcome / TripInvoice / expiryMails / expiryMail / driverToadmin / driverRegistation / forgotPassword / driverwelcome
    if (emailFor == 'none') {
      var data = { name: 'Test User' };
      sendEmail(emailId, data, 'Welcome')
    }
    else if (emailFor == 'Welcome') {
      let rider = await Rider.find({ _id: req.body.dataId }).select('fname email date phone otp');
      if (rider.length > 0) var data = { name: rider[0].fname, url: config.baseurl, otp: rider[0].verificationCode, date: moment().format('LL'), appName: config.appName };
      sendEmail(emailId, data, emailFor)
    }
    else if (emailFor == 'TripInvoice') {
      let trips = await Trips.find({ _id: req.body.dataId });
      var startTime = moment(trips[0].acsp.startTime).format('LT');
      var endTime = moment(trips[0].acsp.endTime).format('LT');
      var surgePercentage = 0 + " %";
      if (trips[0].acsp.isNight == true) surgePercentage = trips[0].acsp.nightPer + " %";
      if (trips[0].acsp.isPeak == true) surgePercentage = trips[0].acsp.peakPer + " %";
      if (trips.length > 0)
        var data = {
          amountpaid: trips[0].fare,
          datepaid: trips[0].date,
          paymentmethod: trips[0].acsp.via,
          chargedescription: trips[0].tripno,
          tripno: trips[0].tripno,
          triptime: trips[0].date,
          ridername: trips[0].rid,
          from: trips[0].adsp.from,
          currency: config.currencySymbol,
          time: trips[0].adsp.estTime,
          detect: trips[0].acsp.detect,
          Percentage: trips[0].acsp.discountPercentage,
          waiting: trips[0].acsp.waitingRate + '/min',
          distfare: trips[0].acsp.distfare,
          appname: config.appName,
          Charge: trips[0].acsp.waitingCharge,
          mailLogo: config.fileurl + 'companylogo.png',
          dist: trips[0].acsp.perKmRate + '/km',
          fare: trips[0].fare,
          link: config.landingurl,
          tripto: trips[0].adsp.to,
          accessfee: trips[0].acsp.tax,
          distanceKM: trips[0].adsp.distanceKM,
          distancefare: trips[0].csp.cost,
          starttime: startTime,
          endtime: endTime,
          tripdistance: trips[0].estTime,
          tripvehicle: trips[0].vehicle,
          discountName: trips[0].acsp.discountName,
          surgeReason: trips[0].acsp.surgeReason,
          surgePercentage: surgePercentage,
          pickupFare: trips[0].acsp.conveyance,
          PDFlink: config.landingurl + "tripInvoice/" + trips[0]._id + ".pdf",
          baseFare: trips[0].acsp.base,
          waitingTime: trips[0].acsp.waitingTime + 'Min',
          timeRate: trips[0].acsp.timeRate + '/min',
          timefare: trips[0].acsp.timefare,
          time: trips[0].acsp.time + 'Min',
          fareType: trips[0].acsp.fareType,
          minFare: trips[0].acsp.minFare,
          minFareAdded: trips[0].acsp.minFareAdded,
          booking: trips[0].acsp.booking,
          taxPercentage: trips[0].acsp.taxPercentage + ' %',
          tax: trips[0].acsp.tax,
          oldBalance: trips[0].acsp.oldBalance,
          googleCharge: trips[0].acsp.googleCharge,
          surgeAmt: trips[0].acsp.surgeAmt,
          // detect: trips[0].acsp.detect
        };
      sendEmail(emailId, data, emailFor)
    }
    else if (emailFor == 'RentalTripInvoice' || emailFor == 'OutstationTripInvoice') {
      let trips = await Trips.find({ _id: req.body.dataId });
      var startTime = moment(trips[0].acsp.startTime).format('LT');
      var endTime = moment(trips[0].acsp.endTime).format('LT');
      if (trips.length > 0)
        var data = {
          packageName: trips[0].acsp.packageName,
          packageKMFare: trips[0].acsp.distfare,
          FareforExtraKM: trips[0].acsp.fareForExtraKM,
          timefare: trips[0].acsp.timefare + '/Hr',
          fareForExtraTime: trips[0].acsp.fareForExtraTime,
          pickupCharge: trips[0].acsp.conveyance,
          hillFare: trips[0].acsp.hillFare,
          amountpaid: trips[0].fare,
          datepaid: trips[0].date,
          paymentmethod: trips[0].acsp.via,
          chargedescription: trips[0].tripno,
          tripno: trips[0].tripno,
          triptime: trips[0].date,
          ridername: trips[0].rid,
          from: trips[0].adsp.from,
          currency: config.currencySymbol,
          time: trips[0].adsp.estTime,
          detect: trips[0].acsp.detect,
          Percentage: trips[0].acsp.discountPercentage,
          waiting: trips[0].acsp.waitingRate + ' /min',
          // minfare: trips[0].acsp.distfare,
          appname: config.appName,
          Charge: trips[0].acsp.waitingCharge,
          mailLogo: config.fileurl + 'companylogo.png',
          dist: trips[0].acsp.perKmRate + ' /km',
          fare: trips[0].acsp.cost,
          link: config.landingurl,
          tripto: trips[0].adsp.to,
          tax: trips[0].acsp.tax,
          distanceKM: trips[0].adsp.distanceKM,
          // distancefare: trips[0].csp.cost,
          starttime: startTime,
          endtime: endTime,
          tripdistance: trips[0].estTime,
          tripvehicle: trips[0].vehicle,
          discountName: trips[0].acsp.discountName,
          distance: trips[0].acsp.dist + "KM",
          duration: trips[0].acsp.time,
          baseKM: trips[0].acsp.baseKM + "KM",
          extraKM: trips[0].acsp.extraKM,
          perKmRate: trips[0].acsp.perKmRate + "/KM",
          extraTime: trips[0].acsp.extraTime,
          taxPercentage: trips[0].acsp.taxPercentage + "%",
          googleCharge: trips[0].acsp.googleCharge,
          PDFlink: config.landingurl + "tripInvoice/" + trips[0]._id + ".pdf",
          nightFare: trips[0].acsp.nightFare,
          dayFare: trips[0].acsp.dayFare,
          nightRate: trips[0].acsp.nightRate,
          dayRate: trips[0].acsp.dayRate,
          tollFee: trips[0].acsp.tollFee,
          noOfDays: trips[0].acsp.noOfDays,
          noOfNights: trips[0].acsp.noOfNights,
          // detect: trips[0].acsp.detect
        };
      sendEmail(emailId, data, emailFor)
    }
    else if (emailFor == 'driverwelcome') {
      let driver = await Driver.find({ _id: req.body.dataId }).select('fname email date phone verificationCode');
      if (driver.length > 0) var data = { name: driver[0].fname, email: driver[0].email, date: moment().format('LL'), phone: driver[0].phone, url: config.baseurl, otp: driver[0].verificationCode, appName: config.appName };
      sendEmail(emailId, data, emailFor)
    }
  }

  else if (testFor == 'fcm') {
    GFunctions.sendFCMMsg(req.body.fcmId, 'Hi, Test Push Notification From ' + config.appName, 'testMsg');
  }
  return res.status(200).json({ 'success': true, 'message': req.i18n.__("TEST_MADE_SUCCESSFULLY") })

}


/**
 * Share Location
 */
export const shareMyLocation = async (req, res) => {
  var TripId = req.params.id;

  Trips.aggregate([
    {
      $match: {
        status: {
          $nin: ['Cancelled', 'noresponse']
        },
        "_id": mongoose.Types.ObjectId(TripId),
      }
    },

    {
      $lookup: {
        localField: "ridid",
        from: "riders",
        foreignField: "_id",
        as: "riderCollections"
      }
    },
    { $unwind: "$riderCollections" },
    {
      $lookup: {
        localField: "dvrid",
        from: "drivers",
        foreignField: "_id",
        as: "driverCollections"
      }
    },
    { $unwind: "$driverCollections" },

    {
      $project: {
        "_id": 1,
        "ridid": 1,
        "tripno": 1,
        "adsp": 1,
        "dsp": 1,
        "status": 1,
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
      }
    }

  ], function (err, result) {
    if (err) {
      return res.status(200).json({ 'success': false, 'err': err });
    }
    if (result.length == 0)
      return res.status(200).json({ 'success': false, 'result': result, 'message': req.i18n.__("NO_TRIP_FOUND") });
    else {
      var sendToData = {
        tripid: result[0]._id,
        tripDetails: {
          tripno: result[0].tripno,
          pickupAt: result[0].adsp.from,
          dropAt: result[0].dsp[0].to,
          startAt: result[0].adsp.start,
          endAt: result[0].dsp[0].end,
          status: result[0].status,
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
        supportEmail: config.mailFrom,
        supportNo: config.supportNo

      };
      return res.status(200).json({ 'success': true, 'result': sendToData });
    }

  });
}

export const getseosettings = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  let TotCnt = seosetting.find(likeQuery).count();
  let Datas = seosetting.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr)
  } catch (err) {
    return res.status(409).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), "error": err.toString() })
  }
}

export const updateseosettings = (req, res) => {
  seosetting.update({ "_id": req.body._id }, { "keyword": req.body.keyword, "tag": req.body.tag, "description": req.body.description, }, function (err, doc) {
    if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("SEO_SETTINGS_UPDATED") })
  })
}

export const addseosettings = (req, res) => {
  var newDoc = new seosetting({
    keyword: req.body.keyword,
    tag: req.body.tag,
    description: req.body.description,
  });
  newDoc.save((err, datas) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("SEO_ADDED"), 'data': datas });
  })

}

export const getAvailableDiscounts = (req, res) => {
  if (featuresSettings) return res.status(200).json({ 'success': true, 'data': featuresSettings.discountsAvailable })
  else return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") })
}

export const getCitywiseOfficeDetails = async (req, res) => {
  cityWiseOffice.find({}, (err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    if (!docs) return res.status(200).json({ 'success': false, 'message': req.i18n.__("NO_DATA_FOUND") });
    else {
      var result = [];
      var data = lodash.map(docs, (el) => {
        var pushData = {
          _id: el._id,
          cityName: el.scIds[0].name,
          phone: el.phone,
          callcenter: el.phonetwo,
          mail: el.mail,
          address: el.address,
          isSupportNoEnable: el.isSupportNoEnable,
        }
        result.push(pushData)
      })
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("LISTED_SUCCESSFULLY"), data: result });
    }
  });
}

export const addLanguage = (req, res) => {
  var language = req.body.language;
  var existingLanguages = featuresSettings.languages
  // if (req['file'] != undefined) res.status(409).json({ 'success': false, 'message': req.i18n.__("ONLY_JSON_FILE_SUPPORTED") })
  if (req['file'] != null) {
    var isLanguageExistsAlready = _.includes(existingLanguages, language)
    if (isLanguageExistsAlready) {
      fs.unlink("./locales/temp/" + req['file'].filename, (err) => {
        if (err) {
        }
      });
      return res.status(409).json({ 'success': true, 'message': req.i18n.__("LANGUAGE_ALREADY_EXISTS") });
    }
    else {
      var oldPath = "./locales/temp/" + req['file'].filename
      var newPath = "./locales/" + req['file'].filename

      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
      })
      existingLanguages.push(language)

      var data = { languages: existingLanguages }
      var configObj = featuresSettings;

      for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
        var keyRes = key.split(".");
        if (keyRes.length > 2) {
          data[key] = convertToNumber(data[key]);
          configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
        } else if (keyRes.length > 1) {
          data[key] = convertToNumber(data[key]);
          configObj[keyRes[0]][keyRes[1]] = data[key];
        }
        else {
          data[key] = convertToNumber(data[key]);
          configObj[key] = data[key];
        }
      }

      var dataToWrite = "const featuresSettings = " + JSON.stringify(configObj, null, 2) + ";module.exports = featuresSettings";

      fs.writeFile(__dirname + '/../featuresSettings.js', dataToWrite, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }

        res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
        restartServer();
      })
    }
  }
  else {
    res.status(409).json({ 'success': true, 'message': req.i18n.__("PLEASE_SELECT_FILE_TO_UPLOAD") })
  }
}

export const listlanguage = (req, res) => {
  if (featuresSettings.languages) return res.status(200).json({ 'success': true, 'message': req.i18n.__("LISTED_SUCCESSFULLY"), 'data': featuresSettings.languages })
  else return res.status(404).json({ 'success': true, 'message': req.i18n.__("DATA_NOT_FOUND") })
}

export const languageUpdate = (req, res) => {
  var language = req.params.language
  if (req['file'] != null) {
    var oldPath = "./locales/temp/" + req['file'].filename
    var newPath = "./locales/" + language + '.json'
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
    })
    res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") })
  }
  else {
    res.status(409).json({ 'success': false, 'message': req.i18n.__("PLEASE_SELECT_FILE_TO_UPLOAD") })
  }
}

export const downloadLanguageFile = async (req, res) => {
  var language = req.params.language;
  // const filepath = `./locales/${language}.json`;
  let filepath = path.join(__dirname, `../locales/${language}.json`);
  jsonfile.readFile(filepath, function (err, obj) {
    var user = obj
    var json = JSON.stringify(user);
    var filename = `${language}.json`;
    var mimetype = 'application/json';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.send(json);
    // res.redirect(config.baseurl + `locales/${language}.json`)
    // res.status(200).json(obj)
  })
}

export const addAdminLanguage = async (req, res) => {
  var language = req.body.language;
  var existingLanguages = featuresSettings.adminLanguages
  if (req['file'] != null) {
    var isLanguageExistsAlready = _.includes(existingLanguages, language)
    if (isLanguageExistsAlready) {
      fs.unlink("./locales/temp/" + req['file'].filename, (err) => {
        if (err) {
        }
      });
      return res.status(409).json({ 'success': true, 'message': req.i18n.__("LANGUAGE_ALREADY_EXISTS") });
    }
    else {
      var oldPath = "./locales/temp/" + req['file'].filename
      var newPath = "./public/adminLanguageFile/" + req['file'].filename

      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
      })
      existingLanguages.push(language)

      var data = { adminLanguages: existingLanguages }
      var configObj = featuresSettings;

      for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
        var keyRes = key.split(".");
        if (keyRes.length > 2) {
          data[key] = convertToNumber(data[key]);
          configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
        } else if (keyRes.length > 1) {
          data[key] = convertToNumber(data[key]);
          configObj[keyRes[0]][keyRes[1]] = data[key];
        }
        else {
          data[key] = convertToNumber(data[key]);
          configObj[key] = data[key];
        }
      }

      var dataToWrite = "const featuresSettings = " + JSON.stringify(configObj, null, 2) + ";module.exports = featuresSettings";

      fs.writeFile(__dirname + '/../featuresSettings.js', dataToWrite, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }

        res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
        restartServer();
      })
    }
  }
  else {
    res.status(409).json({ 'success': true, 'message': req.i18n.__("PLEASE_SELECT_FILE_TO_UPLOAD") })
  }
}

export const listAdminLanguages = async (req, res) => {
  if (featuresSettings.adminLanguages) return res.status(200).json({ 'success': true, 'message': req.i18n.__("LISTED_SUCCESSFULLY"), 'data': featuresSettings.adminLanguages })
  else return res.status(404).json({ 'success': true, 'message': req.i18n.__("DATA_NOT_FOUND") })
}

export const adminLanguageUpdate = async (req, res) => {
  var language = req.params.language
  if (req['file'] != null) {
    var oldPath = "./locales/temp/" + req['file'].filename
    var newPath = "./public/adminLanguageFile/" + language + '.json'
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
    })
    res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") })
  }
  else {
    res.status(409).json({ 'success': false, 'message': req.i18n.__("PLEASE_SELECT_FILE_TO_UPLOAD") })
  }
}

export const downloadAdminLanguageFile = async (req, res) => {
  var language = req.params.language;
  // const filepath = `./publi/adminLanguageFile/${language}.json`;
  let filepath = path.join(__dirname, `../public/adminLanguageFile/${language}.json`);
  jsonfile.readFile(filepath, function (err, obj) {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SERVER_ERROR"), 'err': err })
    var user = obj
    var json = JSON.stringify(user);
    var filename = `${language}.json`;
    var mimetype = 'application/json';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.send(json);
    // res.redirect(config.baseurl + `public/adminLanguageFile/${language}.json`)
    // res.status(200).json(obj)
  })
}

export const addLandingLanguage = async (req, res) => {
  var language = req.body.language;
  var existingLanguages = featuresSettings.landingLanguages
  if (req['file'] != null) {
    var isLanguageExistsAlready = _.includes(existingLanguages, language)
    if (isLanguageExistsAlready) {
      fs.unlink("./locales/temp/" + req['file'].filename, (err) => {
        if (err) {
        }
      });
      return res.status(409).json({ 'success': true, 'message': req.i18n.__("LANGUAGE_ALREADY_EXISTS") });
    }
    else {
      var oldPath = "./locales/temp/" + req['file'].filename
      var newPath = "./public/landingLanguageFile/" + req['file'].filename

      fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
      })
      existingLanguages.push(language)

      var data = { landingLanguages: existingLanguages }
      var configObj = featuresSettings;

      for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
        var keyRes = key.split(".");
        if (keyRes.length > 2) {
          data[key] = convertToNumber(data[key]);
          configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
        } else if (keyRes.length > 1) {
          data[key] = convertToNumber(data[key]);
          configObj[keyRes[0]][keyRes[1]] = data[key];
        }
        else {
          data[key] = convertToNumber(data[key]);
          configObj[key] = data[key];
        }
      }

      var dataToWrite = "const featuresSettings = " + JSON.stringify(configObj, null, 2) + ";module.exports = featuresSettings";

      fs.writeFile(__dirname + '/../featuresSettings.js', dataToWrite, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'error': err }) }

        res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY"), 'data': doc })
        restartServer();
      })
    }
  }
  else {
    res.status(409).json({ 'success': true, 'message': req.i18n.__("PLEASE_SELECT_FILE_TO_UPLOAD") })
  }
}

export const listLandingLanguages = async (req, res) => {
  if (featuresSettings.landingLanguages) return res.status(200).json({ 'success': true, 'message': req.i18n.__("LISTED_SUCCESSFULLY"), 'data': featuresSettings.landingLanguages })
  else return res.status(404).json({ 'success': true, 'message': req.i18n.__("DATA_NOT_FOUND") })
}

export const landingLanguageUpdate = async (req, res) => {
  var language = req.params.language
  if (req['file'] != null) {
    var oldPath = "./locales/temp/" + req['file'].filename
    var newPath = "./public/landingLanguageFile/" + language + '.json'
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
    })
    res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") })
  }
  else {
    res.status(409).json({ 'success': false, 'message': req.i18n.__("PLEASE_SELECT_FILE_TO_UPLOAD") })
  }
}

export const downloadLandingLanguageFile = async (req, res) => {
  var language = req.params.language;
  let filepath = path.join(__dirname, `../public/landingLanguageFile/${language}.json`);
  jsonfile.readFile(filepath, function (err, obj) {
    var user = obj
    var json = JSON.stringify(user);
    var filename = `${language}.json`;
    var mimetype = 'application/json';
    res.setHeader('Content-Type', mimetype);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.send(json);
    // res.redirect(config.baseurl + `public/landingLanguageFile/${language}.json`)
    // res.json(obj)
  })
}

export const addCancelReason = async (req, res) => {
  var data = await CancelReasons.findOne({ 'language': req.body.language });
  if (data) return res.json({ 'success': true, 'message': req.i18n.__("LANGUAGE_ALREADY_EXISTS") });
  else {
    var driverCancelReason = (req.body.driverCancelReason).split(/[\n,]/)
    var riderCancelReason = (req.body.riderCancelReason).split(/[\n,]/)
    var newDoc = new CancelReasons(
      {
        language: req.body.language,
        driverCancelReason: driverCancelReason,
        riderCancelReason: riderCancelReason
      }
    )
    newDoc.save((err, doc) => {
      if (err) {
        return res.json({ 'success': false, 'message': "Server Error", 'err': err });
      }
      else return res.status(200).json({ 'success': true, 'message': req.i18n.__("CANCEL_REASON_ADDED_SUCCESSFULLY"), 'data': doc });
    })
  }
}

export const getCancelReason = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);

  let TotCnt = CancelReasons.find(likeQuery).count();
  let Datas = CancelReasons.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery);

  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

export const updateCancelReason = async (req, res) => {

  if (typeof (req.body.driverCancelReason) == "string") var driverCancelReason = (req.body.driverCancelReason).split(/[\n,]/);
  else var driverCancelReason = req.body.driverCancelReason
  if (typeof (req.body.riderCancelReason) == "string") var riderCancelReason = (req.body.riderCancelReason).split(/[\n,]/);
  else var riderCancelReason = req.body.riderCancelReason
  var updateData = {
    // language: req.body.language,
    driverCancelReason: driverCancelReason,
    riderCancelReason: riderCancelReason
  };

  CancelReasons.findOneAndUpdate({ _id: req.params.id }, updateData, { new: true }, (err, doc) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("CANCEL_REASON_UPDATED_SUCCESSFULLY"), "data": doc });
  })
}

export const templateToPdf = async (req, res) => {
  var doc = await Trips.findOne({ '_id': req.body.tripId });
  var driverData = await Driver.findOne({ '_id': doc.dvrid });
  // var vehicleData = await Vehicletype.findOne({'_id':doc.service})
  var startTime = moment(doc.acsp.startTime).format('LT');
  var endTime = moment(doc.acsp.endTime).format('LT');
  var surgePercentage = 0 + " %";
  if (doc.acsp.isNight == true) surgePercentage = doc.acsp.nightPer + " %";
  if (doc.acsp.isPeak == true) surgePercentage = doc.acsp.peakPer + " %";
  var data = {
    amountpaid: doc.fare,
    datepaid: doc.date,
    paymentmethod: doc.acsp.via,
    chargedescription: doc.tripno,
    tripno: doc.tripno,
    tripCode: doc.tripCode,
    triptime: doc.date,
    ridername: doc.rid,
    from: doc.adsp.from,
    currency: config.currencySymbol,
    time: doc.adsp.estTime,
    detect: doc.acsp.detect,
    Percentage: doc.acsp.discountPercentage,
    waiting: doc.acsp.waitingRate + '/min',
    distfare: doc.acsp.distfare,
    appname: config.appName,
    Charge: doc.acsp.waitingCharge,
    mailLogo: config.fileurl + 'companylogo.png',
    dist: doc.acsp.perKmRate + '/km',
    fare: doc.fare,
    link: config.landingurl,
    tripto: doc.adsp.to,
    accessfee: doc.acsp.tax,
    distanceKM: doc.adsp.distanceKM,
    distancefare: doc.csp.cost,
    starttime: startTime,
    endtime: endTime,
    tripdistance: doc.estTime,
    tripvehicle: doc.vehicle,
    discountName: doc.acsp.discountName,
    surgeReason: doc.acsp.surgeReason,
    surgePercentage: surgePercentage,
    pickupFare: doc.acsp.conveyance,
    PDFlink: config.landingurl + "tripInvoice/" + doc._id + ".pdf",
    baseFare: doc.acsp.base,
    waitingTime: doc.acsp.waitingTime + 'Min',
    timeRate: doc.acsp.timeRate + '/min',
    timefare: doc.acsp.timefare,
    time: doc.acsp.time + 'Min',
    fareType: doc.acsp.fareType,
    minFare: doc.acsp.minFare,
    minFareAdded: doc.acsp.minFareAdded,
    booking: doc.acsp.booking,
    taxPercentage: doc.acsp.taxPercentage + ' %',
    tax: doc.acsp.tax,
    oldBalance: doc.acsp.oldBalance,
    googleCharge: doc.acsp.googleCharge,
    surgeAmt: doc.acsp.surgeAmt,
    // tripPath: doc.adsp.map,
    tripPath: config.fileurl + "gmap/" + doc.tripno + ".png",
    driverProfile: config.baseurl + driverData.profile,
    driverName: driverData.fname,
    farewithoutTaxNBookingFee: doc.acsp.farewithoutTaxNBookingFee,
    // vehicleIcon: config.baseurl + vehicleData.file,
    // vehicleName: doc.vehicle,
    'imageurl': config.fileurl + 'companylogo.png',
    'mailHeaderRight': config.fileurl + 'mailImages/right.png',
    'mailHeaderLeft': config.fileurl + 'mailImages/left.png',
    'mailLogo': config.fileurl + 'mailImages/companylogo.png',
    'appname': config.appName,
    'companyaddress': config.companyaddress,
    'companyemail': config.companymail
  };
  var htmlPath;
  if (doc.triptype == "daily") htmlPath = path.join(__dirname, '../views/tripInvoice.html');
  if (doc.triptype == "rental") {
    var startTime = moment(doc.acsp.startTime).format('LT');
    var endTime = moment(doc.acsp.endTime).format('LT');
    var rentalData = {
      packageName: doc.acsp.packageName,
      packageKMFare: doc.acsp.distfare,
      FareforExtraKM: doc.acsp.fareForExtraKM,
      timefare: doc.acsp.timefare + '/hr',
      fareForExtraTime: doc.acsp.fareForExtraTime,
      pickupCharge: doc.acsp.conveyance,
      hillFare: doc.acsp.hillFare,
      waiting: doc.acsp.waitingRate + '/min',
      discountName: doc.acsp.discountName,
      starttime: startTime,
      endtime: endTime,
      distance: doc.acsp.dist + "KM",
      duration: doc.acsp.time,
      baseKM: doc.acsp.baseKM + "KM",
      extraKM: doc.acsp.extraKM,
      perKmRate: doc.acsp.perKmRate + "/KM",
      extraTime: doc.acsp.extraTime,
      fareBeforeTax: doc.acsp.fareBeforeTax
    }
    data = Object.assign(data, rentalData);
    htmlPath = path.join(__dirname, '../views/rentalTripInvoice.html');
  }
  else if (doc.triptype == "outstation") {
    var OutstationData = {
      packageName: doc.acsp.packageName,
      packageKMFare: doc.acsp.distfare,
      FareforExtraKM: doc.acsp.fareForExtraKM,
      timefare: doc.acsp.timefare + '/hr',
      fareForExtraTime: doc.acsp.fareForExtraTime,
      pickupCharge: doc.acsp.conveyance,
      hillFare: doc.acsp.hillFare,
      waiting: doc.acsp.waitingRate + '/min',
      discountName: doc.acsp.discountName,
      starttime: startTime,
      endtime: endTime,
      nightFare: doc.acsp.nightFare,
      dayFare: doc.acsp.dayFare,
      nightRate: doc.acsp.nightRate,
      dayRate: doc.acsp.dayRate,
      tollFee: doc.acsp.tollFee,
      distance: doc.acsp.dist + "KM",
      duration: doc.acsp.time,
      baseKM: doc.acsp.baseKM + "KM",
      extraKM: doc.acsp.extraKM,
      perKmRate: doc.acsp.perKmRate + "/KM",
      extraTime: doc.acsp.extraTime,
      noOfDays: doc.acsp.noOfDays,
      noOfNights: doc.acsp.noOfNights,
      fareBeforeTax: doc.acsp.fareBeforeTax
    }
    data = Object.assign(data, OutstationData);
    htmlPath = path.join(__dirname, '../views/outstationTripInvoice.html');
  }
  var template;
  fs.readFile(htmlPath, 'utf8', (err, htmlData) => {
    if (htmlData) {
      template = Mustache.render(htmlData, data);
      // var pdfFilePath = path.join(__dirname, '../public/pdf/'+ doc._id+'.pdf');
      var pdfFilePath = path.join(__dirname, '../../../../var/www/html/tripInvoice/' + doc._id + '.pdf');
      var options = { format: 'Letter' };
      try {
        pdf.create(template, options).toFile(pdfFilePath, function (err, res2) {
          if (err) {
            res.status(500).json("Some kind of error...");
            // return;
          }
          else {
            fs.readFile(pdfFilePath, function (err, data) {
              // res.contentType("application/pdf");
              res.json("Data Created");
            });
          }
        });
      }
      catch (err) {
        res.json(err)
      }
    }
  });
}

export const saveTemplateToPdf = async (tripId) => {
  return false;
  var doc = await Trips.findOne({ '_id': tripId });
  var driverData = await Driver.findOne({ '_id': doc.dvrid });
  // var vehicleData = await Vehicletype.findOne({'_id':doc.service})
  var startTime = moment(doc.acsp.startTime).format('LT');
  var endTime = moment(doc.acsp.endTime).format('LT');
  var surgePercentage = 0 + " %";
  if (doc.acsp.isNight == true) surgePercentage = doc.acsp.nightPer + " %";
  if (doc.acsp.isPeak == true) surgePercentage = doc.acsp.peakPer + " %";
  var data = {
    amountpaid: doc.fare,
    datepaid: doc.date,
    paymentmethod: doc.acsp.via,
    chargedescription: doc.tripno,
    tripno: doc.tripno,
    tripCode: doc.tripCode,
    triptime: doc.date,
    ridername: doc.rid,
    from: doc.adsp.from,
    currency: config.currencySymbol,
    time: doc.adsp.estTime,
    detect: doc.acsp.detect,
    Percentage: doc.acsp.discountPercentage,
    waiting: doc.acsp.waitingRate + '/min',
    distfare: doc.acsp.distfare,
    appname: config.appName,
    Charge: doc.acsp.waitingCharge,
    mailLogo: config.fileurl + 'companylogo.png',
    dist: doc.acsp.perKmRate + '/km',
    fare: doc.fare,
    link: config.landingurl,
    tripto: doc.adsp.to,
    accessfee: doc.acsp.tax,
    distanceKM: doc.adsp.distanceKM,
    distancefare: doc.csp.cost,
    starttime: startTime,
    endtime: endTime,
    tripdistance: doc.estTime,
    tripvehicle: doc.vehicle,
    discountName: doc.acsp.discountName,
    surgeReason: doc.acsp.surgeReason,
    surgePercentage: surgePercentage,
    pickupFare: doc.acsp.conveyance,
    PDFlink: config.landingurl + "tripInvoice/" + doc._id + ".pdf",
    baseFare: doc.acsp.base,
    waitingTime: doc.acsp.waitingTime + 'Min',
    timeRate: doc.acsp.timeRate + '/min',
    timefare: doc.acsp.timefare,
    time: doc.acsp.time + 'Min',
    fareType: doc.acsp.fareType,
    minFare: doc.acsp.minFare,
    minFareAdded: doc.acsp.minFareAdded,
    booking: doc.acsp.booking,
    taxPercentage: doc.acsp.taxPercentage + ' %',
    taxPercentagecgst: doc.acsp.taxPercentagecgst + ' %',
    taxPercentagesgst: doc.acsp.taxPercentagesgst + ' %',
    taxcgst: doc.acsp.taxcgst,
    taxsgst: doc.acsp.taxsgst,
    tax: doc.acsp.tax,
    oldBalance: doc.acsp.oldBalance,
    googleCharge: doc.acsp.googleCharge,
    surgeAmt: doc.acsp.surgeAmt,
    tripPath: config.fileurl + "gmap/" + doc.tripno + ".png",
    driverProfile: config.baseurl + driverData.profile,
    driverName: driverData.fname,
    farewithoutTaxNBookingFee: doc.acsp.farewithoutTaxNBookingFee,
    // vehicleIcon: config.baseurl + vehicleData.file,
    // vehicleName: doc.vehicle,
    'imageurl': config.fileurl + 'companylogo.png',
    'mailHeaderRight': config.fileurl + 'mailImages/right.png',
    'mailHeaderLeft': config.fileurl + 'mailImages/left.png',
    'mailLogo': config.fileurl + 'mailImages/companylogo.png',
    'appname': config.appName,
    'companyaddress': config.companyaddress,
    'companyemail': config.companymail
  };
  var htmlPath;
  if (doc.triptype == "daily") htmlPath = path.join(__dirname, '../views/tripInvoice.html');
  else if (doc.triptype == "rental" || doc.triptype == "outstation") {
    var startTime = moment(doc.acsp.startTime).format('LT');
    var endTime = moment(doc.acsp.endTime).format('LT');
    var rentalData = {
      packageName: doc.acsp.packageName,
      packageKMFare: doc.acsp.distfare,
      FareforExtraKM: doc.acsp.fareForExtraKM,
      timefare: doc.acsp.timefare + '/hr',
      fareForExtraTime: doc.acsp.fareForExtraTime,
      pickupCharge: doc.acsp.conveyance,
      hillFare: doc.acsp.hillFare,
      waiting: doc.acsp.waitingRate + '/min',
      discountName: doc.acsp.discountName,
      starttime: startTime,
      endtime: endTime,
      distance: doc.acsp.dist + "KM",
      duration: doc.acsp.time,
      baseKM: doc.acsp.baseKM + "KM",
      extraKM: doc.acsp.extraKM,
      perKmRate: doc.acsp.perKmRate + "/KM",
      extraTime: doc.acsp.extraTime,
      fareBeforeTax: doc.acsp.fareBeforeTax,
      taxPercentagecgst: doc.acsp.taxPercentagecgst + ' %',
      taxPercentagesgst: doc.acsp.taxPercentagesgst + ' %',
      taxcgst: doc.acsp.taxcgst,
      taxsgst: doc.acsp.taxsgst,
    }
    data = Object.assign(data, rentalData);
    htmlPath = path.join(__dirname, '../views/rentalTripInvoice.html');
  }
  else if (doc.triptype == "outstation") {
    var OutstationData = {
      packageName: doc.acsp.packageName,
      packageKMFare: doc.acsp.distfare,
      FareforExtraKM: doc.acsp.fareForExtraKM,
      timefare: doc.acsp.timefare + '/hr',
      fareForExtraTime: doc.acsp.fareForExtraTime,
      pickupCharge: doc.acsp.conveyance,
      hillFare: doc.acsp.hillFare,
      waiting: doc.acsp.waitingRate + '/min',
      discountName: doc.acsp.discountName,
      starttime: startTime,
      endtime: endTime,
      nightFare: doc.acsp.nightFare,
      dayFare: doc.acsp.dayFare,
      nightRate: doc.acsp.nightRate,
      dayRate: doc.acsp.dayRate,
      tollFee: doc.acsp.tollFee,
      distance: doc.acsp.dist + "KM",
      duration: doc.acsp.time,
      baseKM: doc.acsp.baseKM + "KM",
      extraKM: doc.acsp.extraKM,
      perKmRate: doc.acsp.perKmRate + "/KM",
      extraTime: doc.acsp.extraTime,
      noOfDays: doc.acsp.noOfDays,
      noOfNights: doc.acsp.noOfNights,
      fareBeforeTax: doc.acsp.fareBeforeTax,
      taxPercentagecgst: doc.acsp.taxPercentagecgst + ' %',
      taxPercentagesgst: doc.acsp.taxPercentagesgst + ' %',
      taxcgst: doc.acsp.taxcgst,
      taxsgst: doc.acsp.taxsgst,
    }
    data = Object.assign(data, OutstationData);
    htmlPath = path.join(__dirname, '../views/outstationTripInvoice.html');
  }
  var template;
  fs.readFile(htmlPath, 'utf8', (err, htmlData) => {
    if (htmlData) {
      template = Mustache.render(htmlData, data);
      // var pdfFilePath = path.join(__dirname, '../public/pdf/'+ doc._id+'.pdf');
      var pdfFilePath = "/var/www/html/tripInvoice/" + doc._id.toString() + '.pdf';// path.join(__dirname, '../../../../var/www/html/tripInvoice/' + doc._id.toString() + '.pdf');
      var options = {
        orientation: 'portrait',
        type: "pdf",
        timeout: 30000,
        "directory": "/public",
        format: 'Letter',
        filename: pdfFilePath
      };
      try {
        // var html = fs.readFileSync('./public/file-1571737041892.html', 'utf8');
        pdf.create(template, options).toFile(function (err, buffer) {
          if (err) {
            // return;
          }
          else {
            fs.readFile(pdfFilePath, function (err, data) {
              // res.contentType("application/pdf");
            });
            // stream.pipe(fs.createWriteStream(doc._id.toString() + '.pdf'));
          }
        });
        // pdf.create(template, options).toFile([pdfFilePath,], function (err, res2) {
        // if (err) {
        //   res.status(500).json("Some kind of error...", template);
        //   // return;
        // }
        // else {
        // fs.readFile(pdfFilePath, function (err, data) {
        //   // res.contentType("application/pdf");
        //   res.json("Data Created");
        // });
        // }
        // });
      }
      catch (err) {
        res.json(err)
      }
    }
  });
}

export const checkdistanceKMFromMeter = async (distanceKMFromApp, tripId) => {
  var tripLocation = await TripLocation.findOne({ 'tripId': tripId }).exec();
  if (tripLocation) {
    var routeDistance = await calculateRouteDistance(tripLocation.loc, distanceKMFromApp)
    if (routeDistance) {
      var dist = calApproximateDistance(distanceKMFromApp, routeDistance)
      if (dist) {
        return dist
      }
      else {
        return distanceKMFromApp
      }
    }
    else return distanceKMFromApp
  } else {
    return distanceKMFromApp
  }
}

export const calculateRouteDistance = async (locationArr, distanceKMFromApp) => {
  var distanceKm = distanceKMFromApp;
  if (locationArr.length) {
    var i = 0, j = 1;
    var slat, slng, elat, elng;
    var arrLength = locationArr.length - 1
    for (var k = 0; k < arrLength; k++) {
      if (j <= arrLength) {
        var splitData = locationArr[i].split(',');
        var splitData1 = locationArr[j].split(',');
        slat = splitData[0];
        slng = splitData[1];
        elat = splitData1[0];
        elng = splitData1[1];
        if (slat && slng && elat && elng) {
          var distance = await getDistanceBttwoCords(slat, slng, elat, elng)
          distanceKm = distanceKm + distance;
          i += 1
          j += 1
          distanceKm = distanceKm / 1000
        }
      }
    }
    return distanceKm
  }
  else {
    return distanceKMFromApp
  }
}

async function calApproximateDistance(distanceKMFromApp, routeDistance) {
  if (Number(routeDistance) <= 0) {
    var distanceInUnit = distanceKMFromApp;
    return distanceInUnit;
  }
  if (Number(distanceKMFromApp) > Number(routeDistance)) {
    var extraDistance = ((featuresSettings.calMaxDistancePercentage / 100) * Number(routeDistance)).toFixed(2);
    var extraDistanceLimit = Number(routeDistance) + Number(extraDistance);
    if (Number(distanceKMFromApp) > Number(extraDistanceLimit)) {
      var distanceInUnit = Number(extraDistanceLimit).toFixed(2);
      return distanceInUnit;
    }
    else {
      var distanceInUnit = Number(distanceKMFromApp).toFixed(2);
      return distanceInUnit;
    }
  }
  else if (Number(distanceKMFromApp) < Number(routeDistance)) {
    var MinDistance = ((featuresSettings.calMinDistancePercentage / 100) * Number(routeDistance)).toFixed(2);
    var MinDistanceLimit = Number(routeDistance) - Number(MinDistance);
    if (Number(distanceKMFromApp) < Number(MinDistanceLimit)) {
      var distanceInUnit = Number(routeDistance).toFixed(2);
      return distanceInUnit;
    }
    else {
      var distanceInUnit = Number(distanceKMFromApp).toFixed(2);
      return distanceInUnit;
    }
  }
  else {
    var distanceInUnit = Number(distanceKMFromApp).toFixed(2);
    return distanceInUnit;
  }
}

export const checkDistanceKMFromPackage = async (distanceFromAppMeter, packageId, appRealDistance, tripTimeInMins) => {
  var packageDoc = await RentalPackage.findById(packageId).lean();
  var tripTimeInHr = parseFloat(tripTimeInMins) / 60;
  if (packageDoc) {
    var selectedPackageDistance = packageDoc.distance;

    //check if app distance is less than zero
    // App = 0;
    // meter, => less than selecteded package => selected package
    // greater than Meter only,
    if (Number(appRealDistance) <= 0.1) {
      if (Number(distanceFromAppMeter) < Number(selectedPackageDistance)) {
        return selectedPackageDistance;
      } else {
        return distanceFromAppMeter;
      }
      // return checkKMDistanceTravelled(distanceFromAppMeter, tripTimeInHr, selectedPackageDistance);
    }
    //check if app distance is less than estimated
    else if (Number(appRealDistance) < Number(selectedPackageDistance)) {
      /* var lesserPackages = await RentalPackage.find({ 'distance': { $lt: selectedPackageDistance } });
      if (lesserPackages.length) {
        var closestPackageDist = _.maxBy(lesserPackages, 'distance')
        if (closestPackageDist && closestPackageDist.distance > distanceFromAppMeter) return selectedPackageDistance
        else return distanceFromAppMeter
      } */
      return selectedPackageDistance; //returns estimation distance 
      // return distanceFromAppMeter; //returns distanceFromAppMeter distance
    }
    //check if app distance is greater than estimated
    else if (Number(appRealDistance) > Number(selectedPackageDistance)) {
      return Number(appRealDistance);
      // return checkKMDistanceTravelled(appRealDistance, tripTimeInHr, selectedPackageDistance);
    }
    else {
      // return distanceFromAppMeter; //returns distanceFromAppMeter distance
      return selectedPackageDistance; //returns estimation distance 
    }

  }
  else {
    if (Number(appRealDistance) <= 0.1) {
      return false;
    }
    return distanceFromAppMeter;
  }
}

function checkKMDistanceTravelled(distance, tripTimeInHr, selectedPackageDistance) {
  var KMtraveledPerHr = Number((distance / tripTimeInHr).toFixed(2));
  if (KMtraveledPerHr > featuresSettings.possiblePerHrKM) { //Not possible to travel
    return selectedPackageDistance; //Not possible to travel so estimation
  } else {
    return distance; //possible so actual distance
  }
}

export const checkEndMeterPossible = async (distanceKMFromMeter, timeInMin) => {
  var tripTimeInHr = parseFloat(timeInMin) / 60;
  var KMtraveledPerHr = Number((distanceKMFromMeter / tripTimeInHr).toFixed(2));
  if (KMtraveledPerHr > featuresSettings.possiblePerHrKM) { //Not possible to travel
    return false; //Not possible to travel so estimation
  } else {
    return true; //possible so actual distance
  }
}

export const getPreferedDetails = async (arrData, filterBy = 'type') => {
  const uniqueData = _.flow([
    arr => _.groupBy(arr, filterBy), // group elements by id
    g => _.filter(g, o => o.length > 1), // remove groups that have less than two members
    _.flatten // flatten the results to a single array
  ])(arrData);
  if (uniqueData.length) {
    var defaultIncluded = _.filter(uniqueData, { 'scity': "Default" });
    if (defaultIncluded.length) {
      var data = _.map(defaultIncluded, (el) => {
        var removeId = el._id;
        arrData = arrData.filter((item) => JSON.stringify(item._id) !== JSON.stringify(removeId));
      })
    }
  }

  return arrData;
}

export const faceComparison = async (req, res, next) => {
  try {
    var identityImgPath, profileImgPath, identityImgMimeType, profileImgMimeType, identityImgName, profileImgName;

    var identityImg = req.files.identityImg;
    if (identityImg != undefined && identityImg.length) {
      identityImgPath = req.body.identityImgPath = identityImg[0].path;
      identityImgMimeType = identityImg[0].mimetype;
      identityImgName = identityImg[0].filename;
    }
    if(req.files.profileImg) {
      var profileImg = req.files.profileImg;
      if (profileImg != undefined && profileImg.length) {
        profileImgPath = req.body.profileImgPath = profileImg[0].path;
        profileImgMimeType = profileImg[0].mimetype;
        profileImgName = profileImg[0].filename;
      }
    } else { //get Document Image
      const response = await Driver.aggregate([
        { "$match": { "_id": new mongoose.Types.ObjectId(req.userId) } },
        { "$replaceRoot": { 
            "newRoot": {
                "$arrayElemAt": [
                    { "$filter": {
                       "input": "$document",
                       "as": "document",
                       "cond": { /* resolve to a boolean value and determine if an element should be included in the output array. */
                           "$eq": ["$$document.fileFor", "drivingLicense"]
                        } 
                    } },
                    0 /* the element at the specified array index */
                ]
            }
        } }
    ]);

    if(response[0] && response[0].docFrontImg)  {
      profileImgPath = response[0].docFrontImg;
      profileImgMimeType = mime.lookup(profileImgPath);
      profileImgName = path.basename(profileImgPath);
    } else {
      return res.status(500).json({ 'success': false, 'message': "Driver Does not have license Image" });
    }
    }
    // if ((req.type == 'rider') && (profileImg == undefined || profileImg.length == 0)) {
    //   var ridersData = await Rider.findOne({ '_id': req.userId }).lean().exec();
    //   if (ridersData && ridersData.profile) {
    //     profileImgPath = req.body.profileImgPath = ridersData.profile;
    //     // profileImgPath = fs.readFileSync(profileImgPath, {encoding: 'base64'});
    //     var profileImgName = "";
    //     var filename = profileImgPath.split('/');
    //     var fileLen = filename.length;
    //     profileImgName = filename[fileLen - 1];
    //     var fileExtension = profileImgName.split('.').pop();
    //     var arr = profileImgPath.split('.');
    //     var arrLen = arr.length;
    //     var extension = arr[arrLen - 1];
    //     profileImgMimeType = "image/jpeg"
    //     if (extension == "jpeg") profileImgMimeType = "image/jpeg";
    //     else if (extension == "png") profileImgMimeType = "image/png";
    //   }
    // }
    AWS.config.setPromisesDependency();
    AWS.config.update(config.aws.config);
    const s3 = new AWS.S3();
    var params = config.aws.bucket;
    if (identityImg) {
      params['ContentType'] = identityImgMimeType;
      params['Body'] = fs.createReadStream(identityImgPath);
      params['Key'] = `${identityImgName}`;
      s3.upload(params, (err, data) => {
        if (err) {
          return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        }
        if (data) {
          // fs.unlinkSync(req.files[0].path); // Empty temp folder
          // const locationUrl = data.Location;
          // if (profileImg) {
          params['ContentType'] = profileImgMimeType;
          params['Body'] = fs.createReadStream(profileImgPath);
          params['Key'] = `${profileImgName}`;
          s3.upload(params, async (err, data2) => {
            if (err) {
              return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
            }
            if (data2) {
              // fs.unlinkSync(req.files[0].path); // Empty temp folder
              const locationUrl = data2.Location;
              // return res.status(200).json({ 'success': true, 'message': 'Fetched successfully.', 'data': data });
              var percentage = await compareFaces(identityImgName, profileImgName);
              req.body.profileSimilarityPerc = percentage;
              req.body.isProfileImgMatchVerified = true;
              if (Number(percentage) > featuresSettings.faceSimalarityPercentage) { 
                req.faceSimalarityPercentage = percentage;
                req.body.profileImgMatchStatus = "matching";
                next();
              }
              else {
                req.body.profileImgMatchStatus = "notmatching";
                return res.status(200).json({ 'success': false, 'message': req.i18n.__("FACE_NOT_MATCHING"), 'simalirityPercentage': percentage, "profileImgMatchStatus": "Your Face is Not Matching" });
              }
              
            }
            if (!data2) {
              return res.status(500).json({ 'success': false, 'message': req.i18n.__("NOT_UPLOADED"), 'error': data });
            }
          });
          // return res.status(200).json({ 'success': true, 'message': 'Fetched successfully.', 'data': data });
          // }
        }
        if (!data) {
          return res.status(500).json({ 'success': false, 'message': req.i18n.__("NOT_UPLOADED"), 'error': data });
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
  }
}

export const compareFaces = async (identityImgName, profileImgName) => {
  const bucket = config.aws.bucket.Bucket;
  const photo_source = profileImgName;
  const photo_target = identityImgName;
  // const config = new AWS.Config()
  const client = new AWS.Rekognition(config.aws.config);
  const params = {
    SourceImage: {
      S3Object: {
        Bucket: bucket,
        Name: photo_source
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: bucket,
        Name: photo_target
      },
    },
    SimilarityThreshold: 70
  }
  var similarity = 0;
  return new Promise(function (resolve, reject) {
    client.compareFaces(params, function (err, response) {
      if (err) {
        resolve(similarity);
      } else {
        response.FaceMatches.forEach(data => {
          let position = data.Face.BoundingBox;
          similarity = data.Similarity;
          similarity = Number(similarity).toFixed(0);

        })
        resolve(similarity);
      }
    });
  })
}

export const faceComparisonWithBytes = async (req, res, next) => {
  try {
    var identityImgPath, profileImgPath;
    var identityImg = req.files.identityImg;
    if (identityImg != undefined && identityImg.length) {
      identityImgPath  = req.body.identityImgPath = identityImg[0].path;
    }
    var profileImg = req.files.profileImg;
    if (profileImg != undefined && profileImg.length) {
      profileImgPath = req.body.profileImgPath = profileImg[0].path;
    }
    if ((req.type == 'rider') && (profileImg == undefined || profileImg.length == 0)) {
      var ridersData = await Rider.findOne({ '_id': req.userId }).lean().exec();
      if (ridersData && ridersData.profile) {
        profileImgPath = req.body.profileImgPath = ridersData.profile;
      }
    }
    var percentage = await compareFacesBytes(identityImgPath, profileImgPath);
    req.body.profileSimilarityPerc = percentage;
    req.body.isProfileImgMatchVerified = true;
    if (Number(percentage) > featuresSettings.faceSimalarityPercentage) { 
      req.body.profileImgMatchStatus = "matching";
      next();
    }
    else {
      req.body.profileImgMatchStatus = "notmatching";
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("FACE_NOT_MATCHING"), 'simalirityPercentage': percentage });
    }
    
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
  }
}

export const compareFacesBytes = async (identityImgPath, profileImgPath) => {
  const bitmap = fs.readFileSync(profileImgPath);
  const buffer = new Buffer.from(bitmap, 'base64');
  const bitmap2 = fs.readFileSync(identityImgPath);
  const buffer2 = new Buffer.from(bitmap2, 'base64');
  // const config = new AWS.Config()
  const client = new AWS.Rekognition(config.aws.config);
  const params = {
    SourceImage: {
      Bytes: buffer
    },
    TargetImage: {
      Bytes: buffer2
    },
    SimilarityThreshold: 70
  }
  var similarity = 0;
  return new Promise(function (resolve, reject) {
    client.compareFaces(params, function (err, response) {
      var result = {};
      if (err) {
        resolve(similarity);
      } else {
        response.FaceMatches.forEach(data => {
          let position = data.Face.BoundingBox;
          similarity = data.Similarity;
          similarity = Number(similarity).toFixed(0);
          result.response = response
          result.similarity = similarity;
        })
        resolve(similarity);
      }
    });
  });
}