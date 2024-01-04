import mongoose from 'mongoose';

var HelpcategorySch = mongoose.Schema({
	eStatus: String,
	iDisplayOrder: String,
	vTitle_EN: String,
	language: { type: String, default: "en" } //en/es
});

var Helpcategory = mongoose.model('helpcategorys', HelpcategorySch);
module.exports = Helpcategory;