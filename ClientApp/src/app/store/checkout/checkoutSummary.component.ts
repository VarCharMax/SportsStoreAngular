import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../models/order.model';

@Component({
  templateUrl: 'checkoutSummary.component.html',
  imports: [CurrencyPipe],
})
export class CheckoutSummaryComponent {
  order: Order = inject(Order);

  constructor(private router: Router) {
    if (
      this.order.payment!.cardNumber == undefined ||
      this.order.payment!.cardExpiry == undefined ||
      this.order.payment!.cardSecurityCode == undefined
    ) {
      router.navigateByUrl('/checkout/step2');
    }
  }

  submitOrder() {
    this.order.submit();
    this.router.navigateByUrl('/checkout/confirmation');
  }
}
