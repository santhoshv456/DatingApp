
import {Injectable} from '@angular/core';
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private router: Router, private alertify: AlertifyService, private auth: AuthService,
                private userService: UserService ) {

    }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
       return this.userService.getUser(this.auth.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/members']);
                return of(null);
            })
        );

    }

}
