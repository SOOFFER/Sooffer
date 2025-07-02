import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../trippackage.service';
import { CommonService } from '../../common/common.service';
import { ButtonToasterService } from '../../buttontoaster/buttontoaster.service';
import { inputValidation, featuresSettings, dropdown } from '../../../app.config';
import { formatDate } from '@angular/common';

interface CommonInter {
  value: string;
  label: string;
  _id: string;
  currency: string;
}

interface commonDataList {
  value: string;
  label: string;
  id: string;
  name: string;
}

@Component({
  selector: "nfx-forms-inputs",
  styleUrls: ['./outstation.component.scss'],
  templateUrl: './outstation.component.html',
})
export class OutstationComponent implements OnInit {
  list: any = {};
  serviceCity: Array<CommonInter>;
  countries: Array<CommonInter>;
  cities: Array<commonDataList>;
  validation = inputValidation;
  showservicecity = featuresSettings.isServiceAvailable;
  showCurr: boolean = false;
  servicecity = featuresSettings.isServiceAvailable;
  lengthservicecities: number;
  ngForm: FormData;
  dropdownSettings = dropdown.dropdownSettings;

  vehiclesList = [];
  listedVehiclesArray = [];
  roundTripVehicleList = [];

  constructor(
    private dataService: Service,
    private router: Router,
    private CommonSvc: CommonService,
    private toastr: ButtonToasterService
  ) {
    this.getVehicles('outstation');
    this.CommonSvc.getServiceAvailableCity().then(res => {
      this.cities = res;
      this.lengthservicecities = this.cities.length;
      this.cities = this.CommonSvc.convertionOfServiceId(this.cities);
      this.cities = this.CommonSvc.dataforscids(this.cities);
      if (localStorage.getItem('userType') === 'citywiseadmin') {
        this.list.scIds = this.CommonSvc.dataforscids(this.cities);
      }
    });
  }

  getVehicles(type, data = 'Default') {
    this.dataService
      .getVehicleByType(type, data)
      .then(res => {
        this.vehiclesList = res['datas'];
        this.toastr.showtoast("success", res.message);
        console.log(this.vehiclesList);
        this.roundTripVehicleList = res['datas'];
        this.listedVehiclesArray = this.filterVehicles(res['datas']);

      })
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  filterVehicles(arr) {
    const res = arr.map(el => el.type);
    return res.join(', ');
  }
  checkVistingLocd(data) {
    return data
      .reduce(function (filtered, option) {
        if (option.fixedRateforRoundTrip) {
          const someNewValue = true;
          filtered.push(someNewValue);
        } else {
          const someNewValue = false;
          filtered.push(someNewValue);
        }
        return filtered.length > 0 ? filtered : [true];
      }, [])
      .every(x => x);
  }

  checkVistingLoc(data) {
    return data
      .reduce(function (filtered, option) {
        if (option.fixedRate) {
          const someNewValue = true;
          filtered.push(someNewValue);
        } else {
          const someNewValue = false;
          filtered.push(someNewValue);
        }
        return filtered.length > 0 ? filtered : [true];
      }, [])
      .every(x => x);
  }

  getVistingLocValue(data) {
    return data.reduce(function (filtered, option) {
      if (option.type) {
        const someNewValue = option.fixedRate;
        const type = option.type;
        filtered.push({ name: type, rate: someNewValue });
      }
      return filtered.length > 0 ? filtered : [];
    }, []);
  }

  getVistingLocValued(data) {
    return data.reduce(function (filtered, option) {
      if (option.type) {
        const someNewValue = option.fixedRateforRoundTrip;
        const type = option.type;
        filtered.push({ name: type, rate: someNewValue });
      }
      return filtered.length > 0 ? filtered : [];
    }, []);
  }

  onItemSelect(item: any) {
    console.log(item.name, 'item');
    this.getVehicles('outstation', item.name);
    // this.dispCurr(item);
    // let currentCur;
    // this.serviceCity.forEach(el => {
    //   if (el._id === item._id) {
    //     currentCur = el.currency;
    //   }
    // });
    // this.list.cur = currentCur;
  }

  onItemDeSelect(item: any) {
    this.dispCurr('');
  }

  dispCurr(data) {
    if (data.label === 'Default') {
      this.showCurr = true;
    } else {
      this.showCurr = false;
      this.list.curr = '';
    }
  }

  ngOnInit(): void {
    this.CommonSvc.getCountries()
      .then(msg => (this.countries = msg[0]['countries']))
      .catch(msg => {
        this.toastr.showtoast('error', msg.message);
      });
  }

  filedata: any;

  fileEvent(e) {
    this.filedata = e.target.files[0];
  }

  AddNewDoc(inputs: any): void {
    // console.log(this.roundTripVehicleList, 'roundTripVehicleList');
    // console.log(this.vehiclesList, 'this.vehiclesList');
    if (!inputs) {
      return;
    }
    if (
      (typeof inputs.scIds === 'undefined' || inputs.scIds === '') &&
      this.servicecity === true
    ) {
      this.toastr.showtoast('warn', 'Enter Service Available City');
    } else {
       inputs.oldscIds = inputs.scIds;
      if (this.servicecity === false) {
        inputs.scIds = this.cities;
      } else {
        inputs.scIds = this.CommonSvc.convertionOfServiceId(inputs.scIds);
      }
      inputs.scIds = JSON.stringify(inputs.scIds);
      inputs.jouneyType = inputs.jouneyType;

      inputs.fixedRate = JSON.stringify(
        this.getVistingLocValue(this.vehiclesList)
      );
      // inputs.fixedRateForRoundTrip = JSON.stringify(
      //   this.getVistingLocValued(this.roundTripVehicleList)
      // );
      this.dataService
        .AddOutstationPackage(inputs)
        .then(msg => {
          this.toastr.showtoast('success', msg.message);
          this.router.navigate(['/pages/tables/outstation-table']);
        })
        .catch(msg => {
           inputs.scIds = inputs.oldscIds;
          this.toastr.showtoast('error', msg.error.message);
        });
    }
  }
}
