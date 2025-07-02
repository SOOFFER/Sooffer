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
    
    init(){}
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
    init(){}
    init(json : JSON) {
        self._id = json["_id"].string ?? String()
        self.address = json["address"].string ?? String()
        self.lable = json["lable"].string ?? String()
        self.Coords = json["Coords"].array as? [String] ?? [String]()
        
    }
}


class OfferModel{
    var offerlist : [OfferData] = [OfferData]()
    
    init(){}
    init(json : JSON) {
        let offerArray = json.array
        let offerList = offerArray?.compactMap({ (jsonVal) -> OfferData? in
            return OfferData.init(json: jsonVal)
        })
        self.offerlist = offerList ?? [OfferData]()
        
    }
}

class OfferData{
    var _id: String =  String()
    var code: String =  String()
    var desc: String =  String()
    var edate: String =  String()
    var title: String =  String()
    var file : String = String()
    var vdate: String =  String()
    
    init(){}
    init(json : JSON) {
        self._id = json["_id"].string ?? String()
        self.code = json["code"].string ?? String()
        self.desc = json["desc"].string ?? String()
        self.edate = json["edate"].string ?? String()
        self.file = json["file"].string ?? String()
        self.title = json["title"].string ?? String()
        self.vdate = json["vdate"].string ?? String()
        
    }
}
