import express from 'express'; 
import * as companyCtrl from '../controllers/company.controller';
import * as driverCtrl from '../controllers/driver';
import * as appValidate from '../validations/appValidate'; 
import * as commonCtrl from '../controllers/common'; 
import * as getServiceCityController from '../controllers/servicecity.controller';

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
router.route('/company').post(companyCtrl.addCompany).put(companyCtrl.updateCompany);
router.route('/companyProfile').post(companyCtrl.viewCompanyProfile);
router.route('/login').post(companyCtrl.login);
router.route('/logout').get(companyCtrl.logout);

 

export default router;
