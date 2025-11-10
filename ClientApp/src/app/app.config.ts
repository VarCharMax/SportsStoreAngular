import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ErrorHandlerService } from './errorHandler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(BrowserModule),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'en-AU' },
    ErrorHandlerService,
    { provide: HTTP_INTERCEPTORS, useExisting: ErrorHandlerService, multi: true },
  ],
};
