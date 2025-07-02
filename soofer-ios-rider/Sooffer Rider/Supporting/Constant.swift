//
//  Constant.swift
//  RebuStar Rider
//
//  Created by Abservetech on 30/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation

// here we have save baseurls , userdefaults , coredata objects , some constants keys


struct ServiceApi{
    static let Base_URL = "http://18.220.141.188:3001/api/" //"http://148.66.134.236:3001/api/"
    static let Base_URLSSS = "http://18.220.141.188:3001/api/rider"
    static let Base_Image_URL = "http://18.220.141.188:3001/" //https://node.absera.com:3023/
    static let SendTripReciept = "http://18.220.141.188:3001/api/sendTripReceipt"
    static let help = "https://node.absera.com:3023/api/webView/helpCategory"
    static let tc = "https://node.absera.com:3023/api/tnc"
    static let googleNearbyAddr = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"
    static let googleDirection = "https://maps.googleapis.com/maps/api/directions/json"
    static let googleAutoComplete = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"
    static let googlelatAdd = "https://maps.googleapis.com/maps/api/geocode/json"
    static let login = ServiceApi.Base_URL + "riderslogin"
    static let AccountDeletion = ServiceApi.Base_URL + "deleteRider"
    static let otpVerification = ServiceApi.Base_URL + "verifyNumber"
    static let vechicleAdd     = ServiceApi.Base_URL + "safeRide/ridertaxi"
    static let riderForgotPassword = ServiceApi.Base_URL + "riderForgotPassword"
    static let signup = ServiceApi.Base_URL + "riders"
    static let profile = ServiceApi.Base_URL + "rider"
    static let pasttrip = ServiceApi.Base_URL + "riderTripHistory"
    static let upcoming_trip = ServiceApi.Base_URL + "riderUpcomingScheduleTaxi"
    static let emerygencyList = ServiceApi.Base_URL + "rideremgcontact"
    static let favAddress = ServiceApi.Base_URL + "ridersAddress"
    static let tripDetail = ServiceApi.Base_URL + "pastTripDetailRider"
    static let TripReciept = ServiceApi.SendTripReciept + "SendTripReciept"
    static let vehicleServe = ServiceApi.Base_URL + "serviceBasicFare"
    static let estimationFare = ServiceApi.Base_URL + "estimationFare"
    static let requestTaxi = ServiceApi.Base_URL + "requestTaxi"
    static let cancelTaxi = ServiceApi.Base_URL + "cancelTaxi"
    static let cancelCurrentTrip = ServiceApi.Base_URL + "cancelCurrentTrip"
    static let tripDriverDetails = ServiceApi.Base_URL + "tripDriverDetails"
    static let riderFeedback = ServiceApi.Base_URL + "riderFeedback"
    static let addCard = ServiceApi.Base_URL + "addCard"
    static let addToMyWallet = ServiceApi.Base_URL + "addToMyWallet"
    static let myWallet = ServiceApi.Base_URL + "myWallet"
    static let riderpwd = ServiceApi.Base_URL + "riderpwd"
    static let myWalletHistory = ServiceApi.Base_URL + "myWalletHistory"
    static let userCancelScheduleTaxi = ServiceApi.Base_URL + "userCancelScheduleTaxi"
    static let contactUs = ServiceApi.Base_URL + "contactUs/"
    static let notification  =  ServiceApi.Base_URL + "pushNotificationForRider"
    
    static let offersList = ServiceApi.Base_URL + "offersList"

    static let validatePromo = ServiceApi.Base_URL + "validatePromo"
    static let packageList = ServiceApi.Base_URL + "rental/packageList"
    static let fareEstimation = ServiceApi.Base_URL + "rental/fareEstimation"
    static let requestRentalTaxi = ServiceApi.Base_URL + "requestRentalTaxi"
     static let requestOutstationTaxi = ServiceApi.Base_URL + "requestOutstationTaxi"
    static let outstationDetail = ServiceApi.Base_URL + "rental/outstationVehicleListWithFare"
    
    static let updateLoc = ServiceApi.Base_URL + "updateDropLocation"
        static let emergencyMsg = ServiceApi.Base_URL + "emergencyMsg"
    static let tips = ServiceApi.Base_URL + "addTips"
    static let sendchatFCM = ServiceApi.Base_URL + "sendchatFCM"
    }

struct UserDefaultsKey{
    static let fcmtoken = "FCMTOKEN"
    static let deviceToken = "Device_Token"
    static let promo = "promo"
    static let token = "token"
    static let email = "email"
    static let name = "name"
    static let userid = "userid"
    static let loginstatus = "loginstatus"
    static let language = "language"
    static let payment = "payment"
    static let tripid = "trip_id"
    static let driverid = "driver_id"
    static let tripstated = "tripstarted"
    static let driverVehcile = "driverVehcile"
    static let tripwillstart = "tripwillstart"
    static let driver = "Driver"
    static let taxiId = "taxiId"
    static let makeName = "makeName"
    static let number = "number"
    static let model  = "model"
    static let last4 = "last4"
    static let genderSetup = "genderSetup"
}

struct Constant {
    static let priceTag = "$"
    static let phoneCode = "+91"
    static let distanceUnit = "Mile"
    
    
    
    
    static let googleAPiKey = "AIzaSyA0Rw4sntPKrobxyiRNSgh4x31aK9MvIxo"
    
    
    
    
    
//    static let APP_KEY      = "f7aa6ac6-1c21-42e4-b446-dbf396cc6fca"
//    static let APP_SECRET   = "q/eM1cZXnUqY4kvDh4nu0g=="
//    AIzaSyBZvKhc06Ms4EXO2ApwcB99LUEwQrrL8f0
//    "AIzaSyA0Rw4sntPKrobxyiRNSgh4x31aK9MvIxo"
//    "AIzaSyBZvKhc06Ms4EXO2ApwcB99LUEwQrrL8f0"
//    "AIzaSyA0Rw4sntPKrobxyiRNSgh4x31aK9MvIxo"
//    "AIzaSyCTyCb06T6VpIAr07qOHZJQfYLy3oVHqn4"
// static let countryCode = "bd"
   static var countryCode = ((NSLocale.current.regionCode)?.lowercased()) ?? "in"
 //   static var countryCode =  "US"
    static var profileData = ProfileModel()
    static var ConfigData = CONFIGMODEL()
    static let stripkey = //"pk_test_51JvLMsD9LszUmsLxMrARz8Aag0y5XeOMUnUNGzZ4oKfiyfSjnkGkGkntDJQvH3Z2nisIuNe1VsTGwJu5jPFIYljW008c1M23tQ"
    "pk_live_51JvLMsD9LszUmsLxvA3vVVqJPXPCncqNSqE2RTiWDqaj0TvQPXTtyG4OqopDu68z6GEMlhcdea0HkmXsdc7pWtXM00xVZJANuo"//"pk_test_p9ezyOwyrdBOTllMKBFgJXFg"
//    "pk_test_KIrZ4RKWQdCQwQ5hOvHcZXYM"
    
    static var walletMoney = "0"
    static var fcm_id = ""
}

struct StringFile {
    static let errorTitle = "Error"
    static let emailError = "Please Enter Valid Email Id"
    static let passwordError = "Please Enter Valid Password"
    static let phonenumError = "Please Enter Mobile number with 10 digits only"
    static let somethingwrong = "Something went wrong"
    static let networkerror = "Please Check your InterNet Connection"
    static let timeouterror = "We could not connect with you , so please try again later"
    static let err_name = "Please enter your name"
    static let err_contactnum = "Please enter your Contact number"
    static let err_flat = "Please enter your Flat no:"
    static let err_area = "Please enter your Area"
    static let err_landmark = "Please enter your Landmark"
    static let err_city = "Please enter your city"
    static let err_address = "Please select the address"
    static let err_slot = "Please select the slot to delivery"
    static let err_getAddress = "Sorry!!! con't get Address"
    static let err_network = "Please check with your internet connection !!!"
    static let err_upload = "Sorry con't upload data"
    
}

extension Notification.Name {
    static let closeEstimateFare = Notification.Name("closeEstimateFare")
    static let addedEstimateFare = Notification.Name("addedEstimateFare")
    static let closeTripStatusView = Notification.Name("closeTripStatusView")
    static let requestedView = Notification.Name("requestedview")
    static let completedLengthyDownload = Notification.Name("completedLengthyDownload")
    static let rideRequestSend = Notification.Name("rideRequestSend")
}
