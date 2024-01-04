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
            showToast(msg: "\(favaddr.message)!!!")
        }
    }
    var errFavAddr : FavAddrModel?{
        didSet{
            guard let error = errFavAddr else { return }
            self.errFavAddrClosure?()
            showToast(msg: "\(error.message)!!! Try Again Later")
            
        }
    }
    
    var payoutData : FavAddrModel?{
        didSet{
            guard let favaddr = payoutData else { return }
            self.successPayoutClosure?()
            showToast(msg: "\(favaddr.message)!!!")
        }
    }
    var errPayoutData : FavAddrModel?{
        didSet{
            guard let error = errPayoutData else { return }
            self.errPayoutClosure?()
            showToast(msg: "\(error.message)!!! Try Again Later")
            
        }
    }
    
    
    var transactionList : TransactionModel?{
    didSet{
            guard let trans = transactionList else {
                return
            }
            self.successtranscartion?()
        }
    }
    
    var errtransactionList : TransactionModel?{
        didSet{
            guard let trans = errtransactionList else {
                return
            }
            self.errtranscartion?()
            showToast(msg: self.errtransactionList?.message ?? "Try Again")
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
    var successPayoutClosure : (()->())?
    var errPayoutClosure : ( () -> () )?
    var successtranscartion : (() -> ())?
    var errtranscartion : (() -> ())?
    
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
    func payoutApi(view : UIView, amount : String){
        let url = ServiceApi.driverRequestPayoutTransferAmount
        
        var params = Parameters()
        params["amount"] = amount
        params["description"] = "Amount to payout"
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.payoutData = FavAddrModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errPayoutData = FavAddrModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    // MARK: - Network call
    func getTransactionList(view : UIView,_page : String , _limit : String){
        let url = ServiceApi.myWalletHistory
        
        var params = Parameters()
        params["_page"] = _page
        params["_limit"] = _limit
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.transactionList = TransactionModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errtransactionList = TransactionModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
}


