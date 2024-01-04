import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ChartService } from '../charts.service';
import { featuresSettings } from '../../../app.config';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
import { V } from '@angular/cdk/keycodes';

@Component({
  selector: 'ngx-echarts-bar',
  template: `
 <div class="row">
  <div class="col-lg-6 col-md-6 col-sm-12"  *ngIf="showCity==true">
  <div class="dropdown ghost-dropdown" ngbDropdown>
    <button type="button" class="btn btn-sm btn-success" ngbDropdownToggle style="border: 2px solid #dadfe6;">
          {{city}}
    </button>
    <ul ngbDropdownMenu class="dropdown-menu">
      <li class="dropdown-item" *ngFor ="let city of SerivceCity" (click)="changeCity(city.label)">
        {{ city.label }}
      </li>
      <li class="dropdown-item" (click)="changeCity('all')" >All</li>
    </ul>
  </div>
</div>
  <!-- Export Data  -->
  <div class="col-lg-6 col-md-6 col-sm-12">
    <div class="dropdown ghost-dropdown" ngbDropdown>
      <button type="button" class="btn btn-sm btn-success" ngbDropdownToggle style="border: 2px solid #dadfe6;">
        EXPORT
      </button>
      <ul ngbDropdownMenu class="dropdown-menu">
        <li class="dropdown-item" *ngFor="let exportType of exportList" (click)="export(exportType.value)">
          {{ exportType.key }}
        </li>
      </ul>
    </div>
  </div>
  
<div echarts [options]="options" class="echart"></div>
</div>
  `,
})
// export class EchartsBarComponent implements AfterViewInit, OnDestroy {

//   resultArray: any;
//   options: any = {};
//   themeSubscription: any;
//   months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];;
//   vals: any;
//   idA: number[] = new Array(12);
//   coA: number[] = new Array(12);
//   SerivceCity: any;
//   showCity: boolean;
//   city: string = "Service Available City";
//   cityTitle: string;
//   sheetName: string = "Registered Users";
//   excelFileName: string = "Registered Users.xlsx";
//   blobType: string =
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
//   cols = ['Month', 'Count'];

//   exportList = [{ key: "Csv", value: "csv" }, { key: "Excel", value: "excel" }]

//   optionsCSV = {
//     fieldSeparator: ",",
//     quoteStrings: '"',
//     decimalseparator: ".",
//     // headers: "",
//     showTitle: true,
//     title: "Registered Users",
//     useBom: true,
//     removeNewLines: false,
//     keys: ['month', 'count'],
//   };

//   constructor(private theme: NbThemeService, private chartService: ChartService) {
//     for (let i = 0; i < 12; i++) {
//       this.idA[i] = i + 1;
//       this.coA[i] = 0;
//     }
//     this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     this.chartService.getCounts(this.city).then((val: Object[]) => {
//       this.cityTitle = this.city;
//       this.vals = val;
//       for (var value of this.vals) {
//         this.coA[value._id - 1] = value.count;
//       }
//       this.ngAfterViewInit();
//     });
//     this.chartService.getAvailableServiceCity()
//       .then(res => {
//         this.SerivceCity = res
//       })
//     if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
//       this.showCity = true;
//     else this.showCity = false;
//   }

//   changeCity(data) {

//     this.city = data;
//     this.chartService.getCounts(data)
//       .then((val: Object[]) => {
//         this.vals = val;
//         for (var value of this.vals) {
//           this.coA[value._id - 1] = value.count;
//         } this.ngAfterViewInit();
//       });
//   }

//   ngAfterViewInit() {
//     this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

//       const colors: any = config.variables;
//       const echarts: any = config.variables.echarts;

//       this.options = {
//         backgroundColor: echarts.bg,
//         color: [colors.primaryLight],
//         tooltip: {
//           trigger: 'axis',
//           axisPointer: {
//             type: 'shadow',
//           },
//         },
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           containLabel: true,
//         },
//         xAxis: [
//           {
//             type: 'category',
//             data: this.months, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//             axisTick: {
//               alignWithLabel: true,
//             },
//             axisLine: {
//               lineStyle: {
//                 color: echarts.axisLineColor,
//               },
//             },
//             axisLabel: {
//               textStyle: {
//                 color: echarts.textColor,
//               },
//             },
//           },
//         ],
//         yAxis: [
//           {
//             type: 'value',
//             axisLine: {
//               lineStyle: {
//                 color: echarts.axisLineColor,
//               },
//             },
//             splitLine: {
//               lineStyle: {
//                 color: echarts.splitLineColor,
//               },
//             },
//             axisLabel: {
//               textStyle: {
//                 color: echarts.textColor,
//               },
//             },
//           },
//         ],
//         series: [
//           {
//             name: 'Nos',
//             type: 'bar',
//             barWidth: '60%',
//             data: this.coA, // [10, 52, 200, 334, 390, 330, 220],
//           },
//         ],
//       };
//     });
//   }

//   ngOnDestroy(): void {
//     this.themeSubscription.unsubscribe();
//   }

//   export(event) {
//     const exportFor = event.target.value;
//     console.log('exportFor : ', exportFor);
//     this.convertResponse();
//     this.exportToDoc(exportFor, this.vals);
//   }

//   exportToDoc(docType: any, data: any) {
//     this.convertResponse();
//     debugger
//     if (docType === "csv") {
//       new Angular2Csv(this.resultArray, 'Registered Users', this.optionsCSV);
//     } else if (docType === "excel") {
//       this.exportToExcel(this.resultArray);
//     }

//   }


//   exportToExcel(data) {
//     console.log('data 3 : \n ', data);
//     // console.log(data)
//     const workbook = new Excel.Workbook();
//     workbook.creator = "Web";
//     workbook.lastModifiedBy = "Web";
//     workbook.created = new Date();
//     workbook.modified = new Date();
//     workbook.addWorksheet(this.sheetName, {
//       views: [{ activeCell: "A1", showGridLines: true }],
//     });
//     const sheet = workbook.getWorksheet(1);
//     sheet.getRow(1).values = "";
//     sheet.getRow(2).values = this.cols;
//     sheet.columns = [
//       { key: "month", width: 20 },
//       { key: "count", width: 20 },
//     ];
//     sheet.addRows(data);

//     // FONT SIZE
//     sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
//       sheet.getRow(rowNumber).font = {
//         name: "Liberation Sans",
//         size: 10,
//       };
//       //sheet.getRow(rowNumber).height = 25
//       const rowHeader = sheet.getRow(rowNumber);
//       rowHeader.eachCell(function (cell, colNumber) {
//         //console.log('Cell ' + colNumber + ' = ' + cell.value);
//         rowHeader.getCell(colNumber).alignment = { horizontal: "center" };
//       });
//     });
//     sheet.getRow(2).font = {
//       bold: "true",
//       name: "Liberation Sans",
//       size: 11,
//     };
//     //  sheet.getColumn('startAddress').alignment = { wrapText: true };
//     //  sheet.getColumn('endAddress').alignment = { wrapText: true };
//     //  sheet.getColumn('findStartAddress').alignment = { wrapText: true };
//     //  sheet.getColumn('findEndAddress').alignment = { wrapText: true };

//     // HEADER ROW ALIGN CENTER
//     const rowHeader = sheet.getRow(2);
//     rowHeader.eachCell(function (cell, colNumber) {
//       //console.log('Cell ' + colNumber + ' = ' + cell.value);
//       rowHeader.getCell(colNumber).alignment = { horizontal: "center" };
//     });

//     // EXPORT USING FILESAVER
//     workbook.xlsx.writeBuffer().then((data) => {
//       const blob = new Blob([data], { type: this.blobType });
//       const url = window.URL.createObjectURL(blob);
//       // console.log(url)
//       setTimeout(function () {
//         window.URL.revokeObjectURL(url);
//       }, 0);
//       FileSaver.saveAs(blob, this.excelFileName, true);
//       // console.log(blob)
//     });
//   }


//   convertResponse() {
//     console.log('##', this.vals);
//     let temp = this.vals;
//     let newArray = [
//       { month: 'January', count: 0 },
//       { month: 'February', count: 0 },
//       { month: 'March', count: 0 },
//       { month: 'April', count: 0 },
//       { month: 'May', count: 0 },
//       { month: 'June', count: 0 },
//       { month: 'July', count: 0 },
//       { month: 'August', count: 0 },
//       { month: 'September', count: 0 },
//       { month: 'October', count: 0 },
//       { month: 'November', count: 0 },
//       { month: 'December', count: 0 },
//     ];
//     this.resultArray = temp.map((item) => {

//       switch (item._id) {
//         case 1: {
//           let m1 = { "month": "January", "count": item.count }
//           newArray.splice(0, 1, m1);
//           break;
//         }
//         case 2: {
//           let m2 = { "month": "February", "count": item.count }
//           newArray.splice(1, 1, m2);
//           break;
//         }
//         case 3: {
//           let m3 = { "month": "March", "count": item.count }
//           newArray.splice(2, 1, m3);
//           break;
//         }
//         case 4: {
//           let m4 = { "month": "April", "count": item.count }
//           newArray.splice(3, 1, m4);
//           break;
//         }
//         case 5: {
//           let m5 = { "month": "May", "count": item.count }
//           newArray.splice(4, 1, m5);
//           break;
//         }
//         case 6: {
//           let m6 = { "month": "June", "count": item.count }
//           newArray.splice(5, 1, m6);
//           break;
//         }
//         case 7: {
//           let m7 = { "month": "July", "count": item.count }
//           newArray.splice(6, 1, m7);
//           break;
//         }
//         case 8: {
//           let m8 = { "month": "August", "count": item.count }
//           newArray.splice(7, 1, m8);
//           break;
//         }
//         case 9: {
//           let m9 = { "month": "September", "count": item.count }
//           newArray.splice(8, 1, m9);
//           break;
//         }
//         case 10: {
//           let m10 = { "month": "October", "count": item.count }
//           newArray.splice(9, 1, m10);
//           break;
//         }
//         case 11: {
//           let m11 = { "month": "November", "count": item.count }
//           newArray.splice(10, 1, m11);
//           break;
//         }
//         case 12: {
//           let m12 = { "month": "December", "count": item.count }
//           newArray.splice(11, 1, m12);
//           break;
//         }
//         default: {
//           console.log("NO DATA AVAILABLE");
//           break;
//         }
//       }
//     })
//     this.resultArray = newArray;
//     console.log('resultArray', this.resultArray);
//   }
// }

export class EchartsBarComponent implements AfterViewInit, OnDestroy {

  resultArray: any;
  options: any = {};
  themeSubscription: any;
  months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];;
  vals: any;
  idA: number[] = new Array(12);
  coA: number[] = new Array(12);
  SerivceCity: any;
  showCity: boolean;
  city: string = "Service Available City";
  cityTitle: string;
  sheetName: string = "Registered Users";
  excelFileName: string = "Registered Users.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = ['Month', 'Count'];

  exportList = [{ key: "Csv", value: "csv" }, { key: "Excel", value: "excel" }]

  optionsCSV = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    // headers: "",
    showTitle: true,
    title: "Registered Users",
    useBom: true,
    removeNewLines: false,
    keys: ['month', 'count'],
  };

  constructor(private theme: NbThemeService, private chartService: ChartService) {
    for (let i = 0; i < 12; i++) {
      this.idA[i] = i + 1;
      this.coA[i] = 0;
    }
    this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.chartService.getCounts(this.city).then((val: Object[]) => {
      this.cityTitle = this.city;
      this.vals = val;
      for (var value of this.vals) {
        this.coA[value._id - 1] = value.count;
      }
      this.ngAfterViewInit();
    });
    this.chartService.getAvailableServiceCity()
      .then(res => {
        this.SerivceCity = res
      })
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else this.showCity = false;
  }

  changeCity(data) {

    this.city = data;
    this.chartService.getCounts(data)
      .then((val: Object[]) => {
        this.vals = val;
        for (var value of this.vals) {
          this.coA[value._id - 1] = value.count;
        } this.ngAfterViewInit();
      });
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
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
            data: this.months, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            name: 'Nos',
            type: 'bar',
            barWidth: '60%',
            data: this.coA, // [10, 52, 200, 334, 390, 330, 220],
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
    this.convertResponse();
    if (docType === "csv") {
      new Angular2Csv(this.resultArray, 'Registered Users', this.optionsCSV);
    } else if (docType === "excel") {
      this.exportToExcel(this.resultArray);
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
      { key: "month", width: 20 },
      { key: "count", width: 20 },
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


  convertResponse() {
    console.log('##', this.vals);
    let temp = this.vals;
    let newArray = [
      { month: 'January', count: 0 },
      { month: 'February', count: 0 },
      { month: 'March', count: 0 },
      { month: 'April', count: 0 },
      { month: 'May', count: 0 },
      { month: 'June', count: 0 },
      { month: 'July', count: 0 },
      { month: 'August', count: 0 },
      { month: 'September', count: 0 },
      { month: 'October', count: 0 },
      { month: 'November', count: 0 },
      { month: 'December', count: 0 },
    ];
    this.resultArray = temp.map((item) => {

      switch (item._id) {
        case 1: {
          let m1 = { "month": "January", "count": item.count }
          newArray.splice(0, 1, m1);
          break;
        }
        case 2: {
          let m2 = { "month": "February", "count": item.count }
          newArray.splice(1, 1, m2);
          break;
        }
        case 3: {
          let m3 = { "month": "March", "count": item.count }
          newArray.splice(2, 1, m3);
          break;
        }
        case 4: {
          let m4 = { "month": "April", "count": item.count }
          newArray.splice(3, 1, m4);
          break;
        }
        case 5: {
          let m5 = { "month": "May", "count": item.count }
          newArray.splice(4, 1, m5);
          break;
        }
        case 6: {
          let m6 = { "month": "June", "count": item.count }
          newArray.splice(5, 1, m6);
          break;
        }
        case 7: {
          let m7 = { "month": "July", "count": item.count }
          newArray.splice(6, 1, m7);
          break;
        }
        case 8: {
          let m8 = { "month": "August", "count": item.count }
          newArray.splice(7, 1, m8);
          break;
        }
        case 9: {
          let m9 = { "month": "September", "count": item.count }
          newArray.splice(8, 1, m9);
          break;
        }
        case 10: {
          let m10 = { "month": "October", "count": item.count }
          newArray.splice(9, 1, m10);
          break;
        }
        case 11: {
          let m11 = { "month": "November", "count": item.count }
          newArray.splice(10, 1, m11);
          break;
        }
        case 12: {
          let m12 = { "month": "December", "count": item.count }
          newArray.splice(11, 1, m12);
          break;
        }
        default: {
          console.log("NO DATA AVAILABLE");
          break;
        }
      }
    })
    this.resultArray = newArray;
    console.log('resultArray', this.resultArray);
  }
}
