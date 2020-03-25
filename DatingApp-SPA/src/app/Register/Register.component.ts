import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-Register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelResgister = new EventEmitter();

  model: any = {};

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  register() {
    this.auth.register(this.model).subscribe(() => {
          console.log('registration successfull');
    }, error => {
        console.log(error);
    });
  }

  cancel() {
    this.cancelResgister.emit(false);
    console.log('cancelled');
  }

}
