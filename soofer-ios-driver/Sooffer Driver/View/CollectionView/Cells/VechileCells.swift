//
//  VechileCells.swift
//  RebuStar Rider
//
//  Created by Abservetech on 06/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class VechileCells: UICollectionViewCell {
    
    @IBOutlet weak var collectionViewCell: UIView!
    @IBOutlet weak var vechileView: UIView!

    @IBOutlet weak var vechileName: UILabel!
    
    @IBOutlet weak var vechileImage: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.vechileView.isRoundedView = true
        self.vechileView.backgroundColor = UIColor(named: "VechileBG")
    }

}
