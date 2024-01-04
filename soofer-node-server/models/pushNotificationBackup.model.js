import mongoose from 'mongoose';
import * as GFunctions from '../controllers/functions';

var PushSchema=mongoose.Schema({

    createdAt : { type: Date, default:  Date.now() },
    forWhom   : { type: String , default: '' }, 
    message   : { type: String , default: '' },
    forType   : { type: Number, default: null} , // 1 -> push notification and 2 -> sms notification

});

PushSchema.pre("save", function (next) {
  this.createdAt = GFunctions.getISODate();
  next()
})

var pushNotification=mongoose.model('pushnotificbackup',PushSchema);
module.exports=pushNotification;