//
//  FaqsubVC.swift
//  Oyaa
//
//  Created by Abservetech on 11/09/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class FaqsubVC: UIViewController {

    @IBOutlet weak var taqTabel : UITableView!
    
    @IBOutlet weak var backimg: UIImageView!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var suuportArray :  [String] = []
    var supportname : String = ""
    var titles : String = ""
    var des : String = ""
    
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
//            self.navigationController?.popToRootViewController(animated: true)
    self.navigationController?.popViewController(animated: true)
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
    class func initWithStory()->FaqsubVC{
        let vc = UIStoryboard.init(name: "Support", bundle: Bundle.main).instantiateViewController(withIdentifier: "FaqsubVC") as! FaqsubVC
        return vc
    }
    
}
extension FaqsubVC : UITableViewDataSource,UITableViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Faqsubcell", for: indexPath) as! Faqsubcell
         cell.faqlabel.text = self.titles
        cell.faqldes.text = self.des
//        cell.faqarrow.addAction(for: .tap) {
//            if cell.faqarrow.image == UIImage(named: "up_arrow"){
//                cell.faqarrow.image = UIImage(named: "down_arrow")
////                cell.faqhieght.constant = 140
////                cell.faqdesview.isHidden = true
//            }else{
//                cell.faqarrow.image = UIImage(named: "up_arrow")
////                cell.faqhieght.constant = 0
////                cell.faqdesview.isHidden = false
//
//
//            }
//        }
        return cell
        
    }
    

    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
    }
}

class Faqsubcell : UITableViewCell{
    
    @IBOutlet weak var faqview  : UIView!
    @IBOutlet weak var faqlabel: UILabel!
    @IBOutlet weak var faqldes: UILabel!
    @IBOutlet weak var faqdesview  : UIView!
    @IBOutlet weak var faqarrow: UIImageView!
  
    @IBOutlet weak var faqhieght: NSLayoutConstraint!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.faqview.isElevation = 5
        self.selectionStyle = .none
    }
}
