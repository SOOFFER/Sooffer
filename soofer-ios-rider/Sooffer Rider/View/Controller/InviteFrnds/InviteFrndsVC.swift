//
//  InviteFrndsVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class InviteFrndsVC: UIViewController {

    @IBOutlet weak var shareCodeLabl: UILabel!
    
    @IBOutlet weak var inviteCodeLbl: UILabel!
    
    @IBOutlet weak var inviteInsLbl: UILabel!
    
    @IBOutlet weak var inviteBtn: UIButton!
    
    @IBOutlet weak var backImg : UIImageView!
    @IBOutlet weak var titlelbl : UILabel!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.navigationController?.isNavigationBarHidden = true
    }
    
    func setupView(){
        
       // self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "invite_frirnds"))

//        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//        self.revealViewController().rearViewRevealWidth = 220
        
        self.inviteBtn.roundeCornorBorder = 20
    }
    
    func setupAction(){
        self.backImg.addTap {
            self.sideMenuController?.revealMenu()
        }
        self.inviteBtn.addAction(for: .tap) {
            let text : String = "HIIHIHIHIHI" + "invite's you with this code -> " + self.inviteCodeLbl.text!
            print("INVIT:::\(self.inviteCodeLbl)")
            let vc = UIActivityViewController(activityItems: [text], applicationActivities: nil)
            vc.excludedActivityTypes = [.print, .copyToPasteboard, .assignToContact, .saveToCameraRoll, .airDrop]
            DispatchQueue.main.async {
                self.present(vc, animated: true, completion: nil);
            }
        }
    }
    
    func setupLang(){
//        self.shareCodeLabl.text = Localize.stringForKey(key: "change_pass")
        self.titlelbl.text = Localize.stringForKey(key: "invite_frirnds")
        self.inviteInsLbl.text = Localize.stringForKey(key: "invite_inst")
        self.inviteBtn.setTitle( Localize.stringForKey(key: "invite_btn"), for: .normal)
        
    }
    class func initWithStory()->InviteFrndsVC{
        let vc = UIStoryboard.init(name: "InviteFrnds", bundle: Bundle.main).instantiateViewController(withIdentifier: "InviteFrndsVC") as! InviteFrndsVC
        return vc
    }

}
