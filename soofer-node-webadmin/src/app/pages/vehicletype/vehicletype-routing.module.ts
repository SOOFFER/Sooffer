import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsComponent } from './vehicletype.component';
import { FormInputsComponent } from './add/form-inputs.component'; 
import { Service } from './vehicletype.service';
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
  providers: [ Service, CommonService ],
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
