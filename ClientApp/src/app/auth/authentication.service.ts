import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Repository } from '../models/repository';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private router: Router) {}
  private repo: Repository = inject(Repository);

  authenticated: boolean = false;
  name: string | undefined = 'admin';
  password: string | undefined = 'MySecret123$';
  callbackUrl: string | undefined;

  login(): Observable<boolean> {
    this.authenticated = false;
    return this.repo.login(this.name!, this.password!).pipe(
      map((response) => {
        if (response) {
          this.authenticated = true;
          // this.password = undefined;
          this.router.navigateByUrl(this.callbackUrl || '/admin/overview');
        }
        return this.authenticated;
      }),
      catchError((e) => {
        this.authenticated = false;
        return of(false);
      }),
    );
  }

  logout() {
    this.authenticated = false;
    this.repo.logout();
    this.router.navigateByUrl('/store');
  }
}
