import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ElectricityService } from '../../../@core/data/electricity.service';
import { AppSettings } from '../../../app.config';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'ngx-electricity',
  providers: [DatePipe],
  styleUrls: ['./electricity.component.scss'],
  templateUrl: './electricity.component.html',
})
export class ElectricityComponent implements OnDestroy {

  // data:Array<any>;
  data: any = [];
  n: any;
  r: any;
  c: any;
  temp: any = [];
  type: any = 'year';
  types = ['week', 'month', 'year'];

  label: any;
  currentTheme: string;
  themeSubscription: any;

  getMonthName;
  dateObj = {};
  list = new Date();

  startWeekDate;
  endWeekDate;

  changePeriod(period: any): void {
    this.type = period;
    this.dispChart();
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
    this.dispChart();
  }

  constructor(private eService: ElectricityService, private datePipe: DatePipe, private themeService: NbThemeService) {
    this.dateObj['list'] = this.datePipe.transform(this.list, 'yyyy-MM-dd');
    this.dispChart();
  }

  dispChart() {
    this.n = '';
    this.data = [];
    this.startWeekDate = '';
    this.endWeekDate = '';
    this.label = '';
    this.getMonthName = '';
    if (this.type === 'week') {
      this.n = moment(this.dateObj['list']).year();
      this.data = [
        {
          title: this.n,
          months: [
            { month: 'Sunday', kWatts: 0, cost: 0 },
            { month: 'Monday', kWatts: 0, cost: 0 },
            { month: 'Tuesday', kWatts: 0, cost: 0 },
            { month: 'Wednesday', kWatts: 0, cost: 0 },
            { month: 'Thursday', kWatts: 0, cost: 0 },
            { month: 'Friday', kWatts: 0, cost: 0 },
            { month: 'Saturday', kWatts: 0, cost: 0 },
          ],
        },
      ];
      this.startWeekDate = moment(this.dateObj['list']).startOf(this.type).format('YYYY-MM-DD');
      this.endWeekDate = moment(this.dateObj['list']).endOf(this.type).format('YYYY-MM-DD');
      this.eService.getData(this.dateObj['list'], this.type)
        .then((val: any) => {
          for (const valarr of val) {
            this.data[0].months[moment(valarr.date).format('d')].kWatts = valarr.count;
          }
          for (const valarr of val) {
            if (valarr.value.length > 0) {
              this.temp = valarr.value[0];
              this.data[0].months[moment(valarr.date).format('d')].cost = this.temp.count;
            }
          }
        });
    } else if (this.type === 'month') {
      const daysCount = moment(this.dateObj['list']).daysInMonth();
      this.getMonthName = moment(this.dateObj['list']).format('MMMM');
      this.n = moment(this.dateObj['list']).year();
      this.label = moment(this.dateObj['list']).format('MMMM YYYY');
      this.data = [];
      this.data = [
        {
          title: this.n,
          months: [],
        },
      ];
      for (let i = 0; i < daysCount; i++) {
        this.data[0].months.push({ month: this.getMonthName + ' ' + (i + 1).toString(), kWatts: 0, cost: 0 });
      }
      this.eService.getData(this.dateObj['list'], this.type)
        .then((val: any) => {
          //console.log(val);
          for (const valarr of val) {
            this.data[0].months[valarr._id - 1].kWatts = valarr.count;
          }
          for (const valarr of val) {
            if (valarr.value.length > 0) {
              this.temp = valarr.value[0];
              this.data[0].months[valarr._id - 1].cost = this.temp.count;
            }
          }
        });
    } else if (this.type === 'year') {
      const getYear = moment(this.dateObj['list']).year();
      this.n = getYear;
      this.label = this.n;
      this.data = [
        {
          title: this.n,
          months: [
            { month: 'Jan', kWatts: 0, cost: 0 },
            { month: 'Feb', kWatts: 0, cost: 0 },
            { month: 'Mar', kWatts: 0, cost: 0 },
            { month: 'Apr', kWatts: 0, cost: 0 },
            { month: 'May', kWatts: 0, cost: 0 },
            { month: 'Jun', kWatts: 0, cost: 0 },
            { month: 'Jul', kWatts: 0, cost: 0 },
            { month: 'Aug', kWatts: 0, cost: 0 },
            { month: 'Sept', kWatts: 0, cost: 0 },
            { month: 'Oct', kWatts: 0, cost: 0 },
            { month: 'Nov', kWatts: 0, cost: 0 },
            { month: 'Dec', kWatts: 0, cost: 0 },
          ],
        },
      ];
      this.eService.getData(this.dateObj['list'], this.type)
        .then((val: any) => {
          for (const valarr of val) {
            this.data[0].months[valarr._id - 1].kWatts = valarr.count;
          }
          for (const valarr of val) {
            if (valarr.value.length > 0) {
              this.temp = valarr.value[0];
              this.data[0].months[valarr._id - 1].cost = this.temp.count;
            }
          }
        });
    }
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
