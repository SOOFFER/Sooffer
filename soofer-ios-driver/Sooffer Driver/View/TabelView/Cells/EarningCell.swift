//
//  EarningCell.swift
//  RebuStar Driver
//
//  Created by Abservetech on 06/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class EarningCell: UITableViewCell {
    
    @IBOutlet weak var eariningviews: UIView!
    @IBOutlet weak var dateLbls: UILabel!
    @IBOutlet weak var earningLbl: UILabel!
    
    override func awakeFromNib() {
            super.awakeFromNib()
            self.eariningviews.layer.cornerRadius = 10
            self.eariningviews.isElevation = 3
            self.selectionStyle = .none
        }
}
