//
//  WalletVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import Lottie

class WalletVC: UIViewController {

    
    
    @IBOutlet weak var yourblanceTitle: UILabel!
    
    @IBOutlet weak var balcnceLbl: UILabel!
    
    @IBOutlet weak var addmoneyTitle: UILabel!
    
    @IBOutlet weak var saftytxtLbl: UILabel!
    
    @IBOutlet weak var viewTransactinBtn: UIButton!
    @IBOutlet weak var addmoneyBtn: UIButton!
    @IBOutlet weak var privacytxtlbl: UILabel!
    @IBOutlet weak var billtxt: UILabel!
    @IBOutlet weak var btn100: UIButton!
    @IBOutlet weak var btn50: UIButton!
    @IBOutlet weak var btn25: UIButton!
    @IBOutlet weak var rechargeTxF: UITextField!
    @IBOutlet weak var rechargeView: UIView!
    @IBOutlet weak var lottie: UIView!
   
    @IBOutlet weak var backimg : UIImageView!
    @IBOutlet weak var titlelbl : UILabel!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var paymentvm = PaymentVM()
    var animationViewLarge = LottieAnimationView()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.getWalletMoney()
        self.navigationController?.isNavigationBarHidden = true
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupView()
        self.paymentvm = PaymentVM(dataService: ApiRoot())
        self.setupAction()
        self.setupLang()
        self.setupData()
    }
    
    func setupView(){
       // self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "mywallet"))
      //  self.sideMenuController?.revealMenu()
//        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//        self.revealViewController().rearViewRevealWidth = 220
        self.titlelbl.text = Localize.stringForKey(key: "mywallet")
        self.animationViewLarge = LottieAnimationView(name: "wallet")
        let starbuildingAnimation = LottieAnimation.named("wallet")
        self.animationViewLarge.animation = starbuildingAnimation
        self.animationViewLarge.animationSpeed = 0.9
        self.animationViewLarge.loopMode = .loop
        self.animationViewLarge.frame = CGRect(x: 0, y: 0, width: self.lottie.frame.width, height: self.lottie.frame.height)
        self.lottie.addSubview(self.animationViewLarge)
        self.lottie.clipsToBounds = true
        self.lottie.layer.masksToBounds = true
//        self.btn25.roundeCornorBorder = 10
//        self.btn50.roundeCornorBorder = 10
//        self.btn100.roundeCornorBorder = 10
//        self.addmoneyBtn.roundeCornorBorder = 20
//        self.viewTransactinBtn.roundeCornorBorder = 20
        self.rechargeView.isElevation = 4
    }
    
    func setupAction(){
        self.backimg.addTap {
            self.sideMenuController?.revealMenu()
        }
        self.btn25.addAction(for: .tap) {
            self.rechargeTxF.text = "25"
        }
        self.btn50.addAction(for: .tap) {
            self.rechargeTxF.text = "50"
            
        }
        self.btn100.addAction(for: .tap) {
            self.rechargeTxF.text = "100"
            
        }
        
        self.privacytxtlbl.addAction(for: .tap) {
          //  TermsConditionView.getView.initView(view: self.view)
        }
        
        self.addmoneyBtn.addAction(for: .tap) {
            let balace : String = self.rechargeTxF.text ?? "0.0"
            if !balace.isEmpty{
                self.addmoney(addmoney: balace)
            }else{
                showToast(msg: "Enter Money")
            }
        }
        
        self.viewTransactinBtn.addAction(for: .tap) {
            let vc = ViewTranscationVC.initWithStory()
            self.navigationController?.pushViewController(vc, animated: true)
        }
        
    }
    
    func setupData(){
     
    }
    
    func setupLang(){
        self.yourblanceTitle.text = self.Localize.stringForKey(key: "your_blnc")
        self.addmoneyTitle.text = self.Localize.stringForKey(key: "add_money")
        self.saftytxtLbl.text = self.Localize.stringForKey(key: "safty")
        self.billtxt.text = self.Localize.stringForKey(key: "proceed")
        self.privacytxtlbl.text = self.Localize.stringForKey(key: "view_tc")
        self.addmoneyBtn.setTitle(self.Localize.stringForKey(key: "add_money"), for: .normal)
        self.viewTransactinBtn.setTitle(self.Localize.stringForKey(key: "view_tran"), for: .normal)
    }

    class func initWithStory()->WalletVC{
        let vc = UIStoryboard.init(name: "Wallet", bundle: Bundle.main).instantiateViewController(withIdentifier: "WalletVC") as! WalletVC
        return vc
    }
}
extension WalletVC{
    func addmoney(addmoney : String){
        
        self.paymentvm.addToMyWallet(view: self.view, rechargeAmount: addmoney)
                                     
        self.paymentvm.successwallet = {
            self.getWalletMoney()
        }
    }
    
    func getWalletMoney(){
        self.paymentvm.getMyWallet(view: self.view)
        self.paymentvm.successwallet = {
            self.balcnceLbl.text = decimalDataString(data: self.paymentvm.walletData?.balance.description ?? "0")
            
        }
    }
}
