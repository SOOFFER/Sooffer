import mongoose from 'mongoose';
import path from 'path';
import * as HelperFunc from './adminfunctions';
const url = require('url');
var util = require('util');
var request = require('async-request');
const randomize = require('randomatic');
const moment = require('moment');
const _ = require('lodash');
var cachegoose = require('cachegoose');
var config = require('../config');

import ServiceAvailableCities from '../models/serviceAvailableCities.model';
import cityWiseOffice from '../models/citywiseOffice.model';
import cityWiseConfig from '../models/citywiseConfig.model';
import ZoneCity from '../models/zoneCity.model';

cachegoose(mongoose, {
    // engine: 'redis',    /* If you don't specify the redis engine,      */
    port: 6379,         /* the query results will be cached in memory. */
    host: 'localhost'
});

/**
 *getAvailbleservice cities
 * @param {*} req 
 * @param {*} res 
 */
export const getAvailableServiceCity = (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    likeQuery['softDelete'] = false;
    // likeQuery['status'] = true
    if (req.type != 'dispatcher') {
        if (req.cityWise == 'exists') likeQuery['_id'] = { "$in": req.scId };
    }
    // likeQuery['city'] = { '$ne': "Default" }
    ServiceAvailableCities.aggregate([
        { "$match": likeQuery },
        {
            "$project": {
                "_id": 1,
                "city": 1,
                "cityId": 1,
                "stateId": 1,
                "countryId": 1,
                "softDelete": 1,
                "status": 1,
                "nearby": 1,
                "label": "$city",
                "value": "$_id",
                "currency": 1,
                "requestRadius": 1,
                "rentalRequestRadius": 1,
                "outstationRequestRadius": 1,
                "centerPoint": 1,
                "approxBoundaryKMFromCenter": 1,
                "driverPrefixCode": 1,
                "tripPrefixCode": 1
            }
        }
    ]).exec((err, docs) => {
        if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__('SEVER_ERROR'), 'error': err.toString() }) }
        //return res.status(200).json(docs);
        res.send(docs)
    });
};

export const getCityBoundaryPolygonForANewCity = async (req, res) => {
    try {
        if (req.query.city == "" || req.query.city == undefined) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("CITY_EMPTY") }) }
        //if(req.query.city != "Madurai"){ return res.status(409).json({'success':false,'message':req.i18n.__("DATA_NOT_FOUND")})}
        let response;
        response = await request("https://nominatim.openstreetmap.org/search.php?q=" + req.query.city + "&polygon_geojson=1&format=json", {
            method: 'GET',
            headers: {
                useragent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
                referer: 'https://github.com/xbgmsharp/node-nominatim2',
                polygon_geojson: 1,
                format: 'json'
            },
        });

        if (typeof response === "string") {
            response = JSON.parse(response);
        }

        if (response.statusCode === 200) {
            let body = response.body;
            body = JSON.parse(body);
            let cityBoundaryPolygon = [];
            if (body.length !== 0) {
                cityBoundaryPolygon = body[0]["geojson"]["coordinates"];
            }
            return res.status(200).json({ 'success': true, 'message': req.i18n.__("FETECHED_SUCCESS"), 'data': cityBoundaryPolygon })
        }
    }
    catch (error) {
        return res.status(409).json({ 'success': false, 'message': error.toString() });
    }
}

export const getCityBoundaryPolygon = (req, res) => {
    ServiceAvailableCities.find({ "$or": [{ "city": req.params.city }, { "cityCode": req.params.city }, { "cityId": req.params.city }] }, {}).exec((err, docs) => {
        if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__('SEVER_ERROR'), 'error': err.toString() }) }
        if (docs.length == 0) { return res.status(409).json({ 'success': false, 'message': req.i18n.__("DATA_NOT_FOUND") }) }
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("FETECHED_SUCCESS"), 'data': docs });
    });
}

export const addServiceAvailableCity = (req, res) => {

    ServiceAvailableCities.find({ "city": req.body.city, softDelete: false }, {}, { "sort": { "createdAt": -1 } }, function (err, docs) {
        if (err) {
            return res.status(500).json({ 'success': false, 'message': req.i18n.__('SEVER_ERROR'), 'error': err.toString() });
        }
        if (docs.length > 0) {
            if (docs[0].softDelete == false && docs[0].status == true) return res.status(409).json({ 'status': false, 'message': req.i18n.__('CITY_EXISTS_ACTIVE') });
            else if (docs[0].softDelete == false && docs[0].status == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__('CITY_EXISTS_INACTIVE') });
            //else if (docs.status == true && req.body.status == true) return res.status(401).json({ 'status': false, 'message': req.i18n.__('CITY_EXISTS') });
        }
        var LocArray = [];
        if (req.body.cityBoundaryPolygon.length != 0) LocArray = [req.body.cityBoundaryPolygon];

        var newDoc = new ServiceAvailableCities({
            city: req.body.city,
            cityId: req.body.cityId,
            cityBoundaryPolygon: req.body.cityBoundaryPolygon,
            stateId: req.body.stateId,
            countryId: req.body.countryId,
            currency: req.body.currency,

            geometry: {
                type: "Polygon",
                coordinates: LocArray
            },
            requestRadius: req.body.requestRadius,
            rentalRequestRadius: req.body.rentalRequestRadius,
            outstationRequestRadius: req.body.outstationRequestRadius,
            centerPoint: [req.body.centerLng, req.body.centerLat],
            approxBoundaryKMFromCenter: req.body.approxBoundaryKMFromCenter,
            driverPrefixCode: req.body.driverPrefixCode,
            tripPrefixCode: req.body.tripPrefixCode,
        });
        newDoc.save((err, datas) => {
            if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
            return res.json({ 'success': true, 'message': req.i18n.__('DATA_ADDED_SUCCESS'), 'data': datas });
        });
    });
}

export const updateServiceAvailableCity = async (req, res) => {

    try {
        let serviceAvailableDocs = await ServiceAvailableCities.findOne({ city: "Default" });

        if (serviceAvailableDocs._id == req.body._id && serviceAvailableDocs.city == req.body.city) {
            return res.status(409).json({ 'success': false, 'message': req.i18n.__("UPDADATE_DEFAULT_CITY") })
        }
        ServiceAvailableCities.find({ "city": req.body.city, "cityId": req.body.cityId, softDelete: false }, {}, { "sort": { "createdAt": -1 } }, function (err, docs) {
            if (err) {

                return res.status(500).json({ 'success': false, 'message': req.i18n.__('SEVER_ERROR'), 'error': err.toString() });
            }
            if (docs.length > 0 && docs[0]._id != req.body._id) {
                if (req.body.status == 'true' || req.body.status == true) { var bodyStatus = true }
                else if (req.body.status == 'false' || req.body.status == false) { var bodyStatus = false }

                if (docs[0].status == true && bodyStatus == true || docs[0].status == true && bodyStatus == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__('CITY_EXISTS_ACTIVE') });
                else if (docs[0].softDelete == false && docs[0].status == false) return res.status(409).json({ 'status': false, 'message': req.i18n.__('CITY_EXISTS_INACTIVE') });
                else if (docs[0].softDelete == false && docs[0].status == true && bodyStatus == true) return res.status(401).json({ 'status': false, 'message': req.i18n.__('CITY_EXISTS') });
            }
            var LocArray = [];

            let updateDoc = {
                "city": req.body.city,
                "cityId": req.body.cityId,
                // "status": req.body.status,
                "softDelete": req.body.softDelete,
                "stateId": req.body.stateId,
                "countryId": req.body.countryId,
                "currency": req.body.currency,
                "geometry": {
                    "type": "Polygon",
                    "coordinates": LocArray
                },
                requestRadius: req.body.requestRadius,
                rentalRequestRadius: req.body.rentalRequestRadius,
                outstationRequestRadius: req.body.outstationRequestRadius,
                centerPoint: [req.body.centerLng, req.body.centerLat],
                approxBoundaryKMFromCenter: req.body.approxBoundaryKMFromCenter,
                // driverPrefixCode: req.body.driverPrefixCode,
                // tripPrefixCode: req.body.tripPrefixCode,
            };
            /*if ((req.body.cityBoundaryPolygon) != undefined && (req.body.cityBoundaryPolygon).length) {
                LocArray = [req.body.cityBoundaryPolygon];
                updateDoc.cityBoundaryPolygon = LocArray
            }*/
            let whereClause = {
                "_id": req.body._id
            };
            ServiceAvailableCities.updateOne(whereClause, updateDoc, (err, doc) => {
                if (err) { return res.json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
                return res.json({ 'success': true, 'message': req.i18n.__('SERVICE_UPDATE_SUCCESS'), 'data': doc });
            })
        });
    }
    catch (err) {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR.."), 'error': err.toString() })
    }
}

export const deleteServiceAvailableCity = async (req, res) => {
    let newDoc = {
        "softDelete": true,
        "status": true,
    }
    let whereClause = {
        "_id": req.params._id
    };
    try {
        let serviceCitiesDocs = await ServiceAvailableCities.findOne({ city: "Default" });
        if (serviceCitiesDocs.cityId == req.params.cityId) {
            return res.status(409).json({ 'success': false, 'message': req.i18n.__("DELETE_DEFAULT_CITY") })
        }
        ServiceAvailableCities.updateOne(whereClause, newDoc, function (err, docs) {
            if (err) { return res.status(500).json({ 'status': false, 'message': req.i18n.__('SEVER_ERROR'), 'errer': err.toString() }) }
            return res.json({ 'success': true, 'message': req.i18n.__('DELETED_SUCCESS') })
        })
    }
    catch (err) {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR.."), 'error': err.toString() })
    }
};

export const serviceAvailableCityNearby = async (req, res) => {
    var updateData = {
        city: req.body.city,
        cityId: req.body.cityId
    }
    ServiceAvailableCities.findByIdAndUpdate(req.params.id, {
        $push: { nearby: updateData }
    }, { 'new': true },
        function (err, doc) {
            if (err) {
                return res.status(500).json({ 'success': false, 'message': err.message, 'err': err });
            }
            return res.json({ 'success': true, 'message': ('NEAR_CITY_ADDED'), 'data': doc });
        }
    );
}

export const delServiceAvailableCityNearby = async (req, res) => {
    ServiceAvailableCities.findOne({ _id: req.params.id }).exec((err, docs) => {
        if (err) return res.json({ 'success': false, 'message': ('SOME_ERROR'), 'error': err });
        if (!docs) return res.json({ 'success': false, 'message': ('SERVICE_NOT_AVAILABLE'), 'dvr': req.body.driver });
        docs.nearby.remove(req.params.nearbyId);
        docs.save(function (err, op) {
            if (err) return res.json({ 'success': false, 'message': ('SOME_ERROR'), 'error': err });
            return res.json({ 'success': true, 'message': ('DELETED_SUCCESS'), 'data': op });
        });
    })
}

export const updateCityBoundaryPolygon = (req, res) => {
    ServiceAvailableCities.findOneAndUpdate({ "city": req.params.city }, { "cityBoundaryPolygon": req.body.cityBoundaryPolygon }, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': ("SOME_ERROR"), 'error': err }) }
        if (!doc) return res.status(409).json({ 'success': false, 'message': ('SERVICE_NOT_AVAILABLE') });
        return res.status(200).json({ 'success': true, 'message': ("SERVICE_BOUNDARY_UPDATE_SUCCESS") })
    })
}

export const getOuterPolygon = (req, res) => {
    var response = {};
    ServiceAvailableCities.findOne({ "$or": [{ "city": req.params.city }, { "cityCode": req.params.city }, { "cityId": req.params.city }] }, {}).exec((err, docs) => {
        if (err) { return res.status(500).json({ 'status': false, 'message': ('SEVER_ERROR'), 'error': err.toString() }) }
        if (!docs) { return res.status(409).json({ 'success': false, 'message': ("DATA_NOT_FOUND") }) }
        response['outerPolygon'] = docs.outerPolygon
        if (docs.outerPolygon.length == 0) { response['outerPolygon'] = docs.cityBoundaryPolygon }
        return res.status(200).json({ 'success': true, 'message': ("FETECHED_SUCCESS"), 'data': [response] });
    });
}


export const updateOuterPolygon = (req, res) => {
    var LocArray = [];
    if (req.body.outerPolygon.length != 0) LocArray = [req.body.outerPolygon];
    ServiceAvailableCities.findOneAndUpdate({ "city": req.params.city }, {
        "outerPolygon": req.body.outerPolygon, "geometry.coordinates": LocArray
    }, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': ("SOME_ERROR"), 'error': err }) }
        if (!doc) return res.status(409).json({ 'success': false, 'message': ('SERVICE_NOT_AVAILABLE') });
        return res.status(200).json({ 'success': true, 'message': ("SERVICE_BOUNDARY_UPDATE_SUCCESS") })
    })
}

export const getServiceCity = (req, res) => {
    ServiceAvailableCities.find({}, { outerPolygon: 0, cityBoundaryPolygon: 0 }, function (err, docs) {
        if (err) { return res.status(500).json({ 'success': false, 'message': ("SOME_ERROR"), 'error': err }) }
        if (!docs) { return res.status(409).json({ 'success': false, 'message': ("DATA_NOT_FOUND") }) }
        return res.status(200).json({ 'success': true, 'message': ("FETECHED_SUCCESS"), 'data': docs });
    })
}


// =====================
// Service city data
// Office Data

export const addcityWiseOfficeData = (req, res) => {
    var newDoc = new cityWiseOffice(
        {
            address: req.body.address,
            mail: req.body.mail,
            phone: req.body.phone,
            phonetwo: req.body.phonetwo,
            isSupportNoEnable: req.body.isSupportNoEnable
        }
    );

    var scIds = req.body.scIds;
    scIds = JSON.parse(scIds);

    _.forEach(scIds, function (element, i) {
        newDoc.scIds.push(element);
    });

    newDoc.save((err, datas) => {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), err }); }
        //cachegoose.clearCache('OFFICE-CACHE-KEY');
        return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), datas });
    })
}

export const getcityWiseOfficeData = (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    sortQuery['displayorder'] = 1;
    var totalCount = 10;

    cityWiseOffice.find(likeQuery).count().exec((err, cnt) => {
        if (err) { }
        totalCount = cnt;
        cityWiseOffice.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec((err, docs) => {
            if (err) {
                return res.json([]);
            }
            res.header('x-total-count', totalCount);
            res.send(docs);
        });
    });
}

export const deletecityWiseOfficeData = (req, res) => {
    cityWiseOffice.findByIdAndRemove(req.params.id, (err, docs) => {
        if (err) {
            return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
        }
        //cachegoose.clearCache('OFFICE-CACHE-KEY');
        return res.json({ 'success': true, 'message': req.i18n.__("CITY_DATA_DELETED"), docs });
    })
};


export const updatecityWiseOfficeData = (req, res) => {
    const id = req.params.id;
    cityWiseOffice.findOne({ _id: id }).exec((err, doc) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("CITY_DATA_NOT_fOUND") });

        doc.address = req.body.address;
        doc.mail = req.body.mail;
        doc.phone = req.body.phone;
        doc.phonetwo = req.body.phonetwo;
        doc.isSupportNoEnable = req.body.isSupportNoEnable;

        let oldScIds = JSON.parse(req.body.oldScIds);
        //let oldScIds = req.body.oldScIds;
        var scIds = req.body.scIds;
        scIds = JSON.parse(scIds);
        //scIds = JSON.parse(scIds);

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
            if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
            //cachegoose.clearCache('OFFICE-CACHE-KEY');
            return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), op });
        });
    })

};

// Office Data


// Config Data

export const addcityWiseConfigData = (req, res) => {
    var newDoc = new cityWiseConfig(
        {
            prepaidMinBal: req.body.prepaidMinBal,
            postpaidMinBal: req.body.postpaidMinBal,
            driversNeedToCallForATrip: req.body.driversNeedToCallForATrip,

            requestTime: req.body.requestTime,
            requestTimeOutsation: req.body.requestTimeOutsation,
            requestTimeRental: req.body.requestTimeRental,

            maxDistBtRiderAndDriver: req.body.maxDistBtRiderAndDriver,
            maxDistBtRiderAndDriverRental: req.body.maxDistBtRiderAndDriverRental,
            maxDistBtRiderAndDriverOutsation: req.body.maxDistBtRiderAndDriverOutsation,

            userCancelTime: req.body.userCancelTime,
        }
    );

    var scIds = req.body.scIds;
    scIds = JSON.parse(scIds);

    _.forEach(scIds, function (element, i) {
        newDoc.scIds.push(element);
    });

    newDoc.save((err, datas) => {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), err }); }
        return res.json({ 'success': true, 'message': req.i18n.__("DATA_ADDED"), datas });
    })
}

export const getcityWiseConfigData = (req, res) => {
    var likeQuery = HelperFunc.likeQueryBuilder(req.query);
    var pageQuery = HelperFunc.paginationBuilder(req.query);
    var sortQuery = HelperFunc.sortQueryBuilder(req.query);
    sortQuery['displayorder'] = 1;
    var totalCount = 10;

    cityWiseConfig.find(likeQuery).count().exec((err, cnt) => {
        if (err) { }
        totalCount = cnt;
        cityWiseConfig.find(likeQuery).skip(pageQuery.skip).limit(pageQuery.take).sort(sortQuery).exec((err, docs) => {
            if (err) {
                return res.json([]);
            }
            res.header('x-total-count', totalCount);
            res.send(docs);
        });
    });
}

export const deletecityWiseConfigData = (req, res) => {
    cityWiseConfig.findByIdAndRemove(req.params.id, (err, docs) => {
        if (err) {
            return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
        }
        return res.json({ 'success': true, 'message': req.i18n.__("CITY_DATA_DELETED"), docs });
    })
};


export const updatecityWiseConfigData = (req, res) => {
    const id = req.params.id;
    cityWiseConfig.findOne({ _id: id }).exec((err, doc) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("CITY_DATA_NOT_fOUND") });

        doc.prepaidMinBal = req.body.prepaidMinBal;
        doc.postpaidMinBal = req.body.postpaidMinBal;
        doc.driversNeedToCallForATrip = req.body.driversNeedToCallForATrip;

        doc.requestTime = req.body.requestTime;
        doc.requestTimeOutsation = req.body.requestTimeOutsation;
        doc.requestTimeRental = req.body.requestTimeRental;

        doc.maxDistBtRiderAndDriver = req.body.maxDistBtRiderAndDriver;
        doc.maxDistBtRiderAndDriverRental = req.body.maxDistBtRiderAndDriverRental;
        doc.maxDistBtRiderAndDriverOutsation = req.body.maxDistBtRiderAndDriverOutsation;
        doc.userCancelTime = req.body.userCancelTime;

        let oldScIds = JSON.parse(req.body.oldScIds);
        //let oldScIds = req.body.oldScIds;
        var scIds = req.body.scIds;
        scIds = JSON.parse(scIds);
        //scIds = JSON.parse(scIds);

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
            if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
            return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), op });
        });
    })

};
// Config Data

export const getSupportNo = async (city) => {
    var defaultCity = await cityWiseOffice.find({ 'scIds.name': { $in: "Default" } }, { phone: 1, mail: 1, address: 1 });
    try {
        // var data = await cityWiseOffice.findOne({ 'scIds.name': { $in: city } }, { phone: 1, mail: 1, address: 1 }).cache(0, 'OFFICE-CACHE-KEY')
        var data = await cityWiseOffice.find();
        if (data) {
            var arr = [];
            var docs = _.map(data, (el) => {
                var result = _.find(el.scIds, { name: city })
                if (result) arr.push(el);
            })
            if (arr.length) {
                return arr
            }
            else {
                return defaultCity
            }
        }
        else {
            return defaultCity
        }
    }
    catch (err) {
        return defaultCity
    }
}

export const getAllowedDistanceBtDriverNPickupBasedOnServiceCity = async (cityId) => {
    var maxDistBtRiderAndDriver = {
        maxDistBtRiderAndDriverDaily: config.requestRadius,
        maxDistBtRiderAndDriverRental: config.rentalRequestRadius,
        maxDistBtRiderAndDriverOutsation: config.outstationRequestRadius,
    };

    // let availableService = await cityWiseConfig.find().lean().cache(0, 'CITYWISECONFIG-CACHE-KEY').exec();//.distinct('cityBoundaryPolygon')
    let availableService = await cityWiseConfig.find().lean().exec();//.distinct('cityBoundaryPolygon')

    var cityData = _.filter(availableService, function (val, key, obj) {
        return val.scIds[0].scId == cityId;
    });

    if (cityData.length) {
        maxDistBtRiderAndDriver.maxDistBtRiderAndDriverDaily = cityData[0].maxDistBtRiderAndDriver;
        maxDistBtRiderAndDriver.maxDistBtRiderAndDriverRental = cityData[0].maxDistBtRiderAndDriverRental;
        maxDistBtRiderAndDriver.maxDistBtRiderAndDriverOutsation = cityData[0].maxDistBtRiderAndDriverOutsation;
    }

    return maxDistBtRiderAndDriver;
}

export const addZoneCity = (req, res) => {
    var LocArray = [];
    LocArray = [req.body.latlngArray];
    var newDoc = new ZoneCity({
        scId: req.body.servicecityId,
        name: req.body.name,
        // surgeType: req.body.surgeType,
        // kmSurge: req.body.kmSurge,
        // timeSurge: req.body.timeSurge,
        softDelete: false,
        geometry: {
            type: "Polygon",
            coordinates: LocArray
        }
    });

    var fixedRate = req.body.fixedRate;
    if (fixedRate.length) {
        fixedRate = JSON.parse(fixedRate);
        newDoc = new OutstationPackage(newDoc);

        _.forEach(fixedRate, function (element, i) {
            newDoc.fixedRate.push(element);
        });
    }

    newDoc.save((err, datas) => {
        if (err) { return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err }); }
        return res.json({ 'success': true, 'message': req.i18n.__('DATA_ADDED_SUCCESS'), 'data': datas });
    });
}

export const updateZoneCity = (req, res) => {
    var LocArray = [];
    LocArray = [req.body.latlngArray];
    var updateData = {
        geometry: {
            type: "Polygon",
            coordinates: LocArray
        }
    };
    ZoneCity.findOneAndUpdate({ _id: req.body.zoneId }, updateData, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': ("SOME_ERROR"), 'error': err }) }
        if (!doc) return res.status(409).json({ 'success': false, 'message': ('SERVICE_NOT_AVAILABLE') });
        return res.status(200).json({ 'success': true, 'message': ("SERVICE_BOUNDARY_UPDATE_SUCCESS") })
    })
}

export const updateZoneCityBasic = (req, res) => {
    var updateData = {
        name: req.body.name,
        surgeType: req.body.surgeType,
        kmSurge: req.body.kmSurge,
        timeSurge: req.body.timeSurge,
    };
    ZoneCity.findOneAndUpdate({ _id: req.body.zoneId }, updateData, function (err, doc) {
        if (err) { return res.status(500).json({ 'success': false, 'message': ("SOME_ERROR"), 'error': err }) }
        if (!doc) return res.status(409).json({ 'success': false, 'message': ('SERVICE_NOT_AVAILABLE') });
        return res.status(200).json({ 'success': true, 'message': ("SERVICE_BOUNDARY_UPDATE_SUCCESS") })
    })
}

export const updateZoneCityFare = async (req, res) => {
    ZoneCity.findOne({ _id: req.params.id }).exec((err, doc) => {
        if (err) return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        if (!doc) return res.json({ 'success': false, 'message': req.i18n.__("PACKAGE_NOT_FOUND") });

        doc.tripType = req.body.tripType ? req.body.tripType : "daily";

        var fixedRate = req.body.fixedRate;
        fixedRate = JSON.parse(fixedRate);

        doc.fixedRate = [];

        _.forEach(fixedRate, function (element, i) {
            doc.fixedRate.push(element);
        });

        doc.save(function (err, op) {
            if (err) return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
            return res.json({ 'success': true, 'message': req.i18n.__("DETAILS_UPDATED"), op });
        });
    })
}

export const deleteZoneCityBasic = (req, res) => {
    ZoneCity.findByIdAndRemove(req.params.serviceId, (err, docs) => {
        if (err) {
            return res.json({ 'success': false, 'message': req.i18n.__("SOME_ERROR") });
        }
        return res.json({ 'success': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY"), docs });
    })
}

export const getZoneCity = async (req, res) => {
    ZoneCity.find({ scId: req.params.serviceId }, {}, function (err, docs) {
        if (err) { return res.status(500).json({ 'success': false, 'message': ("SOME_ERROR"), 'error': err }) }
        if (!docs) { return res.status(409).json({ 'success': false, 'message': ("DATA_NOT_FOUND") }) }
        return res.status(200).json({ 'success': true, 'message': ("FETECHED_SUCCESS"), 'data': docs });
    })
}
