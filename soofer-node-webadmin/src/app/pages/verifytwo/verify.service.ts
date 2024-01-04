// ./angular-client/src/app/todo/todo.service.ts
import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise'; 
import { Router } from '@angular/router';
import { AppSettings } from '../../app.config';
@Injectable()
export class VerifyServicetwo { 
  private apiUrl =  AppSettings.API_ENDPOINT ;  
  TTOK:any;
  constructor(private http: Http,   private router: Router){ }
 
  canActivate() {

    if (localStorage.getItem("abservekey") === null) {
             this.router.navigate(['auth/verify']);
    }else{
          console.log("Coming...."); 
    }

    
    // this.http.get(this.apiUrl + 'checkKey')
    //   .toPromise()
    //   .then(res=>
    //     {
    //     let body = res.json();
    //     console.log(body);
    //     if (body.success==true){  
    //   this.router.navigate(['auth/login2']);
    //    }
    //    else  if (body.success == false)
    //    {  
      
    //     this.router.navigate(['auth/verify']);
    //    }
 
    
    //   }
    //    )
    //   .catch(this.handleError);
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
