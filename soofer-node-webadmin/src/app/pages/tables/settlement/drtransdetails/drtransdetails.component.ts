import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../../app.config';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { DatePipe } from '@angular/common';
import { Angular2Csv } from 'angular2-csv';

@Component({
  selector: 'ngx-drtransdetails',
  providers: [DatePipe],
  templateUrl: './drtransdetails.component.html',
})
export class DrtransdetailsComponent implements OnInit {

  list: any = {};
  baseurl: string = AppSettings.BASEURL;
  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      paymentDate: {
        title: 'Payment Date',
        // valuePrepareFunction: (paymentDate) => {
        //   return this.datePipe.transform(paymentDate, 'dd-MM-y');
        // }
      },
      trxId: {
        title: 'Transaction ID',
      },
      description: {
        title: 'Description',
      },
      amt: {
        title: 'Amount',
      },
      type: {
        title: 'Type',
      },
      bal: {
        title: 'Balance'
      }
    },
  };

  source: LocalDataSource;

  exportArray = [];
  exportDetails: any;
  reportname = 'Transaction Details';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Driver Name', 'Payment Date', 'Transaction ID', 'Description', 'Amount', 'Type', 'Balance'],
    showTitle: true,
    title: 'Transaction Details',
    useBom: true,
    removeNewLines: false,
    keys: ['driverName', 'paymentDate', 'trxId', 'description', 'amt', 'type', 'bal'],
  };

  constructor(http: HttpClient, private routeT: ActivatedRoute,
    private route: Router,
    private datePipe: DatePipe,
    private service: TableService,
    private toastr: ButtonToasterService) {
    this.routeT.params.subscribe(params => {
      if (params['driverId']) {
        this.list.driverId = params['driverId'];
        this.list.driverName = params['driverName'];
        this.list.wallet = params['walletAmt'];
        this.source = new LocalDataSource();
        this.service.getSettlements(this.list.driverId)
          .then(res => {
            this.source.load(res[0].trx);
            this.exportArray = res[0].trx;
            this.exportDetails = res[0];
          })
          .catch(res => {
            this.toastr.showtoast('error', 'No Data Found');
          });
        //this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'settlement/' + this.list.driverId });
      }
    });
  }

  goBack() {
    this.route.navigate(['/pages/tables/settlement/driversettlements']);
  }

  ngOnInit() {
  }

  export() {
    const driver = this.exportDetails.driverName;
    const wal = this.exportDetails.totalBal;
    const that = this;
    this.exportArray.map(el => {
      el['paymentDate'] = that.datePipe.transform(el['paymentDate'], 'dd-MM-y');
      el['driverName'] = driver;
      el['totalBal'] = wal;
    });
    this.options.title = 'Transaction Details For Driver ' + this.list.driverName;
    new Angular2Csv(this.exportArray, this.reportname, this.options);
  }

}
