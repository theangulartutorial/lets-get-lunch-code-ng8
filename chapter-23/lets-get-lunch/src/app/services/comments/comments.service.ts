import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from './comment';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  API = environment.api;

  constructor(private http: HttpClient) { }

  create(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.API + '/comments', comment);
  }

  getEventComments(eventId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.API + '/comments/event/' +
                                    eventId);
  }
}
