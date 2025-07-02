import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsComponent } from './taxidispatch.component';
import { FormInputsComponent } from './add/form-inputs.component';
import { TaxiDispatchService } from './taxidispatch.service';
import { CommonService } from '../common/common.service';
import { RetryMTDComponent } from './retry-mtd/retry-mtd.component';
import {   AutoRefreshComponent } from './request-list/request-list.component';

const routes: Routes = [{
  path: '',
  component: FormsComponent,
  children: [{
    path: 'add',
    component: FormInputsComponent,
  },
  {
    path: 'request-list',
    component: AutoRefreshComponent
  },
  {
    path: 'retry-mtd/:id',
    component: RetryMTDComponent,
  }
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [TaxiDispatchService, CommonService],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {

}

export const routedComponents = [
  FormsComponent,
  FormInputsComponent,
  RetryMTDComponent,
  AutoRefreshComponent,
];
