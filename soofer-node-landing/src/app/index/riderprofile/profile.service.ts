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

  getState(input) {
    //console.log(input);
    this.initial = input;
  }

  getRiderDetails(id: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', id);
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiDRUrl + 'rider/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateVerifiedRider(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiAppUrl + 'riderUpdateVerifiedData/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  eidtRiderDetails(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiDRUrl + 'rider/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  uploadRidiverProfile(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.apiAppUrl + 'rider/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  uploadRiderImage(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiAppUrl + 'riderImage/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  editDriver(id: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiDRUrl + 'drivertaxi/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getDetails(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'driverProfile/' + inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateDriverData(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiTUrl + 'driver/', inputs)
      .toPromise()
      .catch(this.handleError);
  }

  uploadDriverDocs(inputs: any): Promise<any> {
    const options = new RequestOptions();
    return this.http.post(this.apiTUrl + 'driverDocs/', inputs)
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

  public getApiUrl() {
    return this.apiUrl + ' ';
  }

}
