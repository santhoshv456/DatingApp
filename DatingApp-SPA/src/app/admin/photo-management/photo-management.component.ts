import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Photo } from 'src/app/_models/Photo';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
photos: any;

  constructor(private admin: AdminService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.admin.getPhotosForApproval().subscribe(res => {
        this.photos = res;
    }, error => {
        this.alertify.error(error);
    });
  }

  approvePhoto(photoId) {
      this.admin.approvePhoto(photoId).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
      }, error => {
        this.alertify.error(error);
      });
  }

  rejectPhoto(photoId) {
    this.admin.rejectPhoto(photoId).subscribe(() => {
       this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
    }, error => {
      this.alertify.error(error);
    });
  }

}
