// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { AppSettings } from '../../app.config';
@Injectable()
export class AdminService {
  private apiUrl = AppSettings.API_ENDPOINT;
  TTOK: any;
  userID: any = localStorage.getItem('userId');
  constructor(private http: HttpClient) { }

  createDoc(inputs: any) {
    let temp = inputs.menuslist;
    let tempArray = temp.map(e=>e.title == null ? e : e.title);
    inputs.menuslist = tempArray;
    return this.http.post(this.apiUrl + 'admin/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  editMenuItem(inputs: any) {
    return this.http.put(this.apiUrl + 'pagesMenu', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  AddMenuItem(inputs: any) {
    return this.http.post(this.apiUrl + 'pagesMenu', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  getMenus(inputs: any) {
    return this.http.post(this.apiUrl + 'getMenu', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  upload(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'profile/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  updateAdminData(inputs: any, id): Promise<any> {
    let temp = inputs.menuslist;
    let tempArray = temp.map(e=>e.title == null ? e : e.title);
    inputs.menuslist = tempArray; 
    return this.http.post(this.apiUrl + 'adminupdate/' + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  updateAdmincommon(inputs: any,id): Promise<any> {
    return this.http.patch(this.apiUrl + 'admin/' + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  deleteAdminData(id: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'admin/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getMyProfile(): Promise<any> {
    // this.TTOK = localStorage.getItem('PTok');
    // let headers = new Headers();
    // headers.append('x-access-token', this.TTOK);
    // let opts = new RequestOptions();
    return this.http.get(this.apiUrl + 'adminProfile/' + this.userID)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  EditMyProfile(inputs: any): Promise<any> {
    // this.TTOK = localStorage.getItem('PTok');
    // let headers = new Headers();
    // headers.append('x-access-token', this.TTOK);
    // let opts = new RequestOptions();

    return this.http.put(this.apiUrl + 'updateAdmin/' + this.userID, inputs)
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

  public getApiUrl() {
    return this.apiUrl + 'admin/';
  }

}
