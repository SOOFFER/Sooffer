//
//  BankDetailsVC.swift
//  Dash Driver
//
//  Created by Abservetech on 01/08/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import WebKit

class BankDetailsVC: UIViewController {

    @IBOutlet weak var bankDetails: WKWebView!
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
        }
        setupView()

    }
    
    func setupView(){
        var User_id = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) as? String ?? ""
        var urls = ServiceApi.bankDetails + "&state=" + User_id
        print("url to redirect::\(urls)")
        bankDetails.load(NSURLRequest(url: NSURL(string: urls)! as URL) as URLRequest)
    }
    
    class func initWithStory()->BankDetailsVC{
        let vc = UIStoryboard.init(name: "Payment", bundle: Bundle.main).instantiateViewController(withIdentifier: "BankDetailsVC") as! BankDetailsVC
        return vc
    }
    
}
