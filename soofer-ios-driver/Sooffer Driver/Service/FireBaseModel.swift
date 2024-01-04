//
//  FireBaseModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 03/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

class CancelReason{
    var  alertLabels : AlertLabels = AlertLabels()
    var Driver_Feedback_reason : DriverFeedbackReason = DriverFeedbackReason()
    var Driver_reason : DriverReason = DriverReason()
    var Rider_Feedback_reason : RiderFeedbackReason = RiderFeedbackReason()
    var Rider_reason : RiderReason = RiderReason()
    
    init(json : JSON) {
        self.alertLabels = AlertLabels.init(json: json["AlertLabels"])
        self.Driver_Feedback_reason = DriverFeedbackReason.init(json: json["Driver_Feedback_reason"])
        self.Driver_reason = DriverReason.init(json: json["Driver_reason"])
        self.Rider_Feedback_reason = RiderFeedbackReason.init(json: json["Rider_Feedback_reason"])
        self.Rider_reason = RiderReason.init(json: json["Rider_reason"])
    }
}

class AlertLabels{
    var DRIVER_NOT_FOUND : String = ""
    var driverCancelLimiitExceeds : String = ""
    var driverPayoutAmountLimitMax : String = ""
    var driverPayoutsType : String = ""
    var exceededminimumBalanceDriverAlert : String = ""
    var isNightExistAlertLabel : String = ""
    var lowBalanceAlert : String = ""
    var minimumBalance : String = ""
    var minimumBalanceDriverAlert : String = ""
    var riderCancelLimiitExceeds : String = ""
    var riderMaximumOldBalance : String = ""
    var riderOldBalanceExceededMessage : String = ""
    
    init() {}
    
    init(json : JSON) {
        self.DRIVER_NOT_FOUND = json["DRIVER_NOT_FOUND"].string ?? String()
        self.driverCancelLimiitExceeds = json["driverCancelLimiitExceeds"].string ?? String()
        self.driverPayoutAmountLimitMax = json["driverPayoutAmountLimitMax"].string ?? String()
        self.driverPayoutsType = json["driverPayoutsType"].string ?? String()
        self.exceededminimumBalanceDriverAlert = json["exceededminimumBalanceDriverAlert"].string ?? String()
        self.isNightExistAlertLabel = json["isNightExistAlertLabel"].string ?? String()
        self.driverCancelLimiitExceeds = json["driverCancelLimiitExceeds"].string ?? String()
        self.lowBalanceAlert = json["lowBalanceAlert"].string ?? String()
        self.minimumBalance = json["minimumBalance"].string ?? String()
        self.minimumBalanceDriverAlert = json["minimumBalanceDriverAlert"].string ?? String()
        self.riderCancelLimiitExceeds = json["riderCancelLimiitExceeds"].string ?? String()
        self.riderMaximumOldBalance = json["riderMaximumOldBalance"].string ?? String()
        self.riderOldBalanceExceededMessage = json["riderOldBalanceExceededMessage"].string ?? String()
    }
}

class DriverFeedbackReason{
    var reasons : String = ""
    var test : String = ""
    
    init() {}
    init(json : JSON) {
        self.reasons = json["reasons"].string ?? String()
        self.test = json["test"].string ?? String()
        
    }
}

class DriverReason{
    var dontchargeRider : String = ""
    var ridernothere : String = ""
    var riderRequestCancel : String = ""
    var toomanyrider : String = ""
    var toomuchtraffic : String = ""
    init(){}
    init(json : JSON) {
        self.dontchargeRider = json[" Don't charge rider"].string ?? String()
        self.ridernothere = json["Rider isn't here"].string ?? String()
        self.riderRequestCancel = json["Rider requested cancel"].string ?? String()
        self.toomanyrider = json["Too many riders"].string ?? String()
        self.toomuchtraffic = json["Too much traffic"].string ?? String()
        
    }
}

class RiderFeedbackReason{
    var riderReasons : String = ""
    var testrider : String = ""
    init(){}
    init(json : JSON) {
        self.riderReasons = json["Rider Reasons"].string ?? String()
        self.testrider = json["Test Rider"].string ?? String()
    }
}

class RiderReason{
    var issue_driver : String = ""
    var issue_fare : String = ""
    var other : String = ""
    init(){}
    init(json : JSON) {
        self.issue_driver = json["I had an issue with my driver"].string ?? String()
        self.issue_fare = json["I had an issue with my fare"].string ?? String()
        self.other = json["Others"].string ?? String()
        
    }
}


//===========================================================================================

struct FBDriverDataModel {
    var cancelExceeds : String = ""
       var FCM_id : String = ""
       var credits : String = ""
       var lastCanceledDate : String = ""
       var online_status : String = ""
       var proof_status : String = ""
       var vehicle_id : String = ""
       var subcriptionEndDate : String = ""
       var accept : FBAcceptModel = FBAcceptModel()
       var request : FBRequestModel = FBRequestModel()
       
       init(){}
       init(json : JSON) {
           self.cancelExceeds = json["cancelExceeds"].string ?? String()
           self.FCM_id = json["FCM_id"].string ?? String()
           self.credits = json["credits"].string ?? String()
           self.lastCanceledDate = json["lastCanceledDate"].string ?? String()
           self.online_status = json["online_status"].string ?? String()
           self.proof_status = json["proof_status"].string ?? String()
           self.vehicle_id = json["vehicle_id"].string ?? String()
           self.subcriptionEndDate = json["subcriptionEndDate"].string ?? String()
           self.accept = FBAcceptModel(json: json["accept"])
           self.request = FBRequestModel(json: json["request"])
           
       }
}

struct FBVehicleDataModel {
    var status : String = ""
          
       init(){}
       init(json : JSON) {
           self.status = json["status"].string ?? String()
    
           
       }
}

struct SafeRideModel {
    var safeRidestatus : String = String()
    var safeRidetripStatus : String = String()
    var secondDriver : String = String()
    var edtMake : String  = String()
    var edtModel : String = String()
    var edtPhoneNumber : String = String()
    var edtcolor : String = String()
    init() {
    }
    
    init(json: JSON) {
        self.safeRidestatus = json["safeRidestatus"].string ?? String()
        self.safeRidetripStatus = json["safeRidetripStatus"].string ?? String()
        self.secondDriver = json["secondDriver"].string ?? String()
        self.edtMake = json["edtMake"].string ?? String()
        self.edtModel = json["edtModel"].string ?? String()
        self.edtPhoneNumber = json["edtPhoneNumber"].string ?? String()
        self.edtcolor = json["edtcolor"].string ?? String()
    }
}

struct FBAcceptModel {
    
    var others : String = ""
    var trip_id : Int = 0
    init(){}
    init(json : JSON) {
        self.others = json["others"].string ?? String()
        self.trip_id = json["trip_id"].int ?? Int()
    }
}

struct SafeRideVechModel {
    var safeRideStatus : String = String()
    var safeRideVech : SafevechModel = SafevechModel()
    var secondDriver : String = String()
    init() {}
    init(json: JSON) {
        safeRideStatus = json["safeRidestatus"].string ?? String()
        safeRideVech = SafevechModel(json: json["safeRidevehicle"])
        self.secondDriver = json["secondDriver"].string ?? String()
    }
}

struct SafevechModel {
    var makename     : String = String()
    var model        : String = String()
    var number       : String = String()
    var vehiclecolor : String = String()
    
    init() {}
    init(json: JSON) {
        makename = json["makename"].string ?? String()
        model = json["model"].string ?? String()
        number = json["number"].string ?? String()
        vehiclecolor = json["vehiclecolor"].string ?? String()
    }
}

struct FBRequestModel {
    var drop_address : String = ""
    var etd : String = ""
    var picku_address : String = ""
    var request_id : String = ""
    var status : String = ""
    var totalKM : String = ""
    var totalFare : String = ""
    var request_type : String = ""
    var triptype : String = ""
    var review : String = ""
    var outstationType :String = ""
    var datetime : String = "" //triptype
    var safeRideData : SafeRideVechModel = SafeRideVechModel()
    init(){}
    init(json : JSON) {
        self.drop_address = json["drop_address"].string ?? String()
        self.etd = json["etd"].string ?? String()
        self.picku_address = json["picku_address"].string ?? String()
        self.request_id = json["request_id"].string ?? String()
        self.status = json["status"].string ?? String()
        self.totalKM = json["totalKM"].string ?? String()
        self.totalFare = json["totalFare"].string ?? String()
        self.request_type = json["request_type"].string ?? String()
        self.triptype = json["triptype"].string ?? String()
        self.review = json["review"].string ?? String()
        self.outstationType = json["outstationType"].string ?? String()
        self.datetime = json["datetime"].string ?? String()
        self.safeRideData = SafeRideVechModel(json: json["safeRideData"])
    }
}


struct FBTripDataModel {
    var driver_id : String = ""
    var Drop_address : String = ""
    var Drop_latlng : String = ""
    var cancel_fare : String = ""
    var cancelby : String = ""
    var convance_fare : String = ""
    var datetime : String = ""
    var discount : String = ""
    var distance : String = ""
    var distance_fare : String = ""
    var driver_alavance_dis : String = ""
    var driver_rating : String = ""
    var duration : String = ""
    var isNight : String = ""
    var isPickup : String = ""
    var isTax : String = ""
    var isWaiting : String = ""
    var waiting_fare : String = ""
    var ispay : String = ""
    var pay_type : String = ""
    var pickup_address : String = ""
    var rider_rating : String = ""
    var status : String = ""
    var tax : String = ""
    var time_fare : String = ""
    var total_fare : String = ""
    var trip_type : String = ""
    var triptype : String = ""
    var time : String = ""
    var waitingTime : String = ""
    var basefare : String = ""
    var invoiceBill : String = ""
    var driver_token : String = ""
    var rider_token : String = ""
    var gatewayCharge : String = ""
    var safeRide : SafeRideModel = SafeRideModel()
    init(){}
    
    init(json : JSON) {
        self.driver_id = json["driver_id"].string ?? "0"
        self.Drop_address = json["Drop_address"].string ?? "0"
        self.Drop_latlng = json["Drop_latlng"].string ?? "0"
        self.cancel_fare = json["cancel_fare"].string ?? "0"
        self.cancelby = json["cancelby"].string ?? "0"
        self.convance_fare = json["convance_fare"].string ?? "0"
        self.datetime = json["datetime"].string ?? "0"
        self.discount = json["discount"].string ?? "0"
        self.distance = json["distance"].string ?? "0"
        self.distance_fare = json["distance_fare"].string ?? "0"
        self.driver_alavance_dis = json["driver_alavance_dis"].string ?? "0"
        self.driver_rating = json["driver_rating"].string ?? "0"
        self.duration = json["duration"].string ?? "0"
        self.isNight = json["isNight"].string ?? "0"
        self.isPickup = json["isPickup"].string ?? "0"
        self.isTax = json["isTax"].string ?? "0"
        self.isWaiting = json["isWaiting"].string ?? "0"
        self.waiting_fare = json["waiting_fare"].string ?? "0"
        self.ispay = json["ispay"].string ?? "0"
        self.pay_type = json["pay_type"].string ?? "0"
        self.pickup_address = json["pickup_address"].string ?? "0"
        self.rider_rating = json["rider_rating"].string ?? "0"
        self.status = json["status"].string ?? "0"
        self.tax = json["tax"].string ?? "0"
        self.trip_type = json["trip_type"].string ?? "0"
        self.triptype = json["triptype"].string ?? "0"
        self.time = json["time"].string ?? "0"
        self.time_fare = json["time_fare"].string ?? "0"
        self.total_fare = json["total_fare"].string ?? "0"
        self.waitingTime = json["waitingTime"].string ?? "0"
        self.basefare = json["basefare"].string ?? "0"
        self.invoiceBill = json["invoiceBill"].string ?? ""
        self.driver_token = json["driver_token"].string ?? "0"
        self.gatewayCharge = json["gatewayCharge"].string ?? "0"
        
        self.rider_token = json["rider_token"].string ?? "0"
        self.safeRide = SafeRideModel(json: json["safeRideData"])
        
    }
}


class FBchatmsg{
    var messsage : String = ""
    var timestamp : String = ""
    var type : String = ""
    init(json : JSON) {
        self.messsage = json["message"].string ?? String()
        self.timestamp = json["timestamp"].string ?? String()
        self.type = json["type"].string ?? String()
        
    }
}


