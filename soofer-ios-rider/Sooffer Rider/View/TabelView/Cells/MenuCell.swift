//
//  MenuCell.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class MenuCell: UITableViewCell {

    //UI Declaraction
    //View
    @IBOutlet weak var menuCellView: UIView!
   
    //Label
    @IBOutlet weak var menuLbl: UILabel!
    
    //image
    @IBOutlet weak var menuImg: UIImageView!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
       
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
