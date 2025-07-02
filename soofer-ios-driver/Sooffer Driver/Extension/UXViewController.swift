//
//  UXViewController.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation


extension UIViewController{
    
    func barButtonItem(ViewController : UIViewController,title : String){
    
        var leftBarButton = UIBarButtonItem()
        let leftNotification = UIView(frame: CGRect(x: 0, y: 0, width: 50, height: 50))
        leftNotification.backgroundColor = UIColor.clear
        let leftImage = UIImageView(image: UIImage(named: "back_arrow"))
        leftImage.frame =  CGRect(x: 5, y: 12, width: 20, height: 20)
        leftNotification.addSubview(leftImage)
        let textlable = UILabel()
        textlable.frame = CGRect(x: 45, y: 12, width: 200, height: 20)
        let customFont = UIFont(name: "System", size: 17.0)
        textlable.font = customFont
        textlable.text = title
        leftNotification.addSubview(textlable)
//    let leftButton = UIButton(frame: CGRect(x: 20, y: 0, width: 36, height: 36))
//    let leftImage = UIImage(named: "back_arrow")
//    leftButton.setImage(leftImage, for: .normal)
    leftBarButton = UIBarButtonItem(customView: leftNotification)
//    leftNotification.addTarget(self, action: #selector(self.menuView), for: .touchUpInside)
        leftImage.addAction(for: .tap) {
//            if self.revealViewController() != nil {
//                self.revealViewController().revealToggle(animated: true)
//            }
            let appDelegate = UIApplication.shared.delegate as! AppDelegate
            
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
            appDelegate.window?.rootViewController = MenuRoot
        }
    self.navigationItem.leftBarButtonItem = leftBarButton
   
//    self.title = title
//    self.title.l
    }
    
    @objc func menuView(){
        if self.revealViewController() != nil {
            self.revealViewController().revealToggle(animated: true)
        }
    }
}
