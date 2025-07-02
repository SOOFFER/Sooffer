//
//  SearchAddressVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 04/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import GoogleMaps
import SkyFloatingLabelTextField
import CountryPickerView

enum TappedPlace : String {
    case none = "none"
    case pickup = "pickup"
    case drop = "drop"
}

class SearchAddressVC: UIViewController,UITextFieldDelegate {
    
    //Api Reponse
    var searchAddress : GoogleAddressModel?{
        didSet{
            self.addressTabelView.reloadData()
        }
    }
    
    //API Response
    var fareDetail : EstimateFareDetails?{
        didSet{
            print("FareDetailsss",fareDetail?.vehicleDetailsAndFare.fareDetails.totalFare)
            self.setData()
        }
    }
    
    //UI Declaractions
    
    @IBOutlet weak var backArrowIMG: ImageLoader!
    @IBOutlet weak var pickupCliseImg: ImageLoader!
    @IBOutlet weak var dropCloseImg: ImageLoader!
    
    @IBOutlet weak var pickupTXF: UITextField!
    @IBOutlet weak var searchTXF: UITextField!
    
    @IBOutlet weak var pickupView: UIView!
    @IBOutlet weak var dropView: UIView!
    
    @IBOutlet weak var setupPinLBL: UILabel!
    
    @IBOutlet weak var addressTabelView: UITableView!
    
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
    
    @IBOutlet weak var starttrip: UIButton!
    
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
    
    @IBOutlet weak var estimatefareView : UITableView!
    
    // Hail Customer Details
    
    @IBOutlet weak var customerDetailsMainView: UIView!
    @IBOutlet weak var customerDetailsView: UIView!
    
    @IBOutlet weak var firstNameTF: SkyFloatingLabelTextField!
    @IBOutlet weak var lastNameTF: SkyFloatingLabelTextField!
    @IBOutlet weak var emailTF: SkyFloatingLabelTextField!
    @IBOutlet weak var mobileNumberTF: SkyFloatingLabelTextField!
    
    @IBOutlet weak var submitBtn: UIButton!
    @IBOutlet weak var cancelBtn: UIButton!
    
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    //Firebase object
    var FBConnect = FireBaseconnection.instanse
    
    var currentAddress : String = ""
    
    var googleApi = GoogleVM()
    
    var tappedPlace : String = TappedPlace.pickup.rawValue
    
    var tripRouteDelegate : TripRoutes?
    
    var pickupaddr : String = ""
    var pickupCity : String = ""
    var pickupLoc : CLLocation = CLLocation()
    var dropAddr : String = ""
    var dropCity : String = ""
    var dropLoc : CLLocation = CLLocation()
    
    var homevm = HomeVM()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.homevm = HomeVM(view: self.view, dataService: ApiRoot())
        self.setupAction()
        self.setupView()
        self.setupLang()
        self.setupDelegate()
        self.setupApiIntialization()
    }
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
        self.setupData()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
    }
    
    func setupView(){
        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
        self.revealViewController().rearViewRevealWidth = 300
        
        // set border for from label
        self.dropView.roundeCornorBorder = 5
        self.pickupView.roundeCornorBorder = 5
        
        self.pickupCliseImg.tintColor = UIColor(named: "AppColor")
        self.dropCloseImg.tintColor = UIColor(named: "AppColor")
        self.backArrowIMG.tintColor = UIColor.white
        
        customerDetailsView.isElevation = 2
        
    }
    
    func setData(){
        if let faredata = self.fareDetail?.vehicleDetailsAndFare{
            
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
                self.EstimateTileLbl.text = Localize.stringForKey(key: "extimate_fare") + "(" + (self.fareDetail?.distanceDetails.distanceLable ?? "0 KM") + ")"
                self.ridePriceLbl.text = decimalDataString(data : fares.kMFare.description)
                self.basePriceLbl.text = decimalDataString(data : fares.baseFare.description)
                self.timePriceLbl.text = decimalDataString(data : fares.travelFare.description)
                self.pickupPriceLbl.text = decimalDataString(data : fares.pickupCharge.description)
                self.accessPriceLbl.text = decimalDataString(data : fares.tax.description)
                self.cancellationPriceLbl.text = decimalDataString(data : fares.cancelationFeesRider.description)
                self.subTotalPriceLbl.text = decimalDataString(data : fares.totalFare.description)
                self.nightfarealert.text = fares.nightObj.alertLable
                
            }
            
            
        }
        
    }
    func setupData(){
        self.pickupTXF.text = self.currentAddress
        self.tappedPlace = TappedPlace.drop.rawValue
    }
    
    func setupDelegate(){
        self.pickupTXF.delegate = self
        self.searchTXF.delegate = self
        
        self.addressTabelView.delegate = self
        self.addressTabelView.dataSource = self
        self.addressTabelView.register(UINib(nibName: "FavAddressCell", bundle: nil), forCellReuseIdentifier: "FavAddressCell")
        self.addressTabelView.reloadData()
    }
    
    func setupAction(){
        self.closeImage.addAction(for: .tap) {
            self.estimatefareView.isHidden = true
        }
        self.backArrowIMG.addAction(for: .tap) {
            self.navigationController?.isNavigationBarHidden = false
            self.navigationController?.popViewController(animated: true)
        }
        self.pickupCliseImg.addAction(for: .tap) {
            self.pickupTXF.text = ""
            self.currentAddress = ""
        }
        self.dropCloseImg.addAction(for: .tap) {
            self.searchTXF.text = ""
        }
        self.starttrip.addAction(for: .tap) {
            self.customerDetailsMainView.isHidden = false
            self.firstNameTF.text = ""
            self.lastNameTF.text = ""
            self.emailTF.text = ""
            self.mobileNumberTF.text = ""
        }
        cancelBtn.addAction(for: .tap) {
            self.customerDetailsMainView.isHidden = true
        }
        submitBtn.addAction(for: .tap) {
            
                self.startrip()
            
        }
    }
    
    func setupLang(){
        self.pickupTXF.placeholder = Localize.stringForKey(key: "pickupaddr")
        self.searchTXF.placeholder = Localize.stringForKey(key: "search")
        self.setupPinLBL.text = Localize.stringForKey(key: "septupin")
        
            self.EstimateTileLbl.text = Localize.stringForKey(key: "estimate_fare")
            self.rideFareLbl.text = Localize.stringForKey(key: "ride_fare")
            self.baseFareLbl.text = Localize.stringForKey(key: "base_fare")
            self.timeFareLbl.text = Localize.stringForKey(key: "time_fare")
            self.pickupFareLbl.text = Localize.stringForKey(key: "pickup_charge")
            self.accessFeeLbl.text = Localize.stringForKey(key: "access_fee")
            self.cancellationFeeLbl.text = Localize.stringForKey(key: "cancellation_fee")
            self.subTotalLbl.text = Localize.stringForKey(key: "subtotal")
            self.userWalletLbl.text = Localize.stringForKey(key: "use_wallet")
            self.starttrip.setTitle(Localize.stringForKey(key: "start_trip"), for: .normal)
        
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if textField == self.pickupTXF{
            self.tappedPlace = TappedPlace.pickup.rawValue
            self.getNearByAddr(address: textField.text ?? "")
        }else if textField == self.searchTXF{
            self.tappedPlace = TappedPlace.drop.rawValue
            self.getNearByAddr(address: textField.text ?? "")
        }
        return true
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        self.view.endEditing(true)
        return false
    }
    
    class func initWithStory()->SearchAddressVC{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "SearchAddressVC") as! SearchAddressVC
        return vc
    }
}

extension SearchAddressVC :UITableViewDelegate , UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count = self.searchAddress?.predictions?.count{
                return count
                
        }
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FavAddressCell", for: indexPath) as! FavAddressCell
        self.setupTableviewData(cell: cell, index: indexPath.row, address: self.searchAddress!)
        cell.deleteImage.isHidden = true
//        cell.deleteImage.addAction(for: .tap) {
//            self.deleteAddress(delete: cell.deleteImage)
//        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 70
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
       
        switch self.tappedPlace {
        case TappedPlace.pickup.rawValue:
            self.pickupTXF.text = self.searchAddress?.predictions?[indexPath.row].descriptionField ?? ""
            self.tappedPlace = TappedPlace.drop.rawValue
            self.navigatetoHomeWithAddress()
            break
        case TappedPlace.drop.rawValue:
            self.searchTXF.text = self.searchAddress?.predictions?[indexPath.row].descriptionField ?? ""
           self.navigatetoHomeWithAddress()
            break
        default:
            self.pickupTXF.text = self.searchAddress?.predictions?[indexPath.row].descriptionField ?? ""
        }
        
       
    }
    
    func deleteAddress(delete : UIImageView){
            let actionSheet = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        
            actionSheet.addAction(UIAlertAction(title: Localize.stringForKey(key: "delete"), style: .default, handler: {(action) in
                
            }))
        
            if let popview = actionSheet.popoverPresentationController {
                popview.sourceView = delete
                popview.sourceRect = delete.bounds
            }
            self.present(actionSheet, animated: true, completion: nil)
    }
    
    func setupTableviewData(cell : FavAddressCell , index : Int, address : GoogleAddressModel){
        if let getAddress = address.predictions?[index]
        {
            cell.addressLbl.text = getAddress.descriptionField ?? "YYYY"
            if let title = getAddress.structuredFormatting?.mainText {
                cell.addrTitleLbl.text = getAddress.structuredFormatting?.mainText ?? ""
            }else{
                let address : String = getAddress.descriptionField ?? "" as String
                var addressArray = address.components(separatedBy: ",")
                cell.addrTitleLbl.text = addressArray[0] as? String ?? ""
            }
        }
    }
    
    func navigatetoHomeWithAddress(){
        if !(self.pickupTXF.text?.isEmpty ?? false) && !(self.searchTXF.text?.isEmpty ?? false)
        {
            self.pickupaddr = self.pickupTXF.text ?? ""
            self.dropAddr = self.searchTXF.text ?? ""
            // getting pickuplatlang first the droplatlang then move to homepage
            convertAddressTOLatLang(address: self.pickupaddr, latlang: {(location) in
                self.pickupLoc = location
                convertAddressTOLatLang(address: self.dropAddr, latlang: {(location) in
                    self.dropLoc = location
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
//                        self.tripRouteDelegate?.getPickupDropLocation(pickAddr: self.pickupaddr, pickupLoc: self.pickupLoc, dropAddr: self.dropAddr, dropLoc: self.dropLoc)
//                        self.navigationController?.popViewController(animated: true)
                        self.sendRideRequest(view: self.view)
                        
                    }
                })
            })
        }
    }
}


// APi call
extension SearchAddressVC{
    
    func setupApiIntialization(){
        self.googleApi = GoogleVM(view: self.view, dataService: ApiRoot())
    }
    
    func getNearByAddr(address : String){
        self.googleApi.nearByLocation(input: address)
        
        self.googleApi.showAddressClosure = {
            self.searchAddress = self.googleApi.getAddressList
        }
        
        self.googleApi.errorAddressClosure = {
            self.searchAddress = self.googleApi.getAddressError
        }
    }
    
    func sendRideRequest(view: UIView )
    {
        self.homevm.estimationFareForHailTaxi(view: self.view, time: "", pickupLoc: self.pickupLoc, dropLoc: self.dropLoc, pickupCity: self.pickupCity)
        
        self.homevm.getFareClouser = {
            self.estimatefareView.isHidden = false
            self.fareDetail = self.homevm.fareDetail
        }
    }
    
    func startrip(){
        self.homevm.hailRequestValidation(view: self.view, promo: "", promoAmt: "", tripTime: "", paymentMode: "Cash", estimateFare: self.fareDetail ?? EstimateFareDetails(), fname: firstNameTF.text ?? "", lname: lastNameTF.text ?? "", email: emailTF.text ?? "", phone: mobileNumberTF.text ?? "")
        
        self.homevm.getStartTripClouser = {
            let tripid : String = (self.homevm.startTrip?.tripno ?? 0).description
            UserDefaults.standard.set(tripid, forKey: UserDefaultsKey.tripId)
            UserDefaults.standard.set("hailtaxi", forKey: UserDefaultsKey.triptype)
            let lat  : String = self.pickupLoc.coordinate.latitude.description
            let lang : String = self.pickupLoc.coordinate.longitude.description
            let address : String = self.pickupaddr
            UserDefaults.standard.set(lat.description, forKey: UserDefaultsKey.pickuplat)
            UserDefaults.standard.set(lang.description, forKey: UserDefaultsKey.pickuplang)
            UserDefaults.standard.set(address, forKey: UserDefaultsKey.pickupaddrs)
            self.tripRouteDelegate?.hailTaxiRide()
            self.setFBTripData()
           self.navigationController?.popViewController(animated: true)
        }
        
    }
}

extension SearchAddressVC{
    func setFBTripData(){
        self.FBConnect.CreateFirebaseTripData(status: "3")
    }
}
