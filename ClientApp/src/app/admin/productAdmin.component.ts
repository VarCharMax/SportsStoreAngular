import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../models/product.model';
import { Repository } from '../models/repository';
import { ProductEditorComponent } from './productEditor.component';

@Component({
  templateUrl: 'productAdmin.component.html',
  imports: [ProductEditorComponent, CurrencyPipe],
})
export class ProductAdminComponent implements OnInit, OnDestroy {
  private repo: Repository = inject(Repository);
  private productsChanged: Subscription = new Subscription();
  private productChanged: Subscription = new Subscription();

  product: Product = new Product();
  products: Product[] = [];
  tableMode: boolean = true;
  isFormValid: boolean = false;

  constructor() {}

  ngOnInit() {
    // Product edited event.
    this.productChanged = this.repo.productChanged.subscribe({
      next: (prod) => {
        let index = this.products.findIndex((t) => t.productId === prod.productId);
        this.products[index] = prod;
        this.product = prod;
        this.clearProduct();
      },
      error: () => {},
    });

    // Add and Delete events.
    this.productsChanged = this.repo.productsChanged.subscribe({
      next: (productList) => {
        this.products = productList;
        this.clearProduct();
      },
      error: () => {},
    });

    this.products = this.repo.getProductsCached();
  }

  selectProduct(id: number) {
    this.product = this.repo.getProductCached(id)!;
  }

  addProductFromEditor(prod: Product) {
    if (prod.isValid()) {
      this.isFormValid = true;
      this.product = prod;
    } else {
      this.isFormValid = false;
    }
  }

  saveProduct() {
    if (this.product != undefined) {
      if (this.product.productId == undefined) {
        this.repo.createProductAsync(this.product);
      } else {
        this.repo.replaceProductAsync(this.product);
      }
    }
  }

  deleteProduct(id: number) {
    this.repo.deleteProductAsync(id);
  }

  clearProduct() {
    this.product = new Product();
    this.repo.getProductCached(0); // this will invalidate the cache.
    this.tableMode = true;
  }

  ngOnDestroy(): void {
    this.productChanged.unsubscribe();
    this.productsChanged.unsubscribe();
  }
}
