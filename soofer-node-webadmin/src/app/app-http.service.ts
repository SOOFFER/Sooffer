import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './app.config';

@Injectable()
export class HttpClientTokenService {
  private Token = JSON.parse(localStorage.getItem('auth_app_token')).value;
  private headers = new Headers();
  private opts = new RequestOptions();
  private apiUrl = AppSettings.API_ENDPOINT;
  constructor(private http: HttpClient) {
    console.log('here');
    // this.headers.append('x-access-token', this.Token);
    // this.opts.headers = this.headers;
  }
  get(url) {
    return this.http.get(url); //,this.opts)
  }
  post(url, data) {
    return this.http.post(url, data); //,this.opts)
  }

  put(url, data) {
    return this.http.put(url, data); //,this.opts)
  }

  delete(url) {

    return this.http.delete(url); //,this.opts)

  }

  public getApiUrl() {
    return this.apiUrl + 'customer/';
  }


}

