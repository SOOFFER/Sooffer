import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { ReportService } from '../../../common/report.service';
import { AppSettings } from '../../../../app.config';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, ReportService, DatePipe],
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})

export class HotelPaymentComponent {

  title: string = 'Hotel Payments';
  dateObj: any;
  list: any;
  initial: string = 'showList';

  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      columnTitle: 'View Payment Details',
      class: 'action-column',
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    columns: {
      hotelname: {
        title: 'Hotel',
      },
      // code: {
      //   title: 'Driver Code',
      //   // valuePrepareFunction: (cell, row) => { return row.code[0] }
      // },
      count: {
        title: 'Total No of Trips',
      },
      commision: {
        title: 'Commision',
        filter: false
      },
      amttohotel: {
        title: 'Hotel Commision',
        filter: false
      },
      amttopay: {
        title: 'Total Trip Amount',
        filter: false
      },

    },
  };

  reportname = 'Hotel Payments';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Driver', 'Code', 'Total Trip Amount', 'Total No of Trips'],
    showTitle: true,
    title: 'Driver Payments',
    useBom: true,
    removeNewLines: false,
    keys: ['dvrfname', 'code', 'amttodriver', 'count'],

  };
  source: ServerDataSource;
  trxSource: ServerDataSource;

  constructor(private _http: HttpClient,
    private service: TableService,
    private datePipe: DatePipe,
    private toastr: ButtonToasterService,
    private RepSvc: ReportService) {
    this.dateObj = {};
    this.list = {};
    const fromDate = new Date(Date.now());
    let month = fromDate.getMonth(),
      year = fromDate.getFullYear();
    let FirstDay = new Date(year, month, 1);
    let LastDay = new Date(year, month + 1, 0);
    this.list.fromDate = FirstDay;
    this.list.toDate = LastDay;
    console.log(this.list.toDate);
    this.loadTable();

  }

  loadTable() {
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'hotelPayReport?createdAt_gte=' + this.list.fromDate + '&createdAt_lte=' + this.list.toDate });
  }

  filterRes() {
    if (this.dateObj['fromDate'] == undefined || this.dateObj['toDate'] == undefined) {
      this.toastr.showtoast('warn', 'Select Both From Date and To Date');
    } else {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'hotelPayReport?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate });
    }
  }

  export() {
    let fromDate = '';
    let toDate = '';
    if (this.dateObj['fromDate'] != undefined
      && this.dateObj['fromDate'] != '') {
      fromDate = this.dateObj['fromDate'];
    }
    if (this.dateObj['toDate'] != undefined
      && this.dateObj['toDate'] != '') {
      toDate = this.dateObj['toDate'];
    }
    this._http.get(AppSettings.API_ENDPOINT
      + 'hotelPayReport?createdAt_gte='
      + fromDate
      + '&createdAt_lte='
      + toDate
      + '&requestFrom='
      + 'without_limit')
      .toPromise()
      .then(res => {
        const data = res;
        this.exporttoCSV(data, fromDate, toDate);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  exporttoCSV(data, from, to) {
    if (from !== '' && to !== '') {
      this.options.title = `Driver Payments From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      this.options.title = `Driver Payments From ${from}`;
    } else if (from === '' && to !== '') {
      this.options.title = `Driver Payments Upto ${to} `;
    }
    new Angular2Csv(data, this.reportname, this.options);
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
  }
  trxSettings = {
    actions: false,
    // pager: {
    //   display: true,
    //   perPage: 10,
    // },
    columns: {
      triptype: {
        title: 'Trip Type',
      },
      tripno: {
        title: 'Trip No',
      },
      date: {
        title: 'Date',
      },
      dvr: {
        title: 'Driver',
      },
      rid: {
        title: 'Rider',
      },
      fare: {
        title: 'Fare',
      },
      vehicle: {
        title: 'Vehicle Type',
      },
      status: {
        title: 'Status',
      },
      csp: {
        title: 'Via',
        valuePrepareFunction: (csp) => {
          return csp['via'];
        }
      },
    },
  };
  route(event) {
    this.initial = '';
    this.SetDocsDetails(event.data);
  }

  SetDocsDetails(data) {
    console.log(data.trx);
    this.trxSource = data.trx;
    // console.log(this.trxSource)
  }
  goBack() {
    this.initial = 'ShowList';
  }
}
