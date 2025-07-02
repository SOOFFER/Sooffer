// ./angular-client/src/app/todo/todo.service.ts
import { Injectable, Inject } from '@angular/core';
import { AppSettings } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CompanyService {
  private apiUrl = AppSettings.API_ENDPOINT;

  constructor(private http: HttpClient) { }

  createDoc(data: any): Promise<any> {
    return this.http.post(this.apiUrl + "company/", data)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError)
  }

  updateCompany(dataupdate: any): Promise<any> {
    return this.http
      .put(AppSettings.API_ENDPOINT + 'company/', dataupdate)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  addCompany(addData: any): Promise<any> {
    return this.http
      .post(AppSettings.API_ENDPOINT + 'company/', addData)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  deleteCompany(dataupdate: any): Promise<any> {
    return this.http
      .delete(AppSettings.API_ENDPOINT + 'company/' + dataupdate)
      .toPromise()
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: any) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error || error.message);
  }

}


@Injectable()
export class CommonService {
  constructor(@Inject(CommonService) public CommonService: CommonService) { }
}
