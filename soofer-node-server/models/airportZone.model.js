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
let AiportZoneCitiesSchema = new Schema({
	name: { type: String, required: true, unique: true },
	servicecityId: { type: ObjectId, required: true, ref: 'serviceavailablecities' },
	geometry: pointSchema,
	price: { type: Number, default: 0 },
	softdel: { type: String, default: "active" },
	driversList: [{
		driverId: { type: ObjectId, ref: 'drivers' },
		created: Date
	}],
}, { "collection": "airportZones" });
//	outerPolygon : {type: [Number], index: '2dsphere', default : [0,0] },
AiportZoneCitiesSchema.plugin(timestamps);

let ZoneSchema = mongoose.model('airportZones', AiportZoneCitiesSchema);
module.exports = ZoneSchema;
// ServiceAvailableCities.createIndex( { location : "2dsphere" } );