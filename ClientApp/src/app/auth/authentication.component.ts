import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './authentication.service';

@Component({
  templateUrl: 'authentication.component.html',
  imports: [FormsModule],
})
export class AuthenticationComponent {
  authService: AuthenticationService = inject(AuthenticationService);
  constructor() {}

  showError: boolean = false;

  login() {
    this.showError = false;
    this.authService.login().subscribe((result) => {
      this.showError = !result;
    });
  }
}
