// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
import path from 'path';
import * as HelperFunc from './adminfunctions';
const mround = require('mongo-round');
const url = require('url');
const _ = require('lodash');
import * as GFunctions from './functions';
const moment = require("moment");

//import models
import DriverPayment from '../models/driverpayment.model';
import Trips from '../models/trips.model';
import Rider from '../models/rider.model';
import Driver from '../models/driver.model';
import Wallet from '../models/wallet.model';
import DriverPackage from '../models/driverPackage.model';
import { dataflow_v1b3 } from 'googleapis';
import DriverPerDay from '../models/driverperDay.model';
import DriverSubscription from '../models/driverSubscription.model';

/**
 * Driver Pay Reports
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const driverPayReport = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.query.scity_like != undefined) dateLikeQuery['scity'] = { "$eq": req.query.scity_like };
  if (req.type == 'company') dateLikeQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
  if (req.type == 'company') likeQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  let TotCnt = DriverPayment.aggregate([
    { "$match": dateLikeQuery },
    {
      "$group": {
        "_id": '$driver',
        "dvrfname": { $addToSet: "$dvrfname" },
        "count": { $sum: 1 },
      },
    },
    { "$match": likeQuery },
  ]);

  let Datas = DriverPayment.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$group": {
        "_id": '$driver',
        "dvrfname": { $addToSet: "$dvrfname" },
        "count": { $sum: 1 },
        "commision": { $sum: "$commision" },
        "inhand": { $sum: "$inhand" },
        "digital": { $sum: "$digital" },
        "toSettle": { $sum: "$toSettle" },
        "code": { $addToSet: "$userinfo.code" },
        "referenceCode": { $addToSet: "$userinfo.referenceCode" },
        "scity": { $first: "$userinfo.scity" },
        "scId": { $first: "$userinfo.scId" },
        "cmpy": { $first: "$userinfo.cmpy" },
        "cntyname": { $first: "$cntyname" },
        "amttodriver": { $sum: "$amttodriver" },
      },
    }, //{ $unwind: "$scity" }, { $unwind: "$scId" },
    {
      $project:
      {
        _id: 1,
        dvrfname: 1,
        count: 1,
        commision: mround('$commision', 2),
        inhand: mround('$inhand', 2),
        digital: mround('$digital', 2),
        toSettle: mround('$toSettle', 2),
        amttodriver: mround('$amttodriver', 2),
        code: 1,
        referenceCode: 1,
        scity: 1,
        scId: 1,
        cmpy: 1
      }
    },
    { "$match": likeQuery },
    {
      "$sort": {
        'code': -1
      }
    },
    skip,
    limit,
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

export const driverPayReportDailyFormat = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') dateLikeQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
  if (req.type == 'company') likeQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }

  let TotCnt = DriverPayment.aggregate([
    { "$match": dateLikeQuery },
    {
      "$group": {
        "_id": '$driver',
        "dvrfname": { $addToSet: "$dvrfname" },
        "count": { $sum: 1 },
      },
    },
    { "$match": likeQuery },
  ]);

  let Datas = DriverPayment.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$group": {
        "_id": '$driver',
        "dvrfname": { $addToSet: "$dvrfname" },
        "count": { $sum: 1 },
        "commision": { $sum: "$commision" },
        "inhand": { $sum: "$inhand" },
        "digital": { $sum: "$digital" },
        "toSettle": { $sum: "$toSettle" },
        "code": { $addToSet: "$userinfo.code" },
        "scity": { $addToSet: "$userinfo.scity" },
        "scId": { $addToSet: "$userinfo.scId" },
        "cmpy": { $first: "$userinfo.cmpy" },
        "cntyname": { $first: "$cntyname" },
        "amttodriver": { $sum: "$amttodriver" },
      },
    },
    {
      $project:
      {
        _id: 1,
        dvrfname: 1,
        count: 1,
        commision: mround('$commision', 2),
        inhand: mround('$inhand', 2),
        digital: mround('$digital', 2),
        toSettle: mround('$toSettle', 2),
        amttodriver: 1,
        code: 1,
        scity: 1,
        scId: 1,
        cmpy: 1
      }
    },
    { "$match": likeQuery },
    {
      "$sort": {
        'code': -1
      }
    },
    skip,
    limit,
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}
/**
 * Driver Pay Reports Single
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const driverPayReportSingle = (req, res) => {
  DriverPayment.find({ driver: req.params.id, todvr: 'no' }, function (err, docs) {
    if (err) {
      res.json([]);
    } else {
      res.json(docs);
    }
  });
}


/**
 * All Ride Payment Report
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const paymentReport = async (req, res) => {

  if (req.query._sort == "" || typeof req.query._sort == "undefined") {
    req.query._sort = "createdAt"
  }

  if (req.query._order == "" || typeof req.query._order == "undefined") {
    req.query._order = "ASC"
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query, DriverPayment);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = {};
  likeQuery = HelperFunc.findQueryBuilder(req.query, likeQuery);
  sortQuery['tripFDT'] = 1;
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (likeQuery['createdAt']) {
    var today = likeQuery['createdAt']['$gte'];//"2019-01-23";//likeQuery['createdAt'];
    var todayplusone = likeQuery['createdAt']['$lte'];// moment(today).add(1, "month").format("YYYY-MM-DD");
  } else {
    var today = GFunctions.getISOTodayDate();
    var todayplusone = GFunctions.getISODateADayBuffer(1, "YYYY-MM-DD");
  }
  dateLikeQuery = {
    createdAt: { $gte: new Date(today), $lt: new Date(todayplusone) }
  };
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }

  // let countData = DriverPayment.find(dateLikeQuery).exec();
  let countData = DriverPayment.aggregate([
    {
      "$match": dateLikeQuery
    },
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo",

      }
    },
    {
      $unwind: {
        path: "$userinfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project:
      {
        "tripno": 1,
        "dvrfname": 1,
        scity: "$userinfo.scity",
        scId: "$userinfo.scId",

        code: "$userinfo.code",
      }
    },
    {
      "$lookup": {
        "localField": "tripno",
        "from": "trips",
        "foreignField": "tripno",
        "as": "tripinfo",

      }
    },
    {
      $unwind: {
        path: "$tripinfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      "$match": likeQuery
    }
  ]);
  let Datas = DriverPayment.aggregate([
    {
      "$match": dateLikeQuery
    },
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo",

      }
    },
    {
      $unwind: {
        path: "$userinfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      "$lookup": {
        "localField": "tripno",
        "from": "trips",
        "foreignField": "tripno",
        "as": "tripinfo",

      }
    },
    {
      $unwind: {
        path: "$tripinfo",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project:
      {
        "_id": 1,
        "tripno": 1,
        "driver": 1,
        "chId": 1,
        "todvr": 1,
        "ispaid": 1,
        "mtd": 1,
        "toSettle": 1,
        "amttodriver": 1,
        "inhand": 1,
        "outstanding": 1,
        "digital": 1,
        "stripedebt": 1,
        "walletdebt": 1,
        "promoamt": 1,
        "commision": 1,
        "cashpaid": 1,
        "amttopay": 1,
        "dvrfname": 1,
        "createdAt": 1,
        "totalDetucted": 1,
        "tollFee": 1,
        "driverTaxTDS": 1,
        "tax": 1,
        "addittionalFee": 1,
        "tripinfo": "$tripinfo",
        // "tripDate": '$tripinfo.date',
        "__v": 1,

        code: "$userinfo.code",
        referenceCode: "$userinfo.referenceCode",
        scity: "$userinfo.scity",
        scId: "$userinfo.scId",
        cmpy: "$userinfo.cmpy"
      }
    },
    {
      "$match": likeQuery
    },
    {
      "$sort": {
        'tripno': -1
      }
    },
    skip,
    limit,
  ]);
  try {
    var promises = await Promise.all([countData, Datas]);
    res.header('x-total-count', promises[0].length);
    // setHeader(name, value)
    // res.setHeader('report-based', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }

}

export const paymentReportDaily = async (req, res) => {
  if (req.query.date) {
    var today = req.query.date;
    var todayplusone = moment(today).add(1, "days").format("YYYY-MM-DD");
  } else {
    var today = GFunctions.getISOTodayDate();
    var todayplusone = GFunctions.getISODateADayBuffer(1, "YYYY-MM-DD");
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$in": req.query.scity_like };
  var dateLikeQuery = {
    createdAt: { $gt: new Date(today), $lt: new Date(todayplusone) }
  };
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };

  let Datas = Trips.aggregate([
    {
      "$match": dateLikeQuery
    },

    {
      "$project": {
        tripFDT: {
          $dateToString: { format: "%H", date: "$tripFDT" }
        },
        tripno: 1,
        vehicle: 1,
        paymentMode: 1,
        status: 1,
        acsp: 1,
        csp: 1,
        paymentSts: 1,
        fare: 1,
        bookingFor: 1,
        "bookingTypeRideNow": { $cond: { if: { $eq: ["$bookingType", 'rideNow'] }, then: 1, else: 0 } },
        "bookingTypeRideLater": { $cond: { if: { $eq: ["$bookingType", 'rideLater'] }, then: 1, else: 0 } },
        "requestFromApp": { $cond: { if: { $eq: ["$requestFrom", 'app'] }, then: 1, else: 0 } },
        "requestFromAdmin": { $cond: { if: { $eq: ["$requestFrom", 'admin'] }, then: 1, else: 0 } },
        triptype: 1,
        adsp: 1,
        scity: 1,
        scId: 1
      }
    },
    {
      $sort: {
        tripFDT: -1
      }
    },
    {
      "$group": {
        _id: "$tripFDT",
        count: { $sum: 1 },
        fare: { $sum: "$fare" },
        requestFromApp: { $sum: "$requestFromApp" },
        requestFromAdmin: { $sum: "$requestFromAdmin" },
        bookingTypeRideNow: { $sum: "$bookingTypeRideNow" },
        bookingTypeRideLater: { $sum: "$bookingTypeRideLater" },
        totalFare: { $sum: "$acsp.cost" },
        comison: { $sum: "$acsp.comison" },
        scId: { $addToSet: "$scId" },
        scity: { $addToSet: "$scity" }
        // vehicle : {
        //   $push : "$vehicle"
        // }
      }
    },
    {
      $match: likeQuery
    }
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
 * markSettledDvrPayment
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const markSettledDvrPayment = (req, res) => {
  var dvrstosettle = req.body;
  dvrstosettle.forEach(function (element) {
    markSettledDvrPaymentFunc(element);
  });
  return res.json(req.body);
}

function markSettledDvrPaymentFunc(element) {
  //If paid out log Trx Id too
  var driverId = new mongoose.Types.ObjectId(element._id);
  var query = { driver: driverId };
  var update = { todvr: 'yes' };

  DriverPayment.update(query, update, { multi: true }, function (err) {
    if (err) {
      throw err;
    }
    else {
    }
  });

}


/**
 * [canceledTrips]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const canceledTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery = HelperFunc.findQueryBuilder(req.query, likeQuery);
  likeQuery['status'] = 'Cancelled';

  let TotCnt = Trips.find(likeQuery).count();

  let Datas = Trips.aggregate(
    [
      {
        "$lookup": {
          "localField": "dvrid",
          "from": "drivers",
          "foreignField": "_id",
          "as": "userinfo"
        }
      },
      {
        $unwind: {
          path: "$userinfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project:
        {
          "_id": 1,
          "date": 1,
          "tripno": 1,
          "cpy": 1,
          "cpyid": 1,
          "dvr": 1,
          "rid": 1,
          "ridid": 1,
          "taxi": 1,
          "service": 1,
          "estTime": 1,
          "__v": 1,
          "dvrid": 1,
          "tripFDT": 1,
          "utc": 1,
          "tripDT": 1,
          "driverfb": 1,
          "riderfb": 1,
          "needClear": 1,
          "curReq": 1,
          "reqDvr": 1,
          "review": 1,
          "status": 1,
          "adsp": 1,
          "acsp": 1,
          "dsp": 1,
          "csp": 1,
          "paymentSts": 1,
          "triptype": 1,
          "createdAt": 1,
          code: "$userinfo.code"
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
    return res.json([err]);
  }
}



/**
 * [tripStatus]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const tripStatus = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };
  if (req.query['scity_like'] != undefined) dateLikeQuery['scity'] = req.query['scity_like'];
  if (req.type == 'company') dateLikeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);

  if (_.isEmpty(dateLikeQuery)) {
    var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery =
      {
        tripFDT:
        {
          '$gte': fromDate,
          '$lte': toDate
        }
      }
  };

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  // let TotCnt = Trips.find(likeQuery).count();

  let Datas = Trips.aggregate(
    [
      { "$match": dateLikeQuery },

      {
        $project:
        {
          tripId: "$_id",
          tripstatus: "$status",
          _id: 0,
          yearMonthDayUTC: { $dateToString: { format: "%d-%m-%Y", date: "$tripFDT" } },
        }
      },
      {
        "$group":
        {
          _id: { yearMonthDayUTC: "$yearMonthDayUTC", tripstatus: "$tripstatus" },
          "tripCount": { "$sum": 1 }
        }
      },
      {
        $project:
        {
          _id: 0,
          date: "$_id.yearMonthDayUTC",
          sortDate: { $toDate: "$_id.yearMonthDayUTC" },
          "noresponse": { $cond: { if: { $eq: ["$_id.tripstatus", 'noresponse'] }, then: "$tripCount", else: 0 } },
          "processing": { $cond: { if: { $eq: ["$_id.tripstatus", 'processing'] }, then: "$tripCount", else: 0 } },
          "canceled": { $cond: { if: { $eq: ["$_id.tripstatus", 'Cancelled'] }, then: "$tripCount", else: 0 } },
          "Finished": { $cond: { if: { $eq: ["$_id.tripstatus", 'Finished'] }, then: "$tripCount", else: 0 } },
        }
      },
      {
        "$group":
        {
          _id: "$date",
          "sortDate": { $first: "$sortDate" },
          "noresponse": { "$sum": "$noresponse" },
          "processing": { "$sum": "$processing" },
          "canceled": { "$sum": "$canceled" },
          "Finished": { "$sum": "$Finished" },
        }
      },
      {
        "$sort": {
          sortDate: 1
        }
      },

      // sortQuery,
      // skip,
      // limit,
    ]);
  try {
    var promises = await Promise.all([Datas]);
    // res.header('x-total-count', promises[0]);
    var resstr = promises[0];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}

export const tripStatusDaily = async (req, res) => {
  if (req.query.date) {
    var today = req.query.date;
    var todayplusone = moment(today).add(1, "days").format("YYYY-MM-DD");
  } else {
    var today = GFunctions.getISOTodayDate();
    var todayplusone = GFunctions.getISODateADayBuffer(1, "YYYY-MM-DD");
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$in": req.query.scity_like };
  var dateLikeQuery = {
    createdAt: { $gt: new Date(today), $lt: new Date(todayplusone) }
  };
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };

  let Datas = Trips.aggregate([
    {
      "$match": dateLikeQuery
    },

    {
      "$project": {
        tripFDT: {
          $dateToString: { format: "%H", date: "$tripFDT" }
        },
        "finished": { $cond: { if: { $eq: ["$status", 'Finished'] }, then: 1, else: 0 } },
        "noresponse": { $cond: { if: { $eq: ["$status", 'noresponse'] }, then: 1, else: 0 } },
        "processing": { $cond: { if: { $eq: ["$status", 'processing'] }, then: 1, else: 0 } },
        "canceled": { $cond: { if: { $eq: ["$status", 'canceled'] }, then: 1, else: 0 } },
        scId: 1,
        scity: 1
      }
    },
    {
      $sort: {
        tripFDT: -1
      }
    },
    {
      "$group": {
        _id: "$tripFDT",
        finished: { $sum: "$finished" },
        noresponse: { $sum: "$noresponse" },
        processing: { $sum: "$processing" },
        canceled: { $sum: "$canceled" },
        scId: { $addToSet: "$scId" },
        scity: { $addToSet: "$scity" }
      }
    },
    {
      $match: likeQuery
    }
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
 * [tripStatus]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const tripTypes = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };
  if (req.query['scity_like'] != undefined) dateLikeQuery['scity'] = req.query['scity_like'];
  if (req.type == 'company') dateLikeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);

  if (_.isEmpty(dateLikeQuery)) {
    var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery = {
      tripFDT:
      {
        '$gte': fromDate,
        '$lte': toDate
      }
    }
  }
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  let Datas = Trips.aggregate(
    [
      { "$match": dateLikeQuery },
      {
        $project:
        {
          tripId: "$_id",
          bookingType: "$bookingType",
          _id: 0,
          scity: "$scity",
          // cpy:"$cpy",
          yearMonthDayUTC: { $dateToString: { format: "%d-%m-%Y", date: "$tripFDT" } },
        }
      },
      {
        "$group":
        {
          _id: { yearMonthDayUTC: "$yearMonthDayUTC", bookingType: "$bookingType" },
          "scity": { $addToSet: "$scity" },
          // "cpy":{ $first:"$cpy"},
          "tripCount": { "$sum": 1 }
        }
      },
      {
        $project:
        {
          _id: 1,
          date: "$_id.yearMonthDayUTC",
          sortDate: { $toDate: "$_id.yearMonthDayUTC" },
          scity: "$scity",
          // cpy:"$cpy",
          "rideNow": { $cond: { if: { $eq: ["$_id.bookingType", 'rideNow'] }, then: "$tripCount", else: 0 } },
          "rideLater": { $cond: { if: { $eq: ["$_id.bookingType", 'rideLater'] }, then: "$tripCount", else: 0 } },
          "hailRide": { $cond: { if: { $eq: ["$_id.bookingType", 'hailRide'] }, then: "$tripCount", else: 0 } },
        }
      },

      {
        "$group":
        {
          _id: "$date",
          "sortDate": { $first: "$sortDate" },
          scity: { $addToSet: "$scity" },
          // cpy:{ $first:"$cpy"},
          "rideNow": { "$sum": "$rideNow" },
          "rideLater": { "$sum": "$rideLater" },
          "hailRide": { "$sum": "$hailRide" },
        }
      },
      { $sort: { sortDate: 1 } }
      // skip,
      // limit,
    ]);

  try {
    var promises = await Promise.all([Datas]);
    // res.header('x-total-count', promises[0]);
    var resstr = promises[0];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}


export const tripTypesDaily = async (req, res) => {
  if (req.query.date) {
    var today = req.query.date;
    var todayplusone = moment(today).add(1, "days").format("YYYY-MM-DD");
  } else {
    var today = GFunctions.getISOTodayDate();
    var todayplusone = GFunctions.getISODateADayBuffer(1, "YYYY-MM-DD");
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$in": req.query.scity_like };
  var dateLikeQuery = {
    createdAt: { $gt: new Date(today), $lt: new Date(todayplusone) }
  };
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };

  let Datas = Trips.aggregate([
    {
      "$match": dateLikeQuery
    },
    {
      "$project": {
        tripFDT: {
          $dateToString: { format: "%H", date: "$tripFDT" }
        },
        "rideNow": { $cond: { if: { $eq: ["$bookingType", 'rideNow'] }, then: 1, else: 0 } },
        "rideLater": { $cond: { if: { $eq: ["$bookingType", 'rideLater'] }, then: 1, else: 0 } },
        "hailRide": { $cond: { if: { $eq: ["$bookingType", 'hailRide'] }, then: 1, else: 0 } },
        scId: 1,
        scity: 1
      }
    },
    {
      $sort: {
        tripFDT: -1
      }
    },
    {
      "$group": {
        _id: "$tripFDT",
        rideNow: { $sum: "$rideNow" },
        rideLater: { $sum: "$rideLater" },
        hailRide: { $sum: "$hailRide" },
        scId: { $addToSet: "$scId" },
        scity: { $addToSet: "$scity" }
      }
    },
    {
      $match: likeQuery
    }
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
 * [tripBookingTypes]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const tripBookedBy = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };
  if (req.query['scity_like'] != undefined) dateLikeQuery['scity'] = req.query['scity_like'];
  if (req.type == 'company') dateLikeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);

  if (_.isEmpty(dateLikeQuery)) {
    var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery = {
      tripFDT:
      {
        '$gte': fromDate,
        '$lte': toDate
      }
    }
  }

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }

  let TotCnt = Trips.aggregate(
    [
      { "$match": dateLikeQuery },

      {
        $project:
        {
          tripId: "$_id",
          requestFrom: "$requestFrom",
          _id: 0,
          scity: "$scity",
          // cpy:"$cpy",
          yearMonthDayUTC: { $dateToString: { format: "%d-%m-%Y", date: "$tripFDT" } },
        }
      },
      {
        "$group":
        {
          _id: { yearMonthDayUTC: "$yearMonthDayUTC", requestFrom: "$requestFrom" },
        }
      },
      {
        $project:
        {
          _id: 1,
          date: "$_id.yearMonthDayUTC",
        }
      },
      {
        "$group":
        {
          _id: "$date",
        }
      }
    ]);

  let Datas = Trips.aggregate(
    [
      { "$match": dateLikeQuery },

      {
        $project:
        {
          tripId: "$_id",
          requestFrom: "$requestFrom",
          _id: 0,
          scity: "$scity",
          // cpy:"$cpy",
          yearMonthDayUTC: { $dateToString: { format: "%d-%m-%Y", date: "$tripFDT" } },
        }
      },
      {
        "$group":
        {
          _id: { yearMonthDayUTC: "$yearMonthDayUTC", requestFrom: "$requestFrom" },
          "scity": { $addToSet: "$scity" },
          // "cpy":{ $first:"$cpy"},
          "tripCount": { "$sum": 1 }
        }
      },
      {
        $project:
        {
          _id: 1,
          date: "$_id.yearMonthDayUTC",
          sortDate: { $toDate: "$_id.yearMonthDayUTC" },
          scity: "$scity",
          // cpy:"$cpy",
          "app": { $cond: { if: { $eq: ["$_id.requestFrom", 'app'] }, then: "$tripCount", else: 0 } },
          "admin": { $cond: { if: { $eq: ["$_id.requestFrom", 'admin'] }, then: "$tripCount", else: 0 } },
          "hotel": { $cond: { if: { $eq: ["$_id.requestFrom", 'hotel'] }, then: "$tripCount", else: 0 } },
        }
      },
      {
        "$group":
        {
          _id: "$date",
          scity: { $addToSet: "$scity" },
          "sortDate": { $first: "$sortDate" },
          // cpy:{ $first:"$cpy"},
          "app": { "$sum": "$app" },
          "admin": { "$sum": "$admin" },
          "hotel": { "$sum": "$hotel" },
        }
      },
      { $sort: { sortDate: 1 } },
      skip,
      limit,
    ]);

  try {
    var promises = await Promise.all([Datas, TotCnt]);
    res.header('x-total-count', promises[1].length);
    var resstr = promises[0];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}

export const tripBookedByDaily = async (req, res) => {
  if (req.query.date) {
    var today = req.query.date;
    var todayplusone = moment(today).add(1, "days").format("YYYY-MM-DD");
  } else {
    var today = GFunctions.getISOTodayDate();
    var todayplusone = GFunctions.getISODateADayBuffer(1, "YYYY-MM-DD");
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.query.scity_like != undefined) likeQuery['scity'] = { "$in": req.query.scity_like };
  var dateLikeQuery = {
    createdAt: { $gt: new Date(today), $lt: new Date(todayplusone) }
  };
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };

  let Datas = Trips.aggregate([
    {
      "$match": dateLikeQuery
    },
    {
      "$project": {
        tripFDT: {
          $dateToString: { format: "%H", date: "$tripFDT" }
        },
        "app": { $cond: { if: { $eq: ["$requestFrom", 'app'] }, then: 1, else: 0 } },
        "admin": { $cond: { if: { $eq: ["$requestFrom", 'admin'] }, then: 1, else: 0 } },
        "hotel": { $cond: { if: { $eq: ["$requestFrom", 'hotel'] }, then: 1, else: 0 } },
        scId: 1,
        scity: 1
      }
    },
    {
      $sort: {
        tripFDT: -1
      }
    },
    {
      "$group": {
        _id: "$tripFDT",
        app: { $sum: "$app" },
        admin: { $sum: "$admin" },
        hotel: { $sum: "$hotel" },
        scId: { $addToSet: "$scId" },
        scity: { $addToSet: "$scity" }
      }
    },
    {
      $match: likeQuery
    }
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
 * UserWallet 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const userWallet = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  //if(req.type == 'company') likeQuery['cmpy'] = {"$in":req.userId};
  // if(req.query['scity_like']!=undefined)likeQuery['scity']= req.query['scity_like'] ; 

  // var sort = req.query._sort;
  // if ((typeof sort).toString() == "undefined") {
  //   sortQuery['_id'] = 1;
  //   return sortQuery;
  // }

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }

  // let TotCnt = Wallet.find(likeQuery).count();
  let TotCnt = Wallet.aggregate([
    {
      "$lookup": {
        "localField": "ridid",
        "from": "riders",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "bal": 1,
        "fname": "$userinfo.fname",
        "phone": "$userinfo.phone",
        "scId": "$userinfo.scId",
        "scity": "$userinfo.scity"
      }
    },
    { "$match": likeQuery },
  ]);

  let Datas = Wallet.aggregate([
    {
      "$lookup": {
        "localField": "ridid",
        "from": "riders",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "bal": 1,
        "trx": 1,
        "fname": "$userinfo.fname",
        "riderId": "$userinfo._id",
        "phone": "$userinfo.phone",
        "scId": "$userinfo.scId",
        "scity": "$userinfo.scity"
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    skip,
    limit
  ]);

  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }

}

/**
 * Referrer 
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const referrer = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  // likeQuery = HelperFunc.findQueryBuilder(req.query,likeQuery);   
  // likeQuery['status']  = 'canceled';  

  // let TotCnt = Rider.find(likeQuery).count() ;
  Wallet.aggregate([
    { "$match": { "trx.for": "reference" } }, //Make to "" as Referal - Referal Code i

    {
      "$lookup": {
        "localField": "ridid",
        "from": "riders",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "bal": 1,
        "trx": 1,
        "userinfo.fname": 1,
        "userinfo.phone": 1
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    { "$skip": pageQuery.skip },
    { "$limit": pageQuery.take },
  ], function (err, result) {
    if (err) {
      return res.json([]);
    }
    return res.json(result);
  });

}


/**
 * [tripTimeVariance]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const tripTimeVariance = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery = HelperFunc.findQueryBuilder(req.query, likeQuery);
  likeQuery['status'] = 'Finished';

  let TotCnt = Trips.find(likeQuery).count();
  //let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
  let Datas = Trips.aggregate(
    [
      {
        "$lookup": {
          "localField": "dvrid",
          "from": "drivers",
          "foreignField": "_id",
          "as": "userinfo"
        }
      },
      {
        $unwind: {
          path: "$userinfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project:
        {
          "_id": 1,
          "date": 1,
          "tripno": 1,
          "cpy": 1,
          "cpyid": 1,
          "dvr": 1,
          "rid": 1,
          "ridid": 1,
          "taxi": 1,
          "service": 1,
          "estTime": 1,
          "__v": 1,
          "dvrid": 1,
          "tripFDT": 1,
          "utc": 1,
          "tripDT": 1,
          "driverfb": 1,
          "riderfb": 1,
          "needClear": 1,
          "curReq": 1,
          "reqDvr": 1,
          "review": 1,
          "status": 1,
          "adsp": 1,
          "acsp": 1,
          "dsp": 1,
          "csp": 1,
          "paymentSts": 1,
          "triptype": 1,
          "createdAt": 1,
          code: "$userinfo.code"
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


/**
 * [logReport]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const logReport = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery = HelperFunc.findQueryBuilder(req.query, likeQuery);
  var driverId = new mongoose.Types.ObjectId(req.params.id);
  let TotCnt = Driver.find(likeQuery).count();
  //let Datas = Driver.find(likeQuery, { fname: 1, email: 1, phone: 1,last_out:1,last_in:1}).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
  let Datas = Driver.aggregate([
    {
      $project: {
        _id: 0,
        'fname': 1,
        'email': 1,
        'last_in': 1,
        'last_out': 1,
        'totalMin': { $divide: [{ $subtract: ["$last_out", "$last_in"] }, 60 * 1000] },
        createdAt: 1
      }
    },
    { "$match": { _id: driverId } },
    { "$sort": sortQuery },
    { "$skip": pageQuery.skip },
    { "$limit": pageQuery.take },
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

/**
 *  All Driver Earnings
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const driverEarnings = async (req, res) => {
  //Match, sort, filter by No, limit, search, xtotal 
  /*     var likeQuery = HelperFunc.likeQueryBuilder(req.query); 
      var pageQuery = HelperFunc.paginationBuilder(req.query); 
      var totalCount = 10;  
      DriverPayment.aggregate([  
        {
          "$group"  : {
            "_id": '$driver',   
            "dvrfname": { $addToSet: "$dvrfname"  } ,   
            "count": {$sum: 1},  
          },  
        },   
        ], function (err, result) {
          if (err) { } else {
            totalCount = result.length; 
          }
        }); 
  
      DriverPayment.aggregate([  
          {
            "$group"  : {
              "_id": '$driver',   
              "dvrfname": { $addToSet: "$dvrfname"  } ,   
              "count": {$sum: 1}, 
              "commision": { $sum: "$commision" },  
              "inhand": { $sum: "$inhand" }, 
              "digital": { $sum: "$digital" }, 
              "toSettle": { $sum: "$toSettle" } 
            },  
          },  
  
          { $project : 
           {
             _id:1,
             dvrfname:1,
             count:1,
             commision : mround ('$commision', 2),
             inhand: mround ('$inhand', 2),  
             digital: mround ('$digital', 2),   
             toSettle: mround ('$toSettle', 2)  
               // count:{$cond:[{ $ne: ["$PlnSls", 0] },{$multiply:[{$divide: ['$ActSls', '$PlnSls']},100]},0]}
             }
  
           },
  
           {"$skip": pageQuery.skip},
           {"$limit": pageQuery.take},
           ], function (err, result) {
            if (err) {
              res.json(err); 
            } else {
              res.header('x-total-count',  totalCount );  
              res.json(result);
            }
          });   */
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);


  let TotCnt = DriverPayment.aggregate([
    {
      "$group": {
        "_id": '$driver',
        "dvrfname": { $addToSet: "$dvrfname" },
        "count": { $sum: 1 },
      },
    },
  ]);
  let Datas = DriverPayment.aggregate([
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$group": {
        "_id": '$driver',
        "dvrfname": { $addToSet: "$dvrfname" },
        "count": { $sum: 1 },
        "commision": { $sum: "$commision" },
        "inhand": { $sum: "$inhand" },
        "digital": { $sum: "$digital" },
        "toSettle": { $sum: "$toSettle" },
        "code": { $addToSet: "$userinfo.code" },
        // "fname":{ $addToSet: "$userinfo.fname"} 
      },
    },
    //{ $match:likeQuery},
    {
      $project:
      {
        _id: 1,
        dvrfname: 1,
        count: 1,
        commision: mround('$commision', 2),
        inhand: mround('$inhand', 2),
        digital: mround('$digital', 2),
        toSettle: mround('$toSettle', 2),
        code: 1,
        // fname:1  
        // count:{$cond:[{ $ne: ["$PlnSls", 0] },{$multiply:[{$divide: ['$ActSls', '$PlnSls']},100]},0]}
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    { "$skip": pageQuery.skip },
    { "$limit": pageQuery.take },
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}
/*   const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;
export const test = (req,res) =>{
  Trips.find().limit(2).exec((err,data)=>{
   if(err) {}


   })
  })
} */


export const packagePurchaseHistory = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  if (_.isEmpty(dateLikeQuery)) {
    var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery =
      {
        createdAt:
        {
          '$gte': fromDate,
          '$lte': toDate
        }
      }
  };
  let TotCnt = DriverPackage.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "driverId",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      $project:
      {
        _id: 1,
        driverName: 1,
        code: "$userinfo.code",
        scity: "$userinfo.scity",
        scId: "$userinfo.scId",
        packageName: 1,
      }
    },
    { "$match": likeQuery }
  ]);

  let Datas = DriverPackage.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "driverId",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      $project:
      {
        _id: 1,
        driverName: 1,
        code: "$userinfo.code",
        scity: "$userinfo.scity",
        scId: "$userinfo.scId",
        packageId: 1,
        packageName: 1,
        amount: 1,
        type: 1,
        credit: 1,
        purchaseDate: 1,
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    skip,
    limit,
  ]);


  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}


export const deliveryReport = async (req, res) => {
  if (req.query._sort == "" || typeof req.query._sort == "undefined") {
    req.query._sort = "createdAt"
  }

  if (req.query._order == "" || typeof req.query._order == "undefined") {
    req.query._order = "ASC"
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery = HelperFunc.findQueryBuilder(req.query, likeQuery);
  likeQuery['vehicleFor'] = 'delivery';
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.query.requestFrom == "without_limit") {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.aggregate(
    [
      {
        "$lookup": {
          "localField": "dvrid",
          "from": "drivers",
          "foreignField": "_id",
          "as": "userinfo"
        }
      },
      {
        $unwind: {
          path: "$userinfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project:
        {
          "_id": 1,
          "date": 1,
          "tripno": 1,
          "cpy": 1,
          "cpyid": 1,
          "dvr": 1,
          "rid": 1,
          "ridid": 1,
          "taxi": 1,
          "service": 1,
          "estTime": 1,
          "__v": 1,
          "dvrid": 1,
          "tripFDT": 1,
          "utc": 1,
          "tripDT": 1,
          "driverfb": 1,
          "riderfb": 1,
          "needClear": 1,
          "curReq": 1,
          "reqDvr": 1,
          "review": 1,
          "status": 1,
          "adsp": 1,
          "acsp": 1,
          "dsp": 1,
          "csp": 1,
          "paymentSts": 1,
          "triptype": 1,
          "createdAt": 1,
          code: "$userinfo.code",
          vehicleFor: 1,
          deliverydetails: 1,
          delivery: 1
        }
      },
      {
        "$match": likeQuery
      },
      {
        "$sort": sortQuery
      },
      skip,
      limit
    ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}

export const deliveryTrip = async (req, res) => {
  if (req.query._sort == "" || typeof req.query._sort == "undefined") {
    req.query._sort = "createdAt"
  }

  if (req.query._order == "" || typeof req.query._order == "undefined") {
    req.query._order = "DESC"
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  likeQuery = HelperFunc.findQueryBuilder(req.query, likeQuery);
  likeQuery['vehicleFor'] = 'delivery';

  let TotCnt = Trips.find(likeQuery).count();

  let Datas = Trips.aggregate(
    [
      {
        "$lookup": {
          "localField": "dvrid",
          "from": "drivers",
          "foreignField": "_id",
          "as": "userinfo"
        }
      },
      {
        $unwind: {
          path: "$userinfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project:
        {
          "_id": 1,
          "date": 1,
          "tripno": 1,
          "cpy": 1,
          "cpyid": 1,
          "dvr": 1,
          "rid": 1,
          "ridid": 1,
          "taxi": 1,
          "service": 1,
          "estTime": 1,
          "__v": 1,
          "dvrid": 1,
          "tripFDT": 1,
          "utc": 1,
          "tripDT": 1,
          "driverfb": 1,
          "riderfb": 1,
          "needClear": 1,
          "curReq": 1,
          "reqDvr": 1,
          "review": 1,
          "status": 1,
          "adsp": 1,
          "acsp": 1,
          "dsp": 1,
          "csp": 1,
          "paymentSts": 1,
          "triptype": 1,
          "createdAt": 1,
          code: "$userinfo.code",
          vehicleFor: 1,
          deliverydetails: 1,
          delivery: 1,
          vehicle: 1
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
    return res.json([err]);
  }
}

export const perDayOnlineReport = async (req, res) => {
  if (req.query._sort == "" || typeof req.query._sort == "undefined") {
    req.query._sort = "createdAt"
  }

  if (req.query._order == "" || typeof req.query._order == "undefined") {
    req.query._order = "DESC"
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  var todayDate = new Date(moment(req.query.date, 'YYYY-MM-DD').format('YYYY-MM-DDT00:00:00.000[Z]'))
  likeQuery['softdel'] = "active"
  let TotCnt = Driver.find(likeQuery).count();
  let Datas = Driver.aggregate([
    {
      "$match": likeQuery
    },
    {
      "$lookup": {
        "localField": "_id",
        "from": "driverperdays",
        "foreignField": "driver",
        "as": "userinfo"
      }
    },
    {
      "$sort": {
        code: -1
      }
    },
    skip,
    limit,
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    var data = _.map(resstr, (el) => {
      if (el.userinfo.length) {
        var result = _.filter(el.userinfo, { date: todayDate })
        if (result.length) {
          result[0].onlineHours = Math.round(result[0].onlineHours);
          result[0].offlineHours = Math.round(result[0].offlineHours);
        }
        el.userinfo = result
      }
      return el
    })
    res.send(data);
  } catch (err) {
    return res.json([err]);
  }
}

export const driverOnlineStatusReport = async (req, res) => {
  if (req.query._sort == "" || typeof req.query._sort == "undefined") {
    req.query._sort = "createdAt"
  }

  if (req.query._order == "" || typeof req.query._order == "undefined") {
    req.query._order = "DESC"
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  // if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (_.isEmpty(dateLikeQuery)) {
    var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery =
      {
        date:
        {
          '$gte': fromDate,
          '$lte': toDate
        }
      }
  };
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  dateLikeQuery['driver'] = mongoose.Types.ObjectId(req.params.id);
  dateLikeQuery.date.$lte = new Date(moment(dateLikeQuery.date.$lte).subtract(1, "days").format("YYYY-MM-DDT00:00:00.000[Z]"));

  // let TotCnt = DriverPerDay.find(dateLikeQuery).count();
  let TotCnt = DriverPerDay.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      $project:
      {
        'scId': '$userinfo.scId',
        'scity': '$userinfo.scity',
      }
    },
    { "$match": likeQuery },
  ]);
  // let Datas = DriverPerDay.find(likeQuery).sort(sortQuery).skip(pageQuery.skip).limit(pageQuery.take);
  let Datas = DriverPerDay.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      $project:
      {
        "driverId": "$userinfo._id",
        "driverName": "$userinfo.fname",
        "driverCode": "$userinfo.code",
        "_id": '$_id',
        "cancelledAmount": '$cancelledAmount',
        "nooftripsCancelled": '$nooftripsCancelled',
        "date": '$date',
        "adminCommision": '$adminCommision',
        "earned": '$earned',
        "lastOFF": '$lastOFF',
        "lastON": "$lastON",
        "offlineHours": '$offlineHours',
        "offlineLable": "$offlineLable",
        "online": '$online',
        "onlineLable": "$onlineLable",
        "onlineHours": '$onlineHours',
        "nooftrips": '$nooftrips',
        'scId': '$userinfo.scId',
        'scity': '$userinfo.scity',
        "createdAt": "$createdAt"
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    skip,
    limit,
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}

/*export const discountCreditReport = async (req, res) => {
  if (req.query._sort == "" || typeof req.query._sort == "undefined") {
    req.query._sort = "createdAt"
  }

  if (req.query._order == "" || typeof req.query._order == "undefined") {
    req.query._order = "DESC"
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  if (_.isEmpty(dateLikeQuery)) {
    var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery =
      {
        createdAt:
        {
          '$gte': fromDate,
          '$lte': toDate
        }
      }
  };
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }

  if (req.params.id) dateLikeQuery['driver'] = mongoose.Types.ObjectId(req.params.id);

  let TotCnt = DriverPayment.find(dateLikeQuery).count();
  let Datas = DriverPayment.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      $project: {
        date: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
        tripno: 1,
        amttodriver: 1,
        toSettle: 1,
        promoamt: 1,
        inhand: 1,
        commision: 1,
        // userinfo: 1,
        dvrName: '$userinfo.fname',
        dvrCode: '$userinfo.code',
        dvrPhone: '$userinfo.phone'
      }
    },
    { "$sort": sortQuery },
    skip,
    limit,
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}*/

export const discountCreditReport = async (req, res) => {
  if (req.query._sort == "" || typeof req.query._sort == "undefined") {
    req.query._sort = "createdAt"
  }

  if (req.query._order == "" || typeof req.query._order == "undefined") {
    req.query._order = "DESC"
  }
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };
  if (_.isEmpty(dateLikeQuery)) {
    var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery =
      {
        tripFDT:
        {
          '$gte': fromDate,
          '$lte': toDate
        }
      }
  };
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  dateLikeQuery['csp.promo'] = { $ne: "" }
  dateLikeQuery['status'] = "Finished"

  if (req.params.id) dateLikeQuery['dvrid'] = mongoose.Types.ObjectId(req.params.id);

  let TotCnt = Trips.find(dateLikeQuery).count();
  let Datas = Trips.aggregate([
    { "$match": dateLikeQuery },
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
      $project: {
        date: { $dateToString: { format: "%d-%m-%Y", date: "$tripFDT" } },
        tripno: 1,
        distFare: '$csp.distfare',
        commision: '$csp.comison',
        FareBeforeDiscount: '$acsp.distfare',
        promoAmt: '$csp.promoamt',
        promoCode: '$csp.promo',
        FinalCost: '$fare',
        dvrName: '$userinfo.fname',
        dvrCode: '$userinfo.code',
        dvrPhone: '$userinfo.phone',
        dvrId: '$userinfo._id'
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    skip,
    limit,
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    var result = _.map(resstr, (el) => {
      var commissionPer = (el.commision * 100) / el.distFare
      var commisionAmt = el.FinalCost * (commissionPer / 100);
      var amtToDriver = el.FareBeforeDiscount - commisionAmt
      var commisionAfterDiscount = commisionAmt;
      if (amtToDriver > el.FinalCost) commisionAfterDiscount = commisionAmt - el.promoAmt
      return {
        date: el.date,
        tripno: el.tripno,
        promoAmt: el.promoAmt,
        promoCode: el.promoCode,
        FareBeforeDiscount: el.FareBeforeDiscount,
        commisionBeforeDiscount: (commisionAmt).toFixed(1),
        amtToDriver: (amtToDriver).toFixed(2),
        FinalCost: el.FinalCost,
        commisionAfterDiscount: (commisionAfterDiscount).toFixed(1),
        dvrName: el.dvrName,
        dvrCode: el.dvrCode,
        dvrPhone: el.dvrPhone,
        dvrId: el.dvrId
      }
    })
    res.send(result);
  } catch (err) {
    return res.json([err]);
  }
}

//Reports of Driver (ie) No.Of trips accepted,declined or No response 
export const driverTripStatusReport = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  if (req.cityWise == 'exists') dateLikeQuery['scId'] = { "$in": req.scId };
  if (req.query['scity_like'] != undefined) dateLikeQuery['scity'] = req.query['scity_like'];
  if (req.type == 'company') dateLikeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);

  if (_.isEmpty(dateLikeQuery)) {
    var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery =
      {
        tripFDT:
        {
          '$gte': fromDate,
          '$lte': toDate
        }
      }
  };

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  // let TotCnt = Trips.find(likeQuery).count();
  dateLikeQuery['reqDvr'] = { $gt: [] }
  let Datas = Trips.aggregate(
    [
      { "$match": dateLikeQuery },

      {
        $project:
        {
          tripId: "$_id",
          _id: 0,
          yearMonthDayUTC: { $dateToString: { format: "%d-%m-%Y", date: "$tripFDT" } },
          reqDvr: 1
        }
      },
      { $unwind: '$reqDvr' },
      {
        "$group":
        {
          _id: { yearMonthDayUTC: "$yearMonthDayUTC", driverId: "$reqDvr.drvId", 'status': "$reqDvr.called" },
          "tripCount": { "$sum": 1 }
        }
      },
      {
        "$lookup": {
          "localField": "_id.driverId",
          "from": "drivers",
          "foreignField": "_id",
          "as": "userinfo"
        }
      },
      { $unwind: '$userinfo' },
      {
        $project:
        {
          _id: 0,
          dvrId: '$userinfo._id',
          dvrName: '$userinfo.fname',
          dvrCOde: '$userinfo.code',
          dvrPhone: '$userinfo.phone',
          date: "$_id.yearMonthDayUTC",
          sortDate: { $toDate: "$_id.yearMonthDayUTC" },
          "noresponse": { $cond: { if: { $eq: ["$_id.status", 1] }, then: "$tripCount", else: 0 } },
          "declined": { $cond: { if: { $eq: ["$_id.status", 2] }, then: "$tripCount", else: 0 } },
          "accepted": { $cond: { if: { $eq: ["$_id.status", 3] }, then: "$tripCount", else: 0 } },
        }
      },

      {
        "$group":
        {
          _id: "$date",
          dvrId: { $first: "$dvrId" },
          dvrName: { $first: '$dvrName' },
          dvrCOde: { $first: '$dvrCOde' },
          dvrPhone: { $first: '$dvrPhone' },
          "noresponse": { "$sum": "$noresponse" },
          "declined": { "$sum": "$declined" },
          "accepted": { "$sum": "$accepted" },
          "sortDate": { $first: "$sortDate" },
        }
      },
      {
        "$sort": {
          sortDate: 1
        }
      },

      // sortQuery,
      // skip,
      // limit,
    ]);
  try {
    var promises = await Promise.all([Datas]);
    // res.header('x-total-count', promises[0]);
    var resstr = promises[0];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const subscriptionReport = async (req, res) => {
  //type="subcription",packageId
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (_.isEmpty(dateLikeQuery)) {
    // var fromDate = new Date(GFunctions.getCommonMonthStartDate());
    var toDate = new Date(GFunctions.getISODate());
    dateLikeQuery =
      {
        endDate:
        {
          '$gte': toDate,
          '$lte': toDate
        }
      }
  };
  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  };
  var TotCnt = DriverSubscription.aggregate([
    { "$match": dateLikeQuery },

    {
      "$lookup": {
        "localField": "packageId",
        "from": "paypackages",
        "foreignField": "_id",
        "as": "paypackageinfo"
      }
    },
    { "$unwind": "$paypackageinfo" },
    {
      "$match": {
        "paypackageinfo.type": "subscription"
      }
    },
    {
      "$project": {
        "isSubcriptionActive": "$driverInfo.isSubcriptionActive"
      }
    },
    { "$match": likeQuery },
  ])

  var Datas = DriverSubscription.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "packageId",
        "from": "paypackages",
        "foreignField": "_id",
        "as": "paypackageinfo"
      }
    },
    { "$unwind": "$paypackageinfo" },
    {
      "$lookup": {
        "localField": "driverId",
        "from": "drivers",
        "foreignField": "_id",
        "as": "driverInfo"
      }
    },
    { "$unwind": "$driverInfo" },
    {
      "$match": {
        "paypackageinfo.type": "subscription"
      }
    },
    {
      "$project": {
        "code": "$driverInfo.code",
        "isSubcriptionActive": "$driverInfo.isSubcriptionActive",
        "driverId": 1,
        "driverName": 1,
        "paypackageinfo": 1, //Full path 
        "packageName": 1,
        "amount": 1,
        "credit": 1,
        "type": 1,
        "startDate": 1,
        "purchaseDate": 1,
        "endDate": 1
      }
    },
    { "$match": likeQuery },
    { "$sort": { "_id": 1 } },
    skip,
    limit
  ])
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}

export const distanceTravelledReport = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.query.scity_like != undefined) dateLikeQuery['scity'] = { "$eq": req.query.scity_like };
  if (req.type == 'company') dateLikeQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
  if (req.type == 'company') likeQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  let TotCnt = DriverPayment.aggregate([
    { "$match": dateLikeQuery },
    {
      "$group": {
        "_id": '$driver',
        "dvrfname": { $addToSet: "$dvrfname" },
        "count": { $sum: 1 },
      },
    },
    { "$match": likeQuery },
  ]);

  let Datas = DriverPayment.aggregate([
    { "$match": dateLikeQuery },
    {
      "$lookup": {
        "localField": "driver",
        "from": "drivers",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$group": {
        "_id": '$driver',
        "dvrfname": { $addfirstToSet: "$dvrfname" },
        "count": { $sum: 1 },
        "commision": { $sum: "$commision" },
        "inhand": { $sum: "$inhand" },
        "digital": { $sum: "$digital" },
        "toSettle": { $sum: "$toSettle" },
        "code": { $first: "$userinfo.code" },
        "referenceCode": { $first: "$userinfo.referenceCode" },
        "scity": { $first: "$userinfo.scity" },
        "scId": { $first: "$userinfo.scId" },
        "cmpy": { $first: "$userinfo.cmpy" },
        "cntyname": { $first: "$cntyname" },
        "amttodriver": { $sum: "$amttodriver" },
        "totalDistTravelled": { '$sum': "$totalDistTravelled" }
      },
    }, //{ $unwind: "$scity" }, { $unwind: "$scId" },
    {
      $project:
      {
        _id: 1,
        dvrfname: 1,
        count: 1,
        commision: mround('$commision', 2),
        inhand: mround('$inhand', 2),
        digital: mround('$digital', 2),
        toSettle: mround('$toSettle', 2),
        amttodriver: mround('$amttodriver', 2),
        code: 1,
        referenceCode: 1,
        scity: 1,
        scId: 1,
        cmpy: 1,
        totalDistTravelled: mround('$totalDistTravelled', 2)
      }
    },
    { "$match": likeQuery },
    {
      "$sort": {
        'code': -1
      }
    },
    skip,
    limit,
  ]);
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

export const walletRechargReport = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  //if(req.type == 'company') likeQuery['cmpy'] = {"$in":req.userId};
  // if(req.query['scity_like']!=undefined)likeQuery['scity']= req.query['scity_like'] ; 

  // var sort = req.query._sort;
  // if ((typeof sort).toString() == "undefined") {
  //   sortQuery['_id'] = 1;
  //   return sortQuery;
  // }

  var skip = { "$skip": pageQuery.skip },
    limit = { "$limit": pageQuery.take };

  if (req.query.requestFrom == 'without_limit') {
    skip = { "$match": {} }
    limit = { "$match": {} }
  }
  likeQuery['trx.for'] = { '$in': ["Wallet Recharge"] };

  // let TotCnt = Wallet.find(likeQuery).count();
  let TotCnt = Wallet.aggregate([
    { "$match": likeQuery },
    {
      "$lookup": {
        "localField": "ridid",
        "from": "riders",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "bal": 1,
        "fname": "$userinfo.fname",
        "phone": "$userinfo.phone",
        "scId": "$userinfo.scId",
        "scity": "$userinfo.scity"
      }
    },
    { "$match": likeQuery },
  ]);

  let Datas = Wallet.aggregate([
    { "$match": likeQuery },
    {
      "$lookup": {
        "localField": "ridid",
        "from": "riders",
        "foreignField": "_id",
        "as": "userinfo"
      }
    },
    { "$unwind": "$userinfo" },
    {
      "$project": {
        "bal": 1,
        "trx": 1,
        "fname": "$userinfo.fname",
        "riderId": "$userinfo._id",
        "phone": "$userinfo.phone",
        "scId": "$userinfo.scId",
        "scity": "$userinfo.scity"
      }
    },
    { "$match": likeQuery },
    { "$sort": sortQuery },
    skip,
    limit
  ]);

  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0].length);
    var resstr = promises[1];
    resstr = await Promise.all(_.map(resstr, (el) => {
      el.trx = _.map(el.trx, (el1) => {
        if (el1.for == "Wallet Recharge") return el1;
        else { }
      })
      return el;
    }))
    res.send(resstr);
  } catch (err) {
    return res.json([err]);
  }
}