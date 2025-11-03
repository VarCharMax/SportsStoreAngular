import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(),
        importProvidersFrom(BrowserModule),
        provideRouter(routes),
        { provide: LOCALE_ID, useValue: 'en-AU' }
    ]
};
