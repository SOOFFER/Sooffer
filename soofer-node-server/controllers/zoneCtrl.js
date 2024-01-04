import Zone from '../models/zones.model';
import AirportZone from '../models/airportZone.model';
import Driver from '../models/driver.model';
import ServiceAvailableCities from '../models/serviceAvailableCities.model';
import * as HelperFunc from './adminfunctions';
import mongoose from 'mongoose';
import { json } from 'body-parser';
var inside = require('point-in-geopolygon');
import { insidePolygon } from 'geolocation-utils';
const moment = require('moment');
const _ = require('lodash');
const ObjectId = mongoose.Types.ObjectId;

export const addZoneToACity = (req,res) => {
	Zone.findOne({ "name": req.body.name }, {}, function (err, docs) {
		if (err) {
			return res.status(500).json({ 'success': false, 'message': 'Error on the server.', 'error': err.toString() });
		}
		if (docs != null)
			return res.status(401).json({ 'success': false, 'message': 'Zone Name already Exists.', 'docs': docs });
		var newDoc = new Zone({
			name: req.body.name,
			servicecityId: req.body.servicecityId,
		});
		var fixedPrice = req.body.fixedPrice;
            if (fixedPrice) {
                newDoc = new Zone(newDoc);
                _.forEach(fixedPrice, function (element, i) {
                    newDoc.fixedPrice.push(element);
                });
			}
		var geometry = req.body.geometry;
            if (geometry) {
                newDoc = new Zone(newDoc);
                _.forEach(geometry, function (element, i) {
                    newDoc.geometry.push(element);
                });
			}
		newDoc.save((err, data) => {
			console.log(err,"err")
			if (err) { return res.status(500).json({ 'success': false, 'message': 'Some Error', 'error': err }); }
			return res.json({ 'success': true, 'message': 'Data added successfully', 'data': data });
		});
	});
}

/**
 *   
 * @param {*} req 
 * @param {*} res 
 */
export const viewZoneToACity = async (req, res) => {
	var serviceCityId = req.params.id;
	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	var pageQuery = HelperFunc.paginationBuilder(req.query);
	var sortQuery = HelperFunc.sortQueryBuilder(req.query);
	let TotCnt = Zone.find(likeQuery).count();
	let Datas = await Zone.aggregate([
		{
			"$match": {
				servicecityId: mongoose.Types.ObjectId(serviceCityId)
			}
		},
		{
			"$lookup": {
				"localField": "servicecityId",
				"from": "serviceavailablecities",
				"foreignField": "_id",
				"as": "serviceCity"
			}
		},
		{ "$skip": pageQuery.skip },
		{ "$limit": pageQuery.take },
		{ "$sort": sortQuery },

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

export const updateZoneCity = (req, res) => {
	Zone.findOne({ "_id": req.body._id }).exec((err, docs) => {
		if (err) return res.status(500).json({ 'success': false, 'message': 'Error on the server.', 'error': err.toString() });
		if (docs == null) return res.status(401).json({ 'success': false, 'message': 'Zone Name already Exists.', 'docs': docs });
		docs.name = req.body.name;
		docs.servicecityId = req.body.servicecityId;
		var fixedPrice = req.body.fixedPrice;
		var newValues = fixedPrice;
            if (fixedPrice) {
				docs.fixedPrice = [];
                _.forEach(newValues, function (element, i) {
                    docs.fixedPrice.push(element);
                });
			}
		var geometry = req.body.geometry;		
		var newGeoValues = geometry;
            if (geometry) {
				docs.geometry = [];
                _.forEach(newGeoValues, function (element, i) {
                    docs.geometry.push(element);
                });
			}
			docs.save((err, data) => {
			if (err) { return res.status(500).json({ 'success': false, 'message': 'Some Error', 'error': err }); }
			return res.json({ 'success': true, 'message': 'Data Updated successfully', 'data': data });
		});
	});
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const deleteZoneCity = (req, res) => {
	if (req.params.id) {
		Zone.findByIdAndRemove(req.params.id, (err, docs) => {
			if (err) {
				return res.status(500).json({ 'success': false, 'message': 'Some Error' });
			}
			return res.status(200).json({ 'success': true, 'message': 'Details Updated successfully', docs });
		})
	}
	else
		return res.status(400).json({ 'success': true, 'message': 'Bad Request' });

}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const addAirZoneToACity = (req, res) => {

	AirportZone.findOne({ "name": req.body.name }, {}, function (err, docs) {
		if (err) {
			return res.status(500).json({ 'success': false, 'message': 'Error on the server.', 'error': err.toString() });
		}
		if (docs != null)
			return res.status(401).json({ 'success': false, 'message': 'Zone Name already Exists.', 'docs': docs });
		var LocArray = [];
		var locationArrType = typeof req.body.latlngArray;
		if (locationArrType == 'string') {
			req.body.latlngArray = JSON.parse(req.body.latlngArray);
		}
		if (req.body.latlngArray.length != 0) LocArray = [req.body.latlngArray];
		var newDoc = new AirportZone({
			name: req.body.name,
			price: req.body.price,
			geometry: {
				type: 'Polygon',
				coordinates: LocArray,
			},
			servicecityId: req.body.servicecityId,
		});
		newDoc.save((err, data) => {
			if (err) { return res.status(500).json({ 'success': false, 'message': 'Some Error', 'error': err }); }
			return res.json({ 'success': true, 'message': 'Data added successfully', 'data': data });
		});
	});
}

/**
 *  
 * @param {*} req 
 * @param {*} res 
 */
export const viewAirZoneToACity = async (req, res) => {
	var serviceCityId = req.params.id;
	var likeQuery = HelperFunc.likeQueryBuilder(req.query);
	var pageQuery = HelperFunc.paginationBuilder(req.query);
	var sortQuery = HelperFunc.sortQueryBuilder(req.query);
	let TotCnt = AirportZone.find(likeQuery).count();
	let Datas = await AirportZone.aggregate([
		{
			"$match": {
				servicecityId: mongoose.Types.ObjectId(serviceCityId)
			}
		},
		{
			"$lookup": {
				"localField": "servicecityId",
				"from": "serviceavailablecities",
				"foreignField": "_id",
				"as": "serviceCity"
			}
		},
		{ "$skip": pageQuery.skip },
		{ "$limit": pageQuery.take },
		{ "$sort": sortQuery },

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

export const updateAirZoneCity = (req, res) => {
	var LocArray = [];
	if (req.body.latlngArray.length != 0) LocArray = [req.body.latlngArray];

	let updateDoc = {
		"name": req.body.name,
		"servicecityId": req.body.servicecityId,
		"price": req.body.price,
		"geometry": {
			"type": "Polygon",
			"coordinates": LocArray
		}
	};
	let whereClause = {
		"_id": req.body._id
	};
	AirportZone.updateOne(whereClause, updateDoc, (err, doc) => {
		if (err) { return res.json({ 'success': false, 'message': 'Some Error', 'error': err }); }
		return res.json({ 'success': true, 'message': 'Zone  Updated Successfully', 'data': doc });
	})




}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const deleteAirZoneCity = (req, res) => {
	if (req.params.id) {
		ZoAirportZonene.findByIdAndRemove(req.params.id, (err, docs) => {
			if (err) {
				return res.status(500).json({ 'success': false, 'message': 'Some Error' });
			}
			return res.status(200).json({ 'success': true, 'message': 'Details Updated successfully', docs });
		})
	}
	else
		return res.status(400).json({ 'success': true, 'message': 'Bad Request' });

}


export const presentInZone = async (req, res) => {
	var locationToFind = [];
	locationToFind[1] = parseFloat(req.body.lat);
	locationToFind[0] = parseFloat(req.body.long);
	//=---------------------------------------------------------------------------------------------------------
	// var polygonFeature = {
	// 	"type": "FeatureCollection",
	// 	"features": []
	// }

	// let mapData = await Zone.find({}, {}).exec();
	// mapData.forEach(element => {
	// 	polygonFeature.features.push({
	// 		"type": "Feature",
	// 		"geometry":
	// 		{
	// 			"type": "Polygon",
	// 			"coordinates": element.geometry.coordinates
	// 		},
	// 		"properties":element

	// 	});
	// });

	// let finalData = inside.feature(polygonFeature, locationToFind);
	// if (finalData != -1)
	// 	return res.status(200).json({ "finalData": finalData, "polygonFeature":polygonFeature });
	// else
	// 	return res.status(200).json({ finalData: "No Data Found", "polygonFeature": polygonFeature });
	//-------------------------------------------------------------------------------------------------------

	let finalData = await Zone.find(
		{ geometry: { $geoIntersects: { $geometry: { type: "Point", coordinates: locationToFind } } } }, {}

		// { geometry: { $geoWithin: { $geometry:   { type: "Polygon", coordinates:  [ [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0 ] ] ] }}   } },{}

	).exec();
	res.json({ "finalData": finalData })
	//----------------------------------------------------------------------------------------------------------
	//latlng
	//arraypalaym,madurai 78.102750,9.936150

	//chinnachokikulam,maduari 78.1284927,9.9349851

	//vilangudi,madurai   9.94968,78.0819212
	// 	national bank->lat:9.8818533
	// long:78.0695562


	//poriyalar nagar->.9806947,78.1417506
	//smi->9.9813546,78.1423482
	//yadava  college-.9.9831145,78.139053
}


export const updateAirportZoneData = async (driverId, driverLat, driverLng) => {
	var params = {
		lat: driverLat,
		lng: driverLng,
	}
	let driverData = await Driver.findById(driverId, { curStatus: 1 }).exec();
	// console.log(driverData)
	if (driverData.curStatus == "free") {
		let inAirport = await checkInAirportZone(params);
		console.log(inAirport)
		if (inAirport == null) { // not in airport zone
			// remove airport-id from the driver doc & remove driver-id in airport zone doc 
			let driverData = await Driver.findById(driverId, { airportZone: 1, queueId: 1, queueTime: 1 }).exec();
			if (driverData.airportZone != null) {
				AirportZone.findById(driverData.airportZone, { driversList: 1 }, function (err, data) {
					if (err) { console.log('error') }
					data.driversList.remove(driverData.queueId);
					data.save();
				});
				Driver.findOneAndUpdate({ _id: driverId }, { airportZone: null, queueId: null, queueTime: null }, { new: true }).exec();
			}
		} else { //in the airport zone
			//push driver-id in airport zone doc & set airport-id and queue-id on the driver doc			
			var driverDetails = {
				driverId: driverId,
				created: moment(),
				_id: new ObjectId
			}
			AirportZone.findOne({ _id: mongoose.Types.ObjectId(inAirport) }, { driversList: 1 }, function (err, docs) {
				console.log(docs.driversList.length);
				if (docs.driversList) {
					if (docs.driversList.length != 0) {
						// check the driver already present in stock
						var driverPresence = _.filter(docs.driversList, { 'driverId': mongoose.Types.ObjectId(driverId) });
						// console.log(driverPresence)
						if (driverPresence.length == 0) { //driver not present
							insertDriverIntoStackAndUpdateDriverDoc(inAirport, driverDetails);
						}

					} else {// no drivers on the stock still now
						insertDriverIntoStackAndUpdateDriverDoc(inAirport, driverDetails);
					}
				} else {
					insertDriverIntoStackAndUpdateDriverDoc(inAirport, driverDetails);
				}
			});

		}
	}
}

function insertDriverIntoStackAndUpdateDriverDoc(airportId, driverData) {
	console.log(driverData);
	console.log(airportId);
	AirportZone.findOneAndUpdate({ _id: airportId }, {
		$push: { driversList: driverData }
	}, { new: true }).exec();

	Driver.findOneAndUpdate({ _id: driverData.driverId }, { airportZone: airportId, queueId: driverData._id, queueTime: driverData.created }, { new: true }).exec();

}

export const checkInAirportZone = async (params) => {
	var serviceCityId = [];
	let zoneId = [];
	let availableService = await ServiceAvailableCities.find({ "softDelete": false }, { "cityBoundaryPolygon": 1, "city": 1 }).lean();
	let dropPoint = false;
	for (var value of availableService) {
		if (value.city == "Default") {
			// serviceCityId.push(value._id)
		} else {
			dropPoint = insidePolygon([parseFloat(params.lng), parseFloat(params.lat)], value.cityBoundaryPolygon)
			if (dropPoint) {
				serviceCityId.push(value._id)
				break;
			}
		}
	}
	if (dropPoint == true) {
		var ZoneData = await AirportZone.find({ servicecityId: serviceCityId[0] }, { geometry: 1, name: 1, price: 1 }).exec();
		let airportZone = false;
		for (var value of ZoneData) {
			airportZone = insidePolygon([parseFloat(params.lng), parseFloat(params.lat)], value.geometry.coordinates[0]);
			if (airportZone) {
				zoneId.push(value._id)
				break;
			}
		}
		if (airportZone == true) {
			return zoneId[0];
		} else {
			return null;
		}
	} else {
		return null;
	}
}

export const getAirportDrivers = (zoneId) => {
	let driversArr = AirportZone.findById({ _id: mongoose.Types.ObjectId(zoneId) }, { driversList: 1 }).exec();
	// console.log(driversArr);
	return driversArr;
}

//Update driver online time if he is on the airport zone
export const updateAirportZoneQueueTime = async (driverId) => {
	var nowTime = moment();
	let driverData = await Driver.findById(driverId, { airportZone: 1, queueId: 1, queueTime: 1 }).exec();
	if (driverData.airportZone != null) { // Driver in some airportzone
		AirportZone.findById(driverData.airportZone, { driversList: 1 }, function (err, data) {
			if (err) { console.log('error') }
			var driverDoc = data.driversList.id(driverData.queueId);
			driverDoc.created = nowTime;
			data.save();
		});
		Driver.findOneAndUpdate({ _id: driverId }, { queueTime: nowTime }, { new: true }).exec();
	}
}


