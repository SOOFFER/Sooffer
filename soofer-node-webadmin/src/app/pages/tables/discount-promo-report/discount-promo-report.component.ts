import { Component } from '@angular/core';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { TableService } from '../table.service';
import { Ng2SmartTableModule, ServerDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http'
import { featuresSettings, AppSettings } from '../../../app.config';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'Discount-Promo-Report',
  templateUrl: './discount-promo-report.component.html'
})

export class DiscountPromoReportComponent {
  showCity: boolean;
  serviceCity: any;
  currentIndex: any = 0;
  list: any = {};
  initial: string = "order"
  dateObj: any;
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      custom: [{ name: 'routeToPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
      page: this.currentIndex
    },
    columns: {
      date: {
        title: 'Date',
      },
      tripno: {
        title: 'Trip No'
      },
      dvrName: {
        title: 'Driver Name'
      },
      dvrPhone: {
        title: 'Driver Phone'
      },
      promoCode: {
        title: 'PromoCode'
      },
      promoAmt: {
        title: 'Promo Amount'
      },
      amtToDriver: {
        title: 'Amount to Driver',
      },
      commisionAfterDiscount: {
        title: 'Commosion'
      },
      FinalCost: {
        title: 'Total Amount'
      }
    }
  }

  settings1 = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      // custom : [{ name :'routeToPage', title: `<i class="nb-edit"></i>` }]
    },
    columns: {
      date: {
        title: 'Date',
      },
      tripno: {
        title: 'Trip No'
      },
      dvrName: {
        title: 'Driver Name'
      },
      dvrPhone: {
        title: 'Driver Phone'
      },
      promoCode: {
        title: 'PromoCode'
      },
      promoAmt: {
        title: 'Promo Amount'
      },
      amtToDriver: {
        title: 'Amount to Driver',
      },
      commisionAfterDiscount: {
        title: 'Commosion'
      },
      FinalCost: {
        title: 'Total Amount'
      }
    }
  }
  source: ServerDataSource;
  exportInp: any;
  drvId: any;
  source1: ServerDataSource;
  selDocs: any = {};
  constructor(_http: Http,
    private http: HttpClient,
    private toaster: ButtonToasterService,
    private tableSvc: TableService,
    private datePipe: DatePipe) {
    if (featuresSettings.isCityWise === true && featuresSettings.isServiceAvailable === true && localStorage.getItem('userType') == 'superadmin')
      this.showCity = true;
    else
      this.showCity = false;
    this.tableSvc.getServiceCity()
      .then(res => {
        this.serviceCity = res;
      })
    this.dateObj = {}
    const date = new Date
    this.list.fromDate = new Date(date.getFullYear(), date.getMonth(), 1)
    this.list.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    this.selDocs.fromDate = new Date(date.getFullYear(), date.getMonth(), 1)
    this.selDocs.toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    this.dateObj.fromDate = this.datePipe.transform(this.list.fromDate, 'yyyy-MM-dd')
    this.dateObj.toDate = this.datePipe.transform(this.list.toDate, 'yyyy-MM-dd')
    this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'discountCreditReport?tripFDT_gte=' + this.dateObj.fromDate + '&tripFDT_lte=' + this.dateObj.toDate })


  }

  FilterRes(data) {
    console.log(data)
    const fromDate = this.datePipe.transform(data.fromDate, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(data.toDate, 'yyyy-MM-dd')
    console.log(fromDate, toDate)
    if ((data.servicecity == undefined || data.servicecity == 'all') && data.fromDate && data.toDate) {
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'discountCreditReport?tripFDT_gte=' + fromDate + '&tripFDT_lte=' + toDate })
    }
    else {
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'discountCreditReport?tripFDT_gte=' + fromDate + '&tripFDT_lte=' + toDate + '&scity=' + data.servicecity })

    }
  }

  FilterRes1(data) {
    console.log(data)
    const fromDate = this.datePipe.transform(data.fromDate, 'yyyy-MM-dd');
    const toDate = this.datePipe.transform(data.toDate, 'yyyy-MM-dd')
    console.log(fromDate, toDate)
    if ((data.servicecity == undefined || data.servicecity == 'all') && data.fromDate && data.toDate) {
      this.source1 = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'discountCreditReport/' + this.drvId + '?tripFDT_gte=' + fromDate + '&tripFDT_lte=' + toDate })
    }
    else {
      this.source1 = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'discountCreditReport/' + this.drvId + '?tripFDT_gte=' + fromDate + '&tripFDT_lte=' + toDate })

    }
  }

  route(event) {
    console.log(event.data)
    this.initial = "data"
    this.drvId = event.data.dvrId;
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
    this.source1 = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'discountCreditReport/' + this.drvId + '?tripFDT_gte=' + this.dateObj.fromDate + '&tripFDT_lte=' + this.dateObj.toDate })

  }

  goBack() {
    this.initial = "order"
    setTimeout(() => this.source.setPage(this.currentIndex), 0);
    console.log(this.currentIndex);
  }

  reportname = 'Trip Payments';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Date', 'Trip No', 'Driver Name', 'Driver Phone', 'PromoCode', 'Promo Amount', 'Amount to Driver', 'Commosion', 'Total Amount'],
    showTitle: true,
    title: 'Trip Payments',
    useBom: true,
    removeNewLines: false,
    keys: ['date', 'tripno', 'dvrName', 'dvrPhone', 'promoCode', 'promoAmt', 'amtToDriver', 'commisionAfterDiscount', 'FinalCost'],
  };

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
    this.http.get(AppSettings.API_ENDPOINT
      + 'discountCreditReport?tripFDT_gte='
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
        this.toaster.showtoast('error', res.message);
      });
  }


  exporttoCSV(exportFor, data, from, to) {
    for (const res of data) {
      res['createdAt'] = moment(res.createdAt).utc().format('DD-MM-YYYY HH:mm a');
      res['totalAmount2'] = 'Completed';
      if (res['dvrfname'] == null) {
        res['dvrfname'] = '';
      }
    }
    let title;
    if (from !== '' && to !== '') {
      title = `Trip Payments From ${from} to ${to} `;
    } else if (from !== '' && to === '') {
      title = `Trip Payments From ${from}`;
    } else if (from === '' && to !== '') {
      title = `Trip Payments Upto ${to} `;
    }
    if (exportFor === 'csv') {
      new Angular2Csv(data, this.reportname, this.options);
      this.exportInp = {};
    } else if (exportFor === 'excel') {
      this.exportToExcel(data, title);
      this.exportInp = {};
    }
  }



  name: string;
  sName: string = 'SheetTest';
  excelFileName: string = 'Trip Payments.xlsx';
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['Date', 'Trip No', 'Driver Name', 'Driver Phone', 'PromoCode', 'Promo Amount', 'Amount to Driver', 'Commosion', 'Total Amount'];

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
      { key: 'date', width: 10 },
      { key: 'tripno', width: 13 },
      { key: 'dvrName', width: 10 },
      { key: 'dvrPhone', width: 25 },
      { key: 'promoCode', width: 12 },
      { key: 'promoAmt', width: 12 },
      { key: 'amtToDriver', width: 12 },
      { key: 'commisionAfterDiscount', width: 14 },
      { key: 'FinalCost', width: 14 },
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