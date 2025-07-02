/**
 * @license
 * Copyright Abservetech. All Rights Reserved.
 */

export class AppSettings {
  // public static API_ENDPOINT = "http://10.1.1.31:3001/adminapi/";
  // public static VEH_ENDPOINT = "http://10.1.1.31:3001/api/";
  // public static FILEURL = "http://10.1.1.31:3001/public/";
  // public static BASEURL = "http://10.1.1.31:3001/";
  // public static FEURL = "http://10.1.1.31:3001/webadmin/";

  // public static API_ENDPOINT = "http://localhost:3001/adminapi/";
  // public static VEH_ENDPOINT = "http://localhost:3001/api/";
  // public static FILEURL = "http://localhost:3001/public/";
  // public static BASEURL = "http://localhost:3001/";
  // public static FEURL = "http://localhost:3001/webadmin/";

  public static API_ENDPOINT = "https://api.sooffer.com/adminapi/";
  public static VEH_ENDPOINT = "https://api.sooffer.com/api/";
  public static FILEURL = "https://api.sooffer.com/public/";
  public static BASEURL = "https://api.sooffer.com/";
  public static FEURL = "https://api.sooffer.com/webadmin/";

  public static production = false;
  public static APPNAME = "Sooffer";
  public static APPYEAR = new Date().getFullYear();
  public static defaultPhoneCode = "+91";
  public static defaultlang = "EN";
  public static defaultcur = "$";
  public static defaultCountryId = "63"; //Ecuador
  public static defaultStateId = "1022"; //TN
  public static GOOGLE_MAP_DEFAULT_LOCATION = "Dallas-Fort Worth, Texas"; // It is used for showing default location of google map to show the location details*/
  public static MAP_ZOOM = 10;
  public static GoogleMapKey = "AIzaSyDWpHDxOetTD3v7dVzOGsyJ98OBDevnVI0";
  public static logo_URL = "assets/images/logo.png";
  public static version = "2.0.4";
  public static showLogo = false;
  public static showTitle = true;
  public static logo_height = 57;
  public static logo_width = 198;
  public static secondCurrency = "INR";
  public static toShowSeocndCurrency = false;
  public static DeleteDriver = true;
  public static canToast = false;
  public static via = "Stripe";
  public static isSHowPayout = true;
}

export class LanguageSettings {
  public static languages = ["es", "en"];
  public static defaultSelectedLang = "en";
  public static setLanguageForMenus = true;
  public static showTranslateOption = true;
  public static fetchTranslateFilesFromAPI = false;
}

export class featuresSettings {
  public static phcode = ["+593", "+1", "+91"];
  public static selectedPhcode = "+91";
  public static isDTS = false;
  public static isCityWise = true; //Vehicle and Fare etc act citywise  0/1
  public static isHotel = false; //Vehicle and Fare etc act citywise  0/1
  public static isServiceAvailable = true; //if not modify in getServiceBasicfare
  public static isCommisionToAdmin = true; //is at end of trip Commision need to take
  public static isMultipleCompaniesAvailable = false;
  public static isDoubleChargeNeeded = false; //is isDoubleChargeNeeded for crossing City limit
  public static applyNightCharge = true;
  public static applyPeakCharge = true;
  public static applyWaitingTime = true; //waiting time charge
  public static applyTax = true;
  public static applyCommission = true;
  public static applyPickupCharge = true;
  public static isRiderCancellationAmtApplicable = true;
  public static isDriverCancellationAmtApplicable = false;
  public static applyBlockOldCancellationAmt = true;
  public static isDriverCreditModuleEnabled = true; //Helps to show alert if credits are low, reduce commision from credits, etc
  public static adminCommision = "driverWallet"; //From Driver Wallet (driverWallet)
  public static payoutType = "driverPostpaid"; //Driver Have to Recharge to Take Trip. (driverPrepaidWallet,driverPostpaidWallet)
  public static deductAmountFromDriverWallet = "commision"; //this amount will be decuted from Wallet (totalFare,commision)
  public static isRiderReferalCodeAvailable = false;
  public static isPromoCodeAvailable = true;
  public static isOffersForRideAvailable = false;
  public static tripsAvailable = ["Daily", "rental", "outstation", "twodriver"]; //USED
  public static fareCalculationType = "normal"; //{indiaGst,normal}
  public static distanceUnit = "Miles"; //KM or Miles
  public static showHailTrips = false; //show hail related stuffs
  public static payPackageTypes = ["subscription"]; // 'subscription,commission,topup'
  public static subPackageTypes = ["subscription"]; // 'subscription,commission,topup' - DRIVER SUBSCRIPTION MENU
  public static shareTaxi = false; // Is Vehicle Sharing Available in Vehicle Type
  public static taxFeeLabel = "Tax"; // Access Fee or Tax
  public static showDeliveryTrips = false; // Delivery Trips and Report
  // public static defaultVehicleInMap = 'Sedan'; // Gods View and Tracking
  public static defaultVehicleInMap = "ALL"; // Gods View and Tracking
  public static referenceCode = false;
  public static langAvailable = ["en", "es"];
  public static DefaultCountry = "63";
  public static DefaultState = "1022";
  public static ServiceAvailableCity = localStorage.getItem("cityType");
}

export class FirebaseConfig {
  public static firebaseConfig = {
    apiKey: "AIzaSyDWpHDxOetTD3v7dVzOGsyJ98OBDevnVI0",
    authDomain: "aloapp-5322a.firebaseapp.com",
    databaseURL: "https://aloapp-5322a.firebaseio.com",
    projectId: "aloapp-5322a",
    storageBucket: "aloapp-5322a.appspot.com",
    messagingSenderId: "189294547569",
    appName: "aloapp-5322a",
    appId: "1:253803387568:web:74048ae346b132e6c9b975",
  };
}

export class AdminMenuConfig {
  public static hideFieldsForProviderLogin = false;
  public static showNormalMenu = [
    { label: "Super Admin", value: "superadmin" },
    { label: "Dispatcher Admin", value: "dispatcher" },
    { label: "Billing Admin", value: "billing" },
    { label: "Provider Admin", value: "provider" },
  ];
  public static showCityWiseMenu = [
    { label: "Super Admin", value: "superadmin" },
    { label: "City Wise Admin", value: "citywiseadmin" },
    { label: "Dispatcher Admin", value: "dispatcher" },
    { label: "Billing Admin", value: "billing" },
    { label: "Provider Admin", value: "provider" },
  ];
}

export class FarefieldConfig {
  public static showFareFromConfig = true; // MTD Fare
  public static showManuallyAddPickupCharge = true;
}

export class DashBoardTripEarning {
  public static tripValues = [
    { label: "totalTripPayment", title: "Total Trip Payment", value: 0 },
    { label: "totalDriverEarned", title: "Total Driver Earned", value: 0 },
    { label: "totalTripCommision", title: "Total Trip Commission", value: 0 },
    { label: "totalTrips", title: "Total Trips", value: 0 },
  ];
}

export class inputValidation {
  public static fnameValid = {
    pattern: "[a-zA-Z ]*",
    minlength: 1,
    maxlength: 25,
  };
  public static lnameValid = {
    pattern: "[a-zA-Z ]*",
    minlength: 0,
    maxlength: 25,
  };
  public static emailValid =
    "[a-z0-9!#$%&*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
  public static pwdValid = {
    minlength: 4,
    maxlength: 15,
  };
  // public static pwdValid = "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#_$%(+=)^&*])[a-zA-Z0-9!@#_(+=)$%^&*]{6,8}$";
  public static phoneValid = {
    pattern: "^[0-9]*$",
    minlength: "9",
    maxlength: "10",
  };
}

export class dropdown {
  public static dropdownSettings = {
    singleSelection: true,
    idField: "scId",
    textField: "name",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true,
  };
}

export class documentSettings {
  public static showOptionalFieldDriver = false;
  public static driverTaxiLabels = ["PA/CPC Number"];
  public static setDriverTaxiLabel = false;
  public static driverDocsWithNumberAndImage = [
    {
      label: "Aadhar  ",
      value: "aadhaar",
      nolabel: "Aadhar No",
      novalue: "aadhaarNo",
    },
    //  {
    //    label: "Licnence",
    //    value: "licence",
    //    nolabel: "Licnence No",
    //    valuelabel: "licenceNo",
    //  },
  ];
  public static driverDocsWithNumberOnly = [
    {
      label: "Badge Number",
      value: "badge",
    },
  ];
  public static driverDocsWithExpiryNumberImage = [
    {
      label: "Licence",
      value: "licence",
      nolabel: "Badge Licence No",
      novalue: "licenceNo",
      explabel: "Licence Expiry Date",
      expvalue: "licenceexp",
    },
  ];
  public static driverDocsWithMultipleImages = [
    // {label: "Driving Licence", value: ["licence", "licenceBackImg"]},
  ];
  public static driverDocsWithMultipleImgWithoutDate = [
    // {label: "Address Proof", value: ["passing", "passingBackImg"]},
    {
      label: "Owner Address Proof",
      value: ["insurance", "insuranceBackImg"],
    },
  ];
  public static driverDocsWithoutExpiryDate = [
    {
      label: "Pan Card",
      value: "panCard",
    },
  ];
  public static driverDocs = [];
  public static taxiDocsWithMultipleImages = [];
  public static taxiDocs = [
    { label: "Taxi Permit", value: "permit" },
    { label: "Taxi Insurance", value: "insurance" },
  ];
  public static taxiDocsWithoutExpiryDate = [
    { label: "Taxi Registration Certificate (RC)", value: "registration" },
  ];
  public static taxiDocsWithManualFields = [
    {
      label: "Fitness Certificate",
      value: ["registrationBack", "registrationexpdate"],
    },
  ]; // first value for img and second for expdate
}

export class DocumentNotificationSettings {
  public static driverNotificationValues = [
    { label: "Licence Expiry Date", value: "licenceexp", type: "date" },
    // { label: 'Insurance Expiry Date', value: 'insuranceexp', type: 'date' },
    // { label: 'Passing Expiry Date', value: 'passingexp', type: 'date' },
    // { label: 'Misc Expiry Date', value: 'miscexp', type: 'date' }
  ];
  public static driverTaxiNotificationValues = [
    { label: "Taxi Permit Expiry Date", value: "permitDate", type: "date" },
    {
      label: "Taxi Insurance Expiry Date",
      value: "insuranceDate",
      type: "date",
    },
    { label: "Fitness Certificate", value: "registrationDate", type: "date" },
  ];
}

// abservetech
