//
//  HomeVechListVc.swift
//  Sooffer Rider
//
//  Created by Abservetech on 17/02/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit

class HomeVechListVc: UITableViewCell {

    @IBOutlet weak var cornerView: UIView!
    @IBOutlet weak var seatLbl: UILabel!
    @IBOutlet weak var vechImg: UIImageView!
    @IBOutlet weak var vechicleNameLbl: UILabel!
    
    @IBOutlet weak var seatNamelbl: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        vechImg.layer.cornerRadius = vechImg.frame.width / 2
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
