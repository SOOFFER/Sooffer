//
//  CancellTripCell.swift
//  RebuStar Rider
//
//  Created by Abservetech on 23/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import MarqueeLabel

class UpcomingTripCell :  UITableViewCell {
    
    //UIVeclaraction
    
    @IBOutlet weak var tripeCellView: UIView!
    
    @IBOutlet weak var addressView: UIView!
    @IBOutlet weak var tripDate: UILabel!
    @IBOutlet weak var bookIdLbl: UILabel!
    @IBOutlet weak var sourceAddrLbl: MarqueeLabel!
    @IBOutlet weak var designationLbl: MarqueeLabel!
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var priceLbl: UILabel!
    @IBOutlet weak var statusLbl: UILabel!
    
    @IBOutlet weak var cancelBtn: UIButton!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.addressView.isElevation = 1
        self.tripeCellView.isElevation = 3
        self.cancelBtn.roundeCornorBorder = 20
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        // Configure the view for the selected state
    }
    
}
