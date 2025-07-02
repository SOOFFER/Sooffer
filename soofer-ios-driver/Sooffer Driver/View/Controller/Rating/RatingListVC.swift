//
//  RatingListVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 06/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class RatingListVC: UIViewController {

    @IBOutlet weak var ratingListTabelView: UITableView!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var ratingvm = RatingVM()
    
    var feebacks : FeedBack? {
        didSet{
            if let feedback = self.feebacks{
                self.ratingListTabelView.reloadData()
            }
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
        self.attemptApi()
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.ratingvm = RatingVM(dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupDelegate()
    }
    
    func setupView(){
        self.title = Localize.stringForKey(key: "feedback")
    }
    
    func setupAction(){
        
    }
    func setupLang(){
        
    }
    
    class func initWithStory()->RatingListVC{
        let vc = UIStoryboard.init(name: "Rating", bundle: Bundle.main).instantiateViewController(withIdentifier: "RatingListVC") as! RatingListVC
        return vc
    }
    
}


extension RatingListVC: UITableViewDataSource,UITableViewDelegate{
    
    func setupDelegate(){
        self.ratingListTabelView.register(UINib(nibName: "FeedbackCell", bundle: nil), forCellReuseIdentifier: "FeedbackCell")
        self.ratingListTabelView.delegate = self
        self.ratingListTabelView.dataSource = self
        self.ratingListTabelView.reloadData()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count = self.feebacks?.feedback.count{
            if count > 0{
                ShowMsginWindow.instanse.hideNodataView()
                return count
            }else{
                ShowMsginWindow.instanse.nodataView(view: self.view)
            }
        }
        ShowMsginWindow.instanse.nodataView(view: self.view)
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FeedbackCell", for: indexPath) as! FeedbackCell
        if let feedback = self.feebacks?.feedback[indexPath.row]{
            cell.usernameLbl.text = feedback.userinfo.fname
            var urls : String = ServiceApi.Base_Image_URL+feedback.userinfo.profile ?? String()
            //cell.userImg?.pin_setImage(from: URL(string: urls))
            let urlkf = URL(string: urls)
            cell.userImg.kf.setImage(with: urlkf)
            cell.userImg.layer.cornerRadius = cell.userImg.frame.width / 2
            cell.userImg.clipsToBounds = true
            
            cell.contentLbl.text = feedback.riderfb.cmts
        }
        return cell
    }
    
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(indexPath.row)
    }
}

extension RatingListVC{
    func attemptApi(){
        
        self.ratingvm.getFeedBAckList(view: self.view)
        
        self.ratingvm.getFeedBackClosuer = {
            self.feebacks = self.ratingvm.feedback
        }
    }
}
