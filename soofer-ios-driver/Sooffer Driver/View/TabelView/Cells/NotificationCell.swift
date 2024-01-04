//
//  NotificationCell.swift
//  Sooffer Driver
//
//  Created by Abservetech on 11/01/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import Foundation
class NotificationCell: UITableViewCell {
    @IBOutlet weak var titleLb: UILabel!
    @IBOutlet weak var dateandtime: UILabel!
    
    @IBOutlet weak var detailView: UIView!
    
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.detailView.addCornerRadius1(withRadius: 2, withBorderColor: .lightGray)
        self.detailView.addShadow1(withRadius: 0)
        self.detailView.layer.cornerRadius = 8
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
extension UIView {
    func addCornerRadius1(withRadius radius: CGFloat, withBorderColor color: UIColor, withBorderWidth width: CGFloat = 0.5) {
           layer.cornerRadius = radius
           layer.borderColor = color.cgColor
           layer.borderWidth = width
       }
       func addShadow1(withColor color: UIColor = .lightGray, withRadius radius: CGFloat) {
        layer.shadowColor = color.cgColor
        layer.shadowOpacity = 1
        layer.shadowOffset = .zero
        layer.shadowRadius = radius
        layer.masksToBounds = false
        layer.shouldRasterize = true
        layer.rasterizationScale = UIScreen.main.scale
       }
       
}
