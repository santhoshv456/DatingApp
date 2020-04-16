import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParms: any = {};
  pagination: Pagination;

  constructor(private userService: UserService, private alertfy: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
        this.users = data.users.result;
        this.pagination = data.users.pagination;
    });
    this.userParms.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParms.minAge = 18;
    this.userParms.maxAge = 99;
    this.userParms.orderBy = 'lastActive';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  resetFilters() {
    this.userParms.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParms.minAge = 18;
    this.userParms.maxAge = 99;
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParms)
    .subscribe((data: PaginationResult<User[]>)  => {
        this.users = data.result;
        this.pagination = data.pagination;
    }, error => {
       this.alertfy.error(error);
    });
  }

}
