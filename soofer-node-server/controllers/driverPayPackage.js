// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
//import models
import PayPackage from '../models/payPackage.model';
import DriverPackage from '../models/driverPackage.model';
import DriverSubscription from '../models/driverSubscription.model';
import Driver from '../models/driver.model';
import DriverWallet from '../models/driverWallet.model';

import * as GFunctions from './functions';
import * as HelperFunc from './adminfunctions';
const config = require('../config');

import * as paymentCtrl from './paymentGateway/index';
import { updateDriverCreditsInFB, debitDriverBankTransactions, updateSubcriptionEndDate, updateDriverSubscriptionInFB, updateSubcriptionDeactivate } from './driver';
import * as driverBank from './driverBank';
var moment = require('moment');
const _ = require('lodash');
const featuresSettings = require('../featuresSettings');

export const addData = (req, res) => {
  // var newDoc = new PayPackage(req.body);
  if (req.body.type == 'subscription') {
    var newDoc = new PayPackage({
      name: req.body.name,
      type: req.body.type,
      amount: req.body.amount,
      PackageValidity: req.body.PackageValidity,
      scIds: req.body.scIds,
      vehicletype: req.body.vehicletype
    })
  }
  else {
    var newDoc = new PayPackage({
      name: req.body.name,
      type: req.body.type,
      amount: req.body.amount,
      credit: req.body.credit,
      scIds: req.body.scIds
    })
  }
  newDoc.save((err, datas) => {
    if (err) {
      return res.json({ 'success': false, 'message': err.message, 'err': err });
    }
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("PACKAGE_CREATED_SUCCESSFULLY"), "datas": datas });
  })
};

export const SubscriptionValidity = async (req, res) => {
  DriverPackage.findById(req.body.id, function (err, doc) {
    if (err) {
      return res.json({ 'success': false, 'message': err.message, 'err': err });
    }
    if (doc.type === "subscription") {
      PayPackage.findOne({ name: doc.packageName }, { _id: 0, name: 1, PackageValidity: 1 }, function (err, docs) {
        if (err) {
          return res.json({ 'success': false, 'message': err.message, 'err': err });
        }
        var fromDate = moment(doc.startDate).format("YYYY-MM-DD");

        var toDate = moment(fromDate).add(docs.PackageValidity, 'M').format('YYYY-MM-DD')

        var curDate = moment().format('YYYY-MM-DD');

        if (toDate == curDate) {
          return res.send("true");
        }
        else {
          return res.send("false");
        }
        //return res.status(200).json({'success':true, 'message':'Package created successfully', "datas" : docs});
      });
    }
  });
}

/**
 * Update PayPackage Details
 * @input
 * @param
 * @return
 * @response
 */
export const updateData = (req, res) => {
      // var updateDoc =
      // {
      //     name: req.body.name,
      //     amount: req.body.amount,
      //     credit: req.body.credit,
      // } */

  PayPackage.findOneAndUpdate({ _id: req.body._id }, req.body/* updateDoc */, { new: true }, (err, todo) => {
    if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), todo });
  });
};

/**
 * Delete PayPackage Details
 * @input
 * @param
 * @return
 * @response
 */
export const deleteData = (req, res) => {
  PayPackage.findByIdAndRemove(req.params.id, (err, docs) => {
    if (err) {
      return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_DELETED_SUCCESSFULLY"), docs });
  })
}

export const getData = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;
  if (req.cityWise == 'exists') likeQuery['scIds.scId'] = { "$in": req.scId };
  if (req.query["scIds.name_like"] != undefined) likeQuery['scIds.name'] = req.query["scIds.name_like"];
  PayPackage.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  PayPackage.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}

export const getinitalPackageDetails = (req, res) => {
  PayPackage.find({ name: 'Initial Credits' }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });

}

export const addDriverPackFromApp = async (req, res) => {
  req.body.driverId = req.userId;
  var packageAmount = 0;
  var packageData = await PayPackage.findOne({ _id: req.body.packageId }).lean().exec();
  if (packageData) packageAmount = packageData.amount;
  var driverData = await Driver.findById(req.body.driverId, { status: 1, softdel: 1, isSubcriptionActive: 1 }).exec();
  if (driverData) {
    if (driverData.status[0].docs != "Accepted") {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("Need admin approval before buying subscription.") });
    }
    if (driverData.softdel != "active") {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("Need account activation by admin before buying subscription.") });
    }
    if (driverData.isSubcriptionActive == true && req.body.type == "subscription") {
      return res.status(409).json({ 'success': false, 'message': driverData.fname + " " + req.i18n.__("DRIVER_ALREADY_SUBSCRIPTION_END_DATE") + " - " + moment(driverData.subcriptionEndDate).format('YYYY-MM-DD') });
    }
  }

  req.body.startDate = GFunctions.getISOTodayDate();
  req.body.type = req.body.type ? req.body.type : "subscription";
  req.body.packageId = req.body.packageId;
  req.body.tranxId = req.body.tranxId;
  req.body.fromApp = true;

  if (req.body.type == "subscription" && req.body.paymentMode == "wallet") {
    if (packageData && driverData) {
      var driverWalletAmt = driverData.wallet;
      if (Number(packageAmount) > Number(driverWalletAmt)) return res.status(409).json({ 'success': false, 'message': req.i18n.__("You don't have sufficient wallet amount to buy subscription.") });
    }
  }

  if (config.paymentGateway.paymentGatewayName == "paystack") {
    var PaymentRes = await paymentCtrl.checkPaymentTransaction(req.body.tranxId);
    if (PaymentRes) { // true if the payment completed with success
      addDriverPack(req, res);
    } else {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("Payment Error") });;
    }
    // addDriverPack(req, res);
  }
  else if (featuresSettings.driverCard && featuresSettings.driverRechargeWalletInClientSide == false && config.paymentGateway.paymentGatewayName == "stripe" && req.body.paymentMode != "wallet") {
    var driverWalletData = await DriverWallet.findOne({ driverId: req.body.driverId }).lean().exec()
    if (!driverWalletData) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("NO_WALLET_FOUND_PLEASE_ADD_CARD_FIRST") });
    }
    if (!driverWalletData.card.id) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("NO_WALLET_FOUND_PLEASE_ADD_CARD_FIRST") });
    }
    var msg = 'Subscription Purchase - ' + driverWalletData._id;
    var PaymentRes = await paymentCtrl.transferAmountNRechargeDriver(res, driverWalletData.card.id, msg, driverWalletData.card.currency, packageAmount, req.body.driverId, driverWalletData._id, driverData);
    if (PaymentRes.success == true) { // true if the payment completed with success
      if (req.body.type == "subscription") addDriverSubscription(req, res)
      else addDriverPack(req, res);

      // return res.status(200).json({ 'success': true, 'message': req.i18n.__("Package Purchased") });;
    } else {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__(PaymentRes.message) });;
    }
  }
  else {
    if (req.body.type == "subscription") {
      addDriverSubscription(req, res);
    } else {
      addDriverPack(req, res);
    }
  }
}

export const addDriverPack = (req, res) => {
  PayPackage.findOne({ _id: req.body.packageId }, {}, function (err, packageData) {
    if (err) { return res.status(500).json({ 'success': false, 'message': err.message, 'err': err }); }
    if (!packageData) {
      return res.status(404).json({ 'success': false, 'message': req.i18n.__("NO_SUCH_PACKAGE_FOUND") });;
    } else {
      var packCredit = packageData.credit;
      Driver.findOne({ _id: req.body.driverId }, { wallet: 1, fname: 1, email: 1, actHolder: 1, actNo: 1, actBank: 1, actLoc: 1, actCode: 1, isSubcriptionActive: 1, subcriptionEndDate: 1 }, function (err, driverData) {
        if (err) { return res.status(500).json({ 'success': false, 'message': err.message, 'err': err }); }
        if (!driverData) {
          return res.status(404).json({ 'success': false, 'message': req.i18n.__("NO_SUCH_DRIVER_FOUND") });;
        } else {

          var driverWallet = driverData.wallet;
          if (driverData.isSubcriptionActive == true && req.body.type == "subscription") {
            return res.status(500).json({ 'success': false, 'message': driverData.fname + " " + req.i18n.__("DRIVER_ALREADY_SUBSCRIPTION_END_DATE") + " - " + moment(driverData.subcriptionEndDate).format('YYYY-MM-DD') });
          }

          if (driverWallet != null && driverWallet != '') {
            var creditValue = Number(driverWallet) + Number(packCredit);
            driverData.wallet = creditValue;
          } else {
            var creditValue = packCredit;
            driverData.wallet = packCredit;
          }
          driverData.save(function (err, op) {
            if (err) { return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }

            // var driverPackageDetails = {
            //   driverId: req.body.driverId,
            //   driverName: driverData.fname ,
            //   packageId: req.body.packageId,
            //   packageName: packageData.name,
            //   amount: packageData.amount,
            //   credit: packageData.credit,
            // }

            // var newDoc = new DriverPackage(driverPackageDetails);
            req.body.type = req.body.type ? req.body.type : packageData.type;
            var paymentDateSort = GFunctions.getISODate();
            var paymentDate = GFunctions.getISODate("D-M-YYYY h:mm a");

            if (req.body.type == "subscription") {
              req.body.vehicletype = req.body.vehicletype ? req.body.vehicletype : packageData.vehicletype;
              var uptoEndDate = GFunctions.getSubcriptionValidityDate(req.body.startDate, packageData.PackageValidity);
              var packageStatus = 'Activated';
              if (driverData.isSubcriptionActive == true && driverData.subcriptionEndDate != null) {
                // req.body.startDate = GFunctions.getSubcriptionValidityDate(driverData.subcriptionEndDate, 1);
                // uptoEndDate = GFunctions.getSubcriptionValidityDate(req.body.startDate, packageData.PackageValidity);
                packageStatus = 'Inactive';
              }
              var newDoc = new DriverPackage({
                driverId: req.body.driverId,
                driverName: driverData.fname,
                packageId: req.body.packageId,
                packageName: packageData.name,
                amount: packageData.amount,
                type: req.body.type,
                startDate: req.body.startDate,
                endDate: uptoEndDate,
                credit: packageData.credit ? packageData.credit : 0,
                vehicletype: req.body.vehicletype ? req.body.vehicletype : packageData.vehicletype
              })
            }
            else {
              var newDoc = new DriverPackage({
                driverId: req.body.driverId,
                driverName: driverData.fname,
                packageId: req.body.packageId,
                packageName: packageData.name,
                amount: packageData.amount,
                type: req.body.type,
                purchaseDate: req.body.startDate,
                credit: packageData.credit,
              })
              paymentDate = GFunctions.getDateTimeinThisFormat(req.body.startDate, 'YYYY-MM-DD', "D-M-YYYY h:mm a");
              paymentDateSort = GFunctions.getDateTimeinThisFormat(req.body.startDate, 'YYYY-MM-DD');
            }
            newDoc.save((err, datas) => {
              if (err) {
                return res.json({ 'success': false, 'message': err.message, 'err': err });
              }
              var params = {
                driverId: req.body.driverId,
                driverName: driverData.fname,
                trxId: req.body.tranxId ? req.body.tranxId : req.body.packageId,
                description: packageData.name,
                amt: packageData.amount ? packageData.amount : 0,
                type: "credit",
                paymentDate: paymentDate,
                paymentDateSort: paymentDateSort,
              }

              if (req.body.type == "subscription") {
                driverBank.driverBankTransactions(params, false, false);
              } else {
                driverBank.driverBankTransactions(params, false);
              }

              if (req.body.type == "subscription") {
                if (packageStatus == "Activated") {
                  if (driverData.curService == datas.vehicletype) {
                    updateDriverCreditsInFB(req.body.driverId, creditValue, uptoEndDate);
                  }
                  updateSubcriptionEndDate(req.body.driverId, uptoEndDate, datas._id, req.body.vehicletype);
                }
              } else {
                updateDriverCreditsInFB(req.body.driverId, creditValue);
              }
              // debitDriverBankTransactions(req.body.driverId, creditValue, req.body.packageId, creditValue, false, 'Credit');
              return res.status(200).json({ 'success': true, 'message': req.i18n.__("PACKAGE_ADDED_TO_DRIVER_SUCCESSFULLY"), "datas": datas });
            })
            //return res.json({'success':true,'message':'Details Updated successfully', 'drivertaxis' : docs.taxis });
          });
        }
      });
    }
  });
}

//@TODO v2
export const calculateAndUpdateSubcriptionValidity = (driverId, packageId, startDate, PackageValidity) => {
  var uptoEndDate = GFunctions.getSubcriptionValidityDate(startDate, PackageValidity);
}

export const getDriverPack = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;

  DriverPackage.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  DriverPackage.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}


export const driverPackageHistory = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;
  likeQuery['driverId'] = req.params.id;

  let TotCnt = DriverPackage.find(likeQuery).count();
  let Datas = DriverPackage.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take); //have to catch Err
  try {
    var promises = await Promise.all([TotCnt, Datas]);
    res.header('x-total-count', promises[0]);
    var resstr = promises[1];
    res.send(resstr);
  } catch (err) {
    return res.json([]);
  }

}

export const getAllDrivers = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
  Driver.find(likeQuery, { fname: 1, lname: 1, code: 1 }).exec((err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    if (docs.length) {
      var resultarr = [];
      var result = docs.map(function (items) {
        var arrData = {
          id: items._id,
          name: items.fname + ' ' + items.lname,
          code: items.code,
        };
        resultarr.push(arrData);
      });
      return res.send(resultarr);
      //return res.send(docs);
    } else {
      return res.send([]);
    }
  });
}

export const getCompyDrivers = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  if (req.type == 'company') likeQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
  Driver.find(likeQuery, { fname: 1, lname: 1 }).exec((err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    if (docs.length) {
      var resultarr = [];
      var result = docs.map(function (items) {
        var arrData = {
          id: items._id,
          name: items.fname + ' ' + items.lname,
        };

        resultarr.push(arrData);
      });
      return res.send(resultarr);
      //return res.send(docs);
    } else {
      return res.send([]);
    }
  });

}


export const getAllPackage = async (req, res) => {
  PayPackage.find({}, { scIds: 0 }).exec((err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    if (docs.length) {
      return res.send(docs);
    } else {
      return res.send([]);
    }
  });
}

export const getSelectedPackage = async (req, res) => {
  PayPackage.findById({ _id: req.params.id }, { name: 1, type: 1 }).exec((err, docs) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    return res.send(docs);
  });
}

export const getSubReqPackage = async (req, res) => {
  var likeQuery = { type: "subscription" }
  if (req.params.vehicletype) likeQuery['vehicletype'] = req.params.vehicletype;
  PayPackage.find(likeQuery, { name: 1, PackageValidity: 1 }, function (err, docs) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    if (docs.length) {
      return res.send(docs);
    } else {
      return res.send([]);
    }
  });
}

export const getComReqPackage = async (req, res) => {
  PayPackage.find({
    'type': { $in: ['commission', 'topup'] }
  }, { name: 1 }, function (err, docs) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
    }
    if (docs.length) {
      return res.send(docs);
    } else {
      return res.send([]);
    }
  });
}

export const deleteDriverPack = async (req, res) => {
  DriverPackage.findById(req.params.id, function (err, docs) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'err': err });
    }
    if (docs) {
      var packCredit = docs.credit;


      Driver.findOne({ _id: docs.driverId }, { wallet: 1, fname: 1 }, function (err, driverData) {
        if (err) { return res.status(500).json({ 'success': false, 'message': err.message, 'err': err }); }
        if (!driverData) {
          return res.status(404).json({ 'success': false, 'message': req.i18n.__("DRIVER_NOT_FOUND") });;
        } else {
          var driverWallet = driverData.wallet;

          if (driverWallet != null && driverWallet != '') {
            var creditValue = Number(driverWallet) - Number(packCredit);
            driverData.wallet = creditValue;
          } else {
            var creditValue = 0;
            driverData.wallet = 0;
          }
          driverData.save(function (err, op) {
            if (err) { return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }


            DriverPackage.findByIdAndRemove({ _id: req.params.id },
              function (err, datas) {
                if (err) {
                  return res.json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER"), 'err': err });
                }
                updateDriverCreditsInFB(docs.driverId, creditValue);
                return res.status(200).json({ 'success': true, 'message': "PACKAGE_DELETED_FROM_DRIVER_CREDITS_SUCCESSFULLY", "datas": datas });
              });


            //return res.json({'success':true,'message':'Details Updated successfully', 'drivertaxis' : docs.taxis });
          });

        }

      });


    } else {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_SERVER") });
    }
  });
}


/**
 * Helper for maual
 * @param {*} req
 * @param {*} res
 */
export const modifyAllDriverPackage = (req, res) => {
  Driver.find({}).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    for (var i = 0; i < docs.length; i++) {
      var driverId = docs[i]._id;
      var fname = docs[i].fname;
      modifyAllDriverPackageHelp(driverId, fname);
    }
  });
}

export const modifyAllDriverPackageHelp = (driverId, fname, credit = '0', packageId = '', amount = 0) => {
  Driver.findOne({ _id: driverId }, { wallet: 1, fname: 1 }, function (err, driverData) {
    if (!driverData) {
    } else {
      var driverWallet = driverData.wallet;
      if (driverWallet != null && driverWallet != '') {
        var creditValue = Number(credit);
        driverData.wallet = creditValue;
      } else {
        var creditValue = Number(credit);
        driverData.wallet = Number(credit);
      }
      driverData.save(function (err, op) {
        if (err) { return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err }); }
        updateDriverCreditsInFB(driverId, creditValue);

        // var driverPackageDetails = {
        //   driverId: driverId,
        //   driverName: fname,
        //   packageId: packageId,
        //   packageName: packageData.name,
        //   amount: amount,
        //   credit: credit,
        // }
        // var newDoc = new DriverPackage(driverPackageDetails);
        // newDoc.save((err, datas) => {
        //   if (err) {
        //   }
        //   updateDriverCreditsInFB(driverId, creditValue);
        // })
      });
    }
  });
}


/**
 *
 * @param {*} req
 * @param {*} res
 */
export const getExpiryPackOfSubscription = (req, res) => {
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
          // '$lte': toDate
        }
      }
  };
  DriverPackage.aggregate([
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
    // { "$sort": sortQuery },
    // { "$skip": pageQuery.skip },
    // { "$limit": pageQuery.take },
  ], function (err, result) {
    if (err) {
      return res.status(409).json();
    }
    return res.send(result);
  });


}

//Subscription
export const addDriverSubscription = async (req, res) => {
  try {
    var packageData = await PayPackage.findOne({ _id: req.body.packageId }, {}).exec();
    var vehicletype = req.body.vehicletype ? req.body.vehicletype : packageData.vehicletype
    req.body.amount = req.body.amount ? req.body.amount : packageData.amount;
    var curService = '', taxisDoc = [];
    var driverData = await Driver.findOne({ _id: req.body.driverId }, { wallet: 1, fname: 1, email: 1, actHolder: 1, actNo: 1, actBank: 1, actLoc: 1, actCode: 1, isSubcriptionActive: 1, subcriptionEndDate: 1, status: 1, curService: 1, taxis: 1 }).lean().exec();
    if (driverData) {
      curService = driverData.curService;
      taxisDoc = _.filter(driverData.taxis, { 'vehicletype': vehicletype });
      var profilestatus = driverData.status[0].docs
      if (profilestatus == "pending") return res.status(409).json({ 'success': false, 'message': "Activate Subscriptoin Package After Admin Approval." });
    }
    req.body.startDate = req.body.startDate ? req.body.startDate : GFunctions.getISOTodayDate();
    var uptoEndDate = GFunctions.getSubcriptionValidityDate(req.body.startDate, packageData.PackageValidity);
    var packageStatus = 'Activated';
    if (curService == vehicletype) {
      if (driverData.isSubcriptionActive == true && driverData.subcriptionEndDate != null) {
        //if start date is less than current end date
        //subcriptionEndDate <= today

        /* var hoursBtNowAndReq = GFunctions.getHoursBtDateTime(req.body.startDate, driverData.subcriptionEndDate);
        if (hoursBtNowAndReq < 23) {
          if (req.body.fromApp == true && driverData.subcriptionEndDate != null) {
            req.body.startDate = GFunctions.getSubcriptionValidityDate(driverData.subcriptionEndDate, 1);
          }else{
            return res.status(409).json({ 'success': false, 'message': "Driver has Active Subscription upto  " + driverData.subcriptionEndDate + " Select Activation Date after this Date." });
          }
        }//else */

        req.body.startDate = GFunctions.getSubcriptionValidityDate(driverData.subcriptionEndDate, 1);
        uptoEndDate = GFunctions.getSubcriptionValidityDate(req.body.startDate, packageData.PackageValidity);
        packageStatus = 'Inactive';
      }
    }
    else if (taxisDoc.length) {
      if (taxisDoc[0].isSubcriptionActive == true && taxisDoc[0].subcriptionEndDate != null) {
        req.body.startDate = GFunctions.getSubcriptionValidityDate(driverData.subcriptionEndDate, 1);
        uptoEndDate = GFunctions.getSubcriptionValidityDate(req.body.startDate, packageData.PackageValidity);
        packageStatus = 'Inactive';
      }
    }

    var newDoc = new DriverSubscription({
      driverId: req.body.driverId,
      driverName: driverData.fname,
      packageId: req.body.packageId,
      packageName: packageData.name,
      amount: req.body.amount ? req.body.amount : packageData.amount,
      noofdays: packageData.PackageValidity ? packageData.PackageValidity : req.body.noofdays,
      startDate: req.body.startDate,
      purchaseDate: req.body.purchaseDate ? req.body.purchaseDate : GFunctions.getISODate(),
      endDate: uptoEndDate,
      status: packageStatus,
      vehicletype: vehicletype
    });

    var paymentDate = GFunctions.getDateTimeinThisFormat(req.body.purchaseDate ? req.body.purchaseDate : GFunctions.getISODate(), 'YYYY-MM-DD', "D-M-YYYY h:mm a");
    var params = {
      driverId: req.body.driverId,
      driverName: driverData.fname,
      trxId: req.body.tranxId ? req.body.tranxId : req.body.packageId,
      description: packageData.name,
      amt: req.body.amount ? req.body.amount : packageData.amount,
      type: "credit",
      paymentDate: paymentDate,
      paymentDateSort: GFunctions.getISODate(),
    }
    driverBank.driverBankTransactions(params, false, false)

    newDoc.save(async (err, datas) => {
      if (err) {
        return res.json({ 'success': false, 'message': err.message, 'err': err });
      }
      //Update in Firebase and Driver
      if (packageStatus == "Activated") {
        var driverDetails = await Driver.findOne({ '_id': req.body.driverId, curService: vehicletype });
        if (driverDetails) updateDriverSubscriptionInFB(req.body.driverId, uptoEndDate,true);
        updateSubcriptionEndDate(req.body.driverId, uptoEndDate, datas._id, datas.vehicletype);
      }
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("SUBSCRIPTION_ADDED_SUCCESSFULLY"), "datas": datas });
    })
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err });
  }
}

export const getDriverSubscription = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;

  DriverSubscription.find(likeQuery).count().exec((err, cnt) => {
    if (err) { }
    totalCount = cnt;
  });

  DriverSubscription.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', totalCount);
    res.send(docs);
  });

}

export const activateDriverSubscription = async (req, res) => {
  try {
    var DriverSubscriptionData = await DriverSubscription.findOne({ _id: req.body.subscriptionID }, {}).exec();

    if (!DriverSubscriptionData) {
      return res.status(409).json({ 'success': false, 'message': "No Pending Subscription Found." });;
    } else if (DriverSubscriptionData.status == "Activated") {
      return res.status(409).json({ 'success': false, 'message': "Subscription Already Activated." });;
    }

    var packageData = await PayPackage.findOne({ _id: DriverSubscriptionData.packageId }, {}).exec();
    var driverData = await Driver.findOne({ _id: DriverSubscriptionData.driverId }, { wallet: 1, fname: 1, email: 1, actHolder: 1, actNo: 1, actBank: 1, actLoc: 1, actCode: 1, isSubcriptionActive: 1, subcriptionEndDate: 1 }).exec();

    var uptoEndDate = GFunctions.getSubcriptionValidityDate(GFunctions.getISODate(), packageData.PackageValidity);
    var packageStatus = 'Activated';
    if (driverData.isSubcriptionActive == true && driverData.subcriptionEndDate != null) {
      //if start date is less than current end date
      //subcriptionEndDate <= today
      var hoursBtNowAndReq = GFunctions.getHoursBtDateTime(GFunctions.getISODate(), driverData.subcriptionEndDate);
      if (hoursBtNowAndReq < 23) {
        return res.status(409).json({ 'success': false, 'message': "Already have Active Subscription upto  " + driverData.subcriptionEndDate + " Activate Date after this Date." });
      }//else
    }

    var update = {
      startDate: GFunctions.getISODate(),
      endDate: uptoEndDate,
      status: packageStatus,
    }
    DriverSubscription.findOneAndUpdate({ _id: req.body.subscriptionID }, update, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err });
      }
      else {
        if (packageStatus == "Activated") {
          updateDriverSubscriptionInFB(DriverSubscriptionData.driverId, uptoEndDate);
          updateSubcriptionEndDate(DriverSubscriptionData.driverId, uptoEndDate, req.body.subscriptionID, doc.vehicletype);
        }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("SUBSCRIPTION_ACTIVATED_SUCCESSFULLY"), "datas": doc });
      }
    })

  } catch (err) {

    return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err });
  }
}

export const deactivateDriverSubscription = async (req, res) => {
  try {
    var DriverSubscriptionData = await DriverSubscription.findOne({ _id: req.body.subscriptionID }).exec();

    if (!DriverSubscriptionData) {
      return res.status(409).json({ 'success': false, 'message': "Subscription not found." });;
    } else if (DriverSubscriptionData.status == "Deactivated") {
      return res.status(409).json({ 'success': false, 'message': "Subscription Already Deactivated." });;
    }

    var DriverSubscriptionDeactivatedData = await DriverSubscription.findOneAndUpdate({ _id: req.body.subscriptionID }, { status: 'Deactivated' }).exec();

    var driverData = await Driver.findOne({ _id: DriverSubscriptionData.driverId, currentSubId: req.body.subscriptionID }, { wallet: 1, fname: 1, email: 1, actHolder: 1, actNo: 1, actBank: 1, actLoc: 1, actCode: 1, isSubcriptionActive: 1, subcriptionEndDate: 1, currentSubId: 1 }).exec();

    if (driverData.isSubcriptionActive == true && driverData.subcriptionEndDate != null) {
      var oldActiveDriverSubscriptionData = await DriverSubscription.find({ status: 'Inactive', driverId: DriverSubscriptionData.driverId }, {}).sort({ endDate: -1 }).limit(1).lean().exec();
      var uptoEndDate = GFunctions.getSubcriptionDeValidityDate(driverData.subcriptionEndDate, DriverSubscriptionData.noofdays);
      var isEndDateValid = moment(GFunctions.getISODate()).isBefore(uptoEndDate);
      if (isEndDateValid) {
        updateDriverSubscriptionInFB(DriverSubscriptionData.driverId, uptoEndDate);
        var currentSubId = null;
        if (oldActiveDriverSubscriptionData.length) currentSubId = oldActiveDriverSubscriptionData[0]._id;
        updateSubcriptionEndDate(DriverSubscriptionData.driverId, uptoEndDate, currentSubId, DriverSubscriptionData.vehicletype);
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("SUBSCRIPTION_ACTIVATED_SUCCESSFULLY") });
      }
      updateDriverSubscriptionInFB(DriverSubscriptionData.driverId, 'NA', false);
      updateSubcriptionDeactivate(DriverSubscriptionData.driverId);
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("SUBSCRIPTION_ACTIVATED_SUCCESSFULLY") });
    }

    return res.status(200).json({ 'success': true, 'message': req.i18n.__("SUBSCRIPTION_ACTIVATED_SUCCESSFULLY") });
  } catch (err) {

    return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'err': err });
  }
}

export const getSubcriptionValidityDate = (req, res) => {
  var uptoEndDate = GFunctions.getSubcriptionValidityDate(req.body.startDate, req.body.PackageValidity);
  return uptoEndDate;
}

export const mySubscriptions = (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;
  likeQuery['driverId'] = req.userId;

  DriverSubscription.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.send(docs);
  });
}

export const driverSubscriptionSingle = async (req, res) => {
  var likeQuery = HelperFunc.likeQueryBuilder(req.query);
  var pageQuery = HelperFunc.paginationBuilder(req.query);
  var totalCount = 10;
  likeQuery['driverId'] = req.params.id;
  var TotCnt = await DriverSubscription.find(likeQuery).count();
  DriverSubscription.find(likeQuery, {}).skip(pageQuery.skip).limit(pageQuery.take).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    res.header('x-total-count', TotCnt);
    res.send(docs);
  });
}

export const getPackages = async (req, res) => {
  var taxPercentage = 0, onlinePercentage = 0, stripeFare = 0, centFare = 0;
  var driverDetails = await Driver.findOne({ '_id': req.userId });
  var likeQuery = { type: "subscription" };
  if (driverDetails && (driverDetails.curService)) {
    likeQuery['vehicletype'] = driverDetails.curService
  }
  PayPackage.aggregate([
    {
      $facet:
      {
        "subscriptionPackage": [
          { $match: likeQuery },
        ],
        "commissionPackage": [
          { $match: { type: "topup" } },
        ],
      }
    },

  ]).exec(async (err, result) => {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': "Error On Server", 'err': err });
    }

    if (driverDetails && driverDetails.subcriptionEndDate) result[0].subcriptionEndDate = moment(driverDetails.subcriptionEndDate).format("DD-MM-YYYY");
    result[0].subscriptionId = driverDetails.subscriptionPackId;
    result[0].subscriptionPurchaseId = driverDetails.subscriptionPackPurchaseId;

    var subscriptionPackages = result[0].subscriptionPackage;
    subscriptionPackages = _.map(subscriptionPackages, (el) => {
      stripeFare = Number((Number(el.amount) * Number(featuresSettings.stripePaymentPercentage)) / 100).toFixed(2);
      centFare = Number(Number(featuresSettings.centsToAddExtraForStripe) / 100).toFixed(2);
      var totalFare = Number(el.amount) + Number(stripeFare) + Number(centFare);
      let onlineTax = parseFloat(el.amount * parseFloat(onlinePercentage) / 100);
      totalFare = Number(totalFare) + Number(onlineTax);
      let tax = parseFloat(onlineTax * parseFloat(taxPercentage) / 100);
      totalFare = Number(totalFare) + Number(tax);
      totalFare = (totalFare).toFixed(2);
      el.amount = Number(totalFare);
      return el;
    })
    result[0].subscriptionPackage = subscriptionPackages;

    var commissionPackages = result[0].commissionPackage;
    commissionPackages = _.map(commissionPackages, (el) => {
      stripeFare = Number((Number(el.amount) * Number(featuresSettings.stripePaymentPercentage)) / 100).toFixed(2);
      centFare = Number(Number(featuresSettings.centsToAddExtraForStripe) / 100).toFixed(2);
      var totalFare = Number(el.amount) + Number(stripeFare) + Number(centFare);
      let onlineTax = parseFloat(el.amount * parseFloat(onlinePercentage) / 100);
      totalFare = Number(totalFare) + Number(onlineTax);
      let tax = parseFloat(onlineTax * parseFloat(taxPercentage) / 100);
      totalFare = Number(totalFare) + Number(tax);
      el.amount = Number(totalFare).toFixed(2);
      return el;
    })
    result[0].commissionPackage = commissionPackages;

    if (result.length) return res.json(result[0]);
    else return res.json([]);
  });
}

export const getDriverVehicleList = async (req, res) => {
  var driverData = await Driver.findOne({ '_id': req.params.id });
  if (driverData && (driverData.taxis).length) {
    var vehicletypelist = _.map(driverData.taxis, 'vehicletype');
    var uniqueList = _.uniq(vehicletypelist);
    return res.json(uniqueList);
  }
  else return res.json([]);
}