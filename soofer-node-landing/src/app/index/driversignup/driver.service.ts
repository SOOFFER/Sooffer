// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DriverService {

  private apiUrl = AppSettings.API_ENDPOINT;
  private vapiUrl = AppSettings.VEH_ENDPOINT;

  constructor(private http: HttpClient) { }

  verifyDriver(inputs): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.vapiUrl + 'verifyNumberDriver', inputs)
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

  createDoc(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.apiUrl + 'driver/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  setOnOff(input): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiUrl + 'setOnlineStatus/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  setBulkOnOff(input): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiUrl + 'setBulkOnlineStatus/', input)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  driverProofStatus(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiUrl + 'driverProofStatus/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  drivertaxistatus(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiUrl + 'drivertaxistatus/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  updateDriverData(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiUrl + 'driver/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  resetingPWD(id): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.apiUrl + 'driverResetPasswordFromAdmin/', id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  deleteDriverData(id: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.delete(this.apiUrl + 'driver/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }


  updateDriverTaxiData(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiUrl + 'driverTaxi/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  deleteDriverTaxiData(tId: any, dId: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.delete(this.apiUrl + 'driverTaxi/' + tId + '/' + dId)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  uploadDriverDocs(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.apiUrl + 'driverDocs/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  uploadDriverTaxiDocs(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    // const options = new RequestOptions();
    return this.http.post(this.apiUrl + 'driverTaxiDocs/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  AvailCode(inputs): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.post(this.apiUrl + 'checkCodeAvail/', inputs)
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

  public getApiUrl() {
    return this.apiUrl + 'driver/';
  }

  editUploadDriverDocs(inputs: any): Promise<any> {
    // const headers = new Headers();
    // headers.append('x-access-token', localStorage.getItem('Tok'));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http.put(this.apiUrl + 'drivertaxi/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getDriversList(data): Promise<any> {

    var licence = (data.licence == undefined) ? '' : data.licence;
    var vehicleNo = (data.vehicleNo == undefined) ? '' : data.vehicleNo;
    var color = (data.color == undefined) ? '' : data.color;
    var make = (data.make == undefined) ? '' : data.make;
    var model = (data.model == undefined) ? '' : data.model;
    var year = (data.year == undefined) ? '' : data.year;
    var vehicleType = (data.vehicleType == undefined) ? '' : data.vehicleType;
    return this.http.get(this.apiUrl + 'driver/?_page=1&_limit=10&licence_like=' + licence + '&taxis.licence_like=' + vehicleNo
      + '&taxis.color_like=' + color + '&taxis.makename_like=' + make + '&taxis.model_like=' + model + '&taxis.year_like='
      + year + '&taxis.vehicletype_like=' + vehicleType)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
    //{{AEP}}adminapi/driver?_page=1&_limit=10&licence_like=691902290&taxis.licence_like=WPKJ-8077
    // &taxis.color_like=Black&taxis.makename_like=ACURA&taxis.model_like=INTEGRA&taxis.year_like=2017&taxis.vehicletype=Car
  }

}

@Injectable()
export class CommonService {
  constructor(@Inject(CommonService) public CommonService: CommonService) { }
}