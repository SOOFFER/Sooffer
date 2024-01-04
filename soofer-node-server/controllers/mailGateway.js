const nodemailer = require('nodemailer');
const Mustache = require('mustache');
const config = require('../config');
//SendInBlue
var SibApiV3Sdk = require('sib-api-v3-sdk');
//SendGrid
const sgMail = require('@sendgrid/mail');

import { log } from 'async';
//import model
import Email from '../models/email.model';

const generalData = {
  'imageurl': config.fileurl + 'companylogo.png',
  'mailHeaderRight': config.fileurl + 'mailImages/right.png',
  'mailHeaderLeft': config.fileurl + 'mailImages/left.png',
  'mailLogo': config.fileurl + 'mailImages/companylogo.png',
  'appname': config.appName,
  'companyaddress': config.companyaddress,
  'driverApproveLink': config.frontendurl + '#/pages/tables/driver-table',
  'companyemail': config.companymail
};

const sendEmailFor = {
  'forgotPasswordAdmin': ['name', 'email', 'date', 'phone'],
  'driverRegistation': ['name', 'email', 'date', 'phone'], // New Driver Registration
  'driverwelcome': ['name'],
  'Welcome': ['name', 'email', 'date', 'phone'], // New Rider Registration
  'Reset password': ['name', 'email', 'otp', 'url'], //driver and rider forgot password
  'expiryMails': ['name',],
  'TripInvoice': ['amountpaid', 'datepaid', 'paymentmethod', 'chargedescription', 'tripno', 'tripCode', 'triptime', 'ridername', 'from', 'currency', 'time', 'detect', 'Percentage', 'waiting', 'distfare', 'appname', 'Charge', 'mailLogo', 'dist', 'fare', 'link',
    'tripto', 'accessfee', 'distanceKM', 'distancefare', 'starttime', 'endtime', 'tripdistance', 'tripvehicle', 'discountName', 'detect', 'surgeReason', 'surgePercentage', 'pickupFare'],
  'TripGSTTaxInvoice': ['amountpaid', 'datepaid', 'paymentmethod', 'chargedescription', 'tripno', 'tripCode', 'triptime', 'ridername', 'from',
    'tripto', 'accessfee', 'distanceKM', 'distancefare', 'fee1', 'cgstperentage1', 'cgst1', 'sgstperentage1', 'sgst1', 'subtotal1',
    'fee2', 'cgstperentage2', 'cgst2', 'sgstperentage2', 'sgst2', 'convtotal',
    'finalamt'
  ],
  'RentalTripInvoice': ['pickupCharge', 'hillFare', 'packageName', 'packageKMFare', 'FareforExtraKM', 'timefare', 'fareForExtraTime', 'amountpaid', 'datepaid', 'paymentmethod', 'chargedescription', 'tripno', 'tripCode', 'triptime', 'ridername', 'from', 'currency', 'time', 'detect', 'Percentage', 'waiting', 'appname', 'Charge', 'mailLogo', 'dist', 'fare', 'link',
    'tripto', 'accessfee', 'distanceKM', 'distancefare', 'starttime', 'endtime', 'tripdistance', 'tripvehicle', 'discountName', 'detect'],
  'RentalTripInvoice': ['pickupCharge', 'hillFare', 'packageName', 'packageKMFare', 'FareforExtraKM', 'timefare', 'fareForExtraTime', 'amountpaid', 'datepaid', 'paymentmethod', 'chargedescription', 'tripno', 'tripCode', 'triptime', 'ridername', 'from', 'currency', 'time', 'detect', 'Percentage', 'waiting', 'appname', 'Charge', 'mailLogo', 'dist', 'fare', 'link',
    'tripto', 'accessfee', 'distanceKM', 'distancefare', 'starttime', 'endtime', 'tripdistance', 'tripvehicle', 'discountName', 'detect', 'extraKM', 'extraTime', 'taxPercentage', 'noOfDays', 'noOfNights'],
  'userQuery': ['subject', 'message', 'from', 'mail', 'date'], // Contact query from User
};

export const sendEmail = async (email, data, description, language = "en") => {
  
  /*  if (!(description in sendEmailFor)) {

     //Dont Send Mail
     return false;
   }else{
     //Send Mail
     console.log('sendEmail')
   } */
  if (language && language.length < 3) {
    language = (language) ? language : config.appDefaultLanguageCode;
  }
  else {
    language = config.appDefaultLanguageCode;
  }
  var database = await Email.findOne({ description: description, language: language });
  data = Object.assign(data, generalData);

  if (database) {
    var subject = database.subject;
    var template = Mustache.render(database.body, data);
    var htmlBody = database.header + template + '</body></html>' // html body;
  } else {
    var subject = description;
    var htmlBody = description;
  }

  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  if (config.emailGateway == 'gmail') { //gmail

    let smtpConfig = config.smtpConfig;
    let transporter = nodemailer.createTransport(smtpConfig);
    let mailOptions = {
      from: config.mailFrom, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: subject, // plain text body
      html: htmlBody
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) { return console.log(error); }
    });

  } //gmail 

  else if (config.emailGateway == 'sendgrid') {
    sgMail.setApiKey(config.smtpConfig.sgAcessKey);
    const msg = {
      to: email,
      from: config.mailFrom,
      text: subject, // plain text body
      subject: subject,
      html: htmlBody
    };
    sgMail.send(msg);
  }
  else if (config.emailGateway == 'sendinblue') {
    var defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = config.smtpConfig.sendinbluexkeysib
    var apiInstance = new SibApiV3Sdk.SMTPApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ "email": email }];
    sendSmtpEmail.sender = { "email": config.mailFrom };
    sendSmtpEmail.htmlContent = htmlBody
    sendSmtpEmail.subject = subject
    sendSmtpEmail.headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': config.smtpConfig.sendinbluexkeysib
    };
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    }, function (error) {
    });
  }

}