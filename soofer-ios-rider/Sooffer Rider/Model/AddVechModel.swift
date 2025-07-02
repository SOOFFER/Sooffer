//
//  AddVechModel.swift
//  Sooffer Rider
//
//  Created by Abservetech on 28/02/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

struct AddVechModel {
    
    var message : String = String()
    var success : Bool = Bool()
    var taxi : TaxiVechModel = TaxiVechModel()
    
    init() {
    }
    
    init(json: JSON) {
        message = json["message"].string ?? String()
        success = json["success"].bool ?? Bool()
        taxi    = TaxiVechModel(json: json["taxi"])
    }
}

struct TaxiVechModel {
    var __v : Int = Int()
    var _id : String = String()
    var createdAt : String = String()
    init() {}
    init(json: JSON) {
        __v    = json["__v"].int ?? Int()
        _id   = json["_id"].string ?? String()
        createdAt = json["createdAt"].string ?? String()
    }
}
