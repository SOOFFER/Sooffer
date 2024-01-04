//
//  ViewController.swift
//  RebuStar Rider
//
//  Created by Abservetech on 28/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        // Do any additional setup after loading the view.
    }


}

