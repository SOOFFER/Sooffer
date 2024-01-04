
const CronJob = require('cron').CronJob;
const fs = require('fs');

const cancelationConfig = require('./cancelationConfig'); 
import * as GFunctions from '../../controllers/functions';

import Trips from '../../models/trips.model';
import { updateDriverPerDayCancels, updateAddCancelationChargeToDriver, updateBlockTheDriverIfCancelExceeds, resetDriversBlocking } from '../../controllers/driver';
import { updateRiderPerDayCancels, updateAddCancelationChargeToRider, updateBlockTheRiderIfCancelExceeds, resetRidersBlocking } from '../../controllers/rider';


export const addCancelationStepsToDriver = async (dvrId, tripId) => {
    try {
        console.log("driver and trip",dvrId, tripId);
        if (cancelationConfig.cancelExists){
            let tripData = await Trips.findOne({ tripno: tripId }, { 'csp.driverCancelFee': 1 });
            var amtToDebit = tripData.csp.driverCancelFee;
            var status = await updateDriverPerDayCancels(dvrId, amtToDebit);
            if(status) {
                if (cancelationConfig.ifcanceledAddCharge) addCancelationChargeToDriver(dvrId); 
                if (cancelationConfig.ifcanceledBlockUser) blockTheDriverIfCancelExceeds(dvrId); 
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}

export const addCancelationChargeToDriver = async (dvrId) => {
    updateAddCancelationChargeToDriver(dvrId, cancelationConfig.cancelLimitForDays, cancelationConfig.noOfDriverCancelAllowed);
}

export const blockTheDriverIfCancelExceeds = async (dvrId) => {
    updateBlockTheDriverIfCancelExceeds(dvrId, cancelationConfig.ifcancelExceedsBlockUserFor, cancelationConfig.noOfDriverCancelAllowed);
}


// ---------------
// Rider

export const addCancelationStepsToRider = async (riderId, tripId) => {
    try {
        if (cancelationConfig.cancelExists) {
            let tripData = await Trips.findOne({ tripno: tripId }, { 'csp.riderCancelFee': 1 });
            var amtToDebit = tripData.csp.riderCancelFee;
            var status = await updateRiderPerDayCancels(riderId, amtToDebit);
            if (status) {
                if (cancelationConfig.ifcanceledAddCharge) addCancelationChargeToRider(riderId, amtToDebit,tripId);
                if (cancelationConfig.ifcanceledBlockUser) blockTheRiderIfCancelExceeds(riderId);
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}

export const addCancelationChargeToRider = async (riderId, amtToDebit,tripId) => {
    updateAddCancelationChargeToRider(riderId, amtToDebit, cancelationConfig.cancelLimitForDays, cancelationConfig.noOfRiderCancelAllowed,tripId);
}

export const blockTheRiderIfCancelExceeds = async (riderId) => {
    updateBlockTheRiderIfCancelExceeds(riderId, cancelationConfig.ifcancelExceedsBlockUserFor, cancelationConfig.noOfRiderCancelAllowed);
}


// --------------
// Unblock Cron
if (cancelationConfig.cancelExists) {
    var cronJob1 = new CronJob({
        cronTime: '0 0 0 * * *',
        onTick: function () {
            //Your code that is to be executed on every midnight
            resetDriversBlocking();
            resetRidersBlocking();
        },
        start: true,
        runOnInit: false
    })
}
 
// ---------------
// Update Config


export const getData = (req, res) => {
    if (cancelationConfig) return res.status(200).json({ 'success': true, 'data': cancelationConfig })
    else return res.status(500).json({ 'success': false, 'message': "Error on server" })
}


export const updateData = (req, res) => {
    var data = req.body;
    var configObj = cancelationConfig;

    for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
        // console.log(key + " = " + data[key]);
        var keyRes = key.split(".");
        if (keyRes.length > 2) {
            data[key] = GFunctions.convertToNumber(data[key]);
            configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
        } else if (keyRes.length > 1) {
            data[key] = GFunctions.convertToNumber(data[key]);
            configObj[keyRes[0]][keyRes[1]] = data[key];
        }
        else {
            data[key] = GFunctions.convertToNumber(data[key]);
            configObj[key] = data[key];
        }
    }

    var dataToWrite = "const cancelConfigObj = " + JSON.stringify(configObj, null, 2) + ";module.exports = cancelConfigObj";
    var filePath = __dirname + '/cancelationConfig.js';
    fs.writeFile(filePath, dataToWrite, function (err, doc) {
        if (err) { 
            console.log(err)
            return res.status(500).json({ 'success': false, 'message': "Error on server", 'error': err }) }
        res.status(200).json({ 'success': true, 'message': "Updated successfully", 'data': doc })
        GFunctions.restartServer();
    })

}