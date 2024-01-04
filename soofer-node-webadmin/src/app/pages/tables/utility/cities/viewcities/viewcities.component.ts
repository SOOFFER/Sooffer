import { Component, OnInit } from '@angular/core';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { Http } from '@angular/http';
import { CommonService } from '../../../../common/common.service';
import { UtilityService } from '../../utility.service';
import { AppSettings } from '../../../../../app.config';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
interface countriesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

interface statesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'viewcities',
  templateUrl: './viewcities.component.html',
  styles: [``]
})

export class ViewcitiesComponent implements OnInit {
  settings = {
    actions: {
      edit: false, //as an example
      delete: false, //as an example
      add: false, //as an example
      custom: [
        { name: 'routeToAPage', title: `<i class="nb-edit"></i>` },
        // { name: 'routeToDelete', title: `<i class="nb-trash"></i>` }
      ]
    },
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      name: {
        title: 'City Name',
      },
      status: {
        title: 'Status',
        valuePrepareFunction: (status) => {
          if (status == true) return 'Active';
          else return 'Inactive';
        }
      }
    },
  };

  source: any;
  userId: Number;
  countries: Array<countriesDataList>;
  states: Array<statesDataList>;
  initial: any = 'list';
  lists: any = {};
  selectedid: string;
  selectedDocs: any;
  spinner: boolean = true;

  countryId: any;
  stateId: any;

  constructor(private _http: HttpClient, private toastr: ButtonToasterService, private http: Http, private Service: UtilityService, private commonservice: CommonService) {
    this.source = new ServerDataSource(_http, { endPoint: AppSettings.API_ENDPOINT + 'citiesForAdminUiCRUD' });
    this.userId = parseInt(localStorage.getItem('userId'));
    this.lists.countryId = '';
    this.lists.stateId = '';
  }

  getSource(id) {
    this.source = new ServerDataSource(this._http, { endPoint: AppSettings.API_ENDPOINT + 'citiesForAdminUiCRUD/' + id });
  }

  getstatesval(val) {
    const id = val.stateId;
    this.getSource(id);
  }

  ngOnInit() {
    this.getCountry();
    this.selectedDocs = {};
  }

  route(event) {
    this.SetDocsDetails(event.data);
    this.initial = '';
  }

  SetDocsDetails(data: any): void {
    if (!data) { return; }
    this.selectedid = data.id;
    this.selectedDocs = data;
    // console.log(this.selectedDocs);
    this.selectedDocs.countryId = (data.country_id) ? data.country_id : this.countryId;
    // console.log(this.countryId);
    // console.log(this.selectedDocs.countryId);
    this.selectedDocs.stateId = data.state_id;
    this.getCountry();
    this.commonservice.doAddFormControlNgSelectClass();
    this.getStateofSelectedCountry(this.selectedDocs.countryId);
  }

  getCountry() {
    this.commonservice.getCountries()
      .then(response => {
        try {
          this.countries = response[0]['countries'];
        } catch (e) {
          this.toastr.showtoast('error', e.toString());
        }
      }).catch(response => {
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
        let errorMessage = 'Something went wrong.';
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast('error', errorMessage.toString());
      });
  }

  selectedCountry(option: countriesDataList) {
    this.getStateofSelectedCountry(option.id);
    this.selectedDocs.stateId = '';
    this.selectedDocs.name = '';
    this.countryId = option.id;
    this.showStateDropDown();
    this.commonservice.doAddFormControlNgSelectClass();
  }

  deSelectedCountry(option: countriesDataList) {
    this.selectedDocs.countryId = '';
    this.selectedDocs.stateId = '';
    this.selectedDocs.name = '';
    this.countryId = '';
    this.showStateDropDown();
  }

  showStateDropDown() {
    if (
      typeof this.selectedDocs.countryId !== 'undefined'
      && this.selectedDocs.countryId !== ''
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  // STATES

  selectedState(option: statesDataList) {
    this.showCityDropDown();
    this.selectedDocs.name = '';
    this.commonservice.doAddFormControlNgSelectClass();
  }

  deSelectedState(option: statesDataList) {
    this.selectedDocs.stateId = '';
    this.selectedDocs.name = '';
    this.showCityDropDown();
  }

  showCityDropDown() {
    if (
      typeof this.selectedDocs.countryId !== 'undefined'
      && this.selectedDocs.countryId !== ''
      && (typeof this.selectedDocs.stateId !== 'undefined'
        && this.selectedDocs.stateId !== '')
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  goback() {
    this.initial = 'list';
  }

  UpdateNewDoc(inputs: any): void {
    if (!inputs) { return; }
    this.spinner = false;

    const obj = {
      name: inputs.name,
      country_id: inputs.countryId,
      state_id: inputs.stateId,
      status: inputs.status,
      userId: this.userId,
      id: this.selectedid
    };
    this.Service.updatecities(obj)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.spinner = true;
        this.initial = 'list';
      })
      .catch(error => {
        this.toastr.showtoast('error', error.message);
        this.spinner = true;
      });
  }

  DeleteDoc(data: any): void {
    this.spinner = false;
    this.Service.deletecities(data)
      .then(res => {
        this.toastr.showtoast('success', res.message);
        this.spinner = true;
        this.initial = 'list';
      })
      .catch(error => {
        this.toastr.showtoast('error', error.message);
        this.spinner = true;
      });
  }

}
