//
//  OfferCell.swift
//  RebuStar Rider
//
//  Created by Abservetech on 23/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation


class OfferCell :  UITableViewCell {
    
    @IBOutlet weak var offerView: UIView!
    @IBOutlet weak var shareView: UIView!
    @IBOutlet weak var offerImg: UIImageView!
    
    @IBOutlet weak var offerTitle: UILabel!
    
    @IBOutlet weak var offerTxt: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.shareView.roundeCornorBorder = 5
        self.shareView.isElevation = 3
        self.offerView.roundeCornorBorder = 5
    }
}
