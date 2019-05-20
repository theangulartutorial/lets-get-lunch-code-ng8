import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events/events.service';
import { Event } from '../services/events/event';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  events: Array<Event>;
  errorMessage: string;

  constructor(private eventsService: EventsService) { }

  ngOnInit() {
    this.eventsService.all().subscribe(res => {
      this.events = res;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

}
