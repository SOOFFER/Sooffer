const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


const attendance = mongoose.Schema({
    // id: { type: String, required: true, unique: true },
    driverId: { type: ObjectId, ref: 'drivers' },
    date:{type:Date,default:Date.now},
    image: {type:String},
    dailyAttendance:{type:Boolean,required:true,default:false},
    faceSimalarityPercentage: { type:Number, default:0 }
});

var Attendance = mongoose.model('attendance',attendance);

module.exports = Attendance;