
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsRoutingModule, routedComponents } from './taxidispatch-routing.module';
import { NguiMapModule } from '@ngui/map';
import { NgxMyDatePickerModule, NgxMyDatePickerConfig } from 'ngx-mydatepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpIntercept } from '../../http.interceptor';
// import { AutoRefreshComponent } from './request-list/request-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TaxiDispatchService } from './taxidispatch.service';
import { PendingRequestsService } from './request-list/request.list.service';

@NgModule({
  imports: [
    AmazingTimePickerModule,
    TimePickerModule,
    NgxMyDatePickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    Ng2SmartTableModule,
    SelectModule,
    ThemeModule,
    Ng2SmartTableModule,
    NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    FormsRoutingModule,
    ToastrModule.forRoot(),
    NguiMapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?libraries=visualization,places,drawing'
    }),
  ],
  declarations: [
    ...routedComponents,

  ],
  providers: [PendingRequestsService ,
    NgxMyDatePickerConfig, { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },
     ],
  // entryComponents:[AutoRefreshComponent]
})

export class FormsModule { }
