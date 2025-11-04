import { Routes } from '@angular/router';
import { ProductSelectionComponent } from './store/productSelection.component';

export const routes: Routes = [
  { path: "store/:category/:page", component: ProductSelectionComponent },
  { path: "store/:categoryOrPage", component: ProductSelectionComponent },
  { path: "store", component: ProductSelectionComponent },
  { path: "", redirectTo: "/store", pathMatch: "full" }
];
