//
//  PaymentVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import Stripe

class PaymentVC: UIViewController {

    
    @IBOutlet weak var nocardView: UIView!
    
    @IBOutlet weak var cardnumView: UIView!
   
    @IBOutlet weak var testcardView: UIView!
    @IBOutlet weak var nocardAvailabeLbl: UILabel!
    @IBOutlet weak var nocardcontentLbl: UILabel!
    
    @IBOutlet weak var addcardBtn: UIButton!
    
    @IBOutlet weak var cardNmTitlLbl: UILabel!
    @IBOutlet weak var cardnulbl: UILabel!
    
    @IBOutlet weak var viewCardBtn: UIButton!
    @IBOutlet weak var addnewCardBtn: UIButton!
    
    @IBOutlet weak var notesTitleLbl: UILabel!
    
    @IBOutlet weak var cardTypeLbl: UILabel!
    
    @IBOutlet weak var visalbl: UILabel!
    @IBOutlet weak var cardnumLbl: UILabel!
    @IBOutlet weak var cardnum: UILabel!
    @IBOutlet weak var expireLbl: UILabel!
    @IBOutlet weak var expire: UILabel!
    @IBOutlet weak var cvvlbl: UILabel!
    @IBOutlet weak var cvv: UILabel!
    
    @IBOutlet weak var backview: UIView!
    @IBOutlet weak var naviview: UIView!
    @IBOutlet weak var titlelable: UILabel!
   
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    //VariableDeclaraction
   
    let Localize : Localizations = Localizations.instance
    var stripeToken : String = ""
    var cardnumstr : String = ""
    var pagefrom  = Bool()
    
    
    var paymentvm = PaymentVM()
    var profile = ProfileVM()
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        profile = ProfileVM(dataService: ApiRoot())
        self.paymentvm = PaymentVM(dataService: ApiRoot())
        self.navigationController?.isNavigationBarHidden = true
        profileApi()
        self.setupData()
//        if pagefrom{
//            self.navigationController?.isNavigationBarHidden = true
//        } else {
//            self.navigationController?.isNavigationBarHidden = false
//            naviview.isHidden = true
//        }
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.paymentvm = PaymentVM(dataService: ApiRoot())
        
        profile = ProfileVM(dataService: ApiRoot())
        profileApi()
      
        self.setupData()
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupData()
    }
   
    
    func setupView(){
     //   self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "card_detail"))
        print("is page from:: \(pagefrom)")
        
     /*   if pagefrom {
           // self.navigationController?.popViewController(animated: true)
            self.navigationController?.isNavigationBarHidden = true
        } else {
            self.navigationController?.isNavigationBarHidden = false
            self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer()!))
            self.revealViewController().rearViewRevealWidth = 220
            
        }*/
//        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//        self.revealViewController().rearViewRevealWidth = 220
//
        self.testcardView.isElevation = 3
        self.testcardView.layer.cornerRadius = 10
        self.cardnumView.isElevation = 3
        self.cardnumView.layer.cornerRadius = 10
        
        self.addcardBtn.layer.cornerRadius = 10
        self.viewCardBtn.layer.cornerRadius = 10
        self.addnewCardBtn.layer.cornerRadius = 10
    }
    
    func profileApi() {
        self.profile.getProfile()
        self.profile.successprofile = {
            DispatchQueue.main.asyncAfter(deadline: .now()+0.2, execute: {
//                self.nocardview.isHidden = true
//                self.cardnumberview.isHidden = false
                let last4 = UserDefaults.standard.string(forKey: UserDefaultsKey.last4) ?? ""
                self.cardnulbl.text = "XXXX XXXX XXXX " + last4
               // self.setupData()
            })
        }
    }
    func setupAction(){
        self.addcardBtn.addAction(for: .tap) {
            self.handleAddPaymentOptionButtonTapped()
//            showToast(msg: "Cash payment only available right now")
        }
        self.addnewCardBtn.addAction(for: .tap) {
            self.handleAddPaymentOptionButtonTapped()
//            showToast(msg: "Cash payment only available right now")
        }
        
        self.viewCardBtn.addAction(for: .tap) {
            
        }
        self.backview.addTap {
            self.sideMenuController?.revealMenu()
           /* if self.pagefrom {
                self.navigationController?.popViewController(animated: true)
            } else {
                self.sideMenuController?.revealMenu()
                //self.navigationController?.popViewController(animated: true)
//                self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//                        self.revealViewController().rearViewRevealWidth = 220
            }*/
        }
    }
    
    func setupData(){
        if let profile : ProfileModel = Constant.profileData as? ProfileModel{
            print("cardnum:: \(profile.card.last4)")
            if profile.card.last4.isEmpty{
                self.nocardView.isHidden = false
                self.cardnumView.isHidden = true
            }else{
                self.nocardView.isHidden = true
                self.cardnumView.isHidden = false
                self.cardnulbl.text = "XXXX XXXX XXXX " + profile.card.last4.description
            }
        }
    }
    
    func setupLang(){
        self.addcardBtn.setTitle(self.Localize.stringForKey(key: "add_card"), for: .normal)
        self.viewCardBtn.setTitle(self.Localize.stringForKey(key: "view_card"), for: .normal)
        self.nocardAvailabeLbl.text = self.Localize.stringForKey(key: "no_card")
        self.notesTitleLbl.text = self.Localize.stringForKey(key: "note")
        self.nocardcontentLbl.text = self.Localize.stringForKey(key: "plz_add_card")
        self.cardNmTitlLbl.text = self.Localize.stringForKey(key: "card_num_title")
        self.cardnulbl.text = "XXXX XXXX XXXX 2121"
        self.cardTypeLbl.text = self.Localize.stringForKey(key: "card_type")
        self.cardnumLbl.text = self.Localize.stringForKey(key: "card_num")
        self.expireLbl.text = self.Localize.stringForKey(key: "expire")
        self.cvvlbl.text = self.Localize.stringForKey(key: "cvv")
    }
   
    class func initWithStory()->PaymentVC{
        let vc = UIStoryboard.init(name: "Payment", bundle: Bundle.main).instantiateViewController(withIdentifier: "PaymentVC") as! PaymentVC
        return vc
    }

}

extension PaymentVC: STPPaymentCardTextFieldDelegate, STPAddCardViewControllerDelegate{
    func addCardViewController(_ addCardViewController: STPAddCardViewController, didCreatePaymentMethod paymentMethod: STPPaymentMethod, completion: @escaping STPErrorBlock) {
        print(paymentMethod)
    }
    
    
    func handleAddPaymentOptionButtonTapped() {
        // Setup add card view controller
        let addCardViewController = STPAddCardViewController()
        addCardViewController.delegate = self
        
        // Present add card view controller
        let navigationController = UINavigationController(rootViewController: addCardViewController)
        present(navigationController, animated: true)
    }
    
    // MARK: STPAddCardViewControllerDelegate
    
    func addCardViewControllerDidCancel(_ addCardViewController: STPAddCardViewController) {
        // Dismiss add card view controller
        dismiss(animated: true)
    }
    
func addCardViewController(_ addCardViewController: STPAddCardViewController, didCreateToken token: STPToken, completion: @escaping STPErrorBlock) {
        
        stripeToken = "\(token)"
    self.addcardToken(cardToken: stripeToken, lastdigit: token.card?.last4 ?? "")
        dismiss(animated: true)
    }
}

extension PaymentVC{
    func addcardToken(cardToken : String, lastdigit : String){
        self.paymentvm.addCard(view: self.view, cardToken: cardToken, Cardnumber: lastdigit)
        self.paymentvm.successcardadd = {
            showToast(msg: self.paymentvm.paymentReposne?.message ?? "")
                self.profile.getProfile()
                self.profile.successprofile = {
                    print("Cardnumber:: \(Constant.profileData.card.last4)")
                    DispatchQueue.main.asyncAfter(deadline: .now()+0.2, execute: {
                        self.nocardView.isHidden = true
                        self.cardnumView.isHidden = false
                        
                        self.cardnulbl.text = "XXXX XXXX XXXX " + Constant.profileData.card.last4
                        print("last4 :: \(self.cardnulbl.text)")
                        if self.pagefrom {
                    self.navigationController?.popViewController(animated: true)
                        }
//                        let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
//                        self.appDelegate.window?.rootViewController = MenuRoot
                    })
                }
        }
    }
}
