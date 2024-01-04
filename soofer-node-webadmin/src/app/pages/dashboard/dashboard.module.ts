import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { ContactLComponent } from './contacts/lowrating/contacts.component';
import { ContactRComponent } from './contacts/contacts.component';
import { ElectricityComponent } from './electricity/electricity.component';
import { ElectricityChartComponent } from './electricity/electricity-chart/electricity-chart.component';
import { SolarDComponent } from './solar/driver/solard.component';
import { SolarRComponent } from './solar/rider/solarr.component';
import { DashboardService } from './dashboard.service';
import { NgDashboardModule } from 'ngx-dashboard';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TrafficRevealCardComponent } from './traffic-reveal-card/traffic-reveal-card.component';
import { TrafficFrontCardComponent } from './traffic-reveal-card/front-side/traffic-front-card.component';
import { TrafficCardsHeaderComponent } from './traffic-reveal-card/traffic-cards-header/traffic-cards-header.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';
import { HttpIntercept } from '../../http.interceptor';
import { ElectricityService } from '../../@core/data/electricity.service';

@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    ContactLComponent,
    ContactRComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    SolarRComponent,
    SolarDComponent,
    TrafficRevealCardComponent,
    TrafficFrontCardComponent,
    TrafficCardsHeaderComponent,
  ],
  providers: [
    DashboardService,

    ElectricityService,
    // { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true },

  ],
  entryComponents: [
    DashboardComponent
  ],
})
export class DashboardModule { }
