import { NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsRoutingModule, routedComponents } from './rider-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpIntercept } from '../../http.interceptor';

@NgModule({
  imports: [
    ThemeModule,
    FormsRoutingModule,
    NgMultiSelectDropDownModule,
    SelectModule,
    // NgxIntlTelInputModule
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },
  ],
})
export class FormsModule { }
