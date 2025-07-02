// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DriverService {
  private apiUrl = AppSettings.API_ENDPOINT;

  constructor(private http: HttpClient) { }
  uploadDriverDocsDynamic(inputs: any): Promise<any> {
    const options = new RequestOptions();
    return this.http
      .post(this.apiUrl + "driverDocs/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  uploadtaxiDocsDynamic(inputs: any): Promise<any> {
    const options = new RequestOptions();
    return this.http
      .post(this.apiUrl + "driverTaxisdocs/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  driverONLine() {
    return this.http
      .post(this.apiUrl + "makeOnlineOfflineDrivers", {})
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  driverActiveTripType(data) {
    return this.http
      .patch(this.apiUrl + "driverActiveTripType", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  packageValidity(data) {
    return this.http
      .post(this.apiUrl + "getSubcriptionValidityDate", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  UpdateWallet(info) {
    return this.http
      .put(this.apiUrl + "driverWalletType", info)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DriverActivatedStatus(data: any) {
    return this.http
      .patch(this.apiUrl + "driverActiveTripType", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addDriverBankDetails(inputs: any): Promise<any> {
    console.log(inputs);
    return this.http
      .post(this.apiUrl + "driverBankDetail/" + inputs._id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  editDriverBankDetails(inputs: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "driverBankDetail/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDriverBankDetails(id: any): Promise<any> {
    return this.http
      .get(this.apiUrl + "driverBankDetail/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetDriverId(): Promise<any> {
    return this.http
      .get(this.apiUrl + "driver/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  createDoc(inputs: any): Promise<any> {
    return this.http
      .post(this.apiUrl + "driver/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AddFile(inputs: any): Promise<any> {
    return this.http
      .post(this.apiUrl + "insertDriverData", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  setOnOff(input): Promise<any> {
    return this.http
      .put(this.apiUrl + "setOnlineStatus/", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  checkNIC(inp): Promise<any> {
    return this.http
      .get(this.apiUrl + "driverNic/" + inp)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  setBulkOnOff(input): Promise<any> {
    return this.http
      .put(this.apiUrl + "setBulkOnlineStatus/", input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  driverProofStatus(inputs: any): Promise<any> {
    return this.http
      .post(this.apiUrl + "driveraccepted/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  drivertaxistatus(inputs: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "drivertaxistatus/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  drivertaxidisable(inputs: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "taxiApproveStatus/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  uploadDriverImage(inputs: any): Promise<any> {
    return this.http
      .post(this.apiUrl + "addProfile/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateDriverData(inputs: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "driver/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  resetingPWD(id): Promise<any> {
    return this.http
      .post(this.apiUrl + "driverResetPasswordFromAdmin/", id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  DeleteDriver(data) {
    return this.http
      .delete(AppSettings.API_ENDPOINT + "deleteDriver/" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteDriverData(id: any): Promise<any> {
    return this.http
      .delete(this.apiUrl + "driver/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  activateDriverData(id: any, body: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "driverActivate/" + id, body)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  rejectDriver(data: any): Promise<any> {
    return this.http
      .post(this.apiUrl + "driverRejected", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  approverejectDriver(data: any): Promise<any> {
    return this.http
      .post(this.apiUrl + "driveraccepted", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteDriverTaxiData(driverId: any, taxiId: any): Promise<any> {
    return this.http
      .delete(this.apiUrl + "drivertaxi/" + taxiId + "/" + driverId)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateDriverTaxiData(inputs: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "driverTaxi/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  uploadDriverDocs(inputs: any): Promise<any> {
    const options = new RequestOptions();
    return this.http
      .post(this.apiUrl + "driverDocs/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  uploadDriverTaxiDocs(inputs: any): Promise<any> {
    const options = new RequestOptions();
    return this.http
      .post(this.apiUrl + "driverTaxiDocs/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AvailCode(inputs): Promise<any> {
    return this.http
      .post(this.apiUrl + "checkCodeAvail/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    const err = error;
    return Promise.reject(err.error);
  }

  public getApiUrl() {
    return this.apiUrl + "driver/";
  }

  editUploadDriverDocs(inputs: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "drivertaxi/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  Statuspending(data) {
    return this.http
      .post(this.apiUrl + "driverRejected/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  changepassword(data) {
    return this.http
      .post(this.apiUrl + "driverResetPasswordFromAdmin/change", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDriversList(data): Promise<any> {
    let query = this.apiUrl + "driver/?_page=1&_limit=1000";
    if (data.vehicleNo) {
      query = query + "&taxis.licence_like=" + data.vehicleNo;
    }
    if (data.color) {
      query = query + "&taxis.color_like=" + data.color;
    }
    if (data.make) {
      query = query + "&taxis.makename_like=" + data.make;
    }
    if (data.model) {
      query = query + "&taxis.model_like=" + data.model;
    }
    if (data.year) {
      query = query + "&taxis.year_like=" + data.year;
    }
    if (data.vehicleType) {
      query = query + "&taxis.vehicletype_like=" + data.vehicleType;
    }
    if (data.code) {
      query = query + "&code_like=" + data.code;
    }
    if (data.fname) {
      query = query + "&fname_like=" + data.name;
    }
    if (data.phone) {
      query = query + "&phone_like=" + data.phone;
    }

    //const licence = (data.licence == undefined) ? '' : data.licence;
    // const vehicleNo = (data.vehicleNo == undefined) ? '' : data.vehicleNo;
    // const color = (data.color == undefined) ? '' : data.color;
    // const make = (data.make == undefined) ? '' : data.make;
    // const model = (data.model == undefined) ? '' : data.model;
    // const year = (data.year == undefined) ? '' : data.year;
    // const vehicleType = (data.vehicleType == undefined) ? '' : data.vehicleType;
    // cityName = (data.cityName == undefined) ? '' : data.cityName;
    // return this.http.get(this.apiUrl + 'driver/?_page=1&_limit=1000' + '&taxis.vehicleNo=' + vehicleNo
    //   + '&taxis.color_like=' + color + '&taxis.makename_like=' + make + '&taxis.model_like=' + model + '&taxis.year_like='
    //   + year + '&taxis.vehicletype_like=' + vehicleType)
    return this.http
      .get(query)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
    //{{AEP}}adminapi/driver?_page=1&_limit=10&licence_like=691902290&taxis.licence_like=WPKJ-8077
    // &taxis.color_like=Black&taxis.makename_like=ACURA&taxis.model_like=INTEGRA&taxis.year_like=2017&taxis.vehicletype=Car
  }

  getDriversListForService(data): Promise<any> {
    const id = data.servicecity;
    console.log(data);

    return this.http
      .get(this.apiUrl + "driver/?_page=1&_limit=1000&scity_like=" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
    //{{AEP}}adminapi/driver?_page=1&_limit=10&licence_like=691902290&taxis.licence_like=WPKJ-8077
    // &taxis.color_like=Black&taxis.makename_like=ACURA&taxis.model_like=INTEGRA&taxis.year_like=2017&taxis.vehicletype=Car
  }

  getOnlineDriversListForService(data): Promise<any> {
    const id = data.servicecity;
    console.log(data);

    return this.http
      .get(this.apiUrl + "driverOnline/?_page=1&_limit=1000&scity_like=" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
    //{{AEP}}adminapi/driver?_page=1&_limit=10&licence_like=691902290&taxis.licence_like=WPKJ-8077
    // &taxis.color_like=Black&taxis.makename_like=ACURA&taxis.model_like=INTEGRA&taxis.year_like=2017&taxis.vehicletype=Car
  }

  getRejectedDriversListForService(data): Promise<any> {
    const id = data.servicecity;
    console.log(data);

    return this.http
      .get(this.apiUrl + "driverpending/?_page=1&_limit=1000&scity_like=" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
    //{{AEP}}adminapi/driver?_page=1&_limit=10&licence_like=691902290&taxis.licence_like=WPKJ-8077
    // &taxis.color_like=Black&taxis.makename_like=ACURA&taxis.model_like=INTEGRA&taxis.year_like=2017&taxis.vehicletype=Car
  }
  getInactiveDriversListForService(data: any): Promise<any> {
    const id = data.servicecity;
    console.log(data);

    return this.http
      .get(this.apiUrl + "driverinactive?_page=1&_limit=1000&scity_like=" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
}

@Injectable()
export class CommonService {
  constructor(@Inject(CommonService) public CommonService: CommonService) { }
}
