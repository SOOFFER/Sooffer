// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppSettings } from '../../../app.config';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class PackageService {

  constructor(private http: HttpClient) { }
  data: any = [];

  createNewPack(addData: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'payPackage/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  sendDriverSettlement(data: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'settlement/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  UpdatePackage(updateData: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'payPackage/', updateData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  DeletePackage(id: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + 'payPackage/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetDriverList(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + 'getDrivers/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetPackageList(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + 'getpayPackage/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetSelectedPack(id: any): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + 'SelectedPack/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetSubPackageList(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + 'getSubPackage')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetComPackageList(): Promise<any> {
    return this.http
      .get(AppSettings.API_ENDPOINT + 'getComPackage')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  activateRentalPackage(data): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'rental/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteRentalPackage(data): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + 'rental/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateRentalPackage(data): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'rental/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  activatePackToDriver(data): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'driverPackage/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addDriverSubPackage(data): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'driverSubscription/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  activateDriverSubPackage(inputs: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'activateDriverSubscription/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deactivateDriverSubPackage(inputs: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'deactivateDriverSubscription/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    // console.error('An error occurred', error); // for development purposes only
    const err = error.error;
    return Promise.reject(err || error);
  }

}
