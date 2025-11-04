import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Repository } from './models/repository';
import { Product } from './models/product.model';
import { Supplier } from './models/supplier.model';
import { ProductTableComponent } from './structure/productTable.component';
import { CategoryFilterComponent } from './structure/categoryFilter.component';

@Component({
  selector: 'app-root',
  imports: [
    ProductTableComponent,
    CategoryFilterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private repo: Repository = inject(Repository);
  private productRetrieved: Subscription = new Subscription();
  private productsChanged: Subscription = new Subscription();
  private productChanged: Subscription = new Subscription();
  private suppliersChanged: Subscription = new Subscription();
  private supplierChanged: Subscription = new Subscription();
  private errorsChanged: Subscription = new Subscription();

  title = 'SportsStore';
  product: Product | undefined = undefined;
  products: Product[] = [];
  supplier: Supplier | undefined = undefined;;
  suppliers: Supplier[] = [];
  errorMessage = '';

  ngOnInit() {
    this.productRetrieved = this.repo.productRetrieved.subscribe((prod) => {
      this.product = prod;
    });

    this.productsChanged = this.repo.productsChanged.subscribe((productList) => {
      this.products = productList;
    });

    this.productChanged = this.repo.productChanged.subscribe((product) => {
      this.product = product;
    });

    this.suppliersChanged = this.repo.suppliersChanged.subscribe((supplierList) => {
      this.suppliers = supplierList;
    });

    this.supplierChanged = this.repo.supplierChanged.subscribe((supplier) => {
      this.supplier = supplier;
    });

    this.errorsChanged = this.repo.errorsChanged.subscribe(message => {
      let err = '';
      Object.keys(message).forEach(key => {
        if (key !== '') {
          err += `${message[key].join('\n')}`;
        }
      });
      this.errorMessage = err;
    });

    this.repo.getProducts(true);
  }

  createProduct() {
    this.repo.createProduct(new Product(
      0,
      "X-Ray Scuba Mask",
      "Watersports",
      "See what the fish are hiding",
      49.99,
      this.repo.getSupplierCached(1)
    ));
  }

  createProductAndSupplier() {
    let s = new Supplier(0, "Rocket Shoe Corp", "Boston", "MA");
    let p = new Product(0, "Rocket-Powered Shoes", "Running", "Set a new record", 100, s);
    this.repo.createProductAndSupplier(p, s);
  }

  replaceProduct() {
    let p = this.repo.getProductCached(1)!;
    p.name = "Modified Product";
    p.category = "Modified Category";
    this.repo.replaceProduct(p);
  }

  updateProduct() {
    let changes = new Map<string, any>();
    changes.set("name", "Green Kayak");
    changes.set("supplier", null);
    this.repo.updateProduct(1, changes);
  }

  replaceSupplier() {
    let s = new Supplier(3, "Modified Supplier", "New York", "NY");
    this.repo.replaceSupplier(s);
  }

  deleteProduct() {
    this.repo.deleteProduct(1);
  }

  deleteSupplier() {
    this.repo.deleteSupplier(2);
  }

  ngOnDestroy() {
    this.productRetrieved.unsubscribe();
    this.productsChanged.unsubscribe();
    this.productChanged.unsubscribe();
    this.suppliersChanged.unsubscribe();
    this.supplierChanged.unsubscribe();
    this.errorsChanged.unsubscribe();
  }
}
