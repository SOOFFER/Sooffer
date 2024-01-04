// ./express-server/routes/uber.server.route.js
import express from 'express'; 

const trimRequest = require('trim-request');
const verifyToken = require('../../routes/VerifyToken');
import * as cancelationCtrl from './cancelation.controller';
 
// get an instance of express router
const router = express.Router();

//Frontend
router.route('/cancelationDetails/').get(cancelationCtrl.getData).put(cancelationCtrl.updateData);

export default router;
