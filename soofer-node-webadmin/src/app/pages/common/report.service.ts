// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {HttpClient} from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReportService { 
  private apiUrl =  AppSettings.API_ENDPOINT ;  

  constructor(private http: HttpClient){ }
  
  markSettledDvrPayment(data:any): Promise<any>{
    return this.http.post(this.apiUrl + "markSettledDvrPayment", data)
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  } 

  markSettledCompanyPayment(data: any): Promise<any> {
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    let opts = new RequestOptions();
    opts.headers = headers;
    return this.http.post(this.apiUrl + "companyPayReport", data )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  } 
  
  private handleData(res: any) {
    let body = res; 
    return body || {};
  }

  private handleError(error: any): Promise<any> { 
    return Promise.reject(error.message || error);
  }

}
