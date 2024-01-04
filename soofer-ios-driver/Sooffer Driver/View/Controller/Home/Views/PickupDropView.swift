//
//  PickupLocView.swift
//  RebuStar Rider
//
//  Created by Abservetech on 22/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import GoogleMaps

class PickupLocView: UIView {
    
    
    @IBOutlet weak var TravelTimeView: UIView!
    
    @IBOutlet weak var travelLbl: UILabel!
    @IBOutlet weak var AddrLbl: UILabel!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    func loadView() -> PickupLocView{
        let customInfoWindow = Bundle.main.loadNibNamed("PickupInfoView", owner: self, options: nil)?[0] as! PickupLocView
        return customInfoWindow
    }
}


class DropLocView: UIView {
    
    @IBOutlet weak var addressLbl: UILabel!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    func loadView() -> DropLocView{
        let customInfoWindow = Bundle.main.loadNibNamed("DropInfoView", owner: self, options: nil)?[0] as! DropLocView
        return customInfoWindow
    }
}

class PickupMarker: GMSMarker {
    override init(){}
    let view = Bundle.main.loadNibNamed("PickupInfoView", owner: nil, options: nil)?.first as! PickupLocView
    init(location : CLLocation , address : String , timeDistanc : String) {
        super.init()
        if let loc : CLLocation = location as? CLLocation{
            let coordinate = CLLocationCoordinate2D(latitude: location.coordinate.latitude, longitude: location.coordinate.longitude)
            position = coordinate
        }
     
        view.AddrLbl.text = address
        view.travelLbl.text = timeDistanc
        iconView = view
    }
}

class DropMarker: GMSMarker {
    override init(){}
    let view = Bundle.main.loadNibNamed("DropInfoView", owner: nil, options: nil)?.first as! DropLocView
    init(location : CLLocation , address : String) {
        super.init()
        if let loc : CLLocation = location as? CLLocation{
            let coordinate = CLLocationCoordinate2D(latitude: location.coordinate.latitude, longitude: location.coordinate.longitude)
            position = coordinate
        }
      
        view.addressLbl.text = address
        iconView = view
    }
}
