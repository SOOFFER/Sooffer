//
//  VechileModel.swift
//  RebuStar Driver
//
//  Created by Abservetech on 11/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON


struct VehicleModel{
    var success : Bool = Bool()
    var carmake : [CarmakeModel] = [CarmakeModel]()
    var years : [YearsModel] = [YearsModel]()
    var color : [ColorModel] = [ColorModel]()
    init() {}
    init(json : JSON){
        self.success = json["success"].bool ?? Bool()
        
        let carmakeArray = json["carmake"].array
        let carmakeList = carmakeArray?.compactMap({ (jsonVal) -> CarmakeModel? in
            return CarmakeModel.init(json: jsonVal)
        })
        self.carmake = carmakeList ?? [CarmakeModel]()
        
        let yearsArray = json["years"].array
        let yearsList = yearsArray?.compactMap({ (jsonVal) -> YearsModel? in
            return YearsModel.init(json: jsonVal)
        })
        self.years = yearsList ?? [YearsModel]()
        
        let colorArray = json["color"].array
        let colorList = colorArray?.compactMap({ (jsonVal) -> ColorModel? in
            return ColorModel.init(json: jsonVal)
        })
        self.color = colorList ?? [ColorModel]()
    }
}

struct CarmakeModel{
    var carmake : String = String()
    var datas : [CarMakedatas] = [CarMakedatas]()
    init() {}
    init(json : JSON){
        self.carmake = json["carmake"].string ?? String()
        
        let datasArray = json["datas"].array
        let datasList = datasArray?.compactMap({ (jsonVal) -> CarMakedatas? in
            return CarMakedatas.init(json: jsonVal)
        })
        self.datas = datasList ?? [CarMakedatas]()
    }
}

struct CarMakedatas {
    var makeid : String = String()
    var make : String = String()
    var model : [String] = [String]()
    init(){}
    init(json : JSON){
        self.makeid = json["_id"].string ?? String()
        self.make = json["make"].string ?? String()
        let modelArray = json["model"].array
        let modelList = modelArray?.compactMap({ (jsonVal) -> String? in
            return jsonVal.description
        })
         self.model = modelList ?? [String]()
    }
}

struct YearsModel{
    var _id : String = String()
    var datas : [Yearsdatas] = [Yearsdatas]()
    init() {}
    init(json : JSON){
        self._id = json["_id"].string ?? String()
        let datasArray = json["datas"].array
        let datasList = datasArray?.compactMap({ (jsonVal) -> Yearsdatas? in
            return Yearsdatas.init(json: jsonVal)
        })
        self.datas = datasList ?? [Yearsdatas]()
    }
}

struct Yearsdatas {
    var id : String = String()
    var name : String = String()
    var _id : String = String()
    init(){}
    init(json : JSON){
        self.id = json["id"].string ?? String()
        self.name = json["name"].string ?? String()
        self._id = json["_id"].string ?? String()
    }
}

struct ColorModel{
    var _id : String = String()
    var datas : [Colordatas] = [Colordatas]()
    init() {}
    init(json : JSON){
        self._id = json["_id"].string ?? String()
        let datasArray = json["datas"].array
        let datasList = datasArray?.compactMap({ (jsonVal) -> Colordatas? in
            return Colordatas.init(json: jsonVal)
        })
        self.datas = datasList ?? [Colordatas]()
    }
}

struct Colordatas {
    var id : String = String()
    var name : String = String()
    var code : String = String()
    init(){}
    init(json : JSON){
        self.id = json["id"].string ?? String()
        self.name = json["name"].string ?? String()
        self.code = json["code"].string ?? String()
    }
}


struct VehicleNameModels {
    var success : Bool = Bool()
    var message : String = String()
    var vehiclelists : [String] = [String]()
    init(json : JSON){
        self.success = json["success"].bool ?? Bool()
        self.message = json["message"].string ?? String()
        let vehicleArray = json["vehiclelists"].array
        let vehicleList = vehicleArray?.compactMap({ (jsonVal) -> String? in
            return jsonVal.description
        })
        self.vehiclelists = vehicleList ?? [String]()
    }
}


class ManageVehicleList{
    
    var vehiclelists : [Taxis] = [Taxis]()
    var message : String = String()
    var success : Bool = Bool()
    init(){}
    
    init(json : JSON){
        let vehicleArray = json.array
        let vehicleList = vehicleArray?.compactMap({ (jsonVal) -> Taxis? in
            return Taxis.init(json: jsonVal)
        })
        self.vehiclelists = vehicleList ?? [Taxis]()
        self.message = json["message"].string ?? String()
        self.success = json["success"].bool ?? Bool()
    }
}

struct deleteVehicleModel{
    var vehiclelists : [Taxis] = [Taxis]()
    var message : String = String()
    
    init(){}
    
    init(json : JSON){
        self.message = json["message"].string ?? String()
        
        let vehicleArray = json["drivertaxis"].array
        let vehicleList = vehicleArray?.compactMap({ (jsonVal) -> Taxis? in
            return Taxis.init(json: jsonVal)
        })
        self.vehiclelists = vehicleList ?? [Taxis]()
    }
}
