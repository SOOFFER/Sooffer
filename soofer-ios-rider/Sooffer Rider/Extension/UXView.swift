//
//  UXView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 29/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//
import Foundation
import UIKit

public extension UIView{
    
    //MARK :- set elevation
    public var isElevation : Int {
        get{
            return Int(self.layer.shadowRadius)
        }
        set(value){
            if value>0{
                self.layer.masksToBounds = false
                self.layer.shadowColor = UIColor.black.cgColor
                self.layer.shadowOffset = CGSize(width: 0, height: value)
                self.layer.shadowOpacity = 0.5
                self.layer.shadowRadius = CGFloat(value)
            }
        }
    }
    
    //MARK:- roundedcourner with border
    
    var isRoundedBorder : Bool {
        get{
            return self.layer.cornerRadius > 0
        }
        set(value){
            if value{
                self.layer.masksToBounds = false
                self.layer.borderWidth = 1
                self.layer.borderColor = UIColor.gray.cgColor
                self.layer.cornerRadius = self.frame.width/2
            }
        }
    }
    
    var isRoundedView : Bool {
        get{
            return self.layer.cornerRadius > 0
        }
        set(value){
            if value{
                self.layer.masksToBounds = false
                self.layer.cornerRadius = self.frame.width/2
                self.clipsToBounds = true
            }
        }
    }
    
    var roundeCornorBorder : Int {
        get{
            return Int(self.layer.borderWidth)
        }
        set(value){
            if value > 0 {
                self.layer.borderWidth = CGFloat(1)
                self.layer.borderColor = UIColor.AppColors.cgColor
                self.layer.cornerRadius = CGFloat(value)
            }
        }
    }
    
    func countmroundeCornorBorder(borderwith : Int , Bordercolor : UIColor , bgcolor : UIColor) {
       
            if borderwith > 0 {
                self.layer.borderWidth = CGFloat(1)
                self.layer.borderColor = Bordercolor.cgColor
                self.layer.backgroundColor = bgcolor.cgColor
                self.layer.cornerRadius = CGFloat(borderwith)
            }
        
    }
    
    func leftRightRoundCorners(radius: CGFloat) {
        self.layer.cornerRadius = CGFloat(radius)
        self.clipsToBounds = true
        self.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
    }
    
    func bottomleftRightRoundCorners(radius: CGFloat) {
        self.layer.cornerRadius = CGFloat(radius)
        self.clipsToBounds = true
        self.layer.maskedCorners = [.layerMinXMaxYCorner, .layerMaxXMaxYCorner]
    }
    
    //MARK :- blurview
    func addBlurEffect(view : UIView) {
        var darkBlur:UIBlurEffect = UIBlurEffect()
        if #available(iOS 10.0, *) {
            darkBlur = UIBlurEffect(style: UIBlurEffect.Style.prominent)
        } else {
            darkBlur = UIBlurEffect(style: UIBlurEffect.Style.dark)
        }
        let blurView = UIVisualEffectView(effect: darkBlur)
        blurView.frame = view.frame
        blurView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(blurView)
    }
    
    //MARK:- take screen shot of UI
    func takeScreenshot() -> UIImage {
        UIGraphicsBeginImageContextWithOptions(self.bounds.size, false, UIScreen.main.scale)
        drawHierarchy(in: self.bounds, afterScreenUpdates: true)
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        if (image != nil)
        {
            return image!
        }
        return UIImage()
    }
}

extension UIView {
    func addCornerRadius(withRadius radius: CGFloat, withBackgroundColor color: UIColor, withBorderWidth width: CGFloat = 0.05) {
        layer.borderWidth = width
        layer.cornerRadius = radius
        layer.borderWidth = width
    }
    
    func addShadow(withShadow color: UIColor = .lightGray, withradius radius: CGFloat) {
        layer.shadowColor = color.cgColor
        layer.shadowOpacity = 1
        layer.shadowOffset = .zero
        layer.shadowRadius = radius
        layer.masksToBounds = false
        layer.shouldRasterize = true
        layer.rasterizationScale = UIScreen.main.scale
    }
}
