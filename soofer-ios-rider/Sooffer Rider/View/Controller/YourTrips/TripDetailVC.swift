//
//  TripDetailVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 25/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import PINRemoteImage
import MarqueeLabel

class TripDetailVC: UIViewController {

    @IBOutlet weak var mapScreenImg: UIImageView!
   
    @IBOutlet weak var userImg: UIImageView!
    
    @IBOutlet weak var userNameLbl: UILabel!
    
    @IBOutlet weak var sourceLbl: MarqueeLabel!
    
    @IBOutlet weak var desgnationLbl: MarqueeLabel!
    
    @IBOutlet weak var totalBill: UILabel!
    
    @IBOutlet weak var vehcileNameLbl: UILabel!
    @IBOutlet weak var totalCostLbl: UILabel!
    @IBOutlet weak var rideStatus: UILabel!
    
    @IBOutlet weak var paymentTitle: UILabel!
    
    @IBOutlet weak var cashTypeLbl: UILabel!
    @IBOutlet weak var rideCashLbl: UILabel!
    
    
    
    @IBOutlet weak var destinationView: UIView!
    @IBOutlet weak var TripFareDetailView: UIView!
    @IBOutlet weak var RentalOutstationView: UIView!
    @IBOutlet weak var NightChargeView: UIView!
    @IBOutlet weak var DailyView: UIView!
    @IBOutlet weak var viewFareDetailsBtn: UIButton!
    @IBOutlet weak var sendRecieptBtn: UIButton!
    
    @IBOutlet weak var MileFareVal: UILabel!
    
    
    @IBOutlet weak var BookingFeeVall: UILabel!
    

    @IBOutlet weak var BaseFareVal: UILabel!
    
    
    @IBOutlet weak var waitingFareVal: UILabel!
    
    
    @IBOutlet weak var PickupFeeVal: UILabel!
    
    @IBOutlet weak var TAXVal: UILabel!
    
    
    @IBOutlet weak var CancelFareVal: UILabel!
    
        
    @IBOutlet weak var TimeFareVal: UILabel!
    
 
    @IBOutlet weak var TollFeeVal: UILabel!
    
    
    @IBOutlet weak var GatewayChargeVal: UILabel!
    
    
    @IBOutlet weak var TotalFareVal: UILabel!
    
    
    
    var popUp: CustomPopup!
    
    @IBAction func SendRecieptBTN(_ sender: Any) {
        
        self.popUp = CustomPopup(frame: self.view.frame, inView: self)
        
        popUp.CancelBTN.addTarget(self, action: #selector(ReciptBTNTapped), for: .touchUpInside)
        self.view.addSubview(popUp)

        print("you clicked invoice BTN")
        
        
     
    }
    @objc func ReciptBTNTapped() {
        
        self.popUp.removeFromSuperview()
  
    }
    
    
    //Outstationdetails
    @IBOutlet weak var basePackgeLbl: UILabel!
    @IBOutlet weak var packageKMLbl: UILabel!
    @IBOutlet weak var fareforRemainingKM: UILabel!
    @IBOutlet weak var etctraANdPackKM: UILabel!
    @IBOutlet weak var fareforRemainingHr: UILabel!
    @IBOutlet weak var etctraANdPackHr: UILabel!
    @IBOutlet weak var driverallowance: UILabel!
    @IBOutlet weak var nightChatgeLbl: UILabel!
    @IBOutlet weak var totalFareBl: UILabel!
    @IBOutlet weak var discountpercetage: UILabel!
    
    @IBOutlet weak var TripInvoiceView: UIView!
    
    
    @IBOutlet weak var kmfareLbl: UILabel!
    @IBOutlet weak var waitingFareLbl: UILabel!
    @IBOutlet weak var pickupFareLbl: UILabel!
    @IBOutlet weak var totalFaccessFareLblareBl: UILabel!
    @IBOutlet weak var cancelFareLbl: UILabel!
    
    @IBOutlet weak var gatewayfareLbl: UILabel!
    @IBOutlet weak var backimg: UIImageView!
    
    //initilaze Variable
    let Localize : Localizations = Localizations.instance
    var tripDetailVM = YourTripsVM()
    var tripId : String = ""
    var tripType : String = ""
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        if let tripid : String = self.tripId as? String{
            getrideDetail(tripId: tripId)
        }
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
    
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.tripDetailVM = YourTripsVM(dataService: ApiRoot())
        self.setupLang()
        self.setupView()
        self.setupAction()
//        self.setUpEmailInvoice()
    }
    
    func setupView(){
        self.mapScreenImg.layer.cornerRadius = 10
        self.RentalOutstationView.isElevation = 10
        self.DailyView.isElevation = 10
        self.DailyView.roundeCornorBorder = 10
        self.RentalOutstationView.roundeCornorBorder = 10
        self.viewFareDetailsBtn.roundeCornorBorder = 20
        self.sendRecieptBtn.roundeCornorBorder = 20
        self.TripFareDetailView.layer.cornerRadius = 10
    }
    
    
  
//
//    func setUpEmailInvoice() {
//        self.sendRecieptBtn.addAction(for: .tap){
////            self.TripInvoiceView.isHidden = true
//
//
//
//    }
    
    func setupAction(){
        self.viewFareDetailsBtn.addAction(for: .tap) {
            self.TripFareDetailView.isHidden = false
             if self.tripType == "rental" || self.tripType == "outstation"{
                self.TripFareDetailView.isHidden = false
                self.RentalOutstationView.isHidden = false
                self.DailyView.isHidden = true
            }else{
                self.TripFareDetailView.isHidden = false
                self.RentalOutstationView.isHidden = true
                self.DailyView.isHidden = false
            }
        }
        
        self.TripFareDetailView.addAction(for: .tap) {
            self.TripFareDetailView.isHidden = true
            //self.DailyView.isHidden = false
        }
        backimg.addTap {
//            self.sideMenuController?.revealMenu()
            self.navigationController?.popToRootViewController(animated: true)
        }
        
        
    }
    func setupLang(){
    }

    class func initWithStory()->TripDetailVC{
        let vc = UIStoryboard.init(name: "YourTrips", bundle: Bundle.main).instantiateViewController(withIdentifier: "TripDetailVC") as! TripDetailVC
        return vc
    }

}
//Api calling
extension TripDetailVC{
    func getrideDetail(tripId : String){
        self.tripDetailVM.getRideDetail(view: self.view, tripId: tripId)
        
        self.tripDetailVM.successTripDetail = {
            print("SuccessTripData",self.tripDetailVM.yourTripDetail)
            self.setData(data: self.tripDetailVM.yourTripDetail ?? TripDetailModel())
        }
    }
    
    func setData(data : TripDetailModel){
        self.userNameLbl.text = data.profileDetail.fname
        self.tripType = data.tripDetail.triptype
        var urls : String = data.profileDetail.profile ?? String()
        //self.userImg?.pin_setImage(from: URL(string: urls))
        let urlkf = URL(string: urls)
        self.userImg.kf.setImage(with: urlkf)
        
        var url : String = data.Mapurl ?? String()
        //self.mapScreenImg?.pin_setImage(from: URL(string: url))
        let mapurl = URL(string: url)
        self.mapScreenImg.kf.setImage(with: mapurl)
       
        if data.tripDetail.status == "Finished"{
            self.sourceLbl.text = data.tripDetail.adsp.from
            self.desgnationLbl.text = data.tripDetail.adsp.to
        }else if data.tripDetail.status == "canceled"{
            self.sourceLbl.text = data.tripDetail.dsp.start
            self.desgnationLbl.text = data.tripDetail.dsp.end
        }
        
        self.vehcileNameLbl.text = data.tripDetail.vehicle
        self.cashTypeLbl.text = data.tripDetail.paymentMode
        self.rideStatus.text = data.tripDetail.status
        self.totalCostLbl.text = decimalDataString(data: data.tripDetail.acsp.cost.description)
        self.rideCashLbl.text = decimalDataString(data: data.tripDetail.acsp.cost.description)
        
        
        if self.tripType == "rental"{
            self.destinationView.isHidden = true
        }else{
            self.destinationView.isHidden = false
        }
        
        
        
        self.basePackgeLbl.text = data.tripDetail.acsp.packageName
        self.packageKMLbl.text = decimalDataString(data: data.tripDetail.acsp.distfare.description)
           self.fareforRemainingKM.text = decimalDataString(data: data.tripDetail.acsp.fareForExtraKM.description)
           self.etctraANdPackKM.text = "(\(Constant.priceTag)\(data.tripDetail.acsp.perKmRate) /Km)"

                 self.fareforRemainingHr.text = decimalDataString(data: data.tripDetail.acsp.fareForExtraTime.description)
                 
                 self.etctraANdPackHr.text = "(\(Constant.priceTag)\(data.tripDetail.acsp.timefare) /Hr)"
                 
                  self.discountpercetage.text = " (NA - \(data.tripDetail.acsp.discountPercentage)%)"
                 
                 self.driverallowance.text = decimalDataString(data: data.tripDetail.acsp.promoamt.description)
        
        self.driverallowance.text = decimalDataString(data: data.tripDetail.acsp.conveyance.description)
        
        
        self.totalFareBl.text = decimalDataString(data: data.tripDetail.acsp.cost.description)
        
        
        self.kmfareLbl.text = decimalDataString(data: data.tripDetail.acsp.distfare.description)
        self.waitingFareLbl.text = decimalDataString(data: data.tripDetail.acsp.waitingCharge.description)
        self.pickupFareLbl.text = decimalDataString(data: data.tripDetail.acsp.conveyance.description)
        self.totalFaccessFareLblareBl.text = decimalDataString(data: data.tripDetail.acsp.tax.description)
        self.cancelFareLbl.text = decimalDataString(data: data.tripDetail.acsp.oldBalance.description)
        self.gatewayfareLbl.text = decimalDataString(data: data.tripDetail.acsp.gatewayCharge.description)
        
        //new
        self.MileFareVal.text = decimalDataString(data: data.tripDetail.acsp.distfare.description)
        self.BookingFeeVall.text = decimalDataString(data: data.tripDetail.acsp.booking.description)
        self.BaseFareVal.text = decimalDataString(data: data.tripDetail.acsp.base.description)
        self.waitingFareVal.text = decimalDataString(data: data.tripDetail.acsp.waitingCharge.description)
        self.PickupFeeVal.text = decimalDataString(data: data.tripDetail.acsp.conveyance.description)
        self.TAXVal.text = decimalDataString(data: data.tripDetail.acsp.tax.description)
        self.CancelFareVal.text = decimalDataString(data: data.tripDetail.acsp.oldBalance.description)
        self.TimeFareVal.text = decimalDataString(data: data.tripDetail.acsp.timefare.description)
        self.TollFeeVal.text = decimalDataString(data: data.tripDetail.acsp.tollFee.description)
        self.GatewayChargeVal.text = decimalDataString(data: data.tripDetail.acsp.gatewayCharge.description)
        self.TotalFareVal.text = decimalDataString(data: data.tripDetail.acsp.cost.description)
        
        
        
        
        if data.tripDetail.acsp.isNight{
             self.nightChatgeLbl.isHidden = false
        self.nightChatgeLbl.text = "Night charge apply \(data.tripDetail.acsp.nightPer)"
        }else{
            self.nightChatgeLbl.isHidden = true
        }
    }
}
