import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private alertfy: AlertifyService, private router: Router) {

  }

  canActivate(): boolean {

    if (this.authService.loggedIn()) {
      return true;
    }

    this.alertfy.error('You shall not Pass!!');
    this.router.navigate(['/Home']);
    return false;
  }
}
