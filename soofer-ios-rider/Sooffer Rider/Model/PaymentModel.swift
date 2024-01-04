//
//  PaymentModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 19/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire



class PaymentModel{
    var message : String = String()
    var success : Bool = Bool()
    init() {}
    init(json : JSON) {
        self.message = json["message"].string ?? ""
        self.success = json["success"].bool ?? Bool()
    }
}


class walletModel{
    var message : String = String()
    var balance : String = String()
    var success : Bool = Bool()
    init() {}
    init(json : JSON) {
        self.message = json["message"].string ?? ""
        self.balance = json["balance"].string ?? ""
        self.success = json["success"].bool ?? Bool()
    }
}


class TransactionModel{
    var message : String = String()
    var balance : String = String()
    var success : Bool = Bool()
    var transactionList : [Transaction] = [Transaction]()
    
    init() {}
    init(json : JSON) {
        self.message = json["message"].string ?? ""
        self.balance = json["balance"].string ?? ""
        self.success = json["success"].bool ?? Bool()
        let transactionArray = json["transaction"].array
            let transList = transactionArray?.compactMap({ (jsonVal) -> Transaction? in
                return Transaction.init(json: jsonVal)
            })
            self.transactionList = transList ?? [Transaction]()
        
    }
}

class Transaction{
    var message : String = String()
    var _id : String = String()
    var amt : Int = Int()
    var date : String = String()
    var trxid : String = String()
    var type : String = String()
    init() {}
    init(json : JSON) {
        self.message = json["message"].string ?? ""
        self._id = json["_id"].string ?? ""
        self.amt = json["amt"].int ?? 0
        self.date = json["date"].string ?? ""
        self.trxid = json["trxid"].string ?? ""
        self.type = json["type"].string ?? ""
    }
}
