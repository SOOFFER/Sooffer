import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { DatepickerOptions } from 'ng2-datepicker';
import { HttpClient } from '@angular/common/http';
import { TableService } from '../../../table.service';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { AppSettings, featuresSettings } from '../../../../../app.config';
import * as moment from 'moment';
import { CommonService } from '../../../../common/common.service';
import { Angular2Csv } from 'angular2-csv';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';

interface commonDataList {
  value: string;
  label: string;
}

@Component({
  selector: 'ngx-driver-settlement-report',
  templateUrl: './driver-settlement-report.component.html',
})

export class DriverSettlementReportComponent implements OnInit {
  showCity: boolean;
  serviceCityArray: any = [];

  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      child: {
        title: 'View Transaction Details',
        type: 'html',
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          const drname = row.fname;
          return `<a title="View Transaction Details" href="#/pages/tables/report-table/driversettlementreport/driver-transaction-report;driverId=${row._id};driverName=${drname};walletAmt=${row.wallet}">
                  <i class="ion-clipboard"></i></a>`;
        }
      },
      idx: {
        title: 'View Wallet Details',
        type: 'html',
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, row) => {
          const drname = row.fname;
          return `<a title="View Wallet Details" href="#/pages/tables/report-table/driversettlementreport/driver-wallet-report;driverId=${row._id};driverName=${drname};walletAmt=${row.wallet}">
                  <i class="ion-cash"></i></a>`;
        }
      },
      fname: {
        title: 'Driver Name',
      },
      code: {
        title: 'Driver Code'
      },
     
      cityname: {
        title: 'City',
      },
      phone: {
        title: 'Phone',
      },
      wallet: {
        title: 'Wallet'
      }
    },
  };
  Doc: any = {};
  source: ServerDataSource;
  pageNo: number = 0;
  list: any = {};
  payment: Array<commonDataList> = [
    {
      label: 'Debit',
      value: 'debit'
    },
    {
      label: 'Credit',
      value: 'credit'
    }
  ];
  // new Date().getFullYear()
  visibleDateOptions: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2101,
    displayFormat: 'MMM D[,] YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0,
    //minDate: new Date(Date.now() - 86400000), // Minimal selectable date
    barTitleIfEmpty: 'Click to Select a Date',
    placeholder: 'Click to Select a Date',
    addClass: 'form-control',
    useEmptyBarTitle: false
  };

  reportname = 'Driver Settlement Report';
  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Driver Name', 'Code', 'Email id', 'Phone Number', 'Wallet Amount'],
    showTitle: true,
    title: 'Driver Settlement Report',
    useBom: true,
    removeNewLines: false,
    keys: ['drName', 'code', 'email', 'phone', 'wallet'],
  };

  exportInp: any;
  constructor(private http: HttpClient,
    private commonservice: CommonService,
    private tableservice: TableService,
    private toastr: ButtonToasterService
  ) {
    if(featuresSettings.referenceCode==true){
      this.settings.columns["referenceCode"]={
        title:"Reference Code"
      }
    }
    this.list = {};
    this.exportInp = {};
    this.list.paymentDate = '';
    if(featuresSettings.isCityWise === true && featuresSettings.isServiceAvailable === true && localStorage.getItem('userType') ==='superadmin')
    this.showCity = true;
    else 
    this.showCity = false;
    this.tableservice.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      });
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (featuresSettings.isCityWise === true
      && featuresSettings.isServiceAvailable === true
      && localStorage.getItem('userType') === 'superadmin')
      this.showCity = true;
    else this.showCity = false;
  }

  SerachDriverForCity(data): void {
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity === 'undefined')
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    else
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'driver?scity_like=' + data.servicecity });
  }

  ngOnInit() {
  }

  selCity(data) {
    if(data.servicecity == "all")
    this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'driver'});    
    else
    this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'driver?scity_like=' + data.servicecity });
  }

  route(event) {
    this.btnClick(1);
    this.commonservice.doAddFormControlNgSelectClass();
    this.selectedDocs(event.data);
  }

  selectedDocs(data) {
    this.list = data;
    this.list.driverName = data.fname;
    this.list.driverId = data._id;
    this.list.type = 'credit';
    this.list.wallet = data.wallet;
    this.generateCode();
  }

  generateCode(): void {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 7; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.list.trxId = text;
  }

  lesserThanZero(e) {
    let value = e.target.value;
    if (value <= 0) {
      value = 0;
    }
    const ObjectName = e.target.name;
    this.list[ObjectName] = value;
  }

  btnClick(num: number) {
    this.pageNo = num;
    this.list = {};
    this.list.paymentDate = '';
  }

  sendPayment(inputs) {
    if (inputs.amt <= 0) {
      this.toastr.showtoast('warn', 'Please Enter Valid Amount');
    } else {
      const date = moment(inputs.paymentDate).format('YYYY-MM-DD');
      const sendPay = {
        driverId: inputs.driverId,
        driverName: inputs.driverName,
        trxId: this.list.trxId,
        description: inputs.description,
        amt: inputs.amt,
        type: inputs.type,
        paymentDate: date,
        email: this.list.actMail,
        holdername: this.list.actHolder,
        acctNo: this.list.actNo,
        banklocation: this.list.actLoc,
        bankname: this.list.actBank,
        swiftCode: this.list.actCode,
      };
      this.tableservice.sendDriverSettlement(sendPay)
        .then(res => {
          this.toastr.showtoast('success', res.message);
          this.btnClick(0);
        })
        .catch(res => {
          this.toastr.showtoast('error', res.error.message);
        });
    }
  }

  export(event) {
    let exportFor = event.target.value;
    this.http.get(AppSettings.API_ENDPOINT + 'driverListsForExport')
      .toPromise()
      .then(res => {
        const data = res;
        this.exporttoCSV(exportFor, data);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  exporttoCSV(exportFor, data) {
    data.forEach(el => {
      el['drName'] = el.fname + ' ' + el.lname;
    });
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
  excelFileName: string = 'Driver Settlement Report.xlsx';
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  cols = ['Driver Name', 'Code', 'Email id', 'Phone Number', 'Wallet Amount'];

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
      { key: 'drName', width: 16 },
      { key: 'code', width: 14 },
      { key: 'email', width: 25 },
      { key: 'phone', width: 15 },
      { key: 'wallet', width: 18 },
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
