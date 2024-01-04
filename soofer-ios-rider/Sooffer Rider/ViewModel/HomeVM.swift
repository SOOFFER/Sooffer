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
    
    var vechileservice : VechileServiceModel?{
        didSet{
            guard let vechile = vechileservice else { return }
            self.getVechileClosure?()
        }
    }
    var errVechileservice : VechileServiceModel?{
        didSet{
            guard let error = errVechileservice else { return }
           // showToast(msg: "\(errVechileservice?.message ?? "")!!!! Try again Later!!")
            self.errgetVechileClosure?()
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
            self.errgetFareClouser?()
//            showToast(msg: "\(errfareDetail?.message ?? "")!!!! Try again Later!!")
        }
    }
    
    var request : RideRequestModel?{
        didSet{
            guard let response = request else { return }
            getRequestClouser?()
        }
    }
    
    var errrequest : RideRequestModel?{
        didSet{
            guard let err = errrequest else { return }
            errRequestClouser?()
            //showToast(msg: err.message ?? "")
        }
    }
    
    var cancelRequest : RideRequestModel?{
        didSet{
            guard let response = cancelRequest else { return }
            getcancelClouser?()
        }
    }
    
    var errcancelRequest : RideRequestModel?{
        didSet{
            guard let err = errcancelRequest else { return }
            errcancelClouser?()
            showToast(msg: err.message ?? "")
        }
    }
    
    var cancelTrip : cancelTripModel?{
        didSet{
            guard let response = cancelTrip else { return }
            getcancelTripClouser?()
        }
    }
    
    var errcancelTrip : cancelTripModel?{
        didSet{
            guard let err = errcancelTrip else { return }
            errcancelTripClouser?()
            showToast(msg: err.message ?? "")
        }
    }
    
    
    var rideDetails : RideDetailModel?{
        didSet{
            guard let response = rideDetails else { return }
            getRideDetailClouser?()
        }
    }
    
    var errrideDetails : RideDetailModel?{
        didSet{
            guard let err = errrideDetails else { return }
            errRideDetailClouser?()
            if !((self.errrideDetails?.message ?? "").isEmpty){
                showToast(msg: err.message ?? "")
            }
        }
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
    
    var promoSuccess : String?{
        didSet{
            guard let promo = promoSuccess else { return }
            promosuccess?()
        }
    }
    var PackageListsucc : PackageList?{
           didSet{
               guard let package = PackageListsucc else { return }
               succPackage?()
           }
       }
    
    var errpromoSuccess : String?{
        didSet{
            guard let promo = errpromoSuccess else { return }
            errpromo?()
        }
    }
    
        var RentalVehiclesucc : RentalVehicle?{
              didSet{
                  guard let package = RentalVehiclesucc else { return }
                  succRentalVehiclesucc?()
              }
        }
       
       var errRentalVehicle : RentalVehicle?{
           didSet{
               guard let promo = errRentalVehicle else { return }
               errRentalVehiclesucc?()
           }
       }
    
    var outstationVehicleListWithFare : OutstationVehicleListWithFare?{
                 didSet{
                     guard let package = outstationVehicleListWithFare else { return }
                     succOutstationFare?()
                 }
           }
          
    var erroutstationVehicleListWithFare : OutstationVehicleListWithFare?{
        didSet{
            guard let promo = erroutstationVehicleListWithFare else { return }
            errOutstationFare?()
        }
    }
    
    var outstationrequest : RideRequestModel?{
        didSet{
            guard let response = outstationrequest else { return }
            getoutstatRequestClouser?()
        }
    }
    
    var erroutstationrequest : RideRequestModel?{
        didSet{
            guard let err = erroutstationrequest else { return }
            erroutstatRequestClouser?()
            if !(err.message ?? "").isEmpty{
                showToast(msg: err.message ?? "")
            }
            
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
    
    // MARK: - Closures for callback, since we are not using the ViewModel to the View.
    var errorinFetchData: (() -> ())?
    var showErrorAlertClosure: (() -> ())?
    var getVechileClosure: (()->())?
    var errgetVechileClosure: (()->())?
    var getFareClouser : (() -> ())?
    var errgetFareClouser : (() -> ())?
    var getRequestClouser : (() -> ())?
    var errRequestClouser : (()->())?
    var getoutstatRequestClouser : (() -> ())?
    var erroutstatRequestClouser : (()->())?
    var getcancelTripClouser : (() -> ())?
    var errcancelTripClouser : (()->())?
    var getcancelClouser : (() -> ())?
    var errcancelClouser : (()->())?
    var getRideDetailClouser : (() -> ())?
    var errRideDetailClouser : (()->())?
    var getfeedbackClouser : (() -> ())?
    var errfeedbackClouser : (()->())?
    var promosuccess : (()->())?
    var errpromo : (()->())?
    var succRentalVehiclesucc : (()->())?
    var succPackage : (()->())?
    var errRentalVehiclesucc : (()->())?
    var succOutstationFare : (()->())?
    var errOutstationFare : (()->())?

    
    // MARK: - Network call
    func getVechileList(view : UIView , pickupLoc : CLLocation , dropLoc : CLLocation  ){
        let url = ServiceApi.vehicleServe
        
        var params = Parameters()
        params["pickupLat"] = "\((pickupLoc.coordinate.latitude ?? 0.0).description)"
        params["pickupLng"] = "\((pickupLoc.coordinate.longitude ?? 0.0).description)"
//        params["dropLat"] = "\((dropLoc.coordinate.latitude ?? 0.0).description)"
//        params["dropLng"] = "\((dropLoc.coordinate.longitude ?? 0.0).description)"
        params["tripType"] = "daily"
        print("paramsss::::", params)
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.vechileservice = VechileServiceModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errVechileservice = VechileServiceModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func getextimateFare(view : UIView , pickupLoc : CLLocation , dropLoc : CLLocation , serviceDetail : VechileListData,pickupCity : String, isMultiLocation : String, multiLocation : String){
        
        let url = ServiceApi.estimationFare
        
        var params = Parameters()
        params["serviceType"] = serviceDetail.type
        params["serviceTypeId"] = serviceDetail._id
        params["time"] = ""
        params["pickupLat"] = "\((pickupLoc.coordinate.latitude ?? 0.0).description)"
        params["pickupLng"] = "\((pickupLoc.coordinate.longitude ?? 0.0).description)"
        params["pickupCity"] = pickupCity
        params["dropLat"] = "\((dropLoc.coordinate.latitude ?? 0.0).description)"
        params["dropLng"] = "\((dropLoc.coordinate.longitude ?? 0.0).description)"
        params["tripType"] = "daily"
        params["hotelId"] = ""
        print("hggdfhgfhg:: \(isMultiLocation), and multilocation:: \(multiLocation)")
        params["isMultiLocation"] = isMultiLocation
        params["multiLocation"] = multiLocation
        
        
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
    
    func sendRideRequest(view : UIView ,date : String ,paymentType : String , pickupCity : String , bookingtype : String ,tripTime : String, estimateFare : EstimateFareDetails,utc : String, isMultiLocation : String ,multiLocation : String, homeType: RedirectHome, withId: String, withNo: String, withName: String, withMake: String){
        if let fare : EstimateFareDetails = estimateFare as? EstimateFareDetails{
          
            let url = ServiceApi.requestTaxi
            
            var params = Parameters()
            print("Valuesss::::", UserDefaults.standard.bool(forKey: UserDefaultsKey.driver))
            let id = UserDefaults.standard.string(forKey: UserDefaultsKey.taxiId) ?? ""
            let number = UserDefaults.standard.object(forKey: UserDefaultsKey.number) as? [String]
            print("My valuessssss::::", number)
            print("driverss::::",  UserDefaults.standard.bool(forKey: UserDefaultsKey.driver))
            if UserDefaults.standard.bool(forKey: UserDefaultsKey.driver) {
                params["safeRide"] =  "true"
                params["vehicleId"] =  id
                params["number"] = number?[0]
                params["makename"] = number?[1]
                params["model"] = number?[2]
                params["vehiclecolor"] = number?[3]
            } else {
                params["safeRide"] = "false"
            }
            params["vehicleDetailsAndFare"] = ""
            params["distanceDetails"] = ""
            params["promo"] = UserDefaults.standard.value(forKey: UserDefaultsKey.promo) as? String ?? ""
            params["promoAmt"] = ""
            params["tripType"] = "daily"
            params["tripDate"] = date
            params["paymentMode"] = paymentType
            params["pickupCity"] = pickupCity
            params["requestFrom"] = "app"
            params["bookingType"] = bookingtype
            params["serviceType"] = fare.vehicleDetailsAndFare.vehicleDetails.type ?? ""
            params["estimationId"] = fare.estimationId
            params["tripTime"] = tripTime
            params["notesToDriver"] = ""
            params["bookingFor"] = ""
            params["otherPh"] = ""
            params["otherPhCode"] = Constant.phoneCode
            params["noofseats"] = "1"
            params["utc"] = utc
            params["serviceTypeId"] = fare.vehicleDetailsAndFare.vehicleDetails.serviceId ?? ""
            
            print("hggdfhgfhg\(isMultiLocation)")
            params["isMultiLocation"] = isMultiLocation
            params["multiLocation"] = multiLocation
            
            self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
                self.request = RideRequestModel(json: success)
            }, jsonError: { (jsonError) in
                self.errrequest = RideRequestModel(json: jsonError)
            }, error: { (Error) in
                print("@@@Error" ,Error)
            }, dataSuccess: { (responseData) in
                print("@@@responseData" ,responseData)
            },dataError: { (errorData) in
                print("@@@errorData" ,errorData)
            })
        }
    }
    
    
    func cancelRide(view : UIView ,requestid : String){
        let url = ServiceApi.cancelTaxi
        
        var params = Parameters()
        params["requestId"] = requestid
      
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
           self.cancelRequest = RideRequestModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errcancelRequest = RideRequestModel.init(json: jsonError)
          }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    
    func cancelCurrentTrip(view : UIView ,tripId : String){
        let url = ServiceApi.cancelCurrentTrip
        
        var params = Parameters()
        params["tripId"] = tripId
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.cancelTrip = cancelTripModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errcancelTrip = cancelTripModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func tripDriverDetails(view : UIView , tripId : String){
        let url = ServiceApi.tripDriverDetails
       
        var params = Parameters()
        params["tripId"] = tripId
        
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.rideDetails = RideDetailModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errrideDetails = RideDetailModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
        
    }
    
    func riderFeedBack(view : UIView , tripId : String,rating : String ,comments : String ){
        let url = ServiceApi.riderFeedback
        
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
    
      func validatePromo(view : UIView , code : String ){
        let url = ServiceApi.validatePromo
        
        var params = Parameters()
        params["promoCode"] = code
        
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            print("@@@responseJSON" ,success)
            self.promoSuccess = success["discount"] as? String ?? "0"
            
        }, jsonError: { (jsonError) in
             print("@@@errorJSON" ,jsonError)
            self.errpromoSuccess = "Promo Code is not applicable."
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
        
    }
    
    func getPAckageList(view : UIView,pickupLoc : CLLocation){
          let url = ServiceApi.packageList
          
          var params = Parameters()
          params["pickupLat"] = "\((pickupLoc.coordinate.latitude ?? 0.0).description)"
          params["pickupLng"] = "\((pickupLoc.coordinate.longitude ?? 0.0).description)"
          
          self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
              print("@@@responseJSON" ,success)
            self.PackageListsucc = PackageList.init(json: success)
          }, jsonError: { (jsonError) in
               print("@@@errorJSON" ,jsonError)
        
          }, error: { (Error) in
              print("@@@Error" ,Error)
          }, dataSuccess: { (responseData) in
              print("@@@responseData" ,responseData)
          },dataError: { (errorData) in
              print("@@@errorData" ,errorData)
          })
          
      }
    
    func rentalService(view : UIView,packageId : String,serviceId : String){
        let url = ServiceApi.fareEstimation
        
        var params = Parameters()
        params["packageId"] = packageId
        params["serviceId"] = serviceId
        params["tripTypeCode"] = "rental"
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            print("@@@responseJSON" ,success)
            self.RentalVehiclesucc = RentalVehicle.init(json: success)
        }, jsonError: { (jsonError) in
             print("@@@errorJSON" ,jsonError)
            self.errRentalVehicle = RentalVehicle.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
        
    }
    
    func rentalConfirmBooking(view : UIView ,date : String ,paymentType : String , pickupCity : String , bookingtype : String ,tripTime : String, estimateFare : EstimateFareDetails,utc : String,packageId : String,vehicleTypeId : String,serviceType : String,pickupLoc : CLLocation,pickupAddress : String){
        let url = ServiceApi.requestRentalTaxi
        var params = Parameters()
                  params["vehicleDetailsAndFare"] = ""
                  params["distanceDetails"] = ""
                  params["promo"] = UserDefaults.standard.value(forKey: UserDefaultsKey.promo) as? String ?? ""
                  params["promoAmt"] = ""
                  params["tripType"] = "daily"
                  params["tripDate"] = date
                  params["paymentMode"] = paymentType
                  params["pickupCity"] = pickupCity
                  params["requestFrom"] = "app"
                  params["bookingType"] = bookingtype
                  params["serviceType"] = serviceType
                  params["estimationId"] = ""
                  params["tripTime"] = tripTime
                  params["notesToDriver"] = ""
                  params["bookingFor"] = ""
                  params["otherPh"] = ""
                  params["otherPhCode"] = Constant.phoneCode
                  params["noofseats"] = "1"
                  params["utc"] = utc
                  params["vehicleTypeId"] = vehicleTypeId
                  params["packageId"] = packageId
                  params["tripType"] = "rental"
                  params["pickupLat"] = "\((pickupLoc.coordinate.latitude ?? 0.0).description)"
                params["pickupLng"] = "\((pickupLoc.coordinate.longitude ?? 0.0).description)"
                params["pickupAddress"] = pickupAddress
        
                  self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
             self.request = RideRequestModel(json: success)
                         
                      
                  }, jsonError: { (jsonError) in
            self.errrequest = RideRequestModel(json: jsonError)
                  
                  }, error: { (Error) in
                      print("@@@Error" ,Error)
                  }, dataSuccess: { (responseData) in
                      print("@@@responseData" ,responseData)
                  },dataError: { (errorData) in
                      print("@@@errorData" ,errorData)
                  })
              }
    
    
    
    func OustationService(view : UIView,pickupLoc : CLLocation, dropLoc : CLLocation,tripTypeCode : String,outstationType : String,startDay : String , returnDay : String){
        let url = ServiceApi.outstationDetail
        
         var params = Parameters()
        params["pickupLat"] = "\((pickupLoc.coordinate.latitude ?? 0.0).description)"
        params["pickupLng"] = "\((pickupLoc.coordinate.longitude ?? 0.0).description)"
        params["dropLat"] = "\((dropLoc.coordinate.latitude ?? 0.0).description)"
        params["dropLng"] = "\((dropLoc.coordinate.longitude ?? 0.0).description)"
        params["tripTypeCode"] = tripTypeCode
        params["outstationType"] = outstationType
        params["startDay"] = startDay
        params["returnDay"] = returnDay
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            print("@@@responseJSON" ,success)
            self.outstationVehicleListWithFare = OutstationVehicleListWithFare.init(json: success)
        }, jsonError: { (jsonError) in
             print("@@@errorJSON" ,jsonError)
            self.erroutstationVehicleListWithFare = OutstationVehicleListWithFare.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
        
    }
        

    func OutstationConfirmBooking(view : UIView ,date : String ,paymentType : String , pickupCity : String , bookingtype : String ,tripTime : String, estimateFare : EstimateFareDetails,utc : String,packageId : String,vehicleTypeId : String,serviceType : String,pickupLoc : CLLocation,dropLoc : CLLocation,startDay : String,returnDay : String, outstationType : String ){
           let url = ServiceApi.requestOutstationTaxi
           var params = Parameters()
                     params["vehicleDetailsAndFare"] = ""
                     params["distanceDetails"] = ""
                     params["promo"] = UserDefaults.standard.value(forKey: UserDefaultsKey.promo) as? String ?? ""
                     params["promoAmt"] = ""
                     params["tripType"] = "outstation"
                     params["tripDate"] = date
                     params["paymentMode"] = paymentType
                     params["pickupCity"] = pickupCity
                     params["requestFrom"] = "app"
                     params["bookingType"] = bookingtype
                     params["serviceType"] = serviceType
                     params["estimationId"] = ""
                     params["tripTime"] = tripTime
                     params["notesToDriver"] = ""
                     params["bookingFor"] = ""
                     params["otherPh"] = ""
                     params["otherPhCode"] = Constant.phoneCode
                     params["noofseats"] = "1"
                     params["utc"] = utc
                     params["vehicleTypeId"] = vehicleTypeId
                     params["pickupLat"] = "\((pickupLoc.coordinate.latitude ?? 0.0).description)"
                   params["pickupLng"] = "\((pickupLoc.coordinate.longitude ?? 0.0).description)"
                    params["dropLat"] = "\((dropLoc.coordinate.latitude ?? 0.0).description)"
                           params["dropLng"] = "\((dropLoc.coordinate.longitude ?? 0.0).description)"
                         
        params["startDay"] = startDay
        params["returnDay"] = returnDay
        params["outstationType"] = outstationType
        params["additionalFee"] = ""
           
                     self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
                self.outstationrequest = RideRequestModel(json: success)
                            
                         
                     }, jsonError: { (jsonError) in
               self.erroutstationrequest = RideRequestModel(json: jsonError)
                     
                     }, error: { (Error) in
                         print("@@@Error" ,Error)
                     }, dataSuccess: { (responseData) in
                         print("@@@responseData" ,responseData)
                     },dataError: { (errorData) in
                         print("@@@errorData" ,errorData)
                     })
                 }
       
 
    
    func sosMsg(view : UIView , trip_id : String ){
        let url = ServiceApi.emergencyMsg
        
        var params = Parameters()
        params["trip_id"] = trip_id
        
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            print("@@@responseJSON" ,success)
           showToast(msg: "Message Sended Successfully")
            
        }, jsonError: { (jsonError) in
             print("@@@errorJSON" ,jsonError)
           showToast(msg: "Message Sended Successfully")
                    
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
        
    }
       
    
}



