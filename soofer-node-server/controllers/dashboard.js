// ./express-server/controllers/todo.server.controller.js
import mongoose from 'mongoose';
import path from 'path';
import * as HelperFunc from './adminfunctions';
const mround = require('mongo-round');
const url = require('url');
const async = require('async');
import * as GFunctions from './functions';
var config = require('../config');
const moment = require("moment");
const _ = require('lodash');

//import models 
import Countries from '../models/common.model';
import State from '../models/commonState.model';
import City from '../models/commonCity.model';
import CmnData from '../models/commonData.model';
import CarMake from '../models/CarMake.model';
import CompanyDetails from '../models/company.model';
import ContactUs from '../models/contactus.model';
import Vehicletype from '../models/vehicletype.model';
import Trips from '../models/trips.model';
import Driver from '../models/driver.model';
import Rider from '../models/rider.model';
import DriverPayment from '../models/driverpayment.model';
import { convertSTO } from './onebyonerequest';

/**
 * Get dashboardPanel1
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const dashboardPanel1 = async (req, res) => {
	var resObj = {
		DriverCnt: 0,
		RiderCnt: 0,
		CmpCnt: 0,
		VehicleCnt: 0,
	}
	var singleQuery = {}, multiQuery = {};
	if (req.cityWise == 'exists') {
		singleQuery['scId'] = { "$in": req.scId };
		multiQuery['scIds.scId'] = { "$in": req.scId };
	}

	let DriverCnt = Driver.find(singleQuery).count(), RiderCnt = Rider.find(singleQuery).count(), CmpCnt = CompanyDetails.find(multiQuery).count(), VehicleCnt = Vehicletype.find(multiQuery).count();

	/* let DriverCnt = Driver.find({
	  $and: [
		singleQuery,
		{ "softdel": "active" }
	  ]
	}).count(), RiderCnt = Rider.find().count(), CmpCnt = CompanyDetails.find(multiQuery).count(), VehicleCnt = Vehicletype.find(multiQuery).count();
   */
	try {
		var promises = await Promise.all([DriverCnt, RiderCnt, CmpCnt, VehicleCnt]);

		var resstr = JSON.stringify(promises);
		resstr = resstr.substr(1).slice(0, -1);
		var resarray = resstr.split(",");
		resObj.DriverCnt = resarray[0] ? resarray[0] : 0;
		resObj.RiderCnt = resarray[1] ? resarray[1] : 0;
		resObj.CmpCnt = resarray[2] ? resarray[2] : 0;
		resObj.VehicleCnt = resarray[3] ? resarray[3] : 0;
		return res.status(200).json(resObj);

	} catch (err) {
		return res.status(200).json(resObj);
	}

}

/**
 * Get dashboardPanel2
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const dashboardPanel2 = async (req, res) => {
	var resObj = {
		totalTrips: 0,
		ongoing: 0,
		canceled: 0,
		completed: 0,
	}

	let DriverCnt = Trips.find({}, { "status": 1 });
	try {
		var promises = await Promise.all([DriverCnt]);
	} catch (err) {
		return res.status(200).json(resObj);
	}
	var allTrips = promises[0];
	var completedTrips = allTrips.filter((trip) => trip.status == 'Finished');
	var canceledTrips = allTrips.filter((trip) => trip.status == 'Cancelled');
	var noresponseTrips = allTrips.filter((trip) => trip.status == 'noresponse');
	canceledTrips = canceledTrips.length + noresponseTrips.length;
	var totalOngoing = allTrips.length - completedTrips.length - canceledTrips;

	resObj.totalTrips = allTrips.length;
	resObj.completed = completedTrips.length;
	resObj.ongoing = totalOngoing;
	resObj.canceled = canceledTrips;
	return res.status(200).json(resObj);

}

/**
 * Recent Registered user
 * @param {*} req 
 * @param {*} res 
 */
export const recentUsers = async (req, res) => {
	var resObj = {};
	var singleQuery = {};
	if (req.cityWise == 'exists') {
		singleQuery['scId'] = { "$in": req.scId };
	}

	let DriverCnt = Driver.find(singleQuery, { fname: 1, email: 1, phone: 1, profile: 1 }).sort([['createdAt', -1]]).limit(10),
		RiderCnt = Rider.find(singleQuery, { fname: 1, email: 1, phone: 1, profile: 1 }).sort([['createdAt', -1]]).limit(10);
	try {
		var promises = await Promise.all([DriverCnt, RiderCnt]);
	} catch (err) {
		return res.status(200).json(resObj);
	}
	return res.status(200).json(promises);
}


/**
 * Active users
 * @param {*} req 
 * @param {*} res 
 */
export const activeUsers = async (req, res) => {
	var resObj = {};
	var singleQuery = {};
	if (req.cityWise == 'exists') {
		singleQuery['scId'] = { "$in": req.scId };
	}
	if (req.type == 'company') singleQuery['cmpy'] = mongoose.Types.ObjectId(req.userId);
	let DriverCnt = Driver.aggregate([
		{ "$match": singleQuery },
		{
			"$group": {
				"_id": "$softdel",
				"count": { $sum: 1 }
			},
		}
	]);

	let RiderCnt = Rider.aggregate([
		{ "$match": singleQuery },
		{
			"$group": {
				"_id": "$softdel",
				"count": { $sum: 1 }
			},
		}
	]);

	try {
		var promises = await Promise.all([DriverCnt, RiderCnt]);

		return res.status(200).json(promises);
	} catch (err) {
		return res.status(200).json(resObj);
	}

}

/**
 * Revenue Amount 
 * @param {*} req 
 * @param {*} res 
 */
export const revenueStat = async (req, res) => {
	var startDate = moment(req.query.date).startOf(req.query.status).format('YYYY-MM-DD'),
		endDate = moment(req.query.date).endOf(req.query.status).format('YYYY-MM-DD');
	var query = { $dayOfMonth: "$createdAt" };
	if (req.query.status == "year") {
		query = { $month: "$createdAt" };
	}
	var currentYear = GFunctions.getCurrentYear();
	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	likeQuery['createdAt'] = { $gte: new Date(startDate), $lt: new Date(endDate) }
	let Datas = DriverPayment.aggregate([
		{
			//$match: { createdAt: { "$gte": new Date(currentYear + "-01-01"), "$lt": new Date(currentYear + "-12-31") } }
			$match: likeQuery
		},
		{
			$group: {
				//_id: { $month: "$createdAt" },  
				_id: query,
				amttopay: { $sum: "$amttopay" },
				promoamt: { $sum: "$promoamt" },
				digital: { $sum: "$digital" },
				inhand: { $sum: "$inhand" },
				amttodriver: { $sum: "$amttodriver" },
				commision: { $sum: "$commision" },
				date: { $first: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } },
			}
		},
	]);
	try {
		var promises = await Promise.all([Datas]);
		var resstr = promises[0];
		res.send(resstr);
	} catch (err) {
		return res.json([]);
	}
}


// /**
//  * Revenue Amount 
//  * @param {*} req 
//  * @param {*} res 
//  */
// export const revenueStat = async (req, res) => { 
//   DriverPayment.aggregate([
//     {
//       $match: {   
//         createdAt: { $gte: new Date("2013-01-03T20:15:31Z").toISOString() }
//       }
//     },  
//   ], function (err, val) {
//     if (err) {
//       res.send(err);
//     }
//     else {
//       res.send(val);
//     }
//   });
// }



/**
 * Trip Stat
 * @param {*} req 
 * @param {*} res 
 */
export const tripStat = async (req, res) => {
	var currentYear = GFunctions.getCurrentYear();
	var startDate = moment(req.query.date).startOf(req.query.status).format('YYYY-MM-DD'),
		endDate = moment(req.query.date).endOf(req.query.status).format('YYYY-MM-DD');
	var query = { $dayOfMonth: "$createdAt" };
	if (req.query.status == "year") {
		query = { $month: "$createdAt" };
	}

	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	likeQuery['createdAt'] = { $gte: new Date(startDate), $lt: new Date(endDate) }

	var Datas = Trips.aggregate([
		{
			//$match: { createdAt: { "$gte": new Date(currentYear + "-01-01"), "$lt": new Date(currentYear + "-12-31") } }
			$match: likeQuery
		},
		{
			$project:
			{
				paymentSts: 1, month: query, date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },//month: { $month: "$createdAt" }
			}
		},
		{
			$group: {
				_id: { paymentSts: "$paymentSts", month: "$month" },
				count: { $sum: 1 },
				date: { $first: "$date" }
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
				count: { $sum: "$count" },
				date: { $first: "$date" }
			}
		},
		{
			$project: {
				_id: "$_id",
				value: {
					$filter: {
						input: "$value",
						as: "item",
						cond: { $eq: ["$$item.status", "Paid"] }
					}
				},
				count: "$count",
				date: "$date"
			}
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
 * Get Trip Status Count
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export const tripCountStat = async (req, res) => {
	var resObj = {
		totalTrips: 0,
		ongoing: 0,
		canceled: 0,
		completed: 0,
		noresponse: 0,
	}

	var currentYear = GFunctions.getCurrentYear();
	var startDate = moment(req.query.date).startOf(req.query.status).format('YYYY-MM-DD'),
		endDate = moment(req.query.date).endOf(req.query.status).format('YYYY-MM-DD');

	if (req.query.status == "month") endDate = moment(req.query.date).endOf(req.query.status).add(1, 'day').format('YYYY-MM-DD');
	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	likeQuery['createdAt'] = { $gte: new Date(startDate), $lt: new Date(endDate) }

	//let DriverCnt = Trips.find({ createdAt: { "$gte": new Date(currentYear + "-01-01"), "$lt": new Date(currentYear + "-12-31") } } , { "status": 1 });
	let DriverCnt = Trips.find(likeQuery, { "status": 1 });
	try {
		var promises = await Promise.all([DriverCnt]);
	} catch (err) {
		return res.status(200).json(resObj);
	}
	var allTrips = promises[0];
	var completedTrips = allTrips.filter((trip) => trip.status == 'Finished');
	var canceledTrips = allTrips.filter((trip) => trip.status == 'Cancelled');
	resObj.canceled = canceledTrips.length;
	var noresponseTrips = allTrips.filter((trip) => trip.status == 'noresponse');
	canceledTrips = canceledTrips.length + noresponseTrips.length;
	var totalOngoing = allTrips.length - completedTrips.length - canceledTrips;

	resObj.totalTrips = allTrips.length;
	resObj.completed = completedTrips.length;
	resObj.ongoing = totalOngoing;
	resObj.noresponse = noresponseTrips.length;
	return res.status(200).json(resObj);
}

/**
 * Rider Count Stat
 * @param {*} req 
 * @param {*} res 
 */
export const riderCountStat = async (req, res) => {
	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	var currentYear = GFunctions.getCurrentYear();
	likeQuery['createdAt'] = { "$gte": new Date(currentYear + "-01-01"), "$lt": new Date(currentYear + "-12-31") }
	Rider.aggregate()
		.match(likeQuery)
		.project({ month: { $month: "$createdAt" } })
		.group({ _id: "$month", count: { $sum: 1 } })
		.exec(function (err, response) {
			if (err) res.send(err);
			res.send(response);
		}
		);
}

/**
 * Heat Map Stat
 * @param {*} req 
 * @param {*} res 
 */
export const heatMap = async (req, res) => {
	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	var pageQuery = HelperFunc.paginationBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	if (req.type == 'company') likeQuery['cpyid'] = mongoose.Types.ObjectId(req.userId);
	var dateLikeQuery = HelperFunc.findQueryBuilder(req.query, {});
	let Datas = Trips.aggregate([
		{ "$match": { $and: [dateLikeQuery, likeQuery] } },
		{ $unwind: '$dsp' },
		{
			$project: {
				_id: 0, lat: "$dsp.startcoords", scId: 1, scity: 1
			}
		},
		{ "$sort": { createdAt: -1 } },
		{ "$limit": 1000 },
		// { "$match": likeQuery },
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
 * Gods View
 * @param {*} req 
 * @param {*} res 
 */
export const godView = async (req, res) => {
	var vehicleFirst = await Vehicletype.findOne({}, { _id: 1, type: 1 }).sort([['displayorder', 1]]).exec();

	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	if (req.type == 'company') likeQuery['cmpy'] = { "$in": req.userId };
	var curService = req.params.type;
	var coords = [0, 0];
	var whereQuery = {};
	if (!curService) {
		whereQuery = { online: 1, curService: vehicleFirst.type, coords: { $ne: coords } };
	} else {
		if (curService == "ALL") {
			whereQuery = { online: 1, coords: { $ne: coords } };
		} else {
			whereQuery = { online: 1, curService: curService, coords: { $ne: coords } };
		}
	}
	Driver.find({
		$and: [
			likeQuery,
			whereQuery
		]
	}, { code: 1, fname: 1, email: 1, phone: 1, coords: 1, online: 1, currentTaxi: 1, curStatus: 1, curService: 1, curTrip: 1, scId: 1, scity: 1 }).limit(1000).exec((err, docs) => {
		if (err) {
			return res.json([]);
		}
		return res.json(docs);
	});
}

/**
 * driverTracking View
 * @param {*} req 
 * @param {*} res 
 */
export const driverTracking = async (req, res) => {
	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	if (req.type == 'company') likeQuery['cmpy'] = { "$in": req.userId };

	var vehicleFirst = await Vehicletype.findOne(likeQuery, { _id: 1, type: 1 }).sort([['displayorder', 1]]).exec();
	var curService = req.params.type;
	var coords = [0, 0];
	var whereQuery = {};
	if (!curService) {
		whereQuery = { curService: vehicleFirst.type, coords: { $ne: coords } };
	} else {
		if (curService == "ALL") {
			whereQuery = { coords: { $ne: coords } };
		} else {
			whereQuery = { curService: curService, coords: { $ne: coords } };
		}
	}

	var maxDistanceInMeter = Number(20) * 1000;
	var pipeline1 = {
		"$geoNear": {
			"near": {
				"type": "Point",
				"coordinates": [parseFloat(req.query.lng), parseFloat(req.query.lat)]
			},
			"maxDistance": maxDistanceInMeter,
			"spherical": true,
			"distanceField": "distance",
			// "distanceMultiplier": 0.000621371
		}
	};
	if (req.query.scity_like != undefined) likeQuery['scity'] = { "$eq": req.query.scity_like };
	if (req.query.code_like != undefined) {
		likeQuery['$or'] = [{ "code": req.query.code_like }, { "phone": req.query.code_like }]
		delete likeQuery['code'];
	};
	var matchQuery = {
		"$match": {
			$and: [
				likeQuery,
				whereQuery
			]
		}
	};
	var project = {
		"$project": {
			"_id": "$_id",
			"fname": "$fname",
			"code": "$code",
			"coords": "$coords",
			"email": "$email",
			"phone": "$phone",
			"distance": "$distance",
			"online": "$online",
			"currentTaxi": "$currentTaxi",
			"curStatus": "$curStatus",
			"taxis": "$taxis",
			"scId": "$scId",
			"scity": "$scity",
			"curTrip": "$curTrip",
			"curService": "$curService"
		}
	};
	var aggregateQuery = [];
	if (req.query.lng) {
		aggregateQuery.push(pipeline1);
	}
	aggregateQuery.push(matchQuery);
	aggregateQuery.push(project);
	/* 	Driver.find({
		$and: [
			likeQuery,
			whereQuery
		]
	}, { code: 1, fname: 1, email: 1, phone: 1, coords: 1, online: 1, currentTaxi: 1, curStatus: 1, curService: 1, curTrip: 1, taxis: 1, scId: 1, scity: 1 }).limit(1000).exec((err, docs) => { */
	Driver.aggregate(aggregateQuery).exec((err, docs) => {
		if (err) {
			return res.json([]);
		}
		return res.json(docs);
	});
}

export const lowRatingUsers = async (req, res) => {
	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	likeQuery['rating.rating'] = { '$lte': config.lowRatingForUser }
	let LowDrivers = Driver.find(likeQuery, { fname: 1, _id: 1, rating: 1, code: 1, profile: 1 }).limit(10).sort({ "rating.rating": 1 }).exec();
	let LowUsers = Rider.find(likeQuery, { fname: 1, _id: 1, rating: 1, profile: 1 }).limit(10).sort({ "rating.rating": 1 }).exec();
	try {
		var promises = await Promise.all([LowDrivers, LowUsers]);
		return res.status(200).json({
			'lowRatingDriver': promises[0],
			'lowRatingRider': promises[1],
		});
	} catch (err) {
		return res.status(200).json({});
	}
}

export const ClientComplaints = (req, res) => {
	ContactUs.find({}, { status: 1, subject: 1 }, function (err, docs) {
		if (err) {
			return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
		}
		return res.send({ 'success': true, 'message': req.i18n.__("CLIENT_COMPLAINT_DETAILS"), 'docs': docs });
	});
}

/*export const getTotalTripDetails = async (req, res) => {


	var fromMonth = GFunctions.getCommonMonthStartDate();
	var fromDate = moment(fromMonth).format("YYYY-MM-DD");
	var toDate = moment(fromDate).add(1, 'M').format('YYYY-MM-DD')
	console.log("StartDate",new Date(fromDate))
	console.log("StartDate",new Date(toDate))
	var data = {
		totalTrips: 0,
		totalDriverEarned: 0,
		totalTripPayment: 0,
		totalTripCommision: 0,
	}

	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	likeQuery['createdAt'] = { $gte: new Date(fromDate), $lt: new Date(toDate) }

	let tripsCnt = DriverPayment.aggregate([

		{
			"$match": likeQuery
		},
		{
			"$project":
			{
				"amttodriver": 1,
				"commision": 1,
				"cashpaid": 1,
				"tripno": 1
			},
		},
		// {
		// 	"$group":
		// 	{
		// 		"_id": 0,
		// 		"amttodriver": { $sum: "$amttodriver" },
		// 		"commision": { $sum: "$commision" },
		// 		"cashpaid": { $sum: "$cashpaid" },
		// 		"count": { $sum: 1 },
		// 	}
		// }
	], function (err, op) {
			if (err) {
				return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
			}
			if (op.length) {
				// console.log(op);
				op = _.uniqBy(op, 'tripno');
				var totalTrips = op.length;
				var totalDriverEarned = _.sumBy(op, 'amttodriver');
				var totalTripPayment = _.sumBy(op, 'cashpaid');
				var totalTripCommision = _.sumBy(op, 'commision');
				// data = {
				// 	totalTrips: (op[0].count).toFixed(2),
				// 	totalDriverEarned: (op[0].amttodriver).toFixed(2),
				// 	totalTripPayment: (op[0].cashpaid).toFixed(2),
				// 	totalTripCommision: (op[0].commision).toFixed(2),
				// }
				data = {
					totalTrips: totalTrips.toFixed(2),
					totalDriverEarned: (totalDriverEarned).toFixed(2),
					totalTripPayment: (totalTripPayment).toFixed(2),
					totalTripCommision: (totalTripCommision).toFixed(2),
				}
			}
			return res.send({ 'success': true, 'message': req.i18n.__("TRIP_DETAILS"), 'docs': data });
		});
}*/

export const getTotalTripDetails = async (req, res) => {


	var fromMonth = GFunctions.getCommonMonthStartDate();
	var fromDate = moment(fromMonth).format("YYYY-MM-DD");
	var toDate = moment(fromDate).add(1, 'M').format('YYYY-MM-DD')
	var data = {
		totalTrips: 0,
		totalDriverEarned: 0,
		totalTripPayment: 0,
		totalTripCommision: 0,
	}

	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	likeQuery['createdAt'] = { $gte: new Date(fromDate), $lt: new Date(toDate) }
	likeQuery['status'] = "Finished"
	let tripsCnt = Trips.aggregate([

		{
			"$match": likeQuery
		},
		{
			"$project":
			{
				"amttodriver": '$acsp.comison',
				"commision": '$acsp.comison',
				"cashpaid": '$acsp.cost',
				"tripno": 1
			},
		},
		{
			"$group":
			{
				"_id": 0,
				"amttodriver": { $sum: "$amttodriver" },
				"commision": { $sum: "$commision" },
				"cashpaid": { $sum: "$cashpaid" },
				"count": { $sum: 1 },
			}
		}
	]).exec((err, op) => {
		if (err) {
			return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
		}
		if (op.length) {
			var totalDriverEarned = (op[0].cashpaid) - (op[0].commision)
			data = {
				totalTrips: (op[0].count).toFixed(2),
				totalDriverEarned: totalDriverEarned.toFixed(2),
				totalTripPayment: (op[0].cashpaid).toFixed(2),
				totalTripCommision: (op[0].commision).toFixed(2),
			}
		}
		return res.send({ 'success': true, 'message': req.i18n.__("TRIP_DETAILS"), 'docs': data });
	});
}

export const getTripEarningReport = async (req, res) => {
	var filterType = req.params.filterType;
	if (!filterType) filterType = 'daily';

	if (filterType == 'daily') {
		var fromMonth = GFunctions.getISODateADayBuffer();
		var toDate = moment(fromMonth).format("YYYY-MM-DD");
		var fromDate = moment(toDate).subtract(1, 'days').format('YYYY-MM-DD')
	} else if (filterType == 'weekly') {
		var fromMonth = GFunctions.getISODateADayBuffer();
		var toDate = moment(fromMonth).format("YYYY-MM-DD");
		var fromDate = moment(toDate).subtract(7, 'days').format('YYYY-MM-DD')
	} else if (filterType == 'monthly') {
		var fromMonth = GFunctions.getCommonMonthStartDate();
		var fromDate = moment(fromMonth).format("YYYY-MM-DD");
		var toDate = moment(fromDate).add(1, 'M').format('YYYY-MM-DD')
	}

	var data = {
		totalTrips: 0,
		totalDriverEarned: 0,
		totalTripPayment: 0,
		totalTripCommision: 0,
	}

	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	if (req.cityWise == 'exists') likeQuery['scId'] = { "$in": req.scId };
	likeQuery['createdAt'] = { $gte: new Date(fromDate), $lt: new Date(toDate) }

	DriverPayment.aggregate([

		{
			"$match": likeQuery
		},
		{
			"$project":
			{
				"amttodriver": 1,
				"commision": 1,
				"cashpaid": 1,
			},
		},
		{
			"$group":
			{
				"_id": 0,
				"amttodriver": { $sum: "$amttodriver" },
				"commision": { $sum: "$commision" },
				"cashpaid": { $sum: "$cashpaid" },
				"count": { $sum: 1 },
			}
		}
	]).exec((err, op) => {
		if (err) {
			return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
		}
		if (op.length) {
			data = {
				totalTrips: (op[0].count).toFixed(2),
				totalDriverEarned: (op[0].amttodriver).toFixed(2),
				totalTripPayment: (op[0].cashpaid).toFixed(2),
				totalTripCommision: (op[0].commision).toFixed(2),
			}
		}
		return res.send({ 'success': true, 'message': req.i18n.__("TRIP_DETAILS"), 'docs': data });
	});
}