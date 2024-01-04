import mongoose from 'mongoose';
import moment from 'moment';

import DriverPerDay from '../../models/driverperDay.model';
import incentiveType from '../incentive/incentive.model';
import * as HelperFunc from '../../controllers/adminfunctions';
import * as GFunctions from '../../controllers/functions';
import { updateDriverWallet } from '../../controllers/driverBank';

const _ = require('lodash');
//const moment = require('moment');

import console from 'console';

export const addData = async (req, res) => {
    incentiveType.findOne({ targetTime: req.body.targetTime }, (err, docs) => {
        if (err) { res.json(err) }
        else (!docs)
        {
            var data = new incentiveType({
                targetTime: req.body.targetTime,
                targetFor: req.body.targetFor,
                targetType: {
                    target: req.body.target,
                    targetAmt: req.body.targetAmt,
                    status: req.body.status,
                },
                status: req.body.name,
                targetName: req.body.targetName
            });


            //data = new incentiveType(data);
            data.save((err, docs) => {
                if (err) {
                    res.status(500).json({ 'success': false, 'message': "Server Error..", 'error': err });
                    console.log(err);
                }
                else {
                    return res.status(200).json({ 'success': true, 'message': 'Data added successfully', docs });
                }
            })
        }
    })

}

export const getData = async (req, res) => {
    incentiveType.find().exec((err, data) => {
        if (err) {
            return res.status(500).json({ 'success': false, 'message': "Server Error..", 'error': err });
        }
        else if (!data) {
            return res.status(401).json({ 'success': false, 'message': 'No Data Found' });
        }
        else {
            return res.send(data);
        }
    })
}

export const delData = async (req, res) => {
    incentiveType.findByIdAndRemove(req.params.id, (err, docs) => {
        if (err) {
            return res.status(500).json({ 'success': false, 'message': "Server Error..", 'error': err });
        } else {
            return res.status(200).json({ 'success': true, 'message': "Data Deleted Successfully" });
        }
    })
}

export const updateData = async (req, res) => {
    var update = {
        target: req.body.target,
        targetAmt: req.body.targetAmt,
        status: req.body.status
    }
    incentiveType.findByIdAndUpdate({ "_id": req.params.id }, { $set: { targetType: update } }, { new: true }, (err, docs) => {
        if (err) return res.json({ 'success': false, 'message': 'Invalid Request' });
        return res.status(200).json({ 'success': true, 'message': "Update successfully", 'data': docs })
    })

}

export const patchData = async (req, res) => {
    incentiveType.findOne({ "_id": req.params.id }, (err, docs) => {
        if (err) return res.json({ 'success': false, 'message': 'Invalid Request' });
        docs.targetTime = req.body.targetTime;
        docs.targetFor = req.body.targetFor;
        docs.status = req.body.status;
        docs.targetName = req.body.targetName;
        docs.save(function (err, data) {
            if (err) return res.json({ 'success': false, 'message': 'Some Error', 'error': err });
            return res.json({ 'success': true, 'message': 'Details Updated successfully', 'docs': data });
        });
    })
}


export const getTargetAmt = async (req, res) => {

    var time = req.body.targetTime;
    var type = req.body.targetFor;
    incentiveType.find({ "targetTime": time, "targetFor": type }, (err, doc) => {
        if (err) return res.status(500).json({ 'success': false, 'message': 'Error On Sever' });
        if (doc.length) {
            async function driverId() {
                DriverPerDay.find({ "nooftrips": { $gte: doc[0].targetType[0].target } }, (err, docs) => {
                    if (err) return res.status(500).json({ 'success': false, 'message': 'Error On Sever' });
                    var data = _.map(docs, (newDoc) => {
                        return {
                            driver: newDoc.driver,
                        }
                    })
                    //console.log(data);
                    // res.json(docs)
                    if (docs.length) {
                        return res.status(200).json({ 'success': true, 'DriverId': data });
                    }
                    else {
                        return res.status(400).json({ 'success': false, 'message': 'No Data Found' });
                    }
                })
            }
            driverId();
        }
        else {
            return res.status(400).json({ 'success': false, 'message': 'No Data Found', 'TargetAmount': 0, 'Target': 0 });
        }
    })
}


export const getWeeklyAmt = async (req, res) => {
    var time = req.body.targetTime;
    var type = req.body.targetFor;
    incentiveType.find({ "targetTime": time, "targetFor": type }, (err, doc) => {
        if (err) return res.status(500).json({ 'success': false, 'message': 'Error On Sever' });
        if (doc.length) {
            //const today = moment();
            var data = _.map(doc, (newDoc) => {
                return {
                    target: newDoc.targetType[0].target
                }
            });
            var target = data[0].target;
            console.log(typeof (target));
            var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
            if (_.isEmpty(dateLikeQuery)) {
                var fromDate = new Date(GFunctions.getCommonMonthStartDate());
                var toDate = new Date(GFunctions.getISODate());
                dateLikeQuery = {
                    date:
                    {
                        '$gte': fromDate,
                        '$lte': toDate
                    }
                }
            }
            //console.log(dateLikeQuery);
            DriverPerDay.aggregate(
                [

                    {
                        "$match": dateLikeQuery
                    },

                    {
                        $project:
                        {
                            _id: 0,
                            nooftrips: { $sum: "$nooftrips" },
                            driver: { $cond: { if: { $gte: ["$nooftrips", target] }, then: "$driver", else: 0 } }
                        }
                    }

                ], (err, docs) => {
                    if (err) res.json(err);
                    res.json(docs);
                    console.log(docs);

                })
        }
        else {
            res.json('No Data Found')
        }
    })

}


export const incentiveCron = async () => {
    try {
        var targetData = await incentiveType.findOne({ 'status' : true });
        var targetFor = targetData.targetFor;
        var targetTime = targetData.targetTime;
        var targetToAchieve = targetData.targetType[0].target;
        var targetAmt = targetData.targetType[0].targetAmt;

        if (targetTime == 'daily'){
            addIncentiveToDriverForTarget(targetFor, targetToAchieve, targetAmt, 'daily');
        } else if (targetTime == 'weekly'){
            addIncentiveToDriverForWeeklyTarget(targetFor, targetToAchieve, targetAmt, 'weekly');
        }
    } catch (error) {
        console.log(error);
    }

}


export const addIncentiveToDriverForTarget = async (targetFor, targetToAchieve, targetAmt, targetTime) => {
    try {
        var whereQuery = {};
        var todayDate = GFunctions.getISOTodayDate();

        if (targetFor == 'trips'){
            whereQuery = { "nooftrips": { $gte: targetToAchieve }, date: todayDate  }
        } else if (targetFor == 'earnings'){
            whereQuery = { "earned": { $gte: targetToAchieve }, date: todayDate } 
        }

        DriverPerDay.find(whereQuery, (err, docs) => {
            if (err) console.log(err) 
            if (docs.length) {
                var desc = "Incentive For Date - " + todayDate;
                docs.forEach(function (doc) {
                    addIncentiveToDriverWallet(doc.driver, targetAmt, desc);
                })

            }
            else {
                console.log('No Driver')
            }
        })

    } catch (error) {
        console.log(error);
    }
}

export const addIncentiveToDriverForWeeklyTarget = async (targetFor, targetToAchieve, targetAmt, targetTime) => {
    try {
        var whereQuery = {};
        var fromDate = new Date(GFunctions.getCommonWeekStartDate());
        var toDate = new Date(GFunctions.getISODate());
        var endOfWeek = new Date(GFunctions.getCommonWeekEndDate("YYYY-MM-DD"));
        var todayDate = GFunctions.getISOTodayDate();

        if (endOfWeek != todayDate) return false;

        var dateLikeQuery = {
            date:
            {
                '$gte': fromDate,
                '$lte': toDate
            }
        }; 


        var whereQuery = {};
        if (targetFor == 'trips') {
            whereQuery =  
            {
                "$match": { "nooftrips": { $gte: targetToAchieve } }
            };
        } else if (targetFor == 'earnings') {
            whereQuery =
                {
                "$match": { "earned": { $gte: targetToAchieve } }
                };
        }

        DriverPerDay.aggregate(
            [
                {
                    "$match": dateLikeQuery
                },
                {
                    $project:
                    {
                        _id: 0,
                        nooftrips: { $sum: "$nooftrips" },
                        earned: { $sum: "$earned" },
                        driver: "$driver",
                    }
                },
                whereQuery
            ], (err, docs) => {
                if (err) console.log(err)
                if (docs.length) {
                    console.log(docs)
                    var desc = "Incentive For Dates - " + fromDate + ' to' + toDate;
                    docs.forEach(function (doc) {
                        addIncentiveToDriverWallet(doc.driver, targetAmt, desc);
                    })
                }
                else {
                    console.log('No Driver')
                }
            })

    } catch (error) {
        console.log(error);
    }
}

export const addIncentiveToDriverWallet = async(driver, targetAmt,desc) => {

    var tripParams = {
        driverId: driver,
        trxId: '',
        description: desc,
        amt: targetAmt,
        paymentDate: GFunctions.getISODate("D-M-YYYY h:mm a"),
        paymentDateSort: GFunctions.getISODate(),
        type: 'credit'
    }
    //Update Driver Wallet.
    updateDriverWallet(tripParams.driverId, tripParams)

}