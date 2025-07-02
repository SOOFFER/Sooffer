import { NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { NgDatepickerModule } from 'ng2-datepicker';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsRoutingModule, routedComponents } from './driver-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpIntercept } from '../../http.interceptor';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NbCheckboxModule } from '@nebular/theme';

@NgModule({
  imports: [
    ThemeModule,
    FormsRoutingModule,
    SelectModule,
    NgDatepickerModule,
    MatCheckboxModule,
    NbCheckboxModule,
    NgMultiSelectDropDownModule
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },
  ],
})
export class FormsModule { }
