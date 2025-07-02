import { AfterViewInit, Component, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ElectricityService } from '../../../../@core/data/electricity.service';
import { takeWhile, delay, debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
declare const echarts: any;

@Component({
  selector: 'ngx-electricity-chart',
  providers: [DatePipe],
  styleUrls: ['./electricity-chart.component.scss'],
  template: `
    <div echarts [options]="option" class="echart"></div>
  `,
})
export class ElectricityChartComponent implements AfterViewInit, OnDestroy {

  option: any;
  private alive = true;
  data: Array<any>;
  themeSubscription: any;
  points: Array<any>;
  r: number = 0;
  c: number = 0;

  months: any;
  getMonthName: any;

  @Input() changedDate: any;
  @Input() statusType: any;

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges): void {
    this.points = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.r = 0;
    this.c = 0;
    this.data = [];
    if (this.statusType === 'week') {
      this.data = [
        { label: 'Sunday', value: 0, },
        { label: 'Monday', value: 0, },
        { label: 'Tuesday', value: 0, },
        { label: 'Wednesday', value: 0, },
        { label: 'Thursday', value: 0, },
        { label: 'Friday', value: 0, },
        { label: 'Saturday', value: 0, },
      ];
      this.eService.getData(this.changedDate, this.statusType)
        .then((el: any) => {
          for (const val of el) {
            if (val.value.length > 0) {
              const comp = val.value[0];
              this.data[moment(val.date).format('d')].value = comp.count;
            }
          }
          this.ngAfterViewInit();
        });
    } else if (this.statusType === 'month') {
      const daysCount = moment(this.changedDate).daysInMonth();
      this.getMonthName = moment(this.changedDate).format('MMMM');
      for (let i = 0; i < daysCount; i++) {
        this.data.push({ label: this.getMonthName + ' ' + (i + 1).toString(), value: 0 });
      }
      this.eService.getData(this.changedDate, this.statusType)
        .then((el: any) => {
          for (const val of el) {
            if (val.value.length > 0) {
              const comp = val.value[0];
              this.data[val._id - 1].value = comp.count;
            }
          }
          this.ngAfterViewInit();
        });
    } else if (this.statusType === 'year') {
      this.data = [
        { label: 'Jan', value: 0 },
        { label: 'Feb', value: 0 },
        { label: 'Mar', value: 0 },
        { label: 'Apr', value: 0 },
        { label: 'May', value: 0 },
        { label: 'Jun', value: 0 },
        { label: 'Jul', value: 0 },
        { label: 'Aug', value: 0 },
        { label: 'Sept', value: 0 },
        { label: 'Oct', value: 0 },
        { label: 'Nov', value: 0 },
        { label: 'Dec', value: 0 },
      ];
      this.eService.getData(this.changedDate, this.statusType)
        .then((el: any) => {
          for (const val of el) {
            if (val.value.length > 0) {
              const comp = val.value[0];
              this.data[val._id - 1].value = comp.count;
            }
          }
          this.ngAfterViewInit();
        });
    }
  }

  constructor(private eService: ElectricityService,
    private datePipe: DatePipe,
    private theme: NbThemeService) {
    // this.dateObj['list'] = this.datePipe.transform(this.list, 'yyyy-MM-dd');
    // this.eService.getData(this.dateObj['list'], this.type).then((val: any) => {
    //   for (const value of val) {
    //     this.points[value._id - 1] = value.count;
    //     this.r = this.r + value.count;
    //     this.c = this.c + value.value[0].count;
    //     const dateA = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec');
    //     this.data = this.points.map((p, index) => ({
    //       label: dateA[index],
    //       value: p,
    //     }));
    //     this.ngAfterViewInit();
    //   }
    // });
  }

  ngAfterViewInit(): void {
    this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
        debounceTime(500)
      )
      .subscribe(config => {
        const eTheme: any = config.variables.electricity;
        this.option = {
          grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 80,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                color: eTheme.tooltipLineColor,
                width: eTheme.tooltipLineWidth,
              },
            },
            textStyle: {
              color: eTheme.tooltipTextColor,
              fontSize: 14,
              fontWeight: eTheme.tooltipFontWeight,
            },
            position: 'top',
            backgroundColor: eTheme.tooltipBg,
            borderColor: eTheme.tooltipBorderColor,
            borderWidth: 1,
            formatter: '{c0} Trips Completed',
            extraCssText: eTheme.tooltipExtraCss,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            offset: 25,
            data: this.data.map(i => i.label),
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: eTheme.xAxisTextColor,
              fontSize: 18,
            },
            axisLine: {
              lineStyle: {
                color: eTheme.axisLineColor,
                width: '2',
              },
            },
          },
          yAxis: {
            boundaryGap: [0, '5%'],
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: eTheme.yAxisSplitLine,
                width: '1',
              },
            },
          },
          series: [
            {
              type: 'line',
              smooth: true,
              symbolSize: 20,
              itemStyle: {
                normal: {
                  opacity: 0,
                },
                emphasis: {
                  color: '#ffffff',
                  borderColor: '#5DBCD2', // eTheme.itemBorderColor | Green #42db7d
                  borderWidth: 2,
                  opacity: 1,
                },
              },
              lineStyle: {
                normal: {
                  width: eTheme.lineWidth,
                  type: eTheme.lineStyle,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#5DBCD2', // eTheme.lineGradFrom | Green #42db7d
                  }, {
                    offset: 1,
                    color: '#5DBCD2', // eTheme.lineGradTo | Green #42db7d
                  }]),
                  shadowColor: eTheme.lineShadow,
                  shadowBlur: 6,
                  shadowOffsetY: 12,
                },
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: eTheme.areaGradFrom,
                  }, {
                    offset: 1,
                    color: eTheme.areaGradTo,
                  }]),
                },
              },
              data: this.data.map(i => i.value),
            },
            {
              type: 'line',
              smooth: true,
              symbol: 'none',
              lineStyle: {
                normal: {
                  width: eTheme.lineWidth,
                  type: eTheme.lineStyle,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#5DBCD2', // eTheme.lineGradFrom | Green #42db7d
                  }, {
                    offset: 1,
                    color: '#5DBCD2', // eTheme.lineGradTo | Green #42db7d
                  }]),
                  shadowColor: eTheme.shadowLineDarkBg,
                  shadowBlur: 14,
                  opacity: 1,
                },
              },
              data: this.data.map(i => i.value),
            },
          ],
        };
        //console.log(eTheme);
      });

  }

  ngOnDestroy() {
    this.alive = false;
  }

  // ngOnDestroy() {
  //   this.themeSubscription.unsubscribe();
  // }
}

