const moment = require("moment");
const zeropad = require('zeropad');

import TripsModel from '../models/trips.model';
let date = "2018-11-02";
let todayDate = "20181102";

export const doReturnTripNoAsAReadableFormat = async () => {
	let todaysTripCount = await doReturnTodaysTripCount();
	let today = moment().format("YYYYMMDD");
	//today = todayDate;
  	return today + "-" + zeropad(todaysTripCount, 10);
}

export const doReturnTodaysTripCount = async () => {
	let dayStart = moment.utc().startOf('day').toISOString(); 
	let dayEnd = moment.utc().endOf('day').toISOString();
	//dayStart = date + "T00:00:00.000Z";
	//dayEnd = date + "T23:59:59.999Z";
	let whereClause = {
		"createdAt": {
			"$gte": dayStart,
			"$lte": dayEnd
		}
	};
	let tripsDocs = await TripsModel.find(whereClause).sort({ "createdAt": -1 }).limit(0).exec();
	if (tripsDocs.length === 0) {
		return 1;
	} else {
		let todaysTripsLatest = tripsDocs[0].tripno.split("-")[1];
		return parseInt(todaysTripsLatest) + 1;
	}
}