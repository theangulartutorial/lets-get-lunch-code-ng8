import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { MemberListModule } from './member-list.module';
import { AuthService } from '../services/auth/auth.service';
import { EventsService } from '../services/events/events.service';
import { Event } from '../services/events/event';
import { MemberListComponent } from './member-list.component';

const updatedEvent: Event = {
  '_id': '5a55135639fbc4ca3ee0ce5a',
  '_creator': '5a550ea739fbc4ca3ee0ce58',
  'title': 'My first updated event',
  'description': 'My first updated description',
  'city': 'Miami',
  'state': 'FL',
  'startTime': '2018-01-09T19:00:00.000Z',
  'endTime': '2018-01-09T20:00:00.000Z',
  '__v': 1,
  'suggestLocations': true,
  'members': [
    {
      '_id': '5a550ea739fbc4ca3ee0ce58',
      'username': 'newUser',
      '__v': 0,
      'dietPreferences': []
    },
    {
      '_id': '5a539449b689d341cccc4be7',
      'username': 'adam',
      '__v': 0,
      'dietPreferences': []
    }
  ]
};

const eventCreator = {
  'username': 'newUser',
  '_id': '5a550ea739fbc4ca3ee0ce58'
};

const nonEventCreator = {
  'username': 'adam',
  '_id': '5a539449b689d341cccc4be7'
};

class MockAuthService {
  currentUser() {}
}

class MockEventsService {
  isEventCreator() {}
  subscribe() {}
}

describe('MemberListComponent', () => {
  let component: MemberListComponent;
  let fixture: ComponentFixture<MemberListComponent>;
  let authService: AuthService;
  let eventsService: EventsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MemberListModule ]
    })
    .overrideComponent(MemberListComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: EventsService, useClass: MockEventsService }
        ]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberListComponent);
    component = fixture.componentInstance;
    component.eventId = '5a55135639fbc4ca3ee0ce5a';
    component.creatorId = '5a550ea739fbc4ca3ee0ce58';
    component.members = [{
      '_id': '5a550ea739fbc4ca3ee0ce58',
      'username': 'newUser',
      '__v': 0,
      'dietPreferences': []
    }];

    authService = fixture.debugElement.injector.get(AuthService);
    eventsService = fixture.debugElement.injector.get(EventsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('viewed by the event creator', () => {
    beforeEach(() => {
      spyOn(authService, 'currentUser').and.callFake(() => eventCreator);
      spyOn(eventsService, 'isEventCreator').and.callFake(() => true);
      fixture.detectChanges();
    });

    it('should initialize by setting an isMember property', () => {
      expect(component.isMember).toBe(true);
    });

    it('should initialize by setting an isCreator property', () => {
      expect(component.isCreator).toBe(true);
    });

    it('should display the event creator in the member list', () => {
      const members = fixture.debugElement.queryAll(By.css('.member'));
      expect(members[0].nativeElement.textContent).toEqual('newUser');
    });
  });

  describe('viewed by a non-event creator', () => {
    beforeEach(() => {
      spyOn(authService, 'currentUser').and.callFake(() => nonEventCreator);
      spyOn(eventsService, 'isEventCreator').and.callFake(() => false);
      fixture.detectChanges();
    });

    it('should initialize by setting an isMember property', () => {
      expect(component.isMember).toBe(false);
    });

    it('should initialize by setting an isCreator property', () => {
      expect(component.isCreator).toBe(false);
    });

    it('should update the member list when the subscribe button is clicked', () => {
      spyOn(eventsService, 'subscribe')
        .and.callFake(() => of(updatedEvent));
      const subscribeBtn = fixture.debugElement.query(By.css('button'));
      subscribeBtn.nativeElement.click();
      fixture.detectChanges();

      expect(eventsService.subscribe).toHaveBeenCalled();
      expect(component.members.length).toEqual(2);
      expect(component.isMember).toEqual(true);

      const members = fixture.debugElement.queryAll(By.css('.member'));
      expect(members[1].nativeElement.textContent).toEqual('adam');
    });

    it('should show an error if a subscribe fails', () => {
      spyOn(eventsService, 'subscribe').and.callFake(() => {
        return throwError({
          error: {
            message: 'Something went wrong. Try again.'
          }
        });
      });
      const subscribeBtn = fixture.debugElement.query(By.css('button'));
      subscribeBtn.nativeElement.click();
      fixture.detectChanges();

      expect(eventsService.subscribe).toHaveBeenCalled();
      expect(component.members.length).toEqual(1);
      expect(component.isMember).toEqual(false);

      const errorMessage = fixture.debugElement.query(By.css('.alert-danger'));
      expect(errorMessage.nativeElement.textContent)
        .toEqual('Something went wrong. Try again.');
    });
  });
});
