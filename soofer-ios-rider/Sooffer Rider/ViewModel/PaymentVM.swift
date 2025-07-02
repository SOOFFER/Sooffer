//
//  PaymentVM.swift
//  RebuStar Rider
//
//  Created by Abservetech on 19/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON

class PaymentVM{
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var paymentReposne : PaymentModel?{
        didSet {
            guard let response = paymentReposne else { return }
            self.successcardadd?()
        }
    }
    var errpaymentReposne : PaymentModel?{
        didSet {
            guard let response = errpaymentReposne else { return }
            self.errorcardadd?()
            showToast(msg: self.errpaymentReposne?.message ?? "Try Again")
        }
    }
    
    var walletData :walletModel?{
        didSet {
            guard let response = walletData else { return }
            self.successwallet?()
        }
    }
    var errwalletData : walletModel?{
        didSet {
            guard let response = errwalletData else { return }
            self.errorwallet?()
            showToast(msg: self.errwalletData?.message ?? "Try Again")
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
            guard let trans = transactionList else {
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
    var successcardadd : (() -> ())?
    var errorcardadd : (() -> ())?
    var successwallet : (() -> ())?
    var errorwallet : (() -> ())?
    var successtranscartion : (() -> ())?
    var errtranscartion : (() -> ())?
  
    
    // MARK: - Network call
    func addCard(view : UIView , cardToken : String, Cardnumber: String){
        let url = ServiceApi.addCard
        print("Carnumber: \(Cardnumber)")
        var params = Parameters()
        params["cardToken"] = cardToken
        params["lastNum"] = Cardnumber
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.paymentReposne = PaymentModel.init(json: success)
            print("success:: \(success)")
        }, jsonError: { (jsonError) in
            self.errpaymentReposne = PaymentModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func addToMyWallet(view : UIView , rechargeAmount : String){
        let url = ServiceApi.addToMyWallet
        
        var params = Parameters()
        params["rechargeAmount"] = rechargeAmount
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
           self.walletData = walletModel.init(json: success)
        }, jsonError: { (jsonError) in
             self.errwalletData = walletModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func getMyWallet(view : UIView){
        let url = ServiceApi.myWallet
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.walletData = walletModel.init(json: success)
            Constant.walletMoney = self.walletData?.balance ?? "0"
        }, jsonError: { (jsonError) in
            self.errwalletData = walletModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func getTransactionList(view : UIView){
        let url = ServiceApi.myWalletHistory
        
        var params = Parameters()
        
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


