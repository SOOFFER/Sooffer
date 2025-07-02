import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class ElectricityService {
  private apiUrl = AppSettings.API_ENDPOINT;
  //data:any;

  constructor(private http: HttpClient) { }

  getData(date: any, status: any): Promise<any> {
    return this.http.get(this.apiUrl + 'tripStat?date=' + date + '&status=' + status)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    return body;
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
