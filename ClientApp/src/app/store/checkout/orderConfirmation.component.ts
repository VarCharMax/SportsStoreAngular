import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../models/order.model';

@Component({
  templateUrl: 'orderConfirmation.component.html',
  imports: [RouterLink],
})
export class OrderConfirmationComponent {
  order: Order = inject(Order);

  constructor(private router: Router) {
    if (!this.order.submitted) {
      router.navigateByUrl('/checkout/step3');
    }
  }
}
