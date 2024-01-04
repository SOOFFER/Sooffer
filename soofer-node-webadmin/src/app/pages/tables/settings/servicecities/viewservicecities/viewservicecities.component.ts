import { Component, OnInit } from '@angular/core';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../../common/common.service';
import { TableService } from '../../../table.service';
import { AppSettings } from '../../../../../app.config';
import { ServerDataSource } from 'ng2-smart-table';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

// tslint:disable-next-line: class-name
interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

// tslint:disable-next-line: class-name
interface statusDataList {
  value: string;
  label: string;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'viewservicecities',
  templateUrl: './viewservicecities.component.html',
})

export class ViewservicecitiesComponent implements OnInit {
  pageNo: number = 0;
  getInputs: any = {};
  spinner: boolean = true;
  source: ServerDataSource;
  userId: any;
  selectdefault: boolean = false;
  currencyary: any = [];
  countries: Array<commonDataList>;
  states: Array<commonDataList>;
  cities: Array<commonDataList>;
  status: Array<statusDataList> = [{
    'label': 'Active',
    'value': 'true'
  },
  {
    'label': 'InActive',
    'value': 'false'
  }
  ];

  defaultcity: Array<statusDataList> = [{
    'label': 'Default',
    'value': 'Default'
  }];

  settings = {
    actions: {
      edit: false,
      delete: false,
      add: false,
      custom: [
        { name: 'routeToAPage', title: `<i class="nb-edit"></i>` },
        // { name: 'routeToFirstCity', title: `<i class="ion-arrow-down-b"></i>` },
        // { name: 'routeToAPage', title: `<i class="ion-arrow-left-b"></i>` },
      ]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      child: //or something
      {
        title: 'Add Near By Cities ',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.city === 'Default') {
          } else {
            return `<a title="nearbycities"  href="#/pages/tables/settings/nearbycities;cityId=${row._id};stateId=${row.stateId}" >
                  <i class="ion-plus-round"></i></a>`;
          }
        },
      },
      inner:
      {
        title: 'Inner Polygon',
        type: 'html',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return `<a title="innerpolygon"  href="#/pages/tables/settings/innerpolygon;cityname=${row.city};" >
            <button type="button" class="btn btn-primary">Inner Polygon</button></a>`;
        },
      },
      // outer:
      // {
      //   title: 'Outer',
      //   type: 'html',
      //   filter: false,
      //   valuePrepareFunction: (cell, row) => {
      //     return `<a title="outerpolygon"  href="#/pages/tables/settings/outerpolygon;cityname=${row.city};" >
      //       <button type="button" class="btn btn-primary">Outer</button></a>`;
      //   },
      // },
      city: {
        title: 'Cities',
      },
      currency: {
        title: 'Currency',
      },
      softDelete: {
        title: 'Status',
        valuePrepareFunction: (softDelete) => {
          if (softDelete === true) return 'Inactive';
          else return 'Active';
        }
      }
    },
  };
  listCountries: any;

  constructor(
    _http: HttpClient,
    private http: Http,
    private commonservice: CommonService,
    private tableservice: TableService,
    private spinnerLoad: NgxSpinnerService,
    private toastr: ButtonToasterService
  ) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'AvailbleserviceCity' });
    // tslint:disable-next-line: radix
    this.userId = parseInt(localStorage.getItem('userId'));
  }

  ngOnInit(): void {
    this.getAllCountries();
  }

  // API REQUEST

  getval(eve) {
    //console.log(eve.target);
  }

  getAllCountries() {
    this.commonservice.getCountries()
      .then(response => {
        try {
          this.countries = response[0]['countries'];
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
    this.spinnerLoad.show();
    this.commonservice.GetCity(id)
      .then(response => {
        try {
          this.spinnerLoad.hide();
          this.cities = response[0]['cities'];
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

  getPolygonforaCity(id) {
    this.spinnerLoad.show();
    this.commonservice.getBoundryPolygonForaCity(id)
      .then(response => {
        try {
          this.spinnerLoad.hide();
          this.getInputs.getBoundryPolygon = response['data'];
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

  PolygonCity(id) {
    this.spinnerLoad.show();
    this.commonservice.getBoundryPolygon(id)
      .then(response => {
        try {
          this.spinnerLoad.hide();
          this.getInputs.getBoundryPolygon = response['data'];
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

  route(event) {
    //console.log(event.data);
    if (event.data.city === 'Default') {
      this.toastr.showtoast('error', 'Sorry unavailable operation');
    } else {
      this.commonservice.doAddFormControlNgSelectClass();
      this.selectdefault = false;
      this.getInputs._id = event.data._id;
      this.getInputs.countryId = event.data.countryId;
      this.getInputs.stateId = event.data.stateId;
      this.getInputs.cityId = event.data.cityId;
      this.getInputs.city = event.data.city;
      this.getInputs.softDelete = event.data.softDelete;
      this.getInputs.currency = event.data.currency;
      this.getInputs.requestRadius = event.data.requestRadius;
      this.getInputs.rentalRequestRadius = event.data.rentalRequestRadius;
      this.getInputs.outstationRequestRadius = event.data.outstationRequestRadius;
      this.getInputs.centerLat = event.data.centerPoint[1];
      this.getInputs.centerLng = event.data.centerPoint[0];
      this.getInputs.approxBoundaryKMFromCenter = event.data.approxBoundaryKMFromCenter;
      this.getInputs.status = this.returnStringforStatus(this.getInputs.status);
      this.getInputs.getBoundryPolygon = event.data.cityBoundaryPolygon;
      this.getInputs.driverPrefixCode = event.data.driverPrefixCode;
      this.getInputs.tripPrefixCode = event.data.tripPrefixCode;
      this.checkcity(event.data.city);
      this.getStateofSelectedCountry(this.getInputs.countryId);
      this.getCityofSelectedState(this.getInputs.stateId);
      this.getCurrency();
      this.btnClick(1);
    }
  }

  checkcity(data) {
    if (data === 'Default') {
      this.selectdefault = true;
    }
  }

  returnStringforStatus(data) {
    if (data === true) {
      return 'true';
    } else if (data === false) {
      return 'false';
    }
  }

  btnClick(num: number) {
    this.pageNo = num;
  }

  // COUNTRIES

  selectedCountry(option: commonDataList) {
    this.getInputs.stateId = '';
    this.getInputs.cityId = '';
    this.getInputs.getBoundryPolygon = '';
    this.getStateofSelectedCountry(option.id);
    this.showStateDropDown();
    this.commonservice.doAddFormControlNgSelectClass();
  }

  deSelectedCountry(option: commonDataList) {
    this.getInputs.countryId = '';
    this.getInputs.stateId = '';
    this.getInputs.cityId = '';
    this.getInputs.getBoundryPolygon = '';
    this.getInputs.status = 'true';
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
    this.showCityDropDown();
    this.getInputs.cityId = '';
    this.getInputs.getBoundryPolygon = '';
    this.commonservice.doAddFormControlNgSelectClass();
  }

  deSelectedState(option: commonDataList) {
    this.getInputs.stateId = '';
    this.getInputs.cityId = '';
    this.getInputs.getBoundryPolygon = '';
    this.getInputs.status = 'true';
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
    this.getInputs.city = option.label;
    this.getInputs.getBoundryPolygon = [];
    // this.getPolygonforaCity(this.getInputs.city);
    this.showCurrency();
    this.getCurrency();
  }

  deSelectedCity(option: commonDataList) {
    this.getInputs.cityId = '';
    this.getInputs.getBoundryPolygon = '';
    this.getInputs.status = 'true';
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

  // STATUS

  setStatus(option: statusDataList) {
    this.getInputs.status = '';
  }

  clearStatus(option: statusDataList) {
    this.getInputs.status = '';
  }

  updateAvailableCity(inputs) {
    this.spinner = false;
    let currency;
    this.listCountries[0].countries.map(el => {
      if (el.id === inputs.countryId) {
        currency = el.currencyCode;
      }
    })
    const updateCityObj = {
      city: this.getInputs.city,
      // cityBoundaryPolygon: this.getInputs.getBoundryPolygon,
      cityId: inputs.cityId,
      stateId: inputs.stateId,
      countryId: inputs.countryId,
      softDelete: inputs.softDelete,
      _id: this.getInputs._id,
      requestRadius: inputs.requestRadius,
      rentalRequestRadius: inputs.rentalRequestRadius,
      outstationRequestRadius: inputs.outstationRequestRadius,
      centerLat: inputs.centerLat,
      centerLng: inputs.centerLng,
      approxBoundaryKMFromCenter: inputs.approxBoundaryKMFromCenter,
      currency: currency,
      tripPrefixCode: inputs.tripPrefixCode,
      driverPrefixCode: inputs.driverPrefixCode
    };
    this.tableservice.updateServiceAvailableCity(updateCityObj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.spinner = true;
        this.btnClick(0);
      })
      .catch(msg => {
        this.spinner = true;
        this.toastr.showtoast('error', msg.message);
      });
  }

  deleteAvailableCity(id) {
    this.spinner = false;
    this.tableservice.deleteServiceAvailableCity(id)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.spinner = true;
        this.btnClick(0);
      });
  }

}
