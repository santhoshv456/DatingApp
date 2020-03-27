import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }],
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(public authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }


  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('logged in successfully');
    }, error => {
      this.alertify.error(error);
    }
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    const token = localStorage.getItem('token');
    if (token) {
    localStorage.removeItem('token');
    this.alertify.message('logged out');
    }
  }
}
