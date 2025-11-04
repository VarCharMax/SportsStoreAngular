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
  private errorsChanged: Subscription = new Subscription();

  title = 'SportsStore';
  product: Product | undefined = undefined;
  products: Product[] = [];
  supplier: Supplier | undefined = undefined;;
  suppliers: Supplier[] = [];
  errorMessage = '';

  ngOnInit() {
    this.errorsChanged = this.repo.errorsChanged.subscribe(message => {
      let err = '';
      Object.keys(message).forEach(key => {
        if (key !== '') {
          err += `${message[key].join('\n')}`;
        }
      });
      this.errorMessage = err;
    });

    // this.repo.getProducts(true);
  }

  ngOnDestroy() {
    this.errorsChanged.unsubscribe();
  }
}
