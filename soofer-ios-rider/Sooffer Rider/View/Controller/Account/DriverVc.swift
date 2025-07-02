//
//  DriverVc.swift
//  Sooffer Rider
//
//  Created by Abservetech on 17/02/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit
import SideMenuSwift

protocol DriverProtocol {
    func driver(withTaxiId id: String, no: String, makeName: String, model: String, color: String)
}
//number: 76598
//makename: honda
//model: honda

class DriverVc: UIViewController {
    
    @IBOutlet weak var backView: UIView!
    @IBOutlet weak var bottomView: UIView!
    @IBOutlet weak var vechNoTf    : UITextField!
    @IBOutlet weak var vechNameTf  : UITextField!
    @IBOutlet weak var vechModelTf : UITextField!
    @IBOutlet weak var vechiclecolorTf: UITextField!
    @IBOutlet weak var doneBtn: UIButton!
    
    var loginSignupVm = LoginSignupVM()
    var delegate: DriverProtocol!
    var rootVc: UIViewController?
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    class func initWithStory()->DriverVc {
        let vc = UIStoryboard.init(name: "Account", bundle: Bundle.main).instantiateViewController(withIdentifier: "DriverVc") as! DriverVc
        return vc
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.loginSignupVm = LoginSignupVM(view: self.view, dataService: ApiRoot())
        
        self.backView.backgroundColor = UIColor.black.withAlphaComponent(0.8)
        doneBtn.layer.cornerRadius = 10
        
        backView.addTap {
            let homeVc = HomeVc.initWithStory()
            let nav = UINavigationController(rootViewController: homeVc)
            nav.navigationBar.isHidden = true
            let menuVc = MenuVC.initWithStory()
            self.rootVc = SideMenuController(contentViewController: nav, menuViewController: menuVc)
            self.appDelegate.window?.rootViewController = self.rootVc
        }
        
        doneBtn.addTap { [unowned self] in
            driverFunc(withNumber: vechNoTf.text!, withMake: vechNameTf.text!, withModel: vechModelTf.text!, withcolor: vechiclecolorTf.text!)
        }
    }
}

extension DriverVc {
    func driverFunc(withNumber: String, withMake: String, withModel: String,withcolor: String) {
        loginSignupVm.vechicleAdd(withVechNumber: withNumber, withMakeName: withMake, withModel: withModel, vehiclecolor: withcolor)
        loginSignupVm.addvechSuccess = {
//            UserDefaults.standard.set(false, forKey: UserDefaultsKey.driver)
            UserDefaults.standard.set(false, forKey: "isarrive")
            self.delegate.driver(withTaxiId: self.loginSignupVm.vechSuccess?.taxi._id ?? "", no: withNumber, makeName: withMake, model: withModel, color: withcolor)
            self.dismiss(animated: true, completion: nil)
        }
        loginSignupVm.addvechErrorr = {
            print("Erorr")
        }
    }
}
