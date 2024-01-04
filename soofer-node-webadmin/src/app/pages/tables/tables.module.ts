import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DriverService } from '../driver/driver.service';
import { ThemeModule } from '../../@theme/theme.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonService } from '../common/common.service';
import { TablesRoutingModule, routedComponents } from './tables-routing.module';
import { SmartTableService } from '../../@core/data/smart-table.service';
import { Service } from '../rider/rider.service';
import { NgDatepickerModule } from 'ng2-datepicker';
import { SelectModule } from 'ng-select';
import { TableService } from './table.service';
import { MatChipsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import { HttpIntercept } from '../../http.interceptor';
import { PromoService } from '../promocode/promocode.service';
import { ReviewsService } from '../Reviews/Reviews.service';
import { NguiMapModule } from '@ngui/map';
import { NgxTinymceModule } from 'ngx-tinymce';
import { UtilityService } from './utility/utility.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NbChatModule, NbCheckboxModule, NbListModule } from '@nebular/theme';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { packagevalidityShowPipe } from "./../packagevalidity.pipe";
import { ButtonNotifyComponent } from './notification/button-notify/button-notify.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { MatTooltipModule } from '@angular/material';


@NgModule({
  imports: [
    ThemeModule,
    NguiMapModule,
    NgxTinymceModule.forRoot({
      baseURL: "//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/",
    }),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TablesRoutingModule,
    Ng2SmartTableModule,
    NgxSpinnerModule,
    SelectModule,
    MatChipsModule,
    MatIconModule,
    NbCheckboxModule,
    NbChatModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    NgDatepickerModule,
    MatInputModule,
    OwlDateTimeModule,
    MatTooltipModule,
    ClipboardModule,
    NbListModule,
    OwlNativeDateTimeModule,
    UiSwitchModule.forRoot({
      size: "medium",
      switchColor: "#80FFA2",
      defaultBgColor: "red",
      checkedLabel: "ONLINE",
      uncheckedLabel: "OFFLINE",
    }),
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [...routedComponents, packagevalidityShowPipe, ButtonNotifyComponent,],
  exports: [ButtonNotifyComponent],
  entryComponents: [ButtonNotifyComponent],
  providers: [
    Service,
    ReviewsService,
    PromoService,
    DriverService,
    CommonService,
    TableService,
    UtilityService,
    SmartTableService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },
  ],
})
export class TablesModule { }
