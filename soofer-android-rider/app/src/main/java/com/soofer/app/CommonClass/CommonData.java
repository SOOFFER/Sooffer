package com.soofer.app.CommonClass;

import android.location.Location;

import com.soofer.app.Model.ProfileModel;

import java.util.ArrayList;
import java.util.List;

public class CommonData {
    //normal variable
    public static String strCurrency = "";
    public static String strLanguage = "";
    public static String strTitle = "";
    public static String strHeaderTitle = "";
    public static String strdiscription = "";
    public static Location CurrentLocation = null;
    public static String strEstimationResponse = "";

    public static String endfun = "";
    public static String closecall ="";
    public static String voicecall = "";


    ///flowdata
    public static String strPickupAddress = "";
    public static String strDropAddresss = "";
    public static double Pickuplat = 0.0;
    public static double Pickuplng = 0.0;
    public static double Droplat = 0.0;
    public static double Droplng = 0.0;
    public static String strServiceType = "basic";
    public static String strServiceImage = "basic";
    public static String ServiceID = "";
    public static String strDistance = "";
    public static String strDistanceFare = "";
    public static String strBaseFare = "";
    public static String strTime = "";
    public static String strTimeFare = "";
    public static String strpromocode = "";
    public static String strPickupCity = "";
    public static String strRequestId = "";
    public static String strPaymentType = "card";
    public static String strCityLimit = "";
    public static Boolean isOutstationPickup = false;
    public static Boolean isRiderLater = false;
    public static String strRequestCancelDuration = "1";
    public static String strVehicleCode = "";
    public static String DriverETA = "";
    public static String strCountryCode = "";
    public static String strDate = "";
    public static String strTimes = "";
    public static String strEncodePolyline = "";
    public static String TripType = "";
    //camera image path
    public static int path = 0;

    //setPinHeader
    public static String HeaderTitle = "";

    //setpin data
    public static String strSetpinAddress = "";

    //Profile
    public static ProfileModel profileModel = null;
    public static List<ProfileModel.Address> addressList = new ArrayList<>();



    public static String ImagePath = "";
    public static String Documenttype = "";

    public static Boolean isPickup = true;
    public static String gender = "";

    public static void setImagePath(String strCurrency) {
        ImagePath = strCurrency;
    }

    public static String getImagePath() {
        return ImagePath;
    }
}
