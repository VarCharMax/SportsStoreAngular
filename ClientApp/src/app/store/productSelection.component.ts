import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartSummaryComponent } from './cartSummary.component';
import { CategoryFilterComponent } from './categoryFilter.component';
import { PaginationComponent } from './pagination.component';
import { ProductListComponent } from './productList.component';

@Component({
  selector: 'store-products',
  templateUrl: 'productSelection.component.html',
  imports: [
    RouterLink,
    CartSummaryComponent,
    CategoryFilterComponent,
    ProductListComponent,
    PaginationComponent,
  ],
})
export class ProductSelectionComponent {}
