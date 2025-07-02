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
    var phone : String = String()
    var email : String = String()
    var lname : String = String()
    var fname : String = String()
    var status : Bool = Bool()
    var referal : String = String()
    var balance : Int = Int()
    var gender : String = String()
    var profile : String = String()
    var phcode : String = String()
    var __v : Int = Int()
    var callmask : String = String()
    var loginId : String = String()
    var loginType : String = String()
    var verificationCode : String = String()
    var cityname : String = String()
    var city : String = String()
    var statename : String = String()
    var state : String = String()
    var cntyname : String = String()
    var cnty : String = String()
    var scity : String = String()
    var supportNo : String = String()
    var lastCanceledDate : String = String()
    var canceledCount : Int = Int()
    var lang : String = String()
    var fcmId : String = String()
    var cur : String = String()
    var profileurl : String = String()
    var card : Card = Card()
    var rating : Rating = Rating()
    var driverratinge : String = String()
    var address : [Address] = [Address]()
    var emergency : [EmgContact] = [EmgContact]()
   
    init(){}
    
    init(json : JSON){
        self.phone = json["phone"].string ?? String()
        self.email = json["email"].string ?? String()
        self.lname = json["lname"].string ?? String()
        self.fname = json["fname"].string ?? String()
        self.status = json["status"].bool ?? Bool()
        self.referal = json["referal"].string ?? String()
        self.balance = json["balance"].int ?? Int()
        self.gender = json["gender"].string ?? String()
        self.profile = json["profile"].string ?? String()
        self.phcode = json["phcode"].string ?? String()
        self.__v = json["__v"].int ?? Int()
        self.callmask = json["callmask"].string ?? String()
        self.loginId = json["loginId"].string ?? String()
        self.loginType = json["loginType"].string ?? String()
        self.verificationCode = json["verificationCode"].string ?? String()
        self.cityname = json["cityname"].string ?? String()
        self.city = json["city"].string ?? String()
        self.statename = json["statename"].string ?? String()
        self.state = json["state"].string ?? String()
        self.cntyname = json["cntyname"].string ?? String()
        self.cnty = json["cnty"].string ?? String()
        self.scity = json["scity"].string ?? String()
        self.supportNo = json["supportNo"].string ?? String()
        self.lastCanceledDate = json["lastCanceledDate"].string ?? String()
        self.canceledCount = json["canceledCount"].int ?? Int()
        self.lang = json["lang"].string ?? String()
        self.fcmId = json["fcmId"].string ?? String()
        self.cur = json["cur"].string ?? String()
        self.card = Card(json: json["card"])
        self.rating = Rating(json: json["rating"])
        self.driverratinge = json["rating"].string ?? String()
        self.profileurl = json["profileurl"].string ?? String()
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
      }
}

struct CONFIGMODEL{
    var configData : configDataModel = configDataModel()
    
    init(){}
    
    init(json : JSON){
        self.configData = configDataModel(json: json["configData"])
    }
}

struct configDataModel{
    var shareTrip : String = String()
    
    init(){}
    
    init(json : JSON){
        self.shareTrip = json["shareTrip"].string ?? String()
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
    init() {}
    init(json : JSON){
        self.rating = json["rating"].string ?? String()
        self.nos = json["nos"].int ?? Int()
        self.cmts = json["cmts"].string ?? String()
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
        self._id = json["id"].string ?? String()
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
