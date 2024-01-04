// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileService {
  private apiUrl = AppSettings.WEB_ENDPOINT;
  private apiTUrl = AppSettings.API_ENDPOINT;
  private apiDRUrl = AppSettings.DRI_ENDPOINT;
  private apiAppUrl = AppSettings.VEH_ENDPOINT;
  initial: boolean;

  constructor(private http: HttpClient) {
    // this.initial=false;
  }
  uploadDriverDocsDynamic(inputs: any): Promise<any> {
    const options = new RequestOptions();
    return this.http
      .post(this.apiTUrl + "driverDocs/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getState(input) {
    // console.log(input);
    this.initial = input;
  }

  editDriver(id: any): Promise<any> {
    // console.log(inputs);
    // const options = new RequestOptions();
    return this.http
      .get(this.apiDRUrl + "drivertaxi/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDetails(): Promise<any> {
    // console.log(localStorage.getItem('Tok'))
    // const headers = new Headers({
    //   "x-access-token": localStorage.getItem("Tok"),
    // });
    // const options = new RequestOptions({headers: headers});
    return this.http
      .get(this.apiDRUrl + "driver/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateDriverData(inputs: any): Promise<any> {
    return this.http
      .put(this.apiTUrl + "driver/", inputs)
      .toPromise()
      .catch(this.handleError);
  }

  updateDriverBankDetails(id, inputs: any): Promise<any> {
    return this.http
      .post(this.apiTUrl + "driverBankDetail/" + id, inputs)
      .toPromise()
      .catch(this.handleError);
  }

  getDriverBankDetails(id): Promise<any> {
    return this.http
      .get(this.apiTUrl + "driverBankDetail/"+ id)
      .toPromise()
      .catch(this.handleError);
  }

  uploadDriverDocs(inputs: any): Promise<any> {
    console.log(inputs);
    const options = new RequestOptions();
    return this.http
      .post(this.apiTUrl + "driverDocs/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  uploadDriverProfile(inputs: any): Promise<any> {
    console.log(inputs);
    // const headers = new Headers({
    //   "x-access-token": localStorage.getItem("Tok"),
    // });
    // const options = new RequestOptions({headers: headers});
    return this.http
      .post(this.apiAppUrl + "driverProfileUpdate/", inputs,)
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
  // createDoc(inputs:any): Promise<any>{
  //   let headers = new Headers();
  //   headers.append('x-access-token', myVariable);
  //   let opts = new RequestOptions();
  //   opts.headers = headers;

  //   return this.http.post(this.apiUrl + 'admin/', inputs, opts)
  //   .toPromise()
  //   .then(this.handleData)
  //   .catch(this.handleError)
  // }

  public getApiUrl() {
    return this.apiUrl + " ";
  }
}
