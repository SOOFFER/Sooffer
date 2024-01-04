// ./express-server/routes/uber.server.route.js
import express from 'express';

//import controller file
// import * as todoController from '../controllers/uber.server.controller';
import * as testCtrl from '../controllers/test';
import * as paymentTestCtrl from '../controllers/paymentGateway/test';
import * as appCtrl from '../controllers/app';
import * as driverPayPackageCtrl from '../controllers/driverPayPackage';
import * as driverCtrl from '../controllers/driver';
import * as commonCtrl from '../controllers/common';

// get an instance of express router
const router = express.Router();

router.route('/trips').get(testCtrl.getTrips);
router.route('/vehicle').get(testCtrl.getvehicle);
router.route('/rider').get(testCtrl.getRider);
router.route('/driver').get(testCtrl.getDriver);
router.route('/admin').get(testCtrl.getAdmin);
router.route('/companyDetails').get(testCtrl.getCompanyDetails);
router.route('/Vehicletype').get(testCtrl.getVehicletype);
router.route('/driverpayment').get(testCtrl.getdriverpayment);
router.route('/schedule').get(testCtrl.getschedule);
router.route('/createSch').get(testCtrl.createSch);
router.route('/wallet').get(testCtrl.getWallets);
router.route('/driverBankDetails').get(testCtrl.driverBankDetails);
router.route('/getDriverBankTransaction').get(testCtrl.getDriverBankTransaction);
router.route('/parseCSV').get(testCtrl.parseCSV);

router.route('/createStripeCustomer').post(testCtrl.createStripeCustomer);
router.route('/makeStripeSplitTransTest').post(testCtrl.makeStripeSplitTransTest);

// OneByOne:
router.route('/requestTaxiOBO').post(testCtrl.requestTaxiOBO);
// router.route('/getGEOMatchSort').get(testCtrl.getGEOMatchSort);

router.route('/getDummyDvr').get(testCtrl.getDummyDvr);


router.route('/convertSTO').get(testCtrl.convertSTO);
// router.route('/clearT').get(testCtrl.clearT);

router.route('/addDefaultToDvr').post(testCtrl.addDefaultToDvr);
router.route('/addCityData').get(testCtrl.addCityData);

router.route('/testMail').post(testCtrl.testMail);
router.route('/shareMyLocation/:id').get(testCtrl.shareMyLocation);
router.route('/validate/:id?').post(testCtrl.validate);
router.route('/sendMail').get(testCtrl.sendMail);
router.route('/sendMailtest').post(testCtrl.sendMailtest);
router.route('/parseGSTInvoce').post(testCtrl.parseGSTInvoce);
router.route('/sendSms').post(testCtrl.sendSms);
router.route('/testLoadsh').get(testCtrl.testLoadsh);
router.route('/testFirebase').get(testCtrl.testFirebase);

router.route('/tripPaths').put(testCtrl.puttripPaths);

router.route('/testDF').post(testCtrl.testDF);

//Tests
// router.route('/findNChargeExistingUserWallet').post(testCtrl.findNChargeExistingUserWallet);

//Payment Gateway
router.route('/getPUsers').get(paymentTestCtrl.getPUsers);
router.route('/createStripeConnectTest').post(testCtrl.createStripeConnectTest);
router.route('/StripelistCustomersTest').get(testCtrl.StripelistCustomersTest);
router.route('/transferAmountUsingNonceNRecharge').post(testCtrl.transferAmountUsingNonceNRecharge);
router.route('/streamtrips').get(testCtrl.streamtrips);

router.route('/tripDTValue').get(testCtrl.tripDTValue);

router.route('/sendAdminPushMsg').get(testCtrl.sendAdminPushMsg);

router.route('/bboxCheck').get(testCtrl.bboxCheck);

router.route('/getDiscount').get(testCtrl.getDiscount);

router.route('/useragent').get(testCtrl.useragent);

router.route('/getGDM').get(testCtrl.getGDM);

router.route('/getVehicleChargeApprox').get(testCtrl.getVehicleChargeApprox);
router.route('/clearNoEndedtrips').get(appCtrl.clearNoEndedtrips);
router.route('/checkReload').get(testCtrl.checkReload);
router.route('/getVehicleDataForLiveMetertest').post(testCtrl.getVehicleDataForLiveMetertest);

router.route('/createSubAccountFromBankForDriver').post(testCtrl.createSubAccountFromBankForDriver);

router.route('/transferAmountNRechargeVendor').post(testCtrl.transferAmountNRechargeVendor);

router.route('/listPaystackBank').get(testCtrl.listBank);
router.route('/transferRecipient').post(testCtrl.createTransferRecipient).get(testCtrl.listTransferRecipient);
router.route('/payTransferRecipient').post(testCtrl.payTransferRecipient);


router.route('/viewDriverWithFeatureBased').get(testCtrl.viewDriverWithFeatureBased)
router.route('/pointsInsideOnBoundary').post(testCtrl.pointsInsideOnBoundary);
router.route('/getCityAddress').post(testCtrl.getCityAddress);
router.route('/requestNearbyDriversETA').post(driverCtrl.requestNearbyDriversETA);

router.route('/invoice').post(testCtrl.invoice);

//rental
router.route('/rentalTest').post(testCtrl.rentalTest);
router.route('/getRentalFinalAmt').post(testCtrl.getRentalFinalAmt);
router.route('/getHrBtDate').post(testCtrl.getHrBtDate);
router.route('/checkDropPoint').post(testCtrl.checkDropPoint);
router.route('/getinvoicearray').post(testCtrl.getinvoicearray);
router.route('/getNextGivenDaysFromHours').post(testCtrl.getNextGivenDaysFromHours);

//Cache test
router.route('/cache').get(testCtrl.getcache);
router.route('/clearcache').get(testCtrl.clearcache);

router.route('/generateTripCode').post(testCtrl.generateTripCode);
router.route('/testAddTripLocations').post(testCtrl.testAddTripLocations);
router.route('/testMapRoute').post(testCtrl.testMapRoute);
router.route('/testSuggestionForDropLocation').post(testCtrl.testSuggestionForDropLocation);
router.route('/cancelExpiredRideLaterTrips').post(testCtrl.cancelExpiredRideLaterTrips);
router.route('/testGetNearByDrivers').post(testCtrl.testGetNearByDrivers);
router.route('/updateDriverCode').post(testCtrl.updateDriverCode);
router.route('/getDistance').post(testCtrl.getDistance);
router.route('/testPdf').post(commonCtrl.templateToPdf);
router.route('/sendFCMMsgTest').get(testCtrl.sendFCMMsgTest);

router.route('/testSubscription').get(driverCtrl.activateSubscriptionPackage);
router.route('/calculateDistance').post(testCtrl.calculateDistance);
router.route('/changeVechicleName').post(testCtrl.changeVehicleNameInFB)
router.route('/distanceAfterVerified').get(testCtrl.distanceAfterVerified)

router.route('/rentalPackage').post(testCtrl.insertRentalPackage);
router.route('/outstationPackage').post(testCtrl.insertOutstationPackage);
router.route('/findAndSendFCMToDriverTest').post(testCtrl.findAndSendFCMToDriverTest);

router.route('/clearInactiveDriver').post(driverCtrl.clearInactiveDriver);
router.route('/updateSubscriptionEndDate').post(testCtrl.updateSubscriptionEndDate);
router.route('/updateLowCategoryOption').post(testCtrl.updateLowCategoryOption);
// router.route('/getTripZones').post(testCtrl.getTripZones);
router.route('/getGoogleRouteEncodeCtrl').post(testCtrl.getGoogleRouteEncodeCtrl);  //t
router.route('/removeLeadingZero').post(testCtrl.removeLeadingZero);
router.route('/updateSoftRejectStatus').post(testCtrl.updateSoftRejectStatus);
router.route('/makeReferenceAmountZero').get(testCtrl.makeReferenceAmountZero);
router.route('/suggestionDriver').post(testCtrl.SuggestionDriver)

export default router;
