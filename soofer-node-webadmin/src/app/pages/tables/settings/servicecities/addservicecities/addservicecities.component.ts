import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../common/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { TableService } from '../../../table.service';
import { featuresSettings } from '../../../../../app.config';

// tslint:disable-next-line: class-name
interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'addservicecities',
  templateUrl: './addservicecities.component.html',
})

export class AddservicecitiesComponent implements OnInit {
  getInputs: any;
  spinner: boolean = true;
  userId: any;
  countries: Array<commonDataList>;
  states: Array<commonDataList>;
  cities: Array<commonDataList>;
  currencyary: any = [];
  obj: any;
  Arr: any;
  listCountries: any;
  DefaultCountery = featuresSettings.DefaultCountry;
  DefaultState = featuresSettings.DefaultState;

  constructor(
    private commonservice: CommonService,
    private route: Router,
    private tableservice: TableService,
    private spinnerLoad: NgxSpinnerService,
    private toastr: ButtonToasterService) {
    // tslint:disable-next-line: radix
    this.userId = parseInt(localStorage.getItem('userId'));
    this.getInputs = {};
  }

  ngOnInit(): void {
    this.getAllCountries();
    this.commonservice.doAddFormControlNgSelectClass();
  }

  // API REQUEST

  getAllCountries() {
    this.commonservice.getCountries()
      .then(response => {
        try {
          this.countries = response[0]['countries'];
          this.getInputs.countryId = this.DefaultCountery;
          this.getStateofSelectedCountry(this.getInputs.countryId);
          this.listCountries = response;
        } catch (e) {
          this.toastr.showtoast('error', e.toString());
        }
      }).catch(response => {
        this.spinnerLoad.hide();
        let errorMessage = 'Something went wrong.';
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast('error', errorMessage.toString());
      });
  }

  getStateofSelectedCountry(id) {
    this.commonservice.GetStateofSelectedCountry(id)
      .then(response => {
        try {
          this.states = response[0]['states'];
          this.getInputs.stateId = this.DefaultState;
          this.getCityofSelectedState(this.getInputs.stateId)
        } catch (e) {
          this.toastr.showtoast('error', e.toString());
        }
      }).catch(response => {
        this.spinnerLoad.hide();
        let errorMessage = 'Something went wrong.';
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast('error', errorMessage.toString());
      });
  }

  getCityofSelectedState(id) {
    this.commonservice.GetCity(id)
      .then(response => {
        try {
          this.cities = response[0]['cities'];
        } catch (e) {
          this.toastr.showtoast('error', e.toString());
        }
      }).catch(response => {
        this.spinnerLoad.hide();
        let errorMessage = 'Something went wrong.';
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast('error', errorMessage.toString());
      });
  }

  getPolygonforCity(id) {
    this.spinnerLoad.show();
    this.commonservice.getBoundryPolygonForaCity(id)
      .then(response => {
        try {
          this.spinnerLoad.hide();
          if (Array.isArray(response['data'][0]) === true) {
            if (response['data'][0].length !== 0) {
              this.getInputs.getBoundryPolygon = response['data'][0];
              console.log(' this.getInputs.getBoundryPolygon-Inner', response['data'][0]);
            }
            console.log(' this.getInputs.getBoundryPolygon-Outter', response['data'][0]);
          } else {
            console.log(' this.getInputs.getBoundryPolygon-else', response['data'][0]);
            this.getInputs.getBoundryPolygon = [];
          }
          //console.log(this.getInputs.getBoundryPolygon)
          //this.getData()
        } catch (e) {
          this.spinnerLoad.hide();
          this.toastr.showtoast('error', e.toString());
        }
      }).catch(response => {
        this.spinnerLoad.hide();
        let errorMessage = 'Something went wrong.';
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast('error', errorMessage.toString());
      });
  }

  getCurrency() {
    this.commonservice.getCurrency()
      .then(response => {
        this.currencyary = response[0].datas;
      });
  }

  // COUNTRIES

  selectedCountry(option: commonDataList) {
    this.getInputs.stateId = '';
    this.getInputs.cityId = '';
    this.getInputs.getBoundryPolygon = [];
    this.getStateofSelectedCountry(option.id);
    this.showStateDropDown();
    this.commonservice.doAddFormControlNgSelectClass();
  }

  deSelectedCountry(option: commonDataList) {
    this.getInputs.countryId = '';
    this.getInputs.stateId = '';
    this.getInputs.cityId = '';
    this.getInputs.getBoundryPolygon = [];
    this.showStateDropDown();
  }

  showStateDropDown() {
    if (
      typeof this.getInputs.countryId !== 'undefined'
      && this.getInputs.countryId !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  // STATES

  selectedState(option: commonDataList) {
    this.getCityofSelectedState(option.id);
    this.getInputs.cityId = '';
    this.getInputs.getCity = '';
    this.getInputs.getBoundryPolygon = [];
    this.showCityDropDown();
    this.commonservice.doAddFormControlNgSelectClass();
  }

  deSelectedState(option: commonDataList) {
    this.getInputs.stateId = '';
    this.getInputs.cityId = '';
    this.getInputs.getBoundryPolygon = [];
    this.showCityDropDown();
  }

  showCityDropDown() {
    if (
      typeof this.getInputs.countryId !== 'undefined'
      && this.getInputs.countryId !== ''
      && (
        typeof this.getInputs.stateId !== 'undefined'
        && this.getInputs.stateId !== '')
    ) {
      return true;
    } else {
      return false;
    }
  }

  // CITIES

  selectedCity(option: commonDataList) {
    this.getInputs.getCity = option.label;
    // this.getPolygonforCity(option.label);
    this.getInputs.getBoundryPolygon = [];
    this.showCurrency();
    this.getCurrency();
    //this.initMap()
  }

  deSelectedCity(option: commonDataList) {
    this.getInputs.cityId = '';
    this.getInputs.getCity = '';
    this.getInputs.getBoundryPolygon = [];
    this.getInputs.currency = undefined;
    this.showCurrency();
    this.getCurrency();
  }

  showCurrency() {
    if (
      typeof this.getInputs.countryId !== 'undefined'
      && this.getInputs.countryId !== ''
      && (
        typeof this.getInputs.stateId !== 'undefined'
        && this.getInputs.stateId !== '')
      && (
        typeof this.getInputs.cityId !== 'undefined'
        && this.getInputs.cityId !== '')
    ) {
      return true;
    } else {
      return false;
    }
  }

  // POST DATA TO API

  addServiceCity(inputs: any): void {
    this.spinner = false;
    let currency;
    this.listCountries[0].countries.map(el => {
      if (el.id === inputs.countryId) {
        currency = el.currencyCode;
      }
    })
    const addCityObj = {
      countryId: inputs.countryId,
      stateId: inputs.stateId,
      city: this.getInputs.getCity,
      cityId: inputs.cityId,
      cityBoundaryPolygon: this.getInputs.getBoundryPolygon,
      // currency: inputs.currency,
      requestRadius: inputs.requestRadius,
      rentalRequestRadius: inputs.rentalRequestRadius,
      outstationRequestRadius: inputs.outstationRequestRadius,
      centerLat: inputs.centerLat,
      centerLng: inputs.centerLng,
      approxBoundaryKMFromCenter: inputs.approxBoundaryKMFromCenter,
      currency: currency,
      driverPrefixCode: inputs.driverPrefixCode,
      tripPrefixCode: inputs.tripPrefixCode
    };
    this.tableservice.addServiceAvailableCity(addCityObj)
      .then(msg => {
        this.toastr.showtoast('success', msg.message);
        this.spinner = true;
        this.route.navigate(['/pages/tables/settings/servicecities/viewservicecities']);
      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
        this.spinner = true;
      });
  }

  /*
    getData() {
      this.getInputs.getBoundryPolygon[0].forEach(el => {
        this.obj['lng'] = el[0]
      })
      console.log(this.obj)
      //console.log(this.Arr)
    }

    ngAfterViewInit() {
      // this.initMap();
    }

    initMap() {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: 9.939093, lng: 78.121719 },
      });

      // Define the LatLng coordinates for the polygon's path.
      var triangleCoords = [
        { lat: 9.835907867983217, lng: 78.5159698580078 },
        { lat: 9.666726691319159, lng: 78.16921387656248 },
        { lat: 9.605800551961, lng: 77.75928650839842 },
        { lat: 10.068559366305104, lng: 77.84786377890623 }
      ];

      // Construct the polygon.
      var bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
      bermudaTriangle.setMap(map);
    }
   */

  /*
    DRAW POLYGON

    map: any;
    drawingManager: any;

    ngAfterViewInit() {
      this.drawPolygon();
    }

    drawPolygon() {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 9.939093, lng: 78.121719 },
        zoom: 8
      });

      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          //drawingModes: ['polygon']
        }
      });

      this.drawingManager.setMap(this.map);
      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
        // Polygon drawn
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          //this is the coordinate, you can assign it to a variable or pass into another function.
          alert(event.overlay.getPath().getArray());
        }
      });
    } */
}
