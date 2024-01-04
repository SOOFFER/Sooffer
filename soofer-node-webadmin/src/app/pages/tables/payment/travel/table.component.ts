import { Component } from "@angular/core";
import { ServerDataSource, LocalDataSource } from "ng2-smart-table";
import { HttpClient } from "@angular/common/http";
import { TableService } from "../../table.service";
import { ReportService } from "../../../common/report.service";
import { AppSettings, featuresSettings } from "../../../../app.config";
import { ButtonToasterService } from "../../../buttontoaster/buttontoaster.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { Angular2Csv } from "angular2-csv";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import { map } from "rxjs/operators";
const userType = localStorage.getItem("userType");

@Component({
  selector: "ngx-smart-table",
  providers: [TableService, ReportService, DatePipe],
  templateUrl: "./smart-table.component.html",

  styles: [
    `
      nb-card {
        transform: translate3d(0, 0, 0);
      }
    `,
  ],
})
export class DriverTravelPaymentComponent {
  title: string = "Travel Distance Report ";
  dateObj: any;
  list: any;
  settings = {
    // hideSubHeader: true,
    actions: false,
    columns: {
      dvrfname: {
        title: "Driver",
      },
      code: {
        title: "Driver Code",
        // valuePrepareFunction: (cell, row) => { return row.code[0] }
      },
      totalDistTravelled: {
        title: "Travelled Distance",
      },
      count: {
        title: "Total No of Trips",
      },
    },
    rowClassFunction: () => "ng2-smart-row bo-row",
  };

  reportname = "Driver Payments";
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: ["Driver", "Code", "Driver Earned Amount", "Total No of Trips"],
    showTitle: true,
    title: "Driver Payments",
    useBom: true,
    removeNewLines: false,
    keys: ["dvrfname", "code", "amttodriver", "count"],
  };

  exportInp: any;
  source: ServerDataSource;
  showCity: boolean;
  serviceCityArray: any = [];
  columns: boolean;
  //referenceCode: any;
  constructor(
    private _http: HttpClient,
    private service: TableService,
    private datePipe: DatePipe,
    private toastr: ButtonToasterService,
    private RepSvc: ReportService
  ) {
    console.log(featuresSettings.referenceCode);
    if (featuresSettings.referenceCode == true) {
      this.settings.columns["referenceCode"] = {
        title: "Reference Code",
        // valuePrepareFunction: cmpy => {
        //   for (const n1 of this.referenceCode) {
        //     // console.log(n1);
        //     if (n1._id == cmpy) return n1.name;
        //   }
        // }
      };
    }

    this.dateObj = {};
    this.exportInp = {};
    if (
      featuresSettings.isCityWise == true &&
      featuresSettings.isServiceAvailable == true &&
      localStorage.getItem("userType") == "superadmin"
    )
      this.showCity = true;
    else this.showCity = false;
    // if (featuresSettings.referenceCode== true && localStorage.getItem('referenceCode')=="settings")
    //     this.referenceCode=true;
    // else this.referenceCode=false;

    this.list = {};
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
    this.loadTable();
    this.service.getServiceCity().then((res) => {
      this.serviceCityArray = res;
    });
  }

  loadTable() {
    if (this.dateObj.fromDate && this.dateObj.toDate) {
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          "driverDistanceReport?createdAt_gte=" +
          this.dateObj.fromDate +
          "&createdAt_lte=" +
          this.dateObj.toDate,
      });
    }
  }

  filterRes(data) {
    console.log(data);
    if (
      data.servicecity &&
      data.fromDate == undefined &&
      data.toDate == undefined
    ) {
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          "driverDistanceReport?scity_like=" +
          data.servicecity,
      });
    } else if (
      (data.servicecity == undefined || data.servicecity == "all") &&
      data.fromDate &&
      data.toDate
    ) {
      const fromDate = this.dateObj["fromDate"];
      const toDate = this.dateObj["toDate"];
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          "driverDistanceReport?createdAt_gte=" +
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
          "driverDistanceReport?createdAt_gte=" +
          fromDate +
          "&createdAt_lte=" +
          toDate +
          "&scity_like=" +
          data.servicecity,
      });
    } else this.toastr.showtoast("warn", "Select Filter");
  }
  export(event) {
    console.log(this.list.servicecity, "this.list.servicecity ");
    const exportFor = event.target.value;
    let query = "",
      fromDate = "",
      toDate = "";
    if (
      this.list.servicecity &&
      this.list.fromDate == undefined &&
      this.list.toDate == undefined
    ) {
      query =
        AppSettings.API_ENDPOINT +
        "driverDistanceReport?scity_like=" +
        this.list.servicecity +
        "&requestFrom=" +
        "without_limit";
    } else if (
      (this.list.servicecity == undefined || this.list.servicecity == "all") &&
      this.list.fromDate &&
      this.list.toDate
    ) {
      fromDate = this.dateObj["fromDate"];
      toDate = this.dateObj["toDate"];
      query =
        AppSettings.API_ENDPOINT +
        "driverDistanceReport?createdAt_gte=" +
        fromDate +
        "&createdAt_lte=" +
        toDate +
        "&requestFrom=" +
        "without_limit";
    } else if (
      this.list.servicecity &&
      this.list.fromDate &&
      this.list.toDate
    ) {
      fromDate = this.dateObj["fromDate"];
      toDate = this.dateObj["toDate"];
      query =
        AppSettings.API_ENDPOINT +
        "driverDistanceReport?createdAt_gte=" +
        fromDate +
        "&createdAt_lte=" +
        toDate +
        "&scity_like=" +
        this.list.servicecity +
        "&requestFrom=" +
        "without_limit";
    }
    // AppSettings.API_ENDPOINT
    //   + 'driverDistanceReport?tripFDT_gte='
    //   + fromDate
    //   + '&tripFDT_lte='
    //   + toDate
    console.log(query);
    this._http
      .get(query)
      .toPromise()
      .then((res) => {
        const data = res;
        this.exporttoCSV(exportFor, data, fromDate, toDate);
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  exporttoCSV(exportFor, data, from, to) {
    data.map((el) => {
      el.code = el.code[0];
      el.dvrfname = el.dvrfname[0];
      return el;
    });
    if (from !== "" && to !== "") {
      this.options.title = `Driver Payments From ${from} to ${to} `;
    } else if (from !== "" && to === "") {
      this.options.title = `Driver Payments From ${from}`;
    } else if (from === "" && to !== "") {
      this.options.title = `Driver Payments Upto ${to} `;
    }
    if (exportFor === "csv") {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === "excel") {
      this.exportToExcel(data, "");
      this.exportInp = {};
    }
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      "yyyy-MM-dd"
    );
  }

  /** EXCEL SHEET */

  name: string;
  sName: string = "SheetTest";
  excelFileName: string = "Driver Payments.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = ["Driver", "Code", "Driver Earned Amount", "Total No of Trips"];

  exportToExcel(data, tripLabel) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Web";
    workbook.lastModifiedBy = "Web";
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.addWorksheet(this.sName, {
      views: [{ activeCell: "A1", showGridLines: true }],
    });
    const sheet = workbook.getWorksheet(1);
    sheet.getRow(1).values = "";
    sheet.getRow(2).values = this.cols;
    sheet.columns = [
      { key: "dvrfname", width: 13 },
      { key: "code", width: 10 },
      { key: "amttodriver", width: 14 },
      { key: "count", width: 14 },
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
      setTimeout(function () {
        window.URL.revokeObjectURL(url);
      }, 0);
      FileSaver.saveAs(blob, this.excelFileName, true);
    });
  }
}
