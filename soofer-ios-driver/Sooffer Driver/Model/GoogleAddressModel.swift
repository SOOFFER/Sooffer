//
//  GoogleAddressModel.swift
//  RebuStar Rider
//
//  Created by Abservetech on 06/06/19.
//  Copyright © 2019 Abservetech. All rights reserved.
//

import Foundation
import SwiftyJSON

struct GoogleAddressModel : Codable {
    
    var predictions : [Prediction]?
    var status : String?
    
    
    enum CodingKeys: String, CodingKey {
        case predictions = "predictions"
        case status = "status"
    }
    init(from decoder: Decoder) throws {
        var values = try decoder.container(keyedBy: CodingKeys.self)
        predictions = try values.decodeIfPresent([Prediction].self, forKey: .predictions)
        status = try values.decodeIfPresent(String.self, forKey: .status)
    }
    
    
}


struct Prediction : Codable {
    
    var descriptionField : String?
    var id : String?
    var matchedSubstrings : [MatchedSubstring]?
    var placeId : String?
    var reference : String?
    var structuredFormatting : StructuredFormatting?
    var terms : [Term]?
    var types : [String]?
    
    
    enum CodingKeys: String, CodingKey {
        case descriptionField = "description"
        case id = "id"
        case matchedSubstrings = "matched_substrings"
        case placeId = "place_id"
        case reference = "reference"
        case structuredFormatting
        case terms = "terms"
        case types = "types"
    }
    init(from decoder: Decoder) throws {
        var values = try decoder.container(keyedBy: CodingKeys.self)
        descriptionField = try values.decodeIfPresent(String.self, forKey: .descriptionField)
        id = try values.decodeIfPresent(String.self, forKey: .id)
        matchedSubstrings = try values.decodeIfPresent([MatchedSubstring].self, forKey: .matchedSubstrings)
        placeId = try values.decodeIfPresent(String.self, forKey: .placeId)
        reference = try values.decodeIfPresent(String.self, forKey: .reference)
        structuredFormatting = try StructuredFormatting(from: decoder)
        terms = try values.decodeIfPresent([Term].self, forKey: .terms)
        types = try values.decodeIfPresent([String].self, forKey: .types)
    }
    
    
}


struct Term : Codable {
    
    var offset : Int?
    var value : String?
    
    
    enum CodingKeys: String, CodingKey {
        case offset = "offset"
        case value = "value"
    }
    init(from decoder: Decoder) throws {
        var values = try decoder.container(keyedBy: CodingKeys.self)
        offset = try values.decodeIfPresent(Int.self, forKey: .offset)
        value = try values.decodeIfPresent(String.self, forKey: .value)
    }
    
    
}

struct StructuredFormatting : Codable {
    
    var mainText : String?
    var mainTextMatchedSubstrings : [MatchedSubstring]?
    var secondaryText : String?
    
    
    enum CodingKeys: String, CodingKey {
        case mainText = "main_text"
        case mainTextMatchedSubstrings = "main_text_matched_substrings"
        case secondaryText = "secondary_text"
    }
    init(from decoder: Decoder) throws {
        var values = try decoder.container(keyedBy: CodingKeys.self)
        mainText = try values.decodeIfPresent(String.self, forKey: .mainText)
        mainTextMatchedSubstrings = try values.decodeIfPresent([MatchedSubstring].self, forKey: .mainTextMatchedSubstrings)
        secondaryText = try values.decodeIfPresent(String.self, forKey: .secondaryText)
    }
    
    
}


struct MatchedSubstring : Codable {
    
    var length : Int?
    var offset : Int?
    
    
    enum CodingKeys: String, CodingKey {
        case length = "length"
        case offset = "offset"
    }
    init(from decoder: Decoder) throws {
        var values = try decoder.container(keyedBy: CodingKeys.self)
        length = try values.decodeIfPresent(Int.self, forKey: .length)
        offset = try values.decodeIfPresent(Int.self, forKey: .offset)
    }
    
    
}


struct GoogleDirection  {
    
    var geocodedWaypoints : [GeocodedWaypoint]?
    var routes : [Route]?
    var status : String?
    
    
    init(json : JSON){
        var geocodewaypointArray = json["geocoded_waypoints"].array
        
        var geocodewaypoinList = geocodewaypointArray?.compactMap({ (jsonVal) -> GeocodedWaypoint? in
            return GeocodedWaypoint.init(json: jsonVal)
        })
        self.geocodedWaypoints = geocodewaypoinList ?? [GeocodedWaypoint]()
        
        var routesArray = json["routes"].array
        
        var routesList = routesArray?.compactMap({ (jsonVal) -> Route? in
            return Route.init(json: jsonVal)
        })
        self.routes = routesList ?? [Route]()
        
        self.status = json["status"].string ?? String()
    }
    
}


struct Route  {
    
    var bounds : Bound?
    var copyrights : String?
    var legs : [Leg]?
    var overviewPolyline : Polyline?
    var summary : String?
    var warnings : [String]?
    var waypointOrder : [String]?
    
    init(json : JSON) {
        self.bounds = Bound.init(json: json["bounds"])
        
        self.copyrights = json["copyrights"].string ?? String()
        
        var legsArray = json["legs"].array
        var legsList = legsArray?.compactMap({ (jsonVal) -> Leg? in
            return Leg.init(json: jsonVal)
        })
        self.legs = legsList ?? [Leg]()
        
        self.overviewPolyline = Polyline.init(json: json["overview_polyline"])
        
    }
    
}

struct Leg  {
    
    var distance : Distance?
    var duration : Distance?
    var endAddress : String?
    var endLocation : Northeast?
    var startAddress : String?
    var startLocation : Northeast?
    var steps : [Step]?
    var trafficSpeedEntry  : [String] = [String]()
     var viaWaypoint : [String] = [String]()
    
    init(json : JSON) {
        self.distance = Distance(json: json["distance"])
        self.duration = Distance(json: json["duration"])
        self.endAddress = json["end_address"].string ?? String()
        self.endLocation = Northeast(json : json["end_location"])
        self.startAddress = json["start_address"].string ?? String()
        self.startLocation = Northeast(json : json["start_location"])
        var stepsArray = json["steps"].array
        var stepsList = stepsArray?.compactMap({ (jsonVal) -> Step? in
            return Step.init(json: jsonVal)
        })
        self.steps = stepsList ?? [Step]()
        self.trafficSpeedEntry = json["traffic_speed_entry"].array as? [String] ?? [String]()
        self.viaWaypoint = json["via_waypoint"].array as? [String] ?? [String]()

        
    }
    
    
}


struct Step  {
    
    var distance : Distance?
    var duration : Distance?
    var endLocation : Northeast?
    var htmlInstructions : String?
    var maneuver : String?
    var polyline : Polyline?
    var startLocation : Northeast?
    var travelMode : String?
    
    init(json : JSON) {
        self.distance = Distance(json: json["distance"])
        self.duration = Distance(json: json["duration"])
        self.endLocation = Northeast(json : json["end_location"])
        self.startLocation = Northeast(json : json["start_location"])
        self.htmlInstructions = json["html_instructions"].string ?? String()
        self.maneuver = json["maneuver"].string ?? String()
        self.travelMode = json["travel_mode"].string ?? String()
        self.polyline = Polyline.init(json: json["polyline"])
        
    }
    
}



struct Polyline  {
    
    var points : String?
 
    init(json :JSON){
        self.points = json["points"].string ?? String()
    }
}

struct Distance  {
    
    var text : String?
    var value : Int?
  
    init(json :JSON){
        self.text = json["text"].string ?? String()
        self.value = json["value"].int ?? Int()
    }
}



struct Bound  {
    
    var northeast : Northeast?
    var southwest : Northeast?
    
    init(json :JSON){
        self.northeast = Northeast(json: json["northeast"])
        self.southwest = Northeast(json: json["southwest"])
    }
}


struct Northeast  {
    
    var lat : Float?
    var lng : Float?
    
    
    init(json :JSON){
        self.lat = json["lat"].float ?? Float()
        self.lng = json["lng"].float ?? Float()
    }
}



struct GeocodedWaypoint  {
    
    var geocoderStatus : String?
    var placeId : String?
    var types : [String] = [String]()
    
    
    init(json :JSON){
        self.geocoderStatus = json["geocoder_status"].string ?? String()
        self.placeId = json["place_id"].string ?? String()
        self.types = json["types"].array as? [String] ?? [String]()
    }
    
}



struct AutoAddressModel {
    var status : String = String()
    var addressList : [AutoAddress] = [AutoAddress]()
    
    init(json : JSON) {
        let addressArray = json["predictions"].array
        let addressList = addressArray?.compactMap({ (jsonVal) -> AutoAddress? in
            return AutoAddress.init(json: jsonVal)
        })
        self.addressList = addressList ?? [AutoAddress]()
        self.status = json["status"].string ?? String()
    }
}

struct  AutoAddress {
    var description : String?
    var id : String?
    var place_id : String?
    var reference : String?
    var types : [String] = [String]()
    var matchedsubstrings : [matchedSubstrings] = [matchedSubstrings]()
    
    var structuredformatting : structuredFormatting?
    
    init(json : JSON) {
        self.description = json["description"].string ?? String()
        self.id = json["id"].string ?? String()
        self.place_id = json["place_id"].string ?? String()
        self.reference = json["reference"].string ?? String()
        self.types = json["types"].array as? [String] ?? [String]()
        
        let addressArray = json["matched_substrings"].array
        let addressList = addressArray?.compactMap({ (jsonVal) -> matchedSubstrings? in
            return matchedSubstrings.init(json: jsonVal)
        })
        self.matchedsubstrings = addressList ?? [matchedSubstrings]()
        
        self.structuredformatting = structuredFormatting.init(json: json["structured_formatting"])
    }
}

class matchedSubstrings{
    var length : Int = Int()
    var offset : Int = Int()
     init(json : JSON) {
        self.length = json["length"].int ?? Int()
        self.offset = json["offset"].int ?? Int()
    }
}

class structuredFormatting{
    var main_text : String?
    var secondary_text : String?
    var main_text_matched_substrings : [matchedSubstrings] = [matchedSubstrings]()
    
    init(json : JSON) {
        self.main_text = json["main_text"].string ?? String()
        self.secondary_text = json["secondary_text"].string ?? String()
        let addressArray = json["main_text_matched_substrings"].array
        let addressList = addressArray?.compactMap({ (jsonVal) -> matchedSubstrings? in
            return matchedSubstrings.init(json: jsonVal)
        })
        self.main_text_matched_substrings = addressList ?? [matchedSubstrings]()
        
    }
}
