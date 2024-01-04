/**
 * @license
 * Copyright Abservetech. All Rights Reserved.
 */
export class AppSettings {
  public static API = "https://api.sooffer.com/";      //"https://aloapp.com:3001/" "http://10.1.1.31:3001/" http://35.232.199.148:3001/
  public static API_ENDPOINT = AppSettings.API + "adminapi/";
  public static VEH_ENDPOINT = AppSettings.API + "api/";
  public static WEB_ENDPOINT = AppSettings.API + "webapi/";
  public static DRI_ENDPOINT = AppSettings.API + "api/";
  public static FILEURL = AppSettings.API + "public/";
  public static BASEURL = AppSettings.API;
  public static FEURL = AppSettings.API + "landing/";
  public static APPNAME = "Sooffer App";
  public static COPYRIGHTURL_FOOTER = "Sooffer App";
  public static LOGO_WIDTH = "100";
  public static LOGO_HEIGHT = "100";
  public static LOGO_URL = "assets/images/logo.png";
  public static DEFAULT_LOCATION = "Ecuador";
  public static ZOOM_MAP_LOCATION = 10;
  public static toShowSeocndCurrency = false;
  public static secondCurrency = "USD";
  public static defaultcur = "$";
  public static defaultTime = "Mins";
  public static defaultUnit = "Mile";
  public static defaultPhoneCode = "+593";
  public static showServiceCity = false;
  public static showWhatWeOffers = true;
  // public static defLat = 9.656456;
  // public static defLng = 14.87878;
  // usa
  public static defLat = 37.0902;
  public static defLng = -95.7129;

  public static phone_code = ["+593", "+1"];
  public static tripType = 'daily'
  public static Services = [
    "daily",
    "rental",
    ];
}

export class VerificationSettings {
  public static isVerify = true;
  public static verifyMethod = "phone"; // ['phone','email']
  public static methodName = "Phone Number"; // ['Email Address','Phone Number']
}

export class LanguageSettings {
  public static languages = ["es", "en"];
  public static defaultSelectedLang = "en";
  public static setLanguageForMenus = true;
  public static fetchTranslateFilesFromAPI = false;
}


 // abservetech
