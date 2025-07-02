// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient} from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ReviewsService { 
  private apiUrl =  AppSettings.API_ENDPOINT ;  

  constructor(private http: HttpClient){ }
  
  deleteDriverReview(id:any): Promise<any>{
    return this.http.delete(this.apiUrl + 'driverReview/' + id)
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  }
  deleteRiderReview(id:any): Promise<any>{
    return this.http.delete(this.apiUrl + 'riderReview/' + id)
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  }
  private handleData(res: any) {
    let body = res; 
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