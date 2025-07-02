import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Service {

  private apiUrl = AppSettings.API_ENDPOINT;
  constructor(private http: HttpClient) { }

  getVehicleByType(type: any, type2) {
    return this.http.get(this.apiUrl + 'getVechicleName/' + type + '/' + type2)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  GetRiderId() {
    return this.http.get(this.apiUrl + '/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  activateRider(data: any) {
    return this.http.get(this.apiUrl + '/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateRentalFare(id: any, inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'rentalFare/' + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  updateOutStationFare(id: any, inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'outstationFare/' + id, inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  UpdateData(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'rental/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  UpdateOutstation(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'outstation/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteData(id: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'rental/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteOutstation(id: any): Promise<any> {
    return this.http.delete(this.apiUrl + 'outstation/' + id)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  resetingPWD(myDid: any) {
    return this.http.get(this.apiUrl + '/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AddTripPackages(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'rental/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  AddOutstationPackage(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'outstation/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

}

@Injectable()
export class CommonService {
  constructor(@Inject(CommonService) public CommonService: CommonService) { }
}
