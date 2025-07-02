//
//  SupportSubVC.swift
//  Oyaa
//
//  Created by Abservetech on 11/09/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Alamofire
import WebKit
    
class SupportSubVC: UIViewController ,WKNavigationDelegate{
    @IBOutlet weak var backimg: UIImageView!
    @IBOutlet weak var Toplbl: UILabel!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var webView = WKWebView()
    var supportname : String = ""
    var suuportArray :  [String] = []
    var suportArray : [UIImage] = [UIImage(named: "about")  ?? UIImage(),UIImage(named: "privacy")  ?? UIImage(),UIImage(named: "tc")  ?? UIImage(),UIImage(named: "contact_us")  ?? UIImage(),UIImage(named: "faq")  ?? UIImage()]
        
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupView()
        
        backimg.addTap {
//            self.sideMenuController?.revealMenu()
            self.navigationController?.popToRootViewController(animated: true)
           
        }
            
        self.webView = WKWebView(frame: CGRect(x: 10, y: 100, width: self.view.frame.size.width-10, height: self.view.frame.size.height-50))
        self.view.addSubview(webView)
        webView.navigationDelegate = self
        ShowMsginWindow.instanse.LoadingShow(view: self.view)
    
        if  NetworkReachabilityManager()!.isReachable {
            ShowMsginWindow.instanse.LoadingHide(view: self.view)
            if self.supportname == Localize.stringForKey(key: "aboutus") {
                let url = URL(string: ServiceApi.Base_URL+"aboutus")
                webView.load(URLRequest(url: url!))
                Toplbl.text = "About Us"
            }else if self.supportname == Localize.stringForKey(key: "privacy") {
                let url = URL(string: ServiceApi.Base_URL+"privacypolicy")
                webView.load(URLRequest(url: url!))
                Toplbl.text = "Privacy Policy"
            }else if self.supportname == Localize.stringForKey(key: "tc") {
                let url = URL(string: ServiceApi.Base_URL+"tnc")
                webView.load(URLRequest(url: url!))
            }
            
            
            self.webView.isHidden = false
       //            self.internetIssueUI.isHidden = true
        }else{
            ShowMsginWindow.instanse.LoadingHide(view: self.view)
            self.webView.isHidden = true
    //            self.internetIssueUI.isHidden = false
        }
        
        // 2
        let refresh = UIBarButtonItem(barButtonSystemItem: .refresh, target: webView, action: #selector(webView.reload))
            toolbarItems = [refresh]
            navigationController?.isToolbarHidden = false
        
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            title = webView.title
        }
        
        func setupView(){
            
            self.supportbarButtonItem(ViewController: self, title: self.supportname) { (backAction) in
                self.navigationController?.popViewController(animated: true)
            }
//        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//            self.revealViewController().rearViewRevealWidth = 220
            
        }
    
        class func initWithStory()->SupportSubVC{
            let vc = UIStoryboard.init(name: "Support", bundle: Bundle.main).instantiateViewController(withIdentifier: "SupportSubVC") as! SupportSubVC
            return vc
        }

}
