import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-members-card',
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.css']
})
export class MembersCardComponent implements OnInit {
  @Input() user: User;

  constructor(private auth: AuthService,
              private userService: UserService, private alertify: AlertifyService ) {}

  ngOnInit() {}

  sendLike(id: number) {
    this.userService.sendLike(this.auth.decodedToken.nameid, id).subscribe(() => {
       this.alertify.success('You have liked:' + this.user.knownAs);
    }, error => {
       this.alertify.error(error);
    });
  }
}
