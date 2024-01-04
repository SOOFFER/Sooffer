import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, ElementRef, NgZone } from '@angular/core';
import { AppSettings } from 'src/app/app.config';
import { DirectionsRenderer } from '@ngui/map';
import { SectionService } from '../section/section.service';
import * as moment from 'moment';
import { ButtonToasterService } from '../buttontoaster/buttontoaster.service';
import { AngularFireDatabase } from '@angular/fire/database';
// import { GeoFire } from 'geofire';
import * as RX from 'rxjs';
import * as firebase from 'firebase';
import { of, from, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardSectionService } from './dashboard-section.service';
import * as _ from 'lodash';
import { enableRipple } from '@syncfusion/ej2-base';
import { TimePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
declare var google;

enableRipple(true);
@Component({
  selector: 'app-dashboard-section',
  providers: [SectionService, AngularFireDatabase],
  templateUrl: './dashboard-section.component.html',
  styleUrls: ['./dashboard-section.component.css']
})

export class DashboardSectionComponent implements OnInit, OnDestroy {

  /** Common */
  title: string;
  meta_service_data:any;
  description: string;
  @ViewChild('searchpickup')
  public searchPickupElementRef: any;

  @ViewChild('searchdrop')
  public searchDropElementRef: any;
  availableservice: any[] = AppSettings.Services;
  defaultZoom = AppSettings.ZOOM_MAP_LOCATION;
  defaultLocation = AppSettings.DEFAULT_LOCATION;
  geocoder = new google.maps.Geocoder();
  @ViewChild('mapElement') mapNativeElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  markers = [];
  map;
  originPlaceId = null;
  destinationPlaceId = null;
  rentalPlaceId = null;
  showMapError: any = '';
  markerIcon = {
    start: {
      url: 'assets/images/pin_1.png',
      scaledSize: new google.maps.Size(26, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 16)
    },
    end: {
      url: 'assets/images/pin_2.png',
      scaledSize: new google.maps.Size(26, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 16)
    }
  };

  getpickupFromFare: any
  getdropToFare:any
  initial = 'tripBookingScreen';
  temp: string = AppSettings.BASEURL;
  defaultUnit = AppSettings.defaultUnit;
  deafultTime = AppSettings.defaultTime;
  defaultCurr = AppSettings.defaultcur;
  spinnerTimeout: any;
  bookingTypes: any[] = [
    {
      'disabled': false,
      'value': 'rideNow',
      'label': 'Ride Now'
    },
    {
      'disabled': true,
      'value': 'rideLater',
      'label': 'Ride Later (Scheduled Trip)'
    }
  ];

  rentalBookingTypes: any[] = [
    {
      'disabled': false,
      'value': 'rideLater',
      'label': 'Ride Later (Scheduled Trip)'
    }
  ];

  /** Daily */

  list: any = {};
  list1: any = {};
  vehicleAry: any[] = [];
  showVehicle = false;
  showBasic = false;
  NewListArr: any = {};
  NewList: any = {};
  distanceList: any = {};
  showError: any = '';
  ToggleFare = false;
  icon: any;
  estimationId: string;
  tripID;
  bookedDriverDetails;
  bookedTaxiDetails;
  bookedLocationDetails;
  overallBooked;
  riderTrip;
  tripfinalDet;
  feedBackDetails: any = {};
  driverNotAvailable = false;
  showFareBook = false;
  hideBook = false;
  tripDataTime: any;

  /** Rental */

  rentalList: any = {};
  showPackage = false;
  packageList: any[] = [];
  rentalDescription: any;
  serviceList: any[] = [];
  rentalVehicles: any[] = [];
  checkAdd: any = {};
  disableRentalAfterBooking = false;
  showRentalVehicle = false;
  rentalFare: any[] = [];
  showRentalFare = false;
  rentalVehicleicon: any;

  rideLaterMaxDate: any;
  rideLaterMinDate: any;
  rideLaterDateArray: any = [];
  rideLaterConvertedDate = 'today';

  /** Outstation */

  outstationList: any = {};
  bookingTypeList = false;
  checkOutSt: any = {};
  disableOutstationAfterBooking = false;
  outStationbookingTypes: any[] = [
    {
      'disabled': false,
      'value': 'oneway',
      'label': 'One Way'
    },
    {
      'disabled': true,
      'value': 'round',
      'label': 'Round Trip'
    }
  ];
  outStationVehicles: any[] = [];
  showOutstationVehicle = false;
  outStationFare = {};
  showOutstationFare = false;
  outStationVehicleicon: any;
  showJourneyCard = false;
  minDate: any; // Date;// = new Date('8/3/2017 9:15 AM');
  maxDate: any; // Date;// = new Date('8/3/2017 11:30 AM');

  returnMinDate: any;
  returnMaxDate: any;
  totalReturnHours: any = '';
  convertedTripDates: any = {};
  departArray: any = []; returnArray: any = [];

  responseText = ''; reqTripID = ''; tripNotBooked = false;
  elementClicked = AppSettings.tripType;
  meta_image: any;
  constructor(
    private zone: NgZone,
    private meta: Meta,
    private toastr: ButtonToasterService,
    private db: AngularFireDatabase,
    private cdRef: ChangeDetectorRef,   
    private router: Router,
    private dashboardService: DashboardSectionService,
    private spinner: NgxSpinnerService,
    private ngxToastr: ToastrService,
    private sectionService: SectionService,
    private translate:TranslateService) {
    this.getpickupFromFare = localStorage.getItem('location');
    if( this.getpickupFromFare){
      let getactiveStatus = JSON.parse(localStorage.getItem('location')).Type
      this.elementClicked = getactiveStatus;
    }else{
      this.elementClicked = AppSettings.tripType;
    }
    this.getdropToFare =  localStorage.getItem('droplocation');
    this.rideLaterConvertedDate = this.convertDate('today');
  }

  getUserCurrentLocation() {
    // console.log("dfsfdsdf");
    if (navigator.geolocation) {
      const me = this;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            console.log(position);
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            let geocoder = new google.maps.Geocoder();
            let latlng = { lat: lat, lng: lng };
            geocoder.geocode({ location: latlng }, (results) => {
              console.log(results[0]);
              if (results[0]) {
                this.zone.run(() => {
                  this.list1 = {
                    pick: results[0].formatted_address,
                    pickupLat: lat,
                    pickupLng: lng,
                  };
                  this.outstationList = {
                    pick: results[0].formatted_address,
                    pickupLat: lat,
                    pickupLng: lng,
                  };
                  this.rentalList = {
                    pick: results[0].formatted_address,
                    pickupLat: lat,
                    pickupLng: lng,
                  };
                  this.newFn(results[0].place_id, "ORIG");
                  // me.setIndividualMarker(results[0].place_id);
                });
              } else {
                console.log("Not found");
              }
            });
          } else {
            console.log("not postioned");
          }
        }
        // function () {
        //   alert("User not allowed");
        // },
        // {timeout: 10000}
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  newFn(place_id, mode) {
    const me = this;

    me.markers.forEach(function (marker) {
      marker.setMap(null);
    });
    me.markers = [];

    if (!place_id) {
      this.showMapError = "Please Enter Correct Location.";
      return;
    }
    if (mode === "ORIG") {
      me.originPlaceId = place_id;
      me.setIndividualMarker(place_id);
    } else {
      me.destinationPlaceId = place_id;
      me.setIndividualMarker(place_id);
    }
    me.route();
  }

  onOpen(e) {
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
  }

  onClose(e) {
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'unset';
  }

  onClick(e) {
    if (e.target.innerHTML === 'Ride') {
      this.elementClicked = 'daily';
      this.clearAllData();
    } else if (e.target.innerHTML === 'Hourly') {
      this.elementClicked = 'rental';
      this.clearAllData();
    } else if (e.target.innerHTML === 'Driver') {
      this.elementClicked = 'outstation';
      this.clearAllData();
    }
  }



  initializeMap() {
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: this.defaultZoom,
      center: { lat: AppSettings.defLat, lng: AppSettings.defLng },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay =
      new google.maps.DirectionsRenderer({
        suppressMarkers: true, polylineOptions: {
          strokeColor: '#006400', strokeOpacity: 0.7,
          strokeWeight: 5
        }
      });
    this.directionsDisplay.setMap(this.map);
    if (this.elementClicked === 'outstation') {

       /** Outstation */
      const outstationOriginAutocomplete = new google.maps.places.Autocomplete(document.getElementById('outstation-origin-input'));
      outstationOriginAutocomplete.setFields(['place_id']);
      const outstationDestinationAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('outstation-destination-input'));
      outstationDestinationAutocomplete.setFields(['place_id']);
      this.setupPlaceChangedListener(outstationOriginAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(outstationDestinationAutocomplete, 'DEST');
    } else if (this.elementClicked === 'rental') {

      /** Rental */

      this.rentalPlaceId = null;
      const rentalAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('rental-origin-input'));
      rentalAutocomplete.setFields(['place_id']);
      this.rentalPlaceChangedListener(rentalAutocomplete, 'RENTAL');
    } else {

      /** Daily Rides */

      this.originPlaceId = null;
      this.destinationPlaceId = null;
      // const originInput = document.getElementById('origin-input')
      // const destinationInput = document.getElementById('destination-input');
      const originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin-input'));
      originAutocomplete.setFields(['place_id']);
      const destinationAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('destination-input'));
      destinationAutocomplete.setFields(['place_id']);
      this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    }
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit(): void {
    if (localStorage.getItem('location') === null) {
      this.initializeMap();
    }
    else {
      this.mapTrigger(this.getpickupFromFare)
    }
    this.cdRef.detectChanges(); 
    // let TripTag = <HTMLElement>document.querySelector('#tripsTab :nth-child('+this.setactivenum+') a');
    let TripTag = <HTMLElement>document.querySelector('[data-name=' + this.elementClicked + ']')
    TripTag.click()
  }

  setupPlaceChangedListener(autocomplete, mode) {
    const me = this;
    autocomplete.addListener('place_changed', function () {
      me.markers.forEach(function (marker) {
        marker.setMap(null);
      });
      me.markers = [];
      const place = autocomplete.getPlace();
      if (!place.place_id) {
        this.showMapError = 'Please Enter Correct Location.';
        return;
      }
      if (mode === 'ORIG') {
        me.originPlaceId = place.place_id;
        me.setIndividualMarker(place.place_id);
      } else {
        me.destinationPlaceId = place.place_id;
        me.setIndividualMarker(place.place_id);
      }
      me.route();
    });
  }

  setIndividualMarker(request) {
    const me = this;
    me.geocoder.geocode({ 'placeId': request }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          const leg = results[0];
          me.showMapError = '';
          me.map.setZoom(15);
          me.makeMarker(leg.geometry.location, me.markerIcon.start, leg.formatted_address);
          me.map.setCenter(results[0].geometry.location);
        } else {
          me.showMapError = 'No Data Found';
          me.clearMap();
        }
      } else {
        me.showMapError = 'Geocoder failed due to: ' + status;
      }
    });
  }

  route() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    const me = this;
    me.directionsService.route({
      origin: { 'placeId': me.originPlaceId },
      destination: { 'placeId': me.destinationPlaceId },
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        me.showVehicle = false;
        me.directionsDisplay.setDirections(response);
        const leg = response.routes[0].legs[0];
        // if (me.elementClicked === 'daily') {
        me.list1 = {
          pick: leg.start_address,
          pickupLat: leg.start_location.lat(),
          pickupLng: leg.start_location.lng(),
          dropLat: leg.end_location.lat(),
          dropLng: leg.end_location.lng(),
          drop: leg.end_address
        };
        // me.getFareEstimation();
        // } 
        // if (me.elementClicked === 'outstation') {
        //   me.outstationList = {
        //     pick: leg.start_address,
        //     pickupLat: leg.start_location.lat(),
        //     pickupLng: leg.start_location.lng(),
        //     dropLat: leg.end_location.lat(),
        //     dropLng: leg.end_location.lng(),
        //     drop: leg.end_address
        //   };
        //   // me.checkOutstationLoc();
        //   me.showJourneyCard = false;
        // }
        me.showMapError = '';
        me.markers.forEach(function (marker) {
          marker.setMap(null);
        });
        me.markers = [];
        me.makeMarker(leg.start_location, me.markerIcon.start, leg.start_address);
        me.makeMarker(leg.end_location, me.markerIcon.end, leg.end_address);
      } else {
        me.showMapError = 'Directions request failed due to ' + status;
        me.clearMap();
      }
    });
  }

  makeMarker(position, icon, title) {
    this.markers.push(new google.maps.Marker({
      position: position,
      animation: google.maps.Animation.DROP,
      icon: icon,
      map: this.map,
      draggable: false,
      title: title
    }));
  }

  clearMap() {
    this.directionsDisplay.set('directions', null);
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: this.defaultZoom,
      center: { lat: AppSettings.defLat, lng: AppSettings.defLng },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    this.directionsDisplay.setMap(this.map);
  }

  clearWholePage() { }

  ngOnInit() {
    this.spinner.show();
    this.spinnerTimeout = setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    this.getUserCurrentLocation();
    this.cdRef.detectChanges(); 
  }

  hideVehicle(e) {
    this.showVehicle = false;
    this.ToggleFare = false;
  }

  getFareEstimation() {
    if (this.list1.pickupLat
      && this.list1.pickupLng
      && this.list1.dropLat
      && this.list1.dropLng) {
      // this.spinner.show();
      this.sectionService.getVehicles(this.list1)
        .then(res => {
          this.list1.serviceTypeId = undefined;
          this.vehicleAry = res.vehicleCategories;
          this.showVehicle = true;
          this.showBasic = false;
          this.list1.bookingType = 'rideNow';
          // this.spinner.hide();
        })
        .catch(response => {
          // this.spinner.hide();
          this.toastr.showtoast('error', response.message);
        });
    }
  }

  SetVehicleType(data: any, inputs: any): void {
    if (!data) { return; }
    // this.spinner.show();
    this.showFareBook = true;
    this.showBasic = true;
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    for (const item of this.vehicleAry) {
      if (item.type === selectElementText) {
        this.icon = this.temp + item.file;
      }
    }
    this.list1.tripType = 'daily'
    this.list1.serviceType = selectElementText;
    this.list1.vehicletype = selectElementText;
    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;
    if (selectElementId > 0 || selectElementId !== undefined) {
      this.list1.share = true;
      this.list1.noofshare = selectElementId;
    }
    if (selectElementId === 'undefined') {
      this.list1.share = false;
      this.list1.noofshare = 0;
    }
    this.sectionService.conBook(inputs)
      .then(res => {
        this.ToggleFare = false;
        this.estimationId = res.estimationId;
        this.NewListArr = res.vehicleDetailsAndFare;
        this.NewList = this.NewListArr.fareDetails;
        if (this.NewList.fareType === 'kmrate') {
          this.NewList.fareType = 'milesrate';
        }
        this.distanceList = res.distanceDetails;
        this.NewList.paymentMode = 'Cash';
        // this.spinner.hide();
      })
      .catch(res => {
        // this.spinner.hide();
        this.ToggleFare = true;
        const body = res._body;
        const errorMessage = JSON.parse(body);
        this.showError = errorMessage.message;
      });
  }
  bookDriverTrip(inputs) {
    // this.spinner.show();
    this.hideBook = true;
    const bookTripObj = {
      tripType: 'daily',
      paymentMode: 'Cash',
      requestFrom: 'web',
      bookingType: inputs.bookingType,
      serviceType: inputs.vehicletype,
      estimationId: this.estimationId,
      tripTime: '',
      notesToDriver: '',
      bookingFor: '',
      otherPh: '',
      otherPhCode: '',
      noofseats: 1,
      pickupCity: '',
      promo: '',
      promoAmt: '',
      tripDate: ''
    };
    if (inputs.bookingType === 'rideLater') {
      bookTripObj.tripDate = moment(this.list1.tripTime, 'YYYY-MM-DDTHH:mm:ss').format('DD-MM-YYYY');
      bookTripObj.tripTime = moment(this.list1.tripTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
    }
    this.sectionService.requestTaxi(bookTripObj)
      .then(response => {
        this.toastr.showtoast('success', response['message']);
        this.reqTripID = response['tripId'];
        this.routeToMyTrips()
        this.readItems();
      })
      .catch(response => {
        // this.spinner.hide();
        this.toastr.showtoast('error', response.message);
      });
  }

  bookTrip(inputs) {
    // this.spinner.show();
    this.hideBook = true;
    const bookTripObj = {
      tripType: 'daily',
      paymentMode: 'Cash',
      requestFrom: 'web',
      bookingType: inputs.bookingType,
      serviceType: inputs.vehicletype,
      estimationId: this.estimationId,
      tripTime: '',
      notesToDriver: '',
      bookingFor: '',
      otherPh: '',
      otherPhCode: '',
      noofseats: 1,
      pickupCity: '',
      promo: '',
      promoAmt: '',
      tripDate: ''
    };
    if (inputs.bookingType === 'rideLater') {
      bookTripObj.tripDate = moment(this.list1.tripTime, 'YYYY-MM-DDTHH:mm:ss').format('DD-MM-YYYY');
      bookTripObj.tripTime = moment(this.list1.tripTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
    }
    this.sectionService.requestTaxi(bookTripObj)
      .then(response => {
        this.toastr.showtoast('success', response['message']);
        this.reqTripID = response['tripId'];
        this.routeToMyTrips()
        this.readItems();
      })
      .catch(response => {
        // this.spinner.hide();
        this.toastr.showtoast('error', response.message);
      });
  }

  /* Listen For Request Changes */

  // tslint:disable-next-line: member-ordering
  valueChanged$ = new Subject();

  // tslint:disable-next-line: member-ordering
  tripvalueChanged$ = new Subject();

  readItems() {
    if (this.elementClicked === 'daily') {
      const riderId = localStorage.getItem('Id');
      return this.db.database.ref('riders_data/' + riderId)
        .on('value', snap => this.callback(snap.val()));
    }
  }

  callback(val) {
    this.riderTrip = val;
    this.valueChanged$.next(val);
    this.tripvalueChanged$.subscribe(data => this.doStuff(data));
    // this.spinner.hide();
    if (this.riderTrip.current_tripid !== ''
      && this.riderTrip.current_tripid !== undefined
      && this.riderTrip.current_tripid !== 0
      && this.riderTrip.current_tripid !== '0') {
      this.tripID = this.riderTrip.current_tripid;
      this.getTripBookedDetails(this.riderTrip.current_tripid);
      this.getDriverDetails(this.riderTrip.current_tripid);
    } else {
      this.showFareBook = false;
      this.driverNotAvailable = true;
      if (this.riderTrip.tripstatus) {
        this.toastr.showtoast('warn', this.riderTrip.tripstatus);
      }
    }
  }

  getDriverDetails(tripid) {
    const trip = { tripId: tripid };
    // this.spinner.show();
    this.sectionService.getDriverDetailsForATrip(trip)
      .then(res => {
        this.overallBooked = res;
        this.bookedDriverDetails = res['driver'][0].profile;
        this.bookedTaxiDetails = res['driver'][1].currentActiveTaxi;
        this.bookedLocationDetails = res.pickupdetails;
        this.bookedTaxiDetails.taxiDet = this.bookedTaxiDetails.vehicletype
          + ' -- ' + this.bookedTaxiDetails.makename + ' -- '
          + this.bookedTaxiDetails.model + ' | ' + this.bookedTaxiDetails.licence;
        this.bookedDriverDetails.drivDet = this.bookedDriverDetails.fname + ' -- ' + this.bookedDriverDetails.phone;
        // this.initial = 'trackingScreen';
        // this.spinner.hide();
      })
      .catch(response => {
        // this.spinner.hide();
        const error = JSON.parse(response._body);
        this.toastr.showtoast('error', error.message);
      });
  }

  getTripBookedDetails(tripid) {
    this.tripDataTime = setInterval(() => {
      return this.db.database.ref('trips_data/' + tripid)
        .on('value', snap => this.finalTripDetails(snap.val()));
    }, 1500);
  }

  doStuff(d) {
  }

  finalTripDetails(data) {
    this.riderTrip.tripstatus = '';
    this.tripvalueChanged$.next(data);
    this.tripvalueChanged$.subscribe(data => this.doStuff(data));
    // this.initial = 'trackingScreen';
    this.tripfinalDet = data;
    const riderId = localStorage.getItem('Id');
    this.db.database.ref('riders_data/' + riderId).off('value');
    if (data.status === '1') {
      // accepted
      this.initial = 'trackingScreen';
      this.riderTrip.tripstatus = 'Driver Accepted';
    } else if (data.status === '2') {
      // arrived
      this.initial = 'trackingScreen';
      this.riderTrip.tripstatus = 'Driver Arrived to your Pickup Location';
    } else if (data.status === '3') {
      this.initial = 'trackingScreen';
      this.riderTrip.tripstatus = 'Trip in Progress';
    } else if (data.status === '4') {
      this.riderTrip.tripstatus = 'Finished';
      this.initial = 'completedTripScreen';
      clearInterval(this.tripDataTime);
      this.tripfinalDet.distance = parseFloat(this.tripfinalDet.distance).toFixed(2);
      this.stopListeningTripStatus();
    } else if (data.status === '5') {
      // cancelled
      this.initial = 'trackingScreen';
      this.riderTrip.tripstatus = 'Trip Cancelled';
      this.stopListeningTripStatus();
    }
    this.feedBackDetails = {
      rating: 0
    };
  }

  stopListeningTripStatus() {
    this.db.database.ref('trips_data/' + this.riderTrip.current_tripid).off('value');
  }

  sendFeedback(data) {
    const feedObj = {
      rating: data.rating,
      comments: data.comments,
      tripId: this.tripID
    };
    this.sectionService.riderFeedback(feedObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        location.reload();
      })
      .catch(response => {
        const error = JSON.parse(response._body);
        this.toastr.showtoast('error', error.message);
      });
  }

  ngOnDestroy(): void {
    clearTimeout(this.spinnerTimeout);
    this.valueChanged$.next();
    this.valueChanged$.complete();
    this.tripvalueChanged$.next();
    this.tripvalueChanged$.complete();
  }

  clearAllData() {
    this.initial = 'tripBookingScreen';
    this.list1 = {};
    this.showFareBook = false;
    this.driverNotAvailable = false;
    this.hideBook = false;
    this.showBasic = false;
    this.showVehicle = false;
    this.ToggleFare = false;
    this.NewListArr = {};
    this.NewList = {};
    this.distanceList = {};
    this.tripID = '';
    this.responseText = '';
    this.reqTripID = '';
    this.tripNotBooked = false;
    this.overallBooked = '';
    this.bookedDriverDetails = '';
    this.bookedLocationDetails = '';
    this.bookedTaxiDetails = '';
    this.tripfinalDet = '';
    this.valueChanged$ = new Subject();
    this.tripvalueChanged$ = new Subject();
    this.clearRentalData();
    this.clearOutstationData();
    this.showMapError = '';
    this.markers = [];
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.rentalPlaceId = null;
    this.defaultZoom = AppSettings.ZOOM_MAP_LOCATION;
    this.defaultLocation = AppSettings.DEFAULT_LOCATION;
    this.directionsDisplay.set('directions', null);
    localStorage.removeItem('location')
    localStorage.removeItem('droplocation')
    // if (localStorage.getItem('location') === null) {
      this.initializeMap();
    // } else {
    //   this.mapTrigger(this.getpickupFromFare);
    // }
  }

  /** Rental */

  rentalPlaceChangedListener(autocomplete, mode) {
    const me = this;
    autocomplete.addListener('place_changed', function () {
      me.markers.forEach(function (marker) {
        marker.setMap(null);
      });
      me.markers = [];
      const place = autocomplete.getPlace();
      if (!place.place_id) {
        this.showMapError = 'Please Enter Correct Location.';
        return;
      }
      if (mode === 'RENTAL') {
        me.rentalPlaceId = place.place_id;
      }
      me.getLocationAddrForRentalAndSetMarker(me.rentalPlaceId);
    });
  }

  getLocationAddrForRentalAndSetMarker(request) {
    const me = this;
    me.geocoder.geocode({ 'placeId': request }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          me.showVehicle = false;
          const leg = results[0];
          me.list1 = {
            pick: leg.formatted_address,
            pickupLat: leg.geometry.location.lat(),
            pickupLng: leg.geometry.location.lng(),
          };
          me.showMapError = '';
          // me.getPackageForRental();
          me.map.setZoom(15);
          me.makeMarker(leg.geometry.location, me.markerIcon.start, leg.formatted_address);
          me.map.setCenter(results[0].geometry.location);
        } else {
          me.showMapError = 'No Data Found';
          me.clearMap();
        }
      } else {
        me.showMapError = 'Geocoder failed due to: ' + status;
      }
    });
  }

  getPackageForRental() {
    if (this.list1.pickupLat !== undefined
      && this.list1.pickupLng !== undefined) {
      this.spinner.show();
      this.dashboardService.getRentalPackage(this.list1)
        .then(res => {
          this.showPackage = true;
          this.showRentalFare = false;
          this.showRentalVehicle = false;
          this.rentalList.vehicleId = undefined;
          this.rentalList.bookingType = 'rideLater';
          this.rentalList.packageId = undefined;
          this.rentalDescription = res.Description;
          this.packageList = res.packageDetail;
          this.serviceList = res.serviceDetail;
          this.rentalList.rideLaterDate = 'today';
          this.generateRideLaterTime('today');
          this.generateRideLaterDate();
          this.spinner.hide();
        })
        .catch(res => {
          this.toastr.showtoast('error', res.message);
          this.spinner.hide();
        });
    }
  }

  checkLoc(e) {
    if (this.checkAdd.pick === undefined) {
      this.checkAdd.pick = this.rentalList.pick;
      this.checkAdd.pickupLat = this.rentalList.pickupLat;
      this.checkAdd.pickupLng = this.rentalList.pickupLng;
    } else if (this.checkAdd.pick !== this.rentalList.pick
      && this.checkAdd.pickupLat === this.rentalList.pickupLat
      && this.checkAdd.pickupLng === this.rentalList.pickupLng) {
      this.checkAdd = {};
      this.rentalList = {};
    } else {
      this.checkAdd.pick = this.rentalList.pick;
      this.checkAdd.pickupLat = this.rentalList.pickupLat;
      this.checkAdd.pickupLng = this.rentalList.pickupLng;
    }
    this.hidePackage('a');
    this.getPackageForRental();
  }

  hidePackage(e) {
    this.showPackage = false;
    this.showRentalVehicle = false;
    this.showRentalFare = false;
    // this.ToggleFare = false;
  }

  selectedPackage(data: any, inputs: any): void {
    // this.spinner.show();
    let arrStr = '';
    if (this.serviceList) {
      arrStr = this.serviceList.toString();
    } else { arrStr = ''; }
    const getVeh = {
      packageId: data.target.value,
      tripTypeCode: 'rental',
      serviceId: arrStr
    };
    this.dashboardService.getRentalVehicles(getVeh)
      .then(res => {
        this.showRentalVehicle = true;
        this.showRentalFare = false;
        this.rentalList.vehicleId = undefined;
        this.rentalVehicles = res.data;
        // this.spinner.hide();
      })
      .catch(res => {
        this.showRentalVehicle = false;
        this.toastr.showtoast('error', res.message);
        // this.spinner.hide();
      });
  }

  selectedRentalVehi(data: any, inputs: any): void {
    // this.spinner.show();
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.rentalList.vehicletype = selectElementText;
    const getFareForVeh = {
      vehicleTypeId: data.target.value,
      packageId: this.rentalList.packageId,
      tripTypeCode: 'rental',
    };
    this.dashboardService.getRentalFare(getFareForVeh)
      .then(res => {
        this.showRentalFare = true;
        this.rentalFare = res.data;
        this.rentalVehicleicon = res['data'].file;
        // this.spinner.hide();
      })
      .catch(res => {
        this.showRentalFare = false;
        this.toastr.showtoast('error', res.message);
        // this.spinner.hide();
      });
  }

  clearRentalData() {
    this.rentalList = {};
    this.showPackage = false;
    this.packageList = [];
    this.serviceList = [];
    this.rentalVehicles = [];
    this.checkAdd = {};
    this.disableRentalAfterBooking = false;
    this.showRentalVehicle = false;
    this.rentalFare = [];
    this.showRentalFare = false;
    this.rentalVehicleicon = '';
    this.rentalDescription = '';
    this.rideLaterConvertedDate = this.convertDate('today');
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
    this.rentalList.rideLaterTime = e.value;
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
        this.rentalList.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (30 >= CurrentMinutes) {
        const temp = 30 - CurrentMinutes;
        this.rideLaterMinDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.rentalList.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (45 >= CurrentMinutes) {
        const temp = 45 - CurrentMinutes;
        this.rideLaterMinDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.rentalList.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (60 >= CurrentMinutes) {
        const temp = 60 - CurrentMinutes;
        this.rideLaterMinDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.rentalList.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      }
      this.rideLaterMinDate = new Date(this.rideLaterMinDate);
      this.rentalList.rideLaterTime = moment(this.rideLaterMinDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.rideLaterMinDate = new Date((tomorrow).toString());
      this.rideLaterMaxDate = new Date((tomorrowEnd).toString());
      this.rentalList.rideLaterTime = this.rideLaterMinDate;
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

  bookRental(data,data1) {
    console.log(data1)
    const rentalAdd = {
      promo: '',
      promoAmt: '',
      tripType: 'rental',
      tripDate: '',
      paymentMode: 'Cash',
      pickupCity: '',
      requestFrom: 'web',
      bookingType: data.bookingType,
      serviceType: data.vehicletype,
      estimationId: '',
      tripTime: '',
      notesToDriver: '',
      bookingFor: '',
      otherPh: '',
      otherPhCode: '',
      noofseats: '',
      vehicleTypeId: data.vehicleId,
      packageId: data.packageId,
      pickupLat: data1.pickupLat,
      pickupLng: data1.pickupLng,
      pickupAddress: data1.pick
    };
    if (data.bookingType === 'rideLater') {
      rentalAdd.tripDate = moment(this.rideLaterConvertedDate, 'DD MMM YYYY').format('DD-MM-YYYY');
      rentalAdd.tripTime = moment(data.rideLaterTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
    }
    this.dashboardService.bookRentalVehicle(rentalAdd)
      .then(res => {
        this.disableRentalAfterBooking = true;
        this.responseText = res['message'];
        this.tripNotBooked = false;
        this.reqTripID = res['tripId'];
        this.ngxToastr.success('Status: ' + res['message'],
          'Trip No: ' + res['tripId'], {
          closeButton: false, positionClass: 'toast-top-right',
          disableTimeOut: false, timeOut: 30000, extendedTimeOut: 10000
        });
      })
      .catch(res => {
        this.disableRentalAfterBooking = false;
        this.tripNotBooked = true;
        this.reqTripID = '';
        this.toastr.showtoast('error', res.message);
      });
  }

  /** Outstation */

  async handleChange1(data) {
    if (data === 'oneway') {
      await this.generateDateArrayForOneWay();
      await this.generateTimeArrayForOneWay('today');
      await this.getOutstationFare();
    } else {
      this.outstationList.returnDate = moment(this.getInitialReturnDay(), 'DD MMM YYYY, hh:mm A').format('ddd, DD MMM');
      await this.generateRoundTripDate();
      await this.generateRoundTripTime();
      await this.getOutstationFare();
    }
  }

  getOneWayStartDay() {
    let stDay;
    this.convertedTripDates.startTime = moment(this.outstationList.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
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
    this.outstationList.returnDate = this.returnArray[0].value;
  }

  generateRoundTripTime() {
    const st = this.getInitialReturnDay();
    this.outstationList.returnTime = moment(st, 'DD MMM YYYY, hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
    let CurrentHour, CurrentMinutes;
    CurrentHour = moment(st, 'DD MMM YYYY, hh:mm A').hour();
    CurrentMinutes = moment(st, 'DD MMM YYYY, hh:mm A').minutes();
    this.returnMinDate = (moment(st, 'DD MMM YYYY, hh:mm A').format('MM/DD/YYYY hh:mm A'));
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

  hideOutstationFields(e) {
    this.showVehicle = false;
    this.ToggleFare = false;
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
    this.getOutstationFare();
  }

  changeDepartTime(e) {
    this.outstationList.time = e.value;
    this.getOutstationFare();
    this.generateRoundTripDate();
    this.generateRoundTripTime();
  }

  changeReturnTime(e) {
    this.outstationList.returnTime = e.value;
    this.getOutstationFare();
  }

  convertedOutstaionDate() {

  }

  /** Round Trip */

  setReturnType(event, listDAta) {
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.outstationList.returnDate = selectElementText;
    this.generateRoundTripTimeForChangedDate();
    this.getOutstationFare();
  }

  generateRoundTripTimeForChangedDate() {
    if (this.outstationList.returnDate !== this.returnArray[0].value) {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.returnMinDate = new Date((tomorrow).toString());
      this.returnMaxDate = new Date((tomorrowEnd).toString());
      this.outstationList.returnTime = this.returnMinDate;
    } else {
      this.generateRoundTripDate();
      this.generateRoundTripTime();
    }
  }

  generateTimeArrayForOneWay(day) {
    if (day === 'today') {
      let timeArray = [], CurrentHour, CurrentMinutes;
      const currentDate = moment().format('DD/MM/YYYY hh:mm A');
      CurrentHour = moment().hour();
      CurrentMinutes = moment().minutes();
      const diffOfMinute = CurrentMinutes >= 30 ? 30 : 0o0;
      if (CurrentMinutes >= 30) {
        const temp = 30; // CurrentMinutes-30;
        const temp2 = 60 - CurrentMinutes;
        // this.minDate =  (moment().subtract((CurrentMinutes-30),"minute").format('MM/DD/YYYY hh:mm A'));
        this.minDate = (moment().add((temp + temp2), 'minute').format('MM/DD/YYYY hh:mm A'));
        this.outstationList.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else {
        const temp = 30 - CurrentMinutes;
        this.minDate = (moment().add(temp, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.outstationList.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      }
      this.minDate = new Date(this.minDate);
      this.outstationList.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.minDate = new Date((tomorrow).toString());
      this.maxDate = new Date((tomorrowEnd).toString());
      this.outstationList.time = this.minDate;
    }
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

  checkOutstationLoc() {
    if (this.list1.pickupLng &&
      this.list1.pickupLat &&
      this.list1.dropLat
      && this.list1.dropLng) {
      this.handleChange1('oneway');
      this.outstationList.departDate = 'today';
      this.outstationList.journeyTrip = 'oneway';
      this.outstationList.bookingType = 'rideLater';
      this.showJourneyCard = true;
    } else {
      this.showJourneyCard = false;
    }
    this.convertedTripDates = {
      startDate: moment().format('DD MMM YYYY'),
      startTime: '',
      endDate: moment().format('DD MMM YYYY'),
      endTime: '',
      startDay: '',
      endDay: ''
    };
  }

  getOutstationFare() {
    // this.spinner.show();
    this.showOutstationVehicle = false;
    this.showOutstationFare = false;
    if (this.list1.pick && this.list1.drop) {
      const getVehicles = {
        tripTypeCode: 'outstation',
        pickupLat: this.list1.pickupLat,
        pickupLng: this.list1.pickupLng,
        dropLat: this.list1.dropLat,
        dropLng: this.list1.dropLng,
        outstationType: this.outstationList.journeyTrip,
        startDay: '',
        startTime: '',
        returnDay: '',
        returnTime: ''
      };
      if (this.outstationList.journeyTrip === 'oneway') {
        getVehicles.outstationType = 'oneway';
        this.convertedTripDates.startTime = moment(this.outstationList.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
        getVehicles.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
        this.convertedTripDates.startDay = getVehicles.startDay;
      } else if (this.outstationList.journeyTrip === 'roundtrip') {
        getVehicles.outstationType = 'round';
        this.convertedTripDates.startTime = moment(this.outstationList.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
        this.convertedTripDates.endTime = moment(this.outstationList.returnTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
        this.convertedTripDates.endDate = moment(this.outstationList.returnDate, 'ddd, DD MMM').format('DD MMM YYYY');
        getVehicles.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
        getVehicles.returnDay = this.convertedTripDates.endDate + ', ' + this.convertedTripDates.endTime;
      }
      this.dashboardService.getOutstationVehicles(getVehicles)
        .then(res => {
          this.outstationList.serviceTypeId = undefined;
          this.showOutstationVehicle = true;
          this.showOutstationFare = false;
          this.totalReturnHours = res.returnHours;
          this.outStationVehicles = res.vehicleList;
          // this.spinner.hide();
        })
        .catch(err => {
          this.showOutstationVehicle = false;
          this.showOutstationFare = false;
          this.toastr.showtoast('error', err.message);
          // this.spinner.hide();
        });
    } else {
      this.toastr.showtoast('warn', `Please Enter Pickup and Drop Location`);
      // this.spinner.hide();
    }
  }

  changeOutstationVehicle(selectedVehicle: any, inputs: any) {
    if (!selectedVehicle) {
      return;
    }
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.outstationList.vehicletype = selectElementText;
    for (const item of this.outStationVehicles) {
      if (item.type === selectElementText) {
        this.outStationFare = {
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
        if (this.outStationFare['currency'] === undefined || this.outStationFare['currency'] === 'undefined') {
          this.outStationFare['currency'] = AppSettings.defaultcur;
          this.outStationFare['fareType'] = 'N/A';
        }
        this.outStationVehicleicon = item.file;
      }
    }
    this.showOutstationFare = true;
  }

  clearOutstationData() {
    this.outstationList = {};
    this.outStationVehicles = [];
    this.showOutstationVehicle = false;
    this.outStationFare = {};
    this.showOutstationFare = false;
    this.outStationVehicleicon = '';
    this.disableOutstationAfterBooking = false;
    this.showJourneyCard = false;
    this.minDate = '';
    this.maxDate = '';
    this.returnMinDate = '';
    this.returnMaxDate = '';
    this.totalReturnHours = '';
    this.convertedTripDates = {};
    this.departArray = [];
    this.returnArray = [];
  }

  bookOutstation(data) {
    const outstationAdd = {
      promo: '',
      promoAmt: '',
      tripType: 'outstation',
      tripDate: '',
      paymentMode: 'Cash',
      pickupCity: '',
      requestFrom: 'web',
      bookingType: 'rideLater',
      serviceType: data.vehicletype,
      estimationId: '',
      tripTime: '',
      notesToDriver: '',
      bookingFor: '',
      otherPh: '',
      otherPhCode: '',
      noofseats: '',
      vehicleTypeId: data.serviceTypeId,
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      dropLat: data.dropLat,
      dropLng: data.dropLng,
      pickupAddress: data.pick,
      dropAddress: data.drop,
      outstationType: '',
      startDay: '',
      returnDay: ''
    };
    if (data.journeyTrip === 'oneway') {
      outstationAdd.outstationType = 'oneway';
      this.convertedTripDates.startTime = moment(data.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
      outstationAdd.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
    } else if (data.journeyTrip === 'roundtrip') {
      outstationAdd.outstationType = 'round';
      this.convertedTripDates.startTime = moment(data.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
      this.convertedTripDates.endTime = moment(data.returnTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
      outstationAdd.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
      outstationAdd.returnDay = this.convertedTripDates.endDate + ', ' + this.convertedTripDates.endTime;
    }
    this.dashboardService.bookOutstationVehicle(outstationAdd)
      .then(res => {
        this.disableOutstationAfterBooking = true;
        this.responseText = res['message'];
        this.tripNotBooked = false;
        this.reqTripID = res['tripId'];
        this.ngxToastr.success('Status: ' + res['message'],
          'Trip No: ' + res['tripId'], {
          closeButton: false, positionClass: 'toast-top-right',
          disableTimeOut: false, timeOut: 30000, extendedTimeOut: 10000
        });
      })
      .catch(res => {
        this.disableOutstationAfterBooking = false;
        this.tripNotBooked = true;
        this.reqTripID = '';
        this.toastr.showtoast('error', res.message);
      });

  }

  routeToMyTrips() {
    this.router.navigate(['processing-trips'], {
      queryParams: {
        tripId: this.reqTripID
      },
      queryParamsHandling: 'merge',
    });
  }
  mapTrigger(sharedData) {
    this.map = new google.maps.Map(this.mapNativeElement.nativeElement, {
      zoom: this.defaultZoom,
      center: { lat: AppSettings.defLat, lng: AppSettings.defLng },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay =
      new google.maps.DirectionsRenderer({
        suppressMarkers: true, polylineOptions: {
          strokeColor: '#006400', strokeOpacity: 0.7,
          strokeWeight: 5
        }
      });
    this.directionsDisplay.setMap(this.map);

    if (this.elementClicked === 'outstation') {

       /** Outstation */
      const outstationOriginAutocomplete = new google.maps.places.Autocomplete(document.getElementById('outstation-origin-input'));
      outstationOriginAutocomplete.setFields(['place_id']);
      const outstationDestinationAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('outstation-destination-input'));
      outstationDestinationAutocomplete.setFields(['place_id']);
      this.setupPlaceChangedListener(outstationOriginAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(outstationDestinationAutocomplete, 'DEST');
    } else if (this.elementClicked === 'rental') {

        /** Rental */

      this.rentalPlaceId = null;
      const rentalAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('rental-origin-input'));
      rentalAutocomplete.setFields(['place_id']);
      this.rentalPlaceChangedListener(rentalAutocomplete, 'RENTAL');
    } else {

        /** Daily Rides */
      this.originPlaceId = null;
      this.destinationPlaceId = null;
      // const originInput = document.getElementById('origin-input')
      // const destinationInput = document.getElementById('destination-input');
      const originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin-input'));
      originAutocomplete.setFields(['place_id']);
      const destinationAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('destination-input'));
      destinationAutocomplete.setFields(['place_id']);
      this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    }
    let getData = JSON.parse(sharedData)
    let DropFare = localStorage.getItem('droplocation')
    if(DropFare !== null){
      let getDropData = JSON.parse(DropFare) 
      this.list1.drop = getDropData["drop"]
      this.destinationPlaceId= getDropData["placeId"];
    }
    this.list1.pick = getData["pick"];
    this.elementClicked = getData["Type"];
    this.rentalPlaceId = getData["placeId"];
    this.getLocationAddrForRentalAndSetMarker(this.rentalPlaceId);
    this.originPlaceId = getData["placeId"];
 
    this.setIndividualMarker[this.originPlaceId];
    // this.setIndividualMarker[this.destinationPlaceId];
    const me = this;
    if(localStorage.getItem('droplocation') === null){
      this.geocoder.geocode({ 'placeId': this.originPlaceId }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            const leg = results[0];
            me.showMapError = '';
            me.map.setZoom(15);
            me.makeMarker(leg.geometry.location, me.markerIcon.start, leg.formatted_address);
            // me.makeMarker(leg.end_location, me.markerIcon.end, leg.end_address);
            me.map.setCenter(results[0].geometry.location);
          }
          
          else {
            this.showMapError = 'No Data Found';
            this.clearMap();
          }
        } else {
          this.showMapError = 'Geocoder failed due to: ' + status;
        }
      });
    }else{
      me.route();
    }


  }
  placeChangedP(place) {
    this.list1.pick = place.formatted_address;
    // this.list1.pickupLat = this.center.lat();
    // this.list1.pickupLng = this.center.lng();
    this.list1.pickupLat = this.from.lat;
    this.list1.pickupLng = this.from.lat;
    this.list1.placeId = place.place_id;
    this.list1.Type = this.elementClicked
    let pickupdata = JSON.stringify(this.list1)
    localStorage.setItem('location',pickupdata )
  }
  dropplaceChangedP(place) {
    this.list1.drop = place.formatted_address;
    this.list1.placeId = place.place_id;
    let dropdata = JSON.stringify(this.list1)
    localStorage.setItem('droplocation',dropdata)
  }
  // rentalplaceChangedP(place){
  //   this.list1.pick = place.formatted_address;
  //   // this.list1.pickupLat = this.center.lat();
  //   // this.list1.pickupLng = this.center.lng();
  //   this.list1.pickupLat = this.from.lat;
  //   this.list1.pickupLng = this.from.lat;
  //   this.list1.placeId = place.place_id;

  //   localStorage.setItem('location', JSON.stringify(this.list1))
  //   localStorage.removeItem('droplocation')
  // }
  from = {
    lat: 0,
    lng: 0,
  };
  to = {
    lat: 0,
    lng: 0,
  };
}
