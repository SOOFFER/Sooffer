//
//  PinAddressVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 23/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
//PinAddressVC
import GoogleMaps
import GooglePlaces

protocol PinRoutes {
     func getPinLocation(tag : String , addr : String , addrLoc : CLLocation)
}

class PinAddressVC: UIViewController,GMSMapViewDelegate,PinRoutes {
    
    func getPinLocation(tag: String, addr: String, addrLoc: CLLocation) {
        self.tag = tag
        self.currentLocation = addrLoc
        self.currentAddress = addr
        self.setupData()
    }
    
    
    @IBOutlet weak var closeImg: UIImageView!
    @IBOutlet weak var submitbtn: UIButton!
    @IBOutlet weak var mapview: GMSMapView!
    @IBOutlet weak var backbtn: ImageLoader!
    @IBOutlet weak var addressLabel: UILabel!
    
    
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var marker = GMSMarker()
    
    var seletedaddress : String = String()
    var lat : CLLocationDegrees = 0.0
    var lang : CLLocationDegrees = 0.0
    var locationManager = CLLocationManager()
    var currentLocation: CLLocation = CLLocation()
    var location : CLLocation = CLLocation()
     var currentAddress : String = ""
    var focusZoom : Float = 14.0
    var tag : String = ""
    var tripPinRoute : TripRoutes?
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupview()
        self.setupMap()
        self.setupAction()
        self.setupLang()
        self.setupData()
    }
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
    }
    
    class func initWithStory()->PinAddressVC{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "PinAddressVC") as! PinAddressVC
        return vc
    }
    
    func setupAction(){
        self.closeImg.addAction(for: .tap) {
            self.addressLabel.text = ""
        }
        
        self.backbtn.addAction(for: .tap) {
            self.navigationController?.popViewController(animated: true)
        }
        
        self.submitbtn.addAction(for: .tap) {
            self.tripPinRoute?.getPinLocation(tag: self.tag, addr: self.seletedaddress, addrLoc: self.location)
            self.navigationController?.popViewController(animated: true)
        }
        
        self.addressLabel.addAction(for: .tap) {
            let vc = AutoCompleteVC.initWithStory()
            vc.pinAddressdele = self
            vc.fromPage = "pinaddress"
            vc.tag = self.tag
            self.present(vc, animated: true, completion: nil)
        }
    }
    
    func setupLang(){
        self.submitbtn.setTitle(Localize.stringForKey(key: "submit"), for: .normal)
    }
    
    func setupview(){
        self.submitbtn.layer.cornerRadius = 10
        self.submitbtn.layer.masksToBounds = true
    }
    
    func setupMap(){
        self.mapview.delegate = self
        self.mapview.isMyLocationEnabled = true
        self.mapview.settings.myLocationButton = true
        self.mapview.settings.compassButton = true
        self.mapview.padding = UIEdgeInsets(top: 0, left: 0, bottom: 40, right: 0)
        
        
        locationManager = CLLocationManager()
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        locationManager.distanceFilter = 50
        locationManager.startUpdatingLocation()
        locationManager.delegate = self
    }
    
    func setupData(){
        self.addressLabel.text = self.currentAddress
        // focus to current  location
        self.mapview.camera = GMSCameraPosition(target: self.currentLocation.coordinate, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
        
        // getting current Address
        convertLatLangTOAddress(coordinates: self.currentLocation, address: { (address) -> Void in
            self.currentAddress = address
            print("*****Getting_Address" , self.currentAddress)
        })
    }
   
}

extension PinAddressVC : CLLocationManagerDelegate{
    
    
    
    // MARK: update Location
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        
        if self.tag.isEmpty{
            self.currentLocation = locations.last ?? CLLocation()
            // focus to current  location
            self.mapview.camera = GMSCameraPosition(target: self.currentLocation.coordinate, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
            // getting current Address
            convertLatLangTOAddress(coordinates: self.currentLocation, address: { (address) -> Void in
                self.currentAddress = address
                print("*****Getting_Address" , self.currentAddress)
            })
        }
        
        self.locationManager.stopUpdatingLocation()
     
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
        case .restricted:
            print("Location access was restricted.")
        case .denied:
            print("User denied access to location.")
        case .notDetermined:
            print("Location status not determined.")
        case .authorizedAlways: fallthrough
        case .authorizedWhenInUse:
            print("Location status is OK.")
        }
    }
    
    
    func mapView(_ mapView: GMSMapView, idleAt position: GMSCameraPosition) {
     
        self.location = CLLocation(latitude: position.target.latitude, longitude: position.target.longitude)
        
        // getting current Address
        convertLatLangTOAddress(coordinates: self.location, address: { (address) -> Void in
            self.seletedaddress = address
            self.addressLabel.text = address
           
        })
    }    
}

