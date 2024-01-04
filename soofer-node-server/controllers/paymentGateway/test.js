import mongoose from 'mongoose';

var config = require('../../config');
var featuresSettings = require('../../featuresSettings');
import * as GFunctions from '../functions';
import * as paymentGatewayCtrl from './index'; 

export const getPUsers = async (req, res) => {
  paymentGatewayCtrl.getPUsers(req,res);
}