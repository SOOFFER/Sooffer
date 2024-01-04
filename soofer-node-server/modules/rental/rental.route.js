// ./express-server/routes/uber.server.route.js
import express from 'express';

const trimRequest = require('trim-request');
const verifyToken = require('../../routes/VerifyToken');
import * as appValidate from '../../validations/appValidate';
var vtAdmin = require('../../routes/VerifyTokenAdmin');

// get an instance of express router
const router = express.Router();
import * as rentalCtrl from './rental.controller';

//Frontend
router.route('/packageListFromAdmin').post(vtAdmin, rentalCtrl.rentalPackageList);
router.route('/packageList').post(rentalCtrl.rentalPackageList);
router.route('/fareEstimation').post(rentalCtrl.rentalFareCalculationAllVehicleType);
router.route('/fareEstimatioSingle').post(rentalCtrl.rentalFareEstimateSingleVehilce);

//APp
router.route('/outstationVehicleList').post(rentalCtrl.outstationVehicleList);
router.route('/outstationVehicleListWithFareFromAdmin').post(vtAdmin, rentalCtrl.outstationVehicleListWithFare);
router.route('/outstationVehicleListWithFare').post(rentalCtrl.outstationVehicleListWithFare);
router.route('/updateRentalConfig').post(rentalCtrl.updateRentalConfig);

export default router;
