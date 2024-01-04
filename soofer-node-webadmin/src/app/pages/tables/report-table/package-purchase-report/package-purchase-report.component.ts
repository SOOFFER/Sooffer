import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import { DatePipe } from '@angular/common';
import { TableService } from '../../table.service';
import { AppSettings, featuresSettings } from '../../../../app.config';
import { Angular2Csv } from 'angular2-csv';
import * as moment from 'moment';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'ngx-package-purchase-report',
  templateUrl: './package-purchase-report.component.html',
})

export class PackagePurchaseReportComponent implements OnInit {

  title: string = 'Package Purchase Report';
  dateObj: any;
  list: any;
  settings = {
    actions: false,
    columns: {
      driverName: {
        title: 'Driver Name',
      },
      code: {
        title: 'Code',
      },
      packageName: {
        title: 'Package Name',
      },
      purchaseDate: {
        title: 'Purchase Date',
        filter: false,
        valuePrepareFunction: (purchaseDate) => {
          return moment(purchaseDate).format('YYYY-MM-DD');
        }
      },
      amount: {
        title: 'Amount',
        filter: false,
      },
      type: {
        title: 'Package Type',
        filter: false,
      },
      credit: {
        title: 'Credits',
        filter: false,
      }
    },
  };

  reportname = 'Package Purchase Report';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Driver Name', 'Code', 'Package Name', 'Purchase Date', 'Amount', 'Package Type', 'Credits'],
    showTitle: true,
    title: 'Package Purchase Report',
    useBom: true,
    removeNewLines: false,
    keys: ['driverName', 'code', 'packageName', 'purchaseDate', 'amount', 'type', 'credit'],
  };

  exportInp: any;
  source: ServerDataSource;
  showCity : boolean 
  ServiceCity: any;
  constructor(private _http: HttpClient,
    private toastr: ButtonToasterService,
    private datePipe: DatePipe,
    private service: TableService) {
    this.dateObj = {};
    this.list = {};
    const date = new Date();
    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.dateObj.fromDate = this.datePipe.transform(this.list.fromDate, 'yyyy-MM-dd');
    this.dateObj.toDate = this.datePipe.transform(this.list.toDate, 'yyyy-MM-dd');
    this.exportInp = {};
    this.getData();
    if(featuresSettings.isCityWise === true && featuresSettings.isServiceAvailable === true && localStorage.getItem('userType') === 'superadmin' )
    this.showCity = true;
    else 
    this.showCity = false;

    this.service.getServiceCity()
    .then(res=>{
      this.ServiceCity= res;
    })
    // this.filterRes();
  }

  ngOnInit() { }

  getData() {
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'packagePurchaseHistory?createdAt_gte=' + this.dateObj.fromDate + '&createdAt_lte=' + this.dateObj.toDate  });
  }

  filterRes(data) {
    if (data.servicecity && data.fromDate == undefined && data.toDate == undefined) {
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'packagePurchaseHistory?scity_like=' + data.servicecity });
    }
    else if ((data.servicecity == undefined || data.servicecity =="all" ) && data.fromDate && data.toDate) {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'packagePurchaseHistory?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate });
    }
    else if (data.servicecity && data.fromDate && data.toDate) {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'packagePurchaseHistory?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate + '&scity_like=' + data.servicecity });

    }

    else
      this.toastr.showtoast('warn', 'Select Filter');

  }

  export(event) {
    const exportFor = event.target.value;
    let fromDate = '';
    let toDate = '';
    if (this.dateObj['fromDate'] !== undefined
      && this.dateObj['fromDate'] !== '') {
      fromDate = this.dateObj['fromDate'];
    }
    if (this.dateObj['toDate'] !== undefined
      && this.dateObj['toDate'] !== '') {
      toDate = this.dateObj['toDate'];
    }
    this._http.get(AppSettings.API_ENDPOINT
      + 'packagePurchaseHistory?createdAt_gte='
      + fromDate
      + '&createdAt_lte='
      + toDate
      + '&requestFrom='
      + 'without_limit')
      .toPromise()
      .then(res => {
        const data = res;
        this.exporttoCSV(exportFor, data, fromDate, toDate);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  exporttoCSV(exportFor, data, from, to) {
    if (from !== '' && to !== '') {
      this.options.title = `Package Purchased From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      this.options.title = `Package Purchased From ${from}`;
    } else if (from === '' && to !== '') {
      this.options.title = `Package Purchased Upto ${to} `;
    }
    if (exportFor === 'csv') {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === 'excel') {
      this.exportToExcel(data, '');
      this.exportInp = {};
    }
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
  }

  /** EXCEL SHEET */

  name: string;
  sName: string = 'SheetTest';
  excelFileName: string = 'Package Purchase Report.xlsx';
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['Driver Name', 'Code', 'Package Name', 'Purchase Date', 'Amount', 'Package Type', 'Credits'];

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
      { key: 'code', width: 14 },
      { key: 'packageName', width: 20 },
      { key: 'purchaseDate', width: 20 },
      { key: 'amount', width: 18 },
      { key: 'type', width: 20 },
      { key: 'credit', width: 18 }
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
