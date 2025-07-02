import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

@Injectable()

export class HttpIntercept implements HttpInterceptor {
  // user:any;
  // constructor(private authService: NbAuthService) {
  // this.authService.onTokenChange()
  //   .subscribe((token: NbAuthJWTToken) => {
  //     if (token.isValid()) {
  //       this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
  //       console.log(this.user)
  //     }
  //   });
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var auth_app_token = localStorage.getItem('auth_app_token');
    var authTokenObject = JSON.parse(auth_app_token);
    const changedReq = req.clone({
      headers: req.headers.append('x-access-token', authTokenObject.value)
    });
    return next.handle(changedReq);
  }



}
