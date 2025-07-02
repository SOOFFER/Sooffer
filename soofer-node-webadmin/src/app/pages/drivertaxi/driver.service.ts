// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Service {

  private apiUrl = AppSettings.API_ENDPOINT;
  private apiVUrl = AppSettings.VEH_ENDPOINT;

  constructor(private http: HttpClient) { }

  createDoc(inputs: any): Promise<any> {
    return this.http.post(this.apiUrl + 'drivertaxi/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  fileUploadForTaxi(inputs: any): Promise<any> {
    return this.http.put(this.apiUrl + 'drivertaxiImage/', inputs)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }


  GetColor(): Promise<any> {
    return this.http.get(this.apiVUrl + 'carmakeandyear/')
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }
  private handleData(res: any) {
    let body = res
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
