//
//  CommonVM.swift
//  RebuStar Rider
//
//  Created by Abservetech on 23/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class CommonVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var EmegencyList : EmergencyModel?{
        didSet{
            guard let emegncy = EmegencyList else { return }
            self.successContects?()
        }
    }
    var errEmegency : EmergencyModel?{
        didSet{
            guard let emegncy = errEmegency else { return }
            self.errorContects?()
            showToast(msg: "\("Cont add this number ")!!! Try Again Later")
            
        }
    }
    
    var errDeleteEmergency : String?{
        didSet{
            guard let emegncy = errEmegency else { return }
            self.errsDeleteContects?()
            showToast(msg: "\(errDeleteEmergency)!!! Try Again Later")
        }
    }
    
    var favAddrList : FavAddrModel?{
        didSet{
            guard let favaddr = favAddrList else { return }
            self.successFavAddr?()
//            showToast(msg: "\(favaddr.message)!!!")
        }
    }
    var errFavAddr : FavAddrModel?{
        didSet{
            guard let error = errFavAddr else { return }
            self.errFavAddrClosure?()
            showToast(msg: "\(error.message)!!! Try Again Later")
            
        }
    }
    
    var offerList : OfferModel?{
        didSet{
            guard let offer = offerList else { return }
            self.successOffer?()
        }
    }
    var errofferList : OfferModel?{
        didSet{
            guard let error = errofferList else { return }
            self.errFavAddrClosure?()
            showToast(msg: "!!! Try Again Later")
            
        }
    }
    var submitquery : String?{
        didSet{
            guard let query = submitquery else { return }
            self.submitquerys?()
            showToast(msg: "Message Sended successfully")
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
    var successContects : (() -> ())?
    var errorContects : (() -> ())?
    var successAddContects : (() -> ())?
    var errorAddContects : (() -> ())?
    var successDeleteContects : (() -> ())?
    var errsDeleteContects : (() -> ())?
    var successFavAddr : (()->())?
    var errFavAddrClosure : ( () -> () )?
    
    var successOffer : (()->())?
    var errOffer : ( () -> () )?
    var submitquerys : ( () -> () )?
    
    // MARK: - Network call
    func getEmgContectsList(view : UIView ){
        let url = ServiceApi.emerygencyList
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.EmegencyList = EmergencyModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errEmegency = EmergencyModel.init(json: jsonError)
            
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func addEmgContectsList(view : UIView , name : String , number : String){
        let url = ServiceApi.emerygencyList
        
        var params = Parameters()
        params["name"] = name
        params["number"] = number
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.EmegencyList = EmergencyModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errEmegency = EmergencyModel.init(json: jsonError)
            
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func deleteEmgContectsList(view : UIView , emgContactId : String){
        let url = ServiceApi.emerygencyList
        
        var params = Parameters()
        params["emgContactId"] = emgContactId
        
        self.dataService?.deleteApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.EmegencyList = EmergencyModel.init(json: success["contacts"])
            
        }, jsonError: { (jsonError) in
            self.errDeleteEmergency = jsonError["message"] as? String ?? ""
            
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    
    // MARK: - Network call
    func getFavAddrList(view : UIView ){
        let url = ServiceApi.favAddress
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.favAddrList = FavAddrModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errFavAddr = FavAddrModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func getOfferList(view : UIView ){
        let url = ServiceApi.offersList
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.offerList = OfferModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errofferList = OfferModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func addFavAddrList(view : UIView , name : String , address : String , lat : String , lng : String){
        let url = ServiceApi.favAddress
        
        var params = Parameters()
        params["for"] = name
        params["address"] = address
        params["lat"] = lat
        params["lng"] = lng
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.favAddrList = FavAddrModel.init(json: success)
            
        }, jsonError: { (jsonError) in
            self.errFavAddr = FavAddrModel.init(json: jsonError)
            
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func deleteFavAddrList(view : UIView , emgContactId : String){
        let url = "\(ServiceApi.favAddress)/\(emgContactId)"
        
        var params = Parameters()
        
        self.dataService?.deleteApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            
        }, jsonError: { (jsonError) in
            
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func submitQuert(view : UIView , subject : String,query : String){
        let url = ServiceApi.contactUs
        
        var params = Parameters()
        params["subject"] = subject
        params["message"] = query
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.submitquery = success["message"] as? String ?? ""
        }, jsonError: { (jsonError) in
            
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
}


