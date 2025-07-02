import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../../app.config';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { DatePipe } from '@angular/common';
import { Angular2Csv } from "angular2-csv";

@Component({
  selector: 'ngx-drtransdetails',
  providers: [DatePipe],
  templateUrl: './hoteltrx.component.html',
})
export class HoteltrxdetailsComponent implements OnInit {

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
        valuePrepareFunction: (paymentDate) => {
          return this.datePipe.transform(paymentDate, 'dd-MM-y');
        }
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
        title: 'Wallet Balance'
      }
    },
  };

  source: LocalDataSource;

  exportArray = [];
  exportDetails: any;
  reportname = "Transaction Details";
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
      if (params['hotelId']) {
        this.list.hotelId = params['hotelId'];
        this.source = new LocalDataSource();
        this.service.getSettlementsHotel(this.list.hotelId)
          .then(res => {
            this.source.load(res[0].trx)
       this.list.totalBal = res[0]['totalBal'];

            this.exportArray = res[0].trx;
            this.exportDetails = res[0];
          })
          .catch(res => {
            this.toastr.showtoast('error', 'No Data Found');
          })
        //this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'settlement/' + this.list.driverId });
      }
    });
  }

  goBack() {
    this.route.navigate(['/pages/tables/settlement/hotransdetails']);
  }

  ngOnInit() {
  }

  export() {
    let driver = this.exportDetails.driverName;
    let wal = this.exportDetails.totalBal;
    let that = this;
    this.exportArray.map(el => {
      el['paymentDate'] = that.datePipe.transform(el['paymentDate'], 'dd-MM-y')
      el['driverName'] = driver
      el['totalBal'] = wal
    })
    new Angular2Csv(this.exportArray, this.reportname, this.options);
  }

}
