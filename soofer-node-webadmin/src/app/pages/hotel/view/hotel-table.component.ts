import { Component, ViewChild, ElementRef } from '@angular/core';
import { ServerDataSource, LocalDataSource } from 'ng2-smart-table';
import { HotelService } from '../../hotel/hotel.service';
import { NbToastrService } from '@nebular/theme';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { RouterEvent, Router, ActivatedRoute } from '@angular/router';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { CommonService } from '../../common/common.service';
import { AppSettings, inputValidation } from '../../../app.config';
import { TableService } from '../../tables/table.service';
import { featuresSettings } from '../../../app.config';

interface commonArrayDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'ngx-smart-table',
  providers: [TableService, HotelService, CommonService],
  templateUrl: './smart-table.component.html',
  styles: [`
  nb-card {
    transform: translate3d(0, 0, 0);
  }
  `],
})
export class HotelTableComponent {
  initial: string = 'list';
  list: any = {};
  selectedid: string;
  selectedDocs: any;
  showservicecity = featuresSettings.isServiceAvailable;
  selectedUser: string;
  dropdownList;
  countries: Array<commonArrayDataList>;
  states: Array<commonArrayDataList>;
  cities: Array<commonArrayDataList>;
  servicecites: Array<commonArrayDataList>;
  defaultValue;
  changeingarr = [];
  defaultName;
  baseurl: string = AppSettings.BASEURL;
  userSettings1 = {
    'showSearchButton': false,
    'showCurrentLocation': true,
    'inputString': 'grqetgetg',
    'geoCountryRestriction': ['in'],
    'currentLocIconUrl': 'https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png',
    'locationIconUrl': 'http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png',
    'recentStorageName': 'componentData4',
    'noOfRecentSearchSave': 8
  };


  dropdownSettings = {
    singleSelection: false,
    idField: '_id',
    textField: 'label',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };
  validation = inputValidation;
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="ion-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      fname: {
        title: 'Hotel Name',
      },
      lname: {
        title: 'Owner Name',
      },
      email: {
        title: 'Email',
      },
      phone: {
        title: 'Phone',
      },
    },
  };
  public positions = [];
  @ViewChild('search')
  public searchElementRef: ElementRef;
  zlevel: number;
  center: any;
  address: string;
  // pickFrom: string;
  myres: any = [];
  public positions1 = [];

  direction: { origin: { lat: any; lng: any; }; destination: { lat: any; lng: any; }; travelMode: string; };
  longitude: string;
  latitude: string;
  longitude2: string;
  latitude2: string;

  source: ServerDataSource;

  constructor(private http: HttpClient,
    private service: TableService,
    private CommonSvc: CommonService,
    private hotelservice: HotelService,
    private toastr: ButtonToasterService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'hotel' });


  }


  ngOnInit(): void {

    this.CommonSvc.getCountries()
      .then(msg => this.countries = msg[0]['countries'])
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });

  }


  lessDate;
  updateMbal() {
    const body = new URLSearchParams();
    body.set('dateless', this.lessDate);
    this.CommonSvc.deactivateAllUsers(body)
      .then(msg => {
        this.toastr.showtoast('success', msg.message);
      });
  }


  route(event) {
    // console.log(event);
    this.initial = '';
    this.SetDocsDetails(event.data);
    this.CommonSvc.doAddFormControlNgSelectClass();
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    // console.log(data);
    this.selectedid = data._id;
    this.selectedDocs = data;
    this.selectedUser = data.fname;
    this.latitude = data.location[1];
    this.longitude = data.location[0];
    // this.latitude2=data.picklocation[1];
    // this.longitude2=data.picklocation[0];
    this.address = data.address;
    this.userSettings1.inputString = this.address;


    this.populateState(this.selectedDocs.country);
    this.populateCity(this.selectedDocs.state);
  }

  populateState(state) {
    this.CommonSvc.GetState(state)
      .then(msg => {
        this.states = msg[0]['states'];
      });
  }

  populateCity(state) {
    this.CommonSvc.GetCity(state)
      .then(msg => {
        this.cities = msg[0]['cities'];
      });
  }

  GetState(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.selectedDocs.cntyname = selectElementText;

    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;

    this.CommonSvc.GetState(selectElementId)
      .then(msg => {
        this.states = msg[0]['states'];
      });
  }

  GetCity(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.selectedDocs.statename = selectElementText;

    const selectElementId = event.target['options']
    [event.target['options'].selectedIndex].value;

    this.CommonSvc.GetCity(selectElementId)
      .then(msg => {
        this.cities = msg[0]['cities'];
      });
  }

  SetCity(data: any): void {
    if (!data) { return; }
    const selectElementText = event.target['options']
    [event.target['options'].selectedIndex].text;
    this.selectedDocs.cityname = selectElementText;
  }

  selectedCountry(option: commonArrayDataList) {
    this.selectedDocs.state = '';
    this.selectedDocs.city = '';
    this.selectedDocs.cntyname = option.label;
    // this.getStateofSelectedCountry(option.value);
    this.showStateDropDown();
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.getStateofSelectedCountry(option.value);
  }

  deSelectedCountry(option: commonArrayDataList) {
    this.selectedDocs.country = '';
    this.selectedDocs.state = '';
    this.selectedDocs.city = '';
    this.selectedDocs.cntyname = '';
    this.selectedDocs.statename = '';
    this.selectedDocs.cityname = '';
    this.showStateDropDown();
  }

  showStateDropDown() {
    if (
      typeof this.selectedDocs.countryId !== 'undefined' &&
      this.selectedDocs.countryId !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  // STATES

  selectedState(option: commonArrayDataList) {
    this.getCityofSelectedState(option.value);
    this.selectedDocs.statename = option.label;
    this.showCityDropDown();
    this.CommonSvc.doAddFormControlNgSelectClass();
  }

  deSelectedState(option: commonArrayDataList) {
    this.selectedDocs.state = '';
    this.selectedDocs.city = '';
    this.selectedDocs.cityname = '';
    this.selectedDocs.statename = '';
    this.showCityDropDown();
  }

  showCityDropDown() {
    if (
      typeof this.selectedDocs.countryId !== 'undefined' &&
      this.selectedDocs.countryId !== '' &&
      (typeof this.selectedDocs.stateId !== 'undefined' && this.selectedDocs.stateId !== '')
    ) {
      return true;
    } else {
      return false;
    }
  }

  // CITIES

  selectedCity(option: commonArrayDataList) {
    this.selectedDocs.cityname = option.label;
  }

  deSelectedCity(option: commonArrayDataList) {
    this.selectedDocs.city = '';
    this.selectedDocs.cityname = '';
  }

  getCityofSelectedState(id) {
    this.CommonSvc.getCitiesSelected(id)
      .then(response => {
        try {
          this.cities = response[0]['cities'];
        } catch (e) {
          this.toastr.showtoast('error', e.toString());
        }
      }).catch(response => {
        let errorMessage = 'Something went wrong.';
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast('error', errorMessage.toString());
      });
  }

  getStateofSelectedCountry(id) {
    this.CommonSvc.getStatesSelected(id)
      .then(response => {
        try {
          this.states = response[0]['states'];
        } catch (e) {
          this.toastr.showtoast('error', e.toString());
        }
      }).catch(response => {
        let errorMessage = 'Something went wrong.';
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast('error', errorMessage.toString());
      });
  }


  goBack(): void {
    this.initial = 'list';
  }

  filedata: any;

  fileEvent(e) {
    this.filedata = e.target.files[0];
    console.log(this.filedata);
  }

  updateRecord(input: any): void {
    if (!input) { return; }
    let inputs = input;
    console.log(inputs);//
    const formdata = new FormData();
    formdata.append('file', this.filedata);
    formdata.append('fname', inputs.fname);
    formdata.append('lname', inputs.lname);
    formdata.append('email', inputs.email);
    formdata.append('address', this.address);
    formdata.append('lat', this.latitude);
    formdata.append('lng', this.longitude);
    formdata.append('phone', inputs.phone);
    formdata.append('pickFrom', inputs.pickFrom);
    // formdata.append("lati", this.latitude2);
    // formdata.append("lngi", this.longitude2);
    formdata.append('zipCode', inputs.zipCode);
    formdata.append('commission', inputs.commission);
    formdata.append('country', inputs.country);
    formdata.append('state', inputs.state);
    formdata.append('city', inputs.city);
    formdata.append('actCode', inputs.actCode);
    formdata.append('actHolder', inputs.actHolder);
    formdata.append('actNo', inputs.actNo);
    formdata.append('actBank', inputs.actBank);
    formdata.append('actLoc', inputs.actLoc);
    formdata.append('id', inputs.selectedid);
    console.log(formdata);
    this.hotelservice.updateHotelData(formdata)
      .then(msg => {
        this.toastr.showtoast('success', msg.message);
        this.goBack();
      })
      .catch(msg => {
        const erri = JSON.parse(msg.body);
        this.toastr.showtoast('error', erri.message);
      });

  }
  autoCompleteCallback1(selectedData: any) {
    console.log(selectedData);
    this.longitude = selectedData.data.geometry.location.lng;
    this.latitude = selectedData.data.geometry.location.lat;
    this.address = selectedData.data.formatted_address;
    console.log(selectedData.data.formatted_address);
  }

  // autoCompleteCallback2(selectedData: any) {
  //   console.log(selectedData)
  //  this.longitude2=selectedData.data.geometry.location.lng;
  //  this.latitude2=selectedData.data.geometry.location.lat;
  //  this.pickFrom=selectedData.data.formatted_address;
  //  console.log(selectedData.data.formatted_address)
  // }

  deleteRecord(data: any): void {
    this.hotelservice.deleteHotelData(data)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast('error', res.message);
      });
  }

}

