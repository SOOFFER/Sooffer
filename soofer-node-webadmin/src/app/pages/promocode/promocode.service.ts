// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PromoService {
 
  private apiUrl =  AppSettings.API_ENDPOINT ;  

  constructor(private http: HttpClient){ }
  
  TableDetails(id) {
    return this.http.get(this.apiUrl + 'updatePromoCodeNumUsedLogctrl/'+id)
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  }
  createDoc(inputs:any): Promise<any>{
    return this.http.post(this.apiUrl+'promocode/', inputs)
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  }
  
  updatePromoCodeData(inputs:any): Promise<any>{
    return this.http.put(this.apiUrl+'promocode/', inputs)
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  }
  
  deletePromoCodeData(id:any): Promise<any>{
    return this.http.delete(this.apiUrl + 'promocode/' + id)
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