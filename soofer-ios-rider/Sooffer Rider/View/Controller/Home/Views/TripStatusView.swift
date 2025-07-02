//
//  TripStatusView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 01/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import Cosmos
import PINRemoteImage

class TripStatusView : UIView{
    
    @IBOutlet weak var tripStatusView: UIView!
    @IBOutlet weak var shareView: UIView!
    @IBOutlet weak var cancelView: UIView!
    @IBOutlet weak var messageView: UIView!
    @IBOutlet weak var callView: UIView!
    
    @IBOutlet weak var ratingview: CosmosView!
    @IBOutlet weak var userImage: UIImageView!
    @IBOutlet weak var vechileImage: UIImageView!
    
    @IBOutlet weak var otpLbl: UILabel!
    
    @IBOutlet weak var callLbl: UILabel!
    @IBOutlet weak var messageLbl: UILabel!
    
    @IBOutlet weak var shareLbl: UILabel!
    @IBOutlet weak var cancelLbl: UILabel!
    
    @IBOutlet weak var usernameLbl: UILabel!
    @IBOutlet weak var vechileNameLbl: UILabel!
    
    @IBOutlet weak var VechileNumber: UILabel!
    
    //variable declraction
    let Localize : Localizations = Localizations.instance
    
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    func initView(view : UIView ,driverDetail : RideDetailModel,rideStatus : OnGoingTrip,  call : @escaping(String) -> () , message : @escaping(String) -> (),cancel : @escaping(String) -> (),share : @escaping(String) -> ()){
        self.setView(view: view)
        self.setupLang()
        self.setupAction()
        self.setupData(driverDetail: driverDetail)
        print("New...::,\(rideStatus)")
        if rideStatus == .started{//"started"{
            self.cancelView.isHidden = true
            self.otpLbl.isHidden = true
        }else{
            self.cancelView.isHidden = false
        }
        
        if let driver : RideDetailModel = driverDetail as? RideDetailModel{
            
            self.callView.addAction(for: .tap) {
//                let mobileNum : String = driver.DriverProfile.phone
//                if !mobileNum.isEmpty{
//                    call(mobileNum)
//                }else{
//                    showToast(msg: "Cont call to you Driver, There is Driver number not available")
//                }
//                let vc = VideoCallVC.initWithStory()
//                print("driverfcmhomepage::\(self.FBtripstatus?.rider_token)")
//                vc.riderfcm = self.FBtripstatus?.driver_token ?? ""
//                vc.firebaseNotiifcation(message: "Your Driver inviting you to join video call", fcm: self.FBtripstatus?.driver_token ?? "")
//                DispatchQueue.main.async {
//                    self.present(vc, animated: true, completion: nil);
//                }
                call("")
            }
            
             self.messageView.addAction(for: .tap) {
                let mobileNum : String = driver.DriverProfile.phone
                if !mobileNum.isEmpty{
                     message(mobileNum)
                }else{
                    showToast(msg: "Cont send message to you Driver, There is Driver number not available")
                }
            }
            
            
            self.cancelView.addAction(for: .tap) {
                cancel("cancel")
            }
            
            self.shareView.addAction(for: .tap) {
                share("share")
            }
        }
    }
    
    func setupData(driverDetail : RideDetailModel){
        if let driver : RideDetailModel = driverDetail as? RideDetailModel{
            self.vechileNameLbl.text = (driverDetail.serviceType ?? "") + " ( \(driverDetail.currentTaxi.makename ?? "") )"
            self.usernameLbl.text = driverDetail.DriverProfile.fname
            self.VechileNumber.text = driverDetail.currentTaxi.licence
//            driverDetail.DriverProfile.lname
            self.ratingview.rating = Double(driverDetail.DriverProfile.driverratinge ?? "0.0") ?? 0.0
            self.otpLbl.text = "OTP : "+driverDetail.startOTP
            
            var taxiurls : String = ServiceApi.Base_Image_URL+driver.currentTaxi.image ?? String()
           // self.vechileImage?.pin_setImage(from: URL(string: taxiurls))
            let urlkf = URL(string: taxiurls)
            self.vechileImage.kf.setImage(with: urlkf)
            
            var urls : String = driver.DriverProfile.profileurl ?? String()
            //self.userImage?.pin_setImage(from: URL(string: urls))
            let urlimg = URL(string: urls)
            self.userImage.kf.setImage(with: urlimg)
            self.userImage.isRoundedView = true
        }
    }
    
    //MARK: setView Property
    func setView(view : UIView) {
        //View Animation
        DispatchQueue.main.asyncAfter(deadline: .now()+0.2) {
            
            self.frame = CGRect(x: 0,
                                y: view.frame.height * 0.70 ,
                                width: view.frame.width,
                                height: view.frame.height * 30)
            
            self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
            
            view.addSubview(self)
            
            view.bringSubviewToFront(self)
            
        }
        
        self.transform = CGAffineTransform(translationX: 0, y: view.frame.height).concatenating(CGAffineTransform(scaleX: 0.8, y: 0.8))

        UIView.animate(withDuration: 0.5) {
            self.transform = .identity
        }
        self.leftRightRoundCorners(radius: 15.0)
        
        self.otpLbl.isElevation = 1
        
    }
    
    func setupAction(){}
    
    func setupLang(){
        self.callLbl.text = Localize.stringForKey(key: "call")
        self.messageLbl.text = Localize.stringForKey(key: "message")
        self.shareLbl.text = Localize.stringForKey(key: "share")
        self.cancelLbl.text = Localize.stringForKey(key: "cancel")
    }
    
    func setData(){
        
    }
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
//            self.transform = CGAffineTransform(translationX: 0, y: 0).concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
            self.removeFromSuperview()
        }) { (true) in
            self.removeFromSuperview()
            NotificationCenter.default.post(name: .closeTripStatusView, object: nil)
        }
    }
    
    //MARK: Register xib view
    class var getView : TripStatusView {
        return UINib(nibName: "TripStatusView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! TripStatusView
    }
}
