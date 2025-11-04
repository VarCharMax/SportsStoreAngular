import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Subscription } from 'rxjs';
import { Repository } from "../models/repository";
import { Product } from "../models/product.model";

@Component({
  selector: "product-table",
  templateUrl: "productTable.component.html",
  imports: [
    RouterLink
  ]
})
export class ProductTableComponent implements OnInit, OnDestroy {
  private productsChanged: Subscription = new Subscription();
  private repo: Repository = inject(Repository);

  products: Product[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.productsChanged = this.repo.productsChanged.subscribe({
      next: (productList) => {
        this.products = productList;
      },
      error: () => { }
    }
    );

    this.repo.getProductsAsync();
  }

  ngOnDestroy() {
    this.productsChanged.unsubscribe();
  }
}
