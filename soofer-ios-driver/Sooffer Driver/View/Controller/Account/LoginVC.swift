//
//  LoginVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 29/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField
import JWTDecode
import GoogleSignIn
import FBSDKLoginKit

class LoginVC: UIViewController , UITextFieldDelegate {
    
    
    //UI Declaraction
    
    //View
    @IBOutlet weak var loginView: UIView!
    
    //SKYPETEXT
    @IBOutlet weak var emailView: UIView!
    @IBOutlet weak var passView: UIView!
    @IBOutlet weak var emailTxt: UITextField!
    @IBOutlet weak var passTxt: UITextField!
   
    // BUTTON
    @IBOutlet weak var loginBtn: UIButton!
    
    @IBOutlet weak var forgothearderView: UIView!
    @IBOutlet weak var forgotView: UIView!
    @IBOutlet weak var forgotbackimage : UIImageView!
    @IBOutlet weak var emailAddressTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var forgotsubmitBtn: UIButton!
    
    // Label
    @IBOutlet weak var forgotLabel: UILabel!
    @IBOutlet weak var signupLbl : UILabel!
    @IBOutlet weak var facebookImg : UIImageView!
    @IBOutlet weak var googleImg : UIImageView!
    @IBOutlet weak var eyeiconimg: UIImageView!
    
    // variable Declaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var loginVM = LoginSignupVM()
    var profile = ProfileVM()
    var emailid : String = ""
    
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.loginVM = LoginSignupVM(view: self.view, dataService: ApiRoot())
        profile = ProfileVM(dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupDelegate()
//        self.configureGoogleSignIn()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
        
    }
    
    class func initWithStory()->LoginVC{
        let vc = UIStoryboard.init(name: "Account", bundle: Bundle.main).instantiateViewController(withIdentifier: "LoginVC") as! LoginVC
        return vc
    }

    
}

//Mark:- Gentral Function
extension LoginVC {
    
    // View Set up
    func setupView() {
        self.loginView.isElevation = 2
        self.loginView.roundeCornorBorder = 5
        self.loginBtn.roundeCornorBorder = 5
        self.passTxt.keyboardType = UIKeyboardType.alphabet
        self.emailTxt.keyboardType = UIKeyboardType.alphabet
        self.passTxt.isSecureTextEntry = true
        self.loginBtn.backgroundColor = UIColor(named: "AppColor")
        self.forgotLabel.textColor = UIColor.black
        
        self.forgothearderView.isElevation = 3
        self.loginBtn.roundeCornorBorder = 20
        self.emailView.roundeCornorBorder = 10
        self.forgotsubmitBtn.roundeCornorBorder = 20
        self.passView.roundeCornorBorder = 10
        self.emailAddressTXF.delegate = self
        self.emailAddressTXF.keyboardType = UIKeyboardType.emailAddress
        self.emailAddressTXF.placeholder = Localize.stringForKey(key: "ent_mobile_num")
        self.emailAddressTXF.title = Localize.stringForKey(key: "ent_mobile_num")
        let attrs1 = [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 16), NSAttributedString.Key.foregroundColor : UIColor.darkGray]
        
        let attrs2 = [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 20), NSAttributedString.Key.foregroundColor : UIColor.AppColors]
        
        let attributedString1 = NSMutableAttributedString(string:"New User? ", attributes:attrs1)
        
        let attributedString2 = NSMutableAttributedString(string:" SIGN UP", attributes:attrs2)
        
        attributedString1.append(attributedString2)
        self.signupLbl.attributedText = attributedString1
        
    }
    
    func setupLang(){
        self.emailTxt.placeholder = Localize.stringForKey(key: "email_phone")
        self.passTxt.placeholder = Localize.stringForKey(key: "password")
        self.loginBtn.setTitle(Localize.stringForKey(key: "login"), for: .normal)
        self.forgotLabel.text = Localize.stringForKey(key: "forgot_pass")
    }
    
    func setupDelegate(){
        self.emailTxt.delegate = self
        self.passTxt.delegate = self
    }
    
    // View Actions
    func setupAction(){
        self.signupLbl.addAction(for: .tap) {
            let vc = SignupVC.initWithStory()
            self.navigationController?.pushViewController(vc, animated: true)
        }
        
        self.forgotbackimage.addAction(for: .tap) {
                   self.emailTxt.text = ""
                   self.passTxt.text = ""
                   self.emailAddressTXF.text = ""
                   self.forgotView.isHidden = true
               }
               self.forgotLabel.addAction(for: .tap) {
                   self.emailTxt.text = ""
                   self.passTxt.text = ""
                   self.emailAddressTXF.text = ""
                   self.forgotView.isHidden = false
               }
        self.eyeiconimg.addTap {
            if self.eyeiconimg.image == UIImage(named: "eye-open"){
                self.passTxt.isSecureTextEntry = true
                self.eyeiconimg.image = UIImage(named: "eye close")
            }else{
                self.passTxt.isSecureTextEntry = false
                self.eyeiconimg.image = UIImage(named: "eye-open")
            }
        }
               self.forgotsubmitBtn.addAction(for: .tap) {
                   self.emailid = self.emailAddressTXF.text ?? ""
                   if !self.emailid.isEmpty && (self.emailid.isValidPhoneNumber()){
                       self.forgotPassword(email: self.emailid)
                   }else{
             self.setforgotTextfieldApperance(textfild: self.emailAddressTXF as! SkyFloatingLabelTextField, title:  self.Localize.stringForKey(key: "ent_mobile_num"), color: UIColor.red, isError: true)
                       showToast(msg: "Enter Valid Mobile Number")
                   }
               }
        
//        self.forgotLabel.addAction(for: .tap) {
//            let alertController = UIAlertController(title: self.Localize.stringForKey(key: "forgot_pass"), message: self.Localize.stringForKey(key: "forgot_msg"), preferredStyle: .alert)
//            alertController.addTextField { (textField : UITextField!) -> Void in
//                textField.placeholder = self.Localize.stringForKey(key: "enter_email")
//                textField.keyboardType = .emailAddress
//
//            }
//            let saveAction = UIAlertAction(title: "Submit", style: .default, handler: { alert -> Void in
//                let firstTextField = alertController.textFields![0] as UITextField
//                self.emailid = firstTextField.text ?? ""
//                if !self.emailid.isEmpty && (self.emailid.isValidEmail()){
//                    self.forgotPassword(email: self.emailid)
//                }else{
//                    showToast(msg: self.Localize.stringForKey(key: "enter_email"))
//                }
//            })
//            let cancelAction = UIAlertAction(title: "Cancel", style: .default, handler: { (action : UIAlertAction!) -> Void in })
//
//
//            alertController.addAction(saveAction)
//            alertController.addAction(cancelAction)
//
//            self.present(alertController, animated: true, completion: nil)
//        }
        
        self.loginBtn.addAction(for: .tap) {
            self.validation()
        }
    
        self.facebookImg.addAction(for: .tap) {
            self.facebookLogin()
        }
        
        self.googleImg.addAction(for: .tap) {
//            GIDSignIn.sharedInstance.scopes.append("https://www.googleapis.com/auth/plus.login")
//            GIDSignIn.sharedInstance.scopes.append("https://www.googleapis.com/auth/plus.me")
////            if GIDSignIn.sharedInstance().hasAuthInKeychain() == true{
////                GIDSignIn.sharedInstance().signInSilently()
////            }
////            else{
//                GIDSignIn.sharedInstance.signIn()
////            }
        }
    }
    
    func facebookLogin(){
        let login = LoginManager()
        login.logIn(permissions: ["email"], from: self, handler:  { (FBSDKLoginManagerRequestTokenHandler, Error) in
            if Error != nil {
                print("Login via Facebook Error: \(Error)")
            } else {
                let access  =  FBSDKLoginManagerRequestTokenHandler
                if ( access?.isCancelled == true)
                {
                    return
                }
                let accessToken = AccessToken.current
                if ((accessToken?.userID.count)! > 0)
                {
                    let req = GraphRequest(graphPath: "me", parameters: ["fields":"email,name"], tokenString: accessToken?.tokenString, version: nil, httpMethod: HTTPMethod(rawValue: "GET"))
                    req.start(completionHandler: { (connection, result, error) in
                        let res = result as! NSDictionary
                        let lang : String = UserDefaults.standard.value(forKey: UserDefaultsKey.language) as? String ?? ""
                        let fcmid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
                        
                        // api call
                        self.loginApi(username: res["email"]! as! String, password: "", loginType: "facebook", loginId: res["id"]! as! String)
                        
                    })
                }
            }
        })
    }
    func setforgotTextfieldApperance(textfild : SkyFloatingLabelTextField , title : String , color : UIColor,isError : Bool){
              if isError == true{
                  textfild.title = title
                  textfild.placeholder = title
                  textfild.placeholderColor = color
              }else{
                  textfild.title = title
                  textfild.placeholderColor = color
              }
              textfild.titleColor = color
              textfild.lineColor = color
          }
    
    
    //validation
    func validation(){
        let email : String = self.emailTxt.text ?? ""
        let password : String = self.passTxt.text ?? ""
      
        if !email.isEmpty{
            setTextfieldApperance(textfild: self.emailTxt, title: Localize.stringForKey(key: "email_phone"), color: UIColor(named: "AppColor")!, isError: false)
            
            if !password.isEmpty{
                setTextfieldApperance(textfild: self.passTxt, title: Localize.stringForKey(key: "password"), color: UIColor(named: "AppColor")!, isError: false)
                
                loginApi(username: email, password: password, loginType: "normal", loginId: "")
                
                
            }else{
                setTextfieldApperance(textfild: self.passTxt, title: Localize.stringForKey(key: "ent_password"), color: UIColor.red, isError: true)
            }
        }else{
            setTextfieldApperance(textfild: self.emailTxt, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
        }
        
    }
    
    
    
    func setTextfieldApperance(textfild : UITextField , title : String , color : UIColor,isError : Bool){
        if isError == true{
            textfild.placeholder = title
            textfild.placeHolderColor = color
        }else{
            textfild.placeHolderColor = color
        }
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        textField.text = textField.text?.trimmingCharacters(in: .whitespaces)
            if textField.text!.isEmpty {
                if textField == self.passTxt{
                    setTextfieldApperance(textfild: textField as! UITextField, title: Localize.stringForKey(key: "ent_password"), color: UIColor.red, isError: true)
                }else{
                    setTextfieldApperance(textfild: textField as! UITextField, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                }
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        
        if textField.text!.isEmpty{
            if textField == self.passTxt{
                setTextfieldApperance(textfild: textField as! UITextField, title: Localize.stringForKey(key: "ent_password"), color: UIColor.red, isError: true)
            }else{
                setTextfieldApperance(textfild: textField as! UITextField, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
            }
            textField.becomeFirstResponder()
        }else{
            if textField == emailTxt{
                setTextfieldApperance(textfild: self.emailTxt, title: Localize.stringForKey(key: "email_phone"), color: UIColor(named: "AppColor")!, isError: false)
                
                passTxt.becomeFirstResponder()
            }
            else if textField == passTxt{
                setTextfieldApperance(textfild: self.passTxt, title: Localize.stringForKey(key: "password"), color: UIColor(named: "AppColor")!, isError: false)
                
                self.view.endEditing(true)
                self.validation()
            }
        }
       
        return true
    }
    
}
// google login
//extension LoginVC :  GIDSignInDelegate{
////    func configureGoogleSignIn()
////    {
////        GIDSignIn.sharedInstance.clientID = "414505975837-52cfmjkr89r19p74c7uu66fj0v0lqqvq.apps.googleusercontent.com"
////        GIDSignIn.sharedInstance.delegate = self
//////        GIDSignIn.sharedInstance().uiDelegate = self
////
//    }
//    
//    //MARK:- Google SignIn
//    public func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {
//        if (error == nil) {
//            // Perform any operations on signed in user here.
//            GIDSignIn.sharedInstance.currentUser
//            let userId = user.userID                  // For client-side use only!
//            let idToken = user.authentication.idToken // Safe to send to the server
//            let name = user.profile?.name
//            let email = user.profile?.email
//            loginApi(username: "", password: "", loginType: "google", loginId: userId ?? "")
//            
//        }
//        else
//        {
//            print("\(error.localizedDescription)")
//        }
//        
//    }
//    func sign(_ signIn: GIDSignIn!, didDisconnectWith user: GIDGoogleUser!, withError error: Error!) {
//        
//    }
//}



// APi Call
extension LoginVC{
    
    func loginApi(username: String, password: String, loginType: String, loginId: String){
       
        self.loginVM.loginApi(view : self.view,username: username, password: password, loginType: loginType, loginId: loginId)
       
        self.loginVM.successLogin = {
            if let loginResponse = self.loginVM.loginData{
                print("LoginDriverRes",loginResponse.data[0].email)
                UserDefaults.standard.set(loginResponse.token, forKey: UserDefaultsKey.token)
                let jwt = try! decode(jwt: loginResponse.token)
                let data = jwt.body
                
                UserDefaults.standard.set(data["email"] as? String ?? "", forKey: UserDefaultsKey.email)
                UserDefaults.standard.set(data["name"] as? String ?? "", forKey: UserDefaultsKey.name)
                UserDefaults.standard.set(data["id"] as? String ?? "", forKey: UserDefaultsKey.userid)
                UserDefaults.standard.set(loginResponse.token , forKey: UserDefaultsKey.token)
                
                self.profile.getProfile()
                self.profile.successprofile = {
                    if (self.profile.profileData?.taxis.count ?? 0) > 0{
                        self.updateToken()
                    let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
                    self.appDelegate.window?.rootViewController = MenuRoot
                        UserDefaults.standard.set("LoggedIn", forKey: UserDefaultsKey.loginstatus)
                        
                    }else{
                        let userDocvc = AddVechileVC.initWithStory()
                        userDocvc.pageFrom = "signup"
                        self.navigationController?.pushViewController(userDocvc, animated: true)
                    }
                }
            }
         
       
        }
        
        self.loginVM.errorLogin = {
            self.emailTxt.text = ""
            self.passTxt.text = ""
            self.emailTxt.placeHolderColor = UIColor.gray
            self.passTxt.placeHolderColor = UIColor.gray
        }
    }
    
    func forgotPassword(email : String){
        self.loginVM.forgotOTP(email: email)
        
        self.loginVM.successforgot = {
             self.forgotView.isHidden = true
            ChangePasswordAlert.getView.initView(view: self.view, pagefrom: "forgot", email: email)
            
        }
    }
    func updateToken(){
     if !(UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? "").isEmpty{
         var token : String =  UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
           FireBaseconnection.instanse.updateToken(token: token)
     }else{
         var token : String =  Constant.fcm_id
         FireBaseconnection.instanse.updateToken(token: token)
     }
        
    }
}
