import { Component } from '@angular/core'
import { CommonService } from '../../../../common/common.service';
import { UtilityService } from '../../utility.service';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { Router } from '@angular/router';

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
  selector: 'ngx-smart-table',
  templateUrl: './addcities.component.html',
  styles: [`
    .required::after{
      content:" *";
      color:red
    }
    `]
})
export class AddCitiesComponent {
  list: any;
  spinner: boolean = true;
  userId: any;
  countries: Array<countriesDataList>;
  states: Array<statesDataList>;

  constructor(private commonservice: CommonService,
    private service: UtilityService,
    private toastr: ButtonToasterService,
    private router: Router) {
    this.commonservice.getCountries()
      .then(msg => {
        this.countries = msg[0]['countries']
      });
    this.userId = parseInt(localStorage.getItem('userId'));
    this.list = {};
    this.commonservice.doAddFormControlNgSelectClass();
  }

  getStateofSelectedCountry(id) {
    this.commonservice.GetStateofSelectedCountry(id)
      .then(response => {
        try {
          this.states = response[0]['states']
        } catch (e) {
          this.toastr.showtoast("error", e.toString());
        }
      }).catch(response => {
        let errorMessage = "Something went wrong.";
        errorMessage = this.commonservice.doCatchExceptionalErrorsForGivingErrorNotice(errorMessage, response);
        this.toastr.showtoast("error", errorMessage.toString());
      });
  }

  selectedCountry(option: countriesDataList) {
    this.list.stateId = '';
    this.list.name = '';
    this.getStateofSelectedCountry(option.id)
    this.showStateDropDown();
    this.commonservice.doAddFormControlNgSelectClass();
  }

  deSelectedCountry(option: countriesDataList) {
    this.list.countryId = "";
    this.list.stateId = "";
    this.list.name = "";
    this.showStateDropDown();
  }

  showStateDropDown() {
    if (
      typeof this.list.countryId !== "undefined"
      && this.list.countryId !== ""
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  // STATES

  selectedState(option: statesDataList) {
    this.showCityDropDown()
    this.list.name = "";
    this.commonservice.doAddFormControlNgSelectClass();
  }

  deSelectedState(option: statesDataList) {
    this.list.stateId = "";
    this.list.name = "";
    this.showCityDropDown()
  }

  showCityDropDown() {
    if (
      typeof this.list.countryId !== "undefined"
      && this.list.countryId !== ""
      && (
        typeof this.list.stateId !== "undefined"
        && this.list.stateId !== "")
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  AddNewDoc(inputs) {
    let data = {
      name: inputs.name,
      state_id: inputs.stateId,
      userId: this.userId
    }
    this.service.Addcities(data)
      .then(res => {
        this.toastr.showtoast("success", res.message);
        this.router.navigate(['/pages/tables/utility/cities/viewcities']);
      })
      .catch(err => {
        this.toastr.showtoast("error", err.message);
      })
  }
}
