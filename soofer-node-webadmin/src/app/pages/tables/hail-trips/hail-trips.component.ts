import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { TableService } from '../table.service';
import { Location } from '@angular/common';
import { AppSettings, featuresSettings } from '../../../app.config';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Angular2Csv } from "angular2-csv";
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-hail-trips',
  providers: [TableService, CommonService],
  templateUrl: './hail-trips.component.html',
})

export class HailTripsComponent implements OnInit {
  serviceCityArray: any = [];
  showCity: boolean;
  Doc: any = {};
  ngOnInit() {
  }

  trip: string = "triplist";
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
      triptype: {
        title: 'Trip Type',
      },
      tripno: {
        title: 'Trip No',
      },
      date: {
        title: 'Date',
      },
      dvr: {
        title: 'Driver',
      },
      fare: {
        title: 'Fare',
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

  matchtoaccept: any;
  reportname = "Trip_Details" + Date()
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
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'hailTrips' });
    if (featuresSettings.isCityWise == true && featuresSettings.isServiceAvailable == true && localStorage.getItem('userType') == "superadmin")
      this.showCity = true;
    else this.showCity = false;
    this.service.getServiceCity()
      .then(res => {
        this.serviceCityArray = res;
      })
  }
  SerachForCity(data): void {
    console.log(data)
    // this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'driver' });
    if (data.servicecity == "undefined")
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'upcomingTrips' });
    else
      this.source = new ServerDataSource(this.http, { endPoint: AppSettings.API_ENDPOINT + 'upcomingTrips?scity_like=' + data.servicecity });

  }
  ExportAsCSV() {
    this.brobj = [];
    this.http.get(AppSettings.API_ENDPOINT + "hailTrips?_page=1&_limit=1000")
      .toPromise()
      .then((res) => {
        this.data = res;
        this.data.forEach(element => {
          element.Payment = element.csp.via
          if (element.dvr === null) {
            element.dvr = "----"
          }
          this.brobj.push(element)
        });
        this.export(this.brobj)
      })
      .catch(err => {
        this.toastr.showtoast("error", err.message)
      })
  }

  export(data) {
    new Angular2Csv(data, this.reportname, this.options);
  }

  tripdetailsId: string;

  route(event) {
    this.tripdetailsId = event.data._id;
    this.requestDriver();
  }

  tripdetails: any;
  tripcspdetails: any;
  tripdspdetails: any;
  Amountdetails: any;
  isCspData: boolean = false;
  path: any;
  DriverAcceptedPhone: any;
  RiderPhone: any;
  pickupcharge: any;

  requestDriver(): void {
    this.CommonSvc.tripRequestedDrivers(this.tripdetailsId)
      .then(msg => {
        //   console.log(msg);
        //  this.driverlist = msg;
        this.getTripDetail(msg.TripDetails[0]);
        this.tripdetails = msg.TripDetails[0];
        this.tripdetails.request = this.RequsetFrom(this.tripdetails.requestFrom)
        this.showCancelButton = this.showCancelTripButton(this.tripdetails.status);
        this.matchtoaccept = msg.TripDetails[0].dvrid
        this.trip = "";
        //this.tripdetails.map = msg.TripDetails[0].adsp.map;
        this.RiderPhone = msg.RiderDetails[0].phone;
        this.Driverlistarr(msg)
      })
  }

  showCancelTripButton(data) {
    if (data === 'accepted') {
      return true
    } else return false
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { size: 'lg' });
    this.cancelTripDetails.tripId = this.tripdetails.tripno
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
        this.toastr.showtoast("success", msg.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      })
  }

  RequsetFrom(data) {
    if (data == "backend-webadmin-ui") {
      return "Request From Admin"
    }
    else {
      return "Request From Mobile"
    }
  }

  testHeader() {
    this.CommonSvc.getTripMailDetails(this.tripdetailsId)
      .then(res => {
        this.toastr.showtoast('success', res.message);
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });

  }

  deleteATripDetails(): void {
    this.CommonSvc.deleteATripDetails(this.tripdetailsId)
      .then(msg => {
        // this.toastr.showtoast("success",msg.message);
        this.goBack();
      })
  }

  goBack(): void {
    this.trip = "triplist";
    this.driverDetails = [];
    this.RiderPhone = "";
    this.DriverAcceptedPhone = "";
  }

  getTripDetail(data: any): void {
    //finished status need to fetch data from acsp && other will fetch from csp
    if (data.status == 'Finished') {
      this.isCspData = false;
      this.showNoResponse = false;
      this.Amountdetails = data.acsp
      this.tripdspdetails = data.adsp;
      this.Amountdetails.currency = this.Amountdetails.currency != undefined ? this.Amountdetails.currency : this.defaultCur;
      this.Amountdetails.nightCharge = this.checkNightcharge(this.Amountdetails.nightChargeApplied)
      this.tripcspdetails = data.acsp;
      this.tripcspdetails.time = this.tripcspdetails.time != null ? this.tripcspdetails.time : 0;
      this.Amountdetails.time = this.amountToBeFloater(this.Amountdetails.time);
      this.tripdspdetails.start = data.adsp.from;
      this.tripdspdetails.end = data.adsp.to;
      let location = data.adsp;
      this.tripdspdetails.pLat = location.pLat;
      this.tripdspdetails.pLng = location.pLng;
      this.tripdspdetails.dLat = location.dLat;
      this.tripdspdetails.dLng = location.dLng;
      this.path = [
        { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
        { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
      ];

      if (this.fareType === 'indiaGst') {
        this.showFare = true;
        let customerTaxCal = (data.acsp.tax1 / 2);
        let customerFare = (data.acsp.fare1 - customerTaxCal - customerTaxCal);
        this.rideFeeDetails.rideFare = this.amountToBeFloater(customerFare);
        this.rideFeeDetails.cgst = this.amountToBeFloater(customerTaxCal);
        this.rideFeeDetails.sgst = this.amountToBeFloater(customerTaxCal);
        this.rideFeeDetails.totalFare = this.amountToBeFloater(data.acsp.fare1);

        let convTaxCal = (data.acsp.tax2 / 2);
        let convFare = (data.acsp.fare2 - convTaxCal - convTaxCal);
        this.convenienceFeeDetails.rideFee = this.amountToBeFloater(convFare);
        this.convenienceFeeDetails.cgst = this.amountToBeFloater(convTaxCal);
        this.convenienceFeeDetails.sgst = this.amountToBeFloater(convTaxCal);
        this.convenienceFeeDetails.totalFare = this.amountToBeFloater(data.acsp.fare2);
        let total = (data.acsp.fare1 + data.acsp.fare2);
        this.rideFeeDetails.total = this.amountToBeFloater(total);
      }

    } else {
      this.showNoResponse = false;
      if (data.status === 'noresponse') {
        this.showNoResponse = true;
      }
      this.tripdspdetails = data.dsp;
      let location = data.dsp
      this.tripdspdetails.pLat = location.startcoords[1];
      this.tripdspdetails.pLng = location.startcoords[0];
      this.tripdspdetails.dLat = location.endcoords[1];
      this.tripdspdetails.dLng = location.endcoords[0];
      this.path = [
        { lat: parseFloat(this.tripdspdetails.pLat), lng: parseFloat(this.tripdspdetails.pLng) },
        { lat: parseFloat(this.tripdspdetails.dLat), lng: parseFloat(this.tripdspdetails.dLng) }
      ];
      this.tripdspdetails.start = data.dsp.start;
      this.tripdspdetails.end = data.dsp.end;
      this.isCspData = true;
      this.showFare = false;
      this.tripcspdetails = data.csp;
      this.tripcspdetails.time = this.tripcspdetails.time != null ? this.tripcspdetails.time : 0;
      this.Amountdetails = data.csp;
      this.Amountdetails.currency = this.Amountdetails.currency != undefined ? this.Amountdetails.currency : this.defaultCur;
      this.Amountdetails.nightCharge = this.checkNightcharge(this.Amountdetails.nightChargeApplied)
      this.Amountdetails.dist = this.amountToBeFloater(this.Amountdetails.dist / 1000);
      this.Amountdetails.time = this.amountToBeFloater(this.Amountdetails.time / 60);
      this.Amountdetails.oldBalance = "0";
      this.Amountdetails.waitingCharge = "0";
    }
    // console.log(data)
    this.ProcessAmount()
  }

  // making global Object for acsp && csp data
  ProcessAmount() {
    this.Amountdetails.actualcost = this.amountToBeFloater(this.Amountdetails.actualcost);
    this.Amountdetails.distfare = this.amountToBeFloater(this.Amountdetails.distfare);
    this.Amountdetails.base = this.amountToBeFloater(this.Amountdetails.base);
    this.Amountdetails.waitingCharge = this.amountToBeFloater(this.Amountdetails.waitingCharge);
    this.Amountdetails.timefare = this.amountToBeFloater(this.Amountdetails.timefare);
    this.Amountdetails.tax = this.amountToBeFloater(this.Amountdetails.tax);
    this.Amountdetails.oldBalance = this.amountToBeFloater(this.Amountdetails.oldBalance);
    this.Amountdetails.conveyance = this.amountToBeFloater(this.Amountdetails.conveyance);
    if (this.Amountdetails.conveyance > 0) {
      this.Amountdetails.conveyance = this.amountToBeFloater(this.Amountdetails.conveyance);
      this.pickupcharge = true;
    }
  }

  //converting string to integer and adding floater Ex-> 0.00
  amountToBeFloater(num) {
    return parseFloat(num).toFixed(2)
  }

  //oder taking from data.reqDvr and Driver id had been compared Wether it match or not and have been pushed
  Driverlistarr(data) {
    data.TripDetails[0].reqDvr.forEach(el => {
      for (let i = 0; i < data.DriverDetails.length; i++) {
        if (data.DriverDetails[i]._id == el.drvId) {
          //console.log(this.matchtoaccept, el.drvId)
          if (el.called == 0) {
            el.called = "Not Called"
          }
          else if (el.called == 2) {
            el.called = "Declined"
          }
          else if (el.called == 1) {
            if (el.drvId == this.matchtoaccept) {
              el.called = "Accepted"
              this.DriverAcceptedPhone = data.DriverDetails[i].phone
            } else {
              el.called = "Called"
            }
          }
          el.distVal = this.amountToBeFloater(el.distVal / 1000)
          let mergeObject = { ...el, ...data.DriverDetails[i] }
          this.driverDetails.push(mergeObject)
        }
      }
    })
  }

  checkNightcharge(data) {
    if (data == true) {
      this.nightChargeApplied = true;
      return "Applied"
    }
    else {
      this.nightChargeApplied = false;
      return "Not Applied"
    }
  }

}
