import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router:Router,private service:AuthService){}
  canActivate():boolean{
    if(this.service.isLoggedIn()){
      return true
    }
      this.router.navigate(['/sign-in'])
      return false
  }
  

  
  }


