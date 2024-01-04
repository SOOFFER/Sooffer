// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
import path from 'path';
import * as HelperFunc from './adminfunctions';
const url = require('url');
import * as GFunctions from './functions';
const _ = require('lodash');

//import models
import Promo from '../models/promo.model';

export const addData = async (req, res) => {
  var data = await Promo.findOne({ 'code': req.body.code, end: { $gte: new Date(GFunctions.getISOTodayDate()) } });
  if (data) {
    return res.status(200).json({ 'success': false, 'message': req.i18n.__('PROMOCODE_ALREADY_EXISTS') });
  }
  else {
    if ((req.body.days).length) req.body.days = _.toString(req.body.days);
    var newDoc = new Promo();
    newDoc.code = req.body.code;
    newDoc.start = req.body.start;
    newDoc.end = req.body.end;
    newDoc.noofuse = req.body.noofuse;
    newDoc.amount = req.body.amount;
    newDoc.days = req.body.days;
    newDoc.startTime = GFunctions.getFormatTime(req.body.startTime);
    newDoc.endTime = GFunctions.getFormatTime(req.body.endTime);
    newDoc.forFirst = req.body.forFirst;
    newDoc.scIds = JSON.parse(req.body.scIds);
    newDoc.autoApply = req.body.autoApply;
    newDoc.perUserUsage = req.body.perUserUsage;
    newDoc.tripType = req.body.tripType;
    newDoc.amountType = req.body.amountType;
    newDoc.percentage = req.body.percentage;
    newDoc.percentageAmountLimit = req.body.percentageAmountLimit;

    newDoc.save((err, datas) => {
      if (err) {
        return res.json({ 'success': false, 'message': err.message, 'err': err });
      } else {
        return res.status(200).json({ 'success': true, 'message': req.i18n.__('PROMOCODE_SUCCESS') });
      }

    })
  }
}


export const getData = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var sortQuery = HelperFunc.sortQueryBuilder(req.query);
  sortQuery['_id'] = -1;

  var totalCount = 10;
  if (req.cityWise == 'exists') likeQuery['scIds.scId'] = { "$in": req.scId };

  if (req.query["scIds.name_like"] != undefined) likeQuery['scIds.name'] = req.query["scIds.name_like"];
  Promo.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });
  Promo.find(likeQuery).sort(sortQuery).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}

/**
 * Update Admin Profile Details 
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const updateData = async (req, res) => {
  Promo.findOne({ _id: req.body._id }).exec((err, doc) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    if (!doc) return res.json({ 'success': false, 'message': req.i18n.__('DATA_NOT_FOUND') });
    if ((req.body.days).length) req.body.days = _.toString(req.body.days);
    doc.start = req.body.start;
    doc.end = req.body.end;
    doc.noofuse = req.body.noofuse;
    doc.amount = req.body.amount;
    doc.days = req.body.days;
    doc.startTime = GFunctions.getFormatTime(req.body.startTime);
    doc.endTime = GFunctions.getFormatTime(req.body.endTime);
    doc.forFirst = req.body.forFirst;
    doc.autoApply = req.body.autoApply;
    doc.perUserUsage = req.body.perUserUsage;
    doc.tripType = req.body.tripType;
    doc.amountType = req.body.amountType;
    doc.percentage = req.body.percentage;
    doc.percentageAmountLimit = req.body.percentageAmountLimit;

    let oldScIds = JSON.parse(req.body.oldScIds);
    var scIds = req.body.scIds;
    scIds = JSON.parse(scIds);

    var result = _.xorBy(oldScIds, scIds, 'scId');

    var oldValues = []; var newValues = [];
    _.forEach(result, function (value, key) {
      let isExist = _.has(value, '_id')
      if (isExist) {
        oldValues.push(value);
      } else {
        newValues.push(value);
      }
    })

    _.forEach(oldValues, function (element, i) {
      doc.scIds.pull({ '_id': element._id });
    });

    _.forEach(newValues, function (element, i) {
      doc.scIds.push(element);
    });

    doc.save(function (err, op) {
      if (err) { return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
      return res.json({ 'success': true, 'message': req.i18n.__('DETAILS_UPDATE_SUCCESS'), op });
    });
  })
};


/**
 * Delete Admin Profile  
 * @input  
 * @param 
 * @return 
 * @response  
 */

export const deleteData = (req, res) => {
  Promo.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR') });
    }
    return res.json({ 'success': true, 'message': req.i18n.__('DELETED_SUCCESS'), docs });
  })
};

/**
 * updatePromoCodeUsedLog
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const updatePromoCodeUsedLogctrl = (promo, tripId, ridid) => {

  Promo.findOne({ code: promo }, function (err, docs) {
    if (err) {
    } else if (!docs) { }
    else {
      let oldbal = docs.used;
      let newbal = (parseFloat(oldbal) + 1);
      docs.used = newbal;

      let users = [];
      users = docs.users;
      users.push(ridid);

      docs.save(function (err, op) {
        if (err) {
        }
        else {

        }

      })
    }
  });

};

export const updatePromoCodeNumUsedLogctrl = async (req, res) => {
  let promo = req.params.id;
  var detail = await Promo.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(promo) }
    }, { '$unwind': '$users' }, { $project: { _id: 0 } },
    {
      $lookup: {
        from: 'riders',
        let: { user: { $toObjectId: "$users" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$user'] },
                ]
              }
            }
          }, {
            $project: {
              _id: 0,
              "rideId": '$_id',
              "firstName": '$fname',
              "lastName": '$lname',
              "phone": '$phone'
            }
          }
        ],
        as: 'users'
      }
    }, { '$unwind': '$users' },
    // {
    //   $project: {
    //     noofuse: 1,
    //     users: 1
    //   }
    // },
    {
      $group: {
        _id: '$users',
        user: { $addToSet: '$users' },
        count: { $sum: 1 },
      }
    }, { '$unwind': '$user' },
    {
      $project: {
        _id: '$_id.rideId',
        firstName: '$user.firstName',
        lastName: '$user.lastName',
        phone: '$user.phone',
        count: 1
      }
    }
  ])
  // var a = [], det
  // detail.forEach(element => {
  //   a.push(element.users)
  //   det = {
  //     UsageLimt: element.noofuse,
  //     noofUsersUsed: a.length,
  //     users: a
  //   }
  // });
  var noOfUserUsed = _.sumBy(detail, 'count')
  return res.json({ success: true, message: 'Promocode Users', data: detail, noOfUserUsed: noOfUserUsed })
}