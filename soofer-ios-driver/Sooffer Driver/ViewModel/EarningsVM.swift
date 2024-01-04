
//
//  Earnings.swift
//  RebuStar Driver
//
//  Created by Abservetech on 09/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class EarningsVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var earningsList : EarningModel?{
        didSet{
            guard let vechile = earningsList else { return }
            self.getearningListClosure?()
        }
    }
    var errearningList : EarningModel?{
        didSet{
            guard let error = errearningList else { return }
            showToast(msg: "Try again Later!!")
        }
    }
    
    var manageVehicleService : ManageVehicleService?{
             didSet{
                 guard  let package = self.manageVehicleService else {
                     return
                 }
                 self.SuccManageVehicleService?()
             }
         }
         
         var errmanageVehicleService : ManageVehicleService?{
             didSet{
                 guard let err = self.errmanageVehicleService else {return}
                 self.errManageVehicleService?()
             }
         }
    
    var succActiveTrip : String?{
              didSet{
                  guard let acceptdata = self.succActiveTrip else { return }
                  self.getActiveTrip?()
                  
              }
          }
          var errActiveTrips : String?{
              didSet{
                  guard let acceptdata = self.errActiveTrips else { return }
                  self.errActiveTrip?()
              }
          }
    var successtwodriveractivetrip : Twodrivermodel?{
              didSet{
                  guard let acceptdata = self.successtwodriveractivetrip else { return }
                  self.successdrivertrip?()
                  
              }
          }
          var errtwodriverActiveTrips : Twodrivermodel?{
              didSet{
                  guard let acceptdata = self.errtwodriverActiveTrips else { return }
                  self.errdrivertrip?()
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
    var getearningListClosure: (()->())?
    var errearningListClosure : (() -> ())?
    var SuccManageVehicleService : (()->())?
    var errManageVehicleService : (()->())?
    var getActiveTrip : (() -> ())?
    var errActiveTrip : (()->())?
    
    var successdrivertrip : (() -> ())?
    var errdrivertrip : (() -> ())?
    
    
    // MARK: - Network call
    func getEaringsList(view : UIView,from : String , to : String , type : String , fromMonth : String , page : String ){
     
        let url = ServiceApi.driverEarnings
        
        var params = Parameters()
        params["from"] = from
        params["to"] = to
        params["type"] = type
        params["fromMonth"] = fromMonth
        params["_page"] = page
       
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.earningsList = EarningModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errearningList = EarningModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    // MARK: - Network call
    func getVehicleServiceAvailablity(view : UIView){
        
        let url = ServiceApi.getVehicleServiceAvailablity+"/\(Constant.currentTaxi._id)"
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.manageVehicleService = ManageVehicleService.init(json: success)
        }, jsonError: { (jsonError) in
             self.errmanageVehicleService = ManageVehicleService.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func getdriverActiveTripType(view : UIView,activeFor : String , status : String){
        
        let url = ServiceApi.driverActiveTripType
        
        var params = Parameters()
        params["activeFor"] = activeFor
        params["status"] = status
        
        self.dataService?.patchApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.succActiveTrip = "Success"
        }, jsonError: { (jsonError) in
            
            self.errActiveTrips = "error"
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    // MARK: - Network call
    func twodriverActiveTrip(view : UIView, driverid: String, status : Bool){
        
        let url = ServiceApi.twodrivertype
        
        var params = Parameters()
        params["driverId"] = driverid
        params["status"] = status
       
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.successtwodriveractivetrip = Twodrivermodel.init(json: success)
            print("suucess:: \(self.successtwodriveractivetrip)")
        }, jsonError: { (jsonError) in
            
            self.errtwodriverActiveTrips = Twodrivermodel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    
}





