//
//  InternetIssueView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 09/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import Lottie
import Alamofire



class InternetIssueView : UIView , UITextFieldDelegate {
    
    //UI Declaraction
    @IBOutlet weak var retryBtn: UIButton!
    @IBOutlet weak var lottieView: UIView!
    
    @IBOutlet weak var errorMsg: UILabel!
    @IBOutlet weak var errorTitle: UILabel!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    
    var animationViewSMall = LottieAnimationView()
    
    var animationViewLarge = LottieAnimationView()
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    
    func initView(view : UIView ){
        self.setView(view: view)
        self.setupAction()
        self.setupView()
        self.setupLang()
    }
    
    func setupAction(){
        self.retryBtn.addAction(for: .tap) {
            if  NetworkReachabilityManager()!.isReachable {
                self.deInitView()
            }else{
                showToast(msg: StringFile.err_network)
            }
        }
    }
    
    func setupView(){
        
        self.animationViewSMall = LottieAnimationView(name: "poorNetwork")
        self.animationViewLarge = LottieAnimationView(name: "building")
//        let starbuildingAnimation = Animation.named("building")
//        self.animationViewLarge.animation = starbuildingAnimation
        self.animationViewLarge.animationSpeed = 0.5
        self.lottieView.addSubview(self.animationViewLarge)
        self.animationViewLarge.play()
        
        self.retryBtn.roundeCornorBorder = 10
    }
    
    func setupLang(){
        self.errorTitle.text = Localize.stringForKey(key: "net_title")
        self.errorMsg.text = Localize.stringForKey(key: "net_msg")
        self.retryBtn.setTitle(Localize.stringForKey(key: "retry"), for: .normal)
    }
    
    
    //MARK: setView Property
    func setView(view : UIView) {
        self.frame = view.bounds
        
        self.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
        
        view.addSubview(self)
        
        view.bringSubviewToFront(self)
    }
    
    //Mark : Removw view from parent view
    func deInitView() {
        self.removeFromSuperview()
    }
    
    //MARK: Register xib view
    class var getView : InternetIssueView {
        return UINib(nibName: "InterNetErrorView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! InternetIssueView
    }
    
}
