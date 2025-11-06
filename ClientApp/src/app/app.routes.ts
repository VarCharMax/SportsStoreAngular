import { Routes } from '@angular/router';
import { CartDetailComponent } from './store/cartDetail.component';
import { ProductSelectionComponent } from './store/productSelection.component';

export const routes: Routes = [
  { path: 'cart', component: CartDetailComponent },
  { path: 'store/:category/:page', component: ProductSelectionComponent },
  { path: 'store/:categoryOrPage', component: ProductSelectionComponent },
  { path: 'store', component: ProductSelectionComponent },
  { path: '', redirectTo: '/store', pathMatch: 'full' },
];
