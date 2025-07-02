//
//  ProfileVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField
import Kingfisher

class ProfileVC: UIViewController , UITextFieldDelegate {

    //UI Declaraction
    @IBOutlet weak var userProfileImage: UIImageView!
    
    @IBOutlet weak var firestBNameTxt: SkyFloatingLabelTextField!
    
    @IBOutlet weak var lastnameTxtF: SkyFloatingLabelTextField!
    
    @IBOutlet weak var emailAddressTxt: SkyFloatingLabelTextField!
   
    @IBOutlet weak var ccTxt: SkyFloatingLabelTextField!
    
    @IBOutlet weak var mobileNumTxtF: SkyFloatingLabelTextField!
    
    //EditView Fields
    @IBOutlet weak var edituserProfileImage: UIImageView!
    
    @IBOutlet weak var editfirestBNameTxt: SkyFloatingLabelTextField!
    
    @IBOutlet weak var editlastnameTxtF: SkyFloatingLabelTextField!
    
    @IBOutlet weak var editemailAddressTxt: SkyFloatingLabelTextField!
    
    @IBOutlet weak var editccTxt: SkyFloatingLabelTextField!
    
    @IBOutlet weak var editmobileNumTxtF: SkyFloatingLabelTextField!
    
    @IBOutlet weak var passwordTxF: SkyFloatingLabelTextField!
    
    @IBOutlet weak var updateBtn: UIButton!
    
    //Ui tabeview for edit and view profile
    @IBOutlet weak var viewTable: UITableView!
    @IBOutlet weak var editTableView: UITableView!
    @IBOutlet weak var DeleteAccountView: UIView!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var profilevm = ProfileVM()
    var pickImage : UIImagePickerController? =  UIImagePickerController()
    var imagetopost = UIImage()
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var userid: String = String()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.profilevm = ProfileVM(view: self.view, dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupData()
        self.setupDelegate()
     self.userid = (UserDefaults.standard.string(forKey: UserDefaultsKey.userid) ?? "")
    }
    
    func setupDelegate(){
        self.editfirestBNameTxt.delegate = self
        self.editlastnameTxtF.delegate = self
        self.editemailAddressTxt.delegate = self
        self.editccTxt.delegate = self
        self.editmobileNumTxtF.delegate = self
        
        
        pickImage?.delegate = self
        pickImage?.allowsEditing = true
    }
    
    func setupView(){
        self.ccTxt.text = Constant.phoneCode
        self.editccTxt.text = Constant.phoneCode
        
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "myprofile"))
        
        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
        self.revealViewController().rearViewRevealWidth = 220
        
        //set const value
         self.ccTxt.text = Constant.phoneCode
         self.editccTxt.text = Constant.phoneCode
        
        //setkey board type
        self.updateBtn.roundeCornorBorder = 20
        
        self.DeleteAccountView.layer.cornerRadius = 5
        
        self.firestBNameTxt.keyboardType = UIKeyboardType.alphabet
        self.lastnameTxtF.keyboardType = UIKeyboardType.alphabet
        self.emailAddressTxt.keyboardType = UIKeyboardType.emailAddress
        self.mobileNumTxtF.keyboardType = UIKeyboardType.numberPad
        self.ccTxt.keyboardType = UIKeyboardType.numberPad
        
        self.editfirestBNameTxt.keyboardType = UIKeyboardType.alphabet
        self.editlastnameTxtF.keyboardType = UIKeyboardType.alphabet
        self.editemailAddressTxt.keyboardType = UIKeyboardType.emailAddress
        self.editmobileNumTxtF.keyboardType = UIKeyboardType.numberPad
        self.editccTxt.keyboardType = UIKeyboardType.numberPad
        
        self.passwordTxF.isSecureTextEntry = true
        
        
        //setup color
        self.updateBtn.backgroundColor = UIColor(named: "AppColor")
        
        self.editImg()
        
        //showhideViews
        self.viewTable.isHidden = false
        self.editTableView.isHidden = true
        
    }
    
    func editImg(){
        
        //EditButton View
        var rightBarButton = UIBarButtonItem()
        
        let rightButton = UIButton(frame: CGRect(x: 0, y: 0, width: 10, height: 10))
        let rightImage = UIImage(named: "nav_edit")
        rightButton.setImage(rightImage, for: .normal)
        rightBarButton = UIBarButtonItem(customView: rightButton)
        rightButton.addTarget(self, action: #selector(self.showEditView), for: .touchUpInside)
        
        self.navigationItem.rightBarButtonItem = rightBarButton
    }
    func setupData(){
        if let profileData : ProfileModel  = Constant.profileData as? ProfileModel{
            self.firestBNameTxt.text = profileData.fname
            self.lastnameTxtF.text = profileData.lname
            self.emailAddressTxt.text = profileData.email
            self.ccTxt.text = Constant.phoneCode
            
            if profileData.phone.count == 11{
                var phone : String = profileData.phone
                phone.remove(at: phone.startIndex)
                self.mobileNumTxtF.text = phone
            }else{
                self.mobileNumTxtF.text = profileData.phone
            }
            var urls : String = ServiceApi.Base_Image_URL + profileData.profile ?? String()
//            let url = URL(string: ServiceApi.Base_Image_URL + profileData.profile)
//            self.userProfileImage.kf.setImage(with: url)
            self.userProfileImage?.pin_setImage(from: URL(string: urls))
            self.userProfileImage.layer.cornerRadius = self.userProfileImage.frame.width / 2
            self.userProfileImage.clipsToBounds = true
        //    self.edituserProfileImage.kf.setImage(with: url)
            self.edituserProfileImage?.pin_setImage(from: URL(string: urls))
            self.edituserProfileImage.layer.cornerRadius = self.edituserProfileImage.frame.width / 2
            self.edituserProfileImage.clipsToBounds = true
       
            self.editfirestBNameTxt.text = profileData.fname
            self.editlastnameTxtF.text = profileData.lname
            self.editemailAddressTxt.text = profileData.email
            self.editccTxt.text = Constant.phoneCode
            if profileData.phone.count == 11{
                var phone : String = profileData.phone
                phone.remove(at: phone.startIndex)
                self.editmobileNumTxtF.text = phone
            }else{
                self.editmobileNumTxtF.text = profileData.phone
            }
//            self.editmobileNumTxtF.text = profileData.phone
            self.passwordTxF.text = "password"
            
            setTextfieldApperance(textfild: self.editfirestBNameTxt, title: Localize.stringForKey(key: "first_name"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.editlastnameTxtF , title: Localize.stringForKey(key: "last_name"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.editemailAddressTxt  , title: Localize.stringForKey(key: "email_address"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.editccTxt  , title: Localize.stringForKey(key: "cc"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.editmobileNumTxtF  , title: Localize.stringForKey(key: "mobile_num"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.passwordTxF  , title: Localize.stringForKey(key: "password"), color: UIColor(named: "AppColor")!, isError: false)
                            
            setTextfieldApperance(textfild: self.firestBNameTxt, title: Localize.stringForKey(key: "first_name"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.lastnameTxtF , title: Localize.stringForKey(key: "last_name"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.emailAddressTxt  , title: Localize.stringForKey(key: "email_address"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.ccTxt  , title: Localize.stringForKey(key: "cc"), color: UIColor(named: "AppColor")!, isError: false)
            setTextfieldApperance(textfild: self.mobileNumTxtF  , title: Localize.stringForKey(key: "mobile_num"), color: UIColor(named: "AppColor")!, isError: false)
           
            
        }else{
            
        }
   }
   
    @objc func showEditView(){
        self.viewTable.isHidden = true
        self.editTableView.isHidden = false
        
        //EditButton View
        var leftbarbtn = UIBarButtonItem()
        
        let leftButton = UIButton(frame: CGRect(x: 0, y: 0, width: 10, height: 10))
        let leftImage = UIImage(named: "left_arrow")
        leftButton.setImage(leftImage, for: .normal)
        leftbarbtn = UIBarButtonItem(customView: leftButton)
        leftButton.addTarget(self, action: #selector(self.hideEditView), for: .touchUpInside)
        
        self.navigationItem.leftBarButtonItem = leftbarbtn
        
        self.navigationItem.rightBarButtonItem = nil
    }
    
    @objc func hideEditView(){
        self.viewTable.isHidden = false
        self.editTableView.isHidden = true
        setupData()
        self.editImg()
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "myprofile"))
    }

    func setupAction(){
        
        self.passwordTxF.addAction(for: .tap) {
            ChangePasswordAlert.getView.initView(view: self.view, pagefrom: "profile", email: "")
        }
        
        self.edituserProfileImage.addAction(for: .tap) {
            self.setupData()
            self.pickProfileImage()
        }
        
        self.updateBtn.addAction(for: .tap) {
            self.validation()
        }
        self.DeleteAccountView.addTap {
            self.deleteMyAccount(Confirm: false, isYes: { yes in
                if yes {
                    self.deleteMyAccount(Confirm: yes, isYes: { delete in
                        if delete {
                            print("asdasd::,\(self.userid)")
                            self.profilevm.AccountDeletion(view: self.view, UserId: self.userid)
                            self.profilevm.AccountDeletion = {
                                let data = self.profilevm.AccountDeletionData
                                if data?.success ?? false {
                                    if #available(iOS 11.0, *) {
                                        let menuRoot = SWRevealViewController(
                                            rearViewController: MenuVC.initWithStory(),
                                            frontViewController: UINavigationController(rootViewController: LauncherVC.initWithStoryBoard())
                                        )
                                        self.appDelegate.window?.rootViewController = menuRoot
                                    } else {
                                        let menuRoot = SWRevealViewController(
                                            rearViewController: MenuVC.initWithStory(),
                                            frontViewController: UINavigationController(rootViewController: LauncherVC.initWithStoryBoard())
                                        )
                                        self.appDelegate.window?.rootViewController = menuRoot
                                    }
                                    print("Data :\(String(describing: data))")
                                    showToast(msg: data?.message ?? "OKAY! YOUR ACCOUNT DELETED WITHIN 1 WEEK")
                                }
                            }
                            self.profilevm.ErrorAccountDeletion = {
                                let errorData = self.profilevm.ErrDeletion
                                print("Error data :\(String(describing: errorData))")
                                showToast(msg: errorData?.message ?? "OKAY! YOUR ACCOUNT DELETED WITHIN 1 WEEK")
                            }
                        } else {
                            // Handle the case when deletion is not confirmed
                        }
                    })
                } else {
                    // Handle the case when confirmation is not provided
                }
            })
        }
    }
    func setupLang(){
        //UI View Text names
        self.firestBNameTxt.placeholder = Localize.stringForKey(key: "first_name")
        self.firestBNameTxt.title = Localize.stringForKey(key: "first_name")
        
        self.lastnameTxtF.placeholder = Localize.stringForKey(key: "last_name")
        self.lastnameTxtF.title = Localize.stringForKey(key: "last_name")
        
        self.emailAddressTxt.placeholder = Localize.stringForKey(key: "email_address")
        self.emailAddressTxt.title = Localize.stringForKey(key: "email_address")
        
        self.ccTxt.placeholder = Localize.stringForKey(key: "cc")
        self.ccTxt.title = Localize.stringForKey(key: "cc")
        
        self.mobileNumTxtF.placeholder = Localize.stringForKey(key: "mobile_num")
        self.mobileNumTxtF.title = Localize.stringForKey(key: "mobile_num")
        
        //Edit UI texts
        self.editfirestBNameTxt.placeholder = Localize.stringForKey(key: "first_name")
        self.editfirestBNameTxt.title = Localize.stringForKey(key: "first_name")
        
        self.editlastnameTxtF.placeholder = Localize.stringForKey(key: "last_name")
        self.editlastnameTxtF.title = Localize.stringForKey(key: "last_name")
        
        self.editemailAddressTxt.placeholder = Localize.stringForKey(key: "email_address")
        self.editemailAddressTxt.title = Localize.stringForKey(key: "email_address")
        
        self.editccTxt.placeholder = Localize.stringForKey(key: "cc")
        self.editccTxt.title = Localize.stringForKey(key: "cc")
        
        self.editmobileNumTxtF.placeholder = Localize.stringForKey(key: "mobile_num")
        self.editmobileNumTxtF.title = Localize.stringForKey(key: "mobile_num")
        
        self.passwordTxF.placeholder = Localize.stringForKey(key: "password")
        self.passwordTxF.title = Localize.stringForKey(key: "password")
        
        self.updateBtn.setTitle(Localize.stringForKey(key: "update"), for: .normal)
        
    }
    
    class func initWithStory()->ProfileVC{
        let vc = UIStoryboard.init(name: "Profile", bundle: Bundle.main).instantiateViewController(withIdentifier: "ProfileVC") as! ProfileVC
        return vc
    }

}

//Image Picker
extension ProfileVC : UIImagePickerControllerDelegate,UINavigationControllerDelegate{
   
    func pickProfileImage(){
        
        let imageEdit = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        imageEdit.modalPresentationStyle = .popover
        imageEdit.addAction(UIAlertAction(title: Localize.stringForKey(key: "take_photo"), style: .default, handler: { (photo) in
            if UIImagePickerController.isSourceTypeAvailable(UIImagePickerController.SourceType.camera){
                DispatchQueue.main.async(execute: {
                    self.pickImage?.sourceType = UIImagePickerController.SourceType.camera
                    self.pickImage?.mediaTypes = ["public.image"]
                    if UIImagePickerController.isCameraDeviceAvailable(.front) {
                        self.pickImage?.cameraDevice = .front
                    }
                    else {
                        self.pickImage?.cameraDevice = .rear
                    }
                    self.present(self.pickImage!, animated: true, completion: nil)
                })
            }
        }))
        imageEdit.addAction(UIAlertAction(title: Localize.stringForKey(key: "choose_gallery"), style: .default, handler: { (photo) in
            self.pickImage?.allowsEditing = true
            self.pickImage?.sourceType = .photoLibrary
            self.present(self.pickImage!, animated: true, completion: nil)
        }))
        imageEdit.addAction(UIAlertAction(title: Localize.stringForKey(key: "cancel"), style: .cancel, handler: { (_ ) in
        }))
        
        if let popview = imageEdit.popoverPresentationController{
            popview.sourceView = self.edituserProfileImage
            popview.sourceRect = self.edituserProfileImage.bounds
        }
        self.present(imageEdit, animated: true, completion: nil)
     }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
        pickImage?.dismiss(animated: true, completion: nil)
        var imagetoupload :UIImage?
        
        if let image = info[.originalImage] as? UIImage {
            imagetoupload = image
        }
       
        if let image = info[.editedImage] as? UIImage {
            imagetoupload = image
        }
        
        if imagetoupload != nil {
            self.edituserProfileImage.image = imagetoupload
            imagetopost = imagetoupload!
        }
    }
}


// TextFiled Function
extension ProfileVC {
    
    //validation
    func validation(){
        let fname : String = self.editfirestBNameTxt.text ?? ""
        let lname : String = self.editlastnameTxtF.text ?? ""
        let email : String = self.editemailAddressTxt.text ?? ""
        let cc : String = self.editccTxt.text ?? ""
        let mobilenum : String = self.editmobileNumTxtF.text ?? ""
        
        if !fname.isEmpty{
            setTextfieldApperance(textfild: self.editfirestBNameTxt, title: Localize.stringForKey(key: "first_name"), color: UIColor(named: "AppColor")!, isError: false)
            
            if !lname.isEmpty{
                setTextfieldApperance(textfild: self.editlastnameTxtF , title: Localize.stringForKey(key: "last_name"), color: UIColor(named: "AppColor")!, isError: false)
                if !email.isEmpty{
                    setTextfieldApperance(textfild: self.editemailAddressTxt  , title: Localize.stringForKey(key: "email_address"), color: UIColor(named: "AppColor")!, isError: false)
                    if !cc.isEmpty{
                        setTextfieldApperance(textfild: self.editccTxt  , title: Localize.stringForKey(key: "cc"), color: UIColor(named: "AppColor")!, isError: false)
                        if !mobilenum.isEmpty{
                            setTextfieldApperance(textfild: self.editmobileNumTxtF  , title: Localize.stringForKey(key: "mobile_num"), color: UIColor(named: "AppColor")!, isError: false)
                            
                            setTextfieldApperance(textfild: self.passwordTxF  , title: Localize.stringForKey(key: "password"), color: UIColor(named: "AppColor")!, isError: false)
                            
                            self.editProfileCall(view: self.view, image: self.imagetopost, fname: fname, lname: lname, email: email, phone: mobilenum, phcode: cc)
                            
                            
                        }else{
                            setTextfieldApperance(textfild: self.editmobileNumTxtF  , title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                        }
                        
                    }else{
                        setTextfieldApperance(textfild: self.editccTxt  , title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                    }
                    
                }else{
                    setTextfieldApperance(textfild: self.editemailAddressTxt  , title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                }
                
            }else{
                setTextfieldApperance(textfild: self.editlastnameTxtF  , title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
            }
        }else{
            setTextfieldApperance(textfild: self.editfirestBNameTxt  , title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
        }
        
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        textField.text = textField.text?.trimmingCharacters(in: .whitespaces)
        if textField.text!.isEmpty {
            setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField  , title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        
        if textField.text!.isEmpty{
            setTextfieldApperance(textfild: textField as! SkyFloatingLabelTextField  , title: Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
            textField.becomeFirstResponder()
        }else{
            if textField == editfirestBNameTxt{
                setTextfieldApperance(textfild: self.editfirestBNameTxt  , title: Localize.stringForKey(key: "first_name"), color: UIColor(named: "AppColor")!, isError: false)
                
                editlastnameTxtF.becomeFirstResponder()
            }
            else if textField == editlastnameTxtF{
                setTextfieldApperance(textfild: self.editlastnameTxtF  , title: Localize.stringForKey(key: "last_name"), color: UIColor(named: "AppColor")!, isError: false)
                editemailAddressTxt.becomeFirstResponder()
           
            } else if textField == editemailAddressTxt{
                setTextfieldApperance(textfild: self.editemailAddressTxt  , title: Localize.stringForKey(key: "email_address"), color: UIColor(named: "AppColor")!, isError: false)
                editccTxt.becomeFirstResponder()
           
            } else if textField == editccTxt{
                setTextfieldApperance(textfild: self.editccTxt  , title: Localize.stringForKey(key: "cc"), color: UIColor(named: "AppColor")!, isError: false)
                mobileNumTxtF.becomeFirstResponder()
            
            }
            else if textField == mobileNumTxtF{
                setTextfieldApperance(textfild: self.mobileNumTxtF  , title: Localize.stringForKey(key: "mobile_num"), color: UIColor(named: "AppColor")!, isError: false)
                
                self.view.endEditing(true)
                self.validation()
            
            }
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
    
}

//Api calls
extension ProfileVC {
    func editProfileCall(view : UIView , image : UIImage ,fname : String , lname : String ,email : String , phone : String , phcode : String){
       
        self.profilevm.editProfile(view: self.view, image: image, fname: fname, lname: lname, email: email, phone: phone, phcode: phcode)
    
        self.profilevm.successprofile = {
            Constant.profileData = self.profilevm.profileData ?? ProfileModel()
            
           // self.editImg()
            self.setupView()
            self.setupData()
            self.editTableView.isHidden = true
            self.viewTable.isHidden = false
        }
    }
    
}
extension UIViewController{
    func deleteMyAccount(Confirm : Bool , isYes : @escaping(Bool) -> ()){
        let title = Confirm ? "Account Deletion".uppercased() : "DELETE ACCOUNT"
        let msg = Confirm ? "If you want to delete your account permanently, you won't be able to retrieve your orders and your personal information and your messages. It's no longer stored in our database" : "Are you Sure you want to Delete this Account ?"
        let noMsg = Confirm ? "DISMISS" : "CANCEL"
        let yesMsg = Confirm ? "CONFIRM" : "DELETE"
        let alertControl = UIAlertController(title: title, message: msg, preferredStyle: .alert)
        let noAction = UIAlertAction(title: noMsg, style: .default, handler: { cancel in
            isYes(false)
        })
        let yesAction = UIAlertAction(title: yesMsg, style: Confirm ? .destructive : .default, handler: { delete in
            isYes(true)
//            let domain = Bundle.main.bundleIdentifier!
//            UserDefaults.standard.removePersistentDomain(forName: domain)
//            UserDefaults.standard.synchronize()
//            GIDSignIn.sharedInstance().signOut()
//            let loginManager = LoginManager()
//            loginManager.logOut()
//
//            let navigation = UINavigationController(rootViewController: LoginVC.initWithStory())
//            self.appDelegate.window?.rootViewController = navigation
        })
        alertControl.addAction(yesAction)
        alertControl.addAction(noAction)
      self.present(alertControl, animated: true, completion: nil)
    }
}
