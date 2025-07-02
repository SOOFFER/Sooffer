import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../table.service';
import { AppSettings, featuresSettings } from '../../../../app.config';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv';
import { DatePipe } from '@angular/common';
import { ButtonToasterService } from '../../../buttontoaster/buttontoaster.service';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'ngx-trip-types',
  templateUrl: './trip-types.component.html',
})

export class TripTypesComponent implements OnInit {
  showCity: boolean;
  ServiceCity: any;
  ngOnInit() { }
  title: string = 'Trip Types Report';
  dateObj: any;
  list: any;
  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      _id: {
        title: 'Trip Date',
        filter: false,
        sort: false
      },
      rideNow: {
        title: 'Daily Trips',
        filter: false,
        sort: false
      },
      rideLater: {
        title: 'Scheduled Trips',
        filter: false,
        sort: false
      },
      hailRide: {
        title: 'Hail Trips',
        filter: false,
        sort: false
      },
    },
  };

  reportname = 'Trip Types Report';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Trip Date', 'Daily Trips', 'Scheduled Trips', 'Hail Trips'],
    showTitle: true,
    title: 'Trip Types Report',
    useBom: true,
    removeNewLines: false,
    keys: ['_id', 'rideNow', 'rideLater', 'hailRide'],
  };
  exportInp: any;

  source: LocalDataSource;
  constructor(private _http: HttpClient,
    private toastr: ButtonToasterService,
    private datePipe: DatePipe,
    private service: TableService) {
    this.source = new LocalDataSource();
    this.dateObj = {};
    this.exportInp = {};
    this.list = {};
    const date = new Date();
    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.dateObj.fromDate = this.datePipe.transform(this.list.fromDate, 'yyyy-MM-dd');
    this.dateObj.toDate = this.datePipe.transform(this.list.toDate, 'yyyy-MM-dd');
    if(featuresSettings.isCityWise === true && featuresSettings.isServiceAvailable === true && localStorage.getItem('userType')== 'superadmin')
    this.showCity = true;
    else
    this.showCity = false; 
    this.service.getServiceCity()
    .then(res=>{
      this.ServiceCity = res;
    })

    // this.getData();
    this.filterRes(this.list);
  }

  filterRes(data) {
    if (this.dateObj['fromDate'] === undefined || this.dateObj['toDate'] === undefined) {
      this.toastr.showtoast('warn', 'Select Both From Date and To Date');
    } else {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      const city = data.servicecity;
      this.service.getTripTypeReportWithParams(fromDate, toDate,city)
        .then(res => {
          this.source.load(res);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    }
  }

  export(event) {
    const exportFor = event.target.value;
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
      + 'tripTypes?tripFDT_gte='
      + fromDate
      + '&tripFDT_lte='
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
      this.options.title = `Trips From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      this.options.title = `Trips From ${from}`;
    } else if (from === '' && to !== '') {
      this.options.title = `Trips Upto ${to} `;
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
  excelFileName: string = 'Trip Types Report.xlsx';
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['Trip Date', 'Daily Trips', 'Scheduled Trips', 'Hail Trips'];

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
      { key: '_id', width: 14 },
      { key: 'rideNow', width: 14 },
      { key: 'rideLater', width: 17 },
      { key: 'hailRide', width: 14 },
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

  logDate(msg) {
    this.dateObj[msg.input.name] = this.datePipe.transform(msg.input.value, 'yyyy-MM-dd');
  }

  getData() {
    this.service.getTripTypeReport()
      .then(res => {
        this.source.load(res);
      });
  }
}
