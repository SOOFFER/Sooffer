//
//  ViewTranscationVC.swift
//  RebuStar Rider
//
//  Created by Abservetech on 22/07/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import UIKit

class ViewTranscationVC: UIViewController {

    @IBOutlet weak var segment : UISegmentedControl!
    @IBOutlet weak var tableview : UITableView!
    
    @IBAction func selectedSegmentCtrl(_ sender: UISegmentedControl)
    {
       self.selectedSegment = sender.selectedSegmentIndex
        
            self.tableview.reloadData()
        
    }
    
    //VariableDeclaraction
    let Localize : Localizations = Localizations.instance
    var paymentvm = CommonVM()
    var selectedSegment : Int = Int()
    
    var tranactions : TransactionModel?{
        didSet{
            let counts : Int = (self.tranactions?.transactionList.count ?? 0)
            for vlaue in 0..<counts {
               self.tranactionlist.append(self.tranactions?.transactionList[vlaue] ?? Transaction())
                
                if self.tranactions?.transactionList[vlaue].type == "Credit"{
                    self.moneyIn.append(self.tranactions?.transactionList[vlaue] ?? Transaction())
                }
            }
            self.tableview.reloadData()
        }
    }
    
    var moneyIn : [Transaction] = [Transaction]()
    
    var moneyout : [Transaction] = [Transaction]()
    var tranactionlist : [Transaction] = [Transaction]()

  var isDataLoading:Bool=false
  var pageNo:Int=1
  var limit:Int=10
  var offset:Int=0 //pageNo*limit
  var didEndReached:Bool=false
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
        self.getTransctionList(_page: pageNo.description, _limit: limit.description)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if #available(iOS 13.0, *) {
            overrideUserInterfaceStyle = .light
        } else {
            // Fallback on earlier versions
        }
        self.setupView()
        self.paymentvm = CommonVM(dataService: ApiRoot())
        self.setupAction()
        self.setupLang()
        self.setupData()
        self.setupDelegate()
    }
    
    func setupView(){
    self.title = Localize.stringForKey(key: "Wallet Transaction")
    }
    
    func setupDelegate(){
        self.tableview.delegate = self
        self.tableview.dataSource = self
        self.tableview.delegate = self
    }
    
    func setupAction(){
        
    }
    
    func setupData(){
        
    }
    
    func setupLang(){
//        self.barButtonItem(ViewController: self, title: Localize.stringForKey(key: "mywallet"))
//        self.navigationItem.leftBarButtonItem = nil
    }
    
    class func initWithStory()->ViewTranscationVC{
        let vc = UIStoryboard.init(name: "Payment", bundle: Bundle.main).instantiateViewController(withIdentifier: "ViewTranscationVC") as! ViewTranscationVC
        return vc
    }

}

extension ViewTranscationVC: UITableViewDelegate,UITableViewDataSource,UIScrollViewDelegate{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if selectedSegment == 0{
            if let count : Int = tranactionlist.count as? Int{
                if count > 0 {
                    ShowMsginWindow.instanse.hideNodataView()
                    return count
                }else{
                    ShowMsginWindow.instanse.nodataView(view: self.view)
                }
            }
        }
        if selectedSegment == 1{
            if let count : Int = self.moneyIn.count as? Int{
                if count > 0 {
                    ShowMsginWindow.instanse.hideNodataView()
                    return count
                }else{
                    ShowMsginWindow.instanse.nodataView(view: self.view)
                }
            }
        }
        if selectedSegment == 2{
            if let count : Int = self.moneyout.count as? Int{
                if count > 0 {
                    ShowMsginWindow.instanse.hideNodataView()
                    return count
                }else{
                    ShowMsginWindow.instanse.nodataView(view: self.view)
                }
            }
        }
        
        ShowMsginWindow.instanse.nodataView(view: self.view)
        return 0
    }
    
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "trancell", for: indexPath) as! trancell
        if selectedSegment == 0{
            
        if let transData : Transaction = self.tranactionlist[indexPath.row] as? Transaction{
            cell.id.text = "\(transData.description) : \(transData.trxId)"
            cell.Date.text = transData.paymentDate
            cell.price.text = decimalDataString(data: transData.amt.description)
            cell.status.text = "Status : " + "\(transData.type)"
        }
        }
        if selectedSegment == 1{
            
            if let transData : Transaction = self.moneyIn[indexPath.row] as? Transaction{
                cell.Date.text = transData.date
                cell.price.text = decimalDataString(data: transData.amt.description)
                cell.status.text = "Status : " + "\(transData.type)"
            }
        }
        if selectedSegment == 2{
            
            if let transData : Transaction = self.moneyout[indexPath.row] as? Transaction{
                cell.Date.text = transData.date
                cell.price.text = decimalDataString(data: transData.amt.description)
                cell.status.text = "Status : " + "\(transData.type)"
            }
        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    
    func scrollViewWillBeginDragging(_ scrollView: UIScrollView) {

        print("scrollViewWillBeginDragging")
        isDataLoading = false
    }



    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        print("scrollViewDidEndDecelerating")
    }
    //Pagination
    func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool) {

            print("scrollViewDidEndDragging")
            if ((tableview.contentOffset.y + tableview.frame.size.height) >= tableview.contentSize.height)
            {
                if !isDataLoading{
                    isDataLoading = true
                    self.pageNo=self.pageNo+1
//                    self.limit=self.limit+10
                    self.offset=self.limit * self.pageNo
                        self.getTransctionList(_page: pageNo.description, _limit: limit.description)
                    
                }
            }


    }
}

extension ViewTranscationVC{
    func getTransctionList(_page: String, _limit: String){
        self.paymentvm.getTransactionList(view: self.view, _page: _page, _limit: _limit)
        self.paymentvm.successtranscartion = {
            self.tranactions = self.paymentvm.transactionList ?? TransactionModel()
//            self.tableview.reloadData()
            let counts : Int = (self.tranactions?.transactionList.count ?? 0)
            for vlaue in 0..<counts {
//                self.tranactionlist.append(self.tranactions?.transactionList[vlaue] ?? Transaction())
                
                if self.tranactions?.transactionList[vlaue].type == "Credit"{
                    self.moneyIn.append(self.tranactions?.transactionList[vlaue] ?? Transaction())
                }
            }
            
            let moneyoutcounts : Int = (self.tranactions?.transactionList.count ?? 0)
            for vlaue in 0..<moneyoutcounts {
                if self.tranactions?.transactionList[vlaue].type == "Debit"{
                    self.moneyout.append(self.tranactions?.transactionList[vlaue] ?? Transaction())
                }
            }
        }
        
    }
}


class trancell : UITableViewCell{
    @IBOutlet weak var Date: UILabel!
    @IBOutlet weak var price : UILabel!
    @IBOutlet weak var status: UILabel!
    @IBOutlet weak var id: UILabel!
    @IBOutlet weak var cellView : UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.cellView.layer.cornerRadius = 5
        self.cellView.isElevation = 3
        self.selectionStyle = .none
    }
}
