import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../../../app.config';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TableService } from '../../../table.service';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-driver-wallet-report',
  providers: [DatePipe],
  templateUrl: './driver-wallet-report.component.html',
})

export class DriverWalletReportComponent implements OnInit {

  list: any = {};
  dateObj: any;
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

  exportInp: any;

  constructor(private _http : Http, private routeT: ActivatedRoute,
    private route: Router,
    private datePipe: DatePipe,
    private http: HttpClient,
    private service: TableService,
    private toastr: ButtonToasterService) {
    this.exportInp = {};
    this.list = {};
    this.dateObj = {};
    const date = new Date();
    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.dateObj.fromDate = this.datePipe.transform(
      this.list.fromDate,
      "yyyy-MM-dd"
    );
    this.dateObj.toDate = this.datePipe.transform(
      this.list.toDate,
      "yyyy-MM-dd"
    );

    this.routeT.params.subscribe(params => {
      if (params['driverId']) {
        this.list.driverId = params['driverId'];
        this.list.driverName = params['driverName'];
        this.list.wallet = params['walletAmt'];      
        console.log(this.dateObj.fromDate,  this.dateObj.toDate)
        this.source = new LocalDataSource();
        this.source = new ServerDataSource(this.http , { endPoint: AppSettings.API_ENDPOINT+'driverWalletReport'+'/'+params['driverId']+'?createdAt_gte='+this.dateObj.fromDate+'&createdAt_lte='+this.dateObj.toDate});

        // this.service.getDriverWalletForReport(this.list.driverId)
        //   .then(res => {
        //     this.source.load(res);
        //     this.exportDetails = res;
        //     this.exportArray = res;
        //   })
        //   .catch(res => {
        //     this.toastr.showtoast('error', 'No Data Found');
        //   });
        //this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'settlement/' + this.list.driverId });
      }
    });
  }

  goBack() {
    this.route.navigate(['/pages/tables/report-table/driversettlementreport/driver-settlement-report']);
  }

  ngOnInit() {
  }

  filterRes() {
    if (this.dateObj['fromDate'] === undefined || this.dateObj['toDate'] === undefined) {
      this.toastr.showtoast('warn', 'Select Both From Date and To Date');
    } else {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      const id = this.list.driverId;
      console.log(fromDate, toDate, id)
      this.source = new ServerDataSource(this.http , { endPoint: AppSettings.API_ENDPOINT+'driverWalletReport'+'/'+id+'?createdAt_gte='+this.dateObj.fromDate+'&createdAt_lte='+this.dateObj.toDate});

      // this.service.getDriverWalletForReportWithLimits(fromDate, toDate, id )
      //   .then(res => {
      //     console.log(res,"res")
      //     this.source.load(res);
      //     this.exportDetails = res;
      //     this.exportArray = res;
      //   })
      //   .catch(res => {
      //     this.toastr.showtoast('error', 'No Data Found');
      //   });
    }
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
  }

  export(event) {
    let exportFor = event.target.value;
    const driver = this.list.driverName;
    const wal = this.exportDetails.totalBal;
    const that = this;
    this.exportArray.map(el => {
      // el['paymentDate'] = that.datePipe.transform(el['paymentDate'], 'dd-MM-y');
      el['driverName'] = driver;
      el['totalBal'] = wal;
    });
    if (exportFor === 'csv') {
      this.options.title = 'Wallet Details For Driver ' + this.list.driverName;
      new Angular2Csv(this.exportArray, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === 'excel') {
      this.exportToExcel(this.exportArray, '');
      this.exportInp = {};
    }
  }

  /** EXCEL SHEET */

  name: string;
  sName: string = 'SheetTest';
  excelFileName: string = `Wallet Details For Driver ${this.list.driverName}.xlsx`;
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['Driver Name', 'Payment Date', 'Transaction ID', 'Description', 'Amount', 'Type', 'Balance'];

  exportToExcel(data, tripLabel) {
    const workbook = new Excel.Workbook();
    workbook.creator = 'Web';
    workbook.lastModifiedBy = 'Web';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.addWorksheet(this.sName, { views: [{ activeCell: 'A1', showGridLines: true }] });
    const sheet = workbook.getWorksheet(1);
    sheet.getRow(1).values = '';
    sheet.getRow(2).values = this.cols;
    sheet.columns = [
      { key: 'driverName', width: 16 },
      { key: 'paymentDate', width: 14 },
      { key: 'trxId', width: 20 },
      { key: 'description', width: 20 },
      { key: 'amt', width: 18 },
      { key: 'type', width: 18 },
      { key: 'bal', width: 18 },
    ];
    sheet.addRows(data);

    // FONT SIZE
    sheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      sheet.getRow(rowNumber).font = {
        name: 'Liberation Sans',
        size: 10,
      };
      //sheet.getRow(rowNumber).height = 25
      const rowHeader = sheet.getRow(rowNumber);
      rowHeader.eachCell(function (cell, colNumber) {
        //console.log('Cell ' + colNumber + ' = ' + cell.value);
        rowHeader.getCell(colNumber).alignment = { horizontal: 'center' };
      });
    });
    sheet.getRow(2).font = {
      bold: 'true',
      name: 'Liberation Sans',
      size: 11,
    };
    //  sheet.getColumn('startAddress').alignment = { wrapText: true };
    //  sheet.getColumn('endAddress').alignment = { wrapText: true };
    //  sheet.getColumn('findStartAddress').alignment = { wrapText: true };
    //  sheet.getColumn('findEndAddress').alignment = { wrapText: true };

    // HEADER ROW ALIGN CENTER
    const rowHeader = sheet.getRow(2);
    rowHeader.eachCell(function (cell, colNumber) {
      //console.log('Cell ' + colNumber + ' = ' + cell.value);
      rowHeader.getCell(colNumber).alignment = { horizontal: 'center' };
    });

    // EXPORT USING FILESAVER
    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: this.blobType });
      const url = window.URL.createObjectURL(blob);
      setTimeout(function () { window.URL.revokeObjectURL(url); }, 0);
      FileSaver.saveAs(blob, this.excelFileName, true);
    });
  }

}
