//
//  PaymentVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import Lottie
import SkyFloatingLabelTextField


class PaymentVC: UIViewController {

    @IBOutlet weak var lottieVIew: UIView!
    
    @IBOutlet weak var availableBln: UILabel!
    
    @IBOutlet weak var subscriptionEndDate: UILabel!
    @IBOutlet weak var payoutBtn: UIButton!
    @IBOutlet weak var bankBtn: UIButton!
    
    @IBOutlet weak var payoutMainView: UIView!
    @IBOutlet weak var payoutSubview: UIView!
    @IBOutlet weak var payoutDismissView: UIView!
    @IBOutlet weak var viewTransactinBtn: UIButton!
    
    @IBOutlet weak var payoutAmount: SkyFloatingLabelTextField!
    
    @IBOutlet weak var payoutSubmitBtn: UIButton!
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    
    var animationViewLarge = AnimationView()
    
    var payoutVM = CommonVM()
    
    var profileVM = ProfileVM()
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        
        payoutVM = CommonVM(dataService: ApiRoot())
        profileVM = ProfileVM(dataService: ApiRoot())
        
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupData()
    }
    
    func setupView(){
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "driver_credit"))

         self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
        self.revealViewController().rearViewRevealWidth = 220
        self.viewTransactinBtn.roundeCornorBorder = 20
        self.animationViewLarge = AnimationView(name: "wallet")
        let starbuildingAnimation = Animation.named("wallet")
        self.animationViewLarge.animation = starbuildingAnimation
        self.animationViewLarge.animationSpeed = 0.2
        self.animationViewLarge.frame = CGRect(x: -25, y: -20, width: self.lottieVIew.frame.width, height: self.lottieVIew.frame.height)
        self.lottieVIew.addSubview(self.animationViewLarge)
        self.lottieVIew.clipsToBounds = true
        self.lottieVIew.layer.masksToBounds = true
        
        UIView.animate(withDuration: 2.0, delay: 0, options: [.repeat, .autoreverse], animations: {
            self.animationViewLarge.play()
        }, completion: nil)
        
    }
    func setupAction(){
        payoutBtn.addAction(for: closureActions.tap) {
            self.payoutMainView.isHidden = false
        }
        payoutDismissView.addAction(for: closureActions.tap) {
            self.payoutMainView.isHidden = true
        }
        
        payoutSubmitBtn.addAction(for: .tap) {
            self.payoutAttemptApi()
        }
        bankBtn.addAction(for: .tap) {
            var bankDetailsVC = BankDetailsVC.initWithStory()
            self.navigationController?.pushViewController(bankDetailsVC, animated: true)
        }
        self.viewTransactinBtn.addAction(for: .tap) {
                   let vc = ViewTranscationVC.initWithStory()
                   self.navigationController?.pushViewController(vc, animated: true)
               }
    }
    func setupLang(){
        
    }
    
    func setupData(){
        self.availableBln.text = "Available Balance  : " + Constant.priceTag + Constant.credits ?? "0.0"
        
        var date = Constant.profileData.subcriptionEndDate
        self.subscriptionEndDate.text = "Subscription End Date  : " + String(date.prefix(10))
    }
   
    class func initWithStory()->PaymentVC{
        let vc = UIStoryboard.init(name: "Payment", bundle: Bundle.main).instantiateViewController(withIdentifier: "PaymentVC") as! PaymentVC
        return vc
    }
    
    func payoutAttemptApi(){
        payoutVM.payoutApi(view: self.view, amount: payoutAmount.text ?? "")
        payoutVM.successPayoutClosure = {
             self.payoutMainView.isHidden = true
        }
    }
}
