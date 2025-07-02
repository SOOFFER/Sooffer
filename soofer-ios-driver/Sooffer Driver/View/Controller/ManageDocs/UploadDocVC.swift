//
//  UploadDocVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 06/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField

class UploadDocVC: UIViewController {

    @IBOutlet weak var docImg: UIImageView!
    @IBOutlet weak var datepickerview: UIView!
    @IBOutlet weak var doneBtn: UIBarButtonItem!
    @IBOutlet weak var toolbar: UIToolbar!
    @IBOutlet weak var datepicker: UIDatePicker!
    @IBOutlet weak var selectDocLbl: UILabel!
    @IBOutlet weak var expireDateTXF: SkyFloatingLabelTextFieldWithIcon!
    @IBOutlet weak var submitBtn: UIButton!
    
    @IBOutlet weak var expiryBtn: UIButton!
    
    
    
    @IBOutlet weak var approdocImg: UIImageView!
    @IBOutlet weak var approview: UIView!
   
    
    var isActiveDoc : Bool = false
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var pageFor : String = ""
    var docType : String = ""
    var pageofVehcileOrUser : String = ""
    var vehiclePosition : Int = Int()
    var pickImage : UIImagePickerController? =  UIImagePickerController()
    var imagetopost = UIImage()
    var editImageToUpload = UIImage()
    
    var vehicleVM = ManageVehicleVM()
    var makeid : String = ""
    var profile = ProfileModel()
    var VDocUrl = ""
    var VDate = ""
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.vehicleVM = ManageVehicleVM(dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupData()
        self.setupPickerDelegate()
//    self.zoomImageSetup()
    }
    
    func setupView(){
        
        if isActiveDoc{
            self.approdocImg.isHidden = false
        }else{
            self.approdocImg.isHidden = true
        }
        
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "upload_docs"))
        self.navigationItem.leftBarButtonItem = nil
        self.expireDateTXF.withImage(direction: .Right, image: UIImage(named: "down-arrow") ?? UIImage(), colorSeparator: UIColor.clear, colorBorder: UIColor.clear)
        
        if self.docType == "registration" {
            self.expiryBtn.isHidden = true
            self.expireDateTXF.isHidden = true
           self.selectDocLbl.isHidden = true
            
            
           
        }else{
            self.expiryBtn.isHidden = false
            self.expireDateTXF.isHidden = false
            self.selectDocLbl.isHidden = false
        }
    }
    
    @IBAction func datePickerDoneBtn(_ sender: Any) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        datepicker.minimumDate = Date()
        expireDateTXF.text = dateFormatter.string(from: datepicker.date)
        self.datepickerview.isHidden = true
        
    }
    
    func setupAction(){
        self.expiryBtn.addAction(for: .tap) {
            self.datepickerview.isHidden = false
        }
        
        self.docImg.addAction(for: .tap) {
            self.pickProfileImage()
        }
        
        self.submitBtn.addAction(for: .tap) {
            if self.docType == "registration" {
                self.expireDateTXF.text = "0"
            }
            if !Constant.filefor.isEmpty{
                if self.docImg.image != UIImage(named: "document_upload"){
                    if !(self.expireDateTXF.text?.isEmpty ?? false){
                    let driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
                    if self.pageofVehcileOrUser == "user"{
                        self.uploadDocs(image: self.imagetopost, filefor: Constant.filefor, driverid: driverid, licenceexp: self.expireDateTXF.text ?? "", insuranceexp: self.expireDateTXF.text ?? "")
                    }else{
                        self.imagetopost = self.docImg.image ?? UIImage()
                        
                        self.uploadvehicleDocs(image: self.imagetopost, filefor: Constant.filefor, driverid: driverid, licenceexp: self.expireDateTXF.text ?? "", insuranceexp: self.expireDateTXF.text ?? "", makeid: Constant.profileData.taxis[self.vehiclePosition]._id ?? "", type: "")
                    }
                }else{
                    showToast(msg: "Expire date must not be Empty")
                }
                }else{
                    showToast(msg: "Please Upload Document")
                }
            }else{
                showToast(msg: "Choose File type for upload document")
            }
        }
    }
    func setupLang(){
        self.selectDocLbl.text = Localize.stringForKey(key: "select_doc")
        self.submitBtn.setTitle(Localize.stringForKey(key: "submit"), for: .normal)
    }
    
    func setupData(){
        if pageFor == "manage"{
            if pageofVehcileOrUser == "user"{
               
                    if docType == "licence" {
                        if !profile.document.isEmpty{
                            self.docImg.image = UIImage(named: "document_uploaded")
                            var date = profile.document[0].docExp
                            print("datess::\(String(date.prefix(10)))")
                            self.expireDateTXF.text = String(date.prefix(10))
                            var urls : String = ServiceApi.Base_Image_URL+profile.document[0].docFrontImg ?? String()
                          //  docImg.pin_setImage(from: URL(string: urls))
                            let urlkf = URL(string: urls)
                            docImg.kf.setImage(with: urlkf)
                        }
                    }else if docType == "licenceBackImg" {
                        if !profile.licenceBackImg.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
                            self.expireDateTXF.text = profile.licenceexp
                            print("profile.licenceexp",profile.licenceexp)
                            var urls : String = ServiceApi.Base_Image_URL+profile.licenceBackImg ?? String()
                            //docImg.pin_setImage(from: URL(string: urls))
                            let urlkf = URL(string: urls)
                            docImg.kf.setImage(with: urlkf)
                        }
                    }else if docType == "insurance" {
                        if !profile.insurance.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
                            self.expireDateTXF.text = profile.insuranceexp
                            var urls : String = ServiceApi.Base_Image_URL+profile.insurance ?? String()
                            //docImg.pin_setImage(from: URL(string: urls))
                            let urlkf = URL(string: urls)
                            docImg.kf.setImage(with: urlkf)
                        }
                    }else if docType == "insuranceBackImg" {
                        if !profile.insuranceBackImg.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
                            self.expireDateTXF.text = profile.insuranceexp
                            print("profile.insuranceexp",profile.insuranceexp)
                            var urls : String = ServiceApi.Base_Image_URL+profile.insuranceBackImg ?? String()
                            //docImg.pin_setImage(from: URL(string: urls))
                            let urlkf = URL(string: urls)
                            docImg.kf.setImage(with: urlkf)
                        }
                    }else if docType == "passing" {
                        if !profile.passing.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
                            self.expireDateTXF.text = profile.insuranceexp
                            var urls : String = ServiceApi.Base_Image_URL+profile.passing ?? String()
                          //  docImg.pin_setImage(from: URL(string: urls))
                            let urlkf = URL(string: urls)
                            docImg.kf.setImage(with: urlkf)
                        }
                    }else if docType == "passingBackImg" {
                        if !profile.passingBackImg.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
                            self.expireDateTXF.text = profile.insuranceexp
                var urls : String = ServiceApi.Base_Image_URL+profile.passingBackImg ?? String()
                           // docImg.pin_setImage(from: URL(string: urls))
                            let urlkf = URL(string: urls)
                            docImg.kf.setImage(with: urlkf)
                        }
                    }
                
            }else{
                if let profile : Taxis = Constant.profileData.taxis[vehiclePosition] as? Taxis{
                    self.makeid = profile._id
                   // docImg.pin_setImage(from: URL(string: VDocUrl))
                    let urlkf = URL(string: VDocUrl)
                    docImg.kf.setImage(with: urlkf)
                    self.expireDateTXF.text = String(VDate.prefix(10))
//                    if docType == "insurance" {
//                        if !profile.insurance.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
//                            self.expireDateTXF.text = profile.insuranceexpdate
//                            var urls : String = ServiceApi.Base_Image_URL+profile.insurance ?? String()
//
//                            approdocImg.pin_setImage(from: URL(string: urls))
//                        }
//                    }else if docType == "permit" {
//                        if !profile.permit.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
//                            self.expireDateTXF.text = profile.permitexpdate
//                            var urls : String = ServiceApi.Base_Image_URL+profile.permit ?? String()
//
//                            approdocImg.pin_setImage(from: URL(string: urls))
//                        }
//                    }else if docType == "registration" {
//                        if !profile.registration.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
//                            self.expireDateTXF.text = ""
//                            var urls : String = ServiceApi.Base_Image_URL+profile.registration ?? String()
//
//                            approdocImg.pin_setImage(from: URL(string: urls))
//                        }
//                    }else if docType == "registrationBack" {
//                        if !profile.registrationBack.isEmpty{
//                            self.docImg.image = UIImage(named: "document_uploaded")
//                            self.expireDateTXF.text = profile.registrationexpdate
//                            var urls : String = ServiceApi.Base_Image_URL+profile.registrationBack ?? String()
//
//                            approdocImg.pin_setImage(from: URL(string: urls))
//                        }
//                    }
                }
            }
        }else if pageFor == "upload"{
            self.docImg.image = UIImage(named: "document_upload")
            self.expireDateTXF.text = ""
        }
    }
    
    class func initWithStory()->UploadDocVC{
        let vc = UIStoryboard.init(name: "ManageDocs", bundle: Bundle.main).instantiateViewController(withIdentifier: "UploadDocVC") as! UploadDocVC
        return vc
    }

}

//Image Picker
extension UploadDocVC : UIImagePickerControllerDelegate,UINavigationControllerDelegate{
    
    func setupPickerDelegate(){
        pickImage?.delegate = self
        pickImage?.allowsEditing = true
    }
    
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
            popview.sourceView = self.docImg
            popview.sourceRect = self.docImg.bounds
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
            self.docImg.image = imagetoupload
            imagetopost = imagetoupload!
        }
    }
}

extension UploadDocVC{
    func uploadDocs(image : UIImage , filefor : String , driverid : String , licenceexp : String, insuranceexp: String){
        self.vehicleVM.editDoucs(view: self.view, image: image, filefor: filefor, driverid: driverid, licenceexp: licenceexp, insuranceexp: insuranceexp, dataSuccess: {(success) in
            self.navigationController?.popViewController(animated: true)
        
        })
        self.vehicleVM.setuploadedClosure? = {
            self.navigationController?.popViewController(animated: true)
        }
    }
    
    func uploadvehicleDocs(image : UIImage , filefor : String , driverid : String , licenceexp : String ,insuranceexp : String, makeid : String , type : String){
        self.vehicleVM.drivertaxiDoc(view: self.view, image: image, filefor: filefor, driverid: driverid, licenceexp: licenceexp, insuranceexp: insuranceexp, makeid : makeid, type: type, dataSuccess: {(success) in
            self.navigationController?.popViewController(animated: true)
            
        })
        self.vehicleVM.setuploadedClosure? = {
            self.navigationController?.popViewController(animated: true)
        }
    }
}

//extension UploadDocVC : UIScrollViewDelegate{
//
//    func zoomImageSetup(){
//        var vWidth = self.approview.frame.width
//           var vHeight = self.approview.frame.height
//
//           var scrollImg: UIScrollView = UIScrollView()
//           scrollImg.delegate = self
//        scrollImg.frame = CGRect(x: 0, y: 0, width: vWidth-20, height: vHeight-20)
//        scrollImg.translatesAutoresizingMaskIntoConstraints = false
//
//
////        scrollImg.backgroundColor = UIColor.red
//           scrollImg.alwaysBounceVertical = false
//           scrollImg.alwaysBounceHorizontal = false
//           scrollImg.showsVerticalScrollIndicator = true
//           scrollImg.flashScrollIndicators()
//
//           scrollImg.minimumZoomScale = 1.0
//           scrollImg.maximumZoomScale = 5.0
//
//           approview!.addSubview(scrollImg)
//
//        let scrollConstrain = [
//            scrollImg.leadingAnchor.constraint(equalTo: self.approview.leadingAnchor, constant: 10),
//            scrollImg.trailingAnchor.constraint(equalTo: self.approview.trailingAnchor, constant: -10),
//            scrollImg.topAnchor.constraint(equalTo: self.approview.topAnchor, constant: 10),
//            scrollImg.bottomAnchor.constraint(equalTo: self.approview.bottomAnchor, constant: -10)
//        ]
//
//        NSLayoutConstraint.activate(scrollConstrain)
//
//
//           approdocImg!.layer.cornerRadius = 8.0
//           approdocImg!.clipsToBounds = false
//           scrollImg.addSubview(approdocImg!)
//
//        let approdocImgConstrain = [
//            approdocImg.leadingAnchor.constraint(equalTo: scrollImg.leadingAnchor, constant: 10),
//            approdocImg.trailingAnchor.constraint(equalTo: scrollImg.trailingAnchor, constant: -10),
//            approdocImg.topAnchor.constraint(equalTo: scrollImg.topAnchor, constant: 10),
//            approdocImg.bottomAnchor.constraint(equalTo: scrollImg.bottomAnchor, constant: -10)
//        ]
//
//        NSLayoutConstraint.activate(approdocImgConstrain)
//    }
//
//    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
//        return self.approdocImg
//    }
//}
