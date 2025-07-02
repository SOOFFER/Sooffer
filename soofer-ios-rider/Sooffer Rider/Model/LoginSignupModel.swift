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

class LoginModel{
    
    var success : Bool = Bool()
    var message : String = String()
    var token : String = String()
    var code : String = String()
    var OTP : Int = Int()
  
  
    init(){}
    
    init(json : JSON){
        self.success = json["success"].bool ?? Bool()
        self.message = json["message"].string ?? String()
        self.token = json["token"].string ?? String()
        self.code = json["code"].string ?? String()
        self.OTP = json["OTP"].int ?? Int()
    }
}

