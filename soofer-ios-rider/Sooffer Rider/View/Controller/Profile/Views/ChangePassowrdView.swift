//
//  ChangePassowrdView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//


import Foundation
import SkyFloatingLabelTextField

class ChangePasswordAlert : UIView , UITextFieldDelegate {
    
    //UI Declaraction
    @IBOutlet weak var oldPassword: SkyFloatingLabelTextField!
    
    @IBOutlet weak var newPasswordTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var confirmPassword: SkyFloatingLabelTextField!
    @IBOutlet weak var otpTXF: SkyFloatingLabelTextField!
    
    @IBOutlet weak var btnbottom: UIButton!
    @IBOutlet weak var btnTop: UIButton!
    @IBOutlet weak var btnleft: UIButton!
    @IBOutlet weak var btnRight: UIButton!
    
    @IBOutlet weak var cancelBtn: UIButton!
    @IBOutlet weak var okBtn: UIButton!
    @IBOutlet weak var oldpassView : UIView!
    @IBOutlet weak var otpView : UIView!
    @IBOutlet weak var changePassTitle: UILabel!
    
    @IBOutlet weak var eyeimg0: UIImageView!
    @IBOutlet weak var eyeimg: UIImageView!
    @IBOutlet weak var eyeimg1: UIImageView!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var profilevm = ProfileVM()
    var loginvm = LoginSignupVM()
    var pagefrom : String = ""
    var forgotemail : String = ""
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    
    func initView(view : UIView , pagefrom : String , email :String){
        self.profilevm = ProfileVM(view: self, dataService: ApiRoot())
        self.loginvm = LoginSignupVM(view: self, dataService: ApiRoot())
        self.forgotemail = email
        self.pagefrom = pagefrom
        self.setView(view: view)
        self.setupAction()
        self.setupView()
        self.setupLang()
        self.setupDelegate()
    }
    
    func setupAction(){
        btnTop.addAction(for: .tap) {
            self.deInitView()
        }
        btnbottom.addAction(for: .tap) {
            self.deInitView()
        }
        btnleft.addAction(for: .tap) {
            self.deInitView()
        }
        btnRight.addAction(for: .tap) {
            self.deInitView()
        }
        cancelBtn.addAction(for: .tap) {
            self.deInitView()
        }
        okBtn.addAction(for: .tap) {
            self.validation()
        }
        self.eyeimg0.addTap{
            if self.eyeimg0.image == UIImage(named: "eye-open"){
                self.oldPassword.isSecureTextEntry = true
                
                self.eyeimg0.image = UIImage(named: "eye close")
            }else{
                self.oldPassword.isSecureTextEntry = false
                
                self.eyeimg0.image = UIImage(named: "eye-open")
            }
        }
        self.eyeimg.addTap {
            if self.eyeimg.image == UIImage(named: "eye-open"){
                self.newPasswordTXF.isSecureTextEntry = true
                
                self.eyeimg.image = UIImage(named: "eye close")
            }else{
                self.newPasswordTXF.isSecureTextEntry = false
                
                self.eyeimg.image = UIImage(named: "eye-open")
            }
        }
        self.eyeimg1.addTap {
            if self.eyeimg1.image == UIImage(named: "eye-open"){
                self.confirmPassword.isSecureTextEntry = true
                
                self.eyeimg1.image = UIImage(named: "eye close")
            }else{
                self.confirmPassword.isSecureTextEntry = false
                
                self.eyeimg1.image = UIImage(named: "eye-open")
            }
        }
    }
    
    func setupView(){
        self.cancelBtn.roundeCornorBorder = 20
        self.okBtn.roundeCornorBorder = 20
        self.oldPassword.keyboardType = UIKeyboardType.alphabet
        self.oldPassword.isSecureTextEntry = true
        self.newPasswordTXF.keyboardType = UIKeyboardType.alphabet
        self.newPasswordTXF.isSecureTextEntry = true
        self.confirmPassword.keyboardType = UIKeyboardType.alphabet
        self.confirmPassword.isSecureTextEntry = true
        
        self.cancelBtn.backgroundColor = UIColor.gray
        self.okBtn.backgroundColor = UIColor(named: "AppColor")
        if  self.pagefrom == "forgot"{
            self.oldpassView.isHidden = true
        }else{
            self.otpView.isHidden = true
        }
    }
    
    func setupLang(){
        //UI View Text names
        self.oldPassword.placeholder = Localize.stringForKey(key: "enter_old_pass")
        self.oldPassword.title = Localize.stringForKey(key: "old_pass")
        
        self.newPasswordTXF.placeholder = Localize.stringForKey(key: "enter_new_pass")
        self.newPasswordTXF.title = Localize.stringForKey(key: "new_pass")
        
        self.confirmPassword.placeholder = Localize.stringForKey(key: "enter_con_pass")
        self.confirmPassword.title = Localize.stringForKey(key: "confrm_pass")
        
        
        self.otpTXF.placeholder = Localize.stringForKey(key: "enter_otp")
        self.otpTXF.title = Localize.stringForKey(key: "otp")
        
        self.changePassTitle.text = Localize.stringForKey(key: "change_pass")
        
        self.cancelBtn.setTitle(Localize.stringForKey(key: "cancel"), for: .normal)
        self.okBtn.setTitle(Localize.stringForKey(key: "submit"), for: .normal)
    }
    
    
    //MARK: setView Property
    func setView(view : UIView) {
        self.frame = view.bounds
        
        self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
        
        view.addSubview(self)
        
        view.bringSubviewToFront(self)
        
        self.transform = CGAffineTransform(translationX: 0, y: 0)//.concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
        
        UIView.animate(withDuration: 0.5) {
            self.transform = .identity
        }
    }
    
    func setupDelegate()  {
        self.newPasswordTXF.delegate = self
        self.oldPassword.delegate = self
        self.confirmPassword.delegate = self
    }
    
    
    //validation
    func validation(){
        var oldpass : String = self.oldPassword.text ?? ""
        let newpass : String = self.newPasswordTXF.text ?? ""
        let confrmpass : String = self.confirmPassword.text ?? ""
        var otp : String = self.otpTXF.text ?? ""
        if  self.pagefrom == "forgot"{
            oldpass = "password"
        }else{
            otp = "1111"
        }
        if !oldpass.isEmpty{
            setTextfieldApperance(textfild: self.oldPassword, title: Localize.stringForKey(key: "old_pass"), color: UIColor(named: "AppColor")!, isError: false)
            
            if !newpass.isEmpty{
                setTextfieldApperance(textfild: self.newPasswordTXF, title: Localize.stringForKey(key: "new_pass"), color: UIColor(named: "AppColor")!, isError: false)
                
                if !confrmpass.isEmpty{
                    setTextfieldApperance(textfild: self.confirmPassword, title: Localize.stringForKey(key: "confrm_pass"), color: UIColor(named: "AppColor")!, isError: false)
                    
                    if !otp.isEmpty{
                        setTextfieldApperance(textfild: self.otpTXF, title: Localize.stringForKey(key: "otp"), color: UIColor(named: "AppColor")!, isError: false)
                   
                        if newpass == confrmpass{
                            if  self.pagefrom == "forgot"{
                                self.forgotpasswotdApi(otp: otp, newPass: newpass, confirmPass: confrmpass)
                            }else{
                                self.changepassApi(oldpass: oldpass, newPass: newpass, confirmPass: confrmpass)
                            }
                           
                            
                        }else{
                            showToast(msg: Localize.stringForKey(key: "same_pass"))
                        }
                        
                    }else{
                         setTextfieldApperance(textfild: self.otpTXF, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                    }
                    
                    
                }else{
                    setTextfieldApperance(textfild: self.confirmPassword, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                }
            }else{
                setTextfieldApperance(textfild: self.newPasswordTXF, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
            }
        }else{
            setTextfieldApperance(textfild: self.oldPassword, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
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
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        textField.text = textField.text?.trimmingCharacters(in: .whitespaces)
        if textField.text!.isEmpty {
            setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        
        if textField.text!.isEmpty{
            setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField, title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
            textField.becomeFirstResponder()
        }else{
            if textField == oldPassword{
                setTextfieldApperance(textfild: self.oldPassword, title: Localize.stringForKey(key: "old_pass"), color: UIColor(named: "AppColor")!, isError: false)
                
                newPasswordTXF.becomeFirstResponder()
            }
            else if textField == newPasswordTXF{
                setTextfieldApperance(textfild: self.newPasswordTXF, title: Localize.stringForKey(key: "new_pass"), color: UIColor(named: "AppColor")!, isError: false)
                confirmPassword.becomeFirstResponder()
            } else if textField == confirmPassword{
                setTextfieldApperance(textfild: self.confirmPassword, title: Localize.stringForKey(key: "confrm_pass"), color: UIColor(named: "AppColor")!, isError: false)
                if !otpView.isHidden {
                    otpTXF.becomeFirstResponder()
                }else{
                self.endEditing(true)
                self.validation()
                }
            }else if textField == otpTXF{
                setTextfieldApperance(textfild: self.otpTXF, title: Localize.stringForKey(key: "otp"), color: UIColor(named: "AppColor")!, isError: false)
               
                    self.endEditing(true)
                    self.validation()
               
            }
        }
        
        return true
    }
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
            self.transform = CGAffineTransform(translationX: 0, y: 0)//.concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
        }) { (true) in
            self.removeFromSuperview()
        }
    }
    
    //MARK: Register xib view
    class var getView : ChangePasswordAlert {
        return UINib(nibName: "ChangePassword", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! ChangePasswordAlert
    }
    
}

extension ChangePasswordAlert{
    func changepassApi(oldpass : String , newPass : String , confirmPass : String){
        self.profilevm.changepassword(view: self, oldpass: oldpass, newPass: newPass, confirmPass: confirmPass)
        
        self.profilevm.successChangePAss = {
            showToast(msg:  self.profilevm.changepass?.message ?? "")
            self.deInitView()
        }
        self.profilevm.errorChangePAss = {
            showToast(msg:  self.profilevm.errchangepass?.message ?? "")
        }
    }
    
    func forgotpasswotdApi(otp : String , newPass : String , confirmPass : String){
        self.loginvm.forgotPasseord(view : self ,email : self.forgotemail , password : newPass ,confirmpassword : confirmPass ,   otp : otp)
        
        self.loginvm.successforgot = {
            self.deInitView()
        }
    }
}
