//
//  MenuVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import PINRemoteImage
import Kingfisher

class MenuVC: UIViewController {
    
    //UIDeclaraction
    
    @IBOutlet weak var userProfileImg: UIImageView!
    @IBOutlet weak var logoutImage: ImageLoader!
    
    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var logoutLabel: UILabel!
    
    @IBOutlet weak var menuTabelView: UITableView!
    
    @IBOutlet weak var profileView: UIView!
    @IBOutlet weak var logoutView: UIView!
    
    //Firebase object
    var FBConnect = FireBaseconnection.instanse
    var homevm = HomeVM()
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var menuArray :  [String] = []
    var menuImgArray : [UIImage] = [UIImage(named: "house")!,UIImage(named: "profile") ?? UIImage(),UIImage(named: "payout") ?? UIImage(),UIImage(named: "your_trips") ?? UIImage(),UIImage(named: "rating") ?? UIImage(),UIImage(named: "car") ?? UIImage(),UIImage(named: "docs")!,UIImage(named: "earn") ?? UIImage(),UIImage(named: "css") ?? UIImage(),UIImage(named: "noti") ?? UIImage()]
//    ,UIImage(named: "logout") ?? UIImage()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.homevm = HomeVM(dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupData()
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        //        self.revealViewController().frontViewController.view.isUserInteractionEnabled = false
        //        self.revealViewController().view.addGestureRecognizer(self.revealViewController().panGestureRecognizer())
        //        self.revealViewController()?.frontViewController.view.alpha = 0.3
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        //        self.revealViewController().frontViewController.view.isUserInteractionEnabled = true
        //        self.revealViewController()?.frontViewController.view.alpha = 1
    }
    func setupData(){
        if let profileData : ProfileModel  = Constant.profileData as? ProfileModel{
            self.userName.text = profileData.fname + " " + profileData.lname
//            var urls : String = ServiceApi.Base_Image_URL+profileData.profile ?? String()
//            
//            self.userProfileImg?.pin_setImage(from: URL(string: urls))
            let url = URL(string: ServiceApi.Base_Image_URL + profileData.profile)
            self.userProfileImg.kf.setImage(with: url)
            self.userProfileImg.layer.cornerRadius = self.userProfileImg.frame.width / 2
            self.userProfileImg.clipsToBounds = true
        }else{
            
        }
        
    }
    
    func setupView(){
        self.menuTabelView.register(UINib(nibName: "MenuCell", bundle: nil), forCellReuseIdentifier: "MenuCell")
        self.menuTabelView.delegate = self
        self.menuTabelView.dataSource = self
        self.menuTabelView.reloadData()
        
        //set colors
        self.userName.textColor = UIColor.black
//        self.logoutImage.change_image = true
        self.logoutImage.tintColor = UIColor.gray
    }
    
    func setupAction(){
        self.profileView.addAction(for: .tap) {
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: ProfileVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        }
        
        self.logoutView.addAction(for: .tap) {
            let alert = UIAlertController(title: self.Localize.stringForKey(key: "logout"), message: self.Localize.stringForKey(key: "alert_logout"), preferredStyle: UIAlertController.Style.alert)
            alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "cancel"), style: UIAlertAction.Style.default, handler: nil))
            alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "logout"), style: UIAlertAction.Style.default, handler: { (alert) in
                self.removeFBLocation()
                self.logoutApiCall()
            }))
            self.present(alert, animated: true, completion: nil)
        }
        
    }
    
    func setupLang(){
        self.menuArray = [Localize.stringForKey(key: "home"),Localize.stringForKey(key: "myprofile"),Localize.stringForKey(key: "payout"),Localize.stringForKey(key: "your_trips"),Localize.stringForKey(key: "rating"),Localize.stringForKey(key: "manage_vechile"),Localize.stringForKey(key: "manage_docs"),Localize.stringForKey(key: "earning"),"Manage Service",Localize.stringForKey(key: "Notification")]
//        ,Localize.stringForKey(key: "logout")
        let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
        self.logoutLabel.text = "Logout (Version : \(appVersion ?? "1.0"))"
    }
    
    class func initWithStory()->MenuVC{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "MenuVC") as! MenuVC
        return vc
    }
}

extension MenuVC : UITableViewDelegate,UITableViewDataSource{
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.menuArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MenuCell", for: indexPath) as! MenuCell
        cell.menuLbl.text = self.menuArray[indexPath.row]
        cell.menuImg.image = self.menuImgArray[indexPath.row]
        cell.menuImg.image =  cell.menuImg.image?.withRenderingMode(.alwaysTemplate)
        cell.menuImg.tintColor = UIColor.gray
        cell.menuLbl.textColor = UIColor.black
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 48
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        switch indexPath.row {
        case 0:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 1:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: ProfileVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 2:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: PaymentVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 3:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: YourTripsVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 4:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: RatingVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 5:
            let MenuRoot =  SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: ManageVehicleVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 6:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: ManageDocsVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 7:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: EarningVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 8:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: ManageVehicleServiceVC.InitWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        case 9:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: NotificationVc.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
//        case 10:
//            let alert = UIAlertController(title: self.Localize.stringForKey(key: "logout"), message: self.Localize.stringForKey(key: "alert_logout"), preferredStyle: UIAlertController.Style.alert)
//            alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "cancel"), style: UIAlertAction.Style.default, handler: nil))
//            alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "logout"), style: UIAlertAction.Style.default, handler: { (alert) in
//                self.removeFBLocation()
//                self.logoutApiCall()
//            }))
//            self.present(alert, animated: true, completion: nil)
        default:
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
        }
        self.revealViewController().revealToggle(animated: true)
    }
    
    
    func removeFBLocation(){
        if Constant.currentTaxi.isDaily{
            self.FBConnect.removerGeoFrie()
        }
        if Constant.currentTaxi.isRental{
            self.FBConnect.RentalremoverGeoFrie()
        }
        if Constant.currentTaxi.isOutstation{
            self.FBConnect.outstationremoverGeoFrie()
        }
        
    }
    
    func logoutApiCall(){
        self.homevm.logout(view: self.view)
        
        self.homevm.getlogout = {
            
            let domain = Bundle.main.bundleIdentifier!
            UserDefaults.standard.removePersistentDomain(forName: domain)
            UserDefaults.standard.synchronize()
            
            let navigation = UINavigationController(rootViewController: LauncherVC.initWithStoryBoard())
            self.appDelegate.window?.rootViewController = navigation
        }
    }
}


