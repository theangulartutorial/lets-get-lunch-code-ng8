import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { EventsListModule } from './events-list.module';
import { EventsService } from '../services/events/events.service';
import { Event } from '../services/events/event';
import { EventsListComponent } from './events-list.component';

const events: Array<Event> = [{
  '_id': '5a539459b689d341cccc4be8',
  '_creator': '5a539449b689d341cccc4be7',
  'title': 'Another event',
  'description': 'Another event description',
  'city': 'Atlanta',
  'state': 'GA',
  'startTime': '2018-01-08T05:00:00.000Z',
  'endTime': '2018-01-09T05:00:00.000Z',
  '__v': 0,
  'suggestLocations': false,
  'members': [
    '5a539449b689d341cccc4be7'
  ]
}];

class MockEventsService {
  all() {}
}

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let eventsService: EventsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        EventsListModule,
        RouterTestingModule
      ]
    })
    .overrideComponent(EventsListComponent, {
      set: {
        providers: [
          { provide: EventsService, useClass: MockEventsService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    eventsService = fixture.debugElement.injector.get(EventsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with no existing events', () => {
    beforeEach(() => {
      spyOn(eventsService, 'all').and.callFake(() => of([]));
      fixture.detectChanges();
    });

    it('should initiate with a call to get all events', () => {
      expect(eventsService.all).toHaveBeenCalled();
    });

    it('should display a message that no events exist', () => {
      const message = fixture.debugElement.query(By.css('.no-events'));
      expect(message.nativeElement.textContent).toContain('There are no events.');
    });
  });

  describe('with existing events', () => {
    beforeEach(() => {
      spyOn(eventsService, 'all').and.callFake(() => of(events));
      fixture.detectChanges();
    });

    it('should initiate with a call to get all events', () => {
      expect(eventsService.all).toHaveBeenCalled();
    });

    it('should populate the table with the event', () => {
      const eventsList = fixture.debugElement.queryAll(By.css('.event-title'));
      expect(eventsList[0].nativeElement.textContent).toContain('Another event');
    });

    it('should populate the table with a link to the event', () => {
      const eventLinks = fixture.debugElement.queryAll(By.css('.event-link a'));
      expect(eventLinks[0].nativeElement.getAttribute('href'))
        .toEqual('/event/5a539459b689d341cccc4be8');
    });
  });
});
