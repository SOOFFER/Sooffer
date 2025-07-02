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
                self.layer.masksToBounds = true
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
                self.layer.masksToBounds = true
                self.layer.cornerRadius = self.frame.width/2
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
    var roundeCornorBorderAppcolor : Int {
        get{
            return Int(self.layer.borderWidth)
        }
        set(value){
            if value > 0 {
                self.layer.borderWidth = CGFloat(1)
                self.layer.borderColor = UIColor(named : "AppColor")?.cgColor as! CGColor
                self.layer.cornerRadius = 5
            }
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

extension UITextField {
    
    enum Direction {
        case Left
        case Right
    }
    
    func withImage(direction: Direction, image: UIImage, colorSeparator: UIColor, colorBorder: UIColor){
        let mainView = UIView(frame: CGRect(x: 0, y: 0, width: 50, height: 45))
        mainView.layer.cornerRadius = 5
        mainView.backgroundColor = .clear
        
        let view = UIView(frame: CGRect(x: 0, y: 0, width: 50, height: 40))
        view.backgroundColor = .white
        view.clipsToBounds = true
        view.layer.cornerRadius = 5
        view.layer.borderWidth = CGFloat(0.5)
        view.layer.borderColor = colorBorder.cgColor
        mainView.addSubview(view)
        
        let imageView = UIImageView(image: image)
        imageView.contentMode = .scaleAspectFit
        imageView.frame = CGRect(x: 12.0, y: 10.0, width: 25.0, height: 25.0)
        view.addSubview(imageView)
        
        let seperatorView = UIView()
        seperatorView.backgroundColor = colorSeparator
        mainView.addSubview(seperatorView)
        
        if(Direction.Left == direction){ // image left
            seperatorView.frame = CGRect(x: 45, y: 0, width: 5, height: 40)
            self.leftViewMode = .always
            self.leftView = mainView
        } else { // image right
            seperatorView.frame = CGRect(x: 0, y: 0, width: 5, height: 40)
            self.rightViewMode = .always
            self.rightView = mainView
        }
        
        self.layer.borderColor = colorBorder.cgColor
        self.layer.borderWidth = CGFloat(0.5)
        self.layer.cornerRadius = 5
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
class ShadowView: UIView {
    override var bounds: CGRect {
        didSet {
            setupShadow()
        }
    }

    private func setupShadow() {
        self.layer.cornerRadius = 8
        self.layer.shadowOffset = CGSize(width: 0, height: 1)
        self.layer.shadowRadius = 3
        self.layer.shadowOpacity = 0.3
        self.layer.shadowPath = UIBezierPath(roundedRect: self.bounds, byRoundingCorners: .allCorners, cornerRadii: CGSize(width: 8, height: 8)).cgPath
        self.layer.shouldRasterize = true
        self.layer.rasterizationScale = UIScreen.main.scale
    }
}

extension UIImage {
    
    class func textEmbededImage(image: UIImage, string: String, color:UIColor, imageAlignment: Int = 0, segFont: UIFont? = nil) -> UIImage {
        let font = segFont ?? UIFont.systemFont(ofSize: 16.0)
        let expectedTextSize: CGSize = (string as NSString).size(withAttributes: [NSAttributedString.Key.font: font])
        let width: CGFloat = expectedTextSize.width + image.size.width + 5.0
        let height: CGFloat = max(expectedTextSize.height, image.size.width)
        let size: CGSize = CGSize(width: width, height: height)
        UIGraphicsBeginImageContextWithOptions(size, false, 0)
        let context: CGContext = UIGraphicsGetCurrentContext()!
        context.setFillColor(color.cgColor)
        let fontTopPosition: CGFloat = (height - expectedTextSize.height) / 2.0
        let textOrigin: CGFloat = (imageAlignment == 0) ? image.size.width + 5 : 0
        let textPoint: CGPoint = CGPoint.init(x: textOrigin, y: fontTopPosition)
        string.draw(at: textPoint, withAttributes: [NSAttributedString.Key.font: font])
        let flipVertical: CGAffineTransform = CGAffineTransform(a: 1, b: 0, c: 0, d: -1, tx: 0, ty: size.height)
        context.concatenate(flipVertical)
        let alignment: CGFloat =  (imageAlignment == 0) ? 0.0 : expectedTextSize.width + 5.0
        context.draw(image.cgImage!, in: CGRect.init(x: alignment, y: ((height - image.size.height) / 2.0), width: image.size.width, height: image.size.height))
        let newImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return newImage!
    }
    
}
