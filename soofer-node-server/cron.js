import { sendSchAndTaxiReqStatus, sendScheduleTaxiRequestToDriver, clearNoEndedtrips, sendScheduleRentalTaxiRequestToDriver, sendScheduleOutstationTaxiRequestToDriver, startScheduleTaxiReqStatus, sendScheduleTaxiNoResponseToRider } from './controllers/app';
import {
  cronInactiveDrivers, resetDriversPerDayEarnings, removeDriverLocation,
  resetDriversSubscription, cronFCMPushInactiveDrivers
} from './controllers/driver';
import { sendDriverDocExpNotifyAlert, sendDriverTaxiDocExpNotifyAlert } from './controllers/expiryNotification';

const featuresSettings = require('./featuresSettings');
const cron = require('node-cron');
const CronJob = require('cron').CronJob;
const MongoCron = require('./dbCron.js');

console.log('CRON - running every  1 minute');
cron.schedule('*/1 * * * *', function () {
  // console.log('running every  1 minute');
  sendSchAndTaxiReqStatus(); //Used to send notification to Driver about arival time
  // cronInactiveDrivers(); //Inactivate Drivers lessthan this update time
  // cronFCMPushInactiveDrivers(); //FCM push Inactivate Drivers lessthan this update time

  sendScheduleTaxiRequestToDriver(); //Used to send request if no Driver accepted.
  sendScheduleRentalTaxiRequestToDriver(); //Used to send request if no Driver accepted.
  sendScheduleOutstationTaxiRequestToDriver(); //Used to send outstation request
  startScheduleTaxiReqStatus();

  sendScheduleTaxiNoResponseToRider();
});

// if (featuresSettings.calculateDriverEarningAtEveryDay) {
//   new CronJob('0 0 0 * * *', function () {
//     //will run every day at 12:00 AM
//     resetDriversPerDayEarnings();
//   })
// }

var cronJob1 = new CronJob({
  cronTime: '0 0 0 * * *',
  onTick: function () {
    MongoCron.dbAutoBackUp();
    //Your code that is to be executed on every midnight
    if (featuresSettings.calculateDriverEarningAtEveryDay) {
      resetDriversPerDayEarnings();
    }
    //check the drivers subscription
    if ((featuresSettings.payPackageTypes).length && featuresSettings.payPackageTypes.includes("subscription")) {
      resetDriversSubscription();
    }
    removeDriverLocation();
    sendDriverDocExpNotifyAlert();
    sendDriverDocExpNotifyAlert();
    sendDriverTaxiDocExpNotifyAlert();
    // clearNoEndedtrips();
  },
  start: true,
  runOnInit: false
})
