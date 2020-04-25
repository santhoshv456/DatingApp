import * as core from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';

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

  constructor(private route: ActivatedRoute) {
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

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

}
