//
//  VehicleListView.swift
//  RebuStar Driver
//
//  Created by Abservetech on 13/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
class VehicleListView : UIView , UITextFieldDelegate {
    
    //UI Declaraction
    @IBOutlet weak var manageBtn : UIButton!
    @IBOutlet weak var addBtn : UIButton!
    
    @IBOutlet weak var titleLbl: UILabel!
    
    @IBOutlet weak var vehcileListTable : UITableView!
    @IBOutlet weak var vehicleView : UIView!
    @IBOutlet weak var closeImage : UIImageView!
    
    
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var seletecteTaxi : Int = -1
    
    var vehicleVM = ManageVehicleVM()
    var profile = ProfileVM()
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    
    func initView(view : UIView , addvicile : @escaping(String) -> () , manageVehicle : @escaping(String)->() , closeView : @escaping(String)->()   ){
        
        profile = ProfileVM(dataService: ApiRoot())
        self.vehicleVM = ManageVehicleVM(dataService: ApiRoot())
        
        self.setView(view: view)
        self.setupAction()
        self.setupView()
        self.setupLang()
        self.setupTabelView()
        addBtn.addAction(for: .tap) {
            addvicile("addveicle")
        }
        manageBtn.addAction(for: .tap) {
            manageVehicle("managevehicle")
        }
        self.closeImage.addAction(for: .tap) {
           closeView("closeView")
        }
    }
    
    func setupAction(){
       
    }
    
    func setupView(){
        
        self.vehicleView.roundeCornorBorder = 10
        self.vehicleView.isElevation = 3
        
    }
    
    func setupLang(){
        //UI View Text names
        self.titleLbl.text = Localize.stringForKey(key: "selete_veh")
        
        self.manageBtn.setTitle(Localize.stringForKey(key: "manage_veh"), for: .normal)
        self.addBtn.setTitle(Localize.stringForKey(key: "add_veh"), for: .normal)
    }
    
    
    //MARK: setView Property
    func setView(view : UIView) {
        self.frame = view.bounds
        
        self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
        
        view.addSubview(self)
        
        view.bringSubviewToFront(self)
        
        self.transform = CGAffineTransform(translationX: 0, y: 0)//.concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
        
        UIView.animate(withDuration: 0.5) {
            self.transform = .identity
        }
    }
    
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
            self.removeFromSuperview()
        }) { (true) in
            self.removeFromSuperview()
        }
    }
    
    //MARK: Register xib view
    class var getView : VehicleListView {
        return UINib(nibName: "VehicleListView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! VehicleListView
    }
    
}

extension VehicleListView : UITableViewDataSource,UITableViewDelegate{
    
    func setupTabelView(){
        self.vehcileListTable.register(UINib(nibName: "CurrentVehicleCell", bundle: nil), forCellReuseIdentifier: "CurrentVehicleCell")
        
        self.vehcileListTable.delegate = self
        self.vehcileListTable.dataSource = self
        self.vehcileListTable.reloadData()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        if let count : Int =  Constant.profileData.taxis.count as? Int{
            if count > 0 {
                ShowMsginWindow.instanse.hideNodataView()
                return count
            }else{
                ShowMsginWindow.instanse.nodataView(view: self)
            }
        }
        ShowMsginWindow.instanse.nodataView(view: self)
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "CurrentVehicleCell", for: indexPath) as! CurrentVehicleCell
        if let taxi : Taxis =  Constant.profileData.taxis[indexPath.row] as? Taxis{
            cell.vehcileName.text = taxi.vehicletype + "( \(taxi.makename) )"
            if seletecteTaxi == indexPath.row{
                
                cell.currentImge.image = UIImage(named: "radio-on")
            }else{
                if taxi._id == Constant.currentTaxi._id{
                    cell.currentImge.image = UIImage(named: "radio-on")
                }else{
                    cell.currentImge.image = UIImage(named: "radio-off")
                }
            }
        }
        
        self.cellAction(cell: cell, indexpath: indexPath.row)
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat{
        return 50
        
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
    }
    
    func cellAction(cell : CurrentVehicleCell , indexpath : Int){
        cell.currentImge.addAction(for: .tap) {
            if let taxi : Taxis =  Constant.profileData.taxis[indexpath] as? Taxis{
                self.setCurrentTaxi(makeid: taxi._id, service: taxi.vehicletype)
                self.seletecteTaxi = indexpath
                self.vehcileListTable.reloadData()
            }
        }
        cell.vehicleView.addAction(for: .tap) {
             if let taxi : Taxis =  Constant.profileData.taxis[indexpath] as? Taxis{
                 print("taxi:::,\(taxi.taxistatus)")
                 if taxi.taxistatus == "active"{
                            self.setCurrentTaxi(makeid: taxi._id, service: taxi.vehicletype)
                          }
                          else{
                            showToast(msg: "You vehicle status is inactive")
                          }
            }
        }
    }
}

extension VehicleListView{
    func setCurrentTaxi(makeid : String , service : String){
        self.vehicleVM.setVurrectTaxi(view: self, makeid: makeid, service: service)
        self.vehicleVM.setcurrentClosure = {
           self.callProfileApi()
            showToast(msg: self.vehicleVM.setCurrentTaxi?.message ?? "")
            NotificationCenter.default.post(name: .changedCurrentTaxi, object: nil)
        }
    }
    
    func callProfileApi(){
        self.profile.getProfile()
        self.profile.successprofile = {
            self.setupTabelView()
        }
    }
}
