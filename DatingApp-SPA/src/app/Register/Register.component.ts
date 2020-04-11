import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelResgister = new EventEmitter();

  user: User;

  registerForm: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private auth: AuthService, private alertify: AlertifyService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.bsConfig = {
        containerClass: 'theme-red'
    },
    this.createRegisterForm();
  }


   createRegisterForm() {
      this.registerForm = this.fb.group({
        username: ['', Validators.required],
        gender: ['male'],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ['', Validators.required]
      }, {validator : this.passwordMatch});
   }

  passwordMatch(g: FormGroup) {
       return g.get('password').value === g.get('confirmPassword').value ? null : {mismatch: true};
  }

  register() {
    if (this.registerForm.valid) {
        this.user = Object.assign({}, this.registerForm.value);
        this.auth.register(this.user).subscribe(() => {
            this.alertify.success('Registration successfull');
        }, error => {
           this.alertify.error(error);
        }, () => {
            this.auth.login(this.user).subscribe(() => {
                this.router.navigate(['/members']);
            });
        });
    }
  }

  cancel() {
    this.cancelResgister.emit(false);
  }

}
