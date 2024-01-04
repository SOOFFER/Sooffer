let NodeGeocoder = require('node-geocoder');
let ucfirst = require('ucfirst');
let turf = require('@turf/turf');
let geolib = require("geolib");
let isValidCoordinates = require('is-valid-coordinates');

let config = require('../config');
import serviceAvailableCities from '../models/serviceAvailableCities.model';

import * as GFunctions from '../controllers/functions';
import * as commonController from "../controllers/common";
const labelTexts = require('../helpers/labels.helper');
import logger from './logger';

let NodeGeocoderOptions = {
  provider: 'google',
  httpAdapter: 'https', // Default
  apiKey: config.googleApi, // for Mapquest, OpenCage, Google Premier
  formatter: 'json' // 'gpx', 'string', ...
};

export const doCalculateCityLimitForAlert = async (coords, data, distanceBeyondCityLimitForAlertToADriver, isAlertEnabled, isDoubleChargeNeeded, benefitsGoToWhom, tripType = "daily", calledFrom = "") => {

	let commonSettingsDocResponse = await commonController.getCommonSettings("", "", false);
	let commonSettingsDoc;
	if (commonSettingsDocResponse["success"] === true) {
		commonSettingsDoc = commonSettingsDocResponse["data"][0];
	}

	let dropResponse;
	let pickupResponse
	
	pickupResponse = await findCityAndGetCityBoundary(coords["pickup"]["lat"], coords["pickup"]["lng"], "pickup");

	if (
		tripType === "outstation" 
		|| (
			tripType === "daily" 
			&& coords["drop"]["lat"] !== "" 
			&& coords["drop"]["lng"] !== "" 
			&& isValidCoordinates(coords["drop"]["lat"] = parseFloat(coords["drop"]["lat"]), coords["drop"]["lng"] = parseFloat(coords["drop"]["lng"]))
		)
	) {
		dropResponse = await findCityAndGetCityBoundary(coords["drop"]["lat"], coords["drop"]["lng"], "drop");
	}

	let dataCityLimitCalculation = {
		"cityLimitCalculation": {
			"isServiceAvailable": true,
			"shouldFrontendShowCityLimitAlert": false,
			"shouldFrontendShowOutStationAlert": false,
			"distanceInKMsBetweenNearestCityLimitAndDropLocations": 0,
			"isDoubleChargeNeeded": isDoubleChargeNeeded,
			"reference": {
				"distanceBeyondCityLimitForAlertToADriver": distanceBeyondCityLimitForAlertToADriver,
				"isAlertEnabledForCityLimitCalculation": isAlertEnabled,
				"isPickupLocationLocatedWithinCityLimit": true,
				"isDropLocationCrossedCityLimit": false,
				"isDropLocationCrossedASpecifiedDistanceBeyondCityLimit": false,
				"distanceInKMsBetweenPickupAndDropLocations": 0,
				"timeInSecondsBetweenPickupAndDropLocations": 0,
				"timeInDaysHoursMinutesAndSecondsBetweenPickupAndDropLocations": {
					"maxDays": 0,
					"maxHours": 0,
					"inDetail": {
						"days": 0,
						"hours": 0,
						"minutes": 0,
						"seconds": 0
					}
				},
				"details": {
					"pickup": {
						"coords": {
							"latitude": coords["pickup"]["lat"],
							"longitude": coords["pickup"]["lng"]
						},
						"address": typeof pickupResponse === "undefined" ? "" : pickupResponse["address"],
						"city": typeof pickupResponse === "undefined" ? "" : pickupResponse["city"],
						"serviceAvailableCity": "",
						"cityCode": "",
						"message": ""
					},
					"drop": {
						"coords": {
							"latitude": coords["drop"]["lat"],
							"longitude": coords["drop"]["lng"]
						},
						"address": typeof dropResponse === "undefined" ? "" : dropResponse["address"],
						"city": typeof dropResponse === "undefined" ? "" : dropResponse["city"],
						"serviceAvailableCity": "",
						"cityCode": "",
						"message": ""
					},
					"vertex": {
						"coords": {
							"latitude": 0,
							"longitude": 0
						},
						"message": ""
					}
				}
			}
		}
	};

	data = Object.assign({}, data, dataCityLimitCalculation);

	// Check pickup location's response is empty.
	if (!pickupResponse["data"].length) {
		if (commonSettingsDoc["isServiceAvailabilityCheckNeeded"]) {
			data["cityLimitCalculation"]["reference"]["details"]["pickup"]["message"] = "Service is not available.";
			data["cityLimitCalculation"]["isServiceAvailable"] = data["cityLimitCalculation"]["reference"]["isPickupLocationLocatedWithinCityLimit"] = false;
		}
		return data;
	}
	// Check pickup location's response is empty.

	// console.log('mkmk23', pickupResponse["data"][0]["city"]);
	data["cityLimitCalculation"]["reference"]["details"]["pickup"]["serviceAvailableCity"] = pickupResponse["data"][0]["city"];
	data["cityLimitCalculation"]["reference"]["details"]["pickup"]["cityCode"] = pickupResponse["data"][0]["cityCode"];


	if (
		calledFrom === "getServiceBasicFare" 
		&& (
			tripType === "rental" 
			|| (
				tripType === "daily" 
				&& (
					coords["drop"]["lat"] === "" 
					|| coords["drop"]["lng"] === "" 
					|| !isValidCoordinates(coords["drop"]["lat"] = parseFloat(coords["drop"]["lat"]), coords["drop"]["lng"] = parseFloat(coords["drop"]["lng"]))
				)
			)
		)
	) {
		return data;
	}
  	
	let pickupCoords = coords["pickup"]["lat"] + ',' + coords["pickup"]["lng"];
	let dropCoords = coords["drop"]["lat"] + ',' + coords["drop"]["lng"];

	let dropPoint = [ coords["drop"]["lng"], coords["drop"]["lat"] ];

	let gdmResult = await GFunctions.getDistanceAndTimeFromGDM([pickupCoords], [dropCoords]);
	//console.log(gdmResult);
	data["cityLimitCalculation"]["reference"]["timeInSecondsBetweenPickupAndDropLocations"] = gdmResult.timeValue;
	data["cityLimitCalculation"]["reference"]["timeInDaysHoursMinutesAndSecondsBetweenPickupAndDropLocations"] = await GFunctions.secondsToDaysHoursMinutesAndSeconds(gdmResult.timeValue);

	let distanceInKMsBetweenPickupAndDropLocations;
	if (benefitsGoToWhom === "default") {
		distanceInKMsBetweenPickupAndDropLocations = parseFloat(parseFloat(gdmResult.distanceValue / 1000).toFixed(2));
	} else if (benefitsGoToWhom === "rider") {
		distanceInKMsBetweenPickupAndDropLocations = Math.floor(gdmResult.distanceValue * 0.001);
	} else if (benefitsGoToWhom === "driver") {
		distanceInKMsBetweenPickupAndDropLocations = Math.ceil(gdmResult.distanceValue * 0.001);
	}
	data["cityLimitCalculation"]["reference"]["distanceInKMsBetweenPickupAndDropLocations"] = distanceInKMsBetweenPickupAndDropLocations;

	// Check pickup location is within city limit.
	let polygonCoords = pickupResponse["data"][0].cityBoundaryPolygon;

	let polyconCoordsForGoogleApi = [];

	for(let i = 0; i < polygonCoords[0].length; i++) {
	  polyconCoordsForGoogleApi[i] = { latitude: polygonCoords[0][i][1], longitude: polygonCoords[0][i][0] };
	}

	let isPickupPointWithinPolygon = geolib.isPointInside({latitude: coords["pickup"]["lat"], longitude: coords["pickup"]["lng"]}, polyconCoordsForGoogleApi);

	if (!isPickupPointWithinPolygon) {
		if (commonSettingsDoc["isServiceAvailabilityCheckNeeded"]) {
			// console.log('Here1')
			data["cityLimitCalculation"]["reference"]["details"]["pickup"]["message"] = "Pickup location is not located within the city limit.";
			data["cityLimitCalculation"]["isServiceAvailable"] = data["cityLimitCalculation"]["reference"]["isPickupLocationLocatedWithinCityLimit"] = true; //ORI false
		}
	}
	// Check pickup location is within city limit.

	if (!dropResponse["data"].length) {
		data["cityLimitCalculation"]["reference"]["details"]["drop"]["message"] = "Drop location is not available in the city list.";
	} else {
		polygonCoords = dropResponse["data"][0].cityBoundaryPolygon;
		data["cityLimitCalculation"]["reference"]["details"]["drop"]["serviceAvailableCity"] = dropResponse["data"][0]["city"];
		data["cityLimitCalculation"]["reference"]["details"]["drop"]["cityCode"] = dropResponse["data"][0]["cityCode"];
	}
	
	for(let i = 0; i < polygonCoords[0].length; i++ ) {
	  polyconCoordsForGoogleApi[i] = { latitude: polygonCoords[0][i][1], longitude: polygonCoords[0][i][0] };
	}

	let isDropPointWithinPolygon = geolib.isPointInside({latitude: coords["drop"]["lat"], longitude: coords["drop"]["lng"]}, polyconCoordsForGoogleApi);
	data["cityLimitCalculation"]["reference"]["isDropLocationCrossedCityLimit"] = !isDropPointWithinPolygon;

	let polygon = turf.polygon(polygonCoords);
	let vertices = turf.explode(polygon);
	let closestVertex = turf.nearest(dropPoint, vertices);

	data["cityLimitCalculation"]["reference"]["details"]["vertex"]["coords"]["latitude"] = closestVertex["geometry"]["coordinates"][1];
	data["cityLimitCalculation"]["reference"]["details"]["vertex"]["coords"]["longitude"] = closestVertex["geometry"]["coordinates"][0];
	
	gdmResult = await GFunctions.getDistanceAndTimeFromGDM([dropCoords], [ closestVertex["geometry"]["coordinates"][1] + ',' + closestVertex["geometry"]["coordinates"][0] ]);

	let distanceInKMsBetweenNearestCityLimitAndDropLocations;
	if (benefitsGoToWhom === "default") {
		distanceInKMsBetweenNearestCityLimitAndDropLocations = parseFloat(parseFloat(gdmResult.distanceValue * 0.001).toFixed(2));
	} else if (benefitsGoToWhom === "rider") {
		distanceInKMsBetweenNearestCityLimitAndDropLocations = Math.floor(gdmResult.distanceValue * 0.001);
	} else if (benefitsGoToWhom === "driver") {
		distanceInKMsBetweenNearestCityLimitAndDropLocations = Math.ceil(gdmResult.distanceValue * 0.001);
	}

	data["cityLimitCalculation"]["distanceInKMsBetweenNearestCityLimitAndDropLocations"] = distanceInKMsBetweenNearestCityLimitAndDropLocations;

	data["cityLimitCalculation"]["reference"]["isDropLocationCrossedASpecifiedDistanceBeyondCityLimit"] = data["cityLimitCalculation"]["distanceInKMsBetweenNearestCityLimitAndDropLocations"] > data["cityLimitCalculation"]["reference"]["distanceBeyondCityLimitForAlertToADriver"];

	// It is important. Based on this only, frontend will decide to show alert.
	data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = data["cityLimitCalculation"]["reference"]["isAlertEnabledForCityLimitCalculation"] && data["cityLimitCalculation"]["reference"]["isDropLocationCrossedCityLimit"];

	// conditions
	if (isPickupPointWithinPolygon && isDropPointWithinPolygon) {
		data["cityLimitCalculation"]["distanceInKMsBetweenNearestCityLimitAndDropLocations"] = 0;
		data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = false;
		data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = false;
		/*if (pickupResponse["city"] === dropResponse["city"]) {
			data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = false;
			data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = false;
		} else {
			data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = true;
			data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = true;
		}*/
	} else if (isPickupPointWithinPolygon && !isDropPointWithinPolygon) {
		if (pickupResponse["city"] === dropResponse["city"]) {
			data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = true;
			data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = data["cityLimitCalculation"]["reference"]["isDropLocationCrossedASpecifiedDistanceBeyondCityLimit"];
			if (data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"]) {
				data["cityLimitCalculation"]["distanceInKMsBetweenNearestCityLimitAndDropLocations"] = 0;
			}
		} else {
			data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = false;
			data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = false;
			data["cityLimitCalculation"]["distanceInKMsBetweenNearestCityLimitAndDropLocations"] = 0;
		}
	} else if (!isPickupPointWithinPolygon && isDropPointWithinPolygon) {
		data["cityLimitCalculation"]["distanceInKMsBetweenNearestCityLimitAndDropLocations"] = 0;
		if (pickupResponse["city"] === dropResponse["city"]) {
			data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = false;
			data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = false;
		} else {
			data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = false;
			data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = false;
		}
	} else if (!isPickupPointWithinPolygon && !isDropPointWithinPolygon) {
		data["cityLimitCalculation"]["distanceInKMsBetweenNearestCityLimitAndDropLocations"] = 0;
		if (pickupResponse["city"] === dropResponse["city"]) {
			data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = false;
			data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = false;
		} else {
			data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"] = false;
			data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"] = false;
		}
	}

	if (data["cityLimitCalculation"]["shouldFrontendShowOutStationAlert"]) {
		data["cityLimitCalculation"]["reference"]["details"]["drop"]["message"] = labelTexts.OutStationAlert;
	} else if (data["cityLimitCalculation"]["shouldFrontendShowCityLimitAlert"]) {
		data["cityLimitCalculation"]["reference"]["details"]["drop"]["message"] = "Your drop location crossed City Limit.";
	}
	// conditions

	return data;
}

/**
 * @v2TODO check is working for all types
 * Return approx City 
 * @param {*} lat 
 * @param {*} lon 
 * @param {*} pickupOrDrop 
 */
export const findCityAndAddress = async (lat, lon, pickupOrDrop) => {
	try{
	let geocoder = NodeGeocoder(NodeGeocoderOptions);

	const geoCoderResult = await geocoder.reverse(
		{ 
			lat: lat, 
			lon: lon 
		}
	);

	let increment = 0;
	let actualCity = "";
	let city = "";
	let neighborhood = "";
	let level2long = "";
	let level2short = "";
	let level1long = "";
	let level1short = "";

	if (
		typeof geoCoderResult[0] !== "undefined" 
		&& typeof geoCoderResult[0].city !== "undefined"
	) {
		city = ucfirst(geoCoderResult[0].city); 

		if (actualCity === "") {
			actualCity = city;
		}
	}

	if(
		typeof geoCoderResult[0] !== "undefined" 
		&& typeof geoCoderResult[0].extra !== "undefined" 
		&& typeof geoCoderResult[0].extra.neighborhood !== "undefined"
	) {
		neighborhood = ucfirst(geoCoderResult[0].extra.neighborhood); 
		if (actualCity === "") {
			actualCity = neighborhood;
		}
	} 

	if(
		typeof geoCoderResult[0] !== "undefined" 
		&& typeof geoCoderResult[0].administrativeLevels !== "undefined" 
		&& typeof geoCoderResult[0].administrativeLevels.level2long !== "undefined"
	) {
		level2long = ucfirst(geoCoderResult[0].administrativeLevels.level2long); 
		if (actualCity === "") {
			actualCity = level2long;
		}
	}

	if(
		typeof geoCoderResult[0] !== "undefined" 
		&& typeof geoCoderResult[0].administrativeLevels !== "undefined" 
		&& typeof geoCoderResult[0].administrativeLevels.level2short !== "undefined"
	) {
		level2short = ucfirst(geoCoderResult[0].administrativeLevels.level2short); 
		if (actualCity === "") {
			actualCity = level2short;
		}
	}

	if(
		typeof geoCoderResult[0] !== "undefined" 
		&& typeof geoCoderResult[0].administrativeLevels !== "undefined" 
		&& typeof geoCoderResult[0].administrativeLevels.level1long !== "undefined"
	) {
		level1long = ucfirst(geoCoderResult[0].administrativeLevels.level1long); 
		if (actualCity === "") {
			actualCity = level1long;
		}
	}

	if(
		typeof geoCoderResult[0] !== "undefined" 
		&& typeof geoCoderResult[0].administrativeLevels !== "undefined" 
		&& typeof geoCoderResult[0].administrativeLevels.level1short !== "undefined"
	) {
		level1short = ucfirst(geoCoderResult[0].administrativeLevels.level1short); 
		if (actualCity === "") {
			actualCity = level1short;
		}
	}
	 
	let returnObj = { 
		"city": actualCity,
		"address": geoCoderResult[0].formattedAddress
	};


		return returnObj;
	} catch (error){
		logger.error(error);
		return { "city": '', "address":'' }
	}
	 
} 