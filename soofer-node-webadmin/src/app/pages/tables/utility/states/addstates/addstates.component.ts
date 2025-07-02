import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../common/common.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { TableService } from '../../../table.service';
import { ButtonToasterService } from '../../../../buttontoaster/buttontoaster.service';
import { UtilityService } from '../../utility.service';
import { Router } from '@angular/router';

interface countriesDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: 'addstates',
  templateUrl: './addstates.component.html',
  styles: [`
  .required::after{
    content:" *";
    color:red
  }
  `]
})

export class AddstatesComponent implements OnInit {
  spinner: boolean = true;
  list: any = {}
  userId: Number;
  countries: Array<countriesDataList>;

  constructor(private commonsrv: CommonService,
    private toastr: ButtonToasterService,
    private Service: UtilityService,
    private router: Router) {
    this.commonsrv.getCountries()
      .then(msg => {
        this.countries = msg[0]['countries']
      });
    this.userId = parseInt(localStorage.getItem('userId'));
    this.commonsrv.doAddFormControlNgSelectClass();
  }

  ngOnInit() { }

  // COUNTRIES

  selectedCountry(option: countriesDataList) {
    this.list.name = '';
    this.showStateTextBox();
  }

  deSelectedCountry(option: countriesDataList) {
    this.list.countryId = "";
    this.list.name = '';
    this.showStateTextBox();
  }

  showStateTextBox() {
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

  AddNewDoc(inputs) {
    this.spinner = false;
    let data = {
      name: inputs.name,
      country_id: inputs.countryId,
      userId: this.userId
    }
    // console.log(data)
    this.Service.addStates(data)
      .then(msg => {
        this.toastr.showtoast("success", msg.message);
        this.spinner = true;
        this.router.navigate(['/pages/tables/utility/states/viewstates']);
      })
      .catch(error => {
        this.toastr.showtoast("error", error.message);
        this.spinner = true;
      })
  }

}
