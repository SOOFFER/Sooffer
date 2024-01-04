import { Component, ViewChild } from '@angular/core';

import { CommonService } from '../../../common/common.service';
//import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass} from 'angular2/common';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { PackageService } from '../package.service';
import { AppSettings } from '../../../../app.config';
import { Http } from '@angular/http';
import { ServerDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Route } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import {SELECT_DIRECTIVES} from 'ng2-select';

@Component({
  providers: [PackageService, DatePipe],
  selector: 'ngx-form-inputs',
  styleUrls: ['./driverPack.component.scss'],
  // directives: [SELECT_DIRECTIVES, NgClass,CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: './driverPack.component.html',
})

export class DriverPackComponent {
  initial: number = 0;
  list: any = {};
  apiMessage: string;
  baseurl: string = AppSettings.BASEURL;
  driverAry: any[] = [];
  packAry: any[] = [];

  settings = {

    actions: {
      edit: false, //as an example
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      }, //as an example
      add: false, //as an example
      //custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }] 
    },

    pager: {
      display: true,
      perPage: 10,
    },

    columns: {
      driverName: {
        title: 'Driver',
      },
      packageName: {
        title: 'Package',
      },
      createdAt: {
        title: 'Purchase Date',
        valuePrepareFunction: (cell, row) => {
          return this.datePipe.transform(row.createdAt, 'd- MM- y');
        }
      },
    },
  };
  source: ServerDataSource;

  constructor(http: HttpClient,
    private packageSvc: PackageService,
    private routeT: ActivatedRoute,
    private datePipe: DatePipe,
    private toastr: ButtonToasterService,
  ) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'driverPackage' });
    this.packageSvc.GetDriverList()
      .then(res => {
        console.log(res);
        this.driverAry = res;
      });
    this.packageSvc.GetPackageList()
      .then(res => {
        console.log(res);
        this.packAry = res;
      });
    this.routeT.params.subscribe(params => {
      if (params['dvrid']) {
        this.list.driverId = params['dvrid'];
        this.initial = 1;
      }
    });

  }
  @ViewChild('dataForm1') form1: any;

  // routeClick(){
  //   // this.routeR.navigateByUrl('pages/drivertaxi/add');
  // }
  filedata: any;
  fileEvent(e) {
    this.filedata = e.target.files[0];
  }
  route(event) {
    this.list = event.data;
    console.log(this.list)

    this.initial = 2;
  }
  btnClick(num: number) {
    this.initial = num;
  }

  ngOnInit(): void {
  }

  getPakageDetail(data): void {
    if (!data) { return; }
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    // console.log(selectElementText);
    this.list.packageName = selectElementText;
  }
  getDriverDetail(data): void {
    if (!data) { return; }
    let selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    // console.log(selectElementText);
    this.list.driverName = selectElementText;
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) { return; }
    this.packageSvc.activatePackToDriver(inputs)
      .then(msg => {
        this.apiMessage = msg.message;
        this.toastr.showtoast("success", this.apiMessage);
        this.form1.reset();
      })
      .catch(msg => {
        this.apiMessage = msg.message; // handle unknow err
        this.toastr.showtoast("error", this.apiMessage);

      })
  }

}
