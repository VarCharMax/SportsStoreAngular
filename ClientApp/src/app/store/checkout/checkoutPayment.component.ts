import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../models/order.model';

@Component({
  templateUrl: 'checkoutPayment.component.html',
  imports: [RouterLink, FormsModule],
})
export class CheckoutPaymentComponent {
  order: Order = inject(Order);

  constructor(private router: Router) {
    if (this.order.name == null || this.order.address == null) {
      router.navigateByUrl('/checkout/step1');
    }
  }
}
