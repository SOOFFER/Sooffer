// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class MyTaxiService {
  private apiUrl = AppSettings.WEB_ENDPOINT;
  private apiTUrl = AppSettings.API_ENDPOINT;
  private apiDRUrl = AppSettings.DRI_ENDPOINT;
  initial: boolean;

  constructor(private http: HttpClient) {
    //  console.log("i am in service")
    // this.initial=false;
  }

  editDriver(id): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiDRUrl + 'drivertaxi/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addTaxi(items): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiDRUrl + 'drivertaxi/', items)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  uploadDriverTaxiDocs(inputs: any): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiDRUrl + 'driverTaxiDocs/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  // createDoc(inputs:any): Promise<any>{
  //   let headers = new Headers();
  //   headers.append('x-access-token', myVariable);
  //   let opts = new RequestOptions();
  //   opts.headers = headers;

  //   return this.http.post(this.apiUrl + 'admin/', inputs, opts)
  //   .toPromise()
  //   .then(this.handleData)
  //   .catch(this.handleError)
  // }
  getCountries(): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'countries')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetState(data): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'state/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getVehicleTypeData(): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'allvehicletypes/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetCity(data): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'city/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCompanies(): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'companies/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getLangs(): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'languages/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCurrency(): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'currency/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCarMake(): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'carmake/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getYearsData(): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'years/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  // getVehicleTypeData(): Promise<any>{
  //   return this.http.get(this.apiTUrl+ 'allvehicletypes/')
  //   .toPromise()
  //   .then(this.handleData)
  //   .catch(this.handleError)
  //
  GetDrivers(data): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiTUrl + 'companyDrivers/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  editDetails(input): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.put(this.apiTUrl + 'drivertaxi/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteVehicle(tId, dId): Promise<any> {
    // const headers = new Headers({ 'x-access-token': localStorage.getItem('Tok') });
    // const options = new RequestOptions({ headers: headers });
    return this.http.delete(this.apiTUrl + 'driverTaxi/' + tId + '/' + dId)
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





