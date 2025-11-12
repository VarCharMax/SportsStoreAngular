import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from '../auth/authentication.component';
import { AuthenticationGuard } from '../auth/authentication.guard';
import { AdminComponent } from './admin.component';
import { OrderAdminComponent } from './orderAdmin.component';
import { OverviewComponent } from './overview.component';
import { ProductAdminComponent } from './productAdmin.component';

const routes: Routes = [
  { path: 'login', component: AuthenticationComponent },
  {
    path: '',
    component: AdminComponent,
    canActivateChild: [AuthenticationGuard],
    children: [
      { path: 'products', component: ProductAdminComponent },
      { path: 'orders', component: OrderAdminComponent },
      { path: 'overview', component: OverviewComponent },
      { path: '', component: OverviewComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AdminModule {}
