import { Component } from '@angular/core';
import { CompanyService } from '../company.service';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { Router } from '@angular/router';
import { dropdown, featuresSettings, inputValidation } from '../../../app.config';

interface commoninter {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'ngx-form-inputs',
  styleUrls: ['./form-inputs.component.scss'],
  templateUrl: './form-inputs.component.html',
})

export class FormInputsComponent {
  data: any = {};
  countries: Array<commoninter>;
  states: Array<commoninter>;
  cities: Array<commoninter>;
  scities: Array<commoninter>;
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;
  validation = inputValidation;

  constructor(private Service: CompanyService, private router: Router,
    private CommonSvc: CommonService, private toastr: ButtonToasterService) {
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.CommonSvc.getServiceAvailableCity()
      .then(res => {
        this.scities = res
        this.scities = this.CommonSvc.convertionOfServiceId(this.scities)
        this.scities = this.CommonSvc.dataforscids(this.scities)
      })
  }

  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then(msg => this.countries = msg[0]['countries'])
      .catch(msg => {
        this.toastr.showtoast("error", msg.message);
      });
  }

  selectedCountry(option: commoninter) {
    this.data.getCountry = option.label;
    this.data.city = "";
    this.data.state = "";
    this.getStateofSelectedCountry(option.value)
  }

  deSelectedCountry(option: commoninter) {
    this.data.getCountry = '';
    this.data.city = "";
    this.data.state = "";
    this.data.cnty = "";
  }

  selectedState(option: commoninter) {
    this.data.getState = option.label;
    this.data.city = "";
    this.getCityofSelectedState(option.value)
  }

  deSelectedState(option: commoninter) {
    this.data.getState = '';
    this.data.city = "";
    this.data.state = "";
  }


  selectedCity(option: commoninter) {
    this.data.getCity = option.label
  }

  deSelectedCity(option: commoninter) {
    this.data.getCity = '';
    this.data.city = "";
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


  AddDoc(data: any): void {
    if (!data) { return; }
    if ((typeof data.scIds === "undefined" || data.scIds === '') && this.servicecity === true) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      if (this.servicecity === false) {
        data.scIds = this.scities;
      }
      else {
        data.scIds = this.CommonSvc.convertionOfServiceId(data.scIds);
      }
      let companyObj = {
        name: data.name,
        email: data.email,
        pwd: data.pwd,
        phone: data.phone,
        vatNumber: data.vatNumber,
        adln1: data.adln1,
        adln2: data.adln2,
        vat: data.vat,
        cnty: data.cnty,
        cntyname: this.data.getCountry,
        state: data.state,
        statename: this.data.getState,
        settlementType: data.settlementType,
        rate: data.rate,
        city: data.city,
        cityname: this.data.getCity,
        scIds: JSON.stringify(data.scIds)
      }
      this.Service.addCompany(companyObj)
        .then(msg => {
          this.toastr.showtoast("success", msg.message);
          this.router.navigate(['/pages/company/company-view']);
        })
        .catch(msg => {
          this.toastr.showtoast("error", msg.message);
        })
    }
  }

}
