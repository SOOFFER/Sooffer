//
//  ChoosepotosVc.swift
//  Sooffer Driver
//
//  Created by Abservetech on 14/07/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit

enum Imagetype {
    case one
    case two
    case three
    case four
}

enum ImgUpload {
    case start
    case end
}

protocol Delegate {
    func delegate(withTrips: FBTripDataModel, type: ImgUpload)
}

class ChoosepotosVc: UIViewController {
    
    @IBOutlet weak var firstVw: UIView!
    @IBOutlet weak var firstImg: UIImageView!
    @IBOutlet weak var secondView: UIView!
    @IBOutlet weak var secondImg: UIImageView!
    @IBOutlet weak var thirdView: UIView!
    @IBOutlet weak var thirdImg: UIImageView!
    @IBOutlet weak var fourthView: UIView!
    @IBOutlet weak var fourthImg: UIImageView!
    @IBOutlet weak var saveBtn: UIButton!
    
    let Localize : Localizations = Localizations.instance
    var pickImage : UIImagePickerController? =  UIImagePickerController()
    var imagetopost = UIImage()
    var homeVm = HomeVM()
    var imagetype : Imagetype = .one
    var imgstatus : ImgUpload = .start
    var status = String()
    var tripid = String()
    var imagePicker: ImagePicker!
    var tripModel = FBTripDataModel()
    var delegate: Delegate!
    
    class func initWithStory()->ChoosepotosVc{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "ChoosepotosVc") as! ChoosepotosVc
        return vc
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        homeVm = HomeVM(view: self.view, dataService: ApiRoot())
        self.imagePicker = ImagePicker(presentationController: self, delegate: self)
        view.backgroundColor = UIColor.black.withAlphaComponent(0.7)
        if imgstatus == .start {
            status = "Start"
        } else {
            status = "End"
        }
        print("status :: \(status)")
        firstVw.addTap { [self] in
            imagetype = .one
            imagePicker.present(from: self.firstVw)
        }
        
        secondView.addTap { [self] in
            imagetype = .two
            imagePicker.present(from: self.secondView)
        }
        
        thirdView.addTap { [self] in
            imagetype = .three
            imagePicker.present(from: self.thirdView)
        }
        
        fourthView.addTap { [self] in
            imagetype = .four
            imagePicker.present(from: self.fourthView)
        }
        
        let tripsId = UserDefaults.standard.string(forKey: UserDefaultsKey.tripId) ?? ""
        
        saveBtn.addTap { [unowned self] in
            var params = [[String: Any]]()
            print("trip id:: \(tripsId), and status::: \(status)")
            params.append(["image": firstImg.image!])
            params.append(["image": secondImg.image!])
            params.append(["image": thirdImg.image!])
            params.append(["image": fourthImg.image!])
            params.append(["tripId": tripsId.data(using: .utf8)!])
            params.append(["status": status.data(using: .utf8)!])
            chooseFunc(withparams: params)
        }
    }
}

extension ChoosepotosVc: ImagePickerDelegate {
    func didSelect(image: UIImage?) {
        if imagetype == .one {
            firstImg.image = image
        } else if imagetype == .two {
            secondImg.image = image
        } else if imagetype == .three {
            thirdImg.image = image
        } else if imagetype == .four {
            fourthImg.image = image
        }
    }
}

extension ChoosepotosVc {
    func chooseFunc(withparams: [[String: Any]]) {
        homeVm.safeImgFunc(view: self.view, withParams: withparams)
        homeVm.imageUploadClosure = { [unowned self] in
            print("succeed")
            delegate.delegate(withTrips: tripModel, type: imgstatus)
            self.dismiss(animated: true, completion: nil)
        }
        homeVm.imageUploadError = {
            print("Error")
        }
    }
}

//extension ChoosepotosVc : UIImagePickerControllerDelegate,UINavigationControllerDelegate{
//   
//    func pickProfileImage(){
//        
//        let imageEdit = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
//        imageEdit.modalPresentationStyle = .popover
//        imageEdit.addAction(UIAlertAction(title: Localize.stringForKey(key: "take_photo"), style: .default, handler: { (photo) in
//            if UIImagePickerController.isSourceTypeAvailable(UIImagePickerController.SourceType.camera){
//                DispatchQueue.main.async(execute: {
//                    self.pickImage?.sourceType = UIImagePickerController.SourceType.camera
//                    self.pickImage?.mediaTypes = ["public.image"]
//                    if UIImagePickerController.isCameraDeviceAvailable(.front) {
//                        self.pickImage?.cameraDevice = .front
//                    }
//                    else {
//                        self.pickImage?.cameraDevice = .rear
//                    }
//                    self.present(self.pickImage!, animated: true, completion: nil)
//                })
//            }
//        }))
//        imageEdit.addAction(UIAlertAction(title: Localize.stringForKey(key: "choose_gallery"), style: .default, handler: { (photo) in
//            self.pickImage?.allowsEditing = true
//            self.pickImage?.sourceType = .photoLibrary
//            self.present(self.pickImage!, animated: true, completion: nil)
//        }))
//        imageEdit.addAction(UIAlertAction(title: Localize.stringForKey(key: "cancel"), style: .cancel, handler: { (_ ) in
//        }))
//        
//        if let popview = imageEdit.popoverPresentationController{
//            popview.sourceView = self.firstImg
//            popview.sourceRect = self.firstImg.bounds
//        }
//        self.present(imageEdit, animated: true, completion: nil)
//     }
//    
//    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
//        pickImage?.dismiss(animated: true, completion: nil)
//        var imagetoupload :UIImage?
//        
//        if let image = info[.originalImage] as? UIImage {
//            imagetoupload = image
//        }
//       
//        if let image = info[.editedImage] as? UIImage {
//            imagetoupload = image
//        }
//        
//        if imagetoupload != nil {
//            if imagetype == .one {
//                imagetopost = imagetoupload!
//                firstImg.image = imagetoupload!
//            } else if imagetype == .two {
//                imagetopost = imagetoupload!
//                secondImg.image = imagetoupload!
//            } else if imagetype == .three {
//                imagetopost = imagetoupload!
//                thirdImg.image = imagetoupload!
//            } else if imagetype == .four {
//                imagetopost = imagetoupload!
//                fourthImg.image = imagetoupload!
//            }
//        }
//    }
//}
