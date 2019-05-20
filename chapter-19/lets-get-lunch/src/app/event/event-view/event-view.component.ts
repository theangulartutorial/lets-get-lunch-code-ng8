import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../services/events/events.service';
import { Event } from '../../services/events/event';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  event: Event;
  eventId: string;

  constructor(private activatedRoute: ActivatedRoute,
    private eventsService: EventsService) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.eventId = params['id'];
    this.eventsService.get(this.eventId).subscribe(res => {
      this.event = res;
    });
  }

}
