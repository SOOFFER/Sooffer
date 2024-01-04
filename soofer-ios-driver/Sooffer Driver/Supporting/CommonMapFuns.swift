//
//  CommonMapFuns.swift
//  RebuStar Rider
//
//  Created by Abservetech on 05/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import GoogleMaps

// conver LatLang to Address

func convertLatLangTOAddress(coordinates : CLLocation,address : @escaping(String) -> Void )  {
    
    var addressString : String = ""
    
    CLGeocoder().reverseGeocodeLocation(coordinates, completionHandler: {(placemarks, error) -> Void in
         if error != nil {
            print("^^^^^Reverse geocoder failed with error" + (error?.localizedDescription)!)
            return
        }
        if !(placemarks!.isEmpty ?? false){
            if let pm = placemarks?.first{
                
                if pm.thoroughfare != nil {
                    addressString = addressString + pm.thoroughfare! + ", "
                }
                if pm.subLocality != nil {
                    addressString = addressString + pm.subLocality! + ", "
                }
                if pm.locality != nil {
                    addressString = addressString + pm.locality! + ", "
                }
                if pm.country != nil {
                    addressString = addressString + pm.country! + ", "
                }
                if pm.postalCode != nil {
                    addressString = addressString + pm.postalCode! + " "
                }
            }
            address(addressString)
            
        }
        else {
            print("Problem with the data received from geocoder")
            return
        }
       
    })
}


// conver  Address to LatLang

func convertAddressTOLatLang(address : String,latlang : @escaping(CLLocation) -> ()) {
    
    var locationCoordinate = CLLocation()
    
    CLGeocoder().geocodeAddressString(address) { (placeMarker, error) in
        if error == nil {
            if let placemark = placeMarker?[0] {
                let location = placemark.location!
                locationCoordinate = location
                print("*****Getting_Location",locationCoordinate)
                 latlang(locationCoordinate)
                return
            }
        }else{
            if let placemark = placeMarker?[0] {
                let location = placemark.location!
                locationCoordinate = location
                print("*****Getting_Location",locationCoordinate)
                 latlang(locationCoordinate)
                return
            }
           
        }
    }
    
    
}

func drawPolyLine(pickupLoc:CLLocation , dropLoc : CLLocation){
    
}
