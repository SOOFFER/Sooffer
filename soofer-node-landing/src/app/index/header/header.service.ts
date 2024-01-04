import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HeaderService {
  private apiUrl = AppSettings.DRI_ENDPOINT;
  initial: boolean;
  constructor(private http: HttpClient) {
  }

  getState(input): boolean {
    this.initial = input;
    return this.initial;
  }
  logout(): Promise<any> {
    return this.http.get(AppSettings.API_ENDPOINT + 'logout/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)

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