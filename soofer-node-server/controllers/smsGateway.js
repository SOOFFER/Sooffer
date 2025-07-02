const config = require('../config');
const curSmsGateway = config.smsGateway.smsGatewayName;
import * as GFunctions from './functions';
import Admin from '../models/admin.model';
import mongoose, { Query } from 'mongoose';


const request = require('request');

if (curSmsGateway == 'twilio') {
  var twilio = require('twilio');
  var accountSid = config.smsGateway.twilioaccountSid; // Your Account SID from www.twilio.com/console
  var authToken = config.smsGateway.twilioauthToken;   // Your Auth Token from www.twilio.com/console
  var twilioNo = config.smsGateway.twilioNo;   // From a valid Twilio number
  var client = new twilio(accountSid, authToken);
}

if (curSmsGateway == 'nexmo') {
  const Nexmo = require('nexmo');
  const nexmoConfig = new Nexmo({
    apiKey: config.smsGateway.nexmoapiKey,
    apiSecret: config.smsGateway.nexmoapisecret,
  });
}

import Rider from '../models/rider.model';
import { Mongoose } from 'mongoose';
import { admin } from 'googleapis/build/src/apis/admin';

var FromSMS = config.appName;
var Footer = "Thank you.";
var Footer1 = "Happy Ride!"
var Footer2 = "See you again!"
var Footer3 = "Regards!"
var Footer4 = "Thank You!"
var downloadLink = "Download app here : " + config.applink

const sendSMSFor = {
  'verifyNumberRider': 'Your OTP Verification Code for+' + FromSMS + `: {RANDOMSMS}` + " " + Footer, /* '<#> OTP to install ' + FromSMS + ' app is {RANDOMSMS}' */
  // 'verifyNumberDriver': 'OTP+to+v+Express+Track+app+is+{RANDOMSMS}',
  'verifyNumberDriver': 'Your OTP Verification Code for ' + FromSMS + `: {RANDOMSMS}` + " " + Footer,
  'forgotPasswordDriver': 'Use this {OTPCODE} Time Password to reset your Password in '  + FromSMS + " " + Footer,
  'forgotPasswordRider': 'Use this {OTPCODE} Time Password to reset your Password in ' + FromSMS + " " + Footer,
  'emergencyMsg': '{NAME} ({PHONE}) is riding in ' + FromSMS + ' has reached you because of some emergency, you can track his ride here {URLLINK}.' + " " + Footer,
  // 'sendTripAcceptedSMSToRider': 'Driver+has+been+allocated+for+your+Trip+No.+{TRIPNO},+Vehicle+Number:+{VEHICLENO},+Driver+Name:+{DRIVERNAME},+Driver+Number:+{DRIVERNO},+OTP+to+ride+is+{OTP}.+Download+App+Here+:+' + config.applink, 'sendTripAcceptedSMSToRiderForApp': FromSMS + ' Driver has allocated for your Trip No. {TRIPNO}, Vehicle Number: {VEHICLENO},  Driver Name: {DRIVERNAME}, Driver Number: {DRIVERNO}, OTP to ride is {OTP}.' + FromSMS + ".",
  'sendTripAcceptedSMSToRider': '{DRIVERNAME} ({DRIVERNO}) is on the way to your location in a {VEHICLENNAME} {VEHICLENO}. Once you board your ' + FromSMS + ' ride, please share OTP-{OTP} with driver to start trip.' + " " + Footer,
  'sendTripAcceptedSMSToRiderForApp': '{DRIVERNAME} ({DRIVERNO}) is on the way to your location in a {VEHICLENNAME} {VEHICLENO}. Once you board your ' + FromSMS + ' ride, please share OTP-{OTP} with driver to start trip.' + " " + Footer,
  // 'sendTripAcceptedSMSToRiderForApp': 'Driver+has+been+allocated+for+your+Trip+No.+{TRIPNO},+Vehicle+Number:+{VEHICLENO},+Driver+Name:+{DRIVERNAME},+Driver+Number:+{DRIVERNO},+OTP+to+ride+is+{OTP}.+Download+App+Here+:+' + config.applink, 'sendTripAcceptedSMSToRiderForApp': FromSMS + ' Driver has allocated for your Trip No. {TRIPNO}, Vehicle Number: {VEHICLENO},  Driver Name: {DRIVERNAME}, Driver Number: {DRIVERNO}, OTP to ride is {OTP}.+Download+'+FromSMS+"+App+Here+:+" + config.applink,
  'rideLaterReceived': 'Your Ride Later request with Reference No: {TRIPNO} received, we will assign Driver before Trip Time.' + " " + Footer,
  // 'tripEndPaymentToRider': 'Please+pay+Rs.{FEE}+to+driver.Thank+you.+' + FromSMS + ".",
  // 'tripEndPaymentToRider': 'Thanks+for+using+' + FromSMS + '!+Amount+for+Booking+ID+({TRIPNO})+is+Rs.+{FEE}.Kindly+login+to+app+to+view+your+invoice.+Download+' + FromSMS + "+App+Here+:+" + config.applink + Footer,
  'tripEndPaymentToRider': 'Amount for Booking No ({TRIPNO}) is Rs. {FEE}.Kindly login to app to view your invoice. Download ' + FromSMS + " App Here : " + config.applink + " " + Footer,
  'noDriverFound': '{DRIVERSTATUS} for Reference No ({TRIPNO}) for Trip Type {TRIPTYPE}.' + FromSMS, //'No+Driver+Found','No+Driver+REsponse'
  'sendTripCancelledSMSToRider': 'Your Trip with Reference No: {TRIPNO} has been cancelled by admin because of {REASON}. Please retry again.' + " " + Footer,
  'resetPasswordFromAdmin': 'Your Password has been reseted to: {PASSWORD} by admin.' + FromSMS
};


export const sendSmsMsg = (smsto, smsbody = '', phCode = config.phoneCode, subject, sendSMSForKey = '', msgObj = {}) => {
  if (smsbody == '') smsbody = generateSMSBody(sendSMSForKey, msgObj);
  // console.log("__________smsto",smsto,"_smsbody",smsbody,"______phCode",phCode,"__________subject",subject,"___________sendSMSForKey",sendSMSForKey,"___msgObj",msgObj);
  var smstype = 'transactional';
  if (!sendSMSForKey || (sendSMSForKey == '')) { smstype = 'promotional'; }
  // if (smsbody == false) {
  //   return false;
  // }
  if(smsto == "string") smsto = smsto.trim();

  if (smsbody == false) {
    smsbody = subject
  }
  // phCode = '91';
  phCode = phCode.toString();
  var isphCode = phCode.startsWith("+");
  if (!isphCode) phCode = "+" + phCode;

  if (curSmsGateway == 'localAPI') {
    const formData = {
      message: smsbody,
      to: phCode + smsto
    };
    var smsRequestURL = GFunctions.convertLableDynamically(config.smsGateway.localAPIendpoint, formData);
    request.post(
      {
        url: smsRequestURL
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
        } else {
        }
      }
    );
  }


  if ((smstype == 'transactional') && (curSmsGateway == 'websmsapp')) {
    var formData = {
      From: "DTAXII",
      To: smsto,
      TemplateName: "",
      VAR1: "",
      VAR2: "",
      VAR3: "",
      VAR4: "",
      VAR5: "",
    };

    if (sendSMSForKey == "sendTripAcceptedSMSToRider" || sendSMSForKey == "sendTripAcceptedSMSToRiderForApp") {
      formData['TemplateName'] = "TripDetailsDtaxi";
      formData['VAR1'] = msgObj.DRIVERNAME;
      formData['VAR2'] = msgObj.DRIVERNO;
      formData['VAR3'] = msgObj.VEHICLECOLOR;
      formData['VAR4'] = msgObj.VEHICLENNAME;
      formData['VAR5'] = msgObj.VEHICLENO;
      formData['VAR6'] = msgObj.OTP;
      formData['VAR7'] = Footer1
      formData['VAR8'] = FromSMS
      formData['VAR9'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "rideLaterReceived") {
      formData['TemplateName'] = "RideLaterBooking";
      formData['VAR1'] = msgObj.TRIPNO;
      formData['VAR2'] = Footer1
      formData['VAR3'] = FromSMS
      formData['VAR4'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "tripEndPaymentToRider") {
      formData['TemplateName'] = "TripFareDetailsDtaxi";
      formData['VAR1'] = msgObj.TRIPNO;
      formData['VAR2'] = msgObj.FEE;
      formData['VAR3'] = Footer2
      formData['VAR4'] = FromSMS
      formData['VAR5'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "verifyNumberDriver" || sendSMSForKey == "verifyNumberRider") {
      formData['TemplateName'] = "UserVerificationDtaxi";
      formData['VAR1'] = msgObj.RANDOMSMS;
      formData['VAR2'] = FromSMS
      formData['VAR3'] = msgObj.HASHVAL ? msgObj.HASHVAL : ""
      if (formData['VAR1'] == "") return false;
    }
    // else if (sendSMSForKey == "verifyNumberDriver" || sendSMSForKey == "verifyNumberRider") {
    //   formData['TemplateName'] = "UserVerification";
    //   formData['VAR1'] = msgObj.RANDOMSMS;
    //   formData['VAR2'] = Footer1
    //   formData['VAR3'] = FromSMS
    //   formData['VAR4'] = downloadLink
    //   if (formData['VAR1'] == "") return false;
    // }
    else if (sendSMSForKey == "forgotPasswordDriver" || sendSMSForKey == "forgotPasswordRider") {
      formData['TemplateName'] = "PasswordResetDtaxi";
      formData['VAR1'] = msgObj.OTPCODE;
      formData['VAR2'] = Footer1
      formData['VAR3'] = FromSMS
      formData['VAR4'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "emergencyMsg") {
      formData['TemplateName'] = "EmergencyMsgToRiderDtaxi";
      formData['VAR1'] = msgObj.NAME;
      formData['VAR2'] = msgObj.PHONE;
      formData['VAR3'] = msgObj.URLLINK;
      formData['VAR4'] = Footer3
      formData['VAR5'] = FromSMS
      formData['VAR6'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "noDriverFound") {
      formData['TemplateName'] = "NoDriverFoundSMS";
      formData['VAR1'] = msgObj.DRIVERSTATUS;
      formData['VAR2'] = msgObj.TRIPNO;
      formData['VAR3'] = msgObj.TRIPTYPE;
      formData['VAR4'] = Footer3
      formData['VAR5'] = FromSMS
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "sendTripCancelledSMSToRider") {
      formData['TemplateName'] = "TripCancelledSMSToRiderDtaxi";
      formData['VAR1'] = msgObj.TRIPNO;
      formData['VAR2'] = Footer3
      formData['VAR3'] = FromSMS
      formData['VAR4'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "sendTripAcceptedSMSToDriverForApp") {
      formData['TemplateName'] = "TripAssignedSMSToDriver";
      formData['VAR1'] = msgObj.TRIPNO;
      formData['VAR2'] = msgObj.TRIPTYPE;
      formData['VAR3'] = msgObj.VEHICLENNAME;
      formData['VAR4'] = msgObj.RIDERNAME;
      formData['VAR5'] = msgObj.RIDERNO;
      formData['VAR6'] = msgObj.PICKUPADDRESS;
      formData['VAR7'] = Footer1
      formData['VAR8'] = FromSMS
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "resetPasswordFromAdmin") {
      formData['TemplateName'] = "resetPasswordFromAdmin";
      formData['VAR1'] = msgObj.PASSWORD;
      formData['VAR2'] = Footer4
      formData['VAR3'] = FromSMS
      formData['VAR4'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "sendPasswordToUser") {
      formData['TemplateName'] = "SendPasswordToUser";
      formData['VAR1'] = msgObj.PASSWORD;
      formData['VAR2'] = FromSMS;
      formData['VAR3'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "BulkSMS") {
      formData['TemplateName'] = "BulkSMS";
      formData['VAR1'] = msgObj.MESSAGE;
      formData['VAR2'] = Footer4;
      formData['VAR3'] = FromSMS;
      formData['VAR4'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }
    else if (sendSMSForKey == "testSMS") {
      formData['TemplateName'] = "testSMS";
      formData['VAR1'] = FromSMS;
      formData['VAR2'] = downloadLink
      if (formData['VAR1'] == "") return false;
    }


    var smsRequestURL = "http://2factor.in/API/V1/1c38e7c9-f4d1-11ea-9fa5-0200cd936042/ADDON_SERVICES/SEND/TSMS";
    request.post(
      {
        url: smsRequestURL,
        formData: formData
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
        } else {
        }
      }
    );

  }


  if (curSmsGateway == 'websmsapp' && (smstype == 'promotional')) {
    const formData = {
      From: 'DTAXII',
      Msg: smsbody,
      To: smsto
    };
    //console.log("Body", formData)
    // var smsRequestURL = GFunctions.convertLableDynamically(config.smsGateway.localAPIendpoint, formData);
    // // request('http://websmsapp.in/api/mt/SendSMS?user=expresstrack&password=12345&senderid=TELEOS&channel=Trans&DCS=0&flashsms=0&number=916380869576&text=This+message+from+SYED&route=2', function (error, response, body) {
    // request(smsRequestURL, function (error, response, body) {
    //   console.log('error:', error); // Print the error if one occurred
    //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //   console.log('body:', body); // Print the HTML for the Google homepage.
    // });

    var smsRequestURL = "http://2factor.in/API/V1/1c38e7c9-f4d1-11ea-9fa5-0200cd936042/ADDON_SERVICES/SEND/PSMS";
    request.post(
      {
        url: smsRequestURL,
        formData: formData
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
        } else {
        }
      }
    );

  }

  // var endpoint = "http://sms.nissisms.com/api/v4/?api_key=Ad27923d2030cb67e28f652c9ce85d473&method=sms&message=" + smsbody +"&to="+ smsto +"&sender=NISSII";

  // request.post(
  //   {
  //     url: endpoint
  //     // url: 'http://sms.nissisms.com/api/web2sms.php?username=vsrmhsch&password=Vsrmhs44&sender=VSRMHS',
  //     // form: formData
  //   },
  //   function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //     } else {
  //     } 
  //   }
  // );


  /*   var endpoint = "http://websmsapp.in/api/mt/SendSMS?user=sjshettym007&password=12345&senderid=TELEOS&channel=Trans&DCS=0&flashsms=0&number=" + smsto + "&text=" + smsbody + "&route=2";
  
    request.get(
      {
        url: endpoint
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
        } else {
        }
      }
    ); */

  if (curSmsGateway == 'twilio') {
    client.messages.create({
      body: smsbody,
      to: phCode + smsto,  // Text this number
      from: twilioNo // From a valid Twilio number    
    })
      .then((message) => console.log("________________response",message.body))//sid
      .catch((err) => console.log("______________err",err));
  }//Twilio


  if (curSmsGateway == 'nexmo') {
    var from = config.smsGateway.nexmoapiNumber;
    nexmoConfig.message.sendSms(
      from, smsto, smsbody, { type: 'unicode' },
      (err, responseData) => {
        if (err) {
        } else {
          console.dir(responseData);
        }
      }
    );
  }//Nexmo

  if (curSmsGateway == 'rahisi') { //Zanzibar
    var username = config.smsGateway.rahisiUsername;
    var password = config.smsGateway.rahisiPassword;
    var smstoNo = phCode + smsto;
    request.post(
      {
        url: `https://sms.rahisi.co.tz/api.php?do=sms&username=${username}&password=${password}&senderid=Oyaa&dest=${smstoNo}&msg=${smsbody}`
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
        } else {
        }
      }
    );
  }//Rahisi

  if (curSmsGateway == "telynx") {
    const headers = {
      'Authorization': "Bearer " + config.smsGateway.telnyxSecretKey,
    }

    const payload = {
      // 'from': config.smsGateway.telnyxNo,
      // 'to': '+14699009829',
      // // 'to':phCode + '214-286-6536',
      // 'text': 'hi Test MESSAGE',
      // 'delivery_status_webhook_url': 'https://example.com/campaign/7214'
      from: '+16062129030',
      messaging_profile_id: '45b3b1f1-99eb-4f2d-b362-17c28ae12141',
      to: '+14699009829',
      text: 'Your OTP Verification Code for 1771',
      webhook_url: 'http://telnyxwebhooks.com:8084/45b3b1f1-99eb-4f2d-b362-17c28ae12141',
      webhook_failover_url: 'https://backup.example.com/hooks',
      use_profile_webhooks: true,
      type:'SMS'
    }


  

    console.log("payload",JSON.stringify(payload));
    
    request.post({
      url: 'https://api.telnyx.com/v2/messages',
      headers: headers,
      json: payload
    }, function (err, resp, body) {
      if(err) console.log("TELYNIX_ERROR:",err)
      else console.log("TELYNIX_BODY:",JSON.stringify(body))
    });
  }


}


/**
 * No Driver Found Alert To Rider
 * @param {*} requestFrom 
 * @param {*} ridid 
 */
export const noDriverFoundSMS = async (requestFrom, ridid, adminId = '') => {
  if (
    typeof requestFrom !== "undefined"
    && requestFrom === "admin"
  ) {
    let riderDoc = await Rider.findById(ridid).exec();
    if (riderDoc !== null) {
      let smsContent = "Sorry, We cannot able to Process your request now, please try after sometime.";
      // sendSmsMsg(riderDoc.phone, smsContent);
    }

    if (adminId) {
      adminId = mongoose.Types.ObjectId(adminId);
      let adminDoc = await Admin.findById(adminId, { _id: 1, fcmId: 1 }).exec();
      GFunctions.sendAdminPushMsg(adminDoc.fcmId, 'No Driver Found!');
    }

  }
}

function generateSMSBody(sendSMSForKey, msgObj) {
  var smsbody = false;
  if (sendSMSForKey in sendSMSFor) {
    smsbody = GFunctions.convertLableDynamically(sendSMSFor[sendSMSForKey], msgObj);
  }
  return smsbody;
}