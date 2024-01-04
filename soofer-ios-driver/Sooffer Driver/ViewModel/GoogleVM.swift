//
//  GoogleVM.swift
//  RebuStar Rider
//
//  Created by Abservetech on 06/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class GoogleVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var getAddressList : GoogleAddressModel? {
        didSet {
            guard let address = getAddressList else {return}
            self.showAddressClosure?()
        }
    }
    
    var getAddressError : GoogleAddressModel? {
        didSet {
            guard let address = getAddressError else {return}
            showToast(msg: "\(address.status ?? "")!!! Try Again Later")
            self.errorAddressClosure?()
        }
    }
    
    var getDirection : GoogleDirection? {
        didSet {
            guard let driection = getDirection else {return}
            self.directionClosure?()
        }
    }
    
    var getDirectionError : GoogleDirection? {
        didSet {
            guard let drirection = getDirectionError else {return}
            showToast(msg: "\(drirection.status ?? "")!!! Try Again Later")
            self.errDirectionClouser?()
        }
    }
    
    var getAutoAddress : AutoAddressModel? {
        didSet {
            guard let driection = getAutoAddress else {return}
            self.autoCompleteClosure?()
        }
    }
    
    var getAutoAddressError : AutoAddressModel? {
        didSet {
            guard let drirection = getAutoAddressError else {return}
            showToast(msg: "\(drirection.status ?? "")!!! Try Again Later")
            self.errautoCompleteClouser?()
        }
    }
    
    //Mark :- Constructor
    init() { }
    
    init(view : UIView ,dataService : ApiRoot) {
        self.dataService = dataService
    }
    
    // MARK: - Closures for callback, since we are not using the ViewModel to the View.
    var errorinFetchData: (() -> ())?
    var showErrorAlertClosure: (() -> ())?
    var showAddressClosure : (() -> ())?
    var errorAddressClosure : (() -> ())?
    var directionClosure : (() -> ())?
    var errDirectionClouser : (() -> ())?
    var autoCompleteClosure : (() -> ())?
    var errautoCompleteClouser : (() -> ())?
    
    // MARK: - Network call
    func nearByLocation(input : String){
        let url = ServiceApi.googleNearbyAddr
        
        var params = Parameters()
        params["input"] = input
        params["key"] = Constant.googleAPiKey
        params["radius"] = "500"
        params["components"] = "country:\(Constant.countryCode)"
        UserDefaults.standard.set(true, forKey: "area")
        
        self.dataService?.getApiwithoutView( url: url, params: params, jsonSuccess: { (success) in
            
        }, jsonError: { (jsonError) in
            
        }, error: { (Error) in
            
        }, dataSuccess: { (responseData) in
            do{
                let jsoncodabledata = try JSONDecoder().decode(GoogleAddressModel.self, from: responseData)
                self.getAddressList = jsoncodabledata
            }catch let err{
                showToast(msg: err.localizedDescription ?? StringFile.timeouterror)
            }
        },dataError: { (errorData) in
            do{
                let jsoncodableerrordata = try JSONDecoder().decode(GoogleAddressModel.self, from: errorData)
                self.getAddressError = jsoncodableerrordata
            }catch let err{
                showToast(msg: err.localizedDescription ?? StringFile.timeouterror)
            }
        })
    }
    
    // MARK: - Network call
    func getPolylineTimeTravel(origin:String , destination : String,waypoints : String){
        let url = ServiceApi.googleDirection
        
        var params = Parameters()
        params["origin"] = origin
        params["key"] = Constant.googleAPiKey
        params["destination"] = destination
        params["alternatives"] = "true"
        params["mode"] = "driving"
        params["waypoints"] = waypoints
        
        self.dataService?.getApiwithoutView( url: url, params: params, jsonSuccess: { (success) in
            if GoogleDirection.init(json: success).status == "OK"{
                self.getDirection = GoogleDirection.init(json: success)
            }else{
                 self.getDirectionError = GoogleDirection.init(json: success)
            }
        }, jsonError: { (jsonError) in
            self.getDirectionError = GoogleDirection.init(json: jsonError)
        }, error: { (Error) in
            
        }, dataSuccess: { (responseData) in
           
        },dataError: { (errorData) in
            
        })
    }
    
    // MARK: - Network call
    func getautoCompleteText(view : UIView ,input:String , components : String , location : String){
        let url = ServiceApi.googleAutoComplete
        
        var params = Parameters()
        params["input"] = input
        params["key"] = Constant.googleAPiKey
        params["radius"] = "500"
        params["components"] = components
        params["location"] = location
        UserDefaults.standard.set(false, forKey: "area")
        
        self.dataService?.getApiwithoutView(url: url, params: params, jsonSuccess: { (success) in
            if success["status"] == "OK"{
                self.getAutoAddress = AutoAddressModel.init(json: success)
            }else{
                self.getAutoAddressError = AutoAddressModel.init(json: success)
            }
        }, jsonError: { (jsonError) in
            self.getDirectionError = GoogleDirection.init(json: jsonError)
        }, error: { (Error) in
            
        }, dataSuccess: { (responseData) in
            
        },dataError: { (errorData) in
            
        })
    }
}
