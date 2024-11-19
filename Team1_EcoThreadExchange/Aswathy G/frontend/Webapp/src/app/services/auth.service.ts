import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { env } from 'process';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  http=inject(HttpClient);
  register(name:string,email:string,password:string){
    return this.http.post(environment.apiUrl+'/auth/register',{
      name,email,password,
    });
  }

  login(email:string,password:string){
    return this.http.post(environment.apiUrl+'/auth/login',{
      email,password,
    });
  }

  forgotpassword(email: string) {
    return this.http.post(environment.apiUrl + '/auth/forgot-password', {
      email
    }).pipe(
      catchError(err => {
        return throwError(() => new Error('Error sending password reset email'));
      })
    );
  }

  get isLoggedIn(){
    let token=localStorage.getItem("token");
    if(token){
      return true;
    }
    return false;
  }

  get isAdmin(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).isAdmin;
    }
    return null;
  }
  get userName(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).name;
    }
    return null;
  }

  get userEmail(){
    let userData=localStorage.getItem("user");
    if(userData){
      return JSON.parse(userData).email;
    }
    return null;
  }

  logOut(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }



}
