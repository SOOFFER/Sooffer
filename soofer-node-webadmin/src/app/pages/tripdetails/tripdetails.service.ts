// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TripsService {
  private apiUrl = AppSettings.API_ENDPOINT;

  constructor(private http: HttpClient) { }

  refreshTrips(tripno: any): Promise<any> {
    return this.http.post(AppSettings.API_ENDPOINT + 'refreshFinishedTrips/', tripno)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getServiceCity(): Promise<any> {
    return this.http.get(AppSettings.API_ENDPOINT + 'AvailbleserviceCity')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  startATrip(data): Promise<any> {
    return this.http.post(this.apiUrl + 'startTripFromAdmin/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  tripRequestedDrivers(data): Promise<any> {
    return this.http.get(this.apiUrl + 'tripRequestedDrivers/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getTripMailDetails(data): Promise<any> {
    return this.http.post(this.apiUrl + 'sendTripReceipt/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  cancelATrip(data): Promise<any> {
    return this.http.put(this.apiUrl + 'cancelCurrentTrip/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  endATrip(data): Promise<any> {
    return this.http.post(this.apiUrl + 'endTripFromAdmin/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteATripDetails(data): Promise<any> {
    return this.http.delete(this.apiUrl + 'tripDetails/' + data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  getFareForEndingTrip(data): Promise<any> {
    return this.http.post(this.apiUrl + 'endTripFareEstimationFromAdmin/', data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    // return Promise.reject(error);
    const err = error;
    return Promise.reject(err.error);
  }

}
