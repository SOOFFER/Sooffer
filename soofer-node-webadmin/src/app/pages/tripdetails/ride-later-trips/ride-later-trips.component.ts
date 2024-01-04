import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../tables/table.service';
import { Location } from '@angular/common';
import { AppSettings } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Angular2Csv } from 'angular2-csv';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'ngx-ride-later-trips',
  providers: [TableService, CommonService],
  templateUrl: './ride-later-trips.component.html',
  styleUrls: ['./ride-later-trips.component.scss']
})
export class RideLaterTripsComponent implements OnInit {

  trip: string = 'triplist';
  title: string = 'Ride Later Bookings';
  initial: any = 0; // 0 for list, 1 for edit
  list: any;
  dateObj: any;
  brobj;
  fields: any;
  tripdetailsId: string;

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Trip Type', 'Trip No', 'Date', 'Rider', 'Fare', 'Vehicle Type', 'Status', 'Payment Via'],
    showTitle: true,
    title: 'Ride Later Bookings Trip Report',
    useBom: true,
    removeNewLines: false,
    keys: ['triptype', 'tripno', 'date', 'rid', 'fare', 'vehicle', 'status', 'Payment'],
  };
  reportname = 'Ride Later Bookings Trip_Details' + Date();
  settings = {
    // actions: false,
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      triptype: {
        title: 'Trip Type',
      },
      tripno: {
        title: 'Trip No',
        filter: false,

      },
      date: {
        title: 'Date',
        filter: false,

      },
      rid: {
        title: 'Rider',
      },
      fare: {
        title: 'Fare',
        filter: false,

      },
      vehicle: {
        title: 'Vehicle Type',
      },
      status: {
        title: 'Status',
        filter: false,

      },
      csp: {
        title: 'Via',
        filter: false,

        valuePrepareFunction: (csp) => {
          return csp['via'];
        }
      },
    },
  };

  source: ServerDataSource;
  data: any;

  constructor(public http: HttpClient,
    private service: TableService,
    private router: Router,
    private datePipe: DatePipe,
    private toastr: ButtonToasterService,
    private location: Location,
    private CommonSvc: CommonService) {
    this.dateFilter();
  }

  dateFilter() {
    const today = new Date(Date.now());
    const month = today.getMonth(), year = today.getFullYear();
    const FirstDay = new Date(year, month, 1);
    const LastDay = new Date(year, month + 1, 0);
    this.list = {};
    this.dateObj = {};
    // this.list = {
    //   fromDate: FirstDay,
    //   toDate: today
    // };
    // this.dateObj = {
    //   fromDate: moment(new Date(FirstDay), 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    //   toDate: moment(new Date(today), 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    // };
    this.disp();
  }

  disp() {
    this.source = new ServerDataSource(this.http, {
      endPoint: AppSettings.API_ENDPOINT + 'scheduletrips'
    });
  }

  filterRes() {
    if (this.dateObj['fromDate'] === undefined || this.dateObj['toDate'] === undefined) {
      this.toastr.showtoast('warn', 'Select Both From Date and To Date');
    } else {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'scheduletrips?tripFDT_gte=' + fromDate + '&tripFDT_lte=' + toDate });
    }
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = moment(new Date(msg.input.value), 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    // this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
  }

  ExportAsCSV() {
    this.brobj = [];
    this.http.get(AppSettings.API_ENDPOINT + 'scheduletrips?_page=1&_limit=1000')
      .toPromise()
      .then(res => {
        this.data = res;
        this.data.forEach(element => {
          element.Payment = element.csp.via;
          this.brobj.push(element);
        });
        this.export(this.brobj);
      })
      .catch(err => {
        this.toastr.showtoast('error', err.message);
      });
  }

  export(data) {
    new Angular2Csv(data, this.reportname, this.options);
  }

  testHeader() {

  }

  /** Invoice Page */

  route(event) {
    this.initial = 1;
    this.tripdetailsId = event.data._id;
    this.fields = this.tripdetailsId;
  }

  goBack() {
    this.initial = 0;
  }

  getFields() {
    return this.fields;
  }

  ngOnInit(): void { }

}
