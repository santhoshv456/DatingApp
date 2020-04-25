import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Message } from 'src/app/_models/Messages';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-message',
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.css']
})
export class MemberMessageComponent implements OnInit {

  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService, private auth: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
      const currentId = +this.auth.decodedToken.nameid;
      this.userService.getMessageThread(this.auth.decodedToken.nameid, this.recipientId)
       .pipe(tap(messages => {
           // tslint:disable-next-line: prefer-for-of
           for (let i = 0 ; i < messages.length ; i++) {
                if (messages[i].isRead === false && messages[i].recipientId === currentId) {
                      this.userService.markAsRead(currentId, messages[i].id);
                }
           }
       }))
       .subscribe(messages => {
           this.messages = messages;
       }, error => {
         this.alertify.error(error);
       });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.auth.decodedToken.nameid , this.newMessage)
    .subscribe((message: Message) => {
          this.messages.unshift(message);
          this.newMessage.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }
}
