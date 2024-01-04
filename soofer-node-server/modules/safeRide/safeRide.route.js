// ./express-server/routes/uber.server.route.js
import express from 'express';

const trimRequest = require('trim-request');
const verifyToken = require('../../routes/VerifyToken');

 import * as appValidate from '../../validations/appValidate';
 import * as appCtrl from '../../controllers/app';

// get an instance of express router
const router = express.Router();
var multer = require('multer');
import path from 'path';
import * as safeRideCtrl from './safeRide.controller';
const safeRideVehicleImages = multer({ dest: 'public/images/safeRideVehicle/' }).array('image',8);


router.route('/ridertaxi').post(safeRideCtrl.addRidertaxisData)   /// adding Rider Taxi details  //

router.route('/suggestionDriver').post(safeRideCtrl.suggestionDriver); /// assaign the Trip for second Driver //

router.route('/tripImages').post(safeRideVehicleImages, safeRideCtrl.imageAdd); /// Trip start and end the rider vehicle image upload ///


module.exports = router;