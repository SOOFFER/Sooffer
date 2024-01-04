import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsComponent } from './hotel.component';
import { HotelFormInputsComponent } from './add/form-inputs.component';
import { HotelTableComponent } from './view/hotel-table.component';
import { HotelService } from './hotel.service';
 

const routes: Routes = [{
  path: '',
  component: FormsComponent,
  children: [{
    path: 'add',
    component: HotelFormInputsComponent,
  },
  {
    path: 'view',
    component: HotelTableComponent,
  } 
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [HotelService],
  exports: [
    RouterModule,
  ],
})
export class FormsRoutingModule {

}

export const routedComponents = [
  FormsComponent,
  HotelFormInputsComponent,
  HotelTableComponent,
 
];
