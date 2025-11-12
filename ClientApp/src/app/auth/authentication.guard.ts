import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationGuard {
  authService: AuthenticationService = inject(AuthenticationService);
  constructor(private router: Router) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.authenticated) {
      return true;
    } else {
      this.authService.callbackUrl = route.url.toString();
      this.router.navigateByUrl('/admin/login');
      return false;
    }
  }
}
