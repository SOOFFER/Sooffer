const featuresSettings = {
  "isCityWise": true,
  "isServiceAvailable": true,
  "isMultipleCompaniesAvailable": false,
  "isMultipleCompaniesDriversAvailable": false,
  "isCommisionToAdmin": false,
  "isDoubleChargeNeeded": false,
  "fareCalculationType": "normal",
  "gst": {
    "gstFareBreakPercentage": 85,
    "gstOnFareBreakPercentage1": 5,
    "gstOnFareBreakPercentage2": 18
  },
  "applyTravelFare": true,
  "applyValues": {
    "applyNightCharge": true,
    "applyPeakCharge": true,
    "applyWaitingTime": true,
    "applyTax": true,
    "applyCommission": true,
    "applyPickupCharge": true
  },
  "calculateZoneFare": true,
  "calculateZoneFareInEstimation": false,
  "isUpdateDriverPerDayEarnings": true,
  "isETANeeded": false,
  "isTollAdded": true,
  "isRiderCancellationAmtApplicable": true,
  "addOldCancelationAmountInEstimation": true,
  "isDriverCancellationAmtApplicable": false,
  "calculateDriverEarningAtEveryDay": false,
  "applyBlockOldCancellationAmt": true,
  "isDriverCreditModuleEnabled": true,
  "addBookingFeeToCommision": false,
  "driverPayouts": {
    "adminCommision": "driverWallet",
    "payoutType": "driverPrepaidWallet",
    "deductAmountFromDriverWallet": "commision",
    "driverCreditAmountAlertLimit": -3000,
    "driverCreditAmountOfflineLimit": -3000,
    "driverPayoutAmountLimitMax": 5,
    "driverStripeConnect": false,
    "driverStripeConnectCountry": "US",
    "driverStripeSplitPayout": false,
    "driverStripeSplitPayoutDirectlyAtEveryTripEnd": false,
    "driverDirectPayout": true
  },
  "riderWallet": true,
  "liveTaxiMeter": false,
  "applyAdditionalKMFareModel": true,
  "riderRechargeWalletInClientSide": false,
  "riderCard": true,
  "riderTripPaidInClientSide": false,
  "defaultPhoneCode": 593,
  "defaultlang": "EN",
  "defaultcur": "USD",
  "defaultCountryId": 63,
  "defaultStateId": 4121,
  "primarycur": "USD",
  "secondarycur": false,
  "secondarycurName": "USD",
  "secondarycurSymbol": "$",
  "conversionRate": 10,
  "roundOff": 2,
  "referalSettings": {
    "isRiderReferalCodeAvailable": "true",
    "riderReferalAmount": 0,
    "riderRefererAmount": 5,
    "isDriverReferalCodeAvailable": "true",
    "driverRefererAmount": 10,
    "driverReferalAmount": 0
  },
  "isCompanyPriorityDriverRequest": false,
  "isPromoCodeAvailable": true,
  "isOffersForRideAvailable": false,
  "passwordVerificationMethod": "sms",
  "passwordVerificationMethodForUser": "sms",
  "registerOTPVerificationMethod": "sms",
  "tripsAvailable": [
    "Daily",
    "Package",
    "Outstation"
  ],
  "hailTaxi": false,
  "shareTaxi": false,
  "socialLogin": true,
  "callMasking": false,
  "addFareWithServices": false,
  "payPackageTypes": [
    "commision",
    "subscription"
  ],
  "expirationNotificationBefore": 3,
  "addAdditionalFaresInTrip": false,
  "defaultPaymentMethod": "cash",
  "riderSignupBonus": false,
  "riderSignupBonusAmount": false,
  "applyMandatoryDiscount": false,
  "discountsAvailable": false,
  "updateDriverPerDayOnlineTime": true,
  "getVehicleListAlongWithFeatures": true,
  "convertAllFareToNearbyFive": false,
  "convertAllFareToGivenMultipler": false,
  "multipler": false,
  "dobMandatory": false,
  "redTaxiModel": true,
  "manualPickupChargeFromMTD": false,
  "addETAtoServicevehicles": true,
  "latestYearList": false,
  "latestYearCount": 5,
  "driverDocumentExpiryReasons": [
    {
      "key": "insuranceexp",
      "value": "Insurance"
    },
    {
      "key": "licenceexp",
      "value": "Licence"
    },
    {
      "key": "passingexp",
      "value": "Passing"
    }
  ],
  "taxiDocumentExpiryReasons": [
    {
      "key": "permitDate",
      "value": "Permit"
    },
    {
      "key": "insuranceDate",
      "value": "Insurance"
    },
    {
      "key": "registrationDate",
      "value": "FitnessCertificate "
    }
  ],
  "rentalFareCheckKMFirst": false,
  "isACAvailable": false,
  "showSupportNo": true,
  "isDriverPrefixCodeEnabled": false,
  "isTripPrefixCodeEnabled": true,
  "updateTripPaths": true,
  "locationUpdateAfter": {
    "daily": 1,
    "rental": 30,
    "outstation": 60
  },
  "checkInactiveCon": true,
  "lowerCategoryCanUse": {
    "sedanToMini": true
  },
  "isPickupAddtoCommission": false,
  "calMaxDistancePercentage": 30,
  "calMinDistancePercentage": 5,
  "checkDropLocationForBoundery": false,
  "getrentalFareAsPerEstimation": true,
  "languages": [
    "en",
    "es"
  ],
  "adminLanguages": [
    "en",
    "es"
  ],
  "landingLanguages": [
    "en",
    "es"
  ],
  "apiOptimisation": {
    "distanceMatrix": false
  },
  "checkWaitingTimeBeforeTripStart": true,
  "checkArrivalDistance": false,
  "arrivalDistanceInMeter": 100,
  "taxTDSPercentage": false,
  "distanceKMFromMeter": true,
  "deductDuringTripEnd": true,
  "addBookingFeeToCommission": true,
  "checkMaxMonthlyEarningsLimit": false,
  "maxMonthlyEarningsLimit": 30000,
  "additionalDetuctionFromDriver": 5,
  "driverTDSPercentage": true,
  "amountToRedueForRazorPayPayment": false,
  "amountToRedueForRazorPayPaymentPercentage": 2,
  "possiblePerHrKM": 120,
  "bothCommisionAndSubscription": true,
  "useRedisCache": true,
  "checkDuplication": true,
  "dailyValidateAppDistance": false,
  "rentalEstimationFareTax": false,
  "distUpdateForDailyInSec": 15,
  "totalDistanceInZoneApproxEligible": 25,
  "resBasedOnCurrency": true,
  "documents": [
    {
      "name": "Driving License",
      "esName": "Licencia de conducir",
      "fileFor": "drivingLicense",
      "front": true,
      "back": false,
      "exp": true
    }
  ],
  "taxiDocuments": [
    {
      "name": "Insurance",
      "esName": "Insurance",
      "fileFor": "insurance",
      "front": true,
      "back": false,
      "exp": true
    },
    {
      "name": "Smart Card / Registration Card",
      "esName": "Smart Card / Registration Card",
      "fileFor": "registrationCard",
      "front": true,
      "back": false,
      "exp": true
    },
    {
      "name": "Tax ID / Social Security Number",
      "esName": "Tax ID / Social Security Number",
      "fileFor": "Tax ID / Social Security Number",
      "front": true,
      "back": false,
      "exp": false
    }
  ],
  "alertDriverBeforeDocExpiry": 10,
  "driverCard": true,
  "driverRechargeWalletInClientSide": false,
  "isChangeResToCorresLang": true,
  "stripePaymentPercentage": 2,
  "centsToAddExtraForStripe": 0,
  "faceSimalarityPercentage": 75,
  "checkAttendance": true
};module.exports = featuresSettings