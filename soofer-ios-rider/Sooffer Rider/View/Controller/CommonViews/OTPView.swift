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
    @IBOutlet weak var OtpBtn: UIButton!
    @IBOutlet weak var otpTitle: UILabel!
    @IBOutlet weak var otpTime: UILabel!
    
    var timer : Timer!
    var second = 65
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    
    func initView(view : UIView , submit : @escaping(String) -> (), resend : @escaping(String) -> ()){
        timer = Timer()
        timer = Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(calculateSeconds), userInfo: nil, repeats: true)
        self.second = 65
      
        self.setView(view: view)
        self.setupAction()
        self.setupView()
        self.setupLang()
        self.OtpBtn.addAction(for: .tap) {
            if (self.OtpBtn.currentTitle ?? "") == "Resent OTP"{
                resend("resend")
            }
        }
        self.submitBtn.addAction(for: .tap) {
//            self.deInitView()
            submit("\(self.otpPinView.getPin())")
        }
    }
    
    @objc func calculateSeconds() {
         second -= 1
        if second <= 1 {
//            self.second = 65
            self.timer.invalidate()
//            self.otpTime.text = "Resent OTP"
            self.OtpBtn.setTitle("Resent OTP", for: .normal)
        }else{
            if second > 60{
//                self.otpTime.text = "1 Min \((5-abs(second-65))) Sec"
                self.OtpBtn.setTitle("1 Min \((5-abs(second-65))) Sec", for: .normal)
            }else{
//                self.otpTime.text = "0 Min \((second)) Sec"
                self.OtpBtn.setTitle("0 Min \((second)) Sec", for: .normal)
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
        self.otpTime.text = ""
        self.otpView.layer.cornerRadius = 10
        self.otpView.isElevation = 3
        self.submitBtn.roundeCornorBorder = 18
//        self.otpTime.roundeCornorBorder = 20
        self.OtpBtn.layer.cornerRadius = 18
    }
    
    
    //Mark : Removw view from parent view
    func deInitView() {
        self.otpPinView.clearPin()
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
