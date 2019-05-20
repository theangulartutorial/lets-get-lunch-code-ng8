import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {
  API = environment.api;

  constructor(private http: HttpClient) { }

  get(eventId: string): Observable<any> {
    return this.http.get(this.API + '/recommendations/' + eventId);
  }
}
