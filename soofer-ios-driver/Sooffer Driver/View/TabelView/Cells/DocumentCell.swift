//
//  DocumentCell.swift
//  RebuStar Driver
//
//  Created by Abservetech on 06/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class DocumentCell: UITableViewCell {

    @IBOutlet weak var doc_title: UILabel!
  
    @IBOutlet weak var missingLbl: UILabel!
    
    @IBOutlet weak var infoImg: UIImageView!
    @IBOutlet weak var downArrowImg: UIImageView!
    @IBOutlet weak var uploadDocView: UIView!
    @IBOutlet weak var manageDocView: UIView!
    @IBOutlet weak var docHeaderView: UIView!
    
    @IBOutlet weak var headerBottomView: UIView!
    @IBOutlet weak var docView: UIView!
    @IBOutlet weak var uploadDocBtn: UIButton!
    
    @IBOutlet weak var docImg: UIImageView!
    @IBOutlet weak var manageDocBtn: UIButton!
  
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.manageDocBtn.roundeCornorBorder = 15
        self.uploadDocBtn.roundeCornorBorder = 15
        self.contentView.layer.cornerRadius = 10
        self.docImg.roundeCornorBorder = 3
        
        self.docView.clipsToBounds = true
        self.docView.layer.cornerRadius = 10
        self.docView.isElevation = 3
        self.selectionStyle = .none
        
        self.uploadDocBtn.setTitle(Localize.stringForKey(key: "upload_docs"), for: .normal)
        self.manageDocBtn.setTitle(Localize.stringForKey(key: "manage_doc"), for: .normal)
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

    }

}
