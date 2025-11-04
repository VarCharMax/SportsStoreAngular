import { Component, inject, OnInit } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { Repository } from "../models/repository";
import { Product } from "../models/product.model";
import { RatingsComponent } from "./ratings.component";

@Component({
  selector: "store-product-list",
  imports: [
    CurrencyPipe,
    RatingsComponent
  ],
  templateUrl: "productList.component.html"
})
export class ProductListComponent implements OnInit {
  private repo: Repository = inject(Repository);

  constructor() { }

  ngOnInit() {
    this.repo.getProductsAsync();
  }

  get products(): Product[] {
    if (this.repo.getProductsCached() != null && this.repo.getProductsCached().length > 0) {
      let pageIndex = (this.repo.paginationObject.currentPage - 1) * this.repo.paginationObject.productsPerPage;
      return this.repo
        .getProductsCached()
        .slice(pageIndex, pageIndex + this.repo.paginationObject.productsPerPage);
    }

    return [];
  }

  addToCart(product: Product) {

  }
}
