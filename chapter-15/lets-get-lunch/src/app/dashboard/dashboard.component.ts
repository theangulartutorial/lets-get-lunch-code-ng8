import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { EventsService } from '../services/events/events.service';
import { Event } from '../services/events/event';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  view = 'week';
  viewDate: Date = new Date();
  events: Array<Event>;
  error: string;
  noEvents: string;

  constructor(private authService: AuthService,
    private eventsService: EventsService) { }

  ngOnInit() {
    const id = this.authService.currentUser()._id;
    this.eventsService.getUserEvents(id).subscribe(res => {
      if (res) {
        this.events = this.addJSDate(res);
        this.events = this.addEventColors(this.events);
      } else {
        this.noEvents = 'You are not a member of any events.';
      }
    }, err => {
      this.error = err.error.message;
    });
  }

  addJSDate(events: Array<Event>): Array<Event> {
    return events.map((event) => {
      event.start = new Date(event.startTime);
      event.end = new Date(event.endTime);
      return event;
    });
  }

  addEventColors(events: Array<Event>): Array<Event> {
    return events.map((event) => {
      event.color = { primary: '#1E90FF', secondary: '#D1E8FF' };
      return event;
    });
  }

  eventClicked(event) {
    // Route to event view page
  }

}
