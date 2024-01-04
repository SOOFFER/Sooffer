import mongoose from 'mongoose';

// RFCNG

const invNum = require('invoice-number');
import moment from 'moment';

//import models
import Vehicle from '../models/vehicletype.model';
import Rider from '../models/rider.model';
import Trips from '../models/trips.model';
import Driver from '../models/driver.model';
import Promo from '../models/promo.model';
import DriverPayment from '../models/driverpayment.model';
import Wallet from '../models/wallet.model';
import Schedule from '../models/schedules.model';
import ShareRides from '../models/shares.model';
import * as GFunctions from './functions';
import { sendEmail } from './mailGateway';
const config = require('../config');

/**
 * [validatePromoAndReturnAmt Only Validate and return amount no Db logging]
 * @param  {[type]} promoCode [description]
 * @return {[type]}           [Amount float or 0]
 */
export const validatePromoAndReturnAmt = (promoCode) => {
  return new Promise(function (resolve, reject) {
    if (promoCode) {
      resolve(1);
    } else {
      resolve(0);
    }
  })
}

/**
 * getCommisionAmt 
 * @param  {Number} comison       [percentage]
 * @param  {[type]} totalAmtToPay [total amt]
 * @return {[float]}              [Commision amt]
 */
export const getCommisionAmt = (comison = 0, totalAmtToPay) => {
  var comisonamt = parseFloat((parseFloat(totalAmtToPay) * parseFloat(comison)) / 100).toFixed(2);
  if (comisonamt) {
    return comisonamt;
  } else {
    return 0;
  }
}


export const sendTripReceipt = (tripId = '', mailTo = '', language = 'en') => {
  Trips.findById(tripId, function (err, doc) {
    if (err) { console.log(err) }
    if (!doc) { }
    else {
      /* var data = {
        amountpaid: doc.fare, datepaid: doc.date, paymentmethod: doc.csp.via,
        chargedescription: 'Total Fare for Trip ' + doc.tripno, tripno: doc.tripno,
        triptime: doc.date, ridername: doc.rid,
        from: doc.adsp.from ? doc.adsp.from : doc.dsp.start,
        tripto: doc.adsp.to ? doc.adsp.to : doc.dsp.end,
        accessfee: doc.acsp.tax ? doc.acsp.tax : 0,
        distanceKM: doc.acsp.dist + config.distanceSymbol,
        minfare: doc.acsp.distfare,
        distancefare: doc.cost,
        starttime: doc.adsp.start ? doc.adsp.start : '',
        endtime: doc.adsp.end ? doc.adsp.end : '',
        tripdistance: doc.estTime,
        tripvehicle: doc.vehicle,
        discountName: doc.acsp.discountName ? doc.acsp.discountName : '',
        detect: doc.adsp.detect ? doc.adsp.detect : 0,
      }; */
      var triptype = doc.triptype;
      if (triptype == "daily") {
        var startTime = moment(doc.acsp.startTime).format('LT');
        var endTime = moment(doc.acsp.endTime).format('LT');
        var surgePercentage = 0 + " %";
        if (doc.acsp.isNight == true) surgePercentage = doc.acsp.nightPer + " %";
        if (doc.acsp.isPeak == true) surgePercentage = doc.acsp.peakPer + " %";
        var data = {
          amountpaid: doc.fare,
          datepaid: doc.date,
          paymentmethod: doc.acsp.via,
          chargedescription: doc.tripno,
          tripno: doc.tripno,
          tripCode: doc.tripCode,
          triptime: doc.date,
          ridername: doc.rid,
          from: doc.adsp.from,
          currency: config.currency,
          time: doc.adsp.estTime,
          detect: doc.acsp.detect,
          Percentage: doc.acsp.discountPercentage,
          waiting: `(${doc.acsp.waitingRate}/min)*(${doc.acsp.waitingTime} Min)` ,
          distfare: doc.acsp.distfare,
          appname: config.appName,
          Charge: doc.acsp.waitingCharge,
          mailLogo: config.customFileurl + 'mailImages/companylogo.png',
          dist: doc.acsp.perKmRate + '/Mile',
          fare: doc.fare,
          link1: config.landingurl,
          tripto: doc.adsp.to,
          accessfee: doc.acsp.tax,
          distanceKM: doc.adsp.distanceKM,
          totalfare: doc.csp.cost,
          starttime: startTime,
          endtime: endTime,
          tripdistance: doc.estTime,
          tripvehicle: doc.vehicle,
          discountName: doc.acsp.discountName,
          surgeReason: doc.acsp.surgeReason,
          surgePercentage: surgePercentage,
          pickupFare: doc.acsp.conveyance,
          link: config.landingurl + "tripInvoice/" + doc._id + ".pdf",
          // baseFare: doc.acsp.base,
          waitingTime: doc.acsp.waitingTime + 'Min',
          timeRate: `(${doc.acsp.timeRate}/min)*(${doc.acsp.time} Min)`,
          timefare: doc.acsp.timefare,
          time: doc.acsp.time + 'Min',
          fareType: doc.acsp.fareType,
          minFare: doc.acsp.minFare,
          minFareAdded: doc.acsp.minFareAdded,
          booking: doc.acsp.booking,
          taxPercentage: doc.acsp.taxPercentage + ' %',
          taxPercentagecgst: doc.acsp.taxPercentagecgst + ' %',
          taxPercentagesgst: doc.acsp.taxPercentagesgst + ' %',
          taxcgst: doc.acsp.taxcgst ,
          taxsgst: doc.acsp.taxsgst ,
          taxtemp: `( ${doc.acsp.taxcgst}(CGST))*(${doc.acsp.taxsgst}(SGST))`,
          tax: doc.acsp.tax,
          ParkingFee: doc.acsp.ParkingFee ? doc.acsp.ParkingFee: 0,
          oldBalance: doc.acsp.oldBalance,
          googleCharge: doc.acsp.googleCharge,
          gatewaycharge:doc.acsp.gatewayCharge ? doc.acsp.gatewayCharge: 0,
          totalFareWithOutOldBal: doc.acsp.totalFareWithOutOldBal,
          roundOff: doc.acsp.roundOff,
          paymentstatus:doc.paymentSts,
          totalfaretemp:("Payment Mode:" +  doc.acsp.via),
          tripPath: config.fileurl + "gmap/" + doc.tripno + ".png",
          farewithoutTaxNBookingFee: doc.acsp.farewithoutTaxNBookingFee,
          tollFee: doc.acsp.tollFee ? doc.acsp.tollFee : 0,
          parkingFee: doc.acsp.parkingFee ? doc.acsp.parkingFee : 0,
          bookingfare:doc.acsp.booking,
          basefare: doc.acsp.base,
          surgeAmt: doc.acsp.surgeAmt ? doc.acsp.surgeAmt: 0,
          pickupCharge: doc.acsp.conveyance ? doc.acsp.conveyance:0,
      
          // vehicleIcon: config.baseurl + vehicleData.file,
          // vehicleName: doc.vehicle,
          'imageurl': config.customFileurl + 'mailImages/companylogo.png',
          'mailHeaderRight': config.fileurl + 'mailImages/right.png',
          'mailHeaderLeft': config.fileurl + 'mailImages/left.png',
          'mailLogo': config.customFileurl + 'mailImages/companylogo.png',
          'appname': config.appName,
          'companyemail': config.companymail,
          // datepaid: doc.date,
          // paymentmethod: doc.acsp.via,
          // chargedescription: doc.tripno,
          // tripno: doc.tripno,
          // tripCode: doc.tripCode,
          // triptime: doc.date,
          // ridername: doc.rid,
          // from: doc.adsp.from,
          // currency: config.currencySymbol,
          // time: doc.adsp.estTime,
          // timefare: doc.acsp.timefare,
          // detect: doc.acsp.detect,
          // Percentage: doc.acsp.discountPercentage,
          // waiting: doc.acsp.waitingRate + '/min',
          // minfare: doc.acsp.distfare,
          // appname: config.appName,
          // Charge: doc.acsp.waitingCharge,
          // mailLogo: config.fileurl + 'companylogo.png',
          // dist: doc.acsp.perKmRate + '/km',
          // fare: doc.fare,
          // link: config.landingurl + "tripInvoice/" + doc._id + ".pdf",
          // tripto: doc.adsp.to,
          // accessfee: doc.acsp.tax,
          // distanceKM: doc.adsp.distanceKM,
          // distancefare: doc.csp.cost,
          // starttime: startTime,
          // endtime: endTime,
          // tripdistance: doc.estTime,
          // tripvehicle: doc.vehicle,
          // discountName: doc.acsp.discountName,
          // surgeReason: doc.acsp.surgeReason,
          // surgeAmt: doc.acsp.surgeAmt ? doc.acsp.surgeAmt: 0,
          // surgePercentage: surgePercentage,
          // pickupFare: doc.acsp.conveyance,
          // tax: doc.acsp.tax,
          // bookingfare:doc.acsp.booking,
          // basefare: doc.acsp.base
          // detect: trips[0].acsp.detect
        };
        sendEmail(mailTo, data, 'TripInvoice');
      }
      else if(triptype == "rental") {
        var startTime = moment(doc.acsp.startTime).format('LT');
        var endTime = moment(doc.acsp.endTime).format('LT');
        var data = {
          packageName: doc.acsp.packageName,
          packageKMFare: doc.acsp.distfare,
          FareforExtraKM: doc.acsp.fareForExtraKM,
          timefare: doc.acsp.timefare + '/hr',
          fareForExtraTime: doc.acsp.fareForExtraTime,
          pickupCharge: doc.acsp.conveyance,
          detect: doc.acsp.detect,
          hillFare: doc.acsp.hillFare,
          waiting: doc.acsp.waitingRate + '/min',
          discountName: doc.acsp.discountName,
          starttime: startTime,
          endtime: endTime,
          nightFare: doc.acsp.nightFare,
          dayFare: doc.acsp.dayFare,
          nightRate: doc.acsp.nightRate,
          dayRate: doc.acsp.dayRate ? doc.acsp.dayRate:0,
          dayfaretemp: `${doc.acsp.noOfDays}*$ ${doc.acsp.dayRate}`,
          nightfaretemp:`${doc.acsp.noOfNights}*$ ${doc.acsp.nightRate}`,
          tollFee: doc.acsp.tollFee ? doc.acsp.tollFee: 0,
          parkingFee: doc.acsp.parkingFee,
          distance: doc.acsp.dist + "Mile",
          duration: doc.acsp.time,
          baseKM: doc.acsp.baseKM + "Mile",
          extraKM: doc.acsp.extraKM,
          perKmRate: doc.acsp.perKmRate + "/Mile",
          extraTime: doc.acsp.extraTime,
          noOfDays: doc.acsp.noOfDays,
          noOfNights: doc.acsp.noOfNights,
          fareBeforeTax: doc.acsp.fareBeforeTax,
          taxPercentagecgst: doc.acsp.taxPercentagecgst + ' %',
          taxPercentagesgst: doc.acsp.taxPercentagesgst + ' %',
          taxcgst: doc.acsp.taxcgst,
          taxsgst: doc.acsp.taxsgst,
          taxtemp: `${doc.acsp.taxcgst}(CGST))*(${doc.acsp.taxsgst}(SGST)`,
          tax: doc.acsp.tax,
          bookingfare:doc.acsp.booking,
          basefare: doc.acsp.base,
          surgeAmt: doc.acsp.surgeAmt ? doc.acsp.surgeAmt: 0,
          gatewaycharge:doc.acsp.gatewayCharge ? doc.acsp.gatewayCharge: 0,
          totalFareWithOutOldBal: doc.acsp.totalFareWithOutOldBal,
          roundOff: doc.acsp.roundOff,
          paymentstatus:doc.paymentSts,
          totalfaretemp:("Payment Mode:" +  doc.acsp.via),
          amountpaid: doc.fare,
        };
        console.log("-----------------tripreceipt")
        sendEmail(mailTo, data, 'RentalTripInvoice');
      }
      else if(triptype == "outstation") {
        var startTime = moment(doc.acsp.startTime).format('LT');
        var endTime = moment(doc.acsp.endTime).format('LT');
        var data = {
          packageName: doc.acsp.packageName,
          packageKMFare: doc.acsp.distfare,
          FareforExtraKM: doc.acsp.fareForExtraKM,
          timefare: doc.acsp.timefare + '/hr',
          fareForExtraTime: doc.acsp.fareForExtraTime,
          pickupCharge: doc.acsp.conveyance,
          detect: doc.acsp.detect,
          hillFare: doc.acsp.hillFare,
          waiting: doc.acsp.waitingRate + '/min',
          discountName: doc.acsp.discountName,
          starttime: startTime,
          endtime: endTime,
          nightFare: doc.acsp.nightFare,
          dayFare: doc.acsp.dayFare,
          nightRate: doc.acsp.nightRate,
          dayRate: doc.acsp.dayRate ? doc.acsp.dayRate:0,
          dayfaretemp: `(${doc.acsp.noOfDays}*$ ${doc.acsp.dayRate})`,
          nightfaretemp:`(${doc.acsp.noOfNights}*$ ${doc.acsp.nightRate})`,
          tollFee: doc.acsp.tollFee ? doc.acsp.tollFee: 0,
          parkingFee: doc.acsp.parkingFee,
          distance: doc.acsp.dist + "Mile",
          duration: doc.acsp.time,
          baseKM: doc.acsp.baseKM + "Mile",
          extraKM: doc.acsp.extraKM,
          perKmRate: doc.acsp.perKmRate + "/Mile",
          extraTime: doc.acsp.extraTime,
          noOfDays: doc.acsp.noOfDays,
          noOfNights: doc.acsp.noOfNights,
          fareBeforeTax: doc.acsp.fareBeforeTax,
          taxPercentagecgst: doc.acsp.taxPercentagecgst + ' %',
          taxPercentagesgst: doc.acsp.taxPercentagesgst + ' %',
          taxcgst: doc.acsp.taxcgst,
          taxsgst: doc.acsp.taxsgst,
          taxtemp: `${doc.acsp.taxcgst}(CGST))*(${doc.acsp.taxsgst}(SGST)`,
          tax: doc.acsp.tax,
          bookingfare:doc.acsp.booking,
          basefare: doc.acsp.base,
          surgeAmt: doc.acsp.surgeAmt ? doc.acsp.surgeAmt: 0,
          gatewaycharge:doc.acsp.gatewayCharge ? doc.acsp.gatewayCharge: 0,
          totalFareWithOutOldBal: doc.acsp.totalFareWithOutOldBal,
          roundOff: doc.acsp.roundOff,
          paymentstatus:doc.paymentSts,
          totalfaretemp:("Payment Mode:" +  doc.acsp.via),
          amountpaid: doc.fare,
        };
        console.log("-----------------tripreceipt")
        sendEmail(mailTo, data, 'outstationTripInvoice');
      }

      // var data = {
      //   amountpaid: doc.fare, datepaid: doc.date, paymentmethod: doc.csp.via,
      //   chargedescription: 'Total Fare for Trip ' + doc.tripno, tripno: doc.tripno,
      //   triptime: doc.date, ridername: doc.rid,
      //   from: doc.adsp.from ? doc.adsp.from : doc.dsp.start,
      //   tripto: doc.adsp.to ? doc.adsp.to : doc.dsp.end,
      //   accessfee: doc.acsp.tax ? doc.acsp.tax : 0,
      //   distanceKM: doc.acsp.dist + config.distanceSymbol,
      //   minfare: doc.acsp.distfare,
      //   distancefare: doc.cost,
      //   starttime: doc.adsp.start ? doc.adsp.start : '',
      //   endtime: doc.adsp.end ? doc.adsp.end : '',
      //   tripdistance: doc.estTime,
      //   tripvehicle: doc.vehicle,
      //   discountName: doc.acsp.discountName ? doc.acsp.discountName : '',
      //   detect: doc.adsp.detect ? doc.adsp.detect : 0,
      //   currency: config.currencySymbol,
      //   appname: config.appname,
      //   time: doc.csp.time,
      //   detect: doc.acsp.detect,
      //   dist: doc.csp.dist,
      //   Percentage: doc.acsp.discountPercentage,
      //   waiting: doc.acsp.waitingTime,
      //   Charge: doc.acsp.waitingCharge,
      //   minFare: doc.acsp.minFare,
      //   link: config.frontendurl,
      //   fare: doc.csp.cost,
      // };

      // sendEmail(mailTo, data, 'TripInvoice');
    }
  })
}

export const sendTripGSTReceipt = (tripId = '', mailTo = '') => {
  Trips.findById(tripId, function (err, doc) {
    if (err) { console.log(err) }
    if (!doc) { }
    else {
      var data = {
        finalamt: doc.acsp.cost,
        datepaid: moment(doc.date,'DD-MM-YYYY h:mm a').format('MM-DD-YYYY h:mm a'),
        paymentmethod: doc.csp.via,
        chargedescription: 'Total Fare for Trip ' + doc.tripno,
        tripno: doc.tripno,
        tripCode: doc.tripCode,
        triptime: doc.date,
        ridername: doc.rid,
        from: doc.adsp.from,
        tripto: doc.adsp.to,
        accessfee: doc.acsp.tax ? doc.acsp.tax : 0,
        distanceKM: doc.acsp.dist,
        distancefare: doc.acsp.distfare,

        /* //Indian GST
        fee1: (doc.acsp.fare1).toFixed(2),
        cgstperentage1: parseFloat(doc.acsp.taxper1 / 2).toFixed(2),
        cgst1: parseFloat(doc.acsp.tax1 / 2).toFixed(2),
        sgstperentage1: parseFloat( doc.acsp.taxper1 / 2 ).toFixed(2),
        sgst1: parseFloat(doc.acsp.tax1 / 2).toFixed(2),
        subtotal1: (Number(doc.acsp.fare1) + Number(doc.acsp.tax1)).toFixed(2) , 
        fee2: (doc.acsp.fare2).toFixed(2),
        cgstperentage2: parseFloat(doc.acsp.taxper2 / 2).toFixed(2),
        cgst2: parseFloat(doc.acsp.tax2 / 2).toFixed(2),
        sgstperentage2: parseFloat(doc.acsp.taxper2 / 2).toFixed(2),
        sgst2: parseFloat(doc.acsp.tax2 / 2).toFixed(2),
        convtotal:  (Number(doc.acsp.fare2) + Number(doc.acsp.tax2)).toFixed(2) , 
        finalamt: (doc.acsp.cost).toFixed(2),  */

        //V2
        fee1: doc.acsp.fee1,
        cgstperentage1: doc.acsp.cgstperentage1,
        cgst1: doc.acsp.cgst1,
        sgstperentage1: doc.acsp.sgstperentage1,
        sgst1: doc.acsp.sgst1,
        subtotal1: doc.acsp.subtotal1,
        fee2: doc.acsp.fee2,
        cgstperentage2: doc.acsp.cgstperentage2,
        cgst2: doc.acsp.cgst2,
        sgstperentage2: doc.acsp.sgstperentage2,
        sgst2: doc.acsp.sgst2,
        convtotal: doc.acsp.convtotal,
        finalamt: doc.acsp.finalamt,

      };

      sendEmail(mailTo, data, 'TripGSTTaxInvoice');
    }
  })
}

function getindianGSTSplits(params) {

}

export const getTripNo = async () => {
  let tripno = 10001; //default first trip number

  /*  let tripDoc = await Trips.findOne({},{'tripno':1},{ "sort": { "createdAt": -1 }});
   if(tripDoc){
     tripno = invNum.next(tripDoc.tripno)
   } 
   return tripno.toString(); */

  let tripDoc = await Trips.count();
  if (tripDoc) tripno = tripDoc;
  tripno = tripno + 1;
  var tripnoprefix = GFunctions.getISOTodayDateForTripPrefix();

  return tripnoprefix + tripno;
}