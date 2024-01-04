import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var timestamps = require('mongoose-timestamp');

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
    },
    coordinates: {
        type: [[[Number]]], // Array of arrays of arrays of numbers
        // required: true,
        index: '2dsphere',
    }
});

let zoneCitySchema = new Schema({
    scId: { type: ObjectId, ref: 'serviceavailablecities', default: null },
    name: { type: String, default: "" },
    // surgeType: { type: String, default: "percentage" }, //percentage,flat
    // kmSurge: { type: Number, default: 0 },
    // timeSurge: { type: Number, default: 0 },
    geometry: pointSchema,
    softDelete: { type: Boolean, default: false },
    tripType: { type: String, default: "daily" },
    fixedRate: [{
        name: { type: String, default: "" },
        rate: { type: Number, default: 0 },
    }],
}, { "collection": "zonecities" });

//	outerPolygon : {type: [Number], index: '2dsphere', default : [0,0] },
// serviceAvailableCitiesSchema.plugin(timestamps);

let ZoneCity = mongoose.model('zonecities', zoneCitySchema);
module.exports = ZoneCity;
