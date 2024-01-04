import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardSectionService {

  private apiTUrl = AppSettings.API_ENDPOINT;
  TapiUrl: string = AppSettings.VEH_ENDPOINT;
  token: string = localStorage.getItem('Tok');

  constructor(private http: HttpClient) { }

  getRentalPackage(inputs: any) {
    return this.http.post(this.TapiUrl + 'rental/packageList/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getRentalVehicles(inputs: any) {
    return this.http.post(this.TapiUrl + 'rental/fareEstimation/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getRentalFare(inputs: any) {
    return this.http.post(this.TapiUrl + 'rental/fareEstimatioSingle/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  bookRentalVehicle(inputs: any) {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.TapiUrl + 'requestRentalTaxi', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  /** OutStation */

  getOutstationVehicles(inputs: any) {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.TapiUrl + 'rental/outstationVehicleListWithFare/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  bookOutstationVehicle(inputs: any) {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.TapiUrl + 'requestOutstationTaxi', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }


  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    const body = 0;
    return Promise.reject(body || error);
  }

}
