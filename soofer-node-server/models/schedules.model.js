import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId; 

var ScheduleSchema = new Schema({
  createdAt:{type: Date, default: Date.now },
    
	gmtTime : { type: String, default: "" } ,  
	tripid : { type: ObjectId, ref: 'trips' }, //_id
	schTime : { type: Date, default: Date.now  },
	triptype: { type: String, default: "daily" },//{ daily/rental/outstation }
	status : { type: String, default: "open" } 
	  
 });

var Schedule = mongoose.model('schedule', ScheduleSchema);
module.exports = Schedule;  


