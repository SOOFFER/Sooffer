//
//  VechileCell.swift
//  RebuStar Driver
//
//  Created by Abservetech on 06/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class VechileCell: UITableViewCell {

    @IBOutlet weak var vehicleView : UIView!
    @IBOutlet weak var vechileNameLbl : UILabel!
    @IBOutlet weak var vehicleTypeLbl : UILabel!
    @IBOutlet weak var vehiclecatLbl : UILabel!
    
    @IBOutlet weak var editImg : UIImageView!
    @IBOutlet weak var deleteImg : UIImageView!
    @IBOutlet weak var docImg : UIImageView!
    
    @IBOutlet weak var editView : UIView!
    @IBOutlet weak var deleteView : UIView!
    @IBOutlet weak var docView : UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.vehicleView.layer.cornerRadius = 10
        self.vehicleView.isElevation = 3
        self.vehicleTypeLbl.roundeCornorBorderAppcolor = 5
        self.selectionStyle = .none
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

    }

}
