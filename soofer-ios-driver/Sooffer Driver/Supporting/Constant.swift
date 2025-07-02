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
    static let Base_URL = "http://18.220.141.188:3001/api/"
    static let tc = "https://node.absera.com:3023/api/tnc"
    static let Base_Image_URL = "http://18.220.141.188:3001/" //"https://node.absera.com:3023/"
    static let bankDetails = "https://connect.stripe.com/express/oauth/authorize?client_id=ca_KdtdAYDtmTOFx32L6fnKrsvfdWcC0ZVK"
    //"https://connect.stripe.com/express/oauth/authorize?client_id=ca_KdtdPkQ2a4GPlVRxb3YscDNnAWRMcIAP"
    //"https://connect.stripe.com/express/oauth/authorize?client_id=ca_EVohagOn5kgZGtiiRMuw1uGHqzIKmbT8" //"https://connect.stripe.com/express/oauth/authorize?client_id=ca_EVohEku8Lu72eMo6OJPZiqt8tEsckIkE"2
    static let appstoreLink = "https://node.absera.com:3023/#/"
    
    static let googleNearbyAddr = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"
    static let googleDirection = "https://maps.googleapis.com/maps/api/directions/json"
    static let googleAutoComplete = "https://maps.googleapis.com/maps/api/place/autocomplete/json?"
    static let login = ServiceApi.Base_URL + "driverlogin"
    static let AccountDeletion = ServiceApi.Base_URL + "deleteDriver/id"
    static let otpVerification = ServiceApi.Base_URL + "verifyNumberDriver"
    static let driverForgotPassword = ServiceApi.Base_URL + "driverForgotPassword"
    static let online = ServiceApi.Base_URL + "setOnlineStatus"
    static let cancelTrip = ServiceApi.Base_URL + "cancelTrip"
    static let requestHailTaxi = ServiceApi.Base_URL + "requestHailTaxi"
    static let estimationFareForHailTaxi = ServiceApi.Base_URL + "estimationFareForHailTaxi"
    static let acceptRequest = ServiceApi.Base_URL + "acceptRequest"
    static let declineRequest = ServiceApi.Base_URL + "declineRequest"
    static let DriverLocation = ServiceApi.Base_URL + "DriverLocation"
    static let tripCurrentStatus = ServiceApi.Base_URL + "tripCurrentStatus"
    static let driver = ServiceApi.Base_URL + "driver"
    static let profile = ServiceApi.Base_URL + "driver"
    static let selfie = ServiceApi.Base_URL + "driverAttendance"
    static let secondDriver = ServiceApi.Base_URL + "safeRide/suggestionDriver"
    static let uploadImg = ServiceApi.Base_URL + "safeRide/tripImages"
    static let driverDocs = ServiceApi.Base_URL + "docsDriver"
    static let driverTaxiDocs = ServiceApi.Base_URL + "driverTaxisdocs"
    static let pasttrip = ServiceApi.Base_URL + "driverTripHistory"
    static let rating = ServiceApi.Base_URL + "myRatings"
    static let drivertaxi = ServiceApi.Base_URL + "drivertaxi"
    static let setCurrentTaxi = ServiceApi.Base_URL + "setCurrentTaxi"
    static let carandyear = ServiceApi.Base_URL + "carmakeandyear"
    static let vehicletypelists = ServiceApi.Base_URL + "vehicletypelists"
    static let driverEarnings = ServiceApi.Base_URL + "driverEarningsBtDate"
    static let feedbackLists = ServiceApi.Base_URL + "feedbackLists"
    static let upcoming_trip = ServiceApi.Base_URL + "driverUpcomingScheduleTaxi"
    static let emerygencyList = ServiceApi.Base_URL + "rideremgcontact"
    static let favAddress = ServiceApi.Base_URL + "ridersAddress"
    static let tripDetail = ServiceApi.Base_URL + "pastTripDetailRider"
    static let driverCancelScheduleTaxi = ServiceApi.Base_URL + "driverCancelScheduleTaxi"
    static let vehicleServe = ServiceApi.Base_URL + "serviceBasicFare"
    static let estimationFare = ServiceApi.Base_URL + "estimationFare"
    static let driverFeedback = ServiceApi.Base_URL + "driverFeedback"
    static let driverpwd = ServiceApi.Base_URL + "driverpwd"
    static let driverRequestPayoutTransferAmount = ServiceApi.Base_URL + "driverRequestPayoutTransferAmount"
    static let getVehicleServiceAvailablity = ServiceApi.Base_URL + "getVehicleServiceAvailablity"
       static let driverActiveTripType = ServiceApi.Base_URL + "driverActiveTripType"
    static let twodrivertype = ServiceApi.Base_URL + "activeTwoDriver"
    static let notification  =  ServiceApi.Base_URL + "pushNotificationForDriver"
    
    static let myWalletHistory = ServiceApi.Base_URL + "driverWalletReport"
    static let logout = ServiceApi.Base_URL + "logout"
    static let sendchatFCM = ServiceApi.Base_URL + "sendchatFCM"
}

struct UserDefaultsKey{
    static let fcmtoken = "FCMTOKEN"
    static let deviceToken = "Device_Token"
    static let token = "token"
    static let email = "email"
    static let name = "name"
    static let userid = "userid"
    static let loginstatus = "loginstatus"
    static let acceptedRide = "rideaccepted"
    static let language = "language"
    static let defaultVehicle = "defaultVehicle"
    static let Vehicle_ID = "Vehicle_ID"
    static let tripId = "tripID"
    static let pickuplat = "pickuplat"
    static let pickuplang = "pickuplang"
    static let pickupaddrs = "pickupaddr"
    static let startKM = "startKM"
    static let endKM = "endKM"
    static let hillKm = "hillKm"
    static let triptype = "triptype"
    static let isacceptedView = "isacceptedView"
    static let isstarted = "isstarted"
    static let startlatlang = "startlatlang"
    static let safeRide = "safeRide"
    static let navType = "navType"
//    static let firstdriverid = "firstdriverid"
//    static let seconddriverid = "seconddriverid"
    static let isdriver = "isdriver"
}


struct Constant {
    static let priceTag = "$ "
//    "₹ "
    static let price = "$ "
    static let distanceUnit = "Km"
    static let start = "★"
    static let phoneCode = "+91"
    static let googleAPiKey = "AIzaSyA0Rw4sntPKrobxyiRNSgh4x31aK9MvIxo"

//    "AIzaSyC4Reycz36OmNMz048T9-E6YErfIRMABMg"
    //static let countryCode = ((NSLocale.current.regionCode)?.lowercased()) ?? "in"
    static let countryCode = "US"
    static var profileData = ProfileModel()
    static var currentTaxi = CurrentActiveTaxi()
    static var driverearningData = earningAmount()
    static var filefor = ""
    static var credits = "0"
    static var lowbalnce = "0"
    static var fcm_id = ""
    static var miniBlncAlrt = "Sorry , Your credits is too low."
    static var EndData = Taxis()
    static var isTwoDriver = ""
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
    static let requestedView = Notification.Name("requestedview")
    static let changedCurrentTaxi = Notification.Name("changedCurrentTaxi")
    static let completedLengthyDownload = Notification.Name("completedLengthyDownload")
    static let vechileStatus = Notification.Name("vechileStatus")
    static let appEnterInForGorund = Notification.Name("appEnterInForGorund")
    static let appEnterInBackGround = Notification.Name("appEnterInBackGround")
}

