import mongoose from 'mongoose';
import Rider from '../../models/rider.model';
import Wallet from '../../models/wallet.model';
import DriverBank from '../../models/driverBank.model';
import * as GFunctions from '../functions';
const request = require('request');

var config = require('../../config');

const paystack = require('paystack')(config.paymentGateway.paystackSecretKey);
var paystackToken = config.paymentGateway.paystackSecretKey;

var PaystackTransfer = require('paystack-transfer')(config.paymentGateway.paystackSecretKey)
var allBanks = PaystackTransfer.all_banks;
const _ = require('lodash');

const stripe = {}; //Backward compability

//https://stripe.com/docs/api/node#intro

/**
 * Get My  Balance
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const myBalance = (req, res) => {
  stripe.balance.retrieve(function (err, balance) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("SUCCESS"), "balance": balance });
  });
}

/**
 * Create New Customer For Rider
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const createCustomer = (req, res) => {
  var desc = "Rider";
  var custoken = req.body.stripeToken;
  stripe.customers.create({
    description: desc,
    source: custoken
  }, function (err, customer) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("SUCCESS"), "customer": customer });
  });
}

/**
 * Add the Customer card details to Mongo / if added already update and Save to Stripe
 * @input  
 * @param 
 * @return  
 * @response 
 */
export const addCard = (req, res) => {
  var desc = "Rider - " + req.userId;
  var custoken = req.body.stripeToken;
  stripe.customers.create({
    description: desc,
    source: custoken
  }, function (err, customer) {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    addCardToMongo(req.userId, customer);
    return res.json({ 'success': true, 'message': req.i18n.__("CARD_ADDED_SUCCESSFULLY") });
  });
}


function addCardToMongo(userId, customer) {
  Rider.findById(userId, function (err, docs) {
    if (err) { } else if (!docs) { }
    else {

      docs.stripe.id = customer.id;
      docs.stripe.currency = customer.currency;
      docs.stripe.last4 = customer.sources.data[0].last4;
      docs.save(function (err, op) {
        if (err) { }
        else {
          console.log("addCardToMongo", userId);
          addCardDetailsToWallet(userId, customer);
        }
      })

    }
  });
}


function addCardDetailsToWallet(userId, customer) {
  console.log("addCardDetailsToWallet", 1);
  // 1.chk Wallet
  Wallet.findOne({ ridid: userId }, function (err, doc) {
    if (err) { }
    else if (!doc) {

      //Add New Wallet Details
      var newDoc = new Wallet(
        {
          ridid: userId,
          bal: 0,
          stripe: {
            id: customer.id,
            currency: customer.currency,
            last4: customer.sources.data[0].last4
          }
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
          console.log("addCardDetailsToWallet2", userId);
        } else {
          console.log("addCardDetailsToWallet3", userId);
        }
      })
      //Add New Wallet Details

    } else if (doc) {

      doc.stripe.id = customer.id;
      doc.stripe.currency = customer.currency;
      doc.stripe.last4 = customer.sources.data[0].last4;
      doc.save(function (err, op) {
        if (err) {
          console.log("addCardDetailsToWallet4", userId);
        }
        else {
          console.log("addCardDetailsToWallet5", userId);
        }
      })

    }
  })
  // 1.chk Wallet
}



/**
 * Retrive All Customers
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const listCustomers = (req, res) => {
  paystack.customer.list(function (error, body) {
    console.log(error);
    console.log(body);
  });
}


/**
 * Charge A Card
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const chargeCard = (req, res) => {
  var cusid = "cus_CnxpYQiA5AY0Tv";
  stripe.charges.create({
    amount: 100, // 1500 = $15.00 this time
    currency: "usd",
    customer: cusid,
    description: "Charge for Test"
  }, function (err, charge) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("SUCCESS"), "charge": charge });
  });
}


/**
 * Add Amount To Card
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const addAmount = (req, res) => {
  var cusid = req.body.accountId;
  var amt = req.body.amt;
  stripe.payouts.create({
    amount: amt, // 1500 = $15.00 this time
    currency: "usd",
    customer: cusid,
    description: "Add Charge for Test"
  }, function (err, payout) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("SUCCESS"), "payout": payout });
  });
}

/**
 * Add Amount To Wallet
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const addToWallet = (req, res) => {
  var cusid = req.body.accountId;
  var amt = req.body.amt;
  amt = parseFloat(amt) * 100;
  stripe.charges.create({
    amount: amt, // 1500 = $15.00 this time
    currency: "usd",
    customer: cusid,
    description: "Wallet Recharge"
  }, function (err, payout) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    return res.json({ 'success': true, 'message': req.i18n.__("SUCCESS"), "payout": payout });
  });
}


/**
 * Charge charge Existing User Card
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const chargeExistingUserCard = async (stripeCusid, desc, cur = "usd", amt = 0, customerEmail) => {
  var cusid = stripeCusid;
  var newamt = parseFloat(amt) * 100;

  return new Promise(function (resolve, reject) {

    paystack.transaction.charge({
      authorization_code: cusid,
      email: customerEmail,
      amount: newamt
    }, function (err, result) {
      if (err) {
        var obj = { 'success': false, 'message': 'Error Adding Amount!' };
        reject(obj);
      } else {
        var resultObj = result.data;
        var authorization = resultObj.authorization;
        if (resultObj.status == 'success') {

          var resultData = {
            amount: resultObj.amount,
            authCode: authorization.authorization_code,
            last4: authorization.last4,
            id: resultObj.reference
          }

          var obj = { 'success': true, 'message': 'Amount Added!', "charge": resultData };
          resolve(obj);
        } else {
          var obj = { 'success': false, 'message': 'Error Adding Amount!' };
          reject(obj);
        }
      }
    })

  })

}

export const test = (stripeCusid = 1, desc = 1, cur = "usd", amt = 0) => {
  var i = 0;
  while (i <= 1000000000000) {
    i++;
  }
  return i;
}


/**
 * Charge Card And Recharge Balance
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const transferAmountNRecharge = (res, stripeCusid, desc, cur = "usd", amt = 0, userId, walletId) => {
  console.log("chargeExistingUserCard", stripeCusid);
  var cusid = stripeCusid;
  var newamt = parseFloat(amt) * 100;
  stripe.charges.create({
    amount: newamt, // 1500 = $15.00  
    currency: cur,
    customer: cusid,
    description: desc
  }, function (err, charge) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    else if (charge.failure_code) {
      return res.status(200).json({ 'success': false, 'message': charge.failure_message });
    }
    else if (charge.paid) {
      RechargeMyWallet(res, charge, userId, walletId);
    }
  });
}

function RechargeMyWallet(res, charge, userId, walletId) {
  var id = mongoose.Types.ObjectId();
  var tranxData = {
    _id: id,
    trxid: charge.id,
    amt: (parseFloat(charge.amount) / 100),
    date: GFunctions.sendTimeNow(),
    type: 'Credit'
  }

  Wallet.findByIdAndUpdate(walletId, {
    $push: { trx: tranxData }
  }, { 'new': true },
    function (err, doc) {
      if (err) {
        console.log('RechargeMyWallet', err);
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }
      console.log('RechargeMyWallet', doc);
    }
  );

  Wallet.findById(walletId, function (err, docs) {
    if (err) { } else if (!docs) { }
    else {
      let oldbal = docs.bal;
      let newbal = (parseFloat(oldbal) + (parseFloat(charge.amount)) / 100);
      docs.bal = newbal;
      docs.save(function (err, op) {
        if (err) {
          return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
        }
        else {
          return res.status(200).json({ 'success': true, 'message': req.i18n.__("AMOUNT_ADDED_TO_WALLET"), 'balance': newbal });
          // console.log("RechargeMyWallet 2", charge.amount ); 
        }

      })
    }
  });

}



//Driver Wallet : Stripe Driver

/**
 * Add the Driver card details to Mongo / if added already update and Save to Stripe 
 * @input  
 * @param 
 * @return  
 * @response 
 */
export const addDriverBank = (req, res) => {
  var desc = "Driver - " + req.userId;
  var custoken = req.body.stripeToken;

  // / if added already update and Save to Stripe Pending

  stripe.customers.create({
    description: desc,
    source: custoken
  }, function (err, customer) {
    if (err) {
      console.log(err);
      return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
    }
    addDriverBankDetailsToWallet(req, customer);
    // addCardToMongo(req.userId,customer);
    return res.json({ 'success': true, 'message': req.i18n.__("BANK_DETAILS_ADDED_SUCCESSFULLY") });
  });
}

/**
 * Add the Driver card details to Mongo  
 * @input  
 * @param 
 * @return  
 * @response 
 */
function addDriverBankDetailsToWallet(req, customer) {
  console.log("addDriverBankDetailsToWallet1");

  // 1.chk Wallet
  DriverBank.findOne({ dvrid: req.userId }, function (err, doc) {
    if (err) { console.log("addDriverBankDetailsToWallet3"); }
    else if (!doc) {

      console.log("addDriverBankDetailsToWallet2");

      //Add New Wallet Details
      var newDoc = new DriverBank(
        {
          dvrid: req.userId,
          bal: 0,
          bank: {
            email: req.body.email,
            holdername: req.body.holdername,
            acctNo: req.body.acctNo,
            banklocation: req.body.banklocation,
            bankname: req.body.bankname,
            swiftCode: req.body.swiftCode,
          }
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
          console.log("addDriverBankDetailsToWallete", err);
        } else {
          console.log("addDriverBankDetailsToWallets", req.userId);
        }
      })
      //Add New Wallet Details

    } else if (doc) {

      console.log("addDriverBankDetailsToWallet43");

      doc.bank.email = req.body.email;
      doc.bank.holdername = req.body.holdername;
      doc.bank.acctNo = req.body.acctNo;
      doc.bank.banklocation = req.body.banklocation;
      doc.bank.swiftCode = req.body.swiftCode;

      doc.save(function (err, op) {
        if (err) {
          console.log("addDriverBankDetailsToWallet", err);
        }
        else {
          console.log("addDriverBankDetailsToWallet", req.userId);
        }
      })

    }
  })
  // 1.chk Wallet
}

/**
 * Hold Charge On Card
 * @input  
 * @param 
 * @return 
 * @response  
 {"success":true,"message":"","charge":{"id":"ch_1CUtbJL20LaSLvFAJsS1Epcj","object":"charge","amount":100,"amount_refunded":0,"application":null,"application_fee":null,"balance_transaction":null,"captured":false,"created":1527068985,"currency":"usd","customer":"cus_CuOUSIFmlUwpwv","description":"Hold for Test","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1CUtbJL20LaSLvFAJsS1Epcj/refunds"},"review":null,"shipping":null,"source":{"id":"card_1CUZh3L20LaSLvFALXOmYYMC","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_CuOUSIFmlUwpwv","cvc_check":null,"dynamic_last4":null,"exp_month":6,"exp_year":2020,"fingerprint":"Ys41AbCrodcO2ehu","funding":"unknown","last4":"1111","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}}
 */
export const holdChargeCard = async (stripeCusid, desc, cur = "usd", amt = 0) => {
  console.log("holdChargeCard", stripeCusid);
  var cusid = stripeCusid;
  var newamt = parseFloat(amt) * 100;

  return new Promise(function (resolve, reject) {

    stripe.charges.create({
      amount: newamt, // 1500 = $15.00 this time
      currency: cur,
      customer: cusid,
      capture: false,
      description: desc
    }, function (err, charge) {
      if (err) {
        var obj = { 'success': false };
        reject(obj);
      }
      var obj = { 'success': true, 'message': '', "charge": charge };
      resolve(obj);
    });

  })

}



//V2 Modifications
export const findNAddCardTOUser = async (cardToken, desc) => {
  return new Promise(function (resolve, reject) {

    var reference_code = cardToken;
    paystack.transaction.verify(
      reference_code
      , function (err, result) {
        if (err) {
          var obj = { 'success': false, 'message': 'Error Adding Card!' };
          reject(obj);
        }
        if (result.message == 'Verification successful' || result.status == true) {
          var resultObj = result.data;
          var authorization = resultObj.authorization;
          var resultData = {
            amount: resultObj.amount / 100,
            authCode: authorization.authorization_code,
            last4: authorization.last4
          }
          var obj = { 'success': true, 'message': 'Card Added Successfully', "data": resultData }
          resolve(obj);
        } else {
          var obj = { 'success': false, 'message': 'Error Adding Card!' };
          reject(obj);
        }
      })

  })
}


/**
 * Charge Card And Recharge Balance
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const transferAmountNRechargeUser = async (cardId, desc, cur = "usd", amt = 0, customerEmail = "") => {
  var cusid = cardId;
  var newamt = parseFloat(amt) * 100;

  return new Promise(function (resolve, reject) {

    paystack.transaction.charge({
      authorization_code: cusid,
      email: customerEmail,
      amount: newamt
    }, function (err, result) {
      if (err) {
        var obj = { 'success': false, 'message': 'Error Adding Amount!' };
        reject(obj);
      } else {
        var resultObj = result.data;
        var authorization = resultObj.authorization;
        if (resultObj.status == 'success') {

          var resultData = {
            amount: resultObj.amount,
            authCode: authorization.authorization_code,
            last4: authorization.last4,
            id: resultObj.reference
          }

          var obj = { 'success': true, 'message': 'Amount Added!', "data": resultData };
          resolve(obj);
        } else {
          var obj = { 'success': false, 'message': 'Error Adding Amount!' };
          reject(obj);
        }
      }
    })

  })
}


export const createCusNAddCardNBankToDriver = async (cardToken, desc) => {
  return new Promise(function (resolve, reject) {
    stripe.customers.create({
      description: desc,
      source: cardToken
    }, function (err, customer) {
      if (err) {
        var obj = { 'success': false, 'message': 'Error Adding Card!' };
        reject(obj);
      }
      var obj = { 'success': true, 'message': 'Card Added!', "data": customer };
      resolve(obj);
    });
  })
}


/**
 * Create New Cnnect For Driver : Connect
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const createConnectFromBankForDriver = async (reqBody, countrycode = 'US') => {
  return new Promise(function (resolve, reject) {
    stripe.accounts.create({
      type: 'custom',
      country: countrycode,
      email: reqBody.email,
      account_token: reqBody.stripeToken,
    }, function (err, account) {
      if (err) {
        reject(err);
      } else {
        var obj = { 'success': true, 'message': '', "charge": account };
        resolve(obj);
      }
    });

  })
  // REspose
}


/**
 * Pay to Stripe Connect
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const transfersConnectAmtDriver = async (amountval, connectAcct, currencycode = 'usd', transfer_group = 'Driver Payout') => {
  var newamt = parseFloat(amountval) * 100;

  // var payResponse = await PaystackTransfer.initiateSingle('balance', transfer_group, newamt, connectAcct);

  //Sample response

  var payResponse = {
    "status": true,
    "message": "Transfer requires OTP to continue",
    "data": {
      "integration": 100073,
      "domain": "test",
      "amount": 3794800,
      "currency": "NGN",
      "source": "balance",
      "reason": "Calm down",
      "recipient": 28,
      "status": "otp",
      "transfer_code": "TRF_1ptvuv321ahaa7q",
      "id": 14,
      "createdAt": "2017-02-03T17:21:54.508Z",
      "updatedAt": "2017-02-03T17:21:54.508Z"
    }
  }

  if (payResponse.status == true) {
    console.log(payResponse.data.transfer_code);
    var obj = { 'success': true, 'message': payResponse.message, 'charge': payResponse.data };
    return obj;
  } else {
    var obj = { 'success': false, 'message': payResponse.message };
    return obj;
  }

}


export const createExpressConnectForDriver = async (code, countrycode = 'US') => {
  return new Promise(function (resolve, reject) {

    var returnObj = {
      success: false,
      data: ''
    };

    request.post({
      url: 'https://connect.stripe.com/oauth/token',
      form: { code: code, grant_type: "authorization_code", client_secret: config.paymentGateway.stripeSk }
    },
      function (err, httpResponse, body) {
        if (err) {
          reject(returnObj);
        } else {
          if (httpResponse.statusCode == 200) {
            returnObj.success = true;
          }
          returnObj.data = body;
          resolve(returnObj);
        }
      })

  })


  //   {
  //     "error": "invalid_grant",
  //     "error_description": "This authorization code has already been used. All tokens issued with this code have been revoked."
  // }
  // { //Success
  //   "access_token": "{ACCESS_TOKEN}",
  //     "livemode": false,
  //       "refresh_token": "{REFRESH_TOKEN}",
  //         "token_type": "bearer",
  //           "stripe_publishable_key": "{PUBLISHABLE_KEY}",
  //             "stripe_user_id": "{ACCOUNT_ID}",
  //               "scope": "express"
  // }
};


/**
 * 
 * @param {*} data 
 */
export const makeStripeSplitPayment = async (data) => {

  var driveramount = (parseFloat(data.totalamount) - parseFloat(data.commisionamount)) * 100;
  var total = parseFloat(data.totalamount) * 100;
  var cur = data.currency ? data.currency : "usd";

  /* return new Promise(function (resolve, reject) {
    stripe.charges.create({
      amount: total,
      currency: cur,
      customer: data.custid, //like cus_EQNkhYfc8UNRwO
      destination: {
        amount: driveramount,
        account: data.driverConnectAcctId,
      },
      description: data.stripeDesc,
      // capture: true
    }).then(function (charge, err) {
      if (charge) {
        var obj = { 'success': true, 'chargeId': charge.id, 'chargeAmount': charge.amount  };
        resolve(obj)
      }
      if (err) {
        var obj = { 'success': false, 'message' : err };
        resolve(obj);
      }
    });
  }) */

  return new Promise(function (resolve, reject) {
    stripe.charges.create({
      amount: total,
      currency: cur,
      customer: data.custid, //like cus_EQNkhYfc8UNRwO
      destination: {
        amount: driveramount,
        account: data.driverConnectAcctId,
      },
      description: data.stripeDesc,
      // capture: true
    }, function (err, charge) {
      if (err) {
        var obj = { 'success': false, 'message': err };
        resolve(obj);
      } else if (charge) {
        var obj = { 'success': true, 'chargeId': charge.id, 'chargeAmount': charge.amount };
        resolve(obj);
      } else {
        var obj = { 'success': false, 'message': err };
        resolve(obj);
      }
    });
  })

}


//Driver Payout Paystack

/**
 * createSubAccountFromBankForDriver
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const createSubAccountFromBankForDriver = async (originalData) => {

  var originalDataString = JSON.stringify(originalData);
  console.log('originalDataString', originalDataString)
  // Set the headers
  var headersData = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + paystackToken,
  }

  return new Promise(function (resolve, reject) {

    request.post({
      headers: headersData,
      url: 'https://api.paystack.co/subaccount',
      body: originalDataString
    }, function (error, response, body) {
      if (error) {
        var obj = { 'success': false, 'message': error };
        resolve(obj);
      }
      console.log(body);
      let jsonData = JSON.parse(body);
      if (jsonData.status == true) {
        var responsedata = jsonData.data;
        // console.log('error responsedata', responsedata);
        var obj = { 'success': true, 'message': "Bank Added", 'data': responsedata };
        resolve(obj);

      } else {
        // console.log('error occured', jsonData.message);
        var obj = { 'success': false, 'message': jsonData.message };
        resolve(obj);
        // return res.status(500).json({'success':false,'message':'Something went wrong','error':jsonData.message})
      }
    });

  })

}



/**
 * Charge transaction And Recharge subaccount
 * @input  
 * @param 
 * @return 
 * @response  
 */
export const transferAmountNRechargeVendor = async (originalData) => {

  var originalDataString = JSON.stringify(originalData);
  console.log('originalDataString', originalDataString)
  // Set the headers
  var headersData = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + paystackToken,
  }
  return new Promise(function (resolve, reject) {

    request.post({
      headers: headersData,
      url: 'https://api.paystack.co/transaction/initialize',
      body: originalDataString
    }, function (error, response, body) {
      if (error) {
        var obj = { 'success': false, 'message': error };
        resolve(obj);
      }
      //console.log(body);
      let jsonData = JSON.parse(body);
      if (jsonData.status == true) {
        var responsedata = jsonData.data;
        // console.log('error responsedata', responsedata);
        var obj = { 'success': true, 'message': "Bank amount Transfered", 'data': responsedata };
        resolve(obj);

      } else {
        // console.log('error occured', jsonData.message);
        var obj = { 'success': false, 'message': jsonData.message };
        resolve(obj);
        // return res.status(500).json({'success':false,'message':'Something went wrong','error':jsonData.message})
      }
    });

  })
}

//Check the paystact payout account creation using direct call as request
export const createTransferRecipient = async (originalData) => {

  var originalDataString = JSON.stringify(originalData);
  console.log('originalDataString', originalDataString)
  // Set the headers
  var headersData = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + paystackToken,
  }

  return new Promise(function (resolve, reject) {

    request.post({
      headers: headersData,
      url: 'https://api.paystack.co/transferrecipient',
      body: originalDataString
    }, function (error, response, body) {
      if (error) {
        var obj = { 'success': false, 'message': error };
        resolve(obj);
      }
      console.log(body);
      let jsonData = JSON.parse(body);
      if (jsonData.status == true) {
        var responsedata = jsonData.data;
        // console.log('error responsedata', responsedata);
        var obj = { 'success': true, 'message': "Transfer Recipient Added", 'data': responsedata };
        resolve(obj);

      } else {
        // console.log('error occured', jsonData.message);
        var obj = { 'success': false, 'message': jsonData.message };
        resolve(obj);
        // return res.status(500).json({'success':false,'message':'Something went wrong','error':jsonData.message})
      }
    });

  })
}

/**
 * Create transferRecipient using paystackTransfer npm
 * @param {*} originalData 
 */
export const createTransferRecipientFromBankForDriver = async (originalData) => {

  console.log(originalData.recipientBankCode)
  var recipientBankData = _.filter(allBanks, { 'code': originalData.recipientBankCode });// should be a bank object key value, so that can retrive bank code
  var getTransferRecipientData = await PaystackTransfer.createRecipient(originalData.recipientName, originalData.recipientDesc, originalData.recipientAccountNo, recipientBankData[0], originalData.metaData);
  if (getTransferRecipientData.status == true) {
    var obj = { 'success': true, 'message': getTransferRecipientData.message, 'data': getTransferRecipientData.data };
    return obj;
  } else {
    var obj = { 'success': false, 'message': getTransferRecipientData.message };
    return obj;
  }

}

export const getBankDetail = () => {
  return allBanks;
}