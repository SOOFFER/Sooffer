import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
   constructor() { }
   isLoggedIn() {
    return !!localStorage.getItem('Tok'); // get token from local storage
  
 }
}