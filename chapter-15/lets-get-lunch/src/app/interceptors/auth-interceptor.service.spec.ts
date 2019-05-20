import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptorService } from './auth-interceptor.service';

describe('AuthInterceptorService', () => {
  let http: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        }
      ]
    });

    http = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });

  it('should append a token to the headers if a token exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue('s3cr3tt0ken');
    httpClient.get('/test').subscribe(res => {});
    const req = http.expectOne('/test');
    req.flush('ok');
    expect(req.request.headers.get('Authorization')).toEqual('s3cr3tt0ken');
  });
});
