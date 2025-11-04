import { Routes } from '@angular/router';
import { ProductTableComponent } from './structure/productTable.component';
import { ProductDetailComponent } from './structure/productDetail.component';

export const routes: Routes = [
  { path: "table", component: ProductTableComponent },
  { path: "detail", component: ProductDetailComponent },
  { path: "", component: ProductTableComponent }
];
