//
//  OutstationDetailVC.swift
//  Express Track
//
//  Created by Abservetech on 21/10/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class OutstationDetailVC: UIViewController {

    
    @IBOutlet weak var FareHeightLbl: NSLayoutConstraint!
    
    @IBOutlet weak var vehicleName : UILabel!
    @IBOutlet weak var sourceAddrLbl : UILabel!
    @IBOutlet weak var destinationLbl : UILabel!
    @IBOutlet weak var leaveonLabl : UILabel!
    @IBOutlet weak var retrunLAble : UILabel!
    @IBOutlet weak var returnView : UIView!
    @IBOutlet weak var roundTripKM : UILabel!
    @IBOutlet weak var extmatePriceLbl : UILabel!
    @IBOutlet weak var showFare : UISwitch!
    @IBOutlet weak var fareView : UIView!
    @IBOutlet weak var rideFare : UILabel!
    @IBOutlet weak var rideKMLbl : UILabel!
    @IBOutlet weak var remainKmFare : UILabel!
    @IBOutlet weak var tottalKMLbl : UILabel!
    @IBOutlet weak var accessFeeLbl : UILabel!
    @IBOutlet weak var cancellFeeLbl : UILabel!
    @IBOutlet weak var hourpriceLbl : UILabel!
    @IBOutlet weak var subtotalLbl : UILabel!
    @IBOutlet weak var outStationOptionHeight: NSLayoutConstraint!
    
    
    @IBOutlet weak var approxFare : UILabel!
    @IBOutlet weak var paymentType : UILabel!
    @IBOutlet weak var applycoupon : UILabel!
    @IBOutlet weak var applycouponView : UIView!
    @IBOutlet weak var paymentTypeView : UIView!
    @IBOutlet weak var approxFareView : UIView!
    
    @IBOutlet weak var couponAlertView : UIView!
    
    @IBOutlet weak var confrimBookingBtn : UIButton!
    
    @IBOutlet weak var backImg : UIImageView!
    
    // priceView
    @IBOutlet weak var AlertView: UIView!
    @IBOutlet weak var priceAlertView: UIView!
    @IBOutlet weak var pricealertlogo: UIImageView!
    @IBOutlet weak var priceLbl: UILabel!
    @IBOutlet weak var kmpriceLbl: UILabel!
    @IBOutlet weak var vehiclenameLnl: UILabel!
    @IBOutlet weak var priceinerView: UIView!
    @IBOutlet weak var descView: UIView!
    @IBOutlet weak var descLnl: UILabel!
    
    @IBOutlet weak var vehicleimage : UIImageView!
    @IBOutlet weak var vehicleTopimage : UIImageView!
    @IBOutlet weak var selectCabArrow : UIImageView!
    let promoCodeView = PromoView.getView
    
    @IBAction func ShowFareAction(_ sender: UISwitch) {
       if sender.isOn{
            self.FareHeightLbl.constant = 280
        self.fareView.isHidden = false
       }else{
            self.FareHeightLbl.constant = 0
            self.fareView.isHidden = true
        }
    }
    
    var isReturnTrip : Bool = false
    
    var cabDetails : vehicleListData?
    var timeDuration : String?

    var pickAddr: String?
    var pickupLoc: CLLocation?
    var dropAddr: String?
    var dropLoc: CLLocation?
    var startDate: String?
    var currectLocation: CLLocation?
    var returndate: String?
    var pickupcity : String?
    
    var outstationType : String?
    var leaveOn : String?
    var returnBy : String?
    
    
    var homevm = HomeVM()
    var TripOutstation : TripRoutes?
    var tripreques : TripRoutesOutstation?
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
    }
    
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.homevm = HomeVM(view: self.view, dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupData()
    }

    
    class func initWithStory() -> OutstationDetailVC{
        let vc = UIStoryboard(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "OutstationDetailVC") as! OutstationDetailVC
        return vc
    }
    
    
    func setupAction(){
        self.applycouponView.addAction(for: .tap) {
            self.promoCodeView.initView(view: self.view, promo: {(promo) in
                print("PromoCode",promo)
            })
        }
        
        self.AlertView.addAction(for: .tap) {
            self.AlertView.isHidden = true
        }
        
        self.approxFareView.addAction(for: .tap) {
//            self.AlertView.isHidden = false
//            self.priceAlertView.isHidden = false
        }
        
        self.confrimBookingBtn.addAction(for: .tap) {
            let date = Date()
                          
            let formatter = DateFormatter()
            formatter.dateFormat = "dd-MM-yyyy"
            let dateStr : String = formatter.string(from: date)
                           
            let timeformatter = DateFormatter()
            timeformatter.dateFormat = "hh:mm a"
            let time : String = timeformatter.string(from: date)
                         
            
            self.outstationBooking(view: self.view, date: dateStr, paymentType: "cash", pickupCity: self.pickupcity ?? "", bookingtype: "rideLater", tripTime: time, estimateFare: EstimateFareDetails(), utc: "", packageId: "", vehicleTypeId: self.cabDetails?._id ?? "", serviceType: self.cabDetails?.type ?? "", pickupLoc: self.pickupLoc ?? CLLocation(), dropLoc: self.dropLoc ?? CLLocation(), startDay: self.startDate ?? "", returnDay: self.returndate ?? "", outstationType: self.outstationType ?? "")
        }
        
        self.backImg.addAction(for: .tap) {
            self.navigationController?.popViewController(animated: true)
        }
    }
    
    
    func setupView(){
        self.couponAlertView.isElevation = 3
        //fareView
        self.pricealertlogo.isRoundedView = true
         self.priceinerView.roundeCornorBorder = 10
        self.priceAlertView.isElevation = 10
        self.confrimBookingBtn.roundeCornorBorder = 20
        if isReturnTrip{
            self.returnView.isHidden = false
            self.outStationOptionHeight.constant = 150
        }else{
            self.returnView.isHidden = true
            self.outStationOptionHeight.constant = 110
        }
        
        self.FareHeightLbl.constant = 0
        self.fareView.isHidden = true
    }
    
    
    func setupData(){
        self.sourceAddrLbl.text = self.pickAddr
        self.destinationLbl.text = self.dropAddr
        if let cabdetail = self.cabDetails?.faredetails{
            self.extmatePriceLbl.text = Constant.priceTag+" "+cabdetail.totalFare
            self.rideFare.text = Constant.priceTag+" "+cabdetail.KMFare
            self.tottalKMLbl.text = cabdetail.baseFareLabel
            self.rideKMLbl.text =  Constant.priceTag+" "+cabdetail.remainingFare
            self.remainKmFare.text = cabdetail.remainingFareLabel
            self.hourpriceLbl.text = cabdetail.remainingTimeFareLabel
            self.accessFeeLbl.text =  Constant.priceTag+" "+cabdetail.extraTimeFare
            self.cancellFeeLbl.text =  Constant.priceTag+" "+cabdetail.oldCancellationAmt
            self.subtotalLbl.text =  Constant.priceTag+" "+cabdetail.totalFare
            self.leaveonLabl.text = self.leaveOn
            self.retrunLAble.text = self.returnBy
            if !isReturnTrip{
                self.roundTripKM.text = "One way trip of about \(self.cabDetails?.distanceLable ?? ""), \(self.cabDetails?.timeLable ?? "")"
            }else{
                self.roundTripKM.text = "\(self.timeDuration ?? "") round trip of about \(self.cabDetails?.distanceLable ?? "")"
            }
            self.approxFare.text = Constant.priceTag+" "+cabdetail.totalFare
             var urls : String = self.cabDetails?.file ?? String()
           // self.vehicleimage?.pin_setImage(from: URL(string: urls))
            let urlkf = URL(string: urls)
            self.vehicleimage.kf.setImage(with: urlkf)
            self.vehicleTopimage.kf.setImage(with: urlkf)
            //self.vehicleTopimage?.pin_setImage(from:URL(string: urls))
            if let vehicleImage = self.vehicleimage.image{
                 let tintableImage = vehicleImage.withRenderingMode(.alwaysTemplate)
                 self.vehicleimage.image = tintableImage
                 self.vehicleTopimage.image = tintableImage
             }
            self.vehicleTopimage.tintColor = UIColor.AppColors
            self.vehicleimage.tintColor = UIColor.AppColors
            self.vehicleName.text = self.cabDetails?.type ?? ""
            self.vehiclenameLnl.text = self.cabDetails?.type ?? ""
            self.priceLbl.text = Constant.priceTag+" "+cabdetail.totalFare
            self.kmpriceLbl.text = Constant.priceTag + "\(cabdetail.perKmRate ?? "0.0")/\(Constant.distanceUnit)"
            self.descLnl.text = (cabdetail.description ?? "").htmlToString
        }
    }

}

extension OutstationDetailVC{
    func outstationBooking(view : UIView ,date : String ,paymentType : String , pickupCity : String , bookingtype : String ,tripTime : String, estimateFare : EstimateFareDetails,utc : String,packageId : String,vehicleTypeId : String,serviceType : String,pickupLoc : CLLocation,dropLoc : CLLocation,startDay : String,returnDay : String, outstationType : String){
       
        self.homevm.OutstationConfirmBooking(view: self.view, date: date, paymentType: paymentType, pickupCity: pickupCity, bookingtype: bookingtype, tripTime: tripTime, estimateFare: estimateFare, utc: utc, packageId: "", vehicleTypeId: vehicleTypeId, serviceType: serviceType, pickupLoc: pickupLoc, dropLoc: dropLoc, startDay: startDay, returnDay: returnDay, outstationType: outstationType)
        
        self.homevm.getoutstatRequestClouser = {
            if let requestdata = self.homevm.outstationrequest{
                showToast(msg: requestdata.message ?? "")
                self.TripOutstation?.OutstationRequestData(requestData: requestdata, location: self.currectLocation ?? CLLocation())
                self.tripreques?.popRequestData(pop: "pop")
            }
        }
        
        self.homevm.erroutstatRequestClouser = {
             if let requestdata = self.homevm.erroutstationrequest{
                if (requestdata.message ?? "").isEmpty{
                     self.homevm.OutstationConfirmBooking(view: self.view, date: date, paymentType: paymentType, pickupCity: pickupCity, bookingtype: bookingtype, tripTime: tripTime, estimateFare: estimateFare, utc: utc, packageId: "", vehicleTypeId: vehicleTypeId, serviceType: serviceType, pickupLoc: pickupLoc, dropLoc: dropLoc, startDay: startDay, returnDay: returnDay, outstationType: outstationType)
                }else{
                if requestdata.message == "You already have one Upcoming Trip in Progress, Please finshed that Trip and try again." || requestdata.message == "Outstation request schedule, we will assign Driver before Trip Time" {
//                    showToast(msg: requestdata.message ?? "You have trip already")
                    self.TripOutstation?.errOutstationRequestData(requestData: requestdata, location: self.currectLocation ?? CLLocation())
                    self.tripreques?.popRequestData(pop: "pop")
                    self.navigationController?.popViewController(animated: true)
                 }else{
                    self.navigationController?.popViewController(animated: true)
                    
                }
                }
            }
        }
        
    }
}
