import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { AppSettings, featuresSettings } from '../../../../app.config';
import { DatePipe } from '@angular/common';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';

@Component({
  selector: 'ngx-delivery-report',
  providers: [TableService, DatePipe],
  templateUrl: './delivery-report.component.html',
  styleUrls: ['./delivery-report.component.scss']
})
export class DeliveryReportComponent implements OnInit {

  title: string = 'Delivery Report';
  dateObj: any;
  list: any;
  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      createdAt: {
        title: 'Trip Date',
        filter: false,
        sort: false,
        valuePrepareFunction: (createdAt) => {
          return moment(createdAt).utc().format('DD-MM-YYYY HH:mm a');
        }
      },
      tripno: {
        title: 'Trip No',
        filter: false,
      },
      receiverName: {
        title: 'Receiver Name',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.deliverydetails) {
            return row.deliverydetails.receiverName;
          } else '';
        }
      },
      receiverMobile: {
        title: 'Mobile Number',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.deliverydetails) {
            return row.deliverydetails.receiverMobile;
          } else '';
        }
      },
      packageType: {
        title: 'Package Type',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.deliverydetails) {
            return row.deliverydetails.packageType;
          } else '';
        }
      },
      delivery: {
        title: 'Total Fare',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.delivery) {
            return row.delivery.total;
          } else '';
        }
      },
      commision: {
        title: 'Platform Fees',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.delivery) {
            return row.delivery.commision;
          } else '';
        }
      },
      totalAmount2: {
        title: 'Ride Status',
        filter: false,
        valuePrepareFunction: () => 'Completed'
      },
      csp: {
        title: 'Payment Mode',
        filter: false,
        valuePrepareFunction: (csp) => {
          return csp['via'];
        }
      },
    },
  };

  reportname = 'Delivery Trip Reports';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Trip Date', 'Trip No', 'Receiver Name', 'Mobile Number', 'Package Type',
      'Total Fare', 'Platform Fees', 'Ride Status', 'Payment Mode'],
    showTitle: true,
    title: 'Delivery Trip Reports',
    useBom: true,
    removeNewLines: false,
    keys: ['createdAt', 'tripno', 'receiverName', 'receiverMobile', 'packageType', 'delivery',
      'commision', 'totalAmount2', 'csp'],
  };

  source: ServerDataSource;
  showCity: boolean;
  serviceCityArray: any = [];
  exportInp: any;

  constructor(private _http: HttpClient,
    private toastr: ButtonToasterService,
    private datePipe: DatePipe,
    private service: TableService) {
    if (featuresSettings.isCityWise === true
      && featuresSettings.isServiceAvailable === true
      && localStorage.getItem('userType') === 'superadmin')
      this.showCity = true;
    else this.showCity = false;
    this.dateObj = {};
    this.list = {};
    const date = new Date();
    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.dateObj.fromDate = this.datePipe.transform(this.list.fromDate, 'yyyy-MM-dd');
    this.dateObj.toDate = this.datePipe.transform(this.list.toDate, 'yyyy-MM-dd');
    this.exportInp = {};
    this.service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
    this.getData();
  }

  ngOnInit() {

  }

  filterRes(data) {
    if (data.servicecity && data.fromDate === undefined && data.toDate === undefined) {
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'deliveryReport?scity_like=' + data.servicecity });
    } else if (data.servicecity && data.fromDate && data.toDate) {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'deliveryReport?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate + '&scity_like=' + data.servicecity });
    } else if (data.servicecity === undefined && data.fromDate && data.toDate) {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'deliveryReport?createdAt_gte=' + fromDate + '&createdAt_lte=' + toDate });
    } else
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
      + 'deliveryReport?createdAt_gte='
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
    for (const res of data) {
      res['receiverName'] = res['deliverydetails'].receiverName;
      res['receiverMobile'] = res['deliverydetails'].receiverMobile;
      res['packageType'] = res['deliverydetails'].packageType;
      res['delivery'] = res.delivery ? res.delivery.total : '';
      res['commision'] = res.delivery ? res.delivery.commision : '';
      res['totalAmount2'] = 'Completed';
      res['csp'] = res.csp.via;
      res['createdAt'] = moment(res.createdAt).utc().format('DD-MM-YYYY HH:mm a');
      res['totalAmount2'] = 'Completed';
      if (res['dvrfname'] == null) {
        res['dvrfname'] = '';
      }
    }
    let title;
    if (from !== '' && to !== '') {
      title = `Delivery Trip Reports From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      title = `Delivery Trip Reports From ${from}`;
    } else if (from === '' && to !== '') {
      title = `Delivery Trip Reports Upto ${to} `;
    }
    if (exportFor === 'csv') {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === 'excel') {
      this.exportToExcel(data, title);
      this.exportInp = {};
    }
  }

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
  }

  // reset() {
  //   this.list = {};
  //   this.dateObj = {};
  //   this.getData();
  // }

  // getData() {
  //   this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'deliveryReport' });
  // }

  getData() {
    if (this.dateObj.fromDate && this.dateObj.toDate) {
      this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'deliveryReport?createdAt_gte=' + this.dateObj.fromDate + '&createdAt_lte=' + this.dateObj.toDate });
    }
  }

  /** EXCEL SHEET */

  name: string;
  sName: string = 'SheetTest';
  excelFileName: string = 'Delivery Trip Reports.xlsx';
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['Trip Date', 'Trip No', 'Receiver Name', 'Mobile Number', 'Package Type',
    'Total Fare', 'Platform Fees', 'Ride Status', 'Payment Mode'];

  exportToExcel(data, tripLabel) {
    // console.log(data)
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
      { key: 'createdAt', width: 22 },
      { key: 'tripno', width: 13 },
      { key: 'receiverName', width: 15 },
      { key: 'receiverMobile', width: 20 },
      { key: 'packageType', width: 15 },
      { key: 'delivery', width: 12 },
      { key: 'commision', width: 12 },
      { key: 'totalAmount2', width: 14 },
      { key: 'csp', width: 14 },
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
      // console.log(url)
      setTimeout(function () { window.URL.revokeObjectURL(url); }, 0);
      FileSaver.saveAs(blob, this.excelFileName, true);
      // console.log(blob)
    });
  }
}
