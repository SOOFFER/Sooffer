import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../../app.config';
import { MyTripService } from './trips.service';
import * as moment from "moment";

@Component({
  selector: "trips",
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

export class TripsComponent implements OnInit {

  makeary: any[] = [];
  modelary: any[] = [];
  yearary: any[] = [];
  companyary: any[] = [];
  driverary: any[] = [];
  vehicleary: any[] = [];
  private id;
  list: any = {};
  index = 1;
  columnsToDisplay = ['tripno', 'date', 'cpy', 'dvr', 'rid', 'fare', 'taxi', 'status', 'actions'];
  displayedColumns: string[] = ['tripno', 'date', 'fare', 'taxi', 'status', 'actions'];
  dataSource: any = [];
  filedata: any;
  expiryDate: any;
  selectedid: any;
  taxiMessage: string;
  singleTaxiId: any;
  baseurl: string = AppSettings.BASEURL;
  peakchargechargeApplied: boolean = false;
  path: any;
  center = '0, -180';
  tripdetails: any;
  tripcspdetails: any[] = [];
  tripdspdetails: any;
  show = false;
  tabShow = true;
  defaultUnit = AppSettings.defaultUnit;
  defaultTime = AppSettings.defaultTime;
  fareDetails: any;
  PeakCharge: number;
  nightChargeApplied: boolean = false;
  NightCharge: number;
  defaultCur = AppSettings.defaultcur;
  pickupcharge: any;
  currentPage = 0;
  startTime: string;
  endTime: string;
  constructor(private datePipe: DatePipe, private tService: MyTripService) {
    this.id = localStorage.getItem('Id');
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.tService.TripDetails().then(
      res => {
        // this.dataSource = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageIndex = this.currentPage;
        //    console.log(res);
      });
     
  }

  goToInvoice(id) {
    // console.log(id);
    let data = id.acsp
    this.tripdetails = id;
    console.log(this.tripdetails)
    // this.tripdspdetails = id.dsp[0];
    // this.tripcspdetails = id.csp[0];
    // this.path = [
    //   { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
    //   { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
    // ];
    this.tripdetails.request = this.RequsetFrom(
      this.tripdetails.requestFrom
    )
    this.tripdspdetails = id.adsp;
    this.tripcspdetails = id.acsp;
    this.startTime = moment(data.startTime, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format("DD-MM-YYYY hh:mm A");
    this.endTime = moment(data.endTime, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format("DD-MM-YYYY hh:mm A");
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
    this.tripcspdetails['cost'] = this.convertAmount(this.tripcspdetails['cost']);
    this.fareDetails = {
      fareType: data.fareType ? data.fareType : "N/A",
      actualcost: this.amountToBeFloater(data.actualcost),
      tollFee: this.amountToBeFloater(data.tollFee),
      gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

      dist: data.dist ? data.dist : "0",
      distfare: this.amountToBeFloater(data.distfare),
      base: this.amountToBeFloater(data.base),
      waitingTime: data.waitingTime ? data.waitingTime : "0",
      waitingRate: data.waitingRate ? data.waitingRate : "0",
      waitingCharge: this.amountToBeFloater(data.waitingCharge),
      currency:
        data.currency !== undefined ? data.currency : this.defaultCur,
      time: data.time ? data.time : "0",
      timeRate: this.amountToBeFloater(data.timeRate),
      timefare: this.amountToBeFloater(data.timefare),
      minFare: this.amountToBeFloater(data.minFare),
      travelRate: this.amountToBeFloater(data.travelRate),
      travelFare: this.amountToBeFloater(data.travelFare),
      minFareAdded: this.amountToBeFloater(data.minFareAdded),
      tax: this.amountToBeFloater(data.tax),
      taxTDS: this.amountToBeFloater(data.taxTDS),
      taxTDSPercentage: this.amountToBeFloater(data.taxTDSPercentage),
      googleCharge: this.amountToBeFloater(data.googleCharge),
      oldBalance: this.amountToBeFloater(data.oldBalance),
      nightCharge: this.checkNightcharge(
        data.isNight,
        data.cost,
        data.fareAmtBeforeSurge
      ),
      peakCharge: this.checkPeakcharge(
        data.isPeak,
        data.cost,
        data.fareAmtBeforeSurge
      ),
      nightChargeRate: this.amountToBeFloater(data.nightPer),
      discountName: data.discountName ? data.discountName : "N/A",
      discountPercentage: data.discountPercentage
        ? data.discountPercentage
        : 0,
      detect: this.amountToBeFloater(data.detect),
      via: data.via ? data.via : "N/A",
      cost: data.cost ? data.cost : "N/A",
      booking: this.amountToBeFloater(data.booking),
      taxPercentage: this.amountToBeFloater(data.taxPercentage),
      surgeAmt: this.amountToBeFloater(data.surgeAmt),
      surgeReason: data.surgeReason ? data.surgeReason : "Not Applied",
      nightPer: this.amountToBeFloater(data.nightPer),
      peakPer: this.amountToBeFloater(data.peakPer),
      startTime: data.startTime
        ? moment(data.startTime, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format(
          "DD-MM-YYYY hh:mm A"
        )
        : "N/A",
      endTime: data.endTime
        ? moment(data.endTime, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format(
          "DD-MM-YYYY hh:mm A"
        )
        : "N/A",
        // this.tripdetails.request = this.RequsetFrom(
        //   this.tripdetails.requestFrom
        // );
    };
    if (data.conveyance > 0) {
      this.fareDetails.conveyance = this.amountToBeFloater(data.conveyance);
      this.pickupcharge = true;
    }
    
  }
  amountToBeFloater(num) {
    if (num) {
      return parseFloat(num).toFixed(2);
    } else return "0.00";
  }
  checkPeakcharge(data, cost, fareAmt) {
    if (data === true) {
      this.peakchargechargeApplied = true;
      this.PeakCharge = cost - fareAmt;
      return this.PeakCharge;
    } else {
      this.peakchargechargeApplied = false;
      return "Not Applied";
    }
  }
  checkNightcharge(data, cost, fareAmt) {
    console.log("Night Charge", data);
    if (data === true) {
      this.nightChargeApplied = true;
      this.NightCharge = cost - fareAmt;
      const x = this.NightCharge.toFixed(3);
      return x;
    } else {
      this.nightChargeApplied = false;
      return "Not Applied";
    }
  }
  convertAmount(data) {
    return parseFloat(data).toFixed(2);
  }
  RequsetFrom(data) {
    if (data === "admin") {
      return "Request From Admin";
    } else if (data === "web") {
      return "Request From Website";
    } else {
      return "Request From Mobile";
    }
  }
  goBack() {
    this.show = false;
    this.tabShow = true;
    this.tService.TripDetails().then(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageIndex = this.currentPage;
      });
  }
  onPaginateChange(event){
    console.log(event)
    this.currentPage= event.pageIndex
  }

}

