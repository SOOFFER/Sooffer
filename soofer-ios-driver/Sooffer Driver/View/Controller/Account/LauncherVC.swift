//
//  LauncherVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 28/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class LauncherVC: UIViewController {
    
    //UI Declaraction
    //Button
    @IBOutlet weak var loginBtn: UIButton!
    @IBOutlet weak var signupBtn: UIButton!
    @IBOutlet weak var frenchBtn: UIButton!
    @IBOutlet weak var engBtn: UIButton!
    
    
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.navigationController?.isNavigationBarHidden = true
        self.setupView()
        self.setupAction()
        self.setupLang()
    
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
    }
    
    func setupView(){
        self.loginBtn.backgroundColor = UIColor(named: "AppColor")
        self.signupBtn.backgroundColor = UIColor(named: "AppColor")
        self.loginBtn.roundeCornorBorder = 20
        self.signupBtn.roundeCornorBorder = 20
    }
    
    func setupAction(){
        self.loginBtn.addAction(for: .tap) {
          //  let vc  = VideoCallVC.initWithStory()
           let vc = LoginVC.initWithStory()
           self.navigationController?.pushViewController(vc, animated: true)
        }
        self.signupBtn.addAction(for: .tap) {
            let vc = SignupVC.initWithStory()
            self.navigationController?.pushViewController(vc, animated: true)
        }
        self.engBtn.addAction(for: .tap) {
            Localizations.instance.setLanguage(languageCode: "en")
            self.viewDidLoad()
        }
        self.frenchBtn.addAction(for: .tap) {
            Localizations.instance.setLanguage(languageCode: "es")
            self.viewDidLoad()
        }
    }
    
    func setupLang(){
        self.engBtn.setTitle(Localize.stringForKey(key: "eng"), for: .normal)
        self.frenchBtn.setTitle(Localize.stringForKey(key: "spanish"), for: .normal)
        self.signupBtn.setTitle(Localize.stringForKey(key: "signup"), for: .normal)
        self.loginBtn.setTitle(Localize.stringForKey(key: "login"), for: .normal)
    }
    
    class func initWithStoryBoard() -> LauncherVC {
        let controller = UIStoryboard.init(name: "Account", bundle: Bundle.main).instantiateViewController(withIdentifier: "LauncherVC") as! LauncherVC
        return controller
    }
}
