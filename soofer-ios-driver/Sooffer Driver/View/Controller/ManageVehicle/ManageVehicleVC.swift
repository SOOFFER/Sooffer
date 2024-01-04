//
//  ManageVehicleVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 06/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class ManageVehicleVC: UIViewController {

    
    @IBOutlet weak var vechileListTabelView: UITableView!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var selectedIndex : Int = -1
    
    var vehicleVM = ManageVehicleVM()
    var profilevm = ProfileVM()
    var vechileList : [Taxis] = Constant.profileData.taxis
    
    var manageVehicleList : ManageVehicleList?{
        didSet{
            guard let vehcilelsit = self.manageVehicleList else {return}
            self.vechileListTabelView.reloadData()
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
        self.attemptApi()
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.vehicleVM = ManageVehicleVM(dataService: ApiRoot())
        self.profilevm = ProfileVM(view: self.view, dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupTabelView()
    }
    
    func setupView(){
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "manage_vehi"))
        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
        self.revealViewController().rearViewRevealWidth = 220

        var rightBarNotification = UIBarButtonItem()
        let rightNotification = UIView(frame: CGRect(x: 0, y: 0, width: 50, height: 50))
        rightNotification.backgroundColor = UIColor.clear
        let NotificationImage = UIImageView(image: UIImage(named: "add"))
        NotificationImage.frame =  CGRect(x: 15, y: 12, width: 25, height: 25)
        rightNotification.addSubview(NotificationImage)
        rightBarNotification = UIBarButtonItem(customView: rightNotification)
        rightNotification.addAction(for: .tap) {
            let vc = AddVechileVC.initWithStory()
            self.navigationController?.pushViewController(vc, animated: true)
        }
        self.navigationItem.rightBarButtonItems = [rightBarNotification]
        
    }
    
    @objc func addVehicle(){
       
    }
    
    func setupAction(){
        
    }
    func setupLang(){
    }
    
    class func initWithStory()->ManageVehicleVC{
        let vc = UIStoryboard.init(name: "manageVehicle", bundle: Bundle.main).instantiateViewController(withIdentifier: "ManageVehicleVC") as! ManageVehicleVC
        return vc
    }
}

extension ManageVehicleVC : UITableViewDataSource,UITableViewDelegate{
    
    func setupTabelView(){
        self.vechileListTabelView.register(UINib(nibName: "VechileCell", bundle: nil), forCellReuseIdentifier: "VechileCell")
        
        self.vechileListTabelView.delegate = self
        self.vechileListTabelView.dataSource = self
        self.vechileListTabelView.reloadData()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count : Int = manageVehicleList?.vehiclelists.count{
            if count > 0{
                ShowMsginWindow.instanse.hideNodataView()
                return count
            }else{
                ShowMsginWindow.instanse.nodataView(view: self.view)
            }
        }
        ShowMsginWindow.instanse.nodataView(view: self.view)
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "VechileCell", for: indexPath) as! VechileCell
        if let vehicle : Taxis = self.manageVehicleList?.vehiclelists[indexPath.row]{
            cell.vechileNameLbl.text = vehicle.vehicletype
            cell.vehiclecatLbl.text = vehicle.makename
            
            if vehicle._id != Constant.currentTaxi._id{
                cell.deleteImg.alpha = 1
//                cell.vehicleTypeLbl.text = "InActive"
                cell.editView.alpha = 1
                cell.deleteImg.isUserInteractionEnabled = false
                
            }else{
                cell.deleteImg.alpha = 0.5
                cell.editView.alpha = 0.5
                cell.deleteImg.isUserInteractionEnabled = true
//                cell.vehicleTypeLbl.text = "Active"
            }
            
            cell.vehicleTypeLbl.text = vehicle.taxistatus
            
            if vehicle.taxistatus == "active"{
                cell.editView.alpha = 0.5
            }else{
                cell.editView.alpha = 1
            }
            
        }
        self.cellAction(cell: cell, indexpath: indexPath.row)
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat{
            return 100
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    func cellAction(cell : VechileCell , indexpath : Int){
        cell.editView.addAction(for: .tap) {
            if let id : String = self.manageVehicleList?.vehiclelists[indexpath]._id ?? "" as? String{
                if id == Constant.currentTaxi._id {
                    
                }else{
                    if self.manageVehicleList?.vehiclelists[indexpath].taxistatus != "active"{
                        let vc = AddVechileVC.initWithStory()
                        vc.pageFor = "edit"
                        vc.taxiData = self.manageVehicleList?.vehiclelists[indexpath] ?? Taxis()
                        self.navigationController?.pushViewController(vc, animated: true)
                    }else{
                       
                    }
                }
                
            }
        }
        
        cell.docView.addAction(for: .tap) {
            
            let vc = ManageDocsVC.initWithStory()
            vc.docType = "vehicle"
            if let vehicle : Taxis = self.manageVehicleList?.vehiclelists[indexpath]{
                 if vehicle.taxistatus == "active"{
                     vc.vehcileproof = true
                 }else{
                     vc.vehcileproof = false
                }
            }
           
            vc.vehiclePosition = indexpath
            self.navigationController?.pushViewController(vc, animated: true)
        }
        
        cell.deleteView.addAction(for: .tap) {
            if let id : String = self.manageVehicleList?.vehiclelists[indexpath]._id{
                 if id != Constant.currentTaxi._id{
//                    self.deleteVehicle(id: id,index : indexpath)
                    if let vehicle : Taxis = self.manageVehicleList?.vehiclelists[indexpath]{
                        if vehicle.taxistatus != "active"{
                            let alert = UIAlertController(title: "Alert", message: "Are you sure wants to delete this vehicle" , preferredStyle: UIAlertController.Style.alert)
                            alert.addAction(UIAlertAction(title: "No", style: UIAlertAction.Style.default, handler: nil))
                            alert.addAction(UIAlertAction(title: "Yes", style: UIAlertAction.Style.default, handler: { (alert) in
                                self.deleteVehicle(id: id,index : indexpath)
                            }))
                            self.present(alert, animated: true, completion: nil)
                        }
                    }

                 }else {
                    if let vehicle : Taxis = self.manageVehicleList?.vehiclelists[indexpath]{
                        if vehicle.taxistatus != "active"{
                            let alert = UIAlertController(title: "Alert", message: "Are you sure wants to delete this vehicle" , preferredStyle: UIAlertController.Style.alert)
                            alert.addAction(UIAlertAction(title: "No", style: UIAlertAction.Style.default, handler: nil))
                            alert.addAction(UIAlertAction(title: "Yes", style: UIAlertAction.Style.default, handler: { (alert) in
                                self.deleteVehicle(id: id,index : indexpath)
                            }))
                            self.present(alert, animated: true, completion: nil)
                        }
                    }
                }
            }
            
        }
        cell.vehicleTypeLbl.addAction(for: .tap) {
//            if let vehicle : Taxis = self.manageVehicleList?.vehiclelists[indexpath]{
//                self.setCurrentTaxi(makeid: vehicle._id, service: vehicle.vehicletype)
//            }
        }
    }
}


extension ManageVehicleVC{
    func attemptApi(){
        self.vehicleVM.getVehicleList(view: self.view)
        
        self.vehicleVM.getVehicleList = {
            self.manageVehicleList = self.vehicleVM.VehicleList
        }
    }
    
    func deleteVehicle(id : String , index : Int){
        self.vehicleVM.deleteVehicle(view: self.view, id: id)
        
        self.vehicleVM.getVehicleList = {
            self.manageVehicleList?.vehiclelists.remove(at: index)
            self.vechileListTabelView.reloadData()
        }
    }
    
    func setCurrentTaxi(makeid : String , service : String){
        self.vehicleVM.setVurrectTaxi(view: self.view, makeid: makeid, service: service)
        self.vehicleVM.setcurrentClosure = {
            self.profilevm.getProfile()
            self.profilevm.successprofile = {
                self.vechileListTabelView.reloadData()
            }
            showToast(msg: self.vehicleVM.setCurrentTaxi?.message ?? "")
        }
    }
}
