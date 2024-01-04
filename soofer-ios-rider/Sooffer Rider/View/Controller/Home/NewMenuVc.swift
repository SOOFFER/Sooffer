//
//  NewMenuVc.swift
//  Sooffer Rider
//
//  Created by Abservetech on 12/07/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import UIKit
import PINRemoteImage
import GoogleSignIn
import FBSDKLoginKit
import SideMenuSwift

class NewMenuVc: UIViewController {

    
    @IBOutlet weak var profileview: UIView!
    
    @IBOutlet weak var menutableview: UITableView!
    
    @IBOutlet weak var profileImg: UIImageView!
    
    @IBOutlet weak var logoutview: UIView!
    
    @IBOutlet weak var logoutimg: ImageLoader!
    
    @IBOutlet weak var username: UILabel!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var menuArray :  [String] = []
    var menuImgArray : [UIImage] = [UIImage(named: "0u")  ?? UIImage(),UIImage(named: "1u")  ?? UIImage()  ,UIImage(named: "7u")  ?? UIImage(),UIImage(named: "8u")  ?? UIImage(),UIImage(named: "2u")  ?? UIImage(),UIImage(named: "invite_frirnds1")  ?? UIImage(),UIImage(named: "3u")  ?? UIImage(),UIImage(named: "4u")  ?? UIImage(),UIImage(named: "5u")  ?? UIImage(),UIImage(named: "6u") ?? UIImage(),UIImage(named: "9u") ?? UIImage()
                                  ]
    
    var keys = ["home", "profile","payment","mywallet", "trips","invite_frirnds", "emer", "support", "offer","AddFav","notification"]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        }
        self.setupView()
        self.setupLang()
        self.setupData()
        self.setupAction()
        sideMenuFunc()
      //  sideMenuAction()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
       // sideMenuFunc()
        //sideMenuAction()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
    }
    
    func setupData(){
        if let profileData : ProfileModel  = Constant.profileData as? ProfileModel{
//            self.userName.text = profileData.fname.capitalized + " " + profileData.lname
            self.username.text = profileData.fname + " " + profileData.lname
            let urls : String = ServiceApi.Base_Image_URL+profileData.profile
          //  self.profileImg?.pin_setImage(from: URL(string: urls))
            let urlkf = URL(string: urls)
            self.profileImg.kf.setImage(with: urlkf)
            self.profileImg.layer.cornerRadius = self.profileImg.frame.width / 2
            self.profileImg.clipsToBounds = true
        }
    }
    
    func setupView() {
        self.menutableview.register(UINib(nibName: "MenuCell", bundle: nil), forCellReuseIdentifier: "MenuCell")
        self.menutableview.delegate = self
        self.menutableview.dataSource = self
        self.menutableview.reloadData()
        self.logoutimg.change_image = true
        self.logoutimg.tintColor = UIColor.gray
    }
    
    func sideMenuFunc() {
        SideMenuController.preferences.basic.menuWidth = self.view.frame.width - 75
        SideMenuController.preferences.basic.direction = .left
        SideMenuController.preferences.basic.enablePanGesture = true
        SideMenuController.preferences.basic.supportedOrientations = .portrait
        SideMenuController.preferences.basic.shouldRespectLanguageDirection = true
    }
    
    func nextViewController(controllers: [UIViewController]) {
        for (index, controller) in controllers.enumerated() {
            sideMenuController?.cache(viewController: controller, with: keys[index])
        }
    }
    
    func navController(withNavController controller: UIViewController) -> UINavigationController {
        let navController = UINavigationController(rootViewController: controller)
        navController.navigationBar.isHidden       = true
        navController.navigationBar.tintColor      = .black
        navController.navigationBar.topItem?.title = ""
        return navController
    }
    
    func openVc(withKey key: String) {
        navigationController?.navigationBar.isHidden = true
        sideMenuController?.setContentViewController(with: key)
        sideMenuController?.hideMenu()
    }
    
    func sideMenuAction() {
        nextViewController(controllers: [navController(withNavController: HomeVc.initWithStory()), navController(withNavController: ProfileVC.initWithStory()), navController(withNavController:
                                                                                                                                                            PaymentVC.initWithStory()), navController(withNavController:WalletVC.initWithStory()), navController(withNavController:
                                                                                                                                                                                                                                YourTripsVC.initWithStory()),navController(withNavController: InviteFrndsVC.initWithStory()), navController(withNavController: EmergnecyContactVC.initWithStory()), navController(withNavController: SupportVC.initWithStory()), navController(withNavController: OfferVC.initWithStory()),navController(withNavController: FavAddrVC.initWithStory()),navController(withNavController: NotificationVc.initWithStory())
        ])
        
        self.profileview.addAction(for: .tap) {
            let MenuRoot = SWRevealViewController(rearViewController: NewMenuVc.initWithStory(), frontViewController: UINavigationController(rootViewController: ProfileVC.initWithStory()))
            self.appDelegate.window?.rootViewController = MenuRoot
           
        }
    }
    
    func logout(){
        let alert = UIAlertController(title: self.Localize.stringForKey(key: "logout"), message: self.Localize.stringForKey(key: "alert_logout"), preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "cancel"), style: UIAlertAction.Style.default, handler: nil))
        alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "logout"), style: UIAlertAction.Style.default, handler: { (alert) in
            
            let domain = Bundle.main.bundleIdentifier!
            UserDefaults.standard.removePersistentDomain(forName: domain)
            UserDefaults.standard.synchronize()
            let loginManager = LoginManager()
            loginManager.logOut()
            let root : UIViewController?
            root = UINavigationController(rootViewController: LauncherVC.initWithStoryBoard())
            self.appDelegate.window?.rootViewController = root
            
        }))
        self.present(alert, animated: true, completion: nil)
    }
    func setupAction(){
        self.logoutview.addAction(for: .tap) {
            self.logout()
        }
    }
    func setupLang(){
        self.menuArray = [Localize.stringForKey(key: "home"),Localize.stringForKey(key: "myprofile"),Localize.stringForKey(key: "payment"),Localize.stringForKey(key:"mywallet"),Localize.stringForKey(key: "your_trips"),Localize.stringForKey(key: "invite_frirnds"),Localize.stringForKey(key: "emrg_contact"),Localize.stringForKey(key: "support"),Localize.stringForKey(key: "offers"),Localize.stringForKey(key: "Add Favorie place"),Localize.stringForKey(key: " Notification")]
          let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
       // self.logoutLabel.text = "Logout Version : \(appVersion ?? "1.0")"
    }
    
    class func initWithStory()->NewMenuVc{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "NewMenuVc") as! NewMenuVc
        return vc
    }
}

extension NewMenuVc : UITableViewDelegate,UITableViewDataSource{
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.menuArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MenuCell", for: indexPath) as! MenuCell
        cell.menuLbl.text = self.menuArray[indexPath.row]
        cell.menuImg.image = self.menuImgArray[indexPath.row]
        cell.menuImg.image =  cell.menuImg.image?.withRenderingMode(.alwaysTemplate)
        cell.menuImg.tintColor = UIColor.gray
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 45
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        var vc = UIViewController()
        switch indexPath.row {
        case 0:
            vc = HomeVc.initWithStory()
        break
        case 1:
            vc = ProfileVC.initWithStory()
        break
        case 2:
            vc = PaymentVC.initWithStory()
        break
        case 3:
            vc = WalletVC.initWithStory()
        break
        case 4:
            vc = YourTripsVC.initWithStory()
        break
        case 5:
            vc = InviteFrndsVC.initWithStory()
        break
        case 6:
            vc = EmergnecyContactVC.initWithStory()
        break
        case 7:
            vc = SupportVC.initWithStory()
        break
        case 8:
            vc = OfferVC.initWithStory()
        break
        case 9:
            vc = FavAddrVC.initWithStory()
        break
        case 10:
            vc = NotificationVc.initWithStory()
//    case 10:
//        self.logout()
//        break
        default:
            print("empty")
        }
        vc.navigationController?.isNavigationBarHidden = true
        if #available(iOS 16.0, *) {
            vc.navigationItem.backBarButtonItem?.isHidden = true
        } else {
            // Fallback on earlier versions
        }
        let navController = UINavigationController(rootViewController: vc)
        self.sideMenuController?.setContentViewController(to: navController)
        self.sideMenuController?.hideMenu()
    }
}
/*public extension UIViewController{
    var sideMenuController: SideMenuController?{
        return findSideMenuVC(from: self)
    }
    fileprivate func findSideMenuVC(from vc : UIViewController) -> SideMenuController{
        var contentVc : UIViewController? = vc
        repeat{
            contentVc = contentVc?.parent
            if let sideMenu = contentVc as? SideMenuController{
                return sideMenu
            }
        } while(contentVc != nil)
        return SideMenuController()
    }
}*/
