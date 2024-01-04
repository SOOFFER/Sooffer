//
//  SignupVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 30/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField
import CountryPickerView
import JWTDecode
import GoogleSignIn
import FBSDKLoginKit

class SignupVC: UIViewController , UITextFieldDelegate{
    
    //UI Declaraction
    //Textfield
    @IBOutlet weak var fireNameTXF: SkyFloatingLabelTextField!
    
    @IBOutlet weak var lastNameTXT: SkyFloatingLabelTextField!
    
    @IBOutlet weak var emailAddressTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var passwordTFX: SkyFloatingLabelTextField!
    
    @IBOutlet weak var mobileNumTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var ccTXF: CountryPickerView!
    @IBOutlet weak var referralTXF: SkyFloatingLabelTextField!
    
    //UI ImageView
    @IBOutlet weak var checkImg: UIImageView!
    
    //UILAbel
    @IBOutlet weak var acceptTermsCond: UILabel!
    @IBOutlet weak var loginLbl: UILabel!
    
    //UI button
    @IBOutlet weak var submitBtn: UIButton!
    @IBOutlet weak var googleImg : UIImageView!
    @IBOutlet weak var facebookImg : UIImageView!
    
    @IBOutlet weak var ErrorMsgPswrd : UILabel!
    
    
    @IBOutlet weak var eyeImage: UIImageView!
    
    
    //Variable Declaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var countryCode : String = ""
    var loginVM = LoginSignupVM()
    var profile = ProfileVM()
    let otpView = OTPView.getView
    var countryData : Country?
    var mobileNum : String = ""
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
        
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.loginVM = LoginSignupVM(view: self.view, dataService: ApiRoot())
        profile = ProfileVM(dataService: ApiRoot())
        self.setupData()
        self.setupView()
        self.setupLang()
        self.setupAction()
        self.setupCountryPicker()
        self.setupTextFieldDelegate()
//        self.configureGoogleSignIn()
    }
    
    
    class func initWithStory()->SignupVC{
        let vc = UIStoryboard.init(name: "Account", bundle: Bundle.main).instantiateViewController(withIdentifier: "SignupVC") as! SignupVC
        return vc
    }
    
    
}
//Mark:- Gentral Function
extension SignupVC {
    
    
    func setupTextFieldDelegate(){
        self.fireNameTXF.delegate = self
        self.lastNameTXT.delegate = self
        self.emailAddressTXF.delegate = self
        self.passwordTFX.delegate = self
        self.mobileNumTXF.delegate = self
        self.referralTXF.delegate = self
    }
    
    // data setup
    func setupData(){
        
        self.ErrorMsgPswrd.isHidden = true
        
//        if let countryCode = (Locale.current as NSLocale).object(forKey: .countryCode) as? String {
//            print(countryCode)
//            self.countryCode = countryCode
//        }
    }
    
    // View Set up
    func setupView() {
        self.submitBtn.roundeCornorBorder = 20
        self.ccTXF.setCountryByCode("US")
        print("selectedCountryCode::\(self.ccTXF.selectedCountry.phoneCode)")
        self.countryCode = self.ccTXF.selectedCountry.phoneCode
      //  self.countryCode = "+91"
        self.fireNameTXF.keyboardType = UIKeyboardType.alphabet
        self.lastNameTXT.keyboardType = UIKeyboardType.alphabet
        self.emailAddressTXF.keyboardType = UIKeyboardType.emailAddress
        self.mobileNumTXF.keyboardType = UIKeyboardType.numberPad
        self.referralTXF.keyboardType = UIKeyboardType.alphabet
        self.passwordTFX.isSecureTextEntry = true
        
        
        //setup color
        self.submitBtn.backgroundColor = UIColor(named: "AppColor")
        self.acceptTermsCond.textColor = UIColor.black
        
        let attrs1 = [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 16), NSAttributedString.Key.foregroundColor : UIColor.darkGray]
        
        let attrs2 = [NSAttributedString.Key.font : UIFont.boldSystemFont(ofSize: 20), NSAttributedString.Key.foregroundColor : UIColor.AppColors]
        
        let attributedString1 = NSMutableAttributedString(string:"Existing User? ", attributes:attrs1)
        
        let attributedString2 = NSMutableAttributedString(string:" LOGIN", attributes:attrs2)
        
        attributedString1.append(attributedString2)
        self.loginLbl.attributedText = attributedString1
        
    }
    
    func setupLang(){
        self.fireNameTXF.placeholder = Localize.stringForKey(key: "first_name")
        self.fireNameTXF.title = Localize.stringForKey(key: "first_name")
        
        self.lastNameTXT.placeholder = Localize.stringForKey(key: "last_name")
        self.lastNameTXT.title = Localize.stringForKey(key: "last_name")
        
        self.emailAddressTXF.placeholder = Localize.stringForKey(key: "email_address")
        self.emailAddressTXF.title = Localize.stringForKey(key: "email_address")
        
        self.passwordTFX.placeholder = Localize.stringForKey(key: "password")
        self.passwordTFX.title = Localize.stringForKey(key: "password")
        
        self.mobileNumTXF.placeholder = Localize.stringForKey(key: "mobile_num")
        self.mobileNumTXF.title = Localize.stringForKey(key: "mobile_num")
        
        self.referralTXF.placeholder = Localize.stringForKey(key: "referral")
        self.referralTXF.title = Localize.stringForKey(key: "referral")
        
        self.acceptTermsCond.text = Localize.stringForKey(key: "tc_pp")
        
        self.submitBtn.setTitle(Localize.stringForKey(key: "submit"), for: .normal)
    }
    
    // View Actions
    func setupAction(){
        
        self.loginLbl.addAction(for: .tap) {
            let vc = LoginVC.initWithStory()
            self.navigationController?.pushViewController(vc, animated: true)
        }
        self.submitBtn.addAction(for: .tap) {
            self.validation()
        }
        self.checkImg.addAction(for: .tap) {
            if self.checkImg.image == UIImage(named: "unchecked"){
                self.checkImg.image = UIImage(named: "checked")
            }else{
                self.checkImg.image = UIImage(named: "unchecked")
            }
        }
        self.acceptTermsCond.addAction(for: .tap) {
            TermsConditionView.getView.initView(view: self.view)
        }
        
        self.ccTXF.addAction(for: .tap) {
            if let nav = self.navigationController {
                self.ccTXF.showCountriesList(from: nav)
            }
        }
        
        self.facebookImg.addAction(for: .tap) {
            self.gettingMobileNumberAlert(logintype: "facebook")
        }
        
        self.googleImg.addAction(for: .tap) {
            self.gettingMobileNumberAlert(logintype: "google")
        }
        
        self.eyeImage.addTap {
            if self.eyeImage.image == UIImage(named: "eye-open"){
                self.passwordTFX.isSecureTextEntry = true
                self.eyeImage.image = UIImage(named: "eye close")
            }else{
                self.passwordTFX.isSecureTextEntry = false
                self.eyeImage.image = UIImage(named: "eye-open")
            }
        }
    }
    
    func gettingMobileNumberAlert(logintype : String){
        let alertController = UIAlertController(title: self.Localize.stringForKey(key: "add_phone"), message: self.Localize.stringForKey(key: "phone_signup"), preferredStyle: .alert)
        alertController.addTextField { (textField : UITextField!) -> Void in
            textField.placeholder = self.Localize.stringForKey(key: "enter_phone")
            textField.keyboardType = .numberPad
            
        }
        let saveAction = UIAlertAction(title: self.Localize.stringForKey(key: "save"), style: .default, handler: { alert -> Void in
            let firstTextField = alertController.textFields![0] as UITextField
            self.mobileNum = firstTextField.text ?? ""
            if !self.mobileNum.isEmpty && !(self.mobileNum.count<10){
                if logintype == "google"{
//                    self.googleLogin()
                }else{
                    self.facebookLogin()
                }
            }else{
                showToast(msg: self.Localize.stringForKey(key: "err_mobile"))
            }
        })
        let cancelAction = UIAlertAction(title: self.Localize.stringForKey(key: "cancel"), style: .default, handler: { (action : UIAlertAction!) -> Void in })
        
        
        alertController.addAction(saveAction)
        alertController.addAction(cancelAction)
        
        self.present(alertController, animated: true, completion: nil)
        
    }
    
//    func googleLogin(){
//    GIDSignIn.sharedInstance().scopes.append("https://www.googleapis.com/auth/plus.login")
//        GIDSignIn.sharedInstance().scopes.append("https://www.googleapis.com/auth/plus.me")
////        if GIDSignIn.sharedInstance().hasAuthInKeychain() == true{
////            GIDSignIn.sharedInstance().signInSilently()
////        }
////        else{
//            GIDSignIn.sharedInstance().signIn()
////        }
//    }
    
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
                        self.signupApi(fname: res["name"]! as! String, lname: "", email: res["email"]! as! String, phone: self.mobileNum, cnty: "", cntyname: "", lang: lang, cur: Constant.priceTag, phcode: "", password: "", referal: "", scId: "", fcmId: fcmid, loginId: res["id"]! as! String , loginType: "facebook")
                    })
                }
            }
        })
    }
    //validation
    func validation(){
        let fname : String = self.fireNameTXF.text ?? ""
        let lname : String = self.lastNameTXT.text ?? ""
        let email : String = self.emailAddressTXF.text ?? ""
        let password : String = self.passwordTFX.text ?? ""
        let mobile : String = self.mobileNumTXF.text ?? ""
        let referral : String = self.referralTXF.text ?? ""
        let lang : String = UserDefaults.standard.value(forKey: UserDefaultsKey.language) as? String ?? ""
        let fcmid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
        
        //firest name
        if !fname.isEmpty{
            setTextfieldApperance(textfild: self.fireNameTXF, title: Localize.stringForKey(key: "first_name"), color: UIColor(named: "AppColor")!, isError: false)
            
            if !(fname.count < 3){
                setTextfieldApperance(textfild: self.fireNameTXF, title: Localize.stringForKey(key: "first_name"), color: UIColor(named: "AppColor")!, isError: false)
                lastNameTXT.becomeFirstResponder()
                // last name
                if !lname.isEmpty{
                    setTextfieldApperance(textfild: self.lastNameTXT, title: Localize.stringForKey(key: "last_name"), color: UIColor(named: "AppColor")!, isError: false)
                    
                    if !(lname.count < 1){
                        setTextfieldApperance(textfild: self.lastNameTXT, title: Localize.stringForKey(key: "last_name"), color: UIColor(named: "AppColor")!, isError: false)
                        emailAddressTXF.becomeFirstResponder()
                        
                        //email
                        if !email.isEmpty{
                            setTextfieldApperance(textfild: self.emailAddressTXF, title: Localize.stringForKey(key: "email_address"), color: UIColor(named: "AppColor")!, isError: false)
                            if email.isValidEmail(){
                                setTextfieldApperance(textfild: self.emailAddressTXF, title: Localize.stringForKey(key: "email_address"), color: UIColor(named: "AppColor")!, isError: false)
                                passwordTFX.becomeFirstResponder()
                                
                                //password
                                if !password.isEmpty{
                                    setTextfieldApperance(textfild: self.passwordTFX, title: Localize.stringForKey(key: "password"), color: UIColor(named: "AppColor")!, isError: false)
                                    
                                    let isValidPassword = validatePassword(password)
                                    //if password.isPasswordHasNumberAndCharacter(){
                                    if isValidPassword {
                                        setTextfieldApperance(textfild: self.passwordTFX, title: Localize.stringForKey(key: "password"), color: UIColor(named: "AppColor")!, isError: false)
                                        mobileNumTXF.becomeFirstResponder()
                                        
                                        //mobile num
                                        if !mobile.isEmpty{
                                            setTextfieldApperance(textfild: self.mobileNumTXF, title: Localize.stringForKey(key: "mobile_num"), color: UIColor(named: "AppColor")!, isError: false)
                                            
                                            if mobile.isValidPhoneNumber(){
                                                setTextfieldApperance(textfild: self.mobileNumTXF, title: Localize.stringForKey(key: "mobile_num"), color: UIColor(named: "AppColor")!, isError: false)
                                             self.view.endEditing(true)
                                                //                                                referralTXF.becomeFirstResponder()
                                                
                                                //country code
                                                if !countryCode.isEmpty{
                                                    if self.checkImg.image == UIImage(named: "unchecked"){
                                                        view.endEditing(true)
                                                        showToast(msg: Localize.stringForKey(key: "err_agree"))
                                                        
                                                    }else{
                                                        // api call
                                                        self.signupApi(fname: fname, lname: lname, email: email, phone: mobile, cnty: countryData?.code ?? "", cntyname: countryData?.name ?? "", lang: lang, cur: Constant.priceTag, phcode: countryCode, password: password, referal: referral, scId: "", fcmId: fcmid, loginId: "", loginType: "normal")
                                                    }
                                                    
                                                    
                                                    
                                                }else{
                                                    showToast(msg: "Please select any Phonce code")
                                                }
                                                
                                            }else{
                                                setTextfieldApperance(textfild: self.mobileNumTXF, title: Localize.stringForKey(key: "err_mobile"), color: UIColor.red, isError: true)
                                            }
                                        }else{
                                            setTextfieldApperance(textfild: self.mobileNumTXF, title: Localize.stringForKey(key: "ent_mobile_num"), color: UIColor.red, isError: true)
                                        }
                                        
                                    }else{
                                        setTextfieldApperance(textfild: self.passwordTFX, title: Localize.stringForKey(key: "err_pass_count"), color: UIColor.red, isError: true)
                                        self.ErrorMsgPswrd.isHidden = false
                                        self.ErrorMsgPswrd.text = "Password must be 8 characters long, and combination one letters, one number and special character"
                                    }
                                }else{
                                    setTextfieldApperance(textfild: self.passwordTFX, title: Localize.stringForKey(key: "ent_password"), color: UIColor.red, isError: true)
                                }
                                
                                
                                
                            }else{
                                setTextfieldApperance(textfild: self.emailAddressTXF, title: Localize.stringForKey(key: "ent_email_address"), color: UIColor.red, isError: true)
                            }
                        }else{
                            setTextfieldApperance(textfild: self.emailAddressTXF, title: Localize.stringForKey(key: "ent_email_address"), color: UIColor.red, isError: true)
                        }
                        
                        
                    }else{
                        setTextfieldApperance(textfild: self.lastNameTXT, title: Localize.stringForKey(key: "err_last_count"), color: UIColor.red, isError: true)
                    }
                }else{
                    setTextfieldApperance(textfild: self.lastNameTXT, title: Localize.stringForKey(key: "ent_last_name"), color: UIColor.red, isError: true)
                }
            }else{
                setTextfieldApperance(textfild: self.fireNameTXF, title: Localize.stringForKey(key: "err_count"), color: UIColor.red, isError: true)
            }
        }else{
            setTextfieldApperance(textfild: self.fireNameTXF, title: Localize.stringForKey(key: "ent_first_name"), color: UIColor.red, isError: true)
        }
    }

    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if textField == self.mobileNumTXF{
//            if textField.text?.count == 0{
//                textField.text = "0"
//            }
            let maxLength = 10
            let currentString: NSString = textField.text! as NSString
            let newString: NSString =
                currentString.replacingCharacters(in: range, with: string) as NSString
            return newString.length <= maxLength
        }
        return true
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        textField.text = textField.text?.trimmingCharacters(in: .whitespaces)
        if textField.text!.isEmpty {
            if textField == fireNameTXF{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_first_name"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
                
            }
            else if textField == lastNameTXT{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_last_name"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
                
            }
            else if textField == emailAddressTXF{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_email_address"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
                
            }
            else if textField == passwordTFX{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_password"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
                
            } else if textField == mobileNumTXF{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_mobile_num"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
            }
        }
    }
    
    func setTextfieldApperance(textfild : SkyFloatingLabelTextField , title : String , color : UIColor,isError : Bool){
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
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        
        if textField.text!.isEmpty{
            if textField == fireNameTXF{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_first_name"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
               
            }
            else if textField == lastNameTXT{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_last_name"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
                
            }
            else if textField == emailAddressTXF{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_email_address"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
                
            }
            else if textField == passwordTFX{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_password"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
                
            } else if textField == mobileNumTXF{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "ent_mobile_num"), color: UIColor.red, isError: true)
                textField.becomeFirstResponder()
                
            }
           
           
        }else{
            if textField == fireNameTXF{
                setTextfieldApperance(textfild: self.fireNameTXF, title: Localize.stringForKey(key: "first_name"), color: UIColor(named: "AppColor")!, isError: false)
                
                lastNameTXT.becomeFirstResponder()
            }
            else if textField == lastNameTXT{
                setTextfieldApperance(textfild: self.lastNameTXT, title: Localize.stringForKey(key: "last_name"), color: UIColor(named: "AppColor")!, isError: false)
                
                emailAddressTXF.becomeFirstResponder()
            }
            else if textField == emailAddressTXF{
                setTextfieldApperance(textfild: self.emailAddressTXF, title: Localize.stringForKey(key: "email_address"), color: UIColor(named: "AppColor")!, isError: false)
                
                passwordTFX.becomeFirstResponder()
            }
            else if textField == passwordTFX{
                setTextfieldApperance(textfild: self.passwordTFX, title: Localize.stringForKey(key: "password"), color: UIColor(named: "AppColor")!, isError: false)
                
                mobileNumTXF.becomeFirstResponder()
            } else if textField == mobileNumTXF{
                setTextfieldApperance(textfild: self.mobileNumTXF, title: Localize.stringForKey(key: "mobile_num"), color: UIColor(named: "AppColor")!, isError: false)
                self.view.endEditing(true)
                // referralTXF.becomeFirstResponder()
            }
            else if textField == referralTXF{
                //                setTextfieldApperance(textfild: self.referralTXF, title: Localize.stringForKey(key: "referral"), color: UIColor(named: "AppColor")!, isError: false)
                
                self.view.endEditing(true)
                self.validation()
            }
        }
        
        return true
    }
}

extension SignupVC : CountryPickerViewDelegate, CountryPickerViewDataSource{
    
    func setupCountryPicker(){
        
        ccTXF.delegate = self
        ccTXF.dataSource = self
        ccTXF.showCountryCodeInView = false
        ccTXF.showPhoneCodeInView = true
       // ccTXF.flagImageView.image = UIImage()
        
        
    }
    
    func countryPickerView(_ countryPickerView: CountryPickerView, didSelectCountry country: Country){
        ccTXF.flagImageView.image = country.flag
        self.countryCode = country.phoneCode
        self.countryData = country
    }
    
    
}

// google login
//extension SignupVC :  GIDSignInDelegate{
//    func configureGoogleSignIn()
//    {
//        GIDSignIn.sharedInstance().clientID = "414505975837-v3fqjac0gqs5hjut1c15q97uii58gbhr.apps.googleusercontent.com"
//        GIDSignIn.sharedInstance().delegate = self
////        GIDSignIn.sharedInstance().uiDelegate = self
//
//    }
//
//    //MARK:- Google SignIn
//    public func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {
//        if (error == nil) {
//            // Perform any operations on signed in user here.
//            GIDSignIn.sharedInstance().currentUser
//            let userId = user.userID                  // For client-side use only!
//            let idToken = user.authentication.idToken // Safe to send to the server
//            let name = user.profile.name
//            let email = user.profile.email
//            let lang : String = UserDefaults.standard.value(forKey: UserDefaultsKey.language) as? String ?? ""
//            let fcmid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
//            // api call
//            self.signupApi(fname: name ?? "", lname: "", email: email ?? "", phone: self.mobileNum, cnty: "", cntyname: "", lang: lang, cur: Constant.priceTag, phcode: "", password: "", referal: "", scId: "", fcmId: fcmid, loginId: userId ?? "", loginType: "google")
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
//
//    func sign(_ signIn: GIDSignIn!, present viewController: UIViewController!) {
//        self.present(viewController, animated: true, completion: nil)
//    }
//
//    func sign(_ signIn: GIDSignIn!, dismiss viewController: UIViewController!) {
//        self.dismiss(animated: true, completion: nil)
//    }
//}

// APi Call
extension SignupVC{
    
    func signupApi(fname : String , lname : String , email : String , phone : String , cnty : String, cntyname : String, lang : String, cur : String, phcode : String, password : String, referal : String, scId : String , fcmId : String, loginId : String , loginType : String){
        if loginType != "normal"{
             self.loginVM.signupApi(view : self.view,fname: fname, lname: lname, email: email, phone: phone, cnty: cnty, cntyname: cntyname, lang: lang, cur: cur, phcode: phcode, password: password, referal: referal, scId: scId, fcmId: fcmId, loginId : loginId , loginType : loginType)
        }else{
            self.loginVM.otpVerificationApi(email: email, phcode: phcode, phone: phone)
        }
        
        self.loginVM.successVerification = {            self.otpView.initView(view: self.view, submit: { (otp) in
                print("sdasdgjhasdgj\(otp)")
                print("sdasdgjhasdgj\(self.loginVM.otpVerfication?.code)")
                if otp == (self.loginVM.otpVerfication?.code ?? "0").description {
                    self.otpView.deInitView()
                    self.loginVM.signupApi(view : self.view,fname: fname, lname: lname, email: email, phone: phone, cnty: cnty, cntyname: cntyname, lang: lang, cur: cur, phcode: phcode, password: password, referal: referal, scId: scId, fcmId: fcmId, loginId : loginId , loginType : loginType)
                   
                }else{
                    showToast(msg: self.Localize.stringForKey(key: "worng_otp"))
                }
            }, resend: { _ in
//                self.otpView.deInitView()
                self.loginVM.otpVerificationApi(email: email, phcode: phcode, phone: phone)
                 
            })
        }
        
        self.loginVM.successSignup = {
            if let signupResponse = self.loginVM.signupData{
              print("tokenssksdjfksdjf::\(signupResponse.token)")
                UserDefaults.standard.set(signupResponse.token, forKey: UserDefaultsKey.token)
                let jwt = try! decode(jwt: signupResponse.token)
                let data = jwt.body
                //self.updateToken()
                
                self.profile.getProfile()
                self.profile.successprofile = {
                    UserDefaults.standard.set(data["email"] as? String ?? "", forKey: UserDefaultsKey.email)
                    UserDefaults.standard.set(data["name"] as? String ?? "", forKey: UserDefaultsKey.name)
                    UserDefaults.standard.set(data["id"] as? String ?? "", forKey: UserDefaultsKey.userid)
                    UserDefaults.standard.set(signupResponse.token , forKey: UserDefaultsKey.token)
                    UserDefaults.standard.set("LoggedIn", forKey: UserDefaultsKey.loginstatus)
                    self.updateToken()
                    let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
                    self.appDelegate.window?.rootViewController = MenuRoot
                }
                
            }
            
        }
        
        self.loginVM.errSignup = {
            self.fireNameTXF.text = ""
            self.lastNameTXT.text = ""
            self.emailAddressTXF.text = ""
            self.passwordTFX.text = ""
            self.mobileNumTXF.text = ""
            self.referralTXF.text = ""
            
            self.fireNameTXF.placeholderColor = UIColor.gray
            self.lastNameTXT.placeholderColor = UIColor.gray
            self.emailAddressTXF.placeholderColor = UIColor.gray
            self.passwordTFX.placeholderColor = UIColor.gray
            self.mobileNumTXF.placeholderColor = UIColor.gray
            self.referralTXF.placeholderColor = UIColor.gray
        }
    }
    
    func updateToken(){
//     if !(UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? "").isEmpty{
//         var token : String =  UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
//           FireBaseconnection.instanse.updateToken(token: token)
//     }else{
//         var token : String =  Constant.fcm_id
//         FireBaseconnection.instanse.updateToken(token: token)
//     }
        
            let token : String =  UserDefaults.standard.string(forKey: UserDefaultsKey.fcmtoken) ?? Constant.fcm_id
            FireBaseconnection.instanse.updateToken(token: token)
    }
    
}

extension SignupVC {
    
    func validatePassword(_ password: String) -> Bool {
        // Check for at least 8 characters
        if password.count < 8 {
            return false
        }
        
        // Check for at least one uppercase letter
        if password.rangeOfCharacter(from: .uppercaseLetters) == nil {
            return false
        }
        
        // Check for at least one lowercase letter
        if password.rangeOfCharacter(from: .lowercaseLetters) == nil {
            return false
        }
        
        // Check for at least one special character (e.g., !@#$%^&*)
        let specialCharacterSet = CharacterSet(charactersIn: "!@#$%^&*")
        if password.rangeOfCharacter(from: specialCharacterSet) == nil {
            return false
        }
        
        // All requirements are met
        return true
    }

}


