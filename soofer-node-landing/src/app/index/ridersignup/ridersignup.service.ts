// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Service {

  private apiUrl = AppSettings.API_ENDPOINT;
  private vapiUrl = AppSettings.VEH_ENDPOINT;

  constructor(private http: HttpClient) { }

  verifyRider(inputs): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.vapiUrl + 'verifyNumber', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getCountries(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'countries')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  GetState(data): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'state/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  GetCity(data): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'city/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getCompanies(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'companies/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getLangs(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'languages/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getCurrency(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'currency/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getCarMake(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'carmake/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getYearsData(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'years/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  createDoc(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.apiUrl + 'riders/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  updateRiderData(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiUrl + 'rider/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  deleteRiderData(id: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.delete(this.apiUrl + 'rider/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  resetingPWD(id): Promise<any> {
    return this.http.post(this.apiUrl + 'riderResetPasswordFromAdmin/', id)
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

}

@Injectable()
export class CommonService {
  constructor(@Inject(CommonService) public CommonService: CommonService) { }
}