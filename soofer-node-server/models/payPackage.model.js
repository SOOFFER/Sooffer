import mongoose from 'mongoose';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');

var PayPackageSchema = mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
	name: String,
	type: { type: String, default: "commission" },
	amount: String,
	credit: { type: String, default: 0 },
	PackageValidity: { type: Number, default: 1 }, //In Days
	scIds: [{
		name: { type: String, default: "" },
		scId: { type: String, default: "" },
	}],
	vehicletype: { type: String, default: "Auto" }
}
	, { usePushEach: true }
);

var PayPackage = mongoose.model('payPackage', PayPackageSchema);
module.exports = PayPackage;    