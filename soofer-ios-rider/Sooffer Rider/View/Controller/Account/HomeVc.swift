//
//  HomeVc.swift
//  Sooffer Rider
//
//  Created by Abservetech on 16/02/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit
import GoogleMaps
import Kingfisher

enum RedirectHome {
    case ride
    case hour
    case driver
    case recentAddress
    case riderlater
}

class HomeVc: UIViewController {
    
    @IBOutlet weak var navView: UIView!
    
    @IBOutlet weak var profileImg: UIImageView!
    
    @IBOutlet weak var NowLbl: UILabel!
    @IBOutlet weak var addresslbl: UILabel!
    
    @IBOutlet weak var WhereTOLbl: UILabel!
    @IBOutlet weak var RequestNowLbl: UILabel!
    @IBOutlet weak var addressView: UIView!
    @IBOutlet weak var nowVw: UIView!
    
    @IBOutlet weak var rideView: UIView!
    @IBOutlet weak var hourlyView: UIView!
    @IBOutlet weak var driverView: UIView!
    
    @IBOutlet weak var whereToView: UIView!
    
    @IBOutlet weak var recentAddressVw: UIView!
    
    @IBOutlet weak var address1lbl: UILabel!
    @IBOutlet weak var address2lbl: UILabel!
    
    @IBOutlet weak var mapView: GMSMapView!
    
    @IBOutlet weak var MapTop: UIView!
    
    @IBOutlet weak var RideLBL: UILabel!
    
    @IBOutlet weak var HourlyLBL: UILabel!
    
    @IBOutlet weak var DriverLBL: UILabel!
    @IBOutlet weak var newprofileimg: UIImageView!
    
    
    
    let Localize : Localizations = Localizations.instance
    
    class func initWithStory()->HomeVc{
        let vc = UIStoryboard.init(name: "Account", bundle: Bundle.main).instantiateViewController(withIdentifier: "HomeVc") as! HomeVc
        return vc
    }
    
    var currentLocation = CLLocation()
    let locationManager = CLLocationManager()
    var currentAddress = String()
    var currentlat     = Double()
    var currentLng     = Double()
    var redirectHome : RedirectHome = .driver
    private var cameraPosition = GMSCameraPosition()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        addUIElements()
        setupLang()
        
        locationManager.requestAlwaysAuthorization()
        locationManager.requestWhenInUseAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            locationManager.delegate = self
            locationManager.desiredAccuracy = kCLLocationAccuracyBest
            locationManager.startUpdatingLocation()
        }
    }
   
//    func setupData(){
//        if let profileData : ProfileModel  = Constant.profileData as? ProfileModel{
//            let urls : String = ServiceApi.Base_Image_URL+profileData.profile
//            self.profileImg?.pin_setImage(from: URL(string: urls))
//            self.profileImg.clipsToBounds = true
//        }
//    }
    
    
   func  setupLang() {
        
              
       self.RideLBL.text = Localize.stringForKey(key: "ride")
       self.HourlyLBL.text = Localize.stringForKey(key: "hourly")
       self.DriverLBL.text = Localize.stringForKey(key: "driver")
       self.WhereTOLbl.text = Localize.stringForKey(key: "where_to?")
       self.RequestNowLbl.text = Localize.stringForKey(key: "request_Now")
       self.NowLbl.text = Localize.stringForKey(key: "now")
                
    }
    
    func addUIElements() {
        
        profileImg.addTap {
            self.sideMenuController?.revealMenu()
        }
        
        if let profileData : ProfileModel  = Constant.profileData as? ProfileModel{
            print("url: \(ServiceApi.Base_Image_URL+profileData.profile)")
            let urls : String = ServiceApi.Base_Image_URL+profileData.profile
          
            let url = URL(string: ServiceApi.Base_Image_URL+profileData.profile)
            print("urls:: \(url)")
//            self.newprofileimg?.pin_setImage(from: URL(string: urls))
//            self.newprofileimg.layer.cornerRadius = self.newprofileimg.frame.width / 2
//            self.newprofileimg.clipsToBounds = true
            
            
            self.profileImg.kf.setImage(with: url)
          //  self.profileImg?.pin_setImage(from: URL(string: urls))
            self.profileImg.layer.cornerRadius = self.profileImg.frame.width / 2
            self.profileImg.clipsToBounds = true
        }
//        profileImg.layer.cornerRadius = profileImg.frame.width / 2
        
        nowVw.addCornerRadius(withRadius: 9, withBackgroundColor: .clear, withBorderWidth: 0)
        
        
        [rideView, hourlyView, driverView, whereToView, mapView, addressView].forEach { (viewss) in
            viewss?.addShadow(withShadow: .lightGray, withradius: 4)
            viewss?.addCornerRadius(withRadius: 8, withBackgroundColor: .clear, withBorderWidth: 0)
        }
        
        
        nowVw.addTap {
            let homeBookingVc = HomeVC.initWithStory()
            UserDefaults.standard.set(false, forKey: UserDefaultsKey.driver)
            homeBookingVc.redirectHome = .riderlater
            self.navigationController?.pushViewController(homeBookingVc, animated: true)
        }
        
        addressView.addTap {
            let homeBookingVc = HomeVC.initWithStory()
            UserDefaults.standard.set(false, forKey: UserDefaultsKey.driver)
            homeBookingVc.redirectHome = .recentAddress
            self.navigationController?.pushViewController(homeBookingVc, animated: true)
        }
        MapTop.addTap {
            let homeBookingVc = HomeVC.initWithStory()
            UserDefaults.standard.set(false, forKey: UserDefaultsKey.driver)
//            homeBookingVc.redirectHome = .recentAddress
            self.navigationController?.pushViewController(homeBookingVc, animated: true)
        }
     
        
        
        self.rideView.addTap {
            let homeBookingVc = HomeVC.initWithStory()
            UserDefaults.standard.set(false, forKey: UserDefaultsKey.driver)
            homeBookingVc.redirectHome = .ride
            homeBookingVc.currentAddress = self.currentAddress
            self.navigationController?.pushViewController(homeBookingVc, animated: true)
        }
        
        self.hourlyView.addTap { [unowned self] in
            let homeBookingVc = HomeVC.initWithStory()
            homeBookingVc.redirectHome = .hour
            print("currentAddress:::,\(currentAddress)")
            homeBookingVc.currentAddress = currentAddress
            homeBookingVc.currentLocation = CLLocation(latitude: currentlat, longitude: currentLng)
            UserDefaults.standard.set(false, forKey: UserDefaultsKey.driver)
            self.navigationController?.pushViewController(homeBookingVc, animated: true)
        }
        
        self.driverView.addTap {
            let homeBookingVc = HomeVC.initWithStory()
            homeBookingVc.redirectHome = .driver
            homeBookingVc.currentAddress = self.currentAddress
            UserDefaults.standard.set(true, forKey: UserDefaultsKey.driver)
            self.navigationController?.pushViewController(homeBookingVc, animated: true)
        }
        
        whereToView.addTap { [unowned self] in
            let vc = SearchAddressVC.initWithStoryboard()
            vc.currentAddress = currentAddress
            vc.currentLocation = CLLocation(latitude: currentlat, longitude: currentLng)
            self.navigationController?.pushViewController(vc, animated: true)
        }
    }
}

extension HomeVc: CLLocationManagerDelegate {
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        
        let userLocation: CLLocation = locations[0] as CLLocation
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 3){
//            convertLatLangTOAddress(coordinates: userLocation) { address in
//                self.currentAddress = address
//                self.addresslbl.text = self.currentAddress
//                self.address1lbl.text = self.currentAddress
//                self.address2lbl.text = self.currentAddress
//            }
            getCurrentLocationFromGeoCoder(loc: userLocation) { (address) in
                print("addofnewHome::\(address)")
                self.currentAddress = address
                self.addresslbl.text = self.currentAddress
                self.address1lbl.text = self.currentAddress
                self.address2lbl.text = self.currentAddress
            }

        }
//        let geocoder = CLGeocoder()
        
//        geocoder.reverseGeocodeLocation(userLocation) { (placemarks, error) in
//            if (error != nil){
//                print("error in reverseGeocode")
//            }
//            let placemark = placemarks ?? [CLPlacemark]()
//            if placemark.count>0{
//                let placemark = placemarks![0]
//                print("FGGFDSG",placemark.locality!)
//                print("FDGFDSGD",placemark.administrativeArea!)
//                print("FDGDFSG",placemark.country!)
//                let address = placemark.name! + ", " + placemark.administrativeArea! + ", " + placemark.country!
//                self.currentAddress = address
//                self.addresslbl.text = self.currentAddress
//                self.address1lbl.text = self.currentAddress
//                self.address2lbl.text = self.currentAddress
//            }
//        }
        self.locationManager.stopUpdatingLocation()
        guard let locValue: CLLocationCoordinate2D = manager.location?.coordinate else { return }
        currentlat = locValue.latitude
        currentLng = locValue.longitude
        let pickupMarker = GMSMarker()
        pickupMarker.position = CLLocationCoordinate2D(latitude:currentlat, longitude:currentLng)
        pickupMarker.map = mapView
        self.cameraPosition = GMSCameraPosition.camera(withLatitude: locValue.latitude, longitude: locValue.longitude, zoom: 16)
        self.mapView.camera = self.cameraPosition
        print("locations = \(locValue.latitude) \(locValue.longitude)")
    }
}
extension UIViewController{
    func getAddressString(latitude lat: Double, longtitude long: Double,adrStr : [String],selectedAddress : ((String)->())?){
        let loc: CLLocation = CLLocation(latitude:lat, longitude: long)
        let ceo: CLGeocoder = CLGeocoder()
        var fullAddress = ""
        DispatchQueue.main.async {
            ceo.reverseGeocodeLocation(loc,preferredLocale: .autoupdatingCurrent, completionHandler:{ (placemarks, error) in
                if (error != nil){
                    print("reverse geodcode fail: \(error!.localizedDescription)")
                    return
                }
                let pm = placemarks! as [CLPlacemark]
                print("pm count : \(pm.count)")
                print("placemarks  : \(String(describing: placemarks))")
                if pm.count > 0 {
                    let pm = placemarks![0]
                    let postalAddress = pm.postalAddress
                    fullAddress =  "\(postalAddress?.street ?? ""),\(postalAddress?.subLocality ?? ""),\(postalAddress?.city ?? ""),\(postalAddress?.state ?? ""),\(postalAddress?.postalCode ?? ""),\(postalAddress?.country ?? "")"
                     print("fullAddress : \(fullAddress)")
                    selectedAddress?(fullAddress)
                }
            })
        }
    }
}
