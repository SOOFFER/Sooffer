//
//  TripStatusView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 01/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation

class TripStatusView : UIView{
    
    @IBOutlet weak var tripStatusView: UIView!
    @IBOutlet weak var shareView: UIView!
    @IBOutlet weak var cancelView: UIView!
    @IBOutlet weak var messageView: UIView!
    @IBOutlet weak var callView: UIView!
    
    @IBOutlet weak var userImage: UIImageView!
    @IBOutlet weak var vechileImage: UIImageView!
    
    @IBOutlet weak var otpLbl: UILabel!
    
    @IBOutlet weak var callLbl: UILabel!
    @IBOutlet weak var messageLbl: UILabel!
    
    @IBOutlet weak var shareLbl: UILabel!
    @IBOutlet weak var cancelLbl: UILabel!
    
    @IBOutlet weak var usernameLbl: UILabel!
    @IBOutlet weak var vechileNameLbl: UILabel!
    
    //variable declraction
    let Localize : Localizations = Localizations.instance
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    func initView(view : UIView , tripStatus : @escaping(String) -> ()){
        self.setView(view: view)
        self.setupLang()
        self.setupAction()
        tripStatus("TripStarted")
    }
    
    //MARK: setView Property
    func setView(view : UIView) {
        //View Animation
        DispatchQueue.main.asyncAfter(deadline: .now()+0.2) {
            
            self.frame = CGRect(x: 0,
                                y: view.frame.height * 0.72 ,
                                width: view.frame.width,
                                height: view.frame.height * 0.28)
            
            self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
            
            view.addSubview(self)
            
            view.bringSubviewToFront(self)
            
        }
        
        self.transform = CGAffineTransform(translationX: 0, y: view.frame.height)//.concatenating(CGAffineTransform(scaleX: 0.8, y: 0.8))
        
        UIView.animate(withDuration: 0.5) {
            self.transform = .identity
        }
        self.leftRightRoundCorners(radius: 15.0)
        
        self.otpLbl.isElevation = 1
        
    }
    
    func setupAction(){}
    
    func setupLang(){
        self.callLbl.text = Localize.stringForKey(key: "call")
        self.messageLbl.text = Localize.stringForKey(key: "message")
        self.shareLbl.text = Localize.stringForKey(key: "share")
        self.cancelLbl.text = Localize.stringForKey(key: "cancel")
    }
    
    func setData(){
        
    }
    
    //Mark : Removw view from parent view
    func deInitView() {
        UIView.animate(withDuration: 0.3, animations: {
            self.transform = CGAffineTransform(translationX: 0, y: 0) //.concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
        }) { (true) in
            self.removeFromSuperview()
            NotificationCenter.default.post(name: .closeEstimateFare, object: nil)
        }
    }
    
    //MARK: Register xib view
    class var getView : TripStatusView {
        return UINib(nibName: "TripStatusView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! TripStatusView
    }
}
