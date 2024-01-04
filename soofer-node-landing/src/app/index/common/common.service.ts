// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { AppSettings, LanguageSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CommonService {

  private apiUrl = AppSettings.API_ENDPOINT;
  private apiRUrl = AppSettings.DRI_ENDPOINT;
  language = LanguageSettings.defaultSelectedLang;
  lang = localStorage.getItem('accept-language')
  constructor(private http: HttpClient) { }
  getDocumentsettings(data): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http
      .get(this.apiUrl + "getNeededDocuments/" + data + '?language=' + this.lang)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  GetCityAddress() {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'cityWiseOffice')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  mailSend(inputs): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.apiUrl + 'webContactUs/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getServicecityCatagory(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'serviceCities/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getQuesAnswer(id): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'getCatagory/' + id + '?language=' + this.lang)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getServicecity(id): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'getServicecity/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getHelpQA(id): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'getHelpCatagory/' + id + '?language=' + this.lang)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  gethelpCatagory(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'helpcategory?language=' + this.lang)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  getfaqCatagory(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'faqcategory?language=' + this.lang)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  getAboutPAge(input): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'getPages/' + input + '?language=' + this.lang)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  getFaqCatagory(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;  
      return this.http.get(this.apiRUrl + 'driverProfile/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  getDriver(data: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;  
      return this.http.get(this.apiRUrl + 'driverProfile/' + data)
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

  GetVehicle(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiUrl + 'allVehicle')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getCompanies(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiRUrl + 'companies/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getLangs(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiRUrl + 'languages/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getCurrency(): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.get(this.apiRUrl + 'currency/')
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
