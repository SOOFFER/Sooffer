//
//  YourTripModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 23/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

struct TripModel
{
    var tripList : [TripData] = [TripData]()
    
    init(json : JSON) {
        let tripArray = json.array
        let tripList = tripArray?.compactMap({ (jsonVal) -> TripData? in
            return TripData.init(json: jsonVal)
        })
        self.tripList = tripList ?? [TripData]()
    }
}

struct UpcomingTripModel
{
    var tripList : [TripData] = [TripData]()
    
    init(json : JSON) {
        let tripArray = json.array
        let tripList = tripArray?.compactMap({ (jsonVal) -> TripData? in
            return TripData.init(json: jsonVal)
        })
        self.tripList = tripList ?? [TripData]()
    }
}

struct TripDetailModel
{
    var success : Bool = Bool()
    var tripDetail : TripData = TripData()
    var profileDetail : ProfileDetail = ProfileDetail()
    var Mapurl : String = String()
    var DriverTip : Int = Int()
   
    init(){}
    init(json : JSON) {
        self.success = json["success"].bool ?? Bool()
        self.tripDetail = TripData.init(json: json["TripDetail"])
        self.profileDetail = ProfileDetail.init(json: json["ProfileDetail"])
        self.Mapurl = json["Mapurl"].string ?? String()
        self.DriverTip = json["DriverTip"].int ?? Int()
    }
}

struct TripData {
     var  _id : String = String()
     var  tripno : Int =  Int()
     var  date : String = String()
     var  cpy : String = String()
     var dvr : String = String()
     var rid : String = String()
     var  vehicle : String = String()
     var  paymentMode : String =  String()
     var service : String = String()
     var  estTime : String =  String()
     var  __v : Int =  Int()
     var  scity : String =  String()
     var  scId : String =  String()
     var  gmtTime : String =  String()
     var  tripFDT : String =  String()
     var  utc : String =  String()
     var  tripDT : String =  String()
     var  curReq : [Int] =  [Int]()
     var needClear : String = String()
     var  review : String =  String()
     var  tripOTP : [String] =  [String]()
     var  status : String =  String()
     var  additionalFee : [String] =  [String]()
     var  noofseats : Int =  Int()
     var  paymentSts : String =  String()
     var  fare : String = String()
     var  hotelid : String =  String()
     var  notes : String =  String()
     var  bookingFor : String =  String()
     var  bookingType : String =  String()
     var  triptype : String =  String()
     var  requestId : String = String()
     var  requestFrom : String =  String()
     var cpyid : String = String()
     var ridid : String = String()
     var dvrid : String = String()
    
    
     var applyValues : ApplyValues = ApplyValues()
     var adsp : Adsp = Adsp()
     var dsp : Dsp = Dsp()
     var acsp : Acsp = Acsp()
     var csp : Csp = Csp()
     var other : Other = Other()
     var reqDvr : [ReqDvr] = [ReqDvr]()

    init() {
        
    }
    
    init(json : JSON) {
      self.applyValues = ApplyValues(json: json["applyValues"])
        self.adsp = Adsp(json: json["adsp"])
        self.dsp = Dsp(json: json["dsp"])
        self.csp = Csp(json: json["csp"])
        self.acsp = Acsp(json: json["acsp"])
        self.other = Other(json: json["other"])
        
        let reqDvrArray = json["reqDvr"].array
        let reqDvrList = reqDvrArray?.compactMap({ (jsonVal) -> ReqDvr? in
            return ReqDvr.init(json: jsonVal)
        })
        self.reqDvr = reqDvrList ?? [ReqDvr]()
        
        self._id = json["_id"].string ?? String()
        self.tripno = json["tripno"].int ?? Int()
        self.date = json["date"].string ?? String()
        self.cpy = json["cpy"].string ?? String()
        self.dvr = json["dvr"].string ?? String()
        self.rid = json["rid"].string ?? String()
        self.vehicle = json["vehicle"].string ?? String()
        self.paymentMode = json["paymentMode"].string ?? String()
        self.service = json["service"].string ?? String()
        self.estTime = json["estTime"].string ?? String()
        self.__v = json["__v"].int ?? Int()
        self.scity = json["scity"].string ?? String()
        self.scId = json["scId"].string ?? String()
        self.gmtTime = json["gmtTime"].string ?? String()
        self.tripFDT = json["tripFDT"].string ?? String()
        self.utc = json["utc"].string ?? String()
        self.tripDT = json["tripDT"].string ?? String()
        self.needClear = json["needClear"].string ?? String()
        self.review = json["review"].string ?? String()
        self.status = json["status"].string ?? String()
        self.noofseats = json["noofseats"].int ?? Int()
        self.paymentSts = json["paymentSts"].string ?? String()
        self.fare = json["fare"].string ?? String()
        self.ridid = json["ridid"].string ?? String()
        self.dvrid = json["dvrid"].string ?? String()
        self.cpyid = json["cpyid"].string ?? String()
        self.hotelid = json["hotelid"].string ?? String()
        self.notes = json["notes"].string ?? String()
        self.bookingFor = json["bookingFor"].string ?? String()
        self.bookingType = json["bookingType"].string ?? String()
        self.triptype = json["triptype"].string ?? String()
        self.requestId = json["requestId"].string ?? String()
        self.requestFrom = json["requestFrom"].string ?? String()
    }
}

struct ReqDvr {
    var drvId: String =  String()
    var called: Int  =  Int()
    var distVal: Int  =  Int()
    init(){
        
    }
    init(json : JSON) {
        self.drvId = json["drvId"].string ?? String()
        self.called = json["phCode"].int ?? Int()
        self.distVal = json["distVal"].int ?? Int()
    }
}

struct ApplyValues {
    
  var applyPickupCharge: Bool =  Bool()
  var applyCommission: Bool =  Bool()
  var applyTax: Bool =  Bool()
  var applyWaitingTime: Bool =  Bool()
  var applyPeakCharge: Bool =  Bool()
  var applyNightCharge: Bool =  Bool()
    init(){
        
    }
    
    init(json : JSON) {
        self.applyPickupCharge = json["applyPickupCharge"].bool ?? Bool()
        self.applyCommission = json["applyCommission"].bool ?? Bool()
        self.applyTax = json["applyTax"].bool ?? Bool()
        self.applyWaitingTime = json["applyWaitingTime"].bool ?? Bool()
        self.applyPeakCharge = json["applyPeakCharge"].bool ?? Bool()
        self.applyNightCharge = json["applyNightCharge"].bool ?? Bool()
        
    }
}

struct Adsp {
   var dLng: Float =  Float()
   var dLat: Float =  Float()
   var pLng: Float =  Float()
   var pLat: Float = Float()
   var to: String =  String()
   var from: String =  String()
   var end: String =  String()
   var start: String =  String()
   var map: String =  String()
    init(){
        
    }
    init(json : JSON) {
        self.dLng = json["dLng"].float ?? Float()
        self.dLat = json["dLat"].float ?? Float()
        self.pLng = json["pLng"].float ?? Float()
        self.pLat = json["pLat"].float ?? Float()
        self.to = json["to"].string ?? String()
        self.from = json["from"].string ?? String()
        self.end = json["end"].string ?? String()
        self.start = json["start"].string ?? String()
        self.map = json["map"].string ?? String()
        
    }
}

struct Dsp{
   var distanceKM: String =  String()
   var start: String =  String()
   var end: String =  String()
//   var endcoords: [Double] = [Double]()
//   var startcoords: [Double] = [Double]()
    init(){
        
    }
    init(json : JSON) {
        self.distanceKM = json[distanceKM].string ?? String()
        self.start = json["start"].string ?? String()
        self.end = json["end"].string ?? String()
//        self.endcoords = json["endcoords"].array as! [Double] ?? [Double]()
//        self.startcoords = json["startcoords"].array as! [Double] ?? [Double]()
    }
}

struct  Other {
  var ph: String =  String()
  var phCode: String =  String()
  var name: String =  String()
    init(){
        
    }
    init(json : JSON) {
        self.ph = json["ph"].string ?? String()
        self.phCode = json["phCode"].string ?? String()
        self.name = json["name"].string ?? String()
    }
}

struct  Csp {
      var dist: String =  String()
      var distfare: String =  String()
      var time: String =  String()
      var promo: String =  String()
      var via: String =  String()
      var peakPer: String =  String()
      var nightPer: String =  String()
      var isPeak: Bool =  Bool()
      var isNight: Bool =  Bool()
      var riderCancelFee: String =  String()
      var driverCancelFee: String =  String()
      var taxPercentage: String =  String()
      var companyAllowance : String =  String()
      var tax: String =  String()
      var conveyance: String =  String()
      var cost: String =  String()
      var promoamt: String =  String()
      var hotelcommision: String =  String()
      var comison: String =  String()
      var timefare: String =  String()
      var base: String =  String()
    init(){
        
    }
    init(json : JSON) {
        self.dist = json["dist"].string ?? String()
        self.distfare = json["distfare"].string ?? String()
        self.time = json["time"].string ?? String()
        self.promo = json["promo"].string ?? String()
        self.via = json["via"].string ?? String()
        self.peakPer = json["peakPer"].string ?? String()
        self.nightPer = json["nightPer"].string ?? String()
        self.isPeak = json["isPeak"].bool ?? Bool()
        self.isNight = json["isNight"].bool ?? Bool()
        self.riderCancelFee = json["riderCancelFee"].string ?? String()
        self.driverCancelFee = json["driverCancelFee"].string ?? String()
        self.taxPercentage = json["taxPercentage"].string ?? String()
        self.companyAllowance = json["companyAllowance"].string ?? String()
        self.tax = json["tax"].string ?? String()
        self.conveyance = json["conveyance"].string ?? String()
        self.cost = json["cost"].string ?? String()
        self.promoamt = json["promoamt"].string ?? String()
        self.hotelcommision = json["hotelcommision"].string ?? String()
        self.comison = json["comison"].string ?? String()
        self.timefare = json["timefare"].string ?? String()
        self.base = json["base"].string ?? String()
    }
}

struct  Acsp {
    var via: String =  String()
    var cost: String =  String()
    var comison: String =  String()
    var timefare: String =  String()
    var time:String =  String()
    var distfare: String =  String()
    var dist: String =  String()
    var base: String =  String()
    var actualcost: String =  String()
    var bal: String =  String()
    var carddebt: String =  String()
    var chId: String =  String()
    var conveyance: String =  String()
    var detect: String =  String()
    var fareAmtBeforeSurge: String =  String()
    var fareType: String =  String()
    var minFare: String =  String()
    var nightPer: String =  String()
    var oldBalance: String =  String()
    var outstanding: String =  String()
    var peakPer: String =  String()
    var promoamt: String =  String()
    var tax: String =  String()
    var taxPercentage: String =  String()
    var totalFareWithOutOldBal: String =  String()
    var waitingCharge: String =  String()
    var waitingTime : String =  String()
    var walletdebt: String =  String()
    var discountName: String =  String()
    var discountPercentage: String =  String()
    var isPeak: Bool =  Bool()
    var isNight: Bool =  Bool()
    var hotelcommision: String =  String()
    var perKmRate : String = String()
    var packageName : String = String()
    var fareForExtraKM : String = String()
    var fareForExtraTime : String = String()
    var extraKM : String = String()
    var extraTime : String = String()
    var gatewayCharge : String = String()
    var booking : String = String()
    var tollFee : String = String()
    init(){
        
    }
    init(json : JSON) {
        
        self.packageName = json["packageName"].string ?? String()
        self.fareForExtraKM = json["fareForExtraKM"].string ?? String()
        self.fareForExtraTime = json["fareForExtraTime"].string ?? String()
        self.extraKM = json["extraKM"].string ?? String()
        self.extraTime = json["extraTime"].string ?? String()
        self.perKmRate = json["perKmRate"].string ?? String()
        self.gatewayCharge = json["gatewayCharge"].string ?? String()
        
        self.via = json["via"].string ?? String()
        self.cost = json["cost"].string ?? String()
        self.comison = json["comison"].string ?? String()
        self.timefare = json["timefare"].string ?? String()
        self.time = json["time"].string ?? String()
        self.distfare = json["distfare"].string ?? String()
        self.dist = json["dist"].string ?? String()
        self.base = json["base"].string ?? String()
        self.actualcost = json["actualcost"].string ?? String()
        self.bal = json["bal"].string ?? String()
        self.carddebt = json["carddebt"].string ?? String()
        self.chId = json["chId"].string ?? String()
        self.conveyance = json["conveyance"].string ?? String()
        self.detect = json["detect"].string ?? String()
        self.fareAmtBeforeSurge = json["fareAmtBeforeSurge"].string ?? String()
        self.fareType = json["fareType"].string ?? String()
        self.minFare = json["minFare"].string ?? String()
        self.nightPer = json["nightPer"].string ?? String()
        self.oldBalance = json["oldBalance"].string ?? String()
        self.outstanding = json["outstanding"].string ?? String()
        self.peakPer = json["peakPer"].string ?? String()
        self.promoamt = json["promoamt"].string ?? String()
        self.tax = json["tax"].string ?? String()
        self.taxPercentage = json["taxPercentage"].string ?? String()
        self.totalFareWithOutOldBal = json["totalFareWithOutOldBal"].string ?? String()
        self.waitingCharge = json["waitingCharge"].string ?? String()
        self.waitingTime = json["waitingTime"].string ?? String()
        self.walletdebt = json["walletdebt"].string ?? String()
        self.discountName = json["discountName"].string ?? String()
        self.discountPercentage = json["discountPercentage"].string ?? String()
        self.isPeak = json["isPeak"].bool ?? Bool()
        self.isNight = json["isNight"].bool ?? Bool()
        self.hotelcommision = json["hotelcommision"].string ?? String()
        self.booking = json["booking"].string ?? String()
        self.tollFee = json["tollFee"].string ?? String()
    }
}

struct  ProfileDetail {
    var _id: String =  String()
    var fname: String =  String()
    var phone: String =  String()
    var profile: String =  String()
    var licenceexp: String =  String()
    var insuranceexp: String =  String()
    var passingexp: String =  String()
    init(){
        
    }
    init(json : JSON) {
        self._id = json["_id"].string ?? String()
        self.fname = json["fname"].string ?? String()
        self.phone = json["phone"].string ?? String()
        self.profile = json["profile"].string ?? String()
        self.licenceexp = json["licenceexp"].string ?? String()
        self.insuranceexp = json["insuranceexp"].string ?? String()
        self.passingexp = json["passingexp"].string ?? String()
    }
}

struct CancelTripModel
{
    var success : Bool = Bool()
    var message : String = String()
    init(){}
    init(json : JSON) {
        self.success = json["success"].bool ?? Bool()
        self.message = json["message"].string ?? String()
    }
}
