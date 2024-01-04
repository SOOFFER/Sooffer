//
//  EarningVC.swift
//  RebuStar Driver
//
//  Created by Abservetech on 05/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class EarningVC: UIViewController {
    
    //Api response
    
    var earningData : EarningModel?{
        didSet{
            if let earningsdata = self.earningData{
                self.tableView.reloadData()
            }
        }
    }
    

    @IBOutlet weak var tableView: UITableView!
    
    @IBOutlet weak var datepickerview: UIView!
    @IBOutlet weak var fromBtn: UIButton!
    @IBOutlet weak var toBtn: UIButton!
    @IBOutlet weak var toTxt: UITextField!
    @IBOutlet weak var fromTxt: UITextField!
    
    @IBOutlet weak var datepicker: UIDatePicker!
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    
    var earnings: NSMutableArray = []
    var earningArray: NSMutableArray = []
    var earningDict: NSDictionary!
    var page : String = "1"
    var fromdate : String = ""
    var todate : String = ""
    var datePlace : String = ""
    var earingVM = EarningsVM()
    
    @IBAction func datePickerDoneBtn(_ sender: Any) {
         let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
                            
        let dateFormatter1 = DateFormatter()
        dateFormatter1.dateFormat = "dd-MM-yyyy"
          datepicker.maximumDate = Date()
        if datePlace == "from"{
           
            fromTxt.text = dateFormatter1.string(from: datepicker.date)
            fromdate = dateFormatter.string(from: datepicker.date)
            
                
        }else{
            toTxt.text = dateFormatter1.string(from: datepicker.date)
            todate = dateFormatter.string(from: datepicker.date)
                   
                 
        }
        let fromDate : String = fromdate ?? ""
        let toDate : String = todate ?? ""
                  
        if !fromDate.isEmpty && !toDate.isEmpty{
            self.attemptApi(from: fromDate, to: todate ?? "", type: "", fromMonth: "", page: "1")
        }
        
          self.datepickerview.isHidden = true
          
      }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewDidLoad()
        self.attemptApi(from: fromTxt.text?.description ?? "", to: toTxt.text?.description ?? "", type: "", fromMonth: "", page: "1")
    }
    
 override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        
        self.earingVM = EarningsVM(dataService: ApiRoot())
        self.setupView()
        self.setupAction()
        self.setupLang()
        self.setupDelegate()
    }
    
    func setupView(){
        
        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "earning"))
       self.view.addGestureRecognizer((self.revealViewController()?.panGestureRecognizer())!)
        self.revealViewController().rearViewRevealWidth = 220
       
        if let myImage = UIImage(named: "calender"){
            self.toTxt.withImage(direction: .Right, image: myImage, colorSeparator: UIColor.clear, colorBorder: UIColor.clear)
            self.fromTxt.withImage(direction: .Right, image: myImage, colorSeparator: UIColor.clear, colorBorder: UIColor.clear)
        }
//        setInputViewForfromtextField()
//        setInputViewForTotextField()
    }
    
    func setupAction(){
        self.fromBtn.addAction(for: .tap) {
            self.datepickerview.isHidden = false
            self.datePlace = "from"
        }
        self.toBtn.addAction(for: .tap) {
            self.datepickerview.isHidden = false
            self.datePlace = "to"
        }
    }
    func setupLang(){
        
    }
    
    class func initWithStory()->EarningVC{
        let vc = UIStoryboard.init(name: "Earnings", bundle: Bundle.main).instantiateViewController(withIdentifier: "EarningVC") as! EarningVC
        return vc
    }

    func setInputViewForfromtextField() {
        let datePickerView = UIDatePicker()
        datePickerView.datePickerMode = .date
        datePickerView.maximumDate = Date()
        fromTxt.inputView = datePickerView
        datePickerView.addTarget(self, action: #selector(handlefromTxtDatePicker(sender:)), for: .valueChanged)
    }
    
    func setInputViewForTotextField() {
        let datePickerView = UIDatePicker()
        datePickerView.datePickerMode = .date
        datePickerView.maximumDate = Date()
        toTxt.inputView = datePickerView
        datePickerView.addTarget(self, action: #selector(handletoTxtDatePicker(sender:)), for: .valueChanged)
    }
    
    @objc func handlefromTxtDatePicker(sender: UIDatePicker) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        
        let dateFormatter1 = DateFormatter()
        dateFormatter1.dateFormat = "dd-MM-yyyy"
        sender.maximumDate = Date()
        fromTxt.text = dateFormatter1.string(from: sender.date)
        fromdate = dateFormatter.string(from: sender.date)
        let toDate : String = todate ?? ""
        if !toDate.isEmpty{
            self.attemptApi(from: fromdate ?? "", to: toDate, type: "", fromMonth: "", page: "1")
        }
    }
    
    @objc func handletoTxtDatePicker(sender: UIDatePicker) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        
        let dateFormatter1 = DateFormatter()
        dateFormatter1.dateFormat = "dd-MM-yyyy"
        sender.maximumDate = Date()
        toTxt.text = dateFormatter1.string(from: sender.date)
        todate = dateFormatter.string(from: sender.date)
        
        let fromDate : String = fromdate ?? ""
        if !fromDate.isEmpty{
            self.attemptApi(from: fromDate, to: todate ?? "", type: "", fromMonth: "", page: "1")
        }
    }
}


extension EarningVC: UITableViewDataSource,UITableViewDelegate{
    
    func setupDelegate(){
        self.tableView.delegate = self
        self.tableView.dataSource = self
        self.tableView.reloadData()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count = self.earningData?.earingsdata.count{
            if count > 0{
                ShowMsginWindow.instanse.hideNodataView()
                return count
            }else{
                ShowMsginWindow.instanse.nodataView(view: self.view)
            }
        }
        ShowMsginWindow.instanse.nodataView(view: self.view)
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "EarningCell", for: indexPath) as! EarningCell
        if let earning = self.earningData?.earingsdata[indexPath.row]{
            cell.dateLbls.text = earning.date
            cell.earningLbl.text = Constant.priceTag + earning.amttopay.description
        }
        cell.contentView.addAction(for: .tap) {
            if let earning = self.earningData?.earingsdata[indexPath.row]{
                
                let type : String = earning.type
                let fromMonth : String = earning.date
                if type == "Days"{
                    let vc = YourTripsVC.initWithStory()
                    vc.pageFrom = "earnings"
                    vc.date = earning.date
                    self.navigationController?.pushViewController(vc, animated: true)
                }else{
                    self.attemptApi(from: "", to: "", type: type, fromMonth: fromMonth, page: self.page)
                }
            }
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 60
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        print(indexPath.row)
    }
    
    
}


extension EarningVC{
    
    func attemptApi(from: String, to: String, type: String, fromMonth: String, page: String){
        
        self.earingVM.getEaringsList(view: self.view, from: from, to: to, type: type, fromMonth: fromMonth, page: page)
        
        self.earingVM.getearningListClosure = {
            self.earningData = self.earingVM.earningsList
        }
    }
}
