import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from './alertify.service';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient, private alertify: AlertifyService) { }

getUsersWithRoles() {
   return this.http.get(this.baseUrl + 'Admin/usersWithRoles');
}

editRoles(user: User, roles: {}) {
   return this.http.post(this.baseUrl + 'admin/editRole/' + user.userName , roles);
}

}
