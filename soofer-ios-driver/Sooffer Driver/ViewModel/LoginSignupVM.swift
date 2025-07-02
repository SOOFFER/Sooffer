//
//  LoginSignupVM.swift
//  RebuStar Rider
//
//  Created by Abservetech on 10/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class LoginSignupVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var loginData : LoginSignupModel?{
        didSet {
            guard let login : LoginSignupModel = loginData else { return }
            self.successLogin?()
        }
    }
    
    var loginErr : LoginSignupModel?{
        didSet {
            guard let login : LoginSignupModel = loginErr else { return }
            self.errorLogin?()
            showToast(msg: login.message ?? StringFile.somethingwrong)
        }
    }
    
    var otpVerfication : LoginSignupModel?{
        didSet{
            guard let verification : LoginSignupModel = otpVerfication else { return }
            self.successVerification?()
//            showToast(msg: verification.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var errVerfication : LoginSignupModel?{
        didSet{
            guard let verification : LoginSignupModel = errVerfication else { return }
            self.errorVerification?()
            showToast(msg: verification.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var signupData : LoginSignupModel?{
        didSet{
            guard let signup : LoginSignupModel = signupData else { return }
            self.successSignup?()
//            showToast(msg: signup.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var errsignup : LoginSignupModel?{
        didSet{
            guard let err : LoginSignupModel = errsignup else { return }
            self.errSignup?()
            showToast(msg: err.message ?? StringFile.somethingwrong)
            
        }
    }
    var forgototpVerfication : LoginSignupModel?{
        didSet{
            guard let verification : LoginSignupModel = forgototpVerfication else { return }
            self.successforgot?()
            showToast(msg: verification.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var errforgototpVerfication : LoginSignupModel?{
        didSet{
            guard let verification : LoginSignupModel = errforgototpVerfication else { return }
            self.errforgot?()
            showToast(msg: verification.message ?? StringFile.somethingwrong)
        }
    }
    var  notification : NotificationModel?{
        didSet{
            guard let verification : NotificationModel = notification else { return }
            self.successnotification?()
        }
    }
    var countryData : LoginSignupModel?{
        didSet {
            guard let login : LoginSignupModel = countryData else { return }
            self.sucessscountry?()
        }
    }
    
    var countryErr : LoginSignupModel?{
        didSet {
            guard let login : LoginSignupModel = countryErr else { return }
            self.errorcountry?()
            showToast(msg: login.message )
        }
    }
    //Mark :- Constructor
    init() { }
    
    init(view : UIView ,dataService : ApiRoot) {
        self.dataService = dataService
    }
    
    // MARK: - Closures for callback, since we are not using the ViewModel to the View.
    var errorinFetchData: (() -> ())?
    var showErrorAlertClosure: (() -> ())?
    var successLogin : (() -> ())?
    var errorLogin : (() -> ())?
    var successVerification : (() -> ())?
    var errorVerification : (() -> ())?
    var successSignup : (() -> ())?
    var errSignup : (() -> ())?
    var successforgot : (() -> ())?
    var errforgot : (() -> ())?
    var successnotification : (() -> ())?
    var sucessscountry: (() -> ())?
    var errorcountry: (() -> ())?
    // MARK: - Network call
    func loginApi(view : UIView,username : String , password : String , loginType : String , loginId :String ){
        let url = ServiceApi.login
        
        var params = Parameters()
        params["username"] = username
        params["password"] = password
        params["loginType"] = loginType
        params["loginId"] = loginId
        params["fcmId"] = Constant.fcm_id
        
        
        self.dataService?.postApi(view : view,url: url, params: params, jsonSuccess: { (success) in
            self.loginData = LoginSignupModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.loginErr = LoginSignupModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
          print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func otpVerificationApi(email : String , phcode : String , phone : String ){
        let url = ServiceApi.otpVerification
        
        var params = Parameters()
        params["email"] = email
        params["phcode"] = phcode
        params["phone"] = phone
        
        
        self.dataService?.postApi(view : view ?? UIView() ,url: url, params: params, jsonSuccess: { (success) in
            self.otpVerfication = LoginSignupModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errVerfication = LoginSignupModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    // MARK: - Network call
    func signupApi(fname : String , lname : String , email : String , phone : String , cnty : String, cntyname : String, lang : String, cur : String, phcode : String, password : String, countryname: String,cityname: String, statename : String, city: String, state: String, referal : String, scId : String , fcmId : String, loginId : String , loginType : String, DOB : String, gender : String){
        let url = ServiceApi.driver
        print("fname : \(countryname),lname : \(cityname),email : \(statename),phone : \(phone),\ncnty : \(cnty),\ncntyname : \(cntyname), \ncityid : \(city), \nstateid : \(state)" )
        var params = Parameters()
         params["fname"] = fname
         params["lname"] = lname
         params["email"] = email
         params["phone"] = phone
         params["cnty"] = cnty
         params["cntyname"] = cntyname
         params["lang"] = lang
         params["cur"] = cur
         params["phcode"] = phcode
         params["password"] = password
         params["referal"] = referal
         params["scId"] = scId
         params["fcmId"] = fcmId
        params["loginType"] = loginType
        params["loginId"] = loginId
        params["countryname"] = cntyname
        params["cityname"] = cityname
        params["statename"] = statename
        params["city"] = city
        params["state"] = state
        params["DOB"] = DOB
        params["gender"] = gender
        
        self.dataService?.postApi(view : view ?? UIView() ,url: url, params: params, jsonSuccess: { (success) in
           
            self.signupData = LoginSignupModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errsignup = LoginSignupModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func forgotOTP(email : String ){
        let url = ServiceApi.driverForgotPassword
        
        var params = Parameters()
        params["email"] = email
        
        self.dataService?.postApi(view : view ?? UIView() ,url: url, params: params, jsonSuccess: { (success) in
            self.forgototpVerfication = LoginSignupModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errforgototpVerfication = LoginSignupModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func forgotPasseord(email : String , password : String ,confirmpassword : String ,   otp : String){
        let url = ServiceApi.driverForgotPassword
        
        var params = Parameters()
        params["email"] = email
        params["password"] = password
        params["confirmpassword"] = confirmpassword
        params["otp"] = otp
        
        self.dataService?.patchApi(view : view ?? UIView() ,url: url, params: params, jsonSuccess: { (success) in
            self.forgototpVerfication = LoginSignupModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errforgototpVerfication = LoginSignupModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    func notificationValues(view : UIView){
         let url = ServiceApi.notification
        let params = Parameters()
    
        self.dataService?.getApi(view: view , url: url, params: params, jsonSuccess: { (success) in
           
          self.notification = NotificationModel.init(json: success)
            print("NOTIFICCATION COUNT :::: \(self.notification?.NotificationList.count)")
         }, jsonError: { (jsonError) in
             self.errforgototpVerfication = LoginSignupModel.init(json: jsonError)
         }, error: { (Error) in
             print("@@@Error" ,Error)
         }, dataSuccess: { (responseData) in
          print("respomse  fklgjdfkgk\(responseData)")
          print("@@@responseData" ,responseData)
         },dataError: { (errorData) in
             print("@@@errorData" ,errorData)
         })
     }
    
    func countryList(view: UIView, with urls: String , with id : String) {
        var url = ""
        if id.isEmpty {
            url = ServiceApi.Base_URL + "countries"
        } else {
            url = ServiceApi.Base_URL + urls + "/\(id)"
        }
        print("sadhakjsdh\(url)")
        let params = Parameters()
       
        self.dataService?.getApiwithoutView( url: url, params: params, jsonSuccess: { (success) in
            self.countryData = LoginSignupModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.countryErr = LoginSignupModel.init(json: jsonError)
        }, error: { (Error) in
//            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
//            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
//          print("@@@errorData" ,errorData)
        })
    }
}
