// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
//import models
import Offers from '../models/offer.model';
import * as HelperFunc from './adminfunctions';
import * as GFunctions from './functions';
import { checkPickupPointsServiceId } from './app';
import Rider from '../models/rider.model';

const moment = require('moment');
var config = require('../config');
const featuresSettings = require('../featuresSettings');

export const addData = (req, res) => {
  var filename = "";
  if (req['file'] != null) {
    filename = req['file'].path;
  }

  var newDoc = new Offers();
  // newDoc.cityId   = req.body.cityId;
  // newDoc.cityName = req.body.cityName;
  newDoc.title = req.body.title;
  newDoc.desc = req.body.desc;
  newDoc.file = filename;
  newDoc.edate = moment(req.body.edate, "YYYY-MM-DD");
  newDoc.vdate = moment(req.body.vdate, "YYYY-MM-DD");
  newDoc.scIds = JSON.parse(req.body.scIds);

  newDoc.save((err, datas) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("OFFER_ADDED_SUCCESSFULLY"), "datas": datas });
  })

};


/**
 * Update Offers Details 
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const updateData = (req, res) => {
  var filename = "";
  if (req['file'] != null) {
    filename = req['file'].path;
  }

  var updateDoc =
  {
    cityId: req.body.cityId,
    cityName: req.body.cityName,
    desc: req.body.desc,
    edate: moment(req.body.edate, "YYYY-MM-DD"),
    vdate: moment(req.body.vdate, "YYYY-MM-DD"),
    scIds: JSON.parse(req.body.scIds),
  }

  if (filename != "") {
    updateDoc.file = filename;
  }

  Offers.findOneAndUpdate({ _id: req.body._id }, updateDoc, { new: true }, (err, todo) => {
    if (err) return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), todo });
  });
};

/**
 * Delete Offers Details 
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const deleteData = (req, res) => {
  Offers.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), docs });
  })
}

export const currentOfferList = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;

  var i = moment().format("YYYY-MM-DD 00:00:00.000");
  likeQuery['edate'] = { "$gte": i };

  if (req.query.vdate_like) {
    var visibleDate = moment(req.query.vdate_like, 'DD-MM-YYYY', true);
    if (visibleDate.isValid()) {
      likeQuery['vdate'] = moment(req.query.vdate_like, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.000")
    }
  }

  if (req.query.edate_like) {
    var endDate = moment(req.query.edate_like, 'DD-MM-YYYY', true);
    if (endDate.isValid()) {
      likeQuery['edate'] = moment(req.query.edate_like, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.000")
    }
  }
  if (req.cityWise == 'exists') likeQuery['scIds.scId'] = { "$in": req.scId };
  Offers.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  Offers.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}

export const expiredOfferList = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;

  var i = moment().format("YYYY-MM-DD 00:00:00.000");
  likeQuery['edate'] = { "$lt": i };

  if (req.query.vdate_like) {
    var visibleDate = moment(req.query.vdate_like, 'DD-MM-YYYY', true);
    if (visibleDate.isValid()) {
      likeQuery['vdate'] = moment(req.query.vdate_like, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.000")
    }
  }

  if (req.query.edate_like) {
    var endDate = moment(req.query.edate_like, 'DD-MM-YYYY', true);
    if (endDate.isValid()) {
      likeQuery['edate'] = moment(req.query.edate_like, 'DD-MM-YYYY').format("YYYY-MM-DD 00:00:00.000")
    }
  }
  if (req.cityWise == 'exists') likeQuery['scIds.scId'] = { "$in": req.scId };
  Offers.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  Offers.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}


export const showOfferList = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  // var city = ''; 
  likeQuery['vdate'] = { "$lte": GFunctions.getISOTodayDate() };
  likeQuery['edate'] = { "$gte": moment().format("YYYY-MM-DD 00:00:00.000") };
  // likeQuery['city'] = city;
  if (featuresSettings.isCityWise) {
    var user = await Rider.findOne({ _id: req.userId }, { 'scId': 1, "scity": 1 })
    if (req.body.currentLng && req.body.currentLat) {
      var pickUpPoint = [req.body.currentLng, req.body.currentLat];
      var serviceExists = await checkPickupPointsServiceId(pickUpPoint);
      likeQuery['scIds.name'] = { $in: [serviceExists.pickupCity, 'Default'] }
    }
    else if (user && user.scId != null && user.scity != "") {
      likeQuery['scIds.name'] = { $in: [user.scity, 'Default'] }
    }
  }
  console.log(likeQuery)
  Offers.find({ $and: [likeQuery] }).limit(50).sort({ edate: - 1 }).exec((err, docs) => {
    // Offers.find({ $and: [{ vdate: { "$lte": new Date() } }, { edate: { "$gte": new Date() } }] }).limit(50).sort({ edate: - 1 }).exec((err, docs) => {
    var resultarr = [];
    if (err) {
      return res.json(resultarr);
    }
    var result = docs.map(function (items) {
      var arrData = {
        _id: items._id,
        vdate: GFunctions.getDateTimeinThisFormat(items.vdate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]", "DD-MM-YYYY"),
        edate: GFunctions.getDateTimeinThisFormat(items.edate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]", "DD-MM-YYYY"),
        file: config.baseurl + items.file,
        desc: items.desc,
        code: items.code,
        title: items.title,
        city: items.city,
      };
      resultarr.push(arrData);
    });
    return res.send(resultarr);
  });
}


//Todo
//push notification of offers in mobile 