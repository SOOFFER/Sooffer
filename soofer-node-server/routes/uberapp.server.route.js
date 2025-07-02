// ./express-server/routes/uber.server.route.js
import express from "express";

const os = require("os");
const trimRequest = require("trim-request");
const verifyToken = require("./VerifyToken");

// File uploading
import path from "path";
var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/");
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
var upload = multer({ storage: storage });
var cpUpload = upload.single("file");
// File uploading

// Rider Profile Image file
var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/");
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
var upload = multer({ storage: storage });
var riderUpload = upload.single("file");
// File uploading

//Driver Profile Image file
var DPIstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/profiles/");
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
var DPIupload = multer({ storage: DPIstorage });
var mDPIupload = DPIupload.single("file");
//Driver Vehicle Image file

//Driver Vehicle Image file
var VIFstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/driverVehicle/");
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
var VIFupload = multer({ storage: VIFstorage });
var mwVIFupload = VIFupload.single("file");
//Driver Vehicle Image file

//Driver Bank Transation Image file
var VBTstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/driverBankTransation/");
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
var VBTFupload = multer({ storage: VBTstorage });
var mwVBTupload = VBTFupload.single("file");
//Driver Bank Transation Image file

//Driver Document Upload
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/driverVehicle/");
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
var upload = multer({ storage: storage });
var docUpload = upload.fields([
  { name: "fileFront", maxCount: 1 },
  { name: "fileBack", maxCount: 1 },
]);
//Driver Document Upload
// var multer = require('multer');
// aws file upload
var awsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/profiles");
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
var awsUpload = multer({ storage: awsStorage });
var awsFileUpload = awsUpload.fields([
  { name: "profileImg", maxCount: 1 },
  { name: "identityImg", maxCount: 1 },
]);

var tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    }
  },
});
var tempUpload = multer({ storage: tempStorage });
var tempFileUploadFaceComparison = tempUpload.fields([
  { name: "identityImg", maxCount: 1 },
]);
const tripstatusImages = multer({ dest: 'public/images/tripstatus/' }).array('imageArray', 4);

//import controller file
// import * as todoController from '../controllers/uber.server.controller';
import * as companyCtrl from "../controllers/company.controller";
import * as adminCtrl from "../controllers/admin";
import * as driverCtrl from "../controllers/driver";
import * as drivertaxiCtrl from "../controllers/drivertaxi";
import * as vehicletypeCtrl from "../controllers/vehicletype";
import * as ridersCtrl from "../controllers/rider";
import * as commonCtrl from "../controllers/common";
import * as tripCtrl from "../controllers/trips";
import * as appCtrl from "../controllers/app";
import * as appOBOReqFlowCtrl from "../controllers/appOBOReqFlow";
import * as stripeCtrl from "../controllers/stripe";
import * as paymentCtrl from "../controllers/paymentGateway/index";
import * as offersCtrl from "../controllers/offers";
import * as getServiceCityController from "../controllers/servicecity.controller";
import * as driverPayPackageCtrl from "../controllers/driverPayPackage";
import * as cmsCtrl from "../controllers/cmsapis";
import * as pagesCtrl from '../controllers/pages';

import * as appValidate from "../validations/appValidate";
import * as packageCtrl from "../controllers/package.controller";
import * as driverBankCtrl from "../controllers/driverBank";
import * as riderSuggestionCtrl from "../helpers/riderSuggesstionHistory";
import * as razorpayCtrl from "../controllers/paymentGateway/razorpay";
import * as imageCtrl from "../modules/imageCollection/image-collection.controller";
import * as functionCntrl from '../controllers/functions' 

// get an instance of express router
const router = express.Router();

//Fire Base
// router.route('/getFb').get(driverCtrl.getFb);
// router.route('/setFb').get(appCtrl.setFb);
router.route("/fcmp").post(appCtrl.fcmp);

// router.route('/seti').get(appCtrl.seti);
// router.route('/stop').get(appCtrl.stop);
router.route("/serverConfigFile").get(commonCtrl.getServerConfigFileForApp);
router
  .route("/filetest/:id?")
  .post(cpUpload, commonCtrl.filetest)
  .put(cpUpload, commonCtrl.filetest);

router.route("/admin").post(adminCtrl.addData).get(adminCtrl.getData);

router.route("/company/delete/:id").delete(companyCtrl.deleteCompany);

router.route("/company/update/:id").put(companyCtrl.updateCompany);

router
  .route("/company")
  .get(companyCtrl.getCompany)
  .post(companyCtrl.addCompany);

router
  .route("/vehicletypelists/:type?")
  .get(verifyToken, vehicletypeCtrl.vehicletypelists);
//Driver
router
  .route("/verifyNumberDriver")
  .post(appValidate.verifyNumberDriver, driverCtrl.verifyNumber);
router
  .route("/driver")
  .post(appValidate.driverAddData, driverCtrl.addData)
  .patch(mDPIupload, appValidate.driverAddData, driverCtrl.addData)
  .get(verifyToken, driverCtrl.getAppData)
  .put(
    verifyToken,
    mDPIupload,
    driverCtrl.updateAppData
  ); /* .put(verifyToken, awsFileUpload, commonCtrl.faceComparison, driverCtrl.updateAppDataWithFaceComparision) */
router.route('/deleteDriver/:id?').delete(driverCtrl.deleteDriverForApp);
router
  .route("/driverAttendance")
  .get(verifyToken, driverCtrl.attendanceList)
  .post(
    tempFileUploadFaceComparison,
    verifyToken,
    commonCtrl.faceComparison,
    driverCtrl.addAttendance
  );
router.route("/checkAttendance").post(verifyToken, driverCtrl.checkAttendance);

router
  .route("/driverRegistration")
  .post(
    awsFileUpload,
    appValidate.driverAddData,
    commonCtrl.faceComparison,
    driverCtrl.addAppData
  );
router
  .route("/driverProfileUpdate")
  .post(verifyToken, mDPIupload, driverCtrl.updateAppData);
// router.route('/driverProfileUpdate').post(verifyToken, awsFileUpload, commonCtrl.faceComparison, driverCtrl.updateAppData);
router
  .route("/driverDocs")
  .post(verifyToken, mwVIFupload, driverCtrl.uploadDriverDocs);
router.route("/driverlogin").post(appValidate.driverLogin, driverCtrl.login);
router.route("/drivertaxi/:id").get(driverCtrl.getAppDrivertaxis);
router
  .route("/drivertaxi")
  .post(driverCtrl.addDrivertaxisData)
  .delete(driverCtrl.deleteAppDrivertaxis)
  .put(driverCtrl.updateAppDrivertaxis);

  router
  .route("/activeTwoDriver").post(driverCtrl.activeTwoDriver)
router
  .route("/drivertaxiImage")
  .put(mwVIFupload, driverCtrl.updateAppDrivertaxiImage);
router
  .route("/driverTaxiDocs")
  .post(mwVIFupload, driverCtrl.uploadDriverTaxiDocs);
router.route("/driverpwd").put(verifyToken, driverCtrl.updatePassword);
router
  .route("/driverBankDetails")
  .get(verifyToken, driverCtrl.driverBankDetails);
router
  .route("/driverBankTransaction")
  .post(verifyToken, driverCtrl.driverBankTransaction);
router
  .route("/driverForgotPassword")
  .post(driverCtrl.driverForgotPassword)
  .patch(driverCtrl.changePasswordByApp);
router
  .route("/driverChangePassword/:code/:id")
  .get(driverCtrl.changePasswordTemplate)
  .post(driverCtrl.changePassword);
router
  .route("/driverResetPassword")
  .post(driverCtrl.driverResetPasswordWithOTP);
router
  .route("/driverActiveTripType")
  .patch(
    verifyToken,
    driverCtrl.driverActiveTripType,
    driverCtrl.enableLowerCategory
  );
router
  .route("/getVehicleServiceAvailablity/:type")
  .get(verifyToken, driverCtrl.getVehicleServiceAvailablity);
router
  .route("/driverWalletReport")
  .get(verifyToken, driverBankCtrl.driverWalletReportApp);
router
  .route("/driverBankReport")
  .get(verifyToken, driverBankCtrl.driverBankReportApp);
router
  .route("/mySubscriptions/:id?")
  .get(verifyToken, driverPayPackageCtrl.mySubscriptions);
router
  .route("/activateDriverSubscription/:id?")
  .post(verifyToken, driverPayPackageCtrl.activateDriverSubscription);
router
  .route("/pushNotificationForDriver")
  .get(verifyToken, commonCtrl.pushNotificationForDriver);
router
  .route("/changeSoftRejectStatus")
  .put(verifyToken, driverCtrl.changeSoftRejectStatus);
//driver docs
router
  .route("/getNeededDocuments/:docFor?/:makeid?")
  .get(verifyToken, driverCtrl.getNeededDocuments);
router
  .route("/docsDriver")
  .get(verifyToken, driverCtrl.getUploadedDriverDocs)
  .post(verifyToken, docUpload, driverCtrl.docsUploadDriver)
  .put(verifyToken, docUpload, driverCtrl.updateUploadedDoc);
router
  .route("/driverTaxisdocs")
  .post(verifyToken, docUpload, driverCtrl.taxisDocs);

//Wallet : Driver Payout
router.route("/listBanks").get(verifyToken, paymentCtrl.getListOfBanks); //Only for paystack supported  bank lists
router.route("/addDriverBank").put(verifyToken, paymentCtrl.addDriverBank);
router
  .route("/driverRequestPayoutTransferAmount")
  .put(verifyToken, paymentCtrl.driverRequestPayoutTransferAmount);
//Earnings
router
  .route("/driverEarningsBtDate")
  .post(verifyToken, driverCtrl.driverEarningsBtDate);
router
  .route("/driverEarningsForMonth")
  .post(verifyToken, driverCtrl.driverEarningsForMonth);
router.route("/adminup").post(cpUpload, adminCtrl.uploadas);

//RIDER
router
  .route("/verifyNumber")
  .post(appValidate.verifyNumberRider, ridersCtrl.verifyNumber);
router.route("/riders").post(appValidate.riderAddData, ridersCtrl.addData);
router
  .route("/riderRegistration")
  .post(
    awsFileUpload,
    appValidate.riderAddData,
    commonCtrl.faceComparison,
    ridersCtrl.addAppData
  );
router.route("/riderslogin").post(appValidate.riderLogin, ridersCtrl.login);
router
  .route("/rider")
  .get(verifyToken, ridersCtrl.getAppData)
  .put(
    verifyToken,
    riderUpload,
    ridersCtrl.updateAppData
  ); /* .put(verifyToken, awsFileUpload, commonCtrl.faceComparison, ridersCtrl.updateAppDataWithFaceComparision); */
router.route('/deleteRider/:id').delete(ridersCtrl.deleteRiderForApp);
router.route("/riderImage").put(verifyToken, cpUpload, ridersCtrl.riderImage);
router
  .route("/riderUpdateVerifiedData")
  .put(verifyToken, ridersCtrl.riderUpdateVerifiedData);
router.route("/rider").post(verifyToken, riderUpload, ridersCtrl.updateAppData);
router.route("/riderpwd").put(verifyToken, ridersCtrl.updatePassword);
router
  .route("/rideremgcontact")
  .post(verifyToken, ridersCtrl.addEmgContact)
  .get(verifyToken, ridersCtrl.getEmgContact)
  .delete(verifyToken, ridersCtrl.delEmgContact)
  .put(verifyToken, ridersCtrl.putEmgContact);
router
  .route("/ridersAddress/:addressId?")
  .post(verifyToken, ridersCtrl.addRidersAddress)
  .delete(verifyToken, ridersCtrl.deleteRiderAddress)
  .get(verifyToken, ridersCtrl.getRidersAddress);
//router.route('/riderForgotPassword').post(ridersCtrl.riderForgotPassword).patch(ridersCtrl.riderResetPassword);
router
  .route("/riderForgotPassword")
  .post(ridersCtrl.riderForgotPassword)
  .patch(ridersCtrl.changePasswordByApp);
router
  .route("/riderChangePassword/:code/:id")
  .get(ridersCtrl.changePasswordTemplate)
  .post(ridersCtrl.changePassword);
router.route("/riderResetPassword").post(ridersCtrl.riderResetPasswordWithOTP);
//router.route('/driverForgotPassword').post(driverCtrl.driverForgotPassword).patch(driverCtrl.driverResetPassword);
router.route("/emergencyMsg").post(verifyToken, ridersCtrl.emergencyMsg);
router
  .route("/pushNotificationForRider")
  .get(verifyToken, commonCtrl.getPushNotificationForRider);
router.route("/ridertaxi/:id").get(ridersCtrl.getAppRidertaxi);
router
  .route("/ridertaxi")
  .post(ridersCtrl.addRidertaxisData)
  .put(ridersCtrl.updateAppRidertaxis);
// router.route('/drivertaxi').get(drivertaxiCtrl.getDrivertaxis).post(drivertaxiCtrl.addData);

//offers
router
  .route("/offersList")
  .get(verifyToken, offersCtrl.showOfferList)
  .post(verifyToken, offersCtrl.showOfferList);

//requestTaxi
router
  .route("/serviceBasicFare/:allvehicle?")
  .post(verifyToken, appCtrl.getServiceBasicfare);
router
  .route("/estimationFare")
  .post(
    verifyToken,
    appValidate.estimationFare,
    appCtrl.getestimationFare,
    appCtrl.getestimationFareMultiDrop
  );
router
  .route("/estimationFareForHailTaxi")
  .post(
    verifyToken,
    appValidate.estimationFareForHailTaxi,
    appCtrl.getestimationFare
  );
router
  .route("/requestTaxi")
  .post(verifyToken, appValidate.requestTaxi, appCtrl.requestTaxi);
router
  .route("/requestHailTaxi")
  .post(
    verifyToken,
    appValidate.requestHailTaxi,
    ridersCtrl.addRiderDataFromHail,
    appCtrl.requestHailTaxi
  );
router.route("/requestTaxiRetry").put(verifyToken, appCtrl.requestTaxiRetry);
router.route("/cancelTaxi").put(verifyToken, appCtrl.cancelTaxi);
router.route("/setCurrentTaxi").put(verifyToken, appCtrl.setCurrentTaxi);
router.route("/setOnlineStatus").put(verifyToken, appCtrl.setOnlineStatus);
router.route("/DriverLocation").put(verifyToken, appCtrl.DriverLocation);
router.route("/declineRequest").put(verifyToken, appCtrl.declineRequest);
router.route("/acceptRequest").put(verifyToken, appCtrl.acceptRequest);
router.route("/cancelTrip").put(verifyToken, appCtrl.cancelTrip);
router.route("/cancelCurrentTrip").put(verifyToken, appCtrl.cancelCurrentTrip);
router
  .route("/tripCurrentStatus")
  .put(verifyToken, appValidate.tripCurrentStatus, appCtrl.tripCurrentStatus);
router
  .route("/tripRequestReceived")
  .patch(verifyToken, appCtrl.tripRequestReceived);
router.route('/tripImages').post(tripstatusImages, imageCtrl.imageAdd);
//verifyToken
router.route("/tripDriverDetails").put(verifyToken, appCtrl.tripDriverDetails);
router.route("/riderFeedback").put(verifyToken, appCtrl.riderFeedback);
router.route("/driverFeedback").put(verifyToken, appCtrl.driverFeedback);
router.route("/clearStatus").put(verifyToken, appCtrl.clearStatus);
router.route("/riderTripHistory").post(verifyToken, appCtrl.riderTripHistory);
router.route("/driverTripHistory").post(verifyToken, appCtrl.driverTripHistory);
router.route("/myRatings").get(verifyToken, appCtrl.myRatings);
router.route("/feedbackLists").get(verifyToken, appCtrl.feedbackLists);
router.route("/myEarnings").post(verifyToken, appCtrl.myEarnings);
router.route("/pastTripDetail").put(verifyToken, appCtrl.pastTripDetail);
router
  .route("/pastTripDetailRider")
  .put(verifyToken, appCtrl.pastTripDetailRider);
router
  .route("/validatePromo")
  .put(verifyToken, appValidate.validatePromo, appCtrl.validatePromo);
router
  .route("/retryNoResponseRequestApp")
  .put(verifyToken, appCtrl.retryNoResponseRequestApp);
router
  .route("/updateDropLocation")
  .put(verifyToken, appCtrl.updateDropLocation);
router.route("/tripPaymentStatus").put(appCtrl.tripPaymentStatus);
router
  .route("/addDriverPackFromApp")
  .post(verifyToken, driverPayPackageCtrl.addDriverPackFromApp);
// router.route('/upo').post(appCtrl.upo);

// Rentals
router
  .route("/requestRentalTaxi")
  .post(verifyToken, appValidate.requestTaxi, appCtrl.requestRentalTaxi);
router
  .route("/requestOutstationTaxi")
  .post(
    verifyToken,
    appValidate.requestOutstationTaxi,
    appCtrl.requestOutstationTaxi
  );

// router.route('/temp').post(appCtrl.temp);
// router.route('/jointest').post(appCtrl.jointest);
// router.route('/testWallet').post(appCtrl.testWallet);

//requestTaxi

//requestScheduleTaxi
router
  .route("/requestScheduleTaxi")
  .post(verifyToken, appCtrl.requestScheduleTaxi);
// router.route('/tess').post(appCtrl.tess);
router
  .route("/riderUpcomingScheduleTaxi")
  .get(verifyToken, appCtrl.riderUpcomingScheduleTaxi);
router
  .route("/userCancelScheduleTaxi")
  .put(verifyToken, appCtrl.userCancelScheduleTaxi);
router
  .route("/driverUpcomingScheduleTaxi")
  .get(verifyToken, appCtrl.driverUpcomingScheduleTaxi);
router
  .route("/acceptScheduleRequest")
  .put(verifyToken, appCtrl.acceptScheduleRequest);
router
  .route("/driverCancelScheduleTaxi")
  .put(verifyToken, appCtrl.driverCancelScheduleTaxi);

router.route("/cronas").get(appCtrl.cronas);
router.route("/getISO").post(appCtrl.getISO);

//requestScheduleTaxi

router
  .route("/driverBankTransactionsLedgerApp")
  .get(verifyToken, driverCtrl.driverBankTransactionsLedgerApp);

//SafeRide
router
  .route("/checkSafeRideEligible")
  .post(verifyToken, appCtrl.checkSafeRideEligible);
router.route("/requestSafeTaxi").post(verifyToken, appCtrl.requestSafeTaxi);
router.route("/safePayment").post(verifyToken, cpUpload, appCtrl.safePayment);

//SafeRide

//Stripe
router.route("/myBalance").get(stripeCtrl.myBalance);
router.route("/createCustomer").post(stripeCtrl.createCustomer);
router.route("/listCustomers").get(stripeCtrl.listCustomers);
router.route("/addAmount").post(stripeCtrl.addAmount);
router.route("/getBankData").get(verifyToken, stripeCtrl.stripeBankDetailsLink);

router.route("/stripeRedirectLink").get(paymentCtrl.stripeRedirectLink); //https://stripe.com/connect/default/oauth/test?code={AUTHORIZATION_CODE}
// http://localhost:3002/api/stripeRedirectLink?code=AUTHORIZATION_CODE&state=userId

//BrainTree
router.route("/bt_client_token").get(paymentCtrl.get_bt_client_token);

//Paytm
router
  .route("/generate_paytm_checksum")
  .post(paymentCtrl.generate_paytm_checksum);

//frimi
// router.route('/generateToken').post(paymentCtrl.generateAccessToken);
// router.route('/registerDirectDebit').post(paymentCtrl.registerDirectDebit);
// router.route('/directDebitPayment').post(paymentCtrl.directDebitPayment);
// router.route('/deRegisterDirectDebit').post(paymentCtrl.deRegisterDirectDebit);

//Wallet : Payment Rider
router.route("/addCard").put(verifyToken, paymentCtrl.addCard);
router.route("/chargeCard").put(stripeCtrl.chargeCard);
router.route("/addToMyWallet").put(verifyToken, appCtrl.addToMyWallet);
router.route("/myWalletHistory").get(verifyToken, appCtrl.myWalletHistory);
router
  .route("/myWalletCreditHistory")
  .get(verifyToken, appCtrl.myWalletCreditHistory);
router
  .route("/myWalletDebitHistory")
  .get(verifyToken, appCtrl.myWalletDebitHistory);
router.route("/myWallet").get(verifyToken, appCtrl.myWallet);
//Stripe Driver Card
router.route("/addDriverCard").put(verifyToken, paymentCtrl.addDriverCard);
router
  .route("/deleteDriverCard")
  .post(verifyToken, paymentCtrl.deleteDriverCard);
router.route("/deleteRiderCard").post(verifyToken, paymentCtrl.deleteRiderCard);

// router.route('/addDriverBank').put(verifyToken,stripeCtrl.myWallet);

//Stripe

//Request
router
  .route("/vehicletype")
  .get(vehicletypeCtrl.getvehicleTypes)
  .post(vehicletypeCtrl.addData);
router
  .route("/getServiceCityDetails")
  .get(getServiceCityController.getServiceCity);

//Common
router.route("/countries").get(commonCtrl.getCountriesForApp);
router.route("/state/:id").get(commonCtrl.getStateForApp);
router.route("/city/:id").get(commonCtrl.getCityForApp);
router.route("/companies").get(commonCtrl.getCompanies);
router.route("/languages").get(commonCtrl.getLanguages);
router.route("/currency").get(commonCtrl.getCurrency);
router.route("/curnlang").get(commonCtrl.getCurnlang);
router.route("/commondata").get(commonCtrl.getCurnlang);
router.route("/carmake").get(commonCtrl.getCarMake);
router.route("/years").get(commonCtrl.getYears);
router.route("/carmakeandyear").get(commonCtrl.getCarMakeAndYear);
router.route("/companyDrivers/:id").get(driverCtrl.getCmpyDrivers);
router.route("/trips/").get(tripCtrl.getTripDetails);
router.route("/tripDetails/:id").get(tripCtrl.getATripDetails);
router.route("/aboutus").get(commonCtrl.sendAboutus);
router.route("/privacypolicy").get(commonCtrl.sendPrivacypolicy);
router.route("/tnc").get(commonCtrl.sendTnc);
router.route("/drivertnc").get(commonCtrl.sendDriverTnc);
router
  .route("/contactUs")
  .post(verifyToken, commonCtrl.contactUs)
  .put(verifyToken, commonCtrl.replyContactUs)
  .get(verifyToken, commonCtrl.viewContactUsHistory);
router.route("/faqTemplate/:ifaqcategorytitle").get(commonCtrl.faqTemplate);

router.route("/logout").get(verifyToken, commonCtrl.logout);

router.route("/db").get(commonCtrl.getDbStatus);
router.route("/rental").post(appCtrl.getRentalPackage);

router.route('/faq/:id?').post(cmsCtrl.addfaq).get(cmsCtrl.getfaq).put(cmsCtrl.updatefaq).delete(cmsCtrl.deletefaq);
router.route('/faqcategory/:id?').post(cmsCtrl.addfaqcategory).get(cmsCtrl.getfaqcategory).put(cmsCtrl.updatefaqcategory).delete(cmsCtrl.deletefaqcategory);
router
  .route("/cityWiseOffice/:id?")
  .get(getServiceCityController.getcityWiseOfficeData);
//Pay Package
router
  .route("/getpayPackage")
  .get(verifyToken, driverPayPackageCtrl.getPackages);
router
  .route("/newDriverBankTransactions")
  .post(verifyToken, mwVBTupload, driverCtrl.newDriverBankTransactions);
// router.route('/newDriverBankTransactions').post(verifyToken, driverCtrl.newDriverBankTransactions);

//Discounts
router.route("/getAvailableDiscounts").get(commonCtrl.getAvailableDiscounts);

//Frontend
router.route("/riderPushToken").put(verifyToken, ridersCtrl.riderPushToken);

//web view
router.route("/webView/helpCategory").get(cmsCtrl.listHelpCategory);
router.route("/webView/helpPage/:id").get(cmsCtrl.listHelpPage);

router
  .route("/riderSuggestionHistory")
  .post(verifyToken, riderSuggestionCtrl.riderSuggestionHistory);
router.route("/citywiseOfficeDetails").get(commonCtrl.getCitywiseOfficeDetails);
router.route("/sendTripReceipt").post(tripCtrl.sendTripReceipt);

router
  .route("/downloadMonthEarnings/:id?/:month?")
  .get(driverCtrl.exportDriverEarningsForMonth);
router
  .route("/sendMonthlyInvoiceMail")
  .post(verifyToken, driverCtrl.sendMonthlyInvoiceEmail);
router
  .route("/exportDailyEarnings/:id?/:date?")
  .get(driverCtrl.exportDailyEarnings);
router
  .route("/createBankAccount")
  .post(verifyToken, razorpayCtrl.createFundAccounts);
router.route("/driverPayouts").post(verifyToken, razorpayCtrl.payouts);
router.route("/createOrder").post(verifyToken, razorpayCtrl.createOrder);
router
  .route("/razorpayWebhook")
  .post(razorpayCtrl.razorpayWebhook)
  .get(razorpayCtrl.razorpayWebhook);

router.route("/faceCompare").post(awsFileUpload, commonCtrl.faceComparison);
router.route("/compareFaces").post(commonCtrl.compareFaces);

router.route("/").get(companyCtrl.getCompany);
router.route("/checkout/:id?").get(paymentCtrl.checkout);
router.route("/checkoutRedirectURL/").get(paymentCtrl.checkoutRedirectURL);
router
  .route("/getCityBoundaryPolygon/:city")
  .get(getServiceCityController.getCityBoundaryPolygon);
// http://10.1.1.31:3001/api/checkoutRedirectURL?clientTransactionId=VQ0H8S9E&msg=Su%20dominio%20no%20esta%20autorizado%20por%20la%20aplicaci%C3%B3n.%20Ingrese%20a%20la%20consola%20de%20developer%20para%20configurar%20correctamente.
router.route("/StripeInvoice").post(ridersCtrl.sendStripeInvoice);
router.route('/addTips').put(verifyToken, appCtrl.addTipsForDriver);
router.route('/sendchatFCM').post(verifyToken,functionCntrl.sendchatFCM)
export default router;
