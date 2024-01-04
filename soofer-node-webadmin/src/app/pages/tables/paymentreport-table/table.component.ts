import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../table.service';
import { AppSettings, featuresSettings } from '../../../app.config';
import { DatePipe } from '@angular/common';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: "ngx-smart-table",
  providers: [TableService, DatePipe],
  templateUrl: "./smart-table.component.html",
  styles: [
    `
      nb-card {
        transform: translate3d(0, 0, 0);
      }
    `,
  ],
})
export class PaymentReportComponent {
  title: string = "Trip Payments";
  dateObj: any;
  list: any = {};
  settings = {

    // pager : {
    //   display:true,
    //   perPage :10,
    //  },
     
     actions: false, 

    columns: {
      tripno: {
        title: "Trip No",
      },
      dvrfname: {
        title: "Driver",
      },
      code: {
        title: "Code",
        valuePrepareFunction: (cell, row) => {
          if (row.code == undefined) return "NA";
          return row.code;
        },
      },
      // referenceCode:{
      //   title:'Reference Code'
      // },
      createdAt: {
        title: "Trip Date",
        filter: false,
        sort: false,
        valuePrepareFunction: createdAt => {
          //return this.datePipe.transform(createdAt);
          return moment(createdAt)
            .utcOffset("+05:30")
            .format("DD-MM-YYYY hh:mm a");
          // return moment(createdAt).format('DD-MM-YYYY HH:mm a');
        },
      },
      amttopay: {
        title: "Total Fare",
        filter: false,
      },
      commision: {
        title: "Platform Fees",
        filter: false,
      },
      amttodriver: {
        title: "Driver Earned",
        filter: false,
      },
      tax: {
        title: "GST",
        filter: false,
      },
      totalDetucted: {
        title: "Deducted Fare",
        filter: false,
      },
      totalAmount2: {
        title: "Ride Status",
        filter: false,
        valuePrepareFunction: () => "Completed",
      },
      mtd: {
        title: "Payment method",
        filter: false,
      },
    },
  };

  reportname = "Trip Payments";
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: [
      "Trip No",
      "Driver",
      "Code",
      "Trip Date",
      "Total Fare",
      "Platform Fees",
      "Driver Earned",
      "Ride Status",
      "Payment method",
    ],
    showTitle: true,
    title: "Trip Payments",
    useBom: true,
    removeNewLines: false,
    keys: [
      "tripno",
      "dvrfname",
      "code",
      "createdAt",
      "amttopay",
      "commision",
      "amttodriver",
      "totalAmount2",
      "mtd",
    ],
  };

  source: ServerDataSource;
  showCity: boolean;
  serviceCityArray: any = [];
  exportInp: any;

  constructor(
    private _http: HttpClient,
    private toastr: ButtonToasterService,
    private datePipe: DatePipe,
    private service: TableService
  ) {
    if (featuresSettings.referenceCode == true) {
      this.settings.columns["reference code"] = {
        title: "Reference Code",
      };
    }
    if (
      featuresSettings.isCityWise === true &&
      featuresSettings.isServiceAvailable === true &&
      localStorage.getItem("userType") === "superadmin"
    )
      this.showCity = true;
    else this.showCity = false;
    this.list = {};
    this.dateObj = {};
    const date = new Date();
    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.dateObj.fromDate = this.datePipe.transform(
      this.list.fromDate,
      "yyyy-MM-dd"
    );
    this.dateObj.toDate = this.datePipe.transform(
      this.list.toDate,
      "yyyy-MM-dd"
    );
    // this.list.fromDate = new Date();
    this.exportInp = {};
    this.service.getServiceCity().then(res => {
      this.serviceCityArray = res;
    });
    this.getData();
  }

  filterRes(data) {
    console.log(data);
    if (
      data.servicecity &&
      data.fromDate === undefined &&
      data.toDate == undefined
    ) {
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          "paymentReport?scity_like=" +
          data.servicecity,
      });
    } else if (
      (data.servicecity === undefined || data.servicecity === "all") &&
      data.fromDate &&
      data.toDate
    ) {
      const fromDate = this.dateObj["fromDate"];
      const toDate = this.dateObj["toDate"];
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          "paymentReport?createdAt_gte=" +
          fromDate +
          "&createdAt_lte=" +
          toDate,
      });
    } else if (data.servicecity && data.fromDate && data.toDate) {
      const fromDate = this.dateObj["fromDate"];
      const toDate = this.dateObj["toDate"];
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          "paymentReport?createdAt_gte=" +
          fromDate +
          "&createdAt_lte=" +
          toDate +
          "&scity_like=" +
          data.servicecity,
      });
    } else this.toastr.showtoast("warn", "Select Filter");
  }

  export(event) {
    const exportFor = event.target.value;
    let fromDate = "";
    let toDate = "";
    if (
      this.dateObj["fromDate"] !== undefined &&
      this.dateObj["fromDate"] !== ""
    ) {
      fromDate = this.dateObj["fromDate"];
    }
    if (this.dateObj["toDate"] !== undefined && this.dateObj["toDate"] !== "") {
      toDate = this.dateObj["toDate"];
    }
    this._http
      .get(
        AppSettings.API_ENDPOINT +
          "paymentReport?createdAt_gte=" +
          fromDate +
          "&createdAt_lte=" +
          toDate +
          "&requestFrom=" +
          "without_limit"
      )
      .toPromise()
      .then(res => {
        const data = res;
        this.exporttoCSV(exportFor, data, fromDate, toDate);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }

  exporttoCSV(exportFor, data, from, to) {
    for (const res of data) {
      res["createdAt"] = moment(res.createdAt)
        .utc()
        .format("DD-MM-YYYY HH:mm a");
      res["totalAmount2"] = "Completed";
      if (res["dvrfname"] == null) {
        res["dvrfname"] = "";
      }
    }
    let title;
    if (from !== "" && to !== "") {
      title = `Trip Payments From ${from} to ${to} `;
    } else if (from !== "" && to === "") {
      title = `Trip Payments From ${from}`;
    } else if (from === "" && to !== "") {
      title = `Trip Payments Upto ${to} `;
    }
    if (exportFor === "csv") {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === "excel") {
      this.exportToExcel(data, title);
      this.exportInp = {};
    }
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      "yyyy-MM-dd"
    );
  }

  // reset() {
  //   this.list = {};
  //   this.dateObj = {};
  //   this.getData();
  // }

  getData() {
    if (this.dateObj.fromDate && this.dateObj.toDate) {
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          "paymentReport?createdAt_gte=" +
          this.dateObj.fromDate +
          "&createdAt_lte=" +
          this.dateObj.toDate,
      });
    }
  }

  /** EXCEL SHEET */

  name: string;
  sName: string = "SheetTest";
  excelFileName: string = "Trip Payments.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = [
    "Trip No",
    "Driver",
    "Code",
    "Trip Date",
    "Total Fare",
    "Platform Fees",
    "Driver Earned",
    "Ride Status",
    "Payment method",
  ];

  exportToExcel(data, tripLabel) {
    // console.log(data)
    const workbook = new Excel.Workbook();
    workbook.creator = "Web";
    workbook.lastModifiedBy = "Web";
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.addWorksheet(this.sName, {
      views: [{activeCell: "A1", showGridLines: true}],
    });
    const sheet = workbook.getWorksheet(1);
    sheet.getRow(1).values = "";
    sheet.getRow(2).values = this.cols;
    sheet.columns = [
      {key: "tripno", width: 10},
      {key: "dvrfname", width: 13},
      {key: "code", width: 10},
      {key: "createdAt", width: 25},
      {key: "amttopay", width: 12},
      {key: "commision", width: 12},
      {key: "amttodriver", width: 12},
      {key: "totalAmount2", width: 14},
      {key: "mtd", width: 14},
    ];
    sheet.addRows(data);

    // FONT SIZE
    sheet.eachRow({includeEmpty: true}, function(row, rowNumber) {
      sheet.getRow(rowNumber).font = {
        name: "Liberation Sans",
        size: 10,
      };
      //sheet.getRow(rowNumber).height = 25
      const rowHeader = sheet.getRow(rowNumber);
      rowHeader.eachCell(function(cell, colNumber) {
        //console.log('Cell ' + colNumber + ' = ' + cell.value);
        rowHeader.getCell(colNumber).alignment = {horizontal: "center"};
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
    rowHeader.eachCell(function(cell, colNumber) {
      //console.log('Cell ' + colNumber + ' = ' + cell.value);
      rowHeader.getCell(colNumber).alignment = {horizontal: "center"};
    });

    // EXPORT USING FILESAVER
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], {type: this.blobType});
      const url = window.URL.createObjectURL(blob);
      // console.log(url)
      setTimeout(function() {
        window.URL.revokeObjectURL(url);
      }, 0);
      FileSaver.saveAs(blob, this.excelFileName, true);
      // console.log(blob)
    });
  }
}
