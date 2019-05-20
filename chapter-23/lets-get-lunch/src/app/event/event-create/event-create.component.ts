import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
declare var google: any;

import { Event } from '../../services/events/event';
import { EventsService } from '../../services/events/events.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  eventForm: FormGroup;
  location: any;
  error: string;
  success: string;
  @ViewChild('city') citySearch: ElementRef;

  constructor(private fb: FormBuilder,
    private gmaps: MapsAPILoader,
    private ngZone: NgZone,
    private eventsService: EventsService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.createForm();

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

  createForm() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      location: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      suggestLocations: [false, Validators.required]
    });
  }

  onSubmit() {
    this.error = '';
    this.success = '';

    const user = this.authService.currentUser();
    const event: Event = {
      _creator: user._id,
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      startTime: this.eventForm.value.startTime,
      endTime: this.eventForm.value.endTime,
      city: this.location.address_components[0].long_name,
      state: this.location.address_components[2].short_name,
      suggestLocations: this.eventForm.value.suggestLocations
    };

    this.eventsService.create(event).subscribe(res => {
      this.success = 'Your event has been created.';
    }, err => {
      this.error = err.error.message;
    });
  }

}
