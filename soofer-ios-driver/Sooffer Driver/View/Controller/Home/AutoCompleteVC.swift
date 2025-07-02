//
//  AutoCompleteVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 24/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import GoogleMaps
import GooglePlaces


class AutoCompleteVC: UIViewController,GMSMapViewDelegate {

    @IBOutlet weak var searchBar: UISearchBar!
    @IBOutlet weak var addressTabel: UITableView!
    
    //initilaze Variable
    let Localize : Localizations = Localizations.instance
    var googlevm = GoogleVM()
    var locationManager = CLLocationManager()
    var currentLocation: CLLocation = CLLocation()
    var currentAddress : String = ""
    var countryCode : String = "in"
    var pinAddressdele : PinRoutes?
    var tag : String = ""
    var fromPage : String = ""
    var addressList : AutoAddressModel?{
        didSet{
            self.addressTabel.reloadData()
        }
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.googlevm = GoogleVM(view: self.view, dataService: ApiRoot())
        if let countryCode = (Locale.current as NSLocale).object(forKey: .countryCode) as? String {
           self.countryCode = "country:\(countryCode.lowercased())"
        }
        self.setupview()
        self.setupAction()
        self.setupLang()
        self.setupData()
        self.setupDelegate()
    }
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
    }
    
    
    class func initWithStory()->AutoCompleteVC{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "AutoCompleteVC") as! AutoCompleteVC
        return vc
    }
    
    func setupAction(){
        
    }
    
    func setupLang(){
    }
    
    func setupview(){
        searchBar.showsCancelButton = true
        
        locationManager = CLLocationManager()
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        locationManager.distanceFilter = 50
        locationManager.startUpdatingLocation()
        locationManager.delegate = self
        
    }
    
    
    func setupData(){
        
    }
    
    func setupDelegate() {
        self.searchBar.delegate = self
        self.addressTabel.delegate = self
        self.addressTabel.dataSource = self
        self.addressTabel.register(UINib(nibName: "FavAddressCell", bundle: nil), forCellReuseIdentifier: "FavAddressCell")
        self.addressTabel.reloadData()
    }
   
}

extension AutoCompleteVC : CLLocationManagerDelegate{
   
    // MARK: update Location
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        self.currentLocation = locations.last ?? CLLocation()
        
        // getting current Address
        convertLatLangTOAddress(coordinates: self.currentLocation, address: { (address) -> Void in
            self.currentAddress = address
            print("*****Getting_Address" , self.currentAddress)
        })
        
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
}

extension AutoCompleteVC : UITableViewDataSource,UITableViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count = self.addressList?.addressList.count{
            if count > 0 {
                ShowMsginWindow.instanse.hideNodataView()
                return count
            }else{
                ShowMsginWindow.instanse.nodataView(view: self.view)
            }
        }
        ShowMsginWindow.instanse.nodataView(view: self.view)
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FavAddressCell", for: indexPath) as! FavAddressCell
        cell.deleteImage.isHidden = true
        if let address  =  self.addressList?.addressList[indexPath.row]{
            cell.addrTitleLbl.text = address.structuredformatting?.main_text
            cell.addressLbl.text = address.description
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 70
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if let address  =  self.addressList?.addressList[indexPath.row]{
            // getting current LatLang
            convertAddressTOLatLang(address: address.description ?? "") { (location) in
                if self.fromPage == "pinaddress"{
                    self.pinAddressdele?.getPinLocation(tag: self.tag, addr: address.description ?? "", addrLoc: location)
                }else{
                  
                }
                
                self.dismiss(animated: true, completion: nil)
            }
        }
    }
    
}
// search bar
extension AutoCompleteVC : UISearchBarDelegate,UIPopoverPresentationControllerDelegate{
    //MARK: SearchTextDelegate
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
       self.getAddress(inputText: searchText)
    }
    
    func searchBarShouldBeginEditing(_ searchBar: UISearchBar) -> Bool {
        searchBar.showsCancelButton = true
       
        return true
    }
    
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        self.view.endEditing(true)
    }
    
    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        if searchBar.text == ""{
            self.dismiss(animated: true, completion: nil)
        }else{
            searchBar.text = ""
        }
        self.view.endEditing(true)
    }
}

// Api call
extension AutoCompleteVC {
    func getAddress(inputText : String){
        self.googlevm.getautoCompleteText(view: self.view, input: inputText, components: self.countryCode, location: "\(self.currentLocation.coordinate.latitude),\(self.currentLocation.coordinate.longitude)")
        
        self.googlevm.autoCompleteClosure = {
            self.addressList = self.googlevm.getAutoAddress
        }
    }
}
