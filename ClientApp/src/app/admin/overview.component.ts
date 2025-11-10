import { Component, inject } from '@angular/core';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { Repository } from '../models/repository';

@Component({
  templateUrl: 'overview.component.html',
})
export class OverviewComponent {
  private repo: Repository = inject(Repository);

  constructor() {}

  get products(): Product[] {
    return this.repo.getProductsCached();
  }

  get orders(): Order[] {
    return this.repo.getOrdersCached();
  }
}
