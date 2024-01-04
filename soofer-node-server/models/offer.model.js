import mongoose from 'mongoose';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');

var OfferSchema = mongoose.Schema({
	createdAt : { type: Date,default: Date.now},
	// cityId    : {type: String},
	// cityName  : {type: String },
	title     : String, 
	desc      : String, 
	code      : { type: String, default: "" },  
	file      : { type: String, default: "public/file-default.png" },  
	edate     : {type:Date},
	vdate     : {type:Date},
	scIds     : [{
		name: { type: String, default: "" },
		scId: { type: String, default: "" },
	}]

}
,{ usePushEach: true }

);

var Offers = mongoose.model('offers', OfferSchema);
module.exports = Offers;   
