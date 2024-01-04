// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Service {
  private apiUrl = AppSettings.API_ENDPOINT;

  constructor(private http: HttpClient) {}
  GetRiderId(): Promise<any> {
    return this.http
      .get(this.apiUrl + "rider/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  createDoc(inputs: any): Promise<any> {
    return this.http
      .post(this.apiUrl + "riders/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateRiderData(inputs: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "rider/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteRiderData(id: any): Promise<any> {
    //     const httpOptions = {
    //     headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: data
    // };

    return this.http
      .delete(this.apiUrl + "rider/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  activateRider(id: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "riderActivate/" + id, {})
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  resetingPWD(id): Promise<any> {
    return this.http
      .post(this.apiUrl + "riderResetPasswordFromAdmin/", id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  deleteRider(id: any): Promise<any> {

    return this.http
      .delete(this.apiUrl + "deleteRider/" + id)
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
}

@Injectable()
export class CommonService {
  constructor(@Inject(CommonService) public CommonService: CommonService) { }
}
