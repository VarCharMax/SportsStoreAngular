import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorHandlerService } from './errorHandler.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private errorService: ErrorHandlerService = inject(ErrorHandlerService);
  private lastError: string[] = [];

  ngOnInit(): void {
    this.errorService.errors.subscribe((error: string[]) => {
      this.lastError = error;
    });
  }

  get error(): string[] {
    return this.lastError;
  }

  clearError() {
    this.lastError = [];
  }
}
