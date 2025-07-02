// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'; 
import { Router } from '@angular/router';
import { AppSettings } from '../../app.config';
@Injectable()
export class VerifyService { 
  private apiUrl =  AppSettings.API_ENDPOINT ;  
  TTOK:any;
  dyUrl:string;
  constructor(private http: Http,   private router: Router){
    this.dyUrl="login";
   }
  
  verifyDoc(inputs:any): Promise<any>{
    inputs.url=AppSettings.FEURL;
    console.log(inputs);
    return this.http.post(this.apiUrl+'activationKey/', inputs)
    .toPromise()
    .then(this.handleData)
    .catch(this.handleError)
  }
  genreateDynamicUrl()
  {
    this.dyUrl= "dynamic";
    return "dynamic";
  }
  genreateUrl()
  {
    return this.dyUrl;
  }
  canActivate() {
    
    this.http.get(this.apiUrl + 'checkKey')
      .toPromise()
      .then(res=>
        {
        let body = res.json();
        //console.log(body);
        if (body.success==true){  
          // return true;
      this.router.navigate(['auth/login2'], { skipLocationChange: true });
       }
       else   if (body.success == false)
       {  
      
        this.router.navigate(['auth/verify'], { skipLocationChange: true });
       }
     
 
    
      }
       )
      .catch(this.handleError);
      }
  private handleData(res: any) {
    let body = res.json(); 
    console.log(body);
    return body || {};
  }

  private handleError(error: any): Promise<any> { 
    return Promise.reject(error.message || error);
  }

  public getApiUrl(){
    return this.apiUrl+'admin/'; 
  }

}
