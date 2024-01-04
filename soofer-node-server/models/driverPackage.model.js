import mongoose from 'mongoose';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var DriverPackageSchema = mongoose.Schema({
	createdAt:{
		type: Date,
		default: Date.now
	},
    driverId: { type: ObjectId, ref: 'drivers' }, 
    driverName: String,
    packageId: String, 
    packageName: String, 
    amount: String,
    credit: String,  
    type: String,
    startDate: { type: Date, default: Date.now },
    purchaseDate: { type: Date, default: Date.now },
    endDate: { type: String, default: ''},
});

var DriverPackage = mongoose.model('driverPackage', DriverPackageSchema);
module.exports = DriverPackage;   