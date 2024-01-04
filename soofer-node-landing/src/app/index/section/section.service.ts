// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { AppSettings, LanguageSettings } from "../../app.config";

import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class SectionService {
  private apiUrl = AppSettings.WEB_ENDPOINT;
  private apiTUrl = AppSettings.API_ENDPOINT;
  lang = localStorage.getItem('accept-language')
  initial: boolean;
  TapiUrl: string = AppSettings.VEH_ENDPOINT;
  token: string = localStorage.getItem("Tok");

  constructor(private http: HttpClient) {
    // this.initial=false;
  }

  getDriverDetailsForATrip(inputs: any) {
    // const headers = new Headers();
    // headers.append("x-access-token", localStorage.getItem("Tok"));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http
      .put(this.TapiUrl + "tripDriverDetails/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  riderFeedback(inputs: any) {
    // const headers = new Headers();
    // headers.append("x-access-token", localStorage.getItem("Tok"));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http
      .put(this.TapiUrl + "riderFeedback/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getVehicles(tok): Promise<any> {
    // let payLoad = { tripType: 'daily', ...tok }
    console.log(tok);
    // const headers = new Headers();
    // headers.append("x-access-token", localStorage.getItem("Tok"));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    console.log('DADA');


    return this.http
      .post(this.TapiUrl + "serviceBasicFare", tok)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  requestTaxi(inputs: any): Promise<any> {
    inputs.safeRide = false;
    // const headers = new Headers();
    // headers.append("x-access-token", localStorage.getItem("Tok"));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http
      .post(this.TapiUrl + "requestTaxi/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  listVehicles(): Promise<any> {
    // const headers = new Headers();
    // headers.append("x-access-token", localStorage.getItem("Tok"));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http
      .get(this.apiTUrl + "whatweofferfrontend?language=" + this.lang)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  conBook(inputs: any): Promise<any> {
    if (localStorage.getItem("Tok")) {
      // const headers = new Headers();
      // headers.append("x-access-token", localStorage.getItem("Tok"));
      // const opts = new RequestOptions();
      // opts.headers = headers;
      console.log('inputs : ', inputs);
      let temp = { serviceType: inputs.vehicletype }
      console.log('temp', temp);
      let payLoad = { tripType: 'daily', ...temp, ...inputs }
      console.log('Payload : ', payLoad);
      return this.http
        .post(this.TapiUrl + "estimationFare/", payLoad)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    } else {
      // const headers = new Headers();
      // headers.append("x-access-token", localStorage.getItem("Tok"));
      // const opts = new RequestOptions();
      // opts.headers = headers;
      console.log('inputs : ', inputs);
      let temp = { serviceType: inputs.vehicletype }
      console.log('temp', temp);
      let payLoad = { tripType: 'daily', ...temp, ...inputs }
      console.log('Payload : ', payLoad);
      return this.http
        .post(this.apiTUrl + "estimationFare/", payLoad)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
    }
  }

  getOurDrivers(): Promise<any> {
    // const headers = new Headers();
    // headers.append("x-access-token", localStorage.getItem("Tok"));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http
      .get(this.apiTUrl + "ourDrivers?language=" + this.lang)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  gethomecontent(): Promise<any> {
    // const headers = new Headers();
    // headers.append("x-access-token", localStorage.getItem("Tok"));
    // const opts = new RequestOptions();
    // opts.headers = headers;
    return this.http
      .get(this.apiTUrl + "gethomecontent?language=" + this.lang)
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


  public getApiUrl() {
    return this.apiUrl + " ";
  }
}
