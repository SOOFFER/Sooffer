//
//  ImageLoader.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class ImageLoader: UIImageView {
    
    @IBInspectable var change_image:Bool = false
    
    override func awakeFromNib() {
        Color()
    }
    func Color(){
        if change_image{
            self.image = self.image?.withRenderingMode(UIImage.RenderingMode.alwaysTemplate)
        }
    }
}

extension UIColor {
    
    convenience init(hex: Int) {
        let components = (
            R: CGFloat((hex >> 16) & 0xff) / 255,
            G: CGFloat((hex >> 08) & 0xff) / 255,
            B: CGFloat((hex >> 00) & 0xff) / 255
        )
        self.init(red: components.R, green: components.G, blue: components.B, alpha: 1)
    }
    
}
