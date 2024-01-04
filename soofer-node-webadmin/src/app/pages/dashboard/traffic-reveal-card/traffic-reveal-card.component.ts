import { Component, OnDestroy } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';
import { DashBoardTripEarning } from '../../../app.config';

@Component({
  selector: 'ngx-traffic-reveal-card',
  styleUrls: ['./traffic-reveal-card.component.scss'],
  templateUrl: './traffic-reveal-card.component.html',
})
export class TrafficRevealCardComponent implements OnDestroy {

  private alive = true;

  trafficListData: any;
  revealed = false;
  period: string = 'daily';

  constructor(private dashboardService: DashboardService) {
    this.getTrafficFrontCardData(this.period);
  }

  toggleView() {
    this.revealed = !this.revealed;
  }

  setPeriodAngGetData(value: string): void {
    this.period = value;
    this.getTrafficFrontCardData(value);
  }

  getTrafficFrontCardData(period: string) {
    this.dashboardService.getTripEarningReport(period)
      .then(res => {
        const data = res['docs'];
        const arr = DashBoardTripEarning.tripValues;
        arr.forEach(el => {
          el.value = data[el.label];
        });
        this.trafficListData = arr;
      })
      .catch(res => {
        console.log(res);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
