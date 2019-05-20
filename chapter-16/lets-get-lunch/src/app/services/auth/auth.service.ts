import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() loggedIn: EventEmitter<boolean>;

  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService) {
    this.loggedIn = new EventEmitter();
  }

  signup(credentials: User): Observable<object> {
    return this.http.post('http://localhost:8080/api/users', credentials).pipe(
      mergeMap(res => this.login(credentials))
    );
  }

  login(credentials: User): Observable<object> {
    return this.http.post('http://localhost:8080/api/sessions', credentials).pipe(
      map((res: any) => {
        localStorage.setItem('Authorization', res.token);
        this.loggedIn.emit(true);
        return res;
      })
    );
  }

  logout() {
    localStorage.removeItem('Authorization');
    this.loggedIn.emit(false);
  }

  currentUser() {
    return this.jwtHelper.decodeToken(localStorage.getItem('Authorization'));
  }

  isLoggedIn() {
    return !this.jwtHelper.isTokenExpired();
  }
}
