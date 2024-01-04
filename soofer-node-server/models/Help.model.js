import mongoose from 'mongoose';

var HelpSch = mongoose.Schema({
	ihelpcategoryId: String,
	ihelpcategorytitle: String,
	iDisplayOrder: String,
	vTitle_EN: String,
	English: String,
	language: { type: String, default: "en" } //en/es
});

var Help = mongoose.model('helps', HelpSch);
module.exports = Help;