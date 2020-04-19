
import {Injectable} from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberLikesResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;
    likeParams = 'Likers';
    constructor(private router: Router, private alertify: AlertifyService,
                private userService: UserService ) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
       return this.userService.getUsers(this.pageNumber, this.pageSize , null , this.likeParams).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );

    }

}
