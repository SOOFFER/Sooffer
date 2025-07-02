package com.soofer.driver.CommonClass;

public class Constants {

    public static boolean IsOwnVehicel = true;

    public static boolean isFromRiderProfile = false;
    public static String capitalizeFirstLetter(String original) {
        try {
            if (original == null || original.length() == 0) {
                return original;
            }
            return original.substring(0, 1).toUpperCase() + original.substring(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return original;
    }

    // The minimum distance to change Updates in meters
    public static final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 1; // 10 meters

    // The minimum time between updates in milliseconds
    public static final long MIN_TIME_BW_UPDATES = 1000 * 2; //2 Seconds

    public static final long updateLocationToFBHandlerTime = 1000 * 10; //10 Seconds

    //gps turn on
    public static final int REQUEST_CHECK_SETTINGS =110;

    public static final long SET_INTERVAL = 5000; //5 Seconds
    public static final long SET_FASTESTINTERVAL = 3000; //3 Seconds
    public static int GET_ZOOM_TIME = 4000;
    public static  Boolean RquestScreen = true;
    //Map Zooming Size
    public static final float MAP_ZOOM_SIZE = 14;

    public static final float MAP_ZOOM_SIZE_ONTRIP = 17;

    public static String Previousstatus = "0";
    public static String strVehicleID = "";

    public static String tollfee = "";

    public static String GoogleDirectionApi = "AIzaSyC4Reycz36OmNMz048T9-E6YErfIRMABMg";
    public static String GoogleGeocoderAPI = "https://maps.googleapis.com/maps/api/";
    public static  Boolean RequestStart = true;
    //settings
    public static  Boolean WalletAlertEnable = false;
    // location updates interval - 10sec
    public static final long UPDATE_INTERVAL_IN_MILLISECONDS = 10000;

    // fastest updates interval - 5 sec
    // location updates will be received if another app is requesting the locations
    // than your app can handle
    public static final long FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS = 5000;
    public static String strRideToken = "0";

    public final static String AUTH_KEY_FCM = "AAAAGAksKio:APA91bFYOC9P4WlYu1cPpYko-PbohBdj0vFDvtPeiht0msz7uy6PXGM4sjoNchnGPuSVExQCcpzLXcPA_ByluhqLyhRlNR5_FYaH2CUtbzmZ3B7zdovvFtxpEnNYThcUOfPM-ntcy74k";
    public final static String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";


}
