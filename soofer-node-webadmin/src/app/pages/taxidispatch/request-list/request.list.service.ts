import { Injectable } from '@angular/core';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import { AppSettings } from '../../../app.config';

@Injectable()
export class PendingRequestsService {


  private _endPoint = AppSettings.API_ENDPOINT + 'recentMTDRequest';

  constructor(private _http: Http) { }

  list() {
    let headers = new Headers();
    var auth_app_token = localStorage.getItem('auth_app_token');
    var authTokenObject = JSON.parse(auth_app_token);
    headers.append('x-access-token',authTokenObject.value);
    let opts = new RequestOptions();
    opts.headers = headers;
    return this._http.get(this._endPoint,opts).map((res: Response) => res.json());

  }
  token(arg0: string, token: any) {
    throw new Error("Method not implemented.");
  }
}
