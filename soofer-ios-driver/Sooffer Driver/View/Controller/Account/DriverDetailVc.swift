//
//  DriverDetailVc.swift
//  Sooffer Driver
//
//  Created by Abservetech on 04/03/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit

class DriverDetailVc: UIViewController {
    @IBOutlet weak var cornerView: UIView!
    @IBOutlet weak var phnNoTf: UITextField!
    @IBOutlet weak var assignBtn: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.cornerView.isElevation = 10
        self.cornerView.roundeCornorBorder = 10
    }
    
    class func initWithStory()->DriverDetailVc{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "DriverDetailVc") as! DriverDetailVc
        return vc
    }

}
