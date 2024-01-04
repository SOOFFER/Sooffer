import mongoose from 'mongoose';
import * as HelperFunc from './adminfunctions';
import DriverPayment from '../models/driverpayment.model';
import Driver from '../models/driver.model';
import Rider from '../models/rider.model';

//import models
import Trips from '../models/trips.model';
import * as TripHelpers from './tripHelper';
import * as GFunctions from './functions';
import { debitDriverBankTransactions } from './driver';
const _ = require('lodash');
const featuresSettings = require('../featuresSettings');
const moment = require("moment");

export const getTripDetails = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = { "$in": req.userId };
  if (req.query.fare_like != undefined) likeQuery["fare"] = new RegExp(likeQuery["fare"], "i");
  if (req.query.tripno_like != undefined) {
    likeQuery["$where"] = "/" + parseInt(req.query.tripno_like) + "/.test(this.tripno)";
    delete likeQuery["tripno"]
  }
  likeQuery['vehicle'] = { "$ne": "Delivery" }
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  sortQuery['createdAt'] = -1;

  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
  try {

    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

export const getScheduletrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  likeQuery['status'] = { $in: ['accepted', 'noresponse', 'processing'] };
  // likeQuery['status'] = { $in: ['processing'] };
  likeQuery['bookingType'] = "rideLater";
  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  var fromDate = "";
  var toDate = "";
  if (_.isEmpty(dateLikeQuery)) {
    fromDate = GFunctions.getUpcomingSchListMinusBuffer(0);
    likeQuery['tripFDT'] =
      {
        '$gte': fromDate
      }
  }

  let TotCnt = await Trips.find({
    $and: [
      likeQuery,
      // { "bookingType": "rideLater" }
    ]
  }).count();

  if (!sortQuery["tripFDT"]) {
    sortQuery["tripFDT"] = -1;
  }
  //likeQuery['bookingType'] =  { $in: ['rideLater'] };
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid', 'code') //have to catch Err

  // let Datas = Trips.aggregate([
  //   // { "$match": { bookingType: { $in: ['rideLater'] }, status: 'accepted'  } },
  //   {
  //     "$match": {
  //       // $and: [
  //         likeQuery,
  //         // { "bookingType": "rideLater" }
  //       // ]
  //     // }
  //   },
  // {
  //   "$lookup":
  //   {
  //     "localField": "dvrid",
  //     "from": "drivers",
  //     "foreignField": "_id",
  //     "as": "userinfo"
  //   }
  // },
  // {
  //   $unwind:
  //   {
  //     path: "$userinfo",
  //     preserveNullAndEmptyArrays: true
  //   }
  // },
  // {
  //   $project:
  //   {
  //     "_id": 1,
  //     "date": 1,
  //     "tripno": 1,
  //     "cpy": 1,
  //     "cpyid": 1,
  //     "dvr": 1,
  //     "rid": 1,
  //     "ridid": 1,
  //     "taxi": 1,
  //     "service": 1,
  //     "estTime": 1,
  //     "__v": 1,
  //     "dvrid": 1,
  //     "tripFDT": 1,
  //     "utc": 1,
  //     "tripDT": 1,
  //     "driverfb": 1,
  //     "riderfb": 1,
  //     "needClear": 1,
  //     "curReq": 1,
  //     "reqDvr": 1,
  //     "review": 1,
  //     "status": 1,
  //     "adsp": 1,
  //     "acsp": 1,
  //     "package": 1,
  //     "dsp": 1,
  //     "csp": 1,
  //     "paymentSts": 1,
  //     "triptype": 1,
  //     "createdAt": 1,
  //     code: "$userinfo.code"
  //   }
  // },
  // { "$sort": sortQuery },
  // { "$skip": pageQuery.skip },
  // { "$limit": pageQuery.take },
  // ]);


  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}


export const ongoingTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  // likeQuery['status'] = { $nin: ['Finished', 'Cancelled', 'canceled', 'noresponse', 'processing'] };
  likeQuery['status'] = { $in: ['accepted', 'Progress'] };
  if (likeQuery["csp.cost"] != undefined) {
    likeQuery["$where"] = "/" + parseInt(likeQuery["csp.cost"]) + "/.test(this.csp.cost)";
    delete likeQuery["csp.cost"];
  }
  if (req.query.tripno_like != undefined) {
    likeQuery["$where"] = "/" + parseInt(req.query.tripno_like) + "/.test(this.tripno)";
    delete likeQuery["tripno"]
  }
  if (!sortQuery["createdAt"]) {
    sortQuery["createdAt"] = -1;
  }
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid', 'code') //have to catch Err

  // let Datas     = Trips.aggregate([ 
  //   {
  //     "$lookup": {
  //       "localField": "dvrid",
  //       "from": "drivers",
  //       "foreignField": "_id",
  //       "as": "userinfo"
  //     }
  //   },

  //   {
  //     $unwind: {
  //       path: "$userinfo",
  //       preserveNullAndEmptyArrays: true
  //     }
  //   },  

  //   {$project: 
  //        { 
  //         "_id": 1,
  //         "date": 1,
  //         "tripno":1,
  //         "cpy": 1,
  //         "cpyid": 1,
  //         "dvr": 1,
  //         "rid": 1,
  //         "ridid": 1,
  //         "taxi": 1,
  //         "scity":1,
  //         "service": 1,
  //         "estTime": 1,
  //         "__v": 1,
  //         "dvrid": 1,
  //         "tripFDT": 1,
  //         "utc": 1,
  //         "tripDT": 1,
  //         "driverfb":1 ,
  //         "riderfb": 1,
  //         "needClear": 1,
  //         "curReq": 1,
  //         "reqDvr": 1,
  //         "review": 1,
  //         "status": 1,
  //         "adsp": 1,
  //         "acsp": 1,
  //         "dsp":1 ,
  //         "csp":1 ,
  //         "paymentSts":1,
  //         "triptype": 1,
  //         "createdAt": 1,   
  //          code:"$userinfo.code"
  //        }
  //   },
  //   { "$match": likeQuery },
  //   {"$sort"  : sortQuery},
  //   {"$skip"  : pageQuery.skip},
  //   {"$limit" : pageQuery.take},
  // ]); 

  try {

    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}


export const noResponseTrips = async (req, res) => {
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
  // if(req.type == 'company') likeQuery['cpyid'] = {"$in":req.userId};
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  if (req.query.tripno_like != undefined) {
    likeQuery["$where"] = "/" + parseInt(req.query.tripno_like) + "/.test(this.tripno)";
    delete likeQuery["tripno"]
  }
  if (req.query.fare_like != undefined) likeQuery["fare"] = new RegExp(likeQuery["fare"], "i");
  if (req.query.status_like == undefined)
    likeQuery['status'] = { $in: ['noresponse'] };
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid', 'code') //have to catch Err
  if (!sortQuery["createdAt"]) {
    sortQuery["createdAt"] = -1;
  }
  // let Datas = Trips.aggregate([
  //   {
  //     "$lookup": {
  //       "localField": "dvrid",
  //       "from": "drivers",
  //       "foreignField": "_id",
  //       "as": "userinfo"
  //     }
  //   },

  //   {
  //     $unwind: {
  //       path: "$userinfo",
  //       preserveNullAndEmptyArrays: true
  //     }
  //   },

  //   {
  //     $project:
  //     {
  //       "_id": 1,
  //       "date": 1,
  //       "tripno": 1,
  //       "cpy": 1,
  //       "cpyid": 1,
  //       "dvr": 1,
  //       "rid": 1,
  //       "ridid": 1,
  //       "taxi": 1,
  //       "service": 1,
  //       "estTime": 1,
  //       "__v": 1,
  //       "dvrid": 1,
  //       "tripFDT": 1,
  //       "utc": 1,
  //       "scity":1,
  //       "tripDT": 1,
  //       "driverfb": 1,
  //       "riderfb": 1,
  //       "needClear": 1,
  //       "curReq": 1,
  //       "reqDvr": 1,
  //       "review": 1,
  //       "status": 1,
  //       "adsp": 1,
  //       "acsp": 1,
  //       "dsp": 1,
  //       "csp": 1,
  //       "paymentSts": 1,
  //       "triptype": 1,
  //       "createdAt": 1,
  //       code: "$userinfo.code"
  //     }
  //   },
  //   { "$match": likeQuery },
  //   { "$sort": sortQuery },
  //   { "$skip": pageQuery.skip },
  //   { "$limit": pageQuery.take },
  // ]);

  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

export const pendingRequest = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = { "$in": req.userId };
  likeQuery['status'] = { $in: ['noresponse'] };
  // likeQuery['tripFDT'] = { "$gte": new Date().toISOString() };

  if (!sortQuery["tripFDT"]) {
    sortQuery["tripFDT"] = -1;
  }

  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  var fromDate = "";
  var toDate = "";
  if (_.isEmpty(dateLikeQuery)) {
    // fromDate = GFunctions.getCommonMonthStartDate();
    // toDate = GFunctions.getISODateADayBuffer();
    fromDate = GFunctions.getUpcomingSchListHalfMinusBuffer(15);
    likeQuery['tripFDT'] =
      {
        '$gte': fromDate,
        // '$lte': toDate
      }
  } else {
    fromDate = dateLikeQuery.tripFDT.$gte;
    // toDate = dateLikeQuery.tripFDT.$lte;
    toDate = moment(req.query.tripFDT_lte).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    likeQuery['tripFDT'] =
      {
        '$gte': fromDate,
        '$lte': toDate
      }
    // likeQuery = Object.assign(dateLikeQuery, likeQuery);
  }
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    return res.status(200).json({ 'success': true, 'data': resstr, 'fromDate': fromDate, 'toDate': toDate });
    // res.send(resstr);
  } catch (err) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
  }
}

export const recentMTDRequest = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = { "$in": req.userId };
  likeQuery['status'] = { $in: ['noresponse', 'processing'] };
  // likeQuery['requestFrom'] = { $in: ['admin'] };
  // likeQuery['tripFDT'] = { "$gte": new Date().toISOString() };

  if (!sortQuery["tripFDT"]) {
    sortQuery["tripFDT"] = -1;
  }

  var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
  var fromDate = "";
  var toDate = "";
  if (_.isEmpty(dateLikeQuery)) {
    fromDate = GFunctions.getUpcomingSchListHalfMinusBuffer();
    toDate = GFunctions.getUpcomingSchListBuffer();
    likeQuery['tripFDT'] =
      {
        '$gte': fromDate,
        '$lte': toDate
      }
  } else {
    fromDate = dateLikeQuery.tripFDT.$gte;
    toDate = dateLikeQuery.tripFDT.$lte;
    likeQuery = Object.assign(dateLikeQuery, likeQuery);
  }
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    return res.status(200).json({ 'success': true, 'data': resstr, 'fromDate': fromDate, 'toDate': toDate });
    // res.send(resstr);
  } catch (err) {
    return res.status(409).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
  }
}

export const upcomingTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);

  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = { "$in": req.userId };
  if (req.query.tripno_like != undefined) {
    likeQuery["$where"] = "/" + parseInt(req.query.tripno_like) + "/.test(this.tripno)";
    delete likeQuery["tripno"]
  }
  if (req.query.fare_like != undefined) likeQuery["fare"] = new RegExp(likeQuery["fare"], "i");
  if (req.query.status_like == undefined)
    likeQuery['status'] = { $in: ['accepted', 'noresponse', 'processing'] };
    // likeQuery['status'] = { $in: ['accepted'] };
  likeQuery['tripFDT'] = { "$gte": GFunctions.getUpcomingSchListMinusBuffer() };

  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }

}

export const pastTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  if (req.query.tripno_like != undefined) {
    likeQuery["$where"] = "/" + parseInt(req.query.tripno_like) + "/.test(this.tripno)";
    delete likeQuery["tripno"]
  }
  if (req.query.fare_like != undefined) likeQuery["fare"] = new RegExp(likeQuery["fare"], "i");
  likeQuery['status'] = 'Finished';
  if (!sortQuery["createdAt"]) {
    sortQuery["createdAt"] = -1;
  }
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery)  //have to catch Err
  // let Datas = Trips.aggregate([
  //   {
  //     "$lookup": {
  //       "localField": "dvrid",
  //       "from": "drivers",
  //       "foreignField": "_id",
  //       "as": "userinfo"
  //     }
  //   },
  //   {
  //     $unwind: {
  //       path: "$userinfo",
  //       preserveNullAndEmptyArrays: true
  //     }
  //   },
  //   {
  //     $project:
  //     {
  //       "_id": 1,
  //       "date": 1,
  //       "tripno": 1,
  //       "cpy": 1,
  //       "cpyid": 1,
  //       "dvr": 1,
  //       "rid": 1,
  //       "ridid": 1,
  //       "taxi": 1,
  //       "service": 1,
  //       "estTime": 1,
  //       "__v": 1,
  //       "dvrid": 1,
  //       "tripFDT": 1,
  //       "utc": 1,
  //       "scity": 1,
  //       "tripDT": 1,
  //       "driverfb": 1,
  //       "riderfb": 1,
  //       "needClear": 1,
  //       "curReq": 1,
  //       "reqDvr": 1,
  //       "review": 1,
  //       "status": 1,
  //       "adsp": 1,
  //       "acsp": 1,
  //       "dsp": 1,
  //       "csp": 1,
  //       "paymentSts": 1,
  //       "triptype": 1,
  //       "createdAt": 1,
  //       code: "$userinfo.code"
  //     }
  //   },
  //   // { "$match": { "tripDT": { "$lt": new Date().toISOString() } } },
  //   { "$match": likeQuery },
  //   { "$sort": sortQuery },
  //   { "$skip": pageQuery.skip },
  //   { "$limit": pageQuery.take },
  // ]);

  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json(err);
  }

}

export const getATripDetails = (req, res) => {
  Trips.find({ _id: req.params.id }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    if (docs.length) {
      return res.json(docs);
    }
    else {
      return res.json([]);
    }
  })
}

export const getATripDetailsForDetailView = (req, res) => {
  Trips.find({ _id: req.params.id }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    if (docs.length) {
      return res.json(docs);
    }
    else {
      return res.json([]);
    }
  })
}

/**
 * Delete Trip Details 
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const deleteATripDetails = (req, res) => {
  Trips.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR') });
    }
    return res.json({ 'success': true, 'message': req.i18n.__('DELETED_SUCCESS') });
  })
}


export const updateTripAmount = async (req, res) => {
  try {
    //Get Old Commision
    var DriverPaymentDetails = await DriverPayment.findOne({ tripno: req.body.tripno });
    var oldCommision = DriverPaymentDetails.commision;

    //Old Trip Details
    var TripDetails = await Trips.findOne({ tripno: req.body.tripno });
    var newCommision = TripHelpers.getCommisionAmt(TripDetails.acsp.comison, req.body.newAmount);//Comision Amount 

    //Dif in Commison amount 
    var diffInCommision = parseFloat(newCommision) - parseFloat(oldCommision);
    debitDriverBankTransactions(TripDetails.dvrid, req.body.newAmount, req.body.tripno, diffInCommision);

    //Update Trip Details
    var updateTripData = {
      "acsp.cost": req.body.newAmount,
      "acsp.actualcost": req.body.newAmount,
      "review": 'Fare Updated By Admim'
    }
    let Tripsdocs = await Trips.findOneAndUpdate({ tripno: req.body.tripno }, updateTripData, { new: true });

    //Update DriverPayment / Driver Tranx / IN Firebase
    var updateDriverPaymentData = {
      toSettle: newCommision,
      amttodriver: parseFloat(req.body.newAmount) - parseFloat(newCommision),
      inhand: parseFloat(req.body.newAmount),
      commision: newCommision,
      cashpaid: req.body.newAmount,
      amttopay: req.body.newAmount
    }
    let DriverPaymentdocs = await DriverPayment.findOneAndUpdate({ tripno: req.body.tripno }, updateDriverPaymentData, { new: true });

    return res.json({ 'success': true, 'message': req.i18n.__('TRIP_AMOUNT_UPDATE'), 'Tripsdocs': Tripsdocs });
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
  }
}


export const tripRequestedDrivers = async (req, res) => {
  try {
    var TripDetails = await Trips.find({ _id: req.params.id });
    var reqDrivers = TripDetails[0].reqDvr;
    var reqDriversArray = _.map(reqDrivers, 'drvId');
    var DriverDetails = await Driver.find({ _id: { $in: reqDriversArray } }, { code: 1, fname: 1, phone: 1, curService: 1, curStatus: 1, email: 1, profile: 1 });
    var RiderDetails = await Rider.find({ _id: TripDetails[0].ridid }, { fname: 1, phone: 1, email: 1, profile: 1 });
    return res.json({ 'success': true, 'message': req.i18n.__('TRIP_DETAILS'), 'TripDetails': TripDetails, 'DriverDetails': DriverDetails, 'RiderDetails': RiderDetails });
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
  }
}


export const hailTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = { "$in": req.userId };
  likeQuery['bookingType'] = 'hailRide';
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);

  sortQuery['createdAt'] = -1;

  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}

export const sendTripReceipt = async (req, res) => {
  try {
    if (featuresSettings.fareCalculationType == 'indiaGst') {
      TripHelpers.sendTripGSTReceipt(req.body.tripId, req.body.email); // send Trip Receipt
    } else {
      TripHelpers.sendTripReceipt(req.body.tripId, req.body.email); // send Trip Receipt			
    }
    return res.json({ 'success': true, 'message': req.i18n.__('TRIP_INVOICE_DETAILS_SENT') });
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
  }
}

export const deliveryTripRequest = async (req, res) => {
  try {
    var TripDetails = await Trips.find({ _id: req.params.id });
    var reqDrivers = TripDetails[0].reqDvr;
    var reqDriversArray = _.map(reqDrivers, 'drvId');
    var DriverDetails = await Driver.find({ _id: { $in: reqDriversArray } }, { code: 1, fname: 1, phone: 1, curService: 1, curStatus: 1, email: 1, profile: 1 });
    var RiderDetails = await Rider.find({ _id: TripDetails[0].ridid }, { fname: 1, phone: 1, email: 1, profile: 1 });
    return res.json({ 'success': true, 'message': req.i18n.__('TRIP_DETAILS'), 'TripDetails': TripDetails, 'DriverDetails': DriverDetails, 'RiderDetails': RiderDetails });
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
  }
} 

export const cardPaymentFailedTrips = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
  // likeQuery['status'] = { $nin: ['Finished', 'Cancelled', 'canceled', 'noresponse', 'processing'] };
  likeQuery['cardPaymentSuccess'] = false;
  likeQuery['csp.via'] = "card";
  if (likeQuery["csp.cost"] != undefined) {
    likeQuery["$where"] = "/" + parseInt(likeQuery["csp.cost"]) + "/.test(this.csp.cost)";
    delete likeQuery["csp.cost"];
  }
  if (req.query.tripno_like != undefined) {
    likeQuery["$where"] = "/" + parseInt(req.query.tripno_like) + "/.test(this.tripno)";
    delete likeQuery["tripno"]
  }
  if (!sortQuery["createdAt"]) {
    sortQuery["createdAt"] = -1;
  }
  let TotCnt = Trips.find(likeQuery).count();
  let Datas = Trips.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).populate('dvrid', 'code') //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }
}