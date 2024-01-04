import mongoose from 'mongoose';

var PromoCodeSch = mongoose.Schema({
	code: { type: String, unique: true, required: true },
	start: { type: Date },
	end: { type: Date },
	noofuse: { type: Number, default: 100 }, //Only this much timeto use
	used: { type: Number, default: 0 },
	perUserUsage: { type: Number, default: 0 }, // Only this much time per user can use
	amount: { type: Number, default: 0 }, //if amountType flatrate
	users: [String],
	days: { type: String, default: "" },//Manual Days
	startTime: { type: String, default: "" }, //in = 20:00:00, store = 7200000
	endTime: { type: String, default: "" }, //05:00:00 to 
	forFirst: { type: Boolean, default: false }, //Only If booked for First trip
	autoApply: { type: Number, default: 0 }, //Auto apply for first N trips
	status: { type: Boolean, default: true },
	scIds: [{
		name: { type: String, default: "" },
		scId: { type: String, default: "" },
	}],
	tripType: [String], //daily/rental/outstation
	amountType: { type: String, default: "" }, //flatrate/percentage
	percentage: { type: Number, default: 0 }, //if amountType percentage
	percentageAmountLimit: { type: Number, default: 0 },
}
	, { usePushEach: true }
);
var promo = mongoose.model('promocodes', PromoCodeSch);
module.exports = promo;