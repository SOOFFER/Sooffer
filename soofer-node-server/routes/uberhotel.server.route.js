import express from 'express'; 
import * as HotelCtrl from '../controllers/reqFrmHote.controller';
import * as ridersCtrl from '../controllers/rider';
import * as driverCtrl from '../controllers/driver';
import * as appValidate from '../validations/appValidate'; 
import * as commonCtrl from '../controllers/common'; 
import * as getServiceCityController from '../controllers/servicecity.controller';
import * as tripCtrl from '../controllers/trips';

import path from 'path';

var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/')
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  }
});
var upload = multer({ storage: storage });
var cpUpload = upload.single('file');
const router = express.Router();
var vtAdmin = require('./VerifyTokenAdmin');


//common
 
router.route('/hotel').put(cpUpload, HotelCtrl.updateData).post(cpUpload, HotelCtrl.addData);;
router.route('/hotelProfile').post(HotelCtrl.viewHotelProfile);
router.route('/trips').get(vtAdmin,HotelCtrl.getTripDetailsOfHotel);
router.route('/login').post(HotelCtrl.login);
router.route('/logout').get(HotelCtrl.logout);
router.route('/paymentReport').get(vtAdmin,HotelCtrl.hotelPaymentReport);
router.route('/transactionReport').get(vtAdmin,HotelCtrl.hotelTrxReport);
router.route('/balanceForDashBoard').get(vtAdmin,HotelCtrl.hotelPaymentAmount);
router.route('/totalCountForDashBoard').get(vtAdmin,HotelCtrl.hotelTotalTripsCount);
router.route('/tripStatForHotel').get(vtAdmin,HotelCtrl.tripStatForHotel);
export default router;
