import { Component, OnInit, ViewChild } from "@angular/core";
import { ServerDataSource } from "ng2-smart-table";
import { AppSettings, featuresSettings } from "../../../../app.config";
import { PackageService } from "../../package/package.service";
import { ActivatedRoute, NavigationEnd } from "@angular/router";
import { ButtonToasterService } from "../../../buttontoaster/buttontoaster.service";
import { Http } from "@angular/http";
import { DatePipe } from "@angular/common";
import { TableService } from "../../table.service";
import { HttpClient } from "@angular/common/http";
import { DatepickerOptions } from "ng2-datepicker";
import * as moment from "moment";
import { DriverService } from "../../../driver/driver.service";
import { Router } from "@angular/router";
import { Angular2Csv } from "angular2-csv";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
interface commonDataList {
  value: string;
  label: string;
}

@Component({
  selector: "ngx-driver-subscription",
  providers: [PackageService, DriverService],
  templateUrl: "./driver-subscription.component.html",
  styleUrls: ["./driver-subscription.component.scss"],
})
export class DriverSubscriptionComponent implements OnInit {
  initial: number = 0;
  list: any = {};
  apiMessage: string;
  currentIndex: any = 0;
  submitdoc: boolean = false;
  baseurl: string = AppSettings.BASEURL;
  driverAry: any[] = [];
  packAry: any[] = [];
  subAry: any[] = [];
  comAry: any[] = [];
  driverDoc: any = {};
  packageType: any[] = featuresSettings.subPackageTypes;
  exportInp: any = {};
  navigationSubscription: any;

  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: "routeToAPage", title: `<i class="nb-edit"></i>` }],
      history: [{ name: "routeToAPage", title: `<i class="nb-edit"></i>` }],
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      child: {
        title: "Subscribed Packages",
        type: "html",
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          return `<a title="Histroy of Driver"  href="#/pages/tables/package/driver-packages;dvrid=${row._id}" >
                  <i class="ion-clipboard"></i></a>`;
        },
      },
      fname: {
        title: "Driver",
      },
      code: {
        title: "Code",
      },
      phone: {
        title: "Phone",
      },
      subcriptionEndDate: {
        title: "Subscription End Date",
        valuePrepareFunction: (subcriptionEndDate) => {
          return subcriptionEndDate
            ? moment(subcriptionEndDate).format("DD-MM-YYYY")
            : "N/A";
        },
      },
      isSubcriptionActive: {
        title: "Subscription Status",
        filter: {
          type: "list",
          config: {
            selectText: "All",
            list: [
              { value: true, title: "Active" },
              { value: false, title: "Inactive" },
            ],
          },
        },
        valuePrepareFunction: (isSubcriptionActive) => {
          console.log(typeof isSubcriptionActive, "isSubcriptionActive");
          // if(isSubcriptionActive == true) return "Active";
          // else return "Inactive";
          return isSubcriptionActive ? "Active" : "Inactive";
        },
      },
    },
  };

  serviceCityArray: any = [];

  itemdata = [];
  selectedScID: any;
  showCurr: boolean = false;
  showservicecity = featuresSettings.isServiceAvailable;
  showCompany = featuresSettings.isMultipleCompaniesAvailable;
  showCity: boolean;
  source: ServerDataSource;
  valueEntered: boolean = false;
  codeOfDriver: string;
  // new Date().getFullYear()
  // new Date(Date.now() - 86400000)
  reportname = "driver subscription";
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: [
      "Name",
      "Code",
      "Phone",
      "Subscription End Dat",
      "Subscription Status",
    ],
    showTitle: true,
    title: "Trip Payments",
    useBom: true,
    removeNewLines: false,
    keys: [
      "fname",

      "code",
      "phone",
      "subcriptionEndDate",
      "isSubcriptionActive",
    ],
  };

  visibleDateOptions: DatepickerOptions = {
    minYear: 2000,
    maxYear: 2101,
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    // minDate: '', // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: "Click to Select a Date",
    placeholder: "Click to Select a Date",
    addClass: "form-control",
    fieldId: "my-date-picker",
    useEmptyBarTitle: false,
  };

  manuallyAddCreditList: any;
  noFilterThreshold = 3;
  payment: Array<commonDataList> = [
    {
      label: "Debit",
      value: "debit",
    },
    {
      label: "Credit",
      value: "credit",
    },
  ];
  vehicleList: any = [];
  constructor(
    private _http: HttpClient,
    private routeT: ActivatedRoute,
    private router: Router,
    private toastr: ButtonToasterService,
    private dvrservice: DriverService,
    private Service: TableService,
    private packService: PackageService
  ) {
    this.source = new ServerDataSource(this._http, {
      endPoint: AppSettings.API_ENDPOINT + "driver",
    });
    //console.log(this.source)
    this.manuallyAddCreditList = {};
    this.list = {};
    if (
      featuresSettings.isCityWise === true &&
      featuresSettings.isServiceAvailable === true &&
      localStorage.getItem("userType") === "superadmin"
    )
      this.showCity = true;
    else this.showCity = false;

    this.Service.getServiceCity().then((res) => {
      this.serviceCityArray = res;
    });

    this.startApi();

    if (featuresSettings.referenceCode === true) {
      this.settings.columns["referenceCode"] = {
        title: "Reference Code",
      };
    }
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = 0;
      }
    });
  }

  export(event) {
    const exportFor = event.target.value;
    let fromDate = "";
    let toDate = "";

    this._http
      .get(
        AppSettings.API_ENDPOINT + "driver?" + "requestFrom=" + "without_limit"
      )
      .toPromise()
      .then((res) => {
        const data = res;
        this.exporttoCSV(exportFor, data);
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  testChange(data) {
    console.log(data == undefined, data === "undefined");
    if (data != undefined) {
      var dataToSend = {
        PackageValidity: this.list.PackageValidity,
        startDate: this.list.startDate,
      };
      this.dvrservice
        .packageValidity(dataToSend)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => this.toastr.showtoast("error", err.error));
    } else {
      console.log("undefined", data);
    }
    // const selectElementText =
    //   event.target["options"][event.target["options"].selectedIndex].text;
    // console.log(selectElementText);
  }
  generateCode(): void {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.manuallyAddCreditList.trxId = text;
  }

  @ViewChild("dataForm1") form1: any;
  SerachDriverForCity(data): void {
    console.log(data.servicecity);
    if (data.servicecity === "all") {
      this.source = new ServerDataSource(this._http, {
        endPoint: AppSettings.API_ENDPOINT + "driver",
      });
    } else
      this.dvrservice.getDriversListForService(data).then((msg) => {
        this.source = msg;
      });
  }
  // routeClick(){
  //   // this.routeR.navigateByUrl('pages/drivertaxi/add');
  // }
  filedata: any;
  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  route(event) {
    // console.log(event)
    this.list = event.data;
    //  console.log(this.list)
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
    this.list.driverId = this.list._id;
    this.initial = 1;
    this.codeOfDriver = this.list.code;
    this.getDriverTaxis(this.list.driverId)
    //  console.log(thi.codeOfDriver)
  }

  btnClick(num: number) {
    if (num === 2) {
      this.list = {};
      this.codeOfDriver = undefined;
      this.valueEntered = false;
    }
    this.initial = num;
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
    // this.router.navigate(['/pages/tables/package/drivercredits']);
    this.manuallyAddCreditList = {};
    this.manuallyAddCreditList.type = "credit";
    this.generateCode();
    this.startApi();
  }

  getPackages(data) {
    this.list.packageId = '';
    if (this.list.type === "subscription") {
      this.Service.commonfunctionforAll(
        "getSubPackage/" + this.list.vehicleId
      ).then((msg) => {
        this.subAry = msg;
      });
    } else {
      this.Service.commonfunctionforAll("getComPackage").then((msg) => {
        this.comAry = msg;
      });
    }
  }

  changePackage(e) {
    const label = e.target.value;
    if (label === "subscription") {
      this.Service.commonfunctionforAll(
        "getSubPackage/" + this.list.vehicleId
      ).then((msg) => {
        this.subAry = msg;
      });
    } else {
      this.Service.commonfunctionforAll("getComPackage").then((msg) => {
        this.comAry = msg;
      });
    }
  }

  ngOnInit(): void { }

  startApi() {
    this.Service.commonfunctionforAll("getDrivers").then((msg) => {
      this.driverAry = msg;
      //console.log(msg)
    });

    // this.Service.commonfunctionforAll('getpayPackage')
    //   .then(msg => {
    //     this.packAry = msg;
    //     // console.log(msg)
    //   })
  }

  getSubPakageDetail(data): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    const selectElementValue =
      event.target["options"][event.target["options"].selectedIndex].value;
    var filteredValue = this.subAry.filter(
      (data) => data._id == selectElementValue
    );
    this.list.PackageValidity = filteredValue[0]["PackageValidity"];
    // console.log(filteredValue["PackageValidity"]);
    this.list.packageName = selectElementText;
  }

  getComPakageDetail(data): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    // console.log(selectElementText);
    this.list.packageName = selectElementText;
  }

  // getPakageDetail(data): void {
  //   if (!data) { return; }
  //   const selectElementText = event.target['options']
  //   [event.target['options'].selectedIndex].text;
  //   // console.log(selectElementText);
  //   this.list.packageName = selectElementText;
  // }

  getDriverDetail(data): void {
    if (!data) {
      return;
    }

    // const selectElementText = event.target['options']
    // [event.target['options'].selectedIndex].text;
    // console.log(selectElementText);
    // this.list.driverName = selectElementText;
    const name = data.target.value;
    this.getDriverTaxis(name);
    for (const item of this.driverAry) {
      if (item.id === name) {
        this.list.driverName = item.name;
      }
    }
  }
  getDriverTaxis(id) {
    this.Service.getDrivertaxi(id)
      .then((res) => {
        console.log(res, "In Driver Taxi");
        this.vehicleList = res;
      })
      .catch((err) => {
        console.log(err, "Error");
      });
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) {
      return;
    }
    console.log(inputs);
    // this.Service.activatePackToDriver(inputs)
    //   .then(msg => {
    //     this.apiMessage = msg.message;
    //     this.toastr.showtoast('success', this.apiMessage);
    //     this.btnClick(0);
    //   })
    //   .catch(msg => {
    //     this.apiMessage = msg.message; // handle unknow err
    //     this.toastr.showtoast('error', this.apiMessage);
    //   });
  }

  selectedDriver(e) {
    const name = e.target.value;
    for (const item of this.driverAry) {
      if (item.id === name) {
        this.manuallyAddCreditList.driverName = item.name;
      }
    }
  }

  Getverified(inputs: any): void {
    if (!inputs) {
      return;
    }
    const editObj = {
      packageId: inputs.packageId,
      driverId: inputs.driverId,
      type: inputs.type,
      vehicletype: inputs.vehicleId,
      startDate: moment(inputs.startDate, "YYYY-MM-DDTHH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ),
      purchaseDate: moment(inputs.purchaseDate, "YYYY-MM-DDTHH:mm:ss").format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ),
    };
    this.packService
      .addDriverSubPackage(editObj)
      .then((msg) => {
        this.apiMessage = msg.message;
        this.toastr.showtoast("success", this.apiMessage);
        this.btnClick(0);
      })
      .catch((msg) => {
        this.apiMessage = msg.message; // handle unknow err
        this.toastr.showtoast("error", this.apiMessage);
      });

    // if (this.submitdoc === true) {
    //   this.Service.approveTransVerified(editObj, this.list.trxid)
    //     .then(msg => {
    //       this.apiMessage = msg.message;
    //       if (msg.success === true) {
    //         this.Service.activatePackToDriver(editObj)
    //           .then(msg => {
    //             this.apiMessage = msg.message;
    //             this.toastr.showtoast('success', this.apiMessage);
    //             this.btnClick(0);
    //           })
    //           .catch(msg => {
    //             this.apiMessage = msg.message; // handle unknow err
    //             this.toastr.showtoast('error', this.apiMessage);
    //           });
    //       }
    //       this.toastr.showtoast('success', this.apiMessage);
    //       this.router.navigate(['pages/tables/bankTransaction']);
    //     })
    //     .catch(msg => {
    //       this.apiMessage = msg.message; // handle unknow err
    //       this.toastr.showtoast('error', this.apiMessage);

    //     });
    // } else {
    //   this.Service.activatePackToDriver(editObj)
    //     .then(msg => {
    //       this.apiMessage = msg.message;
    //       this.toastr.showtoast('success', this.apiMessage);
    //       this.btnClick(0);
    //     })
    //     .catch(msg => {
    //       this.apiMessage = msg.message; // handle unknow err
    //       this.toastr.showtoast('error', this.apiMessage);
    //     });
    // }
  }

  lesserThanZero(e) {
    let value = e.target.value;
    if (value <= 0) {
      value = 0;
    }
    const ObjectName = e.target.name;
    this.manuallyAddCreditList[ObjectName] = value;
  }

  sendPayment(inputs) {
    if (inputs.amt <= 0) {
      this.toastr.showtoast("warn", "Please Enter Valid Amount");
    } else {
      const date = moment(inputs.paymentDate).format("YYYY-MM-DD");
      const sendPay = {
        driverId: inputs.driverId,
        driverName: inputs.driverName,
        trxId: this.manuallyAddCreditList.trxId,
        description: inputs.description,
        amt: inputs.amt,
        type: inputs.type,
        paymentDate: date,
      };
      this.packService
        .sendDriverSettlement(sendPay)
        .then((res) => {
          this.toastr.showtoast("success", res.message);
          this.btnClick(0);
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.error.message);
        });
    }
  }

  history(data) {
    //console.log(data)
  }

  exporttoCSV(exportFor, data) {
    for (const res of data) {
      res["subcriptionEndDate"] = res["subcriptionEndDate"]
        ? moment(res["subcriptionEndDate"]).format("DD-MM-YYYY")
        : "N/A";

      // res["totalAmount2"] = "Completed";
      res["isSubcriptionActive"] = res["isSubcriptionActive"]
        ? "Active"
        : "Inactive";
      if (res["fname"] == null) {
        res["fname"] = "";
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
  excelFileName: string = "driversubscription.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = ["Name", "Code", "Phone", "Trip Date", "Total Fare"];
  exportToExcel(data, tripLabel) {
    // console.log(data)
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
      { key: "fname", width: 10 },
      { key: "code", width: 13 },
      { key: "phone", width: 10 },
      { key: "Subscription End Date", width: 25 },
      { key: "Subscription Status", width: 12 },
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
