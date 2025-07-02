//
//  ProfileVM.swift
//  RebuStar Rider
//
//  Created by Abservetech on 12/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class ProfileVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var profileData : ProfileModel?{
        didSet {
            self.successprofile?()
        }
    }
    
    var profileEdit : ProfileEditModel?{
        didSet{
            var profile = ProfileModel()
            profile.email = self.profileEdit?.request.email ?? ""
            profile.fname = self.profileEdit?.request.fname  ?? ""
            profile.lname = self.profileEdit?.request.lname  ?? ""
            profile.phone = self.profileEdit?.request.phone  ?? ""
            profile.phcode = self.profileEdit?.request.phcode  ?? ""
            profile.profile = self.profileEdit?.request.profile ?? ""
            self.profileData = profile
        }
    }
    
    var profileErr : ProfileModel?{
        didSet {
            self.errorprofile?()
        }
    }
    
    var changepass : changePasswprd?{
        didSet {
            self.successChangePAss?()
        }
    }
    var errchangepass : changePasswprd?{
        didSet {
            self.errorChangePAss?()
        }
    }
    var AccountDeletionData : changePasswprd?{
        didSet {
            self.AccountDeletion?()
        }
    }
    var ErrDeletion : changePasswprd?{
        didSet {
            self.ErrorAccountDeletion?()
        }
    }
    //Mark :- Constructor
    init() { }
    
    init(view : UIView ,dataService : ApiRoot) {
        self.dataService = dataService
    }
    
    init(dataService : ApiRoot) {
        self.dataService = dataService
    }
    
    // MARK: - Closures for callback, since we are not using the ViewModel to the View.
    var errorinFetchData: (() -> ())?
    var showErrorAlertClosure: (() -> ())?
    var successprofile : (() -> ())?
    var errorprofile : (() -> ())?
    var successChangePAss : (() -> ())?
    var errorChangePAss : (() -> ())?
    
    var ErrorAccountDeletion : (() -> ())?
    var AccountDeletion : (() -> ())?
    
    // MARK: - Network call
    func getProfile(){
        let url = ServiceApi.profile
        
        var params = Parameters()
       
        self.dataService?.getApiwithoutView(url: url, params: params, jsonSuccess: { (success) in
//let cartval = configDataModel.init(json: success[0])
          //  Constant.card.last4  = cartval.card.last4
          
            self.profileData = ProfileModel.init(json: success[0])
            Constant.profileData = ProfileModel.init(json: success[0])
            Constant.ConfigData = CONFIGMODEL.init(json: success[3])
            print("1234 :: \(Constant.profileData), \nand:: \(Constant.profileData.card.last4)")
            print("config moddelll:\(Constant.ConfigData)")
            UserDefaults.standard.set(Constant.profileData.card.last4, forKey: UserDefaultsKey.last4)
        }, jsonError: { (jsonError) in
            self.profileErr = ProfileModel.init(json: jsonError[0])
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Edit Profile With upload Images
    func editProfile(view : UIView , image : UIImage ,fname : String , lname : String ,email : String , phone : String , phcode : String){
        
        let url = ServiceApi.profile
        
        var params = Parameters()
        params["fname"] = fname
        params["lname"] = lname
        params["email"] = email
        params["phone"] = phone
        params["phcode"] = phcode
        
        self.dataService?.fileUploadPostApi(view: view, url: url, params: params, image: image, jsonSuccess: { (success) in
            self.profileEdit = ProfileEditModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.profileErr = ProfileModel.init(json: jsonError[0])
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func changepassword(view : UIView ,oldpass : String , newPass : String , confirmPass : String){
        
        let url = ServiceApi.riderpwd
        
        var params = Parameters()
        params["oldpassword"] = oldpass
        params["newpassword"] = newPass
        params["confirmpassword"] = confirmPass
        
        self.dataService?.putApi(view: view, url: url, params: params,  jsonSuccess: { (success) in
            
            self.changepass = changePasswprd.init(json: success)
        }, jsonError: { (jsonError) in
            self.errchangepass = changePasswprd.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    func AccountDeletion(view : UIView,UserId :String){
        print("userid::,\(UserId)")
        let url = ServiceApi.AccountDeletion + "/" + UserId
        let params = Parameters()
        self.dataService?.deleteApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.AccountDeletionData = changePasswprd.init(json: success)
        }, jsonError: { (jsonError) in
            self.ErrDeletion = changePasswprd.init(json: jsonError)
        }, error: { (Error) in
            //print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            //print("@@@responseData" ,responseData)
        }, dataError: { (errorData) in
            //print("@@@errorData" ,errorData)
        })
    }
}
