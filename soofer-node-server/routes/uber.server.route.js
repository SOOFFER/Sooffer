// ./express-server/routes/uber.server.route.js
import express from 'express';

var vtAdmin = require('./VerifyTokenAdmin');

// File uploading
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

//Driver Profile Image file
var DPIstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/profiles/')
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
var DPIupload = multer({ storage: DPIstorage });
var mDPIupload = DPIupload.single('file');
//Driver Vehicle Image file
//
//Vehicle Type file
var VTstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/vehicle/')
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|svg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  }
});
var VTupload = multer({ storage: VTstorage });
var cpVTUpload = VTupload.single('file');

//CMS Type file
var Cmsstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/cms/')
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
var Cmsupload = multer({ storage: Cmsstorage });
var cmsMW = Cmsupload.single('file');
// File uploading

//Driver Vehicle Image file
var VIFstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/driverVehicle/')
  },
  filename: (req, file, cb) => {
    var filetypes = /jpeg|jpg|png|pdf/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  }
});
var VIFupload = multer({ storage: VIFstorage });
var mwVIFupload = VIFupload.single('file');
//Driver Vehicle Image file

//Import CSV file
var importstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/importCsv/')
  },
  filename: (req, file, cb) => {
    var filetypes = /csv/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  }
});
var importupload = multer({ storage: importstorage });
var mwimportupload = importupload.single('file');
//Import CSV file

//Import JSON file
var jsonstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './locales/temp')
  },
  filename: (req, file, cb) => {
    console.log(file)
    var filetypes = /json/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    console.log(extname)
    if (mimetype && extname) {
      cb(null, file.originalname);
    }
    else {
      return cb(new Error('Only JSON files allowed!'));
    }
  }
});
var jsonupload = multer({ storage: jsonstorage });
var jsonFileupload = jsonupload.single('file');
//Import JSON file

//Document Upload
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/driverVehicle/')
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
var docUpload = upload.fields([{ name: 'fileFront', maxCount: 1 }, { name: 'fileBack', maxCount: 1 }]);
//Document Upload

//CAR IMAGE UPLOAD
var VIPstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/drivervehicleimage/')
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
var VIPupload = multer({ storage: VIPstorage });
var ImgVIPupload = VIPupload.fields([{ name: 'Frontimg', maxCount: 1 }, { name: 'Backimg', maxCount: 1 }, { name: 'Rightimg', maxCount: 1 }, { name: 'Leftimg', maxCount: 1 }]);

//import controller file
// import * as todoController from '../controllers/uber.server.controller';
import * as companyCtrl from '../controllers/company.controller';
import * as appCtrl from '../controllers/app';
import * as adminCtrl from '../controllers/admin';
import * as driverCtrl from '../controllers/driver';
import * as drivertaxiCtrl from '../controllers/drivertaxi';
import * as vehicletypeCtrl from '../controllers/vehicletype';
import * as ridersCtrl from '../controllers/rider';
import * as commonCtrl from '../controllers/common';
import * as cmsCtrl from '../controllers/cmsapis';
import * as tripCtrl from '../controllers/trips';
import * as reportCtrl from '../controllers/reports';
import * as promoCtrl from '../controllers/promocode';
import * as dashboardCtrl from '../controllers/dashboard';
import * as packageCtrl from '../controllers/package.controller';
import * as getServiceCityController from '../controllers/servicecity.controller';
import * as offersCtrl from '../controllers/offers';
import * as driverPayPackageCtrl from '../controllers/driverPayPackage';
import * as dbBackupCtrl from '../controllers/dbBackup';
import * as pagesCtrl from '../controllers/pages';
import * as remoteConfigCtrl from '../controllers/remoteConfig/remoteConfig';
import * as emailCtrl from '../controllers/email.controller';
import * as expiryNotificationCtrl from '../controllers/expiryNotification';
import * as driverBankCtrl from '../controllers/driverBank';
import * as firebaseCtrl from '../controllers/firebaseFunction';
import * as appValidate from '../validations/appValidate';
import * as HotelCtrl from '../controllers/reqFrmHote.controller';
import * as ImportFromExcelCtrl from '../controllers/importFromExcel';
import * as paymentCtrl from '../controllers/paymentGateway/index';
import * as rentalCtrl from '../modules/rental/rental.controller';
import * as razorpayCtrl from '../controllers/paymentGateway/razorpay';
import * as zoneCtrl from '../controllers/zoneCtrl';

// get an instance of express router
const router = express.Router();

//Activation Key
router.route('/activationKey').post(commonCtrl.activeKeyFirst);
router.route('/checkKey').get(commonCtrl.checkProductKey);
router.route('/verifyProductKey').get(commonCtrl.verifyKeyForAdmin);

//menus
router.route('/pagesMenu').post(pagesCtrl.addMenuSettings).put(pagesCtrl.editMeunsSettings);
router.route('/getMenu').post(vtAdmin, pagesCtrl.getMenuSettings).get(pagesCtrl.getMenuList);

//Hotel Menu
router.route('/hotel/:id?').post(cpUpload, HotelCtrl.addData).get(HotelCtrl.getData).put(cpUpload, HotelCtrl.updateData).delete(HotelCtrl.deleteData);

//Admin Menu
router.route('/admin/:id?').post(adminCtrl.addData).get(vtAdmin, adminCtrl.getData).put(vtAdmin, adminCtrl.updatePassword).patch(vtAdmin, adminCtrl.updateAdmin).delete(adminCtrl.deleteAdmin);
router.route('/adminstatus/:id?').patch(vtAdmin, adminCtrl.adminstatus);
router.route('/adminupdate/:id?').post(vtAdmin, adminCtrl.updateAdmin);
router.route('/updateAdmin/:id?').put(adminCtrl.adminupdate);
router.route('/login').post(adminCtrl.login);
router.route('/logout').get(adminCtrl.logout);
router.route('/adminProfile/:id?').get(vtAdmin, adminCtrl.viewAdminProfile);
router.route('/forgotPassword').put(adminCtrl.checkAdminEmail);
router.route('/changePassword/:id').get(adminCtrl.passwordTemplate).post(adminCtrl.addNewPassword);
router.route('/adminPushToken').put(vtAdmin, adminCtrl.adminPushToken);
router.route('/testToken').get(adminCtrl.testToken);

//Company Menu
router.route('/company/:id?').get(/* vtAdmin, */companyCtrl.getCompany).post(companyCtrl.addCompany).put(companyCtrl.updateCompany).delete(companyCtrl.deleteCompany);

//Driver Menu
router.route('/driver/:id?').post(appValidate.driverAddData, driverCtrl.addData).get(vtAdmin, driverCtrl.getData).put(driverCtrl.updateData).delete(driverCtrl.deleteData);
router.route('/deleteDriver/:id?').delete(driverCtrl.deleteDriver);
router.route('/driverActivate/:id?').put(driverCtrl.driverActivate);
router.route('/driverOnlineGps').get(vtAdmin, driverCtrl.getOnlineDriverLocNtUpdate);
router.route('/driverNic/:nicNo').get(driverCtrl.checkNic);
router.route('/driverOnline').get(vtAdmin, driverCtrl.getOnlineDriver);
router.route('/driverResetPasswordFromAdmin/:type?').post(driverCtrl.driverResetPasswordFromAdmin);
// router.route('/checkDriverAttendance').post(driverCtrl.checkAttendance);
// router.route('/driverDocs').post(mwVIFupload, driverCtrl.uploadDriverDocs);
router.route('/getNeededDocuments/:id?').get(driverCtrl.getNeededDocumentsForAdmin);
router.route('/driverDocs/:id?').post(docUpload, driverCtrl.docsUploadDriver);
router.route('/driverTaxisdocs/:id?').post(vtAdmin, docUpload, driverCtrl.taxisDocs);
router.route('/driverlogin').post(driverCtrl.login);
router.route('/checkCodeAvail').post(driverCtrl.checkCodeAvail);
router.route('/drivertaxi').get(driverCtrl.getDrivertaxis).post(driverCtrl.addDrivertaxisData).put(driverCtrl.updateDrivertaxis);

router
.route("/activeTwoDriver").post(driverCtrl.activeTwoDriver)

router.route('/drivertaxiImage').put(mwVIFupload, driverCtrl.updateAppDrivertaxiImage);
router.route('/drivertaxi/:id?/:dId?').delete(driverCtrl.deleteDrivertaxis);
router.route('/drivertaxistatus').put(driverCtrl.putDrivertaxisStatus); //verify token
router.route('/driverProofStatus').put(driverCtrl.driverProofStatus); //verify token
router.route('/driverTaxiDocs').post(mwVIFupload, driverCtrl.uploadDriverTaxiDocs); 
router.route('/driverTaxiimages').post(ImgVIPupload, driverCtrl.taxisImagesDocs); 
router.route('/driverBankTransactions').get(vtAdmin, driverCtrl.getDriverBankTransactions).post(driverCtrl.approveDriverBankTransactions);
// router.route('/newDriverBankTransactions').post(driverCtrl.approveDriverBankTransactions);
router.route('/driverBankTransactionsLedger/:id').get(driverCtrl.getDriverBankTransactionsLedger);
router.route('/setCurrentTaxi/:id?').post(driverCtrl.setCurrentTaxi);
router.route('/setOnlineStatus').put(driverCtrl.setOnlineStatus);
router.route('/setBulkOnlineStatus').put(driverCtrl.setBulkOnlineStatus);
router.route('/setinactivedrivers').put(driverCtrl.setinactivedrivers);
router.route("/minimumBalance").get(driverCtrl.getMinimumBalance).put(driverCtrl.putMinimumBalance);
router.route('/driverRejected').post(driverCtrl.driverRejected);
router.route('/driverpending').get(vtAdmin, driverCtrl.pendingData);
router.route('/driverinactive').get(vtAdmin, driverCtrl.driverinactive);
router.route('/driveraccepted').post(driverCtrl.driverAccepted);
router.route("/getAllDriversForMTD").get(vtAdmin, driverCtrl.getAllDriversForMTD);
router.route("/SetVerifiedTrue/:id?").put(driverCtrl.transactionVerified);
router.route("/addProfile").post(mDPIupload, driverCtrl.profileImageAdd);
// router.route('/addNewVehicleType').put(driverCtrl.addNewVehicleType);
router.route('/driverUpdateHailTripType').patch(vtAdmin, driverCtrl.driverUpdateHailTripType);
router.route('/taxiApproveStatus').put(driverCtrl.taxiApproveStatus);
// router.route('/driverBankDetail/:id?').get(driverCtrl.driverBankDetail);
router.route('/driverBankDetail/:id?').post(paymentCtrl.addDriverBankDetailForAdmin).get(paymentCtrl.viewDriverBankDetailForAdmin);
router.route('/updateDriverPhone').put(driverCtrl.updateDriverPhone);
router.route('/driverActiveTripType').patch(vtAdmin, driverCtrl.driverActiveTripTypeFromAdmin, driverCtrl.driverActiveTripType);
router.route('/driverWalletType').put(driverCtrl.updateDriverWalletType);
router.route('/softReject/:id?').put(driverCtrl.softReject);
router.route('/softRejectedDrivers').get(vtAdmin, driverCtrl.softRejectedDrivers);

//Trips
router.route('/trips/').get(vtAdmin, tripCtrl.getTripDetails);
router.route('/ongoingTrips/').get(vtAdmin, tripCtrl.ongoingTrips);
router.route('/noResponseTrips/').get(vtAdmin, tripCtrl.noResponseTrips);
router.route('/upcomingTrips/').get(vtAdmin, tripCtrl.upcomingTrips);
router.route('/pastTrips/').get(vtAdmin, tripCtrl.pastTrips);
router.route('/cardPaymentFailedTrips/').get(vtAdmin, tripCtrl.cardPaymentFailedTrips);
router.route('/tripDetails/:id?').get(tripCtrl.getATripDetails).delete(tripCtrl.deleteATripDetails);
router.route('/getATripDetailsForDetailView/:id').get(tripCtrl.getATripDetailsForDetailView);
router.route('/updateTripAmount/').put(tripCtrl.updateTripAmount);
router.route('/tripRequestedDrivers/:id').get(tripCtrl.tripRequestedDrivers);
router.route('/endTripFareEstimationFromAdmin').post(appValidate.tripCurrentStatus, appCtrl.endTripFareEstimationFromAdmin);
router.route('/endTripFromAdmin').post(appCtrl.tripCurrentStatus);
router.route('/startTripFromAdmin').post(appCtrl.tripCurrentStatus);
router.route('/hailTrips/').get(vtAdmin, tripCtrl.hailTrips);
router.route('/deliveryTripRequest/:id').get(tripCtrl.deliveryTripRequest);
router.route('/refreshFinishedTrips/').post(appCtrl.refreshFinishedTrips);

router.route('/rider').get(vtAdmin, ridersCtrl.getData);
router.route('/scheduletrips').get(vtAdmin, tripCtrl.getScheduletrips);
router.route('/pendingRequest').get(tripCtrl.pendingRequest);
router.route('/recentMTDRequest').get(vtAdmin, tripCtrl.recentMTDRequest);
router.route('/sendTripReceipt').post(tripCtrl.sendTripReceipt);

//Promocode
router.route('/promocode/:id?').post(promoCtrl.addData).get(vtAdmin, promoCtrl.getData).put(promoCtrl.updateData).delete(promoCtrl.deleteData);
router.route('/updatePromoCodeNumUsedLogctrl/:id?').get(promoCtrl.updatePromoCodeNumUsedLogctrl);
router.route('/validatePromo').put(vtAdmin, appValidate.validatePromo, appCtrl.validatePromo);

//Review Detail
router.route('/driverReview/:id?').get(vtAdmin, commonCtrl.getDriverReview).delete(commonCtrl.deleteDriverReview);
router.route('/riderReview/:id?').get(vtAdmin, commonCtrl.getRiderReview).delete(commonCtrl.deleteRiderReview);
router.route('/riderRating/:id?').get(vtAdmin, ridersCtrl.getRiderRating);
router.route('/driverRating/:id?').get(vtAdmin, driverCtrl.getDriverRating);

//RIDER
router.route('/riders').post(appValidate.riderAddData, cpUpload, ridersCtrl.addData);
router.route('/riderslogin').post(ridersCtrl.login);
router.route('/rider/:id?').get(ridersCtrl.getData).put(ridersCtrl.updateData).delete(ridersCtrl.deleteData);
router.route('/deleteRider/:id').delete(ridersCtrl.deleteRider);
router.route('/riderResetPasswordFromAdmin').post(ridersCtrl.riderResetPasswordFromAdmin);
router.route('/riderById/:id?').get(ridersCtrl.riderById);
router.route('/riderActivate/:id?').put(ridersCtrl.riderActivate);
router.route('/addWalletSettlement/:id?').post(ridersCtrl.addWalletSettlementData);

//MTD
router.route('/serviceBasicFare/:allvehicle?').post(vtAdmin, appCtrl.getServiceBasicfare);
router.route('/checkPhoneAvail').post(ridersCtrl.checkPhoneAvail);
router.route('/getNearByDrivers').post(driverCtrl.getNearByDrivers);
router.route('/getDriverTypeahead').post(driverCtrl.getDriverTypeahead);
router.route('/estimationFare').post(appCtrl.getestimationFare);
router.route('/requestTaxiFromMTD').post(vtAdmin, driverCtrl.checkDriverHasThatServiceMTD, ridersCtrl.addRiderDataFromMTD, appValidate.requestTaxi, appCtrl.requestTaxi);
// Rentals
router.route('/requestRentalTaxiFromMTD').post(vtAdmin, driverCtrl.checkDriverHasThatServiceMTD, ridersCtrl.addRiderDataFromMTD, appValidate.requestTaxi, appCtrl.requestRentalTaxi);
router.route('/requestOutstationTaxiFromMTD').post(vtAdmin, driverCtrl.checkDriverHasThatServiceMTD, ridersCtrl.addRiderDataFromMTD, appValidate.requestOutstationTaxi, appCtrl.requestOutstationTaxi);
// router.route('/cancelCurrentTrip').put(vtAdmin, appCtrl.cancelCurrentTrip);
router.route('/cancelCurrentTrip').put(vtAdmin, appCtrl.cancelCurrentTripFromAdmin);

router.route('/requestScheduleTaxiFromMTD').post(appCtrl.requestScheduleTaxiFromMTD);
router.route('/requestTaxiRetry').put(vtAdmin, appValidate.requestTaxiRetry, appCtrl.requestTaxiRetry);

//package
router.route('/package').post(packageCtrl.addPackage).get(packageCtrl.viewPackage)

// router.route('/drivertaxi')
// .get(drivertaxiCtrl.getDrivertaxis)
// .post(drivertaxiCtrl.addData);
router.route('/vehicletype/:id?').get(vtAdmin, vehicletypeCtrl.getvehicleTypes).post(cpVTUpload, vehicletypeCtrl.addData).delete(vehicletypeCtrl.deleteData).patch(cpVTUpload, vehicletypeCtrl.patchBasicData);
router.route('/vehicletypeupdate/:id/:patchFor').patch(vehicletypeCtrl.patchData);
router.route('/vehicletypeSurge/:id/:patchFor').patch(vehicletypeCtrl.vehicletypeSurge);
router.route('/vehicleDistanceData/:id/:distanceId?').put(vehicletypeCtrl.distanceData).patch(vehicletypeCtrl.patchdistanceData).delete(vehicletypeCtrl.deletedistanceData);
router.route('/vehicleDistanceOfferData/:id/:distanceId?').put(vehicletypeCtrl.putdistanceOfferData).patch(vehicletypeCtrl.patchdistanceOfferData);
router.route('/vehicleDetails/:id?').get(/* vtAdmin,  */vehicletypeCtrl.getvehicleDetails).post(cpVTUpload, vehicletypeCtrl.addVehicleDetailsData).delete(vehicletypeCtrl.deleteVehicleDetailsData).put(cpVTUpload, vehicletypeCtrl.patchBasicVehicleDetailsData);
router.route('/getVechicleName/:type?/:scity?').get(vtAdmin, vehicletypeCtrl.getVehicleName);
//Common
// The following three api services are used for get countries, states and cities which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.
router.route('/countries/:id?').get(commonCtrl.getCountries);
router.route('/state/:id?').get(commonCtrl.getState);
router.route('/city/:id?').get(commonCtrl.getCity);
// The above three api services are used for get countries, states and cities which used in "Add Driver", "Add Rider" pages under admin ui. Please don't change anything including response format.

router.route('/countriesForAdminUiCRUD/:id?').get(commonCtrl.getCountriesForAdminUiCRUD).post(commonCtrl.addCountriesForAdminUiCRUD).put(commonCtrl.updateCountriesForAdminUiCRUD).delete(commonCtrl.deleteCountriesForAdminUiCRUD);
router.route('/statesForAdminUiCRUD/:id?').get(commonCtrl.getStatesForAdminUiCRUD).post(commonCtrl.addStatesForAdminUiCRUD).put(commonCtrl.updateStatesForAdminUiCRUD).delete(commonCtrl.deleteStatesForAdminUiCRUD);
router.route('/citiesForAdminUiCRUD/:id?').get(commonCtrl.getCitiesForAdminUiCRUD).post(commonCtrl.addCitiesForAdminUiCRUD).put(commonCtrl.updateCitiesForAdminUiCRUD).delete(commonCtrl.deleteCitiesForAdminUiCRUD);

router.route('/companies').get(commonCtrl.getCompanies);
router.route('/languages').get(commonCtrl.getLanguages);
router.route('/currency').get(commonCtrl.getCurrency);
router.route('/curnlang').get(commonCtrl.getCurnlang);
router.route('/commondata').get(commonCtrl.getCurnlang);
router.route('/carmake/:id?').get(commonCtrl.getCarMake).post(commonCtrl.addCarMake).put(commonCtrl.updateCarMake).delete(commonCtrl.delCarMake);
router.route('/delcarmake').post(commonCtrl.delCarMake);
router.route('/carmodel').put(commonCtrl.addCarmodel);
router.route('/years').get(commonCtrl.getYears);
router.route('/companyDrivers/:id').get(driverCtrl.getCmpyDrivers);
router.route('/allvehicletypes').get(vtAdmin, commonCtrl.getallvehicletypes);
router.route('/config').get(commonCtrl.viewConfig).put(commonCtrl.updateConfig)
router.route('/updateServerConfigFile').get(commonCtrl.getServerConfigFile).post(commonCtrl.updateServerConfigFile);
router.route('/search').get(vtAdmin, commonCtrl.viewSearch)
router.route('/referalSettings').get(commonCtrl.referalSettings).put(commonCtrl.updateReferalSettings);
router.route('/featuresSettings').get(commonCtrl.getFeaturesSettings).put(commonCtrl.updateFeaturesSettings);

router.route('/currencyForAdminUiCRUD/:id?').get(commonCtrl.getCurrencyForAdminUiCRUD).post(commonCtrl.addCurrencyForAdminUiCRUD).put(commonCtrl.updateCurrencyForAdminUiCRUD).delete(commonCtrl.deleteCurrencyForAdminUiCRUD);
router.route('/languagesForAdminUiCRUD/:id?').get(commonCtrl.getLanguagesForAdminUiCRUD).post(commonCtrl.addLanguagesForAdminUiCRUD).put(commonCtrl.updateLanguagesForAdminUiCRUD).delete(commonCtrl.deleteLanguagesForAdminUiCRUD);
router.route('/yearsForAdminUiCRUD/:id?').get(commonCtrl.getYearsForAdminUiCRUD).post(commonCtrl.addYearsForAdminUiCRUD).put(commonCtrl.updateYearsForAdminUiCRUD).delete(commonCtrl.deleteYearsForAdminUiCRUD);
router.route('/colorForAdminUiCRUD/:id?').get(commonCtrl.getColorForAdminUiCRUD).post(commonCtrl.addColorForAdminUiCRUD).put(commonCtrl.updateColorForAdminUiCRUD).delete(commonCtrl.deleteColorForAdminUiCRUD);
router.route('/contactUs').get(vtAdmin, commonCtrl.getContactUs).patch(commonCtrl.statusUpdate).put(commonCtrl.replyContactUs);
router.route('/helper/lable').get(commonCtrl.getLableHelper).post(commonCtrl.addLableHelper);

//Utility
router.route('/sendPushNotifyBulk/:forType?').post(commonCtrl.sendPushNotifyBulk);
router.route('/getPushNotification').get(commonCtrl.getPushNotification);
router.route('/getSmsNotification').get(commonCtrl.getSmsNotification);
router.route('/faqTemplate/:ifaqcategorytitle').get(commonCtrl.faqTemplate); //v2TODO check
router.route('/alertSetting').get(commonCtrl.alertSetting).put(commonCtrl.updateAlertData); //Cancel reason
router.route('/seosettings').get(commonCtrl.getseosettings).put(commonCtrl.updateseosettings).post(commonCtrl.addseosettings); //Cancel reason

//Utility = Frontend CMS
router.route('/homecontent').post(cmsCtrl.addhomecontent);
router.route('/homeFirstBlock').post(cmsMW, cmsCtrl.updatehomeFirstBlock);
router.route('/homeSecondBlock').post(cmsMW, cmsCtrl.updatehomeSecondBlock);
router.route('/homeThirdBlock').post(cmsMW, cmsCtrl.updatehomeThirdBlock);
router.route('/gethomecontent/:language?').get(cmsCtrl.gethomecontent);
router.route('/faq/:id?').post(cmsCtrl.addfaq).get(cmsCtrl.getfaq).put(cmsCtrl.updatefaq).delete(cmsCtrl.deletefaq);
router.route('/help/:id?').post(cmsCtrl.addhelp).get(cmsCtrl.gethelp).put(cmsCtrl.updatehelp).delete(cmsCtrl.deletehelp);
router.route('/faqcategory/:id?').post(cmsCtrl.addfaqcategory).get(cmsCtrl.getfaqcategory).put(cmsCtrl.updatefaqcategory).delete(cmsCtrl.deletefaqcategory);
router.route('/helpcategory/:id?').post(cmsCtrl.addhelpcategory).get(cmsCtrl.gethelpcategory).put(cmsCtrl.updatehelpcategory).delete(cmsCtrl.deletehelpcategory);
router.route('/pages/:language?').post(cmsCtrl.addPageContent).get(cmsCtrl.getPageContent).put(cmsCtrl.updatePageContent);
router.route('/ourDrivers/:id?').post(cmsMW, cmsCtrl.addOurDriver).get(cmsCtrl.getOurDriver).put(cmsMW, cmsCtrl.updateOurDriver).delete(cmsCtrl.deleteOurDriver);
router.route('/getPages/:type?/:language?').get(cmsCtrl.getSections);
router.route('/getCatagory/:id?/:language?').get(cmsCtrl.getCatsFaq);
router.route('/getHelpCatagory/:id?/:language?').get(cmsCtrl.getCatshelp);
router.route('/webContactUs').post(cmsCtrl.webContactUs);
router.route('/footerSection').post(cmsCtrl.updateFooter);
router.route('/serviceAvailable/:triptype?').get(vehicletypeCtrl.serviceAvailable);
router.route('/ourVehicles/:id?').put(cpVTUpload, vehicletypeCtrl.patchourVehicles);
router.route('/serviceCities').get(pagesCtrl.getServiceCities);
router.route('/whatweoffer/:triptype?').get(vehicletypeCtrl.whatweoffer);
router.route('/whatweofferfrontend/:triptype?').get(vehicletypeCtrl.whatweofferfrontend);
//Localization menu

//Reports
router.route('/hotelPayReport').get(HotelCtrl.hotelPaymentReportForAdmin);
router.route('/driverPayReport/:type?').get(vtAdmin, reportCtrl.driverPayReport);
router.route('/paymentReportDaily').get(vtAdmin, reportCtrl.paymentReportDaily);
router.route('/driverPayReportDailyFormat/:type?').get(vtAdmin, reportCtrl.driverPayReportDailyFormat);
router.route('/paymentReport').get(vtAdmin, reportCtrl.paymentReport);
router.route('/driverPayReportSingle/:id').get(reportCtrl.driverPayReportSingle);
router.route('/markSettledDvrPayment').post(reportCtrl.markSettledDvrPayment);
router.route('/canceledTrips').get(reportCtrl.canceledTrips);
router.route('/tripStatus').get(vtAdmin, reportCtrl.tripStatus);
router.route('/tripStatusDaily').get(vtAdmin, reportCtrl.tripStatusDaily);
router.route('/tripTypes').get(vtAdmin, reportCtrl.tripTypes);
router.route('/tripTypesDaily').get(vtAdmin, reportCtrl.tripTypesDaily);
router.route('/referrer').get(reportCtrl.referrer);
router.route('/userWallet').get(vtAdmin, reportCtrl.userWallet);
router.route('/tripTimeVariance').get(reportCtrl.tripTimeVariance);
router.route('/logReport').get(reportCtrl.logReport);
router.route('/driverEarnings').get(reportCtrl.driverEarnings);
router.route('/packagePurchaseHistory').get(vtAdmin, reportCtrl.packagePurchaseHistory);
router.route('/tripBookedBy').get(vtAdmin, reportCtrl.tripBookedBy);
router.route('/tripBookedByDaily').get(vtAdmin, reportCtrl.tripBookedByDaily);
router.route('/driverListsForExport').get(vtAdmin, driverCtrl.driverListsForExport);
router.route('/driverWalletReport/:id?').get(driverBankCtrl.driverWalletReport);
router.route('/driverBankReport/:id?').get(driverBankCtrl.driverBankReport);
router.route('/deliveryReport').get(vtAdmin, reportCtrl.deliveryReport);
router.route('/deliveryTrip').get(vtAdmin, reportCtrl.deliveryTrip);
// router.route('/subscriptionHistory').get(driverPayPackageCtrl.getExpiryPackOfSubscription);
router.route('/subscriptionHistory').get(vtAdmin, reportCtrl.subscriptionReport);
router.route('/perDayOnlineReport').get(vtAdmin, reportCtrl.perDayOnlineReport);
router.route('/driverOnlineStatusReport/:id?').get(vtAdmin, reportCtrl.driverOnlineStatusReport);
router.route('/discountCreditReport/:id?').get(vtAdmin, reportCtrl.discountCreditReport)
router.route('/driverTripStatusReport').get(vtAdmin, reportCtrl.driverTripStatusReport);
router.route('/driverDistanceReport').get(vtAdmin, reportCtrl.distanceTravelledReport);
router.route('/walletRechargReport').get(vtAdmin, reportCtrl.walletRechargReport);

//dashboard
router.route('/dashboardPanel1').get(vtAdmin, dashboardCtrl.dashboardPanel1);
router.route('/dashboardPanel2').get(dashboardCtrl.dashboardPanel2);
router.route('/recentUsers').get(vtAdmin, dashboardCtrl.recentUsers);
router.route('/activeUsers').get(vtAdmin, dashboardCtrl.activeUsers);
router.route('/revenueStat').get(vtAdmin, dashboardCtrl.revenueStat);
router.route('/tripStat').get(vtAdmin, dashboardCtrl.tripStat); //Dashboard Chart
router.route('/tripCountStat').get(vtAdmin, dashboardCtrl.tripCountStat);
router.route('/riderCountStat').get(vtAdmin, dashboardCtrl.riderCountStat);
router.route('/heatMap').get(vtAdmin, dashboardCtrl.heatMap);
router.route('/godView/:type?').get(vtAdmin, dashboardCtrl.godView);
router.route('/driverTracking/:type?').get(vtAdmin, dashboardCtrl.driverTracking);
router.route('/lowRatingUsers').get(vtAdmin, dashboardCtrl.lowRatingUsers);
router.route('/complaints').get(vtAdmin, dashboardCtrl.ClientComplaints);
router.route('/totaltrips/').get(vtAdmin, dashboardCtrl.getTotalTripDetails);
router.route('/tripEarningReport/:filterType?').get(vtAdmin, dashboardCtrl.getTripEarningReport);

//Offers
router.route('/offers/:id?').post(cpUpload, offersCtrl.addData).put(cpUpload, offersCtrl.updateData).delete(offersCtrl.deleteData).get(vtAdmin, offersCtrl.currentOfferList);
router.route('/expireOffers').get(vtAdmin, offersCtrl.expiredOfferList);

//dashboard

//Driver Payment Packages
router.route('/initalPackageDetails/').get(driverPayPackageCtrl.getinitalPackageDetails);
router.route('/payPackage/:id?').post(driverPayPackageCtrl.addData).get(vtAdmin, driverPayPackageCtrl.getData).put(driverPayPackageCtrl.updateData).delete(driverPayPackageCtrl.deleteData);
router.route('/driverPackage/:id?').post(driverPayPackageCtrl.addDriverPack).get(driverPayPackageCtrl.getDriverPack).delete(driverPayPackageCtrl.deleteDriverPack);
router.route('/driverPackageHistory/:id?').get(driverPayPackageCtrl.driverPackageHistory);
router.route('/getDrivers').get(vtAdmin, driverPayPackageCtrl.getAllDrivers);
router.route('/getCmpyDrivers').get(vtAdmin, driverPayPackageCtrl.getCompyDrivers);
router.route('/getpayPackage').get(driverPayPackageCtrl.getAllPackage);
router.route('/getSubPackage/:vehicletype?').get(driverPayPackageCtrl.getSubReqPackage);
router.route('/getComPackage').get(driverPayPackageCtrl.getComReqPackage);
router.route('/packageValidity').post(driverPayPackageCtrl.SubscriptionValidity);
router.route('/SelectedPack/:id?').get(driverPayPackageCtrl.getSelectedPackage);
router.route('/driverSubscription/:id?').post(vtAdmin, driverPayPackageCtrl.addDriverSubscription).get(vtAdmin, driverPayPackageCtrl.getDriverSubscription);
router.route('/activateDriverSubscription/:id?').post(vtAdmin, driverPayPackageCtrl.activateDriverSubscription);
router.route('/driverSubscriptionSingle/:id?').get(vtAdmin, driverPayPackageCtrl.driverSubscriptionSingle);
router.route('/getSubcriptionValidityDate').post(vtAdmin, driverPayPackageCtrl.getSubcriptionValidityDate);
router.route('/deactivateDriverSubscription/:id?').post(vtAdmin, driverPayPackageCtrl.deactivateDriverSubscription);
router.route('/getDriverVehicleList/:id?').get(driverPayPackageCtrl.getDriverVehicleList);
//serviceAvailableCity
router.route('/AvailbleserviceCity').get(vtAdmin, getServiceCityController.getAvailableServiceCity);// Its for ng-select dropdown. Because, ng-select needed a different structure of response json.
router.route('/getCityBoundaryPolygonForANewCity').get(getServiceCityController.getCityBoundaryPolygonForANewCity);
router.route('/addServiceAvailableCity').post(getServiceCityController.addServiceAvailableCity);
router.route('/serviceAvailableCityNearby/:id/:nearbyId?').post(getServiceCityController.serviceAvailableCityNearby).delete(getServiceCityController.delServiceAvailableCityNearby);
router.route('/updateServiceAvailableCity').put(getServiceCityController.updateServiceAvailableCity);
router.route('/deleteServiceAvailableCity/:_id').delete(getServiceCityController.deleteServiceAvailableCity);
router.route('/getCityBoundaryPolygon/:city').get(getServiceCityController.getCityBoundaryPolygon).put(getServiceCityController.updateCityBoundaryPolygon);
router.route('/getOuterBoundaryPolygon/:city').get(getServiceCityController.getOuterPolygon).put(getServiceCityController.updateOuterPolygon);
router.route('/getServiceCityDetails').get(getServiceCityController.getServiceCity);
router.route('/cityWiseOffice/:id?').get(getServiceCityController.getcityWiseOfficeData).post(getServiceCityController.addcityWiseOfficeData).delete(getServiceCityController.deletecityWiseOfficeData).put(getServiceCityController.updatecityWiseOfficeData);
router.route('/cityWiseConfig/:id?').get(getServiceCityController.getcityWiseConfigData).post(getServiceCityController.addcityWiseConfigData).delete(getServiceCityController.deletecityWiseConfigData).put(getServiceCityController.updatecityWiseConfigData);
//serviceAvailableCity

//database backup
router.route('/dbbackup/:id?').post(dbBackupCtrl.addDbBackup).get(dbBackupCtrl.viewDbBackup).delete(dbBackupCtrl.deleteDbBackup);

//html pages
router.route('/about/:language?').get(pagesCtrl.sendAboutus).put(pagesCtrl.updateAboutus);
router.route('/privacypolicy/:language?').get(pagesCtrl.sendPrivacypolicy).put(pagesCtrl.updatePrivacypolicy)
router.route('/tnc/:language?').get(pagesCtrl.sendTnc).put(pagesCtrl.updateTnc);
router.route('/ridertnc/:language?').get(pagesCtrl.sendRiderTnc).put(pagesCtrl.updateRiderTnc);//For Driver TNC not Rider

//Email Templates
router.route('/email/:language?').post(emailCtrl.addEmail).put(emailCtrl.editEmail).get(emailCtrl.viewEmail);
router.route('/sentEmail').post(emailCtrl.sentEmail);
router.route('/mail').post(emailCtrl.questionPost).put(emailCtrl.answerPost).get(emailCtrl.viewUnread);

//remote config
router.route('/remoteConfig').get(remoteConfigCtrl.getTemplate).post(remoteConfigCtrl.publishTemplate);

//expiry notification
router.route('/driverExpiryDoc').get(vtAdmin, expiryNotificationCtrl.driverExpiryDoc).post(expiryNotificationCtrl.sentExpiryNotificationDriver);

router.route("/sendEmailDL").post(expiryNotificationCtrl.sendEmailDL) 

router.route('/taxiExpiryDoc').get(vtAdmin, expiryNotificationCtrl.taxiExpiryDoc).post(expiryNotificationCtrl.sentExpiryNotificationTaxi);
router.route('/blockExpiryDriver').put(expiryNotificationCtrl.blockExpiryDriver);
router.route('/blockExpiryTaxis').put(expiryNotificationCtrl.blockExpiryTaxis);

//admin settlement
router.route('/settlement/:id?').post(driverBankCtrl.addData).get(driverBankCtrl.getData);
router.route('/driverWallet/:id?').get(driverBankCtrl.getDriverWallet);
router.route('/hotelsettlement/:id?').post(HotelCtrl.addTransaction).get(HotelCtrl.getDataofHotel);
//firebase
router.route('/riderCancelReason/:value?').get(firebaseCtrl.getrRiderCancelReasonFB).post(firebaseCtrl.addRiderCancelReasonFB).put(firebaseCtrl.updateRiderCancelReasonFB).delete(firebaseCtrl.deleteRiderCancelReasonFB);
router.route('/driverCancelReason/:value?').get(firebaseCtrl.getDriverCancelReasonFB).post(firebaseCtrl.addDriverCancelReasonFB).put(firebaseCtrl.updateDriverCancelReasonFB).delete(firebaseCtrl.deleteDriverCancelReasonFB);
router.route('/alertLabel').get(firebaseCtrl.getAlertLabels).put(firebaseCtrl.updateAlertLabels);
router.route('/firebaseValues/:forNode/:value?').get(firebaseCtrl.getFBValues).post(firebaseCtrl.addFBValues).put(firebaseCtrl.updateFBValues).delete(firebaseCtrl.deleteFBValues);

//Test Tools
router.route('/testThirdParty/:testFor').post(commonCtrl.testThirdParty);
router.route('/ridersForNotificationTest/:id?').get(ridersCtrl.ridersForNotificationTest);

router.route('/shareMyLocation/:id').get(commonCtrl.shareMyLocation);

//rental
router.route('/rental/:id?').post(packageCtrl.addRentalPackage).put(packageCtrl.updateRentalPackage).delete(packageCtrl.deleteRentalPackage).get(vtAdmin, packageCtrl.viewRentalPackage);
router.route('/outstation/:id?').post(packageCtrl.addOutstationPackage).put(packageCtrl.updateOutstationPackage).delete(packageCtrl.deleteOutstationPackage).get(vtAdmin, packageCtrl.viewOutstationPackage);
router.route('/rentalFare/:id?').put(packageCtrl.updateRentalPackageFare);
router.route('/outstationFare/:id?').put(packageCtrl.updateOutstatioPackageFare);
//Import From Excel
router.route('/insertDriverData').post(mwimportupload, ImportFromExcelCtrl.insertDriverData);
router.route('/insertRiderData').post(mwimportupload, ImportFromExcelCtrl.insertRiderData);

//App Response Language Translate
router.route('/languageUpdate/:language?').put(jsonFileupload, commonCtrl.languageUpdate);
router.route('/listLanguage/:language?').get(commonCtrl.listlanguage).post(jsonFileupload, commonCtrl.addLanguage);
router.route('/downloadLanguage/:language?').get(commonCtrl.downloadLanguageFile);
//Admin Language Translate
router.route('/adminLanguageUpdate/:language?').post(jsonFileupload, commonCtrl.addAdminLanguage).get(commonCtrl.listAdminLanguages).put(jsonFileupload, commonCtrl.adminLanguageUpdate);
router.route('/downloadAdminLanguageFile/:language?').get(commonCtrl.downloadAdminLanguageFile);
//Landing Language Translate
router.route('/landingLanguageUpdate/:language?').post(jsonFileupload, commonCtrl.addLandingLanguage).get(commonCtrl.listLandingLanguages).put(jsonFileupload, commonCtrl.landingLanguageUpdate);
router.route('/downloadLandingLanguageFile/:language?').get(commonCtrl.downloadLandingLanguageFile);

//driver vehicle refrsh from admin
router.route('/refreshFromAdmin').get(driverCtrl.refreshFromAdmin)

router.route('/cancelReasonFromDB/:id?').post(commonCtrl.addCancelReason).get(commonCtrl.getCancelReason).put(commonCtrl.updateCancelReason);

router.route('/rentalConfigFile/:language?').get(rentalCtrl.getRentalConfigFile).post(rentalCtrl.updateRentalConfig);

router.route('/createBankAccount').post(vtAdmin, razorpayCtrl.createFundAccounts);
router.route('/driverPayouts').post(vtAdmin, razorpayCtrl.payouts);

// router.route('/clearSubscriptionOftheDriver').post(driverPayPackageCtrl.clearSubscriptionOftheDriver);
router.route('/zone/:id?').post(zoneCtrl.addZoneToACity).put(zoneCtrl.updateZoneCity).delete(zoneCtrl.deleteZoneCity).get(vtAdmin, zoneCtrl.viewZoneToACity);
router.route('/makeOnlineOfflineDrivers').post(vtAdmin, driverCtrl.makeOnlineOfflineDrivers);

router.route('/DriverAttendance/:id?').get(vtAdmin, driverCtrl.attendanceList).delete(vtAdmin, driverCtrl.deleteAttendance);

router.route('/').get(companyCtrl.getCompany);

// Riders holding Amount Transactions ///

router.route('/holdAmtTransaction').get(vtAdmin,ridersCtrl.riderholdingTransactions);
router.route ('/refundHoldamount').put(vtAdmin,ridersCtrl.refundTripHoldAmount)

export default router;
