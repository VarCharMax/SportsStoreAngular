import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Repository } from "../models/repository";
import { Product } from "../models/product.model";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
  selector: "product-detail",
  templateUrl: "productDetail.component.html"
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private repo: Repository = inject(Repository);
  private productRetrieved: Subscription = new Subscription();

  product: Product | undefined = undefined;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.productRetrieved = this.repo.productRetrieved.subscribe({
      next: (prod) => {
        this.product = prod;
      },
      error: () => { }
    }
    );

    /*
    let id = Number.parseInt(this.activeRoute.snapshot.params["id"]);
    if (id) {
      this.repo.getProduct(id);
    } else {
      this.router.navigateByUrl("/");
    }
    */
  }

  ngOnDestroy() {
    this.productRetrieved.unsubscribe();
  }
}
