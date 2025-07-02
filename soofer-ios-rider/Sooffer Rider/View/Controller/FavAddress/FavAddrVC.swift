//
//  FavAddrVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 23/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import GoogleMaps

protocol FavProtocol {
    func selectedAddres(address : String,location : CLLocation)
}

class FavAddrVC: UIViewController,FavProtocol {
    
    func selectedAddres(address: String, location: CLLocation) {
        self.fullView.isHidden = false
        self.favView.roundeCornorBorder = 3
        self.newAddress = address
        self.newLocation = location
        self.offcImg.image = UIImage(named: "ic_tick_green")
        self.addressTitleTXF.text = "Office"
        self.addressLbl.text = address
    }
    
    
    @IBOutlet weak var fullView: UIView!
    @IBOutlet weak var favAddressTable: UITableView!
    
    @IBOutlet weak var favView: UIView!
   
    @IBOutlet weak var offcBtn: UIButton!
     @IBOutlet weak var homeBtn: UIButton!
     @IBOutlet weak var otherBtn: UIButton!
   
    @IBOutlet weak var addressLbl: UILabel!
  
    @IBOutlet weak var addressTitleTXF: UITextField!
   
    @IBOutlet weak var cancelBtn: UIButton!
    @IBOutlet weak var saveBtn: UIButton!
    
    @IBOutlet weak var offcImg: UIImageView!
    @IBOutlet weak var homeImg: UIImageView!
    @IBOutlet weak var otherImg: UIImageView!
    
    
    @IBOutlet weak var titlelbl : UILabel!
    @IBOutlet weak var backimg : UIImageView!
    
    @IBOutlet weak var Addads : UIButton!
    
    //initilaze Variable
    let Localize : Localizations = Localizations.instance
    var favAddrvm = CommonVM()
    var newAddress : String = String()
    var newLocation : CLLocation = CLLocation()
    var favAddressList : FavAddrModel?{
        didSet{
            if let favaddr = self.favAddressList{
                self.favAddressTable.reloadData()
                  self.fullView.isHidden = true
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
        self.setupview()
        self.setupAction()
        self.setupLang()
        self.setupData()
        self.setupDelegate()
        self.getAddress()
    }
    @IBAction func addFavAddress(_ sender: Any) {
        let vc = AutoCompleteVC.initWithStory()
               vc.favdelegate = self
               self.present(vc, animated: true, completion: nil)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
      
    }
    
    
    class func initWithStory()->FavAddrVC{
        let vc = UIStoryboard.init(name: "FavAddre", bundle: Bundle.main).instantiateViewController(withIdentifier: "FavAddrVC") as! FavAddrVC
        return vc
    }
    
    func setupAction(){
       
        self.Addads.setTitle("", for: .normal)
       
        self.backimg.addTap {
            self.sideMenuController?.revealMenu()
        }
        self.saveBtn.addAction(for: .tap) {
            if !self.newAddress.isEmpty{
                let titlestr : String = self.addressTitleTXF.text ?? ""
                if titlestr.isEmpty{
                    showToast(msg: "Enter the Address Title")
                }else{
                    self.addAddress(name: titlestr , address: self.newAddress, lat: self.newLocation.coordinate.latitude.description, lng: self.newLocation.coordinate.longitude.description)
                }
            }else{
                showToast(msg: "Select or Enter Address Type")
            }
        }
        self.cancelBtn.addAction(for: .tap) {
            self.newLocation = CLLocation()
            self.newAddress = ""
            self.fullView.isHidden = true
        }
        self.homeBtn.addAction(for: .tap) {
            if  self.homeImg.image == UIImage(named: "ic_tick_green"){
                 self.homeImg.image = UIImage(named: "ic_tick_grey")
            }else{
                self.homeImg.image = UIImage(named: "ic_tick_green")
            }
            self.offcImg.image  = UIImage(named: "ic_tick_grey")
            self.otherImg.image  = UIImage(named: "ic_tick_grey")
            self.addressTitleTXF.text = "Home"
        }
        self.offcBtn.addAction(for: .tap) {
            if  self.offcImg.image == UIImage(named: "ic_tick_green"){
                self.offcImg.image = UIImage(named: "ic_tick_grey")
            }else{
                self.offcImg.image = UIImage(named: "ic_tick_green")
            }
            self.homeImg.image = UIImage(named: "ic_tick_grey")
            self.otherImg.image  = UIImage(named: "ic_tick_grey")
            self.addressTitleTXF.text = "Office"
        }
        self.otherBtn.addAction(for: .tap) {
            if  self.otherImg.image == UIImage(named: "ic_tick_green"){
                self.otherImg.image = UIImage(named: "ic_tick_grey")
            }else{
                self.otherImg.image = UIImage(named: "ic_tick_green")
            }
            self.homeImg.image = UIImage(named: "ic_tick_grey")
            self.offcImg.image  = UIImage(named: "ic_tick_grey")
            self.addressTitleTXF.text = ""
        }
    }
    
    func setupLang(){
    }
    
    func setupview(){
        self.titlelbl.text = Localize.stringForKey(key: "Fav")
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "Fav"))
        
        //EditButton View
        var rightBarButton = UIBarButtonItem()
        
        let rightButton = UIButton(frame: CGRect(x: 0, y: 0, width: 10, height: 10))
        rightButton.setTitle(Localize.stringForKey(key: "add"), for: .normal)
        rightButton.setTitleColor(UIColor(named: "AppColor"), for: .normal)
        rightBarButton = UIBarButtonItem(customView: rightButton)
        rightButton.addTarget(self, action: #selector(self.addFavAddress), for: .touchUpInside)
        
        self.navigationItem.rightBarButtonItem = rightBarButton
    }
    
    
    func setupData(){
   
    }
    
    func setupDelegate() {
        self.favAddressTable.delegate = self
        self.favAddressTable.dataSource = self
        self.favAddressTable.register(UINib(nibName: "FavAddressCell", bundle: nil), forCellReuseIdentifier: "FavAddressCell")
        self.favAddressTable.reloadData()
    }
    
//    @objc func addFavAddress(){
//        let vc = AutoCompleteVC.initWithStory()
//        vc.favdelegate = self
//        self.present(vc, animated: true, completion: nil)
//    }
}


extension FavAddrVC : UITableViewDataSource,UITableViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count = self.favAddressList?.FavAddrList.count{
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
            //cell.deleteImage.isHidden = true
            if let addressList = self.favAddressList?.FavAddrList[indexPath.row]{
              cell.addrTitleLbl.text = addressList.lable
              cell.addressLbl.text = addressList.address
                cell.deleteImage.addTap {
                    let alert = UIAlertController(title: self.Localize.stringForKey(key: "delete"), message: self.Localize.stringForKey(key: "alert_delete"), preferredStyle: UIAlertController.Style.alert)
                               alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "cancel"), style: UIAlertAction.Style.default, handler: nil))
                               alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "delete"), style: UIAlertAction.Style.default, handler: { (alert) in
                                   
                                   if let addressList = self.favAddressList?.FavAddrList[indexPath.row]{
                                       self.deleteAddress(id: addressList._id)
                                       self.favAddressList?.FavAddrList.remove(at: indexPath.row)
                                       self.favAddressTable.reloadData()
                                   }
                                   
                               }))
                               self.present(alert, animated: true, completion: nil)
                }
            }
            return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 70
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
//    func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
//        let delete = UITableViewRowAction(style: UITableViewRowAction.Style.destructive, title: "Delete") { (action, indexPath) in
//            if let addressList = self.favAddressList?.FavAddrList[indexPath.row]{
//                self.deleteAddress(id: addressList._id)
//                self.favAddressList?.FavAddrList.remove(at: indexPath.row)
//                self.favAddressTable.reloadData()
//            }
//        }
//        return [delete]
//    }
}

// Api call
extension FavAddrVC {
    func getAddress(){
        self.favAddrvm.getFavAddrList(view: self.view)
        
        self.favAddrvm.successFavAddr = {
            self.favAddressList = self.favAddrvm.favAddrList
        }
    }
    
    func addAddress(name: String, address: String, lat: String, lng: String){
        self.favAddrvm.addFavAddrList(view: self.view, name: name, address: address, lat: lat, lng: lng)
    }
    
    func deleteAddress(id : String){
        self.favAddrvm.deleteFavAddrList(view: self.view, emgContactId: id)
    }
}
