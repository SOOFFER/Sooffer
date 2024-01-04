import mongoose from 'mongoose';
import { updateDriverCreditsInFB } from './driver';
const _ = require('lodash');
const ObjectId = mongoose.Types.ObjectId;
import * as HelperFunc from './adminfunctions';

//model
import DriverBank from '../models/driverBank.model';
import DriverWallet from '../models/driverWallet.model';
import Driver from '../models/driver.model';
import * as GFunctions from './functions';

/** 
 * params : email, holdername, acctNo, banklocation, bankname, swiftCode, driverId, driverName, trxId, description, amt, type, paymentDate(YYYY-MM-DD) 
 */
export const addData = (req, res) => {
    if (typeof req.body.driverId === "undefined" || req.body.driverId === "") {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") })
    }
    DriverBank.findOne({ driverId: req.body.driverId }, function (err, doc) {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        else if (!doc) {
            var id1 = new ObjectId;

            var newdoc = new DriverBank
                ({
                    driverId: req.body.driverId,
                    driverName: req.body.driverName,
                    totalBal: 0,
                    trx: {
                        _id: id1,
                        trxId: req.body.trxId,
                        description: req.body.description,
                        amt: req.body.amt,
                        type: req.body.type,
                        paymentDate: GFunctions.getDateTimeinThisFormat(req.body.paymentDate, 'YYYY-MM-DD', "D-M-YYYY h:mm a"),
                        paymentDateSort: GFunctions.getDateTimeinThisFormat(req.body.paymentDate, 'YYYY-MM-DD'),
                        bal: 0
                    },
                });

            newdoc.save((err, docs) => {
                if (err) {
                    return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
                }
                var tranx = newdoc.trx.id(id1);
                let Tranxamt = tranx.amt;
                let Tranxbal = tranx.bal;
                let types = tranx.type;
                var total;
                var total1;
                if (types == 'debit') {
                    total = parseFloat(parseFloat(docs.totalBal) - parseFloat(Tranxamt)).toFixed(2);
                }
                if (types == 'credit') {
                    total = parseFloat(parseFloat(docs.totalBal) + parseFloat(Tranxamt)).toFixed(2);
                }
                docs.totalBal = total;
                tranx.bal = total;

                docs.save(function (err, docs) {
                    if (err) { }
                    else {
                        updateDriverWallet(req.body.driverId, tranx)
                        return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_ACCOUNT_ADDED_SUCCESSFULLY"), 'docs': docs });
                    }
                })
            })
        }
        else if (doc) {
            var id1 = new ObjectId;

            var trxdetails =
            {
                _id: id1,
                trxId: req.body.trxId,
                description: req.body.description,
                amt: req.body.amt,
                type: req.body.type,
                paymentDate: GFunctions.getDateTimeinThisFormat(req.body.paymentDate, 'YYYY-MM-DD', "D-M-YYYY h:mm a"),
                paymentDateSort: GFunctions.getDateTimeinThisFormat(req.body.paymentDate, 'YYYY-MM-DD'),
                bal: 0
            }
            DriverBank.findOneAndUpdate({ driverId: req.body.driverId }, { $push: { trx: trxdetails } }, { 'new': true }, function (err, docs) {
                if (err) {
                    return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR_UPDATING"), 'error': err });
                }
                var tranx = docs.trx.id(id1);
                let Tranxamt = tranx.amt;
                let Tranxbal = tranx.bal;
                let types = tranx.type;
                var total;
                var total1;
                if (types == 'debit') {
                    total = parseFloat(parseFloat(docs.totalBal) - parseFloat(Tranxamt)).toFixed(2);
                }
                if (types == 'credit') {
                    total = parseFloat(parseFloat(docs.totalBal) + parseFloat(Tranxamt)).toFixed(2);
                }
                docs.totalBal = total;
                tranx.bal = total;

                docs.save(function (err, docs) {
                    if (err) { }
                    else {
                        updateDriverWallet(req.body.driverId, tranx)
                        return res.json({ 'success': true, 'message': req.i18n.__("DRIVER_ACCOUNT_UPDATED_SUCCESSFULLY"), 'docs': docs });
                    }
                })
            })
        }
    });
}


export const getData = (req, res) => {
    DriverBank.find({ driverId: req.params.id }, {
        driverId: 1,
        driverName: 1,
        totalBal: 1,
        trx: 1,
        bank: 1

    }).exec((err, docs) => {
        if (err) {
            return res.json([]);
        }

        else {
            return res.json(docs);
        }
    });
}

export const driverBankTransactions = (params, needToUpdateDrivermodel, addToWallet = true) => {
    DriverBank.findOne({ driverId: params.driverId }, function (err, doc) {
        if (err) { }
        else if (!doc) {
            var id1 = new ObjectId;

            var newdoc = new DriverBank
                ({
                    driverId: params.driverId,
                    driverName: params.driverName,
                    totalBal: params.amt,
                    trx: {
                        _id: id1,
                        trxId: params.trxId,
                        description: params.description,
                        amt: params.amt,
                        type: params.type,
                        paymentDate: params.paymentDate,
                        paymentDateSort: params.paymentDateSort,
                        bal: params.amt
                    },
                });

            newdoc.save((err, docs) => {
                if (err) { }
                else {
                    if (addToWallet) updateDriverWallet(params.driverId, params, needToUpdateDrivermodel)
                }
            })
        }
        else if (doc) {
            var id1 = new ObjectId;
            var total

            if (params.type == 'debit') {
                total = parseFloat(parseFloat(doc.totalBal) - parseFloat(params.amt)).toFixed(2);
            }
            if (params.type == 'credit') {
                total = parseFloat(parseFloat(doc.totalBal) + parseFloat(params.amt)).toFixed(2);
            }

            doc.totalBal = total;
            doc.trx.push({
                _id: id1,
                trxId: params.trxId,
                description: params.description,
                amt: params.amt,
                type: params.type,
                paymentDate: params.paymentDate,
                paymentDateSort: params.paymentDateSort,
                bal: total
            })

            doc.save((err, driverDoc) => {
                if (err) { console.log(err) }
                else {
                    if (addToWallet) updateDriverWallet(params.driverId, params, needToUpdateDrivermodel)
                }
            })
        }
    });
}

function updateDriverModel(id, amt) {
    Driver.findByIdAndUpdate({ "_id": id }, { "wallet": amt }, { "new": true }, function (err, doc) {
        if (err) { console.log(err) }
        else {
            updateDriverCreditsInFB(id, doc.wallet)
        }
    })
}

export const updateDriverWallet = (id, params, needToUpdateDrivermodel = true) => {
    var total = 0;
    params.amt = parseFloat(params.amt).toFixed(2);
    // params.amt = Number((params.amt)).toFixed(2);
    DriverWallet.findOne({ "driverId": id }, function (err, doc) {
        if (err) {  }
        if (doc) {
            if (params.type == 'debit') {
                total = parseFloat(parseFloat(doc.totalBal) - parseFloat(params.amt)).toFixed(2);
            }
            if (params.type == 'credit') {
                total = parseFloat(parseFloat(doc.totalBal) + parseFloat(params.amt)).toFixed(2);
            }
            doc.totalBal = total ? total : 0;
            doc.trx.push({
                trxId: params.trxId,
                description: params.description,
                amt: params.amt,
                type: params.type,
                paymentDate: params.paymentDate,
                paymentDateSort: params.paymentDateSort ? params.paymentDateSort : GFunctions.getISODate(),
                bal: total,
            })
            /*   console.log('updateDriverWallet',{
                  trxId: params.trxId,
                  description: params.description,
                  amt: params.amt,
                  type: params.type,
                  paymentDate: params.paymentDate,
                  bal: total,
              });
              console.log('needToUpdateDrivermodel', needToUpdateDrivermodel);
              console.log('doc', doc); */
            doc.save((err, driverData) => {
                if (err) { return console.log(err) }
                if (needToUpdateDrivermodel) updateDriverModel(id, total)
                // console.log("Update Driver Wallet",  driverData.totalBal)
            })
        }
    })
}

export const getDriverWallet = (req, res) => {
    DriverWallet.findOne({ driverId: req.params.id }, {
        driverId: 1,
        driverName: 1,
        totalBal: 1,
        trx: 1,
    }).exec((err, docs) => {
        if (err) {
            return res.json([]);
        }

        else {
            return res.json(docs);
        }
    });
}


export const driverBankReport = async (req, res) => {
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});

    try {
        var skip = { "$skip": pageQuery.skip },
            limit = { "$limit": pageQuery.take };

        if (req.query.requestFrom == 'without_limit') {
            skip = { "$match": {} }
            limit = { "$match": {} }
        }

        let Datas = await DriverBank.aggregate([
            { "$match": { driverId: new mongoose.Types.ObjectId(req.params.id) } },
            { "$unwind": "$trx" },
            {
                $project:
                {
                    _id: "$trx._id",
                    bal: "$trx.bal",
                    paymentDate: "$trx.paymentDate",
                    type: "$trx.type",
                    amt: "$trx.amt",
                    description: "$trx.description",
                    trxId: "$trx.trxId",
                    trx: "$trx.trx",
                    createdAt: "$trx.createdAt",
                }
            },
            { "$match": dateLikeQuery },
        ]);

        return res.send(Datas);

    } catch (err) {
        return res.json([]);
    }
}

export const driverWalletReport = async (req, res) => {
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    try {
         if (req.query._sort == "" || typeof req.query._sort == "undefined") {
            req.query._sort = "createdAt"
          }
          if (req.query._order == "" || typeof req.query._order == "undefined") {
            req.query._order = "DESC"
          }
        var skip = { "$skip": pageQuery.skip },
            limit = { "$limit": pageQuery.take };
              if (req.query._sort == "" || typeof req.query._sort == "undefined") {
			    req.query._sort = "createdAt"
			  }
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

		    dateLikeQuery['driverId'] = new mongoose.Types.ObjectId(req.params.id);

        let Datas = await DriverWallet.aggregate([
            // { "$match": { driverId: new mongoose.Types.ObjectId(req.params.id) } },
                { "$match": dateLikeQuery },
            { "$unwind": "$trx" },
            {
                $project:
                {
                    _id: "$trx._id",
                    bal: "$trx.bal",
                    paymentDate: "$trx.paymentDate",
                    type: "$trx.type",
                    amt: "$trx.amt",
                    description: "$trx.description",
                    trxId: "$trx.trxId",
                    trx: "$trx.trx",
                    createdAt: "$trx.createdAt",
                }
            },
            { "$match": likeQuery },
            { "$sort": sortQuery },
            skip,
            limit,
        ]);
        return res.send(Datas);
    } catch (err) {
        return res.json([]);
    }
} 

export const driverBankReportApp = async (req, res) => {
    try {
        let Datas = await DriverBank.aggregate([
            { "$match": { driverId: new mongoose.Types.ObjectId(req.userId) } },
            { "$unwind": "$trx" },
            {
                $project:
                {
                    _id: "$trx._id",
                    bal: "$trx.bal",
                    paymentDate: "$trx.paymentDate",
                    type:  "$trx.type",
                    amt: "$trx.amt",
                    description: "$trx.description",
                    trxId: "$trx.trxId",
                    trx: "$trx.trx",
                    createdAt: "$trx.createdAt",
                }
            },
        ]);

        return res.send(Datas);

    } catch (err) {
        return res.json([]);
    }
} 

export const driverWalletReportApp = async (req, res) => {
    try {
        var pageQuery = HelperFunc.paginationBuilder(req.query);
        var skip = { "$skip": pageQuery.skip },
            limit = { "$limit": pageQuery.take };
        // if (req.query.requestFrom == 'without_limit') {
        //     skip = { "$match": {} }
        //     limit = { "$match": {} }
        // }
        let Datas = await DriverWallet.aggregate([
            { "$match": { driverId: new mongoose.Types.ObjectId(req.userId) } },
            { "$unwind": "$trx" },
            {
                $project:
                {
                    _id: "$trx._id",
                    bal: "$trx.bal",
                    paymentDate: "$trx.paymentDate",
                    type: "$trx.type",
                    amt: "$trx.amt",
                    description: "$trx.description",
                    trxId: "$trx.trxId",
                    trx: "$trx.trx",
                    createdAt: "$trx.createdAt",
                }
            },
            { $sort: { createdAt: -1 } },
            skip, limit
        ]);

        return res.send(Datas);

    } catch (err) {
        return res.json([]);
    }
}