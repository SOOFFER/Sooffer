import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';

import { TableService } from '../table.service';

import { Http } from '@angular/http';
import { AppSettings, featuresSettings } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { ReviewsService } from '../../Reviews/Reviews.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, CommonService],
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})

export class DriverReviewTableComponent {
  serviceCityArray: any = [];
  showCity: boolean;
  Doc: any = {};

  selectedid: string;
  Promocode: any;
  selectedDocs: any;
  list: any = {};
  baseurl: string = AppSettings.BASEURL;
  apiMessage: string;
  clearMsg(): void {
    this.apiMessage = '';
  }
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-trash"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      tripno: {
        title: 'Trip No'
      },
      rid: {
        title: 'Rider',
      },
      dvr: {
        title: 'Driver',
      },
      'Rating': {
        title: 'Rating',
        valuePrepareFunction: (cell, row) => {
          if (row.riderfb) {
            return row.riderfb.rating;
          } else return '';
        }
      },
      'Comments': {
        title: 'Comments',
        valuePrepareFunction: (cell, row) => {
          if (row.riderfb) {
            return row.riderfb.cmts;
          } else return '';
        }
      },
      date: {
        title: 'Review Date',
      },
    },
  };

  source: ServerDataSource;

  constructor(private _http: HttpClient,
    private service: TableService,
    private toastr: ButtonToasterService,
    private CommonSvc: CommonService,
    private reviewservice: ReviewsService) {
    this.list = {};
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driverReview' });
    if (featuresSettings.isCityWise === true
      && featuresSettings.isServiceAvailable === true
      && localStorage.getItem('userType') === 'superadmin')
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
  }
  SerachForCity(data): void {
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity === 'undefined'  || data.servicecity=="all")
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driverReview' });
    else
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driverReview?scity_like=' + data.servicecity });
  }

  route(event) {
    this.deleteRecord(event.data._id);
  }

  deleteRecord(id: any): void {
    this.reviewservice.deleteDriverReview(id)
      .then(res => {
        this.apiMessage = res.message;
        this.toastr.showtoast('success', this.apiMessage);
      });
  }

  filterRes() {
    if (this.list['fromDate'] === undefined || this.list['toDate'] === undefined) {
      this.toastr.showtoast('warn', 'Select Both Filters');
    } else {
      const fromDate = this.list['fromDate'];
      const toDate = this.list['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'driverReview?Rating_gte=' + fromDate + '&Rating_lte=' + toDate });
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
