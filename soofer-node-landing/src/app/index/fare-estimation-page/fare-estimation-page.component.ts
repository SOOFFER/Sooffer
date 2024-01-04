import { Component, OnInit, ViewChild, ElementRef, OnDestroy, SimpleChanges, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AppSettings } from 'src/app/app.config';
import { SectionService } from '../section/section.service';
import { DashboardSectionService } from '../dashboard-section/dashboard-section.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DataSharingService } from '../common/data-sharing.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SigninService } from '../signin/signin.service';
import { NgForm } from '@angular/forms';
import * as jwtDecode from 'jwt-decode';
import { CtrListContext } from 'ng2-completer/src/directives/ctr-list';
declare var google;
declare var $: any;

@Component({
  selector: 'app-fare-estimation-page',
  templateUrl: './fare-estimation-page.component.html',
  providers: [DashboardSectionService, SectionService, SigninService],
  styleUrls: ['./fare-estimation-page.component.css'],
})

export class FareEstimationPageComponent implements OnInit, OnDestroy, AfterViewInit {
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

  rideLaterConvertedDate = 'today';
  defaultUnit = AppSettings.defaultUnit;
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
  temp: string = AppSettings.BASEURL;
  defaultCurr = AppSettings.defaultcur;
  disableRentalAfterBooking = false;
  packageList = [];
  rentalPlaceId = null;
  serviceList = [];
  rentalDescription = '';
  showPackage = false;
  tripType = AppSettings.tripType;
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
  showJourneyCard = false;
  convertedTripDates: any = {};
  minDate: any; // Date;// = new Date('8/3/2017 9:15 AM');
  maxDate: any; // Date;// = new Date('8/3/2017 11:30 AM');

  returnMinDate: any;
  returnMaxDate: any;
  totalReturnHours: any = '';
  returnArray = []; departArray = []; rideLaterDateArray = [];
  homecontent: any = {};
  elementClicked = AppSettings.tripType;

  responseText = ''; bookedT = false; reqTripID = ''; tripNotBooked = false; timeoutClear;
  extraCreature: any
  userLoginDetails: any = {};
  @ViewChild('loginForm') loginForm: NgForm;
  decoded: any = {};

  hideBu = false;
  availableTypes: any[];
  FarePageLocation: any;
  getpickupFromFare: any
  showRentalsDetails: boolean = false;
  showOutstationDetails: boolean = false;
  constructor(private sectionService: SectionService,
    private zone: NgZone,
    private ngxToastr: ToastrService,
    private router: Router,
    private logService: SigninService,
    private cdRef: ChangeDetectorRef,
    private dataSharingService: DataSharingService,
    private dashboardService: DashboardSectionService
  ) {
    this.rideLaterConvertedDate = this.convertDate('today');
    this.getHomeContent();
    this.getpickupFromFare = localStorage.getItem('location');
    this.list1 = {};
    if( this.getpickupFromFare){
      let getactiveStatus = JSON.parse(localStorage.getItem('location')).Type
      this.tripType = getactiveStatus;
    }else{
      this.tripType = AppSettings.tripType;
    }
    dataSharingService.isUserLoggedIn.subscribe(value => {
      this.hideButton();
    });
    this.hideButton();
    // if (localStorage.getItem('location') != null){
    //   this.FarePageLocation =JSON.parse(localStorage.getItem('location')).pick
    //   }
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

  ngOnChanges(changes: SimpleChanges) {
  }

  onOpen(e) {
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'hidden';
  }

  onClose(e) {
    const body = document.getElementsByTagName('body')[0];
    body.style.overflow = 'unset';
  }

  hideButton() {
    const tok = localStorage.getItem('Tok');
    if (tok) {
      this.hideBu = true;
    } else {
      this.hideBu = false;
    }
  }

  getHomeContent() {
    this.sectionService.gethomecontent()
      .then(res => {
        this.homecontent = res[0];
      });
  }

  onClick(e) {
    if (e.target.innerHTML === 'Ride') {
      this.elementClicked = 'daily';
      this.tripType = 'daily';
      this.clearPage();
    } else if (e.target.innerHTML === 'Hourly') {
      this.elementClicked = 'rental';
      this.tripType = 'rental';
      this.clearPage();
    } else if (e.target.innerHTML === 'Driver') {
      this.elementClicked = 'outstation';
      this.tripType = 'outstation';
      this.clearPage();
    }
    // const location = JSON.parse(localStorage.getItem('location'));
    // location.Type = this.tripType;
    // localStorage.setItem('location', JSON.stringify(location));
    // localStorage.setItem('serviceType',this.tripType)
    // console.log(this.tripType)
  }
  
  ngOnInit() {
    let mapData;
    let mapNat = this.mapNativeElement.nativeElement;
    this.getUserCurrentLocation();
    this.cdRef.detectChanges(); 
  }
  data
  mapTrigger() {
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
    if (this.tripType === 'outstation') {
      /** Outstation */
      const outstationOriginAutocomplete = new google.maps.places.Autocomplete(document.getElementById('outstation-origin-input'));
      outstationOriginAutocomplete.setFields(['place_id']);
      const outstationDestinationAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('outstation-destination-input'));
      outstationDestinationAutocomplete.setFields(['place_id']);
      this.setupPlaceChangedListener(outstationOriginAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(outstationDestinationAutocomplete, 'DEST');
    } else if (this.tripType === 'rental') {
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
      const originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin-input'));
      originAutocomplete.setFields(['place_id']);
      const destinationAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('destination-input'));
      destinationAutocomplete.setFields(['place_id']);
      this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    }
    let pickData = localStorage.getItem('location')
    let dropData = localStorage.getItem('droplocation')
    let getData = JSON.parse(pickData)
    this.list1.pick = getData["pick"];
    this.tripType = getData["Type"];
    this.rentalPlaceId = getData["placeId"];
    if (dropData) {
      let getDropData = JSON.parse(dropData)
      this.list1.drop = getDropData["drop"]
      this.destinationPlaceId = getDropData["placeId"];
    }
    this.getLocationAddrForRentalAndSetMarker(this.rentalPlaceId);
    this.originPlaceId = getData["placeId"];
    this.setIndividualMarker[this.originPlaceId];
    const me = this;
    if (localStorage.getItem('droplocation') === null) {
      this.geocoder.geocode({ 'placeId': this.originPlaceId }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {

            const leg = results[0];
            me.showMapError = '';
            me.map.setZoom(15);
            me.makeMarker(leg.geometry.location, me.markerIcon.start, leg.formatted_address);
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
    } else {
      me.route();
    }
  }

  initializeMap() {
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

    if (this.tripType === 'outstation') {
      /** Outstation */

      const outstationOriginAutocomplete = new google.maps.places.Autocomplete(document.getElementById('outstation-origin-input'));
      outstationOriginAutocomplete.setFields(['place_id']);
      const outstationDestinationAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('outstation-destination-input'));
      outstationDestinationAutocomplete.setFields(['place_id']);
      this.setupPlaceChangedListener(outstationOriginAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(outstationDestinationAutocomplete, 'DEST');
    } else if (this.tripType === 'rental') {
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
      const originAutocomplete = new google.maps.places.Autocomplete(document.getElementById('origin-input'));
      originAutocomplete.setFields(['place_id']);
      const destinationAutocomplete =
        new google.maps.places.Autocomplete(document.getElementById('destination-input'));
      destinationAutocomplete.setFields(['place_id']);
      this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    }
  }


  ngAfterViewInit(): void {
    if (localStorage.getItem('location') === null) {
      this.initializeMap();
    }
    else {
      this.mapTrigger()
    }
    this.cdRef.detectChanges(); 
    let TripTag = <HTMLElement>document.querySelector('[data-name=' + this.tripType + ']')
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
        me.list1 = {
          pick: leg.start_address,
          pickupLat: leg.start_location.lat(),
          pickupLng: leg.start_location.lng(),
          dropLat: leg.end_location.lat(),
          dropLng: leg.end_location.lng(),
          drop: leg.end_address
        };
        me.showMapError = '';
        // me.getVehicles();
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

  getFareEstimation(event) {
    // console.log(event.target.name);
    // console.log(event.target.value);
  }

  getVehicles() {
    if (this.tripType === 'daily') {
      if (this.list1.pickupLat
        && this.list1.pickupLng
        && this.list1.dropLng
        && this.list1.dropLat) {
        this.sectionService.getVehicles(this.list1)
          .then(res => {
            this.list1.serviceTypeId = undefined;
            this.vehicleAry = res.vehicleCategories;
            this.showVehicle = false;
            this.showBasic = false;
            this.showMapError = '';
            this.router.navigate(['/dashboard-section'])
          }).catch(res => {
            this.showVehicle = false;
            this.showBasic = false;
            const errorMessage = res;
            this.showMapError = errorMessage.message;
            this.router.navigate(['/ridersignin'])
            return false
          });
      }
    } else if (this.tripType === 'outstation') {
      this.showOutstationDetails = false;
      this.getJourneyDetails();
    }
  }

  SetVehicleType(data: any, inputs: any): void {
    this.bookedT = false;
    this.reqTripID = '';
    this.tripNotBooked = false;
    if (!data) { return; }
    if (this.tripType === 'daily') {
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
      inputs.bookingType = 'rideNow';
      this.sectionService.conBook(inputs)
        .then(res => {
          this.ToggleFare = false;
          this.list1['estimationId'] = res.estimationId;

          this.NewListArr = res.vehicleDetailsAndFare;
          this.NewList = this.NewListArr.fareDetails;
          if (this.NewList.fareType === 'kmrate') {
            this.NewList.fareType = 'milesrate';
          }
          this.distanceList = res.distanceDetails;
          this.NewList.paymentMode = 'Cash';
        })
        .catch(res => {
          this.ToggleFare = true;
          const errorMessage = res;
          this.showError = errorMessage.message;
        });
    } else if (this.tripType === 'rental') {
      const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
      this.list1.vehicletype = selectElementText;
      const getFareForVeh = {
        vehicleTypeId: data.target.value,
        packageId: this.list1.packageId,
        tripTypeCode: 'rental',
      };
      this.dashboardService.getRentalFare(getFareForVeh)
        .then(res => {
          this.showBasic = true;
          this.NewList = res.data;
          this.icon = res['data'].file;
        })
        .catch(res => {
          this.showBasic = false;
          const errorMessage = res;
          this.showError = errorMessage.message;
        });
    } else if (this.tripType === 'outstation') {
      const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
      this.list1.vehicletype = selectElementText;
      for (const item of this.vehicleAry) {
        if (item.type === selectElementText) {
          this.NewList = {
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
          if (this.NewList['currency'] === undefined || this.NewList['currency'] === 'undefined') {
            this.NewList['currency'] = AppSettings.defaultcur;
            this.NewList['fareType'] = 'N/A';
          }
          this.icon = item.file;
        }
      }
      this.showBasic = true;
    }
  }

  clearPage() {
    this.responseText = '';
    this.bookedT = false;
    this.reqTripID = '';
    this.tripNotBooked = false;
    this.markers = [];
    this.list1 = {};
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.showMapError = '';
    this.vehicleAry = [];
    this.showVehicle = false;
    this.showBasic = false;
    this.NewListArr = {};
    this.NewList = {};
    this.distanceList = {};
    this.showError = '';
    this.ToggleFare = false;
    this.temp = AppSettings.BASEURL;
    this.packageList = [];
    this.rentalPlaceId = null;
    this.serviceList = [];
    this.rentalDescription = '';
    this.showPackage = false;
    this.showJourneyCard = false;
    this.minDate = '';
    this.maxDate = '';
    this.returnMinDate = '';
    this.returnMaxDate = '';
    this.totalReturnHours = '';
    this.disableRentalAfterBooking = false;
    this.convertedTripDates = {};
    this.departArray = [];
    this.returnArray = [];
    this.rideLaterConvertedDate = this.convertDate('today');
    this.rideLaterDateArray = [];
    this.defaultZoom = AppSettings.ZOOM_MAP_LOCATION;
    this.defaultLocation = AppSettings.DEFAULT_LOCATION;
    this.directionsDisplay.set('directions', null);
    localStorage.removeItem('location')
    localStorage.removeItem('droplocation')
    // if (localStorage.getItem('location') === null) {
      this.initializeMap();
      // this.mapTrigger('');
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
          // me.getRentalPackage();
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

  getRentalPackage() {
    if (
      this.list1.pickupLat !== undefined &&
      this.list1.pickupLng !== undefined
    ) {
      this.dashboardService.getRentalPackage(this.list1)
        .then(res => {
          this.showPackage = false;
          this.showRentalsDetails = false;
          this.list1.packageId = undefined;
          this.rentalDescription = res.Description;
          this.packageList = res.packageDetail;
          this.serviceList = res.serviceDetail;
          this.list1.rideLaterDate = 'today';
          this.generateRideLaterTime('today');
          this.generateRideLaterDate();
          this.showVehicle = false;
          this.showBasic = false;
          this.router.navigate(['/dashboard-section'])
        })
        .catch(res => {
          this.showPackage = false;
          this.showMapError = res.message;
          this.router.navigate(['/ridersignin'])
          return false
        });
    }
  }

  setPackage(data: any, inputs: any) {
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
        this.showVehicle = true;
        this.showBasic = false;
        this.NewList = {};
        this.list1.serviceTypeId = undefined;
        this.vehicleAry = res.data;
      })
      .catch(res => {
        this.showVehicle = false;
        this.showMapError = res.message;
      });
  }

  /** Outstation */

  getJourneyDetails() {
    if (this.list1.pickupLng &&
      this.list1.pickupLat &&
      this.list1.dropLat
      && this.list1.dropLng) {
      this.handleChange1('oneway');
      this.list1.departDate = 'today';
      this.list1.journeyTrip = 'oneway';
      this.list1.bookingType = 'rideLater';
      this.showJourneyCard = true;
      this.showVehicle = true;
      this.router.navigate(['/dashboard-section'])
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

  async handleChange1(data) {
    if (data === 'oneway') {
      await this.generateDateArrayForOneWay();
      await this.generateTimeArrayForOneWay('today');
      await this.getOutstationFare();
    } else {
      this.list1.returnDate = moment(this.getInitialReturnDay(), 'DD MMM YYYY, hh:mm A').format('ddd, DD MMM');
      await this.generateRoundTripDate();
      await this.generateRoundTripTime();
      await this.getOutstationFare();
    }
  }

  getOneWayStartDay() {
    let stDay;
    this.convertedTripDates.startTime = moment(this.list1.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
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
    this.list1.returnDate = this.returnArray[0].value;
  }

  generateRoundTripTime() {
    const st = this.getInitialReturnDay();
    this.list1.returnTime = moment(st, 'DD MMM YYYY, hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
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
        this.list1.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else {
        const temp = 30 - CurrentMinutes;
        this.minDate = (moment().add(temp, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list1.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      }
      this.minDate = new Date(this.minDate);
      this.list1.time = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.minDate = new Date((tomorrow).toString());
      this.maxDate = new Date((tomorrowEnd).toString());
      this.list1.time = this.minDate;
    }
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
    this.list1.time = e.value;
    this.getOutstationFare();
    this.generateRoundTripDate();
    this.generateRoundTripTime();
  }

  changeReturnTime(e) {
    this.list1.returnTime = e.value;
    this.getOutstationFare();
  }

  /** Round Trip */

  setReturnType(event, listDAta) {
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.list1.returnDate = selectElementText;
    this.generateRoundTripTimeForChangedDate();
    this.getOutstationFare();
  }

  generateRoundTripTimeForChangedDate() {
    if (this.list1.returnDate !== this.returnArray[0].value) {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.returnMinDate = new Date((tomorrow).toString());
      this.returnMaxDate = new Date((tomorrowEnd).toString());
      this.list1.returnTime = this.returnMinDate;
    } else {
      this.generateRoundTripDate();
      this.generateRoundTripTime();
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

  getOutstationFare() {
    this.showVehicle = false;
    this.showBasic = false;
    if (this.list1.pickupLat
      && this.list1.pickupLng
      && this.list1.dropLat
      && this.list1.dropLng) {
      const getVehicles = {
        tripTypeCode: 'outstation',
        pickupLat: this.list1.pickupLat,
        pickupLng: this.list1.pickupLng,
        dropLat: this.list1.dropLat,
        dropLng: this.list1.dropLng,
        outstationType: this.list1.journeyTrip,
        startDay: '',
        startTime: '',
        returnDay: '',
        returnTime: ''
      };
      if (this.list1.journeyTrip === 'oneway') {
        getVehicles.outstationType = 'oneway';
        this.convertedTripDates.startTime = moment(this.list1.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
        getVehicles.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
        this.convertedTripDates.startDay = getVehicles.startDay;
      } else if (this.list1.journeyTrip === 'round') {
        getVehicles.outstationType = 'round';
        this.convertedTripDates.startTime = moment(this.list1.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
        this.convertedTripDates.endTime = moment(this.list1.returnTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
        this.convertedTripDates.endDate = moment(this.list1.returnDate, 'ddd, DD MMM').format('DD MMM YYYY');
        getVehicles.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
        getVehicles.returnDay = this.convertedTripDates.endDate + ', ' + this.convertedTripDates.endTime;
      }
      this.dashboardService.getOutstationVehicles(getVehicles)
        .then(res => {
          this.list1.serviceTypeId = undefined;
          this.showVehicle = true;
          this.showBasic = false;
          this.totalReturnHours = res.returnHours;
          this.vehicleAry = res.vehicleList;
        })
        .catch(err => {
          this.showVehicle = false;
          this.showBasic = false;
          this.showMapError = err.message;
        });
    } else {
      this.showMapError = 'Please Enter Pickup and Drop Location';
    }
  }


  /** Rental Time */

  changeRideLaterDate(e, list) {
    this.bookedT = false;
    this.reqTripID = '';
    this.tripNotBooked = false;
    const selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.rideLaterConvertedDate = this.convertDate(selectElementText);
    if (selectElementText !== 'Today') {
      this.generateRideLaterTime('someOtherDay');
    } else {
      this.generateRideLaterTime('today');
    }
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
        this.minDate = (moment().add(temp2 + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list1.rideLaterTime = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (30 >= CurrentMinutes) {
        const temp = 30 - CurrentMinutes;
        this.minDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list1.rideLaterTime = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (45 >= CurrentMinutes) {
        const temp = 45 - CurrentMinutes;
        this.minDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list1.rideLaterTime = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      } else if (60 >= CurrentMinutes) {
        const temp = 60 - CurrentMinutes;
        this.minDate = (moment().add(temp + 15, 'minute').format('MM/DD/YYYY hh:mm A'));
        this.list1.rideLaterTime = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
      }
      this.minDate = new Date(this.minDate);
      this.list1.rideLaterTime = moment(this.minDate, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm:ss');
    } else {
      const tomorrow = moment(new Date()).add(1, 'days').startOf('day');
      const tomorrowEnd = moment(new Date()).add(1, 'days').endOf('day');
      this.minDate = new Date((tomorrow).toString());
      this.maxDate = new Date((tomorrowEnd).toString());
      this.list1.rideLaterTime = this.minDate;
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

  changeRideLaterTime(e, list) {
    this.list1.rideLaterTime = e.value;
  }

  /** Booking */

  bookRental(data) {
    const rentalAdd = {
      promo: '',
      promoAmt: '',
      tripType: 'rental',
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
      packageId: data.packageId,
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      pickupAddress: data.pick
    };
    if (rentalAdd.bookingType === 'rideLater') {
      rentalAdd.tripDate = moment(this.rideLaterConvertedDate, 'DD MMM YYYY').format('DD-MM-YYYY');
      rentalAdd.tripTime = moment(data.rideLaterTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
    }
    this.dashboardService.bookRentalVehicle(rentalAdd)
      .then(res => {
        this.disableRentalAfterBooking = false;
        this.responseText = res['message'];
        this.bookedT = true;
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
        this.responseText = res['message'];
        this.bookedT = true;
        this.tripNotBooked = true;
        this.reqTripID = '';
      });
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
    } else if (data.journeyTrip === 'round') {
      outstationAdd.outstationType = 'round';
      this.convertedTripDates.startTime = moment(data.time, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
      this.convertedTripDates.endTime = moment(data.returnTime, 'YYYY-MM-DDTHH:mm:ss').format('hh:mm A');
      outstationAdd.startDay = this.convertedTripDates.startDate + ', ' + this.convertedTripDates.startTime;
      outstationAdd.returnDay = this.convertedTripDates.endDate + ', ' + this.convertedTripDates.endTime;
    }
    this.dashboardService.bookOutstationVehicle(outstationAdd)
      .then(res => {
        this.responseText = res['message'];
        this.bookedT = true;
        this.tripNotBooked = false;
        this.reqTripID = res['tripId'];
        this.ngxToastr.success('Status: ' + res['message'],
          'Trip No: ' + res['tripId'], {
          closeButton: false, positionClass: 'toast-top-right',
          disableTimeOut: false, timeOut: 30000, extendedTimeOut: 10000
        });
      })
      .catch(res => {
        this.responseText = res['message'];
        this.bookedT = true;
        this.tripNotBooked = true;
        this.reqTripID = '';
      });
  }

  bookDaily(inputs) {
    const bookTripObj = {
      tripType: 'daily',
      paymentMode: 'Cash',
      requestFrom: 'web',
      bookingType: inputs.bookingType,
      serviceType: inputs.vehicletype,
      estimationId: inputs.estimationId,
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
    this.sectionService.requestTaxi(bookTripObj)
      .then(response => {
        this.responseText = response['message'];
        this.reqTripID = response['tripId'];
        this.bookedT = true;
        this.tripNotBooked = false;
      })
      .catch(response => {
        this.responseText = response['message'];
        this.bookedT = true;
        this.reqTripID = '';
        this.tripNotBooked = true;
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

  /** Login popup */

  handleLoginEvent(e) { }

  loginRider(loginForm): void {
    $('#loadMe').modal({
      backdrop: 'static',
      keyboard: false,
      show: true
    });
    const addRider = {
      username: loginForm.email,
      password: loginForm.password
    };
    this.logService.riderSignme(addRider)
      .then(msg => {
        localStorage.setItem('Tok', msg.token);
        this.decoded = jwtDecode(msg.token);
        localStorage.setItem('Id', this.decoded.id);
        localStorage.setItem('Type', this.decoded.type);
        this.dataSharingService.isUserLoggedIn.next(true);
        $('#loadMe').modal('hide');
        $('#myModal').modal('toggle');
        this.loginForm.resetForm();
        this.ngxToastr.success(msg['message']);
      })
      .catch(res => {
        this.ngxToastr.error(res['message']);
        this.timeoutClear = setTimeout(function () {
          $('#loadMe').modal('hide');
        }, 2000);
      });
  }

  clickForgot() {
    $('.modal-backdrop').remove();
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutClear);
  }
  placeChangedP(place) {
    console.log("place change event",place);
    
    this.list1.pick = place.formatted_address;
    this.list1.pickupLat = this.from.lat;
    this.list1.pickupLng = this.from.lat;
    this.list1.placeId = place.place_id;
    this.list1.Type = this.tripType
    let pickupdata = JSON.stringify(this.list1)
    localStorage.setItem('location',pickupdata )
  }
  dropplaceChangedP(place) {
    console.log("drop location value",place);
    
    this.list1.drop = place.formatted_address;
    this.list1.placeId = place.place_id;
    let dropdata = JSON.stringify(this.list1)
    localStorage.setItem('droplocation',dropdata)
  }
  from = {
    lat: 0,
    lng: 0,
  };
  to = {
    lat: 0,
    lng: 0,
  };
}
