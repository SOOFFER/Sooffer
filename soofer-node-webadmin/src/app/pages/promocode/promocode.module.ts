import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsRoutingModule, routedComponents } from './promocode-routing.module';
import { NgDatepickerModule } from 'ng2-datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//import { FormInputsComponent } from './add/form-inputs.component';
//import { AmazingTimePickerService } from 'amazing-time-picker'///src/app/atp-library/time-picker/time-picker.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  imports: [
    ThemeModule,
    FormsRoutingModule,
    NgDatepickerModule,
    NgMultiSelectDropDownModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    ...routedComponents,
    // TimePickerComponent,

  ],

  //   entryComponents: [
  //     TimePickerComponent
  // ],
  // exports:[
  //   //TimePickerComponent
  // ]
})
export class FormsModule { }
