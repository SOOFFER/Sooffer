//
//  HomeVM.swift
//  RebuStar Rider
//
//  Created by Abservetech on 28/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire
import GoogleMaps

class HomeVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var online : onlineModel?{
        didSet{
            guard let vechile = online else { return }
            self.getOnlineclouser?()
        }
    }
    var errOnline : onlineModel?{
        didSet{
            guard let error = errOnline else { return }
            //showToast(msg: " Try again Later!!")
        }
    }
    
    var accept : TripAcceptDeclineModel?{
        didSet{
            guard let acceptdata = self.accept else { return }
            self.getacceptclouser?()
        }
    }
    
    var erraccept : TripAcceptDeclineModel?{
        didSet{
            guard let acceptdata = self.erraccept else { return }
            self.eracceptclouser?()
            showToast(msg: acceptdata.message )
        }
    }
    
    var decline : TripAcceptDeclineModel?{
        didSet{
            guard let acceptdata = self.decline else { return }
            self.getdeclineclouser?()
            
        }
    }
    
    var errdecline : TripAcceptDeclineModel?{
        didSet{
            guard let acceptdata = self.errdecline else { return }
            self.erdeclineclouser?()
            showToast(msg: acceptdata.message +  "Sorry!, Try again later!!!")
        }
    }
    
    var updateLocation : String?{
        didSet{
            guard let acceptdata = self.updateLocation else { return }
            self.getupdateLocclouser?()
            
        }
    }
    
    var errupdateLocation : String?{
        didSet{
            guard let acceptdata = self.errupdateLocation else { return }
            self.errupdateLocclouser?()
            //            showToast(msg: "Sorry!, Try again later!!!")
        }
    }
    
    
    var succLogout : String?{
        didSet{
            guard let acceptdata = self.succLogout else { return }
            self.getlogout?()
            
        }
    }
    
    var errLogout : String?{
        didSet{
            guard let acceptdata = self.errLogout else { return }
            self.errlogout?()
        }
    }
    
    var tripRoute : TripStatusModel?{
        didSet{
            guard let triproute = tripRoute else {
                return
            }
            self.getTripRouteClouser?()
            //showToast(msg: triproute.message )
        }
    }
    
    var errtripRoute : TripStatusModel?{
        didSet{
            guard let triproute = errtripRoute else {
                return
            }
            self.errTripRouteClouder?()
            showToast(msg: triproute.message)
        }
    }
    
    var cancelTrip : TripStatusModel?{
        didSet{
            guard let triproute = cancelTrip else {
                return
            }
            self.getcancelClouser?()
        }
    }
    
    var errcancelTrip : TripStatusModel?{
        didSet{
            guard let triproute = errcancelTrip else {
                return
            }
            self.errcancelClouder?()
            showToast(msg: triproute.message)
        }
    }
    
    //Mark :- Constructor
    init() { }
    
    init(view : UIView ,dataService : ApiRoot) {
        self.dataService = dataService
    }
    
    init(dataService : ApiRoot) {
        self.dataService = dataService
    }
    
    var feedback : FeedBackModel?{
        didSet{
            guard let response = feedback else { return }
            getfeedbackClouser?()
        }
    }
    
    var errfeedback : FeedBackModel?{
        didSet{
            guard let err = errfeedback else { return }
            errfeedbackClouser?()
            showToast(msg: err.message ?? "")
        }
    }
    
    var fareDetail : EstimateFareDetails?{
        didSet{
            guard let fare = fareDetail else { return }
            self.getFareClouser?()
        }
    }
    
    var errfareDetail : EstimateFareDetails?{
        didSet{
            guard let errfare = errfareDetail else { return }
            showToast(msg: "\(errfareDetail?.message ?? "")!!!! Try again Later!!")
        }
    }
    
    var startTrip : startHailtrip?{
        didSet{
            guard let starttrip = startTrip else {
                return
            }
            showToast(msg: starttrip.message ?? "")
            self.getStartTripClouser?()
        }
    }
    
    var errstartTrip : startHailtrip?{
        didSet{
            guard let starttrip = errstartTrip else {
                return
            }
            showToast(msg: starttrip.message ?? "")
            self.errStartTripClouser?()
        }
    }
    
    var secondDriver: FeedBackModel? {
        didSet {
            guard let response = secondDriver else { return }
            print("errorr::::", response.message)
            secondDriverSuccess?()
        }
    }
    
    var errorSecondDriver: FeedBackModel? {
        didSet {
            guard let response = errorSecondDriver else { return }
            print("errorr::::", response.message, response.success)
            secondDriverErrorr?()
        }
    }
    
    var selfieUpload: FeedBackModel?{
        didSet{
            guard let response = selfieUpload else { return }
            print("response::::", response)
            showToast(msg: response.message)
            selfieUPloadSuccess?()
            
        }
    }
    
    var safeImg: FeedBackModel? {
        didSet {
            guard let response = safeImg else { return }
            print("success", response.message)
            imageUploadClosure?()
        }
    }
    
    var errSafeImg: FeedBackModel? {
        didSet {
            guard let response = errSafeImg else { return }
            print("errorr::::", response.message)
            imageUploadError?()
        }
    }

    var errorUpload : FeedBackModel?{
        didSet{
            guard let response = errorUpload else { return }
            print("response::::", response)
            showToast(msg: response.message)
            selfieUploadErrorrr?()
        }
    }
    
    // MARK: - Closures for callback, since we are not using the ViewModel to the View.
    var errorinFetchData: (() -> ())?
    var showErrorAlertClosure: (() -> ())?
    var getOnlineclouser  : (()->())?
    var errOnlineclouser : (() -> ())?
    var getacceptclouser  : (()->())?
    var eracceptclouser : (() -> ())?
    var getdeclineclouser  : (()->())?
    var erdeclineclouser : (() -> ())?
    var getupdateLocclouser  : (()->())?
    var errupdateLocclouser : (() -> ())?
    var getTripRouteClouser : (() -> ())?
    var errTripRouteClouder : (()->())?
    var getcancelClouser : (() -> ())?
    var errcancelClouder : (()->())?
    var getfeedbackClouser : (() -> ())?
    var errfeedbackClouser : (()->())?
    var imageUploadClosure : (() -> ())?
    var imageUploadError   : (() -> ())?
    var getlogout : (() -> ())?
    var errlogout : (()->())?
    var getFareClouser : (() -> ())?
    var getStartTripClouser : (() -> ())?
    var errStartTripClouser : (() -> ())?
    var selfieUPloadSuccess : (() -> ())?
    var selfieUploadErrorrr : (() -> ())?
    var secondDriverSuccess : (() -> ())?
    var secondDriverErrorr  : (() -> ())?
 
    func hailRequestValidation(view : UIView,promo : String,promoAmt : String,tripTime : String,paymentMode : String,estimateFare: EstimateFareDetails, fname : String, lname : String, email : String, phone : String){
        
        if fname.isEmpty{
            showToast(msg: "First Name field is required")
        }else if fname.count < 4{
            showToast(msg: "First Name should contains atleast 4 digits")
        }else if lname.isEmpty{
            showToast(msg: "Last Name field is required")
        }else if lname.count < 4{
            showToast(msg: "last Name should contains atleast 4 digits")
        }else if email.isEmpty{
            showToast(msg: "Email field is required")
        }else if !email.isValidEmail(){
            showToast(msg: "Enter Valid Email Id")
        }
        else if phone.isEmpty{
            showToast(msg: "Mobile Number field is required")
        }else if phone.count != 10{
            showToast(msg: "Enter Valid Phone Number")
        }else{
            requestHailTaxi(view : view,promo: promo, promoAmt: promoAmt, tripTime: tripTime, paymentMode: paymentMode, estimateFare: estimateFare, fname: fname, lname: lname, email: email, phone: phone)
        }
    }
    
    
    func secondDriverFunc(view: UIView, phone: String, tripId: String) {
        let url = ServiceApi.secondDriver
        var params = Parameters()
        params["phone"] = phone
        params["tripno"] = tripId
        params["requeststatus"] = "Accepted"
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { success in
            self.secondDriver = FeedBackModel.init(json: success)
            print("driver success:: \(self.secondDriver)")
        }, jsonError: { (jsonError) in
            self.errorSecondDriver = FeedBackModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func safeImgFunc(view: UIView, withParams: [[String: Any]]) {
        let url = ServiceApi.uploadImg
        self.dataService?.uploadApi(view: view, url: url, params: withParams, jsonSuccess: { success in
            self.safeImg = FeedBackModel.init(json: success)
        }, jsonError: { jsonError in
            self.errSafeImg = FeedBackModel.init(json: jsonError)
        }, error: { error in
            print("@@@Errorr", error)
        }, dataSuccess: { response in
            print("@@responseData", response)
        }, dataError: { errorData in
            print("@@errorData", errorData)
        })
    }
    
    func selfieUploadedFunc(view : UIView , image : UIImage){
        
        let url = ServiceApi.selfie
        
        var params = Parameters()
        
        self.dataService?.fileUploadPostApi1(view: view, url: url, params: params, image: image, jsonSuccess: { (success) in
            print("sucess:: \(success)")
            self.selfieUpload = FeedBackModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errorUpload = FeedBackModel.init(json: jsonError[0])
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func changeOnlineStatus(view : UIView , status : String ){
        
        let url = ServiceApi.online
        
        var params = Parameters()
        params["status"] = status
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.online = onlineModel(json: success)
        }, jsonError: { (jsonError) in
            self.errOnline = onlineModel(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func logout(view : UIView){
        
        let url = ServiceApi.logout
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.succLogout = "Logout successfully"
        }, jsonError: { (jsonError) in
            
            self.errLogout = "Sorry, failed to logout"
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func acceptRide(view : UIView , requestId : String ){
        
        let url = ServiceApi.acceptRequest
        
        var params = Parameters()
        params["requestId"] = requestId
        print("reques id:: \(requestId)")
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            print("success:: \(success)")
            self.accept = TripAcceptDeclineModel.init(json : success)
        }, jsonError: { (jsonError) in
            self.erraccept = TripAcceptDeclineModel.init(json : jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func declineRequest(view : UIView , requestId : String ){
        
        let url = ServiceApi.declineRequest
        
        var params = Parameters()
        params["requestId"] = requestId
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.decline = TripAcceptDeclineModel.init(json : success)
        }, jsonError: { (jsonError) in
            self.errdecline = TripAcceptDeclineModel.init(json : jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func updateLocation(loc : CLLocation ,status : String){
        let url = ServiceApi.DriverLocation
        
        var params = Parameters()
        params["lat"] = loc.coordinate.latitude.description
        params["lon"] = loc.coordinate.longitude.description
        params["status"] = status
        
        self.dataService?.putLocApi( url: url, params: params, jsonSuccess: { (success) in
            self.updateLocation = success["message"].string ?? ""
        }, jsonError: { (jsonError) in
            self.errupdateLocation = jsonError["message"].string ?? ""
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    // update Ride locations
    func tripCurrentStatus(view : UIView ,allowanceDistance : String , pickupLat : String , pickupLng : String ,startTime : String ,fromAddress : String ,endAddress : String,endTime : String , waitingTime : String ,waitingSecond : String , additionalFee : String , dropLng : String , dropLat : String, duration : String , tripId : String , status : String,distance : String,startMeter : String,endMeter : String , hillKm : String,newUpdate : String,cusemailid : String, safeRide: String){
        let url = ServiceApi.tripCurrentStatus
        print("valuesss:::",status)
        var params = Parameters()
        params["allowanceDistance"] = allowanceDistance
        params["pickupLat"] = pickupLat
        params["pickupLng"] = pickupLng
        params["startTime"] = startTime
        params["fromAddress"] = fromAddress
        params["endAddress"] = endAddress
        params["endTime"] = endTime
        params["waitingTime"] = waitingTime
        params["waitingSecond"] = waitingSecond
        params["additionalFee"] = additionalFee
        params["dropLng"] = dropLng
        params["dropLat"] = dropLat
        params["duration"] = duration
        params["tripId"] = tripId
        params["status"] = status
        params["distance"] = distance
        params["startMeter"] = startMeter
        params["endMeter"] = endMeter
        params["hillKm"] = hillKm
        params["newUpdate"] = newUpdate
        params["cusemailid"] = cusemailid
        params["safeRide"] = safeRide
        print("status:: \(status), and :: \(safeRide)")
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.tripRoute = TripStatusModel.init(json: success)
            print("triproute status is::: \(self.tripRoute?.isFirstDriver)")
        }, jsonError: { (jsonError) in
            self.errtripRoute = TripStatusModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func cancelRide(view : UIView ,tripId : String){
        let url = ServiceApi.cancelTrip
        
        var params = Parameters()
        params["tripId"] = tripId
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.cancelTrip = TripStatusModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errcancelTrip = TripStatusModel.init(json: jsonError)
            
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func riderFeedBack(view : UIView , tripId : String,rating : String ,comments : String ){
        let url = ServiceApi.driverFeedback
        
        var params = Parameters()
        params["tripId"] = tripId
        params["rating"] = rating
        params["comments"] = comments
        
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.feedback = FeedBackModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errfeedback = FeedBackModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
        
    }
    
    func estimationFareForHailTaxi(view : UIView ,time : String, pickupLoc: CLLocation, dropLoc: CLLocation, pickupCity: String){
        
        let url = ServiceApi.estimationFareForHailTaxi
        
        var params = Parameters()
        params["time"] = time
        params["pickupLat"] = "\((pickupLoc.coordinate.latitude ?? 0.0).description)"
        params["pickupLng"] = "\((pickupLoc.coordinate.longitude ?? 0.0).description)"
        params["pickupCity"] = pickupCity
        params["dropLat"] = "\((dropLoc.coordinate.latitude ?? 0.0).description)"
        params["dropLng"] = "\((dropLoc.coordinate.longitude ?? 0.0).description)"
        params["tripType"] = "daily"
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.fareDetail = EstimateFareDetails(fromJson: convertToDictionary(text: success.description) ?? ["":""])
            
        }, jsonError: { (jsonError) in
            self.errfareDetail = EstimateFareDetails(fromJson: convertToDictionary(text: jsonError.description) ?? ["":""])
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func requestHailTaxi(view : UIView ,promo : String,promoAmt : String,tripTime : String,paymentMode : String,estimateFare: EstimateFareDetails, fname : String, lname : String, email : String, phone : String){
        
        let url = ServiceApi.requestHailTaxi
        
        var params = Parameters()
        params["promo"] = promo
        params["promoAmt"] = promoAmt
        params["tripType"] = "daily"
        params["tripTime"] = tripTime
        params["paymentMode"] = paymentMode
        params["pickupCity"] = estimateFare.pickupCity
        params["requestFrom"] = "app"
        params["bookingType"] = "hailRide"
        params["serviceType"] = estimateFare.vehicleDetailsAndFare.vehicleDetails.type
        params["estimationId"] = estimateFare.estimationId
        params["fname"] = fname
        params["lname"] = lname
        params["email"] = email
        params["phone"] = phone
        
        
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.startTrip = startHailtrip.init(json: success)
        }, jsonError: { (jsonError) in
            self.errstartTrip = startHailtrip.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
}



