//
//  FAQVVC.swift
//  Oyaa
//
//  Created by Abservetech on 11/09/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class FAQVVC: UIViewController {
    
    @IBOutlet weak var taqTabel : UITableView!
    @IBOutlet weak var backimg: UIImageView!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var suuportArray :  [String] = []
    var supportname : String = ""

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
        // Do any additional setup after loading the view.
        backimg.addTap {
//            self.sideMenuController?.revealMenu()
            self.navigationController?.popToRootViewController(animated: true)
        }
    }
    

    func setupView(){
        self.supportbarButtonItem(ViewController: self, title: self.supportname) { (backAction) in
            self.navigationController?.popViewController(animated: true)
        }
        
        
    }
    func setupdelegate(){
        self.taqTabel.delegate = self
        self.taqTabel.dataSource = self
        self.taqTabel.reloadData()
    }
    func setupLang(){
        self.suuportArray = [Localize.stringForKey(key: "howto"),Localize.stringForKey(key: "gentral"),Localize.stringForKey(key: "rider"),Localize.stringForKey(key: "driver")]
    }
    class func initWithStory()->FAQVVC{
        let vc = UIStoryboard.init(name: "Support", bundle: Bundle.main).instantiateViewController(withIdentifier: "FAQVVC") as! FAQVVC
        return vc
    }

}
extension FAQVVC : UITableViewDataSource,UITableViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.suuportArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "faqCell", for: indexPath) as! faqCell
        cell.faqlabel.text = self.suuportArray[indexPath.row]
       
        return cell
        
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if indexPath.row == 0{
            let vc = FaqsubVC.initWithStory()
            vc.supportname = self.suuportArray[indexPath.row]
            vc.titles = Localize.stringForKey(key: "cancelbook")
            vc.des = Localize.stringForKey(key: "txt_cancel")
            self.navigationController?.pushViewController(vc, animated: true)
        } else if indexPath.row == 1{
            let vc = FaqsubVC.initWithStory()
            vc.supportname = self.suuportArray[indexPath.row]
            vc.titles = Localize.stringForKey(key: "how_to_work")
            vc.des = Localize.stringForKey(key: "txt_wrk")
            self.navigationController?.pushViewController(vc, animated: true)
        } else if indexPath.row == 2{
            let vc = FaqsubVC.initWithStory()
            vc.supportname = self.suuportArray[indexPath.row]
            vc.titles = Localize.stringForKey(key: "how_signup")
            vc.des = Localize.stringForKey(key: "txt_signup")
            self.navigationController?.pushViewController(vc, animated: true)
        } else if indexPath.row == 3{
            let vc = FaqsubVC.initWithStory()
            vc.supportname = self.suuportArray[indexPath.row]
            vc.titles = Localize.stringForKey(key: "how_signup_driver")
            vc.des = Localize.stringForKey(key: "txt_signup_driver")
            self.navigationController?.pushViewController(vc, animated: true)
        }
        
       
    }
}

class faqCell : UITableViewCell{
  
    @IBOutlet weak var faqview  : UIView!
    @IBOutlet weak var faqlabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.faqview.isElevation = 5
        self.selectionStyle = .none
    }
}
