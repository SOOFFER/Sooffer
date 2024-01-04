//
//  PasttripCell.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import MarqueeLabel

class PasttripCell: UITableViewCell {

   //UIVeclaraction
    
    @IBOutlet weak var tripeCellView: UIView!
    
    @IBOutlet weak var addressView: UIView!
    @IBOutlet weak var PickupAddressView: UIView!
    @IBOutlet weak var dropAddressView: UIView!
    @IBOutlet weak var tripDate: UILabel!
    @IBOutlet weak var bookIdLbl: UILabel!
    @IBOutlet weak var sourceAddrLbl: MarqueeLabel!
    @IBOutlet weak var designationLbl: MarqueeLabel!
   
    @IBOutlet weak var statusLbl: UILabel!
    @IBOutlet weak var priceLbl: UILabel!
   
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.addressView.isElevation = 3
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
