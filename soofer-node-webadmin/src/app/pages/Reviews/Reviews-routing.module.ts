import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormsComponent } from './Reviews.component';
import { ReviewsService } from './Reviews.service';
import { CommonService } from '../common/common.service';


const routes: Routes = [{
  path: '',
  component: FormsComponent,
  }];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ], 
  providers: [ ReviewsService, CommonService ],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {

}

export const routedComponents = [
  FormsComponent,
];
