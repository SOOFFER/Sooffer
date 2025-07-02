//
//  UserChatCell.swift
//  Nexxyo Rider
//
//  Created by Abservetech on 05/08/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
class UserChatCell : UITableViewCell {
    @IBOutlet weak var msgView: UIView!
    @IBOutlet weak var msgLabl: UILabel!
    @IBOutlet weak var timeLabl: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        msgView.clipsToBounds = true
        msgView.layer.cornerRadius = 5
    }
}

class FrndChatCell : UITableViewCell{
    @IBOutlet weak var msgView: UIView!
    @IBOutlet weak var msgLabl: UILabel!
    @IBOutlet weak var timeLabl: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        msgView.clipsToBounds = true
        msgView.layer.cornerRadius = 5
    }
}
