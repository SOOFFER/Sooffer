//
//  RideLaterVc.swift
//  Sooffer Rider
//
//  Created by Abservetech on 29/06/22.
//  Copyright © 2022 Abservetech. All rights reserved.
//

import UIKit

class RideLaterVc: UIViewController {
    
    @IBOutlet weak var timeTf: UITextField!
    @IBOutlet weak var submitBtn: UIButton!
    @IBOutlet weak var dateTf: UITextField!
    @IBOutlet weak var dismissVw: UIView!
    @IBOutlet weak var bottomVw: UIView!
    
    @IBOutlet weak var donetoolbar: UIToolbar!
    @IBOutlet weak var datePicker: UIDatePicker!
    @IBOutlet weak var datePickerView: UIView!
    
    
    
    //MARK: - CONSTRAINTS :
  
    var dateTime : String = ""

    var homevm = HomeVM()
    class func initWithStory() -> RideLaterVc{
        let vc = UIStoryboard(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "RideLaterVc") as! RideLaterVc
        return vc
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUIElemnts()
        setAction()
        self.datePickerView.isHidden = true

    }
    
    @IBAction func doneBtnAct(_ sender: Any) {
       
        
        if self.dateTime == "date"{
            let dateFormatter = DateFormatter()
            self.datePicker.datePickerMode = .date
            dateFormatter.dateFormat = "dd-MM-yyyy"
            datePicker.minimumDate = Date()
            datePicker.maximumDate = Calendar.current.date(byAdding: .day, value: +7, to: Date())
            dateTf.text = dateFormatter.string(from: datePicker.date)
            self.self.datePickerView.isHidden = true
            
        }else if self.dateTime == "time"{
            
            let dateFormatter = DateFormatter()
            self.datePicker.datePickerMode = .time
            dateFormatter.dateFormat = "hh:mm a"
            dateFormatter.timeZone = TimeZone(identifier: "GMT +5:30")
            timeTf.text = dateFormatter.string(from: datePicker.date)
            self.self.datePickerView.isHidden = true
        }
    }
    
    
    func setUIElemnts() {
        dismissVw.backgroundColor = UIColor.black.withAlphaComponent(0.8)
        dateTf.attributedPlaceholder = NSAttributedString(
            string: "Set Date",
            attributes: [NSAttributedString.Key.foregroundColor: UIColor.black])
        submitBtn.setTitleColor(.white, for: .normal)
        submitBtn.addCornerRadius(withRadius: 8, withBackgroundColor: .clear)
        timeTf.attributedPlaceholder = NSAttributedString(
            string: "Set Time",
            attributes: [NSAttributedString.Key.foregroundColor: UIColor.black])
        bottomVw.addCornerRadius(withRadius: 8, withBackgroundColor: .clear, withBorderWidth: 0)
        bottomVw.addShadow(withShadow: .lightGray, withradius: 3)
    }
}
extension RideLaterVc {
    func setAction() {
        dateTf.addTap {
            self.dateTime = "date"
            self.datePickerView.isHidden = false
            self.datePicker.datePickerMode = .date
            
        }
        timeTf.addTap {
            self.dateTime = "time"
            self.datePickerView.isHidden = false
            self.datePicker.datePickerMode = .time
            
            
            if #available(iOS 13.4, *) {
                self.datePicker.preferredDatePickerStyle = .wheels
            } else {
                // Fallback on earlier versions
            }
        }
        
        submitBtn.addTap {
//            self.sendRideRequest(view: self, date: self.seletecdateLbl.text ?? "", paymentType: payment, pickupCity: pickupCity, bookingtype: "rideLater", tripTime: self.selectedTimeLbl.text ?? "", utc: self.selectedTimeLbl.text ?? "", estimateFare: self.fareDetail ?? EstimateFareDetails(), requestResponse: {(requestData) in
//                
//                self.scheduleRideView.isHidden = true
//                requestNow(requestData,"rideLater")
//                
//            })
        }
    }
//    func sendRideRequest(view: UIView, date: String, paymentType: String, pickupCity: String, bookingtype: String, tripTime: String,utc: String, estimateFare: EstimateFareDetails,requestResponse : @escaping(RideRequestModel) -> ())
//         {
//     self.homevm.sendRideRequest(view: self, date: date, paymentType: paymentType, pickupCity: pickupCity, bookingtype: bookingtype, tripTime: tripTime, estimateFare: self.fareDetail ?? EstimateFareDetails(), utc: utc, isMultiLocation: "false", multiLocation: "", homeType: redirectHome, withId: "", withNo: "", withName: "", withMake: "")
//         self.homevm.getRequestClouser = {
//             if let requestdata = self.homevm.request{
//     //                 let requestInfo = ["requestID": requestdata.requestDetails ?? ""]
//     //                 NotificationCenter.default.post(name: .rideRequestSend, object: nil,userInfo: requestInfo)
//     //                self.deInitView(request: "")
//                 requestResponse(requestdata)
//             }
//         }
//     }
    

}
