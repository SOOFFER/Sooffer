import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { AppSettings, dropdown, featuresSettings, inputValidation } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../common/common.service';
import { CompanyService } from '../company.service';

interface commoninter {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'ngx-form-layouts',
  styleUrls: ['./form-layouts.component.scss'],
  templateUrl: './form-layouts.component.html',
})


export class CompanyTableComponent implements OnInit {

  initial: string = "list";
  selectedid: string;
  selectedDocs: any;
  data: any = {};
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [{ name: 'routeToAPage', title: `<i class="nb-edit"></i>` }]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      name: {
        title: 'Company Name',
      },
      adln1: {
        title: 'Address',
      },
      email: {
        title: 'Email',
      },
      phone: {
        title: 'Phone',
      },
    },
  };

  countries: Array<commoninter>;
  states: Array<commoninter>;
  cities: Array<commoninter>;
  scities: Array<commoninter>;
  selectedScID: any;
  dropdownSettings = dropdown.dropdownSettings;
  servicecity = featuresSettings.isServiceAvailable;
  source: ServerDataSource;
  validation = inputValidation;

  constructor(http: HttpClient,
    private CommonSvc: CommonService,
    private service: CompanyService,
    private toastr: ButtonToasterService) {
    this.source = new ServerDataSource(http, { endPoint: AppSettings.API_ENDPOINT + 'company' });
  }

  ngOnInit(): void {
    this.CommonSvc.getServiceAvailableCity()
      .then(res => {
        this.cities = res
        this.cities = this.CommonSvc.convertionOfServiceId(this.cities)
        this.cities = this.CommonSvc.dataforscids(this.cities)
      })
    this.CommonSvc.getCountries()
      .then(msg => this.countries = msg[0]['countries'])
  }

  route(event) {
    this.initial = "";
    this.SetDocsDetails(event.data);
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    console.log(data,"data");
    this.CommonSvc.doAddFormControlNgSelectClass();
    this.selectedid = data._id;
    this.selectedDocs = data;
    this.populateState(this.selectedDocs.cnty);
    this.populateCity(this.selectedDocs.state);
    this.data.getCountry = data.cntyname;
    this.data.getState = data.statename;
    this.data.getCity = data.cityname;
    this.selectedScID = data.scIds;
  }

  populateState(state) {
    this.CommonSvc.GetState(state)
      .then(msg => {
        this.states = msg[0]['states'];
      })
  }

  populateCity(state) {
    this.CommonSvc.GetCity(state)
      .then(msg => {
        this.cities = msg[0]['cities'];
      })
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

  goBack(): void {
    this.initial = "list";
  }

  updateRecord(inputs) {
    if (inputs.scIds.length <= 0 && this.servicecity === true) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
      if (this.servicecity === false) {
        inputs.scIds = this.scities;
      }
      inputs.oldScIds = this.selectedScID;
      let updateObj = {
        name: inputs.name,
        email: inputs.email,
        pwd: inputs.pwd,
        phone: inputs.phone,
        vatNumber: inputs.vatNumber,
        adln1: inputs.adln1,
        adln2: inputs.adln2,
        vat: inputs.vat,
        cnty: inputs.cnty,
        cntyname: this.data.getCountry,
        state: inputs.state,
        statename: this.data.getState,
        settlementType: inputs.settlementType,
        rate: inputs.rate,
        city: inputs.city,
        cityname: this.data.getCity,
        scIds: inputs.scIds,
        _id: this.selectedid,
        oldScIds: inputs.oldScIds
      }
      this.service.updateCompany(updateObj)
        .then(res => {
          this.toastr.showtoast("success", res.message);
          this.goBack();
        })
        .catch(res => {
          this.toastr.showtoast("error", res.error.message);
        })
    }
  }

  deleteRecord(inputs) {
    this.service.deleteCompany(this.selectedid)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.goBack();
      })
      .catch(res => {
        this.toastr.showtoast("error", res.error.message);
      })
  }

}
