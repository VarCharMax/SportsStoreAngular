import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Order } from '../models/order.model';
import { Repository } from '../models/repository';

@Component({
  templateUrl: 'orderAdmin.component.html',
  imports: [CurrencyPipe],
})
export class OrderAdminComponent {
  private repo: Repository = inject(Repository);

  constructor() {}

  get orders(): Order[] {
    return this.repo.getOrdersCached();
  }

  markShipped(order: Order) {
    this.repo.shipOrder(order);
  }
}
