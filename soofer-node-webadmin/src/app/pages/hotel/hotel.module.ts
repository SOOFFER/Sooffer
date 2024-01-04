import { NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsRoutingModule, routedComponents } from './hotel-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpIntercept } from '../../http.interceptor';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { NguiMapModule} from '@ngui/map';


@NgModule({
  imports: [
    ThemeModule,
    FormsRoutingModule,
    Ng2SmartTableModule,
    HttpClientModule,
    SelectModule,
    Ng4GeoautocompleteModule.forRoot(),
    NguiMapModule.forRoot({apiUrl: 'AIzaSyBMIRPoXJpMsWxPLiXP4XYYuh-1D9nylX8'}),
    NgMultiSelectDropDownModule.forRoot()


  ],
  declarations: [
    ...routedComponents,

  ],
  providers: [
    SmartTableService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },
  ],
})
export class HotelModule { }
