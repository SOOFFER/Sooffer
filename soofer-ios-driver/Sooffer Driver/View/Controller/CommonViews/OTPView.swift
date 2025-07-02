//
//  OTPView.swift
//  RebuStar Driver
//
//  Created by Abservetech on 07/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SVPinView

class OTPView : UIView , UITextFieldDelegate {
    
    //UI Declaraction
    @IBOutlet weak var otpView: UIView!
    @IBOutlet weak var otpbgview: UIView!
    @IBOutlet weak var otpPinView: SVPinView!
    @IBOutlet weak var submitBtn: UIButton!
    @IBOutlet weak var otpTitle: UILabel!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    
    func initView(view : UIView ,pageFrom : String ,tripRotue: TripStatusModel, submit : @escaping(String) -> ()){
        self.setView(view: view)
        self.setupAction()
        self.setupView()
        self.setupLang()
        self.submitBtn.addAction(for: .tap) {
            if pageFrom != "signup"{
                let otp : String = self.otpPinView.getPin()
                print("triprout status:: \(tripRotue.status)")
                if otp == tripRotue.startOTP{
                    submit("\(self.otpPinView.getPin())")
                    print("35645484",otp)
                }else{
                    showToast(msg: "Wrong OTP , please Enter Correct OTP")
                    self.otpPinView.clearPin()
                }
            }else{
                  submit("\(self.otpPinView.getPin())")
            }
        }
    }
    
    func setupAction(){
        self.otpbgview.addAction(for: .tap) {
            self.deInitView()
        }
        self.otpView.addAction(for: .tap) {
            
        }
    }
    
    func setupView(){
        
    }
    
    func setupLang(){
        
    }
    
    
    //MARK: setView Property
    func setView(view : UIView) {
        self.frame = view.bounds
        
        self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
        
        view.addSubview(self)
        
        view.bringSubviewToFront(self)
        
        self.transform = CGAffineTransform(translationX: 0, y: 0)//.concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
        
        UIView.animate(withDuration: 0.5) {
            self.transform = .identity
        }
        
        self.otpView.layer.cornerRadius = 10
        self.otpView.isElevation = 3
        self.submitBtn.roundeCornorBorder = 20
        self.otpPinView.clearPin()
    }
    
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
            self.removeFromSuperview()
        }) { (true) in
            self.removeFromSuperview()
        }
    }
    
    //MARK: Register xib view
    class var getView : OTPView {
        return UINib(nibName: "OTPView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! OTPView
    }
    
}
