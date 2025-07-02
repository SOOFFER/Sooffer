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

class FireBaseconnection{
    
    static let instanse = FireBaseconnection()
    let fireBaseref : DatabaseReference = Database.database().reference()
    var firebaseChatList : [FBchatmsg] = [FBchatmsg]()
    
    var userid : String = ""
    init(){
        self.userid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) ?? ""
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
    
    func removerGeoFrie(tripId : String){
        let fireBase : DatabaseReference = Database.database().reference().child("offer_ride_location").child(tripId).child(self.userid)
        fireBase.removeValue()
        
    }
    
    func addUserDetail(userid : String , name : String , responsibleUserID : String ,status : String ){
        let userArray = [
            "name": name ,
            "responsibleUserID": responsibleUserID ,
            "status": status
        ]
        fireBaseref.child("userData").child(self.userid).updateChildValues(userArray)
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
    
    func cancelReason(cancelReason : @escaping(FBCancelReason)->()){
        fireBaseref.child("Cancel_reason").observe(.value) { (snapShot) in
            let cancelreason = JSON(snapShot.value)
            let reason = FBCancelReason.init(json: cancelreason)
            print("cancelJSONREason",reason.alertLabels.DRIVER_NOT_FOUND)
            cancelReason(reason)
        }
    }
    
    
    
    func getRideFlow(riderData : @escaping(FBRiderDataModel)->()){
        
        if let userids : String = self.userid as? String {
            print("hsjdgjahsgd\(self.userid)")
            fireBaseref.child("riders_data").child(self.userid).observe(.value) { (snapShot) in
                let riderdata = JSON(snapShot.value)
                print("^^^^^FBRequestData",riderdata)
                FBRiderDataModel.init(json: riderdata)
                riderData(FBRiderDataModel.init(json: riderdata))
            }
        }
    }
    
 /*   func getFlowRideChildValue(riderData : @escaping(FBRiderDataModel?)->()){
        if !self.userid.isEmpty{
            
            fireBaseref.child("riders_data").child(self.userid).getData{ (error,snapshot) in
                if let errors = error {
                    return
                }
                if let snapshot,snapshot.exists(){
                    let riderdata = JSON(snapshot.value as Any)
                    riderData(FBRiderDataModel.init(json: riderdata))
                }
            }
        }
    }*/
    
    
    func getFlowRideChildValue(riderData: @escaping (FBRiderDataModel?) -> ()) {
        if !self.userid.isEmpty {
            let ridersDataRef = Database.database().reference().child("riders_data").child(self.userid)
            ridersDataRef.observeSingleEvent(of: .value, with: { (snapshot) in
                if let value = snapshot.value as? [String: Any] {
                    let jsonValue = JSON(value) // Create a JSON instance from the dictionary
                    let riderdata = FBRiderDataModel(json: jsonValue)
                    riderData(riderdata)
                } else {
                    riderData(nil)
                }

            }) { (error) in
                print("Error: \(error.localizedDescription)")
                riderData(nil)
            }
        }
    }

    
    
    //Update drver datas after he signup
    func clearRiderData(){
        
        if let id : String = self.userid as? String{
            if !id.isEmpty{
                let riderArray = [
                    "cancelExceeds": "0" ,
                    "lastCanceledDate": "0",
                    "current_tripid": "0",
                    "tripstatus": "0",
                    "requestId": "0",
                    "tripdriver": "0"
                ]
                UserDefaults.standard.set(false, forKey: "isarrive")
                fireBaseref.child("riders_data").child(self.userid).updateChildValues(riderArray)
                
                
            }
        }
    }
    
    func updateCancelTripstatus(status : String){
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? ""
        if let id : String = tripid as? String{
            if !id.isEmpty{
                let tripstatus = [
                    "status": status
                ]
                fireBaseref.child("trips_data").child(tripid).updateChildValues(tripstatus)
                
                self.clearRiderData()
            }
        }
    }
    
    
    func listenDriverLocation(driverlocation : @escaping(FBOfferLocation)->()){
        let driverid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.driverid) as? String ?? ""
        let sertviceType : String = (UserDefaults.standard.value(forKey: UserDefaultsKey.driverVehcile) as? String ?? "").lowercased()
        if let id : String = driverid as? String, let sertvice : String = sertviceType as? String{
            if !id.isEmpty && !sertvice.isEmpty{
                if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? "" as? String{
                    if !trip_id.isEmpty {
                        fireBaseref.child("drivers_location").child("trip_location").child(driverid).observe(.value) { (snapShot) in
                            let json = JSON(snapShot.value)
                            print("^^^^^FBDriverLocationss",json)
                            let driverlocations = FBOfferLocation.init(json: json)
                            driverlocation(driverlocations)
                        }
                    }
                }else{ fireBaseref.child("drivers_location").child(sertviceType).child(driverid).observe(.value) { (snapShot) in
                    let json = JSON(snapShot.value)
                    print("^^^^^FBDriverLocationss",json)
                    let driverlocations = FBOfferLocation.init(json: json)
                    driverlocation(driverlocations)
                }
                }
            }
        }
    }
    
    func getTripData(tripdata : @escaping(FBTripDataModel)->()){
        if let id : String = self.userid as? String{
            if !id.isEmpty{
                if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? "" as? String{
                    if !trip_id.isEmpty {
                        fireBaseref.child("trips_data").child(trip_id).observe(.value) { (snapShot) in
                            let tripData = JSON(snapShot.value)
                            print("^^^^^FBTRIPData",tripData)
                            let reason = FBTripDataModel.init(json: tripData)
                            tripdata(reason)
                        }
                    }
                }
            }
        }
    }
    
    func forceLogout(token : String,logout : @escaping(Bool)->()){
        self.userid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if let id : String = self.userid as? String{
            if !id.isEmpty && !token.isEmpty{
                fireBaseref.child("riders_data").child(self.userid).observe(.value){ (snapShot) in
                    let driverjson = JSON(snapShot.value)
                    print("FORCELOOUTdrivers_data",driverjson)
                    let reason = FBRiderDataModel.init(json: driverjson)
                    print("reason fcm::\(reason.FCM_id)   tokensss:::\(token)")
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
        self.userid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        if let id : String = self.userid as? String{
            if !id.isEmpty && !token.isEmpty{
                
                let token = [
                    "FCM_id": token
                ]
                fireBaseref.child("riders_data").child(self.userid).updateChildValues(token)
                
            }}
        
        
        
    }
    func addmesage(message : String ,  time : String,name : String , done : @escaping(String)->() ){
        if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? "" as? String{
            if !trip_id.isEmpty {
                
                let chatArray = [
                    "message": message,
                    "timestamp" : time,
                    "name" : name,
                    "type": "rider"
                ]
                fireBaseref.child("ChatRoom").child(trip_id).childByAutoId().setValue(chatArray)
                done("success")
            }
        }
    }
    
    func chatList(allmessage : @escaping([FBchatmsg])->()){
        if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? "" as? String {
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
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? ""
        let fcm : String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
        if let id : String = tripid as? String{
            if !id.isEmpty{
                let tripstatus = [
                    "rider_token": fcm
                ]
                fireBaseref.child("trips_data").child(tripid).updateChildValues(tripstatus)
                done("done")
            }
        }
    }
    func changeDropAddress(dropaddress: String, dropLatLng: String,completion : @escaping()->() ){
        print("DROPPPP ADDRESS::\(dropaddress)")
        print("DRDOP LAT LNG:: \(dropLatLng)")
        
        
        
        
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? ""
        if let id : String = tripid as? String{
          if !id.isEmpty{
            print("TRIP IDDD :::\(tripid)")
            let updateDrop = [
              "Drop_address" : dropaddress,
              "Drop_latlng" : dropLatLng
            ]
            fireBaseref.child("trips_data").child(tripid).updateChildValues(updateDrop)
            completion()
          }
        }
      }
}
