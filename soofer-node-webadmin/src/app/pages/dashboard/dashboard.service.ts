import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DashboardService {
  private apiUrl = AppSettings.API_ENDPOINT;

  constructor(private http: HttpClient) { }

  getTripEarningReport(input): Promise<any> {
    return this.http.get(this.apiUrl + 'tripEarningReport/' + input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  dashboardPanel1(): Promise<any> {
    return this.http.get(this.apiUrl + 'dashboardPanel1')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  dashboardPanel2(): Promise<any> {
    return this.http.get(this.apiUrl + 'dashboardPanel2')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  lowratingdrivers(): Promise<any> {
    return this.http.get(this.apiUrl + 'lowRatingUsers')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  totaltripdetails(): Promise<any> {
    return this.http.get(this.apiUrl + 'totaltrips')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  recentUsers(): Promise<any> {
    return this.http.get(this.apiUrl + 'recentUsers')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  activeUsers(): Promise<any> {
    return this.http.get(this.apiUrl + 'activeUsers')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
