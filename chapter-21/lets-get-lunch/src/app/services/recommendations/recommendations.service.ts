import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {

  constructor(private http: HttpClient) { }

  get(eventId: string): Observable<any> {
    return this.http.get('http://localhost:8080/api/recommendations/' + eventId);
  }
}
