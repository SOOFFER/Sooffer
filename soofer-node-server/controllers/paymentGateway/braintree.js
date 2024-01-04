import mongoose from 'mongoose';
import Rider from '../../models/rider.model';
import Wallet from '../../models/wallet.model';
import DriverBank from '../../models/driverBank.model';
import * as GFunctions from '../functions';
const request = require('request');
var config = require('../../config');
var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: config.paymentGateway.braintreeMerchantId,
  publicKey: config.paymentGateway.braintreePublicKey,
  privateKey: config.paymentGateway.braintreePrivateKey,
});


export const get_client_token = () => {
  return new Promise(function (resolve, reject) {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) return reject(err);
      return resolve(response.clientToken);
    });
  })
}  

//Checkout
export const transferAmountUsingNonceNRecharge = (nonceFromTheClient, amount, msg, data) => {
  return new Promise(function (resolve, reject) {
    var responseObj = {
      success : false,
    };
    gateway.transaction.sale({
      amount: amount,
      orderId: msg,

      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
      },
      // customerId: "theCustomerId",

      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    }, function (err, response) {
      if (err) return reject(responseObj);
      if (response.success){
        responseObj.success = true;
        responseObj.id = response.transaction.id;
        responseObj.amount = response.transaction.amount;
      }
      return resolve(responseObj);
    });
  })
}  

 