//
//  ProfileModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 12/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

struct ProfileModel {
    
    var _id : String = String()
    var attendance : Bool = Bool()
    var code : String = String()
    var fname : String = String()
    var lname : String = String()
    var email : String = String()
    var phone : String = String()
    var gender : String = String()
    var cnty : String = String()
    var cntyname : String = String()
    var lang : String = String()
    var vin : String = String()
    var __v : String = String()
    var isHail : Bool = Bool()
    var blockuptoDate : String = String()
    var callmask : String = String()
    var loginId : String = String()
    var loginType : String = String()
    var verificationCode : String = String()
    var softdel : String = String()
    var scity : String = String()
    var scId : String = String()
    var lastCron : String = String()
    var lastUpdate : String = String()
    var last_out : String = String()
    var last_in : String = String()
    var fcmId : String = String()
    var isConnected : Bool = Bool()
    var curTrip : String = String()
    var lastCanceledDate : String = String()
    var canceledCount : Int = Int()
    var wallet : Float = Float()
    var online : Bool = Bool()
    var sharebooked : Int = Int()
    var noofshare : Int = Int()
    var share : Bool = Bool()
    var vin_number : String = String()
    var others1 : String = String()
    var curVehicleNo : String = String()
    var curStatus : String = String()
    var curService : String = String()
    var serviceStatus : String = String()
    var currentTaxi : String = String()
    var passingexp : String = String()
    var passing : String = String()
    var insuranceexp : String = String()
    var passingBackImg : String = String()
    var licenceexp : String = String()
    var licenceNo : String = String()
    var licence : String = String()
    var licenceBackImg : String = String()
    var insuranceBackImg : String = String()
    var insurance : String = String()
    var baseurl : String = String()
    var profile : String = String()
    var cur : String = String()
    var cmpy : String = String()
    var phcode : String = String()
    var nic : String = String()
    var createdAt : String = String()
    var subcriptionEndDate : String = String()
    var todayAmt : TodayAmt = TodayAmt()
    var rating : Rating = Rating()
    var address : [Address] = [Address]()
    var emergency : [EmgContact] = [EmgContact]()
    var taxis : [Taxis] = [Taxis]()
    var status : [Status] = [Status]()
    var document : [DocumentModel] = [DocumentModel]()
    var isTwoDriver : Bool = Bool()
    var isSubcriptionActive : Bool = Bool()
    
    init(){}
    
    init(json : JSON){
        self._id = json["_id"].string ?? String()
        self.attendance = json["attendance"].bool ?? Bool()
        self.code = json["code"].string ?? String()
        self.fname = json["fname"].string ?? String()
        self.lname = json["lname"].string ?? String()
        self.email = json["email"].string ?? String()
        self.phone = json["phone"].string ?? String()
        self.gender = json["gender"].string ?? String()
        self.cnty = json["cnty"].string ?? String()
        self.cntyname = json["cntyname"].string ?? String()
        self.lang = json["lang"].string ?? String()
        self.vin = json["vin"].string ?? String()
        self.__v = json["__v"].string ?? String()
        self.isHail = json["isHail"].bool ?? Bool()
        self.blockuptoDate = json["blockuptoDate"].string ?? String()
        self.insurance = json["insurance"].string ?? String()
        self.callmask = json["callmask"].string ?? String()
        self.loginId = json["loginId"].string ?? String()
        self.loginType = json["loginType"].string ?? String()
        self.verificationCode = json["verificationCode"].string ?? String()
        self.insuranceBackImg = json["insuranceBackImg"].string ?? String()
        self.softdel = json["softdel"].string ?? String()
        self.scity = json["scity"].string ?? String()
        self.passingBackImg = json["passingBackImg"].string ?? String()
        self.scId = json["scId"].string ?? String()
        self.scity = json["scity"].string ?? String()
        self.lastCron = json["lastCron"].string ?? String()
        self.lastUpdate = json["lastUpdate"].string ?? String()
        self.last_out = json["last_out"].string ?? String()
        self.last_in = json["last_in"].string ?? String()
        self.fcmId = json["fcmId"].string ?? String()
        self.isConnected = json["isConnected"].bool ?? Bool()
        self.curTrip = json["curTrip"].string ?? String()
        self.lastCanceledDate = json["lastCanceledDate"].string ?? String()
        self.canceledCount = json["canceledCount"].int ?? Int()
        self.wallet = json["wallet"].float ?? Float()
        self.online = json["online"].bool ?? Bool()
        self.isSubcriptionActive = json["isSubcriptionActive"].bool ?? Bool()
        self.sharebooked = json["sharebooked"].int ?? Int()
        self.noofshare = json["noofshare"].int ?? Int()
        self.share = json["share"].bool ?? Bool()
        self.vin_number = json["vin_number"].string ?? String()
        self.others1 = json["others1"].string ?? String()
        self.curVehicleNo = json["curVehicleNo"].string ?? String()
        self.curStatus = json["curStatus"].string ?? String()
        self.curService = json["curService"].string ?? String()
        self.serviceStatus = json["serviceStatus"].string ?? String()
        self.currentTaxi = json["currentTaxi"].string ?? String()
        self.passingexp = json["passingexp"].string ?? String()
        self.passing = json["passing"].string ?? String()
        self.insuranceexp = json["insuranceexp"].string ?? String()
        self.insurance = json["insurance"].string ?? String()
        self.licenceexp = json["licenceexp"].string ?? String()
        self.licenceNo = json["licenceNo"].string ?? String()
        self.licence = json["licence"].string ?? String()
        self.licenceBackImg = json["licenceBackImg"].string ?? String()
        self.baseurl = json["baseurl"].string ?? String()
        self.profile = json["profile"].string ?? String()
        self.passing = json["passing"].string ?? String()
        self.cur = json["cur"].string ?? String()
        self.cmpy = json["cmpy"].string ?? String()
        self.phcode = json["phcode"].string ?? String()
        self.nic = json["nic"].string ?? String()
        self.createdAt = json["createdAt"].string ?? String()
        self.subcriptionEndDate = json["subcriptionEndDate"].string ?? String()
        
        
        self.todayAmt = TodayAmt(json: json["todayAmt"])
        self.rating = Rating(json: json["rating"])
        
        
        let addressArray = json["datas"].array
        
        let addressList = addressArray?.compactMap({ (jsonVal) -> Address? in
            return Address.init(json: jsonVal)
        })
        self.address = addressList ?? [Address]()
        
        let emergencyArray = json["EmgContact"].array
        
        let emergencyList = emergencyArray?.compactMap({ (jsonVal) -> EmgContact? in
            return EmgContact.init(json: jsonVal)
        })
        self.emergency = emergencyList ?? [EmgContact]()
        
        
        let taxisArray = json["taxis"].array
        
        let taxisList = taxisArray?.compactMap({ (jsonVal) -> Taxis? in
            return Taxis.init(json: jsonVal)
        })
        self.taxis = taxisList ?? [Taxis]()
        
        
        let statusArray = json["status"].array
        
        let statusList = statusArray?.compactMap({ (jsonVal) -> Status? in
            return Status.init(json: jsonVal)
        })
        self.status = statusList ?? [Status]()
        
        let DocArray = json["document"].array
        
        let DocList = DocArray?.compactMap({ (jsonVal) -> DocumentModel? in
            return DocumentModel.init(json: jsonVal)
        })
        self.document = DocList ?? [DocumentModel]()
        
        self.isTwoDriver = json["isTwoDriver"].bool ?? Bool()
      }
}

struct Address {
    var address : String = String()
    var lable : String = String()
    var _id : String = String()
    var Coords : NSMutableArray = []
    init() {}
    init(json : JSON){
        self.address = json["address"].string ?? String()
        self.lable = json["lable"].string ?? String()
        self._id = json["_id"].string ?? String()
        self.Coords = json["Coords"].array as! NSMutableArray ?? [] as! NSMutableArray
    }
}

struct Rating {
    var rating : String = String()
    var nos : Int = Int()
    var cmts : String = String()
    var tottrip : Int = Int()
    var star : Int = Int()
    init() {}
    init(json : JSON){
        self.rating = json["rating"].string ?? String()
        self.nos = json["nos"].int ?? Int()
        self.cmts = json["cmts"].string ?? String()
        self.tottrip = json["tottrip"].int ?? Int()
        self.star = json["star"].int ?? Int()
     }
}

struct EmgContact{
    var name : String = String()
    var number : String = String()
    var _id : String = String()
    init() {}
    init(json : JSON){
        self.name = json["name"].string ?? String()
        self.number = json["number"].string ?? String()
        self._id = json["_id"].string ?? String()
    }

}

struct Card {
    var currency : String = String()
    var last4 : String = String()
    var _id : String = String()
    init() {}
    init(json : JSON){
        self.currency = json["currency"].string ?? String()
        self.last4 = json["last4"].string ?? String()
        self._id = json["_id"].string ?? String()
    }
}

struct TodayAmt {
    var amt : Int = Int()
    var trips : Int = Int()
    var lastdate : String = String()
    init() {}
    init(json : JSON){
        self.amt = json["amt"].int ?? Int()
        self.trips = json["trips"].int ?? Int()
        self.lastdate = json["lastdate"].string ?? String()
    }
}

struct ProfileEditModel {
    var fileurl : String = String()
    var message : String = String()
    var success : Bool = Bool()
    var request : Request = Request()
    init() {}
    init(json : JSON){
        self.fileurl = json["fileurl"].string ?? String()
        self.message = json["message"].string ?? String()
        self.success = json["success"].bool ?? Bool()
        self.request = Request.init(json: json["request"])
    }
}
struct Request {
    var email : String = String()
    var lname : String = String()
    var fname : String = String()
    var phcode : String = String()
    var phone : String = String()
    var profile : String = String()
    init() {}
    init(json : JSON){
        self.email = json["email"].string ?? String()
        self.lname = json["lname"].string ?? String()
        self.fname = json["fname"].string ?? String()
        self.phcode = json["phcode"].string ?? String()
        self.phone = json["phone"].string ?? String()
        self.profile = json["profile"].string ?? String()
    }
}


struct Taxis {
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
    var noofshare : Int = Int()
    var share : Bool = Bool()
    var vehicletype : String = String()
    var others1 : String = String()
    var vin_number : String = String()
    var chaisis : String = String()
    var registrationnumber : String = String()
    var registrationexpdate : String = String()
    var registration : String = String()
    var registrationBack : String = String()
    var permitexpdate : String = String()
    var permit : String = String()
    var insurancenumber : String = String()
    var insuranceexpdate : String = String()
    var insurance : String = String()
    var type : [Type] = [Type]()
    var handicap : String = String()
    var ownername : String = String()
    var subcriptionEndDate : String = String()
    var document : [DocumentModel] = [DocumentModel]()
    
    init() {}
    init(json : JSON){
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
        self.noofshare = json["noofshare"].int ?? Int()
        self.registrationBack = json["registrationBack"].string ?? String()
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
        self.handicap = json["handicap"].string ?? String()
        self.ownername = json["ownername"].string ?? String()
        self.subcriptionEndDate = json["subcriptionEndDate"].string ?? String()
        
        
        let typeArray = json["type"].array
        
        let typeList = typeArray?.compactMap({ (jsonVal) -> Type? in
            return Type.init(json: jsonVal)
        })
        self.type = typeList ?? [Type]()
        
        let DocArray = json["document"].array
        
        let DocList = DocArray?.compactMap({ (jsonVal) -> DocumentModel? in
            return DocumentModel.init(json: jsonVal)
        })
        self.document = DocList ?? [DocumentModel]()
    }
}

struct Type {
    var _id : String = String()
    var luxury : String = String()
    var normal : String = String()
    var basic : String = String()
    
    init(json : JSON){
        self._id = json["_id"].string ?? String()
        self.luxury = json["luxury"].string ?? String()
        self.normal = json["normal"].string ?? String()
        self.basic = json["basic"].string ?? String()
    }
}

struct FeedBack {
    
    var feedback : [FeedBackList] = [FeedBackList]()
    
    init(json : JSON){
        
        let feedbackArray = json["feedbacks"].array
        
        let feedbackList = feedbackArray?.compactMap({ (jsonVal) -> FeedBackList? in
            return FeedBackList.init(json: jsonVal)
        })
        self.feedback = feedbackList ?? [FeedBackList]()
    }
}

struct FeedBackList {
    var _id : String = String()
    var tripno : Int = Int()
    var riderfb : Riderfb = Riderfb()
    var userinfo : Userinfo = Userinfo()
    init(json : JSON){
        self._id = json["_id"].string ?? String()
        self.tripno = json["tripno"].int ?? Int()
        self.riderfb = Riderfb(json : json["riderfb"])
        self.userinfo = Userinfo(json : json["userinfo"])
    }
    
}

struct Riderfb {
    var cmts : String = String()
    var rating : String = String()
    init() {
        
    }
    init(json : JSON){
        self.cmts = json["cmts"].string ?? String()
        self.rating = json["rating"].string ?? String()
    }
    
}

struct Userinfo {
    var fname : String = String()
    var profile : String = String()
    init() {
        
    }
    init(json : JSON){
        self.fname = json["fname"].string ?? String()
        self.profile = json["profile"].string ?? String()
    }
    
}

struct changePasswprd {
    var message : String = String()
    var success : Bool = Bool()
    init() {
        
    }
    init(json : JSON){
        self.message = json["message"].string ?? String()
        self.success = json["success"].bool ?? Bool()
    }
    
}

struct DocumentModel {
    var docFrontImg : String = String()
    var docName : String = String()
    var fileFor : String = String()
    var docExp : String = String()
    
    init() {
        
    }
    init(json : JSON){
        self.docFrontImg = json["docFrontImg"].string ?? String()
        self.docName = json["docName"].string ?? String()
        self.fileFor = json["fileFor"].string ?? String()
        self.docExp = json["docExp"].string ?? String()
        
    }
    
}

