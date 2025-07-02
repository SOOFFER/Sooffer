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
    
    let googlevm = GoogleVM(view: UIView(), dataService: ApiRoot())
    googlevm.getAddressFromlatLang(origin: "", latlang: coordinates) { (addresss) in
        print("AddressFROMAPI",addresss)
        address(addresss)
    }
    
//    CLGeocoder().reverseGeocodeLocation(coordinates, completionHandler: {(placemarks, error) -> Void in
//         if error != nil {
//            print("^^^^^Reverse geocoder failed with error" + (error?.localizedDescription)!)
//            return
//        }
//        if !(placemarks!.isEmpty ?? false){
//            if let pm = placemarks?.first{
//
//
////                if pm.postalAddress?.street != nil {
////                    addressString = addressString + pm.postalAddress?.street ?? ""
////                }
////                if pm.postalAddress?.subLocality != nil {
////                    addressString = ", " + addressString + pm.postalAddress!.subLocality
////                }
////                if pm.postalAddress?.city != nil {
////                    addressString = ", " + addressString + pm.postalAddress!.city
////                }
////                if pm.postalAddress?.subAdministrativeArea != nil {
////                    addressString = ", " + addressString + pm.postalAddress!.subAdministrativeArea
////                }
////                if pm.postalAddress?.state != nil {
////                    addressString = ", " + addressString + pm.postalAddress!.state
////                }
////                if  pm.postalAddress?.postalCode != nil {
////                    addressString = ", " + addressString +  pm.postalAddress!.postalCode
////                }
////                if  pm.postalAddress?.country != nil {
////                    addressString = ", " + addressString +  pm.postalAddress!.country
////                }
////                addressString = pm.postalAddress!.street + ", " + pm.postalAddress!.subLocality + ", " + pm.postalAddress!.city + ", " + pm.postalAddress!.subAdministrativeArea + ", " + pm.postalAddress!.state + ", " + pm.postalAddress!.postalCode + ", " + pm.postalAddress!.country
//
//               let range: Range<String.Index> = pm.description.range(of: "@")!
//                let index: Int = pm.description.distance(from: pm.description.startIndex, to: range.lowerBound)
//
//                let addressStr : String = pm.description.substring(to: range.lowerBound)
//                let addressArray : Array = addressStr.split(separator: ",") as Array
//                let removeDublicate = addressArray.removeDuplicates()
//                print("AddressDatatatatta",addressStr , removeDublicate , addressArray)
//
//                addressString = addressStr
//
//            }
////            address(addressString)
//        }
//        else {
//            print("Problem with the data received from geocoder")
//            return
//        }
//    })
}


// conver  Address to LatLang

func convertAddressTOLatLang(address : String,latlang : @escaping(CLLocation) -> ()) {
    
    var locationCoordinate = CLLocation()
    
    let googlevm = GoogleVM(view: UIView(), dataService: ApiRoot())
    googlevm.getlatLangFromAddress(origin: "", address: address, latlang: {(latlangs) in
        
        latlang(latlangs)
    })
    
//    CLGeocoder().geocodeAddressString(address) { (placeMarker, error) in
//        if error == nil {
//            if let placemark = placeMarker?[0] {
//                let location = placemark.location!
//                locationCoordinate = location
//                print("*****Getting_Location",locationCoordinate)
//                 latlang(locationCoordinate)
//                return
//            }
//        }else{
//            if let placemark = placeMarker?[0] {
//                let location = placemark.location!
//                locationCoordinate = location
//                print("*****Getting_Location",locationCoordinate)
//                 latlang(locationCoordinate)
//                return
//            }
//        }
//    }
}

func drawPolyLine(pickupLoc:CLLocation , dropLoc : CLLocation){
    
}


func getCurrentLocationFromGeoCoder(loc: CLLocation, completion: @escaping (String) -> Void) {
    var addressLine = ""

    CLGeocoder().reverseGeocodeLocation(loc) { (placemarks, error) in
        if error != nil {
            print("Reverse geocoder failed with error: " + (error?.localizedDescription)!)
            return
        }

        if placemarks?.count != 0 {
            let pm = placemarks![0]
            print("MYcurrent_Location", pm, placemarks![0])

            if addressLine == "" {
                if let name = pm.name {
                    addressLine += "\(name),"
                }
                if let subLocality = pm.subLocality {
                    addressLine += "\(subLocality),"
                }
                if let locality = pm.locality {
                    addressLine += "\(locality),"
                }
                if let subAdministrativeArea = pm.subAdministrativeArea {
                    addressLine += "\(subAdministrativeArea),"
                }
                if let postalCode = pm.postalCode {
                    addressLine += "\(postalCode),"
                }
                if let administrativeArea = pm.administrativeArea {
                    addressLine += "\(administrativeArea),"
                }
                if let country = pm.country {
                    addressLine += "\(country)."
                }

                print("address: \(addressLine)")
                
               // self.gettingLocationAddress = addressLine
                completion(addressLine) // Update the inout parameter
            }
        } else {
            print("Problem with the data received from geocoder")
            completion("")
        }
    }
}
