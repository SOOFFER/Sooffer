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
  selector: 'ngx-driverwalletdetails',
  providers: [DatePipe],
  templateUrl: './driverwalletdetails.component.html',
})

export class DriverwalletdetailsComponent implements OnInit {
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
  reportname = 'Wallet Details';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Driver Name', 'Payment Date', 'Transaction ID', 'Description', 'Amount', 'Type', 'Balance'],
    showTitle: true,
    title: 'Wallet Details',
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
        this.service.getDriverWallet(this.list.driverId)
          .then(res => {
            this.source.load(res.trx);
            this.exportDetails = res;
            this.exportArray = res.trx;
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
    this.options.title = 'Wallet Details For Driver ' + this.list.driverName;
    new Angular2Csv(this.exportArray, this.reportname, this.options);
  }


}
