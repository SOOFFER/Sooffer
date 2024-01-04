//
//  EarningModel.swift
//  RebuStar Driver
//
//  Created by Abservetech on 10/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

class EarningModel{
    
    var earingsdata : [EarningData] = [EarningData]()
    
    
    init(){}
    
    init(json : JSON){
        let earingsArray = json.array
        let earingsList = earingsArray?.compactMap({ (jsonVal) -> EarningData? in
            return EarningData.init(json: jsonVal)
        })
        self.earingsdata = earingsList ?? [EarningData]()
        
    }
    
    
}

class EarningData {
    
    var id : Int = Int()
    var amttopay : Int = Int()
    var commision : Float = Float()
    var date : String = String()
    var nos : Int = Int()
    var type : String = String()
    
    init(){}
    
    init(json : JSON){
        self.id = json["_id"].int ?? Int()
        self.amttopay = json["amttopay"].int ?? Int()
        self.commision = json["commision"].float ?? Float()
        self.date = json["date"].string ?? String()
        self.nos = json["nos"].int ?? Int()
        self.type = json["type"].string ?? String()
    }
}

class ManageVehicleService{
    var service : [ManageService] = [ManageService]()
    
    init(){}
    init(json : JSON) {
        let comminsionArray = json.array
        let commissionList = comminsionArray?.compactMap({ (jsonValue) -> ManageService? in
            return ManageService.init(json: jsonValue)
        })
        self.service = commissionList ?? [ManageService]()
        
        
    }
  
}

class ManageService{
    var file : String?
    var status : Bool?
    var type : String?
    
    init() {
        
    }
    
    init(json : JSON) {
        self.file = json["file"].string ?? ""
        self.status = json["status"].bool ?? false
        self.type = json["type"].string ?? ""
    }
    
}
class Twodrivermodel {
    var message : String?
    var status : Bool?
    var driverData : TwodriverData = TwodriverData()
    init(){
        
    }
    init(json : JSON) {
        self.message = json["message"].string ?? String()
        self.status = json["status"].bool ?? Bool()
        self.driverData = TwodriverData(json: json["driverData"])
    }
}
class TwodriverData{
    var isTwoDriver : Bool?
    init(){}
    init(json : JSON){
        self.isTwoDriver = json["isTwoDriver"].bool ?? Bool()
    }
}
