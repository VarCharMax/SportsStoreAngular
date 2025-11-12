import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';
import { Repository } from '../models/repository';

@Component({
  templateUrl: 'admin.component.html',
  imports: [RouterLink, RouterModule],
})
export class AdminComponent {
  authService: AuthenticationService = inject(AuthenticationService);
  private repo: Repository = inject(Repository);

  constructor() {
    this.repo.filter.reset();
    this.repo.filter.related = true;
    this.repo.getProductsAsync();
    this.repo.getSuppliersAsync();
    this.repo.getOrdersAsync();
  }
}
