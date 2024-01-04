import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsComponent } from './driver.component';
import { FormInputsComponent } from './add/form-inputs.component'; 
import { DriverService } from './driver.service';
import { CommonService } from '../common/common.service';

const routes: Routes = [{
  path: '',
  component: FormsComponent,
  children: [{
    path: 'add',
    component: FormInputsComponent,
  },  
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ], 
  providers: [ DriverService, CommonService ],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {

}

export const routedComponents = [
  FormsComponent,
  FormInputsComponent, 
];
