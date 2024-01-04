import mongoose from 'mongoose';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// import * as GFunctions from '../controllers/functions';

var EContactSchema = new mongoose.Schema({
	number: { type: String, default: "" },
	name: String
});

var RiderSchema = mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now
	},
	nic: { type: String, default: "" },
	fname: { type: String },
	lname: String,
	email: { type: String, trim: true },
	phone: { type: String, unique: true, required: true },
	cur: { type: String, default: config.paymentGateway.paymentGatewayCurrency },
	phcode: { type: String, default: "" },
	countryCode: { type: String, default: ""},
	hash: String,
	salt: String,
	profile: { type: String, default: "public/file-default.png" },
	EmgContact: [EContactSchema],
	rating: {
		rating: { type: String, default: "0" },
		nos: { type: Number, default: 0 },
		cmts: { type: String, default: "" }
	},
	ridersAddress: { type: String, default: "" },
	address: [{
		lable: { type: String, default: "" },
		address: { type: String, default: "" },
		Coords: { type: [Number], default: [0, 0] }
	}],
	card: {
		id: { type: String, default: "" },
		currency: { type: String, default: "" },
		last4: { type: String, default: "" }
	},
	fcmId: { type: String, default: "" },
	lang: { type: String, default: "" },
	gender: { type: String, default: "" },

	balance: { type: Number, default: 0 },
	canceledCount: { type: Number, default: 0 },//No of times cancelled Trip for Current Date
	lastCanceledDate: { type: String, default: '' },//Last Time Canceled Date = DD-MM-YYYY

	referal: { type: String, default: "" },
	scId: { type: ObjectId, ref: 'serviceavailablecities', default: null },
	scity: { type: String, default: null },
	cnty: { type: String, default: "" },
	cntyname: { type: String, default: "" },
	state: { type: String, default: "" },
	statename: { type: String, default: "" },
	city: { type: String, default: "" },
	cityname: { type: String, default: "" },
	coords: { type: [Number], index: '2dsphere' }, //Last updated location
	status: { type: Boolean, default: true }, //He is active/non blocked
	verificationCode: { type: String, default: "" },

	curStatus: { type: String, default: "free" },// free/intrip, 
	curTripno: { type: String, default: null },
	loginType: { type: String, default: "normal" },
	loginId: { type: String, default: "" },
	callmask: { type: String, default: "" },
	softdel: { type: String, default: "active" },
	isLogin: { type: Boolean, default: true },
	blockuptoDate: { type: Date, default: null },
	mobileDetails: { type: String, default: "" },
	currencyCode: { type: String, default: config.currency },
	currencySymbol: { type: String, default: config.currencySymbol },
}

);

RiderSchema.methods.setPassword = function (password = "abservetech") {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

RiderSchema.methods.validPassword = function (password = "abservetech", salt, hashval) {
	var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
	return hashval === hash;
};

RiderSchema.methods.getPassword = function (password = "abservetech") {
	const obj = {};
	obj.salt = crypto.randomBytes(16).toString('hex');
	obj.hash = crypto.pbkdf2Sync(password, obj.salt, 1000, 64, 'sha512').toString('hex');
	return obj;
};

RiderSchema.methods.generateJwt = function (_id, email, name, type = "rider") {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7); // 7 days
	return jwt.sign({
		id: _id,
		email: email,
		name: name,
		type: type,
	}, config.secret);
};

RiderSchema.methods.setReferal = function (code = "abservetech") {
	this.referal = crypto.randomBytes(5).toString('hex');
};

var Rider = mongoose.model('riders', RiderSchema);
module.exports = Rider;   
