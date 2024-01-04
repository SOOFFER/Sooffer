// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppSettings } from '../../../app.config';

// import 'rxjs/add/operator/toPromise';

@Injectable()
export class OfferService {

  constructor(private http: Http) { }
  data: any = [];

  deleteCompany(dataupdate: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + 'company/' + dataupdate._id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  EditExpiry(dataupdate: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'company/', dataupdate)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  GetCity(): Promise<any> {
    return this.http.get(AppSettings.API_ENDPOINT + 'allCity/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  createDoc(addData: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'offers/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  UpdateNewDoc(addData: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'offers/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  UpdateNewDocEXP(addData: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'offers/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  getCity(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + '/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateCarMake(data: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'carmake', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addCarMake(data: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'carmake', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteCarMake(id: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + 'carmake/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getCarMake(): Promise<any> {
    return this.http.get(AppSettings.API_ENDPOINT + 'carmake/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  updateTaxiData(inputs: any): Promise<any> {
    return this.http.put(AppSettings.API_ENDPOINT + 'vehicletype/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  deleteTaxiData(id: any): Promise<any> {
    return this.http.delete(AppSettings.API_ENDPOINT + 'vehicletype/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getCountry(): Promise<any> {
    return this.http.get(AppSettings.API_ENDPOINT + 'country/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  getGodsView(): Promise<any> {
    return this.http.get(AppSettings.API_ENDPOINT + 'godView/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  private handleData(res: any) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    let err = error
    return Promise.reject(err || error);
  }

}
