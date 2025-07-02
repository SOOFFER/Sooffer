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
import FSCalendar

class SignupVC: UIViewController , UITextFieldDelegate, CountryDelegate{
    func countryList(with id: String, with name: String){
        print("Name :\(self.type) , type :\(id)")
        if self.type == "countries" {
            if self.country.text != name{
                self.country.text! = name
                setTextfieldApperance(textfild: self.country, title: Localize.stringForKey(key: "country"), color: UIColor(named: "AppColor")!, isError: false)
                self.city.text! = ""
                self.state.text! = ""
            }
            self.countryid = id
        }else if self.type == "state" {
            if self.state.text != name{
                self.state.text! = name
                setTextfieldApperance(textfild: self.state, title: Localize.stringForKey(key: "state"), color: UIColor(named: "AppColor")!, isError: false)
                self.city.text! = ""
            }
            self.stateId = id
        }else if self.type == "city"{
            self.city.text! = name
            setTextfieldApperance(textfild: self.city, title: Localize.stringForKey(key: "city"), color: UIColor(named: "AppColor")!, isError: false)
            self.cityid = id
        }
        print("cityid : \(self.cityid), stateId : \(self.stateId), countryid : \(self.countryid)")
        print("cityTf : \(self.city.text!), stateTf : \(self.state.text!), countryTf : \(self.country.text!)")
    }
    
    
    //UI Declaraction
    //Textfield
    @IBOutlet weak var backBtn: UIButton!
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
    @IBOutlet weak var eyeimage: UIImageView!
    @IBOutlet weak var ErrorMsgPaswd: UILabel!
    
    @IBOutlet weak var country: SkyFloatingLabelTextField!
    @IBOutlet weak var state: SkyFloatingLabelTextField!
    @IBOutlet weak var city: SkyFloatingLabelTextField!
    
    @IBOutlet weak var GenderSegmentView: UISegmentedControl!
    
    
    @IBOutlet weak var CalendarView: FSCalendar!
    
    @IBOutlet weak var DatePickerView: UIView!
    
    @IBOutlet weak var DOBTxf: SkyFloatingLabelTextField!
    
    
    @IBOutlet weak var datepicker: UIDatePicker!
    
    @IBOutlet weak var maleLbl: UILabel!
    
    @IBOutlet weak var Register: UILabel!
    @IBOutlet weak var FemaleLbl: UILabel!
    
    //Variable Declaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var countryCode : String = ""
    var loginVM = LoginSignupVM()
    let otpView = OTPView.getView
    var countryData : Country?
    var mobileNum : String = ""
    var selectedGender = "Male"
    var accept : Bool = false
    var countryid = String()
    var type = String()
    var cityid = String()
    var stateId = String()
    //Firebase Object
    let FBCONNECT = FireBaseconnection.instanse
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
     self.DatePickerView.isHidden = true
        self.loginVM = LoginSignupVM(view: self.view, dataService: ApiRoot())
        self.setupData()
        self.setupView()
        self.setupLang()
        self.setupAction()
        self.setupCountryPicker()
        self.setupTextFieldDelegate()
      self.GenderSegmentView.addTarget(self, action: #selector(segmentControllClick(_:)), for: .valueChanged)
//        self.configureGoogleSignIn()
         backBtn.addTap {
            self.navigationController?.popViewController(animated: true)
        }
    }
    
    @IBAction func segmentControllClick(_ sender: UISegmentedControl) {
        
        switch GenderSegmentView.selectedSegmentIndex {
        case 0:
            self.selectedGender = "Male"
            print("its male")

            
            
        case 1:
            self.selectedGender = "Female"
            print("its female")
            

            
        default:
            break
        }
    }
    
    class func initWithStory()->SignupVC{
        let vc = UIStoryboard.init(name: "Account", bundle: Bundle.main).instantiateViewController(withIdentifier: "SignupVC") as! SignupVC
        return vc
    }
    
    
    
    @IBAction func DatepickerDoneBtn(_ sender: Any) {
        
        let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            if #available(iOS 14.0, *) {
              datepicker.preferredDatePickerStyle = .inline
            } else {
              // Fallback on earlier versions
            }
            //datepicker.datePickerStyle = .inline
            let dateFormatter1 = DateFormatter()
                dateFormatter1.dateFormat = "MM-dd-yyyy"
            datepicker.maximumDate = Date()
        DOBTxf.text = dateFormatter1.string(from: datepicker.date)
                print("dateof birthh:: \(DOBTxf.text)")
            DatePickerView.isHidden = true






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
        self.DOBTxf.delegate = self
    }
    
    // data setup
    func setupData(){
        self.ErrorMsgPaswd.isHidden = true
//        if let countryCode = (Locale.current as NSLocale).object(forKey: .countryCode) as? String {
//            print(countryCode)
//            self.countryCode = countryCode
//        }
        
    }
    
    // View Set up
    func setupView() {
        self.ccTXF.setCountryByCode("US")
        print("selectedCountryCode::\(self.ccTXF.selectedCountry.phoneCode)")
        self.countryCode = self.ccTXF.selectedCountry.phoneCode
        // self.countryCode = Constant.phoneCode
        
        
        self.submitBtn.roundeCornorBorder = 20
        
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
        
        let attributedString2 = NSMutableAttributedString(string:" SIGN IN", attributes:attrs2)
        
        attributedString1.append(attributedString2)
        self.loginLbl.attributedText = attributedString1
        
        //setup color
        self.submitBtn.backgroundColor = UIColor(named: "AppColor")
        self.acceptTermsCond.textColor = UIColor.black
        
        //        self.ccTXF.text = Constant.phoneCode
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
        
        self.DOBTxf.placeholder = Localize.stringForKey(key: "_DOB")
        self.DOBTxf.title = Localize.stringForKey(key: "_DOB")
        
        self.referralTXF.placeholder = Localize.stringForKey(key: "referral")
        self.referralTXF.title = Localize.stringForKey(key: "referral")
        
        self.acceptTermsCond.text = Localize.stringForKey(key: "tc_pp")
        
        self.submitBtn.setTitle(Localize.stringForKey(key: "submit"), for: .normal)
        
        self.maleLbl.text = Localize.stringForKey(key: "male")
        self.FemaleLbl.text = Localize.stringForKey(key: "female")
        
        self.Register.text = Localize.stringForKey(key: "Register")
    }
    
    // View Actions
    func setupAction(){
        self.country.addTap {
            self.type = "countries"
            let countryList = CountryVc.initWithStory()
            countryList.delegate = self
            countryList.idval  = ""
            countryList.type = "countries"
            self.navigationController?.present(countryList, animated: true, completion: nil)
        }
        self.state.addTap {
            if !self.country.text!.isEmpty{
                self.type = "state"
                print("NEWWW DATASS ::\(self.countryid)")
                let countryList = CountryVc.initWithStory()
                countryList.delegate = self
                countryList.idval  = self.countryid
                countryList.type = "state"
                self.navigationController?.present(countryList, animated: true, completion: nil)
            } else{
                showToast(msg: "Please Select Country")
            }
        }
        self.city.addTap {
            if !self.state.text!.isEmpty{
                self.type = "city"
                let countryList = CountryVc.initWithStory()
                countryList.delegate = self
        //        countryList.idval  = self.countryid
                countryList.idval  = self.stateId
                countryList.type = "city"
                self.navigationController?.present(countryList, animated: true, completion: nil)
            }else{
                showToast(msg: self.country.text!.isEmpty ? "Please Select Country" : "Please Select State")
            }
        }
        self.loginLbl.addAction(for: .tap) {
            let vc = LoginVC.initWithStory()
            self.navigationController?.pushViewController(vc, animated: true)
        }
        self.eyeimage.addTap {
            if self.eyeimage.image == UIImage(named: "eye-open"){
                self.passwordTFX.isSecureTextEntry = true
                self.eyeimage.image = UIImage(named: "eye close")
            }else{
                self.passwordTFX.isSecureTextEntry = false
                self.eyeimage.image = UIImage(named: "eye-open")
            }
        }
        self.submitBtn.addAction(for: .tap) {
            self.validation()
        }
        self.checkImg.addAction(for: .tap) {
            if self.checkImg.image == UIImage(named: "unchecked"){
                self.checkImg.image = UIImage(named: "checked")
                self.accept = true
            }else{
                self.accept = false
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
        
        self.DOBTxf.addAction(for: .tap){
            self.DatePickerView.isHidden = false
                  if #available(iOS 14.0, *) {
                    //<<<<<<< HEAD
                      self.datepicker.preferredDatePickerStyle = .inline
                  } else {
                    // Fallback on earlier versions
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
//        GIDSignIn.sharedInstance().scopes.append("https://www.googleapis.com/auth/plus.login")
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
//                        self.signupApi(fname: res["name"]! as! String, lname: "", email: res["email"]! as! String, phone: self.mobileNum, cnty: "", cntyname: "", lang: lang, cur: Constant.priceTag, phcode: "", password: "", referal: "", scId: "", fcmId: fcmid, loginId: res["id"]! as! String , loginType: "facebook")
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
        let country = self.country.text ?? ""
        let state = self.state.text ?? ""
        let city = self.city.text ?? ""
        let countyId = self.countryid//self.countryID
        let countyName = self.country.text!
        
        let stateId = self.stateId
        let stateName = self.state.text!
        
        let cityId = self.cityid
        let cityName = self.city.text!
        let password : String = self.passwordTFX.text ?? ""
        let mobile : String = self.mobileNumTXF.text ?? ""
        let referral : String = self.referralTXF.text ?? ""
        let Dob : String = self.DOBTxf.text ?? ""
        let lang : String = UserDefaults.standard.value(forKey: UserDefaultsKey.language) as? String ?? ""
        let fcmid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
        let gender : String = self.selectedGender ?? ""
        print("asdasd::,\(gender)")
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
                        
//                        email
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
                                            
                                            if !(mobile.count < 10){
                                                setTextfieldApperance(textfild: self.mobileNumTXF, title: Localize.stringForKey(key: "mobile_num"), color: UIColor(named: "AppColor")!, isError: false)
                                                self.view.endEditing(true)
                                                //                                                referralTXF.becomeFirstResponder()
                                                if !Dob.isEmpty{
                                                    setTextfieldApperance(textfild: self.DOBTxf, title: Localize.stringForKey(key: "_DOB"), color: UIColor(named: "AppColor")!, isError: false)
                                                
                                                //country code
                                                if !countryCode.isEmpty{
                                                    if accept{
                                                   /* if self.checkImg.image == UIImage(named: "unchecked"){
                                                        view.endEditing(true)
                                                        showToast(msg: Localize.stringForKey(key: "err_agree"))*/
               
            // api call
            self.signupApi(fname: fname, lname: lname, email: email, phone: mobile, cnty: countyId /*countryData?.code ?? ""*/, cntyname: countyName /*countryData?.name ?? ""*/, lang: lang, cur: Constant.priceTag, phcode: countryCode, password: password,countryname: countyName, cityname: cityName, statename: stateName, city: self.cityid, state: self.stateId, referal: referral, scId: "", fcmId: fcmid, loginId: "", loginType: "normal", DOB : self.DOBTxf.text ?? "", gender: gender)
                                                        
                                }else{
                        view.endEditing(true)
                showToast(msg: Localize.stringForKey(key: "err_agree"))
                                    
                }
                                                    
                                                    
                                                }else{
                                                    showToast(msg: "Please select any Phonce code")
                                                }
                                                }else{
                                                    setTextfieldApperance(textfild: self.DOBTxf, title: Localize.stringForKey(key: "err_dob"), color: UIColor.red, isError: true)
                                                }
                                                
                                            }else{
                                                setTextfieldApperance(textfild: self.mobileNumTXF, title: Localize.stringForKey(key: "err_mobile"), color: UIColor.red, isError: true)
                                            }
                                        }else{
                                            setTextfieldApperance(textfild: self.mobileNumTXF, title: Localize.stringForKey(key: "ent_mobile_num"), color: UIColor.red, isError: true)
                                        }
                                        
                                    }else{
                                        setTextfieldApperance(textfild: self.passwordTFX, title: Localize.stringForKey(key: "err_pass_count"), color: UIColor.red, isError: true)
                                        self.ErrorMsgPaswd.isHidden = false
                                        self.ErrorMsgPaswd.text = "Password must be 8 characters long, and combination one letters, one number and special character"
                                        
                                    }
                                }else{
                                    setTextfieldApperance(textfild: self.passwordTFX, title: Localize.stringForKey(key: "ent_password"), color: UIColor.red, isError: true)
                                }
                                
                                
                                
                            }
                            else{
                                setTextfieldApperance(textfild: self.emailAddressTXF, title: Localize.stringForKey(key: "ent_email_address"), color: UIColor.red, isError: true)
                            }
                        }
                        else{
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
            else if textField == DOBTxf{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "_DOB"), color: UIColor.red, isError: true)
                
                
            }
//            setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
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
                
            } else if textField == DOBTxf{
                setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "_DOB"), color: UIColor.red, isError: true)
                
                
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
                //                referralTXF.becomeFirstResponder()
            }
            else if textField == DOBTxf{
                setTextfieldApperance(textfild: self.lastNameTXT, title: Localize.stringForKey(key: "_DOB"), color: UIColor(named: "AppColor")!, isError: false)
                
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
//        GIDSignIn.sharedInstance().clientID = "414505975837-52cfmjkr89r19p74c7uu66fj0v0lqqvq.apps.googleusercontent.com"
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
////            self.signupApi(fname: name ?? "", lname: "", email: email ?? "", phone: self.mobileNum, cnty: "", cntyname: "", lang: lang, cur: Constant.priceTag, phcode: "", password: "", referal: "", scId: "", fcmId: fcmid, loginId: userId ?? "", loginType: "google")
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
//

// APi Call
extension SignupVC{
    
    func signupApi(fname : String , lname : String , email : String , phone : String , cnty : String, cntyname : String, lang : String, cur : String, phcode : String, password : String, countryname: String,cityname: String, statename : String, city: String, state: String, referal : String, scId : String , fcmId : String, loginId : String , loginType : String, DOB : String, gender : String){
        
        self.loginVM.otpVerificationApi(email: email, phcode: phcode, phone: phone)
        
        self.loginVM.successVerification = {
            self.otpView.initView(view: self.view, pageFrom: "signup", tripRotue: TripStatusModel(), submit: { (otp) in
                print("SDFASD",otp,"ADSFADSF",self.loginVM.otpVerfication?.otp)
                if otp == (self.loginVM.otpVerfication?.otp ?? "1111").description{
                    self.loginVM.signupApi(fname: fname, lname: lname, email: email, phone: phone, cnty: cnty, cntyname: cntyname, lang: lang, cur: cur, phcode: phcode, password: password,countryname: countryname,cityname: cityname, statename: statename,city: self.cityid,state:self.stateId, referal: referal, scId: scId, fcmId: fcmId, loginId : loginId , loginType : loginType, DOB: DOB, gender: gender)
                }else{
                    showToast(msg: "Wrong OTP , Please Enter Corrent One")
                }
            })
        }
        
        self.loginVM.successSignup = {
            
            if let signupResponse = self.loginVM.signupData{
                
                print("signupResponseDriverRes",signupResponse)
                
                UserDefaults.standard.set(signupResponse.token, forKey: UserDefaultsKey.token)
                let jwt = try! decode(jwt: signupResponse.token)
                let data = jwt.body
                
                UserDefaults.standard.set(data["email"] as? String ?? "", forKey: UserDefaultsKey.email)
                UserDefaults.standard.set(data["name"] as? String ?? "", forKey: UserDefaultsKey.name)
                UserDefaults.standard.set(data["id"] as? String ?? "", forKey: UserDefaultsKey.userid)
                UserDefaults.standard.set(signupResponse.token , forKey: UserDefaultsKey.token)
               
                self.updateToken()
                self.FBCONNECT.updateDriverDefaultData()
                
                let userDocvc = ManageDocsVC.initWithStory()
                userDocvc.pageFrom = "signup"
                self.navigationController?.pushViewController(userDocvc, animated: true)
            }
            
            //            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
            //            self.appDelegate.window?.rootViewController = MenuRoot
            
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


//extension SignupVC : FSCalendarDelegate{
//    func calendar(_ calendar: FSCalendar, didSelect date: Date, at monthPosition: FSCalendarMonthPosition) {
//
//        let formatter = DateFormatter()
//        formatter.dateFormat = "MM-dd-yyyy"
//            let formatter1 = DateFormatter()
//            formatter1.dateFormat = "yyyy-MM-dd"
//        DOBTxf.text = formatter.string(from: date)
//        //fromdate = formatter1.string(from: date)
//        print("dates:::\(DOBTxf.text)")
//        //fromdate = formatter1.string(from: date)
//        CalendarView.isHidden = true
//    }
//
//    func calendar(_ calendar: FSCalendar, shouldSelect date: Date, at monthPosition: FSCalendarMonthPosition) -> Bool {
//        let calendar = Calendar.current
//        let year = calendar.component(.year, from: date)
//
//        // Replace 2023 with the desired year you want to select
//        if year == 2023 {
//            return true // Allow selection for the desired year
//        } else {
//            return false // Disallow selection for other years
//        }
//    }
//
//}
