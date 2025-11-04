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

  constructor() { }

  ngOnInit() {
    this.productsChanged = this.repo.productsChanged.subscribe({
      next: (productList) => {
        // this.products = productList;
      },
      error: () => { }
    }
    );

    this.repo.getProductsAsync();
  }

  get products(): Product[] {
    if (this.repo.getProductsCached() != null && this.repo.getProductsCached().length > 0) {
      let pageIndex = (this.repo.paginationObject.currentPage - 1) * this.repo.paginationObject.productsPerPage;
      return this.repo.getProductsCached().slice(pageIndex, pageIndex + this.repo.paginationObject.productsPerPage);
    }

    return [];
  }

  addToCart(product: Product) {

  }

  ngOnDestroy() {
    this.productsChanged.unsubscribe();
  }
}
