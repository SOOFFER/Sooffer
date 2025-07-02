import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotelService } from '../hotel.service';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { featuresSettings, inputValidation } from '../../../app.config';
 

interface commoninter {
  value: string;
  label: string;
  _id: string;
  currency: string;
}

@Component({
  selector: 'ngx-form-inputs',
  providers: [CommonService],
  templateUrl: './form-inputs.component.html',
})

export class HotelFormInputsComponent {
  companyary: any[] = [];
  langary: any[] = [];
  list: any = {};
  currencyary: any[] = [];
  countries: Array<commoninter>;
  states: Array<commoninter>;
  cities: Array<commoninter>;
  serviceCity: Array<commoninter>;
  lengthservicecities: number;
  itemdata = [];
  selectedItems = [];
  showCurr: boolean = false;
  showservicecity = featuresSettings.isServiceAvailable;
  showCompany = featuresSettings.isMultipleCompaniesAvailable;
  dropdownSettings = {
    singleSelection: true,
    idField: '_id',
    textField: 'label',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };
  validation = inputValidation;
  userSettings = {
    "showSearchButton":false,
    "showCurrentLocation":true,
    "geoCountryRestriction":["in"],
    "currentLocIconUrl":"https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png",
    "locationIconUrl":"http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png",
    "recentStorageName":"componentData4",
    "noOfRecentSearchSave":8
    }

  public positions = [];
  @ViewChild("search")
  public searchElementRef: ElementRef;
  zlevel: number;
  center: any;
  address: string;
 // pickFrom: string;
  myres: any = [];
  public positions1 = [];
 
  direction: { origin: { lat: any; lng: any; }; destination: { lat: any; lng: any; }; travelMode: string; };
  longitude: string  ;
  latitude: string;
  longitude2: string;
  latitude2: string;
  constructor( private dataService: HotelService, private router: Router, private CommonSvc: CommonService, private toastr: ButtonToasterService) {
    this.CommonSvc.doAddFormControlNgSelectClass();
   
    this.CommonSvc.generalfunFor('AvailbleserviceCity')
      .then(res => {
        this.serviceCity = res
        this.serviceCity = this.CommonSvc.dataforscids(this.serviceCity)
      })
  }
@ViewChild("ngForm") form:any;
  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then(msg => this.countries = msg[0]['countries'])
      .catch(msg => {
        this.toastr.showtoast("error", msg.message);
      });
      
  }
  filedata: any;

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  selectedCountry(option: commoninter) {
    this.list.cntyname = option.label;
    this.list.city = "";
    this.list.state = "";
    this.getStateofSelectedCountry(option.value)
  }

  deSelectedCountry(option: commoninter) {
    this.list.cntyname = '';
    this.list.city = "";
    this.list.state = "";
    this.list.cnty = "";
  }

  selectedState(option: commoninter) {
    this.list.statename = option.label;
    this.list.city = "";
    this.getCityofSelectedState(option.value)
  }

  deSelectedState(option: commoninter) {
    this.list.statename = '';
    this.list.city = "";
    this.list.state = "";
  }

  selectedCity(option: commoninter) {
    this.list.cityname = option.label
  }

  deSelectedCity(option: commoninter) {
    this.list.cityname = '';
    this.list.city = "";
  }

  getStateofSelectedCountry(id) {
    this.CommonSvc.GetStateofSelectedCountry(id)
      .then(response => {
        try {
          this.states = response[0]['states']
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      }).catch(response => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  getCityofSelectedState(id) {
    this.CommonSvc.GetCity(id)
      .then(response => {
        try {
          this.cities = response[0]['cities']
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      }).catch(response => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  AddHotel(inputs: any): void {
    if (!inputs) { return; }
    
     let formdata = new FormData();
      formdata.append("file", this.filedata);
      formdata.append("fname", inputs.fname);
      formdata.append("lname", inputs.lname);
      formdata.append("email", inputs.email);
      formdata.append("address", this.address);
      formdata.append("lat", this.latitude);
      formdata.append("lng", this.longitude);
      formdata.append("phone", inputs.phone);
      formdata.append("pickFrom", inputs.pickFrom);
      // formdata.append("lati", this.latitude2);
      // formdata.append("lngi", this.longitude2);
      formdata.append("zipCode", inputs.zipCode);
      formdata.append("commission", inputs.commission);
      formdata.append("country", inputs.country);
      formdata.append("state", inputs.state);
      formdata.append("city", inputs.city);
      formdata.append("actCode", inputs.actCode);
      formdata.append("actHolder", inputs.actHolder);
      formdata.append("actNo", inputs.actNo);
      formdata.append("actBank", inputs.actBank);
      formdata.append("actLoc", inputs.actLoc);
     
      this.dataService.createDoc(formdata)
        .then(msg => {
          this.toastr.showtoast("success", msg.message);
          this.router.navigate(['/pages/hotel/view']);
          //this.list={};
          // this.form.reset();
        })
        .catch(msg => {
          this.toastr.showtoast("error", msg.message);
        })
       
  }
 
   
  autoCompleteCallback1(selectedData: any) {
    console.log(selectedData)
   this.longitude=selectedData.data.geometry.location.lng;
   this. latitude=selectedData.data.geometry.location.lat;
   this.address=selectedData.data.formatted_address;
   console.log(selectedData.data.formatted_address)
  }

  // autoCompleteCallback2(selectedData: any) {
  //   console.log(selectedData)
  //  this.longitude2=selectedData.data.geometry.location.lng;
  //  this.latitude2=selectedData.data.geometry.location.lat;
  //  this.pickFrom=selectedData.data.formatted_address;
  //  console.log(selectedData.data.formatted_address)
  // }


}
