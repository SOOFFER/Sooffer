import { Component, ViewChild } from '@angular/core';

import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';

import { PackageService } from './../package/package.service';
import { AppSettings } from '../../../app.config';

import { ServerDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { TableService } from '../table.service';
import { featuresSettings } from './../../../app.config';
interface commonArrayDataList {
    value: string;
    label: string;
    id: string;
    name: string;
}

@Component({
  providers: [PackageService, DatePipe],
  selector: "ngx-form-inputs",
  styleUrls: ["./rental.component.scss"],
  // directives: [SELECT_DIRECTIVES, NgClass,CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: "./rental.component.html",
})
export class RentalComponent {
  initial: number = 0;
  list: any = {};
  apiMessage: string;
  baseurl: string = AppSettings.BASEURL;
  driverAry: any[] = [];
  packAry: any[] = [];
  Doc: any = {};
  UpDoc: any = {};
  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false,
      custom: [
        {name: "routeToAPage", title: `<i class="nb-edit"></i>`},
        // { name: 'routeToFirstCity', title: `<i class="ion-arrow-down-b"></i>` },
        // { name: 'routeToAPage', title: `<i class="ion-arrow-left-b"></i>` },
      ],
    },

    pager: {
      display: true,
      perPage: 10,
    },

    columns: {
      Package_Name: {
        title: "Name",
      },
      Rental_Total_Price: {
        title: "Rental Total Price",
      },
      Rental_Miles: {
        title: "Rental Miles",
      },
      Rental_Hour: {
        title: "Rental Hour",
      },
      City: {
        title: "Rental Hour",
        valuePrepareFunction: (cell, row) => {
          return row.scIds[0].name;
        },
      },
      createdAt: {
        title: "Purchase Date",
        valuePrepareFunction: (cell, row) => {
          return this.datePipe.transform(row.createdAt, "d- MM- y");
        },
      },
    },
  };
  source: ServerDataSource;
  serviceCityArray: any = [];

  distanceUnit = featuresSettings.distanceUnit;
  constructor(
    http: HttpClient,

    private packageSvc: PackageService,

    private datePipe: DatePipe,
    private toastr: ButtonToasterService,
    private service: TableService
  ) {
    this.source = new ServerDataSource(http, {
      endPoint: AppSettings.API_ENDPOINT + "rental",
    });

    this.service.getServiceCity().then(res => {
      this.serviceCityArray = res;
    });
  }
  @ViewChild("dataForm1") form1: any;

  filedata: any;
  fileEvent(e) {
    this.filedata = e.target.files[0];
  }
  route(event) {
    this.UpDoc = event.data;
    this.UpDoc.servicecity = event.data.scIds.scId;
    this.UpDoc.scIds = {
      scId: event.data.scIds.scId,
      name: event.data.scIds.name,
    };
    this.initial = 2;
  }
  btnClick(num: number) {
    this.initial = num;
  }

  ngOnInit(): void {}
  editNameAndValue(data): void {
    if (!data) {
      return;
    }
    let selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    let selectElementValue =
      event.target["options"][event.target["options"].selectedIndex].value;
    // console.log(selectElementText);
    this.UpDoc.name = selectElementText;
    // this.UpDoc.scId = selectElementValue;
    this.UpDoc.scIds = {
      scId: selectElementValue,
      name: selectElementText,
    };
  }
  getNameAndValue(data): void {
    if (!data) {
      return;
    }
    let selectElementText =
      event.target["options"][event.target["options"].selectedIndex].text;
    let selectElementValue =
      event.target["options"][event.target["options"].selectedIndex].value;
    // console.log(selectElementText);
    this.Doc.name = selectElementText;
    this.Doc.scId = selectElementValue;
  }

  addRentalPackage(inputs: any): void {
    if (!inputs) {
      return;
    }
    inputs.scIds = {
      scId: inputs.scId,
      name: inputs.name,
    };
    this.packageSvc
      .activateRentalPackage(inputs)
      .then(msg => {
        console.log(msg);
        if (msg.success == true) {
          this.apiMessage = msg.message;
          this.toastr.showtoast("success", this.apiMessage);
          this.form1.reset();
        } else {
          this.apiMessage = msg.message;
          this.toastr.showtoast("warn", this.apiMessage);
          // this.form1.reset();
        }
      })
      .catch(msg => {
        this.apiMessage = msg.message; // handle unknow err
        this.toastr.showtoast("error", this.apiMessage);
      });
  }
  updateRentalPackage(inputs: any): void {
    if (!inputs) {
      return;
    }

    this.packageSvc
      .updateRentalPackage(inputs)
      .then(msg => {
        console.log(msg);
        if (msg.success == true) {
          this.apiMessage = msg.message;
          this.toastr.showtoast("success", this.apiMessage);

          // this.form1.reset();
        } else {
          this.apiMessage = msg.message;
          this.toastr.showtoast("warn", this.apiMessage);
          // this.form1.reset();
        }
      })
      .catch(msg => {
        this.apiMessage = msg.message; // handle unknow err
        this.toastr.showtoast("error", this.apiMessage);
      });
  }
  deleteRentalPackage(data) {
    this.packageSvc
      .deleteRentalPackage(data._id)
      .then(msg => {
        console.log(msg);
        if (msg.success == true) {
          this.apiMessage = msg.message;
          this.toastr.showtoast("success", this.apiMessage);
          // this.form1.reset();
          this.btnClick(0);
        } else {
          this.apiMessage = msg.message;
          this.toastr.showtoast("warn", this.apiMessage);
          // this.form1.reset();
        }
      })
      .catch(msg => {
        this.apiMessage = msg.message; // handle unknow err
        this.toastr.showtoast("error", this.apiMessage);
      });
  }
}
