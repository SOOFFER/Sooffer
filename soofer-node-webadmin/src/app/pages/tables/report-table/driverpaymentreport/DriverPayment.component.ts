import { Component } from '@angular/core';
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
  selector: 'ngx-smart-table',
  providers: [TableService],
  templateUrl: './smart-table.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})

export class RDriverPaymentComponent {
  title: string = 'Trip Status Report';
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
      noresponse: {
        title: 'No Response Trips',
        filter: false,
        sort: false
      },
      processing: {
        title: 'Processing Trips',
        filter: false,
        sort: false
      },
      canceled: {
        title: 'Cancelled Trips',
        filter: false,
        sort: false
      },
      Finished: {
        title: 'Finished Trips',
        filter: false,
        sort: false
      }
    },
  };

  reportname = 'Trip Status Report';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Trip Date', 'No Response Trips', 'Processing Trips', 'Cancelled Trips', 'Finished Trips'],
    showTitle: true,
    title: 'Trip Status Report',
    useBom: true,
    removeNewLines: false,
    keys: ['_id', 'noresponse', 'processing', 'canceled', 'Finished'],
  };

  exportInp: any;
  showCity: boolean;
  serviceCityArray: any = [];
  source: LocalDataSource;
  constructor(private _http: HttpClient,
    private toastr: ButtonToasterService,
    private datePipe: DatePipe,
    private service: TableService) {
    this.source = new LocalDataSource();
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else this.showCity = false;
    this.dateObj = {};
    this.exportInp = {};
    this.list = {};
    const date = new Date();
    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.dateObj.fromDate = this.datePipe.transform(this.list.fromDate, 'yyyy-MM-dd');
    this.dateObj.toDate = this.datePipe.transform(this.list.toDate, 'yyyy-MM-dd');
    this.getData();
    this.service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
  }

  getData() {
    const fromDate = this.dateObj['fromDate'];
    const toDate = this.dateObj['toDate'];
    this.service.getTripStatusReportWithParams(fromDate, toDate)
      .then(res => {
        this.source.load(res);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  filterRes(data) {
    console.log(data);
    if (data.servicecity && data.fromDate == undefined && data.toDate == undefined) {
      this.service.getTripStatusReportWithCity(data.servicecity)
        .then(res => {
          this.source.load(res);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    } else if ((data.servicecity === undefined || data.servicecity == 'all')&& data.fromDate && data.toDate) {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.service.getTripStatusReportWithParams(fromDate, toDate)
        .then(res => {
          this.source.load(res);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    } else if (data.servicecity && data.fromDate && data.toDate) {
      const fromDate = this.dateObj['fromDate'];
      const toDate = this.dateObj['toDate'];
      this.service.getTripStatusReportWithoutCity(fromDate, toDate, data.servicecity)
        .then(res => {
          this.source.load(res);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
        });
    } else
      this.toastr.showtoast('warn', 'Select Filter');
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
      + 'tripStatus?tripFDT_gte='
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
      this.options.title = `Trip Status From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      this.options.title = `Trip Status From ${from}`;
    } else if (from === '' && to !== '') {
      this.options.title = `Trip Status Upto ${to} `;
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
  excelFileName: string = 'Trip Status.xlsx';
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['Trip Date', 'No Response Trips', 'Processing Trips', 'Cancelled Trips', 'Finished Trips'];

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
      { key: 'noresponse', width: 14 },
      { key: 'processing', width: 14 },
      { key: 'canceled', width: 14 },
      { key: 'Finished', width: 14 },
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

}
