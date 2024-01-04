//
//  DailyAttendanceVC.swift
//  Sooffer Driver
//
//  Created by Abservetech on 04/06/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit

class DailyAttendanceVC: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    @IBOutlet weak var Myview: UIView!
    @IBOutlet weak var OpenCamera: UIButton!
    
    var pickImage : UIImagePickerController? =  UIImagePickerController()
    let Localize : Localizations = Localizations.instance
    var homeVm = HomeVM()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.Myview.layer.cornerRadius = 7
        self.Myview.layer.masksToBounds = false
        self.Myview.layer.shadowColor = UIColor.lightGray.cgColor
        self.Myview.layer.shadowOpacity = 3
        self.Myview.layer.shadowOffset = CGSize.zero
        self.Myview.layer.shadowRadius = 3
        self.Myview.layer.shouldRasterize = true
        pickImage?.delegate = self
        pickImage?.allowsEditing = true
        self.homeVm = HomeVM(view: self.view, dataService: ApiRoot())
        self.SetupAction()
    }
    class func initWithStory()->DailyAttendanceVC{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "DailyAttendanceVC") as! DailyAttendanceVC
        return vc
    }
    
    func SetupAction()  {
        self.openCamera()
        OpenCamera.addTap {
            self.pickProfileImage()
        }
    }
    
    func openCamera(){
        if(UIImagePickerController .isSourceTypeAvailable(.camera)){
            pickImage?.sourceType = .camera
            self.present(pickImage!, animated: true, completion: nil)
        } else {
            let alertController: UIAlertController = {
                let controller = UIAlertController(title: "Warning", message: "You don't have camera", preferredStyle: .alert)
                let action = UIAlertAction(title: "OK", style: .default)
                controller.addAction(action)
                return controller
            }()
            self.present(alertController, animated: true)
        }
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
        imageEdit.addAction(UIAlertAction(title: Localize.stringForKey(key: "cancel"), style: .cancel, handler: { (_ ) in
        }))
        
        if let popview = imageEdit.popoverPresentationController{
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
            print("Upload:::::", imagetoupload!)
//            self.edituserProfileImage.image = imagetoupload
//            imagetopost = imagetoupload!
            uploadFunc(withImg: imagetoupload!)
        }
    }
}

extension DailyAttendanceVC {
    func uploadFunc(withImg: UIImage) {
        print("upload image is:: \(withImg)")
        homeVm.selfieUploadedFunc(view: self.view, image: withImg)
        homeVm.selfieUPloadSuccess = {
            print("Success")
            let code = self.homeVm.selfieUpload?.success ?? Bool()
            if code {
                self.dismiss(animated: true, completion: nil)
            }
        }
        homeVm.selfieUploadErrorrr = {
            print("Errorr")
        }
    }
}
