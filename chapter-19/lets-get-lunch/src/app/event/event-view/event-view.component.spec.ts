import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { EventModule } from '../event.module';
import { EventsService } from '../../services/events/events.service';
import { Event } from '../../services/events/event';
import { EventViewComponent } from './event-view.component';

const event: Event = {
  '_id': '5a55135639fbc4ca3ee0ce5a',
  '_creator': '5a550ea739fbc4ca3ee0ce58',
  'title': 'My first event',
  'description': 'My first description',
  'city': 'Atlanta',
  'state': 'GA',
  'startTime': '2018-01-09T19:00:00.000Z',
  'endTime': '2018-01-09T20:00:00.000Z',
  '__v': 0,
  'suggestLocations': true,
  'members': [
    {
      '_id': '5a550ea739fbc4ca3ee0ce58',
      'username': 'newUser',
      '__v': 0,
      'dietPreferences': []
    }
  ]
};

class MockActivatedRoute {
  snapshot = { params: { id: '5a55135639fbc4ca3ee0ce5a' } };
}

class MockEventsService {
  get = jasmine.createSpy('get').and.callFake(() => of(event));
}

describe('EventViewComponent', () => {
  let component: EventViewComponent;
  let fixture: ComponentFixture<EventViewComponent>;
  let eventsService: EventsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EventModule ]
    })
    .overrideComponent(EventViewComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: EventsService, useClass: MockEventsService }
        ],
        template: `
          <div class="container">
            <div class="row">
              <div class="col-md-8">
                <div *ngIf="event">
                  <h3 class="event-name">{{event.title}}</h3>
                  <div *ngIf="event.description">
                    <label>Description:</label>
                    <span class="description"> {{event.description}}</span>
                  </div>
                  <div>
                    <label>Location:</label>
                    <span class="location"> {{event.city}}, {{event.state}}</span>
                  </div>
                  <div>
                    <label>Start:</label>
                    <span class="start"> {{event.displayStart}}</span>
                  </div>
                  <div>
                    <label>End:</label>
                    <span class="end"> {{event.displayEnd}}</span>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <!--<app-member-list *ngIf="event"
                                     [eventId]="eventId"
                                     [creatorId]="event._creator"
                                     [members]="event.members">
                </app-member-list>-->
              </div>
            </div>

            <div class="row">
              <div class="col-md-8">
                <!--<app-comment-create *ngIf="eventId"
                                        [eventId]="eventId">
                </app-comment-create>-->
              </div>

              <div class="col-md-4">
                <!--recommendations-list-->
              </div>
            </div>
          </div>
        `
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventViewComponent);
    component = fixture.componentInstance;
    eventsService = fixture.debugElement.injector.get(EventsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a call to get the event details ' +
    'using the active route id', () => {
    expect(eventsService.get).toHaveBeenCalledWith('5a55135639fbc4ca3ee0ce5a');
  });
});
