const moment = require("moment");

import OutstationOnewayTripAvailableDropCities from '../models/outstationOnewayTripAvailableDropCities.model';

import { getServiceBasicfareForDailyRides } from '../controllers/app';
import * as GFunctions from '../controllers/functions';
import * as commonController from "../controllers/common";

export const getServiceBasicfareForOutStation = async (req, res) => {
	let response = await getServiceBasicfareForDailyRides(req, res);

	if(!response["success"]) {
		return response;
	}
	//console.log(JSON.stringify(response));
	if (
		response["data"]["cityLimitCalculation"]["isServiceAvailable"] 
		&& response["data"]["cityLimitCalculation"]["reference"]["details"]["pickup"]["city"] !== "" 
		&& response["data"]["cityLimitCalculation"]["reference"]["details"]["drop"]["city"] !== "" 
		&& response["data"]["cityLimitCalculation"]["reference"]["details"]["pickup"]["city"] === response["data"]["cityLimitCalculation"]["reference"]["details"]["drop"]["city"]
	) {
		return {'success':false,'message':'Destination city cannot be same as Pick up city for Outstation rides. Please change the destination to proceed further.'};
	}
	
	response["data"]["outstation"] = {};
	response["data"]["outstation"]["isOneWayTripAvailableForRequestedDropLocation"] = await doCheckOneWayTripAvailableForRequestedDropLocation(response["data"]["cityLimitCalculation"]["reference"]["details"]["drop"]["city"]);

	let commonSettingsDocResponse = await commonController.getCommonSettings("", "", false);
	let commonSettingsDoc;
	if (commonSettingsDocResponse["success"] === true) {
		commonSettingsDoc = commonSettingsDocResponse["data"][0];
	} else {
		return commonSettingsDocResponse;
	}
	
	let outStation = commonSettingsDoc["outStation"];
	delete outStation["$init"];

	if (outStation["minimumDistanceAllowedInKMsBetweenPickupAndDropLocations"] < response["data"]["cityLimitCalculation"]["reference"]["distanceInKMsBetweenPickupAndDropLocations"]) {
		return {'success':false,'message':'Your destination is too far away for booking an Outstation. Please choose a closer destination.'};
	}	

	outStation["approximate"] = {};
	if (commonSettingsDoc["benefitsGoToWhom"] === "default") {
		outStation["actualRunningDistanceInKMs"] = parseFloat(parseFloat(response["data"]["cityLimitCalculation"]["reference"]["distanceInKMsBetweenPickupAndDropLocations"] * 2).toFixed(2));
	} else if (commonSettingsDoc["benefitsGoToWhom"] === "rider") {
		outStation["actualRunningDistanceInKMs"] = Math.floor(response["data"]["cityLimitCalculation"]["reference"]["distanceInKMsBetweenPickupAndDropLocations"] * 2);
	} else if (commonSettingsDoc["benefitsGoToWhom"] === "driver") {
		outStation["actualRunningDistanceInKMs"] = Math.ceil(response["data"]["cityLimitCalculation"]["reference"]["distanceInKMsBetweenPickupAndDropLocations"] * 2);
	}
	outStation["actualRunningTimeInSeconds"] = response["data"]["cityLimitCalculation"]["reference"]["timeInSecondsBetweenPickupAndDropLocations"];
	
	if (outStation["minimumRunningKMs"] < outStation["actualRunningDistanceInKMs"]) {
		outStation["approximate"]["runningDistanceInKMs"] = outStation["actualRunningDistanceInKMs"];
	} else {
		outStation["approximate"]["runningDistanceInKMs"] = outStation["minimumRunningKMs"];
	}

	if (outStation["minimumRunningTimeInSeconds"] < response["data"]["cityLimitCalculation"]["reference"]["timeInSecondsBetweenPickupAndDropLocations"]) {
		outStation["approximate"]["runningTimeInSeconds"] = response["data"]["cityLimitCalculation"]["reference"]["timeInSecondsBetweenPickupAndDropLocations"];
		outStation["approximate"]["runningTimeInDaysHoursMinutesAndSeconds"] = response["data"]["cityLimitCalculation"]["reference"]["timeInDaysHoursMinutesAndSecondsBetweenPickupAndDropLocations"];
	} else {
		outStation["approximate"]["runningTimeInSeconds"] = outStation["minimumRunningTimeInSeconds"];
		outStation["approximate"]["runningTimeInDaysHoursMinutesAndSeconds"] = await GFunctions.secondsToDaysHoursMinutesAndSeconds(outStation["minimumRunningTimeInSeconds"]);
	}

	response["data"]["outstation"] = Object.assign({}, response["data"]["outstation"], outStation);

	return response;	
}

export const doCheckOneWayTripAvailableForRequestedDropLocation = async (requestedDropCity) => {
	let findQueryWhereOr = {
		"$or": [
			{
				"city": requestedDropCity
			},
			{
				"cityCode": requestedDropCity // In future, city code may be passed to this method and used in this or condition. Thats why we used "cityCode" also.
			}
		]
	};
	let oneWayAvailableCities = await OutstationOnewayTripAvailableDropCities.find(findQueryWhereOr, { "_id": 0 }).exec();

	if (oneWayAvailableCities.length) return true;
	else return false;
}

export const doCalculateFareForOutstationRoundTrip = async (argumentsObj) => {
	//console.log(argumentsObj);
	let dateFormat = argumentsObj["outstation"]["dateFormat"];
	let timeFormat = argumentsObj["outstation"]["timeFormat"];

	let departDate = argumentsObj["bookingDetails"]["departDate"];
	let departTime = argumentsObj["bookingDetails"]["departTime"];
	let returnDate = argumentsObj["bookingDetails"]["returnDate"];
	let returnTime = argumentsObj["bookingDetails"]["returnTime"];

	let departDateAndTimeMomentObj = moment(departDate + " " + departTime, dateFormat + " " + timeFormat);
	let returnDateAndTimeMomentObj = moment(returnDate + " " + returnTime, dateFormat + " " + timeFormat);

	let outstation = argumentsObj["outstation"];

	let seconds = moment.duration(returnDateAndTimeMomentObj.diff(departDateAndTimeMomentObj)).asSeconds();
	argumentsObj["bookingDetails"]["selectedDurationByRiderInSeconds"] = seconds;

	let runningTimeInDaysHoursMinutesSeconds = await GFunctions.secondsToDaysHoursMinutesAndSeconds(seconds);
	argumentsObj["bookingDetails"]["selectedDurationByRiderInDaysHoursMinutesAndSeconds"] = runningTimeInDaysHoursMinutesSeconds;

	let nightTimeObj = argumentsObj["nightHoursDetails"]["time"];

	argumentsObj["fareDetails"]["ratePerKM"] = argumentsObj["cityBasedVehicleDetails"]["perKMRate"];
	let nightTimeAllowancePerNight = argumentsObj["cityBasedVehicleDetails"]["nightHoursCharge"];
	let distanceInKMPerHourForRemainingKMs = argumentsObj["cityBasedVehicleDetails"]["distanceInKMPerHourForRemainingKMs"];

	let commonSettingsDocResponse = await commonController.getCommonSettings("", "", false);
	let commonSettingsDoc;
	if (commonSettingsDocResponse["success"] === true) {
		commonSettingsDoc = commonSettingsDocResponse["data"][0];
	}

	let ratePerHourForExtraHours = commonSettingsDoc["outStation"]["ratePerHourForExtraHours"];
	let ratePerKMForExtraKMs = commonSettingsDoc["outStation"]["ratePerKMForExtraKMs"];
	let driverAllowancePerDay = commonSettingsDoc["outStation"]["driverAllowancePerDay"];

	//calculation for driver allowance 
	let daysCountForDriverAllowance = runningTimeInDaysHoursMinutesSeconds["inDetail"]["days"];
	if (runningTimeInDaysHoursMinutesSeconds["inDetail"]["hours"] > 0) {
		daysCountForDriverAllowance++;
	}
	argumentsObj["fareDetails"]["taxesAndFeesInDetail"]["driverAllowance"] = (driverAllowancePerDay * daysCountForDriverAllowance);
	//calculation for driver allowance 

	// calculation for night time allowance
	let departDateTimeAndReturnDateTimeObj = {
		"departDate": departDate,
		"departTime": departTime,
		"returnDate": returnDate,
		"returnTime": returnTime
	};
	let nightHoursCount = await GFunctions.doCalculateNightHoursExistBetweenTwoDateRanges(nightTimeObj, departDateTimeAndReturnDateTimeObj, dateFormat, timeFormat);
	argumentsObj["fareDetails"]["taxesAndFeesInDetail"]["nightTimeAllowance"] = nightHoursCount * nightTimeAllowancePerNight;
	// calculation for night time allowance
	
	if (outstation["actualRunningDistanceInKMs"] <= outstation["minimumRunningKMs"]) {
		if (outstation["minimumRunningTimeInSeconds"] === argumentsObj["bookingDetails"]["selectedDurationByRiderInSeconds"]) {
			argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] = parseFloat(parseFloat(outstation["approximate"]["runningDistanceInKMs"]).toFixed(2));
			argumentsObj["fareDetails"]["baseFare"] = (argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] * argumentsObj["fareDetails"]["ratePerKM"]);
		} else if (outstation["minimumRunningTimeInSeconds"] < argumentsObj["bookingDetails"]["selectedDurationByRiderInSeconds"]) {
			let differenceInSecondsBetweenMinimumRunningTimeAndSelectedDuration = argumentsObj["bookingDetails"]["selectedDurationByRiderInSeconds"] - outstation["minimumRunningTimeInSeconds"];
			let differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration = await GFunctions.secondsToDaysHoursMinutesAndSeconds(differenceInSecondsBetweenMinimumRunningTimeAndSelectedDuration);
			//console.log(differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration);

			argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] = parseFloat(parseFloat(outstation["approximate"]["runningDistanceInKMs"] + 
			( differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration["inDetail"]["days"] * 24 * distanceInKMPerHourForRemainingKMs ) + 
			( differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration["inDetail"]["hours"] * distanceInKMPerHourForRemainingKMs ) + 
			( differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration["inDetail"]["minutes"] * distanceInKMPerHourForRemainingKMs / 60 )).toFixed(2));

			argumentsObj["fareDetails"]["baseFare"] = parseFloat(parseFloat( argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] * 10 ).toFixed(2));
		}
	} else {
		if (outstation["minimumRunningTimeInSeconds"] === argumentsObj["bookingDetails"]["selectedDurationByRiderInSeconds"]) {
			argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] = parseFloat(parseFloat(outstation["minimumRunningKMs"]).toFixed(2));
			argumentsObj["fareDetails"]["baseFare"] = parseFloat(parseFloat(argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] * argumentsObj["fareDetails"]["ratePerKM"]).toFixed(2));

			 // argumentsObj["fareDetails"]["remainingKMsInKMsExceptDistanceForBaseFare"]
			argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] += parseFloat(parseFloat(outstation["actualRunningDistanceInKMs"]).toFixed(2) - parseFloat(outstation["minimumRunningKMs"]).toFixed(2));
			argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] = parseFloat(parseFloat(argumentsObj["fareDetails"]["distanceInKMsForBaseFare"]).toFixed(2));
			// argumentsObj["fareDetails"]["remainingKMsInKMsExceptDistanceForBaseFare"]

			// argumentsObj["fareDetails"]["fareForRemainingKMs"]
			argumentsObj["fareDetails"]["baseFare"] = parseFloat(parseFloat(parseFloat(argumentsObj["fareDetails"]["distanceInKMsForBaseFare"]).toFixed(2) * parseFloat(argumentsObj["fareDetails"]["ratePerKM"]).toFixed(2)).toFixed(2));
			// argumentsObj["fareDetails"]["fareForRemainingKMs"]
		} else if (outstation["minimumRunningTimeInSeconds"] < argumentsObj["bookingDetails"]["selectedDurationByRiderInSeconds"]) {
			let differenceInSecondsBetweenMinimumRunningTimeAndSelectedDuration = argumentsObj["bookingDetails"]["selectedDurationByRiderInSeconds"] - outstation["minimumRunningTimeInSeconds"];
			let differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration = await GFunctions.secondsToDaysHoursMinutesAndSeconds(differenceInSecondsBetweenMinimumRunningTimeAndSelectedDuration);
			//console.log(differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration);

			argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] = parseFloat(parseFloat(outstation["minimumRunningKMs"] + 
			( differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration["inDetail"]["days"] * 24 * distanceInKMPerHourForRemainingKMs ) + 
			( differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration["inDetail"]["hours"] * distanceInKMPerHourForRemainingKMs ) + 
			( differenceInDaysHoursMinutesAndSecondsBetweenMinimumRunningTimeAndSelectedDuration["inDetail"]["minutes"] * distanceInKMPerHourForRemainingKMs / 60 )).toFixed(2));

			argumentsObj["fareDetails"]["baseFare"] = parseFloat(parseFloat( argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] * 10 ).toFixed(2));

			// argumentsObj["fareDetails"]["remainingKMsInKMsExceptDistanceForBaseFare"]
			argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] += parseFloat(parseFloat(parseFloat(outstation["actualRunningDistanceInKMs"]).toFixed(2) - parseFloat(argumentsObj["fareDetails"]["distanceInKMsForBaseFare"]).toFixed(2)).toFixed(2));
			argumentsObj["fareDetails"]["distanceInKMsForBaseFare"] = parseFloat(parseFloat(argumentsObj["fareDetails"]["distanceInKMsForBaseFare"]).toFixed(2));
			// argumentsObj["fareDetails"]["remainingKMsInKMsExceptDistanceForBaseFare"]

			// argumentsObj["fareDetails"]["fareForRemainingKMs"]
			argumentsObj["fareDetails"]["baseFare"] = parseFloat(parseFloat(parseFloat(argumentsObj["fareDetails"]["distanceInKMsForBaseFare"]).toFixed(2) * parseFloat(argumentsObj["fareDetails"]["ratePerKM"]).toFixed(2)).toFixed(2));
			// argumentsObj["fareDetails"]["fareForRemainingKMs"]
		}
	}
	
	argumentsObj["fareDetails"]["totalTaxesAndFees"] = parseFloat(parseFloat(argumentsObj["fareDetails"]["taxesAndFeesInDetail"]["driverAllowance"] + argumentsObj["fareDetails"]["taxesAndFeesInDetail"]["nightTimeAllowance"] + argumentsObj["fareDetails"]["taxesAndFeesInDetail"]["taxes"]).toFixed(2));

	argumentsObj["fareDetails"]["totalEstimatedFare"] = parseFloat(parseFloat(argumentsObj["fareDetails"]["baseFare"] + argumentsObj["fareDetails"]["fareForRemainingKMs"] + argumentsObj["fareDetails"]["totalTaxesAndFees"]).toFixed(2));
}