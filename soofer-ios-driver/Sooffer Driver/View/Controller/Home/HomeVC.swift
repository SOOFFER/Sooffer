//
//  HomeVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import GoogleMaps
import PINRemoteImage
import MessageUI
import Kingfisher
import CoreLocation


/* view hiddenstates
 1. === hide vehicle list and show from label
 2. ==  hide from lable and show vehcile list with map marker for trip route
 3.
 */

/* subview lists
 1. for add vehcile lust subview
 2. for add extimate list subview
 */

protocol TripRoutes {
    func getPickupDropLocation(pickAddr : String,pickupLoc : CLLocation , dropAddr : String , dropLoc : CLLocation)
    func getPinLocation(tag : String , addr : String , addrLoc : CLLocation)
    func getbackPress()
     func hailTaxiRide()
}

extension HomeVC : TripRoutes{
    
     func hailTaxiRide() {
        self.RouteRiderOTPViews(tripstatus: FBTripDataModel(), tripType: "hailtaxi")
    }
    
    func getbackPress() {
        self.navigationController?.isNavigationBarHidden = true
        profile = ProfileVM(dataService: ApiRoot())
        self.userView.alpha = 0.1
        self.getFBDriverDetails()
        self.getFBTripData()
        self.getProfileData()
        self.getFBCancelLationDetails()
         print("backpress")
    }
    
    func getPinLocation(tag: String, addr: String, addrLoc: CLLocation) {
        self.mapView.clear()
        if tag == "pickup" {
            self.pickupaddr = addr
            self.pickupLoc = addrLoc
             print("set 1")
           self.setPolyLineWithMaker(pickupaddr: addr, dropaddr: dropAddr, pickupLoc: addrLoc, dropLoc: dropLoc,tripSttaus : "", waypoints: "", midpoint: [])
        } else {
            self.dropAddr = addr
            self.dropLoc = addrLoc
             print("set 2")
          self.setPolyLineWithMaker(pickupaddr: pickupaddr, dropaddr: addr, pickupLoc: pickupLoc, dropLoc: addrLoc,tripSttaus : "", waypoints: "", midpoint: [])
        }
    }
    
    func getPickupDropLocation(pickAddr: String, pickupLoc: CLLocation, dropAddr: String, dropLoc: CLLocation) {
        self.mapView.clear()
        self.pickupaddr = pickAddr
        self.pickupLoc = pickupLoc
        self.dropAddr = dropAddr
        self.dropLoc = dropLoc
        
              print("set 3")
              self.setPolyLineWithMaker(pickupaddr: pickAddr, dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, tripSttaus: "", waypoints: "", midpoint: [])
        
    }
}


class HomeVC: UIViewController ,MFMessageComposeViewControllerDelegate{
    
    func messageComposeViewController(_ controller: MFMessageComposeViewController, didFinishWith result: MessageComposeResult) {
        self.dismiss(animated: true, completion: nil)
    }
    
    //UI Declaraction
    
    @IBOutlet weak var menuImg: UIImageView!
    @IBOutlet weak var userImage: UIImageView!
    @IBOutlet weak var onlineImg: UIImageView!
    @IBOutlet weak var mapView: GMSMapView!
    
    @IBOutlet weak var hailTaxiImg: UIImageView!
    @IBOutlet weak var proofStatusView: UIView!
    @IBOutlet weak var myLocationView: UIView!
    @IBOutlet weak var userView: UIView!
    @IBOutlet weak var startView: UIView!
    @IBOutlet weak var nvmenuView: UIView!
     @IBOutlet weak var SupportView: UIView!
    
    @IBOutlet weak var proofstatusLbl: UILabel!
    @IBOutlet weak var statusLbl: UILabel!
    @IBOutlet weak var userNameLbl: UILabel!
    @IBOutlet weak var defaultVehicleName: UILabel!
    @IBOutlet weak var changeVehcileLbl: UILabel!
    
    //alertView
    
    
    @IBOutlet weak var alertView: UIView!
    @IBOutlet weak var kmalert: UIView!
    @IBOutlet weak var kmlogoView: UIImageView!
    @IBOutlet weak var kmtestFile: UITextField!
    @IBOutlet weak var kmtesttitleLbl: UILabel!
    @IBOutlet weak var hillTextFild: UITextField!
    @IBOutlet weak var submitkmBtn: UIButton!
    
    @IBOutlet weak var stopImage: UIImageView!
       
    @IBOutlet weak var multistopView : UIView!
    @IBOutlet weak var closeMultistop: UIImageView!
    @IBOutlet weak var multistopViewHeight : NSLayoutConstraint!
    @IBOutlet weak var addressList : UITableView!
    @IBOutlet weak var earnView: UIView!
    @IBOutlet weak var earndetailsView: UIView!
    @IBOutlet weak var earncloseImg: UIImageView!
    @IBOutlet weak var earnLb: UILabel!
    
    @IBOutlet weak var ridefareAmount: UILabel!
    
    @IBOutlet weak var bescommission: UILabel!
    @IBOutlet weak var taxLb: UILabel!
    @IBOutlet weak var cashcollectlb: UILabel!
    @IBOutlet weak var incomeLb: UILabel!
    
     @IBOutlet weak var TotalmileDis: UILabel!
     @IBOutlet weak var RidesLB: UILabel!
     @IBOutlet weak var earntitlelb: UILabel!
     
     @IBOutlet weak var GatewaychargeVal: UILabel!
     
    
    var mulitiLocationAddress : [MulitiLocation] = [MulitiLocation]()
    var tripFBStatus : FBTripDataModel = FBTripDataModel()
     
    //Variyable Declaraction
    
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var currentLocation = CLLocation()
    var pickupaddr : String = ""
    var pickupCity : String = ""
    var pickupLoc : CLLocation = CLLocation()
    var dropAddr : String = ""
    var dropCity : String = ""
    var dropLoc : CLLocation = CLLocation()
     var isAcceptTripPolyline = false
     var isStartTripPolyline = false
    
    var actualtravelDistance : Float = 0.0
    var startlocations : CLLocation = CLLocation()
    
    lazy var locationManager: CLLocationManager = {
        var _locationManager = CLLocationManager()
        _locationManager.desiredAccuracy = kCLLocationAccuracyBest
        _locationManager.delegate = self
        _locationManager.startMonitoringSignificantLocationChanges()
        _locationManager.distanceFilter = 5
        return _locationManager
        
    }()
    
    var MyLocation : CLLocationCoordinate2D = CLLocationCoordinate2D()
    
    // variable for animated pollyline
    var timer: Timer!
    var polyline = GMSPolyline()
    var animationPolyline = GMSPolyline()
    var path = GMSPath()
    var animationPath = GMSMutablePath()
    
    //Live Tracking variables
    var userBearing = Double()
    var lastUserHeading = Double()
    var previousUserHeading = Double()
    var lastMapBearing = Double()
    var trackingMarker = GMSMarker()
    let pickupMarker = GMSMarker()
    let dropMarker = GMSMarker()
    
    var oldLocation = CLLocation()
    var flagMapFirstTime = true
    var rotationAngle:Double! = 0.0
    var zoomFloat = 15.0
    var i: UInt = 0
    var travelDistance : String = ""
    var travelDuraction : String = ""
    
    var focusZoom : Float = 17
    var selectedVCIndex : Int = -1
    var currentAddress : String = ""
    var subviewCount : Int = -1
    var hiddenShowViews : Int = 1
     var isfirstdriver  = Bool()
    
    var homevm = HomeVM()
    var googleVM = GoogleVM()
    var profile = ProfileVM()
    
    //displace Views
    let rideStatusView = RideStartEndView.getView
    let rideDetailView = RideDetailView.getView
    let otpView = OTPView.getView
    let vehicleView = VehicleListView.getView
    
    //Models
    var tripRouteStatus : TripStatusModel = TripStatusModel()
    var FBtripstatus : FBTripDataModel?
     var onlinestatusvalue: String = ""
     var twoDriverListen = false
     var subscriptionBool = Bool()
     var onetimepolyline = Bool()
    
    //Firebase object
    var FBConnect = FireBaseconnection.instanse
     var driverid = ""
     var names: String?

    
    override func viewDidLoad() {
        super.viewDidLoad()
         names = "hjjh"
         print("NAMES:::\(names ?? "")")
        
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.earndetailsView.isHidden = true
        self.earnView.layer.cornerRadius = 15
        self.earnView.addTap {
            self.earndetailsView.isHidden = false
        }
        self.earncloseImg.addTap {
            self.earndetailsView.isHidden = true
        }
        print("ProfileConstant",Constant.profileData)
        print("currentTaxi", Constant.currentTaxi._id)
        self.homevm = HomeVM(dataService: ApiRoot())
        self.mapView.clear()
        self.userView.alpha = 0.1
        
        self.googleVM = GoogleVM(view: self.view, dataService: ApiRoot())
        profile = ProfileVM(dataService: ApiRoot())
        self.setupTableview()
        self.setupAction()
        self.setupView()
    //     self.endRider()
        self.setupMapDelegate()
        self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
        self.observeNotification()
         self.driverid = "\(UserDefaults.standard.string(forKey: UserDefaultsKey.userid) ?? "")"
         print("driverid:: \(driverid)")
         NotificationCenter.default.addObserver(self, selector: #selector(setupprint), name: Notification.Name("audiocall"), object: nil)
         NotificationCenter.default.addObserver(self, selector: #selector(self.methodOfReceivedNotification(notification:)), name: Notification.Name("twodriverListen"), object: nil)
        DispatchQueue.main.asyncAfter(deadline: .now()+0.1) {
            // self.getFBDriverDetails()
              print("getFBTripData self.")
              self.getFBTripData()
              self.focusCallPage(mode: true)
             print("viewdidload")
         }
         
    }
     private func focusCallPage(mode: Bool){
         if mode{
             NotificationCenter.default.addObserver(self, selector: #selector(setupprint), name: Notification.Name("audiocall"), object: nil)
         }else{
             NotificationCenter.default.removeObserver(self, name: Notification.Name("audiocall"), object: nil)
         }
     }
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
        profile = ProfileVM(dataService: ApiRoot())
        self.userView.alpha = 0.1
        DispatchQueue.main.asyncAfter(deadline: .now()+0.5) {
            self.getFBDriverDetails()
        }
        print("viewWillAppear")
        self.logout()
        self.getFBTripData()
        self.getProfileData()
        self.getFBCancelLationDetails()
        earnLb.text! = decimalDataString(data: Constant.driverearningData.earned.description)
         
        ridefareAmount.text! = decimalDataString(data: Constant.driverearningData.rideFare.description)
        
        bescommission.text! = decimalDataString(data: Constant.driverearningData.adminCommision.description)
         
        GatewaychargeVal.text! = decimalDataString(data: Constant.driverearningData.GatewayCharge.description)
        
        earntitlelb.text! = decimalDataString(data: Constant.driverearningData.earned.description)
        print("perdaykm,\(Constant.driverearningData.perDayKM)")
        cashcollectlb.text! = decimalDataString(data: Constant.driverearningData.cashCollected.description)
        taxLb.text! = decimalDataString(data: Constant.driverearningData.Tax.description)
        incomeLb.text! = decimalDataString(data: Constant.driverearningData.earned.description)
         TotalmileDis.text! = Constant.driverearningData.perDayKM + "KM"
         /*decimalDataString(data: Constant.driverearningData.perDayKM.description)*/
       //  RidesLB.text! = Constant.driverearningData.perDayRide
         RidesLB.text = String(Constant.driverearningData.perDayRide)
       
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
        if timer != nil{
            self.timer.invalidate()
        }
    }
     @objc func methodOfReceivedNotification(notification: Notification) {
          self.getFBTripData()
          print("new::::::")
     }
     @objc func setupprint(){
         if let profileData : ProfileModel  = Constant.profileData as? ProfileModel {
              self.focusCallPage(mode: false)
             let sinchVc = VideoCallVC.initWithStory()
             print("driverfcmhomepage::\(self.FBtripstatus?.rider_token)")
              print("tripFBStatus,\(self.tripFBStatus.rider_token)")
             sinchVc.riderfcm = self.FBtripstatus?.rider_token ?? ""
              sinchVc.riderpic = self.tripRouteStatus.rider.profileurl
              sinchVc.ridername = self.tripRouteStatus.rider.fname
              sinchVc.dismissPage = {
                  self.focusCallPage(mode: true)
              }
             self.navigationController?.pushViewController(sinchVc, animated: true)
         }
         
     }
    
    func setupView(){
//        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//        self.revealViewController().rearViewRevealWidth = 220
        
        self.nvmenuView.isRoundedView = true
        self.nvmenuView.layer.masksToBounds = true
        self.nvmenuView.isElevation = 3
        
        self.userView.leftRightRoundCorners(radius: 20)
        self.userView.isElevation = 3
        self.userImage.isRoundedView = true
        
        self.proofStatusView.isElevation = 3
        self.proofStatusView.layer.cornerRadius = 10
        
        self.kmalert.layer.cornerRadius = 20
        self.kmlogoView.isRoundedView = true
        self.submitkmBtn.roundeCornorBorder = 10
    }
    
    func mapPadding(addBottom : CGFloat , reduceBottom : CGFloat) {
        
        switch self.subviewCount {
        case 1:
            self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: 150+addBottom-reduceBottom, right: 0)
            
        case 2:
            self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: PaymentDetailView.getView.frame.height+addBottom-reduceBottom * 1.5, right: 0)
        case 3:
            self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: TripStatusView.getView.frame.height+addBottom-reduceBottom+20, right: 0)
        default:
            self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        }
    }
    
    func setupAction() {
        
        self.closeMultistop.addAction(for: .tap) {
            self.multistopView.isHidden = true
        }
        
        self.stopImage.addAction(for: .tap) {
            self.multistopView.isHidden = false
            self.view.addSubview(self.multistopView)
        }
         self.SupportView.addAction(for: .tap) {
          
//             if let url = URL(string:  "tel://\(Constant.profileData.phone ?? "")"),
//                UIApplication.shared.canOpenURL(url) {
              if let url = URL(string:  "tel://8888208018"),
                 UIApplication.shared.canOpenURL(url) {
                 if #available(iOS 10, *) {
                     UIApplication.shared.open(url)
                 } else{

                     UIApplication.shared.openURL(url)
                 }
                 
             }
         }
        
        self.hailTaxiImg.addAction(for: .tap) {
            if !self.currentAddress.isEmpty{
                self.navigationController?.isNavigationBarHidden = true
                let vc = SearchAddressVC.initWithStory()
                vc.currentAddress = self.currentAddress
                vc.tripRouteDelegate = self
                self.navigationController?.pushViewController(vc, animated: true)
            } else {
                showToast(msg: StringFile.err_getAddress)
            }
        }
        
        self.myLocationView.addAction(for: .tap) {
            self.mapView.camera = GMSCameraPosition(target: self.MyLocation, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
        }
        
        self.submitkmBtn.addAction(for: .tap) {
            
            let value : String = self.kmtestFile.text ?? ""
            let hill : String = self.hillTextFild.text ?? ""
            if self.kmtestFile.text?.isEmpty ?? false{
                showToast(msg: "Enter KM details")
            }else{
                let tripType : String = self.tripRouteStatus.tripType
                if self.tripRouteStatus.status == "Arrive Now"{
                    UserDefaults.standard.set(value, forKey: UserDefaultsKey.startKM)
                    self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "3", tripstatus: self.FBtripstatus ?? FBTripDataModel(), tripType: tripType)
                    self.kmtestFile.text = ""
                }else if self.tripRouteStatus.status == "Start Trip" {
                    UserDefaults.standard.set(value, forKey: UserDefaultsKey.endKM)
                    UserDefaults.standard.set(hill, forKey: UserDefaultsKey.hillKm)
                     print("set 4")
            self.getTravelDistance(pickupaddr: "", dropaddr: self.currentAddress, pickupLoc: CLLocation(), dropLoc: self.currentLocation, tripSttaus: "4" , tripstatus: self.FBtripstatus ?? FBTripDataModel(), tripType: tripType)
                    self.kmtestFile.text = ""
                    self.hillTextFild.text = ""
                }
            }
        }
        
        
        self.menuImg.addAction(for: .tap) {
            if self.revealViewController() != nil {
                self.revealViewController().revealToggle(animated: true)
            }
        }
        
        self.startView.addAction(for: .tap) {
         //    if self.subscriptionBool == true{
                  if self.onlineImg.image == UIImage(named: "red"){
                       self.setOnlinOffLine(online: "1")
                  }else if self.onlineImg.image == UIImage(named: "green"){
                       self.setOnlinOffLine(online: "0")
                  }
//             }else{
//                  showToast(msg: "Please Add Subscription")
//             }
        }
        
        
        self.changeVehcileLbl.addAction(for: .tap) {
            self.vehicleView.initView(view: self.view, addvicile: { (addVehile) in
                self.vehicleView.deInitView()
                let vc = AddVechileVC.initWithStory()
                self.navigationController?.pushViewController(vc, animated: true)
            }, manageVehicle: { (managaeVehicle) in
                self.vehicleView.deInitView()
                let vc = ManageVehicleVC.initWithStory()
                self.navigationController?.pushViewController(vc, animated: true)
                
            },closeView :{  (closeview) in
                self.setupData()
                self.vehicleView.deInitView()
            })
        }
    }
    
    func setupData(){
        if let profile : ProfileModel = Constant.profileData as? ProfileModel{
            self.userView.alpha = 1
            self.userNameLbl.text = profile.fname + " " + profile.lname
            print("user image:: \(ServiceApi.Base_Image_URL+profile.profile)")
//            var urls : String = ServiceApi.Base_Image_URL+profile.profile ?? String()
//             print("url:: \(urls)")
//            self.userImage?.pin_setImage(from: URL(string: urls))
             let url = URL(string: ServiceApi.Base_Image_URL + profile.profile)
             self.userImage.kf.setImage(with: url)
            self.userImage.clipsToBounds = true
            self.userImage.layer.cornerRadius = self.userImage.frame.width / 2
            if profile.online{
                self.hailTaxiImg.isHidden = false
            }else{
                self.hailTaxiImg.isHidden = true
            }
             self.FBConnect.getdDriversData { (driverData) in
                 let onoffvalue = driverData.online_status
                 print("print;;;",onoffvalue)

                 if onoffvalue == "1"{
                     self.updateLocation(Status: "1")
                     self.setOnlinOffLine(online: "1")
                     self.onlineImg.image = UIImage(named: "green")
                     self.statusLbl.text = self.Localize.stringForKey(key: "available")
                     self.updateFBLocation(loc: self.currentLocation)

                 }else{
                     self.onlineImg.image = UIImage(named: "red")
                     self.statusLbl.text = self.Localize.stringForKey(key: "unavailable")
                     self.setOnlinOffLine(online: "0")
                     self.updateLocation(Status: "0")
                     self.updateFBLocation(loc: CLLocation())
                 }
             }
//             print("profiel online::\(profile.online)")
//            if profile.online{
//                self.updateLocation(Status: "1")
//                self.setOnlinOffLine(online: "1")
//                self.onlineImg.image = UIImage(named: "green")
//                self.statusLbl.text = self.Localize.stringForKey(key: "available")
//                self.updateFBLocation(loc: self.currentLocation)
//
//            }else{
//                self.onlineImg.image = UIImage(named: "red")
//                self.statusLbl.text = self.Localize.stringForKey(key: "unavailable")
//                self.setOnlinOffLine(online: "0")
//                self.updateLocation(Status: "0")
//                self.updateFBLocation(loc: CLLocation())
//            }
            if let vehicle : CurrentActiveTaxi = Constant.currentTaxi as? CurrentActiveTaxi{
                if vehicle.vehicletype.isEmpty{
                    self.defaultVehicleName.isHidden = true
                    self.changeVehcileLbl.isHidden = true
                }else{
                    self.defaultVehicleName.isHidden = false
                    self.changeVehcileLbl.isHidden = false
                }
                self.defaultVehicleName.text = vehicle.makename + " \(vehicle.model) (\(vehicle.vehicletype))"
                UserDefaults.standard.set((vehicle.vehicletype ?? "").lowercased(), forKey: UserDefaultsKey.defaultVehicle)
            }
        }
    }
    
    
    func endRider(){
        self.mapView.clear()
        UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripId)
        self.rideStatusView.deInitView()
        self.rideDetailView.deInitView()
        self.otpView.deInitView()
        self.vehicleView.deInitView()
        self.FBConnect.cancelDeclineEndTrip()
    }
    
    class func initWithStory()->HomeVC {
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "HomeVC") as! HomeVC
        return vc
    }
    
}


//Listen Notification centers
extension HomeVC {
    func observeNotification(){
        NotificationCenter.default.addObserver(self, selector: #selector(vechileSttaus(_:)), name: .vechileStatus, object: nil)
        
         NotificationCenter.default.addObserver(self, selector: #selector(closeEstimateView(_:)), name: .closeEstimateFare, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(addedEstimateFare(_:)), name: .addedEstimateFare, object: nil)
        
         NotificationCenter.default.addObserver(self, selector: #selector(requestData(_:)), name: .requestedView, object: nil)
        
        NotificationCenter.default.addObserver(self, selector: #selector(changedCurrentTaxi(_:)), name: .changedCurrentTaxi, object: nil)
    }
    
    @objc func requestData(_ notification : Notification){
        if let data = notification.userInfo as? [String: String]
        {
            for (name, score) in data
            {
                if name == "requestHeight"{
                    let height : CGFloat = CGFloat(Float(score) ?? 0.0)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        self.subviewCount = 3
                        self.mapPadding(addBottom: 0.0, reduceBottom: height)
                    }
                }
            }
        }
    }
    
    @objc func addedEstimateFare(_ notification : Notification){
        if let data = notification.userInfo as? [String: String]
        {
            for (name, score) in data
            {
                if name == "height"{
                    let height : CGFloat = CGFloat(Float(score) ?? 0.0)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        self.mapPadding(addBottom: 0.0, reduceBottom: height)
                    }
                }
            }
        }
    }
    
    @objc func closeEstimateView(_ notification: Notification)
    {
        self.subviewCount = 1
        self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
    }
    
    @objc func changedCurrentTaxi(_ notification : Notification){
        self.setupData()
    }
    
    @objc func vechileSttaus(_ notification: Notification)
    {
        self.updateLoation()
    }
}


// Map location Function
extension HomeVC : GMSMapViewDelegate, CLLocationManagerDelegate{
   
    // it enable mapdelegate and location button [163 to 185]
    func setupMapDelegate(){
        
        self.mapView.delegate = self
        self.mapView.isMyLocationEnabled = false
        self.mapView.settings.myLocationButton = false
        self.mapView.settings.compassButton = true
         
        
        //Enable Location Service in mobile
        if CLLocationManager.locationServicesEnabled()
        {
            locationManager.requestAlwaysAuthorization()
            locationManager.startUpdatingLocation()
            locationManager.startUpdatingHeading()
        }
        else
        {
            showToast(msg: "Please enable the location service in settings")
        }
        
        self.locationManager.startUpdatingLocation()
        
    }
    
    
    // MARK : Handle authorization for the location manager.
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        
        switch status {
        case .restricted:
            print("Location access was restricted.")
        case .authorizedAlways:
            self.locationManager.startUpdatingLocation()
        case .authorizedWhenInUse:
            self.locationManager.startUpdatingLocation()
            
        case .notDetermined:
            self.locationManager.requestAlwaysAuthorization()
        case .denied:
            print("User denied access to location.")
        }
    }
    
    // MARK: Handle location manager errors.
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        locationManager.stopUpdatingLocation()
        print("Error: \(error)")
    }
    
    // MARK: update Location
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {

        self.MyLocation = locations.first?.coordinate ?? CLLocationCoordinate2D()
        self.oldLocation = locations.first!
//        self.currentLocation = locations.last ?? CLLocation()
       var location: CLLocation = locations.last ?? CLLocation()
        location = CLLocation(coordinate: location.coordinate, altitude: location.distance(from: location), horizontalAccuracy: location.horizontalAccuracy, verticalAccuracy: location.verticalAccuracy, course: self.lastUserHeading, speed: location.speed, timestamp: Date())
        self.currentLocation = location
        
        print("*****CurrentLocation",self.currentLocation)
        
        // focus to current  location
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
         print("%@%#%",tripid)
        if tripid.isEmpty || tripid == "0" {
            self.mapView.camera = GMSCameraPosition(target: self.currentLocation.coordinate, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
             
//                 self.mapView.camera = GMSCameraPosition(target: self.MyLocation, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
        }
        
        // getting current Address
        convertLatLangTOAddress(coordinates: self.currentLocation, address: { (address) -> Void in
            self.currentAddress = address
            print("*****Getting_Address" , self.currentAddress)
        })
        
        //update location in Firebase based on online status
        if Constant.profileData.online{
            self.updateFBLocation(loc: self.currentLocation)
            self.updateLocation(Status: "1")
        }else{
            self.updateLocation(Status: "0")

            self.updateFBLocation(loc: CLLocation())
//            self.locationManager.stopUpdatingLocation()
        }
        
    }
    
    //get the vehicle turning angle
    func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
               if (self.previousUserHeading - self.lastUserHeading) > 10.0{
                    lastUserHeading = newHeading.trueHeading as Double
                }else{
                    lastUserHeading = self.previousUserHeading
                }
                
                self.rotationAngle = (self.lastUserHeading - self.lastMapBearing)
                
                var location: CLLocation = self.currentLocation
                location = CLLocation(coordinate: location.coordinate, altitude: location.distance(from: location), horizontalAccuracy: location.horizontalAccuracy, verticalAccuracy: location.verticalAccuracy, course: self.lastUserHeading, speed: location.speed, timestamp: Date())
                
                self.currentLocation = location
//                self.loadTrackingMarker(fromLocation: self.oldLocation, toLocation: self.currentLocation, bearing: self.lastUserHeading)
        
            self.previousUserHeading = newHeading.trueHeading as Double
        }
    
    
    func setDriverLocationMarker(driverLoc : CLLocation){
        let driverMarker = GMSMarker()
        driverMarker.icon = UIImage(named: "car_maker.png")
        driverMarker.map = self.mapView
        driverMarker.isFlat = true
        driverMarker.position = CLLocationCoordinate2D(latitude: driverLoc.coordinate.latitude, longitude: driverLoc.coordinate.longitude)
        driverMarker.rotation = driverLoc.course
        
        if(!isMarkerWithinScreen(marker: driverMarker)){
            let fancy = GMSCameraPosition.camera(withLatitude:  driverLoc.coordinate.latitude, longitude: driverLoc.coordinate.longitude, zoom: 10, bearing: driverLoc.course, viewingAngle: 0)
            self.mapView.animate(to: fancy)
        }
    }
    
    func getTravelDistance(pickupaddr: String, dropaddr: String,pickupLoc : CLLocation , dropLoc : CLLocation, tripSttaus : String,tripstatus : FBTripDataModel, tripType : String){
        let pickuplat : String = UserDefaults.standard.value(forKey: UserDefaultsKey.pickuplat) as? String ?? "0.0"
        let pickuplang : String = UserDefaults.standard.value(forKey: UserDefaultsKey.pickuplang) as? String ?? "0.0"
        let pickupaddr = UserDefaults.standard.value(forKey: UserDefaultsKey.pickupaddrs)
        let origin = "\(pickuplat),\(pickuplang)"
        let destination = "\(dropLoc.coordinate.latitude),\(dropLoc.coordinate.longitude)"
        
         print("..DrawPolyline1..")
        self.googleVM.getPolylineTimeTravel(origin: origin, destination: destination, waypoints: "")
        
        self.googleVM.directionClosure = {
            let distant : String = self.googleVM.getDirection?.routes?[0].legs?[0].distance?.text ?? "0 \(Constant.distanceUnit)"
            let distarray = distant.split(separator: " ")
            if distarray.count>0{
                if distarray[1] == "m"{
                    let kmdis : String = ((Double(String(distarray[0]) as String ) ?? 0.0) / 1000.0).description
                    self.travelDistance = kmdis + " \(Constant.distanceUnit)"
                }else{
                    self.travelDistance = self.googleVM.getDirection?.routes?[0].legs?[0].distance?.text ?? "0 \(Constant.distanceUnit)"
                    
                }
            }
            self.travelDuraction = self.googleVM.getDirection?.routes?[0].legs?[0].duration?.text ?? "0 mins"
            if tripType == "rental" || tripType == "outstation"  {
                self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "4", tripstatus: tripstatus, tripType: tripType)
            }else{
                self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "4", tripstatus: tripstatus, tripType: "")
            }
        }
        
        self.googleVM.errDirectionClouser = {
            if tripType == "rental" || tripType == "outstation"{
                self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "4", tripstatus: tripstatus, tripType: tripType)
            } else {
                self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "4", tripstatus: tripstatus, tripType: "")
            }
        }
    }
        
        
    func setPolyLineWithMaker(pickupaddr: String, dropaddr: String,pickupLoc : CLLocation , dropLoc : CLLocation, tripSttaus : String,waypoints: String,midpoint : [CLLocation]){
         print("..DrawPolyline..")
         
        let origin = "\(pickupLoc.coordinate.latitude),\(pickupLoc.coordinate.longitude)"
        let destination = "\(dropLoc.coordinate.latitude),\(dropLoc.coordinate.longitude)"
        
        self.googleVM.getPolylineTimeTravel(origin: origin, destination: destination,waypoints: waypoints)
        
        self.googleVM.directionClosure = {
             
            guard let drirection = self.googleVM.getDirection else {return}
            
            self.path = GMSPath(fromEncodedPath:  self.googleVM.getDirection?.routes?[0].overviewPolyline?.points ?? "")!
            self.polyline.path = self.path
            self.polyline.strokeColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.5)
            self.polyline.strokeWidth = 3.0
            self.polyline.title =  "\(String(describing: self.googleVM.getDirection?.routes?[0].legs?[0].distance?.text))\n\(self.googleVM.getDirection?.routes?[0].legs?[0].duration?.text)"
            self.polyline.map = self.mapView
            
            var bounds = GMSCoordinateBounds()
            for index in 1...self.path.count() {
                bounds = bounds.includingCoordinate(self.path.coordinate(at: index))
            }
            
            self.mapView.animate(with: GMSCameraUpdate.fit(bounds,withPadding: 100))
            
            let pickupRoadPoin : CLLocation = CLLocation(latitude: Double(self.googleVM.getDirection?.routes?[0].legs?[0].startLocation?.lat ?? 0.0), longitude:  Double(self.googleVM.getDirection?.routes?[0].legs?[0].startLocation?.lng ?? 0.0))
            
            let dropRoadPoin : CLLocation = CLLocation(latitude: Double(self.googleVM.getDirection?.routes?[0].legs?[0].endLocation?.lat ?? 0.0), longitude:  Double(self.googleVM.getDirection?.routes?[0].legs?[0].endLocation?.lng ?? 0.0))
            
            if waypoints.count > 0 {
                self.setupMultipointMarker(waypoint: midpoint)
            }
            
            self.setMaker(pickupaddr: pickupaddr, dropaddr: dropaddr,pickupLoc : pickupRoadPoin ,dropLoc : dropLoc , time :self.googleVM.getDirection?.routes?[0].legs?[0].duration?.text ?? "0 mins" , distance :self.googleVM.getDirection?.routes?[0].legs?[0].distance?.text ?? "0 km" )
        }
        
        self.googleVM.errDirectionClouser = {
            self.hiddenShowViews = 1
            self.subviewCount = 0
            self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
        }
    }
    
     
    @objc func animatePolylinePath() {
        
        if (self.i < self.path.count()) {
            self.animationPath.add(self.path.coordinate(at: self.i))
            self.animationPolyline.path = self.animationPath
            self.animationPolyline.strokeColor = UIColor.black
            self.animationPolyline.strokeWidth = 3
            self.animationPolyline.map = self.mapView
            self.i += 1
        }
        else {
            self.i = 0
            self.animationPath = GMSMutablePath()
            self.animationPolyline.map = nil
        }
    }
    
    func setupMultipointMarker(waypoint : [CLLocation]){
        for value in waypoint{
            let waypointMarker = GMSMarker()
            waypointMarker.icon = UIImage(named: "multistop.png")
            waypointMarker.map = self.mapView
            waypointMarker.isFlat = true
            waypointMarker.position = CLLocationCoordinate2D(latitude: value.coordinate.latitude, longitude: value.coordinate.longitude)
            
        }
    }
    
    
    func setMaker(pickupaddr : String , dropaddr : String,pickupLoc : CLLocation , dropLoc : CLLocation ,time : String , distance : String ){
        pickupMarker.icon = UIImage(named: "pickup_marker.png")
        pickupMarker.map = self.mapView
        pickupMarker.isFlat = true
        pickupMarker.position = CLLocationCoordinate2D(latitude: pickupLoc.coordinate.latitude, longitude: pickupLoc.coordinate.longitude)
        dropMarker.icon = UIImage(named: "drop_marker.png")
        dropMarker.map = self.mapView
        dropMarker.isFlat = true
        dropMarker.position = CLLocationCoordinate2D(latitude: dropLoc.coordinate.latitude, longitude: dropLoc.coordinate.longitude)
    }
    
 
    
    func mapView(_ mapView: GMSMapView, didTap marker: GMSMarker) -> Bool {
        
        return true
    }
    
    func mapView(_ mapView: GMSMapView, idleAt position: GMSCameraPosition) {
        
        let location = CLLocation(latitude: position.target.latitude, longitude: position.target.longitude)
        
    }
    
    func loadTrackingMarker(fromLocation : CLLocation , toLocation : CLLocation , bearing : Double, status: String){
        if let vehicle : CurrentActiveTaxi = Constant.currentTaxi as? CurrentActiveTaxi{
            if vehicle.vehicletype == "Mini"{
                self.trackingMarker.icon = status == "1" ? UIImage(named: "ic_mini.png") : UIImage()
            }else if vehicle.vehicletype == "Sedan"{
                self.trackingMarker.icon = status == "1" ? UIImage(named: "ic_sedan.png") : UIImage()
            }else if vehicle.vehicletype == "SUV"{
                self.trackingMarker.icon = status == "1" ? UIImage(named: "ic_suv.png") : UIImage()
            }else{
                self.trackingMarker.icon = status == "1" ? UIImage(named: "car_maker.png") : UIImage()
            }
        }
        self.trackingMarker.map = self.mapView
        self.trackingMarker.isFlat = true
        self.trackingMarker.position = CLLocationCoordinate2D(latitude: toLocation.coordinate.latitude, longitude: toLocation.coordinate.longitude)
        trackingMarker.rotation =  bearing
    }
    
    func isMarkerWithinScreen(marker: GMSMarker) -> Bool {
        let region = self.mapView.projection.visibleRegion()
        let bounds = GMSCoordinateBounds(region: region)
        return bounds.contains(marker.position)
    }
    
    //MARK: angle Heading
    func mapView(_ mapView: GMSMapView, didChange position: GMSCameraPosition) {
        
        self.lastMapBearing = position.bearing
        self.rotationAngle = -(self.lastUserHeading - self.lastMapBearing)
        
        if(self.flagMapFirstTime){
            zoomFloat = 14
            self.flagMapFirstTime = false
        }else{
            zoomFloat = Double(mapView.camera.zoom)
        }
    }
}

//APi call
extension HomeVC{
    func setOnlinOffLine(online: String){
        self.homevm.changeOnlineStatus(view: self.view, status: online)
        self.homevm.getOnlineclouser = {
            if self.homevm.online?.message == "Online" {
                self.onlineImg.image = UIImage(named: "green")
                self.statusLbl.text = self.Localize.stringForKey(key: "available")
                Constant.profileData.online = true
                self.onlineOfflineStatus(Status: "1")
                self.updateLocation(Status: "1")
                if Constant.profileData.online{
                    self.hailTaxiImg.isHidden = false
                }else{
                    self.hailTaxiImg.isHidden = true
                }
            }else {
                self.onlineImg.image = UIImage(named: "red")
                self.statusLbl.text = self.Localize.stringForKey(key: "unavailable")
                self.hailTaxiImg.isHidden = true
                Constant.profileData.online = false
                self.onlineOfflineStatus(Status: "0")
                self.updateLocation(Status: "0")
                
                self.updateFBLocation(loc: CLLocation())
            }
        }
    }
    
    func getProfileData(){
        self.profile.getProfile()
        self.profile.successprofile = {
             Constant.profileData = self.profile.profileData ?? ProfileModel()
             print("profile::,\(self.profile.profileData?.attendance)")
            print("SADFASDFADS", Constant.profileData.attendance)
             self.subscriptionBool = Constant.profileData.isSubcriptionActive
             print("issubscription:::\(self.subscriptionBool)")
            self.setupData()
            if Constant.profileData.attendance == false {
                let vc = DailyAttendanceVC.initWithStory()
                vc.modalPresentationStyle = .overFullScreen
                self.present(vc, animated: true, completion: nil)
            }

        }
    }
    
    func updateLocation(Status : String){
        self.homevm.updateLocation( loc: self.currentLocation, status: Status)
        //        self.setDriverLocationMarker(driverLoc: self.currentLocation)
        self.loadTrackingMarker(fromLocation: self.oldLocation, toLocation: self.currentLocation, bearing: self.lastUserHeading, status: Status)
        if Status == "1"{
            self.updateFBLocation(loc: self.currentLocation)
        }else if Status == "0"{
            self.updateFBLocation(loc: CLLocation())
        }
    }
    
    func updateTripStatus(location : CLLocation , address : String , status : String,tripstatus : FBTripDataModel,tripType:String){
         print("status and trip status:::", status , tripstatus)
         print("two driver status:; \(tripstatus.safeRide.safeRidetripStatus)")
         print("Saferide status:; \(UserDefaults.standard.string(forKey: UserDefaultsKey.safeRide))")
        let formatter = DateFormatter()
        formatter.dateFormat = "hh:mm a"
        let time : String = formatter.string(from: Date())
        
        let tripid = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
        let lat : String = (location.coordinate.latitude).description
        let lang : String = (location.coordinate.longitude).description
        print("status:::", status)
        if status == "3"  {
            var newUpdate : String = ""
            let isstarted : String =  UserDefaults.standard.value(forKey: UserDefaultsKey.isstarted) as? String ?? ""
            if isstarted == "true"{
                newUpdate = "false"
            }else{
                newUpdate = "true"
            }
            
            if tripType == "rental" || tripType == "outstation" {
                let km :  String = UserDefaults.standard.value(forKey: UserDefaultsKey.startKM) as? String ?? ""
                self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: lat, pickupLng: lang, startTime: time, fromAddress: address, endAddress: "", endTime: "", waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: "", dropLat: "", duration: "", tripId: tripid, status: status, distance: "", startMeter: km, endMeter: "", hillKm: "", newUpdate: newUpdate, cusemailid: "", safeRide: "false")
            }else{
                 print("two driver :: \(tripstatus.safeRide.safeRidetripStatus)")
                 if !tripstatus.safeRide.safeRidetripStatus.isEmpty {
                      self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: lat, pickupLng: lang, startTime: time, fromAddress: address, endAddress: "", endTime: "", waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: "", dropLat: "", duration: "", tripId: tripid, status: status, distance: "",startMeter: "", endMeter: "", hillKm: "", newUpdate: newUpdate, cusemailid: "", safeRide: "true")
                 } else {
                      self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: lat, pickupLng: lang, startTime: time, fromAddress: address, endAddress: "", endTime: "", waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: "", dropLat: "", duration: "", tripId: tripid, status: status, distance: "",startMeter: "", endMeter: "", hillKm: "", newUpdate: newUpdate, cusemailid: "", safeRide: "false")
                 }
            }
            
        }else if status == "4"{
            let duraction = self.travelDuraction.split(separator: " ")
            var strduraction : String = "0.00"
            var strdistance : String = "0"
            
            if duraction.count > 0{
                strduraction = duraction[0].description
            }
            let distance = self.travelDistance.split(separator: " ")
            if distance.count > 0{
                strdistance = distance[0].description
            }
            let ridetype : String = UserDefaults.standard.value(forKey: UserDefaultsKey.triptype) as? String ?? ""
            if  ridetype == "hailtaxi"{
                self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: "", pickupLng: "", startTime: "", fromAddress: "", endAddress: address, endTime: time, waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: lang, dropLat: lat, duration: String(format: "%.3f", actualtravelDistance), tripId: tripid, status: status, distance: strdistance, startMeter: "", endMeter: "",hillKm: "", newUpdate: "true", cusemailid: "", safeRide: "false")
            }else{
                if tripType == "rental" || tripType == "outstation"{
                    let km :  String = UserDefaults.standard.value(forKey: UserDefaultsKey.endKM) as? String ?? ""
                    let hillKm :  String = UserDefaults.standard.value(forKey: UserDefaultsKey.hillKm) as? String ?? ""
                    self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: "", pickupLng: "", startTime: "", fromAddress: "", endAddress: address, endTime: time, waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: lang, dropLat: lat, duration: strduraction, tripId: tripid, status: status, distance: strdistance,startMeter: "", endMeter: km, hillKm: "", newUpdate: "true",cusemailid: "", safeRide: "false")
                }else{
                     let safe =  UserDefaults.standard.string(forKey: UserDefaultsKey.safeRide) ?? ""
                     print("Ride:::", safe)
          if !tripstatus.safeRide.safeRidetripStatus.isEmpty {
                          self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: "", pickupLng: "", startTime: "", fromAddress: "", endAddress: address, endTime: time, waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: lang, dropLat: lat, duration: String(format: "%.3f", actualtravelDistance), tripId: tripid, status: status, distance: strdistance,startMeter: "", endMeter: "", hillKm: "", newUpdate: "true", cusemailid: "", safeRide: "true")
                     } else {
                          self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: "", pickupLng: "", startTime: "", fromAddress: "", endAddress: address, endTime: time, waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: lang, dropLat: lat, duration: String(format: "%.3f", actualtravelDistance), tripId: tripid, status: status, distance: strdistance,startMeter: "", endMeter: "", hillKm: "", newUpdate: "true", cusemailid: "", safeRide: "false")
                     }
                }
            }
        }else{
             if !tripstatus.safeRide.safeRidetripStatus.isEmpty {
                  print("Status::::", status)
                  self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: "", pickupLng: "", startTime: "", fromAddress: "", endAddress: "", endTime: "", waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: "", dropLat: "", duration: "", tripId: tripid, status: status, distance: "",startMeter: "", endMeter: "", hillKm: "", newUpdate: "false", cusemailid: "", safeRide: "true")
             } else {
                  self.homevm.tripCurrentStatus(view: self.view, allowanceDistance: "", pickupLat: "", pickupLng: "", startTime: "", fromAddress: "", endAddress: "", endTime: "", waitingTime: "", waitingSecond: "", additionalFee: "", dropLng: "", dropLat: "", duration: "", tripId: tripid, status: status, distance: "",startMeter: "", endMeter: "", hillKm: "", newUpdate: "false", cusemailid: "", safeRide: "false")
             }
             
        }
         self.homevm.getTripRouteClouser = {
              self.tripRouteStatus = self.homevm.tripRoute ?? TripStatusModel()
              print("uuuuu::: \(self.tripRouteStatus.status), and isfirsdriver:: \(self.tripRouteStatus.isFirstDriver)")
              print("Status::::", tripstatus)
              print("Status::::", status)
           //   print("rider token is:: \(tripstatus.rider_token)")
              
              self.RouteRiderOTPViews(tripstatus: tripstatus,tripType: self.tripRouteStatus.tripType)
              let ridetype : String = UserDefaults.standard.value(forKey: UserDefaultsKey.triptype) as? String ?? ""
              if  ridetype == "hailtaxi"{
                   self.RouteRiderOTPViews(tripstatus: tripstatus, tripType: "hailtaxi")
              } else {
                   if self.tripRouteStatus.tripType != "rental"{
                        self.listenDriverLocationForPolyline(tripstatus: status, rideDetails: self.tripRouteStatus)
                   } else {
                        self.mapView.clear()
                        self.mapView.camera = GMSCameraPosition(target: self.currentLocation.coordinate, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
                   }
                   print("driver id is:: \(self.driverid), and trip driver id:; \(tripstatus.driver_id)")
                   if tripstatus.driver_id != self.driverid {
               //    if !tripstatus.safeRide.secondDriver.isEmpty /*&& !self.isfirstdriver*/ {
                        print("status::::", tripstatus.safeRide.safeRidetripStatus)
                        if tripstatus.safeRide.safeRidetripStatus == "6" || tripstatus.safeRide.safeRidetripStatus == "7" {
                            /* if tripstatus.safeRide.safeRidetripStatus == "7" {
                                  UserDefaults.standard.set(lat.description, forKey: UserDefaultsKey.pickuplat)
                                  UserDefaults.standard.set(lang.description, forKey: UserDefaultsKey.pickuplang)
                             UserDefaults.standard.set(address, forKey: UserDefaultsKey.pickupaddrs)
                                  UserDefaults.standard.set("true", forKey: UserDefaultsKey.isstarted)
                             }*/
                             print("update status: \(status)")
                           //  self.updateTripSttaus(Status: status)
                        } else if tripstatus.safeRide.safeRidetripStatus == "8" {
                         self.rideStatusView.deInitView()
                              self.rideDetailView.deInitView()
                              let vc = InvoiceVC.initWithStory()
                              vc.modalPresentationStyle = .fullScreen
                              self.navigationController?.present(vc, animated: true, completion: nil)
                              UserDefaults.standard.set("false", forKey: UserDefaultsKey.isstarted)
                             }
                        
                   } else {
                        print("status::::", status)
                        if status == "2" || status == "3"{
                             if status == "3"{
                                  print("asdass:::,\(tripstatus)")
                                  UserDefaults.standard.set(lat.description, forKey: UserDefaultsKey.pickuplat)
                                  UserDefaults.standard.set(lang.description, forKey: UserDefaultsKey.pickuplang)
                                  UserDefaults.standard.set(address, forKey: UserDefaultsKey.pickupaddrs)
                                  UserDefaults.standard.set("true", forKey: UserDefaultsKey.isstarted)
                            //      gfhfgh
//                                  self.RouteRiderOTPViews(tripstatus: tripstatus,tripType: self.tripRouteStatus.tripType)
                                  if self.tripRouteStatus.tripType != "rental" || self.tripRouteStatus.tripType != "outstation"{
                                       self.alertView.isHidden = true
                                  }else{
                                       self.alertView.isHidden = false
                                  }
                             }
                             self.updateTripSttaus(Status: status)
//                             self.RouteRiderOTPViews(tripstatus: tripstatus,tripType: self.tripRouteStatus.tripType)
                        }else if status == "4"{
                             self.rideStatusView.deInitView()
                             self.rideDetailView.deInitView()
                             let vc = InvoiceVC.initWithStory()
                             vc.modalPresentationStyle = .fullScreen
                             self.navigationController?.present(vc, animated: true, completion: nil)
                             UserDefaults.standard.set("false", forKey: UserDefaultsKey.isstarted)
                        }
                   }
              }
         }
    }
    
    func listenDriverLocationForPolyline(tripstatus : String,rideDetails : TripStatusModel){
        var endLoc : CLLocation = CLLocation()
        let driverLoc : CLLocation = CLLocation(latitude: self.currentLocation.coordinate.latitude, longitude: self.currentLocation.coordinate.longitude)
        var startLoc : CLLocation = CLLocation()
        if rideDetails.routeData.startcoords.count > 0{
            startLoc = CLLocation(latitude: CLLocationDegrees(rideDetails.routeData.startcoords[1]), longitude: CLLocationDegrees(rideDetails.routeData.startcoords[0]))
        }
        if rideDetails.routeData.endcoords.count > 0{
            endLoc = CLLocation(latitude: CLLocationDegrees(rideDetails.routeData.endcoords[1]), longitude: CLLocationDegrees(rideDetails.routeData.endcoords[0]))
        }
        
        var mulitway : String = ""
        var midpoint : [CLLocation] = [CLLocation]()
        if rideDetails.mulitiLocation.count > 0{
            if rideDetails.mulitiLocation.count == 3 {
                mulitway = "\(rideDetails.mulitiLocation[1].doubleLat),\(rideDetails.mulitiLocation[1].doubleLng)"
                midpoint.append(CLLocation(latitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[1].doubleLat) ?? 0.0), longitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[1].doubleLng) ?? 0.0)))
                
            }else if rideDetails.mulitiLocation.count == 4 {
                mulitway = "\(rideDetails.mulitiLocation[1].doubleLat),\(rideDetails.mulitiLocation[1].doubleLng)"+"|"+"\(rideDetails.mulitiLocation[2].doubleLat),\(rideDetails.mulitiLocation[2].doubleLng)"
                
                midpoint.append(CLLocation(latitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[1].doubleLat) ?? 0.0), longitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[1].doubleLng) ?? 0.0)))
                midpoint.append(CLLocation(latitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[2].doubleLat) ?? 0.0), longitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[2].doubleLng) ?? 0.0)))
                
            }
        }
         
//         if tripstatus == "6" || tripstatus == "7" {
//              print("set 5")
//
//              self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: startLoc, tripSttaus: tripstatus, waypoints: "", midpoint: midpoint)
//         } else {
              if tripstatus == "1" || tripstatus == "2"{
                 
                   
                        print("set 6")
                        self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: startLoc, tripSttaus: tripstatus, waypoints: "", midpoint: midpoint)
                
                   
              }else if tripstatus == "3"{
                  if rideDetails.mulitiLocation.count > 2{
                      self.stopImage.isHidden = false
                  }else{
                      self.stopImage.isHidden = true
                  }
                  self.mulitiLocationAddress = rideDetails.mulitiLocation
                  self.addressList.reloadData()
                  
                        print("set 7")
                        self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: endLoc, tripSttaus: tripstatus, waypoints: mulitway, midpoint: midpoint)
                 
              }
         if tripstatus == "6" {
               //if tripstatus.safeRide.safeRidetripStatus == "6" {
                   self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: startLoc, tripSttaus: tripstatus, waypoints: "", midpoint: midpoint)
              //}
         }else if tripstatus == "7"{
              self.addressList.reloadData()
              
                    
                    self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: endLoc, tripSttaus: tripstatus, waypoints: mulitway, midpoint: midpoint)
             
         }
        
    }
    
    func cancelRide(tripId : String){
        self.homevm.cancelRide(view: self.view, tripId: tripId)
        self.homevm.getcancelClouser = {
            self.updateTripSttaus(Status: "5")
            self.rideStatusView.deInitView()
        }
    }
}


//FirebaseDatas
extension HomeVC{
    
    func getFBCancelLationDetails(){
        self.FBConnect.cancelReason { (canceldatas) in
            Constant.lowbalnce = canceldatas.alertLabels.lowBalanceAlert ?? "0.0"
            Constant.miniBlncAlrt = canceldatas.alertLabels.minimumBalanceDriverAlert
        }
    }
    
    func logout(){
        let token : String =  Constant.fcm_id
        FireBaseconnection.instanse.forceLogout(token: token) { (logout) in
            if logout{
                self.removeFBLocation()
                self.logoutApiCall()
            }
        }
    }
    
    func removeFBLocation(){
        if Constant.currentTaxi.isDaily{
            self.FBConnect.removerGeoFrie()
        }
        if Constant.currentTaxi.isRental{
            self.FBConnect.RentalremoverGeoFrie()
        }
        if Constant.currentTaxi.isOutstation{
            self.FBConnect.outstationremoverGeoFrie()
        }
        
    }
    
    func logoutApiCall(){
        self.homevm.logout(view: self.view)
        
        self.homevm.getlogout = {
            
            let domain = Bundle.main.bundleIdentifier!
            UserDefaults.standard.removePersistentDomain(forName: domain)
            UserDefaults.standard.synchronize()
            
            let navigation = UINavigationController(rootViewController: LoginVC.initWithStory())
            self.appDelegate.window?.rootViewController = navigation
        }
    }
    
    func getFBDriverDetails(){
         self.FBConnect.getdDriversData { [self] (driverData) in
              print("DRIVER ::\(driverData.request.status)")
              if let drivers : FBDriverDataModel? = driverData{
                   Constant.credits = drivers?.credits ?? "0.0"
                   
                   if drivers?.proof_status != "Accepted"{
                        self.proofStatusView.isHidden = false
                        if  drivers?.proof_status == "Rejected"{
                             self.proofstatusLbl.text = self.Localize.stringForKey(key: "proof_rej")
                             
                        }else if drivers?.proof_status != "Pending"{
                             self.proofstatusLbl.text = self.Localize.stringForKey(key: "proof_pending")
                        }else{
                             self.proofstatusLbl.text = drivers?.proof_status.lowercased()
                        }
                        self.setOnlinOffLine(online: "0")
                        self.startView.isUserInteractionEnabled = false
                        
                   }else{
                        
                        self.proofStatusView.isHidden = true
                        self.startView.isUserInteractionEnabled = true
                        
                   }
              }
              print("onlinestatus::::", driverData.online_status)
              print("driverdata::::",driverData)
              self.onlinestatusvalue = driverData.online_status
//              self.FBConnect.updateFCMToken { (done) in
//                  print("Token_Updated")
//              }
              let tripId = driverData.accept.trip_id.description
//                           print("TripId::::", tripId)
//                           UserDefaults.standard.set(tripId, forKey: UserDefaultsKey.tripId)
              let safeRide = driverData.request.safeRideData.safeRideStatus
              let driverId = UserDefaults.standard.string(forKey: UserDefaultsKey.userid) ?? ""
              let secondDriver = driverData.request.safeRideData.secondDriver
              print("Trips Data:::::", safeRide)
              print("trips Data::::", secondDriver, "driver", tripId.description)

              if !tripId.isEmpty/* || tripId == "0"*/{
                   print("tripIDDD;;;;;", driverData.accept.trip_id)
                   UserDefaults.standard.set(tripId, forKey: UserDefaultsKey.tripId)
                 
                     
                   
              }
              print("safeRideStatus::,\(driverData.request.safeRideData.safeRideStatus):::adasdsasd,\(twoDriverListen)adhjdaghghasd::::::\(driverData.accept.trip_id)")
                   if driverData.accept.trip_id != 0 {
                       // if !twoDriverListen {
            //   if driverData.request.safeRideData.safeRideStatus == "true"{
            NotificationCenter.default.post(name: Notification.Name("twodriverListen"), object: nil)
                         //   twoDriverListen = true
                             
//                        }
                        print("TWO DRIVER LISTEN VAL:: \(twoDriverListen)")
//                   }
              }

            //  self.getFBTripData()
         
          if let rideRequest : FBDriverDataModel? = driverData{
                if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? "" as? String{
//                     print("trip_id : \(trip_id)")
                     print("request type:: \(rideRequest?.request.safeRideData.safeRideStatus), requesttype:: \(rideRequest?.request.request_type)")
               //      print("rideRequest : ",rideRequest, rideRequest?.request.status)
                    if trip_id.isEmpty || trip_id == "0"{
                         if rideRequest?.request.status == "1"{
                              print("Status::::", rideRequest?.request.review)
                              UserDefaults.standard.set("true", forKey: UserDefaultsKey.isacceptedView)
                              let vc = AcceptDeclineVC.initWithStory()
                              vc.requestType = rideRequest?.request.request_type ?? ""
                              print("vc.:: \(vc.requestType)")
                           //   vc.secondDelegate = self
                              vc.modalPresentationStyle = .fullScreen
                              self.present(vc, animated: true, completion: nil)
                         }
                        if rideRequest?.request.status == "2"{
                            let tripid : Int = rideRequest?.accept.trip_id ?? 0
                             UserDefaults.standard.set(tripid.description, forKey: UserDefaultsKey.tripId)
                            UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
                        }
                    }else{
                         UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView) //
                    }
//                        UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
                        //                        if rideRequest?.request.status == "0"{
                        //                        UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripId)
                        //                        }
//                    }
                }
            }
        }
         
         self.FBConnect.getVehicleData { (vehicleData) in
              if let vehicles : FBVehicleDataModel? = vehicleData{
                   print("vehiclessss;|\(vehicles?.status)")
                   
                   if vehicles?.status != "1"{
                        self.proofStatusView.isHidden = false
                        self.proofstatusLbl.text = self.Localize.stringForKey(key: "vehicle_proof")
                        self.setOnlinOffLine(online: "0")
                        self.startView.isUserInteractionEnabled = false
                        
                   }else{
                        
                        self.proofStatusView.isHidden = true
                        self.startView.isUserInteractionEnabled = true
                        
                   }
              }
         }
    }
    func updateFBLocation(loc : CLLocation){
        if let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? "" as? String{
            if !trip_id.isEmpty{
                self.FBConnect.updateGeoFire(loc: loc)
            }else{
                if Constant.currentTaxi.isDaily{
                    self.FBConnect.updateVehicleLocation(loc: loc)
                }else{
                    self.FBConnect.removerGeoFrie()
                }
                if Constant.currentTaxi.isRental{
                    self.FBConnect.RentalVehicleLocation(loc: loc)
                }else{
                    self.FBConnect.RentalremoverGeoFrie()
                }
                if Constant.currentTaxi.isOutstation{
                    self.FBConnect.outstationLocation(loc: loc)
                }else{
                    self.FBConnect.outstationremoverGeoFrie()
                }
            }
            calculateTravelDis(loc: loc)
        }else{
            self.FBConnect.updateVehicleLocation(loc: loc)
        }
    }

    func updateLoation(){
        if Constant.profileData.online{
            self.updateFBLocation(loc: self.currentLocation)
        }else{
            self.removeFBLocation()
        }
    }
    
    func onlineOfflineStatus(Status: String){
        self.FBConnect.setOnlineStatus(Status: Status)
    }
    
    func updateTripSttaus(Status: String){
         print("Updatestatus:::,\(Status)")
        self.FBConnect.CreateFirebaseTripData(status: Status)
    }
    
    func updateEndTrip(rideDetails: TripStatusModel){
        //        self.FBConnect.UpdateEndTripData(status: "4",rideDetails: rideDetails)
    }
    
    func getFBTripData(){
         print("getFBTripData 11")
        self.FBConnect.getTripData { (tripData) in
            print("dxfdxhgchgvhgjvjhv", tripData.status)
             tripData.safeRide.safeRidetripStatus
            
            if let tripstatus : FBTripDataModel = tripData as? FBTripDataModel {
                var driverId = UserDefaults.standard.string(forKey: UserDefaultsKey.userid)
                 var firstdriver = UserDefaults.standard.string(forKey: UserDefaultsKey.isdriver)
                 let tripdriverid = tripstatus.driver_id
                 print("TWO DRIVER STATUS ID ::\(tripstatus.safeRide.safeRidetripStatus)")
                 print("my data::::", tripstatus.safeRide, tripdriverid)
                 print("first USerid:: \(driverId), and then \n secondtriver id:: \(tripstatus.safeRide.secondDriver), and driver id :: \(tripdriverid)")
              
              //   if tripstatus.safeRide.safeRidestatus == "true"/*&& self.isfirstdriver == false */{
              //   if tripstatus.safeRide.safeRidestatus == "true" { //!tripstatus.safeRide.secondDriver.isEmpty {
                         //    if self.isfirstdriver != true {
                           print("self.driver id:: \(self.driverid), and trip id:: \(tripstatus.driver_id)")
                           if self.driverid != tripstatus.driver_id {
                                print("tripsafeRideStatus:::", tripData.safeRide.safeRidetripStatus)
                                let tripType = UserDefaults.standard.value(forKey: UserDefaultsKey.triptype) as? String ?? ""
                                /*   if /*tripstatus.status == "9"*/ tripstatus.safeRide.safeRidetripStatus == "9" {
                                 self.FBConnect.cancelDeclineEndTrip()
                                 self.mapView.clear()
                                 UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripId)
                                 self.rideStatusView.deInitView()
                                 self.rideDetailView.deInitView()
                                 self.otpView.deInitView()
                                 self.vehicleView.deInitView()
                                 } else {*/
                                if tripstatus.safeRide.safeRidetripStatus == "6" {
                                     print("locationsss::::", self.currentLocation)
                                     self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: tripstatus.safeRide.safeRidetripStatus, tripstatus: tripstatus, tripType: tripType)
                                } else if tripstatus.safeRide.safeRidetripStatus == "7" {
                                     self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: tripstatus.safeRide.safeRidetripStatus, tripstatus: tripstatus, tripType: tripType)
                                     
                                } else if /*tripstatus.status == "4" &&*/ tripstatus.safeRide.safeRidetripStatus == "8" {
                                     self.rideStatusView.deInitView()
                                     self.rideDetailView.deInitView()
                                     
                                          self.mapView.clear()
                                       //   self.viewDidLoad()
                               
                                     let vc = InvoiceVC.initWithStory()
                                     vc.modalPresentationStyle = .fullScreen
                                     
                                     self.present(vc, animated: true, completion: nil)
                                }  else if tripstatus.status == "5" || tripstatus.safeRide.safeRidetripStatus == "9" {
                                     self.FBConnect.cancelDeclineEndTrip()
                                     self.mapView.clear()
                                     UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripId)
                                     self.rideStatusView.deInitView()
                                     self.rideDetailView.deInitView()
                                     self.otpView.deInitView()
                                     self.vehicleView.deInitView()
                                }
                          
                   /*   } else {
                           if tripstatus.status == "1" || tripstatus.status == "2" || tripstatus.status == "3"{
                               let tripType = UserDefaults.standard.value(forKey: UserDefaultsKey.triptype) as? String ?? ""
                               print("locationsss::::", tripstatus.status)
                               self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: tripstatus.status, tripstatus: tripstatus, tripType: tripType)
                               
                           } else if tripstatus.status == "4" {
                               self.rideStatusView.deInitView()
                               self.rideDetailView.deInitView()
                               self.mapView.clear()
                               self.viewDidLoad()
                               let vc = InvoiceVC.initWithStory()
                               vc.modalPresentationStyle = .fullScreen
                               self.present(vc, animated: true, completion: nil)
                               
                           } else if tripstatus.status == "5" {
                               self.FBConnect.cancelDeclineEndTrip()
                               self.mapView.clear()
                               UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripId)
                               self.rideStatusView.deInitView()
                               self.rideDetailView.deInitView()
                               self.otpView.deInitView()
                               self.vehicleView.deInitView()
                           }
                      }
                    //  }*/
                } else {
                     print("jhfjk::,\(tripstatus.status)")
                    if tripstatus.status == "1" || tripstatus.status == "2" || tripstatus.status == "3"{
                        let tripType = UserDefaults.standard.value(forKey: UserDefaultsKey.triptype) as? String ?? ""
                        print("locationsss::::", tripstatus.status)
                        self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: tripstatus.status, tripstatus: tripstatus, tripType: tripType)
                        
                    } else if tripstatus.status == "4" {
                        self.rideStatusView.deInitView()
                        self.rideDetailView.deInitView()
                        self.mapView.clear()
                      //  self.viewDidLoad()
                        let vc = InvoiceVC.initWithStory()
                        vc.modalPresentationStyle = .fullScreen
                        self.present(vc, animated: true, completion: nil)
                        
                    } else if tripstatus.status == "5" {
                        self.FBConnect.cancelDeclineEndTrip()
                         
                        self.mapView.clear()
                        UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripId)
                        // self.isAcceptTripPolyline = false
                      //   self.isStartTripPolyline = false
                        self.rideStatusView.deInitView()
                        self.rideDetailView.deInitView()
                        self.otpView.deInitView()
                        self.vehicleView.deInitView()
                    }
                }
            }
        }
    }
    
    func calculateTravelDis(loc : CLLocation){
        let trip_id : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
        let isstarted : String = UserDefaults.standard.value(forKey: UserDefaultsKey.isstarted) as? String ?? ""
        
        if !trip_id.isEmpty{
            if isstarted == "true"{
                
                var speed : CLLocationSpeed = CLLocationSpeed()
                speed = loc.speed
                
                if startlocations.coordinate.latitude == 0.0{
                    self.startlocations = loc
                    let distance : CLLocationDistance = loc.distance(from: self.startlocations)
                    
                    actualtravelDistance += Float(Float(distance)*( 1.04 / 1000.00))
                    //                                showToast(msg: "Rider###Started@@@@@@\(String(format: "%.0f km/h", speed*3.6))====\((String(format: "%.3f", actualtravelDistance)))")
                }else{
                    let distance : CLLocationDistance = loc.distance(from: self.startlocations)
                    
                    self.startlocations = loc
                    actualtravelDistance += Float(Float(distance)*( 1.04 / 1000.00))
                    //                                showToast(msg: "RiderStarted@@@@@@\(String(format: "%.0f km/h", speed*3.6))=====\( (String(format: "%.3f", actualtravelDistance)))")
                }
                
                
            }
        }
    }
    
    func RouteRiderOTPViews(tripstatus : FBTripDataModel , tripType : String){
        self.alertView.isHidden = true
         print("Stauts:::", tripstatus)
        self.rideStatusView.initView(view: self.view,address : self.currentAddress,tripRotue: self.tripRouteStatus, tripstatus: tripstatus, tripStatus: { (tripstatuss) in
             print("is first driver : \(self.tripRouteStatus.isFirstDriver)")
             self.isfirstdriver = self.tripRouteStatus.isFirstDriver
             print("status:::", tripstatuss, self.isfirstdriver)
            self.FBtripstatus = tripstatus
            if tripstatuss == "2"{
                 print("Locations:::", self.currentLocation)
                 let alert = UIAlertController(title: "Alert", message: "Are you sure want to click tap to Arrive?" , preferredStyle: UIAlertController.Style.alert)
                 alert.addAction(UIAlertAction(title: "No", style: UIAlertAction.Style.default, handler: nil))
                 alert.addAction(UIAlertAction(title: "Yes", style: UIAlertAction.Style.default, handler: { (alert) in
                      self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "2", tripstatus: tripstatus, tripType: "")
                 }))
                 self.present(alert, animated: true, completion: nil)
                
            }else if tripstatuss == "3" {
                 if let rideDetail : RideDetailView = self.rideDetailView as? RideDetailView{
                      self.rideDetailView.deInitView()
                 }
                /* if tripstatuss == "6" && self.isfirstdriver == false {// sneka changes
                      let choosePotoView = ChoosepotosVc.initWithStory()
                      choosePotoView.imgstatus = .start
                      choosePotoView.tripModel = tripstatus
                      choosePotoView.delegate = self
                      self.navigationController?.present(choosePotoView, animated: true, completion: nil)
     //                 self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "7", tripstatus: tripstatus, tripType: "")
                     
                 } else {*/
                      self.otpView.initView(view: self.view, pageFrom: "homepage",tripRotue: self.tripRouteStatus, submit: { (otp) in
                           self.otpView.deInitView()
                           //navigation setting
                           DispatchQueue.main.asyncAfter(deadline: .now() + 5){
                              //  self.OPEN_URL_Options()
                           }
                           if tripType == "rental" || tripType == "outstation"{
                                self.alertView.isHidden = false
                                self.kmtesttitleLbl.text = "Odameter reading at the start of the trip"
                                self.kmtestFile.placeholder = "Trip start meter"
                                if tripType == "rental" || tripType == "outstation"{
                                     self.hillTextFild.isHidden = true
                                }
                           }else{
                                self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "3", tripstatus: tripstatus, tripType: "")
                           }
                           
                      })
                      //}
            }else if tripstatuss == "4" {
                if tripType == "rental" || tripType == "outstation"{
                    self.alertView.isHidden = false
                    self.kmtesttitleLbl.text = "Odameter reading at the end of the trip"
                    self.kmtestFile.placeholder = "Trip end meter"
                    if tripType == "rental"{
                        self.hillTextFild.isHidden = true
                    }else{
                        self.hillTextFild.isHidden = false
                    }
                }else{
                     let alert = UIAlertController(title: "Alert", message: "Are you sure want to end the trip? " , preferredStyle: UIAlertController.Style.alert)
                     alert.addAction(UIAlertAction(title: "No", style: UIAlertAction.Style.default, handler: nil))
                     alert.addAction(UIAlertAction(title: "Yes", style: UIAlertAction.Style.default, handler: { (alert) in
                          print("set 8")
                       //   self.isAcceptTripPolyline = false
                       //   self.isStartTripPolyline = false
                         
                         self.getTravelDistance(pickupaddr: "", dropaddr: self.currentAddress, pickupLoc: CLLocation(), dropLoc: self.currentLocation, tripSttaus: "4" , tripstatus: tripstatus, tripType: "")
                         
                     }))
                     self.present(alert, animated: true, completion: nil)
                    
                    //  self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "4", tripstatus: tripstatus, tripType: "")
                }
              print("is firs driver:: \(self.isfirstdriver)")
            } else if tripstatuss == "6" {
                 if  self.isfirstdriver == true{
                      self.otpView.initView(view: self.view, pageFrom: "homepage",tripRotue: self.tripRouteStatus, submit: { (otp) in
                           self.otpView.deInitView()
                           //navigation setting
//                           DispatchQueue.main.asyncAfter(deadline: .now() + 5){
//                                self.OPEN_URL_Options()
//                           }
                           if tripType == "rental" || tripType == "outstation"{
                                self.alertView.isHidden = false
                                self.kmtesttitleLbl.text = "Odameter reading at the start of the trip"
                                self.kmtestFile.placeholder = "Trip start meter"
                                if tripType == "rental" || tripType == "outstation"{
                                     self.hillTextFild.isHidden = true
                                }
                           }else{
                                print("googluck")
                                self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "3", tripstatus: tripstatus, tripType: "")
                           }
                           
                      })
                 } else {
                                    print("correct process")
                                                     let choosePotoView = ChoosepotosVc.initWithStory()
                                                     choosePotoView.imgstatus = .start
                                                     choosePotoView.tripModel = tripstatus
                                                     choosePotoView.delegate = self
                                                     self.navigationController?.present(choosePotoView, animated: true, completion: nil)
                                              //       self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "7", tripstatus: tripstatus, tripType: "")
                                   // print("is status end driver:: \(self.isfirstdriver)")
                               }
            }
               else if tripstatuss == "7" /*&& !self.isfirstdriver*/ {
                    if self.isfirstdriver == true {
                         let alert = UIAlertController(title: "Alert", message: "Are you sure want to end the trip? " , preferredStyle: UIAlertController.Style.alert)
                         alert.addAction(UIAlertAction(title: "No", style: UIAlertAction.Style.default, handler: nil))
                         alert.addAction(UIAlertAction(title: "Yes", style: UIAlertAction.Style.default, handler: { (alert) in
                              print("set 9")
            //     self.getTravelDistance(pickupaddr: "", dropaddr: self.currentAddress, pickupLoc: CLLocation(), dropLoc: self.currentLocation, tripSttaus: "4" , tripstatus: tripstatus, tripType: "")
                             
                         }))
                         self.present(alert, animated: true, completion: nil)
                        
                        //  self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "4", tripstatus: tripstatus, tripType: "")
                    } else {
                         let choosePotoView = ChoosepotosVc.initWithStory()
                         choosePotoView.imgstatus = .end
                         choosePotoView.tripModel = tripstatus
                         choosePotoView.delegate = self
                         self.navigationController?.present(choosePotoView, animated: true, completion: nil)
                    }
               /*  if tripstatus.status == "4" {
                      let choosePotoView = ChoosepotosVc.initWithStory()
                      choosePotoView.imgstatus = .end
                      choosePotoView.tripModel = tripstatus
                      choosePotoView.delegate = self
                      self.navigationController?.present(choosePotoView, animated: true, completion: nil)
                 } else {
                      showToast(msg: "Wait a moment")
                 }*/
                 
                 
            }
             
//             if tripstatus.safeRide.safeRidetripStatus == "6" {
//                 let choosePotoView = ChoosepotosVc.initWithStory()
//                 self.navigationController?.present(choosePotoView, animated: true, completion: nil)
//             }
//             self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "3", tripstatus: tripstatus, tripType: "")
            
            
        }, ridedetail: { (riderDetail) in
            
            self.rideDetailView.initView(view: self.view, tripRotue: self.tripRouteStatus, call: { (call) in
//                if let url = URL(string: "tel://\(call)"), UIApplication.shared.canOpenURL(url) {
//                    if #available(iOS 10, *) {
//                        UIApplication.shared.open(url)
//                    } else {
//                        UIApplication.shared.openURL(url)
//                    }
//                }
                 self.focusCallPage(mode: false)
                 let vc = VideoCallVC.initWithStory()
                 print("driverfcmhomepage::\(self.FBtripstatus?.rider_token), oooo:: \(tripstatus.rider_token)")
                 vc.riderfcm =   tripstatus.rider_token //self.FBtripstatus?.rider_token ?? ""
                 vc.ridername = self.tripRouteStatus.rider.fname
                 vc.riderpic = self.tripRouteStatus.rider.profileurl
                 vc.firebaseNotiifcation(message: "Your Driver inviting you to join call", fcm: tripstatus.rider_token)
                 vc.dismissPage = {
                     self.focusCallPage(mode: true)
                 }
                 self.navigationController?.pushViewController(vc, animated: true)
            }, message: { (message) in
                let vc = ChatVC.initWithStory()
                vc.name = self.tripRouteStatus.rider.fname
                 print("TOkens for rider::\(tripstatus.rider_token)")
                vc.fcm = tripstatus.rider_token
                vc.modalPresentationStyle = .fullScreen
                self.navigationController?.present(vc, animated: true, completion: nil)
            }, cancel: { (cancel) in
                
                
                
                let tripid = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
                
                self.cancelRideAlert(tripid: tripid)
            })
            
        }, navigation: { (navigation) in
            
            if tripType == "rental"{
                if let route : TripRotemodel = self.tripRouteStatus.pickupdetails as? TripRotemodel{
                    
                    if (UIApplication.shared.canOpenURL(URL(string:"comgooglemaps://")! as URL)) {
                        
                        UIApplication.shared.openURL(NSURL(string:
                                                            "comgooglemaps://?saddr=\(route.startcoords[1]),\(route.startcoords[0])&daddr=&directionsmode=driving")! as URL)
                        
                    } else {
                        if route.startcoords.count > 0 && route.endcoords.count > 0{
                            UIApplication.shared.openURL(NSURL(string:
                                                                "https://www.google.co.in/maps/dir/?saddr=\(route.startcoords[1]),\(route.startcoords[0])&daddr=&directionsmode=driving")! as URL)
                            NSLog("Can't use comgooglemaps://");
                        }
                    }
                }
            }else{
                 self.OPEN_URL_Options()
              /*  if let route : TripRotemodel = self.tripRouteStatus.routeData as? TripRotemodel{
                    
                    if (UIApplication.shared.canOpenURL(URL(string:"comgooglemaps://")! as URL)) {
                        
                        UIApplication.shared.openURL(NSURL(string:
                                                            "comgooglemaps://?saddr=\(route.startcoords[1]),\(route.startcoords[0])&daddr=\(route.endcoords[1]),\(route.endcoords[0])&directionsmode=driving")! as URL)
                        
                    } else {
                        if route.startcoords.count > 0 && route.endcoords.count > 0{
                            UIApplication.shared.openURL(NSURL(string:
                                                                "https://www.google.co.in/maps/dir/?saddr=\(route.startcoords[1]),\(route.startcoords[0])&daddr=\(route.endcoords[1]),\(route.endcoords[0])&directionsmode=driving")! as URL)
                            NSLog("Can't use comgooglemaps://");
                        }
                    }
                }*/
            }
            
        })
    }
    
    func cancelRideAlert(tripid : String){
        let alert = UIAlertController(title: "Cancel Ride", message: "Are you sure wants to cancel this Ride ?", preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(title: "No", style: UIAlertAction.Style.default, handler: nil))
        alert.addAction(UIAlertAction(title: "Yes", style: UIAlertAction.Style.default, handler: { (alert) in
            self.cancelRide(tripId: tripid)
        }))
        self.present(alert, animated: true, completion: nil)
    }
     private func OPEN_URL_Options(){
         let mulitLocation : [MulitiLocation]? = self.mulitiLocationAddress
         let tripModel : TripRotemodel = self.tripRouteStatus.routeData as? TripRotemodel ?? TripRotemodel()
         var started = Bool()
         print("tripFBStatus.status : \(tripRouteStatus.status)")
         switch tripRouteStatus.status{
             case  "Accept","Arrive Now" :
                 started = false
                 break
             case "Start Trip":
                 started = true
                 break
             default: break
         }
         let navtype = UserDefaults.standard.string(forKey: UserDefaultsKey.navType)?.isEmpty ?? true
         if let multiLoc = mulitLocation,multiLoc.count > 2,started{
             if navtype{
                 var DestinationArray : [String] = multiLoc.compactMap({$0.strAddress})
                 DestinationArray.removeFirst()
                 let startList = (multiLoc.first?.strAddress ?? "").addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
                 let destinationList = DestinationArray.map({$0.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!}).joined(separator: "+to:")
                     let urlStr = (UIApplication.shared.canOpenURL(NSURL(string:"comgooglemaps://")! as URL)) ? "comgooglemaps://?saddr=\(startList)&daddr=\(destinationList)&directionsmode=driving" : "https://www.google.co.in/maps/dir/?saddr=\(startList)&daddr=\(destinationList)&directionsmode=driving"
                 self.OpenURL(url: urlStr)
             }else{
                 let startCoo = "\(multiLoc.first?.doubleLat ?? "0.0"),\(multiLoc.first?.doubleLat ?? "0.0")"
                 /*var DestinationCoo = multiLoc.map({"&ll=\($0.doubleLat),\($0.doubleLng)"})*/
                 /*"add_stop"*/
                 var DestinationCoo = multiLoc.map{"&\($0 == multiLoc.last ? "ll" : "add_stop")=\($0.doubleLat),\($0.doubleLng)"}
                 DestinationCoo.removeFirst()
                 let endCoo = DestinationCoo.joined()
                 let APPurl = "waze://?ll=\(startCoo)&navigate=yes\(DestinationCoo.joined())".addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
                 let urlString = UIApplication.shared.canOpenURL(NSURL(string: "waze://")! as URL) ? APPurl : "https://www.waze.com/ul?ll=\(endCoo)&navigate=yes"
                 self.OpenURL(url: urlString)
             }
         }else{
             //let startAddr = tripModel.start
             let startCoo = started ? "\(tripModel.startcoords[1]),\(tripModel.startcoords[0])" : "\(self.currentLocation.coordinate.latitude),\(self.currentLocation.coordinate.longitude)"
             //let endAddr = tripModel.end
             let endCoo = started ? "\(tripModel.endcoords[1]),\(tripModel.endcoords[0])" : "\(tripModel.startcoords[1]),\(tripModel.startcoords[0])"
             if navtype{
                 let urlStr = (UIApplication.shared.canOpenURL(NSURL(string:"comgooglemaps://")! as URL)) ? "comgooglemaps://?saddr=\(startCoo)&daddr=\(endCoo)&directionsmode=driving" : "https://www.google.co.in/maps/dir/?saddr=\(startCoo)&daddr=\(endCoo)&directionsmode=driving"
                 self.OpenURL(url: urlStr)
             }else{
                 let urlString = UIApplication.shared.canOpenURL(NSURL(string: "waze://")! as URL) ? "waze://?ll=\(endCoo)&navigate=yes" : /*"https://www.waze.com/ul?ll=\(endCoo)&navigate=yes&ll=\(startCoo)"*/"https://www.waze.com/ul?ll=\(endCoo)&navigate=yes"
                 
                 self.OpenURL(url: urlString)
             }
         }
     }
     
     func OpenURL(url : String){
        let myUrl = url
         print("myUrl : \(myUrl)")
        if let url = URL(string: "\(myUrl)"), !url.absoluteString.isEmpty {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
     }
}

extension HomeVC : Delegate {
     func delegate(withTrips: FBTripDataModel, type: ImgUpload) {
          print("trip type:: \(type)")
          if type == .start {
               self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "7", tripstatus: withTrips, tripType: "")
               
          } else if type == .end {
               self.updateTripStatus(location: self.currentLocation, address: self.currentAddress, status: "8", tripstatus: withTrips, tripType: "")
                         
          }
     }
}

extension HomeVC : UITableViewDelegate , UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count : Int =  self.mulitiLocationAddress.count as? Int{
            return count
        }
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "addressListCell") as! addressListCell
        cell.addressViews.isElevation = 5
        
        if let data : MulitiLocation = self.mulitiLocationAddress[indexPath.row] as? MulitiLocation{
            if indexPath.row == 0{
                cell.addressTitleLbl.text = "Pickup"
            }else if indexPath.row == self.mulitiLocationAddress.count-1 {
                cell.addressTitleLbl.text = "Drop"
            }else{
                cell.addressTitleLbl.text = "Stop"
            }
            
            cell.addressLbl.text = data.strAddress
        }
        return cell
    }
    
    func setupTableview(){
        self.addressList.delegate = self
        self.addressList.dataSource = self
        self.addressList.reloadData()
    }
}


extension HomeVC: SecondDriverDelegate {
    func second(tripID: String) {
        print("Idsss:::", tripID)
        let vc = SecondryMobileNoVc.initWithStory()
        vc.tripId = tripID
        self.navigationController?.present(vc, animated: true, completion: nil)
    }
}

class addressListCell : UITableViewCell{
    
    @IBOutlet weak var addressLbl : UILabel!
    @IBOutlet weak var addressTitleLbl : UILabel!
    @IBOutlet weak var addressViews : UIView!
    
    override class func awakeFromNib() {
        super.awakeFromNib()
        
    }
}
