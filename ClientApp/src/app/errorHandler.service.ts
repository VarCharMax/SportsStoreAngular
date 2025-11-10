import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerService implements HttpInterceptor {
  private errSubject = new Subject<string[]>();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((resp: HttpErrorResponse) => {
        if (resp.error.errors) {
          this.errSubject.next([...(Object.values(resp.error.errors) as string[])]);
        } else if (resp.error.title) {
          this.errSubject.next([resp.error.title]);
        } else {
          this.errSubject.next(['An HTTP error occurred']);
        }
        return throwError(() => new Error(resp.error));
      }),
    );
  }

  get errors(): Observable<string[]> {
    return this.errSubject;
  }
}
