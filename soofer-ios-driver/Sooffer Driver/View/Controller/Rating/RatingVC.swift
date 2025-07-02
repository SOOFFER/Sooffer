//
//  RatingVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 05/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class RatingVC: UIViewController {
   
    @IBOutlet weak var ratingLbl: UILabel!
    @IBOutlet weak var currentRatingLbl: UILabel!
    @IBOutlet weak var lifeTimeLbl: UILabel!
    @IBOutlet weak var lifeTimeCountLbl: UILabel!
    @IBOutlet weak var fivestarTripLbl: UILabel!
    @IBOutlet weak var fivestartCountLbl: UILabel!
    @IBOutlet weak var ratedTripCountLbl: UILabel!
    @IBOutlet weak var ratedTripLbl: UILabel!
    @IBOutlet weak var checkoutLbl: UILabel!
    @IBOutlet weak var riderFeedBackLbl: UILabel!
    
    @IBOutlet weak var feedbackView: UIView!
    
    //VariableDeclaraction
    
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var ratingvm = RatingVM()
  
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
        self.setupData()
    }
    
    func setupView(){
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "rating"))
        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
        self.revealViewController().rearViewRevealWidth = 220
        
    }
    
    func setupAction(){
        self.feedbackView.addAction(for: .tap) {
            let vc = RatingListVC.initWithStory()
            self.navigationController?.pushViewController(vc, animated: true)
        }
        
    }
    func setupLang(){
        self.currentRatingLbl.text = Localize.stringForKey(key: "your_current_trip")
        self.lifeTimeLbl.text = Localize.stringForKey(key: "life_time_trip")
        self.ratedTripLbl.text = Localize.stringForKey(key: "rated_trips")
        self.fivestarTripLbl.text = Localize.stringForKey(key: "fivestar_trip")
        self.riderFeedBackLbl.text = Localize.stringForKey(key: "rider_feedback")
        self.checkoutLbl.text = Localize.stringForKey(key: "feedback_centent")
    }
    
    func setupData(){
        if let rating : Rating = Constant.profileData.rating as? Rating{
            self.lifeTimeCountLbl.text = "\(rating.tottrip)"
            self.ratedTripCountLbl.text = "\(rating.nos)"
            self.fivestartCountLbl.text = "\(rating.star)"
            self.ratingLbl.text = "\(rating.rating)"
        }
    }
    
    class func initWithStory()->RatingVC{
        let vc = UIStoryboard.init(name: "Rating", bundle: Bundle.main).instantiateViewController(withIdentifier: "RatingVC") as! RatingVC
        return vc
    }
}

extension RatingVC{
    func attemptApi(){
        self.ratingvm.getRatingList(view: self.view)
        self.ratingvm.getRatingClosure = {
            Constant.profileData.rating = self.ratingvm.rating ?? Rating()
            self.setupData()
        }
    }
}
