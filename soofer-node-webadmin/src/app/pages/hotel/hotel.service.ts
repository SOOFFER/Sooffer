// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { AppSettings } from '../../app.config';

@Injectable()

export class HotelService {
  private apiUrl = AppSettings.API_ENDPOINT;
  TTOK: any;
  userID: any = localStorage.getItem('userId');
  constructor(private http: HttpClient) { }

  createDoc(inputs: any) {
    return this.http.post(this.apiUrl + 'hotel/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  updateHotelData(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'hotel/' , inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  deleteHotelData(id: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'hotel/' + id)
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
