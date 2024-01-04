package com.bismillah.driver.CommonClass;

import android.location.Location;

import com.bismillah.driver.Model.DriverProfileModel;

public class CommonData {
    public static String strCountryCode = "";
    public static String strPickupAddress = "";
    public static  String strpickCity="";
    public static String strDropAddresss = "";
    public static double Pickuplat = 0.0;
    public static double Pickuplng = 0.0;
    public static double Droplat = 0.0;
    public static double Droplng = 0.0;

    public static  String strEstimateId="";
    public static String strPaymentMode="";
    public static String strEstimationResponse = "";

    public static Location CurrentLocation =null ;

    //Profile
    public static DriverProfileModel driverProfileModel = null;

    //normal variable
    public static String strCurrency = "";
    public static String strLanguage = "";
    public static String strTitle = "";
    public static String strHeaderTitle = "";
    public static String strdiscription = "";
    public static String ImagePath = "";
    public static String Documenttype = "";
    public static String driveAllovanceDis = "0";
    public static String walletBalance = "0";
    public static String Earningdate = "0";
    public static String PreviousOnlineOfflineStatus = "";

    public static void setImagePath(String strCurrency) {
        ImagePath = strCurrency;
    }

    public static String getImagePath() {
        return ImagePath;
    }

    public static int photo = 0;

    public static Boolean register = false;
    public static Boolean RequestBoolean = false;
    public static Boolean AnotherActivity = false;
    public static Boolean isRequestFrom = true;
    public static Boolean requestionInprogress = false;
    public static Boolean isFistTime = true;
    public static Boolean twodriver ;
    public static  Boolean RequestStart = true;
    public static  Boolean RiderDetail = true;

    //meter
    public static double speed = 0;
    public static int p = 1;
    public static String strTotalDistance = "0";
    public static Location lStart, lEnd;
    public static String strDistanceBegin;
    public static double distance = 0;
    public static double outsitedistance = 0;


    public static long startTime = 0, endTime = 0;

    public static int TotalwaitingTime = 0;
    public static long currentTime = 0;
    public static long LastPastTime = 0;
    public static Stopwatch stopWatch;

    public static String PreviousCarType = "";

    public static String CarMakeName = "";
    public static String CarModel = "";
    public static String CarNumber = "";
    public static String CarColor = "";

}
