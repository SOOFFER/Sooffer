//
//  SecondryMobileNoVc.swift
//  Sooffer Driver
//
//  Created by Abservetech on 11/07/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit

class SecondryMobileNoVc: UIViewController {
    
    @IBOutlet weak var cornerView: UIView!
    @IBOutlet weak var phnNoTf: UITextField!
    @IBOutlet weak var submitBtn: UIButton!
    
    class func initWithStory()->SecondryMobileNoVc{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "SecondryMobileNoVc") as! SecondryMobileNoVc
        return vc
    }
    
    var homeVm = HomeVM()
    var tripId = String()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        submitBtn.addTap { [self] in
            secondView(phone: phnNoTf.text!, tripId: tripId)
        }
    }
}


extension SecondryMobileNoVc {
    func secondView(phone: String, tripId: String) {
        homeVm.secondDriverFunc(view: self.view, phone: phone, tripId: tripId)
        homeVm.secondDriverSuccess = {
            print("Successs")
        }
        homeVm.secondDriverErrorr = {
            
        }
    }
}
