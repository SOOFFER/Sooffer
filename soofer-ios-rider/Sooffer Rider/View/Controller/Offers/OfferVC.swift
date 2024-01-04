//
//  OfferVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import Kingfisher

class OfferVC: UIViewController {
    
    
    @IBOutlet weak var offerTable: UITableView!
    @IBOutlet weak var offerimage: UIImageView!
    @IBOutlet weak var offertitle: UILabel!

    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var offerVM = CommonVM()
    
    var offerdata : OfferModel?{
        didSet{
            guard let data : OfferModel = offerdata else {
                return
            }
            self.offerTable.reloadData()
        }
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.offerVM = CommonVM(view: self.view, dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupDelegate()
    }
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true

        self.getOfferList()
    }
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
    }
    func setupView(){
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "offers"))
//        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//        self.revealViewController().rearViewRevealWidth = 220
    }
    
    func setupDelegate(){
        self.offerTable.register(UINib(nibName: "offerCell", bundle: nil), forCellReuseIdentifier: "OfferCell")
        self.offerTable.delegate = self
        self.offerTable.dataSource = self
    }
    func setupAction(){
        self.offerimage.addAction(for: .tap) {
            self.sideMenuController?.revealMenu()
        }
    }
    func setupLang(){
        
    }
    class func initWithStory()->OfferVC{
        let vc = UIStoryboard.init(name: "Offers", bundle: Bundle.main).instantiateViewController(withIdentifier: "OfferVC") as! OfferVC
        return vc
    }
}

extension OfferVC : UITableViewDataSource,UITableViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count : Int = self.offerdata?.offerlist.count{
            if count > 0{
                ShowMsginWindow.instanse.hideNodataView()

                return count
            }else{
                
                ShowMsginWindow.instanse.nodataView(view: self.view)
            }
        }
      
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "OfferCell", for: indexPath) as! OfferCell
        if let  offer =   self.offerdata?.offerlist[indexPath.row]{
            cell.offerTitle.text = offer.desc
            cell.offerTxt.text = offer.title
            var urls : String = offer.file ?? String()
            //cell.offerImg.pin_setImage(from: URL(string: urls))
            let urlkf = URL(string: urls)
            cell.offerImg.kf.setImage(with: urlkf)
            cell.shareView.addAction(for: .tap) {
                let text : String = "Hi , you can use this add from this link -> https://itunes.apple.com/us/app/rebustar-rider/id1414323066?ls=1&mt=8"
                let vc = UIActivityViewController(activityItems: [text], applicationActivities: nil)
                vc.excludedActivityTypes = [.print, .copyToPasteboard, .assignToContact, .saveToCameraRoll, .airDrop]
                vc.popoverPresentationController?.sourceView = cell.shareView
                DispatchQueue.main.async {
                    self.present(vc, animated: true, completion: nil);
                }
            }
        }
        return cell
        
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
       return 220
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
}
// Api call
extension OfferVC {
    func getOfferList(){
        self.offerVM.getOfferList(view: self.view)
        
        self.offerVM.successOffer = {
            self.offerdata = self.offerVM.offerList
        }
        
    }
 
}
