//
//  CountryVc.swift
//  Sooffer Driver
//
//  Created by Abservetech on 25/07/24.
//  Copyright © 2024 Abservetech. All rights reserved.
//

import UIKit

protocol CountryDelegate {
    func countryList(with id : String,with  name : String)
}
protocol VehicleDelegate {
    func vehicleList(with  name : String)
}

class CountryVc: UIViewController {
    
    //MARK: -- CONSTRAINTS
    
    @IBOutlet weak var searchBar: UISearchBar!
    @IBOutlet weak var countryTableView: UITableView!
    @IBOutlet weak var backView: UIView!
    @IBOutlet weak var TitleLbl: UILabel!
    
    
    //MARK: PROPERTIES
    var loginVM = LoginSignupVM()
    var countryListval = [CountryModel]()
    var filterCountryVal = [CountryModel]()
    var delegate: CountryDelegate!
    var delegate2: VehicleDelegate!
    var idval  = String()
    var type = String()
    
    var filterData : [String] = []
    var pagefrom = String()
    var namearray : [String] = []
    var makeidArray : [String] = []
    var makeid = String()
      
    override func viewDidLoad() {
        super.viewDidLoad()
        self.loginVM = LoginSignupVM(view: self.view, dataService: ApiRoot())
        self.view.backgroundColor = UIColor.black.withAlphaComponent(0.8)
        print("pagefrom::: \(self.pagefrom)")
//        self.TitleLbl.text = "Select " + type.capitalizingFirstLetter()
        self.searchBar.placeholder = "Select " + type.capitalizingFirstLetter()
        self.searchBar.delegate = self
        self.searchBar.becomeFirstResponder()
        countryList()
        setAction()
        if !self.namearray.contains("Others"){
            self.namearray.append("Others")
            self.makeidArray.append("Others")
        }
        filterData = namearray
        print("namearray:: \(namearray)")
    }
    
    func setAction() {
        self.backView.addTap {
            self.dismiss(animated: true, completion: nil)
        }
    }
    
    class func initWithStory() -> CountryVc{
        let vc = UIStoryboard.init(name: "Account", bundle: Bundle.main).instantiateViewController(withIdentifier: "CountryVc") as! CountryVc
        return vc
    }
}
extension CountryVc: UITableViewDelegate, UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if self.pagefrom == "Addvehiclevc"{
           // print("coountval:: \(self.filterData.count)")
            return self.filterData.count
        } else {
            return self.filterCountryVal.count
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! ListTableViewCell
        if self.pagefrom == "Addvehiclevc" {
            cell.countryLb.text! = self.filterData[indexPath.row]
            let data = cell.countryLb.text!
            print("data:: \(data)")
          //  cell.countryLb.text! = data
            print("ineexpath row is:: \(indexPath.row)")
            cell.contentView.addTap {
                self.delegate2.vehicleList(with: data)
                self.dismiss(animated: true, completion: nil)
            }
        } else {
            let data = self.filterCountryVal[indexPath.row]
            
            cell.countryLb.text! = data.name
            
            cell.contentView.addTap {
                self.delegate.countryList(with: data.id, with: data.name)
                self.dismiss(animated: true, completion: nil)
            }
        }
        return cell
    }
}
extension CountryVc {
    func countryList() {
        print("SELECTED VALUESS ::\(self.type)..selectedd ::\(idval)")
        self.loginVM.countryList(view: view, with: self.type, with: idval)
        ShowMsginWindow.instanse.LoadingShow(view: self.view)
        self.loginVM.sucessscountry = { () in
            ShowMsginWindow.instanse.LoadingHide(view: self.view)
            self.countryListval = self.loginVM.countryData?.countryList ?? [CountryModel]()
            self.filterCountryVal = self.countryListval
            self.countryTableView.reloadData()
        }
        self.loginVM.errorcountry = { () in
            ShowMsginWindow.instanse.LoadingHide(view: self.view)
            let errData = self.loginVM.countryErr
            showToast(msg: errData?.message ?? "")
            self.countryTableView.reloadData()
        }
    }
}

extension CountryVc : UISearchBarDelegate{
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        let text = searchText.lowercased()
        print("searchtext:: \(text)")
        if self.pagefrom == "Addvehiclevc" {
            
            filterData = searchText.isEmpty ? namearray : namearray.filter({(dataString: String) -> Bool in
                return dataString.range(of: searchText, options: .caseInsensitive) != nil
                })
            print("filterdata:: \(filterData)")
          //  self.countryTableView.reloadData()
        } else{
            filterCountryVal = text.isEmpty ? countryListval : countryListval.filter{
                let t = $0.name.lowercased().contains(text)
                return t
            }
           
        }
        self.countryTableView.reloadData()
    }
    
//    func searchBarTextDidBeginEditing(_ searchBar: UISearchBar) {
//            self.searchBar.showsCancelButton = true
//    }
}
