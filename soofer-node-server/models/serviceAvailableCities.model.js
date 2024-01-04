import mongoose from 'mongoose';
const Schema = mongoose.Schema;
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
let serviceAvailableCitiesSchema = new Schema({
	city: { type: String, required: true, unique: true, default: "Default" },
	cityId: { type: String, required: true },
	cityBoundaryPolygon: [],
	stateId: { type: String, required: true },
	countryId: { type: String, required: true },
	nearby: [{
		city: { type: String },
		cityId: { type: String }
	}],
	status: { type: Boolean, default: true },
	softDelete: { type: Boolean, default: false },
	outerPolygon: [],
	geometry: pointSchema,
	currency: { type: String, required: true },
	requestRadius: { type: Number, default: 2 },
	rentalRequestRadius: { type: Number, default: 2 },
	outstationRequestRadius: { type: Number, default: 2 },
	centerPoint: { type: [Number], default: [0, 0] },
	approxBoundaryKMFromCenter: { type: Number, default: 0 },
	driverPrefixCode: { type: String, default: "" },
	tripPrefixCode: { type: String, default: "" },

	phCode: { type: String, default: "+1" },
	phDigits: { type: String, default: 10 },
	currencySymbol: { type: String, default: "$" },

}, { "collection": "serviceavailablecities" });
//	outerPolygon : {type: [Number], index: '2dsphere', default : [0,0] },
serviceAvailableCitiesSchema.plugin(timestamps);

let ServiceAvailableCities = mongoose.model('serviceavailablecities', serviceAvailableCitiesSchema);
module.exports = ServiceAvailableCities;
		// ServiceAvailableCities.createIndex( { location : "2dsphere" } );

