import { Component, OnInit } from '@angular/core';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { AppSettings } from '../../../../app.config';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv';
import { DatePipe } from '@angular/common';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'ngx-trip-types',
  templateUrl: './subscription.component.html',
})
export class SubscriptionComponent implements OnInit {
  ngOnInit() { }
  title: string = 'Subscription Report';
  dateObj: any;
  list: any;
  settings = {
    actions: false,
    hideSubHeader: false,
    columns: {
      code: {
        title: 'Code',
        filter: false,
        sort: false,
      },
      driverName: {
        title: 'Driver Name',
        filter: false,
        sort: false,
      },
      packageName: {
        title: 'Package Name',
        filter: false,
        sort: false,
      },
      amount: {
        title: 'Package Amount',
        filter: false,
        sort: false,
      },
      credit: {
        title: 'Credit',
        filter: false,
        sort: false,
      },
      purchaseDate: {
        title: 'Purchase Date',
        filter: false,
        valuePrepareFunction: purchaseDate => {
          return moment(purchaseDate).format('YYYY-MM-DD');
        },
      },
      startDate: {
        title: 'Start Date',
        filter: false,
        valuePrepareFunction: purchaseDate => {
          return moment(purchaseDate).format('YYYY-MM-DD');
        },
      },
      endDate: {
        title: 'End Date',
        filter: false,
        valuePrepareFunction: purchaseDate => {
          return moment(purchaseDate).format('YYYY-MM-DD');
        },
      },
      isSubcriptionActive: {
        title: 'Subscription Status',
        filter: {
          type: 'list',
          config: {
            selectText: 'All',
            list: [
              { value: true, title: 'Active' },
              { value: false, title: 'Inactive' },

            ]
          },
        },
        valuePrepareFunction: isSubcriptionActive => {
          console.log(typeof isSubcriptionActive, 'isSubcriptionActive');
          // if(isSubcriptionActive == true) return "Active";
          // else return "Inactive";
          return isSubcriptionActive ? 'Active' : 'Inactive';
        },
      },
    },
  };

  reportname = 'Subscription Report';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: [
      'Driver Code',
      'Driver Name',
      'Package Name',
      'Amount',
      'Credit',
      'Start Date',
      'Purchase Date',
      'End Date',
      'Subscription Status'
    ],
    showTitle: true,
    title: 'Subscription Report',
    useBom: true,
    removeNewLines: false,
    keys: [
      'code',
      'driverName',
      'packageName',
      'amount',
      'credit',
      'startDate',
      'purchaseDate',
      'endDate',
      'isSubcriptionActive'
    ],
  };
  exportInp: any;

  source: LocalDataSource;
  constructor(
    private _http: HttpClient,
    private toastr: ButtonToasterService,
    private datePipe: DatePipe,
    private service: TableService
  ) {
    this.source = new LocalDataSource();
    this.dateObj = {};
    this.exportInp = {};
    this.list = {};
    const date = new Date();

    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.list.fromDate2 = new Date(date.getFullYear(), date.getMonth(), 1);
    this.list.toDate2 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.log('this.list', this.list);
    this.dateObj.fromDate = moment(this.list.fromDate).format('YYYY-MM-DD');
    this.dateObj.toDate = moment(this.list.toDate).format('YYYY-MM-DD');
    this.dateObj.fromDate2 = moment(this.list.fromDate2).format('YYYY-MM-DD');
    this.dateObj.toDate2 = moment(this.list.toDate2).format('YYYY-MM-DD');

    this.filterRes();
    this.filterRes2();
  }

  filterRes() {
    console.log('this.dateObj', this.dateObj);
    if (
      this.dateObj['fromDate'] === undefined ||
      this.dateObj['toDate'] === undefined
    ) {
      this.toastr.showtoast('warn', 'Select Both From Date and To Date');
    } else {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          'subscriptionHistory?endDate_gte=' +
          fromDate +
          '&endDate_lte=' +
          toDate
        // +
        // "&requestFrom=" +
        // "without_limit",
      });
    }
  }

  filterRes2() {
    console.log('this.dateObj', this.dateObj);
    if (
      this.dateObj['fromDate2'] === undefined ||
      this.dateObj['toDate2'] === undefined
    ) {
      this.toastr.showtoast('warn', 'Select Both From Date and To Date');
    } else {
      const fromDate2 = this.dateObj['fromDate2'];
      const toDate2 = this.dateObj['toDate2'];
      this.source = new ServerDataSource(this._http, {
        endPoint:
          AppSettings.API_ENDPOINT +
          'subscriptionHistory?purchaseDate_gte=' +
          fromDate2 +
          '&purchaseDate_lte=' +
          toDate2
        // +
        // "&requestFrom=" +
        // "without_limit",
      });
    }
  }

  export(event) {
    const exportFor = event.target.value;
    let fromDate = '';
    let toDate = '';
    if (
      this.dateObj['fromDate'] != undefined &&
      this.dateObj['fromDate'] != ''
    ) {
      fromDate = this.dateObj['fromDate'];
    }
    if (this.dateObj['toDate'] != undefined && this.dateObj['toDate'] != '') {
      toDate = this.dateObj['toDate'];
    }
    this._http
      .get(
        AppSettings.API_ENDPOINT +
        'subscriptionHistory?endDate_gte=' +
        fromDate +
        '&endDate_lte=' +
        toDate +
        '&requestFrom=' +
        'without_limit'
      )
      .toPromise()
      .then((res: any) => {
        const data = res;
        res.forEach((newData) => {
          newData.purchaseDate = moment(newData.purchaseDate).format(
            'YYYY-MM-DD'
          );
          newData.startDate = moment(newData.startDate).format('YYYY-MM-DD');
          newData.endDate = moment(newData.endDate).format('YYYY-MM-DD');
          newData['isSubcriptionActive'] = newData['isSubcriptionActive'] ? 'Active' : 'Inactive';
          newData['credit'] = newData['credit'] ? newData['credit'] : '-';
          return newData;
        });
        this.exporttoCSV(exportFor, res, fromDate, toDate);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }


  export2(event) {
    const exportFor = event.target.value;
    let fromDate2 = '';
    let toDate2 = '';
    if (
      this.dateObj['fromDate2'] != undefined &&
      this.dateObj['fromDate2'] != ''
    ) {
      fromDate2 = this.dateObj['fromDate2'];
    }
    if (this.dateObj['toDate2'] != undefined && this.dateObj['toDate2'] != '') {
      toDate2 = this.dateObj['toDate2'];
    }
    this._http
      .get(
        AppSettings.API_ENDPOINT +
        'subscriptionHistory?purchaseDate_gte=' +
        fromDate2 +
        '&purchaseDate_lte=' +
        toDate2 +
        '&requestFrom=' +
        'without_limit'
      )
      .toPromise()
      .then((res: any) => {
        const data = res;

        res.map((newData) => {
          newData.purchaseDate = moment(newData.purchaseDate).format(
            'YYYY-MM-DD'
          );
          newData.startDate = moment(newData.startDate).format('YYYY-MM-DD');
          newData.endDate = moment(newData.endDate).format('YYYY-MM-DD');
          newData['isSubcriptionActive'] = newData['isSubcriptionActive'] ? 'Active' : 'Inactive';
          newData['credit'] = newData['credit'] ? newData['credit'] : '-';
          return newData;
        });
        this.exporttoCSV2(exportFor, res, fromDate2, toDate2);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }


  exporttoCSV(exportFor, data, from, to) {
    if (from !== '' && to !== '') {
      this.options.title = `Subscription From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      this.options.title = `Subscription From ${from}`;
    } else if (from === '' && to !== '') {
      this.options.title = `Subscription Upto ${to} `;
    }

    if (exportFor === 'csv') {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === 'excel') {
      this.exportToExcel(data, '');
      this.exportInp = {};
    }
  }

  exporttoCSV2(exportFor, data, from, to) {
    if (from !== '' && to !== '') {
      this.options.title = `Subscription From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      this.options.title = `Subscription From ${from}`;
    } else if (from === '' && to !== '') {
      this.options.title = `Subscription Upto ${to} `;
    }
    if (exportFor === 'csv') {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === 'excel') {
      this.exportToExcel(data, '');
      this.exportInp = {};
    }
  }

  /** EXCEL SHEET */

  name: string;
  sName: string = 'SheetTest';
  excelFileName: string = 'SubscriptionReport.xlsx';
  blobType: string =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = [
    'code',
    'driverName',
    'packageName',
    'amount',
    'credit',
    'startDate',
    'purchaseDate',
    'endDate',
    'isSubcriptionActive'
  ];

  exportToExcel(data, tripLabel) {
    const workbook = new Excel.Workbook();
    workbook.creator = 'Web';
    workbook.lastModifiedBy = 'Web';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.addWorksheet(this.sName, {
      views: [{ activeCell: 'A1', showGridLines: true }],
    });
    const sheet = workbook.getWorksheet(1);
    sheet.getRow(1).values = '';
    sheet.getRow(2).values = this.cols;
    sheet.columns = [
      { key: 'code', width: 14 },
      { key: 'driverName', width: 14 },
      { key: 'packageName', width: 14 },
      { key: 'amount', width: 17 },
      { key: 'credit', width: 14 },
      { key: 'startDate', width: 14 },
      { key: 'purchaseDate', width: 14 },
      { key: 'endDate', width: 17 },
      { key: 'isSubcriptionActive', width: 17 },

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
      setTimeout(function () {
        window.URL.revokeObjectURL(url);
      }, 0);
      FileSaver.saveAs(blob, this.excelFileName, true);
    });
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      'yyyy-MM-dd'
    );
  }

  logDate2(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(
      msg.input.value,
      'yyyy-MM-dd'
    );
  }


  getData() {
    this.service.getSubscriptionReport().then(res => {
      this.source.load(res);
    });
  }
}
