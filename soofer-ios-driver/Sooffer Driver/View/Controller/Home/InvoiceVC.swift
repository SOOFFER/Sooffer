//
//  InvoiceVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 15/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import Cosmos
import MarqueeLabel

class InvoiceVC: UIViewController {
    
    @IBOutlet weak var priceTopView: UIView!
    
    @IBOutlet weak var addressView: UIView!
    @IBOutlet weak var priceTable: UITableView!
    
    @IBOutlet weak var PriceTabeleHeight: NSLayoutConstraint!
    @IBOutlet weak var pageTitleLbl: UILabel!
    @IBOutlet weak var totalFeeLbl: UILabel!
    
    @IBOutlet weak var commentTxt: UITextField!
    @IBOutlet weak var ratingTitle: UILabel!
    @IBOutlet weak var totalPriceLbl: UILabel!
    
    @IBOutlet weak var startRatingView: CosmosView!
    @IBOutlet weak var submitBtn: UIButton!
    @IBOutlet weak var dropAddress: MarqueeLabel!
    @IBOutlet weak var currentAddrssLbl: MarqueeLabel!
    @IBOutlet weak var billLbl: UILabel!
    @IBOutlet weak var dateLbl: UILabel!
    @IBOutlet weak var dicountLbl: UILabel!
    @IBOutlet weak var discountPriceLbl: UILabel!
    
    @IBOutlet weak var hidestatckeview : UIStackView!
    
    @IBOutlet weak var makename: UILabel!
    
    @IBOutlet weak var modelname: UILabel!
    
    @IBOutlet weak var numberlabel: UILabel!
    
    @IBOutlet weak var colorname: UILabel!
    @IBOutlet weak var shadowview : UIView!
    
    @IBOutlet weak var shadowviewhgt: NSLayoutConstraint!
    
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var homevm = HomeVM()
    var ratings : String = ""
    var oldLocation = CLLocation()
    var lastUserHeading = Double()
    
    var currentLocation = CLLocation()
    var pickupaddr : String = ""
    var pickupCity : String = ""
    var pickupLoc : CLLocation = CLLocation()
    var dropAddr : String = ""
    var dropCity : String = ""
    var dropLoc : CLLocation = CLLocation()
    
    lazy var locationManager: CLLocationManager = {
        var _locationManager = CLLocationManager()
        _locationManager.desiredAccuracy = kCLLocationAccuracyBest
        _locationManager.delegate = self
        _locationManager.startMonitoringSignificantLocationChanges()
        _locationManager.distanceFilter = 2
        return _locationManager
        
    }()
    
    
    //Firebase object
    var FBConnect = FireBaseconnection.instanse
    
    var priceTitleArray : [String] = []
    var priceValueArray : [String] = []
    var desc : [String] = []
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
        self.getFBDriverDetails()
        self.homevm = HomeVM(view: self.view, dataService: ApiRoot())
        
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupMapDelegate()
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupDelegate()
    }
    
    func setupView(){
        self.priceTopView.layer.cornerRadius = 10
        self.priceTopView.isElevation        = 3
        self.addressView.layer.cornerRadius  = 10
        self.addressView.isElevation         = 3
    //   self.hidestatckeview.layer.cornerRadius = 10
     //   self.hidestatckeview.isElevation        = 3
        self.priceTable.layer.cornerRadius      = 10
        self.priceTable.isElevation             = 3
        self.submitBtn.roundeCornorBorder       = 5
        self.shadowview.isElevation = 3
        self.shadowview.layer.cornerRadius = 10
    }
    
    func setupAction(){
      
        self.startRatingView.didFinishTouchingCosmos = { rating in
            self.ratings = rating.description
        }
        
        self.submitBtn.addAction(for: .tap) {
            //            self.dismiss(animated: true, completion: nil)
            
            self.ratings = self.startRatingView.rating.description
            
            var comment : String = self.commentTxt.text ?? ""
            
//            if (!comment.isEmpty && !self.ratings.isEmpty){
                self.riderFeedback(rating: self.ratings, comment: comment)
//            }else{
//                showToast(msg: "Must give Star Rating and comments for you Driver")
//            }
            UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
          
            NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
            
        }
    }
    
    
    func setupLang(){
        self.pageTitleLbl.text = Localize.stringForKey(key: "invoice_title")
        self.totalFeeLbl.text = Localize.stringForKey(key: "total_fare")
        self.billLbl.text = Localize.stringForKey(key: "bill_rate")
        self.dicountLbl.text = Localize.stringForKey(key: "discount_app")
        self.ratingTitle.text = Localize.stringForKey(key: "rate_title")
        self.submitBtn.setTitle(Localize.stringForKey(key: "submit"), for: .normal)
    }
    
    class func initWithStory()->InvoiceVC{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "InvoiceVC") as! InvoiceVC
        return vc
    }
    
    
    override func viewWillLayoutSubviews() {
        super.updateViewConstraints()
        self.PriceTabeleHeight?.constant = self.priceTable.contentSize.height
    }
    
    func setupDate(tripDetails : FBTripDataModel){
        if let details :FBTripDataModel = tripDetails as? FBTripDataModel{
            self.currentAddrssLbl.text = details.pickup_address
            self.dropAddress.text = details.Drop_address
            self.totalPriceLbl.text = Constant.priceTag + details.total_fare
            self.discountPriceLbl.text = Constant.priceTag + details.discount
            self.makename.text = details.safeRide.edtMake
            self.modelname.text = details.safeRide.edtModel
            self.colorname.text = details.safeRide.edtcolor
            self.numberlabel.text = details.safeRide.edtPhoneNumber
            
            
            if details.safeRide.safeRidestatus == "true"{
              //  self.hidestatckeview.isHidden = false
                self.shadowview.isHidden = false
            //    self.shadowviewhgt.constant = 135
            } else {
                self.shadowview.isHidden = true
                self.shadowviewhgt.constant = 0
                
            }
             
            
            
            
            let formatter = DateFormatter()
            formatter.dateFormat = "YYYY-MM-dd"
            let date : String = formatter.string(from: Date())
            
            self.dateLbl.text = date
            
             if details.triptype == "rental" || details.triptype == "outstation"{
                            self.jsonconversion(tripDetails: tripDetails)
             }
             else{
                self.priceTitleArray = [self.Localize.stringForKey(key: "distance") ,
                self.Localize.stringForKey(key: "time") ,
            //                                    self.Localize.stringForKey(key: "base_fare") ,
                self.Localize.stringForKey(key: "Waiting_Time") ,
                self.Localize.stringForKey(key: "waiting_fare") ,
            //                                    self.Localize.stringForKey(key: "time_fare") ,
                self.Localize.stringForKey(key: "ride_fare") ,
            //                                    self.Localize.stringForKey(key: "pickup_fee") ,
            self.Localize.stringForKey(key: "gateway_fare") ,
                self.Localize.stringForKey(key: "access_fee") ,
            //                                    self.Localize.stringForKey(key: "cancelleantion_fee") ,
                self.Localize.stringForKey(key: "payment_method")]
                self.priceValueArray = [
                            details.distance + " \(Constant.distanceUnit)",
                            details.time + " Mins",
            //                Constant.priceTag + details.basefare,
                              details.waitingTime + " Mins",
                              decimalDataString(data : details.waiting_fare),
            //                  decimalDataString(data : details.time_fare),
                              decimalDataString(data : details.distance_fare),
            //                  decimalDataString(data : details.convance_fare),
                              decimalDataString(data : details.gatewayCharge) ,
                              decimalDataString(data : details.tax),
            //                  decimalDataString(data : details.cancel_fare),
                            details.pay_type
                        ]
            }
            print("PRICETABLEDATA",self.priceValueArray)
            self.priceTable.reloadData()
        }
    }
}


extension InvoiceVC: UITableViewDataSource,UITableViewDelegate{
    
    func setupDelegate(){
        self.priceTable.register(UINib(nibName: "PriceCell", bundle: nil), forCellReuseIdentifier: "PriceCell")
        self.priceTable.delegate = self
        self.priceTable.dataSource = self
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.priceTitleArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "PriceCell", for: indexPath) as! PriceCell
        cell.priceTitlelbl.text = self.priceTitleArray[indexPath.row]
        if self.priceTitleArray.count == self.priceValueArray.count{
            cell.priceLbl.text = self.priceValueArray[indexPath.row]
        }
        if self.desc.count > 0{
        if self.desc[indexPath.row].isEmpty{
            cell.descdummyLbl.isHidden = true
            cell.desclbl.isHidden = true
        }else{
            cell.descdummyLbl.isHidden = false
            cell.desclbl.isHidden = false
            cell.desclbl.text = self.desc[indexPath.row]
        }
        }else{
            cell.descdummyLbl.isHidden = true
            cell.desclbl.isHidden = true
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 50
    }
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        self.viewWillLayoutSubviews()
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(indexPath.row)
    }
}


extension InvoiceVC{
    func riderFeedback(rating : String , comment : String){
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripId) as? String ?? ""
        self.homevm.riderFeedBack(view: self.view, tripId: tripid, rating: rating, comments: comment)
        self.homevm.getfeedbackClouser = {
         //   showToast(msg: self.homevm.feedback?.message ?? "")
            self.FBConnect.cancelDeclineEndTrip()
       
            UserDefaults.standard.set("false", forKey: UserDefaultsKey.isacceptedView)
            NotificationCenter.default.post(name: .appEnterInBackGround, object: nil)
            
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripId)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.triptype)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.startKM)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.endKM)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.hillKm)
                                                             
            self.updateFBLocation(loc: self.currentLocation)
            
            DispatchQueue.main.asyncAfter(deadline: .now()+0.2, execute: {
                let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
                self.appDelegate.window?.rootViewController = MenuRoot
            })
        }
    }
}
// Map location Function
extension InvoiceVC :  CLLocationManagerDelegate{
    
    // it enable mapdelegate and location button [163 to 185]
    func setupMapDelegate(){
        
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
        
        self.oldLocation = locations.first!
        //        self.currentLocation = locations.last ?? CLLocation()
        var location: CLLocation = locations.last ?? CLLocation()
        location = CLLocation(coordinate: location.coordinate, altitude: location.distance(from: location), horizontalAccuracy: location.horizontalAccuracy, verticalAccuracy: location.verticalAccuracy, course: self.lastUserHeading, speed: location.speed, timestamp: Date())
        self.currentLocation = location
        
        print("*****CurrentLocation",self.currentLocation)
        
        
        
    }
}
extension InvoiceVC{
   func getFBDriverDetails(){
          self.FBConnect.getTripData { (tripDetails) in
              self.setupDate(tripDetails: tripDetails)
             
              
          }
      }
      
      func jsonconversion(tripDetails : FBTripDataModel){
          
          do{
              let data = Data(tripDetails.invoiceBill.utf8)
              
              let json : AnyObject = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as AnyObject
              self.parseJson(anyObj: json)
              
             print("jsonjsonjsonjsonjson: \(json)")
              
    
          }catch{
              print("JSONS Error")
          }
          
      }
      
      func parseJson(anyObj:AnyObject){


           if  anyObj is Array<AnyObject> {


              for json in anyObj as! Array<AnyObject>{
                  self.priceTitleArray.append((json["label"]  as AnyObject? as? String) ?? "")
                   self.priceValueArray.append((json["value"]  as AnyObject? as? String) ?? "")
                self.desc.append((json["desc"]  as AnyObject? as? String) ?? "")

              }
              self.priceTable.reloadData()
          }

      }
    
    func updateFBLocation(loc : CLLocation){
        self.FBConnect.updatedefatulLoc(loc: loc)
    }
}
