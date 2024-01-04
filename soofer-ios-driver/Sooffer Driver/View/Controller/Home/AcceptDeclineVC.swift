//
//  AcceptDeclineVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 07/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import AVFoundation
import UICircularProgressRing
import MarqueeLabel

protocol SecondDriverDelegate {
    func second(tripID: String)
}

class AcceptDeclineVC: UIViewController {

    @IBOutlet weak var hideStkVw: UIStackView!
    
    //UI declaraction
    @IBOutlet weak var safeRide1Lbl: UILabel!
    @IBOutlet weak var safeRide2Lbl: UILabel!
    @IBOutlet weak var safeRide3Lbl: UILabel!
    @IBOutlet weak var safeRide4Lbl: UILabel!
    
    @IBOutlet weak var detView: UIView!
    @IBOutlet weak var declineBtn: UIButton!
    @IBOutlet weak var acceptBtn: UIButton!
    @IBOutlet weak var secondDriverVw: UIView!
    @IBOutlet weak var phnNoTf: UITextField!
    @IBOutlet weak var assignTf: UIButton!
    
    @IBOutlet weak var traveTimeLbl: UILabel!
    @IBOutlet weak var dropLbl: MarqueeLabel!
    @IBOutlet weak var distanceLbl: UILabel!
    @IBOutlet weak var totalFareLbl: UILabel!
    @IBOutlet weak var tripType: UILabel!
    @IBOutlet weak var pickupLbl: MarqueeLabel!
    
    @IBOutlet weak var circleProgressView: UICircularProgressRing!
    @IBOutlet weak var mapView: UIView!
    @IBOutlet weak var pickupView: UIView!
    @IBOutlet weak var dropview: UIView!
    
    @IBOutlet weak var mapImg: UIImageView!
    
    //VariableDeclaraction
    var backDelegate : TripRoutes?
    //Firebase object
    var FBConnect = FireBaseconnection.instanse
    
    
    var homevm = HomeVM()
    var requestID : String = ""
    var requestType : String = ""
    var triptype : String = ""
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var fbDateModel = FBDriverDataModel()
    var secondDelegate: SecondDriverDelegate!
    var saferideStatus : String = ""
    var isdriver : String = ""
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
        self.detView.backgroundColor = UIColor.black.withAlphaComponent(0.7)
        self.getFBDriverDetails()

    }
    
    override func viewWillDisappear(_ animated: Bool) {
        self.stopPlayer()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        print("active or notactive:: \(UIApplication.shared.applicationState)")
        switch UIApplication.shared.applicationState {
        case .background, .inactive:
            self.prepareSongAndSession()
        case .active:
            self.prepareSongAndSession()
        default:
            break
        }
        self.homevm = HomeVM(dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.observeNotification()
        self.setupData()
    }

  func prepareSongAndSession() {
         print("cametoplay")
    self.appDelegate.songPlayer.play()
    }
    
    func setupView(){
        self.circleProgressView.isRoundedView = true
        self.mapImg.isRoundedView = true
        var progress : Int = 1
        for value in progress..<100{
            DispatchQueue.main.asyncAfter(deadline: .now()+4) {
                self.circleProgressView.startProgress(to: CGFloat(value), duration: 10){
                    progress = progress+1
                }
            }
        }
    }
    
    func setupAction(){
        self.detView.addTap {
            self.detView.isHidden = true
        }
        self.acceptBtn.addAction(for: .tap) {
            print("FbTripsData::::", self.fbDateModel)
            self.acceptTrip()
        }
        
        self.declineBtn.addAction(for: .tap) {

            self.declineTrip()
        }
    }
    
    func setupLang(){
        self.declineBtn.setTitle(self.Localize.stringForKey(key: "decline"), for: .normal)
        self.acceptBtn.setTitle(self.Localize.stringForKey(key: "accept"), for: .normal)
    }
    
    func tripData() {
        self.tripData { [self] tripdata in
            if let tripdatas : FBTripDataModel = tripdata as? FBTripDataModel{
                print("tripsData1111", tripdatas)
                UserDefaults.standard.set(tripdatas.safeRide.safeRidestatus, forKey: UserDefaultsKey.safeRide)
                print("USERDEFAult:: \(UserDefaults.standard.string(forKey: UserDefaultsKey.safeRide))")
                if tripdatas.safeRide.safeRidestatus == "true" {
                    self.detView.isHidden = false
                    self.hideStkVw.isHidden = true
                    let tripId = UserDefaults.standard.string(forKey: UserDefaultsKey.tripId) ?? ""
                    assignTf.addTap {
                        self.secondView(phone: self.phnNoTf.text!, tripId: tripId)
                    }
                } else {
                    self.hideStkVw.isHidden = true
//                    self.setFBTripData()
//                    self.backDelegate?.getbackPress()
                    self.dismiss(animated: true, completion: nil)
                }
            }
        }
    }
    
    func setupData(){
        self.getTripData { (tripdata) in
            if let tripdatas : FBDriverDataModel = tripdata as? FBDriverDataModel{
                self.fbDateModel = tripdatas
                self.pickupLbl.text = tripdatas.request.picku_address
                self.dropLbl.text = tripdatas.request.drop_address
                self.traveTimeLbl.text = tripdatas.request.etd
                self.totalFareLbl.text = "Total fare" + Constant.priceTag + " \(tripdatas.request.totalFare) "
                print("valuesss::::", tripdatas.request.safeRideData.safeRideStatus)
                print("second id:: \(tripdatas.request.safeRideData.secondDriver), and first id:: \(tripdatas.request.request_id)")
          //      UserDefaults.standard.set(tripdatas.request.safeRideData.secondDriver, forKey: UserDefaultsKey.seconddriverid)
               
                self.saferideStatus = tripdatas.request.safeRideData.safeRideStatus
                if tripdatas.request.safeRideData.safeRideStatus == "false" {
                    self.hideStkVw.isHidden = true
                } else {
                    self.hideStkVw.isHidden = false
                    self.safeRide1Lbl.text = tripdatas.request.safeRideData.safeRideVech.makename
                    self.safeRide2Lbl.text = tripdatas.request.safeRideData.safeRideVech.model
                    self.safeRide3Lbl.text = tripdatas.request.safeRideData.safeRideVech.number
                    self.safeRide4Lbl.text = tripdatas.request.safeRideData.safeRideVech.vehiclecolor
                }
                
                self.distanceLbl.text = " \(tripdatas.request.totalKM)"
                self.requestID = tripdatas.request.request_id
                self.triptype = tripdatas.request.triptype
                if tripdatas.request.triptype == "rental"{
                    self.dropview.isHidden = true
                    self.distanceLbl.isHidden = true
                }
                if tripdatas.request.triptype != "daily"{
                    self.tripType.text = tripdatas.request.triptype.uppercased()
                }
            }
        }
    }
    
    class func initWithStory()->AcceptDeclineVC{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "AcceptDeclineVC") as! AcceptDeclineVC
        return vc
    }
    

    func observeNotification(){
        NotificationCenter.default.addObserver(self, selector: #selector(AppBecomeActive), name: .appEnterInForGorund, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(AppBecomeInActive), name: .appEnterInBackGround, object: nil)
    }
       
       @objc func AppBecomeActive(_ notification: Notification)
       {
           print("sssssss@@@@@")
            self.prepareSongAndSession()
       }
       
       @objc func AppBecomeInActive(_ notification: Notification)
       {
           self.stopPlayer()
       }
    
    func stopPlayer(){
        if self.appDelegate.songPlayer.isPlaying{
            self.appDelegate.songPlayer.stop()
        }
    }
}

extension AcceptDeclineVC {
    func secondView(phone: String, tripId: String) {
        homevm.secondDriverFunc(view: self.view, phone: phone, tripId: tripId)
        homevm.secondDriverSuccess = {
            print("Successs")
            showToast(msg: self.homevm.secondDriver?.message ?? "")
            self.tripData { [self] tripdata in
                if let tripdatas : FBTripDataModel = tripdata as? FBTripDataModel{
                    print("tripsData::", tripdatas.safeRide.safeRidetripStatus)
                    print("driver id:: \(tripdatas.driver_id), and:: \(tripdatas.safeRide.secondDriver)")
                
                    self.setFBTripData()
                  
                    self.backDelegate?.getbackPress()
                    self.dismiss(animated: true, completion: nil)
                }
            }
        }
        homevm.secondDriverErrorr = {
            print("tripsData:::::::::::", self.homevm.errorSecondDriver?.message ?? "")
            showToast(msg: self.homevm.errorSecondDriver?.message ?? "")
        }
    }
}


extension AcceptDeclineVC{
    func acceptTrip(){
        if !requestID.isEmpty {
            self.homevm.acceptRide(view: self.view, requestId: self.requestID)
        }else{
            showToast(msg: "Sorry!!! count accept your request ,please try again later")
        }
        
        self.homevm.getacceptclouser = {
            let accept_trip_id = self.homevm.accept?.tripId ?? 0
            self.isdriver = self.homevm.accept?.isDriver ?? ""
          
            print("accept_trip_id : \(accept_trip_id), and saferide :: \(self.saferideStatus), and:: \(self.isdriver)")
            UserDefaults.standard.set((self.homevm.accept?.tripId ?? 0).description, forKey: UserDefaultsKey.tripId)
            UserDefaults.standard.set(self.triptype, forKey: UserDefaultsKey.triptype)
            UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
            UserDefaults.standard.set(self.isdriver, forKey: UserDefaultsKey.isdriver)
            NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
          
            // if self.requestType == "rideNow"{
            if self.saferideStatus == "true" {
            //    if self.isdriver == "true" {
                self.tripData()
//
             
            } else {
                self.stopPlayer()
                self.setFBTripData()
                self.backDelegate?.getbackPress()
                self.dismiss(animated: true, completion: nil)
            }
        }
        
        self.homevm.eracceptclouser = {
            UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
                        NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
              self.stopPlayer()
            self.backDelegate?.getbackPress()
            self.dismiss(animated: true, completion: nil)
        }
    }
    
    func declineTrip(){
        if !requestID.isEmpty {
            self.homevm.declineRequest(view: self.view, requestId: self.requestID)
        }else{
            showToast(msg: "Sorry!!! count decline your request ,please try again later")
        }
        
        self.homevm.getdeclineclouser = {
            self.declineFBTrip()
            //             self.songPlayer.stop()
            self.stopPlayer()
            
            UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
            NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
            self.backDelegate?.getbackPress()
            self.dismiss(animated: true, completion: nil)
        }
        
        self.homevm.erdeclineclouser = {
            self.stopPlayer()
            self.setFBTripData()
            UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
            NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
            self.backDelegate?.getbackPress()
            self.dismiss(animated: true, completion: nil)
        }
    }
}

//FireBAse Datas
extension AcceptDeclineVC{
    func getFBDriverDetails(){
        self.FBConnect.getdDriversData { (driverData) in
            if let rideRequest : FBDriverDataModel? = driverData as? FBDriverDataModel {
                let trip_id = UserDefaults.standard.string(forKey: UserDefaultsKey.tripId) ?? ""
                print("tripIIDDDDD", trip_id)
                print("RideRequest:::::", rideRequest?.request.status as Any)
                self.requestType = rideRequest?.request.request_type ?? ""
                print("getFBDriverDetails trip_id : \(trip_id)")
                print("rideRequest?.request.status : \(rideRequest?.request.status)")
                if trip_id.isEmpty || trip_id == "0"{
                    if rideRequest?.request.status == "0"{
                        self.stopPlayer()
                        UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
                        NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
                        self.dismiss(animated: true, completion: nil)
                    }
                }
            }
        }
    }
    
    func setFBTripData(){
        self.FBConnect.CreateFirebaseTripData(status: "1")
    }
    func setFBTripData2(){
        self.FBConnect.updatefirebasetripdata(status: "1")
      //  self.FBConnect.CreateFirebaseTripData(status: "1")
    }
    func declineFBTrip(){
        self.FBConnect.cancelDeclineEndTrip()
    }
    
    func getTripData(driverdata : @escaping(FBDriverDataModel)->()){
        self.FBConnect.getdDriversData { (driverTripData) in
            driverdata(driverTripData)
        }
    }
    
    func tripData(driverdata: @escaping(FBTripDataModel) -> ()) {
        self.FBConnect.getTripData { (tripModel) in
            driverdata(tripModel)
        }
    }
}
