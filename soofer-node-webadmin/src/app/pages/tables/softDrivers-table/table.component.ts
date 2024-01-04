import { Component } from "@angular/core";
import { ServerDataSource } from "ng2-smart-table";
import { TableService } from "../table.service";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import {
  AppSettings,
  featuresSettings,
  documentSettings,
  inputValidation,
  AdminMenuConfig,
} from "../../../app.config";
import { CommonService } from "../../common/common.service";
import { DriverService } from "../../driver/driver.service";
import { Service } from "../../drivertaxi/driver.service";
import { DatePipe } from "@angular/common";
import { ButtonToasterService } from "../../buttontoaster/buttontoaster.service";
import { HttpClient } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { DatepickerOptions } from "ng2-datepicker";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import * as FileSaver from "file-saver";
import { Angular2Csv } from "angular2-csv";

interface commonArrayDataList {
  value: string;
  label: string;
  _id: string;
  currency: string;
}

@Component({
  selector: "ngx-smart-table",
  styleUrls: ["./fileupload.css"],
  providers: [TableService, CommonService, DatePipe, Service],
  templateUrl: "./smart-table.component.html",
  styles: [
    `
      nb-card {
        transform: translate3d(0, 0, 0);
      }
    `,
  ],
})
export class SoftDriverTableComponent {
  makeary: any[] = [];
  yearary: any[] = [];
  editFirstDocset: boolean = false;
  editSecondDocset: boolean = false;
  // taxiFirstDocset:boolean=false;
  taxiSecondDocset = new Array(documentSettings.taxiDocs.length);
  taxiFirstDocset = new Array(
    documentSettings.driverDocsWithMultipleImages.length
  );
  taxiThirdDocset = new Array(documentSettings.driverDocs.length);
  taxiFourthDocset = new Array(
    documentSettings.driverDocsWithoutExpiryDate.length
  );
  taxiFifthDocset = new Array(
    documentSettings.taxiDocsWithMultipleImages.length
  );
  taxiSixthDocset = new Array(
    documentSettings.driverDocsWithMultipleImgWithoutDate.length
  );
  taxiSeventhDocset = new Array(
    documentSettings.taxiDocsWithoutExpiryDate.length
  );
  taxiEighthDocset = new Array(
    documentSettings.taxiDocsWithManualFields.length
  );
  countries: Array<commonArrayDataList>;
  states: Array<commonArrayDataList>;
  cities: Array<commonArrayDataList>;
  servicecites: Array<commonArrayDataList>;
  companyary: any[] = [];
  currencyary: any[] = [];
  colorary: any[] = [];
  langary: any[] = [];
  Tmsg: any = "";
  Tcount: boolean = true;
  Tcode: any = {};
  check: any;
  initial: string = "list";
  selectedid: string;
  driverName: string;
  selectedDocs: any;
  bankDocs: any = {};
  selectedDocsStatus: string = "Approve";
  selectedTaxiDocsStatus: string = "Approve";
  selectedUser: string;
  list: any = {};
  list2: boolean = true;
  driverAccepted: boolean = false;
  driverTaxiAccepted: boolean = false;
  selectedTaxi: any;
  selectedTaxis: any;
  singleTaxi: any = {};
  singleTaxiId: any;
  filedata: any = [];
  taxiFiledata: any;
  baseurl: string = AppSettings.BASEURL;
  myDid: any = {};
  vehicleary: any[] = [];
  setLine: any = {};
  expiryDate: any;
  taxiExpiryDate: any;
  docFile: string;
  Tmake: any;
  Tyear: any;
  Tmodel: any;
  lengthservicecities: number;
  driverDoc: any = {};
  diver: any = {};
  dataService: any;
  chV: boolean;
  modelary: any = [];
  selectedcid: any;
  validation = inputValidation;
  exportInp: any = {};
  currentIndex: any = 0;

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
      page: this.currentIndex
    },
    columns: {
      code: {
        title: "Code",
      },
      fname: {
        title: "Driver Name",
      },
      cityname: {
        title: "City",
      },
      "taxis.model": {
        title: "Vehicle type",
        valuePrepareFunction: (cell, row, _id) => {
          let tempAr: any = {};
          tempAr = row.taxis;
          if (tempAr.length == 1) {
            for (const tn of tempAr) {
              if (tn.driver == row._id) {
                const tw = tn.model;
                return tw + " - " + row.curService;
              }
            }
          } else if (tempAr.length > 1) {
            let tw2 = "";
            for (const tn of tempAr) {
              if (tn.driver == row._id) {
                tw2 = tw2 + tn.model + ",";
                return tw2;
              }
            }
          }
        },
      },
      email: {
        title: "Email",
      },
      phone: {
        title: "Phone",
      },
      "status.docs": {
        title: "Status",
        filter: true,
        valuePrepareFunction: (cell, row) => {
          return row.status[0].docs;
        },
      },
      // status: {
      //   title: 'Status',
      //   valuePrepareFunction: (status) => {
      //     return status[0].docs;
      //   }
      // },
      softdel: {
        title: "Account Status",
        filter: true,
      },
      lastUpdate: {
        title: "Last Updated Time",
        filter: false,
        sort: false,
        valuePrepareFunction: (lastUpdate) => {
          //return lastUpdate;
          if (lastUpdate) {
            return moment(lastUpdate).utc().format("MMMM Do YYYY, h:mm:ss a");
          } else return "";
          // return this.datePipe.transform(lastUpdate, 'MMMM d, y');
        },
      },
      lastDocsUpdated: {
        title: "Document Last Updated",
        filter: false,
        sort: false,
        valuePrepareFunction: (lastUpdate) => {
          //return lastUpdate;
          if (lastUpdate) {
            return moment(lastUpdate).utc().format("MMMM Do YYYY, h:mm:ss a");
          } else return "";
          // return this.datePipe.transform(lastUpdate, 'MMMM d, y');
        }
      }
    },
  };

  source: ServerDataSource;
  dropdownSettings = {
    singleSelection: true,
    idField: "_id",
    textField: "label",
    itemsShowLimit: 10,
    allowSearchFilter: true,
  };
  serviceCityArray: any = [];

  itemdata = [];
  minDate: any;
  selectedScID: any;
  showCurr: boolean = false;
  showservicecity = featuresSettings.isServiceAvailable;
  showCompany = featuresSettings.isMultipleCompaniesAvailable;
  driverDocument = documentSettings.driverDocs;
  driverTaxiDocument = documentSettings.taxiDocs;
  multipleTaxiDoc = documentSettings.taxiDocsWithMultipleImages;
  multipleDoc = documentSettings.driverDocsWithMultipleImages;
  driDocWithoutExpiry = documentSettings.driverDocsWithoutExpiryDate;
  drivDocWithMultiWithoutExp =
    documentSettings.driverDocsWithMultipleImgWithoutDate;
  taxiDocWithoutExpiry = documentSettings.taxiDocsWithoutExpiryDate;
  manuallyaddedTaxiFields = documentSettings.taxiDocsWithManualFields;
  multipleDriDoc: any;
  multipleDriDocExpiryDate: any;
  multipleTaxiFileData: any;
  multipleTaxiExpiryDate: any;

  taxiDocAddManually: any;
  taxiDocAddExpiryManually: any;

  startAt: any;
  visibleDateOptions: DatepickerOptions = {
    minYear: 1950,
    maxYear: 2101,
    displayFormat: "MMM D[,] YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0,
    maxDate: new Date(Date.now()), // Minimal selectable date
    barTitleIfEmpty: "Click to Select a Date",
    placeholder: "Click to Select a Date",
    addClass: "form-control",
    useEmptyBarTitle: false,
  };
  showCity: boolean;
  showactiveDriver: boolean = false;
  navigationSubscription: any;
  restrictProvider: boolean = false;
  checked: any;
  curService: any;
  selId: any;
  drvCode: any;
  drvFname: any;
  drvLname: any;

  constructor(
    private _http: HttpClient,
    private modalService: NgbModal,
    http: HttpClient,
    private service: TableService,
    private CommonSvc: CommonService,
    private dService: Service,
    private dvrservice: DriverService,
    private datePipe: DatePipe,
    private router: Router,
    private toastr: ButtonToasterService
  ) {
    this.source = new ServerDataSource(this._http, {
      endPoint: AppSettings.API_ENDPOINT + "softRejectedDrivers",
    });
    if (
      featuresSettings.isCityWise == true &&
      featuresSettings.isServiceAvailable == true &&
      localStorage.getItem("userType") == "superadmin"
    )
      this.showCity = true;
    else this.showCity = false;
    this.minDate = new Date(Date.now() - 86400000);
    this.taxiSecondDocset.fill(false);
    this.taxiFirstDocset.fill(false);
    this.taxiThirdDocset.fill(false);
    this.taxiFourthDocset.fill(false);
    this.taxiFifthDocset.fill(false);
    this.taxiSixthDocset.fill(false);
    this.taxiSeventhDocset.fill(false);
    this.taxiEighthDocset.fill(false);
    this.filedata = {};
    this.taxiFiledata = {};
    this.expiryDate = {};
    this.taxiExpiryDate = {};
    this.multipleTaxiFileData = {};
    this.multipleTaxiExpiryDate = {};
    this.multipleDriDoc = {};
    this.multipleDriDocExpiryDate = {};
    this.taxiDocAddManually = {};
    this.taxiDocAddExpiryManually = {};
    this.service.getServiceCity().then((res) => {
      this.serviceCityArray = res;
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = "list";
      }
    });
    this.CommonSvc.getVehicleTypeData().then((msg) => (this.vehicleary = msg));
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

  // makeOthersOnline() {
  //   this.dvrservice.driverONLine().then((res) => {
  //     console.log(res);
  //     this.toastr.showtoast('success', res.message)
  //   })
  //     .catch((err) => {
  //       this.toastr.showtoast('err', err.message)
  //     });

  // }
  routeToNewPage() {
    this.router.navigate(["pages/tables/no-signal"]);
  }
  SerachDriverForCity(data): void {
    console.log(data.servicecity);
    if (data.servicecity == "all") {
      this.source = new ServerDataSource(this._http, {
        endPoint: AppSettings.API_ENDPOINT + "driverOnline",
      });
    } else
      this.dvrservice.getOnlineDriversListForService(data).then((msg) => {
        this.source = msg;
      });
  }
  // SerachDriverForCity(data): void {
  //   this.dvrservice.getDriversListForService(data)
  //     .then(msg => {
  //       this.source = msg;
  //     })
  // }

  profileImage: any;

  profileEve(e) {
    this.profileImage = "";
    this.profileImage = e.target.files[0];
    this.uploadImg();
  }

  ToggleMe(data: any, Name) {
    this.checked = data.checked;
    console.log(this.checked, Name);

    const info = {
      activeFor: Name,
      status: this.checked,
      curService: this.curService,
      currentTaxi: this.selectedTaxi._id,
      driverId: this.selId,
    };
    console.log(info);

    this.dvrservice
      .DriverActivatedStatus(info)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  uploadImg() {
    if (this.profileImage) {
      const formData = new FormData();
      formData.append("file", this.profileImage);
      this.dvrservice
        .uploadDriverImage(formData)
        .then((res) => {
          this.selectedDocs.profile = res.data;
          this.profileImage.profile = res.data;
          // this.toastr.showtoast('success', res.message);
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.message);
        });
    } else {
      this.toastr.showtoast("error", "Please Upload Profile Image");
    }
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  docDoc(string) {
    console.log(string);
  }

  ngOnInit(): void {
    this.CommonSvc.getCarMake().then((msg) => (this.makeary = msg[0]["datas"]));
    this.CommonSvc.getYearsData().then(
      (msg) => (this.yearary = msg[0]["datas"])
    );
    this.CommonSvc.getCompanies().then((msg) => (this.companyary = msg));
    this.CommonSvc.getCountries().then(
      (msg) => (this.countries = msg[0]["countries"])
    );
    this.CommonSvc.getCurrency().then(
      (msg) => (this.currencyary = msg[0]["datas"])
    );
    this.CommonSvc.getLangs().then((msg) => {
      this.langary = msg[0]["datas"];
    });
    this.CommonSvc.getServiceAvailableCity().then((res) => {
      this.servicecites = res;
    });
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

  dispCurr(data) {
    if (data.label === "Default") {
      this.showCurr = true;
    } else {
      this.showCurr = false;
      this.selectedDocs.cur = "";
    }
  }

  lessDate;
  updateMbal() {
    const body = new URLSearchParams();
    body.set("dateless", this.lessDate);
    this.CommonSvc.deactivateAllUsers(body).then((msg) => {
      this.toastr.showtoast("success", msg.message);
    });
  }

  getBankDetail(id) {
    this.dvrservice
      .getDriverBankDetails(id)
      .then((res) => {
        // console.log(res);
        this.bankDocs = res["bankDetails"] ? res["bankDetails"] : {};
        // console.log(this.bankDocs);
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
  }

  route(event) {
    this.initial = "";
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
    console.log(event.data);
    this.SetDocsDetails(event.data);
    this.getBankDetail(event.data._id);
    this.startAt = new Date();
    this.curService = event.data.curService;
    this.selId = event.data._id;
    this.drvCode = event.data.code;
    this.drvFname = event.data.fname;
    this.drvLname = event.data.lname;
  }
  routeToSendNotifi() {
    this.router.navigate([
      "pages/tables/utility/sendpush",
      { Code: this.drvCode, Name: this.drvFname + " " + this.drvLname },
    ]);
  }

  resetMyPwd(id): void {
    // console.log(id);
    this.myDid.driverid = id;
    this.dvrservice.resetingPWD(this.myDid).then((res) => {
      this.toastr.showtoast("success", res.message);
    });
  }

  GetModel(data: any): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.list.makename = selectElementText;

    const selectElementId =
      event.target["options"][event.target["options"].selectedIndex].value;

    const index = this.makeary.map((el) => el.make).indexOf(selectElementId);
    this.modelary = this.makeary[index].model;
    let Tmodel;
    for (const tet of this.modelary) {
      if (this.singleTaxi.model == tet) Tmodel = tet; //.make;
    }
  }

  setDriver(i1, i2) {
    //console.log(i1);
    //console.log(i2);
    this.setLine.status = i2;
    this.setLine.driverId = i1;
    this.chV = i2;
    this.dvrservice.setOnOff(this.setLine).then((res) => {
      this.toastr.showtoast("success", res.message);
    });
  }

  SetDocsDetails(data: any): void {
    this.convertToArrayObj(this.taxiLabels);
    if (!data) {
      return;
    }
    console.log(data.DOB);
    const servicecity = [];
    //console.log(data.scId, data.scity)
    const val = {
      scId: data.scId,
      name: data.scity,
    };
    servicecity.push(val);
    this.diver.driverid = data._id;
    this.selectedScID = servicecity;
    data.scIds = this.CommonSvc.ReconvertionScid(servicecity);
    this.driverName = data.fname + "" + data.lname;
    this.selectedid = data._id;
    this.selectedcid = data.cmpy;
    this.selectedDocs = data;
    this.selectedDocs.DOB = moment.utc(moment(data.DOB)).format('YYYY-MM-DD');
    this.selectedDocs.cur = data.cur;
    this.showactiveDriver = this.changeActiveInActive(data.softdel);
    this.cngDriverAccepted(data.status[0].docs);
    this.selectedUser = data.fname;
    this.selectedTaxi = data.taxis[0];
    this.selectedTaxis = data.taxis;
    if (data.online) this.chV = true;
    else this.chV = false;
    //   console.log(this.chV)
    this.populateState(this.selectedDocs.cnty);
    this.populateCity(this.selectedDocs.state);
    if (localStorage.getItem("userType") == "citywiseadmin") {
      data.scIds = this.CommonSvc.dataforscids(this.serviceCityArray);
    } else data.scIds = this.CommonSvc.ReconvertionScid(servicecity);
  }

  changeActiveInActive(data) {
    if (data === "active") {
      return true;
    } else {
      return false;
    }
  }

  populateState(state) {
    this.CommonSvc.GetState(state).then((msg) => {
      this.states = msg[0]["states"];
    });
  }
  testCode(inp) {
    //console.log(inp);
    this.Tcode.code = inp;
    this.Tcount = true;
    // console.log(inp);
    this.dvrservice.AvailCode(this.Tcode).then((res) => {
      //  console.log(res);
      if (res.success == false) {
        this.Tcount = false;
        this.Tmsg = res.message;
        this.selectedDocs.code = "";
        this.Tcount = true;
        this.toastr.showtoast("error", res.message);
        //  console.log("false ZM");

        //   console.log(this.Tmsg);
      } else if (res.success == true) {
        this.Tcount = true;
        // console.log("true ZM");

        //   console.log(res.message);
      }
    });
  }
  populateCity(state) {
    this.CommonSvc.GetCity(state).then((msg) => {
      this.cities = msg[0]["cities"];
    });
  }

  GetState(data: any): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.selectedDocs.cntyname = selectElementText;

    const selectElementId =
      event.target["options"][event.target["options"].selectedIndex].value;

    this.CommonSvc.GetState(selectElementId).then((msg) => {
      this.states = msg[0]["states"];
    });
  }

  GetCity(data: any): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.selectedDocs.statename = selectElementText;

    const selectElementId =
      event.target["options"][event.target["options"].selectedIndex].value;

    this.CommonSvc.GetCity(selectElementId).then((msg) => {
      this.cities = msg[0]["cities"];
    });
  }

  SetCity(data: any): void {
    if (!data) {
      return;
    }
    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.selectedDocs.cityname = selectElementText;
  }

  goBack(): void {
    this.initial = "list";
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
    this.list2 = true;
    this.diver = {};
    this.filedata = {};
    this.expiryDate = {};
    this.taxiFiledata = {};
    this.taxiExpiryDate = {};
    this.multipleTaxiFileData = {};
    this.multipleTaxiExpiryDate = {};
    this.multipleDriDoc = {};
    this.multipleDriDocExpiryDate = {};
    this.taxiDocAddManually = {};
    this.taxiDocAddExpiryManually = {};
  }

  multipleDriverFile(e) {
    this.multipleDriDoc[e.target.name] = e.target.files[0];
  }

  multipleDriverDate(msg) {
    this.multipleDriDocExpiryDate[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      "dd-MM-yyyy"
    );
  }

  submitMultipleDriverDoc(filefor, ind) {
    const filefor1 = filefor[0];
    const filefor2 = filefor[1];
    const changefile =
      filefor2 === "licenceBackImg" ? "licenceBackImg" : filefor2;
    if (
      this.multipleDriDoc[filefor1] === undefined ||
      this.multipleDriDoc[filefor2] === undefined ||
      this.multipleDriDocExpiryDate[filefor1] === undefined
    ) {
      this.toastr.showtoast(
        "warn",
        "Please Choose both Images and Date For " + filefor1
      );
    } else {
      const formdata = new FormData();
      formdata.append("file", this.multipleDriDoc[filefor1]);
      formdata.append("licenceexp", this.multipleDriDocExpiryDate[filefor1]);
      formdata.append("driverid", this.selectedid);
      formdata.append("filefor", filefor1);
      this.dvrservice.uploadDriverDocs(formdata).then((msg) => {
        this.changeDocsLook(msg, filefor1);
        // this.toastr.showtoast('success', msg.message);
      });
      setTimeout(() => {
        const formdata1 = new FormData();
        formdata1.append("file", this.multipleDriDoc[filefor2]);
        formdata1.append("driverid", this.selectedid);
        formdata1.append("filefor", changefile);
        this.dvrservice
          .uploadDriverDocs(formdata1)
          .then((msg) => {
            this.changeDocsLook(msg, filefor2);
            this.toastr.showtoast("success", msg.message);
            this.taxiFirstDocset[ind] = false;
          })
          .catch((msg) => {
            this.toastr.showtoast("error", msg.message);
          });
      }, 100);
    }
  }

  submitMultipleImageWithoutExp(filefor, ind) {
    const filefor1 = filefor[0];
    const filefor2 = filefor[1];
    const changefile =
      filefor2 === "licenceBackImg" ? "licenceBackImg" : filefor2;
    if (
      this.multipleDriDoc[filefor1] === undefined ||
      this.multipleDriDoc[filefor2] === undefined
    ) {
      this.toastr.showtoast(
        "warn",
        "Please Choose both Images For " + filefor1
      );
    } else {
      const formdata = new FormData();
      formdata.append("file", this.multipleDriDoc[filefor1]);
      formdata.append("driverid", this.selectedid);
      formdata.append("filefor", filefor1);
      this.dvrservice.uploadDriverDocs(formdata).then((msg) => {
        this.changeDocsLook(msg, filefor1);
        // this.toastr.showtoast('success', msg.message);
      });
      setTimeout(() => {
        const formdata1 = new FormData();
        formdata1.append("file", this.multipleDriDoc[filefor2]);
        formdata1.append("driverid", this.selectedid);
        formdata1.append("filefor", changefile);
        this.dvrservice
          .uploadDriverDocs(formdata1)
          .then((msg) => {
            this.changeDocsLook(msg, filefor2);
            this.toastr.showtoast("success", msg.message);
            this.taxiSixthDocset[ind] = false;
          })
          .catch((msg) => {
            this.toastr.showtoast("error", msg.message);
          });
      }, 100);
    }
  }

  // fileEvent(e) {
  //   //console.log(e.target.files[0]);
  //  this.filedata[e.target.name] = e.target.files[0];
  //  this.driverDocument[e.target.name] = e.target.files[0];
  //  console.log(" this.driverDocument[e.target.name]", this.driverDocument[e.target.name])
  // }
  fileEvent(e) {
    //console.log(e.target.files[0]);
    this.filedata[e.target.name] = e.target.files[0];
  }
  logDate(msg) {
    //this.expiryDate = msg.target.value;
    this.expiryDate[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      "dd-MM-yyyy"
    );
    // this.expiryDate[msg.target.name] = msg.target.value;
  }

  // submitDriverDoc(filefor) {
  //   console.log("filefor",)
  //   if (this.driverDocument[filefor[0]] === undefined|| this.driverDocument[filefor[1]] === undefined || this.expiryDate[filefor[0]] === undefined) {
  //     this.toastr.showtoast('warn', 'Please choose both document and Date For ' + filefor);
  //   } else {
  //     var file = filefor[0];
  //     const formdata = new FormData();
  //     formdata.append('file', this.filedata[file]);
  //     formdata.append('licenceexp', this.expiryDate[filefor[0]]);
  //     formdata.append('driverid', this.selectedid);
  //     formdata.append('filefor', filefor[0]);
  //     this.dvrservice.uploadDriverDocs(formdata)
  //       .then(msg => {
  //         this.changeDocsLook(msg, filefor[0]);
  //         // this.selectedDocs.insurance = msg.file.fileurl;
  //         // this.selectedDocs.insuranceexp = msg.request.licenceexp;
  //         this.toastr.showtoast('success', msg.message);
  //       });

  //     setTimeout(() => {
  //      const formdata = new FormData();
  //     formdata.append('file', this.filedata[filefor[0]]);
  //     formdata.append('licenceexp', this.expiryDate[filefor[0]]);
  //     formdata.append('driverid', this.selectedid);
  //     formdata.append('filefor', filefor[0]);
  //     this.dvrservice.uploadDriverDocs(formdata)
  //       .then(msg => {
  //         this.changeDocsLook(msg, filefor[1]);
  //         this.editSecondDocset = false;
  //         // this.selectedDocs.insurance = msg.file.fileurl;
  //         // this.selectedDocs.insuranceexp = msg.request.licenceexp;
  //         this.toastr.showtoast('success', msg.message);
  //       })
  //       .catch(msg => {
  //         this.toastr.showtoast('error', msg.message);
  //       });
  //     }, 10);
  //   }

  //   }
  submitDriverDoc(filefor, inde) {
    if (
      this.filedata[filefor] == undefined ||
      this.expiryDate[filefor] == undefined
    ) {
      this.toastr.showtoast(
        "warn",
        "Please choose both document and Date For " + filefor
      );
    } else {
      const formdata = new FormData();
      formdata.append("file", this.filedata[filefor]);
      formdata.append("licenceexp", this.expiryDate[filefor]);
      formdata.append("driverid", this.selectedid);
      formdata.append("filefor", filefor);
      this.dvrservice
        .uploadDriverDocs(formdata)
        .then((msg) => {
          this.changeDocsLook(msg, filefor);
          this.taxiThirdDocset[inde] = false;
          // this.selectedDocs.insurance = msg.file.fileurl;
          // this.selectedDocs.insuranceexp = msg.request.licenceexp;
          this.toastr.showtoast("success", msg.message);
        })
        .catch((msg) => {
          this.toastr.showtoast("error", msg.message);
        });
    }
  }

  submitDrvDocWithoutExp(filefor, inde) {
    if (this.filedata[filefor] === undefined) {
      this.toastr.showtoast("warn", "Please choose document For " + filefor);
    } else {
      const formdata = new FormData();
      formdata.append("file", this.filedata[filefor]);
      formdata.append("driverid", this.selectedid);
      formdata.append("filefor", filefor);
      this.dvrservice
        .uploadDriverDocs(formdata)
        .then((msg) => {
          this.changeDocsLook(msg, filefor);
          this.taxiFourthDocset[inde] = false;
          this.toastr.showtoast("success", msg.message);
        })
        .catch((msg) => {
          this.toastr.showtoast("error", msg.message);
        });
    }
  }

  submitTaxiDocWithoutExp(filefor, inde) {
    if (this.taxiFiledata[filefor] === undefined) {
      this.toastr.showtoast(
        "warn",
        "Please choose document For Taxi Registration Certificate (RC) "
      );
      // this.toastr.showtoast('warn', 'Please choose document For ' + filefor);
    } else {
      const formdata = new FormData();
      formdata.append("file", this.taxiFiledata[filefor]);
      formdata.append("driverid", this.selectedid);
      formdata.append("makeid", this.singleTaxiId);
      formdata.append("filefor", filefor);
      this.dvrservice
        .uploadDriverTaxiDocs(formdata)
        .then((msg) => {
          this.singleTaxi = msg.drivertaxis;
          this.changeTaxiDocsLook(msg, filefor);
          this.taxiSeventhDocset[inde] = false;
          this.toastr.showtoast("success", msg.message);
        })
        .catch((msg) => {
          this.toastr.showtoast("error", msg.message);
        });
    }
  }

  multipleTaxiFileEvent(e) {
    e.target.name = e.target.name === "insurance" ? "Insurance" : e.target.name;
    this.multipleTaxiFileData[e.target.name] = e.target.files[0];
  }

  multipleTaxiLogDate(msg) {
    msg.input.name =
      msg.input.name === "insurance" ? "Insurance" : msg.input.name;
    this.multipleTaxiExpiryDate[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      "dd-MM-yyyy"
    );
  }

  submitMultipleDriverTaxiDoc(filefor, inde) {
    let filefor1 = filefor[0];
    const filefor2 = filefor[1];
    filefor1 = filefor1 === "insurance" ? "Insurance" : filefor1;
    if (
      this.multipleTaxiFileData[filefor1] === undefined ||
      this.multipleTaxiFileData[filefor2] === undefined ||
      this.multipleTaxiExpiryDate[filefor1] === undefined
    ) {
      this.toastr.showtoast(
        "warn",
        "Please Choose both Images and Date For " + filefor1
      );
    } else {
      const formdata = new FormData();
      formdata.append("file", this.multipleTaxiFileData[filefor1]);
      formdata.append("expDate", this.multipleTaxiExpiryDate[filefor1]);
      formdata.append("driverid", this.selectedid);
      formdata.append("makeid", this.singleTaxiId);
      formdata.append("filefor", filefor1);
      this.dvrservice.uploadDriverTaxiDocs(formdata).then((msg) => {
        this.singleTaxi = msg.drivertaxis;
        this.changeTaxiDocsLook(msg, filefor);
        // this.toastr.showtoast('success', msg.message);
      });
      setTimeout(() => {
        const formdata2 = new FormData();
        formdata2.append("file", this.multipleTaxiFileData[filefor2]);
        formdata.append("expDate", this.multipleTaxiExpiryDate[filefor1]);
        formdata2.append("driverid", this.selectedid);
        formdata2.append("makeid", this.singleTaxiId);
        formdata2.append("filefor", filefor2);
        this.dvrservice
          .uploadDriverTaxiDocs(formdata2)
          .then((msg) => {
            this.singleTaxi = msg.drivertaxis;
            this.changeTaxiDocsLook(msg, filefor);
            this.toastr.showtoast("success", msg.message);
            this.taxiFifthDocset[inde] = false;
          })
          .catch((res) => {
            this.toastr.showtoast("error", res.message);
          });
      }, 10);
    }
  }

  submitTaxiDocManually(filefor, ino) {
    let filefor1 = filefor[0];
    const filefor2 = filefor[1];
    filefor1 = filefor1 === "insurance" ? "Insurance" : filefor1;
    if (
      this.taxiDocAddManually[filefor1] === undefined ||
      this.taxiDocAddExpiryManually[filefor2] === undefined
    ) {
      this.toastr.showtoast(
        "warn",
        "Please Choose both Image and Date For Fitness Certificate"
      );
      // this.toastr.showtoast('warn', 'Please Choose both Image and Date For ' + filefor1);
    } else {
      const formdata = new FormData();
      formdata.append("file", this.taxiDocAddManually[filefor1]);
      formdata.append("expDate", this.taxiDocAddExpiryManually[filefor2]);
      formdata.append("driverid", this.selectedid);
      formdata.append("makeid", this.singleTaxiId);
      formdata.append("filefor", filefor1);
      this.dvrservice
        .uploadDriverTaxiDocs(formdata)
        .then((msg) => {
          this.singleTaxi = msg.drivertaxis;
          this.changeTaxiDocsLookManually(msg, filefor1);
          this.changeTaxiDocsExpiryLookManually(msg, filefor2);
          this.toastr.showtoast("success", msg.message);
          this.taxiEighthDocset[ino] = false;
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  changeTaxiDocsLookManually(msg, filefor) {
    filefor = filefor === "Insurance" ? "insurance" : filefor;
    this.singleTaxi[filefor] = msg.file.path;
  }

  changeTaxiDocsExpiryLookManually(msg, filefor) {
    this.singleTaxi[filefor] = moment(
      msg.drivertaxis[filefor],
      "DD-MM-YYYY"
    ).format("DD-MM-YYYY");
  }

  uploadedFileName: any;
  uploadedFileName1: any;
  vehicleImage: any;
  vehicleImageBack: any;

  vehiclePicUpload(e) {
    this.vehicleImage = "";
    this.vehicleImage = e.target.files[0];
    if (this.vehicleImage) {
      const formData = new FormData();
      formData.append("file", this.vehicleImage);
      formData.append("filefor", "image");
      formData.append("driverid", this.selectedid);
      formData.append("makeid", this.singleTaxiId);
      this.dvrservice
        .uploadDriverTaxiDocs(formData)
        .then((res) => {
          this.toastr.showtoast("success", res.message);
          this.uploadedFileName = res["drivertaxis"].image;
          this.vehicleImage = "";
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  vehiclePicUpload1(e) {
    this.vehicleImageBack = "";
    this.vehicleImageBack = e.target.files[0];
    if (this.vehicleImageBack) {
      const formData = new FormData();
      formData.append("file", this.vehicleImageBack);
      formData.append("filefor", "imageBack");
      formData.append("driverid", this.selectedid);
      formData.append("makeid", this.singleTaxiId);
      this.dvrservice
        .uploadDriverTaxiDocs(formData)
        .then((res) => {
          this.toastr.showtoast("success", res.message);
          this.uploadedFileName1 = res["drivertaxis"].imageBack;
          this.vehicleImageBack = "";
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  UpdateWallet(data) {
    const info = {
      walletType: data,
      driverId: this.selectedid,
    };
    this.dvrservice
      .UpdateWallet(info)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  taxiFileEvent(e) {
    //console.log(e.target.files[0]);
    e.target.name = e.target.name === "insurance" ? "Insurance" : e.target.name;
    this.taxiFiledata[e.target.name] = e.target.files[0];
  }

  taxiLogDate(msg) {
    //console.log(msg);
    //this.expiryDate = msg.target.value;
    msg.input.name =
      msg.input.name === "insurance" ? "Insurance" : msg.input.name;
    this.taxiExpiryDate[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      "dd-MM-yyyy"
    );
  }

  submitDriverTaxiDoc(filefor, ino) {
    filefor = filefor === "insurance" ? "Insurance" : filefor;
    if (
      this.taxiFiledata[filefor] === undefined ||
      this.taxiExpiryDate[filefor] === undefined
    ) {
      this.toastr.showtoast(
        "warn",
        "Please choose both document and Date For " + filefor
      );
    } else {
      const formdata = new FormData();
      formdata.append("file", this.taxiFiledata[filefor]);
      formdata.append("expDate", this.taxiExpiryDate[filefor]);
      formdata.append("driverid", this.selectedid);
      formdata.append("makeid", this.singleTaxiId);
      formdata.append("filefor", filefor);
      this.dvrservice
        .uploadDriverTaxiDocs(formdata)
        .then((msg) => {
          this.changeTaxiDocsLook(msg, filefor);
          this.toastr.showtoast("success", msg.message);
          this.taxiSecondDocset[ino] = false;
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  /*   changelook(msg, filefor) {
      switch (filefor) {
        case "licence":
          this.selectedDocs.licence = msg.file.path;
          this.selectedDocs.licenceexp = moment(msg.request.licenceexp, 'DD-MM-YYYY').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
          break;
        case "insurance":
          this.selectedDocs.insurance = msg.file.path;
          this.selectedDocs.insuranceexp = moment(msg.request.licenceexp, 'DD-MM-YYYY').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
          break;
        case "passing":
          this.selectedDocs.passing = msg.file.path;
          this.selectedDocs.passingexp = moment(msg.request.licenceexp, 'DD-MM-YYYY').format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
          break;
        case "registration":
          this.singleTaxi.registration = msg.file.path;
          this.singleTaxi.registrationexpdate = msg.drivertaxis.registrationexpdate;
          break;
        case "permit":
          this.singleTaxi.permit = msg.file.path;
          this.singleTaxi.permitexpdate = msg.drivertaxis.permitexpdate;
          break;
        case "Insurance":
          this.singleTaxi.insurance = msg.file.path;
          this.singleTaxi.insuranceexpdate = msg.drivertaxis.insuranceexpdate;
          break;
      }
    } */

  changeDocsLook(msg, filefor) {
    this.selectedDocs[filefor] = msg.file.path;
    this.selectedDocs[filefor + "exp"] = moment(
      msg.request.licenceexp,
      "DD-MM-YYYY"
    ).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  }

  changeTaxiDocsLook(msg, filefor) {
    filefor = filefor === "Insurance" ? "insurance" : filefor;
    this.singleTaxi[filefor] = msg.file.path;
    this.singleTaxi[filefor + "expdate"] = moment(
      msg.drivertaxis[filefor + "expdate"],
      "DD-MM-YYYY"
    ).format("DD-MM-YYYY");
  }

  toggle() {
    this.list2 = !this.list2;
  }

  SetVehicleType(data: any): void {
    if (!data) {
      return;
    }

    const selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    this.singleTaxi.vehicletype = selectElementText;

    const selectElementId =
      event.target["options"][event.target["options"].selectedIndex].value;

    if (selectElementId > 0 || selectElementId !== undefined) {
      this.singleTaxi.share = true;
      this.singleTaxi.noofshare = selectElementId;
    }

    if (selectElementId === "undefined") {
      this.singleTaxi.share = false;
      this.singleTaxi.noofshare = 0;
    }
  }

  cngDriverAccepted(val) {
    if (val === "Accepted") {
      this.driverAccepted = true;
      this.selectedDocsStatus = "Accepted";
    } else {
      this.driverAccepted = false;
      this.selectedDocsStatus = "Approve";
    }
  }

  taxiLabels = documentSettings.driverTaxiLabels;
  showTaxiLabel = documentSettings.setDriverTaxiLabel;
  filterLab = documentSettings.driverTaxiLabels[0];
  otherList: any = [];

  convertToArrayObj(data) {
    data.forEach((el, index) => {
      this.otherList.push({ label: el, value: "others" + (index + 1) });
    });
  }

  public get half(): number {
    return Math.ceil(this.otherList.length / 2);
  }

  changeDateFormat(data) {
    if (data !== undefined && data !== null && data !== "") {
      return moment(data, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format("DD-MM-YYYY");
    } else {
      return "";
    }
  }

  makeDetails(taxi): any {
    let Tcolor; //=taxi.color;
    console.log(taxi);
    this.singleTaxi = taxi;
    this.singleTaxi.insuranceexpdate = this.changeDateFormat(
      taxi.insuranceexpdate
    );
    this.singleTaxi.permitexpdate = this.changeDateFormat(taxi.permitexpdate);
    this.singleTaxi.registrationexpdate = this.changeDateFormat(
      taxi.registrationexpdate
    );
    for (const te of this.colorary) {
      if (taxi.color === te.name) {
        Tcolor = te.id;
        this.singleTaxi.color = te.id;
      }
    }
    this.toggle();
    for (const ty of this.yearary) {
      if (this.singleTaxi.year === ty.name) {
        this.Tyear = ty.name;
      }
    }
    for (const tet of this.makeary) {
      if (this.singleTaxi.makename === tet.make) {
        this.Tmake = tet.make;
        this.modelary = tet.model;
      }
    }
    this.singleTaxiId = taxi._id;
    this.uploadedFileName = taxi.image;
    this.uploadedFileName1 = taxi.imageBack;
    this.cngDriverTaxiAccepted(taxi.taxistatus);
  }

  cngDriverTaxiAccepted(val) {
    if (val == "active") {
      this.driverTaxiAccepted = true;
      this.selectedTaxiDocsStatus = "Accepted";
    } else {
      this.driverTaxiAccepted = false;
      this.selectedTaxiDocsStatus = "Approve";
    }
  }

  approveDriver(dvrid): any {
    const formdata = {
      driverid: dvrid,
      status: "Accepted",
    };
    this.dvrservice
      .driverProofStatus(formdata)
      .then((msg) => {
        this.cngDriverAccepted("Accepted");
        this.toastr.showtoast("success", msg.message);
      })
      .catch((err) => {
        this.toastr.showtoast("error", err.message);
      });
  }

  // rejectDvr(id): any {
  //   let input = {
  //     driverid: id,
  //     status: 'pending'
  //   }
  //   this.dvrservice.rejectDriver(input)
  //     .then(res => {
  //       this.cngDriverAccepted('pending');
  //       this.toastr.showtoast("success", res.message);
  //     })
  //     .catch(err => {
  //       this.toastr.showtoast("error", err.message)
  //     })
  // }

  //Need to update result taxi details
  approveDriverTaxi(taxiid, dvrid): any {
    const formdata = {
      makeid: taxiid,
      driverid: dvrid,
      taxistatus: "active",
    };
    this.dvrservice
      .drivertaxistatus(formdata)
      .then((msg) => {
        this.cngDriverTaxiAccepted("active");
        this.toastr.showtoast("success", msg.message);
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  rejectTaxi(taxiid, dvrid): any {
    const formdata = {
      makeid: taxiid,
      driverid: dvrid,
      taxistatus: "inactive",
    };
    this.dvrservice
      .drivertaxidisable(formdata)
      .then((msg) => {
        this.cngDriverTaxiAccepted("inactive");
        this.toastr.showtoast("success", msg.message);
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  updateRecord(inputs: any): void {
    console.log(inputs);
    if (!inputs) {
      return;
    }
    if (inputs.scIds.length <= 0 && this.showservicecity === true) {
      this.toastr.showtoast("warn", "Enter Service Available City");
    } else {
      let scIds = [];
      scIds = this.CommonSvc.convertionOfServiceId(inputs.scIds);
      (inputs.scId = scIds[0].scId), (inputs.scity = scIds[0].name);

      // if (inputs.DOB !== undefined || inputs.DOB !==" Invalid date") {
      //   inputs.DOB = moment(inputs.DOB).format('YYYY-MM-DD');
      // } else inputs.DOB = null;
      // console.log(typeof inputs.DOB)
      if (
        inputs.DOB == "Invalid date" ||
        inputs.DOB == null ||
        inputs.DOB == undefined
      ) {
        inputs.DOB = null;
        console.log(inputs.DOB);
      } else inputs.DOB = this.datePipe.transform(inputs.DOB, "yyyy-MM-dd");

      this.dvrservice.updateDriverData(inputs).then((res) => {
        this.toastr.showtoast("success", res.message);
        this.SetDocsDetails(res.todo);
        this.goBack();
      });
    }
  }

  updateBankDet(inputs: any): void {
    if (!inputs) {
      return;
    }
    inputs._id = this.selectedid;
    inputs.addDataFrom = "admin";

    this.dvrservice
      .addDriverBankDetails(inputs)
      .then((msg) => {
        this.toastr.showtoast("success", msg.message);
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
  }

  // deleteRecord(data: any): void {
  //     this.dvrservice.deleteDriverData(data)
  //       .then(res => {
  //         this.toastr.showtoast("success", res.message);
  //         this.goBack();
  //       })
  //       .catch(res => {
  //         this.toastr.showtoast('error',res.message);
  //       })
  // }

  updateTaxiRecord(singleTaxi) {
    singleTaxi.image =
      this.uploadedFileName !== undefined ? this.uploadedFileName : "";
    this.dvrservice
      .editUploadDriverDocs(singleTaxi)
      .then((msg) => {
        this.toastr.showtoast("success", msg.message);
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  showselected(event) {
    // console.log(event.data);
  }

  selected: any;
  onUserRowSelect(event) {
    // console.log('user row select: ', event);
    this.selected = event.selected;
    // console.log('selected list: ', this.selected);
  }

  applyBulkAction(val): void {
    if (val) {
      if (window.confirm("Are you sure you want to Apply this Action ?")) {
        // console.log(val);
      }
    }
  }

  routetoAddTaxi(): void {
    this.router.navigate([
      "pages/drivertaxi/add",
      {
        dvrid: this.selectedid,
        cmpid: this.selectedcid,
        driverName: this.driverName,
      },
    ]);
  }

  deleteDvr(id): void {
    if (window.confirm("Are you sure want to Inactivate this Driver?")) {
      this.dvrservice
        .deleteDriverData(id)
        .then((res) => {
          this.toastr.showtoast("success", res.message);
          this.goBack();
        })
        .catch((res) => {
          this.toastr.showtoast("error", res.message);
        });
    } else {
    }
  }

  activeDriver(id): void {
    const body = {};
    this.dvrservice
      .activateDriverData(id, body)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
        this.goBack();
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  /**
   * DeleteDvrTaxi
   * @param selectedid DriverID
   * @param singleTaxi
   */
  deleteDvrTaxi(selectedid, singleTaxi): void {
    this.dvrservice
      .deleteDriverTaxiData(selectedid, singleTaxi._id)
      .then((res) => {
        this.toastr.showtoast("success", res.message);
        this.selectedTaxis = res["drivertaxis"];
        this.toggle();
      })
      .catch((res) => {
        this.toastr.showtoast("error", res.message);
      });
  }

  SerachDriver(data): void {
    this.dvrservice.getDriversList(data).then((msg) => {
      this.source = msg;
    });
  }

  selectedCountry(option: commonArrayDataList) {
    this.selectedDocs.state = "";
    this.selectedDocs.city = "";
    this.selectedDocs.cntyname = option.label;
    // this.getStateofSelectedCountry(option.value);
    this.showStateDropDown();
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.getStateofSelectedCountry(option.value);
  }

  deSelectedCountry(option: commonArrayDataList) {
    this.selectedDocs.cnty = "";
    this.selectedDocs.state = "";
    this.selectedDocs.city = "";
    this.selectedDocs.cntyname = "";
    this.selectedDocs.statename = "";
    this.selectedDocs.cityname = "";
    this.showStateDropDown();
  }

  showStateDropDown() {
    if (
      typeof this.selectedDocs.countryId !== "undefined" &&
      this.selectedDocs.countryId !== ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  // STATES

  selectedState(option: commonArrayDataList) {
    this.getCityofSelectedState(option.value);
    this.selectedDocs.statename = option.label;
    this.showCityDropDown();
    this.CommonSvc.doAddFormControlNgSelectClass();
  }

  deSelectedState(option: commonArrayDataList) {
    this.selectedDocs.state = "";
    this.selectedDocs.city = "";
    this.selectedDocs.cityname = "";
    this.selectedDocs.statename = "";
    this.showCityDropDown();
  }

  showCityDropDown() {
    if (
      typeof this.selectedDocs.countryId !== "undefined" &&
      this.selectedDocs.countryId !== "" &&
      typeof this.selectedDocs.stateId !== "undefined" &&
      this.selectedDocs.stateId !== ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  // CITIES

  selectedCity(option: commonArrayDataList) {
    this.selectedDocs.cityname = option.label;
  }

  deSelectedCity(option: commonArrayDataList) {
    this.selectedDocs.city = "";
    this.selectedDocs.cityname = "";
  }

  getCityofSelectedState(id) {
    this.CommonSvc.getCitiesSelected(id)
      .then((response) => {
        try {
          this.cities = response[0]["cities"];
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
          errorMessage,
          response
        );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  TaxiFileEventManually(e) {
    e.target.name = e.target.name === "insurance" ? "Insurance" : e.target.name;
    this.taxiDocAddManually[e.target.name] = e.target.files[0];
  }

  TaxiLogDateManually(msg) {
    msg.input.name =
      msg.input.name === "insurance" ? "Insurance" : msg.input.name;
    this.taxiDocAddExpiryManually[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      "dd-MM-yyyy"
    );
  }

  getStateofSelectedCountry(id) {
    this.CommonSvc.getStatesSelected(id)
      .then((response) => {
        try {
          this.states = response[0]["states"];
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
          errorMessage,
          response
        );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  Status(id) {
    const formdata = {
      driverid: id,
      status: "pending",
    };
    this.dvrservice
      .Statuspending(formdata)
      .then((res) => {
        this.cngDriverAccepted("pending");
        this.toastr.showtoast("success", res.message);
      })
      .catch((err) => {
        this.toastr.showtoast("error", err.message);
      });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { size: "lg" });
  }

  routetoCredit(): void {
    this.router.navigate([
      "pages/tables/package/drivercredits",
      { dvrid: this.selectedid, code: this.selectedDocs.code },
    ]);
  }

  submitted(d) {
    d("Cross click");
  }

  closed(d) {
    d("Cross click");
  }

  passwordchange() {
    // console.log(this.diver)

    this.dvrservice.changepassword(this.diver).then((msg) => {
      //console.log(msg);

      this.toastr.showtoast("success", msg.message);
    });
  }
  export(event) {
    const exportFor = event.target.value;

    console.log(this.driverDoc.servicecity);
    if (
      this.driverDoc.servicecity == "all" ||
      this.driverDoc.servicecity == undefined
    ) {
      this._http
        .get(
          AppSettings.API_ENDPOINT +
          "driverOnline?" +
          "requestFrom=" +
          "without_limit"
        )
        .toPromise()
        .then((res: any) => {
          // console.log(res,"res")
          const data = res;
          this.exporttoCSV(exportFor, data);
        })
        .catch((res) => {
          // console.log(res.message)
          this.toastr.showtoast("error", res.message);
        });
    } else {
      var query =
        AppSettings.API_ENDPOINT +
        "driverOnline?scity_like=" +
        this.driverDoc.servicecity;
      this._http
        .get(query + "&" + "requestFrom=" + "without_limit")
        .toPromise()
        .then((res: any) => {
          // console.log(res,"res")
          const data = res;
          this.exporttoCSV(exportFor, data);
        })
        .catch((res) => {
          // console.log(res.message)
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  reportname = "Driver Details";
  options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalseparator: ".",
    headers: [
      "Code",
      "Driver Name",
      "City",
      "Vehicle type",
      "Email",
      "Phone",
      "Company",
      "Reference Code",
      "Status",
      "Account Status",
      "Last Updated Time",
    ],
    showTitle: true,
    title: "Driver Details",
    useBom: true,
    removeNewLines: false,
    keys: [
      "code",
      "fname",
      "cityname",
      "vehicletype",
      "email",
      "phone",
      "cmpy",
      "referenceCode",
      "status",
      "softdel",
      "lastUpdate",
    ],
  };

  exporttoCSV(exportFor, data) {
    console.log(data);
    for (const d of data) {
      let tempAr: any = {};
      tempAr = d.taxis;
      if (tempAr.length == 1) {
        for (const tn of tempAr) {
          if (tn.driver == d._id) {
            const tw = tn.model;
            d.vehicletype = tw + " - " + d.curService;
          }
        }
      } else if (tempAr.length > 1) {
        let tw2 = "";
        for (const tn of tempAr) {
          if (tn.driver == d._id) {
            tw2 = tw2 + tn.model + ",";
            d.vehicletype = tw2;
          }
        }
      }
    }

    for (let i = 0; i < data.length; i++) {
      data[i].status = data[i].status[0].docs;
      // data[i].cmpy = data[i].company[0].name;
    }

    // let title;
    // if (from !== '' && to !== '') {
    //   title = `Trip Payments From ${from} to ${to} `;
    // } else if (from !== '' && to === '') {
    //   title = `Trip Payments From ${from}`;
    // } else if (from === '' && to !== '') {
    //   title = `Trip Payments Upto ${to} `;
    // }
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
  excelFileName: string = "Driver Details.xlsx";
  blobType: string =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  cols = [
    "Code",
    "Driver Name",
    "City",
    "Vehicle type",
    "Email",
    "Phone",
    "Company",
    "Reference Code",
    "Status",
    "Account Status",
    "Last Updated Time",
  ];

  exportToExcel(data) {
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
      { key: "code", width: 10 },
      { key: "fname", width: 13 },
      { key: "cityname", width: 10 },
      { key: "vehicletype", width: 25 },
      { key: "email", width: 25 },
      { key: "phone", width: 12 },
      { key: "cmpy", width: 12 },
      { key: "referenceCode", width: 12 },
      { key: "status", width: 25 },
      { key: "softdel", width: 14 },
      { key: "lastUpdate", width: 14 },
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
