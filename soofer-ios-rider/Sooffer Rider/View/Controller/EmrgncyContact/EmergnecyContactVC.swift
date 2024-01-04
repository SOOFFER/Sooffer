//
//  EmergnecyContactVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 31/05/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit
import ContactsUI

class EmergnecyContactVC: UIViewController {

    
    //UI Declaraction
    @IBOutlet weak var emergencyView: UIView!
    @IBOutlet weak var contactListView: UIView!
    
    @IBOutlet weak var titleLbl: UILabel!
    @IBOutlet weak var instrnLbl: UILabel!
    @IBOutlet weak var addcountLbl: UILabel!
    @IBOutlet weak var addinstrLbl: UILabel!
    
    @IBOutlet weak var addContactBtn: UIButton!
    
    @IBOutlet weak var contactTabel: UITableView!
   
    @IBOutlet weak var emergencyimg: UIImageView!
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var commonvm = CommonVM()
    var emergencyList : EmergencyModel?{
        didSet{
            if let contactsList = emergencyList{
                if contactsList.emergencyList.count > 0{
                  self.emergencyView.isHidden = true
                  self.contactListView.isHidden = false
                    self.contactTabel.reloadData()
                    self.addcountLbl.text = "You can add up to \(5-contactsList.emergencyList.count) Contacts"
                }else{
                    self.emergencyView.isHidden = false
                    self.contactListView.isHidden = true
                    self.addcountLbl.text = "You can add up to \(5) Contacts"
                }
            }
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.emergencyListApi()
        self.navigationController?.isNavigationBarHidden = true
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.commonvm = CommonVM(view: self.view, dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
    }
    
    func setupView(){
        
      //  self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "emrg_contact"))

//        self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
//        self.revealViewController().rearViewRevealWidth = 220
        
        self.addContactBtn.roundeCornorBorder = 20
        
        self.emergencyView.isHidden = false
        self.contactListView.isHidden = true
        
        self.contactTabel.register(UINib(nibName: "EmergencyCell", bundle: nil), forCellReuseIdentifier: "EmergencyCell")
        self.contactTabel.delegate = self
        self.contactTabel.dataSource = self
        self.contactTabel.reloadData()
    }
    
    func setupAction(){
        
        self.addContactBtn.addAction(for: .tap) {
            let cnPicker = CNContactPickerViewController()
            cnPicker.delegate = self
            self.present(cnPicker, animated: true, completion: nil)
        }
        self.emergencyimg.addAction(for: .tap) {
            self.sideMenuController?.revealMenu()
//            self.navigationController?.popToRootViewController(animated: true)
        }
        
    }
    
    func setupLang(){
        self.titleLbl.text = Localize.stringForKey(key: "make_safe")
        self.instrnLbl.text = Localize.stringForKey(key: "send_alert")
        self.addcountLbl.text = Localize.stringForKey(key: "add_5_cont")
        self.addinstrLbl.text = Localize.stringForKey(key: "please_add")
        self.addContactBtn.setTitle(Localize.stringForKey(key: "add_contact"), for: .normal)
    }
    
    class func initWithStory()->EmergnecyContactVC{
        let vc = UIStoryboard.init(name: "EmergencyContact", bundle: Bundle.main).instantiateViewController(withIdentifier: "EmergnecyContactVC") as! EmergnecyContactVC
        return vc
    }

}

extension EmergnecyContactVC : UITableViewDelegate,UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count = self.emergencyList?.emergencyList.count{
            if count > 0 {
                ShowMsginWindow.instanse.hideNodataView()
                if count >= 5{
                    self.addcountLbl.isHidden = true
                    self.addContactBtn.isHidden = true
                }else{
                    self.addcountLbl.isHidden = false
                    self.addContactBtn.isHidden = false
                }
                return count
            }
        }
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "EmergencyCell", for: indexPath) as! EmergencyCell
        if let contactData = self.emergencyList?.emergencyList[indexPath.row]{
            cell.nameLbl.text = contactData.name
            cell.numLbl.text = contactData.number
            cell.closeImg.addAction(for: .tap) {
                self.deleteContact(emgContactId: contactData._id)
            }
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 80
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
}

// getting phone number from contacts
extension EmergnecyContactVC : CNContactPickerDelegate{
  
    //MARK: - Contact Delegates
    func contactPicker(_ picker: CNContactPickerViewController, didSelect contacts: [CNContact]) {
         contacts.forEach { contact in
            let name = "\(contact.givenName) \(contact.familyName)"
            let phone = "\(contact.phoneNumbers.first?.value.stringValue ?? "")"
            self.addContact(name: name, phone: phone)
        }
        
    }
    
    func contactPickerDidCancel(_ picker: CNContactPickerViewController) {
        print("Cancel Contact Picker")
    }
}

extension EmergnecyContactVC{
    func emergencyListApi(){
        self.commonvm.getEmgContectsList(view: self.view)
        self.commonvm.successContects = {
            self.emergencyList = self.commonvm.EmegencyList
        }
    }
    
    func addContact(name : String , phone : String){
        self.commonvm.addEmgContectsList(view: self.view, name: name, number: phone)
        self.commonvm.successContects = {
                   
            self.emergencyListApi()
          }
    }
    
    func deleteContact( emgContactId : String){
        self.commonvm.deleteEmgContectsList(view: self.view, emgContactId: emgContactId)
        self.commonvm.successDeleteContects = {
            self.emergencyList = self.commonvm.EmegencyList
        }
    }
}


