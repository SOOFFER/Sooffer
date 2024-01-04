//
//  AddVechileVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 11/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import SkyFloatingLabelTextField
import DropDown

class AddVechileVC: UIViewController {
    
    // UI declaraction
    
    @IBOutlet weak var makeBtn: UIButton!
    
    @IBOutlet weak var modelBtn: UIButton!
    
    @IBOutlet weak var colorBtn: UIButton!
    @IBOutlet weak var YearBtn: UIButton!
    @IBOutlet weak var linceBtn: UIButton!
    @IBOutlet weak var vehicleBtn: UIButton!
    @IBOutlet weak var submitBtn: UIButton!
    
    @IBOutlet weak var makeTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var modelTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var yearTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var colorTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var licenseTXF: SkyFloatingLabelTextField!
    @IBOutlet weak var vehiclenameTXF: SkyFloatingLabelTextField!
    
    
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    
    var nameDrop =  DropDown()
    var modelDrop = DropDown()
    var yearDrop = DropDown()
    var vehicleDrop = DropDown()
    var ColorDrop = DropDown()
    
    
    var nameArray : [String] = []
    var makeidArray : [String] = []
    var yearArray : [String] = []
    var modelArray : [String] = []
    var VehicleArray : [String] = []
    var ColorArray : [String] = []
    var makeid : String = ""
    var pageFor : String = ""
    var pageFrom : String = ""
    var taxiData : Taxis = Taxis()
    
    var vehicleVM = ManageVehicleVM()
    var profile = ProfileVM()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
        self.makeModelList()
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.vehicleVM = ManageVehicleVM(dataService: ApiRoot())
        profile = ProfileVM(dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupData()
    }
    
    func setupView(){
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "add_vech"))
        
        self.navigationItem.leftBarButtonItem = nil
        self.makeTXF.withImage(direction: .Right, image: UIImage(named: "down-arrow") ?? UIImage(), colorSeparator: UIColor.clear, colorBorder: UIColor.clear)
        self.modelTXF.withImage(direction: .Right, image: UIImage(named: "down-arrow") ?? UIImage(), colorSeparator: UIColor.clear, colorBorder: UIColor.clear)
        self.yearTXF.withImage(direction: .Right, image: UIImage(named: "down-arrow") ?? UIImage(), colorSeparator: UIColor.clear, colorBorder: UIColor.clear)
        self.vehiclenameTXF.withImage(direction: .Right, image: UIImage(named: "down-arrow") ?? UIImage(), colorSeparator: UIColor.clear, colorBorder: UIColor.clear)
        self.colorTXF.withImage(direction: .Right, image: UIImage(named: "down-arrow") ?? UIImage(), colorSeparator: UIColor.clear, colorBorder: UIColor.clear)
        //self.colorBtn.isHidden = true
        //self.colorTXF.isUserInteractionEnabled = true
        self.linceBtn.isHidden = true
        self.licenseTXF.isUserInteractionEnabled = true
        self.vehicleBtn.isHidden = false
        self.vehiclenameTXF.isUserInteractionEnabled = false
        
    }
    
    func setupData(){
        if self.pageFor == "edit"{
            if let taxidata : Taxis = self.taxiData as? Taxis{
                self.makeTXF.text = taxidata.makename
                self.modelTXF.text = taxidata.model
                self.yearTXF.text = taxidata.year
                self.colorTXF.text = taxidata.color
                self.licenseTXF.text = taxidata.licence
                self.vehiclenameTXF.text = taxidata.vehicletype
                self.makeid = taxidata._id
            }
        }
    }
    
    @objc func addVehicle(){
        
    }
    
    func setupAction(){
        self.makeBtn.addAction(for: .tap) {
            self.nameDrop.anchorView = self.makeTXF
            self.nameDrop.direction = .bottom
            self.nameDrop.dataSource = self.nameArray
            self.nameDrop.selectionAction = { [unowned self] (index: Int, item: String) in
                self.makeTXF.text = item
                self.makeid = self.makeidArray[index]
                print("Makeisisis",self.makeidArray)
                for i in 0..<self.nameArray.count
                {
                    let name = self.nameArray[i] as? String ?? ""
                    if item == name
                    {
                        self.modelTXF.text = ""
                        let arr = self.vehicleVM.Vehicledatas?.carmake[0].datas[i].model
                        self.modelArray = arr as? [String] ?? [String]()
                    }
                }
            }
            self.nameDrop.show()
        }
        self.modelBtn.addAction(for: .tap) {
            self.modelDrop.anchorView = self.modelTXF
            self.modelDrop.direction = .bottom
            self.modelDrop.dataSource = self.modelArray
            self.modelDrop.selectionAction = { [unowned self] (index: Int, item: String) in
                self.modelTXF.text = item
            }
            self.modelDrop.show()
        }
        self.YearBtn.addAction(for: .tap) {
            self.yearDrop.anchorView = self.yearTXF
            self.yearDrop.direction = .bottom
            self.yearDrop.dataSource = self.yearArray
            self.yearDrop.selectionAction = { [unowned self] (index: Int, item: String) in
                self.yearTXF.text = item
            }
            self.yearDrop.show()
        }
        self.vehicleBtn.addAction(for: .tap) {
            self.vehicleDrop.anchorView = self.vehiclenameTXF
            self.vehicleDrop.direction = .bottom
            self.vehicleDrop.dataSource = self.VehicleArray
            self.vehicleDrop.selectionAction = { [unowned self] (index: Int, item: String) in
                self.vehiclenameTXF.text = item
            }
            self.vehicleDrop.show()
        }
        self.colorBtn.addAction(for: .tap) {
            self.ColorDrop.anchorView = self.colorTXF
            self.ColorDrop.direction = .bottom
            self.ColorDrop.dataSource = self.ColorArray
            self.ColorDrop.selectionAction = { [unowned self] (index: Int, item: String) in
                self.colorTXF.text = item
            }
            self.ColorDrop.show()
        }
        
        self.submitBtn.addAction(for: .tap) {
            let make : String = self.makeTXF.text ?? ""
            let model : String = self.modelTXF.text  ?? ""
            let lincense : String = self.licenseTXF.text ?? ""
            let year : String = self.yearTXF.text ?? ""
            let color : String = self.colorTXF.text ?? ""
            let registration : String = self.vehiclenameTXF.text ?? ""
            
            
            //firest name
            if !make.isEmpty{
                self.setTextfieldApperance(textfild: self.makeTXF, title: self.Localize.stringForKey(key: "make"), color: UIColor(named: "AppColor")!, isError: false)
                
                if !model.isEmpty{
                    self.setTextfieldApperance(textfild: self.modelTXF, title: self.Localize.stringForKey(key: "model"), color: UIColor(named: "AppColor")!, isError: false)
                    if !year.isEmpty{
                        self.setTextfieldApperance(textfild: self.yearTXF, title: self.Localize.stringForKey(key: "year"), color: UIColor(named: "AppColor")!, isError: false)
                        if !color.isEmpty{
                            self.setTextfieldApperance(textfild: self.colorTXF, title: self.Localize.stringForKey(key: "color"), color: UIColor(named: "AppColor")!, isError: false)
                            
                            if !lincense.isEmpty{
                                self.setTextfieldApperance(textfild: self.licenseTXF, title: self.Localize.stringForKey(key: "license_plate"), color: UIColor(named: "AppColor")!, isError: false)
                                
                                if !registration.isEmpty{
                                    self.setTextfieldApperance(textfild: self.vehiclenameTXF, title: self.Localize.stringForKey(key: "reg_num"), color: UIColor(named: "AppColor")!, isError: false)
                                    if self.pageFor == "edit"{
                                        if let taxidata : Taxis = self.taxiData as? Taxis{
                                            
                                            self.editVehicleData(view: self.view, makeid: self.makeid, makename: self.makeTXF.text ?? "", model: self.modelTXF.text ?? "", year: self.yearTXF.text ?? "", licence: self.licenseTXF.text ?? "", cpy: "", driver: "", color: self.colorTXF.text ?? "", handicap: "false", vehicletype: self.vehiclenameTXF.text ?? "", registrationnumber: self.vehiclenameTXF.text ?? "")
                                        }
                                    }else{
                                        
                                        self.addVehicleData(view: self.view, makeid: self.makeid, makename: self.makeTXF.text ?? "", model: self.modelTXF.text ?? "", year: self.yearTXF.text ?? "", licence: self.licenseTXF.text ?? "", cpy: "", driver: "", color: self.colorTXF.text ?? "", handicap: "false", vehicletype: self.vehiclenameTXF.text ?? "", registrationnumber: self.vehiclenameTXF.text ?? "")
                                    }
                                }else{
                                    self.setTextfieldApperance(textfild: self.vehiclenameTXF, title: self.Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                                }
                                
                            }else{
                                self.setTextfieldApperance(textfild: self.licenseTXF, title: self.Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                            }
                            
                        }else{
                            self.setTextfieldApperance(textfild: self.colorTXF, title: self.Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                        }
                    }else{
                        self.setTextfieldApperance(textfild: self.yearTXF, title: self.Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                    }
                }else{
                    self.setTextfieldApperance(textfild: self.modelTXF, title: self.Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
                }
                
            }else{
                self.setTextfieldApperance(textfild: self.makeTXF, title: self.Localize.stringForKey(key: "err_valid_data"), color: UIColor.red, isError: true)
            }
            
        }
    }
    
    
    func setTextfieldApperance(textfild : SkyFloatingLabelTextField , title : String , color : UIColor,isError : Bool){
        if isError == true{
            textfild.title = title
            textfild.placeholder = title
            textfild.placeholderColor = color
        }else{
            textfild.title = title
            textfild.placeholderColor = color
        }
        textfild.titleColor = color
        textfild.lineColor = color
    }
    
    
    func setupLang(){
        
    }
    
    class func initWithStory()->AddVechileVC{
        let vc = UIStoryboard.init(name: "manageVehicle", bundle: Bundle.main).instantiateViewController(withIdentifier: "AddVechileVC") as! AddVechileVC
        return vc
    }
}

// Api calls
extension AddVechileVC{
    func makeModelList(){
        self.vehicleVM.getCarandyearList(view: self.view)
        
        self.vehicleVM.getvehicleDatastClosure = {
            print("VechileaddonDatas",self.vehicleVM.Vehicledatas)
            if let vehicledatas = self.vehicleVM.Vehicledatas{
                self.nameArray.removeAll()
                self.makeidArray.removeAll()
                self.modelArray.removeAll()
                self.yearArray.removeAll()
                self.ColorArray.removeAll()
                
                if vehicledatas.carmake[0].datas.count > 0
                {
                    for i in 0..<vehicledatas.carmake[0].datas.count
                    {
                        let car = vehicledatas.carmake[0].datas[i].make
                        self.nameArray.append(car)
                        self.makeidArray.append(vehicledatas.carmake[0].datas[i].makeid.description)
                    }
                }
                
                if vehicledatas.years[0].datas.count > 0
                {
                    for i in 0..<vehicledatas.years[0].datas.count
                    {
                        let car = vehicledatas.years[0].datas[i].name
                        self.yearArray.append(car)
                    }
                }
                
                if vehicledatas.color[0].datas.count > 0
                {
                    for i in 0..<vehicledatas.color[0].datas.count
                    {
                        let color = vehicledatas.color[0].datas[i].name
                        self.ColorArray.append(color)
                    }
                }
                
            }
        }
        
        self.vehicleVM.getVhicletypelists(view: self.view)
        
        self.vehicleVM.getvehicleNameClosure = {
            self.VehicleArray.removeAll()
            if let vehicledatas = self.vehicleVM.vehicleNames{
                
                if vehicledatas.vehiclelists.count > 0
                {
                    for i in 0..<vehicledatas.vehiclelists.count
                    {
                        let car = vehicledatas.vehiclelists[i]
                        self.VehicleArray.append(car)
                    }
                }
            }
        }
    }
    
    
    func addVehicleData(view : UIView , makeid : String ,makename : String , model : String,year : String , licence : String , cpy : String ,driver : String , color : String , handicap : String , vehicletype : String , registrationnumber : String ){
        self.vehicleVM.addVehicle(view: view, makeid: makeid, makename: makename, model: model, year: year, licence: licence, cpy: cpy, driver: driver, color: color, handicap: handicap, vehicletype: vehicletype, registrationnumber: registrationnumber)
        
        self.vehicleVM.getaddvehicleListClosure = {
            showToast(msg: self.vehicleVM.addVehicleList?.message ?? "")
            if self.pageFrom == "signup"{
                self.profile.getProfile()
                self.profile.successprofile = {
                    self.updateToken()
                    UserDefaults.standard.set("LoggedIn", forKey: UserDefaultsKey.loginstatus)
                    let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
                    self.appDelegate.window?.rootViewController = MenuRoot
                }
                
            }else{
                self.navigationController?.popViewController(animated: true)
            }
        }
    }
    
    func updateToken(){
        let token : String =  UserDefaults.standard.string(forKey: UserDefaultsKey.fcmtoken) ?? Constant.fcm_id
        FireBaseconnection.instanse.updateToken(token: token)
    }
    
    func editVehicleData(view : UIView , makeid : String ,makename : String , model : String,year : String , licence : String , cpy : String ,driver : String , color : String , handicap : String , vehicletype : String , registrationnumber : String ){
        self.vehicleVM.editVehicle(view: view, makeid: makeid, makename: makename, model: model, year: year, licence: licence, cpy: cpy, driver: driver, color: color, handicap: handicap, vehicletype: vehicletype, registrationnumber: registrationnumber)
        
        self.vehicleVM.getaddvehicleListClosure = {
            showToast(msg: self.vehicleVM.addVehicleList?.message ?? "")
            self.navigationController?.popViewController(animated: true)
        }
    }
    
}
