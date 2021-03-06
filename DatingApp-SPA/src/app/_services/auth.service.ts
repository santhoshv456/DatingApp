import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  photoUrl = new BehaviorSubject<string>('../../assets/user.png');

  currentPhotoUrl = this.photoUrl.asObservable();

  helper = new JwtHelperService();

  currentUser: User;

  decodedToken: any;

  baseUrl = environment.apiUrl + 'auth/';

  constructor(private http: HttpClient) { }

  changeMainPhotoUrl(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.helper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMainPhotoUrl(this.currentUser.photoUrl);
        }
      })
    );
  }


  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.helper.isTokenExpired(token);
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }
  isMatch(allowedRoles): boolean {
      let isMatch = false;

      const roles = this.decodedToken.role as Array<string>;

      allowedRoles.forEach(element => {
           if (roles.includes(element)) {
            isMatch = true;
            return;
           }

      });

      return isMatch;
  }

}
