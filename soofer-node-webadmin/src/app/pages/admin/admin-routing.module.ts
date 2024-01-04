import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsComponent } from './admin.component';
import { AdminFormInputsComponent, PagesMenuCitywiseComponent } from './add/form-inputs.component';
import { AdminService } from './admin.service';
import { AdminTableComponent } from './view/admin-table.component';
import { ProfileComponent } from './profile/profile.component';
const routes: Routes = [{
  path: '',
  component: FormsComponent,
  children: [{
    path: 'add',
    component: AdminFormInputsComponent,
  },
  {
    path: 'view',
    component: AdminTableComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path :'add',
    component :PagesMenuCitywiseComponent
  }
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [AdminService],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {

}

export const routedComponents = [
  FormsComponent,
  AdminTableComponent,
  AdminFormInputsComponent,
  ProfileComponent,
];
