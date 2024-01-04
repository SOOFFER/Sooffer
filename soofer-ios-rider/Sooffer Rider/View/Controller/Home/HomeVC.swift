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
import MarqueeLabel
import GeoFire
import FirebaseDatabase
import CTSlidingUpPanel
import SideMenuSwift
import SwiftUI

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
    func rentalRequestData(requestData : RideRequestModel)
    func errrentalRequestData(requestData : RideRequestModel)
    func OutstationRequestDataFare(requestData : OutstationVehicleListWithFare)
    func errOutstationRequestDataFare(requestData : OutstationVehicleListWithFare)
    func OutstationRequestData(requestData : RideRequestModel,location : CLLocation)
    func errOutstationRequestData(requestData : RideRequestModel,location : CLLocation)
    func getPickupDropOutstation(pickAddr : String,pickupLoc : CLLocation , dropAddr : String , dropLoc : CLLocation,outstaion: String)
    func getPickupDropLocation(pickAddr : String,pickupLoc : CLLocation , dropAddr : String , dropLoc : CLLocation,serviceDetail: VechileListData)
    func getPinLocation(tag : String , addr : String , addrLoc : CLLocation)
    func getFromLocation(tag : String , addr : String , addrLoc : CLLocation)
    func clearMapView()
    func getArrayAddress(address : [String] , location : [CLLocation],serviceDetail: VechileListData)
   
}
/*protocol searchMultipleStop {
    func getArrayAddress(address : [String], location : [CLLocation] , /*serviceDetail : vehicleListData,*/ ismulti: String)
       
}*/
extension HomeVC : searchMultipleStop {
    func getArrayAddress(address: [String], location: [CLLocation], /*serviceDetail: vehicleListData,*/ ismulti: String) {
        print("multi:: \(ismulti)")
        var multi = ismulti
        self.multiAddress = address
        self.multilocation = location
        self.mapView.clear()
        var multipleLocation : [[String : String]] = [[String : String]]()
        if address.count == 2{
            self.mapView.clear()
            self.pickupaddr = address[0]
            self.pickupLoc = location[0]
            self.dropAddr = address[1]
            self.dropLoc =  location[1]
            print("sets 1")
            self.setPolyLineWithMaker(pickupaddr: address[0], dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false, waypoints: [], tripstatus: "")
            self.ismultpleLocation = "false"
            // vehcile api call
            self.getVechileServiceList(pickupLoc: pickupLoc, dropLoc: dropLoc)
            self.requestBtn.setTitle(Localize.stringForKey(key: "request_now"), for: .normal)
        } else {
            switch address.count {
            case 0:
                break
            case 1:
                break
            case 2:
                self.pickupaddr = address[0]
                self.pickupLoc = location[0]
                self.dropAddr = address[1]
                self.dropLoc = location[1]
                print("sets 2")
               self.setPolyLineWithMaker(pickupaddr: address[0], dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false, waypoints: [], tripstatus: "")
                for value in 0...address.count-1{
                    multipleLocation.append(["doubleLat" : location[value].coordinate.latitude.description , "doubleLng" : location[value].coordinate.longitude.description, "strAddress" : address[value] , "updatePosition" : "false"])
                }
                break
            case 3:
                self.pickupaddr = address[0]
                self.pickupLoc = location[0]
                self.dropAddr = address[2]
                self.dropLoc = location[2]
                print("sets 3")
                self.setPolyLineWithMaker(pickupaddr: address[0], dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false, waypoints: [location[1]], tripstatus: "")
                for value in 0...address.count-1{
                    multipleLocation.append(["doubleLat" : location[value].coordinate.latitude.description , "doubleLng" : location[value].coordinate.longitude.description, "strAddress" : address[value] , "updatePosition" : "false"])
                }
                break
            case 4:
                self.pickupaddr = address[0]
                self.pickupLoc = location[0]
                self.dropAddr = address[3]
                self.dropLoc = location[3]
                print("sets 4")
               self.setPolyLineWithMaker(pickupaddr: address[0], dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false, waypoints: [location[1],location[2]], tripstatus: "")
                self.ismultpleLocation = "true"
                for value in 0...address.count-1{
                    multipleLocation.append(["doubleLat" : location[value].coordinate.latitude.description , "doubleLng" : location[value].coordinate.longitude.description, "strAddress" : address[value] , "updatePosition" : "false"])
                }
                break
            default:
                break
            }
            let jsonData : String = ((self.json(from:multipleLocation as NSArray))?.replacingOccurrences(of: "\\", with: "", options: NSString.CompareOptions.literal, range:nil))!
            
            let mutipleroute = "{\"multiple\":\(jsonData.description)}"
            print("jsonArray",mutipleroute)
            self.multilocatonStr = mutipleroute
            self.ismultpleLocation = "true"
            print("ismultplelocation is:: \(ismultpleLocation)")
         //   self.ismultpleLocation = self.multi
            self.cornerView.isHidden = false
            
            
        }
    }
}
extension HomeVC : TripRoutes{
    
    
    func getArrayAddress(address: [String], location: [CLLocation],serviceDetail: VechileListData) {
  
        self.multiAddress = address
        self.multilocation = location
        self.mapView.clear()
        var multipleLocation : [[String : String]] = [[String : String]]()
        if address.count == 2{
            self.mapView.clear()
            self.pickupaddr = address[0]
            self.pickupLoc = location[0]
            self.dropAddr = address[1]
            self.dropLoc =  location[1]
            print("sets 5")
          self.setPolyLineWithMaker(pickupaddr: address[0], dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false, waypoints: [], tripstatus: "")
            self.ismultpleLocation = "false"
            // vehcile api call
            self.getVechileServiceList(pickupLoc: pickupLoc, dropLoc: dropLoc)
            self.requestBtn.setTitle(Localize.stringForKey(key: "request_now"), for: .normal)
        } else {
            switch address.count {
            case 0:
                break
            case 1:
                break
            case 2:
                self.pickupaddr = address[0]
                self.pickupLoc = location[0]
                self.dropAddr = address[1]
                self.dropLoc = location[1]
                print("sets 6")
                self.setPolyLineWithMaker(pickupaddr: address[0], dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false, waypoints: [], tripstatus: "")
                self.ismultpleLocation = "true"
                for value in 0...address.count-1{
                    multipleLocation.append(["doubleLat" : location[value].coordinate.latitude.description , "doubleLng" : location[value].coordinate.longitude.description, "strAddress" : address[value] , "updatePosition" : "false"])
                }
                break
            case 3:
                self.pickupaddr = address[0]
                self.pickupLoc = location[0]
                self.dropAddr = address[2]
                self.dropLoc = location[2]
                print("sets 7")
               self.setPolyLineWithMaker(pickupaddr: address[0], dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false, waypoints: [location[1]], tripstatus: "")
                self.ismultpleLocation = "true"
                for value in 0...address.count-1{
                    multipleLocation.append(["doubleLat" : location[value].coordinate.latitude.description , "doubleLng" : location[value].coordinate.longitude.description, "strAddress" : address[value] , "updatePosition" : "false"])
                }
                break
            case 4:
                self.pickupaddr = address[0]
                self.pickupLoc = location[0]
                self.dropAddr = address[3]
                self.dropLoc = location[3]
                print("sets 8")
               self.setPolyLineWithMaker(pickupaddr: address[0], dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false, waypoints: [location[1],location[2]], tripstatus: "")
                self.ismultpleLocation = "true"
                for value in 0...address.count-1{
                    multipleLocation.append(["doubleLat" : location[value].coordinate.latitude.description , "doubleLng" : location[value].coordinate.longitude.description, "strAddress" : address[value] , "updatePosition" : "false"])
                }
                break
            default:
                break
            }
            let jsonData : String = ((self.json(from:multipleLocation as NSArray))?.replacingOccurrences(of: "\\", with: "", options: NSString.CompareOptions.literal, range:nil))!
            
            let mutipleroute = "{\"multiple\":\(jsonData.description)}"
            print("jsonArray",mutipleroute)
            self.multilocatonStr = mutipleroute
            self.ismultpleLocation = "true"
           // self.ismultpleLocation = self.ismulti
            self.cornerView.isHidden = false
            
            
        }
        
        let pickUpCity = self.pickupaddr.components(separatedBy: ",")
        switch pickUpCity.count{
        case 3 :
            self.pickupCity = pickUpCity[1]
            break
        case 4:
            self.pickupCity = pickUpCity[2]
            break
        case 5:
            self.pickupCity = pickUpCity[3]
            break
        default :
            self.pickupCity = pickUpCity[0]
            break
        }
        self.getFareDetail(pickupLoc: pickupLoc, dropLoc: dropLoc, serviceDetail: serviceDetail, pickupCity: self.pickupCity, isMultiLocation: ismultpleLocation, multiLocation: self.multilocatonStr)
    }
    
    func json(from object:Any) -> String? {
        guard let data = try? JSONSerialization.data(withJSONObject: object, options: []) else {
            return nil
        }
        return String(data: data, encoding: String.Encoding.utf8)
    }
    
    func getPickupDropOutstation(pickAddr: String, pickupLoc: CLLocation, dropAddr: String, dropLoc: CLLocation, outstaion: String) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
          //  self.ismultpleLocation = "false"
            let vc = OutStationVC.initWithStory()
            vc.TripreqOutsation = self
            vc.pickAddr = pickAddr
            vc.pickupLoc = pickupLoc
            vc.dropAddr = dropAddr
            vc.dropLoc = dropLoc
            vc.currectLocation = self.currentLocation
            var pickupcittty : String = ""
            let pickUpCity = pickAddr.components(separatedBy: ",")
            
            switch pickUpCity.count{
            case 3 :
                pickupcittty = pickUpCity[1]
                break
            case 4:
                pickupcittty = pickUpCity[2]
                break
            case 5:
                pickupcittty = pickUpCity[3]
                break
            default :
                pickupcittty = pickUpCity[0]
                break
            }
            vc.pickupcity = pickupcittty
            self.navigationController?.pushViewController(vc, animated: true)
        }
    }
    
    func rentalRequestData(requestData : RideRequestModel) {
        if requestData.message == "Rental request schedule, we will assign Driver before Trip Time"{
            self.sendRequestView.isHidden = true
            self.vechileView.isHidden = false
            self.markPinImage.isHidden = false
            self.clearView()
        }else{
            self.requestData = requestData
            self.sendRequestView.isHidden = false
            self.vechileView.isHidden = true
            self.markPinImage.isHidden = true
            self.AlertView.isHidden = true
            self.confirmBookingView.isHidden = true
           
        }
    }
    
    func errrentalRequestData(requestData : RideRequestModel) {
        if let requestdata : RideRequestModel = requestData as? RideRequestModel{
            showToast(msg: requestdata.message )
            self.clearView()
        }
    }
    
    func OutstationRequestDataFare(requestData: OutstationVehicleListWithFare) {
    }
    
    func errOutstationRequestDataFare(requestData: OutstationVehicleListWithFare) {
        if let requestdata : OutstationVehicleListWithFare = requestData as? OutstationVehicleListWithFare{
            showToast(msg: requestdata.message)
            self.clearView()
        }
    }
    
    func OutstationRequestData(requestData: RideRequestModel,location : CLLocation) {
        if requestData.message == "Rental request schedule, we will assign Driver before Trip Time" || requestData.message == "Outstation request schedule, we will assign Driver before Trip Time"{
            self.sendRequestView.isHidden = true
            self.vechileView.isHidden = false
            self.markPinImage.isHidden = false
            self.clearView()
        }else{
            self.requestData = requestData
            self.sendRequestView.isHidden = false
            self.vechileView.isHidden = true
            self.markPinImage.isHidden = true
            self.AlertView.isHidden = true
            self.confirmBookingView.isHidden = true
        }
        let vc = HomeVC.initWithStory()
        vc.requestData = requestData
        let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: vc))
        self.appDelegate.window?.rootViewController = MenuRoot
    }
    
    func errOutstationRequestData(requestData: RideRequestModel,location : CLLocation) {
        if let requestdata : RideRequestModel = requestData as? RideRequestModel{
            self.clearView()
            let vc = HomeVC.initWithStory()
            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: vc))
            self.appDelegate.window?.rootViewController = MenuRoot
            self.markPinImage.isHidden = false
        }
    }
    
    func getFromLocation(tag: String, addr: String, addrLoc: CLLocation) {
        self.mapView.clear()
        self.pickupaddr = addr
        self.pickupLoc = addrLoc
        self.fromAddressLBL.text = addr
        // focus to current  location
        self.mapView.camera = GMSCameraPosition(target: self.pickupLoc.coordinate, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
        // vehcile api call
        self.getVechileServiceList(pickupLoc: pickupLoc, dropLoc: dropLoc)
        self.iswanttoCallVehicleList = true
        self.requestBtn.setTitle(Localize.stringForKey(key: "request_now"), for: .normal)
    }
    
    func getPinLocation(tag: String, addr: String, addrLoc: CLLocation) {
        self.mapView.clear()
        if tag == "pickup" {
            self.pickupaddr = addr
            self.pickupLoc = addrLoc
            print("sets 9")
            self.setPolyLineWithMaker(pickupaddr: addr, dropaddr: dropAddr, pickupLoc: addrLoc, dropLoc: dropLoc, isRideFlowStated: false,waypoints: [], tripstatus: "")
        } else {
            self.dropAddr = addr
            self.dropLoc = addrLoc
            print("sets 10")
            self.setPolyLineWithMaker(pickupaddr: pickupaddr, dropaddr: addr, pickupLoc: pickupLoc, dropLoc: addrLoc, isRideFlowStated: false,waypoints: [], tripstatus: "")
        }
        self.requestBtn.setTitle(Localize.stringForKey(key: "request_now"), for: .normal)
    }
    
    func getPickupDropLocation(pickAddr: String, pickupLoc: CLLocation, dropAddr: String, dropLoc: CLLocation,serviceDetail: VechileListData) {
        self.mapView.clear()
        print("Valuesss:::", pickAddr)
        self.pickupaddr = pickAddr
        self.pickupLoc = pickupLoc
        self.dropAddr = dropAddr
        self.dropLoc = dropLoc
        self.iswanttoCallVehicleList = false
        print("if sekf:: \(self.multilocatonStr)")
       if self.multilocatonStr.isEmpty{
            self.ismultpleLocation = "false"
        } else {
            self.ismultpleLocation = "true"
        }
        print("if 343434:: \(self.ismultpleLocation)")
     //   self.ismultpleLocation = "false"
        print("sets 11")
        self.setPolyLineWithMaker(pickupaddr: pickAddr, dropaddr: dropAddr, pickupLoc: pickupLoc, dropLoc: dropLoc, isRideFlowStated: false,waypoints: [], tripstatus: "")
        
        let pickUpCity = self.pickupaddr.components(separatedBy: ",")
        switch pickUpCity.count{
        case 3 :
            self.pickupCity = pickUpCity[1]
            break
        case 4:
            self.pickupCity = pickUpCity[2]
            break
        case 5:
            self.pickupCity = pickUpCity[3]
            break
        default :
            self.pickupCity = pickUpCity[0]
            print("valuess:::;", pickupCity)
            break
        }
        self.getFareDetail(pickupLoc: pickupLoc, dropLoc: dropLoc, serviceDetail: serviceDetail, pickupCity: self.pickupCity, isMultiLocation : ismultpleLocation, multiLocation: self.multilocatonStr)
    }
    
    func clearMapView() {
        self.viewDidLoad()
        self.viewWillAppear(true)
    }
}

extension HomeVC {
    fileprivate func slideAction() {
        
        slideController?.setAnchorPoint(anchor: 0.7)
        
        slideController?.onPanelExpanded = {
            print("Panel Expanded in closure")
        }
        
        slideController?.onPanelCollapsed = {
            print("Panel Collapsed in closure")
        }
        
        slideController?.onPanelMoved = { offset in
            print("Panel moved in closure " + offset.description)
        }
        
        if slideController?.currentState == .collapsed {
            print("sjdfhjdshjsdhfdhsfghsdgfhj")
        }
        
        self.slideController = CTBottomSlideController(parent: self.view, bottomView: self.contentView, tabController: self.tabBarController, navController: self.navigationController, visibleHeight: 400)
    }
}

class HomeVC: UIViewController ,MFMessageComposeViewControllerDelegate{
    
    @IBOutlet weak var searchView: UIView!
    @IBOutlet weak var searchTf: UITextField!
    func messageComposeViewController(_ controller: MFMessageComposeViewController, didFinishWith result: MessageComposeResult) {
        self.dismiss(animated: true, completion: nil)
    }
    
    // Api response
    var vechileList : VechileServiceModel?{
        didSet{
            self.vehicleCollectionView.reloadData()
            self.homeTbl.reloadData()
        }
    }
    
    //API Response
    var fareDetail : EstimateFareDetails?{
        didSet{
        }
    }
    
    //UI Declaraction
    
    @IBOutlet weak var contentView: UIView!
    @IBOutlet weak var cornerView: UIView!
    @IBOutlet weak var navView: UIView!
    @IBOutlet weak var homeTbl: UITableView!
    @IBOutlet weak var menuImg: UIImageView!
    @IBOutlet weak var backImg: UIImageView!
    
    @IBOutlet weak var mapView: GMSMapView!
    
    @IBOutlet weak var fromAddressLBL: UILabel!
    @IBOutlet weak var promoLbl: UILabel!
    @IBOutlet weak var cashLbl: UILabel!
    
    @IBOutlet weak var tripStatusLbl: UILabel!
    @IBOutlet weak var requestBtn: UIButton!
    @IBOutlet weak var rideLaterBtn: UIButton!
    @IBOutlet weak var myLocationView: UIView!
    @IBOutlet weak var cashViewBtn: UIButton!
    @IBOutlet weak var cancelView: UIImageView!
    
    @IBOutlet weak var promoBtn: UIButton!
    @IBOutlet weak var cashView: UIView!
    
    @IBOutlet weak var promoView: UIView!
    @IBOutlet weak var vechileView: UIView!
    @IBOutlet weak var backView: UIView!
    @IBOutlet weak var menusView: UIView!
    
    @IBOutlet weak var tripStatusView: UIView!
    @IBOutlet weak var designLbl: MarqueeLabel!
    @IBOutlet weak var sourceAddrssLbl: MarqueeLabel!
    @IBOutlet weak var sourceAddrView : UIView!
    @IBOutlet weak var designationView : UIView!
    @IBOutlet weak var markPinImage : UIImageView!
    @IBOutlet weak var nodataImg: UIImageView!
    @IBOutlet weak var addressList : UITableView!
    //Call to book :
    
    @IBOutlet weak var containerView: UIView!
    @IBOutlet weak var calltobookView : UIView!
    @IBOutlet weak var nodriverFoundView : UIView!
    @IBOutlet weak var confirmBookingView : UIView!
    @IBOutlet weak var vehicleCollectionView: UICollectionView!
    
    //RippleView
    @IBOutlet weak var sendRequestView: UIView!
    @IBOutlet weak var rippleView: UIView!
    @IBOutlet weak var cancelImg: UIImageView!
    
    @IBOutlet weak var bookingehicleImage : UIImageView!
    @IBOutlet weak var aproxfareView: UIView!
    @IBOutlet weak var cashmethodView: UIView!
    @IBOutlet weak var applycouponView: UIView!
    @IBOutlet weak var confimeBookingBtn: UIButton!
    @IBOutlet weak var appxFareLbl: UILabel!
    @IBOutlet weak var confimrBookingInfoView: UIView!
    @IBOutlet weak var outstationView: UIView!
    @IBOutlet weak var outstationConfirmation: UIButton!
    
   
    
    @IBOutlet weak var walletView: UIView!
    @IBOutlet weak var checkimg: UIImageView!
   
    @IBOutlet weak var Wlletlbl: UILabel!
    
    
    //AlertView
    @IBOutlet weak var AlertView: UIView!
    @IBOutlet weak var outstationalertOutsideView: UIView!
    @IBOutlet weak var outstationalertView: UIView!
    @IBOutlet weak var outstationalertlogo: UIImageView!
    @IBOutlet weak var changeDropBtn: UIButton!
    @IBOutlet weak var contnueBtn: UIButton!
    
    // priceView
    @IBOutlet weak var priceAlertView: UIView!
    @IBOutlet weak var pricealertlogo: UIImageView!
    @IBOutlet weak var priceLbl: UILabel!
    @IBOutlet weak var kmpriceLbl: UILabel!
    @IBOutlet weak var vehiclenameLnl: UILabel!
    @IBOutlet weak var priceinerView: UIView!
    
    
    //schedule Ride View
    @IBOutlet weak var scheduleRideView: UIView!
    @IBOutlet weak var schudelTitleLbl: UILabel!
    @IBOutlet weak var dateTimeView: UIView!
    
    @IBOutlet weak var timeView: UIView!
    @IBOutlet weak var dateView: UIView!
    @IBOutlet weak var dateLbl: UILabel!
    
    @IBOutlet weak var seletecdateLbl: UILabel!
    
    @IBOutlet weak var selectedTimeLbl: UILabel!
    @IBOutlet weak var timeLbl: UILabel!
    @IBOutlet weak var schudleBtn: UIButton!
    @IBOutlet weak var cancelBtn: UIButton!
    
    
    @IBOutlet weak var doneBtn: UIBarButtonItem!
    @IBOutlet weak var donetoolbar: UIToolbar!
    @IBOutlet weak var datePicker: UIDatePicker!
    @IBOutlet weak var datePickerView: UIView!
    @IBOutlet weak var sosImg: UIImageView!
    @IBOutlet weak var stopImage: UIImageView!
    
    @IBOutlet weak var multistopView : UIView!
    @IBOutlet weak var closeMultistop: UIImageView!
    @IBOutlet weak var multistopViewHeight : NSLayoutConstraint!
    
    @IBOutlet weak var MylocationView: UIView!
    @IBOutlet weak var Hideview: UIView!
    @IBOutlet weak var SupportView: UIView!
    
    @IBOutlet weak var Ridefareval: UILabel!
    
    @IBOutlet weak var BasefareVal: UILabel!
    
    @IBOutlet weak var BookingFareVal: UILabel!
    
    
    @IBOutlet weak var TimeFareVal: UILabel!
    
    
    @IBOutlet weak var PickupChargeVal: UILabel!
    
    
    @IBOutlet weak var TaxfeeVal: UILabel!
    
    @IBOutlet weak var NightChargeVal: UILabel!
    
    
    @IBOutlet weak var CancelVall: UILabel!
    
    
    @IBOutlet weak var SubtotalVal: UILabel!
    
    
    @IBOutlet weak var InfoEstimationView: UIView!
    
    
    @IBOutlet weak var infoDismissView: UIView!
    
    @IBOutlet weak var InfoDetailView: UIView!
    
    @IBOutlet weak var DistanceVall: UILabel!
    
    
    @IBOutlet weak var TimeValinAporx: UILabel!
    
    //MARK: -- PROPERTIES
    
    var tripFBStatus : FBTripDataModel = FBTripDataModel()
    var mulitiLocationAddress : [MulitiLocation] = [MulitiLocation]()
    var multiAddress : [String] = [String]()
    var multilocation : [CLLocation] = [CLLocation]()
    var multilocatonStr : String = String()
    var ismultpleLocation : String = String()
    var dateTime : String = ""
    var isSchudleRide = "false"
    var schudleDateStr = ""
    var schudleTimestr = ""
    var selectedvehicleName = ""
    var isdrawedStartedPolyLine : Bool = false
    var isdrawedAcceptedPolyLine : Bool = false
    var HitOnceAcceptedPolyline : Bool = false
    var gettingLocationAddress : String = ""
    var isSelected : Bool = Bool()
    var tripRouteDelegate : TripRoutes?
    var LaterOrNowdelegate : RideLaterOrNow?
    var Driver_name = ""
    var Driver_profile = ""
    var onceHitPloyline = Bool()
    var HitOnceAfterStart = false
    
    var slideController   : CTBottomSlideController?
    
    var redirectHome : RedirectHome = .ride
    
    var taxiId : String = String()
    //Models
//    var tripRouteStatus : TripStatusModel = TripStatusModel()
    var FBtripstatus : FBTripDataModel?
    var tripCurrentStage: OnGoingTrip = .noDriver
    var Listen_Trip_Status = Bool()
    
    var TRIP_CUR_STATE = String()

    @IBAction func PanAcction(_ sender: UIPanGestureRecognizer) {
        
        let panView = sender.view!
        let point = sender.translation(in: self.view)
        print("Multipoint",point , panView.center.y)
    }
    
    
    @IBAction func doneBtnAct(_ sender: Any) {
        if self.dateTime == "date" {
            let dateFormatter = DateFormatter()
            self.datePicker.datePickerMode = .date
            dateFormatter.dateFormat = "dd-MM-yyyy"
            datePicker.minimumDate = Date()
            datePicker.maximumDate = Calendar.current.date(byAdding: .day, value: +7, to: Date())
            seletecdateLbl.text = dateFormatter.string(from: datePicker.date)
            self.schudleDateStr = dateFormatter.string(from: datePicker.date)
            print("schudleDateStr::\(self.schudleDateStr)")
            self.datePickerView.isHidden = true
            
        } else if self.dateTime == "time" {
            let dateFormatter = DateFormatter()
            self.datePicker.datePickerMode = .time
            dateFormatter.dateFormat = "hh:mm a"
            dateFormatter.timeZone = TimeZone(identifier: "GMT +5:30")
            selectedTimeLbl.text = dateFormatter.string(from: datePicker.date)
            self.schudleTimestr = dateFormatter.string(from: datePicker.date)
            self.self.datePickerView.isHidden = true
        }
    }
    
    var serviceDetail: VechileListData?
    var isRentalRequest : Bool = false
    var rentalid : String = ""
    var iswanttoCallVehicleList : Bool = false
    var rippleEffectView: SMRippleView?
    var contactTobook : String? = ""
    //views
    let paymentView = PaymentDetailView.getView
    let promoCodeView = PromoView.getView
    let tripView = TripStatusView.getView
    var driverMarkers : [GMSMarker] = [GMSMarker]()
    var geoLocation : [CLLocation] = [CLLocation]()
    var geokey : [String] = [String]()
    
    //Variyable Declaraction
    var Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    let FBCONNECT = FireBaseconnection.instanse
    var MyLocation : CLLocationCoordinate2D = CLLocationCoordinate2D()
    var currentLocation = CLLocation()
    var pickupaddr : String = ""
    var pickupCity : String = ""
    var pickupLoc : CLLocation = CLLocation()
    var dropAddr : String = ""
    var dropCity : String = ""
    var dropLoc : CLLocation = CLLocation()
    
    var driverMarker = GMSMarker()
    lazy var locationManager: CLLocationManager = {
        var _locationManager = CLLocationManager()
        _locationManager.desiredAccuracy = kCLLocationAccuracyBest
        _locationManager.delegate = self
        return _locationManager
    }()
    
    // variable for animated pollyline
    var timer: Timer!
    var polyline = GMSPolyline()
    var animationPolyline = GMSPolyline()
    var path = GMSPath()
    var animationPath = GMSMutablePath()
    var i: UInt = 0
    var pickupInfoWindow : PickupLocView?
    var dropInfoWindow : DropLocView?
    var pickupTagMarker = PickupMarker()
    var dropTagMarker = DropMarker()
    
    var focusZoom : Float = 15
    var selectedVCIndex : Int = 0
    var arrayIndex : Int = 0
    var currentAddress : String = ""
    var subviewCount : Int = -1
    var hiddenShowViews : Int = 1
    var serviceData : VechileListData = VechileListData()
    var requestData : RideRequestModel = RideRequestModel()
    var homevm = HomeVM()
    var googleVM = GoogleVM()
    var paymentvm = PaymentVM()
    
    //View Declaration
    var ConfirmBooking = ConfirmBookingView()
    var rootVc: UIViewController?
    
    var number   : String = String()
    var mName : String = String()
    var modl    : String = String()
    var onetimeTap = false

    
    func setViews(index: IndexPath) {
        serviceDetail = self.vechileList?.VechileListList[index.row]
        getPickupDropLocation(pickAddr: self.pickupaddr, pickupLoc: self.pickupLoc, dropAddr: self.dropAddr, dropLoc: self.dropLoc,serviceDetail: self.serviceDetail ?? VechileListData())
        self.cornerView.isHidden = true
    }
    
    override func loadView() {
        super.loadView()
    }
    
    deinit {
            NotificationCenter.default.removeObserver(self)
        }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.getFBRiderData()
        print("redirect", redirectHome)
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        }
        
        self.mapView.clear()
        self.multistopView.isElevation = 5
        self.homevm = HomeVM(view: self.vechileView, dataService: ApiRoot())
        self.googleVM = GoogleVM(view: self.view, dataService: ApiRoot())
        
        self.setupAction()
        self.setupView()
        self.setupLang()
        self.setupDelegate()
        self.setupMapDelegate()
        self.setupCVDelegate()
        self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
        self.observeNotification()
        self.hideShowView()
        self.clouserCall()
        self.setupTableview()
        self.setAction()
        if isSelected {
            self.valueAction()
        }
        self.ListenTripStatus()
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.handleTap(sender:)))
        self.cashView.addGestureRecognizer(tap)
        
        
     
    }
   

    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
        self.paymentvm = PaymentVM(view: self.view, dataService: ApiRoot())
        self.logout()
        //Fiber Base listening
        
     //   self.ListenTripStatus()
     //   self.listenDriverLocation()
        self.getWalletMoney() // for getting wallet Balance
        print("sdfddsjkdjdjkd::\(mapView.myLocation)")
        NotificationCenter.default.addObserver(self, selector: #selector(setupprint), name: .pushnotify, object: nil)
        
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(true)
        self.navigationController?.isNavigationBarHidden = false
        if timer != nil{
            self.timer.invalidate()
        }
        NotificationCenter.default.removeObserver(self, name: .pushnotify, object: nil)
    }
    @objc func setupprint(){
     
     //   if let profileData : ProfileModel  = Constant.profileData as? ProfileModel {
            
      
      //  if !onetimeTap {
            let sinchVc = VideoCallVC.initWithStory()
            print("driverfcmhomepage::\(self.FBtripstatus?.driver_token)")
            sinchVc.driverfcm = self.FBtripstatus?.driver_token ?? ""
            sinchVc.drivername = Driver_name
            sinchVc.driverpic = Driver_profile
            self.navigationController?.pushViewController(sinchVc, animated: true)
      //  }

      //  }
        
    }
    
    func valueAction() {
        cornerView.isHidden = false
        slideAction()
    }
    
    func setAction() {
        
        print("Valuesss::::", redirectHome)
        if redirectHome == .hour {
            cornerView.isHidden = true
            let vc = RentalVC.initWithStory()
            vc.pickupAddress = currentAddress
            print("count::::", currentAddress)
            vc.pickupLoaction = self.currentLocation
            vc.rentalServiceID = self.rentalid
            vc.TripRoutesrental = self
            vc.bookingtype = "rideNow"
            self.navigationController?.pushViewController(vc, animated: true)
        } else if redirectHome == .driver {
            cornerView.isHidden = true
            let driverVc = DriverVc.initWithStory()
            driverVc.delegate = self
            self.navigationController?.present(driverVc, animated: true, completion: nil)
        } else if redirectHome == .recentAddress {
            valueAction()
        } else if redirectHome == .riderlater {
          //  paymentView.setView(view: self.view)
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "dd-MM-yyyy"
         //   self.seletecdateLbl.text = dateFormatter.string(from: Date())
            
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "hh:mm a"
            timeFormatter.timeZone = TimeZone(identifier: "GMT +5:30")
            
          //  self.selectedTimeLbl.text = timeFormatter.string(from: Date())
            
            self.isSchudleRide = "true"
            self.scheduleRideView.isHidden = false
//            let riderLatervc = RideLaterVc.initWithStory()
//            self.navigationController?.present(riderLatervc, animated: true, completion: nil)
        }
        self.MylocationView.addAction(for: .tap) {
            self.mapView.camera = GMSCameraPosition(target: self.MyLocation, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
        }
        
        searchView.addTap {
            let vc = SearchAddressVC.initWithStoryboard()
            vc.redirectHome = self.redirectHome
            vc.currentAddress = self.currentAddress
            vc.currentLocation = self.currentLocation
            vc.tripRouteDelegate = self
            
            self.navigationController?.pushViewController(vc, animated: true)
        }
    }
    
    func setupView(){
        //confirmBookView
        self.confimeBookingBtn.roundeCornorBorder = 10
        self.confimrBookingInfoView.isElevation = 3
        self.confimrBookingInfoView.roundeCornorBorder = 10
        
        //AlertView
        self.outstationalertlogo.isRoundedView = true
        self.outstationalertView.roundeCornorBorder = 10
        self.changeDropBtn.roundeCornorBorder = 15
        self.contnueBtn.roundeCornorBorder = 15
        self.outstationConfirmation.roundeCornorBorder = 15
        
        //fareView
        self.pricealertlogo.isRoundedView = true
        self.priceinerView.roundeCornorBorder = 10
        self.priceAlertView.isElevation = 10
        self.priceAlertView.layer.cornerRadius = 10
        
        // set border for from label
        self.calltobookView.isRoundedView = true
        self.fromAddressLBL.layer.cornerRadius = 20
        self.fromAddressLBL.layer.borderColor = UIColor(named: "AppColor")?.cgColor
        self.fromAddressLBL.layer.borderWidth = 1
        self.fromAddressLBL.layer.masksToBounds = true
        
        self.SupportView.isRoundedView = true
        
        self.backView.isRoundedView = true
        self.backView.isRoundedBorder = true
        self.backView.layer.masksToBounds = true
        
        self.menusView.layer.cornerRadius = self.menusView.frame.width/2
        self.menusView.isElevation = 3
        self.sourceAddrView.isElevation = 2
        self.sourceAddrView.layer.cornerRadius = 10
        
        self.designationView.isElevation = 2
        self.designationView.layer.cornerRadius = 10
        
        self.requestBtn.countmroundeCornorBorder(borderwith: 10, Bordercolor: UIColor.AppColors, bgcolor: UIColor(named: "SelectedVechBG") ?? UIColor())
        
        self.rideLaterBtn.backgroundColor = UIColor.white
        self.rideLaterBtn.setTitleColor(UIColor.AppColors, for: .normal)
        self.rideLaterBtn.countmroundeCornorBorder(borderwith: 20, Bordercolor: UIColor.AppColors, bgcolor: UIColor.white)
        self.vechileView.leftRightRoundCorners(radius: 10.0)
        
        
        let fillColor = UIColor.lightGray
        let rippleView = SMRippleView(frame: self.rippleView.bounds, rippleColor: UIColor.clear, rippleThickness: 0.15, rippleTimer: 2, fillColor: fillColor, animationDuration: 5, parentFrame: self.sendRequestView.bounds)
        self.rippleView.addSubview(rippleView)
        
        self.InfoDetailView.layer.cornerRadius = 10
    }
    
    func checkSOSEnable(){
        if Constant.profileData.emergency.count == 0{
            self.sosImg.isHidden = false
            self.Hideview.isHidden = false
        }else{
            self.sosImg.isHidden = true
            self.Hideview.isHidden = true
            print("profileData.emergency.count",Constant.profileData.emergency.count)
        }
    }
    
    func mapPadding(addBottom : CGFloat , reduceBottom : CGFloat){
        
        switch self.subviewCount {
        case 1:
            self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: 150+addBottom-reduceBottom, right: 0)
            
        case 2:
            
            self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: self.paymentView.frame.height+addBottom-reduceBottom * 1.5, right: 0)
        case 3:
            self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: self.tripView.frame.height+addBottom-reduceBottom+20, right: 0)
        default:
            self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        }
    }
    
    func hideShowView(){
        print("valuesss:::", hiddenShowViews)
        switch self.hiddenShowViews {
        case 1:
            self.fromAddressLBL.isHidden = false
            self.iswanttoCallVehicleList = true
            self.vechileView.isHidden = true
            self.markPinImage.isHidden = true
            self.backView.isHidden = true
            self.menuImg.isHidden = false
            self.menusView.isHidden = false
            self.backView.isHidden = true
        case 2:
            self.fromAddressLBL.isHidden = true
            self.vechileView.isHidden = false
            self.markPinImage.isHidden = false
            self.backView.isHidden = false
            self.menuImg.isHidden = true
            self.menusView.isHidden = true
            self.backView.isHidden = false
            self.subviewCount = 1
        case 3 :
            self.fromAddressLBL.isHidden = true
            self.vechileView.isHidden = true
            self.markPinImage.isHidden = true
            self.backView.isHidden = true
            self.menuImg.isHidden = true
            self.menusView.isHidden = true
            self.backView.isHidden = true
        default:
            self.fromAddressLBL.isHidden = false
        }
    }
    
    func setupDelegate(){
    }
    
    func setupAction(){

//        self.myLocationView.addAction(for: .tap) {
//                  self.mapView.camera = GMSCameraPosition(target: self.MyLocation, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
//              }
        
        self.closeMultistop.addAction(for: .tap) {
            self.multistopView.isHidden = true
        }
        
        self.stopImage.addAction(for: .tap) {
            self.multistopView.isHidden = false
            //            self.multistopView.bringSubviewToFront(self.tripView)
            self.view.addSubview(self.multistopView)
            //            self.multistopViewHeight.constant = 250
        }
        self.sosImg.addAction(for: .tap) {
            self.sosMsg()
        }
        
        self.seletecdateLbl.addAction(for: .tap) {
            if #available(iOS 13.4, *) {
                self.datePicker.preferredDatePickerStyle = UIDatePickerStyle.wheels
            } else {
                // Fallback on earlier versions
            }
            
            self.dateTime = "date"
            self.datePickerView.isHidden = false
            self.datePicker.datePickerMode = .date
            
            self.datePicker.minimumDate = Date()
            self.datePicker.maximumDate = Calendar.current.date(byAdding: .day, value: +7, to: Date())
        }
        self.selectedTimeLbl.addAction(for: .tap) {
            if #available(iOS 13.4, *) {
                self.datePicker.preferredDatePickerStyle = UIDatePickerStyle.wheels
            } else {
                // Fallback on earlier versions
            }
            self.dateTime = "time"
            self.datePickerView.isHidden = false
            self.datePicker.datePickerMode = .time
            
            let defaultTime = Date().addingTimeInterval(30 * 60)
            self.datePicker.minimumDate = defaultTime
            self.datePicker.setDate(defaultTime, animated: false)
        }
    
        self.cancelBtn.addAction(for: .tap) {
            self.scheduleRideView.isHidden = true
        }
    
        
        self.confimeBookingBtn.addAction(for: .tap) {
            let payment : String = "card"
            let date = Date()
            var dateStr : String = ""
            var time : String = ""
            var utc : String = ""
            
            var bookingtype : String = String()
            
          /*  if !Constant.profileData.card.last4.isEmpty{
                let cardd = PaymentVC.initWithStory()
                self.present(cardd, animated: true)
            
            }*/
           
          /*  if Constant.profileData.card.last4.isEmpty{
                showToast(msg: "please add card from menu")
                self.showalert()
            }
             else*/ if self.isSchudleRide == "true"{
                 
                dateStr = self.schudleDateStr
                 time = self.schudleTimestr
                bookingtype = "rideLater"
                 utc = "+05:30"
                
                
            }else{
                let formatter = DateFormatter()
                formatter.dateFormat = "dd-MM-yyyy"
                dateStr = formatter.string(from: date)
                let timeformatter = DateFormatter()
                timeformatter.dateFormat = "hh:mm a"
                time = timeformatter.string(from: date)
                bookingtype = "rideNow"
                utc = ""
                
               
              /*  let cardd = PaymentVC.initWithStory()
                self.present(cardd, animated: true)*/
                
            }
            print("Card:: \(Constant.profileData.card.last4)")
         //   print("Iddss::::", UserDefaults.standard.string(forKey: UserDefaultsKey.taxiId))
            if Constant.profileData.card.last4.isEmpty{
                  //showToast(msg: "please add card from menu")
                  self.showalert()
              }else{
                print("multi:::: \(self.multilocatonStr), and is multiple location is:: \(self.ismultpleLocation), and multi:: \(self.multilocation)")
                  self.sendRideRequest(view: self.view, date: dateStr, paymentType: payment, pickupCity: self.pickupCity, bookingtype: bookingtype, tripTime: time, utc: utc, estimateFare: self.fareDetail ?? EstimateFareDetails(), isMultiLocation: self.ismultpleLocation, multiLocation: self.multilocatonStr, type: self.redirectHome, withId: self.taxiId, requestResponse: {(requestData) in
                      //                self.mapView.settings.myLocationButton = true
                      showToast(msg: requestData.message)
                      self.paymentView.deInitView(request: "")
                      self.requestData = requestData
                      self.cornerView.isHidden = true
                      if bookingtype == "rideNow"{
                          self.sendRequestView.isHidden = false
                      }else{
                          self.sendRequestView.isHidden = true
                          let homeVc = HomeVc.initWithStory()
                          let nav = UINavigationController(rootViewController: homeVc)
                          nav.navigationBar.isHidden = true
                          let menuVc = MenuVC.initWithStory()
                          self.appDelegate.window?.rootViewController = SideMenuController(contentViewController: nav, menuViewController: menuVc)
                              
                      }
                      self.vechileView.isHidden = true
                      self.markPinImage.isHidden = true
                      self.AlertView.isHidden = true
                      self.confirmBookingView.isHidden = true
                      
                      
                     
                      
                })
            }
        }
        
        self.calltobookView.addAction(for: .tap) {
            if let url = URL(string: "tel://\(self.contactTobook ?? "")"), UIApplication.shared.canOpenURL(url) {
                if #available(iOS 10, *) {
                    UIApplication.shared.open(url)
                } else {
                    UIApplication.shared.openURL(url)
                }
            }
        }
        
        self.SupportView.addAction(for: .tap) {
            print("sup::\(Constant.profileData.supportNo)")
            if let url = URL(string: "tel://\(Constant.profileData.supportNo)"), UIApplication.shared.canOpenURL(url) {
                if #available(iOS 10, *) {
                    UIApplication.shared.open(url)
                } else {
                    UIApplication.shared.openURL(url)
                }
            }
        }
        
        self.menusView.addAction(for: .tap) {
            print("error occured")
            self.sideMenuController?.revealMenu()
           // self.clearView()
//            if self.revealViewController() != nil {
//                self.revealViewController().revealToggle(animated: true)
//            }
        }
        
        self.cancelView.addTap {
            self.clearView()
        }
        
        self.backView.addAction(for: .tap) {
            self.clearView()
        }
        
        self.fromAddressLBL.addAction(for: .tap) {
            if !self.currentAddress.isEmpty{
                self.navigationController?.isNavigationBarHidden = true
                let vc = SearchAddressVC.initWithStoryboard()
                vc.pageFrom = "home"
                vc.currentAddress = self.currentAddress
                vc.currentLocation = self.currentLocation
                vc.tripRouteDelegate = self
                self.navigationController?.pushViewController(vc, animated: true)
                
            }else{
//                self.getCurrentLocationFromGeoCoder(loc: self.currentLocation) { (address) in
//                    DispatchQueue.main.asyncAfter(deadline: .now()+1) {
//                        self.currentAddress = self.gettingLocationAddress
//                        self.fromAddressLBL.text = "  "+self.gettingLocationAddress
//                        print("*****Getting_Address" , self.currentAddress)
//                    }
//
//                }
                
                self.getCurrentLocationFromGeoCoder(loc: self.currentLocation) { (address) in
                    DispatchQueue.main.asyncAfter(deadline: .now()+1) {
                        self.currentAddress = self.gettingLocationAddress
                        self.fromAddressLBL.text = "  "+self.gettingLocationAddress
                        print("*****Getting_Address" , self.currentAddress)
                        let vc = SearchAddressVC.initWithStoryboard()
                        vc.pageFrom = "home"
                        vc.currentAddress = self.currentAddress
                        vc.currentLocation = self.currentLocation
                        vc.tripRouteDelegate = self
                        self.navigationController?.pushViewController(vc, animated: true)
                    }
                }
//                convertLatLangTOAddress(coordinates: self.currentLocation, address: { (address) -> Void in
//                        self.currentAddress = address
//                        self.fromAddressLBL.text = "  "+address
//                        print("*****Getting_Address" , self.currentAddress)
//                        let vc = SearchAddressVC.initWithStoryboard()
//                        vc.pageFrom = "home"
//                        vc.currentAddress = self.currentAddress
//                        vc.currentLocation = self.currentLocation
//                        vc.tripRouteDelegate = self
//                        self.navigationController?.pushViewController(vc, animated: true)
////                    }
//                })
            }
        }
        
        self.requestBtn.addAction(for: .tap) {
            if self.requestBtn.title(for: .normal) != self.Localize.stringForKey(key: "no_vehicle"){
                self.isSchudleRide = "false"
                if self.isRentalRequest{
                    let date = Date()
                    let formatter = DateFormatter()
                    formatter.dateFormat = "dd-MM-yyyy"
                    let dateStr : String = formatter.string(from: date)
                    
                    let timeformatter = DateFormatter()
                    timeformatter.dateFormat = "hh:mm a"
                    let time : String = timeformatter.string(from: date)
                    
                    let vc = RentalVC.initWithStory()
                    vc.pickupAddress = self.fromAddressLBL.text ?? ""
                    vc.pickupLoaction = self.currentLocation
                    vc.rentalServiceID = self.rentalid
                    vc.TripRoutesrental = self
                    vc.date = dateStr
                    vc.time = time
                    vc.bookingtype = "rideNow"
                    self.navigationController?.pushViewController(vc, animated: true)
                }else{
                    if !self.currentAddress.isEmpty{
                        if self.selectedVCIndex != -1 {
                            self.navigationController?.isNavigationBarHidden = true
                            let vc = SearchAddressVC.initWithStoryboard()
                            //  vc.pageFrom = "home"
                            vc.serviceDetail = self.vechileList?.VechileListList[self.selectedVCIndex]
                            vc.currentAddress = self.currentAddress
                            vc.currentLocation = self.currentLocation
                            vc.tripRouteDelegate = self
                            self.navigationController?.pushViewController(vc, animated: true)
                        }else{
                            showToast(msg: "Select anyone vechile")
                        }
                    } else {
                        showToast(msg: StringFile.err_getAddress)
                    }
                }
            }
        }
        
        self.schudleBtn.addAction(for: .tap) {
            print("ISchudleRider:::\(self.isSchudleRide)")
            self.isSchudleRide = "true"
            if self.isRentalRequest{
                let vc = RentalVC.initWithStory()
                vc.pickupAddress = self.fromAddressLBL.text ?? ""
                vc.pickupLoaction = self.pickupLoc
                vc.rentalServiceID = self.rentalid
                vc.TripRoutesrental = self
                vc.date = self.schudleDateStr
                vc.time = self.schudleTimestr
                vc.bookingtype = "rideLater"
                self.navigationController?.pushViewController(vc, animated: true)
            }else{
                if !self.currentAddress.isEmpty{
                    self.navigationController?.isNavigationBarHidden = true
                    let vc = SearchAddressVC.initWithStoryboard()
                    //  vc.pageFrom = "home"
                    vc.serviceDetail = self.vechileList?.VechileListList[self.selectedVCIndex]
                    vc.currentAddress = self.currentAddress
                    vc.currentLocation = self.currentLocation
                    vc.tripRouteDelegate = self
                    vc.RideNowOrLater = self.isSchudleRide
                    //vc.LaterOrNowdelegate = self
                    vc.Sdate = self.schudleDateStr
                    vc.Stime = self.schudleTimestr
                    self.navigationController?.pushViewController(vc, animated: true)
                    
                }else{
                    showToast(msg: StringFile.err_getAddress)
                }
            }
            self.scheduleRideView.isHidden = true
            
        }
        
        self.rideLaterBtn.addAction(for: .tap) {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "dd-MM-yyyy"
            self.seletecdateLbl.text = dateFormatter.string(from: Date())
            
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "hh:mm a"
            timeFormatter.timeZone = TimeZone(identifier: "GMT +5:30")
            
            self.selectedTimeLbl.text = timeFormatter.string(from: Date())
            
            self.isSchudleRide = "true"
            self.scheduleRideView.isHidden = false
        }
        
        self.aproxfareView.addAction(for: .tap) {
            self.AlertView.isHidden = false
            self.priceAlertView.isHidden = false
        }
        
        self.AlertView.addAction(for: .tap) {
            self.AlertView.isHidden = true
        }
        
        self.applycouponView.addAction(for: .tap) {
            self.promoCodeView.initView(view: self.view, promo: {(promo) in
                print("PromoCode",promo)
            })
        }
        
        self.outstationConfirmation.addAction(for: .tap) {
            
            let vc = SearchAddressVC.initWithStoryboard()
            vc.serviceDetail =  self.serviceDetail
            vc.outstationtripType = "outstation"
            vc.currentAddress = self.currentAddress
            vc.currentLocation = self.currentLocation
            vc.tripRouteDelegate = self
            self.navigationController?.pushViewController(vc, animated: true)
        }
        
        self.changeDropBtn.addAction(for: .tap) {
            self.mapView.clear()
            if !self.currentAddress.isEmpty{
                self.confirmBookingView.isHidden = true
                self.AlertView.isHidden = true
                self.outstationalertOutsideView.isHidden = true
                self.priceAlertView.isHidden = true
                
                self.navigationController?.isNavigationBarHidden = true
                let vc = SearchAddressVC.initWithStoryboard()
                vc.serviceDetail =  self.serviceDetail
                
                vc.currentAddress = self.currentAddress
                vc.currentLocation = self.currentLocation
                vc.tripRouteDelegate = self
                self.navigationController?.pushViewController(vc, animated: true)
                
            }else{
                showToast(msg: StringFile.err_getAddress)
            }
        }
        
        self.contnueBtn.addAction(for: .tap) {
            self.confirmBookingView.isHidden = true
            self.AlertView.isHidden = true
            self.outstationalertOutsideView.isHidden = true
            self.priceAlertView.isHidden = true
            
            let vc = OutStationVC.initWithStory()
            vc.TripreqOutsation = self
            vc.pickAddr = self.pickupaddr
            vc.pickupLoc = self.pickupLoc
            vc.dropAddr = self.dropAddr
            vc.dropLoc = self.dropLoc
            vc.currectLocation = self.currentLocation
            self.navigationController?.pushViewController(vc, animated: true)
            
        }
        
        
        
        
        
        
        
        
        self.requestBtn.addAction(for: .tap) {
            if !(self.requestBtn.title(for: .normal) == self.Localize.stringForKey(key: "no_vehicle")) {
                let pickUpCity = self.pickupaddr.components(separatedBy: ",")
                print("pickupCity:::::::", pickUpCity.count, self.pickupaddr)
                print("card number:::::::   \(Constant.profileData.card.last4)")
                if !self.pickupaddr.isEmpty && !self.dropAddr.isEmpty && !self.serviceData._id.isEmpty{
                 /*   if let last4 = Constant.profileData.card.last4 as? String, !last4.isEmpty{
                        let vc = PaymentVC.initWithStory()
                        self.navigationController?.pushViewController(vc, animated: true)
                        
                    }*/
                    self.mapView.settings.myLocationButton = false
                    if let _ : ProfileModel = Constant.profileData as? ProfileModel{
                        
                    self.paymentView.initView(view: self.view, seriveDetail: self.serviceData,pickupLoc: self.pickupLoc,dropLoc: self.dropLoc,pickupCity: self.pickupCity, requestNow: {(requested,requestType) in
                        self.mapView.settings.myLocationButton = true

                        self.paymentView.deInitView(request: "")
                        print("requestType",requestType)
                        self.requestData = requested
                        if requestType == "rideNow"{
                            
                            self.sendRequestView.isHidden = false
                            self.vechileView.isHidden = true
                        }else{
                            
                            self.sendRequestView.isHidden = true
                        }
                        
//                        self.tripView.initView(view: self.view, tripStatus: {(tripstatus) in
//
//                        })
                    }, requestLater: {(requestedLater) in
                        print("RequestedLater",requestedLater)
                    })
                       
//                    }
                    self.subviewCount = 2
                    self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
                    }
                }
            } else {
                showToast(msg: "No Driver Found")
            }
        }
        
        
        
        
        
        
        
        
        
        
        
        self.cashViewBtn.addAction(for: .tap) {
            print("Cashhhhh::::", Constant.profileData.card.last4)
           /* if !Constant.profileData.card.last4.isEmpty{
                self.cashCardOption()
            }else {
                showToast(msg: "Please add your card")
            }*/
        }
        self.promoBtn.addAction(for: .tap) {
            self.promoCodeView.initView(view: self.view, promo: {(promo) in
                print("PromoCode",promo)
            })
        }
        
        self.cancelImg.addAction(for: .tap) {
            if let request : RideRequestModel = self.requestData as? RideRequestModel{
                self.cancelRide(requestId: request.requestDetails)
            }
        }
        self.walletView.addAction(for: .tap) {
            if self.checkimg.image == UIImage(named: "unchecked"){
                self.checkimg.image = UIImage(named: "checked")
            }else{
                self.checkimg.image = UIImage(named: "unchecked")
            }
        }
        
        self.InfoEstimationView.addTap {
            self.infoDismissView.isHidden = false
        }
        
        self.infoDismissView.addTap {
            self.infoDismissView.isHidden = true
        }
    }
    func showalert() {
        let refreshAlert = UIAlertController(title: "", message: "Pleas add your card", preferredStyle: UIAlertController.Style.alert)

                   refreshAlert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { (action: UIAlertAction!) in
                       let vc = PaymentVC.initWithStory()
                       vc.pagefrom = true
                       self.navigationController?.pushViewController(vc, animated: true)
                     
                     }))

                   refreshAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { (action: UIAlertAction!) in
                   //  print("Handle Cancel Logic here")
                     }))

                   self.present(refreshAlert, animated: true, completion: nil)
    }
    func setupLang(){
        
        self.Localize  = Localizations.instance
        
        if let payment : String = UserDefaults.standard.value(forKey: UserDefaultsKey.payment) as? String ?? "" as? String{
            if !payment.isEmpty{
                            self.cashLbl.text = payment
                    }else{
         self.cashLbl.text = Localize.stringForKey(key: "card")
            UserDefaults.standard.set("card", forKey: UserDefaultsKey.payment)
                        
                        }
        }

        
        self.promoLbl.text = Localize.stringForKey(key: "promo")
        self.rideLaterBtn.setTitle(Localize.stringForKey(key: "ride_later"), for: .normal)
        self.Wlletlbl.text = Localize.stringForKey(key: "use_wallet")
    }
    
    @objc func handleTap(sender: UITapGestureRecognizer? = nil) {
        self.cashCardOption()
    }
    
    func cashCardOption(){
        let actionSheet = UIAlertController(title: "Select your payment", message: nil, preferredStyle: .actionSheet)
        actionSheet.view.tintColor = .black
        
//        actionSheet.addAction(UIAlertAction(title: Localize.stringForKey(key: "cash"), style: .default, handler: {(action) in
//            self.cashLbl.text = self.Localize.stringForKey(key: "cash")
//            UserDefaults.standard.set("cash", forKey: UserDefaultsKey.payment)
//        }))
        actionSheet.addAction(UIAlertAction(title: Localize.stringForKey(key: "card"), style: .default, handler: {(action) in
            self.cashLbl.text = self.Localize.stringForKey(key: "Online Payment")
            UserDefaults.standard.set("card", forKey: UserDefaultsKey.payment)
        }))
        actionSheet.addAction(UIAlertAction(title: Localize.stringForKey(key: "cancel"), style: .cancel, handler: {(action) in
            
        }))
        if let popview = actionSheet.popoverPresentationController {
            popview.sourceView = cashView
            popview.sourceRect = cashView.bounds
        }
       
        self.present(actionSheet, animated: true, completion: nil)
    }
    
    func clearView(){
        self.loadView()
        self.focusZoom = 12
        self.selectedVCIndex = 0
        self.currentAddress = ""
        self.subviewCount  = -1
        self.hiddenShowViews  = 1
        
        self.pickupaddr = ""
        self.pickupLoc  = CLLocation()
        self.dropAddr  = ""
        self.dropLoc = CLLocation()
        
        self.polyline = GMSPolyline()
        self.animationPolyline = GMSPolyline()
        self.path = GMSPath()
        self.animationPath = GMSMutablePath()
        self.i = 0
        self.isSchudleRide = "false"
        self.sendRequestView.isHidden = true
        self.tripView.deInitView()
        self.promoCodeView.deInitView()
        self.paymentView.deInitView(request: "")
        self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
        self.mapView.clear()
        self.cornerView.isHidden = true
        self.vechileView.isHidden = true
        self.markPinImage.isHidden = true
        self.tripStatusView.isHidden = true
        self.backView.isHidden = true
        self.viewDidLoad()
        let homeVc = HomeVc.initWithStory()
        let nav = UINavigationController(rootViewController: homeVc)
        nav.navigationBar.isHidden = true
        let menuVc = MenuVC.initWithStory()
        self.rootVc = SideMenuController(contentViewController: nav, menuViewController: menuVc)
        self.appDelegate.window?.rootViewController = self.rootVc
    }
    
    class func initWithStory()->HomeVC {
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "HomeVC") as! HomeVC
        return vc
    }
}

extension HomeVC: DriverProtocol {
   
    
    func driver(withTaxiId id: String, no: String, makeName: String, model: String, color: String) {
        isSelected = true
        print("valuesss:::", makeName, no, model)
        UserDefaults.standard.set(id, forKey: UserDefaultsKey.taxiId)
        var array = [no, makeName, model, color]
        UserDefaults.standard.set(array, forKey: UserDefaultsKey.number)
        print("Valuesss:::", array)
    }
}


//Collection View extension
extension HomeVC : UICollectionViewDelegate , UICollectionViewDataSource{
    
    func setupCVDelegate(){
        self.vehicleCollectionView.delegate = self
        self.vehicleCollectionView.dataSource = self
        
        self.vehicleCollectionView.reloadData()
        self.homeTbl.reloadData()
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        if let count : Int = self.vechileList?.VechileListList.count ?? 0 as? Int{
            return count
        }
        return 0
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "VechileCells", for: indexPath) as! VechileCells
        if let vechileData = self.vechileList?.VechileListList[indexPath.row]{
            cell.vechileName.text = vechileData.type
            cell.etaLbl.text = vechileData.eta
            if vechileData.eta == "NA" || vechileData.eta == "na"{
                cell.LoaderView.aj_showDotLoadingIndicator()
                cell.LoaderView.isHidden = false
            }else{
                cell.LoaderView.aj_hideDotLoadingIndicator()
                cell.LoaderView.isHidden = true
            }
            let urls : String = ServiceApi.Base_Image_URL + vechileData.file
            
           // cell.vechileImage.pin_setImage(from: URL(string: urls))
            let urlkf = URL(string: urls)
            cell.vechileImage.kf.setImage(with: urlkf)
        }
        if selectedVCIndex == indexPath.row{
            if let vechile = self.vechileList?.VechileListList[indexPath.row]{
                self.selectedvehicleName = vechile.type
            }
            self.getDriverLocation(defaultVehicle: self.vechileList?.VechileListList[selectedVCIndex].type.lowercased() ?? "", updateValue: 0, isAvailable: {(available) in
                if available{
                    self.requestBtn.backgroundColor = UIColor.AppColors
                    self.rideLaterBtn.backgroundColor = UIColor.white
                    self.rideLaterBtn.setTitleColor(UIColor.AppColors, for: .normal)
                    self.rideLaterBtn.countmroundeCornorBorder(borderwith: 2, Bordercolor: UIColor.AppColors, bgcolor: UIColor.white)
                    self.requestBtn.setTitle(self.Localize.stringForKey(key: "request_now"), for: .normal)
                }else{
                    
                    self.requestBtn.setTitle(self.Localize.stringForKey(key: "no_vehicle"), for: .normal)
                    self.requestBtn.backgroundColor = UIColor(named: "SelectedVechBG")
                }
            })
            
            cell.vechileView.backgroundColor = UIColor(named: "AppColor")
            cell.vechileImage.tintColor = UIColor.white
            cell.vechileImage.image = cell.vechileImage.image?.imageWithColor(color1: UIColor.white)
            collectionView.scrollToItem(at: indexPath, at: .centeredHorizontally, animated: true)
            collectionView.bringSubviewToFront(cell)
            
            UIView.animate(withDuration: 0.2, delay: 0, usingSpringWithDamping: 5, initialSpringVelocity: 0, options: [], animations: {
                cell.transform = CGAffineTransform(scaleX: 1.2, y: 1.2)
            })
        } else {
            cell.vechileView.backgroundColor = UIColor(named: "VechileBG")
            cell.transform = .identity
        }
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        collectionView.deselectItem(at: indexPath, animated: true)
        _ = collectionView.cellForItem(at: indexPath) as! VechileCells
        self.selectedVCIndex = indexPath.row
        self.vehicleCollectionView.reloadData()
        self.serviceData = self.vechileList?.VechileListList[indexPath.row] ?? VechileListData()
        if let vechile = self.vechileList?.VechileListList[indexPath.row]{
            
            if vechile.type == "Outstation"{
                self.outstationView.isHidden = false
                self.outstationConfirmation.isHidden = false
                self.rideLaterBtn.isHidden = true
                self.requestBtn.isHidden = true
            }else{
                self.outstationView.isHidden = true
                self.outstationConfirmation.isHidden = true
                self.rideLaterBtn.isHidden = false
                self.requestBtn.isHidden = false
                if self.driverMarkers.count > 0{
                    for value in 0...self.driverMarkers.count-1{
                        if value <= self.driverMarkers.count-1{
                            self.driverMarkers[value].map = nil
                            self.driverMarkers.remove(at: value)
                            self.geoLocation.remove(at: value)
                            self.geokey.remove(at: value)
                        }
                    }
                }
                
                self.requestBtn.setTitle(self.Localize.stringForKey(key: "request_now"), for: .normal)
                self.requestBtn.backgroundColor = UIColor(named: "SelectedVechBG")
            }
            
            if vechile.type == "Rental"{
                self.isRentalRequest = true
                self.rentalid = self.vechileList?.VechileListList[indexPath.row]._id ?? ""
            }else{
                self.isRentalRequest = false
            }
        }
    }
    
    func setVechileData(cell : VechileCells , index : Int , vechileData : VechileListData){
        cell.vechileName.text = vechileData.type
        cell.etaLbl.text = vechileData.eta
        let urls : String = ServiceApi.Base_Image_URL+vechileData.file
        let urlkf = URL(string: urls)
        cell.vechileImage.kf.setImage(with: urlkf)
        //cell.vechileImage.pin_setImage(from: URL(string: urls))
    }
}


//Listen Notification centers
extension HomeVC {
    func observeNotification(){
        NotificationCenter.default.addObserver(self, selector: #selector(closeEstimateView(_:)), name: .closeEstimateFare, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(closeTripStatusView(_:)), name: .closeTripStatusView, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(addedEstimateFare(_:)), name: .addedEstimateFare, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(requestData(_:)), name: .requestedView, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(requestSend(_:)), name: .rideRequestSend, object: nil)
    }
    
    @objc func requestSend(_ notification : Notification){
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
    
    @objc func closeTripStatusView(_ notification: Notification)
    {
        self.subviewCount = 0
        self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
    }
}


// Map location Function
extension HomeVC : GMSMapViewDelegate, CLLocationManagerDelegate{
    
    // it enable mapdelegate and location button [163 to 185]
    func setupMapDelegate(){
        
        self.mapView.delegate = self
        self.mapView.isMyLocationEnabled = true
        
        //Enable Location Service in mobile
        if CLLocationManager.locationServicesEnabled() {
            locationManager.requestAlwaysAuthorization()
            locationManager.startUpdatingLocation()
            locationManager.startUpdatingHeading()
        } else {
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
        @unknown default:
            fatalError()
        }
    }
    
    // MARK: Handle location manager errors.
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        locationManager.stopUpdatingLocation()
        print("Error: \(error)")
    }
    
    // MARK: update Location
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        self.currentLocation = locations.last ?? CLLocation()
        print("*****CurrentLocation",self.currentLocation)
        self.MyLocation = locations.first?.coordinate ?? CLLocationCoordinate2D()
        
        // focus to current  location
        self.mapView.camera = GMSCameraPosition(target: self.currentLocation.coordinate, zoom: self.focusZoom, bearing: 0, viewingAngle: 0)
        
        self.getCurrentLocationFromGeoCoder(loc: self.currentLocation) { (address) in
            DispatchQueue.main.asyncAfter(deadline: .now()+1) {
                self.currentAddress = self.gettingLocationAddress
                self.fromAddressLBL.text = "  "+self.gettingLocationAddress
                print("*****Getting_Address" , self.currentAddress)
            }
        }
//        convertLatLangTOAddress(coordinates: self.currentLocation, address: { (address) -> Void in
//                self.currentAddress = address
//                self.fromAddressLBL.text = "  "+address
//                print("*****Getting_Address" , self.currentAddress)
//
//                })
        self.locationManager.stopUpdatingLocation()
    }
    
    func setPolyLineWithMaker(pickupaddr: String, dropaddr: String,pickupLoc : CLLocation , dropLoc : CLLocation , isRideFlowStated : Bool,waypoints : [CLLocation],tripstatus : String){
        
        let origin = "\(pickupLoc.coordinate.latitude),\(pickupLoc.coordinate.longitude)"
        let destination = "\(dropLoc.coordinate.latitude),\(dropLoc.coordinate.longitude)"
        self.iswanttoCallVehicleList = false
        self.stopImage.isHidden = waypoints.isEmpty
        //polylineChange
        
        
        self.isdrawedAcceptedPolyLine = self.tripCurrentStage == .accepted || self.tripCurrentStage == .Arrived
        self.isdrawedStartedPolyLine = self.tripCurrentStage == .started
        print("is drawed polyline::\(self.isdrawedAcceptedPolyLine)")
        
        if self.isdrawedAcceptedPolyLine{
            self.HitOnceAcceptedPolyline = true
        }
        //        if tripstatus == "started"{
        //            self.isdrawedStartedPolyLine = true
        //            if waypoints.count > 0{
        //                self.stopImage.isHidden = false
        //
        //            }else{
        //                self.stopImage.isHidden = true
        //            }
        //        } else {
        //           // onceHitPloyline = false
        //
        //            self.isdrawedStartedPolyLine = false
        //        }
        //
        //        if tripstatus == "accepted"{
        //            self.isdrawedAcceptedPolyLine = true
        //        }else{
        //            self.isdrawedAcceptedPolyLine = false
        //        }
        //        print("ONETIMEEE HITTT ::\(onceHitPloyline)")
        
        var waypointstr = ""
        if waypoints.count > 0 {
            for value in 0...waypoints.count-1{
                if value == waypoints.count - 1{
                    waypointstr += "\(waypoints[value].coordinate.latitude),\(waypoints[value].coordinate.longitude)"
                }else{
                    waypointstr += "\(waypoints[value].coordinate.latitude),\(waypoints[value].coordinate.longitude)"+"|"
                    
                }
            }
            


            
        }
        
        DispatchQueue.main.async {
            print("...DrawPolyline..")
            self.googleVM.getPolylineTimeTravel(origin: origin, destination: destination, waypoints: waypointstr)
        self.googleVM.directionClosure = {
            print("dirdirectionn")
            // self.onceHitPloyline = true
            
            self.hiddenShowViews = 2
            self.subviewCount = 1
            self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
            self.hideShowView()
            
            guard self.googleVM.getDirection != nil else {return}
            
            self.path = GMSPath(fromEncodedPath:  self.googleVM.getDirection?.routes?[0].overviewPolyline?.points ?? "")!
            self.polyline.path = self.path
            self.polyline.strokeColor = UIColor(red: 0, green: 0, blue: 0, alpha: 1)
            self.polyline.strokeWidth = 3.0
            self.polyline.title =  "\(String(describing: self.googleVM.getDirection?.routes?[0].legs?[0].distance?.text))\n\(String(describing: self.googleVM.getDirection?.routes?[0].legs?[0].duration?.text))"
            self.polyline.map = self.mapView
            var bounds = GMSCoordinateBounds()
            for index in 1...self.path.count() {
                bounds = bounds.includingCoordinate(self.path.coordinate(at: index))
            }
            
            self.mapView.animate(with: GMSCameraUpdate.fit(bounds,withPadding: 100))
            let pickupRoadPoin : CLLocation = CLLocation(latitude: Double(self.googleVM.getDirection?.routes?[0].legs?[0].startLocation?.lat ?? 0.0), longitude:  Double(self.googleVM.getDirection?.routes?[0].legs?[0].startLocation?.lng ?? 0.0))
            
            if waypoints.count > 0 {
                self.setupMultipointMarker(waypoint: waypoints)
            }
            
            self.setMaker(pickupaddr: pickupaddr, dropaddr: dropaddr,pickupLoc : pickupRoadPoin ,dropLoc : dropLoc , time :self.googleVM.getDirection?.routes?[0].legs?[0].duration?.text ?? "0 mins" , distance : self.googleVM.getDirection?.routes?[0].legs?[0].distance?.text ?? "0 \(Constant.distanceUnit)" , isRideFlowStated: isRideFlowStated)
        }
        
        self.googleVM.errDirectionClouser = {
            if (self.googleVM.getDirectionError?.status ?? "").isEmpty{
                print("...DrawPolyline22..")
                self.googleVM.getPolylineTimeTravel(origin: origin, destination: destination, waypoints: waypointstr)
                
                
            }else{
                self.hiddenShowViews = 2
                self.subviewCount = 1
                self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
                self.hideShowView()
            }
        }
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
    
    func getCurrentLocationFromGeoCoder(loc: CLLocation, completionHandler: @escaping (String) -> Void) {
        var addressLine = ""

        CLGeocoder().reverseGeocodeLocation(loc) { (placemarks, error) in
            if error != nil {
                print("Reverse geocoder failed with error: " + (error?.localizedDescription)!)
                return
            }

            if placemarks?.count != 0 {
                let pm = placemarks![0]
                print("MYcurrent_Location", pm, placemarks![0])

                if addressLine == "" {
                    if let name = pm.name {
                        addressLine += "\(name),"
                    }
                    if let subLocality = pm.subLocality {
                        addressLine += "\(subLocality),"
                    }
                    if let locality = pm.locality {
                        addressLine += "\(locality),"
                    }
                    if let subAdministrativeArea = pm.subAdministrativeArea {
                        addressLine += "\(subAdministrativeArea),"
                    }
                    if let postalCode = pm.postalCode {
                        addressLine += "\(postalCode),"
                    }
                    if let administrativeArea = pm.administrativeArea {
                        addressLine += "\(administrativeArea),"
                    }
                    if let country = pm.country {
                        addressLine += "\(country)."
                    }

                    print("address: \(addressLine)")
                    
                    self.gettingLocationAddress = addressLine
                    completionHandler(addressLine) // Update the inout parameter
                }
            } else {
                print("Problem with the data received from geocoder")
                completionHandler("")
            }
        }
    }

    
//    func getCurrentLocationFromGeoCoder(loc : CLLocation , address : (String) -> ()){
//
//        var addressLine = ""
//
//        CLGeocoder().reverseGeocodeLocation(loc, completionHandler: {(placemarks, error) -> Void in
//
//            if error != nil {
//                print("Reverse geocoder failed with error" + (error?.localizedDescription)!)
//                return
//            }
//
//            if placemarks?.count != 0 {
//                let pm = placemarks![0]
//                print("MYcurrent_Location",pm,placemarks![0])
//                if  addressLine == ""{
//                    if pm.name != nil{
//                        addressLine = addressLine + "\(String(describing: pm.name!)),"
//                    }
//                    if pm.subLocality != nil{
//                        addressLine = addressLine + "\(String(describing: pm.subLocality!)),"
//                    }
//                    if pm.locality != nil{
//                        addressLine = addressLine + "\(String(describing: pm.locality!)),"
//                    }
//                    if pm.subAdministrativeArea != nil{
//                        addressLine = addressLine + "\(String(describing: pm.subAdministrativeArea!)),"
//                    }
//                    if pm.postalCode != nil{
//                        addressLine = addressLine + "\(String(describing: pm.postalCode!)),"
//                    }
//                    if pm.administrativeArea != nil{
//                        addressLine = addressLine + "\(String(describing: pm.administrativeArea!)),"
//                    }
//                    if pm.country != nil{
//                        addressLine = addressLine + "\(String(describing: pm.country!))."
//                    }
//
//                    print("address:\(addressLine )")
//
//                    self.gettingLocationAddress = addressLine
//                    address = addressLine
//                }
//            }
//            else {
//                print("Problem with the data received from geocoder")
//            }
//        })
//        address(addressLine)
//    }
    
    
    
    func setupMultipointMarker(waypoint : [CLLocation]){
        for value in waypoint{
            let waypointMarker = GMSMarker()
            waypointMarker.icon = UIImage(named: "multistop.png")
            waypointMarker.map = self.mapView
            waypointMarker.isFlat = true
            waypointMarker.position = CLLocationCoordinate2D(latitude: value.coordinate.latitude, longitude: value.coordinate.longitude)
        }
    }
    
    func setMaker(pickupaddr : String , dropaddr : String,pickupLoc : CLLocation , dropLoc : CLLocation ,time : String , distance : String,  isRideFlowStated : Bool){
        let pickupMarker = GMSMarker()
        pickupMarker.icon = UIImage(named: "pickup_marker.png")
        pickupMarker.map = self.mapView
        pickupMarker.isFlat = true
        pickupMarker.position = CLLocationCoordinate2D(latitude: pickupLoc.coordinate.latitude, longitude: pickupLoc.coordinate.longitude)
        
        let dropMarker = GMSMarker()
        dropMarker.icon = UIImage(named: "drop_marker.png")
        dropMarker.map = self.mapView
        dropMarker.isFlat = true
        dropMarker.position = CLLocationCoordinate2D(latitude: dropLoc.coordinate.latitude, longitude: dropLoc.coordinate.longitude)
        
        if !isRideFlowStated{
            self.pickupTagMarker = PickupMarker(location: dropLoc, address: dropaddr, timeDistanc: "\(time)")
            pickupTagMarker.map = self.mapView
            pickupTagMarker.userData = "drop"
            pickupTagMarker.groundAnchor = CGPoint(x: -0.01, y: 1.4)
            
            self.dropTagMarker = DropMarker(location: pickupLoc, address: pickupaddr)
            dropTagMarker.map = self.mapView
            dropTagMarker.userData = "pickup"
            dropTagMarker.groundAnchor = CGPoint(x: -0.01, y: 1.4)
        }
    }
    
    func setDriverLocationMarker(driverLoc : FBOfferLocation){
        if self.selectedvehicleName == "Mini"{
            driverMarker.icon = UIImage(named: "ic_mini.png")
            
        } else if self.selectedvehicleName == "Sedan" {
            driverMarker.icon = UIImage(named: "ic_sedan.png")
            
        } else if self.selectedvehicleName == "SUV" {
            driverMarker.icon = UIImage(named: "ic_suv.png")
            
        } else {
            driverMarker.icon = UIImage(named: "car_maker.png")
        }
        
        driverMarker.map = self.mapView
        driverMarker.isFlat = true
        if driverLoc.l.count>0{
            driverMarker.position = CLLocationCoordinate2D(latitude: driverLoc.l[0], longitude: driverLoc.l[1])
        }
        driverMarker.rotation = driverLoc.bearing
    }
    
    func isMarkerWithinScreen(marker: GMSMarker) -> Bool {
        let region = self.mapView.projection.visibleRegion()
        let bounds = GMSCoordinateBounds(region: region)
        return bounds.contains(marker.position)
    }
    
    func setInfoWindow(pickupaddr : String , dropaddr : String,pickupLoc : CLLocation , dropLoc : CLLocation ,time : String , distance : String ){
        self.pickupInfoWindow = PickupLocView().loadView()
        self.pickupInfoWindow?.layer.backgroundColor = UIColor.white.cgColor
        self.pickupInfoWindow?.layer.cornerRadius = 8
        self.pickupInfoWindow?.center = self.mapView.projection.point(for:CLLocationCoordinate2D(latitude: dropLoc.coordinate.latitude, longitude: dropLoc.coordinate.longitude))
        self.pickupInfoWindow?.center.y -= 100
        self.pickupInfoWindow?.AddrLbl.text = dropaddr
        self.pickupInfoWindow?.travelLbl.text = "\(distance) , \(time)"
        self.pickupInfoWindow?.addAction(for: .tap, Action: {
            print("HELOOO")
        })
        self.mapView.addSubview(self.pickupInfoWindow!)
        
        self.dropInfoWindow = DropLocView().loadView()
        self.dropInfoWindow?.layer.backgroundColor = UIColor.white.cgColor
        self.dropInfoWindow?.layer.cornerRadius = 8
        self.dropInfoWindow?.center = self.mapView.projection.point(for:CLLocationCoordinate2D(latitude: pickupLoc.coordinate.latitude, longitude: pickupLoc.coordinate.longitude))
        self.dropInfoWindow?.center.y -= 100
        self.dropInfoWindow?.addressLbl.text = pickupaddr
        self.dropInfoWindow?.addAction(for: .tap, Action: {
            print("SDSHDLKSD")
        })
        self.mapView.addSubview(self.dropInfoWindow!)
    }
    
    func mapView(_ mapView: GMSMapView, didTap marker: GMSMarker) -> Bool {
        if marker.userData as? String == "pickup"{
            let vc = PinAddressVC.initWithStory()
            vc.tripPinRoute = self
            vc.currentAddress = self.pickupaddr
            vc.currentLocation = self.pickupLoc
            vc.tag = "pickup"
            self.navigationController?.pushViewController(vc, animated: true)
        } else if marker.userData as? String == "drop"{
            let vc = PinAddressVC.initWithStory()
            vc.tripPinRoute = self
            vc.currentAddress = self.dropAddr
            vc.currentLocation = self.dropLoc
            vc.tag = "drop"
            self.navigationController?.pushViewController(vc, animated: true)
        }
        return true
    }
    
    func mapView(_ mapView: GMSMapView, idleAt position: GMSCameraPosition) {
        self.nodriverFoundView.isHidden = true
        let location = CLLocation(latitude: position.target.latitude, longitude: position.target.longitude)
        let tripstart : String =  UserDefaults.standard.value(forKey: UserDefaultsKey.tripwillstart) as? String ?? ""
        print("tripstatussss", tripstart)
        if tripstart == "false" ||  tripstart == ""{
            self.markPinImage.isHidden = false
            self.vechileView.isHidden = false
            if self.iswanttoCallVehicleList{
                // getting current Address
                self.getCurrentLocationFromGeoCoder(loc: location) { (address) in
                    print("addressss::\(address)")
                    DispatchQueue.main.asyncAfter(deadline: .now()+0.5) {
                        self.fromAddressLBL.text = "  "+self.gettingLocationAddress
                        self.currentAddress = "  "+self.gettingLocationAddress
                        self.pickupLoc = location
                        // vehcile api call
                        self.getVechileServiceList(pickupLoc: self.pickupLoc, dropLoc: self.dropLoc)
                    }
                    
                }
//                convertLatLangTOAddress(coordinates: self.currentLocation, address: { (address) -> Void in
//                    self.currentAddress = address
//                    self.fromAddressLBL.text = "  "+address
//                    print("*****Getting_Address" , self.currentAddress)
//                    self.pickupLoc = location
//                    // vehcile api call
//                    self.getVechileServiceList(pickupLoc: self.pickupLoc, dropLoc: self.dropLoc)
////                }
//                })
            }
        }else{
            self.markPinImage.isHidden = true
            self.vechileView.isHidden = true
            
        }
        
        if pickupTagMarker != nil{
            let screenSize: CGRect = UIScreen.main.bounds
            let pickupPoint  = self.mapView.projection.point(for: self.pickupLoc.coordinate)
            let markerWindowSize: CGRect = self.pickupTagMarker.view.bounds
            
            let dropPoint  = self.mapView.projection.point(for: self.dropLoc.coordinate)
            let dropmarkerWindowSize: CGRect = self.dropTagMarker.view.bounds
            
            if (screenSize.width-pickupPoint.x-10) < markerWindowSize.width{
                self.pickupTagMarker.groundAnchor = CGPoint(x: 0.99, y: 1.4)
            }else{
                self.pickupTagMarker.groundAnchor = CGPoint(x: -0.01, y: 1.4)
            }
            
            if (screenSize.width-dropPoint.x-10) < dropmarkerWindowSize.width{
                self.dropTagMarker.groundAnchor = CGPoint(x: 0.99, y: 1.4)
            }else{
                self.dropTagMarker.groundAnchor = CGPoint(x: -0.01, y: 1.4)
            }
        }
    }
}

//APi call
extension HomeVC{
    
    func sosMsg(){
        let alert = UIAlertController(title: "Alert", message: "Are you sure want to send emergencyMsg?" , preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(title: "No", style: UIAlertAction.Style.default, handler: nil))
        alert.addAction(UIAlertAction(title: "Yes", style: UIAlertAction.Style.default, handler: { (alert) in
            let trip_id = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? ""
            self.homevm.sosMsg(view: self.view, trip_id: trip_id)
        }))
        self.present(alert, animated: true, completion: nil)
    }
    
    func sendRideRequest(view: UIView, date: String, paymentType: String, pickupCity: String, bookingtype: String, tripTime: String,utc: String, estimateFare: EstimateFareDetails,isMultiLocation : String ,multiLocation : String, type: RedirectHome, withId: String ,requestResponse : @escaping(RideRequestModel) -> ())
    {
        print("multilocation is:: \(isMultiLocation)")
        print("Myvaluesss::::::", number)
        self.homevm.sendRideRequest(view: self.view, date: date, paymentType: paymentType, pickupCity: pickupCity, bookingtype: bookingtype, tripTime: tripTime, estimateFare: self.fareDetail ?? EstimateFareDetails(), utc: utc, isMultiLocation: isMultiLocation, multiLocation: multiLocation, homeType: type, withId: withId, withNo: number, withName: mName, withMake: modl)
        print("red", redirectHome)
        print("TaxissssId::::", number, mName, modl)
        self.homevm.getRequestClouser = {
            if let requestdata = self.homevm.request{
                print("request::::", requestdata.message)
                if requestdata.message == "Trip request scheduled, we will assign Driver before Trip Time"{
                    showToast(msg: requestdata.message)
                    self.clearView()
                }else{
                    requestResponse(requestdata)
                }
            }
        }
        
        self.homevm.errRequestClouser = {
            if let requestdata = self.homevm.errrequest{
                showToast(msg: requestdata.message)
//                self.clearView()
            }
        }
    }
    
    func getFareDetail( pickupLoc: CLLocation, dropLoc: CLLocation, serviceDetail: VechileListData, pickupCity: String, isMultiLocation : String ,multiLocation : String){
        self.homevm.getextimateFare(view: self.view, pickupLoc: pickupLoc, dropLoc: dropLoc, serviceDetail: serviceDetail, pickupCity: pickupCity, isMultiLocation: ismultpleLocation, multiLocation: self.multilocatonStr)
        self.homevm.getFareClouser = {
            self.fareDetail = self.homevm.fareDetail
            self.confirmBookingView.isHidden = false
            self.AlertView.isHidden = true
            self.cornerView.isHidden = true
            self.setupBookingDetails()
        }
        
        self.homevm.errgetFareClouser = {
            self.serviceDetail = serviceDetail
            
            self.confirmBookingView.isHidden = true
            self.AlertView.isHidden = false
            self.outstationalertOutsideView.isHidden = false
            self.priceAlertView.isHidden = true
        }
    }
    
    func setupBookingDetails(){
        if let fare = self.fareDetail{
            let urls : String = ServiceApi.Base_Image_URL+fare.vehicleDetailsAndFare.vehicleDetails.image
            //self.bookingehicleImage.pin_setImage(from: URL(string: urls))
            let urlkf = URL(string: urls)
            self.bookingehicleImage.kf.setImage(with: urlkf)
            self.appxFareLbl.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.totalFare)"
            self.vehiclenameLnl.text = fare.vehicleDetailsAndFare.vehicleDetails.type
            self.priceLbl.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.totalFare )"
            self.kmpriceLbl.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.perKMRate )/\(Constant.distanceUnit)"
            self.DistanceVall.text = "\(fare.vehicleDetailsAndFare.fareDetails.distance ) \(Constant.distanceUnit)"
            self.TimeValinAporx.text = "\(fare.vehicleDetailsAndFare.fareDetails.travelTime)" + " " + "Min"
            
            self.Ridefareval.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.kMFare)"
            self.BasefareVal.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.baseFare)"
            self.BookingFareVal.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.bookingFare)"
            self.TimeFareVal.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.travelFare)"
            self.PickupChargeVal.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.pickupCharge)"
            self.TaxfeeVal.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.tax)"
            self.NightChargeVal.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.surgeAmt)"
            self.CancelVall.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.cancelationFeesRider)"
            self.SubtotalVal.text = Constant.priceTag + "\(fare.vehicleDetailsAndFare.fareDetails.totalFare)"
            
        }
    }
    
    func getWalletMoney(){
        self.paymentvm.getMyWallet(view: self.view)
    }
    
    func getVechileServiceList(pickupLoc: CLLocation, dropLoc: CLLocation){
        print("Content:::::", pickupLoc,   "+++++", dropLoc)
        self.vechileView.isHidden = true
        self.homevm.getVechileList(view: UIView(), pickupLoc: pickupLoc, dropLoc: dropLoc)
        
        self.homevm.errgetVechileClosure = {
            self.nodriverFoundView.isHidden = false
            self.vechileView.isHidden = true
            self.markPinImage.isHidden = true
            self.contactTobook = self.homevm.errVechileservice?.phone ?? ""
        }
        
        self.homevm.getVechileClosure = {
            self.nodriverFoundView.isHidden = true
            self.vechileView.isHidden = false
            self.markPinImage.isHidden = false
            self.vechileView.isHidden = false
            self.vechileList = self.homevm.vechileservice
            print("asdhasdgasfdghasd\(self.vechileList?.VechileListList)")
            if self.vechileList?.VechileListList.isEmpty ?? false {
                print("No data")
            } else {
                self.serviceData = self.vechileList?.VechileListList[0] ?? VechileListData()
                print("datass::::", self.serviceData)
            }
           
        }
    }
    
    func cancelRide(requestId : String){
        
        self.homevm.cancelRide(view: self.view, requestid: requestId)
        
        self.homevm.getcancelClouser = {
            self.sendRequestView.isHidden = true
            self.requestData = RideRequestModel()
            //self.clearView()
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverid)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverVehcile)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripid)
            UserDefaults.standard.set("false", forKey: UserDefaultsKey.tripwillstart)
//            let homeVc = HomeVC.initWithStory()
//            self.navigationController?.pushViewController(homeVc, animated: true)
            //            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
            //            self.appDelegate.window?.rootViewController = MenuRoot
            let homeVc = HomeVc.initWithStory()
            let nav = UINavigationController(rootViewController: homeVc)
            nav.navigationBar.isHidden = true
            let menuVc = MenuVC.initWithStory()
            self.appDelegate.window?.rootViewController = SideMenuController(contentViewController: nav, menuViewController: menuVc)
        }
        
        self.homevm.errcancelClouser = {
            self.sendRequestView.isHidden = true
            self.requestData = RideRequestModel()
            //self.clearView()
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverid)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverVehcile)
            UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripid)
            //
            UserDefaults.standard.set("false", forKey: UserDefaultsKey.tripwillstart)
            //            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
            //            self.appDelegate.window?.rootViewController = MenuRoot
        }
    }
    
    func cancelCurrentTrip(tripID : String){
        self.homevm.cancelCurrentTrip(view: self.view, tripId: tripID)
        self.homevm.getcancelTripClouser = {
            self.sendRequestView.isHidden = true
            self.requestData = RideRequestModel()
            self.updateCancelTripSttaus(status: "5")
//            let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVc.initWithStory()))
//            self.appDelegate.window?.rootViewController = MenuRoot
            let homeVc = HomeVc.initWithStory()
            let nav = UINavigationController(rootViewController: homeVc)
            nav.navigationBar.isHidden = true
            let menuVc = MenuVC.initWithStory()
            self.appDelegate.window?.rootViewController = SideMenuController(contentViewController: nav, menuViewController: menuVc)
        }
        
        self.homevm.errcancelTripClouser = {
            self.sendRequestView.isHidden = true
        }
    }
    
    func tripDriverDetails(tripID : String,tripstatus : String,fbriderstatus : FBRiderDataModel,tripType : String){
        self.tripView.deInitView()
        self.homevm.tripDriverDetails(view: self.view, tripId: tripID)
        self.homevm.getRideDetailClouser = {
            if let rideDetails : RideDetailModel = self.homevm.rideDetails{
                let driverVehicle : String = rideDetails.serviceType as? String ?? ""
                if !driverVehicle.isEmpty{
                    UserDefaults.standard.set(driverVehicle, forKey: UserDefaultsKey.driverVehcile)
                }
                //self.mapView.clear()
                self.driverMarker = GMSMarker()
                if fbriderstatus.triptype == "rental"{
                    self.sourceAddrView.isHidden = true
                    self.designationView.isHidden = true
                }else{
                    self.sourceAddrView.isHidden = false
                    self.designationView.isHidden = false
                    self.listenDriverLocationForPolyline(tripstatus : tripstatus,rideDetails: rideDetails)
                }
                //18/nov
               //self.tripView.initView(view: self.view, driverDetail: rideDetails, rideStatus: tripstatus, //call: { (call) in
                self.tripView.initView(view: self.view, driverDetail: rideDetails, rideStatus: self.tripCurrentStage.rawValue, call: { (call) in
//                    if let url = URL(string: "tel://\(call)"), UIApplication.shared.canOpenURL(url) {
//                        if #available(iOS 10, *) {
//                            UIApplication.shared.open(url)
//                        } else {
//                            UIApplication.shared.openURL(url)
//                        }
//                    }
                    print("driver token:: \(rideDetails)")
                    let vc = VideoCallVC.initWithStory()
                    print("driverfcmhomepage::\(self.FBtripstatus?.driver_token), and :: \(self.tripFBStatus.driver_token)")
                    vc.driverfcm = self.tripFBStatus.driver_token
                    vc.drivername = rideDetails.DriverProfile.fname
                    vc.driverpic = rideDetails.DriverProfile.profileurl
                    self.Driver_name = rideDetails.DriverProfile.fname
                    self.Driver_profile = rideDetails.DriverProfile.profileurl
                    vc.firebaseNotiifcation(message: "Your Rider inviting you to join call", fcm: self.tripFBStatus.driver_token)
                    self.navigationController?.pushViewController(vc, animated: true)
                    
                }, message: { (message) in
                    let vc = ChatVC.initWithStory()
                    vc.name = rideDetails.DriverProfile.fname
                    vc.fcm = self.tripFBStatus.driver_token
                    vc.modalPresentationStyle = .fullScreen
                    self.navigationController?.present(vc, animated: true, completion: nil)
                }, cancel: { (canel) in
                    let alert = UIAlertController(title:self.Localize.stringForKey(key: "caceltitle") , message: self.Localize.stringForKey(key: "cancel_content"), preferredStyle: UIAlertController.Style.alert)
                    alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "no"), style: UIAlertAction.Style.default, handler: nil))
                    alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "yes"), style: UIAlertAction.Style.default, handler: { (alert) in
                        self.cancelCurrentTrip(tripID: fbriderstatus.current_tripid.description)
                    }))
                    self.present(alert, animated: true, completion: nil)
                    
                }, share: { (share) in
                    var sharptriplink = ServiceApi.Base_Image_URL + "public/shareTrip/locater.html?tripId="
                    var riderName = Constant.profileData.fname
                    var fullLink = sharptriplink + tripID
                    print("sharing trip link:\(sharptriplink)")
                    let text : String = "Sooffer \(riderName)'s Trip Share link : \(fullLink)"
                    print("text to sharelink:\(text)")
                    let vc = UIActivityViewController(activityItems: [text], applicationActivities: nil)
                    vc.excludedActivityTypes = [.print, .copyToPasteboard, .assignToContact, .saveToCameraRoll, .airDrop]
                    vc.popoverPresentationController?.sourceView = self.tripView.shareView
                    DispatchQueue.main.async {
                        self.present(vc, animated: true, completion: nil);
                    }
                })
            }
        }
        
        self.homevm.errRideDetailClouser = {
            if (self.homevm.errrideDetails?.message ?? "").isEmpty{
                self.homevm.tripDriverDetails(view: self.view, tripId: tripID)
            }else{
                self.sendRequestView.isHidden = true
                self.requestData = RideRequestModel()
                self.clearView()
            }
        }
    }
}

//Firebase Flow
extension HomeVC{
    
    func logout(){
        let token : String =  Constant.fcm_id
        print("Token of Rider:::\(token)")
        FireBaseconnection.instanse.forceLogout(token: token) { (logout) in
            if logout{
                let domain = Bundle.main.bundleIdentifier!
                UserDefaults.standard.removePersistentDomain(forName: domain)
                UserDefaults.standard.synchronize()
                
                let navigation = UINavigationController(rootViewController: LauncherVC.initWithStoryBoard())
                self.appDelegate.window?.rootViewController = navigation
            }
        }
    }
    
    
    func getFBRiderData(){
        self.FBCONNECT.getRideFlow { (riderdata) in
            if let fbriderstatus : FBRiderDataModel = riderdata as? FBRiderDataModel{
                switch riderdata.tripstatus{
                case "Processing":
                    UserDefaults.standard.set("true", forKey: UserDefaultsKey.tripwillstart)
                    self.tripCurrentStage = .process
                    self.sendRequestView.isHidden = false
                    self.vechileView.isHidden = true
                    self.markPinImage.isHidden = true
                    break
                case "No Driver Found":
                    UserDefaults.standard.set("false", forKey: UserDefaultsKey.tripwillstart)
                    self.sendRequestView.isHidden = true
                    self.vechileView.isHidden = false
                    self.markPinImage.isHidden = false
                    self.tripCurrentStage = .noDriver
                    if  fbriderstatus.triptype == "rental" || fbriderstatus.triptype == "outstation"{
                    }else{
                        self.FBCONNECT.cancelReason(cancelReason: { (cancelReason) in
                            let alert = UIAlertController(title: self.Localize.stringForKey(key: "alert"), message: cancelReason.alertLabels.DRIVER_NOT_FOUND , preferredStyle: UIAlertController.Style.alert)
                            alert.addAction(UIAlertAction(title: self.Localize.stringForKey(key: "ok"), style: UIAlertAction.Style.default, handler: {(action) in
                                self.sendRequestView.isHidden = true
                                
                            }))
                            self.present(alert, animated: true, completion: nil)
                        })
                    }
                    self.FBCONNECT.clearRiderData()
                    self.clearView()
                    self.mapView.padding = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
                    break
                case "Accepted":
                    UserDefaults.standard.set("true", forKey: UserDefaultsKey.tripwillstart)
                    self.sendRequestView.isHidden = true
                    let tripID : String = (fbriderstatus.current_tripid).description
                    UserDefaults.standard.set(tripID, forKey: UserDefaultsKey.tripid)
                    UserDefaults.standard.set(fbriderstatus.tripdriver, forKey: UserDefaultsKey.driverid)
                    self.FBCONNECT.updateFCMToken { (done) in
                        print("Token_Updated")
                    }
                    self.TRIP_CUR_STATE = "Accepted"
                    self.TRIP_CUR_STATE = "Accepted"
                  //  self.tripCurrentStage = .accepted
                    self.tripDriverDetails(tripID: tripID,tripstatus : "Accepted",fbriderstatus: fbriderstatus,tripType: "")
                    self.tripStatusView.isHidden = false
//                    self.sosImg.isHidden = false
                    self.tripStatusLbl.text = "Driver Has Accepted Your Trip Request"
                    self.hiddenShowViews = 3
                    self.hideShowView()
                 /*   self.ListenTripStatus()*/
                    if !self.Listen_Trip_Status{
                        self.ListenTripStatus()
                    }
                    break
                case "Cancelled","Canceled":
                    UserDefaults.standard.set("false", forKey: UserDefaultsKey.tripwillstart)
                    self.FBCONNECT.clearRiderData()
                    self.tripCurrentStage = .canceled
                    self.HitOnceAcceptedPolyline = false
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverid)
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverVehcile)
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripid)
                    self.clearView()
                    self.viewDidLoad()
                    break
             /*   case "Canceled":
                    UserDefaults.standard.set("false", forKey: UserDefaultsKey.tripwillstart)
                    self.FBCONNECT.clearRiderData()
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverid)
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverVehcile)
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripid)
                    self.clearView()
                    self.viewDidLoad()
                    break*/
                default :
                    break
                }
            }
        }
    }
    
    func updateCancelTripSttaus(status : String){
        self.FBCONNECT.updateCancelTripstatus(status: status)
    }
    
 /*   func listenDriverLocation(){
        self.FBCONNECT.listenDriverLocation(driverlocation: {(driverLocation) in
            self.setDriverLocationMarker(driverLoc: driverLocation)
        })
    }*/
    
    func listenDriverLocationForPolyline(tripstatus : String,rideDetails : RideDetailModel){
        var driverLoc : CLLocation = CLLocation()
        var endLoc : CLLocation = CLLocation()
        self.FBCONNECT.listenDriverLocation(driverlocation: {(driverLocation) in
            self.setDriverLocationMarker(driverLoc: driverLocation)
            if driverLocation.l.count > 0 {
                driverLoc = CLLocation(latitude: driverLocation.l[0], longitude: driverLocation.l[1] )
            }
            
            let startLoc : CLLocation = CLLocation(latitude: CLLocationDegrees(rideDetails.pickupdetails.startcoords[1] ), longitude: CLLocationDegrees(rideDetails.pickupdetails.startcoords[0]))
            if rideDetails.pickupdetails.endcoords.count > 0{
                endLoc = CLLocation(latitude: CLLocationDegrees(rideDetails.pickupdetails.endcoords[1]), longitude: CLLocationDegrees(rideDetails.pickupdetails.endcoords[0] ))
            }
            print("TRIPSTATSss",tripstatus)
            self.sourceAddrssLbl.text = rideDetails.pickupdetails.start
            self.designLbl.text = rideDetails.pickupdetails.end
            
            var mulitway : [CLLocation] = []
            if rideDetails.mulitiLocation.count > 2 {
                if rideDetails.mulitiLocation.count == 3 {
                    mulitway.append(CLLocation(latitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[1].doubleLat) ?? 0.0), longitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[1].doubleLng) ?? 0.0)))
                }else if rideDetails.mulitiLocation.count == 4 {
                    mulitway.append(CLLocation(latitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[1].doubleLat) ?? 0.0), longitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[1].doubleLng) ?? 0.0)))
                    mulitway.append(CLLocation(latitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[2].doubleLat) ?? 0.0), longitude: CLLocationDegrees(Double(rideDetails.mulitiLocation[2].doubleLng) ?? 0.0)))
                }
            }
            
            if self.tripCurrentStage == .accepted/*tripstatus == "Accepted"*/ {
                if !self.isdrawedAcceptedPolyLine{
                    if !self.HitOnceAcceptedPolyline{
                        self.mapView.clear()
                        print("sets 12")
                        self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: startLoc, isRideFlowStated: true,waypoints: [], tripstatus: "accepted")
                    }
               
                }
            } else if self.tripCurrentStage == .started/*tripstatus == "started"*/ {
                if !self.isdrawedStartedPolyLine{
                    self.mapView.clear()
                    self.mulitiLocationAddress = rideDetails.mulitiLocation
                    
                    self.addressList.reloadData()
                    print("sets 13")
                            self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: endLoc, isRideFlowStated: true,waypoints: mulitway, tripstatus: "started")
          
                }
            } else if self.tripCurrentStage == .Arrived{
                if !self.isdrawedAcceptedPolyLine{
                    self.mapView.clear()
                    print("sets 14")
                    self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: startLoc, isRideFlowStated: true,waypoints: [], tripstatus: "accepted")
                }
            }else {
            
                    self.mapView.clear()
                    print("sets 15")
                   // self.setPolyLineWithMaker(pickupaddr: "", dropaddr: "", pickupLoc: driverLoc, dropLoc: startLoc, isRideFlowStated: true,waypoints: [], tripstatus: "")
             
            }
        })
    }
    
    func ListenTripStatus(){
        
        self.FBCONNECT.getTripData { (tripDatas) in
            if let fbtripDatas : FBTripDataModel = tripDatas as? FBTripDataModel{
                self.Listen_Trip_Status = true
                self.tripFBStatus = tripDatas
                print("driver _token:: \(self.tripFBStatus.driver_token)")
                switch fbtripDatas.status{
                case "1":
                    self.tripStatusView.isHidden = false
//                    self.sosImg.isHidden = false
                    self.tripStatusLbl.text = "Driver Has Accepted Your Trip Request"
                    self.tripCurrentStage = .accepted
                    UserDefaults.standard.set("true", forKey: UserDefaultsKey.tripwillstart)
                    
                   /* self.listenDriverLocation() */
                    self.checkSOSEnable()
                    break
                case "2":
                    UserDefaults.standard.set("true", forKey: UserDefaultsKey.tripwillstart)
                    self.tripStatusView.isHidden = false
//                    self.sosImg.isHidden = false
                    self.tripStatusLbl.text = "Driver Has Arrived your Location"
                    self.tripCurrentStage = .Arrived
                  /*  self.listenDriverLocation() */
                    self.TRIP_CUR_STATE = "arrive"
                    let tripID : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? ""
                    self.FBCONNECT.getRideFlow { (riderdata) in
                        if let fbriderstatus : FBRiderDataModel = riderdata as? FBRiderDataModel{
                            self.tripDriverDetails(tripID: tripID,tripstatus : "arrive",fbriderstatus: fbriderstatus,tripType: fbtripDatas.triptype)
                        }
                    }
                    self.checkSOSEnable()
                    break
                case "3":
                    UserDefaults.standard.set("true", forKey: UserDefaultsKey.tripwillstart)
                    self.tripStatusView.isHidden = false
//                    self.sosImg.isHidden = false
                    self.tripStatusLbl.text = "Your Trip has started"
                    let tripID : String = UserDefaults.standard.value(forKey: UserDefaultsKey.tripid) as? String ?? ""
                    //self.listenDriverLocation()
                    self.vechileView.isHidden = true
                    self.markPinImage.isHidden = true
                    self.TRIP_CUR_STATE = "started"
                    self.tripCurrentStage = .started
                    self.FBCONNECT.getFlowRideChildValue{ rider_data in
                        if let fbRider = rider_data{
                            self.tripDriverDetails(tripID: tripID,tripstatus: OnGoingTrip.started.value/*"arrive"*/,fbriderstatus: fbRider,tripType: tripDatas.triptype)
                        }
                    }
                /*    self.FBCONNECT.getRideFlow { (riderdata) in
                        if let fbriderstatus : FBRiderDataModel = riderdata as? FBRiderDataModel{
                            self.tripDriverDetails(tripID: tripID,tripstatus : "started",fbriderstatus: fbriderstatus,tripType: fbtripDatas.triptype)
                        }
                    } */
                    self.checkSOSEnable()
                    break
                case "4":
                    self.tripStatusView.isHidden = true
                    self.vechileView.isHidden = true
                    self.markPinImage.isHidden = true
                    self.mapView.clear()
                    self.tripView.removeFromSuperview()
                    self.tripView.isHidden = true
                    self.hiddenShowViews = 1
                    self.subviewCount = 0
                    self.mapPadding(addBottom: 0.0, reduceBottom: 0.0)
                    self.hideShowView()
                    self.HitOnceAcceptedPolyline = false
                    self.TRIP_CUR_STATE = String()
                    UserDefaults.standard.set("false", forKey: UserDefaultsKey.tripwillstart)
                    let vc = InvoiceVC.initWithStory()
                    vc.triproute  = self
                    vc.modalPresentationStyle = .fullScreen
                    self.navigationController?.present(vc, animated: true, completion: nil)
                    self.sosImg.isHidden = true
                    
                    break
                case "5":
                    UserDefaults.standard.set("false", forKey: UserDefaultsKey.tripwillstart)
                    self.FBCONNECT.clearRiderData()
                    self.TRIP_CUR_STATE = String()
                    self.tripCurrentStage = .canceled
                    self.vechileView.isHidden = true
                    self.markPinImage.isHidden = true
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverid)
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.driverVehcile)
                    UserDefaults.standard.set(nil, forKey: UserDefaultsKey.tripid)
                    //                    self.clearView()
                    //                    self.viewDidLoad()
//                    let MenuRoot = SWRevealViewController(rearViewController: MenuVC.initWithStory(), frontViewController: UINavigationController(rootViewController: HomeVC.initWithStory()))
//                    self.appDelegate.window?.rootViewController = MenuRoot
                    
                    let homeVc = HomeVc.initWithStory()
                    let nav = UINavigationController(rootViewController: homeVc)
                    nav.navigationBar.isHidden = true
                    let menuVc = MenuVC.initWithStory()
                    self.appDelegate.window?.rootViewController = SideMenuController(contentViewController: nav, menuViewController: menuVc)
                    
                    self.sosImg.isHidden = true
                    
                    
                    break
                default :
                    break
                }
                
                if fbtripDatas.triptype == "rental"{
                    self.sourceAddrView.isHidden = true
                    self.designationView.isHidden = true
                    self.mapView.clear()
                }else{
                    self.sourceAddrView.isHidden = false
                    self.designationView.isHidden = false
                }
            }
        }
    }
}

//View clouser actions
extension HomeVC{
    func clouserCall(){
        self.ConfirmBooking.confirmBooking = {
            self.ConfirmBooking.belowSeprateView.backgroundColor = .red
        }
    }
}


extension HomeVC{
    func getDriverLocation(defaultVehicle : String , updateValue : Int , isAvailable : @escaping(Bool)->()){
        var data = updateValue
        let geofireRef = Database.database().reference().child("drivers_location").child(defaultVehicle)
        print("geofilrrefff",geofireRef)
        let geoFire = GeoFire(firebaseRef: geofireRef)
        print("geofiree",geoFire)
        
        let center = CLLocation(latitude:self.currentLocation.coordinate.latitude, longitude: self.currentLocation.coordinate.longitude)
        var circleQuery = geoFire.query(at: center, withRadius: 10.0)
        
        circleQuery.observe(.keyEntered, with: { (key, location) in
            print("ƒƒƒƒƒKey'\(key)' in area at location '\(location)'")
            data = 1
            self.setNearbyDriverLocationMarker(key: key, driverLoc: location)
        })
        
        DispatchQueue.main.asyncAfter(deadline: .now()) {
            if data == 0{
                if self.driverMarkers.count > 0{
                    for value in 0...self.driverMarkers.count-1{
                        if value <= self.driverMarkers.count-1{
                            self.driverMarkers[value].map = nil
                            self.driverMarkers.remove(at: value)
                            self.geoLocation.remove(at: value)
                            self.geokey.remove(at: value)
                        }
                    }
                }
                
            }
        }
        DispatchQueue.main.asyncAfter(wallDeadline: .now()+0.5) {
            if self.driverMarkers.count > 0{
                isAvailable(true)
            }else{
                isAvailable(false)
            }
        }
    }
    
    func setNearbyDriverLocationMarker(key : String ,driverLoc : CLLocation){
        var changeINT : Int = -1
        if self.geokey.count > 0{
            for value in 0...self.geokey.count-1{
                if self.geokey.contains(key){
                    let index : Int = self.geokey.index(of: key) ?? -1
                    self.geoLocation.remove(at: index)
                    changeINT = index
                    self.geoLocation.insert(driverLoc, at: index)
                    let marker = GMSMarker()
                    if self.selectedvehicleName == "Mini"{
                        marker.icon = UIImage(named: "ic_mini.png")
                    }else if self.selectedvehicleName == "Sedan"{
                        marker.icon = UIImage(named: "ic_sedan.png")
                    }else if self.selectedvehicleName == "SUV"{
                        marker.icon = UIImage(named: "ic_suv.png")
                    }else{
                        marker.icon = UIImage(named: "car_maker.png")
                    }
                    marker.title = key
                    marker.isFlat = true
                    marker.position = CLLocationCoordinate2D(latitude: driverLoc.coordinate.latitude, longitude: driverLoc.coordinate.longitude)
                    
                    for value in self.driverMarkers{
                        if (value.title ?? "") == self.geokey[index]{
                            value.position = CLLocationCoordinate2D(latitude: driverLoc.coordinate.latitude, longitude: driverLoc.coordinate.longitude)
                            self.driverMarkers[index].position = CLLocationCoordinate2D(latitude: driverLoc.coordinate.latitude, longitude: driverLoc.coordinate.longitude)
                        }
                    }
                }else{
                    self.geokey.append(key)
                    self.geoLocation.append(driverLoc)
                    let marker = GMSMarker()
                    if self.selectedvehicleName == "Mini"{
                        marker.icon = UIImage(named: "ic_mini.png")
                    }else if self.selectedvehicleName == "Sedan"{
                        marker.icon = UIImage(named: "ic_sedan.png")
                    }else if self.selectedvehicleName == "SUV"{
                        marker.icon = UIImage(named: "ic_suv.png")
                    }else{
                        marker.icon = UIImage(named: "car_maker.png")
                    }
                    marker.title = key
                    marker.isFlat = true
                    marker.position = CLLocationCoordinate2D(latitude: driverLoc.coordinate.latitude, longitude: driverLoc.coordinate.longitude)
                    self.driverMarkers.append(marker)
                    marker.map = mapView
                }
            }
        }else{
            self.geokey.append(key)
            self.geoLocation.append(driverLoc)
            let marker = GMSMarker()
            if self.selectedvehicleName == "Mini"{
                marker.icon = UIImage(named: "ic_mini.png")
                
            }else if self.selectedvehicleName == "Sedan"{
                marker.icon = UIImage(named: "ic_sedan.png")
                
            }else if self.selectedvehicleName == "SUV"{
                marker.icon = UIImage(named: "ic_suv.png")
                
            }else{
                marker.icon = UIImage(named: "car_maker.png")
                
            }
            marker.title = key
            marker.isFlat = true
            marker.position = CLLocationCoordinate2D(latitude: driverLoc.coordinate.latitude, longitude: driverLoc.coordinate.longitude)
            self.driverMarkers.append(marker)
            marker.map = mapView
        }
        print("selfasdasd",self.geoLocation.count , self.geokey)
    }
    
    func setArrayMarker(changeMarker : [GMSMarker],indexToChange : Int){
        for value in changeMarker{
            if indexToChange >= 0{
                if (value.title ?? "") == self.geokey[indexToChange]{
                    value.position = CLLocationCoordinate2D(latitude: self.geoLocation[indexToChange].coordinate.latitude, longitude: self.geoLocation[indexToChange].coordinate.longitude)
                }
            }
        }
    }
}


extension HomeVC : UITableViewDelegate , UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if tableView == homeTbl {
            
            let vechicle = vechileList?.VechileListList ?? [VechileListData]()
            if vechicle.isEmpty {
                homeTbl.isHidden = true
                nodataImg.isHidden = false
            } else {
                homeTbl.isHidden = false
                nodataImg.isHidden = true
            }
            if let count : Int = self.vechileList?.VechileListList.count ?? 0 as? Int{
                print("valuuesss::::", count)
                return count
            }
            
            return 0
        } else {
            if let count : Int =  self.mulitiLocationAddress.count as? Int{
                return count
            }
            return 0
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if tableView == homeTbl {
            let cell = tableView.dequeueReusableCell(withIdentifier: "HomeVechListVc", for: indexPath) as! HomeVechListVc
            if let vechileData = self.vechileList?.VechileListList[indexPath.row]{
                cell.vechicleNameLbl.text = vechileData.type
                cell.seatLbl.text = "Seats:  " + vechileData.seats.description
                cell.seatNamelbl.text = vechileData.eta
                let urls : String = ServiceApi.Base_Image_URL + vechileData.file
                //cell.vechImg.pin_setImage(from: URL(string: urls))
                let urlkf = URL(string: urls)
                cell.vechImg.kf.setImage(with: urlkf)
            }
            return cell
        } else {
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
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if tableView == homeTbl {
            setViews(index: indexPath)
            let vechile = self.vechileList?.VechileListList[indexPath.row] ?? VechileListData()
            print("valuesss::::", vechile)
            if vechile.type == "Rental"{
                self.isRentalRequest = true
                self.rentalid = self.vechileList?.VechileListList[indexPath.row]._id ?? ""
            }else{
                self.isRentalRequest = false
            }
        }
        arrayIndex = indexPath.row
    }
    
    func setupTableview(){
        self.addressList.delegate = self
        self.addressList.dataSource = self
        self.addressList.reloadData()
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
extension Notification.Name {
    static let pushnotify = Notification.Name("pushnotify")
}

enum OnGoingTrip:String{
    case process = "Processing"
    case noDriver = "No Driver Found"
    case accepted = "Accepted"
    case canceled = "Cancelled"
    case started = "Started"
    case Arrived = "arrived"
    case ended = "Ended"
    var value : String{
        return self.rawValue
    }
}




