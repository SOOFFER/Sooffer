import { Component, OnInit } from '@angular/core';
import { AppSettings, featuresSettings } from '../../../../../app.config';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TableService } from '../../../table.service';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'ngx-driver-transaction-report',
  providers: [DatePipe],
  templateUrl: './driver-transaction-report.component.html',
})

export class DriverTransactionReportComponent implements OnInit {
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
  dateObj: any;
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
  exportInp: any;
  showCity: boolean;
  serviceCityArray: any;

  constructor(private _http: HttpClient, private routeT: ActivatedRoute,
    private route: Router,
    private datePipe: DatePipe,
    private service: TableService,
    private toastr: ButtonToasterService) {
    this.dateObj = {};
    this.exportInp = {};
    this.routeT.params.subscribe(params => {
      if (params['driverId']) {
        this.list.driverId = params['driverId'];
        this.list.driverName = params['driverName'];
        this.list.wallet = params['walletAmt'];
        this.source = new LocalDataSource();
        if(featuresSettings.isCityWise === true && featuresSettings.isServiceAvailable === true && localStorage.getItem('userType') ==='superadmin')
        this.showCity = true;
        else 
        this.showCity = false;
        this.service.getServiceCity()
          .then(res => {
            this.serviceCityArray = res;
          });
        this.service.getSettlementsForReport(this.list.driverId)
          .then(res => {
            this.source.load(res);
            this.exportArray = res;
            this.exportDetails = res;
          })
          .catch(res => {
            this.toastr.showtoast('error', 'No Data Found');
          });
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
      this.source = new LocalDataSource();
      this.service.getSettlementsForReportWithLimits(fromDate, toDate)
        .then(res => {
          this.source.load(res);
          this.exportArray = res;
          this.exportDetails = res;
        })
        .catch(res => {
          this.toastr.showtoast('error', 'No Data Found');
        });
    }
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
  }

  export(event) {
    const exportFor = event.target.value;
    const driver = this.list.driverName;
    const wal = this.exportDetails.totalBal;
    const that = this;
    this.exportArray.map(el => {
      el['paymentDate'] = that.datePipe.transform(el['paymentDate'], 'dd-MM-y');
      el['driverName'] = driver;
      el['totalBal'] = wal;
    });
    if (exportFor === 'csv') {
      this.options.title = 'Transaction Details For Driver ' + this.list.driverName;
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
  excelFileName: string = `Transaction Details For Driver ${this.list.driverName}.xlsx`;
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
      { key: 'trxId', width: 25 },
      { key: 'description', width: 25 },
      { key: 'amt', width: 17 },
      { key: 'type', width: 17 },
      { key: 'bal', width: 17 }
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
