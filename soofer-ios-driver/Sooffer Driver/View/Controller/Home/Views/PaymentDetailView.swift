//
//  PaymentDetailView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 07/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import GoogleMaps

class PaymentDetailView : UIView
{
    
   
    
    // UI Declaraction
    @IBOutlet weak var EstimateTileLbl: UILabel!
    @IBOutlet weak var rideFareLbl: UILabel!
    @IBOutlet weak var baseFareLbl: UILabel!
    @IBOutlet weak var timeFareLbl: UILabel!
    @IBOutlet weak var pickupFareLbl: UILabel!
    @IBOutlet weak var accessFeeLbl: UILabel!
    @IBOutlet weak var cancellationFeeLbl: UILabel!
    @IBOutlet weak var subTotalLbl: UILabel!
    
    @IBOutlet weak var ridePriceLbl: UILabel!
    @IBOutlet weak var basePriceLbl: UILabel!
    @IBOutlet weak var timePriceLbl: UILabel!
    @IBOutlet weak var pickupPriceLbl: UILabel!
    @IBOutlet weak var accessPriceLbl: UILabel!
    @IBOutlet weak var cancellationPriceLbl: UILabel!
    @IBOutlet weak var subTotalPriceLbl: UILabel!
    
    @IBOutlet weak var userWalletLbl: UILabel!
    
    @IBOutlet weak var rideLaterBtn: UIButton!
    @IBOutlet weak var requestNowBtn: UIButton!
   
    @IBOutlet weak var rideFateView: UIView!
    @IBOutlet weak var baseFareView: UIView!
    @IBOutlet weak var timeFareView: UIView!
    @IBOutlet weak var pickupChargeView: UIView!
    @IBOutlet weak var accessFeeView: UIView!
    @IBOutlet weak var cancellationFeeView: UIView!
    @IBOutlet weak var subTotalView: UIView!
    @IBOutlet weak var walletView: UIView!
   
    
    @IBOutlet weak var checkImg: UIImageView!
    @IBOutlet weak var closeImage: UIImageView!
    
    //Variyable Declaraction
    
    let Localize : Localizations = Localizations.instance
    var reduceHeight : CGFloat = 0.0
    var homevm = HomeVM()
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    func initView(view : UIView ,pickupLoc: CLLocation, dropLoc: CLLocation,  pickupCity: String, requestNow : @escaping(String) -> () , requestLater : @escaping(String) -> ()){
        self.setView(view: view)
        self.setupLang()
        self.setupAction()
        
        self.requestNowBtn.addAction(for: .tap) {
            requestNow("Requested")
            self.deInitView(request: "Requested")
        }
        
        
        self.homevm = HomeVM(view: self, dataService: ApiRoot())
        
        
    }
    
    //MARK: setView Property
    func setView(view : UIView) {
        //View Animation
        UIView.animate(withDuration: 0.6, animations: { [weak self] in
            let frame = self?.frame
            let yComponent = self?.frame.height
            self?.autoresizingMask =  [.flexibleWidth, .flexibleHeight]

            view.addSubview(self!)
            view.bringSubviewToFront(self!)
            if self?.rideFateView.isHidden ?? false{
                self!.reduceHeight += 30.0
            }
            if self?.baseFareView.isHidden ?? false{
                self!.reduceHeight += 30.0
            }
            if self?.timeFareView.isHidden ?? false{
                self!.reduceHeight += 30.0
            }
            if self?.pickupChargeView.isHidden ?? false{
                self!.reduceHeight += 30.0
            }
            if self?.accessFeeView.isHidden ?? false{
                self!.reduceHeight += 30.0
            }
            if self?.cancellationFeeView.isHidden ?? false{
                self!.reduceHeight += 30.0
            }
            
            self?.frame = CGRect(x: 0, y: view.frame.height-frame!.height+self!.reduceHeight, width: view.frame.width, height: frame!.height-self!.reduceHeight)
            self?.transform = CGAffineTransform(translationX: 0, y: 0).concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
            self?.transform = .identity
            
            let heightInfo = ["height": self?.reduceHeight.description]
            NotificationCenter.default.post(name: .addedEstimateFare, object: nil,userInfo: heightInfo)
            
            //View setup
            self?.rideLaterBtn.roundeCornorBorder = 20
            self?.requestNowBtn.roundeCornorBorder = 20
            self?.leftRightRoundCorners(radius: 15.0)
            self?.closeImage.isElevation = 2
            
            
        })
    }
    
    func setupAction(){
        self.checkImg.addAction(for: .tap) {
            if self.checkImg.image == UIImage(named: "unchecked"){
                self.checkImg.image = UIImage(named: "checked")
            }else{
                self.checkImg.image = UIImage(named: "unchecked")
            }
        }
        
        self.walletView.addAction(for: .tap) {
            if self.checkImg.image == UIImage(named: "unchecked"){
                self.checkImg.image = UIImage(named: "checked")
            }else{
                self.checkImg.image = UIImage(named: "unchecked")
            }
        }
        
        self.closeImage.addAction(for: .tap) {
            self.deInitView(request: "")
        }
    }
    
    func setupLang(){
        self.EstimateTileLbl.text = Localize.stringForKey(key: "estimate_fare")
        self.rideFareLbl.text = Localize.stringForKey(key: "ride_fare")
        self.baseFareLbl.text = Localize.stringForKey(key: "base_fare")
        self.timeFareLbl.text = Localize.stringForKey(key: "time_fare")
        self.pickupFareLbl.text = Localize.stringForKey(key: "pickup_charge")
        self.accessFeeLbl.text = Localize.stringForKey(key: "access_fee")
        self.cancellationFeeLbl.text = Localize.stringForKey(key: "cancellation_fee")
        self.subTotalLbl.text = Localize.stringForKey(key: "subtotal")
        self.userWalletLbl.text = Localize.stringForKey(key: "use_wallet")
        self.rideLaterBtn.setTitle(Localize.stringForKey(key: "ride_later"), for: .normal)
        self.requestNowBtn.setTitle(Localize.stringForKey(key: "request_now"), for: .normal)
    }
    
    func setData(){
        
        self.ridePriceLbl.text = decimalDataString(data : "0.1")
        self.basePriceLbl.text = "0.1"
        self.timePriceLbl.text = "0.1"
        self.pickupPriceLbl.text = "0.1"
        self.accessPriceLbl.text = "0.1"
        self.cancellationPriceLbl.text = "0.1"
        self.subTotalPriceLbl.text = "0.1"
    }
    
    //Mark : Removw view from parent view
    func deInitView(request : String) {
        UIView.animate(withDuration: 0.3, animations: {
            self.transform = CGAffineTransform(translationX: 0, y: 0).concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
        }) { (true) in
            if !request.isEmpty{
                self.removeFromSuperview()
                let heightInfo = ["requestHeight": "50"]
                NotificationCenter.default.post(name: .requestedView, object: nil,userInfo: heightInfo)
            }else{
                self.removeFromSuperview()
                NotificationCenter.default.post(name: .closeEstimateFare, object: nil)
            }
        }
    }
    
    //MARK: Register xib view
    class var getView : PaymentDetailView {
        return UINib(nibName: "PaymentDetailView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! PaymentDetailView
    }
}

//Api call
extension PaymentDetailView{
    func getFareDetail( pickupLoc: CLLocation, dropLoc: CLLocation,  pickupCity: String){
        
    }
}
