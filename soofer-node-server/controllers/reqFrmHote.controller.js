import Hotel from './../models/hotel.model';
import Trips from '../models/trips.model';
import EstimationModel from '../models/estimation.model';
import * as HelperFunc from './adminfunctions';
import mongoose from 'mongoose';
import logger from '../helpers/logger';
import HotelPayment from '../models/hotelpayment.model';
const ObjectId = mongoose.Types.ObjectId;
const mround = require('mongo-round');
import HotelTransaction from '../models/hotelrtx.model';
import * as GFunctions from './functions';
import { findNearbyDriversAndSendRequest } from './onebyonerequest';

import { updateRiderFbStatus, requestNearbyDrivers } from './app';
import { getCityBasedVehicleCharge } from './fareCalculation';

const config = require('../config');
const requestTypeMethod = config.requestType;

/**
 * [Taxi Request from User] = Checked
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const viewHotelProfile = (req, res) => {
    Hotel.findOne({ _id: req.body.id }, function (err, user) {
        if (err) return res.status(500).json({ 'success': false, 'message': 'Error on Server..' });
        if (user) return res.status(200).json({ 'success': true, 'message': 'Details Fetched Successfully', "data": user });
        if (!user) return res.status(200).json({ 'success': false, 'message': 'No User Present' });
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const login = (req, res) => {
    Hotel.findOne({ email: req.body.email }, function (err, user) {
        var newDoc = Hotel();
        if (err) return res.status(401).json({ data: { token: '', messages: 'Error on the server.', errors: 'Error on the server.', } });
        if (!user) return res.status(401).json({ data: { token: '', messages: 'No user found.', errors: 'No user found.', } });
        var passwordIsValid = newDoc.validPassword(req.body.password, user.salt, user.hash);
        if (!passwordIsValid) return res.status(401).json({ data: { token: '', messages: 'Invalid Password', errors: 'Invalid Password', } });
        var token = newDoc.generateJwt(user._id, user.email, user.fname, "HotelAdmin");
        return res.status(200).json({
            data: {
                token: token,
                messages: 'Login success.'
            }
        });
    })
}
//Hotel logout
export const logout = (req, res) => {
    return res.status(200).json({
        data:
        {
            token: '',
            messages: 'Logout success.',
            errors: 'Logout success.',
        }

    });
}

export const getTripDetailsOfHotel = async (req, res) => {
    var hotelId = req.userId;
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);

    // if(req.cityWise == 'exists') likeQuery['scId'] = {"$in":req.scId}; 

    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var totalCount = 10;
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    sortQuery['createdAt'] = -1;

    let TotCnt = Trips.find({
        $and: [
            likeQuery,
            { "hotelid": hotelId }
        ]
    }).count();
    let Datas = Trips.find({
        $and: [
            likeQuery,
            { "hotelid": hotelId }
        ]
    }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
    try {
        var promises = await Promise.all([TotCnt, Datas]);
        res.header('x-total-count', promises[0]);
        var resstr = promises[1];
        res.send(resstr);
    } catch (err) {
        return res.json([]);
    }
}

//Add restaurant details
export const addData = (req, res) => {
    if (req['file'] != null) {
        var filename = req['file'].path;
    }
    var newDoc = new Hotel(
        {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            phcode: req.body.phcode,
            zipCode: req.body.zipCode,
            location: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
            address: req.body.address,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            commission: req.body.commission,
            logo: filename,

            pickFrom: req.body.pickFrom,
            actMail: req.body.actMail,
            actHolder: req.body.actHolder,
            actNo: req.body.actNo,
            actBank: req.body.actBank,
            actLoc: req.body.actLoc,
            actCode: req.body.actCode,
        });
    newDoc.setPassword(req.body.password);
    newDoc.save((err, datas) => {
        if (err) {
            return res.json({ 'success': false, 'message': err.message, 'err': err });
        }
        return res.status(200).json({ 'success': true, 'message': 'Registered successfully', "datas": datas });
    });
}


//Get restaurant details
export const getData = (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    var totalCount = 10;
    Hotel.find(likeQuery).count().exec((err, cnt) => {
        if (err) { }
        totalCount = cnt;
    });

    Hotel.find(likeQuery, { salt: 0, hash: 0 }).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec((err, docs) => {
        if (err) {
            return res.json([]);
        }
        res.header('x-total-count', totalCount);
        res.send(docs);
    });
}

//update restaurant details
export const updateData = (req, res) => {
    var update;

    if (req['file'] != null) {
        var filename = req['file'].path;
        update =
            {
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                phone: req.body.phone,
                phcode: req.body.phcode,
                zipCode: req.body.zipCode,
                location: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
                address: req.body.address,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                commission: req.body.commission,
                logo: filename,
                pickFrom: req.body.pickFrom,
                actMail: req.body.actMail,
                actHolder: req.body.actHolder,
                actNo: req.body.actNo,
                actBank: req.body.actBank,
                actLoc: req.body.actLoc,
                actCode: req.body.actCode,
            }
    }
    else {
        update =
            {
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                phone: req.body.phone,
                phcode: req.body.phcode,
                zipCode: req.body.zipCode,
                location: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
                address: req.body.address,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                commission: req.body.commission,
                pickFrom: req.body.pickFrom,
                actMail: req.body.actMail,
                actHolder: req.body.actHolder,
                actNo: req.body.actNo,
                actBank: req.body.actBank,
                actLoc: req.body.actLoc,
                actCode: req.body.actCode,
            }
    }
    Hotel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body._id) }, update, (err, docs) => {
        if (err) {
            return res.status(500).json({ 'success': false, 'message': 'Some Error', 'error': err });
        }


        return res.json({ 'success': true, 'message': 'Details Updated successfully', docs });
    });
}

//delete restaurant details
export const deleteData = (req, res) => {
    Hotel.findByIdAndRemove(req.params.id, (err, docs) => {
        if (err) {
            return res.json({ 'success': false, 'message': 'Some Error', 'error': err });
        }
        return res.json({ 'success': true, 'message': 'Details Updated successfully', docs });
    });
}
export const hotelPaymentReport = async (req, res) => {



    var hotelId = req.userId;
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);

    // if(req.cityWise == 'exists') likeQuery['scId'] = {"$in":req.scId}; 

    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var totalCount = 10;
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
    sortQuery['createdAt'] = -1;


    var skip = { "$skip": pageQuery.skip },
        limit = { "$limit": pageQuery.take };

    if (req.query.requestFrom == 'without_limit') {
        skip = { "$match": {} }
        limit = { "$match": {} }
    }
    let TotCnt = HotelPayment.find({
        $and: [
            likeQuery,
            dateLikeQuery,
            { "hotel": hotelId }
        ]
    }, {}).count();
    let Datas = HotelPayment.find({
        $and: [
            likeQuery,
            dateLikeQuery,
            { "hotel": hotelId }
        ]
    }, {}).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
    try {
        var promises = await Promise.all([TotCnt, Datas]);
        res.header('x-total-count', promises[0]);
        var resstr = promises[1];
        res.send(resstr);
    } catch (err) {
        return res.json([]);
    }

}

export const addTransaction = (req, res) => {
    if (typeof req.body.hotelId === "undefined" || req.body.hotelId === "") {
        return res.status(409).json({ 'success': false, 'message': "Some Error.." })
    }
    HotelTransaction.findOne({ hotelid: req.body.hotelId }, async function (err, doc) {
        if (err) return res.json({ 'success': false, 'message': 'Some Error', 'error': err });
        else if (!doc) {
            var id1 = new ObjectId;

            var newdoc = new HotelTransaction
                ({
                    hotelid: req.body.hotelId,
                    hotelname: req.body.hotelName,
                    totalBal: req.body.balancetopay,
                    trx: {
                        _id: id1,
                        trxId: req.body.trxId,
                        description: req.body.description,
                        amt: req.body.amt,
                        type: req.body.type,
                        paymentDate: req.body.paymentDate,
                        bal: 0
                    },
                });

            newdoc.save(async (err, docs) => {
                if (err) {
                    return res.json({ 'success': false, 'message': 'Some Error', 'error': err });
                }
                var tranx = newdoc.trx.id(id1);
                let Tranxamt = tranx.amt;
                let types = tranx.type;
                var total, totalAmount;
                await Hotel.findOne({ _id: req.body.hotelId }, {}, (err, data) => {
                    if (types == 'credit') {
                       data.amount = parseFloat(parseFloat(data.amount) + parseFloat(Tranxamt)).toFixed(2);
                        total = parseFloat(parseFloat(docs.totalBal) + parseFloat(Tranxamt)).toFixed(2);
                        docs.totalBal = data.amount;
                        tranx.bal = total;
                        // total = parseFloat(parseFloat(docs.totalBal) - parseFloat(Tranxamt)).toFixed(2);

                    }
                    if (types == 'debit') {
                        data.amount = parseFloat(parseFloat(data.amount) - parseFloat(Tranxamt)).toFixed(2);
                        total = parseFloat(parseFloat(docs.totalBal) - parseFloat(Tranxamt)).toFixed(2);
                        docs.totalBal = total;
                        tranx.bal = total;
                    }

                    data.save();
                })


                docs.save(function (err, docs) {
                    if (err) {  }
                    else {
                        //    updateDriverWallet(req.body.driverId,tranx)
                        return res.json({ 'success': true, 'message': 'Hotel account updated Successfully', 'docs': docs });
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
                paymentDate: req.body.paymentDate,
                bal: 0
            }
            doc.trx.push(trxdetails);
           
            var tranx = doc.trx.id(id1);
            let Tranxamt = tranx.amt;
            let types = tranx.type;
            var total, totalAmount;
            await Hotel.findOne({ _id: req.body.hotelId }, {}, (err, data) => {
                if (types == 'credit') {
                    data.amount = parseFloat(parseFloat(data.amount) + parseFloat(Tranxamt)).toFixed(2);
                    total = parseFloat(parseFloat(doc.totalBal) + parseFloat(Tranxamt)).toFixed(2);
                    doc.totalBal = total;
                    tranx.bal = total;
                     

                }
                if (types == 'debit') {
                    data.amount = parseFloat(parseFloat(data.amount) - parseFloat(Tranxamt)).toFixed(2);
                    total = parseFloat(parseFloat(doc.totalBal) - parseFloat(Tranxamt)).toFixed(2);
                    doc.totalBal = total;
                    tranx.bal = total;
                }

                data.save();
            })
            doc.save(function (err, docs) {
                if (err) {  }
                else {

                    return res.json({ 'success': true, 'message': 'Hotel account updated Successfully', 'docs': docs });
                }
            })

        }
    });
}
export const getDataofHotel = (req, res) => {
    HotelTransaction.find({ hotelid: req.params.id }, {}).exec((err, docs) => {
        if (err) {
            return res.json([]);
        }

        else {

            return res.json(docs);
        }
    });
}
export const hotelPaymentReportForAdmin = async (req, res) => {

    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    likeQuery = HelperFunc.findQueryBuilder(req.query, likeQuery);
    sortQuery['createdAt'] = -1;

    var skip = { "$skip": pageQuery.skip },
        limit = { "$limit": pageQuery.take };

    if (req.query.requestFrom == 'without_limit') {
        skip = { "$match": {} }
        limit = { "$match": {} }
    }


    let Datas = HotelPayment.aggregate(
        [
            {
                "$lookup": {
                    "localField": "hotel",
                    "from": "hotels",
                    "foreignField": "_id",
                    "as": "userinfo"
                }
            },
            { "$unwind": "$userinfo" },
            {
                "$lookup": {
                    "localField": "hotel",
                    "from": "trips",
                    "foreignField": "hotelid",
                    "as": "trxinfo"
                }
            },
            { "$unwind": "$trxinfo" },
            {
                "$group": {
                    "_id": '$hotel',
                    "hotelname": { $first: "$userinfo.fname" },
                    "amount": { $first: "$userinfo.amount" },

                    "count": { $sum: 1 },
                    "commision": { $sum: "$commision" },
                    "amttopay": { $sum: "$amttopay" },
                    //    "$userinfo":1 ,
                    "trx": { $push: "$trxinfo" },
                    "createdAt": { $first: "$userinfo.createdAt" },



                    "amttohotel": { $sum: "$amttohotel" },
                },
            },
            {
                $project:
                {
                    _id: 1,
                    hotelname: 1,
                    count: 1,
                    commision: mround('$commision', 2),
                    amttopay: mround('$amttopay', 2),
                    amttohotel: mround('$amttohotel', 2),
                    trx: 1,//"$userinfo.trx"
                    createdAt: 1,
                    amount: 1,
                }
            },

            {
                "$match": likeQuery
            },
            {
                "$sort": sortQuery
            },
            skip,
            limit,
        ]
    );
    try {
        var promises = await Promise.all([Datas]);
        res.header('x-total-count', promises[0].length);
        var resstr = promises[0];
        res.send(resstr);
    } catch (err) {
        return res.json([]);
    }

}

export const getHotelCommison = async (totalFare,hotelId) => {
   try {
       if (hotelId) {
           var hotelDetails = await Hotel.findOne({ _id : hotelId });
           if (hotelDetails){
               var commision = hotelDetails.commission;
               var commisionAmt = (Number(commision) * Number(totalFare)) / 100;
               return {
                   hotelcommisionAmt: commisionAmt.toFixed(2),
                   hotelcommision: commision,
               }
           }
       }else{
           return 0
       }
   } catch (error) {
       return 0
   }
}
export const hotelTrxReport = async (req, res) => {



    var hotelid = req.userId;
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);

    // if(req.cityWise == 'exists') likeQuery['scId'] = {"$in":req.scId}; 

    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var totalCount = 10;
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
    sortQuery['createdAt'] = -1;


    var skip = { "$skip": pageQuery.skip },
        limit = { "$limit": pageQuery.take };

    if (req.query.requestFrom == 'without_limit') {
        skip = { "$match": {} }
        limit = { "$match": {} }
    }
    let TotCnt = HotelTransaction.find({
        $and: [
            likeQuery,
            dateLikeQuery,
            { "hotelid": hotelid }
        ]
    }, {}).count();
    let Datas = HotelTransaction.find({
        $and: [
            likeQuery,
            dateLikeQuery,
            { "hotelid": hotelid }
        ]
    }, {}).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery); //have to catch Err
    try {
        var promises = await Promise.all([TotCnt, Datas]);
        res.header('x-total-count', promises[0]);
        var resstr = promises[1];
        res.send(resstr[0].trx);
    } catch (err) {
        return res.json([]);
    }

}
export const hotelPaymentAmount = (req, res) => {
    Hotel.find({ _id: req.userId }, { _id: 1, amount: 1 }).exec((err, docs) => {
        if (err) {
            return res.json([]);
        }
        else {
            return res.json(docs);
        }
    });
}
export const hotelTotalTripsCount = (req, res) => {
    Trips.find({ hotelid: req.userId }, { tripno: 1 }).exec((err, docs) => {
        if (err) {

            return res.json([]);
        }
        else {

            return res.json(docs);
        }
    });
}
/**
* Trip Stat
* @param {*} req 
* @param {*} res 
*/
export const tripStatForHotel = async (req, res) => {
  
    var currentYear = GFunctions.getCurrentYear();
    Trips.aggregate([
        {
            $match: {
                $and: [
                    { createdAt: { "$gte": new Date(currentYear + "-01-01"), "$lt": new Date(currentYear + "-12-31") } },
                   { hotelid: mongoose.Types.ObjectId(req.userId) }
                ]
            }
        },
        {
            $project:
            {
                paymentSts: 1, month: { $month: "$createdAt" }
            }
        },
        {
            $group: {
                _id: { paymentSts: "$paymentSts", month: "$month" },
                count: { $sum: 1 },
            }
        },
        {
            $group: {
                _id: "$_id.month",
                value: {
                    $push: {
                        "status": "$_id.paymentSts",
                        "count": "$count"
                    },
                },
                count: { $sum: "$count" }
            }
        },
    ], function (err, val) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(val);
        }
    });
}