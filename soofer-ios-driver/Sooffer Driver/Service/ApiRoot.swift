//
//  ApiRoot.swift
//  RebuStar Rider
//
//  Created by Abservetech on 06/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON

class ApiRoot{
    
    
    //MARK :- get api calling
    func getApi(view : UIView , url : String , params : Parameters, jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> (),dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
        ShowMsginWindow.instanse.LoadingShow(view: view)
        if  NetworkReachabilityManager()!.isReachable {
            guard let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String else{
                return
            }
            
            let header : HTTPHeaders = [
                "x-access-token" : AccessToken
            ]
            Alamofire.request(url, method: .get,parameters: params, encoding: URLEncoding.default, headers: header).responseJSON { (jsonResponse) in
                ShowMsginWindow.instanse.LoadingHide(view: view)
                
                print("+++++>>>>Req_Res>>",url ,params, jsonResponse.result.value)
                
                switch jsonResponse.response?.statusCode {
                case 200:
                    let success = JSON(jsonResponse.result.value)
                
                        jsonSuccess(success)
                        dataSuccess(jsonResponse.data!)
                   
                default:
                    let error = JSON(jsonResponse.result.value)
                    jsonError(error)
                    dataError(jsonResponse.data!)
                }
            }
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: view)
            showInternetError(view: view)
        }
    }
    
    //MARK :- get api calling
    func getApiwithoutView( url : String , params : Parameters, jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> (),dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
        if  NetworkReachabilityManager()!.isReachable {
            var header : HTTPHeaders = [:]
            if let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String {
                if UserDefaults.standard.bool(forKey: "area"){
                    header = [ "x-access-token" : AccessToken,"x-ios-bundle-identifier" : "com.Sooffer.Rider1"]
                }
                else{
                    header = [ "x-access-token" : AccessToken]
                }
            }else{
            }
            
         
            
     //       print("+++++>>>>Req_api>>",url ,params,header)
            
            Alamofire.request(url, method: .get,parameters: params, encoding: URLEncoding.default, headers: header).responseJSON { (jsonResponse) in
                
                print("+++++>>>>Req_Res>>",url ,params,header, jsonResponse.result.value)
                
                switch jsonResponse.response?.statusCode {
                case 200:
                    let success = JSON(jsonResponse.result.value)
                        jsonSuccess(success)
                        dataSuccess(jsonResponse.data!)
                    
                default:
                    let error = JSON(jsonResponse.result.value)
                    jsonError(error)
                    dataError(jsonResponse.data!)
                }
            }
        }else{
//          ShowMsginWindow.instanse.LoadingHide()
          showToast(msg: StringFile.networkerror)
        }
    }
    
    //MARK :- get api calling
    func postApi(view : UIView ,url : String , params : Parameters , jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
        ShowMsginWindow.instanse.LoadingShow(view: view)
        var header : HTTPHeaders = [:]
        if  NetworkReachabilityManager()!.isReachable {
            if let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String {
                header = ["x-access-token" : AccessToken]
            }else{
                header = [:]
            }

            print("------>>>Req_apicall",url,params,header)
            
            Alamofire.request(url, method: .post, parameters: params, encoding: URLEncoding.default, headers: header).responseJSON { (jsonResponse) in
                ShowMsginWindow.instanse.LoadingHide(view: view)
                print("+++++>>>>Req_Res>>",jsonResponse.result.value)
                switch jsonResponse.response?.statusCode {
                case 200:
                    let success = JSON(jsonResponse.result.value)
                    jsonSuccess(success)
                    dataSuccess(jsonResponse.data!)
                default:
                    let error = JSON(jsonResponse.result.value)
                    jsonError(error)
                    dataError(jsonResponse.data!)
               }
            }
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: view)
            showInternetError(view: view)
        }
    }
    
    //MARK :- patch api calling
    func patchApi(view : UIView ,url : String , params : Parameters , jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
        ShowMsginWindow.instanse.LoadingShow(view: view)
        var header : HTTPHeaders = [:]
        if  NetworkReachabilityManager()!.isReachable {
            if let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String {
                header = ["x-access-token" : AccessToken]
            }else{
                header = [:]
            }
            
            print("------>>>Req_apicall",url,params,header)
            
            Alamofire.request(url, method: .patch, parameters: params, encoding: URLEncoding.default, headers: header).responseJSON { (jsonResponse) in
                ShowMsginWindow.instanse.LoadingHide(view: view)
                print("+++++>>>>Req_Res>>",jsonResponse.result.value)
                switch jsonResponse.response?.statusCode {
                case 200:
                    let success = JSON(jsonResponse.result.value)
                    jsonSuccess(success)
                    dataSuccess(jsonResponse.data!)
                default:
                    let error = JSON(jsonResponse.result.value)
                    jsonError(error)
                    dataError(jsonResponse.data!)
                }
            }
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: view)
            showInternetError(view: view)
        }
    }
    //MARK :- get api calling
    func fileUploadPostApi(view : UIView ,url : String , params : Parameters ,image: UIImage, jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
       
        ShowMsginWindow.instanse.LoadingShow(view: view)
        
        if  NetworkReachabilityManager()!.isReachable {
            guard let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String else{
                return
            }
            
            let header : HTTPHeaders = [
                "x-access-token" : AccessToken
            ]
            var imageData = NSData()
            if let images : UIImage = image as? UIImage{
                imageData = image.jpegData(compressionQuality: 0.5) as? NSData ?? NSData()
            }
            print("image:::::", image)
            Alamofire.upload(multipartFormData: { (multipartFormData) in
                
                if  let imgData = image.jpegData(compressionQuality: 0.75) {
                    multipartFormData.append(imgData, withName: "fileFront", fileName: "file.jpeg", mimeType: "image/jpeg")
                    for (key, val) in params {
                        multipartFormData.append((val as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
                    }
                }else{
                    for (key, val) in params {
                        multipartFormData.append((val as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
                    }
                }
            }, usingThreshold: UInt64.init(), to: url, method: .post, headers: header, encodingCompletion: { encodingResult in
               
                ShowMsginWindow.instanse.LoadingHide(view: view)
                switch encodingResult {
                case .success(let upload, _, _):
                    upload.responseJSON { response in
                        let json = JSON(response.result.value)
                        jsonSuccess(json)
                        print("+++++>>>>Req_Res>>",url,params,header,response.result.value)
                        
//                        dataSuccess(response.data!)
                    }
                case .failure(let _):
                    showToast(msg: StringFile.err_upload)
                    print("+++++>>>>sorry>>",url,params,header,StringFile.err_upload)
                }
            })
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: view)
            showInternetError(view: view)
        }
    }
    
    func fileUploadPostApi1(view : UIView ,url : String , params : Parameters ,image: UIImage, jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
       
        ShowMsginWindow.instanse.LoadingShow(view: view)
        
        if  NetworkReachabilityManager()!.isReachable {
            guard let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String else{
                return
            }
            
            let header : HTTPHeaders = [
                "x-access-token" : AccessToken
            ]
            var imageData = NSData()
            if let images : UIImage = image as? UIImage{
                imageData = image.jpegData(compressionQuality: 0.5) as? NSData ?? NSData()
            }
            print("image:::::", image)
            Alamofire.upload(multipartFormData: { (multipartFormData) in
                
                if  let imgData = image.jpegData(compressionQuality: 0.75) {
                    multipartFormData.append(imgData, withName: "identityImg", fileName: "file.jpeg", mimeType: "image/jpeg")
                    for (key, val) in params {
                        multipartFormData.append((val as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
                    }
                }else{
                    for (key, val) in params {
                        multipartFormData.append((val as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
                    }
                }
            }, usingThreshold: UInt64.init(), to: url, method: .post, headers: header, encodingCompletion: { encodingResult in
               
                ShowMsginWindow.instanse.LoadingHide(view: view)
                switch encodingResult {
                case .success(let upload, _, _):
                    upload.responseJSON { response in
                        let json = JSON(response.result.value)
                        jsonSuccess(json)
                        print("+++++>>>>Req_Res>>",url,params,header,response.result.value)
                        
//                        dataSuccess(response.data!)
                    }
                case .failure(let _):
                    showToast(msg: StringFile.err_upload)
                    print("+++++>>>>sorry>>",url,params,header,StringFile.err_upload)
                }
            })
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: view)
            showInternetError(view: view)
        }
    }
    
    
    func uploadApi(view : UIView ,url : String , params : [[String: Any]], jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ) {
        if NetworkReachabilityManager()!.isReachable {
            guard let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String else{
                return
            }
            let header : HTTPHeaders = [
                "x-access-token" : AccessToken
            ]
            Alamofire.upload(multipartFormData: { response in
                for multiple in params {
                    for (key, val) in multiple {
                        if let data = val as? Data {
                            response.append(data, withName: key)
                        } else if let img = val as? UIImage {
                            let data = img.jpegData(compressionQuality: 0.5)!
                            response.append(data, withName: key, fileName: "some.jpg", mimeType: "images/jpeg")
                        }
                    }
                }
            }, usingThreshold: UInt64.init(), to: url, method: .post, headers: header, encodingCompletion: { encodingResult in
                ShowMsginWindow.instanse.LoadingHide(view: view)
                
                switch encodingResult {
                 case .success(let upload, _, _):
                    upload.validate(statusCode: 200..<500)
                    upload.responseJSON { (result) in
                        guard result.result.isSuccess, let value = result.result.value else {
                            return
                        }
                        let successData = JSON(value)
                        jsonSuccess(successData)
                        print("dvgchsvdhjv:::: \(successData)")
                    }
                case .failure(let error):
                    print("vbsjhbdh: \(error)")
                    let err = JSON(error)
                    jsonError(err)
                }
            })
        }
    }
    
    //MARK :- uploadimage
    func fileUploadPutApi(view : UIView ,url : String , params : Parameters ,image: UIImage, jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
        
        ShowMsginWindow.instanse.LoadingShow(view: view)
        
        if  NetworkReachabilityManager()!.isReachable {
            guard let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String else{
                return
            }
            
            let header : HTTPHeaders = [
                "x-access-token" : AccessToken
            ]
            var imageData = NSData()
            if let images : UIImage = image as? UIImage{
                imageData = image.jpegData(compressionQuality: 0.5) as? NSData ?? NSData()
            }
            
            Alamofire.upload(multipartFormData: { (multipartFormData) in
                
                if  let imgData = image.jpegData(compressionQuality: 0.75) {
                    multipartFormData.append(imgData, withName: "file", fileName: "file.jpeg", mimeType: "image/jpeg")
                    for (key, val) in params {
                        multipartFormData.append((val as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
                    }
                }else{
                    for (key, val) in params {
                        multipartFormData.append((val as AnyObject).data(using: String.Encoding.utf8.rawValue)!, withName: key)
                    }
                }
            }, usingThreshold: UInt64.init(), to: url, method: .put, headers: header, encodingCompletion: { encodingResult in
                
                ShowMsginWindow.instanse.LoadingHide(view: view)
                switch encodingResult {
                case .success(let upload, _, _):
                    upload.responseJSON { response in
                        let json = JSON(response.result.value)
                        jsonSuccess(json)
                        print("+++++>>>>Req_Res>>",url,params,header,response.result.value)
                        
                        //                        dataSuccess(response.data!)
                    }
                case .failure(let _):
                    showToast(msg: StringFile.err_upload)
                    print("+++++>>>>sorry>>",url,params,header,StringFile.err_upload)
                }
            })
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: view)
            showInternetError(view: view)
        }
    }
    
    //MARK :- delete api calling
    func deleteApi(view : UIView ,url : String , params : Parameters , jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
        ShowMsginWindow.instanse.LoadingShow(view: view)
        var header : HTTPHeaders = [:]
        if  NetworkReachabilityManager()!.isReachable {
            if let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String {
                header = ["x-access-token" : AccessToken]
            }else{
                header = [:]
            }
            
            print("------>>>Req_apicall",url,params,header)
            
            Alamofire.request(url, method: .delete, parameters: params, encoding: JSONEncoding.default, headers: header).responseJSON { (jsonResponse) in
                ShowMsginWindow.instanse.LoadingHide(view: view)
                print("+++++>>>>Req_Res>>",jsonResponse.result.value)
                switch jsonResponse.response?.statusCode {
                case 200:
                    let success = JSON(jsonResponse.result.value)
                    jsonSuccess(success)
                    dataSuccess(jsonResponse.data!)
                default:
                    let error = JSON(jsonResponse.result.value)
                    jsonError(error)
                    dataError(jsonResponse.data!)
                }
            }
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: view)
            showInternetError(view: view)
        }
    }
    
    //MARK :- get api calling
    func putApi(view : UIView ,url : String , params : Parameters , jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
        ShowMsginWindow.instanse.LoadingShow(view: view)
        var header : HTTPHeaders = [:]
        if  NetworkReachabilityManager()!.isReachable {
            if let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String {
                header = ["x-access-token" : AccessToken]
            }else{
                header = [:]
            }
            
            print("------>>>Req_apicall",url,params,header)
            
            Alamofire.request(url, method: .put, parameters: params, encoding: URLEncoding.default, headers: header).responseJSON { (jsonResponse) in
                ShowMsginWindow.instanse.LoadingHide(view: view)
                print("+++++>>>>Req_Res>>",jsonResponse.result.value)
                switch jsonResponse.response?.statusCode {
                case 200:
                    let success = JSON(jsonResponse.result.value)
                    jsonSuccess(success)
                    dataSuccess(jsonResponse.data!)
                default:
                    let error = JSON(jsonResponse.result.value)
                    jsonError(error)
                    dataError(jsonResponse.data!)
                }
            }
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: view)
            showInternetError(view: view)
        }
    }
    
    func putLocApi(url : String , params : Parameters , jsonSuccess : @escaping (JSON) -> (), jsonError : @escaping (JSON) -> () , error : @escaping (Error) -> () ,dataSuccess : @escaping (Data) -> (),dataError : @escaping (Data) -> () ){
        var header : HTTPHeaders = [:]
        if  NetworkReachabilityManager()!.isReachable {
            if let AccessToken = UserDefaults.standard.value(forKey: UserDefaultsKey.token) as? String {
                header = ["x-access-token" : AccessToken]
            }else{
                header = [:]
            }
            
            print("------>>>Req_apicall",url,params,header)
            
            Alamofire.request(url, method: .put, parameters: params, encoding: URLEncoding.default, headers: header).responseJSON { (jsonResponse) in
           
                print("+++++>>>>Req_Res>>",jsonResponse.result.value)
                switch jsonResponse.response?.statusCode {
                case 200:
                    let success = JSON(jsonResponse.result.value)
                    jsonSuccess(success)
                    dataSuccess(jsonResponse.data!)
                default:
                    let error = JSON(jsonResponse.result.value)
                    jsonError(error)
                    dataError(jsonResponse.data!)
                }
            }
        }else{
            showToast(msg: "Poor internet connection, Check your Internet Connection")
        }
    }
}
