//
//  ManageDocsVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 05/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import PINRemoteImage

class ManageDocsVC: UIViewController {
    
    //UI Declaraction
    @IBOutlet weak var documentTabelView: UITableView!
    
    @IBOutlet weak var docsView: UIView!
    
    @IBOutlet weak var nextBtn: UIButton!
    @IBOutlet weak var skipBtn: UIButton!
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var selectedIndex : Int = -1
    var docType : String = "user" //user , vehicle
    var pageFrom : String = ""
    var docArray :  [String] = []
    var vehiclePosition : Int = Int()
    var profileVM = ProfileVM()
    var driverProof : Bool = false
    var vehcileproof : Bool = false
    var profile = ProfileModel()
    var taxis : Taxis = Taxis()
    
    //Firebase object
    var FBConnect = FireBaseconnection.instanse
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        
        self.navigationController?.isNavigationBarHidden = false
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
        self.getFBDriverDetails()
        if self.pageFrom == "signup"{
            self.navigationController?.isNavigationBarHidden = true
        }
        self.profileVM = ProfileVM(view: self.view, dataService: ApiRoot())
        setupData()
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
        }
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupTabelView()
        self.setupData()
    }
    
    func setupView(){
        if docType == "vehicle"{
            self.title = Localize.stringForKey(key: "manage_docs")
        }else{
            self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "manage_docs"))
        }
        if self.pageFrom == "signup"{
            self.navigationItem.leftBarButtonItem = nil
            self.docsView.isHidden = false
        }else{
            self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
            self.revealViewController().rearViewRevealWidth = 220
            self.docsView.isHidden = true
        }
    }
    
    func setupAction(){
        self.nextBtn.addAction(for: .tap) {
            
            if self.pageFrom == "signup"{
                print("documetsss::\(self.profile.licence)")
                if self.profile.document.isEmpty{
                   
                    showToast(msg: "Please Upload Document")
               }else{
                   self.navigationController?.isNavigationBarHidden = false
                   let vc = AddVechileVC.initWithStory()
                   vc.pageFrom = self.pageFrom
                   self.navigationController?.pushViewController(vc, animated: true)

               }
                
            }
            
        }
        
        self.skipBtn.addAction(for: .tap) {
            self.navigationController?.isNavigationBarHidden = false
            let vc = AddVechileVC.initWithStory()
            vc.pageFrom = self.pageFrom
            self.navigationController?.pushViewController(vc, animated: true)
        }
    }
    
    
    func setupLang(){
        if docType == "vehicle"{
            self.docArray = [Localize.stringForKey(key: "taxi_passing"),Localize.stringForKey(key: "permit"),Localize.stringForKey(key: "rc")
                             
//                             ,Localize.stringForKey(key: "fitness")
            ]
            
        }else{
            self.docArray = [Localize.stringForKey(key: "driving_license_front")
                             
//                             ,Localize.stringForKey(key: "driving_license_back")
                             
//                             ,Localize.stringForKey(key: "owner_Addrs_front"),Localize.stringForKey(key: "owner_Addrs_back"),Localize.stringForKey(key: "dr_Addrs_front"),Localize.stringForKey(key: "dr_Addrs_back")
            ]
        }
    }
    
    func setupData(){
        self.profileVM.getProfile()
        self.selectedIndex = -1
        self.profileVM.successprofile = {
            if self.docType != "vehicle"{
               // if let profile : ProfileModel = Constant.profileData as? ProfileModel{
                self.profile = self.profileVM.profileData ?? ProfileModel()
                    self.documentTabelView.reloadData()
              //  }
            }else{
             //   if let profile : Taxis = Constant.profileData.taxis[self.vehiclePosition] as? Taxis{
                self.taxis = self.profileVM.profileData?.taxis[self.vehiclePosition] ?? Taxis()
                self.documentTabelView.reloadData()
                //}
            }
        }
       
    }
    
    class func initWithStory()->ManageDocsVC{
        let vc = UIStoryboard.init(name: "ManageDocs", bundle: Bundle.main).instantiateViewController(withIdentifier: "ManageDocsVC") as! ManageDocsVC
        return vc
    }
}

extension ManageDocsVC : UITableViewDataSource,UITableViewDelegate{
    
    func setupTabelView(){
        self.documentTabelView.register(UINib(nibName: "DocumentCell", bundle: nil), forCellReuseIdentifier: "DocumentCell")
        self.documentTabelView.delegate = self
        self.documentTabelView.dataSource = self
        self.documentTabelView.reloadData()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.docArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "DocumentCell", for: indexPath) as! DocumentCell
        cell.doc_title.text = docArray[indexPath.row]
        
        if selectedIndex == indexPath.row{
            if cell.headerBottomView.isHidden{
                cell.headerBottomView.isHidden = false
                cell.downArrowImg.image = UIImage(named: "up-arrow")
            }else{
                cell.headerBottomView.isHidden = true
                cell.downArrowImg.image = UIImage(named: "down-arrow")
            }
        }else{
            cell.headerBottomView.isHidden = true
            cell.downArrowImg.image = UIImage(named: "down-arrow")
        }
        
        if docType != "vehicle" {
           // if let profile : ProfileModel = Constant.profileData as? ProfileModel{
                print("profileDocmentDatas",profile.licence , profile.insurance)
                if indexPath.row == 0 {
                    if !profile.document.isEmpty{
                        cell.missingLbl.isHidden = true
                        cell.infoImg.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.uploadDocView.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+profile.document[indexPath.row].docFrontImg
                        //cell.docImg.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }else   if indexPath.row == 1 {
                    if !profile.licenceBackImg.isEmpty{
                        cell.missingLbl.isHidden = true
                        cell.infoImg.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.uploadDocView.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+profile.document[indexPath.row].docFrontImg
                        //cell.docImg.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }else   if indexPath.row == 2 {
                    if !profile.insurance.isEmpty{
                        cell.missingLbl.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.infoImg.isHidden = true
                        cell.uploadDocView.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+profile.document[indexPath.row].docFrontImg
                        //cell.docImg.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }else   if indexPath.row == 3 {
                    if !profile.insuranceBackImg.isEmpty{
                        cell.missingLbl.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.infoImg.isHidden = true
                        cell.uploadDocView.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+profile.document[indexPath.row].docFrontImg
                       // cell.docImg.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }else   if indexPath.row == 4 {
                    if !profile.passing.isEmpty{
                        cell.missingLbl.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.infoImg.isHidden = true
                        cell.uploadDocView.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+profile.document[indexPath.row].docFrontImg
                       // cell.docImg.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }else   if indexPath.row == 5 {
                    if !profile.passingBackImg.isEmpty{
                        cell.missingLbl.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.infoImg.isHidden = true
                        cell.uploadDocView.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+profile.document[indexPath.row].docFrontImg
                        //cell.docImg.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }
            //}
        }else{
          //  if let profile : Taxis = Constant.profileData.taxis[vehiclePosition] as? Taxis{
            print("taxixss::\(taxis.document)")
            if !taxis.document.isEmpty{
                if indexPath.row == 0 {
                    if taxis.document[indexPath.row].docFrontImg != ""{
                        cell.missingLbl.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.uploadDocView.isHidden = true
                        cell.infoImg.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+taxis.document[indexPath.row].docFrontImg ?? String()
                       // cell.docImg.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }else   if indexPath.row == 1 {
                    if taxis.document.count > 1{
                        if taxis.document[indexPath.row].docFrontImg != ""{
                            cell.missingLbl.isHidden = true
                            cell.manageDocView.isHidden = false
                            cell.uploadDocView.isHidden = true
                            cell.infoImg.isHidden = true
                            var urls : String = ServiceApi.Base_Image_URL+taxis.document[indexPath.row].docFrontImg
                            //cell.docImg.pin_setImage(from: URL(string: urls))
                            let urlkf = URL(string: urls)
                            cell.docImg.kf.setImage(with: urlkf)
                        }else{
                            cell.missingLbl.isHidden = false
                            cell.infoImg.isHidden = false
                            cell.manageDocView.isHidden = true
                            cell.uploadDocView.isHidden = false
                        }
                        
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                
                }else   if indexPath.row == 2 {
                    if taxis.document.count > 2{
                        if taxis.document[indexPath.row].docFrontImg != ""{
                        cell.missingLbl.isHidden = true
                        cell.infoImg.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.uploadDocView.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+taxis.document[indexPath.row].docFrontImg
                        //cell.docImg.pin_setImage(from: URL(string: urls))
                            let urlkf = URL(string: urls)
                            cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }else{
                    cell.missingLbl.isHidden = false
                    cell.infoImg.isHidden = false
                    cell.manageDocView.isHidden = true
                    cell.uploadDocView.isHidden = false
                }
                }else   if indexPath.row == 3 {
                    if taxis.document[indexPath.row].docFrontImg != ""{
                        cell.missingLbl.isHidden = true
                        cell.infoImg.isHidden = true
                        cell.manageDocView.isHidden = false
                        cell.uploadDocView.isHidden = true
                        var urls : String = ServiceApi.Base_Image_URL+taxis.document[indexPath.row].docFrontImg
                        //cell.docImg.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        cell.docImg.kf.setImage(with: urlkf)
                    }else{
                        cell.missingLbl.isHidden = false
                        cell.infoImg.isHidden = false
                        cell.manageDocView.isHidden = true
                        cell.uploadDocView.isHidden = false
                    }
                }
            }else{
                cell.missingLbl.isHidden = false
                cell.infoImg.isHidden = false
                cell.manageDocView.isHidden = true
                cell.uploadDocView.isHidden = false
            }
        }
        
        
        cell.docHeaderView.addAction(for: .tap) {
            if cell.headerBottomView.isHidden{
                self.selectedIndex = indexPath.row
            }else{
                self.selectedIndex = -1
            }
            self.documentTabelView.reloadData()
        }
        
        
        cell.manageDocBtn.addAction(for: .tap) {
            if self.docType != "vehicle"{
                let vc = UploadDocVC.initWithStory()
                vc.isActiveDoc = self.driverProof
                vc.imagetopost = cell.docImg.image ?? UIImage()
                vc.profile = self.profile
                if indexPath.row == 0 {
                    vc.docType = "licence"
                    Constant.filefor = "drivingLicense"
                    
                }else if indexPath.row == 1 {
                    vc.docType = "licenceBackImg"
                    Constant.filefor = "licenceBackImg"
                }else if indexPath.row == 2 {
                    vc.docType = "insurance"
                    Constant.filefor = "insurance"
                }else if indexPath.row == 3 {
                    vc.docType = "insuranceBackImg"
                    Constant.filefor = "insuranceBackImg"
                }else if indexPath.row == 4 {
                    vc.docType = "passing"
                    Constant.filefor = "passing"
                }else if indexPath.row == 5 {
                    vc.docType = "passingBackImg"
                    Constant.filefor = "passingBackImg"
                }
                vc.pageFor = "manage"
                vc.pageofVehcileOrUser = "user"
                self.navigationController?.pushViewController(vc, animated: true)
            }else {
                
                let vc = UploadDocVC.initWithStory()
                vc.isActiveDoc = self.vehcileproof
                vc.imagetopost = cell.docImg.image ?? UIImage()
                var urls : String = ServiceApi.Base_Image_URL+self.taxis.document[indexPath.row].docFrontImg
                vc.VDocUrl = urls
                vc.VDate = self.taxis.document[indexPath.row].docExp
                if indexPath.row == 0 {
                    vc.docType = "insurance"
                    Constant.filefor = "insurance"
                    
                    //vc.docImg.pin_setImage(from: URL(string: urls))
                }else if indexPath.row == 1 {
                    vc.docType = "permit"
                    Constant.filefor = "registrationCard"
                }else if indexPath.row == 2 {
                    vc.docType = "registration"
                    Constant.filefor = "Tax ID / Social Security Number"
                    
                }else if indexPath.row == 3 {
                    vc.docType = "registrationBack"
                    Constant.filefor = "registrationBack"
                } else {
                    
                }
                vc.pageFor = "manage"
                vc.pageofVehcileOrUser = "vehicle"
                vc.vehiclePosition = self.vehiclePosition
                self.navigationController?.pushViewController(vc, animated: true)
            }
        }
        cell.uploadDocBtn.addAction(for: .tap) {
            if self.docType != "vehicle"{
                let vc = UploadDocVC.initWithStory()
                vc.pageFor = "upload"
                vc.pageofVehcileOrUser = "user"
                if indexPath.row == 0 {
                    vc.docType = "licence"
                    Constant.filefor = "drivingLicense"
                }else if indexPath.row == 1 {
                    vc.docType = "licenceBackImg"
                    Constant.filefor = "licenceBackImg"
                }else if indexPath.row == 2 {
                    vc.docType = "insurance"
                    Constant.filefor = "insurance"
                }else if indexPath.row == 3 {
                    vc.docType = "insuranceBackImg"
                    Constant.filefor = "insuranceBackImg"
                }else if indexPath.row == 4 {
                    vc.docType = "passing"
                    Constant.filefor = "passing"
                }else if indexPath.row == 5 {
                    vc.docType = "passingBackImg"
                    Constant.filefor = "passingBackImg"
                }
                self.navigationController?.pushViewController(vc, animated: true)
            }else{
                let vc = UploadDocVC.initWithStory()
                vc.pageFor = "upload"
                vc.pageofVehcileOrUser = "vehicle"
                if indexPath.row == 0 {
                    vc.docType = "insurance"
                    Constant.filefor = "insurance"
                }else if indexPath.row == 1 {
                    vc.docType = "permit"
                    Constant.filefor = "registrationCard"
                }else if indexPath.row == 2 {
                    vc.docType = "registration"
                    Constant.filefor = "Tax ID / Social Security Number"
                    
                }else if indexPath.row == 3 {
                    vc.docType = "registrationBack"
                    Constant.filefor = "registrationBack"
                }
                vc.vehiclePosition = self.vehiclePosition
                self.navigationController?.pushViewController(vc, animated: true)
            }
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if selectedIndex == indexPath.row{
            return 150
        }else{
            return 80
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let cell = tableView.cellForRow(at: indexPath) as! DocumentCell
        cell.backgroundColor = UIColor.clear
        
        
    }
    
    
    func getFBDriverDetails(){
        self.FBConnect.getdDriversData { (driverData) in
            if let drivers : FBDriverDataModel? = driverData{
                
                if drivers?.proof_status != "Accepted"{
                    self.driverProof = true
                }else{
                    self.driverProof = true
                }
            }
        }
    }
}


