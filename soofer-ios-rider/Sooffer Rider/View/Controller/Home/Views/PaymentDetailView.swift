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
    
    //API Response
    var fareDetail : EstimateFareDetails?{
        didSet{
            print("FareDetailsss",fareDetail?.vehicleDetailsAndFare.fareDetails.totalFare)
            self.setData()
        }
    }
    
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
    @IBOutlet weak var nightfarealert: UILabel!
    
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
   
    @IBOutlet weak var nightFareView: UIView!
    
    @IBOutlet weak var checkImg: UIImageView!
    @IBOutlet weak var closeImage: UIImageView!
    
    //schedule Ride View
    
    @IBOutlet weak var scheduleRideView: UIView!
    @IBOutlet weak var schudelTitleLbl: UILabel!
    @IBOutlet weak var dateTimeView: UIView!
    
    @IBOutlet weak var timeView: UIView!
    @IBOutlet weak var dateView: UIView!
    @IBOutlet weak var dateLbl: UILabel!
   
    @IBOutlet weak var seletecdateLbl: UILabel!
    
    @IBOutlet weak var selectedTimeLbl: UILabel!
    @IBOutlet weak var timeLbl: UILabel!
    @IBOutlet weak var schudleBtn: UIButton!
    @IBOutlet weak var cancelBtn: UIButton!
    
    
    @IBOutlet weak var doneBtn: UIBarButtonItem!
    @IBOutlet weak var donetoolbar: UIToolbar!
    @IBOutlet weak var datePicker: UIDatePicker!
    @IBOutlet weak var datePickerView: UIView!
    
    @IBAction func doneBtnAct(_ sender: Any) {
       
        
        if self.dateTime == "date"{
            let dateFormatter = DateFormatter()
            self.datePicker.datePickerMode = .date
            dateFormatter.dateFormat = "dd-MM-yyyy"
            datePicker.minimumDate = Calendar.current.date(byAdding: .day, value: +1, to: Date())
            datePicker.maximumDate = Calendar.current.date(byAdding: .day, value: +7, to: Date())
            seletecdateLbl.text = dateFormatter.string(from: datePicker.date)
            self.self.datePickerView.isHidden = true
            
        }else if self.dateTime == "time"{
            
            let dateFormatter = DateFormatter()
            self.datePicker.datePickerMode = .time
            dateFormatter.dateFormat = "hh:mm a"
            dateFormatter.timeZone = TimeZone(identifier: "GMT +5:30")
            selectedTimeLbl.text = dateFormatter.string(from: datePicker.date)
            self.self.datePickerView.isHidden = true
        }
    }
    
    
    //Variyable Declaraction
    
    let Localize : Localizations = Localizations.instance
    var reduceHeight : CGFloat = 0.0
    var servicedetail : VechileListData = VechileListData()
    var homevm = HomeVM()
    var screenView = UIView()
    var dateTime : String = ""
    var redirectHome : RedirectHome = .hour
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
    func initView(view : UIView , seriveDetail : VechileListData,pickupLoc: CLLocation, dropLoc: CLLocation,  pickupCity: String, requestNow : @escaping(RideRequestModel , String) -> () , requestLater : @escaping(String) -> ()){
        self.setView(view: view)
        self.setupLang()
        self.setupAction()
        
        self.servicedetail = seriveDetail
        self.homevm = HomeVM(view: self, dataService: ApiRoot())
        
        self.getFareDetail(pickupLoc: pickupLoc, dropLoc: dropLoc, serviceDetail: seriveDetail, pickupCity: pickupCity)
        
        
        self.requestNowBtn.addAction(for: .tap) {
            var payment : String = ""
          
            let date = Date()
           
            let formatter = DateFormatter()
            formatter.dateFormat = "dd-MM-yyyy"
            let dateStr : String = formatter.string(from: date)
            
            let timeformatter = DateFormatter()
            timeformatter.dateFormat = "hh:mm a"
            let time : String = timeformatter.string(from: date)
            
            if self.checkImg.image != UIImage(named: "unchecked"){
                payment = "wallet"
            }else{
                payment = UserDefaults.standard.value(forKey: UserDefaultsKey.payment) as? String ?? ""
            }
            
            self.sendRideRequest(view: self, date: dateStr, paymentType: payment, pickupCity: pickupCity, bookingtype: "rideNow", tripTime: time, utc: "", estimateFare: self.fareDetail ?? EstimateFareDetails(), requestResponse: {(requestData) in
                 requestNow(requestData , "rideNow")
            })
        }
        
        self.rideLaterBtn.addAction(for: .tap) {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "dd-MM-yyyy"
            self.seletecdateLbl.text = dateFormatter.string(from: Date())
            
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "hh:mm a"
            timeFormatter.timeZone = TimeZone(identifier: "GMT +5:30")
            
            self.selectedTimeLbl.text = timeFormatter.string(from: Date())
            
            self.scheduleRideView.isHidden = false
            self.scheduleRideView.frame = CGRect(x: 0, y: 0, width: view.frame.width, height: self.frame.height)
        }
        
        self.cancelBtn.addAction(for: .tap) {
            self.scheduleRideView.isHidden = true
//            self.reduceHeight = 0.0
//            self.frame = CGRect(x: 0, y: self.screenView.frame.height-self.frame.height, width: self.screenView.frame.width, height: self.frame.height)
        }
        
        self.dateView.addAction(for: .tap) {
            self.dateTime = "date"
            self.datePickerView.isHidden = false
            self.datePicker.datePickerMode = .date
            
        }
        self.timeView.addAction(for: .tap) {
            self.dateTime = "time"
            self.datePickerView.isHidden = false
            self.datePicker.datePickerMode = .time
            
            let defaultTime = Date().addingTimeInterval(30 * 60)
            self.datePicker.minimumDate = defaultTime
            self.datePicker.setDate(defaultTime, animated: false)
            if #available(iOS 13.4, *) {
                self.datePicker.preferredDatePickerStyle = .wheels
            } else {
                // Fallback on earlier versions
            }
        }
        
        
        self.schudleBtn.addAction(for: .tap) {
            var payment : String = ""
            
            if self.checkImg.image != UIImage(named: "unchecked"){
                payment = "wallet"
            }else{
                payment = UserDefaults.standard.value(forKey: UserDefaultsKey.payment) as? String ?? ""
            }
            self.sendRideRequest(view: self, date: self.seletecdateLbl.text ?? "", paymentType: payment, pickupCity: pickupCity, bookingtype: "rideLater", tripTime: self.selectedTimeLbl.text ?? "", utc: self.selectedTimeLbl.text ?? "", estimateFare: self.fareDetail ?? EstimateFareDetails(), requestResponse: {(requestData) in
                
                self.scheduleRideView.isHidden = true
                requestNow(requestData,"rideLater")
                
            })
        }
        
    }
    
    //MARK: setView Property
    func setView(view : UIView) {
        
        //View Animation
        UIView.animate(withDuration: 0.6, animations: { [weak self] in
            let frame = self?.frame
            let yComponent = self?.frame.height
            self?.autoresizingMask =  [.flexibleWidth, .flexibleHeight]
            self?.screenView = view
            view.addSubview(self!)
            view.bringSubviewToFront(self!)
           
            
            self?.frame = CGRect(x: 0, y: view.frame.height-frame!.height, width: view.frame.width, height: frame!.height)
            self?.transform = CGAffineTransform(translationX: 0, y: 0)
            self?.transform = .identity
            
            let heightInfo = ["height": self?.reduceHeight.description]
            NotificationCenter.default.post(name: .addedEstimateFare, object: nil,userInfo: heightInfo)
            
            //View setup
            self?.rideLaterBtn.roundeCornorBorder = 20
            self?.requestNowBtn.roundeCornorBorder = 20
            self?.leftRightRoundCorners(radius: 15.0)
            self?.closeImage.isElevation = 2
            self?.checkImg.image = UIImage(named: "unchecked")
           
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
        
        self.schudelTitleLbl.text = Localize.stringForKey(key: "schudle_ride")
        self.dateLbl.text = Localize.stringForKey(key: "date")
        self.timeLbl.text = Localize.stringForKey(key: "time")
        self.cancelBtn.setTitle(Localize.stringForKey(key: "cancel"), for: .normal)
        self.schudleBtn.setTitle(Localize.stringForKey(key: "schule"), for: .normal)
        
    }
    
    func setData(){
        if let faredata = self.fareDetail?.vehicleDetailsAndFare{
            
          self.reduceHeight = 0.0
            
            if faredata.fareDetails.fareType == "kmrate"{
                self.pickupChargeView.isHidden = false
                self.accessFeeView.isHidden = false
            }else{
                self.pickupChargeView.isHidden = true
                self.accessFeeView.isHidden = true
            }
            
            if faredata.fareDetails.oldCancellationAmt == "0"{
                self.cancellationFeeView.isHidden = true
            }else{
                self.cancellationFeeView.isHidden = false
            }

            if faredata.fareDetails.nightObj.isApply{
                self.nightFareView.isHidden = false
            }else{
                self.nightFareView.isHidden = true
            }
            
            if let fares : FareDetail = faredata.fareDetails as? FareDetail{
                self.EstimateTileLbl.text = Localize.stringForKey(key: "extimate_fare") + (self.fareDetail?.distanceDetails.distanceLable ?? "0 \(Constant.distanceUnit)") + ")"
                self.ridePriceLbl.text = decimalDataString(data : fares.kMFare.description)
                self.basePriceLbl.text = decimalDataString(data : fares.baseFare.description)
                self.timePriceLbl.text = decimalDataString(data : fares.travelFare.description)
                self.pickupPriceLbl.text = decimalDataString(data : fares.pickupCharge.description)
                self.accessPriceLbl.text = decimalDataString(data : fares.tax.description)
                self.cancellationPriceLbl.text = decimalDataString(data : fares.cancelationFeesRider.description)
                self.subTotalPriceLbl.text = decimalDataString(data : fares.totalFare.description)
                self.nightfarealert.text = fares.nightObj.alertLable
                
                
                if Constant.walletMoney != "0"  {
                    let wallet : Int = Int(Constant.walletMoney ?? "0") ?? 0
                    let total : Int = Int(fares.totalFare.description) ?? 0
                    if wallet < total{
                        self.walletView.isHidden = true
                    }else{
                        self.walletView.isHidden = false
                    }
                }else{
                    self.walletView.isHidden = true
                }
            }
            
           
            
            if self.rideFateView.isHidden ?? false{
                self.reduceHeight += 32.0
            }
            if self.baseFareView.isHidden ?? false{
                self.reduceHeight += 32.0
            }
            if self.timeFareView.isHidden ?? false{
                self.reduceHeight += 32.0
            }
            if self.pickupChargeView.isHidden ?? false{
                self.reduceHeight += 32.0
            }
            if self.accessFeeView.isHidden ?? false{
                self.reduceHeight += 32.0
            }
            if self.cancellationFeeView.isHidden ?? false{
                self.reduceHeight += 32.0
            }
            
            
            
            self.frame = CGRect(x: 0, y: screenView.frame.height-frame.height+self.reduceHeight, width: screenView.frame.width, height: frame.height-self.reduceHeight)
        }
       
    }
    
    //Mark : Removw view from parent view
    func deInitView(request : String) {
        self.frame = CGRect(x: 0, y: screenView.frame.height-frame.height-self.reduceHeight, width: screenView.frame.width, height: frame.height+self.reduceHeight)
        self.reduceHeight = 0.0
        self.rideFateView.isHidden = false
        self.baseFareView.isHidden = false
        self.timeFareView.isHidden = false
        self.pickupChargeView.isHidden = false
        self.accessFeeView.isHidden = false
        
        self.scheduleRideView.isHidden = true
        self.cancellationFeeView.isHidden = false
        UIView.animate(withDuration: 0.3, animations: {
//            self.transform = CGAffineTransform(translationX: 0, y: 0).concatenating(CGAffineTransform(scaleX: 0.5, y: 0.5))
            self.removeFromSuperview()
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
    func getFareDetail( pickupLoc: CLLocation, dropLoc: CLLocation, serviceDetail: VechileListData, pickupCity: String){
        self.homevm.getextimateFare(view: self, pickupLoc: pickupLoc, dropLoc: dropLoc, serviceDetail: serviceDetail, pickupCity: pickupCity, isMultiLocation: "", multiLocation: "")
        
        self.homevm.getFareClouser = {
            self.fareDetail = self.homevm.fareDetail
        }
    }
    
   func sendRideRequest(view: UIView, date: String, paymentType: String, pickupCity: String, bookingtype: String, tripTime: String,utc: String, estimateFare: EstimateFareDetails,requestResponse : @escaping(RideRequestModel) -> ())
        {
            self.homevm.sendRideRequest(view: self, date: date, paymentType: paymentType, pickupCity: pickupCity, bookingtype: bookingtype, tripTime: tripTime, estimateFare: self.fareDetail ?? EstimateFareDetails(), utc: utc, isMultiLocation: "false", multiLocation: "", homeType: redirectHome, withId: "", withNo: "", withName: "", withMake: "", drivergender: "Male")
        self.homevm.getRequestClouser = {
            if let requestdata = self.homevm.request{
    //                 let requestInfo = ["requestID": requestdata.requestDetails ?? ""]
    //                 NotificationCenter.default.post(name: .rideRequestSend, object: nil,userInfo: requestInfo)
    //                self.deInitView(request: "")
                requestResponse(requestdata)
            }
        }
    }
}
