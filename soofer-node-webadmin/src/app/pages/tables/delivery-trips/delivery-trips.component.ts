import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { Location } from '@angular/common';
import { AppSettings, featuresSettings } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Angular2Csv } from 'angular2-csv';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'ngx-delivery-trips',
  templateUrl: './delivery-trips.component.html',
  styleUrls: ['./delivery-trips.component.scss']
})

export class DeliveryTripsComponent implements OnInit {

  trip: string = 'triplist';
  initial = 0;
  settings = {
    // actions: false,
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      vehicleFor: {
        title: 'Trip Type',
      },
      tripno: {
        title: 'Trip No',
      },
      date: {
        title: 'Date',
        // valuePrepareFunction: (date) => {
        //   return moment(date, 'DD-MM-YYYY HH:mm a').format('MMMM Do YYYY, h:mm:ss a');
        // }
      },
      receiverName: {
        title: 'Receiver Name',
        valuePrepareFunction: (cell, row) => {
          if (row.deliverydetails) {
            return row.deliverydetails.receiverName;
          } else '';
        }
      },
      packageType: {
        title: 'Package Type',
        valuePrepareFunction: (cell, row) => {
          if (row.deliverydetails) {
            return row.deliverydetails.packageType;
          } else '';
        }
      },
      delivery: {
        title: 'Fare',
        valuePrepareFunction: (cell, row) => {
          if (row.delivery) {
            return row.delivery.total;
          } else '';
        }
      },
      vehicle: {
        title: 'Vehicle Type',
      },
      status: {
        title: 'Status',
      },
      csp: {
        title: 'Payment Mode',
        valuePrepareFunction: (csp) => {
          return csp['via'];
        }
      },
    },
  };

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    headers: ['Trip Type', 'Trip No', 'Date', 'Driver', 'Rider', 'Fare', 'Vehicle Type', 'Status', 'Payment Via'],
    showTitle: true,
    title: 'Trip Report',
    useBom: true,
    removeNewLines: false,
    keys: ['triptype', 'tripno', 'date', 'dvr', 'rid', 'fare', 'vehicle', 'status', 'Payment'],
  };
  serviceCityArray: any = [];
  showCity: boolean;
  Doc: any = {};
  matchtoaccept: any;
  reportname = 'Trip_Details' + Date();
  brobj;
  driverDetails = [];
  driverlist: any;
  source: ServerDataSource;
  nightChargeApplied: boolean = false;
  showCancelButton;
  center = '0, -180';
  cancelTripDetails: any = {};
  data: any;
  defaultCur = AppSettings.defaultcur;
  fareType = featuresSettings.fareCalculationType;
  showFare: boolean = false;
  rideFeeDetails: any = {};
  convenienceFeeDetails: any = {};
  defaultUnit = featuresSettings.distanceUnit;
  showNoResponse: boolean = false;
  taxLabel = featuresSettings.taxFeeLabel;

  constructor(public http: HttpClient,
    private service: TableService,
    private toastr: ButtonToasterService,
    private location: Location,
    private modalService: NgbModal,
    private CommonSvc: CommonService) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'deliveryTrip' });
  }

  export(data) {
    new Angular2Csv(data, this.reportname, this.options);
  }

  tripdetailsId: string;

  route(event) {
    this.tripdetailsId = event.data._id;
    this.requestDriver();
  }

  ngOnInit(): void { }

  tripdetails: any;
  tripcspdetails: any;
  tripdspdetails: any;
  Amountdetails: any;
  deliveryDetails: any;
  isCspData: boolean = false;
  path: any;
  DriverAcceptedPhone: any;
  RiderPhone: any;
  pickupcharge: any;

  riderListData: any = {};

  showAdditionalCharge: boolean = false;
  additionalChargeData: any;
  totalAdditionalChar: any;

  requestDriver(): void {
    this.CommonSvc.deliveryRequestedDrivers(this.tripdetailsId)
      .then(msg => {
        this.riderListData = msg.RiderDetails[0];
        //   console.log(msg);
        //  this.driverlist = msg;
        this.getTripDetail(msg.TripDetails[0]);
        setTimeout(() => {
          if (msg.TripDetails[0].status === 'Finished') {
            this.tripdspdetails = msg.TripDetails[0].adsp;
            this.tripcspdetails = msg.TripDetails[0].acsp;
            this.tripdspdetails.start = msg.TripDetails[0].adsp.from;
            this.tripdspdetails.end = msg.TripDetails[0].adsp.to;
            const location = msg.TripDetails[0].adsp;
            this.tripdspdetails.pLat = location.pLat;
            this.tripdspdetails.pLng = location.pLng;
            this.tripdspdetails.dLat = location.dLat;
            this.tripdspdetails.dLng = location.dLng;
            this.path = [
              { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
              { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
            ];
          } else {
            this.tripcspdetails = msg.TripDetails[0].csp;
            this.tripdspdetails = msg.TripDetails[0].dsp;
            const location = msg.TripDetails[0].dsp;
            this.tripdspdetails.pLat = location.startcoords[1];
            this.tripdspdetails.pLng = location.startcoords[0];
            this.tripdspdetails.dLat = location.endcoords[1];
            this.tripdspdetails.dLng = location.endcoords[0];
            this.path = [
              { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
              { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
            ];
            this.tripdspdetails.start = msg.TripDetails[0].dsp.start;
            this.tripdspdetails.end = msg.TripDetails[0].dsp.end;
          }
          this.initial = 1;
        }, 1);
        this.tripdetails = msg.TripDetails[0];
        if (this.tripdetails['adsp'] === undefined) {
          this.tripdetails.from = '';
          this.tripdetails.to = '';
        } else {
          this.tripdetails.from = this.tripdetails['adsp'].from;
          this.tripdetails.to = this.tripdetails['adsp'].to;
        }
        this.tripdetails.request = this.RequsetFrom(this.tripdetails.requestFrom);
        this.showCancelButton = this.showCancelTripButton(this.tripdetails.status);
        this.matchtoaccept = msg.TripDetails[0].dvrid;
        this.trip = '';
        //this.tripdetails.map = msg.TripDetails[0].adsp.map;
        this.RiderPhone = msg.RiderDetails[0].phone;
        this.Driverlistarr(msg);
      })
      .catch(res => {
        // console.log(res)
        this.toastr.showtoast('error', res.message);
      });
  }

  showCancelTripButton(data) {
    if (data === 'accepted') {
      return true;
    } else return false;
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { size: 'lg' });
    this.cancelTripDetails.tripId = this.tripdetails.tripno;
  }

  submitted(d) {
    d('Cross click');
    this.cancelTripDetails.reason = '';
  }

  closed(d) {
    d('Cross click');
    this.cancelTripDetails.reason = '';
  }

  cancelTrip(data) {
    this.CommonSvc.cancelATrip(data)
      .then(msg => {
        this.showCancelButton = false;
        this.toastr.showtoast('success', msg.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  RequsetFrom(data) {
    if (data === 'backend-webadmin-ui') {
      return 'Request From Admin';
    } else {
      return 'Request From Mobile';
    }
  }

  testHeader() {
    const sendEmail = {
      tripId: this.tripdetailsId,
      email: this.riderListData.email
    };
    // console.log(sendEmail);
    this.CommonSvc.getTripMailDetails(sendEmail)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  deleteATripDetails(): void {
    this.CommonSvc.deleteATripDetails(this.tripdetailsId)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

  goBack(): void {
    this.trip = 'triplist';
    this.initial = 0;
    this.driverDetails = [];
    this.RiderPhone = '';
    this.DriverAcceptedPhone = '';
  }

  getTripDetail(data: any): void {
    //finished status need to fetch data from acsp && other will fetch from csp
    this.Amountdetails = data.delivery; this.deliveryDetails = data.deliverydetails;
    this.Amountdetails.baseFare = this.amountToBeFloater(this.Amountdetails.baseFare);
    this.Amountdetails.commision = this.amountToBeFloater(this.Amountdetails.commision);
    this.Amountdetails.distanceFare = this.amountToBeFloater(this.Amountdetails.distanceFare);
    this.Amountdetails.timeFare = this.amountToBeFloater(this.Amountdetails.timeFare);
    this.Amountdetails.total = this.amountToBeFloater(this.Amountdetails.total);
  }

  //converting string to integer and adding floater Ex-> 0.00
  amountToBeFloater(num) {
    return parseFloat(num).toFixed(2);
  }

  //oder taking from data.reqDvr and Driver id had been compared Wether it match or not and have been pushed
  Driverlistarr(data) {
    data.TripDetails[0].reqDvr.forEach(el => {
      for (let i = 0; i < data.DriverDetails.length; i++) {
        if (data.DriverDetails[i]._id == el.drvId) {
          //console.log(this.matchtoaccept, el.drvId)
          if (el.called == 0) {
            el.called = 'Not Called';
          }
          else if (el.called == 2) {
            el.called = 'Declined';
          }
          else if (el.called == 1) {
            if (el.drvId == this.matchtoaccept) {
              el.called = 'Accepted';
              this.DriverAcceptedPhone = data.DriverDetails[i].phone;
            } else {
              el.called = 'Called';
            }
          }
          el.distVal = this.amountToBeFloater(el.distVal / 1000);
          const mergeObject = { ...el, ...data.DriverDetails[i] };
          this.driverDetails.push(mergeObject);
        }
      }
    });
  }

  checkNightcharge(data) {
    if (data == true) {
      this.nightChargeApplied = true;
      return 'Applied';
    }
    else {
      this.nightChargeApplied = false;
      return 'Not Applied';
    }
  }

}
