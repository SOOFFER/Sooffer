import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../rider.service';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { inputValidation, featuresSettings, AppSettings } from '../../../app.config';
// import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

interface CommonInter {
  value: string;
  label: string;
  _id: string;
  currency: string;
}

@Component({
  selector: "ngx-form-inputs",
  styleUrls: ["./form-inputs.component.scss"],
  templateUrl: "./form-inputs.component.html",
})
export class FormInputsComponent implements OnInit {
  langary: any[] = [];
  countries: Array<CommonInter>;
  states: Array<CommonInter>;
  cities: Array<CommonInter>;
  serviceCity: Array<CommonInter>;
  currencyary: any[] = [];
  list: any = {};
  validation = inputValidation;
  showservicecity = featuresSettings.isServiceAvailable;
  showCurr: boolean = false;
  dropdownSettings = {
    singleSelection: true,
    idField: "_id",
    textField: "label",
    itemsShowLimit: 10,
    allowSearchFilter: true,
  };

  user = localStorage.getItem("userType");
  phone: FormControl = new FormControl(null, Validators.required);
  dialCode: string = AppSettings.defaultPhoneCode;
  defaultCode = AppSettings.defaultPhoneCode;
  DefaultCountry = featuresSettings.DefaultCountry;
  DefaultState = featuresSettings.DefaultState;
  list_phon_code = featuresSettings.phcode;

  constructor(
    private dataService: Service,
    private router: Router,
    private CommonSvc: CommonService,
    private toastr: ButtonToasterService
  ) {
    this.list.phcode = featuresSettings.selectedPhcode;

    this.CommonSvc.doAddFormControlNgSelectClass();
    this.CommonSvc.generalfunFor("AvailbleserviceCity").then((res) => {
      this.serviceCity = res;
      this.serviceCity = this.CommonSvc.dataforscids(this.serviceCity);
      if (this.user == "citywiseadmin") {
        this.list.scIds = this.CommonSvc.dataforscids(this.serviceCity);
      }
    });
    this.phone.valueChanges.debounceTime(700).subscribe((data) => {
      if (data !== "" && data !== undefined && data !== null) {
        this.dialCode = data.dialCode;
      } else this.dialCode = "";
    });
  }

  // separateDialCode = true;
  // SearchCountryField = SearchCountryField;
  // TooltipLabel = TooltipLabel;
  // CountryISO = CountryISO;
  // preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  onItemSelect(item: any) {
    this.dispCurr(item);
    let currentCur;
    this.serviceCity.forEach((el) => {
      if (el._id === item._id) {
        currentCur = el.currency;
      }
    });
    this.list.cur = currentCur;
  }

  onItemDeSelect(item: any) {
    this.dispCurr("");
  }

  dispCurr(data) {
    if (data.label === "Default") {
      this.showCurr = true;
    } else {
      this.showCurr = false;
      this.list.cur = "";
    }
  }

  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then((msg) => {
        this.countries = msg[0]["countries"];
        this.list.cnty = this.DefaultCountry;
        this.getStateofSelectedCountry(this.list.cnty);
      })
      .catch((msg) => {
        this.toastr.showtoast("error", msg.message);
      });
    // this.CommonSvc.getLangs()
    //   .then(msg => this.langary = msg[0]['datas']);
    // this.CommonSvc.getCurrency()
    //   .then(msg => this.currencyary = msg[0]['datas']);
  }

  filedata: any;
  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  selectedCountry(option: CommonInter) {
    this.list.cntyname = option.label;
    this.list.city = "";
    this.list.state = "";
    this.getStateofSelectedCountry(option.value);
  }

  deSelectedCountry(option: CommonInter) {
    this.list.cntyname = "";
    this.list.city = "";
    this.list.state = "";
    this.list.cnty = "";
  }

  selectedState(option: CommonInter) {
    this.list.statename = option.label;
    this.list.city = "";
    this.getCityofSelectedState(option.value);
  }

  deSelectedState(option: CommonInter) {
    this.list.statename = "";
    this.list.city = "";
    this.list.state = "";
  }

  selectedCity(option: CommonInter) {
    this.list.cityname = option.label;
  }

  deSelectedCity(option: CommonInter) {
    this.list.cityname = "";
    this.list.city = "";
  }

  getStateofSelectedCountry(id) {
    this.CommonSvc.GetStateofSelectedCountry(id)
      .then((response) => {
        try {
          this.states = response[0]["states"];
          this.list.state = this.DefaultState;
          this.getCityofSelectedState(this.list.state);
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
          errorMessage,
          response
        );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  getCityofSelectedState(id) {
    this.CommonSvc.GetCity(id)
      .then((response) => {
        try {
          this.cities = response[0]["cities"];
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      })
      .catch((response) => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.CommonSvc.doCatchExceptionalErrorsForGivingErrorNotice(
          errorMessage,
          response
        );
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  AddNewDoc(inputs: any): void {
    if (!inputs) {
      return;
    }
    if (
      (typeof inputs.scIds === "undefined" || inputs.scIds === "") &&
      this.showservicecity === true
    ) {
      this.toastr.showtoast("warn", "Enter Service Available City");
    } else {
      if (this.showservicecity === false) {
        const scIds = this.CommonSvc.convertionOfServiceId(this.serviceCity);
        (inputs.scId = scIds[0].scId), (inputs.scity = scIds[0].name);
      } else {
        const scIds = this.CommonSvc.convertionOfServiceId(inputs.scIds);
        (inputs.scId = scIds[0].scId), (inputs.scity = scIds[0].name);
      }
      // inputs.phcode = this.phone.value.dialCode;
      // inputs.phone = this.phone.value.number;
      // console.log(inputs);
      this.dataService
        .createDoc(inputs)
        .then((msg) => {
          this.toastr.showtoast("success", msg.message);
          this.router.navigate(["/pages/tables/rider-table"]);
        })
        .catch((msg) => {
          this.toastr.showtoast("error", msg.error.message);
        });
    }
  }
}
