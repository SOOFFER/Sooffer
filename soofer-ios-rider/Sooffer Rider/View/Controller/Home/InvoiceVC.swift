//
//  InvoiceVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 15/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import Cosmos
import SwiftyJSON
import SideMenuSwift

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
    @IBOutlet weak var dropAddress: UILabel!
    @IBOutlet weak var currentAddrssLbl: UILabel!
    @IBOutlet weak var billLbl: UILabel!
    @IBOutlet weak var dateLbl: UILabel!
    @IBOutlet weak var dicountLbl: UILabel!
    @IBOutlet weak var discountPriceLbl: UILabel!
    
    @IBOutlet weak var Tipsfordriver: UITextField!
    
    var outstationBill : BillingModel = BillingModel()
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
   
    var homevm = HomeVM()
    var ratings : String = ""
    var triproute : TripRoutes?
    
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
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupDelegate()
    }
    
    func setupView(){
        self.priceTopView.layer.cornerRadius = 10
        self.priceTopView.isElevation = 3
        self.addressView.layer.cornerRadius = 10
        self.addressView.isElevation = 3
        self.submitBtn.roundeCornorBorder = 20
        self.priceTable.isElevation = 3
        self.addressView.layer.cornerRadius = 10
        self.priceTable.layer.cornerRadius = 10
    }
    
    func setupAction(){
        
        self.startRatingView.didFinishTouchingCosmos = { rating in
            self.ratings = rating.description
        }
        
        self.submitBtn.addAction(for: .tap) {
//            self.dismiss(animated: true, completion: nil)
           
            self.ratings = self.startRatingView.rating.description
            
            var comment : String = self.commentTxt.text ?? ""
            
            var Tips : String = self.Tipsfordriver.text ?? ""
            
//            if (!comment.isEmpty && !self.ratings.isEmpty){
                self.riderFeedback(rating: self.ratings, comment: comment)
//            }else{
//                showToast(msg: "Must give Star Rating and comments for you Driver")
//            }
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
            print("Invoice_Data" , details.invoiceBill)
            let formatter = DateFormatter()
            formatter.dateFormat = "YYYY-MM-dd"
            let date : String = formatter.string(from: Date())
            
            self.dateLbl.text = date
            if details.triptype == "rental" || details.triptype == "outstation"{
                 self.jsonconversion(tripDetails: tripDetails)
            }else{
            self.priceTitleArray = [self.Localize.stringForKey(key: "balance_payment") ,
                                    self.Localize.stringForKey(key: "distance") ,
                                    self.Localize.stringForKey(key: "gateway_fare") ,
                                    self.Localize.stringForKey(key: "booking_fee") ,
                                    self.Localize.stringForKey(key: "time") ,
//                                    self.Localize.stringForKey(key: "base_fare") ,
                                    self.Localize.stringForKey(key: "Waiting_Time") ,
                                    self.Localize.stringForKey(key: "time_fare") ,
                                    self.Localize.stringForKey(key: "base_fare") ,
                                    self.Localize.stringForKey(key: "minimun_fare") ,
                                    self.Localize.stringForKey(key: "waiting_fare") ,
                                    self.Localize.stringForKey(key: "pickup_fee") ,
                                    self.Localize.stringForKey(key: "distance_fare") ,
                                    self.Localize.stringForKey(key: "tax_") ,
                                    self.Localize.stringForKey(key: "surge_amt") ,
                                    self.Localize.stringForKey(key: "cancelleantion_fee") ,
                                    self.Localize.stringForKey(key: "toll_fee") ,
//                                    self.Localize.stringForKey(key: "time_fare") ,
                               //     self.Localize.stringForKey(key: "ride_fare") ,
                                    
                                    
                            //        self.Localize.stringForKey(key: "access_fee") ,
                                    
                                    self.Localize.stringForKey(key: "payment_method")]
            
            
            
            self.priceValueArray = [
                decimalDataString(data : details.oldBalance),
                details.distance + " \(Constant.distanceUnit)",
                decimalDataString(data : details.gatewayCharge) ,
                decimalDataString(data : details.booking) ,
                details.time + " Mins",
//                Constant.priceTag + details.basefare,
                  details.waitingTime + " Mins",
                decimalDataString(data : details.time_fare),
                decimalDataString(data : details.basefare),
                decimalDataString(data : details.minFare),
                  decimalDataString(data : details.waiting_fare),
                  decimalDataString(data : details.convance_fare),
//                  decimalDataString(data : details.time_fare),
                  decimalDataString(data : details.distance_fare),
//                  decimalDataString(data : details.convance_fare),
//                  decimalDataString(data : details.distance_fare) ,
                
                  decimalDataString(data : details.tax),
                  decimalDataString(data : details.surgeAmt),
                  decimalDataString(data : details.cancel_fare),
                  decimalDataString(data : details.tollFee),
//                  decimalDataString(data : details.cancel_fare),
                details.pay_type
            ]
            }
            
//            if details.isWaiting == "0"{
//                self.priceValueArray.remove(at: 4)
//                self.priceTitleArray.remove(at: 4)
//            }
            
            
            
//            if details.trip_type != "flatrate"{
//
//                self.priceValueArray.remove(at: 7)
//                self.priceTitleArray.remove(at: 7)
//
//
//                self.priceValueArray.remove(at: 8)
//                self.priceTitleArray.remove(at: 8)
//
//
//                self.priceValueArray.remove(at: 9)
//                self.priceTitleArray.remove(at: 9)
//            }else{
//                if details.tax == "0"{
//                    self.priceValueArray.remove(at: 9)
//                    self.priceTitleArray.remove(at: 9)
//                }
//                if details.isPickup == "0"{
//                    self.priceValueArray.remove(at: 7)
//                    self.priceTitleArray.remove(at: 7)
//                }
//            }
            
            print("PRICETABLEDATA",self.priceValueArray)
            print("details.pay_type",details.pay_type)
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
        DispatchQueue.main.async {
            self.viewWillLayoutSubviews()
        }
        
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(indexPath.row)
    }
}


extension InvoiceVC{
    func riderFeedback(rating : String , comment : String){
        let tripid : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? ""
        if tripid.isEmpty{
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverid)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverVehcile)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripid)
             UserDefaults.standard.set("false", forKey: UserDefaultsKey.tripwillstart)
            
            DispatchQueue.main.asyncAfter(deadline: .now()+0.5, execute: {
//                let root : UIViewController?
//                root = UINavigationController(rootViewController:  HomeVC.initWithStory())
//                self.appDelegate.window?.rootViewController = root
                let homeVc = HomeVc.initWithStory()
                let nav = UINavigationController(rootViewController: homeVc)
                nav.navigationBar.isHidden = true
                let menuVc = MenuVC.initWithStory()
                self.appDelegate.window?.rootViewController = SideMenuController(contentViewController: nav, menuViewController: menuVc)
            })
        }else{
        self.homevm.riderFeedBack(view: self.view, tripId: tripid, rating: rating, comments: comment)
        self.homevm.getfeedbackClouser = {
            showToast(msg: self.homevm.feedback?.message ?? "")
            self.FBConnect.clearRiderData()
            self.triproute?.clearMapView()
            
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverid)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverVehcile)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripid)
            DispatchQueue.main.asyncAfter(deadline: .now()+0.5, execute: {
//                let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
//                self.appDelegate.window?.rootViewController = MenuRoot
                let homeVc = HomeVc.initWithStory()
                let nav = UINavigationController(rootViewController: homeVc)
                nav.navigationBar.isHidden = true
                let menuVc = MenuVC.initWithStory()
                self.appDelegate.window?.rootViewController = SideMenuController(contentViewController: nav, menuViewController: menuVc)
            })
        }
        }
    }
}

extension InvoiceVC{
    func getFBDriverDetails(){
        self.FBConnect.getTripData { (tripDetails) in
            self.setupDate(tripDetails: tripDetails)
           
            
        }
    }
    
    func 
        jsonconversion(tripDetails : FBTripDataModel){
        print("invoice trip::\(tripDetails)")
        
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
}
