import { Component, OnInit, ViewChild } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { AppSettings, featuresSettings } from '../../../app.config';
import { PackageService } from '../package/package.service';
import { ActivatedRoute } from '@angular/router';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { TableService } from '../table.service';
import { HttpClient } from '@angular/common/http';
import { DatepickerOptions } from 'ng2-datepicker';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Location } from "@angular/common";


@Component({
  selector: 'ngx-driverSoftDelete',
  providers: [PackageService],
  templateUrl: './driverSoftDelete.component.html',
  styleUrls: ['./driverSoftDelete.component.scss']
})
export class DriversoftdeleteComponent {

  trxId;
  source;
  verify;
  initial: string = "list";
  admintoken: number;
  list: any = {};
  defaultName: any = "";
  providerId: any = "";
  constructor(private _http: HttpClient, private routeT: ActivatedRoute, private router: Router,
    private toastr: ButtonToasterService, private location: Location, private act: ActivatedRoute,
    private Service: TableService, private packService: PackageService) {
    this.routeT.params.subscribe(el => {
      if (el['dvrid']) {
        this.list.driverId = el['dvrid'];
      }
    })
  }

  softDel(inputs) {
    inputs.softReject = true;
    this.Service
      .DeleteDriver(inputs)
      .then(res => {
        const message =
          typeof res.message === 'string'
            ? res.message
            : Object.values(res.message)[0];

        this.toastr.showtoast("success", res.message);
        if (res.success) {
          this.location.back();
        }
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }

}

