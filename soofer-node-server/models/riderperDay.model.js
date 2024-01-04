import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var RiderPerDaySchema = new Schema({
	createdAt: { type: Date, default: Date.now },
	riderId: { type: ObjectId, ref: 'riders' },
	nooftrips: { type: Number, default: 0 }, 
	date: { type: Date, default: Date.now },
	nooftripsCancelled: { type: Number, default: 0 }, 
	cancelledAmount: { type: Number, default: 0 }, 
}); 

var RiderPerDay = mongoose.model('riderperday', RiderPerDaySchema);
module.exports = RiderPerDay;  