import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart } from '../models/cart.model';

@Component({
  templateUrl: 'cartDetail.component.html',
  imports: [FormsModule, CurrencyPipe],
})
export class CartDetailComponent {
  constructor(public cart: Cart) {}
}
