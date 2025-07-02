//
//  RentalVC.swift
//  Express Track
//
//  Created by Abservetech on 31/10/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class RentalVC: UIViewController {

    var packageList : PackageList?{
        didSet{
            self.packageTableView.reloadData()
        }
    }
    
    var rentalList : RentalVehicle?{
           didSet{
               self.cabTableView.reloadData()
           }
       }
    
    @IBOutlet weak var headerView: UIView!
    @IBOutlet weak var backImage: UIImageView!
    @IBOutlet weak var headerTtitleLbl: UILabel!
    @IBOutlet weak var sourceAddr: UILabel!
    
    @IBOutlet weak var packageListView: UIView!
    @IBOutlet weak var packageTableView: UITableView!
    
    
    @IBOutlet weak var cabTableView: UITableView!
    @IBOutlet weak var selectDataView: UIView!
    @IBOutlet weak var selectCabView: UIView!
    @IBOutlet weak var selectedPackageView: UIView!
    @IBOutlet weak var selectePackageLabl: UILabel!
    @IBOutlet weak var expancpakacgeImage: UIImageView!
    
    @IBOutlet weak var discrptionView : UIView!
    @IBOutlet weak var vehicleimage : UIImageView!
    @IBOutlet weak var selectCabArrow : UIImageView!
    @IBOutlet weak var vehicleprice : UILabel!
    
    
    @IBOutlet weak var bookingehicleImage : UIImageView!
    @IBOutlet weak var aproxfareView: UIView!
    @IBOutlet weak var cashmethodView: UIView!
    @IBOutlet weak var applycouponView: UIView!
    @IBOutlet weak var confimeBookingBtn: UIButton!
    @IBOutlet weak var appxFareLbl: UILabel!
    @IBOutlet weak var confimrBookingInfoView: UIView!
    
    // priceView
    @IBOutlet weak var AlertView: UIView!
    @IBOutlet weak var priceAlertView: UIView!
    @IBOutlet weak var pricealertlogo: UIImageView!
    @IBOutlet weak var priceLbl: UILabel!
    @IBOutlet weak var kmpriceLbl: UILabel!
    @IBOutlet weak var vehiclenameLnl: UILabel!
    @IBOutlet weak var priceinerView: UIView!
    let promoCodeView = PromoView.getView
    
    var homevm = HomeVM()
    var TripRoutesrental : TripRoutes?
    
    var pickupAddress : String?
    var rentalServiceID : String?
    var pickupLoaction : CLLocation?
    var selectedIndex : Int?
    var celectedCab : Int?
    var slectedPackage : packageDetail?
    var vehicleData : RentalData?
    var serviceId : String?
    var bookingtype : String?
    var date : String?
    var time : String?
    var isriderLater : String?
    
    
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
        self.setupData()
        self.setupAction()
        self.setupView()
        self.setupDelegate()
        self.packageList(pickupLoaction: self.pickupLoaction ?? CLLocation())
    }
    
    class func initWithStory() -> RentalVC{
        let vc  = UIStoryboard(name: "Home", bundle: Bundle.main)
        let nav = vc.instantiateViewController(withIdentifier: "RentalVC") as! RentalVC
        return nav
    }
   
    func setupData(){
        self.sourceAddr.text = self.pickupAddress
    }
    
    func setupView(){
        
        //fareView
        self.pricealertlogo.isRoundedView = true
         self.priceinerView.roundeCornorBorder = 10
        self.priceAlertView.isElevation = 10
        self.confimeBookingBtn.roundeCornorBorder = 20
        self.headerView.isElevation = 3
        self.confimrBookingInfoView.isElevation = 3
        self.confimrBookingInfoView.layer.cornerRadius = 10
        
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
        
        self.aproxfareView.addAction(for: .tap) {
            self.AlertView.isHidden = false
            self.priceAlertView.isHidden = false
        }
        
        self.expancpakacgeImage.addAction(for: .tap) {
            self.selectePackageLabl.text = ""
            self.selectDataView.isHidden = true
            self.packageListView.isHidden = false
            self.discrptionView.isHidden = true
//            self.selectCabView.isHidden = false
//            self.packageList(pickupLoaction: self.pickupLoaction ?? CLLocation())
        }
        self.backImage.addAction(for: .tap) {
            self.navigationController?.popViewController(animated: true)
        }
        
        self.selectCabArrow.addAction(for: .tap) {
            self.discrptionView.isHidden = true
            self.selectCabView.isHidden = false
        }
        
        self.confimeBookingBtn.addAction(for: .tap) {
            
            if Constant.profileData.card.last4.isEmpty{
                //showToast(msg: "please add card from menu")
                
                self.showalert()
                
            }else{
                self.rentalBooking(packageId: self.slectedPackage?._id ?? "", vehicleTypeId: self.vehicleData?._id ?? "", serviceType: self.vehicleData?.type ?? "")
            }
        }
    }
    func showalert() {
        let refreshAlert = UIAlertController(title: "", message: "Pleas add your card", preferredStyle: UIAlertController.Style.alert)

                   refreshAlert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (action: UIAlertAction!) in
                       let vc = PaymentVC.initWithStory()
                       vc.pagefrom = true
                       self.navigationController?.pushViewController(vc, animated: true)
                     
                     }))

                   refreshAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { (action: UIAlertAction!) in
                   //  print("Handle Cancel Logic here")
                     }))

                   self.present(refreshAlert, animated: true, completion: nil)
    }
}

extension RentalVC : UITableViewDelegate, UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if tableView == self.cabTableView{
            if let count = self.rentalList?.packagedetail.count{
                return count
            }
        }else{
            if let count = self.packageList?.packagedetail.count{
                      return count
            }
        }
      
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if tableView == self.cabTableView{
            let cell = tableView.dequeueReusableCell(withIdentifier: "cabCell") as! cabCell
            if let data = self.rentalList?.packagedetail[indexPath.row]{
                cell.cabNameLbl.text = data.type
                cell.cabPriceLbl.text = Constant.priceTag + data.fare.description
                var urls : String = data.file ?? String()
                //cell.carImage.pin_setImage(from: URL(string: urls))
                let urlkf = URL(string: urls)
                cell.carImage.kf.setImage(with: urlkf)

                if let vehicleImage =  cell.carImage.image{
                    let tintableImage = vehicleImage.withRenderingMode(.alwaysTemplate)
                    cell.carImage.image = tintableImage
                }

                cell.carImage.tintColor = UIColor.AppColors
                if celectedCab == indexPath.row{
                    cell.cehckedImage.image = UIImage(named: "selected")
                }else{
                    cell.cehckedImage.image = UIImage(named: "unselect")
                }
                          
                cell.contentView.addAction(for: .tap) {
                    if let data = self.rentalList?.packagedetail[indexPath.row]{
                        self.vehicleData = data
                    self.selectCabView.isHidden = true
                    self.discrptionView.isHidden = false

                        self.celectedCab = indexPath.row
                        
                        self.cabTableView.reloadData()
                    var urls : String = data.file ?? String()
                  //  self.vehicleimage?.pin_setImage(from: URL(string: urls))
                        let urlkf = URL(string: urls)
                        self.vehicleimage.kf.setImage(with: urlkf)
                        self.bookingehicleImage.kf.setImage(with: urlkf)
                    //self.bookingehicleImage?.pin_setImage(from: URL(string: urls))
                        if let vehicleImage = self.vehicleimage.image{
                            let tintableImage = vehicleImage.withRenderingMode(.alwaysTemplate)
                            self.vehicleimage.image = tintableImage
                            self.bookingehicleImage.image = tintableImage
                        }
                       self.vehicleimage.tintColor = UIColor.AppColors
                        self.bookingehicleImage.tintColor = UIColor.AppColors
//                        DispatchQueue.main.asyncAfter(deadline: .now()+0.5) {
//                            self.vehicleimage.tintColor = UIColor.AppColors
//                               self.bookingehicleImage.tintColor = UIColor.AppColors
//                        }
                           
                    self.appxFareLbl.text = Constant.priceTag + data.fare
                    self.vehicleprice.text = Constant.priceTag + data.fare
                        self.vehiclenameLnl.text = data.type ?? ""
                        self.priceLbl.text = Constant.priceTag + "\(data.fare ?? "0.0")"
                        self.kmpriceLbl.text = Constant.priceTag + "\(data.bkm ?? "0.0")/\(Constant.distanceUnit)"
                    }
                }
            }
            return cell
          }else if tableView == self.packageTableView {
            let cell = tableView.dequeueReusableCell(withIdentifier: "PackageCell") as! PackageCell
            if selectedIndex == indexPath.row{
                cell.cehckedImage.image = UIImage(named: "selected")
            }else{
                cell.cehckedImage.image = UIImage(named: "unselect")
            }
            if let data = self.packageList?.packagedetail[indexPath.row]{
                cell.pakageLbl.text = data.name
            }
            cell.contentView.addAction(for: .tap, Action: {
                self.selectedIndex = indexPath.row
                self.slectedPackage = self.packageList?.packagedetail[indexPath.row]
                self.selectePackageLabl.text = self.packageList?.packagedetail[indexPath.row].name
                self.packageTableView.reloadData()
                self.packageListView.isHidden = true
                self.selectDataView.isHidden = false
                self.serviceId = ""
                if (self.packageList?.serviceDetail.count ?? 0) > 0{
                for value in 0...((self.packageList?.serviceDetail.count ?? 0)-1){
                    if value < ((self.packageList?.serviceDetail.count ?? 0)-1){
                        self.serviceId! += "\(self.packageList?.serviceDetail[value] ?? ""),"
                    }else{
                        self.serviceId! += "\(self.packageList?.serviceDetail[value] ?? ""),5d4279668a2f034b6f0a4675"
                    }
                    
                }
                }
                DispatchQueue.main.asyncAfter(deadline: .now()+0.5) {
                    self.rentalfareEstimation(packageId: self.packageList?.packagedetail[indexPath.row]._id ?? "", serviceId: self.serviceId ?? "")
                }
               
            })
            
            return cell
        }else{
            let cell = tableView.dequeueReusableCell(withIdentifier: "PackageCell") as! PackageCell
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if tableView == self.cabTableView{
        let cell = tableView.dequeueReusableCell(withIdentifier: "cabCell")
        self.celectedCab = indexPath.row
        
        self.cabTableView.reloadData()
        }else{
       let cell = tableView.dequeueReusableCell(withIdentifier: "PackageCell")
           
            cell?.contentView.addAction(for: .tap, Action: {
            self.selectedIndex = indexPath.row
            self.packageTableView.reloadData()
        })
        }
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 50
    }
    
    func setupDelegate(){
        self.packageTableView.delegate = self
        self.packageTableView.dataSource = self
        self.cabTableView.delegate = self
        self.cabTableView.dataSource = self
        self.packageTableView.reloadData()
        self.cabTableView.reloadData()
    }
    
}


class PackageCell : UITableViewCell{
    @IBOutlet weak var cehckedImage : UIImageView!
    @IBOutlet weak var pakageLbl : UILabel!
    
    override class func awakeFromNib() {
        super.awakeFromNib()
    }
}


class cabCell : UITableViewCell{
    @IBOutlet weak var cehckedImage : UIImageView!
    @IBOutlet weak var carImage : UIImageView!
    @IBOutlet weak var cabNameLbl : UILabel!
    @IBOutlet weak var cabPriceLbl : UILabel!
    
    override class func awakeFromNib() {
        super.awakeFromNib()
    }
}

//Api call
extension RentalVC{
    func packageList(pickupLoaction : CLLocation){
        self.selectedIndex = -1
        self.homevm.getPAckageList(view: self.view, pickupLoc: pickupLoaction)
        self.homevm.succPackage = {
            self.packageList = self.homevm.PackageListsucc
        }
    }
    
    func rentalfareEstimation(packageId : String,serviceId : String){
        self.celectedCab = -1
        self.homevm.rentalService(view: self.view, packageId: packageId, serviceId: serviceId)
        self.homevm.succRentalVehiclesucc = {
            self.rentalList = self.homevm.RentalVehiclesucc
            self.selectCabView.isHidden = false
        }
    }
    
    func rentalBooking(packageId : String,vehicleTypeId : String,serviceType : String){
            
        self.homevm.rentalConfirmBooking(view: self.view, date: self.date ?? "", paymentType: "Card", pickupCity: "", bookingtype: bookingtype ?? "", tripTime: self.time ?? "", estimateFare: EstimateFareDetails(), utc: "", packageId: packageId, vehicleTypeId: vehicleTypeId, serviceType: serviceType,pickupLoc : self.pickupLoaction ?? CLLocation() , pickupAddress : self.pickupAddress ?? "")
            
        self.homevm.getRequestClouser = {
         if let requestdata = self.homevm.request{
            self.TripRoutesrental?.rentalRequestData(requestData: requestdata)
            self.navigationController?.popViewController(animated: true)
         }
        }
        
        self.homevm.errRequestClouser = {
            if let requestdata = self.homevm.errrequest{
            showToast(msg: requestdata.message ?? "")
                      self.TripRoutesrental?.errrentalRequestData(requestData: requestdata)
                self.navigationController?.popViewController(animated: true)
            }
        }
        
        
       }
}

