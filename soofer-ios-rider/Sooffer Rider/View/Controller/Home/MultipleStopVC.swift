//
//  MultipleStopVC.swift
//  Huber Rider
//
//  Created by Abservetech on 04/11/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import GoogleMaps

protocol MultpleLocation {
    func getAddress(name : String , address : String , loaction : CLLocation)
}

class MultipleStopVC: UIViewController , MultpleLocation {
    func getAddress(name: String, address: String, loaction: CLLocation) {
        if name == "source"{
            if self.addressArray.count > 0{
                self.addressArray.insert(address, at: 0)
                self.loactionArray.insert(loaction, at: 0)
            }else{
                self.addressArray.append(address)
                self.loactionArray.append(loaction)
            }
        }else if name == "stop1"{
            //close
            self.cancelimg.image = UIImage(named: "close")

            if self.addressArray.count > 1{
                self.addressArray.insert(address, at: 1)
                self.loactionArray.insert(loaction, at: 1)
            }else{
                self.addressArray.append(address)
                self.loactionArray.append(loaction)
            }
        }else if name == "stop2"{
            self.cancel1img.image = UIImage(named: "close")

            if self.addressArray.count > 2{
                self.addressArray.insert(address, at: 2)
                self.loactionArray.insert(loaction, at: 2)
            }else{
                self.addressArray.append(address)
                self.loactionArray.append(loaction)
            }
        }else if name == "stop3"{
            self.cancel2img.image = UIImage(named: "close")

            if self.addressArray.count > 3{
                    self.addressArray.insert(address, at: 3)
                    self.loactionArray.insert(loaction, at: 3)
            }else{
                self.addressArray.append(address)
                self.loactionArray.append(loaction)
            }
        }
        self.setupData()
    }
    

    @IBOutlet weak var sourceView : UIView!
    @IBOutlet weak var sorceTxt : UITextField!
    @IBOutlet weak var sourceBtn : UIButton!
    @IBOutlet weak var sourceCloseBtn : UIButton!
    @IBOutlet weak var sourceHeight: NSLayoutConstraint!
    
    @IBOutlet weak var stop1View : UIView!
    @IBOutlet weak var stop1Txt : UITextField!
    @IBOutlet weak var stop1Btn : UIButton!
    @IBOutlet weak var stop1CloseBtn : UIButton!
    @IBOutlet weak var stop1Height: NSLayoutConstraint!
    
    @IBOutlet weak var stop2View : UIView!
    @IBOutlet weak var stop2Txt : UITextField!
    @IBOutlet weak var stop2Btn : UIButton!
    @IBOutlet weak var stop2CloseBtn : UIButton!
    @IBOutlet weak var stop2Height: NSLayoutConstraint!
    
    @IBOutlet weak var stop3View : UIView!
    @IBOutlet weak var stop3Txt : UITextField!
    @IBOutlet weak var stop3Btn : UIButton!
    @IBOutlet weak var stop3CloseBtn : UIButton!
    @IBOutlet weak var stop3Height: NSLayoutConstraint!
    @IBOutlet weak var backImage : UIImageView!
    
    @IBOutlet weak var doneBtn : UIButton!
    @IBOutlet weak var fullViewheight: NSLayoutConstraint!
    
    
    @IBOutlet weak var cancelimg: ImageLoader!
    
    
    @IBOutlet weak var cancel1img: ImageLoader!
    @IBOutlet weak var cancel2img: ImageLoader!
    
    
    var soureceAddress : String?
    var sourceLocation : CLLocation?
    var muldelegate : searchMultipleStop?
    var pageFrom : String?
    var triproutedelegate : TripRoutes?
    var serviceDetail: VechileListData?
    
    var addressArray : [String] = []
    var loactionArray : [CLLocation] = []
    
    override func viewWillAppear(_ animated: Bool) {
         super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
    }
    override func viewWillDisappear(_ animated: Bool) {
           super.viewWillDisappear(true)
           self.navigationController?.isNavigationBarHidden = false
    }
    
   override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
    self.cancelimg.image = UIImage(named: "")
    self.cancel1img.image = UIImage(named: "")
    self.cancel2img.image = UIImage(named: "")
        self.setupAcction()
        if pageFrom != "home"{
            self.addressArray.append(soureceAddress ?? "")
                  self.loactionArray.append(sourceLocation ?? CLLocation())
        }
      
        self.setupData()
       self.hideKeyboardWhenTappedAround()
    }
    
    func setupAcction(){
        self.sourceBtn.addAction(for: .tap) {
            let vc = AutoCompleteVC.initWithStory()
           vc.fromPage = "muliplestop"
           vc.tag = "source"
           vc.MultpleLocationdelegate = self
           self.navigationController?.present(vc, animated: true, completion: nil)
        }
        self.stop1Btn.addAction(for: .tap) {
                            let vc = AutoCompleteVC.initWithStory()
                             vc.fromPage = "muliplestop"
                             vc.tag = "stop1"
                             vc.MultpleLocationdelegate = self
                             self.navigationController?.present(vc, animated: true, completion: nil)
               }
        self.stop2Btn.addAction(for: .tap) {
                   
                             let vc = AutoCompleteVC.initWithStory()
                             vc.fromPage = "muliplestop"
                             vc.tag = "stop2"
                             vc.MultpleLocationdelegate = self
                             self.navigationController?.present(vc, animated: true, completion: nil)
               }
        self.stop3Btn.addAction(for: .tap) {
                   
                             let vc = AutoCompleteVC.initWithStory()
                             vc.fromPage = "muliplestop"
                             vc.tag = "stop3"
                             vc.MultpleLocationdelegate = self
                             self.navigationController?.present(vc, animated: true, completion: nil)
               }
        self.sourceCloseBtn.addAction(for: .tap) {
            if self.addressArray.count > 0{
                self.addressArray.remove(at: 0)
                self.loactionArray.remove(at: 0)
            }
            self.setupData()
        }
        self.stop1CloseBtn.addAction(for: .tap) {
          if self.addressArray.count > 1{
              self.addressArray.remove(at: 1)
              self.loactionArray.remove(at: 1)
          }
          self.setupData()
        }
        self.stop2CloseBtn.addAction(for: .tap) {
          if self.addressArray.count > 2{
              self.addressArray.remove(at: 2)
              self.loactionArray.remove(at: 2)
          }
          self.setupData()
        }
        self.stop3CloseBtn.addAction(for: .tap) {
          if self.addressArray.count > 3{
              self.addressArray.remove(at: 3)
              self.loactionArray.remove(at: 3)
          }
          self.setupData()
        }
        print("self.pagefrom: \(self.pageFrom)")
        self.doneBtn.addAction(for: .tap) {
            if self.pageFrom == "home"{
                self.triproutedelegate?.getArrayAddress(address: self.addressArray, location: self.loactionArray,serviceDetail: self.serviceDetail ?? VechileListData())
                self.navigationController?.popViewController(animated: true)
            }else{
                if self.addressArray.count > 1{
                    self.muldelegate?.getArrayAddress(address: self.addressArray, location: self.loactionArray, ismulti : "true")
                self.navigationController?.popViewController(animated: true)
                }
//                self.muldelegate?.getArrayAddress(address: self.addressArray, location: self.loactionArray)
//                self.navigationController?.popViewController(animated: true)
                
            }
                   
        }
        
        self.backImage.addAction(for: .tap) {
            self.navigationController?.popViewController(animated: true)
        }
    }
    
    func setupData(){
        switch addressArray.count {
        case 0:
            self.sorceTxt.text = ""
           self.sourceView.isHidden = false
           self.stop1View.isHidden = false
           self.sourceHeight.constant = 50
           self.stop1Height.constant = 50
           self.stop2View.isHidden = true
           self.stop3View.isHidden = true
           self.stop2Height.constant = 0
           self.stop3Height.constant = 0
            self.fullViewheight.constant = 180
            self.doneBtn.backgroundColor = UIColor.darkGray
            self.doneBtn.isUserInteractionEnabled = false
            break
        case 1:
            self.sorceTxt.text = self.addressArray[0]
//            self.doneBtn.alpha = 0.8
//            self.doneBtn.isEnabled = false
            self.doneBtn.backgroundColor = UIColor.darkGray
            self.doneBtn.isUserInteractionEnabled = false
             self.stop1Txt.text = ""
            self.stop2Txt.text = ""
            self.stop3Txt.text = ""
            self.sourceView.isHidden = false
            self.stop1View.isHidden = false
            self.sourceHeight.constant = 50
            self.stop1Height.constant = 50
            self.stop2View.isHidden = true
            self.stop3View.isHidden = true
            self.stop2Height.constant = 0
            self.stop3Height.constant = 0
            self.fullViewheight.constant = 180
            break
        case 2:
            self.sorceTxt.text = self.addressArray[0]
            self.stop1Txt.text = self.addressArray[1]
//            self.doneBtn.alpha = 1
//            self.doneBtn.isEnabled = true
            self.doneBtn.isUserInteractionEnabled = true
            self.doneBtn.backgroundColor = UIColor(named: "AppColor")
            self.stop2Txt.text = ""
            self.stop3Txt.text = ""
            self.sourceView.isHidden = false
            self.stop1View.isHidden = false
            self.sourceHeight.constant = 50
            self.stop1Height.constant = 50
            self.stop2View.isHidden = false
            self.stop3View.isHidden = true
            self.stop2Height.constant = 50
            self.stop3Height.constant = 0
            self.fullViewheight.constant = 230
            break
        case 3:
        self.sorceTxt.text = self.addressArray[0]
        self.stop1Txt.text = self.addressArray[1]
        self.stop2Txt.text = self.addressArray[2]
//        self.doneBtn.alpha = 1
//                         self.doneBtn.isEnabled = true
            self.doneBtn.isUserInteractionEnabled = true
            self.doneBtn.backgroundColor = UIColor(named: "AppColor")
                   self.stop3Txt.text = ""
                   self.sourceView.isHidden = false
                   self.stop1View.isHidden = false
                   self.sourceHeight.constant = 50
                   self.stop1Height.constant = 50
                   self.stop2View.isHidden = false
                   self.stop3View.isHidden = false
                   self.stop2Height.constant = 50
                   self.stop3Height.constant = 50
                   self.fullViewheight.constant = 280
            break
        case 4:
            self.sorceTxt.text = self.addressArray[0]
            self.stop1Txt.text = self.addressArray[1]
            self.stop2Txt.text = self.addressArray[2]
            self.stop3Txt.text = self.addressArray[3]
//            self.doneBtn.alpha = 1
//            self.doneBtn.isEnabled = true
            self.doneBtn.isUserInteractionEnabled = true
            self.doneBtn.backgroundColor = UIColor(named: "AppColor")
               
        self.sourceView.isHidden = false
            self.stop1View.isHidden = false
            self.sourceHeight.constant = 50
            self.stop1Height.constant = 50
            self.stop2View.isHidden = false
            self.stop3View.isHidden = false
            self.stop2Height.constant = 50
            self.stop3Height.constant = 50
            self.fullViewheight.constant = 280
            break
        default:
            break
        }
    }
    
    class func initWithStory()->MultipleStopVC{
           let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "MultipleStopVC") as! MultipleStopVC
           return vc
    }
}
extension UIViewController{
    func hideKeyboardWhenTappedAround() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
}
