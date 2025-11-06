import { inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Cart } from './cart.model';
import { Repository } from './repository';

type OrderSession = {
  name?: string;
  address?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardSecurityCode?: string;
};

@Injectable({
  providedIn: 'root',
})
export class Order {
  private repo: Repository = inject(Repository);

  cart: Cart = inject(Cart);

  orderId: number | undefined;
  name: string | undefined;
  address: string | undefined;
  submitted: boolean = false;
  shipped: boolean = false;
  payment: Payment = new Payment();
  orderConfirmation: OrderConfirmation | undefined;

  constructor(router: Router) {
    router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        if (
          router.url.startsWith('/checkout') &&
          this.name != undefined &&
          this.address != undefined
        ) {
          this.repo.storeSessionData<OrderSession>('checkout', {
            name: this.name,
            address: this.address,
            cardNumber: this.payment!.cardNumber,
            cardExpiry: this.payment!.cardExpiry,
            cardSecurityCode: this.payment!.cardSecurityCode,
          });
        }
      });

    this.repo.getSessionData<OrderSession>('checkout').subscribe((data) => {
      if (data != null) {
        this.name = data.name;
        this.address = data.address;
        this.payment!.cardNumber = data.cardNumber;
        this.payment!.cardExpiry = data.cardExpiry;
        this.payment!.cardSecurityCode = data.cardSecurityCode;
      }
    });
  }

  get products(): CartLine[] {
    return this.cart.selections.map((p) => new CartLine(p.productId!, p.quantity));
  }

  clear() {
    this.name = undefined;
    this.address = undefined;
    this.payment = new Payment();
    this.cart.clear();
    this.submitted = false;
  }

  submit() {
    this.submitted = true;
    this.repo.createOrder(this);
  }
}

export class Payment {
  cardNumber?: string;
  cardExpiry?: string;
  cardSecurityCode?: string;
}

export class CartLine {
  constructor(private productId: number, private quantity: number) {}
}

export class OrderConfirmation {
  constructor(public orderId: number, public authCode: string, public amount: number) {}
}
