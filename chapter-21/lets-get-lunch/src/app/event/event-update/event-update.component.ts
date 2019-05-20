import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { isBefore } from 'date-fns';
declare var google: any;

import { AuthService } from '../../services/auth/auth.service';
import { EventsService } from '../../services/events/events.service';
import { Event } from '../../services/events/event';

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.css']
})
export class EventUpdateComponent implements OnInit {
  event: Event;
  eventId: string;
  location: any;
  error: string;
  success: string;
  @ViewChild('city') citySearch: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private eventsService: EventsService,
    private gmaps: MapsAPILoader,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.eventId = params['id'];
    this.eventsService.get(this.eventId).subscribe(res => {
      this.event = res;
      this.changeDetector.detectChanges();
      this.loadGoogleMapsAutocomplete();
    });
  }

  loadGoogleMapsAutocomplete() {
    this.gmaps.load().then(() => {
      const autocomplete =
      new google.maps.places.Autocomplete(this.citySearch.nativeElement, {
        types: ['(cities)'],
        componentRestrictions: { 'country': 'us' }
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.location = autocomplete.getPlace();
        });
      });
    });
  }

  editEvent(editedEvent) {
    this.error = '';
    this.success = '';
    if (this.isBeforeEndDate(this.event.startTime, this.event.endTime)) {
      const user = this.authService.currentUser();
      const event: Event = {
        _id: this.eventId,
        _creator: user._id,
        title: editedEvent.title,
        description: editedEvent.description,
        startTime: editedEvent.startTime,
        endTime: editedEvent.endTime,
        city: this.location === undefined ?
              this.event.city :
              this.location.address_components[0].long_name,
        state: this.location === undefined ?
               this.event.state :
               this.location.address_components[2].short_name,
        suggestLocations: editedEvent.suggestLocations
      };
      this.eventsService.update(event).subscribe(res => {
        this.success = 'Your event has been updated.';
      }, err => {
        this.error = err.error.message;
      });
    } else {
      this.error = 'Your start date must be before the end date.';
    }
  }

  isBeforeEndDate(start, end) {
    return isBefore(start, end);
  }

}
