import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MyTripService } from '../ridertrips/trips.service';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { AppSettings } from 'src/app/app.config';
import * as moment from 'moment';
import { AngularFireDatabase } from '@angular/fire/database';
import { SectionService } from '../section/section.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-processing-trips',
  templateUrl: './processing-trips.component.html',
  providers: [MyTripService, SectionService],
  styleUrls: ['./processing-trips.component.css']
})
export class ProcessingTripsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['tripno', 'triptype', 'date', 'vehicle', 'fare', 'status', 'actions'];
  data: any = [];
  title = 'My Trips';
  initial = '';
  resultsLength = 0;
  listPage = 'showTable';
  selectedTripDetails: any = {};

  defaultUnit = AppSettings.defaultUnit;
  defaultTime = AppSettings.defaultTime;
  defaultCur = AppSettings.defaultcur;

  rentalFare: any = {};
  outStationFare: any = {};
  dailyFare: any = {};

  nightChargeApplied = false; pickupcharge = false;
  setIntervalVariable; spinnerTimeout: any;
  tripvalueChanged$ = new Subject();
  showBackBtn = false;

  temp: string = AppSettings.BASEURL;
  bookedDriverDetails; bookedTaxiDetails; bookedLocationDetails; overallBooked;

  trackingScreenDetails: any = {};
  firebaseTripStatus = new BehaviorSubject<string>('');
  showTripEndedDetails: any = {};
  getFeedbackDetails: any = {}; showNoDriver = false; showErrorRes;

  @ViewChild(MatPaginator, {}) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  fareDetails: any;
  peakchargechargeApplied: boolean;
  PeakCharge: number;
  NightCharge: number;
  endTime: string;
  startTime: string;

  constructor(private _httpClient: HttpClient,
    private toastr: ButtonToasterService,
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService,
    private router: Router,
    private actRouter: ActivatedRoute,
    private sectionService: SectionService,
    private tripsService: MyTripService) {
    this.getData();
  }

  getSingleData() {
    this.actRouter.queryParams.subscribe(params => {
      if (params['tripId']) {
        const tripid = params['tripId'];
        this.data.forEach(el => {
          if (el.tripno == tripid) {
            this.getTrip(el);
          }
        });
      }
    });
  }
  currentPage = 0;
  getData() {
    this.spinner.show();
    this.clearData();
    const riderId = localStorage.getItem('Id');
    this.tripsService.RiderTripDetails(riderId)
      .then(res => {
        this.data = res;
        this.resultsLength = res ? res.length : 0;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageIndex = this.currentPage;
        this.getSingleData();
        this.spinner.hide();
      })
      .catch(res => {
        this.resultsLength = 0;
        this.toastr.showtoast('error', res.message);
        this.spinner.hide();
      });
  }

  clearData() {
    this.listPage = 'showTable';
    this.showBackBtn = false;
    this.nightChargeApplied = false;
    this.pickupcharge = false;
    this.showNoDriver = false;
    this.trackingScreenDetails.tripstatus = '';
    this.showTripEndedDetails = {};
    this.bookedDriverDetails = '';
    this.bookedTaxiDetails = '';
    this.bookedLocationDetails = '';
    this.overallBooked = '';
  }

  ngOnInit() {
    this.spinner.show();
    this.spinnerTimeout = setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  goBack() {
    this.router.navigate([], {
      queryParams: {
        tripId: null,
      },
      queryParamsHandling: 'merge'
    });
    this.stopListeningTripStatus();
    clearInterval(this.setIntervalVariable);
    clearTimeout(this.spinnerTimeout);
    this.getData();
  }

  getTrip(data) {
    console.log(data)
    this.spinner.show();
    this.spinnerTimeout = setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.listPage = 'showDetails';
    this.showBackBtn = true;
    this.showNoDriver = false;
    this.showErrorRes = '';
    // console.log(data);
    this.selectedTripDetails = data;
    this.startTime = moment(data.acsp.startTime, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format("DD-MM-YYYY hh:mm A");
    this.endTime = moment(data.acsp.endTime, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format("DD-MM-YYYY hh:mm A");
    if (data.triptype === 'daily') {
      this.setDailyFare(data);
    } else if (data.triptype === 'rental') {
      this.setRentalFare(data);
    } else if (data.triptype === 'outstation') {
      this.setOutstationFare(data);
    }
    if (data.status !== 'Finished') {
      this.getDriverDetails(this.selectedTripDetails.tripno);
      this.getTripBookedDetails(this.selectedTripDetails.tripno);
    }
  }

  setRentalFare(rentaldetails) {
    let data = rentaldetails.acsp;
    // this.selectedTripDetails['startTime'] = moment(tripFare['startTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('DD-MM-YYYY hh:mm a');
    // this.selectedTripDetails['endTime'] = moment(tripFare['endTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('DD-MM-YYYY hh:mm a');
    // this.selectedTripDetails['distanceKM'] = tripFare['dist'];
    // this.selectedTripDetails['totalTime'] = tripFare['time'];
    // this.rentalFare['packageName'] = tripFare['packageName'];
    // this.rentalFare['discountName'] = tripFare['discountName'];
    // this.rentalFare['discountPercentage'] = tripFare['discountPercentage'];
    // this.rentalFare['via'] = tripFare['via'];
    // this.rentalFare['actualcost'] = this.convertAmount(tripFare['actualcost']);
    // this.rentalFare['perKmRate'] = this.convertAmount(tripFare['perKmRate']);
    // this.rentalFare['base'] = this.convertAmount(tripFare['base']);
    // this.rentalFare['distfare'] = this.convertAmount(tripFare['distfare']);
    // this.rentalFare['timefare'] = this.convertAmount(tripFare['timefare']);
    // this.rentalFare['fareForExtraKM'] = this.convertAmount(tripFare['fareForExtraKM']);
    // this.rentalFare['fareForExtraTime'] = this.convertAmount(tripFare['fareForExtraTime']);
    // this.rentalFare['waitingCharge'] = this.convertAmount(tripFare['waitingCharge']);
    // this.rentalFare['detect'] = this.convertAmount(tripFare['detect']);
    // this.rentalFare['tax'] = this.convertAmount(tripFare['tax']);
    // this.rentalFare['cost'] = this.convertAmount(tripFare['cost']);
    // this.rentalFare['conveyance'] = this.convertAmount(tripFare['conveyance']);
    // this.rentalFare['hillFare'] = this.convertAmount(tripFare['hillFare']);
    this.fareDetails = {
      gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

      tollFee: this.amountToBeFloater(data.tollFee),
      // taxTDS: data.taxTDS,
      taxTDS: this.amountToBeFloater(data.taxTDS),
      //packageDetails
      taxTDSPercentage: this.amountToBeFloater(data.taxTDSPercentage),
      fareType: data.fareType ? data.fareType : "N/A",
      actualcost: this.amountToBeFloater(data.actualcost),
      dist: data.dist ? data.dist : "0",
      distfare: this.amountToBeFloater(data.distfare),
      base: this.amountToBeFloater(data.base),
      waitingTime: data.waitingTime ? data.waitingTime : "0",
      waitingCharge: this.amountToBeFloater(data.waitingCharge),
      currency:
        data.currency !== undefined ? data.currency : this.defaultCur,
      time: this.amountToBeFloater(data.time),
      timefare: this.amountToBeFloater(data.timefare),
      timeRate: this.amountToBeFloater(data.timeRate),
      minFare: this.amountToBeFloater(data.minFare),
      travelRate: this.amountToBeFloater(data.travelRate),
      travelFare: this.amountToBeFloater(data.travelFare),
      taxPercentage: this.amountToBeFloater(data.taxPercentage),
      minFareAdded: this.amountToBeFloater(data.minFareAdded),
      booking: this.amountToBeFloater(data.booking),
      tax: this.amountToBeFloater(data.tax),
      googleCharge: this.amountToBeFloater(data.googleCharge),
      oldBalance: this.amountToBeFloater(data.oldBalance),
      nightCharge: this.checkNightcharge(
        data.isNight,
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
      startMeter: data.startMeter ? data.startMeter : "N/A",
      endMeter: data.endMeter ? data.endMeter : "N/A",
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
    };
    if (data.conveyance > 0) {
      this.fareDetails.conveyance = this.amountToBeFloater(data.conveyance);
      this.pickupcharge = true;
    }
    this.rentalFare = {
      packageName: data.packageName,
      tollFee: this.amountToBeFloater(data.tollFee),
      base: this.amountToBeFloater(data.base),
      gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

      // taxTDS: data.taxTDS,
      taxTDS: this.amountToBeFloater(data.taxTDS),

      taxTDSPercentage: this.amountToBeFloater(data.taxTDSPercentage),
      dist: data.dist ? data.dist : "0",
      distfare: this.amountToBeFloater(data.distfare),
      perKmRate: this.amountToBeFloater(data.perKmRate),
      fareForExtraKM: this.amountToBeFloater(data.fareForExtraKM),
      timefare: this.amountToBeFloater(data.timefare),
      //  gatewayCharge:this.amountToBeFloater(data.gatewayCharge),
      timeRate: this.amountToBeFloater(data.timeRate),
      time: this.amountToBeFloater(data.time),
      tax: this.amountToBeFloater(data.tax),
      googleCharge: this.amountToBeFloater(data.googleCharge),
      minFare: this.amountToBeFloater(data.minFare),
      travelRate: this.amountToBeFloater(data.travelRate),
      travelFare: this.amountToBeFloater(data.travelFare),
      taxPercentage: this.amountToBeFloater(data.taxPercentage),
      minFareAdded: this.amountToBeFloater(data.minFareAdded),
      booking: this.amountToBeFloater(data.booking),
      fareForExtraTime: this.amountToBeFloater(data.fareForExtraTime),
      conveyance: this.amountToBeFloater(data.conveyance),
      discountName: data.discountName ? data.discountName : "N/A",
      discountPercentage: data.discountPercentage
        ? data.discountPercentage
        : 0,
      detect: this.amountToBeFloater(data.detect),
      hillFare: this.amountToBeFloater(data.hillFare),
      via: data.via ? data.via : "N/A",
      cost: data.cost ? data.cost : "N/A",
      currency:
        data.currency !== undefined ? data.currency : this.defaultCur,
      noOfNights: data.noOfNights,
      nightRate: this.amountToBeFloater(data.nightRate),
      nightFare: this.amountToBeFloater(data.nightFare),
      noOfDays: data.noOfDays,
      dayFare: this.amountToBeFloater(data.dayFare),
      dayRate: this.amountToBeFloater(data.dayRate),
    };
  }

  setOutstationFare(data) {
    const tripFare = data.acsp;
    // this.selectedTripDetails['startTime'] = moment(tripFare['startTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('DD-MM-YYYY hh:mm a');
    // this.selectedTripDetails['endTime'] = moment(tripFare['endTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('DD-MM-YYYY hh:mm a');
    // this.selectedTripDetails['distanceKM'] = tripFare['dist'];
    // this.selectedTripDetails['totalTime'] = tripFare['time'];
    // this.outStationFare['packageName'] = tripFare['packageName'];
    // this.outStationFare['discountName'] = tripFare['discountName'];
    // this.outStationFare['discountPercentage'] = tripFare['discountPercentage'];
    // this.outStationFare['via'] = tripFare['via'];
    // this.outStationFare['actualcost'] = this.convertAmount(tripFare['actualcost']);
    // this.outStationFare['perKmRate'] = this.convertAmount(tripFare['perKmRate']);
    // this.outStationFare['base'] = this.convertAmount(tripFare['base']);
    // this.outStationFare['distfare'] = this.convertAmount(tripFare['distfare']);
    // this.outStationFare['timefare'] = this.convertAmount(tripFare['timefare']);
    // this.outStationFare['fareForExtraKM'] = this.convertAmount(tripFare['fareForExtraKM']);
    // this.outStationFare['fareForExtraTime'] = this.convertAmount(tripFare['fareForExtraTime']);
    // this.outStationFare['waitingCharge'] = this.convertAmount(tripFare['waitingCharge']);
    // this.outStationFare['detect'] = this.convertAmount(tripFare['detect']);
    // this.outStationFare['tax'] = this.convertAmount(tripFare['tax']);
    // this.outStationFare['cost'] = this.convertAmount(tripFare['cost']);
    // this.outStationFare['conveyance'] = this.convertAmount(tripFare['conveyance']);
    // this.outStationFare['hillFare'] = this.convertAmount(tripFare['hillFare']);
    this.fareDetails = {
      tollFee: this.amountToBeFloater(data.tollFee),
      gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

      // taxTDS: data.taxTDS,
      taxTDS: this.amountToBeFloater(data.taxTDS),

      taxTDSPercentage: this.amountToBeFloater(data.taxTDSPercentage),
      fareType: data.fareType ? data.fareType : "N/A",
      actualcost: this.amountToBeFloater(data.actualcost),
      dist: data.dist ? data.dist : "0",
      distfare: this.amountToBeFloater(data.distfare),
      base: this.amountToBeFloater(data.base),
      waitingTime: data.waitingTime ? data.waitingTime : "0",
      waitingCharge: this.amountToBeFloater(data.waitingCharge),
      currency:
        data.currency !== undefined ? data.currency : this.defaultCur,
      time: this.amountToBeFloater(data.time),
      timefare: this.amountToBeFloater(data.timefare),
      timeRate: this.amountToBeFloater(data.timeRate),
      minFare: this.amountToBeFloater(data.minFare),
      travelFare: this.amountToBeFloater(data.travelFare),
      travelRate: this.amountToBeFloater(data.travelRate),
      taxPercentage: this.amountToBeFloater(data.taxPercentage),
      minFareAdded: this.amountToBeFloater(data.minFareAdded),
      booking: this.amountToBeFloater(data.amountToBeFloater),
      tax: this.amountToBeFloater(data.tax),
      googleCharge: this.amountToBeFloater(data.googleCharge),
      oldBalance: this.amountToBeFloater(data.oldBalance),
      nightCharge: this.checkNightcharge(
        data.isNight,
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
      startMeter: data.startMeter ? data.startMeter : "N/A",
      endMeter: data.endMeter ? data.endMeter : "N/A",
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
    };
    if (data.conveyance > 0) {
      this.fareDetails.conveyance = this.amountToBeFloater(data.conveyance);
      this.pickupcharge = true;
    }

    this.outStationFare = {
      tollFee: this.amountToBeFloater(data.tollFee),
      // taxTDS: data.taxTDS,
      taxTDS: this.amountToBeFloater(data.taxTDS),
      base: this.amountToBeFloater(data.base),

      taxTDSPercentage: this.amountToBeFloater(data.taxTDSPercentage),
      packageName: data.packageName,
      dist: data.dist ? data.dist : "0",
      distfare: this.amountToBeFloater(data.distfare),
      perKmRate: this.amountToBeFloater(data.perKmRate),
      fareForExtraKM: this.amountToBeFloater(data.fareForExtraKM),
      timefare: this.amountToBeFloater(data.timefare),
      timeRate: this.amountToBeFloater(data.timeRate),
      time: this.amountToBeFloater(data.time),
      minFare: this.amountToBeFloater(data.minFare),
      travelFare: this.amountToBeFloater(data.travelFare),
      travelRate: this.amountToBeFloater(data.travelRate),
      tax: this.amountToBeFloater(data.tax),
      gatewayCharge: this.amountToBeFloater(data.gatewayCharge),
      googleCharge: this.amountToBeFloater(data.googleCharge),
      taxPercentage: this.amountToBeFloater(data.taxPercentage),
      minFareAdded: this.amountToBeFloater(data.minFareAdded),
      booking: this.amountToBeFloater(data.booking),
      fareForExtraTime: this.amountToBeFloater(data.fareForExtraTime),
      conveyance: this.amountToBeFloater(data.conveyance),
      discountName: data.discountName ? data.discountName : "N/A",
      discountPercentage: data.discountPercentage
        ? data.discountPercentage
        : 0,
      detect: this.amountToBeFloater(data.detect),
      hillFare: this.amountToBeFloater(data.hillFare),
      via: data.via ? data.via : "N/A",
      cost: data.cost ? data.cost : "N/A",
      currency:
        data.currency !== undefined ? data.currency : this.defaultCur,
      noOfNights: data.noOfNights,
      nightRate: this.amountToBeFloater(data.nightRate),
      nightFare: this.amountToBeFloater(data.nightFare),
      noOfDays: data.noOfDays,
      dayFare: this.amountToBeFloater(data.dayFare),
      dayRate: this.amountToBeFloater(data.dayRate),
    };
  }

  setDailyFare(details) {
    let data = details.acsp;
    // const tripFare = data.acsp;
    // this.selectedTripDetails['startTime'] = moment(tripFare['startTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('DD-MM-YYYY hh:mm a');
    // this.selectedTripDetails['endTime'] = moment(tripFare['endTime'], 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('DD-MM-YYYY hh:mm a');
    // this.selectedTripDetails['distanceKM'] = tripFare['dist'];
    // this.selectedTripDetails['totalTime'] = tripFare['time'];
    // this.dailyFare['fareType'] = tripFare['fareType'];
    // this.dailyFare['dist'] = tripFare['dist'];
    // this.dailyFare['waitingTime'] = tripFare['waitingTime'];
    // this.dailyFare['time'] = tripFare['time'];
    // this.dailyFare['via'] = tripFare['via'];
    // this.dailyFare['oldBalance'] = this.convertAmount(tripFare['oldBalance']);
    // // this.dailyFare['nightCharge'] = this.checkNightcharge(tripFare['nightChargeApplied']);
    // this.dailyFare['conveyance'] = this.convertAmount(tripFare['conveyance']);
    // this.dailyFare['discountName'] = tripFare['discountName'];
    // this.dailyFare['discountPercentage'] = tripFare['discountPercentage'];
    // this.dailyFare['actualcost'] = this.convertAmount(tripFare['actualcost']);
    // this.dailyFare['base'] = this.convertAmount(tripFare['base']);
    // this.dailyFare['distfare'] = this.convertAmount(tripFare['distfare']);
    // this.dailyFare['timefare'] = this.convertAmount(tripFare['timefare']);
    // this.dailyFare['waitingCharge'] = this.convertAmount(tripFare['waitingCharge']);
    // this.dailyFare['detect'] = this.convertAmount(tripFare['detect']);
    // this.dailyFare['tax'] = this.convertAmount(tripFare['tax']);
    // this.dailyFare['cost'] = this.convertAmount(tripFare['cost']);
    // if (tripFare.conveyance > 0) {
    //   this.dailyFare.conveyance = this.convertAmount(tripFare.conveyance);
    //   this.pickupcharge = true;
    // }
    // if (status === "Finished") {
      this.dailyFare = {
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
      };
      if (data.conveyance > 0) {
        this.fareDetails.conveyance = this.amountToBeFloater(data.conveyance);
        this.pickupcharge = true;
      }
      // if (this.fareType === "indiaGst") {
      //   this.showFare = true;
      //   const customerTaxCal = data.acsp.tax1 / 2;
      //   const customerFare =
      //     data.acsp.fare1 - customerTaxCal - customerTaxCal;
      //   this.rideFeeDetails.rideFare = this.amountToBeFloater(customerFare);
      //   this.rideFeeDetails.cgst = this.amountToBeFloater(customerTaxCal);
      //   this.rideFeeDetails.sgst = this.amountToBeFloater(customerTaxCal);
      //   this.rideFeeDetails.totalFare = this.amountToBeFloater(
      //     data.acsp.fare1
      //   );

      //   const convTaxCal = data.acsp.tax2 / 2;
      //   const convFare = data.acsp.fare2 - convTaxCal - convTaxCal;
      //   this.convenienceFeeDetails.rideFee = this.amountToBeFloater(convFare);
      //   this.convenienceFeeDetails.cgst = this.amountToBeFloater(convTaxCal);
      //   this.convenienceFeeDetails.sgst = this.amountToBeFloater(convTaxCal);
      //   this.convenienceFeeDetails.totalFare = this.amountToBeFloater(
      //     data.acsp.fare2
      //   );
      //   const total = data.acsp.fare1 + data.acsp.fare2;
      //   this.rideFeeDetails.total = this.amountToBeFloater(total);
      // }
    // } 
  }

  convertAmount(data) {
    return parseFloat(data).toFixed(2);
  }



  /** Listen Trip From Firebase */

  getDriverDetails(tripid) {
    const trip = { tripId: tripid };
    this.spinner.show();
    this.sectionService.getDriverDetailsForATrip(trip)
      .then(res => {
        this.showNoDriver = false;
        this.showErrorRes = '';
        this.overallBooked = res;
        this.bookedDriverDetails = res['driver'][0].profile;
        this.bookedTaxiDetails = res['driver'][1].currentActiveTaxi;
        this.bookedLocationDetails = res.pickupdetails;
        this.bookedTaxiDetails.taxiDet = this.bookedTaxiDetails.vehicletype
          + ' -- ' + this.bookedTaxiDetails.makename + ' -- '
          + this.bookedTaxiDetails.model + ' | ' + this.bookedTaxiDetails.licence;
        this.bookedDriverDetails.drivDet = this.bookedDriverDetails.fname + ' -- ' + this.bookedDriverDetails.phone;
        this.initial = 'trackingScreen';
        this.spinnerTimeout = setTimeout(() => {
          this.spinner.hide();
        }, 3000);
      })
      .catch(response => {
        this.spinner.hide();
        this.showNoDriver = true;
        this.showErrorRes = response.message;
        this.toastr.showtoast('error', response.message);
      });
  }

  doStuff(d) {  /* console.log(d) */ }

  getTripBookedDetails(tripid) {
    this.setIntervalVariable = setInterval(() => {
      return this.db.database.ref('trips_data/' + tripid)
        .on('value', snap => {
          if (snap.val() === null) {
            console.log('null');
            this.showNoDriver = true;
          } else {
            this.showNoDriver = false;
            this.finalTripDetails(snap.val());
          }
        });
    }, 1000);
  }

  finalTripDetails(data) {
    // console.log(data);
    this.trackingScreenDetails.tripstatus = '';
    this.tripvalueChanged$.next(data);
    // tslint:disable-next-line: no-shadowed-variable
    this.tripvalueChanged$.subscribe(data => this.doStuff(data));
    this.showTripEndedDetails = data;
    this.showTripEndedDetails['fareInvoice'] = data.invoiceBill ? JSON.parse(data.invoiceBill) : [];
    const riderId = localStorage.getItem('Id');
    this.db.database.ref('riders_data/' + riderId).off('value');
    if (data.status === '1') {
      // accepted
      this.initial = 'trackingScreen';
      this.trackingScreenDetails.tripstatus = 'Driver Accepted';
      this.firebaseTripStatus.next('Driver Accepted');
    } else if (data.status === '2') {
      // arrived
      this.initial = 'trackingScreen';
      this.trackingScreenDetails.tripstatus = 'Driver Arrived to your Pickup Location';
      this.firebaseTripStatus.next('Driver Arrived to your Pickup Location');
    } else if (data.status === '3') {
      this.initial = 'trackingScreen';
      this.trackingScreenDetails.tripstatus = 'Trip in Progress';
      this.firebaseTripStatus.next('Trip in Progress');
    } else if (data.status === '4') {
      // console.log(data);
      this.trackingScreenDetails.tripstatus = 'Finished';
      this.firebaseTripStatus.next('Finished');
      this.initial = 'completedTripScreen';
      this.showTripEndedDetails.distance = parseFloat(this.showTripEndedDetails.distance).toFixed(2);
      this.stopListeningTripStatus();
    } else if (data.status === '5') {
      // cancelled
      this.initial = 'trackingScreen';
      this.trackingScreenDetails.tripstatus = 'Trip Cancelled';
      this.firebaseTripStatus.next('Trip Cancelled');
      this.stopListeningTripStatus();
    }
    this.getFeedbackDetails = {
      rating: 0
    };
  }

  showFareAfterTripFinished() {

  }

  stopListeningTripStatus() {
    this.db.database.ref('trips_data/' + this.selectedTripDetails.tripno).off('value');
    // clearInterval(this.setIntervalVariable);
  }

  ngOnDestroy(): void {
    clearInterval(this.setIntervalVariable);
    clearTimeout(this.spinnerTimeout);
    this.tripvalueChanged$.next();
    this.tripvalueChanged$.complete();
    this.firebaseTripStatus.next('');
    this.firebaseTripStatus.complete();
  }

  sendFeedback(data) {
    const feedObj = {
      rating: data.rating,
      comments: data.comments,
      tripId: this.selectedTripDetails.tripno
    };
    this.sectionService.riderFeedback(feedObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(response => {
        this.toastr.showtoast('error', response.message);
      });
  }

  amountToBeFloater(num) {
    if (num) {
      return parseFloat(num).toFixed(2);
    } else return "0.00";
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
  // checkNightcharge(data) {
  //   if (data === true) {
  //     this.nightChargeApplied = true;
  //     return 'Applied';
  //   } else {
  //     this.nightChargeApplied = false;
  //     return 'Not Applied';
  //   }
  // }
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
  onPaginateChange(event){
    console.log(event)
    this.currentPage= event.pageIndex
  }
}
