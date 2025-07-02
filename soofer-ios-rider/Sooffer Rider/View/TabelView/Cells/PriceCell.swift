//
//  PriceCell.swift
//  RebuStar Driver
//
//  Created by Abservetech on 15/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation

class PriceCell : UITableViewCell{
    
    @IBOutlet weak var priceTitlelbl: UILabel!
    @IBOutlet weak var priceLbl: UILabel!

   @IBOutlet weak var desclbl: UILabel!
   @IBOutlet weak var descdummyLbl: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        self.selectionStyle = .none
    }
}
