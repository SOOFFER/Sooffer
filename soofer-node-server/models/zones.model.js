import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var timestamps = require('mongoose-timestamp');

const pointSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Polygon'],
		required: true,
		default: 'Polygon'
	},
	coordinates: {
		type: [[[Number]]], // Array of arrays of arrays of numbers
		// required: true,
		index: '2dsphere',
	}
});

let ZoneCitiesSchema = new Schema({
	name: { type: String, required: true },
	servicecityId: { type: ObjectId, required: true, ref: 'serviceavailablecities' },
	geometry: [],
	fixedPrice: [{
        type: { type: String, default: "" },
        fixedRate: { type: Number, default: 0 },
	}],
	softdel: { type: String, default: "active" },
	//geometry: [pointSchema],
	// price: { type: Number, default: 0 },
	// surgeType: { type: String, default: "percentage" }, //percentage,flat
	// kmSurge: { type: Number, default: 0 },

}, { "collection": "zones" });

//	outerPolygon : {type: [Number], index: '2dsphere', default : [0,0] },
// ServiceAvailableCities.createIndex( { location : "2dsphere" } );
ZoneCitiesSchema.plugin(timestamps);

let ZoneSchema = mongoose.model('zones', ZoneCitiesSchema);
module.exports = ZoneSchema;