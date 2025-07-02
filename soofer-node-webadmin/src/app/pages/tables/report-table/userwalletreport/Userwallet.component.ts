import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { DatePipe } from '@angular/common';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv';
import { AppSettings, featuresSettings } from '../../../../app.config';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, DatePipe],
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})

export class UserwalletComponent {
  title: string = 'User Wallet Report';
  initial: string = 'showList';
  selectedid: string;
  currentIndex: any = 0;
  driverDoc: any = {};
  serviceCityArray: any = [];
  showCity: boolean;
  selectedDocs: any;
  dateObj: any;
  list: any;
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      columnTitle: 'View Transaction Details',
      class: 'action-column',
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      fname: {
        title: 'Name',
      },
      phone: {
        title: 'Phone Number',
      },
      bal: {
        title: 'Balance',
      },
    },
  };

  source: ServerDataSource;
  trxSource: ServerDataSource;

  reportname = 'User Wallet Report';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Name', 'Phone Number', 'Balance'],
    showTitle: true,
    title: 'User Wallet Report',
    useBom: true,
    removeNewLines: false,
    keys: ['fname', 'phone', 'bal'],
  };
  exportInp: any;

  constructor(private _http: HttpClient,
    private toastr: ButtonToasterService,
    private datePipe: DatePipe,
    private service: TableService) {
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet' });
    if (featuresSettings.isCityWise === true && featuresSettings.isServiceAvailable === true && localStorage.getItem('userType') === 'superadmin')
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
    this.dateObj = {};
    this.list = {};
    this.exportInp = {};
    const date = new Date()
    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1)
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    this.dateObj.fromDate = this.datePipe.transform(this.list.fromDate, 'yyyy-MM-dd')
    this.dateObj.toDate = this.datePipe.transform(this.list.toDate, 'yyyy-MM-dd')
    this.getData();
  }

  SerachDriverForCity(data): void {
    if (data.servicecity === 'undefined') {
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet' });
    } else
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet?scity_like=' + data.servicecity });
  }

  getData() {
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet' });
  }

  filterRes(data) {

    if (data.servicecity && data.fromDate == undefined && data.toDate == undefined) {
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet?scity_like=' + data.servicecity });
    }
    else if ((data.servicecity == undefined || data.servicecity == 'all') && data.fromDate && data.toDate) {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate });
    }
    else if (data.servicecity && data.fromDate && data.toDate) {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'userWallet?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate + '&scity_like=' + data.servicecity });

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
      + 'userWallet?createdAt_gte='
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
      this.options.title = `User Wallet Report From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      this.options.title = `User Wallet Report From ${from}`;
    } else if (from === '' && to !== '') {
      this.options.title = `User Wallet Report Upto ${to} `;
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
  excelFileName: string = 'User Wallet Report.xlsx';
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['Name', 'Phone Number', 'Balance'];

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
      { key: 'fname', width: 13 },
      { key: 'phone', width: 13 },
      { key: 'bal', width: 10 },
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

  trxSettings = {
    actions: false,
    columns: {
      trxid: {
        title: 'Transaction ID',
      },
      type: {
        title: 'Type',
      },
      amt: {
        title: 'Amount',
      },
      date: {
        title: 'Date'
      }
    },
  };

  title1 = 'Wallet Transaction Details';

  route(event) {
    this.initial = '';
    this.SetDocsDetails(event.data);
    const temp = document.querySelector('li.active');
    console.log(temp)
    if (temp) {
      const child = temp.children
      if (child[0] && child[0].childNodes[0] && child[0].childNodes[0].nodeValue) {
        const ind = child[0].childNodes[0].nodeValue;
        this.currentIndex = parseInt(ind);
      }
      console.log("this.currentIndex", this.currentIndex);
    }
  }

  SetDocsDetails(data) {
    //console.log(data)
    this.trxSource = data.trx;
  }

  goBack(): void {
    this.initial = 'showList';
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
    console.log(this.currentIndex);
  }

}
