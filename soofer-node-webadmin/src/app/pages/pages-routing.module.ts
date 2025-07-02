import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'dashboard',
    component: DashboardComponent,
  }, {
    path: 'iot-dashboard',
    component: DashboardComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
  },
  {
    path: 'hotel',
    loadChildren: './hotel/hotel.module#HotelModule',
  },
  {
    path: 'company',
    loadChildren: './company/company.module#FormsModule',
  },
  {
    path: 'driver',
    loadChildren: './driver/driver.module#FormsModule',
  },
  {
    path: 'drivertaxi',
    loadChildren: './drivertaxi/driver.module#FormsModule',
  },
  {
    path: 'vehicletype',
    loadChildren: './vehicletype/vehicletype.module#FormsModule',
  },
  {
    path: 'rider',
    loadChildren: './rider/rider.module#FormsModule',
  },
  {
    path:'trippackage',
    loadChildren: './trippackage/trippackage.module#FormsModule'
  },
  {
    path: 'promocode',
    loadChildren: './promocode/promocode.module#FormsModule',
  },
  {
    path: 'tripdetails',
    loadChildren: './tripdetails/tripdetails.module#TripDetailsModule'
  },
  {
    path: 'taxidispatch',
    loadChildren: './taxidispatch/taxidispatch.module#FormsModule',
  }, {
    path: 'charts',
    loadChildren: './charts/charts.module#ChartsModule',
  }, {
    path: 'tables',
    loadChildren: './tables/tables.module#TablesModule',
  }, {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
