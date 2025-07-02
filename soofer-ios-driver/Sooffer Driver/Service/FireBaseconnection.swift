//
//  FireBaseconnection.swift
//  RebuStar Rider
//
//  Created by Abservetech on 03/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import FirebaseDatabase
import CoreLocation
import GooglePlaces

import Alamofire
import SwiftyJSON
import CoreLocation
import GooglePlaces
import GeoFire

class FireBaseconnection{
    
    static let instanse = FireBaseconnection()
    let fireBaseref : DatabaseReference = Database.database().reference()
    var firebaseChatList : [FBchatmsg] = [FBchatmsg]()
    
    var driverid : String = ""
    var vehicleID : String = ""
    init(){
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        print("^^^^FBdriverData",self.driverid)
    }
    
    func updateGeoFire(loc : CLLocation , tripId : String )  {
        //        let fireBase : DatabaseReference = Database.database().reference().child("offer_ride_location").child(tripId)
        //        let geoFire = GeoFire(firebaseRef: fireBase)
        //
        //        geoFire.setLocation(loc, forKey: self.userid) { (error) in
        //            if (error != nil) {
        //                print("An error occured: \(String(describing: error))")
        //            } else {
        //                print("Saved location successfully!")
        //            }
        //        }
    }
    
    //    func removerGeoFrie(tripId : String){
    //        let fireBase : DatabaseReference = Database.database().reference().child("offer_ride_location").child(tripId).child(self.driverid)
    //        fireBase.removeValue()
    //
    //    }
    
    func addUserDetail(userid : String , name : String , responsibleUserID : String ,status : String ){
        let userArray = [
            "name": name ,
            "responsibleUserID": responsibleUserID ,
            "status": status
        ]
        fireBaseref.child("userData").child(self.driverid).updateChildValues(userArray)
    }
    
    func observerUserStatusForInvite(userId : String , success : @escaping(String)->()) {
        //        fireBaseref.child("userData").child(userId).observe(.value) { (snapShot) in
        //            let userdata = snapShot.value
        //            let json = JSON(snapShot.value)
        //            print("userFBjson", json)
        //            let usersatus = FBUserData.init(json: json)
        //            success(usersatus.status)
        //        }
    }
    
    func cancelReason(canceldata : @escaping(CancelReason)->()){
        fireBaseref.child("Cancel_reason").observe(.value) { (snapShot) in
            let cancelreason = JSON(snapShot.value)
            let reason = CancelReason.init(json: cancelreason)
            canceldata(reason)
        }
    }
    
    func setOnlineStatus(Status : String){
        print("driverData",Status,self.driverid)
        if let id : String = self.driverid as? String{
            if !id.isEmpty{
                let fireBase : DatabaseReference = Database.database().reference().child("drivers_data").child(self.driverid).child("online_status")
                fireBase.setValue(Status)
            }
        }
    }
    
    //Update drver datas after he signup
    func updateDriverDefaultData(){
        if let id : String = self.driverid as? String{
            if !id.isEmpty{
                let driverArray = [
                    "online_status": "0" ,
                    "proof_status": "Accepted",
                    "vehicle_id": "0",
                    "cancelExceeds": "0",
                    "lastCanceledDate": "0",
                    "credits": "0"
                ]
                fireBaseref.child("drivers_data").child(self.driverid).setValue(driverArray)
                
                let AcceptArray = [
                    "trip_id": "0" ,
                    "others": "0"
                ]
                fireBaseref.child("drivers_data").child(self.driverid).child("accept").setValue(AcceptArray)
                
                let RequestArray = [
                    "drop_address": "0" ,
                    "etd": "0" ,
                    "picku_address": "0" ,
                    "request_id": "0" ,
                    "status": "0"
                ]
                fireBaseref.child("drivers_data").child(self.driverid).child("request").setValue(RequestArray)
            }
        }
    }
    
    func CreateFirebaseTripData(status : String){
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
        let fcm : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
        print("fcm:: \(fcm), and app status:: \(status), and tripd is:: \(tripid)")
        if let id : String = tripid as? String{
            if !id.isEmpty{
//                let createTrip1 = [
//                    "safeRidestatus" : "true",
//                    "secondDriver" : "",
//                    "safeRidetripStatus" : ""
//                ]
                let createTrip = [
                    "Drop_address" : "0",
                    "Drop_latlng": "0",
                    "convance_fare": "0",
                    "cancel_fare": "0",
                    "distance": "0",
                    "time": "0",
                    "isNight": "0",
                    "distance_fare": "0",
                    "cancelby": "0",
                    "driver_rating": "0",
                    "duration": "0",
                    "pickup_address": "0",
                    "rider_rating": "0",
                    "status": status,
                    "driver_token": fcm,
                    "time_fare": "0",
                    "datetime": "0",
                    "trip_type": "0",
                    "total_fare": "0",
                    "discount": "0",
                    "driver_alavance_dis": "0",
                    "ispay": "0",
                    "pay_type": "0",
                    "tax": "0",
                    "isTax": "0",
                    "isWaiting": "0",
                    "isPickup": "0"
                    
//                    "safeRideData" : createTrip1
                ] as [String : Any]
              //  fireBaseref.child("trips_data").child(tripid).setValue(createTrip)

                fireBaseref.child("trips_data").child(tripid).updateChildValues(createTrip)
            }
        }
    }
    func updatefirebasetripdata(status : String){
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
        let fcm : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
        print("fcm:: \(fcm), and app status:: \(status), and tripd is:: \(tripid)")
        if let id : String = tripid as? String{
            if !id.isEmpty{
//
                let createTrip1 = [
                    
                    "status": status,
                    "driver_token": fcm
                    
                    
//                    "safeRideData" : createTrip1
                ] as [String : Any]
              //  fireBaseref.child("trips_data").child(tripid).setValue(createTrip)

                fireBaseref.child("trips_data").child(tripid).updateChildValues(createTrip1)
            }
        }
    }
    
    func UpdateEndTripData(status : String,rideDetails: TripStatusModel){
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
        if let id : String = tripid as? String{
            if !id.isEmpty{
                let createTrip = [
                    "Drop_address" : "0",
                    "Drop_latlng": "0",
                    "convance_fare": "0",
                    "cancel_fare": "0",
                    "distance": "0",
                    "distance_fare" : "0",
                    "time": "0",
                    "isNight": "0",
                    "distance_fare": "0",
                    "cancelby": "0",
                    "driver_rating": "0",
                    "duration": "0",
                    "pickup_address": "0",
                    "rider_rating": "0",
                    "status": status,
                    "time_fare": "0",
                    "datetime": "0",
                    "trip_type": "0",
                    "total_fare": "0",
                    "discount": "0 km",
                    "driver_alavance_dis": "0",
                    "ispay": "0",
                    "isNight" : "0",
                    "pay_type": "0",
                    "tax": "0",
                    "isTax": "0",
                    "isWaiting": "0",
                    "isPickup": "0"
                ]
                fireBaseref.child("trips_data").child(tripid).setValue(createTrip)
                
            }
        }
    }
    
    func cancelDeclineEndTrip(){
        if let id : String = self.driverid as? String{
            if !id.isEmpty{
                
                let AcceptArray = [
                    "trip_id": "0" ,
                    "others": "0"
                ]
                fireBaseref.child("drivers_data").child(self.driverid).child("accept").setValue(AcceptArray)
                
                let RequestArray = [
                    "drop_address": "0" ,
                    "etd": "0" ,
                    "picku_address": "0" ,
                    "request_id": "0" ,
                    "status": "0"
                ]
                fireBaseref.child("drivers_data").child(self.driverid).child("request").updateChildValues(RequestArray)
                
            }
        }
    }
    
    
    
    func getdDriversData(driverdata : @escaping(FBDriverDataModel)->()){
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        
        if let id : String = self.driverid as? String{
            if !id.isEmpty{
                print("our driver Id::::", id)
                fireBaseref.child("drivers_data").child(self.driverid).observe(.value) { (snapShot) in
                    let driverjson = JSON(snapShot.value)
                    print("drivers_data",driverjson)
                    let reason = FBDriverDataModel.init(json: driverjson)
                    print("FbModel:::", reason.accept.trip_id, reason)
                    
                    driverdata(reason)
                }
            }
        }
    }
    
    func getVehicleData(Vehicledata : @escaping(FBVehicleDataModel)->()){
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        self.vehicleID = UserDefaults.standard.string(forKey: UserDefaultsKey.Vehicle_ID) as? String ?? ""
        
        if let id : String = self.driverid as? String{
            if !id.isEmpty{
                print("our driver Id::::", id)
                fireBaseref.child("vehicle_list").child(self.driverid).child(self.vehicleID).observe(.value) { (snapShot, _)  in
                    let vehiclejson = JSON(snapShot.value)
                    print("vehicle_datas::",vehiclejson)
                    let reason = FBVehicleDataModel.init(json: vehiclejson)
                    print("FbvvModel:::", reason.status, reason)
                    Vehicledata(reason)
                }
            }
        }
    }
    
    func getTripData(tripdata : @escaping(FBTripDataModel)->()){
        let id = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        print("DriverssssId;:::::", id)
        if let id : String = id as? String{
            if !id.isEmpty{
                print("userdefaultsss:::::", UserDefaults.standard.string(forKey: UserDefaultsKey.tripId))
                if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? "" as? String{
                    if !trip_id.isEmpty {
                        fireBaseref.child("trips_data").child(trip_id).observe(.value) { (snapShot) in
//                            fireBaseref.child("trips_data").child(trip_id).observeSingleEvent(of: .value) {
                            let tripData = JSON(snapShot.value)
                            let reason = FBTripDataModel.init(json: tripData)
                            print("tripDateModel", reason.safeRide)
                            tripdata(reason)
                        }
                    }
                }
            }
        }
    }
    
    
    func updatedefatulLoc(loc : CLLocation){
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        let defaultVehicle : String = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) as? String ?? ""
        if !self.driverid.isEmpty && !defaultVehicle.isEmpty{
            let fireBase : DatabaseReference = Database.database().reference().child("drivers_location")  .child(defaultVehicle)
            let geoFire = GeoFire(firebaseRef: fireBase)
            print("oferdatasss",self.driverid)
            geoFire.setLocation(loc, forKey: self.driverid) { (error) in
                if (error != nil) {
                    print("An error occured: \(String(describing: error))")
                } else {
                    print("Saved location successfully!")
                }
            }
        }
    }
    
    func updateGeoFire(loc : CLLocation)  {
        let defaultVehicle : String = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) as? String ?? ""
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if !self.driverid.isEmpty && !defaultVehicle.isEmpty{
            if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? "" as? String{
                if !trip_id.isEmpty {
                    let fireBase : DatabaseReference = Database.database().reference().child("drivers_location")  .child("trip_location")
                    let geoFire = GeoFire(firebaseRef: fireBase)
                    print("oferdatasss",self.driverid)
                    geoFire.setLocation(loc, forKey: self.driverid) { (error) in
                        if (error != nil) {
                            print("An error occured: \(String(describing: error))")
                        } else {
                            print("Saved location successfully!")
                        }
                    }
                    
                    let fireBases : DatabaseReference = Database.database().reference().child("drivers_location").child(defaultVehicle).child(self.driverid)
                    fireBases.removeValue()
                    self.removerGeoFrie()
                    self.outstationremoverGeoFrie()
                    self.RentalremoverGeoFrie()
                }
            }else{
            }
        }
    }
    
    func updateVehicleLocation(loc : CLLocation){
        let defaultVehicle : String = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) as? String ?? ""
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if !self.driverid.isEmpty && !defaultVehicle.isEmpty{
            let fireBase : DatabaseReference = Database.database().reference().child("drivers_location")  .child(defaultVehicle)
            let geoFire = GeoFire(firebaseRef: fireBase)
            print("oferdatasss",self.driverid)
            print("Driverlocationsss",defaultVehicle)
            geoFire.setLocation(loc, forKey: self.driverid) { (error) in
                if (error != nil) {
                    print("An error occured: \(String(describing: error))")
                } else {
                    print("Saved location successfully!")
                }
            }
        }
    }
    
    func RentalVehicleLocation(loc : CLLocation){
        let defaultVehicle : String = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) as? String ?? ""
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        let fireBase : DatabaseReference = Database.database().reference().child("drivers_location").child("rental")
        let geoFire = GeoFire(firebaseRef: fireBase)
        print("oferdatasss",self.driverid)
        geoFire.setLocation(loc, forKey: self.driverid) { (error) in
            if (error != nil) {
                print("An error occured: \(String(describing: error))")
            } else {
                print("Saved location successfully!")
            }
        }
    }
    
    func outstationLocation(loc : CLLocation){
        let defaultVehicle : String = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) as? String ?? ""
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        let fireBase : DatabaseReference = Database.database().reference().child("drivers_location") .child("outstation")
        let geoFire = GeoFire(firebaseRef: fireBase)
        print("oferdatasss",self.driverid)
        geoFire.setLocation(loc, forKey: self.driverid) { (error) in
            if (error != nil) {
                print("An error occured: \(String(describing: error))")
            } else {
                print("Saved location successfully!")
            }
        }
    }
    
    
    func removerGeoFrie(){
        let defaultVehicle : String = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) as? String ?? ""
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if !self.driverid.isEmpty && !defaultVehicle.isEmpty{
            let fireBase : DatabaseReference = Database.database().reference().child("drivers_location").child(defaultVehicle).child(self.driverid)
            fireBase.removeValue()
        }
    }
    
    func outstationremoverGeoFrie(){
        let defaultVehicle : String = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) as? String ?? ""
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if !self.driverid.isEmpty && !defaultVehicle.isEmpty{
            let fireBase : DatabaseReference = Database.database().reference().child("drivers_location").child("outstation").child(self.driverid)
            fireBase.removeValue()
        }
    }
    
    func RentalremoverGeoFrie(){
        let defaultVehicle : String = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) as? String ?? ""
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if !self.driverid.isEmpty && !defaultVehicle.isEmpty{
            let fireBase : DatabaseReference = Database.database().reference().child("drivers_location").child("rental").child(self.driverid)
            fireBase.removeValue()
        }
    }
    
    
    func forceLogout(token : String,logout : @escaping(Bool)->()){
        print("token :: \(token)")
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if let id : String = self.driverid as? String{
            if !id.isEmpty && !token.isEmpty{
                fireBaseref.child("drivers_data").child(self.driverid).observe(.value){ (snapShot) in
                    let driverjson = JSON(snapShot.value)
                    print("FORCELOOUTdrivers_data",driverjson)
                    let reason = FBDriverDataModel.init(json: driverjson)
                    print("reason.fcmid:: \(reason.FCM_id), and token is:: \(token)")
                    if reason.FCM_id == token{
                        logout(false)
                    }else{
                        logout(true)
                    }
                }
            }
        }
    }
    
    
    func updateToken(token : String){
        self.driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if let id : String = self.driverid as? String{
            if !id.isEmpty && !token.isEmpty{
                
                let token = [
                    "FCM_id": token
                ]
                fireBaseref.child("drivers_data").child(self.driverid).updateChildValues(token)
                
            }}
        
        
        
    }
    
    func addmesage(message : String ,  time : String,name : String , done : @escaping(String)->() ){
        if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? "" as? String{
            if !trip_id.isEmpty {
                
                let chatArray = [
                    "message": message,
                    "timestamp" : time,
                    "name" : name,
                    "type": "driver"
                ]
                fireBaseref.child("ChatRoom").child(trip_id).childByAutoId().updateChildValues(chatArray)
                done("success")
            }
        }
    }
    
    
    
    func chatList(allmessage : @escaping([FBchatmsg])->()){
        if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? "" as? String{
            if !trip_id.isEmpty {
                
                fireBaseref.child("ChatRoom").child(trip_id).observe(.value) { (snapShot) in
                    self.firebaseChatList.removeAll()
                    for result in snapShot.children.allObjects as! [DataSnapshot]{
                        let jsonData = JSON(result.value)
                        self.firebaseChatList.append(FBchatmsg.init(json: jsonData))
                        allmessage(self.firebaseChatList)
                    }
                }
            }
        }
    }
    
    func updateFCMToken(done : @escaping(String)->()){
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
        let fcm : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
        print("driversssToken::\(fcm)")
            if let id : String = tripid as? String{
                if !id.isEmpty{
                    let tripstatus = [
                        "driver_token": fcm,
                        
                    ]
                    fireBaseref.child("trips_data").child(tripid).updateChildValues(tripstatus)
                    done("done")
                }
            }
    }
}
