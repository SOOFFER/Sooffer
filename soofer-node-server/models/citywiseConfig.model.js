import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

var cityWiseConfigSchema = new Schema({
    prepaidMinBal: { type: Number, default: 0 },
    postpaidMinBal: { type: Number, default: 0 },
    driversNeedToCallForATrip: { type: Number, default: 5 },

    requestTime: { type: Number, default: 15000 }, //For single Driver
    requestTimeOutsation: { type: Number, default: 30000 },
    requestTimeRental: { type: Number, default: 30000 },

    maxDistBtRiderAndDriver: { type: Number, default: 3000 },
    maxDistBtRiderAndDriverRental: { type: Number, default: 5000 },
    maxDistBtRiderAndDriverOutsation: { type: Number, default: 5000 },

    userCancelTime: { type: Number, default: 90000 },
    
    scIds: [{
        name: { type: String, default: "" },
        scId: { type: ObjectId },
    }],

}
, { usePushEach: true }
)

var cityWiseConfig = mongoose.model('cityWiseConfig', cityWiseConfigSchema)
module.exports = cityWiseConfig;