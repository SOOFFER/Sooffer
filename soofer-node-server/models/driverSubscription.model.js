import mongoose from 'mongoose';
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var DriverSubscriptionSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    driverId: { type: ObjectId, ref: 'drivers' },
    driverName: String,
    packageId: { type: ObjectId, ref: 'payPackage' },
    packageName: { type: String, default: 'default' },
    amount: { type: Number, default: 0 },
    noofdays: { type: Number, default: 37 },
    startDate: { type: Date, default: Date.now },
    purchaseDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    status: { type: String, default: 'Activated' },
    vehicletype: { type: String, default: 'Auto' }
});

var DriverSubscription = mongoose.model('driverSubscription', DriverSubscriptionSchema);
module.exports = DriverSubscription;   