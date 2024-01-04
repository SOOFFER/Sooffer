import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LanguageSettings } from '../app.config';

@Injectable()

export class HttpIntercept implements HttpInterceptor {
  http: any;
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const id_token= localStorage.getItem('Tok')
    if(id_token){
        const changedReq = req.clone({
        headers: req.headers.append('x-access-token', id_token),
      setHeaders:{'Accept-Language':LanguageSettings.defaultSelectedLang}})
        return next.handle(changedReq);
        
    }
    else{
      const modifiedReq = req.clone({
        setHeaders:{'Accept-Language':LanguageSettings.defaultSelectedLang}
      })
        return next.handle(modifiedReq);
    }   
    
  }}