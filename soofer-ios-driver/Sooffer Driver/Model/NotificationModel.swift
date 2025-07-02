//
//  NotificationModel.swift
//  Sooffer Driver
//
//  Created by Abservetech on 11/01/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

struct NotificationModel {
    var NotificationList : [NotificationData] = [NotificationData]()
    init(){
        
    }
    
    init(json : JSON) {
        let NotifiArray = json.array
        let NotifiList = NotifiArray?.compactMap({ (jsonVal) -> NotificationData? in
            return NotificationData.init(json: jsonVal)
        })
        self.NotificationList = NotifiList ?? [NotificationData]()
    }
}

struct NotificationData {
    var createdAt : String = String()
    var createdAtISO:  String = String()
    var message:  String = String()
    var type:  String = String()
    init(){
        
    }
    init(json : JSON) {
        self.createdAt = json["createdAt"].string ?? String()
        self.createdAtISO = json["createdAtISO"].string ?? String()
        self.message = json["message"].string ?? String()
        self.type = json["type"].string ?? String()
    }
}
