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
  selector: 'ngx-trip-booked-daily',
  templateUrl: './trip-booked-daily.component.html',
  styleUrls: ['./trip-booked-daily.component.scss']
})
export class TripBookedDailyComponent implements OnInit {

  dailyHours = [
    { label: '00', value: '00:00 - 01:00' },
    { label: '01', value: '01:00 - 02:00' },
    { label: '02', value: '02:00 - 03:00' },
    { label: '03', value: '03:00 - 04:00' },
    { label: '04', value: '04:00 - 05:00' },
    { label: '05', value: '05:00 - 06:00' },
    { label: '06', value: '06:00 - 07:00' },
    { label: '07', value: '07:00 - 08:00' },
    { label: '08', value: '08:00 - 09:00' },
    { label: '09', value: '09:00 - 10:00' },
    { label: '10', value: '10:00 - 11:00' },
    { label: '11', value: '11:00 - 12:00' },
    { label: '12', value: '12:00 - 13:00' },
    { label: '13', value: '13:00 - 14:00' },
    { label: '14', value: '14:00 - 15:00' },
    { label: '15', value: '15:00 - 16:00' },
    { label: '16', value: '16:00 - 17:00' },
    { label: '17', value: '17:00 - 18:00' },
    { label: '18', value: '18:00 - 19:00' },
    { label: '19', value: '19:00 - 20:00' },
    { label: '20', value: '20:00 - 21:00' },
    { label: '21', value: '21:00 - 22:00' },
    { label: '22', value: '22:00 - 23:00' },
    { label: '23', value: '23:00 - 24:00' },
  ];
  showCity: boolean;
  serviceCity: any;

  ngOnInit() { }
  title: string = 'Trip Booked Report (Daily)';
  dateObj: any;
  list: any;
  
  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      _id: {
        title: 'Trip Hour',
        filter: false,
        sort: false
      },
      app: {
        title: 'From App',
        filter: false,
        sort: false
      },
      admin: {
        title: 'From Manual Taxi Dispatch',
        filter: false,
        sort: false
      },
      hotel: {
        title: 'From Hotel Booking',
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
    this.list.fromDate = new Date();
    this.dateObj.fromDate = this.datePipe.transform(this.list.fromDate, 'yyyy-MM-dd');
    if(featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') =='superadmin' )
    this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity()
    .then(res=>{
      this.serviceCity = res;
    })
    // this.getData();
    this.filterRes(this.list);
  }

  listDataArray = [];

  getData() {
    this.service.getDailyTripBookedReport()
      .then(res => {
        this.listDataArray = res;
        this.source.load(this.checkData());
      });
  }

  checkData() {
    const a = [];
    const final = [];
    this.listDataArray.forEach((el, index) => {
      a.push(el._id);
    });
    let cnt = 0;
    for (let i = 0; i < 24; i++) {
      if (a.includes(this.dailyHours[i].label)) {
        // this.listDataArray[cnt]._id = this.dailyHours[i].value;
        this.listDataArray.forEach((el, index) => {
          // console.log(el._id==this.dailyHours[i].label)
          if(el._id==this.dailyHours[i].label)
         { 
          
      
          this.listDataArray[index]=el;
        this.listDataArray[index]._id = this.dailyHours[i].value;

        }
        });
        final.push(this.listDataArray[cnt]);
        cnt++;
      } else {
        const Obj = {
          _id: this.dailyHours[i].value,
          app: 0,
          admin: 0,
          hotel: 0
        };
    final.sort((a, b) => (a._id > b._id) ? 1 : -1)
        final.push(Obj);
      }
    }
    return final;
  }

  filterRes(data) {
    if (this.dateObj['fromDate'] === undefined) {
      this.toastr.showtoast('warn', 'Select Date');
    } else {
      const fromDate = this.dateObj['fromDate'];
      const city = data.servicecity
      this.service.getDailyTripBookedReportByDate(fromDate,city)
        .then(res => {
          this.listDataArray = res;
          this.source.load(this.checkData());
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


}
