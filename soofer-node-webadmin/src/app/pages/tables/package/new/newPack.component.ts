import {Component, ViewChild, OnInit} from "@angular/core";

import {CommonService} from "../../../common/common.service";
//import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import {ButtonToasterService} from "../../../buttontoaster/buttontoaster.service";
import {AmazingTimePickerService} from "amazing-time-picker";
import {PackageService} from "../package.service";
import {AppSettings, featuresSettings, dropdown} from "../../../../app.config";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {Http} from "@angular/http";
import {ServerDataSource} from "ng2-smart-table";
import {DatePipe} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {LocalStorage} from "@ng-idle/core";
import {TableService} from "../../table.service";
//import {SELECT_DIRECTIVES} from 'ng2-select';

@Component({
  providers: [PackageService, DatePipe],
  selector: "ngx-form-inputs",
  styleUrls: ["./newPack.component.scss"],
  // directives: [SELECT_DIRECTIVES, NgClass,CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: "./newPack.component.html",
})
export class NewPackComponent implements OnInit {
  initial: number = 0;
  list: any = {};
  filtercity: any;
  emarr = [];
  ncityadmin = [];
  dropdownList;
  editadmin = [];
  selectedDoc: any = {};
  selectedId: any;
  pos: any = {};
  apiMessage: string;
  center: any;
  marker: any = {};
  navigationSubscription: any;
  baseurl: string = AppSettings.BASEURL;
  cityAry: any[] = [];
  i: number;
  packageType: any[] = featuresSettings.payPackageTypes;
  settings = {
    actions: {
      edit: false, //as an example
      delete: false,
      add: false, //as an example
      custom: [{name: "routeToAPage", title: `<i class="nb-edit"></i>`}],
    },

    pager: {
      display: true,
      perPage: 10,
    },

    columns: {
      name: {
        title: "Package Name",
      },
      type: {
        title: "Package Type",
      },
      amount: {
        title: "Package Amount",
      },
      credit: {
        title: "Package Credit",
        valuePrepareFunction: (cell, row) => {
          if (row.type === "commission" || row.type === "topup") {
            return row.credit;
          } else return "Not Applicable";
        },
      },
      PackageValidity: {
        title: "Package Validity (Number of Days)",
        valuePrepareFunction: (cell, row) => {
          if (row.type === "subscription") {
            return row.PackageValidity;
          } else return "Not Applicable";
        },
      },
    },
  };
  source: ServerDataSource;
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;
  showCity: boolean;
  ServiceCity: any;
  vehicleType: any = [];
  constructor(
    private commonservice: CommonService,
    private service: TableService,
    private http: HttpClient,
    private router: Router,
    private packageSvc: PackageService,
    private datePipe: DatePipe,
    private toastr: ButtonToasterService
  ) {
    this.source = new ServerDataSource(http, {
      endPoint: AppSettings.API_ENDPOINT + "payPackage",
    });

    this.commonservice.generalfunFor("AvailbleserviceCity").then((res) => {
      //console.log(res)
      this.filtercity = res;
      this.filtercity.forEach((el) => {
        // console.log(el)
        const gettingval = {scId: el.value, name: el.label};
        this.editadmin.push(gettingval);
        this.ncityadmin.push(el);
      });
    });

    if (
      featuresSettings.isCityWise == true &&
      featuresSettings.isServiceAvailable == true &&
      localStorage.getItem("userType") == "superadmin"
    )
      this.showCity = true;
    else this.showCity = false;
    this.service
      .allvehicletypes()
      .then((res) => {
        this.vehicleType = res;
        console.log(this.vehicleType, "   this.vehicleType ");
      })
      .catch((err) => {
        console.log(err);
      });
    this.service.getServiceCity().then((res) => {
      this.ServiceCity = res;
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initial = 0;
      }
    });

  }
  @ViewChild("dataForm1") form1: any;

  FilterRes(data) {
    if (data == "all")
      this.source = new ServerDataSource(this.http, {
        endPoint: AppSettings.API_ENDPOINT + "payPackage",
      });
    else
      this.source = new ServerDataSource(this.http, {
        endPoint:
          AppSettings.API_ENDPOINT + "payPackage?scIds.name_like=" + data,
      });
  }

  Addnewbutton() {
    this.list = {};
    if (localStorage.getItem("userType") == "citywiseadmin") {
      this.list.scIds = this.commonservice.dataforscids(this.editadmin);
    }
    this.dropdownList = this.commonservice.dataforscids(this.editadmin);
    this.initial = 1;
    //console.log(this.dataforscids(this.editadmin))
  }

  filedata: any;
  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  route(event) {
    // console.log(this.editadmin)
    if (localStorage.getItem("userType") == "citywiseadmin") {
      this.selectedDoc.scIds = this.commonservice.dataforscids(this.editadmin);
    }
    this.dropdownList = this.commonservice.dataforscids(this.editadmin);
    // console.log(this.dropdownList)
    this.selectedDoc = event.data;
    this.selectedDoc.scIds = event.data.scIds;
    this.selectedId = event.data._id;
    this.initial = 2;
  }

  btnClick(num: number) {
    this.list = {};
    this.selectedDoc = {};
    this.initial = num;
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) {
      return;
    }
    if (this.servicecity === false) {
      inputs.scIds = this.dropdownList;
    }
    inputs.scIds = this.commonservice.convertionOfServiceId(inputs.scIds);
    // console.log(inputs)
    this.packageSvc
      .createNewPack(inputs)
      .then((msg) => {
        // console.log(msg);
        const body = msg;
        //this.apiMessage = msg.message;
        this.toastr.showtoast("success", body.message);
        this.form1.reset();
        this.initial = 0;
      })
      .catch((msg) => {
        // console.log(msg);
        const body = msg;
        //this.apiMessage = msg.message; // handle unknow err
        this.toastr.showtoast("error", body.message);
      });
  }

  UpdateNewDoc(inputs: any): void {
    if (!inputs) {
      return;
    }
    if (this.servicecity === false) {
      inputs.scIds = this.dropdownList;
    }
    inputs.scIds = this.commonservice.convertionOfServiceId(inputs.scIds);
    this.packageSvc
      .UpdatePackage(inputs)
      .then((msg) => {
        const body = msg;
        // console.log(msg)
        this.toastr.showtoast("success", body.message);
        this.initial = 0;
      })
      .catch((msg) => {
        const body = msg;
        this.apiMessage = msg.message; // handle unknow err
        this.toastr.showtoast("error", body.message);
      });
  }

  DeleteDoc(id): void {
    if (window.confirm("Are you sure you want to delete?")) {
      this.packageSvc
        .DeletePackage(id)
        .then((res) => {
          const body = res;
          this.toastr.showtoast("success", body.message);
          this.initial = 0;
        })
        .catch((el) => {
          const body = el;
          this.toastr.showtoast("error", body.message);
        });
    }
  }

  ngOnInit(): void {
    this.dropdownList = this.ncityadmin;
  }
}
