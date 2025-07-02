// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/map";
import { AppSettings } from "../../app.config";
import { ProgressSpinnerMode } from "@angular/material";

// import 'rxjs/add/operator/toPromise';

@Injectable()
export class TableService {
  organisations() {
    throw new Error("Method not implemented.");
  }
  observable_api_state() {
    throw new Error("Method not implemented.");
  }
  jobsSubscribe(arg0: (jobs: any[]) => void) {
    throw new Error("Method not implemented.");
  }

  constructor(private http: HttpClient) { }
  data: any = [];
  allvehicletypes(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "allvehicletypes/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getDrivertaxi(id): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "getDriverVehicleList/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getNotifications() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "testToken")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  payoutviarazorpay(data) {
    return this.http
      .post(AppSettings.API_ENDPOINT + "driverPayouts", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getlang(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "listLanguage")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getStripe(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "featuresSettings")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateStrike(data): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "featuresSettings", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  addnewdocs(addData: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "cancelReasonFromDB/", addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateddocs(id: any, inputs: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "cancelReasonFromDB/" + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updaterecord(updateData: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "cancelReasonFromDB/", updateData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  RefreshVehicle() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "refreshFromAdmin")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  AddPackageType(data: any) {
    return this.http
      .post(AppSettings.API_ENDPOINT + "citywiseconfig", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeleteDriver(data) {
    return this.http
      .put(AppSettings.API_ENDPOINT + "softReject/" + data.driverId, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeleteCurrentOffers(id: any) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "offers/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  UpdateCitywiseConfig(info, selId) {
    return this.http
      .put(AppSettings.API_ENDPOINT + "citywiseconfig/" + selId, info)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeleteCitywiseConfig(selId: any) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "citywiseconfig/" + selId)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AddOfficeDetails(info) {
    return this.http
      .post(AppSettings.API_ENDPOINT + "cityWiseOffice", info)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  UpdateOfficeDetails(info, selId) {
    return this.http
      .put(AppSettings.API_ENDPOINT + "cityWiseOffice/" + selId, info)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  DeleteOffice(selId: any) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "cityWiseOffice/" + selId)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getAvailbleserviceCity(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "AvailbleserviceCity")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getRiderWallet(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "userWallet")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDriverExpiryDoc(data): Promise<any> {
    if (data === undefined || data === "all") {
      return this.http
        .get(AppSettings.API_ENDPOINT + "driverExpiryDoc")
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(AppSettings.API_ENDPOINT + "driverExpiryDoc?scity_like=" + data)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  getTaxiExpiryDoc(data): Promise<any> {
    if (data === undefined || data === "all") {
      return this.http
        .get(AppSettings.API_ENDPOINT + "taxiExpiryDoc")
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(AppSettings.API_ENDPOINT + "taxiExpiryDoc?scity_like=" + data)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  markSettledDvrPayment(input): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "driverCharge", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getServiceCity(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "AvailbleserviceCity")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addZoneToCity(inputs): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "zone/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateZoneToCity(data): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "zone/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  deleteZone(id) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "zone/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  addAirZoneToCity(inputs): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "airportZone/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateAirZoneToCity(data): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "airportZone/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  deleteAirZone(id) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "airportZone/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateMailStatus(inputs: any): Promise<any> {
    return this.http
      .patch(AppSettings.API_ENDPOINT + "contactUs/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateConvo(inputs: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "contactUs/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  emailTemplateLang(inputs: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "email?language=" + inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateEmailTemplate(inputs: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "email?language=", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addServiceAvailableCity(data) {
    return this.http
      .post(AppSettings.API_ENDPOINT + "addServiceAvailableCity/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateServiceAvailableCity(input) {
    return this.http
      .put(AppSettings.API_ENDPOINT + "updateServiceAvailableCity/", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteServiceAvailableCity(input) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "deleteServiceAvailableCity/" + input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateReset(inputs: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "admin/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getAppConfig(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "remoteConfig/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateAppConfig(id: any, inputs: any): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        etag: id,
      }),
    };
    return this.http
      .post(AppSettings.API_ENDPOINT + "remoteConfig/", inputs, httpOptions)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getServerConfig(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "updateServerConfigFile/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateServerConfig(inputs: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "updateServerConfigFile/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getRentalConfig(data): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "rentalConfigFile?language=" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateRentalConfig(inputs: any, data): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "rentalConfigFile?language=" + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateAlert(input): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "alertLabel/", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateReferal(input): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "referalSettings/", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateCancellation(input): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "cancelation/cancelationDetails/", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateCurrency(input): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "featuresSettings/", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AddNearByCities(data, parms) {
    return this.http
      .post(
        AppSettings.API_ENDPOINT + "serviceAvailableCityNearby/" + parms,
        data
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeleteNearByCities(nearbyid, cityid) {
    return this.http
      .delete(
        AppSettings.API_ENDPOINT +
        "serviceAvailableCityNearby/" +
        cityid +
        "/" +
        nearbyid
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getAlert(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "alertLabel/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getReferal(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "referalSettings/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCancellation(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "cancelation/cancelationDetails/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDriverIncentives(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "incentive/incentiveCalculation")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateIncentiveForTarget(id: any, inputs: any): Promise<any> {
    return this.http
      .patch(
        AppSettings.API_ENDPOINT + "incentive/incentiveCalculation/" + id,
        inputs
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateIncentiveForTargetDetails(id: any, inputs: any): Promise<any> {
    return this.http
      .put(
        AppSettings.API_ENDPOINT + "incentive/incentiveCalculation/" + id,
        inputs
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCurrency(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "featuresSettings/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getImages(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "vehicleIcon/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteIconData(inputs: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "vehicleIcon/" + inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addIconData(inputs: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "vehicleIcon/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeletKey(inputs: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "mailconfig/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addKey(inputs: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "mailconfig/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  editKey(inputs: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "mailconfig/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  emailConfig(inputs): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "mailconfig/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  setNewAmount(input): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "updateTripAmount/", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateCarMake(data: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "carmake", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addCarMake(data: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "carmake", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteCarMake(id: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "carmake/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCarMake(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "carmake/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getSettlements(id: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "settlement/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getSettlementsForReport(id: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "driverBankReport/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getSettlementsForReportWithLimits(fromDate, toDate): Promise<any> {
    return this.http
      .get(
        AppSettings.API_ENDPOINT +
        "driverBankReport?createdAt_gte=" +
        fromDate +
        "&createdAt_lte=" +
        toDate
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getSettlementsHotel(id: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "hotelsettlement/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDriverWallet(id: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "driverWallet/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDriverWalletForReport(id: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "driverWalletReport/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDriverWalletForReportWithLimits(fromDate, toDate, id): Promise<any> {
    return this.http
      .get(
        AppSettings.API_ENDPOINT +
        "driverWalletReport/" +
        id +
        "?createdAt_gte=" +
        fromDate +
        "&createdAt_lte=" +
        toDate
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCountry(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "country/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getGodsView(id: any, city: any): Promise<any> {
    if ((city === undefined || city === "all") && id) {
      return this.http
        .get(AppSettings.API_ENDPOINT + "godView/" + id)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(AppSettings.API_ENDPOINT + "godView/" + id + "?scity_like=" + city)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }
  getData(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "mailconfig/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTermsAndConditions(data: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "tnc?language=" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getRiderTermsAndConditions(data: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "ridertnc?language=" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateTermsAndConditions(inputs: any, data: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "tnc?language=" + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateRiderTermsAndConditions(inputs: any, data: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "ridertnc?language=" + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getabout(data): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "about?language=" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateabout(inputs: any, data: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "about?language=" + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getprivacypolicy(data): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "privacypolicy?language=" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateprivacypolicy(inputs: any, data: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + "privacypolicy?language=" + data, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getSelectedGodsView(data): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + "godView" + "/" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  sendDriverSettlement(data: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "settlement/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getSubscriptionReport() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "subscriptionHistory/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  sendRiderSettlement(data: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "addWalletSettlement/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  sendHotelSettlement(data: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "hotelsettlement/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  commonfunctionforAll(input) {
    return this.http
      .get(AppSettings.API_ENDPOINT + input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  activatePackToDriver(input) {
    return this.http
      .post(AppSettings.API_ENDPOINT + "driverSubscription", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  approveTransVerified(inputs: any, id) {
    return this.http
      .put(AppSettings.API_ENDPOINT + "SetVerifiedTrue/" + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  historydelete(id) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "driverPackage/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getautoStatus(
    vehicle: any = "ALL",
    diver: any = "",

    lat: any = "",
    lon: any = "",
    serviceCtity: any = ""
  ): Promise<any> {
    var url = AppSettings.API_ENDPOINT + "driverTracking/" + vehicle + "?";
    if (diver) url = url + "code_like=" + diver + "&";
    if (lat && lon) url = url + "lng=" + lon + "&lat=" + lat + "&";
    if (serviceCtity) url = url + "scity_like=" + serviceCtity;
    return this.http
      .get(url)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetAvailableCityView(id: any, data: any) {
    if ((data === undefined || data === "all") && id) {
      return this.http
        .get(AppSettings.API_ENDPOINT + "driverTracking/" + id)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
    return this.http
      .get(
        AppSettings.API_ENDPOINT +
        "driverTracking/" +
        id +
        "?scity_like=" +
        data
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addDriverReviewReason(input) {
    return this.http
      .post(
        AppSettings.API_ENDPOINT + "firebaseValues/driverFeedbackReasons/",
        input
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateDriverReviewReason(input) {
    return this.http
      .put(
        AppSettings.API_ENDPOINT + "firebaseValues/driverFeedbackReasons/",
        input
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteDriverReviewReason(input) {
    return this.http
      .delete(
        AppSettings.API_ENDPOINT +
        "firebaseValues/driverFeedbackReasons/" +
        input
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addRiderReviewReason(input) {
    return this.http
      .post(
        AppSettings.API_ENDPOINT + "firebaseValues/riderFeedbackReasons/",
        input
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateRiderReviewReason(input) {
    return this.http
      .put(
        AppSettings.API_ENDPOINT + "firebaseValues/riderFeedbackReasons/",
        input
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteRiderReviewReason(input) {
    return this.http
      .delete(
        AppSettings.API_ENDPOINT +
        "firebaseValues/riderFeedbackReasons/" +
        input
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addDriverCancelReason(input) {
    return this.http
      .post(AppSettings.API_ENDPOINT + "driverCancelReason", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateDriverCancelReason(input) {
    return this.http
      .put(AppSettings.API_ENDPOINT + "driverCancelReason", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteDriverCancelReason(input) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "driverCancelReason/" + input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addRiderCancelReason(input) {
    return this.http
      .post(AppSettings.API_ENDPOINT + "riderCancelReason", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateRiderCancelReason(input) {
    return this.http
      .put(AppSettings.API_ENDPOINT + "riderCancelReason", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteRiderCancelReason(input) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "riderCancelReason/" + input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTripTypeReport() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "tripTypes/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDailyTripTypeReport() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "tripTypesDaily/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDailyTripTypeReportByDate(fromDate, city) {
    if ((city === undefined || city === "all") && fromDate) {
      return this.http
        .get(AppSettings.API_ENDPOINT + "tripTypesDaily?date=" + fromDate)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(
          AppSettings.API_ENDPOINT +
          "tripTypesDaily?date=" +
          fromDate +
          "&scity_like=" +
          city
        )
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  getDailyTripStatusReport() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "tripStatusDaily/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDailyTripStatusReportByDate(fromDate, city) {
    if ((city === undefined || city === "all") && fromDate) {
      return this.http
        .get(AppSettings.API_ENDPOINT + "tripStatusDaily?date=" + fromDate)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(
          AppSettings.API_ENDPOINT +
          "tripStatusDaily?date=" +
          fromDate +
          "&scity_like=" +
          city
        )
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  getDailyTripBookedReport() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "tripBookedByDaily/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDailyTripBookedReportByDate(fromDate, city) {
    console.log(city);
    if ((city === undefined || city === "all") && fromDate) {
      return this.http
        .get(AppSettings.API_ENDPOINT + "tripBookedByDaily?date=" + fromDate)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(
          AppSettings.API_ENDPOINT +
          "tripBookedByDaily?date=" +
          fromDate +
          "&scity_like=" +
          city
        )
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  getDailyPaymentReport() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "paymentReportDaily/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDailyPaymentReportByDate(fromDate, city) {
    if ((city === undefined || city === "all") && fromDate) {
      return this.http
        .get(AppSettings.API_ENDPOINT + "paymentReportDaily?date=" + fromDate)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(
          AppSettings.API_ENDPOINT +
          "paymentReportDaily?date=" +
          fromDate +
          "&scity_like=" +
          city
        )
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  getTripTypeReportWithParams(fromDate, toDate, city) {
    if ((city === undefined || city === "all") && fromDate && toDate) {
      return this.http
        .get(
          AppSettings.API_ENDPOINT +
          "tripTypes?tripFDT_gte=" +
          fromDate +
          "&tripFDT_lte=" +
          toDate
        )
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(
          AppSettings.API_ENDPOINT +
          "tripTypes?tripFDT_gte=" +
          fromDate +
          "&tripFDT_lte=" +
          toDate +
          "&scity_like=" +
          city
        )
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  getTripBookedByReport() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "tripBookedBy/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTripBookedByReportWithParams(fromDate, toDate, city) {
    if ((city === undefined || city === "all") && fromDate && toDate) {
      return this.http
        .get(
          AppSettings.API_ENDPOINT +
          "tripBookedBy?tripFDT_gte=" +
          fromDate +
          "&tripFDT_lte=" +
          toDate
        )
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      return this.http
        .get(
          AppSettings.API_ENDPOINT +
          "tripBookedBy?tripFDT_gte=" +
          fromDate +
          "&tripFDT_lte=" +
          toDate +
          "&scity_like=" +
          city
        )
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  getTripStatusReport() {
    return this.http
      .get(AppSettings.API_ENDPOINT + "tripStatus/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTripStatusReportWithParams(fromDate, toDate) {
    return this.http
      .get(
        AppSettings.API_ENDPOINT +
        "tripStatus?tripFDT_gte=" +
        fromDate +
        "&tripFDT_lte=" +
        toDate
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTripStatusReportWithCity(serviceCity) {
    return this.http
      .get(AppSettings.API_ENDPOINT + "tripStatus?scity_like=" + serviceCity)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTripStatusReportWithoutCity(fromDate, toDate, scity) {
    return this.http
      .get(
        AppSettings.API_ENDPOINT +
        "tripStatus?tripFDT_gte=" +
        fromDate +
        "&tripFDT_lte=" +
        toDate +
        "&scity_like=" +
        scity
      )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  notifyIndividualDriver(payLoad) {
    console.log('payload', payLoad);
    return this.http
      .post(AppSettings.API_ENDPOINT + "sendEmailDL", payLoad)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  refund(inputs):Promise<any>{
    return this.http.put(AppSettings.API_ENDPOINT+"refundHoldamount",inputs)
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  }

  notifyIndividualTaxi(payLoad) {
    console.log('payload', payLoad);
    return this.http
      .post(AppSettings.API_ENDPOINT + "sendEmailDL", payLoad)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  private handleData(res: any) {
    const body = res;
    //  console.log(body); // for development purposes only
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    // console.error('An error occurred', error); // for development purposes only
    const err = error;
    // console.log(err.error)
    return Promise.reject(err.error || error);
  }
}
