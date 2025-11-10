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

  constructor() {}

  ngOnInit() {
    this.productChanged = this.repo.productChanged.subscribe({
      next: (prod) => {
        this.product = prod;
      },
      error: () => {},
    });

    this.productsChanged = this.repo.productsChanged.subscribe({
      next: (productList) => {
        this.products = productList;
      },
      error: () => {},
    });

    this.repo.getProductsAsync();
  }

  selectProduct(id: number) {
    this.repo.getProductAsync(id);
  }

  saveProduct() {
    if (this.product!.productId == undefined) {
      this.repo.createProductAsync(this.product);
    } else {
      this.repo.replaceProductAsync(this.product);
    }
    this.clearProduct();
    this.tableMode = true;
  }

  deleteProduct(id: number) {
    this.repo.deleteProductAsync(id);
  }

  clearProduct() {
    this.product = new Product();
    this.tableMode = true;
  }

  ngOnDestroy() {
    this.productChanged.unsubscribe();
    this.productsChanged.unsubscribe();
  }
}
