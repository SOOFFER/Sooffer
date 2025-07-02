import { AfterViewInit, Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ChartService } from '../charts.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { AppSettings, featuresSettings } from '../../../app.config';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'ngx-echarts-area-stack',
  templateUrl: 'echarts-area-stack.component.html',
  providers: [ChartService, DatePipe],
})

export class EchartsAreaStackComponent implements AfterViewInit, OnDestroy {

  lastApi: string;
  options: any = {};
  themeSubscription: any;
  vals: any;
  months: any;
  total: number[] = new Array(12);
  wallet: number[] = new Array(12);
  cash: number[] = new Array(12);
  damt: number[] = new Array(12);
  gamt: number[] = new Array(12);

  sheetName: string = "Total Generated Fare";
  excelFileName: string = "Total Generated Fare.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = ["Amount to Pay", "Promo Amount", "Digital", "In Hand", "Amount to Driver", "Commission", "Date"];


  @Output() periodChange = new EventEmitter<string>();
  @Input() type: any = 'week';
  types: any[] = ['week', 'month', 'year'];

  exportList = [{ key: "Csv", value: "csv" }, { key: "Excel", value: "excel" }]

  dateObj = {};
  list = new Date();
  getMonthName;
  duration;
  city: string = "Service Available City"
  SerivceCity: any;
  showCity: boolean;
  changePeriod(period: any): void {

    this.type = period;
    this.periodChange.emit(period);
    this.dispChart();
  }

  changeCity(data) {
    this.city = data;
    this.dispChart()
  }


  optionsCSV = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: ["Amount to Pay", "Promo Amount", "Digital", "In Hand", "Amount to Driver", "Commission", "Date"],
    showTitle: true,
    title: "Revenue Statistics",
    useBom: true,
    removeNewLines: false,
    keys: ["amttopay", "promoamt", "digital", "inhand", "amttodriver", "commision", "date"],
  };

  constructor(private theme: NbThemeService, private datePipe: DatePipe, private chartService: ChartService) {
    this.dateObj['list'] = this.datePipe.transform(this.list, 'yyyy-MM-dd');
    this.dispChart();
    this.chartService.getAvailableServiceCity()
      .then(res => {
        console.log('1.RES : \n', res);
        this.SerivceCity = res
      })
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else this.showCity = false;
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
    this.dispChart();
  }

  dispChart() {
    console.log('type : ', this.type);

    if (this.type === 'week') {
      this.months = [];
      this.total = [];
      this.wallet = [];
      this.cash = [];
      this.damt = [];
      this.gamt = [];
      this.months = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let startDate = moment(this.dateObj['list']).startOf(this.type).format('YYYY-MM-DD');
      const endDate = moment(this.dateObj['list']).endOf(this.type).format('YYYY-MM-DD');
      this.duration = 'Week : ' + startDate + ' to ' + endDate;
      for (let i = 0; i < 7; i++) {
        this.months[i] = this.months[i] + ' (' + startDate + ')';
        this.total[i] = 0;
        this.wallet[i] = 0;
        this.cash[i] = 0;
        this.damt[i] = 0;
        this.gamt[i] = 0;
        startDate = moment(startDate).add(1, 'd').format('YYYY-MM-DD');
      }
      this.chartService.getItems(this.dateObj['list'], this.type, this.city).then((val: any) => {

        console.log('Response Week : \n ', val);
        this.lastApi = 'week';
        this.vals = val;
        for (const value of this.vals) {
          this.total[moment(value.date).format('d')] = value.amttopay;
          this.wallet[moment(value.date).format('d')] = value.digital;
          this.cash[moment(value.date).format('d')] = value.inhand;
          this.damt[moment(value.date).format('d')] = value.amttodriver;
          this.gamt[moment(value.date).format('d')] = value.commision;
        }
        setTimeout(() => {
          this.ngAfterViewInit();
        }, 1);
      });
    } else if (this.type === 'month') {
      const daysCount = moment(this.dateObj['list']).daysInMonth();
      this.getMonthName = moment(this.dateObj['list']).format('MMMM YYYY');
      this.duration = 'Month : ' + this.getMonthName;

      this.months = [];
      this.total = [];
      this.wallet = [];
      this.cash = [];
      this.damt = [];
      this.gamt = [];
      for (let i = 0; i < daysCount; i++) {
        this.months.push((i + 1).toString());
        this.total[i] = 0;
        this.wallet[i] = 0;
        this.cash[i] = 0;
        this.damt[i] = 0;
        this.gamt[i] = 0;
      }
      this.chartService.getItems(this.dateObj['list'], this.type, this.city).then((val: any) => {
        console.log('Response Month : \n ', val);
        this.lastApi = 'month';


        this.vals = val;
        for (const value of this.vals) {
          this.total[value._id - 1] = value.amttopay;
          this.wallet[value._id - 1] = value.digital;
          this.cash[value._id - 1] = value.inhand;
          this.damt[value._id - 1] = value.amttodriver;
          this.gamt[value._id - 1] = value.commision;
        }
        setTimeout(() => {
          this.ngAfterViewInit();
        }, 1);
      });
    } else if (this.type === 'year') {
      const getYear = moment(this.dateObj['list']).year();
      this.months = [];
      this.total = [];
      this.wallet = [];
      this.cash = [];
      this.damt = [];
      this.gamt = [];
      this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.duration = 'Year : ' + getYear;
      for (let i = 0; i < 12; i++) {
        this.months[i] = this.months[i] + ' ' + getYear;
        this.total[i] = 0;
        this.wallet[i] = 0;
        this.cash[i] = 0;
        this.damt[i] = 0;
        this.gamt[i] = 0;
      }

      this.chartService.getItems(this.dateObj['list'], this.type, this.city).then((val: any) => {
        console.log('Response Year : \n ', val);
        this.lastApi = 'year';


        this.vals = val;
        for (const value of this.vals) {
          this.total[value._id - 1] = value.amttopay;
          this.wallet[value._id - 1] = value.digital;
          this.cash[value._id - 1] = value.inhand;
          this.damt[value._id - 1] = value.amttodriver;
          this.gamt[value._id - 1] = value.commision;
        }
        setTimeout(() => {
          this.ngAfterViewInit();
        }, 1);
      });
    }
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: echarts.tooltipBackgroundColor,
            },
          },
        },
        legend: {
          data: ['Generated Commision', 'Wallet', 'Paid By Cash', 'Driver Amount', 'Total'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.months,

            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Generated Commision',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.gamt,
          },
          {
            name: 'Wallet',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.wallet,
          },
          {
            name: 'Paid By Cash',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.cash,
          },
          {
            name: 'Driver Amount',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.damt,
          },
          {
            name: 'Total',
            type: 'line',
            stack: 'Total amount',
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.total,
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  export(exportType: any) {
    // const exportFor = event.target.value;
    console.log('exportFor : ', exportType);
    this.exportToDoc(exportType, this.vals);
  }

  exportToDoc(docType: any, data: any) {
    if (docType === "csv") {
      new Angular2Csv(data, 'Total Generated Fare', this.optionsCSV);
    } else if (docType === "excel") {
      this.exportToExcel(data);
    }
  }


  exportToExcel(data) {
    console.log('data 3 : \n ', data);
    // console.log(data)
    const workbook = new Excel.Workbook();
    workbook.creator = "Web";
    workbook.lastModifiedBy = "Web";
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.addWorksheet(this.sheetName, {
      views: [{ activeCell: "A1", showGridLines: true }],
    });
    const sheet = workbook.getWorksheet(1);
    sheet.getRow(1).values = "";
    sheet.getRow(2).values = this.cols;
    sheet.columns = [
      { key: "amttopay", width: 20 },
      { key: "promoamt", width: 13 },
      { key: "digital", width: 10 },
      { key: "inhand", width: 25 },
      { key: "amttodriver", width: 20 },
      { key: "commision", width: 12 },
      { key: "date", width: 12 },
    ];
    sheet.addRows(data);

    // FONT SIZE
    sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      sheet.getRow(rowNumber).font = {
        name: "Liberation Sans",
        size: 10,
      };
      //sheet.getRow(rowNumber).height = 25
      const rowHeader = sheet.getRow(rowNumber);
      rowHeader.eachCell(function (cell, colNumber) {
        //console.log('Cell ' + colNumber + ' = ' + cell.value);
        rowHeader.getCell(colNumber).alignment = { horizontal: "center" };
      });
    });
    sheet.getRow(2).font = {
      bold: "true",
      name: "Liberation Sans",
      size: 11,
    };
    //  sheet.getColumn('startAddress').alignment = { wrapText: true };
    //  sheet.getColumn('endAddress').alignment = { wrapText: true };
    //  sheet.getColumn('findStartAddress').alignment = { wrapText: true };
    //  sheet.getColumn('findEndAddress').alignment = { wrapText: true };

    // HEADER ROW ALIGN CENTER
    const rowHeader = sheet.getRow(2);
    rowHeader.eachCell(function (cell, colNumber) {
      //console.log('Cell ' + colNumber + ' = ' + cell.value);
      rowHeader.getCell(colNumber).alignment = { horizontal: "center" };
    });

    // EXPORT USING FILESAVER
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: this.blobType });
      const url = window.URL.createObjectURL(blob);
      // console.log(url)
      setTimeout(function () {
        window.URL.revokeObjectURL(url);
      }, 0);
      FileSaver.saveAs(blob, this.excelFileName, true);
      // console.log(blob)
    });
  }
}
