//
//  LoginSignupModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 10/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class LoginSignupModel{
    
    var success : Bool = Bool()
    var message : String = String()
    var token : String = String()
    var otp : String = String()
    var data : [LoginDocsData] = [LoginDocsData]()
    var countryList: [CountryModel] = [CountryModel]()
    init(){}
    
    init(json : JSON){
        self.success = json["success"].bool ?? Bool()
        self.message = json["message"].string ?? String()
        self.token = json["token"].string ?? String()
        self.otp = json["code"].string ?? String()
        let dataArray = json["datas"].array
        
        let dataList = dataArray?.compactMap({ (jsonVal) -> LoginDocsData? in
            return LoginDocsData.init(json: jsonVal)
        })
        self.data = dataList ?? [LoginDocsData]()
 
        let countryarray = json.array
        
        let countrylist = countryarray?.compactMap({ (jsonVal) -> CountryModel? in
            return CountryModel.init(json: jsonVal)
        })
        self.countryList = countrylist ?? [CountryModel]()
    }
}

class LoginDocsData {
    var name : String = String()
    var email : String = String()
    var nic : String = String()
    var code : String = String()
    var userId : String = String()
    var token : String = String()
    var status : [Status] = [Status]()
    init(json : JSON){
        self.name = json["name"].string ?? String()
        self.email = json["email"].string ?? String()
        self.nic = json["nic"].string ?? String()
        self.code = json["code"].string ?? String()
        self.userId = json["userId"].string ?? String()
        
        let statusArray = json["status"].array
        
        let statusList = statusArray?.compactMap({ (jsonVal) -> Status? in
            return Status.init(json: jsonVal)
        })
        self.status = statusList ?? [Status]()
    }
}

class DriverEarning {
    var driverEarrning : [earningAmount] = [earningAmount]()
    
    init(){}
    
    init(json : JSON){
        let statusArray = json["driverPerDayStatus"].array
        
        let statusList = statusArray?.compactMap({ (jsonVal) -> earningAmount? in
            return earningAmount.init(json: jsonVal)
        })
        self.driverEarrning = statusList ?? [earningAmount]()
    }
    
}
class earningAmount {
    var earned : Double = Double()
    var adminCommision: Double = Double()
    var bankDeposit: Double = Double()
    var cashCollected : Double = Double()
    var rideFare: Double  = Double()
    var Tax: Double  = Double()
    var GatewayCharge: Double  = Double()
    var perDayKM: String  = String()
    var perDayRide: Int  = Int()
    
    init() { }
    init(json : JSON){
        self.earned = json["earned"].double ?? Double()
        self.adminCommision = json["adminCommision"].double ?? Double()
        self.bankDeposit = json["bankDeposit"].double ?? Double()
        self.cashCollected = json["cashCollected"].double ?? Double()
        self.rideFare = json["rideFare"].double ?? Double()
        self.Tax = json["Tax"].double ?? Double()
        self.GatewayCharge = json["GatewayCharge"].double ?? Double()
        self.perDayKM = json["perDayKM"].string ?? String()
        self.perDayRide = json["perDayRide"].int ?? Int()
       
    }
}
class CountryModel {
    var _id : String = String()
    var currencyName: String = String()
    var name : String = String()
    var value: String = String()
    var id : String = String()
    
    init() { }
    
    init(json: JSON) {
        self.id = json["id"].string ?? String()
        self.value = json["value"].string ?? String()
        self.name = json["name"].string ?? String()
        self.currencyName = json["currencyName"].string ?? String()
        self._id = json["_id"].string ?? String()
    }
}
class Status {
    var _id : String = String()
    var canoperate : String = String()
    var docs : String = String()
    var models : String = String()
    var curstatus : String = String()
    var profile : Profile = Profile()
   init(json : JSON){
        self._id = json["_id"].string ?? String()
        self.canoperate = json["canoperate"].string ?? String()
        self.docs = json["docs"].string ?? String()
        self.models = json["models"].string ?? String()
        self.curstatus = json["curstatus"].string ?? String()
        self.profile = Profile.init(json: json["profile"])
    }
}



class Profile{
    
    var userProfile : UserProfile = UserProfile()
    init(){}
    init(json : JSON) {
         self.userProfile = UserProfile.init(json: json["userProfile"])
    }
}

class UserProfile{
    var currentActiveTaxi : CurrentActiveTaxi = CurrentActiveTaxi()
    init(){}
    init(json : JSON) {
        self.currentActiveTaxi = CurrentActiveTaxi.init(json: json["currentActiveTaxi"])
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
    var isDaily : Bool = Bool()
    var isOutstation : Bool = Bool()
    var isRental : Bool = Bool()
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
        self.isDaily = json["isDaily"].bool ?? Bool()
        self.isOutstation = json["isOutstation"].bool ?? Bool()
        self.isRental = json["isRental"].bool ?? Bool()
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
