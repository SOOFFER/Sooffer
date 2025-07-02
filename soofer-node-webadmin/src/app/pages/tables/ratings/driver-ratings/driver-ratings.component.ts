import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../../table.service';
import { AppSettings, featuresSettings } from '../../../../app.config';
import { CommonService } from '../../../common/common.service';
import { ReviewsService } from '../../../Reviews/Reviews.service';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-driver-ratings',
  providers: [TableService, CommonService],
  templateUrl: './driver-ratings.component.html',
})

export class DriverRatingsComponent implements OnInit {

  ngOnInit(): void { }
  baseurl: string = AppSettings.BASEURL;
  title: string = 'Driver Ratings';
  list: any;
  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      fname: {
        title: 'Driver',
      },
      code: {
        title: 'Code'
      },
      phone: {
        title: 'Phone'
      },
      rating: {
        title: 'Ratings',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.rating) {
            return row.rating.rating;
          } else return '';
        }
      },
    },
  };

  source: ServerDataSource;

  constructor(private _http: HttpClient,
    private service: TableService,
    private toastr: ButtonToasterService,
    private CommonSvc: CommonService,
    private reviewservice: ReviewsService) {
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driverRating' });
    this.list = {};
  }

  filterRes() {
    if (this.list['fromDate'] === undefined || this.list['toDate'] === undefined) {
      this.toastr.showtoast('warn', 'Select Both Filters');
    } else {
      const fromDate = this.list['fromDate'];
      const toDate = this.list['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driverRating?Rating_gte=' + fromDate + '&Rating_lte=' + toDate });
    }
  }

  changeInput(e) {
    let value = e.target.value;
    if (value <= 0) {
      value = 0;
    }
    const ObjectName = e.target.name;
    this.list[ObjectName] = value;
  }

}
