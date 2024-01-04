import mongoose from 'mongoose';

var FaqcategorySch = mongoose.Schema({
	eStatus: String,
	iDisplayOrder: String,
	vTitle_EN: String,
	language: { type: String, default: "en" } //en/es
});

var Faqcategory = mongoose.model('faqcategorys', FaqcategorySch);
module.exports = Faqcategory;