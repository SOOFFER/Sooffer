// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Service {
  private apiUrl = AppSettings.API_ENDPOINT;

  constructor(private http: HttpClient) {
    this.Name = "";
  }
  Name: any;

  getVehicleByType(type: any, scity:any) {
    return this.http
      .get(this.apiUrl + "getVechicleName/" + type + "/" + scity)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getVehicleDetails(): Promise<any> {
    return this.http
      .get(this.apiUrl + "vehicletype/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  createDoc(inputs: any): Promise<any> {
    return this.http
      .post(this.apiUrl + "vehicletype/", inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateVehicle(id: any, data: any): Promise<any> {
    return this.http
      .patch(this.apiUrl + "vehicletype/" + id, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteTaxiData(id: any): Promise<any> {
    return this.http
      .delete(this.apiUrl + "vehicletype/" + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateVehicleDetails(id: any, patchFor: any, data: any): Promise<any> {
    return this.http
      .patch(this.apiUrl + "vehicletypeupdate/" + id + "/" + patchFor, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }
  updateSelectedFiles(id: any, data: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "ourVehicles/" + id, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateVehicleHourDetails(id: any, patchFor: any, data: any): Promise<any> {
    return this.http
      .patch(this.apiUrl + "vehicletypeSurge/" + id + "/" + patchFor, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addDistanceFare(id: any, data: any): Promise<any> {
    return this.http
      .put(this.apiUrl + "vehicleDistanceData/" + id, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateDistanceFare(id: any, did: any, data: any): Promise<any> {
    return this.http
      .patch(this.apiUrl + "vehicleDistanceData/" + id + "/" + did, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  offerUpdateDistanceFare(id: any, did: any, data: any): Promise<any> {
    return this.http
      .patch(this.apiUrl + "vehicleDistanceOfferData/" + id + "/" + did, data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteDistanceFare(id: any, data: any): Promise<any> {
    return this.http
      .delete(this.apiUrl + "vehicleDistanceData/" + id + "/" + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getVehicleData(): Promise<any> {
    return this.http
      .get(this.apiUrl + "vehicletype/")
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  setName(input): any {
    this.Name = input;
  }
  getName(): any {
    return this.Name;
  }
  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

@Injectable()
export class CommonService {
  constructor(@Inject(CommonService) public CommonService: CommonService) { }
}
