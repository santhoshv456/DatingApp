import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  helper = new JwtHelperService();

  decodedToken: any;

  baseUrl =  environment.apiUrl + 'auth/';

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = this.helper.decodeToken(user.token);
          console.log(this.decodedToken);
        }
      })
    );
  }


  loggedIn()
  {
    const token = localStorage.getItem('token');
    return !this.helper.isTokenExpired(token);
  }

register(model: any) {
  return this.http.post(this.baseUrl + 'register', model);
}

}
