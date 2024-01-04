// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TaxiDispatchService {
  private apiUrl = AppSettings.API_ENDPOINT;
  private TapiUrl = AppSettings.VEH_ENDPOINT;

  constructor(private http: HttpClient) { }

  /** Outstation */

  getVehicleForOutstation(data): Promise<any> {
    // return this.http.post(this.TapiUrl + 'rental/outstationVehicleListWithFare/', data)
    return this.http.post(this.TapiUrl + 'rental/outstationVehicleListWithFareFromAdmin/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getFareForSingleVehOutstation(data): Promise<any> {
    return this.http.post(this.TapiUrl + 'rental/outstationFareEstimatioSingle/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  /** Rental */

  getFareForRental(data): Promise<any> {
    return this.http.post(this.TapiUrl + 'rental/fareEstimatioSingle/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getVehicleForrental(data): Promise<any> {
    return this.http.post(this.TapiUrl + 'rental/fareEstimation/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getPackageList(data): Promise<any> {
    // return this.http.post(this.TapiUrl + 'rental/packageList/', data)
    return this.http.post(this.TapiUrl + 'rental/packageListFromAdmin/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  validatePromoCode(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'validatePromo/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  TripDetails(id): Promise<any> {
    return this.http.get(this.apiUrl + 'tripDetails/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getRiders(id): Promise<any> {
    return this.http.get(this.apiUrl + 'riderById/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  createDoc(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'driver/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  taxiView(): Promise<any> {
    return this.http.get(this.TapiUrl + 'getDummyDvr')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  driverProofStatus(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'driverProofStatus/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  drivertaxistatus(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'drivertaxistatus/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateDriverData(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'driver/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteDriverData(id: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'driver/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateDriverTaxiData(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'driverTaxi/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  conBook(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'estimationFare/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteDriverTaxiData(tId: any, dId: any): Promise<any> {
    /*console.log(tId);
    console.log(dId);*/
    return this.http.delete(this.apiUrl + 'driverTaxi/' + tId + '/' + dId)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getMyDriver(): Promise<any> {
    return this.http.get(this.apiUrl + 'driver')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  checkDriver(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'riders/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  checkTele(id): Promise<any> {
    const list: any = {};
    list.phone = id;
    return this.http.post(this.apiUrl + 'checkPhoneAvail/', list)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getNearestDrivers(input): Promise<any> {
    return this.http.post(this.apiUrl + 'getNearByDrivers/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  BookMyTripNow(input): Promise<any> {
    return this.http.post(this.apiUrl + 'requestTaxiFromMTD/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  BookMyTripLater(input): Promise<any> {
    return this.http.post(this.apiUrl + 'requestScheduleTaxiFromMTD/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  /* DISPATCH */

  SelectedDriverCheckDataPresent(data): Promise<any> {
    return this.http.post(this.apiUrl + 'checkPhoneAvail/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  Getfaredetails(data): Promise<any> {
    const type = data;
    return this.http.post(this.apiUrl+ 'serviceBasicFare/' + type.tripType, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  estimatedfare(data): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + "estimationFare/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  requestManualTaxiDispatch(data): Promise<any> {
    let requestUrl;
    if (data.tripType === 'daily') {
      requestUrl = this.apiUrl + 'requestTaxiFromMTD/';
    } else if (data.tripType === 'rental') {
      requestUrl = this.apiUrl + 'requestRentalTaxiFromMTD/';
    } else if (data.tripType === 'outstation') {
      requestUrl = this.apiUrl + 'requestOutstationTaxiFromMTD/';
    }
    return this.http.post(requestUrl, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getAllDrivers(): Promise<any> {
    return this.http.get(this.apiUrl + 'getAllDriversForMTD')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  retryMTD(data): Promise<any> {
    return this.http.put(this.apiUrl + 'requestTaxiRetry/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  public getApiUrl() {
    return this.apiUrl + 'driver/';
  }

}

@Injectable()
export class CommonService {
  constructor(@Inject(CommonService) public CommonService: CommonService) { }
}
