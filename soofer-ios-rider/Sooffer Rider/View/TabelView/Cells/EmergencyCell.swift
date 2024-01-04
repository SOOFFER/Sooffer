//
//  EmergencyCell.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class EmergencyCell: UITableViewCell {

    @IBOutlet weak var emergencyView: UIView!
    @IBOutlet weak var nameLbl: UILabel!
    @IBOutlet weak var numLbl: UILabel!
    @IBOutlet weak var closeImg: UIImageView!
   
    override func awakeFromNib() {
        super.awakeFromNib()
        self.emergencyView.isElevation = 3
//        self.closeImg.isRoundedBorder = true
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

    }

}
