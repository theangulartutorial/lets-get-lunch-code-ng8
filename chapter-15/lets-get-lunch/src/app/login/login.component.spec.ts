import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';
import { LoginModule } from './login.module';
import { LoginComponent } from './login.component';

class LoginPage {
  loginBtn: DebugElement;
  usernameInput: HTMLInputElement;
  passwordInput: HTMLInputElement;

  addPageElements() {
    this.loginBtn = fixture.debugElement.query(By.css('button'));
    this.usernameInput = fixture
                           .debugElement
                           .query(By.css('[name=username]'))
                           .nativeElement;
    this.passwordInput = fixture
                           .debugElement
                           .query(By.css('[name=password]'))
                           .nativeElement;
  }
}

class MockRouter {
  navigate(path) {}
}

class MockAuthService {
  login(credentials) {}
}

let component: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let authService: AuthService;
let router: Router;
let loginPage: LoginPage;

describe('LoginComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ LoginModule ]
    })
    .overrideComponent(LoginComponent, {
      set: {
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: Router, useClass: MockRouter }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    loginPage = new LoginPage();
    authService = fixture.debugElement.injector.get(AuthService);
    router = fixture.debugElement.injector.get(Router);

    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      fixture.detectChanges();
      loginPage.addPageElements();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the dashboard with valid credentials', () => {
    loginPage.usernameInput.value = 'johndoe';
    loginPage.passwordInput.value = 'password';
    loginPage.usernameInput.dispatchEvent(new Event('input'));
    loginPage.passwordInput.dispatchEvent(new Event('input'));

    spyOn(authService, 'login').and.callFake(() => {
      return of({ token: 'token' });
    });
    spyOn(router, 'navigate');
    loginPage.loginBtn.nativeElement.click();

    expect(authService.login).toHaveBeenCalledWith({
      username: 'johndoe',
      password: 'password'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should display an error message for a user who does not exist', () => {
    loginPage.usernameInput.value = 'doesnotexist';
    loginPage.passwordInput.value = 'doesnotexist';
    loginPage.usernameInput.dispatchEvent(new Event('input'));
    loginPage.passwordInput.dispatchEvent(new Event('input'));

    spyOn(authService, 'login').and.callFake(() => {
      return throwError({ error: { message: 'User could not be found.' }});
    });
    spyOn(router, 'navigate');
    loginPage.loginBtn.nativeElement.click();
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    const errorMessage = fixture.debugElement.query(By.css('.alert'));
    expect(errorMessage.nativeElement.textContent)
      .toEqual('User could not be found.');
  });
});
