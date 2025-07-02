import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { AppSettings, featuresSettings, FarefieldConfig } from '../../../app.config';
import { TaxiDispatchService } from '../taxidispatch.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { FareInvoiceDetails, FareStructure } from '../../../fare.config';
import * as _ from 'lodash';
import { enableRipple } from '@syncfusion/ej2-base';

//enable ripple style
enableRipple(true);
interface triptypeData {
  value: string;
  label: string;
}

interface ngSelectOptionsDataStructure {
  value: string;
  label: string;
  disabled?: boolean;
}

interface packageData {
  distance: number;
  duration: number;
  name: string;
  price: number;
  _id: string;
}

@Component({
  selector: 'ngx-retry-mtd',
  templateUrl: './retry-mtd.component.html',
  styleUrls: ['./retry.component.scss']
})

export class RetryMTDComponent implements OnInit, OnDestroy {

  id: number;
  private sub: any;
  tripDetails: any;
  riderDetails: any;
  driverDetails: any;
  list: any = {
    fareDetails: {
      distance: 0,
      BaseFare: 0,
      currency: AppSettings.defaultcur,
      tax: 0,
      minFare: 0,
      travelRate: 0,
      DetuctedFare: 0,
      perKMRate: 0,
      KMFare: 0,
      waitingCharge: 0,
      waitingFare: 0,
      pickupCharge: 0,
      travelFare: 0,
      totalFare: 0,
      fareType: 'N/A',
      inSecondaryCur: 0,
      surgePercent: 0,
      surgeLabel: 'N/A',
      packageName: 'N/A',
      packageDuration: 0,
      packageDistance: 0.00,
      baseFare: 0.00,
      additionalFareLabel: 'N/A',
      additionalTimeLabel: 'N/A',
      bkm: 0.00,
      timeFare: 0.00,
      fare: 0.00
    },
    distanceDetails: {
      timeLable: '0 Mins'
    },
    unit: 0
  };
  TripType: Array<triptypeData>;
  PackageList: Array<packageData>;
  vehicleArray: any;
  showVehicle: boolean = false;
  showEstimatedFare: boolean = false;
  showFareDetails: boolean = false;
  showSecondCurrency = AppSettings.toShowSeocndCurrency;
  secondCurrecny = AppSettings.secondCurrency;
  showError: any;
  availableTrips = featuresSettings.tripsAvailable;
  defaultUnit = featuresSettings.distanceUnit;
  noFilterThreshold: number = 4;
  public min = new Date();
  taxLabel = featuresSettings.taxFeeLabel;

  driverAssignmentTypes: Array<ngSelectOptionsDataStructure>;
  drivers: Array<ngSelectOptionsDataStructure>;
  bookingTypes: Array<ngSelectOptionsDataStructure>;

  dropformatAdd: any;
  pickupformatAdd: any;
  driverArray: any;
  temp: string = AppSettings.BASEURL;
  icon: any; requestType: number = 1;
  userDetails: any;

  newEst: boolean = false;

  showFareConfig = FarefieldConfig.showFareFromConfig;
  fareList: FareStructure[] = FareInvoiceDetails.availableFare;
  fareListCopy = [];


  promoCodeValues: any = {};
  blockPromo: boolean = false;

  pickupChargeValues: any = {};
  blockPickup: boolean = false;
  className: string = 'col-md-6';
  showPickupCharge = FarefieldConfig.showManuallyAddPickupCharge;
  serviceDatilsrental: any;
  minDate: any; // Date;// = new Date('8/3/2017 9:15 AM');
  maxDate: any; //Date;// = new Date('8/3/2017 11:30 AM');
  departArray: any = []; returnArray: any = [];
  returnMinDate: any;
  returnMaxDate: any;
  totalReturnHours: any = '';
  convertedTripDates: any = {};
  rideLaterMaxDate: any;
  rideLaterMinDate: any;
  rideLaterDateArray: any = [];
  rideLaterConvertedDate = 'today';
  showJourneyCard: boolean = false;

  constructor(private route: ActivatedRoute,
    private dataService: TaxiDispatchService,
    private toastr: ButtonToasterService,
    private router: Router,
    private location: Location,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private CommonSvc: CommonService) {
    this.list.rentalPackage = '';
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.CommonSvc.tripRequestedDrivers(this.id)
        .then(msg => {
          this.list.tripType = msg.TripDetails[0].triptype;
          this.tripDetails = msg.TripDetails[0];
          this.riderDetails = msg.RiderDetails[0];
          this.getDriverDetails(msg.DriverDetails);
          this.getRiderDetails(msg.RiderDetails);
          this.getTripDetails(this.tripDetails);
          this.list.bookingType = msg.TripDetails[0].bookingType;
        });
    });
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.initializeTripFunctions();
    this.convertTripType(this.availableTrips);
    this.list.unit = this.defaultUnit;
    this.fareListCopy = this.fareList;
  }

  getPackage(li, veh) {
    if (this.list.tripType === 'rental') {
      this.spinner.show();
      const data = {
        pick: this.list.pickupformatAdd,
        pickupLat: this.list.pickupLat,
        pickupLng: this.list.pickupLng
      };
      this.dataService
        .getPackageList(data)
        .then(res => {
          this.PackageList = res.packageDetail;
          this.serviceDatilsrental = res.serviceDetail[0] + ',' + res.serviceDetail[1];
          this.list.rentalPackage = li.packageId;
          const getVehicles = {
            tripTypeCode: this.list.tripType,
            serviceId: this.serviceDatilsrental,
            packageId: li.packageId
          };
          this.getFare(getVehicles, veh.vehicle);
          this.list.rideLaterDate = moment(veh.tripDT, 'DD-MM-YYYY hh:mm A').format('DD MMM YYYY');
          this.list.rideLaterTime = moment(veh.tripDT, 'DD-MM-YYYY hh:mm A').format('hh:mm A');
          this.spinner.hide();
        })
        .catch(err => {
          this.toastr.showtoast('error', err.error.message);
          this.spinner.hide();
        });
    }
  }

  getErrorMsg() {
    if ((this.list.pickupLocation === undefined || this.list.pickupLocation === '') && this.list.tripType === 'rental')
      return 'Select PickUp Locaction.';
    else return 'No Package Found.';
  }

  getDriverDetails(data) {
    if (this.list.tripType === 'daily') {
      if (data.length > 0) {
        this.getAllDrivers();
        this.list.driverAssignmentType = 'manual-assign';
        this.driverDetails = data[0];
        this.list.driverId = data[0]._id;
        this.list.driverName = data[0].fname;
      } else {
        this.list.driverAssignmentType = 'auto-assign';
        this.driverDetails = [];
      }
    } else {
      this.list.driverAssignmentType = 'auto-assign';
    }
  }

  getRiderDetails(data) {
    if (data !== undefined) {
      if (data.length > 0) {
        this.list.user = data[0];
        this.list.phone = (data[0].phone) ? data[0].phone : '';
        this.list.name = (data[0].fname) ? data[0].fname : '';
        this.list.email = (data[0].email) ? data[0].email : '';
        this.userDetails = data[0];
      }
    }
  }

  disableFields: boolean = false;

  checkTripType(data) {
    if (data === 'daily') {
      this.disableFields = false;
    } else {
      this.disableFields = true;
    }
  }

  getTripDetails(data) {
    this.list.timeLable = data.estTime;
    this.list.fareDetails.timeLable = this.list.timeLable;
    this.list.tripType = data.triptype;
    this.checkTripType(this.list.tripType);
    this.list.pickupLocation = data.dsp.start;
    this.list.pickupLat = data.dsp.startcoords[1];
    this.list.pickupLng = data.dsp.startcoords[0];
    this.list.dropLocation = data.dsp.end;
    this.list.dropLat = data.dsp.endcoords ? data.dsp.endcoords[1] : '';
    this.list.dropLng = data.dsp.endcoords ? data.dsp.endcoords[0] : '';
    if (this.list.tripType === 'outstation') {
      this.showOutstationValues(data.dsp, data);
    }
    this.getPackage(data.csp, data);
    this.showFare(data.csp, data.dsp);
    this.list.fareDetails.totalFare = data.fare;
    this.list.fareDetails.timeLable = this.list.timeLable;
    this.setFare(this.list.fareDetails);
    this.showEstimatedFare = true; this.showFareDetails = true;
    if (this.list.tripType === 'daily') {
      const getVehicles = {
        tripType: this.list.tripType,
        pickupLat: this.list.pickupLat,
        pickupLng: this.list.pickupLng,
        dropLat: this.list.dropLat,
        dropLng: this.list.dropLng
      };
      this.getFare(getVehicles, data.vehicle);
    }
    this.list.serviceTypeId = data.service;
    this.list.vehicletype = data.vehicle;
    this.list.bookingType = data.bookingType;
    this.list.tripTime = '';
    if (this.list.bookingType === 'rideLater') {
      this.list.tripTime = moment(data.tripDT, 'DD-MM-YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      this.list.rideLaterDate = moment(data.tripDT, 'DD-MM-YYYY hh:mm A').format('DD MMM YYYY');
      this.list.rideLaterTime = moment(data.tripDT, 'DD-MM-YYYY hh:mm A').format('hh:mm A');
    }
  }

  showOutstationValues(data, veh) {
    let stDate = ''; let stTime = ''; let reDate = ''; let reTime = '';
    if (data.outstationType === 'oneway') {
      stDate = (data.startDay) ? moment(data.startDay, 'DD MMM YYYY hh:mm A').format('DD MMM YYYY') : '';
      stTime = (data.startDay) ? moment(data.startDay, 'DD MMM YYYY hh:mm A').format('hh:mm A') : '';
    } else {
      stDate = (data.startDay) ? moment(data.startDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('DD MMM YYYY') : '';
      stTime = (data.startDay) ? moment(data.startDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('hh:mm A') : '';
      reDate = (data.returnDay) ? moment(data.returnDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('DD MMM YYYY') : '';
      reTime = (data.returnDay) ? moment(data.returnDay, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format('hh:mm A') : '';
    }
    this.list.bookingType = 'rideLater';
    this.list.departDate = stDate;
    this.list.time = stTime;
    this.list.returnDate = reDate;
    this.list.returnTime = reTime;
    this.showJourneyCard = true;
    this.list.journeyTrip = data.outstationType === 'round' ? 'roundtrip' : data.outstationType;
    this.convertedTripDates = {
      startDate: stDate,
      startTime: stTime,
      endDate: reDate,
      endTime: reTime,
      startDay: data.startDay,
      endDay: data.returnDay
    };
    const getVehicles = {
      tripTypeCode: this.list.tripType,
      pickupLat: this.list.pickupLat,
      pickupLng: this.list.pickupLng,
      dropLat: this.list.dropLat,
      dropLng: this.list.dropLng,
      outstationType: '',
      startDay: '',
      startTime: '',
      returnDay: '',
      returnTime: ''
    };
    if (this.list.journeyTrip === 'oneway') {
      getVehicles.outstationType = 'oneway';
      getVehicles.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
    } else if (this.list.journeyTrip === 'roundtrip') {
      getVehicles.outstationType = 'round';
      getVehicles.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
      getVehicles.returnDay = this.convertedTripDates.endDate + ', ' + this.convertedTripDates.endTime;
    }
    this.getFare(getVehicles, veh.vehicle);
  }

  showFare(data, dsp) {
    this.list.fareDetails = {
      distance: dsp.distanceKM,
      BaseFare: data.base,
      currency: AppSettings.defaultcur,
      tax: data.tax,
      taxPercentage: data.taxPercentage,
      minFare: data.minFare,
      travelRate: data.travelRate,
      DetuctedFare: 0.00,
      perKMRate: this.getPerKM(data.distfare, dsp.distanceKM),
      KMFare: data.distfare,
      waitingCharge: 0.00,
      waitingFare: 0.00,
      discountAmt: (data.promoamt) ? data.promoamt : 0.00,
      promoCode: (data.promo) ? data.promo : '',
      pickupCharge: data.conveyance,
      travelFare: 0.00,
      fareType: 'KM Rate',
      inSecondaryCur: 0.00,
      surgePercent: 0.00,
      surgeLabel: 'N/A',
      packageName: (data.packageName) ? data.packageName : 'N/A',
      packageDuration: (data.time) ? data.time : '',
      packageDistance: (data.dist) ? data.dist : '',
      baseFare: (data.distfare) ? data.distfare : '',
      additionalFareLabel: (data.remainingFareLabel) ? data.remainingFareLabel : '',
      additionalTimeLabel: (data.remainingTimeFareLabel) ? data.remainingTimeFareLabel : '',
      bkm: (data.perKmRate) ? data.perKmRate : '',
      timeFare: (data.timefare) ? data.timefare : '',
      fare: (data.distfare) ? data.distfare : '',
      totalFare: (data.cost) ? data.cost : '',
    };
    // tslint:disable-next-line:radix
    this.pickupChargeValues.pickupCharge = parseInt(data.conveyance) > 0 ? parseInt(data.conveyance) : null;
    // tslint:disable-next-line:radix
    this.blockPickup = parseInt(data.conveyance) > 0 ? true : false;
  }

  getPerKM(dist, km) {
    if (this.list.tripType === 'daily') {
      return (dist / km).toFixed(2);
    } else return 0.00;
  }

  setPromoCodeValues(sideVal, val) {
    const index = this.fareListCopy.findIndex(p => p.ref === 'discountAmt');
    if (index !== -1) {
      this.fareListCopy[index].value = val;
      this.fareListCopy[index].sideVal = sideVal;
    } else { }
  }

  setFare(data) {
    const inputArr = this.fareList;
    this.fareListCopy = [];
    inputArr.forEach(el => {
      this.fareListCopy.push({
        label: el.label,
        value: data[el.ref] ? data[el.ref] : '0',
        ref: el.ref,
        unit: el.unit ? (el.unit === 'KM' || el.unit === 'Miles' || el.unit === '%' ? el.unit : '') : '',
        currency: el.currency ? el.currency : '',
        type: el.type,
        typeValue: el.type ? data[el.type] : '',
        sideValLabel: el.sideValLabel,
        sideVal: data[el.sideValLabel] ? data[el.sideValLabel] : '',
        sideValUnit: this.splitUnit(data.currency, el.sideValUnit),
      });
    });
  }

  splitUnit(data, val) {
    let retVal = '';
    if (val) {
      const spl = val.split('/');
      if (spl.length > 1) {
        spl[0] = data;
        retVal = spl.join('/');
      } else { retVal = spl[0]; }
    }
    return retVal;
  }

  getFare(getVehicles, vehicle) {
    if (this.list.tripType === 'daily') {
      this.spinner.show();
      this.vehicleArray = [];
      this.dataService.Getfaredetails(getVehicles)
        .then(res => {
          this.vehicleArray = res.vehicleCategories;
          for (const item of this.vehicleArray) {
            if (item.isRideLater) {
              this.bookingTypes = [];
              this.getRideLaterType();
            }
          }
          this.showVehicle = true;
          this.list.vehicletype = vehicle;
          this.CommonSvc.doAddFormControlNgSelectClass();
          this.spinner.hide();
        })
        .catch(err => {
          this.toastr.showtoast('error', err.message);
          this.spinner.hide();
        });
    } else if (this.list.tripType === 'rental') {
      this.spinner.show();
      this.vehicleArray = [];
      this.dataService
        .getVehicleForrental(getVehicles)
        .then(res => {
          this.list.serviceTypeId = undefined;
          this.vehicleArray = res.data;
          for (const item of this.vehicleArray) {
            if (item.type === vehicle) {
              this.list.serviceTypeId = item._id;
            }
          }
          this.showVehicle = true;
          this.list.driverAssignmentType = 'auto-assign';
          this.list.bookingType = 'rideLater';
          this.CommonSvc.doAddFormControlNgSelectClass();
          this.spinner.hide();
        })
        .catch(err => {
          this.toastr.showtoast('error', err.message);
          this.spinner.hide();
        });
    } else if (this.list.tripType === 'outstation') {
      this.spinner.show();
      this.vehicleArray = [];
      this.dataService
        .getVehicleForOutstation(getVehicles)
        .then(res => {
          this.list.serviceTypeId = undefined;
          this.vehicleArray = res.vehicleList;
          this.totalReturnHours = res.returnHours;
          for (const item of this.vehicleArray) {
            if (item.type === vehicle) {
              this.list.serviceTypeId = item._id;
              this.list.fareDetails = {
                packageName: item.packageName,
                packageDuration: item.timeLable,
                packageDistance: item.distanceLable,
                baseFare: item.fareDetails.baseFare,
                additionalFareLabel: item.fareDetails.remainingFareLabel,
                additionalTimeLabel: item.fareDetails.remainingTimeFareLabel,
                bkm: item.fareDetails.remainingFare,
                timeFare: item.fareDetails.extraTimeFare,
                fare: item.fareDetails.totalFare,
                currency: AppSettings.defaultcur
              };
            }
          }
          this.showVehicle = true;
          this.list.driverAssignmentType = 'auto-assign';
          this.list.bookingType = 'rideLater';
          this.CommonSvc.doAddFormControlNgSelectClass();
          this.spinner.hide();
        })
        .catch(err => {
          this.toastr.showtoast('error', err.message);
          this.spinner.hide();
        });
    }
  }

  ngOnInit() {
    this.initialize();
    this.initializeDrop(); //setting for drop down for india loction only(1st perference)
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /******************************************************************* */

  convertTripType(data) {
    const typeArr = [];
    data.forEach(el => {
      typeArr.push({
        label: el,
        value: el.toLowerCase()
      });
    });
    this.TripType = typeArr;
  }

  tripTypeDoAssignSelected(option: triptypeData) { }

  tripTypeDoUnassignDeselected(option: triptypeData) { }

  listenPickupLocation(event) {
    try {
      if (
        typeof event.formatted_address !== 'undefined'
        && event.formatted_address !== ''
      ) {
        delete this.list.pickupLat;
        delete this.list.pickupLng;
        if (event.formatted_address === undefined) {
          this.list.pickupLocation = '';
        } else {
          this.list.pickupLocation = this.doReturnFormattedAddress(event);
          this.pickupformatAdd = this.list.pickupLocation;
          const pickup = event.geometry.location;

          this.list.pickupLat = pickup.lat();
          this.list.pickupLng = pickup.lng();
          if (this.list.tripType === 'rental') {
            const data = {
              pick: this.list.pickupformatAdd,
              pickupLat: this.list.pickupLat,
              pickupLng: this.list.pickupLng
            };
            this.dataService
              .getPackageList(data)
              .then(res => {
                this.list.rentalPackage = undefined;
                this.showVehicle = false;
                this.PackageList = res.packageDetail;
                this.serviceDatilsrental = res.serviceDetail[0] + ',' + res.serviceDetail[1];
              })
              .catch(err => {
                this.toastr.showtoast('error', err.error.message);
              });
          }
        }
      }
    } catch (error) {
      this.list.pickupLocation = '';
    }
    this.pickupout();
  }

  getPack() {
    if (this.list.tripType === 'rental') {
      const data = {
        pick: this.list.pickupformatAdd,
        pickupLat: this.list.pickupLat,
        pickupLng: this.list.pickupLng
      };
      this.dataService
        .getPackageList(data)
        .then(res => {
          this.list.rentalPackage = undefined;
          this.list.serviceTypeId = undefined;
          this.showVehicle = false;
          this.clearList();
          this.PackageList = res.packageDetail;
          this.serviceDatilsrental = res.serviceDetail[0] + ',' + res.serviceDetail[1];
        })
        .catch(err => {
          this.toastr.showtoast('error', err.error.message);
        });
    }
  }

  listenDropLocation(event) {
    delete this.list.dropLat;
    delete this.list.dropLng;
    if (event.formatted_address === undefined) {
      this.list.dropLocation = ' ';
    } else {
      const Dropdown = event.geometry.location;
      this.list.dropLocation = this.doReturnFormattedAddress(event);
      this.dropformatAdd = this.list.dropLocation;
      const Dropdownlat = Dropdown.lat();
      const Dropdownlng = Dropdown.lng();
      if (this.list.pickupLat === Dropdownlat
        && this.list.pickupLng === Dropdownlng) {
        this.checklocation();
      } else {
        this.list.dropLat = Dropdownlat;
        this.list.dropLng = Dropdownlng;
        this.clearList();
      }
    }
    this.dropout();
  }

  clearList() {
    this.list.serviceTypeId = undefined;
    this.list.vehicletype = undefined;
    this.list.showNearByDriversList = false;
    this.list.driverId = '';
    this.list.driverName = '';
    this.list.driverAssignmentType = 'auto-assign';
    this.list.timeLable = '0 Mins';
    this.list.fareDetails.timeLable = this.list.timeLable;
    this.showEstimatedFare = true;
    this.showFareDetails = true;
    this.list.fareDetails = {
      distance: 0,
      BaseFare: 0,
      currency: AppSettings.defaultcur,
      tax: 0,
      minFare: 0,
      travelRate: 0,
      DetuctedFare: 0,
      perKMRate: 0,
      KMFare: 0,
      waitingCharge: 0,
      waitingFare: 0,
      pickupCharge: 0,
      travelFare: 0,
      fareType: 'N/A',
      totalFare: 0,
      inSecondaryCur: 0,
      surgePercent: 0,
      surgeLabel: 'N/A',
      packageName: 'N/A',
      packageDuration: 0,
      packageDistance: 0.00,
      baseFare: 0.00,
      additionalFareLabel: 'N/A',
      additionalTimeLabel: 'N/A',
      bkm: 0.00,
      timeFare: 0.00,
      fare: 0.00
    };
    (this.list.distanceDetails = {
      timeLable: '0 Mins'
    }),
      (this.list.unit = 0);
    this.blockPromo = false;
    this.promoCodeValues = {};
    this.promoCodeValues = {
      discountAmt: 0
    };
    this.list.unit = this.defaultUnit;
    this.list.driverAssignmentType = 'auto-assign';
    this.showFareConfig = FarefieldConfig.showFareFromConfig;
    delete this.fareListCopy;
    this.fareListCopy = [];
    this.fareListCopy = this.fareList;
  }

  pickupout() {
    if (this.list.pickupLocation !== this.pickupformatAdd) {
      this.list.pickupLocation = '';
    }
  }

  dropout() {
    if (this.list.dropLocation !== this.dropformatAdd) {
      this.list.dropLocation = '';
    }
  }

  checklocation() {
    this.toastr.showtoast('error', `OOPS!!!Check the Pickup & Drop Location`);
  }

  doReturnFormattedAddress(location) {
    if (
      typeof location.name !== 'undefined'
      && location.name !== ''
      && location.formatted_address.indexOf(location.name) < 0
    ) {
      const formattedAddressArray = location.formatted_address.split(', ');
      formattedAddressArray.shift();
      return location.name + ', ' + formattedAddressArray;
    } else {
      return location.formatted_address;
    }
  }

  initialize() {
    const options = {
      types: ["(cities)"],
      componentRestrictions: {country: "in"},
      fields: ["formatted_address", "geometry"],
    };
    const input = <HTMLInputElement>document.getElementById('pickupLocation');
    const autocomplete = new google.maps.places.Autocomplete(input, options);
  }

  initializeDrop() {
    const options = {
      types: ["(cities)"],
      componentRestrictions: {country: "in"},
      fields: ["formatted_address", "geometry"],
    };
    const input = <HTMLInputElement>document.getElementById('dropLocation');
    const autocomplete = new google.maps.places.Autocomplete(input, options);
  }

  setPickupCharge(data) {
    this.blockPickup = true;
  }

  changePickup() {
    this.blockPickup = false;
    // this.pickupChargeValues.pickupCharge = null;
  }

  getfare() {
    if (this.list.tripType === 'daily') {
      this.spinner.show();
      if (
        this.list.dropLat === undefined &&
        this.list.dropLng === undefined &&
        (this.list.pickupLat !== this.list.dropLat && this.list.pickupLng !== this.list.dropLng)
      ) {
        this.checklocation();
        this.showVehicle = false;
        this.spinner.hide();
      } else {
        const getVehicles = {
          tripType: this.list.tripType,
          pickupLat: this.list.pickupLat,
          pickupLng: this.list.pickupLng,
          dropLat: this.list.dropLat,
          dropLng: this.list.dropLng
        };
        this.spinner.hide();
        this.dataService
          .Getfaredetails(getVehicles)
          .then(res => {
            this.list.serviceTypeId = undefined;
            this.showEstimatedFare = false;
            this.showFareDetails = false;
            this.list.fareDetails = {
              distance: 0,
              BaseFare: 0,
              currency: AppSettings.defaultcur,
              tax: 0,
              minFare: 0,
              travelRate: 0,
              DetuctedFare: 0,
              perKMRate: 0,
              KMFare: 0,
              waitingCharge: 0,
              waitingFare: 0,
              pickupCharge: 0,
              travelFare: 0,
              fareType: 'N/A',
              totalFare: 0,
              inSecondaryCur: 0,
              surgePercent: 0,
              surgeLabel: 'N/A',
              packageName: 'N/A',
              packageDuration: 0,
              packageDistance: 0.00,
              baseFare: 0.00,
              additionalFareLabel: 'N/A',
              additionalTimeLabel: 'N/A',
              bkm: 0.00,
              timeFare: 0.00,
              fare: 0.00
            };
            (this.list.distanceDetails = {
              timeLable: '0 Mins'
            }),
              (this.list.unit = 0);
            this.blockPromo = false;
            this.promoCodeValues = {};
            this.promoCodeValues = {
              discountAmt: 0
            };
            this.list.unit = this.defaultUnit;
            this.list.driverAssignmentType = 'auto-assign';
            this.list.bookingType = 'rideNow';
            this.vehicleArray = res.vehicleCategories;
            this.showVehicle = true;
            this.showFareConfig = FarefieldConfig.showFareFromConfig;
            delete this.fareListCopy;
            this.fareListCopy = [];
            this.fareListCopy = this.fareList;
            this.spinner.hide();
          })
          .catch(err => {
            this.toastr.showtoast('error', err.error.message);
            this.spinner.hide();
            this.showError = err.error.message;
          });
      }
      this.CommonSvc.doAddFormControlNgSelectClass();
    } else if (this.list.tripType === 'outstation') {
      this.spinner.show();
      if (
        this.list.dropLat === undefined &&
        this.list.dropLng === undefined &&
        (this.list.pickupLat !== this.list.dropLat && this.list.pickupLng !== this.list.dropLng)
      ) {
        this.checklocation();
        this.showVehicle = false;
        this.spinner.hide();
      } else {
        const getVehicles = {
          tripTypeCode: this.list.tripType,
          pickupLat: this.list.pickupLat,
          pickupLng: this.list.pickupLng,
          dropLat: this.list.dropLat,
          dropLng: this.list.dropLng,
          outstationType: this.list.journeyTrip,
          startDay: '',
          startTime: '',
          returnDay: '',
          returnTime: ''
        };
        if (this.list.journeyTrip === 'oneway') {
          getVehicles.outstationType = 'oneway';
          this.convertedTripDates.startTime = moment(this.list.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
          getVehicles.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
          this.convertedTripDates.startDay = getVehicles.startDay;
        } else if (this.list.journeyTrip === 'roundtrip') {
          getVehicles.outstationType = 'round';
          this.convertedTripDates.startTime = moment(this.list.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
          this.convertedTripDates.endTime = moment(this.list.returnTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
          this.convertedTripDates.endDate = moment(this.list.returnDate, 'ddd, DD MMM').format('DD MMM YYYY');
          getVehicles.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
          getVehicles.returnDay = this.convertedTripDates.endDate + ', ' + this.convertedTripDates.endTime;
        }
        this.dataService
          .getVehicleForOutstation(getVehicles)
          .then(res => {
            this.list.serviceTypeId = undefined;
            this.showEstimatedFare = false;
            this.showFareDetails = false;
            this.list.fareDetails = {
              distance: 0,
              BaseFare: 0,
              currency: AppSettings.defaultcur,
              tax: 0,
              minFare: 0,
              travelRate: 0,
              DetuctedFare: 0,
              perKMRate: 0,
              KMFare: 0,
              waitingCharge: 0,
              waitingFare: 0,
              pickupCharge: 0,
              travelFare: 0,
              fareType: 'N/A',
              totalFare: 0,
              inSecondaryCur: 0,
              surgePercent: 0,
              surgeLabel: 'N/A',
              packageName: 'N/A',
              packageDuration: 0,
              packageDistance: 0.00,
              baseFare: 0.00,
              additionalFareLabel: 'N/A',
              additionalTimeLabel: 'N/A',
              bkm: 0.00,
              timeFare: 0.00,
              fare: 0.00
            };
            (this.list.distanceDetails = {
              timeLable: '0 Mins'
            }),
              (this.list.unit = 0);
            this.blockPromo = false;
            this.promoCodeValues = {};
            this.promoCodeValues = {
              discountAmt: 0
            };
            this.list.unit = this.defaultUnit;
            this.list.driverAssignmentType = 'auto-assign';
            this.list.bookingType = 'rideLater';
            this.vehicleArray = res.vehicleList;
            this.totalReturnHours = res.returnHours;
            this.showVehicle = true;
            this.showFareConfig = FarefieldConfig.showFareFromConfig;
            delete this.fareListCopy;
            this.fareListCopy = [];
            this.fareListCopy = this.fareList;
            this.spinner.hide();
          })
          .catch(err => {
            this.toastr.showtoast('error', err.error.message);
            this.spinner.hide();
            this.showError = err.error.message;
          });
      }
    }
  }

  SetVehicleType(selectedVehicle: any, inputs: any) {
    if (!selectedVehicle) { return; }
    this.showEstimatedFare = true;
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.list.vehicletype = selectElementText;
    if (this.list.tripType === 'rental') {
      this.spinner.show();
      const dataTorental = {
        packageId: this.list.rentalPackage,
        tripTypeCode: 'rental',
        vehicleTypeId: inputs.serviceTypeId
      };
      this.getNearByDrivers('');
      this.dataService
        .getFareForRental(dataTorental)
        .then(res => {
          this.showFareConfig = FarefieldConfig.showFareFromConfig;
          this.list.fareDetails = res.data;
          this.spinner.hide();
          if (this.list.fareDetails.currency === undefined || this.list.fareDetials.currency === 'undefined') {
            this.list.fareDetails.currency = AppSettings.defaultcur;
            this.list.fareDetails.fareType = 'N/A';
          }
        })
        .catch(err => {
          this.showFareDetails = false;
          this.spinner.hide();
          this.toastr.showtoast('error', err.message);
          this.showError = err.message;
        });
    } else if (this.list.tripType === 'daily') {
      this.spinner.show();
      for (const item of this.vehicleArray) {
        if (item.type === selectElementText) {
          this.icon = this.temp + item.file;
        }
        if (item.isRideLater) {
          this.bookingTypes = [];
          this.getRideLaterType();
        }
      }
      this.list.vehicletype = selectElementText;
      this.getNearByDrivers('');
      const getEstimated = {
        serviceType: this.list.vehicletype,
        time: '',
        tripType: this.list.tripType,
        pickupLat: this.list.pickupLat,
        pickupLng: this.list.pickupLng,
        dropLat: this.list.dropLat,
        dropLng: this.list.dropLng,
        serviceTypeId: this.list.serviceTypeId,
        pickupCity: ''
      };
      delete this.fareListCopy;
      this.fareListCopy = [];
      this.fareListCopy = this.fareList;
      this.dataService.estimatedfare(getEstimated) // estimationFare
        .then(res => {
          this.newEst = true;
          this.showFareDetails = true;
          this.list.estimationId = res.estimationId;
          this.list.vehicleDetailsAndFare = res.vehicleDetailsAndFare;
          this.list.distanceDetails = res.distanceDetails;
          this.list.fareDetails = res.vehicleDetailsAndFare.fareDetails;
          this.checkFare(res.vehicleDetailsAndFare.fareDetails);
          this.checkSurge(res.vehicleDetailsAndFare.fareDetails);
          const sp = (this.list.fareDetails.travelTime).split('.')[0];
          this.list.timeLable = sp + ' Mins';
          this.list.fareDetails.timeLable = this.list.timeLable;
          this.setFare(this.list.fareDetails);
          this.spinner.hide();
        })
        .catch(err => {
          this.showFareDetails = false;
          this.spinner.hide();
          this.toastr.showtoast('error', err.message);
          this.showError = err.message;
        });
    } else if (this.list.tripType === 'outstation') {
      for (const item of this.vehicleArray) {
        if (item.type === selectElementText) {
          this.showFareConfig = FarefieldConfig.showFareFromConfig;
          this.list.fareDetails = {
            packageName: item.packageName,
            packageDuration: item.timeLable,
            packageDistance: item.distanceLable,
            baseFare: item.fareDetails.baseFare,
            additionalFareLabel: item.fareDetails.remainingFareLabel,
            additionalTimeLabel: item.fareDetails.remainingTimeFareLabel,
            bkm: item.fareDetails.remainingFare,
            timeFare: item.fareDetails.extraTimeFare,
            fare: item.fareDetails.totalFare
          };
          if (this.list.fareDetails.currency === undefined || this.list.fareDetials.currency === 'undefined') {
            this.list.fareDetails.currency = AppSettings.defaultcur;
            this.list.fareDetails.fareType = 'N/A';
          }
        }
      }
      this.getNearByDrivers('');
      const outstationFare = {
        tripTypeCode: this.list.tripType,
        vehicleTypeId: inputs.serviceTypeId
      };
    }
  }

  checkFare(data) {
    if (data.fareType === 'flatrate') {
      this.list.fareDetails.KMFare = data.flatFare;
    }
  }

  checkSurge(data) {
    if (data.nightObj.isApply) {
      this.list.fareDetails.surgePercent = data.nightObj.percentageIncrease;
      this.list.fareDetails.surgeLabel = data.nightObj.alertLable;
    } else if (data.peakObj.isApply) {
      this.list.fareDetails.surgePercent = data.peakObj.percentageIncrease;
      this.list.fareDetails.surgeLabel = data.peakObj.alertLable;
    } else {
      this.list.fareDetails.surgePercent = 0;
      this.list.fareDetails.surgeLabel = 'N/A';
    }
  }

  showNearByDriversList: boolean = false;

  getNearByDrivers(i) {
    this.list.driverName = ''; this.list.driverId = '';
    if (this.showNearByDriversList && typeof this.list.vehicletype !== 'undefined') {
      const getDrivers = {
        serviceName: this.list.vehicletype,
        pickupLat: this.list.pickupLat,
        pickupLng: this.list.pickupLng,
        triptype: this.list.tripType
      };
      this.dataService.getNearestDrivers(getDrivers)
        .then(res => {
          this.spinner.hide();
          this.driverArray = res.drivers;
          this.list.fname = res.fname;
          this.list.lname = res.lname;
          this.list.code = res.code;
        })
        .catch(err => {
          this.toastr.showtoast('error', err.error.message);
          this.spinner.hide();
          this.showError = err.error.message;
        });
    } else if (this.showNearByDriversList && typeof this.list.vehicletype === 'undefined') {
      this.toastr.showtoast('warn', 'Please Select Vehicle');
    }
  }

  resetlist() {
    this.list = {
      tripType: 'daily',
      fareDetails: {
        distance: 0.00,
        BaseFare: 0.00,
        currency: AppSettings.defaultcur,
        tax: 0.00,
        minFare: 0.00,
        travelRate: 0.00,
        DetuctedFare: 0.00,
        perKMRate: 0.00,
        KMFare: 0.00,
        waitingCharge: 0.00,
        waitingFare: 0.00,
        pickupCharge: 0.00,
        discountAmt: 0.00,
        promoCode: '',
        travelFare: 0.00,
        totalFare: 0.00,
        fareType: 'N/A',
        inSecondaryCur: 0.00,
        surgePercent: 0.00,
        surgeLabel: 'N/A',
      },
      timeLable: '0 Mins',
      unit: 0
    };
    this.resetTrip();
    this.initializeTripFunctions();
  }

  resetTrip() {
    this.list.phone = this.userDetails.phone;
    this.list.name = this.userDetails.fname;
    this.list.email = this.userDetails.email;
    this.showVehicle = false;
    this.showEstimatedFare = true;
    this.showFareDetails = true;
    this.list.unit = this.defaultUnit;
    this.list.driverAssignmentType = 'auto-assign';
    this.list.bookingType = 'rideNow';
    this.list.serviceTypeId = undefined;
    this.list.tripTime = '';
    this.list.driverName = '';
    this.list.driverId = '';
    this.vehicleArray = [];
    delete this.fareListCopy;
    this.fareListCopy = [];
    this.fareListCopy = this.fareList;
  }

  routeBack() {
    this.location.back();
    // this.router.navigate(['/pages/tables/pending-requests']);
  }

  BookMyTrip() {
    if (this.newEst) {
      this.spinner.show();
      let adminId = '';
      if (localStorage.getItem('userType') === 'HotelAdmin') adminId = localStorage.getItem('type');
      const bookTripObj = {
        userId: '',
        phone: this.list.phone,
        email: this.list.email !== undefined ? this.list.email : '',
        fname: this.list.name,
        newuser: false,
        requestFrom: 'admin',
        adminId: localStorage.getItem('userId'),
        promo: '',
        promoAmt: '',
        tripType: this.list.tripType,
        driverAssignmentType: this.list.driverAssignmentType,
        driverName: '',
        driverId: '',
        requestId: this.id,
        manualPickupCharge: '',
        tripTime: '',
        tripDate: '',
        paymentMode: 'Cash',
        pickupCity: '',
        bookingType: this.list.bookingType,
        serviceType: this.list.vehicletype,
        estimationId: this.list.estimationId,
        hotelId: adminId,
      };
      if (this.blockPickup) {
        bookTripObj.manualPickupCharge = this.pickupChargeValues.pickupCharge;
      } else {
        delete bookTripObj.manualPickupCharge;
      }
      if (this.list.user) {
        bookTripObj.userId = this.list.user._id;
      }
      if (this.list.bookingType === 'rideLater') {
        bookTripObj.tripDate = moment(this.list.tripTime, 'YYYY-MM-DDTHH:mm:ss').format('DD-MM-YYYY');
        bookTripObj.tripTime = moment(this.list.tripTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
      }
      if (this.list.driverAssignmentType === 'manual-assign') {
        bookTripObj.driverName = this.list.driverName;
        bookTripObj.driverId = this.list.driverId;
      }
      // console.log(bookTripObj);
      this.dataService.retryMTD(bookTripObj)
        .then(response => {
          this.spinner.hide();
          this.toastr.showtoast('success', response['message']);
          this.routeBack();
        })
        .catch(e => {
          this.spinner.hide();
          this.toastr.showtoast('error', e.message);
        });
    } else {
      this.spinner.show();
      const bookTripObj = {
        driverAssignmentType: this.list.driverAssignmentType,
        driverName: '',
        driverId: '',
        requestId: this.id,
        manualPickupCharge: '',
      };
      if (this.blockPickup) {
        bookTripObj.manualPickupCharge = this.pickupChargeValues.pickupCharge;
      } else {
        delete bookTripObj.manualPickupCharge;
      }
      if (this.list.driverAssignmentType === 'manual-assign') {
        bookTripObj.driverName = this.list.driverName;
        bookTripObj.driverId = this.list.driverId;
      }
      // console.log(bookTripObj);
      this.dataService.retryMTD(bookTripObj)
        .then(response => {
          this.spinner.hide();
          this.toastr.showtoast('success', response['message']);
          this.routeBack();
        })
        .catch(e => {
          this.spinner.hide();
          this.toastr.showtoast('error', e.message);
        });
    }
  }

  /****** TRIP SETTINGS */

  initializeTripFunctions() {
    this.getDriverAssignmentModes();
    this.getTripBookingTypes();
  }

  getDriverAssignmentModes() {
    if (this.list.tripType === 'daily') {
      this.driverAssignmentTypes = [
        {
          disabled: false,
          value: 'auto-assign',
          label: 'Auto Assign'
        },
        {
          disabled: false,
          value: 'manual-assign',
          label: 'Manual Assign'
        }
      ];
    } else {
      this.driverAssignmentTypes = [
        {
          disabled: false,
          value: 'auto-assign',
          label: 'Auto Assign'
        },
        {
          disabled: false,
          value: 'manual-assign',
          label: 'Manual Assign'
        }
      ];
    }
  }

  getRideLaterType() {
    this.bookingTypes = [
      {
        disabled: false,
        value: 'rideNow',
        label: 'Ride Now'
      },
      {
        disabled: false,
        value: 'rideLater',
        label: 'Ride Later (Scheduled Trip)'
      }
    ];
  }

  getTripBookingTypes() {
    if (this.list.tripType === 'daily') {
      this.list.bookingType = this.list.bookingType ? this.list.bookingType : 'rideNow';
      this.bookingTypes = [
        {
          disabled: false,
          value: 'rideNow',
          label: 'Ride Now'
        },
        {
          disabled: true,
          value: 'rideLater',
          label: 'Ride Later (Scheduled Trip)'
        }
      ];
    } else if (this.list.tripType === 'rental') {
      this.list.bookingType = this.list.bookingType ? this.list.bookingType : 'rideLater';
      this.bookingTypes = [
        {
          disabled: false,
          value: 'rideNow',
          label: 'Ride Now'
        },
        {
          disabled: false,
          value: 'rideLater',
          label: 'Ride Later (Scheduled Trip)'
        }
      ];
    } else {
      this.list.bookingType = 'rideLater';
      this.bookingTypes = [
        {
          disabled: true,
          value: 'rideNow',
          label: 'Ride Now'
        },
        {
          disabled: false,
          value: 'rideLater',
          label: 'Ride Later (Scheduled Trip)'
        }
      ];
    }
  }

  getAllDrivers() {
    this.spinner.show();
    this.dataService.getAllDrivers().then(response => {
      this.spinner.hide();
      try {
        if (response['data'].length) {
          this.drivers = response['data'];
        }
      } catch (e) {
        this.spinner.hide();
        this.toastr.showtoast('error', e.toString());
      }
    }).catch(response => {
      this.spinner.hide();
      let errorMessage = 'Something went wrong.';
      errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
      this.toastr.showtoast('error', errorMessage.toString());
    });
  }

  selectedDriverType(options: ngSelectOptionsDataStructure) {
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.list.driverId = '';
    this.list.driverName = '';
    this.getAllDrivers();
    if (options.value === 'manual-assign') {
      this.showNearByDriversList = false;
    }
  }

  bookType(options: ngSelectOptionsDataStructure) {
    this.list.tripTime = '';
  }

  /** Ride Later */

  changeRideLaterDate(e, list) {
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.rideLaterConvertedDate = this.convertDate(selectElementText);
    if (selectElementText !== 'Today') {
      this.generateRideLaterTime('someOtherDay');
    } else {
      this.generateRideLaterTime('today');
    }
  }

  changeRideLaterTime(e, list) {
    this.list.rideLaterTime = e.value;
  }

  generateRideLaterTime(day) {
    if (day === 'today') {
      let timeArray = [], CurrentHour, CurrentMinutes;
      const currentDate = moment().format('DD/MM/YYYY hh:mm A');
      CurrentHour = moment().hour();
      CurrentMinutes = moment().minutes();
      const diffOfMinute = CurrentMinutes >= 30 ? 30 : 0o0;
      if (15 >= CurrentMinutes) {
        const temp2 = 15 - CurrentMinutes;
        this.rideLaterMinDate = (moment().add(temp2 + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (30 >= CurrentMinutes) {
        const temp = 30 - CurrentMinutes;
        this.rideLaterMinDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (45 >= CurrentMinutes) {
        const temp = 45 - CurrentMinutes;
        this.rideLaterMinDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (60 >= CurrentMinutes) {
        const temp = 60 - CurrentMinutes;
        this.rideLaterMinDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      }
      this.rideLaterMinDate = new Date(this.rideLaterMinDate);
      this.list.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.rideLaterMinDate = new Date((tomorrow).toString());
      this.rideLaterMaxDate = new Date((tomorrowEnd).toString());
      this.list.rideLaterTime = this.rideLaterMinDate;
    }
  }

  generateRideLaterDate() {
    const dateArray = [];
    const dayToExclude = moment().day();
    for (let d1 = 1; d1 <= 8; d1++) {
      if (d1 !== dayToExclude && d1 !== dayToExclude + 1) {
        if (d1 < dayToExclude && d1 + 8 !== dayToExclude) {
          dateArray.push({
            label: moment()
              .day(d1 + 8)
              .format('ddd, DD MMM'),
            value: d1 + 8
          });

        } else {
          dateArray.push({
            label: moment()
              .day(d1)
              .format('ddd, DD MMM'),
            value: d1
          });

        }
      }
    }
    this.rideLaterDateArray = _.sortBy(dateArray, ['value']);
  }

  manuallySelectedDriver(e) {
    this.list.driverId = ''; this.list.driverName = '';
    this.list.driverId = e.target.value;
    this.driverArray.forEach(el => {
      if (el._id === e.target.value) {
        this.list.driverName = el.fname;
      }
    });
  }

  selectedDriver(options: ngSelectOptionsDataStructure) {
    this.list.driverName = options.label;
    this.list.driverId = options.value;
  }

  rentalPackageDoUnassignDeselected(option: packageData) { }

  rentalPackageDoAssignSelected(event) {
    this.spinner.show();
    this.list.rentalPackage = event.target.value;
    const dataToSend = {
      packageId: event.target.value,
      serviceId: this.serviceDatilsrental,
      tripTypeCode: 'rental'
    };
    this.dataService
      .getVehicleForrental(dataToSend)
      .then(res => {
        this.showVehicle = true;
        this.list.serviceTypeId = undefined;
        this.vehicleArray = res.data;
        this.showEstimatedFare = true;
        this.showFareDetails = true;
        this.list.fareDetails = {
          distance: 0,
          BaseFare: 0,
          currency: AppSettings.defaultcur,
          tax: 0,
          minFare: 0,
          travelRate: 0,
          DetuctedFare: 0,
          perKMRate: 0,
          KMFare: 0,
          waitingCharge: 0,
          waitingFare: 0,
          pickupCharge: 0,
          travelFare: 0,
          fareType: 'N/A',
          totalFare: 0,
          inSecondaryCur: 0,
          surgePercent: 0,
          surgeLabel: 'N/A',
          packageName: 'N/A',
          packageDuration: 0,
          packageDistance: 0.00,
          baseFare: 0.00,
          additionalFareLabel: 'N/A',
          additionalTimeLabel: 'N/A',
          bkm: 0.00,
          timeFare: 0.00,
          fare: 0.00
        };
        (this.list.distanceDetails = {
          timeLable: '0 Mins'
        }),
          (this.list.unit = 0);
        this.blockPromo = false;
        this.promoCodeValues = {};
        this.promoCodeValues = {
          discountAmt: 0
        };
        this.list.unit = this.defaultUnit;
        this.list.driverAssignmentType = 'auto-assign';
        this.list.bookingType = 'rideLater';
        this.totalReturnHours = res.returnHours;
        this.showFareConfig = FarefieldConfig.showFareFromConfig;
        delete this.fareListCopy;
        this.fareListCopy = [];
        this.fareListCopy = this.fareList;
        this.spinner.hide();
      })
      .catch(err => {
        this.toastr.showtoast('error', err.error.message);
        this.spinner.hide();
      });
  }

  checkOutStationAddr() {
    if (this.list.tripType === 'outstation') {
      if (this.list.pickupLocation && this.list.dropLocation) {
        this.showJourneyCard = true;
        this.list.journeyTrip = 'oneway';
        this.list.bookingType = 'rideLater';
        this.handleChange1('oneway');
      } else {
        this.checklocation();
        this.showVehicle = false;
        this.showJourneyCard = false;
      }
    }
  }

  async handleChange1(data) {
    if (data === 'oneway') {
      await this.generateDateArrayForOneWay();
      await this.generateTimeArrayForOneWay('today');
      await this.getfare();
    } else {
      this.list.returnDate = moment(this.getInitialReturnDay(), 'DD MMM YYYY, hh:mm A').format('ddd, DD MMM');
      await this.generateRoundTripDate();
      await this.generateRoundTripTime();
      await this.getfare();
    }
  }

  getOneWayStartDay() {
    let stDay;
    this.convertedTripDates.startTime = moment(this.list.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
    stDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
    this.convertedTripDates.startDay = stDay;
    return this.convertedTripDates.startDay;
  }

  getInitialReturnDay() {
    return moment(this.getOneWayStartDay(), 'DD MMM YYYY, hh:mm A').add(this.totalReturnHours, 'hour').format('DD MMM YYYY, hh:mm A');
  }

  generateRoundTripDate() {
    const st = this.getInitialReturnDay();
    const startDate = moment(st, 'DD MMM YYYY, hh:mm A').format('YYYY-MM-DD');
    const endDate = moment(st, 'DD MMM YYYY, hh:mm A').add(10, 'days').format('YYYY-MM-DD');
    const current = moment().format('YYYY-MM-DD');
    const dateArrays = [];
    let currentDate = moment(startDate);
    const stopDate = moment(endDate);
    while (currentDate <= stopDate) {
      dateArrays.push({ label: moment(currentDate).format('ddd, DD MMM'), value: moment(currentDate).format('ddd, DD MMM') });
      currentDate = moment(currentDate).add(1, 'days');
    }
    this.returnArray = dateArrays;
    this.list.returnDate = this.returnArray[0].value;
  }

  generateRoundTripTime() {
    const st = this.getInitialReturnDay();
    this.list.returnTime = moment(st, 'DD MMM YYYY, hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
    let CurrentHour, CurrentMinutes;
    CurrentHour = moment(st, 'DD MMM YYYY, hh:mm A').hour();
    CurrentMinutes = moment(st, 'DD MMM YYYY, hh:mm A').minutes();
    this.returnMinDate = (moment(st, 'DD MMM YYYY, hh:mm A').format('MM/DD/YYYY hh:mm A'));
  }

  SetDepartType(event, listDAta) {
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.convertedTripDates.startDate = this.convertDate(selectElementText);
    if (selectElementText !== 'Today') {
      this.generateTimeArrayForOneWay('someOtherDay');
    } else {
      this.generateTimeArrayForOneWay('today');
    }
    this.generateRoundTripDate();
    this.generateRoundTripTime();
    this.getfare();
  }

  convertDate(date) {
    if (date === 'Today' || date === 'today') {
      return moment().format('DD MMM YYYY');
    } else if (date === 'Tomorrow' || date === 'tomorrow') {
      return moment().add(1, 'day').format('DD MMM YYYY');
    } else {
      return moment(date, 'ddd, DD MMM').format('DD MMM YYYY');
    }
  }

  generateDateArrayForOneWay() {
    const dateArray = [];
    const dayToExclude = moment().day();
    for (let d1 = 1; d1 <= 8; d1++) {
      if (d1 !== dayToExclude && d1 !== dayToExclude + 1) {
        if (d1 < dayToExclude && d1 + 8 !== dayToExclude) {
          dateArray.push({
            label: moment()
              .day(d1 + 8)
              .format('ddd, DD MMM'),
            value: d1 + 8
          });

        } else {
          dateArray.push({
            label: moment()
              .day(d1)
              .format('ddd, DD MMM'),
            value: d1
          });

        }
      }
    }
    this.departArray = _.sortBy(dateArray, ['value']);
  }

  generateTimeArrayForOneWay(day) {
    if (day === 'today') {
      let timeArray = [], CurrentHour, CurrentMinutes;
      const currentDate = moment().format('DD/MM/YYYY hh:mm A');
      CurrentHour = moment().hour();
      CurrentMinutes = moment().minutes();
      const diffOfMinute = CurrentMinutes >= 30 ? 30 : 0o0;
      if (CurrentMinutes >= 30) {
        const temp = 30; //CurrentMinutes-30;
        const temp2 = 60 - CurrentMinutes;
        // this.minDate =  (moment().subtract((CurrentMinutes-30),"minute").format('MM/DD/YYYY hh:mm A'));
        this.minDate = (moment().add((temp + temp2), 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else {
        const temp = 60 - CurrentMinutes;
        this.minDate = (moment().add(temp, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      }
      this.minDate = new Date(this.minDate);
      this.list.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.minDate = new Date((tomorrow).toString());
      this.maxDate = new Date((tomorrowEnd).toString());
      this.list.time = this.minDate;
    }
  }

  changeDepartTime(e) {
    this.list.time = e.value;
    this.getfare();
    this.generateRoundTripDate();
    this.generateRoundTripTime();
  }

  changeReturnTime(e) {
    this.list.returnTime = e.value;
    this.getfare();
  }

  /** Round Trip */

  setReturnType(event, listDAta) {
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.list.returnDate = selectElementText;
    this.generateRoundTripTimeForChangedDate();
    this.getfare();
  }

  generateRoundTripTimeForChangedDate() {
    if (this.list.returnDate !== this.returnArray[0].value) {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.returnMinDate = new Date((tomorrow).toString());
      this.returnMaxDate = new Date((tomorrowEnd).toString());
      this.list.returnTime = this.returnMinDate;
    } else {
      this.generateRoundTripDate();
      this.generateRoundTripTime();
    }
  }

}
