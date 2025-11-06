import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Cart } from '../models/cart.model';

@Component({
  selector: 'store-cartsummary',
  templateUrl: 'cartSummary.component.html',
  imports: [CurrencyPipe],
})
export class CartSummaryComponent {
  private cart: Cart = inject(Cart);

  constructor() {}

  get itemCount(): number {
    return this.cart.itemCount;
  }

  get totalPrice(): number {
    return this.cart.totalPrice;
  }
}
