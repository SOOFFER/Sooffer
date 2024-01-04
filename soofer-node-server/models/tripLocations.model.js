import { array } from 'check-types';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var TripLocationSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    tripId: { type: ObjectId, ref: "trips", default: null },
    lastUpdated: { type: Date, default: null },
    lastDistUpdated: { type: Date, default: null },
    // loc: { type: [[Number]], default: [] }, //array of arrays of Numbers
    loc: [], //array of Strings
    zone: [
        {
            zoneId: { type: ObjectId, ref: "zones", default: null },
            distance: { type: Number, default: 0 },
            rate: { type: Number, default: 0 },
        },
    ],
    distance: { type: Number, default: 0 },
    locations:[]
});

var TripLocation = mongoose.model('triplocation', TripLocationSchema);
module.exports = TripLocation; //Model to save trip path
