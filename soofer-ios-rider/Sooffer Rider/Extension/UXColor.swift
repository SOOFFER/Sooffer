//
//  UXColor.swift
//  RebuStar Rider
//
//  Created by Abservetech on 28/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//
import Foundation
import UIKit

extension UIColor{
    static var black = Color(hex: "#000000")
    static var whites = Color(hex: "#FFFFFF")
    static var hiddenViewColor = Color(hex: "#EFEFF4")
    static var AppColors = Color(hex: "#121212")
    static var lightGray = Color(hex: "#9A9A9A")

}

func Color (hex:String) -> UIColor {
    var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    
    if (cString.hasPrefix("#")) {
        cString.remove(at: cString.startIndex)
    }
    
    if ((cString.count) != 6) {
        return UIColor.gray
    }
    
    var rgbValue:UInt32 = 0
    Scanner(string: cString).scanHexInt32(&rgbValue)
    
    return UIColor(
        red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
        green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
        blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
        alpha: CGFloat(1.0)
    )
    
    
    
}

