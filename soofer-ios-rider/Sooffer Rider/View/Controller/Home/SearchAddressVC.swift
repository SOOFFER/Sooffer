//
//  SearchAddressVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 04/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import GoogleMaps
import CoreData

struct SearchItem {
    let keyword: String
    let timestamp: Date
    
    func toDictionary() -> [String: Any] {
           return [
               "keyword": keyword,
               "timestamp": timestamp
           ]
       }
}

enum TappedPlace : String {
    case none = "none"
    case pickup = "pickup"
    case drop = "drop"
}

protocol searchMultipleStop {
    func getArrayAddress(address : [String] , location : [CLLocation], ismulti : String)
}

protocol RideLaterOrNow {
    func getLaterOrNow(IsLaterOrNow : String)
}


class SearchAddressVC: UIViewController,UITextFieldDelegate,searchMultipleStop {
    func getArrayAddress(address: [String], location: [CLLocation], ismulti: String) {
        print("location:: \(address), and location:: \(location), \n and multilocation : \(ismulti)")
        self.tripRouteDelegate?.getArrayAddress(address: address, location: location,serviceDetail: self.serviceDetail ?? VechileListData()/*, ismulti : String*/)
        self.navigationController?.popViewController(animated: true)
    }
    
//   func getArrayAddress(address: [String], location: [CLLocation], ismulti: String) {
//        print("location:: \(address), and location:: \(location), \n and multilocation : \(ismulti)")
//       self.muldelegate?.getArrayAddress(address: address, location: location,/*serviceDetail: self.serviceDetail ?? VechileListData(),*/ ismulti : String)
//        self.navigationController?.popViewController(animated: true)
//    }
    
    
    func getArrayAddress(address: [String], location: [CLLocation]) {
        self.tripRouteDelegate?.getArrayAddress(address: address, location: location,serviceDetail: self.serviceDetail ?? VechileListData())
           self.navigationController?.popViewController(animated: true)
       }
    
    //Api Reponse
    var searchAddress : AutoAddressModel?{
        didSet{
            self.addressTabelView.reloadData()
        }
    }
    
    //UI Declaractions
    
    @IBOutlet weak var backArrowIMG: ImageLoader!
    @IBOutlet weak var pickupCliseImg: ImageLoader!
    @IBOutlet weak var dropCloseImg: ImageLoader!
    
    @IBOutlet weak var pickupTXF: UITextField!
    @IBOutlet weak var searchTXF: UITextField!
    @IBOutlet var dummyview: UIView!
    @IBOutlet weak var pickupView: UIView!
    @IBOutlet weak var dropView: UIView!
    @IBOutlet weak var addView: UIView!
    
    @IBOutlet weak var setupPinLBL: UILabel!
    
    @IBOutlet weak var Button: UIButton!
    @IBOutlet weak var addressTabelView: UITableView!
    
    var pageFrom : String?
    var delegate: Delegate!
    var isSelected = false
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var currentAddress : String = ""
    var identifier : String = ""
    var currentLocation : CLLocation = CLLocation()
    
    var googleApi = GoogleVM()
    var favAddrvm = CommonVM()
    var redirectHome : RedirectHome = .recentAddress
    var serviceDetail: VechileListData?
    var tappedPlace : String = TappedPlace.pickup.rawValue
    
    var tripRouteDelegate : TripRoutes?
    var muldelegate : searchMultipleStop?
    var LaterOrNowdelegate : RideLaterOrNow?

    var pickupaddr : String = ""
    var pickupCity : String = ""
    var pickupLoc : CLLocation = CLLocation()
    var dropAddr : String = ""
    var dropCity : String = ""
    var Sdate : String = ""
    var Stime : String = ""
    var RideNowOrLater : String = ""
    var outstationtripType : String = ""
    var dropLoc : CLLocation = CLLocation()
    var buttonClicked : Bool = false
    var favAddressList : FavAddrModel? {
        didSet{
            if self.favAddressList != nil {
                self.addressTabelView.reloadData()
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        }
        self.favAddrvm = CommonVM(view: self.view, dataService: ApiRoot())
        self.identifier = UUID().description
             print("identifier",identifier)
        self.setupAction()
        self.setupView()
        self.setupLang()
        self.setupDelegate()
        self.setupApiIntialization()
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.buttonClicked = false
        self.navigationController?.isNavigationBarHidden = true
        self.setupData()
        self.getAddress()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
    }
    
    func setupView(){
        
        if pageFrom == "home"{
            self.pickupView.isHidden = true
            self.addView.isHidden = true
            self.dummyview.isHidden = false
            self.searchTXF.placeholder = Localize.stringForKey(key: "search")
        }else{
            self.pickupView.isHidden = false
            self.dummyview.isHidden = true
            self.searchTXF.placeholder = Localize.stringForKey(key: "search")
//            self.addView.isHidden = false
            
        }
        
//     self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//        self.revealViewController().rearViewRevealWidth = 300
        
        // set border for from label
        self.dropView.roundeCornorBorder = 5
        self.pickupView.roundeCornorBorder = 5
        
        self.pickupCliseImg.tintColor = UIColor(named: "AppColor")
        self.dropCloseImg.tintColor = UIColor(named: "AppColor")
        self.backArrowIMG.tintColor = UIColor.white
        
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
        print("Ride now or later::\(self.RideNowOrLater)")
        
    }
    
    func setupAction(){
        self.backArrowIMG.addAction(for: .tap) {
            self.navigationController?.isNavigationBarHidden = false
            self.view.endEditing(true)
            self.navigationController?.popViewController(animated: true)
        }
        self.pickupCliseImg.addAction(for: .tap) {
            self.pickupTXF.text = ""
            self.currentAddress = ""
            self.tappedPlace = TappedPlace.pickup.rawValue
        }
        self.dropCloseImg.addAction(for: .tap) {
            self.searchTXF.text = ""
            self.tappedPlace = TappedPlace.drop.rawValue
        }
        
        self.addView.addAction(for: .tap) {
            if !self.buttonClicked{
                self.buttonClicked = true
                convertAddressTOLatLang(address: self.pickupTXF.text ?? "", latlang: {(location) in
                    self.pickupLoc = location
                    let vc = MultipleStopVC.initWithStory()
                    vc.soureceAddress = self.pickupTXF.text
                    vc.sourceLocation = self.pickupLoc
                    vc.muldelegate = self
                    vc.serviceDetail = self.serviceDetail
                    self.navigationController?.pushViewController(vc, animated: true)
                })
            }
        }
    }
    
    func setupLang(){
        self.pickupTXF.placeholder = Localize.stringForKey(key: "pickupaddr")
        self.searchTXF.placeholder = Localize.stringForKey(key: "search")
        self.setupPinLBL.text = Localize.stringForKey(key: "septupin")
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
        textField.resignFirstResponder()
        return false
    }
    
    class func initWithStoryboard()->SearchAddressVC{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "SearchAddressVC") as! SearchAddressVC
        return vc
    }
}

extension SearchAddressVC :UITableViewDelegate , UITableViewDataSource{
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 3
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        if section == 1{
            if let count = self.favAddressList?.FavAddrList.count{
                if count > 0{
                    return count
                }
            }
        }else if section == 0{
            if let count = self.searchAddress?.addressList.count{
                if count > 0 {
                    return count
                }
            }
        }else if section == 2{
            if UserDefaults.standard.string(forKey: "recentSecondKey") != nil {
                return 1
            }
        }
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FavAddressCell", for: indexPath) as! FavAddressCell
        if indexPath.section == 1{
            self.setupFavTableviewData(cell: cell, index: indexPath.row, address: self.favAddressList ?? FavAddrModel())
        }else if indexPath.section == 0{
            
   
            self.setupTableviewData(cell: cell, index: indexPath.row, address: self.searchAddress!)
            
        }else if indexPath.section == 2{
            self.setupRecentTableviewData(cell: cell, index: indexPath.row)
        }
        cell.deleteImage.isHidden = true
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 70
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        switch self.tappedPlace {
        case TappedPlace.pickup.rawValue:
            if indexPath.section == 1{
                self.pickupTXF.text = self.favAddressList?.FavAddrList[indexPath.row].address
            }else  if indexPath.section == 0{
                self.pickupTXF.text = self.searchAddress?.addressList[indexPath.row].description ?? ""
            }
            self.tappedPlace = TappedPlace.drop.rawValue
            if isSelected {
                convertAddressTOLatLang(address: self.pickupTXF.text!, latlang: {(location) in
                    self.delegate.address(address: self.searchTXF.text!, lat: location.coordinate.latitude.description, lng: location.coordinate.longitude.description)
                    self.navigationController?.popViewController(animated: true)
                })
            } else {
                if pageFrom == "home"{
                    self.navigateWithFromAddr()
                }else{
                    self.navigatetoHomeWithAddress()
                }
            }
            break
        case TappedPlace.drop.rawValue:
            if indexPath.section == 1{
                self.searchTXF?.text = self.favAddressList?.FavAddrList[indexPath.row].address
            }else if indexPath.section == 0{
                self.searchTXF.text = self.searchAddress?.addressList[indexPath.row].description ?? ""
                print("tap search add::\(self.searchAddress?.addressList[indexPath.row].description ?? "")")
                print("tap titile search add::\(self.searchAddress?.addressList[indexPath.row].structuredformatting?.main_text ?? "")")
                var saveSearch = self.searchAddress?.addressList[indexPath.row].description ?? ""
                var saveSecondKey = self.searchAddress?.addressList[indexPath.row].structuredformatting?.secondary_text ?? ""
                var saveMainKey = self.searchAddress?.addressList[indexPath.row].structuredformatting?.main_text ?? ""
                UserDefaults.standard.set(saveSearch, forKey: "recentSearchesKey")
                UserDefaults.standard.set(saveSecondKey, forKey: "recentSecondKey")
                UserDefaults.standard.set(saveMainKey, forKey: "recentMainKey")
            }else if indexPath.section == 2{
                var Raddress = UserDefaults.standard.string(forKey: "recentSearchesKey")
                self.searchTXF.text = Raddress
            }
            if isSelected {
                print("hsdfghdsfhgsdf\(self.searchTXF.text)")
                convertAddressTOLatLang(address: self.searchTXF.text!, latlang: {(location) in
                    print("LOCATIONNN::\(location.coordinate.latitude):::LNG\(location.coordinate.longitude)")
                    self.delegate.address(address: self.searchTXF.text!, lat: location.coordinate.latitude.description, lng: location.coordinate.longitude.description)
                    self.navigationController?.popViewController(animated: true)
                })
            } else {
                if pageFrom == "home"{
                    self.navigateWithFromAddr()
                }else{
                    self.navigatetoHomeWithAddress()
                }
            }
            break
        default:
            self.pickupTXF.text = self.searchAddress?.addressList[indexPath.row].description ?? ""
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
    
    func setupTableviewData(cell : FavAddressCell , index : Int, address : AutoAddressModel){
       
        
        if let getAddress : AutoAddress = address.addressList[index] as? AutoAddress
        {
            cell.addressLbl.text = getAddress.structuredformatting?.secondary_text ?? "YYYY"
            if let title = getAddress.structuredformatting?.main_text {
                cell.addrTitleLbl.text = getAddress.structuredformatting?.main_text ?? ""
            }else{
                let address : String = getAddress.description ?? "" as String
                var addressArray = address.components(separatedBy: ",")
                cell.addrTitleLbl.text = addressArray[0] as? String ?? ""
            }
            cell.locationImage.image = UIImage(named: "marker_location")
        }
    }
    
    func setupFavTableviewData(cell : FavAddressCell , index : Int, address : FavAddrModel){
        if let getAddress : FavAddrData = address.FavAddrList[index] as? FavAddrData
        {
            cell.addressLbl.text = getAddress.address
            cell.addrTitleLbl.text = getAddress.lable
            cell.locationImage.image = UIImage(named: "favicon")
        }
    }
    
    func setupRecentTableviewData(cell : FavAddressCell , index : Int){
        if let getAddress = UserDefaults.standard.string(forKey: "recentSecondKey")        {
            cell.addressLbl.text = getAddress
            cell.locationImage.image = UIImage(named: "recentsearch")
        }
        
        if let getTitleAddress = UserDefaults.standard.string(forKey: "recentMainKey")        {
            cell.addrTitleLbl.text = getTitleAddress
            
        }
        
        
    }
    func navigateWithFromAddr(){
        if !(self.pickupTXF.text?.isEmpty ?? false)
        {
            self.pickupaddr = self.pickupTXF.text ?? ""
            
            convertAddressTOLatLang(address: self.pickupaddr, latlang: {(location) in
                self.pickupLoc = location
                self.view.endEditing(true)
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    self.tripRouteDelegate?.getFromLocation(tag: "from", addr: self.pickupaddr, addrLoc: self.pickupLoc)
                    self.LaterOrNowdelegate?.getLaterOrNow(IsLaterOrNow: self.RideNowOrLater)
                    self.navigationController?.popViewController(animated: true)
                }
            })
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
                    self.view.endEditing(true)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { [unowned self] in
                        if self.outstationtripType == "outstation"{
                            self.tripRouteDelegate?.getPickupDropOutstation(pickAddr: self.pickupaddr, pickupLoc: self.pickupLoc, dropAddr: self.dropAddr, dropLoc: self.dropLoc, outstaion: "outstation")
                        }else{
                            
                            let homeVc = HomeVC.initWithStory()
    //                        homeVc.isSelected = true
                            homeVc.isSelected = true
//                            if redirectHome == .driver {
//                                UserDefaults.standard.set(true, forKey: UserDefaultsKey.driver)
//                            } else {
//                                UserDefaults.standard.set(false, forKey: UserDefaultsKey.driver)
//                            }
                            print("Pick::::::,\(self.pickupaddr),:::\(self.dropAddr)/::::sd\(pickupLoc)")
                            print("Ride later or not::\(RideNowOrLater)")
                            homeVc.pickupaddr = self.pickupaddr
                            homeVc.pickupLoc  = self.pickupLoc
                            homeVc.pickupLoc1 = self.pickupLoc
                            homeVc.dropLoc = self.dropLoc
                            homeVc.dropAddr = self.dropAddr
                            homeVc.isSchudleRide = self.RideNowOrLater
                            homeVc.schudleDateStr = self.Sdate
                            homeVc.schudleTimestr = self.Stime
                            self.navigationController?.pushViewController(homeVc, animated: true)
                            
//                             self.tripRouteDelegate?.getPickupDropLocation(pickAddr: self.pickupaddr, pickupLoc: self.pickupLoc, dropAddr: self.dropAddr, dropLoc: self.dropLoc,serviceDetail: self.serviceDetail ?? VechileListData())
                        }
//                        self.navigationController?.popViewController(animated: true)
//                        let homeVc = HomeVC.initWithStory()
////                        homeVc.isSelected = true
//                        self.navigationController?.pushViewController(homeVc, animated: true)
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
        self.googleApi.nearByLocation(input: address, currectLoc:
                                        self.currentLocation, sessiontoken: self.identifier)
        self.googleApi.showAddressClosure = {
            self.searchAddress = self.googleApi.getAddressList
        }
        
        self.googleApi.errorAddressClosure = {
            self.searchAddress = self.googleApi.getAddressError
        }
    }
    
    func getAddress(){
        self.favAddrvm.getFavAddrList(view: self.view)
        
        self.favAddrvm.successFavAddr = {
            self.favAddressList = self.favAddrvm.favAddrList
        }
    }
    
 
  
}

 

