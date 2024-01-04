//
//  FavAddressCell.swift
//  RebuStar Rider
//
//  Created by Abservetech on 05/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class FavAddressCell: UITableViewCell {

    //UI Declaraction
    
    @IBOutlet weak var addressView: UIView!
    
    @IBOutlet weak var addrTitleLbl: UILabel!
    @IBOutlet weak var addressLbl: UILabel!
    @IBOutlet weak var moreImg: UIImageView!
    @IBOutlet weak var locationImage: UIImageView!
    @IBOutlet weak var deleteImage: UIImageView!
   
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

    }

}
