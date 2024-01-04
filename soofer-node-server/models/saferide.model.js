import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var SafeRideSchema = new Schema({
	createdAt:{ type: Date, default: Date.now },
	tripno : { type: String,  required: true }, 
	driver : { type: ObjectId, ref: 'drivers' },
	
	amttopay : { type: Number, default: 0 },  //Total fare includes all to be Payed by Rider 
	amtpaid : { type: Number, default: 0 },  //Total fare includes all Payed by Rider 
	bal : { type: Number, default: 0 },  //To be paid to Driver 
	file : { type: String, default: "" }, 
	ridPaid : { type: String, default: "no" }, //Is Rider paid the balance
	dvrPaid : { type: String, default: "no" }, //Is admin paid Driver the balance
	todvr : { type: String, default: "no" }, //Is Amount settled to Driver 
});

var SafeRide = mongoose.model('saferide', SafeRideSchema);
module.exports = SafeRide;  

 