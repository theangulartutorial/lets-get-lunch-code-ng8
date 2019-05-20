import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../services/auth/user';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = { username: '', password: '' };
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login(credentials) {
    this.authService.login(credentials).subscribe(res => {
      this.router.navigate(['/dashboard']);
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

}
