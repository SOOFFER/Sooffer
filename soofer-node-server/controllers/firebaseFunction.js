import mongoose from 'mongoose';

var config = require('../config');
const featuresSettings = require('../featuresSettings');

//npm package
var firebase = require('firebase');
import { restartServer } from './common';
const fs = require('fs');
const _ = require('lodash');
//model

export const getrRiderCancelReasonFB = (req, res) => {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(config.firebasekey);
        }
        var db = firebase.database();
        var ref = db.ref("Cancel_reason").child('Rider_reason');
        ref.once("value", function (snapshot) {
            return res.send([snapshot.val()])
        });
    }
    catch (err) {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err.toString() })
    }
}

/**  
 * params : value
*/
export const addRiderCancelReasonFB = (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    var ref = db.ref("Cancel_reason").child('Rider_reason');
    var obj = {};
    obj[req.body.value] = 0;

    ref.update(obj, function (error) {
        if (error) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.toString() }) }
        else { return res.status(200).json({ 'success': true, 'message': req.i18n.__("ADDED_SUCCESSFULLY") }) }
    });
}

/** 
 * params : oldValue,newValue
 */
export const updateRiderCancelReasonFB = (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    //var old = req.body.oldValue;
    var db = firebase.database();
    var ref = db.ref("Cancel_reason").child('Rider_reason');
    ref.once('value').then(function (snap) {
        var data = snap.val();
        data.old = 0;
        var update = {};
        update[req.body.oldValue] = null;
        update[req.body.newValue] = 0;
        ref.update(update, function (error) {
            if (error) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.toString() }) }
            else { return res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") }) }
        });
    });
}
/** 
 * params : value
*/
export const deleteRiderCancelReasonFB = (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    var ref = db.ref('Cancel_reason').child("Rider_reason/" + req.params.value);
    ref.remove()
        .then(function () { return res.status(200).json({ 'status': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY") }) })
        .catch(function (error) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.message }) });
}

export const getDriverCancelReasonFB = (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    var ref = db.ref("Cancel_reason").child('Driver_reason');
    ref.once("value", function (snapshot) {
        res.send([snapshot.val()])
    }, function (errorObject) {
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': errorObject.code })
    });
}

/**  
 * params : value
*/
export const addDriverCancelReasonFB = (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    var ref = db.ref("Cancel_reason").child('Driver_reason');
    var obj = {};
    obj[req.body.value] = 0;

    ref.update(obj, function (error) {
        if (error) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.toString() }) }
        else { return res.status(200).json({ 'success': true, 'message': req.i18n.__("ADDED_SUCCESSFULLY") }) }
    });
}

/** 
 * params : oldValue,newValue
 */
export const updateDriverCancelReasonFB = (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    //var old = req.body.oldValue;
    var db = firebase.database();
    var ref = db.ref("Cancel_reason").child('Driver_reason');
    ref.once('value').then(function (snap) {
        var data = snap.val();
        data.old = 0;
        var update = {};
        update[req.body.oldValue] = null;
        update[req.body.newValue] = 0;
        ref.update(update, function (error) {
            if (error) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.toString() }) }
            else { return res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") }) }
        });
    });
}
/** 
 * params : value
*/
export const deleteDriverCancelReasonFB = (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    var ref = db.ref('Cancel_reason').child("Driver_reason/" + req.params.value);
    ref.remove()
        .then(function () { return res.status(200).json({ 'status': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY") }) })
        .catch(function (error) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.message }) });
}

//AlertLabels
export const getAlertLabels = (req, res) => {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(config.firebasekey);
        }
        var db = firebase.database();
        // var ref = db.ref("Cancel_reason").child('AlertLabels');
        var ref = db.ref("AlertLabels");
        ref.once("value", function (snapshot) {
            var sdata = snapshot.val();
            //dev
            sdata["isDriverCreditModuleEnabled"] = featuresSettings.isDriverCreditModuleEnabled;
            return res.send([sdata])
        });
    }
    catch (err) {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err.toString() })
    }
}

export const updateAlertLabels = (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    var update = {};
    var db = firebase.database();

    update["driverCancelLimiitExceeds"] = req.body.driverCancelLimiitExceeds;
    update["driverPayoutAmountLimitMax"] = req.body.driverPayoutAmountLimitMax;
    update["driverPayoutsType"] = req.body.driverPayoutsType;
    update["exceededminimumBalanceDriverAlert"] = req.body.exceededminimumBalanceDriverAlert;
    update["isNightExistAlertLabel"] = req.body.isNightExistAlertLabel;
    update["lowBalanceAlert"] = req.body.lowBalanceAlert;
    update["minimumBalance"] = req.body.minimumBalance;
    update["minimumBalanceDriverAlert"] = req.body.minimumBalanceDriverAlert
    update["riderCancelLimiitExceeds"] = req.body.riderCancelLimiitExceeds;
    update["riderMaximumOldBalance"] = req.body.riderMaximumOldBalance;
    update["riderOldBalanceExceededMessage"] = req.body.riderOldBalanceExceededMessage;

    // db.ref("Cancel_reason").child('AlertLabels').update(update, function (err) {
    db.ref("AlertLabels").update(update, function (err) {
        if (err) { }
        var data = {
            "driverPayouts.driverPayoutAmountLimitMax": req.body.driverPayoutAmountLimitMax,
            "isDriverCreditModuleEnabled": req.body.isDriverCreditModuleEnabled
        };
        updateReferalSettings(data);
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") })
    });
}

export const updateReferalSettings = (data) => {
    var configObj = featuresSettings;

    for (var key in data) {
        if (!data.hasOwnProperty(key)) continue;
        // console.log(key + " = " + data[key]);
        var keyRes = key.split(".");
        if (keyRes.length > 2) {
            configObj[keyRes[0]][keyRes[1]][keyRes[2]] = data[key];
        } else if (keyRes.length > 1) {
            configObj[keyRes[0]][keyRes[1]] = data[key];
        }
        else configObj[key] = data[key];
    }

    var dataToWrite = "const featuresSettings = " + JSON.stringify(configObj, null, 2) + ";module.exports = featuresSettings";

    fs.writeFile(__dirname + '/../featuresSettings.js', dataToWrite, function (err, doc) {
        if (err) { console.log(err) }
        restartServer();
    })

}

//Firebase Func
function getFirebaseRef(forNode) {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    if (forNode == 'riderFeedbackReasons') {
        var ref = db.ref("Rider_Feedback_reason");
        // var ref = db.ref("Cancel_reason").child('Rider_Feedback_reason');
    } else if (forNode == 'driverFeedbackReasons') {
        var ref = db.ref("Driver_Feedback_reason");
        // var ref = db.ref("Cancel_reason").child('Driver_Feedback_reason');
    }
    return ref;
}

export const getFBValues = (req, res) => {
    try {
        var ref = getFirebaseRef(req.params.forNode);
        ref.once("value", function (snapshot) {
            return res.send([snapshot.val()])
        });
    }
    catch (err) {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err.toString() })
    }
}

export const addFBValues = (req, res) => {
    var ref = getFirebaseRef(req.params.forNode);
    var obj = {};
    obj[req.body.value] = 0;

    ref.update(obj, function (error) {
        if (error) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.toString() }) }
        else { return res.status(200).json({ 'success': true, 'message': req.i18n.__("ADDED_SUCCESSFULLY") }) }
    });
}

export const updateFBValues = (req, res) => {
    var ref = getFirebaseRef(req.params.forNode);
    ref.once('value').then(function (snap) {
        var data = snap.val();
        data.old = 0;
        var update = {};
        update[req.body.oldValue] = null;
        update[req.body.newValue] = 0;
        ref.update(update, function (error) {
            if (error) { return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.toString() }) }
            else { return res.status(200).json({ 'success': true, 'message': req.i18n.__("UPDATED_SUCCESSFULLY") }) }
        });
    });
}

//Firebase Func
function getFirebaseChildRef(forNode, childValue) {
    if (!firebase.apps.length) {
        firebase.initializeApp(config.firebasekey);
    }
    var db = firebase.database();
    if (forNode == 'riderFeedbackReasons') {
        var ref = db.ref("Driver_Feedback_reason").child(childValue);
        // var ref = db.ref("Cancel_reason").child('Rider_Feedback_reason').child(childValue);
    } else if (forNode == 'driverFeedbackReasons') {
        var ref = db.ref("Driver_Feedback_reason").child(childValue);
        // var ref = db.ref("Cancel_reason").child('Driver_Feedback_reason').child(childValue);
    }
    return ref;
}

export const deleteFBValues = (req, res) => {
    var ref = getFirebaseRef(req.params.forNode);
    ref.once("value", function (snapshot) {
        var length = _.size(snapshot.val());
        if (length > 1) {
            ref = getFirebaseChildRef(req.params.forNode, req.params.value);
            ref.remove()
                .then(function () { return res.status(200).json({ 'status': true, 'message': req.i18n.__("DELETED_SUCCESSFULLY") }) })
                .catch(function (error) { return res.status(500).json({ 'status': false, 'message': req.i18n.__("SOME_ERROR"), 'error': error.message }) });
        }
        else {
            return res.status(200).json({ 'status': true, 'message': req.i18n.__("Cannot Delete, Need to have atleast one Value") })
        }
    });

}