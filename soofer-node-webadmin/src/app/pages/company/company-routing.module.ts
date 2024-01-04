import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsComponent } from './company.component';
import { FormInputsComponent } from './company-add/form-inputs.component';
import { CompanyTableComponent } from './company-view/form-layouts.component';
import { CompanyService } from './company.service';
import { CommonService } from '../common/common.service';


const routes: Routes = [{
  path: '',
  component: FormsComponent,
  children: [{
    path: 'company-add',
    component: FormInputsComponent,
  },
  {
    path: 'company-view',
    component: CompanyTableComponent,
  }],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [CompanyService, CommonService],
  exports: [
    RouterModule,
  ],
})

export class FormsRoutingModule {

}

export const routedComponents = [
  FormsComponent,
  FormInputsComponent,
  CompanyTableComponent,
];
