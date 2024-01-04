//
//  UXLoader.swift
//  RebuStar Rider
//
//  Created by Abservetech on 06/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import Lottie
import Toaster


//MARK:-  Loader class
class ShowMsginWindow{
    
    static let instanse = ShowMsginWindow()
    
    private var lable : UILabel!
    var animationView = LottieAnimationView()
    let blureffect : UIBlurEffect!
    let blurview : UIVisualEffectView!
    var nodataImage : UIImageView!
    var image = UIImage()
    var textlable = UILabel()
    private init() {
        self.lable = UILabel()
        self.nodataImage = UIImageView()
        self.animationView = LottieAnimationView(name: "car")
        self.blureffect = UIBlurEffect(style: UIBlurEffect.Style.extraLight)
        self.blurview = UIVisualEffectView(effect: self.blureffect)
    }
    
    var uiWindow : UIWindow{
        let window = UIApplication.shared.keyWindow ?? UIWindow()
        return window
    }
    
    func LoadingShow(view : UIView){
//        self.animationView.frame = CGRect(x: 0, y: 0, width: 100, height: 100)
//        self.animationView.center = self.uiWindow.center
//        self.animationView.contentMode = .scaleAspectFit
//        let starAnimation = Animation.named("car")
//        self.animationView.animation = starAnimation
//        self.animationView.animationSpeed = 0.5
//        self.animationView.backgroundColor = UIColor.gray
//        self.animationView.layer.cornerRadius = 5
//        self.uiWindow.addSubview(self.animationView)
//        self.uiWindow.isUserInteractionEnabled = false
//        self.animationView.play()
        view.endEditing(true)
        let hud = MBProgressHUD.showAdded(to: view, animated: true)
        hud?.labelText = "Loading..."
        hud?.dimBackground = false
    }
    func LoadingHide(view : UIView){
//        self.animationView.stop()
//        self.blurview.removeFromSuperview()
//        self.animationView.removeFromSuperview()
//        self.uiWindow.isUserInteractionEnabled = true
        MBProgressHUD.hideAllHUDs(for: view, animated: true)
    }
    
    func nodataView(view : UIView){
        self.nodataImage.isHidden = false
//        let image = UIImage(named: "nodata")
        
        self.nodataImage.image = image
        self.nodataImage.frame = CGRect(x: 0, y: 0, width: 200, height: 200)
        self.nodataImage.center = view.center
        
        textlable.frame = CGRect(x: 20, y: 0, width: view.frame.width - 30, height: 20)
        let customFont = UIFont(name: "Montserrat", size: 17.0)
        textlable.font = customFont
        textlable.text = "No Data Found"
        textlable.center.x = view.center.x
        textlable.center.y = view.center.y
        textlable.textAlignment = .center
        self.textlable.isHidden = false

        view.addSubview(textlable)
        
    }
    
    func hideNodataView()  {
        self.nodataImage.isHidden = true
        self.textlable.isHidden = true
    }
}


extension UIImage {
    func imageWithColor(color1: UIColor) -> UIImage {
        UIGraphicsBeginImageContextWithOptions(self.size, false, self.scale)
        color1.setFill()

        let context = UIGraphicsGetCurrentContext()
        context?.translateBy(x: 0, y: self.size.height)
        context?.scaleBy(x: 1.0, y: -1.0)
        context?.setBlendMode(CGBlendMode.normal)

        let rect = CGRect(origin: .zero, size: CGSize(width: self.size.width, height: self.size.height))
        context?.clip(to: rect, mask: self.cgImage!)
        context?.fill(rect)

        let newImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()

        return newImage!
    }
}
