//
//  EmergencyModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 23/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

struct EmergencyModel {
    var emergencyList : [EmergencyData] = [EmergencyData]()
    
    init(json : JSON) {
        let emrgncyArray = json.array
        let emrgncyList = emrgncyArray?.compactMap({ (jsonVal) -> EmergencyData? in
            return EmergencyData.init(json: jsonVal)
        })
        self.emergencyList = emrgncyList ?? [EmergencyData]()
    }
}

struct  EmergencyData {
    var name: String =  String()
    var _id: String =  String()
    var number: String =  String()
    init(){
        
    }
    init(json : JSON) {
        self.name = json["name"].string ?? String()
        self._id = json["_id"].string ?? String()
        self.number = json["number"].string ?? String()
    }
}
