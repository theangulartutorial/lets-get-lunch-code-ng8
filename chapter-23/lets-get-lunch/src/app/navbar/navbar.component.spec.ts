import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../services/auth/auth.service';

class MockRouter {
  navigate(path) {}
}

class MockAuthService {
  loggedIn = of();

  logout = jasmine.createSpy('logout');

  isLoggedIn() {}
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      providers: [
        { provide: AuthService, useClass:  MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with a user who is logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn')
                                      .and.returnValue(true);
      fixture.detectChanges();
    });

    it('should initialize to see if a user is logged in', () => {
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(true);
    });

    it('should have a link to the dashboard when clicking the brand name', () => {
      const link = fixture.debugElement.query(By.css('.navbar-brand'));
      expect(link.attributes.routerLink).toEqual('/dashboard');
    });

    it('should have a link to view all events', () => {
      const link = fixture.debugElement.query(By.css('[data-test=events]'));
      expect(link.attributes.routerLink).toEqual('/events');
    });

    it('should have a link to logout visible', () => {
      const link = fixture.debugElement.query(By.css('[data-test=logout]'));
      expect(link.nativeElement.innerText).toEqual('Logout');
    });

    it('should navigate to the home page when logout is clicked', () => {
      spyOn(router, 'navigate');
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('with a user who is not logged in', () => {
    beforeEach(() => {
      authService.isLoggedIn = jasmine.createSpy('isLoggedIn')
                                      .and.returnValue(false);
      fixture.detectChanges();
    });

    it('should initialize to see if a user is logged in', () => {
      expect(authService.isLoggedIn).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(false);
    });

    it('should have a link to the homepage when clicking the brand name', () => {
      const link = fixture.debugElement.query(By.css('.navbar-brand'));
      expect(link.attributes.routerLink).toEqual('');
    });

    it('should have a link to signup visible', () => {
      const link = fixture.debugElement.query(By.css('[data-test=signup]'));
      expect(link.attributes.routerLink).toEqual('/signup');
    });

    it('should have a link to login visible', () => {
      const link = fixture.debugElement.query(By.css('[data-test=login]'));
      expect(link.attributes.routerLink).toEqual('/login');
    });
  });
});
