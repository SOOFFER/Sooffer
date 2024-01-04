import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { ButtonToasterService } from "../../buttontoaster/buttontoaster.service";
import { TripsService } from "../tripdetails.service";
import { featuresSettings, AppSettings } from "../../../app.config";
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Router } from "@angular/router";
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
} from "ng-pick-datetime";
import { MomentDateTimeAdapter } from "ng-pick-datetime-moment";

export const MY_CUSTOM_FORMATS = {
  parseInput: "LL LT",
  fullPickerInput: "LL LT",
  datePickerInput: "LL",
  timePickerInput: "LT",
  monthYearLabel: "MMM YYYY",
  dateA11yLabel: "LL",
  monthYearA11yLabel: "MMMM YYYY",
};

@Component({
  selector: "ngx-invoice-details",
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE],
    },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS },
  ],
  templateUrl: "./invoice-details.component.html",
  styleUrls: ["./invoice-details.component.scss"],
})
export class InvoiceDetailsComponent implements OnInit, OnDestroy {
  // @Output() submitThirdForm = new EventEmitter();

  @Output() backbtn = new EventEmitter();

  @Input() fields: any;
  ZoneFare: any = '';
  tripdetailsId: any;
  EMailTemp: any = {};
  tripdetails: any;
  baseUrl = AppSettings.BASEURL;
  tripcspdetails: any;
  tripdspdetails: any;
  Amountdetails: any;
  isCspData: boolean = false;
  path: any;
  DriverAcceptedPhone: any;
  RiderPhone: any;
  pickupcharge: any;
  matchtoaccept: any;
  driverDetails = [];
  peakchargechargeApplied: boolean = false;
  PeakCharge: number;

  riderListData: any = {};
  showCancelButton;
  showEndButton;
  showStartButton;
  showRefreshBtn;
  nightChargeApplied: boolean = false;
  cancelTripDetails: any = {};

  showAdditionalCharge: boolean = false;
  additionalChargeData: any;
  totalAdditionalChar: any;

  defaultCur = AppSettings.defaultcur;
  fareType = featuresSettings.fareCalculationType;
  showFare: boolean = false;
  rideFeeDetails: any = {};
  convenienceFeeDetails: any = {};
  defaultUnit = featuresSettings.distanceUnit;
  showNoResponse: boolean = false;
  taxLabel = featuresSettings.taxFeeLabel;

  showDetails: boolean = false;
  endTrip: boolean = false;

  fareDetails;
  packageDetails;
  showEmail: boolean = false;

  endTripDetails: any = {};
  startTripDetails: any = {};
  startTrip: boolean = false;

  timeOut: any;
  showFareFor: any;
  acneeded: any;
  startMeter: string;
  tripDspDetails: any;
  tripCspDetails: any;
  MultiLoc: any;
  NightCharge: number;
  isDTS = featuresSettings.isDTS;

  constructor(
    private toastr: ButtonToasterService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private modalService: NgbModal,
    private tripservice: TripsService
  ) {
    this.spinner.show();
    this.timeOut = setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  fareDetailsList() {
    this.fareDetails = {
      fareType: 0.0,
      actualcost: 0.0,
      dist: 0.0,
      distfare: 0.0,
      base: 0.0,
      booking: 0.0,

      waitingTime: 0.0,
      waitingCharge: 0.0,
      currency: 0.0,
      time: 0.0,
      timefare: 0.0,
      tax: 0.0,
      oldBalance: 0.0,
      nightCharge: 0.0,
      conveyance: 0.0,
      discountName: 0.0,
      discountPercentage: 0.0,
      detect: 0.0,
      discount: 0.0,
      via: "Cash",
      cost: 0.0,
      googleCharge: 0.0,
      tollFee: 0.0,
      taxTDS: 0.0,
      taxTDSPercentage: 0.0,
      gatewayCharge: 0.0,
    };

    this.packageDetails = {
      base: 0.0,
      booking: 0.0,

      packageName: "N/A",
      dist: 0.0,
      distfare: 0.0,
      perKmRate: 0.0,
      fareForExtraKM: 0.0,
      timefare: 0.0,
      fareForExtraTime: 0.0,
      conveyance: 0.0,
      discountName: 0.0,
      discountPercentage: 0.0,
      detect: 0.0,
      discount: 0.0,
      hillFare: 0.0,
      via: "Cash",
      cost: 0.0,
      currency: 0.0,
      noOfNights: 0,
      nightRate: 0.0,
      nightFare: 0.0,
      noOfDays: 0,
      dayFare: 0.0,
      dayRate: 0.0,
      googleCharge: 0.0,
      tollFee: 0.0,
      taxTDS: 0.0,
      taxTDSPercentage: 0.0,
      gatewayCharge: 0.0,
    };

    this.tripCspDetails = {
      packageName: "N/A",
      dist: 0.0,
      distfare: 0.0,
      perKmRate: 0.0,
      fareForExtraKM: 0.0,
      timefare: 0.0,
      minFare: 0.0,
      travelFare: 0.0,
      travelRate: 0.0,
      taxPercentage: 0.0,
      minFareAdded: 0.0,
      booking: 0.0,
      fareForExtraTime: 0.0,
      conveyance: 0.0,
      discountName: 0.0,
      discountPercentage: 0.0,
      detect: 0.0,
      discount: 0.0,
      hillFare: 0.0,
      via: "Cash",
      cost: 0.0,
      currency: 0.0,
      promo: "N/A",
      googleCharge: 0.0,
      taxTDS: 0.0,
      taxTDSPercentage: 0.0,
      gatewayCharge: null,
    };

    this.tripDspDetails = {
      fareType: 0.0,
      actualcost: 0.0,
      dist: 0.0,
      distfare: 0.0,
      base: 0.0,
      waitingTime: 0.0,
      waitingCharge: 0.0,
      currency: 0.0,
      time: 0.0,
      timefare: 0.0,
      minFare: 0.0,
      travelFare: 0.0,
      travelRate: 0.0,
      taxPercentage: 0.0,
      minFareAdded: 0.0,
      booking: 0.0,
      tax: 0.0,
      oldBalance: 0.0,
      nightCharge: 0.0,
      nightChargeRate: 0.0,
      conveyance: 0.0,
      discountName: 0.0,
      discountPercentage: 0.0,
      detect: 0.0,
      discount: 0.0,
      via: "Cash",
      cost: 0.0,
      googleCharge: 0.0,
      taxTDS: 0.0,
      taxTDSPercentage: 0.0,
      gatewayCharge: null,
    };
  }

  ngOnInit() {
    this.showFareFor = "daily";
    this.tripdetailsId = this.fields;
    this.requestDriver(this.tripdetailsId);
  }

  open(MultiLocation) {
    const modalRef = this.modalService.open(MultiLocation);
  }

  requestDriver(id): void {
    this.tripservice
      .tripRequestedDrivers(id)
      .then(msg => {
        // console.log(msg.TripDetails[0]);
        this.getTripDetail(msg.TripDetails[0]);
        this.riderListData = msg.RiderDetails[0];
        this.EMailTemp.email = this.riderListData.email; //
        this.tripdetails = msg.TripDetails[0];
        this.MultiLoc = this.tripdetails.multiLocation;
        console.log(this.tripdetails.isMultiLocation);
        this.GetCspData(this.tripdetails);
        if (this.tripdetails["adsp"] === undefined) {
          this.tripdetails.from = "";
          this.tripdetails.to = "";
          this.tripdetails.start = "";
          this.tripdetails.end = "";
        } else {
          this.tripdetails.from = this.tripdetails["adsp"].from;
          this.tripdetails.to = this.tripdetails["adsp"].to;
          this.tripdetails.scity = this.tripdetails.scity;
          console.log(this.tripdetails.scity);
        }
        this.getTripEndDetails();
        this.tripdetails.request = this.RequsetFrom(
          this.tripdetails.requestFrom
        );
        this.showRefreshBtn = this.showRefreshButton(this.tripdetails.status);
        this.showCancelButton = this.showCancelTripButton(
          this.tripdetails.status
        );
        this.showEndButton = this.showEndTripButton(this.tripdetails.status);
        this.showStartButton = this.showStartTripButton(
          this.tripdetails.status
        );
        this.matchtoaccept = msg.TripDetails[0].dvrid;
        this.RiderPhone = msg.RiderDetails[0] ? msg.RiderDetails[0].phone : "";
        this.Driverlistarr(msg);
        this.showDetails = true;
        this.endTrip = false;
        this.startTrip = false;
      })
      .catch(res => {
        this.goBack();
        this.toastr.showtoast("error", res.message);
      });
  }

  CloseMulLoc(d) {
    d("Cross click");
  }

  GetCspData(data) {
    this.tripCspDetails = data.csp;
    (this.tripCspDetails.nightCharge = this.checkEstNightCharge(
      data.csp.isNight,
      data.csp.cost,
      data.csp.fareAmtBeforeSurge
    )),
      (this.tripCspDetails.nightChargeRate = this.amountToBeFloater(
        data.csp.nightPer
      )),
      (this.tripDspDetails = data.dsp);
    console.log("Csp", this.tripCspDetails);
    console.log("Dsp", this.tripDspDetails);
  }

  estNightChargeApplied;

  checkEstNightCharge(data, cost, fareAmt) {
    console.log("Night Charge", data);
    if (data === true) {
      this.estNightChargeApplied = true;
      const ch = cost - fareAmt;
      const x = ch.toFixed(3);
      return x;
    } else {
      this.estNightChargeApplied = false;
      return "Not Applied";
    }
  }

  getTripEndDetails() {
    if (this.tripdetails["acsp"]) {
      this.tripdetails.start = moment(
        this.tripdetails["acsp"].startTime,
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ).format("YYYY-MM-DDTHH:mm:ss");
      this.tripdetails.startMeter = this.tripdetails["acsp"].startMeter
        ? this.tripdetails["acsp"].startMeter
        : "";
      this.tripdetails.pickupLat = this.tripdetails["adsp"]
        ? this.tripdetails["adsp"].pLat
        : 0;
      this.tripdetails.pickupLng = this.tripdetails["adsp"]
        ? this.tripdetails["adsp"].pLng
        : 0;
    }
    this.tripdetails.startTime = this.tripdetails["acsp"].startTime
      ? moment(
        this.tripdetails["acsp"].startTime,
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ).format("DD-MM-YYYY hh:mm A")
      : "N/A";
    this.tripdetails.endTime = this.tripdetails["acsp"].endTime
      ? moment(
        this.tripdetails["acsp"].endTime,
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      ).format("DD-MM-YYYY hh:mm A")
      : "N/A";
    this.tripdetails.startMeter = this.tripdetails["acsp"].startMeter
      ? this.tripdetails["acsp"].startMeter
      : "N/A";
    this.tripdetails.endMeter = this.tripdetails["acsp"].endMeter
      ? this.tripdetails["acsp"].endMeter
      : "N/A";
    console.log(this.tripdetails.startMeter);
  }

  Driverlistarr(data) {
    data.TripDetails[0].reqDvr.forEach(el => {
      for (let i = 0; i < data.DriverDetails.length; i++) {
        if (data.DriverDetails[i]._id === el.drvId) {
          if (el.called === 2) {
            el.called = "Declined";
          } else if (el.called === 1) {
            if (el.drvId === this.matchtoaccept) {
              el.called = "Accepted";
              this.DriverAcceptedPhone = data.DriverDetails[i].phone;
            } else {
              el.called = "Called";
            }
          } else {
            el.called = "Not Called";
          }
          el.distVal = this.amountToBeFloater(el.distVal / 1000);
          const mergeObject = { ...el, ...data.DriverDetails[i] };
          this.driverDetails.push(mergeObject);
        }
      }
    });
  }

  amountToBeFloater(num) {
    if (num) {
      return parseFloat(num).toFixed(2);
    } else return "0.00";
  }

  clrDriver(trip) {
    const obj = { tripno: trip };
    this.tripservice
      .refreshTrips(obj)
      .then(res => {
        this.toastr.showtoast("success", res.message);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }

  showRefreshButton(data) {
    if (data === "Finished") {
      return true;
    } else {
      return false;
    }
  }

  showCancelTripButton(data) {
    if (data === "accepted" || data === "processing" || data === "noresponse") {
      return true;
    } else {
      return false;
    }
  }

  showStartTripButton(data) {
    if (data === "accepted") {
      return true;
    } else {
      return false;
    }
  }

  showEndTripButton(data) {
    if (data === "Progress") {
      return true;
    } else return false;
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
    this.backbtn.emit();
  }

  changeTemplate(data) {
    if (data === "showEnd") {
      this.endTripDetails = {};
      this.endTripFareForDaily = {};
      this.endTripFareForRental = [];
      this.endTripFareForOutstation = [];
      this.endTripDetails["tripno"] = this.tripdetails.tripno;
      this.endTripDetails["tripType"] = this.tripdetails.triptype;
      this.endTripDetails["startAddress"] = this.tripdetails.from;
      this.endTripDetails["startTime"] = this.tripdetails.start;
      this.endTripDetails["startMeter"] = this.tripdetails.startMeter;
      this.endTripDetails["pickupLat"] = this.tripdetails.pickupLat;
      this.endTripDetails["pickupLng"] = this.tripdetails.pickupLng;
      this.showEndTripFare = false;
      this.endTrip = true;
      this.showDetails = false;
      this.startTrip = false;
    } else if (data === "showStart") {
      this.startTripDetails = {};
      this.startTripDetails["tripno"] = this.tripdetails.tripno;
      this.startTripDetails["tripType"] = this.tripdetails.triptype;
      this.startTripDetails["startAddress"] = this.tripdetails.from;
      this.startTripDetails["startTime"] = this.tripdetails.start;
      this.startTripDetails["startMeter"] = this.tripdetails.startMeter;
      this.startTripDetails["pickupLat"] = this.tripdetails.pickupLat;
      this.startTripDetails["pickupLng"] = this.tripdetails.pickupLng;
      this.endTrip = false;
      this.showDetails = false;
      this.startTrip = true;
    } else {
      this.showDetails = true;
      this.endTrip = false;
      this.startTrip = false;
    }
  }

  setFareValues(status, data) {
    if (this.showFareFor === "daily") {
      if (status === "Finished") {
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
        };
        if (data.conveyance > 0) {
          this.fareDetails.conveyance = this.amountToBeFloater(data.conveyance);
          this.pickupcharge = true;
        }
        if (this.fareType === "indiaGst") {
          this.showFare = true;
          const customerTaxCal = data.acsp.tax1 / 2;
          const customerFare =
            data.acsp.fare1 - customerTaxCal - customerTaxCal;
          this.rideFeeDetails.rideFare = this.amountToBeFloater(customerFare);
          this.rideFeeDetails.cgst = this.amountToBeFloater(customerTaxCal);
          this.rideFeeDetails.sgst = this.amountToBeFloater(customerTaxCal);
          this.rideFeeDetails.totalFare = this.amountToBeFloater(
            data.acsp.fare1
          );

          const convTaxCal = data.acsp.tax2 / 2;
          const convFare = data.acsp.fare2 - convTaxCal - convTaxCal;
          this.convenienceFeeDetails.rideFee = this.amountToBeFloater(convFare);
          this.convenienceFeeDetails.cgst = this.amountToBeFloater(convTaxCal);
          this.convenienceFeeDetails.sgst = this.amountToBeFloater(convTaxCal);
          this.convenienceFeeDetails.totalFare = this.amountToBeFloater(
            data.acsp.fare2
          );
          const total = data.acsp.fare1 + data.acsp.fare2;
          this.rideFeeDetails.total = this.amountToBeFloater(total);
        }
      } else {
        this.fareDetails = {
          gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

          tollFee: this.amountToBeFloater(data.tollFee),
          fareType: data.fareType ? data.fareType : "N/A",
          actualcost: this.amountToBeFloater(data.actualcost),
          dist: data.dist ? data.dist : "0",
          distfare: this.amountToBeFloater(data.distfare),
          base: this.amountToBeFloater(data.base),
          waitingTime: data.waitingTime ? data.waitingTime : "0",
          waitingRate: data.waitingRate ? data.waitingRate : "0",
          waitingCharge: this.amountToBeFloater(data.waitingCharge),
          currency:
            data.currency !== undefined ? data.currency : this.defaultCur,
          time: data.time ? data.time : "0",
          // taxTDS: data.taxTDS,
          taxTDS: this.amountToBeFloater(data.taxTDS),

          taxTDSPercentage: this.amountToBeFloater(data.taxTDSPercentage),
          timeRate: this.amountToBeFloater(data.timeRate),
          timefare: this.amountToBeFloater(data.timefare),
          minFare: this.amountToBeFloater(data.minFare),
          travelRate: this.amountToBeFloater(data.travelRate),
          travelFare: this.amountToBeFloater(data.travelFare),
          taxPercentage: this.amountToBeFloater(data.taxPercentage),
          minFareAdded: this.amountToBeFloater(data.minFareAdded),
          booking: this.amountToBeFloater(data.booking),
          tax: this.amountToBeFloater(data.tax),
          surgeAmt: this.amountToBeFloater(data.surgeAmt),
          surgeReason: data.surgeReason ? data.surgeReason : "Not Applied",

          nightPer: this.amountToBeFloater(data.nightPer),
          peakPer: this.amountToBeFloater(data.peakPer),
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
        this.fareDetails.dist = this.amountToBeFloater(
          this.fareDetails.dist / 1000
        );
        this.fareDetails.time = this.amountToBeFloater(
          this.fareDetails.time / 60
        );
      }
    } else if (this.showFareFor === "rental") {
      console.log(data);
      if (status === "Finished") {
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
        if (this.fareType === "indiaGst") {
          this.showFare = true;
          const customerTaxCal = data.acsp.tax1 / 2;
          const customerFare =
            data.acsp.fare1 - customerTaxCal - customerTaxCal;
          this.rideFeeDetails.rideFare = this.amountToBeFloater(customerFare);
          this.rideFeeDetails.cgst = this.amountToBeFloater(customerTaxCal);
          this.rideFeeDetails.sgst = this.amountToBeFloater(customerTaxCal);
          this.rideFeeDetails.totalFare = this.amountToBeFloater(
            data.acsp.fare1
          );

          const convTaxCal = data.acsp.tax2 / 2;
          const convFare = data.acsp.fare2 - convTaxCal - convTaxCal;
          this.convenienceFeeDetails.rideFee = this.amountToBeFloater(convFare);
          this.convenienceFeeDetails.cgst = this.amountToBeFloater(convTaxCal);
          this.convenienceFeeDetails.sgst = this.amountToBeFloater(convTaxCal);
          this.convenienceFeeDetails.totalFare = this.amountToBeFloater(
            data.acsp.fare2
          );
          const total = data.acsp.fare1 + data.acsp.fare2;
          this.rideFeeDetails.total = this.amountToBeFloater(total);
        }
        this.packageDetails = {
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
      } else {
        this.fareDetails = {
          gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

          tollFee: this.amountToBeFloater(data.tollFee),
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
        this.fareDetails.dist = this.amountToBeFloater(
          this.fareDetails.dist / 1000
        );
        this.fareDetails.time = this.amountToBeFloater(
          this.fareDetails.time / 60
        );

        this.packageDetails = {
          tollFee: this.amountToBeFloater(data.tollFee),
          gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

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
    } else if (this.showFareFor === "outstation") {
      if (status === "Finished") {
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
        if (this.fareType === "indiaGst") {
          this.showFare = true;
          const customerTaxCal = data.acsp.tax1 / 2;
          const customerFare =
            data.acsp.fare1 - customerTaxCal - customerTaxCal;
          this.rideFeeDetails.rideFare = this.amountToBeFloater(customerFare);
          this.rideFeeDetails.cgst = this.amountToBeFloater(customerTaxCal);
          this.rideFeeDetails.sgst = this.amountToBeFloater(customerTaxCal);
          this.rideFeeDetails.totalFare = this.amountToBeFloater(
            data.acsp.fare1
          );

          const convTaxCal = data.acsp.tax2 / 2;
          const convFare = data.acsp.fare2 - convTaxCal - convTaxCal;
          this.convenienceFeeDetails.rideFee = this.amountToBeFloater(convFare);
          this.convenienceFeeDetails.cgst = this.amountToBeFloater(convTaxCal);
          this.convenienceFeeDetails.sgst = this.amountToBeFloater(convTaxCal);
          this.convenienceFeeDetails.totalFare = this.amountToBeFloater(
            data.acsp.fare2
          );
          const total = data.acsp.fare1 + data.acsp.fare2;
          this.rideFeeDetails.total = this.amountToBeFloater(total);
        }
        this.packageDetails = {
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
      } else {
        this.fareDetails = {
          gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

          tollFee: this.amountToBeFloater(data.tollFee),
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
          minFare: this.amountToBeFloater(data.minFare),
          travelFare: this.amountToBeFloater(data.travelFare),
          travelRate: this.amountToBeFloater(data.travelRate),
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
        this.fareDetails.dist = this.amountToBeFloater(
          this.fareDetails.dist / 1000
        );
        this.fareDetails.time = this.amountToBeFloater(
          this.fareDetails.time / 60
        );

        this.packageDetails = {
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
          time: this.amountToBeFloater(data.time),
          minFare: this.amountToBeFloater(data.minFare),
          travelFare: this.amountToBeFloater(data.travelFare),
          travelRate: this.amountToBeFloater(data.travelRate),
          taxPercentage: this.amountToBeFloater(data.taxPercentage),
          tax: this.amountToBeFloater(data.tax),
          googleCharge: this.amountToBeFloater(data.googleCharge),
          gatewayCharge: this.amountToBeFloater(data.gatewayCharge),

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
        };
      }
    }
  }

  getTripDetail(data: any): void {
    if (data.triptype === "daily") {
      // console.log(data);
      this.showFareFor = "daily";
      if (data.status === "Finished") {
        this.isCspData = false;
        this.showNoResponse = false;
        this.showEmail = true;
        this.setFareValues(data.status, data.acsp);
        this.tripdspdetails = data.adsp;
        this.ZoneFare = data.acsp.zoneFare ? data.acsp.zoneFare : 0;
        this.tripcspdetails = data.acsp;
        this.tripcspdetails.time =
          this.tripcspdetails.time != null ? this.tripcspdetails.time : 0;
        this.tripdspdetails.start = data.adsp.from;
        this.tripdspdetails.end = data.adsp.to;
        const location = data.adsp;
        this.tripdspdetails.pLat = location.pLat;
        this.tripdspdetails.pLng = location.pLng;
        this.tripdspdetails.dLat = location.dLat;
        this.tripdspdetails.dLng = location.dLng;
        this.path = [
          {
            lat: parseFloat(this.tripdspdetails.pLat),
            lng: parseFloat(this.tripdspdetails.pLng),
          },
          {
            lat: parseFloat(this.tripdspdetails.dLat),
            lng: parseFloat(this.tripdspdetails.dLng),
          },
        ];
      } else {
        this.showEmail = false;
        this.showNoResponse = false;
        this.setFareValues(data.status, data.csp);
        console.log(data.status);
        if (data.status === "noresponse" || data.status === "processing") {
          this.showNoResponse = true;
        }
        this.tripdspdetails = data.dsp;
        const location = data.dsp;
        if (location.startcoords) {
          this.tripdspdetails.pLat = location.startcoords[1];
          this.tripdspdetails.pLng = location.startcoords[0];
        } else {
          this.tripdspdetails.pLat = 0;
          this.tripdspdetails.pLng = 0;
        }
        if (location.endcoords) {
          this.tripdspdetails.dLat = location.endcoords[1];
          this.tripdspdetails.dLng = location.endcoords[0];
        } else {
          this.tripdspdetails.dLat = 0;
          this.tripdspdetails.dLng = 0;
        }
        this.path = [
          {
            lat: parseFloat(this.tripdspdetails.pLat),
            lng: parseFloat(this.tripdspdetails.pLng),
          },
          {
            lat: parseFloat(this.tripdspdetails.dLat),
            lng: parseFloat(this.tripdspdetails.dLng),
          },
        ];
        this.tripdspdetails.start = data.dsp.start;
        this.tripdspdetails.end = data.dsp.end;
        this.isCspData = true;
        this.showFare = false;
        this.tripcspdetails = data.csp;
        this.tripcspdetails.time = this.amountToBeFloater(data.csp.time / 60);
        // console.log(data.csp);
      }

      const additionalChar = data.additionalFee ? data.additionalFee : [];
      this.totalAdditionalChar = 0;
      this.additionalChargeData = [];
      if (additionalChar.length !== 0) {
        let ch = 0;
        additionalChar.forEach(el => {
          // tslint:disable-next-line: radix
          ch = ch + parseInt(el.amount);
        });
        this.totalAdditionalChar = this.amountToBeFloater(ch);
        this.additionalChargeData = data.additionalFee;
        this.showAdditionalCharge = true;
      } else {
        this.showAdditionalCharge = false;
      }
    } else if (data.triptype === "rental") {
      // console.log(data);
      this.showFareFor = "rental";
      if (data.status === "Finished") {
        this.isCspData = false;
        this.showNoResponse = false;
        this.showEmail = true;
        this.setFareValues(data.status, data.acsp);
        this.tripdspdetails = data.adsp;
        this.tripcspdetails = data.acsp;
        this.tripcspdetails.time =
          this.tripcspdetails.time != null ? this.tripcspdetails.time : 0;
        this.tripdspdetails.start = data.adsp.from;
        this.tripdspdetails.end = data.adsp.to;
        const location = data.adsp;
        this.tripdspdetails.pLat = location.pLat;
        this.tripdspdetails.pLng = location.pLng;
        this.tripdspdetails.dLat = location.dLat;
        this.tripdspdetails.dLng = location.dLng;
        this.path = [
          {
            lat: parseFloat(this.tripdspdetails.pLat),
            lng: parseFloat(this.tripdspdetails.pLng),
          },
          {
            lat: parseFloat(this.tripdspdetails.dLat),
            lng: parseFloat(this.tripdspdetails.dLng),
          },
        ];
      } else {
        this.showEmail = false;
        this.showNoResponse = false;
        this.setFareValues(data.status, data.csp);
        console.log(data.status);
        if (data.status === "noresponse" || data.status === "processing") {
          this.showNoResponse = true;
        }
        this.tripdspdetails = data.dsp;
        const location = data.dsp;
        if (location.startcoords) {
          this.tripdspdetails.pLat = location.startcoords[1];
          this.tripdspdetails.pLng = location.startcoords[0];
        } else {
          this.tripdspdetails.pLat = 0;
          this.tripdspdetails.pLng = 0;
        }
        if (location.endcoords) {
          this.tripdspdetails.dLat = location.endcoords[1];
          this.tripdspdetails.dLng = location.endcoords[0];
        } else {
          this.tripdspdetails.dLat = 0;
          this.tripdspdetails.dLng = 0;
        }
        this.path = [
          {
            lat: parseFloat(this.tripdspdetails.pLat),
            lng: parseFloat(this.tripdspdetails.pLng),
          },
          {
            lat: parseFloat(this.tripdspdetails.dLat),
            lng: parseFloat(this.tripdspdetails.dLng),
          },
        ];
        this.tripdspdetails.start = data.dsp.start;
        this.tripdspdetails.end = data.dsp.end;
        this.isCspData = true;
        this.showFare = false;
        this.tripcspdetails = data.csp;
        this.tripcspdetails.time = this.amountToBeFloater(data.csp.time / 60);
        // console.log(data.csp);
      }

      const additionalChar = data.additionalFee ? data.additionalFee : [];
      this.totalAdditionalChar = 0;
      this.additionalChargeData = [];
      if (additionalChar.length !== 0) {
        let ch = 0;
        additionalChar.forEach(el => {
          // tslint:disable-next-line: radix
          ch = ch + parseInt(el.amount);
        });
        this.totalAdditionalChar = this.amountToBeFloater(ch);
        this.additionalChargeData = data.additionalFee;
        this.showAdditionalCharge = true;
      } else {
        this.showAdditionalCharge = false;
      }
    } else if (data.triptype === "outstation") {
      // console.log(data);
      this.showFareFor = "outstation";
      if (data.status === "Finished") {
        this.isCspData = false;
        this.showNoResponse = false;
        this.showEmail = true;
        this.setFareValues(data.status, data.acsp);
        this.tripdspdetails = data.adsp;
        this.tripcspdetails = data.acsp;
        this.tripcspdetails.time =
          this.tripcspdetails.time != null ? this.tripcspdetails.time : 0;
        this.tripdspdetails.start = data.adsp.from;
        this.tripdspdetails.end = data.adsp.to;
        const location = data.adsp;
        this.tripdspdetails.pLat = location.pLat;
        this.tripdspdetails.pLng = location.pLng;
        this.tripdspdetails.dLat = location.dLat;
        this.tripdspdetails.dLng = location.dLng;
        this.path = [
          {
            lat: parseFloat(this.tripdspdetails.pLat),
            lng: parseFloat(this.tripdspdetails.pLng),
          },
          {
            lat: parseFloat(this.tripdspdetails.dLat),
            lng: parseFloat(this.tripdspdetails.dLng),
          },
        ];
      } else {
        this.showEmail = false;
        this.showNoResponse = false;
        this.setFareValues(data.status, data.csp);
        console.log(data.status);
        if (data.status === "noresponse" || data.status === "processing") {
          this.showNoResponse = true;
        }
        this.tripdspdetails = data.dsp;
        const location = data.dsp;
        if (location.startcoords) {
          this.tripdspdetails.pLat = location.startcoords[1];
          this.tripdspdetails.pLng = location.startcoords[0];
        } else {
          this.tripdspdetails.pLat = 0;
          this.tripdspdetails.pLng = 0;
        }
        if (location.endcoords) {
          this.tripdspdetails.dLat = location.endcoords[1];
          this.tripdspdetails.dLng = location.endcoords[0];
        } else {
          this.tripdspdetails.dLat = 0;
          this.tripdspdetails.dLng = 0;
        }
        this.path = [
          {
            lat: parseFloat(this.tripdspdetails.pLat),
            lng: parseFloat(this.tripdspdetails.pLng),
          },
          {
            lat: parseFloat(this.tripdspdetails.dLat),
            lng: parseFloat(this.tripdspdetails.dLng),
          },
        ];
        this.tripdspdetails.start = data.dsp.start;
        this.tripdspdetails.end = data.dsp.end;
        this.isCspData = true;
        this.showFare = false;
        this.tripcspdetails = data.csp;
        this.tripcspdetails.time = this.amountToBeFloater(data.csp.time / 60);
        // console.log(data.csp);
      }

      const additionalChar = data.additionalFee ? data.additionalFee : [];
      this.totalAdditionalChar = 0;
      this.additionalChargeData = [];
      if (additionalChar.length !== 0) {
        let ch = 0;
        additionalChar.forEach(el => {
          // tslint:disable-next-line: radix
          ch = ch + parseInt(el.amount);
        });
        this.totalAdditionalChar = this.amountToBeFloater(ch);
        this.additionalChargeData = data.additionalFee;
        this.showAdditionalCharge = true;
      } else {
        this.showAdditionalCharge = false;
      }
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

  testHeader(data) {
    console.log(data);
    const sendEmail = {
      tripId: this.tripdetailsId,
      email: data.email,
    };
    this.tripservice
      .getTripMailDetails(sendEmail)
      .then(res => {
        this.EMailTemp.email = this.riderListData.email;
        this.toastr.showtoast("success", res.message);
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }

  deleteATripDetails(): void {
    this.tripservice
      .deleteATripDetails(this.tripdetailsId)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }

  cancelTrip(data) {
    this.tripservice
      .cancelATrip(data)
      .then(msg => {
        this.showCancelButton = false;
        this.toastr.showtoast("success", msg.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast("error", res.message);
      });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { size: "lg" });
    this.cancelTripDetails.tripId = this.tripdetails.tripno;
  }
  openVerticallyCenteredForEmail(content) {
    this.modalService.open(content, { size: "lg" });
    this.cancelTripDetails.tripId = this.tripdetails.tripno;
  }

  submitted(d) {
    d("Cross click");
    this.cancelTripDetails.reason = "";
  }

  closed(d) {
    d("Cross click");
    this.cancelTripDetails.reason = "";
  }

  listenPickupLocation(event) {
    this.endTripDetails.startAddress = this.doReturnFormattedAddress(event);
    this.endTripDetails.pickupLat = event.geometry.location.lat();
    this.endTripDetails.pickupLng = event.geometry.location.lng();
  }

  listenDropLocation(event) {
    this.endTripDetails.endAddress = this.doReturnFormattedAddress(event);
    this.endTripDetails.dropLat = event.geometry.location.lat();
    this.endTripDetails.dropLng = event.geometry.location.lng();
  }

  checkLoc(event) {
    if (this.endTripDetails.startAddress === "") {
      this.endTripDetails.pickupLat = undefined;
      this.endTripDetails.pickupLng = undefined;
    } else if (this.endTripDetails.endAddress === "") {
      this.endTripDetails.dropLat = undefined;
      this.endTripDetails.dropLng = undefined;
    }
  }

  doReturnFormattedAddress(location) {
    if (
      typeof location.name !== "undefined" &&
      location.name !== "" &&
      location.formatted_address.indexOf(location.name) < 0
    ) {
      const formattedAddressArray = location.formatted_address.split(", ");
      formattedAddressArray.shift();
      return location.name + ", " + formattedAddressArray;
    } else {
      return location.formatted_address;
    }
  }

  endTripFareForDaily: any = {};
  showEndTripFare = false;
  endTripFareForRental: any = [];
  endTripFareForOutstation: any = [];

  checkAddress() {
    if (
      this.endTripDetails.dropLat === undefined ||
      this.endTripDetails.dropLng === undefined
    ) {
      this.toastr.showtoast("warn", "Please Enter Correct Drop Address");
      return false;
    } else if (
      this.endTripDetails.pickupLat === undefined ||
      this.endTripDetails.pickupLng === undefined
    ) {
      this.toastr.showtoast("warn", "Please Enter Correct Pickup Address");
      return false;
    } else {
      return true;
    }
  }

  getFareBeforeEndTrip(data) {
    const checkLatLng = this.checkAddress();
    if (checkLatLng) {
      let endTime = data.endTime;
      endTime = moment(data.endTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm"
      );
      endTime = moment(endTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      let startTime = data.startTime;
      startTime = moment(data.startTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm"
      );
      startTime = moment(startTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      let getFareTripObj = {};
      if (this.endTripDetails.tripType === "daily") {
        this.endTripDetails.convertedWaitingSecond = data.waitingSecond * 60;
        getFareTripObj = {
          tripId: this.tripdetails.tripno,
          startTime: startTime,
          endTime: endTime,
          fromAddress: this.endTripDetails.startAddress,
          endAddress: this.endTripDetails.endAddress,
          pickupLat: this.endTripDetails.pickupLat,
          pickupLng: this.endTripDetails.pickupLng,
          dropLat: this.endTripDetails.dropLat,
          dropLng: this.endTripDetails.dropLng,
          waitingSecond: this.endTripDetails.convertedWaitingSecond,
          distance: data.distance,
          duration: data.duration,
        };
      } else if (this.endTripDetails.tripType === "rental") {
        getFareTripObj = {
          tripId: this.tripdetails.tripno,
          startTime: startTime,
          endTime: endTime,
          fromAddress: this.endTripDetails.startAddress,
          endAddress: this.endTripDetails.endAddress,
          pickupLat: this.endTripDetails.pickupLat,
          pickupLng: this.endTripDetails.pickupLng,
          dropLat: this.endTripDetails.dropLat,
          dropLng: this.endTripDetails.dropLng,
          startMeter: data.startMeter,
          endMeter: data.endMeter,
        };
      } else if (this.endTripDetails.tripType === "outstation") {
        getFareTripObj = {
          tripId: this.tripdetails.tripno,
          startTime: startTime,
          endTime: endTime,
          fromAddress: this.endTripDetails.startAddress,
          endAddress: this.endTripDetails.endAddress,
          pickupLat: this.endTripDetails.pickupLat,
          pickupLng: this.endTripDetails.pickupLng,
          dropLat: this.endTripDetails.dropLat,
          dropLng: this.endTripDetails.dropLng,
          startMeter: data.startMeter,
          endMeter: data.endMeter,
          hillKm: data.hillKm,
        };
      }
      this.tripservice
        .getFareForEndingTrip(getFareTripObj)
        .then(msg => {
          this.showEndTripFare = true;
          this.toastr.showtoast("success", msg.message);
          this.convertFareForEndTrip(msg);
        })
        .catch(res => {
          this.showEndTripFare = false;
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  convertFareForEndTrip(data) {
    if (this.endTripDetails["tripType"] === "daily") {
      const dailyFare = data["fareDetails"];
      this.endTripFareForDaily = {
        actualCost: this.amountToBeFloater(dailyFare.actualCost),
        baseFare: this.amountToBeFloater(dailyFare.baseFare),
        discount: this.amountToBeFloater(dailyFare.discount),
        dist: this.amountToBeFloater(dailyFare.dist),
        distanceFare: this.amountToBeFloater(dailyFare.distanceFare),
        nightChargedApplied: dailyFare.nightChargedApplied["isApply"],
        nightCharge: dailyFare.nightChargedApplied["isApply"]
          ? "Applied"
          : "Not Applied",
        paymentmode: dailyFare.paymentmode,
        tax: this.amountToBeFloater(dailyFare.tax),
        totalFare: this.amountToBeFloater(dailyFare.totalFare),
        travelFare: this.amountToBeFloater(dailyFare.travelFare),
        travelRate: this.amountToBeFloater(dailyFare.travelRate),
        waitingCharge: this.amountToBeFloater(dailyFare.waitingCharge),
        waitingFare: this.amountToBeFloater(dailyFare.waitingFare),
      };
    } else if (this.endTripDetails["tripType"] === "rental") {
      const rentalFare = data["rentalPackageInvoiceDetailsData"];
      this.endTripFareForRental = rentalFare;
    } else if (this.endTripDetails["tripType"] === "outstation") {
      const outstationFare = data["rentalPackageInvoiceDetailsData"];
      this.endTripFareForOutstation = outstationFare;
    }
  }

  endTripDet(data) {
    if (
      this.endTripDetails.dropLat === undefined ||
      this.endTripDetails.dropLng === undefined
    ) {
      this.toastr.showtoast("warn", "Please Enter Correct Drop Address");
    } else {
      // let endTime = data.endTime;
      // endTime = moment(data.endTime, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm');
      // endTime = moment(endTime, 'HH:mm').format('HH:mm:ss');
      // let startTime = data.startTime;
      // startTime = moment(data.startTime, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm');
      // startTime = moment(startTime, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      let endTime = data.endTime;
      endTime = moment(data.endTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm"
      );
      endTime = moment(endTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      let startTime = data.startTime;
      startTime = moment(data.startTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm"
      );
      startTime = moment(startTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );

      let endTripObj = {};
      if (this.endTripDetails.tripType === "daily") {
        this.endTripDetails.convertedWaitingSecond = data.waitingSecond * 60;
        endTripObj = {
          tripId: this.tripdetails.tripno,
          startTime: startTime,
          endTime: endTime,
          fromAddress: this.endTripDetails.startAddress,
          endAddress: this.endTripDetails.endAddress,
          pickupLat: this.endTripDetails.pickupLat,
          pickupLng: this.endTripDetails.pickupLng,
          dropLat: this.endTripDetails.dropLat,
          dropLng: this.endTripDetails.dropLng,
          waitingSecond: this.endTripDetails.convertedWaitingSecond,
          distance: data.distance,
          duration: data.duration,
          status: 4,
          endFromAdmin: "admin",
        };
      } else if (this.endTripDetails.tripType === "rental") {
        endTripObj = {
          tripId: this.tripdetails.tripno,
          startTime: startTime,
          endTime: endTime,
          fromAddress: this.endTripDetails.startAddress,
          endAddress: this.endTripDetails.endAddress,
          pickupLat: this.endTripDetails.pickupLat,
          pickupLng: this.endTripDetails.pickupLng,
          dropLat: this.endTripDetails.dropLat,
          dropLng: this.endTripDetails.dropLng,
          startMeter: data.startMeter,
          endMeter: data.endMeter,
          status: 4,
          endFromAdmin: "admin",
        };
      } else if (this.endTripDetails.tripType === "outstation") {
        endTripObj = {
          tripId: this.tripdetails.tripno,
          startTime: startTime,
          endTime: endTime,
          fromAddress: this.endTripDetails.startAddress,
          endAddress: this.endTripDetails.endAddress,
          pickupLat: this.endTripDetails.pickupLat,
          pickupLng: this.endTripDetails.pickupLng,
          dropLat: this.endTripDetails.dropLat,
          dropLng: this.endTripDetails.dropLng,
          startMeter: data.startMeter,
          endMeter: data.endMeter,
          hillKm: data.hillKm,
          status: 4,
          endFromAdmin: "admin",
        };
      }
      this.tripservice
        .endATrip(endTripObj)
        .then(msg => {
          this.toastr.showtoast("success", msg.message);
          this.goBack();
        })
        .catch(res => {
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeOut);
  }

  retryBooking() {
    const id = this.tripdetailsId;
    this.router.navigate(["/pages/taxidispatch/retry-mtd", id]);
  }

  /** Start Trip */

  listenStartLoc(event) {
    this.startTripDetails.startAddress = this.doReturnFormattedAddress(event);
    this.startTripDetails.pickupLat = event.geometry.location.lat();
    this.startTripDetails.pickupLng = event.geometry.location.lng();
  }

  checkStartTripLoc(event) {
    if (this.startTripDetails.startAddress === "") {
      this.startTripDetails.pickupLat = undefined;
      this.startTripDetails.pickupLng = undefined;
    }
  }

  checkAddr() {
    if (
      this.startTripDetails.pickupLat === undefined ||
      this.startTripDetails.pickupLng === undefined
    ) {
      this.toastr.showtoast("warn", "Please Enter Correct Pickup Address");
      return false;
    } else {
      return true;
    }
  }

  startTripBtn(data) {
    if (this.tripdetails.triptype === "daily") {
      this.startMeter = "";
    } else {
      this.startMeter = data.startMeter;
    }
    const checkLatLng = this.checkAddr();
    if (checkLatLng) {
      let startTime = data.startTime;
      startTime = moment(data.startTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm"
      );
      startTime = moment(startTime, "YYYY-MM-DDTHH:mm").format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );
      const startTripObj = {
        tripId: data.tripno,
        status: 3,
        newUpdate: true,
        startTime: startTime,
        fromAddress: data.startAddress,
        pickupLat: data.pickupLat,
        pickupLng: data.pickupLng,
        startMeter: this.startMeter,
        endFromAdmin: "admin",
      };
      this.tripservice
        .startATrip(startTripObj)
        .then(msg => {
          this.toastr.showtoast("success", msg.message);
          this.goBack();
        })
        .catch(res => {
          this.toastr.showtoast("error", res.message);
        });
    }
  }

  EstimationFare(Popup) {
    this.modalService.open(Popup, { size: "lg" });
  }

  closed1(d) {
    d("Cross click");
  }
  submitted2(d) {
    d("Cross click");
  }

  closed2(d) {
    d("Cross click");
  }
}
