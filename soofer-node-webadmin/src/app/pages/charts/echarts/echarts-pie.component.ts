import { AfterViewInit, Component, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ChartService } from '../charts.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { featuresSettings } from '../../../app.config';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'ngx-echarts-pie',
  providers: [DatePipe],
  templateUrl: 'echarts-pie.component.html',
})

export class EchartsPieComponent implements AfterViewInit, OnDestroy {

  sheetName: string = "Trips Overview";
  excelFileName: string = "Trips Overview.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = ["Total Trips", "Ongoing Trips", "Cancelled Trips", "Completed Trips", "No Response"];
  exportList = [{ key: "Csv", value: "csv" }, { key: "Excel", value: "excel" }]
  options: any = {};
  themeSubscription: any;
  datas: any = {};
  n1: number = 0;
  n2: number = 0;
  n3: number = 0;

  // city: string = "City"
  city: string = "Service Available City"


  @Output() periodChanges = new EventEmitter<string>();
  @Input() periodtype: any = 'week';
  types: any[] = ['week', 'month', 'year'];

  optionsCSV = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: ["Total Trips", "Ongoing Trips", "Cancelled Trips", "Completed Trips", "No Response"],
    showTitle: true,
    title: "Trips Overview",
    useBom: true,
    removeNewLines: false,
    keys: ["totalTrips", "ongoing", "canceled", "completed", "noresponse"],
  };

  dateObj = {};
  list = new Date();
  duration;
  ServiceCity: any;
  showCity: boolean;

  changePeriod(period: any): void {
    this.periodtype = period;
    this.periodChanges.emit(period);
    this.dispChart();
  }
  changeCity(data) {
    this.city = data;
    this.dispChart();
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
    this.dispChart();
  }

  constructor(private theme: NbThemeService, private datePipe: DatePipe, private chartService: ChartService) {
    this.dateObj['list'] = this.datePipe.transform(this.list, 'yyyy-MM-dd');
    this.dispChart();
    this.chartService.getAvailableServiceCity()
      .then(res => {
        this.ServiceCity = res
      })
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else
      this.showCity = false;
  }

  dispChart() {
    this.datas = '';
    this.n1 = 0;
    this.n2 = 0;
    this.n3 = 0;
    if (this.periodtype === 'week') {
      const startDate = moment(this.dateObj['list']).startOf(this.periodtype).format('YYYY-MM-DD');
      const endDate = moment(this.dateObj['list']).endOf(this.periodtype).format('YYYY-MM-DD');
      // this.duration = 'Trip Details' + '\n' + ' From ' + startDate + '\n' + 'To ' + endDate;
      this.duration = 'Week : ' + startDate + ' to ' + endDate;
      this.chartService.getOption(this.dateObj['list'], this.periodtype, this.city)
        .then((vals: any) => {
          this.datas = vals;
          this.n2 = this.datas.canceled;
          this.n3 = this.datas.noresponse;
          this.n1 = this.datas.completed;
          this.ngAfterViewInit();
        });
    } else if (this.periodtype === 'month') {
      const getName = moment(this.dateObj['list']).format('MMMM YYYY');
      // this.duration = 'Trip Details From ' + getName;
      this.duration = 'Month : ' + getName;

      this.chartService.getOption(this.dateObj['list'], this.periodtype, this.city)
        .then((vals: any) => {
          this.datas = vals;
          this.n2 = this.datas.canceled;
          this.n3 = this.datas.noresponse;
          this.n1 = this.datas.completed;
          this.ngAfterViewInit();
        });
    } else if (this.periodtype === 'year') {
      const getYear = moment(this.dateObj['list']).year();
      // this.duration = 'Trip Details in Year ' + getYear;
      this.duration = 'Year : ' + getYear;

      this.chartService.getOption(this.dateObj['list'], this.periodtype, this.city)
        .then((vals: any) => {
          this.datas = vals;
          this.n2 = this.datas.canceled;
          this.n3 = this.datas.noresponse;
          this.n1 = this.datas.completed;
          this.ngAfterViewInit();
        });
    }
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['Completed', 'Cancelled', 'NoResponse'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Trips',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              { value: this.n1, name: 'Completed' },
              { value: this.n2, name: 'Cancelled' },
              { value: this.n3, name: 'NoResponse' },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
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
    this.exportToDoc(exportType, this.datas);
  }

  exportToDoc(docType: any, data: any) {
    let tripData = [];
    tripData.push(data);
    console.log('tripData', tripData);
    if (docType === "csv") {
      new Angular2Csv(tripData, 'Trips Overview', this.optionsCSV);
    } else if (docType === "excel") {
      this.exportToExcel(tripData);
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
      { key: "totalTrips", width: 20 },
      { key: "ongoing", width: 20 },
      { key: "canceled", width: 20 },
      { key: "completed", width: 20 },
      { key: "noresponse", width: 20 },

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
