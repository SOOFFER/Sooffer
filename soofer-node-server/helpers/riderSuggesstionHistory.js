import mongoose from 'mongoose';

//import models
import Rider from '../models/rider.model';
import Trips from '../models/trips.model';
import Driver from '../models/driver.model';

const _ = require('lodash');

import * as GFunctions from '../controllers/functions';

import { getVehicleDataForLiveMeter } from '../controllers/vehicletype';
import { insidePolygon } from 'geolocation-utils'

const featuresSettings = require('../featuresSettings');
var firebase = require('firebase');
var config = require('../config');

export const riderSuggestionHistory = async (req, res) => {
    var pickupLng = req.body.pickupLng;
    var pickupLat = req.body.pickupLat;
    var requestRadius = config.requestRadius;
    var LocFind = {
        'ridid': req.userId,
        'dsp.startcoords': {
            $geoWithin: {
                $centerSphere: [[parseFloat(pickupLng), parseFloat(pickupLat)],
                requestRadius / 3963.2]
            },
        },
        'dsp.endcoords': { $ne: null }
    };
    var findTrips = await Trips.find(LocFind, { tripno: 1, scId: 1, scity: 1, dsp: 1, adsp: 1 }).sort({ 'createdAt': -1 }).limit(10);
    var to = "", LatLng = [];
    var data = _.map(findTrips, (el) => {
        var doc = {
            to: el.dsp.end,
            LatLng: el.dsp.endcoords
        }
        return doc
    })
    var uniqueLoc = _.uniqBy(data, 'to')
    console.log(data)
    res.json({ "success": true, "message": "Suggested Place", "suggestions": uniqueLoc })
}