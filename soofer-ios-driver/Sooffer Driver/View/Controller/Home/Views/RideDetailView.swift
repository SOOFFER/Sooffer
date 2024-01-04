//
//  RideDetailView.swift
//  RebuStar Driver
//
//  Created by Abservetech on 07/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import Cosmos

class RideDetailView : UIView , UITextFieldDelegate {
    
    //UI Declaraction
    
    @IBOutlet weak var rideDetailView: UIView!
    
    @IBOutlet weak var riderNameLbl: UILabel!
    @IBOutlet weak var riderImg: UIImageView!
    @IBOutlet weak var riderratng: CosmosView!
    @IBOutlet weak var riderVehicleLbl: UILabel!
    @IBOutlet weak var callView: UIView!
    @IBOutlet weak var cancelView: UIView!
    @IBOutlet weak var messageview: UIView!
    @IBOutlet weak var callLbl: UILabel!
    @IBOutlet weak var messageLbl: UILabel!
    @IBOutlet weak var cancelLbl: UILabel!
    @IBOutlet weak var detailbgview: UIView!
    
       //VariableDeclaraction
       let Localize : Localizations = Localizations.instance
       var FBConnect = FireBaseconnection.instanse
       override func awakeFromNib() {
           super.awakeFromNib()
       }
       
       
       func initView(view : UIView , tripRotue : TripStatusModel ,call : @escaping(String) ->(), message : @escaping(String) -> () , cancel : @escaping(String) -> ()){
        self.setView(view: view)
        self.setupAction()
        self.setupView()
        self.setupLang()
        self.setupData(tripRotue: tripRotue)
        self.callView.addAction(for: .tap) {
//            call(tripRotue.rider.phone)
            call("")
        }
        self.messageview.addAction(for: .tap) {
            message(tripRotue.rider.phone)
        }
        self.cancelView.addAction(for: .tap) {
            cancel("cancel")
        }
        
        
    }
    
    func setupData(tripRotue : TripStatusModel){
        if let triproute : TripStatusModel = tripRotue as? TripStatusModel{
            self.riderNameLbl.text = triproute.rider.fname + " " + triproute.rider.lname
            self.riderratng.rating = Double(triproute.rider.points ?? "0.0") ?? 0.0
          
            var urls : String = triproute.rider.profileurl ?? String()
         //   self.riderImg?.pin_setImage(from: URL(string: urls))
            let urlkfs = URL(string: urls)
            self.riderImg.kf.setImage(with: urlkfs)
            self.riderImg.clipsToBounds = true
            self.riderImg.layer.cornerRadius = self.riderImg.frame.width / 2
            print("start trip is:: \(tripRotue.status)")
            self.FBConnect.getTripData { (tripData) in
                print("tripdata", tripData.status)
                
                if let tripstatus : FBTripDataModel = tripData as? FBTripDataModel {
                    if tripstatus.status == "3" || tripstatus.status == "4" {
                        self.cancelView.isHidden = true
                    } else {
                        self.cancelView.isHidden = false
                    }
                }
                
            }

           /* if tripRotue.status == "Start Trip"{
                self.cancelView.isHidden = true
            }else{
                self.cancelView.isHidden = false
            }*/
        }
    }
    
    func setupAction(){
        self.detailbgview.addAction(for: .tap) {
            self.deInitView()
        }
        self.rideDetailView.addAction(for: .tap) {
            
        }
    }
    
    func setupView(){
    }
    
    func setupLang(){
        self.callLbl.text = Localize.stringForKey(key: "call")
        self.messageLbl.text = Localize.stringForKey(key: "message")
        self.cancelLbl.text = Localize.stringForKey(key: "cancel")
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
        
        self.rideDetailView.layer.cornerRadius = 10
        self.rideDetailView.isElevation = 10
    }
    
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
            self.removeFromSuperview()
        }) { (true) in
            self.removeFromSuperview()
        }
    }
    
    //MARK: Register xib view
    class var getView : RideDetailView {
        return UINib(nibName: "RideDetailView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! RideDetailView
    }
    
}

class VehicleDetailView : UIView {
    
    
    
    @IBOutlet weak var backgroundview: UIView!
    
    @IBOutlet weak var vehicleview: UIView!
    
    @IBOutlet weak var makename: UILabel!
    
    @IBOutlet weak var modelname: UILabel!
    
    @IBOutlet weak var vehiclenumber: UILabel!
    
    @IBOutlet weak var colorname: UILabel!
    
    
    let Localize : Localizations = Localizations.instance
    var FBConnect = FireBaseconnection.instanse
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    func initView(view : UIView){
     self.setView(view: view)
     self.setupAction()
     self.setupData()
    
     
     
 }
    func setupAction(){
        self.backgroundview.addAction(for: .tap) {
            self.deInitView()
        }
       
    }
    func setupData(){
        self.FBConnect.getTripData { (tripData) in
            //print("tripdata", tripData.status)
            
            if let tripstatus : FBTripDataModel = tripData as? FBTripDataModel {
                let vehicledata = tripstatus.safeRide
                self.modelname.text = vehicledata.edtModel
                self.makename.text = vehicledata.edtMake
                self.vehiclenumber.text = vehicledata.edtPhoneNumber
                self.colorname.text = vehicledata.edtcolor
            }
            
        }
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
        
        self.vehicleview.layer.cornerRadius = 10
        self.vehicleview.isElevation = 10
    }
    
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
            self.removeFromSuperview()
        }) { (true) in
            self.removeFromSuperview()
        }
    }
    
    //MARK: Register xib view
    class var getView : VehicleDetailView {
        return UINib(nibName: "RideDetailView", bundle: nil).instantiate(withOwner: nil, options: nil)[1] as! VehicleDetailView
    }
    
}

