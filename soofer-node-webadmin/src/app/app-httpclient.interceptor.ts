import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private Token = JSON.parse(localStorage.getItem('auth_app_token')).value;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Invoking......');
    request = request.clone({ headers: request.headers.set('x-access-token', this.Token) });
    return next.handle(request);
  }
}
