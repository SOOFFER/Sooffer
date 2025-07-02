//
//  HourlyRideVc.swift
//  Sooffer Rider
//
//  Created by Abservetech on 17/02/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit

class HourlyRideVc: UIViewController {
    
    @IBOutlet weak var backBtn: UIButton!
    
    @IBOutlet weak var locationlbl: UILabel!
    class func initWithStory()->HourlyRideVc {
        let vc = UIStoryboard.init(name: "Account", bundle: Bundle.main).instantiateViewController(withIdentifier: "HourlyRideVc") as! HourlyRideVc
        return vc
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
        
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        backBtn.addTap {
            self.navigationController?.popViewController(animated: true)
        }
    }
}
