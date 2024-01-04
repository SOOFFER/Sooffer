import { Component, ElementRef, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../../app.config';
import { RiderWalletService } from './wallet.service';

@Component({
  selector: "riderwallet",
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.css'],
  providers: [DatePipe, RiderWalletService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RiderWalletComponent {
  makeary: any[] = [];
  modelary: any[] = [];
  yearary: any[] = [];
  companyary: any[] = [];
  driverary: any[] = [];
  vehicleary: any[] = [];
  private id;
  list: any = {};
  index = 1;
  columnsToDisplay = ['tripno', 'date', 'cpy', 'dvr', 'rid', 'fare', 'taxi', 'status'];
  displayedColumns = ['amt', 'date', 'trxid', 'type']; //,'rid','fare','taxi','status'];
  dataSource: MatTableDataSource<any>;
  filedata: any;
  expiryDate: any;
  selectedid: any;
  taxiMessage: string;
  singleTaxiId: any;
  baseurl: string = AppSettings.BASEURL;
  // tripno
  // date
  // cpy
  // dvr
  // rid
  // fare
  // taxi
  // status
  // Via->return csp[0]['via'];
  constructor(private datePipe: DatePipe, private tService: RiderWalletService) {

  }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.id = localStorage.getItem('Id');
    this.tService.RiderWalletDetails().then(
      res => {
        console.log(res.transaction);
        this.dataSource = new MatTableDataSource(res.transaction);
        this.dataSource.paginator = this.paginator;
        //    console.log(res);
      });

  }

}

