//
//  FavAddrModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 24/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

class FavAddrModel{
    var FavAddrList : [FavAddrData] = [FavAddrData]()
    var message: String =  String()
    var success: String =  String()
    
    init(json : JSON) {
        let FavAddrArray = json["Address"].array
        let FavAddrList = FavAddrArray?.compactMap({ (jsonVal) -> FavAddrData? in
            return FavAddrData.init(json: jsonVal)
        })
        self.FavAddrList = FavAddrList ?? [FavAddrData]()
        self.message = json["message"].string ?? String()
        self.success = json["success"].string ?? String()
        
    }
}

class FavAddrData{
    var _id: String =  String()
    var address: String =  String()
    var lable: String =  String()
    var Coords : [String] = [String]()
    init(json : JSON) {
        self._id = json["_id"].string ?? String()
        self.address = json["address"].string ?? String()
        self.lable = json["lable"].string ?? String()
        self.Coords = json["Coords"].array as? [String] ?? [String]()
        
    }
}
class PayoutDataModel{
  
    var message: String =  String()
    var balance: Double =  Double()
    var success: String =  String()
    
    init(json : JSON) {
    
        self.message = json["message"].string ?? String()
        self.success = json["success"].string ?? String()
        self.balance = json["balance"].double ?? Double()
        
    }
}
