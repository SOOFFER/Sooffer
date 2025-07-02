// import { Injectable, AnimationStyleMetadata, AnimationKeyframesSequenceMetadata } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators/tap';
import { AppSettings } from './app.config';


// import { HttpClient } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {
  private apiUrl = AppSettings.API_ENDPOINT;

  constructor(private authService: NbAuthService,
    private router: Router, private http: HttpClient) {

  }
  handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
  private handleData(res: any) {
    const body = res.json();
    //console.log(body);
    return body.success;
  }

  canActivate() {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          // console.log(authenticated);
          if (authenticated === false) {
            this.router.navigate(['auth/login'], { skipLocationChange: true });
          }
        }
        )
      );
  }

}
