//
//  SupportVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import Alamofire

class SupportVC: UIViewController {

    @IBOutlet weak var supportTabel : UITableView!
    @IBOutlet weak var Backimg : UIImageView!
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    
    var suuportArray :  [String] = []
    var suportArray : [UIImage] = [UIImage(named: "about")  ?? UIImage(),UIImage(named: "privacy")  ?? UIImage(),UIImage(named: "tc")  ?? UIImage(),UIImage(named: "emrgncy_conct")  ?? UIImage(),UIImage(named: "faq")  ?? UIImage()]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupView()
        self.setupdelegate()
        self.setupLang()
        self.setupAction()
        self.navigationController?.isNavigationBarHidden = true
    }
        
    func setupView(){
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "support"))

//        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//        self.revealViewController().rearViewRevealWidth = 220
        
    }
    func setupdelegate(){
        self.supportTabel.delegate = self
        self.supportTabel.dataSource = self
        self.supportTabel.reloadData()
    }
    func setupAction(){
        self.Backimg.addAction(for: .tap) {
            self.sideMenuController?.revealMenu()
        }
    }
    func setupLang(){
         self.suuportArray = [Localize.stringForKey(key: "aboutus"),Localize.stringForKey(key: "privacy"),Localize.stringForKey(key: "tc"),Localize.stringForKey(key: "contact_us"),Localize.stringForKey(key: "faq")]
    }
    class func initWithStory()->SupportVC{
        let vc = UIStoryboard.init(name: "Support", bundle: Bundle.main).instantiateViewController(withIdentifier: "SupportVC") as! SupportVC
        return vc
    }

}

extension SupportVC : UITableViewDataSource,UITableViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.suuportArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "supportCell", for: indexPath) as! supportCell
        cell.support.text = self.suuportArray[indexPath.row]
        cell.supportimg.image = self.suportArray[indexPath.row]
        return cell
        
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if indexPath.row == 3{
            let vc = ContactUDVC.initWithStory()
            vc.supportname = self.suuportArray[indexPath.row]
            self.navigationController?.pushViewController(vc, animated: true)
        }else if indexPath.row == 4{
            let vc = FAQVVC.initWithStory()
            vc.supportname = self.suuportArray[indexPath.row]
            self.navigationController?.pushViewController(vc, animated: true)
        }
        else{
            let vc = SupportSubVC.initWithStory()
            vc.supportname = self.suuportArray[indexPath.row]
            self.navigationController?.pushViewController(vc, animated: true)
        }
    }
}

class supportCell : UITableViewCell{
    @IBOutlet weak var supportimg  : UIImageView!
    @IBOutlet weak var support: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.selectionStyle = .none
    }
}
