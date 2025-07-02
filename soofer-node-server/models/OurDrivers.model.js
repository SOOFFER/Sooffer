import mongoose from 'mongoose';

var OurDriversSchema = mongoose.Schema({
	image: { type: String, default: 'public/driver-default.jpg' },
	name: String,
	desc: String,
	language: { type: String, default: "en" } //en/es
});

var OurDrivers = mongoose.model('ourDrivers', OurDriversSchema);
module.exports = OurDrivers;   