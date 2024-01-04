//
//  ChatVC.swift
//  Nexxyo Rider
//
//  Created by Abservetech on 05/08/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import IQKeyboardManagerSwift

class ChatVC: UIViewController , UITextFieldDelegate {

    @IBOutlet weak var frndNameLbl: UILabel!
    @IBOutlet weak var backarrowImg: ImageLoader!
    @IBOutlet weak var sendImg: ImageLoader!
    @IBOutlet weak var textmsg : UITextField!
    @IBOutlet weak var navBarView: UIView!
    @IBOutlet weak var chatTable: UITableView!
    
    @IBOutlet weak var bottomCns: NSLayoutConstraint!
    
    
    var shownIndexes : [IndexPath] = []
    // variable Declaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
     let FBCONNECT = FireBaseconnection.instanse
        var firebaseChatList : [FBchatmsg] = [FBchatmsg]()
    var name : String = String()
    var fcm : String = ""
    
   override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.navigationController?.isNavigationBarHidden = true
        IQKeyboardManager.shared.enable = false
        self.textmsg.delegate = self
        
        self.setupAction()
        self.setupLang()
        self.setupview()
        self.setupData()
        self.setDelegate()
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow(notification:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        
         NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide(notification:)), name: UIResponder.keyboardWillHideNotification, object: nil)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.navigationController?.isNavigationBarHidden = true
        IQKeyboardManager.shared.enable = false
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        self.navigationController?.isNavigationBarHidden = false
        IQKeyboardManager.shared.enable = true
    }
    
    class func initWithStory()->ChatVC{
        let vc = UIStoryboard.init(name: "Chat", bundle: Bundle.main).instantiateViewController(withIdentifier: "ChatVC") as! ChatVC
        return vc
    }
    @objc func keyboardWillShow(notification:NSNotification){
        if let info = notification.userInfo{
            let rect : CGRect = info["UIKeyboardFrameEndUserInfoKey"] as? CGRect ?? CGRect()
            self.view.layoutIfNeeded()
            UIView.animate(withDuration: 0.01) {
                self.view.layoutIfNeeded()
                self.bottomCns.constant = rect.height
            }
        }
    }
    
    @objc func keyboardWillHide(notification:NSNotification){
        if let info = notification.userInfo{
            let rect : CGRect = info["UIKeyboardFrameEndUserInfoKey"] as? CGRect ?? CGRect()
            self.view.layoutIfNeeded()
            UIView.animate(withDuration: 0.10) {
                self.view.layoutIfNeeded()
                self.bottomCns.constant = 0
            }
        }
    }
    
    func setupAction(){
        self.backarrowImg.addAction(for: .tap) {
            self.dismiss(animated: true, completion: nil)
        }
        self.sendImg.addAction(for: .tap) {
            let msg : String =  self.textmsg.text ?? ""
            if msg.isEmpty{
                showToast(msg: self.Localize.stringForKey(key: "err_msg"))
            }else{
                let timestamp = DateFormatter.localizedString(from: Date(), dateStyle: .none, timeStyle: .short)
                print("timeformate" , timestamp)
                self.FBCONNECT.addmesage(message: msg, time: timestamp,name : self.name, done: { (done) in
//                    let fcm: String = UserDefaults.standard.value(forKey: UserDefaultsKey.fcmtoken) as? String ?? ""
                    self.firebaseNotiifcation(message: msg, fcm: self.fcm)
                    self.setupData()
                    self.textmsg.text = ""
                })
                
            }
        }
    }
    
    func setupLang(){
    }
    
    func setupview(){
        self.textmsg.keyboardDistanceFromTextField = 8
    }
    
    func setupData(){
        self.frndNameLbl.text = name
       self.FBCONNECT.chatList(allmessage: {(chatData) in
            self.firebaseChatList.removeAll()
            self.firebaseChatList = chatData
            self.chatTable.reloadData()
            if self.firebaseChatList.count > 1{
                self.chatTable.scrollToRow(at: NSIndexPath(row: self.firebaseChatList.count-1, section: 0) as IndexPath, at: UITableView.ScrollPosition.none, animated: true)
            }
        })
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        
        print("asldhaksdhkjas")
         self.bottomCns.constant = 0
        return false
    }

    
}
extension ChatVC : UITableViewDataSource, UITableViewDelegate{
    
    func setDelegate(){
        self.chatTable.delegate = self
        self.chatTable.dataSource = self
        self.chatTable.reloadData()
        self.chatTable.register(UINib(nibName: "userChatCell", bundle: nil), forCellReuseIdentifier: "UserChatCell")
        self.chatTable.register(UINib(nibName: "frienChatCell", bundle: nil), forCellReuseIdentifier: "FrndChatCell")
        
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let chatcount : Int = self.firebaseChatList.count as? Int{
            return chatcount
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
       
        if self.firebaseChatList[indexPath.row].type == "rider" {
            let cell = tableView.dequeueReusableCell(withIdentifier: "UserChatCell") as! UserChatCell
            cell.msgLabl.text = self.firebaseChatList[indexPath.row].messsage
            cell.timeLabl.text = self.firebaseChatList[indexPath.row].timestamp
            return cell
        }else{
            let cell = tableView.dequeueReusableCell(withIdentifier: "FrndChatCell") as! FrndChatCell
            cell.msgLabl.text = self.firebaseChatList[indexPath.row].messsage
            cell.timeLabl.text = self.firebaseChatList[indexPath.row].timestamp
            return cell
        }
       
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        if (shownIndexes.contains(indexPath) == false) {
            shownIndexes.append(indexPath)
            
            cell.transform = CGAffineTransform(translationX: 0, y: 50)
            cell.alpha = 0.5
            
            UIView.beginAnimations("rotation", context: nil)
            UIView.setAnimationDuration(0.5)
            cell.transform = CGAffineTransform(translationX: 0, y:0)
            cell.alpha = 1
            cell.layer.shadowOffset = CGSize(width: 0, height: 0)
            UIView.commitAnimations()
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    
    func firebaseNotiifcation(message : String,fcm : String){
           guard let url = URL(string: "https://fcm.googleapis.com/fcm/send") else {return}
           var request = URLRequest(url: url)
           var header : String = "key=AAAAGAksKio:APA91bFYOC9P4WlYu1cPpYko-PbohBdj0vFDvtPeiht0msz7uy6PXGM4sjoNchnGPuSVExQCcpzLXcPA_ByluhqLyhRlNR5_FYaH2CUtbzmZ3B7zdovvFtxpEnNYThcUOfPM-ntcy74k"
           request.setValue(header, forHTTPHeaderField: "Authorization")
           request.httpMethod = "POST"
        let params = ["to" : fcm,
                      
                         "notification" : [
                           "title" : "Sooffer",
                           "body" : "\(message)",
                           "sound" : "default"
                           
                        ],
                         "data" : [
                           "title" : "Huberswiss",
                           "score" : "5x1",
                            "message" :"\(message)"
            ]
//                      "apns":[
//                             "payload": [
//                                 "aps": [
//                                     "sound": "default"
//                                 ]
//                             ]
//                         ]
               ] as [String : Any]
           request.addValue("application/json", forHTTPHeaderField: "Content-Type")
           guard let httpbody = try? JSONSerialization.data(withJSONObject: params, options: [])  else { return }
           request.httpBody = httpbody
           
           URLSession.shared.dataTask(with: request) { (data, resule, error) in
               guard let data = data else {return}
               
               do{
                   
                   let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers)
                   print("====>postwithHeader",json)
                   
               }catch{
                   print("JSONS Error")
               }
               
               }.resume()
       }
}
