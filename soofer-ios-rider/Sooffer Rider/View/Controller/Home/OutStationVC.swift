//
//  OutStationVC.swift
//  Express Track
//
//  Created by Abservetech on 21/10/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import DateTimePicker

protocol TripRoutesOutstation {
   func popRequestData(pop : String)
}

class OutStationVC: UIViewController , TripRoutesOutstation {
    func popRequestData(pop: String) {
        
        self.navigationController?.popViewController(animated: true)
        
    }
    

    var cabDetails : OutstationVehicleListWithFare?{
        didSet{
            self.cabTable.reloadData()
        }
    }
    
    
    @IBOutlet weak var headerView : UIView!
    @IBOutlet weak var backImh : UIImageView!
    @IBOutlet weak var sourceLbl : UILabel!
    @IBOutlet weak var destngLbl : UILabel!
    @IBOutlet weak var onewayImg : UIImageView!
    @IBOutlet weak var roundtripImg : UIImageView!
    @IBOutlet weak var leaveonLbl : UILabel!
    @IBOutlet weak var returnByDateLbl : UILabel!
    @IBOutlet weak var cabTable : UITableView!
    @IBOutlet weak var confirmBook : UIButton!
    @IBOutlet weak var onetripView : UIView!
    @IBOutlet weak var roundtripView : UIView!
    @IBOutlet weak var VehicleListView : UIView!
    @IBOutlet weak var tripViewsHeight : NSLayoutConstraint!
    
    
    @IBOutlet weak var datepickerview: UIView!
    @IBOutlet weak var doneBtn: UIBarButtonItem!
    @IBOutlet weak var toolbar: UIToolbar!
    @IBOutlet weak var datepicker: UIDatePicker!
    var picker : DateTimePicker = DateTimePicker()
    var leaveDate : Date?
    var returnDate : Date?
    
    @IBAction func datePickerDoneBtn(_ sender: Any) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "dd MMM YYY hh:mm a"
           
        if self.selectedDateFor == "leaveon"{
             leaveonLbl.text = dateFormatter.string(from: datepicker.date)
            self.returnByDateLbl.text = "Select"
            self.returnDate = Date()
        }else{
            returnByDateLbl.text = dateFormatter.string(from: datepicker.date)
        }
        
          self.datepickerview.isHidden = true
          self.getVehicleDetail()
    }
    
    var pickAddr: String?
    var pickupLoc: CLLocation?
    var dropAddr: String?
    var dropLoc: CLLocation?
    var currectLocation: CLLocation?
    var pickupcity : String?
    var TripreqOutsation : TripRoutes?
    var durationInt : Double? = 1.00
    
    var selectedIndex : Int = 0
    var homevm = HomeVM()
    var selectedDateFor : String = ""
    var selectedDate : Date = Date()
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
        
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.homevm = HomeVM(view: self.view, dataService: ApiRoot())
        DispatchQueue.main.asyncAfter(wallDeadline: .now()+0.5) {
            self.getVehicleDetail()
        }
        self.setupDetelegate()
        self.setupAction()
        self.setupView()
        self.setupData()
        self.initialSetup()
    }
    
    class func initWithStory() -> OutStationVC{
        let vc = UIStoryboard(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "OutStationVC") as! OutStationVC
        return vc
    }
    func initialSetup(){

        self.VehicleListView.isHidden = true
        self.onewayImg.image = UIImage(named: "selected")
        self.roundtripImg.image = UIImage(named: "unselect")
        self.roundtripView.isHidden = true
        self.tripViewsHeight.constant = 50
        self.selectedDateFor = "leaveon"
        self.dateSelection(position: "leaveon", datecount: 1)
       
    
    }
    
    func setupData(){
        self.sourceLbl.text = self.pickAddr
        self.destngLbl.text = self.dropAddr
    }
    
    func setupAction(){
        self.onewayImg.addAction(for: .tap) {
            if self.onewayImg.image != UIImage(named: "selected"){
                self.selectedIndex = 0
                self.onewayImg.image = UIImage(named: "selected")
                self.roundtripImg.image = UIImage(named: "unselect")
                self.roundtripView.isHidden = true
                self.tripViewsHeight.constant = 50
              self.dateSelection(position: "leaveon", datecount: 1)
//                self.datepicker.maximumDate = Date()
                self.returnByDateLbl.text = "Select"
                self.selectedDateFor = "leaveon"
                self.cabTable.reloadData()

                self.getVehicleDetail()
            }
        }
        self.roundtripImg.addAction(for: .tap) {
            if self.roundtripImg.image != UIImage(named: "selected"){
                self.selectedIndex = 0
                self.onewayImg.image = UIImage(named: "unselect")
                self.roundtripImg.image = UIImage(named: "selected")
                self.roundtripView.isHidden = false
//                  self.dateSelectionLeaveOn(position: "leaveon", datecount: self.durationInt ?? 0.00)
                self.tripViewsHeight.constant = 100
                  self.selectedDateFor = "returnby"
                self.cabTable.reloadData()
            }
        }
        
        self.leaveonLbl.addAction(for: .tap) {

            self.selectedDateFor = "leaveon"
            
            self.dateSelectionLeaveOn(position: "leaveon", datecount: 1.00)
            self.cabTable.reloadData()
            
         
            
        }
        
        self.returnByDateLbl.addAction(for: .tap) {
            let cal = Calendar.current
            let d1 = Date()
            let d2 = self.leaveDate
            let components = cal.dateComponents([.hour], from: d2 ?? Date(), to: d1)
            let diff = components.hour!
            print("sadasdasda",diff)
            self.selectedDateFor = "returnby"
            self.dateSelectionLeaveOn(position: "returnby", datecount: Double(abs(diff)+1) ?? 0.00)
            self.cabTable.reloadData()
        }
        
        self.backImh.addAction(for: .tap) {
            self.navigationController?.popViewController(animated: true)
        }
        
        self.confirmBook.addAction(for: .tap) {
           if self.onewayImg.image == UIImage(named: "selected"){
                self.alertofSingleRoute()
           }else{
                self.confirmBooking()
        }
        
        
    }
      
        }
    
    
          func alertofSingleRoute(){
            let alert = UIAlertController(title:
                "Info", message:
                "Both up and down amount will be applicable for oneway trip", preferredStyle: UIAlertController.Style.alert)
                alert.addAction(UIAlertAction(title:
                   "cancel", style: UIAlertAction.Style.default, handler: nil))
                       
            alert.addAction(UIAlertAction(title: "ok", style: UIAlertAction.Style.default, handler: { (alert) in
                            self.confirmBooking()
                             
                        }))
                self.present(alert, animated: true, completion: nil)
          }
          
          func confirmBooking(){
              if self.selectedIndex == -1{
                      showToast(msg: "Select one vehicletype for your ride")
                  }else{
                if  self.onewayImg.image != UIImage(named: "selected") && self.returnByDateLbl.text ?? "" == "Select"{
                     showToast(msg: "Select Return Date for Round trip")
                }else{
                  let vc = OutstationDetailVC.initWithStory()
                      vc.TripOutstation = self.TripreqOutsation
                      vc.tripreques = self
                      vc.pickAddr = self.pickAddr
                      vc.pickupLoc = self.pickupLoc
                      vc.dropAddr = self.dropAddr
                      vc.dropLoc = self.dropLoc
                      vc.pickupcity = self.pickupcity
                      vc.currectLocation = self.currectLocation
                      vc.leaveOn = self.leaveonLbl.text ?? ""
                      vc.returnBy = self.returnByDateLbl.text ?? ""
                      
                     if self.onewayImg.image == UIImage(named: "selected"){
                          vc.startDate = self.leaveonLbl.text ?? ""
                          vc.outstationType = "oneway"
                          vc.returndate = ""
                        vc.isReturnTrip = false
                     }else{
                          vc.startDate = self.leaveonLbl.text ?? ""
                          vc.outstationType = "round"
                          vc.returndate = self.returnByDateLbl.text ?? ""
                          vc.isReturnTrip = true
                      }
                if (self.cabDetails?.vehicleListdetail.count ?? 0) > 0{
                      vc.cabDetails = self.cabDetails?.vehicleListdetail[self.selectedIndex]
                }
                
                vc.timeDuration = self.cabDetails?.tripDuration
                  self.navigationController?.pushViewController(vc, animated: true)
                  }
            }
              }
    
    func setupView(){
        self.headerView.isElevation = 2
        self.confirmBook.roundeCornorBorder = 20
    }
    
    
    func dateSelection(position : String , datecount : Int){
            let formatter = DateFormatter()
              formatter.dateFormat = "dd MMM YYY hh:mm a"
             let someDateTime = formatter.string(from:Date().addingTimeInterval(60 * 60 * Double(datecount) * 1))
          self.leaveonLbl.text = someDateTime
        self.returnByDateLbl.text = "Select"
        self.returnDate = Date()
    }
    
    func dateSelectionLeaveOn(position : String , datecount : Double){
        self.datepickerview.isHidden = true
        self.datepicker.isHidden = true
        var min = Date()
        if position == "returnby"{
            min = Date().addingTimeInterval(60 * 60 * Double(datecount) * 1).addingTimeInterval(60*60*8)
        }else{
            min = Date().addingTimeInterval(60 * 60 * Double(datecount) * 1)
        }
        
        let max = Date().addingTimeInterval(60 * 60 * 24 * 30)
        self.picker = DateTimePicker.create(minimumDate: min, maximumDate: max)
        self.picker.selectedDate = Date().addingTimeInterval(60 * 60 * Double(datecount) * 1)
        self.picker.dateFormat = "dd MMM YYY hh:mm a"
        self.picker.is12HourFormat = true
        self.picker.timeZone = TimeZone(identifier: "GMT+5:30")!
        self.picker.delegate = self
        self.picker.highlightColor = UIColor.AppColors
        self.picker.doneBackgroundColor = UIColor.AppColors
        self.picker.frame = CGRect(x: 0, y: 100, width: picker.frame.size.width, height: self.picker.frame.size.height)
        self.view.addSubview(self.picker)
        
        self.picker.show()
        
        if self.selectedDateFor == "leaveon"{
            self.leaveonLbl.text = self.picker.selectedDateString
            self.leaveDate = self.picker.selectedDate
            self.returnByDateLbl.text = "Select"
            self.returnDate = Date()
        }else{
             self.returnByDateLbl.text = self.picker.selectedDateString
           self.returnDate = self.picker.selectedDate
        }
    }
}

extension OutStationVC : DateTimePickerDelegate{
    
    
    func doneTimePicker(_ picker: DateTimePicker,selectedDate: String, didSelectDate: Date) {
       
    }
    
    func dateTimePicker(_ picker: DateTimePicker, didSelectDate: Date) {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd MMM YYY hh:mm a"
        let someDateTime = formatter.string(from: picker.selectedDate)
        if self.selectedDateFor == "leaveon"{
            self.leaveonLbl.text = someDateTime
            self.leaveDate = didSelectDate
            self.returnByDateLbl.text = "Select"
            self.returnDate = Date()
        }else{
            self.returnByDateLbl.text = someDateTime
            self.returnDate = didSelectDate
        }
        self.getVehicleDetail()
    }
    
    
}

extension OutStationVC : UITableViewDelegate , UITableViewDataSource{
    func setupDetelegate(){
        self.cabTable.delegate = self
        self.cabTable.dataSource = self
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.cabDetails?.vehicleListdetail.count ?? 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "CabListTable", for: indexPath) as! CabListTable
        
        
        
        if self.selectedIndex == indexPath.row{
            cell.selectionImg.image = UIImage(named: "selected")
        }else{
             cell.selectionImg.image = UIImage(named: "unselect")
        }
        
        
        if let details = self.cabDetails?.vehicleListdetail[indexPath.row]{
            cell.cabnameLbl.text = details.vehicle
            if self.selectedDateFor == "leaveon"{
                cell.cabpriceLbl.text = Constant.priceTag+" "+details.faredetails.totalFare
            }else{
                cell.cabpriceLbl.text = Constant.priceTag+" "+details.bkm + "/Km"
            }
             if self.selectedIndex == indexPath.row{
                durationInt = Double(details.durationInHour)
            }
            var urls : String = details.file ?? String()
           // cell.cabImg.pin_setImage(from: URL(string: urls))
            let urlkf = URL(string: urls)
            cell.cabImg.kf.setImage(with: urlkf)
           if let vehicleImage = cell.cabImg.image{
                let tintableImage = vehicleImage.withRenderingMode(.alwaysTemplate)
                cell.cabImg.image = tintableImage
                
            }
           cell.cabImg.tintColor = UIColor.AppColors
        }
        
        cell.contentView.addAction(for: .tap) {
            self.selectedIndex = indexPath.row
            self.cabTable.reloadData()
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        self.selectedIndex = indexPath.row
        self.cabTable.reloadData()
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60
    }
}



extension OutStationVC{
    
    func getVehicleDetail(){
        var outstationtype : String = ""
        var retunby : String = ""
        
                  if self.onewayImg.image == UIImage(named: "selected"){
                      outstationtype = "oneway"
                  }else{
                      outstationtype = "round"
                  }
        
        if self.returnByDateLbl.text ?? "" == "select" || self.returnByDateLbl.text ?? "" == "Select" {
            retunby = ""
        }else{
            retunby = self.returnByDateLbl.text ?? ""
        }
        
                  self.getVehicleDetailsForOutstation(pickupLoc: self.pickupLoc ?? CLLocation(), dropLoc: self.dropLoc ?? CLLocation(), tripTypeCode: "outstation", outstationType: outstationtype, startDay: self.leaveonLbl.text ?? "", returnDay: retunby)
    }
    
    func getVehicleDetailsForOutstation(pickupLoc : CLLocation, dropLoc : CLLocation,tripTypeCode : String,outstationType : String,startDay : String , returnDay : String){
        self.homevm.OustationService(view: self.view, pickupLoc: pickupLoc, dropLoc: dropLoc, tripTypeCode: tripTypeCode, outstationType: outstationType, startDay: startDay, returnDay: returnDay)
        
        self.homevm.errOutstationFare = {
            self.VehicleListView.isHidden = true
          //  showToast(msg: self.homevm.erroutstationVehicleListWithFare?.message ?? "")
            self.TripreqOutsation?.errOutstationRequestDataFare(requestData:  self.homevm.erroutstationVehicleListWithFare ?? OutstationVehicleListWithFare())
            self.navigationController?.popViewController(animated: true)
            
         }
        
        self.homevm.succOutstationFare =
        {
            self.VehicleListView.isHidden = false
            self.cabDetails = self.homevm.outstationVehicleListWithFare
            self.cabTable.reloadData()
        }
    }
}


class CabListTable : UITableViewCell{
    
    @IBOutlet weak var selectionImg : UIImageView!
    @IBOutlet weak var cabImg : UIImageView!
    @IBOutlet weak var cabnameLbl : UILabel!
    @IBOutlet weak var cabpriceLbl : UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
}


