import { NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsRoutingModule, routedComponents } from './tripdetails-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpIntercept } from '../../http.interceptor';
import { NguiMapModule } from '@ngui/map';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OwlDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  imports: [
    ThemeModule,
    FormsRoutingModule,
    NgMultiSelectDropDownModule,
    SelectModule,
    Ng2SmartTableModule,
    NguiMapModule,
    NgxSpinnerModule,
    OwlDateTimeModule
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true }]
})

export class TripDetailsModule { }
