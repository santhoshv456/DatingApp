import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginationResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page?: any, itemPerPage?: any, userParms?: any): Observable<PaginationResult<User[]>> {
    const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemPerPage);
    }

    if (userParms != null) {
       params = params.append('minAge', userParms.minAge );
       params = params.append('maxAge', userParms.maxAge );
       params = params.append('gender', userParms.gender );
       params = params.append('orderBy', userParms.orderBy);
    }

    return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params})
    .pipe(map(response => {
      paginationResult.result = response.body;
      if (response.headers.get('Pagination') != null) {
         paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginationResult;
    })
    );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userid: number, id: number) {
       return this.http.post(this.baseUrl + 'users/' + userid + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userid: number, id: number) {
       return this.http.delete(this.baseUrl + 'users/' + userid + '/photos/' + id);
  }

}
