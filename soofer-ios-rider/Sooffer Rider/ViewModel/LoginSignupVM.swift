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
    
    var loginData : LoginModel?{
        didSet {
            guard let login : LoginModel = loginData else { return }
            self.successLogin?()
        }
    }
    
    var loginErr : LoginModel?{
        didSet {
            guard let login : LoginModel = loginErr else { return }
            self.errorLogin?()
            showToast(msg: login.message ?? StringFile.somethingwrong)
        }
    }
    var otpVerfication : LoginModel?{
        didSet{
            guard let verification : LoginModel = otpVerfication else { return }
            self.successVerification?()
//            showToast(msg: verification.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var errVerfication : LoginModel?{
        didSet{
            guard let verification : LoginModel = errVerfication else { return }
            self.errorVerification?()
//            showToast(msg: verification.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var signupData : LoginModel?{
        didSet{
            guard let signup : LoginModel = signupData else { return }
            self.successSignup?()
//            showToast(msg: signup.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var errsignup : LoginModel?{
        didSet{
            guard let err : LoginModel = errsignup else { return }
            self.errSignup?()
            showToast(msg: err.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var forgototpVerfication : LoginModel?{
        didSet{
            guard let verification : LoginModel = forgototpVerfication else { return }
            self.successforgot?()
//            showToast(msg: verification.message ?? StringFile.somethingwrong)
            
        }
    }
    
    var errforgototpVerfication : LoginModel?{
        didSet{
            guard let verification : LoginModel = errforgototpVerfication else { return }
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
    var vechSuccess: AddVechModel? {
        didSet {
            guard let verification : AddVechModel = vechSuccess else { return }
            showToast(msg: verification.message ?? "")
            addvechSuccess?()
        }
    }
    
    var vechError : AddVechModel? {
        didSet {
            guard let verification : AddVechModel = vechError else { return }
            showToast(msg: verification.message ?? "")
            addvechErrorr?()
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
    var addvechSuccess: (() -> ())?
    var addvechErrorr : (() -> ())?
    var successnotification : (() -> ())?
    
    // MARK: - Network call
    func loginApi(view :  UIView ,username : String , password : String , loginType : String , loginId :String ){
        let url = ServiceApi.login
        
        var params = Parameters()
        params["username"] = username
        params["password"] = password
        params["loginType"] = loginType
        params["loginId"] = loginId
        params["fcmId"] = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken)
        
        print("DFSDAFA",url,params)
        self.dataService?.postApi(view : view ,url: url, params: params, jsonSuccess: { (success) in
            self.loginData = LoginModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.loginErr = LoginModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
          print("@@@errorData" ,errorData)
        })
    }
    
    
    func vechicleAdd(withVechNumber: String, withMakeName: String, withModel: String, vehiclecolor: String) {
        let url = ServiceApi.vechicleAdd
        var params = Parameters()
        params["number"] = withVechNumber
        params["makename"] = withMakeName
        params["model"] = withModel
        params["color"] = vehiclecolor
        print("vehicle color:: \(params)")
        self.dataService?.postApi(view: view ?? UIView(), url: url, params: params, jsonSuccess: { (dataSuccess) in
            self.vechSuccess = AddVechModel.init(json: dataSuccess)
        }, jsonError: { (jsonError) in
            self.vechError = AddVechModel.init(json: jsonError)
        }, error: { (error) in
            print("@@@Error" ,error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        }, dataError: { (data) in
            print("@@@errorData" ,data)
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
            self.otpVerfication = LoginModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errVerfication = LoginModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    //MARK: -- TIPS FLOW
    func tipsApi(with view: UIView, with amount: String) {
        let url = ServiceApi.tips
        
        var params = Parameters()
        let tripid = UserDefaults.standard.string(forKey: UserDefaultsKey.tripid) ?? ""
        print("TRIPS ID::\(tripid)")
        print("amount ID::\(amount)")
        params["tripNo"] = tripid
        params["tips"] = amount
        
        
        self.dataService?.putApi(view: view, url: url, params: params,  jsonSuccess: { (success) in
            
            self.loginData = LoginModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errVerfication = LoginModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func signupApi(view :  UIView ,fname : String , lname : String , email : String , phone : String , cnty : String, cntyname : String, lang : String, cur : String, phcode : String, password : String, referal : String, scId : String , fcmId : String, loginId : String , loginType : String, gender : String){
        let url = ServiceApi.signup
        
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
        params["gender"] = gender
         
        self.dataService?.postApi(view : view,url: url, params: params, jsonSuccess: { (success) in
            
            self.signupData = LoginModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errsignup = LoginModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func forgotOTP(view :  UIView ,email : String ){
        let url = ServiceApi.riderForgotPassword
        
        var params = Parameters()
        params["email"] = email
        
        self.dataService?.postApi(view : view ,url: url, params: params, jsonSuccess: { (success) in
            self.forgototpVerfication = LoginModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errforgototpVerfication = LoginModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func forgotPasseord(view :  UIView ,email : String , password : String ,confirmpassword : String ,   otp : String){
        let url = ServiceApi.riderForgotPassword
        
        var params = Parameters()
        params["email"] = email
        params["password"] = password
        params["confirmpassword"] = confirmpassword
        params["otp"] = otp
        
        self.dataService?.patchApi(view : view ,url: url, params: params, jsonSuccess: { (success) in
            self.forgototpVerfication = LoginModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errforgototpVerfication = LoginModel.init(json: jsonError)
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
             self.errforgototpVerfication = LoginModel.init(json: jsonError)
         }, error: { (Error) in
             print("@@@Error" ,Error)
         }, dataSuccess: { (responseData) in
          print("respomse  fklgjdfkgk\(responseData)")
          print("@@@responseData" ,responseData)
         },dataError: { (errorData) in
             print("@@@errorData" ,errorData)
         })
     }
}
