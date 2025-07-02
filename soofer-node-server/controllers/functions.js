import path from "path";
import Trips from "../models/trips.model";
import Driver from "../models/driver.model";
import * as GFunctions from "./functions";
import Paymentflow from "../modules/Paymentsflow/payments.model";
import mongoose, { Query } from "mongoose";
import * as paymentCtrl from "./paymentGateway/index";
const req_uest = require("request");

const firebase = require("firebase");

const firebaseAdmin = require("firebase-admin");
var serviceAccount = require("../service-account.json");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://i-gateway-332311-default-rtdb.firebaseio.com",
});

const config = require("../config");
const notificationContent = require("../notificationContent");
const moment = require("moment");
const GoogleMapsAPI = require("googlemaps");
const fs = require("fs");
const momentTimezone = require("moment-timezone");
const crypto = require("crypto");
const FCM = require("fcm-push");
const serverKey = config.fcmServer;
const randomize = require("randomatic");
const _ = require("lodash");
import logger from "../helpers/logger";
import { concave } from "@turf/turf";
const featuresSettings = require("../featuresSettings");
const request = require("request");
const md5 = require("md5");
const redis = require("redis");
const redis_client = redis.createClient(6379);
const { google } = require('googleapis');
const axios = require('axios');

import pushNotificationPrivate from "../models/pushNotificationPrivate.model";
import { saveTemplateToPdf, checkEndMeterPossible } from "./common";
import { Console } from "console";

const GoogleDistanceMatrix = require("google-distance-matrix");
GoogleDistanceMatrix.key(config.googleApi);

const googleMapsClient = require("@google/maps").createClient({
  key: config.googleApi,
});
const nodeGeocoder = require("node-geocoder");
const options = {
  provider: "google",
  // Optional depending on the providers
  httpAdapter: "https", // Default
  apiKey: config.googleApi, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};
const geocoder = nodeGeocoder(options);

/**
 * send random code
 * @param  {[type]} type [description]
 * @param  {Number} no   [description]
 * @return {[type]}      [description]
 */
export const sendRandomizeCode = (type, no = 4) => {
  if (config.appMode == "dev") {
    return 1111;
  } else {
    return randomize(type, no);
  }
};

/**
 * send Formated Time
 * @param  {[type]} time [description]
 * @return {[type]} 72000     [description]
 */
export const getFormatTime = (time = "00:00:00") => {
  if (time == "") return "";
  var arr = time.split(":");
  // var storedTime = hours * 3600 + minutes * 60 + seconds;

  var storedTime = Number(arr[0] * 3600) + Number(arr[1] * 60) + Number(arr[2]);
  return storedTime;
};

/**
 * send Formated Time from 7200000
 * @param  {[type]} time [description]
 * @return {[type]}   '00:00:00'   [description]
 */
export const fromStoredTime = (storedTime = "000000") => {
  var hours = storedTime / 3600; // needs to be an integer division
  var leaves = storedTime - hours * 3600;
  var minutes = leaves / 60;
  var seconds = leaves - 60 * minutes;
  return hours + ":" + minutes + ":" + seconds;
};

export const sendFCMMsgTest = async (registrationTokens, pushmessage) => {
  /*  const registrationTokens = [
    'fOvkcXFxPdQ:APA91bGTVFqneQBKkLiRIVFMWotDRlUXnKC6Nbr17ERHpzJRIftQDkLpRoNVzwei9_bCYwe3MxiYEHzWz0jOv9eWHXeJZn9BCAsXdIpmObBHOvVw08dnT0DIdlFpao37xDmu1xvJONfW'  
  ];*/

  const message = {
    data: {
      title: "Message from " + config.appName,
      message: pushmessage,
      sound: "default",
    },
    notification: {
      title: "Message from " + config.appName,
      message: pushmessage,
      sound: "default",
    },
    tokens: registrationTokens,
  };

  //await admin.messaging().sendMulticast(message);

  firebaseAdmin
    .messaging()
    .sendMulticast(message)
    .then((response) => {
      // Response is a message ID string.
    })
    .catch((error) => {
    });
};

/**
 * Send FCM to To id
 * @input title,msg,to
 * @param
 * @return null
 * @response null
 */
export const sendFCMMsg = async(
  touser,
  msg = "Message from " + config.appName,
  subject = null,
  title = config.appName /*,contentType key*/,
  userId = null,
  forType = 2,
  onlyData = false,
  sound = false
) => {
  var oldMsg = msg;

  if (subject != " " || subject != null) {
    var msg = notificationContent[notificationContent.defaultLanguage][subject];
  } else {
    var msg = msg;
  }

  if (!msg) msg = oldMsg;

  savePushNotificationPrivate(msg, subject, userId, forType);
  /*notificationContent[driverLangCode].${content type dynamically} If it is changed to dynamically the default lang is en */
  if (touser) { //If Only Device Token exists
    touser = touser.toString();


    if (!onlyData) {
      var fcmmessage = {
        message: {
          token: touser,
          android: {
            priority: "HIGH",
            notification: {
              title: title,
              body: msg,
              sound: "default"
            }
          },
          apns: {
            payload: {
              aps: {
                alert: {
                  title: title,
                  body: msg
                },
                sound: "default"
              }
            }
          },
          webpush: {
            notification: {
              title: title,
              body: msg,
              icon: "your_icon_url" // Optional
            }
          },
          data: {
            title: title,
            message: msg
          }
        }
      };
    

    }
    if (msg === "New Trip Request Received.") {
      sound = true;
      if (sound) {
        var fcmmessage = {
          message: {
            token: touser,
            android: {
              priority: "HIGH",
              notification: {
                title: title,
                body: msg,
                sound: "requestSound.mp3"
              }
            },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title: title,
                    body: msg
                  },
                  sound: "requestSound.mp3"
                }
              }
            },
            webpush: {
              notification: {
                title: title,
                body: msg,
                icon: "your_icon_url" // Optional
              }
            },
            data: {
              title: title,
              message: msg
            }
          }
        };
      } else {
        var fcmmessage = {
          message: {
            token: touser,
            android: {
              priority: "HIGH",
              notification: {
                title: title,
                body: msg,
                sound: "default"
              }
            },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title: title,
                    body: msg
                  },
                  sound: "default"
                }
              }
            },
            webpush: {
              notification: {
                title: title,
                body: msg,
                icon: "your_icon_url" // Optional
              }
            },
            data: {
              title: title,
              message: msg
            }
          }
        };
      }
    }
    console.log("---fcmmessage---",fcmmessage)
   
  

    try {

      let token = await getAccessTokens(); 
      // console.log("__________token",token);
      let response = await axios.post(
        `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
        fcmmessage,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Notification sent:", response.data);

    } catch (err) {
      console.error("Error sending notification:", err.response ? err.response.data : err);
    }

  }
};

export const sendAdminPushMsg = async(
  touser,
  msg = "Message from " + config.appName,
  title = config.appName
) => {
  if (touser) { //If Only Device Token exists
    touser = touser.toString();


    if (!onlyData) {
      var fcmmessage = {
        message: {
          token: touser,
          android: {
            priority: "HIGH",
            notification: {
              title: title,
              body: msg,
              sound: "default"
            }
          },
          apns: {
            payload: {
              aps: {
                alert: {
                  title: title,
                  body: msg
                },
                sound: "default"
              }
            }
          },
          webpush: {
            notification: {
              title: title,
              body: msg,
              icon: "your_icon_url" // Optional
            }
          },
          data: {
            title: title,
            message: msg
          }
        }
      };
    

    }
    if (msg === "New Trip Request Received.") {
      sound = true;
      if (sound) {
        var fcmmessage = {
          message: {
            token: touser,
            android: {
              priority: "HIGH",
              notification: {
                title: title,
                body: msg,
                sound: "requestSound.mp3"
              }
            },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title: title,
                    body: msg
                  },
                  sound: "requestSound.mp3"
                }
              }
            },
            webpush: {
              notification: {
                title: title,
                body: msg,
                icon: "your_icon_url" // Optional
              }
            },
            data: {
              title: title,
              message: msg
            }
          }
        };
      } else {
        var fcmmessage = {
          message: {
            token: touser,
            android: {
              priority: "HIGH",
              notification: {
                title: title,
                body: msg,
                sound: "default"
              }
            },
            apns: {
              payload: {
                aps: {
                  alert: {
                    title: title,
                    body: msg
                  },
                  sound: "default"
                }
              }
            },
            webpush: {
              notification: {
                title: title,
                body: msg,
                icon: "your_icon_url" // Optional
              }
            },
            data: {
              title: title,
              message: msg
            }
          }
        };
      }
    }
    console.log("---fcmmessage---",fcmmessage)
   
  

    try {

      let token = await getAccessTokens(); 
      // console.log("__________token",token);
      let response = await axios.post(
        `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
        fcmmessage,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Notification sent:", response.data);

    } catch (err) {
      console.error("Error sending notification:", err.response ? err.response.data : err);
    }

  }
};

export const savePushNotificationPrivate = (msg, subject, userId, forType) => {
  if (!userId) return false;
  //check subject
  //var subjectToSave = [ 'acceptRequest', 'sendSCHStartAlertToRider', 'rideLaterReceived', 'rideLaterNoResponse'];
  var subjectToSave = ["rideLaterReceived"];
  if (subjectToSave.indexOf(subject) < 0) return false;
  var data = {
    createdAt: getISODate(),
    userId: userId,
    message: msg,
    forType: forType,
  };
  const newDoc = new pushNotificationPrivate(data);
  newDoc.save();
};
/**
 * Send JS Formated Now Time
 * @input
 * @param
 * @return null
 * @response null
 */
export const sendJSTimeNow = (timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]") => {
  return Date.now();
};

/**
 * Send Formated Now Time
 * @input
 * @param
 * @return null
 * @response null
 */
export const sendTimeNow = (timeformat = "M-D-YYYY h:mm a") => {
  var now = moment().utcOffset(config.utcOffset);
  return now.format(timeformat);
};

export const sendPast7Day = (timeformat = "M-D-YYYY h:mm a") => {
  var myDate = moment().subtract(7, "days");
  myDate = new Date(myDate);
  return myDate;
};

export const sendPast31Day = (timeformat = "M-D-YYYY h:mm a") => {
  var myDate = moment().subtract(31, "days");
  myDate = new Date(myDate);
  return myDate;
};

export const sendPast365Day = (timeformat = "M-D-YYYY h:mm a") => {
  var myDate = moment().subtract(365, "days");
  myDate = new Date(myDate);
  return myDate;
};

export const pastDay = (timeformat = "M-D-YYYY h:mm a") => {
  var myDate = moment().subtract(1, "days");
  myDate = new Date(myDate);
  return myDate;
};

export const getISODate = (timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]") => {
  // will return the current time in India.
  var t = moment().utcOffset(config.utcOffset).format(timeformat);
  return t;
};

export const getISODateADayBuffer = (
  addDays = 1,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var myDate = moment()
    .add(addDays, "days")
    .utcOffset(config.utcOffset)
    .format(timeformat);
  return myDate;
};

export const getISOTodayDate = (
  dateTime,
  timeformat = "YYYY-MM-DDT00:00:00.000[Z]"
) => {
  var t = moment().utcOffset(config.utcOffset).format(timeformat);
  return t;
};

export const getDateTimeForSortings = (
  dateTime,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var result = moment(dateTime, "MM/DD/YYYY HH:mm a")
    .utcOffset(config.utcOffset)
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  // var t = moment(dateTime).utcOffset(config.utcOffset).format(timeformat);
  return result;
};

export const getDateTimeinThisFormat = (
  dateTime,
  inTimeformat = "MM/DD/YYYY HH:mm a",
  outTimeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var result = moment(dateTime, inTimeformat).format(outTimeformat);
  // var t = moment(dateTime).utcOffset(config.utcOffset).format(timeformat);
  return result;
};

export const getDateTimeForUserLable = (
  dateTime,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  if (!dateTime) return null;
  var result = moment(dateTime, timeformat).format("YYYY-MM-DD");
  return result;
};

export const getRespCountryDateTime = (
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  // will return the current time in Resp Offset.
  var t = moment().utcOffset(config.utcOffset).format(timeformat);
  return t;
};

export const getHoursBtDateTime = (
  endDate,
  startDate,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var start_date = moment(startDate);
  var end_date = moment(endDate);
  var duration = moment.duration(end_date.diff(start_date));
  var hours = duration.asHours();
  hours = hours.toFixed(2);
  // var minutes = parseInt(duration.asMinutes()) % 60;
  return hours;
};

export const getMinsBtDateTime = (
  endDate,
  startDate,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var start_date = moment(startDate);
  var end_date = moment(endDate);
  var duration = moment.duration(end_date.diff(start_date));
  // var hours = duration.asHours();
  // hours = hours.toFixed(2);
  var minutes = parseInt(duration.asMinutes());
  return minutes;
};

export const getSecsBtDateTime = (
  endDate,
  startDate,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var start_date = moment(startDate);
  var end_date = moment(endDate);
  var duration = moment.duration(end_date.diff(start_date));
  // var hours = duration.asHours();
  // hours = hours.toFixed(2);
  var seconds = parseInt(duration.asSeconds());
  return seconds;
};

export const getUpcomingSchListBuffer = (
  addMinutes = 15,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var myDate = moment()
    .add(addMinutes, "minutes")
    .utcOffset(config.utcOffset)
    .format(timeformat);
  return myDate;
};

export const getUpcomingSchListMinusBuffer = (
  Minutes = 15,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var myDate = moment()
    .subtract(Minutes, "minutes")
    .utcOffset(config.utcOffset)
    .format(timeformat);
  return myDate;
};

export const getUpcomingSchListMinusBufferServer = (
  Minutes = 15,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var myDate = moment().subtract(Minutes, "minutes").format(timeformat);
  return myDate;
};

export const getSubcriptionValidityDate = (
  startdate,
  addDays,
  timeformat = "YYYY-MM-DDT00:00:00.000[Z]"
) => {
  var myDate = moment(startdate)
    .add(addDays, "days")
    .utcOffset(config.utcOffset)
    .format(timeformat);
  // var new_date = moment(startdate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  // new_date.add(addDays, 'days').utcOffset(config.utcOffset).format(timeformat);
  return myDate;
};

export const getSubcriptionDeValidityDate = (
  startdate,
  addDays,
  timeformat = "YYYY-MM-DDT00:00:00.000[Z]"
) => {
  var myDate = moment(startdate)
    .subtract(addDays, "days")
    .utcOffset(config.utcOffset)
    .format(timeformat);
  // var new_date = moment(startdate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  // new_date.add(addDays, 'days').utcOffset(config.utcOffset).format(timeformat);
  return myDate;
};

export const addYearToGivenDate = (
  startdate,
  addYear = 0,
  timeformat = "YYYY-MM-DDT00:00:00.000[Z]"
) => {
  var myDate = moment(startdate).add(addYear, "years").format(timeformat);
  return myDate;
};

export const getISOTodayDateForTripPrefix = (timeformat = "YYMMDD") => {
  var t = moment().utcOffset(config.utcOffset).format(timeformat);
  return t;
};

export const getUpcomingSchListHourBufferServer = (
  Hours = 1,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var myDate = moment().subtract(Hours, "hours").format(timeformat);
  return myDate;
};

export const getUpcomingSchListHalfMinusBuffer = (
  Minutes = 30,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var myDate = moment()
    .subtract(Minutes, "minutes")
    .utcOffset(config.utcOffset)
    .format(timeformat);
  return myDate;
};

/**
 * Send Formated Time from EpochTime
 * @input   date = '19-05-2018' , time='08:00 AM'
 * @param
 * @return  "05/19/2018 05:06 PM"
 * @response
 */
export const sendFormatedTime = (date, time = "08:00 AM") => {
  if (date) {
    var fromDate = date.split("-");
    var newDateFormat =
      fromDate[1] + "/" + fromDate[0] + "/" + fromDate[2] + " " + time;
    return newDateFormat;
  }
};

/**
 * Send Formated Time from EpochTime
 * @input   date = '19-05-2018 08:00 AM'
 * @param
 * @return  "05/19/2018 05:06 PM"
 * @response
 */
export const sendFormatedDTime = (date) => {
  if (date) {
    var fromDate = date.split("-");
    var newDateFormat = fromDate[1] + "/" + fromDate[0] + "/" + fromDate[2];
    return newDateFormat;
  }
};

// /**
//  * Send GMT Formated Time
//  * @input   date = '19-05-2018 08:00 AM'
//  * @param
//  * @return  "05/19/2018 05:06 PM"
//  * @response
//  */
//  export const sendGMTFormatedDTime = (date,utc) => {
//   var gmtFTime = new Date( date + " " + utc).toGMTString();
//   return gmtFTime;
// }

/**
 * Send ISO Date
 * @input
 * @param
 * @return
 * @response
 */
export const sendISODateTime = (unix, timeformat = "M-D-YYYY h:mm a") => {
  var day = moment.unix(unix); //seconds
  return day.format(timeformat);
};

/**
 * Get Current Year
 * @input
 * @param
 * @return
 * @response
 */
export const getCurrentYear = () => {
  var year = moment().format("YYYY");
  return year;
};

/**
 * Send ISO Date format : Notification
 * @input
 * @param
 * @return
 * @response
 */
export const getSCHNotificationISODT = (
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var epoch = moment().unix();

  var june = moment();
  var epoch = june.tz("Asia/Kolkata").format(timeformat);

  var myDate = moment().utc().format(timeformat);
  // var myDate  = moment("10/15/2014 9:00").utc().format(timeformat);
  return epoch;
};

/**
 * Send GMT Current Date format : Notification
 * @input
 * @param
 * @return
 * @response
 */
export const getSCHNotificationGMTDT = (
  timeformat = "YYYY-MM-DDTHH:mm:00.000[Z]"
) => {
  // var epoch = moment().unix();

  // var june  = moment();
  // var epoch = june.tz('Asia/Kolkata').format(timeformat);

  // var myDate  = moment().utc().format(timeformat);
  // var then = moment(now).subtract(20, "minutes").toDate()
  //Notify b4 5min
  var myDate = moment().add(5, "minutes").utc().format(timeformat);
  var myDate = new Date(myDate).toGMTString();

  // var myDate  = moment("10/15/2014 9:00").utc().format(timeformat);
  return myDate;
};

//Mon, 21 May 2018 06:21:00 GMT
export const getCommonDTFormat = (
  dt,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  // var nnn = moment(dt , 'D, d M YYYY HH:mm:00 GMT').format(timeformat);
  var gmtCurrent = moment(dt).format(timeformat);
  return gmtCurrent;
};

export const getCommonMonthStartDate = (
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  const startOfMonth = moment().startOf("month").format(timeformat);
  // const endOfMonth = moment().endOf('month').format(timeformat);
  return startOfMonth;
};

export const getCommonWeekStartDate = (
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  const startOfWeek = moment().startOf("week").format(timeformat);
  return startOfWeek;
};

export const getCommonWeekEndDate = (
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  const startOfWeek = moment().endOf("week").format(timeformat);
  return startOfWeek;
};

const publicConfig = {
  key: config.googleApi,
  stagger_time: 1000, // for elevationPath
  encode_polylines: true,
};
const gmAPI = new GoogleMapsAPI(publicConfig);

// pending save to Mongo
export const saveGMap = async (docs = "") => {
  const from = docs.adsp.pLat + "," + docs.adsp.pLng;
  const to = docs.adsp.dLat + "," + docs.adsp.dLng;

  var params = {
    size: "600x300",
    maptype: "roadmap",
    markers: [
      {
        location: from,
        label: "A",
        color: "green",
        shadow: true,
      },
      {
        location: to,
        label: "B",
        color: "red",
        shadow: true,
      },
    ],
    style: [
      {
        feature: "road",
        element: "all",
        rules: {
          hue: "0x00ff00",
        },
      },
    ],
  };
  var filepath = "./public/gmap/" + docs.tripno + ".png";

  var Mapurl = gmAPI.staticMap(params); // return static map URL
  gmAPI.staticMap(params, function (err, binaryImage) {
    if (err) {
      return res.status(500).json();
    } else {
      fs.writeFile(filepath, binaryImage, "binary", function (err) {
        if (err)
          return res
            .status(200)
            .json({ success: false, TripDetail: docs, Mapurl: "" });
        docs.adsp.map = config.baseurl + "public/gmap/" + docs.tripno + ".png";
        //send map to save = pending
        return res
          .status(200)
          .json({ success: true, TripDetail: docs, Mapurl: Mapurl });
      });
    }
  });
};

export const saveStaticMapForTrip = async (tripData = "", path = []) => {
  var uniqpath = [...new Set(path)];
  const from = tripData.adsp.pLat + "," + tripData.adsp.pLng;
  const to = tripData.adsp.dLat + "," + tripData.adsp.dLng;
  var params = {
    size: "600x300",
    maptype: "roadmap",
    markers: [
      {
        location: from,
        label: "A",
        color: "green",
        shadow: true,
      },
      {
        location: to,
        label: "B",
        color: "red",
        shadow: true,
      },
    ],
    style: [
      {
        feature: "road",
        element: "all",
        rules: {
          hue: "0x00ff00",
        },
      },
    ],
    path: [
      {
        color: "0x0000ff",
        weight: "5",
        points: uniqpath,
      },
    ],
  };
  /*var params = {
    center: '444 W Main St Lock Haven PA',
    zoom: 15,
    size: '500x400',
    maptype: 'roadmap',
    markers: [
      {
        location: '300 W Main St Lock Haven, PA',
        label: 'A',
        color: 'green',
        shadow: true
      },
      {
        location: '444 W Main St Lock Haven, PA',
        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
      }
    ],
    style: [
      {
        feature: 'road',
        element: 'all',
        rules: {
          hue: '0x00ff00'
        }
      }
    ],
    path: [
      {
        color: '0x0000ff',
        weight: '5',
        points: [
          '41.139817,-77.454439',
          '41.138621,-77.451596',
          '41.140754, -77.456413'
        ]
      }
    ]
  };*/
  var filepath = "./public/gmap/" + tripData.tripno + ".png";
  gmAPI.staticMap(params, function (err, binaryImage) {
    if (err) {
      logger.error(err);
    } else {
      fs.writeFile(filepath, binaryImage, "binary", function (err) {
        if (err) logger.error(err);
        var staticMapURL =
          config.baseurl + "public/gmap/" + tripData.tripno + ".png";
        saveMapPathInTrip(tripData._id, staticMapURL);
      });
    }
  });
};

function saveMapPathInTrip(tripId, map) {
  Trips.findOneAndUpdate(
    { _id: tripId },
    { "adsp.map": map },
    { new: false },
    (err, doc) => {
      if (err) {
        logger.error(err);
      }
      logger.info("Map Updated");
      saveTemplateToPdf(tripId);
    }
  );
}

//String Helpers

/**
 * Send Formated Number from any
 * @input
 * @param
 * @return
 * @response
 */
export const sendFormatedNumber = (value, round = 2) => {
  if (isNaN(value)) {
    return 0;
  } else {
    value = Number(value);
    return value.toFixed(round);
  }
};

//String Helpers

//Send City From lat,lon

/**
 * Get City from lat lon
 * @input
 * @param
 * @return
 * @response
 */
export const getCityFromLatLon = (lat, lon) => {
  var city = "";
  // Using callback
  return new Promise(function (resolve, reject) {
    geocoder.reverse({ lat: 45.767, lon: 4.833 }, function (err, res) {
      if (err) {
        resolve("");
      } else {
        city = res[0].city;
        resolve(city);
      }
    });
  });
};

/**
 * Send Some unique Code
 * @param  {Number} char [No of char code needed]
 * @return {[type]}      [description]
 */
export const sendUniqueCode = (char = 5) => {
  return crypto.randomBytes(char).toString("hex"); //change this logic or crypt Datatime RFCNG
};

export const getDriverFBStatusAndUpdate = (driverId, status = 1) => {
  var id = driverId;
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("drivers_data");
  id = id.toString();
  var DriverRef = ref.child(id);

  var requestData = {
    online_status: status,
  };
  DriverRef.update(requestData, function (error) {
    if (error) {
    } else {
    }
  });

  DriverRef.once("value").then(function (snap) {
    var data = snap.val();
    var requestStatus = data.request.status;
    if (requestStatus == 0) {
      //He has in no trip
      freeTheDriver(driverId);
    } else {
    }
  });
};

export const freeTheDriver = (driverId) => {
  Driver.findByIdAndUpdate(
    driverId,
    {
      curStatus: "free",
    },
    { new: true },
    function (err, doc) {
      if (err) {
      }
    }
  );
};

// RFCNG

export const getScheduleTaxiRequestTime = (
  addMinutes = 5,
  timeformat = "YYYY-MM-DDTHH:mm:00.000[Z]"
) => {
  var myDate = moment().add(addMinutes, "minutes").utc().format(timeformat);

  var myDate = new Date(myDate).toGMTString();

  return myDate;
};

export const getScheduleTaxiRequestTimeMinus = (
  addMinutes = 5,
  timeformat = "YYYY-MM-DDTHH:mm:00.000[Z]"
) => {
  var myDate = moment()
    .subtract(addMinutes, "minutes")
    .utc()
    .format(timeformat);
  var myDate = new Date(myDate).toGMTString();
  return myDate;
};

export const minusSomeMinToCurrentTime = (
  Minutes = 5,
  timeformat = "YYYY-MM-DDTHH:mm:00.000[Z]"
) => {
  var myDate = moment()
    .subtract(Minutes, "minutes")
    .utcOffset(config.utcOffset)
    .format(timeformat);
  // var myDate = new Date(myDate).toGMTString();
  return myDate;
};

export const minusSomeDaysToCurrentTime = (
  Days = 1,
  timeformat = "YYYY-MM-DDT00:00:00.000[Z]"
) => {
  var myDate = moment()
    .subtract(Days, "days")
    .utcOffset(config.utcOffset)
    .format(timeformat);
  // var myDate = new Date(myDate).toGMTString();
  return myDate;
};

/**
 * Return distinct array
 * @param {*} items array
 * @param {*} prop  toFilter By key
 */
export const getDistinctInArray = (items, prop) => {
  var unique = [];
  var distinctItems = [];

  _.each(items, function (item) {
    if (unique[item[prop]] === undefined) {
      distinctItems.push(item);
    }

    unique[item[prop]] = 0;
  });

  return distinctItems;
};

/**
 * clear Obj
 * @param {*} ObjRef
 * @param {*} timer
 */
export const clearObj = (ObjRef, timer = 5000) => {
  setTimeout(() => {
    Object.keys(ObjRef).forEach(function (key) {
      delete ObjRef[key];
    });
  }, timer);
};

/**
 * get Distance And Time From GDM for Single Orign and distination
 *  @param origins =  [ '9.924068,78.123846' ] , destinations = [ '9.914485,78.123122' ]
 *  @return Success Response : {"error":false,"distanceValue":1857,"distanceLable":"1.9 km","timeValue":465,"timeLable":"8 mins","from":"152 A/5, North Veli Street, Near Bharat Petrolium, North Veli Street, Madurai, Tamil Nadu 625001, India","to":"Panthadi Street, Mahal Area, Madurai Main, Madurai, Tamil Nadu 625001, India"}
 */
export const getDistanceAndTimeFromGDM = async (
  origins,
  destinations,
  includeTrafic = true
) => {
  console.log("-----includeTrafic",includeTrafic)
  if (includeTrafic) return getDistanceAndTimeFromGDM2(origins, destinations);
  GoogleDistanceMatrix.units("metric");
  // GoogleDistanceMatrix.mode('driving');
  let data = {
    error: false,
    msg: "",
    distanceValue: 0, //Meters
    distanceLable: "",
    timeValue: 0, //Minutes
    timeLable: "",
    from: "",
    to: "",
  }
  return new Promise(function (resolve, reject) {
    GoogleDistanceMatrix.matrix(
      origins,
      destinations,
      function (err, distances) {
        try {
          if (err) {
            data["error"] = true;
            data["msg"] = err.toString();
            reject(data);
          }
          if (!distances) {
            data["error"] = true;
            data["msg"] =
              "Error Getting Estimation, Please check your distination Address.";
            reject(data);
          }
          if (
            typeof distances !== "undefined" &&
            distances !== null &&
            typeof distances.status !== "undefined" &&
            distances.status == "OK" &&
            typeof distances.rows !== "undefined" &&
            typeof distances.rows[0] !== "undefined" &&
            typeof distances.rows[0].elements !== "undefined" &&
            typeof distances.rows[0].elements[0] !== "undefined" &&
            typeof distances.rows[0].elements[0].distance !== "undefined"
          ) {
            data.from = distances.origin_addresses[0];
            data.to = distances.destination_addresses[0];
            data.distanceLable = distances.rows[0].elements[0].distance.text;
            data.distanceValue = distances.rows[0].elements[0].distance.value;
            data.timeLable = distances.rows[0].elements[0].duration.text;
            data.timeValue = distances.rows[0].elements[0].duration.value;
            resolve(data);
          } else {
            // If Api gives error response
            var errMsg = distances.error_message;
            if (!errMsg) {
              errMsg = distances.rows[0].elements[0].status;
              if (errMsg == "ZERO_RESULTS")
                errMsg =
                  "Error Getting Estimation, Please check your distination Address.";
            }
            data["error"] = true;
            data["msg"] = errMsg;
            reject(data);
          }
        } catch (error) {
          data["error"] = true;
          data["msg"] = error.toString();
          reject(data);
        }
      }
    );
  });
};

export const getDistanceAndTimeFromGDMZone = async (
  origins,
  destinations,
  includeTrafic = true
) => {
  if (featuresSettings.useRedisCache) {
    var hashKey = getGMDKey(origins, destinations) + "path";
    var hashValue = await checkCacheGDM(hashKey);
    if (hashValue != false) return JSON.parse(hashValue);
  }
  //getDistanceAndTimeFromGDMTrafic(origins, destinations);
  let data = {
    error: false,
    msg: "",
    distanceValue: 0, //Meters
    distanceLable: "",
    timeValue: 0, //Minutes
    timeLable: "",
    from: "",
    to: "",
    polyline: "",
  };
  const formData = {
    from: origins,
    to: destinations,
    key: config.googleApi,
  };
  var smsRequestURL = GFunctions.convertLableDynamically(
    config.directionApi,
    formData
  );
  return new Promise(function (resolve, reject) {
    request.get(
      {
        url: smsRequestURL,
      },
      function (error, response, distances) {
        if (!error && response.statusCode == 200) {
          distances = JSON.parse(distances);
          if (typeof distances !== "undefined") {
            data.from = distances.routes[0].legs[0].start_address;
            data.to = distances.routes[0].legs[0].end_address;
            data.distanceLable = distances.routes[0].legs[0].distance.text;
            data.distanceValue = distances.routes[0].legs[0].distance.value;
            data.timeLable = distances.routes[0].legs[0].duration.text;
            data.timeValue = distances.routes[0].legs[0].duration.value;
            data.polyline = distances.routes[0].overview_polyline.points;
            if (featuresSettings.useRedisCache) {
              redis_client.setex(hashKey, 2592000, JSON.stringify(data)); //30Days
            }
            resolve(data);
          } else {
            // If Api gives error response
            var errMsg = distances.error_message
              ? distances.error_message
              : "Error Getting Estimation, Please check your distination Address.";
            if (!errMsg) {
              errMsg = distances.rows[0].elements[0].status;
              if (errMsg == "ZERO_RESULTS")
                errMsg =
                  "Error Getting Estimation, Please check your distination Address.";
            }
            data["error"] = true;
            data["msg"] = errMsg;
            reject(data);
          }
          //Got response
        } else {
          data["error"] = true;
          data["msg"] = error.toString();
          reject(data);
        }
      }
    );
  });
};

export const getDistanceAndTimeFromGDM2 = async (origins, destinations) => {
  if (featuresSettings.useRedisCache) {
    var hashKey = getGMDKey(origins, destinations);
    var hashValue = await checkCacheGDM(hashKey);
    if (hashValue != false) return JSON.parse(hashValue);
  }
  //getDistanceAndTimeFromGDMTrafic(origins, destinations);
  let data = {
    error: false,
    msg: "",
    distanceValue: 0, //Meters
    distanceLable: "",
    timeValue: 0, //Minutes
    timeLable: "",
    from: "",
    to: "",
  };
  var smsRequestURL =
    "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=" +
    origins +
    "&destinations=" +
    destinations +
    "&departure_time=now&key=" +
    config.googleApi;
  return new Promise(function (resolve, reject) {
    request.get(
      {
        url: smsRequestURL,
      },
      function (error, response, distances) {
        if (!error && response.statusCode == 200) {
          distances = JSON.parse(distances);
          if (typeof distances !== "undefined") {
            data.from = distances.origin_addresses[0];
            data.to = distances.destination_addresses[0];
            data.distanceLable = distances.rows[0].elements[0].distance.text;
            data.distanceValue = distances.rows[0].elements[0].distance.value;
            data.timeLable =
              distances.rows[0].elements[0].duration_in_traffic.text;
            data.timeValue =
              distances.rows[0].elements[0].duration_in_traffic.value;
            if (featuresSettings.useRedisCache) {
              redis_client.setex(hashKey, 2592000, JSON.stringify(data)); //30Days
            }
            resolve(data);
          } else {
            // If Api gives error response
            var errMsg = distances.error_message;
            if (!errMsg) {
              errMsg = distances.rows[0].elements[0].status;
              if (errMsg == "ZERO_RESULTS")
                errMsg =
                  "Error Getting Estimation, Please check your distination Address.";
            }
            data["error"] = true;
            data["msg"] = errMsg;
            reject(data);
          }
          //Got response
        } else {
          data["error"] = true;
          data["msg"] = error.toString();
          reject(data);
        }
      }
    );
  });
};
// export const getDistanceAndTimeFromGDM2 = async (origins, destinations) => {
//   GoogleDistanceMatrix.units('metric');
//   // GoogleDistanceMatrix.mode('driving');

//   let data = {
//     'error': false,
//     'msg': '',
//     'distanceValue': 0,//Meters
//     'distanceLable': '',
//     'timeValue': 0,//Minutes
//     'timeLable': '',
//     'from': '',
//     'to': '',
//   }

//   return new Promise(function (resolve, reject) {

//     const formData = {
//       from: origins,
//       to: destinations,
//       key: config.googleApi
//     };
//     var smsRequestURL = GFunctions.convertLableDynamically(config.directionApi, formData);
//     req_uest.post(
//       {
//         url: smsRequestURL
//       },
//       function (error, response, body) {

//         if (!error && response.statusCode == 200) {
//           body = JSON.parse(body);
//           data.from = body. distances.origin_addresses[0];
//           data.to = body. distances.destination_addresses[0];
//           data.distanceLable = body.distances.rows[0].elements[0].distance.text;
//           data.distanceValue = body. distances.rows[0].elements[0].distance.value;
//           data.timeLable = body.distances.rows[0].elements[0].duration_in_traffic.text;
//           data.timeValue = body.distances.rows[0].elements[0].duration_in_traffic.value;
//           resolve(JSON.parse(body));
//         } else {
//           resolve(body);
//         }
//       }
//     );

//   });
// }

export const getDistanceAndTimeFromGDMTrafic = async (
  origins,
  destinations
) => {
  let originVal,
    destinationVal,
    wayPointsArr = [],
    multiLocationLength;
  var totalDist = 0,
    totalTime = 0,
    timeResult = "",
    locationLength,
    origin_addresses,
    destination_addresses;

  multiLocationLength = 1;

  /*_.map(multiLocation, function (item, index) {
    if (index == 0) {
      originVal = { latitude: item.doubleLat, longitude: item.doubleLng };
    } else if (index == multiLocationLength - 1) {
      destinationVal = { latitude: item.doubleLat, longitude: item.doubleLng };
    } else {
      wayPointsArr.push({ latitude: item.doubleLat, longitude: item.doubleLng })
    }
  });*/
  origins = origins[0].split(",");
  destinations = destinations[0].split(",");
  originVal = { latitude: origins[0], longitude: origins[1] };
  destinationVal = { latitude: destinations[0], longitude: destinations[1] };
  var request = {
    origin: originVal,
    destination: destinationVal,
    waypoints: wayPointsArr,
    optimize: true,
    units: "metric",
    mode: "driving",
  };

  let data = {
    error: false,
    msg: "",
    distanceValue: 0, //Meters
    distanceLable: "",
    timeValue: 0, //Minutes
    timeLable: "",
    from: "",
    to: "",
  };

  return new Promise(function (resolve, reject) {
    googleMapsClient.directions(request, function (err, response) {
      if (err) {
        data["error"] = true;
        data["msg"] = err.toString();
        reject(data);
      } else {
        if (response.json.status == "ZERO_RESULTS") {
          data["error"] = true;
          data["msg"] = err.toString();
          reject(data);
        }

        var myroute = response.json.routes[0].legs;
        locationLength = myroute.length;

        myroute.map(function (item, index) {
          if (index == 0) {
            origin_addresses = item.start_address;
          } else if (index == locationLength - 1) {
            destination_addresses = item.end_address;
          }
          totalDist = totalDist + item.distance.value;
          totalTime = totalTime + item.duration.value;
        });

        //Time formation
        var hours = Math.floor(totalTime / 3600);
        var minutes = Math.floor((totalTime - hours * 3600) / 60);
        var seconds = totalTime - hours * 3600 - minutes * 60;
        seconds = Math.round(seconds * 100) / 100;

        var hourResult = hours < 10 ? "0" + hours : hours;
        if (hourResult == "00") {
        } else {
          timeResult = hourResult + " hours ";
        }
        var minResult = minutes < 10 ? "0" + minutes : minutes;
        if (minResult == "00") {
        } else {
          timeResult += minResult + " minutes ";
        }
        var secResult = seconds < 10 ? "0" + seconds : seconds;
        if (secResult == "00") {
        } else {
          timeResult += secResult + " seconds ";
        }
        // totalDist = totalDist ;

        data.from = origin_addresses;
        data.to = destination_addresses;
        data.distanceLable = totalDist / 1000 + " km";
        data.distanceValue = totalDist;
        data.timeLable = timeResult;
        data.timeValue = totalTime;
        if (data.to == null || data.to == undefined || data.to == "") {
          if (multiLocationLength == 2) {
            data.to = multiLocation[1].strAddress;
          }
        }
        resolve(data);
      }
    });
  });
};

/**
 * get Distance And Time From GDM for Single Orign and distination
 *  @param origins =  [ '9.924068,78.123846' ] , destinations = [ '9.914485,78.123122' ]
 *  @return Success Response : {"error":false,"distanceValue":1857,"distanceLable":"1.9 km","timeValue":465,"timeLable":"8 mins","from":"152 A/5, North Veli Street, Near Bharat Petrolium, North Veli Street, Madurai, Tamil Nadu 625001, India","to":"Panthadi Street, Mahal Area, Madurai Main, Madurai, Tamil Nadu 625001, India"}
 */
export const getDistanceAndTimeFromGDM1 = async (multiLocation) => {
  let originVal,
    destinationVal,
    wayPointsArr = [],
    multiLocationLength;
  var totalDist = 0,
    totalTime = 0,
    timeResult = "",
    locationLength,
    origin_addresses,
    destination_addresses;
  multiLocationLength = multiLocation.length;

  _.map(multiLocation, function (item, index) {
    if (index == 0) {
      originVal = { latitude: item.doubleLat, longitude: item.doubleLng };
    } else if (index == multiLocationLength - 1) {
      destinationVal = { latitude: item.doubleLat, longitude: item.doubleLng };

    } else {
      wayPointsArr.push({
        latitude: item.doubleLat,
        longitude: item.doubleLng,
      });
    }
  });

  var request = {
    origin: originVal,
    destination: destinationVal,
    waypoints: wayPointsArr,
    optimize: true,
    units: "metric",
    mode: "driving",
  };

  let data = {
    error: false,
    msg: "",
    distanceValue: 0, //Meters
    distanceLable: "",
    timeValue: 0, //Minutes
    timeLable: "",
    from: "",
    to: "",
  };
  return new Promise(function (resolve, reject) {
    googleMapsClient.directions(request, function (err, response) {
      if (err) {
        data["error"] = true;
        data["msg"] = err.toString();
        reject(data);
      } else {
        if (response.json.status == "ZERO_RESULTS") {
          data["error"] = true;
          data["msg"] = err.toString();
          reject(data);
        }
        var myroute = response.json.routes[0].legs;
        locationLength = myroute.length;

        myroute.map(function (item, index) {
          if (index == 0) {
            origin_addresses = item.start_address;
          } else if (index == locationLength - 1) {
            destination_addresses = item.end_address;
          }
          totalDist = totalDist + item.distance.value;
          totalTime = totalTime + item.duration.value;
        });

        //Time formation
        var hours = Math.floor(totalTime / 3600);
        var minutes = Math.floor((totalTime - hours * 3600) / 60);
        var seconds = totalTime - hours * 3600 - minutes * 60;
        seconds = Math.round(seconds * 100) / 100;

        var hourResult = hours < 10 ? "0" + hours : hours;
        if (hourResult == "00") {
        } else {
          timeResult = hourResult + " hours ";
        }
        var minResult = minutes < 10 ? "0" + minutes : minutes;
        if (minResult == "00") {
        } else {
          timeResult += minResult + " minutes ";
        }
        var secResult = seconds < 10 ? "0" + seconds : seconds;
        if (secResult == "00") {
        } else {
          timeResult += secResult + " seconds ";
        }
        // totalDist = totalDist ;

        data.from = origin_addresses;
        data.to = destination_addresses;
        data.distanceLable = totalDist / 1000 + " km";
        data.distanceValue = totalDist;
        data.timeLable = timeResult;
        data.timeValue = totalTime;
        if (data.to == null || data.to == undefined || data.to == "") {
          if (multiLocationLength == 2) {
            data.to = multiLocation[1].strAddress;
          }
        }
        resolve(data);
      }
    });
  });
};

//GDM cahe helpers
function getGMDKey(origins, destinations) {
  var res = origins[0].split(",");
  var res2 = destinations[0].split(",");
  var orgin = getLatLngRound(res[0]) + "," + getLatLngRound(res[1]);
  var dest = getLatLngRound(res2[0]) + "," + getLatLngRound(res2[1]);
  return md5(orgin + ";" + dest);
}

function getLatLngRound(latlng) {
  return Math.round((Number(latlng) + Number.EPSILON) * 100000) / 100000;
}

async function checkCacheGDM(hashKey) {
  return new Promise(function (resolve, reject) {
    redis_client.get(hashKey, (err, data) => {
      if (err) {
        resolve(false);
      }
      //if no match found
      if (data != null) {
        resolve(data);
      } else {
        //proceed to next middleware function
        resolve(false);
      }
    });
  });
}
//GDM cahe helpers

//Notify Rider
export const notifyRider = async (
  
  userid,
  msg,
  requestId,
  tripstatus = "noresponse"
) => {
  var update = {
    status: tripstatus,
    review: msg,
  };
  Trips.findOneAndUpdate(
    { _id: requestId },
    update,
    { new: false },
    async(err, doc) => {
      if (err) {
      } else {
        updateRiderFbStatus(userid, msg, requestId);
        let transactionID = await Paymentflow.find({userId:mongoose.Types.ObjectId(userid)}).sort({createdAt:-1})
        if(doc &&(["noresponse","Cancelled"]).includes(tripstatus) && doc.paymentMode == 'card'){
          if(transactionID.length!=0) {
            await paymentCtrl.captureHoldChargeExistingUserCard({
              mode: config.paymentGateway.paymentGatewayName || "",
              referenceId : doc._id,
              action : "refund",
              transactionId:transactionID[0].transactionId
            })
          }

        }
      }
    }
  );
};

export const updateRiderFbStatus = (userid, msg, requestId = "0") => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebasekey);
  }
  var db = firebase.database();
  var ref = db.ref("riders_data");
  var requestData = {
    tripstatus: msg,
    requestId: requestId,
  };
  var child = userid.toString();
  var usersRef = ref.child(child);
  usersRef.update(requestData);
};

/**
 * Return "Notes : Peak Fare x0.5 (20.22 - 8411.54)"
 * @param {*} label 'Notes : Peak Fare x{PERCENTAGE} ({TIME})'
 * @param {*} obj  {'PERCENTAGE' : .5, 'TIME' : '20.22 - 8411.54' }
 */
export const convertLableDynamically = (label, obj) => {
  var newLable = label;
  for (var key in obj) {
    let strToReplace = "{" + key + "}";
    newLable = newLable.replace(strToReplace, obj[key]);
  }
  return newLable;
};

export const convertObjToMongooseSchema = (label, obj) => {
  var resObj = _.mapValues(string1, function (v) {
    if (typeof v === "number") {
      return "Number";
    } else if (typeof v === "string") {
      return typeof v;
    } else if (typeof v === "boolean") {
      return "Boolean";
    }
  });

  return resObj;
};

/**
 * roundAllValuesToTwoDigits
 * @param {*} params  OBJ
 */
export const roundAllValuesToTwoDigits = (resObj) => {
  var resultObj = _.mapValues(resObj, function (v) {
    if (typeof v === "number") {
      return parseFloat(v.toFixed(2));
    } else {
      return v;
    }
  }); //Round all to 2 Decimals
  return resultObj;
};

/**
 * standard date format
 */
export const setFormatDate = (date) => {
  if (date) {
    var result = moment(date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format(
      "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
    );
    return result;
  } else {
    return null;
  }
};

export const sendSecondaryRate = (amount = 0) => {
  var conversionRate = featuresSettings.conversionRate;
  var convertRate = parseFloat(Number(amount) * Number(conversionRate)).toFixed(
    featuresSettings.roundOff
  );
  return convertRate;
};

export const hideEmailDataForDemo = (string) => {
  if (!string) return "";
  var domain = string.split(".");
  var firstTwo = string.substr(0, 2);
  if (!domain[1]) domain[1] = "com";
  var res = firstTwo + "****@**" + domain[1];
  return res;
};

export const hidePhoneDataForDemo = (string) => {
  if (!string) return "";
  var last = string.slice(-3);
  return "*******" + last;
};

export const getSession = (key) => {
  let session = require("continuation-local-storage").getNamespace("session");
  if (session != undefined) {
    return session.get(key);
  }
  return "";
};

export const getDistanceAndTimeFromGDMForEncode = async (
  origins,
  destinations
) => {
  GoogleDistanceMatrix.units("metric");
  GoogleDistanceMatrix.mode("driving");
  let data = {
    error: false,
    msg: "",
    distanceValue: 0, //Meters
    distanceLable: "",
    timeValue: 0, //Minutes
    timeLable: "",
    from: "",
    to: "",
  };
  return new Promise(function (resolve, reject) {
    GoogleDistanceMatrix.matrix(
      origins,
      destinations,
      function (err, distances) {
        try {
          if (err) {
            data["error"] = true;
            data["msg"] = err.toString();
            reject(data);
          }
          if (!distances) {
            data["error"] = true;
            data["msg"] = err.toString();
            reject(data);
          }
          if (
            typeof distances !== "undefined" &&
            distances !== null &&
            typeof distances.status !== "undefined" &&
            distances.status == "OK" &&
            typeof distances.rows !== "undefined" &&
            typeof distances.rows[0] !== "undefined" &&
            typeof distances.rows[0].elements !== "undefined" &&
            typeof distances.rows[0].elements[0] !== "undefined" &&
            typeof distances.rows[0].elements[0].distance !== "undefined"
          ) {
            resolve(distances);
          } else {
            // If Api gives error response
            data["error"] = true;
            data["msg"] = distances.error_message;
            reject(data);
          }
        } catch (error) {
          data["error"] = true;
          data["msg"] = err.toString();
          reject(data);
        }
      }
    );
  });
};

export const convertToNumber = (value) => {
  if (value == "true") {
    return true;
  } else if (value == "false") {
    return false;
  } else if (value > 0) {
    value = parseInt(value);
    return value;
  } else {
    return value;
  }
};

export const restartServer = () => {
  setTimeout(function () {
    process.exit(1);
  }, 10000); //30000 = 30 sec
};

export const getFirebaseSupportedChars = (value) => {
  if (value) {
    value = value
      .replace("/", "_")
      .replace(".", "_")
      .replace("#", "_")
      .replace("$", "_")
      .replace("]", "_")
      .replace("[", "_");
    return value;
  } else {
    return "_";
  }
};

export const isStarExistsInString = (value) => {
  if (value) {
    return value.includes("*");
  } else {
    return false;
  }
};

export const convertAllNumbersToString = (obj) => {
  obj = _.mapValues(obj, function (v) {
    if (typeof v === "number") {
      return v.toFixed(2);
    } else {
      return v;
    }
  }); //Round all to 2 Decimals
  return obj;
};

export const roundAmountToNearByFive = (value) => {
  if (typeof value === "number") {
    return Math.ceil(value / 5) * 5;
  } else {
    return value;
  }
};

export const roundAmountToGivenMultiples = (
  value,
  multipler = featuresSettings.multipler
) => {
  var baseUnit = value / multipler;
  var decimalNo = (baseUnit + "").split(".");
  if (Number(decimalNo[1]) <= 5) {
    return Math.floor(baseUnit) * multipler;
  } else {
    return Math.ceil(baseUnit) * multipler;
  }
};

export const convertHrToLable = (value) => {
  var returnLable = "";
  var days = Math.floor(value / 24);
  returnLable = days + " Days";
  var Remainder = Math.floor(value - days * 24);
  if (Remainder > 0) {
    if (days == 0) {
      returnLable = Remainder + " Hours";
    } else {
      returnLable = days + " Days " + Remainder + " Hours";
    }
  }
  return returnLable;
};

export const convertMinToLable = (value) => {
  return value + " mins";
};

export const getNextGivenDaysFromHours = (hours, startDate) => {
  var hoursInADay = [
    "12:00 AM",
    "12:30 AM",
    "01:00 AM",
    "01:30 AM",
    "02:00 AM",
    "02:30 AM",
    "03:00 AM",
    "03:30 AM",
    "04:00 AM",
    "04:30 AM",
    "05:00 AM",
    "05:30 AM",
    "06:00 AM",
    "06:30 AM",
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
  ];
  var opDateFormat = "",
    opTimeFormat = "hh:mm A";
  var convertedDate = getDateTimeinThisFormat(startDate, "D MMM YYYY, HH:mm a");
  var nextDT = moment(convertedDate).add(hours, "hours");
  var nextDate = getDateTimeinThisFormat(
    nextDT,
    "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
    "D MMM YYYY"
  );
  var nextTime = getDateTimeinThisFormat(
    nextDT,
    "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
    opTimeFormat
  );
  var upToNoOfDays = 10;
  var returnDays = [];
  returnDays.push({
    lable: nextDate,
    value: nextDT,
  });

  const remainder = 30 - (nextDT.minute() % 30);
  const dateTime = moment(nextDT)
    .add(remainder, "minutes")
    .format(opTimeFormat);

  var index = hoursInADay.indexOf(dateTime);
  var hoursInCurrentDay = hoursInADay.slice(index); //Need to assign it to the same or another variable

  for (var i = 1; i <= upToNoOfDays; i++) {
    //Push Next day
    var currentDate = moment(nextDT).add(i, "days");
    var currentDateLable = getDateTimeinThisFormat(
      currentDate,
      "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
      "D MMM YYYY"
    );
    returnDays.push({
      lable: currentDateLable,
      value: currentDate,
    });
  }

  return {
    returnDays: returnDays,
    hoursInCurrentDay: hoursInCurrentDay,
    hoursInADay: hoursInADay,
  };
};

/*export const calculateDistanceBasedOnLimit = async (from, to, distanceInUnit, waitingTimeInMins, timeInMinutes) => {
  var modifiedDistanceAndTime = {
    distanceValue: distanceInUnit,
    timeValue: timeInMinutes,
    waitingTimeInMins: waitingTimeInMins,
  };
  // from, to, distanceInUnit
  var gdmResult = await getDistanceAndTimeFromGDM([from], [to]);
  if (gdmResult.error) return modifiedDistanceAndTime;
  if (config.distanceUnit == 'Miles') {
    var googleDistance = parseFloat(gdmResult.distanceValue * 0.000621371).toFixed(2);
  } else {
    var googleDistance = parseFloat(gdmResult.distanceValue / 1000).toFixed(2);
  }

  //Waiting time Verification
  // 1. travel time - google time
  // 2. if positive(google waiting time = travel time - google time)
  // 3. if (google waiting time  deviates app waiting time by some percentage ) waiting time = google waiting
  var calwaitingTime = Number(Number(timeInMinutes) - Number(gdmResult.timeValue));
  if (calwaitingTime > 0) {
    var difBtAppNCal = Number(waitingTimeInMins) - Number(calwaitingTime);
    if (Number(difBtAppNCal) < 0) modifiedDistanceAndTime['waitingTimeInMins'] = Number(calwaitingTime);
  }

  //Distance Verification
  if (distanceInUnit > googleDistance) {
    var extraDistance = ((featuresSettings.calMaxDistancePercentage / 100) * googleDistance).toFixed(2);
    var extraDistanceLimit = Number(googleDistance) + Number(extraDistance);
    if (distanceInUnit > extraDistanceLimit) {
      distanceInUnit = Number(extraDistanceLimit).toFixed(2);
      modifiedDistanceAndTime['distanceValue'] = distanceInUnit;
      return modifiedDistanceAndTime;
    }
    else {
      distanceInUnit = Number(distanceInUnit).toFixed(2);
      modifiedDistanceAndTime['distanceValue'] = distanceInUnit;
      return modifiedDistanceAndTime;
    }
  }
  else if (distanceInUnit < googleDistance) {
    var MinDistance = ((featuresSettings.calMinDistancePercentage / 100) * googleDistance).toFixed(2);
    var MinDistanceLimit = Number(googleDistance) - Number(MinDistance);
    if (distanceInUnit < MinDistanceLimit) {
      distanceInUnit = Number(googleDistance).toFixed(2);
      modifiedDistanceAndTime['distanceValue'] = distanceInUnit;
      return modifiedDistanceAndTime;
    }
    else {
      distanceInUnit = Number(distanceInUnit).toFixed(2);
      modifiedDistanceAndTime['distanceValue'] = distanceInUnit;
      return modifiedDistanceAndTime;
    }
  }
  else {
    distanceInUnit = Number(distanceInUnit).toFixed(2);
    modifiedDistanceAndTime['distanceValue'] = distanceInUnit;
    return modifiedDistanceAndTime;
  }
}*/

export const calculateDistanceBasedOnLimit = async (
  from,
  to,
  distanceInUnit,
  waitingTimeInMins,
  timeInMinutes,
  estimationKM = 0
) => {

  var modifiedDistanceAndTime = {
    distanceValue: distanceInUnit,
    timeValue: timeInMinutes,
    waitingTimeInMins: waitingTimeInMins,
  };
  // from, to, distanceInUnit
  var gdmResult = await getDistanceAndTimeFromGDM([from], [to]);
  if (gdmResult.error) {
    return modifiedDistanceAndTime;
  }

  if (config.distanceUnit == "Miles") {
    var googleDistance = parseFloat(
      gdmResult.distanceValue * 0.000621371
    ).toFixed(2);
  } else {
    var googleDistance = parseFloat(gdmResult.distanceValue / 1000).toFixed(2);

  }

  //Waiting time Verification
  // 1. travel time - google time
  // 2. if positive(google waiting time = travel time - google time)
  // 3. if (google waiting time  deviates app waiting time by some percentage ) waiting time = google waiting
  var calwaitingTime = Number(
    Number(timeInMinutes) - Number(gdmResult.timeValue)
  );
  if (calwaitingTime > 0) {
    var difBtAppNCal = Number(waitingTimeInMins) - Number(calwaitingTime);
    if (Number(difBtAppNCal) < 0)
      modifiedDistanceAndTime["waitingTimeInMins"] = Number(calwaitingTime);
    // else modifiedDistanceAndTime['waitingTimeInMins'] =Number(gdmResult.timeValue);
  }

  // if  total - waiting < 0
  //   total time = cal START TIME - END TIME;
  //   waiting = total time - google time;
  //   if(waiting > 0 ) waiting = waiting;
  var calTime = Number(timeInMinutes) - Number(waitingTimeInMins);
  if (calTime < 0) {
    modifiedDistanceAndTime["waitingTimeInMins"] = calwaitingTime;
  }
  if (waitingTimeInMins > 0)
    modifiedDistanceAndTime["waitingTimeInMins"] = waitingTimeInMins;
  //Distance Verification
  // if (Number(googleDistance) <= 0) {
  //   if (Number(distanceInUnit) <= 0) {
  //     console.log("---conditestttt---",Number(distanceInUnit),Number(googleDistance) )
  //     console.log("---condi2---",Number(distanceInUnit) <= 0)
  //     modifiedDistanceAndTime["distanceValue"] = estimationKM
  //       ? estimationKM
  //       : distanceInUnit;
  //   } else {
  //     modifiedDistanceAndTime["distanceValue"] = distanceInUnit;
  //   }
  //   return modifiedDistanceAndTime;
  // }
  if (Number(distanceInUnit) > Number(googleDistance)) {
    var extraDistance = (
      (featuresSettings.calMaxDistancePercentage / 100) *
      Number(googleDistance)
    ).toFixed(2);
    var extraDistanceLimit = Number(googleDistance) + Number(extraDistance);
    if (Number(distanceInUnit) > Number(extraDistanceLimit)) {
      //need to check is timly possible if so have it
      var isCheckEndMeterPossibleValid = await checkEndMeterPossible(
        distanceInUnit,
        timeInMinutes
      );
      if (!isCheckEndMeterPossibleValid) {
        distanceInUnit = Number(extraDistanceLimit).toFixed(2);
      }
      modifiedDistanceAndTime["distanceValue"] = distanceInUnit;
      return modifiedDistanceAndTime;
    } else {
      distanceInUnit = Number(distanceInUnit).toFixed(2);
      modifiedDistanceAndTime["distanceValue"] = distanceInUnit;
      return modifiedDistanceAndTime;
    }
  } 
  
  else if (Number(distanceInUnit) < Number(googleDistance)) {

var MinDistance = (
      (featuresSettings.calMinDistancePercentage / 100) *
      Number(googleDistance)
    ).toFixed(2);
    var MinDistanceLimit = Number(googleDistance) - Number(MinDistance);
    if (Number(distanceInUnit) < Number(MinDistanceLimit)) {
      distanceInUnit = Number(googleDistance).toFixed(2);
      modifiedDistanceAndTime["distanceValue"] = distanceInUnit;
      return modifiedDistanceAndTime;
    } else {
      distanceInUnit = Number(distanceInUnit).toFixed(2);
      modifiedDistanceAndTime["distanceValue"] = distanceInUnit;
      return modifiedDistanceAndTime;
    }
  } else {

    distanceInUnit = Number(distanceInUnit).toFixed(2);
    modifiedDistanceAndTime["distanceValue"] = distanceInUnit;
    return modifiedDistanceAndTime;
  }
};

// Outsation

export const getDaysBtDateTime = (
  endDate,
  startDate,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
  hours
) => {
  var start_date = moment(startDate);
  var end_date = moment(endDate);
  var duration = moment.duration(end_date.diff(start_date));
  var days = duration.asDays();
  days = Math.ceil(days);
  // var minutes = parseInt(duration.asMinutes()) % 60;
  // From 11pm to 5am is night timing.So it will be only 1 night bata and no day bata
  var reduceOneDay = false;
  var currentDate = moment(
    getDateTimeinThisFormat(startDate, timeformat, timeformat)
  ); //Current start time
  var currentDateAtFrom = moment(
    getDateTimeinThisFormat(
      currentDate,
      timeformat,
      "YYYY-MM-DDT" + hours.from + ".00[Z]"
    )
  );
  var endDateTime = moment(
    getDateTimeinThisFormat(endDate, timeformat, timeformat)
  ); //Current endDate time
  var endDateAtTo2 = moment(startDate).add(1, "days").format(timeformat);
  var endDateAtTo = moment(
    getDateTimeinThisFormat(
      endDateAtTo2,
      timeformat,
      "YYYY-MM-DDT" + hours.to + ".00[Z]"
    )
  );
  if (
    currentDateAtFrom.isBefore(currentDate) ||
    currentDateAtFrom.isSame(currentDate)
  ) {
    if (
      endDateTime.isBefore(endDateAtTo) ||
      currentDateAtFrom.isSame(endDateTime)
    ) {
      reduceOneDay = true;
    }
  }
  if (reduceOneDay) --days;
  return days;
};

export const getNoOfDaysForOutstation = (totalChoosenHours) => {
  var days = Math.ceil(totalChoosenHours / 26);
  return days;
};

export const getNightsBtDateTime = (
  hours,
  endDate,
  startDate,
  noofdays,
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var totalNights = noofdays - 1;
  var start_date = moment(startDate);
  var end_date = moment(endDate);

  if (noofdays > 1) {
    var duration = moment.duration(end_date.diff(start_date));
    duration = duration.asDays();
    duration = Math.floor(duration);
    start_date = getStartCountDateFromStart(startDate, duration, "days");
  }
  var noOfHoursInNight = 0; //on last date

  var dif = moment.duration(end_date.diff(start_date));
  dif = dif.asHours();
  while (dif > 0) {
    var currentTime = start_date;
    var isTimeFallsInNight = getFareIfTimeFallsIn(hours, currentTime);
    if (isTimeFallsInNight.isApply) noOfHoursInNight = noOfHoursInNight + 1;
    start_date = getEndDateFromStart(currentTime, 1, "hours");
    dif = moment.duration(end_date.diff(start_date));
  }

  if (noOfHoursInNight >= 1) totalNights = totalNights + 1;
  return totalNights;
};

//hours => from DB
//now => iso format
function getFareIfTimeFallsIn(hours, now, noOfDays) {
  var resObj = { isApply: false };
  var format = "HH:mm:ss";
  if (!now || now == "") {
    now = sendTimeNow(format);
  } else {
    now = getDateTimeinThisFormat(now, "YYYY-MM-DDTHH:mm:ss.SSS[Z]", format);
  }

  var to = moment(hours.to, format),
    from = moment(hours.from, format),
    tempnow = moment(now, format),
    now = moment(tempnow, format);
  if (from > to) {
    //22PM to 8AM
    if (now.isBetween(to, from)) {
      resObj.isApply = false;
    } else {
      resObj.isApply = true;
    }
  } else {
    if (now.isBetween(from, to)) {
      resObj.isApply = true;
    } else {
      resObj.isApply = false;
    }
  }

  return resObj;
}

export const getEndDateFromStart = (
  startDT,
  add = 1,
  addtype = "hours",
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var myDate = moment(startDT).add(add, addtype).format(timeformat);
  return myDate;
};

export const getStartCountDateFromStart = (
  startDT,
  sub = 1,
  addtype = "hours",
  timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
) => {
  var myDate = moment(startDT).subtract(sub, addtype).format(timeformat);
  return myDate;
};

export const getNightsBtDateTimeNewMtd = (hours, endDate, startDate) => {
  var noOfNight = 0;
  var timeformat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]";
  var startTime = moment(hours.from, "HH:mm:ss");
  var endTime = moment(hours.to, "HH:mm:ss");
  var isStartTimeFallsInNight = getFareIfTimeFallsIn(hours, startDate);
  if (isStartTimeFallsInNight.isApply) {
    noOfNight = noOfNight + 1;
  }
  var currentDate = getDateTimeinThisFormat(
    startDate,
    timeformat,
    "YYYY-MM-DDT00:00:00.00[Z]"
  ); //Current day
  if (noOfNight == 1) {
    var startDateAtFrom = getDateTimeinThisFormat(
      startDate,
      timeformat,
      "HH:mm:ss"
    );
    startDateAtFrom = moment(startDateAtFrom, "HH:mm:ss");
    if (
      startTime.isBefore(startDateAtFrom) ||
      startTime.isSame(startDateAtFrom)
    ) {
      //Only if crossed at night
      currentDate = moment(currentDate)
        .add(1, "days")
        .format("YYYY-MM-DDT00:00:00.00[Z]");
    }
  }
  var checkForCurrentDate = true;
  while (checkForCurrentDate) {
    //if hours.from < hours.to = add 1 day to currentDate
    if (startTime.isBefore(endTime)) {
      currentDate = moment(currentDate)
        .add(1, "days")
        .format("YYYY-MM-DDT00:00:00.00[Z]");
    }
    //check current Date cross night
    var currentDateAtFrom = getDateTimeinThisFormat(
      currentDate,
      timeformat,
      "YYYY-MM-DDT" + hours.from + ".00[Z]"
    );
    //check is currentDateAtFrom less than end date
    var isCurrentDateAtFromValid = moment(currentDateAtFrom).isBefore(endDate);
    if (isCurrentDateAtFromValid) {
      noOfNight = noOfNight + 1;
    }
    //add one day to current day
    currentDate = moment(currentDate)
      .add(1, "days")
      .format("YYYY-MM-DDT00:00:00.00[Z]");
    checkForCurrentDate = moment(currentDate).isBefore(endDate);
  }
  return noOfNight;
};

function getAccessTokens() {
  let SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];
  return new Promise((resolve, reject) => {
    let jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      [SCOPES],
      null
    );

    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}



export const sendchatFCM = async(req,res)=> {  ///Chat FCM Msg//
  try {
    let body = JSON.stringify(req.body)
    body = JSON.parse(body)
    let touser = body.token;
    // if(typeof(body.data) == "string") {
    //   body.data = JSON.parse(body.data)
    // }
    let fcmmessage = {
      message: {
        token: touser,
        android: {
          priority: "HIGH",
          notification: {
            title: body.data.title,
            body: body.data.message,
            sound: "default"
          }
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: body.data.title,
                body: body.data.message
              },
              sound: "default"
            }
          }
        },
        webpush: {
          notification: {
            title: body.data.title,
            body: body.data.message,
            icon: "your_icon_url" // Optional
          }
        },
        data: {
          title: body.data.title,
          message: body.data.message,
          type:body.data.type,
          click_action:body.data.click_action,
        }
      }
    };
    let token = await getAccessTokens(); 
    let response = await axios.post(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      fcmmessage,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    return res.status(200).json({
      success: true,
      message: "Notification Sended successfully",
      data:response.data
    });
  } catch (err) {
    console.error("Error sending notification:", err.response ? err.response.data : err);
    return res
    .status(500)
    .json({ success: false, message: err.message, err: err });
  }
}
