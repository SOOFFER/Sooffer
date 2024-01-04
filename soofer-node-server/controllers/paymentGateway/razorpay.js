var razorpay = require("razorpay")
var config = require('../../config');
var featuresSettings = require('../../featuresSettings');
const request = require('request');
const lodash = require('lodash');
var { validateFundInput } = require('../../validations/appValidate');

import DriverBank from '../../models/driverBank.model';
import DriverWallet from '../../models/driverWallet.model';
import Driver from '../../models/driver.model';
import { driverBankDetails } from '../driver';
import { updateDriverWallet } from '../driverBank';
import * as GFunctions from '../functions';

var instance = new razorpay({
  key_id: config.paymentGateway.razorpayId,
  key_secret: config.paymentGateway.razorpaySecretKey,
});


export const fetchRazorPayment = async (paymentId) => {
  let data = await instance.payments.fetch(paymentId);
  /*response {id: 'pay_FUYsCzzjbgo1tY',
  entity: 'payment',
  amount: 2500,
  currency: 'INR',
  status: 'captured',
  order_id: 'order_FUYSrzK1DxxiHy',
  invoice_id: null,
  international: false,
  method: 'card',
  amount_refunded: 0,
  refund_status: null,
  captured: true,
  description: 'Razor Test Transaction',
  card_id: 'card_FUYr862fCX1ZCp',
  bank: null,
  wallet: null,
  vpa: null},
 */
  return data;
}

async function createContact(req) {
  try {
    return new Promise(function (resolve, reject) {
      var data;
      var body = {
        "name": req.name,
        "email": req.email,
        "type": "employee"
      }
      var options = {
        'method': 'POST',
        'url': `https://${config.paymentGateway.razorpayId}:${config.paymentGateway.razorpaySecretKey}@api.razorpay.com/v1/contacts`,
        'headers': {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
      request(options, function (error, response) {
        data = JSON.parse(response.body);
        resolve(data);
      });
    })
  } catch (err) {
    console.log(err);
  }
}

export const createFundAccounts = async (req, res) => {
  try {
    const { errors, isValid } = validateFundInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let getContact = await createContact(req);

    if (req.body.addDataFrom == "admin") {
      req.name = req.body.holdername
      req.userId = req.body._id
      req.email = req.body.email
    }

    if (!getContact) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("CONTACTS_NOT_FOUND"), 'error': err });
    }
    var body = {
      "contact_id": getContact.id,
      "account_type": "bank_account",
      "bank_account": {
        "name": req.name,
        "ifsc": req.body.swiftCode ? req.body.swiftCode : req.body.ifscCode,
        "account_number": req.body.acctNo
      }
    }
    var options = {
      'method': 'POST',
      'url': `https://${config.paymentGateway.razorpayId}:${config.paymentGateway.razorpaySecretKey}@api.razorpay.com/v1/fund_accounts`,
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
    request(options, function (error, response) {
      let data = JSON.parse(response.body);
      if (error) {
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("FUNDACCOUNT_FAILED"), 'error': error });
      }
      if (data.error) {
        return res.status(200).json({ 'success': false, 'message': req.i18n.__("FUNDACCOUNT_CREATED"), 'data': data.error.description });
      }
      else {  //save fundId in driver bank
        updateDriverBankDetails(req, data)
        return res.status(200).json({ 'success': true, 'message': req.i18n.__("FUNDACCOUNT_CREATED"), 'data': data });
      }

    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("FUNDACCOUNT_FAILED"), 'error': err });
  }
}

export const updateDriverBankDetails = async (reqData, data) => {
  DriverBank.findOne({ driverId: reqData.userId }, (err, doc) => {
    if (err) { console.log(err) }
    if (doc) {
      doc.bank = {
        fundId: data.id,
        swiftCode: reqData.body.swiftCode ? reqData.body.swiftCode : req.body.ifscCode,
        bankname: data.bank_account.bank_name,
        acctNo: reqData.body.acctNo,
        holdername: data.bank_account.name,
        email: reqData.body.email ? reqData.body.email : "",
        currency: reqData.body.currency ? reqData.body.currency : config.currency,
        banklocation: reqData.body.banklocation ? reqData.body.banklocation : "",
        chid: ""
      }
      doc.save((err, result) => {
        Driver.findOne({ _id: reqData.userId }, (err, driverData) => {
          if (err) console.log("Errr", err);
          if (driverData) {
            driverData.actHolder = data.bank_account.name
            driverData.actNo = reqData.body.acctNo
            driverData.actBank = data.bank_account.bank_name
            driverData.actCode = reqData.body.swiftCode ? reqData.body.swiftCode : req.body.ifscCode
            driverData.save();
          }
        })
      });
    }
    else {
      var newDoc = new DriverBank(
        {
          driverId: reqData.userId,
          totalBal: 0,
          bank: {
            fundId: data.id,
            swiftCode: reqData.body.swiftCode ? reqData.body.swiftCode : req.body.ifscCode,
            bankname: data.bank_account.bank_name,
            acctNo: reqData.body.acctNo,
            holdername: data.bank_account.name,
            email: reqData.body.email ? reqData.body.email : "",
            currency: reqData.body.currency ? reqData.body.currency : config.currency,
            banklocation: reqData.body.banklocation ? reqData.body.banklocation : "",
            chid: ""
          }
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
          console.log(err)
        } else {
          Driver.findOne({ _id: reqData.userId }, (err, driverData) => {
            if (err) console.log("Errr", err);
            if (driverData) {
              driverData.actHolder = data.bank_account.name
              driverData.actNo = reqData.body.acctNo
              driverData.actBank = data.bank_account.bank_name
              driverData.actCode = reqData.body.swiftCode ? reqData.body.swiftCode : req.body.ifscCode
              driverData.save();
            }
          })
        }
      })
    }
  })
}


export const payouts = async (req, res) => {
  try {

    if (req.body.addDataFrom == "admin") {
      req.userId = req.body.driverId
    }

    var driverBankData = await DriverBank.findOne({ driverId: req.userId })
    var driverWalletData = await DriverWallet.findOne({ driverId: req.userId }).exec();

    if (Number(req.body.amount) < Number(featuresSettings.driverPayouts.driverPayoutAmountLimitMax)) {
      return res.status(409).json({ "status": false, "message": req.i18n.__("YOU_REQUEST_AMOUNT_MORE_THAN_ONE") + featuresSettings.driverPayouts.driverPayoutAmountLimitMax + featuresSettings.defaultcur })
    }

    if (driverWalletData) {
      let totalBal = driverWalletData.totalBal;
      req.body.fundId = driverBankData.bank.fundId;
      if (!req.body.fundId) {
        return res.status(409).json({ "status": false, "message": req.i18n.__("YOU_DONT_HAVE_ACCOUNT_CREATED_TRANSFER_CREDITS") })
      }
      if (Number(totalBal) < Number(req.body.amount)) {
        return res.status(409).json({ "status": false, "message": req.i18n.__("YOU_DONT_HAVE_SUFFICENT_CREDITS_YOUR_WALLET") })
      }
      transfersAmountToDriverConnect(req, res, totalBal);
    } else {
      return res.status(409).json({ "status": false, "message": req.i18n.__("NO_DRIVER_CREDIT_WALLET") })
    }
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("PAYOUTS_FAILED"), 'error': err });
  }
}


export const transfersAmountToDriverConnect = async (req, res, walletBal) => {
  let amount = req.body.amount * 100; //the payout amount, in paise. For example, if you want to transfer ₹10000, pass 1000000.
  var body = {
    "account_number": config.paymentGateway.razorpayAccountNumber,
    "fund_account_id": req.body.fundId,
    "amount": amount * 100,
    "currency": "INR",
    "mode": "IMPS",
    "purpose": "payout",
    "queue_if_low_balance": true
  }
  var options = {
    'method': 'POST',
    'url': `https://${config.paymentGateway.razorpayId}:${config.paymentGateway.razorpaySecretKey}@api.razorpay.com/v1/payouts`,
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  request(options, async function (error, response) {
    let data = JSON.parse(response.body);
    if (error) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("PAYOUTS_FAILED"), 'error': error });
    }
    if (data.error) {
      return res.status(200).json({ 'success': false, 'message': req.i18n.__("PAYOUTS_NOT_COMPLETED"), 'data': data });
    }
    else {
      var tripParams = {
        driverId: req.userId,
        trxId: data.id,
        description: "Payout - " + req.body.amount,
        amt: req.body.amount,
        paymentDate: GFunctions.getISODate("D-M-YYYY h:mm a"),
        paymentDateSort: GFunctions.getISODate(),
        type: 'debit'
      }
      //Update Driver Wallet.
      updateDriverWallet(tripParams.driverId, tripParams, true);
      walletBal = Number(walletBal) - Number(req.body.amount) 
      return res.status(200).json({ 'success': true, 'message': req.i18n.__("PAYOUTS_COMPLETED"), 'data': data, 'walletBal': walletBal });
    }
  });
}
 
export const createOrder = async(req,res) =>{
try{
  var params = {
    "amount": Number(req.body.amount)  * 100,
    "currency": "INR",
  };
  console.log('params', params);
  instance.orders.create(params).then((data) => {
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("SUCCESS"), 'data': data });
    }).catch((error) => {
    console.log('createOrder error', error);
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("FAILED"), 'error': error });
    })
} catch(err) {
  console.log('createOrder err', err);
return res.status(500).json({ 'success': false, 'message': req.i18n.__("FAILED"), 'error': err });
}}

export const razorpayWebhook = async (req, res) => {
  try {
    console.log('razorpayWebhook', req.body, req.params, req.query);
    return res.status(200).json({ 'success': true, 'message': req.i18n.__("SUCCESS") });
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("FAILED"), 'error': err });
  }
}
