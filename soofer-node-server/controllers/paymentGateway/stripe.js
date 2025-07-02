import mongoose from 'mongoose';
import Rider from '../../models/rider.model';
import Wallet from '../../models/wallet.model';
import DriverBank from '../../models/driverBank.model';
import * as GFunctions from '../functions';
const request = require('request');

var config = require('../../config');

//https://stripe.com/docs/api/node#intro
const stripe = require("stripe")(
  config.paymentGateway.stripeSk
);

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
          addCardDetailsToWallet(userId, customer);
        }
      })

    }
  });
}


function addCardDetailsToWallet(userId, customer) {
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
        } else {
        }
      })
      //Add New Wallet Details

    } else if (doc) {

      doc.stripe.id = customer.id;
      doc.stripe.currency = customer.currency;
      doc.stripe.last4 = customer.sources.data[0].last4;
      doc.save(function (err, op) {
        if (err) {
        }
        else {
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
  stripe.customers.list(
    { limit: 3 },
    function (err, customers) {
      if (err) {
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }
      return res.json({ 'success': true, 'message': req.i18n.__("SUCCESS"), "customer": customers });
    }
  );
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
export const chargeExistingUserCard = async (stripeCusid, desc, cur = "usd", amt = 0) => {
  var cusid = stripeCusid;
  var newamt = Number(parseFloat(amt * 100).toFixed(2));

  return new Promise(function (resolve, reject) {

    stripe.charges.create({
      amount: newamt, // 1500 = $15.00 this time
      currency: cur,
      customer: cusid,
      description: desc
    }, function (err, charge) {
      console.log("STRIPE_ERROR",err)
      console.log("STRIPE_CHARGE",JSON.stringify(charge || {}))
      if (err) {
        var obj = { 'success': false };
        reject(obj);
      }
      var obj = { 'success': true, 'message': '', "charge": charge };
      resolve(obj);
    });

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
        return res.status(500).json({ 'success': false, 'message': req.i18n.__("SOME_ERROR"), 'error': err });
      }
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

  // 1.chk Wallet
  DriverBank.findOne({ dvrid: req.userId }, function (err, doc) {
    if (err) {  }
    else if (!doc) {


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
        } else {
        }
      })
      //Add New Wallet Details

    } else if (doc) {


      doc.bank.email = req.body.email;
      doc.bank.holdername = req.body.holdername;
      doc.bank.acctNo = req.body.acctNo;
      doc.bank.banklocation = req.body.banklocation;
      doc.bank.swiftCode = req.body.swiftCode;

      doc.save(function (err, op) {
        if (err) {
        }
        else {
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
    stripe.customers.create({
      description: desc,
      source: cardToken
    }, function (err, customer) {
      if (err) {
        console.log(err.message);
        var obj = { 'success': false, 'message': 'Error Adding Card ! - ' + err.message };

        reject(obj);
      }
      var obj = { 'success': true, 'message': 'Card Added!', "data": customer };
      resolve(obj);
    });
  })
}

//V2 Modifications
export const findNDeleteCardOfUser = async (custId) => {
  return new Promise(async function (resolve, reject) {
    var deleteData = await stripe.customers.del(
      custId
    )
    if (!deleteData) {
      var obj = { 'success': false, 'message': 'Error Adding Card ! - ' + err.message };
      reject(obj);
    }
    else{
      var obj = { 'success': true, 'message': 'Card Deleted!', "data": deleteData };
      resolve(obj); 
    }
  });
}

/**
 * Charge Card And Recharge Balance
 * @input
 * @param
 * @return
 * @response
 */
export const transferAmountNRechargeUser = (cardId, desc, cur = "usd", amt = 0) => {
  var cusid = cardId;
  var newamt = parseFloat(amt) * 100;

  return new Promise(function (resolve, reject) {
    stripe.charges.create({
      amount: newamt, // 1500 = $15.00
      currency: cur,
      customer: cusid,
      description: desc
    }, function (err, charge) {
      console.log(charge,"charge")
      if (err) {
        var obj = { 'success': false, 'message': 'Error Adding Amount!' };
        reject(obj);
      }
      else if (charge.failure_code) {
        var obj = { 'success': false, 'message': charge.failure_message };
        reject(obj);
      }
      else if (charge.paid) {
        var obj = { 'success': true, 'message': 'Amount Added!', "data": charge };
        resolve(obj);
      }
    });
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
        console.log("err", err);
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

  return new Promise(function (resolve, reject) {

    stripe.transfers.create({
      amount: newamt,
      currency: currencycode,
      destination: connectAcct,
      transfer_group: transfer_group
    }, function (err, transfer) {
      if (err) {
        reject(err);
      }
      var obj = { 'success': true, 'message': '', "charge": transfer };
      resolve(obj);
    });

  })

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
  driveramount = driveramount.toFixed(0);
  driveramount = parseFloat(driveramount);
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
  // https://stripe.com/docs/connect/destination-charges
  /*   stripe.charges.create({
      amount: 1000,
      currency: "usd",
      source: "tok_visa",
      transfer_data: {
        amount: 877,
        destination: "{{CONNECTED_STRIPE_ACCOUNT_ID}}",
      },
    }).then(function (charge) {
      // asynchronously called
    }); */


  return new Promise(function (resolve, reject) {
    stripe.charges.create({
      amount: total,
      currency: cur,
      customer: data.custid, //like cus_EQNkhYfc8UNRwO
   /*    destination: {
        amount: driveramount,
        account: data.driverConnectAcctId,
      }, */
      transfer_data: {
        amount: driveramount,
        destination: data.driverConnectAcctId,
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

/**
 * Used for US only
 * @param {*} data
 */
export const makeInstantPayouts = async (data) => {

  var driveramount = (parseFloat(data.totalamount) - parseFloat(data.commisionamount)) * 100;
  driveramount = driveramount.toFixed(0);
  driveramount = parseFloat(driveramount);
  var cur = data.currency ? data.currency : "usd";

  return new Promise(function (resolve, reject) {
    stripe.payouts.create({
      amount: driveramount,
      currency: cur,
      // method: 'instant',
    },
      { stripe_account: data.driverConnectAcctId }
      , function (err, charge) {
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

export const captureHoldChargeOnCard = async (paymentInfo) => {
  let response = {
    status : false,
    statusCode : 503,
    message : "Unprocesable Entry",
    data : {}
  }
  try{
    let holdCharge = await new Promise((resolve, reject) => {
      let captureData = {};
      if(paymentInfo.amount)
        captureData["amount"] = paymentInfo.amount;
      stripe.charges.capture( 
        paymentInfo.transactionId,
        captureData,
        (err, charge) => {
        if (err) {
          let obj = { 
            status: false,
            message: err.message
          };
          reject(obj);
        } else {
          let obj = { 
            status: true, 
            message: 'Charge Captured',
            data: {
              transactionId : charge.id,
              charge : charge
            } 
          };
          resolve(obj);
        }
      });
    });
    if(!holdCharge.status)
      throw new Error(holdCharge.message)

    response.status = true;
    response.statusCode = 200;
    response.message = holdCharge.message;
    response.data = holdCharge.data;
  }catch(error){
    response.status = false;
    response.statusCode = 503;
    response.message = error.message;
    response.data = {};
  }
  return response;
}
export const holdChargeOnCard = async (paymentInfo) => {
  let response = {
    status : false,
    statusCode : 503,
    message : "Unprocesable Entry",
    data : {}
  }
  try{
    let holdCharge = await new Promise((resolve, reject) => {
      stripe.charges.create({
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        customer: paymentInfo.customerId,
        description: paymentInfo.description,
        capture: false
      }, (err, charge) => {
        if (err) {
          let obj = { 
            status: false,
            message: err.message
          };
          reject(obj);
        } else {
          let obj = { 
            status: true, 
            message: 'Charge Maid',
            data: {
              transactionId : charge.id,
              charge : charge
            } 
          };
          resolve(obj);
        }
      });
    });
    if(!holdCharge.status)
      throw new Error(holdCharge.message)

    response.status = true;
    response.statusCode = 200;
    response.message = holdCharge.message;
    response.data = holdCharge.data;
  }catch(error){
    response.status = false;
    response.statusCode = 503;
    response.message = error.message;
    response.data = {};
  }
  return response;
}


export const refundChargeOnCard = async (paymentInfo) => {
  let response = {
    status : false,
    statusCode : 503,
    message : "Unprocesable Entry",
    data : {}
  }
  try{
    let holdCharge = await new Promise((resolve, reject) => {
      let refundData = {
        charge : paymentInfo.transactionId
      };
      if(paymentInfo.amount)
        refundData["amount_to_capture"] = paymentInfo.amount;
      stripe.refunds.create( 
        refundData,
        (err, charge) => {
        if (err) {
          let obj = { 
            status: false,
            message: err.message
          };
          reject(obj);
        } else {
          let obj = { 
            status: true, 
            message: 'Charge Refunded',
            data: {
              transactionId : charge.id,
              charge : charge
            } 
          };
          resolve(obj);
        }
      });
    });
    if(!holdCharge.status)
      throw new Error(holdCharge.message)

    response.status = true;
    response.statusCode = 200;
    response.message = holdCharge.message;
    response.data = holdCharge.data;
  }catch(error){
    response.status = false;
    response.statusCode = 503;
    response.message = error.message;
    response.data = {};
  }
  return response;
}
export const StripeInvoice = async(obj)=> {
  try {
//     const product = await stripe.products.create({
//       name: 'Trips',
//     });
// console.log("product",product.id, "Amt",obj.Tripamount)
// // const price = await stripe.prices.create({
// //   product: `${product.id}`,
// //   unit_amount: 1000,
// //   currency: 'usd',
// // });
// const price = await stripe.prices.create({
//   unit_amount: 2000,
//   currency: 'usd',
//   product: product.id,
// });
//     // Create a customer
//     const customer = await stripe.customers.create({
//       name: obj.name,
//       email: obj.email,
//       description: obj.description,
//     });

//     // Create an invoice item
//     const invoiceItem = await stripe.invoiceItems.create({
//       customer: customer.id,
//       price: price.id, 
//     });

//     // Create an invoice
//     const invoice = await stripe.invoices.create({
//       customer: customer.id,
//       collection_method: 'send_invoice',
//       days_until_due: 7,
//       items: [invoiceItem.id],
//     });

//     // Send the invoice
//     const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);
//     console.log('Invoice sent:', sentInvoice);
    // Create a customer
    const customer = await stripe.customers.create({
      name: 'John Doe',
      email: 'absyogeswaran@gmail.com',
    });

    // // Charge the customer
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: 1000, // Amount in cents (e.g., $10.00)
    //   currency: 'usd', // Currency code
    //   customer: customer.id,
    // });

    // Create an invoice item
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customer.id,
      amount: 3000, // Amount in cents (e.g., $10.00)
      currency: 'usd', // Currency code
      description: 'Trip Amount',
    });

    // Create an invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice', // Automatically collect payment
      // Automatically include the previously created invoice item
      days_until_due: 7,
      auto_advance: false, // Automatically advance to "open" status
    });
const invoice1 = await stripe.invoices.finalizeInvoice(invoice.id);
    // Send the invoice
    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id);

    return sentInvoice;
  } catch (error) {
    console.error('Error:', error);
  }
} 