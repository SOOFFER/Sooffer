//
//  YourTripsVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class YourTripsVC: UIViewController {
    
    //UIDecalaraction
    
    @IBOutlet weak var segment: UISegmentedControl!
    
    @IBOutlet weak var tripsTabelView: UITableView!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate

    var selectedIndex: Int = 0
    var tripVM = YourTripsVM()
    var pastTripList : TripModel?
    var upcomingTripList : UpcomingTripModel?
    var date : String = String()
    var pageFrom : String = "menu"  //menu , earnings
    
    @IBAction func selectedSegment(_ sender: UISegmentedControl) {
        selectedIndex = sender.selectedSegmentIndex
        
        if selectedIndex == 0{
            getPastRideApi(data: "")
        }
        if selectedIndex == 1{
//            self.tripVM.getUpcomingTrip(view: self.view)
            getUpcomingRideApi(data: "")
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
        if selectedIndex == 0{
             if pageFrom == "earnings"{
                getPastRideApi(data: self.date)
             }else{
                getPastRideApi(data: "")
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
        self.tripVM = YourTripsVM(view: self.view, dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
    }
    
    func setupView(){
        if pageFrom == "earnings"{
            self.title = Localize.stringForKey(key: "your_trips")
            self.segment.isHidden = true
        }else{
            self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "your_trips"))
            self.segment.isHidden = false
        }
        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
        self.revealViewController().rearViewRevealWidth = 220
        
        self.tripsTabelView.register(UINib(nibName: "PasttripCell", bundle: nil), forCellReuseIdentifier: "PasttripCell")
        self.tripsTabelView.register(UINib(nibName: "UpcomingTripCell", bundle: nil), forCellReuseIdentifier: "UpcomingTripCell")
        self.tripsTabelView.delegate = self
        self.tripsTabelView.dataSource = self
        self.tripsTabelView.reloadData()
    }
    
    func setupAction(){
        
    }
    func setupLang(){
        
    }

    class func initWithStory()->YourTripsVC{
        let vc = UIStoryboard.init(name: "YourTrips", bundle: Bundle.main).instantiateViewController(withIdentifier: "YourTripsVC") as! YourTripsVC
        return vc
    }

}

extension YourTripsVC : UITableViewDataSource,UITableViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if selectedIndex == 0{
            if let triplist : Int = self.pastTripList?.tripList.count{
                if triplist > 0{
                    ShowMsginWindow.instanse.hideNodataView()
                    return triplist
                }else{
                    ShowMsginWindow.instanse.nodataView(view: self.view)
                }
            }
        }else if selectedIndex == 1{
            if let triplist : Int = self.upcomingTripList?.tripList.count{
                if triplist > 0{
                    ShowMsginWindow.instanse.hideNodataView()
                    return triplist
                }else{
                    ShowMsginWindow.instanse.nodataView(view: self.view)
                }
            }
        }
        ShowMsginWindow.instanse.nodataView(view: self.view)
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell
    {
        if selectedIndex == 0{
            let cell = tableView.dequeueReusableCell(withIdentifier: "PasttripCell", for: indexPath) as! PasttripCell
            if let pastTrip : TripData = self.pastTripList?.tripList[indexPath.row]{
                cell.tripDate.text = pastTrip.date
                cell.bookIdLbl.text = "Book ID: "+pastTrip.tripno.description
                cell.priceLbl.text = Constant.priceTag+pastTrip.fare
                cell.statusLbl.text = pastTrip.status
                
                if pastTrip.status == "Finished"{
                    cell.sourceAddrLbl.text = pastTrip.adsp.from
                    cell.designationLbl.text = pastTrip.adsp.to
                }else if pastTrip.status == "canceled"{
                    cell.sourceAddrLbl.text = pastTrip.dsp.start
                    cell.designationLbl.text = pastTrip.dsp.end
                }
                
//                if pastTrip.triptype == "rental"{
//                    cell.dropAddressView.isHidden = true
//                }else{
//                    cell.dropAddressView.isHidden = false
//                }
            }
            return cell
        }else if selectedIndex == 1{
            let cell = tableView.dequeueReusableCell(withIdentifier: "UpcomingTripCell", for: indexPath) as! UpcomingTripCell
            if let upcomingTrip : TripData = self.upcomingTripList?.tripList[indexPath.row]{
                cell.tripDate.text = upcomingTrip.date
                cell.bookIdLbl.text = "Book ID: "+upcomingTrip.tripno.description
                cell.priceLbl.text = Constant.priceTag+upcomingTrip.fare
//                cell.statusLbl.isHidden = true
                cell.statusLabel.text = "STATUS : " + upcomingTrip.status
                cell.sourceAddrLbl.text = upcomingTrip.dsp.start
                cell.designationLbl.text = upcomingTrip.dsp.end
                
            }
            cell.cancelBtn.addAction(for: .tap) {
                self.userCancelScheduleTaxi(requestId: self.upcomingTripList?.tripList[indexPath.row]._id ?? "" , index : indexPath.row)
            }
            return cell
        }else{
            let cell = tableView.dequeueReusableCell(withIdentifier: "PasttripCell", for: indexPath) as! PasttripCell
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if selectedIndex == 0{
           return 160
        }else if selectedIndex == 1{
            return 220
        }else{
            return 160
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if selectedIndex == 0{
            if let pastTrip : TripData = self.pastTripList?.tripList[indexPath.row]{
                let vc = TripDetailVC.initWithStory()
                vc.tripId = pastTrip._id
                self.navigationController?.pushViewController(vc, animated: true)
            }
        }
       
    }
}

// API call
extension YourTripsVC{
    func getPastRideApi(data : String){
        self.tripVM.getPastTrip(view: self.view, data: data)
        self.tripVM.successTrip = {
            self.pastTripList = self.tripVM.pastTrip
            self.tripsTabelView.reloadData()
        }
    }
    
    func getUpcomingRideApi(data : String){
        self.tripVM.getUpcomingTrip(view: self.view)
        self.tripVM.successupcomingTripDetail = {
            self.upcomingTripList = self.tripVM.upcomingTrip
            self.tripsTabelView.reloadData()
        }
    }
    
    func userCancelScheduleTaxi(requestId : String , index : Int){
        self.tripVM.userCancelScheduleTaxi(view: self.view, requestId: requestId)
        self.tripVM.successcancelTrip = {
            self.upcomingTripList?.tripList.remove(at: index)
            self.tripsTabelView.reloadData()
        }
    }
}
