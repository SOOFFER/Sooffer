// ./express-server/routes/uber.server.route.js
import express from 'express'; 

const trimRequest = require('trim-request');
const verifyToken = require('../../routes/VerifyToken');
 
// get an instance of express router
const router = express.Router();
import * as deliveryCtrl from './delivery.controller';

//Frontend
// router.route('/requestDeliveryTaxi').post(verifyToken, deliveryCtrl.requestDeliveryTaxi);

export default router;
