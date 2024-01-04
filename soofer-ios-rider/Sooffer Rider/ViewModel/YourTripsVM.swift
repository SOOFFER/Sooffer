//
//  YourTripsVM.swift
//  RebuStar Rider
//
//  Created by Abservetech on 18/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class YourTripsVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var pastTrip : TripModel?{
        didSet {
            guard let trip = pastTrip else { return }
            self.successTrip?()
        }
    }
    
    var pastTriperr : TripModel?{
        didSet {
            guard let err = pastTriperr else { return }
            self.errorTrip?()
        }
    }
    
    var yourTripDetail : TripDetailModel?{
        didSet{
            guard let tripdetail = self.yourTripDetail else {return}
            self.successTripDetail?()
        }
    }
    var yourTripReciept : TripDetailModel?{
        didSet{
            guard let tripdetail = self.yourTripDetail else {return}
            self.successTripDetail?()
        }
    }
    
    var errTripDetail : TripDetailModel?{
        didSet{
            guard let tripdetail = self.errTripDetail else {return}
            self.errTripDetailClouser?()
        }
    }
    
    var upcomingTrip : UpcomingTripModel?{
        didSet {
            guard let trip = upcomingTrip else { return }
            self.successupcomingTripDetail?()
        }
    }
    
    var upcomingTriperr : UpcomingTripModel?{
        didSet {
            guard let err = upcomingTriperr else { return }
            self.errcomingTripClouser?()
        }
    }
    
    var canceltrip : CancelTripModel?{
        didSet {
            guard let response = canceltrip else { return }
            self.successcancelTrip?()
        }
    }
    var errcanceltrip : CancelTripModel?{
        didSet {
            guard let err = errcanceltrip else { return }
            self.errCancelTrip?()
            showToast(msg: errcanceltrip?.message ?? "")
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
    var successTrip : (() -> ())?
    var errorTrip : (() -> ())?
    var successTripDetail : (() -> ())?
    var SendTripRecieptss : (() -> ())?
    var errTripDetailClouser : (() -> ())?
    var successupcomingTripDetail : (() -> ())?
    var errcomingTripClouser : (() -> ())?
    var successcancelTrip : (() -> ())?
    var errCancelTrip : (() -> ())?
    
    // MARK: - Network call
    func getPastTrip(view : UIView ){
        let url = ServiceApi.pasttrip
        var params = Parameters()
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
       
            self.pastTrip = TripModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.pastTriperr = TripModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func getUpcomingTrip(view : UIView ){
        let url = ServiceApi.upcoming_trip
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.upcomingTrip = UpcomingTripModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.upcomingTriperr = UpcomingTripModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func getRideDetail(view : UIView , tripId : String){
        let url = ServiceApi.tripDetail
        var params = Parameters()
        params["tripId"] = tripId
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            let successRes : Bool = success["success"].bool ?? Bool()
            if successRes{
                self.yourTripDetail = TripDetailModel.init(json: success)
            }else{
                 self.errTripDetail = TripDetailModel.init(json: success)
            }
        }, jsonError: { (jsonError) in
            self.errTripDetail = TripDetailModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func userCancelScheduleTaxi(view : UIView , requestId : String){
        let url = ServiceApi.userCancelScheduleTaxi
        var params = Parameters()
        params["requestId"] = requestId
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            let successRes : Bool = success["success"].bool ?? Bool()
            if successRes{
                self.canceltrip = CancelTripModel.init(json: success)
            }else{
                self.errcanceltrip = CancelTripModel.init(json: success)
            }
        }, jsonError: { (jsonError) in
            self.errcanceltrip = CancelTripModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
}

