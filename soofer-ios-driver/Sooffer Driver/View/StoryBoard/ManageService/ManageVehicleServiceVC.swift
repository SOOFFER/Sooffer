//
//  ManageVehicleServiceVC.swift
//  BackRide Driver
//
//  Created by Abservetech on 12/11/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class ManageVehicleServiceVC: UIViewController {
    
    var manageVehicle : ManageVehicleService?{
        didSet {
            self.vehicleService.reloadData()
        }
    }
    
    @IBOutlet weak var vehicleService: UITableView!
    
    @IBOutlet weak var twodrivertypeview: UIView!
    @IBOutlet weak var lablename : UILabel!
    @IBOutlet weak var switchImg : UIImageView!
    @IBOutlet weak var titlelable: UILabel!
    @IBOutlet weak var serviceImage : UIImageView!
    
    @IBOutlet weak var tableViewHgt: NSLayoutConstraint!
    
    
    @IBOutlet weak var V_typeLbl: UILabel!
    
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var earingVM = EarningsVM()
    var profile = ProfileVM()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.getVehicleService()
        setupData()
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
     setupData()
     print("istwo driver :: \(Constant.profileData.isTwoDriver)")
     setupAction()
        self.earingVM = EarningsVM(dataService: ApiRoot())
        profile = ProfileVM(dataService: ApiRoot())
              self.vehicleService.delegate = self
              self.vehicleService.dataSource = self
              self.vehicleService.reloadData()
              self.barButtonItem(ViewController: self, title: "Manage Vehicle Service")
           
    }
    
    override func viewWillLayoutSubviews() {
        super.updateViewConstraints()
        DispatchQueue.main.async {
            
            self.tableViewHgt?.constant = self.vehicleService.contentSize.height
            self.view.layoutIfNeeded()
        }
    }
    
    class func InitWithStory()-> ManageVehicleServiceVC{
          let Story = UIStoryboard(name: "ManageService", bundle: nil)
          let ViewController = Story.instantiateViewController(withIdentifier: "ManageVehicleServiceVC")as! ManageVehicleServiceVC
          return ViewController
      }
    func setupData() {
        self.titlelable.text = "VehicleType : Others"
        self.lablename.text = "Twodriver"
        print("istwo driver :: \(Constant.profileData.isTwoDriver)")
        if Constant.profileData.isTwoDriver{
            self.switchImg.image = UIImage(named: "green")
        } else {
            self.switchImg.image = UIImage(named: "red")
        }
        
    }
   func setupAction() {
        self.switchImg.addTap {
            let driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
            if self.switchImg.image == UIImage(named: "red"){
                self.switchImg.image = UIImage(named: "green")
               
                self.twodriveractivetrip(driverid: driverid, status : true)
              //  self.driverActiveTripType(activeFor: manageService.type ?? "", status: "true")
            }else{
                self.switchImg.image = UIImage(named: "red")
                self.twodriveractivetrip(driverid: driverid, status : false)
             //   self.driverActiveTripType(activeFor: manageService.type ?? "", status: "false")
            }
        }
    }
}

extension ManageVehicleServiceVC : UITableViewDelegate , UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.manageVehicle?.service.count ?? 0
      // return 2
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "ManageServiceCell", for: indexPath) as! ManageServiceCell
     //   if indexPath.row == 0 {
            if let manageService = self.manageVehicle?.service[indexPath.row]{
                var V_Type = UserDefaults.standard.value(forKey: UserDefaultsKey.defaultVehicle) ?? ""
                print("V__type::\(V_Type)")
               // cell.vehicletypelbl.text = "Vehicle type: Developer"
                self.V_typeLbl.text = "Vehicle type: \(V_Type)"
                cell.titleLbl.text = manageService.type?.capitalizingFirstLetter()
                if (manageService.status ?? false){
                    cell.selectSwitch.image = UIImage(named: "green")
                }else{
                    cell.selectSwitch.image = UIImage(named: "red")
                }
                var urls : String = manageService.file ?? ""
               // cell.serviceImage.pin_setImage(from: URL(string: urls))
                let urlkfs = URL(string: urls)
                cell.serviceImage.kf.setImage(with: urlkfs)
                if let vehicleImage = cell.serviceImage.image{
                    let tintableImage = vehicleImage.withRenderingMode(.alwaysTemplate)
                    cell.serviceImage.image = tintableImage
                }
                cell.serviceImage.tintColor = UIColor.AppColors
                
                cell.selectSwitch.addAction(for: .tap) {
                    if cell.selectSwitch.image == UIImage(named: "red"){
                        cell.selectSwitch.image = UIImage(named: "green")
                        self.driverActiveTripType(activeFor: manageService.type ?? "", status: "true")
                    }else{
                        cell.selectSwitch.image = UIImage(named: "red")
                        self.driverActiveTripType(activeFor: manageService.type ?? "", status: "false")
                    }
                }
         //   }
        } /*else {
          
                cell.vehicletypelbl.text = "Vehicle type- TwoDriver"
                cell.titleLbl.text = "TwoDriver"
//                if (manageService.status ?? false){
//                    cell.selectSwitch.image = UIImage(named: "green")
//                }else{
//                    cell.selectSwitch.image = UIImage(named: "red")
//                }
//                var urls : String = manageService.file ?? ""
//                cell.serviceImage.pin_setImage(from: URL(string: urls))
                if let vehicleImage = cell.serviceImage.image{
                    let tintableImage = vehicleImage.withRenderingMode(.alwaysTemplate)
                    cell.serviceImage.image = tintableImage
                }
                cell.serviceImage.tintColor = UIColor.AppColors
                
                cell.selectSwitch.addAction(for: .tap) {
                    let driverid = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
                    if cell.selectSwitch.image == UIImage(named: "red"){
                        cell.selectSwitch.image = UIImage(named: "green")
                       
                        self.twodriveractivetrip(driverid: driverid, status : true)
                      //  self.driverActiveTripType(activeFor: manageService.type ?? "", status: "true")
                    }else{
                        cell.selectSwitch.image = UIImage(named: "red")
                        self.twodriveractivetrip(driverid: driverid, status : false)
                     //   self.driverActiveTripType(activeFor: manageService.type ?? "", status: "false")
                    }
                }
            
        }*/
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 130
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        self.viewWillLayoutSubviews()
    }
    
}

extension ManageVehicleServiceVC {
    func getVehicleService(){
         self.earingVM.getVehicleServiceAvailablity(view: self.view)
         self.earingVM.SuccManageVehicleService = {
            self.manageVehicle = self.earingVM.manageVehicleService
            self.vehicleService.reloadData()
        }
    }
    func twodriveractivetrip(driverid: String, status : Bool){
        print("driverid: \(driverid)")
        self.earingVM.twodriverActiveTrip(view: self.view, driverid: driverid, status: status)
        self.earingVM.successdrivertrip = {
            if status == true{
                
                Constant.profileData.isTwoDriver = true
            } else {
                Constant.profileData.isTwoDriver = false
            }
            print("success two driver trip workin")
            showToast(msg: self.earingVM.successtwodriveractivetrip?.message ?? "")
         //   self.getProfileData()
            print("istwo driver:: \(self.earingVM.successtwodriveractivetrip?.driverData.isTwoDriver)")
          //  Constant.profileData.isTwoDriver =
//            if ((self.earingVM.successtwodriveractivetrip?.driverData.isTwoDriver) != nil){
//                self.switchImg.image = UIImage(named: "green")
//
//            } else {
//                self.switchImg.image = UIImage(named: "red")
//            }
         //   self.setupData()
        }
    }
    func driverActiveTripType(activeFor : String , status : String){
        self.earingVM.getdriverActiveTripType(view: self.view, activeFor: activeFor, status: status)
        self.earingVM.getActiveTrip = {
            if status == "true"{
                if activeFor == "rental"{
                    Constant.currentTaxi.isRental = true
                }else if activeFor == "outstation"{
                    Constant.currentTaxi.isOutstation = true
                }else if activeFor == "daily"{
                    Constant.currentTaxi.isDaily = true
                }
            }else{
                if activeFor == "rental"{
                    Constant.currentTaxi.isRental = false
                }else if activeFor == "outstation"{
                    Constant.currentTaxi.isOutstation = false
                    
                }else if activeFor == "daily"{
                    Constant.currentTaxi.isDaily = false
                }
            }
            
            NotificationCenter.default.post(name: .vechileStatus, object: nil)
            
        }
      }
    func getProfileData(){
        self.profile.getProfile()
        self.profile.successprofile = {
            print("SADFASDFADS", Constant.profileData.attendance)
            self.setupData()
        

        }
    }
}


class ManageServiceCell : UITableViewCell{
    @IBOutlet weak var ManageServiceCellView: UIView!
    @IBOutlet weak var selectSwitch: UIImageView!
    @IBOutlet weak var serviceImage: UIImageView!
    @IBOutlet weak var titleLbl: UILabel!
    
    @IBOutlet weak var vehicletypelbl: UILabel!
    
    override func awakeFromNib() {
    }
}


class TwoDriverCell : UITableViewCell{
    
    @IBOutlet weak var cellview : UIView!
    @IBOutlet weak var switchImg : UIImageView!
    @IBOutlet weak var serviceimage : UIImageView!
    @IBOutlet weak var servicelbl : UILabel!
    
    override func awakeFromNib() {
    }
    
    
}
