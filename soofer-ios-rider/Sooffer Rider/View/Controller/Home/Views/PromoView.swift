//
//  PromoView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 09/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import  SkyFloatingLabelTextField
import DropDown

class PromoView : UIView , UITextFieldDelegate {
    
    //UI Declaraction
    @IBOutlet weak var btnTop : UIButton!
    @IBOutlet weak var btnbottom : UIButton!
    @IBOutlet weak var btnleft : UIButton!
    @IBOutlet weak var btnRight : UIButton!
    @IBOutlet weak var submitBtn: UIButton!
    
    @IBOutlet weak var promoView: UIView!
    
    @IBOutlet weak var EntPromoCodVIEW: UIView!
    @IBOutlet weak var promoTitle: UILabel!
    @IBOutlet weak var promoTXF: SkyFloatingLabelTextField!
    
   
  
    @IBOutlet weak var cancelBtn: ImageLoader!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
      var homevm = HomeVM()
    
    override func awakeFromNib() {
        super.awakeFromNib()
    
        }
    
    
   
    
    
    
    func initView(view : UIView , promo : @escaping(String)->()){
        self.homevm = HomeVM(view: self, dataService: ApiRoot())
        
        self.setView(view: view)
        self.setupAction()
        self.setupView()
        self.setupLang()
    }
    
    func setupAction(){
        btnTop.addAction(for: .tap) {
            self.deInitView()
        }
        btnbottom.addAction(for: .tap) {
            self.deInitView()
        }
        btnleft.addAction(for: .tap) {
            self.deInitView()
        }
        btnRight.addAction(for: .tap) {
            self.deInitView()
        }
        submitBtn.addAction(for: .tap) {
            let code : String = self.promoTXF.text ?? ""
            
            if code.isEmpty{
                self.promoTXF.errorMessage = "Please enter Promo code"
            }else{
               self.getPromocode(code: code)
            }
        }
        cancelBtn.addAction(for: .tap) {
            self.deInitView()
        }
    }
    
    func setupView(){
        self.submitBtn.roundeCornorBorder = 20
        
        self.promoView.roundeCornorBorder = 10
        self.promoView.isElevation = 3
        
    }
    
    func setupLang(){
        //UI View Text names
        self.promoTXF.placeholder = Localize.stringForKey(key: "enter_promo_code")
        self.promoTXF.title = Localize.stringForKey(key: "promo_code_s")
        
        self.submitBtn.setTitle(Localize.stringForKey(key: "submit"), for: .normal)
    }
    
    
    //MARK: setView Property
    func setView(view : UIView) {
        self.frame = view.bounds
        
        self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
        
        view.addSubview(self)
        
        view.bringSubviewToFront(self)
        
        self.transform = CGAffineTransform(translationX: 0, y: 0)
        
        UIView.animate(withDuration: 0.5) {
            self.transform = .identity
        }
    }
    
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
            self.transform = CGAffineTransform(translationX: 0, y: 0)
            self.removeFromSuperview()
        }) { (true) in
            self.removeFromSuperview()
        }
    }
    
    //MARK: Register xib view
    class var getView : PromoView {
        return UINib(nibName: "PromoView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! PromoView
    }
}

//Api call
extension PromoView{
    func getPromocode(code : String){
        self.homevm.validatePromo(view: self, code: code)
        
        self.homevm.errpromo = {
            self.promoTXF.text = ""
            showToast(msg: self.homevm.errpromoSuccess ?? "This code is not valid")
            self.deInitView()
        }
        
        self.homevm.promosuccess = {
//            self.promoTXF.promoSuccess
            UserDefaults.standard.set(self.promoTXF.text ?? "", forKey: UserDefaultsKey.promo)
            print("success\(self.homevm.promoSuccess)")
            showToast(msg: "You get discount for USD \(self.homevm.promoSuccess ?? "0")")
            self.deInitView()
        }
    }
}

