import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { format } from 'date-fns';
import { Event } from './event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  create(event: Event): Observable<Event> {
    return this.http.post<Event>('http://localhost:8080/api/events', event);
  }

  getUserEvents(userId: string): Observable<Event[]> {
    return this.http.get<Event[]>('http://localhost:8080/api/events/user/' +
                                  userId);
  }

  get(id: string): Observable<Event> {
    return this.http.get<Event>('http://localhost:8080/api/events/' + id).pipe(
      map((res: Event) => this.formatDateTime(res))
    );
  }

  all(): Observable<Event[]> {
    return this.http.get<Event[]>('http://localhost:8080/api/events');
  }

  formatDateTime(event: Event): Event {
    event.displayStart = format(event.startTime, 'dddd MMM, Do - h:mm A');
    event.displayEnd = format(event.endTime, 'dddd MMM, Do - h:mm A');
    return event;
  }
}
