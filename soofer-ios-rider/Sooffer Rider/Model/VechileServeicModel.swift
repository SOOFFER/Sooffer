//
//  VechileServeicModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 28/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON


class VechileServiceModel{
    var VechileListList : [VechileListData] = [VechileListData]()
    var message: String =  String()
    var phone: String =  String()

    var success: Bool =  Bool()
    
    init() {}
    
    init(json : JSON) {
        let vechileArray = json["vehicleCategories"].array
        let vechileList = vechileArray?.compactMap({ (jsonVal) -> VechileListData? in
            return VechileListData.init(json: jsonVal)
        })
        self.VechileListList = vechileList ?? [VechileListData]()
        self.phone = json["phone"].string ?? String()
        self.message = json["message"].string ?? String()
        self.success = json["success"].bool ?? Bool()
        
    }
}

class VechileListData{
    
        var _id: String =  String()
        var type: String =  String()
        var tripTypeCode: String =  String()
        var bkm: Int =  Int()
        var eta : String = String()
        var file: String =  String()
        var available : Bool = Bool()
        var isRideLater: Bool = Bool()
        var asppc: Int =  Int()
        var totalFare: String =  String()
        var seats : Int = Int()
    init(){}
    init(json : JSON) {
        
        self._id = json["_id"].string ?? String()
        self.type = json["type"].string ?? String()
        self.eta = json["eta"].string ?? String()
        self.tripTypeCode = json["tripTypeCode"].string ?? String()
        self.bkm = json["bkm"].int ?? Int()
        self.file = json["file"].string ?? String()
        self.available = json["available"].bool ?? Bool()
        self.isRideLater = json["isRideLater"].bool ?? Bool()
        self.asppc = json["asppc"].int ?? Int()
        self.totalFare = json["totalFare"].string ?? String()
        self.seats = json["seats"].int ?? Int()
    }
}

//Fare Details


class EstimateFareDetails : NSObject, NSCoding{
    
    var distanceDetails : DistanceDetail = DistanceDetail()
    var estimationId : String = String()
    var message : String = String()
    var pickupCity : String = String()
    var success : Bool = Bool()
    var vehicleDetailsAndFare : VehicleDetailsAndFare = VehicleDetailsAndFare()
    
    override init(){
        
    }
    
    /**
     * Instantiate the instance using the passed dictionary values to set the properties values
     */
    init(fromJson dictionary: [String:Any]){
        if let distanceDetailsData = dictionary["distanceDetails"] as? [String:Any]{
            distanceDetails = DistanceDetail(fromDictionary: distanceDetailsData)
        }
        estimationId = dictionary["estimationId"] as? String ?? ""
        message = dictionary["message"] as? String ?? ""
        pickupCity = dictionary["pickupCity"] as? String ?? ""
        success = dictionary["success"] as? Bool ?? Bool()
        if let vehicleDetailsAndFareData = dictionary["vehicleDetailsAndFare"] as? [String:Any]{
            vehicleDetailsAndFare = VehicleDetailsAndFare(fromDictionary: vehicleDetailsAndFareData)
        }
    }
    
    /**
     * Returns all the available property values in the form of [String:Any] object where the key is the approperiate json key and the value is the value of the corresponding property
     */
    func toDictionary() -> [String:Any]
    {
        var dictionary = [String:Any]()
        if distanceDetails != nil{
            dictionary["distanceDetails"] = distanceDetails.toDictionary()
        }
        if estimationId != nil{
            dictionary["estimationId"] = estimationId
        }
        if message != nil{
            dictionary["message"] = message
        }
        if pickupCity != nil{
            dictionary["pickupCity"] = pickupCity
        }
        if success != nil{
            dictionary["success"] = success
        }
        if vehicleDetailsAndFare != nil{
            dictionary["vehicleDetailsAndFare"] = vehicleDetailsAndFare.toDictionary()
        }
        return dictionary
    }
    
    /**
     * NSCoding required initializer.
     * Fills the data from the passed decoder
     */
    @objc required init(coder aDecoder: NSCoder)
    {
        distanceDetails = aDecoder.decodeObject(forKey: "distanceDetails") as? DistanceDetail ?? DistanceDetail()
        estimationId = aDecoder.decodeObject(forKey: "estimationId") as? String ?? ""
        message = aDecoder.decodeObject(forKey: "message") as? String ?? ""
        pickupCity = aDecoder.decodeObject(forKey: "pickupCity") as? String ?? ""
        success = aDecoder.decodeObject(forKey: "success") as? Bool ?? Bool()
        vehicleDetailsAndFare = aDecoder.decodeObject(forKey: "vehicleDetailsAndFare") as? VehicleDetailsAndFare ?? VehicleDetailsAndFare()
        
    }
    
    /**
     * NSCoding required method.
     * Encodes mode properties into the decoder
     */
    @objc func encode(with aCoder: NSCoder)
    {
        if distanceDetails != nil{
            aCoder.encode(distanceDetails, forKey: "distanceDetails")
        }
        if estimationId != nil{
            aCoder.encode(estimationId, forKey: "estimationId")
        }
        if message != nil{
            aCoder.encode(message, forKey: "message")
        }
        if pickupCity != nil{
            aCoder.encode(pickupCity, forKey: "pickupCity")
        }
        if success != nil{
            aCoder.encode(success, forKey: "success")
        }
        if vehicleDetailsAndFare != nil{
            aCoder.encode(vehicleDetailsAndFare, forKey: "vehicleDetailsAndFare")
        }
        
    }
    
}



class VehicleDetailsAndFare : NSObject, NSCoding{
    
    var applyValues : ApplyValue = ApplyValue()
    var fareDetails : FareDetail = FareDetail()
    var offers : Offer = Offer()
    var vehicleDetails : VehicleDetail = VehicleDetail()
    
    override init(){
        
    }
    
    /**
     * Instantiate the instance using the passed dictionary values to set the properties values
     */
    init(fromDictionary dictionary: [String:Any]){
        if let applyValuesData = dictionary["applyValues"] as? [String:Any]{
            applyValues = ApplyValue(fromDictionary: applyValuesData)
        }
        if let fareDetailsData = dictionary["fareDetails"] as? [String:Any]{
            fareDetails = FareDetail(fromDictionary: fareDetailsData)
        }
        if let offersData = dictionary["offers"] as? [String:Any]{
            offers = Offer(fromDictionary: offersData)
        }
        if let vehicleDetailsData = dictionary["vehicleDetails"] as? [String:Any]{
            vehicleDetails = VehicleDetail(fromDictionary: vehicleDetailsData)
        }
    }
    
    /**
     * Returns all the available property values in the form of [String:Any] object where the key is the approperiate json key and the value is the value of the corresponding property
     */
    func toDictionary() -> [String:Any]
    {
        var dictionary = [String:Any]()
        if applyValues != nil{
            dictionary["applyValues"] = applyValues.toDictionary()
        }
        if fareDetails != nil{
            dictionary["fareDetails"] = fareDetails.toDictionary()
        }
        if offers != nil{
            dictionary["offers"] = offers.toDictionary()
        }
        if vehicleDetails != nil{
            dictionary["vehicleDetails"] = vehicleDetails.toDictionary()
        }
        return dictionary
    }
    
    /**
     * NSCoding required initializer.
     * Fills the data from the passed decoder
     */
    @objc required init(coder aDecoder: NSCoder)
    {
        applyValues = aDecoder.decodeObject(forKey: "applyValues") as? ApplyValue ?? ApplyValue()
        fareDetails = aDecoder.decodeObject(forKey: "fareDetails") as? FareDetail ?? FareDetail()
        offers = aDecoder.decodeObject(forKey: "offers") as? Offer ?? Offer()
        vehicleDetails = aDecoder.decodeObject(forKey: "vehicleDetails") as? VehicleDetail ?? VehicleDetail()
        
    }
    
    /**
     * NSCoding required method.
     * Encodes mode properties into the decoder
     */
    @objc func encode(with aCoder: NSCoder)
    {
        if applyValues != nil{
            aCoder.encode(applyValues, forKey: "applyValues")
        }
        if fareDetails != nil{
            aCoder.encode(fareDetails, forKey: "fareDetails")
        }
        if offers != nil{
            aCoder.encode(offers, forKey: "offers")
        }
        if vehicleDetails != nil{
            aCoder.encode(vehicleDetails, forKey: "vehicleDetails")
        }
        
    }
    
}



class VehicleDetail : NSObject, NSCoding{
    
    var available : Bool = Bool()
    var descriptionField : String = String()
    var features : [String]!
    var image : String = String()
    var seats : Int = Int()
    var serviceId : String = String()
    var type : String = String()
    
    override init(){
        
    }
    
    /**
     * Instantiate the instance using the passed dictionary values to set the properties values
     */
    init(fromDictionary dictionary: [String:Any]){
        available = dictionary["available"] as? Bool ?? Bool()
        descriptionField = dictionary["description"] as? String ?? ""
        features = dictionary["features"] as? [String]
        image = dictionary["image"] as? String ?? ""
        seats = dictionary["seats"] as? Int ?? Int()
        serviceId = dictionary["serviceId"] as? String ?? ""
        type = dictionary["type"] as? String ?? ""
    }
    
    /**
     * Returns all the available property values in the form of [String:Any] object where the key is the approperiate json key and the value is the value of the corresponding property
     */
    func toDictionary() -> [String:Any]
    {
        var dictionary = [String:Any]()
        if available != nil{
            dictionary["available"] = available
        }
        if descriptionField != nil{
            dictionary["description"] = descriptionField
        }
        if features != nil{
            dictionary["features"] = features
        }
        if image != nil{
            dictionary["image"] = image
        }
        if seats != nil{
            dictionary["seats"] = seats
        }
        if serviceId != nil{
            dictionary["serviceId"] = serviceId
        }
        if type != nil{
            dictionary["type"] = type
        }
        return dictionary
    }
    
    /**
     * NSCoding required initializer.
     * Fills the data from the passed decoder
     */
    @objc required init(coder aDecoder: NSCoder)
    {
        available = aDecoder.decodeObject(forKey: "available") as? Bool ?? Bool()
        descriptionField = aDecoder.decodeObject(forKey: "description") as? String ?? ""
        features = aDecoder.decodeObject(forKey: "features") as? [String]
        image = aDecoder.decodeObject(forKey: "image") as? String ?? ""
        seats = aDecoder.decodeObject(forKey: "seats") as? Int ?? Int()
        serviceId = aDecoder.decodeObject(forKey: "serviceId") as? String ?? ""
        type = aDecoder.decodeObject(forKey: "type") as? String ?? ""
        
    }
    
    /**
     * NSCoding required method.
     * Encodes mode properties into the decoder
     */
    @objc func encode(with aCoder: NSCoder)
    {
        if available != nil{
            aCoder.encode(available, forKey: "available")
        }
        if descriptionField != nil{
            aCoder.encode(descriptionField, forKey: "description")
        }
        if features != nil{
            aCoder.encode(features, forKey: "features")
        }
        if image != nil{
            aCoder.encode(image, forKey: "image")
        }
        if seats != nil{
            aCoder.encode(seats, forKey: "seats")
        }
        if serviceId != nil{
            aCoder.encode(serviceId, forKey: "serviceId")
        }
        if type != nil{
            aCoder.encode(type, forKey: "type")
        }
        
    }
    
}


class Offer : NSObject, NSCoding{
    
    var cmpyAllowance : Bool = Bool()
    var discount : Int = Int()
    var offerPerDay : Int = Int()
    var offerPerUser : Int = Int()
    
    override init(){
        
    }
    /**
     * Instantiate the instance using the passed dictionary values to set the properties values
     */
    init(fromDictionary dictionary: [String:Any]){
        cmpyAllowance = dictionary["cmpyAllowance"] as? Bool ?? Bool()
        discount = dictionary["discount"] as? Int ?? Int()
        offerPerDay = dictionary["offerPerDay"] as? Int ?? Int()
        offerPerUser = dictionary["offerPerUser"] as? Int ?? Int()
    }
    
    /**
     * Returns all the available property values in the form of [String:Any] object where the key is the approperiate json key and the value is the value of the corresponding property
     */
    func toDictionary() -> [String:Any]
    {
        var dictionary = [String:Any]()
        if cmpyAllowance != nil{
            dictionary["cmpyAllowance"] = cmpyAllowance
        }
        if discount != nil{
            dictionary["discount"] = discount
        }
        if offerPerDay != nil{
            dictionary["offerPerDay"] = offerPerDay
        }
        if offerPerUser != nil{
            dictionary["offerPerUser"] = offerPerUser
        }
        return dictionary
    }
    
    /**
     * NSCoding required initializer.
     * Fills the data from the passed decoder
     */
    @objc required init(coder aDecoder: NSCoder)
    {
        cmpyAllowance = aDecoder.decodeObject(forKey: "cmpyAllowance") as? Bool ?? Bool()
        discount = aDecoder.decodeObject(forKey: "discount") as? Int ?? Int()
        offerPerDay = aDecoder.decodeObject(forKey: "offerPerDay") as? Int ?? Int()
        offerPerUser = aDecoder.decodeObject(forKey: "offerPerUser") as? Int ?? Int()
        
    }
    
    /**
     * NSCoding required method.
     * Encodes mode properties into the decoder
     */
    @objc func encode(with aCoder: NSCoder)
    {
        if cmpyAllowance != nil{
            aCoder.encode(cmpyAllowance, forKey: "cmpyAllowance")
        }
        if discount != nil{
            aCoder.encode(discount, forKey: "discount")
        }
        if offerPerDay != nil{
            aCoder.encode(offerPerDay, forKey: "offerPerDay")
        }
        if offerPerUser != nil{
            aCoder.encode(offerPerUser, forKey: "offerPerUser")
        }
        
    }
    
}



class FareDetail : NSObject, NSCoding{
    
    var balanceFare  : String = String()
    var baseFare : String = String()
    var detuctedFare : String = String()
    var kMFare  : String = String()
    var cancelationFeesDriver : String = String()
    var cancelationFeesRider : String = String()
    var comison : String = String()
    var comisonAmt : String = String()
    var currency : String = String()
    var distance : String = String()
    var distanceObj : AnyObject!
    var fareAmt : String = String()
    var fareAmtBeforeSurge  : String = String()
    var fareType : String = String()
    var flatFare  : String = String()
    var hotelcommision  : String = String()
    var hotelcommisionAmt  : String = String()
    var inSecondaryCur : String = String()
    var isTax : Bool = Bool()
    var minFare  : String = String()
    var nightObj : NightObj = NightObj()
    var oldCancellationAmt  : String = String()
    var paymentMode : String = String()
    var peakObj : NightObj = NightObj()
    var perKMRate  : String = String()
    var pickupCharge  : String = String()
    var tax  : String = String()
    var taxPercentage  : String = String()
    var timeRate  : String = String()
    var totalFare  : String = String()
    var totalFareWithOutOldBal  : String = String()
    var travelFare : String = String()
    var travelRate  : String = String()
    var travelTime : String = String()
    var waitingCharge  : String = String()
    var waitingFare : String = String()
    var waitingTime  : String = String()
    var bookingFare  : String = String()
    var surgeAmt  : String = String()
    
    override init(){
        
    }
    /**
     * Instantiate the instance using the passed dictionary values to set the properties values
     */
    init(fromDictionary dictionary: [String:Any]){
        balanceFare = dictionary["BalanceFare"]  as? String ?? ""
        baseFare = dictionary["BaseFare"]  as? String ?? ""
        detuctedFare = dictionary["DetuctedFare"]  as? String ?? ""
        kMFare = dictionary["KMFare"] as? String ?? ""
        cancelationFeesDriver = dictionary["cancelationFeesDriver"] as? String ?? ""
        cancelationFeesRider = dictionary["cancelationFeesRider"]  as? String ?? ""
        comison = dictionary["comison"]  as? String ?? ""
        comisonAmt = dictionary["comisonAmt"]  as? String ?? ""
        currency = dictionary["currency"] as? String ?? ""
        distance = dictionary["distance"] as? String ?? ""
        distanceObj = dictionary["distanceObj"] as? AnyObject
        fareAmt = dictionary["fareAmt"]  as? String ?? ""
        fareAmtBeforeSurge = dictionary["fareAmtBeforeSurge"]  as? String ?? ""
        fareType = dictionary["fareType"] as? String ?? ""
        flatFare = dictionary["flatFare"]  as? String ?? ""
        hotelcommision = dictionary["hotelcommision"]  as? String ?? ""
        hotelcommisionAmt = dictionary["hotelcommisionAmt"]  as? String ?? ""
        inSecondaryCur = dictionary["inSecondaryCur"] as? String ?? ""
        isTax = dictionary["isTax"] as? Bool ?? Bool()
        minFare = dictionary["minFare"] as? String ?? ""
        if let nightObjData = dictionary["nightObj"] as? [String:Any]{
            nightObj = NightObj(fromDictionary: nightObjData)
        }
        oldCancellationAmt = dictionary["oldCancellationAmt"]  as? String ?? ""
        paymentMode = dictionary["paymentMode"] as? String ?? ""
        if let peakObjData = dictionary["peakObj"] as? [String:Any]{
            peakObj = NightObj(fromDictionary: peakObjData)
        }
        perKMRate = dictionary["perKMRate"]  as? String ?? ""
        pickupCharge = dictionary["pickupCharge"]  as? String ?? ""
        tax = dictionary["tax"]  as? String ?? ""
        taxPercentage = dictionary["taxPercentage"]  as? String ?? ""
        timeRate = dictionary["timeRate"] as? String ?? ""
        totalFare = dictionary["totalFare"]  as? String ?? ""
        totalFareWithOutOldBal = dictionary["totalFareWithOutOldBal"]  as? String ?? ""
        travelFare = dictionary["travelFare"] as? String ?? ""
        travelRate = dictionary["travelRate"]  as? String ?? ""
        travelTime = dictionary["travelTime"] as? String ?? ""
        waitingCharge = dictionary["waitingCharge"]  as? String ?? ""
        waitingFare = dictionary["waitingFare"] as? String ?? ""
        waitingTime = dictionary["waitingTime"]  as? String ?? ""
        bookingFare = dictionary["bookingFare"]  as? String ?? ""
        surgeAmt = dictionary["surgeAmt"]  as? String ?? ""
    }
    
    /**
     * Returns all the available property values in the form of [String:Any] object where the key is the approperiate json key and the value is the value of the corresponding property
     */
    func toDictionary() -> [String:Any]
    {
        var dictionary = [String:Any]()
        if balanceFare != nil{
            dictionary["BalanceFare"] = balanceFare
        }
        if baseFare != nil{
            dictionary["BaseFare"] = baseFare
        }
        if detuctedFare != nil{
            dictionary["DetuctedFare"] = detuctedFare
        }
        if kMFare != nil{
            dictionary["KMFare"] = kMFare
        }
        if cancelationFeesDriver != nil{
            dictionary["cancelationFeesDriver"] = cancelationFeesDriver
        }
        if cancelationFeesRider != nil{
            dictionary["cancelationFeesRider"] = cancelationFeesRider
        }
        if comison != nil{
            dictionary["comison"] = comison
        }
        if comisonAmt != nil{
            dictionary["comisonAmt"] = comisonAmt
        }
        if currency != nil{
            dictionary["currency"] = currency
        }
        if distance != nil{
            dictionary["distance"] = distance
        }
        if distanceObj != nil{
            dictionary["distanceObj"] = distanceObj
        }
        if fareAmt != nil{
            dictionary["fareAmt"] = fareAmt
        }
        if fareAmtBeforeSurge != nil{
            dictionary["fareAmtBeforeSurge"] = fareAmtBeforeSurge
        }
        if fareType != nil{
            dictionary["fareType"] = fareType
        }
        if flatFare != nil{
            dictionary["flatFare"] = flatFare
        }
        if hotelcommision != nil{
            dictionary["hotelcommision"] = hotelcommision
        }
        if hotelcommisionAmt != nil{
            dictionary["hotelcommisionAmt"] = hotelcommisionAmt
        }
        if inSecondaryCur != nil{
            dictionary["inSecondaryCur"] = inSecondaryCur
        }
        if isTax != nil{
            dictionary["isTax"] = isTax
        }
        if minFare != nil{
            dictionary["minFare"] = minFare
        }
        if nightObj != nil{
            dictionary["nightObj"] = nightObj.toDictionary()
        }
        if oldCancellationAmt != nil{
            dictionary["oldCancellationAmt"] = oldCancellationAmt
        }
        if paymentMode != nil{
            dictionary["paymentMode"] = paymentMode
        }
        if peakObj != nil{
            dictionary["peakObj"] = peakObj.toDictionary()
        }
        if perKMRate != nil{
            dictionary["perKMRate"] = perKMRate
        }
        if pickupCharge != nil{
            dictionary["pickupCharge"] = pickupCharge
        }
        if tax != nil{
            dictionary["tax"] = tax
        }
        if taxPercentage != nil{
            dictionary["taxPercentage"] = taxPercentage
        }
        if timeRate != nil{
            dictionary["timeRate"] = timeRate
        }
        if totalFare != nil{
            dictionary["totalFare"] = totalFare
        }
        if totalFareWithOutOldBal != nil{
            dictionary["totalFareWithOutOldBal"] = totalFareWithOutOldBal
        }
        if travelFare != nil{
            dictionary["travelFare"] = travelFare
        }
        if travelRate != nil{
            dictionary["travelRate"] = travelRate
        }
        if travelTime != nil{
            dictionary["travelTime"] = travelTime
        }
        if waitingCharge != nil{
            dictionary["waitingCharge"] = waitingCharge
        }
        if waitingFare != nil{
            dictionary["waitingFare"] = waitingFare
        }
        if waitingTime != nil{
            dictionary["waitingTime"] = waitingTime
        }
        return dictionary
    }
    
    /**
     * NSCoding required initializer.
     * Fills the data from the passed decoder
     */
    @objc required init(coder aDecoder: NSCoder)
    {
        balanceFare = aDecoder.decodeObject(forKey: "BalanceFare")  as? String ?? ""
        baseFare = aDecoder.decodeObject(forKey: "BaseFare")  as? String ?? ""
        detuctedFare = aDecoder.decodeObject(forKey: "DetuctedFare")  as? String ?? ""
        kMFare = aDecoder.decodeObject(forKey: "KMFare")  as? String ?? ""
        cancelationFeesDriver = aDecoder.decodeObject(forKey: "cancelationFeesDriver")  as? String ?? ""
        cancelationFeesRider = aDecoder.decodeObject(forKey: "cancelationFeesRider")  as? String ?? ""
        comison = aDecoder.decodeObject(forKey: "comison")  as? String ?? ""
        comisonAmt = aDecoder.decodeObject(forKey: "comisonAmt")  as? String ?? ""
        currency = aDecoder.decodeObject(forKey: "currency") as? String ?? ""
        distance = aDecoder.decodeObject(forKey: "distance") as? String ?? ""
        distanceObj = aDecoder.decodeObject(forKey: "distanceObj") as? AnyObject
        fareAmt = aDecoder.decodeObject(forKey: "fareAmt")  as? String ?? ""
        fareAmtBeforeSurge = aDecoder.decodeObject(forKey: "fareAmtBeforeSurge")  as? String ?? ""
        fareType = aDecoder.decodeObject(forKey: "fareType") as? String ?? ""
        flatFare = aDecoder.decodeObject(forKey: "flatFare")  as? String ?? ""
        hotelcommision = aDecoder.decodeObject(forKey: "hotelcommision")  as? String ?? ""
        hotelcommisionAmt = aDecoder.decodeObject(forKey: "hotelcommisionAmt")  as? String ?? ""
        inSecondaryCur = aDecoder.decodeObject(forKey: "inSecondaryCur") as? String ?? ""
        isTax = aDecoder.decodeObject(forKey: "isTax") as? Bool ?? Bool()
        minFare = aDecoder.decodeObject(forKey: "minFare")  as? String ?? ""
        nightObj = aDecoder.decodeObject(forKey: "nightObj") as? NightObj ?? NightObj()
        oldCancellationAmt = aDecoder.decodeObject(forKey: "oldCancellationAmt")  as? String ?? ""
        paymentMode = aDecoder.decodeObject(forKey: "paymentMode") as? String ?? ""
        peakObj = aDecoder.decodeObject(forKey: "peakObj") as? NightObj ?? NightObj()
        perKMRate = aDecoder.decodeObject(forKey: "perKMRate")  as? String ?? ""
        pickupCharge = aDecoder.decodeObject(forKey: "pickupCharge")  as? String ?? ""
        tax = aDecoder.decodeObject(forKey: "tax")  as? String ?? ""
        taxPercentage = aDecoder.decodeObject(forKey: "taxPercentage")  as? String ?? ""
        timeRate = aDecoder.decodeObject(forKey: "timeRate")  as? String ?? ""
        totalFare = aDecoder.decodeObject(forKey: "totalFare")  as? String ?? ""
        totalFareWithOutOldBal = aDecoder.decodeObject(forKey: "totalFareWithOutOldBal")  as? String ?? ""
        travelFare = aDecoder.decodeObject(forKey: "travelFare") as? String ?? ""
        travelRate = aDecoder.decodeObject(forKey: "travelRate")  as? String ?? ""
        travelTime = aDecoder.decodeObject(forKey: "travelTime") as? String ?? ""
        waitingCharge = aDecoder.decodeObject(forKey: "waitingCharge")  as? String ?? ""
        waitingFare = aDecoder.decodeObject(forKey: "waitingFare") as? String ?? ""
        waitingTime = aDecoder.decodeObject(forKey: "waitingTime")  as? String ?? ""
        
    }
    
    /**
     * NSCoding required method.
     * Encodes mode properties into the decoder
     */
    @objc func encode(with aCoder: NSCoder)
    {
        if balanceFare != nil{
            aCoder.encode(balanceFare, forKey: "BalanceFare")
        }
        if baseFare != nil{
            aCoder.encode(baseFare, forKey: "BaseFare")
        }
        if detuctedFare != nil{
            aCoder.encode(detuctedFare, forKey: "DetuctedFare")
        }
        if kMFare != nil{
            aCoder.encode(kMFare, forKey: "KMFare")
        }
        if cancelationFeesDriver != nil{
            aCoder.encode(cancelationFeesDriver, forKey: "cancelationFeesDriver")
        }
        if cancelationFeesRider != nil{
            aCoder.encode(cancelationFeesRider, forKey: "cancelationFeesRider")
        }
        if comison != nil{
            aCoder.encode(comison, forKey: "comison")
        }
        if comisonAmt != nil{
            aCoder.encode(comisonAmt, forKey: "comisonAmt")
        }
        if currency != nil{
            aCoder.encode(currency, forKey: "currency")
        }
        if distance != nil{
            aCoder.encode(distance, forKey: "distance")
        }
        if distanceObj != nil{
            aCoder.encode(distanceObj, forKey: "distanceObj")
        }
        if fareAmt != nil{
            aCoder.encode(fareAmt, forKey: "fareAmt")
        }
        if fareAmtBeforeSurge != nil{
            aCoder.encode(fareAmtBeforeSurge, forKey: "fareAmtBeforeSurge")
        }
        if fareType != nil{
            aCoder.encode(fareType, forKey: "fareType")
        }
        if flatFare != nil{
            aCoder.encode(flatFare, forKey: "flatFare")
        }
        if hotelcommision != nil{
            aCoder.encode(hotelcommision, forKey: "hotelcommision")
        }
        if hotelcommisionAmt != nil{
            aCoder.encode(hotelcommisionAmt, forKey: "hotelcommisionAmt")
        }
        if inSecondaryCur != nil{
            aCoder.encode(inSecondaryCur, forKey: "inSecondaryCur")
        }
        if isTax != nil{
            aCoder.encode(isTax, forKey: "isTax")
        }
        if minFare != nil{
            aCoder.encode(minFare, forKey: "minFare")
        }
        if nightObj != nil{
            aCoder.encode(nightObj, forKey: "nightObj")
        }
        if oldCancellationAmt != nil{
            aCoder.encode(oldCancellationAmt, forKey: "oldCancellationAmt")
        }
        if paymentMode != nil{
            aCoder.encode(paymentMode, forKey: "paymentMode")
        }
        if peakObj != nil{
            aCoder.encode(peakObj, forKey: "peakObj")
        }
        if perKMRate != nil{
            aCoder.encode(perKMRate, forKey: "perKMRate")
        }
        if pickupCharge != nil{
            aCoder.encode(pickupCharge, forKey: "pickupCharge")
        }
        if tax != nil{
            aCoder.encode(tax, forKey: "tax")
        }
        if taxPercentage != nil{
            aCoder.encode(taxPercentage, forKey: "taxPercentage")
        }
        if timeRate != nil{
            aCoder.encode(timeRate, forKey: "timeRate")
        }
        if totalFare != nil{
            aCoder.encode(totalFare, forKey: "totalFare")
        }
        if totalFareWithOutOldBal != nil{
            aCoder.encode(totalFareWithOutOldBal, forKey: "totalFareWithOutOldBal")
        }
        if travelFare != nil{
            aCoder.encode(travelFare, forKey: "travelFare")
        }
        if travelRate != nil{
            aCoder.encode(travelRate, forKey: "travelRate")
        }
        if travelTime != nil{
            aCoder.encode(travelTime, forKey: "travelTime")
        }
        if waitingCharge != nil{
            aCoder.encode(waitingCharge, forKey: "waitingCharge")
        }
        if waitingFare != nil{
            aCoder.encode(waitingFare, forKey: "waitingFare")
        }
        if waitingTime != nil{
            aCoder.encode(waitingTime, forKey: "waitingTime")
        }
        
    }
    
}



class NightObj : NSObject, NSCoding{
    
    var alertLable : String = String()
    var isApply : Bool = Bool()
    var percentageIncrease : Int = Int()
    
    override init(){
        
    }
    /**
     * Instantiate the instance using the passed dictionary values to set the properties values
     */
    init(fromDictionary dictionary: [String:Any]){
        alertLable = dictionary["alertLable"] as? String ?? ""
        isApply = dictionary["isApply"] as? Bool ?? Bool()
        percentageIncrease = dictionary["percentageIncrease"] as? Int ?? Int()
    }
    
    /**
     * Returns all the available property values in the form of [String:Any] object where the key is the approperiate json key and the value is the value of the corresponding property
     */
    func toDictionary() -> [String:Any]
    {
        var dictionary = [String:Any]()
        if alertLable != nil{
            dictionary["alertLable"] = alertLable
        }
        if isApply != nil{
            dictionary["isApply"] = isApply
        }
        if percentageIncrease != nil{
            dictionary["percentageIncrease"] = percentageIncrease
        }
        return dictionary
    }
    
    /**
     * NSCoding required initializer.
     * Fills the data from the passed decoder
     */
    @objc required init(coder aDecoder: NSCoder)
    {
        alertLable = aDecoder.decodeObject(forKey: "alertLable") as? String ?? ""
        isApply = aDecoder.decodeObject(forKey: "isApply") as? Bool ?? Bool()
        percentageIncrease = aDecoder.decodeObject(forKey: "percentageIncrease") as? Int ?? Int()
        
    }
    
    /**
     * NSCoding required method.
     * Encodes mode properties into the decoder
     */
    @objc func encode(with aCoder: NSCoder)
    {
        if alertLable != nil{
            aCoder.encode(alertLable, forKey: "alertLable")
        }
        if isApply != nil{
            aCoder.encode(isApply, forKey: "isApply")
        }
        if percentageIncrease != nil{
            aCoder.encode(percentageIncrease, forKey: "percentageIncrease")
        }
        
    }
    
}


class ApplyValue : NSObject, NSCoding{
    
    var applyCommission : Bool = Bool()
    var applyNightCharge : Bool = Bool()
    var applyPeakCharge : Bool = Bool()
    var applyPickupCharge : Bool = Bool()
    var applyTax : Bool = Bool()
    var applyWaitingTime : Bool = Bool()
    
    override init(){
        
    }
    /**
     * Instantiate the instance using the passed dictionary values to set the properties values
     */
    init(fromDictionary dictionary: [String:Any]){
        applyCommission = dictionary["applyCommission"] as? Bool ?? Bool()
        applyNightCharge = dictionary["applyNightCharge"] as? Bool ?? Bool()
        applyPeakCharge = dictionary["applyPeakCharge"] as? Bool ?? Bool()
        applyPickupCharge = dictionary["applyPickupCharge"] as? Bool ?? Bool()
        applyTax = dictionary["applyTax"] as? Bool ?? Bool()
        applyWaitingTime = dictionary["applyWaitingTime"] as? Bool ?? Bool()
    }
    
    /**
     * Returns all the available property values in the form of [String:Any] object where the key is the approperiate json key and the value is the value of the corresponding property
     */
    func toDictionary() -> [String:Any]
    {
        var dictionary = [String:Any]()
        if applyCommission != nil{
            dictionary["applyCommission"] = applyCommission
        }
        if applyNightCharge != nil{
            dictionary["applyNightCharge"] = applyNightCharge
        }
        if applyPeakCharge != nil{
            dictionary["applyPeakCharge"] = applyPeakCharge
        }
        if applyPickupCharge != nil{
            dictionary["applyPickupCharge"] = applyPickupCharge
        }
        if applyTax != nil{
            dictionary["applyTax"] = applyTax
        }
        if applyWaitingTime != nil{
            dictionary["applyWaitingTime"] = applyWaitingTime
        }
        return dictionary
    }
    
    /**
     * NSCoding required initializer.
     * Fills the data from the passed decoder
     */
    @objc required init(coder aDecoder: NSCoder)
    {
        applyCommission = aDecoder.decodeObject(forKey: "applyCommission") as? Bool ?? Bool()
        applyNightCharge = aDecoder.decodeObject(forKey: "applyNightCharge") as? Bool ?? Bool()
        applyPeakCharge = aDecoder.decodeObject(forKey: "applyPeakCharge") as? Bool ?? Bool()
        applyPickupCharge = aDecoder.decodeObject(forKey: "applyPickupCharge") as? Bool ?? Bool()
        applyTax = aDecoder.decodeObject(forKey: "applyTax") as? Bool ?? Bool()
        applyWaitingTime = aDecoder.decodeObject(forKey: "applyWaitingTime") as? Bool ?? Bool()
        
    }
    
    /**
     * NSCoding required method.
     * Encodes mode properties into the decoder
     */
    @objc func encode(with aCoder: NSCoder)
    {
        if applyCommission != nil{
            aCoder.encode(applyCommission, forKey: "applyCommission")
        }
        if applyNightCharge != nil{
            aCoder.encode(applyNightCharge, forKey: "applyNightCharge")
        }
        if applyPeakCharge != nil{
            aCoder.encode(applyPeakCharge, forKey: "applyPeakCharge")
        }
        if applyPickupCharge != nil{
            aCoder.encode(applyPickupCharge, forKey: "applyPickupCharge")
        }
        if applyTax != nil{
            aCoder.encode(applyTax, forKey: "applyTax")
        }
        if applyWaitingTime != nil{
            aCoder.encode(applyWaitingTime, forKey: "applyWaitingTime")
        }
        
    }
    
}




class DistanceDetail : NSObject, NSCoding{
    
    var distanceLable : String = String()
    var distanceValue : Int = Int()
    var endcoords : [Float]!
    var error : Bool = Bool()
    var from : String = String()
    var msg : String = String()
    var startCords : [Float]!
    var timeLable : String = String()
    var timeValue : Int = Int()
    var to : String = String()
    
    override init(){
        
    }
    /**
     * Instantiate the instance using the passed dictionary values to set the properties values
     */
    init(fromDictionary dictionary: [String:Any]){
        distanceLable = dictionary["distanceLable"] as? String ?? "" ?? ""
        distanceValue = dictionary["distanceValue"] as? Int ?? Int()
        endcoords = dictionary["endcoords"] as? [Float]
        error = dictionary["error"] as? Bool ?? Bool()
        from = dictionary["from"] as? String ?? ""
        msg = dictionary["msg"] as? String ?? ""
        startCords = dictionary["startCords"] as? [Float]
        timeLable = dictionary["timeLable"] as? String ?? ""
        timeValue = dictionary["timeValue"] as? Int ?? Int()
        to = dictionary["to"] as? String ?? ""
    }
    
    /**
     * Returns all the available property values in the form of [String:Any] object where the key is the approperiate json key and the value is the value of the corresponding property
     */
    func toDictionary() -> [String:Any]
    {
        var dictionary = [String:Any]()
        if distanceLable != nil{
            dictionary["distanceLable"] = distanceLable
        }
        if distanceValue != nil{
            dictionary["distanceValue"] = distanceValue
        }
        if endcoords != nil{
            dictionary["endcoords"] = endcoords
        }
        if error != nil{
            dictionary["error"] = error
        }
        if from != nil{
            dictionary["from"] = from
        }
        if msg != nil{
            dictionary["msg"] = msg
        }
        if startCords != nil{
            dictionary["startCords"] = startCords
        }
        if timeLable != nil{
            dictionary["timeLable"] = timeLable
        }
        if timeValue != nil{
            dictionary["timeValue"] = timeValue
        }
        if to != nil{
            dictionary["to"] = to
        }
        return dictionary
    }
    
    /**
     * NSCoding required initializer.
     * Fills the data from the passed decoder
     */
    @objc required init(coder aDecoder: NSCoder)
    {
        distanceLable = aDecoder.decodeObject(forKey: "distanceLable") as? String ?? ""
        distanceValue = aDecoder.decodeObject(forKey: "distanceValue") as? Int ?? Int()
        endcoords = aDecoder.decodeObject(forKey: "endcoords") as? [Float]
        error = aDecoder.decodeObject(forKey: "error") as? Bool ?? Bool()
        from = aDecoder.decodeObject(forKey: "from") as? String ?? ""
        msg = aDecoder.decodeObject(forKey: "msg") as? String ?? ""
        startCords = aDecoder.decodeObject(forKey: "startCords") as? [Float]
        timeLable = aDecoder.decodeObject(forKey: "timeLable") as? String ?? ""
        timeValue = aDecoder.decodeObject(forKey: "timeValue") as? Int ?? Int()
        to = aDecoder.decodeObject(forKey: "to") as? String ?? ""
        
    }
    
    /**
     * NSCoding required method.
     * Encodes mode properties into the decoder
     */
    @objc func encode(with aCoder: NSCoder)
    {
        if distanceLable != nil{
            aCoder.encode(distanceLable, forKey: "distanceLable")
        }
        if distanceValue != nil{
            aCoder.encode(distanceValue, forKey: "distanceValue")
        }
        if endcoords != nil{
            aCoder.encode(endcoords, forKey: "endcoords")
        }
        if error != nil{
            aCoder.encode(error, forKey: "error")
        }
        if from != nil{
            aCoder.encode(from, forKey: "from")
        }
        if msg != nil{
            aCoder.encode(msg, forKey: "msg")
        }
        if startCords != nil{
            aCoder.encode(startCords, forKey: "startCords")
        }
        if timeLable != nil{
            aCoder.encode(timeLable, forKey: "timeLable")
        }
        if timeValue != nil{
            aCoder.encode(timeValue, forKey: "timeValue")
        }
        if to != nil{
            aCoder.encode(to, forKey: "to")
        }
        
    }
    
}
struct RideRequestModel {
    var success : Bool = Bool()
    var message : String = String()
    var requestDetails : String = String()
    var tripId : Int = Int()
    
    init(){}
    init(json : JSON) {
        self.success = json["success"].bool ?? Bool()
        self.message = json["message"].string ?? String()
        self.requestDetails = json["requestDetails"].string ?? String()
         self.tripId = json["tripId"].int ?? Int()
    }
}

struct cancelTripModel {
    var success : Bool = Bool()
    var message : String = String()
    var tripId : Int = Int()
    
    init(){}
    init(json : JSON) {
        self.success = json["success"].bool ?? Bool()
        self.message = json["message"].string ?? String()
        self.tripId = json["tripId"].int ?? Int()
    }
}

struct FeedBackModel {
    var success : Bool = Bool()
    var message : String = String()
    
    init(){}
    init(json : JSON) {
        self.success = json["success"].bool ?? Bool()
        self.message = json["message"].string ?? String()
    }
}

//=======================================================================

struct RideDetailModel {
    var success : Bool = Bool()
    var message : String = String()
    var serviceType : String = String()
    var others1 : String = String()
    var startOTP : String = String()
    var endOTP : String = String()
    var pickupdetails : pickupdetailsModel = pickupdetailsModel()
    var DriverProfile : ProfileModel = ProfileModel()
    var currentTaxi : CurrentActiveTaxi = CurrentActiveTaxi()
    var mulitiLocation : [MulitiLocation] = [MulitiLocation]()
      
    init(){}
    init(json : JSON) {
         self.success = json["success"].bool ?? Bool()
         self.message = json["message"].string ?? String()
         self.serviceType = json["serviceType"].string ?? String()
         self.others1 = json["others1"].string ?? String()
         self.startOTP = json["startOTP"].string ?? String()
         self.endOTP = json["endOTP"].string ?? String()
         self.pickupdetails = pickupdetailsModel.init(json: json["pickupdetails"])
       
         self.DriverProfile = ProfileModel.init(json: json["driver",0,"profile"])
         self.currentTaxi = CurrentActiveTaxi.init(json: json["driver",1,"currentActiveTaxi"])
        let mulitiArray = json["multiLocation"].array
                           
                           let mulitiList = mulitiArray?.compactMap({ (jsonVal) -> MulitiLocation? in
                               return MulitiLocation.init(json: jsonVal)
                           })
                           self.mulitiLocation = mulitiList ?? [MulitiLocation]()
     }
}

class MulitiLocation{
    var doubleLat : String = String()
    var doubleLng : String = String()
    var strAddress : String = String()
    var updatePosition : Bool = Bool()
    init(){}
    init(json : JSON) {
        self.doubleLat = json["doubleLat"].string ?? String()
        self.doubleLng = json["doubleLng"].string ?? String()
        self.strAddress = json["strAddress"].string ?? String()
        self.updatePosition = json["updatePosition"].bool ?? Bool()
    }
}


struct pickupdetailsModel {
    var startcoords : [Float] = [Float]()
    var endcoords : [Float] = [Float]()
    var end : String = String()
    var start : String = String()
    var distanceKM : String = String()
    init(){}
    init(json : JSON) {
        self.end = json["end"].string ?? String()
        self.start = json["start"].string ?? String()
        self.distanceKM = json["distanceKM"].string ?? String()
        let startcoordsList = json["startcoords"].array?.compactMap({ (jsonVal) -> Float? in
            return jsonVal.float
        })
        self.startcoords = startcoordsList ?? [Float]()
        
        let endcoordsList = json["endcoords"].array?.compactMap({ (jsonVal) -> Float? in
            return jsonVal.float
        })
        self.endcoords = endcoordsList ?? [Float]()
    
    }
}


class CurrentActiveTaxi{
    var color : String = String()
    var driver : String = String()
    var cpy : String = String()
    var licence : String = String()
    var year : String = String()
    var model : String = String()
    var makename : String = String()
    var _id : String = String()
    var vehicleidentificationno : String = String()
    var image : String = String()
    var taxistatus : String = String()
    var noofshare : Bool = Bool()
    var share : Bool = Bool()
    var vehicletype : String = String()
    var others1 : String = String()
    var vin_number : String = String()
    var chaisis : String = String()
    var registrationnumber : String = String()
    var registrationexpdate : String = String()
    var registration : String = String()
    var permitexpdate : String = String()
    var permit : String = String()
    var insurancenumber : String = String()
    var insuranceexpdate : String = String()
    var insurance : String = String()
    var type : [TypeData] = [TypeData]()
    var handicap : Bool = Bool()
    var ownername : String = String()
    init(){}
    init(json : JSON) {
        self.color = json["color"].string ?? String()
        self.driver = json["driver"].string ?? String()
        self.cpy = json["cpy"].string ?? String()
        self.licence = json["licence"].string ?? String()
        self.year = json["year"].string ?? String()
        self.model = json["model"].string ?? String()
        self.makename = json["makename"].string ?? String()
        self._id = json["_id"].string ?? String()
        self.vehicleidentificationno = json["vehicleidentificationno"].string ?? String()
        self.image = json["image"].string ?? String()
        self.taxistatus = json["taxistatus"].string ?? String()
        self.noofshare = json["noofshare"].bool ?? Bool()
        self.share = json["share"].bool ?? Bool()
        self.vehicletype = json["vehicletype"].string ?? String()
        self.others1 = json["others1"].string ?? String()
        self.vin_number = json["vin_number"].string ?? String()
        self.chaisis = json["chaisis"].string ?? String()
        self.registrationnumber = json["registrationnumber"].string ?? String()
        self.registrationexpdate = json["registrationexpdate"].string ?? String()
        self.registration = json["registration"].string ?? String()
        self.permitexpdate = json["permitexpdate"].string ?? String()
        self.permit = json["permit"].string ?? String()
        self.insurancenumber = json["insurancenumber"].string ?? String()
        self.insuranceexpdate = json["insuranceexpdate"].string ?? String()
        self.insurance = json["insurance"].string ?? String()
        self.handicap = json["handicap"].bool ?? Bool()
        self.ownername = json["ownername"].string ?? String()
        
        let typeArray = json["type"].array
        
        let typeList = typeArray?.compactMap({ (jsonVal) -> TypeData? in
            return TypeData.init(json: jsonVal)
        })
        self.type = typeList ?? [TypeData]()
        
    }
}

class TypeData {
    var _id : String = String()
    var luxury : Bool = Bool()
    var normal : Bool = Bool()
    var basic : Bool = Bool()
    init(){}
    init(json : JSON) {
        self._id = json["_id"].string ?? String()
        self.luxury = json["luxury"].bool ?? Bool()
        self.normal = json["normal"].bool ?? Bool()
        self.basic = json["basic"].bool ?? Bool()
        
    }
}


struct PackageList {
    var serviceDetail : [String] = [String]()
    var packagedetail : [packageDetail] = [packageDetail]()
    var message: String =  String()
    var Description: String =  String()
    var success: Bool =  Bool()
     init(){}
    init(json : JSON) {
        let startcoordsList = json["serviceDetail"].array?.compactMap({ (jsonVal) -> String? in
            return jsonVal.description
        })
        self.serviceDetail = startcoordsList ?? [String]()
        
        let packageDetailsList = json["packageDetail"].array?.compactMap({ (jsonVal) -> packageDetail? in
            return packageDetail.init(json: jsonVal)
         })
        self.packagedetail = packageDetailsList ?? [packageDetail]()
               
        
        self.Description = json["Description"].string ?? String()
               self.message = json["message"].string ?? String()
               self.success = json["success"].bool ?? Bool()
            
      
    
    }
}

struct packageDetail {
    var price: String =  String()
    var _id: String =  String()
    var duration: String =  String()
    var name: String =  String()
    var distance: String =  String()
    
    init(){}
      init(json : JSON) {
        self.price = json["price"].string ?? String()
        self._id = json["_id"].string ?? String()
        self.duration = json["duration"].string ?? String()
        self.name = json["name"].string ?? String()
        self.distance = json["distance"].string ?? String()
             
    }
}


struct RentalVehicle {
    var packagedetail : [RentalData] = [RentalData]()
    var message: String =  String()
    var success: Bool =  Bool()
     init(){}
    init(json : JSON) {
         
        let RentalDataList = json["data"].array?.compactMap({ (jsonVal) -> RentalData? in
            return RentalData.init(json: jsonVal)
         })
        self.packagedetail = RentalDataList ?? [RentalData]()
               
        
               self.message = json["message"].string ?? String()
               self.success = json["success"].bool ?? Bool()
            
      
    
    }
}

struct RentalData {
    var baseFare: String =  String()
    var _id: String =  String()
    var bkm: String =  String()
    var description: String =  String()
    var fare: String =  String()
    var file: String =  String()
    var packageDistance: String =  String()
    var packageDuration: String =  String()
    var packageId: String =  String()
    var seat: String =  String()
    var timeFare: String =  String()
    var tripTypeCode: String =  String()
    var type: String =  String()
    
    init(){}
      init(json : JSON) {
        self.baseFare = json["baseFare"].string ?? String()
        self._id = json["_id"].string ?? String()
        self.bkm = json["bkm"].string ?? String()
        self.description = json["description"].string ?? String()
        self.fare = json["fare"].string ?? String()
        self.file = json["file"].string ?? String()
        self.baseFare = json["baseFare"].string ?? String()
        self.packageDistance = json["packageDistance"].string ?? String()
        self.packageDuration = json["packageDuration"].string ?? String()
        self.packageId = json["packageId"].string ?? String()
        self.seat = json["seat"].string ?? String()
        self.timeFare = json["timeFare"].string ?? String()
        self.tripTypeCode = json["tripTypeCode"].string ?? String()
        self.type = json["type"].string ?? String()
             
    }
}


struct OutstationVehicleListWithFare {
   var vehicleListdetail : [vehicleListData] = [vehicleListData]()
       var message: String =  String()
       var success: Bool =  Bool()
    var tripDuration : String = String()
    init(){}
    init(json : JSON) {
        self.tripDuration = json["tripDuration"].string ?? ""
               let vehicleListList = json["vehicleList"].array?.compactMap({ (jsonVal) -> vehicleListData? in
                   return vehicleListData.init(json: jsonVal)
                })
               self.vehicleListdetail = vehicleListList ?? [vehicleListData]()
                      
               
                      self.message = json["message"].string ?? String()
                      self.success = json["success"].bool ?? Bool()
                 
    }
}

struct vehicleListData {
    var cancelationFeesDriver: String =  String()
    var packageName: String =  String()
    var distanceLable: String =  String()
    var tripDuration : String = String()
    var file: String =  String()
    var comison: String =  String()
    var bkm: String =  String()
    var dropLocation: String =  String()
    var distanceKM: String =  String()
    var conveyancePerKm: String =  String()
    var comisonAmt: String =  String()
    var cancelationFeesRider: String =  String()
    var asppc: String =  String()
    var tripTypeCode: String =  String()
    var _id: String =  String()
    var packageId: String =  String()
    var timeFare: String =  String()
    var description: String =  String()
    var durationInHourUpAndDown: String =  String()
    var vehicle: String =  String()
    var durationInHour: String =  String()
    var distanceKMUpAndDown: String =  String()
    var pickupLocation: String =  String()
    var type: String =  String()
    var timeLable : String = String()
    var faredetails : FareDetails = FareDetails()
    init(){}
      init(json : JSON) {
        self.cancelationFeesDriver = json["cancelationFeesDriver"].string ?? String()
        self.packageName = json["packageName"].string ?? String()
        self.tripDuration = json["tripDuration"].string ?? String()
        self.distanceLable = json["distanceLable"].string ?? String()
        self.file = json["file"].string ?? String()
        self.comison = json["comison"].string ?? String()
        self.bkm = json["bkm"].string ?? String()
        self.dropLocation = json["dropLocation"].string ?? String()
        self.distanceKM = json["distanceKM"].string ?? String()
        self.conveyancePerKm = json["conveyancePerKm"].string ?? String()
        self.comisonAmt = json["comisonAmt"].string ?? String()
        self.cancelationFeesRider = json["cancelationFeesRider"].string ?? String()
        self.asppc = json["asppc"].string ?? String()
        self.tripTypeCode = json["tripTypeCode"].string ?? String()
        self._id = json["_id"].string ?? String()
        self.packageId = json["packageId"].string ?? String()
        self.timeFare = json["timeFare"].string ?? String()
        self.description = json["description"].string ?? String()
        self.durationInHourUpAndDown = json["durationInHourUpAndDown"].string ?? String()
        self.vehicle = json["vehicle"].string ?? String()
        self.timeLable = json["timeLable"].string ?? String()
        self.durationInHour = json["durationInHour"].string ?? String()
        self.distanceKMUpAndDown = json["distanceKMUpAndDown"].string ?? String()
        self.pickupLocation = json["pickupLocation"].string ?? String()
        self.type = json["type"].string ?? String()
        self.faredetails = FareDetails.init(json: json["fareDetails"])
             
    }
}



struct FareDetails {
    var tranxid: String =  String()
    var description: String =  String()
    var pickupCharge: String =  String()
    var baseFare: String =  String()
    var extraTimeFare: String =  String()
    var waitingFare: String =  String()
    var travelTime: String =  String()
    var comison: String =  String()
    var comisonAmt: String =  String()
    var packageDistance: String =  String()
    var BaseFare: String =  String()
    var tax: String =  String()
    var extraHours: String =  String()
    var additionalFee: String =  String()
    var distance: String =  String()
    var additionalTimeRate: String =  String()
    var perKmRate: String =  String()
    var additionalTimeFareNew: String =  String()
    var baseFareLabel: String =  String()
    var packageId: String =  String()
    var travelFare: String =  String()
    var packageName: String =  String()
    var discountAmt: String =  String()
    var oldCancellationAmt: String =  String()
    var paymentMode: String =  String()
    var remainingFare: String =  String()
    var KMFare: String =  String()
    var discountName: String =  String()
    var totalFareWithOutOldBal: String =  String()
    var remainingTimeFareLabel: String =  String()
    var remainingFareLabel: String =  String()
    var additionalDurationFare: String =  String()
    var DetuctedFare: String =  String()
    var fareAmtBeforeSurge: String =  String()
    var waitingTime: String =  String()
    var packageDuration: String =  String()
    var additionalDistance: String =  String()
    var additionalDuration: String =  String()
    var additionalDistanceFare: String =  String()
    var taxPercentage: String =  String()
    var seat: String =  String()
    var discountPercentage: String =  String()
    var hotelcommisionAmt: String =  String()
    var minFare: String =  String()
    var totalFare : String = String()
    init(){}
      init(json : JSON) {
        self.minFare = json["minFare"].string ?? String()
        self.hotelcommisionAmt = json["hotelcommisionAmt"].string ?? String()
        self.discountPercentage = json["discountPercentage"].string ?? String()
        self.seat = json["seat"].string ?? String()
        self.taxPercentage = json["taxPercentage"].string ?? String()
        self.additionalDistanceFare = json["additionalDistanceFare"].string ?? String()
        self.additionalDuration = json["additionalDuration"].string ?? String()
        self.additionalDistance = json["additionalDistance"].string ?? String()
        self.packageDuration = json["packageDuration"].string ?? String()
        self.waitingTime = json["waitingTime"].string ?? String()
        self.fareAmtBeforeSurge = json["fareAmtBeforeSurge"].string ?? String()
        self.DetuctedFare = json["DetuctedFare"].string ?? String()
        self.additionalDurationFare = json["additionalDurationFare"].string ?? String()
        self.remainingFareLabel = json["remainingFareLabel"].string ?? String()
        self.remainingTimeFareLabel = json["remainingTimeFareLabel"].string ?? String()
        self.totalFareWithOutOldBal = json["timeFare"].string ?? String()
        self.discountName = json["discountName"].string ?? String()
        self.KMFare = json["KMFare"].string ?? String()
        self.remainingFare = json["remainingFare"].string ?? String()
        self.paymentMode = json["paymentMode"].string ?? String()
        self.oldCancellationAmt = json["oldCancellationAmt"].string ?? String()
        self.discountAmt = json["discountAmt"].string ?? String()
        self.packageName = json["packageName"].string ?? String()
        self.travelFare = json["travelFare"].string ?? String()
        self.packageId = json["packageId"].string ?? String()
        self.baseFareLabel = json["baseFareLabel"].string ?? String()
        self.additionalTimeFareNew = json["additionalTimeFareNew"].string ?? String()
        self.totalFare = json["totalFare"].string ?? String()
        self.perKmRate = json["perKmRate"].string ?? String()
        self.additionalTimeRate = json["additionalTimeRate"].string ?? String()
        self.distance = json["distance"].string ?? String()
        self.additionalTimeRate = json["additionalTimeRate"].string ?? String()
        self.distance = json["distance"].string ?? String()
        self.additionalFee = json["additionalFee"].string ?? String()
        self.extraHours = json["extraHours"].string ?? String()
        self.tax = json["tax"].string ?? String()
        self.BaseFare = json["BaseFare"].string ?? String()
        self.packageDistance = json["packageDistance"].string ?? String()
        self.comisonAmt = json["comisonAmt"].string ?? String()
        self.comison = json["comison"].string ?? String()
        self.travelTime = json["travelTime"].string ?? String()
        self.waitingFare = json["waitingFare"].string ?? String()
        self.extraTimeFare = json["extraTimeFare"].string ?? String()
        self.baseFare = json["baseFare"].string ?? String()
        self.pickupCharge = json["pickupCharge"].string ?? String()
        self.description = json["description"].string ?? String()
        self.tranxid = json["tranxid"].string ?? String()
    }
}

struct BillingModel {
    var bill : [BillingModelArray] = [BillingModelArray]()
    init(){}
    init(json : JSON) {
           let vechileArray = json.array
           let vechileList = vechileArray?.compactMap({ (jsonVal) -> BillingModelArray? in
               return BillingModelArray.init(json: jsonVal)
           })
           self.bill = vechileList ?? [BillingModelArray]()
    }
    
}

struct BillingModelArray{
    var desc: String =  String()
     var label: String =  String()
     var value: String =  String()
     init(){}
       init(json : JSON) {
         self.desc = json["desc"].string ?? String()
         self.label = json["label"].string ?? String()
         self.value = json["value"].string ?? String()
        
    }
}
