import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cart } from '../models/cart.model';

@Component({
  templateUrl: 'cartDetail.component.html',
  imports: [RouterLink, FormsModule, CurrencyPipe],
})
export class CartDetailComponent {
  constructor(public cart: Cart) {}
}
