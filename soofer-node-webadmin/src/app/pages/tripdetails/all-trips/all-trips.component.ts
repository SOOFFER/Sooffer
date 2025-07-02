import { Component, OnInit } from "@angular/core";
import { featuresSettings, AppSettings } from "../../../app.config";
import { ServerDataSource } from "ng2-smart-table";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { TripsService } from "../tripdetails.service";
import { Angular2Csv } from "angular2-csv";
import { ButtonToasterService } from "../../buttontoaster/buttontoaster.service";
import { OnDestroy } from "@angular/core";
import * as moment from 'moment';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: "ngx-all-trips",
  templateUrl: "./all-trips.component.html",
  styleUrls: ["./all-trips.component.scss"],
})
export class AllTripsComponent implements OnInit, OnDestroy {
  initial: number = 0;
  currentIndex: any = 0;
  navigationSubscription: any;
  
  exportInp: any;
  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false,
      custom: [{ name: "routeToAPage", title: `<i class="nb-edit"></i>` }],
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      triptype: {
        title: "Trip Type",
      },
      tripno: {
        title: "Trip No",
      },
      date: {
        title: "Date",
      },
      dvr: {
        title: "Driver",
        valuePrepareFunction: (cell, row) => {
          return row.dvr ? row.dvr : "N/A";
        },
      },
      rid: {
        title: "Rider",
      },
      fare: {
        title: "Fare",
        // type:"text"
      },
      vehicle: {
        title: "Vehicle Type",
      },
      "isProfileImgMatchVerified": {
        title: "face Recogination",
        valuePrepareFunction: (cell, row) => {
          console.log(row, "face recogination");
          if (
            row.isProfileImgMatchVerified == true ||
            row.isProfileImgMatchVerified == "true"
          )
            return "Verified";
          else return "Not Verified";
        },
      },
      status: {
        title: "Trip Status",
        // width: "60px",
        filter: {
          type: "list",
          config: {
            selectText: "All",
            list: [
              { value: "noresponse", title: "Noresponse" },
              { value: "Cancelled", title: "Cancelled" },
              { value: "Finished", title: "Finished" },
              { value: "processing", title: "Processing" },
              { value: "accepted", title: "Accepted" },
            ],
          },
        },
      },
      "csp.via": {
        title: "Payment Mode",
        //  type:"number",
        filter: {
          type: "list",
          config: {
            selectText: "All",
            list: [
              { value: "card", title: "Card" },
              { value: "cash", title: "Cash" },
            ],
          },
        },
        valuePrepareFunction: (cell, row) => {
          return row.csp["via"];
        },
      },
    },
  };

  source: ServerDataSource;
  serviceCityArray: any = [];
  showCity: boolean;
  brobj;
  data: any;
  Doc: any = {};
  fields: any;
  tripdetailsId: string;

  /** Reports */
  reportname = "Trip_Details" + Date();
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: [
      "Trip Type",
      "Trip No",
      "Date",
      "Driver",
      "Rider",
      "Fare",
      "Vehicle Type",
      "Status",
      "Payment Via",
    ],
    showTitle: true,
    title: "Trip Report",
    useBom: true,
    removeNewLines: false,
    keys: [
      "triptype",
      "tripno",
      "date",
      "dvr",
      "rid",
      "fare",
      "vehicle",
      "status",
      "paymentMode",
    ],
  };
  setInt: any;
  table: string;

  constructor(
    public http: HttpClient,
    private toastr: ButtonToasterService,
    private router: Router,
    private tripservice: TripsService,
    private activatedRoute:ActivatedRoute
  ) {
    this.exportInp = {};
    this.source = new ServerDataSource(http, {
      endPoint: AppSettings.API_ENDPOINT + "trips",
    });
    this.showServiceCity();
    console.log("this.user2"); // here we receive a payload from the token and assigne it to our `user` variable
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = 0;
      }
    });
    this.activatedRoute.params.subscribe(params => {
      if(params['table']){
        this.table = params['table']
    if(this.table == 'online-payment'){
      this.source = new ServerDataSource(this.http, {
        endPoint: AppSettings.API_ENDPOINT + "trips?_id_like=" + params['code'],
      });
        // this.childMessage(AppSettings.API_ENDPOINT + "trips?ridid_like=" +this.userId)
    }
  }
})

  }
  countNotification() {
    try {
      console.log("called");

      this.source.refresh();
      console.log("Reloaded");
    } catch (err) {
      this.setInt = {};
    }
  }

  showServiceCity() {
    if (
      featuresSettings.isCityWise === true &&
      featuresSettings.isServiceAvailable === true &&
      localStorage.getItem("userType") === "superadmin"
    ) {
      this.showCity = true;
    } else {
      this.showCity = false;
    }
    this.tripservice.getServiceCity().then((res) => {
      this.serviceCityArray = res;
    });
  }

  export(event) {
    const exportFor = event.target.value;
    console.log(exportFor, "export");

    this.http
      .get(
        AppSettings.API_ENDPOINT +
        "trips?_page=1&_limit=1000"
      )
      .toPromise()
      .then(res => {
        const data = res;
        this.exporttoCSV(exportFor, data);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }

  exporttoCSV(exportFor, data) {
    console.log("inside csv");

    for (const res of data) {
      // if (res["createdAt"]) {
      //   res["createdAt"] = moment(res.createdAt)
      //     .utc()
      //     .format("DD-MM-YYYY HH:mm a");
      // }

      if (res["dvr"] == null) {
        res["dvr"] = "-";
      }
    }
    let title;
    if (exportFor === "csv") {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === "excel") {
      this.exportToExcel(data, title);
      this.exportInp = {};
    }
  }

  /** EXCEL SHEET */

  name: string;
  sName: string = "SheetTest";
  excelFileName: string = "Trip_Details.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = [
    "Trip Type",
    "Trip No",
    "Date",
    "Driver",
    "Rider",
    "Fare",
    "Vehicle Type",
    "Status",
    "Payment Via",
  ];

  exportToExcel(data, tripLabel) {
    // console.log(data)
    const workbook = new Excel.Workbook();
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
      { key: "triptype", width: 10 },
      { key: "tripno", width: 10 },
      { key: "date", width: 13 },
      { key: "dvr", width: 25 },
      { key: "rid", width: 12 },
      { key: "fare", width: 12 },
      { key: "vehicle", width: 12 },
      { key: "status", width: 14 },
      { key: "paymentMode", width: 14 },
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
    workbook.xlsx.writeBuffer().then(data => {
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

  ExportAsCSV() {
    this.brobj = [];
    this.http
      .get(AppSettings.API_ENDPOINT + "trips?_page=1&_limit=1000")
      .toPromise()
      .then((res) => {
        this.data = res;
        this.data.forEach((element) => {
          element.Payment = element.csp.via;
          if (element.dvr === null) {
            element.dvr = "----";
          }
          this.brobj.push(element);
        });
        this.export(this.brobj);
      })
      .catch((err) => {
        this.toastr.showtoast("error", err.message);
      });
  }

  // export(data) {
  //   new Angular2Csv(data, this.reportname, this.options);
  // }

  SerachForCity(data): void {
    if (data.servicecity === "undefined" || data.servicecity == "all")
      this.source = new ServerDataSource(this.http, {
        endPoint: AppSettings.API_ENDPOINT + "trips",
      });
    else
      this.source = new ServerDataSource(this.http, {
        endPoint:
          AppSettings.API_ENDPOINT + "trips?scity_like=" + data.servicecity,
      });
  }

  ngOnInit() {

    this.setInt = setInterval(() => {
      console.log("this.user"); // here we receive a payload from the token and assigne it to our `user` variable

      this.countNotification();
    }, 30000);
  }
  ngOnDestroy() {
    clearInterval(this.setInt);

    // console.log("ngOnDestroy");
    // this.setInt = {};
  }
  /** Invoice Page */

  route(event) {
    this.initial = 1;
    console.log(" console.log", this.source.getPaging().perPage)
    const temp = document.querySelector('li.active');
    console.log(temp)
    if (temp) {
      const child = temp.children
      if (child[0] && child[0].childNodes[0] && child[0].childNodes[0].nodeValue) {
        const ind = child[0].childNodes[0].nodeValue;
        this.currentIndex = parseInt(ind);
      }
      console.log("this.currentIndex", this.currentIndex);
    }
    this.tripdetailsId = event.data._id;
    this.fields = this.tripdetailsId;
  }

  goBack() {
    this.initial = 0;
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
  }

  getFields() {
    return this.fields;
  }
  gobacktouser(){
    this.activatedRoute.params.subscribe(params => {
      if(params['table'] == "online-payment"){
        console.log(params['code'])
        this.router.navigate(["pages/tables/report-table/onlinepaymentreport"],
        {state:{code:params['code']}})
      }
    })
  }
}
