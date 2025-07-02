//
//  FeedbackCell.swift
//  RebuStar Driver
//
//  Created by Abservetech on 06/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class FeedbackCell: UITableViewCell {

    @IBOutlet weak var feedbackView: UIView!
    @IBOutlet weak var userImg: UIImageView!
    @IBOutlet weak var usernameLbl: UILabel!
    @IBOutlet weak var contentLbl: UILabel!
   
    override func awakeFromNib() {
        super.awakeFromNib()
        self.feedbackView.layer.cornerRadius = 10
        self.feedbackView.isElevation = 3
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

    }

}
