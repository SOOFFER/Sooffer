//
//  FireBaseModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 03/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

class FBCancelReason{
    var  alertLabels : FBAlertLabels = FBAlertLabels()
    var Driver_Feedback_reason : FBDriverFeedbackReason = FBDriverFeedbackReason()
    var Driver_reason : FBDriverReason = FBDriverReason()
    var Rider_Feedback_reason : FBRiderFeedbackReason = FBRiderFeedbackReason()
    var Rider_reason : FBRiderReason = FBRiderReason()
    
    init(json : JSON) {
        self.alertLabels = FBAlertLabels.init(json: json["AlertLabels"])
        self.Driver_Feedback_reason = FBDriverFeedbackReason.init(json: json["Driver_Feedback_reason"])
        self.Driver_reason = FBDriverReason.init(json: json["Driver_reason"])
        self.Rider_Feedback_reason = FBRiderFeedbackReason.init(json: json["Rider_Feedback_reason"])
        self.Rider_reason = FBRiderReason.init(json: json["Rider_reason"])
    }
}

class FBAlertLabels{
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

class FBDriverFeedbackReason{
    var reasons : String = ""
    var test : String = ""
    
    init() {}
    init(json : JSON) {
        self.reasons = json["reasons"].string ?? String()
        self.test = json["test"].string ?? String()
        
    }
}

class FBDriverReason{
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

class FBRiderFeedbackReason{
    var riderReasons : String = ""
    var testrider : String = ""
    init(){}
    init(json : JSON) {
        self.riderReasons = json["Rider Reasons"].string ?? String()
        self.testrider = json["Test Rider"].string ?? String()
    }
}

class FBRiderReason{
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
//====================================================================================================

//Riders Data

struct FBRiderDataModel {
    var current_tripid : Int = Int()
    var requestId : String = ""
    var tripdriver : String = ""
    var FCM_id : String = ""
        
    var tripstatus : String = ""
    var email_id : String = ""
    var name : String = ""
    var triptype : String = ""
    init(){}
    init(json : JSON) {
        self.current_tripid = json["current_tripid"].int ?? Int()
        self.requestId = json["requestId"].string ?? String()
        self.FCM_id = json["FCM_id"].string ?? String()
        self.tripdriver = json["tripdriver"].string ?? String()
        self.tripstatus = json["tripstatus"].string ?? String()
        self.email_id = json["email_id"].string ?? String()
        self.name = json["name"].string ?? String()
        self.triptype = json["triptype"].string ?? String()
        
    }
}

class FBOfferLocation{
    var bearing : Double = Double()
    var g : String = String()
    var l : [Double] = []
    init(json : JSON) {
        self.bearing = json["bearing"].double ?? Double()
        self.g = json["g"].string ?? String()
        let latlangarray = json["l"].array
        let latlang = latlangarray?.compactMap({$0.double})
        self.l = latlang ?? []
        
    }
}

struct FBTripDataModel {
    
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
    var gatewayCharge : String = ""
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
    var oldBalance : String = ""
    var booking : String = ""
    var minFare : String = ""
    var surgeAmt : String = ""
    var tollFee : String = ""
    var walletdebt : String = ""
    
    init(){}
    
    init(json : JSON) {
        self.Drop_address = json["Drop_address"].string ?? "0"
        self.Drop_latlng = json["Drop_latlng"].string ?? "0"
        self.cancel_fare = json["cancel_fare"].string ?? "0"
        self.cancelby = json["cancelby"].string ?? "0"
        self.convance_fare = json["convance_fare"].string ?? "0"
        self.datetime = json["datetime"].string ?? "0"
        self.discount = json["discount"].string ?? "0"
        self.driver_token = json["driver_token"].string ?? "0"
        self.rider_token = json["rider_token"].string ?? "0"
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
        self.gatewayCharge = json["gatewayCharge"].string ?? "0"
        self.trip_type = json["trip_type"].string ?? "0"
        self.triptype = json["triptype"].string ?? "0"
        self.time = json["time"].string ?? "0"
        self.time_fare = json["time_fare"].string ?? "0"
        self.total_fare = json["total_fare"].string ?? "0"
        self.waitingTime = json["waitingTime"].string ?? "0"
        self.basefare = json["basefare"].string ?? "0"
        self.invoiceBill = json["invoiceBill"].string ?? ""
        self.oldBalance = json["oldBalance"].string ?? ""
        self.booking = json["booking"].string ?? ""
        self.minFare = json["minFare"].string ?? ""
        self.surgeAmt = json["surgeAmt"].string ?? ""
        self.tollFee = json["tollFee"].string ?? ""
        self.walletdebt = json["walletdebt"].string ?? ""
        
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
