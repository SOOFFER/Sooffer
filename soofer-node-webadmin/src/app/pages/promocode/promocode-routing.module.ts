import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsComponent } from './promocode.component';
import { FormInputsComponent } from './add/form-inputs.component'; 
import { PromoService } from './promocode.service';
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
  providers: [ PromoService, CommonService ],
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
