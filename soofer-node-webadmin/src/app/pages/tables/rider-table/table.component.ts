import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { AppSettings, inputValidation, featuresSettings, AdminMenuConfig } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { Service } from '../../rider/rider.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

interface commoninter {
  value: string;
  label: string;
  _id: string;
  currency: string;
}

@Component({
  selector: "ngx-smart-table",
  providers: [TableService],
  templateUrl: "./smart-table.component.html",
  styles: [
    `
      nb-card {
        transform: translate3d(0, 0, 0);
      }
    `,
  ],
})
export class RiderTableComponent implements OnInit, OnDestroy {
  countries: Array<commoninter>;
  states: Array<commoninter>;
  cities: Array<commoninter>;
  initial: string = "list";
  selectedid: string;
  selectedDocs: any;
  list: any = {};
  countryary: any[] = [];
  langary: any[] = [];
  currencyary: any[] = [];
  baseurl: string = AppSettings.BASEURL;
  myDid: any = {};
  validation = inputValidation;
  serviceCityArray: any = [];
  showCity: boolean;
  currentIndex: any = 0;
  exportInp: any = {};

  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: "routeToAPage", title: `<i class="nb-edit"></i>` }],
    },

    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex,
    },

    columns: {
      fname: {
        title: "First Name",
      },
      lname: {
        title: "Last Name",
      },
      email: {
        title: "Email",
      },
      phone: {
        title: "Phone",
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
      softdel: {
        title: "Account Status",
        filter: {
          type: "list",
          config: {
            selectText: "Select Status",
            list: [
              { value: "active", title: "Active" },
              { value: "inactive", title: "Inactive" },
            ],
          },
        },
        // valuePrepareFunction: status => {
        //   if (status === true) {
        //     return 'Active';
        //   } else return 'Inactive';
        // }
      },
    },
  };

  source: ServerDataSource;
  Doc: any = {};
  dropdownSettings = {
    singleSelection: true,
    idField: "_id",
    textField: "label",
    itemsShowLimit: 10,
    allowSearchFilter: true,
  };
  selectedScID: any;
  showCurr: boolean = false;
  showservicecity = featuresSettings.isServiceAvailable;
  servicecites: Array<commoninter>;
  riderAccepted: boolean;

  navigationSubscription: any;
  restrictProvider: boolean = false;
  list_phon_code = featuresSettings.phcode;
  document: any;

  constructor(
    private _http: HttpClient,
    private service: TableService,
    private CommonSvc: CommonService,
    private RiderSvc: Service,
    private router: Router,
    private routing: ActivatedRoute,
    private toastr: ButtonToasterService,
    private _sanitizer: DomSanitizer
  ) {
    this.source = new ServerDataSource(this._http, {
      endPoint: AppSettings.API_ENDPOINT + "rider",
    });
    if (
      featuresSettings.isCityWise === true &&
      featuresSettings.isServiceAvailable === true &&
      localStorage.getItem("userType") === "superadmin"
    )
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity().then((res) => {
      this.serviceCityArray = res;
    });

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
       
        if(history.state.code){
          // this.initial = 'detail'
        let code = history.state.code
        
        this.CommonSvc.getRider(code).then((res)=>{
        this.document = res[0]
        this.routeForRedirect(this.document)
        this.initial = ''
      })
      }else{
          this.initial = "list";
      }
      }
    });
    this.routing.params.subscribe((params) => {
      if (params["_id"]) {
        this.RiderSvc.GetRiderId().then((msg) => {
          msg.forEach((record) => {
            if (record._id === params["_id"]) {
              this.initial = "";
              this.SetDocsDetails(record);
              //  this.startAt = new Date();
            }
          });
        });
      }
    });
    this.restrictProvider = this.checkProv();
  }

  checkProv() {
    const type = localStorage.getItem("userType");
    console.log(type);
    if (type === "provider" && AdminMenuConfig.hideFieldsForProviderLogin) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  onItemSelect(item: any) {
    this.dispCurr(item);
    let currentCur;
    this.servicecites.forEach((el) => {
      if (el._id === item._id) {
        currentCur = el.currency;
      }
    });
    this.selectedDocs.cur = currentCur;
  }

  onItemDeSelect(item: any) {
    this.dispCurr("");
  }

  SerachDriverForCity(data): void {
    console.log(data);
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity == "undefined" || data.servicecity == "all")
      this.source = new ServerDataSource(this._http, {
        endPoint: AppSettings.API_ENDPOINT + "rider",
      });
    else
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT + "rider?scity_like=" + data.servicecity,
      });
  }

  dispCurr(data) {
    if (data.label === "Default") {
      this.showCurr = true;
    } else {
      this.showCurr = false;
      this.selectedDocs.cur = "";
    }
  }

  ngOnInit(): void {
    //console.log(window.location.hostname);
    // this.CommonSvc.getCurrency()
    //   .then(msg => this.currencyary = msg[0]['datas']);
    this.CommonSvc.getCountries()
      .then((msg) => (this.countries = msg[0]["countries"]))
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
    // this.CommonSvc.getLangs()
    //   .then(msg => {
    //     this.langary = msg[0]['datas'];
    //   });
    this.CommonSvc.getServiceAvailableCity().then((res) => {
      this.servicecites = res;
    });
  }

  route(event) {
    this.initial = "";
    console.log(" console.log", this.source.getPaging().perPage);
    const temp = document.querySelector("li.active");
    console.log(temp);
    if (temp) {
      const child = temp.children;
      if (
        child[0] &&
        child[0].childNodes[0] &&
        child[0].childNodes[0].nodeValue
      ) {
        const ind = child[0].childNodes[0].nodeValue;
        this.currentIndex = parseInt(ind);
      }
      console.log("this.currentIndex", this.currentIndex);
    }
    this.SetDocsDetails(event.data);
    this.CommonSvc.doAddFormControlNgSelectClass();
  }
  routeForRedirect(event) {
    this.initial = "";
    console.log(" console.log", this.source.getPaging().perPage);
    const temp = document.querySelector("li.active");
    console.log(temp);
    if (temp) {
      const child = temp.children;
      if (
        child[0] &&
        child[0].childNodes[0] &&
        child[0].childNodes[0].nodeValue
      ) {
        const ind = child[0].childNodes[0].nodeValue;
        this.currentIndex = parseInt(ind);
      }
      console.log("this.currentIndex", this.currentIndex);
    }
    this.SetDocsDetails(event);
    this.CommonSvc.doAddFormControlNgSelectClass();
  }
  SetDocsDetails(data: any): void {
    if (!data) {
      return;
    }
    this.selectedid = data._id;
    this.selectedDocs = data;
    this.checkStatus(data.softdel);
    //console.log(this.selectedDocs);
    this.populateState(this.selectedDocs.cnty);
    this.populateCity(this.selectedDocs.state);
    this.selectedDocs.cur = data.cur;
    const servicecity = [];
    //console.log(data.scId, data.scity)
    const val = {
      scId: data.scId,
      name: data.scity,
    };
    servicecity.push(val);
    this.selectedScID = servicecity;
    data.scIds = this.CommonSvc.ReconvertionScid(servicecity);
    if (localStorage.getItem("userType") == "citywiseadmin") {
      this.selectedDocs.scIds = this.CommonSvc.dataforscids(
        this.serviceCityArray
      );
    }
  }

  populateState(state) {
    this.CommonSvc.GetState(state).then((msg) => {
      this.states = msg[0]["states"];
    });
  }

  populateCity(state) {
    this.CommonSvc.GetCity(state).then((msg) => {
      this.cities = msg[0]["cities"];
    });
  }

  goBack(): void {
    this.initial = "list";
    // setTimeout(() => this.source.setPage(this.currentIndex), 0);
  }

  resetMyPwd(id): void {
    this.myDid.riderid = id;
    this.RiderSvc.resetingPWD(this.myDid).then((res) => {
      this.toastr.showtoast("success", res.message);
    });
  }

  showStateDropDown() {
    if (
      typeof this.list.countryId !== "undefined" &&
      this.list.countryId !== ""
    ) {
      return true;
    } else {
      return false;
    }
  }
  selectedCountry(option: commoninter) {
    console.log(option.label);
    this.selectedDocs.state = "";
    this.selectedDocs.city = "";
    this.list.getCountry = option.label;
    // this.getStateofSelectedCountry(option.value);
    this.showStateDropDown();
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.getStateofSelectedCountry(option.value);
  }

  deSelectedCountry(option: commoninter) {
    this.list.cntyname = "";
    this.list.city = "";
    this.list.state = "";
    this.list.cnty = "";
  }

  selectedState(option: commoninter) {
    this.list.statename = option.label;
    this.list.city = "";
    this.getCityofSelectedState(option.value);
  }

  deSelectedState(option: commoninter) {
    this.list.statename = "";
    this.list.city = "";
    this.list.state = "";
  }

  selectedCity(option: commoninter) {
    this.list.cityname = option.label;
  }

  deSelectedCity(option: commoninter) {
    this.list.cityname = "";
    this.list.city = "";
  }

  getStateofSelectedCountry(id) {
    this.CommonSvc.GetStateofSelectedCountry(id)
      .then((response) => {
        try {
          this.states = response[0]["states"];
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        let errorMessage = "Something went wrong.";
        errorMessage =
          this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
            errorMessage,
            response
          );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  getCityofSelectedState(id) {
    this.CommonSvc.GetCity(id)
      .then((response) => {
        try {
          this.cities = response[0]["cities"];
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        let errorMessage = "Something went wrong.";
        errorMessage =
          this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
            errorMessage,
            response
          );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  updateRecord(inputs: any): void {
    if (!inputs) {
      return;
    }
    if (inputs.scIds.length <= 0 && this.showservicecity === true) {
      this.toastr.showtoast("warn", "Enter Service Available City");
    } else {
      let scIds = [];
      scIds = this.CommonSvc.convertionOfServiceId(inputs.scIds);
      (inputs.scId = scIds[0].scId), (inputs.scity = scIds[0].name);
      this.RiderSvc.updateRiderData(inputs).then((res) => {
        this.toastr.showtoast("success", res.message);
      });
      setTimeout(() => {
        this.initial = "list";
      }, 2000);
    }
  }

  checkStatus(data) {
    if (data === "active") {
      this.riderAccepted = true;
    } else this.riderAccepted = false;
  }

  deleteRecord(data: any): void {
    this.RiderSvc.deleteRiderData(data)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
        this.riderAccepted = false;
        // this.goBack();
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  activateRi(data: any): void {
    this.RiderSvc.activateRider(data)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
        this.riderAccepted = true;
        // this.goBack();
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  routeToCredits(id) {
    this.router.navigate([
      "/pages/tables/settlement/ridersettlements",
      {
        riderId: id,
        riderName: this.selectedDocs.fname,
      },
    ]);
  }
  routeToOnlinePayment(id){
      this.router.navigate(["pages/tables/report-table/onlinepaymentreport",
      {table: "rider-table",code:this.selectedDocs.email,userId: id,}])
  }

  export(event) {

    const exportFor = event.target.value;



    this._http
      .get(
        AppSettings.API_ENDPOINT + "rider?" + "requestFrom=" + "without_limit"
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

  reportname = "Rider Details";
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: ["First Name", "Last Name", "Email", "Phone", "Account Status"],
    showTitle: true,
    title: "Rider Details",
    useBom: true,
    removeNewLines: false,
    keys: ["fname", "lname", "email", "phone", "softdel"],
  };

  exporttoCSV(exportFor, data) {
    console.log('exportFor : \n ', exportFor);
    console.log('data 1 : \n ', data);

    for (const res of data) {
      res["createdAt"] = moment(res.createdAt)
        .utc()
        .format("DD-MM-YYYY HH:mm a");
      res["totalAmount2"] = "Completed";
      if (res["dvrfname"] == null) {
        res["dvrfname"] = "";
      }

    }
    console.log('data 2: \n ', data);


    if (exportFor === "csv") {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === "excel") {
      this.exportToExcel(data);
      this.exportInp = {};
    }
  }
  /** EXCEL SHEET */
  name: string;
  sName: string = "SheetTest";
  excelFileName: string = "Rider Details.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = ["First Name", "Last Name", "Email", "Phone", "Account Status"];

  exportToExcel(data) {
    console.log('data 3 : \n ', data);
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
      { key: "fname", width: 10 },
      { key: "lname", width: 13 },
      { key: "email", width: 10 },
      { key: "phone", width: 25 },
      { key: "softdel", width: 12 },
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


  deleteRiderRecord(data: any): void {
    console.log(data, "data");
    this.RiderSvc.deleteRider(data)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
        this.goBack();
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }
}
