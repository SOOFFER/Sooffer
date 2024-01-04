import mongoose from 'mongoose';

var FaqSch = mongoose.Schema({
	ifaqcategoryId: String,
	ifaqcategorytitle: String,
	iDisplayOrder: String,
	vTitle_EN: String,
	English: String,
	language: { type: String, default: "en" } //en/es
});

var Faq = mongoose.model('faqs', FaqSch);
module.exports = Faq;