//
//  ManageVehicleVM.swift
//  RebuStar Driver
//
//  Created by Abservetech on 09/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class ManageVehicleVM{
    
    //Mark :- Data Declaraction
    var dataService : ApiRoot?
    
    var view : UIView?
    
    var error: Error? {
        didSet {
            guard let error = error else { return }
            self.showErrorAlertClosure?()
        }
    }
    
    
    var Vehicledatas : VehicleModel?{
        didSet{
            guard let vehicle = Vehicledatas else { return }
            self.getvehicleDatastClosure?()
        }
    }
    
    var vehicleNames : VehicleNameModels?{
        didSet{
            guard let vehicle = vehicleNames else { return }
            self.getvehicleNameClosure?()
        }
    }
    
    var errVehicledatas : VehicleModel?{
        didSet{
            guard let error = errVehicledatas else { return }
            showToast(msg: "Try again Later!!")
            self.errvehicleDatasClosure?()
        }
    }
    
    var VehicleList : ManageVehicleList?{
        didSet{
            guard let vehicle = VehicleList else { return }
            self.getVehicleList?()
        }
    }
    
    var errVehicleList : ManageVehicleList?{
        didSet{
            guard let vehicle = VehicleList else { return }
            showToast(msg: "Try again Later!!")
        }
    }
    
    var deleteVehicle : deleteVehicleModel?{
        didSet{
            guard let vehicle = VehicleList else { return }
            self.getVehicleList?()
        }
    }
    var errdeleteVehicle : deleteVehicleModel?{
        didSet{
            guard let vehicle = errdeleteVehicle else { return }
            showToast(msg: errdeleteVehicle?.message ?? "" + "Try again Later!!")
        }
    }
    
    var addVehicleList : ManageVehicleList?{
        didSet{
            guard let vehicle = addVehicleList else { return }
            self.getaddvehicleListClosure?()
        }
    }
    
    var erraddVehicleList : ManageVehicleList?{
        didSet{
            guard let vehicle = erraddVehicleList else { return }
            showToast(msg: erraddVehicleList?.message ?? "" + "Try again Later!!")
        }
    }
    
    var setCurrentTaxi : ManageVehicleList?{
        didSet{
            guard let vehicle = setCurrentTaxi else { return }
            self.setcurrentClosure?()
        }
    }
    var errCurrentTaxi : ManageVehicleList?{
        didSet{
            guard let vehicle = errCurrentTaxi else { return }
            showToast(msg: erraddVehicleList?.message ?? "" + "Try again Later!!")
        }
    }
    
    
    var uploaded : String? {
        didSet{
            guard let upload = uploaded else { return }
            self.setuploadedClosure?()
        }
    }
    
    var errupload : String? {
        didSet{
            guard let upload = errupload else { return }
            self.erruploadedClosure?()
            showToast(msg: " sorry cont upload ,Try again Later!!")
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
    var getvehicleListClosure: (()->())?
    var errvehicleListClosure : (() -> ())?
    var getvehicleDatastClosure: (()->())?
    var errvehicleDatasClosure : (() -> ())?
    var getvehicleNameClosure : (()->())?
    var getVehicleList : (()->())?
    var getaddvehicleListClosure: (()->())?
    var erraddvehicleListClosure : (() -> ())?
    var setcurrentClosure: (()->())?
    var errcurrentListClosure : (() -> ())?
    var setuploadedClosure: (()->())?
    var erruploadedClosure : (() -> ())?
    
    // MARK: - Network call
    func getVehicleList(view : UIView){
       
        let userid : String = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        
        let url = ServiceApi.drivertaxi+"/\(userid)"
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.VehicleList = ManageVehicleList.init(json: success)
        }, jsonError: { (jsonError) in
            self.errVehicleList = ManageVehicleList.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Network call
    func getCarandyearList(view : UIView ){
        let url = ServiceApi.carandyear
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.Vehicledatas = VehicleModel.init(json: success)
        }, jsonError: { (jsonError) in
            self.errVehicledatas = VehicleModel.init(json: jsonError)
            
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func getVhicletypelists(view : UIView ){
        let url = ServiceApi.vehicletypelists
        
        var params = Parameters()
        
        self.dataService?.getApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.vehicleNames = VehicleNameModels.init(json: success)
            print("VechileList",success)
        }, jsonError: { (jsonError) in
            self.vehicleNames = VehicleNameModels.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func addVehicle(view : UIView , makeid : String ,makename : String , model : String,year : String , licence : String , cpy : String ,driver : String , color : String , handicap : String , vehicletype : String , registrationnumber : String ){
       
        let userid : String = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        
        let url = ServiceApi.drivertaxi
        
        var params = Parameters()
        params["makeid"] = makeid
        params["makename"] = makename
        params["model"] = model
        params["year"] = year
        params["licence"] = licence
        params["cpy"] = cpy
        params["driver"] = userid
        params["color"] = color
        params["handicap"] = handicap
        params["vehicletype"] = registrationnumber
        params["registrationnumber"] = registrationnumber
        
        self.dataService?.postApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.addVehicleList = ManageVehicleList.init(json: success)
            print("VechileList",success)
        }, jsonError: { (jsonError) in
            self.erraddVehicleList = ManageVehicleList.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    func deleteVehicle(view : UIView ,id : String){
        
        let userid : String = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        
        let url = ServiceApi.drivertaxi
        
        var params = Parameters()
        params["makeid"] = id
        params["driverid"] = userid
        
        self.dataService?.deleteApi(view: view, url: url, params: params, jsonSuccess: { (success) in
                        self.deleteVehicle = deleteVehicleModel.init(json: success)
            print("VechileList",success)
        }, jsonError: { (jsonError) in
                        self.errdeleteVehicle = deleteVehicleModel.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func editVehicle(view : UIView , makeid : String ,makename : String , model : String,year : String , licence : String , cpy : String ,driver : String , color : String , handicap : String , vehicletype : String , registrationnumber : String ){
        
        let userid : String = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        
        let url = ServiceApi.drivertaxi
        
        var params = Parameters()
        params["makeid"] = makeid
        params["makename"] = makename
        params["model"] = model
        params["year"] = year
        params["licence"] = licence
        params["cpy"] = cpy
        params["driver"] = userid
        params["color"] = color
        params["handicap"] = handicap
        params["vehicletype"] = registrationnumber
        params["registrationnumber"] = registrationnumber
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.addVehicleList = ManageVehicleList.init(json: success)
            print("VechileList",success)
        }, jsonError: { (jsonError) in
            self.erraddVehicleList = ManageVehicleList.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    func setVurrectTaxi(view : UIView , makeid : String ,service : String ){
        
        let userid : String = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        
        let url = ServiceApi.setCurrentTaxi
        
        var params = Parameters()
        params["makeid"] = makeid
        params["service"] = service
        
        self.dataService?.putApi(view: view, url: url, params: params, jsonSuccess: { (success) in
            self.setCurrentTaxi = ManageVehicleList.init(json: success)
           
        }, jsonError: { (jsonError) in
            self.errCurrentTaxi = ManageVehicleList.init(json: jsonError)
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    
    // MARK: - Edit Profile With upload Images
    func editDoucs(view : UIView , image : UIImage ,filefor : String , driverid : String ,licenceexp : String,insuranceexp : String,dataSuccess : @escaping (String) -> ()){
        
        let url = ServiceApi.driverDocs
        
        var params = Parameters()
        params["filefor"] = filefor
        params["driverid"] = driverid
        params["expDate"] = licenceexp
         
//        if filefor.caseInsensitiveCompare("licence") == ComparisonResult.orderedSame {
//            params["licenceexp"] = licenceexp
//        }else if filefor.caseInsensitiveCompare("permit") == ComparisonResult.orderedSame{
//            params["expDate"] = licenceexp
//        }else if filefor.caseInsensitiveCompare("insurance") == ComparisonResult.orderedSame{
//            params["insuranceexp"] = insuranceexp
//        }else if filefor.caseInsensitiveCompare("registrationBack") == ComparisonResult.orderedSame {
//            params["registrationexpdate"] = licenceexp
//        }else {
//            params["licenceexp"] = ""
//            params["insuranceexp"] = ""
//        }
        
        self.dataService?.fileUploadPostApi(view: view, url: url, params: params, image: image, jsonSuccess: { (success) in
            self.uploaded = "success"
            dataSuccess("success")
        }, jsonError: { (jsonError) in
            self.errupload = "sorry"
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
    
    // MARK: - Edit Profile With upload Images
    func drivertaxiDoc(view : UIView , image : UIImage ,filefor : String , driverid : String ,licenceexp : String,insuranceexp : String,makeid : String,type : String,dataSuccess : @escaping (String) -> ()){
        
        let url = ServiceApi.driverTaxiDocs
        
        var params = Parameters()
        params["filefor"] = filefor
        params["driverId"] = driverid
//        if filefor.caseInsensitiveCompare("licence") == ComparisonResult.orderedSame {
//            params["licenceexp"] = licenceexp
//        }else if filefor.caseInsensitiveCompare("permit") == ComparisonResult.orderedSame{
//            params["expDate"] = licenceexp
//        }else if filefor.caseInsensitiveCompare("insurance") == ComparisonResult.orderedSame{
//            params["insuranceexp"] = insuranceexp
//        }else if filefor.caseInsensitiveCompare("registrationBack") == ComparisonResult.orderedSame {
//            params["registrationexpdate"] = licenceexp
//        }else {
//            params["licenceexp"] = ""
//            params["insuranceexp"] = ""
//        }
        params["makeId"] = makeid
        params["expDate"] = licenceexp
        
        
        self.dataService?.fileUploadPostApi(view: view, url: url, params: params, image: image, jsonSuccess: { (success) in
            dataSuccess("success")
            self.uploaded = "success"
        }, jsonError: { (jsonError) in
            self.errupload = "sorry"
        }, error: { (Error) in
            print("@@@Error" ,Error)
        }, dataSuccess: { (responseData) in
            print("@@@responseData" ,responseData)
        },dataError: { (errorData) in
            print("@@@errorData" ,errorData)
        })
    }
}


