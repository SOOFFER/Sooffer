import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ChartService {
  private apiUrl = AppSettings.API_ENDPOINT;

  constructor(private http: HttpClient) { }

  getAvailableServiceCity(){
    return this.http.get(this.apiUrl+ 'AvailbleserviceCity')
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  }

  getOption(date: any, status: any,city): Promise<any> {

      if(date && status && (city =='Service Available City' || city == 'all')) 
      {
        return this.http.get(this.apiUrl + 'tripCountstat?date=' + date + '&status=' + status)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError);
      }
      else if( date && status && city) {
        return this.http.get(this.apiUrl + 'tripCountstat?date=' + date + '&status=' + status +'&scity_like='+ city)
        .toPromise()
        .then(this.handleData)
        .catch(this.handleError)
      }


  }

  getItems(date: any, status: any,city : any): Promise<any> {
      
    if(date && status && (city == 'Service Available City' || city == 'all') ){
      console.log(date, status)
      return this.http.get(this.apiUrl + 'revenueStat?date=' + date + '&status=' + status)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
    }
    // else if(date && status && city == 'all' ){
    //   console.log(date, status)
    //   return this.http.get(this.apiUrl + 'revenueStat?date=' + date + '&status=' + status + '&scity_like=' + "")
    //   .toPromise()
    //   .then(this.handleData)
    //   .catch(this.handleError);
    // }
    else if(date && status && city) {
      console.log(date, city, status)
      return this.http.get(this.apiUrl + 'revenueStat?date=' + date + '&status=' + status +'&scity_like=' + city)
          .toPromise()
          .then(this.handleData) 
          .catch(this.handleError);
    } 


  }

  // getItems1(date: any, status: any,data): Promise<any> {

  //   return this.http.get(this.apiUrl + 'revenueStat?date=' + date + '&status=' + status +'&scity_like=' +data)
  //     .toPromise()
  //     .then(this.handleData)
  //     .catch(this.handleError);
  // }


  getCounts(data): Promise<any> {
    if(data == 'Service Available City' || data == 'all' ){
      return this.http.get(this.apiUrl + 'riderCountStat')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
    }
    else if (data) {
      return this.http.get(this.apiUrl + 'riderCountStat?scity_like='+ data )
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
    }

  }


  private handleData(res: any) {
    const body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
