import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private alertfy: AlertifyService, private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot): boolean {
     const roles = next.firstChild.data.roles as Array<string>;

     if (roles) {
         if (this.authService.isMatch(roles)) {
           return true;
         } else {
           this.router.navigate(['members']);
           this.alertfy.error('You are not authorized to access this area');
         }
     }

     if (this.authService.loggedIn()) {
      return true;
    }

     this.alertfy.error('You shall not Pass!!');
     this.router.navigate(['/Home']);
     return false;
  }
}
