import mongoose from 'mongoose'

var OurDriversSchema = mongoose.Schema({
	image: { type: String, default: 'public/car.png' },
	name: String,
	desc: String,
	language: { type: String, default: "en" } //en/es
})

var OurDrivers = mongoose.model('ourDriver', OurDriversSchema);
module.exports = OurDrivers;


