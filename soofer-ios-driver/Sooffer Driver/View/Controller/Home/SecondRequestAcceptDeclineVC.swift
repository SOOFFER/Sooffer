//
//  SecondRequestAcceptDeclineVC.swift
//  Sooffer Driver
//
//  Created by Abservetech on 04/07/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import UIKit
import AVFoundation
import UICircularProgressRing
import MarqueeLabel

/*class SecondRequestAcceptDeclineVC: UIViewController {

    @IBOutlet weak var declineBtn: UIButton!
    @IBOutlet weak var acceptBtn: UIButton!
  
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
    
    
    
    
    
    var backDelegate : TripRoutes?
    //Firebase object
    var FBConnect = FireBaseconnection.instanse
    
    
    var homevm = HomeVM()
    var requestID : String = ""
    var requestType : String = ""
    var triptype : String = ""
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    
    var FirstTripID: String = ""
    var SecondTripID: String = ""
    
    
   override func viewWillAppear(_ animated: Bool) {
    
           super.viewDidLoad()
           self.getFBDriverDetails1()
           switch UIApplication.shared.applicationState {
           case .background, .inactive:
               self.stopPlayer()
               case .active:
                    self.prepareSongAndSession()
               default:
                   break
           }

       }
       
       override func viewWillDisappear(_ animated: Bool) {
             self.stopPlayer()
       }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.FirstTripID = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as! String
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
          self.acceptBtn.addAction(for: .tap) {
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
      
      
      func setupData(){
          self.getTripData { (tripdata) in
             
              if let tripdatas : FBDriverDataModel = tripdata as? FBDriverDataModel{
                  self.pickupLbl.text = tripdatas.request.picku_address
                  self.dropLbl.text = tripdatas.request.drop_address
                  self.traveTimeLbl.text = tripdatas.request.etd
                  self.totalFareLbl.text = "Total fare" + Constant.priceTag + " \(tripdatas.request.totalFare) "
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
      
      class func initWithStory()->SecondRequestAcceptDeclineVC{
          let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "SecondRequestAcceptDeclineVC") as! SecondRequestAcceptDeclineVC
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


  extension SecondRequestAcceptDeclineVC{
      
      func acceptTrip(){
          if !requestID.isEmpty {
              self.homevm.acceptRide(view: self.view, requestId: self.requestID)
          }else{
              showToast(msg: "Sorry!!! count accept your request ,please try again later")
          }
          
          self.homevm.getacceptclouser = {
              
              // if self.requestType == "rideNow"{
     
              self.SecondTripID = String(self.homevm.accept?.tripId ?? 0 )
              UserDefaults.standard.set((self.homevm.accept?.tripId ?? 0).description, forKey: UserDefaultsKey.tripId)
            //  UserDefaults.standard.set(self.triptype, forKey: UserDefaultsKey.triptype1)
              UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
              NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
              self.stopPlayer()
              self.setFBTripData()
              self.setFBTripData1()
              self.backDelegate?.getbackPress()
              self.dismiss(animated: true, completion: nil)
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
              UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
              NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
              self.backDelegate?.getbackPress()
              self.dismiss(animated: true, completion: nil)
          }
      }
  }

  //FireBAse Datas
  extension SecondRequestAcceptDeclineVC{
      func getFBDriverDetails1(){
          self.FBConnect.getdDriversData { (driverData) in
              if let rideRequest : FBDriverDataModel? = driverData as? FBDriverDataModel {
                  let trip_id = UserDefaults.standard.string(forKey: UserDefaultsKey.tripId) ?? ""
                  print("tripIIDDDDD", trip_id)
                  print("RideRequest:::::", rideRequest?.request.status as Any)
                  self.requestType = rideRequest?.request.request_type ?? ""
                  if trip_id.isEmpty {
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
          self.FBConnect.CreateFirebaseTripData(status: "1")//, tripID: SecondTripID)
      }
      func setFBTripData1(){
          self.FBConnect.CreateFirebaseTripData(status: "1")//, tripID: FirstTripID)
        
      }
      
      func declineFBTrip(){
          self.FBConnect.cancelDeclineEndTrip()
      }
      
      func getTripData(driverdata : @escaping(FBDriverDataModel)->()){
          self.FBConnect.getdDriversData { (driverTripData) in
              print("")
              driverdata(driverTripData)
          }
      }
  }*/


