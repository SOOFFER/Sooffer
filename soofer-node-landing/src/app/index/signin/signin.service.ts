// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SigninService {
  private apiUrl = AppSettings.DRI_ENDPOINT;

  constructor(private http: HttpClient) { }

  DrResetPAss(input): Promise<any> {
    return this.http.post(this.apiUrl + 'driverResetPassword/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DrforgotPASS(input): Promise<any> {
    return this.http.post(this.apiUrl + 'driverForgotPassword/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  ResetPAss(input): Promise<any> {
    return this.http.post(this.apiUrl + 'riderResetPassword/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  forgotPASS(input): Promise<any> {
    return this.http.post(this.apiUrl + 'riderForgotPassword/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  restaurantSignme(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'restaurantlogin/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  Signme(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'driverlogin/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  riderSignme(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'riderslogin/', inputs)
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
