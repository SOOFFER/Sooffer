import mongoose from 'mongoose';
import Driver from '../models/driver.model';
import Rider from '../models/rider.model';
import Wallet from '../models/wallet.model';
import DriverBank from '../models/driverBank.model';
import * as GFunctions from './functions';

var config = require('../config');

//https://stripe.com/docs/api/node#intro
var stripe = require("stripe")(
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
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    return res.json({ 'success': true, 'message': '', "balance": balance });
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
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    return res.json({ 'success': true, 'message': '', "customer": customer });
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
  var custoken = req.body.cardToken;
  stripe.customers.create({
    description: desc,
    source: custoken
  }, function (err, customer) {
    if (err) {
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    addCardToMongo(req.userId, customer);
    return res.json({ 'success': true, 'message': req.i18n.__('CARD_ADDED_SUCCESSFULLY') });
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
  stripe.customers.list(
    { limit: 3 },
    function (err, customers) {
      if (err) {
        return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
      }
      return res.json({ 'success': true, 'message': '', "customer": customers });
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
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    return res.json({ 'success': true, 'message': '', "charge": charge });
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
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    return res.json({ 'success': true, 'message': '', "payout": payout });
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
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    return res.json({ 'success': true, 'message': '', "payout": payout });
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
  // console.log("chargeExistingUserCard",stripeCusid);
  var cusid = stripeCusid;
  var newamt = parseFloat(amt) * 100;

  return new Promise(function (resolve, reject) {

    stripe.charges.create({
      amount: newamt, // 1500 = $15.00 this time
      currency: cur,
      customer: cusid,
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
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
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
        return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
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
          return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
        }
        else {
          return res.status(200).json({ 'success': true, 'message': req.i18n.__('AMOUNT_ADDED_TO_WALLET'), 'balance': newbal });
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
      return res.status(500).json({ 'success': false, 'message': req.i18n.__('SOME_ERROR'), 'error': err });
    }
    addDriverBankDetailsToWallet(req, customer);
    // addCardToMongo(req.userId,customer);
    return res.json({ 'success': true, 'message': req.i18n.__('BANK_DETAILS_ADDED_SUCCESSFULLY') });
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



/**
 * Create New Connect r : Connect
 * @input
 * @param jaredm@24hrtruckfix.com
 * @return 7d76P^Atvz4??q8Z
 * @response
 */
export const createStripeConnectTest = async (emailId, countrycode = 'US') => {
  return new Promise(function (resolve, reject) {

    stripe.accounts.create({
      type: 'custom',
      country: countrycode,
      email: emailId,
      // requested_capabilities: ['card_payments'],
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
 *
 * @param {*} data
 */
export function makeStripeSplitPayment(data) {

  var driveramount = parseFloat(data.driveramount) * 100;
  var total = parseFloat(data.totalamount) * 100;
  var cur = "usd";

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
    }).then(function (charge, err) {
      if (charge) {
        console.log("Successfully Charged ", charge.id)
        var obj = { 'success': true, 'charge': charge };
        resolve(obj)
      }
      if (err) {
        console.log("Failed Charged ", err)
        var obj = { 'success': false };
        reject(obj);
      }

    });
  })

}

/**
* Create a stripe connect account link
*/
export const stripeBankDetailsLink = async (req, res) => {
  console.log(req.userId)
  var driverAccount = await DriverBank.findOne({ driverId: req.userId }, { bank: 1 }).exec();
  console.log(driverAccount.bank.chid)
  stripe.accounts.createLoginLink(
    driverAccount.bank.chid,
    function (err, link) {
      // asynchronously called
      if (err) {
        console.log(err)
        return res.json({ 'success': false, 'err': err })
      }
      // console.log(link)
      return res.json({ 'success': true, 'message': link.url })
    }
  );
}
