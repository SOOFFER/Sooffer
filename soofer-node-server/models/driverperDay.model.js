import mongoose from 'mongoose';
// import { config } from 'winston';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const config = require('../config');

var DriverPerDaySchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	driver: { type: ObjectId, ref: 'drivers' },
	nooftrips: { type: Number, default: 0 },
	onlineHours: { type: Number, default: 0 },
	onlineLable: { type: String, default: "" },
	offlineHours: { type: Number, default: 0 },
	offlineLable: { type: String, default: "" },
	lastON: { type: Date, default: null },
	lastOFF: { type: Date, default: null },
	earned: { type: Number, default: 0 },
	adminCommision: { type: Number, default: 0 },
	date: { type: Date, default: Date.now },
	nooftripsCancelled: { type: Number, default: 0 },
	cancelledAmount: { type: Number, default: 0 },
	totalDistTravelled: { type: Number, default: 0 },
	distanceUnit: { type: String, default: config.distanceUnit }
});

var DriverPerDay = mongoose.model('driverperday', DriverPerDaySchema);
module.exports = DriverPerDay;  