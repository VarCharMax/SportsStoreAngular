import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { Repository } from "../models/repository";
import { Product } from "../models/product.model";

@Component({
  selector: "product-table",
  templateUrl: "productTable.component.html"
})
export class ProductTableComponent implements OnInit, OnDestroy {
  private productsChanged: Subscription = new Subscription();
  private productChanged: Subscription = new Subscription();
  private repo: Repository = inject(Repository);

  constructor(private router: Router) { }

  ngOnInit() {

  }

  get products(): Product[] {
    return this.repo.getProductsCached();
  }

  selectProduct(id: number) {
    this.repo.getProduct(id);
    this.router.navigateByUrl("/detail");
  }

  ngOnDestroy() {
    this.productsChanged.unsubscribe();
    this.productChanged.unsubscribe();
  }
}
