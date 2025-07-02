//
//  CurrentVehicleCell.swift
//  RebuStar Driver
//
//  Created by Abservetech on 13/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
class CurrentVehicleCell: UITableViewCell {
    
    @IBOutlet weak var currentImge: UIImageView!
    @IBOutlet weak var vehcileName: UILabel!
    @IBOutlet weak var vehicleView : UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.selectionStyle = .none
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
    }
    
}
