import { Component, ElementRef, Inject, LOCALE_ID } from '@angular/core';
import { AppSettings } from '../../app.config';
import { SectionService } from './section.service';
import { ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { DirectionsRenderer } from '@ngui/map';
import { DataSharingService } from '../common/data-sharing.service';
let $: any;

@Component({
  selector: "sections",
  templateUrl: './section.html',
  providers: [SectionService],
  styleUrls: ['./section.css']
})
export class SectionComponent implements OnInit {

  customOptions: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['&lt', '&gt'],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
  };

  listVehiclesDynamically: any = [];
  apiNew = '10.1.1.29:3001/';
  defaultcurrency = AppSettings.defaultcur;
  defaultUnit = AppSettings.defaultUnit;
  showVehicleOffers = AppSettings.showWhatWeOffers;

  baseurl = AppSettings.BASEURL;
  list: any = {};
  list1: any = {};
  ourDriverAry: any[] = [];
  center: any;
  marker = {
    display: true,
    lat: null,
    lng: null,
  };
  showVehicle = false;
  icon: any;
  temp: string = AppSettings.BASEURL;

  seticon: any = {};
  from = {
    lat: 0,
    lng: 0,
  };
  to = {
    lat: 0,
    lng: 0,
  };
  pic: any;

  showSecondCurrency = AppSettings.toShowSeocndCurrency;
  secondCurrecny = AppSettings.secondCurrency;

  directionsService: google.maps.DirectionsService;
  directionsDisplay: google.maps.DirectionsRenderer;
  map: google.maps.Map;
  showBasic = false;
  NewListArr: any = {};
  NewList: any = {};
  distanceList: any = {};
  showError: any = '';
  ToggleFare = false;
  center1: any;
  zlevel: number;
  // geocoder = new google.maps.Geocoder();
  direction: any = {};
  public positions = [];
  maxZoomService: any;
  autocomplete: any;
  vehicleAry: any[] = [];

  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;


  directionsRenderer: google.maps.DirectionsRenderer;
  directionsResult: google.maps.DirectionsResult;
  constructor(private sectionService: SectionService,
    dataSharingService: DataSharingService,
    private cdr: ChangeDetectorRef) {
    this.maxZoomService = new google.maps.MaxZoomService();
    this.center = AppSettings.DEFAULT_LOCATION;
    this.zlevel = AppSettings.ZOOM_MAP_LOCATION;
    this.maxZoomService = new google.maps.MaxZoomService();
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;

    dataSharingService.isUserLoggedIn.subscribe(value => {
      this.hideButton();
    });
    this.hideButton();

  }

  hideBu = false;

  hideButton() {
    const tok = localStorage.getItem('Tok');
    if (tok) {
      this.hideBu = true;
    } else {
      this.hideBu = false;
    }
  }

  directionsChanged() {
    this.directionsResult = this.directionsRenderer.getDirections();
    this.cdr.detectChanges();
    this.getFareEstimation(this.list1);
    this.list1.serviceTypeId = undefined;
    this.showBasic = false;
    this.NewListArr = {};
    this.NewList = {};
    this.distanceList = {};
  }

  showDirection() {
    this.directionsRendererDirective['showDirections'](this.direction);
  }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  call() {

  }

  SetVehicleType(data: any, inputs: any): void {
    if (!data) { return; }
    this.showBasic = true;
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    // console.log(selectElementText)
    for (const item of this.vehicleAry) {
      if (item.type == selectElementText) {
        this.icon = this.temp + item.file;
      }
    }
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
        this.NewListArr = res.vehicleDetailsAndFare;
        this.NewList = this.NewListArr.fareDetails;
        this.distanceList = res.distanceDetails;
        // console.log(this.NewListArr)
        // console.log(this.NewList)
        this.NewList.paymentMode = 'Cash';
      })
      .catch(res => {
        this.ToggleFare = true;
        const body = res._body;
        const errorMessage = JSON.parse(body);
        this.showError = errorMessage.message;
      });
  }

  ngOnInit(): void {
    this.positions = [];
    this.GetHomPageDetail();
    this.sectionService.getOurDrivers()
      .then(res => {
        if (res.length) this.ourDriverAry = res;
      });
    this.sectionService.listVehicles()
      .then(res => {
        this.listVehiclesDynamically = res;
        console.log(this.listVehiclesDynamically);
      })
      .catch(res => {

      });
    // this.directionsRendererDirective.initialized$.subscribe(directionsRenderer => {
    //   this.directionsRenderer = directionsRenderer;
    // });
  }

  findRan(numb) {
    return Math.floor((Math.random() * numb) + 1);
  }

  getFareEstimation(input) {
    console.log(this.list1);
    this.sectionService.getVehicles(this.list1)
      .then(res => {
        this.vehicleAry = res.vehicleCategories;
        this.showVehicle = true;
      });
  }

  placeChangedD(place) {
    this.list1.drop = place.formatted_address;
    this.pic = 'assets/images/pin_2.png';
    this.seticon = {
      url: 'assets/images/pin_2.png',
      anchor: [16, 16],
      size: [32, 32],
      scaledSize: [32, 32]
    };
    const c = place.geometry.location;
    // this.center = place.geometry.location;
    this.marker.lat = c.lat();
    this.marker.lng = c.lng();
    this.positions.splice(1, 1);
    this.positions[1] = null;
    this.positions[1] = ([parseFloat(this.marker.lat), parseFloat(this.marker.lng)]);
    // console.log("SEt")
    this.to.lat = parseFloat(this.marker.lat);
    this.to.lng = parseFloat(this.marker.lng);

    this.list1.dropLat = this.to.lat;
    this.list1.dropLng = this.to.lng;

    if (this.from.lat !== 0 && this.from.lng !== 0) {
      // console.log("Not Zero")
      this.direction = {
        origin: { lat: this.from.lat, lng: this.from.lng },
        destination: { lat: this.to.lat, lng: this.to.lng },
        travelMode: 'DRIVING'
      };
    }
    // this.maxZoomService.getMaxZoomAtLatLng({ lat: this.to.lat, lng: this.to.lng }, response => {
    //   if (response.status !== 'OK') { console.log('not ok'); } else {
    //     const level = response.zoom;
    //     this.zlevel = level;
    //     this.center = { lat: this.marker.lat, lng: this.marker.lng };
    //     console.log('2 ', this.center);
    //   }
    // });
  }

  placeChangedP(place) {
    this.list1.pick = place.formatted_address;
    this.pic = 'assets/images/pin_1.png';
    this.seticon = {
      url: 'assets/images/pin_1.png',
      anchor: [16, 16],
      size: [32, 32],
      scaledSize: [32, 32]
    };
    this.center = place.geometry.location;
    this.marker.lat = this.center.lat();
    this.marker.lng = this.center.lng();
    this.positions.shift();
    this.positions[0] = null;
    this.positions[1] = [this.to.lat, this.to.lng];
    this.positions[0] = ([parseFloat(this.marker.lat), parseFloat(this.marker.lng)]);
    this.from.lat = parseFloat(this.marker.lat);
    this.from.lng = parseFloat(this.marker.lng);
    this.list1.pickupLat = this.from.lat;
    this.list1.pickupLng = this.from.lng;
    if (this.to.lat !== 0 && this.to.lng !== 0) {
      this.positions[1] = ([this.to.lat, this.to.lng]);
      this.direction = {
        origin: { lat: this.from.lat, lng: this.from.lng },
        destination: { lat: this.to.lat, lng: this.to.lng },
        travelMode: 'DRIVING'
      };
    }
    this.maxZoomService.getMaxZoomAtLatLng({ lat: this.from.lat, lng: this.from.lng }, response => {
      if (response.status !== 'OK') { } else {
        const level = response.zoom;
        this.zlevel = 15;
        this.center = { lat: this.marker.lat, lng: this.marker.lng };
      }
    });
  }

  getDrag(event) { }

  GetHomPageDetail(): void {
    this.sectionService.gethomecontent()
      .then(res => {
        console.log('TEST', res);

        if (res.length) this.list = res[0];
      });
  }
}
