const config = require('../../config');
const featuresSettings = require('../../featuresSettings');
import logger from '../../helpers/logger';
const countryDocs = require('../../countryDocs');
const _ = require('lodash');
const randomize = require('randomatic');
const request = require('request');
// const Payments = require('../../modules/Paymentsflow/payments.model');

import DriverBank from '../../models/driverBank.model';
import Driver from '../../models/driver.model';
import Rider from '../../models/rider.model';
import Wallet from '../../models/wallet.model';
import Trips from '../../models/trips.model';
import mongoose from 'mongoose';
import * as GFunctions from '../functions';
import { updateDriverWallet } from '../driverBank';
import DriverWallet from '../../models/driverWallet.model';
import * as Payment from "../../modules/Paymentsflow/index";
import paymentsflow from "../../modules/Paymentsflow/payments.model"

switch (config.paymentGateway.paymentGatewayName) {
  case 'stripe':
    var paymentGatewayCtrlName = './stripe';
    break;
  case 'braintree':
    var paymentGatewayCtrlName = './braintree';
    break;
  case 'paytm':
    var paymentGatewayCtrlName = './paytm';
    break;
  case 'paystack':
    var paymentGatewayCtrlName = './paystack';
    break;
  case 'razorpay':
    var paymentGatewayCtrlName = './razorpay';
    break;
  default:
    var paymentGatewayCtrlName = './stripe';
    break;
}

const paymentGatewayFunctions = require(paymentGatewayCtrlName);

export const getRazorpay = (id) => {
  let data = paymentGatewayFunctions.fetchRazorPayment(id);
  return data;
}

export const getPUsers = (req, res) => {
  paymentGatewayFunctions.listCustomers(req, res);
}

export const addCard = async (req, res) => {
  if (featuresSettings.riderCard && featuresSettings.riderRechargeWalletInClientSide == false) {
    try {
      var desc = "Rider - " + req.userId;
      var resObj = await paymentGatewayFunctions.findNAddCardTOUser(req.body.cardToken, desc);
      if (resObj.success) {
        if (config.paymentGateway.paymentGatewayName == "stripe") {
          var last4 = req.body.lastNum ? req.body.lastNum : '';
          // if (resObj.data.sources.data.length > 0) {
          //   last4 = resObj.data.sources.data[0].last4;
          // }
          var cardDetails = {
            id: resObj.data.id,
            currency: resObj.data.currency ? resObj.data.currency : featuresSettings.defaultcur,
            last4: last4
          };
        }

        else if (config.paymentGateway.paymentGatewayName == "paystack") {
          var cardDetails = {
            id: resObj.data.authCode,
            amount: resObj.data.amount,
            currency: featuresSettings.defaultcur,
            last4: resObj.data.last4
          };
        }

        addCardToMongo(req.userId, cardDetails, res, req);
      }
    } catch (error) {
      logger.error(error);
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_CARD") });
    }
  } else {
    return res.json({ 'success': true, 'message': req.i18n.__("THIS_FEATURE_NOT_AVAILABLE") });
  }
}

export const transferAmountNRecharge = async (res, cardId, desc, cur = "usd", amt = 0, userId, walletId, userData, req) => {
  try {
    amt = Number(amt);
    var resObj = await paymentGatewayFunctions.transferAmountNRechargeUser(cardId, desc, cur, amt, userData.email);
    if (resObj.success) {
      var chargeDetails = {
        id: resObj.data.id,
        amount: resObj.data.amount, // (*100 in stripe)
      };
      RechargeMyWallet(res, chargeDetails, userId, walletId, req, "Wallet Recharge");
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_AMOUNT") });
  }
}

export const transferAmountToWallet = async (req, res) => {
  var cardDetails = {
    id: '',
    last4: '',
    currency: ''
  };
  try {
    if (config.paymentGateway.paymentGatewayName == 'paypal') {
      req.body.amount = parseFloat(req.body.amount * 100).toFixed(2);
      cardDetails.id = 'paypal';
      cardDetails.currency = req.body.currency;
    }

    if (config.paymentGateway.paymentGatewayName == 'paytm') {
      req.body.amount = parseFloat(req.body.amount * 100).toFixed(2);
      cardDetails.id = 'paytm';
      cardDetails.currency = req.body.currency;
    }

    if (config.paymentGateway.paymentGatewayName == 'razorpay') {
      var data = await paymentGatewayFunctions.fetchRazorPayment(req.body.id)
      req.body.amount = data.amount;
      cardDetails.id = 'razorpay';
      cardDetails.currency = data.currency;
      req.body.id = data.id;
      req.body.currency = data.currency;
    }

    var chargeDetails = {
      id: req.body.id,
      amount: req.body.amount, // (*100 in stripe)
      currency: req.body.currency
    };
    createNTransferAmountToWallet(res, chargeDetails, cardDetails, req.userId, req);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_AMOUNT") });
  }
}
//Helpers
function addCardToMongo(userId, cardDetails, res, req, type = "add") {
  Rider.findById(userId, function (err, docs) {
    if (err) { } else if (!docs) { }
    else {
      docs.card.id = cardDetails.id;
      docs.card.currency = cardDetails.currency;
      docs.card.last4 = cardDetails.last4;
      docs.save(function (err, op) {
        if (err) { }
        else {
          addCardDetailsToWallet(userId, cardDetails);
          var msg = "CARD_DETAILS_ADDED_SUCCESSFULLY";
          if (type == "delete") msg = "CARD_DELETED_SUCCESSFULLY";
          return res.status(200).json({ 'success': true, 'message': req.i18n.__(msg) });
        }
      })

    }
  });
}

function addCardDetailsToWallet(userId, cardDetails) {
  // 1.chk Wallet
  Wallet.findOne({ ridid: userId }, function (err, doc) {
    if (err) { }
    else if (!doc) {
      //Add New Wallet Details
      var newDoc = new Wallet(
        {
          ridid: userId,
          bal: 0,
          card: {
            id: cardDetails.id,
            currency: cardDetails.currency,
            last4: addCardDetailsToWallet.last4
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
      doc.card.id = cardDetails.id;
      doc.card.currency = cardDetails.currency;
      doc.card.last4 = cardDetails.last4;
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

function RechargeMyWallet(res, charge, userId, walletId, req, description = "") {
  var id = mongoose.Types.ObjectId();
  var tranxData = {
    _id: id,
    trxid: charge.id,
    amt: (parseFloat(charge.amount) / 100),
    date: GFunctions.sendTimeNow(),
    type: 'Credit',
    for: description
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
        }

      })
    }
  });

}

function createNTransferAmountToWallet(res, chargeDetails, cardDetails, userId, req) {
  // 1.chk Wallet
  Wallet.findOne({ ridid: userId }, function (err, doc) {
    if (err) { }
    else if (!doc) {
      //Add New Wallet Details
      var newDoc = new Wallet(
        {
          ridid: userId,
          bal: 0,
          card: {
            id: cardDetails.id,
            currency: cardDetails.currency,
            last4: cardDetails.last4,
          }
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
        } else {
          RechargeMyWallet(res, chargeDetails, userId, docs._id, req)
        }
      })
      //Add New Wallet Details
    } else if (doc) {
      RechargeMyWallet(res, chargeDetails, userId, doc._id, req);

    }
  })
  // 1.chk Wallet
}

/**
 * Retrive the list of bank name and slug and code for add bank details on driver side
 * Used only on paystack payment gateway
 * @param {*} req
 * @param {*} res
 */
export const getListOfBanks = async (req, res) => {
  try {
    var bankList = await paymentGatewayFunctions.getBankDetail();
    return res.status(200).json({ "success": true, "message": req.i18n.__("DETAILS_FETCH"), bankList: bankList })
  } catch (error) {
    logger.error(error);
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_FETCHING_BANK") + error.message });
  }
}

//
export const addDriverBank = async (req, res) => {
  try {
    var driverDetails = await Driver.findOne({ _id: mongoose.Types.ObjectId(req.userId) });
    req.body.fname = driverDetails.fname;
    req.body.lname = driverDetails.lname;
    req.body.phone = driverDetails.phone;

    var bankDetails = {
      email: req.body.email,
      holdername: req.body.holdername,
      acctNo: req.body.acctNo,
      banklocation: req.body.banklocation,
      bankname: req.body.bankname,
      swiftCode: req.body.swiftCode,
      currency: featuresSettings.defaultcur,
      chid: '',
    };

    if (config.paymentGateway.paymentGatewayName == 'stripe') {
      var desc = "Driver - " + req.userId;
      var resObj = false;
      if (featuresSettings.driverPayouts.driverStripeConnect) { //If payout from stripe available
        //create a connect account for Direct tranx
        resObj = await paymentGatewayFunctions.createConnectFromBankForDriver(req.body, featuresSettings.driverPayouts.driverStripeConnectCountry);
        if (resObj.success) {
          updateConnectIsCreated(req.userId, bankDetails);
          var stripeAcctId = resObj.charge.id;
          bankDetails.chid = stripeAcctId;
          addDriverBankDetailsToWallet(bankDetails, req, res);
        } else {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
        }
      } else {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("THIS_FEATURE_NOT_AVAILABLE") });
      }
    }

    else if (config.paymentGateway.paymentGatewayName == 'paystack') {

      if (req.body.metaData == undefined) {
        var metaValue = {};
      } else {
        var metaValue = req.body.metaData;
      }
      var originalData = {
        recipientName: req.body.holdername,
        recipientDesc: req.body.banklocation,
        recipientAccountNo: req.body.acctNo,
        recipientBankCode: req.body.swiftCode,
        metaData: metaValue,
      };

      var bankDetailsRef = {
        email: req.body.email,
        holdername: req.body.holdername,
        acctNo: req.body.acctNo,
        banklocation: req.body.banklocation,
        bankname: req.body.bankname,
        swiftCode: req.body.swiftCode,
        currency: featuresSettings.defaultcur,
        chid: '',
      };


      resObj = await paymentGatewayFunctions.createTransferRecipientFromBankForDriver(originalData);
      if (resObj.success) {
        updateConnectIsCreated(req.userId, bankDetailsRef);
        var stripeAcctId = resObj.data.recipient_code;
        bankDetails.chid = stripeAcctId;
        addDriverBankDetailsToWallet(bankDetails, req, res);
      } else {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
      }
    }

    else {
      //Just add bank details
      addDriverBankDetailsToWallet(bankDetails, req, res);
    }

  } catch (error) {
    logger.error(error);
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") + error.message });
  }
}

function updateConnectIsCreated(dvrid, bankDetails) {

  var updateDetails = {
    isConnected: true,
    actMail: bankDetails.holdername,
    actHolder: bankDetails.holdername,
    actNo: bankDetails.acctNo,
    actBank: bankDetails.bankname,
    actCode: bankDetails.swiftCode,
    actLoc: bankDetails.banklocation,
  };

  Driver.findOneAndUpdate({ _id: dvrid }, updateDetails, { new: true }, (err, doc) => {
    if (err) console.log(err);
    console.log('updateConnectIsCreated true');
  });
}

/**
 * Add the Driver card details to Mongo
 * @input
 * @param
 * @return
 * @response
 */
function addDriverBankDetailsToWallet(bankDetails, req, res) {
  // 1.chk Wallet
  DriverBank.findOne({ driverId: req.userId }, function (err, doc) {
    if (err) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
    }
    else if (!doc) {
      //Add New Wallet Details
      var newDoc = new DriverBank(
        {
          driverId: req.userId,
          totalBal: 0,
          bank: {
            email: bankDetails.email,
            holdername: bankDetails.holdername,
            acctNo: bankDetails.acctNo,
            banklocation: bankDetails.banklocation,
            bankname: bankDetails.bankname,
            swiftCode: bankDetails.swiftCode,
            currency: bankDetails.currency,
            chid: bankDetails.chid,
          }
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
        } else {
          return res.json({ 'success': true, 'message': req.i18n.__("BANK_DETAILS_ADDED_SUCCESSFULLY") });
        }
      })
      //Add New Wallet Details

    } else if (doc) {

      doc.bank.email = bankDetails.email;
      doc.bank.holdername = bankDetails.holdername;
      doc.bank.acctNo = bankDetails.acctNo;
      doc.bank.banklocation = bankDetails.banklocation;
      doc.bank.bankname = bankDetails.bankname;
      doc.bank.swiftCode = bankDetails.swiftCode;
      doc.bank.currency = bankDetails.currency;
      doc.bank.chid = bankDetails.chid;

      doc.save(function (err, op) {
        if (err) {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
        }
        else {
          return res.json({ 'success': true, 'message': req.i18n.__("BANK_DETAILS_ADDED_SUCCESSFULLY") });
        }
      })

    }
  })
  // 1.chk Wallet
}


export const driverRequestPayoutTransferAmount = async (req, res) => {
  try {
    if (featuresSettings.driverPayouts.driverDirectPayout) {
      if (Number(req.body.amount) < Number(featuresSettings.driverPayouts.driverPayoutAmountLimitMax)) {
        return res.status(409).json({ "status": false, "message": req.i18n.__("YOU_REQUEST_AMOUNT_MORE_THAN_ONE") + featuresSettings.driverPayouts.driverPayoutAmountLimitMax + featuresSettings.defaultcur })
      }

      var driverWalletData = await DriverWallet.findOne({ driverId: req.userId }).exec();
      var driverBankData = await DriverBank.findOne({ driverId: req.userId }).exec();

      if (driverWalletData) {
        let totalBal = driverWalletData.totalBal;
        req.body.stripeAcctId = driverBankData.bank.chid;
        if (!req.body.stripeAcctId) {
          return res.status(409).json({ "status": false, "message": req.i18n.__("YOU_DONT_HAVE_ACCOUNT_CREATED_TRANSFER_CREDITS") })
        }
        if (Number(totalBal) < Number(req.body.amount)) {
          return res.status(409).json({ "status": false, "message": req.i18n.__("YOU_DONT_HAVE_SUFFICENT_CREDITS_YOUR_WALLET") })
        }
        transfersAmountToDriverConnect(req, res, totalBal);
      } else {
        return res.status(409).json({ "status": false, "message": req.i18n.__("NO_DRIVER_CREDIT_WALLET") })
      }

    }
    else {

      return res.json({ 'success': true, 'message': req.i18n.__("THIS_FEATURE_NOT_AVAILABLE") });
    }

  } catch (error) {
    console.lg("error", error);
    return res.json({ 'success': true, 'message': req.i18n.__("REQUEST_PAYOUT_ERROR") });
  }
}


async function transfersAmountToDriverConnect(req, res, totalAmt) {
  try {
    var Striperes = await paymentGatewayFunctions.transfersConnectAmtDriver(req.body.amount, req.body.stripeAcctId, featuresSettings.defaultcur);
    var transactionID;

    if (config.paymentGateway.paymentGatewayName == 'stripe') {
      transactionID = Striperes.charge.id;
    } else if (config.paymentGateway.paymentGatewayName == 'paystack') {
      transactionID = Striperes.charge.transfer_code;
    }
    if (Striperes) {

      var tripParams = {
        driverId: req.userId,
        trxId: transactionID,
        description: "Payout - " + req.body.amount,
        amt: req.body.amount,
        paymentDate: GFunctions.getISODate("D-M-YYYY h:mm a"),
        paymentDateSort: GFunctions.getISODate(),
        type: 'debit'
      }
      //Update Driver Wallet.
      updateDriverWallet(tripParams.driverId, tripParams, true);

      var balanceInWallet = Number(totalAmt) - Number(req.body.amount);

      return res.json({ 'success': true, 'message': req.i18n.__("AMOUNT_HAS_TRANSFER_TO_ACCOUNT"), 'balance': balanceInWallet });

    }
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': err.message });
  }
}



export const stripeRedirectLink = async (req, res) => {
  try {
    // https://gogetdash.com:3001/public/stripe/stripe-express-fail.html
    var stripeSuccess = config.fileurl + "stripe/stripe-express-success.html";
    var stripeFail = config.fileurl + "stripe/stripe-express-fail.html";

    var bankDetails = {
      email: '',
      holdername: '',
      acctNo: '',
      banklocation: '',
      bankname: '',
      swiftCode: '',
      currency: '',
      chid: '',
    };


    if (config.paymentGateway.stripeConnectAccountType == 'express') {
      var data = req.query;
      if (data.code) {
        var Striperes = await paymentGatewayFunctions.createExpressConnectForDriver(data.code);
        if (Striperes.success) {
          updateConnectIsCreated(data.state, bankDetails);
          var stripeObj = JSON.parse(Striperes.data);
          var stripeAcctId = stripeObj.stripe_user_id;
          bankDetails.chid = stripeAcctId;
          addDriverCHIDDetailsToWallet(bankDetails, data.state, res, stripeFail, stripeSuccess);

        } else {

          res.redirect(stripeFail);
        }
      } else {
        res.redirect(stripeFail);
      }
    }
  } catch (err) {
    console.log(err);
    res.redirect(stripeFail);
  }
}

function addDriverCHIDDetailsToWallet(bankDetails, userId, res, stripeFail, stripeSuccess) {
  // 1.chk Wallet
  DriverBank.findOne({ driverId: userId }, function (err, doc) {
    if (err) {
      res.redirect(stripeFail);
    }
    else if (!doc) {
      //Add New Wallet Details
      var newDoc = new DriverBank(
        {
          driverId: userId,
          totalBal: 0,
          bank: {
            email: bankDetails.email,
            holdername: bankDetails.holdername,
            acctNo: bankDetails.acctNo,
            banklocation: bankDetails.banklocation,
            bankname: bankDetails.bankname,
            swiftCode: bankDetails.swiftCode,
            currency: bankDetails.currency,
            chid: bankDetails.chid,
          }
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
          res.redirect(stripeFail);
        } else {
          res.redirect(stripeSuccess);
        }
      })
      //Add New Wallet Details

    } else if (doc) {
      doc.bank.email = bankDetails.email;
      doc.bank.holdername = bankDetails.holdername;
      doc.bank.acctNo = bankDetails.acctNo;
      doc.bank.banklocation = bankDetails.banklocation;
      doc.bank.swiftCode = bankDetails.swiftCode;
      doc.bank.currency = bankDetails.currency;
      doc.bank.chid = bankDetails.chid;

      doc.save(function (err, op) {
        if (err) {
          res.redirect(stripeFail);
        }
        else {
          res.redirect(stripeSuccess);
        }
      })

    }
  })
  // 1.chk Wallet
}


export const get_bt_client_token = async (req, res) => {
  try {
    var token = await paymentGatewayFunctions.get_client_token();
    return res.status(200).json({ 'success': true, 'token': token });
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': err.message });
  }
}

export const transferAmountUsingNonceNRecharge = async (req, res, userId, walletId, msg, data) => {
  try {
    var nonceFromTheClient = req.body.payment_method_nonce;
    var rechargeAmount = req.body.rechargeAmount;
    var resObj = await paymentGatewayFunctions.transferAmountUsingNonceNRecharge(nonceFromTheClient, rechargeAmount, msg, data);
    if (resObj.success) {
      var chargeDetails = {
        id: resObj.id,
        amount: Number(resObj.amount) * 100, // (*100 for Braintree)
      };
      RechargeMyWallet(res, chargeDetails, userId, walletId, req);
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_AMOUNT") });
  }
}

export const transferTripAmountUsingNonce = async (nonceFromTheClient, tripAmount, msg, data) => {
  try {
    var resObj = await paymentGatewayFunctions.transferAmountUsingNonceNRecharge(nonceFromTheClient, tripAmount, msg, data);
    if (resObj.success) {
      var chargeDetails = {
        id: resObj.id,
        amount: Number(resObj.amount) * 100, // (*100 for Braintree)
      };
      return chargeDetails;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export const chargeExistingUserCardWithInstantSplitToDriver = async (custid, stripeDesc, currency, totalamount, commisionamount, driverConnectAcctId) => {
  try {
    var data = {
      commisionamount: commisionamount,
      totalamount: totalamount,
      custid: custid,
      driverConnectAcctId: driverConnectAcctId,
      stripeDesc: stripeDesc,
      currency: currency
    };

    var chargeDetails = {
      status: false,
      id: '',
      amount: 0,
    };

    var Striperes = await paymentGatewayFunctions.makeStripeSplitPayment(data);

    if (Striperes.success) {
      chargeDetails.status = true;
      chargeDetails.id = Striperes.chargeId;
      chargeDetails.amount = Striperes.chargeAmount; // (*100 in stripe)
    }

    return chargeDetails;

  } catch (err) {
    console.log(err)
    return chargeDetails;
  }
}

export const makeInstantPayouts = async (stripeDesc, currency, totalamount, commisionamount, driverConnectAcctId) => {
  try {
    var data = {
      commisionamount: commisionamount,
      totalamount: totalamount,
      driverConnectAcctId: driverConnectAcctId,
      stripeDesc: stripeDesc,
      currency: currency
    };

    var chargeDetails = {
      status: false,
      id: '',
      amount: 0,
    };

    var Striperes = await paymentGatewayFunctions.makeInstantPayouts(data);

    if (Striperes.success) {
      chargeDetails.status = true;
      chargeDetails.id = Striperes.chargeId;
      chargeDetails.amount = Striperes.chargeAmount; // (*100 in stripe)
    }

    return chargeDetails;

  } catch (err) {
    console.log(err)
    return chargeDetails;
  }
}

//Paytm
export const generate_paytm_checksum = async (req, res) => {
  try {
    var token = await paymentGatewayFunctions.generate_paytm_checksum(req);
    return res.status(200).json({ 'success': true, 'checksum': token });
  } catch (err) {
    return res.status(500).json({ 'success': false, 'message': err.message });
  }
}

/**
 * url  : /adminapi/addDriverBankDetail
 * body : _id, email, holdername, acctNo, banklocation, bankname, swiftCode,
*/
export const addDriverBankDetailForAdmin = async (req, res) => {
  try {
    var driverDetails = await Driver.findOne({ _id: mongoose.Types.ObjectId(req.body._id) });
    var countryCode = featuresSettings.driverPayouts.driverStripeConnectCountry;
    var phcode = driverDetails ? driverDetails.phcode : ("+" + config.phoneCode);
    var filterDocumet = _.filter(countryDocs.defaultCountrySettings, { 'phoneCode': phcode });
    if (filterDocumet.length) countryCode = filterDocumet[0].countryCode;
    req.body.fname = driverDetails.fname;
    req.body.lname = driverDetails.lname;
    req.body.phone = driverDetails.phone;

    var bankDetails = {
      email: req.body.email,
      holdername: req.body.holdername,
      acctNo: req.body.acctNo,
      banklocation: req.body.banklocation,
      bankname: req.body.bankname,
      swiftCode: req.body.swiftCode,
      currency: featuresSettings.defaultcur,
      chid: '',
    };

    if (config.paymentGateway.paymentGatewayName == 'stripe') {
      var desc = "Driver - " + req.userId;
      var resObj = false;
      if (featuresSettings.driverPayouts.driverStripeConnect) { //If payout from stripe available
        //create a connect account for Direct tranx
        resObj = await paymentGatewayFunctions.createConnectFromBankForDriver(req.body, countryCode);
        if (resObj.success) {
          updateConnectIsCreated(req.userId, bankDetails);
          var stripeAcctId = resObj.charge.id;
          bankDetails.chid = stripeAcctId;
          addDriverBankDetailForAdminToWallet(bankDetails, req, res);
        } else {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
        }
      } else {
        addDriverBankDetailForAdminToWallet(bankDetails, req, res);
        // return res.status(409).json({ 'success': false, 'message': req.i18n.__("THIS_FEATURE_NOT_AVAILABLE") });
      }
    }

    else if (config.paymentGateway.paymentGatewayName == 'paystack') {

      if (req.body.metaData == undefined) {
        var metaValue = {};
      } else {
        var metaValue = req.body.metaData;
      }
      var originalData = {
        recipientName: req.body.holdername,
        recipientDesc: req.body.banklocation,
        recipientAccountNo: req.body.acctNo,
        recipientBankCode: req.body.swiftCode,
        metaData: metaValue,
      };

      var bankDetailsRef = {
        email: req.body.email,
        holdername: req.body.holdername,
        acctNo: req.body.acctNo,
        banklocation: req.body.banklocation,
        bankname: req.body.bankname,
        swiftCode: req.body.swiftCode,
        currency: featuresSettings.defaultcur,
        chid: '',
      };


      resObj = await paymentGatewayFunctions.createTransferRecipientFromBankForDriver(originalData);
      if (resObj.success) {
        updateConnectIsCreated(req.userId, bankDetailsRef);
        var stripeAcctId = resObj.data.recipient_code;
        bankDetails.chid = stripeAcctId;
        addDriverBankDetailForAdminToWallet(bankDetails, req, res);
      } else {
        return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
      }
    }

    else {
      //Just add bank details
      addDriverBankDetailForAdminToWallet(bankDetails, req, res);
    }

  } catch (error) {
    logger.error(error);
    return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") + error.message });
  }
}

/**
 *
*/
export const viewDriverBankDetailForAdmin = (req, res) => {
  DriverBank.find({ driverId: req.params.id }, { trx: 0 }).exec((err, docs) => {
    if (err) {
      return res.json([]);
    }
    if (docs.length) {
      return res.json({ "bankDetails": docs[0].bank });
    }
    else {
      return res.json({ "bankDetails": { "email": "", "holdername": "", "acctNo": "", "banklocation": "", "bankname": "", "swiftCode": "" } });
    }
  })
}

function addDriverBankDetailForAdminToWallet(bankDetails, req, res) {
  // 1.chk Wallet
  DriverBank.findOne({ driverId: req.body._id }, function (err, doc) {
    if (err) {
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
    }
    else if (!doc) {
      //Add New Wallet Details
      var newDoc = new DriverBank(
        {
          driverId: req.body._id,
          totalBal: 0,
          bank: {
            email: bankDetails.email,
            holdername: bankDetails.holdername,
            acctNo: bankDetails.acctNo,
            banklocation: bankDetails.banklocation,
            bankname: bankDetails.bankname,
            swiftCode: bankDetails.swiftCode,
            currency: bankDetails.currency,
            chid: bankDetails.chid,
          }
        }
      );
      newDoc.save((err, docs) => {
        if (err) {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
        } else {
          return res.json({ 'success': true, 'message': req.i18n.__("BANK_DETAILS_ADDED_SUCCESSFULLY") });
        }
      })
      //Add New Wallet Details

    } else if (doc) {

      doc.bank.email = bankDetails.email;
      doc.bank.holdername = bankDetails.holdername;
      doc.bank.acctNo = bankDetails.acctNo;
      doc.bank.banklocation = bankDetails.banklocation;
      doc.bank.bankname = bankDetails.bankname;
      doc.bank.swiftCode = bankDetails.swiftCode;
      doc.bank.currency = bankDetails.currency;
      doc.bank.chid = bankDetails.chid;

      doc.save(function (err, op) {
        if (err) {
          return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_BANK") });
        }
        else {
          return res.json({ 'success': true, 'message': req.i18n.__("BANK_DETAILS_ADDED_SUCCESSFULLY") });
        }
      })

    }
  })
  // 1.chk Wallet
}

export const checkPaymentTransaction = async (referenceId) => {
  try {
    var resObj;
    if (config.paymentGateway.paymentGatewayName == 'paystack') {
      resObj = await paymentGatewayFunctions.checkPaymentTransaction(referenceId);
    }

    if (resObj) {
      return true;
    } else {
      return false;
    }


  } catch (error) {
    logger.error(error);
    return false;
  }
};


export const addDriverCard = async (req, res) => {
  if (featuresSettings.driverCard && featuresSettings.driverRechargeWalletInClientSide == false) {
    try {
      var desc = "Driver - " + req.userId;
      var resObj = await paymentGatewayFunctions.findNAddCardTOUser(req.body.cardToken, desc);
      if (resObj.success) {
        if (config.paymentGateway.paymentGatewayName == "stripe") {
          var last4 = req.body.lastNum ? req.body.lastNum : '';
          // if (resObj.data.sources.data.length > 0) {
          //   last4 = resObj.data.sources.data[0].last4;
          // }
          var cardDetails = {
            id: resObj.data.id,
            currency: resObj.data.currency ? resObj.data.currency : featuresSettings.defaultcur,
            last4: last4
          };
        }

        else if (config.paymentGateway.paymentGatewayName == "paystack") {
          var cardDetails = {
            id: resObj.data.authCode,
            amount: resObj.data.amount,
            currency: featuresSettings.defaultcur,
            last4: resObj.data.last4
          };
        }

        addDriverCardToMongo(req.userId, cardDetails, res, req);
      }
    } catch (error) {
      logger.error(error);
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_ADDING_CARD") + ' :' + error.message });
    }
  } else {
    return res.json({ 'success': true, 'message': req.i18n.__("THIS_FEATURE_NOT_AVAILABLE") });
  }
}

//Helpers
function addDriverCardToMongo(userId, cardDetails, res, req) {
  Driver.findById(userId, function (err, docs) {
    if (err) { } else if (!docs) { }
    else {
      docs.card.id = cardDetails.id;
      docs.card.currency = cardDetails.currency;
      docs.card.last4 = cardDetails.last4;
      docs.save(function (err, op) {
        if (err) { }
        else {
          addDriverCardDetailsToWallet(userId, cardDetails);
          return res.status(200).json({ 'success': true, 'message': req.i18n.__("CARD_DETAILS_ADDED_SUCCESSFULLY") });
        }
      })

    }
  });
}

function addDriverCardDetailsToWallet(userId, cardDetails) {
  // 1.chk Wallet
  DriverWallet.findOne({ driverId: userId }, function (err, doc) {
    if (err) { }
    else if (!doc) {
      //Add New Wallet Details
      var newDoc = new DriverWallet(
        {
          driverId: userId,
          bal: 0,
          card: {
            id: cardDetails.id,
            currency: cardDetails.currency,
            last4: addDriverCardDetailsToWallet.last4
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
      doc.card.id = cardDetails.id;
      doc.card.currency = cardDetails.currency;
      doc.card.last4 = cardDetails.last4;
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

export const deleteDriverCard = async (req, res) => {
  if (featuresSettings.driverCard && featuresSettings.driverRechargeWalletInClientSide == false) {
    try {
      var desc = "Driver - " + req.userId;
      var walletDetail = await DriverWallet.findOne({ driverId: req.userId }).lean().exec();
      if (walletDetail) {
        if (walletDetail.card.id) {
          var resObj = await paymentGatewayFunctions.findNDeleteCardOfUser(walletDetail.card.id);
          if (resObj.success) {
            if (config.paymentGateway.paymentGatewayName == "stripe") {
              var last4 = '';
              var cardDetails = {
                id: "",
                currency: resObj.data.currency ? resObj.data.currency : featuresSettings.defaultcur,
                last4: last4
              };
            }
            addDriverCardToMongo(req.userId, cardDetails, res, req);
          }
          else return res.status(409).json({ 'success': false, 'message': req.i18n.__(resObj.message) });
        }
        else return res.status(409).json({ 'success': false, 'message': req.i18n.__("NO_CARD_FOUND") });
      }
      else return res.status(409).json({ 'success': false, 'message': req.i18n.__("NO_CARD_FOUND") });
    } catch (error) {
      logger.error(error);
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_DELETING_CARD") + ' :' + error.message });
    }
  } else {
    return res.json({ 'success': true, 'message': req.i18n.__("THIS_FEATURE_NOT_AVAILABLE") });
  }
}

export const transferAmountNRechargeDriver = async (res, cardId, desc, cur = "usd", amt = 0, driverId, walletId, driverData, req) => {
  try {
    var resObj = await paymentGatewayFunctions.transferAmountNRechargeUser(cardId, desc, cur, amt, driverData.email);
    return resObj;
  } catch (error) {
    return { 'success': false, 'message': 'Error Adding Amount!', "err": error }
  }
}

export const deleteRiderCard = async (req, res) => {
  if (featuresSettings.riderCard && featuresSettings.riderRechargeWalletInClientSide == false) {
    try {
      var desc = "Rider - " + req.userId;
      var riderDetail = await Rider.findOne({ _id: req.userId }).lean().exec();
      if (riderDetail) {
        if (riderDetail.card.id) {
          var resObj = await paymentGatewayFunctions.findNDeleteCardOfUser(riderDetail.card.id);
          if (resObj.success) {
            if (config.paymentGateway.paymentGatewayName == "stripe") {
              var last4 = '';
              var cardDetails = {
                id: "",
                currency: resObj.data.currency ? resObj.data.currency : featuresSettings.defaultcur,
                last4: last4
              };
            }
            addCardToMongo(req.userId, cardDetails, res, req, "delete");
          }
          else return res.status(409).json({ 'success': false, 'message': req.i18n.__(resObj.message) });
        }
        else return res.status(409).json({ 'success': false, 'message': req.i18n.__("NO_CARD_FOUND") });
      }
      else return res.status(409).json({ 'success': false, 'message': req.i18n.__("NO_CARD_FOUND") });
    } catch (error) {
      logger.error(error);
      return res.status(409).json({ 'success': false, 'message': req.i18n.__("ERROR_DELETING_CARD") + ' :' + error.message });
    }
  } else {
    return res.json({ 'success': true, 'message': req.i18n.__("THIS_FEATURE_NOT_AVAILABLE") });
  }
}

export const checkout = async (req, res) => {
  var tripFare = 0;
  var tripsData = await Trips.findOne({ 'tripno': req.params.id });
  var randomUniqueId = randomize('A0', 8)
  if (tripsData) {
    tripFare = tripsData.fare;
    randomUniqueId = tripsData.tripno;
  }
  var payload = {
    amount: Number(tripFare) * 100, //100 = 1$
    amountWithoutTax: Number(tripFare) * 100,
    currency: "USD",
    uniqueTransId: randomUniqueId,
    alertMessage: req.i18n.__("ALERT_MESSAGE")
  }
  res.render('payPhoneindex', payload);
}

export const checkoutRedirectURL = async (req, res) => {
  var trxId = req.query.id;
  var uniqueId = req.query.clientTransactionId;
  var data;
  var body = {
    "trip_id": Number(uniqueId),
    "id": trxId,
  }
  var options = {
    'method': 'PUT',
    'url': 'https://aloapp.com:3001/api/tripPaymentStatus',
    'headers': {
      'Content-Type': 'application/json',
      // 'Authorization': config.paymentGateway.payPhoneToken
    },
    body: JSON.stringify(body)
  }
  request(options, function (error, response) {
    data = JSON.parse(response.body);
    res.render('success', { successmessage: "Payment Succeeded!" });
  });
}

// export const chargeExistingUserCard = async (cardId, desc, cur = featuresSettings.defaultcur, amt = 0, email = "", paymentMethod = config.paymentGateway.paymentGatewayName) => {
//   try {
//     // console.log("chargeExistingUserCard",cardId, desc, cur, amt, email, paymentMethod);
//     var resObj = false;
//     if (paymentMethod == 'stripe') {
//       resObj = await paymentGatewayFunctions.chargeExistingUserCard(cardId, desc, cur, amt);
//       // console.log("chargeExistingUserCard", resObj);
//     }

//     if (paymentMethod == 'paystack') {
//       resObj = await paymentGatewayFunctions.chargeExistingUserCard(cardId, desc, cur, amt, email);
//     }

//     var chargeDetails = {
//       status: false,
//       id: '',
//       amount: 0,
//     };

//     if (resObj.success) {
//       chargeDetails.status = true;
//       chargeDetails.id = resObj.charge.id;
//       chargeDetails.amount = resObj.charge.amount;// (*100 in stripe)
//     }

//     return chargeDetails;

//   } catch (error) {
//     logger.error(error);
//     console.log("chargeExistingUserCard error", error);
//     return chargeDetails;
//   }
// }
export const chargeExistingUserCard = async (cardId, desc, cur = featuresSettings.defaultcur, amt = 0, email = "", paymentMethod = config.paymentGateway.paymentGatewayName,additionalInfo = null) => {
  try {
    let tripid = additionalInfo.referenceId
     var resObj = false;
    if (paymentMethod == 'stripe') {
      if(additionalInfo){
        // let update ={
        //   referenceId:additionalInfo.tripid
        // }

         let ReferenceId = await paymentsflow.findOneAndUpdate({transactionId:additionalInfo.transactionId},{$set:{"referenceId":tripid}},{new:true}).exec();
        let paymentHold = await Payment.getPayment({transactionId: additionalInfo.transactionId});
        if(paymentHold.status && paymentHold.data.paymentInfo && paymentHold.data.paymentInfo.amount >=  (amt * 100)){
          let processAmount = await captureHoldChargeExistingUserCard(
            {
              mode: "stripe",
              referenceId : additionalInfo.referenceId,
              action : "capture",
              amount : (amt * 100),
              transactionId: additionalInfo.transactionId
            }
          );
          if(processAmount.status)
            resObj = { 'success': true, 'message': '', "charge": processAmount.data.payment || {} };
          else
            resObj = await paymentGatewayFunctions.chargeExistingUserCard(cardId, desc, cur, amt);
        } else {
          resObj = await paymentGatewayFunctions.chargeExistingUserCard(cardId, desc, cur, amt);
        }
      }else {
        resObj = await paymentGatewayFunctions.chargeExistingUserCard(cardId, desc, cur, amt);
      }
    }

    if (paymentMethod == 'paystack') {
      resObj = await paymentGatewayFunctions.chargeExistingUserCard(cardId, desc, cur, amt, email);
    }

    var chargeDetails = {
      status: false,
      id: '',
      amount: 0,
    };
    if (resObj.success) {
      chargeDetails.status = true;
      chargeDetails.id = resObj.charge.id;
      chargeDetails.amount = resObj.charge.amount;// (*100 in stripe)
    }
    return chargeDetails;

  } catch (error) {
    logger.error(error);
    return chargeDetails;
  }
}

export const holdChargeExistingUserCard = async (payment) => {
  let response = {
    status : false,
    statusCode : 503,
    message : "Unprocesable Entry",
    data : {}
  }
  try {
    if(!payment.mode || payment.mode != "stripe")
      throw new Error("Payment Mode Not Supported");

    if(typeof(paymentGatewayFunctions.holdChargeOnCard) != "function")
      throw new Error("Payment Gateway Not Supported");

    let holdCharge = await paymentGatewayFunctions.holdChargeOnCard(payment);
    if(!holdCharge.status)
      throw new Error(holdCharge.message);
      
    let createPayment = await Payment.createPayment({
      userId : payment.userId,
      userType : payment.userType,
      paymentType : payment.paymentType,
      status : "initiated",
      referenceId : payment.referenceId,
      transactionId : holdCharge.data.transactionId,
      description : payment.description || "",

      amount : payment.amount,
      currency : payment.currency
    });

    if(!createPayment.status)
      throw new Error(createPayment.message);

    response.status = true;
    response.statusCode = 200;
    response.message = "Charge is on Hold";
    response.data = {
      origin : holdCharge.data,
      payment : createPayment.data
    };

  } catch (error) {
    response.status = false;
    response.statusCode = 503;
    response.message = error.message;
    response.data = {};
  }

  return response;
}

/**
 * 
 * @param {*} payment : mode, referenceId
 * @returns 
 */
export const captureHoldChargeExistingUserCard = async (payment) => {
  let response = {
    status : false,
    statusCode : 503,
    message : "Unprocesable Entry",
    data : {}
  }
  try {
    if(!payment.mode || payment.mode != "stripe")
      throw new Error("Payment Mode Not Supported");

    if(typeof(paymentGatewayFunctions.captureHoldChargeOnCard) != "function")
      throw new Error("Payment Gateway Not Supported");
    let getPayment = await Payment.getPayment(payment);
    if(!getPayment.status)
      throw new Error(getPayment.message);


    if(!getPayment.data || !getPayment.data.paymentInfo || (["reversed"]).includes(getPayment.data.paymentInfo.status))
      throw new Error("Error while action over Payment");

    let capturePayment = {};
    capturePayment["transactionId"] = getPayment.data.paymentInfo.transactionId;

    if(payment.amount && payment.amount < getPayment.data.paymentInfo.amount)
      capturePayment["amount"] = payment.amount;
    
    let paymentStatus = "";
    if(payment.action == "capture"){
      let holdCharge = await paymentGatewayFunctions.captureHoldChargeOnCard(capturePayment);
      if(!holdCharge.status)
        throw new Error(holdCharge.message);
      
      paymentStatus = "completed";
    } else if(payment.action == "refund"){
      let holdCharge = await paymentGatewayFunctions.refundChargeOnCard(capturePayment);
      if(!holdCharge.status)
        throw new Error(holdCharge.message);

      paymentStatus = "reversed";
    } else {
      throw new Error("Action Not Defined.")
    }
      
    let updatePayment = await Payment.updatePayment({
      status : paymentStatus,
      referenceId : payment.referenceId,
      transactionId: payment.transactionId
    });
    if(!updatePayment.status)
      throw new Error(updatePayment.message);

    response.status = true;
    response.statusCode = 200;
    response.message = "Charge is on Hold";
    response.data = {
      payment : updatePayment
    };

  } catch (error) {
    console.log("error",error)
    response.status = false;
    response.statusCode = 503;
    response.message = error.message;
    response.data = {};
  }

  return response;
}

/**
 * 
 */
export const holdChargeExistingRiderCard = async (paymentInfo) => {
  let response = {
    status : false,
    statusCode : 503,
    message : "Unprocesable Entry",
    data : {}
  }
  try {

    if(!paymentInfo.mode || paymentInfo.mode != "stripe")
      throw new Error("Payment Mode Not Supported");

    let riderInfo = await Rider.findOne({_id:paymentInfo.userId}).lean().exec()
    if(!riderInfo)
      throw new Error("Rider Not Found");
    if(!riderInfo.card && !riderInfo.card.id && riderInfo.card.id != "")
      throw new Error("Card not added");
      
    let paymentData = {
      mode: "stripe",
      userId : paymentInfo.userId,
      userType : "rider",
      paymentType : "trip",
      status : "initiated",
      customerId : riderInfo.card.id,
      
      currency : paymentInfo.currency,
      amount : paymentInfo.amount * 100,

      referenceId : paymentInfo.referenceId,
      description : paymentInfo.description,
    }
    let initiateHold = await holdChargeExistingUserCard(paymentData);
    if(!initiateHold.status)
      throw new Error(initiateHold.message);

    response.status = true;
    response.statusCode = 200;
    response.message = "Charge is on Hold";
    response.data = {
      transaction : initiateHold.data
    };

  } catch (error) {
    response.status = false;
    response.statusCode = 503;
    response.message = error.message;
    response.data = {};
  }
  return response;
}

