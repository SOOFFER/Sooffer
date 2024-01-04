// ./angular-client/src/app/todo/todo.service.ts
// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MyTripService {
  private apiUrl = AppSettings.WEB_ENDPOINT;
  private apiTUrl = AppSettings.API_ENDPOINT;
  private apiDRUrl = AppSettings.DRI_ENDPOINT;
  initial: boolean;

  constructor(private http: HttpClient) {
    //  console.log("i am in service")
    // this.initial=false;
  }

  TripDetails(): Promise<any> {

    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    //   return this.http.post(this.apiUrl + 'admin/', inputs, opts)
    return this.http.post(this.apiDRUrl + 'driverTripHistory/', {})
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





