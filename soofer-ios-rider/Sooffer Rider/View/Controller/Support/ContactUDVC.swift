//
//  ContactUDVC.swift
//  Oyaa
//
//  Created by Abservetech on 11/09/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class ContactUDVC: UIViewController {
    
    @IBOutlet weak var titletxt : UITextField!
    
    @IBOutlet weak var queryTxt : UITextField!
    @IBOutlet weak var submitbtn : UIButton!
    
    @IBOutlet weak var backimg: UIImageView!
    var contactus = CommonVM()

    var supportname : String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.submitbtn.roundeCornorBorder = 20
        self.contactus = CommonVM(view: self.view, dataService: ApiRoot())

        self.supportbarButtonItem(ViewController: self, title: self.supportname) { (backAction) in
            self.navigationController?.popViewController(animated: true)
        }
        
        self.submitbtn.addAction(for: .tap) {
            let title : String = self.titletxt.text ?? ""
            let query : String = self.queryTxt.text ?? ""
            if title.isEmpty || query.isEmpty{
                showToast(msg: "Subject and content should not be empty")
            }else{
                self.apicall(subject: title, query: query)
            }
        }
        backimg.addTap {
//            self.sideMenuController?.revealMenu()
            self.navigationController?.popToRootViewController(animated: true)
        }
    }
    
    class func initWithStory()->ContactUDVC{
        let vc = UIStoryboard.init(name: "Support", bundle: Bundle.main).instantiateViewController(withIdentifier: "ContactUDVC") as! ContactUDVC
        return vc
    }
    
    func apicall(subject: String, query: String){
        self.contactus.submitQuert(view: self.view, subject: subject, query: query)
        self.contactus.submitquerys = {
            self.titletxt.text = ""
            self.queryTxt.text = ""
            self.navigationController?.popViewController(animated: true)
        }
    }
}
