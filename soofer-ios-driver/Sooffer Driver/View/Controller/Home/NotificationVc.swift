//
//  NotificationVc.swift
//  Sooffer Driver
//
//  Created by Abservetech on 11/01/23.
//  Copyright © 2023 Abservetech. All rights reserved.
//

import Foundation
class NotificationVc: UIViewController {

    @IBOutlet weak var NotificationTableView: UITableView!
    
   
    
    //MARK: PROPERTIES
    let Localize : Localizations = Localizations.instance
    var loginVM = LoginSignupVM()
    var notification = [NotificationData]()


    override func viewDidLoad() {
        super.viewDidLoad()
       
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupView()
        loginVM = LoginSignupVM(view: self.view, dataService: ApiRoot())
        notificationvalues()
       
    }

    class func initWithStory()->NotificationVc{
        let vc = UIStoryboard.init(name: "Home", bundle: Bundle.main).instantiateViewController(withIdentifier: "NotificationVc") as! NotificationVc
        return vc
    }
    func setupView(){
           self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "Notification"))
           self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
           self.revealViewController().rearViewRevealWidth = 220
        
        self.NotificationTableView.register(UINib(nibName: "cell", bundle: nil), forCellReuseIdentifier: "NotificationCell")
        self.NotificationTableView.delegate = self
        self.NotificationTableView.dataSource = self
       
       }

}

extension  NotificationVc : UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
//           if count > 0 {
//                        ShowMsginWindow.instanse.hideNodataView()
//                        return count
//                    }else{
//                        ShowMsginWindow.instanse.nodataView(view: self.view)
//                    }
//                }
        ShowMsginWindow.instanse.nodataView(view: self.view)
        return notification.isEmpty ? 0 : notification.count
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell =  tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! NotificationCell
        cell.titleLb.text! = notification[indexPath.row].message
        cell.dateandtime.text! =  notification[indexPath.row].createdAt
        
        return cell
    }
}

extension NotificationVc  {
    func notificationvalues() {
        self.loginVM.notificationValues(view: self.view)
        self.loginVM.successnotification = { () in
            //            self.type = self.loginVM.notification
            self.notification = self.loginVM.notification?.NotificationList ?? [NotificationData]()
            print("COUNTTTTT ::\(self.notification.count)")
            self.NotificationTableView.reloadData()
        }
    }
}
