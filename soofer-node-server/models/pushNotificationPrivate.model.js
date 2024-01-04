import mongoose from 'mongoose';

var PushSchema = mongoose.Schema({

    createdAt : { type: Date, default: Date.now },
    userId   : { type: String , default: '' }, 
    message   : { type: String , default: '' },
    forType   : { type: Number, default: 2 } , // 1 -> driver and 2 -> rider

});

var pushNotificationPrivate = mongoose.model('pushNotificationPrivate',PushSchema);
module.exports = pushNotificationPrivate;