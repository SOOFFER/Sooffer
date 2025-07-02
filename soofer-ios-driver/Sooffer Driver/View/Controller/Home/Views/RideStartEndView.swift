//
//  RideStartEndView.swift
//  RebuStar Driver
//
//  Created by Abservetech on 07/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import UIKit

class RideStartEndView : UIView{
    
    @IBOutlet weak var RideView: UIView!
    @IBOutlet weak var detailView: UIView!
    
    @IBOutlet weak var rideDetailView: UIView!
    @IBOutlet weak var navigationView: UIView!
    @IBOutlet weak var vehicledetView: UIView!
    
    @IBOutlet weak var detailLbl: UILabel!
    @IBOutlet weak var navigationLbl: UILabel!
    @IBOutlet weak var addressLbl: UILabel!
    
    @IBOutlet weak var tapBtn: UIButton!
    
    //variable declraction
    let Localize : Localizations = Localizations.instance
    var FBConnect = FireBaseconnection.instanse
    let vehicleview = VehicleDetailView.getView
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    func initView(view : UIView ,address : String ,tripRotue: TripStatusModel,tripstatus : FBTripDataModel, tripStatus : @escaping(String) -> (), ridedetail : @escaping(String)->() , navigation : @escaping(String) -> ()/*, vehicledetail : @escaping(String) -> ()*/){
        self.setView(view: view)
        self.setupLang()
        print("tripstatus:: \(tripstatus.status), and triproute statuss is:: \(tripRotue.status)")
        print("isdriver:: \(tripStatus)")
        self.setupData(address: address, tripstatus: tripstatus,tripRotue: tripRotue)
        
        self.rideDetailView.addAction(for: .tap) {
            ridedetail("ridedetail_clicked")
        }
        
        self.navigationView.addAction(for: .tap) {
            navigation("navigation_clicked")
        }
        self.vehicledetView.addAction(for: .tap) {
            self.vehicleview.initView(view: view)
          //  vehicledetail("vehicledetail_clicked")
        }
        self.tapBtn.addAction(for: .tap) {
            print("button tile:: \(tripstatus), and:: \(tripstatus.safeRide.safeRidetripStatus) ")
            if self.tapBtn.title(for: .normal) == self.Localize.stringForKey(key: "tap_arrive"){
                tripStatus("2")
               // NotificationCenter.default.post(name: Notification.Name("status"), object: nil)
               // self.updateTripSttaus(Status: "2")
                
               
                
            }else if self.tapBtn.title(for: .normal) == self.Localize.stringForKey(key: "tap_start"){
                
                print("fghdgfhd:: \(tripRotue.isFirstDriver), and :: \(tripstatus.safeRide.secondDriver)")
                if tripstatus.safeRide.safeRidetripStatus == "6" {
                   // if tripRotue.isFirstDriver == false {
                    if    !tripstatus.safeRide.secondDriver.isEmpty{
                        tripStatus("6")
                    } else {
                        tripStatus("3")
                    }
                  
                   // self.updateTripSttaus(Status: "3")
                } else {
                    tripStatus("3")
                }
                
            }else if self.tapBtn.title(for: .normal) == self.Localize.stringForKey(key: "tap_end"){
                if tripstatus.safeRide.safeRidetripStatus == "7" {
                    
                    if tripRotue.isFirstDriver == true {
                        tripStatus("4")
                    } else {
                        tripStatus("7")
                    }
                } else {
                    tripStatus("4")
                }
                
            }
        }
        
    }
    func updateTripSttaus(Status: String){
        print("upatat::,\(Status)")
        self.FBConnect.CreateFirebaseTripData(status: Status)
    }
    func setupData(address : String ,tripstatus : FBTripDataModel,tripRotue: TripStatusModel){
        if let tripdata : FBTripDataModel = tripstatus as? FBTripDataModel{
            
            print("1234:: \(tripdata), and \n 5678:: \(tripRotue)")
            let status2 = tripdata.status
            var status = tripdata.safeRide.safeRidetripStatus
            let userid =  "\(UserDefaults.standard.string(forKey: UserDefaultsKey.userid) ?? "")"
            print("status::::", tripRotue.status)
            print("first USerid:: \(userid), and then \n secondtriver id:: \(tripdata.safeRide.secondDriver), and driver id :: \(tripdata.driver_id)")
          //  print("seconddriverid:: \(tripdata.safeRide.secondDriver), and driver id:: \(UserDefaults.standard.string(forKey: UserDefaultsKey.userid) ?? "")")
            if tripdata.safeRide.safeRidestatus == "true"{
                if userid != tripdata.driver_id {
                    vehicledetView.isHidden = true
                } else {
                    vehicledetView.isHidden = false
                }
            } else {
                vehicledetView.isHidden = true
            }
            
            
            if !tripdata.safeRide.safeRidetripStatus.isEmpty   {
                if userid != tripdata.driver_id {
             //   if tripdata.safeRide.secondDriver.isEmpty {
                  
                    print("status2::::", status2, tripRotue.status)
                    print("status:", status)
                    switch status {
                       
                    case "6":
                        self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_start"), for: .normal)
                        self.addressLbl.text = address
                        break
                    case "7":
                        self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_end"), for: .normal)
                        self.addressLbl.text = tripRotue.routeData.start
                        break
                 
                    default:
                        break
                    }
                  //  if tripRotue.isFirstDriver == true{
                        
                        
                     /*   switch status2 {
                        case  "1"  :
                            self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_arrive"), for: .normal)
                            self.addressLbl.text = address
                            break
                        case "2":
                            self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_start"), for: .normal)
                            self.addressLbl.text = address
                            break
                        case "3":
                            self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_end"), for: .normal)
                            self.addressLbl.text = tripRotue.routeData.start
                            break
                            
                            
                        default:
                            break
                        }*/
                //    }
            } else {
                print("status:", status2)
                switch status2 {
                case  "1"  :
                    self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_arrive"), for: .normal)
                    self.addressLbl.text = address
                    break
                case "2":
                    self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_start"), for: .normal)
                    self.addressLbl.text = address
                    break
                case "3":
                    self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_end"), for: .normal)
                    self.addressLbl.text = tripRotue.routeData.start
                    break
                    
                    
                default:
                    break
                }
             /*   print("status:", status)
                switch status {
                   
                case "6":
                    self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_start"), for: .normal)
                    self.addressLbl.text = address
                    break
                case "7":
                    self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_end"), for: .normal)
                    self.addressLbl.text = tripRotue.routeData.start
                    break
             
                default:
                    break
                }*/
            }
            } else {
                switch tripRotue.status{
                case  "Accept" :
                    self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_arrive"), for: .normal)
                    self.addressLbl.text = address
                    break
                case "Arrive Now":
                    self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_start"), for: .normal)
                    self.addressLbl.text = tripRotue.routeData.start
                    break
                case "Start Trip":
                    self.tapBtn.setTitle(self.Localize.stringForKey(key: "tap_end"), for: .normal)
                    self.addressLbl.text = tripRotue.routeData.end
                    break
                default :
                    break
                }
            }
        }
    }
    
    //MARK: setView Property
    func setView(view : UIView) {
        //View Animation
        DispatchQueue.main.asyncAfter(deadline: .now()+0.2) {
            
            self.frame = CGRect(x: 0,
                                y: view.frame.height * 0.67 ,
                                width: view.frame.width,
                                height: view.frame.height * 0.33)
            self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
            view.addSubview(self)
            view.bringSubviewToFront(self)
        }
        
        self.transform = CGAffineTransform(translationX: 0, y: view.frame.height)//.concatenating(CGAffineTransform(scaleX: 0.8, y: 0.8))
        
        UIView.animate(withDuration: 0.5) {
            self.transform = .identity
        }
        self.leftRightRoundCorners(radius: 15.0)
        self.tapBtn.roundeCornorBorderAppcolor = 5
        
    }
    
    
    func setupLang(){
        self.detailLbl.text = Localize.stringForKey(key: "rider_details")
        self.navigationLbl.text = Localize.stringForKey(key: "navigation")
        self.tapBtn.setTitle(Localize.stringForKey(key: "tap_arrive"), for: .normal)
    }
    
    func setData(){
        
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
    class var getView : RideStartEndView {
        return UINib(nibName: "RideStartEndView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! RideStartEndView
    }
}
