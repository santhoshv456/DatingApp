import * as core from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { MembersCardComponent } from '../members-card/members-card.component';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@core.Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements core.OnInit {
  @ViewChild('staticTabs', { static: true }) staticTabs: TabsetComponent;

  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private route: ActivatedRoute, private userService: UserService, private auth: AuthService,
              private alertify: AlertifyService ) {
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
        this.user = data.user;
    });

    this.route.queryParams.subscribe(params => {
      const tab = params.tab;
      this.staticTabs.tabs[tab > 0 ? tab : 0].active = true;
    });

    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          imagePercent: 100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
      }];

    this.galleryImages = this.getImages();
  }

  getImages() {
    const imageUrls = [];

    for (const img of this.user.photos) {
         imageUrls.push({
          small: img.url,
          medium: img.url,
          big: img.url
         });
     }
    return imageUrls;
  }


  sendLike(id: number) {
    this.userService.sendLike(this.auth.decodedToken.nameid, id).subscribe(() => {
       this.alertify.success('You have liked:' + this.user.knownAs);
    }, error => {
       this.alertify.error(error);
    });
  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

}
