//
//  SearchAddressVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 04/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import GoogleMaps

enum TappedPlace : String {
    case none = "none"
    case pickup = "pickup"
    case drop = "drop"
}

class SearchAddressVC: UIViewController,UITextFieldDelegate {
    
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
    
    @IBOutlet weak var pickupView: UIView!
    @IBOutlet weak var dropView: UIView!
    
    @IBOutlet weak var setupPinLBL: UILabel!
    
    @IBOutlet weak var addressTabelView: UITableView!
    
    var pageFrom : String?
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var currentAddress : String = ""
    var currentLocation : CLLocation = CLLocation()
    
    var googleApi = GoogleVM()
    var favAddrvm = CommonVM()
    
    var serviceDetail: VechileListData?
    var tappedPlace : String = TappedPlace.pickup.rawValue
    
    var tripRouteDelegate : TripRoutes?
    
    var pickupaddr : String = ""
    var pickupCity : String = ""
    var pickupLoc : CLLocation = CLLocation()
    var dropAddr : String = ""
    var dropCity : String = ""
    var identifier : String = ""
    var outstationtripType : String = ""
    var dropLoc : CLLocation = CLLocation()
    var favAddressList : FavAddrModel?{
        didSet{
            if let favaddr = self.favAddressList{
                self.addressTabelView.reloadData()
                
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
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
            self.dropView.isHidden = true
        }else{
            self.dropView.isHidden = false
        }
        
        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
        self.revealViewController().rearViewRevealWidth = 220
        
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
    }
    
    func setupLang(){
        self.pickupTXF.placeholder = Localize.stringForKey(key: "pickupaddr")
        self.searchTXF.placeholder = "Drop Address"
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
    
//    class func initWithStory()->SearchAddressVC{
//        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "SearchAddressVCs") as! SearchAddressVC
//        return vc
//    }
}

extension SearchAddressVC :UITableViewDelegate , UITableViewDataSource{
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return 2
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
        }
        
        
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FavAddressCell", for: indexPath) as! FavAddressCell
        if indexPath.section == 1{
            self.setupFavTableviewData(cell: cell, index: indexPath.row, address: self.favAddressList ?? FavAddrModel())
        }else if indexPath.section == 0{
            self.setupTableviewData(cell: cell, index: indexPath.row, address: self.searchAddress!)
            
        }
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
            if indexPath.section == 1{
                self.pickupTXF.text = self.favAddressList?.FavAddrList[indexPath.row].address
            }else  if indexPath.section == 0{
                self.pickupTXF.text = self.searchAddress?.addressList[indexPath.row].description ?? ""
            }
            self.tappedPlace = TappedPlace.drop.rawValue
           if pageFrom == "home"{
            self.navigateWithFromAddr()
           }else{
            self.navigatetoHomeWithAddress()
            }
            break
        case TappedPlace.drop.rawValue:
            if indexPath.section == 1{
                self.searchTXF?.text = self.favAddressList?.FavAddrList[indexPath.row].address
            }else if indexPath.section == 0{
                self.searchTXF.text = self.searchAddress?.addressList[indexPath.row].description ?? ""
            }
            if pageFrom == "home"{
                self.navigateWithFromAddr()
            }else{
                self.navigatetoHomeWithAddress()
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
        if let getAddress : AutoAddress = address.addressList[index]
        {
            cell.addressLbl.text = getAddress.structuredformatting?.secondary_text ?? "YYYY"
            if let title = getAddress.structuredformatting?.main_text {
                cell.addrTitleLbl.text = getAddress.structuredformatting?.main_text ?? ""
            }else{
                let address : String = getAddress.description ?? "" as String
                var addressArray = address.components(separatedBy: ",")
                cell.addrTitleLbl.text = addressArray[0] as? String ?? ""
            }
        }
    }
    
    func setupFavTableviewData(cell : FavAddressCell , index : Int, address : FavAddrModel){
        if let getAddress : FavAddrData = address.FavAddrList[index]
        {
            cell.addressLbl.text = getAddress.address
            cell.addrTitleLbl.text = getAddress.lable
            
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
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        if self.outstationtripType == "outstation"{
                            self.tripRouteDelegate?.getPickupDropOutstation(pickAddr: self.pickupaddr, pickupLoc: self.pickupLoc, dropAddr: self.dropAddr, dropLoc: self.dropLoc, outstaion: "outstation")
                        }else{
                             self.tripRouteDelegate?.getPickupDropLocation(pickAddr: self.pickupaddr, pickupLoc: self.pickupLoc, dropAddr: self.dropAddr, dropLoc: self.dropLoc,serviceDetail: self.serviceDetail ?? VechileListData())
                        }
                       
                        self.navigationController?.popViewController(animated: true)
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
        self.googleApi.nearByLocation(input: address, currectLoc: self.currentLocation, sessiontoken: self.identifier)
        
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
