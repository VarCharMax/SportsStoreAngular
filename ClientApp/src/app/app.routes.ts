import { Routes } from '@angular/router';
import { ProductSelectionComponent } from './store/productSelection.component';

export const routes: Routes = [
  { path: "store", component: ProductSelectionComponent },
  { path: "", redirectTo: "/store", pathMatch: "full" }
];
