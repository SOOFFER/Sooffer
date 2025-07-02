package com.soofer.app.CommonClass;


import androidx.fragment.app.Fragment;

import com.soofer.app.Model.LocalModel.MultipleAddressModel;

import java.util.ArrayList;
import java.util.List;

public class Constants {
    public static Fragment TripFlowFragmant = null;

    public static boolean isFromTripFlow = false;

    public static Fragment TempFragment = null;

    //fcm
    public final static String AUTH_KEY_FCM = "AAAAGAksKio:APA91bFYOC9P4WlYu1cPpYko-PbohBdj0vFDvtPeiht0msz7uy6PXGM4sjoNchnGPuSVExQCcpzLXcPA_ByluhqLyhRlNR5_FYaH2CUtbzmZ3B7zdovvFtxpEnNYThcUOfPM-ntcy74k";
    public final static String API_URL_FCM = "https://fcm.googleapis.com/fcm/send";

    public static String GooglPlaceApikey = "AIzaSyB00YxZdXtIluaQrC3FuFVo1iGahtBTun8";
    public static String GoogleDirectionkey = "AIzaSyB00YxZdXtIluaQrC3FuFVo1iGahtBTun8";
    public static String GoogleGeocoderAPI = "https://maps.googleapis.com/maps/api/";
    public static String FlowStatus = "0";
    public static String CheckRiderStatus= "0";
    public static String strDriver= "0";
    public static String capitalizeFirstLetter(String original) {
        if (original == null || original.length() == 0) {
            return original;
        }
        return original.substring(0, 1).toUpperCase() + original.substring(1);
    }

    // The minimum distance to change Updates in meters
    public static final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 1; // 10 meters

    // The minimum time between updates in milliseconds
    public static final long MIN_TIME_BW_UPDATES = 1000 * 2; //2 Seconds
    //Map zoom level
    public static final float MAP_ZOOM_SIZE = 15;
    public static final long SET_INTERVAL = 5000; //5 Seconds
    public static final long SET_FASTESTINTERVAL = 3000; //3 Seconds

    public static final int REQUEST_CHECK_SETTINGS = 0x1;


    public static final float MAP_ZOOM_SIZE_ONTRIP = 17;

    public static List<MultipleAddressModel> multipleAddressModels = new ArrayList<>();

    public static Boolean isMultipleStop = false;
    public static Boolean isDriver = false;
    public static String twodriver = "";
    public static String hourly = "";
    public static String Vehicle_id = "";

}
