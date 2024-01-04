import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../../app.config';
import { MyTripService } from './trips.service';
import * as moment from 'moment';

@Component({
  selector: "ridertrips",
  templateUrl: './trips.html',
  styleUrls: ['./trip.css'],
  providers: [DatePipe, MyTripService],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class RiderTripsComponent implements OnInit {

  makeary: any[] = [];
  modelary: any[] = [];
  yearary: any[] = [];
  companyary: any[] = [];
  driverary: any[] = [];
  vehicleary: any[] = [];
  tripdetails: any[] = [];
  tripcspdetails: any[] = [];
  tripdspdetails: any;
  path: any;
  center = '0, -180';
  private id;
  list: any = {};
  index = 1;
  columnsToDisplay = ['tripno', 'triptype', 'date', 'cpy', 'dvr', 'rid', 'fare', 'taxi', 'status', 'actions'];
  displayedColumns: string[] = ['tripno', 'triptype', 'date', 'fare', 'taxi', 'status', 'actions'];
  dataSource: MatTableDataSource<any>; // any = [];
  filedata: any;
  expiryDate: any;
  selectedid: any;
  taxiMessage: string;
  singleTaxiId: any;
  baseurl: string = AppSettings.BASEURL;
  show = false;
  tabShow = true;
  defaultUnit = AppSettings.defaultUnit;
  defaultTime = AppSettings.defaultTime;
  defaultCur = AppSettings.defaultcur;
  triptypes: any = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private datePipe: DatePipe, private tService: MyTripService) {

  }
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  goToInvoice(id) {
    if (id.triptype === 'daily') {
      this.triptypes = 'daily';
      console.log(id);
      this.tripdetails = id;
      // this.tripdspdetails = id.dsp[0];
      // this.tripcspdetails = id.csp[0];
      // this.path = [
      //   { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
      //   { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
      // ];
      this.tripdspdetails = id.adsp;
      this.tripcspdetails = id.acsp;
      this.path = [
        { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
        { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
      ];
      this.show = true;
      this.tabShow = false;
      this.tripcspdetails['actualcost'] = this.convertAmount(this.tripcspdetails['actualcost']);
      this.tripcspdetails['base'] = this.convertAmount(this.tripcspdetails['base']);
      this.tripcspdetails['distfare'] = this.convertAmount(this.tripcspdetails['distfare']);
      this.tripcspdetails['timefare'] = this.convertAmount(this.tripcspdetails['timefare']);
      this.tripcspdetails['waitingCharge'] = this.convertAmount(this.tripcspdetails['waitingCharge']);
      this.tripcspdetails['detect'] = this.convertAmount(this.tripcspdetails['detect']);
      this.tripcspdetails['tax'] = this.convertAmount(this.tripcspdetails['tax']);
      this.tripcspdetails['cost'] = this.convertAmount(this.tripcspdetails['cost']);
      this.tripcspdetails['startTime'] = moment(this.tripcspdetails['startTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').utc().format('hh:mm a');
      this.tripcspdetails['endTime'] = moment(this.tripcspdetails['endTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').utc().format('hh:mm a');
    } else if (id.triptype === 'rental') {
      this.triptypes = 'rental';
      console.log(id);
      this.tripdetails = id;
      // this.tripdspdetails = id.dsp[0];
      // this.tripcspdetails = id.csp[0];
      // this.path = [
      //   { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
      //   { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
      // ];
      this.tripdspdetails = id.adsp;
      this.tripcspdetails = id.acsp;
      this.path = [
        { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
        { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
      ];
      this.show = true;
      this.tabShow = false;
      this.tripcspdetails['actualcost'] = this.convertAmount(this.tripcspdetails['actualcost']);
      this.tripcspdetails['base'] = this.convertAmount(this.tripcspdetails['base']);
      this.tripcspdetails['distfare'] = this.convertAmount(this.tripcspdetails['distfare']);
      this.tripcspdetails['timefare'] = this.convertAmount(this.tripcspdetails['timefare']);
      this.tripcspdetails['fareForExtraKM'] = this.convertAmount(this.tripcspdetails['fareForExtraKM']);
      this.tripcspdetails['fareForExtraTime'] = this.convertAmount(this.tripcspdetails['fareForExtraTime']);
      this.tripcspdetails['waitingCharge'] = this.convertAmount(this.tripcspdetails['waitingCharge']);
      this.tripcspdetails['detect'] = this.convertAmount(this.tripcspdetails['detect']);
      this.tripcspdetails['tax'] = this.convertAmount(this.tripcspdetails['tax']);
      this.tripcspdetails['cost'] = this.convertAmount(this.tripcspdetails['cost']);
      this.tripcspdetails['startTime'] = moment(this.tripcspdetails['startTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').utc().format('hh:mm a');
      this.tripcspdetails['endTime'] = moment(this.tripcspdetails['endTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').utc().format('hh:mm a');
      this.tripcspdetails['conveyance'] = this.convertAmount(this.tripcspdetails['conveyance']);
      this.tripcspdetails['hillFare'] = this.convertAmount(this.tripcspdetails['hillFare']);
    } else if (id.triptype === 'outstation') {
      this.triptypes = 'outstation';
      console.log(id);
      this.tripdetails = id;
      // this.tripdspdetails = id.dsp[0];
      // this.tripcspdetails = id.csp[0];
      // this.path = [
      //   { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
      //   { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
      // ];
      this.tripdspdetails = id.adsp;
      this.tripcspdetails = id.acsp;
      this.path = [
        { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
        { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
      ];
      this.show = true;
      this.tabShow = false;
      this.tripcspdetails['actualcost'] = this.convertAmount(this.tripcspdetails['actualcost']);
      this.tripcspdetails['base'] = this.convertAmount(this.tripcspdetails['base']);
      this.tripcspdetails['distfare'] = this.convertAmount(this.tripcspdetails['distfare']);
      this.tripcspdetails['timefare'] = this.convertAmount(this.tripcspdetails['timefare']);
      this.tripcspdetails['fareForExtraKM'] = this.convertAmount(this.tripcspdetails['fareForExtraKM']);
      this.tripcspdetails['fareForExtraTime'] = this.convertAmount(this.tripcspdetails['fareForExtraTime']);
      this.tripcspdetails['waitingCharge'] = this.convertAmount(this.tripcspdetails['waitingCharge']);
      this.tripcspdetails['detect'] = this.convertAmount(this.tripcspdetails['detect']);
      this.tripcspdetails['tax'] = this.convertAmount(this.tripcspdetails['tax']);
      this.tripcspdetails['cost'] = this.convertAmount(this.tripcspdetails['cost']);
      this.tripcspdetails['startTime'] = moment(this.tripcspdetails['startTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').utc().format('hh:mm a');
      this.tripcspdetails['endTime'] = moment(this.tripcspdetails['endTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').utc().format('hh:mm a');
      this.tripcspdetails['conveyance'] = this.convertAmount(this.tripcspdetails['conveyance']);
      this.tripcspdetails['hillFare'] = this.convertAmount(this.tripcspdetails['hillFare']);
    }


  }

  convertAmount(data) {
    return parseFloat(data).toFixed(2);
  }

  goBack() {
    this.show = false;
    this.tabShow = true;
    this.triptypes = '';
  }

  ngOnInit() {
    this.id = localStorage.getItem('Id');
    this.tService.RiderTripDetails(this.id).then(
      res => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;

        //    console.log(res);
      });
  }

}

