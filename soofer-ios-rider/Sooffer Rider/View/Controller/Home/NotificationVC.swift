//
//  NotificationVc.swift
//  Sooffer Rider
//
//  Created by Abservetech on 06/01/23.
//  Copyright © 2023 Abservetech. All rights reserved.


import UIKit

class NotificationVc: UIViewController {

    @IBOutlet weak var notificationTableView: UITableView!
    @IBOutlet weak var titlelable : UILabel!
    @IBOutlet weak var backimmg: UIImageView!

    //MARK: PROPERTIES
    let Localize : Localizations = Localizations.instance
    var loginVM = LoginSignupVM()
    var notification = [NotificationData]()
//    var type : NotificationModel?{
//        didSet{
//            if type != nil{
//                self.notificationTableView.reloadData()
//
////                    self.addcountLbl.text = "You can add up to \(5) Contacts"
//            }
//        }
//    }
    override func viewDidLoad() {
        super.viewDidLoad()
       
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupView()
        setupAction()
        loginVM = LoginSignupVM(view: self.view, dataService: ApiRoot())
        notificationvalues()
        self.navigationController?.isNavigationBarHidden = true
    }

    class func initWithStory()->NotificationVc{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "NotificationVc") as! NotificationVc
        return vc
    }
    func setupView(){
       //    self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "Notification"))
//           self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//           self.revealViewController().rearViewRevealWidth = 220
        self.titlelable.text = Localize.stringForKey(key: "Notification")
        self.notificationTableView.register(UINib(nibName: "cell", bundle: nil), forCellReuseIdentifier: "NotificationCell")
        self.notificationTableView.delegate = self
        self.notificationTableView.dataSource = self
       
       }
    func setupAction() {
        self.backimmg.addTap {
            self.sideMenuController?.revealMenu()
        }
        
    }
  
}
extension  NotificationVc : UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
//        if let count = self.type?.NotificationList.count{
//            if count > 0 {
//                ShowMsginWindow.instanse.hideNodataView()
//                return count
//            }else{
//                ShowMsginWindow.instanse.nodataView(view: self.view)
//            }
//        }
//        ShowMsginWindow.instanse.nodataView(view: self.view)
        return notification.isEmpty ? 0 : notification.count
    }
      func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
          let cell =  tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! NotificationCell
          cell.titleLb.text! = notification[indexPath.row].message
          cell.dateandtime.text! =  notification[indexPath.row].createdAt
//          if let data = self.type?.NotificationList[indexPath.row]{
//              cell.titleLb.text! =  data.createdAt
//              cell.dateandtime.text! =  data.message
//          }
          return cell
      }
//    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
//        return 80
////        UITableView.automaticDimension
//    }
//    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
//        tableView.deselectRow(at: indexPath, animated: true)
//    }
    
      
  }
extension NotificationVc  {
    func notificationvalues() {
        self.loginVM.notificationValues(view: self.view)
        self.loginVM.successnotification = { () in
//            self.type = self.loginVM.notification
            self.notification = self.loginVM.notification?.NotificationList ?? [NotificationData]()
            print("COUNTTTTT ::\(self.notification.count)")
            self.notificationTableView.reloadData()
            if self.notification.isEmpty{
                ShowMsginWindow.instanse.nodataView(view: self.view)
                showToast(msg: "No notification yet")
            }
         //   print("typ@",self.type)
//            if let no = self.loginVM.notification{
//
////                if let content : NotificationModel = self.notification as? NotificationModel{
////                if let content = no.NotificationList as? [NotificationModel]{
////                    print("content : \(content)")
////                    self.notificationTableView.reloadData()
//                let value = self.notification.NotificationList
//                    self.notification = self.loginVM.notification ?? NotificationModel()
//                print("@#$!$",self.notification)
////                self.notificationTableView.reloadData()
////                }
//            }
//            self.notification = self.loginVM.notification?.NotificationList ?? [NotificationModel]()
//            print("self.notificatio",self.notification)
//            print("self.loginVM.notification",self.loginVM.notification)
//             AlertManager.instance.showToast(msg: "Success")
        }
    }
}

