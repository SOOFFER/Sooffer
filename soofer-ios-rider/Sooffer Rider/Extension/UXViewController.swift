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
        let Localize : Localizations = Localizations.instance
        
        
 
        var leftBarButton = UIBarButtonItem()
        let leftNotification = UIView(frame: CGRect(x: 0, y: 0, width: 50, height: 50))
        leftNotification.backgroundColor = UIColor.clear
        let leftImage = UIImageView(image: UIImage(named: "back_arrow"))
        leftImage.frame =  CGRect(x: 5, y: 12, width: 20, height: 20)
        if title == Localize.stringForKey(key: "offers"){
            leftImage.tintColor = UIColor.white
        }
        leftNotification.addSubview(leftImage)
        if title != Localize.stringForKey(key: "offers"){
            
            let textlable = UILabel()
            textlable.frame = CGRect(x: 45, y: 12, width: 200, height: 20)
            let customFont = UIFont(name: "System", size: 17.0)
            textlable.font = customFont
            textlable.text = title
        
            leftNotification.addSubview(textlable)
        }else{
            self.title = title
            self.navigationController?.navigationBar.barTintColor = UIColor.AppColors
            self.navigationController?.navigationBar.backgroundColor = UIColor.AppColors
            //        self.navigationController?.navigationBar.tintColor = UIColor.red
        }
  
        leftBarButton = UIBarButtonItem(customView: leftNotification)
   
        leftImage.addAction(for: .tap) {
                  self.sideMenuController?.revealMenu()
//            let appDelegate = UIApplication.shared.delegate as! AppDelegate
//
//            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVc.initWithStory()))
//            appDelegate.window?.rootViewController = MenuRoot
        }
        self.navigationItem.leftBarButtonItem = leftBarButton
   
    }
    
    @objc func menuView(){
        if self.revealViewController() != nil {
            self.revealViewController().revealToggle(animated: true)
        }
    }
    
    
    
    func supportbarButtonItem(ViewController : UIViewController,title : String,backacction : @escaping(String)-> ()){
        let Localize : Localizations = Localizations.instance
        
        
        
        var leftBarButton = UIBarButtonItem()
        let leftNotification = UIView(frame: CGRect(x: 0, y: 0, width: 50, height: 50))
        leftNotification.backgroundColor = UIColor.clear
        let leftImage = UIImageView(image: UIImage(named: "back_arrow"))
        leftImage.frame =  CGRect(x: 5, y: 12, width: 20, height: 20)
        if title == Localize.stringForKey(key: "offers"){
            leftImage.tintColor = UIColor.white
        }
        leftNotification.addSubview(leftImage)
        if title != Localize.stringForKey(key: "offers"){
            
            let textlable = UILabel()
            textlable.frame = CGRect(x: 45, y: 12, width: 200, height: 20)
            let customFont = UIFont(name: "Montserrat", size: 17.0)
            textlable.font = customFont
            textlable.text = title
            
            leftNotification.addSubview(textlable)
        }else{
            self.title = title
            self.navigationController?.navigationBar.barTintColor = UIColor.AppColors
            self.navigationController?.navigationBar.backgroundColor = UIColor.AppColors
            //        self.navigationController?.navigationBar.tintColor = UIColor.red
        }
        
        leftBarButton = UIBarButtonItem(customView: leftNotification)
        
        leftImage.addAction(for: .tap) {
            backacction("goback")
        }
        self.navigationItem.leftBarButtonItem = leftBarButton
        
    }
}


extension UITextField{
    @IBInspectable var placeHolderColor: UIColor? {
        get {
            return self.placeHolderColor
        }
        set {
            self.attributedPlaceholder = NSAttributedString(string:self.placeholder != nil ? self.placeholder! : "", attributes:[NSAttributedString.Key.foregroundColor: newValue!])
        }
    }
}
