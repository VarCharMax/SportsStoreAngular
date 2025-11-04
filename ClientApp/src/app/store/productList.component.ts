import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { Subscription } from "rxjs";
import { Repository } from "../models/repository";
import { Product } from "../models/product.model";

@Component({
  selector: "store-product-list",
  imports: [
    CurrencyPipe
  ],
  templateUrl: "productList.component.html"
})
export class ProductListComponent implements OnInit, OnDestroy {

  private productsChanged: Subscription = new Subscription();
  private repo: Repository = inject(Repository);

  products: Product[] = [];

  constructor() { }

  ngOnInit() {
    this.productsChanged = this.repo.productsChanged.subscribe({
      next: (productList) => {
        this.products = productList;
      },
      error: () => { }
    }
    );

    this.repo.getProducts();
  }

  addToCart(product: Product) {
    // throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    this.productsChanged.unsubscribe();
  }
}
