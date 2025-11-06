import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart } from '../models/cart.model';

@Component({
  selector: 'store-cartsummary',
  templateUrl: 'cartSummary.component.html',
  imports: [RouterLink, CurrencyPipe],
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
