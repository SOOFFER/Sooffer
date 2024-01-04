//
//  RatingVM.swift
//  RebuStar Driver
//
//  Created by Abservetech on 09/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import UIKit
import SwiftyJSON
import Alamofire

class RatingVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    var rating : Rating?{
        didSet{
            guard let vechile = rating else { return }
            self.getRatingClosure?()
        }
    }
    var errRating : Rating?{
        didSet{
            guard let error = errRating else { return }
            showToast(msg: "Try again Later!!")
        }
    }
 
    var feedback : FeedBack?{
        didSet{
            guard let feedbacks = self.feedback else {
                return
            }
            self.getFeedBackClosuer?()
        }
    }
    
    var errfeedback : FeedBack?{
        didSet{
            guard let feedbacks = self.errfeedback else {
                return
            }
            self.errFeedBackClosuer?()
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
    var getRatingClosure: (()->())?
    var errRatingClosure : (() -> ())?
    var getFeedBackClosuer : (() -> ())?
    var errFeedBackClosuer : (() -> ())?
    
    
    // MARK: - Network call
    func getRatingList(view : UIView ){
        let url = ServiceApi.rating
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.rating = Rating.init(json: success[0])
        }, jsonError: { (jsonError) in
            self.errRating = Rating.init(json: jsonError[0])
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func getFeedBAckList(view : UIView ){
        let url = ServiceApi.feedbackLists
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.feedback = FeedBack.init(json: success)
        }, jsonError: { (jsonError) in
            self.errfeedback = FeedBack.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
}




