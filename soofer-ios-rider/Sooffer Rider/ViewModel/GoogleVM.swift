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
import GoogleMaps
import CoreTelephony

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
    
    var getAddressList : AutoAddressModel? {
        didSet {
            guard let address = getAddressList else {return}
            self.showAddressClosure?()
        }
    }
    
    var getAddressError : AutoAddressModel? {
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
            //   showToast(msg: "\(drirection.status ?? "")!!! Try Again Later")
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
            //  showToast(msg: "\(drirection.status ?? "")!!! Try Again Later")
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
    func nearByLocation(input : String , currectLoc : CLLocation,sessiontoken : String){
        
        if let countryCode = getCurrentCountryCode() {
            print("Current Country Code: \(countryCode.lowercased())")
            Constant.countryCode = countryCode.lowercased()
        } else {
            print("Country code not available.")
        }
        
        
        let url = ServiceApi.googleNearbyAddr
        
        var params = Parameters()
        params["input"] = input
        params["key"] = Constant.googleAPiKey
        params["radius"] = "500"
        params["components"] = "country:\(Constant.countryCode)"
        params["sessiontoken"] = sessiontoken
        params["location"] = "\(currectLoc.coordinate.latitude),\(currectLoc.coordinate.longitude)"
        UserDefaults.standard.set(true, forKey: "area")
        
        self.dataService?.getApiwithoutView( url: url, params: params, jsonSuccess: { (success) in
            if GoogleDirection.init(json: success).status == "OK"{
                self.getAddressList = AutoAddressModel.init(json: success)
            }else{
                self.getAddressError = AutoAddressModel.init(json: success)
            }
        }, jsonError: { (jsonError) in
            self.getAddressError = AutoAddressModel.init(json: jsonError)
        }, error: { (Error) in
            
        }, dataSuccess: { (responseData) in
            //            do{
            //                let jsoncodabledata = try JSONDecoder().decode(GoogleAddressModel.self, from: responseData)
            //                self.getAddressList = jsoncodabledata
            //            }catch let err{
            //                showToast(msg: err.localizedDescription ?? StringFile.timeouterror)
            //            }
        },dataError: { (errorData) in
            //            do{
            //                let jsoncodableerrordata = try JSONDecoder().decode(GoogleAddressModel.self, from: errorData)
            //                self.getAddressError = jsoncodableerrordata
            //            }catch let err{
            //                showToast(msg: err.localizedDescription ?? StringFile.timeouterror)
            //            }
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
    func getlatLangFromAddress(origin:String , address : String,latlang : @escaping(CLLocation) -> ()){
        let url = ServiceApi.googlelatAdd
        
        var params = Parameters()
        params["address"] = address
        params["key"] = Constant.googleAPiKey
        
        self.dataService?.getApiwithoutView( url: url, params: params, jsonSuccess: { (success) in
            if ReverseGeo.init(json: success).status == "OK"{
                
                let reversegeo : ReverseGeo = ReverseGeo.init(json: success)
                let location : CLLocation = CLLocation(latitude: reversegeo.reverseresults[0].geometry.location.lat, longitude:  reversegeo.reverseresults[0].geometry.location.lng)
                latlang(location)
            }else{
                showToast(msg: ReverseGeo.init(json: success).status ?? "!!! Try again")
            }
        }, jsonError: { (jsonError) in
            showToast(msg: ReverseGeo.init(json: jsonError).status ?? "!!! Try again")
        }, error: { (Error) in
            
        }, dataSuccess: { (responseData) in
            
        },dataError: { (errorData) in
            
        })
    }
    // MARK: - Network call
    func getAddressFromlatLang(origin:String , latlang : CLLocation,address : @escaping(String) -> ()){
        let url = ServiceApi.googlelatAdd
        var gotAddress : Bool = false
        var params = Parameters()
        UserDefaults.standard.set(true, forKey: "area")
        
        params["latlng"] = "\(latlang.coordinate.latitude.description),\(latlang.coordinate.longitude.description)"
        params["key"] = Constant.googleAPiKey
        
        self.dataService?.getApiwithoutView( url: url, params: params, jsonSuccess: { (success) in
            if ReverseGeo.init(json: success).status == "OK"{
              let reversegeo : ReverseGeo = ReverseGeo.init(json: success)
              for value in 0...reversegeo.reverseresults.count - 1{
                if reversegeo.reverseresults[value].addressComponents.count > 0{
                  for i in 0...reversegeo.reverseresults[value].addressComponents.count - 1{
                    if reversegeo.reverseresults[value].addressComponents[i].types.contains("country"){
                      Constant.countryCode = reversegeo.reverseresults[value].addressComponents[i].short_name.lowercased()
                      print("countrycountrycountrycountrycountry@@@@@@",reversegeo.reverseresults[value].addressComponents[i].short_name, reversegeo.reverseresults[value].addressComponents[i].long_name)
                    }
                  }
                }
                if reversegeo.reverseresults[value].geometry.location_type == "ROOFTOP" {
                  let location : String = reversegeo.reverseresults[value].formatted_address.description
                  address(location)
                } else if reversegeo.reverseresults[value].geometry.location_type == "RANGE_INTERPOLATED"{
                  let location : String = reversegeo.reverseresults[0].formatted_address.description
                  address(location)
                }
              }
//            } else {
//                if !gotAddress{
//                    let location : String = reversegeo.reverseresults[0].formatted_address.description ?? ""
//                    address(location)
//                    gotAddress = true
//                }
//                if reversegeo.reverseresults[value].geometry.location_type == "ROOFTOP" {
//                    let location : String = reversegeo.reverseresults[value].formatted_address.description ?? ""
//                    address(location)
//                    gotAddress = true
//                }else  if reversegeo.reverseresults[value].geometry.location_type == "RANGE_INTERPOLATED"{
//                    let location : String = reversegeo.reverseresults[value].formatted_address.description ?? ""
//                    address(location)
//                    gotAddress = true
//                }
                
            }else{
                showToast(msg: ReverseGeo.init(json: success).status ?? "!!! Try again")
            }
        }, jsonError: { (jsonError) in
            showToast(msg: ReverseGeo.init(json: jsonError).status ?? "!!! Try again")
        }, error: { (Error) in
            
        }, dataSuccess: { (responseData) in
            
        },dataError: { (errorData) in
            
        })
    }
    
    // MARK: - Network call
    func getautoCompleteText(view : UIView ,input:String , components : String , location : String,sessiontoken : String){
        
        if let countryCode = getCurrentCountryCode() {
            print("Current Country Code: \(countryCode.lowercased())")
            Constant.countryCode = countryCode.lowercased()
        } else {
            print("Country code not available.")
        }
        
        let url = ServiceApi.googleAutoComplete /*+ "strictbounds"*/
        
        var params = Parameters()
        params["input"] = input
        params["key"] = Constant.googleAPiKey
        params["radius"] = "500"
//        params["offset"] = "3"
        params["components"] = components
        params["location"] = location
        params["sessiontoken"] = sessiontoken
        params["components"] = "country:\(Constant.countryCode)"
//        params["origin"] = location
//        params["types"] = "Query Autocomplete"
        UserDefaults.standard.set(true, forKey: "area")
        
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
    
    func getCurrentCountryCode() -> String? {
        if let countryCode = Locale.current.regionCode {
            return countryCode
        }
        return nil
    }

}
