import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req, next): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('Authorization');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }

    return next.handle(req);
  }

}
